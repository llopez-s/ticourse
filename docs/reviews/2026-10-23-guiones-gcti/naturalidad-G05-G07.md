# Revisión de naturalidad · G05 `producto-bluf`, G06 `casos-espejo`, G07 `examen-indice`

Revisor: solo lectura (2026-10-23). Se leyeron `narration.json`, `out/transcript-estimate.txt`, `out/timeline-estimate.json`,
`out/script-notes.md`, `storyboard.json`, `lexicon.json` de los tres vídeos; las doce reglas y el vocabulario de emociones de
`docs/superpowers/plans/2026-09-25-lesson-videos.md` §1 «Narración hablada»; las dos preferencias de memoria
(español natural sin anglicismos de oficio; pronunciaciones de Lidia); y, como modelos de tono, `video/hilos-pelicula` y
`video/reglas-aeropuerto`. No se ha tocado ningún guion.

Criterio de clasificación: **A CORREGIR** = error de lengua, ambigüedad que el oído no resuelve, regla del §1 incumplida
con claridad, o promesa que el guion no cumple. **SUGERENCIA** = mejora de fluidez, ritmo o registro; se puede dejar.
Los tiempos salen de `timeline-estimate.json` (estimación de voz; Lidia queda al 88–93 %).

## Visión de conjunto

| | Estimación | Con su lectura típica (~90 %) | Título (cue) | Promesa (cue) | Palabras habladas | Frases > 20 palabras |
|---|---|---|---|---|---|---|
| G05 | 514 s | ~465 s | 9,8 s | **24,9 s** | 1151 | 3 (s02-05, s02-08, s04-04) |
| G06 | 513,5 s | ~465 s | 11,6 s | 20,3 s | 1136 | 0 |
| G07 | 548 s | ~500 s | 7,8 s | 15,4 s | 1208 | 2 (s02-03, s09-03) |

Los tres caben en 380–600 s. G07 es el más ajustado por arriba. Las emociones están bien repartidas (ninguna etiqueta repetida en
dos segmentos seguidos en ningún vídeo; solo se han mirado las etiquetas iniciales). Los dos puntos como conector están dentro del
límite (G05: s02-03 y s09-05; G06 y G07: ninguno).

Hallazgos que afectan a los tres vídeos:

1. **CISO sin pronunciación común.** G05 `lexicon.json` dice `"CISO": "ciso"`; G06 y los 14 léxicos anteriores dicen `"císo"`.
   Alinear G05 con `císo` (A CORREGIR; si Lidia lo dice sin acento, da igual, pero que los tres coincidan).
2. **Muchos términos en inglés leídos por ella.** G05: flash alert, assessment, BLUF, bottom line up front, we assess, likely, very
   likely, unlikely, almost certain, Calibration Range. G07: open-book, best, first, next, except, not, primary, most likely,
   kill chain, very likely, Pyramid of Pain, post-it. G06: hack-and-leak, naming and shaming, wiper, intrusion set, sponsor.
   Todos son terminología de examen y están glosados en español, salvo lo que se marca abajo. Conviene preguntar a Lidia cómo
   los lee antes de congelar (la nota (e).1 de G07 ya lo plantea; vale para los tres).
3. **«Hora UTC» dicho en voz** más veces de las que ayuda al oído (G05, ver s01-01 y s05).

---

# G05 · `producto-bluf`

## A CORREGIR

**s04-04** · `<steady>`
- Actual: «Debajo, lo que sabes. [41|Cuarenta y uno] correos al personal de la cadena de suministro desde las seis, con una falsa revisión urgente de un pedido.»
- Problema: **«cuarenta y uno correos» es un error gramatical** (apócope ante sustantivo masculino: «cuarenta y un correos»). Además son 22 palabras y dos ideas.
- Propuesta: `[41|cuarenta y un] correos al personal de la cadena de suministro, desde las seis. Todos con una falsa revisión urgente de un pedido.`

**s02-08** · `<casual>`
- Actual: «O sea, que es el mismo temporal contado a tres personas, y cada una se lleva el verbo que puede usar.»
- Problema: (a) el «temporal» aparece aquí por primera vez, sin haberlo planteado; antes solo se habló de correos, y la «ola» no se presenta hasta s03-01; (b) «se lleva el verbo que puede usar» no se entiende al oído; (c) 21 palabras.
- Propuesta (y plantear la imagen un poco antes, ver s01-01): `O sea, que es la misma tormenta contada a tres personas, y cada una se queda con lo que puede usar.`

**s02-07**
- Actual: «Eso es un assessment estratégico, y llega en su propio ciclo, no a la hora del flash.»
- Problema: nombre en inglés antes que la idea (regla 3), sin traducción; «su propio ciclo» es vago (¿ciclo de inteligencia?).
- Propuesta: `Y lo que recibe es una valoración estratégica, el assessment, que va por su cuenta y no a la hora del flash.`

**s02-04**
- Actual: «Al SOC le das acciones, porque tiene que actuar ya. Eso es un flash alert, una página con lo que pasa y qué hacer.»
- Problema: nombre primero, idea después. La regla 3 pide al revés (aquí es fácil de arreglar y es el término de examen).
- Propuesta: `Al SOC le das acciones, porque tiene que actuar ya. Una página con lo que pasa y qué hacer. Eso se llama flash alert.`

