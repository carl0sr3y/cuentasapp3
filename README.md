# Cuentas-App

Aplicación web para administrar cuentas de clientes (deudores) y los movimientos internos de una tienda. Backend en Node.js/Express con base de datos PostgreSQL y sincronización en tiempo real entre dispositivos, lista para desplegar en Railway (o cualquier host compatible con Node.js + PostgreSQL).

## Estructura del proyecto

```
cuentas-app-railway/
├── server.js              # Servidor Express + WebSocket + cron jobs
├── package.json
├── railway.json            # Configuración de despliegue para Railway
├── .env.example
├── db/
│   ├── schema.sql          # Tablas: usuarios, cuentas, movimientos_cuentas, movimientos_tienda, historial_general, backups
│   └── pool.js             # Conexión a PostgreSQL + migración automática al iniciar
├── lib/
│   └── realtime.js         # WebSocket: notifica a los demás dispositivos cuando algo cambia
├── jobs/
│   └── backup.js           # Genera la copia de seguridad diaria y borra las vencidas (48h)
├── middleware/
│   └── auth.js             # Autenticación por JWT en cookie httpOnly (30 días)
├── routes/
│   ├── auth.js              # /api/auth/* (setup inicial, login, logout, status)
│   ├── usuarios.js           # /api/usuarios/* (crear administradores, cambiar contraseñas)
│   ├── cuentas.js            # /api/cuentas/* (CRUD + abonos/cargos, datos compartidos)
│   ├── tienda.js              # /api/tienda/* (entradas/salidas, datos compartidos)
│   ├── historial.js           # /api/historial
│   ├── reportes.js            # /api/reportes/general (para el PDF general)
│   └── backups.js             # /api/backups (listar y descargar; sin ruta de borrado)
└── public/
    ├── index.html
    ├── styles.css           # Modo oscuro (gris) + indicador de sincronización
    └── app.js               # Interfaz, WebSocket, PDFs
```

## Qué hay de nuevo en esta versión

1. **Dos administradores.** El primero se crea en el setup inicial. Desde el ícono de avatar (arriba a la derecha) cualquier administrador puede crear al segundo y cambiar contraseñas (la propia pide confirmar la actual; la de otro administrador no, se asume confianza entre ambos).
2. **Sincronización en tiempo real.** Los dos administradores ven los mismos datos (ya no están separados por usuario). Cuando uno hace un cambio, el otro dispositivo lo recibe al instante por WebSocket, sin recargar la página.
3. **Indicador de sincronización.** El punto junto al nombre de la app: verde = sincronizado, amarillo parpadeando = sincronizando, rojo = sin conexión en tiempo real (revisa tu internet).
4. **Sesión de 30 días.** Ya estaba así desde la primera versión (cookie con `expiresIn: '30d'`).
5. **Autoría de movimientos.** Cada abono, cargo, entrada o salida ahora muestra quién lo registró, junto a la hora.
6. **Copias de seguridad automáticas.** Cada día a las 11:30pm (hora de Guatemala) se genera una copia de las cuentas, movimientos e historial. Se puede descargar desde la pantalla de Historial general, pero no hay ninguna opción para borrarla manualmente — se elimina sola 48 horas después de creada (hay un trabajo programado que revisa esto cada hora).

## Cómo desplegar en Railway

1. **Sube este proyecto a un repositorio de GitHub** (reemplaza el contenido de tu repo actual con esta versión, o haz commit de los cambios).
   ```
   git add .
   git commit -m "Multiusuario, tiempo real y backups automáticos"
   git push
   ```
2. Railway vuelve a desplegar automáticamente. **No necesitas tocar nada en la base de datos**: al arrancar, el servidor ejecuta `db/schema.sql`, que usa `ADD COLUMN IF NOT EXISTS` para agregar las columnas nuevas sin borrar tus datos existentes.
3. Confirma que la variable `JWT_SECRET` siga configurada (si ya la tenías, no hace falta hacer nada).
4. Railway soporta WebSockets sin configuración adicional — no necesitas abrir puertos ni cambiar nada para que la sincronización en tiempo real funcione.

## Desarrollo local

```
npm install
cp .env.example .env      # edita DATABASE_URL con tu Postgres local
npm start
```

## Notas técnicas

- **Datos compartidos:** `cuentas` y `movimientos_tienda` ya no se filtran por usuario — ambos administradores ven y editan el mismo negocio. El campo `usuario_id` en cada tabla ahora solo indica "quién lo creó/registró", no de quién es.
- **Tiempo real:** cada pestaña/dispositivo genera un `clientId` aleatorio al cargar. Cuando hace un cambio, el servidor avisa a todos los demás `clientId` conectados por WebSocket (`/ws`) para que refresquen esa parte de los datos — el dispositivo que originó el cambio no se refresca a sí mismo, porque ya actualizó su propia pantalla al recibir la respuesta de la API.
- **Backups:** se guardan como una fila JSON dentro de la propia base de datos (tabla `backups`), no como archivos en disco — así sobreviven a reinicios del servidor. No incluyen contraseñas de usuarios, solo cuentas, movimientos e historial. La limpieza de backups vencidos corre cada hora y también al arrancar el servidor.
- **PDFs:** se generan en el navegador con jsPDF + jspdf-autotable, incluyendo ahora la columna "Registrado por".
