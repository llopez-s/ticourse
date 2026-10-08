### V23 · s4m5 · Cápsula · «Atribución: ¿quién fue? Los tres niveles y las pistas falsas»

> Propuesta del 2026-10-08, con las opciones recomendadas ya elegidas; pendiente de que Lidia diga qué cambia. Tanda 4;
> rama prevista `video-atribucion-cuadro`, desde `main`. La versión vigente de escenas y guion será
> `video/atribucion-cuadro/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/atribucion-cuadro/out/script-notes.md`. Las decisiones, con la alternativa descartada de cada una, están en
> `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V22-V23.md` (apartado V23).
>
> **Es la secuela de dos promesas publicadas.** V3 dejó Adversary en UNKNOWN («UNKNOWN con un plan vale más que un nombre
> inventado», «el diamante no atribuye por sí solo», `video/diamond-e7/narration.json:157-159,351-353`) y la lección de V9
> (s4m3) manda aquí lo de las pruebas más fuertes que alguien podría plantar (`src/data/s4.ts:441`, «S4M5, PAPER CRANE»; V9
> lo dice en voz sin concretar, `video/ach-matriz/narration.json`, s08-03). V23 contesta a las dos: cuántas pruebas más pide
> poner un nombre y cuáles pesan. Ninguna fecha, ninguna atribución del caso
> y ninguna pista falsa sobre Meridian: la pared del dosier de HALL OF MIRRORS (`src/data/course-gcti.ts:78`) manda en todo
> el diseño.

- **Carpeta:** `atribucion-cuadro` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo
  GCTI **Analysis** (dominio del curso de S4, `src/data/course-gcti.ts:70`, y de las diez preguntas de s4m5,
  `src/data/s4.ts:1120-1269`); las tarjetas llevan `"objective": "Analysis"` e insignia «GCTI» · adversario **PAPER
  CRANE** (`src/data/course-gcti.ts:74-76`), dos mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **ya existe**, la de V9
  (`"adversaryVoice": { "voice": "sapi/Microsoft Laura", "rate": 0, "fx": "machine" }`, `video/ach-matriz/narration.json:11-15`)
  · música de V4 a V9 (`Go On Going - Stayloose.mp3`). No hace falta voz ni efecto nuevos.
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "gcti"`, `"adversary": "PAPER CRANE"`, `"lesson": "s4m5"`, la
  música de arriba y `"tags"`: «atribución», «attribution», «false flag», «niveles de atribución», «intrusion set»,
  «operator», «sponsor», «análisis de inteligencia», «threat intelligence», «inteligencia de amenazas», «GCTI». Título de
  YouTube: «Atribución: ¿quién fue? Los tres niveles y las pistas falsas | GIAC GCTI en español».
- **Ritmo:** `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3500. En s04
  el mensaje abre la escena y la pregunta llega más tarde (el validador no deja los dos en el mismo segmento).
- **Efectos (`sfx`):** los automáticos del motor y tres momentos con sonidos de la biblioteca que ya usan otros vídeos:
  `dark` («lock», el tercer nivel que queda a oscuras), `cheap` («glitch», la firma y la fecha que se pintan solas) y
  `note` («check», la nota del informe).
- **Léxico nuevo** (formas propuestas; se confirman en la audición de Lidia): `sponsor` («spónsor»), `operator`
  («óperéitor»), `customer` («cástomer»; V3 lo dice en voz, pero no está en su léxico), `false flag` («fols flag»), `intrusion set` («intrúshon set»),
  `HUMINT` («jiúmint»), `SIGINT` («sígint»), `opsec` («ópsec»). `PAPER`, `CRANE`, `CISO` y `UNKNOWN` ya están en los
  léxicos de V9 y V3.
- **Duración:** suma de `s` **218 s**; `wordBudget` a 2,7 palabras/s: 54, 140, 103, 130, 97 y 65 (589 palabras). El guion se
  queda en **unas 550**, por debajo del presupuesto, porque lleva dos mensajes (unos 4–5 s cada uno) y una pregunta de 4,5 s.
  Estimado de `build-timeline --estimate` ~4:10–4:15; con el ritmo de Lidia, **~3:50–3:55** renderizados. Dentro de
  190–260. No se rellena. La suma predice mal (V5 salió a 0,89 veces y V4 a 1,22), así que el primer borrador se mide por
  los dos lados. Si el estimado pasa de ~255 s, se recorta en este orden: primero, en s03, la fila del informe serio
  (pasa a pantalla); después, en s05, la frase de los seguros; la regla de «cada nivel pide otro tipo de evidencia» y la
  de lo barato frente a lo caro no se recortan. Si baja de ~195 s, se alarga s02 (la fila de Meridian en el primer nivel).
