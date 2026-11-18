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
| 5 | Cámara dentro de la app | [ ] Por evaluar (pedido tuyo) |
| 6 | Respaldo del mes en un formato fácil de leer | [ ] Por evaluar |
| 7 | Categorías de gastos | [ ] Por evaluar |
| 8 | Cierre de caja diario | [ ] Por evaluar |

---

## 1. Ver los meses anteriores dentro de la app

**Hoy:** el día 1 de cada mes, los movimientos del mes anterior se archivan en un respaldo y
desaparecen de la lista. Solo se pueden descargar como archivo JSON, que no es fácil de leer.
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
