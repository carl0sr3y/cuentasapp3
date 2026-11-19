// "Entrar con mi teléfono": abrir la sesión en una computadora sin escribir la contraseña.
//
// 1. La computadora pide un código (POST /solicitar). Recibe un código corto de 8 números (el que se
//    ve en pantalla y va dentro del QR) y un "secreto" largo que SOLO ella conoce.
// 2. En el teléfono, con la sesión ya abierta, la persona escribe el código o escanea el QR, ve qué
//    computadora lo pide (navegador y sistema) y lo aprueba con su huella o su contraseña.
// 3. La computadora pregunta cada 2 segundos (POST /estado, con su secreto). Cuando ya está aprobado,
//    el servidor le entrega la sesión UNA sola vez y el código deja de existir.
//
// Seguridad: el código vence a los 2 minutos y sirve una vez; quien ve el código no puede hacer nada
// sin el teléfono de la persona (y su huella o contraseña); la sesión de la computadora dura máximo
// 12 horas y se puede cerrar a distancia desde el perfil (tabla sesiones_enlazadas).
//
// "Es mi computadora" (recordar): la sesión dura 30 días aunque se cierre el navegador. Al entrar se
// crea un PIN de 6 números SOLO para esa sesión (cifrado; no sirve en ningún otro lado). A los 15
// minutos sin uso el servidor la da por bloqueada (middleware/auth.js) hasta que se escriba el PIN;
// 5 PIN equivocados la cierran y hay que aprobarla otra vez desde el teléfono.
// Los códigos pendientes viven en la memoria del proceso (una sola réplica, igual que lib/webauthn).
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const { verifyAuthenticationResponse, generateAuthenticationOptions } = require('@simplewebauthn/server');
const { pool } = require('../db/pool');
const { requireAuth, requireAuthAunBloqueada, setAuthCookie, verifyToken, COOKIE_NAME } = require('../middleware/auth');
const { compararContrasena } = require('../lib/passwords');
const { setChallenge, takeChallenge, getRpAndOrigin } = require('../lib/webauthn');
const { paramId } = require('../lib/validate');
const limites = require('../lib/rateLimits');

const router = express.Router();
router.param('id', paramId);

const VIGENCIA_MS = 2 * 60 * 1000;      // el código vence a los 2 minutos
const DURACION_SESION_HORAS = 12;       // la sesión de la computadora dura como máximo 12 horas…
const DURACION_RECORDADA_DIAS = 30;     // …o 30 días si es "mi computadora" (con PIN)
const MAX_FALLOS_PIN = 5;
const MAX_PENDIENTES = 2000;

// codigo -> { secreto, dispositivo, creado, vence, estado: 'esperando'|'aprobado'|'rechazado', usuarioId }
const pendientes = new Map();
setInterval(() => {
  const ahora = Date.now();
  for (const [k, v] of pendientes) if (v.vence < ahora) pendientes.delete(k);
}, 30 * 1000).unref();

function nuevoCodigo() {
  for (let i = 0; i < 20; i++) {
    const c = String(crypto.randomInt(0, 100000000)).padStart(8, '0');
    if (!pendientes.has(c)) return c;
  }
  throw new Error('No se pudo generar un código');
}
function limpiarCodigo(c) { return typeof c === 'string' ? c.replace(/\D/g, '') : ''; }

// "Chrome en Windows", "Safari en Mac"… a partir de lo que dice el navegador.
function describirDispositivo(ua) {
  ua = String(ua || '');
  const nav = /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox'
    : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Un navegador';
  const so = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iPhone/iPad'
    : /Mac OS X|Macintosh/.test(ua) ? 'Mac' : /CrOS/.test(ua) ? 'Chromebook' : /Linux/.test(ua) ? 'Linux' : 'una computadora';
  return `${nav} en ${so}`;
}

