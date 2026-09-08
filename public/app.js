/* ============================================================
   ICONOS (SVG en línea)
   ============================================================ */
const ICONS = {
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  bellOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.7 3A6 6 0 0 1 18 8c0 3.2.7 5.4 1.4 6.8M6.3 6.3C6.1 6.9 6 7.6 6 8c0 7-3 9-3 9h13"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
  history: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 3"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  arrowDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
  arrowUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
  inbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  all: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  userPlus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>`,
  key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  receipt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>`,
};

/* ============================================================
   IDENTIDAD DE ESTE DISPOSITIVO/PESTAÑA + CLIENTE DE LA API
   ============================================================ */
const CLIENT_ID = (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));

let pendingRequests = 0;
let wsConnected = false;
function updateSyncDot() {
  const dot = document.getElementById('syncDot');
  if (!dot) return;
  dot.classList.remove('sync-green', 'sync-yellow', 'sync-red');
  if (!wsConnected) { dot.classList.add('sync-red'); return; }
  if (pendingRequests > 0) { dot.classList.add('sync-yellow'); return; }
  dot.classList.add('sync-green');
}

function showOfflineBanner(msg) {
  const b = document.getElementById('offlineBanner');
  if (msg) document.getElementById('offlineMsg').textContent = msg;
  b.classList.remove('hidden');
}
document.getElementById('reloadBtn').addEventListener('click', () => location.reload());
window.addEventListener('offline', () => showOfflineBanner('Perdiste la conexión a internet.'));

async function api(path, opts = {}) {
  pendingRequests++; updateSyncDot();
  try {
    let res;
    try {
      res = await fetch('/api' + path, {
        method: opts.method || 'GET',
        headers: { 'Content-Type': 'application/json', 'X-Client-Id': CLIENT_ID },
        credentials: 'include',
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
    } catch (networkErr) {
      showOfflineBanner('No se pudo conectar con el servidor. Revisa tu internet y vuelve a intentar.');
      throw 'Sin conexión con el servidor';
    }
    let data = null;
    try { data = await res.json(); } catch (e) { /* sin cuerpo JSON */ }
    if (!res.ok) throw (data && data.error) || 'Error de red';
    return data;
  } finally {
    pendingRequests--; updateSyncDot();
  }
}

/* ============================================================
   WEBSOCKET: sincronización en tiempo real entre dispositivos
   ============================================================ */
let ws = null;
function connectWS() {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  ws = new WebSocket(`${proto}://${location.host}/ws?clientId=${CLIENT_ID}`);
  ws.onopen = () => { wsConnected = true; updateSyncDot(); refrescarTodo(); };
  ws.onclose = () => { wsConnected = false; updateSyncDot(); setTimeout(connectWS, 2000 + Math.random() * 2000); };
  ws.onerror = () => { try { ws.close(); } catch (e) {} };
  ws.onmessage = (ev) => {
    let msg; try { msg = JSON.parse(ev.data); } catch (e) { return; }
    if (msg.type === 'refresh') handleRealtimeRefresh(msg);
  };
}
async function handleRealtimeRefresh({ scope, id, by }) {
  try {
    if (scope === 'cuentas') {
      CUENTAS = await api('/cuentas');
      if (currentTab === 'deudas' && !document.getElementById('detailPage')) renderDeudas();
    } else if (scope === 'cuenta') {
      CUENTAS = await api('/cuentas');
      if (currentTab === 'deudas') renderDeudas();
      if (currentAccountDetail && String(currentAccountDetail.id) === String(id)) {
        currentAccountDetail = await api(`/cuentas/${id}`);
        renderAccountDetailPage();
      }
    } else if (scope === 'tienda') {
      TIENDA = await api('/tienda');
      if (currentTab === 'tienda') renderTienda();
    } else if (scope === 'usuarios') {
      if (document.getElementById('usersPage')) renderUsersPage();
    }
    if (by) toast('Actualizado por ' + by);
  } catch (e) { /* si falla el refresco silencioso, se intentará en el próximo evento */ }
}

// Vuelve a pedir los datos actuales: se usa al reconectar el WebSocket o al
// volver a encender la pantalla, por si nos perdimos cambios mientras tanto.
async function refrescarTodo() {
  try {
    CUENTAS = await api('/cuentas');
    TIENDA = await api('/tienda');
    if (currentTab === 'deudas') renderDeudas();
    if (currentTab === 'tienda') renderTienda();
    if (currentAccountDetail) {
      currentAccountDetail = await api(`/cuentas/${currentAccountDetail.id}`);
      if (document.getElementById('detailPage')) renderAccountDetailPage();
    }
  } catch (e) { /* si falla, se reintentará en el próximo evento */ }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && AUTH) refrescarTodo();
});

/* ============================================================
   ESTADO
   ============================================================ */
let AUTH = null;              // {id, nombre, usuario}
let CUENTAS = [];              // [{id,nombre,favorito,fecha_creacion,balance}]
let TIENDA = { balance: 0, movimientos: [] };
let currentAccountDetail = null; // {id,nombre,favorito,balance,movimientos}

let currentTab = 'deudas';
let searchQuery = '';
let selectMode = false;
let selectedIds = new Set();

