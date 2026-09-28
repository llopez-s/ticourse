# Voz del adversario y efectos de sonido — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que SILENT PAGER lea sus mensajes interceptados con Microsoft Pablo tratado con el efecto «máquina», y
que el vídeo tenga una capa de efectos de sonido (mensajes, tarjetas de examen, capítulos y 11 momentos clave).

**Architecture:** Todo el audio nuevo se decide en `build-timeline.mjs`, que escribe en `timeline.json` las
claves opcionales `sfx[]` y `intercept[].audio*`. La composición solo las reproduce (`SfxLayer.tsx`). Los
sonidos salen de una biblioteca generada con numpy/scipy y versionada en `video/engine/sfx/`; la voz del
adversario la genera `tts-adversary.mjs` (SAPI de Windows + `adversary_fx.py`), con caché por clave como la
narración.

**Tech Stack:** Node 26 (ESM, `node:test`), Python 3.12 del venv de Chatterbox (numpy, scipy, librosa,
soundfile, `unittest`), PowerShell + `System.Speech`, ffmpeg de Remotion (`runFfmpeg`), Remotion 4 +
React/TypeScript.

**Spec:** `docs/superpowers/specs/2026-09-28-adversary-voice-sfx-design.md`

## Global Constraints

- Los vídeos sin `adversaryVoice` ni `sfx` en `narration.json` (SIEM, forense) deben dar un `timeline.json`
  idéntico byte a byte: las claves nuevas solo se escriben cuando no están vacías.
- Voz del adversario: `"voice": "sapi/<nombre>"`, `rate` entero de −10 a 10 (por defecto 0), `fx` ∈ `["machine"]`.
- Preset `machine`: −4 semitonos, modulación en anillo `0,6 + 0,4·sen(2π·48·t)`, paso banda Butterworth de
  orden 4 entre 120 y 5000 Hz; misma duración; pico −1 dBFS.
- Clips del adversario: `public/voice/<segmento>-intercept.mp3` (24 kHz mono, MP3 CBR 96 kbps) y
  `tts/<segmento>-intercept.json`.
- Hueco con voz: `max(holdMs, TYPE_START + fotogramas de la voz + 10)`; la voz empieza en `intercept.from + TYPE_START`.
- Animación del mensaje: `ENTER` 12, `EXIT` 10, `TYPE_START` 4, `TYPE_RATE` 1, en `src/overlay/intercept-timing.json`.
- Biblioteca: 11 sonidos (`glitch typing ding whoosh mail check error block alarm ping2 lock`), semilla fija,
  búfer normalizado a −1 dBFS de pico antes de codificar (el MP3 entregado queda entre −1,5 y −0,5 dBFS),
  volúmenes de mezcla de la tabla del spec §4.1.
- Commits: **solo cuando Lidia lo pida** (instrucción del proyecto). Los pasos «Commit» del plan se hacen
  únicamente con su permiso; si no lo ha dado, se saltan y se sigue.
- Node: en Git Bash, `eval "$(fnm env)"` antes de `node`. ffmpeg, Remotion y el venv necesitan
  `dangerouslyDisableSandbox` en la herramienta Bash.
- En la herramienta Bash, un comando con comillas invertidas (backticks) falla: usar Write/Edit o scripts.

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `video/engine/src/overlay/intercept-timing.json` | constantes de la animación del mensaje, compartidas |
| `video/engine/scripts/sfx_generate.py` | genera `video/engine/sfx/*.mp3` + `sfx.json` (+ `--preview`) |
| `video/engine/scripts/test_sfx_generate.py` | pruebas de la biblioteca |
| `video/engine/sfx/` | biblioteca versionada |
| `video/engine/scripts/lib/sfx.mjs` | colocar efectos, validar el mapa, hueco con voz, leer la biblioteca, copiar a `public/sfx/` |
| `video/engine/scripts/lib/sfx.test.mjs` | pruebas de `lib/sfx.mjs` y del contrato del timeline |
| `video/engine/scripts/lib/adversary.mjs` | lógica pura de la voz del adversario: configuración, clave, registro, argumentos SAPI, claves del hash |
| `video/engine/scripts/lib/adversary.test.mjs` | pruebas de `lib/adversary.mjs` y de la validación en `narration.mjs` |
| `video/engine/scripts/adversary_fx.py` + `test_adversary_fx.py` | preset `machine` |
| `video/engine/scripts/sapi_tts.ps1` | SAPI → WAV |
| `video/engine/scripts/tts-adversary.mjs` | CLI: sintetiza, trata, iguala sonoridad, codifica y registra |
| `video/engine/src/overlay/SfxLayer.tsx` | reproduce `timeline.sfx` y las voces del adversario |
| Cambian: `lib/narration.mjs`, `lib/paths.mjs`, `lib/validate-timeline.mjs`, `lib/freshness.mjs`, `build-timeline.mjs`, `audio.mjs`, `src/timeline/types.ts`, `src/overlay/InterceptLayer.tsx`, `src/LessonVideo.tsx`, `video/capas-halden/narration.json`, `video/engine/README.md`, `CLAUDE.md` | |

---

### Task 1: Constantes compartidas de la animación del mensaje

**Files:**
- Create: `video/engine/src/overlay/intercept-timing.json`
- Modify: `video/engine/src/overlay/InterceptLayer.tsx:9-22`
- Test: `video/engine/scripts/lib/intercept.test.mjs`

**Interfaces:**
- Produces: `intercept-timing.json` = `{ "enter": 12, "exit": 10, "typeStart": 4, "typeRate": 1 }`, que Node
  importa con `import T from '…/intercept-timing.json' with { type: 'json' }` y TypeScript con
  `import T from './intercept-timing.json'` (todos los `tsconfig` del vídeo tienen `resolveJsonModule`).

- [ ] **Step 1: Write the failing test** — añadir al final de `lib/intercept.test.mjs`:

```js
import INTERCEPT_TIMING from '../../src/overlay/intercept-timing.json' with { type: 'json' };

test('intercept timing: typing starts a third into the enter animation and the longest message fits the shortest hold', () => {
  assert.deepEqual(Object.keys(INTERCEPT_TIMING).sort(), ['enter', 'exit', 'typeRate', 'typeStart']);
  assert.equal(INTERCEPT_TIMING.typeStart, Math.floor(INTERCEPT_TIMING.enter / 3));
  // 2.5 s (INTERCEPT_HOLD_MS[0]) at 30 fps = 75 frames
  assert.ok(INTERCEPT_TIMING.typeStart + INTERCEPT_TEXT_MAX * INTERCEPT_TIMING.typeRate <= 75);
});
```

(El `import` va arriba, junto a los otros.)

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test "video/engine/scripts/lib/intercept.test.mjs"`
Expected: FAIL con `Cannot find module …/intercept-timing.json`.

- [ ] **Step 3: Create the JSON and read it from the card**

`video/engine/src/overlay/intercept-timing.json`:

```json
{ "enter": 12, "exit": 10, "typeStart": 4, "typeRate": 1 }
```

En `InterceptLayer.tsx`, sustituir las constantes `ENTER`, `EXIT`, `TYPE_RATE` y `TYPE_START` por:

```ts
import TIMING from './intercept-timing.json';

