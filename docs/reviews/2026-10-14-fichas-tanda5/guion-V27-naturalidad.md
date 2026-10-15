# V27 · reglas-aeropuerto · revisión de NATURALIDAD del guion

Revisado: `video/reglas-aeropuerto/narration.json` (borrador sin congelar, 567 palabras, estimado 259,5 s) y
`public/videos/reglas-aeropuerto-transcript.txt`, contra las doce reglas de «Narración hablada», «Menos conceptos, mejor
contados» y «Claridad y ritmo» (`docs/superpowers/plans/2026-09-25-lesson-videos.md:44-211`), la ficha «V27 · s5m3»
(`:5633-6090`) y el tono de V7 (`video/attack-piramide/narration.json`). He leído también `guion-V27-exactitud.md` para no
contradecirlo: adopto sus dos arreglos de voz (`s04-05` «dos eventos» y `s04-10` «quizá no. Esta, sí») y su nota sobre `s03-05`.

Recuentos hechos con el mismo criterio que el estimado (sin `<…>` ni `{…}`; `[250 KB|…]` cuenta el lado escrito): el
original da 567, igual que `script-notes.md`.

## Lo más importante

1. **La imagen del aeropuerto desaparece después de `s02`.** La tarjeta de embarque y el pasaporte se presentan en `s02-03`
   y no vuelven nunca: `s04` lo cuenta con «nombre original, el de dentro», «nombre de siempre» y «nombre del fichero», `s05`
   con «otra herramienta» y «el nombre normal», y el cierre «Hasta el próximo control» llega sin imagen a la que agarrarse (regla
   6). La propuesta mete la tarjeta (= el nombre del disco) y el pasaporte (= el nombre de dentro, el original) en `s04-02`,
   `s04-04`, `s04-05` a `s04-10` y `s05-04`, y la maleta en `s05-03`. Con eso cada concepto se dice dos veces, una con la imagen
   y otra con palabras llanas, y el remate final funciona.
2. **`s04` no se sigue de oído por los referentes, no por el tiempo.** La regla B se llama «la de la lección», «la otra» y
   «esta»; la A, «una regla que solo mira el nombre del fichero» y «la sencilla»; «otro nombre» vale para el evento 2 y también
   para el 3; la voz anuncia «tres eventos» con dos en pantalla y luego «un tercero»; y nunca dice que la A busca *ese* nombre
   (el del evento 2), que es lo que da sentido a la pregunta. Además, de `s04-05` a `s04-08` hay cuatro etiquetas del registro
   Cálido seguidas.
3. **«Cadena» con dos sentidos.** En `s03` y `s06-02`, «cadena» es un string; en `s05-05`, «la cadena entera» es la cadena de
   procesos. Por oído son lo mismo. La ficha ya proponía para la voz «la regla del árbol de procesos, la que ya viste».

## Segmentos a reescribir

Cada cue sigue en el mismo momento de pantalla. Cuando cambia la palabra que lo lleva, lo digo en la columna «Problema».

