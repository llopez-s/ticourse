# Revisión de exactitud · G04–G07 (tanda GCTI) · 2026-10-23

Revisor de solo lectura. Guiones revisados (borradores sin congelar): `video/sesgos-analista` (G04), `video/producto-bluf` (G05),
`video/casos-espejo` (G06), `video/examen-indice` (G07). Contraste hecho contra `src/data/s4.ts`, `s5.ts`, `s6.ts`, `s3.ts`,
`docs/superpowers/canon/velvet-cicada.md` (entero) y la ficha `docs/superpowers/plans/fichas-gcti/README.md`. Comprobado también contra el
texto vigente de la ICD 203 (`archive.dni.gov/files/documents/ICD/ICD-203.pdf`) y la página del GCTI en giac.org (consultadas hoy).

Clasificación: **BLOQUEANTE** (no se congela con esto), **A CORREGIR** (error o sobreafirmación que hay que tocar antes de congelar),
**SUGERENCIA** (mejora, no inexactitud).

## Resumen ejecutivo

| Vídeo | BLOQUEANTE | A CORREGIR | SUGERENCIA |
|---|---|---|---|
| G04 `sesgos-analista` | 0 | 2 | 7 |
| G05 `producto-bluf` | 0 | 5 (+2 recomendaciones pedidas) | 5 |
| G06 `casos-espejo` | 0 | 7 | 5 |
| G07 `examen-indice` | 0 | 4 | 5 |

Ningún bloqueante: no hay tarjeta de examen que enseñe lo contrario de la lección, ni pista falsa en G04, ni spoiler de LAST WORD / Lab 5B.
Los hallazgos más importantes, en orden:

1. **G05, ICD 203 (texto real, apartado de incertidumbre, punto (2)(b))**: la directiva dice que un producto que use «confidence level» *no debe combinar* nivel de
   confianza y grado de probabilidad *en la misma frase*. La lección (y `s09` del vídeo) enseña justo «likely, low confidence» en una frase.
   Hay que mantener la frase (es la del examen de la app) pero decir que en un producto real van en frases separadas. Ver G05-3.
2. **G07, cifras del examen**: giac.org lista hoy **82 preguntas y 3 horas**, no «unas 75» y «2 horas» como la lección. El guion ya
   hedgea («según el temario de la app… confírmalos tú»), pero repite una cifra que la fuente oficial contradice. Recomiendo quitar la cifra
   de voz y pantalla y corregir `s6.ts:19`. Ver G07-1.
3. **G06, tres sobreafirmaciones sobre hechos reales**: «confirmó» para una acusación formal (s08-03), «Lo consiguió» para el nivel sponsor de
   APT1 (s04-02) y «toda publicada» (s03-02). Ver G06-1 a G06-3.
4. **G07, dominio de la tarjeta EXCEPT**: ambos dominios tienen base (agrupar con enlaces fuertes/débiles está en s2m4, *Intrusion Analysis*, y en s4m4, *Analysis*); solo hay que ser coherente con la tarjeta de `s05-02`. Es sugerencia, no error.
5. **G05, las dos dudas del redactor**: GLASS VIPER en pantalla → mantener tal cual y apuntarlo; decisión del CISO → mantener solo como ejemplo
   de la lección y recomendación, no como decisión de Meridian. Ver G05-6 y G05-7.

---

## G04 · `sesgos-analista` (s4m1, PAPER CRANE)

### Comprobación de la trampa de canon (punto 2 del encargo)

Pasa. No hay en voz, storyboard, tarjetas, preguntas ni mensajes: cirílico, «horarios falsos», «false flag», «pistas plantadas», «siembra pistas
falsas», UTC+8, Lab 4A ni Lab 4B. La ficha de PAPER CRANE no se pone (`out/script-notes.md:36-38`). Los dos mensajes empujan atajos de método y no
confiesan nada (canon `velvet-cicada.md:598-599`, `:951-952`). Una cautela en G04-S3.

### A CORREGIR

**G04-1 · `s02-05`** — «O sea, que sesgos tendrás siempre. Lo que puedes es pillarlos a tiempo.»
- Problema: contradice a `s02-03` («saber que los sesgos existen no los quita, porque actúan antes de que te des cuenta») y a la tesis de la
  lección: los sesgos no se pillan por vigilancia propia, se mitigan con estructura. «Pillarlos a tiempo» sugiere que la atención basta.
- Evidencia: `src/data/s4.ts:18` («los sesgos no se eliminan con fuerza de voluntad; se mitigan con estructura»); q2 `s4.ts:127-129` (actúan
  «pre-consciously»).
- Propuesta: «O sea, que sesgos tendrás siempre. Lo que puedes es montar un proceso que los pille por ti.»

**G04-2 · `s03-03` (mensaje) frente a canon de voz** — mensajes «La primera hipótesis suele ser la buena, analista. Quédate con ella.»
- Problema: choca de cerca con el mensaje ya publicado de V23, «Con la primera pista que encaje ya tienes bastante. ¿Para qué más?»
  (`video/atribucion-cuadro/narration.json:128`; canon `:957-958`): mismo atajo («quédate con lo primero») con la misma voz. Además, en el curso
  habría tres atajos «la primera…» (V23, G04 y G07 `s05-04`, «Si dudas, la primera»).
- Propuesta (atajo distinto, mismo carácter, apela a la autoridad en lugar de al orden): «Si lo dice un proveedor serio, analista, ya está dicho.
  ¿Para qué dudar?». Respuesta `s03-03` sin cambios («…la primera hipótesis siempre sale con ventaja» → mejor «sale con ventaja», sin «siempre»).

### SUGERENCIA

- **G04-S1 · `s03-03`** «la primera hipótesis siempre sale con ventaja»: «siempre» sobra (la lección dice que el primer dato «encuadra»,
  `s4.ts:31`). Propuesta: «la primera hipótesis sale con ventaja».
