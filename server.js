require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');

const { pool, migrate } = require('./db/pool');
const { COOKIE_NAME } = require('./middleware/auth');
const realtime = require('./lib/realtime');
const { limpiarHistorialRodante, crearBackupGeneral, crearBackupTienda } = require('./jobs/backup');

const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const cuentasRoutes = require('./routes/cuentas');
const tiendaRoutes = require('./routes/tienda');
const historialRoutes = require('./routes/historial');
const reportesRoutes = require('./routes/reportes');
const backupsRoutes = require('./routes/backups');
const pushRoutes = require('./routes/push');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-cambia-esto';

app.use(express.json());
app.use(cookieParser());

// Adjunta el usuario autenticado a req.user si el cookie es válido (para /api/auth/status)
app.use((req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (token) {
    try { req.user = jwt.verify(token, JWT_SECRET); } catch (e) { /* token inválido o expirado, se ignora */ }
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cuentas', cuentasRoutes);
app.use('/api/tienda', tiendaRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/backups', backupsRoutes);
app.use('/api/push', pushRoutes);

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
