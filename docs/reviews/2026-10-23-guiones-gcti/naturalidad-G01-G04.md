# Revisión de naturalidad · G01–G04 (GCTI, sección 1 y 4)

Fecha: 2026-10-23. Revisor: solo lectura (no se ha tocado ningún guion). Guiones: `video/dato-a-juicio` (G01),
`video/niveles-audiencia` (G02), `video/ciclo-pir` (G03), `video/sesgos-analista` (G04).
Criterio: las doce reglas de «Narración hablada» (`docs/superpowers/plans/2026-09-25-lesson-videos.md` §1), las dos
preferencias de memoria (español natural y sin anglicismos de trabajo; pronunciaciones de Lidia) y el tono del modelo
publicado `video/hilos-pelicula`. Leídos: `narration.json`, `storyboard.json`, `lexicon.json`, `out/transcript-estimate.txt`,
`out/script-notes.md` y `out/timeline-estimate.json` de cada vídeo. El validador no da avisos en ninguno (ni «:», ni «;»,
ni «¿Y …?», ni etiquetas repetidas seguidas); lo que sigue es lo que el validador no ve.

Clasificación: **A CORREGIR** = rompe una regla, un sentido o la lectura en voz alta. **SUGERENCIA** = mejora de pulido.
Cada propuesta mantiene los cues `{…}` donde estaban; las que mueven un cue lo dicen.

## Resumen por vídeo

| Vídeo | Perfil | Estimado | Techo | Lectura esperable (88–93 %) | Hallazgos A CORREGIR | SUGERENCIA |
|---|---|---|---|---|---|---|
| G01 `dato-a-juicio` | principal-yt | 539 s | 600 s | 7:35–8:20 | 8 | 8 |
| G02 `niveles-audiencia` | capsula-yt | 249,8 s | 260 s | 3:40–3:50 | 8 | 8 |
| G03 `ciclo-pir` | principal-yt | 505,7 s | 600 s | 7:25–8:00 | 9 | 9 |
| G04 `sesgos-analista` | capsula-yt | 244,2 s (+4–6 s de voz de Laura) | 260 s | 3:35–3:50 | 7 | 6 |

---

## G01 · `dato-a-juicio`

### A CORREGIR

**G01-1 · s02-01 · EMBER FOX entra sin presentación y la frase se enreda.**
Actual: `Se cuela EMBER FOX con un atajo. Es verdad que una IP se puede bloquear, pero el CISO te ha pedido saber qué sabemos de ella.`
Problema: G01 es el primer vídeo de EMBER FOX en el curso (G02 no lo nombra, G03 lo presenta después) y nadie sabe quién es. En
`hilos-pelicula` («Se cuela GLASS VIPER, que no es más que tu mote…») el adversario se presenta en la misma frase. Además
«te ha pedido saber qué sabemos» junta «saber/sabemos» y mezcla tú con nosotros en una sola cadena.
Propuesta: `Se cuela EMBER FOX, un adversario con muy buena labia que siempre trae un atajo. Bloquear una IP se puede, claro. Pero el CISO no te ha pedido eso, te ha preguntado qué sabemos de ella.`
(La ficha en pantalla sigue siendo «célula de acceso inicial»; la voz no usa esa jerga.)

**G01-2 · s02-03 · calco del inglés y registro de papel.**
Actual: `Lo cruzas con otras fuentes y resulta que esa IP sirvió un panel de phishing el martes. Eso responde a una pregunta de hechos, y se llama información.`
Problema: «sirvió un panel» es calco de *served a phishing panel*; «responde a una pregunta de hechos» suena a manual.
Propuesta: `Lo cruzas con otras fuentes y resulta que esa IP alojó un panel de phishing el martes. Ya sabes qué hizo y cuándo. Eso se llama información, un dato con contexto.`

**G01-3 · s02-04 · el ejemplo de inteligencia no está marcado como ejemplo y «registros» es ambiguo.**
Actual: `Falta el juicio. Creemos que el atacante probablemente volverá a usar este proveedor, y recomendamos vigilar los registros nuevos en su red. Eso ya es inteligencia.`
Problema: sin una entrada («una frase como esta»), parece que la narradora afirma algo del caso; y «registros nuevos en su red» se confunde con «el registro del proxy» de s01-03. La propia nota (e.5) ya duda de «en su red».
Propuesta: `Falta el juicio. Una frase como esta: «creemos que el atacante probablemente volverá a usar este proveedor, y recomendamos vigilar los dominios nuevos que aparezcan en él». Eso ya es inteligencia.`
(Sin dos puntos: «Una frase como esta» + comillas; si se prefiere, `Falta el juicio, algo así como «creemos que…»`.)

**G01-4 · s03-02 · «lo dejó muy claro» no tiene a qué referirse.**
Actual: `Sherman Kent, al que se considera el padre del análisis de inteligencia moderno, lo dejó muy claro. Analizar es trabajar con una incertidumbre que no se puede eliminar.`
Problema: el «lo» apunta a una idea que viene en la frase siguiente; en la voz suena a que falta algo, y el inciso «al que se considera» es de texto escrito.
Propuesta: `A Sherman Kent lo llaman el padre del análisis de inteligencia moderno, y lo tenía claro. Analizar es trabajar con una incertidumbre que no se puede eliminar.`

**G01-5 · s06-01 · frase de 20 palabras y «el sector de una empresa» no se entiende al oído.**
Actual: `Practica con otro caso, que no es de Meridian. Un grupo tiene un ransomware que funciona y dice en público que va a por el sector de una empresa.`
Propuesta: `Mira otro caso, que no es de Meridian. Hay un grupo con un ransomware que funciona, y anuncia en público que va a por empresas de cierto sector.` Y en s06-02: `Pero los sistemas de una de esas empresas están en una instalación aislada, sin acceso remoto. ¿Qué pieza falta?`
(«Practica con otro caso» queda raro: el espectador no practica, mira. Y «componente» pasa a «pieza», que es la palabra de s05.)

**G01-6 · s08-03 · «la pista que más dura» se lee como «la pista más dura» y repite s08-01.**
Actual: `Por eso el comportamiento es la pista que más dura. Bloquear ficheros sigue valiendo, pero él los cambia en una tarde.`
Problema: ambigüedad de «dura» (verbo/adjetivo) al oído; la segunda frase repite casi literal s08-01 («cambia de caña en una tarde»), y «él» queda suelto.
Propuesta: `Por eso el comportamiento es la pista que más aguanta. Bloquear ficheros sigue valiendo, pero solo hasta que los cambia.`
Si hay que recortar, este segmento es el primero que sobra (8,8 s): s08-04 ya cierra con la misma idea.

