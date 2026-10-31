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
| `profile` | uno de los seis perfiles (`principal`, `capsula`, `principal-yt`, `capsula-yt`, `caso-yt`, `caso-principal-yt`); ver «Perfiles» |
| `track` | descargo de la transcripción: `secplus` (no afiliado a CompTIA) o `gcti` (no afiliado a SANS/GIAC) |
| `adversary` | opcional; el adversario de la sección (p. ej. `SILENT PAGER`). Obligatorio en cuanto algún segmento de `narration.json` use `intercept` — ver «Mensaje interceptado» |
| `simulationLabel` | opcional (≤ 40 caracteres); sustituye «Simulación educativa · datos ficticios» en el sello de la esquina y el arranque de la cabecera de la transcripción y de la descripción de YouTube, para un vídeo que cuenta casos reales. Sin él todo sale como siempre (el campo solo se escribe en `timeline.json` cuando existe) |
| `lesson` | opcional; el id de módulo (p. ej. `sp4m7`) que enlaza la descripción de YouTube (`youtube-meta.mjs`) |

Todos los scripts eligen el vídeo con `--video <slug>` (o la variable `VIDEO`; por defecto `siem`).

## Perfiles

`video.json` → `"profile"` fija el formato del vídeo (`scripts/lib/profiles.mjs`; ver también el plan
`docs/superpowers/plans/2026-09-25-lesson-videos.md` §1):

| | `principal` | `capsula` | `principal-yt` | `capsula-yt` | `caso-yt` | `caso-principal-yt` |
| --- | --- | --- | --- | --- | --- | --- |
| Duración (`minTotalSec`–`maxTotalSec`) | 280–340 s | 140–200 s | **380–600 s** (hasta 10 min desde V5) | **190–260 s** | **240–330 s** | **420–600 s** |
| Capítulos (`maxChapters`) | 5 | 3 | 5 | 3 | 3 | 5 |
| Tarjetas de examen (`examCards`) | 8–11 | 4–6 | **5–8** | **3–5** | **3–5** | **5–8** |
| Pausas para pensar (`thinkPrompts`) | 2 | 1 | 2 | 1 | 0 | 0 |
| Mensajes interceptados (`intercepts`) | 0 | 0 | **2–4, máx. 1/capítulo** | **1–2** | **0–1** | **0–2** |
| Preguntas de examen (`examQuestions`) | 0 | 0 | 0 | 0 | **3** | **4–5** |
| Avisos de narración hablada (`chispa`) | no | no | **sí** | **sí** | **sí** | **sí** |
| `host` | `repo` | `repo` | **`youtube`** | **`youtube`** | **`youtube`** | **`youtube`** |
| `crf` | 23 | 27 | **18** | **18** | **18** | **18** |
| Tamaño objetivo (`size`) | 15–25 MB (aviso > 30, error > 45) | 4–12 MB (aviso > 15, error > 25) | **sin objetivo** | **sin objetivo** | **sin objetivo** | **sin objetivo** |

Los dos perfiles `caso-*` son los del formato «caso y examen» (diseño
`docs/superpowers/specs/2026-10-16-secplus-casos-examen-design.md`, plan
`docs/superpowers/plans/2026-10-16-video-engine-caso-examen.md`): un caso contado en capítulos, con preguntas
tipo examen en pantalla (ver «Pregunta de examen» más abajo). En todo lo demás se comportan como `capsula-yt` y
`principal-yt`: `host: 'youtube'`, `crf` 18, preset `medium`, sin subtítulos grabados en la imagen y el aviso de
marca `APP_NAME` (`trackNotice` solo mira el `host`). No llevan pausas para pensar (`thinkPrompts: 0`): la
pregunta de examen ocupa ese hueco.

**Claridad y ritmo** (revisión del 2026-09-29, `docs/reviews/2026-09-29-videos/`): `think.holdMs` admite hasta 5000 ms y
los perfiles `-yt` avisan por debajo de 4000 (la entrada y la salida de la tarjeta se comen ~0,9 s);
`narration.json` → `"examTiming": "sentence-end"` hace que cada tarjeta de examen espere a que termine la oración que
contiene su cue (primero el ejemplo, después la regla), retrasada solo hasta donde quepa en su escena y nunca antes
de su cue; y `build-timeline` avisa en los `-yt` si el cue `title` llega después de los 12 primeros segundos.

**Narración hablada.** Las reglas de escritura de los vídeos `-yt` (hablar como una persona, menos conceptos
mejor contados, ritmo) viven en una sola copia: el plan `docs/superpowers/plans/2026-09-25-lesson-videos.md`
§1, «Narración hablada». Con `chispa: true`, `analyzeNarration` (`scripts/lib/narration.mjs`) avisa —nunca
falla— de lo que se detecta sin leer: la misma emoción en dos segmentos seguidos, `;` en la voz, más de un
«:» de conector en un segmento o «:» en más de un tercio de ellos, un dominio/IP/equipo/hash/correo/fichero
leído en voz alta (`IDENTIFIER_PATTERNS`) y más de `OPENER_MAX` (3) preguntas que empiezan igual («¿Y …?»).
Lo demás (acotaciones, conceptos usados antes de explicarlos, analogías amontonadas) lo mira el revisor de
naturalidad del recetario.

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
`fx` `"machine"` —el de siempre—, `"telefono"`, `"cifrado"` o `"megafonia"`). Sin ella los mensajes siguen mudos. Tenerla sin ningún segmento con `intercept` es un
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
−1 dBFS) o el preset `telefono`, una llamada de banda estrecha: sin cambio de tono ni modulación en anillo,
una saturación suave (`tanh`), un siseo de línea casi inaudible (−50 dB, con semilla fija) y un paso banda
Butterworth de orden 6 sin desfase entre 300 y 3400 Hz, también con la misma duración y pico −1 dBFS. Lo
añadimos para RED MARROW (V10, sp2m7), que usa la misma voz Laura que PAPER CRANE: con `machine` habrían
sonado igual. Y el preset `cifrado`, una transmisión digital pobre y seca, sin cambio de tono, sin anillo, sin
banda de teléfono y sin sala: cada muestra se retiene hasta unos 11 kHz sin filtrar antes (el aliasing da el brillo
metálico), se cuantiza a 6 bits (el crujido) y una puerta de ruido (RMS de 20 ms, −36 dB bajo el momento más fuerte,
bordes de 3 ms) deja en silencio digital las colas entre palabras; misma duración y pico −1 dBFS. Es la voz de NULL
CIPHER (V11, sp1m6), con Helena. Y el preset `megafonia`, un aviso por los altavoces de una nave vacía, que trabaja
el espacio en vez de la señal: paso banda Butterworth de orden 4 sin desfase entre 250 y 5000 Hz (la bocina), un
realce de +6 dB hacia 2 kHz, un eco temprano a 90 ms (−6 dB) y una cola de hormigón de ~1 s (ruido con semilla fija
que decae 60 dB en un segundo); sin cambio de tono, misma duración (la cola se corta con un fundido de 40 ms al
final) y pico −1 dBFS. Es la voz de BLIND ARCHITECT (V16–V17, sp3), con Helena a `rate` −2. `runFfmpeg` lo iguala a la sonoridad de la narración (medida sobre los clips de `public/voice/`) y
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

