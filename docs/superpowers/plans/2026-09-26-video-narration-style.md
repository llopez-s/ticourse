# Vídeos con chispa, voz con emoción, YouTube y Alertópolis: plan de implementación

> **Para agentes:** SUB-SKILL OBLIGATORIA: usar superpowers:subagent-driven-development (recomendado) o
> superpowers:executing-plans para ejecutar este plan tarea a tarea. Los pasos usan casillas (`- [ ]`) para el
> seguimiento.

**Objetivo:** que el motor de vídeo produzca vídeos nuevos más largos, con narración «con chispa», mensajes
interceptados del adversario, voz con emoción (ElevenLabs o Chatterbox) y destino YouTube, y que la app pase a
llamarse Alertópolis. Los vídeos publicados no cambian.

**Arquitectura:**
- Todo lo nuevo se activa con dos perfiles nuevos en `video/engine/scripts/lib/profiles.mjs`, `principal-yt` y
  `capsula-yt`. Los perfiles antiguos, y por tanto el SIEM y el forense, generan exactamente los mismos
  archivos.
- El mensaje interceptado recorre todo el motor:
  - un campo nuevo en cada segmento de `narration.json`;
  - un silencio antes del audio en `build-timeline`;
  - una clave opcional en `timeline.json`;
  - un overlay de Remotion.
- La app gana una variante del bloque de vídeo con ID de YouTube, que carga el reproductor solo al hacer clic.

**Stack:** Node 26 (`node:test`), Remotion 4 + React 19 + TypeScript, Python 3.12 (venv de Chatterbox, `unittest`),
Vite 7 + vitest 3 en la app.

**Spec:** `docs/superpowers/specs/2026-09-26-video-narration-style-design.md`.

## Restricciones globales

- **Rama `video-narration-style`.** Commits en ella, **sin push**: un push a `main` es un despliegue y lo
  decide Lidia.
- **Regresión.** `video/siem/src/timeline.json`, `video/forense-adquisicion/src/timeline.json` y
  `public/videos/*-transcript.txt` y `*-captions.vtt` deben quedar **byte a byte idénticos** después de cada
  tarea que toque el motor.
- **No se renombran nunca** las claves de guardado `intelforge-v1` (`src/lib/store.ts`) ni `intelforge-sync`
  (`src/lib/syncStore.ts`).
- **Perfiles, textuales de la spec:**
  - `principal-yt`: 380–500 s, 5 capítulos, 8–11 tarjetas de examen, 2 pausas para pensar, 2–4 mensajes
    interceptados, crf 18;
  - `capsula-yt`: 190–260 s, 3 capítulos, 4–6 tarjetas, 1 pausa, 1–2 mensajes, crf 18.
- **Límites de texto:**
  - tarjeta de examen ≤ 58 caracteres, pausa para pensar ≤ 48 y mensaje interceptado ≤ 70;
  - sin flechas ni emoji;
  - `intercept.holdMs` entre 2500 y 4500.
- **Mensajes interceptados:** máximo 1 por capítulo; ninguno en la última escena; nunca en el mismo segmento que
  una pausa para pensar.
- **Estilo del código:** comentarios en inglés; textos visibles y documentación en español; «analista» en
  femenino.
