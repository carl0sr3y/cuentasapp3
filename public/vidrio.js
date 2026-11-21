// Menú de abajo "liquid glass": las orillas del vidrio doblan lo que pasa por detrás (como una lupa),
// lo que da sensación de volumen. Usa un filtro SVG en backdrop-filter, que hoy solo dibuja Chrome/Android.
// En los demás navegadores (iPhone, Firefox) y en teléfonos modestos no hace nada: queda el vidrio normal.
(function () {
  'use strict';
  // Solo navegadores basados en Chromium (userAgentData no existe en Safari/iPhone ni en Firefox).
  if (!navigator.userAgentData || !window.CSS || !CSS.supports('backdrop-filter', 'url(#a)')) return;
  var barra = document.querySelector('.tabbar');
  if (!barra || !window.ResizeObserver) return;

  var NS = 'http://www.w3.org/2000/svg';
  var ORILLA = 18;   // ancho (px) de la orilla que dobla la imagen
  var FUERZA = 34;   // cuánto se dobla (px) en el filo

  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  var filtro = document.createElementNS(NS, 'filter');
  filtro.id = 'vidrioLiquido';
  filtro.setAttribute('filterUnits', 'userSpaceOnUse');
  filtro.setAttribute('primitiveUnits', 'userSpaceOnUse');
  filtro.setAttribute('color-interpolation-filters', 'sRGB');
  var mapa = document.createElementNS(NS, 'feImage');
  mapa.setAttribute('result', 'mapa'); mapa.setAttribute('preserveAspectRatio', 'none');
  var desplazar = document.createElementNS(NS, 'feDisplacementMap');
  desplazar.setAttribute('in', 'SourceGraphic'); desplazar.setAttribute('in2', 'mapa');
  desplazar.setAttribute('scale', String(FUERZA));
  desplazar.setAttribute('xChannelSelector', 'R'); desplazar.setAttribute('yChannelSelector', 'G');
  filtro.appendChild(mapa); filtro.appendChild(desplazar); svg.appendChild(filtro);
  document.body.appendChild(svg);

  // Mapa de desplazamiento de una píldora de w×h: en el centro no se mueve nada (gris 128);
  // cerca del borde, cada punto toma la imagen de un poco más adentro, más fuerte cuanto más cerca del filo.
  function dibujarMapa(w, h) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
    var r = h / 2;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var cx = Math.min(Math.max(x + 0.5, r), w - r), vx = x + 0.5 - cx, vy = y + 0.5 - r;
        var largo = Math.sqrt(vx * vx + vy * vy) || 1;
        var t = Math.max(0, 1 - (r - largo) / ORILLA); if (t > 1) t = 1;
        var m = t * t; // suave hacia adentro, fuerte en el filo
        var i = (y * w + x) * 4;
        d[i] = 128 - Math.round((vx / largo) * m * 127);     // la imagen viene de adentro (hacia el centro)
        d[i + 1] = 128 - Math.round((vy / largo) * m * 127);
        d[i + 2] = 128; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  }

  var ultimo = '';
  function actualizar() {
    var w = barra.offsetWidth, h = barra.offsetHeight;
    if (!w || !h) return; // oculta (buscando o antes de entrar): se arma al mostrarse
    var clave = w + 'x' + h;
    if (clave === ultimo) return;
    ultimo = clave;
    [filtro, mapa].forEach(function (el) {
      el.setAttribute('x', '0'); el.setAttribute('y', '0');
      el.setAttribute('width', String(w)); el.setAttribute('height', String(h));
    });
    mapa.setAttribute('href', dibujarMapa(w, h));
    barra.classList.add('vidrio-liquido');
  }
  new ResizeObserver(actualizar).observe(barra);
  actualizar();
})();