**s03-04**
- Actual: «El flash, una página que dice qué pasa, qué hacer y cuándo habrá más. Sale en dos a cuatro horas, como máximo, desde que lo confirmas.»
- Problema: «en dos a cuatro horas» no se dice así («de dos a cuatro»), y «como máximo» contradice un intervalo y sobrepasa lo que dice la lección (SLA «típico»; ya lo avisa la nota (d)). También falta decir la respuesta a la pregunta («el flash primero»).
- Propuesta: `El flash primero. Una página que dice qué pasa, qué hacer y cuándo habrá más. Lo normal es que salga de dos a cuatro horas después de confirmarlo.`

**s04-05** · `<mischievously>`
- Actual: «Cállalo, dice. Pues no, porque lo que no sabes también va en el papel. Aquí, si alguien llegó a enviar sus credenciales.»
- Problema: la última oración es un fragmento sin verbo y es **un dato** dicho con tono travieso (regla 9: el humor, en el marco; el dato, limpio). Con un solo tag por segmento, hay que partirlo.
- Propuesta (dos segmentos): `<mischievously> Cállalo, dice. Pues no. Lo que no sabes también va en el papel.` / `<clear> Aquí, lo que no sabes es si alguien llegó a enviar sus credenciales.`

**s09-07**
- Actual: «Por eso, subir la confianza no sube la probabilidad. Son ejes distintos.»
- Problema: en s09-01 la imagen es «dos diales distintos»; aquí cambia a «ejes». Regla 6: la imagen se mantiene.
- Propuesta: `Por eso, subir la confianza no sube la probabilidad. Son dos diales distintos, y cada uno va por su lado.`

**s09-06**
- Actual: «No se contradicen. Dice que lo poco que tienes apunta a probable, pero que otra prueba lo cambiaría con facilidad.»
- Problema: «Dice» no tiene sujeto claro (¿la frase? ¿tú?).
- Propuesta: `No se contradicen. La frase dice que lo poco que tienes apunta a probable, pero que otra prueba lo cambiaría con facilidad.`

**s03-03** · pregunta para pensar
- Actual: «Y con la ola en marcha y el SOC esperando, ¿tú qué mandas primero?»
- Problema: el oído no oye las dos opciones; solo las ve en la tarjeta («flash de una página o informe completo»). Una persona que escucha mientras mira otra cosa se queda sin pregunta cerrada.
- Propuesta: `Con la ola en marcha y el SOC esperando, ¿qué mandas primero, una página con lo esencial o el informe completo?`

**s09-05** · pregunta para pensar
- Actual: «Una frase: probable, pero con confianza baja. ¿Se contradicen las dos?»
- Problema: «Una frase:» suena a acotación; «las dos» se refiere a palabras no dichas antes.
- Propuesta: `Fíjate en esta frase. Probable, pero con confianza baja. ¿Se contradicen?`

**s04-01**
- Actual: «Son las once y cuarenta, hora UTC, y sale el flash alert. Una página, sin tener que bajar, con cada parte haciendo un trabajo.»
- Problema: «con cada parte haciendo un trabajo» es gerundio de texto escrito, y no se entiende.
- Propuesta: `Son las once y cuarenta, hora UTC, y sale el flash alert. Cabe en una página, sin tener que bajar, y cada parte tiene su trabajo.`

## SUGERENCIA

**s01-01** · `<serious>`
- Actual: «Es dieciocho de abril, y a Meridian le llegan correos de phishing desde las seis de la mañana, hora UTC.»
- Problema: arranque de acotación («Es dieciocho de abril») y «hora UTC» al final de la primera frase estorba; además se dice 4 veces en el vídeo (s01-01, s04-01, s05-01, s05-05) y está en pantalla. En s05 hay otro posible lío: «seis de la mañana» (primeros correos) y «seis de la tarde» (límite) suenan casi igual.
- Propuesta: `Dieciocho de abril. Desde las seis de la mañana, a Meridian le están llegando correos de phishing.` Dejar «hora UTC» solo en s04-01 y que las horas de s05 vayan sin el sufijo («las seis de la tarde», «las cinco»); está en pantalla.

**s01-02** · «Tú eres su analista…» → `Eres su analista de inteligencia, y tienes un solo hallazgo. Pero te lo van a pedir tres lectores distintos.` («Tú» sobra.)

**Promesa tardía (s01-03 / s01-04, cue `promise` a los 24,9 s).** Las reglas piden título y promesa en 8–12 s. El título llega bien (9,8 s); la promesa queda más de diez segundos después, tras la enumeración de los tres lectores. Propuesta: fundir s01-03 en s01-02 y adelantar la promesa:
`Eres su analista de inteligencia, y tienes un solo hallazgo. Pero lo van a leer tres personas distintas: el SOC, que vigila la red; el CISO, responsable de seguridad; y el consejo de dirección.` (21 palabras: se puede dejar como dos frases.) Con eso la promesa baja a unos 18 s.

**s02-01** · `<sarcastic>`
- Actual: «Cuarenta páginas técnicas para un directivo, y no se mueve nadie. La diseminación falla más por elegir mal al lector que por analizar mal.»
- Problema: (a) «diseminación» es palabra de texto escrito que casi nadie dice; (b) el segundo enunciado es la tesis, dicha con tono sarcástico (regla 9); (c) «falla más por… que por…» suena a estadística no apoyada.
- Propuesta (dos segmentos): `<sarcastic> Cuarenta páginas técnicas para un directivo, y no se mueve nadie.` / `<clear> Muchas veces el problema no es el análisis. Es a quién se lo escribes.`