- **Inserción:** en `src/data/s4.ts`, lección s4m5, **después del último check** («For a private-sector defender, the MOST
  actionable attribution level is usually…», `:1099-1112`) y **antes del callout «Nota de examen»** (`:1114-1118`), como
  bloque `youtube`:
  `{ t: 'video', title: 'Atribución: ¿quién fue? Los tres niveles y las pistas falsas', youtube: '<id>', poster: 'videos/atribucion-cuadro-poster.png', transcript: 'videos/atribucion-cuadro-transcript.txt' }`.
  Como V6 en sp4m8 (después del check de MFA y antes de la nota de examen), V9 en s4m3 y V13 en s2m1: el orden queda
  lección, checks, vídeo y nota de examen, porque el vídeo resume la lección casi entera (los niveles, las pistas falsas y el
  valor de atribuir) y contesta dos de sus tres checks (la pista barata y el nivel más útil; el del STIX queda fuera).
  Descartado ponerlo antes de los checks, como V3 y V7: contestaría el segundo (strings en otro idioma) y el tercero antes de
  que se hagan. Se fija en la suite `lesson videos` de `src/data/content.test.ts` (`:267-296`), junto a los demás.
- **Lo que se lee no se deletrea:** el vídeo casi no tiene identificadores. Los textos de los rótulos van en pantalla; la voz
  dice qué son («un informe serio», «un binario de ejemplo»). Los nombres de los niveles y términos de examen sí se dicen
  (máquina, operador, sponsor, false flag, intrusion set). La voz no nombra VELVET CICADA ni GLASS VIPER: dice «el
  atacante» o «el grupo que sigues»; en pantalla tampoco salen, porque la nota de s05 describe el grupo sin nombrarlo.
- **Enfoque («un nombre para el informe»):** el diamante del evento E7 dejó la esquina de Adversary en UNKNOWN (V3). Ahora
  que Meridian sabe cómo trabaja el atacante, el CISO (sin nombre, el de V9) quiere un nombre para el informe: «¿quién está
  detrás? ¿ponemos un país?». La analista no contesta con un nombre sino con una pregunta: ¿hasta dónde llega lo que tengo?
  Los tres niveles de la lección se explican con un cuadro (¿con qué se hizo, quién lo pintó, quién lo encargó?); la
  telemetría llega al primero y el tercero no deja rastro en tu red. PAPER CRANE, la célula que siembra pistas falsas
  (V9; también lo dice la sección, `src/data/course-gcti.ts:75-76`), empuja dos atajos, y la narradora los contesta con lo
  barato y lo caro de falsificar sobre un binario de ejemplo que no es el de Meridian. El cierre vuelve al CISO con lo que sí
  puedes escribir en el informe y lo que no, y con la pregunta del consejo de la lección: ¿qué decisión cambia con el nombre
  del país? **El vídeo no atribuye nada al caso: ni país, ni persona, ni confianza sobre quién.** Una frase sitúa a quien no
  ha visto nada: eres la analista de inteligencia de Meridian, una aeroespacial, y en el diamante del beacon del evento E7 la
  esquina de Adversary sigue sin nombre.

**Conceptos (3) y su imagen:**

