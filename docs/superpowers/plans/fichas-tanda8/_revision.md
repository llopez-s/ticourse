# Revisión cruzada de la tanda 8 (V39–V44, dominio 5)

> Revisión de solo lectura del 2026-10-17, antes de que Lidia apruebe las fichas. Se han leído enteras las seis fichas, el diseño
> (§4, §6, §9), la ficha de referencia V35, las lecciones sp5m1, sp5m2, sp5m5, sp5m6, sp5m7 y sp5m8 con sus checks y su quiz,
> `placement-sp5.ts`, `sp5-cards.ts`, `labs-sp5.ts` y, del registro, §1, §2, §3, §4, «Notas de V25», «Notas de V26», «Huecos» y §6.
> Rutas: `sp/` = `src/data/secplus/`, `reg` = `docs/superpowers/canon/glass-harbor.md`, `fichas/` = `docs/superpowers/plans/fichas-tanda8/`.
>
> **Un dato previo:** son **20 preguntas**, no 18 (5 de la principal y 3 de cada una de las cinco cápsulas).
>
> Cada hallazgo: `fichero:línea` · regla que rompe · gravedad · arreglo.

## Resumen

- **Alta (1):** V39 pregunta 3 (defensive frente a red team) tiene dos respuestas defendibles según la propia lección.
- **Media (11):** la trampa casi siempre en la A; V39 P1 y V41 P3 son casi el mismo escenario con claves distintas; tres imágenes con
  «una autoridad que cierra o precinta» para tres conceptos distintos; V41 P3 dice una cosa en el escenario y otra en la trampa; V40 P1
  sale del callout de la lección y la contradice; V41 P2 y V43 P1 rozan el banco; V39 P5 repite el marco del check; V42 P2 pregunta
  «qué toca hacer ahora» sin opción que lo diga; la regla de retention de V43 contradice a la lección; el ascensor de V39 enseña al
  revés quién puede precintar.
- **Baja:** citas mal apuntadas (5), detalles de canon, naturalidad y coherencia menor.
- **F (recuentos):** limpio. Ver §F.

---

## A. Exactitud (20 preguntas)

| Vídeo | P | Clave / trampa | Veredicto |
|---|---|---|---|
| V39 | 1 | Regulatory examination / Independent third-party audit | Una sola. La trampa tienta poco: «Nadie la contrató» la mata a la primera (ver C-2) |
| V39 | 2 | Independent third-party audit / Penetration test report | Una sola. Bien |
| V39 | 3 | Defensive (blue team) / Offensive (red team) | **Dos defendibles** (A-1) |
| V39 | 4 | Partially known / Known | Una sola. Bien |
| V39 | 5 | Passive recon / Active recon | Una sola; roza el check (B-3) |
| V40 | 1 | Guideline / Standard | Correcta según SY0-701, pero contradice a la lección (A-2) |
| V40 | 2 | Procedure / Policy | Una sola. Bien |
| V40 | 3 | Revisarla ya / Esperar a enero | Una sola; las opciones llevan su justificación (A-7) |
| V41 | 1 | Data owner / Data steward | Una sola. Bien |
| V41 | 2 | Data custodian / Data processor | Defendible con «MEJOR»; roza el banco (B-1) |
| V41 | 3 | Government entity / Board | Una sola, pero el texto no cuadra (A-3) |
| V42 | 1 | Evidence of internal audits / Independent assessment | Una sola. Bien |
| V42 | 2 | Vendor monitoring / Due diligence | Defendible, pero la pregunta pide otra cosa (A-4) |
| V42 | 3 | MOA / MOU | Defendible con la lección y `fcp522`; fallback listo en la ficha |
| V43 | 1 | Due care / Due diligence | Una sola; roza el banco (B-2) |
| V43 | 2 | Sanctions / Contractual impacts | Una sola. Bien (el ejemplo es literal de `sp/sp5-part3.ts:291`) |
| V43 | 3 | Retention / Right to be forgotten | Una sola. Bien |
| V44 | 1 | Risky / Unintentional | Defendible con el aviso aceptado; la pantalla no dice el porqué (A-6) |
| V44 | 2 | Botón para avisar / Más formación | Una sola. Bien |
| V44 | 3 | Formar a Finanzas en su riesgo / Repetir cada mes | Una sola; la clave es la opción más larga (A-7) |

