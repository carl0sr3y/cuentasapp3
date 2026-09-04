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

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Migración de base de datos completada.');
}

module.exports = { pool, migrate };
