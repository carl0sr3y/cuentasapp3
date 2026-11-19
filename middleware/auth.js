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
// `enl`: sesión abierta en una computadora desde el teléfono (tabla sesiones_enlazadas); se puede
// cerrar a distancia. Si es "recordada" (es mi computadora) dura 30 días aunque se cierre el navegador
// y se bloquea con PIN; si no, dura 12 horas y se borra al cerrar el navegador.
const HORAS_COMPU = 12;
const DIAS_COMPU_RECORDADA = 30;
function signToken(user, { enl = null, recordar = false } = {}) {
  const datos = { id: user.id, usuario: user.usuario, nombre: user.nombre, empresa_id: user.empresa_id, rol: user.rol, sv: user.sesion_version || 0 };
  if (enl) datos.enl = enl;
  const expiresIn = !enl ? '30d' : recordar ? DIAS_COMPU_RECORDADA + 'd' : HORAS_COMPU + 'h';
  return jwt.sign(datos, JWT_SECRET, { expiresIn });
}

// Si no se indica otra cosa, una sesión de computadora conserva su marca al renovarse la cookie
// (p. ej. al cambiar la propia contraseña desde la computadora).
function setAuthCookie(res, user, opciones) {
  if (!opciones && user.enl) opciones = { enl: user.enl, recordar: !!user.recordar };
  opciones = opciones || {};
  const token = signToken(user, opciones);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PROD,
    // Sin maxAge: es una cookie de sesión, el navegador la borra al cerrar la app/pestaña por completo.
    // Excepto en "es mi computadora": se queda guardada 30 días.
    ...(opciones.enl && opciones.recordar ? { maxAge: DIAS_COMPU_RECORDADA * 24 * 3600 * 1000 } : {}),
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
  const user = { id: u.id, usuario: u.usuario, nombre: u.nombre, empresa_id: u.empresa_id, rol: u.rol, sv: u.sesion_version, sesion_version: u.sesion_version };
  let bloqueo = null;
  if (payload.enl !== undefined) {
    if (!Number.isInteger(payload.enl)) return { motivo: 'invalida' };
    const { rows: enl } = await pool.query(
      `SELECT recordar, pin_hash IS NOT NULL AS tiene_pin,
              now() - ultima_actividad > $3 * interval '1 minute' AS inactiva,
              now() - fecha_creacion > $4 * interval '1 minute' AS sin_pin_vencida
       FROM sesiones_enlazadas WHERE id = $1 AND usuario_id = $2 AND NOT revocada AND vence > now()`,
      [payload.enl, u.id, MINUTOS_BLOQUEO, MINUTOS_PARA_CREAR_PIN]
    );
    const e = enl[0];
    if (!e) return { motivo: 'invalida' };
    user.enl = payload.enl;
    user.recordar = e.recordar;
    if (e.recordar) {
      // Recién aprobada: tiene unos minutos para crear su PIN; si no lo creó, la sesión ya no sirve
      // (así nadie que llegue después a esa computadora puede ponerle un PIN propio).
      if (!e.tiene_pin) { if (e.sin_pin_vencida) return { motivo: 'invalida' }; bloqueo = 'CREAR_PIN'; }
      else if (e.inactiva) bloqueo = 'BLOQUEADA';
    }
  }
  return { user, bloqueo };
}

// Minutos sin uso para que una computadora recordada pida su PIN, y para crear el PIN tras aprobarla.
const MINUTOS_BLOQUEO = 15;
const MINUTOS_PARA_CREAR_PIN = 10;

const MSG_SUSPENDIDA = 'Tu empresa está suspendida. Comunícate con el administrador de la plataforma.';

const MSG_BLOQUEO = {
  BLOQUEADA: 'Kaab está bloqueado en esta computadora. Escribe tu PIN.',
  CREAR_PIN: 'Crea el PIN de esta computadora para continuar.',
};
// aunBloqueada: para las pocas rutas que se usan con la pantalla bloqueada (poner el PIN, desbloquear,
// cerrar sesión). Las demás responden 423 con codigo BLOQUEADA o CREAR_PIN y la app muestra el candado.
function requireAuth(req, res, next) { return revisarSesion(req, res, next, false); }
function requireAuthAunBloqueada(req, res, next) { return revisarSesion(req, res, next, true); }
async function revisarSesion(req, res, next, aunBloqueada) {
  const token = req.cookies[COOKIE_NAME];
  // codigo 'SESION': la app sabe que debe volver al inicio de sesión (otros 401, como "tu contraseña
  // actual no es correcta", no cierran la sesión).
  if (!token) return res.status(401).json({ error: 'No autenticado', codigo: 'SESION' });
  const { user, motivo, bloqueo } = await sesionVigente(verifyToken(token));
  if (!user) {
    clearAuthCookie(res);
    return res.status(401).json({ error: motivo === 'suspendida' ? MSG_SUSPENDIDA : 'Sesión inválida o expirada', codigo: 'SESION' });
  }
  if (bloqueo && !aunBloqueada) return res.status(423).json({ error: MSG_BLOQUEO[bloqueo], codigo: bloqueo });
  req.user = user;
  req.bloqueo = bloqueo;
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
  requireAuth, requireAuthAunBloqueada, requireAdmin, setAuthCookie, MINUTOS_BLOQUEO, clearAuthCookie, verifyToken, verifyTokenFromCookieHeader,
  sesionVigente, COOKIE_NAME, MSG_SUSPENDIDA,
};