async function registrarHistorial(empresaId, usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (empresa_id, usuario_id, accion, detalle) VALUES ($1,$2,$3,$4)`,
    [empresaId, usuarioId, accion, detalle]
  );
}

// Busca un código pendiente y vigente (o null).
function buscar(codigo) {
  const p = pendientes.get(limpiarCodigo(codigo));
  if (!p || p.vence < Date.now()) return null;
  return p;
}

// La aprobación solo se hace desde una sesión "normal" (el teléfono), no desde otra computadora
// abierta con este mismo método.
function esSesionDeComputadora(req) {
  const payload = verifyToken(req.cookies[COOKIE_NAME]);
  return !!(payload && payload.enl !== undefined);
}

// ---------- 1) La computadora pide un código (todavía sin sesión) ----------
router.post('/solicitar', limites.enlaceSolicitar, async (req, res) => {
  const codigo = nuevoCodigo();
  const secreto = crypto.randomBytes(32).toString('base64url');
  const ahora = Date.now();
  pendientes.set(codigo, {
    secreto, dispositivo: describirDispositivo(req.get('user-agent')), creado: ahora, vence: ahora + VIGENCIA_MS,
    estado: 'esperando', usuarioId: null,
  });
  while (pendientes.size > MAX_PENDIENTES) pendientes.delete(pendientes.keys().next().value);
  const { origin } = getRpAndOrigin(req);
  const qr = await QRCode.toString(`${origin}/#conectar=${codigo}`, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' });
  res.json({ codigo, secreto, qr, vigenciaSeg: VIGENCIA_MS / 1000 });
});

// ---------- 3) La computadora pregunta si ya se aprobó ----------
router.post('/estado', limites.enlaceEstado, async (req, res) => {
  const { codigo, secreto } = req.body || {};
  const p = typeof secreto === 'string' ? buscar(codigo) : null;
  // El secreto se compara en tiempo constante: sin él, conocer el código no sirve de nada.
  if (!p || p.secreto.length !== secreto.length || !crypto.timingSafeEqual(Buffer.from(p.secreto), Buffer.from(secreto))) {
    return res.json({ estado: 'vencido' });
  }
  if (p.estado === 'esperando') return res.json({ estado: 'esperando' });
  pendientes.delete(limpiarCodigo(codigo)); // se usa una sola vez
  if (p.estado === 'rechazado') return res.json({ estado: 'rechazado' });

  // Aprobado: se revisa otra vez que la cuenta siga activa (empresa no suspendida, etc.).
  const { rows } = await pool.query(
    `SELECT u.id, u.nombre, u.usuario, u.empresa_id, u.rol, u.sesion_version, e.nombre AS empresa_nombre, e.codigo, e.activa
     FROM usuarios u JOIN empresas e ON e.id = u.empresa_id WHERE u.id = $1`,
    [p.usuarioId]
  );
  const u = rows[0];
  if (!u || !u.activa || u.sesion_version !== p.sesionVersion) return res.json({ estado: 'vencido' });
  const recordar = !!p.recordar;
  const { rows: ses } = await pool.query(
    `INSERT INTO sesiones_enlazadas (usuario_id, dispositivo, vence, recordar)
     VALUES ($1, $2, now() + $3 * interval '1 hour', $4) RETURNING id`,
    [u.id, p.dispositivo, recordar ? DURACION_RECORDADA_DIAS * 24 : DURACION_SESION_HORAS, recordar]
  );
  const user = { id: u.id, nombre: u.nombre, usuario: u.usuario, empresa_id: u.empresa_id, rol: u.rol, sesion_version: u.sesion_version };
  setAuthCookie(res, user, { enl: ses[0].id, recordar });
  await registrarHistorial(u.empresa_id, u.id, 'Inicio de sesión',
    `Sesión abierta en una computadora (${p.dispositivo}) aprobada desde el teléfono${recordar ? ', marcada como "es mi computadora" (se queda abierta con PIN)' : ''}`);
  // Si es recordada, la computadora todavía no entra: primero crea su PIN (POST /pin).
  if (recordar) return res.json({ estado: 'crear_pin', nombre: u.nombre });
  res.json({ estado: 'aprobado', user, empresa: { id: u.empresa_id, nombre: u.empresa_nombre, codigo: u.codigo } });
});

