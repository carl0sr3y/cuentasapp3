// Recorte automático de facturas, 100 % en el teléfono (no usa el servidor).
//   KaabRecorte.detectar(img)            → 4 esquinas [{x,y}] en píxeles de la foto, o null si no la encuentra.
//   KaabRecorte.enderezar(img, esquinas, ladoMax) → canvas con la factura recortada y derecha (perspectiva corregida).
//
// Cómo detecta: trabaja sobre una copia pequeña (lado largo 360 px). El papel de una factura suele ser
// más claro y menos colorido que el fondo: se calcula un "brillo de papel", se separa con el umbral de
// Otsu, se cierran los huecos que deja el texto, se toma la mancha clara más grande y, de su contorno
// convexo, las 4 esquinas que encierran la mayor área. Si falla, el editor deja moverlas a mano.
(function () {
  var LADO_DETECCION = 360;

  function lado(img) { return { w: img.naturalWidth || img.width, h: img.naturalHeight || img.height }; }

  function copiaPequena(img) {
    var t = lado(img), esc = Math.min(1, LADO_DETECCION / Math.max(t.w, t.h));
    var w = Math.max(8, Math.round(t.w * esc)), h = Math.max(8, Math.round(t.h * esc));
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var cx = c.getContext('2d', { willReadFrequently: true });
    cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
    cx.drawImage(img, 0, 0, w, h);
    return { w: w, h: h, esc: esc, datos: cx.getImageData(0, 0, w, h).data };
  }

  function otsu(valores) {
    var hist = new Array(256).fill(0), n = valores.length, i;
    for (i = 0; i < n; i++) hist[valores[i]]++;
    var suma = 0; for (i = 0; i < 256; i++) suma += i * hist[i];
    var sumaB = 0, pesoB = 0, mejor = 0, umbral = 128;
    for (i = 0; i < 256; i++) {
      pesoB += hist[i]; if (!pesoB) continue;
      var pesoF = n - pesoB; if (!pesoF) break;
      sumaB += i * hist[i];
      var mB = sumaB / pesoB, mF = (suma - sumaB) / pesoF;
      var v = pesoB * pesoF * (mB - mF) * (mB - mF);
      if (v > mejor) { mejor = v; umbral = i; }
    }
    return umbral;
  }

  // Dilata (crecer) o erosiona (encoger) la máscara con un cuadrado de radio r.
  function morfologia(m, w, h, r, crecer) {
    var tmp = new Uint8Array(w * h), out = new Uint8Array(w * h), x, y, k, v;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      v = crecer ? 0 : 1;
      for (k = -r; k <= r; k++) { var xx = x + k; if (xx < 0 || xx >= w) { if (!crecer) { v = 0; break; } continue; } var b = m[y * w + xx]; if (crecer ? b : !b) { v = crecer ? 1 : 0; break; } }
      tmp[y * w + x] = v;
    }
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      v = crecer ? 0 : 1;
      for (k = -r; k <= r; k++) { var yy = y + k; if (yy < 0 || yy >= h) { if (!crecer) { v = 0; break; } continue; } var b2 = tmp[yy * w + x]; if (crecer ? b2 : !b2) { v = crecer ? 1 : 0; break; } }
      out[y * w + x] = v;
    }
    return out;
  }

  // Mancha (componente conexa) más grande: devuelve los puntos de su borde.
  function manchaMayor(m, w, h) {
    var etiqueta = new Int32Array(w * h), cola = new Int32Array(w * h), mejor = null, id = 0;
    for (var inicio = 0; inicio < w * h; inicio++) {
      if (!m[inicio] || etiqueta[inicio]) continue;
      id++; var cab = 0, fin = 0, area = 0, borde = [];
      cola[fin++] = inicio; etiqueta[inicio] = id;
      while (cab < fin) {
        var p = cola[cab++], x = p % w, y = (p - x) / w; area++;
        var esBorde = x === 0 || y === 0 || x === w - 1 || y === h - 1;
        var vec = [p - 1, p + 1, p - w, p + w], ok = [x > 0, x < w - 1, y > 0, y < h - 1];
        for (var k = 0; k < 4; k++) {
          if (!ok[k]) continue;
          var q = vec[k];
          if (!m[q]) { esBorde = true; continue; }
          if (!etiqueta[q]) { etiqueta[q] = id; cola[fin++] = q; }
        }
        if (esBorde) borde.push([x, y]);
      }
      if (!mejor || area > mejor.area) mejor = { area: area, borde: borde };
    }
    return mejor;
  }

  function cruz(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
  function envolvente(pts) { // contorno convexo (cadena monótona)
    pts = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    var abajo = [], arriba = [], i;
    for (i = 0; i < pts.length; i++) { while (abajo.length >= 2 && cruz(abajo[abajo.length - 2], abajo[abajo.length - 1], pts[i]) <= 0) abajo.pop(); abajo.push(pts[i]); }
    for (i = pts.length - 1; i >= 0; i--) { while (arriba.length >= 2 && cruz(arriba[arriba.length - 2], arriba[arriba.length - 1], pts[i]) <= 0) arriba.pop(); arriba.push(pts[i]); }
    arriba.pop(); abajo.pop();
    return abajo.concat(arriba);
  }
  function areaQuad(q) {
    var s = 0; for (var i = 0; i < 4; i++) { var a = q[i], b = q[(i + 1) % 4]; s += a[0] * b[1] - b[0] * a[1]; }
    return Math.abs(s) / 2;
  }
  // Cuadrilátero de mayor área con vértices en el contorno (búsqueda local partiendo de los extremos).
  function mejorCuadrilatero(hull) {
    if (hull.length < 4) return null;
    var idx = [0, 0, 0, 0];
    hull.forEach(function (p, i) {
      if (p[0] + p[1] < hull[idx[0]][0] + hull[idx[0]][1]) idx[0] = i;      // arriba-izq
      if (p[0] - p[1] > hull[idx[1]][0] - hull[idx[1]][1]) idx[1] = i;      // arriba-der
      if (p[0] + p[1] > hull[idx[2]][0] + hull[idx[2]][1]) idx[2] = i;      // abajo-der
      if (p[0] - p[1] < hull[idx[3]][0] - hull[idx[3]][1]) idx[3] = i;      // abajo-izq
    });
    var q = idx.map(function (i) { return hull[i]; });
    for (var vuelta = 0; vuelta < 4; vuelta++) {
      var mejoro = false;
      for (var k = 0; k < 4; k++) {
        var mejorA = areaQuad(q), mejorP = q[k];
        for (var j = 0; j < hull.length; j++) {
          var prueba = q.slice(); prueba[k] = hull[j];
          var a = areaQuad(prueba);
          if (a > mejorA + 0.5) { mejorA = a; mejorP = hull[j]; }
        }
        if (mejorP !== q[k]) { q[k] = mejorP; mejoro = true; }
      }
      if (!mejoro) break;
    }
    return ordenar(q.map(function (p) { return { x: p[0], y: p[1] }; }));
  }
  // Ordena: arriba-izquierda, arriba-derecha, abajo-derecha, abajo-izquierda.
  function ordenar(p) {
    var c = { x: 0, y: 0 }; p.forEach(function (a) { c.x += a.x / 4; c.y += a.y / 4; });
    p = p.slice().sort(function (a, b) { return Math.atan2(a.y - c.y, a.x - c.x) - Math.atan2(b.y - c.y, b.x - c.x); });
    var i0 = 0; p.forEach(function (a, i) { if (a.x + a.y < p[i0].x + p[i0].y) i0 = i; });
    return p.slice(i0).concat(p.slice(0, i0));
  }

  function detectar(img) {
    var c = copiaPequena(img), w = c.w, h = c.h, d = c.datos, n = w * h;
    // "Brillo de papel": claro y poco colorido.
    var val = new Uint8Array(n);
    for (var i = 0; i < n; i++) {
      var r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var v = 0.299 * r + 0.587 * g + 0.114 * b - 0.6 * (max - min);
      val[i] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
    var u = otsu(val);
    var m = new Uint8Array(n); for (i = 0; i < n; i++) m[i] = val[i] > u ? 1 : 0;
    m = morfologia(morfologia(m, w, h, 2, true), w, h, 2, false);  // cierra huecos del texto
    m = morfologia(morfologia(m, w, h, 1, false), w, h, 1, true);  // quita puntitos sueltos
    var mancha = manchaMayor(m, w, h);
    if (!mancha) return null;
    var frac = mancha.area / n;
    if (frac < 0.06 || frac > 0.97) return null; // muy pequeña (ruido) o es toda la foto
    var q = mejorCuadrilatero(envolvente(mancha.borde));
    if (!q || areaQuad(q.map(function (p) { return [p.x, p.y]; })) < 0.05 * n) return null;
    return q.map(function (p) { return { x: (p.x + 0.5) / c.esc, y: (p.y + 0.5) / c.esc }; });
  }

  // Homografía que lleva el rectángulo (0,0)-(W,H) a las 4 esquinas de la foto.
  function homografia(W, H, q) {
    var src = [[0, 0], [W, 0], [W, H], [0, H]], A = [], bb = [];
    for (var i = 0; i < 4; i++) {
      var x = src[i][0], y = src[i][1], X = q[i].x, Y = q[i].y;
      A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]); bb.push(X);
      A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]); bb.push(Y);
    }
    for (var col = 0; col < 8; col++) { // eliminación gaussiana con pivoteo
      var piv = col; for (var r = col + 1; r < 8; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
      var t = A[col]; A[col] = A[piv]; A[piv] = t; var tb = bb[col]; bb[col] = bb[piv]; bb[piv] = tb;
      for (r = 0; r < 8; r++) {
        if (r === col) continue;
        var f = A[r][col] / A[col][col];
        for (var k = col; k < 8; k++) A[r][k] -= f * A[col][k];
        bb[r] -= f * bb[col];
      }
    }
    return bb.map(function (v, i) { return v / A[i][i]; });
  }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  // Recorta y endereza. Lee la foto a ~2600 px (no a resolución completa: en fotos de 48 MP se
  // acabaría la memoria del teléfono) y devuelve un canvas con lado largo ≤ ladoMax.
  function enderezar(img, q, ladoMax, redimensionar) {
    var t = lado(img), escFuente = Math.min(1, 2600 / Math.max(t.w, t.h));
    var fuente = escFuente < 1 ? redimensionar(img, 2600) : img;
    var fw = fuente.width || fuente.naturalWidth, fh = fuente.height || fuente.naturalHeight;
    var qs = q.map(function (p) { return { x: p.x * escFuente, y: p.y * escFuente }; });
    var W = Math.max(dist(qs[0], qs[1]), dist(qs[3], qs[2])), H = Math.max(dist(qs[0], qs[3]), dist(qs[1], qs[2]));
    var esc = Math.min(1, ladoMax / Math.max(W, H));
    W = Math.max(1, Math.round(W * esc)); H = Math.max(1, Math.round(H * esc));
    var cf = document.createElement('canvas'); cf.width = fw; cf.height = fh;
    var cfx = cf.getContext('2d', { willReadFrequently: true }); cfx.drawImage(fuente, 0, 0, fw, fh);
    var S = cfx.getImageData(0, 0, fw, fh).data;
    var out = document.createElement('canvas'); out.width = W; out.height = H;
    var ox = out.getContext('2d'), O = ox.createImageData(W, H), D = O.data;
    var m = homografia(W, H, qs);
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var den = m[6] * x + m[7] * y + 1;
        var sx = (m[0] * x + m[1] * y + m[2]) / den, sy = (m[3] * x + m[4] * y + m[5]) / den;
        var x0 = Math.floor(sx), y0 = Math.floor(sy), ax = sx - x0, ay = sy - y0;
        if (x0 < 0) { x0 = 0; ax = 0; } if (y0 < 0) { y0 = 0; ay = 0; }
        if (x0 >= fw - 1) { x0 = fw - 2; ax = 1; } if (y0 >= fh - 1) { y0 = fh - 2; ay = 1; }
        var i00 = (y0 * fw + x0) * 4, i10 = i00 + 4, i01 = i00 + fw * 4, i11 = i01 + 4, o = (y * W + x) * 4;
        for (var c = 0; c < 3; c++) {
          D[o + c] = (S[i00 + c] * (1 - ax) + S[i10 + c] * ax) * (1 - ay) + (S[i01 + c] * (1 - ax) + S[i11 + c] * ax) * ay;
        }
        D[o + 3] = 255;
      }
    }
    ox.putImageData(O, 0, 0);
    return out;
  }

  window.KaabRecorte = { detectar: detectar, enderezar: enderezar, ordenar: ordenar };
})();
