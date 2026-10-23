# V48 · datos-halden (sp3m6, `caso-yt`) · notas del guion

Borrador de guion, sin congelar (`video.json` no lleva `frozen`). Ficha: `docs/superpowers/plans/fichas-tanda9/V48-sp3m6.md`.
Escrito con el registro de canon leído, la lección sp3m6 y los ejemplos V45 (`nube-halden`) y V47 (`ot-halden`).

## Cifras

- `build-timeline --estimate`: **317 s (5:17)**, dentro de 240–330 (a 2,5 palabras/s, como todos los `--estimate`). La lectura de Lidia
  queda en ~0,86–0,89 de eso (V45 0,86, V28 0,89): **unos 272–282 s (~4:35–4:40)**, frente al objetivo de ~4:40 de la ficha.
- Palabras habladas (sin marcas): **694** frente a 665 de `wordBudget` (V45: 727/655; V47: 724/665). Por escena
  (hablado/presupuesto): s01 53/54 · s02 118/108 · s03 73/76 · s04 111/108 · s05 89/86 · s06 109/103 · s07 69/76 · s08 72/54.
- `wordBudget` de las escenas de pregunta = (s − 8) × 2,7 = 76 · 86 · 76 (la suma de la ficha, 729, usaba s × 2,7 también en ellas; el
  validador suma 665).
- Título (cue `title`) a los 10,2 s del estimate (antes de los 12). 5 tarjetas, 3 preguntas, 0 think prompts, 0 intercepts.
- `canon-check`: 0 nombres, números u horas, ni con historia ni nuevos (como V28, V45 y V47). No hay equipos, IP, dominios, cuentas ni
  personas con nombre.

## Avisos que quedan (3)

Solo «N words (style guide: about 10–26 per segment)» en los tres segmentos que **plantean una pregunta** (s03-01 39 · s05-01 65 ·
s07-01 35 palabras). Es el diseño: la voz lee escenario + pregunta (+ la glosa de «MEJOR» en s05) en un solo segmento porque el panel
de la pregunta cubre la escena desde ese segmento. V45 y V47 tienen el mismo aviso en los suyos. Ninguna frase pasa de 22 palabras
(la de s07-01 se partió: «…de su nube. Y desde dónde entra cada cuenta.»). Sin dos puntos como conector, sin `;`, sin «¿Y …?», sin
identificadores leídos, sin emociones repetidas en dos segmentos seguidos.

## Desviaciones de la ficha (para el revisor)

1. **Cues de las escenas de pregunta.** La ficha lista `options, pause` en s03, s05 y s07; no son palabras de la voz (las pinta
   `ExamQuestionLayer`) y `analyzeNarration` rechaza cues sin marca. Los `requiredCues` son los que anclan algo del guion: `q1/q2/q3`,
   `best` (solo s05), `ok-N`, `trap-N`, y el de la vuelta de la imagen (`piggy-back`, `export-back`, `storage-back`). En s07 no hay
   `best`: «MEJOR» va resaltado en la pregunta y no hay glosa (ya explicado en s05).
2. **Tarjeta 2 en `mask`, tarjeta 4 en `law`.** Con `examTiming: sentence-end` la tarjeta espera al final de la frase del cue, así que
   los cues van donde acaba la regla: `mask` en la frase única «…y eso es masking» (s04-01) y `law` en «Le aplica la ley del país donde
   reside… y eso es data sovereignty» (s06-04), no al abrir la escena. La tarjeta 1 cuelga de `use` (s02-03), que acaba en «eso es data
   in use».
3. **«Pausa si quieres» no se dice.** Lo pinta el panel (anillo con el rótulo), y V45/V47 no lo dicen; el diseño §4.3 lo cita, pero
   decirlo gasta las palabras que pide la resolución.
4. **Sin `music` en `video.json`**, como pide la ficha («a elegir al montar, otra que la de V28 y las de la tanda»). Plan §8 paso 7: antes
   de `render.mjs --master` hay que poner la elegida.
5. **`youtubeTitle` sin sufijo.** `youtube-meta.mjs` añade « | Security+ SY0-701 en español» (título resultante ~87 caracteres, como
   en V45); la ficha citaba «| CompTIA Security+ en español», que no es el sufijo del motor. Las etiquetas son las 16 de la ficha.
6. **`narration.json` no fija `"lexicon"`.** Solo hay `lexicon.json` (el encargo no pedía el `chatterbox`); como V28, la pronunciación
   definitiva la fija la primera toma de Lidia. Entra solo `DNI` («de ene i»), que la voz sí dice; los términos en inglés no se
   reescriben.
7. **Número de segmentos.** s02 pasa de 4 a 6 y s04 de 3 a 5 segmentos (frases de ≤ 30 palabras, un segmento por idea) y s06 de 4 a 5 y
   s01 de 2 a 3; son frases sueltas que Lidia puede repetir sin regrabar una escena entera.

