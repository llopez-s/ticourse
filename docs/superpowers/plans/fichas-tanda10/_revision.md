# Revisión cruzada de la tanda 10 (V49–V52, dominio 1 y cierre)

> Revisión de solo lectura del 2026-10-20, sobre el worktree `video-fichas-tanda10` (rama cortada en `71872fc`, 2026-10-17), antes de que
> Lidia apruebe las fichas. Se han leído enteras las cuatro fichas; el diseño (entero; §3, §4.2, §4.3, §4.4, §6 y §9 con lupa, §9.5
> sobre sp6m1); el plan de vídeos (§1, «Narración hablada» y «Claridad y ritmo»; `plan:3823`, `:6320-6322`, `:6488-6489`, `:6516-6517`,
> `:6534-6535`); las lecciones sp1m2 (`sp/sp1-part1.ts:278-543`), sp1m4 (`sp/sp1-part2.ts:283-558`), sp1m5 (`sp/sp1-part3.ts`, entera) y
> sp6m1 (`sp/sp6.ts`, entera) con sus checks y su quiz; `placement-sp1.ts` entera; `fcp101`–`fcp126`; spl1a, spl1b y spl1c (`sp/labs.ts`, las líneas que citan las fichas); del
> registro, §1, §2, §3 (filas citadas), §5 (contradicciones 9, 15, 17), «Lo que no salió» y §6 (imágenes ocupadas, `reg:1395-1452`); las
> narraciones publicadas de V28, V20, V29, V30 y V1 (barrido de imágenes y glosas); las fichas V33–V44 en lo que dicen de sp1 y de sus
> imágenes; y el motor (`profiles.mjs:60-107`, `:117-124`; `narration.mjs:13`, `:22-28`, `:342-380`; README «Pregunta de examen»).
> Rutas: `sp/` = `src/data/secplus/`, `reg` = `docs/superpowers/canon/glass-harbor.md`, `fichas/` = `docs/superpowers/plans/fichas-tanda10/`,
> `rev9` = `.claude/worktrees/video-fichas-tanda9/docs/superpowers/plans/fichas-tanda9/_revision.md`.
>
> **Un dato previo:** son **14 preguntas** (3 + 3 + 3 + 5). Las citas de lección de esta revisión son del archivo de hoy, sin los vídeos de
> V49–V52, como las de las fichas. **Base:** `origin/main` va por delante de este worktree (PR #67–#71: V32 en su lección, el currículo
> práctico, el registro retocado). `sp/sp1-part*.ts` y `sp/sp6.ts` no han cambiado en `main`, así que las citas de esas lecciones valen; lo que
> sí cambia es el recuento de piezas del banco (V52 dice 649; en `main` hay más tarjetas y dos checks opcionales) y el registro. Conviene
> rehacer el barrido de «LEAST» (F-4) después de fusionar.
>
> Cada hallazgo: `fichero:línea` · regla que rompe · gravedad · arreglo.

## Resumen

- **Alta (0).** Ninguna pregunta tiene dos respuestas defendibles según SY0-701 y la lección, ninguna copia ni parafrasea al banco y
  ninguna contradice el canon. Las dudas que traen los autores se sostienen una a una (§A, «Las dudas de los autores»).
- **Media (8):** V52 tiene la pareja {B, C} de clave y trampa en 4 de sus 5 preguntas (A-8); la clave de V51 P3 se lee del escenario y
  su trampa muere sola (A-6); V50 enseña «el access badge limita por puerta» sin que la lección lo diga, y la corrección es solo
  «condicional» (B-1); V52 enseña lo que significa cada calificador sin que la lección lo diga (B-2); el sujeto «despacho» se repite en
  tres escenas y dos títulos de escena (C-1); V51 usa candados abiertos para decir «requisito cumplido», justo la imagen ocupada que V50
  reserva (D-1); los cierres de V49, V50 y V51 llevan unas 100 palabras en 20 s (F-1); V51 no trae el texto de sus tres resoluciones y
  da sus recuentos por buenos (F-2).
- **Baja:** la pregunta 5 de V52 no se apoya en el ejemplo de s10 y repite la lección de la 1 (G-1); la pregunta 1 de V49 dice «afectada» (A-1); escenarios que deletrean la clave en V50 (A-2 a A-4); V51 P2 casi calcada de
  `:96` (A-5); V52 P2 nombra el hueco (A-7); costuras de letras con V28 y V44 (A-9); claves a menudo las más cortas (A-10);
  glosas y frases de cierre que se parecen entre V49–V52 (C-2, C-3); roces de sujetos y de imágenes (C-4 a C-8, D-2 a D-5); citas (E-1),
  canon menor (E-2 a E-4) y recuentos (F-3).
- **Correcciones de lección propuestas:** todas válidas. Condiciones del PR en sentido estricto: V51 `sp1-part3.ts:47`; V52 `sp6.ts:45` y la
  línea nueva de tachar; y, por coherencia con su propia regla, V50 `sp1-part2.ts:310` (B-1) y la ampliación de `sp6.ts:45` (B-2). V49 no
  necesita ninguna.
- **F (recuentos):** limpio salvo cinco detalles (F-3) y los dos hallazgos de F-1 y F-2. Los 112 textos de pantalla de las preguntas
  (escenario, `q`, cuatro opciones, `why` y `trapWhy` de las 14 preguntas), las 20 tarjetas, los 14 recuentos de voz de escenario y pregunta, los
  `wordBudget`, las duraciones y los títulos se recalcularon con Node y coinciden, salvo lo anotado.

---

## A. Exactitud (14 preguntas)

Contra la lista oficial de objetivos SY0-701 (1.2: CIA, non-repudiation, AAA —authenticating people, authenticating systems,
authorization models—, gap analysis, physical security con sus doce elementos y deception and disruption technology; 1.3: approval
process, ownership, stakeholders, impact analysis, test results, backout plan, maintenance window, SOP; allow/deny lists, restricted
activities, downtime, service y application restart, legacy applications, dependencies; updating diagrams y policies/procedures; version
control; y 4.6, 5.2, 2.2, 3.2 y 1.4 para las cinco de V52) y después contra la lección.

| Vídeo | P | Clave / trampa | Veredicto |
|---|---|---|---|
| V49 | 1 | Integrity / Availability | Una sola. El «afectada» abre una lectura (A-1) |
| V49 | 2 | Attribute-based / Role-based | Una sola. Bien |
| V49 | 3 | Gap analysis / Risk assessment | Una sola. Bien |
| V50 | 1 | Access badge / Video surveillance | Una sola; el escenario deletrea las dos funciones (A-2); depende de B-1 |
| V50 | 2 | Ultrasonic / Microwave | Una sola. «Gente trabajando» suena a ruido (A-3) |
| V50 | 3 | Honeyfile / Honeypot | Una sola; «carpetas compartidas» ya dice «fichero» (A-4) |
| V51 | 1 | Backout plan / Seguir ajustando | Una sola. Bien |
| V51 | 2 | Añadir solo el destino / Permitir la red entera | Una sola; la clave es `:96` casi literal (A-5) |
| V51 | 3 | Procedimientos / Diagrama | Una sola, pero la clave se lee del escenario (A-6) |
| V52 | 1 | SSO / Gestor de contraseñas | Una sola. Bien |
| V52 | 2 | Inventario / Amenazas | Una sola «según el curso»; el escenario nombra el hueco (A-7) |
| V52 | 3 | Phishing / Zero-day | Una sola. Bien |
| V52 | 4 | Cortafuegos solo hacia internet / VLAN | Una sola. Bien |
| V52 | 5 | CA pública / Instalarlo en los equipos | Una sola; no prueba «lo estándar» (G-1) |

