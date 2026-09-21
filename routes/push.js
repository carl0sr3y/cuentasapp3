const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { PUBLIC_KEY, publicKeyConfigured } = require('../lib/push');

const router = express.Router();

router.get('/vapid-public-key', (req, res) => {
  if (!publicKeyConfigured) return res.status(503).json({ error: 'Notificaciones push no configuradas en el servidor' });
  res.json({ publicKey: PUBLIC_KEY });
});

router.use(requireAuth);

router.post('/subscribe', async (req, res) => {
  const { endpoint, keys, clientId } = req.body || {};
  if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
    return res.status(400).json({ error: 'Suscripción inválida' });
  }
  await pool.query(
    `INSERT INTO push_subscriptions (usuario_id, empresa_id, client_id, endpoint, p256dh, auth)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (endpoint) DO UPDATE SET usuario_id = $1, empresa_id = $2, client_id = $3, p256dh = $5, auth = $6`,
    [req.user.id, req.user.empresa_id, clientId || null, endpoint, keys.p256dh, keys.auth]
  );
  res.json({ ok: true });
});

router.post('/unsubscribe', async (req, res) => {
  const { endpoint } = req.body || {};
  if (!endpoint) return res.status(400).json({ error: 'endpoint requerido' });
  await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
  res.json({ ok: true });
});

module.exports = router;