**A-1.** `fichas/V39-sp5m7.md:192-219` (escenario `:201`) · regla 4 · **alta**. El escenario junta el rasgo que la lección da al red team
(«un adversario real que persigue un objetivo **sin avisar a nadie**», `sp/sp5-part4.ts:122`; «el red team puro es el que mejor mide tu
realidad, porque nadie te avisa», `:109`) con el del blue team («se mide si el equipo lo ve», `:109`, `:127-128`). «Sin avisar a su SOC» +
«un equipo atacante» es exactamente un *assumed breach red team exercise*: un alumno que ha leído la tabla puede defender la A. «MEJOR»
no lo salva, porque el texto de la lección empuja a la trampa. **Arreglo:** aplicar ya el fallback de la duda 1 pero sin dejar la pregunta
sin trampa: quitar el equipo humano y el «sin avisar», p. ej. «Un banco reproduce en su red, una a una, técnicas de ataque grabadas, sin
objetivo que alcanzar, y solo mide cuánto tarda su SOC en verlas y contenerlas»; trampa, el red team (hay técnicas de ataque); el purple
cae porque el SOC no trabaja con nadie.

**A-2.** `fichas/V40-sp5m1.md:98-129` · regla 4 (diseño §9.3) · media. La clave (guideline) es la de CompTIA, pero la explicación del check
`sp/sp5-part1.ts:41` («the moment a document names a version, a length or an algorithm it has… become the standard») y `fcp501`
(`sp/sp5-cards.ts:6`, «an exact number or setting is a standard») dicen lo contrario sin matiz. La ficha propone corregirlas, pero en la duda 1
(`:280-284`) dice «se descarta antes que tocar la lección»: según §9.3 es al revés, la lección se corrige en el PR del vídeo. **Arreglo:**
convertir la propuesta en condición: la ficha solo se aprueba con «mandatory» añadido en `:41` y en `fcp501` en el mismo PR. Ver también B-4.

**A-3.** `fichas/V41-sp5m2.md:156-184` (escenario `:165`, `trapWhy` `:169`) · regla 4 · media. El escenario tiene dos sujetos: «El
Gobierno nombra a dos consejeros» y «Una autoridad pública le exige…», y la pregunta es por «esa autoridad». La trampa («Nombra consejeros,
pero no es el consejo») atribuye a la autoridad lo que el escenario atribuye al Gobierno. Además el board tienta poco: nadie confunde a un
regulador externo con el consejo. **Arreglo:** un solo sujeto: «Una autoridad pública nombra a dos consejeros de una empresa de aguas, le
exige un plan aprobado y puede quitarle la licencia»; ver además C-1, que pide cambiar el sector y los rasgos.

**A-4.** `fichas/V42-sp5m5.md:130-158` (`q` `:140`) · regla 4 · media. «¿Qué actividad le toca hacer **ahora**?»: leer la prensa ya es vendor
monitoring; lo que toca ahora es reevaluar, que no está entre las opciones, y `fcp520` (`sp/sp5-cards.ts:33`) dice que la due diligence se
repite al renovar. **Arreglo:** «¿En qué fase de la gestión del proveedor está esto?» o una opción A «Vendor monitoring: reevaluar al
proveedor»; y hacer obligatoria (no solo propuesta) la corrección de `fcp520` de la duda 2 (`:293-295`).

