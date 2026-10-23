# V44 · concienciacion-halden · notas del guion (sp5m8, perfil `caso-yt`)

Guion escrito a partir de `docs/superpowers/plans/fichas-tanda8/V44-sp5m8.md` (con los arreglos de `_revision.md` ya dentro de la
ficha: A-6, A-7, G-1, C-9, D-2). `video.json` sin `frozen` y sin `music` (se elige al montar). Sin adversario, sin `intercept`, sin
`think`.

## Cifras

- `build-timeline --estimate` (2,5 palabras/s): **0 errores, 3 avisos**, **317,8 s (5:17)** de estimado. Con la lectura de Lidia
  (~0,89 del estimado, ficha) salen **~283 s (~4:43)**; la ficha esperaba ~279 s. Ventana del perfil 240–330 s: dentro.
- Palabras leídas: **698** (presupuesto por escena, con las de pregunta a `(s - 8) x 2,7`: 670; la suma de la ficha, 735, cuenta las
  tres escenas de pregunta a `s x 2,7`). Por escena (palabras / presupuesto): s01 48/54 · s02 117/108 · s03 94/86 · s04 119/108 ·
  s05 81/81 · s06 104/103 · s07 76/76 · s08 59/54. Las cuatro que pasan lo hacen por 6-11 palabras; no se ha recortado más porque
  cada frase recortada era una de las respuestas (política y controles, diseño y formación, la respuesta a quien avisa).
- Título (`title`) dentro de los 12 s (sin aviso). 5 tarjetas de examen (3-5), una por escena como mucho, ninguna en s01, s05 ni s08,
  las de pregunta después de la trampa. 3 preguntas (claves B, C, A; trampas D, A, B). 0 think prompts, 0 mensajes interceptados.
- Los 3 avisos que quedan son los segmentos que **leen escenario y pregunta** (s03-01 con 63 palabras, s05-01 con 45, s07-01 con 37):
  la voz los lee enteros por diseño (engine README, «Pregunta de examen»); el aviso de «más de 26 palabras» no se puede evitar sin
  partir el escenario, que la ficha cuenta como un solo bloque. Ninguna frase pasa de 22 palabras.
- `canon-check`: 0 tokens (no hay equipos, IP, dominios, cuentas, horas ni fechas); `out/canon-refs.md` vacío. Comprobado a mano
  contra `glass-harbor.md`: «Compras», «Finanzas», «Sistemas» y «Seguridad» solo como áreas, sin personas (V32, V34, V36); «nóminas»
  aquí es lo que abre la cuenta de Compras y no tiene que ver con el pendrive «Nóminas 2027» de V36 ni con la llamada de «la directora
  de Compras» de V34; «comedor» y «farola» no están en el registro; la farola no dice «foco» (V21) ni «semáforo» (V31) y el inglés
  del instituto no dice «aula», «clase» ni «examen» (V32).

## Decisiones

- **Primera frase.** El puerto y la idea («la gente no es el eslabón más débil, sino la mayor red de avisos») en una sola frase;
  el título («Que la gente avise») abre el segundo segmento, antes de los 12 s.
- **Cada capítulo se anuncia** («Primero, por qué lo hizo», «Segundo, qué se mide», «Por último, para quién y cada cuánto»). Se
  añadió «Segundo, qué se mide» tras una primera versión sin ella (regla 4 de «Narración hablada»).
- **s02.** Las tres caras en «imagine» (voz: «Imagina tres avisos que llegan a Seguridad»), sin género («la primera», «la segunda»,
  «la tercera»), sin sanción ni investigación real y sin decir si la cuenta de Compras es robada. La voz da la respuesta de cada
  categoría en una cláusula (risky: política y controles; unexpected: se investiga; unintentional: diseño y formación). La frase de
  «aquí unintentional es un comportamiento, no un tipo de atacante» va al final, con el cue `not-actor` y la tarjeta 1 en `intent`.
  El cue `week` de la ficha pasa a `faces`: la voz no dice «semana» (rev8, C-9, para no repetir el marco de V35).
