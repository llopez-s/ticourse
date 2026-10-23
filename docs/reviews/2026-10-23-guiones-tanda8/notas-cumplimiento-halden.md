# V43 · cumplimiento-halden (sp5m6) · notas del guion

Guion de la cápsula de casos «Mirar antes, cuidar después y borrar a tiempo», escrito el 2026-10-23 desde la ficha
`docs/superpowers/plans/fichas-tanda8/V43-sp5m6.md` (aprobada el 2026-10-17). `video.json` va **sin `frozen`**: lo pone
quien congele tras las revisiones de exactitud y naturalidad. Sin adversario, sin mensajes interceptados, sin think prompts.

## Cifras

| | Ficha | Guion |
|---|---|---|
| Escenas / capítulos | 8 / 3 | 8 / 3 |
| Suma de `targetSec` | 270 s | 270 s |
| Palabras habladas (sin cues ni emoción) | 729 (s × 2,7) o 665 con las escenas de pregunta a (s − 8) × 2,7 | **714** |
| `build-timeline --estimate` (2,5 palabras/s, con pausas y cuentas atrás) | ventana 240–330 s | **326,4 s (5:26)** |
| Lectura real de Lidia (~0,89 del estimado, medido en V28: 297,6 estimado, 264,2 renderizado) | ~276 s (4:36) | **~290 s (~4:50)** |
| Cue `title` | antes de los 12 s | 11,4 s estimado (~10 s a su ritmo); `promise` a 13,4 s |
| Tarjetas de examen | 5 | 5 (s02, s04, s05, s06, s07; 43 · 43 · 43 · 38 · 48 caracteres) |
| Preguntas | 3, escenario 152 · 147 · 140, q 41 · 40 · 32 | igual; `why` 70 · 65 · 68, `trapWhy` 72 · 77 · 71; opciones de 5 a 21 |

Palabras por escena frente a `wordBudget` (s01 50/54 · s02 108/108 · s03 91/86 · s04 117/108 · s05 80/76 · s06 121/103 ·
s07 82/76 · s08 65/54). El estimado queda cerca del techo (330 s), como V47 (329,5) y a diferencia de V28 (297,6); el recorte, si
Lidia lee más despacio de lo previsto o hace falta margen, se hace **en este orden**: la peluquería de s04 (`salon`, queda
en pantalla), la línea del reporting de s04, el archivador de s06 (se queda su vuelta en s07) y, en s08, la frase final.

## Avisos que quedan

`build-timeline --estimate` da **3 avisos**, los tres «segmento de más de 26 palabras» en el segmento de la pregunta (s03-01 53,
s05-01 35, s07-01 32): el motor pide que la voz lea escenario y pregunta de una vez antes de la cuenta atrás (V28 y V47 tienen
los mismos). Ningún aviso de emoción repetida, `;`, `:` como conector, identificadores, preguntas con la misma palabra ni de
cues demasiado juntos. `canon-check`: 0 coincidencias (el guion no dice ningún equipo, IP, dominio, cuenta, hash, hora ni
caso con historia), `out/canon-refs.md` vacío.

## Decisiones de escritura

- **Voz con «sanctions» siempre en inglés** (decisión 5): no aparece «sanción» ni «sanciones» en ningún segmento. «Multa»
  sí sale en la voz, para las fines y para decir lo que la sanction *no* es. Solo en pantalla: «SY0-701» y «5.4».
- **Qué se lee y qué no.** Las cinco preguntas del puerto (s02), las cuatro rutinas, las cinco consecuencias y la línea de la
  conservación van en pantalla; la voz dice tres o menos de cada lista (regla 8). Solo en pantalla: «formar a quien llega al
  mostrador», «con plazo» del reporting externo, el ejemplo de los buques que no atracan (loss of license), «ni menos que la ley,
  ni más que el para qué» (retention) y «el borrado se explica a la persona». El `why` de pantalla y la voz de la resolución
  no se repiten palabra por palabra (la voz da el porqué en llano; la pantalla, la regla).
- **Escenarios hablados más completos que los de pantalla**, como en V47: el panel recorta para caber en 160 caracteres.
  La voz de la pregunta 2 dice «presentarse a concursos públicos durante dos años» y «no le pone multa»; el panel, «ir a
  concursos públicos dos años» y «Sin multa».
- **Calificadores.** «MEJOR» con la frase de V28 solo en s03, antes de la cuenta atrás, en el mismo segmento de la pregunta
  (así lo hizo V28); s05 sin calificador; s07 solo resaltado, sin glosa. Correctas A, D y C; trampas C, A y B.
- **Imágenes** (las tres, rotuladas «imagen · no es del puerto» en pantalla): el gato (s02, vuelve en s03 y en s08), la
  peluquería (s04, solo se nombra una vez; los cinco rótulos del puerto cargan la explicación) y el archivador (s06, vuelve
  en s07 y en s08). No se dice «cajón» (V38) ni nada de la cafetería de V26.
