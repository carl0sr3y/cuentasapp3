const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { setAuthCookie } = require('../middleware/auth');

const router = express.Router();

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
async function registrarHistorial(empresaId, usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (empresa_id, usuario_id, accion, detalle) VALUES ($1,$2,$3,$4)`,
    [empresaId, usuarioId, accion, detalle]
  );
}

// ¿Se puede crear una empresa nueva ahora mismo? (código de invitación configurado + cupo disponible)
router.get('/status', async (req, res) => {
  const codeConfigured = Boolean(process.env.INVITE_CODE);
  const maxEmpresas = process.env.MAX_EMPRESAS ? parseInt(process.env.MAX_EMPRESAS, 10) : null;
  let cupoDisponible = true;
  if (maxEmpresas) {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM empresas');
    cupoDisponible = rows[0].n < maxEmpresas;
  }
  res.json({ enabled: codeConfigured && cupoDisponible, codeConfigured, cupoDisponible });
});

// Crea una empresa nueva junto con su único administrador.
router.post('/', async (req, res) => {
  const { nombreEmpresa, nombre, usuario, email, contrasena, codigo } = req.body || {};

  if (!process.env.INVITE_CODE) {
    return res.status(503).json({ error: 'La creación de empresas nuevas no está habilitada' });
  }
  if (!codigo || codigo !== process.env.INVITE_CODE) {
    return res.status(403).json({ error: 'Código de invitación incorrecto' });
  }
  const maxEmpresas = process.env.MAX_EMPRESAS ? parseInt(process.env.MAX_EMPRESAS, 10) : null;
  if (maxEmpresas) {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM empresas');
    if (rows[0].n >= maxEmpresas) {
      return res.status(403).json({ error: 'Por ahora no hay cupo disponible para nuevas empresas. Intenta más tarde.' });
    }
  }
  if (!nombreEmpresa || !nombre || !usuario || !email || !contrasena || contrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }

  const codigoEmpresa = await generarCodigoUnico(nombreEmpresa);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: empRows } = await client.query(
      'INSERT INTO empresas (nombre, codigo) VALUES ($1,$2) RETURNING id, nombre, codigo',
      [nombreEmpresa.trim(), codigoEmpresa]
    );
    const empresa = empRows[0];
    const hash = await bcrypt.hash(contrasena, 10);
    const { rows: userRows } = await client.query(
      `INSERT INTO usuarios (empresa_id, nombre, usuario, email, contrasena, rol)
       VALUES ($1,$2,$3,$4,$5,'admin') RETURNING id, nombre, usuario, email, empresa_id, rol`,
      [empresa.id, nombre.trim(), usuario.trim(), email.trim(), hash]
    );
    await client.query('COMMIT');
    const user = userRows[0];
    setAuthCookie(res, user);
    await registrarHistorial(empresa.id, user.id, 'Crear empresa', `Empresa "${empresa.nombre}" creada`);
    res.json({ user, empresa });
  } catch (e) {
    await client.query('ROLLBACK');
    if (e.code === '23505') return res.status(409).json({ error: 'Ese usuario o correo ya existe' });
    console.error(e);
    res.status(500).json({ error: 'No se pudo crear la empresa' });
  } finally {
    client.release();
  }
});

module.exports = router;