const ENTER = TIMING.enter;
const EXIT = TIMING.exit;
/** Frames per typed character: at 1 frame/char, 70 characters take 70 frames to type out. */
const TYPE_RATE = TIMING.typeRate;
/** Frame (relative to `entry.from`) where typing starts: a third of the way into the enter animation. */
const TYPE_START = TIMING.typeStart;
```

(borrar `const TYPE_START = Math.floor(ENTER / 3);`; el resto del archivo no cambia).

- [ ] **Step 4: Run tests and type-check**

Run: `node --test "video/engine/scripts/lib/intercept.test.mjs"` → PASS
Run: `npx tsc --noEmit -p video/engine/tsconfig.json && npx tsc --noEmit -p video/capas-halden/tsconfig.json` → sin errores

- [ ] **Step 5: Commit** (solo con permiso de Lidia)

```bash
git add video/engine/src/overlay/intercept-timing.json video/engine/src/overlay/InterceptLayer.tsx video/engine/scripts/lib/intercept.test.mjs
git commit -m "refactor(video): share the intercept animation timing between the builder and the card"
```

---

### Task 2: Biblioteca de efectos (`sfx_generate.py`)

**Files:**
- Create: `video/engine/scripts/sfx_generate.py`, `video/engine/scripts/test_sfx_generate.py`
- Create (generados): `video/engine/sfx/*.mp3`, `video/engine/sfx/sfx.json`

**Interfaces:**
- Produces: `sfx.json` = `{ "sampleRate": 44100, "sounds": { "<nombre>": { "file": "<nombre>.mp3", "durationMs": <int>, "volume": <float> } } }`
  con las 11 claves de Global Constraints. Python: `SOUNDS: dict[str, Callable[[np.random.Generator], np.ndarray]]`,
  `VOLUMES: dict[str, float]`, `render_all() -> dict[str, np.ndarray]`.

- [ ] **Step 1: Write the failing test** — `test_sfx_generate.py`:

```python
import unittest

try:
    import numpy as np
    import sfx_generate as g
except ImportError:  # the plain-Python suite has no numpy: these run with the Chatterbox venv
    g = None

EXPECTED_S = {"glitch": 0.35, "typing": 3.0, "ding": 0.8, "whoosh": 0.6, "mail": 0.5, "check": 0.25,
              "error": 0.4, "block": 0.3, "alarm": 0.9, "ping2": 1.2, "lock": 0.45}


@unittest.skipIf(g is None, "needs numpy/scipy (video/engine/.venv-chatterbox)")
class SfxLibraryTest(unittest.TestCase):
    def setUp(self):
        self.sounds = g.render_all()

    def test_has_the_eleven_sounds_with_a_mix_volume(self):
        self.assertEqual(sorted(self.sounds), sorted(EXPECTED_S))
        self.assertEqual(sorted(g.VOLUMES), sorted(EXPECTED_S))
        self.assertTrue(all(0 < v <= 0.3 for v in g.VOLUMES.values()))

    def test_each_sound_is_audible_and_peaks_at_minus_1_dbfs(self):
        for name, x in self.sounds.items():
            peak = float(np.max(np.abs(x)))
            self.assertAlmostEqual(peak, 10 ** (-1 / 20), places=4, msg=name)
            # sparse sounds (typing) have a low RMS: this only rules out silence
            self.assertGreater(float(np.sqrt(np.mean(x ** 2))), 0.005, msg=name)

    def test_durations_match_the_spec(self):
        for name, x in self.sounds.items():
            self.assertAlmostEqual(len(x) / g.SR, EXPECTED_S[name], delta=EXPECTED_S[name] * 0.15, msg=name)

    def test_is_deterministic(self):
        again = g.render_all()
        for name in self.sounds:
            self.assertTrue(np.array_equal(self.sounds[name], again[name]), msg=name)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `video/engine/.venv-chatterbox/Scripts/python.exe -m unittest discover -s video/engine/scripts -p "test_sfx_generate.py"`
Expected: ERROR `No module named 'sfx_generate'` → el `try` pone `g = None` y los tests quedan *skipped*.
Para ver el fallo real, comprobar que `python -c "import sys; sys.path.insert(0,'video/engine/scripts'); import sfx_generate"` falla con `ModuleNotFoundError`.

- [ ] **Step 3: Write `sfx_generate.py`**

```python
"""Sound-effect library for the lesson videos, generated with numpy/scipy (no samples, no licences).

    python video/engine/scripts/sfx_generate.py                      # writes video/engine/sfx/*.mp3 + sfx.json
    python video/engine/scripts/sfx_generate.py --preview board.mp3  # every sound in a row, to listen

Every sound comes from a fixed seed, so a rerun gives the same samples. Files peak at -1 dBFS; how loud each
one sounds in the mix is VOLUMES (a linear gain the timeline passes to Remotion, voice = 1).
"""
import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy import signal

SR = 44100
SEED = 20260928
ENGINE_DIR = Path(__file__).resolve().parent.parent
SFX_DIR = ENGINE_DIR / "sfx"
REPO_ROOT = ENGINE_DIR.parent.parent
VOLUMES = {"glitch": 0.22, "typing": 0.08, "ding": 0.15, "whoosh": 0.15, "mail": 0.20, "check": 0.18,
           "error": 0.20, "block": 0.22, "alarm": 0.20, "ping2": 0.20, "lock": 0.22}


def n_of(seconds):
    return int(round(seconds * SR))


def decay(n, tau_s):
    return np.exp(-np.arange(n) / (tau_s * SR))


def tone(freq, seconds, tau_s):
    n = n_of(seconds)
    return np.sin(2 * np.pi * freq * np.arange(n) / SR) * decay(n, tau_s)


def glide(f0, f1, seconds, tau_s):
    n = n_of(seconds)
    freq = np.linspace(f0, f1, n)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * decay(n, tau_s)


def band(x, lo, hi):
    return signal.sosfilt(signal.butter(4, [lo, hi], btype="bandpass", fs=SR, output="sos"), x)


def lowpass(x, hi):
    return signal.sosfilt(signal.butter(4, hi, btype="lowpass", fs=SR, output="sos"), x)


def place(total_s, *parts):
    """Mixes (start_s, samples) parts into one buffer of total_s seconds."""
    out = np.zeros(n_of(total_s))
    for start, x in parts:
        i = n_of(start)
        m = min(len(x), len(out) - i)
        out[i:i + m] += x[:m]
    return out


def edges(x, ms=4):
    k = max(1, int(SR * ms / 1000))
    x = x.copy()
    x[:k] *= np.linspace(0, 1, k)
    x[-k:] *= np.linspace(1, 0, k)
    return x


def click(rng, ms=8, lo=2000, hi=6000):
    n = n_of(ms / 1000)
    return band(rng.standard_normal(n), lo, hi) * decay(n, 0.002)


def glitch(rng):
    n = n_of(0.35)
    held = np.repeat(np.round(rng.standard_normal(n // 8 + 1) * 3) / 3, 8)[:n]  # sample-and-hold + bitcrush
    gate = np.repeat(rng.random(n // n_of(0.025) + 1) > 0.35, n_of(0.025))[:n]
    return held * gate * decay(n, 0.2)


def typing(rng):
    parts, t = [], 0.0
    while True:
        t += rng.uniform(0.045, 0.11)
        if t > 2.97:
            break
        parts.append((t, click(rng) * rng.uniform(0.6, 1.0)))
    return place(3.0, *parts)


def ding(rng):
    return tone(880, 0.8, 0.25) + 0.5 * tone(1320, 0.8, 0.18)


def whoosh(rng):
    n = n_of(0.6)
    noise = rng.standard_normal(n)
    p = np.sin(np.linspace(0, np.pi, n))
    return (lowpass(noise, 900) * (1 - p) + band(noise, 1500, 6000) * p) * np.sin(np.linspace(0, np.pi, n)) ** 2


def mail(rng):
    return place(0.5, (0, tone(660, 0.2, 0.08)), (0.15, tone(990, 0.35, 0.12)))


def check(rng):
    return glide(700, 1000, 0.25, 0.07)


def error(rng):
    burst = lowpass(signal.square(2 * np.pi * 150 * np.arange(n_of(0.12)) / SR), 2000) * decay(n_of(0.12), 0.08)
    return place(0.4, (0, burst), (0.18, burst))


def block(rng):
    return place(0.3, (0, tone(80, 0.3, 0.08)), (0, 0.6 * click(rng, ms=5, lo=1000, hi=4000)))


def alarm(rng):
    def beep(f):
        n = n_of(0.2)
        t = np.arange(n) / SR
        return edges(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 3 * f * t))
    return place(0.9, (0, beep(960)), (0.2, beep(720)), (0.4, beep(960)), (0.6, beep(720)))


def ping2(rng):
    ping = tone(1200, 0.7, 0.35)
    ping = ping + 0.3 * np.concatenate([np.zeros(n_of(0.12)), ping])[: len(ping)]
    return place(1.2, (0, ping), (0.45, ping))


def lock(rng):
    return place(0.45, (0, click(rng, ms=4)), (0.09, click(rng, ms=4)), (0.12, tone(110, 0.3, 0.06)))


SOUNDS = {"glitch": glitch, "typing": typing, "ding": ding, "whoosh": whoosh, "mail": mail, "check": check,
          "error": error, "block": block, "alarm": alarm, "ping2": ping2, "lock": lock}


def normalize(x, peak_db=-1.0):
    return edges(x) / (np.max(np.abs(edges(x))) + 1e-12) * 10 ** (peak_db / 20)


def render_all():
    """Every sound as float samples at SR, each from its own seeded generator (order-independent)."""
    return {name: normalize(make(np.random.default_rng([SEED, k]))) for k, (name, make) in enumerate(SOUNDS.items())}


def ffmpeg():
    for d in sorted((REPO_ROOT / "node_modules" / "@remotion").glob("compositor-*")):
        exe = d / ("ffmpeg.exe" if sys.platform == "win32" else "ffmpeg")
        if exe.exists():
            return str(exe)
    raise SystemExit("Remotion's ffmpeg not found: run npm install in the repo root")


def encode(wav, mp3):
    subprocess.run([ffmpeg(), "-v", "error", "-y", "-i", str(wav), "-map_metadata", "-1", "-fflags", "+bitexact",
                    "-flags:a", "+bitexact", "-c:a", "libmp3lame", "-b:a", "128k", "-write_xing", "0",
                    "-id3v2_version", "0", str(mp3)], check=True)


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--preview", help="also write every sound in a row (0.6 s apart) to this MP3")
    args = p.parse_args(argv)
    sounds = render_all()
    SFX_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for name, x in sounds.items():
            wav = Path(tmp) / f"{name}.wav"
            sf.write(wav, x, SR, subtype="PCM_16")
            encode(wav, SFX_DIR / f"{name}.mp3")
        if args.preview:
            gap = np.zeros(n_of(0.6))
            board = np.concatenate([np.concatenate([x * VOLUMES[name] / 0.22, gap]) for name, x in sounds.items()])
            wav = Path(tmp) / "preview.wav"
            sf.write(wav, board, SR, subtype="PCM_16")
            encode(wav, Path(args.preview))
    manifest = {"sampleRate": SR, "sounds": {name: {"file": f"{name}.mp3", "durationMs": round(len(x) * 1000 / SR),
                                                    "volume": VOLUMES[name]} for name, x in sounds.items()}}
    (SFX_DIR / "sfx.json").write_text(json.dumps(manifest, indent=1) + "\n", encoding="utf-8")
    print(f"sfx_generate: {len(sounds)} sounds -> {SFX_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Run tests and generate the library**

Run: `video/engine/.venv-chatterbox/Scripts/python.exe -m unittest discover -s video/engine/scripts -p "test_sfx_generate.py" -v` → 4 tests OK
Run: `video/engine/.venv-chatterbox/Scripts/python.exe -X utf8 video/engine/scripts/sfx_generate.py --preview video/capas-halden/out/sfx-preview.mp3`
Expected: `sfx_generate: 11 sounds -> …\video\engine\sfx`; `ls video/engine/sfx` muestra 11 `.mp3` y `sfx.json`.
Run it again and check `git status --short video/engine/sfx` shows no difference against the first run
(comparar hashes: `sha256sum video/engine/sfx/*.mp3` antes y después).

- [ ] **Step 5: Commit** (solo con permiso de Lidia)

```bash
git add video/engine/scripts/sfx_generate.py video/engine/scripts/test_sfx_generate.py video/engine/sfx
git commit -m "feat(video): generated sound-effect library (11 sounds, fixed seed)"
```

---

### Task 3: Colocación de efectos (`lib/sfx.mjs`)

**Files:**
- Create: `video/engine/scripts/lib/sfx.mjs`, `video/engine/scripts/lib/sfx.test.mjs`
- Modify: `video/engine/scripts/lib/paths.mjs` (dos constantes)

**Interfaces:**
- Consumes: `intercept-timing.json` (Task 1), `sfx.json` (Task 2).
- Produces (en `lib/sfx.mjs`):
  - `INTERCEPT_TIMING` (el JSON de Task 1), `VOICE_MARGIN_FRAMES = 10`, `AUTO_SOUNDS = ['glitch', 'typing', 'ding', 'whoosh']`
  - `voicedHoldFrames(holdFrames: number, voiceFrames: number) -> number`
  - `readSfxLibrary(dir: string) -> { sampleRate, sounds: Record<string, { file, durationMs, volume }> }` (lanza si falta `sfx.json`)
  - `sfxMapErrors(map: object, cueIds: Set<string>, library) -> string[]`
  - `placeSfx({ scenes, cues, exam, intercept, map, library, fps, transitionFrames }) -> SfxCue[]` con
    `SfxCue = { from, sound, src, durationInFrames, volume }`, ordenado por `from` y luego `sound`
  - `syncSfxFiles(sfx: SfxCue[], library, fromDir: string, toDir: string) -> void`
- Produces (en `lib/paths.mjs`): `SFX_DIR = <engine>/sfx`; en `videoPaths(slug)`: `publicSfxDir: <video>/public/sfx`.

- [ ] **Step 1: Write the failing tests** — `lib/sfx.test.mjs`:

```js
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { INTERCEPT_TIMING, VOICE_MARGIN_FRAMES, placeSfx, readSfxLibrary, sfxMapErrors, syncSfxFiles, voicedHoldFrames } from './sfx.mjs';

const NAMES = ['glitch', 'typing', 'ding', 'whoosh', 'mail', 'check', 'error', 'block', 'alarm', 'ping2', 'lock'];
const library = { sampleRate: 44100, sounds: Object.fromEntries(NAMES.map((n) => [n, { file: `${n}.mp3`, durationMs: n === 'typing' ? 3000 : 400, volume: 0.2 }])) };
const tmp = mkdtempSync(path.join(tmpdir(), 'sfx-'));
after(() => rmSync(tmp, { recursive: true, force: true }));

const scenes = [
  { id: 's01', chapter: 1, from: 0, durationInFrames: 300 },
  { id: 's02', chapter: 1, from: 300, durationInFrames: 300 },
  { id: 's03', chapter: 2, from: 600, durationInFrames: 300 },
];
const cues = [{ scene: 's01', id: 'mail-in', frame: 50 }, { scene: 's03', id: 'alert', frame: 700 }];
const exam = [{ scene: 's02', from: 400, durationInFrames: 150 }];
const intercept = [{ scene: 's02', from: 320, durationInFrames: 200, text: 'x'.repeat(40) }];
const base = { scenes, cues, exam, intercept, library, fps: 30, transitionFrames: 15 };

test('voicedHoldFrames: the written hold unless the voice needs longer', () => {
  assert.equal(voicedHoldFrames(90, 30), 90);
  assert.equal(voicedHoldFrames(90, 150), INTERCEPT_TIMING.typeStart + 150 + VOICE_MARGIN_FRAMES);
});

test('placeSfx: automatic sounds for intercepts, exam cards and chapter changes', () => {
  const sfx = placeSfx({ ...base, map: {} });
  const at = (sound) => sfx.filter((s) => s.sound === sound).map((s) => s.from);
  assert.deepEqual(at('glitch'), [320]);
  assert.deepEqual(at('typing'), [320 + INTERCEPT_TIMING.typeStart]);
  assert.equal(sfx.find((s) => s.sound === 'typing').durationInFrames, 40 * INTERCEPT_TIMING.typeRate, 'typing lasts as long as the text types');
  assert.deepEqual(at('ding'), [400]);
  assert.deepEqual(at('whoosh'), [600 - 15], 'whoosh on the chapter wipe only, not on s02');
  assert.deepEqual(sfx.map((s) => s.from), [...sfx.map((s) => s.from)].sort((a, b) => a - b));
  assert.deepEqual(sfx[0], { from: 320, sound: 'glitch', src: 'sfx/glitch.mp3', durationInFrames: 12, volume: 0.2 });
});

test('placeSfx: a key moment plays on its cue frame', () => {
  const sfx = placeSfx({ ...base, map: { 'mail-in': 'mail', alert: 'alarm' } });
  assert.deepEqual(sfx.filter((s) => ['mail', 'alarm'].includes(s.sound)).map((s) => [s.sound, s.from]), [['mail', 50], ['alarm', 700]]);
});

test('sfxMapErrors: unknown cue ids and sound names, and a library without the automatic sounds', () => {
  const ids = new Set(cues.map((c) => c.id));
  assert.deepEqual(sfxMapErrors({ 'mail-in': 'mail' }, ids, library), []);
  const errs = sfxMapErrors({ 'mail-inn': 'mail', alert: 'siren' }, ids, library);
  assert.equal(errs.length, 2);
  assert.match(errs[0], /mail-inn/);
  assert.match(errs[1], /siren/);
  const partial = { sounds: { mail: library.sounds.mail } };
  assert.match(sfxMapErrors({}, ids, partial).join('\n'), /glitch/);
  assert.match(sfxMapErrors([], ids, library).join('\n'), /object/);
});

test('readSfxLibrary reads sfx.json and says how to create it when missing', () => {
  writeFileSync(path.join(tmp, 'sfx.json'), JSON.stringify(library));
  assert.deepEqual(readSfxLibrary(tmp), library);
  assert.throws(() => readSfxLibrary(path.join(tmp, 'nope')), /sfx_generate\.py/);
});

test('syncSfxFiles copies the sounds in use and removes the ones no longer used', () => {
  const from = path.join(tmp, 'lib');
  const to = path.join(tmp, 'public-sfx');
  mkdirSync(from, { recursive: true });
  mkdirSync(to, { recursive: true });
  for (const n of NAMES) writeFileSync(path.join(from, `${n}.mp3`), n);
  writeFileSync(path.join(to, 'old.mp3'), 'old');
  syncSfxFiles(placeSfx({ ...base, map: {} }), library, from, to);
  assert.deepEqual(readdirSync(to).sort(), ['ding.mp3', 'glitch.mp3', 'typing.mp3', 'whoosh.mp3']);
  assert.equal(existsSync(path.join(to, 'old.mp3')), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test "video/engine/scripts/lib/sfx.test.mjs"`
Expected: FAIL `Cannot find module …/lib/sfx.mjs`.

- [ ] **Step 3: Write `lib/sfx.mjs` and the two path constants**

En `lib/paths.mjs`, tras `REPO_ROOT`:

```js
/** The generated sound-effect library (scripts/sfx_generate.py): <name>.mp3 + sfx.json. */
export const SFX_DIR = path.join(ENGINE_DIR, 'sfx');
```

y en el objeto de `videoPaths(slug)`, tras `voiceDir`:

```js
    publicSfxDir: path.join(dir, 'public', 'sfx'),
