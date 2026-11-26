// Tema (claro / oscuro / del sistema) y animaciones (automático / activadas / desactivadas).
// Se carga en <head> ANTES de los estilos para que la app nunca "parpadee" con el tema equivocado.
// Las preferencias se guardan en este dispositivo.
(function () {
  'use strict';
  var CLAVE_TEMA = 'cuentasapp_tema';   // 'sistema' | 'claro' | 'oscuro'
  var CLAVE_ANIM = 'cuentasapp_anim';   // 'auto' | 'si' | 'no'
  var html = document.documentElement;
  var mqOscuro = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var mqMenosMov = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function leer(clave, defecto) {
    try { return localStorage.getItem(clave) || defecto; } catch (e) { return defecto; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, valor); } catch (e) { /* modo privado: solo para esta visita */ }
  }

  // Dispositivo modesto: poca memoria o pocos núcleos (cuando el navegador lo informa).
  function equipoModesto() {
    var mem = navigator.deviceMemory, nucleos = navigator.hardwareConcurrency;
    return (typeof mem === 'number' && mem <= 2) || (typeof nucleos === 'number' && nucleos <= 2);
  }

  function aplicar() {
    var tema = leer(CLAVE_TEMA, 'sistema');
    var oscuro = tema === 'oscuro' || (tema === 'sistema' && mqOscuro && mqOscuro.matches);
    html.setAttribute('data-tema', oscuro ? 'oscuro' : 'claro');
    html.style.colorScheme = oscuro ? 'dark' : 'light';

    var anim = leer(CLAVE_ANIM, 'auto');
    var activas = anim === 'si' || (anim === 'auto' && !(mqMenosMov && mqMenosMov.matches) && !equipoModesto());
    html.setAttribute('data-animaciones', activas ? 'si' : 'no');

    // Color de la barra del navegador en el teléfono.
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = oscuro ? '#141518' : '#F3F4F7';
  }

  function escuchar(mq) {
    if (!mq) return;
    if (mq.addEventListener) mq.addEventListener('change', aplicar);
    else if (mq.addListener) mq.addListener(aplicar);
  }
  escuchar(mqOscuro);
  escuchar(mqMenosMov);
  aplicar();

  window.CuentasTema = {
    tema: function () { return leer(CLAVE_TEMA, 'sistema'); },
    animaciones: function () { return leer(CLAVE_ANIM, 'auto'); },
    setTema: function (v) { guardar(CLAVE_TEMA, v); aplicar(); },
    setAnimaciones: function (v) { guardar(CLAVE_ANIM, v); aplicar(); },
    animacionesActivas: function () { return html.getAttribute('data-animaciones') === 'si'; },
    equipoModesto: equipoModesto,
  };
})();
