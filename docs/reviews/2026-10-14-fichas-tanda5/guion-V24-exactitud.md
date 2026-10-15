# V24 · recuperacion-halden · revisión de exactitud del guion

Revisión de solo lectura del 2026-10-15. Guion: `video/recuperacion-halden/narration.json` y `storyboard.json` (borrador sin
congelar, estimado 256,6 s en `src/timeline.json`). Contrastado con la lección (`src/data/secplus/sp3-part4.ts`, sp3m7 entera),
la ficha (`docs/reviews/2026-10-14-fichas-tanda5/ficha-V24.md`, igual que el apartado `### V24 · sp3m7` del plan), el registro
`docs/superpowers/canon/glass-harbor.md` (§4, notas de V16 y V17, §6), `out/canon-refs.md` (0 tokens) y los mensajes de
BLIND ARCHITECT en `video/zonas-halden/narration.json` y `video/fronteras-halden/narration.json`. Del objetivo 3.4 de SY0-701,
de memoria: sitios hot/warm/cold, geographic dispersion, las cuatro pruebas (tabletop, simulation, parallel processing,
fail over) y las copias (onsite/offsite, frequency, encryption, snapshots, recovery, replication, journaling) están en el
temario; lo que sigue no depende de ningún matiz del objetivo que no esté también en la lección.

Las líneas citadas son de `narration.json` salvo que diga otra cosa. «Palabras» = diferencia de palabras de la voz.

## Bloquea

Nada.

## Corregir

### C1 · s04-02 (`:144`): la voz se adelanta a la pregunta para pensar

La pregunta en pantalla («Probar el cambio de DNS: ¿parallel o fail over?») está bien y nada en pantalla la contesta. Pero la
voz la enmarca de forma que se contesta sola: «¿Te basta el paralelo, o hace falta el cuarto escalón, el fail over?» llega
justo después de «Y eso deja algo sin probar» (`:132`) y de «Ahora te piden más» (`:138`), y en s03 el cuarto escalón es el
«más real». «¿Te basta X o hace falta más?» lleva a «hace falta». Decir «el fail over» dentro de la pregunta no rompe nada
(es la etiqueta del botón); lo que rompe es el «te basta / hace falta».

- **Reemplazo:** «¿Eso lo demuestra el paralelo, o el fail over?» (**−4 palabras**; deja el «cuarto escalón» para cuando se
  enciende con `swap`, como dice el storyboard).
- `:132` («Y eso deja algo sin probar») puede quedarse: abre la escena sin decir qué falta.

### C2 · s05-01 y s05-02 (`:184`, `:190`): la voz puede leerse como «las copias del puerto nunca se han restaurado»

«Y las copias. Cada noche, el trabajo sale en verde» va con artículo definido en un vídeo que acaba de decir «Vas a … su
recuperación» (del puerto), y la frase siguiente remata «sin abrir nunca». Junto, se oye como un hecho de Halden: que sus
copias nunca se han probado. Eso choca con V5, que restauró una copia y «hash coincide» (`glass-harbor.md`, `reg:76`), y con
la ficha («V24 no dice que el puerto "nunca ha restaurado" una copia», `ficha-V24.md:218`; «la voz de V24 no lo hace»,
`:288-289`). El rótulo «ejemplo · sin fecha · no es el registro del puerto» lo arregla en pantalla, no en la voz.

- **Reemplazo s05-01:** «Y las copias. Un trabajo que sale en verde cada noche, completado.» (**+1**). El artículo
  indefinido hace de la escena un ejemplo; el paraguas «sin abrir nunca» queda como imagen de ese ejemplo y se queda igual.

### C3 · s02-03 (`:56`) y `storyboard.json:44`: el warm site no dice que el hardware ya está

La lección define el warm por lo que ya tiene: «el espacio, la conectividad y el hardware preparados, pero los datos hay que
restaurarlos» (`sp3-part4.ts:47`; tabla `:61`; q1 `:148`). En la voz, «el escenario está listo y el decorado, como los datos,
sigue guardado en el camerino» fija bien los datos (decorado = datos, por restaurar), pero «el escenario» no se ata a nada: el
hardware solo se deduce por contraste con el cold («Máquinas y datos los llevas tú», `:62`). Y es justo la diferencia
warm/cold que pregunta el examen. En pantalla tampoco sale (el teatro warm lleva solo «escenario e iluminación listos» y
«horas o un día»).

- **Reemplazo en pantalla (0 s, obligatorio):** bajo WARM SITE, «máquinas y red listas · datos por restaurar»; y, para que
  las tres filas se lean igual, bajo HOT SITE «todo encendido · datos al día» y bajo COLD SITE «energía y red · nada más»
  (ver N4).
- **Reemplazo en voz (opcional, 0 palabras):** «En el segundo, las máquinas están listas y el decorado, como los datos, sigue
  guardado en el camerino.» Mezcla la imagen igual que ya lo hace el cold («Máquinas y datos»), así que no rompe el teatro.
