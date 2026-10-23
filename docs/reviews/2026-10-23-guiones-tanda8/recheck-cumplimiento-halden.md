# Segunda pasada · V43 `cumplimiento-halden` (sp5m6, `caso-yt`)

Revisado el 2026-10-23, solo lectura, sobre `video/cumplimiento-halden/narration.json` y `storyboard.json` ya corregidos. Contrastado con el informe `cumplimiento-halden.md`, `out/script-notes.md` («Revisión 2026-10-23»), la lección `src/data/secplus/sp5-part3.ts` (sp5m6) y el canon.

Comprobaciones mecánicas: 721 palabras (coincide con lo anotado); todos los `requiredCues` del storyboard existen en la voz (ningún cue huérfano); el orden de los cues de s04 (`salon` antes de `reporting`) cuadra con el `goal`; las tres preguntas tienen `answer`/`trap` que coinciden con las letras del storyboard (q1 A/C, q2 D/A, q3 C/B); cada tarjeta de examen cae dentro de su escena (el validador lo exige y no hay nada que lo cambie).

## (a) Hallazgos previos

| Id | Estado | Comprobación sobre el texto actual |
|---|---|---|
| A-1 (BLOQUEANTE) | **Resuelto** | `s02-05` («revisar quién entra, poner el sistema al día y arreglar lo que salga en las revisiones»), `s03-01` (voz y `scenario`) y `s03-02` ya no mencionan borrar. El borrado queda solo en `s06-03` (retention). Las rutinas coinciden con las de la lección (parcheo, accesos, hallazgos; la formación sale solo en pantalla). Q1 tiene una sola respuesta defendible (Due care; Due diligence es la trampa declarada; Attestation y Data inventory no encajan). El espejo de `sp5m6q1` está declarado en las notas. |
| A-2 | **Resuelto** | `s06-05`: «Si una ley te obliga a guardarlos, no se borran. Con un legal hold, una orden de guardar por un juicio, tampoco.» Se explica antes de la opción A de la pregunta 3. «Tampoco» se entiende (antecedente en la frase anterior). Se quitó «Lo demás sí se borra», que no hace falta: el chip lo lleva y `s06-03` ya habló de borrar. |
| A-3 | **Resuelto** | `why` de q3: «Guarda mucho más de lo que su plazo permite: falla la retention», igual que la voz de `s07-02`. |
| A-4 | **Resuelto** | `s05-04` empieza con «En el examen, mira quién la impone, que aquí es el regulador», que es lo que enciende `regulator` en pantalla; la regla «restringe, no multa» queda después y la tarjeta la repite. |
| B-1 | Resuelto | «parar el sistema hasta corregirlo» en voz y en el rótulo. |
| B-2 | Resuelto | «retiene pagos o cancela el contrato» en voz y en el rótulo. |
| B-3 | Resuelto | `s06-02` ya no dice «ese mapa». |
| B-4 | **Parcial** | «documento de identidad» y «copia de seguridad» están bien, pero el recorte dejó «y el aviso» a secas. Ver N-1. |
| A-5, A-6 (solo `why`), B-9 (`s03-02`, `s04-03`, `s07-03`), B-10 | Aplicados y correctos | «Transporte»; `why` de q2; «Ojo con la due diligence, que esa ya se hizo, y bien»; «libra»; «propósito» en tarjeta, `s08-04` y storyboard. |
| A-7, B-5, B-6, B-7, B-8, B-11, B-9 (`s05-03`) | No aplicados | Siguen siendo opcionales. Ninguno se ha vuelto peor por los recortes. |

## (b) Hallazgos nuevos

### N-1 · CORREGIR · `s06-01`: «el aviso» queda sin referente (resto de B-4)

El recorte quitó «que se le manda». Por voz, «El sistema, su copia de seguridad y el aviso» enumera tres sitios donde viven los datos, y el tercero no se entiende: no se ha hablado de ningún aviso antes (solo el rótulo de pantalla lo completa). Es el mismo defecto que B-4 corregía con «su copia». Sustituto exacto:

`"<engaging> {three-places}Volvemos a los objetos perdidos. Quien reclama deja nombre, teléfono y documento de identidad, y eso vive en tres sitios. El sistema, su copia de seguridad y el aviso que le mandan."`

