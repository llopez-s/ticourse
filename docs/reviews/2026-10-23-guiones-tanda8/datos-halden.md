# Revisión del guion · V48 `datos-halden` (sp3m6, `caso-yt`)

Revisor de solo lectura. Fecha: 2026-10-23. Guion revisado: `video/datos-halden/storyboard.json`, `narration.json`, `video.json`, `lexicon.json`,
`out/script-notes.md`, `out/canon-refs.md`. Ficha: `docs/superpowers/plans/fichas-tanda9/V48-sp3m6.md`. Lección: `src/data/secplus/sp3-part3.ts`
(sp3m6, `:357-522` los bloques y `:524-630` el quiz) y `sp3-cards.ts` (`fcp323`-`fcp326`, glosario `:94-99`). Objetivo SY0-701 3.3.
Plan de estilo: `docs/superpowers/plans/2026-09-25-lesson-videos.md` §1 («Narración hablada»).

**Alcance del canon.** Leí entero §1 (cabecera, rutas y tabla de vídeos de Halden) y §2 (cronología). El resto del registro (§3 a §6, ~600 KB)
lo recorrí por búsqueda de todo lo que el guion toca: fichaje, control de horario, reloj, DNI, RR. HH./Recursos Humanos, Dirección, jefa/jefe de turno,
pasillo, nube, región, Unión Europea/sede, exportación, hucha, trastero, bolso, banco, transferencia, caja/dinero, y la tabla completa de imágenes
ocupadas, más las notas de V28, V32, V34, V37, V45, V46 y V47 en lo que rozan. No he leído línea a línea los apartados de equipos y de las notas de los demás vídeos.

Cuenta rápida de lo que he comprobado de forma mecánica: 8 escenas, todos los `requiredCues` están en la narración; ningún `:` ni `;` en la voz; ninguna
frase de más de 22 palabras; ninguna etiqueta de emoción repetida en dos segmentos seguidos; 694 palabras habladas (las notas dicen 694).

---

## A. EXACTITUD Y CANON

### Hallazgos

**A-1 · CORREGIR · `s02-06` (escena s02-estados, cue `decision`) · «que es el least privilege» cuelga de toda la lista.**
La voz dice: «Se gira, se bloquea sola a los pocos minutos y cada jefa ve solo a su equipo, que es el least privilege.» Girar la pantalla (control físico contra
shoulder surfing) y el bloqueo de sesión no son least privilege; solo «cada jefa ve solo a su equipo» lo es (la lección lo lista aparte: «least privilege,
masking en pantalla, bloqueo de sesión, secure enclaves», `sp3-part3.ts:466`, y `:472` pone el bloqueo contra el *shoulder surfing*). Dicho así, un oyente se lleva
«bloquear la sesión = least privilege», que es justo la confusión de distractores que cae en el examen. Además el «que» tras «su equipo» puede leerse como
«equipo, que es el least privilege». Corrección (mismas palabras, dos frases, 22 palabras en total):

> `<firm> {decision}Se gira, se bloquea sola a los pocos minutos y cada jefa ve solo a su equipo. Esto último es el least privilege.`

En pantalla, el rótulo LEAST PRIVILEGE debe ir solo en la tercera medida (las dos primeras, sin rótulo o con «control físico · de sesión»). Si el motor ancla un solo rótulo
a `decision`, añadir un cue `{least}` justo antes de «Esto último» y ponerlo en `requiredCues` de s02 (cambio de `storyboard.json`; la narración lo permite sin tocar el presupuesto).

**A-2 · CORREGIR · `s06-05` (cue `tie`) · «nadie entra desde fuera» y «atarlo».**
«Y para atarlo, el dato se queda en una región de la Unión Europea y nadie entra desde fuera.» Dicho sin más, «nadie entra desde fuera» suena a cierre total del
acceso externo (perímetro, segmentación), no a geographic restrictions, que según la lección limitan **dónde reside** el dato y **desde dónde** se accede (`:500`:
geofencing de accesos y almacenamiento anclado a una región). Falta el «de la Unión Europea» (o «de esa región») que da el sentido geográfico. Y «atarlo» no tiene
antecedente claro (¿la ley?, ¿el dato?). Corrección (se mantiene «atar» para casar con `s08-03`):