- **G04-S2 · `s03-06` y `s06-02`**: la frase-señal que da la «Nota de examen» es «confirma lo que ya pensábamos» (`s4.ts:102`); el vídeo usa la
  de la tabla, «esto también lo confirma» (`s4.ts:27`). Las dos son de la lección, pero la del examen es la primera. En `s06-02` (o en la
  pantalla de `rule-2`, que ya la lleva) decir «“confirma lo que ya pensábamos”, confirmation». Además «sospecha» (`s03-06`) sobreinstruye: mejor
  «frénate y pregunta qué lo contradiría».
- **G04-S3 · `s04-04..06` (mirror imaging)**: la frase de la lección («un actor sofisticado nunca reutilizaría infraestructura», `s4.ts:86`) es
  la del segundo check y encaja con el examen («ningún actor racional haría…», `:102`). El redactor ya señaló la ironía con V4 (certificado
  compartido en tres IP, canon `:115`, `:334`); como S3 va antes de S4 no es spoiler de DEEP WELL (se desbloquea al vencer a S3), pero el rótulo
  «no es el caso de Meridian» debe verse **todo el tiempo** que la frase esté en pantalla. Alternativa limpia de la propia lección: «Nadie quemaría un
  0-day en un objetivo tan pequeño» (`s4.ts:42`). Tampoco digas que esos incidentes «sí están relacionados»: la respuesta correcta es «con esa frase
  no puedes descartarlo», y `s04-06` ya lo deja implícito. Opcional: «…y eso no prueba que no estén relacionados».
- **G04-S4 · `s04-02` y tarjeta**: la tarjeta dice «lo reciente o llamativo», la tabla «reciente/memorable» (`s4.ts:36`). Propuesta: «Availability: lo
  reciente o memorable parece más probable».
- **G04-S5 · `s02-02` y `s06-02`**: «en la vida diaria funcionan de maravilla… te traicionan» y «En el examen te dan la frase» presentan como
  universales lo que la lección dice con matiz («pueden traicionar»; «Te darán una frase de analista», nota de la lección). Propuesta:
  «…funcionan bien en la vida diaria. En el análisis, te pueden traicionar.» / «Según la lección, en el examen te dan la frase y tú le pones nombre.»
- **G04-S6 · cobertura de la lección (no es un error de exactitud, es alcance que el redactor recortó a propósito)** · — «Verás cuatro atajos» y «Todo cabe en tres reglas».
  Nota: la tabla de la lección tiene **seis** sesgos (`s4.ts:21-54`) y el quiz de s4m1 pregunta por hindsight (q4, q6) y por base-rate
  neglect (primer check, `:69-82`). El vídeo manda al alumno a «las seis preguntas de la lección» (`s06-04`) sin haber nombrado hindsight ni
  base-rate neglect, y `s05-04` ofrece la contramedida de q6 (juicio por escrito antes del desenlace) sin decir que es la que mitiga hindsight.
  Quien conteste q4/q6 sin haber visto el nombre llega en frío.
- Propuesta (cabe en el presupuesto, ~25 palabras): en `s05-04`, «…para que luego nadie diga que era evidente. Ese es el hindsight bias.»
  Y en `s06-04`, «Ahora te tocan las seis preguntas de la lección, que traen dos sesgos más, hindsight y base-rate neglect. Y ve calibrando esa báscula.»
- Si se prefiere no tocar la duración: bajar `s01-02` a «Verás cuatro atajos de la cabeza… y la lección trae dos más».
- **Hook (`s01-01`) frente a canon V23**: «el CISO te pregunta quién ha sido. Y tú ya tienes una respuesta en la cabeza» repite el gancho de V23
  (`narration.json:25`, «El CISO quiere un nombre») y pone *a la analista* con un «ya sé quién fue» sobre Meridian. Es pedagógico y el canon
  no se rompe (no hay nombre, país ni grupo), pero no se debe leer como que la analista de la campaña ya cree algo. El rótulo «no es el caso
  de Meridian» solo sale en s03/s04; añadirlo también a la burbuja de s01 («tu cabeza, ejemplo»).

### Lo que está bien (G04)

- Definiciones y frases-señal de los cuatro sesgos coinciden con la tabla y la nota de examen (`s4.ts:21-54`, `:102`); las cuatro tarjetas de examen son
  correctas y de dominio *Analysis*.
- Heuer y la CIA salen como en la lección (`s4.ts:18`), sin fechas ni cargos; «actúan antes de que te des cuenta» es paráfrasis fiel de q2.
- «ACH, una técnica que verás más adelante en esta sección» es exacto (ACH es s4m3, no la lección siguiente, `s4.ts:18,60`).
- La contramedida «revisión por pares hostil» y «registrar juicios antes del desenlace» son literales de `s4.ts:65`.
- Analogía de la báscula: representa bien un error *sistemático* y la pesa de fuera como calibración externa. Solo hay colisión de objeto con G06 (ver
  «Colisiones» al final).

---

## G05 · `producto-bluf` (s5m1 + s5m2, VELVET CICADA)

### A CORREGIR

**G05-1 · tarjeta de `s07-04` («BLUF: juicio, confianza y acción con plazo»)** y la regla de `s07-04`.
- Problema: la regla «juicio + confianza + acción con plazo» es la del BLUF **de un flash alert** (desglose `s5.ts:73`, q9 `:260-272`: «A flash BLUF
  carries judgment + confidence + immediate action»). El BLUF general (s5m2) es «juicio principal (con confianza) → hallazgos…» (`s5.ts:306`); su
  ejemplo («BLUF de manual», `:311-314`) **no lleva acción con plazo**. La tarjeta, tal como está, enseña que todo BLUF lleva acción con plazo: un
  alumno marcaría mal una pregunta sobre el BLUF estratégico.
- Propuesta: tarjeta «BLUF de un flash: juicio, confianza y acción con plazo» y voz `s07-04`: «En un flash, juicio, confianza y acción con plazo. Si falta
  una de las tres, el lector tiene que adivinarla.»

