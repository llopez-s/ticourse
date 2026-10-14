# V26 · `bia-halden` · Revisión de naturalidad del guion hablado

Revisor: naturalidad (solo lectura). Material: `video/bia-halden/narration.json` (522 palabras, 26 segmentos, estimado
240 s, ventana 190–260 s, presupuesto 566), `public/videos/bia-halden-transcript.txt`, `src/timeline.json` (cue `title`
a los 10,2 s), las doce reglas y el presupuesto de conceptos del plan (`2026-09-25-lesson-videos.md`, líneas 44–211),
`ficha-V26.md` y la revisión hermana `guion-V25-naturalidad.md`.

**Cómo leer las propuestas.** Cada una conserva los cues `{...}` en la misma palabra, la etiqueta de emoción salvo que se
diga lo contrario, y los mismos `exam` / `think` / `intercept`. No toca cifras ni conceptos. **P1** = rompe una regla o
confunde a oído; **P2** = mejora, descartable si el estimado pasa de 255 s. Palabras = texto hablado, contadas con un
script sobre el JSON (sin cues ni etiquetas; con `[display|spoken]` cuenta la parte hablada).

## 1. Segmentos a reescribir

| id | Problema | Regla | Propuesta | Δ pal. |
|---|---|---|---|---|
| s04-01 (P1) | **La lista de cuatro cifras.** «Cuarenta minutos, noventa y cinco, ciento veinte y sesenta y cinco» se oye como un solo número raro: «ciento veinte y sesenta y cinco» se parte mal (¿127? ¿120 y 65?) y no hay nada que marque dónde acaba cada una. Además, «de ese sistema… tiene cuatro» no dice qué sistema (acaba de hablarse de una cafetería) ni cuatro de qué. | 8, 5 | `<engaging> {log}Ahora, lo que mides. El registro de averías de llegadas y salidas, del último año, tiene cuatro. {rows}La primera duró cuarenta minutos, la segunda noventa y cinco, la tercera ciento veinte y la cuarta sesenta y cinco.` Las ordinales separan las cifras; las 4 siguen dichas (la transcripción las conserva). Si hay que recortar: «{rows}La más corta, cuarenta minutos, y la más larga, ciento veinte»; las otras dos quedan en pantalla, pero la transcripción pierde 95 y 65. | +8 |
| s04-02 (P1) | «**Las cuatro pasaron de media hora**»: en España «pasar de» es *no hacer caso*, y se oye «las cuatro ignoraron media hora». Y «había prometido» (pluscuamperfecto) no encaja con «Operaciones aguanta» de s03-04. Aquí además cae la comparación con el RTO, que hoy no se dice con esa palabra en ninguna parte del capítulo II (solo en el recap). | 12, 4 | `<clear> {promise-line}Operaciones aguanta media hora, ese es su RTO. {mean}De media se tardan ochenta minutos en dejarlo funcionando, y eso es el MTTR, el tiempo medio de reparación. {gap}Comparadas con el RTO, las cuatro tardaron más.` (la etiqueta pasa de `focused` a `clear`: ver rachas). | +5 |
| s03-06 (P1) | «Los dos días son el RTO, **que manda** sobre la capacidad, **y el RPO manda** sobre la copia»: el RPO se nombra sin su valor y el verbo se repite con un inciso en medio; a oído, «RTO / RPO» (te / pe) se confunden justo donde hay que separarlos. Falta además el motivo del «No». | 8, 3, 4 | `<firm> {rpo-five}No. Casi no puede perder nada, así que copias cada cinco minutos. {two-dials}Los dos días son el RTO y mandan sobre la capacidad, y los cinco minutos, el RPO, sobre la copia.` Cada sigla va pegada a su cifra (dos días / cinco minutos): se separan por la cifra, no por la consonante. Una sola frase para que la tarjeta (`sentence-end`) salga cuando ya se han dicho las dos mitades. | +7 |
| s03-07 (P1) | «Esperar mucho no relaja la copia»: sin sujeto; «esperar mucho» puede ser *el cliente* o *el proceso*, y «relaja» es de acta. Es el cierre del capítulo I (cumple «o sea, que…») y la **segunda** formulación de «RTO y RPO son independientes»; tiene que entenderse sin ver la pantalla. | 12, 4 | `<cheerful> O sea, que poder esperar mucho no te deja perder datos.` | +2 |
| s04-04 (P1) | «El técnico de la caja» vuelve **sin la cafetería** y justo detrás de datos de Operaciones: el oyente no sabe de qué caja hablamos (la imagen se cayó en s03-07; ~70 s). Racha de cuatro segmentos del mismo registro `Sereno` (ver §2). | 6, 10 | `<casual> {technician}Como en la cafetería, el técnico de la caja tarda lo que tarda. Eso se mide, no se promete.` | +4 |
| s05-03 (P1) | El cierre del capítulo («O sea, que…») es correcto, pero (a) **«fiabilidad» no se dice nunca** y la tarjeta de s05-02 lo afirma (`MTBF mide fiabilidad`); (b) la caja desaparece en s05, justo cuando el MTBF es «cada cuánto se cuelga» (título de la escena). | 4, 6 | `<steady> O sea, que uno dice cuánto tarda el técnico en arreglar la caja. Y el otro, lo fiable que es, cada cuánto se cuelga.` | +7 |
| s02-04 (P1) | La réplica a PAPER GOVERNOR corrige un error concreto, pero **no dice por qué** «cero para todo» es malo: «más capacidad tienes que tener lista» se queda en abstracto, y «el análisis ordena qué proceso aguanta cuánto» (sujeto inanimado, «cuánto» colgando) suena a lección leída. | 1, 12 | `<firm> Cero minutos para todo suena seguro, pero cuanto más corto es el plazo, más capacidad tienes que comprar. {order}Por eso el BIA ordena los procesos según cuánto aguanta cada uno.` («comprar» está en la lección: «capacidad que necesitas comprar»). La tarjeta cae tras un segundo «BIA», que es justo lo que dice. | +2 |
| s05-02 (P1) | «**No se cambian**»: ambiguo (¿no cambian *ellos*?). Es la frase con la que cae la tarjeta; tiene que ser un imperativo claro. MTTR / MTBF comparten «eme te» y se separan por la tercera letra (te / be): conviene que la oración emparede cada sigla con su idea, como ya hace. | 12 | `<clear> {side}El MTTR es cuánto tarda en volver, y el MTBF, cada cuánto falla. {swap}No los confundas.` («tarda en volver» eco del hook: se queda.) | 0 |
| s06-02 (P1) | **Cuatro siglas en una frase** («el MTTR y el MTBF… el MTTR… el RTO»): es la sopa de letras del vídeo, justo en el repaso, y suena a lista. | 8, 12 | `<clear> {rule-2}Segunda, el MTTR y el MTBF se miden, no se prometen. Y el MTTR se compara con el RTO.` Dos frases; el aire entre ellas separa lo que se mide de lo que se compara. | 0 |
| s03-02 / s03-03 (P2) | «El plazo es el RTO… Los datos son el RPO…»: dos frases con la **misma plantilla** y dos expansiones inglesas que solo difieren en una palabra («time» / «point»); en la voz de Lidia, «erre te o» y «erre pe o» son casi el mismo sonido. Ya hay dos objetos en pantalla (reloj, libreta): se usan como ancla fonética. «Marca la capacidad de recuperación que tienes lista» es de ficha, pero se dice bien. | 6, 3, 8 | s03-02 `<focused> {rto}Ese reloj es el RTO, el recovery time objective, y marca la capacidad de recuperación que tienes lista.` · s03-03 `<clear> {rpo}Y esa libreta es el RPO, el recovery point objective, y marca cada cuánto la copias.` | 0 / +2 |
| s03-01 (P2) | Corte brusco: del puerto («navieras», «buques») a «Piensa en una cafetería» sin puente. Las dos preguntas ya se hicieron en s02-03; la cafetería debe presentarse como **las mismas**. | 6, 4 | `<curious> {cafe}Imagina esas dos preguntas en una cafetería, cuando {till}se le estropea la caja. {clock}Una es cuánto puede estar sin servir, {notebook}y otra, cuántas ventas apuntadas aceptas perder.` | 0 |
| s03-05 (P2) | La pregunta funciona (decisión breve, dos botones, datos a la vista), pero el oyente oye dos veces «dos días» seguido y no ve el *gancho*: lo que se prueba es la inferencia «espera dos días → copia al día». Un «Entonces» la marca. Y el proceso se llama «Facturación» en s02-02 y «Facturas» aquí. | 7, 1 | `<thoughtful> {think}Facturación puede esperar dos días. Entonces, ¿basta con una copia al día?` (y en s03-04, «Facturación aguanta dos días»: misma palabra, 0 pal.). | +1 |
| s04-05 (P2) | «Si estos fueran los números»: ya los acaba de ver; suena a hipótesis de texto. La condicional es decisión de ficha (no afirmar nada del puerto); pasa mejor a segunda persona. | 12 | `<firm> {fix}Si fueran tus números, el plan no se cumpliría, y habría que mejorar la recuperación, no el papel.` | −1 |
| s05-01 (P2) | No anuncia que viene *otra* medida: cae en «En ese registro hay cuatro averías en doce meses», que repite casi literal s04-01. El capítulo II solo anunció «lo que mides»; el MTBF entra sin gancho. | 4 | `<curious> {four}Y ese mismo registro dice otra cosa. Hay cuatro averías en doce meses. {line}Repartidas, es una cada tres meses, más o menos. {mtbf}Eso es el MTBF, el tiempo medio entre fallos.` | +4 |

