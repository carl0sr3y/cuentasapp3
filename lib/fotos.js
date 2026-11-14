// Fotos de factura: la app las comprime en el navegador y siempre las envía como JPEG en base64.
// Aquí se acepta SOLO eso. Antes se aceptaba cualquier texto y se insertaba tal cual en la página
// del administrador, lo que permitía ejecutar código en su sesión (auditoría V5).
const PREFIJO = 'data:image/jpeg;base64,';
// La app las comprime a 1000 px de ancho (≈100–300 KB); 1,5 MB deja margen de sobra y evita
// que alguien llene la base (y el volumen de Railway) subiendo archivos enormes (auditoría V8).
const MAX_BYTES = 1.5 * 1024 * 1024;
const RE_DATA_URL_JPEG = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/;

// Devuelve { foto } si es válida (o null si no viene), o { error } con el mensaje para el usuario.
function validarFoto(foto) {
  if (foto === undefined || foto === null || foto === '') return { foto: null };
  if (typeof foto !== 'string') return { error: 'Foto inválida' };
  if (foto.length > MAX_BYTES) return { error: 'La foto es demasiado grande' };
  if (!RE_DATA_URL_JPEG.test(foto)) return { error: 'La foto debe ser una imagen JPEG' };
  // Los primeros bytes de todo JPEG real son FF D8 FF.
  const inicio = Buffer.from(foto.slice(PREFIJO.length, PREFIJO.length + 8), 'base64');
  if (inicio.length < 3 || inicio[0] !== 0xff || inicio[1] !== 0xd8 || inicio[2] !== 0xff) {
    return { error: 'La foto debe ser una imagen JPEG' };
  }
  return { foto };
}

module.exports = { validarFoto, RE_DATA_URL_JPEG };
