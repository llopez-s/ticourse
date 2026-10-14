### V24 · sp3m7 · Cápsula · «Recuperación ante desastres: dónde sigues, qué prueba demuestra qué y cuándo una copia es una copia»

> Propuesta del 2026-10-14 (tanda 5), con las opciones recomendadas ya elegidas; falta que Lidia diga qué cambia. La versión
> vigente de escenas y guion será `video/recuperacion-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/recuperacion-halden/out/script-notes.md`. Las decisiones, con lo descartado, están al final de esta ficha (no hay
> fichero de decisiones de la tanda 5 para V24).
>
> **Orden del curso.** sp3m7 es la última lección de sp3 y va después de sp3m4 (V16) y sp3m5 (V17): quien sigue el curso ya
> ha visto a BLIND ARCHITECT dos veces, así que «vuelve» es verdad en el orden del curso y en el del calendario. Va **antes**
> que toda la sección sp4 (V1, V5, V5b, V6, V18, V21) y que sp5 (V25 y V26): V24 no remite a ningún vídeo ni al caso de
> septiembre, y no dice «como viste en V5b» aunque V5b ya esté publicado.
>
> Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`, `reg` = `docs/superpowers/canon/glass-harbor.md`,
> `plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md`, `eng/` = `video/engine/`.

- **Carpeta:** `recuperacion-halden` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo
  **3.4** (cabecera de la lección, `sp/sp3-part4.ts:4-5`) · adversario **BLIND ARCHITECT** (sección sp3, `sp/sections.ts:81-88`),
  dos mensajes interceptados, con la voz de V16 y V17 (`sapi/Microsoft Helena`, `rate` −2, `megafonia`;
  `video/zonas-halden/narration.json:11-15`, `video/fronteras-halden/narration.json:11-15`: una voz por adversario, para
  siempre) · voz `recording/lidia` con `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · música
  `Go On Going - Stayloose.mp3` · `"lexicon": "lexicon.chatterbox.json"` (solo siglas) · en `video.json`, `"lesson": "sp3m7"` y
  `"adversary": "BLIND ARCHITECT"`.
- **Etiquetas** (`video.json`, clave `"tags"`): disaster recovery, recuperación ante desastres, hot site, warm site, cold
  site, geographic dispersion, tabletop exercise, simulation, parallel processing, fail over, backup, prueba de restauración,
  Security+. Ninguna etiqueta sobre RTO, RPO ni ALE: son de V26 y V25.