**Banco.** Se contrastó cada pregunta con las siete del quiz de cada lección, los checks (`sp/sp1-part1.ts:327-445`,
`sp/sp1-part2.ts:321-439`, `sp/sp1-part3.ts:51-177`, `sp/sp6.ts:50-78`), `pl-sp1q1`–`pl-sp1q12`, `fcp101`–`fcp126` con su glosario, spl1a/b/c
y los ítems de otros dominios que roza cada una. No hay copias ni paráfrasis. Son espejos aceptables (otra clave o la trampa invertida):
V49 P1 frente a `pl-sp1q3` (`sp/placement-sp1.ts:45-54`, que también cierra las otras dos propiedades con «nada se altera, sigue
disponible») y frente a q1; V50 P2 frente a q3 y al check `:373-387`; V50 P3 frente a q6 (`:527-541`); V51 P1 frente a q1 y `pl-sp1q6`;
V51 P3 frente al espejo de q7; V52 P3 frente a sp3m2q2; V52 P4 frente a sp3m2q3 y al check de sp2m8 (segmentación de clave, aquí de
trampa); V52 P5 frente a sp1m7q5 y al check `sp/sp1-part4.ts:349-363`. Ninguna es una flashcard con opciones. Para V52, que cruza cinco dominios, no me fié de la lista de «ítem más cercano» de la ficha y rehice el
barrido sobre todo el banco: el SSO solo sale como distractor muerto en sp4m8q7 (`sp/sp4-part4.ts:579`); no hay ninguna pregunta de phishing
con «más probable» de clave; los diez ítems con FIRST son los que lista la ficha (13 líneas en el grep, tres son objetivos o callouts) y
ninguno trata de inventario; BEST sale en 108 ítems, como dice; los self-signed y la CA pública solo están en sp1m7 y en el check
`sp/sp1-part4.ts:349-363`; y el movimiento lateral solo en el check de sp2m8 y en sp3m2q3, que ya cita (el gusano de sp2m6 es otra
pregunta: virus frente a worm). Ninguna omisión de la ficha. «MEJOR / PRIMERO /
MÁS probable / MENOS» están bien usados: «MEJOR» solo donde hay varias que ayudan (V49 P2/P3, V50 P2/P3, V51 P1/P2, V52 P1/P5);
V49 P1, V50 P1 y V51 P3 van sin calificador y es correcto porque el enunciado pide «qué se ha roto», «qué resuelve» y «qué explica».

**A-1.** `fichas/V49-sp1m2.md:119-123`, `:131`, duda 1 `:364-366` · regla 4 (una sola respuesta) · baja. El escenario dice «se avería un disco» y
«cambian algunos kilos» como dos hechos sueltos, y la pregunta es «¿qué propiedad se ha visto *afectada*?», en singular y sin
«más directamente». La lección pone el fallo de hardware entre las amenazas de availability (`sp/sp1-part1.ts:316`) y la corrupción entre
las de integrity (`:310`); un alumno puede defender «el disco falló, luego availability» y solo «sigue en marcha» se lo cierra. Se
sostiene (es el mismo recurso de `pl-sp1q3`), pero conviene que la causa y el efecto sean una sola cosa y que la pregunta apunte a los
datos. **Arreglo:** `scenario` «En una cooperativa, un fallo de disco cambia sin que nadie lo note algunos kilos de los socios. El sistema
sigue en marcha y nadie de fuera ha entrado.» (151) · `q` «¿Qué propiedad de esos datos se ha roto?» (40) · `trapWhy` «Un fallo de disco
suena a availability, pero el sistema sigue en marcha» (71). Voz: «Primera pregunta. En una cooperativa, un fallo de disco cambia, sin que
nadie lo note, algunos kilos de los socios. El sistema sigue en marcha, y nadie de fuera ha entrado. ¿Qué propiedad de esos datos se ha
roto?» (39 palabras, tres menos). Va con D-3.

**A-2.** `fichas/V50-sp1m4.md:143`, `:160-161` · regla 4 (la trampa tienta de verdad) · baja. «Quieren que cada uno abra solo las suyas, con
registro automático» entrega, palabra por palabra, las dos funciones que la ficha da al badge (`:113`, `:149-153`); la cámara solo tienta
hasta el final de la primera frase. Es la pregunta más fácil de las tres de V50 y el autor lo sabe (duda 1). **Arreglo:** dejarlo, porque
con solo «quién entra» la cámara sería defendible; si se quiere más tentación, quitar «automático» (queda «con registro») y que el guardia
sea la otra mitad defendible, cerrada por «sin que dependa de nadie». No cambia la clave.

**A-3.** `fichas/V50-sp1m4.md:181`, `:185`, `:198-202` · regla 4 (una sola respuesta, sin segunda lectura) · baja. La ficha escoge «otro despacho
con gente trabajando» para no tocar el ruido del ultrasonic (`sp/sp1-part2.ts:363`: «corrientes de aire y ruido»), pero «gente trabajando» es
justo ruido; quien estudia la columna de limitaciones puede dudar entre ultrasonic y microwave. No hay otra respuesta (infrared cae por el
sol y pressure no detecta movimiento), así que la clave se sostiene; se trata de que la limitación del microwave sea la única que el
caso toca. **Arreglo:** `scenario` «Un despacho pequeño y cerrado recibe sol directo por la ventana, y su pared fina da a otro con gente
yendo y viniendo. Quieren detectar movimiento dentro.» (154). `trapWhy` y `why` sin cambios (el «despacho vecino» sigue valiendo).

**A-4.** `fichas/V50-sp1m4.md:220`, `:226-232`, `:240-246` · regla 4 · baja. «Carpetas compartidas» y «cebos por donde pase» ya dicen
«fichero»; la trampa (honeypot) tienta solo por ser «el nombre de todos los cebos». Es `sp/sp1-part2.ts:410` hecho escenario, y la
explicación de q6 (`:540`, «insiders y malware que recorre carpetas») también. No es copia de q6 (otra pareja, otro disparador), pero
quien haya hecho q6 la responde de memoria. Aceptable en un vídeo de repaso; **arreglo opcional:** que el escenario no diga «carpetas» sino
«un servidor de ficheros»: «…cifrar los ficheros de su servidor. Va a dejar cebos donde ese ransomware tenga que pasar.» (el honeypot
tienta más, porque un servidor también es un sistema).

**A-5.** `fichas/V51-sp1m5.md:156`, `:158`, `:162-163` · regla 5 (espíritu) · baja. La clave («Añadir solo el destino que se necesita») es
la celda de `sp/sp1-part3.ts:96` («y solo lo que el cambio necesita») con otras palabras. La lección no es banco (§9.4), y el escenario
añade un caso y una trampa que nadie más usa; se acepta. Lo que sí conviene es que la clave no repita el «solo» de la tarjeta de s05
(«Allow list: solo lo que el cambio necesita»), porque entonces el alumno ve primero la respuesta: tarjeta «Allow list: lo justo para el
cambio» (35).

