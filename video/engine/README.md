# Motor de vídeos de lección

Tubería compartida, hecha con [Remotion](https://www.remotion.dev/) 4, para los vídeos que se incrustan en
las lecciones de Alertópolis (bloques `t: 'video'`). Cada vídeo vive en su carpeta
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

**Tarjetas de examen por pista** (`video.json` → `"track"`): en Security+, `exam.objective` es un objetivo
SY0-701 («4.5») y la tarjeta dice «EXAMEN · SY0-701 · 4.5». GCTI no publica objetivos numerados, así que en
GCTI `exam.objective` es uno de los cinco dominios del curso (`GCTI_DOMAINS` de `scripts/lib/profiles.mjs`,
p. ej. «Intrusion Analysis»), la tarjeta dice «EXAMEN · GCTI · Intrusion Analysis» (campo `badge` de la
tarjeta en `timeline.json`, que solo se escribe fuera de Security+) y la etiqueta de YouTube es el dominio tal
cual, sin «objetivo».

`host: 'youtube'` (los dos perfiles `-yt`) cambia dos cosas:

- **La ruta del MP4** (`lib/paths.mjs` → `mp4PathFor`): en vez de `public/videos/<output>.mp4` (se commitea),
  el vídeo final va a `video/<slug>/out/<output>.mp4`, que está ignorado por git. `render.mjs` se niega a
  renderizar un perfil `-yt` si esa ruta no está `git check-ignore`d. El **póster** siempre va a
  `public/videos/`, en los cuatro perfiles, porque pesa poco y lo necesita la app.
- **El tamaño**: con `size: null`, `render.mjs` no comprueba el peso del MP4 (solo avisa de que no se
  comprueba, porque YouTube vuelve a codificar el vídeo al subirlo).

**El aviso con la marca** (`trackNotice`, solo en la transcripción y en la descripción de YouTube — **no** en
el póster ni en la tarjeta final, ver «El póster y la tarjeta final» abajo): los perfiles antiguos
(`principal`, `capsula`) llevan `LEGACY_APP_NAME` («IntelForge Academy»), para que la regresión del SIEM siga
siendo byte a byte idéntica; los perfiles `-yt` llevan `APP_NAME` («Alertópolis»).

### El póster y la tarjeta final

El `profile` de `video.json` **no** decide el nombre que aparece en el póster (`src/Poster.tsx`) ni en la
tarjeta final de créditos (la escena de cierre): cada vídeo los escribe él mismo, a mano, como texto literal.
Un vídeo nuevo con perfil `-yt` debe escribir «ALERTÓPOLIS»; nunca se copian esos archivos de `video/siem/` o
`video/forense-adquisicion/` (que llevan «INTELFORGE ACADEMY», el nombre antiguo, para no romper su
regresión byte a byte) sin cambiar el nombre. `scripts/lib/brand-yt.test.mjs` vigila que ningún vídeo con
perfil `-yt` conserve «INTELFORGE ACADEMY» en su propio `src/`.

## Mensaje interceptado

Un aviso en pantalla, solo para los perfiles `-yt`: un mensaje del adversario de la sección aparece
interceptado, se escribe letra a letra y, a continuación, el segmento de narración lo responde con la
explicación. Sin `adversaryVoice` en `narration.json` el mensaje es mudo, como hasta ahora — ver «Con voz»
más abajo para cuando lo lleva.

- **`narration.json`**, en el segmento que responde: `"intercept": { "text": "…", "holdMs": 3500 }`.
  - `text`: 70 caracteres como máximo (`INTERCEPT_TEXT_MAX`), sin flechas, emoji ni los símbolos prohibidos de
    las tarjetas de examen. No se locuta con la voz de la narradora (pero puede tener la del adversario, ver
    «Con voz»).
  - `holdMs`: entre 2500 y 4500 (`INTERCEPT_HOLD_MS`) — el silencio **antes** del audio del segmento, que
    `build-timeline.mjs` añade retrasando el `from` del segmento ese mismo hueco (o más, con voz — ver «Con
    voz»), para dar tiempo a leer el mensaje. Un segmento no puede llevar `intercept` y `think` a la vez.
- **`video.json`**: `"adversary": "SILENT PAGER"`. Obligatorio en cuanto algún segmento use `intercept`; si
  falta, `build-timeline.mjs` lo rechaza como error (`analyzeNarration` no lee `video.json`, así que esta
  comprobación concreta vive donde ambos archivos ya se cruzan).
- **`build-timeline.mjs`**:
  - retrasa el `from` del segmento (el inicio de su audio) el hueco calculado (`holdMs`, o más largo con voz);
    la entrada de `intercept[]` empieza en el fotograma donde arrancaría ese audio sin el retraso (el
    principio del silencio) y dura hasta que terminan el audio y la pausa del segmento;
  - escribe la clave opcional `timeline.intercept[]` (`from`, `durationInFrames`, `text`, `adversary`, y con
    voz `audio`, `audioFrom`, `audioFrames`), **solo cuando hay alguno** — así el `timeline.json` de un vídeo
    sin `intercept` (SIEM, forense) sigue siendo byte a byte idéntico, y `validate-timeline.mjs` la trata como
    opcional;
  - los subtítulos no incluyen el mensaje, porque no es voz de la narradora; la transcripción sí, como
    `[Mensaje interceptado · SILENT PAGER] «…»`.
- **`src/overlay/InterceptLayer.tsx`**: la tarjeta, con acento rojo, el nombre del adversario y el efecto de
  escritura letra a letra; ocupa el mismo hueco que la pausa para pensar (nunca coinciden en el tiempo). Está
  en `OverlayGallery` para la QA visual. `src/overlay/SfxLayer.tsx` reproduce el audio (voz del adversario y
  efectos de sonido, ver «Efectos de sonido»): ninguno de los dos dibuja nada en pantalla.

Validación completa: `analyzeNarration` da error si hay más de 1 mensaje por capítulo, si hay uno en la escena
final o si `text`/`holdMs` está fuera de rango, y avisa (no falla) si el recuento total queda fuera del rango
del perfil (tabla de «Perfiles»). El único error que no pasa por `analyzeNarration` es el de `adversary`
ausente, arriba, porque `analyzeNarration` no lee `video.json`.

### Con voz

`narration.json` → `"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }`
(opcional; único proveedor por ahora: `sapi/<nombre de voz de Windows>`, `rate` entero de −10 a 10,
`fx` solo `"machine"`). Sin ella los mensajes siguen mudos. Tenerla sin ningún segmento con `intercept` es un
aviso, no un error.

**Requiere PowerShell 7 (`pwsh`).** `tts-adversary.mjs` sintetiza a través de `pwsh` cuando está disponible:
Windows PowerShell 5.1 (`powershell.exe`) solo enumera las voces clásicas de `System.Speech.Synthesis`, así
que una voz moderna instalada solo como paquete OneCore (como «Microsoft Pablo») le resulta invisible aunque
esté instalada; `pwsh` sí ve las voces OneCore. Solo cae a `powershell.exe` cuando `pwsh` no se puede lanzar
(no instalado / no está en el PATH) — en ese caso el error de «voz no instalada» no lista Pablo aunque lo
esté.

`scripts/tts-adversary.mjs --video <slug>` genera, por cada segmento con `intercept`: `scripts/sapi_tts.ps1`
sintetiza `intercept.text` con `System.Speech.Synthesis.SpeechSynthesizer` a un WAV; `scripts/adversary_fx.py`
(venv de Chatterbox: librosa, scipy) aplica el preset `machine` (−4 semitonos, modulación en anillo
`0,6 + 0,4·sen(2π·48·t)`, paso banda Butterworth de orden 4 entre 120 y 5000 Hz, misma duración, pico
−1 dBFS); `runFfmpeg` lo iguala a la sonoridad de la narración (medida sobre los clips de `public/voice/`) y
lo codifica igual (24 kHz mono, MP3 CBR 96 kbps) en `public/voice/<segmento>-intercept.mp3`, junto a
`tts/<segmento>-intercept.json` (`key` = sha256 de voz + velocidad + preset + texto; el registro también
guarda `targetLufs`, la sonoridad de la narración a la que se niveló el clip). Un clip en caché se regenera si
su `key` o sus bytes ya no coinciden, o si `targetLufs` se ha alejado más de 1 dB de la sonoridad actual de la
narración (o falta, en un registro anterior a esta comprobación) — así **cambiar la voz de la narración
renivela automáticamente los clips del adversario** la próxima vez que se ejecute este paso, sin necesidad de
`--force`. `audio.mjs` ejecuta este paso antes de `build-timeline` en cuanto `narration.json` tiene
`adversaryVoice`, con cualquier voz de narración; mide la sonoridad de la narración una vez por ejecución
(la necesita para comprobar la caché de cada clip), pero con todos los clips en caché no llega a `pwsh` ni a
SAPI, así que esa comprobación funciona en cualquier sistema operativo — solo sintetizar necesita Windows.

El hueco (`holdMs`) crece: `voicedHoldFrames` (`scripts/lib/sfx.mjs`) usa el mayor del `holdMs` escrito y
`TYPE_START + fotogramas de la voz + 10` de margen. La voz del adversario empieza a sonar en
`intercept.from + TYPE_START`, cuando el mensaje empieza a escribirse en la tarjeta; esta sigue en pantalla
hasta que acaba la respuesta de la narradora. `ENTER`, `EXIT`, `TYPE_START` y `TYPE_RATE` viven en
`src/overlay/intercept-timing.json`, que leen tanto `build-timeline.mjs` como `InterceptLayer.tsx`, para que
no se desalineen. Una voz de Pablo dura ~5–6 s por mensaje: tres mensajes alargan el vídeo ~5–8 s.

## Efectos de sonido

`scripts/sfx_generate.py` genera, con semilla fija (byte a byte reproducible), la biblioteca de 11 sonidos en
`video/engine/sfx/<nombre>.mp3` + `sfx.json` (duración y volumen de cada uno, versionados: son pocos KB):
`glitch`, `typing`, `ding`, `whoosh`, `mail`, `check`, `error`, `block`, `alarm`, `ping2`, `lock`. Todos se
normalizan a −1 dBFS de pico antes de codificar (el MP3 entregado queda entre −1,5 y −0,5 dBFS, porque la
codificación desplaza el pico). Necesita el python del venv de Chatterbox (numpy, scipy, soundfile):

```bash
video/engine/.venv-chatterbox/Scripts/python.exe video/engine/scripts/sfx_generate.py --preview video/engine/out/sfx-preview.mp3
```

escribe un muestrario (con los mismos volúmenes de mezcla que el vídeo) para escucharlos antes de tocar los
volúmenes.

Colocación automática (solo cuando `narration.json` tiene la clave `sfx`, **aunque sea `{}`** — así los
vídeos publicados sin ella no cambian): `glitch` en cada `intercept.from`; `typing` desde
`intercept.from + TYPE_START` durante `texto.length × TYPE_RATE` fotogramas; `ding` en cada tarjeta de
examen (`exam.from`); `whoosh` en el inicio visual de la primera escena de cada capítulo nuevo. Además,
`narration.json` → `"sfx": { "<id de cue>": "<sonido>" }` pone un efecto en el fotograma de ese cue. El mapa
va por **id de cue solo** (no por escena): si ese id apareciera en más de una escena, `build-timeline.mjs` lo
rechaza como error, en vez de colocar el sonido en todas ellas sin avisar. Para `capas-halden`:

```json
"sfx": {
  "mail-in": "mail", "spf-pass": "check", "dkim-pass": "check", "dmarc-fail": "error",
  "reject": "block", "blocked": "block", "implicit": "block", "alert": "alarm",
  "inline": "block", "hits-2": "ping2", "isolate": "lock", "dlp": "block"
}
```

`build-timeline.mjs` escribe `timeline.sfx[]` (`from`, `sound`, `src`, `durationInFrames`, `volume`) y copia a
`video/<slug>/public/sfx/` los sonidos que usa (Remotion solo lee la carpeta pública del vídeo), borrando ahí
los que ya no se usan. La voz de la narradora y la del adversario suenan a volumen 1; los volúmenes de los
efectos (entre 0,024 y 0,170; tabla completa en el spec
`docs/superpowers/specs/2026-09-28-adversary-voice-sfx-design.md` §4.1) se miden con `ffmpeg loudnorm` para que
la voz siempre suene más alta que los efectos: con la narración a unos −25 LUFS, cada efecto queda 12 dB por
debajo (−37 LUFS), salvo `whoosh` (14 dB por debajo) y `typing` (25 dB por debajo) — bajos a propósito, para no
distraer. `src/overlay/SfxLayer.tsx` los reproduce junto con la voz del adversario (ver «Con voz»).

## Cómo está hecho

```
storyboard.json + narration.json + lexicon.json      (de video/<slug>/)
      │
      ├─ scripts/prepare-tts.mjs  resuelve marcas + léxico -> out/tts-input.json (texto hablado)
      ├─ scripts/tts.py           edge-tts -> public/voice/<id>.mp3 + tts/<id>.json (tiempos por palabra)
      ├─ scripts/tts-adversary.mjs  (solo con "adversaryVoice") -> public/voice/<seg>-intercept.mp3
      │                              + tts/<seg>-intercept.json — ver «Mensaje interceptado» → «Con voz»
      └─ scripts/build-timeline.mjs -> src/timeline.json (lo único que lee Remotion)
                                     + public/videos/<output>-transcript.txt
                                     + public/videos/<output>-captions.vtt
                                     + (con "sfx") copia de video/engine/sfx/*.mp3 -> public/sfx/
```

`video/engine/sfx/` (biblioteca de efectos, `scripts/sfx_generate.py`, ver «Efectos de sonido») es una fuente
más para `build-timeline.mjs`: junto al storyboard, la narración y el léxico, entra en `timeline.sourceHash`
en cuanto `narration.json` tiene la clave `sfx`, para que una biblioteca regenerada invalide un timeline
construido contra la anterior.

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
- `"recording/<nombre>"`: la narradora lee el guion entero con su micrófono y `import-recording.mjs` lo
  corta en clips. Ver [Voz: grabación propia](#voz-grabación-propia).

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

**Ajustes.** Van en `narration.json` → `"chatterbox"`, por ejemplo `"chatterbox": { "tempo": 0.8,
"temperature": 0.7 }`:
- `exaggeration`: 0.5 es neutro; más alto, más dramático.
- `cfg_weight`: más bajo, locución más pausada.
- `temperature`.
- `tempo`: velocidad de habla, aplicada al codificar el clip con el filtro `atempo` de ffmpeg (conserva
  el tono, no queda ni «pitcheado» ni robótico). `1` = sin cambios, `0.8` = 80 % de velocidad (más
  lento). Debe estar entre `0.5` y `1.5`; fuera de ese rango `tts-chatterbox.mjs` lanza un error claro
  en vez de llamar a ffmpeg con un valor que no tiene sentido.
- `seed`: base de la semilla por segmento.
- `asr_model`: modelo de faster-whisper, `small` por defecto.
- `min_score` y `attempts`: control de las tomas, como se explica arriba.

Cambiar la voz, el clip o un ajuste de audio vuelve a sintetizar; cambiar `asr_model`, `min_score` o
`attempts` no. `tempo` cuenta como ajuste de audio aunque no cambie lo que dice el worker de
Chatterbox (solo cómo se recodifica el WAV que ya sintetizó): cambiarlo invalida igualmente la caché
de síntesis de cada clip — vuelve a pasar por el worker en vez de solo recodificar — pero se acepta
así para no complicar la clave de caché con un caso especial.

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
node video/engine/scripts/tts-chatterbox.mjs --video <slug> --audition --moods [--voices es-es/default] [--tempo 0.8] [--temperature 0.7]
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

Tanto `--audition` como `--audition --moods` aceptan `--tempo <n>` y `--temperature <n>` para probar
otra velocidad u otra temperatura sin tocar `narration.json`: por defecto usan `DEFAULT_SETTINGS`
(`tempo` 1, `temperature` 0.8). Cuando alguno de los dos difiere de su valor por defecto, el nombre del
archivo lleva un sufijo (`-t080` con `tempo` 0.8, `-temp070` con `temperature` 0.7, `-t080-temp070` si
difieren los dos), para no pisar la audición hecha con los valores por defecto.

**Marca de agua.** Todo el audio sale con la marca de agua neuronal Perth de Resemble AI. No se oye.

```bash
# Entorno (una vez): Python 3.12, torch de CPU, en D: para no llenar C:
C:/Python312/python.exe -m venv video/engine/.venv-chatterbox
video/engine/.venv-chatterbox/Scripts/python.exe -m pip install -r video/engine/scripts/requirements-chatterbox.txt

# Audición: la misma frase con cada voz, en video/<slug>/.audition/chatterbox-*.mp3
node video/engine/scripts/tts-chatterbox.mjs --video <slug> --audition --voices mtl/default,es-es/default [--respelled] [--tempo 0.8] [--temperature 0.7]

# Síntesis (solo los segmentos que cambian; --only s01-02 --force para rehacer uno) + timeline
node video/engine/scripts/audio.mjs --video <slug>
```

Los modelos (~4 GB) se descargan la primera vez en `video/engine/.cache/huggingface/`, también ignorada
por git. Así `HF_HOME` no apunta a C:.

**Rendimiento en CPU.** El proceso ocupa entre 4 y 6 GB de RAM. Tarda varias veces más que la duración del
audio, así que una cápsula lleva de 30 a 60 minutos. Todo va en un solo proceso que carga los modelos una
vez; conviene lanzarlo en segundo plano con el equipo descargado.

## Voz: grabación propia

La narradora graba el guion entero de una vez (un WAV, por ejemplo en `video/engine/voices/`, ignorada por
git) y `scripts/import-recording.mjs` lo convierte en los mismos clips que escriben los proveedores de TTS
(`tts/<id>.json` + `public/voice/<id>.mp3`) para la voz `"recording/<nombre>"`:

1. **Transcribe** la grabación con marcas de tiempo por palabra (`scripts/recording_asr.py`, faster-whisper
   `small` en el venv de Chatterbox). El resultado se guarda en `out/recording/<nombre>/asr-<archivo>.json` y se
   reutiliza mientras no cambien el archivo (hash) ni la pista que se le da a Whisper (la primera frase del guion,
   el adversario y las siglas del léxico); `--force-asr` lo rehace. Tarda ~7–10 min por 12 min de audio en CPU.
2. **Localiza** cada frase del guion, en orden (`lib/recording.mjs`). Compara con el texto mostrado y con el
   hablado de `[mostrado|hablado]`, con los números en palabras, así que tolera lo que Whisper escribe mal
   («de Mark» por DMARC, «4.00 y 12.00»). Si una frase se leyó varias veces, **se queda con la última toma**;
   lo que no está en el guion (tarjetas de examen, mensajes interceptados, arranques en falso) se descarta.
3. **Corta** cada clip en el silencio más cercano a sus palabras (o, si se habla de corrido, a medio camino
   de la palabra vecina), aplica **una sola ganancia** a toda la grabación (hasta la sonoridad de `--match
   <clip>`, o `--lufs`, sin pasar de −1 dBTP) y codifica como Chatterbox (24 kHz mono, MP3 CBR 96 kbps).
4. **Informa** en `out/recording/<nombre>/report-<archivo>.md`: la coincidencia de cada frase («revisar» por debajo de
   0,9: sobran o faltan palabras, escúchala), las que no encontró (sin clip: `build-timeline` las nombrará) y
   los trozos de la grabación que no usó.

Una frase que salga mal se regraba: se graban solo esas frases, en el orden del guion, en otro archivo, y se
importa con `--only <ids>`; los demás clips no se tocan. No se pueden quitar palabras de en medio de un clip
(un rótulo leído en voz alta dentro de una frase se queda). Las animaciones que se disparan en una
palabra usan los tiempos de Whisper, que pueden desviarse ~0,2 s.

```bash
# Clips en las carpetas del vídeo (o --tts-dir/--voice-dir para dejarlos aparte) + informe
node video/engine/scripts/import-recording.mjs --video <slug> --file "video/engine/voices/<grabación>.wav" --name <nombre> --match <clip de referencia>.mp3
# Sustituir solo unas frases regrabadas (mismas carpetas y referencia de volumen)
node video/engine/scripts/import-recording.mjs --video <slug> --file "video/engine/voices/<regrabación>.wav" --name <nombre> --only s02-03,s04-01 --match <clip de referencia>.mp3
# Con "voice": "recording/<nombre>" en narration.json, audio.mjs solo reconstruye el timeline
node video/engine/scripts/audio.mjs --video <slug>
```

## Masterización: voz y programa

Dos pasos opcionales, en Python (venv de Chatterbox con `pip install pedalboard pyloudnorm librosa soundfile scipy`):

- **`scripts/master_voice.py`**, sobre la grabación **antes** de `import-recording.mjs`: mono, paso alto a 70 Hz,
  EQ correctiva (−1,5 dB a 300 Hz, +2 dB a 3,2 kHz), de-esser dinámico en 5–9 kHz (hasta −8 dB), un poco de
  «aire» por encima de 8,5 kHz (excitador armónico suave) y compresión ligera (2,5:1), a −20 LUFS con limitador
  a −3 dBFS. Toda la cadena conserva la longitud y los tiempos (filtros de fase cero, limitador sin latencia),
  así que Whisper y los cortes no se mueven. **No reduce ruido**: una grabación con silencios digitales ya viene
  sin ruido y una segunda pasada solo añade artefactos. `--ab` escribe un antes/después igualado en volumen.
- **`scripts/master_mix.py`**, sobre el MP4 ya renderizado: añade un **ambiente** generado aquí (pad oscuro con un
  acorde por capítulo, fundido en cada cambio, más un tono de sala muy bajo; unos 20–25 LU por debajo de la voz y
  6 dB más bajo mientras alguien habla, según el timeline), lleva el programa a **−14 LUFS** (YouTube) y limita el
  pico real a **−1 dBTP** (detección 4× sin latencia). El vídeo se copia tal cual; el audio sale en AAC 192 kbps.
  `--bed-db` sube o baja el ambiente, `--no-bed` lo quita.

```bash
python video/engine/scripts/master_voice.py --in "video/engine/voices/<grabación>.wav" --out "video/engine/voices/<grabación> (master).wav" --ab video/<slug>/out/voz-antes-despues.wav
# ... import-recording con el WAV masterizado, audio.mjs y render.mjs ...
python video/engine/scripts/master_mix.py --video-in video/<slug>/out/<slug>.mp4 --timeline video/<slug>/src/timeline.json --out video/<slug>/out/<slug>-master.mp4
```

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
| `video/<slug>/public/voice/<seg>-intercept.mp3`, `tts/<seg>-intercept.json` | voz del adversario por mensaje interceptado (solo con `adversaryVoice`) | sí (caché reproducible) |
| `video/engine/sfx/*.mp3`, `sfx.json` | biblioteca de efectos de sonido (`sfx_generate.py`, semilla fija) | sí |
| `video/<slug>/public/sfx/*.mp3` | copia de los efectos que usa este vídeo (Remotion solo lee la carpeta pública del vídeo) | no — generada por `build-timeline.mjs` a partir de la biblioteca |
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
cubre la normalización y la puntuación de guion del worker de Chatterbox, cómo `recording_asr.py` aplana las
palabras de Whisper, `test_sfx_generate.py` (la biblioteca de sonidos: duraciones, pico y reproducibilidad de
la semilla) y `test_adversary_fx.py` (el preset `machine`: conserva la duración y deja el pico en −1 dBFS).

`scripts/lib/*.test.mjs` (node:test, sin dependencias): marcas y léxico, alineación con límites de palabra
que faltan o sobran (incluidos límites reales grabados de edge-tts en `fixtures/edge-boundaries.json`),
paginación de subtítulos, receta de tiempos y validaciones del timeline. `recording.test.mjs` cubre la
grabación propia: localizar frases (última toma, arranques en falso, audio fuera del guion, números),
cortes en silencios, ganancia e informe. `sfx.test.mjs` cubre `voicedHoldFrames`, `placeSfx` (sonidos
automáticos y momentos clave) y `sfxMapErrors`; `adversary.test.mjs` cubre la validación de
`adversaryVoice`, la clave de caché y el registro `tts/<segmento>-intercept.json`. La prueba de modo audio usa
`out/test/tts2/`; si no existe se omite. Para generarla:

```bash
F=video/engine/scripts/lib/fixtures/tts2
python -X utf8 video/engine/scripts/tts.py --narration $F/narration.json --lexicon $F/lexicon.json \
  --storyboard $F/storyboard.json --voice-dir video/engine/out/test/tts2/voice --tts-dir video/engine/out/test/tts2/tts
```

## Licencias

Tipografías en `engine/src/fonts/` (se importan en `theme/fonts.ts`, así que todos los vídeos las comparten): Inter y JetBrains Mono, ambas bajo SIL Open Font License 1.1
(`engine/src/fonts/OFL.txt`). La voz se sintetiza con el servicio de voces neurales que usa `edge-tts`;
revisa sus condiciones antes de publicar. La voz del adversario usa una voz SAPI de Windows (`scripts/sapi_tts.ps1`),
pensada para uso en el propio equipo: revisa sus condiciones antes de monetizar el canal (hoy no se
monetiza).
