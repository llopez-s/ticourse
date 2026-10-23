# Revisión de V40 `documentos-halden` (sp5m1, `caso-yt`) · 23-10-2026

Revisor de solo lectura, dos pasadas independientes (A exactitud y canon, B naturalidad). No se ha editado nada salvo este informe.

**Fuentes leídas:** ficha `docs/superpowers/plans/fichas-tanda8/V40-sp5m1.md` (entera); `video/documentos-halden/` (`narration.json`, `storyboard.json`, `video.json`, `lexicon.json`, `out/script-notes.md`, `out/canon-refs.md`); lección `src/data/secplus/sp5-part1.ts:1-243` (sp5m1 entera, con sus 3 checks y 7 preguntas), `sp5-cards.ts` (fcp501-504 y glosario), `labs-sp5.ts` (spl5a), `placement-sp5.ts` (pl-sp5q1/q2); plan `2026-09-25-lesson-videos.md` §1 («Narración hablada», «Claridad y ritmo»); `fichas-tanda8/_revision.md` (A-2, A-7, B-4, B-5, G-4, G-5). **El registro `docs/superpowers/canon/glass-harbor.md` lo he leído entero (líneas 1-3024)**: cabecera, §1 (tabla de vídeos), §2 (cronología), §3 (personas, equipos, cuentas, dominios, casos), §4 (adversarios), §5 (contradicciones, notas de V5b a V47, huecos, «solo en planes») y §6 (nombres libres e imágenes ocupadas).

Comprobaciones mecánicas (script sobre `narration.json`): 705 palabras con `[1.3|uno punto tres]` leído como tres (703 por espacios, como dicen las notas); por escena 48/120/78/109/97/103/85/65; tarjetas de examen 43/35/43/35/39 caracteres (≤58); escenarios 129/145/138 (≤160), preguntas 26/35/57 (≤110), opciones ≤42 (≤70), `why` ≤67 y `trapWhy` ≤77 (≤90); claves C/A/D y trampas D/C/B coinciden con `answer`/`trap`; ninguna emoción repetida en dos segmentos seguidos; ninguna frase de más de 22 palabras salvo s03-01 (23, con «uno punto tres» contado entero); ningún `;`, ningún identificador deletreado, ningún «Gana…». Todo cuadra con la ficha y las notas.

---

## A. EXACTITUD Y CANON

### Confirmación pedida: lectura entera del canon y ausencia de choque

Sin choque con ningún hecho fechado, equipo, cuenta, persona o imagen del registro. Lo que he contrastado línea a línea:

