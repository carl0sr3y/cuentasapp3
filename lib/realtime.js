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
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    if (!clients.has(clientId)) clients.set(clientId, new Set());
    clients.get(clientId).add(ws);

    ws.on('close', () => {
      const set = clients.get(clientId);
      if (set) { set.delete(ws); if (set.size === 0) clients.delete(clientId); }
    });
    ws.on('error', () => {});
  });

  // "Latido": Railway (y la mayoría de proxies) pueden cerrar en silencio una conexión
  // WebSocket que lleva un rato sin tráfico. Cada 25s mandamos un ping; si un cliente no
  // responde con pong antes del siguiente ciclo, se da por muerto y se cierra, para que el
  // navegador detecte la desconexión y reconecte solo (en vez de quedar como "conectado" pero sordo).
  const interval = setInterval(() => {
    for (const sockets of clients.values()) {
      for (const ws of sockets) {
        if (ws.isAlive === false) { ws.terminate(); continue; }
        ws.isAlive = false;
        try { ws.ping(); } catch (e) {}
      }
    }
  }, 25000);
  wss.on('close', () => clearInterval(interval));

  return wss;
}

// Notifica a todos los dispositivos conectados que algo cambio, excepto al que origino el cambio
// (identificado por su clientId, enviado en el header X-Client-Id de la petición HTTP que hizo el cambio).
function broadcast({ scope, id = null, by = null, excludeClientId = null }) {
  const payload = JSON.stringify({ type: 'refresh', scope, id, by });
  for (const [clientId, sockets] of clients.entries()) {
    if (clientId === excludeClientId) continue;
    for (const ws of sockets) {
      if (ws.readyState === ws.OPEN) {
        try { ws.send(payload); } catch (e) { /* socket muerto, se limpiará en el próximo ping */ }
      }
    }
  }
}

module.exports = { attach, broadcast };