- **Entorno (Bash):**
  - Node sale de fnm: `eval "$(fnm env)"` antes de `node` o `npm`.
  - Los comandos con comillas invertidas (`` ` ``) no llegan a ejecutarse en esta herramienta: los parches con
    comillas invertidas se escriben con Edit/Write.
  - Los renders de Remotion y `build-timeline` en modo audio (usan el ffprobe de Remotion) pueden necesitar
    `dangerouslyDisableSandbox`.
- **Suites de prueba:**
  - motor: `node --test "video/engine/scripts/lib/*.test.mjs"` (el patrón entre comillas);
  - Python: `python -m unittest discover -s video/engine/scripts -p "test_*.py"`;
  - app: `npm test`;
  - tipos: `npx tsc --noEmit -p video/engine/tsconfig.json`;
  - build: `npm run build`.

---

### Task 1: Rama y adopción del trabajo de Chatterbox

**Archivos:**
- Commit (ya existen, sin commit desde el 2026-09-25):
  - `video/engine/scripts/tts-chatterbox.mjs`, `chatterbox_worker.py`, `chatterbox_text.py`;
  - `requirements-chatterbox.txt`, `test_chatterbox_text.py`, `test_chatterbox_loader.py`;
  - `video/engine/scripts/lib/chatterbox.test.mjs`.
- Commit (modificados): `CLAUDE.md`, `video/engine/.gitignore`, `video/engine/README.md`,
  `video/engine/scripts/audio.mjs`, `video/engine/scripts/build-timeline.mjs`,
  `video/engine/scripts/lib/narration.mjs`.
- Commit (documentos): la spec y este plan.

- [ ] **Paso 1: Crear la rama desde `origin/main`, conservando los cambios sin commit**

```bash
cd "/d/LLM projects/TICourse" && git fetch -q origin && git switch -c video-narration-style origin/main && git status --short
```

Resultado esperado:
- los seis archivos modificados (` M`) y los siete nuevos (`??`) de Chatterbox;
- la spec y el plan como `??`.

`origin/main` (`009ea9c`) tiene el mismo árbol que `video-forense-adquisicion`, así que el cambio de rama no
choca con nada.

- [ ] **Paso 2: Pasar las pruebas del trabajo adoptado**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && node --test "video/engine/scripts/lib/*.test.mjs" && video/engine/.venv-chatterbox/Scripts/python.exe -m unittest discover -s video/engine/scripts -p "test_*.py"
```

Resultado esperado: todo en verde (`# fail 0` en node; `OK` en unittest).

- [ ] **Paso 3: Comprobar la regresión antes de tocar nada**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && node video/engine/scripts/build-timeline.mjs --video siem && node video/engine/scripts/build-timeline.mjs --video forense-adquisicion && git diff --exit-code --stat -- video/siem/src/timeline.json video/forense-adquisicion/src/timeline.json public/videos/
```

Resultado esperado: termina con código 0 y sin diff. Si falla por el sandbox (ffprobe), repetir con
`dangerouslyDisableSandbox`. **Este comando es «la regresión»** en el resto del plan.

- [ ] **Paso 4: Commit del trabajo adoptado y, aparte, de los documentos**

```bash
cd "/d/LLM projects/TICourse" && git add CLAUDE.md video/engine/.gitignore video/engine/README.md video/engine/scripts/audio.mjs video/engine/scripts/build-timeline.mjs video/engine/scripts/lib/narration.mjs video/engine/scripts/lib/chatterbox.test.mjs video/engine/scripts/tts-chatterbox.mjs video/engine/scripts/chatterbox_worker.py video/engine/scripts/chatterbox_text.py video/engine/scripts/requirements-chatterbox.txt video/engine/scripts/test_chatterbox_text.py video/engine/scripts/test_chatterbox_loader.py && git commit -m "feat(video): add local Chatterbox narration to the engine" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git add docs/superpowers/specs/2026-09-26-video-narration-style-design.md docs/superpowers/plans/2026-09-26-video-narration-style.md && git commit -m "docs: spec and plan for lively narration, YouTube hosting and the Alertopolis name" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Perfiles `-yt`, destino YouTube y aviso con la marca

**Archivos:**
- Modificar: `video/engine/scripts/lib/profiles.mjs`
- Modificar: `video/engine/scripts/lib/paths.mjs` (ruta del MP4)
- Modificar: `video/engine/scripts/render.mjs` (tamaño y guarda contra el commit del MP4)
- Modificar: `video/engine/scripts/build-timeline.mjs:44` y `:341` (aviso por perfil)
- Modificar: `.gitignore` (raíz)
- Crear: `video/engine/scripts/lib/profiles.test.mjs`

**Interfaces:**
- Produce:
  - `PROFILES['principal-yt' | 'capsula-yt']`; cada perfil tiene ahora
    `{ …, host: 'repo' | 'youtube', chispa: boolean, intercepts: [min, max] | null, size: object | null }`;
  - `profileFor(name)`;
  - `trackNotice(track, profile = 'principal')`;
  - `mp4PathFor(manifest, dir, publicVideos)`;
  - las constantes `APP_NAME = 'Alertópolis'` y `LEGACY_APP_NAME = 'IntelForge Academy'`, exportadas desde
    `profiles.mjs`.

- [ ] **Paso 1: Escribir la prueba que falla**

`video/engine/scripts/lib/profiles.test.mjs`:

```js
import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { mp4PathFor } from './paths.mjs';
import { APP_NAME, LEGACY_APP_NAME, profileFor, trackNotice } from './profiles.mjs';

test('the legacy profiles keep their numbers, stay in the repo and use no chispa checks', () => {
  const p = profileFor('principal');
  assert.deepEqual([p.minTotalSec, p.maxTotalSec, p.crf, p.host, p.chispa], [280, 340, 23, 'repo', false]);
  assert.deepEqual(p.intercepts, [0, 0]);
  const c = profileFor('capsula');
  assert.deepEqual([c.minTotalSec, c.maxTotalSec, c.crf, c.host], [140, 200, 27, 'repo']);
});

test('the -yt profiles: longer windows, crf 18, YouTube, chispa checks, intercepted messages', () => {
  const p = profileFor('principal-yt');
  assert.deepEqual([p.minTotalSec, p.maxTotalSec, p.maxChapters, p.crf, p.host, p.chispa, p.size], [380, 500, 5, 18, 'youtube', true, null]);
  assert.deepEqual([p.examCards, p.thinkPrompts, p.intercepts], [[8, 11], 2, [2, 4]]);
  const c = profileFor('capsula-yt');
  assert.deepEqual([c.minTotalSec, c.maxTotalSec, c.maxChapters, c.crf, c.host, c.chispa, c.size], [190, 260, 3, 18, 'youtube', true, null]);
  assert.deepEqual([c.examCards, c.thinkPrompts, c.intercepts], [[4, 6], 1, [1, 2]]);
});

test('trackNotice: the old name for repo videos, Alertópolis for YouTube ones', () => {
  assert.equal(
    trackNotice('secplus'),
    `Simulación educativa con datos ficticios · ${LEGACY_APP_NAME} — material independiente, no afiliado a CompTIA`,
  );
  assert.equal(trackNotice('secplus', 'capsula'), trackNotice('secplus'));
  assert.equal(
    trackNotice('gcti', 'principal-yt'),
    `Simulación educativa con datos ficticios · ${APP_NAME} — material independiente, no afiliado a SANS/GIAC`,
  );
  assert.throws(() => trackNotice('ccna'), /unknown track/);
});

test('mp4PathFor: repo profiles render into public/videos, YouTube ones into the video out/ folder', () => {
  const dir = path.join('video', 'edr-v2');
  const pub = path.join('public', 'videos');
  assert.equal(mp4PathFor({ profile: 'principal', output: 'x' }, dir, pub), path.join(pub, 'x.mp4'));
  assert.equal(mp4PathFor({ profile: 'principal-yt', output: 'x' }, dir, pub), path.join(dir, 'out', 'x.mp4'));
});
```

- [ ] **Paso 2: Ejecutarla y verla fallar**

Ejecutar: `eval "$(fnm env)" && node --test video/engine/scripts/lib/profiles.test.mjs`
Resultado esperado: FAIL (`mp4PathFor` y `APP_NAME` no existen).

- [ ] **Paso 3: Implementar los perfiles y el aviso**

Sustituir el contenido de `video/engine/scripts/lib/profiles.mjs` por:

```js
// Per-video formats (video.json "profile") and per-track disclaimers (video.json "track").
// See docs/superpowers/plans/2026-09-25-lesson-videos.md §1 and
// docs/superpowers/specs/2026-09-26-video-narration-style-design.md §3.

/** The app's public name (2026-09-26). Videos rendered for YouTube carry it. */
export const APP_NAME = 'Alertópolis';
/** The name the videos published before the rename carry in their MP4s, transcripts and posters. */
export const LEGACY_APP_NAME = 'IntelForge Academy';

export const PROFILES = Object.freeze({
  /** Explainer: 5 chapters, 10–12 scenes, ~5 min. Rendered into the app (public/videos). */
  principal: Object.freeze({
    minTotalSec: 280,
    maxTotalSec: 340,
    maxChapters: 5,
    examCards: [8, 11],
    thinkPrompts: 2,
    intercepts: [0, 0],
    chispa: false,
    host: 'repo',
    crf: 23,
    size: Object.freeze({ targetMin: 15, targetMax: 25, warn: 30, fail: 45 }), // MB (10^6 bytes)
  }),
  /** Practical capsule: 3 chapters, 5–6 scenes, ~3 min, at least half demo. */
  capsula: Object.freeze({
    minTotalSec: 140,
    maxTotalSec: 200,
    maxChapters: 3,
    examCards: [4, 6],
    thinkPrompts: 1,
    intercepts: [0, 0],
    chispa: false,
    host: 'repo',
    crf: 27,
    size: Object.freeze({ targetMin: 4, targetMax: 12, warn: 15, fail: 25 }),
  }),
  /** Lively explainer for YouTube: ~6–8 min, intercepted messages, no size target (YouTube re-encodes). */
  'principal-yt': Object.freeze({
    minTotalSec: 380,
    maxTotalSec: 500,
    maxChapters: 5,
    examCards: [8, 11],
    thinkPrompts: 2,
    intercepts: [2, 4],
    chispa: true,
    host: 'youtube',
    crf: 18,
    size: null,
  }),
  /** Lively capsule for YouTube: ~3–4 min. */
  'capsula-yt': Object.freeze({
    minTotalSec: 190,
    maxTotalSec: 260,
    maxChapters: 3,
    examCards: [4, 6],
    thinkPrompts: 1,
    intercepts: [1, 2],
    chispa: true,
    host: 'youtube',
    crf: 18,
    size: null,
  }),
});

const AFFILIATION = Object.freeze({ secplus: 'CompTIA', gcti: 'SANS/GIAC' });

export function profileFor(name) {
  const profile = PROFILES[name];
  if (!profile) throw new Error(`unknown video profile "${name}" (known: ${Object.keys(PROFILES).join(', ')})`);
  return profile;
}

/** Disclaimer line of a video: its track's affiliation, under the name its host shows. */
export function trackNotice(track, profile = 'principal') {
  const affiliation = AFFILIATION[track];
  if (!affiliation) throw new Error(`unknown track "${track}" (known: ${Object.keys(AFFILIATION).join(', ')})`);
  const brand = profileFor(profile).host === 'youtube' ? APP_NAME : LEGACY_APP_NAME;
  return `Simulación educativa con datos ficticios · ${brand} — material independiente, no afiliado a ${affiliation}`;
}
```

- [ ] **Paso 4: Implementar la ruta del MP4**

En `video/engine/scripts/lib/paths.mjs`:
- añadir `import { profileFor } from './profiles.mjs';` después de los imports de `node:`;
- añadir, antes de `videoPaths`:

```js
/** Where the rendered MP4 goes: the app's public/videos (committed) or, for YouTube, the video's out/ (ignored). */
export function mp4PathFor(manifest, dir, publicVideos) {
  return profileFor(manifest.profile).host === 'youtube'
    ? path.join(dir, 'out', `${manifest.output}.mp4`)
    : path.join(publicVideos, `${manifest.output}.mp4`);
}
```

- y en `videoPaths` cambiar `video: path.join(publicVideos, \`${manifest.output}.mp4\`),` por
  `video: mp4PathFor(manifest, dir, publicVideos),`.

- [ ] **Paso 5: El aviso por perfil en `build-timeline` y el tamaño en `render`**

En `video/engine/scripts/build-timeline.mjs`:
- la línea 44 pasa a ser `export const TRANSCRIPT_NOTICE = trackNotice(MANIFEST.track, MANIFEST.profile);`;
- en la línea 341, `notice: trackNotice(opts.track)` pasa a `notice: trackNotice(opts.track, opts.profile)`.

En `video/engine/scripts/render.mjs`, sustituir el bloque `if (!draft) { … }` de las comprobaciones de tamaño
por:

```js
  if (!draft) {
    if (!SIZE) console.log(`  size not checked: the "${MANIFEST.profile}" profile is uploaded to YouTube, which re-encodes it`);
    else if (mb > SIZE.fail) errors.push(`file is ${mb.toFixed(1)} MB (limit ${SIZE.fail} MB)`);
    else if (mb > SIZE.warn) warnings.push(`file is ${mb.toFixed(1)} MB (warn above ${SIZE.warn} MB)`);
    else if (mb < SIZE.targetMin || mb > SIZE.targetMax) warnings.push(`file is ${mb.toFixed(1)} MB (target ${SIZE.targetMin}–${SIZE.targetMax} MB)`);
    else console.log(`  size within the ${SIZE.targetMin}–${SIZE.targetMax} MB target`);
  }
```

- [ ] **Paso 5b: El MP4 de YouTube no puede acabar en git**

Hoy `out/` solo se ignora porque cada vídeo trae su propio `.gitignore`. Una carpeta de vídeo nueva sin él
colaría en el repo público un MP4 de más de 100 MB en crf 18.

1. En el `.gitignore` raíz, al final:

```gitignore

# Lesson video engine: drafts, QA stills, YouTube renders and voice auditions never reach the repo
video/*/out/
video/*/.audition/
```

2. En `render.mjs`:
   - importar `import { spawnSync } from 'node:child_process';`;
   - añadir `REPO_ROOT` a la importación de `./lib/paths.mjs`;
   - justo después de `const out = draft ? PATHS.draft : PATHS.video;`, añadir:

```js
  // A YouTube render is 100+ MB at crf 18 and must never reach the public repo.
  if (!draft && PROFILE.host === 'youtube' && spawnSync('git', ['check-ignore', '-q', out], { cwd: REPO_ROOT }).status !== 0) {
    throw new Error(`${out} is not git-ignored: a YouTube render must stay out of the repo (see the root .gitignore)`);
  }
```

- [ ] **Paso 6: Pruebas, regresión y commit**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && node --test "video/engine/scripts/lib/*.test.mjs" && git check-ignore -q video/cualquier-video-nuevo/out/x.mp4 && echo "out/ ignorado"
```
Resultado esperado: todo en verde, incluido `profiles.test.mjs`, y `out/ ignorado`. Después, la regresión de la
Tarea 1, paso 3: sin diff.

```bash
git add .gitignore video/engine/scripts/lib/profiles.mjs video/engine/scripts/lib/profiles.test.mjs video/engine/scripts/lib/paths.mjs video/engine/scripts/render.mjs video/engine/scripts/build-timeline.mjs && git commit -m "feat(video): add YouTube profiles with longer windows and the Alertopolis notice" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Avisos de estilo «con chispa»

**Archivos:**
- Modificar: `video/engine/scripts/lib/narration.mjs` (`analyzeNarration`)
- Crear: `video/engine/scripts/lib/chispa.test.mjs`

**Interfaces:**
- Consume: `profile.chispa` (Tarea 2). `analyzeNarration(sources, options)` ya recibe el perfil como `options`.
- Produce: la firma de las opciones pasa a ser
  `{ examCards = [8, 11], thinkPrompts = 2, intercepts = null, chispa = false }`. La Tarea 4 usa `intercepts`.

- [ ] **Paso 1: Escribir la prueba que falla**

`video/engine/scripts/lib/chispa.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeNarration } from './narration.mjs';

const storyboard = {
  chapters: [{ n: 1, title: 'Uno' }],
  scenes: [
    { id: 's01-a', chapter: 1, requiredCues: [] },
    { id: 's02-b', chapter: 1, requiredCues: [] },
  ],
};
const voice = 'es-ES-ElviraNeural';
const run = (segments, opts) => analyzeNarration({ storyboard, narration: { voice, segments }, lexicon: {} }, opts);
const segments = [
  { id: 's01-01', scene: 's01-a', text: '<curious> ¿Cómo llegan los logs al SIEM? Depende de quién hable en cada caso.' },
  { id: 's01-02', scene: 's01-a', text: '<curious> Los servidores llevan un agente; los firewalls hablan syslog con el colector.' },
  { id: 's02-01', scene: 's02-b', text: 'La nube contesta por API y los routers exportan NetFlow sin contenido.' },
  { id: 's02-02', scene: 's02-b', text: 'Todo converge en un punto central con la hora sincronizada por NTP.' },
];

test('chispa checks: repeated emotion, semicolon, scene without a question', () => {
  const { errors, warnings } = run(segments, { chispa: true });
  assert.deepEqual(errors, []);
  assert.ok(warnings.some((w) => /s01-02: same emotion <curious> as the previous segment/.test(w)), warnings.join('\n'));
  assert.ok(warnings.some((w) => /s01-02: ";" in the narration/.test(w)));
  assert.ok(warnings.some((w) => /scene s02-b: no question/.test(w)));
  assert.ok(!warnings.some((w) => /scene s01-a: no question/.test(w)));
});

test('the legacy profiles do not run the chispa checks', () => {
  const { warnings } = run(segments, {});
  assert.ok(!warnings.some((w) => /same emotion|";" in the narration|no question/.test(w)), warnings.join('\n'));
});
```

- [ ] **Paso 2: Ejecutarla y verla fallar**

Ejecutar: `eval "$(fnm env)" && node --test video/engine/scripts/lib/chispa.test.mjs`
Resultado esperado: FAIL en la primera prueba (no existe ningún aviso de chispa).

- [ ] **Paso 3: Implementar**

En `video/engine/scripts/lib/narration.mjs`:

1. Firma (línea 108):

```js
export function analyzeNarration({ storyboard, narration, lexicon }, { examCards = [8, 11], thinkPrompts = 2, intercepts = null, chispa = false } = {}) {
```

2. Justo antes de `narration.segments.forEach((raw, k) => {`, añadir `let prevMood = null;`.

3. Dentro del bucle, después del bloque `// Style (warnings only)` (tras el `for` de las frases), añadir:

```js
    if (chispa) {
      if (parsed.spoken.includes(';')) warnings.push(`${label}: ";" in the narration — split it into two sentences (chispa style)`);
      const mood = parsed.directions[0] ?? null;
      if (mood && mood === prevMood) warnings.push(`${label}: same emotion <${mood}> as the previous segment (chispa style: vary it)`);
      prevMood = mood;
    }
```

4. En el bucle de escenas, justo antes de `const exams = segs.filter((s) => s.exam);`, añadir:

```js
    if (chispa && !segs.some((s) => s.parsed.display.includes('?'))) warnings.push(`scene ${scene.id}: no question (chispa style: at least one per scene)`);
```

- [ ] **Paso 4: Pruebas, regresión y commit**

Ejecutar: `eval "$(fnm env)" && node --test "video/engine/scripts/lib/*.test.mjs"`. Resultado esperado: todo en
verde. Después, la regresión (Tarea 1, paso 3): sin diff.

```bash
git add video/engine/scripts/lib/narration.mjs video/engine/scripts/lib/chispa.test.mjs && git commit -m "feat(video): warn about dense narration on the YouTube profiles" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Mensaje interceptado, validación

**Archivos:**
- Modificar: `video/engine/scripts/lib/narration.mjs`
- Modificar: `video/engine/scripts/lib/paths.mjs` (`checkManifest` con `adversary` opcional)
- Crear: `video/engine/scripts/lib/intercept.test.mjs`

**Interfaces:**
- Consume: `intercepts` de las opciones (Tarea 3).
- Produce:
  - cada segmento analizado lleva `intercept: { text, holdMs } | null`;
  - las constantes `INTERCEPT_TEXT_MAX = 70` e `INTERCEPT_HOLD_MS = [2500, 4500]`;
  - `checkManifest(manifest, file, slug)`, exportado desde `paths.mjs`;
  - `OPTIONAL_MANIFEST_KEYS`, con `adversary` (la Tarea 9 añade `lesson`).

- [ ] **Paso 1: Escribir la prueba que falla**

`video/engine/scripts/lib/intercept.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { INTERCEPT_TEXT_MAX, analyzeNarration } from './narration.mjs';
import { checkManifest } from './paths.mjs';

const storyboard = {
  chapters: [{ n: 1, title: 'Uno' }, { n: 2, title: 'Dos' }],
  scenes: [
    { id: 's01-a', chapter: 1, requiredCues: [] },
    { id: 's02-b', chapter: 1, requiredCues: [] },
    { id: 's03-c', chapter: 2, requiredCues: [] },
  ],
};
const say = 'Una frase de prueba con suficientes palabras para cumplir el estilo.';
const seg = (id, scene, extra = {}) => ({ id, scene, text: say, ...extra });
const msg = { text: 'Borro el log del servidor y aquí no ha pasado nada.', holdMs: 3000 };
const run = (segments, opts = {}) => analyzeNarration({ storyboard, narration: { voice: 'es-ES-ElviraNeural', segments }, lexicon: {} }, opts);

test('a valid intercepted message is parsed onto its segment', () => {
  const { errors, segments } = run([seg('s01-01', 's01-a', { intercept: msg }), seg('s02-01', 's02-b'), seg('s03-01', 's03-c')]);
  assert.deepEqual(errors, []);
  assert.deepEqual(segments[0].intercept, msg);
  assert.equal(segments[1].intercept, null);
});

test('intercept limits: text, hold, one per chapter, not in the closing scene, not with a think prompt', () => {
  const long = 'x'.repeat(INTERCEPT_TEXT_MAX + 1);
  const { errors } = run([
    seg('s01-01', 's01-a', { intercept: { text: long, holdMs: 2000 } }),
    seg('s02-01', 's02-b', { intercept: msg, think: { q: '¿Y ahora qué?', holdMs: 2000 } }),
    seg('s03-01', 's03-c', { intercept: msg }),
  ]);
  const has = (re) => assert.ok(errors.some((e) => re.test(e)), `${re}\n${errors.join('\n')}`);
  has(/s01-01: intercept\.text is 71 characters \(max 70\)/);
  has(/s01-01: intercept\.holdMs must be between 2500 and 4500/);
  has(/s02-01: a segment cannot carry both a think prompt and an intercepted message/);
  has(/chapter 1: 2 intercepted messages \(max 1 per chapter\)/);
  has(/s03-01: the closing scene must not carry an intercepted message/);
});

test('intercept count is checked against the profile window', () => {
  const { warnings } = run([seg('s01-01', 's01-a', { intercept: msg }), seg('s02-01', 's02-b'), seg('s03-01', 's03-c')], { intercepts: [2, 4] });
  assert.ok(warnings.some((w) => /1 intercepted messages \(style guide: 2–4\)/.test(w)), warnings.join('\n'));
});

test('checkManifest: adversary is optional but must look like a campaign name', () => {
  const base = { slug: 'x', output: 'x', composition: 'X', poster: 'XPoster', profile: 'principal-yt', track: 'secplus' };
  assert.doesNotThrow(() => checkManifest(base, 'video.json', 'x'));
  assert.doesNotThrow(() => checkManifest({ ...base, adversary: 'SILENT PAGER' }, 'video.json', 'x'));
  assert.throws(() => checkManifest({ ...base, adversary: 'silent pager' }, 'video.json', 'x'), /"adversary"/);
  assert.throws(() => checkManifest({ ...base, output: '' }, 'video.json', 'x'), /"output"/);
  assert.throws(() => checkManifest(base, 'video.json', 'y'), /does not match its folder/);
});
```

- [ ] **Paso 2: Ejecutarla y verla fallar**

Ejecutar: `eval "$(fnm env)" && node --test video/engine/scripts/lib/intercept.test.mjs`
Resultado esperado: FAIL (`INTERCEPT_TEXT_MAX` y `checkManifest` no existen).

- [ ] **Paso 3: Implementar la validación en `narration.mjs`**

1. Después de `export const THINK_Q_MAX = 48;`:

```js
/** Intercepted messages: on-screen only (never voiced), typed out during a silent lead before their segment. */
export const INTERCEPT_TEXT_MAX = 70;
export const INTERCEPT_HOLD_MS = [2500, 4500];
```

2. Dentro del bucle de segmentos, justo después del bloque `let think = null; if (raw.think !== undefined) { … }`:

```js
    let intercept = null;
    if (raw.intercept !== undefined) {
      const x = raw.intercept;
      if (!isObj(x)) errors.push(`${label}: intercept must be an object`);
      else {
        if (typeof x.text !== 'string' || !x.text.trim()) errors.push(`${label}: intercept.text must be a non-empty string`);
        else {
          if (x.text.length > INTERCEPT_TEXT_MAX) errors.push(`${label}: intercept.text is ${x.text.length} characters (max ${INTERCEPT_TEXT_MAX})`);
          if (FORBIDDEN_SYMBOLS.test(x.text) || /[{}[\]|<>]/.test(x.text)) errors.push(`${label}: intercept.text contains a forbidden symbol`);
        }
        const [lo, hi] = INTERCEPT_HOLD_MS;
        if (typeof x.holdMs !== 'number' || x.holdMs < lo || x.holdMs > hi) errors.push(`${label}: intercept.holdMs must be between ${lo} and ${hi}`);
        if (raw.think !== undefined) errors.push(`${label}: a segment cannot carry both a think prompt and an intercepted message`);
        intercept = { text: x.text, holdMs: x.holdMs };
      }
    }
```

3. En `segments.push({ … })`, añadir `intercept` después de `think`:

```js
    segments.push({ id: raw.id, scene: raw.scene, sceneIndex: si, text: raw.text, parsed, pauseMs, exam, think, intercept });
```

4. Antes del bucle de escenas (junto a `let examCount = 0;`), añadir `const interceptsByChapter = new Map();`. Dentro
   del bucle, después de `for (const s of segs) if (s.think) thinkScenes.push(scene.id);`:

```js
    for (const s of segs.filter((x) => x.intercept)) {
      if (scene.id === lastScene) errors.push(`${s.id}: the closing scene must not carry an intercepted message`);
      interceptsByChapter.set(scene.chapter, (interceptsByChapter.get(scene.chapter) ?? 0) + 1);
    }
```

5. Después del aviso de tarjetas de examen (`if (examCount && …)`):

```js
  for (const [chapter, n] of interceptsByChapter) if (n > 1) errors.push(`chapter ${chapter}: ${n} intercepted messages (max 1 per chapter)`);
  const interceptCount = [...interceptsByChapter.values()].reduce((a, b) => a + b, 0);
  if (intercepts && (interceptCount < intercepts[0] || interceptCount > intercepts[1])) {
    warnings.push(`${interceptCount} intercepted messages (style guide: ${intercepts[0]}–${intercepts[1]})`);
  }
```

- [ ] **Paso 4: Implementar `checkManifest` en `paths.mjs`**

Sustituir `readManifest` por:

```js
/** Optional video.json keys and the shape their value must have. */
export const OPTIONAL_MANIFEST_KEYS = Object.freeze({
  /** Section adversary whose intercepted messages the video shows (e.g. "SILENT PAGER"). */
  adversary: /^[A-Z][A-Z ]{1,30}[A-Z]$/,
});

/** Checks a parsed video.json; throws on the first problem. */
export function checkManifest(manifest, file, slug) {
  for (const key of MANIFEST_KEYS) {
    if (typeof manifest[key] !== 'string' || !manifest[key]) throw new Error(`${file}: "${key}" must be a non-empty string`);
  }
  for (const [key, pattern] of Object.entries(OPTIONAL_MANIFEST_KEYS)) {
    if (manifest[key] !== undefined && (typeof manifest[key] !== 'string' || !pattern.test(manifest[key]))) {
      throw new Error(`${file}: "${key}" must match ${pattern}`);
    }
  }
  if (manifest.slug !== slug) throw new Error(`${file}: slug "${manifest.slug}" does not match its folder "${slug}"`);
  return manifest;
}

/** Reads and checks video/<slug>/video.json. */
export function readManifest(slug) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error(`invalid video slug ${JSON.stringify(slug)}`);
  const file = path.join(VIDEOS_DIR, slug, 'video.json');
  if (!existsSync(file)) throw new Error(`no video.json for "${slug}" (expected ${file})`);
  return checkManifest(JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, '')), file, slug);
}
```

(La versión actual quita el BOM con un carácter literal; `﻿` es lo mismo y se ve.)

- [ ] **Paso 5: Pruebas, regresión y commit**

Ejecutar: `eval "$(fnm env)" && node --test "video/engine/scripts/lib/*.test.mjs"`. Todo en verde; la regresión, sin
diff.

```bash
git add video/engine/scripts/lib/narration.mjs video/engine/scripts/lib/paths.mjs video/engine/scripts/lib/intercept.test.mjs && git commit -m "feat(video): validate intercepted adversary messages in the narration" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Mensaje interceptado, timeline, transcripción y tipos