**G05-2 · `s08-06`** — «Memorízala, que es de lo más preguntado del dominio.»
- Problema: es literal de la nota de examen de la lección (`s5.ts:375`), pero es una afirmación de frecuencia de examen que ni la lección ni nadie
  puede sostener (GIAC no publica estadísticas de preguntas). El propio redactor la marca (notas, (d)).
- Propuesta (con base real, la de `s6.ts:249`): «Memorízala. Es la primera de los imprescindibles de tu índice.»

**G05-3 · `s09-05..07` + pantalla `answer` + `s10-03`** — «Una frase: probable, pero con confianza baja» / «We assess it is LIKELY the actor will target suppliers (LOW confidence)».
- Problema real-world: la ICD 203 dice textualmente (apartado de incertidumbre, punto (2)(b)): «products that express an analyst's confidence … using a “confidence level” (e.g.,
  “high confidence”) must not combine a confidence level and a degree of likelihood, which refers to an event or development, in the same sentence.»
  El vídeo atribuye las bandas a la ICD 203 (`s08-02`) y luego enseña el patrón combinado como si la directiva lo recomendara. La lección tiene el
  mismo patrón (`s5.ts:335-337`, check `:359`) y es lo que preguntará el examen de la app, así que **no se quita**, pero hay que hedgearlo.
- Además, el BLUF del flash (`s07`) usa «moderate confidence» sin término de probabilidad, que es lo conforme: el vídeo puede apoyarse en ello.
- Propuesta (añadir a `s09-07`, ~20 palabras): «Por eso, subir la confianza no sube la probabilidad. Son ejes distintos. En un producto real, la ICD 203
  pide ponerlos en frases separadas; en el examen de la app los verás juntos.» Y en `s10-03`: «…con su probabilidad en una banda y su confianza aparte.» (ya está bien).
  Aviso en la nota de la lección (fuera de este encargo): la nota podría añadir esa precisión.

**G05-4 · `s04-03`** — «Todo ello con confianza moderada, o sea, cuánto te fías de tu base.»
- Problema: «todo ello» incluye «qué hacer hoy»; la confianza califica el **juicio**, no las acciones (`s5.ts:73`; ICD 203). Y «cuánto te fías de tu base»
  adelanta la definición de `s09-03`. Está bien anticipar (nota (e)-12 del redactor), pero la frase debe acotar.
- Propuesta: «El juicio, con confianza moderada. Es decir, cuánto aguanta la evidencia que tienes.»

**G05-5 · `s03-04`** — «Sale en dos a cuatro horas, como máximo, desde que lo confirmas.»
- Problema menor: la lección lo da como «SLA típico» (`s5.ts:79`, cabecera «SLA típico»). «Como máximo» lo convierte en límite. Y la hoja del flash
  sale a las 11:40, 5 h 40 después de las 06:00 (nota (b) del redactor): quien una dos relojes verá un incumplimiento.
- Propuesta: «Lo normal es que salga en dos a cuatro horas desde que lo confirmas.» Mantener sin colocar la confirmación en el reloj (ya está así).

### G05-6 · Punto abierto 1 del redactor: GLASS VIPER en pantalla (canon §5 punto 9) → **RECOMENDACIÓN: mantener el texto literal de la lección, sin voz, y apuntarlo**

- Qué ocurre: la hoja del flash (s04) y el BLUF (s07) enseñan «GLASS VIPER is running an active credential-phishing wave…» (`s5.ts:50`) en un vídeo firmado por VELVET CICADA.
- Por qué mantenerlo: (a) es texto de la lección, que el alumno leerá a continuación; taparlo (barra, «[grupo]») crea un hueco visible y una contradicción nueva con la
  app; (b) Meridian CTI, autora del flash (canon `:103`), usa en sus propios documentos el nombre de seguimiento de E7, GLASS VIPER, tal como en las alertas de V3
  (canon `:453`) y la lectura de V3 ya lo define como «nombre de seguimiento para el implante y quien lo usa» (`:227`); (c) la voz nunca lo dice, como en V22 y V27.
- Cautelas: (1) apuntar en canon §7 «GLASS VIPER sale en pantalla como sujeto del BLUF del flash, copia literal de la lección, sin explicación» y mantener §5 punto 9
  abierto; (2) la tarjeta del mensaje de VELVET CICADA entra en s04 *sobre la hoja* con el BLUF visible debajo: dos nombres de adversario en el mismo plano. Ajustar
  el encuadre para que, al entrar el mensaje, la hoja esté ya acercada a «WHAT WE DO NOT KNOW YET» y el BLUF quede fuera de plano (el storyboard ya acerca la hoja por
  zonas); (3) no usar el «BLUF de manual» de s5m2 (lo han dejado fuera, bien: nombra a VELVET CICADA y fija «high confidence» de la exfiltración, canon §5 punto 8).

### G05-7 · Punto abierto 2 del redactor: decisión del CISO «adelantar la revisión de accesos de los proveedores» → **RECOMENDACIÓN: mantener solo como ejemplo de la lección y como recomendación de CTI, no como decisión de Meridian**

- `s02-05`: «Le cuentas el riesgo y la decisión que tiene delante, que aquí es adelantar la revisión de accesos de los proveedores.»
- Problema: el ejemplo de la lección (`s5.ts:90`) responde a otro hallazgo («3 dominios nuevos esta noche») y recomienda adelantar la revisión «prevista para Q4».
  «Que aquí es…» lo ata a la ola del 18-4 y lo convierte en canon nuevo con dos implicaciones: (i) el CISO «tiene delante» una decisión (el canon lo trata como alguien que
  pregunta o recibe, no que decide: `velvet-cicada.md:85`, `:877`); (ii) «Riesgo principal: acceso a diseño de propulsión vía cuentas de terceros» (pantalla) toca el
  vector por proveedor, abierto en §5 punto 4.
