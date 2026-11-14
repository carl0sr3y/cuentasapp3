// Express 4 no captura los errores de los handlers `async`: una promesa rechazada
// queda sin manejar y, en Node moderno, TERMINA el proceso (tumba la app para todos).
// Este parche hace que cualquier handler/middleware que devuelva una promesa rechazada
// pase el error a next(err), donde lo atiende el manejador global de server.js.
// Debe cargarse antes de registrar las rutas.
const Layer = require('express/lib/router/layer');

Layer.prototype.handle_request = function handle(req, res, next) {
  const fn = this.handle;
  if (fn.length > 3) return next(); // es un manejador de errores; no aplica aquí
  try {
    const ret = fn(req, res, next);
    if (ret && typeof ret.then === 'function') ret.then(undefined, next);
  } catch (err) {
    next(err);
  }
};
