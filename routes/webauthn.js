const express = require('express');
const crypto = require('crypto');
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const { pool } = require('../db/pool');
const { requireAuth, setAuthCookie } = require('../middleware/auth');
const { setChallenge, takeChallenge, getRpAndOrigin } = require('../lib/webauthn');

const router = express.Router();

const SEIS_MESES_MS = 1000 * 60 * 60 * 24 * 182;
function passwordVencida(fecha) {
  return Date.now() - new Date(fecha).getTime() > SEIS_MESES_MS;
}
async function registrarHistorial(usuarioId, accion, detalle) {
  await pool.query(
    `INSERT INTO historial_general (usuario_id, accion, detalle) VALUES ($1,$2,$3)`,
    [usuarioId, accion, detalle]
  );
}

// ---------- Registrar la huella de ESTE dispositivo (requiere sesión ya iniciada) ----------
router.get('/register-options', requireAuth, async (req, res) => {
  const { rpID } = getRpAndOrigin(req);
  const { rows: existentes } = await pool.query(
    'SELECT credential_id, transports FROM webauthn_credentials WHERE usuario_id = $1',
    [req.user.id]
  );
  const options = await generateRegistrationOptions({
    rpName: 'Cuentas-App',
    rpID,
    userName: req.user.usuario,
    userID: Buffer.from(String(req.user.id)),
    userDisplayName: req.user.nombre,
    attestationType: 'none',
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'required' },
    excludeCredentials: existentes.map(c => ({
      id: c.credential_id,
      transports: c.transports ? c.transports.split(',') : undefined,
    })),
  });
  setChallenge('reg:' + req.user.id, options.challenge);
  res.json(options);
});

router.post('/register-verify', requireAuth, async (req, res) => {
  const { response, deviceName } = req.body || {};
  const { rpID, origin } = getRpAndOrigin(req);
  const expectedChallenge = takeChallenge('reg:' + req.user.id);
  if (!expectedChallenge) return res.status(400).json({ error: 'La solicitud venció, intenta de nuevo' });

  let verification;
  try {
    verification = await verifyRegistrationResponse({ response, expectedChallenge, expectedOrigin: origin, expectedRPID: rpID });
  } catch (e) {
    return res.status(400).json({ error: 'No se pudo verificar la huella' });
  }
  if (!verification.verified || !verification.registrationInfo) {
    return res.status(400).json({ error: 'No se pudo verificar la huella' });
  }
  const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;
  const transports = (response.response && response.response.transports) || [];
  await pool.query(
    `INSERT INTO webauthn_credentials (usuario_id, credential_id, public_key, counter, transports, device_name)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [req.user.id, credentialID, Buffer.from(credentialPublicKey).toString('base64'), counter, transports.join(','), (deviceName || 'Este dispositivo').slice(0, 60)]
  );
  await registrarHistorial(req.user.id, 'Huella registrada', `Huella/Face ID agregada para "${deviceName || 'este dispositivo'}"`);
  res.json({ ok: true });
});

// ---------- Ver / eliminar los dispositivos con huella registrada ----------
router.get('/credentials', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, device_name, fecha_creacion FROM webauthn_credentials WHERE usuario_id = $1 ORDER BY fecha_creacion DESC',
    [req.user.id]
  );
  res.json(rows);
});
router.delete('/credentials/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM webauthn_credentials WHERE id = $1 AND usuario_id = $2', [req.params.id, req.user.id]);
  res.json({ ok: true });
});

// ---------- Iniciar sesión con huella (todavía sin sesión) ----------
router.get('/login-options', async (req, res) => {
  const { rpID } = getRpAndOrigin(req);
  const options = await generateAuthenticationOptions({ rpID, userVerification: 'required' });
  const requestId = crypto.randomUUID();
  setChallenge('login:' + requestId, options.challenge);
  res.json({ options, requestId });
});

router.post('/login-verify', async (req, res) => {
  const { requestId, response } = req.body || {};
  const expectedChallenge = requestId ? takeChallenge('login:' + requestId) : null;
  if (!expectedChallenge) return res.status(400).json({ error: 'La solicitud venció, intenta de nuevo' });

  const { rows: credRows } = await pool.query('SELECT * FROM webauthn_credentials WHERE credential_id = $1', [response && response.id]);
  const cred = credRows[0];
  if (!cred) return res.status(400).json({ error: 'Esta huella no está registrada en ningún dispositivo de la app' });

  const { rows: userRows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [cred.usuario_id]);
  const dbUser = userRows[0];
  if (!dbUser) return res.status(400).json({ error: 'Usuario no encontrado' });

  if (passwordVencida(dbUser.contrasena_actualizada_en)) {
    return res.status(403).json({ error: 'passwordExpired', usuario: dbUser.usuario, message: 'Tu contraseña tiene más de 6 meses. Inicia sesión con tu contraseña para renovarla antes de volver a usar la huella.' });
  }

  const { rpID, origin } = getRpAndOrigin(req);
  const authenticator = {
    credentialID: cred.credential_id,
    credentialPublicKey: Buffer.from(cred.public_key, 'base64'),
    counter: Number(cred.counter),
    transports: cred.transports ? cred.transports.split(',') : undefined,
  };
  let verification;
  try {
    verification = await verifyAuthenticationResponse({ response, expectedChallenge, expectedOrigin: origin, expectedRPID: rpID, authenticator });
  } catch (e) {
    return res.status(401).json({ error: 'No se pudo verificar la huella' });
  }
  if (!verification.verified) return res.status(401).json({ error: 'No se pudo verificar la huella' });

  await pool.query('UPDATE webauthn_credentials SET counter = $1 WHERE id = $2', [verification.authenticationInfo.newCounter, cred.id]);
  const user = { id: dbUser.id, nombre: dbUser.nombre, usuario: dbUser.usuario };
  setAuthCookie(res, user);
  await registrarHistorial(user.id, 'Inicio de sesión', 'Sesión iniciada con huella/Face ID');
  res.json({ user });
});

module.exports = router;
