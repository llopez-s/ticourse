# Recomprobación de exactitud · G04–G07 (segunda pasada) · 2026-10-23

Revisor de solo lectura. Contraste de los cuatro guiones corregidos (`video/sesgos-analista`, `video/producto-bluf`, `video/casos-espejo`,
`video/examen-indice`: `narration.json`, `storyboard.json`, `out/script-notes.md`) con la primera revisión
(`exactitud-G04-G07.md`), con las lecciones **ya corregidas hoy** (`git diff` de `src/data/s5.ts`, `s6.ts`, `tracks.ts`) y con el canon
(`docs/superpowers/canon/velvet-cicada.md` §3, §4, §5, §7). Clasificación: BLOQUEANTE / A CORREGIR / SUGERENCIA.

## Resumen

| Vídeo | Corregido | Sigue mal | Nuevo problema | Veredicto |
|---|---|---|---|---|
| G04 `sesgos-analista` | 2/2 A CORREGIR | 0 | 0 A CORREGIR · 3 sugerencias | **APTO PARA CONGELAR** |
| G05 `producto-bluf` | 5/5 A CORREGIR + 2 puntos abiertos | 0 | 0 A CORREGIR · 3 sugerencias (una importante de fluidez) | **APTO PARA CONGELAR** |
| G06 `casos-espejo` | 6/7 A CORREGIR | 1 parcial (G06-2) | 1 A CORREGIR menor (atribución al «autor»), 3 sugerencias | **NO** (dos retoques de una frase; después, apto sin otra pasada) |
| G07 `examen-indice` | 4/4 A CORREGIR | 0 | 0 · 2 sugerencias | **APTO PARA CONGELAR** |

Comprobaciones transversales (las cuatro cumplen): tarjetas de examen ≤ 58 caracteres (G04 máx. 57; G05 máx. 55; G06 máx. 56; G07 máx. 54), a lo sumo una por
escena, ninguna en la escena final (G04 `s06-recap`, G05 `s10-cierre`, G06 `s11-cierre`, G07 `s11-reglas`). Las metas del storyboard coinciden con la voz
nueva en las cuatro (comprobadas escena por escena; los desajustes están anotados abajo). Ningún bloqueante.

---

## G04 · `sesgos-analista` (s4m1) — APTO PARA CONGELAR

### Corregido
- **G04-1 (A CORREGIR)**: `s02-05` («Lo que puedes es pillarlos a tiempo») ya no existe. La cadena queda `s02-03` «Saber que los sesgos existen no los quita» → `s02-04`
  «Lo que ayuda es la estructura. Es contrastar la báscula con una pesa de fuera». Coherente con `src/data/s4.ts:18` y con q2 (`:127-129`).
- **G04-2 (A CORREGIR)**: mensaje 1 cambiado a «Si el informe ya lo dice, analista, ¿para qué comprobar?» (`s03-03`). Ya no es «la primera…» (V23 / G07 libres). La respuesta
  dice «la primera hipótesis sale con ventaja» (sin «siempre», S1). Empuja un atajo de método (autoridad del informe), no confiesa nada: encaja con la voz de §3/§7.
- S4 (tarjeta «lo reciente o memorable», `s04-02`) aplicada; S5 aplicada en parte («a veces te traicionan», `s02-02`; «te darán… pondrás», `s06-02`).
- Trampa de canon: sin cirílico, horarios falsos, *false flag*, «pistas plantadas», UTC+8, Lab 4A/4B ni ficha «siembra pistas falsas» (revisado en `narration.json` y en los `goal`).
  La voz no nombra a PAPER CRANE ni a ningún grupo. «Grupo X» es el de q1 (`s4.ts:110`). El rótulo «tu cabeza · ejemplo» está en la burbuja de `s01` y «no son el caso de Meridian» desde el primer fotograma de `s03` y `s04`.
- **Pregunta para pensar** (`s04-05`, «¿Qué da por hecho esa frase?», 28 car.): contestable sin haber visto el nombre del sesgo; la respuesta (`s04-06`) da «mirror imaging» y «los actores reales se equivocan, y mucho» (`s4.ts:95`). Correcto.
- Frases-señal correctas: «el primer informe decía» (`s03-02`, `s4.ts:102`), «está en todas las noticias» (`s04-03`), «esto también lo confirma» (`s03-06`, `s4.ts:27`). Las cuatro tarjetas coinciden con la tabla y son *Analysis*.

