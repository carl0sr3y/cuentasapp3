# Mejoras de animación

← [Volver a pendientes](PENDIENTES.md)

Ideas para que la app se sienta más viva. Todas respetarían el ajuste de **Animaciones** del perfil:
si están desactivadas, o el teléfono es de bajos recursos, no se mostrarían.

## Lista

| # | Mejora | Estado |
|---|--------|--------|
| 1 | Confirmación visual al guardar | [x] Hecho (palomita ✓ en el botón) |
| 2 | Pantallas de carga con la forma del contenido | [x] Hecho |
| 3 | Indicador que se desliza en el menú de pestañas | Quitado el 25/11/2026 (el dueño prefirió la pestaña elegida sin fondo; ahora se deslizan los íconos) |
| 4 | Más acciones del muñequito | [x] Festeja abonos y duerme de noche (tocarlo para que salude: no, para no estorbar) |
| 5 | Vibración corta al guardar | [x] Hecho (al guardar y al eliminar; solo Android) |
| 6 | La tarjeta de la cuenta crece hasta su pantalla | [x] Hecho (navegadores recientes; en los demás, la animación de antes) |
| 7 | Montos que destellan al cambiar | [x] Hecho |

Hechas el 18/11/2026 (ver el commit "Animaciones avanzadas"). Qué puede notarse y qué es normal:
[Posibles errores](POSIBLES-ERRORES.md#animaciones-avanzadas).

---

## 1. Confirmación visual al guardar

**Hoy:** al guardar aparece un aviso de texto ("Cargo registrado") y la fila nueva se resalta.
**Idea:** una palomita ✓ breve en el botón Guardar antes de cerrar la ventana, para que se note que quedó
guardado.

## 2. Pantallas de carga con la forma del contenido

**Hoy:** mientras carga se lee "Cargando…".
**Idea:** mostrar tarjetas grises con la forma de la lista mientras llegan los datos (lo que usan muchas
apps). Se siente más rápido aunque tarde lo mismo.

## 3. Indicador que se desliza en el menú de pestañas

**Hoy:** al cambiar de pestaña, el color de la pestaña elegida cambia de golpe.
**Idea:** que el fondo de color se deslice de una pestaña a la otra.

## 4. Más acciones del muñequito

**Ideas:**
- que celebre (salte) cuando se registra un abono;
- que se duerma de noche;
- que se pueda tocar para que salude. Ojo: hoy **no recibe toques a propósito**, para no estorbar al
  abrir cuentas. Habría que cuidar eso.

## 5. Vibración corta al guardar

**Idea:** una vibración muy breve en el teléfono al guardar o al eliminar. Funciona en Android; el
iPhone no lo permite desde el navegador.