**A-5.** `fichas/V43-sp5m6.md:201`, `:207-208`, `:210` · regla 4 · media. La tarjeta «Retention: guarda lo que obliga, no por si acaso», la
regla 3 del cierre («guardar lo que obliga y borrar lo que sobra») y la frase final («guarda solo lo que te obligan, el tiempo que te
obligan») dicen que solo se guarda lo que exige la ley. La lección dice «ni menos de lo que la ley obliga, ni más de lo que el propósito
justifica» (`sp/sp5-part3.ts:372`), y el propio `why` de la P3 habla del propósito; los datos de objetos perdidos de s06 se guardan por
uso, no por ley. **Arreglo:** «Retention: lo que pide la ley o el uso, nada más» (≤ 48) y en la frase «guarda lo que necesitas, el tiempo que
lo necesitas».

**A-6.** `fichas/V44-sp5m8.md:111`, `:114` · regla 4 · baja. El `scenario` de pantalla no dice por qué instala la extensión («para no
esperar al técnico» solo está en la voz), y el `why` dice «para ir más rápido». Quien lee el VTT no lo tiene. **Arreglo:** «Para no
esperar, un empleado instala una extensión de conversión; acepta el aviso de que no está aprobada. Subía cada documento fuera, y él no lo
sabía.» (152).

**A-7.** `fichas/V40-sp5m1.md:172`, `fichas/V44-sp5m8.md:173` · regla 4 (trampa real) · baja. En V40 P3 las opciones A y B llevan su
justificación tras los dos puntos, y la B se elige leyendo; en V44 P3 la clave es la opción más larga (56 frente a ≤ 46) y la única con
«su riesgo». **Arreglo:** opciones desnudas en V40 («Esperar a la revisión de enero» / «Revisarla ahora») y acortar la D de V44 («Formar
a Finanzas en verificar pagos»).

**A-8.** `fichas/V39-sp5m7.md:113` · regla 4 (exactitud del chip) · baja. El chip «management attestation» va sobre la firma **del consejo**;
la lección la define como la de **la dirección** ante el consejo o el regulador (`sp/sp5-part4.ts:27`). **Arreglo:** que firme la dirección
y el consejo la presente, o quitar el chip.

## B. Banco (quiz, checks, colocación, flashcards y labs)

Se leyeron todos los ítems: los 43 del quiz de las seis lecciones, sus 19 checks, las 12 de `placement-sp5.ts`, `fcp501`–`fcp532` y los
24 ítems de spl5a y spl5b. No hay copias literales. Son espejos aceptables (otra clave o la trampa invertida): V39 P2 frente al check
`sp/sp5-part4.ts:91-105`; V41 P1 frente a `pl-sp5q2`; V42 P1 frente a q4; V42 P2 y P3 frente a q3 y q7 de sp5m5; V43 P2 frente al check
`sp/sp5-part3.ts:324-338`; V44 P1 frente a q6 de sp5m8 (misma pareja, otro mecanismo). Los que rozan:

**B-1.** `fichas/V41-sp5m2.md:133` · regla 5 · media. El escenario da al custodian el mismo trío que la q4 del banco («Applying the
encryption, backups and access permissions», `sp/sp5-part1.ts:447`) y que la q1 (`:398`), y la nota de examen lo convierte en regla («si
habla de cifrado, permisos o copias, es custodian», `:345`). Es q4 al revés. **Arreglo:** usar tareas del custodian que el banco no lista:
«restaura copias, aplica parches y revisa los registros de la base de datos del padrón según lo que decide la responsable» (`:293`).

**B-2.** `fichas/V43-sp5m6.md:98-125` · regla 5 · media. Es sp5m6q1 (`sp/sp5-part3.ts:402-415`) en negativo: misma clave (due care), misma
trampa (due diligence), tres de las cuatro opciones del mismo grupo y las mismas rutinas (revisar accesos, formar). **Arreglo:** que lo que
falta sean rutinas que q1 no usa: «no se borra lo que caduca, nadie comprueba que los datos se usan solo para lo que se dijo y nadie vuelve
a mirar a quién se mandan».