### Sigue mal
Nada.

### Nuevo problema
- **SUGERENCIA · `s06-01` y pantalla `rule-1`** «el instrumento eres tú, y se corrige con estructura, no con ganas». La lección y la propia tarjeta de `s02-04` dicen **mitigar** (`s4.ts:18`, «se mitigan con estructura»);
  «se corrige» sugiere que desaparece, justo lo que `s02-03` niega. Propuesta: «…y se compensa con estructura, no con ganas» (pantalla: «se mitiga con estructura»).
- **SUGERENCIA · «para qué» ×3.** El mensaje 1 («¿para qué comprobar?»), el 2 («Para qué tanto método») y el de V23 (`atribucion-cuadro/narration.json:128`, «¿Para qué más?») comparten la fórmula. No choca en contenido, pero es la misma muletilla
  en la misma voz. Propuesta para el 2: «Mi método es mi instinto, analista. ¿Y el tuyo?» o «El método es para quien no se fía de sí mismo, analista.» (canon §7: atajo de método, sin confesión).
- **SUGERENCIA · `s02-02`** «que en la vida diaria funcionan de maravilla» presenta como general lo que la lección dice con matiz (`s4.ts:18`, «funcionan en la vida diaria»). Propuesta: «que en la vida diaria suelen funcionar bien».
- **SUGERENCIA (aceptada como decisión de Lidia)** · la promesa «cuatro atajos» y las «seis preguntas de la lección» (`s06-04`) dejan hindsight y base-rate sin nombrar; q4 y q6 (`s4.ts:142-179`) las pillarán en frío. El redactor lo declinó por presupuesto de tiempo (`out/script-notes.md`);
  coste de la solución mínima: «…que traen dos sesgos más» en `s06-04` (~1,5 s). Queda como decisión de Lidia.
- Frase-señal de recap (`rule-2`, pantalla) usa «confirma lo que ya pensábamos» y «ningún actor racional haría» (nota de examen, `s4.ts:102`) mientras la voz enseña «esto también lo confirma» y «nunca reutilizaría» (tabla y q2). Las dos versiones son de la lección; no es error.

---

## G05 · `producto-bluf` (s5m1 + s5m2) — APTO PARA CONGELAR

### Corregido (con el texto nuevo)
- **G05-1 (A CORREGIR)** tarjeta y regla del BLUF: `s07-04` «En un flash, juicio, confianza y acción con plazo. Si falta una de las tres, el lector tiene que adivinarla.» y tarjeta «BLUF de un flash: juicio, confianza y acción con plazo» (54 car.);
  `s07` y su storyboard rotulan «BLUF de un flash». Coincide con el desglose `s5.ts:73` y q9 (`:260-272`).
- **G05-2**: `s08-06` «Apréndetela bien, porque es de las entradas imprescindibles de tu índice del examen.» Respaldado por `s6.ts:244` (las 7 bandas ICD 203 son la primera entrada de la lista). Ya no se afirma frecuencia de examen.
- **G05-3 (ICD 203)**: nuevo `s09-07` «Eso sí, en un producto real, la ICD doscientos tres pide ponerlos en frases separadas. En el examen de la app los verás juntos.» Ver juicio abajo.
- **G05-4**: `s04-03` «Y el juicio va con confianza moderada. Es decir, cuánto aguanta la evidencia que tienes.» (la confianza califica el juicio, no las acciones).
- **G05-5**: `s03-04` «Lo normal es que salga de dos a cuatro horas después de confirmarlo» (SLA típico, `s5.ts:79`); pantalla «SLA típico».
- **Bandas ICD 203**: `s08-04..05` y la tarjeta coinciden **exactamente** con la tabla (`s5.ts:323-329`): likely 55–80, very likely 80–95, unlikely 20–45, almost certain 95–99; «siete bandas» (`s08-06`) correcto.
- **Hoja del flash vs `s5.ts:47-68`**: 18-abril, 06:00 UTC, 41 correos al personal de la cadena de suministro, señuelo «urgent PO revision», 11:40 UTC (`s04-01`), tres acciones con límite 18:00 UTC (`s05-01..04`: proxy y pasarela / reinicio de contraseña y MFA de usuarios del portal / avisar de los clics a IR),
  próximo parte 17:00 UTC «o ante un cambio material» (`s05-05`), «Whether any credentials were submitted» (`s04-06`). Todo coincide; no hay acción, destinatario ni hora nuevos. `Ref: MER-2026-011` retirado (canon §5 punto 17). `cdn-sync-status.example` solo en pantalla.