**s02-03** · colon y anglicismo
- Actual: «Cuánto tiempo tiene, y en qué formato lo consume: un ticket, un informe o una charla.»
- Problema: «ticket» es jerga de oficio; «consume» (formato) es calco; usa el único colon que había.
- Propuesta: `Cuánto tiempo tiene, y cómo le llega: en una incidencia del SOC, en un informe o en una charla.`

**s02-05** · 21 palabras en cadena de «que»
- Actual: «Al CISO no le sirve una lista de bloqueos. Le cuentas el riesgo y la decisión que tiene delante, que aquí es adelantar la revisión de accesos de los proveedores.»
- Propuesta: `Al CISO no le sirve una lista de bloqueos. Le cuentas el riesgo y qué tiene que decidir. Aquí, adelantar la revisión de accesos de los proveedores.`

**s03-05** · «de tres a cinco días tras consolidar la campaña» repite «campaña» y es registro escrito.
- Propuesta: `El informe de campaña llega después, a los tres o cinco días, cuando ya tienes la campaña bien atada, con todo el detalle técnico.`

**s03-06 y s04-07 (imagen)** · «temporal» y «tormenta» alternan para lo mismo (s02-08 «temporal», s03-06 «tormenta/temporal», s04-07 «tormenta», s10-04 «temporal»). Elegir una palabra. Si es «tormenta»: s10-04 `Y que ninguna tormenta te pille sin parte.` Y s03-06 mejor con «como»: `Es como el aviso de tormenta y el estudio de la tormenta. El aviso sale con lo que sabes ahora, y el estudio llega cuando ya se puede escribir con calma.` (La versión actual dice «Es el aviso…», y es una identidad, no una comparación.)

**s04-03**
- Actual: «Todo ello con confianza moderada, o sea, cuánto te fías de tu base.»
- Problema: «Todo ello» es muy escrito; «tu base» al oído puede sonar a base militar.
- Propuesta: `Y lo dices con confianza moderada. O sea, que te fías de lo que tienes, pero sin pasarte.` (Mueve ahí la glosa que la nota (e).12 propone; el concepto entero llega en s09.)

**s05-01** · «cada una lleva hora límite. Las seis de la tarde» sugiere horas distintas; todas comparten la misma.
- Propuesta: `<urgent> Después van las acciones, y todas con la misma hora límite, las seis de la tarde.`

**s05-03** · acciones en estructura desigual (infinitivo, infinitivo, «que quien…»), y «volver a registrar el doble factor» es torpe.
- Propuesta: `Segunda, cambiar la contraseña de quienes usan el portal y pedirles que registren de nuevo el doble factor.`

**s05-05**
- Actual: «Al final, la hora del próximo parte. Las cinco de la tarde, hora UTC, o antes si cambia algo importante.»
- Propuesta: `Y al final, cuándo habrá otro parte: a las cinco de la tarde, o antes si cambia algo importante.` (Se oye antes que el límite de las seis: está bien, pero no hace falta repetir UTC.)

**s06-02** · `Eso es poner la conclusión delante, y se llama BLUF, de bottom line up front. Es decir, la conclusión por delante.` (Cierra con la traducción para quien no la haya captado; la repetición es la regla 4.)

**s07-05**
- Actual: «Y mira cómo empieza, con we assess, que es valoramos. O sea, que los hechos se citan, pero el juicio tiene dueño.»
- Problema: salto de idea (nace aquí un séptimo concepto) y «los hechos se citan» no se ha dicho antes.
- Propuesta: `Y fíjate en cómo empieza, con we assess, que significa valoramos. Se nota que es el juicio de alguien, no un hecho suelto.`

**s08-02 / s08-04 / s08-05 / s08-06** · «bandas», «tramo», «tramos» alternan para lo mismo. Usar «banda» siempre: `…fijó unas bandas… Cada expresión equivale a una banda de probabilidad.`, `…sube hasta la banda de…`, `La tabla entera tiene siete bandas…`. Y en s08-02 conviene decir qué es la ICD: `…fijó unas bandas en una directiva, la ICD doscientos tres.`

**s08-05** · `Unlikely, o improbable…` y `almost certain` no llevan su traducción de uso («casi seguro» es la palabra que dice el adversario en s09-01). Con ocho cifras seguidas en 20 s el oído no retiene nada; **primer recorte** si Lidia lee lenta (ver abajo). Si se mantiene: `Unlikely, o improbable, va del veinte al cuarenta y cinco por ciento. Y almost certain, casi seguro, de noventa y cinco a noventa y nueve.`

**s08-06** · «Memorízala, que es de lo más preguntado del dominio.» → `Apréndetela, que cae mucho en el examen.` («dominio» y «memorízala» son registro escrito.)

**s09-02, s09-03 (abstracción)** · «habla del evento» / «habla de tu base». Al oído: `El primero es la probabilidad, y dice cuánto es de probable que pase. Es el setenta por ciento de lluvia del pronóstico.` / `El segundo es la confianza, y dice en qué te apoyas. Cuánta evidencia tienes, de qué calidad y si el razonamiento aguanta. Se dice baja, moderada o alta.`

**s09-04** · imagen más viva: `Es cuánto te fías de esa previsión, según salga de un satélite o de alguien que se asoma a la ventana.`

**s10-02** · telegráfica: `Segunda, lo que sabes ahora vale más que lo perfecto que llega tarde. O sea, flash con acciones y plazo, y el informe, después.`