// ---------- 2) El teléfono revisa el código y lo aprueba o rechaza ----------
router.post('/revisar', requireAuth, limites.enlaceRevisar, async (req, res) => {
  if (esSesionDeComputadora(req)) return res.status(403).json({ error: 'Esto se aprueba desde tu teléfono, no desde otra computadora.' });
  const p = buscar((req.body || {}).codigo);
  if (!p || p.estado !== 'esperando') return res.status(404).json({ error: 'Ese código no existe o ya venció. Revisa los números o genera uno nuevo en la computadora.' });
  res.json({ dispositivo: p.dispositivo, haceSeg: Math.round((Date.now() - p.creado) / 1000) });
});

// Opciones de huella para confirmar que es la persona (solo sus propias huellas registradas).
router.get('/huella-opciones', requireAuth, async (req, res) => {
  const { rpID } = getRpAndOrigin(req);
  const { rows } = await pool.query('SELECT credential_id, transports FROM webauthn_credentials WHERE usuario_id = $1', [req.user.id]);
  if (!rows.length) return res.status(400).json({ error: 'No tienes huella registrada. Usa tu contraseña.' });
  const options = await generateAuthenticationOptions({
    rpID, userVerification: 'required',
    allowCredentials: rows.map(c => ({ id: c.credential_id, transports: c.transports ? c.transports.split(',') : undefined })),
  });
  setChallenge('enlace:' + req.user.id, options.challenge);
  res.json(options);
});

// Confirma que quien aprueba es la persona: con su huella o con su contraseña.
async function confirmarIdentidad(req) {
  const { huella, contrasena } = req.body || {};
  if (huella && typeof huella === 'object' && typeof huella.id === 'string' && huella.id.length <= 1024) {
    const expectedChallenge = takeChallenge('enlace:' + req.user.id);
    if (!expectedChallenge) return 'La solicitud de huella venció, intenta de nuevo.';
    const { rows } = await pool.query('SELECT * FROM webauthn_credentials WHERE credential_id = $1 AND usuario_id = $2', [huella.id, req.user.id]);
    const cred = rows[0];
    if (!cred) return 'Esa huella no está registrada en tu cuenta.';
    const { rpID, origin } = getRpAndOrigin(req);
    try {
      const v = await verifyAuthenticationResponse({
        response: huella, expectedChallenge, expectedOrigin: origin, expectedRPID: rpID,
        authenticator: {
          credentialID: cred.credential_id, credentialPublicKey: Buffer.from(cred.public_key, 'base64'),
          counter: Number(cred.counter), transports: cred.transports ? cred.transports.split(',') : undefined,
        },
      });
      if (!v.verified) return 'No se pudo verificar la huella.';
      await pool.query('UPDATE webauthn_credentials SET counter = $1 WHERE id = $2', [v.authenticationInfo.newCounter, cred.id]);
      return null;
    } catch (e) { return 'No se pudo verificar la huella.'; }
  }
  if (typeof contrasena === 'string' && contrasena && contrasena.length <= 200) {
    const { rows } = await pool.query('SELECT contrasena FROM usuarios WHERE id = $1', [req.user.id]);
    if (await compararContrasena(contrasena, rows[0] && rows[0].contrasena)) return null;
    return 'La contraseña no es correcta.';
  }
  return 'Confirma con tu huella o tu contraseña.';
}

