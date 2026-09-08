const { pool } = require('../db/pool');

function fmtDia(d) { return String(d.getDate()).padStart(2, '0'); }
function fmtMes(d) { return String(d.getMonth() + 1).padStart(2, '0'); }

// ============================================================
// HISTORIAL GENERAL: ventana móvil de 7 días (se revisa a diario)
// ============================================================
async function limpiarHistorialRodante() {
  const { rowCount } = await pool.query("DELETE FROM historial_general WHERE fecha < now() - interval '7 days'");
  if (rowCount > 0) console.log(`Historial general: ${rowCount} registros de hace más de 7 días eliminados`);
  return rowCount;
}

// ============================================================
// BACKUP GENERAL: semanal (lunes a domingo), guarda las últimas 4 semanas
// Cubre: cuentas, movimientos_cuentas, historial_general
// ============================================================
async function crearBackupGeneral() {
  // La semana que se acaba de cerrar: de hace 7 días (lunes) a ayer (domingo)
  const hoy = new Date();
  const inicioSemana = new Date(hoy); inicioSemana.setDate(hoy.getDate() - 7);
  const finSemana = new Date(hoy); finSemana.setDate(hoy.getDate() - 1);

  const [cuentas, movCuentas, historial] = await Promise.all([
    pool.query('SELECT * FROM cuentas ORDER BY id'),
    pool.query('SELECT * FROM movimientos_cuentas ORDER BY id'),
    pool.query('SELECT * FROM historial_general ORDER BY id'),
  ]);
  const data = {
    generado_en: new Date().toISOString(),
    periodo: { inicio: inicioSemana.toISOString(), fin: finSemana.toISOString() },
    cuentas: cuentas.rows,
    movimientos_cuentas: movCuentas.rows,
    historial_general: historial.rows,
  };
  const json = JSON.stringify(data);
  const sizeBytes = Buffer.byteLength(json, 'utf8');
  const nombre = `Semana del ${fmtDia(inicioSemana)} - ${fmtDia(finSemana)}/${fmtMes(finSemana)}/${finSemana.getFullYear()}`;

  const { rows } = await pool.query(
    `INSERT INTO backups (data, size_bytes, tipo, nombre) VALUES ($1,$2,'general',$3) RETURNING id, fecha_creacion, size_bytes, nombre`,
    [json, sizeBytes, nombre]
  );
  console.log(`Backup general creado: "${nombre}" (${sizeBytes} bytes)`);

  // Conserva solo las 4 más recientes de tipo 'general'
  await pool.query(`
    DELETE FROM backups WHERE tipo = 'general' AND id NOT IN (
      SELECT id FROM backups WHERE tipo = 'general' ORDER BY fecha_creacion DESC LIMIT 4
    )
  `);
  return rows[0];
}

// ============================================================
// BACKUP DE TIENDA: mensual, con fotos y resumen, guarda 2 meses.
// Archiva el MES ANTERIOR completo y luego borra esos movimientos ya
// respaldados (los movimientos de tienda en vivo solo cubren el mes actual).
// ============================================================
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

async function crearBackupTienda() {
  const hoy = new Date();
  // Primer día del mes anterior y primer día del mes actual (límite exclusivo)
  const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const { rows: movs } = await pool.query(
    `SELECT m.*, u.nombre AS usuario FROM movimientos_tienda m
     LEFT JOIN usuarios u ON u.id = m.usuario_id
     WHERE m.fecha >= $1 AND m.fecha < $2 ORDER BY m.fecha ASC`,
    [inicioMesAnterior, inicioMesActual]
  );

  const totalEntradas = movs.filter(m => m.tipo === 'entrada').reduce((s, m) => s + Number(m.monto), 0);
  const totalSalidas = movs.filter(m => m.tipo === 'salida').reduce((s, m) => s + Math.abs(Number(m.monto)), 0);
  const resumen = {
    total_movimientos: movs.length,
    total_entradas: totalEntradas,
    total_salidas: totalSalidas,
    balance_neto: totalEntradas - totalSalidas,
    facturas_adjuntas: movs.filter(m => m.foto).length,
  };
  const nombre = `${MESES[inicioMesAnterior.getMonth()]} ${inicioMesAnterior.getFullYear()}`;
  const data = { generado_en: new Date().toISOString(), mes: nombre, resumen, movimientos: movs };
  const json = JSON.stringify(data);
  const sizeBytes = Buffer.byteLength(json, 'utf8');

  const { rows } = await pool.query(
    `INSERT INTO backups_tienda (nombre, data, size_bytes) VALUES ($1,$2,$3) RETURNING id, fecha_creacion, nombre`,
    [nombre, json, sizeBytes]
  );
  console.log(`Backup de tienda creado: "${nombre}" (${movs.length} movimientos, ${sizeBytes} bytes)`);

  // Ya quedó respaldado: se borran esos movimientos en vivo (el mes anterior completo)
  const { rowCount } = await pool.query(
    'DELETE FROM movimientos_tienda WHERE fecha >= $1 AND fecha < $2',
    [inicioMesAnterior, inicioMesActual]
  );
  console.log(`Movimientos de tienda archivados y eliminados de la tabla en vivo: ${rowCount}`);

  // Conserva solo los últimos 2 meses de backup de tienda
  await pool.query(`
    DELETE FROM backups_tienda WHERE id NOT IN (
      SELECT id FROM backups_tienda ORDER BY fecha_creacion DESC LIMIT 2
    )
  `);
  return rows[0];
}

module.exports = { limpiarHistorialRodante, crearBackupGeneral, crearBackupTienda };
