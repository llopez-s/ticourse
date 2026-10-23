# Segunda pasada de exactitud · G01 `dato-a-juicio`, G02 `niveles-audiencia`, G03 `ciclo-pir` (23-10-2026)

Revisor de solo lectura. Comprobación de regresión sobre `narration.json`, `storyboard.json` y `out/script-notes.md` de los tres vídeos, contra `src/data/s1.ts` (lecciones s1m1-s1m5), `src/data/course-gcti.ts:10-25` y el primer informe (`exactitud-G01-G03.md`).

Comprobaciones mecánicas (script sobre los tres `narration.json`): las 18 tarjetas de examen miden entre 39 y 58 caracteres (la más larga, G01 s10-03, 58; G02 s02-06, 57); como mucho una tarjeta por escena y ninguna en la última; los 9 mensajes interceptados miden entre 45 y 69 caracteres, ninguno contiene «analista»; las 5 pausas para pensar miden entre 37 y 45 (límite 48); ninguna frase pasa de 22 palabras; los tres usan `adversaryVoice` = `sapi/Microsoft Pablo`, rate 0, fx `machine`; los léxicos de los tres dicen `EMBER` «émber» y `FOX` «foks» (copias idénticas en `lexicon.json` y `lexicon.chatterbox.json`). Todos los cues `{...}` de la narración existen en el storyboard de su escena (y a la inversa, salvo `recap` de G01 s11, que es el resumen en tira y no hace falta ticarlo). Búsqueda de fugas (VC, plantillas, lista de objetivos, kazuo, velvet-house, GLASS VIPER, E7, etc.): limpia. Ninguna de las ocho opciones del Lab 1B aparece. El orden de las seis fases en G03 s02 es el de la lista de la lección (`s1.ts:543-552`), decisión ya aceptada en el primer informe (G03-S5).

**Resumen.** Los 10 puntos A CORREGIR de contenido del primer informe están bien resueltos en la narración. Queda **un único fallo de consistencia entre vídeos** (la ficha de EMBER FOX de G02 sigue sin ser idéntica a la de G01 y G03, A4 del primer informe) y un par de retoques menores. Nada BLOQUEANTE.

---

## G01 · `dato-a-juicio` (s1m1 + s1m2)

### Corregido (verificado)

