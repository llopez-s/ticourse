# Revisión del guion · V42 `proveedores-halden` (sp5m5, `caso-yt`)

Revisión del 2026-10-23, solo lectura. Fuentes leídas: ficha `docs/superpowers/plans/fichas-tanda8/V42-sp5m5.md` (entera), `video/proveedores-halden/{video,storyboard,narration}.json`, `lexicon.json`, `out/script-notes.md`, `out/canon-refs.md`, la lección `src/data/secplus/sp5-part3.ts:1-261` (sp5m5 entera, con sus 3 checks y 7 preguntas), las tarjetas `fcp518`–`fcp523` y `fcp527`, el plan de vídeos §1 («Narración hablada»), `_revision.md` de la tanda, el piloto V28 (`controles-halden`) y los guiones ya escritos de V39, V40, V41, V43 y V44.

**Límite honesto sobre el registro.** `docs/superpowers/canon/glass-harbor.md` mide 721 KB (3.024 líneas, hasta 12.000 caracteres por línea): no cabe entero en una pasada. Leí con `grep` con contexto todo lo que puede tocar a V42 (Compras, hospital, agencia, navieras, pasajeros, MOU/MOA, due diligence, conflict, vendor, proveedor, sp5m5, terceros, paraguas, cuerda, caja, sello, firma, informe, contrato, calendario, ambulancia, guardería, folleto, traducción, §6 «Nombres libres» y la tabla de imágenes ocupadas). No encontré contradicción de hechos; los cruces que sí hay van abajo. El PDF oficial de SY0-701 no está en el repositorio; la 5.3 se comprobó por la lista de objetivos que cita la propia lección y por una búsqueda de material de preparación (ver A-1).

---

## A. Exactitud y canon

### Resumen de lo comprobado y limpio

- **Lección y objetivo 5.3.** Toda afirmación técnica de la voz y de la pantalla tiene su sitio en `sp5-part3.ts` (questionnaire autodeclarado `:27`; evidence of internal audits `:27`; independent assessment y «qué cubre y qué meses» `:27`; supply chain `:27`; right-to-audit firmada antes `:47`, `:136`; due diligence antes y conflict of interest declarado y apartado `:47`; MSA/SOW/SLA/NDA `:67`, tabla `:69-116`; vendor monitoring `:141`). Las siete siglas y los términos de 5.3 que el vídeo toca coinciden con el objetivo. No hay ningún dato que la lección contradiga. La lección en sí no tiene nada dudoso en lo que el vídeo usa, salvo el matiz MOA/MOU de A-1, que es de la materia y no de la lección.
- **Las tres preguntas.** Índices coherentes (C/A, D/C, B/D) y tres respuestas distintas. Pregunta 1: una sola respuesta, trampa real, `why` y `trapWhy` ciertos, sin pistas gramaticales. Pregunta 2 y 3: ver A-1, A-2 y A-6.
- **Canon.** Cero hechos fechados, cero equipos, cuentas, IPs, hashes, personas con nombre. No sale PAPER GOVERNOR, ni RED MARROW, ni GLASS HARBOR, ni el caso de septiembre. El registro reserva «proveedores, contratos y SLA» para sp5m5 (`reg:601`, `:1364`, `:2212`), así que V42 los trata donde toca. No usa el «contrato de alquiler» de V38 (`reg:2982`, que lo reserva «no de un proveedor (sp5m5)»). «Compras» (V32/V34/V35) sale sin personas, como pide el registro (`reg:194`). «La guardería», «el folleto» y «el sello»: sin rastro previo en el registro. `canon-refs.md` dice 0 coincidencias y es verdad.
- **Cifras inventadas.** Solo «dos años» (pregunta 2), «24 h» (SLA de ejemplo; la lección tiene la notificación de incidentes en 24 horas, `:147`) y «cada año» (ver B-3). Ningún nombre inventado.
- **Duración y límites de motor.** Verificados con Python: escenario 146/119/140 (≤160), pregunta 32/51/28 (≤110), opciones 13–33 (≤70), `why` 73/73/74 y `trapWhy` 73/74/77 (≤90), tarjetas 33–44 (el motor admite 58). 705 palabras habladas; cinco escenas pasan su `wordBudget` (s02 115/108, s03 94/86, s04 115/108, s06 109/103, s07 81/76), lo que ya admiten las notas (+6 % global). Mis sustituciones son neutras en palabras o restan.

