### V19 · sp2m4 · Cápsula · «SQL injection y XSS: cuando un texto se vuelve orden»

> Propuesta del 2026-10-08, lista para pegar tal cual en el plan de vídeos (§5, tras V18). Se graba con V18 (sp4m5): dos
> cápsulas de Security+ en la misma sesión, RED MARROW (voz de teléfono) y SILENT PAGER (voz de máquina). La versión
> vigente de escenas y guion será `video/inyeccion-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/inyeccion-halden/out/script-notes.md`. Las decisiones, con la alternativa descartada de cada una, están en
> `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V18-V19.md` (apartado V19).
>
> Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`.

- **Carpeta:** `inyeccion-halden` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo
  **2.3** (lo confirma la cabecera de la lección, `sp/sp2-part2.ts:247`) · adversario **RED MARROW** (sección sp2,
  `sp/sections.ts:63-68`), dos mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: la de V10,
  `"adversaryVoice": { "voice": "sapi/Microsoft Laura", "rate": 0, "fx": "telefono" }` (`video/logs-halden/narration.json:11-15`);
  la voz no fija el género, decisión de Lidia del 2026-10-04 · música `Go On Going - Stayloose.mp3` ·
  `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3800.
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "secplus"`, `"adversary": "RED MARROW"`, `"lesson": "sp2m4"` y
  `"tags"`: SQL injection, SQLi, XSS, cross-site scripting, reflected XSS, stored XSS, parameterized queries, output
  encoding, input validation, vulnerabilidades web, Security+. Título de YouTube: «SQL injection y XSS: cuando un texto se
  vuelve orden | CompTIA Security+ en español».
- **Efectos (`sfx`):** los automáticos del motor y cuatro momentos: `bypass` («error», la sesión se abre sin contraseña),
  `blocked` («block», la misma entrada ya no entra), `cookie` («alarm», la cookie sale del navegador) y `vitrina` («lock»,
  el aviso queda dentro de la vitrina).
- **Léxico nuevo** (lo confirma Lidia al grabar): `SQL` («ese cu ele»), `SQLi` («ese cu ele i»), `XSS` («equis ese ese»),
  `cookie` («cuqui»), `script`, `stored` y `reflected` (se dicen en inglés, como `account lockout` en V10).
- **Lo que se lee no se deletrea:** la carga (`' OR 1=1 --`) y el script van solo en pantalla; la voz dice «una comilla,
  una condición que siempre se cumple y dos guiones» y «una etiqueta de script». Las direcciones, los parámetros y las
  consultas no se leen. Ninguna excepción: el texto de la carga es la pista central, pero la pista es lo que hace, no cómo
  se escribe.
- **Duración:** suma de `s` **210 s** (6 escenas; `wordBudget` a 2,7 palabras/s: 54, 113, 108, 140, 92 y 59, unas 566).
  Misma estructura que V10 y V12 (dos mensajes y una pregunta); con 210 s, V12 estimó unos 260 s y renderizó unos 235–245
  (≈ 4:00): dentro de 190–260. Los extremos conocidos dan 187–256 s. El primer borrador se mide por los dos lados: si el
  estimado pasa de 255 s, se recorta en este orden: primero, en s04, la segunda y la tercera persona que abren el listado
  (quedan en la pantalla); después, en s05, la frase de los complementos (validar la entrada y la política de contenido, que ya
  van en pantalla; la línea del examen sobre input validation **no** se recorta). Si se acerca a 190 s, se alarga s02, la lectura de la consulta. No se rellena. s04 es la escena más
  cargada (dos demos, una pregunta y una tarjeta): si el título de s01 entra después de los 12 s, se recorta s01 y no
  s04.
