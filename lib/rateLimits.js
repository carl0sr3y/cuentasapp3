// Límites de intentos (anti fuerza bruta y anti abuso). Se guardan en la memoria del proceso:
// suficiente mientras la app corra como UNA sola réplica en Railway. Si algún día se escalan
// réplicas, habría que moverlos a un almacén compartido (p. ej. Redis).
const rateLimit = require('express-rate-limit');

const MIN = 60 * 1000;

function limitador({ windowMs, limit, mensaje, ...resto }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: mensaje },
    ...resto,
  });
}

function norm(v) {
  return typeof v === 'string' ? v.trim().toLowerCase().slice(0, 254) : '';
}

// Clave por cuenta (empresa + usuario/correo): frena ataques repartidos entre muchas IPs.
// Si el cuerpo no trae los datos, se cae a la IP para no agrupar a todos en una misma clave.
function porCuenta(campo) {
  return (req) => {
    const b = req.body || {};
    const empresa = norm(b.codigoEmpresa);
    const quien = norm(b[campo]);
    return empresa && quien ? `${campo}:${empresa}:${quien}` : `ip:${req.ip}`;
  };
}

const MSG_LOGIN = 'Demasiados intentos fallidos. Espera unos minutos y vuelve a intentarlo.';

module.exports = {
  // Tope general para toda la API, por IP (tráfico basura / scripts).
  api: limitador({ windowMs: 1 * MIN, limit: 600, mensaje: 'Demasiadas peticiones. Espera un momento.' }),

  // Inicio de sesión: solo cuentan los intentos fallidos.
  loginIp: limitador({ windowMs: 15 * MIN, limit: 10, skipSuccessfulRequests: true, mensaje: MSG_LOGIN }),
  loginCuenta: limitador({ windowMs: 15 * MIN, limit: 20, skipSuccessfulRequests: true, mensaje: MSG_LOGIN, keyGenerator: porCuenta('usuario') }),


  // Opciones de huella sin sesión (cada llamada guarda un challenge en memoria).
  webauthnOpciones: limitador({ windowMs: 1 * MIN, limit: 30, mensaje: 'Demasiadas peticiones. Espera un momento.' }),

  // Informes de la política de contenido (CSP) que envían los navegadores.
  cspReport: limitador({ windowMs: 1 * MIN, limit: 30, mensaje: 'Demasiadas peticiones.' }),

  // Panel de plataforma: mucho más estricto. Cuentan solo los fallos.
  plataformaLoginIp: limitador({ windowMs: 15 * MIN, limit: 5, skipSuccessfulRequests: true, mensaje: MSG_LOGIN }),
  // Tope global (todas las IPs juntas) para que un ataque repartido tampoco avance.
  plataformaLoginGlobal: limitador({ windowMs: 60 * MIN, limit: 20, skipSuccessfulRequests: true, mensaje: MSG_LOGIN, keyGenerator: () => 'plataforma-global' }),
};