**Archivos:**
- Modificar: `video/engine/scripts/build-timeline.mjs`
- Modificar: `video/engine/scripts/lib/validate-timeline.mjs`
- Modificar: `video/engine/src/timeline/types.ts`
- Modificar: `video/engine/scripts/lib/build-timeline.test.mjs`

**Interfaces:**
- Consume: `seg.intercept` (Tarea 4) y `MANIFEST.adversary`.
- Produce:
  - la entrada `InterceptCue { scene, from, durationInFrames, adversary, text }`;
  - `Timeline.intercept?: InterceptCue[]`, presente solo si hay alguno;
  - `buildTimeline({ adversary })`.
  - El segmento que responde empieza (`from`) **después** del silencio. La tarjeta dura desde el inicio del
    silencio hasta el final de la pausa de ese segmento.

- [ ] **Paso 1: Escribir las pruebas que fallan**

En `video/engine/scripts/lib/build-timeline.test.mjs`:

1. `buildVariant` acepta opciones extra:

```js
async function buildVariant(mutate, name, extra = {}) {
  const narration = read('narration.mini.json');
  mutate(narration);
  const file = path.join(tmp, `${name}.json`);
  writeFileSync(file, JSON.stringify(narration));
  return buildTimeline({
    estimate: true,
    storyboard: path.join(FIX, 'storyboard.mini.json'),
    narration: file,
    lexicon: path.join(FIX, 'lexicon.mini.json'),
    write: false,
    log: quiet,
    ...extra,
  });
}
```

2. En la primera prueba (`estimate mode: …`), justo después de `assert.deepEqual(validateTimeline(timeline), []);`:

```js
  assert.equal('intercept' in timeline, false, 'no intercept key without intercepted messages');
```

3. Pruebas nuevas al final del archivo:

```js
const MSG = 'Borro el log del servidor y aquí no ha pasado nada.';

test('intercepted message: silent lead, card until the answer ends, transcript line', async () => {
  const { timeline, transcript } = await buildVariant(
    (n) => {
      n.segments[2].intercept = { text: MSG, holdMs: 3000 };
    },
    'intercept',
    { adversary: 'SILENT PAGER' },
  );
  assert.deepEqual(validateTimeline(timeline), []);
  const seg = timeline.segments.find((s) => s.id === 's02-01');
  const scene = timeline.scenes.find((s) => s.id === 's02-collect');
  assert.deepEqual(timeline.intercept, [
    { scene: 's02-collect', from: scene.from + TIMING.lead, durationInFrames: 90 + seg.durationInFrames, adversary: 'SILENT PAGER', text: MSG },
  ]);
  assert.equal(seg.from, scene.from + TIMING.lead + 90, 'the answer starts after 3000 ms of silence');
  assert.ok(transcript.includes(`[Mensaje interceptado · SILENT PAGER] «${MSG}» ${seg.text}`), transcript);
});

test('intercepted messages need an adversary in video.json', async () => {
  await assert.rejects(
    buildVariant((n) => {
      n.segments[2].intercept = { text: MSG, holdMs: 3000 };
    }, 'no-adversary', { adversary: null }),
    /no "adversary"/,
  );
});
```

`segments[2]` es `s02-01`, el primer segmento de `s02-collect`. No tiene pausa para pensar, así que
`durationInFrames` = audio + pausa.

- [ ] **Paso 2: Ejecutarlas y verlas fallar**

Ejecutar: `eval "$(fnm env)" && node --test video/engine/scripts/lib/build-timeline.test.mjs`
Resultado esperado: FAIL en las dos pruebas nuevas (no hay `timeline.intercept`).

- [ ] **Paso 3: Implementar en `build-timeline.mjs`**

1. En `opts` de `buildTimeline`, después de `track: MANIFEST.track,`, añadir
   `adversary: MANIFEST.adversary ?? null,`.
2. Junto a `const think = [];`, añadir `const intercept = [];`.
3. En el bucle `for (const seg of segs) {`, sustituir las dos primeras líneas (`const a = …; const from = t;`) por:

```js
      // An intercepted message types out during a silent lead; the segment's audio (the answer) starts after it.
      const leadFrom = t;
      if (seg.intercept) t += toFrames(seg.intercept.holdMs);
      const a = audio.get(seg.id);
      const from = t;
```

4. Justo después del bloque `if (seg.think) { think.push(…); }`:

```js
      if (seg.intercept) {
        intercept.push({
          scene: scene.id,
          from: leadFrom,
          durationInFrames: from + audioFrames + pause - leadFrom,
          adversary: opts.adversary,
          text: seg.intercept.text,
        });
      }
```

5. Después del bloque `if (totalSec < profile.minTotalSec || …)`, añadir:

```js
  if (intercept.length && !opts.adversary) errors.push('the narration has intercepted messages but video.json has no "adversary"');
```

6. En el objeto `timeline`, después de `think,`, añadir `...(intercept.length ? { intercept } : {}),`.

7. En `buildTranscript`, sustituir el cálculo de `text` por:

```js
    const pieces = [];
    for (const seg of timeline.segments.filter((x) => x.scene === s.id)) {
      for (const i of (timeline.intercept ?? []).filter((x) => x.scene === s.id && x.from <= seg.from && seg.from < x.from + x.durationInFrames)) {
        pieces.push(`[Mensaje interceptado · ${i.adversary}] «${i.text}»`);
      }
      pieces.push(seg.text);
    }
    const text = pieces.join(' ');
```

- [ ] **Paso 4: Implementar en `validate-timeline.mjs`**

1. En `SHAPES`, añadir `InterceptCue: ['scene', 'from', 'durationInFrames', 'adversary', 'text'],`, y debajo:

```js
/** Keys a shape may carry in addition to SHAPES (only written when non-empty). */
const OPTIONAL = { Timeline: ['intercept'] };
```

2. En `keys()`, sustituir la línea de `extra` por:

```js
    const extra = have.filter((k) => !want.includes(k) && !(OPTIONAL[shape] ?? []).includes(k));
```

3. Antes de `return errors;` (al final):

```js
  if (t.intercept !== undefined) {
    if (!Array.isArray(t.intercept) || !t.intercept.length) errors.push('timeline.intercept: when present, a non-empty array');
    else {
      t.intercept.forEach((x, k) => {
        const where = `intercept[${k}]`;
        if (!keys(x, 'InterceptCue', where)) return;
        if (!sceneOf.has(x.scene)) errors.push(`${where}.scene: not in scenes`);
        int(x.from, `${where}.from`);
        int(x.durationInFrames, `${where}.durationInFrames`, 1);
        str(x.adversary, `${where}.adversary`);
        str(x.text, `${where}.text`);
        const sc = sceneOf.get(x.scene);
        if (sc && (x.from < sc.from || x.from + x.durationInFrames > sc.from + sc.durationInFrames)) errors.push(`${where}: outside its scene`);
      });
    }
  }
```

- [ ] **Paso 5: Tipos**

En `video/engine/src/timeline/types.ts`, después de `interface ThinkPrompt { … }`:

```ts
/** A message from the section's adversary: shown on screen (never voiced) before the narrator answers it. */
export interface InterceptCue {
  scene: SceneId;
  /** First frame of the silent lead before the answering segment's audio. */
  from: number;
  /** Until the answering segment's pause ends. */
  durationInFrames: number;
  /** The section adversary from video.json, e.g. "SILENT PAGER". */
  adversary: string;
  text: string;
}
```