**G01-7 · s09-01 · 22 palabras con lista y aposición.**
Actual: `Hasta aquí, la amenaza. Pero el consejo piensa en riesgo, y una forma habitual de verlo combina tres factores, la amenaza, la vulnerabilidad y la consecuencia.`
Propuesta: `Hasta aquí, la amenaza. Pero el consejo piensa en riesgo. Y una forma habitual de verlo mezcla tres factores. La amenaza, la vulnerabilidad y la consecuencia.`

**G01-8 · s10-04 · «kill chain» se usa sin explicar (regla 3).**
Actual: `Para eso existe la inteligencia de amenazas, para conocer los pasos probables del adversario y poner detecciones en su camino. La sección dos lo desarrolla con la kill chain.`
Propuesta: `Para eso existe la inteligencia de amenazas, para conocer los pasos probables del adversario y ponerle avisos en el camino. La sección dos lo desarrolla con un modelo que se llama kill chain, la cadena de un ataque.`
(«Poner detecciones» es jerga; «ponerle avisos» se entiende a la primera. Si se prefiere mantener «detecciones», que sea tal cual en pantalla.)

### SUGERENCIA

**G01-9 · s01-01/s01-02/s01-05 · hook y promesa.** Actual s01-01: `Es tu primera mañana en Meridian, una aeroespacial, y eres su primera analista de inteligencia.` Tropieza con «primera… primera» y arranca con presentación, no con gancho; la promesa larga (`promise`, 21 palabras) llega a los 35 s (G02: 14,5 s; G04: 16,6 s). El título cae a los 7,8 s y ya promete («de un dato suelto a un juicio»), así que no incumple la regla, pero la sinopsis tarda.
Propuesta de apertura: s01-01 `<curious> {meridian}Es tu primera mañana en Meridian, una aeroespacial, y eres la analista de inteligencia que acaban de fichar.` y s01-05 más corto y movido tras el título: `<engaging> {promise}Vas a ver cuándo un dato ya es inteligencia, qué es una amenaza de verdad y qué parte del riesgo es tuya.` (20 palabras; antes, 21). Si se quiere la promesa antes de las 15 s, el orden s01-01 → s01-02 (title) → promesa → CISO → IP exige reordenar cues y la maqueta de s01; decidirlo con la maqueta delante.

**G01-10 · s05-01 · «Pasemos a la amenaza».** El «pasemos» (primera persona del plural de clase) rompe el tuteo. Propuesta: `Vamos con la amenaza. En la calle, amenaza es cualquier cosa mala. En inteligencia, la palabra es mucho más precisa.`

**G01-11 · s05-02 · «coinciden tres cosas en un adversario».** Se lee torpe. Propuesta: `Hay amenaza cuando un adversario reúne tres cosas. {intent}La primera es la intención. Quiere algo de ti, ya sea dinero, propiedad intelectual o parar tu actividad.`

**G01-12 · s06-02 · la tarjeta de pensar regala la respuesta.** Tarjeta: «Capacidad e intención, sin acceso: ¿qué falta?». Si la tarjeta ya dice qué hay y qué no, no hay nada que pensar. Propuesta: `Instalación aislada, sin acceso remoto: ¿qué pieza falta?` (o `¿Qué pieza falta?` a secas, con las tres piezas atenuadas en pantalla).

**G01-13 · s07-04 · sigla antes que su idea.** Actual: `Esos comportamientos son los TTPs, las tácticas, técnicas y procedimientos del atacante.` Propuesta: `Esos comportamientos son las tácticas, técnicas y procedimientos del atacante, lo que verás escrito como TTPs.`

**G01-14 · s09-04 y s09-06 · tres «o sea» en una escena corta y «aportación».** s09-04: `Tu aportación es evidencia real, o sea, qué actores existen, a quién apuntan y cómo trabajan.` Propuesta: `Lo que tú pones sobre la mesa son pruebas de verdad. Qué actores existen, a quién apuntan y cómo trabajan.` Y s09-06 deja su «O sea, que…» de cierre de capítulo (regla 4). Además `Es decir, tú.` (s09-02, remate del chiste) pide 500 ms de pausa y una etiqueta más viva que `steady`; hoy se lee plano.

**G01-15 · s04-01 · «Vuelve a tu IP… volverá».** Eco en la frase clave. Propuesta: `Retoma tu IP. Hay dos formas de decírselo al CISO. «El atacante volverá a usar este proveedor», o «probablemente volverá a usarlo». ¿Cuál mandas?`

**G01-16 · s11-01..03 · «tres ideas» que en realidad son cinco.** s11-03 mete dos cosas (riesgo y ventaja del defensor). Propuesta s11-03: `Y tu trabajo alimenta la amenaza dentro del riesgo, y juegas en tu terreno, que es una ventaja.` O repartir: «tres ideas» = dato→inteligencia, amenaza = tres piezas (el malware es solo una), tu sitio en el riesgo; la ventaja del defensor queda en s10.

### Ritmo, etiquetas, analogías de G01
- Etiquetas: sin repetición seguida; bien repartidas. Las tres primeras de s05 (`focused`, `steady`, `clear`) son un mismo registro sereno en fila; poner `curious` o `confident` en s05-03 da relieve a «la capacidad».
- Analogías: el capitán sin GPS (estima y corrige) es buena y no se estira; la caña y el pescador funcionan en s07–s08; el triángulo del fuego, igual. Tres imágenes en un principal con cinco conceptos está dentro del presupuesto.
- Inglés: `defender's advantage` (s10-03) y `intent, capability, opportunity` (s05-06) son términos de examen, explicados antes. Bien. «phishing» no tiene entrada en `lexicon.json` (decidir cómo lo dice Lidia).

---

## G02 · `niveles-audiencia`

### A CORREGIR