## Pregunta de examen

Solo para los perfiles `caso-yt` y `caso-principal-yt` (el formato «caso y examen»): una pregunta tipo examen en
pantalla, con su escenario, cuatro opciones A–D, una cuenta atrás de silencio para que quien mira pause el vídeo y
conteste, y después la respuesta correcta y la trampa más tentadora. Los textos los escribe el guion, en español y
con los términos del examen en inglés; el motor no traduce nada. Diseño:
`docs/superpowers/specs/2026-10-16-secplus-casos-examen-design.md`.

- **`narration.json`**, en el segmento que plantea la pregunta (la voz cuenta el caso y la pregunta; las opciones
  quedan para la pantalla):

  ```json
  "question": {
    "objective": "1.1",
    "scenario": "La grúa 4 corre un sistema que no admite parches…",
    "q": "¿Qué tipo de control es el aislamiento en su VLAN?",
    "options": ["Preventive", "Compensating", "Detective", "Directive"],
    "answer": 1,
    "trap": 0,
    "why": "Sustituye al parche que no se puede aplicar",
    "trapWhy": "Impide algo, pero su papel es suplir otro control",
    "countdownMs": 5000,
    "revealAt": "reveal-1"
  }
  ```

  | Campo | Qué es |
  | --- | --- |
  | `objective` | objetivo SY0-701 (o dominio del curso en GCTI); se valida igual que el de una tarjeta de examen (`examObjectiveError`) |
  | `scenario`, `q` | el caso en una frase (≤ 160 caracteres) y la pregunta (≤ 110) |
  | `options` | exactamente cuatro, ≤ 70 caracteres cada una (como mucho dos líneas en pantalla) |
  | `answer`, `trap` | índices 0–3 de la correcta y de la trampa; distintos |
  | `why`, `trapWhy` | una frase para cada una (≤ 90): por qué es la correcta y por qué tienta la otra |
  | `countdownMs` | el silencio tras el audio del segmento, entre 4000 y 7000 (5000 si falta) |
  | `revealAt` | cue (`{reveal-1}`) de un segmento **posterior de la misma escena**: ahí se marca la correcta |
  | `trapAt` | opcional; cue posterior donde se marca la trampa. Por defecto, `revealAt`; nunca antes de `revealAt` |

  Los textos pasan el mismo filtro de símbolos prohibidos que las tarjetas de examen (sin flechas ni emoji).
- **Reglas de `analyzeNarration`:**
  - **errores:** campos mal formados (`options`, `answer`/`trap`, límites de texto, `countdownMs`, `objective`, símbolos
    prohibidos); más de una pregunta por escena, o una en la escena final; pregunta en una escena con pausa para
    pensar o con mensaje interceptado; `revealAt`/`trapAt` que no sean cues de un segmento posterior de su
    escena, o `trapAt` antes de `revealAt`;
  - **avisos** (no fallan): la voz lee una opción literal en el segmento de la pregunta o en los anteriores a la
    revelación —la ve en pantalla, debe decir el razonamiento—; después de la revelación nombrar la correcta
    al explicarla es lo deseado y no avisa; el recuento de preguntas fuera de `examQuestions` del perfil (3 en
    `caso-yt`, 4–5 en `caso-principal-yt`); los segmentos con `question` no cuentan para el aviso de
    «¿Qué…?» repetido (la voz lee cada pregunta por diseño).
- **`build-timeline.mjs`:**
  - la cuenta atrás es silencio justo después del audio del segmento (como la pausa para pensar) y se suma a su
    `durationInFrames`;
  - escribe la clave opcional `timeline.questions[]` (`QuestionCue` en `src/timeline/types.ts`: `from`,
    `durationInFrames` hasta el final de la escena, `countdownFrom`, `countdownFrames`, `revealFrame`,
    `trapFrame`, `objective`, `badge` fuera de Security+, textos, `options`, `answer`, `trap`), **solo cuando hay
    alguna**: el `timeline.json`, el VTT y la transcripción de un vídeo sin `question` salen byte a byte iguales
    que antes. `validate-timeline.mjs` la trata como opcional;
  - es error que la revelación caiga antes de que acabe la cuenta atrás, y que una tarjeta de examen entre en
    la escena de una pregunta antes del fotograma de la trampa (después sí: la ficha del piloto pone una
    tarjeta tras cada revelación);
  - el VTT lleva las cuatro opciones (`A) …` a `D) …`) como un cue más durante la cuenta atrás, mezclado en
    orden con las páginas de subtítulos;
  - la transcripción añade tras el segmento de la pregunta `[Pregunta de examen · <insignia> <objetivo>] <escenario> <pregunta> A) … D) …`
    y tras el segmento de la revelación `Correcta: <letra> — <why>. Trampa: <letra> — <trapWhy>.`;
  - aviso (no falla) si a la escena de la pregunta le quedan menos de 3 s de pantalla tras marcar la trampa:
    es el tiempo para leer las explicaciones.
- **`src/overlay/ExamQuestionLayer.tsx`:** oscurece la escena y centra un panel con la plaquita
  `EXAMEN · <badge> · <objetivo>`, el escenario, la pregunta y las cuatro opciones, que entran escalonadas. Durante
  la cuenta atrás dibuja el anillo (`CountdownRing`, exportado de `ThinkPrompt.tsx`) con el rótulo «Pausa si
  quieres». En `revealFrame` marca la correcta (esmeralda, check, «Correcta» y su `why`) y apaga las otras al 40 %;
  en `trapFrame`, la trampa (ámbar, alerta, «Trampa» y su `trapWhy`). La correcta y la trampa se distinguen por
  icono y etiqueta, no solo por color. Nada por debajo de 30 px a 1080p, y deja libre la franja donde entra la
  tarjeta de examen. No trae sonidos propios: los pone el guion con `sfx` (la ficha del piloto usa `check` al
  revelar y `block` en la trampa). Está en `OverlayGallery` (`QUESTIONS`: una pregunta normal y otra con el caso
  extremo de 160 y 4 × 70 caracteres) con fotogramas de entrada, mitad de la cuenta atrás, revelación y trampa;
  la cabecera del fichero los lista.
