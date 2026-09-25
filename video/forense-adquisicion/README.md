# Adquisición forense: capturar sin contaminar

Cápsula práctica de unos 3 minutos (perfil `capsula`) para la lección `sp4m11` («Forense digital y fuentes
de datos», CompTIA Security+ SY0-701, objetivo 4.8). Es el V2 del plan
`docs/superpowers/plans/2026-09-25-lesson-videos.md`.

Sigue el caso de la lección (IR-2026-0147, evidencia HPA-EV-003, write blocker WB-04, precintos 0091 y
0114, hashes a las 05:41, 07:58 y 08:02): legal hold, orden de volatilidad, demo de imagen bit a bit con
hash antes y después, el caso de fallo (hash distinto) y la cadena de custodia. Los datos del caso están en
`src/data/canon.ts` y deben coincidir con `src/data/secplus/sp4-part6.ts`.

Todo es **ficticio** (simulación educativa). Material independiente, no afiliado a CompTIA.

La tubería es el motor compartido: ver [`../engine/README.md`](../engine/README.md).

```bash
node video/engine/scripts/build-timeline.mjs --video forense-adquisicion --estimate
node video/engine/scripts/audio.mjs --video forense-adquisicion
node video/engine/scripts/qa-frames.mjs --video forense-adquisicion
node video/engine/scripts/render.mjs --video forense-adquisicion
```

## Voz

Hoy suena con **edge-tts** (`es-ES-ElviraNeural`): el 2026-09-25 la cuota gratuita de ElevenLabs estaba
agotada (9.963/10.000 caracteres; se renueva el 2026-10-25). La narración ya lleva las direcciones `<tag>`
de ElevenLabs v3 (edge-tts las ignora) y hay un `lexicon.elevenlabs.json`, así que pasar a la voz del SIEM
(Sarah) cuesta unos 2.500 caracteres:

1. En `narration.json`, cambiar `"voice"` a `"elevenlabs/eleven_v3/EXAVITQu4vr4xnSDxMaL"` y añadir
   `"lexicon": "lexicon.elevenlabs.json"` y el bloque `"elevenlabs"` del SIEM (`stability`, `seed`…).
2. `node video/engine/scripts/audio.mjs --video forense-adquisicion` (síntesis por escena + timeline).
3. Revisar con `qa-frames.mjs` (las escenas se sincronizan con cues y palabras, no con segundos).
4. `node video/engine/scripts/render.mjs --video forense-adquisicion`. La tarjeta final y la
   transcripción añaden solas «Voz: ElevenLabs».
