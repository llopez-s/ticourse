# Motor de vídeo: formato «caso y examen» — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** que el motor de `video/engine/` pueda producir vídeos con preguntas tipo examen en pantalla (cuatro opciones, cuenta atrás, revelación de la correcta y de la trampa), con dos perfiles nuevos, `caso-yt` y `caso-principal-yt`.

**Architecture:** la pregunta vive en `narration.json` como campo `question` de un segmento, igual que `think` o `intercept`: el segmento es la voz que lee el escenario y la pregunta, y tras su audio queda una pausa en silencio (la cuenta atrás). `build-timeline.mjs` la convierte en una entrada `questions[]` del `timeline.json`, que aparece **solo si hay preguntas** (los vídeos ya publicados no cambian ni un byte). Una capa nueva, `ExamQuestionLayer`, la dibuja sobre la escena. El VTT añade las cuatro opciones como texto.

**Tech Stack:** Node 22+ (`node --test`), Remotion 4 + React 19 + TypeScript strict (`video/engine/src`).

**Spec:** `docs/superpowers/specs/2026-10-16-secplus-casos-examen-design.md` (§4.2, §4.3, §5 y §9.2).

## Global Constraints

- Perfiles (spec §4.2): `caso-yt` 240–330 s, `maxChapters` 3, `examCards` [3, 5], `thinkPrompts` 0, `intercepts` [0, 1], `examQuestions` [3, 3]; `caso-principal-yt` 420–600 s, `maxChapters` 5, `examCards` [5, 8], `thinkPrompts` 0, `intercepts` [0, 2], `examQuestions` [4, 5]. Ambos con `chispa: true`, `host: 'youtube'`, `crf: 18`, `x264Preset: 'medium'`, `captionsOnScreen: false`, `size: null`, como `capsula-yt`.
- Los perfiles existentes reciben `examQuestions: [0, 0]` y no cambian nada más.
- Cuenta atrás por defecto 5 s (spec §4.3), con el rótulo fijo «Pausa si quieres». Las otras etiquetas fijas son «Trampa» y la plaquita `EXAMEN · <badge> · <objetivo>`, igual que `ExamCard`.
- La voz no lee las opciones: el validador avisa si una opción aparece literal en el texto hablado de su escena.
- **Regresión:** el `timeline.json`, el VTT y la transcripción de cualquier vídeo sin `question` salen byte a byte iguales que antes.
- Todo el texto en pantalla, en español con los términos del examen en inglés (los escribe el guion, el motor no traduce).
- Comandos de prueba (desde la raíz del repo): `node --test "video/engine/scripts/lib/*.test.mjs"` y `npx tsc --noEmit -p video/engine/tsconfig.json`.
- **Máquina:** los worktrees están en exFAT y no tienen `node_modules`. `node --test` funciona sin ellos. `tsc` y los renders de prueba se lanzan desde el repo de trabajo NTFS (memoria `render-from-scratch-repo`) o con el `node_modules` del checkout principal.

## Review Focus

1. **Un vídeo antiguo sin preguntas** (p. ej. `video/zonas-halden`) reconstruido en modo `estimate` debe dar el mismo `timeline.json` y el mismo VTT. Lo fija un test de la tarea 3.
2. **El `revealAt` cae antes de que acabe la cuenta atrás** (el guion pone la cue demasiado pronto): error de compilación, no una revelación encima del contador. Test de la tarea 3.
3. **Opciones largas en móvil:** una opción de 70 caracteres debe caber en una o dos líneas a 1080p sin solaparse con la siguiente. Lo comprueba la galería de la tarea 4 con el caso extremo.
4. **Pregunta en la escena final o junto a una exam card en la misma escena:** error claro con el id del segmento. Test de la tarea 2.
5. **`canon-check` y el revisor de exactitud ven el texto de la pregunta** (escenario, pregunta, opciones y explicaciones), no solo la voz. Test de la tarea 5.

---