- **Hoja de grabación:** bajo cada segmento con pregunta, «(En pantalla: la pregunta y sus cuatro opciones. Deja
  cinco segundos de silencio.)», con los segundos de su `countdownMs`. Quien graba deja ese silencio en la toma.
- **Brief de escena y canon:** `scene-brief.mjs` avisa de que la tarjeta cubre el escenario desde el segmento de la
  pregunta hasta el final de la escena (la escena debe quedarse quieta y sin texto importante ahí) y de en qué cue
  se revela cada cosa; `canon-check.mjs` incluye el escenario, la pregunta, las opciones y las dos explicaciones
  entre los textos que cruza con la campaña.
- **Regla de redacción (ficha V28, plan de vídeos §1):** en una escena con pregunta, `wordBudget` = (`s` −
  segundos de cuenta atrás − 3) × 2,7, porque las opciones se leen en silencio.

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
# En un git worktree (no tiene su propio venv, y en un disco exFAT no admite enlaces): usa el de la copia principal
export CHATTERBOX_PYTHON="D:/LLM projects/TICourse/video/engine/.venv-chatterbox/Scripts/python.exe"

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
   `small` en el venv de Chatterbox), con una pista inicial (la primera frase del guion, el adversario y las siglas
   del léxico) para que escriba los nombres como el guion. **Los silencios largos no se le pasan a Whisper**
   (`asrClips`): 8 s o más al principio o al final, 15 s o más en medio, dejando 1 s de aire a cada lado y con las
   marcas de tiempo en el tiempo de la grabación (`clip_timestamps`). Whisper oye en ventanas de 30 s y la pista
   solo cuenta en la primera que descodifica: V10 (`logs-halden`) empezaba con 28,5 s de silencio, Whisper tiró esa
   ventana por «sin voz» y en la siguiente se saltó el final de la primera frase, que repetía la pista, así que
   s01-01 se quedó sin clip; con 10 s de silencio ya escribía la pista dentro del silencio. Ninguna grabación
   publicada llega a esos umbrales (como mucho 5,9 s en un borde y 13,7 s en medio), así que se transcriben igual
   que antes. El resultado se guarda en `out/recording/<nombre>/asr-<archivo>.json` y se reutiliza mientras no
   cambien el archivo (hash), el modelo ni los tramos que oye Whisper (una caché anterior a esto, hecha con la
   grabación entera, se rehace sola si la grabación tiene silencios largos); `--force-asr` lo rehace siempre.
   Tarda ~7–10 min por 12 min de audio en CPU.
2. **Localiza** cada frase del guion, en orden (`lib/recording.mjs`). Compara con el texto mostrado y con el
   hablado de `[mostrado|hablado]`, con los números en palabras, así que tolera lo que Whisper escribe mal
   («de Mark» por DMARC, «4.00 y 12.00»). Si una frase se leyó varias veces, **se queda con la última toma**;
   lo que no está en el guion (tarjetas de examen, mensajes interceptados, arranques en falso) se descarta.
   Y va más fino que la frase: si la narradora relee **solo una oración** (la que le salió mal) o reempieza
   una a medias, se queda con la **última toma de cada oración** y las empalma, cada parte cortada por su
   cuenta (`parts` en el resultado; el informe marca esas frases como «empalme»). El empalme solo se hace
   si se lee al menos tan bien como la toma entera, contra el texto mostrado o el hablado; en un empate
   gana la lectura posterior.
   **La última toma es la buena** (Lidia, 2026-10-20). Una toma es un grupo de tramos alrededor de su mejor
   lectura, no una cadena de tramos que se solapan: antes, un párrafo repetido sin pausa larga (AP01 s01-04,
   leído tres veces) fusionaba las lecturas por un tramo «puente» (las últimas palabras de una toma más el
   principio de la siguiente, a 2–5 puntos de ambas) y se quedaba con la primera. Una palabra de más al principio
   solo cuenta si se dice de seguido con el resto (`EDGE_PAUSE_MS`, 700 ms): si una pausa la separa, es la cola de
   la toma anterior. Como red de seguridad, `laterTakes` avisa de toda lectura de una frase (o de una oración) que
   queda sin usar **después** de la que se usó y antes de la siguiente frase: aparece en la consola con los
   comandos de `recut_recording.py` e `import-recording --only` y en el informe como «Tomas posteriores sin usar».
   Si sale alguna, escúchala y reconstruye el clip con ella (salvo que esa última toma se lea mal el guion).
3. **Corta** cada clip en el silencio más cercano a sus palabras (o, si se habla de corrido, a medio camino
   de la palabra vecina). Antes corrige los tiempos que Whisper estira sobre una pausa: una palabra que se
   traga una pausa larga entera se queda en el lado más largo (`repairSwallowedPauses`), y si una pausa larga
   **empieza dentro** de la palabra del borde, esa palabra está mal cronometrada (Whisper se saltó la anterior
   y la estiró sobre su audio, V4: «júis») y el corte va a esa pausa. Aplica **una sola ganancia** a toda la grabación (hasta la sonoridad de `--match
   <clip>`, o `--lufs`, sin pasar de −1 dBTP) y codifica como Chatterbox (24 kHz mono, MP3 CBR 96 kbps).
4. **Informa** en `out/recording/<nombre>/report-<archivo>.md`: la coincidencia de cada frase («revisar» por debajo de
   0,9: sobran o faltan palabras, escúchala), las que no encontró (sin clip: `build-timeline` las nombrará) y
   los trozos de la grabación que no usó. Por cada frase que no encontró (o varias seguidas), la consola dice
   **dónde debería estar** (entre el corte de la frase anterior y el de la siguiente, ajustado a la voz), qué oyó
   Whisper ahí y la causa probable: voz sin transcribir (Whisper se la saltó), algo demasiado distinto del guion
   (escúchalo; si se leyó mal, se regraba) o ninguna voz (no se grabó). Si hay voz, da los dos comandos exactos para
   arreglarlo sin regrabar: `recut_recording.py --part "<grabación>@<inicio>-<fin>"` a un archivo
   `<slug> <nombre> <ids> (recorte).wav` junto a la grabación, e `import-recording --only <ids>
   --lufs=<sonoridad del recorte + ganancia>`, con el número ya calculado para que el clip quede con la misma
   ganancia que el resto (no `--match`: medido sobre una frase da ~1 dB de más). La sonoridad se mide como la
   escribirá `recut_recording.py`, con sus 0,8 s de silencio detrás: en una frase sola pesan (V10 s01-01: −19,23 LUFS
   el trozo pelado, −19,53 el recorte, 0,3 dB de diferencia en el clip).

