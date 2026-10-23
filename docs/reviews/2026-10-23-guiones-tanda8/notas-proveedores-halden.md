# V42 · proveedores-halden · notas del guion (sp5m5, `caso-yt`)

Guion escrito sobre la ficha `docs/superpowers/plans/fichas-tanda8/V42-sp5m5.md` (aprobada el 2026-10-17). Sin `frozen`: lo pone quien
coordina tras las revisiones de exactitud y de naturalidad. Sin escenas: no hay `src/` ni `src/timeline.json`.

## Cifras

- `build-timeline --estimate`: **0 errores, 3 avisos** (ver abajo). Suma de `targetSec` de las escenas: 270 s.
- Palabras: **705** habladas (incluye lo que leen las tres preguntas), repartidas 48 · 115 · 94 · 115 · 78 · 109 · 81 · 65 (escenas s01 a s08).
  `wordBudget` del storyboard, con las escenas de pregunta a (`s` − 8) × 2,7 como en V28: 54 · 108 · 86 · 108 · 76 · 103 · 76 · 54 = 665.
  Se pasa un 6 % (V47 pasó un 9 %, V45 un 11 %). La ficha daba 729 con las preguntas a `s` × 2,7; aquí manda la fórmula del plan §1.
- Duración estimada por el motor: **321,5 s (5:21)**. Con las razones medidas en V28 (0,887) y V45 (0,86): **unos 276–286 s (4:36–4:46)** ya
  grabado, frente al objetivo de ~4:40 y la ventana 240–330 s del perfil. Margen de 44 s por abajo y 44 por arriba. No se ha rellenado ni
  hizo falta el alargue de la ficha (la salida del proveedor, `:141`).
- 5 tarjetas de examen (una por escena como mucho; ninguna en s01, s05 ni s08; las de pregunta, después de la trampa), 3 preguntas, 0 think
  prompts, 0 mensajes interceptados. Título (`title`) dentro de los 12 s, sin aviso.
- Letras: claves C · D · B; trampas A · C · D. Calificador «MEJOR»: s03 (lo explica la voz) y s07 (solo resaltado); s05 sin calificador.

## Avisos que quedan

Los tres son el segmento de la voz que lee escenario y pregunta (`s03-01` 54 palabras, `s05-01` 44, `s07-01` 46): el diseño §4.3 pide que
la voz lea el caso y la pregunta sin las opciones, y V28, V45 y V47 llevan el mismo aviso por lo mismo. No se parten: el corte entre
escenario y pregunta no deja respirar la cuenta atrás. Frases sueltas de más de 22 palabras: ninguna. Colones de conector, `;` y
sigla/identificador sin léxico: ninguno. `canon-check`: 0 coincidencias, 0 nuevas (el guion no dice equipo, cuenta, IP, dominio, hash,
caso ni hora).

## Desviaciones de la ficha (para el revisor)

1. **`youtubeTitle`.** El motor exige `^[^|\n]{5,80}$` y añade solo « | Security+ SY0-701 en español» (`youtube-meta.mjs:36-38`). La
   ficha pide «Riesgo de terceros: vendor assessment, SLA, MSA, SOW y NDA | CompTIA Security+ en español» (89), que no cabe en el campo.
   `video.json` lleva «Riesgo de terceros: vendor assessment, SLA, MSA, SOW y NDA» (58); el título final sale de 89 caracteres sin
   «CompTIA». Si se quiere «CompTIA» en el título de YouTube, hay que tocar el motor o editarlo a mano en Studio.
2. **Pregunta 2, texto de pantalla.** «han comprado a su proveedor de correo y que **van** a mover los datos» (la ficha decía «va»: el
   sujeto de «va» quedaba ambiguo entre el proveedor y quien lo compra). 119 caracteres. La voz usa la misma forma impersonal.
3. **«SLA» no se dice en s04.** La ficha lo pone en el chip de monitoring; en la voz es «las métricas del servicio», porque el SLA no se
   explica hasta s06 (regla «primero la idea, luego el nombre»). El chip de pantalla puede seguir diciendo SLA.