- Propuesta de voz: «Al CISO no le sirve una lista de bloqueos. Le cuentas el riesgo y la decisión que le propones. En el ejemplo de la lección, adelantar la revisión de
  accesos de los proveedores.» Pantalla: dejar «extracto de la lección» (ya está), mantener «Riesgo principal…» como riesgo, **y** quitar «prevista para Q4» si no se quiere fijar
  calendario; recibir «riesgo y decisión» con el verbo «recomendamos». En canon §7: «recomendación de ejemplo (lección), no decisión tomada; no fija vector».
- Alternativa más prudente si prefieres cero canon nuevo: dejar la fila del CISO con «riesgo y decisión» sin el texto del ejemplo.

### SUGERENCIA

- **G05-S1 · `s02-05..07` y pantalla** — la tabla de la lección da el **assessment estratégico** a «CISO, dirección, board» (`s5.ts:27`). El vídeo asigna al CISO «riesgo y decisión» (sin
  producto) y al consejo el assessment, y la pantalla muestra «CISO, dirección, board» en la fila del consejo. Propuesta en `s02-07`: «Eso es un assessment estratégico, que también lee el CISO, y llega en su propio ciclo…».
- **G05-S2 · `s01-01`** — «a Meridian le llegan correos de phishing»: el canon es «41 correos de phishing de credenciales a la cadena de suministro» (`velvet-cicada.md:61`). Propuesta: «a la cadena de suministro de Meridian».
- **G05-S3 · `s09-04`** — «Es cuánto te fías del pronóstico»: la confianza es del *analista* sobre su base, no del lector. «cuánto se fía el pronosticador de su pronóstico, según venga de un satélite o de alguien que mira por la ventana». La analogía no falsea el concepto (el porcentaje de lluvia es probabilidad; la fuente es la base).
- **G05-S4 · `s04-04`** — no digas «sábado»/«viernes» en ningún rótulo: 2026-04-18 cae en sábado (2026-03-02 es lunes, canon `:46`) y la lección no lo dice.
- **G05-S5 · analogía del titular (`s06-03`)**: no falsea, pero un titular no lleva confianza ni acción. Añadir «y, a diferencia de un titular, lleva confianza» o dejar que `s07` lo corrija (ya lo hace).

### Cotejo con canon §2/§3 y `s5.ts:47-68` (punto 3 del encargo)

| Dato en el guion | Canon / lección | Resultado |
|---|---|---|
| 18 abril, correos desde 06:00 UTC | `velvet-cicada.md:61`, `s5.ts:56` | OK |
| 41 correos | `s5.ts:56` | OK |
| Flash MER-FA-2026-014 a las 11:40 UTC, TLP:AMBER | `:64`, `s5.ts:47-48` | OK (TLP solo texto, como V27) |
| Acciones antes de las 18:00 UTC (3, tal cual) | `s5.ts:63-66` | OK, sin acciones ni destinatarios nuevos |
| Próximo parte 17:00 UTC | `s5.ts:68` | OK. «Next review: 2026-04-25» sale en cabecera: ya avisado por el redactor, atenuar la línea |
| `cdn-sync-status.example` (solo pantalla) | canon `:118`; pDNS `last seen` 18-4 11:31:55 (`s3.ts:776`), 8 min antes del flash: coherente | OK |
| `Ref: MER-2026-011` retirado | canon §5 punto 17 | OK |
| Sin E7/E9/Orbital/hash/PDB/C2 | — | OK |

Spoilers: ninguno (no sale LAST WORD, ni el BLUF de manual, ni Lab 5B). Comprobado contra el epílogo del Lab 5B (`labs.ts:1144`: el consejo lee el BLUF el lunes, aprueba rotación de credenciales de proveedores, segmentación del enclave de R&D y presupuesto CTI; el ISAC despliega las reglas): ninguno de los cuatro guiones lo adelanta, ni la decisión «adelantar la revisión de accesos de los proveedores» de G05 coincide con esas medidas. Mensajes de VELVET CICADA: los cuatro son atajos sardónicos (tutean, «analista», sin confesión, sin hechos nuevos); `s09-01` pone en
boca del adversario una falsedad («tu probable pasa a casi seguro») que la narradora desmonta justo después: correcto como patrón, la tarjeta debe quedar en pantalla solo mientras suena la refutación.

### Lo que está bien (G05)

- **Bandas ICD 203 exactas** a la tabla de la lección y a la directiva (`s5.ts:323-329`; ICD 203, punto (2)(a): 01-05, 05-20, 20-45, 45-55, 55-80, 80-95, 95-99): `s08-04..05`
  y la tarjeta «Very likely 80 a 95 % · Likely 55 a 80 %» son correctas; «siete tramos» es exacto.
- Probabilidad ≠ confianza: definiciones de `s09-02/03` literales de `s5.ts:336` y de la ICD 203 (calidad y cantidad de fuentes, razonamiento); la respuesta a «likely con confianza baja» (`s09-06`) coincide con la lección y su check.
- Anatomía del flash (BLUF, lo que sabes, lo que no sabes, acciones con plazo, próximo parte): idéntica al desglose `s5.ts:73`; la tarjeta «Flash alert: incluye lo que aún NO sabes» y «Próximo parte: sin noticias = sin cambios» son fieles a q8.
- Emparejamiento producto–audiencia (flash→SOC; informe de campaña tras 3-5 días; estratégico en su ciclo) conforme a las dos tablas de `s5.ts:23-30,79-84`.
- Se descartó con acierto el BLUF de manual y el ejemplo de «3 dominios».

---

## G06 · `casos-espejo` (s5m4; también s4m5) — hechos reales

Criterio aplicado: (a) ¿está en la lección con ese nivel de detalle? (b) ¿es verdad y está bien atribuido en el registro público? Las atribuciones están casi siempre bien
encadenadas («el informe atribuía», «lo atribuyó públicamente el gobierno», «informes públicos posteriores los asociaron»). No hay nombres de personas ni nombres de organizaciones en voz salvo
países y GRU/SVR. Fallan tres sobreafirmaciones y cuatro hedges.

### A CORREGIR

