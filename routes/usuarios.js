const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { requireAuth, requireAdmin, setAuthCookie } = require('../middleware/auth');
const { broadcast } = require('../lib/realtime');

const { texto, paramId } = require('../lib/validate');

const router = express.Router();
router.use(requireAuth);
router.param('id', paramId);

async function registrarHistorial(empresaId, usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (empresa_id, usuario_id, accion, detalle) VALUES ($1,$2,$3,$4)`,
    [empresaId, usuarioId, accion, detalle]
  );
}

// Info básica de la empresa y de quién soy yo (todos los roles pueden ver esto)
router.get('/me', async (req, res) => {
  const { rows } = await pool.query('SELECT id, nombre, usuario, email, rol, es_principal FROM usuarios WHERE id = $1', [req.user.id]);
  const { rows: empRows } = await pool.query('SELECT id, nombre, codigo FROM empresas WHERE id = $1', [req.user.empresa_id]);
  res.json({ usuario: rows[0], empresa: empRows[0] });
});

// Todo lo demás en este archivo es exclusivo de los administradores de la empresa.
router.use(requireAdmin);

// El administrador principal solo puede ser modificado por él mismo (o por el superadmin de la plataforma).
// Sin esto, otro admin podría cambiarle la contraseña y dejarlo afuera, aunque no pueda eliminarlo.
const MSG_PRINCIPAL = 'El administrador principal solo puede ser modificado por él mismo. No se puede eliminar.';
function esPrincipalAjeno(target, req) { return target.es_principal && target.id !== req.user.id; }

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, nombre, usuario, email, rol, es_principal, fecha_creacion FROM usuarios WHERE empresa_id = $1 ORDER BY es_principal DESC, (rol = \'admin\') DESC, fecha_creacion ASC',
    [req.user.empresa_id]
  );
  res.json(rows);
});

// Crea un usuario nuevo para MI empresa, con rol "usuario" (por defecto) o "admin".
router.post('/', async (req, res) => {
  const body = req.body || {};
  const nombre = texto(body.nombre, 100);
  const usuario = texto(body.usuario, 60);
  const email = texto(body.email, 254);
  const contrasena = typeof body.contrasena === 'string' && body.contrasena.length <= 200 ? body.contrasena : null;
  const rol = body.rol === undefined ? 'usuario' : body.rol;
  if (!['usuario', 'admin'].includes(rol)) return res.status(400).json({ error: 'Rol inválido' });
  if (!nombre || !usuario || !email || !contrasena || contrasena.length < 8) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta (mínimo 8 caracteres)' });
  }
  const { rows: existente } = await pool.query(
    'SELECT id FROM usuarios WHERE empresa_id = $1 AND (usuario = $2 OR email = $3)',
    [req.user.empresa_id, usuario, email]
  );
  if (existente[0]) return res.status(409).json({ error: 'Ese usuario o correo ya existe en tu empresa' });
  const hash = await bcrypt.hash(contrasena, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (empresa_id, nombre, usuario, email, contrasena, rol) VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, nombre, usuario, email, rol, es_principal, fecha_creacion`,
    [req.user.empresa_id, nombre, usuario, email, hash, rol]
  );
  await registrarHistorial(req.user.empresa_id, req.user.id, 'Crear usuario',
    `${rol === 'admin' ? 'Administrador' : 'Usuario'} "${nombre}" creado por ${req.user.nombre}`);
  broadcast({ scope: 'usuarios', empresaId: req.user.empresa_id, excludeClientId: req.headers['x-client-id'] });
  res.json(rows[0]);
});

// Cambia el correo de cualquier usuario de mi empresa (o el mío propio).
router.patch('/:id/email', async (req, res) => {
  const email = texto((req.body || {}).email, 254);
  if (!email) return res.status(400).json({ error: 'Correo requerido' });
  const targetId = Number(req.params.id);
  const { rows: [objetivo] } = await pool.query('SELECT id, es_principal FROM usuarios WHERE id = $1 AND empresa_id = $2', [targetId, req.user.empresa_id]);
  if (!objetivo) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (esPrincipalAjeno(objetivo, req)) return res.status(403).json({ error: MSG_PRINCIPAL });
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
  if (actual !== undefined && typeof actual !== 'string') return res.status(400).json({ error: 'Datos inválidos' });
  if (typeof nueva !== 'string' || nueva.length < 8 || nueva.length > 200) return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
  const targetId = Number(req.params.id);
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND empresa_id = $2', [targetId, req.user.empresa_id]);
  const target = rows[0];
  if (!target) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (esPrincipalAjeno(target, req)) return res.status(403).json({ error: MSG_PRINCIPAL });

  if (targetId === req.user.id) {
    if (!actual) return res.status(400).json({ error: 'Ingresa tu contraseña actual' });
    const ok = await bcrypt.compare(actual, target.contrasena);
    if (!ok) return res.status(401).json({ error: 'Tu contraseña actual no es correcta' });
  }

  const hash = await bcrypt.hash(nueva, 10);
  const esPropia = targetId === req.user.id;
  // Siempre sube la versión de sesión: se cierran las sesiones abiertas con la contraseña anterior.
  // Si el admin cambia la de OTRA persona: además se quitan sus huellas registradas y deberá elegir
  // una contraseña propia al entrar (el admin no debe conocer la contraseña definitiva de nadie).
  const { rows: upd } = await pool.query(
    `UPDATE usuarios SET contrasena = $1, contrasena_actualizada_en = now(),
       debe_cambiar_contrasena = $3, sesion_version = sesion_version + 1
     WHERE id = $2 RETURNING sesion_version`,
    [hash, targetId, !esPropia]
  );
  if (esPropia) {
    setAuthCookie(res, { ...req.user, sesion_version: upd[0].sesion_version }); // esta sesión sigue abierta
  } else {
    await pool.query('DELETE FROM webauthn_credentials WHERE usuario_id = $1', [targetId]);
  }
  await registrarHistorial(req.user.empresa_id, req.user.id, 'Cambiar contraseña', `Contraseña actualizada para "${target.nombre}"`);
  res.json({ ok: true });
});

// Elimina un usuario de mi empresa. Nadie puede eliminarse a sí mismo, y el administrador
// principal no puede ser eliminado (la empresa siempre conserva a su dueño).
router.delete('/:id', async (req, res) => {
  const targetId = Number(req.params.id);
  if (targetId === req.user.id) return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador' });

  const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND empresa_id = $2', [targetId, req.user.empresa_id]);
  const target = rows[0];
  if (!target) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (target.es_principal) return res.status(403).json({ error: MSG_PRINCIPAL });

  await pool.query('DELETE FROM usuarios WHERE id = $1 AND NOT es_principal', [targetId]);
  await registrarHistorial(req.user.empresa_id, req.user.id, 'Eliminar usuario', `Usuario "${target.nombre}" eliminado`);
  broadcast({ scope: 'usuarios', empresaId: req.user.empresa_id, excludeClientId: req.headers['x-client-id'] });
  res.json({ ok: true });
});

module.exports = router;
