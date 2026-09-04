const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 300, 1000);
  const { rows } = await pool.query(
    `SELECT h.id, h.accion, h.tipo, h.detalle, h.monto, h.referencia_id, h.fecha, u.nombre AS usuario
     FROM historial_general h
     LEFT JOIN usuarios u ON u.id = h.usuario_id
     ORDER BY h.fecha DESC, h.id DESC
     LIMIT $1`,
    [limit]
  );
  res.json(rows);
});

module.exports = router;