- Lo demás de (a) está bien: hot «decorado montado · minutos» (réplica operativa, `:47`); cold «sala vacía con luz · máquinas y
  datos los llevas tú · días o semanas» (`:47`, `:67-68`); «cuanto más rápido, más caro» (`:55`, `:67`) y «el más barato» en
  pantalla; «Eliges según lo que aguante parado cada servicio» no dice que haya que tener hot y no nombra el RTO.

### C4 · s05-06 (`:224`): «dos que no son copias» contradice la lección

La lección no dice que no sean copias, sino que no son **copias de seguridad**: el snapshot «es un mecanismo de recuperación
cómodo, no una copia de seguridad» y la replication «mantiene una copia continua en otro sistema» (`sp3-part4.ts:99`; nota
`:121`). Decir que la réplica «no es una copia» es falso a la letra. El resto es fiel: snapshot «en el mismo almacenamiento»
(la lección dice «suelen vivir», aceptable en voz) y réplica que copia «también el borrado y el cifrado» (`:99`).

- **Reemplazo:** «Y dos que no cuentan como copias. El snapshot, en el mismo almacenamiento, y la réplica, que copia hasta el
  borrado y el cifrado.» (**+1**).
- **En pantalla (0 s):** el chip de la réplica, «réplica · copia también el borrado y el cifrado **del ransomware**». Sin el
  complemento, «el cifrado» se puede entender como el cifrado de las copias, que la lección pide como obligatorio (`:99`).

### C5 · s01-02 (`:32`): «Vas a montar su recuperación» contradice el sello

El sello dice «plan de recuperación · revisión · propuesta · sin efectos» y la ficha insiste en que nada se ejecuta y que la
analista **repasa** un plan (`ficha-V24.md:71-78`, `:174-177`). «Montar» suena a construir o poner en marcha, y da a entender
que el puerto no tiene ninguna.

- **Reemplazo:** «Vas a revisar su recuperación ante desastres.» (**0**).

## Notas

### N1 · s04-04 (`:160`): «la única prueba de punta a punta»

La lección lo acota: es la única que demuestra que **la conmutación** funciona extremo a extremo (`sp3-part4.ts:95`). El
paralelo también procesa todo de principio a fin, solo que sin cambiar a nadie de sitio. El contexto lo salva («Conmutas la
producción de verdad…» va justo antes), pero queda más exacto atado al cambio.

- **Opción (0):** «Es la única que prueba el cambio entero.» · **Opción (+3, pagada con C1):** «Es la única que prueba el
  cambio de punta a punta.»
- «nadie cambia de sitio» (`:154`), para el paralelo, es correcto (`:95`, q4 `:197`): (c) está bien.

### N2 · s04-01 (`:138`) y `storyboard.json:77`: «el segundo centro (de datos)» da por hecho un segundo centro del puerto

Con artículo definido, «Que el segundo centro corra la aplicación principal» y la petición en pantalla («demostrar que el
segundo centro de datos corre…») presuponen que Halden tiene ese segundo centro. H5 dice que V24 «no lo dibuja, no lo
nombra» (`ficha-V24.md:178-186`) y s02 rotula los teatros como «no son sitios que el puerto tenga». No es un error del
guion: la propia fila s04 de la ficha (`:99`) trae esa petición. Es una tensión interna de la ficha; decide Lidia.

- **Opción (0):** voz «Que el otro sitio corra la aplicación principal…»; pantalla «demostrar que el sitio de recuperación
  corre la aplicación principal…».

### N3 · s05-05 (`:212`) y `storyboard.json:95`: falta «periódica»

La respuesta de q5 es «Performing periodic, documented restoration tests» (`:207`) y la lección dice «pruebas de restauración
periódicas, cronometradas y documentadas» (`:99`). «Cronometrar y apuntar» cubre lo cronometrado y lo documentado; nada cubre
lo periódico, y la tarjeta («nunca se ha restaurado») deja pensar que con una vez basta.

- **En pantalla (0 s):** el primer paso, «restaurar en un entorno aparte · cada cierto tiempo».

### N4 · `storyboard.json:44`: el cold site «con luz y agua»

La lección dice electricidad, refrigeración y acometida de red (`:47`, `:67`). «Agua» no sale en la lección y la red falta.
Imagen de teatro aparte, el rótulo bajo COLD SITE debería decir «energía y red» (ver C3). La voz («una sala vacía con luz»)
puede quedarse.

### N5 · `storyboard.json:61` y `:77`: la barra «toca producción»

En s03 se queda en «no» con los tres primeros escalones, que es correcto. Si en s04 el cuarto escalón se enciende y la barra
sigue en «no», la pantalla dice que el fail over no toca producción. Al llegar `swap`, la barra del cuarto escalón tiene que
pasar a «sí».

### N6 · s02-01 (`:44`): «un teatro con otro de reserva» y luego «el primero, el segundo, el tercero»