4. **«Compras» en s04.** La voz dice «quien evalúa en Compras» (canon nuevo de la ficha: «alguien de Compras, sin nombre ni género»);
   sin esa palabra el conflict of interest no tenía área.
5. **Siglas del léxico.** `lexicon.json` lleva una pronunciación provisional en letras españolas (SLA «ese ele a», MSA «eme ese a», SOW
   «ese o uve doble», NDA «ene de a», MOU «eme o u», MOA «eme o a», BPA «be pe a») solo para que el validador no avise; la define la
   primera toma de Lidia y entonces se reescribe. No hay `lexicon.chatterbox.json` (la voz es la grabación de Lidia) ni campo
   `"lexicon"` en `narration.json`.
6. **Música.** `video.json` no lleva `"music"`: «a elegir al montar», otra que la de V28 y las demás de la tanda (plan §8, paso 7).
7. **La guardería, repartida.** El folleto sale en s02 (cue `nursery`, al acabar la frase del cuestionario, donde cae la tarjeta 1); el
   informe propio de la guardería vuelve en s03 (`nursery-back`, tarjeta 2); en s04 la guardería es una sola línea al final
   (`nursery-2`: la visitas antes, la miras cada día, si cambia de dueños vuelves a preguntar), con la tarjeta 3. La visita de antes
   y la mirada de cada día comparten la línea para no pasar de presupuesto; la ficha las ponía en dos momentos.
8. **Orden de los cues.** `requiredCues` de s02 sigue el orden en que se dicen (`nursery` justo tras `questionnaire`, no al final como en
   la ficha). Las tarjetas de s03, s04 y s07 van sobre la última frase de la escena, con `pauseAfterMs` 1200 (como V28); en s07 hubo que
   alargar esa frase (el «Eso es un MOA» final) porque una tarjeta de 5 s no cabía tras una frase de seis palabras.

## Decisiones de redacción

- **s01.** Una sola frase presenta el problema (el trabajo se va, la responsabilidad no) sin decir todavía «agencia de traducción»; el caso
  entra en s02. «Externalizar no externaliza la responsabilidad» es tarjeta de V41: aquí, solo en voz y sin tarjeta.
- **s02.** Cuestionario, evidence of internal audits e independent assessment, cada uno con la idea antes del nombre; la guardería solo en
  el folleto. SOC 2 Type II e ISO 27001 quedan solo en pantalla. La right-to-audit clause y la supply chain analysis son una frase de
  dos cosas más (la frase de la supply chain es lo primero que se recorta si pasara de 325 s, ficha).
- **s03/s05/s07.** La voz lee escenario y pregunta, nunca las opciones; después de la revelación nombra la correcta y la trampa. Ningún
  «Gana …». La glosa de «MEJOR» es la de V28 con palabras propias («Pide la que más encaja con este caso, aunque otra suene bien»).
  La pregunta 2 pregunta por la actividad («¿Dentro de qué actividad le toca reevaluarlo ahora?», `rev8` A-4).
- **s04.** Antes: la due diligence como investigar a la agencia (cuentas, dueño, brechas; las certificaciones y referencias, en pantalla) y
  el momento de pedir lo que luego querrás (auditar, avisar de un incidente, borrar los datos). Conflict of interest en una frase. Después:
  vendor monitoring con sus rutinas. La «reevaluación al renovar» queda en pantalla, para no chocar con `fcp520` (ver abajo).
- **s06.** Los cuatro papeles en el orden en que se firman. La tarjeta 4 cae al acabar la frase del SOW (ya dicho el MSA). El chip de MOU,
  MOA y BPA se dice en una frase; es lo primero que se recorta si pasara de 325 s (queda la pregunta 3, que enseña MOA y MOU).