| id | Problema | Regla | Propuesta | ± |
|---|---|---|---|---|
| s01-01 | «Un dominio, una dirección, un hash.» es una frase sin verbo, como un rótulo. Con puntos suspensivos los tres pasan a ser el sujeto de «caducan», y queda una sola frase hablada | 1, 12 | `<curious> {pile}Un dominio, una dirección, un hash… caducan enseguida. {soc}Y el SOC te pide algo que dure.` | 0 |
| s01-02 | «Qué mira cada una, cuándo salta de más y qué la rompe.» suena a una diapositiva leída, sin verbo. Nombrar YARA y Sigma en el título antes de explicarlos se acepta, porque lo pide la promesa y V7 hizo lo mismo con ATT&CK | 1 | `<confident> {title}Dale dos reglas, de YARA y de Sigma. {promise}Verás qué mira cada una, cuándo salta de más y qué la rompe.` | +1 |
| s02-06 | «Cada una se escribe a su manera» no aporta nada y el presupuesto va justo. Con «Empezamos por la de dentro» basta para anunciar lo que viene | 8, presupuesto | `<casual> Empezamos por la de dentro.` | −7 |
| s03-01 | Contesta al mensaje con una pequeña lección y no suena a réplica. Un «Depende.» delante lo convierte en respuesta a «Qué fácil». `reply-word` pasa a «Depende» (inicio del segmento) | 11 | `<mischievously> {reply-word}Depende. Una palabra corriente salta con todos. Una que solo lleva su programa, esa sí puede ir sola.` | +1 |
| s03-02 | «Esta es la regla. El contexto, meta. Lo que busca, strings…» son acotaciones. Los pares castellano/inglés los prescribe la ficha (`:5709`) y se quedan, pero con un anuncio delante («tiene tres partes») pasan a ser una enumeración hablada. Además, «cadena» no se había dicho nunca y `s03-03` la usa: aquí queda definida. `rule` sigue al principio | 1, 3 | `<focused> {rule}La regla tiene tres partes. {meta}El contexto, meta. {strings}Las cadenas que busca, strings. Y la condición, condition, que decide.` | +2 |
| s03-04 | «como las otras dos»: de oído no se sabe cuáles son, y luego `s03-06` dice «las otras tres», así que se oyen «otras dos» y «otras tres» seguidas. En pantalla `$pipe` y `$op` van justo después de `$api`, así que «las dos siguientes» señala lo que se ve. No las llamo «corrientes», porque el pipe no lo es (`s5.ts:520`; nota de exactitud) | 4, 12 | `<clear> {tags-company}Así que pide compañía, como las dos siguientes. Dos juntas hacen mucho menos ruido.` | 0 |
| s03-05 | El término llega antes que la idea: primero «la ruta del PDB» y después qué es. Le doy la vuelta. Y «Casi nadie la lleva» pasa a «Casi nadie lleva esa» (nota de exactitud: las rutas de PDB no son raras, lo rara es *esta*) | 3 | `<thoughtful> La única que va sola es una ruta que a veces queda escrita al compilar, la del PDB. Casi nadie lleva esa.` | 0 |
| s03-06 | «La condición. Que sea un ejecutable. Que pese…» son tres fragmentos sin verbo. Queda en dos frases con verbo. `cond-size` pasa a «de menos de» (es la misma línea) | 1, 8 | `<steady> {cond-mz}La condición pide un ejecutable {cond-size}de menos de [250 KB\|doscientos cincuenta kilobytes]. {cond-or}Y luego, la ruta del PDB o dos de las otras tres.` | −2 |
| s04-01 | «parte a parte» es telegráfico (duda 4 de las notas). «Qué ve» repite el «no lo verá» del mensaje y suena a réplica sin contestarle todavía, que es lo que pide la ficha. También aligera | 11, 8 | `<casual> {reply-m2}Pues vamos a ver qué ve {sigma}la regla de Sigma.` | −3 |
| s04-02 | Vuelve el pasaporte, la idea antes que el nombre: «nombre original» se dice en `s04-09`, después de la imagen. «Habla de procesos» pasa a «Mira los procesos». `selection` pasa a «Y busca» | 6, 3 | `<focused> {logsource}Mira los procesos que arrancan en Windows. {selection}Y busca que su pasaporte, el nombre de dentro, sea certutil.` | +1 |
| s04-03 | «Con la bandera de decodificar o la de descargar.» es un fragmento. Ahora sigue a «busca que… y que…». La pantalla enseña las banderas | 1 | `<clear> {flags}Y que lo lancen para decodificar o para descargar.` | 0 |
| s04-04 | «Con su nombre de siempre» choca con «nombre original»: los dos son «certutil» y no se sabe cuál es cuál. Aquí se nombra la tarjeta (= el nombre del disco, el término de `s06-03` y de la ficha). «La condición, lo que busca menos lo que filtra» no tiene verbo | 1, 6 | `<thoughtful> {filter}Si la tarjeta, el nombre del disco, también dice certutil, el filtro lo descarta. {cond}Y la condición resta lo que filtra.` | +3 |
| s04-05 | «tres eventos» cuando en pantalla hay dos (`ev-legit`, `ev-renamed`; el tercero entra en `ev-new`), y «un tercero» acaba sonando a cuarto (lo mismo dice exactitud). Cuidado, porque el `goal` del storyboard dice «Tres eventos»: el texto de pantalla no debe anunciar tres en este momento. «El de otro nombre» se confundía con el evento 3. `ev-renamed` pasa a «El de la tarjeta» | 12 | `<engaging> {ev-legit}Mira dos eventos de ejemplo. {ev-renamed}El de la tarjeta cambiada sí avisaría.` | 0 |
| s04-06 | «Al lado… Enfrente…» son acotaciones de plano. Tampoco dice que la A busca *ese* nombre, el del evento 2, y sin eso la pregunta no se entiende de oído. Emoción `curious` → `steady`, para cortar los cuatro Cálidos seguidos (s04-05 a s04-08). `rule-a` pasa a «Una regla» y `rule-b` a «La otra» | 1, 10 | `<steady> {rule-a}Una regla solo mira la tarjeta, y busca ese nombre. {rule-b}La otra es la de la lección.` | +1 |
| s04-07 | Con «dos eventos», «un tercero» ya cuadra. «Otro nombre cualquiera» pasa a «una tarjeta nueva», que es la hipótesis de la tarjeta «Otro nombre de fichero». Es una pregunta de verdad y no se contesta sola (ver la nota sobre la pregunta) | 7, 6 | `<intrigued> {ev-new}Imagina un tercero, con una tarjeta nueva. ¿Cuál de las dos sigue saltando?` | 0 |
| s04-08 | Se repite «el nombre del fichero» y aparece una tercera etiqueta para la A, «la sencilla». Se queda «la otra». `miss` pasa a «y la otra» | 6, 12 | `<confident> {answer}La de la lección. La tarjeta la cambia el atacante cuando quiere, {miss}y la otra ya no lo ve.` | −2 |
| s04-09 | «La otra sí» chocaba con el «la otra» de s04-08, que ahora es la A. El motivo llega con la imagen y el término en su orden (pasaporte → nombre original). `hit` pasa a «Pero» (el sfx `check` cae al empezar el motivo) | 3, 6 | `<firm> {hit}Pero el pasaporte, el nombre original, va dentro del programa, y renombrar no lo toca.` | −1 |
| s04-10 | La réplica llega nueve segmentos después del mensaje y no se oye como respuesta a él. Además, «quizá. Esta, no» se puede entender al revés (exactitud, arreglo 2). Si se repite su frase en pregunta, se ve a quién se contesta. La pausa de después, de 450 a **550** ms: es remate de escena | 11, 10 | `<warm> Ni el filtro la frena. ¿Que no lo verá? La de la tarjeta, quizá no. Esta, sí.` | +1 |
| s05-02 | Es la frase de la tarjeta y repite «SIEM». Sirve para ahorrar palabras sin perder nada | 8, presupuesto | `<clear> {sigma-runs}Sigma no corre en el SIEM tal cual. {convert}Antes se traduce a su consulta.` | −2 |
| s05-03 | «¿Dónde corre…? YARA, en…» (s05-01) y «¿Y qué las rompe? La de YARA…» encadenan la fórmula «¿Y X? Pues Y» dos veces en tres segmentos. Esta pasa a ser una afirmación. Vuelve la maleta. `breaks` pasa a «Las dos» | 7, 6 | `<serious> {breaks}Las dos se pueden romper. {breaks-yara}La de YARA vive mientras la maleta lleve esas piezas.` | +1 |
| s05-04 | «A la de Sigma, otra herramienta.» es elíptico, con el verbo un segmento atrás. Ahora el verbo va en la primera frase y la segunda lo sobreentiende, como se habla. El pasaporte vuelve. **«Otro pasaporte» va solo a propósito:** su gemela llana es la frase siguiente (s05-05, la de s2m5q8, intocable), y si las dos dicen «otra herramienta» es el mismo remate dos veces. «Con el nombre normal» se queda, porque es el hueco del filtro (exactitud, arreglo 4) | 1, 4, 6 | `<focused> {breaks-sigma}A la de Sigma la rompe otro pasaporte. {breaks-filter}Y a su filtro, una copia con el nombre normal en otra carpeta.` | +2 |
| s05-05 | «la de la cadena entera»: aquí «cadena» es la de procesos, y en s03/s06 es un string. Uso la forma de voz de la ficha. «Que ya viste» se queda (es el puente con V7, decisión 8a). El chip de pantalla puede seguir siendo «la cadena entera» | 6, 3 | `<thoughtful> {ladder}Si cambia de herramienta, {limit}la del nombre original ya no ve. Queda la del árbol de procesos, que ya viste.` | 0 |
| s05-06 | El «o sea» llega después de la acción y el cierre queda al revés. Así cierra el capítulo con su «o sea, que…» y termina en la acción. `loop` y `wrap-ii`, en las mismas palabras. La pausa, de 450 a **550** ms | 4, 10 | `<steady> {loop}Ninguna es para siempre. {wrap-ii}O sea, que cada una tiene su punto débil, así que mide si dispara.` | +1 |
| s06-01 | En un vídeo de reglas, «Llévate tres reglas» se oye como tres reglas de detección. V7 decía «Apúntate tres cosas». Ojo: el título de la escena es «Tres reglas» (pantalla). Si se quiere coherencia, que pase a «Tres ideas» o que se quede, porque leído no confunde | 12 | `<warm> {recap}Llévate tres ideas. {rule-1}YARA mira dentro. Sigma mira lo que pasa, y se convierte antes de correr.` | 0 |
| s06-02 | «salta con medio mundo» repite tal cual el remate de s03-03. En el resumen va con otras palabras (regla 4). La de s03 no se toca, porque la ficha la protege | 4 | `<clear> {rule-2}Una cadena corriente, sola, salta con cualquiera. Pídele compañía, o una pieza única como el PDB.` | −1 |
| s06-03 | «Mira lo que cuesta cambiar» se puede oír como «fíjate en». Y «mide si dispara» repite tal cual el final de s05-06. Uso el verbo de la ficha («Apóyate», cierre n.º 3). Los términos llanos se quedan, porque es la regla de examen | 4, 9 | `<confident> {rule-3}Apóyate en lo que cuesta cambiar, el nombre original y no el del disco. Y vigila si salta.` | +1 |

