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
  fingerprint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  receipt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>`,
};

/* ============================================================
   IDENTIDAD DE ESTE DISPOSITIVO/PESTAÑA + CLIENTE DE LA API
   ============================================================ */
const CLIENT_ID = (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));

/* ============================================================
   WEBAUTHN (huella/Face ID): helpers de conversión base64url <-> buffers
   ============================================================ */
function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64urlToBuffer(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const str = atob(padded);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes.buffer;
}
function prepareCreationOptions(options) {
  const opts = JSON.parse(JSON.stringify(options));
  opts.challenge = base64urlToBuffer(opts.challenge);
  opts.user.id = base64urlToBuffer(opts.user.id);
  if (opts.excludeCredentials) opts.excludeCredentials = opts.excludeCredentials.map(c => ({ ...c, id: base64urlToBuffer(c.id) }));
  return opts;
}
function prepareRequestOptions(options) {
  const opts = JSON.parse(JSON.stringify(options));
  opts.challenge = base64urlToBuffer(opts.challenge);
  if (opts.allowCredentials) opts.allowCredentials = opts.allowCredentials.map(c => ({ ...c, id: base64urlToBuffer(c.id) }));
  return opts;
}
function serializeCredential(cred) {
  if (cred.toJSON) return cred.toJSON();
  const base = {
    id: cred.id,
    rawId: bufferToBase64url(cred.rawId),
    type: cred.type,
    clientExtensionResults: cred.getClientExtensionResults ? cred.getClientExtensionResults() : {},
  };
  if (cred.response.attestationObject) {
    base.response = {
      clientDataJSON: bufferToBase64url(cred.response.clientDataJSON),
      attestationObject: bufferToBase64url(cred.response.attestationObject),
      transports: (cred.response.getTransports && cred.response.getTransports()) || [],
    };
  } else {
    base.response = {
      clientDataJSON: bufferToBase64url(cred.response.clientDataJSON),
      authenticatorData: bufferToBase64url(cred.response.authenticatorData),
      signature: bufferToBase64url(cred.response.signature),
      userHandle: cred.response.userHandle ? bufferToBase64url(cred.response.userHandle) : undefined,
    };
  }
  return base;
}
function fingerprintSupported() { return !!window.PublicKeyCredential; }
function hasFingerprintFlag() { return localStorage.getItem('cuentasapp_fp') === '1'; }
function setFingerprintFlag(v) { try { if (v) localStorage.setItem('cuentasapp_fp', '1'); else localStorage.removeItem('cuentasapp_fp'); } catch (e) {} }
// auto = true: lo lanzó la app sola al abrirse. Si el navegador no lo permite sin un toque
// (Safari en iPhone) o la persona lo cancela, se queda en silencio en la pantalla de huella.
async function loginWithFingerprint({ auto = false } = {}) {
  if (!fingerprintSupported()) { toast('Este navegador no soporta huella/Face ID'); return; }
  const aviso = document.getElementById('fpMsg');
  const btn = document.getElementById('fpCircle');
  if (aviso) aviso.textContent = '';
  if (btn) btn.classList.add('scanning');
  try {
    const { options, requestId } = await api('/webauthn/login-options');
    const publicKey = prepareRequestOptions(options);
    // Si ya conocemos la credencial de este dispositivo, se la indicamos al navegador
    // para que pida la huella directo, sin mostrar un selector de llaves guardadas.
    let storedCredId = null;
    try { storedCredId = localStorage.getItem('cuentasapp_fp_credid'); } catch (e) {}
    if (storedCredId) publicKey.allowCredentials = [{ id: base64urlToBuffer(storedCredId), type: 'public-key' }];
    const cred = await navigator.credentials.get({ publicKey });
    const serialized = serializeCredential(cred);
    const res = await fetch('/api/webauthn/login-verify', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Client-Id': CLIENT_ID },
      credentials: 'include', body: JSON.stringify({ requestId, response: serialized }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.error === 'passwordExpired') { renderForcedPasswordChange(data.codigoEmpresa, data.usuario, null, data.message); return; }
      // La huella ya no es válida en el servidor (p. ej. se restableció la contraseña): se pasa a la contraseña.
      renderLogin(true);
      const err = document.getElementById('loginErr');
      if (err) err.textContent = data.error || 'No se pudo entrar con la huella. Usa tu usuario y contraseña.';
      return;
    }
    AUTH = data.user;
    EMPRESA = data.empresa;
    try { localStorage.setItem('cuentasapp_fp_credid', cred.id); setFingerprintFlag(true); } catch (e) {}
    enterApp();
  } catch (e) {
    if (auto) return; // intento automático: sin mensajes, la persona puede tocar el botón
    const cancelado = e && e.name === 'NotAllowedError';
    const msg = document.getElementById('fpMsg');
    if (msg) msg.textContent = cancelado ? 'Se canceló. Toca la huella para intentarlo de nuevo.' : 'No se pudo leer la huella. Inténtalo de nuevo o entra con tu contraseña.';
    else toast(cancelado ? 'Se canceló el inicio con huella' : 'No se pudo iniciar sesión con huella');
  } finally {
    const b = document.getElementById('fpCircle');
    if (b) b.classList.remove('scanning');
  }
}
function openRegisterFingerprintModal() {
  if (!fingerprintSupported()) { toast('Este navegador no soporta huella/Face ID'); return; }
  showModal(`
    <h3>Registrar este dispositivo</h3>
    <p class="desc">Te va a pedir tu huella o Face ID. Solo funcionará para iniciar sesión desde este mismo dispositivo.</p>
    <div class="field"><label>Nombre para este dispositivo</label><input id="fpDeviceName" type="text" placeholder="Ej. Mi teléfono"></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmFpReg">Continuar</button>
    </div>
    <p class="login-error" id="fpRegErr"></p>
  `);
  document.getElementById('confirmFpReg').onclick = async () => {
    const deviceName = document.getElementById('fpDeviceName').value.trim() || 'Este dispositivo';
    const err = document.getElementById('fpRegErr');
    try {
      const options = await api('/webauthn/register-options');
      const publicKey = prepareCreationOptions(options);
      const cred = await navigator.credentials.create({ publicKey });
      const serialized = serializeCredential(cred);
      await api('/webauthn/register-verify', { method: 'POST', body: { response: serialized, deviceName } });
      setFingerprintFlag(true);
      try { localStorage.setItem('cuentasapp_fp_credid', cred.id); } catch (e) {}
      closeModal();
      toast('Huella registrada en este dispositivo');
      renderUsersPage();
    } catch (e) {
      if (e && e.name === 'NotAllowedError') { err.textContent = 'Se canceló la operación.'; return; }
      err.textContent = 'No se pudo registrar la huella. Intenta de nuevo.';
    }
  };
}

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
      if (esTabCuentas() && !document.getElementById('detailPage')) renderDeudas();
    } else if (scope === 'cuenta') {
      CUENTAS = await api('/cuentas');
      if (esTabCuentas()) renderDeudas();
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
async function refrescarTodo() {
  try {
    CUENTAS = await api('/cuentas');
    TIENDA = await api('/tienda');
    if (esTabCuentas()) renderDeudas();
    if (currentTab === 'tienda') renderTienda();
    if (currentAccountDetail) {
      currentAccountDetail = await api(`/cuentas/${currentAccountDetail.id}`);
      if (document.getElementById('detailPage')) renderAccountDetailPage();
    }
  } catch (e) { /* si falla, se reintentará en el próximo evento */ }
}
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible' || !AUTH) return;
  // La app puede "despertar" sin recargar de verdad (el celular la congeló en segundo plano
  // en vez de cerrarla). Antes de refrescar datos, confirmamos que la sesión siga siendo válida
  // en el servidor — si ya no lo es (se cerró sola, venció, etc.), regresamos a la pantalla de login
  // en vez de quedarnos mostrando la app vacía.
  try {
    const status = await api('/auth/status');
    if (!status.user) { await doLogoutCleanup(); return; }
    AUTH = status.user;
    refrescarTodo();
  } catch (e) { /* sin conexión: ya se muestra el aviso correspondiente */ }
});
window.addEventListener('online', () => {
  document.getElementById('offlineBanner').classList.add('hidden');
  if (AUTH) refrescarTodo();
});

/* ============================================================
   ANIMACIONES (se apagan solas si el usuario las desactiva o el equipo es modesto: ver tema.js)
   ============================================================ */
function animOn() { return !!(window.CuentasTema && window.CuentasTema.animacionesActivas()); }
// Marca un instante de "llegada a una pantalla" para que la entrada escalonada se vea solo entonces.
let _entradaT = null;
function animarEntrada() {
  if (!animOn()) return;
  document.body.classList.add('animar-entrada');
  clearTimeout(_entradaT);
  _entradaT = setTimeout(() => document.body.classList.remove('animar-entrada'), 900);
}
// Saldos que "cuentan" desde el valor anterior hasta el nuevo.
const saldosMostrados = new Map();
function animarSaldos(root = document) {
  root.querySelectorAll('.balance-amount[data-saldo]').forEach(el => {
    const clave = el.dataset.clave, nuevo = Number(el.dataset.saldo);
    const previo = saldosMostrados.has(clave) ? saldosMostrados.get(clave) : 0;
    saldosMostrados.set(clave, nuevo);
    if (!animOn() || previo === nuevo || !isFinite(nuevo)) return;
    const inicio = performance.now(), dur = 650;
    const paso = (t) => {
      const k = Math.min(1, (t - inicio) / dur), suav = 1 - Math.pow(1 - k, 3);
      el.textContent = money(previo + (nuevo - previo) * suav);
      if (k < 1 && el.isConnected) requestAnimationFrame(paso);
    };
    el.textContent = money(previo);
    requestAnimationFrame(paso);
  });
}
// Resalta un elemento recién creado (p. ej. el movimiento que se acaba de guardar).
function resaltar(selector) {
  if (!animOn()) return;
  const el = document.querySelector(selector);
  if (el) { el.classList.remove('nuevo'); void el.offsetWidth; el.classList.add('nuevo'); }
}

/* ============================================================
   ESTADO
   ============================================================ */
let AUTH = null;
let CUENTAS = [];
let TIENDA = { balance: 0, balanceHoy: 0, movimientos: [] };
let currentAccountDetail = null;

let currentTab = 'cobrar';     // 'cobrar' | 'pagar' | 'tienda'
let tipoCuentas = 'cobrar';    // qué cuentas muestra la vista de cuentas: 'cobrar' | 'pagar'
const ORDEN_PESTANAS = ['cobrar', 'pagar', 'tienda'];
function esTabCuentas(t = currentTab) { return t === 'cobrar' || t === 'pagar'; }
// Cuentas del tipo que se está viendo (las antiguas, sin tipo, son "por cobrar").
function cuentasVisibles() { return CUENTAS.filter(c => (c.tipo || 'cobrar') === tipoCuentas); }
const TEXTOS_TIPO = {
  cobrar: { total: 'Total por cobrar', nuevaDesc: 'Ingresa el nombre del cliente o deudor.', vacio: 'Aún no tienes cuentas por cobrar. Crea la primera con el botón Crear.',
            pdfTitulo: 'Cuentas por cobrar', pdfQuien: 'Cliente', pdfArchivo: 'cuentas-por-cobrar.pdf',
            abonoDesc: 'Registra un pago que te hizo esta cuenta.', cargoDesc: 'Registra algo que esta cuenta queda debiendo.' },
  pagar:  { total: 'Total por pagar', nuevaDesc: 'Ingresa el nombre del proveedor o a quién le debes.', vacio: 'Aún no tienes cuentas por pagar. Crea la primera con el botón Crear.',
            pdfTitulo: 'Cuentas por pagar', pdfQuien: 'Proveedor', pdfArchivo: 'cuentas-por-pagar.pdf',
            abonoDesc: 'Registra un pago que tú le hiciste a esta cuenta.', cargoDesc: 'Registra una compra o deuda nueva con esta cuenta.' },
};
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
// Fecha corta al estilo de los chats: hora si fue hoy, "Ayer", día de la semana o fecha.
function fmtActividad(iso) {
  if (!iso) return '';
  const d = new Date(iso), hoy = new Date();
  const dias = Math.round((new Date(hoy.toDateString()) - new Date(d.toDateString())) / 86400000);
  if (dias <= 0) return fmtTime(iso);
  if (dias === 1) return 'Ayer';
  if (dias < 7) return d.toLocaleDateString('es-GT', { weekday: 'long' }).replace(/^./, x => x.toUpperCase());
  return d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short', ...(d.getFullYear() !== hoy.getFullYear() ? { year: 'numeric' } : {}) }).replace('.', '');
}
const tiempoActividad = c => new Date(c.ultima_actividad || c.fecha_creacion || 0).getTime();
function initialOf(name) { return (name || '?').trim().charAt(0).toUpperCase(); }
function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}
/* Cómo se muestran los saldos de las cuentas.
   Internamente un abono suma y un cargo resta, así que lo que se debe es -balance.
   En pantalla se muestra SIN signo y el color indica la dirección del dinero:
   Por cobrar = verde (te van a pagar) · Por pagar = rojo (tú vas a pagar) · en cero = gris.
   Si se pagó de más, el monto se marca "a favor". */
function deudaDe(balance) { const d = -(Number(balance) || 0); return Math.abs(d) < 0.005 ? 0 : d; }
function claseSaldo(balance, tipo) {
  const d = deudaDe(balance);
  return d > 0 ? (tipo === 'pagar' ? 'neg' : 'pos') : d < 0 ? 'favor' : 'cero';
}
function textoAFavor(tipo) { return tipo === 'pagar' ? 'Saldo a tu favor' : 'Saldo a favor del cliente'; }
function montoSaldo(balance) { return money(Math.abs(deudaDe(balance))); }
// Monto + etiqueta corta "a favor" (para listas).
function saldoHtml(balance) { return montoSaldo(balance) + (deudaDe(balance) < 0 ? ' <span class="a-favor">a favor</span>' : ''); }
// Para PDF y textos planos.
function saldoTexto(balance, tipo) { return montoSaldo(balance) + (deudaDe(balance) < 0 ? ' (' + textoAFavor(tipo).toLowerCase() + ')' : ''); }
// Cuadro grande del saldo: el número cuenta animado; la nota "a favor" va debajo.
function saldoGrandeHtml(balance, tipo, clave) {
  return `<div class="balance-amount ${claseSaldo(balance, tipo)}" data-saldo="${Math.abs(deudaDe(balance))}" data-clave="${clave}">${montoSaldo(balance)}</div>`
    + (deudaDe(balance) < 0 ? `<div class="balance-nota">${textoAFavor(tipo)}</div>` : '');
}
// Resumen de arriba en Por cobrar / Por pagar: Te deben · Debes · Neto + botón PDF.
// Reemplaza a los cuadros de "Total por cobrar/pagar"; se resalta la columna de la pestaña abierta.
function totalesCuentas() {
  const suma = t => CUENTAS.filter(c => (c.tipo || 'cobrar') === t).reduce((s, c) => s + deudaDe(c.balance), 0);
  const teDeben = suma('cobrar'), debes = suma('pagar');
  return { teDeben, debes, neto: Math.round((teDeben - debes) * 100) / 100 };
}
// Si un monto no cabe en su columna (p. ej. Q 127,265.50 en un teléfono chico), se achica la letra lo justo.
function ajustarMontosResumen() {
  document.querySelectorAll('.resumen-cols b').forEach(b => {
    b.style.fontSize = '';
    if (!b.clientWidth) return; // vista oculta: se ajusta al mostrarse
    let fs = parseFloat(getComputedStyle(b).fontSize);
    while (b.scrollWidth > b.clientWidth && fs > 9) { fs -= 0.5; b.style.fontSize = fs + 'px'; }
  });
}
window.addEventListener('resize', ajustarMontosResumen);
function textoNeto(neto) { return (neto > 0 ? '+' : '') + money(neto); }
function resumenHtml() {
  const { teDeben, debes, neto } = totalesCuentas();
  return `<div class="resumen-bar">
      <div class="resumen-cols">
        <span class="${tipoCuentas === 'cobrar' ? 'activo' : ''}">Te deben <b class="pos" data-total="cobrar">${money(teDeben)}</b></span>
        <span class="${tipoCuentas === 'pagar' ? 'activo' : ''}">Debes <b class="neg" data-total="pagar">${money(debes)}</b></span>
        <span>Neto <b class="${neto > 0 ? 'pos' : neto < 0 ? 'neg' : 'cero'}" data-total="neto">${textoNeto(neto)}</b></span>
      </div>
      <button class="resumen-pdf" id="btnPdfGeneral" type="button" aria-label="Generar PDF">${ICONS.pdf}<span>PDF</span></button>
    </div>`;
}
function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/* ============================================================
   AUTENTICACIÓN
   ============================================================ */
let empresaCreationEnabled = false;
let EMPRESA = null; // {id, nombre, codigo} de la empresa actual, una vez logueado
async function initAuth() {
  try {
    const status = await api('/auth/status');
    empresaCreationEnabled = !!status.empresaCreationEnabled;
    if (status.user) { AUTH = status.user; return enterApp(); }
    renderLogin(false, { autoHuella: true }); // solo al abrir la app, no al cerrar sesión
  } catch (e) {
    renderLogin();
  }
}
// Usuario para entrar: "usuario@codigodeempresa" (p. ej. carlos@tiendasantae). Así no hace falta
// un campo aparte para el código de empresa. Se separa en la ÚLTIMA arroba; el código no distingue
// mayúsculas (el servidor lo pasa a mayúsculas), el usuario sí, igual que antes.
function idAcceso(usuario, codigo) { return `${usuario}@${String(codigo || '').toLowerCase()}`; }
function leerAcceso(texto) {
  const t = String(texto || '').trim();
  const i = t.lastIndexOf('@');
  if (i <= 0 || i === t.length - 1) return null;
  return { usuario: t.slice(0, i).trim(), codigoEmpresa: t.slice(i + 1).trim().toUpperCase() };
}
// Usuario a partir del nombre: minúsculas, sin acentos, sin espacios ni símbolos ("María López" → "marialopez").
function usuarioDesdeNombre(nombre) {
  return String(nombre || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 60);
}
const AYUDA_ACCESO = 'Escribe tu usuario, una @ y el código de tu empresa. Ejemplo: carlos@tiendasantae';
// Pantalla de inicio de sesión.
// - Si este dispositivo ya tiene la huella registrada: pantalla de huella (y, al abrir la app,
//   se pide la huella automáticamente donde el navegador lo permite).
// - Si no, o si la persona elige "usuario y contraseña": formulario normal.
function renderLogin(forcePasswordForm, { autoHuella = false } = {}) {
  const root = document.getElementById('loginScreen');
  const conHuella = fingerprintSupported() && hasFingerprintFlag();

  if (conHuella && !forcePasswordForm) {
    root.innerHTML = `
      <div class="login-card login-card-fp">
        <img class="login-logo" src="/favicon.svg" alt="" width="56" height="56">
        <h1>Kaab</h1>
        <p class="sub">Hola de nuevo. Entra con tu huella o Face ID.</p>
        <button class="fp-circle" id="fpCircle" aria-label="Entrar con huella o Face ID">${ICONS.fingerprint}</button>
        <p class="fp-hint">Toca para usar la huella</p>
        <p class="login-error" id="fpMsg"></p>
        <p class="login-toggle"><button id="showPasswordForm">Entrar con usuario y contraseña</button></p>
      </div>`;
    document.getElementById('fpCircle').onclick = () => loginWithFingerprint();
    document.getElementById('showPasswordForm').onclick = () => renderLogin(true);
    if (autoHuella) loginWithFingerprint({ auto: true });
    return;
  }

  root.innerHTML = `
    <div class="login-card">
      <img class="login-logo" src="/favicon.svg" alt="" width="56" height="56">
      <h1>Kaab</h1>
      <p class="sub">Inicia sesión en tu empresa.</p>
      <div class="field">
        <label for="loginUsuario">Usuario</label>
        <input id="loginUsuario" type="text" inputmode="email" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="usuario@empresa">
        <p class="field-hint">Tu usuario, una @ y el código de tu empresa. Te lo da el administrador.</p>
      </div>
      <div class="field"><label for="loginPass">Contraseña</label><input id="loginPass" type="password" autocomplete="current-password"></div>
      <button class="btn-primary" id="loginBtn">Iniciar sesión</button>
      <p class="login-error" id="loginErr"></p>
      ${fingerprintSupported() ? `<button class="btn-secondary" id="fpLoginBtn">${ICONS.fingerprint}<span>${conHuella ? 'Volver a entrar con huella' : 'Entrar con huella / Face ID'}</span></button>` : ''}
      ${empresaCreationEnabled ? `<p class="login-toggle"><button id="goCreateEmpresa">Crear nueva empresa</button></p>` : ''}
      <p class="login-help">¿Olvidaste tu contraseña? Pídele al administrador de tu empresa que te la restablezca.</p>
    </div>`;
  if (fingerprintSupported()) {
    document.getElementById('fpLoginBtn').onclick = () => (conHuella ? renderLogin(false) : loginWithFingerprint());
  }
  const tryLogin = async () => {
    const accesoTxt = document.getElementById('loginUsuario').value;
    const contrasena = document.getElementById('loginPass').value;
    const err = document.getElementById('loginErr');
    if (!accesoTxt.trim() || !contrasena) { err.textContent = 'Escribe tu usuario y tu contraseña.'; return; }
    const acceso = leerAcceso(accesoTxt);
    if (!acceso) { err.textContent = AYUDA_ACCESO; return; }
    const { codigoEmpresa, usuario: usuarioVal } = acceso;
    const btn = document.getElementById('loginBtn');
    btn.disabled = true; err.textContent = '';
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Client-Id': CLIENT_ID },
        credentials: 'include', body: JSON.stringify({ codigoEmpresa, usuario: usuarioVal, contrasena }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.error === 'passwordExpired') { renderForcedPasswordChange(data.codigoEmpresa, usuarioVal, contrasena, data.message); return; }
        err.textContent = res.status === 401 ? 'Usuario o contraseña incorrectos. Revisa que después de la @ vaya el código de tu empresa.' : (data.error || 'No se pudo iniciar sesión.');
        return;
      }
      AUTH = data.user;
      EMPRESA = data.empresa;
      enterApp();
    } catch (e) { err.textContent = 'No se pudo conectar con el servidor.'; }
    finally { btn.disabled = false; }
  };
  document.getElementById('loginBtn').onclick = tryLogin;
  root.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); }));
  if (empresaCreationEnabled) document.getElementById('goCreateEmpresa').onclick = () => renderCreateEmpresaView();
}
function renderForcedPasswordChange(codigoEmpresa, usuario, contrasenaActual, message) {
  const root = document.getElementById('loginScreen');
  root.innerHTML = `
    <div class="login-card">
      <div class="login-mark">${ICONS.key}</div>
      <h1>Actualiza tu contraseña</h1>
      <p class="sub">${escapeHtml(message || 'Tu contraseña tiene más de 6 meses y debes actualizarla para continuar.')}</p>
      ${contrasenaActual ? '' : `
        <div class="field"><label>Usuario</label><input id="fpcUsuario" type="text" inputmode="email" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="usuario@empresa" value="${escapeHtml(usuario && codigoEmpresa ? idAcceso(usuario, codigoEmpresa) : '')}"></div>
        <div class="field"><label>Contraseña actual</label><input id="fpcActual" type="password"></div>`}
      <div class="field"><label>Nueva contraseña</label><input id="fpcNueva" type="password" placeholder="Mínimo 8 caracteres"></div>
      <button class="btn-primary" id="fpcBtn">Actualizar y continuar</button>
      <p class="login-error" id="fpcErr"></p>
    </div>`;
  document.getElementById('fpcBtn').onclick = async () => {
    const err = document.getElementById('fpcErr');
    const acceso = contrasenaActual ? { codigoEmpresa, usuario } : leerAcceso(document.getElementById('fpcUsuario').value);
    if (!acceso) { err.textContent = AYUDA_ACCESO; return; }
    const codigoVal = acceso.codigoEmpresa, usuarioVal = acceso.usuario;
    const actual = contrasenaActual || document.getElementById('fpcActual').value;
    const nueva = document.getElementById('fpcNueva').value;
    if (!codigoVal || !usuarioVal || !actual || !nueva || nueva.length < 8) { err.textContent = 'Completa todos los campos (mínimo 8 caracteres).'; return; }
    try {
      const { user, empresa } = await api('/auth/force-change-password', { method: 'POST', body: { codigoEmpresa: codigoVal, usuario: usuarioVal, contrasena: actual, nuevaContrasena: nueva } });
      AUTH = user; EMPRESA = empresa;
      toast('Contraseña actualizada');
      enterApp();
    } catch (e) { err.textContent = typeof e === 'string' ? e : 'No se pudo actualizar la contraseña.'; }
  };
}
function renderCreateEmpresaView() {
  const root = document.getElementById('loginScreen');
  root.innerHTML = `
    <div class="login-card">
      <div class="login-mark">${ICONS.userPlus}</div>
      <h1>Crear nueva empresa</h1>
      <p class="sub">Vas a ser el único administrador de esta empresa. Necesitas el código de invitación que te dieron.</p>
      <div class="field"><label>Nombre de la empresa</label><input id="ceNombreEmpresa" type="text" placeholder="Ej. Tienda Santa Elena"></div>
      <div class="field"><label>Tu nombre</label><input id="ceNombre" type="text"></div>
      <div class="field"><label>Usuario</label><input id="ceUsuario" type="text"></div>
      <div class="field"><label>Correo electrónico</label><input id="ceEmail" type="email"></div>
      <div class="field"><label>Contraseña</label><input id="cePass" type="password" placeholder="Mínimo 8 caracteres"></div>
      <div class="field"><label>Código de invitación</label><input id="ceCodigo" type="text"></div>
      <button class="btn-primary" id="ceBtn">Crear empresa</button>
      <p class="login-error" id="ceErr"></p>
      <p class="login-toggle"><button id="backToLoginCE">Ya tengo una empresa, iniciar sesión</button></p>
    </div>`;
  document.getElementById('backToLoginCE').onclick = () => renderLogin();
  document.getElementById('ceBtn').onclick = async () => {
    const nombreEmpresa = document.getElementById('ceNombreEmpresa').value.trim();
    const nombre = document.getElementById('ceNombre').value.trim();
    const usuario = document.getElementById('ceUsuario').value.trim();
    const email = document.getElementById('ceEmail').value.trim();
    const contrasena = document.getElementById('cePass').value;
    const codigo = document.getElementById('ceCodigo').value.trim();
    const err = document.getElementById('ceErr');
    if (!nombreEmpresa || !nombre || !usuario || !email || !contrasena || !codigo) { err.textContent = 'Completa todos los campos.'; return; }
    try {
      const { user, empresa } = await api('/empresas', { method: 'POST', body: { nombreEmpresa, nombre, usuario, email, contrasena, codigo } });
      AUTH = user; EMPRESA = empresa;
      renderEmpresaCreatedScreen(empresa);
    } catch (e) { err.textContent = typeof e === 'string' ? e : 'No se pudo crear la empresa.'; }
  };
}
function renderEmpresaCreatedScreen(empresa) {
  const root = document.getElementById('loginScreen');
  root.innerHTML = `
    <div class="login-card">
      <div class="login-mark">${ICONS.check}</div>
      <h1>¡Empresa creada!</h1>
      <p class="sub">Guarda tu usuario para entrar: lo vas a necesitar junto con tu contraseña. Las personas de tu equipo entrarán igual, con su usuario y el mismo código de empresa después de la @.</p>
      <div class="field">
        <label>Tu usuario para entrar</label>
        <input type="text" value="${escapeHtml(idAcceso(AUTH.usuario, empresa.codigo))}" readonly style="font-size:18px;text-align:center;font-weight:700;">
      </div>
      <div class="field">
        <label>Código de tu empresa</label>
        <input type="text" value="${escapeHtml(empresa.codigo)}" readonly style="font-family:var(--mono);font-size:16px;text-align:center;font-weight:700;letter-spacing:2px;">
      </div>
      <button class="btn-primary" id="ceContinueBtn">Entrar a mi empresa</button>
    </div>`;
  document.getElementById('ceContinueBtn').onclick = () => enterApp();
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
  animarEntrada();
  tipoCuentas = 'cobrar';
  setTabUI('cobrar'); // siempre se empieza en "Por cobrar"
  renderDeudas();
  renderTienda();
  history.replaceState({ view: 'cobrar' }, '', location.href);
  connectWS();
  checkPendingTiendaBackup();
  startIdleWatcher();
}
/* ============================================================
   CIERRE POR INACTIVIDAD (5 minutos)
   ============================================================ */
const IDLE_LIMIT_MS = 5 * 60 * 1000;
let lastActivity = Date.now();
let idleInterval = null;
function markActivity() { lastActivity = Date.now(); }
['click', 'touchstart', 'keydown', 'mousemove', 'scroll'].forEach(evt => {
  document.addEventListener(evt, markActivity, { passive: true });
});
function startIdleWatcher() {
  lastActivity = Date.now();
  if (idleInterval) clearInterval(idleInterval);
  idleInterval = setInterval(() => {
    if (AUTH && Date.now() - lastActivity > IDLE_LIMIT_MS) lockSession();
  }, 15000);
}
async function lockSession() {
  clearInterval(idleInterval);
  try { await api('/auth/logout', { method: 'POST' }); } catch (e) { /* ignorar */ }
  await doLogoutCleanup();
  toast('Sesión cerrada por inactividad');
}
async function logoutManual() {
  try { await api('/auth/logout', { method: 'POST' }); } catch (e) { /* ignorar */ }
  await doLogoutCleanup();
}
async function doLogoutCleanup() {
  AUTH = null;
  EMPRESA = null;
  if (ws) { try { ws.close(); } catch (e) {} }
  document.getElementById('pageRoot').innerHTML = '';
  document.getElementById('modalRoot').innerHTML = '';
  document.getElementById('mainScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  renderLogin();
}
function esAdminActual() { return !!(AUTH && AUTH.rol === 'admin'); }
async function checkPendingTiendaBackup() {
  if (!esAdminActual()) return; // las copias son solo del administrador
  try {
    const pending = await api('/backups/tienda/pending');
    if (!pending) return;
    window.location.href = `/api/backups/tienda/${pending.id}/download`;
    await api(`/backups/tienda/${pending.id}/mark-downloaded`, { method: 'POST' });
    toast(`Se descargó el backup de tienda: ${pending.nombre}`);
  } catch (e) { /* silencioso */ }
}

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
// Interruptor de notificaciones en Perfil → "Notificaciones e historial".
function pushSoportado() { return 'serviceWorker' in navigator && 'PushManager' in window; }
function renderNotifBtn() {
  const sw = document.getElementById('swNotif');
  if (!sw) return;
  sw.classList.toggle('on', notificacionesActivas);
  sw.setAttribute('aria-checked', String(notificacionesActivas));
  sw.disabled = !pushSoportado();
  const estado = document.getElementById('notifEstado');
  if (estado) {
    estado.textContent = !pushSoportado() ? 'Este navegador no permite notificaciones'
      : notificacionesActivas ? 'Activadas en este dispositivo' : 'Desactivadas en este dispositivo';
  }
}

/* ============================================================
   BARRA SUPERIOR
   ============================================================ */
// Buscador de la barra superior: filtra la pestaña que estás viendo
// (Deudas → cuentas por nombre; Tienda → movimientos por descripción, monto o quién lo registró).
document.getElementById('topSearchIcon').innerHTML = ICONS.search;
const buscador = document.getElementById('buscador');
const buscadorLimpiar = document.getElementById('buscadorLimpiar');
function aplicarBusqueda() {
  searchQuery = buscador.value;
  buscadorLimpiar.classList.toggle('hidden', !searchQuery);
  document.body.classList.toggle('busqueda-activa', !!searchQuery.trim()); // oculta las pestañas
  if (currentTab === 'tienda') renderTiendaListOnly(); else renderAccountsListOnly();
}
buscador.addEventListener('input', aplicarBusqueda);
buscador.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === 'Escape') buscador.blur(); });
buscadorLimpiar.addEventListener('click', () => { buscador.value = ''; aplicarBusqueda(); buscador.focus(); });
function reiniciarBusqueda() {
  const habia = !!searchQuery;
  buscador.value = ''; searchQuery = '';
  buscadorLimpiar.classList.add('hidden');
  document.body.classList.remove('busqueda-activa');
  buscador.placeholder = currentTab === 'tienda' ? 'Buscar movimiento…' : 'Buscar cuenta…';
  if (habia) { renderAccountsListOnly(); renderTiendaListOnly(); }
}
document.getElementById('avatarBtn').addEventListener('click', openAccountSettingsPage);

function setTabUI(tab) {
  const anterior = currentTab;
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('deudasView').classList.toggle('hidden', !esTabCuentas(tab));
  document.getElementById('tiendaView').classList.toggle('hidden', tab !== 'tienda');
  if (anterior !== tab) reiniciarBusqueda();
  // "Por cobrar" y "Por pagar" comparten la misma vista: al cambiar de tipo se vuelve a dibujar.
  if (esTabCuentas(tab) && tipoCuentas !== tab) { tipoCuentas = tab; if (AUTH) renderDeudas(); }
  else if (esTabCuentas(tab)) ajustarMontosResumen();
  if (anterior !== tab && animOn()) {
    const vista = document.getElementById(tab === 'tienda' ? 'tiendaView' : 'deudasView');
    vista.classList.remove('entra-der', 'entra-izq');
    void vista.offsetWidth; // reinicia la animación
    vista.classList.add(ORDEN_PESTANAS.indexOf(tab) > ORDEN_PESTANAS.indexOf(anterior) ? 'entra-der' : 'entra-izq');
    animarSaldos(vista);
  }
}
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentTab === btn.dataset.tab) return;
    setTabUI(btn.dataset.tab);
    history.pushState({ view: btn.dataset.tab }, '', location.href);
  });
});

/* ============================================================
   NAVEGACIÓN: el botón "atrás" del navegador regresa dentro de la app
   ============================================================ */
window.addEventListener('popstate', (e) => {
  if (!AUTH) return;
  applyHistoryState(e.state);
});
async function applyHistoryState(state) {
  state = state || { view: 'cobrar' };
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
  } else if (state.view === 'tienda' || state.view === 'pagar') {
    setTabUI(state.view);
  } else {
    setTabUI('cobrar'); // incluye el antiguo 'deudas'
  }
}

/* ============================================================
   VISTA DEUDAS
   ============================================================ */
function renderDeudas() {
  const el = document.getElementById('deudasView');
  el.dataset.tipo = tipoCuentas;
  el.innerHTML = `
    ${resumenHtml()}
    <div class="section-title cuentas-head">
      <span>Tus cuentas <span class="count" id="accountsCount">(${cuentasVisibles().length})</span></span>
      <div class="mini-acciones">
        <button class="mini-btn" id="btnCrearCuenta" type="button">${ICONS.plus}<span>Crear</span></button>
        ${esAdminActual() ? `<button class="mini-btn danger" id="btnEliminarCuentas" type="button">${ICONS.trash}<span>Eliminar</span></button>` : ''}
      </div>
    </div>
    <div id="accountListWrap"></div>
  `;

  document.getElementById('btnCrearCuenta').onclick = openCreateAccountModal;
  if (esAdminActual()) document.getElementById('btnEliminarCuentas').onclick = toggleSelectMode;
  document.getElementById('btnPdfGeneral').onclick = abrirOpcionesPdf;
  renderAccountsListOnly();
  ajustarMontosResumen();
}

// Búsqueda sin importar acentos ni mayúsculas ("lopez" encuentra "López").
function sinAcentos(t) { return String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
// Qué tan bien coincide un nombre con lo escrito (menor = mejor; -1 = no coincide):
// 0 = el nombre empieza así · 1 = alguna palabra empieza así · 2 = lo contiene en otra parte.
function rangoCoincidencia(nombre, q) {
  const n = sinAcentos(nombre);
  if (n.startsWith(q)) return 0;
  if (n.split(/\s+/).some(p => p.startsWith(q))) return 1;
  return n.includes(q) ? 2 : -1;
}
function renderAccountsListOnly() {
  const lista = cuentasVisibles();
  const q = esTabCuentas() ? sinAcentos(searchQuery.trim()) : '';
  const filtered = q ? lista.filter(c => rangoCoincidencia(c.nombre, q) >= 0) : lista;
  // Mientras se busca una cuenta se ocultan el resumen y el encabezado: los resultados suben arriba.
  const vista = document.getElementById('deudasView');
  const yaBuscaba = vista.classList.contains('buscando');
  vista.classList.toggle('buscando', !!q);
  if (q && !yaBuscaba) window.scrollTo({ top: 0 });
  // Buscando: primero lo que mejor coincide. Sin buscar: como en los chats, arriba la cuenta
  // con el movimiento más reciente (o la recién creada).
  const sorted = [...filtered].sort((a, b) =>
    (q ? rangoCoincidencia(a.nombre, q) - rangoCoincidencia(b.nombre, q) : tiempoActividad(b) - tiempoActividad(a))
    || a.nombre.localeCompare(b.nombre, 'es'));

  document.getElementById('accountsCount').textContent = `(${lista.length})`;

  const wrap = document.getElementById('accountListWrap');
  wrap.innerHTML = sorted.length === 0 ? `
    <div class="empty-state">${ICONS.inbox}<p>${lista.length === 0 ? TEXTOS_TIPO[tipoCuentas].vacio : 'No se encontraron cuentas con ese nombre.'}</p></div>
  ` : `
    <div class="letter-group lista-actividad">${sorted.map(c => accountCardHtml(c)).join('')}</div>
  `;
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
        <div class="acc-balance ${claseSaldo(c.balance, c.tipo)}">${saldoHtml(c.balance)}</div>
      </div>
      ${!selectMode ? `<div class="acc-actividad">${fmtActividad(c.ultima_actividad)}</div>` : ''}
    </div>`;
}
function bindAccountCardEvents(el) {
  el.querySelectorAll('.account-card').forEach(card => {
    const id = card.dataset.id;
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-check]')) return;
      if (selectMode) toggleSelect(id); else openAccountDetail(id);
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
function openCreateAccountModal() {
  showModal(`
    <h3>Nueva cuenta ${tipoCuentas === 'pagar' ? 'por pagar' : 'por cobrar'}</h3>
    <p class="desc">${TEXTOS_TIPO[tipoCuentas].nuevaDesc}</p>
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
      const cuenta = await api('/cuentas', { method: 'POST', body: { nombre, tipo: tipoCuentas } });
      CUENTAS.push({ ...cuenta, ultima_actividad: cuenta.fecha_creacion });
      closeModal(); renderDeudas(); toast('Cuenta creada');
      // Se entra directo a la cuenta nueva, lista para registrar su primer movimiento.
      openAccountDetail(cuenta.id);
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
    animarEntrada();
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
    <div class="page-slide" id="detailPage" data-tipo="${c.tipo || 'cobrar'}">
      <div class="page-header">
        <button class="back-btn" id="detailBack">${ICONS.back}</button>
        <h2>${escapeHtml(c.nombre)}</h2>
      </div>
      <div class="detail-body">
        <div class="balance-block">
          <button class="balance-pdf-btn" id="btnPdfCuenta" type="button" aria-label="Generar PDF del historial de ${escapeHtml(c.nombre)}">${ICONS.pdf}<span>PDF</span></button>
          <div class="balance-label">Balance de ${escapeHtml(c.nombre)}</div>
          ${saldoGrandeHtml(c.balance, c.tipo, 'cuenta-' + c.id)}
        </div>
        <div class="detail-actions">
          <button class="abono-btn" id="btnAbono">${ICONS.arrowDown} Abono</button>
          <button class="cargo-btn" id="btnCargo">${ICONS.arrowUp} Cargo</button>
        </div>
        ${movs.length ? `<div class="swipe-hint">Mantén presionado un movimiento para eliminarlo</div>` : ''}
        <div id="movList">
          ${movs.length === 0 ? `<div class="empty-state">${ICONS.inbox}<p>Sin movimientos todavía. Registra un abono o un cargo.</p></div>` :
            dateKeys.map(dk => `
              <div class="history-date-group">
                <div class="history-date-label">${fmtDateLabel(groups[dk][0].fecha)}</div>
                ${groups[dk].map(m => movRowHtml(m, c.tipo || 'cobrar')).join('')}
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
  animarSaldos(document.getElementById('pageRoot'));
}
// tipoCuenta solo se pasa en cuentas (cobrar/pagar): ahí los montos van sin signo, como los saldos.
function movRowHtml(m, tipoCuenta) {
  const isIn = m.tipo === 'abono' || m.tipo === 'entrada';
  return `
    <div class="mov-row" data-mov="${m.id}">
      <div class="mov-icon ${isIn ? 'in' : 'out'}">${isIn ? ICONS.arrowDown : ICONS.arrowUp}</div>
      <div class="mov-info">
        <div class="mov-desc">${escapeHtml(m.descripcion || (isIn ? 'Abono' : 'Cargo'))}</div>
        <div class="mov-time">${fmtTime(m.fecha)}${m.usuario ? ' · <span class="mov-author">' + escapeHtml(m.usuario) + '</span>' : ''}</div>
      </div>
      ${m.tiene_foto ? `<button class="mov-photo-btn" data-photo="${m.id}" title="Ver factura">${ICONS.camera}</button>` : ''}
      <div class="mov-amounts">
        <div class="mov-monto ${isIn ? 'pos' : 'neg'}">${tipoCuenta ? money(Math.abs(m.monto)) : (isIn ? '+' : '') + money(m.monto)}</div>
        <div class="mov-saldo">saldo: ${tipoCuenta ? saldoTexto(m.saldo_resultante, tipoCuenta).replace('(saldo ', '(') : money(m.saldo_resultante)}</div>
      </div>
    </div>`;
}
function bindPhotoButtons(container, movs) {
  container.querySelectorAll('[data-photo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const m = movs.find(x => String(x.id) === btn.dataset.photo);
      if (!m || !m.tiene_foto) return;
      obtenerFoto(m.id).then(openPhotoLightbox).catch(() => toast('No se pudo cargar la foto'));
    });
  });
}
// Las fotos se insertan creando el <img> con el DOM y solo si son JPEG en base64: nunca como texto
// dentro del HTML (una "foto" maliciosa podría ejecutar código en la sesión de quien la abre).
function esFotoSegura(dataUrl) {
  return typeof dataUrl === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(dataUrl);
}
function crearImgFoto(dataUrl, estilo) {
  const img = document.createElement('img');
  if (estilo) img.style.cssText = estilo;
  if (esFotoSegura(dataUrl)) img.src = dataUrl;
  else img.alt = 'Foto no disponible';
  return img;
}
// Las fotos ya no vienen en la lista de movimientos: se piden una por una y se guardan aquí.
const cacheFotos = new Map();
async function obtenerFoto(movId) {
  if (!cacheFotos.has(movId)) {
    const { foto } = await api(`/tienda/${movId}/foto`);
    cacheFotos.set(movId, foto);
  }
  return cacheFotos.get(movId);
}
function openPhotoLightbox(dataUrl) {
  showModal(`
    <h3>Factura</h3>
    <div id="lightboxFoto"></div>
    <div class="modal-actions">
      <button class="btn-confirm" data-close style="width:100%;">Cerrar</button>
    </div>
  `, { center: true });
  document.getElementById('lightboxFoto').appendChild(crearImgFoto(dataUrl, 'width:100%;border-radius:10px;margin:8px 0;display:block;'));
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
    <p class="desc">${(() => { const T = TEXTOS_TIPO[(currentAccountDetail && currentAccountDetail.tipo) || 'cobrar']; return isAbono ? T.abonoDesc : T.cargoDesc; })()}</p>
    <div class="field"><label>Descripción</label><input id="movDesc" type="text" placeholder="Ej. Pago quincenal"></div>
    <div class="field"><label>Monto (Q)</label><input id="movMonto" type="number" step="0.01" min="0" placeholder="0.00"></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmMov">Guardar</button>
    </div>
  `);
  setTimeout(() => document.getElementById('movDesc').focus(), 50);
  document.getElementById('confirmMov').onclick = async () => {
    const desc = document.getElementById('movDesc').value.trim();
    let monto = parseFloat(document.getElementById('movMonto').value);
    if (isNaN(monto) || monto <= 0) return;
    try {
      const { movimiento, balance } = await api(`/cuentas/${cuentaId}/movimientos`, { method: 'POST', body: { tipo, descripcion: desc, monto } });
      currentAccountDetail.movimientos.push(movimiento);
      currentAccountDetail.balance = balance;
      const listItem = CUENTAS.find(c => c.id === cuentaId || String(c.id) === String(cuentaId));
      if (listItem) { listItem.balance = balance; listItem.ultima_actividad = movimiento.fecha; }
      closeModal();
      renderAccountDetailPage();
      renderDeudas();
      resaltar(`#pageRoot [data-mov="${movimiento.id}"]`);
      toast(isAbono ? 'Abono registrado' : 'Cargo registrado');
    } catch (e) { toast('No se pudo guardar el movimiento'); }
  };
}
function confirmDeleteMovCuenta(cuentaId, movId) {
  openConfirmModal('¿Eliminar este movimiento?', 'Esta acción no se puede deshacer y recalculará los saldos posteriores.', async () => {
    try {
      await api(`/cuentas/${cuentaId}/movimientos/${movId}`, { method: 'DELETE' });
      currentAccountDetail = await api(`/cuentas/${cuentaId}`);
      CUENTAS = await api('/cuentas'); // saldo y última actividad recalculados
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
  const movs = TIENDA.movimientos;
  const balanceHoy = TIENDA.balanceHoy || 0;

  el.innerHTML = `
    <div class="balance-block">
      <div class="balance-label">Balance de hoy</div>
      <div class="balance-amount ${balanceHoy >= 0 ? 'pos' : 'neg'}" data-saldo="${balanceHoy}" data-clave="tienda">${money(balanceHoy)}</div>
    </div>
    <div class="action-row two">
      <button class="action-btn success" id="btnEntrada">${ICONS.arrowDown}Entrada</button>
      <button class="action-btn danger" id="btnSalida">${ICONS.arrowUp}Salida</button>
    </div>
    <button class="pdf-btn" id="btnFactura">${ICONS.receipt} Generar factura</button>
    <button class="pdf-btn" id="btnPdfTienda">${ICONS.pdf} Generar PDF de movimientos</button>
    ${movs.length ? `<div class="swipe-hint">Mantén presionado un movimiento para eliminarlo</div>` : ''}
    <div id="tiendaMovList"></div>
  `;
  document.getElementById('btnEntrada').onclick = () => openTiendaMovModal('entrada');
  document.getElementById('btnSalida').onclick = () => openTiendaMovModal('salida');
  document.getElementById('btnPdfTienda').onclick = openPdfTiendaFilterModal;
  document.getElementById('btnFactura').onclick = openInvoicePage;
  renderTiendaListOnly();
  animarSaldos(document.getElementById('tiendaView'));
}
function renderTiendaListOnly() {
  const listEl = document.getElementById('tiendaMovList');
  if (!listEl) return;
  const q = currentTab === 'tienda' ? sinAcentos(searchQuery.trim()) : '';
  const todos = TIENDA.movimientos.slice().reverse();
  const movs = !q ? todos : todos.filter(m =>
    sinAcentos(m.descripcion).includes(q) ||
    sinAcentos(m.usuario).includes(q) ||
    sinAcentos(m.tipo).includes(q) ||
    String(Math.abs(Number(m.monto)).toFixed(2)).includes(q.replace(/[q,\s]/g, '')));
  const groups = {};
  movs.forEach(m => { const key = fmtDateShort(m.fecha); (groups[key] = groups[key] || []).push(m); });
  listEl.innerHTML = movs.length === 0
    ? `<div class="empty-state">${ICONS.inbox}<p>${q ? `Ningún movimiento coincide con «${escapeHtml(searchQuery.trim())}».` : 'Sin movimientos registrados en la tienda todavía.'}</p></div>`
    : Object.keys(groups).map(dk => `
        <div class="history-date-group">
          <div class="history-date-label">${fmtDateLabel(groups[dk][0].fecha)}</div>
          ${groups[dk].map(m => movRowHtml(m)).join('')}
        </div>`).join('');
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
        <div class="photo-preview"><span id="fotoPreviewImg"></span><button type="button" class="remove-photo" id="btnQuitarFoto">${ICONS.trash}</button></div>`;
      document.getElementById('fotoPreviewImg').replaceWith(crearImgFoto(fotoDataUrl));
      document.getElementById('btnQuitarFoto').onclick = () => { fotoDataUrl = null; document.getElementById('fotoPreviewWrap').innerHTML = ''; };
    } catch (err) { toast('No se pudo procesar la foto'); }
  });
  document.getElementById('confirmTMov').onclick = async () => {
    const descripcion = document.getElementById('tMovDesc').value.trim();
    const monto = parseFloat(document.getElementById('tMovMonto').value);
    if (isNaN(monto) || monto <= 0) return;
    try {
      const { movimiento } = await api('/tienda', { method: 'POST', body: { tipo, descripcion, monto, foto: fotoDataUrl } });
      TIENDA = await api('/tienda');
      closeModal(); renderTienda();
      resaltar(`#tiendaView [data-mov="${movimiento.id}"]`);
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

/* ============================================================
   HISTORIAL GENERAL + COPIAS DE SEGURIDAD
   ============================================================ */
async function openHistorialPage(opts = {}) {
  let hist = [], backups = [], backupsTienda = [];
  const esAdmin = esAdminActual(); // las copias de seguridad solo las ve el administrador
  try {
    [hist, backups, backupsTienda] = await Promise.all([
      api('/historial'), esAdmin ? api('/backups') : [], esAdmin ? api('/backups/tienda') : [],
    ]);
  } catch (e) { toast('No se pudo cargar el historial'); }
  if (!opts.fromHistory) history.pushState({ view: 'historial' }, '', location.href);
  animarEntrada();
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
        ${esAdmin ? `<div class="section-title" style="margin-top:22px;">Copias de seguridad general</div>
        <p class="desc" style="margin:-6px 0 14px;">Se genera una cada domingo (cierra la semana lunes-domingo). Se conservan las últimas 4 semanas.</p>
        ${backups.length === 0 ? `<div class="empty-state">${ICONS.inbox}<p>Todavía no se ha generado ninguna copia.</p></div>` :
          backups.map(b => backupRowHtml(b, 'general')).join('')
        }
        <div class="section-title" style="margin-top:22px;">Copias de seguridad de tienda</div>
        <p class="desc" style="margin:-6px 0 14px;">Se genera una a fin de cada mes, con las fotos de facturas y un resumen. Se conservan los últimos 2 meses y también las que aún no hayas descargado (hasta 12).</p>
        ${backupsTienda.length === 0 ? `<div class="empty-state">${ICONS.inbox}<p>Todavía no se ha generado ninguna copia de tienda.</p></div>` :
          backupsTienda.map(b => backupRowHtml(b, 'tienda')).join('')
        }` : ''}
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
  let me = null, usuarios = null;
  try {
    const meResp = await api('/usuarios/me');
    me = meResp.usuario;
    if (meResp.empresa) EMPRESA = meResp.empresa;
  } catch (e) { toast('No se pudo cargar tu información'); }
  if (me && me.rol === 'admin') {
    try { usuarios = await api('/usuarios'); } catch (e) { usuarios = []; }
  }
  animarEntrada();
  renderUsersPage(me, usuarios);
  if (!opts.fromHistory) history.pushState({ view: 'users' }, '', location.href);
}
function renderUsersPage(meParam, usuariosParam) {
  const root = document.getElementById('pageRoot');
  const render = (me, usuarios) => {
    const esAdmin = me.rol === 'admin';
    const otros = (usuarios || []).filter(u => u.id !== me.id);
    const etiquetaRol = u => u.es_principal ? 'admin principal' : (u.rol === 'admin' ? 'admin' : '');
    root.innerHTML = `
      <div class="page-slide" id="usersPage">
        <div class="page-header">
          <button class="back-btn" id="usersBack">${ICONS.back}</button>
          <h2>Cuenta y usuarios</h2>
        </div>
        <div class="detail-body">
          ${EMPRESA ? `<p class="desc" style="margin:0 0 16px;">${escapeHtml(EMPRESA.nombre)} · código de empresa: <b style="color:var(--text);font-family:var(--mono);">${escapeHtml(EMPRESA.codigo)}</b></p>` : ''}
          <div class="section-title">Tu cuenta</div>
          <div class="user-card" style="flex-direction:column;align-items:stretch;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="acc-circ">${initialOf(me.nombre)}</div>
              <div class="info">
                <div class="name">${escapeHtml(me.nombre)} ${esAdmin ? `· <span style="color:var(--accent);">${etiquetaRol(me)}</span>` : ''}</div>
                <div class="handle">${escapeHtml(EMPRESA ? idAcceso(me.usuario, EMPRESA.codigo) : me.usuario)}${me.email ? ' · ' + escapeHtml(me.email) : ''}</div>
              </div>
            </div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:10px;">
              ${esAdmin ? `
                <button class="link-btn" id="btnChangeOwnPass">Cambiar contraseña</button>
                <button class="link-btn" id="btnChangeOwnEmail">${me.email ? 'Cambiar correo' : 'Agregar correo'}</button>
              ` : ''}
              <button class="link-btn" id="btnLogout">Cerrar sesión</button>
            </div>
          </div>

          <div class="section-title" style="margin-top:22px;">Notificaciones e historial</div>
          <div class="ajuste-row">
            <div class="ajuste-ico">${ICONS.bell}</div>
            <div class="info"><div class="name">Notificaciones</div><div class="handle" id="notifEstado"></div></div>
            <button class="switch" id="swNotif" type="button" role="switch" aria-checked="false" aria-label="Notificaciones"><span></span></button>
          </div>
          <button class="ajuste-row ajuste-link" id="btnHistorialPerfil" type="button">
            <div class="ajuste-ico">${ICONS.history}</div>
            <div class="info"><div class="name">Historial general</div><div class="handle">Actividad de los últimos 7 días${esAdmin ? ' y copias de seguridad' : ''}</div></div>
            <span class="ajuste-chev">›</span>
          </button>

          ${esAdmin ? `
            <div class="section-title" style="margin-top:22px;">Usuarios de tu empresa</div>
            ${otros.length === 0 ? `<div class="empty-state">${ICONS.inbox}<p>Todavía no has creado ningún usuario.</p></div>` :
              otros.map(u => `
                <div class="user-card" style="flex-direction:column;align-items:stretch;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div class="acc-circ">${initialOf(u.nombre)}</div>
                    <div class="info">
                      <div class="name">${escapeHtml(u.nombre)}${etiquetaRol(u) ? ` <span class="rol-chip ${u.es_principal ? 'principal' : ''}">${etiquetaRol(u)}</span>` : ''}</div>
                      <div class="handle">${escapeHtml(EMPRESA ? idAcceso(u.usuario, EMPRESA.codigo) : u.usuario)}${u.email ? ' · ' + escapeHtml(u.email) : ''}</div>
                    </div>
                  </div>
                  ${u.es_principal ? `
                  <p class="handle" style="margin:10px 0 0;">Es quien creó la empresa: no se puede eliminar, y solo él puede cambiar su contraseña y su correo.</p>` : `
                  <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:10px;">
                    <button class="link-btn" data-changepass="${u.id}" data-name="${escapeHtml(u.nombre)}">Cambiar contraseña</button>
                    <button class="link-btn" data-changeemail="${u.id}" data-email="${u.email ? escapeHtml(u.email) : ''}">${u.email ? 'Cambiar correo' : 'Agregar correo'}</button>
                    <button class="link-btn" data-deleteuser="${u.id}" data-name="${escapeHtml(u.nombre)}" style="color:var(--red);">Eliminar</button>
                  </div>`}
                </div>
              `).join('')
            }
            <button class="pdf-btn" id="btnAddUser" style="margin-top:14px;">${ICONS.userPlus} Crear nuevo usuario</button>
          ` : `
            <p class="desc" style="margin-top:6px;">Solo los administradores de tu empresa pueden crear usuarios, cambiar contraseñas o correos, y eliminar cuentas.</p>
          `}

          <div class="section-title" style="margin-top:22px;">Apariencia</div>
          <p class="seg-label">Tema</p>
          <div class="seg" id="segTema">
            <button data-v="claro">Claro</button><button data-v="oscuro">Oscuro</button><button data-v="sistema">Del sistema</button>
          </div>
          <p class="seg-nota">"Del sistema" cambia solo cuando tu teléfono pasa a modo oscuro.</p>
          <p class="seg-label">Animaciones</p>
          <div class="seg" id="segAnim">
            <button data-v="auto">Automático</button><button data-v="si">Activadas</button><button data-v="no">Desactivadas</button>
          </div>
          <p class="seg-nota" id="notaAnim"></p>

          <div class="section-title" style="margin-top:22px;">Huella / Face ID</div>
          <p class="desc" style="margin:-6px 0 14px;">Inicia sesión rápido sin escribir tu contraseña, solo en los dispositivos donde la registres aquí.</p>
          <div id="fpDevicesList"></div>
          <button class="pdf-btn" id="btnAddFingerprint">${ICONS.fingerprint} Registrar este dispositivo</button>
        </div>
      </div>`;
    document.getElementById('usersBack').onclick = () => { history.back(); };
    document.getElementById('btnLogout').onclick = () => openLogoutConfirm();
    if (esAdmin) {
      document.getElementById('btnChangeOwnPass').onclick = () => openChangePasswordModal(me.id, me.nombre, true);
      document.getElementById('btnChangeOwnEmail').onclick = () => openChangeEmailModal(me.id, me.email);
      document.getElementById('btnAddUser').onclick = openCreateUserModal;
      root.querySelectorAll('[data-changepass]').forEach(b => {
        b.addEventListener('click', () => openChangePasswordModal(b.dataset.changepass, b.dataset.name, false));
      });
      root.querySelectorAll('[data-changeemail]').forEach(b => {
        b.addEventListener('click', () => openChangeEmailModal(b.dataset.changeemail, b.dataset.email));
      });
      root.querySelectorAll('[data-deleteuser]').forEach(b => {
        b.addEventListener('click', () => openDeleteUserModal(b.dataset.deleteuser, b.dataset.name));
      });
    }
    document.getElementById('btnAddFingerprint').onclick = openRegisterFingerprintModal;
    loadFingerprintDevices();
    bindApariencia();
    document.getElementById('btnHistorialPerfil').onclick = () => openHistorialPage();
    const sw = document.getElementById('swNotif');
    sw.onclick = async () => {
      sw.disabled = true;
      try { if (notificacionesActivas) await disablePush(); else await enablePush(); }
      finally { renderNotifBtn(); }
    };
    renderNotifBtn();
  };
  if (meParam) render(meParam, usuariosParam);
  else {
    // Al refrescar (crear, editar o eliminar usuarios) se recarga también la lista del equipo.
    (async () => {
      const r = await api('/usuarios/me');
      const lista = r.usuario && r.usuario.rol === 'admin' ? await api('/usuarios').catch(() => []) : null;
      if (document.getElementById('usersPage')) render(r.usuario, lista);
    })().catch(() => toast('No se pudo cargar tu información'));
  }
}
// Selector de tema y animaciones (se guarda en este dispositivo; ver public/tema.js).
function bindApariencia() {
  const T = window.CuentasTema;
  if (!T) return;
  const pintar = () => {
    document.querySelectorAll('#segTema button').forEach(b => b.classList.toggle('on', b.dataset.v === T.tema()));
    document.querySelectorAll('#segAnim button').forEach(b => b.classList.toggle('on', b.dataset.v === T.animaciones()));
    const nota = document.getElementById('notaAnim');
    if (nota) {
      nota.textContent = T.animaciones() === 'auto'
        ? (T.animacionesActivas()
          ? 'Automático: activadas en este dispositivo. Se apagan solas en equipos con pocos recursos.'
          : 'Automático: desactivadas en este dispositivo para que vaya más fluido.')
        : 'Desactívalas si la app se siente lenta en este teléfono.';
    }
  };
  document.querySelectorAll('#segTema button').forEach(b => b.addEventListener('click', () => { T.setTema(b.dataset.v); pintar(); }));
  document.querySelectorAll('#segAnim button').forEach(b => b.addEventListener('click', () => { T.setAnimaciones(b.dataset.v); pintar(); }));
  pintar();
}
function openLogoutConfirm() {
  showModal(`
    <h3>¿Cerrar sesión?</h3>
    <p class="desc">Vas a tener que volver a entrar con tu huella o tu usuario y contraseña.</p>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmLogout">Cerrar sesión</button>
    </div>
  `, { center: true });
  document.getElementById('confirmLogout').onclick = async () => {
    closeModal();
    await logoutManual();
  };
}
function loadFingerprintDevices() {
  const wrap = document.getElementById('fpDevicesList');
  if (!wrap) return;
  api('/webauthn/credentials').then(creds => {
    if (creds.length === 0) { setFingerprintFlag(false); try { localStorage.removeItem('cuentasapp_fp_credid'); } catch (e) {} }
    wrap.innerHTML = creds.length === 0 ? `
      <div class="empty-state">${ICONS.inbox}<p>No has registrado ningún dispositivo todavía.</p></div>
    ` : creds.map(c => `
      <div class="user-card">
        <div class="acc-circ">${ICONS.fingerprint}</div>
        <div class="info">
          <div class="name">${escapeHtml(c.device_name || 'Dispositivo')}</div>
          <div class="handle">Agregado ${fmtDateShort(c.fecha_creacion)}</div>
        </div>
        <button class="link-btn" data-delfp="${c.id}" style="color:var(--red);">Eliminar</button>
      </div>
    `).join('');
    wrap.querySelectorAll('[data-delfp]').forEach(b => {
      b.addEventListener('click', async () => {
        try {
          await api(`/webauthn/credentials/${b.dataset.delfp}`, { method: 'DELETE' });
          toast('Dispositivo eliminado');
          loadFingerprintDevices();
        } catch (e) { toast('No se pudo eliminar el dispositivo'); }
      });
    });
  }).catch(() => { wrap.innerHTML = ''; });
}
function openChangeEmailModal(userId, currentEmail) {
  showModal(`
    <h3>${currentEmail ? 'Cambiar correo' : 'Agregar correo'}</h3>
    <p class="desc">Se usa para recuperar la contraseña si se olvida.</p>
    <div class="field"><label>Correo electrónico</label><input id="emailNuevo" type="email" value="${currentEmail ? escapeHtml(currentEmail) : ''}"></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmEmail">Guardar</button>
    </div>
    <p class="login-error" id="emailErr"></p>
  `);
  document.getElementById('confirmEmail').onclick = async () => {
    const email = document.getElementById('emailNuevo').value.trim();
    const err = document.getElementById('emailErr');
    if (!email) { err.textContent = 'Ingresa un correo.'; return; }
    try {
      await api(`/usuarios/${userId}/email`, { method: 'PATCH', body: { email } });
      closeModal();
      toast('Correo actualizado');
      renderUsersPage();
    } catch (e) { err.textContent = typeof e === 'string' ? e : 'No se pudo actualizar el correo.'; }
  };
}
function openDeleteUserModal(userId, nombre) {
  showModal(`
    <h3>¿Eliminar a ${escapeHtml(nombre)}?</h3>
    <p class="desc">Ya no podrá iniciar sesión. Esta acción no se puede deshacer.</p>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm danger" id="confirmDeleteUser">Eliminar</button>
    </div>
    <p class="login-error" id="delUserErr"></p>
  `, { center: true });
  document.getElementById('confirmDeleteUser').onclick = async () => {
    const err = document.getElementById('delUserErr');
    try {
      await api(`/usuarios/${userId}`, { method: 'DELETE' });
      closeModal();
      toast('Usuario eliminado');
      renderUsersPage();
    } catch (e) { err.textContent = typeof e === 'string' ? e : 'No se pudo eliminar la cuenta.'; }
  };
}
function openChangePasswordModal(userId, nombre, isOwn) {
  showModal(`
    <h3>Cambiar contraseña${isOwn ? '' : ' de ' + escapeHtml(nombre)}</h3>
    <p class="desc">${isOwn ? 'Confirma tu contraseña actual y elige una nueva. Se cerrará tu sesión en tus otros dispositivos.' : 'Define una contraseña temporal y entrégasela a la persona. Se cerrarán sus sesiones, se quitará su huella y, al entrar, deberá elegir una contraseña propia.'}</p>
    ${isOwn ? `<div class="field"><label>Contraseña actual</label><input id="passActual" type="password"></div>` : ''}
    <div class="field"><label>Nueva contraseña</label><input id="passNueva" type="password" placeholder="Mínimo 8 caracteres"></div>
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
    if (!nueva || nueva.length < 8) { err.textContent = 'La nueva contraseña debe tener al menos 8 caracteres.'; return; }
    try {
      await api(`/usuarios/${userId}/password`, { method: 'PATCH', body: { actual, nueva } });
      closeModal(); toast('Contraseña actualizada');
    } catch (e) { err.textContent = typeof e === 'string' ? e : 'No se pudo cambiar la contraseña.'; }
  };
}
function openCreateUserModal() {
  showModal(`
    <h3>Crear nuevo usuario</h3>
    <p class="seg-label" style="margin-top:4px;">Rol</p>
    <div class="seg" id="segRol"><button data-v="usuario" class="on">Usuario</button><button data-v="admin">Administrador</button></div>
    <p class="seg-nota" id="notaRol"></p>
    <div class="field"><label>Nombre</label><input id="newUserNombre" type="text" maxlength="100">
      <p class="field-hint" id="newUserVista">El usuario para entrar se forma con el nombre, en minúsculas y sin espacios.</p></div>
    <div class="field"><label>Correo electrónico</label><input id="newUserEmail" type="email"></div>
    <div class="field"><label>Contraseña</label><input id="newUserPass" type="password" placeholder="Mínimo 8 caracteres"></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmNewUser">Crear</button>
    </div>
    <p class="login-error" id="newUserErr"></p>
  `);
  // Rol: usuario normal (por defecto) o administrador.
  let rol = 'usuario';
  const NOTA_ROL = {
    usuario: 'Podrá ver y registrar cuentas y movimientos, pero no podrá crear ni eliminar usuarios.',
    admin: 'Podrá hacer todo lo que tú haces: crear, editar y eliminar usuarios (excepto al administrador principal) y ver las copias de seguridad.',
  };
  const pintarRol = () => {
    document.querySelectorAll('#segRol button').forEach(b => b.classList.toggle('on', b.dataset.v === rol));
    document.getElementById('notaRol').textContent = NOTA_ROL[rol];
  };
  document.querySelectorAll('#segRol button').forEach(b => b.onclick = () => { rol = b.dataset.v; pintarRol(); });
  pintarRol();
  // El usuario sale del nombre; se muestra mientras se escribe.
  const nombreInput = document.getElementById('newUserNombre');
  const vista = document.getElementById('newUserVista');
  nombreInput.addEventListener('input', () => {
    const u = usuarioDesdeNombre(nombreInput.value);
    vista.innerHTML = u && EMPRESA ? `Entrará con: <b>${escapeHtml(idAcceso(u, EMPRESA.codigo))}</b>` : 'El usuario para entrar se forma con el nombre, en minúsculas y sin espacios.';
  });
  setTimeout(() => nombreInput.focus(), 50);
  document.getElementById('confirmNewUser').onclick = async () => {
    const nombre = nombreInput.value.trim();
    const usuario = usuarioDesdeNombre(nombre);
    const email = document.getElementById('newUserEmail').value.trim();
    const contrasena = document.getElementById('newUserPass').value;
    const err = document.getElementById('newUserErr');
    if (!nombre || !email || !contrasena) { err.textContent = 'Completa todos los campos.'; return; }
    if (!usuario) { err.textContent = 'El nombre debe tener letras o números.'; return; }
    if (contrasena.length < 8) { err.textContent = 'La contraseña debe tener al menos 8 caracteres.'; return; }
    try {
      await api('/usuarios', { method: 'POST', body: { nombre, usuario, email, contrasena, rol } });
      renderUsersPage();
      // Ventana (no un aviso pasajero) para que dé tiempo de anotar con qué va a entrar.
      showModal(`
        <h3>${rol === 'admin' ? 'Administrador creado' : 'Usuario creado'}</h3>
        <p class="desc">${escapeHtml(nombre)} entrará con:</p>
        <div class="field"><input type="text" readonly value="${escapeHtml(EMPRESA ? idAcceso(usuario, EMPRESA.codigo) : usuario)}" style="text-align:center;font-weight:700;font-size:18px;"></div>
        <p class="desc">y la contraseña que acabas de escribir.</p>
        <div class="modal-actions"><button class="btn-confirm" data-close>Listo</button></div>
      `);
    } catch (e) {
      const msg = typeof e === 'string' ? e : '';
      err.textContent = /ya existe/i.test(msg)
        ? `Ya hay alguien con el usuario "${usuario}" o con ese correo. Agrega el apellido u otra palabra al nombre para distinguirlo.`
        : (msg || 'No se pudo crear el usuario.');
    }
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
function closeModal() {
  const root = document.getElementById('modalRoot');
  const overlay = root.querySelector('.modal-overlay');
  if (!overlay || !animOn()) { root.innerHTML = ''; return; }
  overlay.classList.add('cerrando');
  setTimeout(() => { if (root.contains(overlay)) root.innerHTML = ''; }, 170);
}
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
// Ventana con las 3 opciones de PDF de las cuentas.
function abrirOpcionesPdf() {
  const { teDeben, debes, neto } = totalesCuentas();
  showModal(`
    <h3>Generar PDF</h3>
    <p class="desc">Elige qué quieres incluir.</p>
    <div class="pdf-opciones">
      <button class="pdf-opcion" data-pdf="cobrar"><span class="pdf-op-icono cobrar">${ICONS.arrowDown}</span>
        <span class="pdf-op-texto"><b>Lo que te deben</b><small>Cuentas por cobrar · <span class="nw">${money(teDeben)}</span></small></span></button>
      <button class="pdf-opcion" data-pdf="pagar"><span class="pdf-op-icono pagar">${ICONS.arrowUp}</span>
        <span class="pdf-op-texto"><b>Lo que debes</b><small>Cuentas por pagar · <span class="nw">${money(debes)}</span></small></span></button>
      <button class="pdf-opcion" data-pdf="todo"><span class="pdf-op-icono todo">${ICONS.pdf}</span>
        <span class="pdf-op-texto"><b>Reporte completo</b><small>Las dos secciones y el neto <span class="nw">(${textoNeto(neto)})</span></small></span></button>
    </div>
    <div class="modal-actions"><button class="btn-cancel" data-close>Cancelar</button></div>
  `);
  document.querySelectorAll('.pdf-opcion').forEach(b => b.onclick = () => {
    closeModal();
    if (b.dataset.pdf === 'todo') generarPdfCompleto(); else generarPdfTipo(b.dataset.pdf);
  });
}
function pdfTablaCuentas(doc, cuentas, tipo, startY) {
  const rows = cuentas.map(c => [c.nombre, saldoTexto(c.balance, tipo)]);
  if (!rows.length) {
    doc.setFontSize(10); doc.setTextColor(140, 140, 140); doc.text('Sin cuentas registradas.', 14, startY + 4);
    doc.setTextColor(30, 30, 30); return startY + 10;
  }
  doc.autoTable({ startY, head: [[TEXTOS_TIPO[tipo].pdfQuien, 'Saldo']], body: rows, styles: { fontSize: 9 }, headStyles: { fillColor: [40, 40, 40] } });
  return doc.lastAutoTable.finalY;
}
function pdfPaginasCuentas(doc, cuentas, tipo, prefijo) {
  cuentas.forEach(c => {
    doc.addPage();
    pdfHeader(doc, prefijo + c.nombre);
    doc.setFontSize(11); doc.setTextColor(30, 30, 30);
    doc.text('Saldo actual: ' + saldoTexto(c.balance, tipo), 14, 38);
    const movRows = c.movimientos.map(m => [fmtDateShort(m.fecha), fmtTime(m.fecha), m.tipo, m.descripcion || '', money(Math.abs(m.monto)), saldoTexto(m.saldo_resultante, tipo), m.usuario || '']);
    if (movRows.length) {
      doc.autoTable({ startY: 45, head: [['Fecha', 'Hora', 'Tipo', 'Descripción', 'Monto', 'Saldo', 'Registrado por']], body: movRows, styles: { fontSize: 8 }, headStyles: { fillColor: [40, 40, 40] } });
    } else {
      doc.setFontSize(10); doc.setTextColor(140, 140, 140); doc.text('Sin movimientos registrados.', 14, 45);
    }
  });
}
// PDF de una sola sección (por cobrar o por pagar).
async function generarPdfTipo(tipo) {
  let data;
  const T = TEXTOS_TIPO[tipo];
  try { data = await api(`/reportes/general?tipo=${tipo}`); } catch (e) { toast('No se pudo generar el PDF'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  pdfHeader(doc, 'Kaab — ' + T.pdfTitulo);
  doc.setFontSize(11); doc.setTextColor(30, 30, 30);
  doc.text(T.total + ': ' + saldoTexto(data.balance, tipo), 14, 38);
  doc.text('Total de cuentas: ' + data.cuentas.length, 14, 45);
  pdfTablaCuentas(doc, data.cuentas, tipo, 52);
  pdfPaginasCuentas(doc, data.cuentas, tipo, 'Cuenta: ');
  doc.save(T.pdfArchivo);
  toast('PDF generado');
}
// PDF completo: resumen con lo que te deben, lo que debes y el neto; luego ambas listas y el detalle de cada cuenta.
async function generarPdfCompleto() {
  let data;
  try { data = await api('/reportes/general'); } catch (e) { toast('No se pudo generar el PDF'); return; }
  const cobrar = data.cuentas.filter(c => (c.tipo || 'cobrar') === 'cobrar');
  const pagar = data.cuentas.filter(c => c.tipo === 'pagar');
  const suma = l => l.reduce((s, c) => s + deudaDe(c.balance), 0);
  const teDeben = suma(cobrar), debes = suma(pagar), neto = Math.round((teDeben - debes) * 100) / 100;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  pdfHeader(doc, 'Kaab — Reporte completo');
  doc.setFontSize(11); doc.setTextColor(30, 30, 30);
  doc.text('Te deben (por cobrar): ' + money(teDeben), 14, 38);
  doc.text('Debes (por pagar): ' + money(debes), 14, 45);
  doc.setFont('helvetica', 'bold');
  doc.text('Neto: ' + textoNeto(neto) + (neto > 0 ? '  (a tu favor)' : neto < 0 ? '  (debes más de lo que te deben)' : ''), 14, 52);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
  doc.text('Cuentas por cobrar (' + cobrar.length + ')', 14, 65);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
  let y = pdfTablaCuentas(doc, cobrar, 'cobrar', 69);
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(30, 30, 30);
  doc.text('Cuentas por pagar (' + pagar.length + ')', 14, y + 12);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
  pdfTablaCuentas(doc, pagar, 'pagar', y + 16);
  pdfPaginasCuentas(doc, cobrar, 'cobrar', 'Por cobrar: ');
  pdfPaginasCuentas(doc, pagar, 'pagar', 'Por pagar: ');
  doc.save('reporte-completo.pdf');
  toast('PDF generado');
}
function generarPdfCuenta(c) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  pdfHeader(doc, 'Historial de cuenta: ' + c.nombre);
  doc.setFontSize(11); doc.setTextColor(30, 30, 30);
  const tipo = c.tipo || 'cobrar';
  doc.text('Saldo actual: ' + saldoTexto(c.balance, tipo), 14, 38);
  const movRows = c.movimientos.map(m => [fmtDateShort(m.fecha), fmtTime(m.fecha), m.tipo, m.descripcion || '', money(Math.abs(m.monto)), saldoTexto(m.saldo_resultante, tipo), m.usuario || '']);
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

  const conFoto = movs.filter(m => m.tiene_foto);
  if (conFoto.length) toast(`Descargando ${conFoto.length} foto(s) para el PDF…`);
  for (const m of conFoto) {
    let foto;
    try { foto = await obtenerFoto(m.id); } catch (e) { continue; }
    if (!esFotoSegura(foto)) continue;
    m.foto = foto;
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
