# Segunda pasada de V40 `documentos-halden` (sp5m1, `caso-yt`) · 23-10-2026

Revisor de solo lectura. Texto comprobado: `video/documentos-halden/narration.json`, `storyboard.json`, `video.json`, `lexicon.json`, contra el informe `documentos-halden.md`, la sección «Revisión 2026-10-23» de `out/script-notes.md`, la lección actual (`src/data/secplus/sp5-part1.ts`, `sp5-cards.ts`, tal como están hoy, sin los cambios pendientes) y `docs/superpowers/canon/glass-harbor.md` (búsquedas por términos nuevos).

Comprobación mecánica: los 41 cues obligatorios de las ocho escenas aparecen en la voz (ninguno huérfano, ninguno de más); los seis cues de `sfx` (`ok-N`, `trap-N`) existen; solo hay dos frases de más de 20 palabras (s03-01, el enunciado de la pregunta, y s06-02, 22); 716 palabras por mi recuento, 714 por el del motor, y 327,2 s estimados según las notas (rango 240–330). Ni siglas deletreadas ni listas leídas: «TLS» va en el léxico y el resto (AES-256, SOC, 112) solo sale en pantalla.

## (a) Hallazgos previos

| Id | Sev. | Estado | Comprobación en el texto actual |
|---|---|---|---|
| A-1 | BLOQUEANTE | **Resuelto** | s03-02: «Pero un standard, además de concreto, obliga. Y este no.»; tarjeta «Concreto no basta: un standard también obliga»; `trapWhy` «Es concreto, pero un standard también tiene que obligar». Ya no hay ninguna frase que diga que obligar hace a un standard; s02-07, s08-01 y la frase final («¿obliga?» y luego «qué / cuánto / cómo») son coherentes con eso: obligar es condición, lo concreto separa standard de policy. |
| A-2 | CORREGIR | Resuelto | Voz y panel dicen «el equipo de desarrollo **de una empresa**»; rótulo «no es del puerto» en s03, s05 y s07. Canon: «Desarrollo» es un área del puerto (l. 182), por eso importa el «de una empresa». |
| A-3 | CORREGIR | Resuelto | Título «Un documento de desarrollo»; sin «guía» ni «buenas prácticas». Quedan «recomendamos» y «nadie lo ha hecho obligatorio». |
| A-4 | CORREGIR | **Pendiente fuera del guion** (ver abajo y N-3) | `sp5-part1.ts:41`, `sp5-cards.ts:6` (fcp501) y `sp5-part1.ts:103` siguen sin cambios. |
| A-5 | CORREGIR | Resuelto | Panel y voz de la pregunta 2: «cómo actuar»; s04-05: «paso a paso cómo actuar si alguien se hunde». |
| A-6 | CORREGIR | Resuelto | s04-03 y chip `playbook`: ejemplo ransomware. La cuenta comprometida queda para la pregunta 2. |
| A-7 | CORREGIR | Resuelto | s06-03: «La policy se queda igual, porque no nombra tecnología»; pantalla «igual · porque no nombra tecnología»; `goal` ilumina solo el standard, y la voz solo reescribe el standard. |
| A-8 | CORREGIR | Resuelto | s06-01/02 como regla («necesita un dueño», «se revisa al menos una vez al año, o antes si cambia la ley o llega un servicio nuevo»), que coincide con `sp5-part1.ts:108` y fcp504. La pantalla de `owners` no presenta los cuatro como ya asignados. |
| B-1 | CORREGIR | Resuelto | s01-02 «¿a qué pregunta contesta?», chip `promise`, s08-04 «¿contesta al qué, al cuánto o al cómo?». |
| B-2 | CORREGIR | Resuelto | s06-05: «pasa como con la piscina pequeña. Ya no existe, pero su cartel sigue colgado.» |
| B-3 | CORREGIR | Resuelto | s06-04 con «Eso, en el examen, es monitoring and revision» y la tarjeta «Cada papel: un dueño y un ciclo de revisión». |
| A-9, A-10 | OPCIONAL | No aplicados (decisión de las notas, por presupuesto) | Siguen siendo a gusto de Lidia. |
| A-11, A-12, A-13, A-14, B-4, B-5 | OPCIONAL | Aplicados | Comprobados en voz y en `goal` (hojas boca arriba, sello también en s02 y s04, «proveedores» fuera, glosa propia de «mejor», etc.). |
| B-6, B-7, B-8 | OPCIONAL | No aplicados | Ver N-1 para la parte de B-8 que sí conviene. |
| A-15 | nota | Pendiente (al publicar) | Cita de V36 y altas en §1/§3/§4/§5/§6 del canon. |

## Pregunta 1 sin los cambios pendientes de la lección

Mantiene **una sola respuesta defendible: Guideline**. Con la lección tal como está hoy, lo que tiene el alumno delante es:

- la tabla de la lección: «Guideline: **No**: es una recomendación»;
- fcp501: «anything phrased as a suggestion is a guideline»;
- el párrafo de la lección: «si algo tiene que exigirse, se escribe como estándar, no como recomendación».

El enunciado trae dos pistas explícitas («Os recomendamos» y «Nadie lo ha hecho obligatorio»). Policy y Procedure no encajan (ni qué/por qué ni pasos).

La frase de `sp5-part1.ts:41` («the moment a document names a version… has become the standard») y la de fcp501 («an exact number or setting is a standard») están dichas sobre texto obligatorio, así que la trampa de «Standard» sigue siendo una trampa legítima y no una segunda respuesta correcta. La pregunta no depende de «mandatory» ni de los otros dos cambios; esos solo quitan la tensión entre lección y vídeo (ver N-3).

Las preguntas 2 (Procedure; Policy es la trampa por «obligatorio, aprobado, firmado», pero «paso a paso» decide) y 3 (Revisarla ahora; «ciclo anual como mínimo y revisión extra por ley») también tienen una sola respuesta. En la 2, la voz dice «equipo de seguridad de un hospital» y el panel «todo el SOC»: no chocan. En las tres, la voz y el panel dicen lo mismo (las diferencias de la 3 son que la voz añade «aprobación de la dirección»; no cambia la respuesta).

## (b) Hallazgos nuevos

No hay ninguno BLOQUEANTE ni CORREGIR: ninguna afirmación técnica falsa, ninguna frase rota por los recortes, ninguna pregunta cuya pantalla ya no cuadre con la voz, ningún cue huérfano. Tres opcionales:

**N-1 · OPCIONAL (recomendado) · s07-04, la imagen se contradice con s06-05.**
- En s06-05 el cartel de la piscina pequeña es el mal ejemplo (la piscina cerró y el cartel sigue). En s07-04 «Se cambia cuando cierra, no cuando toca revisarlo» lo trata como si ya se hiciera bien, y sin sujeto («¿qué cierra?»). Es el B-8 original, que sigue sin aplicar.
- Sustituto (+1 palabra, 15 en total; no cambia el cue ni la tarjeta): `<warm> {sign-back}Como el cartel de la piscina pequeña. Había que cambiarlo cuando cerró, no cuando tocaba revisarlo.`
- Storyboard s07: «el cartel se cambia cuando cierra la piscina pequeña, no en la fecha de la revisión» pasa a «había que cambiarlo cuando cerró la piscina pequeña, no en la fecha de la revisión».

**N-2 · OPCIONAL · s03-03 `sunscreen`: la crema aparece sin haberse presentado.**
- «Como la crema de factor cincuenta de la piscina» es la primera mención de la crema, y s04-05 ya habla de «el cartel de la crema» como algo conocido. No hace falta tocar la voz (cero palabras).
- Añadir al `goal` de s03: «en `sunscreen` asoma, un instante, el cartel pequeño “Te recomendamos crema de factor 50”, el mismo que sale entero en s04 (`pool-2`)».

**N-3 · OPCIONAL (nota de entrega) · orden de publicación con A-4.**
- Si el vídeo sale antes que los tres cambios de la lección, el alumno que mire `sp5-part1.ts:41` y fcp501 verá «un número o ajuste exacto es un standard», sin «mandatory», mientras el vídeo dice que concreto no basta. No cambia la respuesta de la pregunta 1, pero hay tensión.
- Mantener los tres cambios de A-4 en el mismo PR que el bloque del vídeo, como dice el informe y las notas.

## (c) Canon

Sin choque. Búsquedas en `glass-harbor.md` por piscina, socorrista, canales aprobados, plataforma de intercambio, enlaces que caducan, siete/7 días y AES-256: 0 resultados (nada ocupado). «Equipo de desarrollo» (l. 182, 36, 122) es el área de V19: la pregunta 1 queda fuera del puerto con «de una empresa» y «no es del puerto». «Hospital» solo aparece en V47 (ejemplos de fuera, l. 393) y en V31 (el timbre, otra imagen). «TLS 1.3» solo en el portal de V11 (l. 225) y no se contradice. «Propuesta · sin fecha» sigue el patrón de V30, V45, V46 y V47. «Ransomware» es genérico y no toca R-014 (l. 152, 238).

## (d) Veredicto

**Listo para congelar.** N-1 es el único que merece aplicarse (una palabra de más); N-2 y N-3 son opcionales. Las opcionales A-9, A-10, B-6, B-7 y B-8 (salvo N-1) siguen sin aplicarse, y el margen de duración (327,2 s de 330) no admite más de unas pocas palabras: tras aplicar N-1 conviene correr `build-timeline --estimate --check`.

| Severidad | Cantidad | Ids |
|---|---|---|
| BLOQUEANTE | 0 | |
| CORREGIR | 0 | |
| OPCIONAL | 3 | N-1, N-2, N-3 |

Previos: 1 bloqueante y 10 a corregir, todos resueltos salvo A-4, que está pendiente fuera del guion (lección y flashcard).