- **G01-A1 · traducción de la frase de inteligencia.** s02-05: «Falta el juicio, algo así como «valoramos que el atacante probablemente volverá a usar este proveedor de alojamiento»» y s02-06: ««y recomendamos vigilar los dominios nuevos que se registren en esa red». Eso ya es inteligencia.» Glosa de la storyboard s02 (`intel`) actualizada igual, con «we assess / likely / recommend» en pantalla. Correcto frente a `s1.ts:37` («monitoring new registrations on that ASN») y `:45` («we assess»). «Valoramos» ya no es «creemos»; «dominios nuevos que se registren» elimina la ambigüedad de «registros».
- **G01-A2 · malware = capacidad.** s07-02: «Pero un malware es solo una herramienta, una parte de la capacidad. La amenaza es el adversario, la persona que la maneja con una intención.» s11-02: «Y el malware es una parte de la capacidad, no el adversario.» Tarjeta s07-02 «El malware es parte de la capability, no la threat» (50 car.), con `at: tool`. Chapa de pantalla «una parte de la capability» en `tool` y en `rule-2`. Coherente con `s1.ts:201` y `:213`.
- **G01-A3 · falta la tercera pareja.** s06-06: «Y uno con herramientas y acceso, pero al que tus datos no le sirven, tiene capacidad y oportunidad sin intención.» y tercer esquema en `others` (storyboard s06). Cubre s1m2q6 (`s1.ts:328-337`).
- **Sugerencias aplicadas y comprobadas:** S1 (apertura «Es tu primera mañana… la analista de inteligencia que acaban de fichar», s01-01), S2 (tarjeta «Intelligence: info analizada que ayuda a decidir», 49 car.; la voz de s02-07 dice «alguien ha analizado y juzgado qué significan, para decidir»), S3 (s02-08 «un juicio analítico, con su «probablemente» o una recomendación», literal de `s1.ts:45`), S4 (s05-06 «la combinación de las tres», «en el examen están en inglés»), S5 (ficha «considerado el padre…» y «paráfrasis de la escuela de Kent» visible en storyboard s03; la voz mantiene «lo llaman»), S6 (s07-03 «La caña sola no pesca. Hace falta el pescador…»), S7 (tarjeta movida a s07-02), S8 (s10-03: ventaja del defensor y tarjeta primero, «romper un eslabón» después), S10 (la IP no está a la vista mientras suena el mensaje; la voz presenta a EMBER FOX sin vincularlo a la IP), S11 («tres escalones», sin «escalera» en voz), S12 («Si dudas, no digas nada…»).
- **Declinadas, aceptables:** S9 (cierre con «las doce preguntas de las dos lecciones», s11-04; se declara que s1m1q4-q6 tratan lo que el vídeo deja fuera, ver `script-notes` (a)); S13 sin cambio.
- **Fuga/canon:** sin cambios respecto al primer informe. Sale solo `141.98.6.10`, en pantalla, sin hora, equipo ni dominio. La frase «a quien sí la tiene en su lista» (`s1.ts:218`) sigue sustituida por «a quien sí va a por ella» (s09-05).
- **Intercepts (3):** s02-01 «Es solo una IP. Bloquéala y no te compliques.» (45), s03-01 «Si dudas, no digas nada y espera a tener pruebas. Así es más fácil.» (67), s07-01 «Quita el programa y se acabó la amenaza. Persigue el fichero y listo.» (69). Ninguno con «analista»; ninguno confiesa ni da hechos nuevos.
- **EMBER FOX:** s02-01 «Se cuela EMBER FOX, una célula que abre la puerta con correos trucados y siempre trae un atajo.» Ficha en storyboard «EMBER FOX · célula de acceso inicial · spearphishing» (storyboard s02). «Correos trucados» = spearphishing, del sabor de la sección (`course-gcti.ts:17-19`), no del dosier. Sin plantillas, objetivos ni «VC».
- **Sliding Scale / F3EAD / PIR:** no aplican a G01. Fases del ciclo: no aplican.

### Sigue mal
Ninguno.

### Nuevo problema

**G01-N1 · A CORREGIR (leve) · s06-04 «Con las otras piezas pasa igual».**
- Dice: s06-04 «Con las otras piezas pasa igual. Un exploit público para un programa que no usas es capacidad sin oportunidad.»
- Problema: en s06-03 ya se ha enseñado que falta la **oportunidad**. «Las otras piezas» promete mostrar que también pueden faltar la capacidad y la intención, y el primer ejemplo que sigue es otra vez **capacidad sin oportunidad** (la pieza que falta es la misma). Después vienen intención sin capacidad (s06-05) y capacidad+oportunidad sin intención (s06-06): las tres piezas quedan cubiertas, pero la frase puente es falsa para su primer ejemplo. El ejemplo del exploit es el de la lección (`s1.ts:205-210`), así que se puede conservar con otro marco.
- Propuesta: «Y puede fallar cualquiera de las tres. Un exploit público para un programa que no usas es otra forma de quedarte sin oportunidad.» Mantener s06-05 y s06-06 tal cual. (Palabras: +2; sin afectar a duración.)

**G01-N2 · SUGERENCIA · s02-05 sin cierre.** El segmento acaba sin signo de puntuación después de la comilla de cierre, y s02-06 empieza con otra comilla de apertura. Para la lectura de Lidia: cerrar s02-05 con coma o puntos suspensivos (`...alojamiento»,`), así se lee como una sola cita partida por la regla de 22 palabras.

**G01-N3 · SUGERENCIA · s05-06 y s07-02 sobre «amenaza».** s05-06 define la amenaza como «la combinación de las tres» y s07-02 dice «La amenaza es el adversario». Son las dos formulaciones de la lección (`s1.ts:195` y `:213`) y no se contradicen, pero conviene que s07-02 diga «La amenaza es el adversario con su intención, no el fichero». Opcional.

