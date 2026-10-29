# F4 · «Cómo reconstruir lo ocurrido»

> **Guion congelado el 2026-10-29** (`"frozen"` en `video.json`), a petición de Lidia, tras las revisiones de exactitud y de naturalidad. La versión vigente es `narration.json`. Las decisiones opcionales se resolvieron con la opción recomendada de esta ficha (la que ya recoge el guion); quedan abiertas solo las pronunciaciones, el canon nuevo «previsto» y los objetivos de las tarjetas, que se confirman al grabar.

> **Estado: propuesta, 2026-10-28.** Sin congelar, sin escenas ni voz. Rutas relativas a la raíz del repo; `fund` =
> `src/data/security/foundations.ts`, `prac` = `src/data/security/practicals.ts`, `reg` =
> `docs/superpowers/canon/glass-harbor.md`, `plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md`. Decisiones
> comunes a los cuatro vídeos: [00-propuesta.md](00-propuesta.md) §6.

## A. Ficha didáctica

| | |
|---|---|
| **Título** | Cómo reconstruir lo ocurrido |
| **Título de YouTube** | Cómo reconstruir lo ocurrido: logs, UTC y cronologías · Fundamentos para Security+ |
| **Pregunta central** | Con unos cuantos registros delante, ¿cómo sabes qué pasó, en qué orden, y qué puedes afirmar sin pasarte? |
| **Objetivos observables** | Al terminar, quien lo ve puede: (1) localizar en una línea de registro cuándo, dónde, quién, qué y con qué resultado, en JSON, CSV y texto; (2) explicar por qué un campo que falta no es un valor negativo; (3) normalizar horas con `Z`, con desfase y sin zona a UTC, conservando la original; (4) construir una cronología y correlacionar fuentes por campos comunes; (5) clasificar una frase como observación, hipótesis o conclusión; (6) explicar por qué un bloqueo no descarta otra vía y un permitido no prueba una fuga. |
| **Prerrequisitos** | Lección f12 (`fund:49-52`). F1 y F3 vistos, o f04, f05 y f11: dirección y puerto, proceso y PID, cuenta. |
| **Duración estimada** | ~8:19 renderizados (1187 palabras de locución; cálculo en E.2). |
| **Práctica relacionada** | «Cronología y límites» (`foundation-timeline`, `prac:132`), desde `#/security/study?view=practice&foundation=1`. Tres registros nuevos con otra zona horaria: el vídeo da el método, la práctica lo aplica. |
| **Dónde va** | Al final de f12, antes de la práctica. Cierra los fundamentos. |
| **Conceptos clave (5)** | campos de un registro (y el campo que falta) · normalizar a UTC · cronología y correlación · observación, hipótesis y conclusión · deny y allow: qué prueban y qué no. |
| **Se queda en las lecciones** | identificadores de evento de memoria, formatos concretos de cada producto, SIEM (sp4m6), cadena de custodia y adquisición (sp4m11), sincronización de relojes con NTP más allá de una frase. |

### El caso (fijo)

«Autoridad Portuaria de Halden · imagina · caso de entrenamiento · sin fecha · no ha pasado.» Un día de invierno
(Halden va a UTC+1, como en el ejemplo del SIEM: `video/siem/src/data/s03-normalize.ts:5-6`, `video/siem/narration.json:90`).

| Fuente | Formato y zona | Líneas en pantalla |
|---|---|---|
| Inicio de sesión del equipo (exportado) | CSV, hora local del equipo, **sin zona** | `hora,equipo,cuenta,evento,resultado` · `09:58:12,SALES-WS-03,l.prado,4624 inicio de sesión,correcto` |
| Proxy web | texto, **UTC** (`Z`) | `09:01:40Z SALES-WS-03 l.prado POST subidas.compartir.example/upload 403 BLOQUEADO categoría=almacenamiento personal` |
| EDR del equipo | JSON, **UTC** | `{"ts":"09:02:41Z","host":"SALES-WS-03","user":"l.prado","event":"process_start","process":"syncbox.exe","pid":6120,"parent":"explorer.exe"}` · `{"ts":"09:02:58Z","host":"SALES-WS-03","user":"l.prado","event":"network_connect","pid":6120,"src":"10.20.6.37:52811","dst":"198.51.100.117:443"}` |
| Cortafuegos de salida | clave=valor, hora local **con desfase** (`+01:00`) | `start=10:03:05+01:00 end=10:06:06+01:00 action=ALLOW src=10.20.6.37:52811 dst=198.51.100.117:443 proto=TCP duration=181s bytes_out=46180352 bytes_in=61420` |

**Cronología normalizada (UTC):** 08:58:12 inicio de sesión · 09:01:40 bloqueo del proxy · 09:02:41 arranca
`syncbox.exe` · 09:02:58 conexión según el EDR · 09:03:05 inicio de la conexión según el cortafuegos (7 s de
diferencia entre relojes; termina a las 09:06:06) · 3 min y unos 46 MB de salida. El equipo `SALES-WS-03` es un nombre libre del canon (`reg:4487`) y `10.20.6.x`
es la VLAN de Oficinas (`reg:4491`); todo lo demás es nuevo y va rotulado «imagina».

## B. Guion audiovisual por escenas

- **Carpeta** `video/reconstruir/` · perfil `principal-yt` · `"track": "secplus"` · `"lesson": "f12"` · sin adversario
  ni mensajes interceptados · voz `recording/lidia`, tempo 1 · música `Go On Going - Stayloose.mp3` ·
  `"examTiming": "sentence-end"`.
- **Sello** desde s02: «Autoridad Portuaria de Halden · imagina · caso de entrenamiento · sin fecha · no ha pasado» y
  «Simulación educativa · datos ficticios». Sin personas con nombre: «una cuenta de Comercial».
- **Hilo visual: la mesa de las cuatro fuentes.** Cuatro tarjetas fijas (inicio de sesión, proxy, EDR, cortafuegos),
  cada una con su icono y su formato. De ellas salen las líneas hacia la regla de tiempo (s04–s05), la cronología
  (s06–s07) y las tres columnas «observado · hipótesis · conclusión» (s08–s11).
- **Imagen** (rotulada «imagen · no es del puerto»): los testigos. Cuatro siluetas, cada una en su sitio (una puerta,
  una ventana, un mostrador, una salida), y cada una solo ve su trozo. Vuelve en s03 y s10.
- **Regla de pantalla:** cada hora normalizada lleva **al lado y en gris** su hora original.
- **Datos en pantalla** (nunca en la voz): los de la tabla del caso. La voz dice las horas, no los identificadores.

### Capítulo 1 · Leer un registro

#### s01 · «¿Se han llevado algo?» · ~33 s · 83 palabras

- **Propósito didáctico:** la pregunta central y la promesa en 12 s; caso de entrenamiento.
- **En pantalla:** un aviso del proxy, «Subida bloqueada · almacenamiento personal», sobre la silueta de un equipo de
  Comercial. Una burbuja: «¿se han llevado datos?». Al decir «cuatro registros», el título «Cómo reconstruir lo
  ocurrido» y las cuatro tarjetas boca abajo. Después, cuatro chips: «leer · normalizar · ordenar · afirmar lo justo».
- **Acciones visuales:** las tarjetas se dan la vuelta a la vez al final de la escena.
- **Narración:**

