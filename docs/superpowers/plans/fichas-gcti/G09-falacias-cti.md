### G09 · s4m2 · Cápsula · «Falacias lógicas en CTI: el paso que no se sostiene»

> Borrador del 2026-10-24, **sin congelar** (`video.json` no lleva `"frozen"`): la hoja de grabación sale como «BORRADOR · no grabes
> todavía». Rama `video-falacias-cti`, desde `origin/main`. La versión vigente de escenas y guion es
> `video/falacias-cti/storyboard.json` + `narration.json`; lo que se quedó fuera, en `video/falacias-cti/out/script-notes.md`
> (ignorado por git). Pendiente: las dos revisiones (exactitud y naturalidad), leer `out/canon-refs.md` y congelar.
>
> **Por qué esta lección.** La tanda G01–G07 y AP03/AP07 la nombran de pasada («falacia» no aparece en ningún guion de ellas) y
> el plan la había descartado como «taxonomía o lista» (`docs/superpowers/plans/2026-09-25-lesson-videos.md:262`). Lo que pone
> la historia en lugar de la lista es una sola pregunta que sirve de hilo: **¿dónde está el error que puedes señalar en un
> informe?** G04 (`video/sesgos-analista`) ya vendió «el instrumento de medida eres tú»; este vídeo vende lo contrario: **el
> fallo está en el papel, no en tu cabeza**, y se marca con un boli rojo. Cierra el par s4m1 + s4m2 que el examen mezcla
> (`src/data/s4.ts:279`).

- **Carpeta:** `falacias-cti` · perfil `capsula-yt` (190–260 s renderizados) · dominio de las tarjetas **Analysis** (dominio de S4,
  `src/data/course-gcti.ts:70`, y de las seis preguntas `s4m2q1–q6`, `src/data/s4.ts:283-357`); insignia «GCTI» ·
  adversario **PAPER CRANE** (el de S4, `src/data/course-gcti.ts:74-76`; confirmado en el registro de canon §3) con dos
  mensajes interceptados · voz `recording/lidia` · **voz del adversario: la que ya tiene PAPER CRANE en V9, V23 y G04**
  (`sapi/Microsoft Laura`, `rate` 0, `machine`; `video/ach-matriz/narration.json:11-15`) · música `Go On Going - Stayloose.mp3`.
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "gcti"`, `"adversary": "PAPER CRANE"`, `"lesson": "s4m2"`, `"music"`,
  `"examBadge": "GCTI"` (el valor por defecto de la pista; lo pide el encargo y no cambia nada), `"youtubeTitle": "Falacias
  lógicas en CTI: el paso que no se sostiene"` (53 caracteres; el motor añade « | GIAC GCTI en español») y 12 `tags`. **Sin
  `frozen`.**
- **Desviación del encargo (decidida, no olvidada):** `narration.json` lleva `"recording": { "maxPauseMs": 250 }` **sin
  `tempo`**. Las plantillas G02 y G04 traen `tempo: 1.08`; la decisión de Lidia del 2026-10-24 («respetar la velocidad original
  de mis grabaciones», memoria `no-voice-speedup`) manda. Si ella prefiere conservar el recorte de pausas, ya está; si no, se
  borra el bloque entero.
- **Ritmo:** `"examTiming": "sentence-end"`; pregunta para pensar con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3500.
  Los mensajes abren s03 y s05; el de s03 está en otro segmento que la pregunta (el validador no los deja juntos).
- **Efectos (`sfx`):** los automáticos del motor y cinco momentos con sonidos que ya existen (`video/engine/sfx/`): `evidence`
  («check», los vistos verdes del borrador, s01), `pen` («error», el primer círculo rojo, s02), `answer` («check», la respuesta de
  la pregunta, s03), `loop` («lock», se cierra el círculo del razonamiento circular, s04) y `zero` («block», «pruebas nuevas:
  0», s05). Los cinco ids son únicos en todo el guion.