> `<firm> {tie}Y para atar el dato a un territorio, se queda en una región de la Unión Europea. Y nadie entra desde fuera de ella. Son las geographic restrictions. {order}Primero se mira, y después se limita.`

(+5 palabras; las dos primeras frases quedan en 17 y 7.) La pantalla («solo en una región de la UE · nadie entra desde fuera») debería decir «nadie entra desde fuera de la UE» por la misma razón.

**A-3 · CORREGIR · `s04-03` (cue `vault`) · «Esa tabla es la vault, y eso es tokenization.»**
Define la tokenization como la tabla. La vault es el componente; la tokenization es sustituir el valor por un token sin valor propio **y** guardar la correspondencia
aparte (`sp3-part3.ts:496`, `fcp326`). El oyente puede quedarse con «tokenization = la tabla». Corrección (+4 palabras, mismo cue):

> `<warm> {vault}Esa tabla es la vault. Cambiar el DNI por un código es tokenization. Solo quien la tiene vuelve al DNI.`

El cue `token` de s04-02 (que hoy rotula TOKENIZATION al decir «la tabla que traduce…») puede quedarse: lo único que cambia es qué palabra de la voz lleva el nombre.
Si se prefiere que el rótulo coincida con la voz, mover el cue `token` a `s04-03` justo antes de «Cambiar el DNI» (hay que reordenar las dos marcas en el storyboard).

**A-4 · CORREGIR (condición del PR del vídeo, no del guion) · lección: `fcp325` y glosario `sp3-cards.ts:97` siguen juntando geolocation y geographic restrictions.**
Comprobado hoy en el archivo: `fcp325` termina con «Geolocation and geographic restrictions (region-locked storage, geofencing, blocking logins from other countries) are
the controls that keep the data and the access inside the permitted territory», y el glosario `:97`, «la geolocalización y las restricciones geográficas (geofencing,
regiones bloqueadas) los mantienen dentro del territorio permitido». La pregunta 3 de la voz (geolocation = saber, restrictions = limitar) contradice la tarjeta que el
alumno repasa en la app. La propia ficha lo pone como condición del PR («Correcciones de la lección»). Hay que aplicar las dos sustituciones de la ficha (`fcp325`, última frase; glosario `:97`)
antes de publicar el bloque en la lección. Lección y vídeo ya coinciden en `:472` frente a `:500`; solo fallan estas dos piezas. Ver también la decisión sobre la duda 7.

**A-5 · OPCIONAL · `s05-02` y `why` de la pregunta 2 · «solo cuesta leerla» contradice «en un segundo».**
El escenario dice que cualquiera la devuelve a texto en un segundo; la voz resuelve «porque solo cuesta leerla» y el `why`, «Solo la hace difícil de leer». No es falso (la lección
define obfuscation como «difícil de interpretar», `:497`), pero un oyente atento nota que no cuesta nada. Más exacto y sin perder la clave:

> voz: `<confident> {ok-2}Es obfuscation, porque solo la hace ilegible a simple vista. {trap-2}Parece cifrada, pero sin clave no hay cifrado.`
> `why` (A): `Solo la hace ilegible a simple vista, sin clave ni garantía: es obfuscation` (76 caracteres, ≤ 90).

**A-6 · OPCIONAL · pregunta 2 · Base64 (duda 2): se queda, con una nota en pantalla.**
Decisión: mantener Base64. Entre las cuatro opciones solo una es defendible: no es hashing (se deshace), no es tokenization (no hay sustituto ni vault) y no es encryption (no hay clave);
y «MEJOR» cubre el matiz de que técnicamente sea una codificación. El 3.3 pone la obfuscation entre los métodos y la lección la define sin garantía criptográfica. Dos precauciones:
(1) «Base64» no aparece en la lección, así que conviene que la tarjeta de resolución o el escenario lo glosen en pantalla sin dar la respuesta («Base64 · una codificación, sin clave»);
(2) la voz ya no dice «Base64» ni lo necesita. Si Lidia prefiere no meter un término ajeno a la lección, la alternativa de la ficha («escribe cada campo al revés “para que no se lea”») conserva clave y trampa; no es necesario.