### Decisión sobre las «dudas para el revisor» de `out/script-notes.md`

| Duda | Decisión |
|---|---|
| 1. MOA frente a MOU (pregunta 3) | **Se mantiene la pregunta, endurecida** (A-1). Con el criterio del curso hay una sola respuesta; con el mundo real, no. No hace falta el fallback del SLA frente al MSA. |
| 2. `fcp520` y la due diligence al renovar | El guion es correcto (no dice que se repita al renovar). **La condición del PR se mantiene como obligatoria** (A-5). |
| 3. s02 «sin vínculo con ella» | **Suficiente.** Es lo que dice la lección (`:27`, «tercero sin vínculo con el proveedor»). Opcional añadir «y sin interés en el resultado» (`fcp527`, q4), solo si cabe sin pasar de presupuesto; no hace falta. |
| 4. «las hace» (voz) frente a «lo hace» (pantalla) | **No contradice nada**: plural del término frente a singular del informe. Sin cambio. |
| 5. Inserción en la lección | Correcta tal como está en la ficha (después del callout `:143-148`, antes de `:149`). Nada que añadir. |

### A-1 · CORREGIR · s07-01, `question` de s07 (MOA frente a MOU) — el punto de atención extra

**Veredicto sobre la ambigüedad.** Con el criterio del curso la pregunta tiene una sola respuesta: la lección (`:67`, tabla `:80-90`) y `fcp522` dicen que el MOU «expresa intención, sin obligaciones exigibles» y que el MOA «reparte responsabilidades y recursos concretos y se acerca mucho más a un compromiso vinculante». Una búsqueda de material de preparación de SY0-701 confirma la convención («MOU: no vinculante, de alto nivel; MOA: más detallado, con elementos vinculantes»), y a la vez que fuera del examen los dos términos se usan casi como sinónimos y que la fuerza legal depende del texto, no del título. Es decir: **la respuesta es defendible solo si el escenario pone el compromiso exigible en primer plano**, y hoy no lo hace del todo:

1. **Pantalla y voz no dicen lo mismo en el dato que decide.** La voz dice «cada uno se compromete a unas fechas concretas»; el texto de pantalla (el que lee quien pausa) dice solo «con fechas concretas»: desaparece el compromiso. El `trapWhy` («aquí hay compromisos») remite a algo que la pantalla ya no muestra. (Convención del registro: la pantalla va comprimida y la voz lee la larga, `reg:388`; pero lo comprimido no puede perder lo que decide la respuesta.)
2. **«Compromete» no basta.** Un acuerdo de ayuda mutua entre hospitales, que es justo este escenario, suele llamarse MOU en la vida real y lleva compromisos y fechas. Quien lo sepa puede dudar entre B y D. La lección define el MOU por lo que **no** crea («obligaciones exigibles»); hay que poner lo exigible en el escenario.
3. **BPA es el tercer candidato latente.** La lección (`:67`) define el BPA como «dos socios que comparten responsabilidades, recursos… en una actividad conjunta», y dos hospitales que reparten ambulancias y médicos lo parecen. Lo que lo descarta es «Sin dinero ni negocio», que la pantalla sí conserva: **no se puede recortar** al reescribir.

**Corrección.**

- `narration.json`, `s07-01.text` (voz): «…Uno pone las ambulancias, el otro los médicos de refuerzo, y cada uno se obliga a unas fechas concretas, y puede exigírselo al otro. No hay dinero ni negocio de por medio. ¿Qué documento encaja mejor?» (+5 palabras; compensa con B-6, abajo).
- `question.scenario` (pantalla, 152 caracteres): «Dos hospitales firman cómo cubren el verano: uno pone ambulancias, el otro médicos, y cada uno se obliga a unas fechas exigibles. Sin dinero ni negocio.»
- `why`: sin cambio («Reparte tareas y recursos concretos que cada parte se compromete a cumplir»). `trapWhy`: «Es una colaboración, pero un MOU solo dice la intención: aquí hay compromisos» pasa a «Es una colaboración, pero un MOU solo dice la intención: aquí hay obligaciones exigibles» (82 caracteres).
- Voz de la resolución `s07-02`, sin cambio (ya dice «reparte compromisos» y «solo dice la intención»); para el oído, ver B-2.
- La opción del fallback no es necesaria si se hacen estos cambios. Si Lidia o el revisor de la ficha prefieren no depender del matiz en absoluto, el SLA frente al MSA es la salida limpia, pero cambia el concepto que enseña s07 y pierde el único MOA del banco.

