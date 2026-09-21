const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { requireAuth, setAuthCookie, clearAuthCookie } = require('../middleware/auth');
const { sendMail } = require('../lib/mailer');

const router = express.Router();

async function registrarHistorial(empresaId, usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (empresa_id, usuario_id, accion, detalle) VALUES ($1,$2,$3,$4)`,
    [empresaId, usuarioId, accion, detalle]
  );
}

const SEIS_MESES_MS = 1000 * 60 * 60 * 24 * 182;
function passwordVencida(fecha) {
  return Date.now() - new Date(fecha).getTime() > SEIS_MESES_MS;
}

// Sesión activa (si hay) + si el registro de nuevas empresas está habilitado ahora mismo.
router.get('/status', async (req, res) => {
  const codeConfigured = Boolean(process.env.INVITE_CODE);
  const maxEmpresas = process.env.MAX_EMPRESAS ? parseInt(process.env.MAX_EMPRESAS, 10) : null;
  let cupoDisponible = true;
  if (maxEmpresas) {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM empresas');
    cupoDisponible = rows[0].n < maxEmpresas;
  }
  res.json({ user: req.user || null, empresaCreationEnabled: codeConfigured && cupoDisponible });
});

router.post('/login', async (req, res) => {
  const { codigoEmpresa, usuario, contrasena } = req.body || {};
  if (!codigoEmpresa || !usuario || !contrasena) return res.status(400).json({ error: 'Completa código de empresa, usuario y contraseña' });

  const { rows: empRows } = await pool.query('SELECT * FROM empresas WHERE codigo = $1', [codigoEmpresa.trim().toUpperCase()]);
  const empresa = empRows[0];
  if (!empresa) return res.status(401).json({ error: 'Código de empresa, usuario o contraseña incorrectos' });

  const { rows } = await pool.query('SELECT * FROM usuarios WHERE empresa_id = $1 AND usuario = $2', [empresa.id, usuario]);
  const dbUser = rows[0];
  if (!dbUser) return res.status(401).json({ error: 'Código de empresa, usuario o contraseña incorrectos' });
  const ok = await bcrypt.compare(contrasena, dbUser.contrasena);
  if (!ok) return res.status(401).json({ error: 'Código de empresa, usuario o contraseña incorrectos' });

  if (passwordVencida(dbUser.contrasena_actualizada_en)) {
    return res.status(403).json({
      error: 'passwordExpired',
      codigoEmpresa: empresa.codigo,
      usuario: dbUser.usuario,
      message: 'Tu contraseña tiene más de 6 meses. Debes actualizarla para continuar.',
    });
  }

  const user = { id: dbUser.id, nombre: dbUser.nombre, usuario: dbUser.usuario, empresa_id: empresa.id, rol: dbUser.rol };
  setAuthCookie(res, user);
  await registrarHistorial(empresa.id, user.id, 'Inicio de sesión', 'Sesión iniciada correctamente');
  res.json({ user, empresa: { id: empresa.id, nombre: empresa.nombre, codigo: empresa.codigo } });
});

router.post('/force-change-password', async (req, res) => {
  const { codigoEmpresa, usuario, contrasena, nuevaContrasena } = req.body || {};
  if (!codigoEmpresa || !usuario || !contrasena || !nuevaContrasena || nuevaContrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows: empRows } = await pool.query('SELECT * FROM empresas WHERE codigo = $1', [codigoEmpresa.trim().toUpperCase()]);
  const empresa = empRows[0];
  if (!empresa) return res.status(401).json({ error: 'Código de empresa, usuario o contraseña incorrectos' });

  const { rows } = await pool.query('SELECT * FROM usuarios WHERE empresa_id = $1 AND usuario = $2', [empresa.id, usuario]);
  const dbUser = rows[0];
  if (!dbUser) return res.status(401).json({ error: 'Código de empresa, usuario o contraseña incorrectos' });
  const ok = await bcrypt.compare(contrasena, dbUser.contrasena);
  if (!ok) return res.status(401).json({ error: 'Código de empresa, usuario o contraseña incorrectos' });

  const hash = await bcrypt.hash(nuevaContrasena, 10);
  await pool.query('UPDATE usuarios SET contrasena = $1, contrasena_actualizada_en = now() WHERE id = $2', [hash, dbUser.id]);
  const user = { id: dbUser.id, nombre: dbUser.nombre, usuario: dbUser.usuario, empresa_id: empresa.id, rol: dbUser.rol };
  setAuthCookie(res, user);
  await registrarHistorial(empresa.id, user.id, 'Cambiar contraseña', 'Contraseña actualizada (rotación obligatoria de 6 meses)');
  res.json({ user, empresa: { id: empresa.id, nombre: empresa.nombre, codigo: empresa.codigo } });
});

router.post('/logout', requireAuth, async (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// El correo tampoco es único en toda la plataforma, así que hace falta el código de empresa.
router.post('/forgot-password', async (req, res) => {
  const { codigoEmpresa, email } = req.body || {};
  if (!codigoEmpresa || !email) return res.status(400).json({ error: 'Completa el código de empresa y el correo' });
  const { rows: empRows } = await pool.query('SELECT id FROM empresas WHERE codigo = $1', [codigoEmpresa.trim().toUpperCase()]);
  const empresa = empRows[0];
  if (empresa) {
    const { rows } = await pool.query('SELECT id, nombre FROM usuarios WHERE empresa_id = $1 AND email = $2', [empresa.id, email]);
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
  }
  res.json({ ok: true });
});

router.post('/reset-password', async (req, res) => {
  const { codigoEmpresa, email, code, nuevaContrasena } = req.body || {};
  if (!codigoEmpresa || !email || !code || !nuevaContrasena || nuevaContrasena.length < 4) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta' });
  }
  const { rows: empRows } = await pool.query('SELECT id FROM empresas WHERE codigo = $1', [codigoEmpresa.trim().toUpperCase()]);
  const empresa = empRows[0];
  if (!empresa) return res.status(400).json({ error: 'Código incorrecto o vencido' });

  const { rows: userRows } = await pool.query('SELECT id FROM usuarios WHERE empresa_id = $1 AND email = $2', [empresa.id, email]);
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
  await registrarHistorial(empresa.id, user.id, 'Restablecer contraseña', 'Contraseña restablecida mediante código enviado por correo');
  res.json({ ok: true });
});

module.exports = router;