function money(n) {
  const v = Number(n) || 0;
  const sign = v < 0 ? '-' : '';
  return sign + 'Q ' + Math.abs(v).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDateLabel(iso) {
  const d = new Date(iso);
  const today = new Date(); const yest = new Date(); yest.setDate(today.getDate() - 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  if (sameDay(d, today)) return 'Hoy';
  if (sameDay(d, yest)) return 'Ayer';
  return d.toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
}
function fmtTime(iso) { return new Date(iso).toLocaleTimeString('es-GT', { hour: 'numeric', minute: '2-digit' }); }
function fmtDateShort(iso) { return new Date(iso).toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function fmtDateTimeShort(iso) { return new Date(iso).toLocaleString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' }); }
function initialOf(name) { return (name || '?').trim().charAt(0).toUpperCase(); }
function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}
function totalGeneral() { return CUENTAS.reduce((s, c) => s + Number(c.balance), 0); }
function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/* ============================================================
   AUTENTICACIÓN
   ============================================================ */
async function initAuth() {
  try {
    const status = await api('/auth/status');
    if (status.user) { AUTH = status.user; return enterApp(); }
    renderLogin(status.needsSetup);
  } catch (e) {
    renderLogin(true);
  }
}
function renderLogin(needsSetup) {
  const root = document.getElementById('loginScreen');
  if (needsSetup) {
    root.innerHTML = `
      <div class="login-card">
        <div class="login-mark">${ICONS.check}</div>
        <h1>Configura tu cuenta</h1>
        <p class="sub">Serás el primer administrador de Cuentas-App. Después de esto podrás invitar a un segundo administrador desde dentro de la app — no hay registro público.</p>
        <div class="field"><label>Tu nombre</label><input id="setupNombre" type="text" placeholder="Ej. Carlos"></div>
        <div class="field"><label>Usuario</label><input id="setupUsuario" type="text" placeholder="admin"></div>
        <div class="field"><label>Contraseña</label><input id="setupPass" type="password" placeholder="Mínimo 4 caracteres"></div>
        <button class="btn-primary" id="setupBtn">Crear cuenta de administrador</button>
        <p class="login-error" id="setupErr"></p>
      </div>`;
    document.getElementById('setupBtn').onclick = async () => {
      const nombre = document.getElementById('setupNombre').value.trim();
      const usuario = document.getElementById('setupUsuario').value.trim();
      const contrasena = document.getElementById('setupPass').value;
      const err = document.getElementById('setupErr');
      if (!nombre || !usuario || !contrasena) { err.textContent = 'Completa todos los campos.'; return; }
      try {
        const { user } = await api('/auth/setup', { method: 'POST', body: { nombre, usuario, contrasena } });
        AUTH = user;
        enterApp();
      } catch (e) { err.textContent = typeof e === 'string' ? e : 'No se pudo crear la cuenta.'; }
    };
  } else {
    root.innerHTML = `
      <div class="login-card">
        <div class="login-mark">${ICONS.check}</div>
        <h1>Cuentas-App</h1>
        <p class="sub">Inicia sesión para continuar.</p>
        <div class="field"><label>Usuario</label><input id="loginUsuario" type="text" autocomplete="username"></div>
        <div class="field"><label>Contraseña</label><input id="loginPass" type="password" autocomplete="current-password"></div>
        <button class="btn-primary" id="loginBtn">Iniciar sesión</button>
        <p class="login-error" id="loginErr"></p>
      </div>`;
    const tryLogin = async () => {
      const usuario = document.getElementById('loginUsuario').value.trim();
      const contrasena = document.getElementById('loginPass').value;
      const err = document.getElementById('loginErr');
      try {
        const { user } = await api('/auth/login', { method: 'POST', body: { usuario, contrasena } });
        AUTH = user;
        enterApp();
      } catch (e) { err.textContent = typeof e === 'string' ? e : 'Usuario o contraseña incorrectos.'; }
    };
    document.getElementById('loginBtn').onclick = tryLogin;
    root.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); }));
  }
}
async function enterApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('mainScreen').classList.remove('hidden');
  const [cuentas, tienda] = await Promise.all([api('/cuentas'), api('/tienda')]);
  CUENTAS = cuentas;
  TIENDA = tienda;
  document.getElementById('avatarInitial').textContent = initialOf(AUTH.nombre || AUTH.usuario);
  document.getElementById('userLabel').textContent = AUTH.nombre || AUTH.usuario;
  await checkPushStatus();
  renderNotifBtn();
  renderDeudas();
  renderTienda();
  history.replaceState({ view: 'deudas' }, '', location.href);
  connectWS();
  checkPendingTiendaBackup();
}

// Si hay un backup mensual de tienda que todavía no se ha descargado en ningún
// dispositivo, lo descarga automáticamente ahora y lo marca como descargado.
async function checkPendingTiendaBackup() {
  try {
    const pending = await api('/backups/tienda/pending');
    if (!pending) return;
    window.location.href = `/api/backups/tienda/${pending.id}/download`;
    await api(`/backups/tienda/${pending.id}/mark-downloaded`, { method: 'POST' });
    toast(`Se descargó el backup de tienda: ${pending.nombre}`);
  } catch (e) { /* silencioso */ }
}

/* ============================================================
   BARRA SUPERIOR
   ============================================================ */
/* ============================================================
   NOTIFICACIONES PUSH (reales: llegan aunque el navegador esté cerrado)
   ============================================================ */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}
let notificacionesActivas = false;
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try { return await navigator.serviceWorker.register('/sw.js'); } catch (e) { return null; }
}
async function checkPushStatus() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) { notificacionesActivas = false; return; }
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    notificacionesActivas = !!sub;
  } catch (e) { notificacionesActivas = false; }
}
async function enablePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) { toast('Tu navegador no soporta notificaciones push'); return; }
  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { toast('Necesitas dar permiso de notificaciones para activarlas'); return; }
    const { publicKey } = await api('/push/vapid-public-key');
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
    const json = sub.toJSON();
    await api('/push/subscribe', { method: 'POST', body: { endpoint: json.endpoint, keys: json.keys, clientId: CLIENT_ID } });
    notificacionesActivas = true;
    renderNotifBtn();
    toast('Notificaciones activadas en este dispositivo');
  } catch (e) { toast('No se pudieron activar las notificaciones'); }
}
async function disablePush() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await api('/push/unsubscribe', { method: 'POST', body: { endpoint: sub.endpoint } });
      await sub.unsubscribe();
    }
  } catch (e) { /* ignorar */ }
  notificacionesActivas = false;
  renderNotifBtn();
  toast('Notificaciones desactivadas en este dispositivo');
}
function renderNotifBtn() {
  const b = document.getElementById('notifBtn');
  b.innerHTML = notificacionesActivas ? ICONS.bell : ICONS.bellOff;
  b.classList.toggle('active-state', notificacionesActivas);
}
document.getElementById('notifBtn').addEventListener('click', () => {
  if (notificacionesActivas) disablePush(); else enablePush();
});
document.getElementById('historialBtn').innerHTML = ICONS.history;
document.getElementById('historialBtn').addEventListener('click', openHistorialPage);
document.getElementById('avatarBtn').addEventListener('click', openAccountSettingsPage);

function setTabUI(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('deudasView').classList.toggle('hidden', tab !== 'deudas');
  document.getElementById('tiendaView').classList.toggle('hidden', tab !== 'tienda');
}
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentTab === btn.dataset.tab) return;
    setTabUI(btn.dataset.tab);
    history.pushState({ view: btn.dataset.tab }, '', location.href);
  });
});

/* ============================================================
   NAVEGACIÓN: el botón "atrás" del navegador regresa dentro de la
   app (a la pestaña o pantalla anterior) en vez de salir de la página.
   ============================================================ */
window.addEventListener('popstate', (e) => {
  if (!AUTH) return;
  applyHistoryState(e.state);
});
async function applyHistoryState(state) {
  state = state || { view: 'deudas' };
  document.getElementById('pageRoot').innerHTML = '';
  document.getElementById('modalRoot').innerHTML = '';
  currentAccountDetail = null;

  if (state.view === 'accountDetail' && state.id) {
    await openAccountDetail(state.id, { fromHistory: true });
  } else if (state.view === 'historial') {
    await openHistorialPage({ fromHistory: true });
  } else if (state.view === 'users') {
    await openAccountSettingsPage({ fromHistory: true });
  } else if (state.view === 'invoice') {
    openInvoicePage({ fromHistory: true });
  } else if (state.view === 'tienda') {
    setTabUI('tienda');
  } else {
    setTabUI('deudas');
  }
}

/* ============================================================
   VISTA DEUDAS
   ============================================================ */