> Te llega un aviso. Desde un equipo de Comercial han intentado subir un archivo a una nube personal, y se ha bloqueado. ¿Se han llevado datos?
> Hoy vas a responder con cuatro registros, las notas que dejan los sistemas. Leerás sus campos, pondrás todas las horas en la misma zona y ordenarás los hechos.
> Y, sobre todo, dirás solo lo que de verdad demuestran.
> Es un caso de entrenamiento en el puerto de Halden. No ha pasado, pero así es como se trabaja.

#### s02 · «Cuatro testigos» · ~43 s · 109 palabras

- **Propósito didáctico:** qué es un registro; cada fuente observa desde su sitio; cuatro fuentes y tres formatos.
- **En pantalla:** la imagen de los cuatro testigos. Luego las cuatro tarjetas con su línea en bruto: el CSV con su
  cabecera de columnas, la línea de texto del proxy, las dos líneas JSON del EDR y la línea clave=valor del
  cortafuegos. Chips de formato: «CSV · columnas», «JSON · nombre: valor».
- **Acciones visuales:** cada testigo se convierte en su tarjeta al nombrarlo.
- **Narración:**

> Un registro, o log, es la nota que deja un sistema cuando pasa algo. Cada fuente es como un testigo. Cuenta lo que vio desde su sitio, ni más ni menos.
> Aquí tienes cuatro. El inicio de sesión del propio equipo. El intermediario por el que salen las webs del puerto, que se llama proxy.
> Un programa de seguridad del equipo, que apunta qué procesos arrancan y qué conexiones abren. Se llama EDR. Y el cortafuegos de salida.
> Cada uno escribe a su manera. El EDR apunta pares de nombre y valor, lo que se llama JSON. El inicio de sesión sale en columnas separadas por comas, un CSV.

#### s03 · «Los ingredientes de una línea» · ~33 s · 82 palabras

- **Propósito didáctico:** los cinco ingredientes; encontrarlos en formatos distintos; el campo ausente.
- **En pantalla:** cinco cajas de color sobre las líneas, «cuándo · dónde · quién · qué · resultado». En el proxy se
  recuadran `09:01:40Z`, `SALES-WS-03`, `l.prado`, `POST subidas…` y `403 BLOQUEADO`. En el cortafuegos, `start`,
  `src`, `dst`, el puerto, `bytes_out` y `action=ALLOW`; la caja «quién» se queda vacía con un rótulo «no lo apunta ≠
  nadie». El testigo del cortafuegos mira hacia la calle, no hacia las caras.
- **Acciones visuales:** la caja vacía parpadea una vez y se queda en gris, no en rojo.
- **Narración:**

> Pero casi todas las líneas llevan los mismos ingredientes. Cuándo, dónde, quién, qué hizo y con qué resultado.
> Búscalos en cada fuente. En el proxy los encuentras todos, hasta el resultado, bloqueado.
> En el cortafuegos, casi todos, y su resultado es permitido.
> Y fíjate en lo que falta. El cortafuegos no tiene campo de usuario. Eso no significa que no hubiera nadie. Significa que ese testigo no lo apunta.
> O sea, que lo que falta en un registro no es un no.

- **Tarjeta de examen** (4.9): «Un campo ausente no es un valor negativo».

### Capítulo 2 · Todas las horas en la misma zona

#### s04 · «Cuatro relojes» · ~52 s · 119 palabras

- **Propósito didáctico:** el error de ordenar sin normalizar; primera pausa.
- **En pantalla:** las cuatro horas tal como vienen, alineadas en una regla ingenua: `09:01:40Z` (proxy), `09:02:41Z`
  y `09:02:58Z` (EDR), `09:58:12` (inicio de sesión), `10:03:05+01:00` (cortafuegos). Un rótulo ámbar: «¿el bloqueo,
  antes de que nadie entrara?». Después, tres etiquetas de zona: `Z` = UTC; `+01:00` = una hora por delante de UTC
  (Halden en invierno); «sin zona» con una lupa sobre la configuración del equipo: «hora local de Halden». Durante la
  pausa, dos botones: «El bloqueo» / «El inicio de sesión».
- **Acciones visuales:** las horas caen en la regla según su texto, sin mirar la zona.
- **Narración:**

> Ahora, las horas. Ponlas en fila tal como vienen. El inicio de sesión dice las nueve cincuenta y ocho. El bloqueo del proxy, las nueve y uno.
> El EDR, las nueve y dos. Y el cortafuegos, las diez y tres.
> Leídas así, parece que el bloqueo pasó casi una hora antes de que nadie iniciara sesión. Pero fíjate en el final de cada hora.
> La zeta quiere decir UTC, la hora de referencia mundial. El más uno, una hora por delante de UTC, que es la hora de Halden en invierno.
> Y el inicio de sesión no dice zona. Eso no se supone, se comprueba, y el equipo está configurado en hora de Halden. Con eso, ¿qué pasó primero?

- **Pausa para decidir** (`think`, `holdMs` 4500): «¿Qué fue antes?» · en pantalla: «El bloqueo» / «El inicio de
  sesión».

#### s05 · «La hora de referencia» · ~48 s · 124 palabras

- **Propósito didáctico:** UTC, `Z`, desfase y hora sin zona; normalizar conservando la original; el horario de verano.
- **En pantalla:** una regla nueva en UTC: las dos horas locales se desplazan una hora a la izquierda y caen en su
  sitio; cada una lleva su original en gris al lado. Orden final: 08:58:12 · 09:01:40 · 09:02:41 · 09:02:58 ·
  09:03:05. Al final, un globo con «UTC · igual en todas partes · sin horario de verano» y, al lado, un calendario con
  «verano» en el que la flecha del desfase local cambia de longitud.
- **Acciones visuales:** la tarjeta del inicio de sesión salta al principio de la regla.
- **Narración:**

> El inicio de sesión. Si has dicho el bloqueo, has caído en lo de siempre, ordenar por el número sin mirar la zona.
> Restas una hora a las dos horas locales, y todo queda en UTC. Ahora el inicio de sesión queda a las ocho cincuenta y ocho, y pasa a ser lo primero. El resto lo tienes en pantalla.
> Así que primero entró y luego intentó subir. Guarda siempre la hora original al lado, por si te equivocas de zona.
> Se usa UTC porque es la misma en todo el mundo y no cambia en verano. La hora local sí cambia, así que el desfase se mira en cada fecha.
> O sea, que antes de ordenar, todo a la misma hora de referencia.

- **Tarjeta de examen** (4.9): «Normaliza a UTC y guarda la hora original».

### Capítulo 3 · La cronología

#### s06 · «En orden» · ~45 s · 116 palabras

- **Propósito didáctico:** construir la cronología: una línea por hecho, en UTC, con su fuente.
- **En pantalla:** una tabla de cinco filas con tres columnas, «UTC · hecho · fuente», que se rellena al compás de la
  voz: «08:58:12 · inicio de sesión de `l.prado` en `SALES-WS-03` · equipo», «09:01:40 · subida bloqueada a
  `subidas.compartir.example` · proxy», «09:02:41 · arranca `syncbox.exe` (PID 6120) · EDR», «09:02:58 · `syncbox.exe`
  conecta a `198.51.100.117:443` · EDR», «09:03:05 · ALLOW desde el inicio, 181 s, 46 180 352 bytes de salida · cortafuegos». Junto a `syncbox.exe`, en
  gris: «solo el nombre del archivo».
- **Acciones visuales:** cada fila se ilumina y luego se atenúa; nada se interpreta todavía (sin colores de alarma).
- **Narración:**