**Tres salvaguardas del importador** (2026-10-23, tras V40–V42, que se importaron con un motor viejo):

- **Aviso de motor atrasado** (`lib/engine-freshness.mjs`). Una rama de guion sale de `main` cuando se escribe el guion y
  solo se fusiona de vez en cuando, así que el importador que lleva puede no tener arreglos que `main` ya tiene (documentos,
  roles y proveedores se importaron sin el de «la última toma» y se quedaron con una toma anterior en seis frases).
  `import-recording` y `verify-voice` comparan `video/engine/scripts` con el `origin/main` local (haz `git fetch` antes) y, si
  `main` tiene commits que cambian archivos que aquí son distintos, avisan y los listan. Un checkout con el motor copiado de
  `main` (`git checkout origin/main -- video/engine`) no se considera atrasado. Solo avisa: no impide importar.
- **Clip que empieza a mitad de frase** (`midSentenceStarts`). Si el clip no empieza por la primera palabra del guion y justo
  antes (sin pausa de 600 ms o más, y sin usar) hay una palabra que sí, se avisa con los dos comandos de recorte y se anota en el
  informe («Clips que empiezan a mitad de frase»). Caso: documentos s02-01, «Empezamos con un caso» salió como «Con un caso» y
  nada lo marcaba. `verify-voice` tiene la segunda red: avisa (no bloquea) si lo oído arranca en la segunda o tercera palabra
  del guion (`missingOpening`).
- **Reintento de la frase que Whisper se salta.** Whisper se salta la frase que repite el principio de su pista (la primera del
  guion), o una ventana casi en silencio. Si tras la primera pasada falta algún segmento y hay voz donde debería estar
  (`missingGaps`), se vuelve a oír **solo ese tramo y sin pista** (`--clips`), se sustituyen las palabras de ese tramo y se
  vuelve a colocar todo; el resultado queda guardado en la caché de la transcripción (`patches`), así que no se repite. El
  informe lo anota («Frases que Whisper se saltó y se buscaron otra vez»). `--no-retry` lo desactiva. Ya no hace falta el
  rodeo manual de la primera frase (recorte + `recording_asr.py` sin pista + `--only`).

**Ritmo** (`narration.json` → `"recording": { "tempo": 1.08, "maxPauseMs": 250 }`, o los flags `--tempo` y
`--max-pause`, que mandan sobre él): `maxPauseMs` acorta a ese valor cada pausa dentro de una frase, y
`tempo` acelera cada clip con `atempo` (conserva el tono; 0,8–1,25) y escala con él los tiempos de palabra
(`withTempo`, que reutiliza `scaleTimings` de Chatterbox). Sin la clave ni los flags, tempo 1 y sin límite:
los vídeos ya grabados se reimportan exactamente igual. Al grabar, mejor a ritmo de conversación, sin la
pausa de lectura entre frases: el corte ya deja aire.

Una frase que salga mal se regraba: se graban solo esas frases, en el orden del guion, en otro archivo, y se
importa con `--only <ids>`; los demás clips no se tocan (`--only` busca esas frases desde el principio del
archivo, así que es para una regrabación aparte, no para la grabación entera: para esa, se reimporta todo,
que con la transcripción en caché tarda menos de un minuto). No se pueden quitar palabras sueltas de en medio
de una oración (un rótulo leído en voz alta dentro de una oración se queda). Las animaciones que se disparan en una
palabra usan los tiempos de Whisper, que pueden desviarse ~0,2 s.

```bash
# Clips en las carpetas del vídeo (o --tts-dir/--voice-dir para dejarlos aparte) + informe
node video/engine/scripts/import-recording.mjs --video <slug> --file "video/engine/voices/<grabación>.wav" --name <nombre> --match <clip de referencia>.mp3
# Sustituir solo unas frases regrabadas (mismas carpetas y referencia de volumen)
node video/engine/scripts/import-recording.mjs --video <slug> --file "video/engine/voices/<regrabación>.wav" --name <nombre> --only s02-03,s04-01 --match <clip de referencia>.mp3
# Con "voice": "recording/<nombre>" en narration.json, audio.mjs reconstruye el timeline y comprueba la voz
node video/engine/scripts/audio.mjs --video <slug>
```

**Guardias del importador** (2026-10-26, a partir de V39 y V43; todas actúan al importar, sin Whisper, para que el fallo salga
a los dos minutos y no en `verify-voice` o en el render):

- **Palabras sin duración.** Una racha de ≥3 palabras con `endMs - startMs ≤ 10` en la transcripción es una alucinación
  de Whisper (V43 s02-02: once palabras en 29,98 s hicieron empezar el clip tarde, sin las primeras palabras). Se
  descartan en memoria (la caché `asr-*.json` no se toca), con aviso en consola y en el informe.
- **Palabra fantasma y borde cortado.** Una palabra de ≤3 letras con >1,2 s y un silencio dentro («y» de 2,4 s tras
  «entrar», V39 s05-01) se recorta a su tramo con voz. Después, si la energía de los 30 ms del borde de un clip supera
  0,30 del RMS del clip (verify-voice marca error en 0,35), el final avanza hasta el siguiente silencio (máx. +500 ms) o
  el inicio retrocede (máx. −300 ms). La línea «Comprobación de bordes: N clips…» sale siempre al final. Esto también
  corta lo que el importador antiguo dejaba dentro: el principio de un falso comienzo («La segunda…») al final de V43
  s04-08. `--no-edge-fix` vuelve al comportamiento anterior.
- **Ganancia reutilizable.** Una importación completa guarda `out/recording/<nombre>/import-gain.json`
  (`gainDb`, sha del WAV, voz). `--only` con un recorte la reutiliza sola (`--reuse-gain`, o `--gain <dB>` a mano;
  incompatibles con `--lufs`/`--match`), así que ya no hay que calcular «LUFS del recorte + ganancia». Si no existe el
  JSON la deduce de los `tts/*.json` ya importados.