**A-6.** `fichas/V51-sp1m5.md:187-191`, `:202-203`, duda 3 `:420-422` · regla 4 (la trampa tienta de verdad; `rev9` A-1) · **media**. El escenario
dice «el personal sigue los pasos antiguos» y la clave es «Los procedimientos»; la lección define el SOP como «instrucciones paso a paso»
(`sp/sp1-part3.ts:34`). Se responde leyendo, y la trampa (el diagrama) la mata el propio `trapWhy`: «no explica que se sigan los pasos
viejos». «En un servidor nuevo» tienta un instante, pero el síntoma lo desmiente en la frase siguiente. **Arreglo:** que el síntoma no
nombre los pasos y sí el efecto de no tenerlos escritos. `scenario` «Una floristería cambió de programa de encargos, en un servidor nuevo.
Todo funciona, pero cada empleada cursa los urgentes a su manera y algunos no salen.» (154) · `why` «Cambió cómo se cursa un encargo, y nadie
lo dejó escrito para todas» (67) · `trapWhy` «El diagrama también debe estar al día, pero no explica que cada una lo haga a su manera» (87). Voz:
«La última. Una floristería cambió de programa de encargos, en un servidor nuevo. Todo funciona, pero cada empleada cursa los urgentes a
su manera y algunos no salen. ¿Qué actualización pendiente explica el problema?» (34 palabras). Sigue siendo una sola (el diagrama no
explica la discrepancia entre personas) y la clave enlaza con «el SOP hace que el cambio lo haga igual quien lo haga» (`:34`).

**A-7.** `fichas/V52-sp6m1.md:196`, `:214-220` · regla 4 · baja. «Aún no tiene lista de sus sistemas, datos ni procesos» es la definición de
«activos» (`sp/sp5-part2.ts:27`) con otras palabras; el autor ya lo avisa. El reflejo de «empiezo por lo que más asusta» no se activa
porque el enunciado nombra lo que falta. Además, sin «según el curso», hay métodos que arrancan por el contexto o por las amenazas.
**Arreglo:** mantener el escenario y cerrar el marco en la pregunta: `q` «¿Qué paso va PRIMERO al identificar los riesgos?» (48). Voz:
«…¿Qué paso va primero al identificar los riesgos?». Es la salida que propone la ficha, sin el «según el curso», que suena a examen
escolar.

**A-8.** `fichas/V52-sp6m1.md:156-160`, `:196-198`, `:278-280`, `:312-316`, letras `:504-507`, `:581-588` · regla 4 (claves y trampas repartidas) ·
**media**. En cuatro de las cinco preguntas de V52 la clave y la trampa son la pareja {B, C}: C/B, B/C, —, C/B, B/C (solo la P3 es D/A).
Quien capte el patrón aprende «B o C» y acierta en 4 de 5; y las claves de P3–P5 (D, C, B) y las trampas (A, B, C) forman una escalera. El
reparto global (A 3 · B 4 · C 4 · D 3, claves y trampas) está equilibrado, pero el equilibrio está hecho con esa alternancia. **Arreglo**, sin
tocar ningún texto, solo el orden de las opciones (claves D B A D C, trampas A C B C A): P1 **A)** Un gestor de contraseñas por persona
(trampa) · B) MFA en las doce aplicaciones · C) Contraseñas más largas y distintas · **D)** Un inicio de sesión único (*SSO*) (clave). P2 sin
cambios (clave B, trampa C). P3 **A)** Un correo de *phishing* al personal (clave) · **B)** Un *zero-day* en su cortafuegos (trampa) · C) Un
empleado descontento · D) Un ataque a su proveedor de software. P4 A) Un cortafuegos en cada equipo · B) Aislar el equipo infectado de la red
· **C)** Dividir la red interna en *VLAN* (trampa) · **D)** Un cortafuegos solo hacia internet (clave). P5 **A)** Instalar el certificado en
los equipos de la clínica (trampa) · B) Pedir a los pacientes que acepten el aviso · **C)** Un certificado de una *CA* pública (clave) · D)
Renovar el certificado propio cada año. Resultado de la tanda (14): claves **A 4 · B 3 · C 3 · D 4**; trampas **A 4 · B 3 · C 4 · D 3**; las
cinco parejas de V52 son distintas ({A,D}, {B,C}, {A,B}, {C,D}, {A,C}), ninguna letra se repite seguida en claves ni en trampas, y la
costura con V51 (clave B, trampa D) y con V44 (clave A, trampa B) queda sin repeticiones (V52 abre con clave D y trampa A). Ninguna clave
es la opción más larga (P1 31 frente a 36; P4 34 frente a 36). Cada ficha de V52 debe corregir «Letras» (`:504-507`, `:581-588`).

**A-9.** Costuras en el curso (`fichas/V49-sp1m2.md:385-388`, `V52-sp6m1.md:581-584`) · regla 4 (`rev9` C-2) · baja. Las fichas solo miran
dentro de la tanda. En el orden del curso, V28 P3 (clave B, trampa D, `video/controles-halden/narration.json`, tercera pregunta) va seguida
de V49 P1 (clave B, trampa D): la misma pareja dos veces seguidas. Y V44 P3 (clave A, trampa B) precede a V52 P1, que con el reparto de la
ficha tiene la trampa B. La de V52 se arregla con A-8. La de V49 no se arregla sin rehacer el reparto (la clave tendría que salir de B);
se acepta, y se anota en la ficha como costura conocida.

**A-10.** Todas las fichas · observación · baja. Ninguna clave es la opción más larga en solitario (V49 P2 empata con la B en 15), pero **6
de 14** claves son la más corta (V49 P1 y P3, V51 P1 y P3, V52 P2 y P5), y en V52 P5 la trampa (52 caracteres) es con diferencia la más
larga. Un alumno que elimine «la larga» acierta de más. No hay que tocar nada si se aplica A-6 y A-8; basta con que, al escribir el
guion, nadie «adorne» la trampa de V52 P5 (por ejemplo, «Instalar el certificado de la clínica en sus equipos», 42).

### Las dudas de los autores, puestas a prueba

- **V49 duda 1** (avería que cambia datos = integrity): se sostiene con el matiz de A-1.
- **V49 duda 2** (attribute-based frente a un rol por cliente): se sostiene. Un rol por cliente no es un modelo de roles, es un atributo
  con otro nombre; y el escenario junta tres cosas. No hace falta el fallback del «expediente abierto o archivado».
- **V49 duda 3** (gap analysis frente a self-assessment): se sostiene, porque la self-assessment no es opción y el risk assessment mide
  amenazas, no requisitos.
- **V49 duda 4** (non-repudiation y registros): se sostiene lo que dice el autor. Ni la lista oficial ni la pregunta dependen de
  `sp/sp1-part1.ts:340` ni de `fcp105`; no es condición. El texto propuesto para `:340` es correcto si se quiere aplicar.