**s10-04** · `Lo siguiente, un laboratorio para practicar las bandas, el Calibration Range. Y que ningún temporal te pille sin parte.` (Pone la idea antes del nombre inglés.) El cierre no vuelve a los tres lectores del arranque; si hay hueco, cerrar con ellos en s10-01: `Antes de irte, tres reglas. Primera, piensa en quién lo lee y qué decisión tiene delante; el texto va después.`

### Mensajes interceptados (G05)
Los cuatro (58–65 caracteres) están en carácter: tutean, «analista», dan un atajo de método y no confiesan nada; cada uno trae un
error concreto que la narradora corrige (cuarenta páginas, callar lo que no sabes, cronología primero, confianza alta sube la
probabilidad). Duración estimada de lectura de Pablo: 4–5 s cada uno. Sin objeciones. Solo un matiz en el 4.º: «tu probable pasa a casi
seguro» funciona porque s08-05 ya habrá dicho «casi seguro» si se aplica la sugerencia de s08-05.

### Ritmo y tono (G05)
Sin objeciones: pausas 300–400 ms y 650 ms tras remates; `<tense>` en s03-01, `<urgent>` en s05-01 y `<mischievously>` en s04-05 tienen sentido. El
capítulo 4 (s08–s09) es el más cargado: 272 palabras con 6 cifras y tres términos en inglés; es donde más se nota el recorte.

### Analogías (G05)
El tiempo (aviso de tormenta, estudio del temporal, pronóstico, setenta por ciento de lluvia, satélite o ventana) cubre tres conceptos
con una sola imagen coherente; funciona. El titular de periódico para el BLUF es limpio. Ver la sugerencia sobre «temporal/tormenta»
y la de «diales/ejes». La imagen del tiempo no choca con G06 (cuaderno, balanza, informe tachado, garaje, fincas) ni con G07 (cuerda,
cebo, post-it, mapa del barrio) ni con los publicados (película, taller, cuadro, escáner, tienda, mesa de tres patas).

### Dónde recortar primero (G05)
1. s08-05 (≈10 s); 2. s05-07 (≈7 s: la frase del «corto a propósito» se puede dejar en s05-06); 3. s03-02 segunda frase; 4. s04-07 (el remate de la tormenta ya está en s03-06).

---

# G06 · `casos-espejo`

Estructura: cinco casos con el mismo molde (presentación, qué enseñó, mensaje o pregunta, imagen, tarjeta). La repetición no
resulta monótona porque el vídeo alterna mensajes interceptados (casos 1, 2, 5) y preguntas para pensar (casos 3 y 4), y las imágenes
son distintas en cada caso. Las transiciones entre casos son ordinales («El segundo es…»): funcionan y dan guía, pero entre
s04 y s05 y entre s06 y s07 hay un salto de tono sin puente (ver abajo). El registro con los incidentes reales es respetuoso: no hay
bromas a costa de las víctimas; el humor está en los mensajes de VELVET CICADA, que no se burlan de nadie real.

## A CORREGIR

**s10-03 (hecho nuevo en el repaso)**
- Actual: «Y con APT10, investigaciones conjuntas entre lo público y lo privado, y acusaciones formales, reforzándose entre sí.»
- Problema: en s09 (APT10) la voz no ha dicho nada de investigaciones conjuntas ni de acusaciones; es información nueva dicha en el repaso, y se sustenta solo en la pantalla. Además «reforzándose entre sí» es gerundio de texto escrito.
- Propuesta: o se dice en s09 (añadir tras s09-04: `Y fue de los primeros casos en que empresas y gobiernos investigaron juntos, hasta llegar a acusaciones formales.`) o se quita la mención de APT10 en s10-03: `Y siempre con lo público y lo privado apoyándose uno en el otro, hasta llegar a las acusaciones formales.` (Y confirmar con el revisor de exactitud que la lección lo permite.)

**s05-01**
- Actual: «El tercero es Sony Pictures, o Lazarus, como aparece en la lección. Hasta aquí todo era espionaje callado, y esto no.»
- Problema: «Sony Pictures, o Lazarus» suena a sinónimos, y Sony es la víctima, no el grupo. El oído no puede deshacerlo. («Lazarus» no se define en la lección, lo dice la propia nota (e).6.)
- Propuesta: `El tercero es el ataque contra Sony Pictures, que en la lección aparece junto al nombre Lazarus. Hasta aquí todo era espionaje callado, y esto no.`

**s07-01**
- Actual: «El cuarto es la intrusión en el DNC. Al investigarla apareció un grupo de intrusión vinculado a Rusia. Y otro, distinto, en la misma red.»
- Problema: «DNC» (de ene ce) no significa nada para quien escucha en español.
- Propuesta: `El cuarto es la intrusión en el DNC, el comité nacional del Partido Demócrata de Estados Unidos. Al investigarla apareció un grupo de intrusión vinculado a Rusia. Y otro, distinto, en la misma red.`

**«El grupo de Meridian» (s02-06, s10-04; también s09-06 «el grupo ataca…»)**
- Problema: al oído, «el grupo de Meridian» puede ser el equipo de Meridian, no el atacante. En s09-06 «sus proveedores» es ambiguo (¿del grupo o de Meridian?). La voz no nombra a VELVET CICADA por canon, así que hay que decirlo de otro modo.
- Propuestas:
  - s02-06: `Lo que apuntes hoy del grupo que ataca a Meridian te servirá mañana.`
  - s09-06: `En Meridian ya lo sabes, el grupo que te ataca también va a por tus proveedores. Su acceso es parte de tu perímetro, y tus requisitos de inteligencia tienen que cubrirlo.`
  - s10-04: `Y el grupo que ataca a Meridian repite tres de esos patrones. Espionaje que persiste, evidencia técnica que se acumula y ataques a sus proveedores.`

