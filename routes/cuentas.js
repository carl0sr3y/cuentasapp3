const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { broadcast } = require('../lib/realtime');
const { sendPushToOthers } = require('../lib/push');
const { texto, textoOpcional, idValido, montoValido, paramId, claveEnvio } = require('../lib/validate');
const { enTransaccion, bloquearCuenta, saldoCuenta, recalcularCuentas } = require('../lib/saldos');

const router = express.Router();
router.use(requireAuth);
router.param('id', paramId);
router.param('cuentaId', paramId);
router.param('movId', paramId);

// Para comparar nombres de cuentas: "Juan  Pérez " y "juan perez" cuentan como el mismo.
function nombreComparable(n) {
  return String(n || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}
function clientIdOf(req) { return req.headers['x-client-id'] || null; }
function money(n) { return 'Q ' + Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

async function registrarHistorial(empresaId, usuarioId, accion, detalle, extra = {}) {
  const { tipo = null, monto = null, referencia_id = null } = extra;
  await pool.query(
    `INSERT INTO historial_general (empresa_id, usuario_id, accion, tipo, detalle, monto, referencia_id) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [empresaId, usuarioId, accion, tipo, detalle, monto, referencia_id]
  );
}

router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT c.id, c.nombre, c.tipo, c.favorito, c.fecha_creacion,
           COALESCE((
             SELECT m.saldo_resultante FROM movimientos_cuentas m
             WHERE m.cuenta_id = c.id ORDER BY m.fecha DESC, m.id DESC LIMIT 1
           ), 0) AS balance,
           -- Última actividad: el movimiento más reciente o, si no tiene, la fecha en que se creó.
           COALESCE((SELECT MAX(m.fecha) FROM movimientos_cuentas m WHERE m.cuenta_id = c.id), c.fecha_creacion) AS ultima_actividad
    FROM cuentas c
    WHERE c.empresa_id = $1
    ORDER BY ultima_actividad DESC, c.nombre ASC
  `, [req.user.empresa_id]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const nombre = texto((req.body || {}).nombre, 120);
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio (máximo 120 caracteres)' });
  const tipoCuenta = (req.body || {}).tipo === undefined ? 'cobrar' : (req.body || {}).tipo;
  if (!['cobrar', 'pagar'].includes(tipoCuenta)) return res.status(400).json({ error: 'Tipo de cuenta inválido' });
  const clave = claveEnvio((req.body || {}).clave);
  if (clave === false) return res.status(400).json({ error: 'Datos inválidos' });
  // Dentro de una transacción con candado por empresa: dos personas creando "Juan" al mismo tiempo
  // no pueden colarse las dos.
  const r = await enTransaccion(pool, async (client) => {
    await client.query('SELECT pg_advisory_xact_lock(7311, $1)', [req.user.empresa_id]);
    if (clave) {
      // Este mismo envío ya se había guardado (reintento): se devuelve la cuenta creada la primera vez.
      const { rows: ya } = await client.query(
        `SELECT id, nombre, tipo, favorito, fecha_creacion FROM cuentas WHERE empresa_id = $1 AND clave_envio = $2`,
        [req.user.empresa_id, clave]);
      if (ya[0]) return { cuenta: ya[0], repetido: true };
    }
    // ¿Ya hay una cuenta del mismo tipo con ese nombre? (sin importar mayúsculas, acentos ni espacios)
    const buscado = nombreComparable(nombre);
    const { rows: mismas } = await client.query(
      `SELECT id, nombre, tipo, favorito, fecha_creacion FROM cuentas WHERE empresa_id = $1 AND tipo = $2 ORDER BY id`,
      [req.user.empresa_id, tipoCuenta]);
    const existente = mismas.find(c => nombreComparable(c.nombre) === buscado);
    if (existente) return { cuenta: existente, existente: true };
    const { rows } = await client.query(
      `INSERT INTO cuentas (empresa_id, usuario_id, nombre, tipo, clave_envio) VALUES ($1,$2,$3,$4,$5)
       RETURNING id, nombre, tipo, favorito, fecha_creacion`,
      [req.user.empresa_id, req.user.id, nombre, tipoCuenta, clave || null]);
    return { cuenta: rows[0] };
  });
  if (r.repetido || r.existente) {
    const { rows: [s] } = await pool.query('SELECT COALESCE(SUM(monto),0) AS s FROM movimientos_cuentas WHERE cuenta_id = $1', [r.cuenta.id]);
    return res.json({ ...r.cuenta, balance: Number(s.s), ...(r.repetido ? { repetido: true } : { existente: true }) });
  }
  const cuenta = { ...r.cuenta, balance: 0 };
  await registrarHistorial(req.user.empresa_id, req.user.id, 'Crear cuenta',
    `Cuenta "${cuenta.nombre}" creada (${tipoCuenta === 'pagar' ? 'por pagar' : 'por cobrar'})`, { referencia_id: cuenta.id });
  broadcast({ scope: 'cuentas', empresaId: req.user.empresa_id, by: req.user.nombre, excludeClientId: clientIdOf(req) });
  res.json(cuenta);
});

router.patch('/:id', async (req, res) => {
  const { favorito } = req.body || {};
  const { rows } = await pool.query(
    `UPDATE cuentas SET favorito = $1 WHERE id = $2 AND empresa_id = $3 RETURNING id, nombre, tipo, favorito, fecha_creacion`,
    [!!favorito, req.params.id, req.user.empresa_id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Cuenta no encontrada' });
  broadcast({ scope: 'cuentas', empresaId: req.user.empresa_id, by: req.user.nombre, excludeClientId: clientIdOf(req) });
  res.json(rows[0]);
});

// Borrar cuentas completas (con todo su historial) es solo del administrador (auditoría V10).
router.post('/delete', requireAdmin, async (req, res) => {
  const idsCrudos = (req.body || {}).ids;
  if (!Array.isArray(idsCrudos) || idsCrudos.length === 0 || idsCrudos.length > 1000) return res.status(400).json({ error: 'ids requerido' });
  const ids = idsCrudos.map(idValido);
  if (ids.some(id => id === null)) return res.status(400).json({ error: 'Identificador inválido' });
  const { rows: cuentas } = await pool.query(
    `SELECT id, nombre FROM cuentas WHERE id = ANY($1::int[]) AND empresa_id = $2`,
    [ids, req.user.empresa_id]
  );
  await pool.query(`DELETE FROM cuentas WHERE id = ANY($1::int[]) AND empresa_id = $2`, [ids, req.user.empresa_id]);
  for (const c of cuentas) {
    await registrarHistorial(req.user.empresa_id, req.user.id, 'Eliminar cuenta', `Cuenta "${c.nombre}" eliminada`, { referencia_id: c.id });
  }
  broadcast({ scope: 'cuentas', empresaId: req.user.empresa_id, by: req.user.nombre, excludeClientId: clientIdOf(req) });
  res.json({ deleted: cuentas.length });
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, tipo, favorito, fecha_creacion FROM cuentas WHERE id = $1 AND empresa_id = $2`,
    [req.params.id, req.user.empresa_id]
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

router.post('/:id/movimientos', async (req, res) => {
  const { tipo, monto } = req.body || {};
  if (!['abono', 'cargo'].includes(tipo)) return res.status(400).json({ error: 'Tipo inválido' });
  const montoNum = montoValido(monto);
  if (montoNum === null) return res.status(400).json({ error: 'Monto inválido' });
  const descripcion = textoOpcional((req.body || {}).descripcion, 300);
  if (descripcion === null) return res.status(400).json({ error: 'Descripción inválida (máximo 300 caracteres)' });
  const montoFinal = tipo === 'abono' ? montoNum : -montoNum;
  const clave = claveEnvio((req.body || {}).clave);
  if (clave === false) return res.status(400).json({ error: 'Datos inválidos' });

  // Con la cuenta bloqueada: saldo = suma real + este movimiento. La fecha se toma DESPUÉS del
  // bloqueo (clock_timestamp) para que el orden por fecha coincida con el orden de registro.
  const resultado = await enTransaccion(pool, async (client) => {
    const cuenta = await bloquearCuenta(client, req.params.id, req.user.empresa_id);
    if (!cuenta) return null;
    if (clave) {
      // ¿Ya llegó este mismo envío? (con la cuenta bloqueada, dos envíos iguales no pueden cruzarse)
      const { rows: ya } = await client.query(
        `SELECT m.id, m.tipo, m.descripcion, m.monto, m.saldo_resultante, m.fecha, u.nombre AS usuario
         FROM movimientos_cuentas m LEFT JOIN usuarios u ON u.id = m.usuario_id
         WHERE m.cuenta_id = $1 AND m.clave_envio = $2`, [cuenta.id, clave]);
      if (ya[0]) return { cuenta, mov: ya[0], saldoResultante: await saldoCuenta(client, cuenta.id), repetido: true };
    }
    const saldo = (await saldoCuenta(client, cuenta.id)) + montoFinal;
    const { rows } = await client.query(
      `INSERT INTO movimientos_cuentas (cuenta_id, usuario_id, tipo, descripcion, monto, saldo_resultante, fecha, clave_envio)
       VALUES ($1,$2,$3,$4,$5,$6, clock_timestamp(), $7) RETURNING id, tipo, descripcion, monto, saldo_resultante, fecha`,
      [cuenta.id, req.user.id, tipo, descripcion, montoFinal, saldo, clave || null]
    );
    return { cuenta, mov: { ...rows[0], usuario: req.user.nombre }, saldoResultante: Number(rows[0].saldo_resultante) };
  });
  if (!resultado) return res.status(404).json({ error: 'Cuenta no encontrada' });
  const { mov, saldoResultante } = resultado;
  // Reintento de un envío ya guardado: se responde igual, sin repetir historial, avisos ni notificaciones.
  if (resultado.repetido) return res.json({ movimiento: mov, balance: saldoResultante, repetido: true });
  const nombreCuenta = resultado.cuenta.nombre;
  await registrarHistorial(
    req.user.empresa_id, req.user.id,
    tipo === 'abono' ? 'Abono' : 'Cargo',
    `${tipo === 'abono' ? 'Abono' : 'Cargo'} en "${nombreCuenta}"${mov.descripcion ? ': ' + mov.descripcion : ''}`,
    { tipo, monto: montoFinal, referencia_id: Number(req.params.id) }
  );
  broadcast({ scope: 'cuenta', id: Number(req.params.id), empresaId: req.user.empresa_id, by: req.user.nombre, excludeClientId: clientIdOf(req) });
  sendPushToOthers({
    title: `${tipo === 'abono' ? 'Abono' : 'Cargo'} registrado`,
    body: `${req.user.nombre}: ${tipo === 'abono' ? 'Abono' : 'Cargo'} de ${money(montoNum)} en "${nombreCuenta}"`,
    empresaId: req.user.empresa_id,
    excludeClientId: clientIdOf(req),
  }).catch(e => console.error('Error enviando push:', e.message));
  res.json({ movimiento: mov, balance: saldoResultante });
});

router.delete('/:cuentaId/movimientos/:movId', async (req, res) => {
  const { cuentaId, movId } = req.params;
  const balance = await enTransaccion(pool, async (client) => {
    const cuenta = await bloquearCuenta(client, cuentaId, req.user.empresa_id);
    if (!cuenta) return null;
    await client.query('DELETE FROM movimientos_cuentas WHERE id = $1 AND cuenta_id = $2', [movId, cuenta.id]);
    await recalcularCuentas(client, cuenta.id);
    return saldoCuenta(client, cuenta.id);
  });
  if (balance === null) return res.status(404).json({ error: 'Cuenta no encontrada' });
  await registrarHistorial(req.user.empresa_id, req.user.id, 'Eliminar movimiento', 'Movimiento eliminado de cuenta', { referencia_id: Number(cuentaId) });
  broadcast({ scope: 'cuenta', id: Number(cuentaId), empresaId: req.user.empresa_id, by: req.user.nombre, excludeClientId: clientIdOf(req) });
  res.json({ balance });
});

module.exports = router;
