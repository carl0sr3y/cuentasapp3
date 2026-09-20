# Cuentas-App

Aplicación web para administrar cuentas de clientes (deudores) y los movimientos internos de una tienda. Node.js/Express + PostgreSQL, con sincronización en tiempo real, notificaciones push, backups automáticos en varios niveles, fotos de facturas, generador de facturas simple, y ahora registro con código de invitación + recuperación de contraseña por correo.

## Variables de entorno necesarias en Railway

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | La crea Railway solo al agregar el plugin de PostgreSQL |
| `JWT_SECRET` | Cadena aleatoria larga para firmar las sesiones |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Notificaciones push (genera con `npx web-push generate-vapid-keys`) |
| `INVITE_CODE` | Código que le das a alguien de confianza para que pueda registrarse solo. Vacío = registro desactivado |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Cuenta de Gmail para enviar los correos de recuperación de contraseña (usa una "contraseña de aplicación", no la contraseña normal: https://myaccount.google.com/apppasswords — requiere tener la verificación en dos pasos activada en esa cuenta de Gmail) |

## Cómo desplegar

1. Sube este proyecto a un repositorio de GitHub.
2. En Railway: "New Project" → "Deploy from GitHub repo" → agrega un plugin de PostgreSQL → configura las variables de la tabla de arriba.
3. Al arrancar, el servidor ejecuta `db/schema.sql` automáticamente (crea/actualiza las tablas, no borra nada existente).
4. Abre la URL pública: la primera vez te pide crear tu cuenta de administrador.

## Funciones principales

- **Multiusuario**: cualquier administrador puede crear a otro desde el ícono de avatar, o las personas pueden registrarse solas si tienen el código de invitación (`INVITE_CODE`).
- **Recuperar contraseña**: desde la pantalla de login, "¿Olvidaste tu contraseña?" pide el correo, envía un código de 4 dígitos (vence en 15 minutos), y permite definir una nueva contraseña.
- **Sincronización en tiempo real** entre dispositivos vía WebSocket, con indicador de estado (verde/amarillo/rojo) junto al nombre de la app.
- **Notificaciones push** reales (funcionan con la app cerrada), activables con el ícono de campana.
- **Fotos de facturas**: se pueden adjuntar al registrar una entrada o salida de tienda (cámara directa en móvil), se comprimen automáticamente, y se incluyen como hojas grandes en el PDF de movimientos.
- **Generador de facturas** simple (producto/precio/cantidad/total → PDF), sin base de datos por ahora.
- **Balance de tienda diario**: se muestra el balance de hoy (se "reinicia" solo cada día porque se calcula por fecha, no hace falta un cron).
- **Retención automática de datos**:
  - Historial general: ventana móvil de 7 días.
  - Backup general (cuentas + movimientos + historial): semanal, lunes-domingo, guarda 4 semanas.
  - Backup de tienda (con fotos y resumen): mensual, guarda 2 meses, se descarga automáticamente la próxima vez que se abre la app tras generarse. Los movimientos de tienda en vivo solo cubren el mes actual (los meses anteriores viven en estos backups).
- **Botón "atrás" del navegador** navega dentro de la app en vez de salir de la página.
- **Modo sin conexión**: si el servidor no responde, se muestra una pantalla de aviso con botón de recargar.

## Estructura

```
server.js                  # Express + WebSocket + cron jobs
db/schema.sql               # Esquema completo (idempotente)
db/pool.js                  # Conexión a Postgres + migración automática
lib/realtime.js             # WebSocket con heartbeat
lib/push.js                 # Notificaciones push (web-push)
lib/mailer.js               # Envío de correos (nodemailer + Gmail)
jobs/backup.js               # Historial rodante, backup general semanal, backup de tienda mensual
middleware/auth.js           # JWT en cookie httpOnly (30 días)
routes/auth.js                # setup, login, registro con código, recuperar/restablecer contraseña
routes/usuarios.js             # crear administradores, cambiar contraseñas
routes/cuentas.js               # CRUD de cuentas + movimientos
routes/tienda.js                 # movimientos de tienda + balance del día
routes/historial.js               # historial general (7 días)
routes/reportes.js                 # datos para el PDF general
routes/backups.js                   # listar/descargar backups (general y tienda)
routes/push.js                       # suscripción a notificaciones push
public/                                # frontend (HTML/CSS/JS vanilla + jsPDF)
```