- **GLASS VIPER (G05-6)**: ni `narration.json` ni los `goal` lo ponen en voz (0 apariciones en `narration.json`; el `goal` de `s04` y `s07` dice que sale en pantalla, literal de la lección, sin subrayar ni rotular). El mensaje de VELVET CICADA entra con la hoja ya
  acercada al bloque ámbar, así que el BLUF queda fuera de plano. Cumple. **Pendiente de canon**: apuntar en §7 «GLASS VIPER en pantalla como sujeto del BLUF del flash, literal de la lección, sin voz» y mantener abierto §5 punto 9.
- **CISO (G05-7)**: `s02-06/07` «Le cuentas el riesgo y la decisión que le propones. En el ejemplo de la lección, adelantar la revisión de accesos de los proveedores.»; pantalla «extracto de la lección · recomendación de CTI, no decisión de Meridian», sin «prevista para Q4».
  Es el ejemplo de `s5.ts:90` y de q10 (`:265-285`), no una decisión de Meridian ni fija el vector (§5 punto 4 intacto). Cumple.
- **«BLUF de un flash» frente al BLUF de manual**: no sale el BLUF de manual ni «high confidence» (§5 punto 8). Spoilers de LAST WORD / Lab 5B: ninguno.
- Mensajes de VELVET CICADA (Pablo + `machine`): tutean, «analista» solo en el primero, atajos de método sin confesión (`s02-01`, `s04-05`, `s06-01`, `s09-01`). Cada uno lo desmonta la narradora justo después.

### Juicio sobre la frase añadida de la ICD 203 (`s09-07`)
**Verdadera y adecuadamente hedgeada.** La ICD 203 (apartado de incertidumbre, punto (2)(b); texto citado en la primera revisión) dice que los productos que expresen confianza con un «confidence level» no deben combinarlo con un grado de probabilidad
en la misma frase. «Pide ponerlos en frases separadas» es una paráfrasis fiel, y «en el examen de la app los verás juntos» es exacto (`s5.ts:336` y el check `:359` usan «likely, low confidence»). La nota pequeña de pantalla (`real`) dice lo mismo.
Mejora (una palabra): «ponerlos» no tiene antecedente claro (el último sustantivo es «prueba»). Propuesta: «Eso sí, en un producto real, la ICD doscientos tres pide poner la probabilidad y la confianza en frases separadas. En el examen de la app las verás juntas.»

### Sigue mal
Nada.

### Nuevo problema
- **SUGERENCIA (importante) · `s09-07` → `s09-08` rompe la cadena.** `s09-08` empieza «Por eso, subir la confianza no sube la probabilidad. Son dos diales distintos.», y ahora «por eso» cuelga de la frase de la ICD (frases separadas), que no es su causa;
  la causa es `s09-06`. Dos arreglos equivalentes: (a) mover `s09-07` **después** de `s09-08` (la tarjeta de examen sigue en `wrap`, que queda como penúltima frase; la nota `real` entra tras la tarjeta); o (b) cambiar `s09-08` a «Y recuerda, subir la confianza no sube la probabilidad. Son dos diales distintos.» Prefiero (b), no mueve cues.
- **SUGERENCIA · la lección ahora contradice al vídeo en un detalle.** `s5.ts:336,359` enseñan «likely, low confidence» como patrón válido sin mencionar la regla de la ICD 203. Conviene una línea en la nota de la lección (fuera de este encargo): «en un producto real, la ICD 203 pide expresarlos en frases separadas».
- **SUGERENCIA · `s03-04` frente a la hoja de las 11:40.** «De dos a cuatro horas después de confirmarlo» y «Son las once y cuarenta» (`s04-01`) con correos «desde las seis» (`s04-04`): quien reste verá 5 h 40 min. Está sin colocar la confirmación en el reloj, como se decidió, así que es correcto, pero si Lidia ve la duda, basta «Lo normal es que salga pocas horas después de confirmarlo».
  Además `s04-04` («desde las seis») y `s05-01` («las seis de la tarde») usan «las seis» para dos horas distintas; la pantalla las rotula 06:00 y 18:00 UTC, así que no es error.