y en `interface Timeline`, después de `think: ThinkPrompt[];`:

```ts
  /** Present only when the video has intercepted messages. */
  intercept?: InterceptCue[];
```

- [ ] **Paso 6: Pruebas, tipos, regresión y commit**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && node --test "video/engine/scripts/lib/*.test.mjs" && npx tsc --noEmit -p video/engine/tsconfig.json
```
Resultado esperado: verde y sin errores de tipos. La regresión, sin diff: el SIEM y el forense no tienen mensajes
y no deben ganar la clave.

```bash
git add video/engine/scripts/build-timeline.mjs video/engine/scripts/lib/validate-timeline.mjs video/engine/src/timeline/types.ts video/engine/scripts/lib/build-timeline.test.mjs && git commit -m "feat(video): time intercepted messages as a silent lead before their answer" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Mensaje interceptado, overlay, galería y fotogramas de QA

**Archivos:**
- Crear: `video/engine/src/overlay/InterceptLayer.tsx`
- Modificar: `video/engine/src/LessonVideo.tsx` (montar la capa)
- Modificar: `video/engine/src/dev/OverlayGallery.tsx` (muestra)
- Modificar: `video/engine/scripts/qa-frames.mjs` (`pickFrames`)
- Crear: `video/engine/scripts/lib/qa-frames.test.mjs`

**Interfaces:**
- Consume: `Timeline.intercept?` e `InterceptCue` (Tarea 5).
- Produce: `InterceptCard`, `InterceptView({ entries, frame })`, `InterceptLayer()`,
  `interceptState(entry, frame)`.
- Ubicación: el mismo hueco que la pausa para pensar (arriba y al centro del escenario). Nunca coinciden en el
  tiempo, porque la Tarea 4 prohíbe los dos en un segmento y el silencio va antes del audio. Color `rose`, que
  en `tokens.ts` es el del atacante.

- [ ] **Paso 1: Escribir la prueba de `pickFrames` que falla**

`video/engine/scripts/lib/qa-frames.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { pickFrames } from '../qa-frames.mjs';

test('pickFrames: an intercepted message gets a typing still and a finished one', () => {
  const timeline = {
    durationInFrames: 600,
    scenes: [{ id: 's01-a', from: 0, durationInFrames: 600 }],
    cues: [],
    exam: [],
    think: [],
    intercept: [{ scene: 's01-a', from: 100, durationInFrames: 200, adversary: 'SILENT PAGER', text: 'x' }],
  };
  const labels = pickFrames(timeline).flatMap((p) => p.labels);
  assert.ok(labels.includes('s01-a/intercept-typing'));
  assert.ok(labels.includes('s01-a/intercept'));
  assert.deepEqual(pickFrames({ ...timeline, intercept: undefined }).flatMap((p) => p.labels).filter((l) => l.includes('intercept')), []);
});
```

- [ ] **Paso 2: Ejecutarla y verla fallar**

Ejecutar: `eval "$(fnm env)" && node --test video/engine/scripts/lib/qa-frames.test.mjs`. Resultado esperado: FAIL.

- [ ] **Paso 3: `pickFrames`**

En `video/engine/scripts/qa-frames.mjs`, dentro de `for (const s of scenes) {`, después de la línea de `think`:

```js
    for (const i of (timeline.intercept ?? []).filter((x) => x.scene === s.id)) {
      add(i.from + 30, s.id, 'intercept-typing');
      add(i.from + i.durationInFrames - 20, s.id, 'intercept');
    }
```

Ejecutar la prueba: PASS.

- [ ] **Paso 4: El overlay**

`video/engine/src/overlay/InterceptLayer.tsx`:

```tsx
import { useCurrentFrame } from 'remotion';
import { useTimeline } from '../timeline/context';
import type { InterceptCue } from '../timeline/types';
import { EASE, progress } from '../theme/motion';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../theme/tokens';
import { Icon } from '../ui/Icon';
import { twoLines, useFontsReady } from './Captions';

const ENTER = 12;
const EXIT = 10;
/** Frames per typed character: 70 characters type out in ~2.3 s, inside the shortest (2.5 s) lead. */
const TYPE_RATE = 1;
/** Same slot as the think prompt (they never overlap in time). */
const TOP = LAYOUT.stage.top + 10;
const MAX_WIDTH = 1400;
const PAD_X = 34;
const BODY = { size: 42, weight: 700, letterSpacing: -0.2 } as const;
const BODY_MAX = MAX_WIDTH - 2 * PAD_X - 4;
const CARD_BG = alpha(C.roseDeep, 0.92);

/** Where one message is in its life at `frame`: null when off screen. */
export function interceptState(entry: InterceptCue, frame: number) {
  const end = entry.from + entry.durationInFrames;
  if (frame < entry.from || frame >= end) return null;
  const pin = progress(frame, entry.from, ENTER, EASE.out);
  const pout = progress(frame, end - EXIT, EXIT, EASE.inOut);
  const typed = Math.min(entry.text.length, Math.max(0, Math.floor((frame - entry.from - ENTER / 2) / TYPE_RATE)));
  return { opacity: Math.min(pin, 1 - pout), dy: (1 - pin) * -18 + pout * -10, typed };
}

/** The card: "MENSAJE INTERCEPTADO · <adversary>" and the message typing out in «». */
export function InterceptCard({
  adversary,
  text,
  typed = text.length,
  opacity = 1,
  dy = 0,
}: {
  adversary: string;
  text: string;
  typed?: number;
  opacity?: number;
  dy?: number;
}) {
  const fontsReady = useFontsReady();
  // Lay out the whole message once, so the card keeps its size while it types.
  const body = twoLines(`«${text}»`, BODY, fontsReady, BODY_MAX);
  const typing = typed < text.length;
  let left = typed + 1; // + the opening «
  const shown = body.lines.map((line) => {
    const part = line.slice(0, Math.max(0, left));
    left -= line.length + 1; // + the space the line break replaced
    return part;
  });
  const lines = typing ? shown : body.lines;
  const active = typing ? lines.findIndex((l, k) => l.length < body.lines[k].length) : -1;
  return (
    <div
      style={{
        position: 'absolute',
        top: TOP,
        left: LAYOUT.width / 2,
        maxWidth: MAX_WIDTH,
        width: 'max-content',
        boxSizing: 'border-box',
        transform: `translate(-50%, ${dy}px)`,
        opacity,
        padding: `20px ${PAD_X}px 24px`,
        borderRadius: RADIUS.lg,
        background: CARD_BG,
        border: `2px solid ${alpha(C.rose, 0.85)}`,
        boxShadow: `0 0 40px ${alpha(C.rose, 0.22)}, 0 26px 60px ${alpha('#000000', 0.5)}`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="terminal" size={24} color={C.rose} strokeWidth={2.5} />
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: TYPE.micro,
            fontWeight: 800,
            letterSpacing: 3,
            lineHeight: 1,
            color: C.roseSoft,
            whiteSpace: 'nowrap',
          }}
        >
          {`MENSAJE INTERCEPTADO · ${adversary}`}
        </span>
      </div>
      <div
        style={{
          marginTop: 12,
          width: body.width,
          fontSize: BODY.size,
          fontWeight: BODY.weight,
          lineHeight: 1.22,
          letterSpacing: BODY.letterSpacing,
          color: C.textStrong,
        }}
      >
        {body.lines.map((full, k) => (
          <div key={full} style={{ whiteSpace: 'nowrap', minHeight: '1.22em' }}>
            {lines[k]}
            {k === active ? (
              <span style={{ display: 'inline-block', width: '0.5em', height: '0.95em', marginLeft: 4, verticalAlign: '-0.1em', background: C.rose }} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Pure view: the active message (if any) at `frame`. */
export function InterceptView({ entries, frame }: { entries: InterceptCue[]; frame: number }) {
  const entry = entries.find((e) => frame >= e.from && frame < e.from + e.durationInFrames);
  if (!entry) return null;
  const state = interceptState(entry, frame);
  if (!state) return null;
  return <InterceptCard adversary={entry.adversary} text={entry.text} typed={state.typed} opacity={state.opacity} dy={state.dy} />;
}

/** Timeline-driven layer mounted by LessonVideo (absolute frame). */
export function InterceptLayer() {
  const frame = useCurrentFrame();
  const timeline = useTimeline();
  return <InterceptView entries={timeline.intercept ?? []} frame={frame} />;
}
```

- [ ] **Paso 5: Montarlo y añadirlo a la galería**

En `video/engine/src/LessonVideo.tsx`:
- importar `import { InterceptLayer } from './overlay/InterceptLayer';`;
- añadir `<InterceptLayer />` justo después de `<ThinkPrompt />`.

En `video/engine/src/dev/OverlayGallery.tsx`:
- importar `InterceptView` desde `'../overlay/InterceptLayer'`;
- añadir `InterceptCue` a la importación de tipos;
- añadir, después de `THINK`:

```tsx
const INTERCEPT: InterceptCue[] = [
  { scene: 's01-hook', from: 20, durationInFrames: 90, adversary: 'SILENT PAGER', text: 'Borro el log del servidor y aquí no ha pasado nada.' },
];
```

- montar `<InterceptView entries={INTERCEPT} frame={frame} />` justo después de `<ThinkPromptView … />`;
- en el comentario de fotogramas de interés, añadir `40 intercepted message typing` y
  `100 intercepted message complete`. La tarjeta de examen entra en el fotograma 112, así que no se solapan.

- [ ] **Paso 6: Tipos y fotogramas de la galería**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && npx tsc --noEmit -p video/engine/tsconfig.json && node --test "video/engine/scripts/lib/*.test.mjs"
```

Renderizar los fotogramas 40 y 100 de la galería (con `dangerouslyDisableSandbox`):

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && mkdir -p video/siem/out/qa/gallery && for f in 40 100; do node node_modules/@remotion/cli/remotion-cli.js still video/siem/src/index.ts OverlayGallery "video/siem/out/qa/gallery/intercept-$f.png" --frame=$f --public-dir=video/siem/public --scale=0.5; done
```

Abrir los dos PNG con Read y comprobar:
- en el 40 hay texto a medio escribir, con el cursor rojo, y la tarjeta no toca los subtítulos ni la barra de
  capítulos;
- en el 100 el mensaje está completo entre «», sin desbordar la tarjeta.

Si el bundling se cuelga por la CPU, usar `remotion bundle` primero, como hace `render.mjs`.

- [ ] **Paso 7: Regresión y commit**

La regresión: sin diff.

```bash
git add video/engine/src/overlay/InterceptLayer.tsx video/engine/src/LessonVideo.tsx video/engine/src/dev/OverlayGallery.tsx video/engine/scripts/qa-frames.mjs video/engine/scripts/lib/qa-frames.test.mjs && git commit -m "feat(video): show intercepted adversary messages as a typing card" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Chatterbox con emoción por segmento

**Archivos:**
- Crear: `video/engine/scripts/lib/moods.mjs`
- Crear: `video/engine/scripts/lib/moods.test.mjs`
- Modificar: `video/engine/scripts/tts-chatterbox.mjs`
- Modificar: `video/engine/scripts/chatterbox_worker.py`
- Crear: `video/engine/scripts/test_chatterbox_worker.py`

**Interfaces:**
- Consume: `seg.parsed.directions` (`text.mjs`: la lista de direcciones `<…>` del segmento, en orden).
- Produce:
  - `REGISTERS`;
  - `moodFor(directions) -> { register, exaggeration, cfg_weight, unknown }`;
  - en `tts-chatterbox.mjs`, `segmentVoiceSettings(settings, directions)`, `DEFAULT_SETTINGS.moods = true`,
    `MOOD_AUDITION_TEXT` y `moodAudition({ voice, log })`;
  - en Python, `job_settings(spec, job) -> (exaggeration, cfg_weight)`.

- [ ] **Paso 1: Escribir las pruebas que fallan**

`video/engine/scripts/lib/moods.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SETTINGS, segmentVoiceSettings, settingsKey } from '../tts-chatterbox.mjs';
import { REGISTERS, moodFor } from './moods.mjs';

test('moodFor: the first direction decides, and within it the first known word', () => {
  assert.deepEqual(moodFor(['serious, warning', 'enthusiastic']), { register: 'sereno', ...REGISTERS.sereno, unknown: [] });
  assert.equal(moodFor(['mischievously']).register, 'vivo');
  assert.equal(moodFor(['clear, engaging']).register, 'neutro');
  assert.equal(moodFor(['tired']).register, 'sereno');
  assert.equal(moodFor(['warmly']).register, 'calido');
});

test('moodFor: no direction is neutral; an unknown one is neutral and reported', () => {
  assert.deepEqual(moodFor([]), { register: 'neutro', ...REGISTERS.neutro, unknown: [] });
  assert.deepEqual(moodFor(['whispering']), { register: 'neutro', ...REGISTERS.neutro, unknown: ['whispering'] });
});

test('the registers are the ones in the spec', () => {
  assert.deepEqual(REGISTERS, {
    sereno: { exaggeration: 0.4, cfg_weight: 0.5 },
    neutro: { exaggeration: 0.5, cfg_weight: 0.5 },
    calido: { exaggeration: 0.6, cfg_weight: 0.45 },
    vivo: { exaggeration: 0.75, cfg_weight: 0.35 },
  });
});