- **V49 duda 5**: bien resuelta.
- **V50 duda 1** (badge frente a guardia y cámara): se sostiene si la lección dice que el badge limita por puerta; ver B-1. La
  alternativa de sustituir el guardia por *Lighting* empeora la pregunta (un distractor menos real); no hacerla.
- **V50 duda 2** (sensor por limitación): se sostiene con A-3.
- **V50 duda 3** (ransomware y honeyfile): se sostiene. La alternativa que propone el autor (insider, registros del badge) toca q6 por
  el insider y sería peor.
- **V50 dudas 4 a 8**: ninguna pregunta ni escena depende de ellas. La ficha deja fuera tailgating y piggybacking, que la ficha de V34
  (`fichas-tanda7/V34-sp2m3.md:375`) dejó a sp1m4; con razón, porque no están en la lista oficial. El curso se queda sin vídeo para esa
  confusión (sí tiene callout, check y q2).
- **V51 duda 1** (backout frente a retocar): se sostiene con «ventana aprobada» (`:43`: nada llega al comité sin plan) y con «MEJOR».
- **V51 duda 2** (alcance de la allow list): se sostiene; el escenario dice «el del proveedor nuevo» (un destino) y la trampa «la red
  entera». No hace falta el fallback de «direcciones sueltas».
- **V51 duda 3** (procedimiento frente a diagrama): se sostiene, pero ver A-6, que es otra cosa.
- **V52 dudas 1, 3, 4, 5, 6, 7, 8, 9 y 10**: se sostienen. La 4 es la más delicada (aislar es contención, no «cortafuegos»); «de la
  red» en la opción lo cierra. La 6 es correcta: (750 − 100) / (900 − 100) = 81,25 %.
- **V52 duda 2** (orden de la identificación de riesgos): se sostiene con A-7.

---

## B. Roces con la lección

Las citas de lección, quiz, checks, colocación, flashcards y labs de las fichas (unas 150) se comprobaron una a una, y las de `reg`, `plan`,
motor y tests por muestreo amplio; están bien salvo las de E-1. Las inserciones están bien situadas: V49 tras el
último check (`sp/sp1-part1.ts:431-445`) y antes del párrafo `:446-449`; V50 tras el callout `:440-445`; V51 tras el check `:163-177`; V52 tras
el segundo check `:65-78`. Las cuatro suman 11 líneas.

**B-1.** `fichas/V50-sp1m4.md:113`, `:122`, `:263`, correcciones `:426-433`, duda 1 `:449-457` · diseño §9.3 y regla de la ficha («todo lo que
enseña el vídeo va antes en la lección») · **media**. La tarjeta de s03 («Access badge: quién, adónde y con registro») y el rótulo de s02
(«cada persona, sus zonas») enseñan que el badge limita por puerta qué zonas abre cada persona; `sp/sp1-part2.ts:310` solo dice «identifica a
la persona y registra sus accesos», y la pregunta 1 depende de la otra mitad. La ficha lo deja como corrección «condicional, si el revisor
lo pide». Se pide: es condición del PR. **Arreglo**, `sp/sp1-part2.ts:310`: «**Access badge** — tarjeta o credencial (RFID, NFC, smart
card) que identifica a la persona, limita por puerta qué zonas abre cada una y registra sus accesos. Es lo que el vestibule verifica; sin
badge, la puerta no distingue empleadas de visitantes.» Y avisarlo en la descripción del PR.

**B-2.** `fichas/V52-sp6m1.md:119-120`, `:512-524` · diseño §9.3 y misma regla · **media**. Los conceptos 3 y 4 (la mitad del vídeo) enseñan qué
cambia cada calificador: BEST = la que resuelve todo el caso, FIRST = manda el orden, MOST likely = lo habitual, LEAST = la pregunta va al
revés. `sp/sp6.ts:45` solo los enumera. La ficha pide dos condiciones (la frase de «dos opciones serán defendibles» y la técnica de tachar)
y deja fuera lo más importante. **Arreglo**, una sola línea en `sp/sp6.ts:45` que sustituye a la corrección 1: «**Lee el qualifier**: BEST
(la que resuelve todo el caso, no un trozo), FIRST (varias llegarán a hacerse; manda el orden), MOST likely (lo habitual, no lo vistoso) y
LEAST (la pregunta va al revés: casi todas sirven y una no). Suelen tentar dos opciones; una encaja *mejor* con el objetivo oficial.» La
línea de tachar (corrección 2) se queda tal cual.

**B-3.** `fichas/V51-sp1m5.md:382-388` · correcta. `sp/sp1-part3.ts:47` (Verify) no dice qué pasa si la comprobación falla; `:43` solo habla
de «criterios claros para activarlo», y `sp/labs.ts:248` sí. La frase propuesta («Si la comprobación falla, se activa el backout plan según
los criterios acordados.») es correcta y no deja la trampa de la pregunta 1 en la lección. Es condición, bien.

**B-4.** `fichas/V52-sp6m1.md:500-503`, `:518-524` · baja. El vídeo dice «750 es una escala, no un porcentaje» (s02) y la lección acaba con «el
83 % (equivalente aproximado al 750/900)» (`sp/sp6.ts:81`). El autor lo deja como corrección recomendada y no usa el 83 % en el vídeo, así
que no se contradicen en pantalla; pero el alumno que baje a la lección lee el párrafo contrario justo debajo. Que sea condición del PR
(`sp/sp6.ts:81`: «…hasta superar de forma estable el 83 % que esta app usa como referencia (CompTIA puntúa de 100 a 900 y no publica a
cuántos aciertos equivale el 750)»). La corrección 3 (el ritmo, `:44`) puede quedarse como recomendada: «algo menos de 1 minuto» cabe en las
dos redacciones.

**B-5.** `fichas/V51-sp1m5.md:389-392` · correcta. «Sábado» por «Domingo» en `sp/sp1-part3.ts:77` resuelve la contradicción 9 (`reg:466`) sin
mover el 6-9 del registro (`reg:142`). El quiz habla de «Saturday's maintenance window» (`:188`) en un caso genérico; no choca. Tras
cambiarla, cerrar la contradicción 9 en el registro.

---

## C. Coherencia entre las cuatro y con el resto del curso

Orden del curso comprobado: V28 → V49 → V20 → V50 → V51 → … → V44 → V52. V49 y V50 se declaran segundo y cuarto vídeo de Halden; ninguna da
por sabido nada que presente otra; ninguna remite a un vídeo, al caso de septiembre ni a una fecha. Sin adversario en las cuatro, con
razones coherentes (NULL CIPHER se estrena en V20, `reg:37`, `reg:821-822`; sp6 no tiene adversario, `sp/sections.ts:136-138`).

**C-1.** `fichas/V50-sp1m4.md:125`, `:181`; `fichas/V52-sp6m1.md:135`, `:152`, `:236`, `:242` · regla 8 (el mismo sujeto de pregunta) · **media**. «Un
despacho» es el sujeto de V50 P2 (escena «Un despacho con ventana») y de V52 P3 (escena «Un despacho pequeño», «un despacho de
contabilidad»), con los dos títulos casi iguales; además V52 pone «una asesoría» en la P1, que es el mismo tipo de organización que el
despacho de contabilidad, en el mismo vídeo; y V49 P2 es una notaría. Seis de los catorce escenarios son oficinas de profesionales.
**Arreglo:** V52 P3: `scenario` «Una academia de idiomas de quince personas, sin equipo técnico, guarda los datos de pago de sus
alumnos.» (104); título de escena «Una academia pequeña» (el resto de la pregunta, intacto). V50 P2 puede quedarse con su despacho.

