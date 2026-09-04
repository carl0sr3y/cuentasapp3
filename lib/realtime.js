const { WebSocketServer } = require('ws');
const { verifyTokenFromCookieHeader } = require('../middleware/auth');

// clientId (enviado por el navegador como ?clientId=) -> conjunto de sockets de ese dispositivo/pestaña
const clients = new Map();

function attach(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const user = verifyTokenFromCookieHeader(req.headers.cookie);
    if (!user) { ws.close(4001, 'No autenticado'); return; }

    const url = new URL(req.url, 'http://localhost');
    const clientId = url.searchParams.get('clientId') || Math.random().toString(36).slice(2);
    ws.clientId = clientId;
    ws.user = user;

    if (!clients.has(clientId)) clients.set(clientId, new Set());
    clients.get(clientId).add(ws);

    ws.on('close', () => {
      const set = clients.get(clientId);
      if (set) { set.delete(ws); if (set.size === 0) clients.delete(clientId); }
    });
    ws.on('error', () => {});
  });

  return wss;
}

// Notifica a todos los dispositivos conectados que algo cambio, excepto al que origino el cambio
// (identificado por su clientId, enviado en el header X-Client-Id de la petición HTTP que hizo el cambio).
function broadcast({ scope, id = null, by = null, excludeClientId = null }) {
  const payload = JSON.stringify({ type: 'refresh', scope, id, by });
  for (const [clientId, sockets] of clients.entries()) {
    if (clientId === excludeClientId) continue;
    for (const ws of sockets) {
      if (ws.readyState === ws.OPEN) ws.send(payload);
    }
  }
}

module.exports = { attach, broadcast };
