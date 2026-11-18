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
// Todo ocurre DENTRO de Postgres (mejoras/RENDIMIENTO.md #1): las fotos se copian de una tabla a otra
// sin pasar por el servidor, así la memoria no crece aunque el mes tenga miles de fotos.
async function guardarRespaldoMes(empresaId, mesIso) {
  await enTransaccion(pool, async (client) => {
    await bloquearTienda(client, empresaId);
    const { rows: [empresa] } = await client.query('SELECT nombre FROM empresas WHERE id = $1', [empresaId]);
    if (!empresa) return;
    const nombre = nombreDeMes(mesIso);
    // La fila del respaldo (se crea si no existía). Si ya existía, se vacía su contenido para rehacerlo.
    let { rows: [b] } = await client.query(
      'SELECT id FROM backups_tienda WHERE empresa_id = $1 AND mes = $2::date ORDER BY id LIMIT 1', [empresaId, mesIso]);
    if (b) {
      await client.query('DELETE FROM backups_tienda_movs WHERE backup_id = $1', [b.id]);
    } else {
      ({ rows: [b] } = await client.query(
        `INSERT INTO backups_tienda (empresa_id, nombre, data, size_bytes, mes, en_partes) VALUES ($1,$2,'{}',0,$3::date,true) RETURNING id`,
        [empresaId, nombre, mesIso]));
    }
    const copia = await client.query(`
      INSERT INTO backups_tienda_movs (backup_id, orden, mov_id, empresa_id, usuario_id, tipo, descripcion, monto,
                                       saldo_resultante, fecha, foto, clave_envio, usuario)
      SELECT $3, row_number() OVER (ORDER BY m.fecha, m.id), m.id, m.empresa_id, m.usuario_id, m.tipo, m.descripcion,
             m.monto, m.saldo_resultante, m.fecha, m.foto, m.clave_envio, u.nombre
      FROM movimientos_tienda m LEFT JOIN usuarios u ON u.id = m.usuario_id
      WHERE m.empresa_id = $1 AND ${P.mes('m')} = $2::date`, [empresaId, mesIso, b.id]);
    // Resumen y tamaño calculados por la base (el tamaño es aproximado: solo se usa para mostrar los KB).
    const { rows: [r] } = await client.query(`
      SELECT count(*)::int AS n,
             COALESCE(SUM(monto) FILTER (WHERE tipo = 'entrada'), 0) AS entradas,
             COALESCE(SUM(-monto) FILTER (WHERE tipo = 'salida'), 0) AS salidas,
             count(foto)::int AS fotos,
             COALESCE(SUM(octet_length(COALESCE(foto, '')) + octet_length(COALESCE(descripcion, '')) + 300), 0)::bigint AS bytes
      FROM backups_tienda_movs WHERE backup_id = $1`, [b.id]);
    // Comprobación: el respaldo debe tener tantos movimientos como el mes en la base.
    if (r.n !== copia.rowCount) throw new Error(`Respaldo ${nombre} (empresa ${empresaId}): ${r.n} de ${copia.rowCount} movimientos`);
    const totalEntradas = Number(r.entradas), totalSalidas = Number(r.salidas);
    const encabezado = {
      generado_en: new Date().toISOString(), empresa: empresa.nombre, mes: nombre,
      resumen: {
        total_movimientos: r.n,
        total_entradas: totalEntradas,
        total_salidas: totalSalidas,
        balance_neto: Math.round((totalEntradas - totalSalidas) * 100) / 100,
        facturas_adjuntas: r.fotos,
      },
    };
    // Si se rehízo (por un borrado), queda como no descargado: la copia que el admin bajó antes ya no coincide.
    await client.query(
      `UPDATE backups_tienda SET data = $2, size_bytes = $3, nombre = $4, en_partes = true, desactualizado = false,
         descargado = false, version = version + 1
       WHERE id = $1`,
      [b.id, JSON.stringify(encabezado), Math.min(Number(r.bytes) + 400, 2147483647), nombre]);
  });
}

// Respaldos de antes de "por partes" (todo el mes en un solo JSON): se pasan al formato nuevo uno por
// uno, dentro de Postgres. Si alguno falla, se queda como estaba y se sigue descargando a la manera vieja.
async function convertirRespaldosViejos() {
  const { rows } = await pool.query('SELECT id, empresa_id, nombre FROM backups_tienda WHERE NOT en_partes ORDER BY id');
  let bien = 0;
  for (const v of rows) {
    try {
      await enTransaccion(pool, async (client) => {
        await bloquearTienda(client, v.empresa_id);
        const { rows: [b] } = await client.query(
          `SELECT en_partes, jsonb_typeof(data->'movimientos') AS tipo, jsonb_array_length(CASE WHEN jsonb_typeof(data->'movimientos') = 'array' THEN data->'movimientos' ELSE '[]' END) AS n
           FROM backups_tienda WHERE id = $1 FOR UPDATE`, [v.id]);
        if (!b || b.en_partes) return;
        if (b.tipo !== 'array') throw new Error('no tiene lista de movimientos');
        await client.query('DELETE FROM backups_tienda_movs WHERE backup_id = $1', [v.id]);
        const copia = await client.query(`
          INSERT INTO backups_tienda_movs (backup_id, orden, mov_id, empresa_id, usuario_id, tipo, descripcion, monto,
                                           saldo_resultante, fecha, foto, clave_envio, usuario)
          SELECT b.id, e.n, (e.m->>'id')::int, (e.m->>'empresa_id')::int, (e.m->>'usuario_id')::int, e.m->>'tipo',
                 e.m->>'descripcion', (e.m->>'monto')::numeric, (e.m->>'saldo_resultante')::numeric,
                 (e.m->>'fecha')::timestamptz, e.m->>'foto', e.m->>'clave_envio', e.m->>'usuario'
          FROM backups_tienda b, jsonb_array_elements(b.data->'movimientos') WITH ORDINALITY AS e(m, n)
          WHERE b.id = $1`, [v.id]);
        if (copia.rowCount !== b.n) throw new Error(`se copiaron ${copia.rowCount} de ${b.n} movimientos`);
        await client.query(`UPDATE backups_tienda SET data = data - 'movimientos', en_partes = true WHERE id = $1`, [v.id]);
      });
      bien++;
    } catch (e) {
      console.error(`Respaldo de tienda "${v.nombre}" (id ${v.id}) no se pudo convertir; se queda como estaba:`, e.message);
    }
  }
  if (bien) console.log(`Respaldos de tienda convertidos al formato por partes: ${bien}.`);
  return bien;
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

module.exports = { limpiarHistorialRodante, crearBackupGeneral, crearBackupTienda, asegurarRespaldosTienda, guardarRespaldoMes, rehacerDesactualizados, convertirRespaldosViejos };