**B-3.** `fichas/V39-sp5m7.md:251-278` · regla 5 · media. El marco es el del check `sp/sp5-part4.ts:163-177`: «antes de empezar» (≈ «Before
any scanning begins»), un equipo de pruebas, fuente pública, pasivo con el activo de trampa. Lo nuevo (puertos y versiones) llega en la
segunda frase. **Arreglo:** ponerlo **dentro** de la ventana pactada («Ya dentro de la ventana, el equipo consulta un buscador de aparatos
expuestos…»): se separa del check y la trampa activa tienta más, porque en la ventana el activo está permitido.

**B-4.** `fichas/V40-sp5m1.md:100-107` · regla 5 (espíritu) · media. El escenario («un documento del equipo de sistemas… Si viajas, te
recomendamos cifrar el disco del portátil») es el ejemplo resuelto del callout: «“Consejos para viajar con portátil”, redactado por el equipo
de sistemas: **guideline**» (`sp/sp5-part1.ts:129`), que va justo antes del vídeo. El callout no es banco según §9.4, pero la respuesta está
literal dos líneas antes. **Arreglo:** otro autor y otro tema: «Una guía de Comunicación para la web recomienda TLS 1.3 con AES-256; nadie lo
ha hecho obligatorio».

**B-5.** `fichas/V40-sp5m1.md:161-186` · regla 5 (flashcard con opciones) · baja. P3 es casi `fcp504` («a triggered review after… a new
regulation», `sp/sp5-cards.ts:9`) con cuatro opciones. Se salva por la trampa del ciclo; si se toca A-7, que la opción correcta no repita la
frase de la flashcard.

## C. Coherencia entre las seis

**C-1.** `fichas/V39-sp5m7.md:141` y `fichas/V41-sp5m2.md:165` · regla 8 (imágenes y escenarios vecinos) · media. Casi el mismo escenario
con claves distintas: «llega a una eléctrica la autoridad que le dio la licencia… puede acabar en multa o sin licencia» (regulatory
examination) y «una empresa de aguas… una autoridad pública le exige un plan, la inspecciona y puede quitarle la licencia» (government
entity). Las dos son empresas de suministro, con inspección y licencia. Ninguna ficha lo declara. **Arreglo:** en V41 P3 otro sector
(transporte por carretera, una universidad pública) y otros rasgos: que nombre consejeros y fije requisitos, sin «inspecciona» ni
«licencia».

**C-2.** `fichas/V39-sp5m7.md:101`, `fichas/V41-sp5m2.md:76`, `fichas/V43-sp5m6.md:78` · regla 8 · media. Tres imágenes con «una autoridad
que cierra o precinta un sitio», para tres conceptos distintos: el ascensor que Industria precinta (regulatory examination), el local del
club que el ayuntamiento puede cerrar (government entity) y la peluquería a la que Sanidad cierra el local (loss of license). Seguidas en
el curso, se confunden entre sí. **Arreglo:** quedarse con la de V39; en V41 el ayuntamiento «da la licencia del local y fija sus normas»,
sin cerrar; en V43 «le retiran la licencia de apertura» en vez de «le cierra el local» (además, un cierre ordenado por Sanidad se lee como
sanción, no como pérdida de licencia).

**C-3.** Todas las fichas · regla 4 (trampa real) · media. La trampa es la **A** en **14 de 20** preguntas (V39: cuatro de cinco) y la
respuesta correcta es la A solo en 2 de 20 (V42 P2, V44 P2). Quien vea la tanda aprende «la A nunca». **Arreglo:** barajar letras: ≈ 5 por
letra en las claves y la trampa repartida, y nunca la misma letra de trampa en tres preguntas seguidas.

**C-4.** `fichas/V42-sp5m5.md:201` y `fichas/V43-sp5m6.md:197` · regla 8 (tarjetas duplicadas) · baja. «Due diligence antes; monitoring
después» y «Due diligence antes; due care, siempre después», en lecciones seguidas y con la due diligence de trampa en las dos (V42 P2, V43
P1, declarado). No se contradicen (el monitoring es due care con un proveedor), pero tienen la misma forma. **Arreglo:** que V43 diga lo que
la distingue: «Haberlo mirado bien no te exime de cuidarlo».

