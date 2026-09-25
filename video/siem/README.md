# SIEM en acción: del ruido a la evidencia

Vídeo educativo de unos 5 minutos, hecho con [Remotion](https://www.remotion.dev/) 4, que explica qué es
un SIEM y cómo lo usa el Blue Team (CompTIA Security+ SY0-701, objetivo 4.4). Se incrusta en la lección
`sp4m6` («Alerting y monitorización») de IntelForge Academy.

Todo lo que aparece en pantalla o se oye es **ficticio** (simulación educativa). Material independiente,
no afiliado a CompTIA.

## Cómo está hecho

```
storyboard.json   escenas, capítulos, duración objetivo y cues obligatorios   (contrato)
narration.json    texto de la locución por segmentos, con marcas {cue} y [mostrar|decir]
lexicon.json      pronunciación de siglas para la voz neural (SIEM -> «síem»)
      │
      ├─ scripts/prepare-tts.mjs  resuelve marcas + léxico -> out/tts-input.json (texto hablado)
      ├─ scripts/tts.py           edge-tts -> public/voice/<id>.mp3 + tts/<id>.json (tiempos por palabra)
      └─ scripts/build-timeline.mjs -> src/timeline.json (lo único que lee Remotion)
                                     + ../../public/videos/siem-blue-team-transcript.txt
                                     + ../../public/videos/siem-blue-team-captions.vtt
```

`src/timeline.json` cumple exactamente `src/timeline/types.ts`: escenas, segmentos con tiempos por
palabra, páginas de subtítulos (máx. 2 líneas × 42 caracteres), cues, tarjetas de examen y pausas para
pensar, todo en fotogramas absolutos a 30 fps.

Dos modos:

- **estimate** — sin audio: 2,5 palabras por segundo. Sirve para maquetar escenas antes de tener voz.
- **audio** — con la voz real: cada clip se mide con ffprobe (y se cruza con bytes/6, porque el MP3 es
  CBR de 48 kbit/s) y los tiempos por palabra salen de los `WordBoundary` de edge-tts. edge-tts añade
  ~1 s de silencio al final de cada clip; el timeline lo recorta (fin del clip = última palabra +
  250 ms, `--tail-ms`) para que `pauseAfterMs` sea la pausa real. `--full-audio` lo desactiva.

### Marcas en `narration.json`

| Marca | Efecto |
| --- | --- |
| `{needle}una` | el cue `needle` se dispara al empezar la palabra «una» (al final del segmento si no hay palabra detrás) |
| `[6.000\|seis mil]` | se muestra «6.000», la voz dice «seis mil»; ambos lados pueden tener varias palabras |
| `{38gb}[38 GB\|treinta y ocho gigabytes]` | un cue puede ir delante de un grupo |
| `<tired> En Halden…` | dirección solo para la voz (etiqueta de audio de ElevenLabs v3, se envía como `[tired]`); nunca se muestra ni se cronometra; edge-tts la ignora |

Las marcas no se anidan. El léxico se aplica a palabras sueltas **fuera** de los grupos, ignorando la
puntuación que las rodea (`«NetFlow»,` -> `«net flou»,`). Cada `requiredCues` de una escena debe aparecer
exactamente una vez en sus segmentos. `build-timeline` avisa de las palabras que la voz podría leer mal
(cifras, identificadores, siglas fuera del léxico).

## Voz: ElevenLabs (actual) o edge-tts

El proveedor lo decide `narration.json` → `"voice"`:

- `"elevenlabs/eleven_v3/<voice_id>"` (actual: **Sarah**, `EXAVITQu4vr4xnSDxMaL`). Usa
  `scripts/tts-elevenlabs.mjs`: **una petición por escena** (v3 no admite *request stitching*, así la
  entonación y la emoción son continuas), con marcas de tiempo por carácter
  (`/v1/text-to-speech/{voice_id}/with-timestamps`, PCM 24 kHz). La toma se corta en los silencios en un
  clip por segmento (MP3 CBR 96 kbps); si un segmento empieza con una etiqueta audible (`<sighs>`,
  `<laughs>`…) se queda con hasta 900 ms del silencio anterior para no cortarla. Las tomas completas se
  guardan en `out/eleven-takes/` para escucharlas. Ajustes en `narration.json` → `"elevenlabs"`
  (`stability` 0 / 0.5 / 1 = Creative / Natural / Robust, `seed`…) y léxico propio en
  `lexicon.elevenlabs.json` (solo siglas; los términos en inglés se leen tal cual). La caché es por escena:
  cambiar una frase vuelve a sintetizar solo su escena (~300–500 caracteres).
- `"es-ES-ElviraNeural"` (edge-tts, gratis, sin clave): `prepare-tts.mjs` + `tts.py` con `lexicon.json`.

**Clave de ElevenLabs:** `ELEVENLABS_API_KEY` en `.env.local` en la raíz del repo (ignorado por git; el
script lo lee solo y nunca lo imprime). Basta una clave con permiso de *Text to Speech* y lectura de voces.
**Plan:** el gratuito solo permite voces predefinidas por API (las de la biblioteca, como las de acento de
España, piden Starter o superior) y no incluye licencia comercial; por eso el vídeo acredita «Voz:
ElevenLabs» en la tarjeta final y la transcripción. Una pasada completa son ~5.100 caracteres (créditos).

```bash
# Audición de voces (una frase con emociones por voz, en .audition/)
node video/siem/scripts/tts-elevenlabs.mjs --audition --voices <voice_id>,<voice_id>
# Síntesis (solo escenas cambiadas; --scene s06-fatigue --force para rehacer una) + timeline
node video/siem/scripts/audio.mjs
```

## Requisitos

- Node (el del repo; en Git Bash: `eval "$(fnm env)"`) y `npm install` hecho en la raíz del repo.
  Remotion trae su propio ffmpeg/ffprobe; no hace falta instalarlos.
- Solo para edge-tts: Python 3.10+ con `edge-tts` (`python -m pip install edge-tts`, probado con 7.2.8). Otra ruta de Python:
  variable `PYTHON`.
- Red **solo** para sintetizar la voz (`tts-elevenlabs.mjs` o `tts.py`). Lo demás funciona sin conexión; los clips ya generados
  se reutilizan (caché por hash de voz + velocidad + tono + texto hablado).

## Comandos (desde la raíz del repo, en este orden)

```bash
# 1. Timeline estimado, sin voz (valida narration.json contra storyboard.json)
node video/siem/scripts/build-timeline.mjs --estimate

# 2. Voz: audición opcional de tres voces en .audition/, luego síntesis + timeline con audio
node video/siem/scripts/audio.mjs --audition
node video/siem/scripts/audio.mjs

# 3. Tipos y pruebas
npx tsc --noEmit -p video/siem/tsconfig.json
node --test "video/siem/scripts/lib/*.test.mjs"

# 4. Revisar
npx remotion studio video/siem/src/index.ts --public-dir=video/siem/public
node video/siem/scripts/qa-frames.mjs                 # o --scene s05-correlate, --extra 1200,1350

# 5. Render
node video/siem/scripts/render.mjs --draft            # media resolución, rápido
node video/siem/scripts/render.mjs                    # final + póster
```

Notas:

- `node --test` necesita el patrón entre comillas (`"…/*.test.mjs"`): en Node 26 pasar la carpeta
  (`video/siem/scripts/lib/`) falla porque intenta ejecutarla como archivo.
- `audio.mjs` acepta `--only s08-02,s08-03`, `--force`, `--attempts N`, `--full-audio`, `--tail-ms N`.
  Para cambiar de voz o velocidad, edita `voice`/`rate`/`pitch` en `narration.json` (si usas
  `--voice`/`--rate` en `audio.mjs`, se aplican tanto a la síntesis como al timeline).
- `tts.py` reintenta cada petición hasta 5 veces (esperas de 2, 4, 8 y 16 s con jitter), pausa 0,6 s entre
  segmentos, escribe cada archivo de forma atómica y termina con código 1 listando los ids que fallaron.
- `render.mjs` se niega a renderizar si el timeline no está en modo audio, si su `sourceHash` ya no
  coincide con storyboard + narración + léxico + voz, o si falta algún MP3. Después comprueba duración
  (±0,2 s), h264 1920×1080 a 30 fps + AAC, tamaño (objetivo 15–25 MB; aviso > 30 MB; error > 45 MB) y
  sincronía: cada segmento debe empezar a sonar en el vídeo (fin de silencio según `silencedetect`) a
  ≤ 2 fotogramas de su inicio + el arranque medido en su propio clip (los clips de edge-tts empiezan
  con ~180 ms casi en silencio, ~80 ms después del primer `WordBoundary`). Un desfase sistemático es
  error; desajustes sueltos, solo aviso.
- `build-timeline.mjs` admite `--storyboard --narration --lexicon --tts-dir --voice-dir --out
  --transcript` para pruebas y `--check` para validar sin escribir.

## Qué se genera y dónde

| Archivo | Qué es | ¿En git? |
| --- | --- | --- |
| `src/timeline.json` | timeline que lee la composición | sí |
| `public/voice/<id>.mp3`, `tts/<id>.json` | clips de voz y tiempos por palabra | sí (caché reproducible) |
| `../../public/videos/siem-blue-team.mp4` | vídeo final | sí |
| `../../public/videos/siem-blue-team-poster.png` | póster (`SIEMPoster`) | sí |
| `../../public/videos/siem-blue-team-transcript.txt` | transcripción por escenas | sí |
| `../../public/videos/siem-blue-team-captions.vtt` | subtítulos WebVTT del reproductor (una entrada por página de subtítulo quemada en el vídeo) | sí |
| `out/draft.mp4`, `out/qa/<escena>/`, `out/tts-input.json` | borradores y fotogramas de revisión | no |
| `.audition/<voz>.mp3`, `.audition/audition.txt` | audición de voces | no |

`out/qa/<escena|all>/` contiene `f<fotograma>_<escena>_<qué>.jpeg` (inicio y final de escena, cada cue,
tarjeta de examen y pausa) e `index.json` con el mapa archivo → fotograma → escena/cue.

## Pruebas

`scripts/lib/*.test.mjs` (node:test, sin dependencias): marcas y léxico, alineación con límites de palabra
que faltan o sobran (incluidos límites reales grabados de edge-tts en `fixtures/edge-boundaries.json`),
paginación de subtítulos, receta de tiempos y validaciones del timeline. La prueba de modo audio usa
`out/test/tts2/`; si no existe se omite. Para generarla:

```bash
F=video/siem/scripts/lib/fixtures/tts2
python -X utf8 video/siem/scripts/tts.py --narration $F/narration.json --lexicon $F/lexicon.json \
  --storyboard $F/storyboard.json --voice-dir video/siem/out/test/tts2/voice --tts-dir video/siem/out/test/tts2/tts
```

## Licencias

Tipografías en `public/fonts/`: Inter y JetBrains Mono, ambas bajo SIL Open Font License 1.1
(`public/fonts/OFL.txt`). La voz se sintetiza con el servicio de voces neurales que usa `edge-tts`;
revisa sus condiciones antes de publicar.