Una sola imagen para todo el vídeo, con un detalle distinto en cada concepto: **atribuir un cuadro**, que es literalmente lo
que hace el mundo del arte («atribuido a»). Los tres niveles son tres preguntas sobre el cuadro, y los dibuja como tres
bandas del mismo lienzo, de abajo arriba, nunca como una escalera (la escalera es de V7). Lo barato de falsificar es la firma
y la fecha de la esquina; lo caro, el historial documentado año tras año. La cartela del museo («atribuido a…») es la
afirmación con su confianza. No es la casa ni el taller de V13 a V15, ni la carta de V8, ni la cocina de V9, ni la ropa y el
acento de V7.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | «¿Quién fue?» tiene tres respuestas de profundidad creciente (`src/data/s4.ts:983-1003`; s4m5q1). **Máquina / infraestructura**: qué equipos y herramientas actuaron; lo da tu telemetría, el malware y el C2; confianza alta. **Operador**: quién tecleó; lo regalan los errores humanos (una cuenta personal desde la infraestructura, un alias reutilizado) y los hábitos propios sostenidos durante años; lo alcanzan vendors con visibilidad global y años de seguimiento; confianza moderada. **Sponsor**: por cuenta de quién; hacen falta HUMINT, SIGINT, financiación y órdenes, registros legales y victimología plurianual alineada con intereses; gobiernos o fusión público-privada; confianza moderada, y solo con fuentes que tu red no tiene, siempre dicha con lenguaje estimativo explícito (el lenguaje estimativo es otro eje, no un grado de confianza). La victimología sola no basta para llegar a quién dirige. **Subir un nivel no pide más evidencia técnica, pide evidencia de otro tipo**; la técnica sola rara vez alcanza el sponsor, y no es falta de habilidad sino de acceso a ese tipo de prueba, por eso un informe serio se detiene en el intrusion set con solapamientos a nivel de operador (s4m5q2, q8 y q9). Ya lo dibujó V3: el vértice Adversary guarda al operator, que teclea, y al customer, que encarga y se queda el botín (`src/data/s2.ts:557`) | Un cuadro en un caballete: ¿con qué se hizo? (el lienzo y los pigmentos), ¿quién lo pintó? (la mano, con sus descuidos: la huella en el barniz) y ¿quién lo encargó y lo pagó? (el contrato, que no está en el cuadro sino en un archivo) | «Cada nivel pide evidencia de otro tipo, no solo más» · «Sponsor: la telemetría sola rara vez basta» |
| 2 | Lo barato y lo caro de falsificar. Los false flags atacan la evidencia barata: strings o idioma y compile times o horario, triviales de falsificar y de muy bajo peso aislados; tooling de otro grupo, fácil si es público o robado, de peso bajo; en cambio la victimología sostenida alineada con intereses concretos es cara de sostener (peso medio-alto) y el tradecraft estructural de años con errores de opsec es muy caro de falsificar (peso alto, en agregado). Caro no es imposible: V9 enseña que hasta la prueba más fuerte puede plantarse. Barato no es irrelevante: cuenta solo dentro de un cuerpo grande y coherente. El antídoto es el de V9: ACH con sensibilidad a la decepción, o sea, ¿qué pasa con mi conclusión si esta pista es un señuelo? (`src/data/s4.ts:1067-1082`; s4m5q3 y q5, check de `:1084-1097`) | La firma y la fecha de la esquina del cuadro, que un falsificador pinta en un minuto, frente a la procedencia documentada año tras año, que no se inventa de golpe | «False flag: ataca la evidencia barata de falsificar» |
| 3 | ¿Qué decisión cambia con el nombre? La atribución es inteligencia y existe para servir a una decisión; sin decisión, no hay requisito (s4m5q4). Para defender, lo más útil es el nivel del grupo: cómo trabaja y qué busca (check de `:1099-1112`); el país importa a gobiernos (respuesta diplomática o legal), seguros y decisiones geopolíticas de negocio (`:1008`). Si afirmas algo, viaja como afirmación analítica con su confianza, no como etiqueta (`:1050`; s4m5q10). Una atribución de un gobierno es una fuente más, con su base y su confianza (s4m5q6), no una verdad de partida | La cartela del museo: «atribuido a…» es una afirmación con su grado de seguridad. Quien necesita la cartela es quien va a vender, asegurar o exponer el cuadro; quien solo tiene que arreglar la puerta por la que entraron no la necesita para decidir | «Antes de atribuir: ¿qué decisión cambia con el nombre?» |