**C-5.** `fichas/V41-sp5m2.md:76`, `:133`, `:180`; `fichas/V44-sp5m8.md:81` · regla 8 · baja. «El ayuntamiento» tiene tres papeles:
controller en V41 P2 (el padrón), government entity en la imagen del club de V41 (escena siguiente) y destinatario del aviso en la farola de
V44. **Arreglo:** en V41 P2, otra organización («una mutua», «una universidad»).

**C-6.** `fichas/V39-sp5m7.md:358` · baja. «La cuarta acta… (quinta contando las de V25 y V26: dos y dos)» se contradice: V25 y V26 suman
cuatro (`reg:362-365`), así que la de V39 es la quinta, como dice `:301`. **Arreglo:** «La quinta acta en pantalla».

**C-7.** `fichas/V39-sp5m7.md:115` · baja. La plaquita se describe como «SY0-701 · 5.5»; las cápsulas y el motor dicen «EXAMEN · SY0-701 ·
5.x» (`video/engine/src/overlay/ExamQuestionLayer.tsx:280`). **Arreglo:** unificar el texto de la ficha.

**C-8.** `fichas/V41-sp5m2.md:82`, `:227` · baja. V41 sella «caso de ejemplo · sin fecha» y a la vez fija canon (la jefa de la terminal de
pasajeros, Atención al Pasajero, la empresa de avisos); las otras cinco sellan «propuesta · sin fecha». **Arreglo:** «propuesta · sin fecha»
o «lista de pasajeros · sin fecha».

**C-9.** `fichas/V44-sp5m8.md:89`; `docs/superpowers/plans/fichas-tanda7/V35-sp2m1.md:103` · baja. «Imagina una semana · caso de ejemplo · sin fecha» + «tres
caras» es el mismo recurso de V35 s06, con otra tríada de categorías. **Arreglo:** variar el marco en V44 («Tres avisos que llegan a
Seguridad», «imagina»).

**C-10.** Repeticiones dentro de la tanda que no molestan pero conviene saber: tres escenarios sanitarios (V40 P2, V41 P1, V42 P3); dos
imágenes «del barrio» (club, peluquería); Compras sale con un conflicto de intereses (V42 s04) y con una cuenta que abre nóminas ajenas
(V44 s02). Baja; no hace falta cambiar nada si las demás se tocan.

**PAPER GOVERNOR:** solo en V39, en s05, capítulo II, sin pregunta en la escena, con «Y vuelve» y la frase de V25/V26 (`reg:947-948`,
`:990`), forma «Se acuerda: … Queda en acta.», impersonal, 67 caracteres y sin marca de género. Cumple la regla 2. Las otras cinco la
descartan con razones coherentes con el orden del curso.

## D. Canon

No hay choques con fechas, sistemas con nombre, el caso de septiembre ni los dosieres de RED MARROW, BLIND ARCHITECT o PAPER GOVERNOR.
Ninguna ficha fecha nada. Matices:

**D-1.** `fichas/V39-sp5m7.md:300` · regla 1 · baja. El acta dice «auditoría superada», pero V39 fija que la auditoría está solo
«encargada», «sin resultado y sin informe» (`:353`). Leída en pantalla, da por aprobada una auditoría del puerto. **Arreglo:** «Se
acuerda: si pasamos la auditoría, no entra nadie. Queda en acta.» (67).

**D-2.** `fichas/V44-sp5m8.md:93` · baja. «Sistemas · no aprobar un MFA que no has pedido» supone un MFA con aviso en el puerto; el registro
solo tiene el segundo factor del IdP en futuro (30-11, `reg:123`, `:199`). V44 no tiene fecha, pero un vídeo de propuesta no debería
enseñarlo en marcha. **Arreglo:** «credenciales · peticiones de acceso que no has pedido».

**D-3.** `fichas/V43-sp5m6.md:48-51` · baja. El vídeo va justo después del callout que cuenta una multa real al puerto por la filtración de
listas de tripulación (`sp/sp5-part3.ts:389-394`), y el vídeo dice que todas las consecuencias son «imagina». No es un choque, pero
seguidos parecen dos versiones del puerto. **Arreglo:** que la línea de entrada diga «otro caso del puerto, sin incidentes».