**A-7 · OPCIONAL · `s04-05` y `s08-02` · «no protege» / «solo estorba» absolutos.**
La lección dice «un obstáculo, no una barrera, y nunca sustituye al cifrado»; `fcp326`, «weak on its own». «Estorba, pero no protege» es más tajante y, en un examen con código fuente o propiedad
intelectual, la obfuscation sí puede ser la respuesta correcta. Matiz barato: `s04-05` → «Estorba, pero por sí sola no protege.» (la frase de cierre `s08-02`, «Obfuscation solo estorba», vale tal cual: «solo» ya matiza).

**A-8 · OPCIONAL · `s08-01` y `s08-04` · simplificaciones del cierre.**
(a) `s08-01`: «En uso, ya está descifrado, y lo protege el least privilege» omite masking y bloqueo de sesión (la pantalla del cierre sí dice «el mínimo privilegio y lo que enseña la pantalla»).
Con A-1 corregido no choca, pero la voz del cierre debería sonar igual que la pantalla: «En uso, ya está descifrado, y lo protegen el least privilege y lo que enseña la pantalla.» (+5 palabras; solo si hay hueco en el presupuesto, ver nota de duración).
(b) `s08-04`: «pregúntate dónde está el dato ahora mismo» sirve para la regla 1 (estado) pero en la regla 3 «dónde» es el país. El oyente puede mezclar las dos. No es un error: la lección encadena «estado → método»;
si se quiere afinar, «pregúntate en qué estado está el dato ahora mismo» (pierde el eco del título, «Dónde está el dato»). Decisión: dejarlo, es el hilo del vídeo.

**A-9 · OPCIONAL · pregunta 1 · tercera opción y analogía.**
(a) *Data sovereignty* como opción en una pregunta de **estado** se descarta por categoría, no por razonamiento (no es un estado). No rompe «una sola respuesta defendible», solo es un distractor flojo; si se quiere uno
más tentador sin crear una segunda respuesta válida, no usar «Data in motion» (sinónimo de in transit). Dejarlo.
(b) `s03-03`/pantalla: «la hucha **cerrada**» sugiere que el dato at rest está protegido; el disco del escenario no está cifrado. Más exacto: «O sea, como la hucha que llevas en el bolso: cambia de sitio, pero sigue guardada.» (+6 palabras). Si se quiere mantener «cerrada», el rótulo de pantalla debe seguir ahí; no es un error de concepto, solo un matiz.

**A-10 · OPCIONAL · canon: DNI.**
`DNI` no figura en el registro (solo sale como analogía en V6 y V12, nunca como dato del personal del puerto). Un DNI es un identificador de España; el canon no sitúa Halden en ningún país y
la mezcla de nombres (Aalto, Rekola, Haugen, Navarro, Ferrer) es deliberadamente neutra. No contradice nada, pero es canon nuevo y hay que anotarlo en el registro al cerrar el vídeo: «el personal del puerto lleva DNI», ficha «nombre · DNI · horas» y fragmento enmascarado `*****678Z` (inventado, solo en pantalla).
Si no se quiere fijar un país, «documento de identidad» en voz y «ID» en pantalla evitan la pregunta, pero cambian el léxico del guion y de la ficha; no lo recomiendo.

### Comprobaciones hechas sin hallazgo