**G06-1 · `s08-03`** — «una acusación formal de EE. UU. nombró a oficiales del GRU. Y **confirmó** buena parte del agrupamiento técnico que habían hecho empresas privadas.»
- Problema: una acusación formal (indictment) es un escrito de la fiscalía, con *alegaciones* que no están probadas; «confirmó» le da valor de hecho probado. Además la acusación de 2018 (12
  oficiales del GRU) cubre el grupo asociado al GRU (APT28), no el otro conjunto (APT29/SVR), así que no «confirma» el agrupamiento de los dos. La lección lo dice igual
  (`s5.ts:870`, «confirmando buena parte del clustering técnico privado»; q9 `:1060-1073`, «judicially-vetted evidence», que también sobreafirma). El vídeo no debe heredar el exceso.
- Propuesta: «Más tarde, una acusación formal de EE. UU. señaló a oficiales del GRU, y coincidía en buena parte con el agrupamiento técnico que habían hecho empresas privadas.»
  `s08-04` («Ese ciclo valida el análisis privado, o lo corrige») → «Ese ciclo permite contrastar el análisis privado: lo respalda o lo corrige.»
- Pantalla `indict` («confirmó buena parte del clustering técnico privado»): «coincide con buena parte del clustering técnico privado».

**G06-2 · `s04-02`** — «¿Cómo llegó tan arriba, hasta el sponsor…? Casi nadie llega. **Lo consiguió** con los cuatro vértices del diamante, años seguidos…»
- Problema: afirma como logro cierto que el informe *llegó al sponsor*. Lo que hay en el registro es que Mandiant **concluyó** que APT1 era una unidad concreta del ejército chino
  y que operaba con apoyo estatal; es un juicio público, discutido y negado por China. La lección lo formula así por pedagogía (`s5.ts:860`, `:883`).
- También tensiona con s4m5, donde el sponsor «rara vez basta» con telemetría y «baja con solo telemetría» (`s4.ts:984,993`); APT1 se apoyó en la visibilidad acumulada de muchas
  víctimas a la vez, no en una sola red. Ese es el puente que falta (duda 3 del redactor).
- Propuesta: «¿Cómo llegó tan arriba, hasta el sponsor, el que dirige y se beneficia? Casi nadie llega. Según sus autores, lo hicieron con los cuatro vértices del diamante, años
  seguidos, apuntando al mismo sitio, y con la visibilidad de muchas víctimas a la vez, no de una sola red.» Cierra con `s04-07` sin cambios («depende de las fuentes que tengas»).

**G06-3 · `s03-02`** — «lo apoyaba con un montón de evidencia técnica, **toda publicada**.»
- Problema: Mandiant publicó mucha evidencia (apéndices de indicadores, perfiles), pero no «toda» (el informe no es un volcado completo de sus datos; comprobar la formulación exacta antes de afirmar qué retuvo). La lección dice
  «evidencia publicada» (`s5.ts:846`) y, en la tabla, «todo publicado» (`:883`).
- Propuesta: «Y lo apoyaba con una gran cantidad de evidencia técnica, publicada para que otros pudieran revisarla.» (También la tarjeta `a1-first`: «evidencia publicada» está bien.)

**G06-4 · `s02-01..03` (MOONLIGHT MAZE)** — «una de las primeras intrusiones **de un estado** investigadas a gran escala» y «conectaron sus herramientas con actividad de décadas más tarde».
- Problema: MOONLIGHT MAZE nunca tuvo una atribución estatal oficial confirmada; que fue de origen estatal es la conclusión generalizada (lección: «Estatal (años después)», `s5.ts:882`), no un
  dato cerrado. Y el vínculo posterior de herramientas (que la lección etiqueta «Turla», `:841`) es una *hipótesis de análisis de código*, no un hecho; hablar de «décadas» es exagerado (unos 15-20 años según los
  análisis públicos), aunque la lección lo escribe.
- Propuesta: `s02-02` «Se considera una de las primeras intrusiones estatales investigadas a gran escala.» `s02-03` «…Y lo curioso viene después. Análisis posteriores vincularon sus herramientas con actividad
  de muchos años más tarde.» En pantalla `mm-tool`: «análisis posteriores vincularon su tooling con actividad posterior (Turla)».

**G06-5 · pantalla `unseen` (s06) «SIGINT · comunicaciones interceptadas» y «evidencia técnica parcial» detrás de la tachadura**
- Problema: presenta el SIGINT y la evidencia parcial como el contenido real de la atribución de Sony. El gobierno de EE. UU. publicó parte del razonamiento técnico (malware, infraestructura) y *no confirmó* públicamente
  la fuente exacta; que hubo SIGINT es lo que la lección dice como posible («puede basarse en… SIGINT», `s5.ts:865`). La voz (`s06-02`) lo dice bien («Puede descansar…»), la pantalla no.
- Propuesta: rótulo «puede descansar en fuentes como…» y «clase de fuente», no «detrás de la tachadura está…». Y la voz de `s06-01` «Del gobierno ves la conclusión, pero no la base» → «…pero no toda la base».

**G06-6 · `s10-04` + pantalla `vc-patterns`** — «el grupo de Meridian **repite tres de esos patrones**: … ataques a sus proveedores».
- Problema: en Cloud Hopper el proveedor era el **puente** hacia los clientes; en el canon, los proveedores de Meridian (Orbital) son otra víctima y el vector sigue abierto
  (§5 punto 4, `velvet-cicada.md:299`, `:716`, `:719-720`). «Repite el patrón» sugiere puente. El redactor evitó «acceso vía proveedores» (`s5.ts:939`), bien, y usó la
  fórmula de V23 (`s4.ts:1008`); falta evitar la equivalencia con Cloud Hopper.
- Propuesta: «Y el grupo de Meridian recuerda a tres de esos casos: espionaje que persiste, evidencia técnica que se acumula y ataques también a sus proveedores. Lo del puente, de momento, es una pregunta,
  no una conclusión.» (si se quiere más breve: «…y ataques también a sus proveedores, aunque no sabemos si le sirven de puente».)