**Pausas:** `s03-07`, `s04-10` y `s05-06`, de 450 a 550 ms (regla 10: 500–700 ms tras un remate). Suman +0,3 s.

**Opcional, sin coste:** `s02-04` «Una que **lee** lo que ha pasado…», como sugiere exactitud (nota a), deja la puerta como la
fuente y a Sigma como quien la lee.

## Presupuesto

- Palabras: **567 → 564 (−3)**. Suman `s02-06` −7, `s04-01` −3, `s03-06` −2, `s04-08` −2, `s05-02` −2, `s04-09` −1 y
  `s06-02` −1 (−18), frente a `s04-04` +3, `s03-02` +2, `s05-04` +2 y +1 en `s01-02`, `s03-01`, `s04-02`, `s04-06`, `s04-10`,
  `s05-03`, `s05-06` y `s06-03` (+15). A ~0,42 s por palabra (lo que da el estimado actual), son −1,3 s. Con +0,3 s de pausas,
  **el estimado queda en ~258,5 s**, por debajo de 260.
- Ninguna frase supera las 22 palabras (la más larga, 19 en `s04-04` y `s03-05`). Ningún «:», ningún «;», tres preguntas, cada
  una con una palabra inicial distinta.
- Si hiciera falta más margen: `s04-05` «Mira dos eventos.» (−2; el rótulo «evento de ejemplo» ya está en pantalla).