- **Estados.** at rest = guardado (disco, base de datos, backup, USB), control «cifrar el almacenamiento · permisos» ✓ (tabla `:446-469`); in transit = cruzar una red, «cifrar la conexión» (TLS solo en pantalla) ✓; in use = descifrado en pantalla/memoria, ni el disco ni la conexión lo cubren ✓ (`:472`, nota de examen `:517`, q4). Tarjeta 1 «In use: el dato ya está descifrado» ✓.
- **Chip de s02** «secure enclaves · cifrado en memoria: entornos avanzados» ✓ (`:466`, `:472`). **Chip de s01** «datos de la plantilla · private» ✓: Private = información de personas (`:400-403`); coherente con V32 (disco de red con listas, Private).
- **Masking** (s04-01): oculta parte al mostrar, el original sigue intacto ✓ (`:495`, q1, `fcp326`). El formato `*****678Z` es coherente con un DNI de 8 cifras y letra. Tarjeta 2 ✓.
- **Tokenization** (s04-02/03): sustituto sin valor propio, correspondencia en una vault protegida, reversible para quien la tiene ✓ (`:496`). La voz nunca dice «con una clave» ✓ (duda 4).
- **Obfuscation y formato ilegible** (s04-04/05): «un formato que no se lee a simple vista tampoco es un control» ✓ (`:385`). Ojo: la lección lo dice a propósito de la clasificación («la clasificación depende del contenido, nunca del formato»); el uso en el vídeo (no es una barrera) es coherente.
- **Sovereignty y geolocation** (s06-02/04): ✓ literal con `:472` («en qué región vive ese almacenamiento, desde qué país se conecta esa cuenta»; «leyes del país donde reside físicamente»). **Geographic restrictions** ✓ con `:500` (salvo A-2). Sede en la UE ✓ (`:472`, q3). «Primero se mira, después se limita» es coherente con `:472` («base de los controles de acceso por ubicación») y con `:500`.
- **Pregunta 1** (B at rest; trampa C in transit): una sola respuesta. La lección pone USB, móvil y backup en at rest (`:450-455`) y define in transit como cruzar una red (`:456-461`); el escenario cierra la lectura de «media in transit» con «no se conecta a nada». Trampa real (el «trayecto»), `why` y `trapWhy` ciertos. Opciones sin pista gramatical; la correcta no es la más larga ni comparte palabra con el escenario.
- **Pregunta 2** (A obfuscation; trampa D encryption): una sola respuesta (ver A-6); trampa real, `trapWhy` cierto («sin clave no hay cifrado»: la encryption es reversible solo con la clave, `:493`). Hashing y Tokenization quedan descartadas por el escenario sin ambigüedad. No copia sp1m6 ni el banco (la obfuscation en el banco es solo distractor).
- **Pregunta 3** (C geolocation; trampa B geographic restrictions): una sola respuesta; el discriminador «desde dónde entra cada cuenta» deja fuera *Data sovereignty* (que es la ley) y «no bloquea nada» deja fuera las restrictions. Es la más frágil de las tres por la conflación de `fcp325` (A-4), pero con la lección corregida es limpia.
- **Letras** B·A·C (claves) y C·D·B (trampas) ✓; ninguna clave comparte letra con su trampa.
- **Cifras y nombres inventados fuera de la lección:** ninguno en voz. En pantalla, solo «Base64» (A-6) y el fragmento de DNI (A-10). No hay hora, fecha, equipo, IP, dominio, cuenta ni persona con nombre.
- **Canon, colisiones:** ninguna. Revisado frente a §2 (V48 no tiene fecha, el sello es «propuesta · sin fecha» como V45-V47), V28 (RR. HH. con otra aplicación; la de expedientes no sale), V34 (el bulo «hoy no funciona el fichaje»: V48 no dice qué sistema hay ni que falle; «nuevo» solo implica que hay uno anterior, que V34 no niega), V32 (la «jefa del servicio» es otra persona que «la jefa de turno»), V45 (V48 no dice que el puerto use la nube; «imagina»), V46 (oficina on-premises: el control de horario es otro sistema), V47 (el reloj de diez minutos de los bomberos frente al reloj de fichar, y sin «reloj» en voz salvo «Del reloj al servidor»), V37 (la ficha pide que sp3m6 no repita la carpeta abierta ni «cifrado frente a permisos»: no lo hace), V24/V43 (no dice «copia» ni «backup»).
- **Imágenes:** «la hucha» y «el trastero» no figuran entre las ocupadas; «el banco» ya aparece en V34 (dorso de la tarjeta) y V45 (sucursales), pero con otro objeto. «El bolso» está libre (V36 usa mochila, V32 maleta). Ninguna imagen usa candado, llave ni cerradura (V21, V28).
- **Tags y título de YouTube** coinciden con la ficha; no hay nada técnicamente falso en ellos.