- Y en `s09-06` (frase correcta tal cual) mantener «ya lo sabes» solo si hace referencia a V14; si no, «en Meridian, el grupo ataca también a sus proveedores».

**G06-7 · `s05-01` y `s05-05` (Sony/Lazarus)** — «Sony Pictures, o Lazarus» y «los estados también ejecutan ataques destructivos…»
- Problema: «Sony Pictures, o Lazarus» equipara un incidente con un nombre de grupo que otros proveedores asignaron años después; la lección solo lo pone en el título (`s5.ts:862`). La generalización de `s05-05` es
  la de la lección, pero se apoya en un único caso atribuido.
- Propuesta: `s05-01` «El tercero es Sony Pictures, que en la lección aparece también con el nombre Lazarus.» `s05-05` «O sea, que, como en este caso atribuido a un estado, hay estados que ejecutan ataques
  destructivos y de coerción. No solo espían.»

### SUGERENCIA

- **G06-S1 · `s03-03` («la primera gran atribución pública hecha por una empresa privada»)**: es literal de la lección (`s5.ts:846`, q2), pero «la primera» es discutible (informes privados anteriores señalaron vínculos estatales).
  Propuesta: «la primera en publicar tantas pruebas para señalar a una unidad concreta».
- **G06-S2 · `s03-04` («alimentó una acusación formal»)**: la acusación de EE. UU. de 2014 fue de la fiscalía; el nexo causal con el informe es la lectura de la lección. Propuesta: «y un tiempo después, EE. UU. presentó una acusación formal contra oficiales
  militares chinos». (Es un hecho; «alimentó» no está probado.)
- **G06-S3 · `s04-03`**: añadir «según el informe» antes de «horarios de trabajo coherentes con Shanghái» y completar «el teclado y el idioma configurados» («en chino simplificado» no, es de la lección; basta «configurados en el idioma de allí»
  sin nombrar). La frase queda truncada en voz.
- **G06-S4 · Negaciones**: los cuatro países citados (China, Corea del Norte, Rusia, y China otra vez en APT10) negaron las atribuciones. No hace falta decirlo en voz, pero la descripción de YouTube y el rótulo de cierre
  deberían decir «atribuciones públicas de los informes y gobiernos citados; los países mencionados las han negado». Revisión de riesgo de difamación: la voz nunca afirma que un país o unidad *hizo* algo sin sujeto atribuyente, salvo los puntos de G06-2/4/6.
- **G06-S5 · Descargo**: el storyboard ya distingue «Casos reales resumidos de la lección» de «Meridian y VELVET CICADA son ficticios» (bien). `trackNotice` del motor escribe «datos ficticios» en la transcripción: corregirlo o aclararlo en la descripción de YouTube (duda 8 del redactor).

### Las inconsistencias de lección señaladas por el redactor

1. **s4m5 vs s5m4 (sponsor-level)** — es una tensión real: s4m5 dice que el sponsor «rara vez basta» con telemetría y requiere HUMINT/SIGINT/financiación (`s4.ts:984,993`); s5m4 enseña APT1 como
   «sponsor-level pública» obtenida por un privado (`s5.ts:860,883`). El vídeo la puentea bien con «casi nadie llega» y «depende de las fuentes», pero no explica *por qué* APT1 pudo. Ver G06-2 para la frase que falta.
   Recomendación sobre la lección (fuera de alcance): en s5m4, «sponsor-level» → «llegó a una unidad concreta y a vincularla con un estado, con visibilidad de muchas víctimas».
2. **«acceso vía proveedores» (`s5.ts:939`) vs canon §5 punto 4** — el vídeo hace bien en no repetir la fórmula; la lección s5m4 debería cambiarse como lo hizo V23 en s4m5 (`s4.ts:1008`). Nota para el cierre del vídeo.
3. **«docenas» vs «cientos»** de víctimas de Cloud Hopper (`s5.ts:875` vs notas del redactor): el vídeo usa «docenas» y «toda su cartera», nunca «cientos». Correcto.
4. **Nota (menor)**: las notas del redactor dicen que el MSS chino va en pantalla, pero el storyboard s09 no lo enseña (y s10 tiene «Sponsor + indictment» sin país). No es un error del vídeo; cuadrar las notas.

### Spoilers y canon (punto 6)

- Sin dosier de LAST WORD, sin epílogo del Lab 5B, sin hechos de §2: OK. La voz no nombra a VELVET CICADA (solo pantalla y firma de mensajes): OK con el canon (`velvet-cicada.md:175`).
- Los tres mensajes de VELVET CICADA («El pasado no te sirve», «Sin pistola humeante no hay atribución», «Firma un contrato… y ya está cubierto»): sardónicos, tutean, «analista», sin confesar ni hecho nuevo. OK.
- «El cuaderno del caso»: imagen nueva, no choca con nada ocupado. «Ya lo viste en atribución» (`s06-02`) remite a V23 con exactitud (HUMINT/SIGINT, `narration.json:101`).

### Lo que está bien (G06)

- Las fórmulas de atribución están casi siempre bien encadenadas: APT1 «el informe atribuía»; Sony «el gobierno de EE. UU. lo atribuyó públicamente a Corea del Norte»; «en el curso se lee como…» (represalia por una película); DNC «vinculado a Rusia» y «informes públicos posteriores los asociaron… el GRU y el SVR»; no hay nombres de personas.
- APT1 / Sony / DNC / Cloud Hopper: hechos centrales verdaderos y presentes en la lección (`s5.ts:841-875`); se omiten a propósito fechas y nombres (Mandiant, 61398, APT28/29, MSS, Turla en voz).
- Sin país en el MSP de Cloud Hopper y sin nombrar a WikiLeaks ni a las personas ficticias del DNC (Guccifer, DCLeaks): evita difamación.
- DNC: separar los dos conjuntos aunque coincida la víctima (q1/q10, `s5.ts:892-902`, `:1075-1089`) y «enlace débil» (`s07-06`) exactos y coherentes con V14.
- Las 7 tarjetas coinciden con la nota de examen de la lección (`s5.ts:908`) y todas son *Dissemination*.

