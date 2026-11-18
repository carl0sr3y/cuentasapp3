# Mejoras de rendimiento y costos (Railway)

← [Volver a pendientes](PENDIENTES.md)

Lista de mejoras pendientes, para hacerlas **una por una**. Cada una dice qué problema resuelve, qué se
midió, qué se propone y qué riesgo tiene. Al terminar una, se marca con `[x]` y se anota el commit.

> Revisión hecha el **17/11/2026** con una tienda simulada de mucho uso: 700 movimientos de tienda
> (117 con foto de factura de ~500 KB), 60 cuentas y 2,400 movimientos de cuentas.

## Resumen de la revisión

- **La app ya es barata de mantener.** En reposo el servidor casi no usa procesador (0.02 %), cada
  guardado le cuesta ~8 ms y la memoria se mantiene en ~100–130 MB.
- En Railway lo que más cobra es la **memoria que los dos servicios (la app y Postgres) ocupan todo
  el día**. El tráfico de salida es barato (~0.05 USD por GB).
- Los costos reales por servicio se ven en Railway → **Usage**. Con esos números se puede calcular
  cuánto ahorra cada mejora.

## Orden recomendado

| # | Mejora | Prioridad | Estado |
|---|--------|-----------|--------|
| 1 | Respaldo mensual de tienda sin cargar las fotos en memoria | 🔴 Alta (puede tumbar el servidor) | [ ] Pendiente |
| 2 | Comprimir lo que envía el servidor | 🟡 Media | [ ] Pendiente |
| 3 | Fotos como imagen normal y guardadas en caché | 🟡 Media | [ ] Pendiente |
| 4 | Quitar la revisión de todas las fotos en cada arranque | 🟢 Baja | [ ] Pendiente |
| 5 | Caché del código de la app en el teléfono | 🟢 Baja | [ ] Pendiente |

---

## 1. Respaldo mensual de Movimientos tienda sin cargar las fotos en memoria 🔴

**Qué es:** el día 1 de cada mes, a las 00:01, el servidor arma el respaldo del mes que terminó (con sus
fotos de factura) para que el admin lo descargue (`jobs/backup.js` → `guardarRespaldoMes`). Desde la
mejora 9 de [Tienda](TIENDA.md) los movimientos siguen en la pestaña 2 meses, y el respaldo **se rehace**
si se borra un movimiento de ese mes.

**Problema:** arma todo el respaldo **de una sola vez en la memoria** del servidor, con todas las fotos
(y ahora también cada vez que se rehace). Al descargarlo pasa lo mismo (`routes/backups.js` →
`/tienda/:id/download`).

**Medición:**

| | Resultado |
|---|---|
| Memoria del servidor en reposo | 52 MB |
| Memoria durante el respaldo (117 fotos) | **430 MB** |
| Espacio del respaldo en la base | 76 MB |

Con un mes de mucho uso (por ejemplo 500 fotos) pasaría de **1.5 GB**: el servidor podría caerse a
medianoche y ese respaldo perderse.

**Propuesta:**
1. Armar el respaldo **dentro de Postgres** (copiar los movimientos del mes a una tabla de archivo en
   un solo paso seguro), sin traer las fotos al servidor. Respetar las reglas de la mejora 9 de
   [Tienda](TIENDA.md): el mes sigue en la pestaña y el respaldo se rehace si se borra algo.
2. **Descargar por partes** (de 20 en 20 movimientos). El archivo que recibe el admin sigue siendo el
   mismo JSON de siempre.
3. Los respaldos que ya existen se convierten solos al formato nuevo al arrancar el servidor, uno por
   uno y en segundo plano. Si alguno falla, se queda como estaba y se sigue descargando como antes.

**Beneficio:** la memoria queda estable sin importar cuántas fotos haya en el mes.
**Riesgo:** toca los respaldos. Hay que probarlo con respaldos del formato viejo y del nuevo antes de
subirlo.

---

## 2. Comprimir lo que envía el servidor 🟡

**Problema:** el servidor envía todo **sin comprimir**, tanto el código de la app como los datos.

**Medición:**

| Qué | Sin comprimir | Comprimido |
|---|---|---|
| Código de la app (`app.js`) | 148 KB | 39 KB (74 % menos) |
| Estilos (`styles.css`) | 50 KB | 11 KB (77 % menos) |
| Movimientos de la tienda (`/api/tienda`) | 117 KB | 10 KB (91 % menos) |
| Lista de cuentas (`/api/cuentas`) | 21 KB | 1 KB (92 % menos) |

**Propuesta:** activar la compresión en el servidor (una librería estándar de Express).

**Beneficio:** en dinero ahorra poco, porque el tráfico es barato, pero la app **carga más rápido** y
gasta **menos datos móviles** a los usuarios.
**Riesgo:** bajo. Usa un poco más de procesador al enviar, y no hay que comprimir las fotos (no se
achican).

---

## 3. Fotos como imagen normal y guardadas en caché 🟡

**Problema:** las fotos de factura se guardan y se envían como texto (base64), que pesa **~33 % más**
que la imagen normal. Además, cada vez que alguien abre la misma factura se vuelve a descargar.
El PDF de un mes de tienda descarga todas las fotos (78 MB en la prueba).

**Propuesta:** enviar las fotos como imagen JPEG normal y que el teléfono las guarde en caché, para
que una factura ya vista no se descargue de nuevo. Más adelante se puede cambiar también cómo se
guardan en la base (binario en vez de texto), con lo que la base pesaría ~25 % menos.

**Beneficio:** menos tráfico, facturas que abren más rápido y una base más liviana (las fotos son casi
todo el peso: 79 de 88 MB en la prueba).
**Riesgo:** medio si se cambia cómo se guardan (habría que convertir las fotos existentes). Solo el
envío es de riesgo bajo.

---

## 4. Quitar la revisión de todas las fotos en cada arranque 🟢

**Problema:** en cada arranque (cada `git push`) el servidor **lee todas las fotos** para verificar que
sean JPEG (`db/pool.js` → `repararDatos`). Esa limpieza venía de la auditoría y ya se hizo, porque desde
entonces el servidor solo acepta JPEG.

**Medición:** 0.28 s con 117 fotos, y crece durante el mes.

**Propuesta:** quitarla, o hacerla solo sobre fotos nuevas.
**Beneficio:** arranques más rápidos y menos lectura de disco en Postgres.
**Riesgo:** bajo.

---

## 5. Caché del código de la app en el teléfono 🟢

**Problema:** el código de la app se envía con `Cache-Control: max-age=0`, así que el teléfono pregunta
por cada archivo cada vez que se abre la app.

**Propuesta:** que el teléfono guarde los archivos y solo los vuelva a pedir cuando haya una versión
nueva (al hacer `git push`).
**Beneficio:** la app abre un poco más rápido y hay menos peticiones.
**Riesgo:** bajo, siempre que la versión nueva se detecte bien después de cada despliegue. Hay que
probar que los usuarios reciban los cambios.

---

## No recomendado

- **Poner la app a "dormir" en Railway cuando no se usa** (App Sleeping): la conexión en tiempo real la
  mantendría despierta, y los respaldos automáticos de medianoche no correrían.

## Relacionado (no es de costos)

- **Cámara dentro de la app:** tomar la foto de factura sin salir de Kaab, para que el teléfono no
  reinicie la app al abrir la cámara. Conviene hacerla si los usuarios ven seguido el aviso
  "Recuperamos lo que estabas escribiendo…" o si en Railway → Logs aparecen líneas
  "Foto no procesada".