### Decisión de las «dudas para el revisor» (`out/script-notes.md`)

| # | Duda | Decisión |
|---|---|---|
| 1 | «que es el least privilege» sobre toda la lista | **Corregir** (A-1). Tienen razón: solo la última cláusula lo es. |
| 2 | Base64 como obfuscation | **Mantener**, con la glosa en pantalla de A-6; sin Base64 en voz. Una sola respuesta defendible entre las cuatro. |
| 3 | «Como el dinero en la mano, ahí ya no hay hucha» sin decir «descifrado» | **Aceptar.** La analogía solo dice que el recipiente ya no cubre; «descifrado» lo lleva s02-03 sobre el fichaje, y s02-04 enlaza («Ni el disco ni la conexión lo cubren»). Sin riesgo de que falsee el concepto. |
| 4 | at rest: la voz solo dice «cifrando» y la pantalla añade «permisos» | **Aceptar.** La voz no dice que solo se cifre; la pantalla completa la lección (`:446-469`) y el cierre dice «guardado y en camino, se cifra», que es la regla de examen. |
| 5 | Tokenization sin «clave» | **Aceptar** y mantener. Es lo correcto según la lección (vault, no clave). Ver A-3 para la frase de s04-03. |
| 6 | Pregunta 3: «no bloquea nada» en voz y pantalla | **Aceptar.** Mismo sentido. Es el dato que cierra *Geographic restrictions*; no tocar. |
| 7 | Canon | **Confirmado: nada choca** (ver arriba). Anotar como canon nuevo, además de lo que lista la ficha, el DNI (A-10). Y recordar que la corrección de `fcp325`/glosario es condición del PR (A-4): sigue sin aplicar en el árbol. |

---

## B. NATURALIDAD

Leído como lo dirá Lidia (tempo 1,08, pausas ≤ 250 ms). En general es un guion limpio: frases cortas, conectores hablados, sin colones ni listas largas leídas, las siglas no se deletrean, «tienta» y «la trampa»
son el registro de los vídeos ya publicados (V28, V45), y las emociones varían. Los problemas son de **hilo** (qué cuenta como «puerto» y qué como pregunta) y de unas pocas frases que no se entienden sin la pantalla.

**B-1 · CORREGIR · `s03-01`, `s05-01`, `s07-01` · las tres preguntas arrancan sin avisar.**
Cada pregunta empieza directamente con el escenario («Una abogada lleva en el bolso…», «Una distribuidora va a mandar…», «Antes de poner ninguna regla, una editorial…»). En audio no hay ninguna marca de que se ha salido del puerto
(el rótulo «pregunta tipo examen · ejemplo» es solo de pantalla y Lidia no lo dice). Tras `s02-06` (la jefa de turno y la pantalla del pasillo), una abogada con un disco suena a una persona más del puerto; V28 y V45 abren con
«Te toca…» justo por eso. Corrección (+2 palabras cada una, sin tocar nada más):

> `s03-01`: `<intrigued> {q1}Te toca. Una abogada lleva en el bolso un disco externo…` (resto igual)
> `s05-01`: `<intrigued> {q2}Otra más. Una distribuidora va a mandar por correo su lista de clientes a una gestoría…`
> `s07-01`: `<curious> {q3}La última. Antes de poner ninguna regla, una editorial averigua…`

(`wordBudget` de s03, s05 y s07 es 76·86·76 y quedan 75·91·71 palabras; s05 ya estaba por encima, ver nota de duración.)

