// Envíos "en duda": cuando la app no recibió respuesta al guardar algo (se cortó la conexión), pregunta
// aquí si esas marcas de envío (clave_envio, ver db/schema.sql) quedaron guardadas. Solo mira datos de
// la empresa de quien pregunta.
const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { claveEnvio } = require('../lib/validate');

const router = express.Router();
router.use(requireAuth);

router.post('/estado', async (req, res) => {
  const lista = Array.isArray((req.body || {}).claves) ? req.body.claves.slice(0, 30) : [];
  const claves = lista.map(claveEnvio).filter(Boolean);
  if (!claves.length) return res.json({ guardadas: [] });
  const { rows } = await pool.query(
    `SELECT m.clave_envio AS c FROM movimientos_cuentas m JOIN cuentas cu ON cu.id = m.cuenta_id
       WHERE cu.empresa_id = $1 AND m.clave_envio = ANY($2)
     UNION SELECT clave_envio FROM movimientos_tienda WHERE empresa_id = $1 AND clave_envio = ANY($2)
     UNION SELECT clave_envio FROM cuentas WHERE empresa_id = $1 AND clave_envio = ANY($2)`,
    [req.user.empresa_id, claves]
  );
  res.json({ guardadas: rows.map(r => r.c) });
});

module.exports = router;
