# Mejoras para simplificar

← [Volver a pendientes](PENDIENTES.md)

Ordenar el código para que sea **más fácil y más seguro de cambiar**. Ninguna de estas mejoras cambia
lo que ve el usuario; reducen el riesgo de errores en cambios futuros.

> Revisión hecha el **17/11/2026**.

## Orden recomendado

| # | Mejora | Prioridad | Estado |
|---|--------|-----------|--------|
| 1 | Guardar las pruebas automáticas dentro del proyecto | 🔴 Alta | [ ] Pendiente |
| 2 | Quitar código y estilos que ya no se usan | 🟡 Media | [ ] Pendiente |
| 3 | Unificar la lógica repetida de las ventanas de registro | 🟡 Media | [ ] Pendiente |
| 4 | Dividir `app.js` en varias partes | 🟡 Media | [ ] Pendiente |
| 5 | Limpiar `styles.css` | 🟢 Baja | [ ] Pendiente |

---

## 1. Guardar las pruebas automáticas dentro del proyecto 🔴

**Problema:** cada cambio se probó con pruebas automáticas en un navegador (crear cuentas, guardar
movimientos, cortar la conexión, fotos, huella…). Pero esas pruebas viven en una **carpeta temporal**
que se ha borrado varias veces con los reinicios del equipo, y cada vez hubo que rehacerlas.
**Propuesta:** guardarlas en el proyecto (una carpeta `pruebas/`) con un solo comando para correrlas
todas, siempre sobre una base de datos limpia.
**Beneficio:** antes de cada `git push` se puede comprobar en minutos que nada se rompió. Es la base
para hacer el resto de mejoras con tranquilidad.

## 2. Quitar código y estilos que ya no se usan 🟡

Quedaron restos de funciones que se reemplazaron:
- **Favoritos:** la app ya no los usa, pero siguen la columna `favorito` en la base y la ruta del
  servidor para marcarlos.
- **Tabla `password_resets`:** era de la recuperación de contraseña por correo, que se eliminó.
- **`compressImage`** en `app.js`: reemplazada por el nuevo procesamiento de fotos.
- **Estilos sin uso** en `styles.css`: favoritos (`.fav-chip`, `.fav-row`), estrellas (`.star-btn`) y
  letras de la lista (`.letter-head`).

**Cuidado:** borrar la columna y la tabla elimina datos viejos que ya no sirven. Se puede quitar primero
el código y dejar la base para después.

## 3. Unificar la lógica repetida de las ventanas de registro 🟡

**Problema:** las tres ventanas de registro (abono/cargo, entrada/salida de tienda y crear cuenta)
repiten casi el mismo código: marca de envío, "envío en duda", borrador, botón "Guardando…". Además,
`usuarioDesdeNombre` está copiada en la app y en el panel de plataforma.
**Propuesta:** una sola función común que usen las tres ventanas.
**Beneficio:** si algún día hay que corregir algo en esa lógica, se corrige en un solo lugar.

## 4. Dividir `app.js` en varias partes 🟡

**Problema:** `public/app.js` tiene **2,669 líneas** en un solo archivo (cuentas, tienda, perfil, fotos,
conexión, PDF…). Es difícil de revisar y fácil equivocarse.
**Propuesta:** separarlo por temas (por ejemplo `cuentas.js`, `tienda.js`, `fotos.js`, `perfil.js`,
`conexion.js`).
**Riesgo:** medio. Es un cambio grande sin beneficio visible; conviene hacerlo **después** de tener las
pruebas guardadas (punto 1).

## 5. Limpiar `styles.css` 🟢

**Problema:** el archivo acumuló capas: el diseño anterior, el diseño Suave encima y ajustes posteriores
que se sobrescriben entre sí (883 líneas).
**Propuesta:** reorganizarlo dejando solo las reglas que realmente se aplican.
**Riesgo:** bajo, pero hay que comparar capturas antes y después en claro y oscuro.
