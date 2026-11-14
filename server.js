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
const { limpiarHistorialRodante, crearBackupGeneral, crearBackupTienda } = require('./jobs/backup');

const authRoutes = require('./routes/auth');
const empresasRoutes = require('./routes/empresas');
const usuariosRoutes = require('./routes/usuarios');
const cuentasRoutes = require('./routes/cuentas');
const tiendaRoutes = require('./routes/tienda');
const historialRoutes = require('./routes/historial');
const reportesRoutes = require('./routes/reportes');
const backupsRoutes = require('./routes/backups');
const pushRoutes = require('./routes/push');
const webauthnRoutes = require('./routes/webauthn');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // detrás del proxy de Railway; necesario para que WebAuthn detecte bien el protocolo/origen
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  const payload = verifyToken(req.cookies[COOKIE_NAME]); // null si no hay token o es inválido/expirado
  if (payload) req.user = payload;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cuentas', cuentasRoutes);
app.use('/api/tienda', tiendaRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/backups', backupsRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/webauthn', webauthnRoutes);

app.use(express.static(path.join(__dirname, 'public')));
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

  // Backup de tienda (con fotos y resumen): el día 1 de cada mes a las 00:05,
  // archiva el mes que acaba de terminar y lo borra de la tabla en vivo. Guarda 2 meses.
  cron.schedule('5 0 1 * *', () => {
    crearBackupTienda().catch(e => console.error('Error creando backup de tienda:', e.message));
  }, { timezone: 'America/Guatemala' });

  server.listen(PORT, () => console.log(`Cuentas-App escuchando en el puerto ${PORT}`));
}

start();