### Task 1: perfiles `caso-yt` y `caso-principal-yt`

**Files:**
- Modify: `video/engine/scripts/lib/profiles.mjs:11-71`
- Test: `video/engine/scripts/lib/profiles.test.mjs`

**Interfaces:**
- Produces: `PROFILES['caso-yt']`, `PROFILES['caso-principal-yt']`; todos los perfiles llevan `examQuestions: [min, max]`. `profileFor(name)` los devuelve sin cambios.

- [ ] **Step 1: Write the failing test** en `profiles.test.mjs`:

```js
test('caso-yt and caso-principal-yt: the case-and-exam windows', () => {
  const c = profileFor('caso-yt');
  assert.deepEqual([c.minTotalSec, c.maxTotalSec, c.maxChapters], [240, 330, 3]);
  assert.deepEqual([c.examCards, c.thinkPrompts, c.intercepts, c.examQuestions], [[3, 5], 0, [0, 1], [3, 3]]);
  const p = profileFor('caso-principal-yt');
  assert.deepEqual([p.minTotalSec, p.maxTotalSec, p.maxChapters], [420, 600, 5]);
  assert.deepEqual([p.examCards, p.thinkPrompts, p.intercepts, p.examQuestions], [[5, 8], 0, [0, 2], [4, 5]]);
  for (const x of [c, p]) assert.deepEqual([x.chispa, x.host, x.captionsOnScreen, x.size], [true, 'youtube', false, null]);
});

test('the older profiles expect no exam questions', () => {
  for (const name of ['principal', 'capsula', 'principal-yt', 'capsula-yt']) assert.deepEqual(profileFor(name).examQuestions, [0, 0]);
});
```

- [ ] **Step 2: Run** `node --test "video/engine/scripts/lib/profiles.test.mjs"` — Expected: FAIL (`unknown profile "caso-yt"` o `examQuestions` undefined).
- [ ] **Step 3: Implement** los dos perfiles (valores de Global Constraints, con un comentario de una línea que remita al spec) y `examQuestions: [0, 0]` en los cuatro existentes. Si `trackNotice(track, profile)` distingue cápsula y principal por nombre, `caso-yt` se trata como cápsula y `caso-principal-yt` como principal.
- [ ] **Step 4: Run** el mismo comando — Expected: PASS, y `node --test "video/engine/scripts/lib/*.test.mjs"` sigue en verde.
- [ ] **Step 5: Commit** `feat(video): caso-yt and caso-principal-yt profiles`.

### Task 2: `question` en `narration.json` (validador)

**Files:**
- Modify: `video/engine/scripts/lib/narration.mjs` (`analyzeNarration`, ~:166-420)
- Create: `video/engine/scripts/lib/question.test.mjs`

**Interfaces:**
- Consumes: `examQuestions` del perfil (tarea 1), `examObjectiveError(track, objective)` de `profiles.mjs`.
- Produces: cada segmento analizado lleva `question: null | { objective, scenario, q, options: string[4], answer: 0|1|2|3, trap: 0|1|2|3, why, trapWhy, countdownMs, revealAt, trapAt }` (`trapAt` vale `revealAt` si falta). `analyzeNarration(sources, { ..., examQuestions = [0, 0] })`.

Forma en `narration.json` (copia exacta para el README de la tarea 6):

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

Límites: `scenario` ≤ 160 caracteres, `q` ≤ 110, cada opción ≤ 70, `why` y `trapWhy` ≤ 90, `countdownMs` entre 4000 y 7000 (5000 si falta). Los textos en pantalla pasan el mismo filtro `FORBIDDEN_SYMBOLS` que `exam.text`.

