// Guarda temporalmente los "challenges" de WebAuthn mientras el navegador
// completa el registro o el inicio de sesión con huella (duran 5 minutos).
const store = new Map();
const TTL_MS = 5 * 60 * 1000;

function setChallenge(key, challenge) {
  store.set(key, { challenge, expires: Date.now() + TTL_MS });
}
function takeChallenge(key) {
  const entry = store.get(key);
  store.delete(key);
  if (!entry || entry.expires < Date.now()) return null;
  return entry.challenge;
}

// El dominio (rpID) y el origen exacto se derivan de la propia petición,
// para que funcione igual sin importar el dominio de Railway que uses.
function getRpAndOrigin(req) {
  return { rpID: req.hostname, origin: `${req.protocol}://${req.get('host')}` };
}

module.exports = { setChallenge, takeChallenge, getRpAndOrigin };
