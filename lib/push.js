const webpush = require('web-push');
const { pool } = require('../db/pool');

const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const configured = Boolean(PUBLIC_KEY && PRIVATE_KEY);

// Contacto que exigen los servicios push (Apple los rechaza si es inválido, como el antiguo ".local").
// Se puede fijar con VAPID_SUBJECT; si no, se usa la dirección pública que Railway asigna a la app.
const SUBJECT = process.env.VAPID_SUBJECT ||
  (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'mailto:admin@example.com');

if (configured) {
  webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);
} else {
  console.warn('VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY no configuradas: las notificaciones push están desactivadas.');
}

// Manda una notificacion push a todos los dispositivos suscritos, excepto al que
// origino el cambio (identificado por su clientId, igual que en el WebSocket).
async function sendPushToOthers({ title, body, empresaId, excludeClientId = null }) {
  if (!configured) return;
  const { rows } = await pool.query('SELECT id, client_id, endpoint, p256dh, auth FROM push_subscriptions WHERE empresa_id = $1', [empresaId]);
  const payload = JSON.stringify({ title, body });
  for (const row of rows) {
    if (excludeClientId && row.client_id === excludeClientId) continue;
    const subscription = { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } };
    try {
      await webpush.sendNotification(subscription, payload);
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) {
        await pool.query('DELETE FROM push_subscriptions WHERE id = $1', [row.id]).catch(() => {});
      } else {
        console.error('Error enviando push:', e.message);
      }
    }
  }
}

module.exports = { sendPushToOthers, publicKeyConfigured: configured, PUBLIC_KEY };