- [ ] **Step 1: Write the failing tests** en `question.test.mjs`, con un narrador mínimo construido como en `intercept.test.mjs` (helper `seg(id, scene, extra)`):
  - `a valid question is parsed with trapAt defaulting to revealAt` → `analysis.segments[k].question.trapAt === 'reveal-1'`, sin errores.
  - `options must be exactly four non-empty strings` → error que contiene `question.options`.
  - `answer and trap are distinct indexes 0–3` → errores para `answer: 4` y para `trap === answer`.
  - `revealAt and trapAt must be cues of a later segment of the same scene` → error si la cue está en el propio segmento de la pregunta o en otra escena.
  - `one question per scene, none in the closing scene, never with think, intercept or an exam card in the same scene` → un error por caso, con el id del segmento o de la escena.
  - `the objective is checked like an exam card's` → `objective: '9.9'` da el mismo mensaje que `examObjectiveError`.
  - `the voice should not read the options` → *warning* cuando el texto hablado de un segmento de esa escena contiene una opción literal (sin distinguir mayúsculas ni acentos, solo opciones de ≥ 2 palabras o ≥ 12 caracteres, para no saltar con «Preventive» dicho de pasada).
  - `question count outside the profile range warns` → con `examQuestions: [3, 3]` y 2 preguntas: warning `2 exam questions (style guide: 3–3)`.
- [ ] **Step 2: Run** `node --test "video/engine/scripts/lib/question.test.mjs"` — Expected: FAIL.
- [ ] **Step 3: Implement** el bloque de parseo junto a los de `exam`, `think` e `intercept` (mismo estilo de mensajes, `${label}: question.<campo> …`) y las comprobaciones por escena junto a las de `exams`/`thinkScenes`.
- [ ] **Step 4: Run** `node --test "video/engine/scripts/lib/*.test.mjs"` — Expected: PASS.
- [ ] **Step 5: Commit** `feat(video): exam questions in narration.json`.

### Task 3: `questions[]` en el timeline y las opciones en el VTT

**Files:**
- Modify: `video/engine/scripts/build-timeline.mjs` (~:267-460, `buildVtt` ~:493)
- Modify: `video/engine/scripts/lib/validate-timeline.mjs` (`OPTIONAL`, :18; bloque nuevo junto a `intercept`, ~:162)
- Modify: `video/engine/src/timeline/types.ts`
- Test: `video/engine/scripts/lib/build-timeline.test.mjs`

**Interfaces:**
- Consumes: `segment.question` (tarea 2).
- Produces: en `types.ts`,

```ts
export interface QuestionCue {
  scene: SceneId;
  segment: string;
  /** Start of the question segment: the card enters with the voice. */
  from: number;
  /** Until the end of its scene. */
  durationInFrames: number;
  /** First silent frame after the segment's audio. */
  countdownFrom: number;
  countdownFrames: number;
  revealFrame: number;
  trapFrame: number;
  objective: string;
  badge?: string;
  scenario: string;
  q: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  trap: 0 | 1 | 2 | 3;
  why: string;
  trapWhy: string;
}
```

y `Timeline.questions?: QuestionCue[]` («Present only when the narration has exam questions»).

- [ ] **Step 1: Write the failing tests** en `build-timeline.test.mjs`, sobre el narrador de prueba del fichero con una pregunta añadida:
  - `questions: the segment holds a silent countdown after its audio` → `countdownFrom === seg.from + seg.audioFrames`, `countdownFrames === toFrames(5000)`, y `seg.durationInFrames` incluye esa pausa.
  - `questions: the card lasts until its scene ends and reveals on its cue` → `from + durationInFrames === scene.from + scene.durationInFrames`, `revealFrame` = frame de la cue `revealAt`, `trapFrame >= revealFrame`.
  - `questions: a reveal cue inside the countdown fails the build` → error `… reveals before its countdown ends`.
  - `questions: the VTT carries the four options while the countdown runs` → hay un cue de `countdownFrom` a `countdownFrom + countdownFrames` con el texto `A) …\nB) …\nC) …\nD) …`, y los cues del VTT siguen en orden de inicio.
  - `questions: a timeline without questions has no "questions" key and the same VTT as before` → el `timeline.json` de la fixture sin preguntas no tiene la clave y `buildVtt` da exactamente la cadena de antes (compárala con la salida actual guardada en el propio test).
  - En `validate-timeline`: `questions[k]` con 3 opciones o con `revealFrame` fuera de su escena → error con `questions[k]`.