- **Nombre de voz.** Con `--only`, la voz por defecto es la de `narration.json` (`recording/<nombre>`); un `--name`
  distinto deja un clip que `build-timeline` rechaza, y ahora el aviso lo dice. `--only` con la grabación COMPLETA
  (misma sha que la importación completa) localiza todo el guion con la caché y reescribe solo esos ids; con otro
  archivo espera un recorte (`recut_recording.py`).
- **Tarjeta de examen fuera de su escena** (`build-timeline`): el error dice hasta cuántos segundos cabe y que se
  prefiere alargar `pauseAfterMs` de la última frase antes que acortar la tarjeta (los perfiles `-yt` avisan por debajo de 4 s).
- **Tomas que el corte dejó enteras** (2026-10-31, a partir de producto-bluf, donde s06-03 y s09-07 solo salieron en
  `verify-voice`, 43 minutos después). Tres comprobaciones sobre los clips ya escritos, sin otra pasada de Whisper, cada
  una con su comando de `recut_recording.py` (varias `--part` cuando hay que empalmar) e `import-recording --only`:
  - **Voz sin transcribir** (`unheardVoice`): entre dos palabras, ≥ 0,8 s de voz (lo que `silencedetect` no llama
    silencio, sumando los trozos separados por silencios cortos) que ninguna palabra cubre (±150 ms). Es una toma a medias
    que Whisper no oyó: s06-03 «periódico, [1,9 s] Lo lees…», s09-07 «Eso sí, [1,3 s en dos trozos] en un producto…». La
    cola de una cifra (Whisper acaba «203» antes que «doscientos tres») no cuenta. El comando propuesto quita ese tramo.
  - **Arranque repetido** (`repeatedOpenings`): las tres primeras palabras de una oración del segmento leídas dos veces
    dentro del clip, la segunda tras una pausa de más de 1 s. Propone quedarse con la lectura de después de la pausa (y,
    si la oración no es la primera, empalmar delante lo que el clip tenía antes).
  - **Clip demasiado largo** (`longClips`): más de 1,5× lo que dura su texto leído una vez a 2,7 palabras/s y al menos
    2 s de más. Si hay pausas de más de 1 s dentro, las nombra y propone quedarse con lo que sigue a la última.
  Probadas con las grabaciones de producto-bluf (63 clips: avisan justo de s06-03 y s09-07; s03-06 ya la marcaba la
  palabra estirada), dato-a-juicio (60) e ia-riesgos (31), sin falsos avisos. No ven un falso comienzo que Whisper funde
  con la palabra siguiente y que la reparación de tiempos tapa (dato-a-juicio s06-05 «Un grupo que de… Un grupo que
  detesta»): eso sigue siendo cosa de `verify-voice`.
- **`--lufs -18` o `--lufs=-18`.** `parseArgs` leía `-18` como dos opciones cortas y se paraba; ahora un valor negativo
  de `--lufs`, `--gain` o `--noise` se une a su opción antes (`joinNegativeValues`).

**Comprobación de la voz** (`scripts/verify-voice.mjs`, que `audio.mjs` lanza tras `build-timeline` en las voces
`recording/…`). Escucha cada clip **tal como suena en el vídeo** (solo la parte que se reproduce): lo transcribe
otra vez con faster-whisper (`verify_voice.py`, en el venv de Chatterbox) y mide la energía en sus bordes.
Son **errores** un clip que empieza o acaba dentro de una palabra (energía de borde > 0,35 del RMS del clip), voz
justo después de la parte que se reproduce (> 0,15) y una frase de tres palabras que se oye más veces de las que
dice el guion (una toma que se coló); es un **aviso** una similitud con el guion por debajo de 0,75 (escúchalo,
muchas veces es solo el reconocimiento). Escribe `out/verify-voice.md` y `out/verify-voice.json` (con el
`sourceHash` del timeline). **`render.mjs` se niega a renderizar una grabación sin un informe al día y sin
errores**; `--skip-voice-check` lo salta a sabiendas.

**Es incremental.** Cada clip se guarda en `out/verify-voice-cache.json` con una clave hecha de sus bytes y de lo que el
vídeo reproduce de él, más la versión de las medidas (`MEASURE_VERSION`) y el modelo de Whisper (`VERIFY_MODEL`). Tras un
`import-recording --only s06-03,s09-07` solo esos dos vuelven a Whisper (la consola lo dice: «transcribing 2/63 clips
(s06-03, s09-07; the other 61 are cached)»). Ni el guion, ni el léxico, ni los umbrales llegan a Whisper (no lleva pista):
solo cambian los errores y avisos, que se recalculan desde la caché en cada pasada, así que cambiarlos no repite nada.
`verify_voice.py` apunta cada clip en `out/verify-voice-progress.jsonl` en cuanto lo oye: una pasada que se corta o falla
a medias conserva lo que terminó, y la siguiente lo recoge. `--all` (o `--force`) vuelve a oírlos todos. En producto-bluf
la caché ya funcionaba (la segunda pasada, tras arreglar dos clips, tardó minutos): lo que costó 43 min fue la primera.

```bash
node video/engine/scripts/verify-voice.mjs --video <slug> [--warn-only] [--all]
```

## Masterización: voz y programa

Dos pasos opcionales, en Python (venv de Chatterbox con `pip install pedalboard pyloudnorm librosa soundfile scipy`):

- **`scripts/master_voice.py`**, sobre la grabación **antes** de `import-recording.mjs`: mono, paso alto a 70 Hz,
  EQ correctiva (−1,5 dB a 300 Hz, +2 dB a 3,2 kHz), de-esser dinámico en 5–9 kHz (hasta −8 dB), un poco de
  «aire» por encima de 8,5 kHz (excitador armónico suave) y compresión ligera (2,5:1), a −20 LUFS con limitador
  a −3 dBFS. Toda la cadena conserva la longitud y los tiempos (filtros de fase cero, limitador sin latencia),
  así que Whisper y los cortes no se mueven. **No reduce ruido**: una grabación con silencios digitales ya viene
  sin ruido y una segunda pasada solo añade artefactos. `--ab` escribe un antes/después igualado en volumen.
