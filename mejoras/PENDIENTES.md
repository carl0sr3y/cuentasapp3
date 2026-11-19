# Pendientes de Kaab

Índice de todo lo que queda por hacer. Cada lista se revisa **una mejora a la vez**: nada se implementa
sin decidirlo antes. Al terminar una mejora, se marca con `[x]` en su archivo y se anota el commit.

## Listas de mejoras

| Lista | De qué trata | Lo más importante |
|-------|--------------|-------------------|
| [Rendimiento y costos](RENDIMIENTO.md) | Que el servidor gaste menos en Railway y la app vaya más rápida | 🔴 Respaldo mensual de tienda sin cargar fotos en memoria |
| [Seguridad](SEGURIDAD.md) | Lo que quedó pendiente de la auditoría y nuevas protecciones | 🔴 Activar la protección CSP y probarla en iPhone |
| [Simplificar](SIMPLIFICAR.md) | Ordenar el código para que sea más fácil y seguro de cambiar | Quitar código sin uso · rehacer pruebas perdidas |
| [Movimientos tienda](TIENDA.md) | Ideas para mejorar la pestaña de tienda | Ver los meses anteriores dentro de la app |
| [Animación](ANIMACION.md) | Ideas para que la app se sienta más viva | ✅ Todas hechas (18/11/2026) |

## Si algo falla

[Posibles errores](POSIBLES-ERRORES.md): qué significa cada mensaje de error de los cambios recientes en
Railway → Logs, qué cosas son normales y qué hacer.

## Pruebas automáticas

Antes de un `git push` grande: `bash pruebas/correr.sh` (la carpeta `pruebas/` solo existe en tu
computadora; no se sube). Instrucciones en `pruebas/LEEME.md`.

## Tareas tuyas (no requieren código)

- [ ] **Subir los commits pendientes** con `git push origin main` cuando haya alguno.
- [ ] **Activar `CSP_MODO=bloquear`** en Railway → servicio de la app → Variables, y probar la app en el
      iPhone (entrar, ver cuentas, registrar un movimiento, generar un PDF, entrar con huella). Si algo
      falla, borrar la variable. Detalle en [Seguridad](SEGURIDAD.md).
- [ ] **Pedir a los usuarios** que reportaron el problema de la huella que prueben la versión nueva
      (incluye el caso de tocar el botón mientras la huella ya se está pidiendo).
- [ ] **Confirmar con los usuarios** que al agregar una salida con foto ya no se cierra la ventana. Si ven
      seguido "Recuperamos lo que estabas escribiendo…", conviene hacer la cámara dentro de la app
      ([Movimientos tienda](TIENDA.md) #5).
- [ ] **Revisar de vez en cuando Railway → Logs** buscando "Foto no procesada". Si aparece, compartir
      esa línea para saber la causa exacta.
- [ ] **Revisar Railway → Usage** y compartir cuánto cuesta cada servicio (la app y Postgres) para
      calcular cuánto ahorra cada mejora de rendimiento.
- [ ] *(Opcional)* **Configurar las credenciales de GitHub** para que yo pueda hacer los `git push`.

## Ideas sueltas pendientes

- **Cámara dentro de la app** para las fotos de factura (que el teléfono no reinicie Kaab al abrir la
  cámara). Está anotada en [Movimientos tienda](TIENDA.md).
