// Panel de plataforma (superadmin). Todo el contenido se construye con nodos DOM y textContent:
// nunca se inserta HTML con datos, así un nombre de empresa malicioso no puede ejecutar código aquí.
(function () {
  'use strict';

  const app = document.getElementById('app');
  let YO = null;
  let pestaña = 'empresas';
  let abiertas = new Set(); // empresas con la lista de usuarios desplegada

  // ---------- utilidades ----------
  function h(tag, attrs, ...hijos) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of hijos.flat(Infinity)) { // listas anidadas (p. ej. pares dt/dd) a cualquier profundidad
      if (c === null || c === undefined || c === false) continue;
      el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
    return el;
  }
  function limpiar(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600);
  }
  function fecha(iso) {
    return new Date(iso).toLocaleString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
  function fechaCorta(iso) {
    return new Date(iso).toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  class ErrorSesion extends Error {}
  async function api(ruta, { method = 'GET', body } = {}) {
    let res;
    try {
      res = await fetch('/api/plataforma' + ruta, {
        method,
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-Plataforma': '1' },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      throw new Error('No se pudo conectar con el servidor');
    }
    let data = null;
    try { data = await res.json(); } catch (e) { /* sin cuerpo */ }
    if (res.status === 401 && ruta !== '/login') {
      YO = null;
      vistaLogin((data && data.error) || 'Tu sesión venció. Vuelve a iniciar sesión.');
      throw new ErrorSesion();
    }
    if (!res.ok) throw new Error((data && data.error) || 'Error inesperado');
    return data;
  }
  function manejar(e) {
    if (e instanceof ErrorSesion) return;
    toast(e.message || 'Error');
  }

  // ---------- inicio de sesión ----------
  function vistaLogin(mensaje) {
    limpiar(app);
    const err = h('p', { class: 'login-error' }, mensaje || '');
    const usuario = h('input', { type: 'text', autocomplete: 'username', autocapitalize: 'off', spellcheck: 'false' });
    const pass = h('input', { type: 'password', autocomplete: 'current-password' });
    const codigo = h('input', { type: 'text', autocomplete: 'one-time-code', inputmode: 'text', maxlength: '11', placeholder: '6 dígitos o código de respaldo' });
    const btn = h('button', { class: 'btn-primary' }, 'Entrar');
    async function entrar() {
      err.textContent = '';
      if (!usuario.value.trim() || !pass.value || !codigo.value.trim()) { err.textContent = 'Completa los tres campos.'; return; }
      btn.disabled = true;
      try {
        YO = await api('/login', { method: 'POST', body: { usuario: usuario.value.trim(), contrasena: pass.value, codigo: codigo.value.trim() } });
        pass.value = ''; codigo.value = '';
        vistaPanel();
      } catch (e) {
        err.textContent = e.message;
        codigo.value = '';
      } finally { btn.disabled = false; }
    }
    btn.addEventListener('click', entrar);
    [usuario, pass, codigo].forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') entrar(); }));
    app.appendChild(h('div', { class: 'pl-login' },
      h('div', { class: 'login-card' },
        h('span', { class: 'pl-tag' }, 'Administración de plataforma'),
        h('h1', null, 'Kaab'),
        h('p', { class: 'sub' }, 'Acceso restringido. Necesitas tu contraseña y el código de tu app autenticadora.'),
        h('div', { class: 'field' }, h('label', null, 'Usuario'), usuario),
        h('div', { class: 'field' }, h('label', null, 'Contraseña'), pass),
        h('div', { class: 'field' }, h('label', null, 'Código de verificación'), codigo),
        btn, err)));
    usuario.focus();
  }

  // ---------- panel ----------
  function vistaPanel() {
    limpiar(app);
    const salir = h('button', { class: 'pl-btn', onclick: async () => {
      try { await api('/logout', { method: 'POST' }); } catch (e) { /* igual se sale */ }
      YO = null; vistaLogin('Sesión cerrada.');
    } }, 'Cerrar sesión');
    app.appendChild(h('header', { class: 'pl-top' },
      h('div', { class: 'pl-brand' }, 'Plataforma', h('small', null, YO.usuario)),
      h('div', { class: 'pl-spacer' }), salir));

    const cuerpo = h('main', { class: 'pl-wrap' });
    if (YO.respaldosRestantes <= 3) {
      cuerpo.appendChild(h('div', { class: 'pl-aviso' },
        `Te quedan ${YO.respaldosRestantes} códigos de respaldo. Genera nuevos ejecutando otra vez scripts/superadmin.js.`));
    }
    const tabs = h('nav', { class: 'pl-tabs' },
      ['empresas', 'bitacora'].map(t => h('button', {
        class: 'pl-tab' + (pestaña === t ? ' on' : ''),
        onclick: () => { pestaña = t; vistaPanel(); },
      }, t === 'empresas' ? 'Empresas' : 'Bitácora')));
    cuerpo.appendChild(tabs);
    const contenido = h('div');
    cuerpo.appendChild(contenido);
    app.appendChild(cuerpo);
    if (pestaña === 'empresas') cargarEmpresas(contenido); else cargarBitacora(contenido);
  }

  // ---------- empresas ----------
  async function cargarEmpresas(cont) {
    limpiar(cont);
    cont.appendChild(h('p', { class: 'pl-vacio' }, 'Cargando…'));
    let empresas;
    try { empresas = await api('/empresas'); } catch (e) { return manejar(e); }
    limpiar(cont);

    const formHueco = h('div');
    cont.appendChild(h('div', { class: 'pl-fila' },
      h('div', { class: 'pl-meta' }, `${empresas.length} empresa(s)`),
      h('div', { class: 'pl-spacer' }),
      h('button', { class: 'pl-btn primario', onclick: () => formNuevaEmpresa(formHueco, cont) }, '+ Nueva empresa')));
    cont.appendChild(formHueco);

    if (!empresas.length) cont.appendChild(h('p', { class: 'pl-vacio' }, 'Todavía no hay empresas.'));
    for (const e of empresas) cont.appendChild(tarjetaEmpresa(e, cont));
  }

  function tarjetaEmpresa(e, cont) {
    const usuariosHueco = h('div');
    const card = h('div', { class: 'pl-card' },
      h('div', { class: 'pl-fila' },
        h('h3', null, e.nombre),
        h('span', { class: 'pl-codigo' }, e.codigo),
        h('span', { class: 'pl-badge ' + (e.activa ? 'verde' : 'rojo') }, e.activa ? 'Activa' : 'Suspendida')),
      h('div', { class: 'pl-meta' }, `${e.usuarios} usuario(s) · ${e.admins} admin · creada ${fechaCorta(e.fecha_creacion)}`),
      h('div', { class: 'pl-acciones' },
        h('button', { class: 'pl-btn', onclick: () => {
          if (abiertas.has(e.id)) { abiertas.delete(e.id); limpiar(usuariosHueco); }
          else { abiertas.add(e.id); cargarUsuarios(e, usuariosHueco); }
        } }, 'Usuarios'),
        h('button', { class: 'pl-btn ' + (e.activa ? 'peligro' : 'ok'), onclick: async () => {
          const accion = e.activa ? 'SUSPENDER' : 'REACTIVAR';
          const txt = e.activa
            ? `¿Suspender "${e.nombre}"?\n\nNadie de esa empresa podrá entrar y se cerrarán sus sesiones. Sus datos NO se borran.`
            : `¿Reactivar "${e.nombre}"?`;
          if (!confirm(txt)) return;
          try {
            await api(`/empresas/${e.id}/estado`, { method: 'POST', body: { activa: !e.activa } });
            toast(accion === 'SUSPENDER' ? 'Empresa suspendida' : 'Empresa reactivada');
            cargarEmpresas(cont);
          } catch (err) { manejar(err); }
        } }, e.activa ? 'Suspender' : 'Reactivar')),
      usuariosHueco);
    if (abiertas.has(e.id)) cargarUsuarios(e, usuariosHueco);
    return card;
  }

  async function cargarUsuarios(e, hueco) {
    limpiar(hueco);
    hueco.appendChild(h('p', { class: 'pl-meta' }, 'Cargando usuarios…'));
    let data;
    try { data = await api(`/empresas/${e.id}/usuarios`); } catch (err) { limpiar(hueco); return manejar(err); }
    limpiar(hueco);
    const lista = h('div', { class: 'pl-usuarios' });
    if (!data.usuarios.length) lista.appendChild(h('p', { class: 'pl-meta' }, 'Sin usuarios.'));
    for (const u of data.usuarios) {
      lista.appendChild(h('div', { class: 'pl-usuario' },
        h('div', { class: 'pl-quien' },
          h('div', null, u.nombre),
          h('div', { class: 'pl-meta' }, `${u.usuario}@${String(data.empresa.codigo).toLowerCase()}` + (u.email ? ' · ' + u.email : ''))),
        h('span', { class: 'pl-badge ' + (u.rol === 'admin' ? 'azul' : 'verde') }, u.rol === 'admin' ? 'Admin' : 'Usuario'),
        u.debe_cambiar_contrasena ? h('span', { class: 'pl-badge amarillo' }, 'Pendiente de cambiar') : null,
        h('button', { class: 'pl-btn peligro', onclick: () => restablecer(u, data.empresa) }, 'Restablecer contraseña')));
    }
    hueco.appendChild(lista);
  }

  async function restablecer(u, empresa) {
    const ok = confirm(
      `¿Restablecer la contraseña de "${u.nombre}" (${u.usuario}) en "${empresa.nombre}"?\n\n` +
      '• Se generará una contraseña temporal que verás UNA sola vez.\n' +
      '• Se cerrarán todas sus sesiones y se borrarán sus huellas registradas.\n' +
      '• Al entrar deberá elegir una contraseña nueva.');
    if (!ok) return;
    try {
      const r = await api(`/usuarios/${u.id}/restablecer`, { method: 'POST' });
      modalSecreto('Contraseña restablecida',
        'Entrégale estos datos a la persona por un medio privado. La contraseña temporal no se vuelve a mostrar.',
        [['Usuario para entrar', `${r.usuario}@${String(r.codigoEmpresa).toLowerCase()}`], ['Código de empresa', r.codigoEmpresa]], r.contrasenaTemporal); // al cerrar se refresca la lista
    } catch (e) { manejar(e); }
  }

  // Usuario a partir del nombre: minúsculas, sin acentos, sin espacios ni símbolos ("Juan Pérez" → "juanperez").
  function usuarioDesdeNombre(nombre) {
    return String(nombre || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 60);
  }

  function formNuevaEmpresa(hueco, cont) {
    limpiar(hueco);
    const campos = {
      nombreEmpresa: h('input', { type: 'text', maxlength: '100' }),
      nombre: h('input', { type: 'text', maxlength: '100' }),
      email: h('input', { type: 'email', maxlength: '254' }),
    };
    const err = h('p', { class: 'login-error' });
    // El usuario del administrador sale del nombre; se muestra mientras se escribe.
    const vistaUsuario = h('p', { class: 'pl-meta' });
    const actualizarVista = () => {
      const u = usuarioDesdeNombre(campos.nombre.value);
      vistaUsuario.textContent = u ? `Entrará con el usuario: ${u}@(código de la empresa)` : 'El usuario para entrar se forma con el nombre, en minúsculas y sin espacios.';
    };
    campos.nombre.addEventListener('input', actualizarVista);
    actualizarVista();
    const crear = h('button', { class: 'pl-btn primario' }, 'Crear empresa');
    crear.addEventListener('click', async () => {
      err.textContent = '';
      const body = Object.fromEntries(Object.entries(campos).map(([k, el]) => [k, el.value.trim()]));
      if (!body.nombreEmpresa || !body.nombre) { err.textContent = 'Completa los campos obligatorios.'; return; }
      body.usuario = usuarioDesdeNombre(body.nombre);
      if (!body.usuario) { err.textContent = 'El nombre del administrador debe tener letras o números.'; return; }
      crear.disabled = true;
      try {
        const r = await api('/empresas', { method: 'POST', body });
        limpiar(hueco);
        modalSecreto('Empresa creada',
          'Entrégale estos datos al administrador de la empresa por un medio privado. Al entrar deberá elegir su propia contraseña. La contraseña temporal no se vuelve a mostrar.',
          [['Empresa', r.empresa.nombre], ['Usuario para entrar', `${r.admin.usuario}@${String(r.empresa.codigo).toLowerCase()}`], ['Código de empresa', r.empresa.codigo]],
          r.contrasenaTemporal, () => cargarEmpresas(cont));
      } catch (e) { err.textContent = e.message; } finally { crear.disabled = false; }
    });
    hueco.appendChild(h('div', { class: 'pl-card' },
      h('h3', null, 'Nueva empresa'),
      h('p', { class: 'pl-meta' }, 'Se crea con su administrador. La contraseña inicial es temporal y se genera automáticamente.'),
      h('div', { class: 'pl-form' },
        h('div', { class: 'field pl-full' }, h('label', null, 'Nombre de la empresa *'), campos.nombreEmpresa),
        h('div', { class: 'field pl-full' }, h('label', null, 'Nombre del administrador *'), campos.nombre, vistaUsuario),
        h('div', { class: 'field pl-full' }, h('label', null, 'Correo (opcional)'), campos.email)),
      h('div', { class: 'pl-acciones' }, crear, h('button', { class: 'pl-btn', onclick: () => limpiar(hueco) }, 'Cancelar')),
      err));
    campos.nombreEmpresa.focus();
  }

  function modalSecreto(titulo, texto, datos, secreto, alCerrar) {
    const copiar = h('button', { class: 'pl-btn' }, 'Copiar contraseña');
    copiar.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(secreto); toast('Copiada'); } catch (e) { toast('Selecciónala y cópiala a mano'); }
    });
    const velo = h('div', { class: 'pl-velo' });
    const cerrar = h('button', { class: 'pl-btn primario', onclick: () => {
      velo.remove();
      if (alCerrar) alCerrar(); else if (pestaña === 'empresas') vistaPanel();
    } }, 'Ya la entregué, cerrar');
    velo.appendChild(h('div', { class: 'pl-modal', role: 'dialog', 'aria-modal': 'true' },
      h('h2', null, titulo),
      h('p', null, texto),
      h('dl', { class: 'pl-datos' }, datos.map(([k, v]) => [h('dt', null, k), h('dd', null, v)])),
      h('div', { class: 'pl-meta' }, 'Contraseña temporal'),
      h('div', { class: 'pl-secreto' }, secreto),
      h('div', { class: 'pl-acciones' }, copiar, cerrar)));
    document.body.appendChild(velo);
  }

  // ---------- bitácora ----------
  async function cargarBitacora(cont) {
    limpiar(cont);
    cont.appendChild(h('p', { class: 'pl-vacio' }, 'Cargando…'));
    let items;
    try { items = await api('/bitacora'); } catch (e) { return manejar(e); }
    limpiar(cont);
    if (!items.length) { cont.appendChild(h('p', { class: 'pl-vacio' }, 'Sin registros.')); return; }
    cont.appendChild(h('div', { class: 'pl-log' }, items.map(i =>
      h('div', { class: 'pl-log-item' + (/fallido/i.test(i.accion) ? ' fallo' : '') },
        h('div', { class: 'pl-log-acc' }, i.accion),
        i.detalle ? h('div', null, i.detalle) : null,
        h('div', { class: 'pl-meta' }, `${fecha(i.fecha)} · ${i.usuario || '—'} · IP ${i.ip || '—'}`)))));
  }

  // ---------- arranque ----------
  (async () => {
    try {
      const r = await fetch('/api/plataforma/me', { credentials: 'same-origin', headers: { 'X-Plataforma': '1' } });
      if (r.ok) { YO = await r.json(); vistaPanel(); return; }
    } catch (e) { /* sin conexión */ }
    vistaLogin();
  })();
})();