router.post('/aprobar', requireAuth, limites.enlaceRevisar, async (req, res) => {
  if (esSesionDeComputadora(req)) return res.status(403).json({ error: 'Esto se aprueba desde tu teléfono, no desde otra computadora.' });
  const p = buscar((req.body || {}).codigo);
  if (!p || p.estado !== 'esperando') return res.status(404).json({ error: 'Ese código ya venció. Genera uno nuevo en la computadora.' });
  const problema = await confirmarIdentidad(req);
  if (problema) return res.status(401).json({ error: problema });
  // Se vuelve a revisar: pudo vencer o usarse mientras la persona ponía su huella.
  if (buscar(req.body.codigo) !== p || p.estado !== 'esperando') return res.status(404).json({ error: 'Ese código ya venció. Genera uno nuevo en la computadora.' });
  p.estado = 'aprobado';
  p.recordar = (req.body || {}).recordar === true;
  p.usuarioId = req.user.id;
  p.sesionVersion = req.user.sv;
  p.vence = Math.max(p.vence, Date.now() + 30 * 1000); // margen para que la computadora lo recoja
  res.json({ ok: true, dispositivo: p.dispositivo });
});

router.post('/rechazar', requireAuth, async (req, res) => {
  const p = buscar((req.body || {}).codigo);
  if (p && p.estado === 'esperando') p.estado = 'rechazado';
  res.json({ ok: true });
});

// ---------- Computadoras conectadas: ver y cerrar a distancia ----------
router.get('/sesiones', requireAuth, async (req, res) => {
  const payload = verifyToken(req.cookies[COOKIE_NAME]);
  const { rows } = await pool.query(
    `SELECT id, dispositivo, fecha_creacion, vence, recordar FROM sesiones_enlazadas
     WHERE usuario_id = $1 AND NOT revocada AND vence > now() ORDER BY fecha_creacion DESC`,
    [req.user.id]
  );
  res.json(rows.map(r => ({ ...r, esta: !!(payload && payload.enl === r.id) })));
});

router.delete('/sesiones/:id', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE sesiones_enlazadas SET revocada = true WHERE id = $1 AND usuario_id = $2 AND NOT revocada RETURNING dispositivo',
    [req.params.id, req.user.id]
  );
  if (rows.length) await registrarHistorial(req.user.empresa_id, req.user.id, 'Cerrar sesión', `Sesión de computadora cerrada a distancia (${rows[0].dispositivo})`);
  res.json({ ok: true });
});

// ---------- PIN de "es mi computadora" ----------
function pinValido(pin) { return typeof pin === 'string' && /^\d{6}$/.test(pin); }
// PIN fáciles de adivinar: todos iguales (111111) o seguidos (123456, 987654).
function pinFacil(pin) {
  if (/^(\d)\1{5}$/.test(pin)) return true;
  const d = pin.split('').map(Number);
  const pasos = d.slice(1).map((x, i) => x - d[i]);
  return pasos.every(x => x === 1) || pasos.every(x => x === -1);
}
async function datosEntrada(usuarioId) {
  const { rows } = await pool.query(
    `SELECT u.id, u.nombre, u.usuario, u.empresa_id, u.rol, u.sesion_version, e.nombre AS empresa_nombre, e.codigo
     FROM usuarios u JOIN empresas e ON e.id = u.empresa_id WHERE u.id = $1`, [usuarioId]);
  const u = rows[0];
  return {
    user: { id: u.id, nombre: u.nombre, usuario: u.usuario, empresa_id: u.empresa_id, rol: u.rol, sesion_version: u.sesion_version, recordar: true },
    empresa: { id: u.empresa_id, nombre: u.empresa_nombre, codigo: u.codigo },
  };
}
function soloRecordada(req, res) {
  if (!req.user.enl || !req.user.recordar) { res.status(400).json({ error: 'Esta sesión no usa PIN.' }); return false; }
  return true;
}

