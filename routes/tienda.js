const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { broadcast } = require('../lib/realtime');
const { sendPushToOthers } = require('../lib/push');

const router = express.Router();
router.use(requireAuth);

function clientIdOf(req) { return req.headers['x-client-id'] || null; }
function money(n) { return 'Q ' + Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

async function registrarHistorial(usuarioId, accion, detalle, extra = {}) {
  const { tipo = null, monto = null, referencia_id = null } = extra;
  await pool.query(
    `INSERT INTO historial_general (usuario_id, accion, tipo, detalle, monto, referencia_id) VALUES ($1,$2,$3,$4,$5,$6)`,
    [usuarioId, accion, tipo, detalle, monto, referencia_id]
  );
}

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT m.id, m.tipo, m.descripcion, m.monto, m.saldo_resultante, m.fecha, u.nombre AS usuario
     FROM movimientos_tienda m LEFT JOIN usuarios u ON u.id = m.usuario_id
     ORDER BY m.fecha ASC, m.id ASC`
  );
  const balance = rows.length ? Number(rows[rows.length - 1].saldo_resultante) : 0;
  res.json({ balance, movimientos: rows });
});

router.post('/', async (req, res) => {
  const { tipo, descripcion, monto } = req.body || {};
  if (!['entrada', 'salida'].includes(tipo)) return res.status(400).json({ error: 'Tipo inválido' });
  const montoNum = Math.abs(Number(monto));
  if (!montoNum || montoNum <= 0) return res.status(400).json({ error: 'Monto inválido' });
  const montoFinal = tipo === 'entrada' ? montoNum : -montoNum;

  const { rows: last } = await pool.query(
    `SELECT saldo_resultante FROM movimientos_tienda ORDER BY fecha DESC, id DESC LIMIT 1`
  );
  const saldoAnterior = last[0] ? Number(last[0].saldo_resultante) : 0;
  const saldoResultante = saldoAnterior + montoFinal;

  const { rows } = await pool.query(
    `INSERT INTO movimientos_tienda (usuario_id, tipo, descripcion, monto, saldo_resultante)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, tipo, descripcion, monto, saldo_resultante, fecha`,
    [req.user.id, tipo, (descripcion || '').trim(), montoFinal, saldoResultante]
  );
  const mov = { ...rows[0], usuario: req.user.nombre };
  await registrarHistorial(
    req.user.id,
    tipo === 'entrada' ? 'Entrada' : 'Salida',
    `${tipo === 'entrada' ? 'Entrada' : 'Salida'} de tienda${mov.descripcion ? ': ' + mov.descripcion : ''}`,
    { tipo, monto: montoFinal }
  );
  broadcast({ scope: 'tienda', by: req.user.nombre, excludeClientId: clientIdOf(req) });
  sendPushToOthers({
    title: `${tipo === 'entrada' ? 'Entrada' : 'Salida'} de tienda`,
    body: `${req.user.nombre}: ${tipo === 'entrada' ? 'Entrada' : 'Salida'} de ${money(montoNum)}`,
    excludeClientId: clientIdOf(req),
  }).catch(e => console.error('Error enviando push:', e.message));
  res.json({ movimiento: mov, balance: saldoResultante });
});

router.delete('/:movId', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM movimientos_tienda WHERE id = $1`, [req.params.movId]);
    const { rows: restantes } = await client.query(
      `SELECT id, monto FROM movimientos_tienda ORDER BY fecha ASC, id ASC`
    );
    let running = 0;
    for (const m of restantes) {
      running += Number(m.monto);
      await client.query(`UPDATE movimientos_tienda SET saldo_resultante = $1 WHERE id = $2`, [running, m.id]);
    }
    await client.query('COMMIT');
    await registrarHistorial(req.user.id, 'Eliminar movimiento', 'Movimiento eliminado de tienda');
    broadcast({ scope: 'tienda', by: req.user.nombre, excludeClientId: clientIdOf(req) });
    res.json({ balance: running });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'Error al eliminar el movimiento' });
  } finally {
    client.release();
  }
});

module.exports = router;