**G02-1 · s01-01/s01-02 · los «sobres» solo existen en pantalla, y «Las dos» no tiene antecedente.**
Actual s01-01: `Eres la analista de Meridian. {board}Hoy el consejo quiere saber hacia dónde va el sector, {soc}y el SOC, qué tiene que bloquear ya.`
Actual s01-02: `{title}Las dos piden inteligencia, pero no la misma. …`
Problema: la voz nunca dice «sobre» hasta s03-01 («cruzas los dos sobres»), s05-05, s06-02 y el cierre. La imagen se monta en pantalla (título de escena «Dos sobres sobre tu mesa») pero quien solo oye (o lee subtítulos) llega a s03 sin saber qué sobres. «Las dos» (peticiones) tampoco aparece en la voz: los sujetos son «el consejo» y «el SOC».
Propuesta s01-01: `<curious> Eres la analista de Meridian y hoy tienes dos sobres sobre la mesa. {board}En uno, el consejo quiere saber hacia dónde va el sector. {soc}En el otro, el SOC pregunta qué tiene que bloquear ya.`
Propuesta s01-02: `<confident> {title}Los dos piden inteligencia, pero no la misma. {promise}Verás los tres niveles, la escala que ordena las defensas y por qué no se empieza por el tejado.`
(`board` y `soc` se mantienen sobre las dos frases de los sobres.)

**G02-2 · s03-05 contra s06-01/02 · la numeración de reglas se contradice.**
Actual s03-05: `Por eso la primera regla es producto correcto para audiencia correcta.` Cierre: rule-1 = el nivel lo marca quién lee; rule-2 = producto correcto para audiencia correcta. Además s04-01 dice «La segunda pieza» (cuenta piezas, no reglas).
Problema: cuatro numeraciones distintas en 4 minutos (primera regla, segunda pieza, tres reglas, rule-1/2/3).
Propuesta s03-05: `Por eso hay una regla que no se negocia, producto correcto para audiencia correcta. Antes de escribir, mira quién va a leer.` Y s04-01 abre sin ordinal: `Ahora, la escala que ordena las defensas en cinco categorías. Se llama Sliding Scale of Cyber Security. Imagínate una casa.`

**G02-3 · s04-03 contra s04-06 · el ejemplo de la pregunta ya se ha dado.**
Actual s04-03: `Luego, la puerta blindada, que protege sin que nadie la maneje. Eso es Passive Defense, como el cortafuegos o el EDR.` y s04-06: `Un EDR bloquea malware conocido sin que nadie intervenga. ¿En qué categoría va?`
Problema: la respuesta se ha dicho tres segmentos antes. La pausa para pensar no piensa nada.
Propuesta s04-03: `Luego, la puerta blindada, que protege sin que nadie la maneje. Eso es Passive Defense, como un cortafuegos.` (el EDR se reserva para la pregunta).

**G02-4 · s04-05 y s05-03 · la casa se rompe: «Encima, Intelligence» frente a la linterna del storyboard y al «tejado».**
Actual s04-05: `Encima, Intelligence, conocer al adversario para informar al resto. Y al final Offense, acciones legales contra el adversario, casi siempre cosa de estados.` y s05-03: `Es empezar la casa por el tejado.`
Problema: el storyboard dibuja Intelligence como una linterna que ilumina la casa «sin ser parte de ella», y Offense apagada con candado; la voz dice «encima» (como un piso) y luego usa «tejado» para el informe de inteligencia. Quien oye entiende que Intelligence es el tejado, pero nunca se dice, y Offense queda fuera de la imagen. «Informar al resto» es vago. La analogía no sostiene el chiste del título.
Propuesta s04-05: `Después, una linterna que ilumina toda la casa, Intelligence: conocer al adversario para avisar al resto de defensas. {offense}Y al final, Offense, que ya sale de la casa. Son acciones legales contra el adversario, casi siempre cosa de estados.`
Propuesta s05-03: `Sin una base defendible, tu informe es un tejado sin casa: llega y no hay quién lo use. Es empezar por el tejado.` (sin dos puntos: `…es un tejado sin casa. Llega, y no hay quién lo use.`).

**G02-5 · s04-04/s04-07 · «en el bucle» es calco de *in the loop*.**
Actual: `una persona en el bucle` / `sin una persona en el bucle`.
Propuesta s04-04: `Después, el vigilante que hace la ronda, una persona que decide sobre la marcha. Eso es Active Defense, con monitorización y caza de amenazas.` s04-07: `Passive Defense, porque protege sin que intervenga una persona. Si un analista lo usara para cazar, ya sería Active Defense.` (La pantalla puede conservar «operador en el bucle», que es la frase de la lección.)

**G02-6 · s06-01 · idéntico a G04 s06-01.** `Todo cabe en tres reglas.` abre la recapitulación de G02 y de G04. Ver sección de repeticiones; propuesta para G02: `<engaging> {recap}Esto se resume en tres reglas. {rule-1}El nivel lo marca quién lee y qué tiene que decidir.` (de paso, «cuándo decide» pasa a «qué tiene que decidir», como en s02-06; hoy una regla habla de tiempo y la otra de contenido).

**G02-7 · s03-02 · el consejo «no puede bloquear».** Actual: `Al consejo le llega una lista de [4.000|cuatro mil] direcciones. {board-gets}No puede bloquear nada ni decidir dónde invertir con ella.` El consejo nunca bloquea; el chiste se ensucia. Además «direcciones» a secas suena a calles. Propuesta: `Al consejo le llega una lista de [4.000|cuatro mil] direcciones IP. {board-gets}Con eso no puede decidir dónde invertir ni qué riesgo aceptar.` (repite los verbos de s02-05, que es lo que se busca) y el mensaje: `Mándale al consejo todas las IPs. Cuantas más, más seria parece.`

**G02-8 · s03-01 · «Haz la prueba e imagina».** Actual: `Seria, sí. Útil, ya es otra cosa. Haz la prueba e imagina que cruzas los dos sobres.` Se «hace la prueba» o se «imagina», no las dos. Propuesta: `Seria, sí. Útil, ya es otra cosa. Imagina que cruzas los dos sobres.`

### SUGERENCIA

**G02-9 · s02-03..05 · tres términos ingleses seguidos en medio de frases españolas.** `El parte de hoy es el nivel tactical, … La previsión es el operational, … el clima es el strategic`. La lección los escribe en inglés (`src/data/s1.ts:348`), la idea llega primero (bien, regla 3), pero «es el strategic» y «es el operational» al oído son espanglish y obligan a Lidia a respellings en el léxico (`táctical`, `operéishonal`, `estratéyic`). Propuesta: el nombre español en la frase y el inglés como etiqueta, una vez: `El parte de hoy es el nivel táctico, tactical en el examen, el del SOC, con indicadores y reglas que valen horas o días.` / `La previsión es el nivel operativo, operational, para quien caza amenazas y se pregunta cómo trabaja este grupo. Sus informes de campaña valen semanas o meses.` / `Y el clima es el nivel estratégico, strategic, para el CISO y el consejo, que preguntan dónde invertir y qué riesgo aceptar. Son tendencias que valen meses o incluso años.` (arregla de paso «a meses o años»). Pregunta a Lidia cuál le sale natural; si dice «táctico» los tres respellings se borran del léxico.

