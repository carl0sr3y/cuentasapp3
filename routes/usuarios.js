const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { broadcast } = require('../lib/realtime');

const router = express.Router();
router.use(requireAuth);

async function registrarHistorial(empresaId, usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (empresa_id, usuario_id, accion, detalle) VALUES ($1,$2,$3,$4)`,
    [empresaId, usuarioId, accion, detalle]
  );
}

// Info básica de la empresa y de quién soy yo (todos los roles pueden ver esto)
router.get('/me', async (req, res) => {
  const { rows } = await pool.query('SELECT id, nombre, usuario, email, rol FROM usuarios WHERE id = $1', [req.user.id]);
  const { rows: empRows } = await pool.query('SELECT id, nombre, codigo FROM empresas WHERE id = $1', [req.user.empresa_id]);
  res.json({ usuario: rows[0], empresa: empRows[0] });
});

// Todo lo demás en este archivo es exclusivo del administrador de la empresa.
router.use(requireAdmin);

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, nombre, usuario, email, rol, fecha_creacion FROM usuarios WHERE empresa_id = $1 ORDER BY fecha_creacion ASC',
    [req.user.empresa_id]
  );
  res.json(rows);
});

// Crea un usuario nuevo para MI empresa (siempre rol "usuario", nunca admin).
router.post('/', async (req, res) => {
  const { nombre, usuario, email, contrasena } = req.body || {};
  if (!nombre || !usuario || !email || !contrasena || contrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows: existente } = await pool.query(
    'SELECT id FROM usuarios WHERE empresa_id = $1 AND (usuario = $2 OR email = $3)',
    [req.user.empresa_id, usuario, email]
  );
  if (existente[0]) return res.status(409).json({ error: 'Ese usuario o correo ya existe en tu empresa' });
  const hash = await bcrypt.hash(contrasena, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (empresa_id, nombre, usuario, email, contrasena, rol) VALUES ($1,$2,$3,$4,$5,'usuario')
     RETURNING id, nombre, usuario, email, rol, fecha_creacion`,
    [req.user.empresa_id, nombre, usuario, email, hash]
  );
  await registrarHistorial(req.user.empresa_id, req.user.id, 'Crear usuario', `Usuario "${nombre}" creado por ${req.user.nombre}`);
  broadcast({ scope: 'usuarios', empresaId: req.user.empresa_id, excludeClientId: req.headers['x-client-id'] });
  res.json(rows[0]);
});

// Cambia el correo de cualquier usuario de mi empresa (o el mío propio).
router.patch('/:id/email', async (req, res) => {
  const { email } = req.body || {};
  if (!email || !email.trim()) return res.status(400).json({ error: 'Correo requerido' });
  const targetId = Number(req.params.id);
  const { rows: existente } = await pool.query(
    'SELECT id FROM usuarios WHERE empresa_id = $1 AND email = $2 AND id != $3',
    [req.user.empresa_id, email.trim(), targetId]
  );
  if (existente[0]) return res.status(409).json({ error: 'Ese correo ya está en uso en tu empresa' });
  const { rows } = await pool.query(
    'UPDATE usuarios SET email = $1 WHERE id = $2 AND empresa_id = $3 RETURNING id, nombre, usuario, email',
    [email.trim(), targetId, req.user.empresa_id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
  await registrarHistorial(req.user.empresa_id, req.user.id, 'Actualizar correo', `Correo actualizado para "${rows[0].nombre}"`);
  broadcast({ scope: 'usuarios', empresaId: req.user.empresa_id, excludeClientId: req.headers['x-client-id'] });
  res.json(rows[0]);
});

// Cambia la contraseña de cualquier usuario de mi empresa (o la mía propia).
router.patch('/:id/password', async (req, res) => {
  const { actual, nueva } = req.body || {};
  if (!nueva || nueva.length < 4) return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 4 caracteres' });
  const targetId = Number(req.params.id);
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND empresa_id = $2', [targetId, req.user.empresa_id]);
  const target = rows[0];
  if (!target) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (targetId === req.user.id) {
    if (!actual) return res.status(400).json({ error: 'Ingresa tu contraseña actual' });
    const ok = await bcrypt.compare(actual, target.contrasena);
    if (!ok) return res.status(401).json({ error: 'Tu contraseña actual no es correcta' });
  }

  const hash = await bcrypt.hash(nueva, 10);
  await pool.query('UPDATE usuarios SET contrasena = $1, contrasena_actualizada_en = now() WHERE id = $2', [hash, targetId]);
  await registrarHistorial(req.user.empresa_id, req.user.id, 'Cambiar contraseña', `Contraseña actualizada para "${target.nombre}"`);
  res.json({ ok: true });
});

// Elimina un usuario de mi empresa. El administrador no puede eliminarse a sí mismo
// (dejaría a la empresa sin nadie que pueda gestionarla).
router.delete('/:id', async (req, res) => {
  const targetId = Number(req.params.id);
  if (targetId === req.user.id) return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador' });

  const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND empresa_id = $2', [targetId, req.user.empresa_id]);
  const target = rows[0];
  if (!target) return res.status(404).json({ error: 'Usuario no encontrado' });

  await pool.query('DELETE FROM usuarios WHERE id = $1', [targetId]);
  await registrarHistorial(req.user.empresa_id, req.user.id, 'Eliminar usuario', `Usuario "${target.nombre}" eliminado`);
  broadcast({ scope: 'usuarios', empresaId: req.user.empresa_id, excludeClientId: req.headers['x-client-id'] });
  res.json({ ok: true });
});

module.exports = router;