> Ahora sí, la cronología. Una línea por hecho, en UTC, y con su fuente al lado.
> A las ocho cincuenta y ocho, una cuenta de Comercial inicia sesión en su equipo. A las nueve y uno, el proxy bloquea una subida a una nube personal.
> A las nueve y dos, con la misma cuenta y en el mismo equipo, arranca un programa. Su nombre suena a sincronización, pero eso, de momento, es solo un nombre.
> Diecisiete segundos después, ese programa abre una conexión a una dirección de fuera, por el 443.
> Y el cortafuegos deja pasar una conexión, que dura tres minutos y saca unos cuarenta y seis megas. Enseguida verás por qué es la misma.

#### s07 · «Lo que une las líneas» · ~47 s · 120 palabras

- **Propósito didáctico:** correlacionar por campos comunes; la diferencia de segundos entre relojes.
- **En pantalla:** hilos de color entre filas: «equipo» une inicio de sesión, proxy y EDR; «cuenta» une los mismos;
  «`10.20.6.37:52811` → `198.51.100.117:443`» une la fila del EDR y la del cortafuegos. Al lado, «09:02:58 (EDR) ·
  09:03:05 (cortafuegos) · 7 s», con una regla pequeña: «segundos: normal · minutos: revisa el reloj».
- **Acciones visuales:** el puerto efímero `52811` se ilumina en las dos líneas a la vez (es el de F1).
- **Narración:**

> ¿Cómo sabes que esas líneas hablan de lo mismo? No por la hora sola. Por los campos que coinciden.
> El mismo equipo en el inicio de sesión, el proxy y el EDR. La misma cuenta. Y en el EDR y en el cortafuegos, la misma etiqueta.
> El mismo origen, el mismo puerto efímero, ese número temporal que el equipo elige para cada conversación, y el mismo destino.
> Así sabes que la conexión permitida la abrió ese programa, y no otro. Eso es correlacionar, unir fuentes por lo que comparten.
> Por cierto, el EDR y el cortafuegos la ven con siete segundos de diferencia. Son dos relojes. Unos segundos, normal. Si fueran minutos, sospecharías del reloj antes que de la historia.

- **Tarjeta de examen** (4.9): «Correlaciona por campos comunes, no solo por la hora».

### Capítulo 4 · Lo que ves y lo que crees

#### s08 · «Tres columnas» · ~37 s · 94 palabras

- **Propósito didáctico:** separar observación, hipótesis y conclusión; dos hipótesis rivales.
- **En pantalla:** tres columnas, «observado · hipótesis · conclusión». Las cinco filas de la cronología caen en
  «observado». En «hipótesis», dos tarjetas: «H1: tras el bloqueo, subió el archivo por otra vía» y «H2: es la
  sincronización autorizada de Comercial, la de cada día». La columna «conclusión» se queda vacía, con un rótulo
  «todavía no».
- **Acciones visuales:** las dos hipótesis se apoyan en las mismas filas observadas (hilos a las dos).
- **Narración:**

> Ahora viene el paso que más se salta. Separa tres cosas.
> Lo observado es lo que dice cada testigo, tal cual, sin añadir nada. La hipótesis es una explicación posible, que todavía hay que poner a prueba.
> Y la conclusión es lo que puedes afirmar porque lo sostienen las observaciones.
> Aquí hay dos hipótesis. Una, que tras el bloqueo subiera el archivo por otra vía. Otra, que ese programa sea la sincronización autorizada de Comercial, haciendo lo de todos los días.
> Las dos encajan con lo que hay. Por eso, de momento, son hipótesis.

- **Tarjeta de examen** (4.8): «Observación, hipótesis y conclusión, por separado».

#### s09 · «Cuarenta y seis megas» · ~36 s · 75 palabras

- **Propósito didáctico:** qué prueba un allow con bytes y qué no; qué evidencia faltaría; segunda pausa.
- **En pantalla:** la fila del cortafuegos ampliada: `action=ALLOW`, `bytes_out=46180352`. Durante la pausa, «Sí» /
  «No por sí solo». Tras la respuesta, `ALLOW` se etiqueta «decisión de paso» y `bytes_out`, «cuánto, no qué». Tres
  huecos de evidencia como tarjetas vacías: «¿qué es `syncbox.exe` y está autorizado?», «¿de quién es
  `198.51.100.117`?», «¿qué archivos leyó antes?».
- **Acciones visuales:** las dos hipótesis siguen en pie; ninguna se tacha.
- **Narración:**

> El cortafuegos dice permitido, y unos cuarenta y seis megas. ¿Prueba eso que se han llevado datos?

- **Pausa para decidir** (`think`, `holdMs` 4500): «Permitido y 46 MB: ¿prueba una fuga?» · en pantalla: «Sí» / «No
  por sí solo».

> No por sí solo. Permitido significa que el cortafuegos decidió dejarlo pasar. Los megas dicen cuánto salió, no qué salió.
> Podría ser el archivo bloqueado, o el trabajo de siempre.
> Para salir de dudas hace falta más evidencia. Qué es ese programa y si está autorizado. De quién es ese destino. Y qué archivos leyó antes de conectarse.

- **Tarjeta de examen** (4.9): «Allow: se permitió el paso; el contenido, no se sabe».

#### s10 · «Un bloqueo no cierra el caso» · ~35 s · 89 palabras

- **Propósito didáctico:** un deny prueba un bloqueo en un punto, no la ausencia de otras vías.
- **En pantalla:** un diagrama de dos caminos desde el equipo: uno por el proxy (con la línea `403 BLOQUEADO`) y otro
  directo por el cortafuegos (con `ALLOW`). El testigo del proxy, en su puerta, mira solo su camino. Al final, un
  rótulo ámbar sobre el camino directo: «hallazgo · sale sin proxy».
- **Acciones visuales:** el camino directo se dibuja después del bloqueo, rodeando la puerta del proxy.
- **Narración:**

> Y el bloqueo tampoco cierra el caso. El proxy es un testigo de su puerta. Ve lo que pasa por él, nada más.
> Esa conexión no pasó por el proxy, salió directa por el cortafuegos. Así que el bloqueo prueba que esa subida, por ahí, no salió.
> No prueba que no saliera nada por otro camino.
> Y que un equipo pueda salir a Internet sin pasar por el proxy ya es un hallazgo por sí mismo.
> O sea, que ni el bloqueo te tranquiliza ni el permitido te condena.

- **Tarjeta de examen** (4.9): «Deny: bloqueo en ese punto, no en todas las vías».

### Capítulo 5 · Lo que hay y lo que falta

#### s11 · «Lo que escribes» · ~38 s · 95 palabras

- **Propósito didáctico:** redactar una conclusión que respeta lo observado; siguientes pasos.
- **En pantalla:** la columna «conclusión», que por fin se rellena con un párrafo corto (el que dice la voz), y debajo
  «siguientes pasos» con tres casillas. A los lados, tachadas, dos frases: «no ha pasado nada» y «nos han robado».
- **Acciones visuales:** las tres casillas de siguientes pasos quedan sin marcar.
- **Narración:**

> Entonces, ¿qué escribes en el informe? Algo así.
> Hubo un intento de subida bloqueado por el proxy. Poco más de un minuto después, desde el mismo equipo y con la misma cuenta, un programa abrió una conexión directa.
> El cortafuegos la permitió, con unos cuarenta y seis megas de salida. El contenido no se conoce.
> Siguientes pasos. Identificar el programa y el destino, revisar qué archivos se leyeron y explicar por qué ese equipo sale sin proxy.
> O sea, ni «no ha pasado nada», ni «nos han robado». Lo que hay, y lo que falta.

