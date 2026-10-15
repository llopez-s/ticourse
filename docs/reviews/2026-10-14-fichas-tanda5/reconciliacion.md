# Reconciliación de la tanda 5 (V24–V27) · decisiones propuestas

Fecha: 14 de octubre de 2026. Son propuestas con la opción recomendada ya elegida; Lidia dice solo qué cambia. Salen de las
fichas (`ficha-V24..V27.md`) y de las dos revisiones (`revision-secplus.md`, `revision-gcti.md`).

## Compartido entre V25 y V26 (PAPER GOVERNOR, primera aparición en vídeo)

1. **Voz:** `"adversaryVoice": { "voice": "sapi/Microsoft Laura", "rate": -1, "fx": "megafonia" }`. Reserva: Pablo + `cifrado`
   (la propuesta de V25). Razón: el dosier dice «desenmascarada» y la regla de la tanda 3 es que la voz fija el género; es una
   pareja que no existe aún y no pide efecto nuevo. `rate` −1 porque «lee un acta», y para separarla de BLIND ARCHITECT
   (Helena + `megafonia`, `rate` −2). **Antes de congelar, prueba de oído** (`revision-secplus.md`, apartado «Voz»).
2. **Registro:** acta impersonal, sin tuteo, de la forma «Se acuerda: … Queda en acta.». Los cuatro mensajes (dos de V25 y dos
   de V26) se reescriben en ese registro. Coletilla «Queda en acta.» en los cuatro.
3. **Presentación:** V25 presenta a PAPER GOVERNOR desde cero con la frase de su jefe de sección («vive en los huecos de tu
   gobernanza», `src/data/secplus/sections.ts:123`). V26 dice «Y vuelve PAPER GOVERNOR…»: V25 va justo antes en el curso.
4. **Pronunciaciones:** `GOVERNOR` «gávernor» y `ARO` «a erre o» en las dos fichas. (Se confirman con la audición de Lidia.)
5. **Cifras:** V25 usa las de R-014 de la lección, sin fecha. V26 no pone ninguna cifra en euros.

## Decidido por Lidia (2026-10-15)

- **Voz de PAPER GOVERNOR: Laura + `megafonia`, `rate` −1**, tras la prueba de oído (V25 y V26). Es la que ya llevan
  `video/ale-halden/narration.json` y `video/bia-halden/narration.json`; la reserva (Pablo + `cifrado`) queda descartada.

## V24

- El teatro no usa «almacén» ni «foco» (imágenes ocupadas por V20 y V21): el decorado «guardado en el camerino» o «en un camión»
  y la iluminación «lista». Añadir las dos palabras a las que el guion no dice.
- Cues de efectos inexistentes (`lights-out`): usar solo cues que existan en `video/engine/sfx/sfx.json`.
- Sin fecha; inserción tras el 3.er check, como propone la ficha.

## V25

- Inserción **después del último check de la lección** (`sp5-part2.ts:178` en la numeración sin vídeo), no antes de la nota.
- El cierre da una sola tarea.

## V26

- Los efectos son cues del motor; sin cues inexistentes.
- Inserción tras el último check, antes del párrafo que salta a sp5m5 (`:423`).

## V27 (GCTI)

- Aplicar las nueve correcciones de `revision-gcti.md`.
- Pendientes de Lidia: inserción (tras el primer check, recomendada), primera voz de VELVET CICADA (Pablo + `machine`,
  recomendada, o quedarse en GLASS VIPER) y cómo dice YARA, Sigma y certutil.