### A-2 · CORREGIR · s05-01, `question` de s05 (escenario de la pregunta 2)

Dos problemas en el escenario, ninguno cambia la respuesta pero sí la limpieza de la pregunta:

1. **«han comprado a su proveedor»** (pantalla y voz) es impersonal: se lee como «alguien ha comprado» y la ficha original decía «otra compañía» (se quitó por caracteres). Dos oraciones cortas seguidas en la voz («han comprado a su proveedor. Y que van a mover los datos…») empeoran la cohesión.
2. **«mover los datos a otro país»** no está entre las rutinas de monitoring de la lección (`:141`: «cambios de propiedad o de subcontratistas»; `fcp523`: «changes of ownership or of subcontractor»). Un cambio de país es un asunto de jurisdicción y de privacidad (5.4), y mete en la mesa una segunda razón por la que alguien podría contestar «due diligence» (la lección sitúa la jurisdicción dentro de la due diligence, `:47`). Mejor ceñirse a lo que la lección enseña como señal de monitoring.

**Corrección.**

- Voz `s05-01`: «<engaging> {q2}Otra más. Una empresa lleva dos años con su proveedor de correo. A mitad de contrato lee en la prensa que otra compañía ha comprado a su proveedor. Y que el servicio pasará a manos de otras subcontratas. ¿Dentro de qué actividad le toca reevaluarlo ahora?»
- `scenario` (123 caracteres): «A mitad de contrato, una empresa lee que otra compañía ha comprado a su proveedor de correo y que cambiará de subcontratas.»
- `why` (80): «El contrato ya corre: seguir los cambios de dueño o de subcontrata es monitoring».
- Voz `s05-02`: «<firm> {ok-2}Vendor monitoring, porque el contrato ya corre y los cambios de dueño o de subcontrata se vigilan. {trap-2}Due diligence tienta, porque suena a investigar.»
- Con «subcontratas» en el escenario, **Supply chain analysis** podría competir si se ofreciera: no está entre las opciones, no lo añadas (ver A-6).

### A-3 · CORREGIR · s04-01 y chip de s04 («sus cuentas»)

La voz dice «investigar a la agencia, **sus cuentas**, su dueño y sus brechas», y el rótulo de pantalla dice «cuentas · dueños · …». En un vídeo de seguridad, que va por «cuentas» de usuario, la sola palabra se oye como «cuentas de acceso», justo lo que el vídeo promete que la agencia **no** tiene (`no-access`). La lección dice «solidez financiera» (`:47`).

**Corrección.** Voz: «…Antes toca investigar a la agencia que elijas, sus finanzas, su dueño y sus brechas. Eso es la due diligence.» Pantalla (`before`): «finanzas · dueños · historial de brechas · certificaciones · referencias». («que elijas» aclara de qué agencia hablas, tras las tres candidatas de s02.)

### A-4 · CORREGIR · s03-02, tarjeta 2, s08-01 y s08-04 («lo independiente es quién lo firma»)

La idea de fondo es correcta, la formulación no. En el escenario de la pregunta 1 el informe interno **también está firmado** («formal, firmado y con metodología»); lo que lo hace no independiente no es quién lo firma sino **quién lo hace y si tiene interés en el resultado** (lección `:27`: «un tercero sin vínculo con el proveedor»; `q4`, `fcp527`: «el evaluador no tiene interés en el resultado»). El propio `trapWhy` de la pantalla lo dice bien: «la hizo el auditado». Con «quién lo firma» la respuesta que se enseña contradice la pista de la pregunta. Además la frase de cierre usa «firma» en dos sentidos seguidos («quién lo firma… si ya has firmado»).

**Corrección.**

- `s03-02` voz: «…{trap-1}Independent assessment tienta, porque parece serio, pero lo independiente no es cómo se ve, es quién lo hace.»
- Tarjeta 2 (43 caracteres): «Independiente es que no lo haga el auditado».
- `s08-01` voz: «Tres reglas. {rule-1}Lo que comprueba alguien de fuera pesa más que lo que dice el proveedor.» (y el texto de `rule-1` en pantalla: «Lo que dice el proveedor de sí mismo informa; lo que hace alguien de fuera pesa más, y se mira qué cubre y qué meses»).
- `s08-04` voz y `phrase`: «Mira quién ha hecho la prueba, mira si ya has firmado y mira qué tiene que fijar el papel.» Así el «firmar» queda para el contrato, y se evita además repetir el gancho de V39 («Vas a ver quién lo firma, quién lo comprueba…», `auditoria-halden` s01-03).

