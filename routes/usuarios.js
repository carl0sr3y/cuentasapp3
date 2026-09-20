const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { requireAuth, clearAuthCookie } = require('../middleware/auth');
const { broadcast } = require('../lib/realtime');

const router = express.Router();
router.use(requireAuth);

async function registrarHistorial(usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (usuario_id, accion, detalle) VALUES ($1,$2,$3)`,
    [usuarioId, accion, detalle]
  );
}

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT id, nombre, usuario, email, fecha_creacion FROM usuarios ORDER BY fecha_creacion ASC');
  res.json(rows);
});

// Crea un administrador adicional (requiere sesión iniciada; no es registro público).
router.post('/', async (req, res) => {
  const { nombre, usuario, email, contrasena } = req.body || {};
  if (!nombre || !usuario || !email || !contrasena || contrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows: existente } = await pool.query('SELECT id FROM usuarios WHERE usuario = $1 OR email = $2', [usuario, email]);
  if (existente[0]) return res.status(409).json({ error: 'Ese usuario o correo ya existe' });
  const hash = await bcrypt.hash(contrasena, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, usuario, email, contrasena) VALUES ($1,$2,$3,$4) RETURNING id, nombre, usuario, email, fecha_creacion`,
    [nombre, usuario, email, hash]
  );
  await registrarHistorial(req.user.id, 'Crear usuario', `Administrador "${nombre}" creado por ${req.user.nombre}`);
  broadcast({ scope: 'usuarios', excludeClientId: req.headers['x-client-id'] });
  res.json(rows[0]);
});

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

// Actualiza (o agrega) el correo de una cuenta, propia o de otro administrador.
router.patch('/:id/email', async (req, res) => {
  const { email } = req.body || {};
  if (!email || !email.trim()) return res.status(400).json({ error: 'Correo requerido' });
  const targetId = Number(req.params.id);
  const { rows: existente } = await pool.query('SELECT id FROM usuarios WHERE email = $1 AND id != $2', [email.trim(), targetId]);
  if (existente[0]) return res.status(409).json({ error: 'Ese correo ya está en uso por otra cuenta' });
  const { rows } = await pool.query(
    'UPDATE usuarios SET email = $1 WHERE id = $2 RETURNING id, nombre, usuario, email',
    [email.trim(), targetId]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
  await registrarHistorial(req.user.id, 'Actualizar correo', `Correo actualizado para "${rows[0].nombre}"`);
  broadcast({ scope: 'usuarios', excludeClientId: req.headers['x-client-id'] });
  res.json(rows[0]);
});

// Elimina una cuenta de administrador (la propia o la de otro). Nunca deja el sistema sin administradores.
router.delete('/:id', async (req, res) => {
  const targetId = Number(req.params.id);
  const { rows: countRows } = await pool.query('SELECT COUNT(*)::int AS n FROM usuarios');
  if (countRows[0].n <= 1) return res.status(400).json({ error: 'No puedes eliminar el único administrador que queda' });

  const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [targetId]);
  const target = rows[0];
  if (!target) return res.status(404).json({ error: 'Usuario no encontrado' });

  const esUnoMismo = targetId === req.user.id;
  if (esUnoMismo) {
    const { actual } = req.body || {};
    if (!actual) return res.status(400).json({ error: 'Ingresa tu contraseña actual para eliminar tu cuenta' });
    const ok = await bcrypt.compare(actual, target.contrasena);
    if (!ok) return res.status(401).json({ error: 'Tu contraseña actual no es correcta' });
  }

  await pool.query('DELETE FROM usuarios WHERE id = $1', [targetId]);
  await registrarHistorial(req.user.id, 'Eliminar usuario', `Administrador "${target.nombre}" eliminado${esUnoMismo ? ' (su propia cuenta)' : ''}`);
  if (esUnoMismo) clearAuthCookie(res);
  broadcast({ scope: 'usuarios', excludeClientId: req.headers['x-client-id'] });
  res.json({ ok: true, deletedSelf: esUnoMismo });
});

module.exports = router;
