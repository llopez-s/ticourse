# Segunda pasada · V42 `proveedores-halden` (sp5m5, `caso-yt`)

Revisión del 2026-10-23, solo lectura. Texto comprobado: `video/proveedores-halden/narration.json`, `storyboard.json`, `lexicon.json`, `video.json` y la sección «Revisión 2026-10-23» de `out/script-notes.md`, frente a `docs/reviews/2026-10-23-guiones-tanda8/proveedores-halden.md`, la lección `src/data/secplus/sp5-part3.ts` y las tarjetas `fcp520`–`fcp523`. Canon: búsquedas por los términos nuevos en `docs/superpowers/canon/glass-harbor.md`. No he ejecutado `build-timeline` (reescribe archivos); los límites de caracteres, los cues y los presupuestos de palabra los he comprobado con un script aparte, sin tocar nada.

## (a) Hallazgos previos

| Id | Sev. previa | Estado | Comprobación en el texto actual |
|---|---|---|---|
| A-1 | CORREGIR | **Resuelto** | Voz `s07-01`: «cada uno se obliga a unas fechas concretas, y puede exigírselo al otro. No hay dinero ni negocio de por medio». Pantalla: «se obliga a unas fechas exigibles. Sin dinero ni negocio» (152 car.). `trapWhy` «aquí hay obligaciones exigibles» (74). Voz y pantalla vuelven a decir lo mismo en el dato que decide; «Sin dinero ni negocio» sigue descartando el BPA. |
| A-2 | CORREGIR | **Resuelto** | `s05-01` (voz y pantalla) con «otra compañía ha comprado…» y «cambiará de subcontratas»; sin «mover los datos a otro país». `why` y voz de `s05-02` ceñidos a «dueño o subcontrata». Opciones sin Supply chain analysis. |
| A-3 | CORREGIR | **Resuelto** | «sus finanzas» en `s04-01` y en el rótulo `before`. |
| A-4 | CORREGIR | **Resuelto** | `s03-02` («es quién lo hace»), tarjeta 2 («Independiente es que no lo haga el auditado»), `s08-01` + `rule-1`, `s08-04` + `phrase`. «Firmar» queda solo para el contrato. |
| A-5 | CORREGIR (PR) | **Pendiente, fuera del guion** | `sp5-cards.ts:33` sigue diciendo «and checked again at renewal». Es la condición del PR ya anotada; el guion no lo contradice (no dice que la due diligence se repita). Mantener como condición de merge. |
| A-6 | OPCIONAL | No aplicado (aceptable) | La pregunta 2 sigue teniendo una sola respuesta. |
| A-7 | OPCIONAL | **Resuelto** | La escena `s06-papeles` lleva la nota «no se dibuja un paraguas». |
| A-8 | OPCIONAL | No aplicado (informativo) | Sin cambio necesario. Los «avisos a pasajeros» siguen en `s02-01`; decidir al congelar V41. |
| B-1 | CORREGIR | **Resuelto** | «empresa auditora de fuera» (`s02-04`), «Firmar el contrato parte la historia en dos» (`s04-01`), título de s03 «Un informe muy serio». Las «firma» que quedan (`s03-01`, «metodología y firma») tienen un solo sentido claro. |
| B-2 | CORREGIR | **Resuelto** | Anclas «memorando de entendimiento» / «de acuerdo» en `s06-05` y «memorando de acuerdo» en `s07-02`. Queda por hacer la pronunciación en `lexicon.json` tras la primera toma. |
| B-3 | CORREGIR | **Resuelto** | `s04-04`: «Se repiten los cuestionarios, se mide el servicio y se vigilan los cambios de dueño o de subcontratas» (frase con verbo, sin «cada año»). Rótulos «cuestionarios periódicos» y «métricas del servicio (SLA)». |
| B-4 | OPCIONAL | No aplicado | `s04-02` y `s04-03` se entienden de oído. |
| B-5 | OPCIONAL | **Resuelto** | «documentos de las navieras», «instrucciones de embarque» (voz y storyboard), `s06-04` en dos frases. |
| B-6 | OPCIONAL | Parcial (aceptable) | Aplicado lo de `s03-01` y los recortes de «Dos cosas más» y «Por ejemplo,». «Como la guardería» sigue abriendo `s03-03` y `s04-05`: es un eco buscado, no un fallo. |
| B-7 | OPCIONAL | **Resuelto** | `s06-01` («se firma la confidencialidad. Eso es un NDA.») y `s01-02`. |

## Lo que se pidió mirar: pregunta 3 y s06 sin el BPA ni la supply chain analysis en la voz

**Pregunta 3 (s07).** Se entiende y sigue teniendo una sola respuesta defendible.
- La voz nunca leyó las opciones, así que quitar el BPA de la voz no cambia lo que oye quien escucha el escenario. Lo que descarta el BPA es «No hay dinero ni negocio de por medio», que se conserva en voz y en pantalla. La opción en pantalla es legible por sí sola («Business partner agreement»), y el chip de s06 lo había definido en pantalla («socios que reparten el negocio»).
- El SLA se descarta solo: no hay servicio que medir ni un proveedor.
- El MOU es la trampa, y la resolución la explica: `s07-02` («colaboración sin dinero, pero solo dice la intención») y la tarjeta 5 («MOA reparte compromisos; MOU, solo intención»). Los dos términos que importan están anclados con su palabra (entendimiento / acuerdo) en `s06-05` y `s07-02`.
- Nada en `s07-02` ni `s07-03` presupone el BPA. `trapWhy` («aquí hay obligaciones exigibles») sale del escenario.

