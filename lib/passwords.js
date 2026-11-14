// Reglas de contraseña compartidas por el login normal, la huella y el panel de plataforma.
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const SEIS_MESES_MS = 1000 * 60 * 60 * 24 * 182;

// Si el usuario debe cambiar su contraseña antes de entrar, devuelve el mensaje a mostrar; si no, null.
function motivoCambioObligatorio(dbUser) {
  if (dbUser.debe_cambiar_contrasena) {
    return 'Tu contraseña fue restablecida por un administrador. Elige una contraseña nueva para continuar.';
  }
  if (Date.now() - new Date(dbUser.contrasena_actualizada_en).getTime() > SEIS_MESES_MS) {
    return 'Tu contraseña tiene más de 6 meses. Debes actualizarla para continuar.';
  }
  return null;
}

// Contraseña temporal fácil de dictar: sin caracteres que se confunden (0/O, 1/l/I).
const ALFABETO_TEMP = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
function generarContrasenaTemporal(largo = 12) {
  let s = '';
  for (let i = 0; i < largo; i++) s += ALFABETO_TEMP[crypto.randomInt(ALFABETO_TEMP.length)];
  return s;
}

// Compara contra un hash falso cuando el usuario no existe, para que la respuesta tarde lo mismo
// y no se pueda adivinar qué usuarios existen midiendo el tiempo (V11).
const HASH_FALSO = bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10);
async function compararContrasena(plano, hash) {
  const ok = await bcrypt.compare(plano, hash || HASH_FALSO);
  return Boolean(hash) && ok;
}

module.exports = { motivoCambioObligatorio, generarContrasenaTemporal, compararContrasena };