«Un teatro con otro de reserva» son dos teatros; los ordinales que siguen hablan de tres reservas, y «el primero» puede oírse
como el principal. La pantalla (tres teatros en fila) lo aclara.

- **Opción (0):** «Piensa en un teatro con otro de reserva. Hay tres clases, según cuánto hay montado allí.»

### N7 · s02-07 (`:90`) y s06-01 (`:236`): «lejos»

La lección dice «lo bastante lejos como para que un mismo suceso no alcance a los dos» (`:47`); «lejos» a secas puede sonar a
«cuanto más, mejor», aunque la concesión de la latencia (`:80`) ya pone el contrapeso. Si sobra tiempo tras la grabación:
«O sea, que lo bastante lejos, y eso…» (+2). Sin cifra en ningún caso: bien.

### N8 · Tiempo de la tarjeta de s02 (no es exactitud)

La tarjeta de s02 va de 1831 a 1981 (150 fotogramas) y el mensaje interceptado arranca en 1965 (glitch y tecleo): se pisan
~0,5 s. Para quien monte la escena.

## Lo que está bien (comprobado)

- **Límites y cues:** el validador del motor (`analyzeNarration` con el perfil `capsula-yt`) da 0 errores y 0 avisos.
  Tarjetas 56, 54, 52 y 52 (máx. 58), una por escena de s02 a s05 y ninguna en el cierre; pregunta 47 (máx. 48) con `holdMs`
  4500; mensajes 62 y 62 (máx. 70), uno por capítulo (I y II), `holdMs` 3800. Están todos los `requiredCues`, y los efectos
  caen donde dice la ficha: `dark` en «ya no está» (s01), `swap` en «Conmutas la producción» (s04), `green` en el verde de las
  copias y `unusable` antes de «los archivos no sirven» (s05). El título entra en el fotograma 282 (9,4 s, antes de los 12).
- **Palabras prohibidas:** un grep sobre la voz, los mensajes, las tarjetas, la pregunta y los `goal` del storyboard
  (`RTO|RPO|ALE|CPD|DR|escaler|pelda|foco|almac|temporal|punto único|pilar|fail-|fail back|km|\d`) no encuentra nada en la
  voz salvo «almacenamiento» (permitido por la ficha). «CPD» y números solo en `goal` (pantalla y notas para quien monta).
  «Escalón» lo permite la ficha (`:241`). Ni 40 km, ni RTO/RPO/ALE, ni hechos de Halden en pasado, ni V5, ni `IR-2026-0147`.
- **(b) Paralelo y simulación:** el paralelo no recibe nada del fail over (ni DNS, ni certificados, ni cambio de sitio): «el
  respaldo procesa lo mismo que producción, a la vez», «sin parar nada» (`:95`). La simulation, «acciones reales, pero sin
  mover producción» (`:95`), sin el «con coste» de V5b. El tabletop valida el plan (`:95`, `:121`).
- **(d) Verde:** ninguna frase llama falsa a una copia en verde: «Verde dice que el trabajo corrió, no que la copia vuelva»
  (q5, `:212`).
- **(g) Respuestas a BLIND ARCHITECT:** en s02, la narradora concede lo cierto («más cerca, más fácil replicar»: la latencia de
  `:47`) y corrige con la frase de la lección («cumple el papeleo, no el objetivo») y la inundación en condicional (`:47`, q7).
  En s05 corrige exactamente el error: verde ≠ restaurable. El registro de BLIND ARCHITECT es el de V16 y V17: atajo de
  diseño, frases cortas, «Menos es más.» al final, sin tutear, sin cifrado, claves ni certificados, y misma voz (Helena, −2,
  `megafonia`).
- **(h) Remate:** «Y si te dicen que menos es más, abre el paraguas» recoge el de V16 («cuenta las garitas») y remite a s05
  («el paraguas se abre antes»). No falsea nada y no habla de derrotar a nadie ni de «cerrarle el paso».

## Cuenta de palabras

| Cambio | Palabras |
|---|---|
| C1 · s04-02 | −4 |
| C2 · s05-01 | +1 |
| C3 · s02-03 (voz opcional) | 0 |
| C4 · s05-06 | +1 |
| C5 · s01-02 | 0 |
| N1 · s04-04 (versión +3) | +3 |
| **Total con N1 largo** | **+1** |
| Total con N1 de 0 palabras | −2 |

Los arreglos de pantalla (C3, C4 chip, N3, N4, N5) no cuestan tiempo.

## Veredicto

**Publicable tras correcciones; nada bloquea.** La analogía del teatro, las cuatro pruebas y la escena de copias son fieles a
`sp3-part4.ts:47-99` y a la ficha, y los límites del perfil se cumplen. Hay que aplicar C1–C5 (la pregunta que la voz
contesta antes de tiempo, la frase que pone las copias sin probar en el puerto, el hardware del warm, «no son copias» y
«montar»); las notas quedan a criterio de Lidia. Todo junto deja el estimado igual o por debajo.
