# Vídeos de lección: voz del adversario y efectos de sonido

**Fecha:** 2026-09-28 · **Estado:** aprobado por Lidia en tres partes (enfoque y voz, efectos, archivos y
pruebas), 2026-09-28. Primer vídeo: `capas-halden` (sp4m7).

## 1. Objetivo y alcance

Los mensajes interceptados del adversario (§3 del diseño de narración del 2026-09-26) aparecen en pantalla
**sin voz**, y el vídeo no tiene más audio que la narración. Este diseño añade dos capas de audio:

1. **La voz del adversario.** SILENT PAGER lee su mensaje interceptado con una voz sintética local
   (Microsoft Pablo) tratada con un efecto «máquina».
2. **Efectos de sonido.** Una biblioteca pequeña de sonidos generados por ordenador, colocados en los
   mensajes interceptados, las tarjetas de examen, los cambios de capítulo y unos momentos clave.

Las dos capas viven en el **timeline**: `build-timeline.mjs` calcula dónde suena cada cosa y el vídeo solo
reproduce lo que el timeline dice. Así una voz más larga que la pausa del mensaje alarga esa pausa, y los
errores (un nombre de animación o de sonido mal escrito) salen antes de renderizar.

**Fuera de alcance:**
- **Los vídeos publicados** (SIEM, EDR, forense): no llevan `adversaryVoice` ni `sfx`, así que su
  `timeline.json` sale idéntico byte a byte.
- **Subtítulos para la voz del adversario**: el mensaje ya está escrito entero en la tarjeta; la
  transcripción ya lo incluye (`[Mensaje interceptado · SILENT PAGER] «…»`).
- **Música de fondo, ducking y mezcla dinámica.** Los efectos son cortos y suenan a volumen fijo.
- **Otras voces del adversario** (Chatterbox, ElevenLabs). El formato de `voice` lo permite más adelante.

## 2. Decisiones

| Decisión | Elegido | Alternativas descartadas |
|---|---|---|
| Dónde se calcula el audio nuevo | en el timeline (`build-timeline.mjs`) | solo en la composición (no puede alargar la pausa ni validar antes); premezcla en una pista (sin control por capa) |
| Voz del adversario | Microsoft Pablo (SAPI de Windows, local, sin red) | Chatterbox es-es o multilingüe; tomas de Lidia procesadas; ElevenLabs (cuota y plan) |
| Tratamiento | «máquina»: −4 semitonos, modulación en anillo a 48 Hz, paso banda 120–5000 Hz | «radio interceptada», «sombra» (muestras del 2026-09-28) |
| Origen de los efectos | generados con numpy/scipy, semilla fija, en el repo | bibliotecas CC0 o de pago (licencias al publicar en YouTube) |
| Efectos elegidos | mensaje interceptado, tarjetas de examen, cambio de capítulo y 11 momentos clave | — |

## 3. Voz del adversario

### 3.1 Configuración

En `narration.json`, opcional:

```json
"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }
```

- `voice`: `sapi/<nombre de la voz de Windows>` (único proveedor por ahora).
- `rate`: velocidad de SAPI, entero de −10 a 10 (por defecto 0).
- `fx`: preset del tratamiento; por ahora solo `machine`.
- Sin `adversaryVoice`, los mensajes siguen mudos, como hasta ahora.
- `adversaryVoice` sin ningún segmento con `intercept` es un aviso, no un error.

### 3.2 Generación: `scripts/tts-adversary.mjs --video <slug>`

Para cada segmento con `intercept`:

1. `scripts/sapi_tts.ps1` sintetiza `intercept.text` con la voz y la velocidad pedidas a un WAV temporal
   (`System.Speech.Synthesis.SpeechSynthesizer`).
2. `scripts/adversary_fx.py` (venv de Chatterbox: librosa, scipy) aplica el preset: tono −4 semitonos,
   modulación en anillo (0,6 + 0,4·sen(2π·48·t)) y paso banda Butterworth de orden 4 entre 120 y 5000 Hz. La
   duración no cambia y el pico se normaliza a −1 dBFS.
3. `runFfmpeg` lo lleva a la misma sonoridad integrada que la narración del vídeo (medida con `loudnorm` sobre
   los clips de `public/voice/`) y lo codifica como el resto (24 kHz mono, MP3 CBR 96 kbps) en
   `public/voice/<segmento>-intercept.mp3`.
4. Escribe `tts/<segmento>-intercept.json`: `{ provider: 'sapi', key, voice, rate, fx, text, bytes,
   bitrateKbps, durationMs, gainDb, targetLufs }`, con `key` = sha256 de voz, velocidad, preset y texto, y
   `targetLufs` = la sonoridad de la narración a la que se niveló.

Hay caché: si el registro existe, su `key` coincide, el MP3 tiene los `bytes` anotados y la sonoridad de la
narración no se ha movido más de 1 dB de la anotada en el registro (`targetLufs`), no se regenera (`--force` lo
rehace). Así, cambiar la voz de la narración vuelve a nivelar la del adversario (revisión final, 2026-09-28). `audio.mjs` ejecuta este paso antes de `build-timeline` cuando el vídeo tiene
`adversaryVoice`, con cualquier voz de narración.