### A-5 · CORREGIR (condición del PR, no del guion) · `fcp520`

`sp5-cards.ts:33` dice «…checked before signing, **and checked again at renewal**». La lección (`:141`) pone la reevaluación de cada renovación dentro del vendor monitoring, `fcp523` dice «Due diligence happens before signing; vendor monitoring covers the rest», y la pregunta 2 de V42 premia exactamente eso. Quien repase la tarjeta y luego vea el vídeo recibe dos mensajes. El guion no se toca; **el PR del vídeo debe cambiar** el fragmento por: «…subcontractors and history checked before signing, and re-checked at renewal as part of vendor monitoring.» Y avisarlo en la descripción del PR (ya lo pide la ficha, duda 2, y `_revision.md` A-4).

### A-6 · OPCIONAL · opciones de la pregunta 2

«Dentro de qué **actividad**…» y las opciones «Rules of engagement» (un documento) y «Conflict of interest» (una situación) no son actividades, así que la pregunta se reduce a descartar dos opciones por categoría y decidir entre dos. No es incorrecto, pero hace la pregunta más fácil que las de las otras dos. Si se quiere: cambiar «Rules of engagement» por «Penetration testing» (actividad real de 5.3, claramente no activada por una noticia) y dejar «Conflict of interest». No añadir «Supply chain analysis» (competiría tras A-2) ni «Independent assessment» (la lección lo mete en el monitoring, `:141`). Si se hace, la resolución de la ficha («Rules of engagement… se apagan sin comentario») se actualiza igual.

### A-7 · OPCIONAL · imagen del MSA («el paraguas»)

El paraguas es la metáfora de la lección para el MSA (`:67`) y está bien en la voz y en la tarjeta 4. Pero el registro tiene ocupada **la imagen del paraguas plegado de V24** («un vídeo posterior no los usa para otra cosa», `reg:1274`, `:2935`). La escena `s06-papeles` (`msa`) no debe **dibujar** un paraguas; basta el rótulo de texto «el paraguas: responsabilidad, pagos, ley aplicable» o una marquesina/cubierta abstracta. Anotarlo en la ficha de escena antes de construirla.

### A-8 · OPCIONAL · cruces con otros vídeos de la tanda (no son contradicciones)

- **V41 (`roles-halden` s04-02):** «una empresa manda a los pasajeros los avisos de embarque» (processor). V42 dice que la agencia traduce «los avisos a pasajeros». No se contradicen (una traduce, otra envía), pero dos proveedores sobre los avisos a pasajeros en lecciones vecinas se oyen como el mismo. Si V41 se congela antes, V42 puede decir solo «los documentos de las navieras» en s02-01 y dejar los avisos para el SOW de s06 («la traducción del folleto de pasajeros»), que ya lo cubre.
- **Escenarios sanitarios:** V40 P2, V41 P1 y V42 P3 (`_revision.md` C-10). Se acordó dejarlo. Sigue siendo la única repetición audible de la tanda; con A-1 ya estás reescribiendo ese escenario, así que si interesa variarlo, «dos ayuntamientos vecinos» que reparten «autobuses» y «vigilantes» mantiene la estructura (cuidado: los bomberos municipales son de spl5b y la caserna de V47).
- **V39 y V43:** «independiente» y «due diligence» vuelven con otro enfoque a propósito (las fichas lo dicen). V43 P1 usa la due diligence de trampa igual que V42 P2; ya aceptado.

---

## B. Naturalidad

Se lee como la dirá Lidia a 1,08. En general es un guion limpio: frases cortas, ninguna supera 22 palabras, ningún colón de conector, el cierre es de tres reglas con una tarea, y los temas de seguridad nunca se deletrean. Lo que sigue es lo que no suena a persona.

### B-1 · CORREGIR · «firma» con tres sentidos (s02-04, s04-01, título de s03)