- **Fechas y horas.** V40 no tiene ninguna. «Enero» y «marzo» solo salen en la pregunta 3, que es de «una empresa». No toca la cronología (§2) ni ninguna fila de §1 salvo para añadir la suya.
- **Áreas.** La dirección (V28, mesa de V5b), Seguridad (V5b, V20, V45, V47) y Sistemas (V5, V18, V28, V30, V32, V45, V46) son las del registro, sin personas con nombre ni género. Seguridad escribe un standard y Sistemas un procedure, igual que la tabla de la lección y que el uso previo de cada área.
- **Plataforma de intercambio.** Sin nombre ni producto; no es el portal de reservas (V10, V11, V12, V16; contradicción 19), ni la plataforma aduanera del socio (V6), ni la plataforma de orquestación (V31), ni una carpeta compartida (V37). Roce menor y no choque: V11 entrega una oferta confidencial a una naviera por el portal; V40 dice que «lo confidencial sale por la plataforma aprobada». Como V40 es «propuesta · sin fecha» y la policy habla de «canales aprobados», el portal puede ser uno de ellos. No hace falta tocar nada.
- **Cifrado.** «AES-256» solo en pantalla y «TLS 1.3» en la pregunta 1: coinciden con lo que V11 ya enseña del portal (`TLS_AES_256_GCM_SHA384`, TLSv1.3) sin contradecirlo.
- **Documentos y correo.** El procedure es «mandar un fichero a una naviera», sin correos ni adjuntos; el único «correo» es el chip de monitoring de s06 (documentos que salen por correo en vez de por la plataforma, es saliente), que no roza el correo entrante con macro del 3-9.
- **Dosier de PAPER GOVERNOR** («políticas sin dueño», `sections.ts:123`) y de GLASS HARBOR (contratista con acceso perpetuo): no se destripan. V40 no nombra a PAPER GOVERNOR (V25 sigue siendo su primera aparición en el orden del curso), no habla de contratistas y los «proveedores» solo están en un chip del caso (ver A-14). Ver A-8 sobre «tienen un dueño».
- **Imágenes ocupadas (§6).** Piscina, carteles, gorro, socorrista, silbato, crema y piscina pequeña están libres (ninguna fila de §6 ni de las notas de V5b-V47). Las «hojas» no chocan con la hoja «baseline» de V30, el mapa de V36 ni la plantilla de V45 (otro objeto en cada caso). Único roce de imagen: «cuatro hojas boca abajo que se dan la vuelta» imita el gesto de las «seis tarjetas de actor boca abajo que se vuelven» de V35 (§6, «Ocupada»); ver A-13.
- **Preguntas.** «Un equipo de desarrollo», «el centro de operaciones de un hospital» y «una empresa» no están en §3 «Casos»; no repiten ningún escenario de V28-V47. Solo la 1 se puede leer como del puerto (ver A-2).
- **Rótulo de pregunta (contradicción 17).** Ver A-2 y A-14.

### Hallazgos

**A-1 · BLOQUEANTE · s03-02 y tarjeta de s03-03 (y `trapWhy` de la pregunta 1).**
- Dice (voz): «Pero un standard lo es porque obliga, no porque sea concreto.» Tarjeta: «Decide si obliga, no si es concreto». `trapWhy`: «Nombra una versión, pero lo que hace a un standard es que obliga».
- Problema: enseña una regla falsa. Obligar es condición necesaria, no suficiente: también obliga la policy (el propio vídeo lo dice en s02-07, s08-01 y en la frase de cierre «Primero, ¿obliga?»). Lo que separa al standard de la policy es justo lo concreto: lección `sp5-part1.ts:27` («requisito concreto y obligatorio»), glosario (`sp5-cards.ts:58`), fcp501 y `pl-sp5q1` (placement, «both mandatory and specific»). Quien se quede con «lo que hace standard es obligar» contestará «Standard» ante un documento obligatorio y sin tecnología, que es una policy. Es una tarjeta de examen que lleva un reflejo equivocado, y se grabaría tal cual.
- Corrección:
  - Voz s03-02: `<firm> {ok-1}Es una guideline. Recomienda y no obliga. {trap-1}Standard tienta, porque nombra una versión. Pero un standard, además de concreto, obliga. Y este no.` (23 palabras, frases de 7 como mucho).
  - Tarjeta: «Concreto no basta: un standard también obliga» (45 car.).
  - `trapWhy`: «Es concreto, pero un standard también tiene que obligar» (55 car.).
  - `why` y la tarjeta de s02 no cambian.

**A-2 · CORREGIR · s03-01, panel de la pregunta 1 y rótulo de las tres preguntas.**
- Dice (voz): «Un equipo de desarrollo tiene un documento…». Panel: «Una guía **del** equipo de desarrollo dice…». La ficha decía «El equipo de desarrollo **de una empresa**».
- Problema: al caer «de una empresa», «el equipo de desarrollo» se lee como Desarrollo, el área de V19, V29 y V32, y fija un hecho del puerto (que Desarrollo recomienda TLS 1.3) sin que lo diga el registro. Es la mitad de la contradicción 17 que V35, V37, V38, V45, V46 y V47 cierran con «no es del puerto». Las preguntas 2 y 3 sí van fuera («un hospital», «una empresa»).
- Corrección:
  - Voz s03-01: `<intrigued> {q1}Te toca. El equipo de desarrollo de una empresa tiene un documento, y dice «Os recomendamos usar TLS [1.3|uno punto tres] en las aplicaciones nuevas». Nadie lo ha hecho obligatorio. ¿Qué tipo de documento es?`
  - Panel `scenario` (148 car.): «Un documento del equipo de desarrollo de una empresa dice: «Os recomendamos usar TLS 1.3 en las aplicaciones nuevas». Nadie lo ha hecho obligatorio.»
  - Storyboard (s03, s05, s07): rótulo «pregunta tipo examen · ejemplo · **no es del puerto**», como V35-V47 (V33, que no nombra el puerto en ninguna pregunta, es la única excepción; aquí la ficha ya dice que ninguna pasa en el puerto, así que no cuesta nada y evita dudas).