function renderDeudas() {
  const el = document.getElementById('deudasView');
  const total = totalGeneral();

  el.innerHTML = `
    <div class="balance-block">
      <div class="balance-label">Balance general</div>
      <div class="balance-amount ${total >= 0 ? 'pos' : 'neg'}">${money(total)}</div>
    </div>
    <div class="action-row">
      <button class="action-btn" id="btnCrearCuenta">${ICONS.plus}Crear cuenta</button>
      <button class="action-btn danger" id="btnEliminarCuentas">${ICONS.trash}Eliminar</button>
      <button class="action-btn" id="btnPdfGeneral">${ICONS.pdf}PDF general</button>
    </div>
    <div class="search-wrap">${ICONS.search}<input class="search-input" id="searchAccounts" placeholder="Buscar cuenta..." value="${searchQuery.replace(/"/g, '&quot;')}"></div>
    <div id="favSection"></div>
    <div class="section-title">Tus cuentas <span class="count" id="accountsCount">(${CUENTAS.length})</span></div>
    <div id="accountListWrap"></div>
  `;

  document.getElementById('btnCrearCuenta').onclick = openCreateAccountModal;
  document.getElementById('btnEliminarCuentas').onclick = toggleSelectMode;
  document.getElementById('btnPdfGeneral').onclick = generarPdfGeneral;
  // Solo actualiza la lista (no reconstruye el input), para no perder el foco/teclado en móvil
  document.getElementById('searchAccounts').oninput = (e) => { searchQuery = e.target.value; renderAccountsListOnly(); };
  renderAccountsListOnly();
}

function renderAccountsListOnly() {
  const favoritos = CUENTAS.filter(c => c.favorito);
  const q = searchQuery.trim().toLowerCase();
  const filtered = CUENTAS.filter(c => c.nombre.toLowerCase().includes(q));
  const sorted = [...filtered].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  const groups = {};
  sorted.forEach(c => { const L = initialOf(c.nombre); (groups[L] = groups[L] || []).push(c); });
  const letters = Object.keys(groups).sort();

  document.getElementById('favSection').innerHTML = favoritos.length ? `
    <div class="section-title">Clientes favoritos</div>
    <div class="fav-row">${favoritos.map(c => `
      <div class="fav-chip" data-open="${c.id}">
        <div class="circ">${initialOf(c.nombre)}</div>
        <div class="info"><div class="name">${escapeHtml(c.nombre)}</div><div class="bal ${c.balance >= 0 ? 'pos' : 'neg'}">${money(c.balance)}</div></div>
      </div>`).join('')}</div>` : '';

  document.getElementById('accountsCount').textContent = `(${CUENTAS.length})`;

  const wrap = document.getElementById('accountListWrap');
  wrap.innerHTML = sorted.length === 0 ? `
    <div class="empty-state">${ICONS.inbox}<p>${CUENTAS.length === 0 ? 'Aún no tienes cuentas. Crea la primera con el botón de arriba.' : 'No se encontraron cuentas con ese nombre.'}</p></div>
  ` : letters.map(L => `
    <div class="letter-group">
      <div class="letter-head">${L}</div>
      ${groups[L].map(c => accountCardHtml(c)).join('')}
    </div>
  `).join('');

  document.querySelectorAll('#favSection .fav-chip').forEach(f => f.onclick = () => openAccountDetail(f.dataset.open));
  bindAccountCardEvents(wrap);
  renderSelectBar();
}
function accountCardHtml(c) {
  const checked = selectedIds.has(String(c.id));
  return `
    <div class="account-card ${selectMode ? 'selectable' : ''}" data-id="${c.id}">
      ${selectMode ? `<div class="select-check ${checked ? 'checked' : ''}" data-check="${c.id}">${checked ? ICONS.check : ''}</div>` : ''}
      <div class="acc-circ">${initialOf(c.nombre)}</div>
      <div class="acc-info">
        <div class="acc-name">${escapeHtml(c.nombre)}</div>
        <div class="acc-balance ${c.balance >= 0 ? 'pos' : 'neg'}">${money(c.balance)}</div>
      </div>
      ${!selectMode ? `<button class="star-btn ${c.favorito ? 'fav' : ''}" data-star="${c.id}">${c.favorito ? ICONS.star : ICONS.starOutline}</button>` : ''}
    </div>`;
}
function bindAccountCardEvents(el) {
  el.querySelectorAll('.account-card').forEach(card => {
    const id = card.dataset.id;
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-star]') || e.target.closest('[data-check]')) return;
      if (selectMode) toggleSelect(id); else openAccountDetail(id);
    });
  });
  el.querySelectorAll('[data-star]').forEach(b => {
    b.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = b.dataset.star;
      const c = CUENTAS.find(x => String(x.id) === id);
      try {
        const updated = await api(`/cuentas/${id}`, { method: 'PATCH', body: { favorito: !c.favorito } });
        c.favorito = updated.favorito;
        renderDeudas();
      } catch (e) { toast('No se pudo actualizar el favorito'); }
    });
  });
  el.querySelectorAll('[data-check]').forEach(b => {
    b.addEventListener('click', (e) => { e.stopPropagation(); toggleSelect(b.dataset.check); });
  });
}
function toggleSelect(id) {
  if (selectedIds.has(id)) selectedIds.delete(id); else selectedIds.add(id);
  renderDeudas();
}
function toggleSelectMode() {
  selectMode = !selectMode;
  selectedIds.clear();
  renderDeudas();
}
function renderSelectBar() {
  let bar = document.querySelector('.select-bar');
  if (bar) bar.remove();
  if (!selectMode) return;
  const div = document.createElement('div');
  div.className = 'select-bar';
  div.innerHTML = `
    <button class="cancel-btn" id="selCancel">Cancelar</button>
    <button class="delete-btn" id="selDelete" ${selectedIds.size === 0 ? 'disabled' : ''}>Eliminar (${selectedIds.size})</button>`;
  document.body.appendChild(div);
  document.getElementById('selCancel').onclick = toggleSelectMode;
  document.getElementById('selDelete').onclick = () => {
    if (selectedIds.size === 0) return;
    openConfirmModal('¿Eliminar cuentas seleccionadas?',
      `Se eliminarán ${selectedIds.size} cuenta(s) y todo su historial de movimientos. Esta acción no se puede deshacer.`,
      async () => {
        const idsArr = [...selectedIds].map(Number);
        try {
          await api('/cuentas/delete', { method: 'POST', body: { ids: idsArr } });
          CUENTAS = CUENTAS.filter(c => !selectedIds.has(String(c.id)));
          selectMode = false; selectedIds.clear();
          renderDeudas();
          toast('Cuentas eliminadas');
        } catch (e) { toast('No se pudieron eliminar las cuentas'); }
      });
  };
}