```

`lib/sfx.mjs`:

```js
// Sound effects of a lesson video: where each one plays (build-timeline writes them to timeline.sfx) and the
// files the composition needs in the video's public/sfx/. The sounds themselves come from
// scripts/sfx_generate.py (video/engine/sfx/<name>.mp3 + sfx.json).
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import INTERCEPT_TIMING from '../../src/overlay/intercept-timing.json' with { type: 'json' };

export { INTERCEPT_TIMING };
/** Frames of silence kept after the adversary's voice, before the narrator answers. */
export const VOICE_MARGIN_FRAMES = 10;
/** Sounds placed without being named in narration.json "sfx". */
export const AUTO_SOUNDS = Object.freeze(['glitch', 'typing', 'ding', 'whoosh']);

/** The silent lead before an intercept's answer: the written hold, or longer if the adversary's voice needs it. */
export function voicedHoldFrames(holdFrames, voiceFrames) {
  return Math.max(holdFrames, INTERCEPT_TIMING.typeStart + voiceFrames + VOICE_MARGIN_FRAMES);
}

export function readSfxLibrary(dir) {
  const file = path.join(dir, 'sfx.json');
  if (!existsSync(file)) throw new Error(`no sound library at ${file} — run: python video/engine/scripts/sfx_generate.py`);
  return JSON.parse(readFileSync(file, 'utf8'));
}