**G02-10 · s02-01 · «Como el tiempo».** `La inteligencia no es para todos, es para alguien. Como el tiempo.` «El tiempo» puede ser reloj o clima y el giro es críptico. Propuesta: `<warm> {forecast}La inteligencia es como el tiempo. Cada uno necesita una previsión distinta. {today}Para salir de casa ahora, el parte de hoy.`

**G02-11 · s04-01 · nombre antes que idea.** Cubierto en G02-2 (se dice qué hace la escala y luego cómo se llama). Si se mantiene la forma original, mejor `La segunda pieza es una escala que ordena las defensas en cinco categorías, la Sliding Scale of Cyber Security.`

**G02-12 · s05-02 · «izquierda/derecha» y «retorno».** `Lo de la izquierda da la base y el mejor retorno, y lo de la derecha solo rinde si esa base existe.` (La barra de la pantalla sí es horizontal, pero la voz acaba de construir una casa en vertical y quien solo oye pierde el eje.) Propuesta: `La inteligencia multiplica lo demás, no lo sustituye. Lo primero de la escala da la base y es lo que más compensa. Lo que viene después solo rinde si esa base existe.`

**G02-13 · s05-04 · sujeto elíptico.** `Con base, en cambio, ayuda al SOC, a la respuesta y a la dirección.` Propuesta: `Con una base sólida, en cambio, tu informe le sirve al SOC, a quien responde a incidentes y a la dirección.`

**G02-14 · s03-03 · etiqueta.** `Muy interesante, pero ni una regla ni un indicador para hoy.` es el remate de la escena y va en `serious`; con `sarcastic` o `deadpan` (`dry`) cae mejor. Cuidado con repetir `sarcastic` (s03-01 ya lo es, a dos segmentos); si hay que elegir, `casual`.

**G02-15 · presupuesto de conceptos.** Una cápsula admite 2–3 conceptos clave; aquí hay cuatro (niveles, error de cruzar productos, escala de cinco categorías, base antes que inteligencia) y ocho términos ingleses (tactical, operational, strategic, Architecture, Passive, Active, Intelligence, Offense). Es lo más denso de los cuatro por minuto. Si se quiere aliviar: el nombre inglés de Architecture y Offense puede quedarse solo en pantalla, y la voz decir «los cimientos» y «la respuesta ofensiva».

**G02-16 · léxico.** `IP` no tiene entrada en `lexicon.json` (añadirla, «i pe», si se usa «direcciones IP»); 13 respellings de palabras inglesas es mucho riesgo para el anclaje de la grabación (la nota (3) del propio guion ya lo avisa). Comprobar también cómo lee la voz SAPI del mensaje «IPs» (el motor puede decir «ips»).

### Ritmo, humor y analogías de G02
- Los dos mensajes de EMBER FOX son cortos y suenan a su sitio: «Cuantas más, más seria parece» y «Los parches, ya si eso» son lo mejor de la voz del adversario en los cuatro guiones. Los 66 y 60 caracteres se hablan en ~5 s; el de 66 va justo.
- Lo vivo: «Seria, sí. Útil, ya es otra cosa.» y «Los dos se quedan sin respuesta… darle a cada uno lo del otro.» funcionan muy bien al oído.
- Analogía del tiempo: simplifica (una previsión semanal no es «semanas–meses»), pero solo se dice «la previsión» sin plazo y el plazo lo da la tabla; es aceptable. La casa se estira en s04–s05 (ver G02-4): arreglado eso, queda una analogía por concepto.

---

## G03 · `ciclo-pir`

### A CORREGIR

**G03-1 · s01-01 · casi la misma frase que abre G01, y «Proponme» es voseo.**
Actual: `Estás en Meridian, una aeroespacial, y eres su primera analista de inteligencia. {ask}El CISO te pide una cosa. «Proponme nuestros primeros PIRs».`
Problema: «…en Meridian, una aeroespacial, y eres su primera analista de inteligencia» es la frase de G01 s01-01 con otro verbo. Y «Proponme» (imperativo rioplatense) choca con el tuteo español de todo el guion; con tú sería «Propónme». La lección escribe «Proponme» (`src/data/s1.ts:749`), pero Lidia es de España y el CISO habla con «tú» en el resto.
Propuesta: `<serious> El CISO de Meridian, la aeroespacial donde acabas de empezar, te encarga una cosa. {ask}«Propónme nuestros primeros PIRs».` (Si se quiere la literalidad de la lección, que la pantalla conserve «Proponme».)

**G03-2 · s02-01 · jerga en la voz y «Se cuela» repetido con G01.**
Actual: `Se cuela EMBER FOX, una célula de acceso inicial, con un consejo muy amable. Y es tentador, porque recoger datos parece avanzar.`
Problema: «célula de acceso inicial» es jerga de ATT&CK sin explicar (la ficha en pantalla ya la lleva); «Se cuela» es la fórmula de G01 s02-01 (y de `hilos-pelicula`). Si G01 presenta a EMBER FOX (G01-1), aquí ya no hace falta presentarlo.
Propuesta: `<sarcastic> {reply-i}Vuelve EMBER FOX, con un consejo muy amable. Y es tentador, porque recoger datos parece avanzar.`

**G03-3 · s02-04 · «responderla» sin antecedente y «con quien decide qué necesita saber» se lee dos veces.**
Actual: `La primera se llama Planning and Direction. Ahí defines con quien decide qué necesita saber, y eso son los requirements. Si falta, nada de lo que viene después puede responderla.`
Propuesta: `<firm> {planning}La primera se llama [Planning & Direction|Planning and Direction]. Ahí te sientas con quien decide y acordáis qué necesita saber. A eso se le llama requirements. Si no están, ninguna de las fases siguientes tiene a qué contestar.`