test('segmentVoiceSettings: moods on by default, off falls back to the video-wide settings', () => {
  assert.equal(DEFAULT_SETTINGS.moods, true);
  assert.equal(segmentVoiceSettings(DEFAULT_SETTINGS, ['urgent']).exaggeration, 0.75);
  const off = segmentVoiceSettings({ ...DEFAULT_SETTINGS, moods: false, exaggeration: 0.55, cfg_weight: 0.4 }, ['urgent']);
  assert.deepEqual(off, { register: null, exaggeration: 0.55, cfg_weight: 0.4, unknown: [] });
});

test('two registers give two cache keys', () => {
  const v = 'chatterbox/es-es/default';
  const key = (m) => settingsKey(v, { ...DEFAULT_SETTINGS, exaggeration: m.exaggeration, cfg_weight: m.cfg_weight });
  assert.notEqual(key(REGISTERS.sereno), key(REGISTERS.vivo));
});
```

`video/engine/scripts/test_chatterbox_worker.py`:

```python
"""job_settings(): per-job voice settings. Pure; runs with any Python 3.10+:

    python -m unittest discover -s video/engine/scripts -p "test_*.py"
"""
import unittest

from chatterbox_worker import job_settings


class JobSettingsTest(unittest.TestCase):
    SPEC = {"exaggeration": 0.5, "cfgWeight": 0.5}

    def test_job_values_win(self):
        self.assertEqual(job_settings(self.SPEC, {"exaggeration": 0.75, "cfgWeight": 0.35}), (0.75, 0.35))

    def test_falls_back_to_the_run_values(self):
        self.assertEqual(job_settings(self.SPEC, {"id": "s01-01"}), (0.5, 0.5))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Paso 2: Ejecutarlas y verlas fallar**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && node --test video/engine/scripts/lib/moods.test.mjs; python -m unittest discover -s video/engine/scripts -p "test_chatterbox_worker.py"
```
Resultado esperado: las dos fallan (`moods.mjs` y `job_settings` no existen).

- [ ] **Paso 3: `moods.mjs`**

```js
// Voice register per emotion direction, for a voice that takes no inline direction (Chatterbox).
// ElevenLabs reads the <direction> itself; Chatterbox has two dials (exaggeration, cfg_weight),
// so each direction maps to one of four registers.
// See docs/superpowers/specs/2026-09-26-video-narration-style-design.md §5.2.

export const REGISTERS = Object.freeze({
  sereno: Object.freeze({ exaggeration: 0.4, cfg_weight: 0.5 }),
  neutro: Object.freeze({ exaggeration: 0.5, cfg_weight: 0.5 }),
  calido: Object.freeze({ exaggeration: 0.6, cfg_weight: 0.45 }),
  vivo: Object.freeze({ exaggeration: 0.75, cfg_weight: 0.35 }),
});

const WORDS = {
  sereno: ['calm', 'serious', 'steady', 'grave', 'focused', 'firm', 'concerned', 'warning', 'ominous', 'tired', 'sighs'],
  neutro: ['clear', 'thoughtful'],
  calido: ['curious', 'intrigued', 'confident', 'warm', 'warmly', 'satisfied', 'relieved', 'reassuring', 'casual', 'engaging'],
  vivo: ['enthusiastic', 'cheerful', 'mischievously', 'sarcastic', 'urgent', 'suspicious', 'emphatic', 'tense'],
};
const REGISTER_OF = new Map(Object.entries(WORDS).flatMap(([register, words]) => words.map((w) => [w, register])));

/**
 * Register of one segment from its <directions>: the first direction decides, and within it
 * ("serious, warning") the first word the table knows. No direction reads as neutro; a direction
 * with no known word too, and it is reported in `unknown`.
 * @param {string[]} directions parsed.directions
 * @returns {{ register: string, exaggeration: number, cfg_weight: number, unknown: string[] }}
 */
export function moodFor(directions = []) {
  const first = directions[0];
  if (!first) return { register: 'neutro', ...REGISTERS.neutro, unknown: [] };
  const words = first.split(',').map((w) => w.trim().toLowerCase()).filter(Boolean);
  const known = words.find((w) => REGISTER_OF.has(w));
  if (!known) return { register: 'neutro', ...REGISTERS.neutro, unknown: words };
  const register = REGISTER_OF.get(known);
  return { register, ...REGISTERS[register], unknown: [] };
}
```

- [ ] **Paso 4: `tts-chatterbox.mjs`**

1. Importar `import { REGISTERS, moodFor } from './lib/moods.mjs';`.
2. En `DEFAULT_SETTINGS`, añadir `moods: true, // per-segment register from the <direction> (lib/moods.mjs); false = one exaggeration/cfg_weight for the whole video`.
3. Añadir, después de `settingsKey`:

```js
/** exaggeration + cfg_weight of one segment: its mood register, or the video-wide settings when moods are off. */
export function segmentVoiceSettings(settings, directions) {
  if (settings.moods === false) return { register: null, exaggeration: settings.exaggeration, cfg_weight: settings.cfg_weight, unknown: [] };
  return moodFor(directions);
}
```

4. En `synthesizeNarration`, sustituir `const sKey = settingsKey(voice, settings, voiceRef ? readFileSync(voiceRef) : null);`
   por:

```js
  const refBytes = voiceRef ? readFileSync(voiceRef) : null;
  const moodOf = new Map(analysis.segments.map((seg) => [seg.id, segmentVoiceSettings(settings, seg.parsed.directions)]));
  const segKey = (seg) => {
    const m = moodOf.get(seg.id);
    return settingsKey(voice, { ...settings, exaggeration: m.exaggeration, cfg_weight: m.cfg_weight }, refBytes);
  };
  const unknown = analysis.segments.flatMap((seg) => moodOf.get(seg.id).unknown.map((w) => `${w} (${seg.id})`));
  if (unknown.length) log.warn(`  aviso: directions with no Chatterbox register, read as neutral: ${unknown.join(', ')}`);
```

5. En el filtro `todo`, cambiar `rec.settingsKey === sKey` por `rec.settingsKey === segKey(seg)`.
6. La construcción de `jobs` pasa a ser:

```js
  const jobs = todo.map((seg) => {
    const m = moodOf.get(seg.id);
    return { id: seg.id, text: spokenForVoice(voice, seg.parsed), seed: segmentSeed(settings.seed, seg.id), exaggeration: m.exaggeration, cfgWeight: m.cfg_weight };
  });
```

7. En `record`, cambiar:
   - `settingsKey: sKey,` por `settingsKey: segKey(seg),`;
   - `settings,` por
     `settings: { ...settings, exaggeration: moodOf.get(seg.id).exaggeration, cfg_weight: moodOf.get(seg.id).cfg_weight },`;
   - y añadir `register: moodOf.get(seg.id).register,`.

8. Audición de registros. Añadir después de `audition`:

```js
/** The §2.2 sample paragraph of the spec: the same text in every register, to judge them by ear. */
export const MOOD_AUDITION_TEXT =
  '¿Cómo llegan los logs al SIEM? Depende de quién hable. Servidores y estaciones llevan un agente: un pequeño programa que lo reenvía todo. ' +
  'Firewalls y switches no suelen admitir agentes, así que hablan syslog. La nube contesta por API. ' +
  '¿Y los routers? Esos no te cuentan qué se dijo, solo quién habló con quién y cuánto: NetFlow.';

/** One take of MOOD_AUDITION_TEXT per register -> .audition/chatterbox-mood-<register>.mp3. */
export function moodAudition({ voice = 'es-es/default', log = console } = {}) {
  checkSetup();
  const { pack, voiceName, voiceRef } = parseVoice(`chatterbox/${voice}`);
  const text = parseSegmentText(MOOD_AUDITION_TEXT, neuralLexicon()).spoken;
  const dir = path.join(PATHS.auditionDir, 'chatterbox');
  mkdirSync(PATHS.auditionDir, { recursive: true });
  const jobs = Object.entries(REGISTERS).map(([register, r]) => ({
    id: `mood-${register}`,
    text,
    seed: DEFAULT_SETTINGS.seed,
    exaggeration: r.exaggeration,
    cfgWeight: r.cfg_weight,
  }));
  runWorker(jobFileFor(`moods-${pack}-${voiceName}`, { pack, voiceRef, settings: DEFAULT_SETTINGS, jobs, outDir: dir }), log);
  for (const job of jobs) {
    const out = path.join(PATHS.auditionDir, `chatterbox-${job.id}.mp3`);
    encodeClip(path.join(dir, `${job.id}.wav`), out);
    const r = JSON.parse(readFileSync(path.join(dir, `${job.id}.json`), 'utf8'));
    log.log(`  ${job.id}: ${out} (${(r.durationMs / 1000).toFixed(1)} s, script match ${r.score.toFixed(2)})`);
  }
}
```

9. En `main`:
   - añadir la opción `moods: { type: 'boolean', default: false },`;
   - justo después de `const list = …`, añadir:

```js
  if (values.moods) {
    moodAudition(values.voices ? { voice: list(values.voices)[0] } : {});
    return;
  }
```

10. En la cabecera de uso, añadir la línea
    `//   node video/engine/scripts/tts-chatterbox.mjs --video <slug> --audition --moods [--voices es-es/default]`.

- [ ] **Paso 5: El worker**

En `video/engine/scripts/chatterbox_worker.py`, añadir después de `seed_everything`:

```python
def job_settings(spec: dict, job: dict) -> tuple[float, float]:
    """exaggeration and cfg_weight of one job: its own (the segment's mood register), else the run's.

    generate() rebuilds conds.t3.emotion_adv whenever exaggeration changes between calls
    (chatterbox-tts 0.1.7, mtl_tts.py), so no conditionals need preparing again.
    """
    return float(job.get("exaggeration", spec["exaggeration"])), float(job.get("cfgWeight", spec["cfgWeight"]))
```

Dentro del bucle de jobs:
- justo después de `best = None`, añadir `exaggeration, cfg_weight = job_settings(spec, job)`;
- en `tts.generate(...)`, cambiar `exaggeration=spec["exaggeration"],` por `exaggeration=exaggeration,` y
  `cfg_weight=spec["cfgWeight"],` por `cfg_weight=cfg_weight,`.

Actualizar la docstring del módulo: la lista de jobs pasa a ser `{id, text, seed[, exaggeration, cfgWeight]}`.

- [ ] **Paso 6: Pruebas y commit**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && node --test "video/engine/scripts/lib/*.test.mjs" && python -m unittest discover -s video/engine/scripts -p "test_*.py"
```
Resultado esperado: todo en verde. Con Python del sistema, los tests del loader se saltan (`skipped`).

```bash
git add video/engine/scripts/lib/moods.mjs video/engine/scripts/lib/moods.test.mjs video/engine/scripts/tts-chatterbox.mjs video/engine/scripts/chatterbox_worker.py video/engine/scripts/test_chatterbox_worker.py && git commit -m "feat(video): give Chatterbox a voice register per emotion direction" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Elegir la voz de un vídeo (`voice-plan.mjs`)

**Archivos:**
- Crear: `video/engine/scripts/voice-plan.mjs`
- Crear: `video/engine/scripts/lib/voice-plan.test.mjs`

**Interfaces:**
- Consume: `getSubscription()` (`lib/elevenlabs.mjs`), que devuelve `{ character_count, character_limit,
  next_character_count_reset_unix }` o `null`.
- Produce: `SARAH_VOICE`, `CHATTERBOX_DEFAULT_VOICE`, `RETAKE_MARGIN = 1.15`,
  `elevenLabsChars(scenes) -> number` y `chooseVoice(chars, subscription) -> { voice, reason }`.

- [ ] **Paso 1: Escribir la prueba que falla**

`video/engine/scripts/lib/voice-plan.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { CHATTERBOX_DEFAULT_VOICE, SARAH_VOICE, chooseVoice, elevenLabsChars } from '../voice-plan.mjs';

const sub = (count, limit = 10000) => ({ character_count: count, character_limit: limit, next_character_count_reset_unix: 1792886400 });

test('ElevenLabs when the quota covers the script plus 15 % for retakes', () => {
  assert.equal(chooseVoice(6500, sub(2000)).voice, SARAH_VOICE); // 8000 left >= 7475
  assert.equal(chooseVoice(6500, sub(3000)).voice, CHATTERBOX_DEFAULT_VOICE); // 7000 left < 7475
  assert.match(chooseVoice(6500, sub(3000)).reason, /7000 characters left, the script needs 7475; the quota resets on 2026-10-25/);
});

test('Chatterbox when there is no subscription data', () => {
  assert.equal(chooseVoice(100, null).voice, CHATTERBOX_DEFAULT_VOICE);
});

test('elevenLabsChars: one request per scene, segments joined by a newline', () => {
  const scene = (...texts) => ({ segments: texts.map((t) => ({ parsed: { directedSpoken: t } })) });
  assert.equal(elevenLabsChars([scene('abc', 'de'), scene('fgh')]), 'abc\nde'.length + 'fgh'.length);
});
```

- [ ] **Paso 2: Ejecutarla y verla fallar**

Ejecutar: `eval "$(fnm env)" && node --test video/engine/scripts/lib/voice-plan.test.mjs`. Resultado esperado: FAIL
(el módulo no existe).

- [ ] **Paso 3: Implementar**