**Escenas:** seis, en tres capítulos (Los niveles · Pistas y decisión · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Un nombre para el informe» | I Los niveles | 20 | El diamante del evento E7 (el de V3), en pequeño a un lado, con la esquina «Adversary · UNKNOWN» encendida y el resto atenuado. Al otro lado, la tira del CISO, la misma de V9: «CISO» y «¿Quién está detrás? ¿Ponemos un país en el informe?». Título «Atribución: ¿quién fue?» con «tres niveles, pistas falsas y cuándo vale la pena» debajo, antes de los 10 s. La promesa en tres chips: «hasta dónde puedes llegar · qué pista pesa de verdad · si hace falta un nombre» | La promesa en los primeros 10 s y el puente con V3 en una frase (el diamante dejó Adversary en UNKNOWN y el CISO quiere un nombre) · `diamond, ciso, title, promise` |
| s02-niveles «Tres preguntas sobre un cuadro» | I | 52 | Un cuadro en un caballete, con su firma en una esquina. Tres preguntas se encienden una a una y cada una abre su banda del lienzo, de abajo arriba, rotulada: «¿con qué se hizo?» (lienzo y pigmentos), MÁQUINA / INFRAESTRUCTURA, «qué equipos y herramientas actuaron», con la evidencia de la lección, «tu telemetría, el malware, el C2» (confianza «alta»), y un chip «tu caso: el programa y su servidor»; «¿quién lo pintó?» (la mano, una huella en el barniz), OPERADOR, «quién tecleó», con «errores humanos: una cuenta personal desde la infraestructura, un alias reutilizado, hábitos propios años seguidos» (confianza «moderada»); «¿quién lo encargó y lo pagó?» (un contrato guardado fuera del cuadro), SPONSOR, «por cuenta de quién», con «dinero, órdenes, registros legales, años de victimología alineada con intereses» (confianza «moderada, y solo con fuentes que tu red no tiene»). Un chip hacia el diamante pequeño: «Capability + Infrastructure = máquina · Adversary = operator + customer». Tira: «subir un nivel pide evidencia de otro tipo, no más de lo mismo». La tarjeta | Tres niveles y cada uno pide otro tipo de evidencia; lo que tienes de Meridian es del primero · `canvas, machine, ours, hand, operator, slips, commission, sponsor, diamond, other-kind` |
| s03-techo «Hasta dónde llega lo que ves» | I | 38 | Mensaje interceptado. Respuesta: las tres bandas como un muro iluminado por un foco, la telemetría: ilumina del todo la primera, apenas la segunda y deja a oscuras la tercera, con «no deja rastro en tu red». En una ficha genérica, «así habla un informe serio: se detiene donde acaba su evidencia»: «[nombre del conjunto] · solapamiento a nivel de operador con actividad anterior · confianza moderada» y, debajo, «país: —». La tarjeta. Cierre del capítulo con el «o sea, que…» | Sponsor pide fuentes que tu red no tiene (HUMINT, SIGINT, dinero, registros legales); quien se para en el intrusion set no es débil, es riguroso · `reply-name, wall, beam, dark, vendor, ceiling, wrap-i` · **intercept** |
| s04-binario «Un binario sobre la mesa» | II Pistas y decisión | 48 | Mensaje interceptado, que abre la escena; el binario de ejemplo ya está sobre la mesa, con su rótulo «Ejemplo de la lección · no es el caso de Meridian», antes de que hable el mensaje, y la voz no dice que PAPER CRANE siembre nada mientras las pistas están a la vista. Respuesta corta: «pues vamos a ver cuánto dice». El binario lleva dos pistas: «textos en otro idioma» y «horas de compilación de una jornada de oficina concreta». Pregunta para pensar con las dos a la vista. Respuesta: en el cuadro, la firma y la fecha de la esquina; una mano las pinta en un minuto. La tabla de la lección se rellena fila a fila (evidencia · falsificable · peso): idioma y horario, triviales y de muy bajo peso; tooling de otro grupo, fácil y bajo; y, en contraste, «objetivos sostenidos durante años» (peso medio-alto) y «tradecraft de años con errores de opsec» (peso alto, en agregado), caros de sostener. Una pregunta final, la de V9: «si esta pista fuera un señuelo, ¿cambia tu conclusión?». La tarjeta | Lo barato de falsificar pesa poco aislado; lo caro pesa más; la pregunta de sensibilidad protege de los señuelos · `reply-crane, sample, lang, hours, signature, cheap, costly, sensitivity` · **intercept** · **think** |
| s05-decision «El nombre y la decisión» | II | 36 | Vuelve la tira del CISO. Dos columnas: «a quién le sirve el país: gobiernos (respuesta diplomática o legal), seguros» y «qué cambia en tu defensa: detectar, cazar y proteger rara vez cambian con el país». La cartela del museo del cuadro, «atribuido a…», con «lo que afirmas lleva su confianza». Una nota de tres líneas, lo que sí puedes escribir en el informe: «cómo trabajan: lo ves en tu red» · «qué buscan: la propiedad intelectual de propulsión de Meridian» · «quién teclea: desconocido» · «para quién trabajan: tu red no tiene esa clase de prueba; el juicio se emite con su confianza y diciendo qué falta, no se calla». La tarjeta | La atribución sirve a una decisión; lo que afirmas, con su confianza; lo que no sabes, UNKNOWN · `ciso-again, who-needs, ours, label, note, unknown` |
| s06-recap «Tres reglas» | III Para el examen | 24 | Tres tarjetas de reglas con su viñeta en miniatura (las tres bandas del cuadro, la firma de la esquina, la cartela); tarjeta final Alertópolis: «Tu turno: las preguntas de la lección (s4m5)» | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (dominio Analysis), una por escena de s02 a s05, ninguna en s01 ni en el cierre. Cada una espera al final
  de su frase y lleva ~5 s de escena detrás (la de s03 lleva detrás el «o sea, que…» que cierra el capítulo):
  - «Cada nivel pide evidencia de otro tipo, no solo más» (s02) (51)
  - «Sponsor: la telemetría sola rara vez basta» (s03) (42)
  - «False flag: ataca la evidencia barata de falsificar» (s04) (51; sale después de la respuesta a la pregunta)
  - «Antes de atribuir: ¿qué decisión cambia con el nombre?» (s05) (54)
- **Pregunta para pensar:** «Idioma y horario: ¿bastan para un país?» (s04) (39; `holdMs` 4500; las dos pistas del binario de ejemplo siguen a la
  vista). Respuesta: no. Cualquiera falsifica un idioma y una hora de compilación en un minuto, y aislados pesan muy poco, así
  que no alcanzan para un país. Tampoco son irrelevantes: suman dentro de un cuerpo grande y coherente (el check de `:1084-1097`). El
  título de la escena («Un binario sobre la mesa») no da la respuesta.
- **Mensajes interceptados** (PAPER CRANE; tutea, dos frases cortas, ironía; empuja atajos de método, nunca una hipótesis, y no
  confiesa nada; dice «analista», como en V9):
  - s03 (cap. I): «Ponle un país al informe, analista. Todo consejo adora un nombre.» (65; «consejos» se oía como «avisos», y el canon dice «el consejo»). El error que corrige la
    narradora: poner un país porque vende, sin la evidencia que pide ese nivel. La voz, más o menos así: «Claro que lo propone
    quien se dedica a sembrar pistas falsas: un nombre apresurado le viene de perlas. Y un país es el nivel de arriba, el de
    quién encarga, y esa prueba no pasa por tu red.» Nada de PAPER CRANE sembrando nada en el caso de Meridian.
  - s04 (cap. II): «Con la primera pista que encaje ya tienes bastante. ¿Para qué más?» (66). El error: pararte en la primera
    pista que encaja. La voz abre sin contestar: «Pues vamos a ver cuánto da una pista fácil»; la respuesta llega después de la
    pregunta (lo barato pesa poco; busca lo caro, y pregúntate qué pasa si es un señuelo). Distinto de los tres de V9: aquel era
    fiarse de todo, contar lo que encaja y tirarlo todo por una prueba falsa; este es parar pronto.
- **Cierre:** tres reglas y una sola tarea.
  1. Máquina, operador y sponsor: cada nivel pide evidencia de otro tipo. Tu red llega a la máquina; el país rara vez sale solo
     de tu telemetría.
  2. Un idioma o una hora se falsifican en un minuto; años de objetivos y de rutina cuestan mucho más (caro no es imposible).
     Antes de fiarte de una pista, pregunta qué pasa con tu conclusión si fuera un señuelo.
  3. Antes de poner un nombre, ¿qué decisión cambia? Y si lo pones, con su confianza.

  Tarea: las diez preguntas de la lección s4m5. La q7 (campaign frente a intrusion set) toca lo que el vídeo deja fuera, y la q10
  (la atribución como afirmación con su confianza dentro de STIX) solo en la idea: el objeto STIX queda fuera. Ningún laboratorio de S4 practica la atribución.

**Se queda fuera** (y dónde está):
- **Campaign frente a intrusion set y el modelo STIX con `attributed-to` y su `confidence`** (`src/data/s4.ts:1010-1051`,
  check de `:1052-1066`, s4m5q7 y el objeto STIX de q10; la idea de q10, que la atribución viaja con su confianza, sí está en s05): pediría enseñar el JSON con el `intrusion-set` llamado «GLASS VIPER», la campaña
  «PO-REVISION phishing wave» y `confidence: 75`. Choca con la lectura del registro (§5, punto 9: V8 muestra a GLASS VIPER
  como el loader y a VELVET CICADA como el intrusion set) y V8 y V14 dejaron fuera la campaña; el `75` caería en «alto» en la
  escala None/Low/Med/High de STIX 2.1 (de memoria, sin comprobar), frente a la «confianza media» con la que la propia
  lección describe el ejemplo (`:1050`). Se queda en la lección y en las preguntas, y es una segunda parte posible si se resuelve el punto 9.
- Los casos históricos de atribución (APT1, Sony, DNC, `src/data/s5.ts:822-901`) y la escala de confianza y probabilidad de
  ICD 203 (s5m2): son de S5.
- Cluster-A y Cluster-B (`src/data/s4.ts:729-744`): son de s4m4.
- Las atribuciones de un gobierno como fuente (s4m5q6): una línea como mucho en s05, sin tarjeta.
- Los nombres de personas y el nivel «threat-actor» de STIX (`:1050`).
- La tabla de ejemplos de false flags más allá de las cinco filas de la lección.

**Laboratorios:** ningún laboratorio de S4 practica la atribución, así que la tarea final son las preguntas de la lección. Cuatro
precauciones.
- **Lab 4A** (`src/data/labs.ts:137-146,447-501`): ninguna de sus ocho frases. En particular, ni el ancla en un informe que decía
  un país, ni las horas de compilación en un huso con el país detrás, ni «lo ha atribuido BigVendorCo» (`:461,481,486`). El vídeo no
  nombra ningún país, ni usa «UTC+8».
- **Lab 4B** (`:153-162,862-930`): ni sus ocho pruebas, ni el horario, ni el certificado de E4. El vídeo no dice qué pruebas del
  caso son plantables.
- **Lab 5B, hallazgo 2** (`:1056-1076`): «VELVET CICADA opera por cuenta de un estado extranjero» con solo victimología,
  horario e infraestructura se valora con confianza baja. El vídeo no valora ninguna afirmación de sponsor de Meridian ni la
  entrega por adelantado: la confianza que sale (alta, media, moderada) es la de la tabla de la lección y la de la ficha genérica
  de un informe, nunca la de un juicio del caso.
- **Lab 3A, 3B y el final de la campaña:** nada.

**Canon nuevo que fija V23** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **Sin fecha ni hora**, como V9 y V15. No se ordena contra la cronología del registro.
- **El CISO** (sin nombre, el de V9) pregunta quién está detrás y si se pone un país en el informe. Es una pregunta, no una
  decisión: el vídeo no dice que el informe lleve o no un país más allá de lo que recomienda la analista.
- **Meridian, en los tres niveles:** del primero, tiene el programa y su servidor (V3, V4; el certificado no sale aquí, para no acercarlo a la prueba plantable de V9); en el diamante,
  Adversary sigue en UNKNOWN y el customer, sin conocerse. La nota de s05 dice que quién teclea es «desconocido» y que, para
  quién trabajan, tu red no tiene esa clase de prueba y el juicio se emite con su confianza y diciendo qué falta, no se calla; y
  que el país rara vez cambia las decisiones de defensa. El sponsor no se deja en «desconocido» a secas: el Lab 5B califica
  de erróneo no emitir el juicio (`src/data/labs.ts:1071-1074`) y la lección dice que los vendors serios lo emiten «con
  confianza explícita y matizada» (`src/data/s4.ts:1002`). Tampoco se adelanta la confianza que da el laboratorio. No se afirma nada de VELVET CICADA ni de GLASS VIPER.
- **Dos mensajes nuevos de PAPER CRANE**, sin fecha, que pasan a ser canon de su voz: «Ponle un país al informe, analista. Todo
  consejo adora un nombre.» y «Con la primera pista que encaje ya tienes bastante. ¿Para qué más?» Ninguno confiesa nada.
- **El binario de ejemplo** de s04 es de la lección, no del caso: lleva el rótulo «Ejemplo de la lección · no es el caso de
  Meridian» y no se relaciona con ninguna muestra de Meridian ni con el hash `9f3a...e1`.
- **La ficha del informe serio** de s03 (`[nombre del conjunto] · solapamiento a nivel de operador…`) es genérica: no
  existe ningún informe de ningún proveedor sobre Meridian.
- **La imagen del cuadro** (lienzo, mano, encargo, firma de la esquina, procedencia, cartela) es de la analogía, no del caso.
- Ninguna persona, fecha, equipo, hash ni IP nuevos.

**No se toca:**
- **El dosier de HALL OF MIRRORS** (`src/data/course-gcti.ts:78`): ni strings en cirílico ni horarios falsos, ni «PAPER CRANE
  los plantó», ni «espionaje industrial sistemático». Las dos pistas de s04 son un ejemplo etiquetado y sin país, y ningún
  mensaje habla de lo que PAPER CRANE haya sembrado. Tampoco se dice que el binario o las pruebas de Meridian sean señuelos.
- **El dosier de BROKEN CHAIN y el de DEEP WELL** (`src/data/course-gcti.ts:40,59`): ni el PDB, ni `kazuo.tanji@`, ni «una
  sola organización detrás de todas las campañas». El correo de registro no se usa como candidato a operador; la voz solo
  nombra el tipo de descuido (una cuenta personal, un alias reutilizado), y el único correo de registro que existe es el
  pivote de V3 y V4, sin identificar a nadie.
- **Lab 4A, 4B y 5B hallazgo 2:** ver «Laboratorios». Ningún país, y ni «Rusia», «Moscú», «China» ni «UTC+8».
- **El indicador y el grafo STIX** (campaña, intrusion set, `attributed-to`) y el punto 9 de §5.
- **«Entra por proveedores»** del callout de `src/data/s4.ts:1008` (registro §5, punto 4): el vídeo no cita esa frase; la
  nota de s05 dice solo «cómo trabajan» y «qué buscan». El vector de Meridian queda como en V13: el correo de s2m1.
- **Los casos reales** de S5 y los nombres de grupos reales.
- **El E4 de V9 y el certificado:** no se dice cuál de las pruebas del caso es plantable.
- **Cluster-A y Cluster-B.**
- No se culpa a nadie: ni al CISO por pedir un nombre ni a la sala por querer uno. Pedir un nombre es normal; el vídeo
  enseña a decir hasta dónde se puede llegar.

**Comprobación de límites** (recuentos hechos con un script de Node, `check-limits.mjs`, no a ojo; perfil `capsula-yt`):
- Duración: suma 218 s (seis escenas: 20, 52, 38, 48, 36 y 24); estimado ~250 s; renderizado previsto ~230–235 s; ventana
  190–260. Sí.
- Capítulos: 3 (máximo 3). Sí.
- Conceptos clave: 3 (2–3), con como mucho dos tarjetas por concepto (2, 1 y 1). Sí.
- Tarjetas: 4 (3–5), una por escena de s02 a s05 y ninguna en s01 ni en s06, todas con `"objective": "Analysis"`. Caracteres:
  51, 42, 51 y 54 (máximo 58). Sí.
- Pregunta para pensar: 1, en s04; 39 caracteres (máximo 48); `holdMs` 4500 (mínimo 4000); es un sí o no, no una palabra. Sí.
- Mensajes interceptados: 2 (1–2), en s03 (cap. I) y s04 (cap. II), uno por capítulo, ninguno en la escena final; 65 y 66
  caracteres (máximo 70); `holdMs` 3500 (2500–4500). Sí.
- `video.json` lleva `"adversary": "PAPER CRANE"`. Sí.
- Sin flechas, marcas de verificación, viñetas ni emoji (`FORBIDDEN_SYMBOLS` de
  `video/engine/scripts/lib/narration.mjs:23`) en tarjetas, pregunta, mensajes, rótulos nuevos y frases de voz de muestra. Sí.
- Ningún identificador leído en voz. Sí.
- `wordBudget` por escena: 54, 140, 103, 130, 97 y 65 (589 palabras); frases de voz de muestra de ≤ 22 palabras. El título
  de la escena de la pregunta no la destripa. Sí.
