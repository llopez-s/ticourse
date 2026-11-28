# Brief de revisión de guiones (pista «Redes y ENS», bloques op2–op6)

Repositorio: `C:/Users/lidie/AppData/Local/Temp/alertopolis-voz/opo-guiones`. **Solo lees**; el único fichero que
escribes es tu informe, en `docs/superpowers/plans/fichas-redes/revisiones/<nombre que te dé el encargo>.md`.
No edites guiones, fichas ni el registro. No hagas commit.

Contexto: lee `docs/superpowers/specs/2026-11-28-redes-videos-bloques-2-6-design.md`,
`docs/superpowers/plans/fichas-redes/BRIEF-escritores-bloques-2-6.md` (las reglas que debían cumplir) y, como modelo
aprobado, `video/vlan-arcedo/` con su ficha `R03-op1m3.md` (sobre todo «Revisiones aplicadas» y «Segunda revisión»).
De cada vídeo que revises: `video/<slug>/narration.json` (voz, preguntas `question` y tarjetas `exam`),
`storyboard.json` (`goal` = lo que sale en pantalla) y su ficha `R..-<lección>.md`.

## Revisión de exactitud

Contrasta cada afirmación de la voz, cada rótulo del `goal`, cada tarjeta y cada pregunta (enunciado, opciones,
`answer`, `trap`, `why`, `trapWhy`) con la lección `src/data/opo/<lección>.ts`, el dosier
`docs/superpowers/sources/2026-11-2*-opN-fuentes.md` y el registro `docs/superpowers/canon/arcedo.md`.
- ¿Algo que la lección o el dosier no respaldan, o lo contradicen? ¿Un número de RFC, artículo, anexo, plazo o
  cifra mal? En op6, comprueba artículo por artículo contra la lección y, si la lección cita la fuente primaria
  (BOE), contra lo que diga el dosier op6.
- Preguntas: ¿la marcada es la única correcta? ¿alguna otra opción es defendible? ¿se contesta copiando el
  enunciado? ¿repite o parafrasea un `check`, una pregunta del `quiz` de la lección o una decisión de los supuestos
  `src/data/opo/supuestos/opNs*.ts`?
- Rehaz cualquier cálculo con un script.
- ¿Contradice datos del Consorcio fijados en el registro (§1–§7e) o en otro vídeo de la pista?
- Simplificaciones que se vuelven falsas (p. ej. atribuir a un estándar lo que es del fabricante).

## Revisión de naturalidad

Reglas de «Narración hablada» (`docs/superpowers/plans/2026-09-25-lesson-videos.md`, §1 «Narración hablada»).
- ¿Suena a persona hablando o a texto leído? Frases largas, prosa administrativa, conectores de escritura, siglas
  seguidas, nombres antes de la idea, identificadores dichos en voz.
- ¿Las imágenes ayudan y están bien elegidas? ¿Hay muletillas repetidas dentro del vídeo y **entre los vídeos del
  bloque** (ganchos, entradas de pregunta, frases de trampa, cierres)? Compara también con los cinco de op1
  (`video/*-arcedo/` con lección op1m*).
- Español natural de España, sin anglicismos innecesarios (salvo los términos técnicos que usa la lección).
- Para cada propuesta, da el texto nuevo y ten en cuenta la duración: la estimación de cada cápsula ya está al
  límite (~335 s); si una propuesta alarga, di qué se quita.

## Formato del informe

Por vídeo, hallazgos numerados con gravedad **BLOQUEA** (falso o pregunta con dos respuestas), **MEDIA** o **BAJA**:
segmento o escena, qué dice, qué está mal, fuente (`path:línea`) y el arreglo concreto (texto propuesto). Al final,
una lista corta de lo que está bien y no hay que tocar. Sé concreto: el escritor aplicará tu informe sin poder
preguntarte.
