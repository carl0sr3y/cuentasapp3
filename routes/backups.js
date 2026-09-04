const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Lista las copias existentes (sin su contenido, para no descargar todo de una vez)
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, size_bytes, fecha_creacion,
            (fecha_creacion + interval '48 hours') AS expira_en
     FROM backups ORDER BY fecha_creacion DESC`
  );
  res.json(rows);
});

// Descarga el contenido de una copia como archivo JSON
router.get('/:id/download', async (req, res) => {
  const { rows } = await pool.query('SELECT data, fecha_creacion FROM backups WHERE id = $1', [req.params.id]);
  const backup = rows[0];
  if (!backup) return res.status(404).json({ error: 'Copia no encontrada' });
  const fecha = new Date(backup.fecha_creacion).toISOString().slice(0, 10);
  res.setHeader('Content-Disposition', `attachment; filename="cuentas-app-backup-${fecha}-${req.params.id}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(backup.data, null, 2));
});

// Intencionalmente NO hay ruta DELETE aqui: las copias solo se eliminan automaticamente
// a las 48 horas de creadas (ver jobs/backup.js), nunca de forma manual desde la app.

module.exports = router;