/* ---------- Modal: crear cuenta ---------- */
function openCreateAccountModal() {
  showModal(`
    <h3>Crear nueva cuenta</h3>
    <p class="desc">Ingresa el nombre del cliente o deudor.</p>
    <div class="field"><input id="newAccName" type="text" placeholder="Nombre" autofocus></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmCreateAcc">Crear cuenta</button>
    </div>
  `);
  const input = document.getElementById('newAccName');
  setTimeout(() => input.focus(), 50);
  const submit = async () => {
    const nombre = input.value.trim();
    if (!nombre) return;
    try {
      const cuenta = await api('/cuentas', { method: 'POST', body: { nombre } });
      CUENTAS.push(cuenta);
      closeModal(); renderDeudas(); toast('Cuenta creada');
    } catch (e) { toast('No se pudo crear la cuenta'); }
  };
  document.getElementById('confirmCreateAcc').onclick = submit;
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

/* ============================================================
   DETALLE DE CUENTA
   ============================================================ */
async function openAccountDetail(id, opts = {}) {
  try {
    currentAccountDetail = await api(`/cuentas/${id}`);
    renderAccountDetailPage();
    if (!opts.fromHistory) history.pushState({ view: 'accountDetail', id: String(id) }, '', location.href);
  } catch (e) { toast('No se pudo abrir la cuenta'); }
}
function renderAccountDetailPage() {
  const c = currentAccountDetail;
  if (!c) return;
  const root = document.getElementById('pageRoot');
  const movs = c.movimientos.slice().reverse();
  const groups = {};
  movs.forEach(m => { const key = fmtDateShort(m.fecha); (groups[key] = groups[key] || []).push(m); });
  const dateKeys = Object.keys(groups);

  root.innerHTML = `
    <div class="page-slide" id="detailPage">
      <div class="page-header">
        <button class="back-btn" id="detailBack">${ICONS.back}</button>
        <h2>${escapeHtml(c.nombre)}</h2>
      </div>
      <div class="detail-body">
        <div class="balance-block">
          <div class="balance-label">Balance de ${escapeHtml(c.nombre)}</div>
          <div class="balance-amount ${c.balance >= 0 ? 'pos' : 'neg'}">${money(c.balance)}</div>
        </div>
        <div class="detail-actions">
          <button class="abono-btn" id="btnAbono">${ICONS.arrowDown} Abono</button>
          <button class="cargo-btn" id="btnCargo">${ICONS.arrowUp} Cargo</button>
        </div>
        <button class="pdf-btn" id="btnPdfCuenta">${ICONS.pdf} Generar PDF del historial</button>
        ${movs.length ? `<div class="swipe-hint">Mantén presionado un movimiento para eliminarlo</div>` : ''}
        <div id="movList">
          ${movs.length === 0 ? `<div class="empty-state">${ICONS.inbox}<p>Sin movimientos todavía. Registra un abono o un cargo.</p></div>` :
            dateKeys.map(dk => `
              <div class="history-date-group">
                <div class="history-date-label">${fmtDateLabel(groups[dk][0].fecha)}</div>
                ${groups[dk].map(m => movRowHtml(m)).join('')}
              </div>
            `).join('')
          }
        </div>
      </div>
    </div>
  `;
  document.getElementById('detailBack').onclick = () => { history.back(); };
  document.getElementById('btnAbono').onclick = () => openMovModal('abono', c.id);
  document.getElementById('btnCargo').onclick = () => openMovModal('cargo', c.id);
  document.getElementById('btnPdfCuenta').onclick = () => generarPdfCuenta(c);
  bindMovLongPress(document.getElementById('movList'), (movId) => confirmDeleteMovCuenta(c.id, movId));
}
function movRowHtml(m) {
  const isIn = m.tipo === 'abono' || m.tipo === 'entrada';
  return `
    <div class="mov-row" data-mov="${m.id}">
      <div class="mov-icon ${isIn ? 'in' : 'out'}">${isIn ? ICONS.arrowDown : ICONS.arrowUp}</div>
      <div class="mov-info">
        <div class="mov-desc">${escapeHtml(m.descripcion || (isIn ? 'Abono' : 'Cargo'))}</div>
        <div class="mov-time">${fmtTime(m.fecha)}${m.usuario ? ' · <span class="mov-author">' + escapeHtml(m.usuario) + '</span>' : ''}</div>
      </div>
      ${m.foto ? `<button class="mov-photo-btn" data-photo="${m.id}" title="Ver factura">${ICONS.camera}</button>` : ''}
      <div class="mov-amounts">
        <div class="mov-monto ${isIn ? 'pos' : 'neg'}">${isIn ? '+' : ''}${money(m.monto)}</div>
        <div class="mov-saldo">saldo: ${money(m.saldo_resultante)}</div>
      </div>
    </div>`;
}
function bindPhotoButtons(container, movs) {
  container.querySelectorAll('[data-photo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const m = movs.find(x => String(x.id) === btn.dataset.photo);
      if (m && m.foto) openPhotoLightbox(m.foto);
    });
  });
}
function openPhotoLightbox(dataUrl) {
  showModal(`
    <h3>Factura</h3>
    <img src="${dataUrl}" style="width:100%;border-radius:10px;margin:8px 0;display:block;">
    <div class="modal-actions">
      <button class="btn-confirm" data-close style="width:100%;">Cerrar</button>
    </div>
  `, { center: true });
}
function bindMovLongPress(container, onDelete) {
  let timer = null;
  container.querySelectorAll('.mov-row').forEach(row => {
    const id = row.dataset.mov;
    const start = () => { timer = setTimeout(() => onDelete(id), 550); };
    const cancel = () => clearTimeout(timer);
    row.addEventListener('mousedown', start); row.addEventListener('touchstart', start, { passive: true });
    row.addEventListener('mouseup', cancel); row.addEventListener('mouseleave', cancel);
    row.addEventListener('touchend', cancel); row.addEventListener('touchmove', cancel);
  });
}
function openMovModal(tipo, cuentaId) {
  const isAbono = tipo === 'abono';
  showModal(`
    <h3>${isAbono ? 'Nuevo abono' : 'Nuevo cargo'}</h3>
    <p class="desc">${isAbono ? 'Registra una entrada de dinero a esta cuenta.' : 'Registra una salida de dinero de esta cuenta.'}</p>
    <div class="field"><label>Descripción</label><input id="movDesc" type="text" placeholder="Ej. Pago quincenal"></div>
    <div class="field"><label>Monto (Q)</label><input id="movMonto" type="number" step="0.01" min="0" placeholder="0.00"></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmMov">Guardar</button>
    </div>
  `);
  setTimeout(() => document.getElementById('movDesc').focus(), 50);
  document.getElementById('confirmMov').onclick = async () => {
    const descripcion = document.getElementById('movDesc').value.trim();
    const monto = parseFloat(document.getElementById('movMonto').value);
    if (isNaN(monto) || monto <= 0) return;
    try {
      const { movimiento, balance } = await api(`/cuentas/${cuentaId}/movimientos`, { method: 'POST', body: { tipo, descripcion, monto } });
      currentAccountDetail.movimientos.push(movimiento);
      currentAccountDetail.balance = balance;
      const listItem = CUENTAS.find(c => c.id === cuentaId || String(c.id) === String(cuentaId));
      if (listItem) listItem.balance = balance;
      closeModal();
      renderAccountDetailPage();
      renderDeudas();
      toast(isAbono ? 'Abono registrado' : 'Cargo registrado');
    } catch (e) { toast('No se pudo guardar el movimiento'); }
  };
}
function confirmDeleteMovCuenta(cuentaId, movId) {
  openConfirmModal('¿Eliminar este movimiento?', 'Esta acción no se puede deshacer y recalculará los saldos posteriores.', async () => {
    try {
      await api(`/cuentas/${cuentaId}/movimientos/${movId}`, { method: 'DELETE' });
      currentAccountDetail = await api(`/cuentas/${cuentaId}`);
      const listItem = CUENTAS.find(c => String(c.id) === String(cuentaId));
      if (listItem) listItem.balance = currentAccountDetail.balance;
      renderAccountDetailPage();
      renderDeudas();
      toast('Movimiento eliminado');
    } catch (e) { toast('No se pudo eliminar el movimiento'); }
  });
}