---

## G07 · `examen-indice` (s6m1 + s6m2, VELVET CICADA)

### A CORREGIR

**G07-1 · `s02-01` + chip de pantalla «unas 75 preguntas»** — «Según el temario de la app, son unas 75 preguntas, con vigilancia y con material impreso permitido.»
- Problema: el hedge está bien («según el temario de la app… confírmalos tú»), pero la cifra es **errónea frente a la fuente oficial**. giac.org (página del GCTI, consultada hoy) indica **82 preguntas, 3 horas, 71 % de corte**, que
  «todos los exámenes GIAC son web-based y proctored» y que el formato aplicable se confirma en la cuenta GIAC. La lección dice «unas 75 preguntas… en 2 horas» (`s6.ts:19`). El vídeo hace bien en no dar tiempo ni aprobado.
  Una cifra de preguntas que ya no coincide con la web oficial es lo único que el espectador comprobará.
- Propuesta (recomendada): no dar número en voz ni en pantalla. Voz: «Según el temario de la app, es un examen tipo test, con vigilancia y con material impreso permitido.» Chip: «examen tipo test · con
  vigilancia (proctored) · material impreso permitido · sin dispositivos electrónicos». Corregir `s6.ts:19` en una tarea aparte (82 preguntas / 3 h según giac.org; la regla de «~96 segundos» de `s6.ts:31,131` deja de valer).
- Duda 6 del redactor (¿volver a dar 2 horas y 71 %?): **no**. Los datos oficiales actuales las contradicen en parte (horas) y confirman el 71 %; dejarlos fuera es lo correcto.

**G07-2 · `s03-01`** — «Mañana, cada pregunta tendrá la misma forma. Primero un escenario… Después la pregunta… Al final, cuatro opciones.»
- Problema: el redactor ya lo marca como riesgo de naturalidad (nota (e)-9); es además un problema de exactitud. La lección dice que las preguntas «tipo GIAC tienen una estructura estable»
  (`s6.ts:36`), pero GIAC no garantiza ese formato (hay preguntas sin escenario, de varias respuestas o de otro tipo). «cada pregunta tendrá» promete lo que no puede prometerse del examen real.
- Propuesta: «Las preguntas de este tipo suelen seguir una forma parecida, según el temario de la app. Primero un escenario, que es el contexto. Después la pregunta de verdad, en una frase. Y al final, cuatro opciones.»
  `s03-05` «casi siempre hay dos defendibles» → «suele haber dos defendibles».

**G07-3 · `s07-03` + pantalla `page`** — «El orden alfabético es estricto y **cada nota cabe en una línea**.»
- Problema: la página de la lección que se enseña (`s6.ts:193-210`) tiene notas de **dos y tres líneas** («ACH: diagnosticity…», «Attribution levels – machine / operator / sponsor – new evidence TYPE per step up»), y la
  lección misma manda indexar «los niveles de atribución y qué tipo de evidencia desbloquea cada uno» entre los imprescindibles (`:255`). Además el storyboard (`oneline`) enseña «una entrada de tres líneas con
  una lupa y “¿juicio?”»: si es la de «Attribution levels», el vídeo etiqueta de «posible juicio» una entrada que la lección da por buena.
- Propuesta: voz `s07-03`: «Mira una página terminada. El orden alfabético es estricto y las notas son cortas.» Para `oneline`, usar una entrada inventada de tres líneas («razones por las que deberías sospechar de esta atribución…»)
  y no una de la página de la lección. `s07-05`: «seguramente» → «probablemente» (lección, `s6.ts:214`: «probablemente estás indexando un juicio»).

**G07-4 · tarjeta de `s08-08` (TLP, dominio «Collection») — punto abierto del redactor** → **RECOMENDACIÓN: mantener Collection, quitar la contradicción en la lección**
- Evidencia: la definición de las marcas TLP (incluida AMBER+STRICT) es de s3m4 y su banco de preguntas está etiquetado `domain: 'Collection'` (`s3.ts:878-879`, s3m4q1); s5m3 enseña «TLP aplicado» con
  `Dissemination` (`s5.ts:634`). La tabla de s6m1 (`s6.ts:121`) mete «TLP» en Dissemination. El hecho de la tarjeta («AMBER+STRICT = solo tu organización, sin clientes») es el de s3m4 y la pantalla ya lo rotula «S3M4».
- Por qué Collection: la tarjeta debe coincidir con la etiqueta del banco en el que el alumno practica ese hecho. La tarjeta también es cierta en Dissemination, pero sería la única de la tanda con un dominio distinto al de su lección de origen.
- Acción para la lección (fuera de alcance): `s6.ts:121` → «Dissemination (estimativo, TLP aplicado, casos)» y «Collection sources (OSINT, marcas TLP)». El vídeo no dice el dominio en voz.

### SUGERENCIA

- **G07-S1 · `s02-06`** «el examen está pensado para que no te dé tiempo a buscarlo todo»: afirmación de diseño del examen que viene de la lección (`s6.ts:25`). Añadir «según el temario de la app» o «la idea es que no te dé tiempo» (el redactor ya lo prevé).
- **G07-S2 · `s04-05`** «La usan cientos de grupos»: la lección dice «hundreds» (`s6.ts:111`), pero V14 dice «miles de actores» para PowerShell/Cobalt Strike (canon `:695`). Propuesta: «La usan muchísimos grupos sin relación.»
- **G07-S3 · `s10-04` y contador `train`** «los cientos de preguntas que ya has peleado»: asume lo que el alumno ha hecho. La lección dice «habrás batallado» (`s6.ts:300`). Propuesta: «de las preguntas que ya habrás peleado».
- **G07-S5 · dominio de la tarjeta de `s04-05` («EXCEPT: tres verdaderas y una falsa…», dominio «Intrusion Analysis»)**: defendible. El ejemplo (qué vínculo *no* es fuerte para agrupar) se enseña
  en s2m4 (`s2.ts:848`, check `:985`; dominio *Intrusion Analysis*) y se retoma en s4m4 (clustering, dominio *Analysis*, y `s6.ts:120` lo lista en Analysis). Ambos valen; elegir uno y mantener el criterio de la tarjeta
  de `s05-02` (que usa agrupar vs atribuir, de s6m1, y va como *Analysis*). Si se quiere coherencia total, mover `s04-05` a *Analysis*; si no, dejarlo.
