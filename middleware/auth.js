const jwt = require('jsonwebtoken');
const { JWT_SECRET, IS_PROD } = require('../lib/config');
const { pool } = require('../db/pool');

const COOKIE_NAME = 'cuentas_app_token';

// Devuelve el payload del token o null si es inválido/expirado. (Solo revisa la firma;
// para saber si la sesión sigue vigente hay que usar sesionVigente.)
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (e) {
    return null;
  }
}

// `user.sesion_version` viaja en el token (sv). Si en la base cambia (contraseña restablecida,
// etc.), todos los tokens anteriores dejan de valer aunque no hayan vencido.
// `enl`: sesión abierta en una computadora desde el teléfono (tabla sesiones_enlazadas); dura menos
// y se puede cerrar a distancia.
function signToken(user, { enl = null, expiresIn = '30d' } = {}) {
  const datos = { id: user.id, usuario: user.usuario, nombre: user.nombre, empresa_id: user.empresa_id, rol: user.rol, sv: user.sesion_version || 0 };
  if (enl) datos.enl = enl;
  return jwt.sign(datos, JWT_SECRET, { expiresIn });
}

function setAuthCookie(res, user, opciones) {
  const token = signToken(user, opciones);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PROD,
    // Sin maxAge: es una cookie de sesión, el navegador la borra al cerrar la app/pestaña por completo.
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

// Comprueba en la base que la sesión del token siga vigente: el usuario existe, su empresa no está
// suspendida y su versión de sesión no cambió. Devuelve el usuario actualizado (rol/nombre desde la
// base) o un motivo de rechazo.
async function sesionVigente(payload) {
  if (!payload || !Number.isInteger(payload.id) || !Number.isInteger(payload.empresa_id)) return { motivo: 'invalida' };
  const { rows } = await pool.query(
    `SELECT u.id, u.usuario, u.nombre, u.rol, u.empresa_id, u.sesion_version, e.activa
     FROM usuarios u JOIN empresas e ON e.id = u.empresa_id
     WHERE u.id = $1 AND u.empresa_id = $2`,
    [payload.id, payload.empresa_id]
  );
  const u = rows[0];
  if (!u) return { motivo: 'invalida' };
  if ((payload.sv || 0) !== u.sesion_version) return { motivo: 'invalida' };
  if (!u.activa) return { motivo: 'suspendida' };
  if (payload.enl !== undefined) {
    if (!Number.isInteger(payload.enl)) return { motivo: 'invalida' };
    const { rows: enl } = await pool.query(
      'SELECT 1 FROM sesiones_enlazadas WHERE id = $1 AND usuario_id = $2 AND NOT revocada AND vence > now()',
      [payload.enl, u.id]
    );
    if (!enl.length) return { motivo: 'invalida' };
  }
  return { user: { id: u.id, usuario: u.usuario, nombre: u.nombre, empresa_id: u.empresa_id, rol: u.rol, sv: u.sesion_version } };
}

const MSG_SUSPENDIDA = 'Tu empresa está suspendida. Comunícate con el administrador de la plataforma.';

async function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  // codigo 'SESION': la app sabe que debe volver al inicio de sesión (otros 401, como "tu contraseña
  // actual no es correcta", no cierran la sesión).
  if (!token) return res.status(401).json({ error: 'No autenticado', codigo: 'SESION' });
  const { user, motivo } = await sesionVigente(verifyToken(token));
  if (!user) {
    clearAuthCookie(res);
    return res.status(401).json({ error: motivo === 'suspendida' ? MSG_SUSPENDIDA : 'Sesión inválida o expirada', codigo: 'SESION' });
  }
  req.user = user;
  next();
}

// Extrae y verifica el token a partir del header Cookie crudo (usado en el handshake de WebSocket,
// que no pasa por el middleware cookie-parser de Express).
function verifyTokenFromCookieHeader(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE_NAME + '='));
  if (!match) return null;
  let token;
  try { token = decodeURIComponent(match.slice(COOKIE_NAME.length + 1)); } catch (e) { return null; }
  return verifyToken(token);
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo un administrador de tu empresa puede hacer esto' });
  next();
}

module.exports = {
  requireAuth, requireAdmin, setAuthCookie, clearAuthCookie, verifyToken, verifyTokenFromCookieHeader,
  sesionVigente, COOKIE_NAME, MSG_SUSPENDIDA,
};