**s02-06 (imagen sin presentar)**
- Actual: «Por eso el cuaderno del caso no se tira. Un intrusion set no acaba con una campaña, atraviesa varias.»
- Problema: «el cuaderno del caso» entra con artículo, como si ya existiera; y «intrusion set» no está glosado en este vídeo (regla 3).
- Propuesta: `Por eso conviene llevar un cuaderno por cada grupo y no tirarlo cuando acaba una campaña. Un intrusion set, o sea, todo lo que hace un mismo grupo, atraviesa varias.`

**s05-01 / s06-01 / s07-01 (puentes)** — SUGERENCIA fuerte, no error, pero el salto s04 → s05 es el más brusco: s04-07 cierra con una nota técnica serena y s05-01 abre con «Hasta aquí todo era espionaje callado». Puentes posibles:
- s05-01: `Cambiamos de registro. El tercero es el ataque contra Sony Pictures…`
- s07-01: `El cuarto se parece mucho a lo que tú tienes entre manos: la intrusión en el DNC…`

## SUGERENCIA

**s01-01** · `Un día cualquiera en Meridian, el CISO te hace una pregunta muy sencilla. ¿Esto ya ha pasado antes?` — está bien. Solo, si se prefiere hablar más que acotar: `Estás en Meridian, un día cualquiera, y el CISO te hace una pregunta muy sencilla. ¿Esto ya ha pasado antes?`

**s02-01 / s02-02 / s02-03 (calcos)** — «espionaje sostenido», «descansar en», «actividad de décadas más tarde», «llevan años y varias agencias trabajando juntas» (zeugma).
- s02-01: `Fue una campaña de espionaje que se mantuvo durante años contra redes estadounidenses de gobierno y de investigación.` (Aquí «durante años» es compatible con la lección: dice «sostenido»; confirmar con el revisor de exactitud.)
- s02-02: `De esas redes salió una cantidad enorme de documentación. Fue de las primeras intrusiones estatales que se investigaron a fondo.`
- s02-03: `Enseñó que estas investigaciones llevan años y necesitan a varias agencias trabajando juntas. Y lo curioso viene después. Análisis posteriores conectaron sus herramientas con actividad que apareció décadas más tarde.`

**s02-05** · `¿Que el pasado no te sirve? Mira esas herramientas, que se volvieron a ver décadas después.` — hay que evitar «lo que pasó con sus herramientas» (el «sus» no tiene referente, la frase no refuta). Si se prefiere cautela: `…que análisis posteriores conectaron con actividad décadas después.`

**s03-04** · «fijó el estándar de cómo se escribe un informe…» → `Además, marcó cómo se escribe un informe sobre un actor. Y después alimentó una acusación formal de [EE. UU.|Estados Unidos] contra oficiales militares chinos.` (Sin cambios en la parte entre corchetes: está bien resuelta.)

**s04-02** · dos cosas: «tan arriba» no tiene referente para quien no vio el vídeo de atribución, y «años seguidos, apuntando al mismo sitio» queda vago.
- Propuesta: `¿Cómo llegó hasta arriba del todo, hasta el sponsor, el que dirige la operación y se beneficia de ella? Casi nadie llega ahí. Lo consiguió mirando los cuatro vértices del diamante, año tras año, y viendo que todo apuntaba al mismo sitio.`

**s04-03 / s04-04** · fragmentos encadenados con «Y» (dos «Y» seguidas) y «el teclado y el idioma configurados» incompleto.
- Propuesta: `<thoughtful> Y había más detalles que apuntaban igual. Horarios de trabajo que cuadraban con Shanghái, y hasta el teclado y el idioma con los que trabajaban.` / `<clear> Y unas víctimas que solo cobraban sentido si mirabas a quién beneficiaban.`

**s05-02** (19 palabras, tres enumerados) → `Fue un ataque destructivo. Hubo un programa pensado para borrar, lo que llaman wiper, y además se filtraron datos en masa.`

**s05-05** · «ejecutan ataques destructivos y de coerción» es registro escrito → `O sea, que los estados no solo espían. También pueden atacar para destruir o para presionar.`

**s06-02** → `Puede apoyarse en fuentes que el público no puede revisar, como escuchas y comunicaciones interceptadas, lo que se llama SIGINT. Tu red no tiene nada de eso, ya lo viste en el vídeo de atribución.`

**s06-05** · la última frase cuelga: «Y la empresa privada y el gobierno se complementan.» → `Y no compiten entre sí: la empresa enseña sus pruebas, y el gobierno aporta lo que tú no ves.` (hay un colon; si se prefiere sin él: `…entre sí. La empresa enseña sus pruebas, y el gobierno aporta lo que tú no ves.`)

**s07-03** · `<casual>` en una atribución a servicios de inteligencia rusos. Mejor `<clear>` y con el sujeto completo: `Informes públicos posteriores los asociaron a servicios de inteligencia rusos distintos, el GRU y el SVR.`

**s07-04** · `Misma víctima y mismo país. ¿Los juntas en un solo grupo?` («fusionas» es de documento, no de conversación). La respuesta de s07-05 hay que alinearla: `No. Se siguen como grupos separados…` (sin cambios).

**s08-01** · «personajes inventados» → `con identidades falsas y sitios de filtraciones`.

**s08-03** · «agrupamiento técnico» → `Y confirmó buena parte de lo que las empresas privadas ya habían agrupado por la técnica.`

