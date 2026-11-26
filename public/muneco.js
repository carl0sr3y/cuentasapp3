// Muñequito decorativo que juega sobre las tarjetas de cuentas (Por cobrar / Por pagar):
// camina, se sienta, saluda, salta entre tarjetas y lanza un lazo para trepar a la de arriba.
// No hace nada útil a propósito :)
// - Nunca estorba: no recibe toques (pointer-events: none) y va por debajo de la barra superior,
//   las ventanas y las pantallas de detalle.
// - Solo aparece si las animaciones están activas (public/tema.js) y si no se desactivó en
//   Perfil → Apariencia (se guarda por dispositivo).
// - Va "pegado" a su tarjeta por su data-id: si la lista se redibuja o la cuenta cambia de lugar,
//   él viaja con ella. Si su tarjeta sale de la pantalla, cae sobre otra visible.
(function () {
  var CLAVE = 'kaab_muneco';
  function preferencia() { try { return localStorage.getItem(CLAVE) !== 'no'; } catch (e) { return true; } }
  function setPreferencia(v) { try { localStorage.setItem(CLAVE, v ? 'si' : 'no'); } catch (e) {} revisarPronto(); }
  // celebrar(): se pide al registrar un abono. Como el muñequito solo se ve en la lista de cuentas, el
  // festejo queda pendiente un minuto y lo hace en cuanto vuelve a verse (o de inmediato si ya se ve).
  var fiesta = 0;
  function celebrar() { fiesta = Date.now(); }
  window.KaabMuneco = { activo: preferencia, setActivo: setPreferencia, celebrar: celebrar };
  // De noche (9 p. m. a 6 a. m., hora del teléfono) casi siempre está dormido.
  function esDeNoche() { var h = new Date().getHours(); return h >= 21 || h < 6; }

  var ANCHO = 28, ALTO = 36;
  var SVG =
    '<svg class="m-svg" viewBox="0 0 28 36" width="28" height="36">' +
      '<g class="m-todo">' +
        // alitas (guiño a "Kaab", abeja en maya)
        '<ellipse class="m-ala" cx="8" cy="20" rx="4" ry="2.6" transform="rotate(-25 8 20)"/>' +
        '<ellipse class="m-ala" cx="20" cy="20" rx="4" ry="2.6" transform="rotate(25 20 20)"/>' +
        // piernas
        '<g class="m-pi"><line x1="12" y1="27" x2="11" y2="34"/></g>' +
        '<g class="m-pd"><line x1="16" y1="27" x2="17" y2="34"/></g>' +
        // cuerpo a rayas
        '<rect x="9" y="17" width="10" height="11" rx="4" fill="#F2B35A"/>' +
        '<rect x="9" y="20.5" width="10" height="2.2" fill="#1F2023"/>' +
        '<rect x="9" y="24.5" width="10" height="2" fill="#1F2023"/>' +
        // brazos
        '<g class="m-bi"><line x1="10" y1="19" x2="7" y2="25"/></g>' +
        '<g class="m-bd"><line x1="18" y1="19" x2="21" y2="25"/></g>' +
        // cabeza y antenas
        '<line class="m-trazo" x1="11" y1="5" x2="9" y2="1.5"/><circle cx="9" cy="1.5" r="1.3" fill="#F2B35A"/>' +
        '<line class="m-trazo" x1="17" y1="5" x2="19" y2="1.5"/><circle cx="19" cy="1.5" r="1.3" fill="#F2B35A"/>' +
        '<circle class="m-cabeza" cx="14" cy="10.5" r="6.5"/>' +
        '<circle cx="12" cy="10" r="1" fill="#1F2023"/><circle cx="16.5" cy="10" r="1" fill="#1F2023"/>' +
        '<path d="M12.3 13 Q14.2 14.6 16.2 13" stroke="#1F2023" stroke-width="1" fill="none" stroke-linecap="round"/>' +
        // ojitos cerrados (solo cuando duerme)
        '<g class="m-dormido"><circle cx="14" cy="10.5" r="5.4" fill="#FFD58A"/>' +
          '<path d="M10.8 10.2 Q12 11.3 13.2 10.2 M15.3 10.2 Q16.5 11.3 17.7 10.2" stroke="#1F2023" stroke-width="1" fill="none" stroke-linecap="round"/></g>' +
      '</g>' +
      '<text class="m-z" x="22" y="6">z</text><text class="m-z m-z2" x="25" y="1">z</text>' +
    '</svg>';

  var capa, el, cuerda, lazo, iniciado = false;
  function iniciar() {
    if (iniciado) return;
    iniciado = true;
    capa = document.createElement('div');
    capa.className = 'muneco-capa';
    capa.setAttribute('aria-hidden', 'true');
    capa.innerHTML =
      '<svg class="muneco-cuerda"><path fill="none"/><circle r="4" fill="none"/></svg>' +
      '<div class="muneco">' + SVG + '</div>';
    document.body.appendChild(capa);
    el = capa.querySelector('.muneco');
    cuerda = capa.querySelector('.muneco-cuerda path');
    lazo = capa.querySelector('.muneco-cuerda circle');
  }

  // ---------- ¿Se puede mostrar ahora? ----------
  function puedeVerse() {
    if (!preferencia()) return false;
    if (!(window.CuentasTema && window.CuentasTema.animacionesActivas())) return false;
    var main = document.getElementById('mainScreen');
    if (!main || main.classList.contains('hidden')) return false;
    var vista = document.getElementById('deudasView');
    if (!vista || vista.classList.contains('hidden') || vista.classList.contains('buscando')) return false;
    if (document.body.classList.contains('busqueda-activa')) return false;
    var pagina = document.getElementById('pageRoot');
    if (pagina && pagina.firstElementChild) return false; // detalle de cuenta, perfil, etc.
    return true;
  }

  // ---------- Tarjetas ----------
  function techo() {
    var barra = document.querySelector('header.topbar');
    return (barra ? barra.getBoundingClientRect().bottom : 0) + ALTO + 4;
  }
  function tarjeta(id) { return id == null ? null : document.querySelector('#accountListWrap .account-card[data-id="' + id + '"]'); }
  // Límite de abajo: el menú flotante de pestañas (si se ve) o el borde de la pantalla.
  function piso() {
    var menu = document.querySelector('.tabbar');
    var r = menu ? menu.getBoundingClientRect() : null; // si está oculto, mide 0 de alto
    return (r && r.height ? r.top : window.innerHeight) - 8;
  }
  function visible(r) { return r && r.width > 0 && r.top > techo() && r.top < piso(); }
  function tarjetasVisibles() {
    var out = [];
    var lista = document.querySelectorAll('#accountListWrap .account-card');
    for (var i = 1; i < lista.length; i++) { // desde la 2.ª: sobre la 1.ª están los botones Crear/Eliminar
      var r = lista[i].getBoundingClientRect();
      if (visible(r)) out.push({ id: lista[i].dataset.id, r: r });
    }
    return out;
  }
  // ¿Es la primera tarjeta de la lista? (encima tiene los botones, no otra tarjeta)
  function esPrimera(id) {
    var primera = document.querySelector('#accountListWrap .account-card');
    return !!primera && primera.dataset.id === String(id);
  }
  // Punto donde se paran los pies: borde superior de la tarjeta, en la fracción f de su ancho.
  function punto(id, f) {
    var t = tarjeta(id);
    if (!t) return null;
    var r = t.getBoundingClientRect();
    return { x: r.left + 18 + f * (r.width - 36), y: r.top, r: r };
  }

  // ---------- Estado ----------
  var s = null;        // { modo, id, f, dir, t, dur, ... }
  var ahoraMs = 0;
  function azar(a, b) { return a + Math.random() * (b - a); }
  function elegir(lista) { return lista[Math.floor(Math.random() * lista.length)]; }
  // Solo juega en la mitad derecha de las tarjetas: ahí la parte baja de la tarjeta de arriba está
  // vacía (el nombre y el monto van a la izquierda), así nunca los tapa.
  var ZONA = [0.55, 0.95];
  function zona() { return azar(ZONA[0], ZONA[1]); }
  function suave(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }

  function nuevo(modo, extra) {
    s = Object.assign({ modo: modo, t: ahoraMs }, s ? { id: s.id, f: s.f, dir: s.dir } : {}, extra || {});
    el.className = 'muneco m-' + (s.clase || modo) + (s.dir < 0 ? ' izq' : '');
    if (modo !== 'lanza' && modo !== 'trepa') { cuerda.setAttribute('d', ''); lazo.setAttribute('r', '0'); }
  }

  function aparecer() {
    var vis = tarjetasVisibles();
    if (!vis.length) { s = null; el.style.display = 'none'; return; }
    var c = elegir(vis);
    s = null;
    // Cae desde un poco arriba de su tarjeta (no desde lo alto, para no atravesar el resumen y los botones)
    nuevo('cae', { id: c.id, f: zona(), dir: Math.random() < 0.5 ? 1 : -1, dur: 500, desdeY: Math.max(techo() - ALTO, c.r.top - 70), clase: 'salta' });
  }

  function siguiente() {
    if (esDeNoche() && Math.random() < 0.85) { nuevo('quieto', { dur: azar(6000, 12000), clase: 'duerme' }); return; }
    var actual = punto(s.id, s.f);
    var vis = tarjetasVisibles().filter(function (c) { return c.id !== s.id; });
    var arriba = actual ? vis.filter(function (c) { return c.r.top < actual.r.top; }) : [];
    var abajo = actual ? vis.filter(function (c) { return c.r.top > actual.r.top; }) : [];
    var r = Math.random();
    if (r < 0.32 && arriba.length) {
      // Lazo a una de las tarjetas de arriba (preferimos la más cercana)
      arriba.sort(function (a, b) { return b.r.top - a.r.top; });
      var destino = arriba[Math.random() < 0.7 ? 0 : Math.min(1, arriba.length - 1)];
      var fa = zona();
      var pd = punto(destino.id, fa);
      nuevo('lanza', { destino: destino.id, fa: fa, dur: 900, dir: pd && actual && pd.x < actual.x ? -1 : 1 });
    } else if (r < 0.47 && (abajo.length || arriba.length)) {
      var lista = abajo.length && (Math.random() < 0.7 || !arriba.length) ? abajo : arriba;
      lista.sort(function (a, b) { return Math.abs(a.r.top - actual.r.top) - Math.abs(b.r.top - actual.r.top); });
      var d = lista[0], fd = zona(), p2 = punto(d.id, fd);
      nuevo('salta', { destino: d.id, fa: fd, dur: 700, dir: p2 && p2.x < actual.x ? -1 : 1 });
    } else if (r < 0.8) {
      var f1 = Math.min(ZONA[1], Math.max(ZONA[0], s.f + azar(-0.25, 0.25)));
      var ancho = actual ? actual.r.width - 36 : 300;
      nuevo('camina', { desde: s.f, hasta: f1, dur: Math.max(500, Math.abs(f1 - s.f) * ancho / 32 * 1000), dir: f1 < s.f ? -1 : 1 });
    } else {
      nuevo('quieto', { dur: azar(1500, 3500), clase: elegir(['quieto', 'quieto', 'saluda', 'sentado']) });
    }
  }

  function dibujar(x, y) {
    el.style.display = 'block';
    el.style.transform = 'translate(' + Math.round(x - ANCHO / 2) + 'px,' + Math.round(y - ALTO) + 'px)';
  }
  function dibujarCuerda(manoX, manoY, finX, finY, conLazo) {
    var mx = (manoX + finX) / 2, my = Math.max(manoY, finY) + 8; // un poco de comba
    cuerda.setAttribute('d', 'M' + manoX + ' ' + manoY + ' Q' + mx + ' ' + my + ' ' + finX + ' ' + finY);
    lazo.setAttribute('cx', finX); lazo.setAttribute('cy', finY);
    lazo.setAttribute('r', conLazo ? '4' : '0');
  }

  function paso() {
    if (!s) { aparecer(); if (!s) return; }
    var p = Math.min(1, (ahoraMs - s.t) / s.dur);
    var actual = punto(s.id, s.f);
    // Si su tarjeta desapareció o salió de la pantalla, cae en otra.
    // También si su cuenta pasó a ser la primera de la lista (p. ej. tuvo un movimiento y subió).
    if (!actual || (!visible(actual.r) && s.modo !== 'trepa' && s.modo !== 'salta') ||
        (esPrimera(s.id) && s.modo !== 'trepa' && s.modo !== 'salta')) { aparecer(); return; }

    // Festejo pendiente (abono registrado): en cuanto está parado sobre su tarjeta, da saltitos.
    if (fiesta && (s.modo === 'quieto' || s.modo === 'camina')) {
      var vigente = Date.now() - fiesta < 60000;
      fiesta = 0;
      if (vigente) { nuevo('festeja', { dur: 1400, clase: 'festeja' }); }
    }

    if (s.modo === 'festeja') {
      // Tres saltitos en su lugar con los brazos arriba.
      dibujar(actual.x, actual.y - Math.abs(Math.sin(Math.PI * 3 * p)) * 16);
      if (p >= 1) nuevo('quieto', { dur: 900, clase: 'saluda' });
    } else if (s.modo === 'cae') {
      var dest = punto(s.id, s.f);
      var y = s.desdeY + (dest.y - s.desdeY) * (p * p); // cae acelerando
      dibujar(dest.x, y);
      if (p >= 1) nuevo('quieto', { dur: 700, clase: 'quieto' });
    } else if (s.modo === 'camina') {
      s.f = s.desde + (s.hasta - s.desde) * p;
      var pc = punto(s.id, s.f); dibujar(pc.x, pc.y);
      if (p >= 1) siguiente();
    } else if (s.modo === 'quieto') {
      dibujar(actual.x, actual.y);
      if (p >= 1) siguiente();
    } else if (s.modo === 'lanza') {
      // Gira el lazo y lo lanza: la punta viaja en arco hasta el borde de la tarjeta de arriba.
      var ancla = punto(s.destino, s.fa);
      dibujar(actual.x, actual.y);
      if (!ancla || !visible(ancla.r)) { siguiente(); return; }
      var mano = { x: actual.x + 6 * (s.dir || 1), y: actual.y - 26 };
      var q = Math.max(0, (p - 0.35) / 0.65); // primero gira, luego lanza
      if (q > 0) {
        var cx = (mano.x + ancla.x) / 2, cy = Math.min(mano.y, ancla.y) - 50;
        var tx = (1 - q) * (1 - q) * mano.x + 2 * (1 - q) * q * cx + q * q * ancla.x;
        var ty = (1 - q) * (1 - q) * mano.y + 2 * (1 - q) * q * cy + q * q * ancla.y;
        dibujarCuerda(mano.x, mano.y, tx, ty, true);
      }
      if (p >= 1) {
        var distancia = Math.hypot(ancla.x - actual.x, ancla.y - actual.y);
        nuevo('trepa', { desdeId: s.id, desdeF: s.f, dur: Math.max(900, distancia / 55 * 1000) });
      }
    } else if (s.modo === 'trepa') {
      // Sube colgado de la cuerda; al llegar se impulsa sobre la tarjeta.
      var a = punto(s.destino, s.fa), o = punto(s.desdeId, s.desdeF);
      if (!a || !o) { aparecer(); return; }
      var k = suave(p);
      var manoX = o.x + (a.x - o.x) * k, manoY = (o.y - 26) + (a.y - (o.y - 26)) * k;
      var subir = Math.max(0, (p - 0.85) / 0.15);                 // al final, se trepa encima
      dibujar(manoX, manoY + 28 - 28 * subir);
      dibujarCuerda(manoX, manoY, a.x, a.y, true);
      if (p >= 1) { s.id = s.destino; s.f = s.fa; nuevo('quieto', { dur: azar(800, 1600), clase: Math.random() < 0.5 ? 'saluda' : 'quieto' }); }
    } else if (s.modo === 'salta') {
      var dj = punto(s.destino, s.fa);
      if (!dj) { siguiente(); return; }
      var x = actual.x + (dj.x - actual.x) * p;
      var yb = actual.y + (dj.y - actual.y) * p - Math.sin(Math.PI * p) * 45;
      dibujar(x, yb);
      if (p >= 1) { s.id = s.destino; s.f = s.fa; nuevo('quieto', { dur: azar(600, 1400), clase: 'quieto' }); }
    }
  }

  // ---------- Bucle (solo corre mientras se ve; si no, revisa cada medio segundo) ----------
  var raf = null, espera = null;
  function cuadro(t) {
    raf = null;
    if (!puedeVerse()) { ocultar(); revisarPronto(); return; }
    ahoraMs = t;
    paso();
    raf = requestAnimationFrame(cuadro);
  }
  function ocultar() {
    if (!el) return;
    el.style.display = 'none';
    cuerda.setAttribute('d', ''); lazo.setAttribute('r', '0');
    s = null; // al volver, cae desde arriba
  }
  function revisarPronto() {
    clearTimeout(espera);
    espera = setTimeout(function () {
      if (puedeVerse()) { iniciar(); if (!raf) raf = requestAnimationFrame(cuadro); }
      else { ocultar(); revisarPronto(); }
    }, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', revisarPronto);
  else revisarPronto();
})();