- **Duración (tras las revisiones del 2026-10-25).** Suma de `targetSec` **258 s**; `wordBudget` 64, 110, 175, 64, 86 y 94 (593). El
  guion tiene **566 palabras** (62, 99, 171, 59, 83 y 92). `build-timeline --estimate` da **4:18 (258,5 s)**, dentro del techo del
  perfil (260 s) aunque con poco margen. Con la lectura habitual de Lidia (85–93 % del estimado) quedan **~3:40–4:00** renderizados.
  s03 es la escena larga (80 s estimados). Para ganar margen, en este orden: la segunda frase de `s05-04` («las que se repiten
  unas a otras no suman corroboración»), la transición «veamos tres maneras…» de `s03-01` y la frase de las tres falacias de
  `s06-04`. **`s04-04` («la pista no es el porque…») ya se recortó** para entrar en 260 s.
- **Inserción en la lección (para cuando exista el vídeo):** `src/data/s4.ts`, lección `s4m2`, **después del segundo check**
  («After we deployed the new EDR…», `:260-274`) y **antes de la «Nota de examen»** (`:275-280`): ahí ya están contadas las seis
  falacias de la tabla, el eco de feeds y el matiz, y el vídeo remata con la regla que la nota de examen resume. Descartado
  ponerlo antes del primer check (`:245-259`), porque el vídeo contesta la pregunta de ese check (tres proveedores, una sola
  fuente). Esto no se toca ahora: no hay vídeo ni id de YouTube.

#### Historia e imagen

**Imagen conductora: el boli rojo de quien corrige un problema de mates.** Cuando corrigen un problema, no miran solo el
resultado: buscan el paso donde se tuerce la cuenta y lo rodean en rojo. Un informe es lo mismo, una cadena de pasos de las
pruebas a la conclusión, y una falacia es un paso que se puede rodear. **Un sesgo no se rodea**: está en cómo miras, no en la hoja
(eso lo vendió G04 con la báscula, y aquí no vuelve ni la báscula ni la cabeza: para el sesgo hay unas **gafas con cristales de
color**, que tiñen lo que ves sin dejar nada en el papel). Cuadra con la lección: «Los sesgos distorsionan cómo percibes; las
falacias rompen cómo argumentas. Un informe puede partir de evidencia sólida y arruinarse en la cadena lógica» (`s4.ts:197`).
El vídeo dice «pruebas sólidas y un razonamiento que falla: lo que se rompe es el paso, no la prueba» (`s02-04`) y nunca «la
conclusión es falsa»; no afirma nada que la lección no diga.

**Historia.** Es el mismo día de siempre en Meridian: tu mesa, un borrador de informe (de ejemplo) para el CISO con las pruebas
comprobadas una a una, y un paso entre las pruebas y la conclusión que no se sostiene. Ni el borrador ni sus frases son del caso
de Meridian (rótulo fijo en pantalla desde s03: «Frases de ejemplo de la lección · no son el caso de Meridian»). Se recorre así:
s02, el boli rojo y la diferencia con el sesgo; s03, PAPER CRANE empuja un atajo de fuente («lo firma un gran proveedor») y la
explicación lo desarma; s04, el razonamiento circular; s05, PAPER CRANE empuja otro atajo («tres informes dicen lo mismo») y se
cuenta el eco de feeds como la versión industrial del círculo; s06, tres reglas.

**Imágenes y ejemplos que NO se repiten:** báscula, pesa y silueta de cabeza (G04); sobres (G02 y el «mismo recorte en tres
sobres» de AP03); club de fútbol, casa y tejado (G02); capitán sin GPS, restaurante, tormenta, expediente, perchero e índice (G01,
G03, G05–G07); pizarra, yogur, nevera, mesa de tres patas y bolsillo (V9); cuadro, pintor, firma y cartela (V23); puente (G06 y
`auditoria-halden`); eslabón y cadena (V13). Los ejemplos de G04 (primer informe, «esto también lo confirma», ransomware en las
noticias, «un actor sofisticado nunca reutilizaría») no salen; los de V9, tampoco (matriz, supuestos, diagnosticidad).

