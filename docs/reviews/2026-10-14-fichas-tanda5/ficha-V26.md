### V26 · sp5m4 · Cápsula · «RTO, RPO, MTTR y MTBF: lo que se promete y lo que se mide»

> Propuesta del 2026-10-14 (tanda 5), con las opciones recomendadas ya elegidas; falta que Lidia diga qué cambia. La versión
> vigente de escenas y guion será `video/bia-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/bia-halden/out/script-notes.md`. Las decisiones, con lo descartado, van dentro de esta ficha (apartado «Decisiones»);
> no hay `decisiones-V26.md`.
>
> **Orden del curso.** sp5m4 es la segunda lección de riesgo de sp5, detrás de sp5m3 (ALE, V25) y antes de sp5m5 (terceros):
> quien sigue el curso ve V25 antes que V26. **V25 presenta a PAPER GOVERNOR desde cero**; V26 dice «Y vuelve PAPER GOVERNOR,
> que vive en los huecos de tu gobernanza» (reconciliación, punto 3; revisión H4), como V12 y V17 con NULL CIPHER y BLIND
> ARCHITECT, que son lecciones contiguas. La presentación completa sigue en pantalla («PAPER GOVERNOR · sección 5» y la frase del
> jefe de sección), así que el vídeo se entiende solo. Voz, registro y pronunciaciones son **canon compartido** con V25 (ver
> «Adversaria y voz»). No nombra ningún vídeo ni el caso de septiembre; el único guiño a V25 es ese «vuelve».
>
> Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`, `reg` = `docs/superpowers/canon/glass-harbor.md`,
> `v5/` = `video/ir-halden/`, `v5b/` = `video/ir-halden-pruebas/`, `v6/` = `video/iam-halden/`.

- **Carpeta:** `bia-halden` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo **5.2**
  (comentario de cabecera de la lección, `sp/sp5-part2.ts:298-299`) · adversaria **PAPER GOVERNOR** (sección sp5,
  `sp/sections.ts:120-125`), dos mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · música `Go On Going - Stayloose.mp3` · `"examTiming": "sentence-end"`;
  pregunta con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3800 · en `video.json`, `"lesson": "sp5m4"` y
  `"adversary": "PAPER GOVERNOR"`.
- **Etiquetas** (`video.json`, clave `"tags"`): RTO, RPO, MTTR, MTBF, BIA, business impact analysis, recovery time objective,
  recovery point objective, continuidad de negocio, business continuity, gestión de riesgos, Security+.
- **Título de YouTube:** «RTO, RPO, MTTR y MTBF: lo que se promete y lo que se mide | CompTIA Security+ en español» (88
  caracteres). Título del bloque de la lección y de la tarjeta final: «RTO, RPO, MTTR y MTBF: lo que se promete y lo que se
  mide» (57). Composición `BiaHalden`, póster `BiaHaldenPoster`.
- **Efectos (`sfx`):** los automáticos del motor y cuatro momentos. `sfx` es un mapa **cue → sonido**: la clave tiene que ser
  un cue de una sola escena (`sfxMapErrors`, `video/engine/scripts/lib/sfx.mjs:36-60`) y el sonido, uno de `video/engine/sfx/sfx.json`
  (glitch, typing, ding, whoosh, mail, check, error, block, alarm, ping2, lock). Comprobado con Node contra las dos cosas:
  - `both-set` → «lock» (s03: la fila del panel queda escrita, «RTO 30 min · RPO 24 h»). Es un **cue nuevo de s03**; el
    `promise` que había aquí es el de los chips de s01 y sonaría ahí.
  - `rpo-five` → «check» (s03: el RPO de 5 min aparece en el hueco de facturas).
  - `mean` → «ding» (s04: sale la media; la tarjeta de s04 suena con el `ding` automático, antes de la última frase).
  - `gap` → «block» (s04: el 80 contra el 30).
  Sin efecto nuevo. `promise` (s01) queda sin sonido propio.
- **Léxico** (lo nuevo lo confirma Lidia al grabar, porque el importador ancla cada frase a lo que ella diga): `RTO` («erre te
  o»), `RPO` («erre pe o»), `MTTR` («eme te te erre»), `MTBF` («eme te be efe») y `BIA` («bía» o «be i a»: a elegir en la
  grabación). Ya fijado en V9: `PAPER` («péiper»). Nuevo, **igual que en V25**: `GOVERNOR` («gávernor») y `ARO` («a erre
  o»; solo si se conserva la frase opcional de s05). Ninguna sigla de la lección anterior (`SLE`, `ALE`) sale en la voz.
  **El léxico no llega a la voz del adversario**: `tts-adversary.mjs` escribe `intercept.text` tal cual para SAPI. El mensaje
  de s04 lleva «RTO» sin léxico: va en la prueba de oído (ver «Adversaria y voz»).
- **Lo que se lee no se deletrea:** no hay equipos, IP, dominios, hashes ni cuentas en el vídeo. Las cifras (`30 min`, `48 h`,
  `5 min`, `24 h`, `80 min`) se dicen como cifras («media hora», «dos días», «cinco minutos», «un día», «ochenta minutos»), no
  como identificadores. Ninguna excepción.
- **Duración:** suma de `s` **210 s** (6 escenas), la misma estructura de V12, V18 y V20 (dos mensajes, una pregunta, una
  escena de consola): estimado ~255–260 s y **unos 235–250 s renderizados (~4:00)**, dentro de 190–260. La suma predice
  mal (0,89 y 1,22 veces la suya dan 187–256 s), así que el primer borrador se mide por los dos lados. Si el estimado pasa de
  255 s, se recorta en este orden: primero la frase opcional del ARO (s05), después la frase del técnico de la caja en s04; si
  se acerca a 190 s, se alarga s04 (la lectura de las cuatro averías una a una), que es la escena que más pesa. No se rellena.
  **s03 y s04 son las densas** (140 palabras en 52 s: 2,7 palabras/s sin contar los 4,5 s de la pregunta ni los 3,8 s del
  mensaje, es decir ~2,9–3,0 efectivas, igual que V24 s04 y V25 s03 y s04): cualquier recorte se decide en el borrador del
  guion, **antes de que Lidia grabe**, no después, y no se cuenta con que ella lea más deprisa.
- **Inserción:** en `sp/sp5-part2.ts`, lección sp5m4, **entre el último check (`:408-422`) y el párrafo que salta a sp5m5
  (`:423-426`)**, como bloque
  `{ t: 'video', title: 'RTO, RPO, MTTR y MTBF: lo que se promete y lo que se mide', youtube: '<id>', poster: 'videos/bia-halden-poster.png', transcript: 'videos/bia-halden-transcript.txt' }`,
  precedido de una línea: «Antes de pasar a los proveedores, míralo con el negocio: qué dos números se prometen y cómo se
  comprueba que se cumplen». **Ojo con la instrucción del encargo** («después de los checks y antes de la Nota de examen»): en
  esta lección no se puede cumplir al pie de la letra, porque la nota (`:402-407`) va *antes* del último check (`:408-422`, el
  de RTO y RPO). Poner el vídeo delante de la nota lo dejaría antes de un check que él mismo contesta (el de «qué valor manda
  sobre cada cuánto se replica»), que es justo lo que se descartó en V20. Todo lo que enseña el vídeo va antes en la lección:
  el BIA y las cuatro medidas (`:398-401`), la nota de examen (`:402-407`) y el check (`:408-422`). El vídeo **repasa y
  añade lo que la lección solo nombra**: que los dos números del BIA son independientes y que el MTTR se lee contra el RTO.
  Se fija en la suite `lesson videos` de `src/data/content.test.ts` (`:248`) con su línea `toBe('sp5m4')` junto a las de
  `:268-317`. **Numeración sin V25:** todas las citas de `sp/sp5-part2.ts` de esta ficha (`:398-426`, `:400`, `:406`, `:411`,
  q4 `:475-488`, q7 `:520-533`) son del archivo tal como está; al fusionar V25 se desplazan las once líneas de su bloque y su
  párrafo de enlace (4 + 7), y hay que sumarlas.
- **Cómo se diferencia de V24 (sp3m7) y de V25 (sp5m3):** las tres lecciones tocan RTO y RPO, y las tres son cápsulas de la
  misma tanda. El reparto, para que ninguna pise a otra:

  | | V24 · sp3m7 (DR) | V25 · sp5m3 (ALE) | **V26 · sp5m4 (BIA)** |
  |---|---|---|---|
  | Pregunta | ¿dónde se recupera y cómo se prueba? | ¿cuánto cuesta el riesgo y compensa el control? | **¿qué número se promete y cómo se lee frente a lo medido?** |
  | Usa RTO y RPO como | **no los nombra**: elige el sitio por «cuánto puede estar parado el puerto» y por lo que ya funciona allí (la lección sí los usa, `sp/sp3-part4.ts:47`, `:57`, `:99`) | no los usa | **el objeto: qué son, de dónde salen, qué manda cada uno** |
  | Unidad | sitios, copias, pruebas | euros al año (`sp/sp5-part2.ts:104-139`) | **minutos y horas, ningún euro** |
  | No sale aquí | | | hot, warm, cold (ni «caliente»: «capacidad de recuperación» es una frase, no un sitio); onsite, offsite, snapshots, replication, journaling; tabletop, fail over; la escalera de activación; EF, SLE, ARO, ALE; el coste de un control |

  «El RPO manda sobre cada cuánto se copia» está en las dos lecciones (`sp/sp5-part2.ts:400`, `sp/sp3-part4.ts:99`): en V26 es
  **una frase** y el vídeo no explica ningún mecanismo. V24 deja la frecuencia de la copia como consecuencia del RPO para V26 y
  trata el mecanismo (qué tipo de copia, dónde, cómo se prueba) sin nombrar RTO ni RPO. Otro reparto de gancho (revisión,
  H12; es lo que pide a V24): V24 abre con «¿dónde sigue todo?» y un reloj **sin pregunta**; la pregunta «¿cuánto tarda en volver?» con su
  «Enseguida.» y su «Poca cosa.» es de V26.
- **Enfoque («dos promesas y una media»):** sin fecha. «Análisis de impacto en el negocio · propuesta · ejemplo · datos
  ficticios» (el mismo sello en las dos consolas, ver canon).
  Cuando alguien pregunta cuánto tarda en volver un sistema, la respuesta de siempre es «enseguida», y a cuántos datos se
  pierden, «poca cosa»: ninguna de las dos es un número, y lo que no tiene número no se puede cumplir ni incumplir. Tú
  preguntas al negocio, no a los servidores: Facturación y Operaciones dicen cuánto aguantan parados y cuántos datos pueden
  perder en dos procesos, y de ahí salen las dos promesas. Después comparas la promesa de Operaciones con lo que dice el registro
  de averías del último año, y la media no llega. PAPER GOVERNOR trae un atajo en cada mitad: pedir cero minutos para todo y
  escribir de RTO lo que ya se tarda. Registro de diseño y propuesta, como V16 y V20: nada «funciona», nada «se cayó» en una
  fecha. Sin frase de puente.

**Conceptos (3) y su imagen:**

La imagen sale de una cafetería con su caja registradora, no del puerto: es cotidiana, no se parece a ningún lugar ni equipo de
Halden y no toma ninguna de las ocupadas (el almacén y el chaleco de V20, el foco y el candado de V21, el casco de V18, las
pinturas de V11, la cadena de V12, la valla y la garita de V16, la lancha de V17). Un reloj para el tiempo, una libreta para los
datos, el técnico de la caja para lo medido. **Vecinas, no iguales** (revisión, H30): «la tienda del barrio» de V22 (otra pista,
GCTI) y «la cocina» de V9 son también un local de barrio con caja y cocina detrás; la cafetería no toma de ninguna ni dice
«tienda» ni «cocina». Si la revisión de naturalidad la ve demasiado cerca, el cambio ya está decidido: **un taller o un puesto
sin caja registradora**, y «el técnico de la caja» pasa a «el técnico de la máquina»; los conceptos no se tocan.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | El BIA parte del negocio y saca dos promesas distintas. **RTO**: tiempo máximo tolerable desde el fallo hasta que el proceso vuelve a estar operativo; marca la capacidad de recuperación que hay que tener lista. **RPO**: la cantidad máxima de datos que se puede perder, medida en tiempo; marca cada cuánto se copia o se replica. Uno no dice nada del otro: un proceso puede esperar mucho y no perder nada, y otro, volver en media hora y perder un día (`sp/sp5-part2.ts:400`, `:406`, check `:411`; `sp/sp5-cards.ts:27`) | La cafetería: el **reloj** de la pared es cuánto puede estar la caja sin servir antes de que la clientela se vaya; la **libreta** es cuántas ventas apuntadas desde la última copia aceptas perder si la caja se estropea. Dos preguntas, dos objetos | «El BIA parte del negocio, no de los servidores» · «RPO fija cada cuánto copias; RTO, la capacidad» |
| 2 | **Lo medido se compara con lo prometido.** El MTTR (tiempo medio de reparación) no es un objetivo, es una medida observada; se lee contra el RTO, y si el MTTR real es mayor, el plan de continuidad no se cumple y hay que mejorar la recuperación, no el papel. No se escribe de RTO lo que ya se tarda (`:400`, `:406` «Dos», q4 `:475-488`). **En la voz:** el MTTR es «lo que se tarda de media en dejarlo funcionando» y el RTO, «el plazo que se promete»; no se fija desde qué instante empieza a contar el cronómetro (revisión, H26) | Seguimos en la cafetería: el **técnico de la caja** tarda lo que tarda, y eso se mide; lo que el local aguanta sin servir lo decide el local, no el técnico | «MTTR es una medida: se compara con el RTO» |
| 3 | **MTBF: cada cuánto falla.** Tiempo medio entre fallos; mide fiabilidad y ayuda a planificar el mantenimiento y la sustitución; no es un objetivo y no se confunde con el MTTR (cuánto tarda en volver) (`:400`, q7 `:520-533`). Una sola frase, opcional, lo liga con el ARO de la lección anterior | La misma caja: cada cuánto se cuelga, frente a cuánto tarda el técnico en dejarla andando | «MTBF mide fiabilidad; MTTR, lo que tardas en reparar» |

**Escenas:** seis, en tres capítulos (Qué se promete · Qué se mide · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Enseguida» | I Qué se promete | 22 | Sello «análisis de impacto en el negocio · propuesta · ejemplo · datos ficticios». Dos globos sin autor: «¿Cuánto tarda en volver?» → «Enseguida.» y «¿Y cuántos datos se pierden?» → «Poca cosa.». Los dos se apagan: no son números. Primera frase: la respuesta de siempre; hacia los 8 s (siempre antes de los 12), título «RTO y RPO» y la promesa en tres chips: «qué se promete · cómo se mide · se compara». Entra la etiqueta «PAPER GOVERNOR · sección 5» con «vive en los huecos de tu gobernanza» y la narradora dice «Y vuelve PAPER GOVERNOR, que vive en los huecos de tu gobernanza» (la etiqueta lleva la presentación completa) | «Enseguida» no es un número y lo que no tiene número no se cumple ni se incumple · `ask-time, ask-data, fade, title, promise, adversary` |
| s02-negocio «Empiezas preguntando al negocio» | I | 34 | Dos tarjetas de proceso: «Emitir facturas a las navieras · Facturación» y «Seguir llegadas y salidas de buques · Operaciones». Bajo cada una, dos huecos: «cuánto puede estar parado» y «cuántos datos puede perder». A cada tarjeta le crece una barra de «cuánto duele cada hora parado», sin cifras ni euros. Mensaje interceptado. Respuesta: «cero minutos para todo» no es un plan: cuanto más corto el plazo, más capacidad hay que tener lista, y el análisis existe para ordenar qué proceso aguanta cuánto. Nombre BIA con «parte del negocio» | El BIA identifica procesos críticos y cuánto cuesta cada hora parados; de ahí salen los plazos, no de los servidores · `bia, proc-bills, proc-board, hour, intercept, order` · **intercept** |
| s03-promesas «Dos promesas por proceso» | I | 52 | La cafetería (rotulada «imagen · no es del puerto»): la caja se cae. A un lado un reloj, al otro una libreta. «RTO · cuánto puede estar sin servir» y «RPO · cuántas ventas desde la última copia». Vuelven las dos tarjetas de proceso, con los huecos: **Seguir llegadas y salidas** se llena con «RTO 30 min · RPO 24 h» y la nota «con una copia al día le basta» (`both-set`); **Emitir facturas** muestra solo «RTO 48 h» y «no puede perder casi nada». Pregunta para pensar con dos botones. Respuesta: más a menudo: el RPO es de 5 min (aparece en el hueco, `rpo-five`), y los dos días son otra cosa, el RTO. Dos mandos: «RPO → cada cuánto copias» y «RTO → qué recuperación tienes lista» (con palabras, sin flechas) | RTO es tiempo, RPO son datos, y cada uno manda sobre algo distinto; que un proceso espere mucho no relaja la copia · `cafe, till, clock, notebook, rto, rpo, rows, board, both-set, bills, think, rpo-five, two-dials` · **think** |
| s04-medida «Lo prometido y lo que mides» | II Qué se mide | 52 | Consola «registro de averías · seguimiento de llegadas y salidas · últimos 12 meses · propuesta · ejemplo · datos ficticios» (el mismo sello de las otras escenas). Cuatro filas con su barra: «40 min», «95 min», «120 min», «65 min». Una línea marca la promesa, «RTO 30 min». La media sale como «MTTR 80 min» (`mean`): «las cuatro pasaron de 30» (`gap`). Mensaje interceptado. Respuesta: el RTO sale de lo que el negocio aguanta, el MTTR de lo que hace tu equipo; si pones el 80 donde iba el 30, el papel cuadra y Operaciones no. Una frase: el técnico de la caja tarda lo que tarda, eso se mide, no se promete. Cierre en condicional: «si estos fueran los números, el plan no se cumpliría» y lo que habría que mejorar es la recuperación | El MTTR se compara con el RTO; si es mayor, el plan no se cumple y se invierte en la recuperación, no en el papel · `log, rows, promise-line, mean, gap, intercept, correct, fix, technician` · **intercept** |
| s05-fallos «Cada cuánto se cuelga» | II | 30 | La misma consola: «4 averías en 12 meses». Se dibuja la línea de los 12 meses con cuatro marcas y sale «MTBF · unos 3 meses». Dos etiquetas lado a lado, «cuánto tarda en volver · MTTR 80 min» y «cada cuánto falla · MTBF 3 meses», con «no se cambian» en pequeño. Opcional: «alimenta el ARO de la lección anterior» como nota gris | MTBF mide fiabilidad y no es un objetivo; no se confunde con el MTTR; planifica mantenimiento y sustitución · `four, line, mtbf, side, swap, aro` |
| s06-recap «Tres reglas» | III Para el examen | 20 | Tres tarjetas de reglas, cada una con su icono (el reloj y la libreta · el técnico con su media · el papel que no cuadra); tarjeta final Alertópolis: «Tu turno: las preguntas de la lección» (sp5m4, 8 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (objetivo 5.2), una por escena de s02 a s05, cada una con su cue antes de la última frase de la
  escena (`examTiming: sentence-end`):
  - «El BIA parte del negocio, no de los servidores» (s02) (46)
  - «RPO fija cada cuánto copias; RTO, la capacidad» (s03) (46)
  - «MTTR es una medida: se compara con el RTO» (s04) (41)
  - «MTBF mide fiabilidad; MTTR, lo que tardas en reparar» (s05) (52). La que se juega en s05 no la repite el recap: allí se
    resume como regla. «RTO es tiempo, RPO son datos» no lleva tarjeta propia: es la voz de s03 y la regla 1 del cierre.
- **Pregunta para pensar** (`holdMs` 4500): «Dos días de espera: ¿basta una copia al día?» (s03) (44). Botones: «Basta una al
  día» y «Más a menudo». Llega con la fila de facturas a medias: se ve «RTO 48 h» y «no puede perder casi nada», y la
  fila de al lado acaba de decir que a Operaciones le basta una copia al día. Respuesta: más a menudo; el RPO es de 5
  minutos y manda sobre la copia, y los dos días son el RTO, que manda sobre otra cosa. La tentación es relajar la copia
  porque se puede esperar mucho. **No repite el check de la lección** (`:408-422`): allí hay dos números a la vista y se
  elige cuál manda; aquí solo se ve el que despista. Tampoco es la forma de la q5 del test de nivel (un compromiso cumplido y
  otro no, `sp/placement-sp5.ts:119-132`).
- **Mensajes interceptados** (PAPER GOVERNOR, `holdMs` ~3800; uno en el capítulo I y otro en el II, ninguno en el cierre;
  todos en forma de acta, impersonal, con «Queda en acta.»; sin tuteo, sin seguro, sin «formatear», sin puertas ni llaves):
  - s02: «Se acuerda: todo en cero minutos, sin excepciones. Queda en acta.» (65). El error que corrige la narradora: que el
    plazo más corto para todo es la respuesta segura. La lección dice que el RTO «determina la capacidad de recuperación que
    necesitas comprar» (`sp/sp5-part2.ts:400`) y que el BIA existe para saber qué procesos son críticos y cuánto cuesta cada hora
    (`:400`); que cero para todo no se sostiene es la consecuencia, sin euros.
  - s04: «Se acuerda: el RTO será lo que se tarda de media. Queda en acta.» (64). El error: confundir lo medido con lo
    prometido. El MTTR «no es un objetivo, es una medida observada» (`:400`, nota «Dos», `:406`, q4). Antes decía «lo que
    tardamos»: primera persona del plural, que no es de acta; ahora es impersonal («se tarda»), como «Se acuerda».
  - **Comprobación del registro (acta):** los dos empiezan por «Se acuerda:», acaban en «Queda en acta.», no tutean ni usan
    primera persona, y no llevan cifras, símbolos ni `{}[]|<>`. **El mensaje de s04 lleva «RTO» y SAPI lo recibe sin léxico**
    (`video/engine/scripts/tts-adversary.mjs:100-111`): no se quita la sigla, que es el término de examen que enseña el
    mensaje; entra en la prueba de oído y, solo si SAPI la deletrea mal, se prueba «R T O» o «el plazo» en el mensaje y la
    narradora nombra el RTO en su respuesta (revisión, H15).
- **Adversaria y voz (canon compartido con V25, ya decidido en la reconciliación, punto 1 a 4; lo confirma la prueba de oído).**
  V25 la presenta desde cero, un vídeo antes en el curso. Lo que sigue es lo mismo que debe decir la ficha de V25:
  - **Voz:** `"adversaryVoice": { "voice": "sapi/Microsoft Laura", "rate": -1, "fx": "megafonia" }`. Es una voz y un efecto que
    ya existen (Laura es la de RED MARROW con `telefono`, `video/logs-halden/narration.json:11-15`, y la de PAPER CRANE con
    `machine`, `video/ach-matriz/narration.json`; `megafonia` es el de BLIND ARCHITECT con Helena a `rate` −2,
    `video/zonas-halden/narration.json:11-15`). Pareja nueva, sin efecto nuevo ni trabajo de motor. Un comunicado leído por
    megafonía encaja con una gobernadora de papel, y el género sale del dosier («desenmascarada», `sp/sections.ts:125`) y de la
    voz; ningún texto lo marca. **`rate` −1** porque lee un acta, y para separarla de BLIND ARCHITECT (`rate` −2: comparte
    efecto, sala y otra voz femenina SAPI). Riesgo conocido: la revisión de la tanda 3 avisó de que «Laura no sirve para BLIND
    ARCHITECT» porque `megafonia` también es una banda recortada y sonarían parecidas
    (`docs/reviews/2026-10-05-fichas-tanda3/revision-V16-V17.md:236-240`); aquí es el mismo argumento al revés.
  - **Reserva: Pablo + `cifrado`** (la propuesta original de V25: la pareja más lejana de las cinco en voz, textura y espacio).
    Se descarta Laura + `machine` como reserva: es **PAPER CRANE** voz por voz, un duplicado (revisión, H16).
  - **Prueba de oído antes de congelar** (20 s; `revision-secplus.md`, apartado «Voz de PAPER GOVERNOR»): la misma frase sin
    cifras ni siglas («Se acuerda: el valor del servidor es la pérdida. Queda en acta.») en Laura + `megafonia` a `rate` −1, a
    0 y a −2, Pablo + `cifrado`, y como anclas BLIND ARCHITECT, RED MARROW y NULL CIPHER; después, con la frase de s04 («el RTO
    será lo que se tarda de media») para ver cómo lee SAPI la sigla (H15) y «Queda en acta.» con y sin coma. Si hay empate, se
    separa por textura, espacio y ritmo, no por uno solo (tanda 3, `revision-V16-V17.md:241-247`).
  - **Registro:** acta impersonal, sin tuteo: «Se acuerda…», «Se da por bueno…», frases cortas y siempre «Queda en acta.» al
    final (el tic, como «Lógico.», «Menos es más.» y «Confía en mí.»). Solo da consejos que hacen que el papel cuadre sin que
    cambie la realidad: lo que anuncia su jefe de sección es «políticas sin dueño, riesgos sin registro» (`sp/sections.ts:123`).
    Los dos mensajes de esta ficha ya están en ese registro (comprobado arriba); los de V25 se reescriben a él.
  - **Presentación:** V25 la presenta desde cero con la frase del jefe de sección. **V26 dice «Y vuelve PAPER GOVERNOR, que vive
    en los huecos de tu gobernanza»** (como V12 con NULL CIPHER y V17 con BLIND ARCHITECT, `video/fronteras-halden/narration.json:50`),
    y en pantalla lleva «PAPER GOVERNOR · sección 5» y «vive en los huecos de tu gobernanza», así que no depende de haber visto
    V25. Sin IP, dominio ni equipo, sin contratos, proveedores ni contratistas.
  - **Pronunciaciones, las mismas que en V25:** `GOVERNOR` «gávernor» y `ARO` «a erre o» (las confirma la audición de Lidia).
  - **Quién decide:** ya decidido (reconciliación); si la prueba de oído cambia la voz, cambia en las dos fichas a la vez. Ver
    «Preguntas para Lidia».
- **Cierre:** tres reglas y una sola tarea.
  1. Se pregunta al negocio y salen dos promesas distintas: el RTO es tiempo y manda sobre la capacidad de recuperación; el
     RPO son datos y manda sobre cada cuánto se copia. Una no dice nada de la otra.
  2. El MTTR y el MTBF se miden, no se prometen. El MTTR se compara con el RTO; el MTBF dice cada cuánto falla. No se cambian.
  3. Si lo medido no llega a lo prometido, se mejora la recuperación, no el papel.

  Tarea: las 8 preguntas de la lección sp5m4. Tres tocan lo que cuenta el vídeo: la q4 (el MTTR frente al RTO), la q7 (MTBF y
  MTTR) y la q8 (para qué sirve un BIA); las otras cinco son del registro, el apetito y las estrategias, y siguen en la lección.
- **Se queda fuera** (sigue en la lección, que quien ve el vídeo ya ha leído, porque va al final):
  - El risk register con su dueño, los KRI y el umbral (`sp/sp5-part2.ts:318-337`), el apetito y la tolerancia (`:338-342`) y las
    cuatro estrategias con su tabla (`:343-392`).
  - El reporting a la dirección (`:393-397`).
  - De qué dependen los procesos (el BIA «identifica… qué los sostiene», `:400`): el vídeo solo pregunta por el plazo y por el
    dato; las dependencias son de la lección.
  - El «transferir no te libera» y «aceptar exige dueño y fecha» de la nota (`:406`, «Tres» y «Cuatro»).
  - El coste en euros de la parada y del control (V25, `:104-139`) y los sitios, las copias y las pruebas (V24,
    `sp/sp3-part4.ts:47-116`).
  - El MTTF, que solo está en la tarjeta de repaso (`sp/sp5-cards.ts:28`): no sale en el vídeo.
- **Laboratorios y preguntas que ya ejercitan el tema (penalización L):** ningún lab de sp5 toca RTO, RPO, MTTR ni MTBF:
  spl5a clasifica documentos de gobernanza (`sp/labs-sp5.ts:9-24`), spl5b elige acuerdos (`:25-35`) y spl5c, `select`, hace la
  aritmética de SLE y ALE (`:36-45`, datos `:204-`): es el terreno de V25 y el vídeo no la pisa. El lab vecino es **spl3c**
  (`sp/labs-sp3.ts:36-45`, datos `:202-`), un `order` de 8 pasos de activación del plan de recuperación que menciona el RPO y
  el RTO de pasada en dos pasos (`:229`, `:244`): V26 **no ordena pasos** y no repite la escalera. L = 0. Preguntas de la
  lección con las que el vídeo no coincide en datos: el check `:411` (4 h y 15 min, el sistema de asignación de atraques), la q4
  (2 h frente a 5 h, `:478`), la q7 (nueve meses y seis horas, `:523`) y la q5 del test de nivel (`sp/placement-sp5.ts:122-131`,
  2 h y 15 min). Ninguna cifra del vídeo es una de ellas: 30 min, 48 h, 5 min, 24 h, 40, 95, 120 y 65 min.

**Canon nuevo que fija V26** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **Un análisis de impacto en el negocio, sin fecha, como propuesta.** Rotulado «análisis de impacto en el negocio · propuesta ·
  ejemplo · datos ficticios» (el mismo sello en las dos consolas: la del BIA, en s02 y s03, y la del registro de averías, en s04
  y s05, que dibuja la línea de la promesa y por eso lleva también «propuesta»). Dos procesos, sin nombre de equipo: **«Emitir
  facturas a las navieras»** (Facturación; RTO 48 h, RPO 5 min; «no puede perder casi nada») y **«Seguir llegadas y salidas de
  buques»** (Operaciones; RTO 30 min, RPO 24 h; «con una copia al día le basta»). Los pone el negocio, no los servidores. Es una
  propuesta: nada «se cumple» ni está en vigor, y lo que concluye s04 es condicional («si estos fueran los números, el plan no se
  cumpliría»), porque la promesa es una propuesta y el registro de averías, un ejemplo: son dos cosas distintas.
- **Un registro de averías de «los últimos 12 meses»** (relativo, sin fecha) del sistema que sostiene el seguimiento de llegadas y
  salidas, rotulado «ejemplo · datos ficticios»: cuatro averías de 40, 95, 120 y 65 minutos (MTTR 80 min, las cuatro pasan de los 30
  del RTO) y una media de una avería cada tres meses (MTBF unos 3 meses). Sin fechas, sin causa, sin equipo y sin responsable:
  nadie tiene la culpa. **Si algún día se fecha el vídeo** (el 17-12, por ejemplo), el registro no cuenta «el último año» sino
  «las cuatro últimas»: un año hacia atrás cubriría el 3 y el 4-9, y una avería de 95 o de 120 minutos podría leerse como la
  recuperación de septiembre, que el registro deja sin dato (`reg:840`; revisión, H24).
- **PAPER GOVERNOR**: segunda aparición en el curso (V25 la presenta; V26 dice «Y vuelve…»). Voz Laura+`megafonia` `rate` −1,
  registro de acta con «Queda en acta.», pronunciaciones «gávernor» y «a erre o». **Compartido con V25**, que se ve antes en el
  curso.
- **Comprobado con Node** (`check-v26-fix.mjs`, en el scratchpad): MTTR = (40 + 95 + 120 + 65) / 4 = 80 min = 2,67 veces el RTO; con
  365 días, 8 760 h menos 5,33 h de parada, entre 4 averías, el MTBF es de 2 188,7 h = 91,2 días = 3,0 meses; 48 h = 2 días; la
  suma de `s` y los demás límites, abajo.

**No se toca:**
- **Septiembre y el caso `IR-2026-0147`.** Ni `srv-tc-app03` ni sus copias de las 23:00 (`v5/src/data/s07-recovery.ts:23-25`),
  ni la restauración de la del 2-9 (`reg:76`). **Ningún vídeo dice cuánto tardó la recuperación ni qué datos faltaron**
  (`reg:840`, «Fechas de erradicación y recuperación: ninguna»), y el registro pide no decir qué contenía
  la copia del 3-9 (`reg:817-819`). El vídeo no dice que septiembre cumpliera o incumpliera un RTO o un RPO, ni «como pasó», ni «habría
  evitado». El RPO de 24 h del panel no es el de ninguna copia del puerto.
- **V5b:** ni «11 min» del simulacro como si fuera un MTTR (`v5b/src/data/s03-simulacro.ts:37-44`, `reg:420`), ni el
  cronómetro que sale allí: V26 habla de «reloj» y «libreta». Ni la mesa ni el simulacro.
- **V25 y sus euros:** nada de R-014, 400.000 €, 50.000 €, 20.000 €, 90.000 € ni de «alta disponibilidad» como compra
  (`sp/sp5-part2.ts:104-139`): V26 no pone ninguna cifra en euros ni dice «cuánto cuesta» más que «cuánto duele cada hora». La
  lección anterior solo se cita para el ARO, y sin cifras.
- **V24:** ningún hot, warm ni cold; ninguna copia onsite u offsite, snapshot, replicación ni journaling; ninguna prueba
  (tabletop, simulación, parallel processing, fail over); nada de la escalera de spl3c. «La capacidad de recuperación» es una
  frase, no un sitio.
- **El sistema de asignación de atraques** de la lección (`:355`, `:411`) y su 4 h y 15 min: el vídeo no lo usa, para no
  contradecir al check que va justo antes. «Seguir llegadas y salidas de buques» **no es** el sistema de asignación, ni el
  portal de reservas de atraque (`hpa-portal-web-01`, V10, V11, V12, V16), ni la app «Planificador de atraques» de un proveedor
  externo (V6), ni el correo «Turnos de atraque» (V1), ni la API pública de posiciones de buques (`:373`, q2).
- **Facturación** ya existe como área en V6 («Facturación · 2023», `v6/src/data/s02-creep.ts:15`): V26 la reutiliza, no la
  inventa. No es el permiso «facturas a navieras · emitir» (`:29`, `:39`, `reg:92`): ni sale `c.navarro` ni «permission creep». Es el
  área que emite las facturas, sin personas. El proceso «Emitir facturas a las navieras» se parece al rótulo de la puerta de V6
  («facturas a navieras · emitir», `s02-creep.ts:30`): es un eco, no una contradicción, y la narradora **no dice «aquella
  puerta»** ni remite a V6 (revisión, H29).
- **Operaciones** va sin «sala de control»: es un lugar con historia (V1, muelle 3, Lucía, `OPS-WS-14`; V16). No sale ninguna
  estación ni ninguna persona, y el panel de llegadas y salidas no está en el muelle 3 ni en ninguna sala.
- **Las puertas de acceso:** `srv-accesos01`, `srv-bascula01` y los controladores de acceso de la q7 (`:523`, `reg:189`); la
  voz no dice «controlador», «báscula» ni «acceso».
- **El seguro y transferir** (V18, `reg:614`; `:346`): ni en los mensajes ni en la respuesta.
- **El dosier de PAPER GOVERNOR** (`sp/sections.ts:125`): GLASS HARBOR, el contratista con acceso perpetuo, sin due diligence;
  nada de proveedores, contratos, SLA ni terceros (es sp5m5). Tampoco «GH es una sola operación» ni la firma «GH» (`reg:346`).
- **Culpas:** ni a Sistemas por el MTTR ni a nadie por el «enseguida». La respuesta de siempre es de siempre, sin autor.
- **«Temporada alta»** (`:341`) es un ejemplo de tolerancia de la lección: el vídeo no dice temporada ni estacionalidad.
- **Fecha.** Sin fecha (decidido; ver «Preguntas para Lidia»). Si Lidia prefiere un ancla, el **jueves 17-12** está libre en el
  registro: entre el 16-12 de V21 y el 22-12 (Node: 16-12 miércoles, 17-12 jueves, 22-12 martes). Cuesta un hecho más que
  coordinar con V24 y V25, que también pueden querer fecha, y obliga a cambiar el registro de averías de «el último año» a
  «las cuatro últimas» (ver canon; revisión, H24).

**Decisiones** (con la alternativa descartada y el motivo):
1. **Procesos nuevos y sin fecha, ni septiembre ni el sistema de asignación de atraques.** Descartado:
   - **Medir el RPO y el MTTR con la restauración de `srv-tc-app03` de V5** (copias de las 23:00, restaurada la del 2-9,
     «hash coincide», «manifiestos OK», `v5/src/data/s07-recovery.ts:23-25`, `:50-57`). Es la salida natural y la peor: el
     registro deja a propósito sin respuesta cuánto tardó y qué faltaba (`reg:840`), y poner un número convertiría un hueco
     en un hecho (el puerto «perdió» un día de datos, o «tardó» tantas horas) que V5 no cuenta.
   - **El sistema de asignación de atraques con los 4 h y 15 min de la lección.** Repetiría el check que va justo antes y,
     con otras cifras, lo contradiría.
2. **Dos procesos que separan el RTO del RPO, más una brecha medida.** Facturas espera mucho y no pierde casi nada; el
   panel vuelve pronto y puede perder un día; y al panel se le compara la media con su plazo. Descartado: **un solo proceso con
   los dos números** (más simple y más fiel al check), porque no deja ver que los dos números son independientes, que es lo que
   cae («RTO = tiempo, RPO = datos», `:406`) y lo que la pregunta para pensar necesita.
3. **PAPER GOVERNOR con Laura+`megafonia` a `rate` −1, el tic «Queda en acta.» y dos errores del propio tema.** «Todo en cero
   minutos» y «el RTO será lo que se tarda de media» son errores de la lección (la capacidad que se compra y la medida que no es
   objetivo). Descartado: **reutilizar Pablo+`machine`** (suena a SILENT PAGER y V18 ya tiene a SILENT PAGER aconsejando
   un seguro), **Helena+`machine`** (la reserva de V11 y V16, que ya se descartó por sonar igual que SILENT PAGER, `docs/reviews/2026-10-05-fichas-tanda3/revision-V16-V17.md:248-253`),
   **Laura+`machine`** (es PAPER CRANE) y mensajes sobre transferir o aceptar, que son de 5.2 pero de otra mitad de la lección y
   chocarían con el seguro de V18. Reserva: **Pablo+`cifrado`**.
4. **Una cafetería y su caja, no una oficina de registros ni un ascensor.** Descartado: **«la oficina de registros»** (el
   check de V25 usa «the port records office», `sp/sp5-part2.ts:146`), **un ascensor** (los números de la q7 son los de un
   ascensor en práctica: «cada nueve meses, seis horas») y **la ventanilla, la garita y la valla** (ocupadas). Vecinas que
   se vigilan: la tienda de V22 y la cocina de V9; plan B, un taller o un puesto sin caja (ver «Conceptos»).
5. **Inserción tras el último check, no antes de la nota** (ver «Inserción»). Descartado: delante de la nota o del
   check, que lo contestarían.
6. **«Y vuelve PAPER GOVERNOR» y no «aquí aparece».** V25 va justo antes en el curso (reconciliación, punto 3; H4). Descartado:
   repetir la presentación de V25 palabra por palabra en dos lecciones seguidas. La etiqueta en pantalla la lleva entera.

**Preguntas para Lidia** (**decide Lidia**; la opción recomendada ya está aplicada arriba):
1. **Voz de PAPER GOVERNOR: decide Lidia tras la prueba de oído.** Recomendada: Laura + `megafonia`, `rate` −1 (igual en V25 y
   V26). Alternativa ya preparada: Pablo + `cifrado`. Si cambia, cambia en las dos fichas a la vez.
2. **Presentación: decide Lidia si V26 puede depender de V25.** Recomendada: «Y vuelve PAPER GOVERNOR…», con la etiqueta
   completa en pantalla. Si prefiere que V26 no dependa de V25, hay que presentarla otra vez con otra frase del jefe de sección
   y decirlo en las dos fichas.
3. **Fecha: decide Lidia.** Recomendada: sin fecha. Con el 17-12, el registro cuenta «las cuatro últimas» y no «el último año».
4. **Cómo se dice `BIA`: decide Lidia al grabar.** «Bía» o «be i a»; recomendada, «bía» si el reconocimiento de su grabación lo
   acepta sin cortes (V26 es el único vídeo que la usa).
5. **Frase opcional del ARO (s05): decide Lidia.** Recomendada: conservarla solo si el borrador queda por debajo de 255 s; si
   se conserva, «a erre o».
6. **Pregunta para pensar: decide Lidia si la cambia por la del MTTR frente al RTO** (revisión, H27, no aplicada; ver abajo).
   Recomendada: mantener «Dos días de espera: ¿basta una copia al día?».
7. **«RTO» dentro del mensaje de s04: decide Lidia con la audición.** Recomendada: dejar la sigla; si SAPI la deletrea mal,
   probar «R T O» y, si tampoco, «el plazo» en el mensaje y el RTO en la respuesta.

**A verificar con el material oficial** (no van en tarjetas ni se dicen como afirmación; el vídeo no depende de ellos):
- Si el MTTR de CompTIA se cuenta desde el fallo o desde que se detecta, y si incluye el diagnóstico y la espera de la pieza. La
  lección dice «reparar y devolver el servicio» (`:400`) y la tarjeta de repaso, «una vez ocurrido el fallo»
  (`sp/sp5-cards.ts:28`). **La voz no fija desde cuándo cuenta** (revisión, H26): «lo que se tarda de media en dejarlo
  funcionando» (MTTR) y «el plazo que se promete» (RTO); el argumento descansa en que **las cuatro** averías pasan de 30.
- Que una **media** se compara con un **máximo tolerable**: es lo que hace la lección (`:400`, q4) y el vídeo; si la media
  fuera 25 y una avería llegara a 45, el plan tampoco cumpliría. La lección no lo dice, así que el vídeo se apoya en que **las
  cuatro** pasan de 30 y no en la media sola.
- La fórmula exacta del MTBF (tiempo operativo entre averías, no tiempo total) y su relación con el MTTF: la lección dice
  «cuánto aguanta de media un sistema entre fallos» (`:400`). El vídeo dice «una avería cada tres meses», que sale igual con
  las dos cuentas (12 / 4 = 3,0; 91,2 días).
- Que un RTO más corto cuesta más: es la consecuencia de «determina la capacidad de recuperación que necesitas comprar»
  (`:400`), no una frase de la lección. La voz lo dice sin cifras.

**Riesgos:**
- **PAPER GOVERNOR: igual que V25, y no suena a nadie más.** Voz, tic, presentación, género y pronunciaciones están fijados en
  la reconciliación; el riesgo que queda es que las dos fichas se escriban a la vez con un mensaje en otro registro: los
  cuatro mensajes (dos de V25, dos de V26) tienen que ser actas impersonales con «Queda en acta.».
- **Laura + `megafonia` se parece a dos vecinos.** Laura es la de RED MARROW (`telefono`) y PAPER CRANE (`machine`), y
  `megafonia` es el efecto de BLIND ARCHITECT (Helena, `rate` −2). El `rate` −1 y la prueba de oído son lo que la separan; si
  suena igual, la reserva es Pablo + `cifrado`, no Laura + `machine`.
- **«RTO» en el mensaje de s04 sin léxico.** SAPI recibe el texto tal cual: puede deletrearlo o leerlo como palabra. Va en la
  prueba de oído (ver «Adversaria y voz»).
- **Solape con V24 en «el RPO manda sobre la copia».** Una frase en V26 y ningún mecanismo. V24 no nombra RTO ni RPO y trata el
  mecanismo de la copia (dónde, cómo se prueba); no habla de frecuencia de copia («backups cada noche» no es de V24). La pregunta
  para pensar dice «copia al día» y la de V24 es «parallel o fail over»: no se pisan.
- **Un MTTR de 80 contra un RTO de 30 no es una avería real del puerto.** El rótulo «propuesta · ejemplo · datos ficticios» y la
  falta de fecha lo evitan; ninguna frase dice «se cayó el…», y s04 concluye en condicional.
- **«Cero minutos para todo no se sostiene» sin euros.** Cuesta no decir «caro»: «hay que tener lista más capacidad» es la
  forma. Quien revise la exactitud debe comprobar que no suena a una cifra.
- **El RTO no es lo que «se tarda»:** la respuesta al mensaje de s04 tiene que decir también que, si lo medido no llega, se mejora
  la recuperación, no que se relaje el plazo; la lección solo da esa salida (`:400`).
- **Dos objetos y una analogía.** La cafetería y el panel conviven en s03 y s04; la narradora los separa («en la cafetería…»,
  «en el puerto…») y la cafetería sale rotulada «imagen · no es del puerto».
- **s03 y s04 muy densas** (140 palabras cada una). Se recorta en el borrador, antes de grabar (ver «Duración»).

**Comprobación de límites** (perfil `capsula-yt`; recuento con Node, `[...texto].length`, con `FORBIDDEN_SYMBOLS` y
`/[{}[\]|<>]/` de `video/engine/scripts/lib/narration.mjs:23`, `:288`, `:323`; script `check-v26-fix.mjs` en el scratchpad de
la sesión, con las cadenas copiadas de esta ficha, comprobadas luego una a una contra el texto del fichero y los cues y sonidos
contra `video/engine/sfx/sfx.json`; **repetido tras la revisión de 2026-10-14, todo en verde**):
- Duración: suma 210 s; render esperado 235–250 s, dentro de 190–260. Los extremos conocidos (0,89 y 1,22 veces la suma) dan
  187–256 s: el alto cabe; el bajo queda 3 s por debajo del mínimo, pero V10 y V12, con la misma estructura, estimaron
  por encima de su suma (273 s con 220 y unos 260 con 210, según la ficha de V20). Si el primer borrador se acerca a 190, se alarga s04.
- 6 escenas en 3 capítulos (máximo 3). 3 conceptos (2–3).
- 4 tarjetas de examen (3–5), una por escena de s02 a s05, ninguna en la última ni en s01; de 41 a 52 caracteres (máximo 58),
  sin `{}[]|<>`, flechas, marcas, viñetas ni emoji. Sin cambios con la revisión: 46, 46, 41 y 52.
- 1 pregunta para pensar (exactamente 1), 44 caracteres (máximo 48), `holdMs` 4500 (≥ 4000); botones de 16 y 12 caracteres.
- 2 mensajes interceptados (1–2), uno por capítulo (I y II), ninguno en la escena final; **65 y 64 caracteres** (máximo 70; el de
  s04 cambió «tardamos» por «se tarda» y sigue en 64); `holdMs` ~3800 (2500–4500); `video.json` lleva `"adversary": "PAPER
  GOVERNOR"`. Los dos con la forma «Se acuerda: … Queda en acta.».
