const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, size_bytes, fecha_creacion FROM backups WHERE tipo = 'general' AND empresa_id = $1 ORDER BY fecha_creacion DESC`,
    [req.user.empresa_id]
  );
  res.json(rows);
});

router.get('/:id/download', async (req, res) => {
  const { rows } = await pool.query(
    "SELECT data, nombre FROM backups WHERE id = $1 AND tipo = 'general' AND empresa_id = $2",
    [req.params.id, req.user.empresa_id]
  );
  const backup = rows[0];
  if (!backup) return res.status(404).json({ error: 'Copia no encontrada' });
  const nombreArchivo = (backup.nombre || 'backup').replace(/[^\w\-]+/g, '-');
  res.setHeader('Content-Disposition', `attachment; filename="cuentas-app-${nombreArchivo}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(backup.data, null, 2));
});

router.get('/tienda', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, size_bytes, descargado, fecha_creacion FROM backups_tienda WHERE empresa_id = $1 ORDER BY fecha_creacion DESC`,
    [req.user.empresa_id]
  );
  res.json(rows);
});

router.get('/tienda/pending', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre FROM backups_tienda WHERE empresa_id = $1 AND descargado = false ORDER BY fecha_creacion ASC LIMIT 1`,
    [req.user.empresa_id]
  );
  res.json(rows[0] || null);
});

router.post('/tienda/:id/mark-downloaded', async (req, res) => {
  await pool.query('UPDATE backups_tienda SET descargado = true WHERE id = $1 AND empresa_id = $2', [req.params.id, req.user.empresa_id]);
  res.json({ ok: true });
});

router.get('/tienda/:id/download', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT data, nombre FROM backups_tienda WHERE id = $1 AND empresa_id = $2',
    [req.params.id, req.user.empresa_id]
  );
  const backup = rows[0];
  if (!backup) return res.status(404).json({ error: 'Copia no encontrada' });
  const nombreArchivo = (backup.nombre || 'tienda').replace(/[^\w\-]+/g, '-');
  res.setHeader('Content-Disposition', `attachment; filename="cuentas-app-tienda-${nombreArchivo}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(backup.data, null, 2));
});

module.exports = router;