#### Conceptos (3) y su imagen

1. **Falacia frente a sesgo** (`s4.ts:195-198` y `:275-280`; objetivos `:189-193`). Un sesgo distorsiona cómo percibes (cognición);
   una falacia rompe cómo argumentas, y se ve en el papel. El examen mezcla los dos. *Imagen:* el problema de mates con el
   boli rojo frente a las gafas de color. *Tarjeta:* «Sesgo: error de cognición. Falacia: de argumentación» (52).
2. **La fuente no es la prueba: appeal to authority y ad hominem, y la salvedad** (`:203-212`, matiz `:241-244`, check
   `:245-259`, `s4m2q1` `:283-292`, `s4m2q5` `:328-342`). Las dos falacias son la misma por los dos lados: quién lo dice ocupa el
   sitio de qué pruebas trae. Evaluar la fiabilidad de una fuente es legítimo (rigor); lo que no vale es que su identidad
   *sustituya* a la evaluación. *Imagen:* en el borrador, el boli rojo rodea el nombre del proveedor y deja vacío el hueco de
   «pruebas que trae»; luego las dos frases de la lección (A, «historial de exageración… revisemos su evidencia con lupa»; B,
   «viene de ese vendor, luego es falso») con la lupa sobre A y el círculo rojo sobre B. *Tarjeta:* «Autoridad y ad hominem: la
   fuente no sustituye la prueba» (56). *Pregunta para pensar:* ver abajo.
3. **Razonamiento circular y su variante industrial, el eco de feeds** (`:228-232`, callout `:235-240`, `s4m2q2` `:293-302`,
   `s4m2q6` `:343-357`, check 1). La conclusión ya estaba en la premisa: defines un grupo por las técnicas de un incidente y luego
   atribuyes ese incidente al grupo porque coinciden. A escala de industria, A publica una atribución provisional, B la cita, C
   cita a B, y A ve consenso y sube su confianza: tres fuentes, cero evidencias nuevas. Se cuenta evidencia independiente, no
   repeticiones. *Imagen:* dos renglones del borrador unidos por una flecha que vuelve a su origen (s04) y, en s05, el mismo
   anillo con tres tarjetas y un termómetro de «confianza» que sube por vuelta. *Tarjetas:* «Circular: la conclusión ya estaba en
   la premisa» (47, s04) y «Corroborar exige pruebas independientes, no repetidas» (53, s05).

**Por qué estas tres y no otras.** Cubren cuatro de las seis preguntas de la lección (q1, q2, q5, q6) y el check 1; las tres son
las que más se escriben en informes CTI reales (citar a un proveedor, descartar a otro, atribuir en círculo); y los dos mensajes de
PAPER CRANE salen del propio contenido: dos atajos de fuente. La lección tiene una cuarta idea fuerte, el matiz «fiabilidad ≠
ad hominem», que no cuenta como concepto aparte: es la mitad del concepto 2 (y es la pregunta para pensar).

#### Se queda fuera (y dónde está)

- **Post hoc ergo propter hoc** (`s4.ts:213-217`; check 2 `:260-274`): «publicamos el informe y el actor desapareció» y «instalamos
  el EDR y no hubo actividad». Es probable que se eche en falta: tiene un check en la lección y es muy de CTI. Se descarta por presupuesto de cápsula (2–3 conceptos) y porque su ejemplo natural (un actor que «desaparece») pide a
  PAPER CRANE hablar de lo que hace el adversario, que el canon no deja (ver «Canon»). Está en la lección y en el Lab 4A
  (`src/data/labs.ts:450-500`), que ya la ejercita.