- **Efectos:** cuatro claves de `sfx`, cada una cue de **una sola escena** y con un sonido que existe en `sfx.json`:
  `both-set` (s03) → lock, `rpo-five` (s03) → check, `mean` (s04) → ding, `gap` (s04) → block. Los nombres anteriores
  `promise` (cue de s01), `average` y `pass` (no existían) quedan fuera del mapa. Cues por escena sin repetirse dentro de
  la escena: s01 6, s02 6, s03 13 (con `both-set`), s04 9, s05 6, s06 6.
- `wordBudget` por escena (`s` × 2,7): s01 59 · s02 92 · s03 140 · s04 140 · s05 81 · s06 54 (total 566; 210 × 2,7 = 567).
- Sin identificadores en la voz: ningún equipo, IP, dominio, cuenta ni nombre de fichero. Siglas en voz que necesitan léxico:
  RTO, RPO, MTTR, MTBF, BIA y GOVERNOR (ARO, solo si se conserva la frase opcional). En el mensaje de s04, «RTO» llega a SAPI
  sin léxico.
- El título entra antes de los 12 s (s01: una frase corta y el título). Título de YouTube: 88 caracteres (YouTube admite 100);
  título del bloque, 57. Título de s03 nuevo: «Dos promesas por proceso» (24).