**G03-4 · s03-01 · 21 palabras, dos «por».**
Actual: `Imagina que nadie escribe la comanda. Tú, por no perder tiempo, te suscribes a doce fuentes que no paran de mandarte datos, los feeds, por tenerlo todo.`
Propuesta: `Imagina que nadie escribe la comanda. Para no perder tiempo, te apuntas a doce fuentes de datos, doce feeds que no paran de mandarte cosas.` y s03-02 `Doce feeds para tenerlo todo, y ninguna pregunta detrás. ¿Qué fase te has saltado?` (el eco «para tenerlo todo» queda como estribillo deliberado). «Feeds» está en la lección (`s1.ts:540`) y se explica en la frase: aceptable.

**G03-5 · s03-04 · enumeración de cuatro infinitivos.**
Actual: `Hay que convertirlos en algo analizable, traducirlos, normalizarlos, detonar un programa sospechoso en un entorno aislado.` (regla 8: más de tres elementos va a la pantalla.)
Propuesta: `Hay que dejarlos listos para analizar. Traducirlos, ordenarlos y hasta detonar un programa sospechoso en un entorno aislado. Eso es [Processing & Exploitation|Processing and Exploitation].`

**G03-6 · s04-01 · nombre antes que idea y coma que une.**
Actual: `Supón que aun así llegas a Analysis and Production. Es la fase de los juicios, aplicas técnicas y escribes una valoración con su nivel de confianza.`
Propuesta: `Supón que aun así llegas a la fase de los juicios, Analysis and Production. Aquí aplicas técnicas y escribes una valoración, diciendo cuánto te fías.`

**G03-7 · s06-05 contra s08-01 · «si aplica» y contradicción «las prioridades caducan» / «preguntas que no caducan».**
Actual s06-05: `Y si aplica, lleva fecha, porque las prioridades caducan.` («si aplica» es calco de *if applicable*.)
Actual s08-01: `Hay preguntas que no caducan. «¿Qué actores apuntan a nuestro sector?» se hace siempre, y se revisa cada cierto tiempo.`
Propuesta s06-05: `Y si hace falta, lleva fecha, porque las prioridades caducan.` s08-01: `<warm> {standing}Hay preguntas que se repiten siempre. «¿Qué actores apuntan a nuestro sector?» es una de ellas, y se revisa cada cierto tiempo. Son los standing requirements, la carta fija del restaurante.`

**G03-8 · s05-01 · etiqueta que no pega y arranque sin referente; el mensaje repite «a otra cosa» de G01.**
Actual: `<warm> {reply-iii}Pasa mucho cuando el equipo de respuesta contiene un incidente. Parece que ya está, pero queda trabajo con la evidencia que se capturó.` y mensaje `Cerrado el incidente, a otra cosa. Mirar atrás es perder tiempo.`
Problema: `warm` para contestar al adversario; «Pasa mucho» sin sujeto claro; «a otra cosa» ya está en el mensaje de G01 (`Bloquéala y a otra cosa`).
Propuesta: `<serious> {reply-iii}Esa prisa es muy típica cuando el equipo de respuesta contiene un incidente. Parece que ya está, pero queda trabajo con la evidencia capturada.` Mensaje: `Incidente cerrado, pasa página. Mirar atrás es perder tiempo.`

**G03-9 · s09-02 · ocho palabras inglesas seguidas.**
Actual: `Si lees convert, decode o normalize, es Processing. Si lees judgment o hypothesis, Analysis. Y si lees requirements o tasking, Planning.` (y «tasking» no se explica en ningún sitio).
Problema: es truco de examen, pero al oído son tres listas en inglés en 9 s y es lo que más se parecerá a leer una tabla. La tabla ya está en pantalla.
Propuesta: la voz da la regla y deja las listas a la pantalla: `<clear> {words}Fíjate en el verbo. Los de convertir, decodificar o normalizar son de Processing. Los de juzgar o suponer, de Analysis. Y los de pedir o encargar, de Planning.` (y las palabras inglesas salen en el cue). Si Lidia prefiere decirlas en inglés, que sea una sola por fase.

### SUGERENCIA

**G03-10 · s02-03 · coma que une.** `El ciclo de inteligencia funciona igual, convierte preguntas en respuestas…` Propuesta: `El ciclo de inteligencia funciona igual. Convierte preguntas en respuestas que se pueden usar. Son seis fases, y las que más se olvidan son la primera y la última.`

**G03-11 · s03-03 · «data hoarding».** Está en la lección (`s1.ts:562`) pero no es término del examen y «acaparas» ya lo dice. Propuesta: `La primera, Planning. Collection es obtener los datos crudos de las fuentes que habías planificado, y sin plan solo acaparas.` (o dejar «data hoarding» solo en pantalla).

**G03-12 · s04-06 · «Por eso se ignoran» no encadena.** `…y sin feedback ni te enteras. Por eso se ignoran justo la primera fase y la última.` Propuesta: `O sea, que sin pregunta el ciclo falla en cadena, y sin feedback ni te enteras. Por eso se descuidan justo la primera fase y la última: su fallo no hace ruido.`

**G03-13 · s05-03/04 · inglés antes que español.** `Los tres primeros, Find, Fix y Finish, son la operación. Localizar, fijar y neutralizar…` Regla 3: primero la idea. Propuesta s05-03: `Los tres primeros son la operación. Localizar, fijar y neutralizar, o sea, contener el incidente. En inglés, Find, Fix y Finish.` s05-04: `Los tres últimos son la inteligencia. Explotar la evidencia capturada, analizarla y difundirla, que en inglés son Exploit, Analyze y Disseminate.`

**G03-14 · s05-07 · «O sea, que» repetido.** s04-06 y s05-07 abren igual. Propuesta s05-07: `Dicho de otra manera, no compiten. Uno marca el ritmo de siempre, y el otro acelera cuando arde algo.`

**G03-15 · s06-03 · la sigla se desarrolla a los 4:41.** Se habla de PIRs desde el segundo cero. Propuesta (o dejarlo): s01-02 `Un PIR es una pregunta importante de verdad, de esas cuya respuesta le cambia a alguien una decisión.` y s06-03 `La sigla viene de Priority Intelligence Requirement. Uno bien formado es una sola pregunta, concreta, que nombra un sector, un actor o una tecnología.`

**G03-16 · s07-03 · pensar sin tiempo de leer.** La pausa (4,5 s) tiene que cubrir leer dos candidatas completas en pantalla. Revisar en la maqueta; si no llegan, que la voz lea la mitad de cada una o `holdMs` 5000.

