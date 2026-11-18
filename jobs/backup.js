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
// RESPALDOS DE TIENDA: uno por mes y por empresa, con fotos y resumen (mejoras/TIENDA.md #9).
// - El día 1 a las 00:01 se crea el del mes que terminó. Esos movimientos SIGUEN en la pestaña
//   mientras estén dentro de los 2 meses que se ven; se quitan cuando el mes entero ya no se ve.
// - Si se borra un movimiento de un mes que ya tiene respaldo, el respaldo se rehace solo.
// - Se guardan 5 meses. El que cumple 6 se borra el día 1, pero SOLO si un admin ya lo descargó;
//   si no, se queda y la app del admin se bloquea hasta que lo descargue (routes/backups.js).
// Todo se revisa cada noche y al arrancar, así que si el servidor estaba apagado el día 1 no se pierde nada.
// ============================================================
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const P = require('../lib/plazosTienda');
const { enTransaccion, bloquearTienda } = require('../lib/saldos');

function nombreDeMes(mesIso) { // '2026-10-01' → 'Octubre 2026'
  const [a, m] = mesIso.split('-').map(Number);
  return `${MESES[m - 1]} ${a}`;
}

// Arma (o rehace) el respaldo de un mes con la tienda bloqueada: así nadie borra un movimiento
// mientras se arma y el respaldo queda exactamente igual a lo que hay en la base.
async function guardarRespaldoMes(empresaId, mesIso) {
  await enTransaccion(pool, async (client) => {
    await bloquearTienda(client, empresaId);
    const { rows: [empresa] } = await client.query('SELECT nombre FROM empresas WHERE id = $1', [empresaId]);
    if (!empresa) return;
    const { rows: movs } = await client.query(
      `SELECT m.*, u.nombre AS usuario FROM movimientos_tienda m
       LEFT JOIN usuarios u ON u.id = m.usuario_id
       WHERE m.empresa_id = $1 AND ${P.mes('m')} = $2::date ORDER BY m.fecha ASC, m.id ASC`,
      [empresaId, mesIso]
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
    const nombre = nombreDeMes(mesIso);
    const json = JSON.stringify({ generado_en: new Date().toISOString(), empresa: empresa.nombre, mes: nombre, resumen, movimientos: movs });
    const sizeBytes = Buffer.byteLength(json, 'utf8');
    // Si ya existía (se rehace por un borrado), se marca como no descargado: la copia que el admin
    // bajó antes ya no coincide.
    const { rowCount } = await client.query(
      `UPDATE backups_tienda SET data = $3, size_bytes = $4, nombre = $5, desactualizado = false, descargado = false
       WHERE empresa_id = $1 AND mes = $2::date`,
      [empresaId, mesIso, json, sizeBytes, nombre]
    );
    if (!rowCount) {
      await client.query(
        `INSERT INTO backups_tienda (empresa_id, nombre, data, size_bytes, mes) VALUES ($1,$2,$3,$4,$5::date)`,
        [empresaId, nombre, json, sizeBytes, mesIso]
      );
    }
  });
}

// Rehace los respaldos marcados como desactualizados (se borró un movimiento de ese mes).
async function rehacerDesactualizados(empresaId = null) {
  const { rows } = await pool.query(
    `SELECT empresa_id, to_char(mes, 'YYYY-MM-DD') AS mes FROM backups_tienda
     WHERE desactualizado AND ($1::int IS NULL OR empresa_id = $1)`, [empresaId]);
  for (const r of rows) await guardarRespaldoMes(r.empresa_id, r.mes);
  return rows.length;
}

async function asegurarRespaldosTienda() {
  // 1) Crear los que falten: meses ya terminados con movimientos en la base y sin respaldo.
  const { rows: faltan } = await pool.query(`
    SELECT DISTINCT m.empresa_id, to_char(${P.mes('m')}, 'YYYY-MM-DD') AS mes
    FROM movimientos_tienda m
    WHERE ${P.mes('m')} < ${P.MES_ACTUAL}
      AND NOT EXISTS (SELECT 1 FROM backups_tienda b WHERE b.empresa_id = m.empresa_id AND b.mes = ${P.mes('m')})
    ORDER BY 1, 2`);
  for (const f of faltan) await guardarRespaldoMes(f.empresa_id, f.mes);
  // 2) Rehacer los que quedaron desactualizados (por si falló al momento de borrar).
  const rehechos = await rehacerDesactualizados();
  // 3) Quitar de la base los meses que ya no se ven en la pestaña, solo si su respaldo está al día.
  const { rowCount: quitados } = await pool.query(`
    DELETE FROM movimientos_tienda m
    WHERE (${P.mes('m')} + interval '1 month')::date <= ${P.HOY} - interval '2 months'
      AND EXISTS (SELECT 1 FROM backups_tienda b
                  WHERE b.empresa_id = m.empresa_id AND b.mes = ${P.mes('m')} AND NOT b.desactualizado)`);
  // 4) Borrar para siempre los respaldos de más de 5 meses que un admin ya descargó.
  const { rowCount: borrados } = await pool.query(`
    DELETE FROM backups_tienda
    WHERE mes < ${P.MES_POR_BORRAR} AND descargado AND NOT desactualizado`);
  if (faltan.length || rehechos || quitados || borrados) {
    console.log(`Respaldos de tienda: ${faltan.length} creado(s), ${rehechos} rehecho(s), ` +
      `${quitados} movimiento(s) archivado(s) quitados de la pestaña, ${borrados} respaldo(s) viejo(s) borrado(s).`);
  }
}

// Nombre anterior (lo usan las herramientas de prueba).
const crearBackupTienda = asegurarRespaldosTienda;

module.exports = { limpiarHistorialRodante, crearBackupGeneral, crearBackupTienda, asegurarRespaldosTienda, guardarRespaldoMes, rehacerDesactualizados };