- [ ] **Step 2: Run** `node --test "video/engine/scripts/lib/build-timeline.test.mjs"` — Expected: FAIL.
- [ ] **Step 3: Implement** en `build-timeline.mjs`: la pausa como `thinkFrames` (se suma a `durationInFrames` del segmento), el array `questions`, `badge` como en las exam cards (`EXAM_BADGE[track]`, omitido para `secplus` si así lo hacen ya las exam cards), `...(questions.length ? { questions } : {})` junto a `intercept`, y en `buildVtt` un cue por pregunta mezclado en orden con las páginas de subtítulos. En `validate-timeline.mjs`, `'questions'` en `OPTIONAL.Timeline` y su comprobación de forma y de frames. El resumen de consola (`:591`) añade «· N preguntas de examen» solo si N > 0.
- [ ] **Step 4: Run** `node --test "video/engine/scripts/lib/*.test.mjs"` — Expected: PASS. Después, en el repo de trabajo NTFS, `node video/engine/scripts/build-timeline.mjs --video zonas-halden --estimate` antes y después del cambio, y `cmp` de `src/timeline.json` y del VTT — Expected: idénticos.
- [ ] **Step 5: Commit** `feat(video): exam questions in the timeline and the captions`.

### Task 4: la capa `ExamQuestionLayer` y su galería

**Files:**
- Create: `video/engine/src/overlay/ExamQuestionLayer.tsx`
- Modify: `video/engine/src/overlay/ThinkPrompt.tsx:41` (exportar `CountdownRing`, sin cambiar cómo se dibuja)
- Modify: `video/engine/src/LessonVideo.tsx:86` (montar la capa entre `<ThinkPrompt />` y `<InterceptLayer />`)
- Modify: `video/engine/src/dev/OverlayGallery.tsx` (fixture `QUESTIONS` y sus fotogramas en el índice de la cabecera)
- Modify: `video/engine/src/ui/CATALOG.md` (una entrada)

**Interfaces:**
- Consumes: `QuestionCue` (tarea 3), `useTimeline()`, tokens `C`, `FONT`, `LAYOUT`, `RADIUS`, `TYPE`, `alpha` de `theme/tokens`, `EASE`/`progress` de `theme/motion`, `Icon`.
- Produces: `export function ExamQuestionView({ questions, frame, fps }: { questions: QuestionCue[]; frame: number; fps: number })` (pura, para la galería) y `export function ExamQuestionLayer()` (lee `timeline.questions ?? []`).

Cómo se ve (lo demás, a criterio de quien lo construya, dentro del lenguaje de `ExamCard` y `ThinkCard`):
- La escena se oscurece detrás (velo de `C.bg`) y un panel centrado ocupa el escenario: arriba la plaquita `EXAMEN · <badge> · <objetivo>` con el icono `mortarboard`, debajo `scenario` (texto secundario) y `q` (destacada), y las cuatro opciones en filas con su letra A–D.
- Entra en 12 frames con la voz; las opciones aparecen escalonadas.
- Durante `countdownFrom … countdownFrom + countdownFrames`: `CountdownRing` con los segundos y el rótulo «Pausa si quieres».
- En `revealFrame`: la correcta se marca (color de acierto de los tokens, icono de check) con `why` debajo; las otras se apagan al 40 %. En `trapFrame`: la trampa se marca en ámbar con la etiqueta «Trampa» y `trapWhy` debajo.
- Sale en los 10 últimos frames de su escena.
- Legible en móvil: ningún texto por debajo de 30 px a 1080p; una opción de 70 caracteres ocupa como mucho dos líneas.