### 3.3 Tiempos

Con voz, el hueco del mensaje (`holdMs`) pasa a ser el mayor de estos dos:

- el `holdMs` escrito en `narration.json` (2500–4500 ms, como hasta ahora);
- `TYPE_START + fotogramas de la voz + 10 fotogramas de margen`.

La voz del adversario empieza en `intercept.from + TYPE_START`, cuando empieza a escribirse el texto. La
tarjeta sigue en pantalla hasta que termina la respuesta de la narradora, como hasta ahora. Las constantes de
la animación (`ENTER` = 12, `TYPE_START` = 4, `TYPE_RATE` = 1 fotograma por carácter) salen de
`InterceptLayer.tsx` a `src/overlay/intercept-timing.json`, que leen tanto el builder como la tarjeta, para
que no puedan desalinearse.

Una voz de Pablo dura ~5–6 s por mensaje: el vídeo crece ~5–8 s con sus tres mensajes.

## 4. Efectos de sonido

### 4.1 Biblioteca: `scripts/sfx_generate.py`

Genera, con semilla fija (el mismo resultado byte a byte cada vez), `video/engine/sfx/<nombre>.mp3` y
`video/engine/sfx/sfx.json` (duración y volumen de cada uno). Los MP3 se versionan: son pocos KB. Todos se
normalizan a −1 dBFS de pico antes de codificar; el MP3 queda entre −1,5 y −0,5 dBFS, porque la codificación
mueve el pico. La duración de `sfx.json` es la del MP3 ya decodificado, que el codificador alarga unos 30–50 ms
de relleno, para que el timeline nunca corte la cola de un sonido. El volumen de mezcla va en `sfx.json`.

| Sonido | Carácter | Duración aprox. | Volumen de mezcla |
|---|---|---|---|
| `glitch` | ráfaga de ruido digital con cortes (bitcrush) | 0,35 s | 0,166 |
| `typing` | tecleo rápido de pulsaciones cortas, en bucle | 3 s (se recorta) | 0,08 |
| `ding` | campanilla suave (880 + 1320 Hz, caída exponencial) | 0,8 s | 0,097 |
| `whoosh` | barrido de ruido filtrado | 0,6 s | 0,058 |
| `mail` | aviso de dos notas ascendentes | 0,5 s | 0,079 |
| `check` | nota corta ascendente | 0,25 s | 0,156 |
| `error` | zumbido grave doble (onda cuadrada ~150 Hz) | 0,4 s | 0,071 |
| `block` | «clonc» sordo (seno grave + chasquido) | 0,3 s | 0,170 |
| `alarm` | aviso de dos tonos, dos veces | 0,9 s | 0,024 |
| `ping2` | dos pings de radar con cola larga | 1,2 s | 0,044 |
| `lock` | cerrojo mecánico (dos chasquidos y golpe grave) | 0,45 s | 0,115 |

La voz de la narradora y la del adversario suenan a volumen 1. Los volúmenes salen de medir la sonoridad
(`loudnorm`): con la voz a unos −25 LUFS, cada efecto queda 12 dB por debajo (−37 LUFS), `whoosh` 14 dB y
`typing` 25 dB, para que la voz suene siempre por encima (ajuste pedido por Lidia al escuchar el muestrario,
2026-09-28; los valores de partida dejaban la alarma 7 dB por encima de la voz).

### 4.2 Colocación automática

| Dónde | Sonido | Fotograma |
|---|---|---|
| mensaje interceptado | `glitch` | `intercept.from` |
| mensaje interceptado | `typing` | de `intercept.from + TYPE_START` durante `texto.length × TYPE_RATE` fotogramas |
| tarjeta de examen | `ding` | `exam.from` |
| cambio de capítulo | `whoosh` | inicio visual de la primera escena del capítulo nuevo (su `from` menos su transición de entrada) |

Estos efectos automáticos solo se añaden cuando `narration.json` tiene la clave `sfx`, aunque sea `{}`. Así los
vídeos publicados no cambian.

### 4.3 Momentos clave

`narration.json` → `"sfx": { "<id de cue>": "<sonido>" }`; el efecto suena en el fotograma del cue. Para
`capas-halden`:

```json
"sfx": {
  "mail-in": "mail", "spf-pass": "check", "dkim-pass": "check", "dmarc-fail": "error",
  "reject": "block", "blocked": "block", "implicit": "block", "alert": "alarm",
  "inline": "block", "hits-2": "ping2", "isolate": "lock", "dlp": "block"
}
```

(11 momentos: `spf-pass` y `dkim-pass` son dos cues del mismo segmento.)

### 4.4 Archivos en el vídeo

`build-timeline.mjs` copia a `video/<slug>/public/sfx/` los sonidos que usa el timeline (Remotion solo lee la
carpeta pública del vídeo) y borra de ahí los que ya no usa.

## 5. Contrato del timeline

`src/timeline/types.ts` y `lib/validate-timeline.mjs`, todo opcional:

```ts
export interface SfxCue {
  /** Fotograma absoluto en que empieza. */
  from: number;
  /** Nombre en la biblioteca, p. ej. "glitch". */
  sound: string;
  /** Ruta en la carpeta pública, p. ej. "sfx/glitch.mp3". */
  src: string;
  /** Cuánto suena (recorta un bucle como typing). */
  durationInFrames: number;
  /** Volumen lineal de mezcla, 0–1. */
  volume: number;
}

export interface InterceptCue {
  // …campos actuales…
  /** Voz del adversario: "voice/s03-04-intercept.mp3". Solo si el vídeo tiene adversaryVoice. */
  audio?: string;
  audioFrom?: number;
  audioFrames?: number;
}

export interface Timeline {
  // …campos actuales…
  /** Solo cuando narration.json tiene "sfx". */
  sfx?: SfxCue[];
}
```

`sourceHash` incluye también las claves de los clips del adversario, así que `render.mjs` rechaza un
timeline que no corresponda a las voces actuales.

## 6. Piezas

| Archivo | Nuevo o cambia | Qué hace |
|---|---|---|
| `scripts/sfx_generate.py` (+ `test_sfx_generate.py`) | nuevo | genera la biblioteca y `sfx.json` |
| `video/engine/sfx/*.mp3`, `sfx.json` | nuevo | la biblioteca, versionada |
| `scripts/tts-adversary.mjs`, `scripts/sapi_tts.ps1`, `scripts/adversary_fx.py` (+ `test_adversary_fx.py`) | nuevo | voz del adversario (§3.2) |
| `scripts/lib/sfx.mjs` (+ `sfx.test.mjs`) | nuevo | lógica pura: colocar efectos, validar el mapa, alargar el hueco con voz |
| `src/overlay/SfxLayer.tsx` | nuevo | reproduce `timeline.sfx` y las voces del adversario |
| `src/overlay/intercept-timing.json` | nuevo | constantes de la animación del mensaje |
| `scripts/lib/narration.mjs` | cambia | valida `adversaryVoice` y `sfx` |
| `scripts/build-timeline.mjs` | cambia | hueco con voz, `intercept[].audio*`, `sfx[]`, copia a `public/sfx/`, hash |
| `scripts/audio.mjs` | cambia | paso `tts-adversary` cuando hay `adversaryVoice` |
| `src/timeline/types.ts`, `scripts/lib/validate-timeline.mjs` | cambia | contrato de §5 |
| `src/overlay/InterceptLayer.tsx` | cambia | lee `intercept-timing.json` |
| `src/LessonVideo.tsx` | cambia | añade `<SfxLayer />` |
| `video/capas-halden/narration.json` | cambia | `adversaryVoice` y `sfx` (§4.3) |
| `video/engine/README.md`, `CLAUDE.md` | cambia | secciones «Mensaje interceptado» y «Efectos de sonido» |

## 7. Errores

- **Cue desconocido o sonido desconocido** en `sfx`: error de `build-timeline`, con el nombre y los válidos.
- **Voz SAPI no instalada:** `tts-adversary` falla y lista las voces instaladas.
- **Fuera de Windows:** `tts-adversary` falla con «SAPI necesita Windows»; el resto del motor sigue igual.
- **Falta el clip del adversario** o está obsoleto (clave distinta): error de `build-timeline` con el comando
  que lo arregla, como ya pasa con la narración.
- **Un sonido de la biblioteca no existe** en `video/engine/sfx/`: error con «ejecuta sfx_generate.py».

## 8. Pruebas y verificación

- **`lib/sfx.test.mjs`** (node:test): el fotograma de cada efecto automático; los momentos clave caen en su
  cue; cue o sonido desconocidos dan error; el hueco crece solo cuando la voz no cabe; sin `sfx` ni
  `adversaryVoice`, el timeline no cambia (comparación con el de un vídeo publicado).
- **`test_sfx_generate.py`** (unittest): cada sonido es audible, su búfer sin codificar tiene el pico en
  −1 dBFS, el MP3 entregado queda entre −1,5 y −0,5 dBFS (la codificación desplaza el pico), dura lo previsto
  y dos ejecuciones dan los mismos bytes.
- **`test_adversary_fx.py`**: el preset `machine` conserva la duración y normaliza el pico.
- **`npm run video:check`** y la batería completa del motor (node y Python).
- **De oído, antes de renderizar:** un MP3 con los 11 sonidos seguidos y los tres mensajes de Pablo, para
  aprobarlos o ajustarlos.
- **Render final** con la comprobación de sincronía A/V de `render.mjs`.

## 9. Riesgos

- **Licencia de las voces de Windows para vídeos publicados.** Las voces SAPI de Microsoft están pensadas para
  uso en el propio equipo. Hay que revisar sus condiciones antes de monetizar el canal (hoy no se monetiza;
  ver el diseño del 2026-09-26, §5.3).
- **Efectos que distraen.** Mitigación: volúmenes bajos, sonidos cortos y aprobación del muestrario antes de
  renderizar.
- **Duración.** Cada mensaje con voz puede alargar el vídeo ~2–3 s; con tres mensajes, ~5–8 s más.