**s09-02** · «comprometió a esos proveedores» es calco de *compromised* → `El grupo entró en esos proveedores y, desde ahí, saltó a docenas de clientes, en varios países.`

**s09-03** · `Si se las quitan` → `Si se las roban, no entran en un portal, entran en todos.` (imagen excelente, solo se aclara quién actúa.)

**s09-05** · `<sarcastic>` cubre la regla de la lección; el humor, en el marco; la lista, limpia. En dos segmentos: `<sarcastic> Un contrato ayuda, sí.` / `<clear> Pero hacen falta tres cosas con tus proveedores. Vigilar su acceso, limitarlo y dejarlo regulado por contrato.` («la lección pide» es voz de manual.)

**s10-02 / s10-03** · repiten la evolución «informe de empresa → declaración de gobierno → acusación», que ya se dijo en s08-04 y que la pantalla muestra. Es repetición útil (regla 4), pero el capítulo 10 es el candidato natural a recortar si Lidia lee lento.

**s11-04** · `<cheerful>` en la frase final, que habla de ataques reales con víctimas. Mejor `<warm>`. El texto actual («Lo siguiente, las diez preguntas de la lección. Y al CISO, dile que sí. Esto ya ha pasado, y cada vez dejó una lección.») se queda como está.

### Pronunciaciones (G06)
Los nombres propios están en `lexicon.json` con lectura española razonable (múnlait méis, a pe te uno, a pe te diez, lázarus, sóni, guáiper,
de ene ce, gru, ese uve erre, eme ese pe). Sin entrada: hack-and-leak, naming and shaming, intrusion set (la nota (e).9 ya lo apunta). Antes de
grabar, preguntar a Lidia cómo los lee; las dos frases inglesas van precedidas de la idea en español, bien. «EE. UU.» está bien resuelto con
corchetes en s03-04, s05-03 y s08-03. Ningún porcentaje ni cifra suelta.

### Mensajes interceptados (G06)
Tres, de 57, 59 y 61 caracteres. Están en carácter (tuteo, «analista», ironía, atajo de método, ninguna confesión) y duran 4–5 s.
El 2.º («Qué pena») es el más característico. El 3.º («Firma un contrato… y ya está cubierto») ataca justo lo que la lección corrige. Ninguno
habla de los casos reales como suyos.

### Analogías (G06)
Cuaderno (s02-06 → s11-01), balanza (s04-05 → s04-06 → s11-02), informe tachado en negro (s06-01), dos coches en el mismo garaje (s07-06), administrador de fincas
con las llaves (s09-03). Una por concepto, cada una vuelve en el cierre. Sin choque con G05/G07 ni con los publicados. «Pesar» (balanza,
s06-04 «La pesas») es un buen hilo con el caso Sony.

### Dónde recortar primero (G06)
1. s10-02 + s10-03 (≈20 s); 2. s04-03 y s04-04 (≈14 s, detalles de fondo de APT1); 3. s08-02 (hack-and-leak queda en la tarjeta); 4. s03-04.

---

# G07 · `examen-indice`

Tono general: el vídeo suena a charla de la víspera de un amigo que ya pasó por ahí (cuerda, «no te quedes a vivir en ella», «opciones rotas»,
«tu propio barrio», «a dormir»); no a clase. Los puntos que lo tuercen son el bloque legal del arranque, la cadena de reglas finales y un par de
frases de manual.

## A CORREGIR

**Título «Tu índice vale sesenta segundos» (cue `title` y `video.json`/storyboard)**
- Problema: el guion no dice en ningún momento qué son esos sesenta segundos. El título promete algo que la voz no cumple (y la lección no da «60 s»; la nota (a) dice que se quitaron las cifras de tiempo).
- Propuesta: o se cambia el título («Tu índice y el examen: preguntas, micronotas y libro abierto») o se cumple en s02-06: `Y el examen está pensado para que no te dé tiempo a buscarlo todo. Cada consulta al índice tiene que costarte segundos, no minutos.`

**s04-07**
- Actual: «Con lo cual, lo primero al leer una pregunta es cazar esa palabra.»
- Problema: «Con lo cual» es conector de texto escrito (regla 2: «así que», «o sea»).
- Propuesta: `Así que lo primero, al leer una pregunta, es cazar esa palabra.`

**s05-06** · pregunta para pensar
- Actual: «Una para ti. Llega un requisito nuevo de inteligencia, y recoger datos y planificar valen las dos. Pero la pregunta dice first.»
- Problema: acaba en afirmación; la pregunta nunca se formula en voz (solo está en la tarjeta). «valen las dos» confuso.
- Propuesta: `Una para ti. Llega un requisito nuevo de inteligencia. Recoger datos y planificar son válidas las dos, pero la pregunta dice first. ¿Cuál va antes?`

**s10-05**
- Actual: «Vuelve la cuerda. Rescata el hecho que se te escapa, pero el juicio sube contigo.»
- Problema: «Vuelve la cuerda» es acotación (regla 1); describe lo que pasa en pantalla.
- Propuesta: `Piensa otra vez en la cuerda. Te rescata el hecho que se te escapa, pero el juicio lo subes tú.`

**s10-01** · intercepción: la respuesta usa «cuánto vale una banda» (jerga de G05, que quien vea G07 primero no tiene).
- Propuesta: `Eso sí que no. Un índice perfecto te da datos, pero no te dice cuál es la mejor respuesta.` (Y los datos concretos llegan en s10-02.)