- Restos menores aceptados por el redactor: «Next review: 2026-04-25» sale en cabecera (literal de la lección, `s5.ts:48`) con «NEXT UPDATE 17:00». La voz solo dice el parte de las 17:00.

---

## G06 · `casos-espejo` (s5m4) — NO (dos retoques de una frase)

### Corregido
- **G06-1**: `s08-03` «Más tarde, una acusación formal de EE. UU. señaló a oficiales del GRU, y coincidía en buena parte con lo que las empresas privadas ya habían agrupado por la técnica.»; `s08-04` «Ese ciclo sirve para contrastar el análisis privado.»; pantalla `indict` «coincide en buena parte con el clustering técnico privado».
  Igual o más débil que la lección corregida (`s5.ts:870`, «nombró… coincidiendo en buena parte»).
- **G06-3**: `s03-02` «mucha evidencia técnica que dejó publicada» (ya no «toda»). S1: `s03-03` «Según la lección, fue la primera gran atribución pública de una empresa privada que publicó su evidencia» (literal de `s5.ts:846`, atribuido a la lección).
- **G06-4 (MOONLIGHT MAZE)**: `s02-02` «Suele considerarse una de las primeras intrusiones estatales investigadas a gran escala»; `s02-03` y `s02-05` «Análisis posteriores vincularon sus herramientas con actividad de mucho tiempo más tarde» (ya no «décadas»; igual que la lección corregida, «muy posterior»). Pantalla `mm-tool` «análisis posteriores vincularon su tooling con actividad muy posterior (Turla)».
- **G06-5 (SIGINT)**: `s06-01` «pero no toda la base»; `s06-02` «Puede apoyarse en fuentes… como escuchas y comunicaciones interceptadas»; pantalla `unseen` «puede apoyarse en fuentes como…», «clases posibles, no el contenido de ese documento». Sin sobreafirmar Sony.
- **G06-6 (Meridian / proveedores)**: `s10-04` «El grupo que ataca a Meridian recuerda a tres de esos casos. Espionaje que persiste, evidencia técnica que se acumula y ataques también a los proveedores de sus víctimas.» + `s10-05` «Si le sirven de puente, aún es una pregunta, no una conclusión.»
  (casilla gris «¿puente? aún sin respuesta»). Ni «acceso vía proveedores» ni Orbital ni vector fijado (§5 punto 4 abierto). `s09-08` «En Meridian, el grupo que te ataca también ataca a tus proveedores» es la fórmula de `s4.ts:1008` y de la lección corregida (`s5.ts:939`, «ataques que alcanzan también a sus proveedores»).
- **G06-7 (Sony)**: `s05-01` «que la lección presenta junto al nombre Lazarus»; `s05-05` «Por eso la lección dice que los estados no solo espían…». `s05-03` «El gobierno de EE. UU. lo atribuyó públicamente a Corea del Norte» y `s05-04` «en el curso se lee como una represalia por una película» llevan sujeto atribuyente.
- **S2 / S3 / S5**: `s03-04` «Y un tiempo después, EE. UU. presentó una acusación formal contra oficiales del ejército chino» (más débil que «años después… (2014)» de la lección; no afirma nexo causal). `s04-04` abre con «Según el informe». Notice del storyboard: «Casos reales resumidos de la lección; las atribuciones son las que hicieron públicamente los informes y gobiernos citados · Meridian Dynamics y VELVET CICADA son ficticios».
- Sin nombres de personas (ni en voz ni en `goal`); sin VELVET CICADA en voz (0 apariciones en `narration.json`; solo pantalla y firma de mensajes); sin GLASS VIPER ni dosier de LAST WORD. Cloud Hopper: «docenas… en varios países» (`s09-02`, `s5.ts:875`), nunca «cientos»; sin MSS ni país en voz (pantalla `hop`: tampoco).
- Colisiones de analogías resueltas (expediente en vez de balanza, perchero en vez de garaje, «edificios» en vez de «portales», «casos» en vez de «espejos»; ninguna aparece en voz).