- **Inserción:** en `sp/sp2-part2.ts`, lección sp2m4, entre el check del XSS almacenado en el portal de tickets
  (`:324-332`) y la «Nota de examen: dos reflejos automáticos» (`:333-338`), como bloque
  `{ t: 'video', title: 'SQL injection y XSS: cuando un texto se vuelve orden', youtube: '<id>', poster: 'videos/inyeccion-halden-poster.png', transcript: 'videos/inyeccion-halden-transcript.txt' }`,
  precedido de una línea: «Antes de la nota de examen, míralo en una web de pruebas: dónde se cuela un texto y dónde se
  frena». Todo lo que enseña el vídeo va antes en la lección: la SQL injection (`:292-295`), su consulta y su corrección
  (`:296-318`), el XSS reflejado y el almacenado con su defensa (`:320-322`) y el check (`:324-332`). La nota de examen lo
  remata con los dos reflejos. Se fija en la suite `lesson videos` de `src/data/content.test.ts` (`:267-296`) con su línea
  `toBe('sp2m4')`.
- **Enfoque («tres cajas de texto antes de publicar»):** jueves 5-11, 10:00. El equipo de desarrollo enseña a la analista la
  copia de pruebas del portal de citas de camiones (el que la lección sp4m4 ya tiene en desarrollo, `sp/sp4-part2.ts:413`;
  nunca salió en pantalla) antes de publicarlo. Datos ficticios, ningún atacante, ningún incidente: una revisión. Tres cajas
  donde la gente escribe y tres sorpresas: el login (SQL injection), el buscador de citas (XSS reflejado) y las
  observaciones para el personal de la puerta (XSS almacenado). RED MARROW da dos consejos de amigo que son mentira. **No es
  el portal de reservas** (`hpa-portal-web-01`): ese es el de V10 y V11. La fecha cae entre V11 (3-11) y V12 (9 al 12-11) y
  no toca nada. No hace falta frase de puente: el vídeo no continúa ningún otro. Quien sigue el curso ve V19 (sp2m4) antes
  que V10 (sp2m7), donde RED MARROW sale por primera vez: se presenta con una frase, solo «que vive de engañar» (la de V10 sigue con «y sí, cumple las normas», que aquí no vale), y nunca con «otra
  vez».

**Conceptos (3) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | SQL injection. La web arma la consulta pegando el texto de la persona dentro de la frase; si ese texto trae sintaxis SQL, deja de ser un dato y pasa a ser parte de la orden. El caso de examen es saltarse el login (también leer o modificar tablas). Se corrige con parameterized queries: la consulta viaja con marcadores y el texto, aparte, como dato. Refuerzos: input validation con allow list y least privilege en la cuenta de la base (`sp/sp2-part2.ts:292-318`, q2 `:395-408`) | Un formulario del puerto. La consulta vulnerable es una frase con un hueco al que se pega tu texto: si lo que pegas cambia la frase, ya no rellenas una casilla, redactas la pregunta. La consulta parametrizada es el formulario impreso de antemano, con su casilla: lo que escribes se queda en la casilla y se lee siempre como un nombre | «SQL injection: el input se pega dentro de la consulta» · «SQLi se corrige con parameterized queries» |
| 2 | Cross-site scripting. Es la misma lógica, pero lo inyectado es JavaScript y lo ejecuta el navegador de otra persona, no el servidor. Reflected: el servidor devuelve el texto en la respuesta y la víctima tiene que pulsar un enlace preparado, por eso suele ir con phishing. Stored: el script queda guardado en el servidor y se ejecuta para todo el que abra la página, sin engañar a nadie. Con ello se roban cookies de sesión (`:320-321`, check `:324-332`, q3 `:410-418`) | El panel de avisos de la puerta de camiones. El buscador es el cartel que te repite lo que le has preguntado (reflected); las observaciones son el tablón donde lo que alguien clava lo lee todo el que pasa (stored). El navegador obedece lo que pone el aviso | «Reflected: viaja en el enlace. Stored: queda guardado» |
| 3 | Es la misma causa, y la defensa va donde el dato se encuentra con el código: parameterized queries en la consulta, output encoding en la página (el servidor convierte los caracteres especiales en texto inofensivo antes de mostrarlos), con input validation y la política de contenido (CSP) como complementos. **En el examen, si entre las opciones aparece input validation, esa es la respuesta** (nota `:337`). Cifrar la base de datos, un cortafuegos de red o una contraseña más larga no impiden que un texto se interprete como código (`:321`, nota de examen `:337`, q2) | La casilla del formulario (concepto 1) y, para la página, una vitrina: el aviso se lee, pero no se obedece. Los dos juntos: el dato en su sitio | «XSS: la defensa principal es output encoding» |