**s02-01 a s02-03 (bloque legal)** — es la parte menos hablada del vídeo: tres segmentos seguidos (≈35 s) de descargo antes de que ocurra nada, entre el gancho y la primera idea (regla 12, la prueba del café).
- s02-01 actual: «Según el temario de la app, son unas setenta y cinco preguntas, con vigilancia y con material impreso permitido.»
- s02-02/s02-03 actual: «Pero esos datos pueden cambiar, así que confírmalos tú en la web de GIAC.» / «Y recuerda que esta app es independiente, no está afiliada a SANS ni a GIAC, y no sustituye a tu material oficial.» (22 palabras, registro de aviso legal)
- Propuesta (dos segmentos, el descargo íntegro sigue en pantalla y en s11-04): `<calm> Según el temario de la app, son unas setenta y cinco preguntas, con vigilancia, y se puede llevar material impreso.` / `<serious> Eso puede cambiar, así que mira lo vigente en la web de GIAC. Y recuerda que esta app es independiente, no afiliada a SANS ni a GIAC.` Esto ahorra unos 10 s.
- Sobre las frases con cautela: dichas así son naturales; lo que las hace rígidas es su acumulación, no cada una por separado. La única que suena a texto es «con vigilancia y con material impreso permitido» (doble «con»).

## SUGERENCIA

**s01-01** · `<tired>` en el arranque. La imagen (noche antes del examen) lo pide, pero un vídeo que empieza con voz cansada pierde energía en los primeros 5 s, y Chatterbox/ElevenLabs lo harán todavía más plano. Probar `<warm>` o `<casual>`: `Es la noche antes del examen. Tienes tu índice impreso y un montón de micronotas.` (el texto es bueno).

**s02-04** · idea antes que nombre: `Eso de que sea a libro abierto, open-book, suena a ventaja enorme.`

**s02-07** · «subes con tus propias piernas» (un escalador sube con brazos y piernas) → `La llevas por si resbalas, pero subes tú.`

**s03-01** · `Mañana, cada pregunta tendrá la misma forma.` es una afirmación sin cautela y suena a anuncio. → `Casi todas las preguntas tienen la misma forma. Primero un escenario, que es el contexto. Luego la pregunta de verdad, en una frase. Y al final, cuatro opciones.`

**s03-04** · «calificador» es calco de *qualifier*; es el término de la app, así que se queda, pero con la idea delante: `A esa palabra clave la llamamos calificador, y en el examen la verás en inglés, como best, first o except.`

**s04-01** · `Veamos qué te pide cada calificador, porque aquí es donde se pierden preguntas que sabías.` (el actual «Ahora, qué te pide…» es elíptico.)

**s04-05 y vocabulario** · «vínculo para agrupar intrusiones» → en V14 y G06 se dice **enlace** (fuerte/débil). Unificar: `Por ejemplo, ¿qué enlace para agrupar intrusiones no es fuerte? El de usar una herramienta comercial popular. La usan cientos de grupos sin relación.`

**s08-06 y s08-08 (TLP)** — la nota de TLP llega como un cuerpo extraño al final de un capítulo sobre construir el índice. Que parezca un ejemplo de nota buena: `Mira una nota de ejemplo, de las que valen. Las marcas TLP dicen con quién puedes compartir un informe, y la de ámbar estricto, solo con tu organización, sin clientes.`

**s09-03** · 22 palabras, «con el índice puesto» raro → `Después, ensaya con el índice a mano. Hazlo en los exámenes de práctica de la app y en los de GIAC, si tienes acceso.`

**s09-05** · «debe sentirse» → `El día del examen, el índice tiene que parecerte una extensión de tu memoria, no un mapa nuevo.`

**s10-02** · lista de tres con «qué… qué… qué…» seguida y 20 palabras; está al límite pero se oye bien. Si Lidia se traba: `Los hechos se buscan. Qué porcentaje es very likely. Qué orden llevan las fases de la kill chain. Qué permite cada marca TLP.`

**s10-03** · `puntualidad y lo completo` conecta con G05 (bien) pero es abstracto: `Si la pregunta es qué respuesta equilibra mejor llegar a tiempo y llegar completa, ahí el índice no te salva.`

**s11-05** · la víspera: «Ahora te toca un examen de práctica» choca con s10-06 («Antes de dormir, comprueba que están los imprescindibles») y con s08-01 (nada de hacerlo todo esta noche). Suavizar: `Ahora, si te queda energía, un examen de práctica de la app con tu índice en la mano. Y luego, a dormir.`

**s11-04** · el descargo repetido suena de nuevo a texto legal justo antes del remate. Versión más corta: `Y ya sabes, la app es independiente, no está afiliada a SANS ni a GIAC. Lo vigente del examen, en la web de GIAC.`

**s11-01 / 02 / 03** · «Una… Dos… Y tres» (nota (e).7 del autor): se oye bien, pero G05 usa «Primero… Segunda… Y tercera» y G06 «tres reglas… Atribuir es…» sin ordinal; aunque cada vídeo es independiente, unificar la fórmula ayuda a la serie. Si se cambia: `Primera, lee la pregunta dos veces…` / `Segunda, notas que respondan solas…` / `Y tercera, el índice para los hechos…`

