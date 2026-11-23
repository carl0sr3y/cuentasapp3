// Código de public/app.js del menú de abajo tal como quedó (commit 162c221): reemplaza el bloque
// "Fondo de color de la pestaña elegida" hasta antes de setTabUI(). Ver README.md.

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
const MOVER_CON_TRANSLATE = !!(window.CSS && CSS.supports('translate', '1px 0') && CSS.supports('scale', '1 1'));
function moverIndicadorPestana(sinAnimar) {
  const ind = indicadorPestana;
  if (!ind) return;
  const btn = document.querySelector(`.tab-btn[data-tab="${currentTab}"]`);
  if (!btn || !btn.offsetWidth) return; // menú oculto: se recoloca cuando vuelva a verse
  if (sinAnimar) ind.classList.add('sin-animar');
  const desde = ind._x, hasta = btn.offsetLeft;
  ind.dataset.tab = currentTab;
  ind.style.width = btn.offsetWidth + 'px';
  // Con la propiedad "translate" (y no transform) el estirón/inflado ("scale") ocurre en su lugar.
  if (MOVER_CON_TRANSLATE) ind.style.translate = `${hasta}px 0`; else ind.style.transform = `translateX(${hasta}px)`;
  ind._x = hasta;
  if (sinAnimar) { void ind.offsetWidth; ind.classList.remove('sin-animar'); }
  else if (desde != null && desde !== hasta) estirarGota(ind, Math.abs(hasta - desde) / (btn.offsetWidth || 1));
  ind.classList.add('listo');
}
// "Liquid glass": mientras viaja a otra pestaña, la gota se estira como una gota de agua (más cuanto más
// lejos va), se aplasta un poco al llegar y rebota hasta quedarse quieta. Usa la propiedad "scale", que se
// suma al translateX con que se mueve, así que no estorba al deslizamiento.
function estirarGota(ind, saltos) {
  if (!MOVER_CON_TRANSLATE || !animOn() || typeof ind.animate !== 'function') return;
  const e = Math.min(0.42, 0.24 + 0.1 * saltos); // estirón a lo ancho
  try {
    ind.animate([
      { scale: '1 1' },
      { scale: `${1 + e} ${1 - e * 0.45}`, offset: 0.32 },
      { scale: `${1 - e * 0.22} ${1 + e * 0.18}`, offset: 0.62 },
      { scale: `${1 + e * 0.07} ${1 - e * 0.05}`, offset: 0.82 },
      { scale: '1 1' }
    ], { duration: 560, easing: 'cubic-bezier(.3,.7,.4,1)' });
  } catch (_) { /* navegador sin "scale" animable: se desliza como antes */ }
}
// Al poner el dedo en el menú, el vidrio reacciona: la barra se agranda apenas y, si es la pestaña
// elegida, la gota se infla y brilla más. Al soltar (o si el dedo se va) vuelve a su tamaño.
(() => {
  const barra = document.querySelector('.tabbar');
  if (!barra) return;
  let apretado = null;
  const soltar = () => {
    if (!apretado) return;
    barra.classList.remove('apretada'); apretado.classList.remove('apretando');
    if (indicadorPestana) indicadorPestana.classList.remove('apretada');
    apretado = null;
  };
  barra.addEventListener('pointerdown', ev => {
    const btn = ev.target.closest && ev.target.closest('.tab-btn');
    if (!btn || !animOn()) return;
    soltar();
    apretado = btn;
    barra.classList.add('apretada'); btn.classList.add('apretando');
    if (indicadorPestana && MOVER_CON_TRANSLATE && btn.dataset.tab === currentTab) indicadorPestana.classList.add('apretada');
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => barra.addEventListener(t, soltar));
  window.addEventListener('blur', soltar);
})();
// Al bajar por la lista el menú se achica para dejar más espacio; al subir un poco (o al tocarlo, o al
// llegar arriba) vuelve a su tamaño. Solo se mira cuánto se movió la página: no se toca la lista.
(() => {
  const barra = document.querySelector('.tabbar');
  if (!barra) return;
  let ultimoY = window.scrollY, pendiente = false;
  const revisar = () => {
    pendiente = false;
    const y = window.scrollY, dy = y - ultimoY;
    if (y < 60) barra.classList.remove('compacta');
    else if (dy > 8) barra.classList.add('compacta');
    else if (dy < -8) barra.classList.remove('compacta');
    else return; // movimiento muy chico: se espera a que sume más
    ultimoY = y;
  };
  window.addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); } }, { passive: true });
  barra.addEventListener('pointerdown', () => barra.classList.remove('compacta'));
})();