### Sigue mal
- **G06-2 · A CORREGIR (menor), `s04-02` y `s04-03` + pantalla `a1-diamond`.** Quedó la mitad de lo pedido. Lo bueno: ya no dice «lo consiguió» y añade «muchas víctimas». Lo que sigue mal:
  1. `s04-02` «¿Cómo llegó hasta el sponsor, el que dirige la operación y se beneficia? Casi nadie llega.» presupone como hecho que el informe **llegó** al sponsor. La lección lo escribe así por pedagogía (`s5.ts:860,883`), pero el juicio de Mandiant es una atribución pública que China niega;
  2. `s04-03` «**Según sus autores**, porque los cuatro vértices del diamante coincidían año tras año» adjudica a los autores del informe el razonamiento **de la lección** (`s5.ts:860`: «¿Por qué APT1 pudo llegar a sponsor-level…?»). El informe no se estructuró con el Diamond Model; esa lectura (y «cuatro vértices») es del curso;
  3. «con muchas víctimas **a la vez**»: la lección da ~141 organizaciones a lo largo de años (`s5.ts:854-857`), no simultáneas.
  - Propuesta de voz: `s04-02` «¿Cómo llegó el informe a señalar al sponsor, el que dirige la operación y se beneficia? Casi nadie llega.» `s04-03` «Según la lección, porque los cuatro vértices del diamante coincidían año tras año, con muchas víctimas.»
    Pantalla (`a1-diamond`): «según la lección, el informe llegó a señalar al sponsor · casi nadie llega» en vez de «según sus autores, llegó al sponsor».

### Nuevo problema
- **SUGERENCIA · `s04-01`** «¿Una pistola humeante? Ese informe no tenía ninguna.» afirma un hecho del mundo real con la voz propia. Es la tesis de la lección (`s5.ts:860`, «no hay una pistola humeante»), pero un espectador que conozca el informe puede discutirlo. Propuesta: «Según la lección, ese informe no tenía ninguna.»
- **SUGERENCIA · mensajes de VELVET CICADA.** Los tres llevan «analista» (`s02-05`, `s04-01`, `s09-06`). G05 y G07 ya lo limitaron (en G05 solo el primero; canon §7: «dice analista» pero V27 lo usa en uno de dos). Propuesta: quitar el vocativo del 2.º y del 3.º
  («Sin pistola humeante no hay atribución. Qué pena.» / «Firma un contrato con tu proveedor y ya está cubierto.»).
- **SUGERENCIA · `s02-03` y `s02-05` repiten casi literal** «análisis posteriores vincularon… con actividad de mucho tiempo más tarde / de mucho después». Es intencionado (la réplica retoma el dato), pero suena a repetición. Acortar la réplica: «¿Que el pasado no te sirve? Pues esas herramientas volvieron.» (No es una afirmación nueva: es la misma de `s02-03`.)
- **Pendiente fuera del guion (ya anotado por el redactor):** `trackNotice` del motor escribe «datos ficticios» en la transcripción y quizá en la descripción de YouTube; el vídeo muestra casos reales. El rótulo del storyboard ya lo corrige; falta ajustar a mano la cabecera de la transcripción y la descripción. Los países citados niegan las atribuciones: decide Lidia si lo dice en la descripción (no va en voz).

---

## G07 · `examen-indice` (s6m1 + s6m2) — APTO PARA CONGELAR

### Corregido
- **G07-1 (cifras del examen)**: ninguna cifra de preguntas, tiempo, aprobado ni segundos por pregunta en voz ni en pantalla (búsqueda de 75, 82, 71, 96, 130, «horas», «aprobado» en `narration.json` y `storyboard.json`: solo aparece la frase del `goal` que lo prohíbe).
  `s02-01` «Según el temario de la app, es un examen con vigilancia, en el que puedes llevar material impreso.»; `s02-02` «mira lo vigente en la web de GIAC»; chips «examen con vigilancia (proctored) · material impreso permitido · sin dispositivos electrónicos» y recuadro «giac.org · compruébalo tú: preguntas, tiempo y reglas».
  Las únicas cifras son «sesenta segundos» del índice (`s02-05`, de `s6.ts:166`) y «cinco segundos» (`s07-01`, `s6.ts:208`), no del examen. Con la lección ya corregida (`s6.ts:19`: 82 preguntas, 3 horas, 71 %) no hay contradicción posible; la omisión sigue siendo coherente con la decisión.