Se oye tres veces «firma» y significa tres cosas distintas: **empresa** («el informe de **una firma** de fuera», s02-04), **acto de firmar un contrato** («**La firma** parte la historia en dos», s04-01) y **quien suscribe un informe** («Un informe con firma», título de s03; «quién lo firma»). Al oído, sin ver la pantalla, «La firma parte la historia en dos» suena a que una empresa divide algo. Además V39 usa «una firma de fuera», «una firma independiente» y «una firma declara» (`auditoria-halden` s03-04, s05-01, s13-01): conviene que V42 no cargue con la misma palabra.

**Corrección.**
- `s02-04`: «<confident> {independent}La tercera trae el informe de una empresa auditora de fuera, sin vínculo con ella. Es una independent assessment, y pesa más. {scope-period}Se mira qué cubre y qué meses.»
- `s04-01`: «<engaging> {timeline}Firmar el contrato parte la historia en dos. {before}Antes toca investigar a la agencia que elijas, sus finanzas, su dueño y sus brechas. Eso es la due diligence.»
- Título de la escena s03 (`storyboard.json`): «Un informe muy serio» (no destripa la respuesta y no carga «firma»).

### B-2 · CORREGIR · MOU y MOA «por oído» (s06-05, s07-02, s07-03)

Con la pronunciación provisional del léxico, «eme o u» y «eme o a» se distinguen en una sola letra final, dicha de corrido y con la voz acelerada a 1,08. Es justo la diferencia sobre la que gira la pregunta 3; al oído, dichas seguidas en s06-05 («El MOU dice la intención, el MOA reparte compromisos, y el BPA…») son casi la misma palabra, y en la resolución de s07 el oyente que no mira la pantalla no sabe cuál es cuál. Ver la pantalla ayuda, pero la regla 3 del plan es que se entienda hablando.

**Corrección.** Ancla cada sigla a su palabra clave una vez, en s06-05, y repite el ancla en la resolución:
- `s06-05`: «<warm> {others}Y si dos organizaciones colaboran sin comprarse nada, hay tres papeles. El MOU, el memorando de entendimiento, deja por escrito la intención. El MOA, el de acuerdo, reparte compromisos. Y el BPA es de socios que reparten un negocio.» (+7 palabras; recuperables en B-6.)
- `s07-02`: «<firm> {ok-3}Es un MOA, el memorando de acuerdo, porque reparte compromisos. {trap-3}El MOU tienta, porque es una colaboración sin dinero, pero solo dice la intención.» (+4 palabras.)
- Alternativa más barata: que Lidia dé el «uve/ u» final con más peso en la grabación y que el léxico recoja esa pronunciación; no sustituye al ancla.

### B-3 · CORREGIR · s04-04, lista leída y cadencia inventada

«Después de firmar viene el vendor monitoring. Cuestionarios cada año, informes nuevos, las métricas del servicio, y noticias de dueños y subcontratas.» son cuatro fragmentos sin verbo seguidos, que es una lista leída (regla 8: más de tres elementos van a la pantalla), y **«cada año»** es una cadencia que la lección no da (`:141`: «una cadencia que depende de la criticidad del proveedor»). El rótulo de pantalla repite «cuestionario cada año».

**Corrección.**
- Voz `s04-04`: «<confident> {after}Después de firmar viene el vendor monitoring. {monitoring}O sea, seguir vigilando mientras dure: pedir cuestionarios, leer los informes nuevos, medir el servicio y estar atento a cambios de dueño o de subcontratas.»
- Pantalla (`monitoring`): «cuestionarios periódicos · informe independiente nuevo · métricas del servicio · noticias, dueños y subcontratas», y «reevaluar al renovar» como está.
- Además, el rótulo «métricas del SLA» de s04 pasa a «métricas del servicio (SLA)»: el SLA no se explica hasta s06 y la ficha ya evitó decirlo en la voz por esa razón (desviación 3); en pantalla pasa lo mismo (regla 3: ningún término antes de explicarlo).

### B-4 · OPCIONAL · s04-02 y s04-03, telegráficos

- `s04-02`: «Ahora se pide lo que luego querrás. Poder auditar, que te avisen de un incidente y que borren tus datos. Después, ya no puedes pedirlo.» «Poder auditar,» queda como fragmento, y «Ahora» choca con el «ahora» de la línea del tiempo. Propuesta: «Y es el momento de pedir lo que luego querrás: poder auditar, que te avisen si hay un incidente y que borren tus datos al terminar. Después, ya no te lo darán.» (un solo colón; ver regla 2).
- `s04-03`: «Si quien evalúa en Compras tiene un familiar en una candidata, es un conflict of interest. Lo declara y se aparta.» suena a redactado. Propuesta: «Otra cosa. Si alguien de Compras tiene un familiar en una de las candidatas, eso es un conflict of interest. Lo declara y se aparta.»

