# V26 · «RTO, RPO, MTTR y MTBF: lo que se promete y lo que se mide» (sp5m4) — revisión de exactitud del guion

Revisión de solo lectura, 2026-10-14. Fuentes: `video/bia-halden/narration.json`, `storyboard.json`, `video.json`, `lexicon.chatterbox.json`,
`src/timeline.json` (estimado, 239,8 s), `out/guion-voice-studio.md` y `out/canon-refs.md`; contra la lección
`src/data/secplus/sp5-part2.ts:302-426` (BIA y las cuatro medidas `:400`, nota de examen `:406`, check `:411`, q4 `:475-488`, q7 `:520-533`),
`sp5-cards.ts` (fcp516, fcp517), `ficha-V26.md` (mismo texto que `### V26` del plan), el registro `glass-harbor.md` y `video/ale-halden/narration.json`
(V25, congelado). Lo no contrastado con fuente oficial va marcado «(de memoria)».

## Qué se comprobó y sale limpio

- **Aritmética** (a mano y con el timeline): (40 + 95 + 120 + 65) / 4 = 80 min; 40, 95, 120 y 65 pasan de 30 las cuatro; 12 meses / 4 = 3 meses;
  48 h = «dos días»; 24 h = «un día»; 5 min = «cinco minutos»; 30 min = «media hora». La voz dice cada una como cifra hablada, ninguna como identificador.
- **Validador del motor** (`analyzeNarration` con el perfil `capsula-yt`, ejecutado sin tocar nada): **0 errores, 0 avisos**. Tarjetas 46/46/41/52 (máx. 58),
  4 tarjetas (3–5), 1 pregunta de 44 caracteres (máx. 48) con `holdMs` 4500 (≥ 4000), 2 mensajes de 65 y 64 (máx. 70) con `holdMs` 3800 (2500–4500), uno por
  capítulo y ninguno en s06, 3 capítulos, ninguna oración de más de 19 palabras, estimado 239,8 s dentro de 190–260 (con la lectura de Lidia al ~88–93 %,
  unos 211–223 s). `wordBudget` por escena: 58/59, 85/92, 133/140, 121/140, 60/81 y **65/54** (ver N7).
- **Cues**: los 38 `requiredCues` aparecen una vez y en el orden del storyboard (s01 6, s02 5, s03 13, s04 8, s05 5, s06 6). `sfx`: `both-set` (fr. 2838, s03,
  entre `board` y `bills`: suena al llenarse la fila de Operaciones, como manda la ficha), `rpo-five` (3372, s03, después del `think` 3233 + 131 = 3364),
  `mean` (4278, s04) y `gap` (4489, s04, antes del mensaje en 4563). Los cuatro sonidos existen en `sfx.json`; cada clave es cue de una sola escena.
- **Palabras que la ficha y la revisión de V25 prohíben** (búsqueda automática en voz, mensajes, tarjetas, pregunta y storyboard): ningún «hoy», «ese/aquel
  día», «muelle», «gestionado», «mapa de calor», «mitig-», «transfer-», «gestión», septiembre, `IR-2026-0147`, `srv-tc-app03`, «11 min», R-014, euros
  (solo «sin cifras ni euros» en el storyboard), hot/warm/cold, pruebas, «sala de control», temporada, fechas, GLASS HARBOR, dosier, SLA, contrato. La voz no
  dice desde qué instante cuenta el MTTR («en dejarlo funcionando», H26). Dos casos de borde («seguro» como adjetivo y «aceptas») van en N1 y N2.
- **PAPER GOVERNOR coherente con V25**: misma `adversaryVoice` (Laura, `rate` −1, `megafonia`), mismo `sfx` con ding/block, mensajes en acta impersonal con
  «Queda en acta.» (V25: «Se acuerda: el valor del servidor es la pérdida…»; V26: «Se acuerda: todo en cero minutos…», «Se acuerda: el RTO será lo que se
  tarda de media…»), mismo tic y misma frase del jefe de sección. V25 presenta («Y aquí llega PAPER GOVERNOR, que vive en los huecos de tu gobernanza», s02-02);
  V26 dice «Y vuelve PAPER GOVERNOR, que vive en los huecos de tu gobernanza» (s01-03), con la etiqueta completa en pantalla: se entiende solo. El léxico
  (`PAPER` «péiper», `GOVERNOR` «gávernor») es el mismo; `ARO` no sale, la frase opcional se descartó.