**Notas de G01:** el primer párrafo y los apartados (a)-(e) de `out/script-notes.md` siguen siendo los del borrador (539 s, «Ficha sin spearphishing», etc.); lo vigente es la sección «Revisión del 2026-10-23», que lo indica. No hay que corregirlo.

### Storyboard frente a narración
Los 11 `goal` coinciden con la narración nueva (cues, tarjeta de `tool` en s07, glosa de `intel`, tercer esquema de `others`, orden de `advantage` y `break`). El título «De un dato a un juicio» y los cinco capítulos siguen valiendo.

### Veredicto G01: **APTO PARA CONGELAR** (aplicar antes el retoque de una línea de G01-N1; no necesita nueva revisión)

---

## G02 · `niveles-audiencia` (s1m3)

### Corregido (verificado)

- **G02-A1 · escala de inversiones, no de defensas.** s04-01: «Ahora, la escala que ordena las inversiones de seguridad en cinco categorías, la Sliding Scale of Cyber Security. Imagínate una casa.» (`s1.ts:393`). Capítulo 2 «La escala de la seguridad» y chip de `promise` «la escala de la seguridad» (s01-02 «Verás los tres niveles, la escala de la seguridad y por qué no se empieza por el tejado»). Offense queda fuera de la casa (s04-06 «Y fuera de la casa queda Offense, acciones legales de respuesta contra el adversario, casi siempre cosa de estados»), con «de respuesta» recuperado (`s1.ts:402`). Orden de las cinco categorías en voz: Architecture, Passive Defense, Active Defense, Intelligence, Offense (s04-02 a s04-06): correcto (`s1.ts:393`).
- **G02-A2 · mensaje y fallo del consejo.** s03-01 intercept: «Mándale al consejo las IP, tranquilo. Cuantas más, más seria parece.» (68). s03-02: «Al consejo le llega una lista de cuatro mil direcciones IP. Con eso no puede decidir dónde invertir ni qué riesgo aceptar.» Coincide con las preguntas del nivel strategic (`s1.ts:370`, «¿Dónde invertimos? ¿Qué riesgo aceptamos?») y con el check `s1.ts:439`. s03-03: al SOC «un análisis de tendencias del sector… ni una regla ni un indicador para hoy». Error clásico s03-04 y regla s03-05 literales de `s1.ts:388`.
- **G02-A3 · colisión con G05.** Eliminada la meteorología: ahora fútbol (s02-01 a s02-05). Comprobado con búsqueda en todas las `narration.json`: «fútbol» solo aparece además en `aislamiento-halden` (Sec+, otro curso, una frase), y G05 conserva en exclusiva el pronóstico del tiempo. Exactitud de la analogía, frente a `s1.ts:359-382`:
  - jugador en el campo, «la jugada de ahora» = tactical (SOC, «Horas–días»; voz s02-03 «reglas de horas o días»). Correcto.
  - entrenador que estudia al rival = operational («¿Cómo opera este grupo?», «Semanas–meses»; s02-04 «cómo opera este grupo», «Informes de campaña de semanas o meses»). Correcto en la idea (ver G02-S1 sobre «toda la semana»).
  - directiva que decide en qué invertir los próximos años = strategic (CISO y consejo, «¿Dónde invertimos?», «Meses–años»; s02-05 «Tendencias de meses o años»). Correcto.
  - Solo hay tres niveles; no existe «technical». Tarjeta s02-06 «Tactical: SOC. Operational: hunters. Strategic: dirección» (57), literal de la tabla.