Suma 3 palabras. Para no pasar del techo en `--estimate` (hoy 329,0 s de 330), compensar quitando «O sea, » de `s03-03`: `"<warm> {cat-back}Te informaste de maravilla, y el gato sigue sin comer."` (−2). Neto +1 palabra (~329,4 s). Volver a lanzar `build-timeline --check --estimate`. La lectura real prevista (~0,89 ×) deja holgura de sobra.

### N-2 · CORREGIR · Storyboard s06: la pantalla dice «no borras» y la voz y la tarjeta dicen «no proteges»

El `goal` de s06 pone en el cue `inventory`: «no borras lo que no sabes que tienes». La voz (`s06-02`: «Y no proteges lo que no sabes que tienes») y la tarjeta («No proteges lo que no has inventariado») dicen «proteges». Dos textos en pantalla distintos para el mismo cue. Ambos son válidos con la lección (`sp5-part3.ts:363`: «no puedes proteger, clasificar, borrar ni reportar datos que no has inventariado»), pero conviene que coincidan. Sustituto en el `goal` de `storyboard.json` s06: «no proteges lo que no sabes que tienes» (en lugar de «no borras lo que no sabes que tienes»). No cambia la voz ni el presupuesto.

### N-3 · OPCIONAL · `s08-03`: «se borra en todas las copias» suena incondicional

«Y tres, sin inventario no hay retención, y se borra en todas las copias» no dice qué se borra; tras `s06-05` (ley y legal hold impiden borrar) podría oírse como «todo se borra». La pantalla (`rule-3`) sí lleva la excepción. Sustituto, +3 palabras:

`"<firm> {rule-3}Y tres, sin inventario no hay retención, y lo que sobra se borra en todas las copias."`

Solo si hay margen; quitar además «Por ejemplo, » de `s02-02` (−2) lo compensa. No condiciona el congelado.

### N-4 · OPCIONAL · `s05-02`: la razón de voz también describe «Loss of license»

La voz dice «la impone la autoridad y restringe lo que puedes hacer», que también vale para perder la licencia. Lo que separa las dos es «sigue con sus clientes privados» (escenario, voz de `s05-01`) y el `why` en pantalla, que ya lo cierra. Hoy hay una sola respuesta defendible. Si se quiere blindar la voz: `"<firm> {ok-2}Es una sanction, porque la impone la autoridad y restringe una actividad, pero la empresa sigue operando."` (+3 palabras). Solo con margen.

### Notas que no son hallazgos

- `reporting` (chip de s04) sale ahora con «Sanidad la multa…» sin que la voz diga el término. Es la consecuencia aceptada del recorte de `s04-06`; reporting no es uno de los tres conceptos de la ficha y el chip aguanta solo (interno: dirección y comité; externo: reguladores y clientes). No requiere acción.
- El riesgo residual de «sanctions frente a fines» sigue como en A-0 del informe (no se ha abierto el PDF oficial); la voz no dice que las sanctions «no sean dinero» en general.
- Sin conectores escritos, sin siglas deletreadas, sin identificadores. Las tres enumeraciones cortas (`s02-02`, `s02-05`, `s06-01`) son de tres elementos y se entienden de oído. Los escenarios de las tres preguntas se entienden solo por voz (tiempos y cifras en frases cortas).

### Canon

Sin choques. Búsquedas en `docs/superpowers/canon/glass-harbor.md` por «Sanidad», «tintes», «peluquer», «currículo»: sin coincidencias. Los términos nuevos desde la primera revisión («transporte», «aviso», «propósito», «libra») no son entidades del canon. Siguen sin aparecer equipos, cuentas, IP, hashes, personas ni fechas. La frase del «MEJOR» se conserva como en V28. La política de retención del canon (V6) y el legal hold (V2) no se contradicen: aquí son explicaciones genéricas.

## (c) Veredicto

**Congelar tras corregir N-1 y N-2.** N-3 y N-4 son opcionales y no condicionan.

Recuento: BLOQUEANTE 0 · CORREGIR 2 (N-1, N-2) · OPCIONAL 2 (N-3, N-4). Previos: 9 de 9 obligatorios resueltos, salvo B-4 parcial (recogido en N-1).