/* ============================================================
   VISTA TIENDA
   ============================================================ */
function renderTienda() {
  const el = document.getElementById('tiendaView');
  const movs = TIENDA.movimientos.slice().reverse();
  const groups = {};
  movs.forEach(m => { const key = fmtDateShort(m.fecha); (groups[key] = groups[key] || []).push(m); });
  const dateKeys = Object.keys(groups);
  const balanceHoy = TIENDA.balanceHoy || 0;

  el.innerHTML = `
    <div class="balance-block">
      <div class="balance-label">Balance de hoy</div>
      <div class="balance-amount ${balanceHoy >= 0 ? 'pos' : 'neg'}">${money(balanceHoy)}</div>
    </div>
    <div class="action-row two">
      <button class="action-btn success" id="btnEntrada">${ICONS.arrowDown}Entrada</button>
      <button class="action-btn danger" id="btnSalida">${ICONS.arrowUp}Salida</button>
    </div>
    <button class="pdf-btn" id="btnFactura">${ICONS.receipt} Generar factura</button>
    <button class="pdf-btn" id="btnPdfTienda">${ICONS.pdf} Generar PDF de movimientos</button>
    ${movs.length ? `<div class="swipe-hint">Mantén presionado un movimiento para eliminarlo</div>` : ''}
    <div id="tiendaMovList">
      ${movs.length === 0 ? `<div class="empty-state">${ICONS.inbox}<p>Sin movimientos registrados en la tienda todavía.</p></div>` :
        dateKeys.map(dk => `
          <div class="history-date-group">
            <div class="history-date-label">${fmtDateLabel(groups[dk][0].fecha)}</div>
            ${groups[dk].map(m => movRowHtml(m)).join('')}
          </div>
        `).join('')
      }
    </div>
  `;
  document.getElementById('btnEntrada').onclick = () => openTiendaMovModal('entrada');
  document.getElementById('btnSalida').onclick = () => openTiendaMovModal('salida');
  document.getElementById('btnPdfTienda').onclick = openPdfTiendaFilterModal;
  document.getElementById('btnFactura').onclick = openInvoicePage;
  const listEl = document.getElementById('tiendaMovList');
  bindMovLongPress(listEl, confirmDeleteMovTienda);
  bindPhotoButtons(listEl, movs);
}
function compressImage(file, maxWidth = 1000, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) { height = Math.round(height * (maxWidth / width)); width = maxWidth; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('No se pudo leer la imagen'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });
}
function openTiendaMovModal(tipo) {
  const isEntrada = tipo === 'entrada';
  let fotoDataUrl = null;
  showModal(`
    <h3>${isEntrada ? 'Nueva entrada' : 'Nueva salida'}</h3>
    <p class="desc">${isEntrada ? 'Registra dinero que entra a la tienda.' : 'Registra dinero que sale de la tienda.'}</p>
    <div class="field"><label>Descripción</label><input id="tMovDesc" type="text" placeholder="Ej. Venta del día"></div>
    <div class="field"><label>Monto (Q)</label><input id="tMovMonto" type="number" step="0.01" min="0" placeholder="0.00"></div>
    <div class="photo-field">
      <label>Foto de la factura (opcional)</label>
      <button type="button" class="photo-capture-btn" id="btnTomarFoto">${ICONS.camera} Tomar o elegir foto</button>
      <input type="file" accept="image/*" capture="environment" id="tMovFotoInput" style="display:none;">
      <div id="fotoPreviewWrap"></div>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmTMov">Guardar</button>
    </div>
  `);
  setTimeout(() => document.getElementById('tMovDesc').focus(), 50);
  document.getElementById('btnTomarFoto').onclick = () => document.getElementById('tMovFotoInput').click();
  document.getElementById('tMovFotoInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      fotoDataUrl = await compressImage(file);
      document.getElementById('fotoPreviewWrap').innerHTML = `
        <div class="photo-preview"><img src="${fotoDataUrl}"><button type="button" class="remove-photo" id="btnQuitarFoto">${ICONS.trash}</button></div>`;
      document.getElementById('btnQuitarFoto').onclick = () => { fotoDataUrl = null; document.getElementById('fotoPreviewWrap').innerHTML = ''; };
    } catch (err) { toast('No se pudo procesar la foto'); }
  });
  document.getElementById('confirmTMov').onclick = async () => {
    const descripcion = document.getElementById('tMovDesc').value.trim();
    const monto = parseFloat(document.getElementById('tMovMonto').value);
    if (isNaN(monto) || monto <= 0) return;
    try {
      const { movimiento, balance } = await api('/tienda', { method: 'POST', body: { tipo, descripcion, monto, foto: fotoDataUrl } });
      TIENDA.movimientos.push(movimiento);
      TIENDA = await api('/tienda');
      closeModal(); renderTienda();
      toast(isEntrada ? 'Entrada registrada' : 'Salida registrada');
    } catch (e) { toast('No se pudo guardar el movimiento'); }
  };
}
function confirmDeleteMovTienda(movId) {
  openConfirmModal('¿Eliminar este movimiento?', 'Esta acción no se puede deshacer y recalculará los saldos posteriores.', async () => {
    try {
      await api(`/tienda/${movId}`, { method: 'DELETE' });
      TIENDA = await api('/tienda');
      renderTienda();
      toast('Movimiento eliminado');
    } catch (e) { toast('No se pudo eliminar el movimiento'); }
  });
}

/* ============================================================
   HISTORIAL GENERAL + COPIAS DE SEGURIDAD
   ============================================================ */
