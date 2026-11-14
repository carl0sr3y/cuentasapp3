const crypto = require('crypto');

// Producción = NODE_ENV=production, o estamos corriendo dentro de Railway
// (Railway siempre define RAILWAY_ENVIRONMENT_NAME / RAILWAY_ENVIRONMENT).
const IS_PROD =
  process.env.NODE_ENV === 'production' ||
  Boolean(process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_ENVIRONMENT);

// Valor que antes venía escrito en el código: nunca debe aceptarse.
const SECRETO_INSEGURO = 'dev-secret-cambia-esto';

function resolverJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s || s === SECRETO_INSEGURO) {
    if (IS_PROD) {
      console.error(
        'FATAL: falta JWT_SECRET (o tiene el valor de ejemplo). La app NO arranca sin él en producción.\n' +
        'En Railway: servicio de la app → Variables → JWT_SECRET = una cadena aleatoria de 64+ caracteres.'
      );
      process.exit(1);
    }
    console.warn('[dev] JWT_SECRET no definido: se usa uno aleatorio temporal (las sesiones se pierden al reiniciar).');
    return crypto.randomBytes(48).toString('hex');
  }
  if (s.length < 32) {
    console.warn('ADVERTENCIA: JWT_SECRET es corto (menos de 32 caracteres). Cámbialo por uno aleatorio de 64+ caracteres.');
  }
  return s;
}

const JWT_SECRET = resolverJwtSecret();

module.exports = { IS_PROD, JWT_SECRET };