`video/engine/scripts/voice-plan.mjs`:

```js
#!/usr/bin/env node
// Which voice a new video should use (spec 2026-09-26 §5.1): ElevenLabs (Sarah, the SIEM voice)
// when this month's quota covers the script plus 15 % for retakes, otherwise Chatterbox. It only
// prints the decision; set narration.json "voice" by hand.
//
//   node video/engine/scripts/voice-plan.mjs --video <slug>
import { parseArgs } from 'node:util';
import { getSubscription } from './lib/elevenlabs.mjs';
import { analyzeNarration, loadSources, reportOrThrow } from './lib/narration.mjs';
import { MANIFEST, PATHS, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';

export const SARAH_VOICE = 'elevenlabs/eleven_v3/EXAVITQu4vr4xnSDxMaL';
export const CHATTERBOX_DEFAULT_VOICE = 'chatterbox/es-es/default';
export const RETAKE_MARGIN = 1.15;

/** Characters ElevenLabs bills for the script: one request per scene, its directed segments joined by "\n". */
export function elevenLabsChars(scenes) {
  return scenes.reduce((sum, { segments }) => sum + segments.map((s) => s.parsed.directedSpoken).join('\n').length, 0);
}

/** @returns {{ voice: string, reason: string }} */
export function chooseVoice(chars, subscription) {
  if (!subscription) return { voice: CHATTERBOX_DEFAULT_VOICE, reason: 'no ElevenLabs subscription data (no key, or a key without user_read)' };
  const left = subscription.character_limit - subscription.character_count;
  const needed = Math.ceil(chars * RETAKE_MARGIN);
  const resets = subscription.next_character_count_reset_unix
    ? new Date(subscription.next_character_count_reset_unix * 1000).toISOString().slice(0, 10)
    : 'an unknown date';
  return left >= needed
    ? { voice: SARAH_VOICE, reason: `${left} characters left, the script needs ${needed} (with retakes)` }
    : { voice: CHATTERBOX_DEFAULT_VOICE, reason: `${left} characters left, the script needs ${needed}; the quota resets on ${resets}` };
}

async function main() {
  parseArgs({ options: { video: { type: 'string' } } });
  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const analysis = analyzeNarration(sources, profileFor(MANIFEST.profile));
  reportOrThrow(analysis);
  const chars = elevenLabsChars(analysis.scenes);
  let subscription = null;
  try {
    subscription = await getSubscription();
  } catch (error) {
    console.warn(`  aviso: cannot read the ElevenLabs quota: ${error.message}`);
  }
  const { voice, reason } = chooseVoice(chars, subscription);
  console.log(`${MANIFEST.slug}: ${chars} characters for ElevenLabs\n  "voice": "${voice}"\n  ${reason}`);
}

if (isMainModule(import.meta.url)) {
  main().catch((err) => {
    console.error(`voice-plan: ${err.message}`);
    process.exit(1);
  });
}
```

La prueba usa `1792886400`, que es 2026-10-25T00:00:00Z (comprobado).

- [ ] **Paso 4: Pruebas y commit**

Ejecutar: `eval "$(fnm env)" && node --test "video/engine/scripts/lib/*.test.mjs"`. Todo en verde.

```bash
git add video/engine/scripts/voice-plan.mjs video/engine/scripts/lib/voice-plan.test.mjs && git commit -m "feat(video): pick ElevenLabs or Chatterbox from the remaining quota" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Metadatos de YouTube (`youtube-meta.mjs`)

**Archivos:**
- Crear: `video/engine/scripts/youtube-meta.mjs`
- Crear: `video/engine/scripts/lib/youtube-meta.test.mjs`
- Modificar: `video/engine/scripts/lib/paths.mjs` (`lesson` en `OPTIONAL_MANIFEST_KEYS`)
- Modificar: `video/engine/scripts/lib/intercept.test.mjs` (un caso de `lesson`)

**Interfaces:**
- Consume:
  - `timeline.json` en modo audio (`scenes`, `segments`, `exam`, `voice`, `fps`);
  - `trackNotice(track, profile)` (Tarea 2);
  - `ELEVENLABS_CREDIT` (`build-timeline.mjs`);
  - `video.json` → `lesson`.
- Produce:
  - `APP_URL`;
  - `youtubeTitle(title, track)`;
  - `youtubeChapters(timeline) -> { lines, errors }`;
  - `voiceCredit(voice)`;
  - `youtubeDescription({ timeline, lesson, track, notice })`;
  - `youtubeTags(timeline, track)`;
  - el archivo `video/<slug>/out/youtube.md`.

- [ ] **Paso 1: Escribir la prueba que falla**

`video/engine/scripts/lib/youtube-meta.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { APP_URL, TITLE_MAX, voiceCredit, youtubeChapters, youtubeDescription, youtubeTags, youtubeTitle } from '../youtube-meta.mjs';

const scene = (id, title, from, sec) => ({ id, title, from, durationInFrames: sec * 30, chapter: 1, chapterTitle: 'Uno' });
const timeline = {
  fps: 30,
  voice: 'chatterbox/es-es/default',
  scenes: [scene('s01-a', 'Seis mil avisos', 0, 40), scene('s02-b', 'Recoger', 1200, 65), scene('s03-c', 'Normalizar', 3150, 30)],
  segments: [
    { scene: 's01-a', text: '¿Seis mil alertas al día?' },
    { scene: 's01-a', text: 'Solo una importa.' },
    { scene: 's02-b', text: 'Otra cosa.' },
  ],
  exam: [{ objective: '4.4' }, { objective: '4.4' }, { objective: '4.9' }],
};

test('youtubeChapters: one per scene, mm:ss, first at 00:00', () => {
  const { lines, errors } = youtubeChapters(timeline);
  assert.deepEqual(lines, ['00:00 Seis mil avisos', '00:40 Recoger', '01:45 Normalizar']);
  assert.deepEqual(errors, []);
  const short = { ...timeline, scenes: [scene('s01-a', 'A', 0, 8), scene('s02-b', 'B', 240, 20)] };
  const bad = youtubeChapters(short).errors.join('\n');
  assert.match(bad, /at least 3 chapters/);
  assert.match(bad, /s01-a lasts 8\.0 s/);
});

test('title, credit and tags', () => {
  assert.equal(youtubeTitle('SIEM explicado: del ruido a la evidencia', 'secplus'), 'SIEM explicado: del ruido a la evidencia | Security+ SY0-701 en español');
  assert.ok(TITLE_MAX === 100);
  assert.match(voiceCredit('elevenlabs/eleven_v3/x'), /ElevenLabs/);
  assert.match(voiceCredit('chatterbox/es-es/default'), /Chatterbox/);
  assert.equal(voiceCredit('es-ES-ElviraNeural'), null);
  const tags = youtubeTags(timeline, 'secplus');
  assert.ok(tags.includes('Security+') && tags.includes('objetivo 4.4') && tags.includes('objetivo 4.9'));
  assert.equal(tags.filter((t) => t === 'objetivo 4.4').length, 1);
});

test('description: hook, lesson link, chapters, credit, notice, hashtags', () => {
  const d = youtubeDescription({ timeline, lesson: 'sp4m7', track: 'secplus', notice: 'AVISO' });
  assert.ok(d.startsWith('¿Seis mil alertas al día? Solo una importa.'));
  assert.ok(d.includes(`${APP_URL}#/learn/sp4m7`));
  assert.ok(d.includes('00:40 Recoger'));
  assert.ok(d.includes('Chatterbox'));
  assert.ok(d.includes('AVISO'));
  assert.ok(d.trimEnd().endsWith('#SecurityPlus #Ciberseguridad #Alertópolis'));
});
```

En `intercept.test.mjs`, añadir dentro de la prueba de `checkManifest`:

```js
  assert.doesNotThrow(() => checkManifest({ ...base, lesson: 'sp4m7' }, 'video.json', 'x'));
  assert.doesNotThrow(() => checkManifest({ ...base, lesson: 's3m3' }, 'video.json', 'x'));
  assert.throws(() => checkManifest({ ...base, lesson: 'lesson-7' }, 'video.json', 'x'), /"lesson"/);
```

- [ ] **Paso 2: Ejecutarlas y verlas fallar**

Ejecutar: `eval "$(fnm env)" && node --test video/engine/scripts/lib/youtube-meta.test.mjs video/engine/scripts/lib/intercept.test.mjs`
Resultado esperado: FAIL.

- [ ] **Paso 3: `lesson` en el manifiesto**

En `paths.mjs`, `OPTIONAL_MANIFEST_KEYS` queda así:

```js
export const OPTIONAL_MANIFEST_KEYS = Object.freeze({
  /** Section adversary whose intercepted messages the video shows (e.g. "SILENT PAGER"). */
  adversary: /^[A-Z][A-Z ]{1,30}[A-Z]$/,
  /** Lesson the video belongs to (module id, e.g. "sp4m7" or "s3m3"): the YouTube description links to it. */
  lesson: /^sp?\d+m\d+$/,
});
```

- [ ] **Paso 4: `youtube-meta.mjs`**

```js
#!/usr/bin/env node
// Writes video/<slug>/out/youtube.md for a video whose profile goes to YouTube: title,
// description (hook, lesson link, chapters, voice credit, disclaimer, hashtags), tags and the
// files to upload. Needs an audio-mode timeline (run audio.mjs, then render.mjs, first).
//
//   node video/engine/scripts/youtube-meta.mjs --video <slug>
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { ELEVENLABS_CREDIT, captionsPathFor } from './build-timeline.mjs';
import { parseJsonText } from './lib/narration.mjs';
import { MANIFEST, PATHS, isMainModule } from './lib/paths.mjs';
import { profileFor, trackNotice } from './lib/profiles.mjs';
import { writeFileAtomic } from './lib/remotion.mjs';

export const APP_URL = 'https://llopez-s.github.io/ticourse/';
export const TITLE_MAX = 100;
export const TAGS_MAX_CHARS = 500;
export const THUMB_MAX_BYTES = 2 * 1024 * 1024;
export const CHATTERBOX_CREDIT = 'Voz: Chatterbox, de Resemble AI (licencia MIT)';
const TRACK_LABEL = { secplus: 'Security+ SY0-701 en español', gcti: 'GIAC GCTI en español' };
const TRACK_TAGS = {
  secplus: ['Security+', 'SY0-701', 'CompTIA Security+ en español', 'ciberseguridad', 'blue team', 'Alertópolis'],
  gcti: ['GCTI', 'threat intelligence', 'inteligencia de amenazas', 'ciberseguridad', 'FOR578', 'Alertópolis'],
};
const HASHTAGS = { secplus: '#SecurityPlus #Ciberseguridad #Alertópolis', gcti: '#ThreatIntelligence #Ciberseguridad #Alertópolis' };