**D-4.** `fichas/V41-sp5m2.md:85`, `:232-233` · regla 3 · baja. Un tercero recibe la lista de pasajeros y la ficha precisa que en pantalla no
hay contrato, lo que queda a un paso del «proveedor sin contrato» del anuncio (`sp/sections.ts:123`). **Arreglo:** un chip «por encargo
del puerto, con sus instrucciones» (sin decir «contrato» ni «proveedor») en s04.

**D-5.** Vecinas de imágenes ocupadas sin declarar, menores: «un edificio de oficinas» como blanco del physical de V39 s07 (`:118`) y «el
edificio de oficinas» de V16 (`reg:1134`); «la ventanilla» de objetos perdidos de V43 s02 (`:86`) y «la ventanilla de navieras» de V16
(`reg:1134`, descartada por V26 por ocupada); «la web nueva» del chip de V39 s09 (`:120`) y la web de citas aún sin publicar de V19
(`reg:201`). Baja: basta «una oficina», «el mostrador» y «una aplicación nueva».

**D-6.** `fichas/V41-sp5m2.md:87`, `:225` · baja. s06 dice que el comité de seguridad de la información «se reúne cada mes», pero «Canon que
usa» dice «sin día de reunión» y no lo apunta como canon nuevo. **Arreglo:** apuntarlo en «Canon nuevo» o quitar la cadencia.

**D-7.** `fichas/V39-sp5m7.md:101` · regla 4 (exactitud de la imagen) · media. En España la inspección periódica del ascensor la hace un
organismo de control que **contrata la comunidad**, y es ese organismo el que puede pararlo si encuentra un defecto grave; la imagen
enseña al revés quién puede precintar, que es justo el rasgo que separa la regulatory examination de la de terceros. **Arreglo:** que la
sanción venga de un expediente («Industria abre un expediente y puede multar a la comunidad») o cambiar de imagen (resuelve también C-2).

## E. Citas

Se comprobaron unas 120 citas `ruta:línea` y `reg:NNN` (todas las de lección, quiz, checks, colocación, flashcards y labs de las seis
fichas, y las de `reg` de §1, §3, §4, §5 y §6, más `content.test.ts:318-323`, `profiles.mjs:92-107`, `narration.mjs:23-28` y la línea 143 de
la narración de V28). Están bien salvo estas:

| Ficha | Cita | Qué hay | Debe ser |
|---|---|---|---|
| `V44-sp5m8.md:241` | `reg:149` (Lucía) | la fila de separación de la tabla | `reg:150` |
| `V44-sp5m8.md:242` | `reg:401-402` (no se culpa a nadie) | el final del párrafo de PAPER GOVERNOR (el EDR gestionado) | `reg:403-404` |
| `V42-sp5m5.md:247` | `reg:1003` (sistema de atraques) | una línea en blanco | `reg:995-996` o `reg:214` |
| `V39-sp5m7.md:369` | `reg:54` (sala de control del muelle 3) | la macro y `OPS-WS-14` | `reg:53` |
| `V40-sp5m1.md:221` | `reg:286` (áreas) | la fila de mejoras de V5 | `reg:166` |

Además, `V40-sp5m1.md:57` dice que bajan «las de la ficha de V41 (`:250-499`)»; V41 cita desde `:245`: debe ser `:245-499`. Y las cápsulas
citan `narration.mjs:23-28` para el perfil `caso-yt`; esas líneas son los límites de pantalla de la pregunta (bien para eso); el perfil está
en `profiles.mjs:76-91`.

## F. Recuentos (Node, `[...texto].length`)

Todo cuadra con lo que dicen las fichas:
- `scenario`, `q`, las 80 opciones, `why`, `trapWhy` y las 33 tarjetas: el número de cada fila coincide con el real, y todos están dentro de
  los límites (escenario máx. 154, `q` máx. 57, opción máx. 56, `why`/`trapWhy` máx. 77, tarjeta máx. **48**: la de retention de V43, en el
  límite justo).