- **s03.** Primer «MEJOR». La voz lo glosa con otras palabras que V28 y que V45/V47 («Ojo con ese "mejor". Pide la que más encaja
  aquí, aunque otra también suene bien»), como pide rev8 G-4; la línea de pantalla sí es la de V28. Entra «En otra empresa» al
  principio del escenario para que nadie lo oiga como un hecho del puerto (decisión 3 de la ficha). La resolución dice lo que
  clasifica el examen: lo que decidió, no el daño; y vuelve la primera cara.
- **s04.** Las cifras de ejemplo (2 de cada 10, 1 de cada 10, 4 minutos) quedan solo en pantalla, como pide la ficha. Tampoco se dice
  «dos minutos» (la pantalla sí): la voz dice «una explicación en el momento». El motivo de no publicar nombres se dice en la voz
  («el castigo lo apaga»), no solo se afirma. La voz no repite la lista de señuelos crueles (despidos, nóminas, resultados médicos):
  «ninguno es cruel» y el resto en pantalla. La farola cierra la escena con la parte que importa: «Nadie contesta, y a la tercera
  dejas de avisar».
- **s05.** Sin «MEJOR» glosado ni línea (ya explicado). La farola vuelve en una línea sin «ayuntamiento» («Si para avisar hay que
  buscar un teléfono, la farola sigue apagada»): el ayuntamiento queda en la pantalla.
- **s06.** La imagen del inglés del instituto en una frase, con `recurring`; el camarero y el que negocia contratos vuelven en s07.
  La voz cita las cinco audiencias y deja los ocho temas del objetivo en pantalla («Los ocho temas, en pantalla»), sin leerlos.
  Sistemas dice «no dar un acceso que no han pedido ellos» (sin MFA, rev8 D-2).
- **s07.** La resolución separa la trampa («esa empresa ya repite») de la clave. La tarjeta «Cada audiencia, su riesgo» entra tras
  la línea del camarero.
- **s08.** Tres reglas cortas y la frase de la ficha (palabra por palabra, sin «todo el año», que la regla 3 ya dice) unidas a la
  tarea única, sin sp6, sin simulacro, sin flashcards. La tarjeta final y la tarea son un solo segmento (como V28/V30/V45).
- **Mismo cuidado con la voz.** Nada de siglas, IP, dominios, cuentas, ficheros ni cifras leídas. «OPSEC», «SY0-701» y «5.6» solo en
  pantalla. Emociones sin repetir en dos segmentos seguidos.

## Qué se quedó fuera (sigue en la lección, `sp/sp5-part4.ts`)

- La **dificultad progresiva** de las campañas y la **lista de señuelos crueles** (despidos, nóminas, resultados médicos): solo en
  pantalla en s04 (la lección: párrafo de phishing).
- **«Aunque fuera un falso positivo» con todas sus letras**: queda «Y contestar siempre, aunque fuera falso»; el nombre completo,
  en la pantalla.
- **Los ocho temas del objetivo** y los pasos del programa (development, execution, reporting and monitoring, revisión): s06 solo
  muestra los temas; el programa completo es de la lección.
- **«No se castiga a quien pica» como regla 2 completa**: la voz de s08 dice «avisar cuesta un clic, y se contesta siempre»; la
  pantalla lleva la regla entera de la ficha.
- Lo que la ficha ya dejaba fuera: el USB del aparcamiento y el chaleco (RED MARROW y V20), la administradora que descarga de noche
  desde otro país (UBA de V1/V20), las copias en los demás buzones como pregunta (`pl-sp5q12`; queda como paso del circuito), las
  cifras de la lección («45 %», «trescientas personas»), PAPER GOVERNOR y el caso de septiembre.

## Para la revisión

