# Cuentas-App

Aplicación web para administrar cuentas de clientes (deudores) y los movimientos internos de una tienda. Node.js/Express + PostgreSQL, con sincronización en tiempo real, notificaciones push, backups automáticos en varios niveles, fotos de facturas, generador de facturas simple, y un panel de plataforma (superadmin) para gestionar empresas y restablecer contraseñas.

## Variables de entorno necesarias en Railway

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | La crea Railway solo al agregar el plugin de PostgreSQL |
| `JWT_SECRET` | **Obligatoria.** Cadena aleatoria de 64+ caracteres para firmar las sesiones. Sin ella la app no arranca en producción |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Notificaciones push (genera con `npx web-push generate-vapid-keys`) |
| `INVITE_CODE` | Opcional. Permite que un negocio cree su empresa desde la pantalla de login. Vacío = desactivado (recomendado: crea las empresas desde el panel de plataforma) |
| `MAX_EMPRESAS` | Cuántas empresas pueden existir en total en la plataforma. Vacío = sin límite. Súbelo cuando quieras aceptar más negocios |

## Cómo desplegar

1. Sube este proyecto a un repositorio de GitHub.
2. En Railway: "New Project" → "Deploy from GitHub repo" → agrega un plugin de PostgreSQL → configura las variables de la tabla de arriba.
3. Al arrancar, el servidor ejecuta `db/schema.sql` automáticamente (crea/actualiza las tablas, no borra nada existente).
4. Abre la URL pública: la primera vez te pide crear tu cuenta de administrador.

## Funciones principales

- **Multiempresa**: cada negocio es una "empresa" independiente, con sus propios usuarios y datos completamente separados de las demás. Se entra con código de empresa + usuario + contraseña. El administrador de cada empresa (uno solo) es el único que puede crear, eliminar y gestionar contraseñas/correos de los usuarios de su empresa — los usuarios normales no pueden cambiar ni su propia contraseña ni su correo, solo el admin puede hacerlo por ellos. Empresas nuevas se crean con el código de invitación (`INVITE_CODE`) y respetando el límite (`MAX_EMPRESAS`).
- **Importante sobre la migración**: la primera vez que este código corre sobre tu base de datos ya existente, se crea automáticamente una empresa llamada "Mi Negocio" con código `EMPRESA1`, y tu usuario más antiguo (el que tenga la fecha de creación más vieja) queda como el único administrador — cualquier otro usuario que ya tuvieras pasa a ser "usuario" normal (pierde la posibilidad de crear/eliminar otros usuarios). Si quieres que sea otra persona la administradora, cambia el campo `rol` de esa fila directamente en la base de datos después del primer despliegue.
- **Contraseñas olvidadas**: no hay recuperación por correo. El admin de cada empresa restablece las de sus usuarios; el superadmin de la plataforma restablece cualquiera (incluidas las de los admins). Tras un restablecimiento, la persona debe elegir una contraseña propia al entrar, y se cierran todas sus sesiones abiertas.
- **Panel de plataforma** (`/plataforma`): para el administrador de toda la web. Lista empresas y usuarios, crea empresas (con contraseña temporal para su admin), suspende/reactiva empresas y restablece contraseñas. No tiene acceso a cuentas ni saldos de las empresas. Exige contraseña + código de app autenticadora, sesión de 15 min de inactividad / 8 h máximo, y registra todo en una bitácora.
  - **Crear o restablecer el superadmin** (no hay registro web): desde tu computadora, con la URL pública de la base (Railway → Postgres → Variables → `DATABASE_PUBLIC_URL`):
    `DATABASE_URL="postgresql://..." node scripts/superadmin.js <usuario>`
    Muestra un QR para la app autenticadora, una contraseña generada y 10 códigos de respaldo de un solo uso.
- **Respaldo completo fuera de Railway** (`scripts/respaldo.js`): descarga TODA la base (fotos incluidas) a un archivo comprimido en tu computadora, y la restaura en una base vacía si hiciera falta. Usa la URL pública de la base (activar TCP Proxy en Postgres → Settings → Networking, y desactivarlo al terminar):
  - Exportar: ` DATABASE_URL="postgresql://..." node scripts/respaldo.js exportar` → `respaldos/cuentasapp-AAAA-MM-DD-HHMM.jsonl.gz`
  - Restaurar (solo en una base vacía): ` DATABASE_URL="postgresql://...nueva..." node scripts/respaldo.js restaurar respaldos/<archivo>`
  - El archivo contiene todos los datos: guárdalo en un lugar privado. La carpeta `respaldos/` está excluida de git.
- **Sincronización en tiempo real** entre dispositivos vía WebSocket, con indicador de estado (verde/amarillo/rojo) junto al nombre de la app.
- **Notificaciones push** reales (funcionan con la app cerrada), activables con el ícono de campana.
- **Fotos de facturas**: se pueden adjuntar al registrar una entrada o salida de tienda (cámara directa en móvil), se comprimen automáticamente, y se incluyen como hojas grandes en el PDF de movimientos.
- **Generador de facturas** simple (producto/precio/cantidad/total → PDF), sin base de datos por ahora.
- **Balance de tienda diario**: se muestra el balance de hoy (se "reinicia" solo cada día porque se calcula por fecha, no hace falta un cron).
- **Retención automática de datos**:
  - Historial general: ventana móvil de 7 días.
  - Backup general (cuentas + movimientos + historial): semanal, lunes-domingo, guarda 4 semanas.
  - Backup de tienda (con fotos y resumen): mensual, guarda 2 meses (y las que no se hayan descargado, hasta 12), se descarga automáticamente la próxima vez que se abre la app tras generarse. Los movimientos de tienda en vivo solo cubren el mes actual (los meses anteriores viven en estos backups).
- **Botón "atrás" del navegador** navega dentro de la app en vez de salir de la página.
- **Modo sin conexión**: si el servidor no responde, se muestra una pantalla de aviso con botón de recargar.

## Estructura

```
server.js                  # Express + WebSocket + cron jobs
db/schema.sql               # Esquema completo (idempotente)
db/pool.js                  # Conexión a Postgres + migración automática
lib/realtime.js             # WebSocket con heartbeat
lib/push.js                 # Notificaciones push (web-push)
lib/totp.js                 # Códigos de app autenticadora (RFC 6238)
lib/rateLimits.js           # Límites de intentos
jobs/backup.js               # Historial rodante, backup general semanal, backup de tienda mensual
scripts/respaldo.js           # Respaldo completo externo (exportar/restaurar)
middleware/auth.js           # JWT en cookie httpOnly + revocación de sesiones en la base
middleware/plataforma.js     # Sesión separada del panel de plataforma
routes/auth.js                # login, cambio obligatorio de contraseña
routes/plataforma.js          # API del panel de plataforma
scripts/superadmin.js         # Crear/restablecer el superadmin
routes/usuarios.js             # crear administradores, cambiar contraseñas
routes/cuentas.js               # CRUD de cuentas + movimientos
routes/tienda.js                 # movimientos de tienda + balance del día
routes/historial.js               # historial general (7 días)
routes/reportes.js                 # datos para el PDF general
routes/backups.js                   # listar/descargar backups (general y tienda)
routes/push.js                       # suscripción a notificaciones push
public/                                # frontend (HTML/CSS/JS vanilla + jsPDF)
plataforma/                            # frontend del panel de plataforma
```