**C-2.** `fichas/V49-sp1m2.md:237`, `fichas/V50-sp1m4.md:276`, `fichas/V52-sp6m1.md:368` · regla 8 · baja. Tres frases de cierre con la misma forma
(«Busca qué…, qué… y cuánto falta», «Mira qué…, por dónde… y qué…», «Lee qué…, tacha… y deja…»); V50 afirma que la suya tiene «otra forma
que la de V49» (`:276`) y no la tiene. **Arreglo:** V50, «Cada cosa tapa un hueco y falla por algún sitio» (10 palabras, 48 caracteres), con
F-1. Las de V49 y V52 se quedan.

**C-3.** `fichas/V49-sp1m2.md:166`, `fichas/V50-sp1m4.md:195`, `fichas/V51-sp1m5.md:105`, `fichas/V52-sp6m1.md:173` · `rev8` G-4 · baja. Cuatro glosas
«propias» de «MEJOR» que dicen lo mismo con sinónimos («alguna otra también tiene algo de razón», «casi todas valen a medias», «varias
opciones sirven un poco», «casi todas ayudan un poco») y se acaban igual («elige / vale / quédate con la que cuenta / arregla / resuelve el
caso»). V51 y V52 empiezan las dos por «Con un “mejor”» y acaban en «quédate con la que … el caso». Entre V49 y V51 hay solo V20 y V50. **Arreglo**,
las dos que más se parecen: V51 «Si piden el “mejor”, ojo, que varias arreglan algo, pero una arregla lo que cuenta el caso.» (91 caracteres, 17
palabras, sin dos puntos; cabe: 36 + 17 + 17 = 70 ≤ 76 con la resolución de F-2) y V52 «“Mejor” no es “bueno”. Casi todas ayudan, y solo una resuelve el caso entero.» (14 palabras).

**C-4.** `fichas/V51-sp1m5.md:8-10` frente a `:315-316` · coherencia · baja. La cabecera dice que el alumno «ha visto ya V28, V49 y V20» y
omite V50, que va justo antes (sp1m4); y el solape dice que su ficha «no existía». Actualizar: «V28, V49, V20 y V50», y V51 no toca nada de V50.

**C-5.** `fichas/V49-sp1m2.md:182-189`; V41 y V44 (`fichas-tanda8/_revision.md` C-5) · regla 8 · baja. «Un ayuntamiento» certifica su
cumplimiento en V49 P3; en V41 y V44 el ayuntamiento es la autoridad que da la licencia del club y el destinatario del aviso de la farola.
`rev8` ya quitó a un ayuntamiento de un papel por mezclar tres. V49 va antes, pero el alumno lo oye después con otro papel. **Arreglo:** V49
P3, `scenario` «Antes de certificarse, una residencia apunta qué requisitos de la norma cumple, cuáles a medias y cuáles no. Ordena lo que
falta por lo que más le preocupa.» (156). Voz: «La última. Antes de certificarse, una residencia repasa los requisitos de una norma. Apunta
cuáles cumple, cuáles a medias y cuáles no. Y lo que le falta, lo ordena por lo que más le preocupa. ¿Qué actividad describe mejor lo que
está haciendo?» (43 palabras, igual).

**C-6.** `fichas/V51-sp1m5.md:120`, `:125` · regla 8 · baja. «Una cadena de ópticas» con «programa de citas» roza dos cosas: la «web de citas»
de camiones de V19 (`reg:206`), de la que la ficha dice no usar nada, y «el escaparate de una cadena de tiendas» de V30 (`reg:1440`). No
choca (otro mecanismo y otro vídeo), pero «citas» y «cadena» se repiten. **Arreglo:** ninguno obligatorio; basta con no dibujarlo como una web
de citas ni como una tienda con foto de la central al montar la escena (V30 tiene ocupado ese dibujo).

**C-7.** `fichas/V52-sp6m1.md:301-303`, `:436-447` · regla 8 · baja. P4 usa el mismo mecanismo que V37 P2 (`fichas-tanda7/V37-sp2m8.md:175-214`):
el cortafuegos del perímetro no ve el tráfico de equipo a equipo, con el cortafuegos de cada equipo (host-based) como opción. En V52 es
legítimo (§9.5: practicar estrategia con contenido ya visto), pero la ficha no lo declara entre los solapes. Añadir V37 a «Solapes con
otros vídeos»: «V37 (sp2m8). Su P2 enseña que el cortafuegos del perímetro no ve lo que pasa dentro; V52 P4 lo usa al revés, con “menos”».

**C-8.** `fichas/V49-sp1m2.md:67-74`, `fichas/V51-sp1m5.md:72-79` · regla 8 · baja. V30 (papel del baseline), V49 (la hoja de mercancías) y V51 (la
petición) cosen su vídeo con un documento. Los tres se distinguen bien (aquel tiene cuatro preguntas alrededor, este se rellena y se sella,
el otro es un papel que viaja), y V49 y V51 lo declaran. Solo se apunta para quien monte los pósteres: tres miniaturas de «una hoja».

Lo que está bien: V49 y V50 no usan el chaleco, el almacén, la orden, el carné, el foco, el código de la escalera, la cerradura, la
receta ni la cámara del depósito (`reg:1416-1432`); V51 no toca CHG-2041 ni sus nombres; V52 no dice «reloj», «aula», «hoja» ni «cola». No
hay dos escenarios de la tanda con el mismo sujeto salvo C-1. Ninguna ficha da por sabido un término que otra aún no ha presentado.

---

## D. Imágenes y analogías

**D-1.** `fichas/V51-sp1m5.md:104`, `:301`; frente a `fichas/V50-sp1m4.md:334` y `reg:1423` · regla 4 (la imagen no enseña al revés) y regla 8 · **media**.
S02 dibuja «tres candados que se abren» y, cuando están los tres abiertos, cae el sello. En seguridad, un candado abierto significa «sin
proteger»; aquí significa «requisito cumplido». Y el candado de combinación de V21 está ocupado en el registro (`reg:1423`); V50 lo
reserva expresamente («V21: el foco, el candado, …»), y V51 dice que sus candados «no son candados de combinación», cosa que el
espectador no distingue. **Arreglo:** tres casillas con un visto en la petición (IMPACT ANALYSIS · PRUEBAS · BACKOUT PLAN) y el sello que
cae cuando las tres tienen el visto. Cambiar «candados» por «casillas» en `fichas/V51-sp1m5.md:104`, `:110` (el icono del cierre) y `:301` (la nota de
vecinas).