**A-3 · CORREGIR · título de s03 y panel de la pregunta 1 (decisión de la duda 4).**
- Dice: título «Una guía de desarrollo»; panel «Una guía…»; voz «un documento de buenas prácticas».
- Problema: «guía» es casi la traducción de «guideline» y «buenas prácticas» es su definición. Con «Os recomendamos» y «Nadie lo ha hecho obligatorio» (las dos pistas que sí deben decidir, porque son la definición de la lección) la pregunta ya tiene tres pistas de más; la trampa del standard pierde fuerza y la regla «la definición decide» no se entrena.
- Decisión: título neutro. Storyboard s03 `title`: «Un documento de desarrollo». Panel: «documento» (ver A-2). Voz: sin «de buenas prácticas» (ver A-2). Se mantienen «recomendamos» y «nadie lo ha hecho obligatorio».

**A-4 · CORREGIR · condición de la ficha (duda 1 y 6): lección y flashcard.**
- Verificado en el repo: `sp5-part1.ts:41` sigue diciendo «the moment a document names a version, a length or an algorithm it has… become the standard» y `fcp501` (`sp5-cards.ts:6`) «an exact number or setting is a standard», sin «mandatory». Con esas líneas, la clave de la pregunta 1 contradice lo que el alumno ha estudiado, y el vídeo enseña una cosa que la lección (que va antes en la página) no dice: que una guideline puede ser muy concreta.
- Decisión: la condición se mantiene y se amplía a tres líneas, todas en el mismo PR del vídeo y avisadas en su descripción. No hay ninguna otra pregunta del banco, lab ni colocación que clave lo contrario (revisadas q1-q7, spl5a, `pl-sp5q1`; spl5a ya tiene guidelines con un número, «four unrelated words» y «each quarter»).
  - `sp5-part1.ts:41`: «…but the moment a **mandatory** document names a version, a length or an algorithm it has stopped being technology-neutral and has become the standard that implements the policy. Naming a version does not turn a recommendation into a standard: a suggestion stays a guideline however specific it is.»
  - `sp5-cards.ts:6` (fcp501): «…an exact number or setting **in a mandatory document** is a standard; anything phrased as a suggestion is a guideline, however specific.»
  - `sp5-part1.ts:103` (nota de examen): «Dos trampas frecuentes» pasa a «Tres», con la tercera: «lo concreto no basta para ser un standard: “recomendamos usar TLS 1.3” sigue siendo una **guideline**, porque nadie está obligado. El standard, además de concreto, obliga.» Ninguna de las tres cambia el número de líneas del archivo (están antes de la inserción del bloque, `:125-130`).