- **s08.** Tres reglas y la frase de la ficha; una sola tarea, el quiz de la lección. Las siglas no se enumeran en la voz (van en el
  icono de la regla 3).

## Se queda fuera (sigue en la lección)

El penetration testing del proveedor y las rules of engagement (`:27`, `:141`, q6; las nombra V39); el callout del puerto y sus cuatro
proveedores (`:143-148`) y los de la introducción (`:22`); la salida del proveedor (revocar accesos, recuperar y probar el borrado,
`:141`, `pl-sp5q7`), que era solo el alargue de s04; el detalle de SOC 2 e ISO 27001; el cuestionario «barato, sirve para cribar»
(solo «lo dice ella»); el NDA como pregunta (spl5b ya la hace). Nada de PAPER GOVERNOR, de RED MARROW, de GLASS HARBOR ni del caso de
septiembre; la agencia no entra en ningún sistema y nadie dice «sin due diligence» ni «sin contrato» de un proveedor del puerto.

## Dudas de exactitud y condiciones del PR (las comprueba el revisor)

1. **MOA frente a MOU (pregunta 3).** Sigue en pie la duda 1 de la ficha: el 5.3 solo da las siglas; la lección (`:67`) y `fcp522` dicen
   que el MOA reparte obligaciones. Si el revisor ve dos respuestas, fallback de la ficha: «¿qué tiene este documento que no tendría un
   MOU?», o el SLA frente al MSA.
2. **`fcp520` (condición del PR, `rev8` A-4).** El guion no dice que la due diligence se repita al renovar; la tarjeta `fcp520`
   (`sp/sp5-cards.ts:33`) hay que cambiarla a «re-checked at renewal as part of vendor monitoring» en el mismo PR, y avisarlo en la
   descripción. No lo he tocado (solo guion).
3. **s02, «sin vínculo con ella»** define lo independiente; si el revisor quiere más precisión («un tercero sin vínculo con el proveedor»,
   `:27`), cabe en la misma frase.
4. **Pregunta 1, s03:** «las hace el propio proveedor» (voz) frente a «lo hace el propio proveedor» (`why` en pantalla): una es el plural
   del término (audits), la otra el informe. No contradice nada.
5. **Inserción en la lección** (sin hacer): bloque y línea de entrada después de `sp/sp5-part3.ts:148` (ficha, «Inserción»); la suite
   `lesson videos` de `content.test.ts` lleva su `toBe('sp5m5')`; el canon nuevo (agencia de traducción, conflicto de intereses declarado,
   papeles previstos, guardería y los tres escenarios de las preguntas) va al registro al cerrar el vídeo.

## Incidencia del proceso

Al contrastar con los ejemplos ejecuté `build-timeline --estimate` también sobre `controles-halden`, `nube-halden` y `ot-halden`, que
reescribió sus `src/timeline.json`, transcripciones y subtítulos tracked. Los restauré con `git checkout -- <esos nueve archivos>`; el
árbol quedó como estaba. Además, un commit ajeno («wip(video): tanda 8-9 scripts in progress») recogió una versión intermedia de mis
archivos, con `src/timeline.json` y `public/videos/proveedores-halden-*` generados; los he borrado (aparecen como `D`).

## Revisión 2026-10-23

Informe: `docs/reviews/2026-10-23-guiones-tanda8/proveedores-halden.md`. Estimación final tras aplicarlo: **711 palabras, 323,9 s (5:24)**
(`build-timeline --check --estimate`: 0 errores; la ventana `caso-yt` es 240-330 s). Avisos que quedan: los tres esperados de los segmentos de
pregunta (`s03-01` 52, `s05-01` 46, `s07-01` 50 palabras). `canon-check`: 0 coincidencias. Sin `frozen`; no se han tocado lecciones, tarjetas ni canon.

