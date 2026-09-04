const webpush = require('web-push');
const { pool } = require('../db/pool');

const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const configured = Boolean(PUBLIC_KEY && PRIVATE_KEY);

if (configured) {
  webpush.setVapidDetails('mailto:soporte@cuentas-app.local', PUBLIC_KEY, PRIVATE_KEY);
} else {
  console.warn('VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY no configuradas: las notificaciones push están desactivadas.');
}

// Manda una notificacion push a todos los dispositivos suscritos, excepto al que
// origino el cambio (identificado por su clientId, igual que en el WebSocket).
async function sendPushToOthers({ title, body, excludeClientId = null }) {
  if (!configured) return;
  const { rows } = await pool.query('SELECT id, client_id, endpoint, p256dh, auth FROM push_subscriptions');
  const payload = JSON.stringify({ title, body });
  for (const row of rows) {
    if (excludeClientId && row.client_id === excludeClientId) continue;
    const subscription = { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } };
    try {
      await webpush.sendNotification(subscription, payload);
    } catch (e) {
      // 404/410 = el navegador invalido esa suscripcion (desinstalo la app, borro datos, etc.)
      if (e.statusCode === 404 || e.statusCode === 410) {
        await pool.query('DELETE FROM push_subscriptions WHERE id = $1', [row.id]).catch(() => {});
      } else {
        console.error('Error enviando push:', e.message);
      }
    }
  }
}

module.exports = { sendPushToOthers, publicKeyConfigured: configured, PUBLIC_KEY };
