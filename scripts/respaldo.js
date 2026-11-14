#!/usr/bin/env node
// Copia de seguridad COMPLETA de la base, guardada FUERA de Railway (auditoría V9).
//
// Exportar (desde tu computadora, con la URL PÚBLICA de la base: Postgres → Variables → DATABASE_PUBLIC_URL):
//   DATABASE_URL="postgresql://..." node scripts/respaldo.js exportar
//   → crea respaldos/cuentasapp-AAAA-MM-DD-HHMM.jsonl.gz (todas las tablas, fotos incluidas)
//
// Restaurar en una base VACÍA (p. ej. un Postgres nuevo en Railway):
//   DATABASE_URL="postgresql://...nueva..." node scripts/respaldo.js restaurar respaldos/cuentasapp-....jsonl.gz
//
// El archivo contiene TODOS los datos (y hashes de contraseñas): guárdalo cifrado o en un lugar
// privado (disco externo, Google Drive personal...). Nunca lo subas al repositorio.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const readline = require('readline');

const LOTE = 500;

function salir(msg) { console.error(msg); process.exit(1); }

// Tablas de la base ordenadas para que cada una vaya después de las tablas a las que referencia.
async function tablasEnOrden(pool) {
  const { rows: tablas } = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name`
  );
  const { rows: fks } = await pool.query(`
    SELECT DISTINCT tc.relname AS hija, tp.relname AS padre
    FROM pg_constraint c
    JOIN pg_class tc ON tc.oid = c.conrelid
    JOIN pg_class tp ON tp.oid = c.confrelid
    JOIN pg_namespace n ON n.oid = tc.relnamespace
    WHERE c.contype = 'f' AND n.nspname = 'public' AND tc.relname <> tp.relname`);
  const pendientes = new Set(tablas.map(t => t.table_name));
  const orden = [];
  while (pendientes.size) {
    const lista = [...pendientes].filter(t => !fks.some(f => f.hija === t && pendientes.has(f.padre)));
    if (!lista.length) throw new Error('Dependencias circulares entre tablas: ' + [...pendientes].join(', '));
    lista.forEach(t => { orden.push(t); pendientes.delete(t); });
  }
  return orden;
}

function q(ident) { return '"' + ident.replace(/"/g, '""') + '"'; }

async function exportar(pool, destino) {
  const tablas = await tablasEnOrden(pool);
  const marca = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '');
  const archivo = destino || path.join('respaldos', `cuentasapp-${marca}.jsonl.gz`);
  fs.mkdirSync(path.dirname(archivo), { recursive: true });
  const gz = zlib.createGzip({ level: 9 });
  const out = fs.createWriteStream(archivo, { mode: 0o600 });
  gz.pipe(out);
  const escribir = (obj) => new Promise(res => { if (gz.write(JSON.stringify(obj) + '\n')) res(); else gz.once('drain', res); });

  await escribir({ tipo: 'cabecera', app: 'cuentas-app', version: 1, generado: new Date().toISOString(), tablas });
  const conteo = {};
  for (const t of tablas) {
    conteo[t] = 0;
    // Por lotes y ordenado por id, para no cargar toda la tabla (fotos) en memoria de una vez.
    let ultimo = null;
    for (;;) {
      const { rows } = await pool.query(
        `SELECT id, row_to_json(x) AS fila FROM ${q(t)} x ${ultimo === null ? '' : 'WHERE id > $2'} ORDER BY id LIMIT $1`,
        ultimo === null ? [LOTE] : [LOTE, ultimo]
      );
      if (!rows.length) break;
      for (const r of rows) await escribir({ t, f: r.fila });
      conteo[t] += rows.length;
      ultimo = rows[rows.length - 1].id;
    }
    await escribir({ tipo: 'fin_tabla', t, filas: conteo[t] });
  }
  await escribir({ tipo: 'fin', conteo });
  gz.end();
  await new Promise(res => out.on('close', res));
  const mb = (fs.statSync(archivo).size / 1024 / 1024).toFixed(2);
  console.log('\nRespaldo creado: ' + path.resolve(archivo) + ` (${mb} MB)`);
  for (const [t, n] of Object.entries(conteo)) console.log(`  ${t.padEnd(30)} ${n} fila(s)`);
  console.log('\nGuárdalo en un lugar privado (disco externo, Drive personal). Contiene TODOS los datos.');
}

async function restaurar(pool, migrate, archivo) {
  if (!archivo || !fs.existsSync(archivo)) salir('Indica el archivo a restaurar: node scripts/respaldo.js restaurar <archivo.jsonl.gz>');
  await migrate(); // crea las tablas si la base es nueva
  const tablas = await tablasEnOrden(pool);
  for (const t of tablas) {
    const { rows } = await pool.query(`SELECT EXISTS (SELECT 1 FROM ${q(t)}) AS hay`);
    if (rows[0].hay) salir(`La base de destino NO está vacía (la tabla "${t}" tiene datos). Por seguridad solo se restaura en una base vacía.`);
  }

  const lector = readline.createInterface({ input: fs.createReadStream(archivo).pipe(zlib.createGunzip()), crlfDelay: Infinity });
  const client = await pool.connect();
  const conteo = {};
  let esperado = null;
  let lote = [], tablaLote = null;
  const vaciar = async () => {
    if (!lote.length) return;
    // json_populate_recordset convierte cada campo al tipo de su columna; columnas que ya no existan se ignoran.
    await client.query(`INSERT INTO ${q(tablaLote)} SELECT * FROM json_populate_recordset(NULL::${q(tablaLote)}, $1)`, [JSON.stringify(lote)]);
    conteo[tablaLote] = (conteo[tablaLote] || 0) + lote.length;
    lote = [];
  };
  try {
    await client.query('BEGIN');
    for await (const linea of lector) {
      if (!linea) continue;
      const o = JSON.parse(linea);
      if (o.tipo === 'cabecera') {
        if (o.app !== 'cuentas-app') throw new Error('El archivo no es un respaldo de Kaab');
        continue;
      }
      if (o.tipo === 'fin_tabla') { await vaciar(); continue; }
      if (o.tipo === 'fin') { esperado = o.conteo; continue; }
      if (!tablas.includes(o.t)) continue; // tabla que ya no existe en esta versión
      if (tablaLote !== o.t) { await vaciar(); tablaLote = o.t; }
      lote.push(o.f);
      if (lote.length >= LOTE) await vaciar();
    }
    await vaciar();
    if (!esperado) throw new Error('El archivo está incompleto (no tiene la marca de fin). No se restauró nada.');
    for (const [t, n] of Object.entries(esperado)) {
      if (tablas.includes(t) && (conteo[t] || 0) !== n) throw new Error(`Faltan filas en "${t}": ${conteo[t] || 0} de ${n}. No se restauró nada.`);
    }
    // Los contadores de id deben continuar después del id más alto restaurado.
    for (const t of tablas) {
      await client.query(
        `SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM ${q(t)}), 0) + 1, false)
         WHERE pg_get_serial_sequence($1, 'id') IS NOT NULL`, [t]);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  console.log('\nRestauración completada:');
  for (const [t, n] of Object.entries(conteo)) console.log(`  ${t.padEnd(30)} ${n} fila(s)`);
}

async function main() {
  const [accion, archivo] = process.argv.slice(2);
  if (!['exportar', 'restaurar'].includes(accion)) {
    salir('Uso:\n  DATABASE_URL="..." node scripts/respaldo.js exportar [archivo]\n  DATABASE_URL="..." node scripts/respaldo.js restaurar <archivo>');
  }
  if (!process.env.DATABASE_URL) salir('Falta DATABASE_URL. En Railway: servicio Postgres → Variables → DATABASE_PUBLIC_URL.');
  const { pool, migrate } = require('../db/pool');
  try {
    if (accion === 'exportar') await exportar(pool, archivo);
    else await restaurar(pool, migrate, archivo);
  } finally {
    await pool.end();
  }
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
