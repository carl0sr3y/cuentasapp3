// Diagnóstico: cuando una foto no se puede procesar en el teléfono, la app manda aquí el motivo
// (etapa, error, tipo y tamaño del archivo, navegador). NO recibe la foto ni datos personales.
// Solo se escribe en los registros del servidor (Railway → Logs) para poder encontrar la causa.
const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Tope por usuario: 30 avisos por hora (que nadie pueda llenar los registros).
const conteo = new Map();
setInterval(() => conteo.clear(), 60 * 60 * 1000).unref();

const limpiar = (v, max) => String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').replace(/[^\x20-\x7E -ÿ]/g, '?').slice(0, max);

router.post('/foto', (req, res) => {
  const n = (conteo.get(req.user.id) || 0) + 1;
  conteo.set(req.user.id, n);
  if (n > 30) return res.status(204).end();
  const b = req.body || {};
  console.warn(`Foto no procesada | empresa ${req.user.empresa_id} | etapa=${limpiar(b.etapa, 20)} codigo=${limpiar(b.codigo, 20)}`
    + ` | ${limpiar(b.error, 200)} | archivo ${limpiar(b.tipo, 40) || '?'} ${Number(b.tamanoKB) || 0} KB | ${limpiar(b.navegador, 160)}`);
  res.status(204).end();
});

module.exports = router;
