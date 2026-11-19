const { WebSocketServer } = require('ws');
const { verifyTokenFromCookieHeader, sesionVigente } = require('../middleware/auth');

// clientId (enviado por el navegador como ?clientId=) -> conjunto de sockets de ese dispositivo/pestaña
const clients = new Map();
// Conexiones abiertas por usuario (para ponerles tope).
const porUsuario = new Map();
const MAX_CONEXIONES_POR_USUARIO = 20;

// Solo se aceptan conexiones abiertas desde la propia app (mismo host), no desde otros sitios.
function origenPermitido({ origin, req }) {
  if (!origin) return false;
  try { return new URL(origin).host === req.headers.host; } catch (e) { return false; }
}

function attach(server) {
  // maxPayload: el navegador nunca envía mensajes; antes se aceptaban hasta 100 MB (auditoría V13).
  const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 1024, verifyClient: origenPermitido });

  wss.on('connection', async (ws, req) => {
    ws.on('error', () => {});
    const payload = verifyTokenFromCookieHeader(req.headers.cookie);
    let user = null;
    if (payload) {
      try { const r = await sesionVigente(payload); user = r.bloqueo ? null : r.user; } catch (e) { user = null; }
    }
    if (!user) { ws.close(4001, 'No autenticado'); return; }
    if (ws.readyState !== ws.OPEN) return; // se cerró mientras se verificaba la sesión

    const abiertas = porUsuario.get(user.id) || 0;
    if (abiertas >= MAX_CONEXIONES_POR_USUARIO) { ws.close(4008, 'Demasiadas conexiones'); return; }
    porUsuario.set(user.id, abiertas + 1);

    const url = new URL(req.url, 'http://localhost');
    const clientId = (url.searchParams.get('clientId') || Math.random().toString(36).slice(2)).slice(0, 64);
    ws.clientId = clientId;
    ws.user = user;
    ws.empresaId = user.empresa_id;
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    if (!clients.has(clientId)) clients.set(clientId, new Set());
    clients.get(clientId).add(ws);

    ws.on('close', () => {
      const n = (porUsuario.get(user.id) || 1) - 1;
      if (n <= 0) porUsuario.delete(user.id); else porUsuario.set(user.id, n);
      const set = clients.get(clientId);
      if (set) { set.delete(ws); if (set.size === 0) clients.delete(clientId); }
    });
  });

  // "Latido": evita que Railway (u otro proxy) cierre en silencio una conexión
  // WebSocket sin tráfico. Cada 25s se manda un ping; si un cliente no responde
  // con pong antes del siguiente ciclo, se da por muerto y se cierra.
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

// Notifica solo a los dispositivos de la MISMA empresa, excepto al que originó el cambio
// (identificado por su clientId, enviado en el header X-Client-Id de la petición HTTP).
function broadcast({ scope, id = null, by = null, empresaId, excludeClientId = null }) {
  const payload = JSON.stringify({ type: 'refresh', scope, id, by });
  for (const [clientId, sockets] of clients.entries()) {
    if (clientId === excludeClientId) continue;
    for (const ws of sockets) {
      if (empresaId && ws.empresaId !== empresaId) continue;
      if (ws.readyState === ws.OPEN) {
        try { ws.send(payload); } catch (e) { /* socket muerto, se limpiará en el próximo ping */ }
      }
    }
  }
}

module.exports = { attach, broadcast };
