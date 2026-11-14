// Utilidades compartidas para crear empresas (registro con código de invitación y panel de plataforma).
const { pool } = require('../db/pool');

function slugify(nombre) {
  return (nombre || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .slice(0, 12) || 'EMPRESA';
}
async function generarCodigoUnico(nombre) {
  const base = slugify(nombre);
  let intento = base;
  let sufijo = 0;
  while (true) {
    const { rows } = await pool.query('SELECT id FROM empresas WHERE codigo = $1', [intento]);
    if (!rows[0]) return intento;
    sufijo++;
    intento = `${base}${sufijo}`;
  }
}

module.exports = { generarCodigoUnico };