**Pausa (regla 10), sin coste de palabras:** s01-01 `pauseAfterMs` 250 → 450 («Dos respuestas, y ninguna es un número»
es la revelación del hook; el `title` pasa de 10,2 a ~10,4 s, sigue < 12).

## 2. Comprobaciones pedidas

| Comprobación | Resultado |
|---|---|
| **Hook sin frío técnico; título < 12 s** | Cumple. Escena y pregunta, ningún término técnico, y la imagen de dos respuestas sin número funciona. `title` en 305 fotogramas = **10,2 s**; `promise` a 15,3 s. No añadir palabras a s01-01. Aviso menor: tres segmentos seguidos empiezan por «Y» (s01-01 «¿Y cuántos», s01-02, s01-03); no molesta en voz. |
| **Cinco siglas: ¿sopa de letras?** | **Solo en dos sitios.** s06-02 (cuatro siglas en una frase, arreglado arriba) y s03-06 (RTO y RPO en la misma frase sin cifras). En el resto cada sigla aparece **una por frase y detrás de su idea**: BIA (s02-01 «preguntas al negocio» → «el BIA»), RTO/RPO (reloj/libreta → nombre), MTTR («se tardan ochenta minutos» → «eso es el MTTR»), MTBF («una cada tres meses» → «eso es el MTBF»). La separación en el tiempo ayuda: BIA 0:26, RTO/RPO 1:06, MTTR 2:20, MTBF 3:05. |
| **RTO/RPO y MTTR/MTBF a oído** | RTO/RPO: «te / pe» es la diferencia mínima; se refuerza con el objeto (reloj/libreta, s03-02/03) y con la cifra (dos días / cinco minutos, s03-06). MTTR/MTBF: comparten «eme te» y se separan por **«tiempo medio de reparación» / «tiempo medio entre fallos»** (reparación ≠ fallos, bien) y por la oposición «tarda en volver» / «cada cuánto falla» en s05-02. Con las propuestas no hay un solo segmento donde el oyente tenga que distinguirlas solo por la consonante. En la grabación, que Lidia **no junte** «MTTR y MTBF» en el mismo aliento. |
| **Conceptos dichos dos veces con palabras distintas** | RTO ≠ RPO / independientes: s03-06 («mandan sobre la capacidad / la copia»), s03-07 y s06-01 («de tiempo y de datos»): bien, 3 veces. **MTTR se mide y se compara con el RTO**: «de lo que hace tu equipo» + «se mide, no se promete» (s04-03/04), pero la palabra «comparar» solo salía en el recap (s06-02) → s04-02 propuesto la dice donde está el 80 contra el 30. **MTBF = fiabilidad**: la idea («cada cuánto falla») está tres veces, **la palabra «fiabilidad» ninguna** → s05-03 propuesto. |
| **Capítulos: anuncian y cierran con «o sea, que…»** | Mejor que V25. Cap. I anuncia en s01-02 y cierra en s03-07; cap. II cierra en s05-03; cap. III abre con «Tres reglas» y numera. Falta solo que el cap. II **anuncie** el MTBF (s05-01 propuesto). |
| **La cafetería se mantiene sin amontonar** | Cuatro objetos (caja, reloj, libreta, técnico), una sola imagen: bien. Falla la **vuelta**: s04-04 la retoma sin decirlo y s05 la pierde. Propuestas s04-04 y s05-03: «Como en la cafetería…», «el técnico… arreglar la caja». No se añade ninguna imagen nueva (la alternativa de la ficha —taller sin caja— no hace falta). Vecina de «tienda»/«cocina» de V22/V9: la voz solo dice «cafetería» y «caja», sin «tienda» ni «cocina». |
| **Respuestas a PAPER GOVERNOR** | s02-04: repite el «cero minutos» del acta y lo contradice, pero sin motivo → propuesta («comprar»). s04-03: «Eso es poner en el papel lo que ya pasa» es una réplica de verdad: concede el hecho y corrige que no es un objetivo; **se queda tal cual**, junto con su segunda frase («El RTO sale de lo que el negocio aguanta, y el MTTR, de lo que hace tu equipo»). Con `sentence-end` la tarjeta aparece al acabar la primera frase y se mantiene 5 s mientras suena la segunda: queda alineada. |
| **Pausa para pensar** | Contexto justo: el oyente tiene «casi no puede perder nada» (s03-04) y «dos días»; la pregunta mide la inferencia. 4,5 s de `holdMs`, dos botones. Bien; solo «Entonces». |
| **Cifras con minutos** | Fuera de s04-01 todo bien: «media hora», «un día», «dos días», «cinco minutos», «ochenta minutos» y «doce meses» están separados por verbos. s04-01 es la lista (ver tabla). El 80 de media **se oye razonable** porque 40 y 120 son los extremos. |
| **Emociones consecutivas (regla 10)** | Ninguna etiqueta se repite, **pero s04-02…s04-05 son cuatro del registro `Sereno`** (focused, serious, steady, firm: mismo `exaggeration` 0,40 en Chatterbox). Propuesta: s04-02 → `clear` (Neutro), s04-04 → `casual` (Cálido). Resto, variado. s03-07 `cheerful` cierra el capítulo con remate: bien, y el dato (s03-06) va con `firm`. |
| **Humor en el dato (regla 9)** | Limpio. «Poca cosa», «lo que tarda» y la caja son marco; los datos (30 min, 48 h, 5 min, 80 min, 3 meses) van sin adorno. |
| **Dos puntos / punto y coma** | Ninguno en el texto hablado (las tarjetas sí llevan «:», que no se lee). |
| **Frases > 22 palabras** | Hoy ninguna (máx. 19). Las propuestas llegan a 20 (s03-06, s04-01), nunca a 22. |
| **Sigla BIA** | Sale una vez (s02-01) y vuelve en la tarjeta; con la propuesta de s02-04 se dice dos veces. Es la «quinta sigla»: aceptable porque la lección la trata como objeto del vídeo y la tarjeta la lleva. |