## Lo que dice la voz y lo que solo se ve

- **Solo en pantalla:** «SY0-701», «3.3», «Base64» (en el escenario de la pregunta 2; la voz dice «un formato que no se lee a simple vista»
  y «sin ninguna clave»), «TLS», el fragmento de DNI enmascarado de s04, «UE» (la voz dice «Unión Europea»), «secure enclaves», las tres
  reglas completas del cierre, «permisos» (en la tarjeta de at rest) y «geofencing».
- **Opciones A–D:** no se leen (diseño §4.3). La voz solo da escenario + pregunta; en la resolución nombra la correcta y la trampa.
- **«DNI» y «Recursos Humanos»:** el DNI se dice («el mismo DNI de tres maneras»), no se deletrea ningún número. RR. HH. sale en voz como
  «Recursos Humanos» (V28).
- **Glosa de «MEJOR»** (s05-01, 18 palabras, la de G-1 de la revisión): «Con un “mejor” delante, alguna otra sonará bien, pero vale la
  que describe lo que se ha hecho.» Distinta de la de V28, V45, V46 y V47. Sin «PRIMERO» ni «Gana …».

## Qué se queda fuera (y dónde sigue)

- Los **tipos de dato** (regulated, trade secret, IP, legal, financial) y las **clasificaciones** y quién las asigna: lección `sp/sp3-part3.ts`
  (tipos y tabla), V41 (quién clasifica). Del chip «private» de s01 no se dice nada en voz.
- **Hashing y encryption como preguntas:** son un chip en s04 («encryption: vuelve con la clave · hashing: no vuelve nunca»), sin voz
  más allá de «Se cifra igual». Cripto es de V11 (sp1m6).
- **Segmentation y permission restrictions:** segmentation solo como opción atenuada en la pregunta 3; las permission restrictions, dichas
  como «cada jefa ve solo a su equipo».
- **Secure enclaves y cifrado en memoria:** un chip en s02, sin voz.
- **El legal hold, la retención, las copias y la restauración** (V43 y V24): no se dice «copia» ni «backup» en ningún sitio.
- Recortes que la ficha dejaba como reserva y que **no hizo falta usar**: no se alarga s02 con «por qué in use está descifrado» (la frase
  «ni el disco ni la conexión lo cubren» ya lo da) ni hay que cortar el trastero. La nota `:517` («la nube no cambia la regla, solo hace
  fácil incumplirla») tampoco entra: el estimate ya está en 317 s.
- «Moverse por la calle no es in transit» (regla 1 del cierre) queda solo en el texto de pantalla; la voz lo dijo en s03.
- La sentencia «un contrato que solo admita trasteros de tu país sería la restricción» no entra (s06 ya va 8 s por encima de su objetivo
  en el estimate): la voz dice «para atarlo… nadie entra desde fuera» y la imagen del trastero vuelve solo en s07.

## Dudas de exactitud para el revisor

1. **«Se gira, se bloquea sola… y cada jefa ve solo a su equipo, que es el least privilege.»** Solo la última cláusula es least privilege
   en sentido estricto; girar la pantalla y el bloqueo son controles físicos y de sesión (la lección los lista juntos como controles de
   data in use, `sp/sp3-part3.ts:466`). La voz ata «que es el least privilege» a la última cláusula; la pantalla puede rotular las tres.
2. **Base64 como obfuscation** (duda 2 de la ficha, avalada por la revisión cruzada): solo está en el escenario de pantalla. Si el
   revisor prefiere evitarlo: «escribe cada campo al revés “para que no se lea”», con la misma clave y la misma trampa.
3. **«Como el dinero en la mano, ahí ya no hay hucha.»** (s02-04) y **«a un disco… aunque viaje»** (s03-02): las analogías no dicen que
   el dato in use esté «cifrado/descifrado» como el dinero; solo que ya no lo cubre el recipiente. La palabra «descifrado» la lleva la
   frase anterior (s02-03), sobre el fichaje.
4. **«Guardado, es data at rest, y se protege cifrando el almacenamiento.»** La ficha añade «permisos» (tarjeta de pantalla); la voz
   solo dice el cifrado.
5. **Tokenization:** la voz dice siempre «solo quien la tiene [la vault] vuelve al DNI» y nunca «con una clave» (duda 4 de la ficha).
6. **Pregunta 3, escenario hablado** («averigua en qué país está cada almacenamiento… Y desde dónde entra cada cuenta. De momento, no
   bloquea nada.»): lee en voz el «no bloquea nada» que en pantalla es «No bloquea nada.»; el sentido es el mismo.
