# Menú de abajo "liquid glass" (guardado para usarlo en el futuro)

El 21 y 22 de noviembre de 2026 se probó un rediseño grande de Kaab. El dueño decidió **volver la app a
como estaba antes** (commit `4c90e44`) pero **guardar el menú de abajo de vidrio**, que fue lo que más le
gustó, para incorporarlo más adelante. Aquí está todo lo necesario.

- Estado final de todo el experimento: commit **`162c221`** (se puede ver con `git show 162c221`).
- Primera versión del menú de vidrio: commit `b08cbec` y siguientes (`1147cdd`, `4aa2128`).

## Qué hacía el menú (lo que le gustó al dueño)

1. **Vidrio transparente con forma de píldora**: se ve lo de atrás apenas borroso (`blur(3px) saturate(1.6)`).
   El grosor del vidrio se nota en las orillas con brillo por dentro (`inset` suaves). **Sin borde blanco
   delgado**: el dueño pidió quitarlo, no volver a ponerlo.
2. **Pestaña elegida = gota de vidrio celeste** (`#6E98D6`): orillas más azules y centro claro, luz que entra
   por arriba, reflejo suave arriba a la izquierda y resplandor celeste alrededor. Las tres pestañas usan el
   mismo celeste (antes cada pestaña tenía su color).
3. **La gota se estira como líquido** al cambiar de pestaña (más cuanto más lejos va) y rebota al llegar.
   Se mueve con la propiedad `translate` y se estira con `scale` (si se usa `transform` para moverla, el
   estirón también agranda la distancia y la gota se sale del menú).
4. **Reacciona al dedo**: al apretar, la barra crece apenas (`scale:1.025`), la gota se infla y brilla; otra
   pestaña muestra un vidrio suave bajo el dedo.
5. **Se achica al bajar la lista** (`scale:.84`) y vuelve al subir, al llegar arriba o al tocarlo.
6. **Lupa y arcoíris en las orillas** (solo Chrome/Android): lo que pasa por detrás se dobla en la orilla
   (filtro SVG `feDisplacementMap` en `backdrop-filter`) y cada color (rojo, verde, azul) se dobla un poco
   distinto → arcoíris finito.
7. **Luz en la orilla con el giroscopio** (solo Chrome/Android): una luz que no se ve hace brillar la orilla
   del lado de donde viene, con colores en las puntas del destello; sigue la inclinación del teléfono (o el
   mouse en computadora).

## Archivos de esta carpeta

| Archivo | Qué es | Dónde iba |
|---|---|---|
| `menu.css` | Estilos del menú (vidrio, gota, dedo, achicarse, sombra aparte, lienzo de la luz) | al final de `public/styles.css` |
| `menu-app.js` | Gota que se estira, reacción al dedo, achicarse al bajar | reemplaza en `public/app.js` el bloque "Fondo de color de la pestaña elegida…" hasta antes de `setTabUI()` |
| `vidrio.js` | Lupa + arcoíris + luz con giroscopio | `public/vidrio.js`, cargado al final de `index.html` (`<script src="/vidrio.js">`) |

`vidrio.js` también ponía el vidrio en tarjetas y ventanas. **Para usarlo solo en el menú**, quitar las
secciones "Tarjetas…" y "Ventanas flotantes…" (y su `MutationObserver`); dejar `vigilar(barra, false)`,
la `.tabbar-sombra`, el módulo `brillo` y el control de la luz.

## Lo que se aprendió (importante)

- **Falla de Chrome**: si la pieza con `backdrop-filter: url(#filtro)` (o algo dentro de ella) tiene
  **sombra por fuera**, Chrome corre el filtro hacia adentro (medido: 12 y 21 px en el menú). Por eso la
  sombra del menú va en una pieza aparte, `.tabbar-sombra`, justo detrás. Tampoco debe animarse la
  opacidad del contenedor de una pieza con filtro (también lo descuadra).
- **El brillo de la luz no debe ir dentro del filtro** (`feSpecularLighting`): bajó la app a ~15 cuadros
  por segundo. Se calcula en JavaScript como imagen, una vez por tamaño, y **se dibuja en un `<canvas>`
  propio** de cada pieza. Con imágenes `blob:` en CSS el brillo **parpadeaba** en el teléfono (el navegador
  las volvía a cargar en cada cambio).
- **Giroscopio**: la posición "normal" del teléfono se acomoda despacio (~10 s, `base += … * 0.002`); si se
  acomoda rápido (2 s) la luz parece no reaccionar. Se ignoran los temblores del pulso.
- **iPhone/Safari** no dibuja filtros SVG en `backdrop-filter`: ahí solo queda el vidrio CSS (sin lupa,
  arcoíris ni luz). No hace falta pedir permiso del movimiento.
- **Rendimiento** (teléfono lento simulado, 4× más lento): el menú con lupa y arcoíris no se notó; en las
  tarjetas el arcoíris sí bajaba la fluidez (~170 vs ~235 cuadros). Con animaciones apagadas
  (`data-animaciones="no"`) todo esto se desactiva.
- La prueba `pruebas/navegador/animaciones-prueba.js` revisa que la gota quede exacta bajo la pestaña.

## Otras ideas que se probaron (y se descartaron por ahora)

Vidrio en botones, ventanas y tarjetas; tarjetas sin hora ni inicial con puntas redondas; fondo blanco
(claro) y gris oscuro (oscuro); fondo animado de manchas grises o de colores ("Aurora"). Todo está en el
historial entre `b08cbec` y `162c221`.
