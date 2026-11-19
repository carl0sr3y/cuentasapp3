# Mejoras para la pestaña Movimientos tienda

← [Volver a pendientes](PENDIENTES.md)

Ideas para evaluar una por una. Algunas son pedidos tuyos y otras propuestas; decide cuáles valen la
pena para tu negocio.

## Lista

| # | Mejora | Estado |
|---|--------|--------|
| 1 | Ver los meses anteriores dentro de la app | [ ] Por evaluar |
| 2 | Resumen del día: entradas, salidas y neto | [ ] Por evaluar |
| 3 | Filtros: solo entradas, solo salidas, con factura, por fecha | [ ] Por evaluar |
| 4 | Editar un movimiento | [ ] Por evaluar |
| 5 | Cámara dentro de la app | [x] Hecho (ver commit "Cámara dentro de Kaab…") |
| 6 | Respaldo del mes en un formato fácil de leer | [ ] Por evaluar |
| 7 | Categorías de gastos | [ ] Por evaluar |
| 8 | Cierre de caja diario | [ ] Por evaluar |
| 9 | Ver 2 meses en vivo, borrar solo el último mes y respaldos de 5 meses | [x] Hecho (ver commit "Tienda: 2 meses en vivo…") |

---

## 1. Ver los meses anteriores dentro de la app

**Hoy:** se ven los últimos 2 meses (mejora 9); lo anterior queda solo en los respaldos. Solo se pueden descargar como archivo JSON, que no es fácil de leer.
**Idea:** un selector de mes para ver y buscar movimientos de meses archivados, con sus fotos.

## 2. Resumen del día

**Hoy:** solo se ve el "Balance de hoy".
**Idea:** mostrar también cuánto entró y cuánto salió hoy, por separado.

## 3. Filtros

**Hoy:** solo está el buscador.
**Idea:** botones para ver solo entradas, solo salidas, solo los que tienen factura o un rango de fechas.

## 4. Editar un movimiento

**Hoy:** si algo se registró mal, hay que eliminarlo y registrarlo de nuevo.
**Idea:** poder corregir la descripción o el monto, dejando constancia en el historial de quién lo cambió.

## 5. Cámara dentro de la app

**Problema:** al tomar la foto de la factura, Kaab abre la aplicación de cámara del teléfono y queda en
segundo plano. En teléfonos con poca memoria, el sistema puede reiniciar Kaab. Hoy eso está mitigado
(el borrador reabre la ventana), pero la foto se tiene que tomar de nuevo.
**Idea:** que la cámara se abra dentro de Kaab, sin salir de la app.
**Hecho (19/11/2026):** "Tomar o elegir foto" abre la cámara de Kaab (`public/camara.js`), con botón de
galería y linterna si el teléfono la tiene. Si el teléfono no deja usarla, se usa la cámara del sistema
como antes. La misma cámara lee el QR de "Conectar una computadora".
**Señal de que conviene:** usuarios que ven seguido "Recuperamos lo que estabas escribiendo…" o líneas
"Foto no procesada" en Railway → Logs.

## 6. Respaldo del mes en un formato fácil de leer

**Hoy:** el respaldo mensual se descarga como JSON (pensado para restaurar datos, no para leerlo).
**Idea:** descargarlo también como PDF o Excel. Se relaciona con la mejora 1 de
[Rendimiento](RENDIMIENTO.md), que cambia cómo se arma ese respaldo.

## 7. Categorías de gastos

**Idea:** elegir una categoría al registrar una salida (luz, proveedores, sueldos, etc.) para saber en
qué se va el dinero cada mes.

## 8. Cierre de caja diario

**Idea:** al final del día, comparar lo que dice la app con el efectivo contado y dejar registrado el
cierre (con diferencia, si la hay).

## 9. Ver 60 días en vivo, bloqueo a los 30 días y respaldos de 5 meses

**Pedido tuyo (18/11/2026). Hecho el 18/11/2026.** Prueba automática: `bash pruebas/correr.sh tienda-plazos`.

**Hoy:** la pestaña muestra solo el mes actual. El día 1 el mes anterior pasa al respaldo y desaparece
de la lista. Se guardan 2 respaldos más los no descargados (hasta 12).

**Lo que se decidió** (ejemplo con hoy = 18 de noviembre; todo avanza solo, día por día, en cualquier mes):

| Días | ¿Se ve en la pestaña? | ¿Se puede borrar? |
|---|---|---|
| Últimos 30 días (19 oct – 18 nov) | Sí | Sí |
| De 31 a 60 días atrás (18 sep – 18 oct) | Sí | **No**, solo verlo |
| Más de 60 días atrás | No (solo en el respaldo) | No |

- La regla es **igual para todos**, también para los administradores.
- **Saldo:** sigue empezando de cero cada mes, como hoy.
- **Respaldos:** se crean el **día 1 de cada mes a las 00:01** con el mes que terminó, aunque esos
  movimientos todavía se vean en la pestaña. Si después se borra un movimiento de un mes que ya tiene
  respaldo, **el respaldo se actualiza solo**.
- Se guardan solo los **últimos 5 meses** de respaldos. Ejemplo: en noviembre quedan junio a octubre; el
  1 de diciembre se crea el de noviembre y el de junio se borra para siempre.
- **Aviso:** desde el día 1 del mes anterior al borrado (en el ejemplo, todo noviembre para el de junio)
  sale un **aviso grande, sin bloquear**, para descargarlo.
- **Si llega el día del borrado y nadie lo descargó:** no se borra; la app **se bloquea hasta que se
  descargue**, y esa misma noche se borra.
- El aviso y el bloqueo son **solo para administradores** (solo ellos pueden descargar respaldos); los
  usuarios normales siguen trabajando.
- Si en un mes no hubo movimientos de tienda, ese mes no tiene respaldo.

**Cómo quedó hecho:** las fechas y plazos están en `lib/plazosTienda.js` (hora de Guatemala). Cada noche
a las 00:01, y cada vez que arranca el servidor, se revisa todo (`jobs/backup.js`): se crean los
respaldos que falten, se rehacen los que tengan un borrado, se quitan de la base los meses que ya no se
ven y se borran los respaldos viejos ya descargados. Un respaldo cuenta como descargado cuando el archivo
termina de enviarse completo.