## s04, la escena densa

- **El tiempo no baja con estos cambios** (151 → 151 palabras). Unos 63 s son voz, 8 s son esperas que no se pueden tocar
  (mensaje 3,5 s + pregunta 4,5 s) y unos 2,7 s son pausas, así que sale ≈ 72 s. Los tres recortes de la ficha (el evento
  legítimo, `falsepositives` y los chips de la escalera) ya están aplicados. Bajar más el tiempo es estructural: quitar el mensaje
  de este capítulo o mover la lectura de `logsource` solo a pantalla. No lo recomiendo, porque son los dos anclajes de la escena.
- **Lo que sí la aligera es de oído:** un solo nombre para cada cosa (la tarjeta = el nombre del disco, el pasaporte = el nombre
  de dentro → «el nombre original», la A = «la de la tarjeta» / «la otra», la B = «la de la lección»), «dos eventos» y
  después «un tercero», la A buscando «ese nombre», el filtro contado con la tarjeta y las etiquetas de emoción sin cuatro Cálidos
  seguidos. Leído de corrido, cada paso trae un solo dato nuevo: qué procesos mira → el pasaporte → las banderas → el filtro
  por la tarjeta → dos eventos → dos reglas → la tarjeta nueva → la respuesta y su porqué → la réplica.