- **`scripts/master_mix.py`**, sobre el MP4 ya renderizado: añade un **ambiente** generado aquí, lleva el programa a
  **−14 LUFS** (YouTube) y limita el pico real a **−1 dBTP** (detección 4× sin latencia). El vídeo se copia tal cual;
  el audio sale en AAC 192 kbps. Lo que cuenta es el archivo entregado: **mide el MP4 ya codificado** (el AAC puede
  subir el pico por encima del PCM) y, si pasa de −1 dBTP, vuelve a limitar con el techo más bajo lo que se pasó,
  más 0,1 dB (`next_ceiling`, hasta 3 pasadas).

  **En paralelo con el render:** `render.mjs --video <slug> --master [--bed-db <n>]` saca primero la mezcla de audio
  sola (`remotion render … --codec=wav`) y, mientras se dibujan los fotogramas, corre la fase pesada de
  `master_mix.py` (`--audio-in … --premaster-out …`: ambiente y sonoridad). Al acabar la imagen solo queda la ligera
  (`--video-in … --premaster … --out …`: limitador, AAC, unir y medir). El render sin masterizar queda como
  `<output>-premaster.mp4` (las comprobaciones de sincronía se hacen sobre él, porque el ambiente rellena los
  silencios que buscan) y el masterizado es `<output>.mp4`. El Python sale de `$MASTER_PYTHON` o del venv de
  Chatterbox, y se comprueba que tenga pedalboard, pyloudnorm, soundfile y scipy antes de renderizar nada. Ojo: el
  ffmpeg de Remotion solo escribe PCM de 16 y 24 bits (no `pcm_f32le`). El ambiente por defecto (`--bed-style story`, desde V4) **sigue la historia** que
  cuenta el timeline:
  - cada capítulo recorre una progresión de cuatro acordes en re menor (uno cada 10 s) con un arpegio suave;
  - bajo el mensaje del adversario, un acorde disonante y un latido grave, y el arpegio se calla;
  - en una pausa para pensar, un acorde suspendido y un tic-tac;
  - un soplo de ruido filtrado sube hacia cada capítulo nuevo;
  - desde el resumen, resuelve a re mayor con el arpegio algo más vivo.

  Queda unos 4 LU por debajo del programa antes de atenuarse (10 dB más que el de V1 y V3, elegido de oído el
  2026-09-29 entre +4, +7 y +10), sobre un tono de sala muy bajo, y se atenúa 6 dB mientras alguien habla (el
  arpegio, 12 dB), así que sobre todo llena las pausas. `--bed-style pad` es el ambiente de V1 y V3 (un acorde fijo
  por capítulo, 14 LU por debajo); `--bed-db` sube o baja cualquiera de los dos y `--no-bed` lo quita.

- **Música de biblioteca** (desde V4, sustituye al ambiente generado): `video.json` → `"music": "<archivo>"`, un
  archivo de `music/library/` (ignorada por git; qué es cada uno y su licencia, en `music/LICENSES.md`), y
  `render.mjs --master` pasa `--bed-style music --music <ruta>` a `master_mix.py`. `scripts/music_kit.py` corta la
  pista en frases de 4 compases sobre sus propios pulsos (la fase sale de donde cambia la energía: las secciones
  empiezan en una frase) y la **reordena al largo del vídeo siguiendo la historia**:
  - empieza por la primera frase de la pista y acaba con su final real, colocado para acabar con el vídeo;
  - entre medias sigue la pista (la frase siguiente no cuesta nada) y salta cuando la historia pide otra energía:
    frases tranquilas bajo la narración, las más fuertes en un mensaje del adversario o una pausa para pensar (con
    el adversario, las más oscuras);
  - una frase ya usada cuesta un poco más cada vez, así que un vídeo largo recorre toda la pista;
  - las frases se unen con un fundido de 80 ms centrado en el primer tiempo de la siguiente.

  Bajo la voz, la música pasa a una copia filtrada a 1,5 kHz (se quedan el cuerpo y el ritmo, no los agudos que
  compiten con la voz) y, como los otros ambientes, se atenúa 6 dB; queda 8 LU por debajo del programa antes de
  atenuarse (primer valor, a ajustar de oído con `--bed-db`). El registro de `master_mix` lista qué frase suena en
  cada momento. Para probar sin renderizar la imagen: `scripts/render-audio.mjs` escribe solo el audio del programa
  (`out/<slug>-program.wav`, ~6 min en V4) y `master_mix.py --audio-in … --premaster-out …` mezcla en ~1 min.

- **La música es obligatoria** (desde el 2026-10-22). Todos los vídeos publicados van sobre «Go On Going –
  Stayloose» (`"music": "Go On Going - Stayloose.mp3"`). V47 (`ot-halden`), AP01–AP04 y los primeros masters de
  V49/V50 se masterizaron por etapas, a mano, sin `--music`, y `master_mix` usó su ambiente generado: quedó a
  ~8 LU del programa en vez de ~13, sonaba a ruido de fondo, y el nivel automático bajó todo 4 dB (−18 LUFS
  entregados en vez de −15). Medido en los MP4: 14 dB entre la voz y los silencios, frente a 20 dB con la música.
  Por eso `render.mjs --master` se para si `video.json` no tiene `"music"` (`--generated-bed` lo salta a
  propósito), y `master_mix.py` avisa en la etapa 1 si no se le pasa la música. Comprueba en el registro que dice
  `bed (music)` y que el MP4 sale hacia −15/−16 LUFS. Si un master salió con el ambiente generado, no hace falta
  renderizar la imagen otra vez: programa (`render-audio.mjs`) → etapa 1 con `--bed-style music --music …` →
  etapa 2 sobre el `<slug>-premaster.mp4` que ya existe, y se sube como vídeo nuevo (YouTube no deja cambiar el
  archivo; antes, `out/youtube-upload.json` se aparta como `youtube-upload.v1.json`).
- **No se solapan con la etapa 1:** `master_mix` necesita ~2 GB libres. Con Whisper transcribiendo otra
  grabación a la vez, V49 se quedó sin memoria (`ArrayMemoryError`) y hubo que repetirlo; la etapa 1 no toma el
  candado de trabajos pesados, así que espera a que acabe la importación.

