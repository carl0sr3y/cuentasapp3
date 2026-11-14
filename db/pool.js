const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

if (!process.env.DATABASE_URL) {
  console.error('Falta la variable de entorno DATABASE_URL. Agrega un plugin de PostgreSQL en Railway o define DATABASE_URL en tu .env local.');
}

const useSSL = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

// Si Postgres corta una conexión inactiva (reinicio, mantenimiento), `pg` emite 'error' en el pool.
// Sin este listener Node lo trata como error no manejado y el proceso termina.
pool.on('error', (err) => {
  console.error('Conexión inactiva de Postgres perdida (el pool abrirá otra):', err.message);
});

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Migración de base de datos completada.');
  await repararDatos();
}

// Correcciones de datos que se aplican en cada arranque (solo tocan filas que estén mal).
async function repararDatos() {
  const { recalcularCuentas, recalcularTienda } = require('../lib/saldos');
  const { RE_DATA_URL_JPEG } = require('../lib/fotos');
  // V6: saldos descuadrados por registros simultáneos antes de la corrección.
  const c = await recalcularCuentas(pool);
  const t = await recalcularTienda(pool);
  if (c || t) console.log(`Saldos corregidos: ${c} movimiento(s) de cuentas, ${t} de tienda.`);
  // V5: "fotos" guardadas que no son imágenes JPEG (posibles intentos de inyectar código).
  const f = await pool.query(
    'UPDATE movimientos_tienda SET foto = NULL WHERE foto IS NOT NULL AND foto !~ $1',
    [RE_DATA_URL_JPEG.source]
  );
  if (f.rowCount) console.log(`Fotos inválidas eliminadas: ${f.rowCount}.`);
}

module.exports = { pool, migrate };