- **Hasty generalization y false dilemma** (`:218-227`, `s4m2q3`, `s4m2q4`): la voz de s06 solo dice «en su tabla, tres falacias
  más» (post hoc, hasty generalization y false dilemma), sin nombrarlas.
- **La ampliación práctica de s4m2** (`src/data/practical/analysis-yara.ts:51-68`, «Independencia de fuentes y eco de feeds»,
  cadena de citas Faro → Eco → Atlas → blog Z): **no se usa**. Ya la cuenta `video/feeds-requisito` (AP03, `s04`), con otra imagen
  y otros nombres; aquí el eco de feeds sale como lo plantea la lección base (`s4.ts:239`), la variante industrial del círculo.
- **Los sesgos de la nota de examen** (`confirmation, anchoring, mirror imaging`, `s4.ts:279`): no se nombran en la voz ni se
  explican; son de G04. La tarjeta de s02 solo dice «error de cognición».

#### Solapes y límites con otros vídeos

- **G04 (`sesgos-analista`, s4m1):** la misma sección y el mismo adversario. G04 enseña los sesgos con la báscula; este vídeo no la
  nombra ni la dibuja, y se apoya en la frase de la lección («los sesgos distorsionan cómo percibes») sin ejemplos de G04. Lo único
  común: PAPER CRANE, con la voz de Laura.
- **V9 (`ach-matriz`, s4m3) y V23 (`atribucion-cuadro`, s4m5):** las cinco frases publicadas de PAPER CRANE
  (`docs/superpowers/canon/velvet-cicada.md` §3, tabla de mensajes) son «Fíate de lo que ves», «Cuenta las que te dan la razón», «Si
  una prueba es falsa, se te cae todo», «Ponle un país al informe» y «Con la primera pista que encaje…». Los dos nuevos
  («Lo firma un gran proveedor, analista. ¿Quién eres tú para dudar?» y «Tres informes dicen lo mismo, analista. Tres pesan más que
  uno.») son otros dos atajos de método y no se parecen a ninguno. V23 ya dijo en voz que PAPER CRANE «vive de sembrar pistas falsas»
  (`video/atribucion-cuadro/narration.json:85`); este vídeo lo repite en `s03-01`.
- **AP03 (`feeds-requisito`, s3m1):** ya habló del eco de feeds y de la independencia de las fuentes. Aquí el eco se cuenta
  como falacia (circular) y no como criterio de compra de un feed; la imagen es el anillo de tarjetas, no los sobres.
- **Lab 4A (`src/data/labs.ts:450-500`):** sus ocho frases (BigVendorCo, «paró el beaconing», «GLASS VIPER… este log también
  encaja») **no se usan**. Todo el texto de ejemplo sale de `s4.ts:206,211,231,239,243`.

#### Canon

- **Ningún dato nuevo de la campaña.** Sin fechas, horas, equipos, cuentas, IP, dominios ni hashes. La voz solo nombra a Meridian
  como lugar de la mesa de trabajo, al CISO (equipo ya existente, registro §3) y a PAPER CRANE.
- **PAPER CRANE:** dos mensajes nuevos, sin fecha, que pasan a ser canon de su voz (tutea, dice «analista», ironía; **empuja
  atajos de método, nunca una hipótesis, y no confiesa nada**: ninguno dice nada de lo que hizo ni de lo que quiere). Ficha en
  pantalla: «PAPER CRANE · célula de engaño · siembra pistas falsas» (como V9 y V23). La voz lo nombra una vez (`s03-01`: «Otra vez PAPER CRANE, y con otro atajo»), sin repetir la fórmula «vive de sembrar pistas falsas» de V23; la ficha la lleva la pantalla. Nunca dice que sembrara nada en Meridian.
- **No se toca (HALL OF MIRRORS, `src/data/course-gcti.ts:78`):** ni strings en cirílico, ni horarios falsos, ni UTC+8, ni «PAPER
  CRANE las plantó», ni «espionaje industrial sistemático», ni «caso cerrado» (la fila de la lección dice «caso cerrado»,
  `s4.ts:206`; se abrevia en pantalla). Tampoco las pruebas del Lab 4B ni el certificado compartido (E4).
