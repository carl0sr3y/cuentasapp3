const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { broadcast } = require('../lib/realtime');
const { sendPushToOthers } = require('../lib/push');
const { textoOpcional, montoValido, paramId, claveEnvio } = require('../lib/validate');
const { validarFoto } = require('../lib/fotos');
const { enTransaccion, bloquearTienda, saldoTienda, recalcularTienda } = require('../lib/saldos');
const P = require('../lib/plazosTienda');
const { guardarRespaldoMes } = require('../jobs/backup');

const router = express.Router();
router.use(requireAuth);
router.param('movId', paramId);

function clientIdOf(req) { return req.headers['x-client-id'] || null; }
function money(n) { return 'Q ' + Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

async function registrarHistorial(empresaId, usuarioId, accion, detalle, extra = {}) {
  const { tipo = null, monto = null, referencia_id = null } = extra;
  await pool.query(
    `INSERT INTO historial_general (empresa_id, usuario_id, accion, tipo, detalle, monto, referencia_id) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [empresaId, usuarioId, accion, tipo, detalle, monto, referencia_id]
  );
}

// Se ven los movimientos desde el mismo día de hace 2 meses; "editable" dice si todavía se puede
// borrar (último mes). El saldo empieza de cero cada mes. Ver lib/plazosTienda.js.
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    // Sin la foto: solo si tiene una. Antes cada carga (y cada refresco en tiempo real de cada
    // dispositivo) descargaba TODAS las fotos del mes: megas de tráfico pagado (auditoría V8).
    `SELECT m.id, m.tipo, m.descripcion, m.monto, m.saldo_resultante, m.fecha, (m.foto IS NOT NULL) AS tiene_foto, u.nombre AS usuario,
            (${P.editable('m')}) AS editable
     FROM movimientos_tienda m LEFT JOIN usuarios u ON u.id = m.usuario_id
     WHERE m.empresa_id = $1 AND ${P.visible('m')}
     ORDER BY m.fecha ASC, m.id ASC`,
    [req.user.empresa_id]
  );
  const balance = await saldoTienda(pool, req.user.empresa_id);
  const { rows: hoyRows } = await pool.query(
    `SELECT COALESCE(SUM(monto),0) AS total FROM movimientos_tienda
     WHERE empresa_id = $1 AND (fecha AT TIME ZONE 'America/Guatemala')::date = (now() AT TIME ZONE 'America/Guatemala')::date`,
    [req.user.empresa_id]
  );
  const balanceHoy = Number(hoyRows[0].total);
  res.json({ balance, balanceHoy, movimientos: rows });
});

router.post('/', async (req, res) => {
  const { tipo, monto } = req.body || {};
  if (!['entrada', 'salida'].includes(tipo)) return res.status(400).json({ error: 'Tipo inválido' });
  const montoNum = montoValido(monto);
  if (montoNum === null) return res.status(400).json({ error: 'Monto inválido' });
  const descripcion = textoOpcional((req.body || {}).descripcion, 300);
  if (descripcion === null) return res.status(400).json({ error: 'Descripción inválida (máximo 300 caracteres)' });
  const { foto, error: errorFoto } = validarFoto((req.body || {}).foto);
  if (errorFoto) return res.status(400).json({ error: errorFoto });
  const montoFinal = tipo === 'entrada' ? montoNum : -montoNum;
  const empresaId = req.user.empresa_id;
  const clave = claveEnvio((req.body || {}).clave);
  if (clave === false) return res.status(400).json({ error: 'Datos inválidos' });

  // Con la tienda bloqueada: saldo = suma real + este movimiento. La fecha se toma DESPUÉS del
  // bloqueo (clock_timestamp) para que el orden por fecha coincida con el orden de registro.
  const { mov, saldoResultante, repetido } = await enTransaccion(pool, async (client) => {
    await bloquearTienda(client, empresaId);
    if (clave) {
      // ¿Ya llegó este mismo envío? (con la tienda bloqueada, dos envíos iguales no pueden cruzarse)
      const { rows: ya } = await client.query(
        `SELECT m.id, m.tipo, m.descripcion, m.monto, m.saldo_resultante, m.fecha, (m.foto IS NOT NULL) AS tiene_foto, u.nombre AS usuario
         FROM movimientos_tienda m LEFT JOIN usuarios u ON u.id = m.usuario_id
         WHERE m.empresa_id = $1 AND m.clave_envio = $2`, [empresaId, clave]);
      if (ya[0]) return { mov: ya[0], saldoResultante: await saldoTienda(client, empresaId), repetido: true };
    }
    const saldo = (await saldoTienda(client, empresaId)) + montoFinal;
    const { rows } = await client.query(
      `INSERT INTO movimientos_tienda (empresa_id, usuario_id, tipo, descripcion, monto, saldo_resultante, foto, fecha, clave_envio)
       VALUES ($1,$2,$3,$4,$5,$6,$7, clock_timestamp(), $8) RETURNING id, tipo, descripcion, monto, saldo_resultante, fecha, (foto IS NOT NULL) AS tiene_foto`,
      [empresaId, req.user.id, tipo, descripcion, montoFinal, saldo, foto, clave || null]
    );
    return { mov: { ...rows[0], usuario: req.user.nombre }, saldoResultante: Number(rows[0].saldo_resultante) };
  });
  // Reintento de un envío ya guardado: se responde igual, sin repetir historial, avisos ni notificaciones.
  if (repetido) return res.json({ movimiento: mov, balance: saldoResultante, repetido: true });

  await registrarHistorial(
    empresaId, req.user.id,
    tipo === 'entrada' ? 'Entrada' : 'Salida',
    `${tipo === 'entrada' ? 'Entrada' : 'Salida'} de tienda${mov.descripcion ? ': ' + mov.descripcion : ''}${foto ? ' (con factura)' : ''}`,
    { tipo, monto: montoFinal }
  );
  broadcast({ scope: 'tienda', empresaId, by: req.user.nombre, excludeClientId: clientIdOf(req) });
  sendPushToOthers({
    title: `${tipo === 'entrada' ? 'Entrada' : 'Salida'} de tienda`,
    body: `${req.user.nombre}: ${tipo === 'entrada' ? 'Entrada' : 'Salida'} de ${money(montoNum)}`,
    empresaId,
    excludeClientId: clientIdOf(req),
  }).catch(e => console.error('Error enviando push:', e.message));
  res.json({ movimiento: mov, balance: saldoResultante });
});

// La foto de un movimiento, solo cuando se pide (al abrirla o al generar el PDF).
router.get('/:movId/foto', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT foto FROM movimientos_tienda WHERE id = $1 AND empresa_id = $2 AND foto IS NOT NULL',
    [req.params.movId, req.user.empresa_id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Foto no encontrada' });
  res.set('Cache-Control', 'private, max-age=86400'); // la foto de un movimiento nunca cambia
  res.json({ foto: rows[0].foto });
});

// Solo se pueden borrar los movimientos del último mes (hoy 18 nov → desde el 19 oct), para todos.
// Si el movimiento es de un mes que ya tiene respaldo, el respaldo se rehace solo.
router.delete('/:movId', async (req, res) => {
  const empresaId = req.user.empresa_id;
  const r = await enTransaccion(pool, async (client) => {
    await bloquearTienda(client, empresaId);
    const { rows: [mov] } = await client.query(
      `SELECT id, (${P.editable('')}) AS editable, to_char(${P.mes('')}, 'YYYY-MM-DD') AS mes,
              ${P.mes('')} < ${P.MES_ACTUAL} AS mes_pasado
       FROM movimientos_tienda WHERE id = $1 AND empresa_id = $2`, [req.params.movId, empresaId]);
    if (!mov) return { status: 404, error: 'Este movimiento ya no existe' };
    if (!mov.editable) return { status: 403, error: 'Este movimiento tiene más de un mes: ya no se puede eliminar.' };
    await client.query('DELETE FROM movimientos_tienda WHERE id = $1 AND empresa_id = $2', [req.params.movId, empresaId]);
    await recalcularTienda(client, empresaId);
    let mesRespaldo = null;
    if (mov.mes_pasado) {
      const u = await client.query('UPDATE backups_tienda SET desactualizado = true WHERE empresa_id = $1 AND mes = $2::date', [empresaId, mov.mes]);
      if (u.rowCount) mesRespaldo = mov.mes;
    }
    return { balance: await saldoTienda(client, empresaId), mesRespaldo };
  });
  if (r.error) return res.status(r.status).json({ error: r.error });
  if (r.mesRespaldo) {
    // Si falla aquí, queda marcado y se rehace en la revisión de la noche o al descargarlo.
    guardarRespaldoMes(empresaId, r.mesRespaldo).catch(e => console.error('Error rehaciendo respaldo de tienda:', e.message));
  }
  await registrarHistorial(empresaId, req.user.id, 'Eliminar movimiento', 'Movimiento eliminado de tienda');
  broadcast({ scope: 'tienda', empresaId, by: req.user.nombre, excludeClientId: clientIdOf(req) });
  res.json({ balance: r.balance });
});

module.exports = router;
