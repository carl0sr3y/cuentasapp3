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

---

## Animaciones avanzadas

Cambio del 18/11/2026: [Animación](ANIMACION.md) #1 a #7. Son solo de la pantalla del teléfono: no tocan el
servidor ni los datos, así que **no dejan mensajes en los Logs**. Si algo se ve raro, se puede apagar todo
en Perfil → Apariencia → Animaciones, y la app funciona igual.

### Cosas que puedes notar en la app (y si son normales)

| Lo que ves | ¿Es normal? | Explicación |
|---|---|---|
| En un iPhone o teléfono viejo la cuenta no "crece", se desliza como antes | Sí | Esa animación necesita un navegador reciente (Chrome 111+ o iPhone con iOS 18+). En los demás queda la de siempre. |
| El teléfono no vibra al guardar | Sí, en iPhone | El iPhone no permite vibrar desde una página web. En Android sí vibra (si las animaciones están activas). |
| Nada se anima, ni la palomita | Sí, si el teléfono es modesto | Con "Automático", la app apaga las animaciones en teléfonos con poca memoria o si el teléfono tiene "reducir movimiento". Se pueden forzar en Perfil → Apariencia. |
| El muñequito está dormido | Sí, de 9 p. m. a 6 a. m. | Usa la hora del teléfono. |
| El muñequito no festejó un abono | Normal a veces | Solo se ve en la lista de cuentas: festeja al volver a la lista si es dentro del minuto siguiente al abono. |
| La ventana tarda medio segundo más en cerrarse al guardar | Sí | Es la palomita ✓. El registro ya está guardado en ese momento; la pausa es solo visual. |
| Al abrir o cerrar una cuenta la pantalla se queda "congelada" un momento | **No** | Avísame con el modelo del teléfono. Mientras, apagar las animaciones en el perfil lo evita. |

### Pistas técnicas (para revisar el código)

- `exitoEnBoton` (app.js): palomita y pausa de 480 ms antes de `closeModal`; `conBotonOcupado` no
  restaura el texto si el botón tiene `.exito`.
- `transicionVista` / `marcarTransicion` / `limpiarNombresTransicion`: View Transitions con el nombre
  `cuenta-abierta` (la tarjeta ↔ `#detailPage`). Al volver, `applyHistoryState` la usa solo si va a una
  pestaña y no hay ventana abierta; si no, `aplicarEstadoHistorial` normal.
- El fondo de la pestaña elegida que se deslizaba (`.tab-indicador`) se quitó el 25/11/2026: ver "Íconos en las pestañas de abajo".
- `esqueletoCargaHtml`: pantalla de carga; el brillo es un `::after` que solo se traslada.
- `animarSaldos`: clase `.destella` cuando un monto ya mostrado cambia.
- muneco.js: `KaabMuneco.celebrar()` (modo `festeja`) y `esDeNoche()` (clase `duerme`).
- Prueba local: `bash pruebas/correr.sh animaciones`.

---

## Saldo a favor en dorado

Cambio del 18/11/2026. Solo cambia colores y textos en el teléfono: no toca cómo se guardan ni se calculan
los saldos, y no deja mensajes en los Logs.

| Lo que ves | ¿Es normal? | Explicación |
|---|---|---|
| El botón dice "Abono a favor" y es dorado | Sí, si la cuenta está en cero o ya a favor | Lo que se abone ahí no paga deuda: queda a favor. Si la cuenta debe algo, el botón vuelve a ser "Abono" verde. |
| Un abono que pagó de más dice solo "Abono registrado" | Sí | El botón y la ventana se deciden al abrirla: la cuenta debía algo. El saldo sí queda dorado "a favor" después. |
| Una cuenta en Q 0.00 se ve gris | Sí | Gris = en cero; dorado = a favor; verde = te deben; rojo = debes. |


---

## Cuentas con nombre repetido

Cambio del 18/11/2026. Al crear una cuenta, el servidor revisa si ya hay otra **del mismo tipo** (por cobrar
o por pagar) con ese nombre. Mayúsculas, acentos y espacios de más no cuentan: "Juan Pérez" = "juan perez".
No deja mensajes en los Logs.

| Lo que ves | ¿Es normal? | Explicación |
|---|---|---|
| "Ya existía la cuenta «…». Te llevé a ella." | Sí | No se creó otra: se abrió la que ya estaba, con su nombre original. |
| Hay "Juan Pérez" en por cobrar y en por pagar | Sí | El mismo nombre sí se permite en los dos tipos. |
| Hay dos cuentas iguales del mismo tipo | Sí, si son de antes de este cambio | Las que ya existían no se tocaron. Se pueden eliminar o dejar; las nuevas ya no se repiten. |
| "Juan Perez" y "Juan Pérez López" son cuentas distintas | Sí | Solo se consideran iguales si el nombre es el mismo, letra por letra, sin contar acentos ni mayúsculas. |

