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
const { crearBackup, limpiarBackupsVencidos, limpiarHistorialSemanal } = require('./jobs/backup');

const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const cuentasRoutes = require('./routes/cuentas');
const tiendaRoutes = require('./routes/tienda');
const historialRoutes = require('./routes/historial');
const reportesRoutes = require('./routes/reportes');
const backupsRoutes = require('./routes/backups');

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

  // Limpieza de backups vencidos al arrancar, y luego cada hora.
  limpiarBackupsVencidos().catch(e => console.error('Error limpiando backups:', e.message));
  cron.schedule('0 * * * *', () => {
    limpiarBackupsVencidos().catch(e => console.error('Error limpiando backups:', e.message));
  });

  // Backup diario a las 11:30pm hora de Guatemala.
  cron.schedule('30 23 * * *', () => {
    crearBackup().catch(e => console.error('Error creando backup:', e.message));
  }, { timezone: 'America/Guatemala' });

    // Borra el historial general cada domingo a las 11:30pm (hora Guatemala).
  cron.schedule('30 23 * * 0', () => {
    limpiarHistorialSemanal().catch(e => console.error('Error limpiando historial:', e.message));
  }, { timezone: 'America/Guatemala' });

  server.listen(PORT, () => console.log(`Cuentas-App escuchando en el puerto ${PORT}`));
}

start();
