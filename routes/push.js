const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { PUBLIC_KEY, publicKeyConfigured } = require('../lib/push');

const router = express.Router();

// La llave pública no requiere sesión (el navegador la necesita antes de suscribirse)
router.get('/vapid-public-key', (req, res) => {
  if (!publicKeyConfigured) return res.status(503).json({ error: 'Notificaciones push no configuradas en el servidor' });
  res.json({ publicKey: PUBLIC_KEY });
});

router.use(requireAuth);

// Guarda (o actualiza) la suscripción de este dispositivo/navegador
router.post('/subscribe', async (req, res) => {
  const { endpoint, keys, clientId } = req.body || {};
  if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
    return res.status(400).json({ error: 'Suscripción inválida' });
  }
  await pool.query(
    `INSERT INTO push_subscriptions (usuario_id, client_id, endpoint, p256dh, auth)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (endpoint) DO UPDATE SET usuario_id = $1, client_id = $2, p256dh = $4, auth = $5`,
    [req.user.id, clientId || null, endpoint, keys.p256dh, keys.auth]
  );
  res.json({ ok: true });
});

// Elimina la suscripción de este dispositivo (por ejemplo, si el usuario desactiva las notificaciones)
router.post('/unsubscribe', async (req, res) => {
  const { endpoint } = req.body || {};
  if (!endpoint) return res.status(400).json({ error: 'endpoint requerido' });
  await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
  res.json({ ok: true });
});

module.exports = router;
