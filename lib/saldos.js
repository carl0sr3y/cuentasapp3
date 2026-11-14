// Saldos de cuentas y de tienda (auditoría V6).
//
// Antes: se leía el último saldo y luego se insertaba el nuevo, sin bloqueo. Con dos personas
// registrando a la vez, ambas leían el mismo saldo y una suma se perdía.
// Ahora: cada alta/baja de movimiento corre en una transacción que primero BLOQUEA la cuenta
// (o la tienda de la empresa); quien llega segundo espera a que el primero termine.
// Además el saldo nuevo se calcula como SUMA real de los movimientos, no a partir del último.

// Llama a fn(client) dentro de BEGIN/COMMIT (ROLLBACK si falla) con una conexión propia.
async function enTransaccion(pool, fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const r = await fn(client);
    await client.query('COMMIT');
    return r;
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch (_) { /* conexión ya caída */ }
    throw e;
  } finally {
    client.release();
  }
}

// Bloquea la cuenta (si es de la empresa) hasta el fin de la transacción. Devuelve la fila o null.
// FOR NO KEY UPDATE: excluye a otros que quieran bloquearla, pero no frena inserts que solo la referencian.
async function bloquearCuenta(client, cuentaId, empresaId) {
  const { rows } = await client.query(
    'SELECT id, nombre FROM cuentas WHERE id = $1 AND empresa_id = $2 FOR NO KEY UPDATE',
    [cuentaId, empresaId]
  );
  return rows[0] || null;
}

// La tienda no tiene fila propia: se usa un candado de Postgres por empresa (se libera al terminar la transacción).
const CANDADO_TIENDA = 61001;
async function bloquearTienda(client, empresaId) {
  await client.query('SELECT pg_advisory_xact_lock($1, $2)', [CANDADO_TIENDA, empresaId]);
}

async function saldoCuenta(client, cuentaId) {
  const { rows } = await client.query('SELECT COALESCE(SUM(monto), 0) AS s FROM movimientos_cuentas WHERE cuenta_id = $1', [cuentaId]);
  return Number(rows[0].s);
}
async function saldoTienda(client, empresaId) {
  const { rows } = await client.query('SELECT COALESCE(SUM(monto), 0) AS s FROM movimientos_tienda WHERE empresa_id = $1', [empresaId]);
  return Number(rows[0].s);
}

// Recalcula saldo_resultante como suma acumulada en orden (fecha, id). Solo toca filas que estén mal.
// Sin filtro, repara TODAS las cuentas/tiendas (se usa al arrancar). Devuelve cuántas filas corrigió.
async function recalcularCuentas(db, cuentaId = null) {
  const r = await db.query(`
    UPDATE movimientos_cuentas m SET saldo_resultante = s.saldo
    FROM (
      SELECT id, SUM(monto) OVER (PARTITION BY cuenta_id ORDER BY fecha, id) AS saldo
      FROM movimientos_cuentas
      WHERE $1::int IS NULL OR cuenta_id = $1
    ) s
    WHERE m.id = s.id AND m.saldo_resultante IS DISTINCT FROM s.saldo`, [cuentaId]);
  return r.rowCount;
}
async function recalcularTienda(db, empresaId = null) {
  const r = await db.query(`
    UPDATE movimientos_tienda m SET saldo_resultante = s.saldo
    FROM (
      SELECT id, SUM(monto) OVER (PARTITION BY empresa_id ORDER BY fecha, id) AS saldo
      FROM movimientos_tienda
      WHERE $1::int IS NULL OR empresa_id = $1
    ) s
    WHERE m.id = s.id AND m.saldo_resultante IS DISTINCT FROM s.saldo`, [empresaId]);
  return r.rowCount;
}

module.exports = {
  enTransaccion, bloquearCuenta, bloquearTienda, saldoCuenta, saldoTienda, recalcularCuentas, recalcularTienda,
};