- Sumas de escenas: V39 480 (13 escenas), V40 266, V41 270, V42 270, V43 270, V44 272. Los `wordBudget` por escena, sus totales (1.296 · 719
  · 729 · 729 · 729 · 735), los de las escenas de pregunta (`s` − 8) × 2,7 y las palabras leídas de escenario y pregunta coinciden.
- La razón 1,024 de V28 se confirma: 7.925 fotogramas a 30 fps = 264,2 s, para una suma de `targetSec` de 258 s
  (`video-controles-halden/video/controles-halden/src/timeline.json` y `storyboard.json`). Las estimaciones por tipo de escena también
  cuadran (V39 ≈ 497 s; cápsulas 276–283 s).
- Acta de V39: 67 (≤ 70). Línea de «MEJOR»: 58. Títulos de bloque 40 · 46 · 43 · 49 · 45 · 47; de YouTube 76 · 70 · 85 · 89 · 78 · 69.
- 0 think prompts; mensajes interceptados 1 (V39) y 0; ninguna pregunta en la última escena ni en la del acta; ninguna tarjeta en s01 ni en
  el cierre, y como mucho una por escena.

## G. Naturalidad

**G-1.** `fichas/V44-sp5m8.md:144` · baja. «Un botón de reportar» es calco; el resto del vídeo dice «avisar». **Arreglo:** «Un botón para
avisar en el propio correo».

**G-2.** `fichas/V39-sp5m7.md:171`, `:230`, `:297` · baja. «Ella le manda su último pentest» (el «ella» por la empresa suena raro): «La
empresa le manda…». «ni admin» en pantalla: «ni cuenta de administración» si cabe, o «ni acceso total». La tarjeta «Si se mide si lo ves,
es defensive» tropieza con los dos «si»: «Si se mide a quien defiende: defensive».

**G-3.** `fichas/V41-sp5m2.md:133`, `:199`, `:208` · baja. «Un administrador de la plantilla de un ayuntamiento» se lee mal: «Un
administrador de sistemas de una mutua…». La tarjeta «De la casa y aplicando controles: custodian» es torpe: «Aplica controles y es de la
casa: custodian». La frase final es larga: «Pregunta quién decide: saber más o hacer el trabajo no te da la decisión».

**G-4.** Todas las fichas · baja. Muletillas que pueden pasar al guion: «lo que decide es…» y «el calificador lo reconoce» abren casi todas
las resoluciones de las seis; «en miniatura» en casi todas las escenas; y la glosa de «MEJOR» de V28 se repite entera en los seis vídeos
(normal, porque cada vídeo se entiende solo, pero conviene variar la frase de la voz).

**G-5.** `fichas/V40-sp5m1.md:170` · baja. «La política de privacidad» se entiende como el aviso público de una web, no como documento de
gobierno. **Arreglo:** «La política de protección de datos de una empresa…».

**Sin «Gana …»** en la voz de ninguna ficha (regla 6): las cuatro apariciones de «gana» son del análisis de la ficha, no del guion.

---

## Qué se ha aplicado (2026-10-17, tras la revisión)

Aplicado en las fichas, con la referencia `rev8` y el código del hallazgo donde cambia una decisión:

- **A-1 (alta):** V39, pregunta 3, reescrita: un banco reproduce técnicas de ataque conocidas, sin nadie que persiga un objetivo, y solo
  mide a su SOC. La trampa sigue siendo el red team; su `trapWhy` cambia. La duda de exactitud 1 de V39 lo recoge.
- **A-2 y B-4:** V40, pregunta 1, con otro autor y otro tema (una guía del equipo de desarrollo que recomienda TLS 1.3). La corrección de la
  explicación del check `sp/sp5-part1.ts:41` y de `fcp501` (añadir «mandatory») pasa de propuesta a **condición** del PR del vídeo.
