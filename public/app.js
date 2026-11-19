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
// Solo puede haber UNA petición de huella a la vez: si al abrir la app ya se pidió sola y la persona
// toca el botón, una segunda petición cancelaba la primera (y a veces las dos). Ahora el toque no
// lanza otra: solo recuerda que ya está esperando la huella.
// Además: tocar la pantalla mientras el teléfono abre SU ventana de huella puede cerrarla (el sistema lo
// toma como "tocó afuera"). Si la persona tocó el botón con una petición en curso y justo después se
// cancela, se vuelve a pedir la huella sola, UNA vez. Si la cancela a propósito (sin tocar), no se insiste.
let huellaEnCurso = false, huellaDesde = 0, huellaIntento = 0, huellaToque = 0;
function pintarEsperaHuella(esperando) {
  const btn = document.getElementById('fpCircle'), hint = document.querySelector('.fp-hint');
  if (btn) btn.classList.toggle('scanning', esperando);
  if (hint) hint.textContent = esperando ? 'Pon tu dedo en el lector…' : 'Toca para usar la huella';
}
async function loginWithFingerprint({ auto = false, reintento = false } = {}) {
  if (!fingerprintSupported()) { toast('Este navegador no soporta huella/Face ID'); return; }
  const aviso = document.getElementById('fpMsg');
  // (si una petición quedó colgada más de un minuto, se permite empezar otra)
  if (huellaEnCurso && Date.now() - huellaDesde < 60000) {
    huellaToque = Date.now(); // tocó el botón con la huella ya en camino
    if (aviso) { aviso.textContent = 'Ya te estoy pidiendo la huella: pon tu dedo en el lector.'; aviso.classList.add('info'); }
    return;
  }
  huellaEnCurso = true; huellaDesde = Date.now(); huellaToque = 0;
  let volverAPedir = false;
  if (aviso) aviso.classList.remove('info');
  const miIntento = ++huellaIntento;
  if (aviso) aviso.textContent = '';
  pintarEsperaHuella(true);
  try {
    const { options, requestId } = await api('/webauthn/login-options');
    const publicKey = prepareRequestOptions(options);
    // Si ya conocemos la credencial de este dispositivo, se la indicamos al navegador
    // para que pida la huella directo, sin mostrar un selector de llaves guardadas.
    let storedCredId = null;
    try { storedCredId = localStorage.getItem('cuentasapp_fp_credid'); } catch (e) {}
    if (storedCredId) publicKey.allowCredentials = [{ id: base64urlToBuffer(storedCredId), type: 'public-key' }];
    if (!publicKey.timeout) publicKey.timeout = 60000;
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
    const cancelado = e && e.name === 'NotAllowedError';
    // Se canceló justo después de que la persona tocara el botón: casi seguro fue ese toque el que cerró
    // la ventana de huella del teléfono. Se vuelve a pedir (una sola vez).
    if (cancelado && !reintento && huellaToque && Date.now() - huellaToque < 5000) { volverAPedir = true; return; }
    if (auto) return; // intento automático: sin mensajes, la persona puede tocar el botón
    const msg = document.getElementById('fpMsg');
    if (msg) msg.classList.remove('info');
    if (msg) msg.textContent = cancelado ? 'Se canceló. Toca la huella para intentarlo de nuevo.' : 'No se pudo leer la huella. Inténtalo de nuevo o entra con tu contraseña.';
    else toast(cancelado ? 'Se canceló el inicio con huella' : 'No se pudo iniciar sesión con huella');
  } finally {
    if (miIntento === huellaIntento) { huellaEnCurso = false; pintarEsperaHuella(false); } // una petición vieja que termina tarde no apaga la nueva
    if (volverAPedir) { huellaToque = 0; setTimeout(() => loginWithFingerprint({ reintento: true }), 150); }
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

// Aviso "Sin conexión". Antes solo se quitaba con el evento "online" del teléfono, que no llega
// cuando lo que falló fue el servidor (y no el wifi/datos): la pantalla se quedaba para siempre.
// Ahora, mientras se ve, la app prueba sola el servidor (/health) cada pocos segundos y, cuando
// responde, quita el aviso y recarga los datos (o revisa la sesión si aún no había entrado).
let recuperarT = null, recuperarIntento = 0, recuperando = false;
function avisoSinConexionVisible() { return !document.getElementById('offlineBanner').classList.contains('hidden'); }
function showOfflineBanner(msg) {
  const b = document.getElementById('offlineBanner');
  if (msg) document.getElementById('offlineMsg').textContent = msg;
  const yaVisible = avisoSinConexionVisible();
  b.classList.remove('hidden');
  if (!yaVisible) { recuperarIntento = 0; programarRecuperacion(); }
}
function ocultarAvisoSinConexion() {
  document.getElementById('offlineBanner').classList.add('hidden');
  clearTimeout(recuperarT); recuperarIntento = 0;
}
function programarRecuperacion(ahora) {
  clearTimeout(recuperarT);
  const espera = ahora ? 0 : Math.min(15000, Math.round(2000 * Math.pow(1.6, recuperarIntento)));
  const t = document.getElementById('offlineAuto');
  if (t) t.textContent = navigator.onLine === false ? 'Esperando a que vuelva el internet…' : 'Reintentando automáticamente…';
  recuperarT = setTimeout(intentarRecuperar, espera);
}
async function intentarRecuperar() {
  if (!avisoSinConexionVisible() || recuperando) return;
  recuperando = true;
  let ok = false;
  try { const r = await fetch('/health', { cache: 'no-store' }); ok = r.ok; } catch (e) { ok = false; }
  recuperando = false;
  if (!ok) { recuperarIntento++; programarRecuperacion(); return; }
  ocultarAvisoSinConexion();
  if (AUTH) {
    if (await cargarDatosIniciales() && currentAccountDetail) refrescarTodo();
    if (!ws || ws.readyState === WebSocket.CLOSED) connectWS();
  } else if (document.getElementById('mainScreen').classList.contains('hidden')) {
    initAuth(); // aún no había entrado: revisa si la sesión sigue abierta
  }
}
document.getElementById('reloadBtn').addEventListener('click', () => { recuperarIntento = 0; programarRecuperacion(true); });
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
      if (opts.estado) opts.estado.codigo = 0; // no hubo respuesta: no se sabe si llegó
      // Las consultas de fondo (silencioso) no tapan la pantalla con "Sin conexión".
      if (!opts.silencioso) showOfflineBanner('No se pudo conectar con el servidor. Revisa tu internet y vuelve a intentar.');
      throw 'Sin conexión con el servidor';
    }
    if (opts.estado) opts.estado.codigo = res.status;
    let data = null;
    try { data = await res.json(); } catch (e) { /* sin cuerpo JSON */ }
    if (res.status === 401 && data && data.codigo === 'SESION' && AUTH) {
      sesionTerminada(/suspendida/i.test(data.error || '') ? data.error : 'Tu sesión se cerró. Vuelve a entrar.');
      throw 'Sesión cerrada';
    }
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
  ws.onopen = () => { wsConnected = true; updateSyncDot(); if (avisoSinConexionVisible()) intentarRecuperar(); else refrescarTodo(); };
  ws.onclose = () => { wsConnected = false; updateSyncDot(); if (AUTH) setTimeout(() => { if (AUTH && (!ws || ws.readyState === WebSocket.CLOSED)) connectWS(); }, 2000 + Math.random() * 2000); };
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
      refrescarTiendaPronto();
    } else if (scope === 'usuarios') {
      if (document.getElementById('usersPage')) renderUsersPage();
      // Por si el admin principal me cambió el nombre: se actualiza arriba sin cerrar sesión.
      const { usuario: yo } = await api('/usuarios/me');
      if (yo && AUTH && (yo.nombre !== AUTH.nombre || yo.usuario !== AUTH.usuario)) {
        AUTH.nombre = yo.nombre; AUTH.usuario = yo.usuario;
        document.getElementById('avatarInitial').textContent = initialOf(yo.nombre);
        document.getElementById('userLabel').textContent = yo.nombre;
      }
    }
    if (by) toast('Actualizado por ' + by);
  } catch (e) { /* si falla el refresco silencioso, se intentará en el próximo evento */ }
}
async function refrescarTodo() {
  revisarEnviosEnDuda();
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
// Si el teléfono restaura la página "congelada" (bfcache) puede no avisar con visibilitychange.
window.addEventListener('pageshow', e => { if (e.persisted) document.dispatchEvent(new Event('visibilitychange')); });
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible' && avisoSinConexionVisible()) { recuperarIntento = 0; programarRecuperacion(true); }
  if (document.visibilityState !== 'visible' || !AUTH) return;
  if (Date.now() - lastActivity > IDLE_LIMIT_MS) { lockSession(); return; } // estuvo +15 min sin uso
  if (ws && ws.readyState === WebSocket.CLOSED) connectWS();
  // La app puede "despertar" sin recargar de verdad (el celular la congeló en segundo plano
  // en vez de cerrarla). Antes de refrescar datos, confirmamos que la sesión siga siendo válida
  // en el servidor — si ya no lo es (se cerró sola, venció, etc.), regresamos a la pantalla de login
  // en vez de quedarnos mostrando la app vacía.
  try {
    const status = await api('/auth/status');
    if (!status.user) { await doLogoutCleanup(); return; }
    AUTH = status.user;
    refrescarTodo();
    revisarAvisosRespaldos(); // al volver de la descarga, o si la app quedó abierta y pasó el día 1
  } catch (e) { /* sin conexión: ya se muestra el aviso correspondiente */ }
});
window.addEventListener('online', () => {
  // Volvió el internet: se comprueba el servidor antes de quitar el aviso.
  if (avisoSinConexionVisible()) { recuperarIntento = 0; programarRecuperacion(true); }
  else if (AUTH) refrescarTodo();
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
  root.querySelectorAll('.balance-amount[data-saldo], .total-monto[data-saldo]').forEach(el => {
    const clave = el.dataset.clave, nuevo = Number(el.dataset.saldo);
    const conocido = saldosMostrados.has(clave);
    const previo = conocido ? saldosMostrados.get(clave) : 0;
    saldosMostrados.set(clave, nuevo);
    if (!animOn() || previo === nuevo || !isFinite(nuevo)) return;
    // Si el monto cambió (no es la primera vez que se muestra), destella un instante con su color.
    if (conocido) { el.classList.remove('destella'); void el.offsetWidth; el.classList.add('destella'); }
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
// Vibración muy corta al guardar o eliminar (solo Android; el iPhone la ignora). Sigue el ajuste de animaciones.
function vibrar(ms = 12) {
  if (!animOn()) return;
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* sin vibración: no pasa nada */ }
}
// Palomita al guardar: el botón Guardar se vuelve un círculo con una ✓ que se dibuja, y después se cierra
// la ventana. Lo ya guardado no depende de esto: solo es una pausa corta antes de cerrar.
function exitoEnBoton(boton) {
  vibrar();
  if (!animOn() || !boton || !boton.isConnected) return Promise.resolve();
  boton.classList.add('exito');
  boton.setAttribute('aria-label', 'Guardado');
  boton.innerHTML = '<svg class="palomita" viewBox="0 0 24 24" aria-hidden="true"><polyline points="5 12.5 10 17.5 19 7"/></svg>';
  return new Promise(r => setTimeout(r, 480));
}
// La tarjeta de una cuenta "crece" hasta ser su pantalla de detalle (y al volver se encoge a su lugar).
// Usa las transiciones de vista del navegador; donde no existen, se usa la animación de siempre.
function transicionVistaDisponible() { return animOn() && typeof document.startViewTransition === 'function'; }
function transicionVista(cambio) {
  try {
    const t = document.startViewTransition(() => { try { cambio(); } catch (e) { console.error(e); } });
    t.finished.catch(() => {}); t.ready.catch(() => {}); t.updateCallbackDone.catch(() => {});
    return t;
  } catch (e) { cambio(); return null; }
}
function limpiarNombresTransicion() {
  document.querySelectorAll('.vt-cuenta').forEach(e => { e.style.viewTransitionName = ''; e.classList.remove('vt-cuenta'); });
}
function marcarTransicion(el) { if (el) { el.style.viewTransitionName = 'cuenta-abierta'; el.classList.add('vt-cuenta'); } }

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
// Si el total no cabe junto a los botones (p. ej. Q 377,265.50 en un teléfono chico), se achica la letra lo justo.
function ajustarMontosResumen() {
  document.querySelectorAll('.total-monto').forEach(b => {
    b.style.fontSize = '';
    if (!b.clientWidth) return; // vista oculta: se ajusta al mostrarse
    let fs = parseFloat(getComputedStyle(b).fontSize);
    while (b.scrollWidth > b.clientWidth && fs > 9) { fs -= 0.5; b.style.fontSize = fs + 'px'; }
  });
}
window.addEventListener('resize', ajustarMontosResumen);
function textoNeto(neto) { return (neto > 0 ? '+' : '') + money(neto); }
// Cabecera de la lista (opción A): el total de la pestaña abierta ("Te deben" / "Debes") con el número
// de cuentas, y a la derecha Crear/Eliminar. Al tocar el total se abre el resumen con el neto y los PDF.
function cabeceraCuentasHtml() {
  const lista = cuentasVisibles();
  const deuda = lista.reduce((s, c) => s + deudaDe(c.balance), 0);
  const d = Math.round(deuda * 100) / 100;
  const clase = d > 0 ? (tipoCuentas === 'pagar' ? 'neg' : 'pos') : d < 0 ? 'favor' : 'cero';
  return `
    <div class="section-title cuentas-head total-head">
      <button class="total-btn" id="btnResumen" type="button" aria-label="Ver resumen y PDF">
        <span class="total-etiqueta">${tipoCuentas === 'pagar' ? 'Debes' : 'Te deben'}${d < 0 ? ' · saldo a favor' : ''}</span>
        <span class="total-fila"><span class="total-monto ${clase}" data-saldo="${Math.abs(d)}" data-clave="total-${tipoCuentas}">${money(Math.abs(d))}</span><span class="total-flecha">›</span></span>
        <span class="total-sub" id="accountsCount">${textoCuentas(lista.length)}</span>
      </button>
      <div class="mini-acciones">
        ${esAdminActual() ? `<button class="mini-btn danger solo-icono" id="btnEliminarCuentas" type="button" aria-label="Eliminar cuentas" title="Eliminar cuentas">${ICONS.trash}</button>` : ''}
        <button class="mini-btn principal" id="btnCrearCuenta" type="button">${ICONS.plus}<span>Crear</span></button>
      </div>
    </div>`;
}
function textoCuentas(n) { return n === 1 ? '1 cuenta' : `${n} cuentas`; }
function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/* ============================================================
   AUTENTICACIÓN
   ============================================================ */
let EMPRESA = null; // {id, nombre, codigo} de la empresa actual, una vez logueado
async function initAuth() {
  try {
    const status = await api('/auth/status');
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
// Entra a la app. Antes, si la primera carga de datos fallaba una sola vez (red del teléfono
// despertando, servidor tardando) o el aviso de notificaciones no respondía, la app quedaba en una
// pantalla vacía con el punto rojo para siempre. Ahora: se dibuja ya, la carga se reintenta sola,
// la conexión en tiempo real arranca igual y las notificaciones se revisan aparte.
let reintentoCargaT = null;
async function enterApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('mainScreen').classList.remove('hidden');
  document.getElementById('avatarInitial').textContent = initialOf(AUTH.nombre || AUTH.usuario);
  document.getElementById('userLabel').textContent = AUTH.nombre || AUTH.usuario;
  lastActivity = Date.now();
  animarEntrada();
  tipoCuentas = 'cobrar';
  setTabUI('cobrar'); // siempre se empieza en "Por cobrar"
  history.replaceState({ view: 'cobrar' }, '', location.href);
  mostrarCargando();
  connectWS();
  startIdleWatcher();
  conLimite(checkPushStatus(), 4000).then(renderNotifBtn, renderNotifBtn);
  if (await cargarDatosIniciales()) { avisoRespaldoCerrado = false; checkPendingTiendaBackup().then(revisarAvisosRespaldos); restaurarBorrador(); }
}
// Marca de envío: una por cada ventana de registro abierta (ver db/schema.sql, clave_envio).
// Reintentar en la MISMA ventana reusa la marca → el servidor no lo guarda dos veces.
// Abrir otra ventana crea una marca nueva → dos registros iguales hechos a propósito se guardan los dos.
function nuevaClaveEnvio() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  const b = new Uint8Array(16); crypto.getRandomValues(b);
  return Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
}
// ---- Envíos en duda ----
// Si al guardar no llegó respuesta (o el servidor falló), no se sabe si se guardó. La app anota ese
// intento (en este teléfono, solo la nota: no el dato). Si luego, en OTRA ventana, se registra
// exactamente lo mismo, se reusa su marca: si ya estaba guardado no se duplica. Y cuando vuelve la
// conexión, se pregunta al servidor qué pasó y se avisa. La nota existe SOLO mientras no se sabe qué
// pasó: no vence con el tiempo (aunque pasen días sin conexión) y se borra en cuanto el servidor
// confirma "sí se guardó" o "no se guardó", o cuando se vuelve a enviar y el servidor responde.
const CLAVE_PENDIENTES = 'kaab_envios_en_duda';
function leerPendientes() {
  try { return JSON.parse(localStorage.getItem(CLAVE_PENDIENTES) || '[]'); } catch (e) { return []; }
}
function guardarPendientes(lista) { try { localStorage.setItem(CLAVE_PENDIENTES, JSON.stringify(lista.slice(-50))); } catch (e) {} }
function firmaEnvio(d) {
  return JSON.stringify([AUTH && AUTH.id, d.ruta, String(d.texto || '').trim().toLowerCase(), Number(d.monto || 0).toFixed(2)]);
}
// Marca a usar: la de un intento en duda idéntico, si lo hay; si no, la de esta ventana.
function claveParaEnvio(claveVentana, datos) {
  const f = firmaEnvio(datos);
  const p = leerPendientes().find(x => x.firma === f);
  return p ? p.clave : claveVentana;
}
// rehacer: lo justo para volver a abrir la ventana ya llenada (sin la foto). estado 'no' = el servidor
// confirmó que NO se guardó: la nota se queda como recordatorio hasta que se registre de nuevo o se cierre.
function anotarEnDuda(clave, datos, etiqueta, rehacer) {
  const lista = leerPendientes().filter(x => x.clave !== clave);
  lista.push({ clave, firma: firmaEnvio(datos), etiqueta, usuario: AUTH && AUTH.id, t: Date.now(), rehacer });
  guardarPendientes(lista);
}
function quitarEnDuda(clave) {
  if (!clave) return;
  guardarPendientes(leerPendientes().filter(x => x.clave !== clave));
  mostrarPanelPendientes();
}
// ¿El error deja en duda si se guardó? (sin respuesta o fallo del servidor; un rechazo por datos, no)
function errorEnDuda(estado) { return estado.codigo === 0 || estado.codigo >= 500; }
const MSG_EN_DUDA = 'No se pudo confirmar si se guardó. Cuando vuelva la conexión te aviso si quedó guardado.';
let revisandoEnDuda = false;
async function revisarEnviosEnDuda() {
  if (!AUTH || revisandoEnDuda) return;
  const enDuda = leerPendientes().filter(x => x.usuario === AUTH.id && x.estado !== 'no');
  if (!enDuda.length) { mostrarPanelPendientes(); return; }
  revisandoEnDuda = true;
  try {
    const { guardadas } = await api('/envios/estado', { method: 'POST', silencioso: true, body: { claves: enDuda.map(x => x.clave) } });
    const si = enDuda.filter(x => guardadas.includes(x.clave));
    // Las que sí se guardaron: nota borrada. Las que no: quedan como recordatorio (estado 'no').
    const siSet = new Set(si.map(x => x.clave)), noSet = new Set(enDuda.filter(x => !siSet.has(x.clave)).map(x => x.clave));
    guardarPendientes(leerPendientes().filter(x => !siSet.has(x.clave)).map(x => noSet.has(x.clave) ? { ...x, estado: 'no' } : x));
    const textoSi = si.length ? '✓ Sí se guardó: ' + si.map(x => x.etiqueta).join('; ') + '.' : '';
    if (!mostrarPanelPendientes(textoSi) && textoSi) avisoLargo(textoSi);
  } catch (e) { /* se vuelve a revisar en la próxima reconexión */ }
  finally { revisandoEnDuda = false; }
}
// Aviso fijo con lo que NO se guardó: se queda hasta registrarlo de nuevo o cerrarlo (×).
// Devuelve true si quedó visible.
function mostrarPanelPendientes(textoSi) {
  document.querySelectorAll('.pendientes-panel').forEach(e => e.remove());
  if (!AUTH) return false;
  const no = leerPendientes().filter(x => x.usuario === AUTH.id && x.estado === 'no');
  if (!no.length) return false;
  const panel = document.createElement('div');
  panel.className = 'pendientes-panel';
  panel.setAttribute('role', 'alert');
  panel.innerHTML = `
    <div class="pp-cab"><b>${no.length === 1 ? 'Un registro no se guardó' : no.length + ' registros no se guardaron'}</b>
      <button class="pp-cerrar" type="button" aria-label="Cerrar aviso">×</button></div>
    ${textoSi ? `<p class="pp-ok">${escapeHtml(textoSi)}</p>` : ''}
    <ul class="pp-lista">${no.map(x => `
      <li><span>${escapeHtml(x.etiqueta.charAt(0).toUpperCase() + x.etiqueta.slice(1))}</span>
        ${x.rehacer ? `<button class="pp-rehacer" type="button" data-clave="${escapeHtml(x.clave)}">Registrar de nuevo</button>` : ''}</li>`).join('')}
    </ul>
    <p class="pp-nota">Se abre la ventana ya llenada: revisa y toca Guardar.${no.some(x => x.rehacer && x.rehacer.clase === 'tienda') ? ' Si tenía foto, vuelve a tomarla.' : ''}</p>`;
  document.body.appendChild(panel);
  panel.querySelector('.pp-cerrar').onclick = () => {
    const quitar = new Set(no.map(x => x.clave));
    guardarPendientes(leerPendientes().filter(x => !quitar.has(x.clave)));
    panel.remove();
  };
  panel.querySelectorAll('.pp-rehacer').forEach(b => b.onclick = () => rehacerEnvio(b.dataset.clave));
  return true;
}
// Abre la ventana del registro que no se guardó, ya llenada. La nota se borra al guardarlo.
async function rehacerEnvio(clave) {
  const n = leerPendientes().find(x => x.clave === clave);
  if (!n || !n.rehacer) return;
  const r = n.rehacer, prellenado = { desc: r.desc, monto: r.monto, notaClave: clave };
  if (r.clase === 'cuenta') {
    if (!CUENTAS.some(c => String(c.id) === String(r.cuentaId))) { toast('Esa cuenta ya no existe.'); quitarEnDuda(clave); return; }
    const cuenta = CUENTAS.find(c => String(c.id) === String(r.cuentaId));
    if (!document.getElementById('detailPage') || !currentAccountDetail || String(currentAccountDetail.id) !== String(r.cuentaId)) {
      if (esTabCuentas() && (cuenta.tipo || 'cobrar') !== tipoCuentas) setTabUI(cuenta.tipo || 'cobrar');
      await openAccountDetail(cuenta.id);
    }
    openMovModal(r.tipo, cuenta.id, prellenado);
  } else if (r.clase === 'tienda') {
    if (!document.getElementById('pageRoot').firstElementChild) setTabUI('tienda');
    openTiendaMovModal(r.tipo, prellenado);
  } else if (r.clase === 'crearCuenta') {
    if (!document.getElementById('pageRoot').firstElementChild) setTabUI(r.tipoCuenta);
    tipoCuentas = r.tipoCuenta;
    openCreateAccountModal({ nombre: r.nombre, notaClave: clave });
  }
}
// Aviso que se queda más tiempo (para mensajes importantes).
function avisoLargo(msg) {
  toast(msg);
  clearTimeout(toast._t);
  toast._t = setTimeout(() => document.getElementById('toast').classList.remove('show'), 6500);
}
// Ejecuta el guardado con el botón desactivado (evita el doble toque) y lo reactiva si falla.
async function conBotonOcupado(boton, tarea) {
  if (!boton || boton.disabled) return;
  const texto = boton.textContent;
  boton.disabled = true; boton.textContent = 'Guardando…';
  try { await tarea(); }
  finally {
    // Si se guardó, el botón ya muestra la palomita mientras la ventana se cierra: se deja así.
    if (boton.isConnected && !boton.classList.contains('exito')) { boton.disabled = false; boton.textContent = texto; }
  }
}
function conLimite(promesa, ms) { return Promise.race([promesa, new Promise((_, no) => setTimeout(() => no(new Error('tiempo')), ms))]); }
// Mientras llegan los datos: tarjetas grises con la forma de la lista (con un brillo que pasa).
function esqueletoCargaHtml() {
  const fila = (i) => `<div class="esq-fila"><span class="esq esq-circ"></span><span class="esq-txt"><span class="esq esq-linea" style="width:${[62, 48, 70, 55, 66, 44][i]}%"></span><span class="esq esq-linea corta"></span></span></div>`;
  return `<div class="esqueleto" role="status" aria-label="Cargando…"><span class="sr-only">Cargando…</span>
    <div class="esq-cabeza"><span class="esq-txt"><span class="esq esq-linea corta"></span><span class="esq esq-monto"></span></span><span class="esq esq-boton"></span></div>
    ${[0, 1, 2, 3, 4, 5].map(fila).join('')}</div>`;
}
function mostrarCargando(error) {
  const html = error
    ? `<div class="empty-state carga-estado">${ICONS.inbox}<p>No se pudieron cargar tus datos.<br>Reintentando…</p><button class="btn-secondary" id="btnReintentarCarga" type="button">Reintentar ahora</button></div>`
    : esqueletoCargaHtml();
  document.getElementById('deudasView').innerHTML = html;
  document.getElementById('tiendaView').innerHTML = html.replace('id="btnReintentarCarga"', 'id="btnReintentarCarga2"');
  ['btnReintentarCarga', 'btnReintentarCarga2'].forEach(id => { const b = document.getElementById(id); if (b) b.onclick = () => cargarDatosIniciales(); });
}
async function cargarDatosIniciales(intento = 0) {
  clearTimeout(reintentoCargaT);
  try {
    const [cuentas, tienda] = await Promise.all([api('/cuentas'), api('/tienda')]);
    CUENTAS = cuentas;
    TIENDA = tienda;
    renderDeudas();
    renderTienda();
    ocultarAvisoSinConexion();
    revisarEnviosEnDuda();
    return true;
  } catch (e) {
    if (!AUTH) return false; // la sesión ya no vale: api() ya llevó al inicio de sesión
    mostrarCargando(true);
    reintentoCargaT = setTimeout(() => { if (AUTH) cargarDatosIniciales(intento + 1); }, Math.min(15000, 2000 * (intento + 1)));
    return false;
  }
}
/* ============================================================
   CIERRE POR INACTIVIDAD (15 minutos)
   ============================================================ */
const IDLE_LIMIT_MS = 15 * 60 * 1000;
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
  if (!AUTH) return;
  clearInterval(idleInterval);
  // Primero la pantalla (si el teléfono acaba de despertar, la red puede tardar en responder y
  // no queremos dejar la app a medias); luego se avisa al servidor.
  await doLogoutCleanup();
  toast('Sesión cerrada por inactividad');
  api('/auth/logout', { method: 'POST' }).catch(() => {});
}
// La sesión dejó de ser válida en el servidor (venció, se cerró en otro lado, empresa suspendida…).
let cerrandoSesion = false;
async function sesionTerminada(mensaje) {
  if (cerrandoSesion || !AUTH) return;
  cerrandoSesion = true;
  try { clearInterval(idleInterval); clearTimeout(reintentoCargaT); await doLogoutCleanup(); if (mensaje) toast(mensaje); }
  finally { cerrandoSesion = false; }
}
async function logoutManual() {
  try { await api('/auth/logout', { method: 'POST' }); } catch (e) { /* ignorar */ }
  await doLogoutCleanup();
}
async function doLogoutCleanup() {
  AUTH = null;
  EMPRESA = null;
  clearTimeout(reintentoCargaT);
  if (ws) { try { ws.close(); } catch (e) {} ws = null; }
  wsConnected = false; updateSyncDot();
  ocultarAvisoSinConexion();
  document.querySelectorAll('.pendientes-panel').forEach(e => e.remove());
  const avisoResp = document.getElementById('avisoRespaldo'); if (avisoResp) avisoResp.remove();
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

// ---- Respaldos de tienda por borrarse (mejoras/TIENDA.md #9), solo para administradores ----
// - El respaldo que se borra el día 1 del mes que viene y nadie ha descargado: aviso grande, se puede cerrar.
// - Si ya pasó su fecha y nadie lo descargó: no se borra y la app queda bloqueada hasta descargarlo.
// Va en su propia capa (no en modalRoot) para no chocar con otras ventanas, como el borrador recuperado.
const NOMBRES_MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function fmtFechaLarga(iso) { const [a, m, d] = String(iso).split('-').map(Number); return `${d} de ${NOMBRES_MES[m - 1]}${a !== new Date().getFullYear() ? ' de ' + a : ''}`; }
let avisoRespaldoCerrado = false; // el aviso sin bloqueo se cierra hasta la próxima vez que entres
async function revisarAvisosRespaldos() {
  if (!esAdminActual()) return;
  let av;
  try { av = await api('/backups/tienda/avisos', { silencioso: true }); } catch (e) { return; }
  const capa = document.getElementById('avisoRespaldo');
  const b = av.vencidos[0] || (!avisoRespaldoCerrado && av.porBorrar[0]);
  if (!b) { if (capa) capa.remove(); return; }
  const bloquea = !!av.vencidos[0];
  const div = capa || document.createElement('div');
  div.id = 'avisoRespaldo';
  div.className = 'modal-overlay center aviso-respaldo';
  const html = `<div class="modal-card">
      <h3>${bloquea ? 'Descarga el respaldo para seguir' : 'Descarga este respaldo'}</h3>
      <p class="desc">${bloquea
        ? `El respaldo de tienda de <strong>${escapeHtml(b.nombre)}</strong> ya cumplió 5 meses y debía borrarse, pero nadie lo ha descargado. Descárgalo para seguir usando la app; después se borrará.`
        : `El respaldo de tienda de <strong>${escapeHtml(b.nombre)}</strong> se borrará para siempre el <strong>${fmtFechaLarga(b.se_borra)}</strong>. Descárgalo y guárdalo antes de esa fecha.`}</p>
      <div class="modal-actions">
        ${bloquea ? '' : '<button class="btn-cancel" id="avisoRespaldoLuego">Más tarde</button>'}
        <button class="btn-confirm" id="avisoRespaldoBajar">Descargar</button>
      </div>
    </div>`;
  if (div.dataset.respaldo === `${b.id}-${bloquea}`) return; // ya se muestra este mismo aviso: no se redibuja
  div.dataset.respaldo = `${b.id}-${bloquea}`;
  div.innerHTML = html;
  if (!capa) document.body.appendChild(div);
  const luego = div.querySelector('#avisoRespaldoLuego');
  if (luego) luego.onclick = () => { avisoRespaldoCerrado = true; div.remove(); };
  div.querySelector('#avisoRespaldoBajar').onclick = () => {
    window.location.href = `/api/backups/tienda/${b.id}/download`;
    if (!bloquea) { avisoRespaldoCerrado = true; div.remove(); }
    // Se vuelve a revisar: el servidor lo marca como descargado cuando terminó de enviarlo.
    let intentos = 0;
    const revisar = () => { intentos++; revisarAvisosRespaldos().then(() => { if (bloquea && document.getElementById('avisoRespaldo') && intentos < 8) setTimeout(revisar, 2500); }); };
    setTimeout(revisar, 2500);
  };
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

// Fondo de color de la pestaña elegida: se desliza de una pestaña a otra (solo se mueve, no se redibuja).
const indicadorPestana = (() => {
  const barra = document.querySelector('.tabbar');
  if (!barra) return null;
  const ind = document.createElement('span');
  ind.className = 'tab-indicador';
  ind.setAttribute('aria-hidden', 'true');
  barra.prepend(ind);
  barra.classList.add('con-indicador');
  // Si el menú cambia de tamaño (girar el teléfono, o reaparece tras una búsqueda) se recoloca.
  if (typeof ResizeObserver === 'function') new ResizeObserver(() => moverIndicadorPestana(true)).observe(barra);
  return ind;
})();
function moverIndicadorPestana(sinAnimar) {
  const ind = indicadorPestana;
  if (!ind) return;
  const btn = document.querySelector(`.tab-btn[data-tab="${currentTab}"]`);
  if (!btn || !btn.offsetWidth) return; // menú oculto: se recoloca cuando vuelva a verse
  if (sinAnimar) ind.classList.add('sin-animar');
  ind.dataset.tab = currentTab;
  ind.style.width = btn.offsetWidth + 'px';
  ind.style.transform = `translateX(${btn.offsetLeft}px)`;
  if (sinAnimar) { void ind.offsetWidth; ind.classList.remove('sin-animar'); }
  ind.classList.add('listo');
}
function setTabUI(tab) {
  const anterior = currentTab;
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('deudasView').classList.toggle('hidden', !esTabCuentas(tab));
  document.getElementById('tiendaView').classList.toggle('hidden', tab !== 'tienda');
  if (anterior !== tab) reiniciarBusqueda();
  if (tab === 'tienda' && anterior !== tab) {
    tiendaVisibles = TRAMO_TIENDA;
    if (tiendaDesactualizada && AUTH) refrescarTiendaPronto(); else if (AUTH) renderTiendaListOnly();
  }
  // "Por cobrar" y "Por pagar" comparten la misma vista: al cambiar de tipo se vuelve a dibujar.
  if (esTabCuentas(tab) && tipoCuentas !== tab) { tipoCuentas = tab; if (AUTH) renderDeudas(); }
  else if (esTabCuentas(tab)) ajustarMontosResumen();
  moverIndicadorPestana();
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
// ---- Protección de las ventanas de registro (salida/entrada de tienda, abono/cargo, crear cuenta) ----
// Antes, un "atrás" del teléfono (p. ej. al volver de la cámara) cerraba la ventana y regresaba a
// "Por cobrar" perdiendo lo escrito; y si el teléfono reiniciaba la app por falta de memoria (la cámara
// usa mucha), también se perdía. Ahora:
//  - con datos escritos, el "atrás" y el toque fuera de la ventana NO la cierran;
//  - mientras se escribe, se guarda un borrador en el teléfono; si la app se reinicia, al volver se
//    reabre la misma ventana ya llenada. El borrador se borra al Guardar o Cancelar (o a los 30 min).
let formularioActivo = null; // { tieneDatos(), borrador(), estado }
const CLAVE_BORRADOR = 'kaab_borrador';
function activarFormulario(f) { formularioActivo = { ...f, estado: history.state }; }
function guardarBorrador(extra) {
  if (!formularioActivo || !formularioActivo.borrador || !AUTH) return;
  const b = formularioActivo.borrador();
  if (!b) return;
  const datos = { ...b, ...(extra || {}), usuario: AUTH.id, t: Date.now() };
  try { localStorage.setItem(CLAVE_BORRADOR, JSON.stringify(datos)); }
  catch (e) { try { delete datos.foto; localStorage.setItem(CLAVE_BORRADOR, JSON.stringify(datos)); } catch (e2) {} }
}
function borrarBorrador() { try { localStorage.removeItem(CLAVE_BORRADOR); } catch (e) {} }
function leerBorrador() {
  try {
    const b = JSON.parse(localStorage.getItem(CLAVE_BORRADOR) || 'null');
    if (!b || !AUTH || b.usuario !== AUTH.id || Date.now() - b.t > 30 * 60 * 1000) return null;
    return b;
  } catch (e) { return null; }
}
// Si la app se reinició con una ventana a medio llenar, la vuelve a abrir.
async function restaurarBorrador() {
  const b = leerBorrador();
  if (!b) return;
  const prellenado = { desc: b.desc, monto: b.monto, foto: b.foto, recuperado: true, camara: b.camara };
  if (b.clase === 'tienda') {
    setTabUI('tienda'); history.replaceState({ view: 'tienda' }, '', location.href);
    openTiendaMovModal(b.tipo, prellenado);
  } else if (b.clase === 'cuenta') {
    const c = CUENTAS.find(x => String(x.id) === String(b.cuentaId));
    if (!c) { borrarBorrador(); return; }
    setTabUI(c.tipo || 'cobrar'); history.replaceState({ view: c.tipo || 'cobrar' }, '', location.href);
    await openAccountDetail(c.id);
    openMovModal(b.tipo, c.id, prellenado);
  }
}
function notaRecuperado(p) {
  return p && p.recuperado
    ? `<p class="recuperado-nota">Recuperamos lo que estabas escribiendo (la app se reinició).${p.camara && !p.foto ? ' Vuelve a tomar la foto.' : ''}</p>` : '';
}
window.addEventListener('popstate', (e) => {
  if (!AUTH) return;
  if (formularioActivo && formularioActivo.tieneDatos()) {
    history.pushState(formularioActivo.estado, '', location.href); // se queda donde estaba
    toast('Tienes datos sin guardar. Toca Guardar o Cancelar.');
    return;
  }
  formularioActivo = null;
  applyHistoryState(e.state);
});
async function applyHistoryState(state) {
  state = state || { view: 'cobrar' };
  // Volver de una cuenta a la lista: su pantalla se encoge hasta la tarjeta de la cuenta.
  const pagina = document.getElementById('detailPage');
  const idCuenta = currentAccountDetail && currentAccountDetail.id;
  const aPestana = !['accountDetail', 'historial', 'users', 'invoice'].includes(state.view);
  if (aPestana && pagina && idCuenta != null && !document.querySelector('#modalRoot .modal-overlay') && transicionVistaDisponible()) {
    limpiarNombresTransicion();
    marcarTransicion(pagina);
    const t = transicionVista(() => {
      limpiarNombresTransicion();
      aplicarEstadoHistorial(state); // para una pestaña todo es inmediato (no espera al servidor)
      marcarTransicion(document.querySelector(`#accountListWrap .account-card[data-id="${idCuenta}"]`));
    });
    if (t) t.finished.finally(limpiarNombresTransicion).catch(() => {});
    else limpiarNombresTransicion();
    return;
  }
  await aplicarEstadoHistorial(state);
}
async function aplicarEstadoHistorial(state) {
  formularioActivo = null;
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
    ${cabeceraCuentasHtml()}
    <div id="accountListWrap"></div>
  `;

  document.getElementById('btnCrearCuenta').onclick = openCreateAccountModal;
  if (esAdminActual()) document.getElementById('btnEliminarCuentas').onclick = toggleSelectMode;
  document.getElementById('btnResumen').onclick = abrirResumen;
  renderAccountsListOnly();
  ajustarMontosResumen();
  animarSaldos(el);
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

  document.getElementById('accountsCount').textContent = textoCuentas(lista.length);

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
      <div class="acc-circ">${escapeHtml(initialOf(c.nombre))}</div>
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
      if (selectMode) toggleSelect(id); else openAccountDetail(id, { desde: card });
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
          toast('Cuentas eliminadas'); vibrar();
        } catch (e) { toast('No se pudieron eliminar las cuentas'); }
      });
  };
}
function openCreateAccountModal(prellenado = null) {
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
  if (prellenado) input.value = prellenado.nombre || '';
  activarFormulario({ tieneDatos: () => !!(input.isConnected && input.value.trim()) });
  setTimeout(() => input.focus(), 50);
  const clave = nuevaClaveEnvio();
  const botonC = document.getElementById('confirmCreateAcc');
  const submit = () => conBotonOcupado(botonC, async () => {
    const nombre = input.value.trim();
    if (!nombre) return;
    const datos = { ruta: `crearCuenta:${tipoCuentas}`, texto: nombre, monto: 0 };
    const claveUsada = claveParaEnvio(clave, datos);
    const estado = {};
    try {
      const cuenta = await api('/cuentas', { method: 'POST', estado, body: { nombre, tipo: tipoCuentas, clave: claveUsada } });
      quitarEnDuda(claveUsada); if (prellenado) quitarEnDuda(prellenado.notaClave);
      if (!CUENTAS.some(c => c.id === cuenta.id)) CUENTAS.push({ ...cuenta, ultima_actividad: cuenta.fecha_creacion });
      await exitoEnBoton(botonC);
      closeModal(); renderDeudas(); toast('Cuenta creada');
      // Se entra directo a la cuenta nueva, lista para registrar su primer movimiento.
      openAccountDetail(cuenta.id);
      if (cuenta.repetido) avisoLargo('Esa cuenta ya se había creado: la conexión se cortó antes de confirmarlo. No se duplicó.');
    } catch (e) {
      if (errorEnDuda(estado)) {
        anotarEnDuda(claveUsada, datos, `cuenta "${nombre}"`, { clase: 'crearCuenta', tipoCuenta: tipoCuentas, nombre });
        avisoLargo(MSG_EN_DUDA);
      } else toast(typeof e === 'string' && e !== 'Error de red' ? e : 'No se pudo crear la cuenta');
    }
  });
  botonC.onclick = submit;
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

/* ============================================================
   DETALLE DE CUENTA
   ============================================================ */
async function openAccountDetail(id, opts = {}) {
  try {
    currentAccountDetail = await api(`/cuentas/${id}`);
    const tarjetaOrigen = opts.desde;
    if (tarjetaOrigen && tarjetaOrigen.isConnected && !document.getElementById('detailPage') && transicionVistaDisponible()) {
      // La tarjeta tocada crece hasta ser la pantalla de la cuenta.
      limpiarNombresTransicion();
      marcarTransicion(tarjetaOrigen);
      const t = transicionVista(() => {
        limpiarNombresTransicion();
        renderAccountDetailPage();
        marcarTransicion(document.getElementById('detailPage'));
      });
      if (t) t.finished.finally(limpiarNombresTransicion).catch(() => {});
      else limpiarNombresTransicion();
    } else {
      animarEntrada();
      renderAccountDetailPage();
    }
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
          <button class="abono-btn${deudaDe(c.balance) <= 0 ? ' abono-favor' : ''}" id="btnAbono">${ICONS.arrowDown} ${deudaDe(c.balance) <= 0 ? 'Abono a favor' : 'Abono'}</button>
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
// Visor de factura a pantalla completa con zoom: pellizcar con dos dedos, tocar dos veces,
// o los botones + / −; se arrastra para moverse. Esc o × lo cierran.
function openPhotoLightbox(dataUrl) {
  document.querySelectorAll('.visor-foto').forEach(v => v.remove());
  const v = document.createElement('div');
  v.className = 'visor-foto';
  v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Factura');
  v.innerHTML = `
    <div class="visor-barra">
      <span class="visor-titulo">Factura</span>
      <button class="visor-btn" data-z="-" type="button" aria-label="Alejar">−</button>
      <span class="visor-zoom">Ajustar</span>
      <button class="visor-btn" data-z="+" type="button" aria-label="Acercar">+</button>
      <button class="visor-btn visor-cerrar" type="button" aria-label="Cerrar">×</button>
    </div>
    <div class="visor-area"></div>
    <p class="visor-ayuda">Pellizca o toca dos veces para acercar · arrastra para moverte</p>`;
  const area = v.querySelector('.visor-area');
  const img = crearImgFoto(dataUrl);
  img.className = 'visor-img'; img.draggable = false;
  area.appendChild(img);
  document.body.appendChild(v);
  const etiqueta = v.querySelector('.visor-zoom');
  let z = 1;
  // Cambia el zoom manteniendo fijo el punto (cx, cy) de la pantalla.
  const aplicar = (nz, cx, cy) => {
    nz = Math.min(5, Math.max(1, nz));
    const r = area.getBoundingClientRect();
    if (cx == null) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
    // (la foto puede estar centrada dentro del área: se cuenta su desplazamiento offsetLeft/offsetTop)
    const px = (area.scrollLeft + cx - r.left - img.offsetLeft) / img.offsetWidth;
    const py = (area.scrollTop + cy - r.top - img.offsetTop) / img.offsetHeight;
    z = nz;
    img.style.width = (z * 100) + '%';
    area.scrollLeft = img.offsetLeft + px * img.offsetWidth - (cx - r.left);
    area.scrollTop = img.offsetTop + py * img.offsetHeight - (cy - r.top);
    etiqueta.textContent = z === 1 ? 'Ajustar' : Math.round(z * 100) + '%';
  };
  v.querySelector('[data-z="+"]').onclick = () => aplicar(z < 2 ? 2 : z + 1);
  v.querySelector('[data-z="-"]').onclick = () => aplicar(z <= 2 ? 1 : z - 1);
  // Doble toque / doble clic: acerca donde tocaste, o vuelve a ajustar.
  let ultimoToque = 0;
  const dobleToque = (x, y) => aplicar(z > 1 ? 1 : 2.5, x, y);
  area.addEventListener('dblclick', e => dobleToque(e.clientX, e.clientY));
  // Pellizco con dos dedos
  let pinza = null;
  const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  area.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      pinza = { d: dist(e.touches), z, cx: (e.touches[0].clientX + e.touches[1].clientX) / 2, cy: (e.touches[0].clientY + e.touches[1].clientY) / 2 };
    } else if (e.touches.length === 1) {
      const ahora = Date.now();
      if (ahora - ultimoToque < 300) { e.preventDefault(); dobleToque(e.touches[0].clientX, e.touches[0].clientY); ultimoToque = 0; }
      else ultimoToque = ahora;
    }
  }, { passive: false });
  area.addEventListener('touchmove', e => {
    if (pinza && e.touches.length === 2) { e.preventDefault(); aplicar(pinza.z * dist(e.touches) / pinza.d, pinza.cx, pinza.cy); }
  }, { passive: false });
  area.addEventListener('touchend', e => { if (e.touches.length < 2) pinza = null; });
  const cerrar = () => { v.remove(); document.removeEventListener('keydown', teclas); };
  const teclas = e => { if (e.key === 'Escape') cerrar(); };
  document.addEventListener('keydown', teclas);
  v.querySelector('.visor-cerrar').onclick = cerrar;
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
function openMovModal(tipo, cuentaId, prellenado = null) {
  const isAbono = tipo === 'abono';
  // Si la cuenta no debe nada (en cero o ya a favor), el abono queda a favor: se avisa antes de guardar.
  const tipoCta = (currentAccountDetail && currentAccountDetail.tipo) || 'cobrar';
  const aFavor = isAbono && !!currentAccountDetail && deudaDe(currentAccountDetail.balance) <= 0;
  const T = TEXTOS_TIPO[tipoCta];
  const descripcion = aFavor
    ? (tipoCta === 'pagar' ? 'No le debes nada a esta cuenta: lo que registres quedará a tu favor.' : 'Esta cuenta no debe nada: lo que registres quedará a favor del cliente.')
    : (isAbono ? T.abonoDesc : T.cargoDesc);
  // La ventana toma el color del botón que la abrió: verde abono, rojo cargo, dorado abono a favor.
  showModal(`
    <h3 class="mov-titulo"><span class="mov-titulo-icono">${isAbono ? ICONS.arrowDown : ICONS.arrowUp}</span>${aFavor ? 'Nuevo abono a favor' : isAbono ? 'Nuevo abono' : 'Nuevo cargo'}</h3>
    ${notaRecuperado(prellenado)}
    <p class="desc">${descripcion}</p>
    <div class="field"><label>Descripción</label><input id="movDesc" type="text" placeholder="Ej. Pago quincenal"></div>
    <div class="field"><label>Monto (Q)</label><input id="movMonto" type="number" step="0.01" min="0" placeholder="0.00"></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmMov">Guardar</button>
    </div>
  `, { clase: aFavor ? 'mov-favor' : isAbono ? 'mov-abono' : 'mov-cargo' });
  if (prellenado) { document.getElementById('movDesc').value = prellenado.desc || ''; document.getElementById('movMonto').value = prellenado.monto || ''; }
  activarFormulario({
    tieneDatos: () => !!(document.getElementById('movDesc') && (document.getElementById('movDesc').value.trim() || document.getElementById('movMonto').value)),
    borrador: () => {
      const d = document.getElementById('movDesc'), m = document.getElementById('movMonto');
      if (!d || (!d.value.trim() && !m.value)) return null;
      return { clase: 'cuenta', cuentaId, tipo, desc: d.value, monto: m.value };
    },
  });
  ['movDesc', 'movMonto'].forEach(id => document.getElementById(id).addEventListener('input', () => guardarBorrador()));
  setTimeout(() => document.getElementById('movDesc').focus(), 50);
  const clave = nuevaClaveEnvio();
  const boton = document.getElementById('confirmMov');
  boton.onclick = () => conBotonOcupado(boton, async () => {
    const desc = document.getElementById('movDesc').value.trim();
    let monto = parseFloat(document.getElementById('movMonto').value);
    if (isNaN(monto) || monto <= 0) return;
    const datos = { ruta: `cuenta:${cuentaId}:${tipo}`, texto: desc, monto };
    const claveUsada = claveParaEnvio(clave, datos);
    const estado = {};
    try {
      const { movimiento, balance, repetido } = await api(`/cuentas/${cuentaId}/movimientos`, { method: 'POST', estado, body: { tipo, descripcion: desc, monto, clave: claveUsada } });
      quitarEnDuda(claveUsada); if (prellenado) quitarEnDuda(prellenado.notaClave);
      if (!currentAccountDetail.movimientos.some(m => m.id === movimiento.id)) currentAccountDetail.movimientos.push(movimiento);
      currentAccountDetail.balance = balance;
      const listItem = CUENTAS.find(c => c.id === cuentaId || String(c.id) === String(cuentaId));
      if (listItem) { listItem.balance = balance; listItem.ultima_actividad = movimiento.fecha; }
      await exitoEnBoton(boton);
      if (isAbono && window.KaabMuneco && window.KaabMuneco.celebrar) window.KaabMuneco.celebrar();
      closeModal();
      renderAccountDetailPage();
      renderDeudas();
      resaltar(`#pageRoot [data-mov="${movimiento.id}"]`);
      if (repetido) avisoLargo('Ya estaba guardado: la conexión se cortó antes de confirmarlo. No se duplicó.');
      else toast(aFavor ? 'Abono a favor registrado' : isAbono ? 'Abono registrado' : 'Cargo registrado');
    } catch (e) {
      if (errorEnDuda(estado)) {
        const nombre = (currentAccountDetail && currentAccountDetail.nombre) || 'la cuenta';
        anotarEnDuda(claveUsada, datos, `${isAbono ? 'abono' : 'cargo'} de ${money(monto)}${desc ? ' "' + desc + '"' : ''} en ${nombre}`,
          { clase: 'cuenta', cuentaId, tipo, desc, monto });
        avisoLargo(MSG_EN_DUDA);
      } else toast(typeof e === 'string' && e !== 'Error de red' ? e : 'No se pudo guardar el movimiento');
    }
  });
}
function confirmDeleteMovCuenta(cuentaId, movId) {
  openConfirmModal('¿Eliminar este movimiento?', 'Esta acción no se puede deshacer y recalculará los saldos posteriores.', async () => {
    try {
      await api(`/cuentas/${cuentaId}/movimientos/${movId}`, { method: 'DELETE' });
      currentAccountDetail = await api(`/cuentas/${cuentaId}`);
      CUENTAS = await api('/cuentas'); // saldo y última actividad recalculados
      renderAccountDetailPage();
      renderDeudas();
      toast('Movimiento eliminado'); vibrar();
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
    ${movs.length ? `<div class="swipe-hint">Mantén presionado un movimiento para eliminarlo (solo los del último mes)</div>` : ''}
    <div id="tiendaMovList"></div>
  `;
  document.getElementById('btnEntrada').onclick = () => openTiendaMovModal('entrada');
  document.getElementById('btnSalida').onclick = () => openTiendaMovModal('salida');
  document.getElementById('btnPdfTienda').onclick = openPdfTiendaFilterModal;
  document.getElementById('btnFactura').onclick = openInvoicePage;
  renderTiendaListOnly();
  animarSaldos(document.getElementById('tiendaView'));
}
// Agrega a la lista local un movimiento recién guardado (con el saldo que devolvió el servidor).
function agregarMovTiendaLocal(mov, balance) {
  if (!TIENDA.movimientos.some(m => m.id === mov.id)) {
    TIENDA.movimientos.push(mov);
    if (new Date(mov.fecha).toDateString() === new Date().toDateString()) TIENDA.balanceHoy = Number(TIENDA.balanceHoy || 0) + Number(mov.monto);
  }
  if (balance !== undefined) TIENDA.balance = balance;
}
// La lista de tienda se dibuja por tramos: los 60 más recientes y "Ver más". Antes se dibujaba todo el
// mes (cientos de filas) en cada guardado y cada cambio de otra persona: lento en teléfonos modestos.
const TRAMO_TIENDA = 60;
let tiendaVisibles = TRAMO_TIENDA;
// Cambios de otra persona en la tienda: si no estás viéndola, se actualiza al entrar (no en el momento).
let tiendaDesactualizada = false, refrescoTiendaT = null;
function refrescarTiendaPronto() {
  clearTimeout(refrescoTiendaT);
  if (currentTab !== 'tienda') { tiendaDesactualizada = true; return; }
  refrescoTiendaT = setTimeout(async () => { // junta varios cambios seguidos en una sola descarga
    try { TIENDA = await api('/tienda', { silencioso: true }); tiendaDesactualizada = false; if (currentTab === 'tienda') renderTienda(); }
    catch (e) { tiendaDesactualizada = true; }
  }, 400);
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
  const visibles = movs.slice(0, tiendaVisibles);
  const restantes = movs.length - visibles.length;
  const groups = {};
  visibles.forEach(m => { const key = fmtDateShort(m.fecha); (groups[key] = groups[key] || []).push(m); });
  listEl.innerHTML = movs.length === 0
    ? `<div class="empty-state">${ICONS.inbox}<p>${q ? `Ningún movimiento coincide con «${escapeHtml(searchQuery.trim())}».` : 'Sin movimientos registrados en la tienda todavía.'}</p></div>`
    : Object.keys(groups).map(dk => `
        <div class="history-date-group">
          <div class="history-date-label">${fmtDateLabel(groups[dk][0].fecha)}</div>
          ${groups[dk].map(m => movRowHtml(m)).join('')}
        </div>`).join('')
      + (restantes > 0 ? `<button class="pdf-btn ver-mas" id="btnVerMasTienda" type="button">Ver más (${restantes} anteriores)</button>` : '');
  const verMas = document.getElementById('btnVerMasTienda');
  if (verMas) verMas.onclick = () => { tiendaVisibles += 100; renderTiendaListOnly(); };
  bindMovLongPress(listEl, confirmDeleteMovTienda);
  bindPhotoButtons(listEl, visibles);
}
// Fotos de factura: se guardan nítidas para poder leer letras pequeñas, sin pasarse de tamaño.
// - Lado largo hasta 2000 px (antes 1000 px de ancho).
// - Se reduce por pasos (a la mitad cada vez) con suavizado de alta calidad: así las letras no se difuminan.
// - JPEG al 85 %; si aun así pesa más de ~1 MB, baja la calidad y luego el tamaño hasta caber
//   (el servidor acepta hasta 1,5 MB: lib/fotos.js).
const FOTO_LADO_MAX = 2000;
const FOTO_MAX_CARACTERES = 1100000;
function redimensionarFoto(img, ladoMax) {
  const w0 = img.naturalWidth || img.width, h0 = img.naturalHeight || img.height; // <img> o <canvas>
  const escala = Math.min(1, ladoMax / Math.max(w0, h0));
  const w = Math.max(1, Math.round(w0 * escala)), h = Math.max(1, Math.round(h0 * escala));
  let fuente = img, fw = w0, fh = h0;
  // Fotos enormes (cámaras de 50–200 MP): primero se baja de una vez a ≤ 4096 px. Reducir a la mitad
  // desde el tamaño original creaba lienzos gigantes que dejaban al teléfono sin memoria.
  if (Math.max(fw, fh) > 4096 && Math.max(fw, fh) / 2 >= Math.max(w, h)) {
    const e = 4096 / Math.max(fw, fh);
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(fw * e)); c.height = Math.max(1, Math.round(fh * e));
    const cx = c.getContext('2d');
    if (!cx) throw new Error('Sin memoria para la foto');
    cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
    cx.drawImage(fuente, 0, 0, c.width, c.height);
    fuente = c; fw = c.width; fh = c.height;
  }
  while (fw / 2 >= w) { // a la mitad mientras siga siendo más del doble del tamaño final
    const c = document.createElement('canvas');
    c.width = Math.round(fw / 2); c.height = Math.round(fh / 2);
    const cx = c.getContext('2d');
    cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
    cx.drawImage(fuente, 0, 0, c.width, c.height);
    fuente = c; fw = c.width; fh = c.height;
  }
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); // por si la imagen trae transparencia
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(fuente, 0, 0, w, h);
  return canvas;
}
function esHeic(file) { return /hei[cf]/i.test(file.type || '') || /\.(heic|heif)$/i.test(file.name || ''); }
function errorFoto(codigo, mensaje) { const e = new Error(mensaje); e.codigo = codigo; return e; }
function cargarImagen(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = async () => {
      URL.revokeObjectURL(url);
      // Plan B: algunos navegadores abren con createImageBitmap lo que <img> no puede.
      try { if (window.createImageBitmap) return resolve(await createImageBitmap(file)); } catch (e) { /* sigue abajo */ }
      reject(esHeic(file) ? errorFoto('heic', 'Formato HEIC no compatible') : errorFoto('lectura', 'No se pudo leer la imagen'));
    };
    img.src = url;
  });
}
// Mensaje para la persona según lo que falló.
function mensajeErrorFoto(e) {
  if (e && e.codigo === 'heic') return 'Esta foto está en formato HEIC y el navegador no la puede abrir. Tómala con la cámara desde aquí, o en la cámara del teléfono cambia el formato a JPG (en iPhone: Ajustes › Cámara › Formatos › "Más compatible").';
  if (e && e.codigo === 'lectura') return 'No se pudo abrir esa foto. Intenta tomarla de nuevo o elige otra.';
  return 'No se pudo procesar la foto. Intenta tomarla de nuevo; si sigue pasando, elige "Usar foto completa".';
}
// Diagnóstico: el motivo (sin la foto ni datos personales) queda en los registros del servidor.
function reportarErrorFoto(e, file, etapa) {
  try {
    api('/diagnostico/foto', { method: 'POST', silencioso: true, body: {
      etapa, codigo: (e && e.codigo) || '', error: String((e && (e.name + ': ' + e.message)) || e).slice(0, 200),
      tipo: (file && file.type) || '', tamanoKB: file ? Math.round(file.size / 1024) : 0,
      navegador: navigator.userAgent.slice(0, 160),
    } }).catch(() => {});
  } catch (x) {}
}
// Convierte una foto (<img> o <canvas>) en JPEG nítido sin pasar de ~1 MB.
function codificarFoto(fuente) {
  let lado = FOTO_LADO_MAX;
  for (let intento = 0; intento < 6; intento++) {
    const canvas = redimensionarFoto(fuente, lado);
    for (const calidad of [0.85, 0.78, 0.7]) {
      const data = canvas.toDataURL('image/jpeg', calidad);
      if (data.length <= FOTO_MAX_CARACTERES) return data;
    }
    lado = Math.round(lado * 0.8);
  }
  throw new Error('La foto es demasiado grande');
}
async function compressImage(file) { return codificarFoto(await cargarImagen(file)); }

// Editor de recorte (public/recorte.js hace la detección y el enderezado, todo en el teléfono).
// Muestra la foto con las 4 esquinas detectadas para corregirlas con el dedo.
// Devuelve: un <canvas> con la factura recortada, la foto completa (<img>) o null si se cancela.
function editarRecorte(img) {
  return editarRecorteInterno(img).catch(e => {
    document.querySelectorAll('.recorte-editor').forEach(v => v.remove());
    reportarErrorFoto(e, null, 'recorte');
    toast('No se pudo abrir el recorte: se usará la foto completa.');
    return img;
  });
}
function editarRecorteInterno(img) {
  return new Promise(resolve => {
    const R = window.KaabRecorte;
    const W = img.naturalWidth || img.width, H = img.naturalHeight || img.height; // <img> o ImageBitmap
    let esquinas = null;
    try { esquinas = R ? R.detectar(img) : null; } catch (e) { esquinas = null; }
    const encontrada = !!esquinas;
    if (!esquinas) { const m = 0.04; esquinas = [{ x: W * m, y: H * m }, { x: W * (1 - m), y: H * m }, { x: W * (1 - m), y: H * (1 - m) }, { x: W * m, y: H * (1 - m) }]; }
    const v = document.createElement('div');
    v.className = 'recorte-editor';
    v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Recortar factura');
    v.innerHTML = `
      <div class="visor-barra"><span class="visor-titulo">Ajusta la factura</span><button class="visor-btn visor-cerrar" type="button" aria-label="Cancelar">×</button></div>
      <p class="recorte-msg ${encontrada ? '' : 'aviso'}">${encontrada ? 'Encontré la factura. Si alguna esquina quedó mal, arrástrala.' : 'No encontré bien la factura: arrastra las 4 esquinas a sus bordes.'}</p>
      <div class="recorte-area"><div class="recorte-lienzo">
        <canvas class="recorte-foto"></canvas>
        <svg class="recorte-svg"><path class="recorte-sombra" fill-rule="evenodd"></path><polygon class="recorte-borde"></polygon></svg>
        ${[0, 1, 2, 3].map(i => `<div class="recorte-punto" data-i="${i}" role="slider" aria-label="Esquina ${i + 1}"></div>`).join('')}
      </div></div>
      <div class="recorte-acciones">
        <button class="btn-cancel" id="recorteCompleta" type="button">Usar foto completa</button>
        <button class="btn-confirm" id="recorteOk" type="button">Recortar</button>
      </div>`;
    document.body.appendChild(v);
    const area = v.querySelector('.recorte-area'), lienzo = v.querySelector('.recorte-lienzo');
    const foto = v.querySelector('.recorte-foto'), svg = v.querySelector('.recorte-svg');
    const sombra = v.querySelector('.recorte-sombra'), borde = v.querySelector('.recorte-borde');
    const puntos = [...v.querySelectorAll('.recorte-punto')];
    let s = 1;
    const pintar = () => {
      const p = esquinas.map(e => `${(e.x * s).toFixed(1)},${(e.y * s).toFixed(1)}`);
      borde.setAttribute('points', p.join(' '));
      sombra.setAttribute('d', `M0 0H${W * s}V${H * s}H0Z M${p.join(' L')} Z`);
      puntos.forEach((el, i) => { el.style.left = (esquinas[i].x * s) + 'px'; el.style.top = (esquinas[i].y * s) + 'px'; });
    };
    const acomodar = () => { // la foto completa cabe en el área
      const r = area.getBoundingClientRect();
      s = Math.min((r.width - 24) / W, (r.height - 24) / H);
      const dw = Math.round(W * s), dh = Math.round(H * s), dpr = Math.min(2, window.devicePixelRatio || 1);
      lienzo.style.width = dw + 'px'; lienzo.style.height = dh + 'px';
      foto.width = Math.round(dw * dpr); foto.height = Math.round(dh * dpr);
      foto.style.width = dw + 'px'; foto.style.height = dh + 'px';
      foto.getContext('2d').drawImage(redimensionarFoto(img, Math.max(foto.width, foto.height)), 0, 0, foto.width, foto.height);
      svg.setAttribute('viewBox', `0 0 ${dw} ${dh}`);
      pintar();
    };
    acomodar();
    window.addEventListener('resize', acomodar);
    // Arrastrar esquinas
    puntos.forEach((el, i) => {
      el.addEventListener('pointerdown', e => {
        e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add('activo');
        const mover = ev => {
          const r = lienzo.getBoundingClientRect();
          esquinas[i] = { x: Math.min(W, Math.max(0, (ev.clientX - r.left) / s)), y: Math.min(H, Math.max(0, (ev.clientY - r.top) / s)) };
          pintar();
        };
        const soltar = () => { el.classList.remove('activo'); el.removeEventListener('pointermove', mover); el.removeEventListener('pointerup', soltar); el.removeEventListener('pointercancel', soltar); };
        el.addEventListener('pointermove', mover); el.addEventListener('pointerup', soltar); el.addEventListener('pointercancel', soltar);
      });
    });
    const terminar = res => { window.removeEventListener('resize', acomodar); v.remove(); resolve(res); };
    v.querySelector('.visor-cerrar').onclick = () => terminar(null);
    v.querySelector('#recorteCompleta').onclick = () => terminar(img);
    v.querySelector('#recorteOk').onclick = () => {
      const q = R.ordenar(esquinas);
      const area2 = Math.abs(q.reduce((acc, a, i) => { const b = q[(i + 1) % 4]; return acc + a.x * b.y - b.x * a.y; }, 0)) / 2;
      if (area2 < W * H * 0.02) { toast('El recorte es demasiado pequeño. Separa más las esquinas.'); return; }
      const btn = v.querySelector('#recorteOk'); btn.disabled = true; btn.textContent = 'Recortando…';
      setTimeout(() => { // deja que se vea "Recortando…" antes del cálculo
        try { terminar(R.enderezar(img, q, FOTO_LADO_MAX, redimensionarFoto)); }
        catch (e) { btn.disabled = false; btn.textContent = 'Recortar'; toast('No se pudo recortar. Usa la foto completa.'); }
      }, 30);
    };
  });
}
function openTiendaMovModal(tipo, prellenado = null) {
  const isEntrada = tipo === 'entrada';
  let fotoDataUrl = null;
  showModal(`
    <h3>${isEntrada ? 'Nueva entrada' : 'Nueva salida'}</h3>
    <p class="desc">${isEntrada ? 'Registra dinero que entra a la tienda.' : 'Registra dinero que sale de la tienda.'}</p>
    ${notaRecuperado(prellenado)}
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
  const mostrarFoto = () => {
    document.getElementById('fotoPreviewWrap').innerHTML = `
      <div class="photo-preview"><span id="fotoPreviewImg"></span><button type="button" class="remove-photo" id="btnQuitarFoto">${ICONS.trash}</button></div>`;
    document.getElementById('fotoPreviewImg').replaceWith(crearImgFoto(fotoDataUrl));
    document.getElementById('btnQuitarFoto').onclick = () => { fotoDataUrl = null; document.getElementById('fotoPreviewWrap').innerHTML = ''; guardarBorrador(); };
  };
  if (prellenado) {
    document.getElementById('tMovDesc').value = prellenado.desc || '';
    document.getElementById('tMovMonto').value = prellenado.monto || '';
    if (prellenado.foto && esFotoSegura(prellenado.foto)) { fotoDataUrl = prellenado.foto; mostrarFoto(); }
  }
  activarFormulario({
    tieneDatos: () => !!(document.getElementById('tMovDesc') && (document.getElementById('tMovDesc').value.trim() || document.getElementById('tMovMonto').value || fotoDataUrl || document.querySelector('.recorte-editor'))),
    borrador: () => {
      const d = document.getElementById('tMovDesc'), m = document.getElementById('tMovMonto');
      if (!d) return null;
      if (!d.value.trim() && !m.value && !fotoDataUrl) return null;
      return { clase: 'tienda', tipo, desc: d.value, monto: m.value, foto: fotoDataUrl || undefined };
    },
  });
  ['tMovDesc', 'tMovMonto'].forEach(id => document.getElementById(id).addEventListener('input', () => guardarBorrador()));
  setTimeout(() => document.getElementById('tMovDesc').focus(), 50);
  document.getElementById('btnTomarFoto').onclick = () => {
    guardarBorrador({ camara: true }); // por si el teléfono reinicia la app mientras está la cámara
    document.getElementById('tMovFotoInput').click();
  };
  // Mientras se procesa la foto, Guardar queda desactivado: antes, si se tocaba rápido, la salida se
  // guardaba SIN la foto y la foto se perdía sin aviso.
  let procesandoFoto = false;
  const estadoFoto = (activo) => {
    procesandoFoto = activo;
    const bf = document.getElementById('btnTomarFoto'), bg = document.getElementById('confirmTMov');
    if (bf) { bf.disabled = activo; bf.innerHTML = activo ? 'Procesando foto…' : `${ICONS.camera} Tomar o elegir foto`; }
    if (bg) bg.disabled = activo;
  };
  document.getElementById('tMovFotoInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = ''; // para poder elegir la misma foto otra vez
    estadoFoto(true);
    let etapa = 'abrir';
    try {
      const img = await cargarImagen(file);
      etapa = 'recorte';
      const fuente = await editarRecorte(img); // recortar la factura (o usar la foto completa)
      if (!fuente) return;
      etapa = 'comprimir';
      fotoDataUrl = codificarFoto(fuente);
      if (!document.getElementById('fotoPreviewWrap')) return; // la ventana ya no está
      mostrarFoto();
      guardarBorrador();
    } catch (err) {
      reportarErrorFoto(err, file, etapa);
      avisoLargo(mensajeErrorFoto(err));
    } finally { estadoFoto(false); }
  });
  const clave = nuevaClaveEnvio();
  const botonT = document.getElementById('confirmTMov');
  botonT.onclick = () => procesandoFoto ? toast('Espera: se está procesando la foto.') : conBotonOcupado(botonT, async () => {
    const descripcion = document.getElementById('tMovDesc').value.trim();
    const monto = parseFloat(document.getElementById('tMovMonto').value);
    if (isNaN(monto) || monto <= 0) return;
    const datos = { ruta: `tienda:${tipo}`, texto: descripcion, monto };
    const claveUsada = claveParaEnvio(clave, datos);
    const estado = {};
    try {
      const { movimiento, balance, repetido } = await api('/tienda', { method: 'POST', estado, body: { tipo, descripcion, monto, foto: fotoDataUrl, clave: claveUsada } });
      quitarEnDuda(claveUsada); if (prellenado) quitarEnDuda(prellenado.notaClave);
      agregarMovTiendaLocal(movimiento, balance); // antes se volvía a descargar todo el mes en cada guardado
      await exitoEnBoton(botonT);
      closeModal(); renderTienda();
      resaltar(`#tiendaView [data-mov="${movimiento.id}"]`);
      if (repetido) avisoLargo('Ya estaba guardado: la conexión se cortó antes de confirmarlo. No se duplicó.');
      else toast(isEntrada ? 'Entrada registrada' : 'Salida registrada');
    } catch (e) {
      if (errorEnDuda(estado)) {
        anotarEnDuda(claveUsada, datos, `${isEntrada ? 'entrada' : 'salida'} de tienda de ${money(monto)}${descripcion ? ' "' + descripcion + '"' : ''}`,
          { clase: 'tienda', tipo, desc: descripcion, monto });
        avisoLargo(MSG_EN_DUDA);
      } else toast(typeof e === 'string' && e !== 'Error de red' ? e : 'No se pudo guardar el movimiento');
    }
  });
}
function confirmDeleteMovTienda(movId) {
  // Solo se pueden borrar los del último mes (el servidor manda "editable"; también lo revisa al borrar).
  const mov = TIENDA.movimientos.find(m => String(m.id) === String(movId));
  if (mov && mov.editable === false) { toast('Este movimiento tiene más de un mes: ya no se puede eliminar.'); return; }
  openConfirmModal('¿Eliminar este movimiento?', 'Esta acción no se puede deshacer y recalculará los saldos posteriores.', async () => {
    try {
      await api(`/tienda/${movId}`, { method: 'DELETE' });
      TIENDA = await api('/tienda');
      renderTienda();
      toast('Movimiento eliminado'); vibrar();
    } catch (e) {
      toast(typeof e === 'string' && e !== 'Error de red' ? e : 'No se pudo eliminar el movimiento');
      if (typeof e === 'string' && /ya no se puede|ya no existe/.test(e)) refrescarTiendaPronto();
    }
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
        <p class="desc" style="margin:-6px 0 14px;">Se genera una el día 1 de cada mes con el mes que terminó, con las fotos de facturas y un resumen. Se conservan los últimos 5 meses; antes de borrar una te avisamos para que la descargues.</p>
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
      if (btn.dataset.scope === 'tienda') setTimeout(revisarAvisosRespaldos, 4000);
    });
  });
}
function backupRowHtml(b, scope) {
  const kb = (b.size_bytes / 1024).toFixed(1);
  return `
    <div class="backup-row">
      <div class="backup-info">
        <div class="backup-date">${escapeHtml(b.nombre || fmtDateTimeShort(b.fecha_creacion))}</div>
        <div class="backup-meta">${kb} KB${b.vencido ? ' · <strong class="backup-aviso">Descárgala ya: debía borrarse</strong>' : b.por_borrar ? ` · <strong class="backup-aviso">Se borra el ${fmtFechaLarga(b.se_borra)}: descárgala</strong>` : ''}</div>
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
    const etiquetaRol = u => u.es_principal ? 'admin principal' : (u.rol === 'admin' ? 'admin' : 'usuario');
    const claseRol = u => u.es_principal ? 'principal' : (u.rol === 'admin' ? '' : 'usuario');
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
              <div class="acc-circ">${escapeHtml(initialOf(me.nombre))}</div>
              <div class="info">
                <div class="name">${escapeHtml(me.nombre)} <span class="rol-chip ${claseRol(me)}">${etiquetaRol(me)}</span></div>
                <div class="handle">${escapeHtml(EMPRESA ? idAcceso(me.usuario, EMPRESA.codigo) : me.usuario)}${me.email ? ' · ' + escapeHtml(me.email) : ''}</div>
              </div>
            </div>
            <div class="cuenta-acciones">
              ${me.es_principal ? `<button class="cuenta-btn" id="btnChangeOwnName">Cambiar nombre</button>` : ''}
              ${esAdmin ? `
                <button class="cuenta-btn" id="btnChangeOwnPass">Cambiar contraseña</button>
                <button class="cuenta-btn" id="btnChangeOwnEmail">${me.email ? 'Cambiar correo' : 'Agregar correo'}</button>
              ` : ''}
              <button class="cuenta-btn peligro" id="btnLogout">Cerrar sesión</button>
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
                    <div class="acc-circ">${escapeHtml(initialOf(u.nombre))}</div>
                    <div class="info">
                      <div class="name">${escapeHtml(u.nombre)} <span class="rol-chip ${claseRol(u)}">${etiquetaRol(u)}</span></div>
                      <div class="handle">${escapeHtml(EMPRESA ? idAcceso(u.usuario, EMPRESA.codigo) : u.usuario)}${u.email ? ' · ' + escapeHtml(u.email) : ''}</div>
                    </div>
                  </div>
                  ${u.es_principal ? `
                  <p class="handle" style="margin:10px 0 0;">Es quien creó la empresa: no se puede eliminar, y solo él puede cambiar su contraseña y su correo.</p>` : `
                  <div class="cuenta-acciones">
                    ${me.es_principal ? `<button class="cuenta-btn" data-rename="${u.id}" data-name="${escapeHtml(u.nombre)}" data-usuario="${escapeHtml(u.usuario)}">Cambiar nombre</button>` : ''}
                    <button class="cuenta-btn" data-changepass="${u.id}" data-name="${escapeHtml(u.nombre)}">Cambiar contraseña</button>
                    <button class="cuenta-btn" data-changeemail="${u.id}" data-email="${u.email ? escapeHtml(u.email) : ''}">${u.email ? 'Cambiar correo' : 'Agregar correo'}</button>
                    <button class="cuenta-btn peligro" data-deleteuser="${u.id}" data-name="${escapeHtml(u.nombre)}" >Eliminar</button>
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
          <p class="seg-label">Muñequito</p>
          <div class="seg" id="segMuneco">
            <button data-v="si">Activado</button><button data-v="no">Desactivado</button>
          </div>
          <p class="seg-nota" id="notaMuneco"></p>

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
      if (me.es_principal) {
        document.getElementById('btnChangeOwnName').onclick = () => openRenameModal(me.id, me.nombre, me.usuario, true);
        root.querySelectorAll('[data-rename]').forEach(b => {
          b.addEventListener('click', () => openRenameModal(b.dataset.rename, b.dataset.name, b.dataset.usuario, false));
        });
      }
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
  // Muñequito que juega sobre las cuentas (public/muneco.js); se guarda en este dispositivo.
  const M = window.KaabMuneco;
  const pintarMuneco = () => {
    if (!M) return;
    document.querySelectorAll('#segMuneco button').forEach(b => b.classList.toggle('on', (b.dataset.v === 'si') === M.activo()));
    const n = document.getElementById('notaMuneco');
    if (n) n.textContent = !M.activo() ? 'Desactivado en este dispositivo.'
      : (T.animacionesActivas() ? 'Un pequeño amigo que pasea y trepa por tus cuentas. No estorba: tocar una cuenta siempre la abre.'
        : 'Activado, pero no aparece porque las animaciones están apagadas en este dispositivo.');
  };
  document.querySelectorAll('#segMuneco button').forEach(b => b.addEventListener('click', () => { M && M.setActivo(b.dataset.v === 'si'); pintarMuneco(); }));
  pintarMuneco();
  document.querySelectorAll('#segTema button').forEach(b => b.addEventListener('click', () => { T.setTema(b.dataset.v); pintar(); }));
  document.querySelectorAll('#segAnim button').forEach(b => b.addEventListener('click', () => { T.setAnimaciones(b.dataset.v); pintar(); pintarMuneco(); }));
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
// Cambiar nombre (solo el admin principal). El usuario para entrar se vuelve a formar con el nombre.
// No cierra la sesión de nadie.
function openRenameModal(userId, nombreActual, usuarioActual, esPropio) {
  showModal(`
    <h3>Cambiar nombre</h3>
    <p class="desc">${esPropio ? 'Tu sesión' : 'Su sesión'} no se cierra. El usuario para entrar cambia junto con el nombre.</p>
    <div class="field"><label>Nombre</label><input id="renameNombre" type="text" maxlength="100" value="${escapeHtml(nombreActual)}">
      <p class="field-hint" id="renameVista"></p></div>
    <div class="modal-actions">
      <button class="btn-cancel" data-close>Cancelar</button>
      <button class="btn-confirm" id="confirmRename">Guardar</button>
    </div>
    <p class="login-error" id="renameErr"></p>
  `);
  const input = document.getElementById('renameNombre');
  const vista = document.getElementById('renameVista');
  const acc = u => EMPRESA ? idAcceso(u, EMPRESA.codigo) : u;
  const pintar = () => {
    const u = usuarioDesdeNombre(input.value);
    vista.innerHTML = !u ? 'El nombre debe tener letras o números.'
      : u === usuarioActual ? `Seguirá entrando con: <b>${escapeHtml(acc(u))}</b>`
      : `Antes entraba con ${escapeHtml(acc(usuarioActual))}. Desde ahora entrará con: <b>${escapeHtml(acc(u))}</b>`;
  };
  input.addEventListener('input', pintar);
  pintar();
  setTimeout(() => { input.focus(); input.select(); }, 50);
  document.getElementById('confirmRename').onclick = async () => {
    const nombre = input.value.trim();
    const usuario = usuarioDesdeNombre(nombre);
    const err = document.getElementById('renameErr');
    if (!nombre || !usuario) { err.textContent = 'Escribe un nombre con letras o números.'; return; }
    try {
      const u = await api(`/usuarios/${userId}/nombre`, { method: 'PATCH', body: { nombre, usuario } });
      if (esPropio && AUTH) {
        AUTH.nombre = u.nombre; AUTH.usuario = u.usuario;
        document.getElementById('avatarInitial').textContent = initialOf(u.nombre);
        document.getElementById('userLabel').textContent = u.nombre;
      }
      closeModal();
      renderUsersPage();
      toast(u.usuario !== usuarioActual ? `Listo. Ahora entra con ${acc(u.usuario)}` : 'Nombre actualizado');
    } catch (e) { err.textContent = typeof e === 'string' ? e : 'No se pudo cambiar el nombre.'; }
  };
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
function showModal(innerHtml, { center = false, clase = '' } = {}) {
  formularioActivo = null;
  const root = document.getElementById('modalRoot');
  root.innerHTML = `<div class="modal-overlay ${center ? 'center' : ''}" id="overlay"><div class="modal-card ${clase}">${innerHtml}</div></div>`;
  root.querySelector('#overlay').addEventListener('click', (e) => {
    if (e.target.id !== 'overlay') return;
    if (formularioActivo && formularioActivo.tieneDatos()) return; // con datos escritos, tocar fuera no la cierra
    closeModal();
  });
  root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModal));
}
function closeModal() {
  if (formularioActivo) { formularioActivo = null; borrarBorrador(); } // Guardar o Cancelar: ya no hace falta el borrador
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
// Resumen: Te deben · Debes · Neto, y debajo los 3 PDF.
function abrirResumen() {
  const { teDeben, debes, neto } = totalesCuentas();
  showModal(`
    <h3>Resumen</h3>
    <div class="resumen-hoja">
      <div class="fila"><span>Te deben</span><b class="pos">${money(teDeben)}</b></div>
      <div class="fila"><span>Debes</span><b class="neg">${money(debes)}</b></div>
      <div class="fila neto"><span>Neto</span><b class="${neto > 0 ? 'pos' : neto < 0 ? 'neg' : 'cero'}">${textoNeto(neto)}</b></div>
      <p class="resumen-nota">${neto > 0 ? 'Te deben más de lo que debes.' : neto < 0 ? 'Debes más de lo que te deben.' : 'Lo que te deben y lo que debes están parejos.'}</p>
    </div>
    <p class="seg-label" style="margin-top:6px;">Generar PDF</p>
    <div class="pdf-opciones">
      <button class="pdf-opcion" data-pdf="cobrar"><span class="pdf-op-icono cobrar">${ICONS.arrowDown}</span>
        <span class="pdf-op-texto"><b>Lo que te deben</b><small>Cuentas por cobrar · <span class="nw">${money(teDeben)}</span></small></span></button>
      <button class="pdf-opcion" data-pdf="pagar"><span class="pdf-op-icono pagar">${ICONS.arrowUp}</span>
        <span class="pdf-op-texto"><b>Lo que debes</b><small>Cuentas por pagar · <span class="nw">${money(debes)}</span></small></span></button>
      <button class="pdf-opcion" data-pdf="todo"><span class="pdf-op-icono todo">${ICONS.pdf}</span>
        <span class="pdf-op-texto"><b>Reporte completo</b><small>Las dos secciones y el neto <span class="nw">(${textoNeto(neto)})</span></small></span></button>
    </div>
    <div class="modal-actions"><button class="btn-cancel" data-close>Cerrar</button></div>
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