async function openHistorialPage(opts = {}) {
  let hist = [], backups = [], backupsTienda = [];
  try { [hist, backups, backupsTienda] = await Promise.all([api('/historial'), api('/backups'), api('/backups/tienda')]); } catch (e) { toast('No se pudo cargar el historial'); }
  if (!opts.fromHistory) history.pushState({ view: 'historial' }, '', location.href);
  const root = document.getElementById('pageRoot');
  const groups = {};
  hist.forEach(h => { const key = fmtDateShort(h.fecha); (groups[key] = groups[key] || []).push(h); });
  const dateKeys = Object.keys(groups);
  root.innerHTML = `
    <div class="page-slide">
      <div class="page-header">
        <button class="back-btn" id="histBack">${ICONS.back}</button>
        <h2>Historial general</h2>
      </div>
      <div class="detail-body">
        <p class="desc" style="margin:0 0 14px;">Se muestran los últimos 7 días de actividad.</p>
        ${hist.length === 0 ? `<div class="empty-state">${ICONS.history}<p>Aún no hay acciones registradas.</p></div>` :
          dateKeys.map(dk => `
            <div class="history-date-group">
              <div class="history-date-label">${fmtDateLabel(groups[dk][0].fecha)}</div>
              ${groups[dk].map(h => `
                <div class="mov-row">
                  <div class="mov-icon" style="background:var(--surface-2);color:var(--text-dim)">${ICONS.history}</div>
                  <div class="mov-info">
                    <div class="mov-desc">${escapeHtml(h.accion)}${h.detalle ? ' — ' + escapeHtml(h.detalle) : ''}</div>
                    <div class="mov-time">${fmtTime(h.fecha)} · ${escapeHtml(h.usuario || '')}</div>
                  </div>
                  ${h.monto != null ? `<div class="mov-amounts"><div class="mov-monto ${h.monto >= 0 ? 'pos' : 'neg'}">${money(h.monto)}</div></div>` : ''}
                </div>
              `).join('')}
            </div>
          `).join('')
        }
        <div class="section-title" style="margin-top:22px;">Copias de seguridad general</div>
        <p class="desc" style="margin:-6px 0 14px;">Se genera una cada domingo (cierra la semana lunes-domingo). Se conservan las últimas 4 semanas.</p>
        ${backups.length === 0 ? `<div class="empty-state">${ICONS.inbox}<p>Todavía no se ha generado ninguna copia.</p></div>` :
          backups.map(b => backupRowHtml(b, 'general')).join('')
        }
        <div class="section-title" style="margin-top:22px;">Copias de seguridad de tienda</div>
        <p class="desc" style="margin:-6px 0 14px;">Se genera una a fin de cada mes, con las fotos de facturas y un resumen. Se conservan los últimos 2 meses.</p>
        ${backupsTienda.length === 0 ? `<div class="empty-state">${ICONS.inbox}<p>Todavía no se ha generado ninguna copia de tienda.</p></div>` :
          backupsTienda.map(b => backupRowHtml(b, 'tienda')).join('')
        }
      </div>
    </div>`;
  document.getElementById('histBack').onclick = () => { history.back(); };
  root.querySelectorAll('[data-download]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.scope === 'tienda' ? `/api/backups/tienda/${btn.dataset.download}/download` : `/api/backups/${btn.dataset.download}/download`;
      window.location.href = url;
    });
  });
}
function backupRowHtml(b, scope) {
  const kb = (b.size_bytes / 1024).toFixed(1);
  return `
    <div class="backup-row">
      <div class="backup-info">
        <div class="backup-date">${escapeHtml(b.nombre || fmtDateTimeShort(b.fecha_creacion))}</div>
        <div class="backup-meta">${kb} KB</div>
      </div>
      <button class="backup-dl" data-download="${b.id}" data-scope="${scope}" title="Descargar">${ICONS.download}</button>
    </div>`;
}

/* ============================================================
   CUENTA Y USUARIOS (avatar)
   ============================================================ */
async function openAccountSettingsPage(opts = {}) {
  let usuarios = [];
  try { usuarios = await api('/usuarios'); } catch (e) { toast('No se pudo cargar la lista de usuarios'); }
  renderUsersPage(usuarios);
  if (!opts.fromHistory) history.pushState({ view: 'users' }, '', location.href);
}
function renderUsersPage(usuariosParam) {
  const root = document.getElementById('pageRoot');
  const render = (usuarios) => {
    const otros = usuarios.filter(u => u.id !== AUTH.id);
    root.innerHTML = `
      <div class="page-slide" id="usersPage">
        <div class="page-header">
          <button class="back-btn" id="usersBack">${ICONS.back}</button>
          <h2>Cuenta y usuarios</h2>
        </div>
        <div class="detail-body">
          <div class="section-title">Tu cuenta</div>
          <div class="user-card">
            <div class="acc-circ">${initialOf(AUTH.nombre)}</div>
            <div class="info">
              <div class="name">${escapeHtml(AUTH.nombre)}</div>
              <div class="handle">@${escapeHtml(AUTH.usuario)}</div>
            </div>
            <button class="link-btn" id="btnChangeOwnPass">Cambiar contraseña</button>
          </div>

          <div class="section-title" style="margin-top:22px;">Otros administradores</div>
          ${otros.length === 0 ? `<div class="empty-state">${ICONS.inbox}<p>Todavía no hay otro administrador.</p></div>` :
            otros.map(u => `
              <div class="user-card">
                <div class="acc-circ">${initialOf(u.nombre)}</div>
                <div class="info">
                  <div class="name">${escapeHtml(u.nombre)}</div>
                  <div class="handle">@${escapeHtml(u.usuario)}</div>
                </div>
                <button class="link-btn" data-changepass="${u.id}" data-name="${escapeHtml(u.nombre)}">Cambiar contraseña</button>
              </div>
            `).join('')
          }
          <button class="pdf-btn" id="btnAddUser" style="margin-top:14px;">${ICONS.userPlus} Crear nuevo administrador</button>
        </div>
      </div>`;
    document.getElementById('usersBack').onclick = () => { history.back(); };
    document.getElementById('btnChangeOwnPass').onclick = () => openChangePasswordModal(AUTH.id, AUTH.nombre, true);
    document.getElementById('btnAddUser').onclick = openCreateUserModal;
    root.querySelectorAll('[data-changepass]').forEach(b => {
      b.addEventListener('click', () => openChangePasswordModal(b.dataset.changepass, b.dataset.name, false));
    });
  };
  if (usuariosParam) render(usuariosParam);
  else api('/usuarios').then(render).catch(() => toast('No se pudo cargar la lista de usuarios'));
}
function openChangePasswordModal(userId, nombre, isOwn) {
  showModal(`
    <h3>Cambiar contraseña${isOwn ? '' : ' de ' + escapeHtml(nombre)}</h3>
    <p class="desc">${isOwn ? 'Confirma tu contraseña actual y elige una nueva.' : 'Puedes definir una nueva contraseña para esta cuenta.'}</p>
    ${isOwn ? `<div class="field"><label>Contraseña actual</label><input id="passActual" type="password"></div>` : ''}
    <div class="field"><label>Nueva contraseña</label><input id="passNueva" type="password" placeholder="Mínimo 4 caracteres"></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmPass">Guardar</button>
    </div>
    <p class="login-error" id="passErr"></p>
  `);
  document.getElementById('confirmPass').onclick = async () => {
    const nueva = document.getElementById('passNueva').value;
    const actual = isOwn ? document.getElementById('passActual').value : undefined;
    const err = document.getElementById('passErr');
    if (!nueva || nueva.length < 4) { err.textContent = 'La nueva contraseña debe tener al menos 4 caracteres.'; return; }
    try {
      await api(`/usuarios/${userId}/password`, { method: 'PATCH', body: { actual, nueva } });
      closeModal(); toast('Contraseña actualizada');
    } catch (e) { err.textContent = typeof e === 'string' ? e : 'No se pudo cambiar la contraseña.'; }
  };
}
function openCreateUserModal() {
  showModal(`
    <h3>Crear nuevo administrador</h3>
    <p class="desc">Tendrá acceso completo a las mismas cuentas y movimientos que tú.</p>
    <div class="field"><label>Nombre</label><input id="newUserNombre" type="text"></div>
    <div class="field"><label>Usuario</label><input id="newUserUsuario" type="text"></div>
    <div class="field"><label>Contraseña</label><input id="newUserPass" type="password" placeholder="Mínimo 4 caracteres"></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmNewUser">Crear</button>
    </div>
    <p class="login-error" id="newUserErr"></p>
  `);
  document.getElementById('confirmNewUser').onclick = async () => {
    const nombre = document.getElementById('newUserNombre').value.trim();
    const usuario = document.getElementById('newUserUsuario').value.trim();
    const contrasena = document.getElementById('newUserPass').value;
    const err = document.getElementById('newUserErr');
    if (!nombre || !usuario || !contrasena) { err.textContent = 'Completa todos los campos.'; return; }
    try {
      await api('/usuarios', { method: 'POST', body: { nombre, usuario, contrasena } });
      closeModal();
      renderUsersPage();
      toast('Administrador creado');
    } catch (e) { err.textContent = typeof e === 'string' ? e : 'No se pudo crear el usuario.'; }
  };
}

