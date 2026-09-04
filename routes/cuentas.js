const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { broadcast } = require('../lib/realtime');

const router = express.Router();
router.use(requireAuth);

function clientIdOf(req) { return req.headers['x-client-id'] || null; }

async function registrarHistorial(usuarioId, accion, detalle, extra = {}) {
  const { tipo = null, monto = null, referencia_id = null } = extra;
  await pool.query(
    `INSERT INTO historial_general (usuario_id, accion, tipo, detalle, monto, referencia_id) VALUES ($1,$2,$3,$4,$5,$6)`,
    [usuarioId, accion, tipo, detalle, monto, referencia_id]
  );
}

// Lista todas las cuentas (compartidas entre todos los administradores) con su balance actual
router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT c.id, c.nombre, c.favorito, c.fecha_creacion,
           COALESCE((
             SELECT m.saldo_resultante FROM movimientos_cuentas m
             WHERE m.cuenta_id = c.id ORDER BY m.fecha DESC, m.id DESC LIMIT 1
           ), 0) AS balance
    FROM cuentas c
    ORDER BY c.nombre ASC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { nombre } = req.body || {};
  if (!nombre || !nombre.trim()) return res.status(400).json({ error: 'El nombre es obligatorio' });
  const { rows } = await pool.query(
    `INSERT INTO cuentas (usuario_id, nombre) VALUES ($1,$2) RETURNING id, nombre, favorito, fecha_creacion`,
    [req.user.id, nombre.trim()]
  );
  const cuenta = { ...rows[0], balance: 0 };
  await registrarHistorial(req.user.id, 'Crear cuenta', `Cuenta "${cuenta.nombre}" creada`, { referencia_id: cuenta.id });
  broadcast({ scope: 'cuentas', by: req.user.nombre, excludeClientId: clientIdOf(req) });
  res.json(cuenta);
});

router.patch('/:id', async (req, res) => {
  const { favorito } = req.body || {};
  const { rows } = await pool.query(
    `UPDATE cuentas SET favorito = $1 WHERE id = $2 RETURNING id, nombre, favorito, fecha_creacion`,
    [!!favorito, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Cuenta no encontrada' });
  broadcast({ scope: 'cuentas', by: req.user.nombre, excludeClientId: clientIdOf(req) });
  res.json(rows[0]);
});

router.post('/delete', async (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids requerido' });
  const { rows: cuentas } = await pool.query(`SELECT id, nombre FROM cuentas WHERE id = ANY($1::int[])`, [ids]);
  await pool.query(`DELETE FROM cuentas WHERE id = ANY($1::int[])`, [ids]);
  for (const c of cuentas) {
    await registrarHistorial(req.user.id, 'Eliminar cuenta', `Cuenta "${c.nombre}" eliminada`, { referencia_id: c.id });
  }
  broadcast({ scope: 'cuentas', by: req.user.nombre, excludeClientId: clientIdOf(req) });
  res.json({ deleted: cuentas.length });
});

// Detalle de una cuenta con todos sus movimientos (orden cronológico), incluyendo quién registró cada uno
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, favorito, fecha_creacion FROM cuentas WHERE id = $1`,
    [req.params.id]
  );
  const cuenta = rows[0];
  if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });
  const { rows: movimientos } = await pool.query(
    `SELECT m.id, m.tipo, m.descripcion, m.monto, m.saldo_resultante, m.fecha, u.nombre AS usuario
     FROM movimientos_cuentas m LEFT JOIN usuarios u ON u.id = m.usuario_id
     WHERE m.cuenta_id = $1 ORDER BY m.fecha ASC, m.id ASC`,
    [cuenta.id]
  );
  const balance = movimientos.length ? Number(movimientos[movimientos.length - 1].saldo_resultante) : 0;
  res.json({ ...cuenta, balance, movimientos });
});

// Crear un abono o cargo en una cuenta
router.post('/:id/movimientos', async (req, res) => {
  const { tipo, descripcion, monto } = req.body || {};
  if (!['abono', 'cargo'].includes(tipo)) return res.status(400).json({ error: 'Tipo inválido' });
  const montoNum = Math.abs(Number(monto));
  if (!montoNum || montoNum <= 0) return res.status(400).json({ error: 'Monto inválido' });
  const montoFinal = tipo === 'abono' ? montoNum : -montoNum;

  const { rows: cuentaRows } = await pool.query(`SELECT nombre FROM cuentas WHERE id = $1`, [req.params.id]);
  if (!cuentaRows[0]) return res.status(404).json({ error: 'Cuenta no encontrada' });

  const { rows: last } = await pool.query(
    `SELECT saldo_resultante FROM movimientos_cuentas WHERE cuenta_id = $1 ORDER BY fecha DESC, id DESC LIMIT 1`,
    [req.params.id]
  );
  const saldoAnterior = last[0] ? Number(last[0].saldo_resultante) : 0;
  const saldoResultante = saldoAnterior + montoFinal;

  const { rows } = await pool.query(
    `INSERT INTO movimientos_cuentas (cuenta_id, usuario_id, tipo, descripcion, monto, saldo_resultante)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, tipo, descripcion, monto, saldo_resultante, fecha`,
    [req.params.id, req.user.id, tipo, (descripcion || '').trim(), montoFinal, saldoResultante]
  );
  const mov = { ...rows[0], usuario: req.user.nombre };
  const nombreCuenta = cuentaRows[0].nombre;
  await registrarHistorial(
    req.user.id,
    tipo === 'abono' ? 'Abono' : 'Cargo',
    `${tipo === 'abono' ? 'Abono' : 'Cargo'} en "${nombreCuenta}"${mov.descripcion ? ': ' + mov.descripcion : ''}`,
    { tipo, monto: montoFinal, referencia_id: Number(req.params.id) }
  );
  broadcast({ scope: 'cuenta', id: Number(req.params.id), by: req.user.nombre, excludeClientId: clientIdOf(req) });
  res.json({ movimiento: mov, balance: saldoResultante });
});

// Eliminar un movimiento y recalcular los saldos posteriores de esa cuenta
router.delete('/:cuentaId/movimientos/:movId', async (req, res) => {
  const { cuentaId, movId } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: cuentaRows } = await client.query(`SELECT id FROM cuentas WHERE id = $1`, [cuentaId]);
    if (!cuentaRows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Cuenta no encontrada' }); }

    await client.query(`DELETE FROM movimientos_cuentas WHERE id = $1 AND cuenta_id = $2`, [movId, cuentaId]);

    const { rows: restantes } = await client.query(
      `SELECT id, monto FROM movimientos_cuentas WHERE cuenta_id = $1 ORDER BY fecha ASC, id ASC`,
      [cuentaId]
    );
    let running = 0;
    for (const m of restantes) {
      running += Number(m.monto);
      await client.query(`UPDATE movimientos_cuentas SET saldo_resultante = $1 WHERE id = $2`, [running, m.id]);
    }
    await client.query('COMMIT');
    await registrarHistorial(req.user.id, 'Eliminar movimiento', 'Movimiento eliminado de cuenta', { referencia_id: Number(cuentaId) });
    broadcast({ scope: 'cuenta', id: Number(cuentaId), by: req.user.nombre, excludeClientId: clientIdOf(req) });
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