#### s12 · «Tres reglas» · ~32 s · 81 palabras

- **Propósito didáctico:** cierre con tres reglas y una acción.
- **En pantalla:** tres tarjetas numeradas; la tarjeta final «Alertópolis · Cómo reconstruir lo ocurrido» con el botón
  «Práctica · Cronología y límites».
- **Acciones visuales:** ninguna nueva; sin tarjeta de examen.
- **Narración:**

> Te quedas con tres reglas.
> Una. Cada registro es un testigo de su sitio. Lee sus campos, y recuerda que lo que no apunta no es un no.
> Dos. Antes de ordenar, todo a UTC, con la hora original al lado.
> Tres. Separa lo observado de lo que crees. Un bloqueo no descarta otras vías, y un permitido no demuestra una fuga.
> Ahora te toca a ti. Abre la práctica «Cronología y límites», ordena tres registros y decide qué puedes afirmar.

## C. Texto de locución

#### Capítulo 1 · Leer un registro

Te llega un aviso. Desde un equipo de Comercial han intentado subir un archivo a una nube personal, y se ha bloqueado. ¿Se han llevado datos?

Hoy vas a responder con cuatro registros, las notas que dejan los sistemas. Leerás sus campos, pondrás todas las horas en la misma zona y ordenarás los hechos.

Y, sobre todo, dirás solo lo que de verdad demuestran.

Es un caso de entrenamiento en el puerto de Halden. No ha pasado, pero así es como se trabaja.

Un registro, o log, es la nota que deja un sistema cuando pasa algo. Cada fuente es como un testigo. Cuenta lo que vio desde su sitio, ni más ni menos.

Aquí tienes cuatro. El inicio de sesión del propio equipo. El intermediario por el que salen las webs del puerto, que se llama proxy.

Un programa de seguridad del equipo, que apunta qué procesos arrancan y qué conexiones abren. Se llama EDR. Y el cortafuegos de salida.

Cada uno escribe a su manera. El EDR apunta pares de nombre y valor, lo que se llama JSON. El inicio de sesión sale en columnas separadas por comas, un CSV.

Pero casi todas las líneas llevan los mismos ingredientes. Cuándo, dónde, quién, qué hizo y con qué resultado.

Búscalos en cada fuente. En el proxy los encuentras todos, hasta el resultado, bloqueado.

En el cortafuegos, casi todos, y su resultado es permitido.

Y fíjate en lo que falta. El cortafuegos no tiene campo de usuario. Eso no significa que no hubiera nadie. Significa que ese testigo no lo apunta.

O sea, que lo que falta en un registro no es un no.

#### Capítulo 2 · Todas las horas en la misma zona

Ahora, las horas. Ponlas en fila tal como vienen. El inicio de sesión dice las nueve cincuenta y ocho. El bloqueo del proxy, las nueve y uno.

El EDR, las nueve y dos. Y el cortafuegos, las diez y tres.

Leídas así, parece que el bloqueo pasó casi una hora antes de que nadie iniciara sesión. Pero fíjate en el final de cada hora.

La zeta quiere decir UTC, la hora de referencia mundial. El más uno, una hora por delante de UTC, que es la hora de Halden en invierno.

Y el inicio de sesión no dice zona. Eso no se supone, se comprueba, y el equipo está configurado en hora de Halden. Con eso, ¿qué pasó primero?

El inicio de sesión. Si has dicho el bloqueo, has caído en lo de siempre, ordenar por el número sin mirar la zona.

Restas una hora a las dos horas locales, y todo queda en UTC. Ahora el inicio de sesión queda a las ocho cincuenta y ocho, y pasa a ser lo primero. El resto lo tienes en pantalla.

Así que primero entró y luego intentó subir. Guarda siempre la hora original al lado, por si te equivocas de zona.

Se usa UTC porque es la misma en todo el mundo y no cambia en verano. La hora local sí cambia, así que el desfase se mira en cada fecha.

O sea, que antes de ordenar, todo a la misma hora de referencia.

#### Capítulo 3 · La cronología

Ahora sí, la cronología. Una línea por hecho, en UTC, y con su fuente al lado.

A las ocho cincuenta y ocho, una cuenta de Comercial inicia sesión en su equipo. A las nueve y uno, el proxy bloquea una subida a una nube personal.

A las nueve y dos, con la misma cuenta y en el mismo equipo, arranca un programa. Su nombre suena a sincronización, pero eso, de momento, es solo un nombre.

Diecisiete segundos después, ese programa abre una conexión a una dirección de fuera, por el 443.

Y el cortafuegos deja pasar una conexión, que dura tres minutos y saca unos cuarenta y seis megas. Enseguida verás por qué es la misma.

¿Cómo sabes que esas líneas hablan de lo mismo? No por la hora sola. Por los campos que coinciden.

El mismo equipo en el inicio de sesión, el proxy y el EDR. La misma cuenta. Y en el EDR y en el cortafuegos, la misma etiqueta.

El mismo origen, el mismo puerto efímero, ese número temporal que el equipo elige para cada conversación, y el mismo destino.

Así sabes que la conexión permitida la abrió ese programa, y no otro. Eso es correlacionar, unir fuentes por lo que comparten.

Por cierto, el EDR y el cortafuegos la ven con siete segundos de diferencia. Son dos relojes. Unos segundos, normal. Si fueran minutos, sospecharías del reloj antes que de la historia.

#### Capítulo 4 · Lo que ves y lo que crees

Ahora viene el paso que más se salta. Separa tres cosas.

Lo observado es lo que dice cada testigo, tal cual, sin añadir nada. La hipótesis es una explicación posible, que todavía hay que poner a prueba.

Y la conclusión es lo que puedes afirmar porque lo sostienen las observaciones.

Aquí hay dos hipótesis. Una, que tras el bloqueo subiera el archivo por otra vía. Otra, que ese programa sea la sincronización autorizada de Comercial, haciendo lo de todos los días.

Las dos encajan con lo que hay. Por eso, de momento, son hipótesis.

El cortafuegos dice permitido, y unos cuarenta y seis megas. ¿Prueba eso que se han llevado datos?

No por sí solo. Permitido significa que el cortafuegos decidió dejarlo pasar. Los megas dicen cuánto salió, no qué salió.

Podría ser el archivo bloqueado, o el trabajo de siempre.

Para salir de dudas hace falta más evidencia. Qué es ese programa y si está autorizado. De quién es ese destino. Y qué archivos leyó antes de conectarse.

Y el bloqueo tampoco cierra el caso. El proxy es un testigo de su puerta. Ve lo que pasa por él, nada más.

Esa conexión no pasó por el proxy, salió directa por el cortafuegos. Así que el bloqueo prueba que esa subida, por ahí, no salió.

No prueba que no saliera nada por otro camino.

Y que un equipo pueda salir a Internet sin pasar por el proxy ya es un hallazgo por sí mismo.

O sea, que ni el bloqueo te tranquiliza ni el permitido te condena.

#### Capítulo 5 · Lo que hay y lo que falta

Entonces, ¿qué escribes en el informe? Algo así.

Hubo un intento de subida bloqueado por el proxy. Poco más de un minuto después, desde el mismo equipo y con la misma cuenta, un programa abrió una conexión directa.

