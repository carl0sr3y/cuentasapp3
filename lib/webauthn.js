// Guarda temporalmente los "challenges" de WebAuthn mientras el navegador
// completa el registro o el inicio de sesión con huella (duran 5 minutos).
const store = new Map();
const TTL_MS = 5 * 60 * 1000;
// Tope de desafíos pendientes: antes nunca se borraban los que no se usaban y cualquiera podía
// inflar la memoria del servidor pidiendo opciones de huella sin parar (auditoría V12).
const MAX_PENDIENTES = 5000;

function setChallenge(key, challenge) {
  store.delete(key); // así la clave queda al final (más reciente) en el orden del Map
  store.set(key, { challenge, expires: Date.now() + TTL_MS });
  while (store.size > MAX_PENDIENTES) store.delete(store.keys().next().value); // descarta el más viejo
}

// Limpieza periódica de los vencidos. unref(): no impide que el proceso termine.
setInterval(() => {
  const ahora = Date.now();
  for (const [k, v] of store) if (v.expires < ahora) store.delete(k);
}, 60 * 1000).unref();
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
