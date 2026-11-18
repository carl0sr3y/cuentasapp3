require('dotenv').config();
require('./lib/asyncErrors'); // debe ir antes de cargar las rutas: errores de handlers async -> next(err)
const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');

const { pool, migrate } = require('./db/pool');
const { COOKIE_NAME, verifyToken } = require('./middleware/auth');
const realtime = require('./lib/realtime');
const limites = require('./lib/rateLimits');
const { limpiarHistorialRodante, crearBackupGeneral, asegurarRespaldosTienda, convertirRespaldosViejos } = require('./jobs/backup');

const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const enviosRoutes = require('./routes/envios');
const diagnosticoRoutes = require('./routes/diagnostico');
const cuentasRoutes = require('./routes/cuentas');
const tiendaRoutes = require('./routes/tienda');
const historialRoutes = require('./routes/historial');
const reportesRoutes = require('./routes/reportes');
const backupsRoutes = require('./routes/backups');
const pushRoutes = require('./routes/push');
const webauthnRoutes = require('./routes/webauthn');
const plataformaRoutes = require('./routes/plataforma');
const { IS_PROD } = require('./lib/config');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // detrás del proxy de Railway; necesario para que WebAuthn detecte bien el protocolo/origen
const PORT = process.env.PORT || 3000;

// Cabeceras de seguridad para toda la app (auditoría V14).
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',                       // nadie puede incrustar la app (clickjacking)
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(self), microphone=(), geolocation=(), payment=()',
  });
  if (IS_PROD) res.set('Strict-Transport-Security', 'max-age=15552000'); // 180 días solo HTTPS
  next();
});

// Política de contenido (CSP) de la app de empresas. Por defecto en MODO OBSERVACIÓN: no bloquea
// nada, solo informa en los logs ("CSP (modo observación)") lo que bloquearía. Con la variable
// CSP_MODO=bloquear en Railway pasa a bloquear de verdad (lo recomendado una vez revisados los logs);
// si algo fallara, basta con quitar la variable para volver a observación, sin tocar código.
const CSP_APP = [
  "default-src 'self'",
  "script-src 'self' https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  'report-uri /csp-report',
].join('; ');
const CSP_BLOQUEA = process.env.CSP_MODO === 'bloquear';
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/plataforma')) {
    res.set(CSP_BLOQUEA ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only', CSP_APP);
  }
  next();
});
const avisosCsp = new Set();
app.post('/csp-report', limites.cspReport,
  express.json({ type: ['application/csp-report', 'application/reports+json', 'application/json'], limit: '20kb' }),
  (req, res) => {
    const r = (req.body && (req.body['csp-report'] || (Array.isArray(req.body) && req.body[0] && req.body[0].body))) || {};
    const directiva = String(r['violated-directive'] || r.effectiveDirective || r['effective-directive'] || '?').slice(0, 80);
    const bloqueado = String(r['blocked-uri'] || r.blockedURL || '?').slice(0, 200);
    const clave = directiva + ' ' + bloqueado;
    if (!avisosCsp.has(clave) && avisosCsp.size < 200) { // cada aviso distinto se registra una sola vez
      avisosCsp.add(clave);
      console.warn(CSP_BLOQUEA ? `CSP bloqueó: ${directiva} → ${bloqueado}` : `CSP (modo observación) bloquearía: ${directiva} → ${bloqueado}`);
    }
    res.status(204).end();
  });

// Las fotos de factura (máx. 1,5 MB) son lo más grande que se envía; 2 MB deja margen.
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  const payload = verifyToken(req.cookies[COOKIE_NAME]); // null si no hay token o es inválido/expirado
  if (payload) req.user = payload;
  next();
});

// Chequeo de salud para Railway: responde 200 solo si la base de datos contesta. Durante un
// deploy, Railway espera este 200 antes de mandar tráfico a la versión nueva (si falla, sigue la anterior).
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.set('Cache-Control', 'no-store').json({ ok: true });
  } catch (e) {
    res.status(503).json({ ok: false });
  }
});

app.use('/api', limites.api);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cuentas', cuentasRoutes);
app.use('/api/tienda', tiendaRoutes);
app.use('/api/envios', enviosRoutes);
app.use('/api/diagnostico', diagnosticoRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/backups', backupsRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/webauthn', webauthnRoutes);

