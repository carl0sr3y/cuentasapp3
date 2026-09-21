const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Devuelve todas las cuentas de MI empresa junto con todos sus movimientos, para el PDF general
router.get('/general', async (req, res) => {
  const { rows: cuentas } = await pool.query(
    `SELECT id, nombre, favorito, fecha_creacion FROM cuentas WHERE empresa_id = $1 ORDER BY nombre ASC`,
    [req.user.empresa_id]
  );
  const { rows: movimientos } = await pool.query(
    `SELECT m.id, m.cuenta_id, m.tipo, m.descripcion, m.monto, m.saldo_resultante, m.fecha, u.nombre AS usuario
     FROM movimientos_cuentas m
     JOIN cuentas c ON c.id = m.cuenta_id
     LEFT JOIN usuarios u ON u.id = m.usuario_id
     WHERE c.empresa_id = $1
     ORDER BY m.cuenta_id ASC, m.fecha ASC, m.id ASC`,
    [req.user.empresa_id]
  );
  const porCuenta = {};
  for (const m of movimientos) {
    (porCuenta[m.cuenta_id] = porCuenta[m.cuenta_id] || []).push(m);
  }
  let balanceGeneral = 0;
  const cuentasConDetalle = cuentas.map(c => {
    const movs = porCuenta[c.id] || [];
    const balance = movs.length ? Number(movs[movs.length - 1].saldo_resultante) : 0;
    balanceGeneral += balance;
    return { ...c, balance, movimientos: movs };
  });
  res.json({ balance: balanceGeneral, cuentas: cuentasConDetalle });
});

module.exports = router;