- **C1 (EMBER FOX nombrado en voz):** s03-01 «Seria, sí, EMBER FOX. Útil, ya es otra cosa. Imagina que cruzas los sobres.» Presente. Sin «analista» en sus dos mensajes (68 y 69 car.).
- **Sugerencias aplicadas:** S1 (resuelta por A3), S2 (Intelligence es el tejado, `s04-05` «Encima va el tejado, Intelligence…»; sin linterna), S3 (s04-06 «de respuesta»), S4 (s04-08 «Passive Defense, porque protege sin que intervenga nadie.», sin la segunda mitad), S5 (s05-01 «Qué buen atajo, saltarte los parches. Pero ¿quién va a usar esa inteligencia?»), S6 (regla 1 igual en `lens` y `rule-1`), S8 (`back`: «Y los dos sobres llevan lo suyo.»), S9 (notas ya dicen Pablo + `machine`). Declinadas con razón escrita: S7 («la regla número uno de la diseminación» choca con las «tres reglas» del cierre), S10 (un informe de actor sigue solo en pantalla).
- **Pausa para pensar:** s04-07 «EDR que bloquea solo: ¿qué categoría?» (37). Respondible con lo dicho en s04-03 («la puerta blindada, que protege sin que nadie la maneje. Eso es Passive Defense, como un cortafuegos») y la respuesta (s04-08) coincide con `s1.ts:397` («firewalls, EDR/AV») y con la nota de examen `:409`.
- **Tarjetas:** s03-05 «Producto correcto para la audiencia correcta» (44), s04-04 «Active Defense: hunting y monitorización» (40), s05-02 «Intelligence multiplica lo demás, no lo sustituye» (49). Las tres verdaderas según `s1.ts:388`, `:397-398`, `:393`.
- **Sin fugas** de FIRST LIGHT ni de dosieres posteriores; los dos mensajes son atajos de método.

### Sigue mal

**G02-A4 · A CORREGIR · la ficha de EMBER FOX no es idéntica a la de G01 y G03.**
- Evidencia: storyboard G02 s03 (`goal`): «con la ficha «EMBER FOX · célula de acceso inicial» (la misma que en G01 y G03; no hay ni plantillas, ni lista de objetivos, ni «VC», ni «spearphishing»)» y storyboard G02 s05: «con la ficha «EMBER FOX · célula de acceso inicial»». `out/script-notes.md` de G02 repite «ficha idéntica a G01/G03 («EMBER FOX · célula de acceso inicial», sin «spearphishing»)». Pero G01 (storyboard s02, `script-notes`) y G03 (storyboard s02, `script-notes` (f)) usan «EMBER FOX · célula de acceso inicial · **spearphishing**» y dicen que G02 también. Los tres se citan entre sí como idénticos y no lo son. G03 deja la duda como pregunta abierta (3) para Lidia.
- Es una inconsistencia visible entre vídeos de la misma pista, no un spoiler: «spearphishing» está en el sabor de la sección (`course-gcti.ts:17-19`), visible antes del boss.
- Propuesta (cambio solo de storyboard y notas; la narración no se toca): unificar a la forma que ya tienen G01 y G03, «EMBER FOX · célula de acceso inicial · spearphishing»: en storyboard G02 s03 y s05, quitar «ni «spearphishing»» de la lista de prohibidos y añadirlo a la ficha; actualizar `script-notes` de G02 (apartado «EMBER FOX» y decisión abierta 2) y la pregunta abierta (3) de G03. Alternativa aceptable (la que propuso el primer informe, A4): quitar «· spearphishing» de G01 s02 y G03 s02 y de sus notas. En ambos casos, la misma ficha en los tres.

### Nuevo problema

**G02-N1 · SUGERENCIA · s02-02 «toda la semana».** El horizonte operational es «Semanas–meses» (`s1.ts:371`); «estudia al rival toda la semana» sugiere una semana. La voz de s02-04 lo corrige («semanas o meses»), pero la imagen y el cue `rival` dicen «toda la semana» (storyboard s02 también). Propuesta: s02-02 «El entrenador estudia al rival durante semanas, y la directiva…» y storyboard «estudia al rival durante semanas». Cambio de dos palabras.