**G03-17 · s07-05 y s08-02/03 · «la hace la», «expiran al responderse», «hacen lo mismo con la colección, la dirigen».** Propuestas: s07-05 `Ojo, que una pregunta bien formada no es automáticamente la prioritaria de tu empresa. Eso lo valida quien decide, y puede que prefiera otra.` s08-02 `Otras nacen de un suceso, como una fusión o un incidente. Son el encargo de un banquete, y se acaban cuando las respondes. Esas son las ad hoc.` s08-03 `Y las dos sirven para lo mismo, dirigir la colección. Cada PIR se descompone en preguntas más pequeñas, y cada una se asigna a una fuente concreta.`

**G03-18 · s09-03 · coma de aposición.** `Y recuerda quién manda, los requirements dirigen la colección, y no al revés.` Propuesta: `Y recuerda quién manda aquí. Los requirements dirigen la colección, no al revés.`

### Ritmo, humor y analogías de G03
- Los cuatro mensajes son útiles pero tres suenan a jefe, no a vendedor: el único realmente «vendedor» es `Tú recoge de todo, que ya encontrarás la pregunta.` Propuesta para dar la misma firma a EMBER FOX en todo el arco: `Tú recoge de todo y no te compliques, que la pregunta ya saldrá.` (63 caracteres.)
- Analogía del restaurante: sostiene ciclo, PIR (la comanda bien pedida) y standing/ad hoc (carta fija/banquete) y vuelve; los engranajes (F3EAD) son una segunda imagen, pero para un concepto distinto, así que cumple «una por concepto». Las seis fases del restaurante (pide, compra, prepara, cocina, sirve, opina) solo se reutilizan en las dos puntas y en «plato/otra mesa»; está bien: no estirar más.
- Densidad: seis conceptos (límite del principal) con unos 20 términos ingleses (seis fases, seis verbos de F3EAD, standing, ad hoc, Collection Management Framework, data hoarding, requirements…). Es el guion que más se parecerá a una clase de inglés en voz alta. Si hay que aligerar, recortar `s08-04` (CMF, 5,2 s), `s09-02/03` (14,7 s) y los verbos ingleses de F3EAD que no tienen tarjeta.
- Pronunciación: `lexicon.json` lleva «fox» y el de G01 lleva «foks». Decidirlo una vez con Lidia y copiarlo.

---

## G04 · `sesgos-analista`

### A CORREGIR

**G04-1 · s01-01 y s06-01 · aperturas idénticas a las de G02.**
s01-01 actual: `Eres la analista de Meridian y el CISO te pregunta quién ha sido. …` G02 abre con «Eres la analista de Meridian.» Propuesta: `<intrigued> {ciso}El CISO te pregunta quién ha sido. {hunch}Y tú ya tienes una respuesta en la cabeza.` (El rótulo «Meridian Dynamics» lo pone la pantalla.)
s06-01 actual: `Todo cabe en tres reglas.` (idéntico a G02 s06-01). Propuesta: `<engaging> {recap}Vamos a dejarlo en tres reglas. {rule-1}Primera, el instrumento eres tú, y se corrige con estructura, no con ganas.`

**G04-2 · s04-05/s04-06 · la pregunta para pensar no se puede contestar y el sujeto cambia.**
Actual s04-05: `Esa frase suena muy segura. ¿Qué falla ahí?` (tarjeta: «¿Qué sesgo hay en esa frase?»).
Actual s04-06: `Das por hecho que el adversario razona como tú. Eso es mirror imaging. Tú no reutilizarías, pero los actores de verdad se equivocan, y mucho.`
Problema: el cuarto sesgo no se ha nombrado, así que «¿qué sesgo?» no se puede contestar de memoria; lo único contestable es qué da por hecho la frase. Y en s04-06 «Das por hecho» pone el error en boca de la espectadora, cuando quien lo dijo fue «alguien» (s04-04).
Propuesta s04-05: `<engaging> Esa frase suena muy segura. ¿Qué da por hecho?` con tarjeta «¿Qué da por hecho esa frase?». s04-06: `<confident> {verdict}Da por hecho que el adversario razona como tú. Eso es mirror imaging, como jugar al ajedrez creyendo que el otro piensa igual que tú. Los actores de verdad se equivocan, y mucho.` (incluye el tablero de ajedrez que el storyboard dibuja y la voz nunca dice.)

**G04-3 · s03-04 · «log» y «forzado».**
Actual: `Entonces llega un log nuevo que encaja a duras penas, y tú lo lees forzado hasta que cuadra.`
Propuesta: `Entonces llega un registro nuevo que encaja a duras penas, y tú lo lees con calzador hasta que cuadra.` («Registro» es lo que usa G01 s01-02; «con calzador» es el idioma exacto.)

**G04-4 · s03-05 y s05-02 · «pesas» (verbo) frente a «pesa» (la imagen).**
Actual s03-05: `Buscas y pesas solo lo que confirma lo que ya pensabas.` y s05-02: `La primera pesa es intentar tumbar tu hipótesis favorita…`
Problema: el verbo «pesas» y el sustantivo «pesa» chocan con la imagen central de la báscula (se lee «pesas» y se piensa en la báscula; con «La primera pesa es» el oído duda: ¿verbo o nombre?).
Propuesta s03-05: `Eso es el confirmation bias, el más letal en atribución. Buscas y valoras solo lo que confirma lo que ya pensabas.` s05-02: `La primera pesa de fuera es intentar tumbar tu hipótesis favorita en vez de apoyarla. Eso es justo lo que hace ACH, una técnica que verás más adelante en esta sección.`

**G04-5 · s05-04 · paralelismo roto.**
Actual: `Y la tercera, apuntar tu juicio por escrito antes de saber cómo acaba, para que luego nadie diga que era evidente.` (después de «La primera pesa es intentar…» y «La segunda es que alguien…»).
Propuesta: `Y la tercera es apuntar tu juicio por escrito antes de saber cómo acaba, para que luego nadie diga «ya era evidente».`

**G04-6 · s03-02 · «se te queda clavado como un ancla».** Un ancla no se clava, se echa/engancha. Propuesta: `Ese dato echa el ancla en tu cabeza, y todo lo que llega después lo miras desde ahí. Eso es el anchoring.`