7. **Canon.** Nada choca. Rozan, sin chocar: V35 («hoy no funciona el fichaje», un bulo; aquí el control de horario nuevo es una
   propuesta y no dice que ya funcione); V32 («la jefa del servicio» es otra persona: aquí «la jefa de turno», sin área); V46/V28 (los
   expedientes de RR. HH. son otro sistema); V45 (el puerto «va a estrenar una aplicación en la nube»; aquí la nube es solo «imagina»,
   sin decir que el puerto la use); V47 (un «reloj de diez minutos» de los bomberos frente al reloj de fichar: dos relojes, dos cosas).
   Canon nuevo que fija V48: el control de horario nuevo (propuesta, sin fecha), la jefa de turno y su pantalla hacia el pasillo, el
   informe de horas para Dirección con la tabla de códigos de Recursos Humanos, la exportación mensual y el supuesto de la nube (§
   «Canon nuevo» de la ficha, sin cambios).

## Revisión 2026-10-23

Informe: `docs/reviews/2026-10-23-guiones-tanda8/datos-halden.md` (0 BLOQUEANTE, 4 CORREGIR de exactitud, 3 CORREGIR de naturalidad, 13 OPCIONAL).

**Aplicados (voz + storyboard):**
- **A-1** (s02-06): «...cada jefa ve solo a su equipo. {least}Esto último es el least privilege.» Nuevo cue `least` (en `requiredCues` de s02-estados); el rótulo LEAST PRIVILEGE va solo en la tercera medida.
- **A-2** (s06-05): versión corta del informe: «Y para atarlo, el dato se queda en una región de la Unión Europea. Y nadie entra desde fuera de ella.» (la larga, «atar el dato a un territorio», dejaba el estimate en 331 s > 330). Pantalla: «nadie entra desde fuera de la UE».
- **A-3** (s04-03): «Esa tabla es la vault. Cambiar el DNI por un código es tokenization. Solo quien la tiene vuelve al DNI.» El cue `token` se queda en s04-02.
- **B-1** (s03-01, s05-01, s07-01): «Te toca.» / «Otra más.» / «La última.»
- **B-2** (s04-01, s06-01): «Volvemos al fichaje, y al DNI que lleva. Te lo enseño de tres maneras.» y «Ahora imagina que el sistema de fichajes se alojara en la nube.»
- **B-5** (s04-04, s04-05): «en vez de cifrarla», «Estorba, pero por sí sola no protege.» (incluye A-7) y «Se cifra de todas formas.»

**Opcionales aplicados (sin coste de palabras):**
- **A-5** solo el `why` de la pregunta 2 («Solo la hace ilegible a simple vista, sin clave ni garantía: es obfuscation», 77 car.). La voz de s05-02 («solo cuesta leerla») NO se cambia: costaría +4 palabras.
- **A-6**: se mantiene Base64; la glosa «Base64 · una codificación, sin clave» queda anotada en el `goal` de s05 (solo pantalla).
- **B-9** (s07-03): «O sea, saber en qué país está cada trastero no bloquea ninguno.» (mismas palabras; `goal` de s07 actualizado).

**No aplicados:** A-8a, A-9b, B-3, B-4, B-6, B-7, B-8, B-10 (suman palabras y el estimate no tiene margen). A-8b, A-9a y la decisión de A-10 (no tocar el léxico DNI) se mantienen como dice el informe. Sin choques entre hallazgos.

**Dudas del autor, decisiones del informe:** 1 corregida (A-1); 2 Base64 se mantiene; 3, 4, 5, 6 aceptadas sin cambio; 7 sin choques de canon.

**Pendiente, no hecho (lección / PR / canon):**
- **A-4**: en `src/data/secplus/sp3-cards.ts`, sustituir la última frase de `fcp325` y la entrada del glosario (`:97`) según la ficha V48 («Correcciones de la lección»): hoy juntan geolocation y geographic restrictions y contradicen la pregunta 3. Condición del PR antes de publicar el bloque en la lección.
- **A-10**: anotar en el canon (`docs/superpowers/canon/glass-harbor.md`) que el personal del puerto lleva DNI (ficha «nombre · DNI · horas», fragmento enmascarado `*****678Z`, inventado y solo en pantalla), además del canon nuevo de la ficha.
- Antes de renderizar: `music` en `video.json` (plan §8 paso 7) y fijar la pronunciación de «DNI» con la primera toma.

**Cifras tras la revisión** (`build-timeline --check --estimate`): 726 palabras habladas (694 antes; wordBudget 665), **329.9 s (5:29)** de 330 (caso-yt 240-330), lectura real esperada ~0,86-0,89 = ~284-294 s. 0 errores. Avisos «N words (10-26)» en s03-01 (41), s05-01 (67), s07-01 (37) (preguntas, esperados) y dos nuevos en segmentos no-pregunta: s04-01 (36) y s06-05 (32), por las frases añadidas; no hay frase suelta de más de 22 palabras. Margen de 0,1 s: si hiciera falta más, recortar en s06-01 «de fichajes» (-2) y luego A-5 queda fuera. `canon-check`: 0 nombres/números/horas (`out/canon-refs.md`).