```bash
python video/engine/scripts/master_voice.py --in "video/engine/voices/<grabación>.wav" --out "video/engine/voices/<grabación> (master).wav" --ab video/<slug>/out/voz-antes-despues.wav
# ... import-recording con el WAV masterizado, audio.mjs y render.mjs ...
python video/engine/scripts/master_mix.py --video-in video/<slug>/out/<slug>.mp4 --timeline video/<slug>/src/timeline.json --out video/<slug>/out/<slug>-master.mp4
# Probar una pista de biblioteca sin renderizar la imagen
node video/engine/scripts/render-audio.mjs --video <slug>
python video/engine/scripts/master_mix.py --audio-in video/<slug>/out/<slug>-program.wav --timeline video/<slug>/src/timeline.json --premaster-out video/<slug>/out/prueba.wav --bed-style music --music "video/engine/music/library/<pista>.mp3"
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

# 1b. Canon: dónde más usa la campaña cada equipo, cuenta, IP, dominio, hash, caso y hora del guion
#     (otros vídeos de la pista, sus lecciones y docs/superpowers/canon/<campaña>.md) -> out/canon-refs.md
node video/engine/scripts/canon-check.mjs --video <slug>
#     Con las revisiones aplicadas y canon-refs.md leído: video.json -> "frozen": "AAAA-MM-DD". Sin él, la hoja
#     de grabación (script-sheets.mjs --recording) sale como «BORRADOR · no grabes todavía».

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

# 6a. Grabación propia: worktree listo e importación en un comando (desde cualquier checkout del repo)
node video/engine/scripts/prepare-voice-worktree.mjs --video <slug> --wav "video/engine/voices/<slug> lidia.wav" [--video-from <rama>] [--dry-run]
#     Hace lo que antes era a mano: git fetch; worktree en NTFS (por defecto %TEMP%\alertopolis-voz\<slug>, rama
#     video-<slug>-voz desde origin/main; si la rama ya existe, su video/engine se pone al día con origin/main);
#     --video-from <rama> trae video/<slug> de la rama del guion; uniones de directorio a node_modules y
#     video/engine/.cache del principal; copia la música de video.json -> "music" a music/library/; quita
#     recording.tempo de narration.json; master_voice.py -> «<grabación> (master).wav»; import-recording --lufs=-18 con
#     CHATTERBOX_PYTHON del principal. Se puede repetir (salta lo hecho); --no-master / --no-import paran antes.
#     Después: cd al worktree y produce.mjs. Para quitarlo, SIEMPRE con el script (quita las uniones primero; borrar la
#     carpeta a mano con ellas dentro borraría el node_modules y la .cache del principal):
node video/engine/scripts/prepare-voice-worktree.mjs --video <slug> --remove

# 6b. Con la voz ya importada, la cadena entera en un solo comando (para en el primer error y dice cómo retomar):
#     audio (timeline + verify-voice) → program (WAV del programa) → master1 → frames → master2 → report
node video/engine/scripts/produce.mjs --video <slug> [--concurrency 4] [--from <paso>|--only <paso>] [--dry-run]
#     --upload añade youtube-meta + youtube-upload (privado salvo --privacy); sin --upload nunca sube nada.
#     Guardias: "music" en video.json y el archivo en music/library/, Python del venv principal, node_modules, clips
#     importados, timeline fuera de estimate. master_mix va siempre aparte del render (--master-in-render lo junta).

# 7. Perfiles -yt: metadatos y archivos listos para subir a YouTube (después de renderizar)
node video/engine/scripts/youtube-meta.mjs --video <slug>
```

Notas:

- `voice-plan.mjs` y `youtube-meta.mjs` solo tienen sentido para los perfiles `-yt` (`principal-yt`, `capsula-yt`, `caso-yt`, `caso-principal-yt`); en
  `principal`/`capsula` no hace falta ejecutarlos. `voice-plan.mjs` solo imprime la decisión (no toca
  `narration.json`); `youtube-meta.mjs` exige un timeline en modo audio y un póster ya renderizado, y escribe
  `video/<slug>/out/youtube.md` con el título, la descripción (con capítulos), las etiquetas y la lista de
  archivos a subir.

- **Cola de trabajos pesados** (`lib/heavy-lock.mjs`): `render.mjs`, `qa-frames.mjs`, la transcripción de
  `import-recording.mjs` y `verify-voice.mjs` toman un candado en la carpeta temporal del sistema (lo comparten la
  copia principal y todos los worktrees) y esperan su turno, diciendo una vez a quién esperan. En V5, tres agentes
  renderizando a la vez que Whisper transcribía lo hicieron todo 2–3 veces más lento. Un candado de un proceso
  muerto se toma sin esperar; `RENDER_LOCK=0` salta la cola.
- **Recortar frases de una grabación** (`scripts/recut_recording.py`, venv de Chatterbox): cuando `verify-voice`
  marca una frase y la grabación tiene una toma limpia (un arranque en falso pegado a la buena, palabras perdidas en
  una pausa larga, algo dicho tras la última), `--map "<wav>@<a>-<b>"` enseña voz y silencios (un carácter cada
  50 ms) y `--part "<wav>@<a>-<b>"` (repetido, en orden de guion) monta las tomas buenas en un archivo corto con
  `--out`, que se importa con `import-recording.mjs --only <ids>` y el mismo `--match`.
- **Etiquetas de YouTube:** `video.json` → `"tags": [...]` fija las etiquetas de tema (con espacios, sin comas);
  sin él, `youtube-meta.mjs` usa las claves del léxico, que son de pronunciación y no de tema.
- **En un git worktree:** `export CHATTERBOX_PYTHON=".../TICourse/video/engine/.venv-chatterbox/Scripts/python.exe"`
  (el venv está fuera de git y un disco exFAT no admite enlaces) y `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=safe.directory
  GIT_CONFIG_VALUE_0=*` para `render.mjs`; la biblioteca de música (`music/library/`, fuera de git) se copia a mano.
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

## Subida a YouTube por la API

`scripts/youtube-upload.mjs` sube un vídeo `-yt` ya renderizado al canal **Alertópolis** con la YouTube Data API v3:
el MP4 (subida reanudable, a trozos de 8 MB), el póster como miniatura, los subtítulos en español y la lista de su
pista («CompTIA Security+ SY0-701 en español» o «GIAC GCTI en español»). Título, descripción y etiquetas son los de
`out/youtube.md`: los dos salen de `buildYoutubeMeta()` (`youtube-meta.mjs`). Sube en **privado** salvo que
`--privacy` diga otra cosa.

**Puesta en marcha (una vez, la hace Lidia):**

1. En Google Cloud, un proyecto con la **YouTube Data API v3** activada y un cliente OAuth de tipo **«App de
   escritorio»**. Con la pantalla de consentimiento en modo prueba (su cuenta como usuaria de prueba), Google hace
   caducar el refresh token a los 7 días y hay que repetir `--auth`; pasándola a producción sin verificar, el token
   dura, a cambio del aviso «Google no ha verificado esta aplicación» al autorizar.
2. El JSON del cliente se guarda como `video/engine/youtube/client_secret.json` (la carpeta está en `.gitignore`).
3. `node video/engine/scripts/youtube-upload.mjs --auth`: abre la página de consentimiento (la dirección también sale
   en la consola), Lidia entra con su cuenta y **elige el canal Alertópolis**; el script guarda el refresh token en
   `video/engine/youtube/token.json` solo si el canal es el bueno (`UCe0XBMwoI3bI61K8qolacJA`).