**G02-N2 · SUGERENCIA · s05-03 «no hay quién lo use».** s05-03: «Sin una base defendible, tu informe es un tejado sin casa. Llega y no hay quién lo use.» La lección dice que intelligence sin arquitectura defendible «aporta poco» (`s1.ts:409`); no es que no haya consumidor, sino que no hay dónde aplicarlo. El storyboard (`roof`) ya dice «sin base defendible, nadie lo aplica». Propuesta: «Llega y no hay dónde aplicarlo.»

**G02-N3 · SUGERENCIA · s03-01, EMBER FOX sin presentar en voz.** Es la primera vez que se nombra («Seria, sí, EMBER FOX») y la ficha en pantalla lo presenta. Aceptable como cápsula que se ve sola; si Lidia quiere más contexto: «Seria, sí, EMBER FOX. Útil, ya es otra cosa.» puede quedarse y la ficha hace el resto. Sin cambio obligatorio.

### Storyboard frente a narración
Coinciden, salvo la ficha (G02-A4). Escena s04 (`scale`: «ordena las inversiones de seguridad») y `promise` ya dicen «seguridad». El rótulo del capítulo 2 es «La escala de la seguridad». `rule-3` «primero la base, y la inteligencia multiplica» coincide con s06-03.

### Veredicto G02: **NO** (por una sola cosa: unificar la ficha de EMBER FOX, G02-A4; es un cambio de storyboard y notas, sin tocar la narración). Con eso resuelto, G02 es APTO PARA CONGELAR.

---

## G03 · `ciclo-pir` (s1m4 + s1m5)

### Corregido (verificado)