// ---------- Panel de plataforma (superadmin) ----------
// Cabeceras estrictas: no se guarda en caché, no se puede incrustar en otro sitio, no se indexa,
// y la página solo puede cargar scripts y estilos propios (CSP).
function cabecerasPlataforma(req, res, next) {
  res.set({
    'Cache-Control': 'no-store',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'; object-src 'none'",
  });
  next();
}
app.use('/api/plataforma', cabecerasPlataforma, plataformaRoutes);
app.use('/plataforma', cabecerasPlataforma, express.static(path.join(__dirname, 'plataforma'), { index: 'index.html', redirect: true }));

app.use(express.static(path.join(__dirname, 'public')));
// Cualquier dirección /api/... que no existe responde 404 (no la página de la app).
app.use('/api', (req, res) => res.status(404).json({ error: 'No encontrado' }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejador global de errores: cualquier error en una ruta termina aquí en vez de tumbar el proceso.
// Nunca se envían detalles internos al cliente.
const ERRORES_PG_DE_ENTRADA = {
  '22P02': 400, // texto que no es número / formato inválido
  '22003': 400, // número fuera de rango (p. ej. saldo demasiado grande)
  '22001': 400, // texto demasiado largo para la columna
  '23503': 409, // referencia a algo que ya no existe (p. ej. usuario eliminado)
  '23505': 409, // duplicado
};
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let status = 500;
  if (err && Number.isInteger(err.status || err.statusCode) && (err.status || err.statusCode) >= 400 && (err.status || err.statusCode) < 500) {
    status = err.status || err.statusCode; // p. ej. JSON mal formado (400) o cuerpo demasiado grande (413)
  } else if (err && ERRORES_PG_DE_ENTRADA[err.code]) {
    status = ERRORES_PG_DE_ENTRADA[err.code];
  }
  if (status >= 500) console.error(`Error en ${req.method} ${req.originalUrl}:`, err);
  if (res.headersSent) return; // la respuesta ya salió; solo se registra
  const mensajes = { 400: 'Datos inválidos', 409: 'La operación no se pudo completar por un conflicto con los datos', 413: 'La petición es demasiado grande' };
  res.status(status).json({ error: mensajes[status] || (status < 500 ? 'Petición inválida' : 'Error interno del servidor') });
});

// Últimas redes de seguridad: registrar sin dejar caer la app por una promesa olvidada.
process.on('unhandledRejection', (reason) => {
  console.error('Promesa rechazada sin manejar:', reason);
});

const server = http.createServer(app);
realtime.attach(server);

async function start() {
  try {
    await migrate();
  } catch (e) {
    console.error('Error al migrar la base de datos:', e.message);
    process.exit(1);
  }

  // Historial general: cada día a las 11:45pm se recorta a los últimos 7 días.
  cron.schedule('45 23 * * *', () => {
    limpiarHistorialRodante().catch(e => console.error('Error limpiando historial:', e.message));
  }, { timezone: 'America/Guatemala' });

  // Backup general (cuentas + movimientos + historial): cada domingo a las 11:59pm,
  // cierra la semana lunes-domingo. Guarda las últimas 4 semanas.
  cron.schedule('59 23 * * 0', () => {
    crearBackupGeneral().catch(e => console.error('Error creando backup general:', e.message));
  }, { timezone: 'America/Guatemala' });

  // Respaldos de tienda (con fotos y resumen): cada día a las 00:01 se revisan. El día 1 crea el del
  // mes que terminó; además rehace los desactualizados, quita de la pestaña los meses que ya no se ven
  // y borra los de más de 5 meses ya descargados. Ver jobs/backup.js y mejoras/TIENDA.md #9.
  cron.schedule('1 0 * * *', () => {
    asegurarRespaldosTienda().catch(e => console.error('Error con los respaldos de tienda:', e.message));
  }, { timezone: 'America/Guatemala' });
  // También al arrancar, por si el servidor estaba apagado a esa hora. Antes, los respaldos viejos
  // (todo el mes en un solo bloque) se pasan al formato por partes, uno por uno.
  convertirRespaldosViejos()
    .catch(e => console.error('Error convirtiendo respaldos de tienda:', e.message))
    .then(() => asegurarRespaldosTienda())
    .catch(e => console.error('Error con los respaldos de tienda:', e.message));

  server.listen(PORT, () => console.log(`Kaab escuchando en el puerto ${PORT}`));
}

start();