/* ============================================================
   MODALES GENÉRICOS
   ============================================================ */
function showModal(innerHtml, { center = false } = {}) {
  const root = document.getElementById('modalRoot');
  root.innerHTML = `<div class="modal-overlay ${center ? 'center' : ''}" id="overlay"><div class="modal-card">${innerHtml}</div></div>`;
  root.querySelector('#overlay').addEventListener('click', (e) => { if (e.target.id === 'overlay') closeModal(); });
  root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModal));
}
function closeModal() { document.getElementById('modalRoot').innerHTML = ''; }
function openConfirmModal(title, desc, onConfirm) {
  showModal(`
    <h3>${title}</h3>
    <p class="desc">${desc}</p>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm danger" id="confirmYes">Eliminar</button>
    </div>
  `, { center: true });
  document.getElementById('confirmYes').onclick = async () => { closeModal(); await onConfirm(); };
}

/* ============================================================
   GENERACIÓN DE PDF
   ============================================================ */
function pdfHeader(doc, title) {
  doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(30, 30, 30);
  doc.text(title, 14, 18);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(120, 120, 120);
  doc.text('Generado el ' + new Date().toLocaleString('es-GT'), 14, 24);
  doc.setDrawColor(220, 220, 220); doc.line(14, 28, 196, 28);
}
async function generarPdfGeneral() {
  let data;
  try { data = await api('/reportes/general'); } catch (e) { toast('No se pudo generar el PDF'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  pdfHeader(doc, 'Cuentas-App — Reporte general');
  doc.setFontSize(11); doc.setTextColor(30, 30, 30);
  doc.text('Balance general: ' + money(data.balance), 14, 38);
  doc.text('Total de cuentas: ' + data.cuentas.length, 14, 45);
  const rows = data.cuentas.map(c => [c.nombre, c.favorito ? 'Sí' : 'No', money(c.balance)]);
  doc.autoTable({ startY: 52, head: [['Cliente', 'Favorito', 'Balance']], body: rows, styles: { fontSize: 9 }, headStyles: { fillColor: [40, 40, 40] } });
  data.cuentas.forEach(c => {
    doc.addPage();
    pdfHeader(doc, 'Cuenta: ' + c.nombre);
    doc.setFontSize(11);
    doc.text('Balance actual: ' + money(c.balance), 14, 38);
    const movRows = c.movimientos.map(m => [fmtDateShort(m.fecha), fmtTime(m.fecha), m.tipo, m.descripcion || '', money(m.monto), money(m.saldo_resultante), m.usuario || '']);
    if (movRows.length) {
      doc.autoTable({ startY: 45, head: [['Fecha', 'Hora', 'Tipo', 'Descripción', 'Monto', 'Saldo', 'Registrado por']], body: movRows, styles: { fontSize: 8 }, headStyles: { fillColor: [40, 40, 40] } });
    } else {
      doc.setFontSize(10); doc.setTextColor(140, 140, 140); doc.text('Sin movimientos registrados.', 14, 45);
    }
  });
  doc.save('cuentas-app-reporte-general.pdf');
  toast('PDF generado');
}
function generarPdfCuenta(c) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  pdfHeader(doc, 'Historial de cuenta: ' + c.nombre);
  doc.setFontSize(11); doc.setTextColor(30, 30, 30);
  doc.text('Balance actual: ' + money(c.balance), 14, 38);
  const movRows = c.movimientos.map(m => [fmtDateShort(m.fecha), fmtTime(m.fecha), m.tipo, m.descripcion || '', money(m.monto), money(m.saldo_resultante), m.usuario || '']);
  if (movRows.length) {
    doc.autoTable({ startY: 45, head: [['Fecha', 'Hora', 'Tipo', 'Descripción', 'Monto', 'Saldo', 'Registrado por']], body: movRows, styles: { fontSize: 8 }, headStyles: { fillColor: [40, 40, 40] } });
  } else {
    doc.setFontSize(10); doc.setTextColor(140, 140, 140); doc.text('Sin movimientos registrados.', 14, 45);
  }
  doc.save('cuenta-' + c.nombre.replace(/\s+/g, '-').toLowerCase() + '.pdf');
  toast('PDF generado');
}
function openPdfTiendaFilterModal() {
  const today = new Date();
  const isoDay = today.toISOString().slice(0, 10);
  const isoMonth = today.toISOString().slice(0, 7);
  showModal(`
    <h3>Generar PDF de la tienda</h3>
    <p class="desc">Elige el rango de movimientos a incluir.</p>
    <div class="toggle-row" id="pdfRangeToggle">
      <button class="toggle-opt selected" data-range="all">${ICONS.all} Todo</button>
      <button class="toggle-opt" data-range="month">${ICONS.calendar} Mes</button>
      <button class="toggle-opt" data-range="day">${ICONS.calendar} Día</button>
    </div>
    <div class="field hidden" id="dayField"><label>Selecciona el día</label><input type="date" id="pdfDay" value="${isoDay}"></div>
    <div class="field hidden" id="monthField"><label>Selecciona el mes</label><input type="month" id="pdfMonth" value="${isoMonth}"></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmPdfTienda">Generar PDF</button>
    </div>
  `);
  let range = 'all';
  document.querySelectorAll('#pdfRangeToggle .toggle-opt').forEach(b => {
    b.addEventListener('click', () => {
      range = b.dataset.range;
      document.querySelectorAll('#pdfRangeToggle .toggle-opt').forEach(x => x.classList.toggle('selected', x === b));
      document.getElementById('dayField').classList.toggle('hidden', range !== 'day');
      document.getElementById('monthField').classList.toggle('hidden', range !== 'month');
    });
  });
  document.getElementById('confirmPdfTienda').onclick = () => {
    let filtered = TIENDA.movimientos;
    let label = 'Todo el historial';
    if (range === 'day') {
      const day = document.getElementById('pdfDay').value;
      filtered = TIENDA.movimientos.filter(m => m.fecha.slice(0, 10) === day);
      label = 'Día: ' + day;
    } else if (range === 'month') {
      const month = document.getElementById('pdfMonth').value;
      filtered = TIENDA.movimientos.filter(m => m.fecha.slice(0, 7) === month);
      label = 'Mes: ' + month;
    }
    generarPdfTienda(filtered, label);
    closeModal();
  };
}
function getImageSize(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 1, h: 1 });
    img.src = dataUrl;
  });
}
/* ============================================================
   GENERADOR DE FACTURAS (simple, sin base de datos por ahora)
   ============================================================ */