**G04-7 · s06-02 · promete algo que no se ha dado.** Regla 2: «aprende la frase que delata cada atajo». Se dan frase-señal de confirmación («esto también lo confirma»), availability («está en todas las noticias») y mirror (la frase entera), pero no de anchoring. Propuesta s03-02: `Ese dato echa el ancla en tu cabeza, y todo lo que llega después lo miras desde ahí. Eso es el anchoring. La frase que lo delata es «según el primer informe».` (suma unos 3 s en una cápsula casi en el techo: compensarlo con el recorte de s02-05.)

### SUGERENCIA

**G04-8 · s02-02 · «conecta con atajos».** `Percibe, recuerda y conecta con atajos, que en la vida diaria funcionan de maravilla.` Propuesta: `Pues tu cabeza es esa báscula. Percibe, recuerda y saca conclusiones con atajos, que en la vida diaria funcionan de maravilla. {fail}En el análisis, te traicionan.`

**G04-9 · s04-04 · «de otro tipo».** `El cuarto es de otro tipo. Alguien suelta que un actor sofisticado nunca reutilizaría infraestructura…` Propuesta: `El cuarto es distinto, porque ya no habla de lo que ves, sino de cómo piensa el otro. Alguien suelta que un actor sofisticado jamás reutilizaría su infraestructura. Así que esos incidentes no estarían relacionados.`

**G04-10 · promesa con la misma forma que G02.** `Verás cuatro atajos de la cabeza, cómo se cuelan en tu análisis y qué hacer.` (G02: `Verás los tres niveles, la escala… y por qué…`). Propuesta: `Aquí van cuatro atajos de la cabeza, cómo se te cuelan en el análisis y qué hacer con ellos.`

**G04-11 · s05-01 · bien, pero «de fuera» y «de verdad» se repiten.** «de verdad» sale tres veces (s02-04, s04-06, s05-03). Cambiar s05-03 por `La segunda es que alguien te lleve la contraria en serio. Es la revisión por pares hostil.`

**G04-12 · pronunciación de Heuer.** No lleva entrada de léxico (decisión consciente de la nota). Preguntar a Lidia cómo lo dice («hóier» es lo habitual) antes de congelar; a un hispanohablante le sale de varias maneras y la importación se apoya en eso.

**G04-13 · presupuesto de conceptos y tiempo.** Una cápsula admite 2–3 conceptos; aquí son cuatro sesgos y tres contramedidas. Está dentro del tiempo (244 s, 94 % del techo), pero es el guion más cercano al borde. Primer recorte si Lidia lee despacio: s02-05 (5,9 s); segundo, el final de s03-06 (7,9 s); tercero, s02-03 (10,7 s) reducido a `Richards Heuer, que trabajó en la CIA, lo resumió así. Saber que los sesgos existen no los quita.`

### Ritmo, humor y analogías de G04
- La báscula es la mejor analogía de los cuatro: vuelve (s02, s05, cierre), sirve de chiste final y no se estira. Solo hay que cuidar «pesa/pesas» (G04-4).
- Los mensajes de PAPER CRANE son irónicos y breves, pero el segundo (`Para qué tanto método, analista. Tu instinto ya lo sabe.`) es el mejor de los ocho que hay en los cuatro vídeos. El primero (`La primera hipótesis suele ser la buena, analista. Quédate con ella.`, 68 caracteres) está en el límite de ~5 s; recorte posible: `La primera hipótesis suele ser la buena. Quédate con ella.` (56), si se quita «analista» (ver repeticiones).
- La tarjeta de anchoring sale justo antes del mensaje (nota (e.4)); con la propuesta G04-7 hay una frase más antes del mensaje y la separación mejora.

---

## Repeticiones entre vídeos (G01–G04)

1. **Aperturas «Eres la analista de Meridian…»**: G02 s01-01 y G04 s01-01 empiezan igual; G01 s01-01 y G03 s01-01 llevan la misma estructura «…en Meridian, una aeroespacial, y eres su primera analista de inteligencia». En un atracón de cuatro vídeos se oye tres veces. Propuestas en G03-1 y G04-1 (G01 y G02 se quedan).
2. **«Piensa en… / Piénsalo como…»** abre la analogía principal en los cuatro: G01 s03-05 «Piensa en un capitán sin GPS», G02 s04-01 «Piensa en una casa», G03 s02-02 «Piénsalo como un restaurante», G04 s02-01 «Piensa en una báscula». Variar: G01 `Mira a un capitán sin GPS.`; G02 `Imagínate una casa.` (ya propuesto); G03 `Es como un restaurante.`; G04 se queda con «Piensa en una báscula…».
3. **«Todo cabe en tres reglas»**: idéntico en G02 s06-01 y G04 s06-01; el resto abre su cierre distinto («Antes de irte, tres ideas.», «Te llevas tres reglas.»). Propuesta: G02 `Esto se resume en tres reglas.` y G04 `Vamos a dejarlo en tres reglas.` (evitar `Quédate con tres reglas`, que sonaría casi igual que el «Te llevas tres reglas» de G03); así los cuatro cierres abren distinto.
4. **Fórmula del adversario:** G01 y G03 usan «Se cuela EMBER FOX…» (y `hilos-pelicula` ya usa «Se cuela GLASS VIPER»). Dejar «Se cuela» solo en G01 (primera aparición), «Vuelve EMBER FOX» en G03.
5. **El vocativo «analista» no distingue adversarios:** lo dicen EMBER FOX (G01 s02-01, G02 s05-01) y PAPER CRANE (G04 ×2), y las notas lo dan como rasgo del canon de PAPER CRANE y VELVET CICADA. Para que EMBER FOX no suene igual, darle su firma, la del vendedor que quita importancia: «no te compliques». Propuestas: G01 s02-01 `Es solo una IP. Bloquéala y no te compliques.` (46 car.), G02 s05-01 `Compra buena inteligencia y no te compliques. Los parches, ya si eso.` (68 car.; o `Compra buena inteligencia. Los parches, ya si eso.` sin vocativo), G03 s02-01 `Tú recoge de todo y no te compliques, que la pregunta ya saldrá.` El resto de los mensajes de EMBER FOX se quedan. Decisión de canon: si la nota «EMBER FOX dice analista» ya está registrada, dejarlo y quitar el vocativo de PAPER CRANE en uno de los dos mensajes.
6. **«a otra cosa»** en el mensaje de G01 s02-01 y en el de G03 s05-01 (arreglado en G03-8).
7. **«atajo»**: se usa como apodo del adversario en G01 (×2) y G02 (×1: «Qué buen atajo») y en G04 como nombre del sesgo («cuatro atajos de la cabeza», «cada atajo»). En G04 el adversario (PAPER CRANE) y los sesgos comparten la palabra: quien vea los cuatro vídeos oirá «atajo» dos significados. Sugerencia: G04 puede decir «trampas de la cabeza» o «atajos mentales» en la promesa, y dejar «atajo» para los adversarios en G01–G03. No es grave; decidir.
8. **Cierre «Ahora te tocan / Te quedan / Ahora toca resolver las N preguntas»** más un último refrán de dos palabras: ahora los cuatro terminan con la misma forma (acción siguiente + remate callback). Es una firma de serie aceptable, pero los remates son todos de una frase corta y tag `cheerful`; variar al menos un tag (`warm` o `confident` en G03 y G04).
9. **Chiste de «volver al principio del vídeo» (callback)**: G01 («pregunta qué se va a decidir con ella»), G03 («Justo lo contrario de aquellos doce feeds» y «Ninguna colección empieza sin una pregunta»), G04 («Y ve calibrando esa báscula»), G02 («Y que cada sobre llegue a quien lo abre») son los cuatro callbacks. Es la fuerza de los cierres; no tocar.
10. **Léxico de EMBER FOX:** «foks» (G01) frente a «fox» (G03).