- **G07-S4 · mensajes de VELVET CICADA**: los cuatro son atajos de examen sin hecho de campaña (OK, y no confiesan). Reservan un efecto meta (el adversario hablando de un examen real). Ver «Colisiones» para el patrón «la primera».

### Cotejo de datos del examen (punto 5 del encargo)

| Afirmación del guion | Dónde | Hedge | Verdad externa |
|---|---|---|---|
| «unas 75 preguntas» | `s02-01`, chip | «según el temario de la app», «confírmalos tú en la web de GIAC» | **Falso hoy (82)**. Quitar la cifra (G07-1) |
| «con vigilancia» (proctored) | `s02-01` | ídem | Cierto (giac.org: web-based y proctored) |
| «material impreso permitido» / open-book | `s02-01`, `s02-04` | ídem | Práctica estándar de GIAC; la ficha del GCTI en giac.org no lo detalla, así que el hedge «según el temario de la app» debe quedarse |
| «sin dispositivos electrónicos» | solo pantalla | ficha hedgeada | Coherente con la lección (`s6.ts:25`) |
| aprobado, tiempo, segundos por pregunta | no se dicen | — | Correcto no decirlos (la lección da 71 % y 2 h; giac.org: 71 % y 3 h) |
| Descargo de no afiliación | `s02-03`, `s11-04`, sellos | presente | OK |

### Método de la pregunta e índice (punto 1)

Fiel a `s6.ts:36-70` y `:171-229`: escenario una vez y rápido, pregunta dos veces, calificador, descartar dos, decidir entre dos, micronota que responde sin abrir, construir mientras estudias (tres pasadas),
imprimir y encuadernar, el índice rescata hechos y los juicios salen del entrenamiento. Tarjetas «ACH: gana la menos inconsistente», «ICD 203: very likely = 80 a 95 %», «FIRST/NEXT: manda el orden del proceso, no lo válido» y
«TLP:AMBER+STRICT: solo tu organización, sin clientes» son correctas. «ICD 203: very likely = 80–95 %» está verificado contra la directiva.

### Lo que está bien (G07)

- Todo el bloque de formato va hedgeado y reenvía a giac.org; no se afirma como oficial ningún dato (salvo la cifra de preguntas, G07-1).
- Las tres reglas del cierre, la analogía de la cuerda y el mapa/barrio no falsean el concepto.
- Sin Meridian, sin hechos de campaña, sin spoilers. Los mensajes de VELVET CICADA no repiten ninguna frase de §3.
- La pregunta-esqueleto con barras grises evita reproducir la pregunta de la lección (que usa el PDB compartido, hermana de BROKEN CHAIN).

---

## Colisiones de analogías y de mensajes entre los cuatro vídeos

1. **G04 báscula/pesas ↔ G06 balanza («peso de evidencia»)**: mismo objeto, funciones distintas (calibrar el instrumento vs pesar pruebas), en la misma sección y en vídeos consecutivos.
   Propuesta: G06 cambia la balanza por «pesar» sin objeto (`s04-05`, «Una pista suelta pesa poco; cuando muchas pruebas independientes coinciden, el conjunto pesa»), y quita la balanza de `a1-weight`, `converge` y `rule-2`.
   Mantener la pesa en G04, que es la imagen central de esa cápsula.
2. **G06 «casos espejo» ↔ G04 «mirror imaging»** (sesgo: asumir que el adversario piensa como tú). «Cinco espejos» como recurso pedagógico puede leerse como el sesgo. Propuesta: en G06, «cinco casos, y en cada uno
   un reflejo de tu trabajo» (o «cinco ecos»); o dejar el título interno y solo cambiar el uso de «espejo» como metáfora de comparación.
3. **G06 «dos coches en el mismo garaje» ↔ imagen del «taller» de V13–V15** (ruta del PDB = «etiqueta del taller», canon `:650-653`, `:690-693`). Tema cercano (taller/garaje). Propuesta: «Dos clientes en la misma cola de la ventanilla no se conocen
   por eso» (o similar), sin garaje.
4. **G06 «llaves de muchos portales» ↔ G05 «portales de proveedores»**. «Portal» (entrada de un edificio) suena a «portal de proveedores». Propuesta: «llaves de muchos edificios».
5. **Atajos «la primera…»** ×3: V23 «la primera pista», G04 «la primera hipótesis», G07 «la primera». Cambiar G04 (G04-2).
6. **G05 «temporal/pronóstico» y G07 «cuerda/mapa»**: sin colisión. **G05 s09 «satélite/ventana»** y G04 «báscula»: sin colisión.

---

## Lo que está bien en conjunto

- Ninguna pista falsa, cirílico, horario falso ni ficha de «siembra pistas falsas» en G04; PAPER CRANE queda como voz de atajos, igual que en V9/V23.
- Cero spoilers de LAST WORD y del epílogo del Lab 5B en los cuatro; el «BLUF de manual» y el «3 dominios» se han dejado fuera a propósito.
- Todo dato de campaña de G05 (fechas, horas, cifras, nombres de documento y acciones) coincide con `s5.ts:47-68` y con el canon §2/§3.
- Descargo de no afiliación presente en los cuatro; G06 distingue casos reales de elementos ficticios.
- Bandas ICD 203, definiciones de los cuatro sesgos y método de la pregunta están conformes con las lecciones y, donde existe, con la fuente externa.