El cortafuegos la permitió, con unos cuarenta y seis megas de salida. El contenido no se conoce.

Siguientes pasos. Identificar el programa y el destino, revisar qué archivos se leyeron y explicar por qué ese equipo sale sin proxy.

O sea, ni «no ha pasado nada», ni «nos han robado». Lo que hay, y lo que falta.

Te quedas con tres reglas.

Una. Cada registro es un testigo de su sitio. Lee sus campos, y recuerda que lo que no apunta no es un no.

Dos. Antes de ordenar, todo a UTC, con la hora original al lado.

Tres. Separa lo observado de lo que crees. Un bloqueo no descarta otras vías, y un permitido no demuestra una fuga.

Ahora te toca a ti. Abre la práctica «Cronología y límites», ordena tres registros y decide qué puedes afirmar.

## D. Actividades

### D.1 Durante el vídeo (pausas para decidir)

**Pausa 1 · s04 · «¿Qué fue antes?»**

| Opción | Correcta | Feedback |
|---|---|---|
| El bloqueo | No | Error plausible: ordenar las horas por su texto sin mirar la zona. El inicio de sesión no lleva zona y es hora local; en UTC son las 08:58, antes del bloqueo de las 09:01. La zona estaba en la configuración del equipo, y la voz la da antes de la pausa. |
| El inicio de sesión | **Sí** | Normalizadas a UTC, el inicio de sesión (08:58) va primero, y el bloqueo (09:01) después. |

**Pausa 2 · s09 · «Permitido y 46 MB: ¿prueba una fuga?»**

| Opción | Correcta | Feedback |
|---|---|---|
| Sí | No | Error plausible: leer el volumen como contenido. El cortafuegos registra que dejó pasar la conexión y cuántos bytes salieron, no qué eran. |
| No por sí solo | **Sí** | Hace falta otra evidencia: qué es el programa y si está autorizado, de quién es el destino y qué archivos se leyeron. |

### D.2 Después del vídeo

Formato `SCENES` de `src/data/security/video-learning.ts`: id `video-reconstruir-N`, objetivo `pre-12`, primera
`understand` y segunda `apply`.

**D.2.1 · Comprensión · observación, hipótesis o conclusión**

- **ES:** Revisas otro caso. ¿Cuál de estas frases es una observación, y no una hipótesis ni una conclusión?
- **EN:** You are reviewing another case. Which statement is an observation rather than a hypothesis or a conclusion?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | La persona quería llevarse la lista de clientes | The person wanted to take the customer list | Es una hipótesis sobre la intención: ningún registro observa intenciones. |
| B | Tras el bloqueo, usó otra vía para sacar el archivo | After the block, they used another path to send the file | Es una hipótesis: une dos hechos con una explicación que todavía hay que comprobar. |
| C | **El proxy registró un POST bloqueado a las 11:20Z** | **The proxy recorded a blocked POST at 11:20Z** | **Correcta.** Es lo que dice un registro, tal cual, con su fuente y su hora. |
| D | Ha quedado confirmada una fuga de datos de clientes | A customer data leak has been confirmed | Es una conclusión que necesitaría evidencia del contenido enviado; con un bloqueo no se sostiene. |

- **Respuesta:** C. **Explicación:** la observación se puede señalar en un registro concreto. Lo que explica el porqué
  es hipótesis hasta que otra evidencia la sostenga; solo entonces es conclusión.

**D.2.2 · Aplicación · normalizar en verano**

- **ES:** En un hospital de Madrid, un día de julio, el lector de tarjetas de la sala de archivo registra «entrada
  22:47», en hora local y sin zona: está configurado con la hora de Madrid. El servidor de historias clínicas registra
  «consulta 20:52Z». ¿En qué orden ocurrieron?
- **EN:** At a hospital in Madrid, on a July day, the card reader of the records room logs "entry 22:47" in local time
  with no zone: it is configured to Madrid time. The health-records server logs "lookup 20:52Z". In what order did they
  happen?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | Primero la consulta: 20:52 es antes que 22:47 | The lookup first: 20:52 comes before 22:47 | Compara horas de zonas distintas sin normalizarlas. |
| B | Primero la consulta, porque UTC va por delante de Madrid | The lookup first, because UTC is ahead of Madrid | El desfase va al revés: en julio, Madrid va dos horas por delante de UTC, no por detrás. |
| C | No se puede ordenar, porque una de las dos no lleva zona | They cannot be ordered, because one has no zone | La zona no está en la línea, pero sí en la configuración del lector. Se comprueba, no se supone, y aquí se conoce. |
| D | **Primero la entrada, unos cinco minutos antes** | **The entry first, about five minutes earlier** | **Correcta.** En julio, Madrid usa UTC+2: las 22:47 locales son las 20:47Z. La entrada (20:47Z) va cinco minutos antes que la consulta (20:52Z). |

- **Respuesta:** D. **Explicación:** primero se averigua la zona de cada fuente (en la línea o en su configuración),
  después se pasa todo a UTC, y solo entonces se ordena. El horario de verano cambia el desfase.

## E. Producción y accesibilidad

### E.1 Recursos

- **Reutilizados (comprobados en el repositorio):** la normalización del SIEM, con sus tres dialectos llevados a un
  esquema común y la hora de Halden pasada a UTC (`video/siem/src/data/s03-normalize.ts:1-120`; escenas en
  `video/siem/src/scenes/`), como base de s02–s05; las tablas de columnas recuadrables de V10
  (`video/logs-halden/src/scenes/parts/IdpLog.tsx`, `TrailRow.tsx`) para s03 y s06, con datos nuevos; el nombre libre
  `SALES-WS-03` (`reg:4487`); la etiqueta de F1 para la línea de conexión de s07.
- **Nuevos:** las cuatro tarjetas de fuente; la imagen de los testigos; la regla de tiempo ingenua y la normalizada,
  con la hora original en gris; la tabla de cronología; las tres columnas; el diagrama de dos caminos.
- **Efectos** (biblioteca del motor, `video/engine/sfx/sfx.json`): `alarm`, suave, con el aviso del proxy (s01),
  `whoosh` cuando la hora del inicio de sesión salta a su sitio al normalizar (s05) y `check` en cada hilo de
  correlación (s07).
- **Léxico:** UTC («u te ce»), «zeta», JSON («yeison»), CSV, EDR, proxy, log, «más uno». Lidia elige la
  pronunciación de las siglas.

### E.2 Capítulos y duración (cálculo)

| Capítulo | Empieza en | Escenas |
|---|---|---|
| 1 · Leer un registro | 0:00 | s01–s03 |
| 2 · Todas las horas en la misma zona | 1:49 | s04–s05 |
| 3 · La cronología | 3:29 | s06–s07 |
| 4 · Lo que ves y lo que crees | 5:01 | s08–s10 |
| 5 · Lo que hay y lo que falta | 6:49 | s11–s12 |

| Escena | Palabras | Segundos |
|---|---|---|
| s01 «¿Se han llevado algo?» | 83 | 33 |
| s02 «Cuatro testigos» | 109 | 43 |
| s03 «Los ingredientes de una línea» | 82 | 33 |
| s04 «Cuatro relojes» | 119 | 52 (incluye la pausa) |
| s05 «La hora de referencia» | 124 | 48 |
| s06 «En orden» | 116 | 45 |
| s07 «Lo que une las líneas» | 120 | 47 |
| s08 «Tres columnas» | 94 | 37 |
| s09 «Cuarenta y seis megas» | 75 | 36 (incluye la pausa) |
| s10 «Un bloqueo no cierra el caso» | 89 | 35 |
| s11 «Lo que escribes» | 95 | 38 |
| s12 «Tres reglas» | 81 | 32 |
| **Suma de escenas** | **1187** | **479** |
| Márgenes de la tubería (entrada, transiciones, tarjeta final) | | 20 |
| **Renderizado estimado** | | **499 (8:19)** |