- **Nombres de ejemplo (`VendorCo`, `APT-X`, `APT-Z`):** solo en pantalla, como en la lección (`s4.ts:206,231`). La voz dice «un
  proveedor» y «un grupo». **No están en el registro de canon** (solo `BigVendorCo`, del Lab 4A, §3 línea 94, que aquí no se usa): son
  texto de ejemplo de la lección, no de Meridian ni de la campaña, y se apuntan en §6 al cerrar el vídeo.
- **Lo que fija este vídeo (a apuntar en el registro al cerrarlo; incluye `VendorCo`, `APT-X` y `APT-Z` como texto de ejemplo en pantalla):** los dos mensajes de PAPER CRANE; el borrador de informe de
  ejemplo y el boli rojo; la nota «Frases de ejemplo de la lección · no son el caso de Meridian» (la misma de G04); y que ningún
  vídeo anterior ni posterior dice cuál de las pistas de Meridian pudo ser un señuelo.
- `canon-check.mjs`: 0 tokens, 0 nuevos (`out/canon-refs.md`).

#### Escenas (seis, en tres capítulos: Un paso que falla · Cuando el argumento da vueltas · Para el examen)

| Escena | Cap. | Cues clave | Palabras | Contenido |
|---|---|---|---|---|
| s01-hook | 1 | `draft`, `evidence`, `title`, `promise` | 62 | El borrador con pruebas comprobadas y un paso sin visto. Título («el paso que no se sostiene») antes de los 12 s. |
| s02-papel | 1 | `math`, `bias`, `fallacy`, `pen`, `solid`, `rule` | 99 | Problema de mates y boli rojo; las gafas del sesgo; el círculo rojo sobre el borrador; tarjeta 1. |
| s03-fuente | 1 | `reply-crane`, `authority`, `hominem`, `source`, `two`, `pick`, `answer` | 171 | Mensaje 1; autoridad y ad hominem; tarjeta 2; las dos frases; pregunta; respuesta. |
| s04-circulo | 2 | `define`, `attrib`, `loop`, `circ` | 59 | Grupo definido por un incidente y atribuido por lo mismo; tarjeta 3. |
| s05-eco | 2 | `reply-crane2`, `chain`, `zero`, `indep` | 83 | Mensaje 2; el anillo de tres citas y el termómetro; «evidencias nuevas: 0»; tarjeta 4. |
| s06-recap | 3 | `recap`, `rule-1..3`, `next`, `endcard` | 92 | Tres reglas y la tarea (las seis preguntas de s4m2). |

- **Tarjetas de examen (4, dominio Analysis, insignia «GCTI»; una por escena de s02 a s05, ninguna en s01 ni en el cierre):**
  «Sesgo: error de cognición. Falacia: de argumentación» (52) · «Autoridad y ad hominem: la fuente no sustituye la prueba» (56) ·
  «Circular: la conclusión ya estaba en la premisa» (47) · «Corroborar exige pruebas independientes, no repetidas» (53).
- **Pregunta para pensar (1, s03):** «¿Cuál de las dos frases es la falacia?» (38; `holdMs` 4500). Es una decisión de dos
  opciones y nace del matiz de la lección (`s4.ts:243`). Con las frases quietas, sin lupa ni boli sobre ninguna. El título de la
  escena («La fuente no es la prueba») no da la respuesta. Respuesta: la segunda; la primera es rigor. La pregunta hablada es «Las dos hablan de la misma fuente. Pero solo una es falacia. ¿Cuál?» (`s03-07`).