### B-5 · OPCIONAL · palabras repetidas con referentes distintos

- **«papeles»**: «los papeles de las navieras» (s02-01, documentos que se traducen) y «cuatro papeles» (s06, contratos). Propuesta s02-01: «…una agencia de traducción para los documentos de las navieras y los avisos a pasajeros.»
- **«folleto»**: el folleto de la guardería (s02-02) y «el folleto de pasajeros» (s06-03). Propuesta s06-03: «…la traducción de las instrucciones de embarque, con entregables y fechas» (también en pantalla).
- **s06-04**: «Por ejemplo, urgentes en veinticuatro horas, o descuento en la factura.» Sin ver la pantalla, «urgentes» queda colgando y «o» suena a alternativa. Propuesta: «Por ejemplo, las traducciones urgentes en veinticuatro horas. Y si no llegan, descuento en la factura.»

### B-6 · OPCIONAL · pequeños tics y recuperación de palabras

- **«toca/te toca/le toca»** sale en s01-02, s02-05, s03-01 («Te toca»), s04-01, s05-01 y s08-04, con dos sentidos («tu turno» y «hay que hacer»). Cambiar dos: s02-05 → «Si subcontrata, hay que hacer una supply chain analysis»; s04-01 ya cambia con B-1.
- **«Como la guardería.»** abre s03-03 y s04-05. Cambiar la primera a «Es la guardería otra vez. Su informe sobre sí misma puede ser muy serio, y sigue siendo suyo.»
- **s05-03**: «Pero esa va antes de firmar.» — «esa» queda a dos frases de la due diligence. Propuesta: «Pero la due diligence va antes de firmar. Aquí ya has firmado.»
- **s03-01**: tres atributos apilados («formal, firmado y con su metodología») más el origen. Propuesta: «…El proveedor le manda un informe formal, con metodología y firma. Lo ha hecho su propio departamento de auditoría interna.» (misma longitud; el segundo dato respira).
- Para pagar las +9 palabras de A-1, B-2 y B-3 sin pasar el presupuesto: quitar «Dos cosas más.» de s02-05 y «Por ejemplo,» de s06-03 y s06-04 (−6), y dejar «ni un documento de prueba» como «ningún documento» en s06-01 (−3).

### B-7 · OPCIONAL · el nombre antes que la idea (regla 3) en s06-01 y el gancho de s01-02

- `s06-01`: «…un NDA, la confidencialidad.» El nombre va antes que la idea. Propuesta: «Antes de mandarle ningún documento, hay que firmar la confidencialidad. Eso es un NDA.»
- `s01-02`: «qué toca y cuándo» no dice nada al oído. Propuesta: «Vas a ver cuánto vale cada prueba que te da un proveedor, qué se hace antes y después de firmar, y qué fija cada papel.» (+2 palabras).

---

## Veredicto

**Congelar tras corregir A-1, A-2, A-3, A-4, A-5 (en el PR) y B-1, B-2, B-3.** Ningún bloqueante: las tres preguntas tienen una respuesta defendible con el criterio del curso, el canon está limpio y no hay datos técnicos falsos. Lo que hay que arreglar es que la pregunta 3 pierde en pantalla el dato que la decide, que la 2 amplía lo que enseña la lección, que «quién lo firma» contradice la pista de la pregunta 1 y que tres cosas se oyen mal (la palabra «firma», MOU/MOA, la lista de s04-04). Los OPCIONALES se pueden dejar sin que el guion se rompa; B-5 y B-6 son los que más ganan por menos coste.

| Severidad | Cantidad | Hallazgos |
|---|---|---|
| BLOQUEANTE | 0 | |
| CORREGIR | 8 | A-1, A-2, A-3, A-4, A-5, B-1, B-2, B-3 |
| OPCIONAL | 7 | A-6, A-7, A-8, B-4, B-5, B-6, B-7 |

Tras los cambios hay que re-ejecutar `build-timeline --estimate` y ajustar `requiredCues` solo si se mueven los cues citados (ninguna corrección mueve un cue; B-1 cambia una frase de s02-04 y s04-01 pero conserva `independent`, `scope-period`, `timeline` y `before`).