// Crear el PIN (solo una vez, justo después de aprobar la computadora desde el teléfono).
router.post('/pin', requireAuthAunBloqueada, async (req, res) => {
  if (!soloRecordada(req, res)) return;
  if (req.bloqueo !== 'CREAR_PIN') return res.status(400).json({ error: 'Esta computadora ya tiene PIN.' });
  const { pin } = req.body || {};
  if (!pinValido(pin)) return res.status(400).json({ error: 'El PIN debe tener 6 números.' });
  if (pinFacil(pin)) return res.status(400).json({ error: 'Ese PIN es muy fácil de adivinar. Elige otro.' });
  const hash = await bcrypt.hash(pin, 10);
  const { rowCount } = await pool.query(
    'UPDATE sesiones_enlazadas SET pin_hash = $1, pin_fallos = 0, ultima_actividad = now() WHERE id = $2 AND pin_hash IS NULL',
    [hash, req.user.enl]
  );
  if (!rowCount) return res.status(400).json({ error: 'Esta computadora ya tiene PIN.' });
  res.json(await datosEntrada(req.user.id));
});

// Desbloquear con el PIN. 5 equivocados seguidos cierran la sesión de esta computadora.
router.post('/desbloquear', requireAuthAunBloqueada, async (req, res) => {
  if (!soloRecordada(req, res)) return;
  if (req.bloqueo === 'CREAR_PIN') return res.status(423).json({ error: 'Crea el PIN de esta computadora para continuar.', codigo: 'CREAR_PIN' });
  const { pin } = req.body || {};
  const { rows } = await pool.query('SELECT pin_hash, dispositivo FROM sesiones_enlazadas WHERE id = $1', [req.user.enl]);
  if (pinValido(pin) && rows[0] && await bcrypt.compare(pin, rows[0].pin_hash)) {
    await pool.query('UPDATE sesiones_enlazadas SET pin_fallos = 0, ultima_actividad = now() WHERE id = $1', [req.user.enl]);
    return res.json(await datosEntrada(req.user.id));
  }
  const { rows: f } = await pool.query(
    'UPDATE sesiones_enlazadas SET pin_fallos = pin_fallos + 1 WHERE id = $1 RETURNING pin_fallos', [req.user.enl]);
  const fallos = f[0] ? f[0].pin_fallos : MAX_FALLOS_PIN;
  if (fallos >= MAX_FALLOS_PIN) {
    await pool.query('UPDATE sesiones_enlazadas SET revocada = true WHERE id = $1', [req.user.enl]);
    await registrarHistorial(req.user.empresa_id, req.user.id, 'Cerrar sesión',
      `Sesión de computadora cerrada por ${MAX_FALLOS_PIN} PIN equivocados (${rows[0] ? rows[0].dispositivo : 'computadora'})`);
    return res.status(401).json({ error: `PIN equivocado ${MAX_FALLOS_PIN} veces: se cerró la sesión en esta computadora. Vuelve a entrar con tu teléfono.`, codigo: 'SESION' });
  }
  const quedan = MAX_FALLOS_PIN - fallos;
  res.status(400).json({ error: `PIN equivocado. Te ${quedan === 1 ? 'queda 1 intento' : `quedan ${quedan} intentos`}.` });
});

// La computadora avisa que la están usando (como mucho una vez por minuto). Las consultas de fondo no
// cuentan como uso: solo esto mantiene la sesión sin bloquearse.
router.post('/latido', requireAuth, async (req, res) => {
  if (req.user.enl && req.user.recordar) {
    await pool.query('UPDATE sesiones_enlazadas SET ultima_actividad = now() WHERE id = $1', [req.user.enl]);
  }
  res.json({ ok: true });
});

// La computadora se bloqueó sola (15 minutos sin uso en la pantalla): se bloquea también en el servidor.
router.post('/bloquear', requireAuthAunBloqueada, async (req, res) => {
  if (req.user.enl && req.user.recordar) {
    await pool.query("UPDATE sesiones_enlazadas SET ultima_actividad = now() - interval '1 day' WHERE id = $1", [req.user.enl]);
  }
  res.json({ ok: true });
});

module.exports = router;
