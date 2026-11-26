const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const { paramId } = require('../lib/validate');
const P = require('../lib/plazosTienda');
const { guardarRespaldoMes } = require('../jobs/backup');

const router = express.Router();
router.use(requireAuth);
// Las copias contienen TODOS los datos de la empresa: solo el administrador (auditoría V10).
router.use(requireAdmin);
router.param('id', paramId);

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, size_bytes, fecha_creacion FROM backups WHERE tipo = 'general' AND empresa_id = $1 ORDER BY fecha_creacion DESC`,
    [req.user.empresa_id]
  );
  res.json(rows);
});

router.get('/:id/download', async (req, res) => {
  const { rows } = await pool.query(
    "SELECT data, nombre FROM backups WHERE id = $1 AND tipo = 'general' AND empresa_id = $2",
    [req.params.id, req.user.empresa_id]
  );
  const backup = rows[0];
  if (!backup) return res.status(404).json({ error: 'Copia no encontrada' });
  const nombreArchivo = (backup.nombre || 'backup').replace(/[^\w\-]+/g, '-');
  res.setHeader('Content-Disposition', `attachment; filename="up-${nombreArchivo}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(backup.data, null, 2));
});

// ---- Respaldos de tienda: uno por mes, se guardan 5 meses (mejoras/TIENDA.md #9) ----
// por_borrar: es el que se borra el día 1 del mes que viene y nadie lo ha descargado → aviso grande.
// vencido: ya pasó su fecha de borrado y nadie lo descargó → la app del admin se bloquea hasta bajarlo.
const COLUMNAS_TIENDA = `id, nombre, size_bytes, descargado, fecha_creacion, to_char(mes, 'YYYY-MM-DD') AS mes,
  (mes = ${P.MES_POR_BORRAR} AND NOT descargado) AS por_borrar,
  (mes < ${P.MES_POR_BORRAR} AND (NOT descargado OR desactualizado)) AS vencido,
  to_char((${P.MES_ACTUAL} + interval '1 month')::date, 'YYYY-MM-DD') AS se_borra`;

router.get('/tienda', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS_TIENDA} FROM backups_tienda WHERE empresa_id = $1 ORDER BY mes DESC, fecha_creacion DESC`,
    [req.user.empresa_id]
  );
  res.json(rows);
});

router.get('/tienda/avisos', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM (SELECT ${COLUMNAS_TIENDA} FROM backups_tienda WHERE empresa_id = $1) b
     WHERE por_borrar OR vencido ORDER BY mes ASC`,
    [req.user.empresa_id]
  );
  res.json({ vencidos: rows.filter(r => r.vencido), porBorrar: rows.filter(r => r.por_borrar) });
});

