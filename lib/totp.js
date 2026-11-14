// Códigos de 6 dígitos para apps autenticadoras (Google/Microsoft Authenticator, etc.).
// Implementa TOTP (RFC 6238) con HMAC-SHA1 y pasos de 30 segundos, que es lo que esas apps usan.
const crypto = require('crypto');

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const PASO_SEG = 30;

function base32Encode(buf) {
  let bits = 0, valor = 0, out = '';
  for (const byte of buf) {
    valor = (valor << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALFABETO[(valor >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALFABETO[(valor << (5 - bits)) & 31];
  return out;
}

function base32Decode(str) {
  const limpio = String(str).toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0, valor = 0;
  const out = [];
  for (const c of limpio) {
    const i = ALFABETO.indexOf(c);
    if (i === -1) throw new Error('Secreto base32 inválido');
    valor = (valor << 5) | i;
    bits += 5;
    if (bits >= 8) {
      out.push((valor >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

function hotp(clave, contador, digitos = 6) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(contador));
  const h = crypto.createHmac('sha1', clave).update(msg).digest();
  const o = h[h.length - 1] & 0x0f;
  const num = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(num % 10 ** digitos).padStart(digitos, '0');
}

function generarSecreto() {
  return base32Encode(crypto.randomBytes(20)); // 160 bits, lo recomendado por el RFC
}

function pasoActual(ahoraMs = Date.now()) {
  return Math.floor(ahoraMs / 1000 / PASO_SEG);
}

// Devuelve el número de paso que coincidió (para impedir reutilizarlo) o null.
// Acepta el paso anterior y el siguiente para tolerar relojes un poco desfasados.
function verificar(secretoBase32, codigo, ahoraMs = Date.now()) {
  if (typeof codigo !== 'string' || !/^\d{6}$/.test(codigo)) return null;
  const clave = base32Decode(secretoBase32);
  const actual = pasoActual(ahoraMs);
  for (const delta of [-1, 0, 1]) {
    const esperado = Buffer.from(hotp(clave, actual + delta));
    if (crypto.timingSafeEqual(esperado, Buffer.from(codigo))) return actual + delta;
  }
  return null;
}

function uriOtpauth(secreto, cuenta, emisor = 'Kaab') {
  const etiqueta = encodeURIComponent(`${emisor}:${cuenta}`);
  return `otpauth://totp/${etiqueta}?secret=${secreto}&issuer=${encodeURIComponent(emisor)}&algorithm=SHA1&digits=6&period=${PASO_SEG}`;
}

module.exports = { generarSecreto, verificar, uriOtpauth, hotp, base32Encode, base32Decode, pasoActual };