- **Mensajes interceptados (2, PAPER CRANE, máx. 1 por capítulo):**
  1. s03 (cap. 1): «Lo firma un gran proveedor, analista. ¿Quién eres tú para dudar?» (64). Atajo de fuente (autoridad). La
     narradora lo recoge con «Otra vez PAPER CRANE, y con otro atajo…» y anuncia «tres maneras de que el razonamiento falle».
  2. s05 (cap. 2): «Tres informes dicen lo mismo, analista. Tres pesan más que uno.» (63). Atajo de recuento (eco). Respuesta:
     «Tres, sí. Pero antes de darlos por buenos, mira de dónde sale cada uno».
  Ninguno está en s06 (el validador lo prohíbe) ni coincide con la pregunta.
- **Cierre:** tres reglas y una sola acción: las seis preguntas de s4m2.

#### Voz y léxico

- `lexicon.json` y `lexicon.chatterbox.json` (idénticos, como en G02 y G04): `CISO` («císo»), `PAPER` («péiper») y `CRANE`
  («créin»), las formas ya usadas en los vídeos de la pista.
- **Pronunciaciones dudosas** (van en el guion como `[mostrado|hablado]`, así que la hoja de grabación las muestra como «(lee:
  «…»)»): «appeal to authority» («apíl tu ozóriti»), «ad hominem» («ad hóminem») y «circular reasoning» («sérkiular rísoning»).
  «eco de feeds» no lleva marca (AP03 la dice igual); si prefiere «fids» o «feeds», se pone al grabar.

#### Preguntas para Lidia

1. **Pronunciación de los términos:** la hoja propone «ad hóminem» (h muda, como se dice en español), «apíl tu ozóriti» y
   «sérkiular rísoning». ¿Te encajan? ¿O prefieres decir «el argumento de autoridad» a secas y que el nombre inglés solo salga en la
   tarjeta?
2. **Post hoc:** ¿te basta con que quede en la lección, o la quieres en el vídeo y sacamos la escena del círculo? Habría que quitar
   el eco de feeds (`s05`) para que quepa, o hacer un principal.
3. **Gafas para el sesgo:** la imagen de G04 es la báscula y aquí el sesgo solo asoma como contraste. Si prefieres no volver a
   hablar de sesgos en este vídeo, se quita `bias` y `s02-02` y el resto sigue en pie.
4. **«Tempo»:** he quitado `recording.tempo` por tu decisión del 24-10. ¿Mantienes `maxPauseMs` 250?
5. **«Mates» y «boli»:** se quedan por decisión de las revisiones, pero son opcionales: son registro coloquial. ¿Te suenan bien o
   prefieres «problema de matemáticas» y «bolígrafo rojo»?

#### Notas de exactitud (para el revisor)

Frase del guion → lección:

| Guion | Lección |
|---|---|
| Un informe puede estropearse sin que falle ninguna prueba, solo el razonamiento (`s01-02`); pruebas sólidas y razonamiento que falla (`s02-04`) | `s4.ts:197` |
| Un sesgo distorsiona lo que percibes (`s02-02`); una falacia rompe cómo argumentas (`s02-03`) | `s4.ts:197` |
| Sesgo = cognición, falacia = argumentación; el examen mezcla los dos (`s02-05`) | `s4.ts:279` |
| Dar por bueno algo solo porque lo dice un proveedor conocido: argumento de autoridad (`s03-02`) | `s4.ts:204-207`, `s4m2q5` `:328-342` |
| Descartar un informe porque lo firma un proveedor pequeño aunque su evidencia sea buena: ad hominem (`s03-03`) | `s4.ts:208-212`, `s4m2q1` `:283-292` |
| Quién lo dice ocupa el sitio de qué pruebas trae; la fuente no es la prueba (`s03-04`) | `s4.ts:243` («la identidad de la fuente sustituye la evaluación de su evidencia») |
| Las dos frases A y B; la primera es rigor, la segunda es falacia (`s03-05` a `s03-08`) | `s4.ts:243` (citadas casi literalmente: «historial de exagerar» por «historial de exageración») |
| Defines un grupo por las técnicas de un incidente y luego atribuyes el incidente al grupo porque coinciden (`s04-01`); la conclusión ya estaba en la premisa (`s04-02`); razonamiento circular / circular reasoning (`s04-03`) | `s4.ts:228-232`, `s4m2q2` `:293-302` |
| Proveedor A publica una atribución provisional, B la cita, C cita a B, A ve consenso y sube su confianza; tres fuentes, ninguna prueba nueva; eco de feeds; evidencia independiente, no repeticiones (`s05-02` a `s05-04`) | `s4.ts:239`, `s4m2q6` `:343-357`, check 1 `:245-259` |
| Seis preguntas; tres falacias más en la tabla (`s06-04`) | `s4.ts:283-357` (seis); `:213-227` (post hoc, hasty generalization y false dilemma) |

