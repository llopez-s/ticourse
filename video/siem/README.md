# SIEM en acción: del ruido a la evidencia

Vídeo educativo de unos 6 minutos que explica qué es un SIEM y cómo lo usa el Blue Team (CompTIA
Security+ SY0-701, objetivo 4.4). Se incrusta en la lección `sp4m6` («Alerting y monitorización») de
IntelForge Academy. Perfil `principal`, voz ElevenLabs (Sarah).

Todo lo que aparece en pantalla o se oye es **ficticio** (simulación educativa). Material independiente,
no afiliado a CompTIA.

La tubería (voz, timeline, render, pruebas) es el motor compartido: ver [`../engine/README.md`](../engine/README.md).
Aquí solo viven el guion (`storyboard.json`, `narration.json`, léxicos), `video.json`, las escenas de
`src/` y la voz (`public/voice/`, `tts/`).

```bash
node video/engine/scripts/build-timeline.mjs --video siem --check   # valida sin escribir
node video/engine/scripts/qa-frames.mjs --video siem --scene s05-correlate
node video/engine/scripts/render.mjs --video siem
```

`audio.mjs --video siem` vuelve a sintetizar con ElevenLabs las escenas cuyo texto haya cambiado
(gasta caracteres del plan).