- **Canon**: `canon-refs.md` sale con 0 y 0 (la herramienta solo busca identificadores y horas `HH:MM`; el cotejo es manual). «Facturación» es el área de V6
  (`v6/src/data/s02-creep.ts:15`) sin personas; «Operaciones» sin sala, muelle ni estación; ningún sistema de asignación de atraques, ningún portal; nada de
  septiembre ni de V5/V5b. «Seguir llegadas y salidas» no tiene otra aparición en vídeos ni lecciones (búsqueda: 0 fuera de V26).
- **Objetivo 5.2** (de memoria): RTO, RPO, MTTR y MTBF están en 5.2 bajo «business impact analysis» (junto a risk register, appetite/tolerance, estrategias y
  reporting); «mean time to repair» y «mean time between failures» son las expansiones del examen. Lo que la voz da (RTO tiempo, RPO datos, MTTR medida que
  se compara con el RTO, MTBF fiabilidad) coincide con la lección (`:400`, `:406`) y las tarjetas fcp516/fcp517.
- **Escenas y títulos**: ningún título destripa una respuesta (ver N10). La pregunta para pensar no se contesta con lo que hay en pantalla en el momento del
  `think` (ver N5 para el matiz).

## Hallazgos

### Bloquea

Ninguno. No hay cifra falsa, ni contradicción con la lección o el canon, ni palabra prohibida, y el validador pasa en limpio.

### Corregir (antes de congelar la hoja de grabación)

**C1 · `s03-02` (`narration.json:84`) y storyboard s03 («dos mandos»): «marca la capacidad de recuperación que tienes lista» describe lo que tienes, no lo que se exige.**
El RTO es un objetivo: la lección dice que «determina la capacidad de recuperación que **necesitas comprar**» (`:400`) y la ficha, «que **hay que** tener
lista». Con «que tienes lista», la frase sugiere que el RTO es la capacidad actual del equipo, que es justo lo que s04 separa (lo que aguanta el negocio frente
a lo que hace el equipo) y lo que el mensaje de s04 confunde. El mismo texto está en pantalla: «RTO · qué recuperación tienes lista» (storyboard s03).
Reemplazo en voz: «{rto}El plazo es el RTO, el recovery time objective, y marca la capacidad de recuperación que necesitas tener lista.» En pantalla:
«RTO · qué recuperación necesitas tener lista». (+1 palabra; s03 134/140.)

**C2 · `s03-03` (`:90`): «Los datos son el RPO» identifica el dato con el objetivo.**
El RPO no es «los datos»: es la cantidad máxima de datos que puedes perder, medida en tiempo (`:400`; fcp516). Dicho así, el oyente puede entender que el RPO es
el conjunto de datos del proceso, y la frase paralela de s03-02 («El plazo es el RTO») sí es una definición correcta. Reemplazo: «{rpo}Los datos que puedes
perder son el RPO, el recovery point objective, y marcan cada cuánto copias.» (+3 palabras; s03 137/140, justo bajo el presupuesto; si hace falta aire,
quitar «el recovery point objective» no, que es la expansión de examen: quitar «y los rellenas» en s03-04.)

**C3 · `s03-04` y `s03-05` (`:96`, `:102`): «Facturas aguanta dos días» / «Facturas puede esperar dos días» nombra al proceso con el sustantivo equivocado.**
En s02 el área es «Facturación» y el proceso «Emitir facturas a las navieras»; en el storyboard la tarjeta es «Emitir facturas a las navieras · Facturación».
«Facturas aguanta» es un plural con verbo en singular y cambia de referente: ahora «facturas» son los documentos. «Operaciones» sí es el área. Reemplazo:
«…Operaciones aguanta media hora y puede perder un día de datos. {bills}Facturación aguanta dos días, y casi no puede perder nada.» y en s03-05
«{think}Facturación puede esperar dos días. ¿Basta con una copia al día?». (misma longitud; la pregunta de pantalla, «Dos días de espera: ¿basta una copia
al día?», no cambia.)

**C4 · `s04-01` (`:130`): «el registro de averías de ese sistema» no tiene antecedente.**
Lo último que se ha nombrado en s03 es la cafetería y los dos procesos; «ese sistema» puede leerse como la caja. La consola dice «seguimiento de llegadas
y salidas», pero la voz nunca lo liga con Operaciones hasta la frase siguiente. Reemplazo: «{log}Ahora, lo que mides. El registro de averías del sistema de
llegadas y salidas, de los últimos doce meses, tiene cuatro. {rows}Cuarenta minutos, noventa y cinco, ciento veinte y sesenta y cinco.» (+3 palabras; s04
124/140). Alternativa más corta: «El registro de averías de Operaciones, de los últimos doce meses, tiene cuatro.»