- **G03-A1 · «preguntas que no caducan».** s08-01: «Hay preguntas que no se responden una vez y se acabó. «¿Qué actores apuntan a nuestro sector?» es una de ellas.» s08-02: «Se revisa cada cierto tiempo. Son los standing requirements, el pedido fijo de cada semana.» Ya no choca con s06-05 («lleva fecha, porque las prioridades caducan») ni con el distractor «PIRs never expire» (`s1.ts:786`). Coincide con `:768` («se revisan periódicamente»). Tarjeta s08-03 «Standing: permanente. Ad hoc: nace de un evento» (47), literal de la lección; ad hoc: «una fusión o un incidente… se acaban cuando las respondes» (`:768`, «expiran al responderse»).
- **G03-A2 · candidata B frente a «y también».** s07-01 (regla), s07-04 «La segunda. La primera es un tema, no una pregunta, y nadie cambia nada por oírla.», s07-05 «La segunda tiene dos mitades, pero es un solo asunto. Cómo entran esos grupos y qué debería hacer saltar la alarma.», s07-06 «No es un «y también», porque la segunda mitad es lo que harás con la respuesta.» y s07-07 «una pregunta bien formada no es automáticamente la prioritaria… lo valida quien decide». Storyboard s07: la coma de B se resalta como «misma pregunta, su consecuencia de detección». El espectador ya no queda ante una contradicción no explicada. Reserva menor, ver G03-N4.
- **G03-A3 · Find, Fix, Finish.** s05-03: «Los tres primeros son la operación. Localizar al adversario, fijarlo y neutralizarlo, hasta contener el incidente. En inglés, Find, Fix y Finish.» Solo Finish se asocia a contener (`s1.ts:588`). Storyboard s05 (`ops`): «localizar · fijar · neutralizar → hasta contener el incidente».
- **F3EAD completo:** s05-02 «nació en operaciones militares… Son seis verbos, tres y tres.», s05-04 «Explotar la evidencia capturada, analizarla y difundirla… Exploit, Analyze y Disseminate», s05-05 «justo después del Finish, la evidencia forense se explota», s05-06/07 los dos engranajes («el grande marca el ritmo del equipo de inteligencia, y el pequeño gira rápido cuando hay un incidente activo»). Todo coincide con `s1.ts:588-592`. Tarjeta s05-04 «F3EAD: F3 operaciones, EAD inteligencia» (39) verdadera.
- **Fases del ciclo:** s02-03 (comanda, compra, preparar, guisar, servir, «qué tal estuvo») → s02-04/05 (seis fases; «las que más se olvidan son la primera y la última», `:556`) → s03 (Planning/Collection/Processing, `:562`) → s04 (Analysis & Production, Dissemination, Feedback). Orden y definiciones correctos. Planning: «te sientas con quien decide, acordáis qué necesita saber y planificas cómo recogerlo» (`:546`). Tarjetas: s02-05 «Todo empieza con requirements: Planning & Direction» (51), s03-04 «Convert, decode, normalize, detonate: Processing» (48, `:568`), s04-05 «Feedback: ¿cubierta la necesidad? Refina requirements» (53, `:551`).
- **Criterios del PIR (`s1.ts:718-724`):** s06-03 sola pregunta + específico (sector, actor, tecnología); s06-04 ligado a una decisión (tarjeta «PIR: una pregunta, específica, ligada a una decisión», 52); s06-05 factible y acotado en el tiempo «si hace falta» (corrige «si aplica»); s06-06 quien decide valida la prioridad. Los cinco criterios están, el último por la pantalla (`criteria`).
- **Pausas para pensar:** s03-02 «Doce feeds sin pregunta. ¿Qué fase falta?» (41; igual que el storyboard) y s07-03 «Dos candidatas, ¿cuál es el PIR bien formado?» (45, `holdMs` 5000). Respondibles con lo dicho en la escena.
- **EMBER FOX:** s02-01 «Llega un mensaje de EMBER FOX, con un consejo muy amable.»; los cuatro mensajes (64, 66, 65, 61 car.) sin «analista» y sin hechos nuevos; léxico «foks»; ficha del storyboard s02 «EMBER FOX · célula de acceso inicial · spearphishing» (igual que G01; ver G02-A4 para G02). Sin «a otra cosa».
- **Sugerencias aplicadas:** S1 («pedido fijo de cada semana» / «encargo de un banquete»), S2 (s10-03 «en un incidente entra F3EAD, un bucle más rápido»), S3 (s09-01 «Una pregunta típica te da una actividad y te pide la fase» + s09-03 «Pero manda lo que se hace con el dato, no la palabra suelta»), S4, S6 (s02-05 «planificas cómo recogerlo»), S7 (s06-01 «aprender a reconocer una bien formada»), S8 (s02-03 «se guisa en el fogón»), S9 (s05-01 «Ojo con esa prisa…»), S11 (s10-04 «Y repasa las doce preguntas de las dos lecciones»; s1m4 y s1m5 tienen seis cada una). C7 variada (s01-04 «Al sector le llegan rumores de robo de diseños, y el consejo anda inquieto» frente a G01 s01-04). S5 (Lab 1A) y S10: aceptados y anotados.
- **Sin spoilers:** ninguna opción del Lab 1B; el cierre solo remite a él («el taller de PIRs, donde los eliges tú», s10-04, que coincide con `labs.ts:45-56`/«Lab 1B: PIR Workshop», `s1.ts:749`). La candidata B es de la tabla de la lección (`s1.ts:737`) y lleva el rótulo «Ejemplo de la lección · no es el caso de Meridian» (storyboard s07). Nada de FIRST LIGHT ni de dosieres posteriores.

### Sigue mal
Ninguno de contenido. La única incidencia es la de la ficha, que en G03 consiste solo en una frase del storyboard (ver Nuevo problema G03-N1).

### Nuevo problema

**G03-N1 · A CORREGIR (menor, texto de storyboard/notas) · dice que la ficha es la misma de G02.** Storyboard s02: «con la misma ficha del adversario que en G01 y G02, «EMBER FOX · célula de acceso inicial · spearphishing»». Hoy G02 usa la ficha sin «spearphishing» (G02-A4). Queda resuelto en cuanto se unifique la ficha según G02-A4; si se elige quitar «spearphishing», hay que cambiar aquí también la ficha y la pregunta abierta (3) de `script-notes`.

**G03-N2 · SUGERENCIA · s09-02 «suponer».** s09-02: «Los de juzgar o suponer, de Analysis.» La lección da «judgment, assessment, hypothesis» (`s1.ts:568`); «suponer» no es «plantear una hipótesis» y puede confundirse con la suposición de «Imagina que…» de s03-01. Propuesta: «Los de juzgar, valorar o plantear una hipótesis, de Analysis.» (+4 palabras).

