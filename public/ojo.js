// Botón "ojito" para mostrar/ocultar la contraseña en TODOS los campos de contraseña
// (inicio de sesión, contraseña nueva, crear empresa/usuario, cambiar contraseña, panel de plataforma).
// Vigila la página: los campos que aparecen después (ventanas, pantallas nuevas) también lo reciben.
(function () {
  var OJO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var OJO_TACHADO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.4 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.4 0 10 7 10 7a18.6 18.6 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';

  function agregar(input) {
    if (input.dataset.ojo) return;
    input.dataset.ojo = '1';
    var envoltura = document.createElement('div');
    envoltura.className = 'pass-wrap';
    input.parentNode.insertBefore(envoltura, input);
    envoltura.appendChild(input);
    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'pass-ojo';
    boton.tabIndex = -1;
    var pintar = function () {
      var visible = input.type === 'text';
      boton.innerHTML = visible ? OJO_TACHADO : OJO;
      boton.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
      boton.setAttribute('aria-pressed', visible ? 'true' : 'false');
    };
    // mousedown sin foco: el teclado del teléfono no se cierra al tocar el ojito
    boton.addEventListener('mousedown', function (e) { e.preventDefault(); });
    boton.addEventListener('click', function () {
      input.type = input.type === 'password' ? 'text' : 'password';
      pintar();
    });
    pintar();
    envoltura.appendChild(boton);
  }
  function revisar(raiz) {
    var lista = (raiz || document).querySelectorAll('input[type="password"]:not([data-ojo])');
    for (var i = 0; i < lista.length; i++) agregar(lista[i]);
  }
  new MutationObserver(function () { revisar(document); })
    .observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { revisar(document); });
  else revisar(document);
})();