- **Exactitud 1 (ficha).** Pregunta 1: risky frente a unintentional. Para que el revisor vea una sola respuesta: la voz y la
  pantalla dicen que **aceptó el aviso** de que la extensión no estaba aprobada; lo involuntario es la fuga, no la decisión. Si aun
  así ve dos, el plan B de la ficha es «sabía que la política lo prohíbe».
- **Exactitud 2 y 3 (ficha).** «Un botón para avisar en el propio correo» sale de la lista del programa de la lección; la
  formación por audiencia, de la tabla y de la lista del programa (segmentar por riesgo).
- **«Mayor red de avisos».** Es la frase de la lección («tu red de sensores más grande»), dicha en llano.
- **Pronunciación.** El léxico propone respeladas (risky, unexpected, unintentional, behavior, initial, recurring, report, rate,
  phishing, click); la definitiva la fija la primera toma de Lidia. Se quitaron `OPSEC` y `acknowledgement` (no se dicen) para
  que no salte el aviso de léxico sin uso.

## Desviaciones de la ficha

- `youtubeTitle` queda **«Security awareness y phishing simulado»** (38): el validador no admite «|» y `youtube-meta` añade solo el
  sufijo de la pista; si se quiere el «CompTIA Security+ en español» de la ficha, hay que tocar el motor o el metadato al subirlo.
- Sin `lexicon.chatterbox.json` ni clave `lexicon` en `narration.json` (los otros vídeos la tienen para sintetizar con Chatterbox; con
  voz de Lidia no hace falta; se genera al sintetizar si algún día se necesita).
- Cue `week` renombrado `faces` (s02); cues `face-back`, `streetlight-back` y `english-back` para las tres vueltas de las
  resoluciones.

## Revisión 2026-10-23

Informe: `docs/reviews/2026-10-23-guiones-tanda8/concienciacion-halden.md` (0 bloqueantes · 10 CORREGIR · 7 OPCIONAL). Se mantienen los ids de
segmento y todos los cues; `frozen` sin poner.

**Aplicados (CORREGIR):**
- **A-1** (plan B de la ficha, como recomienda el informe): escenario «la política que prohíbe» + «acepta la advertencia»; `why`/`trapWhy` con
  «advertencia»; voz de s03-01 (con la glosa nueva de «mejor», B-8), s03-02 (criterio: sabía que no estaba permitida; se clasifica lo que
  decidió) y s03-03; tarjeta «Saltarse una advertencia a sabiendas es risky». Clave B, trampa D sin cambios. La storyboard de s03 no
  llevaba «aviso» en el goal; no hubo cambio.
- **A-2** s08-01: «si lo sabía, es risky, y si no encaja, se investiga». La tarjeta de s02 y la frase final se dejan (alternativa del informe no usada).
- **A-3** escenario de la pregunta 2: «porque reconocen el señuelo» (clave C, trampa A sin cambios).
- **A-4** s06-03 «no aprobar accesos que no han pedido ellos» y goal de s06 «no aprobar peticiones de acceso que no has pedido tú» (sin MFA).
- **A-5** s04-03: «El que hay que subir es el segundo…».
- **B-1** «casos» (s02-01, goal de s02) y «el primero/segundo/tercero» (s02-02..04, y «a los tres» en s02-05); «advertencia» en s03.
- **B-2** s04-01 explica el phishing simulado y «Nada cruel, a propósito».
- **B-3** s04-04 sin jerga («alguien lo revisa»), s04-05 con «ayuntamiento».
- **B-4** s06-03/04: solo Finanzas y Sistemas en voz; las otras tres audiencias y los ocho temas, en pantalla.
- **B-5** s07-03 «el inglés del instituto… negociar un contrato» (goal de s07 igual); s07-02 con «por otro canal» (cierra también A-7, segunda viñeta).

**Aplicados (OPCIONAL, sin coste de palabras):** A-6 (s02-05 «no un tipo de insider», y el rótulo `not-actor` del goal igual), A-7 (escenario en pantalla de
la pregunta 3, «Los resultados mejoran en todas las áreas menos en Finanzas…»; la voz de s07-01 igual), A-8 (opción B de la pregunta 2 «Una
sanción a quien no avise»), B-6 (s01-02), B-7 (solo s05-02 y s07-01), B-8 (glosa de «mejor» y «parece lo lógico» en s05-02).

