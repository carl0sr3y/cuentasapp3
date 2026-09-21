const { pool } = require('../db/pool');

function fmtDia(d) { return String(d.getDate()).padStart(2, '0'); }
function fmtMes(d) { return String(d.getMonth() + 1).padStart(2, '0'); }

async function listaEmpresas() {
  const { rows } = await pool.query('SELECT id, nombre FROM empresas ORDER BY id');
  return rows;
}

// ============================================================
// HISTORIAL GENERAL: ventana móvil de 7 días (se revisa a diario, por empresa)
// ============================================================
async function limpiarHistorialRodante() {
  const { rowCount } = await pool.query("DELETE FROM historial_general WHERE fecha < now() - interval '7 days'");
  if (rowCount > 0) console.log(`Historial general: ${rowCount} registros de hace más de 7 días eliminados (todas las empresas)`);
  return rowCount;
}

// ============================================================
// BACKUP GENERAL: semanal (lunes a domingo), guarda las últimas 4 semanas.
// Se genera un backup POR CADA empresa.
// ============================================================
async function crearBackupGeneral() {
  const hoy = new Date();
  const inicioSemana = new Date(hoy); inicioSemana.setDate(hoy.getDate() - 7);
  const finSemana = new Date(hoy); finSemana.setDate(hoy.getDate() - 1);
  const nombre = `Semana del ${fmtDia(inicioSemana)} - ${fmtDia(finSemana)}/${fmtMes(finSemana)}/${finSemana.getFullYear()}`;

  const empresas = await listaEmpresas();
  for (const empresa of empresas) {
    const [cuentas, movCuentas, historial] = await Promise.all([
      pool.query('SELECT * FROM cuentas WHERE empresa_id = $1 ORDER BY id', [empresa.id]),
      pool.query(
        `SELECT m.* FROM movimientos_cuentas m JOIN cuentas c ON c.id = m.cuenta_id WHERE c.empresa_id = $1 ORDER BY m.id`,
        [empresa.id]
      ),
      pool.query('SELECT * FROM historial_general WHERE empresa_id = $1 ORDER BY id', [empresa.id]),
    ]);
    const data = {
      generado_en: new Date().toISOString(),
      empresa: empresa.nombre,
      periodo: { inicio: inicioSemana.toISOString(), fin: finSemana.toISOString() },
      cuentas: cuentas.rows,
      movimientos_cuentas: movCuentas.rows,
      historial_general: historial.rows,
    };
    const json = JSON.stringify(data);
    const sizeBytes = Buffer.byteLength(json, 'utf8');

    await pool.query(
      `INSERT INTO backups (empresa_id, data, size_bytes, tipo, nombre) VALUES ($1,$2,$3,'general',$4)`,
      [empresa.id, json, sizeBytes, nombre]
    );
    await pool.query(`
      DELETE FROM backups WHERE tipo = 'general' AND empresa_id = $1 AND id NOT IN (
        SELECT id FROM backups WHERE tipo = 'general' AND empresa_id = $1 ORDER BY fecha_creacion DESC LIMIT 4
      )
    `, [empresa.id]);
  }
  console.log(`Backup general creado para ${empresas.length} empresa(s): "${nombre}"`);
}

// ============================================================
// BACKUP DE TIENDA: mensual, con fotos y resumen, guarda 2 meses. Por empresa.
// ============================================================
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

async function crearBackupTienda() {
  const hoy = new Date();
  const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const nombreMes = `${MESES[inicioMesAnterior.getMonth()]} ${inicioMesAnterior.getFullYear()}`;

  const empresas = await listaEmpresas();
  for (const empresa of empresas) {
    const { rows: movs } = await pool.query(
      `SELECT m.*, u.nombre AS usuario FROM movimientos_tienda m
       LEFT JOIN usuarios u ON u.id = m.usuario_id
       WHERE m.empresa_id = $1 AND m.fecha >= $2 AND m.fecha < $3 ORDER BY m.fecha ASC`,
      [empresa.id, inicioMesAnterior, inicioMesActual]
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
    const data = { generado_en: new Date().toISOString(), empresa: empresa.nombre, mes: nombreMes, resumen, movimientos: movs };
    const json = JSON.stringify(data);
    const sizeBytes = Buffer.byteLength(json, 'utf8');

    await pool.query(
      `INSERT INTO backups_tienda (empresa_id, nombre, data, size_bytes) VALUES ($1,$2,$3,$4)`,
      [empresa.id, nombreMes, json, sizeBytes]
    );
    await pool.query(
      `DELETE FROM movimientos_tienda WHERE empresa_id = $1 AND fecha >= $2 AND fecha < $3`,
      [empresa.id, inicioMesAnterior, inicioMesActual]
    );
    await pool.query(`
      DELETE FROM backups_tienda WHERE empresa_id = $1 AND id NOT IN (
        SELECT id FROM backups_tienda WHERE empresa_id = $1 ORDER BY fecha_creacion DESC LIMIT 2
      )
    `, [empresa.id]);
  }
  console.log(`Backup de tienda creado para ${empresas.length} empresa(s): "${nombreMes}"`);
}

module.exports = { limpiarHistorialRodante, crearBackupGeneral, crearBackupTienda };