**Escenas:** seis, en tres capítulos (Cuando el texto manda · Lo que devuelve la página · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Tres cajas de texto» | I Cuando el texto manda | 20 | «05-11 · jueves · 10:00 · revisión antes de publicar» y, bajo ella, el rótulo «Citas de camiones · entorno de pruebas · datos ficticios». La copia aparece como tres pantallas pequeñas a media luz, con la caja de cada una resaltada: el login (usuario y contraseña), el buscador de citas (matrícula) y las observaciones para el personal de la puerta. Las dos primeras frases hablan del encargo entero («El equipo de desarrollo te enseña la nueva web de citas para camiones. Hoy pruebas las tres cajas donde la gente escribe»); al acabarlas, título «Cuando un texto se vuelve orden» (hacia los 8 s, siempre antes de los 12) y la promesa en tres chips: «el login · la búsqueda · las observaciones». Después, las tres cajas se encienden juntas y la voz añade «las herramientas ayudan, pero nada sustituye a probar la web» | La promesa en los primeros 10 s: tres cajas de una web sin publicar; al acabar, ver cómo un texto se convierte en orden y dónde se frena · `date, app, boxes, title, promise` |
| s02-sqli «Una comilla en el login» | I | 42 | La pantalla de acceso de la copia. Primero, un intento normal, con un usuario de prueba y una contraseña equivocada: «usuario o contraseña incorrectos». Después, lo que hay detrás, con la consulta de la lección (`:301`): `SELECT * FROM users WHERE name = '<input>' AND pass = '<input>'`, con el texto de la persona en cian y el programa en blanco. Dónde mirar, por pasos y con el resto atenuado: el hueco del nombre; lo que se escribe, `' OR 1=1 --`, cuya comilla cierra el nombre antes de tiempo (lo cian pasa a blanco: ya es parte de la orden); `OR 1=1`, una condición que siempre se cumple; y `--`, que apaga el resto, la contraseña incluida (se tacha en gris). La consulta resultante (`:306-307`): «devuelve todas las filas». La web abre sesión «sin contraseña» (`bypass`). La imagen: el formulario del puerto con un hueco al que se pega el texto de la persona; si lo que se pega cambia la frase, redactas la pregunta. Nombre SQL INJECTION. La tarjeta, con la consulta ya quieta | El texto de la persona se pega dentro de la consulta y deja de ser un dato · `login, fail, query, hole, quote, always-true, comment, result, bypass, form, name` |
| s03-casilla «Cada dato en su casilla» | I | 40 | «¿Cómo se arregla?» La narradora presenta a RED MARROW y llega el mensaje interceptado. Respuesta: «cifrar la base de datos» (el cifrado en reposo, el del disco) protege lo que hay en el disco si se lo llevan (rótulo «disco»), pero no cambia la consulta: la web abre la base con sus propios permisos y es ella quien lanza la consulta trucada (rótulo «la lanza la propia aplicación»). Lo que arregla es separar la orden del dato: la consulta sale con marcadores, `WHERE name = ? AND pass = ?` (`:312-313`), y el texto viaja aparte como dato. Se repite la misma entrada: ahora se compara tal cual con un nombre y no hay nadie con ese nombre, «usuario o contraseña incorrectos» (`blocked`). La imagen: el formulario impreso de antemano, con su casilla. Nombre PARAMETERIZED QUERIES; debajo, pequeño y en gris, los complementos de la lección (`:316-317`): «validar la entrada (allow list)» y «cuenta de la base con los permisos justos». La tarjeta, con la entrada ya repetida | Separar la orden del dato lo arregla; cifrar la base no toca la causa · `fix, db-encrypt, not-this, marks, data, replay, blocked, form-box, names` · **intercept** |
| s04-vuelve «Un texto que vuelve» | II Lo que devuelve la página | 52 | «Segunda caja: el buscador de citas». La dirección de la copia, sin dominio, con `buscar?matricula=` y detrás `<script>enviar(document.cookie)</script>`; la página de respuesta con «Resultados para:» y, en el código de la página, el mismo texto tal cual, sin tocar. Pregunta para pensar, con la página quieta y dos botones: «servidor» y «navegador». Respuesta: el navegador. El servidor solo devolvió el texto dentro de la página; el que lo ejecuta es el navegador de quien pulsó el enlace. Un dibujo de ese navegador, con una cookie que sale hacia «sitio externo» (`cookie`). Nombre CROSS-SITE SCRIPTING; y REFLECTED: «viaja en el enlace · alguien tiene que pulsarlo · suele ir con phishing». «Tercera caja: las observaciones.» El mismo script se guarda en la cita; el listado del día del personal de la puerta: lo abre una persona y su navegador lo ejecuta, la abre otra y otra. Nombre STORED: «queda guardado en el servidor · salta para todo el que abra la página». La imagen: el panel de avisos, con el cartel que repite lo que le preguntas y el tablón donde se clava lo que otro lee. La tarjeta, con los dos nombres ya quietos | El script lo ejecuta el navegador de otra persona. Reflected viaja en el enlace y hace falta un clic; stored se queda guardado y salta para todos · `search, link, echo, question, browser, cookie, xss, reflected, notes, saved, opens, stored, board` · **think** |
| s05-vitrina «Dentro de una vitrina» | II | 34 | «¿Y esto cómo se arregla?» La narradora vuelve a RED MARROW y llega el segundo mensaje interceptado. Respuesta: el navegador solo hace lo que la página le dice, y la página la escribe el servidor, con tu texto dentro. La misma página, ahora con el texto codificado: el `<script>` aparece como texto visible en pantalla y no se ejecuta (`vitrina`). Nombre OUTPUT ENCODING. La imagen: el aviso dentro de una vitrina, que se lee pero no se obedece. Debajo, pequeño y en gris, los complementos (`:321`): «validar la entrada · política de contenido (CSP)», y una línea: «en el examen, si entre las opciones ves input validation, esa es la respuesta» (nota `:337`). Una línea de acción: «consultas parametrizadas y codificación de salida en el portal de citas · Desarrollo · 13-11». Cierre del capítulo: la casilla y la vitrina juntas, «el dato en su sitio». La tarjeta, con el cierre ya quieto | La defensa del XSS es el output encoding, en el servidor; la misma raíz que la SQL injection · `fix, browser-obeys, server-writes, encoded, vitrina, output-enc, extras, exam-line, action, same-root` · **intercept** |
| s06-recap «Tres reglas» | III Para el examen | 22 | Tres tarjetas de reglas, cada una con su icono (la casilla · el enlace y el tablón · la vitrina); tarjeta final Alertópolis: «Tu turno: termina la lección y sus preguntas» (44) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (objetivo 2.3), una por escena de s02 a s05, ninguna en la última y cada una con su cue antes de
  la última frase de la escena (`examTiming: sentence-end`):
  - «SQL injection: el input se pega dentro de la consulta» (s02) (53)
  - «SQLi se corrige con parameterized queries» (s03) (41)
  - «Reflected: viaja en el enlace. Stored: queda guardado» (s04) (53)
  - «XSS: la defensa principal es output encoding» (s05) (44)
- **Pregunta para pensar:** «¿Dónde corre el script: servidor o navegador?» (s04) (45), `holdMs` 4500. Llega con la
  dirección y el eco ya a la vista y sin rótulo que la conteste (los nombres XSS y REFLECTED salen con la respuesta).
  Respuesta: el navegador. El servidor solo devolvió el texto dentro de la página; es el navegador de quien abrió el
  enlace el que lo ejecuta, y por eso se llevan la cookie de esa persona. Es lo que distingue el XSS de la SQL injection,
  donde quien interpreta el texto es la base de datos. El título de la escena («Un texto que vuelve») no da la
  respuesta.
- **Mensajes interceptados** (RED MARROW, `holdMs` 3800, uno por capítulo en I y II; ninguno en el cierre):
  - s03: «Cifra la base de datos y no se llevan nada. Confía en mí.» (57). El error concreto que corrige la narradora:
    tomar el cifrado de la base de datos por la defensa. Protege lo que hay en el disco si se lo llevan; la web abre la
    base con sus propios permisos y es ella quien lanza la consulta trucada, así que el login sigue roto y la aplicación
    ve los datos descifrados. Lo arregla separar la orden del dato (nota de examen `:337`; es el distractor «full-disk
    encryption» de q2, `:395-408`). Sin «cifrar no sirve»: cifrar el disco sirve para otra cosa.
  - s05: «Si corre en el navegador, el fallo no es tuyo. Confía en mí.» (60). El error: culpar al navegador. Hace lo que la
    página le dice, y la página la escribe el servidor, con el texto de otro dentro; el fallo es cómo se devuelve ese
    texto, y la defensa se pone en el servidor (`:320-321`). La ironía va en el marco («qué amable»), no en el dato.

  Los dos mantienen su voz de V10 (consejos de amigo que son mentira, frases cortas, «Confía en mí») y no contradicen sus
  dos mensajes publicados. Se descartan a propósito las dos mentiras de V10 (contraseña que cumple las normas; borrar el
  texto de la URL), para que no suenen a un guion repetido. Ninguno marca el género de quien habla.
- **Cierre:** tres reglas y una sola tarea.
  1. Un texto que acaba dentro de la consulta es SQL injection: el texto debe viajar aparte, como dato, con parameterized
     queries.
  2. Un script que corre en el navegador de otra persona es XSS: reflected, si viaja en el enlace; stored, si se queda
     guardado.
  3. Se arregla donde el dato se encuentra con el código: parameterized queries en la consulta y output encoding en la
     página. Cifrar la base de datos no lo arregla, y en el examen, si entre las opciones aparece input validation, esa es.

  Tarea: terminar la lección y sus preguntas. El vídeo va a mitad de sp2m4, antes de la nota de examen, del sistema
  operativo y el hardware y del zero-day (`:333-377`), y cinco de las siete preguntas (la q1 del buffer overflow, la q4 del
  TOC/TOU, la q5 del fin de soporte, la q6 del zero-day y la q7 de la actualización maliciosa) tratan de lo que el vídeo
  deja fuera; las que tocan lo que cuenta son la q2 y la q3.
- **Se queda fuera** (sigue en la lección):
  - Memory injection, buffer overflow, race condition (TOC/TOU) y malicious update: `sp/sp2-part2.ts:266-274`, check
    `:276-290`; quiz q1, q4 y q7.
  - Sistema operativo y hardware (firmware, legacy y end-of-life) y la tabla de causas y correcciones: `:339-358`; quiz q5.
  - Zero-day y sus mitigaciones: `:360-377`; quiz q6.
  - Command injection y las demás inyecciones: solo como nombre en la nota de examen (`:337`).
  - Las cookies seguras y la validación en el servidor (`sp/sp4-part1.ts:378`, `:486`), el WAF como control compensatorio
    mientras se arregla el código (`sp/sp3-part3.ts:54-68`, `:231-240`) y el análisis de código y las pruebas de
    seguridad de la aplicación (`sp/sp4-part2.ts:455`): dan para otros vídeos. La CSP solo sale como complemento en pantalla.
- **Laboratorios:** ninguno de sp2 toca SQL injection ni XSS (spl2a clasifica actores, spl2b vectores de ingeniería
  social y spl2c elige mitigaciones tras un movimiento lateral, `sp/labs-sp2.ts:7-41`), así que no hay solución que
  destripar y la tarea final son las preguntas. Dos precauciones fuera de la sección:
  - spl2b clasifica técnicas de ingeniería social: el vídeo dice que el XSS reflejado «suele ir con phishing», que es la
    frase de la lección (`:320`), y no clasifica ningún mensaje.
  - Las preguntas q2 (el portal de seguimiento de buques) y q3 (el foro de servicios portuarios) y el check del portal de
    tickets (`:324-332`) tienen su escenario: el vídeo usa otro (el portal de citas) y no reproduce ninguno.

**Canon nuevo que fija V19** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **Jueves 2026-11-05, 10:00: revisión de seguridad previa a la publicación del portal de citas de camiones.** El portal
  ya existía en la lección sp4m4, en desarrollo y con análisis de código en su pipeline (`sp/sp4-part2.ts:413`); V19 lo
  pone por primera vez en pantalla, **en una copia de pruebas con datos ficticios, sin fecha de publicación y sin decir
  dónde vivirá en la red**. El vídeo no habla del análisis de código ni de su pipeline. Queda entre V11 (martes 3-11) y V12
  (lunes 9 al jueves 12-11).
- **Tres fallos en el código de esa copia** (los tres, del portal de citas y de nadie más): la consulta del login se arma
  pegando el texto, el buscador de citas devuelve la matrícula tal cual (XSS reflejado) y las observaciones se guardan y
  se muestran sin codificar (XSS almacenado). Nada se ha explotado fuera de la revisión; ninguna cookie real.
- **Mejora con responsable y fecha: «consultas parametrizadas y codificación de salida en el portal de citas · Desarrollo ·
  13-11»** (viernes). «Desarrollo» es un área nueva en pantalla; en la lección es «el desarrollo del portal de citas de
  camiones» (`sp/sp4-part2.ts:413`). Ni el área ni la mejora se desarrollan.
- **El personal de la puerta** (sin nombres) abre cada día el listado de citas del portal.
- **RED MARROW, segunda aparición** (primera en el orden del curso): «Cifra la base de datos y no se llevan nada. Confía en
  mí.» y «Si corre en el navegador, el fallo no es tuyo. Confía en mí.», sin fecha. Sigue sin IP, dominio, equipo ni
  género.
- **Comprobado contra la cronología (Node):** 3-11 martes, 5-11 jueves, 9-11 lunes, 12-11 jueves y 13-11 viernes. Nada
  choca con V10 (20 al 21-10), V11 (3-11), V12 (9 al 12-11), V16 (16 y 20-11) ni V17 (23 al 27-11).

**No se toca:**
- **El portal de reservas** (`hpa-portal-web-01`, `reservas.haldenport.example`) y todo lo que V10 y V11 dicen de él: el
  login de las navieras, sus contraseñas, la noche del 21-10, el FINDING #0147. Ninguna SQL injection ni XSS se prueba, se
  insinúa ni se compara con él. V10 dijo en voz que el traversal «no es una inyección»; V19 no lo retoma ni dice «como la
  del portal».
- **Qué pudo leer el traversal del 21-10:** ningún vídeo lo dice, y V19 no pone ningún ejemplo que lo sugiera (nada de
  contraseñas de navieras ni de ficheros del sistema).
- **El caso `IR-2026-0147`**, `svc_tosreport`, SILENT PAGER y todo lo de septiembre.
- **El dosier de RED MARROW** (`sp/sections.ts:68`): los kits de phishing contra los operadores de grúas, el proveedor de
  mantenimiento y «GH compra acceso a través de terceros». Las víctimas del vídeo son el personal de la puerta y quien
  pulsa un enlace de prueba: nunca operadores de grúas ni un proveedor. Nada insinúa que RED MARROW lance los fallos, los
  encuentre, los venda o trabaje con otros: solo da consejos.
- **Ningún atacante con nombre, IP, dominio o equipo:** el script de las cajas es de prueba. Ninguna IP ni dominio en
  pantalla (la dirección de la copia va sin dominio). Nada en `203.0.113.0/24`, `192.0.2.157` ni `198.51.100.0/24`.
- **WAF:** el vídeo no dice que un cortafuegos «no sirve» contra esto. Dice que cifrar la base no arregla la causa. Un
  WAF frena estos ataques mientras se corrige el código (`sp/sp3-part3.ts:66`, `:240`); de él, ni palabra, para no
  contradecir sp3m5.
- **Cuentas reales:** el usuario de prueba y las cuentas de la copia son ficticios y no se parecen a `r.haugen`, `a.berg`,
  `j.solheim`, `m.lund` ni `k.nyborg`. La contraseña de prueba no es `Halden2026!`.
- **El check del portal de tickets, q2, q3 y el check del buffer overflow** (otros escenarios): no se reproducen ni se
  contradicen.
- **La imagen de la «nota en la ventanilla»** de V10 (el traversal), los restaurantes de la amplificación DNS y las
  puertas del spraying: no se reutilizan, para no confundir la inyección con el traversal.
- No se culpa a nadie: ni a Desarrollo por los tres fallos (son lo que una revisión previa está para encontrar) ni a quien
  escribió la consulta.

**Comprobación de límites** (perfil `capsula-yt`; recuento con Node, `[...texto].length`):
- 6 escenas en 3 capítulos (máximo 3). Suma de `s`: 210 s; renderizado previsto 235–245 s (extremos 187–256), dentro de
  190–260.
- 3 conceptos (2–3), cada uno con como mucho dos tarjetas (2, 1 y 1).
- 4 tarjetas de examen (3–5), una por escena de s02 a s05, ninguna en s06; de 53, 41, 53 y 44 caracteres (máximo 58), sin
  `{}[]|<>`, flechas, marcas, viñetas ni emoji.
- 1 pregunta para pensar (exactamente 1), 45 caracteres (máximo 48), `holdMs` 4500.
- 2 mensajes interceptados (1–2), uno por capítulo (I y II), ninguno en la escena final; de 57 y 60 caracteres (máximo
  70); `holdMs` 3800 (2500–4500); `video.json` lleva `"adversary": "RED MARROW"`.
- `wordBudget` por escena (`s` × 2,7): s01 54 · s02 113 · s03 108 · s04 140 · s05 92 · s06 59 (total 566).
- Título antes de los 12 s: el encargo se dice en dos frases («El equipo de desarrollo te enseña la nueva web de citas para
  camiones. Hoy pruebas las tres cajas donde la gente escribe», 13 y 9 palabras, unos 8 s a 2,7 palabras/s) y el título
  entra tras la segunda, hacia los 9 s. Dicho en una sola frase de 25 palabras, entraría pasados los 12 s.
- Sin identificadores en la voz: la carga, el script, las direcciones y las consultas solo en pantalla.

**Notas para el guion** (revisión de exactitud y canon del 2026-10-08, `revision-secplus.md`):
- **Cues y efectos.** Cada `sfx` tiene su cue en la tabla de escenas: `bypass` (s02), `blocked` (s03), `cookie` (s04) y `vitrina`
  (s05). `sfxMapErrors` rechaza un efecto sin cue en el guion.
- **Input validation.** No es solo complemento: la nota de examen (`sp/sp2-part2.ts:337`) dice que, ante una pregunta de la
  familia injection, si entre las opciones aparece input validation (o su versión específica), esa es la respuesta. s05 lo dice
  en pantalla y la regla 3 del cierre, en voz.
- **Cookie y HttpOnly.** El script lee `document.cookie`; la lección enseña que `HttpOnly` lo impide (`sp/sp4-part1.ts:378`, q7
  `:483-496`). La voz dice «pueden llevarse la cookie de sesión», en condicional, nunca que el robo es inevitable ni que la
  cookie «siempre» sale.
- **«Cifrado en reposo».** En la respuesta a RED MARROW de s03 la voz dice «el cifrado en reposo» o «el del disco»: con cifrado a
  nivel de columna o de aplicación el resultado sería distinto.
- **SAST del pipeline.** La lección sp4m4 (`sp/sp4-part2.ts:413`) dice que el portal de citas lo incorpora. V19 se ve antes
  que sp4m4: s01 lleva la frase «las herramientas ayudan, pero nada sustituye a probar la web» y no habla del pipeline.
- **«Desarrollo».** Es una actividad de la lección que el vídeo convierte en área con responsable y fecha. Admisible (el registro
  ya admite áreas por función), pero el registro debe separar tres portales: el de reservas (`hpa-portal-web-01`), el de
  declaración de carga (`sp/sp4-part1.ts:384`) y el de citas de camiones (V19). En voz, «la web de citas», nunca «el portal» a secas.
- **«Suele ir con phishing» junto a RED MARROW.** Es la frase de la lección (`:320`), pero cerca de RED MARROW podría leerse como
  «RED MARROW lanza el enlace». En el guion no cae justo después del mensaje de s05 (va en s04, antes) y no se relaciona con él.
- **El personal de la puerta.** No se dice qué sistema de la puerta (`srv-accesos01`, `srv-bascula01`) lee el listado.
- **Presentación de RED MARROW.** Solo «que vive de engañar»; «y sí, cumple las normas» es del mensaje de V10.