**D-2.** `fichas/V51-sp1m5.md:96`, `:106` · regla 8 · baja. La lista de la obra («el capataz tiene una lista en la puerta») es la imagen de
V1 para las reglas del cortafuegos: «como un portero con su lista» (`video/capas-halden/narration.json:185`, s05-03). V1 (sp4m7) va
después de V51 en el curso, pero el registro no tiene la imagen en «ocupadas» y la ficha no la ve. El mecanismo es el mismo (puerta, lista,
quien no figura no pasa) para dos conceptos distintos (orden de las reglas, alcance de la allow list). La imagen enseña bien el rasgo
(solo pasa lo listado; se apunta al fontanero, no a su empresa). **Arreglo:** o se mantiene y se anota en el registro como imagen
de V51 con la salvedad de V1, o se usa la alternativa 3 de la ficha (sin imagen: la propia lista de la petición ya enseña «una sola línea»).

**D-3.** `fichas/V49-sp1m2.md:89`, `:98` · regla 4 · baja. «Integrity, que no cambie sin que se note» y el chip «que se note» convierten una
propiedad de prevención en una de detección, y la lección dice «no ha sido alterada sin autorización» (`sp/sp1-part1.ts:309`). Que algo
se note es el hash, no la propiedad. **Arreglo:** concepto y chip «que nadie lo cambie sin permiso» (42 caracteres), con la marca que
salta como «y si cambia, se ve».

**D-4.** `fichas/V49-sp1m2.md:91`, `:102`, `:131-132`, `:202-203` · coherencia interna · baja. El botiquín ordena la compra por «lo que más falta te
haría» y la resolución de P3 dice que «ordenar por lo que preocupa suena a riesgo». El vídeo enseña lo primero y llama trampa a lo segundo;
en la lección, la prioridad es parte del gap analysis (`sp/sp1-part1.ts:405`, «cuánto importa la diferencia»). **Arreglo**, resolución
de P3: «Gap analysis, porque compara lo que tiene con lo que pide la norma. Ordenar por lo que preocupa también lo hace, pero esto se mide
contra una lista, como el botiquín.» (31 palabras, igual que ahora; cabe en 33).

**D-5.** `fichas/V52-sp6m1.md:351-360`, decisión 9 `:483-487` · regla 4 (exactitud de la tarjeta) · baja. Las cinco tarjetas son reglas de estrategia
(«MEJOR: la que resuelve todo el caso») y el motor las rotula «EXAMEN · SY0-701 · 4.6», «5.2», «2.2», «3.2» y «1.4»; el alumno lee la regla de
«mejor» como si fuera parte de gestión de identidades. Es la consecuencia aceptada de no pedir un objetivo general al motor. **Arreglo
(sin tocar el motor):** que cada tarjeta lleve el contenido de su pregunta y la regla en la misma línea, por ejemplo «SSO: un corte cierra
todo. MEJOR: el caso entero» (48), «PRIMERO: activos, luego amenazas» (32), «MÁS probable: el correo, no el zero-day» (39), «MENOS: ojo,
la pregunta va al revés» (35) y, si G-1 se aplica, «Lo estándar: probado, no inventado» (33).

Lo que está bien: el botiquín, el plano, los cuatro cuartos, los cuatro cebos y el crucigrama enseñan el rasgo correcto. El crucigrama
(empiezas por lo que sabes, lo difícil queda a lápiz) y «sin penalización · nunca en blanco» no se contradicen; la analogía no cubre «no
dejes nada en blanco», que va en pantalla. Ninguna imagen copia el molde de las tandas 8 y 9 (ni «autoridad que precinta», ni «un molde,
muchas copias»); el plano de V50 es de otra familia que el de V28 (planta del edificio) y el de V16 (áreas con garita), y lo declara.

---

## E. Canon

No hay choque con fechas, sistemas con nombre, el caso de septiembre ni los dosieres de NULL CIPHER, RED MARROW, BLIND ARCHITECT, SILENT
PAGER ni PAPER GOVERNOR. Ninguna ficha fecha nada; el único día de la semana es el «Sábado» de CHG-2041, que V51 no usa y propone corregir
(el 6-9-2026 es domingo, `reg:466`; 3-9-2026 es jueves, `reg:48`). Palabras vetadas: ninguna aparece en voz («single point of failure»,
«carné», «pase», «foco», «aplica» en los títulos, «Gana …», «PRIMERO» en V49–V51, «Zero Trust» en V49 y V51, «reloj», «aula», «hoja» en
V52). Los «Canon nuevo» de las cuatro no se pisan entre sí. Las cinco preguntas de V52 y las diez restantes van fuera del puerto, con
el rótulo, y el único ataque que sale bien (el ransomware de V50 P3) es un supuesto de otra organización.

**E-1.** Citas erróneas (de unas 190 comprobadas, las de `reg` por muestreo; el resto está bien):

| Ficha | Cita | Qué hay | Debe ser |
|---|---|---|---|
| `V49-sp1m2.md:261`, `:275` | `sp/sp4-part1.ts:389` (portal de declaración de carga) | `},` | `sp/sp4-part1.ts:400` (la ficha usó la numeración sin el bloque de V21, once líneas menos) |
| `V49-sp1m2.md:81`, `:128` | `sp/sp1-part1.ts:317` (fallo de hardware, amenaza de availability) | la fila de controles de la availability | `:316` |
| `V50-sp1m4.md:341` | `reg:192` (la caja fuerte del SOC de V2) | el cortafuegos de 7 reglas | `reg:76` o `reg:197` |

**E-2.** `fichas/V50-sp1m4.md:89`, `:121`, `:296`, `:390`, `:436` frente a `:298-299` · regla 1 · baja. S01 y la decisión 2 hablan de «lo que Seguridad
pediría a una *entrada nueva*» y el canon nuevo dice «no dice que el puerto vaya a abrir ninguna entrada». La frase da por hecho una
entrada nueva. **Arreglo:** «lo que Seguridad pediría a cualquier entrada» y, en la voz de s01, «En el puerto de Halden, Seguridad escribe lo
que pediría a una entrada, sea cual sea».

**E-3.** `fichas/V49-sp1m2.md:259-264`, `:100` frente a `reg:110-118` · regla 1 · baja. El canon nuevo dice «sin canal, sistema, portal ni
plazo», y s04 (propuesta) dice que «el sistema de la naviera la manda solo y enseña un certificado». Es una propuesta, pero fija que una
naviera se autentica con certificado de cliente antes de que V11 (3-11) enseñe que entra con usuario y contraseña en la «zona de navieras» y
V12 enseñe el certificado del portal (que es del servidor). **Arreglo:** s04 «el sistema de la naviera se identifica» y el chip
«también las máquinas, con un certificado» sin decir que lo hace ella al mandar la hoja; y quitar «sistema» de «sin canal, sistema, portal»
o decir «sin canal, portal ni plazo».

**E-4.** `fichas/V52-sp6m1.md:128`, `:386`, `:140` · coherencia · baja. El canon dice que Halden sale «en el sello de s01, y el sello de cierre»,
pero s13 no lleva ningún sello. Y el sello de s01 dice «caso de ejemplo» donde no hay caso. Es la decisión de «Halden como marco ligero»
(G-2). **Arreglo:** quitar «y el sello de cierre» de `:386` y rotular s01 «Autoridad Portuaria de Halden · del puerto al examen».

---

## F. Recuentos (Node, `[...texto].length` y palabras por espacios)

