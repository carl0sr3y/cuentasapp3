const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { requireAuth, setAuthCookie, clearAuthCookie } = require('../middleware/auth');
const { sendMail } = require('../lib/mailer');

const router = express.Router();

async function registrarHistorial(usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (usuario_id, accion, detalle) VALUES ($1,$2,$3)`,
    [usuarioId, accion, detalle]
  );
}

// Indica si ya existe un administrador configurado, si hay sesión activa, y si el
// registro público con código de invitación está habilitado en este servidor.
router.get('/status', async (req, res) => {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM usuarios');
  const needsSetup = rows[0].n === 0;
  res.json({ needsSetup, user: req.user || null, registrationEnabled: Boolean(process.env.INVITE_CODE) });
});

// Crea el primer usuario administrador. Solo funciona si no existe ninguno todavía.
router.post('/setup', async (req, res) => {
  const { nombre, usuario, email, contrasena } = req.body || {};
  if (!nombre || !usuario || !email || !contrasena || contrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows: existentes } = await pool.query('SELECT COUNT(*)::int AS n FROM usuarios');
  if (existentes[0].n > 0) {
    return res.status(403).json({ error: 'Ya existe una cuenta de administrador.' });
  }
  const hash = await bcrypt.hash(contrasena, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, usuario, email, contrasena) VALUES ($1,$2,$3,$4) RETURNING id, nombre, usuario, email`,
    [nombre, usuario, email, hash]
  );
  const user = rows[0];
  setAuthCookie(res, user);
  await registrarHistorial(user.id, 'Inicio de sesión', 'Cuenta de administrador creada');
  res.json({ user });
});

// Registro con código de invitación (disponible incluso si ya existen usuarios).
router.post('/register', async (req, res) => {
  const { nombre, usuario, email, contrasena, codigo } = req.body || {};
  if (!process.env.INVITE_CODE) {
    return res.status(503).json({ error: 'El registro con código no está habilitado' });
  }
  if (!codigo || codigo !== process.env.INVITE_CODE) {
    return res.status(403).json({ error: 'Código de invitación incorrecto' });
  }
  if (!nombre || !usuario || !email || !contrasena || contrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows: existente } = await pool.query('SELECT id FROM usuarios WHERE usuario = $1 OR email = $2', [usuario, email]);
  if (existente[0]) return res.status(409).json({ error: 'Ese usuario o correo ya está registrado' });

  const hash = await bcrypt.hash(contrasena, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, usuario, email, contrasena) VALUES ($1,$2,$3,$4) RETURNING id, nombre, usuario, email`,
    [nombre, usuario, email, hash]
  );
  const user = rows[0];
  setAuthCookie(res, user);
  await registrarHistorial(user.id, 'Registro', `Nueva cuenta registrada con código de invitación: ${nombre}`);
  res.json({ user });
});

const SEIS_MESES_MS = 1000 * 60 * 60 * 24 * 182;
function passwordVencida(fecha) {
  return Date.now() - new Date(fecha).getTime() > SEIS_MESES_MS;
}

router.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body || {};
  if (!usuario || !contrasena) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
  const dbUser = rows[0];
  if (!dbUser) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  const ok = await bcrypt.compare(contrasena, dbUser.contrasena);
  if (!ok) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  if (passwordVencida(dbUser.contrasena_actualizada_en)) {
    return res.status(403).json({ error: 'passwordExpired', usuario: dbUser.usuario, message: 'Tu contraseña tiene más de 6 meses. Debes actualizarla para continuar.' });
  }

  const user = { id: dbUser.id, nombre: dbUser.nombre, usuario: dbUser.usuario };
  setAuthCookie(res, user);
  await registrarHistorial(user.id, 'Inicio de sesión', 'Sesión iniciada correctamente');
  res.json({ user });
});

// Cuando la contraseña venció (más de 6 meses), esta ruta confirma la contraseña actual
// y establece una nueva, todo en un solo paso, dejando la sesión iniciada al final.
router.post('/force-change-password', async (req, res) => {
  const { usuario, contrasena, nuevaContrasena } = req.body || {};
  if (!usuario || !contrasena || !nuevaContrasena || nuevaContrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
  const dbUser = rows[0];
  if (!dbUser) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  const ok = await bcrypt.compare(contrasena, dbUser.contrasena);
  if (!ok) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  const hash = await bcrypt.hash(nuevaContrasena, 10);
  await pool.query('UPDATE usuarios SET contrasena = $1, contrasena_actualizada_en = now() WHERE id = $2', [hash, dbUser.id]);
  const user = { id: dbUser.id, nombre: dbUser.nombre, usuario: dbUser.usuario };
  setAuthCookie(res, user);
  await registrarHistorial(user.id, 'Cambiar contraseña', 'Contraseña actualizada (rotación obligatoria de 6 meses)');
  res.json({ user });
});

router.post('/logout', requireAuth, async (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// Pide un código de 4 dígitos por correo para restablecer la contraseña.
// Responde igual exista o no el correo, para no filtrar qué correos están registrados.
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Correo requerido' });
  const { rows } = await pool.query('SELECT id, nombre FROM usuarios WHERE email = $1', [email]);
  const user = rows[0];
  if (user) {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    await pool.query('UPDATE password_resets SET usado = true WHERE usuario_id = $1 AND usado = false', [user.id]);
    await pool.query(
      `INSERT INTO password_resets (usuario_id, code, expira_en) VALUES ($1,$2, now() + interval '15 minutes')`,
      [user.id, code]
    );
    try {
      await sendMail({
        to: email,
        subject: 'Código para restablecer tu contraseña — Cuentas-App',
        html: `<p>Hola ${user.nombre},</p><p>Tu código para restablecer tu contraseña es:</p><h2 style="letter-spacing:4px;">${code}</h2><p>Este código vence en 15 minutos. Si no lo pediste, ignora este correo.</p>`,
      });
    } catch (e) { console.error('Error enviando correo de recuperación:', e.message); }
  }
  res.json({ ok: true });
});

// Confirma el código y establece la nueva contraseña.
router.post('/reset-password', async (req, res) => {
  const { email, code, nuevaContrasena } = req.body || {};
  if (!email || !code || !nuevaContrasena || nuevaContrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows: userRows } = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
  const user = userRows[0];
  if (!user) return res.status(400).json({ error: 'Código incorrecto o vencido' });

  const { rows: codeRows } = await pool.query(
    `SELECT id FROM password_resets WHERE usuario_id = $1 AND code = $2 AND usado = false AND expira_en > now()
     ORDER BY fecha_creacion DESC LIMIT 1`,
    [user.id, code]
  );
  if (!codeRows[0]) return res.status(400).json({ error: 'Código incorrecto o vencido' });

  const hash = await bcrypt.hash(nuevaContrasena, 10);
  await pool.query('UPDATE usuarios SET contrasena = $1, contrasena_actualizada_en = now() WHERE id = $2', [hash, user.id]);
  await pool.query('UPDATE password_resets SET usado = true WHERE id = $1', [codeRows[0].id]);
  await registrarHistorial(user.id, 'Restablecer contraseña', 'Contraseña restablecida mediante código enviado por correo');
  res.json({ ok: true });
});

module.exports = router;
