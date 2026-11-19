# Posibles errores y qué significan

← [Volver a pendientes](PENDIENTES.md)

Lista de lo que podría fallar en los cambios recientes, para reconocerlo rápido. Los mensajes con
comillas aparecen en **Railway → servicio de la app → Logs**. Si ves uno, compárteme la línea completa.

---

## Movimientos tienda y sus respaldos

Cambios del 18/11/2026: [Tienda #9](TIENDA.md) (2 meses en vivo, 5 meses de respaldos, aviso y bloqueo)
y [Rendimiento #1](RENDIMIENTO.md) (respaldos por partes).

### Mensajes en los Logs

| Mensaje (empieza así) | Qué significa | ¿Se pierde algo? | Qué hacer |
|---|---|---|---|
| `Respaldo de tienda "…" (id …) no se pudo convertir; se queda como estaba:` | Un respaldo de antes del cambio no se pudo pasar al formato nuevo. Lo que va después de los dos puntos dice por qué. | No. Se queda igual y se sigue descargando a la manera vieja (usa más memoria). | Compartirme la línea. Se vuelve a intentar en cada arranque. |
| `Error con los respaldos de tienda:` | Falló la revisión de cada noche (00:01) o la del arranque: crear respaldos, rehacerlos, quitar meses viejos de la pestaña o borrar respaldos de más de 5 meses. | No. Los movimientos no se quitan de la base mientras su respaldo no esté listo. | Compartirme la línea. Se repite sola la noche siguiente. |
| `Respaldo … (empresa …): X de Y movimientos` | La comprobación al armar un respaldo encontró que no coinciden los movimientos copiados. El respaldo no se guarda. | No. Queda como estaba antes. | Compartirme la línea: es un error que no debería pasar. |
| `Error rehaciendo respaldo de tienda:` | Alguien borró un movimiento del mes pasado y el respaldo de ese mes no se pudo rehacer en ese momento. | No. Queda marcado y se rehace en la noche o al descargarlo. | Nada, salvo que se repita mucho. |
| `Error enviando respaldo de tienda:` | La descarga de un respaldo se cortó por un problema del servidor o de la base. | No. Esa descarga no cuenta como descargada. | Volver a descargar. Si se repite, compartirme la línea. |
| `Error marcando respaldo descargado:` | El archivo se descargó, pero no se pudo anotar que se descargó. | No. | El aviso puede volver a salir: descargarlo otra vez lo arregla. |
| `Error convirtiendo respaldos de tienda:` | Falló la conversión de respaldos viejos en general (por ejemplo, la base no respondía al arrancar). | No. | Se reintenta en el siguiente arranque. |

### Cosas que puedes notar en la app (y si son normales)

| Lo que ves | ¿Es normal? | Explicación |
|---|---|---|
| En la pestaña de tienda solo se ve noviembre (justo después de subir el cambio) | Sí | Octubre ya se había pasado al respaldo el 1 de noviembre con la regla anterior. Desde diciembre se verán 2 meses. |
| "Este movimiento tiene más de un mes: ya no se puede eliminar." | Sí | Es la regla nueva: solo se borran los del último mes. |
| El aviso de descargar un respaldo vuelve a salir aunque ya lo descargaste | Normalmente sí | Si alguien borró un movimiento de ese mes, el respaldo se rehízo y hay que bajar la copia nueva. Si pasa sin que nadie haya borrado nada, avisarme. |
| La app de un administrador queda bloqueada pidiendo descargar un respaldo | Sí | Ese respaldo ya cumplió 5 meses y nadie lo había descargado. Tocar "Descargar" lo quita. |
| **Tocas "Descargar" en el bloqueo y no se quita** | **No** | Probablemente el teléfono no terminó de bajar el archivo (en el iPhone puede abrir una pantalla para guardarlo). Volver a la app y tocar otra vez. Si sigue, avisarme: puede ser la forma en que el iPhone descarga. |
| El respaldo de un mes no aparece en la lista | Depende | Si ese mes no hubo movimientos de tienda, no se crea respaldo (es normal). Si sí hubo, buscar "Error con los respaldos de tienda" en los Logs. |
| En Railway la memoria sube unos 150–200 MB un momento al descargar un respaldo | Sí | Es memoria de trabajo que se suelta enseguida. No crece con el número de fotos. |

### Pistas técnicas (para revisar el código)

- Plazos y fechas (hora de Guatemala): `lib/plazosTienda.js`.
- Revisión diaria y al arrancar: `jobs/backup.js` → `asegurarRespaldosTienda`, `guardarRespaldoMes`,
  `convertirRespaldosViejos`. Se programa en `server.js` (cron `1 0 * * *`).
- Descarga por partes, avisos y "descargado": `routes/backups.js` (`/tienda/avisos`, `/tienda/:id/download`;
  se marca descargado en `res.on('finish')` solo si `version` no cambió).
- Aviso y bloqueo en el teléfono: `public/app.js` → `revisarAvisosRespaldos` (también se llama al volver a
  la app, en `visibilitychange`).
- Tablas: `backups_tienda` (columnas `mes`, `desactualizado`, `en_partes`, `version`) y
  `backups_tienda_movs` (un movimiento por fila).
- Pruebas: `bash pruebas/correr.sh tienda-plazos respaldo-partes`.
