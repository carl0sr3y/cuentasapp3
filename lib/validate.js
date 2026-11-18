// Validaciones pequeñas para entradas del usuario. Todo lo que llegue en req.body o
// req.params puede ser de cualquier tipo (número, objeto, arreglo...), no solo texto.

// Texto obligatorio, ya recortado; null si no es texto, está vacío o supera `max`.
function texto(v, max = 200) {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (!t || t.length > max) return null;
  return t;
}

// Texto opcional: '' si viene vacío/ausente, null si viene con un tipo o largo inválido.
function textoOpcional(v, max = 500) {
  if (v === undefined || v === null || v === '') return '';
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length > max ? null : t;
}

// Entero positivo dentro del rango de INTEGER de Postgres; null si no lo es.
function idValido(v) {
  const s = typeof v === 'number' ? String(v) : v;
  if (typeof s !== 'string' || !/^[1-9]\d{0,9}$/.test(s)) return null;
  const n = Number(s);
  return n <= 2147483647 ? n : null;
}

// Monto positivo con 2 decimales. Tope de Q1.000.000.000 (las columnas son NUMERIC(12,2)).
const MONTO_MAX = 1e9;
function montoValido(v) {
  const n = typeof v === 'string' ? Number(v.trim()) : v;
  if (typeof n !== 'number' || !Number.isFinite(n)) return null;
  const abs = Math.round(Math.abs(n) * 100) / 100;
  if (abs <= 0 || abs > MONTO_MAX) return null;
  return abs;
}

// Middleware para router.param: responde 400 si un parámetro de ruta (:id, :movId...) no es un id válido.
function paramId(req, res, next, value, name) {
  const n = idValido(value);
  if (n === null) return res.status(400).json({ error: 'Identificador inválido' });
  req.params[name] = n;
  next();
}

// Usuario para entrar (lo que va antes de la @): minúsculas, números, punto, guion y guion bajo.
// Sin espacios ni "@", para que "usuario@empresa" no sea ambiguo.
const RE_USUARIO = /^[a-z0-9._-]{1,60}$/;
function usuarioValido(v) { return typeof v === 'string' && RE_USUARIO.test(v) ? v : null; }

// Marca de envío que manda la app para no guardar dos veces el mismo intento (ver db/schema.sql).
// undefined → sin marca (apps viejas); false → inválida.
function claveEnvio(v) {
  if (v === undefined || v === null || v === '') return undefined;
  return typeof v === 'string' && /^[A-Za-z0-9-]{8,64}$/.test(v) ? v : false;
}

module.exports = { texto, textoOpcional, idValido, montoValido, paramId, MONTO_MAX, usuarioValido, claveEnvio };