Puntos que el revisor debería mirar con lupa:
- **El gancho frente a s03.** s01 promete «pruebas comprobadas, razonamiento roto». Circular y eco encajan limpiamente; autoridad y ad
  hominem solo en parte, porque en la autoridad justo no se ha examinado la evidencia. El storyboard presenta cada borrador como un
  ejemplo distinto, pero el revisor de naturalidad debería decir si la promesa del gancho resulta demasiado estrecha.
- **El esquema del eco (s05).** En el storyboard hay solo dos flechas de «cita» (B cita a A, C cita a B); la tercera unión es «A ve
  consenso» (`s4.ts:239`), no una cita de A a C.
- **`recording` sin `tempo`.** `"recording": { "maxPauseMs": 250 }` pasa `build-timeline --check`, pero ninguna importación ha
  ejercitado todavía esa forma (las demás llevan `tempo`).
- **Gafas de color:** `grep` en `video/*/narration.json` y `storyboard.json` no las encuentra en ningún otro vídeo.
- **El matiz de que la conclusión pueda ser cierta** (la lógica estándar: una falacia no vuelve falsa la conclusión) **no se dice**:
  el vídeo solo dice que el paso no se sostiene.
- **La etiqueta del check 1** (`s4.ts:248-258`) llama al mismo caso de los tres proveedores «appeal to authority resting on
  circular citation», mientras que el callout (`:239`) lo llama «falacia circular… eco de feeds». El guion usa el segundo y no
  fuerza una etiqueta en la tarjeta de s05: dice «pruebas independientes», que es la regla de ambos. (La revisión sugería, si cabía, «autoridad apoyada en una cita circular»; no cabe en 260 s y se deja fuera.)
- **«Post hoc» y su doble hueco** (`:213-217` frente a `:265,272`): no se usa; si se añadiera, hay que decir las dos cosas (la
  secuencia no es causa, y la ausencia de detección no es ausencia de actividad).
- **Dos errores que se arreglaron al escribirlo:** (1) s06 decía «con tres falacias más» refiriéndose a las seis preguntas, pero
  las preguntas solo incluyen dos de las tres que no se cuentan (hasty generalization y false dilemma; post hoc solo está en el
  check 2): ahora dice «y, en la tabla, tres falacias más»; (2) la fila de autoridad de la lección termina en «caso cerrado»,
  expresión que el canon veta (HALL OF MIRRORS): no sale en pantalla.

#### Revisiones aplicadas (2026-10-25: exactitud y naturalidad)

**Exactitud (todas aplicadas):**
1. El sesgo ya no se define como «no está en la hoja» (contradecía G04 y `s4.ts:197,279`): `s02-02` «Con un sesgo, el fallo está en
   cómo miras, y distorsiona lo que percibes»; `s02-03` «Una falacia rompe cómo argumentas. Es un paso concreto del razonamiento»;
   `s06-01` «Un sesgo es un fallo de cómo miras. Una falacia, de cómo argumentas…»; storyboard s02: «el fallo no está en un paso
   concreto». Se retira de esta ficha el punto del revisor sobre esa frase.