let invoiceItems = [];
function openInvoicePage(opts = {}) {
  if (invoiceItems.length === 0) invoiceItems = [{ producto: '', precio: '', cantidad: '1' }];
  renderInvoicePage();
  if (!opts.fromHistory) history.pushState({ view: 'invoice' }, '', location.href);
}
function renderInvoicePage() {
  const root = document.getElementById('pageRoot');
  const fecha = new Date().toISOString();
  root.innerHTML = `
    <div class="page-slide" id="invoicePage">
      <div class="page-header">
        <button class="back-btn" id="invoiceBack">${ICONS.back}</button>
        <h2>Generar factura</h2>
      </div>
      <div class="detail-body">
        <p class="desc" style="margin:0 0 16px;">${fmtDateShort(fecha)} · ${fmtTime(fecha)}</p>
        <div class="section-title">Productos</div>
        <div id="invoiceItemsWrap"></div>
        <button class="pdf-btn" id="btnAddItem" style="margin-top:4px;">${ICONS.plus} Agregar producto</button>
        <div class="balance-block">
          <div class="balance-label">Total</div>
          <div class="balance-amount pos" id="invoiceTotal">${money(0)}</div>
        </div>
        <button class="pdf-btn" id="btnGenInvoicePdf">${ICONS.pdf} Generar PDF de la factura</button>
      </div>
    </div>`;
  document.getElementById('invoiceBack').onclick = () => history.back();
  document.getElementById('btnAddItem').onclick = () => { invoiceItems.push({ producto: '', precio: '', cantidad: '1' }); renderInvoiceItems(); };
  document.getElementById('btnGenInvoicePdf').onclick = generarPdfFactura;
  renderInvoiceItems();
}
function renderInvoiceItems() {
  const wrap = document.getElementById('invoiceItemsWrap');
  wrap.innerHTML = invoiceItems.map((it, idx) => `
    <div class="invoice-item-row" data-idx="${idx}">
      <input type="text" class="invoice-input inv-producto" data-idx="${idx}" placeholder="Producto" value="${escapeHtml(it.producto)}">
      <input type="number" step="0.01" min="0" class="invoice-input inv-precio" data-idx="${idx}" placeholder="Precio" value="${it.precio}">
      <input type="number" step="1" min="1" class="invoice-input inv-cantidad" data-idx="${idx}" placeholder="Cant." value="${it.cantidad}">
      <div class="invoice-subtotal" id="invSubtotal-${idx}">${money((parseFloat(it.precio) || 0) * (parseFloat(it.cantidad) || 0))}</div>
      <button class="invoice-remove" data-remove="${idx}">${ICONS.trash}</button>
    </div>
  `).join('');
  wrap.querySelectorAll('.inv-producto').forEach(inp => inp.oninput = (e) => { invoiceItems[e.target.dataset.idx].producto = e.target.value; });
  wrap.querySelectorAll('.inv-precio').forEach(inp => inp.oninput = (e) => { invoiceItems[e.target.dataset.idx].precio = e.target.value; updateInvoiceRow(e.target.dataset.idx); });
  wrap.querySelectorAll('.inv-cantidad').forEach(inp => inp.oninput = (e) => { invoiceItems[e.target.dataset.idx].cantidad = e.target.value; updateInvoiceRow(e.target.dataset.idx); });
  wrap.querySelectorAll('[data-remove]').forEach(btn => btn.onclick = () => {
    invoiceItems.splice(Number(btn.dataset.remove), 1);
    if (invoiceItems.length === 0) invoiceItems.push({ producto: '', precio: '', cantidad: '1' });
    renderInvoiceItems();
  });
  updateInvoiceTotal();
}
function updateInvoiceRow(idx) {
  const it = invoiceItems[idx];
  const sub = (parseFloat(it.precio) || 0) * (parseFloat(it.cantidad) || 0);
  const el = document.getElementById('invSubtotal-' + idx);
  if (el) el.textContent = money(sub);
  updateInvoiceTotal();
}
function updateInvoiceTotal() {
  const total = invoiceItems.reduce((s, it) => s + (parseFloat(it.precio) || 0) * (parseFloat(it.cantidad) || 0), 0);
  const el = document.getElementById('invoiceTotal');
  if (el) el.textContent = money(total);
}
function generarPdfFactura() {
  const validItems = invoiceItems.filter(it => it.producto.trim() && parseFloat(it.precio) > 0 && parseFloat(it.cantidad) > 0);
  if (validItems.length === 0) { toast('Agrega al menos un producto con precio y cantidad'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  pdfHeader(doc, 'Factura');
  const fecha = new Date();
  doc.setFontSize(10); doc.setTextColor(100, 100, 100);
  doc.text(`Fecha: ${fmtDateShort(fecha.toISOString())}   Hora: ${fmtTime(fecha.toISOString())}`, 14, 36);
  const rows = validItems.map(it => [it.producto, money(parseFloat(it.precio)), it.cantidad, money(parseFloat(it.precio) * parseFloat(it.cantidad))]);
  const total = validItems.reduce((s, it) => s + parseFloat(it.precio) * parseFloat(it.cantidad), 0);
  doc.autoTable({ startY: 43, head: [['Producto', 'Precio', 'Cantidad', 'Subtotal']], body: rows, styles: { fontSize: 9.5 }, headStyles: { fillColor: [40, 40, 40] } });
  const finalY = doc.lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(30, 30, 30);
  doc.text('Total: ' + money(total), 14, finalY);
  doc.save('factura-' + fecha.toISOString().slice(0, 10) + '-' + fecha.getTime() + '.pdf');
  toast('Factura generada');
  invoiceItems = [{ producto: '', precio: '', cantidad: '1' }];
}


async function generarPdfTienda(movs, label) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  pdfHeader(doc, 'Movimientos de la tienda');
  doc.setFontSize(10); doc.setTextColor(100, 100, 100);
  doc.text('Rango: ' + label, 14, 36);
  const rows = movs.map(m => [fmtDateShort(m.fecha), fmtTime(m.fecha), m.tipo, m.descripcion || '', money(m.monto), money(m.saldo_resultante), m.usuario || '']);
  if (rows.length) {
    doc.autoTable({ startY: 43, head: [['Fecha', 'Hora', 'Tipo', 'Descripción', 'Monto', 'Saldo', 'Registrado por']], body: rows, styles: { fontSize: 8 }, headStyles: { fillColor: [40, 40, 40] } });
  } else {
    doc.setFontSize(10); doc.setTextColor(140, 140, 140); doc.text('No hay movimientos en este rango.', 14, 43);
  }

  const conFoto = movs.filter(m => m.foto);
  for (const m of conFoto) {
    doc.addPage();
    pdfHeader(doc, 'Factura — ' + fmtDateShort(m.fecha) + ' ' + fmtTime(m.fecha));
    doc.setFontSize(10); doc.setTextColor(80, 80, 80);
    doc.text(`${m.tipo === 'entrada' ? 'Entrada' : 'Salida'} · ${m.descripcion || ''} · ${money(m.monto)}`, 14, 36);
    const { w, h } = await getImageSize(m.foto);
    const maxW = 182, maxH = 230;
    let drawW = maxW, drawH = (h / w) * drawW;
    if (drawH > maxH) { drawH = maxH; drawW = (w / h) * drawH; }
    doc.addImage(m.foto, 'JPEG', 14, 44, drawW, drawH);
  }

  doc.save('tienda-movimientos.pdf');
  toast('PDF generado');
}

/* ============================================================
   INICIO
   ============================================================ */
updateSyncDot();
registerServiceWorker();
initAuth();