**B-2 · CORREGIR · `s04-01` y `s06-01` · al volver al caso, la voz usa referentes que solo existen en pantalla.**
- `s04-01`: «Ahora, el mismo DNI de tres maneras.» La voz **no ha dicho «DNI» nunca** (s01 dice «un dato de una persona»; el DNI va en el chip «nombre · DNI · horas»), así que «el mismo DNI» no tiene antecedente oído, y llega justo después de la abogada. Regla 3 (primero la idea, luego el nombre) y «frases que no se entienden sin verlas».
  > `<casual> {same-id}Volvemos al fichaje, y al DNI que lleva. Te lo enseño de tres maneras. {mask}En la pantalla de la jefa solo se ve una parte, mientras el sistema guarda el DNI entero, y eso es masking.`
  (+5 palabras. Dos frases cortas; el cue `same-id` queda donde estaba.)
- `s06-01`: «Imagina que el sistema se alojara en la nube.» Tras dos preguntas fuera del puerto, «el sistema» no se sabe cuál es.
  > `<engaging> {suppose}Ahora imagina que el sistema de fichajes se alojara en la nube. {storage}Es como guardar tus cajas en un trastero al otro lado de la frontera.` (+3 palabras)

**B-3 · OPCIONAL · `s02-01` · la hucha entra de forma opaca.**
«Un fichaje pasa por tres sitios, como el dinero de una hucha.» No se entiende qué tiene que ver el dinero con los tres sitios hasta s02-02 y s02-04 (la regla 6 pide que la analogía se monte desde el principio). Con el mismo número de palabras:

> `<engaging> {three}Un fichaje pasa por tres sitios, {piggybank}como tu dinero. {rest}Guardado en la hucha, es data at rest, y se protege cifrando el almacenamiento.`

**B-4 · OPCIONAL · `s01-03` · la promesa suena a lista de fragmentos.**
«Son tres preguntas. Si está guardado, en camino o en uso. Qué se ve y qué se guarda. Y en qué país vive.» Son tres fragmentos seguidos y «qué se ve y qué se guarda» no se entiende de oído (es el título del capítulo 2, no una pregunta). Con conectores hablados, +3 palabras:

> `<clear> {promise}Son tres preguntas. Primero, si el dato está guardado, en camino o en uso. Luego, qué ve cada persona y qué queda guardado. Y por último, en qué país vive.`

**B-5 · CORREGIR · `s04-04` y `s04-05` · falta el contraste que da sentido a la obfuscation, y «Se cifra igual» se oye ambiguo.**
La ficha dice que alguien propone enredar la exportación «en vez de cifrarla»; la voz omite el «en vez de cifrarla», así que el oyente no sabe a qué se opone la propuesta hasta el «Se cifra igual» final, que además puede entenderse como «se cifra de forma parecida». La frase `s04-05` apila tres ideas en 25 palabras
(«Estorba… y un formato… tampoco es un control. Se cifra igual»). Corrección (+5 palabras en total; A-7 incluido):

> `s04-04`: `<focused> {export}Para la exportación mensual, alguien propone, en vez de cifrarla, enredar columnas y campos para que no se entienda. {crossed}Eso es obfuscation.`
> `s04-05`: `<firm> Estorba, pero por sí sola no protege. Y un formato que no se lee a simple vista tampoco es un control. {chip}Se cifra de todas formas.`

(Si se prefiere no tocar `s04-05`, basta con el cambio de `s04-04` y «Se cifra de todas formas».)

**B-6 · OPCIONAL · frases sin sujeto que se pierden de oído.**
- `s02-02`: «Del reloj al servidor cruza la red, como una transferencia.» → «Cuando va del reloj al servidor, el fichaje cruza la red, como una transferencia.» (+3)
- `s03-02`: «…porque están guardados en un disco, aunque viaje.» → «…aunque el disco viaje.» (+2)