- **Casos fuera del puerto en las preguntas** (decisión 3): «una empresa» y «una empresa de mensajería», sin nombres ni países.
  El supuesto de s04 es «Imagina que el puerto se saltara las reglas»; los cinco rótulos van con «supuesto · sin efectos».
- **Las tarjetas de las escenas de pregunta** (s05, s07) cuelgan de la última línea, después de `trap-N`; la de s02 cuelga
  de `cat-rule`, la frase del gato, para que el ejemplo vaya antes que la regla; la de s06 cuelga de `inventory`, y la de s04 de
  `contract`. El motor exige que el cue de una tarjeta quede a 5 s o más del final de su escena (`holdSec`): por eso s05 acaba con
  una línea de dos oraciones y 1000 ms de pausa.
- **Cues.** La ficha enumera `options` y `pause` en las escenas de pregunta; los `storyboard.json` ya congelados de V28 y V47 no
  los llevan (los pone el motor) y aquí tampoco. Se añadieron cues de anclaje que la ficha no nombra: `cat-rule` (s02),
  `cat-back` (s03), `regulator` (s05) y `drawer-back` (s07).
- **`video.json`.** `youtubeTitle` es «Due diligence, due care, sanciones y privacidad»: `youtube-meta` le añade « | Security+
  SY0-701 en español» y suman los 78 caracteres de la ficha (en el título de YouTube sí va «sanciones»: es como se busca). Sin
  `music` (la ficha dice «a elegir al montar, otra que la de V28 y las de la tanda»; `render --master` se para sin ella). El
  bloque de la lección y la tarjeta final se titulan «Mirar antes, cuidar después y borrar a tiempo» (45), el `title` del
  storyboard.
- **Léxico.** `lexicon.json` y `lexicon.chatterbox.json` van vacíos (`{}`), como los de V28: no hay siglas ni palabras en
  mayúsculas que la voz pueda leer mal; los doce términos ingleses nuevos (due diligence, due care, fines, sanctions, reputational
  damage, loss of license, contractual impacts, data inventory, retention, right to be forgotten, legal hold, data subject) los
  recoge después la primera toma de Lidia. `narration.json` apunta a `lexicon.chatterbox.json` como en los ejemplos.

## Qué se quedó fuera (sigue en la lección)

- **Attestation y acknowledgement** (`sp/sp5-part3.ts:342`, q6): son de V39 (sp5m7). Solo salen como opciones de la pregunta 1.
- **Controller y processor** (`:368`, q2, q3): de V41. Aquí solo la data subject.
- **Monitorización interna y externa y automatización** (`:342`): sin sitio. **Los tres niveles legales** (`:368`): ídem.
- **El callout del puerto** (`:389-394`, la revisión tras la filtración): no se usa ni se contradice (decisión 2).
- **El plazo en horas de las notificaciones y el carácter declarativo del reporting externo** (`:287`): de la lección; la voz
  solo separa a quién va cada reporting.
- **El ejemplo biométrico de la tabla** (`:305`) y **las tripulaciones**: la sanction de s04 es «parar el registro hasta
  corregirlo»; la pregunta 2, los concursos públicos.

## Dudas de exactitud para el revisor

1. **Sanctions frente a fines** (duda 1 de la ficha): la pregunta dice «sin multa» para cerrar la lectura en que las sanctions
   incluyen las multas, y la voz remata con «una sanction restringe, no multa». Comprobar contra el PDF oficial de SY0-701 y
   contra `fcp524`.
2. **«Borrar lo que caduca» como rutina de due care** (s02 y pregunta 1). La lista de la lección (`:342`) trae parchear, revisar
   accesos, formar y arreglar lo hallado; el borrado está en la retention (`:372`). La ficha lo pone en la due care («borrar
   cuando toca») para no repetir las rutinas de q1 (`rev8`, B-2). En s06 el mismo borrado es la retention: si el revisor
   ve ahí un solape, la pregunta 1 puede quedarse solo con «corrige lo que salió en la revisión» y «nadie vuelve a mirar quién
   tiene acceso», que sí están en la lista.
3. **Due care como «lo de después»** (duda 2): la voz dice «seguir haciéndolo bien, de forma continua» y la pregunta lleva
   «MEJOR»; hay materiales que llaman due diligence también a la vigilancia continua.
4. **«Dos años» y «doce años»** (preguntas 2 y 3) son cifras de ejemplo de la ficha, no de la lección; la 3 compara la política
   propia con lo guardado, no con una ley.
5. **La peluquería en la voz** nombra tres de las cinco consecuencias (multa, prohibición de tintes, reseñas); la licencia y el
   contrato de la marca de champú de la ficha solo salen en pantalla, para no pasar de tres elementos en una frase.

