const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// ---------- Backup general (semanal, 4 semanas) ----------
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, size_bytes, fecha_creacion FROM backups WHERE tipo = 'general' ORDER BY fecha_creacion DESC`
  );
  res.json(rows);
});

router.get('/:id/download', async (req, res) => {
  const { rows } = await pool.query("SELECT data, nombre FROM backups WHERE id = $1 AND tipo = 'general'", [req.params.id]);
  const backup = rows[0];
  if (!backup) return res.status(404).json({ error: 'Copia no encontrada' });
  const nombreArchivo = (backup.nombre || 'backup').replace(/[^\w\-]+/g, '-');
  res.setHeader('Content-Disposition', `attachment; filename="cuentas-app-${nombreArchivo}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(backup.data, null, 2));
});

// ---------- Backup de tienda (mensual, 2 meses, con fotos) ----------
router.get('/tienda', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, size_bytes, descargado, fecha_creacion FROM backups_tienda ORDER BY fecha_creacion DESC`
  );
  res.json(rows);
});

// El más reciente que el navegador todavía no ha descargado (para el auto-descargo al abrir la app)
router.get('/tienda/pending', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre FROM backups_tienda WHERE descargado = false ORDER BY fecha_creacion ASC LIMIT 1`
  );
  res.json(rows[0] || null);
});

router.post('/tienda/:id/mark-downloaded', async (req, res) => {
  await pool.query('UPDATE backups_tienda SET descargado = true WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

router.get('/tienda/:id/download', async (req, res) => {
  const { rows } = await pool.query('SELECT data, nombre FROM backups_tienda WHERE id = $1', [req.params.id]);
  const backup = rows[0];
  if (!backup) return res.status(404).json({ error: 'Copia no encontrada' });
  const nombreArchivo = (backup.nombre || 'tienda').replace(/[^\w\-]+/g, '-');
  res.setHeader('Content-Disposition', `attachment; filename="cuentas-app-tienda-${nombreArchivo}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(backup.data, null, 2));
});

// Intencionalmente no hay rutas DELETE: las copias solo se eliminan automáticamente
// por los trabajos programados (jobs/backup.js), nunca de forma manual desde la app.

module.exports = router;