**A-5 · CORREGIR · escenario y voz de la pregunta 2 (y s04-05).**
- Dice: panel «dice **qué hacer**, paso a paso, si una cuenta aparece comprometida»; voz de s05-01 igual; s04-05 «dice paso a paso **qué hacer** si alguien se hunde».
- Problema: el vídeo ha dicho tres veces que «qué» es la pregunta de la policy y «cómo» la del procedure. El escenario del procedure empieza con «qué hacer», y su propia explicación dice «dice **cómo**, paso a paso». Para quien aplica la regla del vídeo, «qué» tira hacia policy: más que una trampa legítima, es ruido. La respuesta correcta sigue siendo única, pero el vocabulario del vídeo debe ser coherente.
- Corrección:
  - Panel (150 car.): «Un documento aprobado por la dirección y firmado por todo el SOC explica, paso a paso, cómo actuar si una cuenta aparece comprometida. Es obligatorio.»
  - Voz: `…Explica, paso a paso, cómo actuar si una cuenta aparece comprometida. Es obligatorio. ¿Qué describe mejor este documento?…` (ver también B-5 para «centro de operaciones»).
  - s04-05: `<warm> {pool-2}En la piscina, la hoja del socorrista dice paso a paso cómo actuar si alguien se hunde, y obliga. El cartel de la crema solo aconseja.`

**A-6 · CORREGIR · s04-03 y chip `playbook`: el ejemplo regala la pregunta 2.**
- Dice: «Si es para un caso concreto, **como una cuenta comprometida**, se llama playbook. Sigue siendo un procedure, y obliga igual.» Treinta segundos después, la pregunta 2 describe «una cuenta aparece comprometida… paso a paso… obligatorio».
- Problema: la pregunta 2 está pensada para transferir (la ficha la hace de cuenta comprometida precisamente para no copiar el playbook de ransomware de la lección); si el vídeo acaba de poner ese mismo caso como ejemplo de playbook, el espectador la resuelve de memoria y la trampa de policy deja de ser trampa.
- Corrección: usar en s04 el otro ejemplo de la lección (`sp5-part1.ts:67` y `:103` dicen «ransomware o cuenta comprometida»; el glosario, «ransomware, credencial comprometida»). Voz: `<thoughtful> {playbook}Si un procedure es para un caso concreto, como un ransomware, se llama playbook. Sigue siendo un procedure, y obliga igual.` Chip (storyboard s04): «playbook: un procedure para un caso concreto · ejemplo: ransomware». «Ransomware» genérico no toca el canon (R-014 va en condicional y solo en V25; V33 y V35 lo usan como ejemplo).

**A-7 · CORREGIR · s06-03 y texto de pantalla `standard-only`: la causa está al revés.**
- Dice: «La policy se queda igual, **y por eso** no nombra tecnología.» Pantalla: «por eso no nombra tecnología».
- Problema: dicho así, no nombrar tecnología es la consecuencia de quedarse igual. Es al revés: la policy se queda igual porque no nombra tecnología (`sp5-part1.ts:27`, fcp501: «technology-neutral so it survives a change of product»). Es el motivo central del concepto 3 y se enseña invertido.
- Corrección:
  - Voz s06-03: `<confident> {platform-change}Imagina que el puerto cambia la plataforma por otro producto. {standard-only}Se reescribe el standard. La policy se queda igual, porque no nombra tecnología.` (23 palabras).
  - Pantalla: «igual · porque no nombra tecnología».
  - Además, el cue se llama `standard-only` y la voz solo reescribe el standard, pero el `goal` ilumina «el standard (y el procedure)». Iluminar solo el standard (el procedure puede seguir siendo «súbelo a la plataforma» con otro producto). Si se prefiere iluminar los dos, la voz tendría que añadir «y algún paso del procedure».

**A-8 · CORREGIR · s06-01 «Los cuatro papeles tienen un dueño».**
- Problema: afirma un hecho sobre los papeles del puerto (que los cuatro tienen dueño). El registro lo toca por tres sitios: el dosier de PAPER GOVERNOR habla de «políticas sin dueño», el callout de la lección que va justo antes del vídeo dice que en Halden «tres documentos no tienen dueño», y la ficha prometía «no dice que al puerto le falte ningún dueño». Decir que los cuatro lo tienen tampoco debe ser un hecho: son una propuesta. Además la frase «un dueño, una persona y no un departamento» apila una aposición y un «y no».
- Corrección (regla, no hecho; coincide con la regla 3 del cierre): `<thoughtful> {owners}Cada uno de los cuatro papeles necesita un dueño. Una persona, no un departamento.` y s06-02: `<clear> {cycle}Y cada uno se revisa al menos una vez al año, o antes si cambia la ley o llega un servicio nuevo.` (22 palabras). Pantalla de `owners`: «dueño: una persona» sin presentar los cuatro como ya asignados.