- Aritmética: MTTR 80 min = 2,67 × 30; las cuatro averías pasan de 30; MTBF 2 188,7 h = 91,2 días = 3,0 meses; 48 h = 2 días.

**Cambios de la revisión** (`revision-secplus.md` y `reconciliacion.md`, 2026-10-14):
- **H2 (PAPER GOVERNOR sin fijar):** voz Laura + `megafonia` `rate` −1, reserva Pablo + `cifrado`, registro de acta en los dos
  mensajes (comprobado; «tardamos» pasa a «se tarda»), pronunciaciones «gávernor» y «a erre o», quién fija: ya decidido.
- **H4 («primera aparición» y «sin otra vez»):** V25 presenta desde cero; V26 dice «Y vuelve PAPER GOVERNOR, que vive en los
  huecos de tu gobernanza»; cabecera, escena s01, canon y decisión 6 coherentes.
- **H3 (efectos que no son cue):** `promise` → `both-set` (cue nuevo de s03), `average` → `mean`, `pass` → `rpo-five`; `gap`
  se queda. Verificado contra `sfx.json` y los cues por escena.
- **H12 (mismo gancho que V24):** V26 se queda con «Enseguida.» y «Poca cosa.»; V24 deja el reloj sin pregunta.
- **H13 (el cuadro de reparto describía mal a V24):** V24 no nombra RTO ni RPO; sin «caliente»; sin «backups cada noche».
- **H14:** la escena s03 pasa de «Cuánto esperas y cuánto pierdes» a «Dos promesas por proceso».
- **H15:** «RTO» en el mensaje de s04 se conserva; entra en la prueba de oído, con variantes de reserva.
- **H16 (reserva = PAPER CRANE):** sustituida por Pablo + `cifrado`; Laura + `machine` descartada en las decisiones.
- **H24 (fecharlo mete septiembre):** se mantiene sin fecha y el canon lo escribe: «las cuatro últimas» si se fecha.
- **H25 («propuesta» y «ejemplo»):** mismo sello en las dos consolas y cierre de s04 en condicional.
- **H26 (el cronómetro del MTTR):** la voz dice «lo que se tarda de media en dejarlo funcionando» y «el plazo que se
  promete», sin fijar desde cuándo cuenta.