**s06.** Sigue entendiéndose.
- `s06-05` ya no tiene frases rotas: «Y si dos organizaciones colaboran sin comprarse nada, hay otros papeles. El MOU, el memorando de entendimiento, deja por escrito la intención. El MOA, el de acuerdo, reparte compromisos.» «Otros papeles» promete dos y la voz da dos. El BPA va solo en el chip, como dice el storyboard (`others`: «la voz solo dice MOU y MOA»).
- Los cuatro papeles del resto de la escena (NDA, MSA, SOW, SLA) llevan cada uno la idea y el nombre. Sin cues huérfanos.

**s02-05 sin la supply chain analysis.** La frase queda completa y encadenada: «Se mira qué cubre y qué meses» → «Y si quieres poder entrar a mirar, pide una right-to-audit clause, firmada antes». El primer chip (supply chain analysis) queda solo en pantalla. Ninguna pregunta depende de él: la pregunta 2 menciona subcontratas, pero Supply chain analysis no es una de sus opciones, como pedía A-2.

## Comprobaciones mecánicas

- Cues: los `requiredCues` de las ocho escenas coinciden con los del texto; no hay huérfanos ni sobrantes. `revealAt` / `trapAt` (`ok-N` / `trap-N`) existen y están en la frase de resolución. Cada `exam.at` está en su segmento.
- Límites del motor: escenarios 146 / 123 / 152 (≤160), preguntas 32 / 51 / 28, opciones ≤33 (≤70), `why` 73 / 80 / 74 (≤90), `trapWhy` 73 / 74 / 88 (≤90), tarjetas 33–44. Letras clave C · D · B, trampas A · C · D.
- `lexicon.json`: ninguna sigla de la voz queda sin entrada (SLA, MSA, SOW, NDA, MOU, MOA); BPA ya no está en la voz y no figura. El BPA tampoco sale de oído en ningún sitio.
- Colocación de las tarjetas con `examTiming: sentence-end`: la 2 (`nursery-back`), la 3 (`nursery-2`) y la 5 (`chip-back`) caen al acabar la primera frase del segmento y se muestran durante la segunda. Es lo previsto por el autor (nota 8) y el motor las retrasa solo hasta donde caben en la escena.
- Presupuesto: según el autor, 323,9 s de estimación con ventana 330. Los pasos extra que propongo abajo suman unos 1–2 s; sigue dentro. No he podido reproducir la estimación sin escribir archivos.

## Canon

Limpio. Ninguno de los términos nuevos aparece en `glass-harbor.md` (instrucciones de embarque, copias en la nube, proveedor de correo, empresa auditora, hospitales, comarcal, guardería, agencia de traducción, memorando, subcontrata: 0 coincidencias). «24 h» aparece en el registro solo para otras cosas (rotación de `svc_tosreport`, RTO de Operaciones), sin relación con el SLA de la traducción, que es un ejemplo. «Navieras» solo con los usos ya conocidos (portal de reservas, Facturación), sin choque. `canon-refs.md`: 0 coincidencias, consistente con lo anterior.

## (b) Hallazgos nuevos

**N-1 · OPCIONAL · `s06-01`: «mandarle» ha perdido su referente.** Entre la agencia (s02 y s04) y s06 hay un caso de otra empresa (s05, el proveedor de correo). «Antes de mandarle ningún documento» puede oírse como referido a ese proveedor, no a la agencia. La pantalla de s06 lo aclara, pero la voz sola no.
Sustituto exacto de `s06-01`: `<engaging> Queda lo que se firma con la agencia. {nda}Antes de mandarle ningún documento, se firma la confidencialidad. Eso es un NDA.` (+3 palabras).

**N-2 · OPCIONAL · `s02-05`: «firmada antes» sin «antes de qué».** Hasta s04 el oyente no ha oído hablar de firmar el contrato, y la frase queda sin ancla. La lección dice que la cláusula va en el contrato (`:47`, `:136`).
Sustituto exacto de `s02-05`: `<warm> {chips}Y si quieres poder entrar a mirar, pide una right-to-audit clause, antes de firmar el contrato.` (+2 palabras; el rótulo de pantalla «firmada antes» puede quedarse).

No he encontrado frases rotas por los recortes, conectores de redacción escrita, listas leídas nuevas, siglas deletreadas ni escenarios de pregunta que no se entiendan de oído. Los tres avisos de segmentos largos (`s03-01`, `s05-01`, `s07-01`) siguen siendo los esperados.

## (c) Veredicto

**Listo para congelar.** Sin BLOQUEANTE ni CORREGIR nuevos; todos los CORREGIR del primer informe están resueltos en el texto, salvo A-5, que es la condición del PR sobre `fcp520` (`sp5-cards.ts:33`) y no depende del guion.

| Severidad | Nuevos | Ids |
|---|---|---|
| BLOQUEANTE | 0 | |
| CORREGIR | 0 | |
| OPCIONAL | 2 | N-1, N-2 |