- **Efectos (`sfx`):** los automáticos del motor y cuatro momentos, todos de la biblioteca (`eng/sfx/sfx.json`: glitch,
  typing, ding, whoosh, mail, check, error, block, alarm, ping2, lock; comprobado con Node contra `sounds`): `dark`
  («error», el centro de datos principal se apaga, cue de s01), `swap` («whoosh», la producción cambia de sitio, cue de
  s04), `green` («check», las copias salen en verde, cue de s05) y `unusable` («block», la restauración no vuelve, cue de
  s05). Cada clave es un cue de **su** escena (la tabla de escenas los lista) y ninguna está en dos escenas
  (`sfxMapErrors`, `eng/scripts/lib/sfx.mjs:36-60`). Ningún efecto nuevo ni ninguna voz nueva.
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "secplus"`, `"adversary": "BLIND ARCHITECT"`, `"lesson": "sp3m7"`,
  `"slug": "recuperacion-halden"`, `"composition": "RecuperacionHalden"`, `"poster": "RecuperacionHaldenPoster"`, la música de
  arriba y los `"tags"` de arriba. Título de YouTube (98 caracteres, tope de YouTube 100): «Recuperación ante desastres: hot,
  warm y cold site, y cómo probarla | CompTIA Security+ en español». Ritmo: `"examTiming": "sentence-end"`; pregunta con
  `think.holdMs` 4500; mensajes con `intercept.holdMs` 3800.
- **Léxico** (`lexicon.chatterbox.json` es solo de siglas; los términos en inglés los dice Lidia en inglés y se confirman al
  grabar): ya fijados `BLIND` («bláind»), `ARCHITECT` («árquitect») y `DNS` («de ene ese»); `tabletop exercise` y
  `simulation` ya los dice Lidia en V5b. Nuevos, con la lectura habitual en España: `hot site` («jot sáit»), `warm site`
  («uarm sáit»), `cold site` («cóuld sáit»), `parallel processing` («parálel prósesing»), `fail over` («féil óuver»),
  `geographic dispersion` («yeográfic dispérshon») y `backup` («bákap»). **Colisión a vigilar:** V16 dice `fail-open`,
  `fail-closed`, `fail-safe` y `fail-secure`; en V24 solo se dice `fail over` y nunca ninguno de los otros cuatro (ni `fail
  back`, que sale en la lista de la lección pero no entra aquí). «CPD» y «DR» van solo en pantalla: la voz dice «centro de
  datos» y «recuperación ante desastres».
- **Lo que se lee no se deletrea:** no sale ningún host, IP, dominio ni cuenta. **No se dice ninguna cifra**: ni kilómetros
  (el «40 km» de la lección, `sp/sp3-part4.ts:80`, queda fuera: ver H5 en «Cambios de la revisión»), ni minutos de espera
  ni euros ni porcentajes. `CPD` y los rótulos HOT SITE, WARM SITE y COLD SITE son pantalla. Ninguna excepción.
- **Duración:** suma de `s` **210 s** (6 escenas), la misma que V20 y V21; estimado ~260 s y **unos 235–250 s renderizados
  (unos 4:00)**, dentro de 190–260. No se rellena. La suma predice mal (V5 salió a 0,89 veces la suya y V4 a 1,22): el
  primer borrador se mide por los dos lados. Si el estimado pasa de 255 s, se recorta primero la mitad de la mesa y del
  simulacro en s03 (a media frase cada uno) y luego el mapa de la dispersión de s02; si se acerca a 190 s, se alarga s04, la
  escena que más cuenta. Esta cápsula **no tiene escenas de consola**, así que la estimación es menos fiable que la de V20.
- **Inserción:** en `sp/sp3-part4.ts`, lección sp3m7, **después del tercer check (ransomware, `:123-137`) y antes del párrafo
  que cierra el dominio (`:138-141`)**, como bloque `t: 'video'` con su id de YouTube, su póster y su transcripción propios en
  `public/` (forma de `sp/sp3-part3.ts:219-225`), precedido de una línea: «Antes de cerrar el dominio, míralo en el puerto:
  dónde sigue todo si falta el centro de datos, qué prueba demuestra qué y cuándo una copia es una copia». **La pauta «después
  de los checks y antes de la nota de examen» no cabe en este fichero**: la nota de examen es `:117-122` y el tercer check
  viene **después**, en `:123-137`. Las dos posiciones posibles:
  1. **Entre la lista de activación y la nota (`:116`/`:117`).** Es lo que hacen V17, V6 y V23 (antes de la nota). Descartada:
     el vídeo llegaría antes del check de ransomware, que habla de snapshots, réplica y copias aisladas (`:126`), y s05 toca
     justo eso; V20 descartó expresamente poner un vídeo antes del check que su escena contesta (`decisiones-V20-V21.md:94-96`).
  2. **Después del tercer check y antes del párrafo de cierre (`:137`/`:138`).** Es la pauta dominante del repo (V5b, V10, V11,
     V16, V20: último check, vídeo, párrafo que da paso a lo siguiente). **Elegida.** Todo lo que enseña el vídeo va antes en la
     lección: los sitios y la dispersión (`:47`, `:49-72`), las pruebas (`:95`), las copias (`:99`), la lista de activación
     (`:101-116`), la nota de examen (`:117-122`) y los tres checks (`:29-43`, `:77-91`, `:123-137`). El vídeo **repasa en el
     puerto** lo que ya has leído: no adelanta nada ni contesta ningún check de antemano.
  Las citas de línea de esta ficha son las del fichero **sin** el bloque insertado; después van once líneas más abajo
  (un párrafo de 4 líneas y un bloque de 7, como `sp/sp3-part3.ts:215-226`).
  Se fija en la suite `lesson videos` de `src/data/content.test.ts` con una línea nueva junto a V21 (`:305-308`),
  `expect(youtubeVideos.find((v) => v.block.youtube === '<id>')?.module).toBe('sp3m7');`, con su comentario de dónde va.
- **Enfoque («si el centro de datos no está»):** sin fecha. La analista, en segunda persona y sin nombre, repasa el plan de
  recuperación del puerto con una ficha de tres filas: tres servicios **sin nombre** (uno que no puede parar, uno que aguanta
  una jornada y uno que aguanta semanas) y la pregunta de cada fila, que es la del examen: ¿qué sitio, a qué distancia y cómo
  sabes que funciona? Tres movimientos: elegir el sitio por lo que ya funciona allí (y que esté lejos), saber qué demuestra
  cada prueba (la mesa, el simulacro y el paralelo no tocan producción; solo el fail over cambia de sitio de verdad), y no
  creer una copia hasta que se ha restaurado. BLIND ARCHITECT trae dos atajos de manual, sin atacar nada. Registro de revisión y
  propuesta, como el «plan» de V16 y el simulador de V20: **nada se ejecuta, nada se mueve y no hay incidente**. Sin frase de
  puente: el vídeo no continúa ningún otro y se entiende solo.

**Conceptos (3) y su imagen:**

Las dos imágenes salen de la vida diaria, no del puerto, y no se mezclan con las ocupadas (§6 del registro y fichas
anteriores): ni valla, garita, puerta, llave, ventanilla, chaleco, almacén, foco, candado, carné, casco, temporal (V18), tienda (V22),
cocina (V9), ni el ensayo con el guion en la mano ni el simulacro de incendio de V5b, ni la casa con los grifos de V5b.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | El sitio se elige por lo que ya funciona allí, y se paga todo el año. **Hot**: réplica operativa, minutos, el más caro. **Warm**: espacio, conectividad y hardware, datos por restaurar, horas o un día. **Cold**: local con energía, refrigeración y red, hardware y datos los llevas tú, días o semanas, el más barato. Y debe estar **lo bastante lejos** para que un mismo suceso no alcance a los dos: el segundo sitio en el edificio de enfrente cumple el papeleo y no el objetivo (`sp/sp3-part4.ts:47`, tabla `:49-72`, nota `:121`, q1, q7) | **Un teatro de reserva.** Hot: otro teatro con el decorado montado y la función en cartel; warm: el escenario y la iluminación listos y el decorado guardado en el camerino, sin montar; cold: una sala vacía con luz y agua. El de enfrente, en la misma calle inundada, no es de reserva | «Hot minutos, warm horas, cold días: más rápido, más caro» |
| 2 | Cada prueba demuestra una cosa distinta, de menos a más real y de menos a más arriesgada. **Tabletop** valida el plan (roles, quién declara, a quién se llama), no la tecnología. **Simulation** ejecuta acciones reales y controladas sin mover producción. **Parallel processing** hace que el respaldo procese lo mismo que producción y compara, **sin interrumpir**. **Fail over** conmuta la producción de verdad: es la única que prueba el cambio extremo a extremo (DNS, certificados, integraciones, permisos) y la que más arriesga, así que lleva ventana y plan de vuelta atrás (`:95`, nota `:121`, q3, q4) | **Los mismos teatros.** El paralelo: los dos teatros dan la misma función a la vez, uno con público y otro vacío, y se comparan. El fail over: esta noche el público entra en el otro | «Parallel processing: prueba el respaldo sin parar nada» · «Tabletop valida el plan; fail over valida el sistema» |
| 3 | Una copia en verde no es una copia que vuelve. «Completada» solo prueba que el trabajo corrió; la copia se demuestra restaurándola, comprobando integridad y funcionamiento y cronometrando, de forma periódica y documentada. Y el snapshot (mismo almacenamiento) y la réplica (copia también el borrado y el cifrado) no son copias de seguridad (`:99`, nota `:121`, `:112`, q5) | **Un paraguas plegado en la entrada** con su pegatina «revisado» y que nadie ha abierto nunca. La prueba es abrirlo (paraguas: libre en el registro; sin gravedad y se prueba de verdad) | «Un backup que nunca se ha restaurado no es un backup» |

**Escenas:** seis, en tres capítulos (El sitio de respaldo · Probarlo · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Si el centro de datos no está» | I El sitio de respaldo | 22 | Sello «plan de recuperación · revisión · propuesta · sin efectos», **sin fecha**. Una sola caja, «CPD», que se apaga a media luz (`dark`), con un reloj sin hora y **sin pregunta** (el reloj corre; cuánto tarda es de s02, según el tipo de sitio, y el gancho de «cuánto tarda en volver» es de V26). **No sale ningún segundo CPD**: el hook es genérico. La primera frase dice la pregunta en llano («Si mañana el centro de datos del puerto ya no está, ¿dónde sigue todo? Y mientras tanto, el reloj corre.»); al acabarla, título «Recuperación ante desastres» (hacia los 8 s, siempre antes de los 12) y la promesa en tres chips: «qué sitio · qué prueba demuestra qué · una copia que vuelve». Entra la etiqueta «BLIND ARCHITECT · sección 3» con «los planos con atajos» | La promesa en los primeros 10 s: la pregunta, que el sitio se elige y se prueba · `stamp, dc, dark, title, promise, adversary` |
| s02-sitios «Un teatro de reserva» | I | 48 | Tres teatros pequeños en fila, de izquierda a derecha: decorado montado y cartel (HOT SITE), escenario e iluminación listos con el decorado guardado en el camerino, sin montar (WARM SITE), sala vacía con luz y agua (COLD SITE). Debajo, el tiempo («minutos», «horas o un día», «días o semanas») y, en sentido contrario, lo que cuesta cada uno («todo el año», «medio», «lo más barato»). Rótulo fijo: «lo que necesitaría cada servicio · propuesta»: las tres filas de la ficha se acomodan, cada una con el suyo (sin nombre de servicio); **los teatros no son sitios que el puerto tenga**. Después, un mapa genérico: un CPD y, pegado a él «en la misma calle», un segundo; una inundación los cubre a los dos. Mensaje interceptado. Respuesta de la narradora, que concede lo cierto antes del pero: es verdad, más cerca es más fácil replicar; pero un mismo suceso los alcanza a los dos. Nombre GEOGRAPHIC DISPERSION. **No hay dato de distancia ni línea sobre el segundo centro del puerto**: la dispersión se enseña con el «edificio de enfrente» y se cierra ahí | El sitio se elige por lo que ya funciona allí y se paga todo el año; debe estar lejos · `theatres, hot, warm, cold, price, far, dispersion` · **intercept** |
| s03-paralelo «Cuatro formas de probarlo» | II Probarlo | 40 | Cuatro escalones que suben en realismo y en riesgo, con una barra «toca producción» que se queda en «no». Primero, sentados a una mesa: TABLETOP EXERCISE, «el plan: roles, quién declara, a quién se llama». Segundo, el equipo con un escenario y acciones reales: SIMULATION, «sin mover producción». Tercero, los dos teatros dan la misma función a la vez, uno con público y el otro vacío, y se comparan columna a columna: PARALLEL PROCESSING, «el respaldo funciona, sin interrumpir». El cuarto escalón queda tapado con una interrogación | Las tres primeras no tocan producción; el paralelo prueba el respaldo sin parar nada, pero no el cambio · `ladder, tabletop, simulation, parallel, compare, hidden` |
| s04-conmutar «Quién demuestra qué» | II | 40 | Una petición escrita en pantalla: «demostrar que el segundo centro de datos corre la aplicación principal, con sus usuarios dentro, su DNS, sus certificados, sus integraciones y sus permisos». Cuatro chips: DNS · certificados · integraciones · permisos. Pregunta para pensar, con dos botones: «parallel» y «fail over». Respuesta: fail over; el paralelo prueba el respaldo, pero no el cambio de sitio. Se enciende el cuarto escalón: esta noche el público entra de verdad en el otro teatro (`swap`), con su rótulo «ventana de mantenimiento» y su «plan de vuelta atrás». Nombre FAIL OVER. La mesa, abajo: valida el plan; el fail over valida el sistema | Solo el fail over demuestra el cambio extremo a extremo, y por eso se planifica · `ask, chips, think, answer, swap, window, back, ladder-top` · **think** |
| s05-copia «La copia en verde» | II | 40 | Una cuadrícula de casillas, una por noche, todas «completada» en verde (`green`), **sin fechas ni horas y sin ser una tira de tres** (otra composición que la de V5, `v5/src/data/s07-recovery.ts:22-26`), con el rótulo fijo «ejemplo · sin fecha · no es el registro del puerto». Un paraguas plegado en la entrada con la pegatina «revisado» y que nadie ha abierto. Mensaje interceptado. Respuesta: verde dice que el trabajo corrió, no que la copia vuelva. El ejemplo de la lección: la restauración falla, «los archivos no sirven» (`unusable`). Después, la prueba: restaurar en un entorno aparte, comprobar que los datos están completos y que la aplicación responde, y cronometrar y apuntar. Dos chips: «snapshot · mismo almacenamiento» y «réplica · copia también el borrado y el cifrado» | Una copia solo es una copia cuando se ha restaurado; la réplica y el snapshot no cuentan (en la voz, el snapshot es «el que vive en el mismo almacenamiento», como el chip) · `green, umbrella, restore, unusable, check, copies` · **intercept** |
| s06-recap «Tres reglas» | III Para el examen | 20 | Tres tarjetas de reglas, cada una con su icono (el teatro · los cuatro escalones · el paraguas); tarjeta final Alertópolis: «Tu turno: el laboratorio Continuity Ladder» | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (objetivo 3.4), una por escena de s02 a s05, cada una con su cue antes de la última frase de la
  escena (`examTiming: sentence-end`):
  - «Hot minutos, warm horas, cold días: más rápido, más caro» (s02) (56). Es la nota de examen (`sp/sp3-part4.ts:121`,
    reflejo cuatro). No lleva RTO ni RPO ni ninguna cifra.
  - «Parallel processing: prueba el respaldo sin parar nada» (s03) (54). «Sin interrumpir producción» es el reflejo tres.
  - «Tabletop valida el plan; fail over valida el sistema» (s04) (52). Es el reflejo tres de la nota (`:121`).
  - «Un backup que nunca se ha restaurado no es un backup» (s05) (52). Es el reflejo uno (`:121`).
- **Pregunta para pensar** (`holdMs` 4500): «Probar el cambio de DNS: ¿parallel o fail over?» (s04) (47). Llega con la
  petición y los cuatro chips en pantalla y sin rótulo que la conteste; el título de la escena («Quién demuestra qué») tampoco
  da la respuesta. Respuesta: fail over. La tentación es el paralelo, que también prueba el respaldo y no interrumpe, pero no
  cambia a los usuarios de sitio: solo el fail over prueba el cambio extremo a extremo (`sp/sp3-part4.ts:95`, q4 `:184-198`).
  La pregunta pone el discriminador en el **cambio de sitio**, no en «carga real», que se lee también como «datos reales»,
  y el paralelo procesa los mismos datos que producción (`:95`). No es la pregunta de q3 (mesa primero) ni la del check de
  platform diversity. **Descartadas:** «Con su DNS y carga real: ¿parallel o fail over?» (47), por la lectura de «carga
  real» y porque es q4 casi palabra por palabra y contesta de antemano una pregunta del test (H6); y «Demostrar que
  conmuta: ¿parallel o fail over?» (45): «conmutar» es la palabra con la que la lección define el fail over (`:95`) y la
  pregunta se contestaría sola. Que el revisor de naturalidad mire si «Probar el cambio de DNS» se lee como pregunta de
  verdad y no destripa la respuesta.
- **Mensajes interceptados** (BLIND ARCHITECT, `holdMs` ~3800; uno por capítulo en I y II, ninguno en el cierre; el registro
  de V16 y V17: un atajo de diseño que quita una pared o un paso, frases cortas, «Menos es más.» al final, sin cifrado, claves
  ni certificados; no tutea):
  - s02: «¿Un segundo centro lejos? Al lado replica mejor. Menos es más.» (62). Usa el contrapeso que da la lección, la
    latencia («cuanto más lejos, más difícil es la replicación síncrona», `sp/sp3-part4.ts:47`), y no un coste que la
    lección no menciona. La narradora lo concede («es verdad: más cerca, más fácil replicar») y corrige: un segundo centro
    en el edificio de enfrente cumple el papeleo y no el objetivo, porque un mismo suceso (una inundación, un corte
    regional) alcanza a los dos (`:47`, q7). La latencia sale una frase, sin tarjeta ni definición. «Respaldo» no aparece:
    es la palabra del paralelo y de las copias.
  - s05: «¿Probar las copias? Si salen en verde, ya valen. Menos es más.» (62). Un atajo que quita un paso sin describir
    el estado de las copias del puerto. El error: dar por buena una copia porque el trabajo salió bien. Eso solo prueba
    que el trabajo corrió; lo que prueba la copia es restaurarla (q5, `:212`).
- **Cierre:** tres reglas y una sola tarea.
  1. El sitio se elige por lo que ya funciona allí, y se paga todo el año: hot, minutos y el más caro; warm, horas; cold,
     días y el más barato. Y lejos: que un mismo suceso no alcance a los dos.
  2. Cada prueba demuestra una cosa: la mesa, el plan; el paralelo, que el respaldo funciona sin parar nada; el fail over, el
     cambio de verdad, y por eso se planifica.
  3. Una copia que no se ha restaurado no es una copia, y el snapshot y la réplica no cuentan: copian también el daño.

  Tarea: el laboratorio **Continuity Ladder** (`spl3c`, ordena los 8 pasos de la activación). El vídeo deja el orden de la
  activación a propósito para el laboratorio (penalización L del ranking). Alternativa: las 8 preguntas de la lección; el
  vídeo toca q1 (`:144-153`), q3 (`:169-183`), q4 (`:184-198`), q5 (`:199-213`) y q7 (`:229-243`), y no toca q2 (`:154-168`,
  load balancing y clustering), q6 (`:214-228`, UPS y generator) ni q8 (`:244-253`, capacity planning de personas).
- **Se queda fuera** (sigue en la lección, que quien ve el vídeo ya ha leído, porque va al final):
  - **RTO y RPO** como conceptos, su definición y su cálculo (`sp/sp3-part4.ts:47`, `:57`, `:99`; `:121`): **frontera con
    V26**. V24 elige el sitio por «cuánto puede estar parado el puerto» y no pone nombre a la magnitud, no la define ni la
    cuantifica; la voz y las tarjetas no dicen RTO ni RPO, y el vídeo no copia la celda «RTO/RPO cercanos a cero» de la tabla
    (`:57`). La frecuencia de la copia como consecuencia del RPO (`:99`) también es de V26. V26 tiene su BIA, RTO, RPO, MTTR y
    MTBF (`sp/sp5-part2.ts:400`, nota `:406`, check `:411`) y **no vuelve a hot, warm ni cold** ni a la escalera de sitios
    (H13): la frontera es limpia en los dos sentidos.
  - **ALE:** sp3m7 no lo toca. Frontera con V25 (sp5m3, `sp/sp5-part2.ts:8`): nada de pérdida esperada ni de coste por hora.
  - Load balancing y clustering, active/active y active/passive (`:27`, check `:29-43`, q2): alta disponibilidad, no
    recuperación.
  - Platform diversity, multi-cloud, continuity of operations y las tres capacidades (`:75`, check `:77-91`, q8): fuera por
    duración. Es el vecindario de la «diversidad»: el vídeo no distingue las tres diversidades del reflejo cinco (`:121`).
  - Onsite y offsite, frecuencia, cifrado de las copias, journaling y el aislamiento con retención (`:99`, check `:123-137`):
    solo salen el snapshot y la réplica como «no son copias», en un chip.
  - UPS y generator (`:99`, q6): ni una palabra; BLIND ARCHITECT no aconseja nada sobre energía.
  - La lista de activación de 10 pasos (`:101-116`). La latencia solo sale **una frase**, en el mensaje de s02 y la
    concesión de la narradora, sin tarjeta, sin «replicación síncrona» y sin definirla (`:47`).
  - **Cualquier distancia en kilómetros**, incluido el «40 km» del segundo centro de la lección (`:80`): la lección no da
    un mínimo, el vídeo no afirma que una distancia sea suficiente ni dice de qué tipo es ese segundo centro (**a verificar
    con el material oficial** si se quisiera decir; no va en ninguna tarjeta).
- **Laboratorios:** `sp/labs-sp3.ts:36-45` (spl3c Continuity Ladder, `order`, datos `:202-247`) ejercita la **activación en
  orden**: detectar y confirmar (`:207`), declarar (`:212`), avisar (`:217`), fail over al warm site (`:222`), restaurar la
  copia verificada (`:227`), verificar (`:232`), redirigir (`:237`) y fail back con revisión (`:242`). **V24 no cuenta esa
  secuencia ni la de la lección (`sp/sp3-part4.ts:101-116`)**: aporta el porqué (qué demuestra cada prueba, por qué una copia
  en verde no basta) y deja el orden al laboratorio, que es la tarea. Ninguna escena es una lista de pasos. Tampoco usa su
  escenario (la sala de servidores sin refrigeración, `:204`). Con spl3b (`:25-34`, classify de protección de datos; copia
  y cintas en `:118` y `:139`) no hay solape: el vídeo no clasifica ninguna copia como cifrada, enmascarada ni restringida. Con
  spl3a (Zone Defense) tampoco: no dibuja ninguna zona.

**Canon nuevo que fija V24** (nada de esto estaba en los datos de los vídeos; lo posterior debe respetarlo):
- **Un «plan de recuperación» sin fecha**, revisado por la analista en segunda persona y sin nombre, con tres servicios **sin
  nombre** y una propuesta sin efectos. No es un incidente, no es un cambio y no hay dueño, plazo ni mejora con fecha (a
  diferencia de V20 y V21). Ninguna prueba se ha ejecutado: la mesa, el simulacro, el paralelo y el fail over son lo que se
  explica, no lo que se hizo.
- **El segundo centro de datos del puerto (a 40 km en la lección, `sp/sp3-part4.ts:80`) no entra en el canon de vídeo.**
  V24 no lo dibuja, no lo nombra y no da ninguna distancia (H5): el dato no hacía nada (sugería que 40 km es «lejos», que la
  lección no afirma, y dejaba colgada la pregunta del tipo de sitio) y creaba canon sin función. La dispersión se enseña
  con el «edificio de enfrente» y el mismo suceso (una inundación). Los tres teatros de s02 son lo que necesitaría cada
  servicio, no sitios que el puerto tenga. Opción descartada: llamarlo «warm» (es lo que encajaría con el laboratorio,
  `labs-sp3.ts:222`, y la definición de `:47` admite «replicación periódica»), pero fija un hecho de Halden que ninguna
  fuente fija, y `:126` lo contradice. Alternativa no elegida (**decide Lidia** si la quiere): conservar el dato al
  final de s02 con una frase de matiz («la lección no da una distancia mínima: lo que cuenta es qué suceso os alcanza a
  los dos»); recomendada: no conservarlo.
- **BLIND ARCHITECT, tercera aparición** (V16 y V17 la preceden en el calendario y en el curso), con el registro y la voz de
  V16 y V17: dos atajos de diseño, «Menos es más.» al final, sin IP, dominio ni equipo; solo da consejos. **Es el primer
  vídeo en el que BLIND ARCHITECT habla de copias** (el atajo de s05); al publicarlo se actualiza `reg:361` («no toca las
  copias») y su nota. Aun así, el atajo no describe el estado de las copias del puerto (H9).
- **«CPD» y «centro de datos» son la misma cosa** en el curso (`sp/sp1-part1.ts:114`, `sp/sp1-part2.ts:300`, «data centre»
  en `sp/labs-sp5.ts:88`); en V24, «CPD» solo en pantalla y la voz dice «centro de datos». Se anota en `reg` al publicar (H33).
- **«Ejemplo · sin fecha · no es el registro del puerto»** en la cuadrícula de copias de s05: el escenario de q5 (`:203`) es un
  ejemplo rotulado, no un hecho de Halden (misma técnica que «tableta 07» en V21). **Roce lección/V5 para el registro (§5):**
  q5 sí lo pone en el puerto («Nightly backup jobs at the Halden Port Authority … cannot be restored», `:203`) y V5
  restauró con éxito una copia (`reg:76`). El vídeo no lo resuelve: lo rotula como ejemplo.
- **Si Lidia prefiere fechar** (opción, no recomendada): **martes 12-01-2027** (Node: 2027-01-12 es martes; 11-01 es lunes).
  Cae después de todo lo fechado de Halden salvo la caducidad del 1-04-2027 y hereda las reglas de «no la da por cumplida sin
  enseñarla»: la MFA del 30-11 (V10, V20), el plan de zonas por fases desde el 1-12 (V16, V17), el piloto del ERP del 11-12
  (V20), el WPA3-Enterprise del 22-12 (V21) y los plazos de V19 y V18. V24 no toca ninguno, pero un sello de enero lo hace
  posterior a todos y obliga a no darlos por hechos. No se ata a ninguna fecha ya existente (añadirle algo al comité del
  27-11 sería canon retroactivo). Coordinar con V25 y V26 que no elijan el mismo día.
- **Tensión de la lección que V24 no resuelve** (para el registro, §5): el segundo centro de datos replica el clúster
  (`sp/sp3-part4.ts:80`; la definición de warm admite «replicación periódica», `:47`, así que hasta aquí encaja) y su réplica
  recibe los bloques «en segundos» (`:126`, un servidor de ficheros: afirmación más fuerte, propia de un sitio casi hot); el
  laboratorio habla de «fail over to the warm site» (`sp/labs-sp3.ts:222`). V24 no clasifica ese sitio **ni lo menciona**:
  la tensión sigue abierta en la lección, no en el vídeo.
- **Comprobado contra la cronología:** al ser sin fecha no cae en ningún día; la alternativa de enero se comprobó con Node.

**No se toca:**
- **El dosier de BLIND ARCHITECT** (`sp/sections.ts:87`): los PLC de las esclusas, la wifi de invitados, «Segmentación y
  backups probados le cerraron el paso», «derrotada» y «GH busca un punto único de fallo». Un vídeo sobre un segundo sitio
  roza ese punto: **la voz y la pantalla no dicen «punto único de fallo» ni «single point of failure» ni «pilar»** (el pilar
  salió una vez en V16, del anuncio del jefe, `reg:544-546`), y el cierre no es la derrota de nadie: ninguna regla dice que
  probar las copias le «cierre el paso». Tampoco se usa el flavor del jefe («backups sin probar», `sp/sections.ts:85`) como
  descripción del estado del puerto. Es el primero que trata las copias **como diseño**, no como recuperación de un caso (V5
  elige entre tres copias y restaura una, `reg:76`); V16 las dejó fuera a propósito (`reg:361`).
- **V5 y la restauración de septiembre:** V24 no dice que el puerto «nunca ha restaurado» una copia, ni que sus copias
  fueran inservibles: V5 restauró `srv-tc-app03` desde la copia del 2-9 (la restauración, sin fecha) y «hash coincide»
  (`reg:76`; `v5/src/data/s07-recovery.ts:51-57`). La tira de V5 era de tres copias con hora (1, 2 y 3-9 a las 23:00,
  `s07-recovery.ts:22-26`); la de V24 es otra composición, sin fechas ni horas (H21). Por eso la copia que no vuelve de s05 es **un ejemplo rotulado**, y la prueba de restauración se
  cuenta como una comprobación periódica que demuestra, no como un fallo descubierto. Tampoco elige entre copias (las tres
  de `reg:47`, `:49`, `:61`).
- **El caso `IR-2026-0147`** y sus equipos (`srv-tc-app03`, `ADM-WS-*`, `OPS-WS-*`), `svc_tosreport`, la 01:52, los 38 GB,
  Lucía; nada de «habría ayudado». Ni los manifiestos de carga (el check de la lección los pone en un servidor, `:32`, y V5
  verifica «manifiestos OK» tras la restauración, `reg:76`), ni `hpa-portal-web-01` (`:27`), ni la noche del 21-10.
- **`backup01`** (`reg:913`): es el host del «Barrido interno» ruidoso de la cola del SIEM; las copias del vídeo no llevan
  nombre de equipo.
- **V16 y V17:** el plan de zonas y su jump server no salen ni se dan en marcha; ni fail-open, fail-closed, fail-safe ni
  fail-secure; ni la barrera ni la puerta de la sala de servidores (V16 s08); ni la red de las bombas de las esclusas ni
  «si se paran las bombas, se puede inundar un muelle» (V16 s07): la inundación de s02 es el ejemplo de la lección
  (`:47`) y se dice en condicional. El túnel entre la sede y la terminal (V17, `reg:187`) no es el enlace con el segundo
  centro de datos, y nadie los relaciona.
- **V20, V21, V10 y V19:** ni el ERP, ni el segundo factor del 30-11, ni la wifi de las tabletas, ni los plazos del 13-11
  y 11-12. Ninguna mejora de Halden se da por cumplida.
- **V25 y V26:** ni el riesgo R-014 (el ransomware del servidor de grúas del muelle norte, `sp/sp5-part2.ts:113-114`) ni
  el «sistema de asignación de atraques» de sp5m4 (`sp/sp5-part2.ts:355`, `:411`): V24 **no pone nombre a ningún servicio**
  precisamente para no chocar con las cifras que V26 le dé a ese sistema.
- **Contratistas, proveedores y mantenimiento:** ninguno en ninguna escena (PAPER GOVERNOR, `sp/sections.ts:125`; RED MARROW,
  `:68`); nadie hospeda el segundo sitio ni lleva las copias. Nadie con nombre.
- **Imágenes ocupadas:** ni «escalera» en la voz (es el «código de la escalera» de V21; la voz dice «escalón»), ni «peldaño»
  (V7), ni cocina, tienda, casa, foco (ni «focos» en el teatro: la voz dice «iluminación»), candado, chaleco, almacén (el decorado del warm va «guardado en el camerino»), temporal (V18: «alta mar con temporal»; la voz dice «una inundación»), ensayo con el guion en la mano ni simulacro de incendio. Tampoco paracaídas (descartado en H23) ni llave (V10).
- No se culpa a nadie de nada: no hay culpable de que una copia no se haya probado ni de que un sitio esté cerca.

**Solapes con vídeos y lecciones ya hechas:**

| Vídeo / lección | Qué cuenta | Qué solapa con V24 | Cómo se evita |
|---|---|---|---|
| V5b (sp4m10) | La mesa del 2-10 y el simulacro del 8-10; tarjetas «Tabletop: se habla, no se toca nada» y «Simulation: se ejecuta de verdad, con coste» (`plan:627-628`) | Los dos primeros escalones de la lista de pruebas | V24 los nombra en ~10 s cada uno, sin su caso (el correo a las 03:00, la suplente, el botón de aislar), con otra imagen y otra tarjeta; gasta el tiempo en paralelo y fail over, que V5b no toca |
| V5 (sp4m10) | Recuperar `srv-tc-app03`: tres copias, elegir la del 2-9, verificar | La copia y la restauración | V24 no elige copia ni dice dónde se restauró; la verificación sale solo en genérico; la tira de tres copias con hora de V5 (`s07-recovery.ts:22-26`) no se repite: V24 dibuja una cuadrícula de noches sin fechas ni horas |
| V1 (sp4m7) | Capas de defensa | Ninguno sobre recuperación; solo la palabra «copia» (la del tap) | No se usa |
| V2 (sp4m11) | «los backups» en el orden de volatilidad (`video/forense-adquisicion/narration.json:57`) | La palabra | Es evidencia forense, otro uso; no se menciona |
| V16 (sp3m4) | Fallo de un control: fail-open y fail-closed | «Al caerse» | Vocabulario separado (arriba); V24 habla de sitios y copias, no de controles en línea |
| sp5m4 (V26) | BIA, RTO, RPO, MTTR y MTBF; el RTO «fija qué solución de recuperación» (`sp/sp5-part2.ts:400`, `:406`) | El «sitio alternativo caliente» | Frontera arriba |
| sp4m10 (lección) | Tabletop, simulation y failover completo (`sp/sp4-part5.ts:363-377`) | Las mismas pruebas | Va después en el curso; V24 sigue la redacción de sp3m7 |

**Decisiones y alternativas descartadas:**

1. **Sin fecha.** Un plan de recuperación revisado sin día, como las pruebas de V21. Descartado: fechar en enero de 2027, que
   hereda las reglas de todo lo de noviembre y diciembre sin aportar nada a la lección (queda como opción, arriba), y colgar la
   revisión del comité del 27-11, que sería canon retroactivo.
2. **Tres conceptos: sitios (con la dispersión), pruebas (con foco en paralelo y fail over) y copia restaurada.** Descartado
   un cuarto, UPS y generator: tiene su pregunta (q6) pero la energía no lleva a ninguna imagen común con el resto y haría
   pasar la cápsula de 260 s. También descartado repartir las cuatro pruebas a partes iguales: V5b ya cuenta la mesa y el
   simulacro, y los escalones nuevos son los de arriba.
3. **Los servicios no tienen nombre.** Tres filas genéricas por su espera, no el sistema de atraques ni los manifiestos.
   Descartado nombrarlos: el de atraques es de V26 (con sus cifras) y los manifiestos ligan el vídeo a `srv-tc-app03` y a
   septiembre. A cambio, la historia pesa menos; la sostiene el teatro y BLIND ARCHITECT.
4. **La imagen es un teatro de reserva y un paraguas plegado, no el puerto.** Descartado el muelle alternativo (se confunde con la
   operación portuaria real y con V16), el piso de reserva (la casa de V5b), la cocina de reserva (V9) y la rueda de repuesto
   (no sirve para el paralelo, que es lo nuevo) y el paracaídas (nadie lo pliega cada noche ni lo prueba abriéndolo en el suelo, y suena a gravedad; H23).
5. **Tarea: el laboratorio Continuity Ladder, no las preguntas.** Porque el vídeo deja el orden a propósito. Descartado
   repetir la lista de activación en escena: es penalización L y el laboratorio ya la ejercita.
6. **Dónde va: después del tercer check.** Descartado antes de la nota de examen (llegaría antes del check de snapshots y
   réplica, que s05 toca).

**Riesgos para quien escriba el guion y para el revisor:**

- **«Hot» no es «el bueno».** Es el más rápido y el más caro; el warm es el equilibrio habitual y el cold, la opción más barata
  para lo que aguanta semanas (`:49-72`). La voz no dice que haya que tener hot.
- **Parallel no prueba el cambio.** Prueba que el respaldo funciona sin interrumpir; el cambio extremo a extremo es del fail
  over. El revisor debe buscar frases que le atribuyan al paralelo DNS, certificados o integraciones.
- **Simulation no mueve producción** (`:95`): V5b la presenta como «con coste»; V24 no dice que «cuesta» ni que «toca
  producción».
- **Tabletop valida el plan, no la tecnología.** Y se hace primero (q3), con el plan recién escrito.
- **«Verde» no es mentira.** La copia salió bien; lo que no prueba es que vuelva. La narradora no llama «falsa» a una copia.
- **Ninguna distancia en kilómetros.** No se dice «a 40 km ya vale» ni «hay que estar a más de» ni ninguna cifra: la dispersión es un principio (el mismo suceso alcanza a los dos), no una norma (H5).
- **El ejemplo de la copia que no vuelve** (`:203`) es un ejemplo: rotulado y sin fecha. La lección sí lo pone en el puerto
  (arriba, roce con V5); la voz de V24 no lo hace.
- **Nada es un hecho de Halden.** La mesa, el paralelo y el fail over son «lo que se
  haría»; ningún «se hizo». Y una prueba de fail over de verdad no se enseña ejecutada.
- **«Fail over» y «fail-open».** Ver léxico: Lidia las dice parecido y V16 las usa; el guion cuida que solo salga la primera.
- **Duración.** s02 lleva tres sitios, la dispersión y un mensaje en 48 s: si el borrador se pasa, se recorta primero el
  mapa de la dispersión (a media frase) y se deja el mensaje con su respuesta. s03 y s04 son la columna del vídeo: no se tocan primero.

**Comprobación de límites** (perfil `capsula-yt`; recuento con Node, `[...texto].length`, por un script que lee esta ficha):
- Duración: suma 210 s; render esperado 235–250 s, dentro de 190–260. Los extremos conocidos (0,89 y 1,22 veces la suma)
  dan 187–256 s: el alto cabe; el bajo queda 3 s por debajo del mínimo (esta cápsula no tiene consola, así que el
  extremo bajo es más plausible que en V20: si pasa, se alarga s04).
- 6 escenas en 3 capítulos (máximo 3). 3 conceptos (2–3).
- 4 tarjetas de examen (3–5), una por escena de s02 a s05, ninguna en la última; de 52 a 56 caracteres (máximo 58), sin
  `{}[]|<>`, flechas, marcas, viñetas ni emoji.
- 1 pregunta para pensar (exactamente 1), «Probar el cambio de DNS: ¿parallel o fail over?», 47 caracteres (máximo 48), `holdMs` 4500 (recontada tras H6).
- 2 mensajes interceptados (1–2), uno por capítulo (I y II), ninguno en la escena final; 62 y 62 caracteres (máximo 70; recontados tras H9 y H10);
  `holdMs` ~3800 (2500–4500); `video.json` lleva `"adversary": "BLIND ARCHITECT"`.
- `wordBudget` por escena (`s` × 2,7): s01 59 · s02 130 · s03 108 · s04 108 · s05 108 · s06 54 (total 567).
- Sin identificadores en la voz: ningún host, IP, dominio ni cuenta; `CPD` y `DR` solo en pantalla. Siglas en voz que
  necesitan léxico: DNS (ya fijada), BLIND y ARCHITECT (ya fijadas).
- El título entra antes de los 12 s (s01: una frase corta y el título).
- Efectos: `dark` (s01), `swap` (s04), `green` y `unusable` (s05) son cues de su escena y están en la biblioteca
  (`error`, `whoosh`, `check`, `block` en `eng/sfx/sfx.json`, `sounds`); ninguna clave en dos escenas.
- Recuento tras la revisión (script `check-v24-fix.mjs` del scratchpad, que lee esta ficha): tarjetas 56, 54, 52, 52;
  pregunta 47; mensajes 62 y 62; suma de `s` 22 + 48 + 40 + 40 + 40 + 20 = 210; `wordBudget` 59 + 130 + 108 + 108 +
  108 + 54 = 567. Ningún símbolo prohibido. La duración no cambia: ninguna escena cambia de `s` y el mensaje de s02
  tiene 4 caracteres más que el anterior (la concesión de la narradora cabe en el presupuesto de s02).

## Cambios de la revisión

Aplicados de `revision-secplus.md` (H1 a H33 son sus identificadores) y de `reconciliacion.md` (apartado V24):

- **H1 y reconciliación (almacén y foco):** el teatro warm lleva «escenario e iluminación listos» y el decorado «guardado en
  el camerino, sin montar»; las dos palabras se añaden a las que el guion no dice (junto a «temporal»).
- **H3 y reconciliación (cues):** `lights-out` pasa a `dark`; los cuatro cues de efectos comprobados contra `sfx.json`.
- **H5:** fuera la línea del «40 km» y el segundo centro de datos del puerto; el canon nuevo, las cifras, el apartado de
  lo que se queda fuera y los riesgos se corrigen en consecuencia. La alternativa, abajo, para Lidia.
- **H6:** pregunta «Probar el cambio de DNS: ¿parallel o fail over?» (47); la petición de s04 dice «con sus usuarios
  dentro» y no «carga real».
- **H9:** mensaje de s05 «¿Probar las copias? Si salen en verde, ya valen. Menos es más.» (62); canon: primer vídeo en
  el que BLIND ARCHITECT habla de copias y `reg:361` se actualiza al publicar.
- **H10:** mensaje de s02 «¿Un segundo centro lejos? Al lado replica mejor. Menos es más.» (62), con la concesión de la
  narradora; la latencia sale una frase, sin tarjeta.
- **H11 (opcional):** en la voz de s05, el snapshot es «el que vive en el mismo almacenamiento».
- **H12:** s01 deja el reloj sin pregunta («y mientras tanto, el reloj corre»); «cuánto tarda en volver» queda para V26.
- **H13 (la parte de F24):** fuera el «puede enlazar con el sitio caliente»; V26 no vuelve a hot, warm ni cold.
- **H21:** s05 dibuja una cuadrícula de noches sin fechas ni horas, no la tira de tres con hora de V5.
- **H22:** «una inundación» en lugar de «un temporal»; «temporal» a la lista de lo que no se dice.
- **H23:** el paracaídas pasa a un paraguas plegado en la entrada con su pegatina «revisado» (libre en el registro);
  cue `parachute` pasa a `umbrella`, y el icono de la tarjeta final también.
- **H31:** «once líneas» (párrafo de 4 y bloque de 7) en lugar de «unas trece».
- **H33:** anotado en el canon que «CPD» y «centro de datos» son lo mismo; la voz sigue diciendo «centro de datos».

**Pendiente para Lidia:**

- **Decide Lidia:** conservar o no el dato «el segundo centro de datos del puerto está a 40 km» al cierre de s02. Recomendada:
  no conservarlo (H5). Si lo conserva, con la frase de matiz «la lección no da una distancia mínima: lo que cuenta es qué
  suceso os alcanza a los dos»; hay que devolver el dato al canon nuevo, a las cifras y a la lista de riesgos.
- Que el revisor de naturalidad mire si «Probar el cambio de DNS» se lee como pregunta de verdad y no destripa la
  respuesta, y si el paraguas funciona mejor que el paracaídas.
- La voz de BLIND ARCHITECT no cambia (Helena + `megafonia`, `rate` −2): el revisor no dejó nada de voz para V24.

## Hallazgos no aplicados

Ninguno de los que citan F24 o V24. Los demás (H2, H4, H7, H8, H14 a H20, H24 a H30 y H32) son de V25 y V26. De H13 solo
se aplica la parte que corrige a F24; la que corrige a F26 va en la ficha de V26. H11 era opcional y se aplica en su forma
mínima (una nota para la voz, sin cambiar la regla 3 del cierre).