### Mensajes interceptados (G07)
Cuatro (66, 59, 63 y 54 caracteres): el máximo del perfil. Funcionan bien como atajos de método. Todos se responden con una frase propia
(viaje, error típico de best, mapa, hechos frente a juicios). El 2.º puede sonar enrevesado: «Siempre acierta quien no se lo piensa.» →
`Si dudas, la primera, analista. Quien se lo piensa mucho, falla.` (Mantiene el atajo y es más fácil de decir con voz de máquina.) El 3.º y el
4.º son los más sacrificables si el vídeo se alarga (lo dice la nota (e).2).

### Preguntas para pensar y pausa (G07)
Las dos tienen dos opciones y respuesta explícita justo después (FIRST: planificar; ACH: la nota de la regla). Ver el arreglo de s05-06
para que la pregunta se oiga. La del ACH (s06-05) ya la formula en voz y funciona: «¿Cuál te ahorra el viaje?»

### Analogías (G07)
Cuerda del escalador (s02-07 y s10-05, vuelve como estaba previsto), cebo (s05-03), post-it (s06-04), mapa de ciudad ajena frente a mapa de
tu barrio (s08-01 y s08-02, y de pasada en s09-05). Cinco imágenes para cinco ideas, sin colisión con G05/G06 ni con los publicados. El «viaje»
(ir al libro) es un buen hilo corto entre s02-05, s06-05 y s07-02.

### Dónde recortar primero (G07)
1. El bloque s02-01 a s02-03 (≈10 s con la propuesta); 2. s08-03/04/05 fundidos en una frase (`En la primera pasada apuntas cada término y dónde vive; en la segunda lo ordenas y le pones su micronota de una línea; en la tercera, un color por sección.`: ≈8 s menos); 3. s09-01 + s09-02 fundidos (≈6 s); 4. el mensaje y la respuesta de s10-01 (≈14 s).

---

# Lo que suena bien

**G05**
- El arranque de s03 («Lo tentador es esperar a tenerlo todo claro. Pero una inteligencia perfecta que llega tarde ya no es inteligencia») y el remate de s04 («Un buen aviso de tormenta dice dónde llueve y también qué no sabe todavía»).
- s05-06, «Así el silencio deja de ser duda. Si no hay noticias, es que no hay cambios», es la mejor frase del vídeo para el oído: corta, útil y se repite sola.
- s06-01 («Quien decide no quiere vivir la cronología contigo») y el titular de periódico de s06-03.
- s07-02 («Muy cierto, y de ninguna utilidad»): humor en el marco, dato limpio.
- La respuesta a la pregunta de s09: tarjetas, imagen del tiempo y pausa; el vídeo tiene una idea fuerte por capítulo.
- El cierre «Y que ningún temporal te pille sin parte» (con la sugerencia de unificar la imagen).

**G06**
- El gancho (s01-01/02): la pregunta del CISO y la respuesta «Pues sí, y con nombre propio», y la vuelta al CISO en el cierre («Y al CISO, dile que sí»). Es el cierre más redondo de los tres vídeos.
- «Cuando tú ya no te acuerdas, él sigue ahí» (s02-04).
- La balanza (s04-05: «Los horarios o el idioma, solos, pesan muy poco, ya lo sabes»), la oposición «¿La ignoras o la pesas? / La pesas» y las dos preguntas para pensar con dos opciones.
- El administrador de fincas con las llaves y los dos coches en el mismo garaje; humor y respeto en el mismo vídeo.
- El tratamiento de los casos reales: se atribuye siempre («el informe atribuía», «lo atribuyó públicamente el gobierno», «informes públicos posteriores los asociaron») y no hay chistes sobre las víctimas.

**G07**
- La apertura: la duda real del estudiante («si es a libro abierto, ¿hace falta estudiar tanto?») y la promesa clara a los 15 s.
- «Una vale, y otra vale más», «la que suena más sofisticada suele ser el cebo», «no te quedes a vivir en ella», «un índice hecho a la carrera es el mapa de una ciudad que no conoces», «Cada entrada te la has ganado».
- Los dos ejemplos de nota (post-it que trae la respuesta frente a «busca la respuesta») y la regla de la línea.
- La frontera hechos / juicios (s10), que es la tesis honesta del vídeo y no promete lo que el índice no puede dar.
- Los mensajes de VELVET CICADA en el tema «atajos de examen»: muy en carácter y con respuestas que enseñan.

---

# Resumen de cinco líneas

1. Hay **un error de lengua** que corregir ya: G05 s04-04 «cuarenta y uno correos» debe ser «cuarenta y un correos»; y un lapsus de claridad en G06 s05-01 («Sony Pictures, o Lazarus» suena a sinónimos) y en G06 s07-01 (DNC sin explicar).
2. **G05**: la promesa llega a los 25 s (hay que acercarla a ~18), «temporal/tormenta» y «bandas/tramos» y «diales/ejes» alternan (regla 6), y «assessment» y «flash alert» van con el nombre antes que la idea.
3. **G06**: bien estructurado y respetuoso; faltan puentes entre s04–s05 y s06–s07, «el grupo de Meridian» es ambiguo al oído, y s10-03 mete un hecho de APT10 que s09 nunca dijo.
4. **G07**: suena a charla de víspera, pero el título promete «sesenta segundos» que la voz nunca explica, el descargo arma un bloque legal de ~35 s en s02, y dos frases son de manual (s04-07 «Con lo cual», s10-05 «Vuelve la cuerda»).
5. **Duración**: 514 / 513 / 548 s estimados (≈465 / 465 / 500 s reales), todos dentro de 380–600. Recortes por vídeo: G05 s08-05 y s05-07; G06 s10-02/03 y s04-03/04; G07 s02-01..03, s08-03..05 y s10-01.