**Aplicados.** A-1 (voz de `s07-01`: «se obliga… y puede exigírselo al otro»; escenario de pantalla con «se obliga a unas fechas exigibles»; `trapWhy`
«obligaciones exigibles»; «Sin dinero ni negocio» se conserva), A-2 (voz, escenario, `why` de `s05-01` y voz de `s05-02` con «otra compañía… cambiará de
subcontratas»; opciones sin tocar), A-3 («finanzas» en voz y rótulo), A-4 (`s03-02`, tarjeta 2, `s08-01` + `rule-1`, `s08-04` + `phrase`), B-1 («empresa
auditora», «Firmar el contrato parte la historia en dos», título de s03 «Un informe muy serio»), B-2 (anclas «memorando de entendimiento / de acuerdo» en
`s06-05` y `s07-02`), B-3 (`s04-04` sin lista leída ni «cada año»; rótulos «cuestionarios periódicos» y «métricas del servicio (SLA)»).
Opcionales aplicados (neutros o restan palabras): A-7 (nota en la escena s06: no dibujar paraguas), B-5 («documentos de las navieras»; «instrucciones de
embarque» en vez de «folleto de pasajeros», voz y pantalla; s06-04 con «Las traducciones urgentes… Y si no llegan, descuento»), B-6 (tarjeta s03-01 «con
metodología y firma»; fuera «Dos cosas más», «Por ejemplo,» y «ni un documento de prueba»), B-7 (`s06-01` «se firma la confidencialidad. Eso es un NDA.»;
gancho de `s01-02` «Verás cuánto vale cada prueba de un proveedor, qué se hace antes y después de firmar…», y sus chips).

**Recortes para entrar en 330 s.** Con todo lo anterior la estimación subió a 339,9 s (751 palabras). Siguiendo el orden de la ficha: (1) la frase de la supply
chain analysis sale de la voz de `s02-05` (el chip se queda solo en pantalla); (2) en `s06-05` sale el BPA de la voz (queda en el chip y en las opciones de la
pregunta 3; se elimina de `lexicon.json` porque el validador avisaba de entrada sin uso) y «tres papeles» pasa a «otros papeles»; además se quitan «Te toca.»
de `s03-01`, la frase «Y si cambia de dueños, vuelves a preguntar» de `s04-05` y la lista de rutinas de `s04-04` (queda «Se repiten los cuestionarios, se mide el
servicio y se vigilan los cambios de dueño o de subcontratas»), y `s08-04` pierde «Y ahora» («Te toca a ti»). `s01-02` queda en 21 palabras.

**No aplicados.** A-6 (cambiar «Rules of engagement» por «Penetration testing»: la pregunta ya es válida y la ficha fija esa resolución; duda -> no). A-8 (solo
cruces informativos; decisión de V41/V42 al congelar). B-4 (`s04-02`, `s04-03`: cuestan palabras en una escena ya sobre presupuesto). B-6: «Es la guardería otra
vez» (s03-03) y «Pero la due diligence va antes de firmar» (s05-03) cuestan +2 palabras cada uno; «Como la guardería» se repite en s03-03 y s04-05, anotado.

**Dudas del autor (decisiones del informe).** 1 MOA/MOU: se mantiene la pregunta, endurecida (A-1), sin fallback al SLA/MSA. 2 `fcp520`: guion correcto, la condición
del PR se mantiene. 3 «sin vínculo con ella»: suficiente. 4 «las hace» / «lo hace»: sin cambio. 5 inserción en la lección: correcta.

**Pendiente fuera del guion (no hecho).** A-5: en el PR, cambiar `fcp520` (`src/data/secplus/sp5-cards.ts:33`) a «…subcontractors and history checked before signing, and
re-checked at renewal as part of vendor monitoring.» y avisarlo en la descripción del PR. Resto de condiciones de la ficha (bloque y línea de entrada en `sp5-part3.ts`
tras `:148`, `toBe('sp5m5')` en `content.test.ts`, canon nuevo al registro al cerrar el vídeo) siguen como estaban. Tras la grabación: la pronunciación de MOU/MOA
en `lexicon.json` y el peso del «uve/a» final (B-2, alternativa).