router.get('/tienda/pending', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre FROM backups_tienda WHERE empresa_id = $1 AND descargado = false ORDER BY mes ASC, fecha_creacion ASC LIMIT 1`,
    [req.user.empresa_id]
  );
  res.json(rows[0] || null);
});

router.post('/tienda/:id/mark-downloaded', async (req, res) => {
  await pool.query('UPDATE backups_tienda SET descargado = true WHERE id = $1 AND empresa_id = $2 AND NOT desactualizado', [req.params.id, req.user.empresa_id]);
  res.json({ ok: true });
});

// Descarga del respaldo de tienda. El archivo es el mismo JSON de siempre (empresa, mes, resumen y
// la lista de movimientos con sus fotos), pero se envía POR PARTES: de 20 en 20 movimientos, así el
// servidor nunca tiene todas las fotos del mes en memoria (mejoras/RENDIMIENTO.md #1).
// Solo cuenta como descargado si el archivo se envió completo y el respaldo no cambió mientras tanto.
const TRAMO_DESCARGA = 20;
// Igual que JSON.stringify(mov, null, 2) dentro de la lista (sangría de 4), sin copiar la foto otra vez.
function movimientoComoTexto(mov) {
  const lineas = Object.keys(mov).map(k => `      ${JSON.stringify(k)}: ${JSON.stringify(mov[k])}`);
  return `{\n${lineas.join(',\n')}\n    }`;
}
const COLUMNAS_MOV = `mov_id AS id, usuario_id, tipo, descripcion, monto, saldo_resultante, fecha, foto, empresa_id, clave_envio, usuario`;

router.get('/tienda/:id/download', async (req, res) => {
  const empresaId = req.user.empresa_id;
  const { rows: [b0] } = await pool.query(
    `SELECT to_char(mes, 'YYYY-MM-DD') AS mes, desactualizado FROM backups_tienda WHERE id = $1 AND empresa_id = $2`,
    [req.params.id, empresaId]
  );
  if (!b0) return res.status(404).json({ error: 'Copia no encontrada' });
  if (b0.desactualizado) await guardarRespaldoMes(empresaId, b0.mes); // se borró algo de ese mes: se rehace antes
  const { rows: [b] } = await pool.query(
    `SELECT nombre, en_partes, version, CASE WHEN en_partes THEN data ELSE NULL END AS encabezado
     FROM backups_tienda WHERE id = $1 AND empresa_id = $2`,
    [req.params.id, empresaId]
  );
  if (!b) return res.status(404).json({ error: 'Copia no encontrada' });
  const nombreArchivo = (b.nombre || 'tienda').replace(/[^\w\-]+/g, '-');
  res.setHeader('Content-Disposition', `attachment; filename="up-tienda-${nombreArchivo}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.on('finish', () => {
    pool.query('UPDATE backups_tienda SET descargado = true WHERE id = $1 AND empresa_id = $2 AND NOT desactualizado AND version = $3',
      [req.params.id, empresaId, b.version])
      .catch(e => console.error('Error marcando respaldo descargado:', e.message));
  });

  if (!b.en_partes) {
    // Respaldo viejo que todavía no se pudo convertir: se envía como antes, de una vez.
    const { rows: [v] } = await pool.query('SELECT data FROM backups_tienda WHERE id = $1 AND empresa_id = $2', [req.params.id, empresaId]);
    return res.send(JSON.stringify(v.data, null, 2));
  }

  // Mismo formato que JSON.stringify(respaldo, null, 2): se arma el encabezado con un marcador en el
  // lugar de la lista y cada movimiento se escribe con la sangría que le toca.
  const MARCA = '__MOVIMIENTOS__';
  const [inicio, fin] = JSON.stringify({ ...b.encabezado, movimientos: [MARCA] }, null, 2).split(`"${MARCA}"`);
  const cortado = () => res.destroyed || res.writableEnded;
  const escribir = (texto) => new Promise((ok) => {
    if (res.write(texto)) return ok();
    const seguir = () => { res.off('drain', seguir); res.off('close', seguir); ok(); };
    res.on('drain', seguir); res.on('close', seguir);
  });
  try {
    await escribir(inicio);
    let ultimo = 0, primero = true;
    for (;;) {
      if (cortado()) return; // el teléfono cerró la conexión: no se sigue leyendo
      const { rows } = await pool.query(
        `SELECT orden, ${COLUMNAS_MOV} FROM backups_tienda_movs WHERE backup_id = $1 AND orden > $2 ORDER BY orden LIMIT $3`,
        [req.params.id, ultimo, TRAMO_DESCARGA]
      );
      if (!rows.length) break;
      ultimo = rows[rows.length - 1].orden;
      // Uno por uno y sin copias extra de la foto (es lo que más pesa).
      for (let i = 0; i < rows.length; i++) {
        const { orden, ...mov } = rows[i];
        rows[i] = null; // se suelta en cuanto se envía
        await escribir((primero ? '' : ',\n    ') + movimientoComoTexto(mov));
        primero = false;
        if (cortado()) return;
      }
    }
    res.end(fin);
  } catch (e) {
    console.error('Error enviando respaldo de tienda:', e.message);
    res.destroy(e); // corta la descarga: el archivo incompleto no cuenta como descargado
  }
});

module.exports = router;