**A-9 · OPCIONAL · s02-05 y tarjeta de s02: «cuánto» se queda corto.**
- «Dice cuánto» vale para AES-256 y los siete días, pero un standard no siempre es una cantidad («solo la plataforma aprobada», «MFA obligatorio», «TLS 1.2 o superior»). La pantalla sí dice «cuánto exactamente». Propuesta: voz `Eso es un standard. Dice cuánto, exactamente, y también obliga.`; tarjeta «Policy: qué y por qué; standard: cuánto exactamente» (49 car.). La frase final «qué, cuánto o cómo» es la mnemotecnia aprobada de la ficha; se mantiene.

**A-10 · OPCIONAL · s02-02, la policy no muestra su «por qué».**
- El vídeo dice «Dice qué y por qué» pero la hoja («la información sale solo por canales aprobados y según su clasificación») solo da el qué. Propuesta: sumar el motivo a la hoja y a la voz: `<clear> {sheet-1}La primera la aprueba la dirección. Dice que la información sale solo por canales aprobados, para protegerla.` (+2 palabras). Pantalla: «…según su clasificación, para protegerla».

**A-11 · OPCIONAL · s02-01, «una regla en cuatro hojas».**
- Una de las cuatro hojas es una guideline, que no es regla. Propuesta: `<engaging> {case}El puerto quiere ordenar cómo manda documentos fuera, y lo escribe en cuatro hojas.` (mismas palabras).

**A-12 · OPCIONAL · s06-02, «al menos cada año».**
- No lo dice SY0-701 (el 5.1 solo dice «Monitoring and revision»); es la convención de la lección (`sp5-part1.ts:108`, fcp504 «normally annual»). Es defendible, pero la voz lo da como regla del examen. La redacción de A-8 («al menos una vez al año») la deja como práctica; si se quiere más prudente: «normalmente cada año, o antes si…». Decisión de la duda de exactitud 3 de la ficha: la revisión fuera de ciclo por cambio de ley es de la lección y de fcp504; la pregunta 3 no depende de ningún plazo. Se mantiene.

**A-13 · OPCIONAL · storyboard s01 y s02, «hojas boca abajo» y «se da la vuelta».**
- Contradice la voz («dicen “política” **arriba**»: boca abajo no se lee) y repite el gesto de las seis tarjetas de V35. Propuesta: hojas boca arriba con «POLÍTICA» en el encabezado de las cuatro y el resto en barras; cada una se acerca o se levanta para leerla, sin volverse. Las notas (punto 7) ya piden distinguirlas de las tarjetas; esto lo resuelve.

**A-14 · OPCIONAL · sello «propuesta · sin fecha» y «proveedores».**
- El sello solo está en s01. La voz de s02-s04 está en presente («la aprueba la dirección», «la escribe Seguridad»). V45 repite «propuesta · sin fecha» en cada tramo del puerto; ponerlo también en s02 y s04 evita leerlo como hecho. Y en el `goal` de s02 («navieras, aduanas y proveedores») «proveedores» es un destinatario más, pero el registro reserva proveedores, contratos y SLA para sp5m5 (notas de V25 y V26); nada obliga a nombrarlos: dejar «navieras y aduanas».