Cálculo: palabras / 2.7 + 2 s de aire por escena + 5.5 s por pausa para pensar (4,5 s de tarjeta y la entrada/salida), más 20 s de márgenes. Tarjetas de examen: 6. Pausas para pensar: 2. Es una estimación: con la grabación a tempo 1 la duración real puede moverse ±10 %, y se comprueba con `build-timeline --estimate` antes de congelar.

### E.3 Información visual que la voz y la transcripción tienen que contar

Las líneas de registro son el contenido del vídeo y la voz no las lee enteras. La transcripción las lleva completas,
en el orden en que aparecen:

| Escena | Lo que solo se ve | Línea en la transcripción |
|---|---|---|
| s02 | las cuatro fuentes en bruto | `[En pantalla: las cuatro líneas de la tabla «El caso», tal cual]` |
| s03 | los cinco ingredientes recuadrados | `[En pantalla: proxy · cuándo 09:01:40Z, dónde SALES-WS-03, quién l.prado, qué POST a subidas.compartir.example, resultado 403 BLOQUEADO. Cortafuegos · sin campo de usuario]` |
| s04–s05 | las horas en bruto y normalizadas | `[En pantalla: 09:58:12 sin zona → 08:58:12Z; 09:01:40Z; 09:02:41Z; 09:02:58Z; 10:03:05+01:00 → 09:03:05Z]` |
| s06 | la cronología | `[En pantalla: cronología de cinco filas, como la cuenta la voz, con equipo, cuenta, programa, PID 6120 y destino 198.51.100.117:443]` |
| s07 | los campos que unen las líneas | `[En pantalla: mismo equipo y cuenta en tres fuentes; origen 10.20.6.37:52811 y destino 198.51.100.117:443 en EDR y cortafuegos; 7 s entre sus horas]` |
| s09 | los tres huecos de evidencia | se dicen en la voz |

## F. Revisión

### F.1 Errores conceptuales que el guion previene

| Error | Dónde se corrige |
|---|---|
| «Si el registro no tiene usuario, no hubo usuario» | s03 |
| «Las horas se ordenan tal como vienen» | s04 (pausa 1) |
| «Una hora sin zona es UTC» (o «es la mía») | s05: se comprueba en la configuración |
| «El desfase con UTC es fijo todo el año» | s05; D.2.2 |
| «El nombre del programa dice lo que hace» | s06: «es solo un nombre» hasta que otra evidencia lo confirme |
| «Si coinciden en la hora, son el mismo suceso» | s07: se correlaciona por campos |
| «Unos segundos de diferencia entre fuentes son dos sucesos distintos» | s07 |
| «Una suposición sobre la intención es un dato» | s08; D.2.1 |
| «Allow con muchos bytes = exfiltración» | s09 (pausa 2); es el error de f12, `fund:52` |
| «Deny = no salió nada» | s10 |
| «Hay que contestar sí o no ya» | s11: lo que hay y lo que falta |

**Simplificaciones conscientes:** el proxy se presenta como «el intermediario por el que salen las webs» y el EDR como
«el programa de seguridad del equipo»; el `4624` sale en pantalla sin explicarse (es el identificador de inicio de
sesión correcto en Windows); la exportación CSV sin zona es un caso habitual, pero el formato concreto depende de la
herramienta; «unos cuarenta y seis megas» redondea 46 180 352 bytes (46 MB decimales, 44 MiB). Muchos cortafuegos escriben la
línea al **cerrar** la sesión, con su duración y sus bytes; por eso la del caso lleva `start` y `end` explícitos: si
solo llevara una hora, sería la del final.

*Revisiones 2026-10-28:* ver la sección «Revisiones aplicadas» al final de la ficha (notas sobre horas sin fecha, IP de cliente en el proxy, `+02:00` de verano y lecturas de `443`).

### F.2 Fuentes primarias

Abierta por la revisión de exactitud del 2026-10-28: RFC 3339 (`Z` y desfases; el desfase es la hora local menos
UTC). Sin abrir: el resto de la lista.

- RFC 3339 (marcas de tiempo con desfase y `Z`) e ISO 8601.
- RFC 8259 (JSON) y RFC 4180 (CSV).
- NIST SP 800-92 (gestión de registros: fuentes, formatos y sincronización de relojes).
- NIST SP 800-86 (técnicas forenses en respuesta a incidentes: marcas de tiempo y zonas horarias).
- NIST SP 800-61 (respuesta a incidentes; análisis y documentación).
- Microsoft Learn, evento 4624 («An account was successfully logged on»).
- CompTIA Security+ SY0-701, objetivos 4.8 y 4.9 (documento 7.0).

### F.3 Comprobado en el repositorio frente a propuesta

| Dato | Estado |
|---|---|
| Halden va a UTC+1 en invierno | comprobado: `video/siem/src/data/s03-normalize.ts:5-6`, `:113-117`; `video/siem/narration.json:90` |
| El desfase de Halden en verano | **no consta**: el vídeo no lo afirma («la diferencia cambia con el horario de verano») |
| El puerto tiene EDR | comprobado: `reg:101` y siguientes |
| El puerto tiene un proxy web | **no consta**: propuesta, «imagina» |
| `SALES-WS-03`, Comercial; `10.20.6.x`, VLAN de Oficinas | comprobado: `reg:4487`, `reg:4491` (y `a.soto` en `10.20.6.52`, `reg:4490`) |
| `l.prado`, `10.20.6.37`, `syncbox.exe`, PID 6120, `subidas.compartir.example`, `198.51.100.117`, horas y bytes | propuesta; no aparecen en `reg` |
| Que no copia la práctica ni la evaluación | comprobado: la práctica usa +02:00, 08:01Z, 08:02Z y 800 bytes (`prac:132`); la evaluación, 14:00+02:00 y 200 bytes (`fund:78-79`). Aquí: invierno +01:00, una hora sin zona, un proxy y 46 MB |

### F.4 Pendiente de comprobar

- Que Lidia acepte añadir un proxy web al puerto en un caso «imagina», y que el equipo de Comercial salga sin él.
- Que reutilizar `SALES-WS-03` (limpio en las dos cazas de GLASS HARBOR) en un «imagina» no confunda; si se prefiere,
  se cambia por un nombre nuevo.
- La imagen de los testigos: `reg` §6 no la tiene ocupada; J. Rekola es testigo real del caso, pero no como imagen.
- El objetivo de cada tarjeta de examen (00-propuesta §6).
- La duración real tras `build-timeline --estimate` y la grabación.

## Decisiones tomadas (fase 1)

> 2026-10-28 · rama `video-reconstruir`. Fase 1 = carpeta del vídeo (`video/reconstruir/`) con `video.json`, `narration.json`, `storyboard.json`, léxicos, andamio de escenas (un stub por id) y `src/timeline.json` estimado. Sin escenas, sin voz, **sin congelar**. Todo lo de abajo es la opción recomendada de la ficha; Lidia dice solo qué cambia.

