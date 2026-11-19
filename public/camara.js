/* ============================================================
   CÁMARA DENTRO DE KAAB (sin salir a la app de cámara del teléfono)
   - KaabCamara.escanearQR({ validar })  → texto del QR, o null si se cancela.
   - KaabCamara.tomarFoto()              → <canvas> con la foto, 'galeria' si eligió la galería,
                                            o null si se cancela.
   Si el teléfono no deja usar la cámara, las dos lanzan un Error con .codigo:
   'no-disponible' (navegador sin cámara para páginas), 'permiso' (se negó el permiso) o 'camara'
   (otra app la está usando, no hay cámara, etc.). Quien llama decide el plan B.
   Mientras la cámara está abierta la app NO pasa a segundo plano, así que el teléfono no la reinicia
   (antes pasaba al tomar la foto de la factura con la cámara del sistema).
   El QR se lee con el lector del propio navegador (BarcodeDetector: Chrome en Android) o, si no lo
   trae (iPhone, Firefox), con public/vendor/jsQR.js, que se carga solo cuando hace falta.
   ============================================================ */
(function () {
  let actual = null; // { cerrar(valor), estadoHistorial }

  function disponible() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && window.isSecureContext !== false;
  }
  function error(codigo, mensaje) { const e = new Error(mensaje); e.codigo = codigo; return e; }

  async function abrirCamara(alta) {
    if (!disponible()) throw error('no-disponible', 'Este navegador no permite usar la cámara dentro de la app.');
    const video = { facingMode: { ideal: 'environment' } };
    // Para la factura se pide la mejor resolución que dé la cámara; para el QR basta con poca.
    if (alta) { video.width = { ideal: 3840 }; video.height = { ideal: 2160 }; }
    else { video.width = { ideal: 1280 }; video.height = { ideal: 720 }; }
    try {
      return await navigator.mediaDevices.getUserMedia({ video, audio: false });
    } catch (e) {
      if (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) throw error('permiso', 'No hay permiso para usar la cámara.');
      // Algunas cámaras no aceptan la resolución pedida: se intenta sin condiciones.
      try { return await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); }
      catch (e2) {
        if (e2 && (e2.name === 'NotAllowedError' || e2.name === 'SecurityError')) throw error('permiso', 'No hay permiso para usar la cámara.');
        throw error('camara', 'No se pudo abrir la cámara.');
      }
    }
  }

  // Pantalla completa con el video, un marco guía y los botones.
  function pantalla({ titulo, ayuda, modo, conGaleria }) {
    const v = document.createElement('div');
    v.className = 'camara camara-' + modo;
    v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', titulo);
    v.innerHTML = `
      <video class="camara-video" playsinline muted autoplay></video>
      <div class="camara-marco"><span></span><span></span><span></span><span></span></div>
      <div class="visor-barra"><span class="visor-titulo"></span>
        <button class="visor-btn camara-linterna hidden" type="button" aria-label="Linterna" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></button>
        <button class="visor-btn visor-cerrar" type="button" aria-label="Cerrar">×</button></div>
      <p class="camara-ayuda"></p>
      <div class="camara-acciones">
        ${conGaleria ? '<button class="camara-galeria" type="button">Galería</button>' : '<span></span>'}
        ${modo === 'foto' ? '<button class="camara-disparador" type="button" aria-label="Tomar foto"><span></span></button>' : '<span></span>'}
        <span></span>
      </div>`;
    v.querySelector('.visor-titulo').textContent = titulo;
    v.querySelector('.camara-ayuda').textContent = ayuda;
    document.body.appendChild(v);
    return v;
  }

  // Abre la cámara y la pantalla. tarea(video, v, terminar) hace lo propio (leer QR o tomar foto).
  async function sesion({ titulo, ayuda, modo, alta, conGaleria }, tarea) {
    if (actual) actual.cerrar(null);
    const stream = await abrirCamara(alta);
    const v = pantalla({ titulo, ayuda, modo, conGaleria });
    const video = v.querySelector('.camara-video');
    video.srcObject = stream;
    const pista = stream.getVideoTracks()[0];
    return new Promise(resolve => {
      let terminado = false;
      const terminar = (valor) => {
        if (terminado) return;
        terminado = true;
        actual = null;
        document.removeEventListener('visibilitychange', alOcultar);
        stream.getTracks().forEach(t => { try { t.stop(); } catch (e) {} }); // apaga la cámara (y su luz)
        video.srcObject = null;
        v.remove();
        resolve(valor);
      };
      // Si la persona sale de la app, se apaga la cámara (no debe quedar encendida en segundo plano).
      const alOcultar = () => { if (document.visibilityState === 'hidden') terminar(null); };
      document.addEventListener('visibilitychange', alOcultar);
      actual = { cerrar: terminar, estadoHistorial: history.state };
      v.querySelector('.visor-cerrar').onclick = () => terminar(null);
      const gal = v.querySelector('.camara-galeria');
      if (gal) gal.onclick = () => terminar('galeria');
      // Linterna, si la cámara la tiene (útil para facturas en lugares oscuros).
      try {
        const cap = pista && pista.getCapabilities ? pista.getCapabilities() : {};
        if (cap.torch) {
          const b = v.querySelector('.camara-linterna');
          b.classList.remove('hidden');
          let on = false;
          b.onclick = async () => {
            on = !on;
            try { await pista.applyConstraints({ advanced: [{ torch: on }] }); b.setAttribute('aria-pressed', String(on)); b.classList.toggle('on', on); }
            catch (e) { on = !on; }
          };
        }
      } catch (e) { /* sin linterna */ }
      video.play().catch(() => {});
      tarea({ video, v, pista, terminar, activa: () => !terminado });
    });
  }

  // ---------- Leer un código QR ----------
  let cargaJsQR = null;
  function cargarJsQR() {
    if (window.jsQR) return Promise.resolve(window.jsQR);
    if (!cargaJsQR) {
      cargaJsQR = new Promise((ok, no) => {
        const s = document.createElement('script');
        s.src = '/vendor/jsQR.js';
        s.onload = () => (window.jsQR ? ok(window.jsQR) : no(new Error('jsQR')));
        s.onerror = () => { cargaJsQR = null; no(new Error('jsQR')); };
        document.head.appendChild(s);
      });
    }
    return cargaJsQR;
  }
  async function lectorQR() {
    try {
      if ('BarcodeDetector' in window) {
        const formatos = window.BarcodeDetector.getSupportedFormats ? await window.BarcodeDetector.getSupportedFormats() : ['qr_code'];
        if (formatos.includes('qr_code')) {
          const d = new window.BarcodeDetector({ formats: ['qr_code'] });
          return async (video) => { const r = await d.detect(video); return r && r[0] ? r[0].rawValue : null; };
        }
      }
    } catch (e) { /* se usa jsQR */ }
    const jsQR = await cargarJsQR();
    const c = document.createElement('canvas');
    const cx = c.getContext('2d', { willReadFrequently: true });
    return async (video) => {
      const w0 = video.videoWidth, h0 = video.videoHeight;
      if (!w0 || !h0) return null;
      const e = Math.min(1, 720 / Math.max(w0, h0)); // más pequeño = más rápido; el QR sigue leyéndose bien
      c.width = Math.round(w0 * e); c.height = Math.round(h0 * e);
      cx.drawImage(video, 0, 0, c.width, c.height);
      const r = jsQR(cx.getImageData(0, 0, c.width, c.height).data, c.width, c.height, { inversionAttempts: 'dontInvert' });
      return r ? r.data : null;
    };
  }

  // validar(texto) → null si sirve, o un mensaje para mostrar (y se sigue buscando).
  async function escanearQR({ titulo = 'Escanear código QR', ayuda = 'Apunta al código QR', validar = () => null } = {}) {
    const leer = await lectorQR().catch(() => null);
    if (!leer) throw error('camara', 'No se pudo preparar el lector de códigos.');
    return sesion({ titulo, ayuda, modo: 'qr', alta: false }, ({ v, video, terminar, activa }) => {
      const textoAyuda = v.querySelector('.camara-ayuda');
      let ultimoMalo = '', avisoT = null;
      const vuelta = async () => {
        if (!activa()) return;
        let texto = null;
        try { if (video.readyState >= 2) texto = await leer(video); } catch (e) { texto = null; }
        if (!activa()) return;
        if (texto) {
          const problema = validar(texto);
          if (!problema) { if (navigator.vibrate) try { navigator.vibrate(30); } catch (e) {} terminar(texto); return; }
          if (texto !== ultimoMalo) {
            ultimoMalo = texto;
            textoAyuda.textContent = problema; textoAyuda.classList.add('aviso');
            clearTimeout(avisoT);
            avisoT = setTimeout(() => { ultimoMalo = ''; if (activa()) { textoAyuda.textContent = ayuda; textoAyuda.classList.remove('aviso'); } }, 2500);
          }
        }
        setTimeout(vuelta, 200);
      };
      setTimeout(vuelta, 300);
    });
  }

  // ---------- Tomar una foto ----------
  function cuadroDelVideo(video) {
    const c = document.createElement('canvas');
    c.width = video.videoWidth; c.height = video.videoHeight;
    c.getContext('2d').drawImage(video, 0, 0);
    return c;
  }
  async function tomarFoto({ titulo = 'Foto de la factura', ayuda = 'Pon la factura dentro del recuadro y toca el botón' } = {}) {
    return sesion({ titulo, ayuda, modo: 'foto', alta: true, conGaleria: true }, ({ v, video, pista, terminar, activa }) => {
      const boton = v.querySelector('.camara-disparador');
      boton.onclick = async () => {
        if (boton.disabled || !video.videoWidth) return;
        boton.disabled = true;
        v.classList.add('destello');
        let canvas = null;
        // La foto "de verdad" de la cámara (más nítida que el video) si el navegador lo permite (Chrome
        // en Android). Si tarda o falla, se usa el cuadro del video, que siempre funciona.
        try {
          if (window.ImageCapture && pista) {
            const blob = await Promise.race([new window.ImageCapture(pista).takePhoto(), new Promise((_, no) => setTimeout(() => no(new Error('tiempo')), 3500))]);
            const bmp = await createImageBitmap(blob);
            canvas = document.createElement('canvas');
            canvas.width = bmp.width; canvas.height = bmp.height;
            canvas.getContext('2d').drawImage(bmp, 0, 0);
            if (bmp.close) bmp.close();
          }
        } catch (e) { canvas = null; }
        if (!activa()) return;
        if (!canvas) canvas = cuadroDelVideo(video);
        terminar(canvas);
      };
    });
  }

  window.KaabCamara = {
    disponible,
    escanearQR,
    tomarFoto,
    abierta: () => !!actual,
    estadoAlAbrir: () => (actual ? actual.estadoHistorial : null),
    cancelar: () => { if (actual) actual.cerrar(null); },
  };
})();