## Lo comprobado en el punto 2 del encargo

- **Hook:** no arranca en frío técnico, sino con un problema (los indicadores caducan y el SOC quiere algo que dure). El título,
  en el estimado, a los 8,2 s (< 12 s). El tono no repite el de V7, que abría con el árbol de procesos.
- **«Eres la analista de Meridian…»** (s01-03, ~16 s): llega bien. Adelantarla retrasaría el título a ~11 s sin ganar nada,
  porque la tira de pantalla ya sitúa desde el principio. «Ya sabes qué detectar. Toca escribirlo.» suena hablado.
- **Conceptos dichos dos veces:** (1) dos miradas: s02-02/04 → s02-05 → s06-01 ✓. (2) compañía o pieza única: s03-01 → s03-03/04/05
  → s03-06 → s03-07 → s06-02 ✓. (3) lo que cuesta cambiar y qué la rompe: con la propuesta, tarjeta/pasaporte en s04-08/09, llano
  en s05-05 y s06-03 ✓. En el original, el 3 nunca se decía con la imagen.
- **Capítulos:** I anuncia en s01-02 y cierra en s03-07 «O sea, que lo corriente pide compañía…» ✓ (muy natural). II anuncia en
  s04-01 y cierra en s05-06 (corregido) ✓. III es el resumen.
- **Primero la idea y después el nombre:** YARA y Sigma (s02-02/04) ✓; `meta`/`strings`/`condition` (s03-02, en par, como
  prescribe la ficha) ✓; `selection`/`filter`/`condition` no se dicen nunca en inglés, solo «busca», «el filtro» y «la condición» ✓;
  PDB, corregido en s03-05; «nombre original», corregido en s04-02/09.
- **Aeropuerto y «Hasta el próximo control»:** sin las propuestas, el remate llega sin imagen. Con ellas vuelven la tarjeta y el
  pasaporte en s04 y s05, y la maleta en s05-03, y el doble sentido (el control del aeropuerto y el próximo vídeo) se entiende.
  La botella de agua sale una sola vez y no se le amontona ninguna otra imagen ✓ (el paraguas y el libro de la ficha no salen, y
  está bien).
- **Réplicas:** M1 → «Depende.» (s03-01); M2 → «vamos a ver qué ve» al abrir y «¿Que no lo verá? …» al final (s04-10) ✓.
- **Pregunta (s04-07):** con «una regla solo mira la tarjeta, y busca ese nombre» y «un tercero, con una tarjeta nueva», trae el
  contexto justo y es una pregunta de verdad entre dos opciones. La A se descarta deprisa. Lo que hay que pensar es si el filtro
  frena a la B, y eso lo contesta s04-10. Sigue casi contestada, como reconoce la decisión 7. Cambiarla por la del decodificador
  propio le toca a Lidia, no a esta revisión.

## Lo que ya funciona

- s02 entera: la idea antes que el nombre, frases cortas y su «o sea» (s02-05). Es la mejor escena hablada del guion.
- s03-03 («como una botella de agua… Sola, saltaría con medio mundo»), s03-07 y la tarjeta de s03, que llega tras el ejemplo.
- La pregunta, con su `think`, en el sitio que pide la ficha. Los mensajes, uno por capítulo, sin repetir «Bloquea…».
- No se deletrea nada: ni `OriginalFileName`, ni `wcssvc.exe`, ni nombres de regla. «certutil» va en voz como herramienta,
  igual que en V7.
- Ningún humor en el dato. La ironía está en los mensajes, en las réplicas y en el «Hasta el próximo control».
- El cierre «A por las diez preguntas de la lección» es la fórmula de la serie (la misma frase que V7). Vale así, porque es un
  sello, no una repetición del contenido.

## Veredicto

**Aprobado con cambios.** Bloquean tres cosas: el aeropuerto tiene que volver en s04 y s05 (sin eso fallan la regla 6 y el
remate), y hay que arreglar los referentes de s04 («tres eventos», las tres etiquetas de la regla B, «otro nombre» para dos
eventos) y «cadena» con dos sentidos en s05-05. Lo demás afina: las acotaciones de s01, s03 y s04, las réplicas, los remates
repetidos en el cierre y las pausas. El total baja 3 palabras y el estimado queda en ~258,5 s.