- **A-3 y C-1:** V41, pregunta 3, con un solo sujeto, otro sector y sin inspección ni licencia (una autoridad pública que nombra a dos
  consejeros de una universidad pública y le fija requisitos).
- **A-4:** V42, pregunta 2, ahora pregunta «¿Dentro de qué actividad le toca reevaluarlo ahora?»; la corrección de `fcp520` pasa a ser
  condición del PR del vídeo.
- **A-5 y C-4:** V43, la tarjeta de retention («Retention: lo que pide la ley o el uso, nada más»), la regla 3 del cierre, la frase final y
  el archivador incluyen el uso, no solo la ley; la tarjeta de s02 pasa a «Haberlo mirado bien no te exime de cuidarlo».
- **A-6, A-7, G-1, G-5:** V44 con el porqué en pantalla y la opción «Un botón para avisar en el propio correo»; V40 P3 con opciones
  desnudas y «política de protección de datos»; V44 P3 con la clave acortada.
- **A-8:** en V39 firma la dirección (management attestation) y el consejo pregunta.
- **B-1, B-2, B-3:** V41 P2 con otras tareas del custodian (restaurar, parchear, revisar registros) y en una mutua de salud (resuelve
  también C-5); V43 P1 con otras rutinas (borrar lo que caduca, corregir lo hallado); V39 P5 dentro de la ventana pactada.
- **C-2 y D-7:** el ascensor de V39 ya no precinta: Industria «abre un expediente y puede multar», y el organismo de control lo contrata la
  comunidad. El club de V41 «da la licencia y fija sus normas», sin cerrar; la peluquería de V43 pierde «la licencia de apertura».
- **C-3:** letras barajadas en las 20 preguntas: claves A 6 · B 4 · C 5 · D 5; trampas A 3 · B 5 · C 6 · D 6, sin la misma letra de
  trampa tres veces seguidas. Cada ficha lo dice en su «Comprobación de límites».
- **C-6, C-7, C-8, C-9, D-1, D-2, D-3, D-4, D-5, D-6:** quinta acta; plaquita «EXAMEN · SY0-701 · 5.5»; V41 sella «propuesta»; V44 abre con
  «Tres avisos que llegan a Seguridad»; acta «Se acuerda: si pasamos la auditoría, no entra nadie. Queda en acta.» (67); V44 sin MFA; la
  línea de entrada de V43 dice «otro caso del puerto, este sin incidentes»; chip «por encargo del puerto, con sus instrucciones» en V41;
  «una oficina», «el mostrador» y «la aplicación nueva»; sin cadencia de reunión del comité.
- **E:** las cinco citas corregidas (`reg:150`, `reg:403-404`, `reg:995-996`, `reg:53`, `reg:166`), `:245-499` en V40, y las cápsulas citan
  ahora `profiles.mjs:76-91` para el perfil y `narration.mjs:23-28` para los límites de texto.
- **G-2, G-3:** «La empresa le manda…», «ni acceso total», «Si se mide a quien defiende: defensive», «Aplica controles y es de la casa:
  custodian» y «Pregunta quién decide: saber más o hacer el trabajo no te da la decisión».

No aplicado, a propósito:
- **G-4 (muletillas de las fichas):** «lo que decide es…», «el calificador lo reconoce» y «en miniatura» son lenguaje de ficha, no de guion.
  Queda como aviso para quien escriba los guiones y para el revisor de naturalidad: variar la entrada de cada resolución y no repetir
  entera en la voz la glosa de «MEJOR» de V28 en vídeos seguidos.
- **C-10:** las repeticiones menores (tres escenarios sanitarios, dos imágenes «de barrio», Compras en dos fichas) se quedan; tras los
  cambios ya no hay dos papeles contradictorios para la misma área ni para el ayuntamiento dentro de una ficha.

Recuentos rehechos con Python tras los cambios (caracteres de `scenario`, `q`, opciones, `why` y `trapWhy`, letras de clave y trampa en tabla
y viñetas, palabras leídas): todos coinciden con lo que dice cada ficha.
