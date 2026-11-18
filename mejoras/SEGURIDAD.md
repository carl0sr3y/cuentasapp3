# Mejoras de seguridad

← [Volver a pendientes](PENDIENTES.md)

Lo que quedó pendiente de la auditoría y protecciones nuevas para evaluar. Los detalles técnicos de
cómo se podría atacar la app están en la auditoría local (`Auditoria-Cuentas-App.md`), que a propósito
**no se sube a GitHub**. Aquí solo va lo necesario para decidir.

## Orden recomendado

| # | Mejora | Prioridad | Estado |
|---|--------|-----------|--------|
| 1 | Activar la protección CSP (`CSP_MODO=bloquear`) | 🔴 Alta | [ ] Pendiente (tarea tuya en Railway) |
| 2 | Copia de la base de datos fuera de Railway | 🔴 Alta | [ ] Pendiente (decidir) |
| 3 | Actualizar la librería de la huella (SimpleWebAuthn) | 🟡 Media | [ ] Pendiente |
| 4 | Revisar qué pueden hacer los admins entre sí | 🟡 Media | [ ] Pendiente (decidir) |
| 5 | Transferir el título de admin principal | 🟢 Baja | [ ] Pendiente (decidir) |
| 6 | Que los límites de intentos de inicio de sesión sobrevivan a un despliegue | 🟢 Baja | [ ] Pendiente |
| 7 | Cambiar las llaves de las notificaciones (VAPID) | 🟢 Baja | [ ] Opcional |

---

## 1. Activar la protección CSP 🔴

**Qué es:** una protección del navegador que impide ejecutar código inyectado en la página. Hoy está en
"solo observar": avisa en los registros pero no bloquea.
**Estado:** el código ya está listo. Se activa poniendo la variable `CSP_MODO` con el valor `bloquear`
en Railway. Probado en Chrome sin ningún bloqueo; falta probarlo en iPhone (Safari).
**Qué hacer:** activar la variable, probar en el iPhone y, si algo falla, quitarla (vuelve a "solo
observar" sin tocar código).

## 2. Copia de la base de datos fuera de Railway 🔴

**Problema:** los respaldos automáticos (semanal general y mensual de tienda) se guardan **dentro de la
misma base de datos**. Si la base se perdiera o se dañara, se perderían también los respaldos.
**Qué existe hoy:** el script `scripts/respaldo.js` exporta toda la base a un archivo, pero hay que
correrlo a mano. En su momento se decidió no poner una descarga de toda la base en la app.
**Opciones a decidir:** una copia automática a un almacenamiento externo (con costo pequeño), o un
recordatorio para correr el script de vez en cuando.

## 3. Actualizar la librería de la huella 🟡

**Qué es:** `@simplewebauthn/server` tiene un aviso de seguridad de nivel **bajo** que no aplica a cómo
la usa Kaab. Aun así conviene tenerla al día.
**Riesgo:** es una actualización grande (cambia de versión mayor). Hay que **probar la huella en un
teléfono real** antes de subirla.

## 4. Revisar qué pueden hacer los admins entre sí 🟡

**Hoy:** los admins que no son el principal pueden cambiar la contraseña o eliminar a otros admins que
tampoco son el principal (son iguales entre sí). El principal está protegido.
**A decidir:** si está bien así, o si solo el principal debería poder cambiar contraseñas o eliminar a
otros admins. Mientras tanto: dar el rol de admin solo a personas de mucha confianza.

## 5. Transferir el título de admin principal 🟢

**Hoy no se puede:** si el dueño vende el negocio o deja de administrarlo, nadie puede pasar a ser el
principal. Se podría agregar al panel de plataforma (solo el superadmin podría hacerlo).

## 6. Límites de intentos que sobrevivan a un despliegue 🟢

**Hoy:** los límites de intentos de inicio de sesión (contra quien prueba contraseñas) se guardan en la
memoria del servidor y se reinician con cada `git push`. Es un riesgo bajo; se podrían guardar en la base.

## 7. Cambiar las llaves de las notificaciones 🟢

**Opcional:** las llaves VAPID de las notificaciones push se pueden renovar de vez en cuando. Al
cambiarlas, cada usuario tiene que volver a activar las notificaciones en su teléfono.

---

## Ya revisado y aceptado

- **Conexión con la base de datos sin verificar el certificado** (`rejectUnauthorized: false`): es
  aceptable porque la app y la base hablan por la red interna de Railway. Revisar si algún día se
  conectan por una dirección pública.