2. El gancho ya no promete «pruebas comprobadas»: `s01-01` «Las pruebas que cita parecen en orden», y `s01-02` con la reescritura de
   naturalidad. En el storyboard, los renglones de s03 a s05 van en hojas de ejemplo distintas del borrador de s01 (rótulo «frases de
   ejemplo de la lección»), y `s03-01` añade la transición «Veamos tres maneras de que el razonamiento falle».
3. `s03-05`: «historial de exagerar» (no «fama») y, con naturalidad, «sus pruebas», «así que es falso»; se partió en dos segmentos
   (`s03-05` y `s03-06`) porque la frase pasaba de 26 palabras; los ids siguientes pasan a `s03-07` (pregunta) y `s03-08` (respuesta).
4. `s06-02`: «La fuente se evalúa, pero no sustituye a las pruebas…».
5. `s04-04` («La pista no es el “porque”…») **se escribió y se recortó**: con todas las correcciones el estimado subía a 268 s (> 260), y
   el encargo fija el recorte de `s04-04` como primero. La escena s04 pierde el cue `clue`. Si Lidia lo quiere de vuelta, hay que
   quitar otra cosa (ver «Duración»).
6. «Se citan entre sí» y «las citas de unas a otras» pasan a «se repiten unas a otras» (`s05-04`, `s06-03`) y «no suman corroboración».
7. `s05-03`: «Tres fuentes y ninguna prueba nueva. Es la misma prueba contada tres veces. Eso es el eco de [feeds|fíds]…». **No he
   dejado `feeds` en `lexicon*.json`:** con el grupo `[feeds|fíds]` la entrada nunca se usa y el validador avisa («lexicon entries
   never used outside markup: feeds»), así que el léxico queda como estaba (CISO, PAPER, CRANE).

**Naturalidad (aplicada):** «pruebas» en lugar de «evidencia» en toda la voz; tarjeta de s05 «Corroborar exige pruebas independientes,
no repetidas»; `s02-05`, `s03-03`, `s03-07` (pregunta), `s03-08`, `s01-03`, `s04-03`, `s05-02`, `s05-04`, `s06-03` y `s06-04` con las
reescrituras indicadas; `s03-01` varía la fórmula de PAPER CRANE; la réplica del mensaje 2 evita «contarlos» («antes de darlos por
buenos»); pausa de `s04-04` a 400 ms (sin efecto al recortarse el segmento). El texto en pantalla que es literal de la lección
(«historial de exageración… su evidencia con lupa», «la evidencia era buena») no se cambia. «Mates» y «boli» se quedan (pregunta 5).
**No aplicado, por indicación:** «donde te equivocaste» en `s02-01`.

#### Comprobaciones hechas

- 2026-10-25, tras las revisiones: `build-timeline --estimate --check` sin avisos; 27 segmentos, 55 páginas de subtítulos, 31 cues,
  4 tarjetas, 1 pausa para pensar, **4:18 (258,5 s)**. En el camino salieron y se resolvieron cuatro avisos: «s03-05: 33 words»
  (segmento partido), «s06-03: sentence of 23 words (max 22)» (se quitó un «si»), «lexicon entries never used outside markup: feeds»
  (se quitó la entrada) y «total length 04:28 outside the capsula-yt window» (se recortó `s04-04`). `script-sheets`: solo «not frozen».
  `canon-check`: 0 tokens, 0 nuevos.
- `script-sheets.mjs`: solo el aviso de «no congelado». `canon-check.mjs`: 0 tokens, 0 nuevos. `voice-plan.mjs`: falla la lectura de
  la cuota de ElevenLabs por falta de `ELEVENLABS_API_KEY` (no hay `.env.local` en el worktree) y propone `chatterbox/es-es/default`
  (3237 caracteres); no aplica: la voz es `recording/lidia`.
- No he podido ejecutar `npm test` (el worktree no tiene `node_modules`); no se ha tocado ningún archivo de `src/`.