**C5 · `s04-02` (`:136`): la comparación clave del vídeo (MTTR frente a RTO) no nombra el RTO y está en pasado.**
(a) «Operaciones había prometido media hora» nunca dice «RTO»: en s04 el único RTO hablado es el del mensaje y el de s04-03, y la lectura «el MTTR se compara con
el RTO» solo está en la tarjeta y en s06-02; quien salte de s03 a s04 tiene que reconstruir que «media hora» es el RTO de s03-04. (b) El pluscuamperfecto
(«había prometido») y el pretérito («pasaron») presentan como hecho una promesa y unas averías que son «propuesta · ejemplo · datos ficticios»; la ficha
(canon nuevo) dice que nada «se cumple» ni está en vigor y que s04 concluye en condicional, y s04-05 lo hace («si estos fueran los números»). Reemplazo:
«{promise-line}Operaciones tiene un RTO de media hora. {mean}De media se tardan ochenta minutos en dejarlo funcionando, y eso es el MTTR, el tiempo medio de
reparación. {gap}Las cuatro pasan de media hora.» (+2 palabras; el cue `promise-line` y los sonidos no cambian de sitio). La narración en presente además
casa con «Si estos fueran los números…» de s04-05 sin el salto de tiempo.

**C6 · `s05-02` (`:176`) y storyboard (`swap`): «No se cambian» es ambiguo.**
En español, «no se cambian» se lee con facilidad como «no varían / no se modifican», no como «no se intercambian / no se confunden», que es lo que
enseña la q7 de la lección (`:520-533`: la trampa es la permutación). Reemplazo: «{swap}No se confunden.» y en pantalla, en pequeño, «no se confunden».
(Misma longitud; el cue sigue en la misma frase; la tarjeta no cambia.)

### Nota (no bloquea; decidir al grabar)

**N1 · `s02-04` (`:62`): «Cero minutos para todo suena seguro».** Como adjetivo («a salvo») es correcto y es lo que corrige la respuesta, pero «seguro» es la palabra
prohibida del seguro/transferir (V18, ficha «No se toca») y en sp5m4 la lección usa «seguro» para *transfer* dos párrafos antes. En un vídeo sobre riesgo el
oído puede ir al otro sentido. Reemplazo: «Cero minutos para todo suena a lo más prudente, pero cuanto más corto es el plazo, más capacidad tienes que tener lista.»

**N2 · `s03-01` (`:78`): «cuántas ventas apuntadas aceptas perder».** «Aceptar» es una de las cuatro estrategias que quedan fuera (la nota «Cuatro», «aceptar exige
dueño y fecha»). Aquí es el verbo corriente y la ficha lo trae así, pero la lección define el RPO con «lo que puedes permitirte perder» (`:400`) y esa
forma no choca con nada. Reemplazo: «…y otra, cuántas ventas apuntadas puedes permitirte perder.» (+1 palabra).

**N3 · `s04-04` (`:158`): «El técnico de la caja tarda lo que tarda» cae sin anclar la cafetería.** Entre s03 y esta frase pasan unos 40 s de consola del
puerto; el espectador ya no tiene la caja en la cabeza, y la consola de s04 no es una caja. La ficha pedía que la narradora separe los dos objetos («en la
cafetería…»). Reemplazo: «{technician}En la cafetería, el técnico de la caja tarda lo que tarda. Eso se mide, no se promete.» (+2 palabras). «Eso se mide, no
se promete» es exacto con la lección («no es un objetivo, es una medida observada»).

**N4 · `s04-03` (`:142`): «el MTTR, de lo que hace tu equipo».** Exacto en la dirección (el MTTR es lo observado, no lo que tolera el negocio), pero «lo que
hace tu equipo» atribuye la medida a una persona y la ficha pide «ni a Sistemas por el MTTR» (culpas). El MTTR depende de la recuperación (procesos,
herramientas, piezas). Reemplazo opcional: «El RTO sale de lo que el negocio aguanta, y el MTTR, de lo que se mide al recuperar.»
«Eso es poner en el papel lo que ya pasa» **sí corrige exactamente el mensaje de s04**: «el RTO será lo que se tarda de media» es escribir como objetivo la
medida observada. Sin cambio en esa frase.

**N5 · Pregunta para pensar (`s03-04` → `s03-05`/`s03-06`; cues `bills` 2971, `think` 3097, `rpo-five` 3372).** No se contesta antes de tiempo: «cinco minutos»
solo aparece en `rpo-five`, después del `holdMs`, y la respuesta no está dicha. Pero la frase inmediatamente anterior, «y casi no puede perder nada» (más la
línea «no puede perder casi nada» en pantalla desde `bills`), ya da casi todo para contestar «no»: el despiste de «dos días» es la única trampa que queda.
La ficha lo acepta (H27, «solo se ve el que despista»). Si se quiere más tensión, la voz de s03-04 acabaría en «Facturación aguanta dos días.» y «casi no puede
perder nada» pasaría a abrir la respuesta de s03-06 («No, porque casi no puede perder nada: hay que copiar cada cinco minutos.»). No lo pido: cambia la
pantalla de `bills` y la ficha.
Aviso de pantalla: que no aparezca «RPO 5 min» antes de `rpo-five`.

