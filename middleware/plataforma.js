// Sesión del panel de plataforma (superadmin). Totalmente separada de la sesión de empresas:
// - otra cookie, limitada a /api/plataforma y con SameSite=Strict;
// - firmada con una clave DERIVADA (un token de empresa nunca sirve aquí, ni al revés);
// - se cierra tras 15 min sin actividad y, como máximo, a las 8 h;
// - se revoca en la base (sesion_version) al cerrar sesión o al restablecer la cuenta con el script.
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, IS_PROD } = require('../lib/config');
const { pool } = require('../db/pool');

const COOKIE = 'cuentas_plataforma';
const RUTA_COOKIE = '/api/plataforma';
const CLAVE = crypto.createHmac('sha256', JWT_SECRET).update('cuentas-plataforma-sesion-v1').digest();
const INACTIVIDAD_MS = 15 * 60 * 1000;
const DURACION_MAX_MS = 8 * 60 * 60 * 1000;

function emitirCookie(res, { sid, sv, ini }) {
  const ahora = Date.now();
  const token = jwt.sign(
    { sid, sv, ini, act: ahora, exp: Math.floor((ini + DURACION_MAX_MS) / 1000) },
    CLAVE,
    { algorithm: 'HS256' }
  );
  res.cookie(COOKIE, token, { httpOnly: true, secure: IS_PROD, sameSite: 'strict', path: RUTA_COOKIE });
}

function borrarCookie(res) {
  res.clearCookie(COOKIE, { httpOnly: true, secure: IS_PROD, sameSite: 'strict', path: RUTA_COOKIE });
}

function leerToken(req) {
  const t = req.cookies && req.cookies[COOKIE];
  if (!t || typeof t !== 'string') return null;
  try {
    return jwt.verify(t, CLAVE, { algorithms: ['HS256'] });
  } catch (e) {
    return null;
  }
}

// Defensa extra contra CSRF: un formulario o <img> de otro sitio no puede añadir cabeceras propias.
function exigirCabecera(req, res, next) {
  if (req.get('X-Plataforma') !== '1') return res.status(403).json({ error: 'Petición no permitida' });
  next();
}

async function requirePlataforma(req, res, next) {
  const p = leerToken(req);
  const ahora = Date.now();
  if (!p || !Number.isInteger(p.sid) || typeof p.act !== 'number' || typeof p.ini !== 'number' ||
      ahora - p.act > INACTIVIDAD_MS || ahora - p.ini > DURACION_MAX_MS) {
    borrarCookie(res);
    return res.status(401).json({ error: 'Sesión vencida. Vuelve a iniciar sesión.' });
  }
  const { rows } = await pool.query('SELECT id, usuario, sesion_version FROM superadmins WHERE id = $1', [p.sid]);
  const sa = rows[0];
  if (!sa || sa.sesion_version !== p.sv) {
    borrarCookie(res);
    return res.status(401).json({ error: 'Sesión vencida. Vuelve a iniciar sesión.' });
  }
  req.superadmin = { id: sa.id, usuario: sa.usuario, sv: sa.sesion_version, ini: p.ini };
  emitirCookie(res, { sid: sa.id, sv: sa.sesion_version, ini: p.ini }); // renueva el plazo de inactividad
  next();
}

async function registrarBitacora(req, superadminId, accion, detalle) {
  await pool.query(
    'INSERT INTO plataforma_bitacora (superadmin_id, accion, detalle, ip) VALUES ($1,$2,$3,$4)',
    [superadminId || null, accion, detalle ? String(detalle).slice(0, 500) : null, String(req.ip || '').slice(0, 64)]
  );
}

module.exports = { requirePlataforma, exigirCabecera, emitirCookie, borrarCookie, registrarBitacora };