**A-15 · Notas para el registro al cerrar el vídeo (no son hallazgos del guion).**
- La fila de V36 en §3 «Casos» cita «el SaaS de nóminas de la lección de sp5m1 (`sp/sp5-part1.ts:312`)»: esa línea es de sp5m2 (tabla de roles, SaaS de nóminas).
- Al publicar, V40 entra en §1, §3 (casos), §4 (sin adversario), §5 (notas) y §6 (piscina, carteles, hoja del socorrista, crema, piscina pequeña, escenarios de las tres preguntas) y las citas de `sp/sp5-part1.ts` posteriores a `:130` (las de sp5m2, es decir, la ficha de V41) bajan 11 líneas. Las de V25 y V26 son de `sp5-part2.ts` y no se mueven.

### Preguntas tipo examen (punto 2 del encargo)

| P | Una sola respuesta | Clave | Trampa | Porqués | Opciones |
|---|---|---|---|---|---|
| 1 Guideline / Standard | Sí: «recomendamos» y «nadie lo ha hecho obligatorio» solo encajan con guideline (SY0-701 5.1 lista Guidelines aparte y pone el cifrado en Standards, `sp5-part1.ts:27`). Policy y Procedure no tienen ni qué/por qué ni pasos | Correcta | Trampa real (versión concreta) | `why` cierto; `trapWhy` corregir (A-1) | Una palabra cada una, sin pistas gramaticales. Pistas de contenido de más: A-3 |
| 2 Procedure / Policy | Sí: «paso a paso» decide. El 5.1 pone Playbooks bajo Procedures y la incident response policy es de alto nivel; «obligatorio, aprobado, firmado» son las tres señales de policy, la trampa | Correcta | Trampa real | Ciertos | Sin pistas; corregir «qué hacer» (A-5) y que no se regale en s04 (A-6) |
| 3 Revisarla ahora / Esperar | Sí: ciclo anual como mínimo y revisión extra por ley (lección `:108`, fcp504). «Volver a firmar» sin revisar no actualiza nada; «convertirla en guideline» es absurda, pero sirve de descarte | Correcta | Trampa real (hace todo bien salvo la revisión) | Ciertos | Sin pistas gramaticales; D es la más corta, nada que decir. Casi calca fcp504, ya apuntado en `_revision` B-5 y salvado por la trampa |

### Dudas para el revisor (`out/script-notes.md`), decididas

1. **Título de YouTube.** Mantener `youtubeTitle` = «Policy, standard, procedure y guideline» (39). `youtube-meta` añade « | Security+ SY0-701 en español» (`youtube-meta.mjs:22`; así salieron V34-V47). «CompTIA» no va en el título. Los de 85-89 caracteres de V41 y V42 sí pasarán de 80 (no es de este vídeo).
2. **Sin `music` en `video.json`.** Correcto. La música de V28-V46 es la única de la biblioteca, «Go On Going – Stayloose», que pone `master_mix.py --bed-style music` sin declararla en `video.json` (notas de V35, V36, V37, V38, V45, V46). La ficha pide «otra distinta»: no hay otra; anotarlo en las notas, como ya hicieron las de los vídeos anteriores.
3. **Sin léxico de palabras inglesas; `lexicon.json` solo con `TLS`.** Correcto. `lexicon.chatterbox.json` no hace falta (la voz es la grabación de Lidia). «TLS» → «te ele ese» es la lectura normal; no es deletrear un identificador (regla 5).
4. **Título «Una guía de desarrollo».** Se cambia: A-3.
5. **Etiqueta `acceptable use policy`.** Quitarla de `tags`: el vídeo no la nombra en ningún sitio. El resto de etiquetas están en el vídeo o son del tema.
6. **Condición de la ficha.** Se mantiene y se amplía: A-4.
7. **Escenas, «hojas boca abajo».** A-13.
8. **Naturalidad pendiente.** Los cuatro «Eso es…» y la pregunta de s06-04: B-4 y B-3.

---

## B. NATURALIDAD

Lo que ya funciona y no se toca: frases cortas (como mucho 20 palabras salvo los enunciados de pregunta), conectores hablados («Pero», «Y», «Imagina que», «Ojo con»), la piscina como única imagen y bien mantenida, ninguna sigla deletreada, ningún dominio ni identificador, la pausa de pensar respetada, las resoluciones en tres tiempos (correcta, trampa, imagen) y la progresión de emociones. Lo que sí hay que tocar:

**B-1 · CORREGIR · «¿qué responde?» (s01-02, s08-04, chip `promise` y frase de cierre en pantalla).**
- Dice: «Primero, ¿obliga? Después, ¿qué responde?» y al final «¿Qué responde? ¿Qué, cuánto o cómo?».
- Problema: dicho en voz, «¿qué responde?» no se entiende (¿un documento responde?; falta «a qué pregunta») y en el cierre el primer «qué» (interrogativo) y el segundo (la opción) chocan. Es la columna vertebral del vídeo.
- Corrección:
  - s01-02: `<confident> {title}Cuatro papeles. {promise}Casi todo el mundo llama política a cualquier papel, y eso sale caro. Pero con dos preguntas los ordenas todos. Primero, ¿obliga? Después, ¿a qué pregunta contesta?`
  - s08-04: `<engaging> {phrase}Primero, ¿obliga? Después, ¿contesta al qué, al cuánto o al cómo?`
  - Pantalla: chip `promise` «¿obliga? · ¿qué pregunta contesta?»; frase del cierre «Primero, ¿obliga? Después, ¿contesta al qué, al cuánto o al cómo?».

**B-2 · CORREGIR · s06-05.**
- Dice: «…pasa como con el cartel de la piscina pequeña, que ya no existe y sigue ahí.»
- Problema: «que ya no existe y sigue ahí» tiene dos antecedentes (¿el cartel o la piscina?) y la piscina pequeña no se ha presentado. Frase de 21 palabras de una tirada.
- Corrección: `<warm> {old-sign}Y si nadie lo mira, pasa como con la piscina pequeña. Ya no existe, pero su cartel sigue colgado.`

**B-3 · CORREGIR · s06-04.**
- Dice: «El examen lo llama monitoring and revision.» (sin antecedente: «lo» sigue a la frase de la plataforma de s06-03) y el «monitoring» llega después de haber explicado solo la revisión.
- Corrección: `<engaging> Eso, en el examen, es monitoring and revision. {monitoring}Y monitorizar es comprobar que lo escrito se aplica. Por ejemplo, si salen documentos por correo y no por la plataforma.` (29 palabras en tres frases; +2 sobre la actual).
- Tarjeta de s06 «Cada papel: dueño, ciclo y revisión»: ciclo y revisión se solapan. Opcional: «Cada papel: un dueño y un ciclo de revisión» (43 car.).

**B-4 · OPCIONAL · plantilla repetida: cuatro «Eso es…» y tres «X tienta, porque… Pero…».**
- Cuatro resoluciones seguidas abren igual (s02-03, s02-05, s04-02, s04-04) y las tres trampas son el mismo molde (s03-02, s05-03, s07-03). Es el estilo de la serie («tienta» está en V37, V47…), pero V34 ya sustituyó este molde por frases distintas. Propuesta mínima, sin cambiar palabras clave:
  - s04-02: `Ese es el procedure. Dice cómo, paso a paso, y obliga a quien lo hace.`
  - s04-04: `…{guideline}Y eso, una guideline. Aconseja, no obliga, y no seguirla no es incumplir nada.`
  - s05-03: `Policy suena bien, porque obliga y lo aprueba la dirección. Pero una policy dice qué y por qué, no cómo.`
  - s07-03: `Esperar parece lo normal, porque todo está en orden. Pero el ciclo no basta si la ley cambia antes.`