### Pistas técnicas (para revisar el código)

- `POST /api/cuentas` (routes/cuentas.js): transacción con `pg_advisory_xact_lock(7311, empresa_id)`, así
  dos creaciones al mismo tiempo no se cuelan. Orden: primero la marca de envío (`repetido`), luego el
  nombre (`nombreComparable`) → responde 200 con la cuenta existente y `existente: true`.
- App: `openCreateAccountModal` cierra la ventana y llama `openAccountDetail` si llega `existente`.
- Prueba local: `bash pruebas/correr.sh nombre-repetido`.

---

## Entrar con mi teléfono (abrir la sesión en una computadora)

Cambio del 18/11/2026. En la computadora sale el botón **"Entrar con mi teléfono"** (solo en
computadoras); muestra un QR y un código de 8 números. En el teléfono: **Perfil → Conectar una
computadora** (o escanear el QR), y aprobar con huella o contraseña.

### Cosas que puedes notar en la app (y si son normales)

| Lo que ves | ¿Es normal? | Explicación |
|---|---|---|
| "El código venció. Genera otro…" en la computadora | Sí | Cada código dura 2 minutos y sirve una sola vez. |
| "Ese código no existe o ya venció" en el teléfono | Sí | Números mal escritos, el código ya venció o ya se usó. Generar otro en la computadora. |
| Se reinició el servidor (por ejemplo, al subir un cambio) y el código dejó de servir | Sí | Los códigos pendientes viven en la memoria del servidor. Generar otro. |
| La computadora se sale sola después de un rato | Sí | Igual que el teléfono: 15 minutos sin uso. Además, la sesión de la computadora dura **máximo 12 horas**. |
| La computadora se salió sin que nadie la tocara | Sí, si alguien la cerró desde el perfil, cambió la contraseña o se restableció | Las sesiones de computadora se cierran a distancia desde **Perfil → Usar en una computadora → Cerrar**. |
| "Esto se aprueba desde tu teléfono, no desde otra computadora" | Sí | Una computadora conectada así no puede aprobar a otra. |
| "Demasiados intentos. Espera unos minutos." | Sí | 15 intentos fallidos (código o contraseña equivocados) en 15 minutos por usuario. |
| El QR abre el navegador del teléfono en vez de la app instalada | Depende del teléfono | En el navegador hay que tener la sesión iniciada. Escribir los 8 números dentro de la app siempre funciona. |
| No sale el botón "Entrar con mi teléfono" | Sí en teléfonos, tabletas y ventanas angostas | Solo aparece con ratón/trackpad y una pantalla de al menos 900 px de ancho. |
| La computadora pide **crear un PIN** después de aprobarla | Sí, si marcaste "Es mi computadora" | Se crea una sola vez. Si no se crea en 10 minutos, esa aprobación ya no sirve y hay que pedir otro código. |
| "Ese PIN es muy fácil de adivinar" | Sí | No se aceptan seis números iguales (111111) ni seguidos (123456, 987654). |
| La computadora pide el PIN aunque nadie la tocó | Sí | Pasaron 15 minutos sin usarla (mover el ratón o escribir cuenta como uso). La sesión sigue abierta: solo está bloqueada. |
| "PIN equivocado 5 veces: se cerró la sesión…" | Sí | Protección contra quien intente adivinarlo. Volver a entrar con el teléfono y crear un PIN nuevo. |
| Se me olvidó el PIN | Sí | En el candado, **"Olvidé mi PIN"**: cierra esa sesión y muestra el código para aprobarla otra vez desde el teléfono. |
| La computadora "recordada" pide otra vez el código del teléfono | Sí, a los 30 días | También pasa si se cerró desde el perfil del teléfono, si cambiaste tu contraseña desde otro dispositivo o si borraste los datos del navegador. |

---

## Cámara dentro de Up (QR de la computadora y foto de factura)

Cambio del 19/11/2026. "Tomar o elegir foto" (tienda) y "Escanear código QR" (Perfil → Conectar una
computadora) abren la cámara dentro de la app, sin salir de ella.

### Cosas que puedes notar en la app (y si son normales)

