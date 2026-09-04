const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { requireAuth, setAuthCookie, clearAuthCookie } = require('../middleware/auth');

const router = express.Router();

async function registrarHistorial(usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (usuario_id, accion, detalle) VALUES ($1,$2,$3)`,
    [usuarioId, accion, detalle]
  );
}

// Indica si ya existe un administrador configurado, y quién es la sesión actual (si hay una)
router.get('/status', async (req, res) => {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM usuarios');
  const needsSetup = rows[0].n === 0;
  res.json({ needsSetup, user: req.user || null });
});

// Crea el único usuario administrador. Solo funciona si no existe ninguno todavía.
router.post('/setup', async (req, res) => {
  const { nombre, usuario, contrasena } = req.body || {};
  if (!nombre || !usuario || !contrasena || contrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows: existentes } = await pool.query('SELECT COUNT(*)::int AS n FROM usuarios');
  if (existentes[0].n > 0) {
    return res.status(403).json({ error: 'Ya existe una cuenta de administrador. No hay registro público.' });
  }
  const hash = await bcrypt.hash(contrasena, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, usuario, contrasena) VALUES ($1,$2,$3) RETURNING id, nombre, usuario`,
    [nombre, usuario, hash]
  );
  const user = rows[0];
  setAuthCookie(res, user);
  await registrarHistorial(user.id, 'Inicio de sesión', 'Cuenta de administrador creada');
  res.json({ user });
});

router.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body || {};
  if (!usuario || !contrasena) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
  const dbUser = rows[0];
  if (!dbUser) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  const ok = await bcrypt.compare(contrasena, dbUser.contrasena);
  if (!ok) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  const user = { id: dbUser.id, nombre: dbUser.nombre, usuario: dbUser.usuario };
  setAuthCookie(res, user);
  await registrarHistorial(user.id, 'Inicio de sesión', 'Sesión iniciada correctamente');
  res.json({ user });
});

router.post('/logout', requireAuth, async (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

module.exports = router;