- **H28 (s03 y s04 densas):** nota de recorte antes de grabar y ritmo efectivo de 2,9–3,0 palabras/s.
- **H29:** la narradora no dice «aquella puerta»; el eco con V6 queda anotado.
- **H30 (la cafetería):** vecinas anotadas (V22, V9) y plan B, un taller o puesto sin caja.
- **H31 (numeración):** «numeración sin V25; sumar las once líneas de su bloque» en la inserción.
- Arreglo menor: la frase rota de «Comprobación de límites» («script en el scratchpad de la sesión, que cadenas…»).

**Hallazgos no aplicados:**
- **H27 (la pregunta repite el check):** no se aplica el cambio propuesto («Si cada avería tarda 80 min y el RTO es de 30, ¿qué
  cambias: el RTO o la recuperación?»). Verificado en la lección: esa pregunta es la q4 casi palabra por palabra (`:475-488`,
  «RTO de dos horas frente a una media de cinco») y la misma que contesta la narradora en s04 después del mensaje; sería
  contestar de antemano una pregunta del test de la lección (el criterio de V20) y repetir dentro del mismo vídeo la
  respuesta de s04. Lo que el hallazgo señala (que quien acaba de resolver el check oiga una regla parecida) se mitiga con lo
  que ya hace la pregunta actual: aquí no hay dos números que elegir sino uno que despista (los dos días del RTO frente a la
  copia), y ni el check, ni la q4, ni la q5 del test de nivel (`sp/placement-sp5.ts:119-132`) tienen esa forma. Queda como
  pregunta marcada «decide Lidia» (punto 6).
- **H12, parte de V24** (que V24 deje el reloj sin pregunta) y **H13, parte de V24** (quitar el «puede enlazar» de F24): son
  cambios en `ficha-V24.md`, que no se toca desde aquí; esta ficha ya los da por hechos en el cuadro de reparto.