**B-5 · OPCIONAL · s05-01 (53 palabras, un solo segmento).**
- Está bien repartido en frases de 20 como mucho y el motor necesita el escenario y la glosa en el mismo segmento (el aviso de 26 palabras es el mismo que en V45 y V47): no partir. Tres retoques:
  - «El centro de operaciones de un hospital» se oye como el centro de operaciones del hospital (logística, no seguridad). Mejor «El equipo de seguridad de un hospital… firmado por todos».
  - La pregunta 1 abre con «Te toca» y la 3 con «La última»; la 2 entra en seco. «Otra más.» (V45 usa «Te toca / Otra más / La última»).
  - La glosa «Pide la que encaja con este caso, aunque otra suene bien» es la de V28 casi palabra por palabra, que ya han oído quienes han visto V28, V32, V35, V36… (G-4 de la revisión cruzada). Una versión propia: `{best}Ojo con ese «mejor». Aquí una opción encaja a medias, y solo otra encaja del todo.`
  - Texto completo con A-5: `<intrigued> {q2}Otra más. El equipo de seguridad de un hospital tiene un documento aprobado por la dirección y firmado por todos. Explica, paso a paso, cómo actuar si una cuenta aparece comprometida. Es obligatorio. ¿Qué describe mejor este documento? {best}Ojo con ese «mejor». Aquí una opción encaja a medias, y solo otra encaja del todo.` (54 palabras). El panel sigue diciendo «todo el SOC» (misma idea).

**B-6 · OPCIONAL · s01-02 y s02-03.**
- «Cuatro papeles.» (cue `title`) repite lo que acaba de decir s01-01 («cuatro papeles sobre una mesa»). Aceptable por ser el título; si se quiere variar: `{title}Cuatro papeles, y solo uno es política.`
- La promesa dice que solo uno es «política» y s02-03 lo nombra «policy» sin puente: `Eso sí es una policy, una política de verdad. Dice qué y por qué, obliga a todos y no nombra tecnología.` (+5 palabras, regla 3: idea antes que nombre).

**B-7 · OPCIONAL · «la plataforma» sin presentar (s02-04, s06-03, s06-04).**
- «De intercambio» solo sale en pantalla. Decirlo una vez: s02-04 `…por la plataforma de intercambio aprobada, con enlaces que caducan a los siete días.` (+2 palabras; 25 en total, 20 la frase más larga).

**B-8 · OPCIONAL · s07-01 y s07-04.**
- s07-01: «Tiene dueña y aprobación de la dirección» suena a telegrama. `La política tiene dueña y la aprobó la dirección.` (+3 palabras).
- s07-04: «Se cambia cuando cierra, no cuando toca revisarlo» no dice qué cierra. `Como el cartel de la piscina pequeña. Se cambia cuando la piscina cierra, no cuando toca la revisión de siempre.` (+5 palabras).

**Presupuesto.** Con A-1, A-2, A-5, A-6, A-7, A-8, B-1, B-2 y B-3 aplicados, la suma baja o sube pocas palabras (+6 en total: s01-02 +2, s03-02 −1, s04-03 +1, s05-01 −2, s06 +4, s08-04 +2, s03-01 0; `build-timeline --estimate` pasaría de 322,8 s a unos 325 s, bajo los 330). Las opcionales suman otras ~+15; aplicarlas todas dejaría la estimación por encima de 330 s, así que conviene correr `--estimate --check` tras elegir. Los tres avisos de «más de 26 palabras» (s03-01, s05-01, s07-01) se quedan: son el enunciado de la pregunta.

---

## Veredicto

**Congelar tras corregir A-1 (bloqueante), A-2 a A-8, B-1, B-2 y B-3.** Con eso el guion queda listo; las opcionales (A-9 a A-14, B-4 a B-8) son a gusto de Lidia o del siguiente repaso, y la lista de A-4 debe entrar en el mismo PR que el bloque del vídeo.

| Severidad | Cantidad | Ids |
|---|---|---|
| BLOQUEANTE | 1 | A-1 |
| CORREGIR | 10 | A-2, A-3, A-4, A-5, A-6, A-7, A-8, B-1, B-2, B-3 |
| OPCIONAL | 11 | A-9, A-10, A-11, A-12, A-13, A-14, B-4, B-5, B-6, B-7, B-8 |

(A-15 son notas para el registro, no cuentan.)