**Por vídeo:**

```bash
node video/engine/scripts/youtube-upload.mjs --video <slug> --dry-run    # lo que enviaría, sin red
node video/engine/scripts/youtube-upload.mjs --video <slug>              # privado
node video/engine/scripts/youtube-upload.mjs --video <slug> --privacy unlisted
```

- Antes de subir nada comprueba que la cuenta es la de Alertópolis (el 2026-09-30, V4 acabó primero en el canal
  personal).
- Cada paso hecho se apunta en `video/<slug>/out/youtube-upload.json` (id del vídeo, miniatura, subtítulos, lista).
  Si algo falla, relanzarlo termina lo que falta y **nunca sube el vídeo dos veces**.
- Un corte de red o un 5xx a mitad de la subida espera y pregunta a YouTube por dónde iba; un 4xx (cuota, permisos)
  se para y lo dice.
- **Proyectos sin auditar:** según la referencia de `videos.insert`, lo que sube un proyecto creado después del
  28-7-2020 y no auditado queda **restringido a privado** hasta que YouTube audita el proyecto (formulario «YouTube API
  Services – Audit and Quota Extension Form»). Mientras tanto, la subida a mano sigue valiendo.
- En un git worktree, las credenciales de la copia principal: `export YOUTUBE_CREDENTIALS_DIR=".../TICourse/video/engine/youtube"`.
- Cuota: `videos.insert` cuenta en su propio cubo de subidas; `thumbnails.set` cuesta unas 50 unidades; las demás
  llamadas, pocas.

## Qué se genera y dónde

| Archivo | Qué es | ¿En git? |
| --- | --- | --- |
| `video/<slug>/src/timeline.json` | timeline que lee la composición | sí |
| `video/<slug>/public/voice/<id>.mp3`, `tts/<id>.json` | clips de voz y tiempos por palabra | sí (caché reproducible) |
| `video/<slug>/public/voice/<seg>-intercept.mp3`, `tts/<seg>-intercept.json` | voz del adversario por mensaje interceptado (solo con `adversaryVoice`) | sí (caché reproducible) |
| `video/engine/sfx/*.mp3`, `sfx.json` | biblioteca de efectos de sonido (`sfx_generate.py`, semilla fija) | sí |
| `video/<slug>/public/sfx/*.mp3` | copia de los efectos que usa este vídeo (Remotion solo lee la carpeta pública del vídeo) | no — generada por `build-timeline.mjs` a partir de la biblioteca |
| `public/videos/<output>.mp4` | vídeo final, perfiles `principal`/`capsula` | sí |
| `video/<slug>/out/<output>.mp4` | vídeo final, perfiles `-yt` (se sube a YouTube, no se commitea) | no |
| `public/videos/<output>-poster.png` | póster (id `poster` de `video.json`); en `public/videos/` en los cuatro perfiles | sí |
| `public/videos/<output>-transcript.txt` | transcripción por escenas | sí |
| `public/videos/<output>-captions.vtt` | subtítulos WebVTT del reproductor (una entrada por página de subtítulo quemada en el vídeo) | sí |
| `video/<slug>/out/youtube.md` | título, descripción, etiquetas y archivos a subir (`youtube-meta.mjs`, solo perfiles `-yt`) | no |
| `video/<slug>/out/youtube-upload.json` | lo que ya hizo `youtube-upload.mjs` (id del vídeo, miniatura, subtítulos, lista) | no |
| `video/engine/youtube/client_secret.json`, `token.json` | cliente OAuth y refresh token de la subida por la API | no |
| `out/draft.mp4`, `out/qa/<escena>/`, `out/tts-input.json` | borradores y fotogramas de revisión | no |
| `.audition/<voz>.mp3`, `.audition/audition.txt` | audición de voces | no |

`out/qa/<escena|all>/` contiene `f<fotograma>_<escena>_<qué>.jpeg` (inicio y final de escena, cada cue,
tarjeta de examen y pausa) e `index.json` con el mapa archivo → fotograma → escena/cue.

## Pruebas

`scripts/test_*.py` (unittest, sin dependencias: `python -m unittest discover -s video/engine/scripts -p "test_*.py"`)
cubre la normalización y la puntuación de guion del worker de Chatterbox, cómo `recording_asr.py` aplana las
palabras de Whisper, `test_sfx_generate.py` (la biblioteca de sonidos: duraciones, pico y reproducibilidad de
la semilla) y `test_adversary_fx.py` (los presets: `machine` conserva la duración y deja el pico en −1 dBFS; `telefono`,
además, no satura, es reproducible, corta a 30 dB o más lo que cae fuera de 300–3400 Hz y deja muchísima
menos energía por encima de 3,5 kHz que `machine`; `cifrado` no satura, es reproducible, deja como mucho 65 niveles
distintos, repite cada muestra por parejas a 22 050 Hz, deja en cero el siseo entre dos palabras y conserva los agudos
que `telefono` corta; `megafonia` no satura, es reproducible, corta a 30 dB o más lo que cae por debajo de la bocina y
a 20 dB lo de muy arriba, realza 2 kHz frente a 700 Hz, devuelve un chasquido con su eco a 90 ms y una cola que se
apaga, y termina en un fundido). Las de `adversary_fx` sí necesitan librosa y scipy (el venv de
Chatterbox); sin ellas se saltan.

`scripts/lib/*.test.mjs` (node:test, sin dependencias): marcas y léxico, alineación con límites de palabra
que faltan o sobran (incluidos límites reales grabados de edge-tts en `fixtures/edge-boundaries.json`),
paginación de subtítulos, receta de tiempos y validaciones del timeline. `recording.test.mjs` cubre la
grabación propia: localizar frases (última toma, arranques en falso, audio fuera del guion, números),
cortes en silencios, ganancia e informe. `sfx.test.mjs` cubre `voicedHoldFrames`, `placeSfx` (sonidos
automáticos y momentos clave) y `sfxMapErrors`; `adversary.test.mjs` cubre la validación de
`adversaryVoice`, la clave de caché y el registro `tts/<segmento>-intercept.json`. `question.test.mjs` cubre la validación de `question` (campos, límites, cues, reglas por escena y avisos), y `build-timeline.test.mjs` el bloque `questions[]`, las opciones en el VTT y que un vídeo sin preguntas no cambie. La prueba de modo audio usa
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