## Canon nuevo que fija V43 (para el registro, al cerrar)

El registro de objetos perdidos de la terminal de pasajeros (cuaderno que pasa a un sistema; nombre, teléfono y documento de quien
reclama; tres sitios: el sistema, su copia y el aviso a quien reclama), propuesta sin fecha; sus cinco preguntas de antes y
sus cuatro rutinas de después (sin plazos en meses en la voz); el supuesto de s04 «Imagina que el puerto se saltara las reglas»;
las tres imágenes (gato, peluquería del barrio, archivador de casa); y los tres escenarios de pregunta (aplicación con
análisis legal impecable, empresa de mensajería sin concursos, currículos de doce años), que no fijan nada.

## Revisión 2026-10-23

Informe: `docs/reviews/2026-10-23-guiones-tanda8/cumplimiento-halden.md`. Se aplicó con el texto sustituto del informe; ids de
segmento y cues conservados, `frozen` sin poner. Tras la revisión: **721 palabras, 329,0 s (5:29) en `--estimate`** (ventana
240–330 s; lectura real prevista ~0,89 × = ~293 s). `build-timeline --check --estimate`: 0 errores, 3 avisos (los de siempre,
«N words» en s03-01 55 · s05-01 35 · s07-01 32). `canon-check`: 0 coincidencias.

**Aplicados.** A-1 (BLOQUEANTE: el borrado sale de la due care; rutinas «revisar quién entra · poner el sistema al día · arreglar
lo de la revisión» en `s02-05`, rótulo `routines` del storyboard, voz y escenario de `s03-01`, `s03-02`), A-2 (legal hold
explicado en `s06-05`), A-3 (`why` de la pregunta 3), A-4 (`s05-04` invertido), B-1, B-2, B-3, B-4. Opcionales aplicados por
no costar palabras o ser claramente correctos: A-5 (empresa de «transporte», voz y escenario), A-6 (solo el `why` de la
pregunta 2: «Restringe una actividad sin quitar la licencia: es una sanction»; la voz de `s05-02` no se toca), B-9 en `s03-02`
(«Ojo con la due diligence, que esa ya se hizo, y bien»), `s04-03` («y eso es la loss of license») y `s07-03` («confunde»), B-10
completo (tarjeta s02 y voz «te libra»; tarjeta s07, `s08-04` y storyboard `rule-3`/`phrase` con «propósito»). Storyboard:
también «parar el sistema» (B-1) y «cancela el contrato» (B-2) en los rótulos para que cuadren con la voz.

**No aplicados.** A-7 (se aplicó y se revirtió: costaba 3 palabras y el estimado estaba por encima del techo; el contexto
ya lo sitúa como propuesta), B-5, B-6, B-7, B-8, B-11 (suman palabras), `s05-03` de B-9 (suma 2). 

**Recortes por duración** (el cambio obligatorio dejó 344,0 s; orden del informe, y lo mínimo imprescindible): se quitó la
voz de `s04-06` (el reporting queda en el chip de pantalla; el cue `reporting` pasó a `s04-07`, después de «Sanidad la multa»
y tras `salon`, y `requiredCues` de s04 se reordenó y el `goal` lo dice); `s02-03` pierde «Mirar antes de saltar» (sigue en el
rótulo de pantalla); `s06-01` pierde «que se le manda» (queda «el aviso»; el rótulo de pantalla lo completa); `s06-05` queda en
«Con un legal hold, una orden de guardar por un juicio, tampoco» (sin «Lo demás sí se borra», que dice `s06-03`); `s05-04`:
«mira quién la impone, que aquí es el regulador»; `s06-06`: «Como en tu archivador». Margen final: 1 s bajo el techo. Si
Lidia lee más despacio o se quiere margen, siguen por orden: peluquería (`s04-07`, el cue `salon` habría que anclarlo en
otro segmento), archivador de `s06-06` y la frase final de s08.

**Decisiones de las dudas del autor.** 1: se queda (sanctions frente a fines, con la reserva de no haber abierto el PDF).
2: resuelta, el borrado es solo de la retention. 3: se queda. 4: cifras de ejemplo aceptadas. 5: correcto.
La pregunta 1 queda como espejo declarado de `sp5m6q1` (accesos, parches, formación, hallazgos; clave due care, trampa due
diligence): lo que la lección asigna a la due care ya está en `q1`; el vídeo la plantea en negativo con el análisis legal ya
hecho y no entra en el banco.

**Pendiente fuera del guion (sin hacer).** Actualizar `docs/superpowers/plans/fichas-tanda8/V43-sp5m6.md` (líneas 77, 86, 100,
107, 113: «borrar cuando toca / borrar lo que caduca» como due care, escenario de la pregunta 1, y «Banco más cercano») y
alinear la ficha con los cambios opcionales (transporte, propósito, libra). Ningún cambio de lección ni de PR.
