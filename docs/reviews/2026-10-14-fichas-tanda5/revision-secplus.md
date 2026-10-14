# Revisión de exactitud y canon · V24, V25 y V26 (tanda 5, Security+)

Fecha: 2026-10-14. Revisor de solo lectura. Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`, `reg` =
`docs/superpowers/canon/glass-harbor.md`, `F24`, `F25`, `F26` = `docs/reviews/2026-10-14-fichas-tanda5/ficha-V24.md`,
`ficha-V25.md`, `ficha-V26.md`, `plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md`, `eng/` = `video/engine/`.
Las líneas de la lección son las del archivo **sin** los bloques de vídeo insertados (como las citan las fichas).
Gravedad: **bloquea** (no se puede escribir el guion hasta decidirlo o arreglarlo) · **corregir** (se arregla en la ficha o
en el guion antes de congelar) · **nota** (a tener presente).

## Veredicto

| Ficha | Veredicto | Por qué en una línea |
|---|---|---|
| V24 · sp3m7 · recuperación ante desastres | **listo con arreglos** | exacta en sitios, pruebas y copias; la imagen del sitio warm usa dos imágenes ocupadas que la propia ficha prohíbe, y un cue de efectos no existe |
| V25 · sp5m3 · ALE | **listo con arreglos** | la aritmética es correcta de punta a punta; la inserción rompe el criterio que aplican V24 y V26 (queda antes de un check que el vídeo contesta) y el cierre da dos tareas |
| V26 · sp5m4 · RTO, RPO, MTTR y MTBF | **listo con arreglos** | exacta; tres de sus cuatro efectos no son cue, y su voz, su registro y su «primera aparición» chocan con V25 |

**Bloquean el guion tres cosas** (H1, H2 y H4): la imagen del teatro de V24 (usa «almacén» y «foco», ocupadas), el choque de
V25 contra V26 en PAPER GOVERNOR (voz, registro y pronunciaciones: nadie puede escribir los cuatro mensajes hasta que se
decida) y «primera aparición de las dos» frente a «vuelve» en V26. Los cues de efectos (H3) son mecánicos, como en V19 de la
tanda 4, y van en «corregir». **Ninguna de las tres fichas tiene un error de contenido técnico**: no hay cifra mal
calculada, ni día de la semana mal puesto, ni límite del validador pasado, ni tarjeta que enseñe lo contrario de la
lección o del objetivo. Los identificadores H1 a H33 son fijos (las referencias cruzadas los usan); el orden dentro de cada
grupo es el de gravedad.

## Qué he comprobado (con Node y con las fuentes)

- **Límites del validador** (`eng/scripts/lib/narration.mjs:13-23`, `:287-288`, `:303`, `:322-323`, `:412`; `profiles.mjs`
  perfil `capsula-yt`), recontados con `[...texto].length`, `FORBIDDEN_SYMBOLS` y `{}[]|<>` (script en el scratchpad):

  | | tarjetas (≤58) | pregunta (≤48) | mensajes (≤70) | símbolos |
  |---|---|---|---|---|
  | V24 | 56, 54, 52, 52 | 47 | 58, 60 | ninguno |
  | V25 | 43, 47, 51, 48 | 44 | 62, 61 | ninguno (`×` y `=` no están prohibidos) |
  | V26 | 46, 46, 41, 52 | 44 | 65, 64 | ninguno |

  Las tres: 6 escenas en 3 capítulos, 4 tarjetas (una por escena de s02 a s05, ninguna en s01 ni en la última), 1 pregunta
  con `holdMs` 4500 (≥ 4000, ≤ 5000), 2 mensajes (uno en I y otro en II, ninguno en el cierre; `holdMs` 3800 dentro de
  2500–4500), suma de `s` = 210 en las tres. Los límites son los de las fichas: coinciden al carácter.
- **`wordBudget`:** 210 × 2,7 = 567; por escena y redondeando, 567 (V24), 566 (V25) y 566 (V26), como declaran. Los
  extremos 0,89 y 1,22 dan 187–256 s. Mi estimación, sin medir: ~565 palabras + unas 40 pausas de 330 ms + las esperas
  (pregunta 4,5 s, dos mensajes 3,8 s) + márgenes de la tubería ≈ 250–255 s estimados; con la lectura de Lidia al 85–93 %
  de `--estimate` (V5b, V7, V8, V9: `CLAUDE.md`) caen en ~215–237 s. Precedente con la misma suma y estructura: V12, 233 s
  (plan, cabecera de V12). Dentro de 190–260 en las tres.
- **Aritmética** (Node): SLE 400.000 × 0,25 = 100.000; ALE 100.000 × 0,5 = 50.000; 50.000 − 20.000 = 30.000; 90.000 − 50.000 =
  40.000 de más; 90.000 < 100.000 (por eso el atajo «aprobado» de V25 s04 deja pasar el control caro); empate con ARO 0,2
  (100.000 × 0,2 = 20.000) y con EF 0,10 (40.000 × 0,5 = 20.000); 10 años × 0,5 × 100.000 = 500.000 frente a 200.000 de
  control; 36.000 ÷ 3 = 12.000 y 36.000 × 3 = 108.000. V26: (40 + 95 + 120 + 65) ÷ 4 = 80 min = 2,67 × 30; las cuatro > 30;
  MTBF = (8.760 h − 5,33 h) ÷ 4 = 2.188,7 h = 91,2 días ≈ 3 meses (y 12 ÷ 4 = 3,0). Todo coincide con las fichas.
- **Días de la semana:** 3-9-2026 jueves; 16-12 miércoles, 17-12 jueves, 22-12 martes; 12-01-2027 martes. Como dicen las
  fichas.
- **Citas de línea:** verificadas contra `sp/sp3-part4.ts`, `sp/sp5-part2.ts`, `sp/sections.ts`, `sp/labs-sp3.ts`,
  `sp/labs-sp5.ts`, `sp/sp5-cards.ts` y `src/data/content.test.ts`. Todas las de F24, F25 y F26 coinciden con el archivo
  (los `:47`, `:49-72`, `:95`, `:99`, `:101-116`, `:117-122`, `:123-137`, `:107`, `:122-130`, `:162`, `:181`, `:316`,
  `:400`, `:406`, `:411`, q1 a q8…). Ninguna cita de línea es falsa; las inexactitudes de descripción están en H13 y H31.
- **Objetivos SY0-701** (de memoria, no he podido abrir el documento oficial): 3.4 (high availability, site
  considerations hot/cold/warm y geographic dispersion, platform diversity, continuity of operations, capacity planning,
  testing con tabletop, fail over, simulation y parallel processing, backups, power) y 5.2 (risk identification,
  assessment, analysis con SLE/ALE/ARO/probability/likelihood/exposure factor/impact, risk register, KRI, owner,
  threshold, tolerance, appetite, strategies, reporting y BIA con RTO, RPO, MTTR y MTBF). Las tres fichas cubren lo que
  dicen cubrir y usan el objetivo correcto en las tarjetas (3.4, 5.2, 5.2).
- **Efectos de sonido:** los diez nombres que usan las fichas existen en `eng/sfx/sfx.json`; el problema es otro (H3).
- **Suite `lesson videos`** (`src/data/content.test.ts:248-390`): comprueba el módulo de cada id de YouTube (`:268-317`),
  que póster y transcripción existan, que no se compartan assets y que los blocks `t: 'video'` sean válidos. **No mira la
  posición** del bloque dentro del módulo, así que las tres inserciones son compatibles con la suite; la línea `toBe(...)`
  de cada una cabe en `:305-317` (F24 la pone junto a V21, `:305-308`, que es exactamente donde acaba V21).
- **Una premisa del encargo, aclarada:** F26 **no** comparte cifras con F25. Declara lo contrario: «nada de R-014,
  400.000 €, 50.000 €, 20.000 €, 90.000 € ni de “alta disponibilidad”» y «V26 no pone ninguna cifra en euros»
  (F26:188-190); solo cita la lección anterior para el ARO, «y sin cifras» (F26:190, F26:33). Lo que sí comparten V25 y V26
  es PAPER GOVERNOR (voz, tic, presentación; F26:121-137, F25:180-183, F25:270-284) y que los dos caen en la sección sp5,
  con el laboratorio `spl5c` (R-014, 400.000 €, 50.000 €, 20.000 €) como terreno de V25 solamente. Las cifras de R-014 las
  comparten **la lección sp5m3 (`:113-141`), el comienzo de sp5m4 (`:316`) y el laboratorio spl5c** (`sp/labs-sp5.ts:207-
  243`), no V26. Detalle del laboratorio en H17.

---

## Hallazgos, por gravedad

### Bloquean el guion

**H1 · V24 · el teatro usa dos imágenes ocupadas que la propia ficha prohíbe** (F24:79-81 frente a F24:85 y F24:94).
F24 abre su apartado de imágenes con «no se mezclan con las ocupadas: ni valla, garita, puerta, llave, ventanilla,
chaleco, **almacén**, **foco**, candado, carné, casco, tienda…». Dos líneas más abajo, la imagen del concepto 1 dice
«warm: el escenario y los **focos** listos y el decorado en un **almacén**», y la escena s02 repite «escenario y focos con el
decorado en un almacén (WARM SITE)». En `reg` los dos están marcados como ocupados: «el almacén del puerto … Ocupada: un
vídeo posterior no usa el chaleco, el almacén ni la orden para otra cosa» (`reg:920-921`, V20) y «el foco que alumbra al
vecino … Ocupada» (`reg:926`, V21). Es justo la dimensión que más cuenta del vídeo (warm, la fila central).
*Cambio:* el decorado, «guardado en el camerino» o «en un camión», y las luces, «la iluminación» o «los proyectores
listos»; sin las palabras «almacén» ni «foco» en voz ni en pantalla. Añadir las dos a la lista de palabras que el guion no
dice, junto a «escalera» y «peldaño» (F24:219-220).

**H2 · V25 y V26 · PAPER GOVERNOR sin fijar: dos voces, dos registros y dos relatos de «primera aparición»** (F25:17-25,
F25:121-131, F25:180-183, F25:270-284; F26:113-137, F26:251-252). Lo que choca, en una tabla:

| | F25 | F26 |
|---|---|---|
| Voz | `sapi/Microsoft Pablo` + `cifrado`, `rate` 0 (reserva: Laura + `cifrado`) | `sapi/Microsoft Laura` + `megafonia`, `rate` 0 (reserva: Laura + `machine`) |
| Registro de los mensajes | imperativo que **tutea**: «Pon el valor del servidor como pérdida y listo.» | **acta impersonal**, sin tuteo: «Se acuerda: todo en cero minutos…» |
| Coletilla | «Queda en acta.» | «Queda en acta.» (de acuerdo) |
| Presentación | frase del jefe de sp5 («vive en los huecos de tu gobernanza») | la misma (de acuerdo) |
| Quién fija | Lidia (decisión 2, F25:279-280) | «quien se grabe primero: V25» (F26:136-137) |
| Pronunciación de `GOVERNOR` | «gávernor» (F25:36) | «góvernor» (F26:32) |
| Pronunciación de `ARO` | «a erre o» (F25:34-35) | «aro» (F26:33) |

Las dos fichas se remiten una a la otra («V26 la hereda», «V25 la fija») y ninguna de las dos decide, de modo que los
cuatro mensajes (dos de V25, dos de V26) hoy están escritos en dos registros distintos para **el mismo adversario**.
*Cambio:* decidir una vez, antes de escribir ningún mensaje, voz (ver la sección «Voz de PAPER GOVERNOR»), registro y
pronunciaciones, y reescribir los cuatro. Si gana el acta (más distintivo que otro adversario que tutea, y de acuerdo con
la gobernadora de papel), los de V25 caben así: «Se acuerda: el valor del servidor es la pérdida. Queda en acta.» (63) y
«Se da por bueno: control más barato que un incidente. Queda en acta.» (68); si gana el imperativo, los de V26 se vuelven
imperativos y breves. Y `ARO`, que sale en V25 y opcionalmente en V26, se lee igual en los dos.

**H4 · V25 y V26 · «primera aparición» de las dos y «sin otra vez» en V26** (F25:8-9, F26:9-11, F26:134-137 frente a
F25:296-302(c)). En el orden del curso V25 (sp5m3) va **justo antes** que V26 (sp5m4); F25 admite que V26 «puede decir
vuelve» (F25:299-300) y F26 prohíbe el «otra vez». El precedente de dos vídeos consecutivos del mismo adversario no es el de
NULL CIPHER en V11/V20 (separados por lecciones y por semanas) sino el de V12 («Vuelve NULL CIPHER», `reg:514`) y V17 («Y
vuelve BLIND ARCHITECT, que vive de los planos con atajos», `video/fronteras-halden/narration.json:50`), que son del mismo
caso y de lecciones contiguas. Quien siga el curso oirá la misma presentación palabra por palabra en dos lecciones seguidas.
*Cambio (decisión de Lidia):* V26 dice «Y vuelve PAPER GOVERNOR, que vive en los huecos de tu gobernanza» (la presentación
completa sigue en pantalla, así que se entiende sola); V25 presenta desde cero. Si prefiere que V26 no dependa de V25,
queda la costura, pero hay que decirlo en las dos fichas.

### Corregir en la ficha

**H3 · V26 y V24 · efectos de sonido que no son cue** (F26:27-29 frente a F26:92-96; F24:26-29 frente a F24:93).
`sfxMapErrors` (`eng/scripts/lib/sfx.mjs:36-60`) rechaza un `sfx` cuya clave no es un cue del guion («no cue {…} in the
narration»), y una clave en más de una escena. En F26:

- `promise` («lock», «los dos números quedan escritos») se describe en s03, pero su cue es el de s01 (`ask-time, ask-data,
  fade, title, promise, adversary`, F26:92): sonaría en los tres chips del hook, no en s03.
- `average` («ding», sale la media) no existe: el cue de s04 es `mean` (F26:95).
- `pass` («check», la fila de facturas queda bien) no existe: el cue de s03 es `rpo-five` (F26:94).
- `gap` sí cuadra (s04).

En F24, `lights-out` («error», se apaga el centro de datos) no es cue de s01, que tiene `stamp, dc, dark, title, promise,
adversary`; `swap`, `green` y `unusable` sí cuadran. F25 cuadra entera (`sle`, `ale`, `fits`, `over`). Es el mismo error
que V19 tenía en la tanda 4 (`revision-secplus.md` de la tanda 4, hallazgo 1, «arreglar»): mecánico, `build-timeline` lo
coge, pero hay que corregirlo en la ficha antes de escribir el guion.
*Cambio:* F26: `promise` → un cue nuevo de s03 (p. ej. `both-set`), `average` → `mean`, `pass` → `rpo-five`. F24:
`lights-out` → `dark`. Y comprobar el resto con `build-timeline --estimate` antes de congelar.

**H5 · V24 · el segundo centro «a 40 km», dicho sin decir nada** (F24:94 última frase, F24:149-150, F24:165-170,
F24:265; lección `sp/sp3-part4.ts:80`, `:126`, q7 `:233`). La ficha cierra s02 con «el segundo centro de datos del puerto
está a 40 km», «sin decir de qué tipo es ni que la distancia sea la correcta». El dato no hace nada: el espectador acaba de
ver el segundo centro «en la misma calle» y un temporal que cubre los dos, y a continuación lee 40 km sin una frase que lo
valore. Por contraste, **sugiere que 40 km es «lejos»**, que es justo lo que la ficha dice no afirmar y que la lección
tampoco fija (no da mínimo; solo q7, 2 km, es el contraejemplo; el check `:80` lo da por dispersado). Y deja una pregunta
colgando (¿qué tipo es?) que el vídeo se niega a contestar por la tensión de `:126` («recibió los bloques en segundos») y
`sp/labs-sp3.ts:222` («warm site»), con lo que **crea canon nuevo sin función**. De memoria, 40 km puede seguir dentro de la
misma llanura inundable o del mismo corte regional; la lección misma lista «una inundación en la dársena, un temporal, un
corte regional de red eléctrica» (`:47`).
*Cambio:* quitar la línea y dejar la dispersión como principio (el «edificio de enfrente» ya basta para enseñarlo), o
conservarla como dato de la lección con una frase de matiz («la lección no da una distancia mínima: lo que cuenta es qué
suceso os alcanza a los dos»). La primera opción borra el canon nuevo y la tensión; es la que recomiendo.

**H6 · V24 · la pregunta para pensar: «carga real» se lee de dos maneras** (F24:107-113, F24:96; lección `:95`, q4 `:184-198`).
«Con su DNS y carga real: ¿parallel o fail over?». En q4 «under real user load» es el discriminador del fail over (usuarios de
verdad en el sitio de recuperación), y así es como la ficha lo quiere. Pero `:95` dice que el paralelo hace procesar «los
**mismos datos que producción**», y «carga real» puede leerse como «datos reales», que el paralelo también tiene. Lo que el
paralelo no hace es **cambiar** a los usuarios de sitio (DNS, certificados, integraciones, permisos). Y la pregunta es q4
casi palabra por palabra (la ficha lo cita como base, F24:110), lo que contesta de antemano una pregunta del test de la
lección (precedente: V20, hallazgo 4 de la tanda 4).
*Cambio:* decir «usuarios» y no «carga» en la pregunta y en los chips, para que el discriminador sea el cambio de sitio:
«Probar el cambio de DNS: ¿parallel o fail over?» (47). Respuesta: fail over, porque el paralelo prueba el respaldo, no el
cambio.

**H7 · V25 · inserción antes de un check que el vídeo contesta** (F25:51-64, F25:291-293; lección `:143-157`, `:158-163`,
`:164-178`, `:179-182`). F25 coloca el vídeo entre el check del SLE y la nota de examen, y deja después el check del ALE de
120.000 € (`:164-178`). Ese check pide ALE = 30.000 × 4 y comparar con 95.000 al año; el vídeo enseña la misma cadena
(SLE, ARO, ALE) y, en s04, exactamente la trampa del check («comparar el control con lo que cuesta un evento»). V26 (F26:47-
49) y V24 (F24:56-64) razonan el mismo caso al revés y lo descartan, citando el precedente de V20 (`decisiones-V20-V21.md:
94-96`). F25 no lo considera: solo compara «antes de la nota» con «después de la nota» (F25:291-293). La justificación de
poner el vídeo delante de la nota («es lo que la nota resume») es más débil que la de no contestar un check.
*Cambio:* **después del último check (`:178`) y antes del párrafo que pasa a sp5m4 (`:179`)**, que es la pauta dominante
del repo (V5b, V10, V11, V16, V20, V24, V26), con la línea de enlace «Antes de pasar a la siguiente lección, míralo en el
puerto: …». Con eso desaparece también la excepción de F25:59-62 (el cálculo hacia atrás ya está dicho en la nota
`:162`) y la suite no cambia. Nota: s05 cita «un cálculo no es una decisión» (`:181`), la primera frase del párrafo que
sigue; no es spoiler, pero conviene que la voz no la lea tal cual.

**H8 · V25 · el cierre da dos tareas** (F25:104 frente a F25:132-140). El apartado «Cierre» dice «tres reglas y **una sola**
tarea: el laboratorio Risk Math», pero la fila de s06 pone en la tarjeta final «Tu turno: Risk Math (spl5c) **y** las
preguntas de la lección (sp5m3, 8 preguntas)». Plan §1, «Claridad y ritmo» 6: «tres reglas prácticas y una sola acción
siguiente». V24 y V26 sí cumplen (un laboratorio; las preguntas).
*Cambio:* una sola en la tarjeta final. Recomiendo Risk Math (F25:138) y dejar las ocho preguntas en el texto de la lección.

**H9 · V24 · el mensaje de s05 describe las copias del puerto** (F24:120-121; también F24:197-201, F24:266-267).
«¿Probar las copias? **Salen en verde cada noche.** Menos es más.» habla de «las copias» a quien lo ve, es decir, del
puerto; dice que salen verdes cada noche. F24 se prohíbe contar el estado de las copias de Halden («no dice que el puerto
“nunca ha restaurado”», F24:197-201; «la voz de V24 no lo hace», F24:266-267) y el rótulo «ejemplo · sin fecha · no es el
registro del puerto» solo cubre la tira de s05, no el mensaje. V5 restauró con éxito y «hash coincide» (`reg:76`): quien
lo ve después de V24 no debería leer que el puerto cree estar protegido por unos verdes. Además es el atajo de BLIND
ARCHITECT que más roza el flavor «backups sin probar» y el dosier «backups probados le cerraron el paso»
(`sp/sections.ts:85`, `:87`; `reg:358`): V16 «no toca las copias» a propósito (`reg:361`).
*Cambio:* un atajo que quite un paso sin describir el estado del puerto: «¿Probar las copias? Si salen en verde, ya valen.
Menos es más.» (62). Y que F24 diga en el canon nuevo que **es el primer vídeo en el que BLIND ARCHITECT habla de copias**
y que `reg:361` (y la nota «no toca las copias») se actualiza al publicarlo.

**H10 · V24 · el mensaje de s02 cobra lo que la lección no dice** (F24:117-119 y s02 en F24:94). «¿Un respaldo lejos? Al lado
sale más barato.» y la narradora lo contesta con «más cerca sale más barato, pero el mismo suceso alcanza a los dos». La
lección no habla de coste de la distancia: el contrapeso que da es la **latencia** («cuanto más lejos, más difícil es la
replicación síncrona», `sp/sp3-part4.ts:47`), que F24 saca expresamente del vídeo (F24:148). El «error» que corrige la
narradora no es un error de la lección, y la «razón» del atajo es una afirmación que el espectador tiene que creerse.
Además, «respaldo» ya es la palabra del paralelo (s03: «prueba el respaldo») y de las copias (s05).
*Cambio:* «¿Un segundo centro lejos? Al lado replica mejor. Menos es más.» (62; usa el contrapeso de la lección) y la
narradora lo concede («es verdad: más cerca, más fácil replicar») antes de «pero un mismo suceso los alcanza a los dos».
Con «replica mejor» el vídeo toca la latencia una frase, sin tarjeta.

**H12 · V24 y V26 · el mismo gancho en dos cápsulas** (F24:93, F26:92). V24 abre con «¿dónde sigue todo y **cuánto tarda en
volver**?» y un reloj sin hora; V26 abre con «¿**Cuánto tarda en volver?** → Enseguida.». Las dos caen en dominios distintos
(sp3 y sp5) pero quien sigue el curso las verá con unas lecciones de por medio y con la misma pregunta de gancho; además las
dos tratan la espera como pregunta («cuánto aguantan parados»). No es un choque de canon, pero el hook es lo que más se
recuerda.
*Cambio:* V24 mantiene «¿dónde sigue todo?» y deja el reloj sin pregunta («y mientras tanto, el reloj corre»); V26 se queda
con «Enseguida.» y «Poca cosa.», que es suyo.

**H13 · V26 · el cuadro de reparto describe mal a V24** (F26:57-62 frente a F24:134-139, F24:43-45). F26 dice que V24 «usa RTO
y RPO como el dato que elige sitio y copia (`sp/sp3-part4.ts:47`, `:57`, `:99`)». F24 es lo contrario: «la voz y las
tarjetas no dicen RTO ni RPO», no copia la celda «RTO/RPO cercanos a cero» y deja la frecuencia como consecuencia del RPO
para V26. También F26:253-255 anticipa «backups cada noche» en V24: F24 no tiene frecuencia de copia. Y F24:138 dice que V26
«puede enlazar con “el sitio caliente”»; F26:191-193 prohíbe hot, warm y cold.
*Cambio:* F26: V24 «no nombra RTO ni RPO: elige el sitio por “cuánto puede estar parado el puerto” y por lo que ya
funciona allí»; V26 puede decir «capacidad de recuperación» sin la palabra «caliente»; y quitar el «puede enlazar» de F24.

**H16 · V26 · la reserva de voz es la de otro adversario** (F26:129, F26:264-265). «Reserva: Laura + `machine`, que ya suena
en la pista de GCTI». Laura + `machine` **es** PAPER CRANE, voz por voz (`video/ach-matriz/narration.json`,
`video/atribucion-cuadro/narration.json`): no es una reserva sino un duplicado. F25 la tiene bien (Laura + `cifrado`, «Laura
ya es de RED MARROW y de PAPER CRANE», F25:275-276). Tampoco es «una pareja nueva sin trabajo de motor» la que F26 dice
tener en reserva.
*Cambio:* quitar la reserva o sustituirla por una pareja libre de la tabla de la sección «Voz».

### A tener en cuenta

**H11 · V24 · regla 3 del cierre: sigue la nota de la lección** (F24:127; lección `:99`, nota `:121`, check `:126`). «El
snapshot y la réplica no cuentan: copian también el daño» es la frase de la nota de examen («replication y snapshots no son
copias de seguridad: propagan el borrado y el ransomware», `:121`), y en el check `:126` los snapshots salen cifrados «junto
con el volumen». No hay error. Los dos chips de s05 son más precisos que la regla («snapshot · mismo almacenamiento» y
«réplica · copia también el borrado y el cifrado», F24:97) y el mecanismo del snapshot está en `:99`.
*Cambio (opcional):* en la voz de s05, que el snapshot sea «el que vive en el mismo almacenamiento», como el chip.

**H14 · V26 · el título de la escena s03 y la pregunta** (F26:94 y F26:106-112). La escena que lleva la pregunta se titula
«Cuánto esperas y cuánto pierdes» y la pregunta es «Dos días de **espera**: ¿basta una **copia** al día?». El título no da el
5 min del RPO, que es lo que la respuesta necesita, así que no la destripa; pero pone a la vista el par «esperas / pierdes»
y por lo tanto «copia = lo que pierdes», que es la distinción que enseña la respuesta. Es el límite de la regla de
`plan:207-211` (V11 y V21 la aplicaron).
*Cambio (opcional):* «Dos promesas por proceso» o «Cada proceso, su pareja de números».

**H15 · V26 · el mensaje de s04 lleva «RTO», y SAPI lo recibe sin léxico** (F26:119-120; `eng/scripts/tts-adversary.mjs:100-111`
escribe `intercept.text` tal cual en el archivo que lee SAPI). El léxico de Lidia no actúa sobre el mensaje: la voz recibe
«el RTO será lo que tardamos de media». Con voces SAPI en español es probable que las mayúsculas sueltas se deletreen, pero no
lo he podido oír (V18 tuvo que escribir «9,8» con coma para que Pablo leyera el número, `reg:608`).
*Cambio:* no quitar la sigla (el término de examen es lo que enseña el mensaje); meter la frase en la prueba de oído de la
sección «Voz» y, solo si SAPI no la dice como letras, escribir una variante («R T O») o decir «el plazo» en el mensaje y
nombrar el RTO en la respuesta de la narradora.

**H17 · V25 · el vídeo da la clave de cinco de las ocho afirmaciones de `spl5c`** (F25:155-168, F25:191-196; `sp/labs-sp5.ts:
204-243`). El laboratorio es la tarea del vídeo y trae las cifras de R-014 (400.000, 0,25, 0,5, 20.000). El vídeo dice las
tres primeras afirmaciones correctas (SLE 100.000, ALE 50.000, «20.000 < 50.000»), y nombra como errores los de las
incorrectas «el SLE es 400.000» (s02, mensaje) y «ARO 0,5 = dos veces al año» (s03, s05). F25 lo admite como L y plantea
tres precauciones, pero la primera («no trae ninguna afirmación del laboratorio como respuesta final») se contradice a sí
misma una línea más abajo («dice los números … que son … las tres primeras afirmaciones de spl5c»). No es un error: la
lección entera (`:113-141`) ya da la clave del laboratorio y el vídeo no destripa nada que la lección no destripe. Pero la
tarea del cierre queda como repaso de lo que se acaba de oír.
*Cambio (opcional):* decirlo con claridad en la ficha («el vídeo repasa lo que la lección y el laboratorio comparten»), o
cambiar las cifras de s03 y s04 por unas propias del vídeo y dejar R-014 solo en el hook, a costa del hilo «50.000 €» con que
empieza sp5m4 (`:316`; F25 lo descarta en la decisión 1, F25:261-269). La contradicción «activo del laboratorio frente a
activo de la lección» (`sp/labs-sp5.ts:207` frente a `sp/sp5-part2.ts:114`) es real y está bien recogida (F25:191-196).

**H18 · V25 · «sin fecha» pegado a una lección que sí la tiene** (F25:171-175, F25:188-189, F25:261-269; `sp/sp5-part2.ts:113`).
El vídeo no repite el 3-9, pero el bloque se inserta justo detrás del código que dice «ANÁLISIS CUANTITATIVO … 03-09-2026 ·
comité de riesgos del puerto» (`:113`; aunque H7 mueva el vídeo, sigue en la misma lección y la fecha queda arriba): quien ve el vídeo acaba de leer la
fecha. Y `reg:135` ya fecha el comité el 3-9 (jueves, el de la tarde de V1). El canon declarado («sin fecha») sigue siendo
correcto, pero la prohibición de F25:199-203 («nunca sugiere que el comité “lo vio venir”») hay que sostenerla en la voz,
porque la fecha está en la página.
*Cambio:* una línea en F25: «la lección fecha el comité el 3-9; el vídeo no lo dice y la voz no lo vincula con V1». Y
añadir al guion un «no repetir “hoy” ni “ese día”».

**H19 · V25 · la imagen del móvil y de la funda** (F25:84-93). Funciona a escala (400 €, 100 €, 50 €/año, 20 €/año), pero
«una funda de 20 € **al año**» y «de 90 € al año» no es como se compra una funda: el «al año» hay que decirlo («una funda que
cuesta 20 € por año de uso»). Y la de 90 € para un móvil de 400 € hace de contraejemplo, pero un oyente la rechaza por
razón de precio sin cuenta. Además el móvil de V6 («Imagina tu móvil a medianoche», `video/iam-halden/narration.json:339`) y
el del bolsillo de V9 son del mismo objeto; F25 lo trata (F25:221-222).
*Cambio:* decir «una funda que se amortiza en un año» una vez y no repetir «al año» en las dos fundas; que el naturalidad lo
mire. Y el «mapa de calor» de s01 (F25:99) es el de la matriz de riesgo; V21 tiene «el site survey, y su mapa de calor»
(`reg:123`): decir «el mapa de riesgos» o «la matriz».

**H20 · V25 · «Backup inmutable + EDR gestionado»** (F25:223-225, F25:31-33; lección `:126`). Es la línea de la lección y F25
la deja sin comentario, pero para quien ve V1 y V5 el puerto ya tiene un EDR (el que aísla `OPS-WS-14` a las 16:11,
`reg:56`) y copias (V5 restaura la del 2-9, `reg:76`). «EDR gestionado» es además un servicio de tercero, el territorio del
dosier de PAPER GOVERNOR («contratista… sin due diligence», `sp/sections.ts:125`) y de sp5m5. La ficha ya evita decir si
el puerto lo tiene; falta que la **voz** no diga «gestionado por un proveedor» (F25:39-40 dice «el paquete de copias y EDR»,
bien).
*Cambio:* una línea en «No se toca»: «“gestionado” solo en pantalla; la voz dice “copias y EDR”».

**H21 · V24 · la tira de copias se parece a la de V5** (F24:97 frente a `v5/src/data/s07-recovery.ts:22-26`). V5 dibuja tres
copias de tres noches (1, 2 y 3-9 a las 23:00) con el título «copias de seguridad de tres». V24 dibuja «una tira de copias de
varias noches, todas en verde». Se ven antes en el curso (sp3 antes de sp4) y F24 los separa con el rótulo «ejemplo · sin
fecha» (F24:97, F24:173-176), pero el gesto visual es el mismo.
*Cambio:* otra composición (un solo trabajo con su semáforo verde y un reloj, o una cuadrícula de «n noches» sin fechas),
no una tira de tres con hora.

**H22 · V24 · «temporal»** (F24:94, s02). El mapa «un temporal los cubre a los dos» usa la palabra de «alta mar con temporal»,
la imagen del casco de V18 (`reg:615`, `reg:931`). F25 la descartó por eso (F25:285-287); F24 no. La lección da «una
inundación en la dársena» primero (`:47`).
*Cambio:* «una inundación» (y «el mismo suceso»).

**H23 · V24 · el paracaídas** (F24:87). «Un paracaídas plegado cada noche con su pegatina “revisado”… la prueba es abrirlo
en el suelo»: nadie pliega un paracaídas cada noche ni lo abre en el suelo como prueba, y la imagen suena a «alguien muere si
no funciona». Sirve para «verde ≠ vuelve», pero no para «restaurar en un entorno aparte».
*Cambio (a la revisión de naturalidad):* una imagen que se pruebe de verdad, sin gravedad y sin objetos ocupados: «llave»
está ocupada (`reg:486-487`, V10; F24:80) y el simulacro de incendio es de V5b. Por ejemplo, un paraguas plegado en la
entrada con su pegatina «revisado» que nadie ha abierto; la prueba es abrirlo.

**H24 · V26 · fechar el 17-12 mete septiembre en «los últimos 12 meses»** (F26:210-212, F26:171-173). Sin fecha, «últimos 12
meses» es relativo y no choca. Con el 17-12 (jueves, libre), el registro de averías de un año cubriría el 3 y 4-9, y el
registro (`reg:840`) deja a propósito sin respuesta cuánto tardó la recuperación: una avería de 95 o de 120 minutos puede
leerse como esa recuperación.
*Cambio:* mantener sin fecha (la recomendación de F26) y escribirlo: «si se fecha, el registro de averías no cuenta el último
año sino “las cuatro últimas”».

**H25 · V26 · «propuesta» y «ejemplo» en la misma consola** (F26:66, F26:166-173, F26:262-263). s02 y s03 llevan el sello
«propuesta · datos ficticios» y s04 «ejemplo · datos ficticios», pero s04 concluye «el plan no se cumple y hay que mejorar la
recuperación» (F26:95) sobre un RTO que es solo una propuesta. Son dos cosas distintas (la promesa no está en vigor y el
registro de averías es un ejemplo), y la frase «el plan no se cumple» las junta.
*Cambio:* en s04, «si estos fueran los números, el plan no se cumpliría» (condicional), y el mismo rótulo en las dos
consolas.

**H26 · V26 · el cronómetro del MTTR** (F26:238-248; lección `:400`, `sp/sp5-cards.ts:27-28`). La lección define el RTO
como «tiempo máximo tolerable» y el MTTR como «reparar y devolver el servicio»; la tarjeta, «una vez ocurrido el fallo».
Eso es lo que hay que decir, y F26 lo dice. Lo que **no** da la lección ni el objetivo (de memoria, sin MTD) es el cronómetro
«desde que cae hasta que vuelve» de F26:240, que F26 usa «solo porque es el que comparte con el RTO».
*Cambio:* en la voz, «lo que se tarda de media en dejarlo funcionando» (MTTR) y «el plazo que se promete» (RTO), sin fijar
desde qué instante empieza a contar. La ficha ya apoya el argumento en que las cuatro averías pasan de 30 (F26:242-243), que
es lo seguro.

**H27 · V26 · la pregunta repite el check que acaba de salir** (F26:106-112; lección `:408-422`). Dos números a la vista y se
elige cuál manda sobre la copia: el mismo ejercicio que el check de las líneas anteriores (4 h y 15 min), con otras cifras.
F26 lo declara distinto («aquí solo se ve el que despista»), y lo es en forma, pero quien acaba de contestar el check
oye la misma regla un minuto después. Precedente: V20, hallazgo 4 de la tanda 4.
*Cambio (opcional):* una pregunta que use el MTTR contra el RTO («Si cada avería tarda 80 min y el RTO es de 30, ¿qué
cambias: el RTO o la recuperación?»), que es el hueco que la lección solo nombra y q4 trabaja. Es lo que F26 vende como
novedad del vídeo.

**H28 · V26 · s03 y s04 con 140 palabras cada una** (F26:94-95, F26:279). Son 52 s con 140 palabras: 2,7 palabras/s sin
contar la espera de la pregunta (4,5 s en s03) ni el avance del mensaje (3,8 s en s04), es decir ~2,9–3,0 palabras/s
efectivas. V24 s04 y V25 s03 y s04 están en 2,9–3,0 también. Con los 5 conceptos a la vez (cafetería, dos procesos, pregunta,
consola, media) es la escena a recortar la primera, como dice F26:40-41, pero conviene decir que se recorta antes de que
Lidia grabe, no después.

**H29 · V26 · «Facturación» y «emitir facturas a las navieras»** (F26:198-200, F26:84, F26:93). El área sale bien (`reg:92`,
`video/iam-halden/src/data/s02-creep.ts:15`) y la ficha aparta el permiso. Pero el texto del proceso, «Emitir facturas a las
navieras», es casi el rótulo de la puerta de V6 («facturas a navieras · emitir», `s02-creep.ts:30`) y quien sigue el curso
ha visto V6 en sp4 antes. Es un eco, no una contradicción, y hasta ayuda; que la narradora no diga «aquella puerta».

**H30 · V26 · la cafetería** (F26:77-80, F26:231-233). Cercana a «la tienda del barrio» de V22 (otra pista, GCTI) y a «la
cocina» de V9: local de barrio con caja y cocina detrás. F24 las veta (F24:80). No es lo mismo, pero el naturalidad debe
mirarlo.
*Cambio:* si choca, un taller o un puesto sin caja registradora (el «técnico de la caja» pasa a «el técnico de la máquina»).

**H31 · V25, V26 · numeración de las líneas tras insertar los bloques** (F25:63-64, F26:42-53). F25 avisa de que las líneas
de sp5m4 se mueven tras insertar V25 (~11 líneas, el párrafo de enlace y el bloque); F26 cita la numeración **sin** el
bloque de V25 y no lo dice. Cuando las dos ramas estén fusionadas, todas las citas de F26 se desplazan en la misma medida
(`:398-426`, `:400`, `:406`, `:411`, q4 `:475-488`, q7 `:520-533`). F24 dice «unas trece líneas» (F24:65): son 11 (p de
4 líneas y bloque de 7), como `sp/sp3-part3.ts:215-226` y `sp/sp3-part2.ts:481-489`.
*Cambio:* una línea en F26: «numeración sin V25; sumar el tamaño de su bloque»; y «once» en F24.

**H32 · V25 · «muelle norte» y «muelle 3»** (F25:100, F25:204-206). El hook de s02 pone «muelle norte» en pantalla; V1 y V5
tienen «sala de control del muelle 3» como lugar de Operaciones y de Lucía. `reg:929` ya registra «muelle norte» como el
servidor de planificación de R-014; F25 separa bien servidor de planificación y de control. Que la voz no diga «muelle» a
secas; basta «el servidor de planificación de grúas».

**H33 · V24 · «CPD»** (F24:41-42, F24:93). F24 pone «CPD» solo en pantalla y la voz dice «centro de datos». La lección
usa «CPD» en sp1 (`sp/sp1-part1.ts:114`, `sp/sp1-part2.ts:300`) y «data centre» en sp5 (`sp/labs-sp5.ts:88`): es el mismo
centro. Nada que cambiar; solo registrar en `reg` que «CPD» y «centro de datos» son la misma cosa.

---

## Voz de PAPER GOVERNOR: qué encaja mejor, sin decidir

Estado de las parejas voz + efecto en los `video/*/narration.json` → `adversaryVoice` (comprobado con un script sobre los 25
narration.json):

| | `machine` | `telefono` | `cifrado` | `megafonia` |
|---|---|---|---|---|
| **Pablo** | SILENT PAGER (V1, V5, V5b, V6, V18, V21), GLASS VIPER (V3, V7, V13, V14, V22), HOLLOW LANTERN (V4, V8, V15) | libre | libre | libre |
| **Laura** | PAPER CRANE (V9, V23) | RED MARROW (V10, V19) | libre | libre |
| **Helena** | libre (descartada en la tanda 3) | libre | NULL CIPHER (V11, V12, V20) | BLIND ARCHITECT (V16, V17), `rate` −2 |

Qué hace cada efecto (`eng/scripts/adversary_fx.py:1-22`, `:50-90`): `machine` baja 4 semitonos, anillo y banda 120–5000 Hz;
`telefono` es una llamada (saturación, siseo, banda 300–3400); `cifrado` es un enlace digital pobre (mantiene a ~11 kHz,
6 bits, puerta de ruido: seco, sin sala, sin tocar el tono); `megafonia` es una bocina (banda 250–5000 Hz con un realce de
+6 dB a 2 kHz y una cola de reverberación de 1,2 s: un aviso por altavoces en una nave vacía, `reg:549-551`).

| Eje | V25: Pablo + `cifrado` | V26: Laura + `megafonia` |
|---|---|---|
| Distancia a las existentes | comparte la voz base con tres adversarios (pero allí va grave y con anillo; aquí, sin tocar) y la textura con NULL CIPHER (pero con otra voz): **una pieza en común con dos vecinos y ninguna con los demás** | comparte la voz base con RED MARROW y con PAPER CRANE, y el efecto **con la sala, con el tono y con otra voz femenina SAPI** con BLIND ARCHITECT, que además es de la sección anterior; **dos vecinos con una pieza y uno con dos** |
| Advertencias ya escritas | ninguna directa | la revisión de la tanda 3 dice «Laura no sirve para BLIND ARCHITECT: es RED MARROW con `telefono`, y `megafonia` también es una banda recortada, así que sonarían parecidas» (`docs/reviews/2026-10-05-fichas-tanda3/revision-V16-V17.md:236-237`): el mismo argumento, al revés |
| Dosier («desenmascarada», `sp/sections.ts:125`) | voz masculina sin enmascarar; precedente de Pablo para una adversaria «ella» (SILENT PAGER «expuesta», `reg:452`), pero allí el `machine` baja el tono; el criterio de tanda 3 (la voz fija el género: Helena para NULL CIPHER y BLIND ARCHITECT, `reg:488-491`, `:548-552`) apunta a una voz femenina | voz femenina: coherente con el dosier y con la regla de tanda 3 |
| Encaje semántico | `cifrado` es la textura de la criptografía (NULL CIPHER); para «gobernanza de papel» no dice nada | un comunicado leído por megafonía encaja con «Queda en acta» |
| Riesgo con la Sec+ | «suena a hombre» (lo admite F25:277-280) | «suena a RED MARROW o a BLIND ARCHITECT», y el dosier de sp5 es el que los junta: «GLASS HARBOR … contratista con acceso perpetuo»; que dos adversarios suenen igual sugiere «GH es una sola operación» (`reg:346`; tanda 3, `revision-V16-V17.md:238-240`) |

**Lectura (sin decidir):**

- **Con las voces existentes encaja mejor la de V25 (Pablo + `cifrado`)**: es la más lejana de las cinco en las tres
  dimensiones (voz, textura y espacio), y la segunda que se queda libre con un adversario nuevo.
- **Con el dosier encaja mejor la de V26 (Laura + `megafonia`)**: es femenina y el comunicado lleva «Queda en acta».
  La pareja de V25 se defiende con el precedente de SILENT PAGER, pero con `cifrado` no hay nada que enmascare el tono.
- **Ninguna gana en los dos ejes.** Libres hay siete parejas (tabla); las que más se parecen a una «tercera vía» tienen
  su problema: Laura + `cifrado` (reserva de F25) es femenina y seca pero comparte textura con NULL CIPHER (Helena + `cifrado`),
  y las dos voces femeninas SAPI pueden sonar parecidas; Pablo + `megafonia` comparte efecto con BLIND ARCHITECT y sala.
  Helena + `machine` la descartó la tanda 3 (suena a SILENT PAGER, `revision-V16-V17.md:248-252`) y Helena + `telefono` la descarta F25 (Helena ya es de dos adversarios, F25:274-275). Y la revisión de la tanda 3 daba por hecho que PAPER GOVERNOR «quedaría con Pablo o Laura **con un efecto nuevo**» (`revision-V16-V17.md:253`); las dos fichas piden lo contrario, sin efecto nuevo.
- **El tercer eje, el ritmo.** La tanda 3 usó `rate` −2 para BLIND ARCHITECT para separarla de NULL CIPHER (misma voz).
  Una gobernadora de acta lee despacio, así que `rate` −1 o −2 es una variable barata que cualquiera de las dos parejas
  puede usar; hoy las dos fichas la dejan en 0.
- **«Mismo registro» no es lo mismo que «misma voz»:** el imperativo que tutea (V25) se parece al de SILENT PAGER y RED
  MARROW, que son voces con efectos de máquina o de teléfono; el acta impersonal (V26) se parece a NULL CIPHER (infinitivo,
  sin persona) y a los mensajes sin persona de BLIND ARCHITECT. Ver H2.

**Prueba de oído que haría falta (20 s, Lidia y una persona que haya visto V11 y V16):**

1. **Una sola frase**, el mensaje más corto de las fichas, sin cifras y sin siglas: «Se acuerda: el valor del servidor es la
   pérdida. Queda en acta.» (63). La misma frase, con el mismo `rate`, para las siete condiciones siguientes.
2. **Siete clips seguidos, en este orden y a la misma sonoridad que la narración** (el motor ya los nivela con
   `tts-adversary.mjs`): Pablo + `cifrado` (V25), Laura + `megafonia` (V26), Laura + `cifrado` (reserva de F25), Laura +
   `megafonia` con `rate` −2, y, como **anclas**, NULL CIPHER (Helena + `cifrado`), BLIND ARCHITECT (Helena + `megafonia`,
   `rate` −2) y RED MARROW (Laura + `telefono`).
3. **Dos preguntas por clip:** «¿es la misma persona que…?» (a ciegas, con las tres anclas) y «¿de quién fiarías que es
   “la gobernadora de papel”, por el nombre?».
4. **En contexto:** el clip metido después de un segmento de Lidia, con el efecto de teclado y el glitch del mensaje (como
   en el vídeo), y una vez más con la compresión de YouTube y el `master_mix` (el `cifrado` de 6 bits es el que peor sale de
   un codificador).
5. **La sigla.** La misma prueba con «RTO» dentro del mensaje (H15) y con «Queda en acta.» con y sin coma delante.

Si hay empate, la tanda 3 ya dejó escrito el criterio: separa por textura, espacio y ritmo, no por una sola de ellas
(`revision-V16-V17.md:241-247`).

---

## Solapes entre las tres fichas y con lo publicado

| Con | Qué se toca | Veredicto |
|---|---|---|
| V24 y V26 en RTO/RPO | V24 no los nombra y deja la frecuencia de copia a V26; V26 no vuelve a hot, warm ni cold | **Bien repartido**; las dos fichas se describen mal una a otra (H13) y comparten el gancho (H12) |
| V25 y V26 en cifras | V25: 400.000, 0,25, 0,5, 100.000, 50.000, 20.000, 90.000, y 36.000/3 y 0,2/0,10; V26: 30 min, 48 h, 5 min, 24 h, 40/95/120/65, 80 y 3 meses; sin euros | **Sin choque ni solape** (una cifra «3» es ARO en V25 y meses en V26; no se ven juntas) |
| V25 y V26 en PAPER GOVERNOR | voz, registro, «primera aparición», pronunciaciones | **Choque** (H2, H4) |
| V25 y V24 | «Backup inmutable» como línea de coste en V25 y snapshot/réplica en V24 | Sin solape; V25 no dice qué es una copia inmutable ni V24 la nombra |
| V24 y V5b | tabletop y simulation; V5b: «Tabletop: se habla, no se toca nada», «Simulation: se ejecuta de verdad, con coste» (`video/ir-halden-pruebas/narration.json:66`, `:120`) | Bien: V24 los dice en ~10 s sin su caso; V5b pregunta «Sin tocar producción, barato: ¿mesa o simulacro?»; V24 pregunta «parallel o fail over?». Para V24 el simulacro es «sin mover producción» y para V5b «con coste»: no se contradicen |
| V24 y V5 | copia y restauración de `srv-tc-app03` | Bien tratado (F24:197-201); H9 y H21 |
| V24 y V1 | «copia» (la del tap), «los backups» de V2 en orden de volatilidad | Sin solape |
| V24 y V16/V17 | fail-open/closed; túnel de la sede a la terminal | Bien separado (F24:207-211) |
| V25 y V18 | SILENT PAGER aconsejó un seguro; V25 no dice «seguro» ni «transferir» | Bien (F25:215-217) |
| V26 y V6 | Facturación; «Planificador de atraques» | Bien (F26:196-200), H29 |
| V25 y V21 | «mapa de calor» (site survey) | Eco (H19) |

**Inserción del bloque `youtube` en cada lección**

| | Posición propuesta | Pauta del repo | Compatible con la suite | Veredicto |
|---|---|---|---|---|
| V24 | después del 3.er check (`:123-137`) y antes del párrafo de cierre (`:138`) | último check, vídeo, párrafo: V5b, V10, V11, V16, V20 | sí (`toBe('sp3m7')`, `:305-308`) | **correcta**; la alternativa (antes de la nota, `:116`/`:117`) la deja antes de un check que s05 toca |
| V25 | entre el check `:143-157` y la nota `:158-163`, con un check detrás (`:164-178`) | no es la pauta; V17, V6 y V19 van antes de la nota pero con **todos** los checks atrás | sí (`toBe('sp5m3')`) | **corregir** (H7): mejor tras `:178` |
| V26 | después del último check (`:408-422`) y antes del párrafo que salta a sp5m5 (`:423`) | pauta dominante | sí (`toBe('sp5m4')`) | **correcta** |

Las tres líneas de enlace son del estilo de V17 y V19 («Antes de…, míralo en el puerto: …»). Las tres rutas (`videos/
recuperacion-halden-poster.png`, etc.) no chocan con ningún asset existente.

---

## Por ficha, lo que se ha comprobado y sale limpio

**V24 · exactitud técnica: correcta.** Hot/warm/cold por «cuánto hay ya funcionando allí» y por coste (`sp/sp3-part4.ts:47`,
tabla `:49-72`); geographic dispersion como condición para los tres, y la contraparte, la latencia, fuera del vídeo
(H10); las cuatro pruebas, de menos a más reales y arriesgadas, con tabletop = plan, simulation = acciones reales sin mover
producción, parallel = el respaldo procesa lo mismo sin interrumpir y fail over = la única que cambia producción de verdad
(`:95`); copia que no se restaura no es copia (`:99`, `:121`). Las cuatro tarjetas cuadran con los reflejos de la nota
(`:121`: cuatro, tres, tres y uno) y no llevan RTO, RPO ni cifra. El «nada se ejecuta» está bien llevado y no hay día,
equipo ni cuenta con nombre. **Canon:** limpio salvo H1, H5, H9, H21, H22. BLIND ARCHITECT: tercera aparición con la voz
y el registro de V16 y V17 (`reg:540-552`, `:595-598`; `video/fronteras-halden/narration.json:50`), sin tuteo, sin
cifrado, sin IP; «pilar», «punto único de fallo» y el flavor fuera (F24:189-196). `lexicon.chatterbox.json`: `BLIND`,
`ARCHITECT` y `DNS` ya fijados (`video/zonas-halden/lexicon.chatterbox.json`, `video/logs-halden/lexicon.chatterbox.json`).

**V25 · exactitud técnica: correcta.** AV, EF (un porcentaje del valor en un evento), SLE = AV × EF, ARO (frecuencia, 0,5 =
una vez cada dos años), ALE = SLE × ARO, comparación con el coste **anual** del control, «otro argumento» si no sale a cuenta
y «la cuenta vale lo que valen sus estimaciones» están en `:105-108`, `:122-141` y `:162`; el cálculo hacia atrás (dividir
por el ARO) está en la nota `:162` («Dos»). La sensibilidad de s05 (ARO 0,2 o EF 0,10 empatan con 20.000) es aritmética de
la lección, y la ficha acierta al no declarar «justificado» ni «no justificado» en el empate, que la lección no dice
(`:107`). La pregunta de s03 (36.000 ÷ 3 = 12.000) usa cifras que no son de la lección ni del laboratorio
(`:167`, `:189`, `:224`, `sp/labs-sp5.ts:207`). Los dos mensajes son errores de la lección (`:139`, `:162` «Tres») y no
llevan cifras ni siglas. **Canon:** limpio salvo H4, H7, H18 y H20; las prohibiciones de F25:198-228 son todas acertadas
(la VPN sin MFA del `:27` no se usa; el servidor de R-014 no es el de control de grúas de `sp/sp2-part1.ts:147`).

**V26 · exactitud técnica: correcta.** BIA desde el negocio; RTO = tiempo, manda sobre la capacidad de recuperación; RPO =
datos, manda sobre cada cuánto se copia; MTTR es una medida que se compara con el RTO; MTBF mide fiabilidad y no se confunde
con el MTTR (`:400`, `:406`, check `:411`, q4 `:475-488`, q7 `:520-533`). Los números cuadran (80, 2,67, 91 días ≈ 3 meses)
y ninguna cifra del vídeo es de la lección, del check, de q4, de q7 ni del test de nivel (F26:161-163: comprobado, 30,
48, 5, 24, 40, 95, 120, 65 no aparecen). Los dos errores de PAPER GOVERNOR, «cero minutos para todo» y «el RTO será lo que
tardamos de media», son de la lección. La frase «Que una media se compara con un máximo» está bien marcada a verificar y
resuelta apoyándose en que las cuatro averías pasan de 30. **Canon:** limpio salvo H2, H3, H4, H24 y H25; ni septiembre
(`reg:840`), ni V5b («11 min», `reg:420`), ni el sistema de asignación de atraques del check, ni seguro/transfer (`reg:614`),
ni sala de control. `Facturación` ya existe en V6 (`s02-creep.ts:15`) y se reutiliza bien; no hay persona con nombre.

---

## Cambios propuestos fuera de las fichas (texto, sin tocar ids ni tests)

1. `sp/labs-sp5.ts:207`: que `spl5c` hable del «servidor de planificación de grúas del muelle norte», como la lección
   (`sp/sp5-part2.ts:114`), o de otro activo con otras cifras. F25 lo propone (F25:195-196); lo confirmo. Ningún test lee
   ese texto (grep de «sistema de gestión de la terminal» solo da el laboratorio).
2. `reg` §4/§5: al publicar V24, anotar que BLIND ARCHITECT habla por primera vez de copias (`reg:361`, `:358`), que «CPD»
   y «centro de datos» son lo mismo (H33) y, si se conserva, que el segundo centro está a 40 km por la lección (H5).
3. `reg` §3/§4 al publicar V25 y V26: PAPER GOVERNOR (voz, registro, tic, presentación), los procesos de V26 y su registro
   de averías «ejemplo · datos ficticios» (F26:165-178).
4. `src/data/content.test.ts`: tres líneas `toBe('sp3m7')`, `toBe('sp5m3')` y `toBe('sp5m4')` con su comentario, al
   publicar cada una (H31 para la numeración).

---

## No he podido verificar

- **El documento oficial de CompTIA SY0-701** (3.4 y 5.2): contrastado de memoria con las lecciones; no está en el repo. En
  concreto: si el objetivo lista «Parallel processing» con esa definición; si el RTO se define como «máximo tolerable»
  (MTD en otros marcos) y si el MTTR se mide desde el fallo o desde la detección (F26:238-248, H26).
- **Qué distancia es «lejos»** para un segundo centro de datos (H5). No hay mínimo en la lección ni en el objetivo.
- **El sonido real** de las siete parejas y cómo lee SAPI «RTO», «acta» y las siglas de un mensaje (H15; prueba de oído).
  No he ejecutado `tts-adversary.mjs` (necesita Windows con voces OneCore y un venv) ni oído ningún clip.
- **Las duraciones renderizadas:** solo el precedente de V12 (233 s) y mi estimación por palabras (~215–237 s). Con tres
  cápsulas de 210 s, V26 s03 y s04 son las más densas (H28).
- **La pronunciación de lo nuevo** (`hot site`, `warm site`, `cold site`, `fail over`, `parallel processing`, `SLE`, `ALE`, `EF`,
  `AV`, `BIA`, `GOVERNOR`): la confirma Lidia al grabar; hoy solo hay contradicción entre fichas en `ARO` y `GOVERNOR` (H2).
- **La analogía del móvil/funda y la del paracaídas** frente a un oyente: la revisión de naturalidad (plan §1) es la que lo
  dice; aquí solo he comprobado que no choquen con imágenes ocupadas de `reg` (§6).
- **V27 (s5m3, YARA/Sigma):** fuera de este encargo; solo he cruzado V24, V25 y V26 entre sí y con lo publicado.