const stamp = (frame, fps) => {
  const s = Math.floor(frame / fps);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export function youtubeTitle(title, track) {
  return `${title} | ${TRACK_LABEL[track]}`;
}

/** YouTube chapters, one per scene: the first at 00:00, at least 3, each at least 10 s long. */
export function youtubeChapters(timeline) {
  const errors = [];
  const lines = timeline.scenes.map((s) => `${stamp(s.from, timeline.fps)} ${s.title}`);
  if (timeline.scenes[0]?.from !== 0) errors.push('the first chapter must start at 00:00');
  if (timeline.scenes.length < 3) errors.push(`YouTube needs at least 3 chapters (have ${timeline.scenes.length})`);
  for (const s of timeline.scenes) {
    const sec = s.durationInFrames / timeline.fps;
    if (sec < 10) errors.push(`${s.id} lasts ${sec.toFixed(1)} s (a YouTube chapter needs 10 s)`);
  }
  return { lines, errors };
}

export function voiceCredit(voice) {
  if (voice.startsWith('elevenlabs/')) return ELEVENLABS_CREDIT;
  if (voice.startsWith('chatterbox/')) return CHATTERBOX_CREDIT;
  return null;
}

export function youtubeTags(timeline, track) {
  return [...new Set([...TRACK_TAGS[track], ...timeline.exam.map((e) => `objetivo ${e.objective}`)])];
}

export function youtubeDescription({ timeline, lesson, track, notice }) {
  const first = timeline.scenes[0].id;
  const hook = timeline.segments.filter((s) => s.scene === first).slice(0, 2).map((s) => s.text).join(' ');
  const credit = voiceCredit(timeline.voice);
  return [
    hook,
    '',
    `Practica esta lección gratis en Alertópolis: ${APP_URL}#/learn/${lesson}`,
    '',
    'Capítulos',
    ...youtubeChapters(timeline).lines,
    '',
    ...(credit ? [credit] : []),
    notice,
    '',
    HASHTAGS[track],
    '',
  ].join('\n');
}

function main() {
  parseArgs({ options: { video: { type: 'string' } } });
  const errors = [];
  if (profileFor(MANIFEST.profile).host !== 'youtube') errors.push(`profile "${MANIFEST.profile}" is not a YouTube profile (principal-yt / capsula-yt)`);
  if (!MANIFEST.lesson) errors.push('video.json needs "lesson" (the module id the description links to)');
  const timeline = parseJsonText(readFileSync(PATHS.timeline, 'utf8'), PATHS.timeline);
  if (timeline.mode !== 'audio') errors.push('timeline.json is in estimate mode — run audio.mjs first');
  const storyboard = parseJsonText(readFileSync(PATHS.storyboard, 'utf8'), PATHS.storyboard);
  const title = youtubeTitle(storyboard.title, MANIFEST.track);
  if (title.length > TITLE_MAX) errors.push(`title is ${title.length} characters (YouTube max ${TITLE_MAX}): shorten storyboard.title`);
  errors.push(...youtubeChapters(timeline).errors);
  const tags = youtubeTags(timeline, MANIFEST.track);
  if (tags.join(',').length > TAGS_MAX_CHARS) errors.push(`tags take ${tags.join(',').length} characters (max ${TAGS_MAX_CHARS})`);
  if (!existsSync(PATHS.poster)) errors.push(`no poster at ${PATHS.poster} — run render.mjs`);
  else if (statSync(PATHS.poster).size > THUMB_MAX_BYTES) errors.push(`poster is over 2 MB, YouTube's thumbnail limit`);
  const captions = captionsPathFor(PATHS.transcript);
  if (!existsSync(captions)) errors.push(`no captions at ${captions}`);
  if (errors.length) throw new Error(`${errors.length} problem(s):\n${errors.map((e) => `  - ${e}`).join('\n')}`);

  const notice = trackNotice(MANIFEST.track, MANIFEST.profile);
  const description = youtubeDescription({ timeline, lesson: MANIFEST.lesson, track: MANIFEST.track, notice });
  const out = path.join(PATHS.outDir, 'youtube.md');
  writeFileAtomic(
    out,
    [
      `# YouTube · ${MANIFEST.slug}`,
      '',
      '## Título',
      '',
      title,
      '',
      '## Descripción',
      '',
      '```text',
      description.trimEnd(),
      '```',
      '',
      '## Etiquetas',
      '',
      tags.join(', '),
      '',
      '## Archivos',
      '',
      `- Vídeo: ${PATHS.video}${existsSync(PATHS.video) ? '' : ' (todavía no renderizado)'}`,
      `- Subtítulos (español): ${captions}`,
      `- Miniatura: ${PATHS.poster}`,
      '',
      '## Ajustes',
      '',
      '- Visibilidad: pública (se publica solo con el OK de Lidia).',
      '- Audiencia: «No, no es contenido creado para niños».',
      `- Lista: ${MANIFEST.track === 'secplus' ? 'Security+ SY0-701' : 'GCTI'}.`,
      '',
    ].join('\n'),
  );
  console.log(`youtube.md -> ${out}`);
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`youtube-meta: ${error.message}`);
    process.exit(1);
  }
}
```

`youtube.md` lleva comillas invertidas: escribir este archivo con Write, no con un heredoc de Bash.

- [ ] **Paso 5: Pruebas y commit**

Ejecutar: `eval "$(fnm env)" && node --test "video/engine/scripts/lib/*.test.mjs"`. Todo en verde; la regresión,
sin diff.

```bash
git add video/engine/scripts/youtube-meta.mjs video/engine/scripts/lib/youtube-meta.test.mjs video/engine/scripts/lib/paths.mjs video/engine/scripts/lib/intercept.test.mjs && git commit -m "feat(video): generate YouTube title, description, chapters and tags" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Bloque de vídeo de YouTube en la app

**Archivos:**
- Modificar: `src/lib/types.ts:78` (variantes del bloque `video`)
- Crear: `src/lib/youtube.ts`
- Crear: `src/lib/youtube.test.ts`
- Modificar: `src/components/BlockRenderer.tsx` (`TranscriptDetails` compartido, `YouTubeBlock`, el `case 'video'`)
- Modificar: `src/data/content.test.ts` (suite `lesson videos`)

**Interfaces:**
- Produce:
  - `VideoFileBlock` y `YouTubeVideoBlock` (en `types.ts`);
  - `isYouTubeId`, `youtubeEmbedUrl`, `youtubeWatchUrl` e `isYouTubeBlock` (en `youtube.ts`).

- [ ] **Paso 1: Escribir la prueba que falla**

`src/lib/youtube.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isYouTubeBlock, isYouTubeId, youtubeEmbedUrl, youtubeWatchUrl } from './youtube';

describe('youtube', () => {
  it('ids are 11 characters of [A-Za-z0-9_-]', () => {
    expect(isYouTubeId('jNQXAC9IVRw')).toBe(true);
    expect(isYouTubeId('jNQXAC9IVR')).toBe(false);
    expect(isYouTubeId('jNQXAC9IVRw&t=1')).toBe(false);
  });

  it('embeds through youtube-nocookie, autoplaying with Spanish captions', () => {
    const url = new URL(youtubeEmbedUrl('jNQXAC9IVRw'));
    expect(url.origin).toBe('https://www.youtube-nocookie.com');
    expect(url.pathname).toBe('/embed/jNQXAC9IVRw');
    expect(Object.fromEntries(url.searchParams)).toEqual({ autoplay: '1', rel: '0', cc_load_policy: '1', cc_lang_pref: 'es', hl: 'es' });
    expect(() => youtubeEmbedUrl('nope')).toThrow(/invalid YouTube id/);
  });

  it('links to the watch page and tells the two video blocks apart', () => {
    expect(youtubeWatchUrl('jNQXAC9IVRw')).toBe('https://www.youtube.com/watch?v=jNQXAC9IVRw');
    const file = { t: 'video' as const, title: 't', src: 's.mp4', poster: 'p.png', transcript: 't.txt', captions: 'c.vtt' };
    const yt = { t: 'video' as const, title: 't', youtube: 'jNQXAC9IVRw', poster: 'p.png', transcript: 't.txt' };
    expect(isYouTubeBlock(file)).toBe(false);
    expect(isYouTubeBlock(yt)).toBe(true);
  });
});
```

- [ ] **Paso 2: Ejecutarla y verla fallar**

Ejecutar: `eval "$(fnm env)" && npx vitest run src/lib/youtube.test.ts`. Resultado esperado: FAIL (no existe el
módulo).

- [ ] **Paso 3: Tipos y `youtube.ts`**

En `src/lib/types.ts`, sustituir la línea
`| { t: 'video'; title: string; src: string; poster: string; transcript: string; captions: string }` por
`| VideoFileBlock | YouTubeVideoBlock`, y añadir encima de `export type Block`:

```ts
/** A lesson video hosted in the app: the MP4 and its captions live in public/videos. */
export interface VideoFileBlock {
  t: 'video';
  title: string;
  src: string;
  poster: string;
  transcript: string;
  captions: string;
}

/** A lesson video hosted on YouTube: only the poster and the transcript live in public/videos. */
export interface YouTubeVideoBlock {
  t: 'video';
  title: string;
  /** YouTube video id (11 characters). */
  youtube: string;
  poster: string;
  transcript: string;
}
```

`src/lib/youtube.ts`:

```ts
import type { VideoFileBlock, YouTubeVideoBlock } from './types';

/** YouTube video ids are 11 characters of [A-Za-z0-9_-]. */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export function isYouTubeId(id: string): boolean {
  return YOUTUBE_ID.test(id);
}

/** Privacy-enhanced embed. It autoplays because it only mounts after the learner clicks play. */
export function youtubeEmbedUrl(id: string): string {
  if (!isYouTubeId(id)) throw new Error(`invalid YouTube id ${JSON.stringify(id)}`);
  const query = new URLSearchParams({ autoplay: '1', rel: '0', cc_load_policy: '1', cc_lang_pref: 'es', hl: 'es' });
  return `https://www.youtube-nocookie.com/embed/${id}?${query}`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function isYouTubeBlock(block: VideoFileBlock | YouTubeVideoBlock): block is YouTubeVideoBlock {
  return 'youtube' in block;
}
```

- [ ] **Paso 4: El reproductor**

En `src/components/BlockRenderer.tsx`:

1. Imports:
   - `import type { Block, CheckQ, VideoFileBlock, YouTubeVideoBlock } from '../lib/types';`
   - `import { isYouTubeBlock, youtubeEmbedUrl, youtubeWatchUrl } from '../lib/youtube';`

2. Sacar la transcripción a un componente compartido. Añadir, justo antes de `function VideoBlock`:

```tsx
/** «Leer transcripción»: loads the transcript text the first time it opens. */
function TranscriptDetails({ src }: { src: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [text, setText] = useState('');
  const load = async (open: boolean) => {
    if (!open || status !== 'idle') return;
    setStatus('loading');
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setText(await response.text());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };
  return (
    <details
      className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3 py-2 text-slate-300"
      onToggle={(event) => void load(event.currentTarget.open)}
    >
      <summary className="cursor-pointer font-medium text-cyan-300">Leer transcripción</summary>
      {status === 'loading' ? <p role="status" className="mt-3">Cargando transcripción…</p> : null}
      {status === 'ready' ? <p className="mt-3 whitespace-pre-wrap leading-relaxed">{text}</p> : null}
      {status === 'error' ? (
        <p role="alert" className="mt-3 text-amber-200">No se pudo cargar la transcripción.</p>
      ) : null}
      <a className="mt-3 inline-block text-cyan-300 underline underline-offset-2 hover:text-cyan-200" href={src}>
        Abrir archivo de transcripción
      </a>
    </details>
  );
}
```

3. En `VideoBlock`:
   - la firma pasa a ser `function VideoBlock({ block }: { block: VideoFileBlock }) {`;
   - borrar los estados `transcriptStatus` y `transcriptText` y la función `loadTranscript`;
   - sustituir todo el `<details …>…</details>` por `<TranscriptDetails src={transcriptSrc} />`.

4. Añadir, después de `VideoBlock`:

```tsx
/**
 * YouTube lesson video behind a click-to-load facade: until the learner presses play the page shows
 * only our own poster, so nothing is requested from YouTube or Google.
 */
function YouTubeBlock({ block }: { block: YouTubeVideoBlock }) {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="my-6 overflow-hidden rounded-xl border border-cyan-500/30 bg-ink-900">
      <div className="border-b border-ink-700 px-4 py-3">
        <h3 className="text-base font-semibold text-slate-100">{block.title}</h3>
      </div>
      <div className="relative aspect-video w-full bg-ink-950">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={youtubeEmbedUrl(block.youtube)}
            title={block.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="group absolute inset-0 h-full w-full"
            onClick={() => setPlaying(true)}
            aria-label={`Reproducir «${block.title}» (se carga desde YouTube)`}
          >
            <img src={assetUrl(block.poster)} alt="" className="h-full w-full object-cover" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-red-600/90 shadow-lg transition group-hover:bg-red-600">
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <p className="border-t border-ink-700 px-4 py-2 text-xs text-slate-400">
        El vídeo se carga desde YouTube solo al pulsar reproducir.
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm">
        <a
          className="font-medium text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
          href={youtubeWatchUrl(block.youtube)}
          target="_blank"
          rel="noreferrer"
        >
          Ver en YouTube
        </a>
        <TranscriptDetails src={assetUrl(block.transcript)} />
      </div>
    </section>
  );
}
```

5. El `case 'video':` pasa a ser:

```tsx
          case 'video':
            return isYouTubeBlock(b) ? <YouTubeBlock key={i} block={b} /> : <VideoBlock key={i} block={b} />;
```

- [ ] **Paso 5: Tests de contenido**

En `src/data/content.test.ts`, suite `lesson videos`:

1. Importar `import { isYouTubeBlock, isYouTubeId } from '../lib/youtube';`.
2. Sustituir la definición de `videos` y `moduleOf` por:

```ts
  // Every t:'video' block of both tracks, with the lesson that embeds it.
  const allVideos = ALL_MODULES.flatMap((m) =>
    m.blocks.flatMap((b) => (b.t === 'video' ? [{ module: m.id, block: b }] : [])),
  );
  const videos = allVideos.flatMap((v) => (isYouTubeBlock(v.block) ? [] : [{ module: v.module, block: v.block }]));
  const youtubeVideos = allVideos.flatMap((v) => (isYouTubeBlock(v.block) ? [{ module: v.module, block: v.block }] : []));
  const moduleOf = (src: string) => videos.find((v) => v.block.src === src)?.module;
```

3. Añadir, después de la prueba `every video block points at relative public assets that exist`:

```ts
  it('every YouTube video block has a valid id and its poster and transcript in public/', async () => {
    const fs = await loadFs();
    for (const { module, block } of youtubeVideos) {
      expect(isYouTubeId(block.youtube), `${module}: ${block.youtube}`).toBe(true);
      for (const [path, ext] of [[block.poster, /\.(png|jpe?g|webp)$/], [block.transcript, /\.txt$/]] as const) {
        expect(path, module).toMatch(ext);
        expect(path.startsWith('/') || path.includes('..'), module).toBe(false);
        expect(fs.existsSync(publicFile(path)), `${module}: ${path}`).toBe(true);
      }
      expect(fs.readFileSync(publicFile(block.transcript), 'utf8').length, block.transcript).toBeGreaterThan(200);
    }
  });
```

4. En `no two video blocks share an asset`, sustituir la línea `paths` por:

```ts
    const paths = [
      ...videos.flatMap(({ block }) => [block.src, block.poster, block.transcript, block.captions]),
      ...youtubeVideos.flatMap(({ block }) => [block.youtube, block.poster, block.transcript]),
    ];
```

- [ ] **Paso 6: Pruebas y build**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && npm test && npm run build
```
Resultado esperado: vitest en verde (hoy no hay bloques de YouTube, así que la prueba nueva recorre una lista
vacía) y build correcto.

- [ ] **Paso 7: Verificación en el navegador, con un bloque temporal**

1. Añadir temporalmente, **sin commit**, al final de los `blocks` de `sp4m7` (`src/data/secplus/sp4-part4.ts`):

```ts
    { t: 'video', title: 'Prueba YouTube', youtube: 'jNQXAC9IVRw', poster: 'videos/siem-blue-team-poster.png', transcript: 'videos/siem-blue-team-transcript.txt' },
```

2. Abrir la vista previa con `preview_start` `{ name: "intelforge-dev" }` y navegar a `#/learn/sp4m7`.
3. Con `read_network_requests`, filtrando por `youtube`: **ninguna petición antes del clic**.
4. Pulsar el botón de reproducir: aparece el iframe de `youtube-nocookie.com/embed/jNQXAC9IVRw` y hay
   peticiones a `youtube-nocookie.com`.
5. «Leer transcripción» abre el texto.
6. Revisar con `resize_window`, en `mobile` y en modo claro y oscuro: el bloque no desborda.
7. Hacer una captura como prueba.
8. **Quitar el bloque temporal** y comprobar con `git diff --stat` que `sp4-part4.ts` no ha cambiado.

- [ ] **Paso 8: Commit**

```bash
git add src/lib/types.ts src/lib/youtube.ts src/lib/youtube.test.ts src/components/BlockRenderer.tsx src/data/content.test.ts && git commit -m "feat(app): play YouTube lesson videos behind a click-to-load facade" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: La app pasa a llamarse Alertópolis

**Archivos:**
- Crear: `src/lib/brand.ts`
- Crear: `src/lib/brand.test.ts`
- Modificar:
  - `src/components/Layout.tsx:143` y `:239`;
  - `src/pages/GlossaryPage.tsx:74`;
  - `index.html:7`;
  - `src/lib/types.ts:1`;
  - `README.md:1`;
  - `CLAUDE.md` (título y primer párrafo).

**Interfaces:**
- Produce: `APP_NAME = 'Alertópolis'` y `APP_WORDMARK = 'ALERTÓPOLIS'`.
- `video/engine/scripts/lib/profiles.mjs` tiene su propio `APP_NAME` (Tarea 2), porque el motor no importa código
  de la app. Los dos deben coincidir, y la prueba lo comprueba leyendo `profiles.mjs` como texto.

- [ ] **Paso 1: Escribir la prueba que falla**

`src/lib/brand.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { APP_NAME, APP_WORDMARK } from './brand';
import { useStore } from './store';
import { useSyncStore } from './syncStore';

type Fs = { readFileSync(path: URL, encoding: 'utf8'): string };
const loadFs = async (): Promise<Fs> => import(/* @vite-ignore */ ['node', 'fs'].join(':'));

describe('brand', () => {
  it('is Alertópolis, with an upper-case wordmark', () => {
    expect(APP_NAME).toBe('Alertópolis');
    expect(APP_WORDMARK).toBe(APP_NAME.toUpperCase());
  });

  it('the page title and the video engine use the same name', async () => {
    const fs = await loadFs();
    expect(fs.readFileSync(new URL('../../index.html', import.meta.url), 'utf8')).toContain(`<title>${APP_NAME} — `);
    expect(fs.readFileSync(new URL('../../video/engine/scripts/lib/profiles.mjs', import.meta.url), 'utf8')).toContain(`APP_NAME = '${APP_NAME}'`);
  });

  it('saved progress keeps its storage keys (renaming them would wipe it)', () => {
    expect(useStore.persist.getOptions().name).toBe('intelforge-v1');
    expect(useSyncStore.persist.getOptions().name).toBe('intelforge-sync');
  });
});
```

- [ ] **Paso 2: Ejecutarla y verla fallar**

Ejecutar: `eval "$(fnm env)" && npx vitest run src/lib/brand.test.ts`. Resultado esperado: FAIL (`./brand` no
existe).

- [ ] **Paso 3: Implementar**

`src/lib/brand.ts`:

```ts
/** Public name of the app and its YouTube channel (since 2026-09-26; formerly IntelForge Academy). */
export const APP_NAME = 'Alertópolis';
/** Wordmark in the sidebar and the mobile header. */
export const APP_WORDMARK = 'ALERTÓPOLIS';
```

- **`Layout.tsx`:** importar `import { APP_WORDMARK } from '../lib/brand';` y sustituir las dos apariciones del
  texto `INTELFORGE` (líneas 143 y 239) por `{APP_WORDMARK}`.
- **`GlossaryPage.tsx`:** importar `import { APP_NAME } from '../lib/brand';` y cambiar la línea 74 a
  `Índice — {APP_NAME} · {track.name} (material no oficial)`.
- **`index.html`:** `<title>Alertópolis — GCTI · Security+ Prep</title>`.
- **`src/lib/types.ts:1`:** `// Core domain types for Alertópolis (formerly IntelForge Academy)`.
- **`README.md:1`:** `# ◆ Alertópolis — Preparación GCTI · Security+`, y debajo una línea en blanco y
  `*Antes IntelForge Academy. Las claves de guardado del navegador (\`intelforge-v1\`, \`intelforge-sync\`) conservan el nombre antiguo a propósito, para no perder el progreso.*`.
- **`CLAUDE.md`:**
  - título: `# CLAUDE.md — TICourse (Alertópolis, formerly IntelForge Academy)`;
  - en «What this is», `**IntelForge Academy**` pasa a `**Alertópolis** (renamed from IntelForge Academy on 2026-09-26; storage keys keep the old name on purpose)`.

Escribir las líneas con comillas invertidas con Edit, no con Bash.

- [ ] **Paso 4: Pruebas, build y vista previa**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && npm test && npm run build
```

En la vista previa (`intelforge-dev`):
- la barra lateral (escritorio) y la cabecera (móvil) muestran «ALERTÓPOLIS»;
- la pestaña se titula «Alertópolis — GCTI · Security+ Prep»;
- el progreso guardado sigue ahí: el XP y las lecciones completadas no cambian después de recargar.

- [ ] **Paso 5: Commit**

```bash
git add src/lib/brand.ts src/lib/brand.test.ts src/components/Layout.tsx src/pages/GlossaryPage.tsx index.html src/lib/types.ts README.md CLAUDE.md && git commit -m "feat(app): rename the app to Alertopolis, keeping the storage keys" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Guía de estilo, documentación y regresión completa

**Archivos:**
- Modificar: `docs/superpowers/plans/2026-09-25-lesson-videos.md`:
  - §1 Formatos: columnas `-yt` y la guía de narración;
  - §8 Recetario: los pasos nuevos.
- Modificar: `video/engine/README.md` (perfiles `-yt`, `intercept`, registros de Chatterbox, `voice-plan`,
  `youtube-meta` y la publicación).
- Modificar: `CLAUDE.md` (la entrada «Lesson videos»).

- [ ] **Paso 1: Plan de vídeos, §1**

Añadir a la tabla de formatos dos columnas, **Principal YouTube (`principal-yt`)** y **Cápsula YouTube
(`capsula-yt`)**, con los valores de las Restricciones globales:
- duración y capítulos;
- tarjetas de examen, pausas para pensar y mensajes interceptados;
- crf 18, sin objetivo de tamaño;
- el MP4 en `video/<slug>/out/`, sin commit.

Debajo, una subsección **«Narración con chispa (vídeos nuevos)»** que copie, **textuales**:
- las 7 reglas de la spec §2.1;
- el ejemplo antes y después de §2.2;
- las salvaguardas de §2.3.

Añadir también:
- **el vocabulario de etiquetas de emoción:** la tabla de registros de la spec §5.2, para que el guion use
  etiquetas que Chatterbox entienda;
- **el mensaje interceptado:** qué es, sus límites y el campo `adversary` de `video.json`;
- **los nombres en pantalla:** en los vídeos nuevos el póster y la tarjeta final dicen «Alertópolis», nunca
  «IntelForge Academy».

- [ ] **Paso 2: Plan de vídeos, §8 (recetario)**

Tras el paso 2 del recetario, insertar:
- `video.json` lleva `profile` `principal-yt` o `capsula-yt`, más `adversary` y `lesson`;
- **antes de sintetizar:** `node video/engine/scripts/voice-plan.mjs --video <slug>` y poner en
  `narration.json` la voz que diga;
- **al revisar la exactitud:** el revisor comprueba además que ninguna analogía ni chiste falsee el concepto;
- **después de `render`:** `node video/engine/scripts/youtube-meta.mjs --video <slug>` y la subida a YouTube.
  - Lidia inicia sesión en YouTube Studio en su Chrome.
  - Claude, con Claude in Chrome, sube el MP4, rellena los datos de `out/youtube.md`, sube los subtítulos y la
    miniatura, y **pide confirmación antes de «Publicar»**.
  - Nunca se usa ni se pide la contraseña.
- **En la app:** un bloque `{ t: 'video', title, youtube: '<id>', poster, transcript }`, con el póster y la
  transcripción en `public/videos/`, y **sin copiar el MP4**.

- [ ] **Paso 3: README del motor y CLAUDE.md**

`video/engine/README.md`:
- **Perfiles:** los cuatro, con la tabla, qué cambia con `host: 'youtube'` (la ruta del MP4 y el tamaño) y el
  aviso con la marca.
- **Mensaje interceptado:** el formato en `narration.json`, `adversary` en `video.json`, el silencio antes del
  audio, la clave opcional `intercept` del timeline, la línea de la transcripción y la tarjeta roja.
- **Voz: Chatterbox:** la subsección «Registros» (la tabla, `moods: false`, la audición
  `--audition --moods`).
- **Comandos:** `voice-plan.mjs` y `youtube-meta.mjs`.

`CLAUDE.md`: en la entrada «Lesson videos», una frase sobre los perfiles `-yt` (YouTube, MP4 sin commit), el
mensaje interceptado, `voice-plan` y `youtube-meta`, con un enlace a la spec.

- [ ] **Paso 4: Regresión y suites completas**

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && node --test "video/engine/scripts/lib/*.test.mjs" && python -m unittest discover -s video/engine/scripts -p "test_*.py" && npx tsc --noEmit -p video/engine/tsconfig.json && npx tsc --noEmit -p video/siem/tsconfig.json && npx tsc --noEmit -p video/forense-adquisicion/tsconfig.json && npm test && npm run build
```

Y la regresión de la Tarea 1, paso 3: **sin diff**. Todo en verde.

- [ ] **Paso 5: Commit**

```bash
git add docs/superpowers/plans/2026-09-25-lesson-videos.md video/engine/README.md CLAUDE.md && git commit -m "docs(video): lively narration style guide, YouTube profiles and publishing" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Audición de registros con Lidia (validación humana)

Antes del primer vídeo que use Chatterbox, Lidia aprueba la tabla de registros de oído (spec §5.2).

- [ ] **Paso 1: Generar la audición**

Tarda unos 10–15 min en CPU, así que se lanza en segundo plano:

```bash
cd "/d/LLM projects/TICourse" && eval "$(fnm env)" && node video/engine/scripts/tts-chatterbox.mjs --video siem --audition --moods
```

Resultado esperado: cuatro archivos, `video/siem/.audition/chatterbox-mood-{sereno,neutro,calido,vivo}.mp3`, cada
uno con `script match` ≥ 0,85. Si alguno queda por debajo, repetirlo o avisar de que la toma no sigue el guion.

- [ ] **Paso 1b: Una pista con los saltos entre registros**

En un vídeo real, el riesgo está en el salto de un registro a otro entre frases seguidas. Concatenar los cuatro en
el orden sereno, vivo, neutro, cálido, con el ffmpeg de Remotion (con `dangerouslyDisableSandbox`):

```bash
cd "/d/LLM projects/TICourse/video/siem/.audition" && printf "file 'chatterbox-mood-sereno.mp3'\nfile 'chatterbox-mood-vivo.mp3'\nfile 'chatterbox-mood-neutro.mp3'\nfile 'chatterbox-mood-calido.mp3'\n" > moods-concat.txt && node "/d/LLM projects/TICourse/node_modules/@remotion/cli/remotion-cli.js" ffmpeg -v error -y -f concat -safe 0 -i moods-concat.txt -c copy chatterbox-moods-saltos.mp3
```

- [ ] **Paso 2: Enviárselos**

Enviar con `SendUserFile` los cuatro MP3 y la pista de saltos (`chatterbox-moods-saltos.mp3`), con este pie: el
mismo párrafo en los cuatro registros, de más sereno a más vivo, y una pista con los cambios de registro
seguidos. Preguntar si la tabla vale, qué registro subir o bajar y si algún salto chirría.

- [ ] **Paso 3: Ajustar si lo pide**

Si Lidia cambia algún valor:
- actualizar `REGISTERS` en `moods.mjs`;
- actualizar la prueba `the registers are the ones in the spec` de `moods.test.mjs`;
- actualizar la tabla de la spec §5.2;
- volver a ejecutar las pruebas y hacer commit
  (`fix(video): tune the Chatterbox registers after the audition`).

- [ ] **Paso 4: Fin**

Resumen para Lidia:
- qué hace ahora el motor;
- las pruebas que pasan;
- que **no se ha hecho push**, porque la rama `video-narration-style` espera su OK;
- el siguiente paso: producir el primer vídeo con perfil `-yt` (V1 EDR rehecho, o V3/V4) siguiendo el recetario.
