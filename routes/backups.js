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
  res.setHeader('Content-Disposition', `attachment; filename="kaab-${nombreArchivo}.json"`);
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

router.get('/tienda/:id/download', async (req, res) => {
  const empresaId = req.user.empresa_id;
  const { rows: [b0] } = await pool.query(
    `SELECT to_char(mes, 'YYYY-MM-DD') AS mes, desactualizado FROM backups_tienda WHERE id = $1 AND empresa_id = $2`,
    [req.params.id, empresaId]
  );
  if (!b0) return res.status(404).json({ error: 'Copia no encontrada' });
  if (b0.desactualizado) await guardarRespaldoMes(empresaId, b0.mes); // se borró algo de ese mes: se rehace antes
  const { rows } = await pool.query(
    'SELECT data, nombre FROM backups_tienda WHERE id = $1 AND empresa_id = $2',
    [req.params.id, empresaId]
  );
  const backup = rows[0];
  if (!backup) return res.status(404).json({ error: 'Copia no encontrada' });
  const nombreArchivo = (backup.nombre || 'tienda').replace(/[^\w\-]+/g, '-');
  res.setHeader('Content-Disposition', `attachment; filename="kaab-tienda-${nombreArchivo}.json"`);
  res.setHeader('Content-Type', 'application/json');
  // Se marca como descargado solo cuando el archivo terminó de enviarse completo.
  res.on('finish', () => {
    pool.query('UPDATE backups_tienda SET descargado = true WHERE id = $1 AND empresa_id = $2 AND NOT desactualizado', [req.params.id, empresaId])
      .catch(e => console.error('Error marcando respaldo descargado:', e.message));
  });
  res.send(JSON.stringify(backup.data, null, 2));
});

module.exports = router;