**B-7 · OPCIONAL · `s05-01` y `s05-03` · glosa de «mejor» y «la».**
«Con un “mejor” delante» es el único giro algo forzado del guion (delante de qué). La ficha exige una glosa distinta a la de V28 y V45 («Fíjate/Ojo con ese “mejor”»); esta variante lo cumple y suena más natural:
> `{best}Cuando la pregunta lleva un «mejor», alguna otra sonará bien, pero vale la que describe lo que se ha hecho.` (+3)

`s05-03`: «Como la exportación, que no se lea no la protege.» se entiende, pero «la» es ambiguo (¿la exportación o la lista?). Alternativa: «Igual que con la exportación: que no se lea no es protegerla», evitando el dos puntos: «Igual que con la exportación, que algo no se lea no lo protege.» (mismos cue y palabras).

**B-8 · OPCIONAL · `s06-04` · «la de la sede».**
«Le aplica la ley del país donde reside, no la de la sede» junta tres «la/de la» y «le aplica» retoma «el dato» de una frase atrás. Más claro, +2 palabras:
> `<serious> {law}Al dato le aplica la ley del país donde reside, no la del país de la empresa, y eso es data sovereignty.`

**B-9 · OPCIONAL · `s07-03` · «ciudad» y «cierra».**
La pregunta habla de países y la analogía, de ciudad; «no cierra ninguno» puede oírse como «no clausura» o como cerradura (el canon evita candado y cerradura). Más cercano a «restringir sería bloquear»:
> `<warm> {storage-back}O sea, saber en qué país está cada trastero no bloquea ninguno.`

**B-10 · OPCIONAL · detalles menores.**
- «Dirección» (s04-02): hablado y sin mayúscula puede sonar a «dirección» de calle; «para la Dirección» lo desambigua. (+1)
- `s08-02`: tres frases telegráficas seguidas. Es un recap y vale; si hay hueco, «Con el masking se oculta una parte. Con tokenization se sustituye, y solo la vault traduce. Y la obfuscation solo estorba.» suena más a persona. (+5; solo si cabe)
- `lexicon.json`: «DNI» → «de ene i» es correcto como ayuda, pero Lidia dirá «de-ene-í»; que la primera toma lo fije (nota 6 del encargo).

### Nota de duración

Las correcciones obligatorias (A-1 sin coste, A-2 +5, A-3 +4, B-1 +6, B-2 +8, B-5 +5) suman **unas 28 palabras**: 694 → ~722. A 2,5 palabras/s del `--estimate`, 317 s → ~328 s, o sea por debajo de 330 pero sin margen
(ya iba 29 palabras por encima del `wordBudget` total de 665). Con la lectura real de Lidia (~0,86-0,89 del estimate) quedaría en ~285-290 s, dentro de 240-330. Aun así, **volver a pasar `build-timeline --estimate`** tras aplicar los cambios;
si pasara de 330, el primer recorte inocuo es A-2 (dejar «Y para atarlo, el dato se queda en una región de la Unión Europea. Y nadie entra desde fuera de ella.», +2 en vez de +5) y, después, B-2 en `s06-01` («Ahora imagina que el sistema se alojara en la nube», +1). No añadir los OPCIONALES que suman palabras (A-8a, B-4, B-8, B-10 recap) sin recortar otro sitio.

---

## Veredicto

**Congelar tras corregir A-1, A-2, A-3, B-1, B-2 y B-5**, y pasar de nuevo el `--estimate`. **A-4** (`fcp325` y glosario de la lección) no bloquea el congelado del guion pero sí la publicación del bloque en la lección: hay que aplicarlo en el mismo PR.
El resto (A-5 a A-10, B-3, B-4, B-6 a B-10) son afinados que el guion soporta sin cambios.

**Recuento por severidad**

| | BLOQUEANTE | CORREGIR | OPCIONAL |
|---|---|---|---|
| A. Exactitud y canon | 0 | 4 (A-1, A-2, A-3, A-4) | 6 (A-5 a A-10) |
| B. Naturalidad | 0 | 3 (B-1, B-2, B-5) | 7 (B-3, B-4, B-6 a B-10) |
| **Total** | **0** | **7** | **13** |