## 3. Longitud

- **Solo P1:** +35 palabras → **557** (presupuesto 566). A ≈ 0,40 s/palabra marginal (las 522 dan 239,8 s con las esperas
  fijas ya dentro), unos **253–256 s** estimados. Dentro de 190–260, con ~4 s de margen.
- **P1 + P2:** +41 → **563** y ~**256–259 s**: cabe, pero sin margen real. No he ejecutado `build-timeline --estimate` (solo
  lectura): hay que medirlo antes de grabar. Recorte en este orden si pasa de 255 s: (1) s05-01 vuelve al original (−4);
  (2) s03-03 sin «la» (−1) y s03-01 al original; (3) s05-03 sin la segunda frase: «O sea, que uno dice cuánto tarda el técnico
  en arreglar la caja, y el otro, lo fiable que es.» (−5, pierde la 2.ª formulación del MTBF, pero queda la de s05-02);
  (4) s04-01 a la variante «más corta / más larga» (−9).
- La grabación de Lidia suele quedarse en el 88–93 % del estimado (V5–V9): con ~256 s estimados, lo real caería hacia 235–240 s.

## 4. Lo que ya funciona

- El hook: dos respuestas que parecen respuestas y no son un número; «lo que no tiene número no se puede cumplir ni
  incumplir» es una frase dicha, no leída. Título a los 10 s sin tocar nada.