/** Problems with narration.json "sfx" ({cue id: sound}) against the video's cues and the library. */
export function sfxMapErrors(map, cueIds, library) {
  if (map === null || typeof map !== 'object' || Array.isArray(map)) return ['narration.sfx must be an object of cue id -> sound name'];
  const errors = [];
  const sounds = Object.keys(library.sounds ?? {});
  for (const [id, sound] of Object.entries(map)) {
    if (!cueIds.has(id)) errors.push(`sfx: no cue {${id}} in the narration`);
    if (!sounds.includes(sound)) errors.push(`sfx: unknown sound "${sound}" for {${id}} (have: ${sounds.join(', ')})`);
  }
  const missing = AUTO_SOUNDS.filter((s) => !sounds.includes(s));
  if (missing.length) errors.push(`sfx: the library has no ${missing.join(', ')} — run: python video/engine/scripts/sfx_generate.py`);
  return errors;
}

/**
 * Every sound effect of the video, in frame order: a glitch and the typing when an intercepted message
 * appears, a ding on each exam card, a whoosh on each chapter wipe, and narration.json "sfx" on its cues.
 */
export function placeSfx({ scenes, cues, exam, intercept, map, library, fps, transitionFrames }) {
  const frames = (ms) => Math.ceil((ms * fps) / 1000);
  const cue = (sound, from, maxFrames = Infinity) => {
    const s = library.sounds[sound];
    return { from, sound, src: `sfx/${s.file}`, durationInFrames: Math.max(1, Math.min(frames(s.durationMs), maxFrames)), volume: s.volume };
  };
  const out = [];
  for (const i of intercept) {
    out.push(cue('glitch', i.from));
    out.push(cue('typing', i.from + INTERCEPT_TIMING.typeStart, i.text.length * INTERCEPT_TIMING.typeRate));
  }
  for (const e of exam) out.push(cue('ding', e.from));
  scenes.forEach((s, k) => {
    if (k > 0 && s.chapter !== scenes[k - 1].chapter) out.push(cue('whoosh', s.from - transitionFrames));
  });
  for (const [id, sound] of Object.entries(map)) for (const c of cues.filter((x) => x.id === id)) out.push(cue(sound, c.frame));
  return out.sort((a, b) => a.from - b.from || a.sound.localeCompare(b.sound));
}

/** Copies the sounds `sfx` uses from the library into the video's public/sfx/ and removes the rest there. */
export function syncSfxFiles(sfx, library, fromDir, toDir) {
  mkdirSync(toDir, { recursive: true });
  const used = new Set(sfx.map((s) => library.sounds[s.sound].file));
  for (const file of used) copyFileSync(path.join(fromDir, file), path.join(toDir, file));
  for (const file of readdirSync(toDir)) if (file.endsWith('.mp3') && !used.has(file)) rmSync(path.join(toDir, file));
}
```

- [ ] **Step 4: Run the tests**

Run: `node --test "video/engine/scripts/lib/sfx.test.mjs"` → 6 tests PASS
Run: `node --test "video/engine/scripts/lib/*.test.mjs"` → todo en verde

- [ ] **Step 5: Commit** (solo con permiso de Lidia)

```bash
git add video/engine/scripts/lib/sfx.mjs video/engine/scripts/lib/sfx.test.mjs video/engine/scripts/lib/paths.mjs
git commit -m "feat(video): place sound effects on intercepts, exam cards, chapters and cues"
```

---

### Task 4: Configuración y clave de la voz del adversario (`lib/adversary.mjs`)

**Files:**
- Create: `video/engine/scripts/lib/adversary.mjs`, `video/engine/scripts/lib/adversary.test.mjs`
- Modify: `video/engine/scripts/lib/narration.mjs` (validación en `analyzeNarration`, junto a la de `narration.voice`)

**Interfaces:**
- Produces:
  - `ADVERSARY_FX = ['machine']`, `SAPI_VOICE = /^sapi\/[A-Za-z][A-Za-z0-9 ]*$/`
  - `adversaryVoiceErrors(cfg) -> string[]`
  - `adversaryConfig(cfg) -> { voice: string, rate: number, fx: string }` (rellena `rate` 0 y `fx` 'machine')
  - `adversaryKey(config, text) -> string` (sha256 hex)
  - `adversaryClipId(segId) -> string` = `<segId>-intercept`
  - `sapiArgs({ script, voiceName, rate, textFile, out }) -> string[]`
  - `adversaryRecord({ config, text, bytes, durationMs, gainDb }) -> object`
  - `hashKeys({ segments, adversaryVoice, narrationKey, adversaryKeyOf }) -> [id, key][]`

- [ ] **Step 1: Write the failing tests** — `lib/adversary.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { adversaryClipId, adversaryConfig, adversaryKey, adversaryRecord, adversaryVoiceErrors, hashKeys, sapiArgs } from './adversary.mjs';
import { analyzeNarration } from './narration.mjs';

const cfg = { voice: 'sapi/Microsoft Pablo', rate: 0, fx: 'machine' };

test('adversaryVoiceErrors: a SAPI voice, a rate from -10 to 10 and a known preset', () => {
  assert.deepEqual(adversaryVoiceErrors(cfg), []);
  assert.deepEqual(adversaryVoiceErrors({ voice: 'sapi/Microsoft Pablo' }), []);
  assert.equal(adversaryVoiceErrors({ voice: 'Microsoft Pablo' }).length, 1);
  assert.equal(adversaryVoiceErrors({ ...cfg, rate: 11 }).length, 1);
  assert.equal(adversaryVoiceErrors({ ...cfg, rate: 1.5 }).length, 1);
  assert.equal(adversaryVoiceErrors({ ...cfg, fx: 'radio' }).length, 1);
  assert.equal(adversaryVoiceErrors('sapi/Microsoft Pablo').length, 1);
});

test('adversaryConfig fills the defaults; the key changes with voice, rate, preset and text', () => {
  assert.deepEqual(adversaryConfig({ voice: 'sapi/Microsoft Pablo' }), cfg);
  const k = adversaryKey(cfg, 'Hola.');
  assert.match(k, /^[0-9a-f]{64}$/);
  assert.equal(adversaryKey(cfg, 'Hola.'), k);
  for (const other of [adversaryKey({ ...cfg, rate: 1 }, 'Hola.'), adversaryKey(cfg, 'Hola!'), adversaryKey({ ...cfg, voice: 'sapi/Microsoft Helena' }, 'Hola.')]) {
    assert.notEqual(other, k);
  }
  assert.equal(adversaryClipId('s03-04'), 's03-04-intercept');
});

test('sapiArgs runs the script with the voice name (without "sapi/") and the text in a file', () => {
  assert.deepEqual(sapiArgs({ script: 's.ps1', voiceName: 'Microsoft Pablo', rate: -1, textFile: 't.txt', out: 'o.wav' }), [
    '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 's.ps1', '-Voice', 'Microsoft Pablo', '-Rate', '-1', '-TextFile', 't.txt', '-Out', 'o.wav',
  ]);
});

test('adversaryRecord is keyed like the clip it describes', () => {
  const r = adversaryRecord({ config: cfg, text: 'Hola.', bytes: 1000, durationMs: 4200, gainDb: -2.5 });
  assert.deepEqual(r, { provider: 'sapi', key: adversaryKey(cfg, 'Hola.'), ...cfg, text: 'Hola.', bytes: 1000, bitrateKbps: 96, durationMs: 4200, gainDb: -2.5 });
});

test('hashKeys: every segment, then one adversary clip per intercepted message (only with a voice)', () => {
  const segments = [{ id: 'a', intercept: null }, { id: 'b', intercept: { text: 'x' } }];
  const narrationKey = (s) => `n-${s.id}`;
  const adversaryKeyOf = (s) => `v-${s.id}`;
  assert.deepEqual(hashKeys({ segments, adversaryVoice: null, narrationKey, adversaryKeyOf }), [['a', 'n-a'], ['b', 'n-b']]);
  assert.deepEqual(hashKeys({ segments, adversaryVoice: cfg, narrationKey, adversaryKeyOf }), [['a', 'n-a'], ['b', 'n-b'], ['b-intercept', 'v-b']]);
});