- [ ] **Step 1:** añade `QUESTIONS` a `OverlayGallery.tsx` con dos preguntas: una normal y otra con el caso extremo (escenario de 160 caracteres, cuatro opciones de 70). Reparte fotogramas para: entrada, mitad de la cuenta atrás, revelación y trampa marcada. Apúntalos en el índice de la cabecera, como los demás.
- [ ] **Step 2:** implementa la capa y móntala.
- [ ] **Step 3: Run** `npx tsc --noEmit -p video/engine/tsconfig.json` — Expected: sin errores.
- [ ] **Step 4:** renderiza los cuatro fotogramas de la galería (`remotion still … OverlayGallery --frame=N`, desde el repo de trabajo NTFS y con bundle previo, como manda el README) y míralos. Expected: nada se sale del panel, el texto largo no se solapa y la correcta y la trampa se distinguen sin color (icono y etiqueta).
- [ ] **Step 5:** comprueba que un vídeo antiguo no cambia: render de un fotograma de `zonas-halden` con una pausa para pensar, antes y después, y compara los PNG (iguales; `CountdownRing` solo se ha exportado).
- [ ] **Step 6: Commit** `feat(video): ExamQuestionLayer, the exam question card`.

### Task 5: hojas de grabación, brief de escena y canon

**Files:**
- Modify: `video/engine/scripts/lib/script-sheets.mjs:218,234`
- Modify: `video/engine/scripts/lib/scene-brief.mjs` (~:175-310)
- Modify: `video/engine/scripts/lib/canon-refs.mjs:85-99`
- Test: `script-sheets.test.mjs`, `scene-brief.test.mjs`, `canon-refs.test.mjs`

**Interfaces:**
- Consumes: `segment.question` (tarea 2).

- [ ] **Step 1: Write the failing tests:**
  - `script-sheets`: un segmento con pregunta añade `> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*`, con los segundos de su `countdownMs`, y la lista de tipos de la hoja añade «las preguntas de examen».
  - `scene-brief`: la escena de una pregunta dice que la tarjeta cubre el escenario desde el segmento `<id>` hasta el final de la escena (la escena debe dejar ahí algo quieto y sin texto importante) y en qué cue se revela.
  - `canon-refs`: el lado mostrado incluye `scenario`, `q`, las cuatro opciones, `why` y `trapWhy`.
- [ ] **Step 2: Run** `node --test "video/engine/scripts/lib/*.test.mjs"` — Expected: FAIL en los tres.
- [ ] **Step 3: Implement** los tres cambios siguiendo cómo cada fichero ya trata `think`.
- [ ] **Step 4: Run** el mismo comando — Expected: PASS.
- [ ] **Step 5: Commit** `feat(video): exam questions in the recording sheet, the scene brief and the canon refs`.

### Task 6: documentación y PR

**Files:**
- Modify: `video/engine/README.md` (perfiles y el campo `question`, con el JSON de la tarea 2)
- Modify: `docs/superpowers/plans/2026-09-25-lesson-videos.md` §1 (tabla de formatos: dos columnas nuevas, «Caso» y «Caso principal», con los números de Global Constraints)
- Modify: `CLAUDE.md` (una frase en «Lesson videos»: los vídeos de casos usan `caso-yt`/`caso-principal-yt` y llevan preguntas tipo examen; spec y plan)

- [ ] **Step 1:** escribe los tres cambios.
- [ ] **Step 2: Run** `node --test "video/engine/scripts/lib/*.test.mjs"` y `npx tsc --noEmit -p video/engine/tsconfig.json` — Expected: todo en verde; y `npm test` en la raíz — Expected: los 158+ tests en verde (la app no cambia).
- [ ] **Step 3: Commit** `docs(video): the case-and-exam format in the engine README, the video plan and CLAUDE.md`.
- [ ] **Step 4:** push de la rama y PR contra `main` con los fotogramas de la galería en la descripción. **No se fusiona**: lo pide Lidia (memoria `merge-needs-explicit-ask`).