### Pendientes de F.4

| Pendiente | Decisión |
|---|---|
| Proxy web en el puerto, en un caso «imagina» | Aceptado. El sello «Autoridad Portuaria de Halden · imagina · caso de entrenamiento · sin fecha · no ha pasado» va fijo de s02 a s11 y el equipo de Comercial sale sin él (s10). Se anota como «previsto» en el canon al cerrar el vídeo. |
| Reutilizar `SALES-WS-03` | Se mantiene: limpio en las dos cazas (`reg:4487`) y V1/V5 lo dan por limpio (`out/canon-refs.md`). Con el sello «imagina» y sin fecha no confunde; si Lidia prefiere un nombre nuevo, es un cambio de cadena en `storyboard.json` (`goal`) y en las escenas. |
| Imagen de los testigos | Se mantiene, rotulada «imagen · no es del puerto», con siluetas sin rasgos (no es J. Rekola ni nadie del canon). |
| Objetivo de cada tarjeta de examen | Los de `00-propuesta.md` §6: s03, s05, s07, s09 y s10 con 4.9; s08 con 4.8. Insignia por defecto «EXAMEN · SY0-701 · N.N» (sin `examBadge`). |
| Duración real | `build-timeline --estimate`: **526,8 s (8:47)**, dentro de 380-600 s. Es más que los 8:19 del cálculo de E.2 porque el motor estima a 2,5 palabras/s y la ficha a 2,7. Con la lectura de Lidia (85-93 % del estimado en vídeos anteriores) quedaría hacia 7:30-8:10. 1187 palabras, 66 segmentos, 12 escenas, 6 tarjetas, 2 pausas, 5 efectos de contenido. No se ha recortado nada para acercarse a 8:19. |

### De `00-propuesta.md` §6-§8

- **Perfil y formato:** `principal-yt`, sin adversario ni mensajes interceptados (el motor pone a 0 el mínimo de interceptados sin adversario), `"music": "Go On Going - Stayloose.mp3"`, voz `recording/lidia` **sin `recording.tempo`** (solo `maxPauseMs: 250`), `examTiming: "sentence-end"`.
- **Pronunciación de las siglas** (propuesta; Lidia elige y los léxicos alimentan la comprobación de su grabación): UTC «u te ce», EDR «e de erre», JSON «yeison», CSV «ce ese uve», 443 «cuatro cuatro tres». Los dos léxicos (`lexicon.json` y `lexicon.chatterbox.json`) son iguales. «zeta», «más uno», «proxy» y «log» van como palabras normales.
- **Integración en la app** (`videoId` en f12): fuera de esta fase.

### Lo que no se pudo traducir tal cual, y por qué

1. **`"lesson": "f12"`**: `video.json` solo admite ids `spNmN`/`sN mN` (`paths.mjs`, `^sp?\d+m\d+$`) y lo **rechaza con error**, no con aviso. Se omite el campo. Consecuencia: la descripción de YouTube no enlaza la lección (se escribe a mano al subir) y `scene-brief` no la localiza (el brief la nombra a mano).
2. **`examTiming`** va en `narration.json`, no en `video.json` (así lo lee el motor).
3. **Título de YouTube.** La ficha daba «… · Fundamentos para Security+» (84 caracteres) y el motor añade « | Security+ SY0-701 en español» (límite 100 en total; 80 en el campo). Queda `youtubeTitle`: «Cómo reconstruir lo ocurrido: logs, UTC y cronologías · Fundamentos» (98 con el sufijo).
4. **Etiquetas de YouTube:** la ficha no traía ninguna. Se derivaron 15 de los conceptos clave y del léxico (logs, registros de seguridad, UTC, zona horaria, cronología de un incidente, correlación de eventos, JSON, CSV, proxy, EDR, cortafuegos, deny y allow, observación hipótesis conclusión, fundamentos de ciberseguridad, Security+).
5. **Cue `title`.** La ficha lo ponía en «cuatro registros» (hacia los 12,5 s con el estimado: el aviso del motor salta después de 12 s). Se mueve a «¿Se han llevado datos?» (hacia los 10 s); `cards` sigue en «cuatro registros». La burbuja de la pregunta ya no tiene cue propio (caería a 0 fotogramas del título): la escena usa `wordFrame`. Se quitó también el cue `no` de s09-02 (a 28 fotogramas de `meaning`).
6. **Notas de transcripción de E.3** (`[En pantalla: …]`): el motor no tiene dónde ponerlas (la transcripción sale solo del texto hablado, más los mensajes interceptados y las preguntas de examen). Quedan escritas en el bloque «Canon» de `out/scene-brief.md` para que las escenas muestren todos esos datos; falta decidir si se añade un campo de nota de transcripción al motor (cambio aparte, no hecho aquí). Mientras tanto la transcripción de este vídeo no lleva las líneas de registro.
7. **Sello de caso.** El motor ya dibuja «Simulación educativa · datos ficticios» y el descargo de CompTIA (esquina y transcripción); las escenas dibujan solo el sello «imagina». No se usa `storyboard.notice` (el motor no lo lee en los vídeos de Security+).

### Lo que no cambia

- El texto de locución es **idéntico carácter a carácter** al de la parte C (comprobado por script); solo se re-segmentó por frases (la ficha agrupa por párrafos; el motor quiere 8-30 palabras por segmento) y se añadieron cues y etiquetas de emoción. Palabras por escena = las de E.2 (83, 109, 82, 119, 124, 116, 120, 94, 75, 89, 95, 81).
- Tarjetas, pausas y efectos: tarjetas en s03, s05, s07, s08, s09 y s10; pausas en s04 y s09 (`holdMs` 4500); efectos: `alarm` en `alert` (s01), `whoosh` en `jump` (s05) y `check` en `host`, `user` y `label` (s07).
- `targetSec` y `wordBudget` (= `targetSec` × 2,7) son los de E.2; el estimado va de 1,5 a 6 s por encima de cada `targetSec` por la diferencia de ritmo (2,5 frente a 2,7). `targetTotalSec`: 479.
- Validación: `build-timeline --estimate` sin avisos; `script-sheets` solo avisa de «no congelado»; `canon-check`: 7 cadenas, 1 con historia (`SALES-WS-03`, limpio) y 6 nuevas (`l.prado`, `bytes_out`, `subidas.compartir.example`, `syncbox.exe`, `198.51.100.117`, `10.20.6.37`), ningún choque.
- **Falta para congelar:** las dos revisiones (exactitud y naturalidad) sobre este guion y que Lidia confirme las siglas.

- **IP cambiada (2026-10-28):** `198.51.100.90` choca con `tienda-flores.example` del listín de V4; el sitio de subidas usa ahora `198.51.100.117`, libre en todo el repo.

## Revisiones aplicadas (2026-10-28)

Se aplicaron las dos revisiones (exactitud y naturalidad) sobre `narration.json`, `storyboard.json`, `data.ts`,
`data-b.ts` y las escenas. **La fuente de la voz es ahora `narration.json`; el texto de la parte C de esta ficha queda
como la primera versión** (no se reescribió). El guion **no está congelado** (`video.json` sin `frozen`).

### Aplicado

- **Exactitud 1 (relojes).** s07-05 «Seguramente son dos relojes, y cada uno apunta a su manera»; s07-06 «Unos segundos
  es habitual. Si fueran minutos o una hora exacta, revisa el reloj o la zona antes de sospechar de la historia».
  Pantalla: «segundos: habitual» y
  «minutos u horas enteras: revisa reloj o zona» (en dos líneas).
