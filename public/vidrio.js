// "Liquid glass" con lupa en las orillas: lo que pasa por detrás se dobla al llegar al borde del vidrio
// (sensación de volumen) y en el filo se separa un poquito en colores (arcoíris finito).
// Se aplica al menú de abajo (.tabbar), a las ventanas flotantes (.modal-card) y a las tarjetas.
// Usa un filtro SVG en backdrop-filter, que hoy solo dibuja Chrome/Android. En los demás navegadores
// (iPhone, Firefox) y con animaciones apagadas (teléfonos modestos) queda el vidrio normal del CSS.
//
// Ventanas: el centro queda borroso y con un velo claro (para leer bien lo que se escribe) y solo la
// orilla deja ver lo de atrás doblado. Todo eso lo hace el mismo filtro con una "máscara" del centro.
//
// Luz: una luz que no se ve (sin fuente en pantalla) pega en la orilla curva del vidrio y la hace brillar
// del lado de donde viene, con el brillo separado en colores en las puntas (arcoíris). La dirección
// sigue al giroscopio del teléfono (o al mouse en computadora). El brillo se calcula como imagen (una
// por tamaño de pieza) y solo cuando la luz cambia de dirección; el filtro del vidrio no se toca.
(function () {
  'use strict';
  // Solo navegadores basados en Chromium (userAgentData no existe en Safari/iPhone ni en Firefox).
  if (!navigator.userAgentData || !window.CSS || !CSS.supports('backdrop-filter', 'url(#a)')) return;
  if (!window.ResizeObserver || !window.MutationObserver) return;

  var NS = 'http://www.w3.org/2000/svg';
  var ORILLA = 18;   // ancho (px) de la orilla que dobla la imagen
  var FUERZA = 34;   // cuánto se dobla (px) en el filo
  // Arcoíris: cada color se dobla un poquito distinto, como la luz en el filo de un vidrio.
  var COLORES = [['r', 1, '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'],
                 ['g', 1.07, '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'],
                 ['b', 1.14, '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0']];

  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  document.body.appendChild(svg);

  function nodo(tipo, attrs, padre) {
    var n = document.createElementNS(NS, tipo);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(n);
    return n;
  }

  // Para cada punto de un rectángulo redondeado (w×h, esquinas de radio r): qué tan cerca está del filo
  // (0 = lejos, 1 = en el filo) y hacia dónde queda el filo más cercano.
  function orilla(x, y, w, h, r) {
    var cx = Math.min(Math.max(x, r), w - r), cy = Math.min(Math.max(y, r), h - r);
    var vx, vy, d;
    if (cx !== x && cy !== y) {               // en una esquina redondeada
      vx = x - cx; vy = y - cy;
      var l = Math.sqrt(vx * vx + vy * vy) || 1;
      d = r - l; vx /= l; vy /= l;
    } else {                                   // en un lado recto
      var izq = x, der = w - x, arr = y, aba = h - y, m = Math.min(izq, der, arr, aba);
      d = m;
      vx = m === izq ? -1 : m === der ? 1 : 0;
      vy = vx ? 0 : (m === arr ? -1 : 1);
    }
    var t = 1 - d / ORILLA; if (t < 0) t = 0; if (t > 1) t = 1;
    return { t: t, vx: vx, vy: vy };
  }

  // Mapa de desplazamiento (cada punto de la orilla toma la imagen de un poco más adentro) y, si se pide,
  // máscara del centro (opaca adentro, se desvanece hacia la orilla).
  function dibujar(w, h, r, conMascara) {
    var c1 = document.createElement('canvas'); c1.width = w; c1.height = h;
    var g1 = c1.getContext('2d'), im1 = g1.createImageData(w, h), d1 = im1.data;
    var c2, g2, im2, d2;
    if (conMascara) { c2 = document.createElement('canvas'); c2.width = w; c2.height = h; g2 = c2.getContext('2d'); im2 = g2.createImageData(w, h); d2 = im2.data; }
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var o = orilla(x + 0.5, y + 0.5, w, h, r), m = o.t * o.t, i = (y * w + x) * 4;
        d1[i] = 128 - Math.round(o.vx * m * 127);
        d1[i + 1] = 128 - Math.round(o.vy * m * 127);
        d1[i + 2] = 128; d1[i + 3] = 255;
        if (conMascara) { d2[i] = d2[i + 1] = d2[i + 2] = 255; d2[i + 3] = Math.round(255 * Math.min(1, (1 - o.t) * 1.6)); }
      }
    }
    g1.putImageData(im1, 0, 0);
    if (conMascara) g2.putImageData(im2, 0, 0);
    return { mapa: c1.toDataURL('image/png'), mascara: conMascara ? c2.toDataURL('image/png') : null };
  }

  // Arma el filtro de un elemento. conCentro = ventana: centro borroso con velo, orilla con lupa.
  var cuenta = 0;
  function crearFiltro(conCentro) {
    var id = 'vidrioLiquido' + (++cuenta);
    var f = nodo('filter', { id: id, filterUnits: 'userSpaceOnUse', primitiveUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB' }, svg);
    var mapa = nodo('feImage', { result: 'mapa', preserveAspectRatio: 'none' }, f);
    COLORES.forEach(function (c) {
      nodo('feDisplacementMap', { in: 'SourceGraphic', in2: 'mapa', scale: String(Math.round(FUERZA * c[1])),
        xChannelSelector: 'R', yChannelSelector: 'G', result: 'd' + c[0] }, f);
      nodo('feColorMatrix', { in: 'd' + c[0], type: 'matrix', values: c[2], result: c[0] }, f);
    });
    nodo('feBlend', { in: 'r', in2: 'g', mode: 'screen', result: 'rg' }, f);
    var mascara = null;
    if (!conCentro) {
      nodo('feBlend', { in: 'rg', in2: 'b', mode: 'screen', result: 'vidrio' }, f);
    } else {
      nodo('feBlend', { in: 'rg', in2: 'b', mode: 'screen', result: 'lente' }, f);
      // Orilla: la lupa con un velo muy leve. Centro: borroso con el velo de la ventana (color en el CSS).
      nodo('feFlood', { class: 'vidrio-velo-orilla', result: 'veloOrilla' }, f);
      nodo('feComposite', { in: 'veloOrilla', in2: 'lente', operator: 'over', result: 'orilla' }, f);
      nodo('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '11', edgeMode: 'duplicate', result: 'borroso' }, f);
      nodo('feFlood', { class: 'vidrio-velo', result: 'velo' }, f);
      nodo('feComposite', { in: 'velo', in2: 'borroso', operator: 'over', result: 'centroLleno' }, f);
      mascara = nodo('feImage', { result: 'mascara', preserveAspectRatio: 'none' }, f);
      nodo('feComposite', { in: 'centroLleno', in2: 'mascara', operator: 'in', result: 'centro' }, f);
      nodo('feComposite', { in: 'centro', in2: 'orilla', operator: 'over', result: 'vidrio' }, f);
    }
    return { id: id, filtro: f, mapa: mapa, mascara: mascara };
  }

  function vigilar(el, conCentro) {
    if (el._vidrio) return;
    var v = el._vidrio = crearFiltro(conCentro);
    var ultimo = '';
    function actualizar() {
      if (!el.isConnected) { borrar(); return; }
      var w = el.offsetWidth, h = el.offsetHeight;
      if (!w || !h) return; // oculto: se arma al mostrarse
      var r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      r = Math.min(r, h / 2, w / 2);
      var clave = w + 'x' + h + 'r' + r;
      if (clave === ultimo) return;
      ultimo = clave;
      [v.filtro, v.mapa, v.mascara].forEach(function (n) {
        if (!n) return;
        n.setAttribute('x', '0'); n.setAttribute('y', '0');
        n.setAttribute('width', String(w)); n.setAttribute('height', String(h));
      });
      var img = dibujar(w, h, r, conCentro);
      v.mapa.setAttribute('href', img.mapa);
      if (v.mascara) v.mascara.setAttribute('href', img.mascara);
      el.style.setProperty('--vidrio-url', 'url(#' + v.id + ')');
      el.classList.add('vidrio-liquido');
      brillo.usar(el, w, h, r);
    }
    var ro = new ResizeObserver(actualizar);
    ro.observe(el);
    function borrar() {
      ro.disconnect(); if (v.filtro.parentNode) v.filtro.parentNode.removeChild(v.filtro); el._vidrio = null;
      brillo.quitar(el);
    }
    v.borrar = borrar;
    actualizar();
  }

  // ---- Brillo de la luz en la orilla ----
  // La luz (que no se ve) pega en la orilla curva del vidrio y la hace brillar del lado de donde viene;
  // tres luces apenas separadas (cálida, verde, azul) dan blanco donde coinciden y colores en las puntas
  // del brillo (arcoíris). El brillo NO depende de lo que hay detrás, así que se calcula aquí como una
  // imagen, una vez por tamaño de pieza, y solo se vuelve a calcular cuando la luz cambia de dirección.
  // Cada pieza lo muestra en su propio lienzo (ver .vidrio-lienzo en styles.css). Así el filtro del
  // vidrio sigue igual de liviano.
  var LUZ_COLORES = [[255, 106, 77, -14], [124, 255, 138, 0], [90, 140, 255, 14]];
  var ELEVACION = 20 * Math.PI / 180, INTENSIDAD = 1.35;
  var brillo = (function () {
    var formas = {}, luzX = -0.6, luzY = -0.8;
    function forma(w, h, r) {
      var clave = w + 'x' + h + 'r' + r;
      if (formas[clave]) return formas[clave];
      var n = w * h, t = new Float32Array(n), vx = new Float32Array(n), vy = new Float32Array(n);
      var qx = new Float32Array(n), qy = new Float32Array(n);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var o = orilla(x + 0.5, y + 0.5, w, h, r), i = y * w + x;
        t[i] = o.t; vx[i] = o.vx; vy[i] = o.vy;
        // hacia qué lado de la pieza queda este punto (para que el brillo se concentre del lado de la luz)
        var ax = (x + 0.5 - w / 2) / (w / 2), ay = (y + 0.5 - h / 2) / (h / 2), al = Math.sqrt(ax * ax + ay * ay) || 1;
        qx[i] = ax / al; qy[i] = ay / al;
      }
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      return (formas[clave] = { clave: clave, w: w, h: h, t: t, vx: vx, vy: vy, qx: qx, qy: qy, c: c, g: c.getContext('2d'), listo: false, els: new Set() });
    }
    function pintar(F) {
      var w = F.w, h = F.h, img = F.g.createImageData(w, h), d = img.data;
      var base = Math.atan2(luzY, luzX), ce = Math.cos(ELEVACION), se = Math.sin(ELEVACION);
      var lx = Math.cos(base), ly = Math.sin(base);
      // Vector "a medio camino" entre la luz y el ojo, para cada una de las tres luces
      var Hs = LUZ_COLORES.map(function (c) {
        var a = base + c[3] * Math.PI / 180, hx = Math.cos(a) * ce, hy = Math.sin(a) * ce, hz = se + 1;
        var l = Math.sqrt(hx * hx + hy * hy + hz * hz); return [hx / l, hy / l, hz / l, c];
      });
      for (var i = 0, n = w * h; i < n; i++) {
        var t = F.t[i]; if (t <= 0) continue;
        // La orilla se curva hacia afuera cada vez más rápido al llegar al filo (como un vidrio grueso
        // redondeado): así el brillo cae en el filo y no adentro de la pieza.
        var ang = t * t * t * 1.45, s = Math.sin(ang), nx = F.vx[i] * s, ny = F.vy[i] * s, nz = Math.cos(ang);
        // Más brillo del lado que da hacia la luz; se apaga a lo largo de la orilla (destello, no raya)
        var lado = F.qx[i] * lx + F.qy[i] * ly; if (lado <= -0.2) continue;
        lado = (lado + 0.2) / 1.2; lado = lado * lado * lado;
        var r = 0, g = 0, b = 0, borde = (t < 0.5 ? t / 0.5 : 1) * lado;
        for (var k = 0; k < 3; k++) {
          var H = Hs[k], p = nx * H[0] + ny * H[1] + nz * H[2]; if (p <= 0) continue;
          var p2 = p * p, p4 = p2 * p2, p8 = p4 * p4, e = p8 * p4 * INTENSIDAD * borde; // p^12
          r += H[3][0] * e; g += H[3][1] * e; b += H[3][2] * e;
        }
        var m = Math.max(r, g, b); if (m < 2) continue;
        var a = Math.min(255, m), j = i * 4;
        d[j] = Math.min(255, r * 255 / m); d[j + 1] = Math.min(255, g * 255 / m); d[j + 2] = Math.min(255, b * 255 / m); d[j + 3] = a;
      }
      F.g.putImageData(img, 0, 0);
      F.listo = true;
      F.els.forEach(copiar);
    }
    // Cada pieza tiene su propio lienzo (<canvas class="vidrio-lienzo">) donde se copia el brillo de su
    // tamaño. Se dibuja directo, en el mismo instante: así nunca hay un momento sin brillo (con imágenes
    // que se cambiaban, el teléfono las volvía a cargar y el brillo parpadeaba).
    function copiar(el) {
      var F = el._brillo, c = el._lienzo;
      if (!F || !c || !F.listo) return;
      if (c.width !== F.w || c.height !== F.h) { c.width = F.w; c.height = F.h; }
      var g = c.getContext('2d'); g.clearRect(0, 0, F.w, F.h); g.drawImage(F.c, 0, 0);
    }
    function quitar(el) {
      if (el._brillo) { el._brillo.els.delete(el); el._brillo = null; }
      if (el._lienzo) { el._lienzo.remove(); el._lienzo = null; }
    }
    function usar(el, w, h, r) {
      var F = forma(w, h, r);
      if (el._brillo === F && el._lienzo && el._lienzo.isConnected) return;
      if (el._brillo) el._brillo.els.delete(el);
      el._brillo = F; F.els.add(el);
      if (!el._lienzo || !el._lienzo.isConnected) {
        var c = document.createElement('canvas');
        c.className = 'vidrio-lienzo'; c.setAttribute('aria-hidden', 'true');
        el.appendChild(c); el._lienzo = c;
      }
      if (F.listo) copiar(el); else pintar(F);
    }
    function luz(x, y) {
      luzX = x; luzY = y;
      for (var k in formas) if (formas[k].els.size) pintar(formas[k]);
    }
    return { usar: usar, quitar: quitar, luz: luz };
  })();

  // Menú de abajo (sin centro borroso: es vidrio transparente).
  // Chrome corre el filtro si el mismo elemento (o algo dentro de él) tiene sombra por fuera, así que la
  // sombra del menú se dibuja en una pieza aparte (.tabbar-sombra) justo detrás, del mismo tamaño.
  var barra = document.querySelector('.tabbar');
  if (barra) {
    vigilar(barra, false);
    var sombra = document.createElement('div');
    sombra.className = 'tabbar-sombra';
    sombra.setAttribute('aria-hidden', 'true');
    barra.parentNode.insertBefore(sombra, barra);
    new ResizeObserver(function () {
      if (barra.offsetHeight) sombra.style.height = barra.offsetHeight + 'px';
    }).observe(barra);
  }

  // Tarjetas (cuentas, movimientos, usuarios, grupos del perfil): el mismo vidrio que el menú.
  // Pueden ser muchas, así que: (1) las del mismo tamaño comparten un solo filtro, y (2) la lupa solo
  // se activa en las que están en pantalla (o a punto de entrar), para no cargar al teléfono.
  var TARJETAS = '.account-card,.mov-row,.user-card,.perfil-grupo,.backup-row';
  var compartidos = {};
  function filtroCompartido(w, h, r) {
    var clave = w + 'x' + h + 'r' + r;
    if (compartidos[clave]) return compartidos[clave];
    var v = crearFiltro(false);
    [v.filtro, v.mapa].forEach(function (n) {
      n.setAttribute('x', '0'); n.setAttribute('y', '0');
      n.setAttribute('width', String(w)); n.setAttribute('height', String(h));
    });
    v.mapa.setAttribute('href', dibujar(w, h, r, false).mapa);
    return (compartidos[clave] = v.id);
  }
  function activarTarjeta(el) {
    var w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return;
    var r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, h / 2, w / 2);
    el.style.setProperty('--vidrio-url', 'url(#' + filtroCompartido(w, h, r) + ')');
    el.classList.add('vidrio-liquido');
    brillo.usar(el, w, h, r);
  }
  var vistas = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) activarTarjeta(e.target); else { e.target.classList.remove('vidrio-liquido'); brillo.quitar(e.target); }
    });
  }, { rootMargin: '120px 0px' });
  var tarjetas = new Set();
  function revisarTarjetas() {
    document.querySelectorAll(TARJETAS).forEach(function (t) {
      if (!tarjetas.has(t)) { tarjetas.add(t); vistas.observe(t); }
    });
    tarjetas.forEach(function (t) { if (!t.isConnected) { vistas.unobserve(t); tarjetas.delete(t); brillo.quitar(t); } });
  }
  // Si cambia el ancho de la pantalla (girar el teléfono), las tarjetas visibles toman su nuevo tamaño.
  window.addEventListener('resize', function () {
    tarjetas.forEach(function (t) { if (t.classList.contains('vidrio-liquido')) activarTarjeta(t); });
  });

  // Ventanas flotantes: aparecen y desaparecen, así que se vigila cuándo se agregan o se quitan.
  var ventanas = [];
  function revisarVentanas() {
    revisarTarjetas();
    document.querySelectorAll('.modal-card').forEach(function (m) {
      if (!m._vidrio) { vigilar(m, true); ventanas.push(m); }
    });
    // Ventanas que ya se cerraron: se borra su filtro y se deja de vigilarlas.
    ventanas = ventanas.filter(function (m) {
      if (m.isConnected) return true;
      if (m._vidrio) m._vidrio.borrar();
      return false;
    });
  }
  new MutationObserver(function (cambios) {
    for (var i = 0; i < cambios.length; i++) {
      var c = cambios[i];
      if (c.target === svg || svg.contains(c.target)) continue; // cambios del propio filtro
      if (c.addedNodes.length || c.removedNodes.length) { revisarVentanas(); return; }
    }
  }).observe(document.body, { childList: true, subtree: true });
  revisarVentanas();

  // ---- Dirección de la luz ----
  // (x, y) apunta hacia donde "está" la luz (que no se ve). Por defecto arriba a la izquierda. Se mueve
  // suave hacia su objetivo, se ignoran los temblores del pulso y el brillo se recalcula como mucho
  // unas 14 veces por segundo (suficiente para verse fluido y sin cargar al teléfono).
  var obj = { x: -0.6, y: -0.8 }, act = { x: -0.6, y: -0.8 }, corriendo = false, base = null, ultimoAng = null, ultimoPinte = 0;
  function animOn() { return !(window.CuentasTema && !window.CuentasTema.animacionesActivas()); }
  function paso(ahora) {
    act.x += (obj.x - act.x) * 0.14; act.y += (obj.y - act.y) * 0.14;
    var ang = Math.atan2(act.y, act.x) * 180 / Math.PI;
    if ((ultimoAng === null || Math.abs(ang - ultimoAng) >= 1) && ahora - ultimoPinte >= 70) {
      ultimoAng = ang; ultimoPinte = ahora; brillo.luz(act.x, act.y);
    }
    if (Math.abs(obj.x - act.x) > 0.004 || Math.abs(obj.y - act.y) > 0.004) requestAnimationFrame(paso);
    else { corriendo = false; brillo.luz(act.x, act.y); ultimoAng = ang; }
  }
  function luzHacia(x, y) {
    if (!animOn() || (!x && !y)) return;
    if (Math.abs(x - obj.x) < 0.02 && Math.abs(y - obj.y) < 0.02) return;
    obj.x = x; obj.y = y;
    if (!corriendo) { corriendo = true; requestAnimationFrame(paso); }
  }
  // Giroscopio: al inclinar el teléfono la luz "da la vuelta" por la orilla. "base" es cómo se sostiene
  // normalmente (se acomoda despacio, ~10 s), así sin moverlo la luz queda arriba a la izquierda.
  window.addEventListener('deviceorientation', function (e) {
    if (e.beta == null || e.gamma == null) return;
    if (base == null) base = e.beta;
    base += (e.beta - base) * 0.002; // se acomoda en unos 10 segundos a cómo se sostiene el teléfono
    luzHacia(-0.6 + e.gamma / 15, -0.8 + (e.beta - base) / 12);
  });
  // Computadora: la luz viene de donde está el mouse.
  if (window.matchMedia && matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'mouse') luzHacia(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1);
    }, { passive: true });
  }
})();