Todo cuadra con lo que dicen las fichas, salvo lo de F-1 a F-3:
- `scenario`, `q`, las 56 opciones, `why` y `trapWhy` de las 14 preguntas: escenario máx. **158** (V50 P3; límite 160), `q` máx. 56, opción máx.
  52 (V52 P5; límite 70), `why`/`trapWhy` máx. **85** (V52 P4; límite 90). Las 20 tarjetas, de 31 a 47 (límite propio de 48; el motor admite 58).
- Palabras leídas de escenario y pregunta: V49 42 · 42 · 43; V50 32 · 32 · 31; V51 36 · 33 · 34; V52 35 · 33 · 28 · 28 · 40. Las frases de cada
  una coinciden (ninguna pasa de 22). Glosas: 23, 24, 20, 17, 20, 21, 22. Resoluciones de V49 (29, 19, 31), V50 (30, 24, 30) y V52 (32, 26, 28,
  27, 32); las de V51 no están escritas (F-2).
- Sumas de escenas: 276 (V49, V50, V51) y 468 (V52). `wordBudget` por escena (`s` × 2,7) y los de las escenas de pregunta ((`s` − 8) × 2,7): coinciden en
  las cuatro (745, 745, 745, 1.265). Las sumas de voz por pregunta caben: V49 71 · 84 · 74 (de 76 · 86 · 76), V50 62 · 80 · 61, V52 84 · 79 · 77
  · 77 · 72 (de 86 · 81 · 81 · 81 · 86).
- Duraciones: 276 × 1,024 = 282,6 s; por tipo de escena, 286,9 s (V49, V50), 287,2 s (V51); V52 468 × 1,024 = 479,2 s y 484,3 s. Dentro de 240–330 y
  420–600.
- Títulos de bloque 39 · 38 · 37 · 38; de YouTube 71 · 71 · 82 · 84; líneas de entrada 82 · 74 · 72 · 142 caracteres. 0 think prompts; 0 mensajes
  interceptados; ninguna pregunta en s01 ni en la última escena; como mucho una tarjeta por escena y ninguna en s01 ni en la última (V49, V51:
  ni en s07).
- Letras: ver A-8; con el reparto de la ficha, claves A 3 · B 4 · C 4 · D 3 y trampas A 3 · B 4 · C 4 · D 3; sin repeticiones seguidas.

**F-1.** `fichas/V49-sp1m2.md:231-239`, `fichas/V50-sp1m4.md:268-278`, `fichas/V51-sp1m5.md:230-238` · plan §1 («Claridad y ritmo», 6) y `wordBudget`
· **media**. Las reglas y la frase del cierre, dichas en voz, miden **102** (V49: 37 + 27 + 26 + 12), **104** (V50: 29 + 35 + 28 + 12) y **100**
(V51: 35 + 26 + 19 + 20) palabras, frente a las **54** de `wordBudget` de s08 (20 s). Los cierres publicados llevan 63 a 71 (V28 65, V29 63,
V30 71, también en 20 s; `rev8` y `rev9` solo contaron la frase, no las reglas, así que no hay un chequeo anterior que las fichas hayan ignorado).
A 2,7 palabras por segundo son unos 38 s, no 20, y la estimación de duración (283 s) sube a unos 295; sigue
dentro de 330, pero el cierre se vuelve más largo que el vídeo de un concepto. V52 sí lo cuenta (58 + 6 = 64 de 70). **Arreglo:** recortar a
unas 60 palabras, con «Tu turno.» al final (la tarjeta final lleva la tarea en pantalla):
- V49: «Una, traduce el caso a lo que se rompe. Se lee, se cambia o no se puede usar. Dos, las tres A van en orden. Quién eres, qué puedes y qué
  hiciste. Y tres, el gap analysis compara lo que tienes con lo que pide el marco. Busca qué se ha roto, qué se está preguntando y cuánto
  falta. Tu turno.» (61 palabras)
- V50: «Una, cada control tapa un hueco. Los bollards frenan coches y el badge apunta quién entra. Dos, un sensor se elige por dónde falla. El
  de radio cruza tabiques y el de sonido no. Y tres, un cebo parte de que ya hay alguien dentro, y cualquier toque avisa. Cada cosa tapa
  un hueco y falla por algún sitio. Tu turno.» (61)
- V51: «Una, antes de que firme el comité hacen falta impacto, pruebas y plan de vuelta atrás. Dos, pregunta quién más lo usa, y a las listas
  entra solo lo que el cambio necesita. Y tres, un cambio no se cierra hasta que lo escrito dice lo que hay. Antes de tocar, tres cosas. Al
  tocar, lo necesario. Al acabar, todo al día. Tu turno.» (64)
Las reglas largas siguen en pantalla como texto del icono. Además, en V49 la regla 1 lleva dos `;` si se dice tal cual (plan §1, regla 2).

**F-2.** `fichas/V51-sp1m5.md:57-58`, `:444-445` · rigor de la ficha · **media**. V51 es la única que no trae el texto de sus resoluciones: V49, V50 y V52
las escriben («Resolución (voz, N palabras)») y V51 solo da los números («19 (9/10), 28 (4/8/16), 28 (2/18/8)»), que no se pueden
comprobar. En la P1 la holgura es de una palabra (36 + 20 + 19 = 75 de 76). **Arreglo:** escribir las tres resoluciones en la ficha y
recontarlas. Propuesta: P1 «El backout plan, para volver a lo que funcionaba. Retocar en producción sería otro cambio sin probar.» (17
palabras; 36 + 17 + 17 = 70 de 76 con la glosa de C-3) · P2 «Añadir solo el destino que hace falta. Permitir la red entera tienta porque ahorra
trabajo, pero deja pasar más de lo que el cambio necesita. Se apunta al fontanero, no a toda su empresa.» (34 de 43 posibles) · P3 (con A-6)
«Los procedimientos. Cambió cómo se cursa un encargo y nadie lo dejó escrito para todas. El diagrama también toca, pero no explica eso.» (23
de 42).

**F-3.** Detalles sueltos · baja:
- `fichas/V49-sp1m2.md:119`: el escenario de P1 mide **153**, no 152.
- `fichas/V49-sp1m2.md:131`: la resolución de P1 mide **29** palabras (10/12/7), no 28; sigue cabiendo (71 de 76).
- `fichas/V49-sp1m2.md:391`: «frases de 2/10/24/8» debe ser **2/10/22/8** (suman 42).
- `fichas/V51-sp1m5.md:49-50`: «43 s hasta los 240 y 43 hasta los 330» → **43 y 47** (330 − 283), como V49 y V50.
- `fichas/V51-sp1m5.md:236`: la frase del cierre mide **106** caracteres, no 107 (20 palabras bien).

**F-4.** `fichas/V52-sp6m1.md:107-111` · baja. El barrido de «LEAST» en el banco se repite: en el worktree es 0 (en mayúscula; las
apariciones de «least privilege» o «at least» no cuentan), pero `main` ya trae tarjetas y checks nuevos (currículo práctico). Rehacerlo antes
de redactar «la primera práctica de “menos” de todo el curso»; si apareciera uno, no cambia la pregunta, solo esa frase de la ficha.

---

## G. V52 en particular