- **Exactitud 2 (frontera observación / conclusión).** s10-02 fusionado con la naturalidad 23 («El EDR y el cortafuegos
  ven al equipo hablando directamente con una dirección de fuera, no con el proxy. Por eso no parece que pasara por él.
  El bloqueo prueba una sola cosa. Que esa subida no salió por la puerta del proxy»); s10-03 «Y no descarta que saliera
  algo por otro camino»; s10-04 «…es, como mínimo, algo que hay que comprobar» (rótulo «¿sale sin proxy?» · «a comprobar»).
  Pantalla de s10: `dst=198.51.100.117:443` recuadrado sobre el camino directo; el cortafuegos pasa a la **salida
  común**, donde cruzan los dos caminos (ve también el tráfico del proxy). s11-03 «…una conexión hacia una dirección
  externa que el proxy no registra, según el EDR y el cortafuegos» y s11-05 «…comprobar si ese equipo puede salir sin
  proxy» (también `REPORT[1]` y `NEXT_STEPS[2]`).
- **Exactitud 3 (sello «sin fecha» frente a invierno).** Como la frase del puente en s04-06 no cabía en el presupuesto, se
  usó la alternativa: el sello dice «un día de invierno · sin fecha concreta» (`STAMP_PARTS`).
- **Exactitud 4 (PID).** El número de proceso une el arranque con la conexión: lo dice s07-02 («Y el mismo número de
  proceso une el arranque con la conexión») y en pantalla un cuarto hilo `PID 6120` une las filas r3 y r4 del EDR (se
  enciende con la palabra «proceso», sin cue propio y sin check). En el storyboard, `52811` ya no «es el de F1»: es el
  concepto de F1 (F1 usa 51422 → 61002).
- **Exactitud 5.** s06-02 «una cuenta inicia sesión en un equipo de Comercial» (la fila r1 de pantalla no nombra
  Comercial, así que no cambia); s01-01 «Desde un ordenador de Comercial han intentado subir algo a una nube personal…»;
  s05-04 «Así que primero hubo un inicio de sesión, y luego el bloqueo de una subida» (rótulos de pantalla «sesión» →
  «subida bloqueada»).
- **Exactitud 6.** s02-02 «Y solo cuenta lo que vio desde su sitio, si funciona bien».
- **Exactitud 7.** s06-07 «Y a las nueve y tres, el cortafuegos deja pasar una conexión de tres minutos, con unos
  cuarenta y seis megas de salida. Parece la misma, y enseguida verás por qué lo es»; fila r5 «sesión permitida · inicio
  09:03:05 · 181 s», con la nota gris «46 180 352 bytes de salida» (para no perder la cifra en pantalla).
- **Exactitud 8.** s08-03 «al menos dos hipótesis»; s08-05 «…y puede haber más».
- **Exactitud 9.** El `src` del cortafuegos lleva el rótulo gris «origen interno» (en s03, bajo la caja «dónde»).
- **Exactitud 10.** Etiqueta gris «id de evento» bajo `4624` en la tarjeta del inicio de sesión (s02).
- **Naturalidad, alta.** s01-03, s02-01/03/04, s03-01/02, s04-03/04/05, s05-02/06, s06-01/06, s07-02/03, s12-02 con el
  texto indicado (s04-05 partido en dos frases por el aviso de longitud; s06-06 escribe `443`, que el léxico lee «cuatro
  cuatro tres»; s12-02 «lo que falta en un registro no es un no», con la línea de pantalla «lo que falta»).
- **Naturalidad, media.** s07-04 («Así sabes que quien abrió la conexión permitida fue ese programa…»), s08-02, s08-03,
  s09-03/04/05, s11-06, s12-01/03/04 («La primera.», «La segunda.», «La tercera.»).

### No aplicado (y por qué)

- **Pausa de s04-06 a 6500 ms:** el motor limita `think.holdMs` a 1800–5000 (`THINK_HOLD_MS` en `narration.mjs`); queda
  en **5000**. Para más tiempo habría que subir el tope del motor (cambio compartido, no hecho aquí).
- **Puente de s04-06** («El cortafuegos de ese mismo día marca más uno…»): no cabía (+20 palabras); se resolvió con el sello.
- **s07-06 «O sea, que la hora ayuda, pero lo que une son los campos»** (+12): recortado por presupuesto. **s08-05/s09-05 «o sea»**, **s10-04 «hallazgo, o sea»** y **s02-06
  «el cortafuegos también apunta pares, pero sin llaves»**: no se añadieron.
- **Presupuesto:** los textos pedidos sumaban 613,7 s de estimado; se recortó lo anterior y se bajó 50–150 ms la
  `pauseAfterMs` de los segmentos que pasaban de 300 ms. Queda en **592,9 s** (techo 600). Las 12 escenas
  superan su `targetSec` (de +3,9 a +19,8 s; s07 la que más): ya lo hacían por la diferencia de ritmo de la parte E.2.

### Anotado (punto 11, sin tocar la voz)

- Las horas sin fecha son **hora del día**: RFC 3339 exige fecha, y si hubiera un cambio de día invertiría el orden.
- El proxy registra la **IP de cliente**: conviene anotarlo o poner `10.20.6.37` en la línea del proxy (no se hizo).
- La estructura se parece a la de `foundation-timeline`: la forma coincide, no las cifras ni el contexto. Opcional: nombrar
  la tríada intento / éxito / impacto en s09–s11.
- El `+02:00` de verano de S05Utc es correcto para Halden y queda como «previsto» para registrar en `glass-harbor.md`.
- La transcripción no lleva las líneas de registro (accesibilidad pendiente, ver «Decisiones», punto 6).
- `00-propuesta.md` §6 aún lista `198.51.100.90`; se corrige en la rama de F1, no aquí.
- **Lecturas para la grabación:** las horas se dicen «nueve y uno» (no «y una»); `443` tiene dos lecturas posibles
  («cuatro cuatro tres» y «cuatrocientos cuarenta y tres»); el léxico solo admite una cadena por palabra, así que queda la
  primera y se avisa aquí para el control de las grabaciones.

### Avisos del validador: resueltos

Los siete avisos (s06-07, s07-02, s10-02, s11-03, s11-05) se resolvieron partiendo frases y segmentos con las mismas
palabras (solo puntuación y mayúscula inicial). `build-timeline --estimate` queda **sin avisos**, 71 segmentos, 594,4 s.
Los segmentos se **renumeraron**: s06 tiene ahora s06-01…s06-08 (la frase «Parece la misma…» es s06-08); s07 pasa a
8 (s07-02 equipo y cuenta, s07-03 el PID, s07-04 la etiqueta, s07-05 origen y destino, s07-06 correlación, s07-07 los dos
relojes, s07-08 la regla); s10 a 6 (s10-02 la conexión directa, s10-03 «Por eso no parece… prueba una sola cosa…», s10-04
lo que no descarta, s10-05 el hallazgo, s10-06 el cierre); s11 a 7 (s11-03 y s11-04 parten el segundo párrafo del informe,
s11-05 los pasos, s11-06 «O sea, no escribes…»). Los `wordFrame` de las escenas se actualizaron. s11-06 antiguo → s11-07
(frases de los pasos en tres: «…el destino. Revisar qué archivos se leyeron. Y comprobar si ese equipo puede salir sin proxy.»).