| Lo que ves | ¿Es normal? | Explicación |
|---|---|---|
| El teléfono pregunta "¿Permitir que Up use la cámara?" | Sí | La primera vez (en iPhone puede preguntarlo más seguido). Hay que permitirlo. |
| "Up no tiene permiso para usar la cámara…" | Sí, si se negó el permiso | Activarlo en el candado junto a la dirección o en Ajustes del teléfono. Mientras tanto: escribir los 8 números (QR) o se abre la cámara del teléfono como antes (factura). |
| "No se pudo abrir la cámara…" | A veces | Otra app está usando la cámara. Cerrarla y volver a intentar. |
| "Este no es un código de Up" | Sí | Se apuntó a otro QR. Solo se aceptan los que muestra Up en la computadora. |
| Para la factura se abrió la cámara del teléfono (no la de Up) | Sí, en teléfonos o navegadores sin permiso o sin esa función | Funciona como antes; el borrador protege lo escrito si el teléfono reinicia la app. |
| El botón de linterna no aparece | Sí | Solo sale si la cámara del teléfono la permite (muchos iPhone no dejan usarla desde una página). |
| La foto con la cámara de Up sale un poco menos nítida que con la del teléfono | Posible en algunos teléfonos | Si la cámara de Up no puede tomar la foto "completa", usa la imagen del video (suficiente para leer la factura). Para más nitidez: "Galería". |

### Pistas técnicas (para revisar el código)

- `public/camara.js` (`KaabCamara.escanearQR`, `tomarFoto`); QR con `BarcodeDetector` o `public/vendor/jsQR.js`
  (se carga solo si hace falta). La cámara se apaga al cerrar, al tomar la foto y si la app pasa a segundo plano.
- App: `openConectarComputadoraModal` (`codigoDeQR`), `openTiendaMovModal` (`procesarFoto`). "Atrás" con la
  cámara abierta solo cierra la cámara (`popstate`).
- Prueba local: `bash pruebas/correr.sh camara` (usa un video falso con un QR como cámara).

## Perfil ordenado como los Ajustes del teléfono

Cambio del 19/11/2026. El Perfil ahora es una lista corta por grupos (Tu cuenta, Tu empresa, Este
teléfono) y cada cosa abre su propia pantalla: Usuarios, Apariencia, Huella / Face ID y Usar en una
computadora. Las acciones de cada usuario (cambiar nombre, contraseña, correo, eliminar) salen al tocarlo.

### Cosas que puedes notar en la app (y si son normales)

| Lo que ves | ¿Es normal? | Explicación |
|---|---|---|
| "Atrás" desde Usuarios, Apariencia, Huella o Computadora regresa al Perfil (no a las cuentas) | Sí | Hay que tocar "atrás" otra vez para volver a las cuentas. |
| Un usuario normal ve "Nombre" y "Correo" sin flechita | Sí | Solo los administradores pueden cambiarlos; abajo sale el aviso. |
| En "Usuarios", el admin principal sale sin flechita | Sí | A quien creó la empresa no se le puede cambiar nada desde ahí. |
| "Usar en una computadora" no dice cuántas hay abiertas | Sí, si no hay ninguna o no hay conexión | El número sale solo cuando hay computadoras con la sesión abierta. |
| "Huella / Face ID" dice "No" aunque la registraste en otro teléfono | Sí | Se refiere solo a este teléfono. |

### Pistas técnicas (para revisar el código)

- `public/app.js`: `openAccountSettingsPage`, `renderUsersPage` (según `perfilSub`), `abrirSubPerfil`,
  `filaPerfil`, `abrirAccionesUsuario`. Historial: `{ view: 'users', sub }`. Estilos `.perfil-*` en `public/styles.css`.
- Prueba local: `bash pruebas/correr.sh perfil-botones`.

## Íconos en las pestañas de abajo

Cambio del 25/11/2026. Cada pestaña de la barra flotante tiene su ícono: flecha hacia abajo en un círculo
(Por cobrar), flecha hacia arriba en un círculo (Por pagar) y una tiendita (Movimientos tienda). Solo la
pestaña elegida muestra su nombre y se pinta de su color (sin fondo); las otras, solo el ícono en gris.

### Cosas que puedes notar en la app (y si son normales)

| Lo que ves | ¿Es normal? | Explicación |
|---|---|---|
| Las pestañas no elegidas no dicen su nombre | Sí | Es a propósito. En la computadora, al pasar el ratón encima sale el nombre. |
| Al cambiar de pestaña, los íconos se deslizan | Sí | La pestaña elegida se estira para que quepa su nombre. Con las animaciones apagadas cambian al instante. |
| El nombre de la pestaña elegida se corta o se sale de su fondo | **No** | Avísame con una captura y el modelo del teléfono. |

### Pistas técnicas (para revisar el código)

- `public/index.html`: botones `.tab-btn` con `svg.tab-ico` + `span.tab-nombre` (y `aria-label`/`title`).
- `public/styles.css`: bloque "Íconos en las pestañas" (la elegida usa `flex-grow:2.6`; letra más chica bajo 340 px).
- `public/app.js`: `setTabUI` mide los íconos antes y después del cambio y los desliza con `animate()`.
- Prueba local: `bash pruebas/correr.sh animaciones`.