- **Idea antes del nombre en las cinco siglas.** Ninguna llega en frío, y no hay ningún identificador, host ni hash.
- **Los capítulos cierran con «o sea, que…»** (s03-07, s05-03) y el recap numera «Primera… Segunda… Y tercera»: a oído se
  cuentan, a diferencia de V25.
- s03-04 («Operaciones aguanta media hora y puede perder un día de datos. Facturas aguanta dos días, y casi no puede perder
  nada.»): la mejor frase del vídeo; dos paralelas, dos cifras cada una, sin siglas, y la libreta y el reloj siguen en pantalla.
- La pregunta de s03-05 es de las que se haría quien lo ve; y la respuesta (cinco minutos) sale de un dato ya dado.
- El eco del hook en s05-02 («cuánto tarda en volver», «cada cuánto falla») cierra el círculo con las dos preguntas del inicio.
- La réplica de s04-03 y el cierre «mejorar la recuperación, no el papel» (s04-05 / s06-03): la moraleja es de persona, sin
  jerga, y se repite con las mismas palabras exactamente donde conviene (regla 4).
- Sin colones, sin punto y coma, sin fórmulas «¿Y X? Pues Y» encadenadas; dos pausas largas ya caen tras remates (s04-03, s05-02).

## 5. Veredicto

**Reescribir antes de grabar, con cambios acotados.** El guion es claro y está mejor construido que el de V25: ningún
segmento rompe las reglas de forma estructural, los capítulos cierran bien y las siglas llegan tras su idea. Los fallos de
verdad son siete y pequeños: la **lista de cifras** de s04-01 (a oído son un solo número), el **«pasaron de»** de s04-02
(en España significa «no hicieron caso»), la **sopa de cuatro siglas** del recap (s06-02), el **«No se cambian»** ambiguo
(s05-02), la cafetería que **no vuelve** en s04-04 y s05, y la palabra **«fiabilidad»** que la tarjeta dice y la voz no
(s05-03). Con los P1 (+35 palabras, 557) queda en ~254 s, dentro de la ventana; los P2 caben pero sin margen, así que
conviene medir con `build-timeline --estimate` y recortar en el orden de la §3.
