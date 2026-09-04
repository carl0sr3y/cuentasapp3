const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { broadcast } = require('../lib/realtime');

const router = express.Router();
router.use(requireAuth);

async function registrarHistorial(usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (usuario_id, accion, detalle) VALUES ($1,$2,$3)`,
    [usuarioId, accion, detalle]
  );
}

// Lista los administradores existentes (sin contraseñas)
router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT id, nombre, usuario, fecha_creacion FROM usuarios ORDER BY fecha_creacion ASC');
  res.json(rows);
});

// Crea un administrador adicional. Cualquier administrador ya logueado puede hacerlo
// (no es registro público: hace falta sesión iniciada).
router.post('/', async (req, res) => {
  const { nombre, usuario, contrasena } = req.body || {};
  if (!nombre || !usuario || !contrasena || contrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows: existente } = await pool.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
  if (existente[0]) return res.status(409).json({ error: 'Ese nombre de usuario ya existe' });
  const hash = await bcrypt.hash(contrasena, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, usuario, contrasena) VALUES ($1,$2,$3) RETURNING id, nombre, usuario, fecha_creacion`,
    [nombre, usuario, hash]
  );
  await registrarHistorial(req.user.id, 'Crear usuario', `Administrador "${nombre}" creado por ${req.user.nombre}`);
  broadcast({ scope: 'usuarios', excludeClientId: req.headers['x-client-id'] });
  res.json(rows[0]);
});

// Cambia la contraseña de un usuario. Si es la propia cuenta, exige la contraseña actual.
// Si es la cuenta del otro administrador, no (se asume confianza entre administradores).
router.patch('/:id/password', async (req, res) => {
  const { actual, nueva } = req.body || {};
  if (!nueva || nueva.length < 4) return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 4 caracteres' });

  const targetId = Number(req.params.id);
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [targetId]);
  const target = rows[0];
  if (!target) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (targetId === req.user.id) {
    if (!actual) return res.status(400).json({ error: 'Ingresa tu contraseña actual' });
    const ok = await bcrypt.compare(actual, target.contrasena);
    if (!ok) return res.status(401).json({ error: 'Tu contraseña actual no es correcta' });
  }

  const hash = await bcrypt.hash(nueva, 10);
  await pool.query('UPDATE usuarios SET contrasena = $1 WHERE id = $2', [hash, targetId]);
  await registrarHistorial(req.user.id, 'Cambiar contraseña', `Contraseña actualizada para "${target.nombre}"`);
  res.json({ ok: true });
});

module.exports = router;
