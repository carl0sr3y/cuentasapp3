// Menú de abajo "liquid glass": las orillas del vidrio doblan lo que pasa por detrás (como una lupa),
// lo que da sensación de volumen, con un arcoíris finito en el filo. Usa un filtro SVG en backdrop-filter,
// que hoy solo dibuja Chrome/Android.
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
  filtro.appendChild(mapa);
  // Arcoíris finito en las orillas: cada color (rojo, verde, azul) se dobla un poquito distinto, como la
  // luz al pasar por el filo de un vidrio. En el centro el mapa no mueve nada, así que los colores se
  // vuelven a juntar exactos y solo se separan en la orilla.
  var ARCOIRIS = [['r', 1, '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'],
                  ['g', 1.07, '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'],
                  ['b', 1.14, '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0']];
  ARCOIRIS.forEach(function (c) {
    var d = document.createElementNS(NS, 'feDisplacementMap');
    d.setAttribute('in', 'SourceGraphic'); d.setAttribute('in2', 'mapa');
    d.setAttribute('scale', String(Math.round(FUERZA * c[1])));
    d.setAttribute('xChannelSelector', 'R'); d.setAttribute('yChannelSelector', 'G');
    d.setAttribute('result', 'd' + c[0]);
    var m = document.createElementNS(NS, 'feColorMatrix');
    m.setAttribute('in', 'd' + c[0]); m.setAttribute('type', 'matrix'); m.setAttribute('values', c[2]);
    m.setAttribute('result', c[0]);
    filtro.appendChild(d); filtro.appendChild(m);
  });
  var junta1 = document.createElementNS(NS, 'feBlend');
  junta1.setAttribute('in', 'r'); junta1.setAttribute('in2', 'g'); junta1.setAttribute('mode', 'screen'); junta1.setAttribute('result', 'rg');
  var junta2 = document.createElementNS(NS, 'feBlend');
  junta2.setAttribute('in', 'rg'); junta2.setAttribute('in2', 'b'); junta2.setAttribute('mode', 'screen');
  filtro.appendChild(junta1); filtro.appendChild(junta2);
  svg.appendChild(filtro);
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
