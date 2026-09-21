const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-cambia-esto';
const COOKIE_NAME = 'cuentas_app_token';

function signToken(user) {
  return jwt.sign(
    { id: user.id, usuario: user.usuario, nombre: user.nombre, empresa_id: user.empresa_id, rol: user.rol },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function setAuthCookie(res, user) {
  const token = signToken(user);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    // Sin maxAge: es una cookie de sesión, el navegador la borra al cerrar la app/pestaña por completo.
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
}

// Extrae y verifica el token a partir del header Cookie crudo (usado en el handshake de WebSocket,
// que no pasa por el middleware cookie-parser de Express).
function verifyTokenFromCookieHeader(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE_NAME + '='));
  if (!match) return null;
  const token = decodeURIComponent(match.slice(COOKIE_NAME.length + 1));
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo el administrador de tu empresa puede hacer esto' });
  next();
}

module.exports = { requireAuth, requireAdmin, setAuthCookie, clearAuthCookie, verifyTokenFromCookieHeader, COOKIE_NAME };
