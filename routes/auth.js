const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { requireAuth, setAuthCookie, clearAuthCookie, verifyToken, sesionVigente, COOKIE_NAME, MSG_SUSPENDIDA } = require('../middleware/auth');
const { motivoCambioObligatorio, compararContrasena } = require('../lib/passwords');
const limites = require('../lib/rateLimits');

// Todos los campos de estos formularios deben ser texto de largo razonable.
// (Antes, un número en vez de texto hacía fallar .trim() y tumbaba el servidor.)
function camposTexto(body, campos, max = 200) {
  for (const c of campos) {
    if (typeof body[c] !== 'string' || !body[c] || body[c].length > max) return false;
  }
  return true;
}

const router = express.Router();

const MSG_CREDENCIALES = 'Código de empresa, usuario o contraseña incorrectos';

async function registrarHistorial(empresaId, usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (empresa_id, usuario_id, accion, detalle) VALUES ($1,$2,$3,$4)`,
    [empresaId, usuarioId, accion, detalle]
  );
}

// Busca empresa + usuario y verifica la contraseña. Siempre ejecuta bcrypt (aunque la empresa o el
// usuario no existan) para que el tiempo de respuesta no revele qué existe.
async function verificarCredenciales(codigoEmpresa, usuario, contrasena) {
  const { rows: empRows } = await pool.query('SELECT * FROM empresas WHERE codigo = $1', [codigoEmpresa.trim().toUpperCase()]);
  const empresa = empRows[0];
  let dbUser = null;
  if (empresa) {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE empresa_id = $1 AND usuario = $2', [empresa.id, usuario]);
    dbUser = rows[0] || null;
  }
  const ok = await compararContrasena(contrasena, dbUser && dbUser.contrasena);
  if (!ok || !empresa || !dbUser) {
    // Rastro de intentos fallidos (auditoría V18): en los logs siempre; y si el usuario existe,
    // también en el historial de su empresa, para que el admin vea si alguien prueba contraseñas.
    console.warn(`Login fallido: empresa "${String(codigoEmpresa).slice(0, 40)}", usuario "${String(usuario).slice(0, 40)}"`);
    if (dbUser) {
      await registrarHistorial(empresa.id, dbUser.id, 'Inicio de sesión fallido', 'Contraseña incorrecta').catch(() => {});
    }
    return null;
  }
  return { empresa, dbUser };
}

function datosSesion(dbUser, empresa) {
  return { id: dbUser.id, nombre: dbUser.nombre, usuario: dbUser.usuario, empresa_id: empresa.id, rol: dbUser.rol, sesion_version: dbUser.sesion_version };
}
function datosEmpresa(empresa) {
  return { id: empresa.id, nombre: empresa.nombre, codigo: empresa.codigo };
}

// Sesión activa (si hay, y si sigue vigente en la base).
// Las empresas nuevas solo se crean desde el panel de plataforma (no hay registro público).
router.get('/status', async (req, res) => {
  let user = null;
  const token = req.cookies[COOKIE_NAME];
  if (token) {
    const r = await sesionVigente(verifyToken(token));
    user = r.user || null;
    if (!user) clearAuthCookie(res);
  }
  res.json({ user });
});

router.post('/login', limites.loginIp, limites.loginCuenta, async (req, res) => {
  const body = req.body || {};
  if (!camposTexto(body, ['codigoEmpresa', 'usuario', 'contrasena'])) return res.status(400).json({ error: 'Completa código de empresa, usuario y contraseña' });
  const cred = await verificarCredenciales(body.codigoEmpresa, body.usuario, body.contrasena);
  if (!cred) return res.status(401).json({ error: MSG_CREDENCIALES });
  const { empresa, dbUser } = cred;
  if (!empresa.activa) return res.status(403).json({ error: MSG_SUSPENDIDA });

  const motivo = motivoCambioObligatorio(dbUser);
  if (motivo) {
    return res.status(403).json({ error: 'passwordExpired', codigoEmpresa: empresa.codigo, usuario: dbUser.usuario, message: motivo });
  }

  const user = datosSesion(dbUser, empresa);
  setAuthCookie(res, user);
  await registrarHistorial(empresa.id, user.id, 'Inicio de sesión', 'Sesión iniciada correctamente');
  res.json({ user, empresa: datosEmpresa(empresa) });
});

router.post('/force-change-password', limites.loginIp, limites.loginCuenta, async (req, res) => {
  const body = req.body || {};
  if (!camposTexto(body, ['codigoEmpresa', 'usuario', 'contrasena', 'nuevaContrasena']) || body.nuevaContrasena.length < 8) {
    return res.status(400).json({ error: 'Datos incompletos o contraseña muy corta (mínimo 8 caracteres)' });
  }
  const cred = await verificarCredenciales(body.codigoEmpresa, body.usuario, body.contrasena);
  if (!cred) return res.status(401).json({ error: MSG_CREDENCIALES });
  const { empresa, dbUser } = cred;
  if (!empresa.activa) return res.status(403).json({ error: MSG_SUSPENDIDA });
  if (body.nuevaContrasena === body.contrasena) return res.status(400).json({ error: 'La contraseña nueva debe ser distinta de la actual' });

  const hash = await bcrypt.hash(body.nuevaContrasena, 10);
  // Nueva versión de sesión: cualquier otra sesión abierta con la contraseña anterior queda cerrada.
  const { rows } = await pool.query(
    `UPDATE usuarios SET contrasena = $1, contrasena_actualizada_en = now(), debe_cambiar_contrasena = false,
       sesion_version = sesion_version + 1
     WHERE id = $2 RETURNING sesion_version`,
    [hash, dbUser.id]
  );
  const user = datosSesion({ ...dbUser, sesion_version: rows[0].sesion_version }, empresa);
  setAuthCookie(res, user);
  await registrarHistorial(empresa.id, user.id, 'Cambiar contraseña',
    dbUser.debe_cambiar_contrasena ? 'Contraseña nueva elegida tras un restablecimiento' : 'Contraseña actualizada (rotación obligatoria de 6 meses)');
  res.json({ user, empresa: datosEmpresa(empresa) });
});

router.post('/logout', requireAuth, async (req, res) => {
  const payload = verifyToken(req.cookies[COOKIE_NAME]);
  if (payload && Number.isInteger(payload.enl)) {
    await pool.query('UPDATE sesiones_enlazadas SET revocada = true WHERE id = $1 AND usuario_id = $2', [payload.enl, req.user.id]);
  }
  clearAuthCookie(res);
  res.json({ ok: true });
});

module.exports = router;
