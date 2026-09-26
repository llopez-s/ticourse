# Motor de vídeos de lección

Tubería compartida, hecha con [Remotion](https://www.remotion.dev/) 4, para los vídeos que se incrustan en
las lecciones de IntelForge Academy (bloques `t: 'video'`). Cada vídeo vive en su carpeta
`video/<slug>/`; este motor pone los scripts, la interfaz, las superposiciones (subtítulos, raíl de
capítulos, tarjetas de examen, pausas para pensar, barra de progreso), el tema, las fuentes y los tipos.
Plan de contenidos: `docs/superpowers/plans/2026-09-25-lesson-videos.md`.

| Vídeo | Carpeta | Lección | Perfil |
| --- | --- | --- | --- |
| SIEM en acción | `video/siem/` | sp4m6 | principal |
| Adquisición forense | `video/forense-adquisicion/` | sp4m11 | cápsula |

El vídeo del EDR (`video/edr/`) es una tubería anterior e independiente; se retira cuando se rehaga (V1).

## Qué pone cada vídeo

```
video/<slug>/
  video.json        slug, nombre de salida, ids de composición y póster, perfil y pista
  storyboard.json   escenas, capítulos, duración objetivo y cues obligatorios   (contrato)
  narration.json    texto de la locución por segmentos, con marcas {cue} y [mostrar|decir]
  lexicon.json      pronunciación de siglas para edge-tts (SIEM -> «síem»)
  lexicon.elevenlabs.json   ídem para ElevenLabs (solo siglas)
  src/              index.ts + Root.tsx (createLessonRoot), escenas, datos, Poster.tsx, timeline.json
  public/voice/     clips de voz (Remotion --public-dir)       tts/   tiempos por palabra
```

`video.json`:

| Campo | Qué decide |
| --- | --- |
| `output` | nombres del vídeo: `<output>.mp4` (dónde, según el perfil — ver «Perfiles»), `-poster.png`, `-transcript.txt`, `-captions.vtt`, todos bajo `public/videos/` salvo el MP4 de los perfiles `-yt` |
| `composition`, `poster` | ids que registra `src/Root.tsx` (deben coincidir) |
| `profile` | uno de los cuatro perfiles (`principal`, `capsula`, `principal-yt`, `capsula-yt`); ver «Perfiles» |
| `track` | descargo de la transcripción: `secplus` (no afiliado a CompTIA) o `gcti` (no afiliado a SANS/GIAC) |
| `adversary` | opcional; el adversario de la sección (p. ej. `SILENT PAGER`). Obligatorio en cuanto algún segmento de `narration.json` use `intercept` — ver «Mensaje interceptado» |
| `lesson` | opcional; el id de módulo (p. ej. `sp4m7`) que enlaza la descripción de YouTube (`youtube-meta.mjs`) |

Todos los scripts eligen el vídeo con `--video <slug>` (o la variable `VIDEO`; por defecto `siem`).

## Perfiles

`video.json` → `"profile"` fija el formato del vídeo (`scripts/lib/profiles.mjs`; ver también el plan
`docs/superpowers/plans/2026-09-25-lesson-videos.md` §1):

| | `principal` | `capsula` | `principal-yt` | `capsula-yt` |
| --- | --- | --- | --- | --- |
| Duración (`minTotalSec`–`maxTotalSec`) | 280–340 s | 140–200 s | **380–500 s** | **190–260 s** |
| Capítulos (`maxChapters`) | 5 | 3 | 5 | 3 |
| Tarjetas de examen (`examCards`) | 8–11 | 4–6 | 8–11 | 4–6 |
| Pausas para pensar (`thinkPrompts`) | 2 | 1 | 2 | 1 |
| Mensajes interceptados (`intercepts`) | 0 | 0 | **2–4, máx. 1/capítulo** | **1–2** |
| Narración con chispa (`chispa`) | no | no | **sí** | **sí** |
| `host` | `repo` | `repo` | **`youtube`** | **`youtube`** |
| `crf` | 23 | 27 | **18** | **18** |
| Tamaño objetivo (`size`) | 15–25 MB (aviso > 30, error > 45) | 4–12 MB (aviso > 15, error > 25) | **sin objetivo** | **sin objetivo** |

`host: 'youtube'` (los dos perfiles `-yt`) cambia dos cosas:

- **La ruta del MP4** (`lib/paths.mjs` → `mp4PathFor`): en vez de `public/videos/<output>.mp4` (se commitea),
  el vídeo final va a `video/<slug>/out/<output>.mp4`, que está ignorado por git. `render.mjs` se niega a
  renderizar un perfil `-yt` si esa ruta no está `git check-ignore`d. El **póster** siempre va a
  `public/videos/`, en los cuatro perfiles, porque pesa poco y lo necesita la app.
- **El tamaño**: con `size: null`, `render.mjs` no comprueba el peso del MP4 (solo avisa de que no se
  comprueba, porque YouTube vuelve a codificar el vídeo al subirlo).

**El aviso con la marca** (`trackNotice`, en la transcripción y en la tarjeta final de créditos): los perfiles
antiguos (`principal`, `capsula`) llevan `LEGACY_APP_NAME` («IntelForge Academy»), para que la regresión del
SIEM siga siendo byte a byte idéntica; los perfiles `-yt` llevan `APP_NAME` («Alertópolis»).

## Mensaje interceptado

Un aviso en pantalla **sin voz**, solo para los perfiles `-yt`: un mensaje del adversario de la sección
aparece interceptado, se escribe letra a letra y, a continuación, el segmento de narración lo responde con la
explicación.

- **`narration.json`**, en el segmento que responde: `"intercept": { "text": "…", "holdMs": 3500 }`.
  - `text`: 70 caracteres como máximo (`INTERCEPT_TEXT_MAX`), sin flechas, emoji ni los símbolos prohibidos de
    las tarjetas de examen. No se locuta.
  - `holdMs`: entre 2500 y 4500 (`INTERCEPT_HOLD_MS`) — el silencio **antes** del audio del segmento, que
    `build-timeline.mjs` añade retrasando el `from` del segmento ese mismo hueco, para dar tiempo a leer el
    mensaje. Un segmento no puede llevar `intercept` y `think` a la vez.
- **`video.json`**: `"adversary": "SILENT PAGER"`. Obligatorio en cuanto algún segmento use `intercept`; si
  falta, `build-timeline.mjs` lo rechaza como error (`analyzeNarration` no lee `video.json`, así que esta
  comprobación concreta vive donde ambos archivos ya se cruzan).
- **`build-timeline.mjs`**:
  - retrasa el `from` del segmento (el inicio de su audio) `holdMs` fotogramas; la entrada de `intercept[]`
    empieza en el fotograma donde arrancaría ese audio sin el retraso (el principio del silencio) y dura
    hasta que terminan el audio y la pausa del segmento;
  - escribe la clave opcional `timeline.intercept[]` (`from`, `durationInFrames`, `text`, `adversary`), **solo
    cuando hay alguno** — así el `timeline.json` de un vídeo sin `intercept` (SIEM, forense) sigue siendo byte
    a byte idéntico, y `validate-timeline.mjs` la trata como opcional;
  - los subtítulos no incluyen el mensaje, porque no es voz; la transcripción sí, como
    `[Mensaje interceptado · SILENT PAGER] «…»`.
- **`src/overlay/InterceptLayer.tsx`**: la tarjeta, con acento rojo, el nombre del adversario y el efecto de
  escritura letra a letra; ocupa el mismo hueco que la pausa para pensar (nunca coinciden en el tiempo). Está
  en `OverlayGallery` para la QA visual.

Validación completa: `analyzeNarration` da error si hay más de 1 mensaje por capítulo, si hay uno en la escena
final o si `text`/`holdMs` está fuera de rango, y avisa (no falla) si el recuento total queda fuera del rango
del perfil (tabla de «Perfiles»). El único error que no pasa por `analyzeNarration` es el de `adversary`
ausente, arriba, porque `analyzeNarration` no lee `video.json`.

## Cómo está hecho

```
storyboard.json + narration.json + lexicon.json      (de video/<slug>/)
      │
      ├─ scripts/prepare-tts.mjs  resuelve marcas + léxico -> out/tts-input.json (texto hablado)
      ├─ scripts/tts.py           edge-tts -> public/voice/<id>.mp3 + tts/<id>.json (tiempos por palabra)
      └─ scripts/build-timeline.mjs -> src/timeline.json (lo único que lee Remotion)
                                     + public/videos/<output>-transcript.txt
                                     + public/videos/<output>-captions.vtt
```

`src/timeline.json` cumple exactamente `engine/src/timeline/types.ts`: escenas, segmentos con tiempos por
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

## Voz: ElevenLabs, Chatterbox o edge-tts

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

  **Aviso de facturación.** Si el plan no permite PCM (`pcm_24000`), `tts-elevenlabs.mjs` reintenta la misma
  escena en MP3 y la decodifica (`synthesizePcm`) — esa segunda petición **factura la escena dos veces**.
  `voice-plan.mjs` reserva un margen del 15 % sobre el guion para repetir tomas; un reintento PCM→MP3 se come
  ese margen sin que haya habido ninguna toma repetida de verdad.

  **Elegir el motor:** `node video/engine/scripts/voice-plan.mjs --video <slug>` calcula los caracteres que
  facturaría el guion (§ arriba) y consulta `getSubscription()`; si el crédito restante cubre el guion × 1,15
  (margen de repetición), imprime la voz de ElevenLabs (Sarah); si no, la de Chatterbox. Solo imprime la
  decisión — hay que copiar la voz a mano en `narration.json` → `"voice"`.
- `"chatterbox/<paquete>/<voz>"` (local, gratis, sin cuota): `scripts/tts-chatterbox.mjs`. Ver
  [Voz: Chatterbox](#voz-chatterbox).
- `"es-ES-ElviraNeural"` (edge-tts, gratis, sin clave): `prepare-tts.mjs` + `tts.py` con `lexicon.json`.

**Clave de ElevenLabs:** `ELEVENLABS_API_KEY` en `.env.local` en la raíz del repo (ignorado por git; el
script lo lee solo y nunca lo imprime). Basta una clave con permiso de *Text to Speech* y lectura de voces.
**Plan:** el gratuito solo permite voces predefinidas por API (las de la biblioteca, como las de acento de
España, piden Starter o superior) y no incluye licencia comercial; por eso un vídeo con voz de ElevenLabs
acredita «Voz: ElevenLabs» en la tarjeta final y la transcripción. El plan gratuito da 10.000 caracteres al
mes: el SIEM completo son ~5.100 y una cápsula ~2.500.

```bash
# Audición de voces (una frase con emociones por voz, en .audition/)
node video/engine/scripts/tts-elevenlabs.mjs --video siem --audition --voices <voice_id>,<voice_id>
# Síntesis (solo escenas cambiadas; --scene s06-fatigue --force para rehacer una) + timeline
node video/engine/scripts/audio.mjs --video siem
```

## Voz: Chatterbox

[Chatterbox](https://github.com/resemble-ai/chatterbox), de Resemble AI, tiene licencia MIT y corre en
este equipo, sin GPU. No tiene cuota ni pide clave: solo necesita red la primera vez, para bajar los modelos.

**Voz.** Se elige en `narration.json` con `"voice": "chatterbox/<paquete>/<voz>"`:
- Paquete `es-es`: el modelo ajustado a español de España, `ResembleAI/Chatterbox-Multilingual-es-es` (su T3, su decodificador `s3gen_v3` y su tokenizador; el worker lo monta con las clases de 0.1.7).
- Paquete `mtl`: el multilingüe de `chatterbox-tts` 0.1.7 (T3 v2, `from_pretrained`).
- Voz `default`: la voz integrada del modelo.
- Cualquier otro nombre: un clip de referencia `video/engine/voices/<voz>.wav`, que clona esa voz. Debe
  durar entre 6 y 10 s, estar limpio y tener una sola persona hablando. La carpeta está ignorada por git,
  porque un clip de voz es un dato personal y el repo es público. **Solo con permiso de quien habla.**

**Tiempos por palabra.** Chatterbox no los da. El worker (`scripts/chatterbox_worker.py`) transcribe cada
toma con faster-whisper, y esas marcas son las fronteras de palabra que usa `build-timeline`. La misma
transcripción se compara con el guion (`script_score`, de 0 a 1). Si una toma no llega a `min_score`
(normalmente porque se salta o repite frases), se sintetiza otra vez con otra semilla, hasta `attempts`
tomas, y se queda la mejor. Las que siguen por debajo se listan al final para escucharlas.

**Ajustes.** Van en `narration.json` → `"chatterbox"`:
- `exaggeration`: 0.5 es neutro; más alto, más dramático.
- `cfg_weight`: más bajo, locución más pausada.
- `temperature`.
- `seed`: base de la semilla por segmento.
- `asr_model`: modelo de faster-whisper, `small` por defecto.
- `min_score` y `attempts`: control de las tomas, como se explica arriba.

Cambiar la voz, el clip o un ajuste de audio vuelve a sintetizar; cambiar `asr_model`, `min_score` o
`attempts` no.

**Registros.** Antes, Chatterbox recibía el texto sin etiquetas y aplicaba un único `exaggeration`/`cfg_weight`
a todo el vídeo, así que salía plano. Con `"chatterbox": { "moods": true }` (el valor por defecto), cada
segmento traduce su primera etiqueta `<…>` a uno de cuatro registros (`scripts/lib/moods.mjs`, `moodFor`):

| Registro | Etiquetas | `exaggeration` | `cfg_weight` |
|---|---|---|---|
| Sereno | `calm`, `serious`, `steady`, `grave`, `focused`, `firm`, `concerned`, `warning`, `ominous`, `tired`, `sighs` | 0.40 | 0.50 |
| Neutro | sin etiqueta, `clear`, `thoughtful` | 0.50 | 0.50 |
| Cálido | `curious`, `intrigued`, `confident`, `warm`, `warmly`, `satisfied`, `relieved`, `reassuring`, `casual`, `engaging` | 0.60 | 0.45 |
| Vivo | `enthusiastic`, `cheerful`, `mischievously`, `sarcastic`, `urgent`, `suspicious`, `emphatic`, `tense` | 0.75 | 0.35 |

Decide la primera dirección del segmento y, dentro de ella («serious, warning»), la primera palabra que esté
en la tabla; si ninguna lo está, se aplica el registro neutro y se avisa. Con
`"chatterbox": { "moods": false }` vuelve al `exaggeration`/`cfg_weight` únicos de siempre, para todo el
vídeo. La caché por segmento incluye el registro efectivo, así que cambiar la emoción de un segmento (o
apagar/encender `moods`) solo vuelve a sintetizar los segmentos afectados. Antes del primer vídeo con
Chatterbox se audiciona el párrafo de ejemplo de la guía de narración en los cuatro registros:

```bash
node video/engine/scripts/tts-chatterbox.mjs --video <slug> --audition --moods [--voices es-es/default]
```

**Léxico.** Una narración con voz Chatterbox debe fijar en `narration.json` → `"lexicon": "lexicon.chatterbox.json"`
(solo siglas): las reescrituras de `lexicon.json` («jash», «jóuld») son para edge-tts y con Chatterbox se leen
peor. `build-timeline.mjs` usa ese mismo léxico (lo toma de `narration.json` → `"lexicon"`, no lo cambia por su
cuenta), para que el guion mostrado y el hablado no diverjan. `tts-chatterbox.mjs` avisa
(`edgeLexiconWarning`) cuando una narración Chatterbox resuelve al `lexicon.json` por defecto en vez de a uno
propio.

La *audición* de voces (`--audition`, sin narración de por medio) usa aparte `lexicon.chatterbox.json` si
existe, si no `lexicon.elevenlabs.json` (`neuralLexicon`), y solo con `--respelled` añade una segunda toma con
`lexicon.json` para comparar. Se midió con la audición del 2026-09-25, comparando la transcripción de Whisper
con el guion:
- `es-es` sin reescrituras pronuncia bien «Halden», «SOC» y «legal hold» (coincidencia 0,96).
- `es-es` con ellas empeora (0,93): «jálden» sale «Hallem» y «jash» sale «cash».
- `mtl` lee los términos en inglés con fonética española: «hash antes» sale «a santas».

**Marca de agua.** Todo el audio sale con la marca de agua neuronal Perth de Resemble AI. No se oye.

```bash
# Entorno (una vez): Python 3.12, torch de CPU, en D: para no llenar C:
C:/Python312/python.exe -m venv video/engine/.venv-chatterbox
video/engine/.venv-chatterbox/Scripts/python.exe -m pip install -r video/engine/scripts/requirements-chatterbox.txt

# Audición: la misma frase con cada voz, en video/<slug>/.audition/chatterbox-*.mp3
node video/engine/scripts/tts-chatterbox.mjs --video <slug> --audition --voices mtl/default,es-es/default [--respelled]

# Síntesis (solo los segmentos que cambian; --only s01-02 --force para rehacer uno) + timeline
node video/engine/scripts/audio.mjs --video <slug>
```

Los modelos (~4 GB) se descargan la primera vez en `video/engine/.cache/huggingface/`, también ignorada
por git. Así `HF_HOME` no apunta a C:.

**Rendimiento en CPU.** El proceso ocupa entre 4 y 6 GB de RAM. Tarda varias veces más que la duración del
audio, así que una cápsula lleva de 30 a 60 minutos. Todo va en un solo proceso que carga los modelos una
vez; conviene lanzarlo en segundo plano con el equipo descargado.

## Requisitos

- Node (el del repo; en Git Bash: `eval "$(fnm env)"`) y `npm install` hecho en la raíz del repo.
  Remotion trae su propio ffmpeg/ffprobe; no hace falta instalarlos.
- Solo para edge-tts: Python 3.10+ con `edge-tts` (`python -m pip install edge-tts`, probado con 7.2.8). Otra ruta de Python:
  variable `PYTHON`.
- Solo para Chatterbox: el venv de [Voz: Chatterbox](#voz-chatterbox).
- Red **solo** para sintetizar la voz (`tts-elevenlabs.mjs` o `tts.py`; Chatterbox, solo la primera vez). Lo demás funciona sin conexión; los clips ya generados
  se reutilizan (caché por hash de voz + velocidad + tono + texto hablado).

## Comandos (desde la raíz del repo, en este orden)

```bash
# 1. Timeline estimado, sin voz (valida narration.json contra storyboard.json)
node video/engine/scripts/build-timeline.mjs --video <slug> --estimate

# 2. Perfiles -yt: qué voz usar (ElevenLabs si el crédito llega, si no Chatterbox); copiar el resultado
#    a mano en narration.json -> "voice"
node video/engine/scripts/voice-plan.mjs --video <slug>

# 3. Voz: audición opcional de tres voces en .audition/, luego síntesis + timeline con audio
node video/engine/scripts/audio.mjs --video <slug> --audition
node video/engine/scripts/audio.mjs --video <slug>

# 4. Tipos y pruebas
npx tsc --noEmit -p video/<slug>/tsconfig.json
npx tsc --noEmit -p video/engine/tsconfig.json
node --test "video/engine/scripts/lib/*.test.mjs"

# 5. Revisar
npx remotion studio video/<slug>/src/index.ts --public-dir=video/<slug>/public
node video/engine/scripts/qa-frames.mjs --video <slug>  # o --scene s05-correlate, --extra 1200,1350

# 6. Render
node video/engine/scripts/render.mjs --video <slug> --draft   # media resolución, rápido
node video/engine/scripts/render.mjs --video <slug>           # final + póster

# 7. Perfiles -yt: metadatos y archivos listos para subir a YouTube (después de renderizar)
node video/engine/scripts/youtube-meta.mjs --video <slug>
```

Notas:

- `voice-plan.mjs` y `youtube-meta.mjs` solo tienen sentido para los perfiles `principal-yt`/`capsula-yt`; en
  `principal`/`capsula` no hace falta ejecutarlos. `voice-plan.mjs` solo imprime la decisión (no toca
  `narration.json`); `youtube-meta.mjs` exige un timeline en modo audio y un póster ya renderizado, y escribe
  `video/<slug>/out/youtube.md` con el título, la descripción (con capítulos), las etiquetas y la lista de
  archivos a subir.

- `node --test` necesita el patrón entre comillas (`"…/*.test.mjs"`): en Node 26 pasar la carpeta
  (`video/engine/scripts/lib/`) falla porque intenta ejecutarla como archivo.
- `audio.mjs` acepta `--only s08-02,s08-03`, `--force`, `--attempts N`, `--full-audio`, `--tail-ms N`.
  Para cambiar de voz o velocidad, edita `voice`/`rate`/`pitch` en `narration.json` (si usas
  `--voice`/`--rate` en `audio.mjs`, se aplican tanto a la síntesis como al timeline).
- `tts.py` reintenta cada petición hasta 5 veces (esperas de 2, 4, 8 y 16 s con jitter), pausa 0,6 s entre
  segmentos, escribe cada archivo de forma atómica y termina con código 1 listando los ids que fallaron.
- `render.mjs` y `qa-frames.mjs` empaquetan el vídeo (`remotion bundle`) **antes** de abrir Chrome y
  renderizan desde ese paquete. Si el empaquetado corre a la vez que el arranque del navegador, en un
  equipo cargado webpack bloquea el proceso y Remotion aborta con «Timed out after 25000 ms while trying
  to connect to the browser» (pasó el 2026-09-25 con la CPU al 90 %).
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
| `video/<slug>/src/timeline.json` | timeline que lee la composición | sí |
| `video/<slug>/public/voice/<id>.mp3`, `tts/<id>.json` | clips de voz y tiempos por palabra | sí (caché reproducible) |
| `public/videos/<output>.mp4` | vídeo final, perfiles `principal`/`capsula` | sí |
| `video/<slug>/out/<output>.mp4` | vídeo final, perfiles `principal-yt`/`capsula-yt` (se sube a YouTube, no se commitea) | no |
| `public/videos/<output>-poster.png` | póster (id `poster` de `video.json`); en `public/videos/` en los cuatro perfiles | sí |
| `public/videos/<output>-transcript.txt` | transcripción por escenas | sí |
| `public/videos/<output>-captions.vtt` | subtítulos WebVTT del reproductor (una entrada por página de subtítulo quemada en el vídeo) | sí |
| `video/<slug>/out/youtube.md` | título, descripción, etiquetas y archivos a subir (`youtube-meta.mjs`, solo perfiles `-yt`) | no |
| `out/draft.mp4`, `out/qa/<escena>/`, `out/tts-input.json` | borradores y fotogramas de revisión | no |
| `.audition/<voz>.mp3`, `.audition/audition.txt` | audición de voces | no |

`out/qa/<escena|all>/` contiene `f<fotograma>_<escena>_<qué>.jpeg` (inicio y final de escena, cada cue,
tarjeta de examen y pausa) e `index.json` con el mapa archivo → fotograma → escena/cue.

## Pruebas

`scripts/test_*.py` (unittest, sin dependencias: `python -m unittest discover -s video/engine/scripts -p "test_*.py"`)
cubre la normalización y la puntuación de guion del worker de Chatterbox.

`scripts/lib/*.test.mjs` (node:test, sin dependencias): marcas y léxico, alineación con límites de palabra
que faltan o sobran (incluidos límites reales grabados de edge-tts en `fixtures/edge-boundaries.json`),
paginación de subtítulos, receta de tiempos y validaciones del timeline. La prueba de modo audio usa
`out/test/tts2/`; si no existe se omite. Para generarla:

```bash
F=video/engine/scripts/lib/fixtures/tts2
python -X utf8 video/engine/scripts/tts.py --narration $F/narration.json --lexicon $F/lexicon.json \
  --storyboard $F/storyboard.json --voice-dir video/engine/out/test/tts2/voice --tts-dir video/engine/out/test/tts2/tts
```

## Licencias

Tipografías en `engine/src/fonts/` (se importan en `theme/fonts.ts`, así que todos los vídeos las comparten): Inter y JetBrains Mono, ambas bajo SIL Open Font License 1.1
(`engine/src/fonts/OFL.txt`). La voz se sintetiza con el servicio de voces neurales que usa `edge-tts`;
revisa sus condiciones antes de publicar.
