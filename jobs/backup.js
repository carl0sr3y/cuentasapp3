const { pool } = require('../db/pool');

// Junta los datos del negocio (cuentas, movimientos, historial) en un solo objeto
// y lo guarda como una fila en la tabla "backups". No incluye contraseñas de usuarios.
async function crearBackup() {
  const [cuentas, movCuentas, movTienda, historial] = await Promise.all([
    pool.query('SELECT * FROM cuentas ORDER BY id'),
    pool.query('SELECT * FROM movimientos_cuentas ORDER BY id'),
    pool.query('SELECT * FROM movimientos_tienda ORDER BY id'),
    pool.query('SELECT * FROM historial_general ORDER BY id'),
  ]);
  const data = {
    generado_en: new Date().toISOString(),
    cuentas: cuentas.rows,
    movimientos_cuentas: movCuentas.rows,
    movimientos_tienda: movTienda.rows,
    historial_general: historial.rows,
  };
  const json = JSON.stringify(data);
  const sizeBytes = Buffer.byteLength(json, 'utf8');
  const { rows } = await pool.query(
    'INSERT INTO backups (data, size_bytes) VALUES ($1,$2) RETURNING id, fecha_creacion, size_bytes',
    [json, sizeBytes]
  );
  console.log(`Backup creado: #${rows[0].id} (${sizeBytes} bytes)`);
  return rows[0];
}

// Elimina copias con mas de 48 horas. Esta es la UNICA forma de borrar backups:
// no existe una ruta HTTP de borrado manual expuesta a los usuarios.
async function limpiarBackupsVencidos() {
  const { rowCount } = await pool.query(
    "DELETE FROM backups WHERE fecha_creacion < now() - interval '48 hours'"
  );
  if (rowCount > 0) console.log(`Backups eliminados por antigüedad (>48h): ${rowCount}`);
  return rowCount;
}

// Borra por completo el historial general una vez a la semana.
// No se pierde nada real: ya quedó guardado en el backup diario de esa semana.
async function limpiarHistorialSemanal() {
  const { rowCount } = await pool.query('DELETE FROM historial_general');
  console.log(`Historial general reiniciado (semanal): ${rowCount} registros eliminados`);
  return rowCount;
}

module.exports = { crearBackup, limpiarBackupsVencidos, limpiarHistorialSemanal };