## Longitud y dónde recortar

| Vídeo | Estimado / techo | Si Lidia lee al 100 % | Primeros recortes (segundos del estimado, con pausa) |
|---|---|---|---|
| G01 | 539 / 600 s | 8:59, dentro | s08-03 (8,8 s) → s06-05 (7,6 s) → s09-04 (6,8 s) + s09-05 (7,6 s) → segunda frase de s10-04 |
| G02 | 249,8 / 260 s | 4:10, dentro pero sin margen | s05-05 (7,5 s) → s05-04 (5,9 s) → mitad final de s04-07 (≈5 s) → s02-06 queda, que es el remate |
| G03 | 505,7 / 600 s | 8:26, dentro | s08-04 (5,2 s) → s09-02 + s09-03 al texto de pantalla (14,7 s) → s05-05 (9,2 s) → s07-02 (8,7 s) |
| G04 | 244,2 (+4–6 s de Laura) / 260 s | ≈4:10 con las voces, justo | s02-05 (5,9 s) → final de s03-06 (7,9 s) → s02-03 reducido (10,7 s) |

Los cuatro caben aun al 100 % de lectura, pero G02 y G04 tienen menos de 10 s de holgura y no admiten ninguna pausa extra de Lidia ni los respellings largos.

## Lo que suena bien

- **G01:** el arco de s02 (dato, información, inteligencia, con la pregunta «qué sabemos de ella» como hilo); «Suena fatal, pero tiene truco» (s10-01); «Así la empresa no gasta en defenderse de fantasmas mientras ignora a quien sí va a por ella» (s09-05); «“Hoy no” no es “nunca”» (s06-06); «Callarte no es una opción… o a ciegas» (s04-04); el capitán sin GPS; la caña y el pescador; el cierre que devuelve la IP del principio.
- **G02:** «La inteligencia… el parte de hoy / la previsión / el clima» como triple paralelo (s02-01/02); «Seria, sí. Útil, ya es otra cosa.»; «Muy interesante, pero ni una regla ni un indicador para hoy.»; «darle a cada uno lo del otro»; los dos mensajes de EMBER FOX; «Y que cada sobre llegue a quien lo abre».
- **G03:** el restaurante (comanda, plato perfecto que nadie ha pedido, plato a otra mesa, carta fija y banquete) y su uso para un PIR (`mesa cuatro, un pescado sin gluten, antes de las diez`); «Pero ¿valoración de qué?»; «aquí te ahogas» y «Terabytes… que nadie va a analizar nunca»; los dos engranajes y «cuando arde algo»; «Justo lo contrario de aquellos doce feeds»; las pausas para pensar con dos opciones.
- **G04:** la báscula que marca dos kilos de más y vuelve como pesas; «pillarlos a tiempo»; «Ese tráfico merece sus hipótesis, no los titulares»; «Tu instinto es justo la báscula descalibrada»; «Y ve calibrando esa báscula».
- **Transversal:** ningún guion usa dos puntos, punto y coma ni «¿Y …?»; las etiquetas no se repiten seguidas; hay variedad de ritmo (pausas de 650–700 ms tras cada remate de escena); los cuatro terminan con una acción siguiente y un callback; los números y siglas están bien resueltos con `[display|spoken]` y léxico (`[4.000|cuatro mil]`, `[Lab 1B|laboratorio uno be]`, `[Planning & Direction|…]`); EMBER FOX/PAPER CRANE provocan y la narradora contesta, no al revés.

## Resumen en cinco líneas

1. Los cuatro guiones están en buen estado: sin avisos del validador, frases casi todas ≤ 20 palabras, ritmo y etiquetas variadas, analogías vivas (báscula, restaurante, capitán, caña); lo que queda es pulido de lectura.
2. Lo que hay que corregir antes de congelar: los «sobres» de G02 que la voz nunca introduce y la numeración de reglas contradictoria; el EDR regalado en G02 y la casa/linterna/tejado inconsistente; la pregunta de pensar de G04 que no se puede contestar; EMBER FOX sin presentar en G01; «Proponme» (voseo) en G03.
3. Calcos del inglés para sustituir: «sirvió un panel», «en el bucle», «si aplica», «log», más tres términos ingleses seguidos en G02 s02 y ocho palabras inglesas seguidas en G03 s09-02.
4. Repeticiones entre vídeos: aperturas «Eres la analista de Meridian» (G02/G04) y «primera analista» (G01/G03), «Todo cabe en tres reglas» idéntico en G02 y G04, «Piensa en…» como arranque de las cuatro analogías, «Se cuela EMBER FOX» en G01 y G03; EMBER FOX y PAPER CRANE comparten el vocativo «analista» (propongo la firma «no te compliques» para EMBER FOX).
5. Duración: todos caben al 100 % de lectura (539, 250, 506 y 244 s), pero G02 y G04 tienen menos de 10 s de holgura; primeros recortes en la tabla de arriba (G01 s08-03, G02 s05-05, G03 s08-04 y s09-02/03, G04 s02-05).