Comprobado: **perfil** `caso-principal-yt` sin excepciones (13 escenas, 5 capítulos de 3-3-3-2-2, 6 conceptos, 5 preguntas de dominios y calificadores
distintos, 5 tarjetas con objetivo `N.N` válido, 0 think prompts, 0 mensajes); **lo que dice de sp6m1** coincide con la lección: hasta 90
preguntas, 90 minutos, 100–900 con corte en 750, closed-book, test con una o varias respuestas más simulaciones (cortafuegos, ordenar pasos,
clasificar controles), pesos 12/22/18/28/20 con «Operaciones y Amenazas suman la mitad», simulaciones al principio, 15–20 minutos para
ellas, revisar las marcadas, sin penalización. **No inventa datos oficiales:** no dice cuántas simulaciones hay ni cuánto valen, ni usa el 83 %,
y deja el aviso de `comptia.org`. **Aritmética del ritmo:** si se reservan 15–20 de los 90 minutos para las simulaciones y el test son 84-87
preguntas (las simulaciones cuentan dentro de las 90), quedan de 70 a 75 minutos: de 0,8 a 0,9 minutos por pregunta, «algo menos de un
minuto». Correcto; y mejor que la lección (`sp/sp6.ts:44`: «~1 minuto por pregunta… reserva 15–20»), que no cierra. La ficha lo avisa en la
corrección 3.

**G-1.** `fichas/V52-sp6m1.md:121`, `:137`, `:305-341`, decisión 5 `:469-472` · regla 4 (cada pregunta ataca una confusión concreta) y diseño §9.5 · baja.
El concepto 5 («lo estándar antes que lo ingenioso») tiene su escena (s10), su tarjeta y su pregunta, pero s10 ilustra la regla con política,
multifactor y segmentación (`sp/sp6.ts:46`) y nada prepara una CA pública; y la pregunta 5 es, como dice la ficha, «la misma lección de
“mejor” que la pregunta 1» (una parte frente a todo el caso). El alumno ve la regla de lo estándar sin el ejemplo con el que luego se le
pregunta. **Arreglo (el mínimo):** una tercera fila en la columna «estándar» de s10, «una autoridad pública, no un certificado hecho en casa»
(el mismo ejemplo de la lección: `sp/sp1-part4.ts:367-368`, la CA pública para el público y el self-signed donde controlas los clientes), y
la resolución de la P5 ya la cierra («para el público, lo estándar»). **Alternativa, solo si Lidia quiere una pregunta de «estándar frente a
ingenioso» de verdad:** «inventar un algoritmo propio y secreto» frente a «uno estándar» (dominio 1.4; no está en el banco: se buscó
«proprietary», «own algorithm» y «obscurity»). **Pero la lección de criptografía no lo dice** (`sp/sp1-part4.ts:26` solo da AES como «el
estándar»), así que exigiría una línea nueva en el mismo PR, por ejemplo en `:26`: «Se usan algoritmos estándar y públicos como AES, nunca uno
propio mantenido en secreto: la seguridad no puede depender de que nadie conozca el método.» Sin esa línea, la pregunta incumple la regla de
que todo lo que enseña el vídeo va antes en la lección, y la P5 se queda como está.

**G-2.** `fichas/V52-sp6m1.md:12-16`, `:128`, `:386`, `:450-456`, pregunta para Lidia 1 `:527-530` · diseño §9.5 · baja. La decisión de Halden «como marco ligero»
(sello, cinco bloques, nada en el cierre) es defendible y está bien planteada: el diseño §9.5 dice «sin caso de Halden», y la ficha lo declara
como desviación, la pone ante Lidia con la alternativa literal y no inventa canon (ni analista en una sala de examen, ni cierre de
campaña, ni «el puerto vuelve a operar»). Tres precisiones: (1) no hay vuelta a Halden en s13 aunque el canon la anuncia (E-4); (2) «Llevas
todo el curso en el puerto de Halden» presupone un alumno que ha hecho el curso, y la app deja abrir sp6 antes; mejor «Si has llegado hasta
aquí, ya conoces el puerto de Halden» (la voz de s01 sigue en 54 palabras); (3) el sello «caso de ejemplo» sin caso: E-4.

**G-3.** `fichas/V52-sp6m1.md:164-172`, `:174-177` · baja (aviso para el guion). En P1 la voz dice «Un inicio de sesión único… el gestor ayuda con las
contraseñas, pero no cierra las cuentas». Un gestor de contraseñas corporativo con aprovisionamiento sí puede retirar cuentas (el autor lo
nota en la duda 1); la opción dice «por persona» y el escenario «cerrarle todas las cuentas», así que se sostiene. Al grabar, no decir
«no puede» sino «no las cierra todas a la vez».

Lo que está bien: el reflejo de cada pregunta es un error de estrategia, no de contenido; las cinco de dominios distintos usan un objetivo real
cada una; la primera práctica real de «menos» del curso (P4) tiene el calificador con su giro en pantalla; «tacha dos» no se vende como
regla de CompTIA (decisión 7) y la voz dice «suelen caerse dos».

---

## Qué está bien, en una línea cada cosa

- Ninguna pregunta copia ni parafrasea al banco, a la colocación ni a una flashcard con opciones.
- Las 14 claves son únicas con la lista oficial de objetivos y la lección; ninguna depende de una frase que contradiga a CompTIA.
- Escenarios y preguntas dentro de los límites del motor, voz sin dos puntos ni «¿Y …?» y sin frases de más de 22 palabras.
- Orden del curso respetado: V49 y V50 se presentan solos, V51 no usa CHG-2041, V52 no remite a nada.
- Ninguna ficha usa NULL CIPHER ni adversario; ninguna fecha; el «Sábado» se corrige en la lección, no se hereda.
- Inserciones de las cuatro: último check, vídeo, párrafo de salida, con las citas que se desplazan bien contadas.

---

## Qué se ha aplicado (2026-10-20)

Cada ficha recibió los hallazgos que la nombran; las lecciones no se han tocado (sus correcciones quedan como condición o recomendación del PR de cada vídeo).

- **V49:** A-1 (pregunta 1 reescrita), A-9 (costura con V28 aceptada y anotada), C-5, C-8, D-3, D-4, E-1, E-3, F-1 (cierre de 61 palabras), F-3. No aplicados: C-2 y C-3 (caen en V50 a V52) y A-8 (solo V52).
- **V50:** A-3, A-4, B-1 (la corrección de `sp1-part2.ts:310` pasa a condición del PR), C-2, E-1, E-2, F-1 (cierre de 61 palabras). A-2 se deja como está.
- **V51:** A-6 (pregunta 3 sin la pista del escenario), D-1 (casillas con visto en lugar de candados), C-4, F-1, F-2 (las tres resoluciones escritas) y las citas erróneas.
- **V52:** A-8 (claves D, B, A, D, C y trampas A, C, B, C, A; la tanda queda en 4·3·3·4 y 4·3·4·3), B-2 (línea nueva en `sp6.ts:45` como condición del PR), B-4, C-1 (la pregunta 3 pasa a una academia de idiomas), C-3, G-1 a G-3 y las citas. F-4 sigue pendiente: tras fusionar con `main` hay que rehacer el barrido de «LEAST» y el recuento de piezas del banco.