**No aplicados:** A-7 primera viñeta (sustituir la opción C de la pregunta 3: no hay error, la voz no la comenta); B-7 s01-01, s06-02 y s08-03, y B-9
(suman palabras en escenas que ya pasan del presupuesto; ninguno es un error).

**Decisiones propias:** (1) conflicto A-1 / B-1 en «aviso»: se usa «advertencia» para lo del navegador y «caso» para lo que llega a Seguridad,
«avisar» queda solo para reportar. (2) Para la duración se quitó del final de s06-04 la frase de los ocho temas (primer recorte de la ficha) y
el cue `topics` pasa al principio del segmento; sin esto el estimado era 365 s. (3) Dudas del autor: exactitud 1 resuelta con A-1; exactitud 2 y 3 válidas
(sin cambio); «mayor red de avisos» correcta.

**Cifras tras la revisión:** `build-timeline --check --estimate`: 0 errores, 805 palabras (contadas por el validador, que incluye escenario y pregunta;
antes 698 leídas por el recuento manual), **360,6 s estimados**; con la lectura de Lidia (~0,89) **~321 s**, bajo los 325 de la ficha pero con poco margen
(a 0,93 serían ~335). El validador avisa «total length 06:00 fuera de 04:00–05:30» (antes 317,8 s: sin aviso). Si hay que bajar, siguiendo la ficha:
la farola de s04 (s04-05 y `streetlight-back` de s05-03) y la tercera cara de s02 (queda el rótulo). `canon-check`: 0 tokens, `canon-refs.md` vacío. Quedan los
avisos «N words (10–26)» (los de pregunta, esperados, y los de resolución/explicación de s02, s03-02, s04, s06-03, s07-02) y «sentence of 23 words»: ya no.
**Pendiente de lección/PR:** ninguno exigido por el informe como corrección; solo la incoherencia de temario ya señalada (sp2m1 `:95` pone el USB del aparcamiento como
insider no intencional; sp5m8 q6 `:539-552` como risky) y la simplificación «la clave es la intención» de la lección (`sp5-part4.ts:351`, `:441`), que no cubre unexpected.

### Recorte de duración (misma revisión, 2026-10-23)

El estimado tras aplicar la revisión era 360,6 s (fuera de 240–330 s). Recortes, en el orden pedido, conservando A-1..A-5, las tres preguntas y sus resoluciones:
- Frases de suavizado (OPCIONALES y B-*): s01-02 («Hoy,» fuera), s02-02 («de trabajo»), s04-01 (phishing simulado en una cláusula), s04-04 (sin «luego… lo quita de los demás buzones»,
  queda en pantalla), s06-03/04 (solo Finanzas y Sistemas en voz; las otras tres audiencias y los ocho temas, en pantalla, con `topics` al inicio de s06-04), s07-01 («de concienciación» fuera).
- **La farola, quitada** (s04-05 y s05-03 borrados; cues `streetlight` y `streetlight-back` fuera de `requiredCues` y de los goals; la tercera icono de s08 pasa de «la farola» a «el botón de avisar»).
  Con ella se va «ayuntamiento» (B-3 s04-05). s04-04 y s05-02 suben su pausa final (500 y 1000 ms).
- s03-03 sin «Los dos sabían que no se podía» (queda en la pantalla de `face-back` y en la tarjeta) y s02-05 «Y ojo, es un comportamiento, no un tipo de insider» (A-6 más corto).
- Sin tocar: la tercera cara de s02.
Resultado: **722 palabras, 326,8 s estimados** (~291 s con la lectura de Lidia a 0,89), 0 errores, sin aviso de ventana. Registro de canon: la farola ya no es una imagen de V44 (V45 y V48 la tenían declarada como ocupada; pueden usarla).