**G03-N3 · SUGERENCIA · «escribir» frente a «reconocer» el PIR.** Capítulo 4 del storyboard «Escribir un buen PIR», s01-03 «cómo se escribe un buen PIR» y chip de `promise` «cómo se escribe un buen PIR», mientras s06-01 ya dice «aprender a reconocer una bien formada» y s07 es de reconocer. Propuesta: «cómo reconocer un buen PIR» en s01-03, chip y capítulo («Reconocer un buen PIR»).

**G03-N4 · SUGERENCIA · s07-05/s07-06, razonamiento propio.** «La segunda mitad es lo que harás con la respuesta» es la explicación del vídeo, no de la lección (que solo da B como «Buen PIR», `s1.ts:737`). Es defendible, pero conviene que Lidia lo vea consciente. Si se quiere anclar en la lección: s07-06 «No es un «y también»: la segunda mitad es la consecuencia de detección de la primera, y es la que lo liga a una decisión.»

**G03-N5 · SUGERENCIA · s03-04 «ordenarlos».** s03-04: «Traducirlos, ordenarlos y hasta detonar un programa sospechoso…». Para Processing la lección dice parsear, decodificar, traducir, normalizar, detonar (`s1.ts:545`); la tarjeta dice «normalize». «Ordenarlos» no es normalizar. Propuesta: «Traducirlos, darles un mismo formato y hasta detonar…».

### Storyboard frente a narración
Coinciden en cues, orden de escenas y contenido, salvo la frase de la ficha (G03-N1), el chip/capítulo «Escribir» (G03-N3) y que el `goal` de s08 («lo construirás en la sección tres») coincide con `s1.ts:743` («S3M1») y con s08-05 («más adelante»).

### Veredicto G03: **APTO PARA CONGELAR** (la frase de la ficha en el storyboard debe quedar igual que la decisión de G02-A4; es un cambio de texto, no de narración)

---

## Consistencia entre los tres

- **Ficha de EMBER FOX:** la única inconsistencia abierta (G02-A4/G03-N1).
- **Voz, léxico, tono:** iguales en los tres; ya no se nombra «analista»; ningún mensaje confiesa ni da hechos de campaña.
- **Analogías:** fuego, caña/pescador, capitán (G01); fútbol, sobres, casa (G02); restaurante (G03). Sin colisión con G05 (tiempo) ni entre sí. «Restaurantes» aparece una vez en `logs-halden` (Sec+, una metáfora de entrega), sin conflicto.
- **Continuidad:** G01 «primera mañana» y G03 «primer encargo» ya no se pisan. «Las doce preguntas» en G01 y G03, «las seis» en G02: coherente con las lecciones (6 + 6, 6, 6 + 6).

## Resumen (4 líneas)

1. Los 10 A CORREGIR de contenido del primer informe quedan bien resueltos (frase de inteligencia, malware = parte de la capacidad, tercera pareja, «inversiones», IP y fallo del consejo, fútbol, no caducan, candidata B, Find/Fix/Finish) y no se han introducido errores doctrinales, spoilers de FIRST LIGHT ni respuestas del Lab 1B.
2. Sigue mal solo A4: la ficha de EMBER FOX de G02 no lleva «spearphishing» y G01 y G03 sí, aunque los tres afirman ser idénticos; hay que unificarla (storyboard y notas, sin tocar la narración).
3. Nuevos A CORREGIR: G01 s06-04 («las otras piezas» seguido de otro caso sin oportunidad) y la frase «misma ficha que G01 y G02» de G03; el resto son sugerencias (G02 «toda la semana»; G03 «suponer», «escribir» frente a «reconocer», «ordenarlos»).
4. Veredictos: G01 APTO PARA CONGELAR (tras el retoque de una línea de s06-04); G02 NO hasta unificar la ficha (después, APTO); G03 APTO PARA CONGELAR.