test('analyzeNarration validates adversaryVoice and the shape of sfx', () => {
  const storyboard = { scenes: [{ id: 's01', title: 'Uno', layout: 'map', chapter: 1 }] };
  const run = (extra) => analyzeNarration({ storyboard, narration: { voice: 'recording/lidia', segments: [{ id: 's01-01', scene: 's01', text: 'Hola.' }], ...extra }, lexicon: {} }).errors;
  const about = (errs, re) => errs.filter((e) => re.test(e));
  assert.deepEqual(about(run({ adversaryVoice: cfg, sfx: {} }), /adversaryVoice|sfx/), []);
  assert.equal(about(run({ adversaryVoice: { voice: 'Pablo' } }), /adversaryVoice/).length, 1);
  assert.equal(about(run({ sfx: ['mail'] }), /sfx/).length, 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test "video/engine/scripts/lib/adversary.test.mjs"`
Expected: FAIL `Cannot find module …/lib/adversary.mjs`.

- [ ] **Step 3: Write `lib/adversary.mjs` and the validation**

`lib/adversary.mjs`:

```js
// The section adversary's voice (narration.json "adversaryVoice"): a Windows SAPI voice treated with an
// effect preset, one clip per intercepted message (tts-adversary.mjs writes them). Pure helpers.
import { createHash } from 'node:crypto';

export const ADVERSARY_FX = Object.freeze(['machine']);
export const SAPI_VOICE = /^sapi\/[A-Za-z][A-Za-z0-9 ]*$/;
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function adversaryVoiceErrors(cfg) {
  if (!isObj(cfg)) return ['narration.adversaryVoice must be an object like {"voice": "sapi/Microsoft Pablo", "fx": "machine"}'];
  const errors = [];
  if (typeof cfg.voice !== 'string' || !SAPI_VOICE.test(cfg.voice)) errors.push(`narration.adversaryVoice.voice ${JSON.stringify(cfg.voice)} must be "sapi/<Windows voice name>"`);
  if (cfg.rate !== undefined && !(Number.isInteger(cfg.rate) && cfg.rate >= -10 && cfg.rate <= 10)) errors.push('narration.adversaryVoice.rate must be an integer from -10 to 10');
  if (cfg.fx !== undefined && !ADVERSARY_FX.includes(cfg.fx)) errors.push(`narration.adversaryVoice.fx must be one of: ${ADVERSARY_FX.join(', ')}`);
  return errors;
}

export function adversaryConfig(cfg) {
  return { voice: cfg.voice, rate: cfg.rate ?? 0, fx: cfg.fx ?? 'machine' };
}

export function adversaryKey(config, text) {
  return createHash('sha256').update(`${config.voice}\n${config.rate}\n${config.fx}\n${text}`, 'utf8').digest('hex');
}

export const adversaryClipId = (segId) => `${segId}-intercept`;

/** powershell.exe arguments for scripts/sapi_tts.ps1. */
export function sapiArgs({ script, voiceName, rate, textFile, out }) {
  return ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script, '-Voice', voiceName, '-Rate', String(rate), '-TextFile', textFile, '-Out', out];
}

/** tts/<segment>-intercept.json */
export function adversaryRecord({ config, text, bytes, durationMs, gainDb }) {
  return { provider: 'sapi', key: adversaryKey(config, text), ...config, text, bytes, bitrateKbps: 96, durationMs, gainDb };
}

/**
 * The [id, key] pairs timeline.sourceHash covers, in one fixed order for build-timeline (which computes the
 * keys) and freshness.mjs (which reads them from the records): every segment, then each adversary clip.
 */
export function hashKeys({ segments, adversaryVoice, narrationKey, adversaryKeyOf }) {
  const keys = segments.map((seg) => [seg.id, narrationKey(seg)]);
  if (adversaryVoice) for (const seg of segments.filter((s) => s.intercept)) keys.push([adversaryClipId(seg.id), adversaryKeyOf(seg)]);
  return keys;
}
```

En `lib/narration.mjs`, importar `import { adversaryVoiceErrors } from './adversary.mjs';` y, justo después
del bloque que valida `narration.voice` (el `if` que empuja el error «narration.voice … must be …»):

```js
  if (narration.adversaryVoice !== undefined) errors.push(...adversaryVoiceErrors(narration.adversaryVoice));
  if (narration.sfx !== undefined && !isObj(narration.sfx)) errors.push('narration.sfx must be an object of cue id -> sound name');
```

- [ ] **Step 4: Run the tests**

Run: `node --test "video/engine/scripts/lib/adversary.test.mjs"` → 6 PASS
Run: `node --test "video/engine/scripts/lib/*.test.mjs"` → todo en verde

- [ ] **Step 5: Commit** (solo con permiso de Lidia)

```bash
git add video/engine/scripts/lib/adversary.mjs video/engine/scripts/lib/adversary.test.mjs video/engine/scripts/lib/narration.mjs
git commit -m "feat(video): adversaryVoice config, keys and validation"
```

---

### Task 5: Generar la voz del adversario (`tts-adversary.mjs`)

**Files:**
- Create: `video/engine/scripts/adversary_fx.py`, `video/engine/scripts/test_adversary_fx.py`, `video/engine/scripts/sapi_tts.ps1`, `video/engine/scripts/tts-adversary.mjs`

**Interfaces:**
- Consumes: `lib/adversary.mjs` (Task 4); `gainDb`, `parseLoudness` de `lib/recording.mjs`; `runFfmpeg` de
  `lib/remotion.mjs`; `VENV_PYTHON` de `tts-chatterbox.mjs`.
- Produces: `public/voice/<seg>-intercept.mp3` + `tts/<seg>-intercept.json` (registro de `adversaryRecord`).
  Python: `machine(y: np.ndarray, sr: int) -> np.ndarray`.

- [ ] **Step 1: Write the failing test** — `test_adversary_fx.py`:

```python
import unittest

try:
    import numpy as np
    from adversary_fx import machine
except ImportError:
    machine = None


@unittest.skipIf(machine is None, "needs librosa/scipy (video/engine/.venv-chatterbox)")
class MachinePresetTest(unittest.TestCase):
    def test_keeps_the_length_and_peaks_at_minus_1_dbfs(self):
        sr = 22050
        t = np.arange(sr) / sr
        y = 0.3 * np.sin(2 * np.pi * 220 * t)
        out = machine(y, sr)
        self.assertEqual(len(out), len(y))
        self.assertAlmostEqual(float(np.max(np.abs(out))), 10 ** (-1 / 20), places=6)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `video/engine/.venv-chatterbox/Scripts/python.exe -c "import sys; sys.path.insert(0, 'video/engine/scripts'); import adversary_fx"`
Expected: `ModuleNotFoundError: No module named 'adversary_fx'`.

- [ ] **Step 3: Write `adversary_fx.py`, `sapi_tts.ps1` and `tts-adversary.mjs`**

`adversary_fx.py`:

```python
"""Effect presets for the adversary's voice (tts-adversary.mjs):

    python adversary_fx.py --in <wav> --out <wav> [--preset machine]

machine: 4 semitones down, ring modulation (0.6 + 0.4 sin 2π·48·t) and a 120–5000 Hz band-pass; same length,
peak at -1 dBFS.
"""
import argparse
import sys

import librosa
import numpy as np
import soundfile as sf
from scipy import signal


def machine(y, sr):
    low = librosa.effects.pitch_shift(np.asarray(y, dtype=np.float32), sr=sr, n_steps=-4)
    t = np.arange(len(low)) / sr
    ringed = low * (0.6 + 0.4 * np.sin(2 * np.pi * 48 * t))
    out = signal.sosfilt(signal.butter(4, [120, 5000], btype="bandpass", fs=sr, output="sos"), ringed)
    return out / (np.max(np.abs(out)) + 1e-12) * 10 ** (-1 / 20)


PRESETS = {"machine": machine}


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--in", dest="src", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--preset", default="machine", choices=sorted(PRESETS))
    args = p.parse_args(argv)
    y, sr = librosa.load(args.src, sr=None, mono=True)
    sf.write(args.out, PRESETS[args.preset](y, sr), sr, subtype="PCM_16")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

`sapi_tts.ps1`:

```powershell
# Speaks the text in -TextFile (UTF-8) with a Windows SAPI voice into a WAV file. Used by tts-adversary.mjs.
param(
  [Parameter(Mandatory = $true)][string]$Voice,
  [int]$Rate = 0,
  [Parameter(Mandatory = $true)][string]$TextFile,
  [Parameter(Mandatory = $true)][string]$Out
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$installed = @($s.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name })
if ($installed -notcontains $Voice) {
  [Console]::Error.WriteLine("voice not installed: $Voice (installed: $($installed -join ', '))")
  exit 3
}
$s.SelectVoice($Voice)
$s.Rate = $Rate
$s.SetOutputToWaveFile($Out)
$s.Speak([IO.File]::ReadAllText($TextFile, [Text.Encoding]::UTF8))
$s.Dispose()
```

`tts-adversary.mjs`:

```js
#!/usr/bin/env node
// Voices the section adversary's intercepted messages (narration.json "adversaryVoice"):
//
//   node video/engine/scripts/tts-adversary.mjs --video <slug> [--force]
//
// For every segment with "intercept": Windows SAPI (sapi_tts.ps1) speaks intercept.text into a WAV,
// adversary_fx.py applies the preset, and ffmpeg brings it to the narration's loudness and encodes it like the
// narration clips -> public/voice/<segment>-intercept.mp3 + tts/<segment>-intercept.json. A clip whose record
// key and size still match is skipped (--force redoes it). Windows only.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { adversaryClipId, adversaryConfig, adversaryKey, adversaryRecord, sapiArgs } from './lib/adversary.mjs';
import { analyzeNarration, loadSources, reportOrThrow } from './lib/narration.mjs';
import { ENGINE_DIR, MANIFEST, PATHS, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';
import { gainDb, parseLoudness } from './lib/recording.mjs';
import { runFfmpeg, writeFileAtomic } from './lib/remotion.mjs';
import { VENV_PYTHON } from './tts-chatterbox.mjs';

const NARRATION_LUFS_FALLBACK = -18;

/** Mean integrated loudness of up to 5 narration clips in voiceDir (not adversary clips). */
function narrationLoudness(voiceDir) {
  const clips = existsSync(voiceDir) ? readdirSync(voiceDir).filter((f) => f.endsWith('.mp3') && !f.endsWith('-intercept.mp3')).sort().slice(0, 5) : [];
  if (!clips.length) return NARRATION_LUFS_FALLBACK;
  const values = clips.map((f) => {
    const res = runFfmpeg(['-hide_banner', '-nostats', '-i', path.join(voiceDir, f), '-af', 'loudnorm=print_format=json', '-f', 'null', '-']);
    return parseLoudness(res.stderr).integrated;
  });
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function durationMs(file) {
  const res = runFfmpeg(['-hide_banner', '-i', file, '-f', 'null', '-']);
  const m = /time=(\d+):(\d+):([\d.]+)/g;
  let last = null;
  for (const x of res.stderr.matchAll(m)) last = x;
  if (!last) throw new Error(`cannot read the duration of ${file}`);
  return Math.round((Number(last[1]) * 3600 + Number(last[2]) * 60 + Number(last[3])) * 1000);
}

export function voiceAdversary({ force = false, log = console } = {}) {
  if (process.platform !== 'win32') throw new Error('SAPI voices need Windows');
  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const analysis = analyzeNarration(sources, profileFor(MANIFEST.profile));
  reportOrThrow(analysis, log);
  if (!sources.narration.adversaryVoice) {
    log.log('tts-adversary: narration.json has no "adversaryVoice" — nothing to do');
    return;
  }
  const config = adversaryConfig(sources.narration.adversaryVoice);
  const todo = analysis.segments.filter((s) => s.intercept);
  if (!todo.length) log.warn('  aviso: adversaryVoice is set but no segment has an intercept');
  const target = narrationLoudness(PATHS.voiceDir);
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'adversary-'));
  try {
    for (const seg of todo) {
      const id = adversaryClipId(seg.id);
      const mp3 = path.join(PATHS.voiceDir, `${id}.mp3`);
      const json = path.join(PATHS.ttsDir, `${id}.json`);
      const key = adversaryKey(config, seg.intercept.text);
      if (!force && existsSync(json) && existsSync(mp3)) {
        const rec = JSON.parse(readFileSync(json, 'utf8'));
        if (rec.key === key && rec.bytes === statSync(mp3).size) {
          log.log(`  ${id}: cached`);
          continue;
        }
      }
      const textFile = path.join(tmp, `${id}.txt`);
      writeFileSync(textFile, seg.intercept.text, 'utf8');
      const raw = path.join(tmp, `${id}.raw.wav`);
      const sapi = spawnSync('powershell.exe', sapiArgs({ script: path.join(SCRIPTS_DIR, 'sapi_tts.ps1'), voiceName: config.voice.slice('sapi/'.length), rate: config.rate, textFile, out: raw }), { encoding: 'utf8', windowsHide: true });
      if (sapi.status !== 0) throw new Error(`SAPI failed for ${id}: ${(sapi.stderr || sapi.stdout).trim()}`);
      const fx = path.join(tmp, `${id}.fx.wav`);
      const py = spawnSync(VENV_PYTHON, ['-X', 'utf8', path.join(SCRIPTS_DIR, 'adversary_fx.py'), '--in', raw, '--out', fx, '--preset', config.fx], { cwd: REPO_ROOT, encoding: 'utf8', windowsHide: true, env: { ...process.env, HF_HOME: process.env.HF_HOME ?? path.join(ENGINE_DIR, '.cache', 'huggingface') } });
      if (py.status !== 0) throw new Error(`adversary_fx.py failed for ${id}: ${py.stderr.trim()}`);
      const gain = gainDb(parseLoudness(runFfmpeg(['-hide_banner', '-nostats', '-i', fx, '-af', 'loudnorm=print_format=json', '-f', 'null', '-']).stderr), target);
      const enc = runFfmpeg(['-v', 'error', '-y', '-i', fx, '-af', `volume=${gain}dB`, '-ac', '1', '-ar', '24000', '-c:a', 'libmp3lame', '-b:a', '96k', '-write_xing', '0', '-id3v2_version', '0', mp3]);
      if (enc.status !== 0) throw new Error(`ffmpeg failed for ${id}: ${enc.stderr.trim()}`);
      const record = adversaryRecord({ config, text: seg.intercept.text, bytes: statSync(mp3).size, durationMs: durationMs(mp3), gainDb: gain });
      writeFileAtomic(json, `${JSON.stringify(record, null, 1)}\n`);
      log.log(`  ${id}: ${(record.durationMs / 1000).toFixed(1)} s (gain ${gain} dB)`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (isMainModule(import.meta.url)) {
  try {
    const { values } = parseArgs({ options: { video: { type: 'string' }, force: { type: 'boolean', default: false } } });
    voiceAdversary({ force: values.force });
  } catch (error) {
    console.error(`tts-adversary: ${error.message}`);
    process.exit(1);
  }
}
```

- [ ] **Step 4: Run tests, then generate the three clips for capas-halden**

Run: `video/engine/.venv-chatterbox/Scripts/python.exe -m unittest discover -s video/engine/scripts -p "test_adversary_fx.py" -v` → OK
Añadir a `video/capas-halden/narration.json`, tras `"lexicon"`:

```json
  "adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" },
```

Run: `node video/engine/scripts/tts-adversary.mjs --video capas-halden` (sandbox desactivado)
Expected: tres líneas `sNN-NN-intercept: X.X s (gain …)`; `ls video/capas-halden/public/voice/*-intercept.mp3` → 3.
Run otra vez: las tres salen `cached`.

- [ ] **Step 5: Commit** (solo con permiso de Lidia)

```bash
git add video/engine/scripts/adversary_fx.py video/engine/scripts/test_adversary_fx.py video/engine/scripts/sapi_tts.ps1 video/engine/scripts/tts-adversary.mjs video/capas-halden/narration.json
git commit -m "feat(video): voice the adversary's intercepted messages with a SAPI voice and the machine preset"
```

---

### Task 6: Contrato del timeline (tipos y validación)

**Files:**
- Modify: `video/engine/src/timeline/types.ts` (`InterceptCue`, `Timeline`, nuevo `SfxCue`)
- Modify: `video/engine/scripts/lib/validate-timeline.mjs:6-17` (formas) y el bloque `if (t.intercept !== undefined)`
- Test: `video/engine/scripts/lib/sfx.test.mjs` (añadir)

**Interfaces:**
- Produces: `SfxCue { from, sound, src, durationInFrames, volume }`; `InterceptCue` con `audio?`, `audioFrom?`,
  `audioFrames?` (los tres o ninguno); `Timeline.sfx?: SfxCue[]` (no vacío cuando existe).

- [ ] **Step 1: Write the failing tests** — añadir a `lib/sfx.test.mjs` (con `import { validateTimeline } from './validate-timeline.mjs';`):

```js
const minimal = () => ({
  mode: 'audio', sourceHash: 'h', fps: 30, width: 1920, height: 1080, durationInFrames: 900, voice: 'recording/lidia',
  scenes: [{ id: 's01', chapter: 1, chapterTitle: 'Uno', title: 'Uno', from: 0, durationInFrames: 900 }],
  segments: [], captions: [], cues: [], exam: [], think: [],
});

test('validateTimeline accepts sfx and a voiced intercept, and rejects malformed ones', () => {
  const t = minimal();
  t.sfx = [{ from: 10, sound: 'ding', src: 'sfx/ding.mp3', durationInFrames: 24, volume: 0.15 }];
  t.intercept = [{ scene: 's01', from: 100, durationInFrames: 200, adversary: 'SILENT PAGER', text: 'Hola.', audio: 'voice/s01-01-intercept.mp3', audioFrom: 104, audioFrames: 150 }];
  assert.deepEqual(validateTimeline(t), []);

  const bad = minimal();
  bad.sfx = [{ from: 10, sound: 'ding', src: 'ding.mp3', durationInFrames: 0, volume: 2 }];
  bad.intercept = [{ scene: 's01', from: 100, durationInFrames: 200, adversary: 'SILENT PAGER', text: 'Hola.', audio: 'voice/x.mp3' }];
  const errs = validateTimeline(bad).join('\n');
  assert.match(errs, /sfx\[0\]\.src/);
  assert.match(errs, /sfx\[0\]\.durationInFrames/);
  assert.match(errs, /sfx\[0\]\.volume/);
  assert.match(errs, /intercept\[0\].*audio/);

  const empty = minimal();
  empty.sfx = [];
  assert.match(validateTimeline(empty).join('\n'), /timeline\.sfx/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test --test-name-pattern="validateTimeline accepts" "video/engine/scripts/lib/sfx.test.mjs"`
Expected: FAIL (`timeline: unexpected sfx`, `intercept[0]: unexpected audio, audioFrom, audioFrames`).

- [ ] **Step 3: Implement**

En `validate-timeline.mjs`:

```js
  SfxCue: ['from', 'sound', 'src', 'durationInFrames', 'volume'],
```

(en `SHAPES`) y

```js
const OPTIONAL = { Timeline: ['intercept', 'sfx'], InterceptCue: ['audio', 'audioFrom', 'audioFrames'] };
```

Dentro del `forEach` de `t.intercept`, tras `str(x.text, …)`:

```js
        const voiced = ['audio', 'audioFrom', 'audioFrames'].filter((k) => k in x);
        if (voiced.length && voiced.length < 3) errors.push(`${where}: audio, audioFrom and audioFrames go together`);
        if (voiced.length === 3) {
          str(x.audio, `${where}.audio`);
          int(x.audioFrom, `${where}.audioFrom`, x.from);
          int(x.audioFrames, `${where}.audioFrames`, 1);
        }
```

Y antes de `return errors;`:

```js
  if (t.sfx !== undefined) {
    if (!Array.isArray(t.sfx) || !t.sfx.length) errors.push('timeline.sfx: when present, a non-empty array');
    else {
      t.sfx.forEach((s, k) => {
        const where = `sfx[${k}]`;
        if (!keys(s, 'SfxCue', where)) return;
        int(s.from, `${where}.from`);
        str(s.sound, `${where}.sound`);
        if (typeof s.src !== 'string' || !s.src.startsWith('sfx/')) errors.push(`${where}.src: expected "sfx/<file>"`);
        int(s.durationInFrames, `${where}.durationInFrames`, 1);
        if (typeof s.volume !== 'number' || !(s.volume > 0 && s.volume <= 1)) errors.push(`${where}.volume: expected a number in (0, 1]`);
      });
    }
  }
```

En `src/timeline/types.ts`, añadir a `InterceptCue`:

```ts
  /** The adversary's voice, e.g. "voice/s03-04-intercept.mp3" — only when narration.json has adversaryVoice. */
  audio?: string;
  /** Frame the voice starts (the message starts typing). */
  audioFrom?: number;
  /** Length of the voice in frames. */
  audioFrames?: number;
```

(y cambiar su comentario a «shown on screen, voiced when the video has adversaryVoice»), el tipo nuevo:

```ts
/** One sound effect (build-timeline, from scripts/lib/sfx.mjs). */
export interface SfxCue {
  from: number;
  /** Library name, e.g. "glitch". */
  sound: string;
  /** Path in the video's public dir, e.g. "sfx/glitch.mp3". */
  src: string;
  /** How long it plays (cuts a loop such as typing). */
  durationInFrames: number;
  /** Linear mix volume, 0–1 (the voices play at 1). */
  volume: number;
}
```

y en `Timeline`:

```ts
  /** Present only when narration.json has "sfx". */
  sfx?: SfxCue[];
```

- [ ] **Step 4: Run tests and type-check**

Run: `node --test "video/engine/scripts/lib/*.test.mjs"` → verde
Run: `npx tsc --noEmit -p video/engine/tsconfig.json` → sin errores

- [ ] **Step 5: Commit** (solo con permiso de Lidia)

```bash
git add video/engine/src/timeline/types.ts video/engine/scripts/lib/validate-timeline.mjs video/engine/scripts/lib/sfx.test.mjs
git commit -m "feat(video): timeline contract for sound effects and the adversary's voice"
```

---

### Task 7: `build-timeline.mjs` y la comprobación previa al render

**Files:**
- Modify: `video/engine/scripts/build-timeline.mjs` (imports, `opts`, carga de clips del adversario, bucle de
  tiempos, `intercept.push`, hash, `sfx`, escritura, filtro de TTS obsoletos)
- Modify: `video/engine/scripts/lib/freshness.mjs`
- Test: `video/engine/scripts/lib/build-timeline.test.mjs` (añadir)

**Interfaces:**
- Consumes: Tasks 3, 4 y 6.
- Produces: `buildTimeline` acepta `opts.sfxDir` (por defecto `SFX_DIR`) y `opts.publicSfxDir` (por defecto
  `PATHS.publicSfxDir`); escribe `timeline.sfx` e `intercept[].audio*` según el spec §3.3 y §4.

- [ ] **Step 1: Write the failing tests** — añadir a `lib/build-timeline.test.mjs`:

```js
import { SFX_DIR } from './paths.mjs';

test('sfx: without the key the timeline has none; with it, automatic sounds and key moments are placed', async () => {
  const plain = await buildVariant(() => {}, 'no-sfx');
  assert.equal('sfx' in plain.timeline, false);

  const { timeline } = await buildVariant((n) => { n.sfx = { flood: 'mail' }; }, 'sfx', { sfxDir: SFX_DIR });
  const cue = (id) => timeline.cues.find((c) => c.id === id).frame;
  const of = (sound) => timeline.sfx.filter((s) => s.sound === sound).map((s) => s.from);
  assert.deepEqual(of('mail'), [cue('flood')]);
  assert.deepEqual(of('ding'), timeline.exam.map((e) => e.from));
  const wipes = timeline.scenes.filter((s, k) => k > 0 && s.chapter !== timeline.scenes[k - 1].chapter).map((s) => s.from - TIMING.transitionFrames);
  assert.deepEqual(of('whoosh'), wipes);
  assert.deepEqual(validateTimeline(timeline), []);
});

test('sfx: an unknown cue or sound stops the build', async () => {
  await assert.rejects(buildVariant((n) => { n.sfx = { flod: 'mail' }; }, 'sfx-bad-cue', { sfxDir: SFX_DIR }), /flod/);
  await assert.rejects(buildVariant((n) => { n.sfx = { flood: 'siren' }; }, 'sfx-bad-sound', { sfxDir: SFX_DIR }), /siren/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test --test-name-pattern="sfx" "video/engine/scripts/lib/build-timeline.test.mjs"`
Expected: FAIL (`timeline.sfx` es `undefined`).

- [ ] **Step 3: Implement in `build-timeline.mjs`**

1. Imports:

```js
import { adversaryClipId, adversaryConfig, adversaryKey, hashKeys } from './lib/adversary.mjs';
import { AUDIO_CMD, MANIFEST, PATHS, SFX_DIR, VIDEO, isMainModule } from './lib/paths.mjs';
import { INTERCEPT_TIMING, placeSfx, readSfxLibrary, sfxMapErrors, syncSfxFiles, voicedHoldFrames } from './lib/sfx.mjs';
```

(sustituye la línea actual de `./lib/paths.mjs`).

2. En `opts`, tras `voiceDir: PATHS.voiceDir,`:

```js
    sfxDir: SFX_DIR,
    publicSfxDir: PATHS.publicSfxDir,
```

3. Nueva función, junto a `loadAudio`:

```js
/** The adversary's voiced clips (tts-adversary.mjs), checked against the text and settings: seg id -> {audio, durationMs}. */
function loadAdversary(segments, config, opts, errors) {
  const clips = new Map();
  const cmd = `node video/engine/scripts/tts-adversary.mjs --video ${VIDEO}`;
  for (const seg of segments.filter((s) => s.intercept)) {
    const id = adversaryClipId(seg.id);
    const jsonPath = path.join(opts.ttsDir, `${id}.json`);
    const mp3Path = path.join(opts.voiceDir, `${id}.mp3`);
    if (!existsSync(jsonPath) || !existsSync(mp3Path)) {
      errors.push(`${seg.id}: no adversary voice (${id}) — run: ${cmd}`);
      continue;
    }
    const rec = parseJsonText(readFileSync(jsonPath, 'utf8'), jsonPath);
    if (rec.key !== adversaryKey(config, seg.intercept.text)) errors.push(`${seg.id}: the adversary voice is stale — run: ${cmd}`);
    else if (statSync(mp3Path).size !== rec.bytes) errors.push(`${seg.id}: ${mp3Path} does not match its record — run: ${cmd} --force`);
    else clips.set(seg.id, { audio: `voice/${id}.mp3`, durationMs: rec.durationMs });
  }
  return clips;
}
```

4. Tras `const audio = …` / `if (errors.length) reportOrThrow(…)`:

```js
  const adversaryVoice = sources.narration.adversaryVoice ? adversaryConfig(sources.narration.adversaryVoice) : null;
  const adversary = mode === 'audio' && adversaryVoice ? loadAdversary(analysis.segments, adversaryVoice, opts, errors) : new Map();
  if (errors.length) reportOrThrow({ errors, warnings }, log);
```

5. En el bucle, sustituir `if (seg.intercept) t += toFrames(seg.intercept.holdMs);` por:

```js
      const voiced = adversary.get(seg.id);
      const voiceFrames = voiced ? Math.ceil((voiced.durationMs * fps) / 1000) : 0;
      if (seg.intercept) t += voiced ? voicedHoldFrames(toFrames(seg.intercept.holdMs), voiceFrames) : toFrames(seg.intercept.holdMs);
```

y en `intercept.push({ … })`, tras `text: seg.intercept.text,`:

```js
          ...(voiced ? { audio: voiced.audio, audioFrom: leadFrom + INTERCEPT_TIMING.typeStart, audioFrames: voiceFrames } : {}),
```

6. Sustituir el bloque del hash en modo audio por:

```js
    const keys = hashKeys({
      segments: analysis.segments,
      adversaryVoice,
      narrationKey: (seg) => ttsKey(voice.voice, voice.rate, voice.pitch, spokenForVoice(voice.voice, seg.parsed)),
      adversaryKeyOf: (seg) => adversaryKey(adversaryVoice, seg.intercept.text),
    });
    hash = sourceHash(sources, keys);
```

7. Antes de `const timeline = {`:

```js
  let sfx = [];
  let sfxLibrary = null;
  if (sources.narration.sfx !== undefined) {
    try {
      sfxLibrary = readSfxLibrary(opts.sfxDir);
      const mapErrors = sfxMapErrors(sources.narration.sfx, new Set(cues.map((c) => c.id)), sfxLibrary);
      errors.push(...mapErrors);
      if (!mapErrors.length) {
        sfx = placeSfx({ scenes, cues, exam, intercept, map: sources.narration.sfx, library: sfxLibrary, fps, transitionFrames: TIMING.transitionFrames });
      }
    } catch (err) {
      errors.push(err.message);
    }
  }
```

y en el objeto `timeline`, tras la línea de `intercept`: `...(sfx.length ? { sfx } : {}),`.

8. En `if (opts.write) { … }` añadir: `if (sfx.length) syncSfxFiles(sfx, sfxLibrary, opts.sfxDir, opts.publicSfxDir);`

9. En el filtro de TTS obsoletos del `main`, excluir los clips del adversario:

```js
    ? readdirSync(opts.ttsDir ?? PATHS.ttsDir).filter((f) => f.endsWith('.json') && !f.endsWith('-intercept.json') && !timeline.segments.some((s) => `${s.id}.json` === f))
```

En `lib/freshness.mjs`, sustituir el cálculo de `keys` en modo audio por:

```js
    const adversaryVoice = sources.narration.adversaryVoice ? adversaryConfig(sources.narration.adversaryVoice) : null;
    const recordKey = (id) => {
      const file = path.join(PATHS.ttsDir, `${id}.json`);
      if (!existsSync(file)) {
        problems.push(`missing ${file}`);
        return null;
      }
      return parseJsonText(readFileSync(file, 'utf8'), file).key;
    };
    keys = hashKeys({
      segments: analysis.segments,
      adversaryVoice,
      narrationKey: (seg) => recordKey(seg.id),
      adversaryKeyOf: (seg) => recordKey(adversaryClipId(seg.id)),
    });
```

(con `import { adversaryClipId, adversaryConfig, hashKeys } from './adversary.mjs';`), y en el bucle final de
modo audio añadir la comprobación de los archivos nuevos:

```js
    for (const i of timeline.intercept ?? []) {
      if (i.audio && !existsSync(path.join(PATHS.publicDir, i.audio))) problems.push(`adversary voice missing (${i.audio})`);
    }
    for (const s of timeline.sfx ?? []) {
      if (!existsSync(path.join(PATHS.publicDir, s.src))) problems.push(`sound effect missing (${s.src})`);
    }
```

- [ ] **Step 4: Run the tests and a real check**

Run: `node --test "video/engine/scripts/lib/*.test.mjs"` → verde (incluida la prueba de siempre: sin `sfx`, sin clave)
Run: `node video/engine/scripts/build-timeline.mjs --video siem --check` y `--video forense-adquisicion --check`
Expected: sin errores; el hash no cambia porque no tienen `adversaryVoice` (comparar `sourceHash` con
`git show HEAD:video/siem/src/timeline.json`).

- [ ] **Step 5: Commit** (solo con permiso de Lidia)

```bash
git add video/engine/scripts/build-timeline.mjs video/engine/scripts/lib/freshness.mjs video/engine/scripts/lib/build-timeline.test.mjs
git commit -m "feat(video): build-timeline places sound effects and the adversary's voice"
```

---

### Task 8: Reproducirlo en el vídeo, conectar `audio.mjs` y configurar capas-halden

**Files:**
- Create: `video/engine/src/overlay/SfxLayer.tsx`
- Modify: `video/engine/src/LessonVideo.tsx`, `video/engine/scripts/audio.mjs`, `video/capas-halden/narration.json`,
  `video/engine/README.md`, `CLAUDE.md`

**Interfaces:**
- Consumes: `Timeline.sfx`, `InterceptCue.audio*` (Task 6); `useTimeline()` de `src/timeline/context`.

- [ ] **Step 1: Write `SfxLayer.tsx`**

```tsx
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { useTimeline } from '../timeline/context';

/** The adversary's voiced messages and the sound effects of timeline.json (audio only, nothing on screen). */
export function SfxLayer() {
  const timeline = useTimeline();
  return (
    <>
      {(timeline.intercept ?? []).map((i) =>
        i.audio && i.audioFrom !== undefined && i.audioFrames !== undefined ? (
          <Sequence key={`adversario-${i.from}`} name={`adversario ${i.scene}`} from={i.audioFrom} durationInFrames={i.audioFrames + 2} layout="none">
            <Html5Audio src={staticFile(i.audio)} />
          </Sequence>
        ) : null,
      )}
      {(timeline.sfx ?? []).map((s, k) => (
        <Sequence key={`sfx-${k}`} name={`sfx ${s.sound}`} from={s.from} durationInFrames={s.durationInFrames} layout="none">
          <Html5Audio src={staticFile(s.src)} volume={s.volume} />
        </Sequence>
      ))}
    </>
  );
}
```

En `LessonVideo.tsx`: `import { SfxLayer } from './overlay/SfxLayer';` y `<SfxLayer />` justo después del
`map` de `timeline.segments` (antes de `<ChapterRail />`).

- [ ] **Step 2: `audio.mjs` genera la voz del adversario antes del timeline**

Sustituir la línea `const narrationVoice = JSON.parse(…).voice;` por:

```js
  const narrationJson = JSON.parse(readFileSync(values.narration ? path.resolve(values.narration) : PATHS.narration, 'utf8').replace(/^﻿/, ''));
  const narrationVoice = narrationJson.voice;
  const adversaryStep = () => {
    if (narrationJson.adversaryVoice) step('tts-adversary', node, [path.join(SCRIPTS_DIR, 'tts-adversary.mjs'), ...pass(values, ['force'])]);
  };
```

y llamar `adversaryStep();` inmediatamente antes de cada `step('build-timeline', …)` (ElevenLabs, Chatterbox,
grabación y edge-tts). Añadir a la cabecera del archivo: `//   + tts-adversary.mjs before build-timeline when narration.json has "adversaryVoice"`.

- [ ] **Step 3: Configurar capas-halden** — en `video/capas-halden/narration.json`, tras `adversaryVoice`:

```json
  "sfx": {
    "mail-in": "mail", "spf-pass": "check", "dkim-pass": "check", "dmarc-fail": "error",
    "reject": "block", "blocked": "block", "implicit": "block", "alert": "alarm",
    "inline": "block", "hits-2": "ping2", "isolate": "lock", "dlp": "block"
  },
```

- [ ] **Step 4: Type-check, rebuild and check**

Run: `npx tsc --noEmit -p video/engine/tsconfig.json && npx tsc --noEmit -p video/capas-halden/tsconfig.json` → sin errores
Run: `node video/engine/scripts/audio.mjs --video capas-halden` (sandbox desactivado)
Expected: `== tts-adversary` (3 `cached`), `== build-timeline`, y en `src/timeline.json`: `sfx` con 12 efectos
de momentos clave + 3 `glitch` + 3 `typing` + 10 `ding` + los `whoosh` de capítulo; `intercept[]` con `audio`.
`ls video/capas-halden/public/sfx` → los 11 `.mp3`.

- [ ] **Step 5: Docs** — README del motor:
  - en «Mensaje interceptado», un párrafo «Con voz» (spec §3: `adversaryVoice`, `tts-adversary.mjs`, cómo crece el hueco);
  - una sección nueva «Efectos de sonido» (spec §4: biblioteca, `sfx_generate.py --preview`, colocación automática, `sfx` en `narration.json`, volúmenes, `public/sfx/`);
  - en «Pruebas», `sfx.test.mjs`, `adversary.test.mjs`, `test_sfx_generate.py`, `test_adversary_fx.py`.

  `CLAUDE.md`: una línea en «Lesson videos» con `adversaryVoice` (Pablo + `machine`) y `sfx`.

- [ ] **Step 6: Commit** (solo con permiso de Lidia)

```bash
git add video/engine/src/overlay/SfxLayer.tsx video/engine/src/LessonVideo.tsx video/engine/scripts/audio.mjs video/capas-halden/narration.json video/engine/README.md CLAUDE.md
git commit -m "feat(video): play the adversary's voice and sound effects; wire capas-halden"
```

---

### Task 9: Aprobación de oído (checkpoint con Lidia)

- [ ] **Step 1:** Enviar a Lidia `video/capas-halden/out/sfx-preview.mp3` (Task 2) y los tres
  `public/voice/*-intercept.mp3`.
- [ ] **Step 2:** Esperar su visto bueno. Si pide cambios de volumen, se editan en `VOLUMES` de
  `sfx_generate.py`, se regenera (Task 2, Step 4) y se reconstruye el timeline (Task 8, Step 4). Si pide cambios
  en un sonido, se cambia su función y se repite lo mismo.

---

### Task 10: Render final y verificación

- [ ] **Step 1:** Preguntar a Lidia qué versión renderizar (su voz está activa en `narration.json`; la de
  Chatterbox está guardada en `video/capas-halden/out/voices/chatterbox-ref4/`).
- [ ] **Step 2:** `node video/engine/scripts/render.mjs --video capas-halden` en segundo plano (sandbox desactivado).
  Expected: `ok -> …\capas-halden.mp4` y la sincronía A/V sin fallos.
- [ ] **Step 3:** Revisar con `qa-frames.mjs` los fotogramas de un mensaje interceptado (la tarjeta sigue igual).
- [ ] **Step 4:** Enviar el vídeo a Lidia y, si lo pide, hacer commit de todo lo pendiente.

---

## Self-review

- **Cobertura del spec:** §3.1 → Task 4 (validación) y Task 5 (config en capas-halden); §3.2 → Task 5; §3.3 →
  Tasks 1, 3 y 7; §4.1 → Task 2; §4.2 → Tasks 3 y 7; §4.3 → Task 8; §4.4 → Tasks 3 y 7; §5 → Tasks 6 y 7
  (hash también en `freshness.mjs`); §6 → todas; §7 → Tasks 3, 5 y 7; §8 → Tasks 1–7 y 9–10; §9 → Task 9
  (volúmenes) y aviso de licencia en README (Task 8, Step 5).
- **Tipos y nombres coherentes:** `SfxCue` (Tasks 3, 6, 8), `adversaryClipId`/`adversaryKey`/`hashKeys`
  (Tasks 4, 5, 7), `INTERCEPT_TIMING.typeStart`/`typeRate` (Tasks 1, 3, 7), `SFX_DIR`/`publicSfxDir`
  (Tasks 3, 7).
- **Sin marcadores pendientes.**