**N6 · `s04-02` y `s05-01`: las expansiones del MTTR y del MTBF van solo en español.** El RTO y el RPO dan el nombre inglés (como pide la lección), el MTTR y el
MTBF no; el examen los pregunta como *mean time to repair* y *mean time between failures*. Reemplazo opcional: «…y eso es el MTTR, el mean time to repair, el
tiempo medio de reparación» (+4) y «Eso es el MTBF, el mean time between failures, el tiempo medio entre fallos» (+5); s04 queda en ~128/140 y s05 en
~65/81. El lexicón no cubre las expansiones (la narradora las lee en inglés, como las de RTO y RPO).

**N7 · Duración y presupuesto.** Estimado 239,8 s (210 s de `targetTotalSec`; ficha: 235–250): cabe en 190–260. Pero s06 lleva 65 palabras contra 54 de
presupuesto (30,6 s estimados contra 20 de objetivo; V25 dejó s06 en 51/59) y s01 26,3 s contra 22. Con C1–C6 y N2–N3 el total sube unos 4–6 s (~245 s
estimado, ~220 s con la lectura de Lidia a ~90 %): sigue dentro. Si se quiere recuperar margen, recortar en este orden lo que dice la ficha (frase del ARO ya
fuera): «Y de paso, cuánto duele cada hora sin servicio» no, que es el `hour`; la frase de s05-03 («O sea, que uno dice…»), que repite s05-02. El cue `title`
cae en el fr. 305 (10,2 s estimados; la ficha quería ~8 s, el límite es 12): con la grabación bajará a ~9,3 s.

**N8 · «RTO» en el mensaje de s04 sin léxico.** SAPI recibe el texto tal cual (`tts-adversary.mjs`); ya está en la ficha (H15) como prueba de oído. Nada que
cambiar en el texto salvo que SAPI deletree mal la sigla.

**N9 · Cafetería frente a V22 y V9.** «La tienda de tu barrio» (V22, `coa-precios`) y «la cocina» (V9, `ach-matriz`) son locales de barrio; la cafetería no
usa «tienda» ni «cocina» ni comparte detalles (walkie, cerradura, hambre). La imagen **no falsea** ningún concepto: reloj = cuánto puede estar la caja sin
servir (RTO), libreta = ventas desde la última copia (RPO), técnico = MTTR medido. Solo el «técnico de la caja» sin anclaje (N3) la hace chocar con el puerto.
Sin cambio de imagen.

**N10 · Títulos de escena.** «Enseguida», «Empiezas preguntando al negocio», «Dos promesas por proceso», «Lo prometido y lo que mides», «Cada cuánto se
cuelga» y «Tres reglas» no adelantan ninguna respuesta de pregunta ni mensaje. Dos matices: «Empiezas preguntando al negocio» (s02) y la tarjeta de examen
de esa escena («El BIA parte del negocio, no de los servidores») dicen lo mismo con otras palabras, pero la tarjeta sale después del mensaje y es refuerzo, no
destripe; y «Dos promesas por proceso» (s03) apunta a que RTO y RPO son dos y distintos, que es la pista de fondo de la pregunta (es la entrada del tema, no
la respuesta). Sin cambio.

**N11 · Marca al inicio de la frase.** `{mean}` cae al empezar «De media se tardan ochenta minutos…» y el ding suena ~1–2 s antes de «ochenta»; es la
convención del resto de vídeos (V25, N2 de su revisión). Si se quiere que suene sobre la cifra: «De media se tardan {mean}ochenta minutos…».

## Veredicto

**Aprobado con cambios.** No hay cifra falsa, ni palabra prohibida, ni contradicción con la lección, el canon o V25; el validador pasa en limpio y los cues y
sonidos caen en su escena donde dice la ficha. Antes de grabar, seis correcciones de precisión, todas de una o dos palabras: C1 (el RTO «que tienes lista»
es lo que se exige, no lo que hay), C2 («los datos que puedes perder» son el RPO), C3 («Facturación», no «Facturas»), C4 (anclar «ese sistema»), C5 (nombrar
el RTO de Operaciones y poner s04-02 en presente) y C6 («no se confunden», no «no se cambian»). Las notas N1–N4 son de naturalidad y registro; N5 es una
decisión de diseño que la ficha ya tomó.