- **G07-2**: `s03-01` «Según el temario de la app, suelen tener una forma parecida»; `s03-05` «suele haber dos defendibles»; `s03-04` «A esa palabra la llamamos calificador, y la verás en inglés» (ya no promete presencia en el examen real).
- **G07-3**: `s07-03` «el orden alfabético es estricto y las notas son cortas»; `s07-05` «Probablemente estás apuntando un juicio y no un hecho» (`s6.ts:208`); la entrada de tres líneas de `oneline` es inventada, no de la página de la lección. La lección ya tiene la página con notas de una línea (`s6.ts:192-205`), así que `page` y la voz coinciden.
- **G07-4 (TLP)**: se mantiene Collection con ubicación «S3M4» en pantalla (`s6.ts:230`); la tabla de la lección ya dice «Dissemination (estimativo, TLP aplicado, casos)» (`s6.ts:121`). La tarjeta «TLP:AMBER+STRICT: solo tu organización, sin clientes» es correcta.
- **Método e índice como en s6m2**: escenario una vez y rápido, pregunta dos veces, calificador, descartar dos, entre dos «la que responde justo lo que piden», marcar y seguir, micronota que responde sola, tres pasadas, imprimir y encuadernar, las dos primeras pasadas son estudio,
  hechos al índice / juicios a entrenamiento, imprescindibles (`s6.ts:242-252`). Sin cifras de examen. Tarjetas correctas: BEST, FIRST/NEXT (`s05-06` es el check de `s6.ts:85-97`), EXCEPT (`s4.ts`/`s6.ts:99-110`), ACH, TLP, ICD 203 80–95 %.
- **Disclaimer presente y corto**: `s02-02` («esta app es independiente, no está afiliada a SANS ni a GIAC») y `s11-04`, más sello `indep` y `notice`. Mensajes de VELVET CICADA: atajos de examen, sin hecho de campaña ni «la primera» (el 2.º ya es «la de arriba»).
- S1 («La idea es que no te dé tiempo…»), S2 («muchísimos grupos») y S3 («de las preguntas que ya habrás peleado») aplicadas.

### Sigue mal
Nada.

### Nuevo problema
- **SUGERENCIA · referencias de línea obsoletas en el storyboard** (`s6.ts:193-210`, `:235`, `:249-260`, y `:73-82`). Tras el recorte de la página de índice, la página está en `:192-205`, la fila TLP en `:230` y los imprescindibles en `:242-252`. El constructor de escenas que copie la página debe usar el texto **actual**
  de la lección (notas de una línea: «separates hypotheses», «1st number sticks»…), no uno anterior. Actualizar las referencias en `storyboard.json` y `out/canon-refs.md` antes de congelar.
- **SUGERENCIA · `s02-05` frente a la cuerda.** «La idea es que no te dé tiempo a buscarlo todo» (diseño del examen, `s6.ts:25`) con el nuevo «82 preguntas / 3 horas» sigue siendo cierto (~130 s por pregunta, no es holgado). No requiere cambio; solo conviene no tocarlo si la lección vuelve a cambiar el formato.

---

## Notas finales para quien congele
1. **Antes de congelar G06**: aplicar el retoque de `s04-02`/`s04-03`/pantalla `a1-diamond` (G06-2). Después no hace falta otra pasada de exactitud.
2. **G05**: arreglar el «por eso» de `s09-08` (cambio de una palabra) y precisar «ponerlos» en `s09-07`; apuntar los dos puntos de canon (GLASS VIPER en pantalla, CISO como ejemplo de la lección) en §7 al cerrar.
3. **G04**: «se corrige» → «se compensa/mitiga» en `s06-01`/`rule-1`; el resto son sugerencias.
4. **Lección (fuera de encargo)**: s5m2 podría añadir la precisión de la ICD 203 sobre frases separadas (`s5.ts:336`); `s6.ts:121` ya no necesita cambio.
