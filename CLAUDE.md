# Kaab (antes Cuentas-App)

App web (PWA) para negocios en Guatemala: **cuentas por cobrar** (clientes que deben), **cuentas por
pagar** (proveedores) y **movimientos de tienda** (entradas/salidas con foto de factura). Multiempresa,
en uso real. Desplegada en **Railway** (servicio Node + PostgreSQL); cada `git push` a `main` despliega.

## Cómo trabajar con el dueño (obligatorio)

- Responder **siempre en español**, sin jerga técnica: el dueño no es programador.
- **Él hace el `git push`** (este equipo no tiene credenciales de GitHub). Hacer commit y decirle que suba.
- **No implementar sin su "sí"**: si pide "revisa", "muéstrame" o hace una pregunta, solo responder y esperar.
  Los pendientes se hacen **uno por uno** desde `mejoras/PENDIENTES.md`.
- **Nunca subir** `pruebas/`, `propuestas-diseno/` ni `Auditoria-Cuentas-App.md` (excluidos en
  `.git/info/exclude`). No usar `git add -A` ni `git add .`: agregar archivos por nombre.
- Antes de dar algo por terminado, probarlo (ver Pruebas) y reportar con honestidad lo que no se pudo probar.

## Mapa del proyecto

| Ruta | Qué es |
|------|--------|
| `server.js` | Express: cabeceras de seguridad, CSP (`CSP_MODO=bloquear` la activa), rutas, tareas programadas (cron) |
| `db/schema.sql` | Esquema completo; se ejecuta en cada arranque (todo idempotente: `IF NOT EXISTS`) |
| `db/pool.js` | Conexión a Postgres, migración y `repararDatos` al arrancar |
| `middleware/auth.js` | Sesión JWT en cookie, `requireAuth` (401 con `codigo:'SESION'`), `requireAdmin` |
| `middleware/plataforma.js` | Sesión del superadmin del panel (TOTP) |
| `routes/` | API: `auth`, `usuarios` (roles, admin principal), `cuentas`, `tienda`, `reportes`, `historial`, `backups`, `envios` (envíos en duda), `diagnostico` (fallos de fotos a los logs), `push`, `webauthn` (huella), `enlace` ("Entrar con mi teléfono": la compu muestra QR/código, el teléfono lo aprueba), `plataforma` (superadmin) |
| `lib/` | `saldos` (transacciones y bloqueos), `validate`, `fotos` (solo JPEG ≤1.5 MB), `realtime` (WebSocket), `rateLimits`, `totp`, `passwords`, `push`, `webauthn` |
| `jobs/backup.js` | Historial (7 días), respaldo semanal general, respaldo mensual de tienda (día 1) |
| `public/app.js` | Toda la app del teléfono (~2,700 líneas, sin framework) |
| `public/styles.css` | Diseño "Suave", claro/oscuro (`tema.js` pone `data-tema`) |
| `public/recorte.js` | Detección y enderezado de facturas en el teléfono |
| `public/camara.js` | Cámara dentro de la app: foto de factura y lector de QR (`public/vendor/jsQR.js` si el navegador no trae lector) |
| `public/muneco.js`, `ojo.js`, `tema.js`, `sw.js` | Muñequito decorativo, ojito de contraseñas, tema/animaciones, service worker (solo push) |
| `public/vidrio.js` | "Liquid glass" del menú de abajo y de las ventanas: orillas que doblan lo de atrás con arcoíris finito (solo Chrome/Android; sin efecto en iPhone ni con animaciones apagadas) |
| `plataforma/` | Panel del superadmin en `/plataforma` (crear/suspender/eliminar empresas, restablecer contraseñas) |
| `scripts/superadmin.js`, `scripts/respaldo.js` | Crear superadmin; exportar/restaurar la base completa |
| `mejoras/` | **Pendientes** (índice en `PENDIENTES.md`): rendimiento, seguridad, simplificar, tienda, animación. **`POSIBLES-ERRORES.md`**: qué significa cada error conocido; revisarlo primero si el dueño reporta un fallo, y agregar ahí los de cada cambio nuevo |
| `pruebas/` | Pruebas automáticas **locales** (no se suben). Ver `pruebas/LEEME.md` |

## Reglas del dominio que no se deben romper

- Saldos: un **abono suma y un cargo resta**; lo que se debe es `-balance`. En pantalla los montos van **sin
  signo**: verde = por cobrar, rojo = por pagar, gris = cero, "a favor" si se pagó de más.
- Inicio de sesión: `usuario@codigodeempresa`. El usuario se forma del nombre (minúsculas, sin acentos ni
  espacios; validado en servidor con `usuarioValido`).
- Roles: `usuario` / `admin`; el **admin principal** (`es_principal`) no puede ser eliminado ni modificado
  por otros admins. Solo el superadmin crea empresas.
- Guardados con **marca de envío** (`clave_envio`, una por ventana): reintentos no duplican, registros
  iguales a propósito sí se guardan. Envíos "en duda" se anotan en `localStorage` y se aclaran al volver
  la conexión.
- Las ventanas de registro con datos no se cierran con "atrás" ni tocando fuera; borrador en `localStorage`
  que se recupera si el teléfono reinicia la app.
- Cierre de sesión por inactividad: **15 minutos**.
- Tienda (`lib/plazosTienda.js`, hora de Guatemala): se ven **2 meses** (desde el mismo día de hace 2
  meses), solo se borran los del **último mes**, el saldo **empieza de cero cada mes**. Respaldo por mes
  (día 1, 00:01) que se rehace si se borra algo de ese mes; se guardan **5 meses** y no se borra uno sin
  descargar (aviso al admin el mes anterior, bloqueo del admin si ya venció).
  Los respaldos de tienda se arman dentro de Postgres y se descargan por partes (`backups_tienda_movs`):
  nunca juntar todas las fotos de un mes en la memoria del servidor.

## Pruebas

```
bash pruebas/correr.sh                 # todas, cada una con base limpia (tarda varios minutos)
bash pruebas/correr.sh huella-doble    # solo una
```
Para cambios pequeños, correr solo las pruebas relacionadas. Datos de ejemplo: empresa `TIENDASANTAE`,
usuarios `carlos` (admin principal) y `maria`, contraseña `clave1234`. Pruebas nuevas van en
`pruebas/navegador/<nombre>-prueba.js` y salen con código 0/1.

## Commits

Mensajes en español, describiendo el cambio para el dueño. Terminar con la línea de coautoría que indique
el sistema.
