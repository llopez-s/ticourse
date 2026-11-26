# Supuestos prácticos (motor + XP práctico + piloto de redes) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir a Alertópolis un motor genérico de supuestos prácticos (expediente + fases encadenadas, modos práctica y simulacro, nota sobre 10, informe), una moneda nueva de XP práctico sincronizada, y el supuesto piloto `op1s1` sobre el bloque de redes.

**Architecture:** Lógica pura en `src/lib/supuesto*.ts` (tipos, validación, corrección, nota, reloj, informe), probada con vitest. El contenido es datos en `src/data/<pista>/supuestos/`, cargado en diferido; los metadatos ligeros viven en `TRACKS[t].supuestos`. El trabajo en curso se guarda con `labWorkspace` (identidad `supuesto/<id>/<modo>/v<version>`); el resultado que cuenta va al store (persist v4) y se sincroniza.

**Tech Stack:** Vite 7 · React 19 · TypeScript estricto · Tailwind 4 · Zustand persist · react-router 7 (HashRouter) · vitest · Playwright (script opcional).

**Spec:** `docs/superpowers/specs/2026-11-26-supuestos-practicos-design.md` (y `2026-11-26-pista-opo-temario-design.md` para el contexto de la pista).

## Global Constraints

- Trabajar en la worktree `C:/Users/lidie/AppData/Local/Temp/alertopolis-voz/pista-opo-temario` (rama `pista-opo-temario`, desde `origin/main`). En Bash: `eval "$(fnm env)"` antes de `npm`; `npm ci` una vez.
- Interfaz y contenido en español natural (sin calcos: «encaminador», «conmutador»); siglas en su forma habitual.
- Ids globalmente únicos: supuestos `op1s1`, `op1s2`, `op6s1`…, integrador `opsint`; logro `sup-first-exam`.
- Nota: 0–10 con un decimal; aprobado ≥ 5. XP práctico: 60 en práctica, 120 en simulacro, ×2 el integrador; solo la primera vez que se aprueba cada supuesto en cada modo.
- Persist del store pasa a **versión 4**; `SYNC_SCHEMA` pasa a **2**. El progreso v3 y los blobs v1 se leen sin pérdida.
- Ningún texto nombra una convocatoria real ni dice que alguien se presenta.
- Hechos técnicos solo de estándares (RFC, IEEE 802) o de las lecciones `op1m1`–`op1m5`; lo que dependa del fabricante se dice.
- No romper ids, recompensas ni tests existentes. `npm test` y `npm run build` en verde al final de cada tarea.
- Commits con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Sin merge (lo pide Lidia).

## Review Focus

1. **Recargar o cerrar a mitad de simulacro:** las respuestas siguen ahí y el reloj no se para; si el tiempo se agotó con la pestaña cerrada, al volver se entrega lo que había. (Tests en Task 3 y Task 8.)
2. **Sincronización con datos antiguos:** un blob v1 sin `practical`/`supuestos` se fusiona sin `NaN` ni `undefined`; un cliente viejo que recibe un blob v2 lo rechaza en vez de borrarlo al reescribir. (Task 5.)
3. **Respuestas vacías o con coma decimal:** entregar una fase con tareas sin contestar da 0 en esas tareas sin romper nada; `2,5` en una tarea numérica vale como `2.5`. (Task 2.)
4. **Repetir un supuesto ya aprobado:** no vuelve a dar XP práctico; «Resetear progreso» borra notas, premios y cuadernos. (Task 4.)
5. **Cambio de `version` del contenido:** el cuaderno antiguo no se mezcla con el nuevo; datos con referencias rotas fallan en test, no en pantalla. (Task 1 y Task 6.)

---

### Task 1: Tipos y validación de supuestos

**Files:**
- Create: `src/lib/supuesto.ts`
- Test: `src/lib/supuesto.test.ts`

**Interfaces:**
- Produces (exportado desde `src/lib/supuesto.ts`):

```ts
export type SupuestoMode = 'practice' | 'exam';
export interface Ref { label: string; href?: string }            // href '/learn/op1m2' o URL externa
export interface NetNode { id: string; label: string; kind: 'router'|'switch'|'l3switch'|'firewall'|'server'|'pc'|'ap'|'cloud'; x: number; y: number; sub?: string }
export interface NetDiagram { width: number; height: number; nodes: NetNode[]; links: { from: string; to: string; label?: string }[]; zones?: { label: string; x: number; y: number; w: number; h: number }[] }
export interface DossierDoc { id: string; title: string; kind: 'memo'|'email'|'table'|'diagram'|'config'|'log'|'norma'|'acta'; body?: Block[]; diagram?: NetDiagram; unlockedBy?: string }
interface TaskBase { id: string; prompt: string; points: number; explain: string; refs: Ref[]; hint?: { text: string; cost: number }; topic?: string }
export type Task = TaskBase & (
  | { kind: 'choice'; options: { id: string; text: string }[]; answer: string }
  | { kind: 'multi'; options: { id: string; text: string }[]; answer: string[] }
  | { kind: 'numeric'; answer: number; tolerance?: number; unit?: string }
  | { kind: 'table'; fields: { id: string; label: string; options: string[] }[]; rows: { id: string; label: string; answer: Record<string, string> }[] }
  | { kind: 'order'; items: { id: string; text: string }[]; answer: string[] }
  | { kind: 'match'; left: { id: string; text: string }[]; right: { id: string; text: string }[]; answer: Record<string, string> }
  | { kind: 'cite'; answerSets: string[][] }
  | { kind: 'written'; words?: number; model: string; rubric: { id: string; text: string; points: number }[] });
export type Condition = { task: string; is: 'correct' | 'wrong' } | { task: string; chose: string };
export interface Phase { id: string; title: string; context: string; variants?: { when: Condition; context: string; unlocks?: string[] }[]; carry?: string; tasks: Task[] }
export interface Supuesto { id: string; track: TrackId; sectionIds: string[]; version: number; title: string; brief: string; minutes: number; prerequisites: string[]; dossier: DossierDoc[]; phases: Phase[]; sources: Ref[]; integrator?: boolean }
export type SupuestoMeta = Pick<Supuesto, 'id'|'track'|'sectionIds'|'version'|'title'|'brief'|'minutes'|'integrator'>;
export const metaOf: (s: Supuesto) => SupuestoMeta;
export interface ValidationContext { moduleIds: Set<string>; sectionIds: Set<string> }
export function validateSupuesto(s: Supuesto, ctx: ValidationContext): string[]; // [] = válido
```

- [ ] **Step 1: Write the failing test** — `src/lib/supuesto.test.ts` con un fixture mínimo válido (2 fases, un documento con `unlockedBy`, una tarea de cada tipo) y estos casos:

```ts
it('accepts a valid supuesto', () => expect(validateSupuesto(fixture, ctx)).toEqual([]));
it.each([
  ['duplicate task id', (s) => { s.phases[1].tasks[0].id = s.phases[0].tasks[0].id }, /duplicate id/],
  ['choice answer not an option', (s) => { choice(s).answer = 'zz' }, /answer/],
  ['cite to unknown doc', (s) => { cite(s).answerSets = [['nope']] }, /unknown doc/],
  ['unlockedBy unknown phase', (s) => { s.dossier[1].unlockedBy = 'p9' }, /unknown phase/],
  ['variant looks at a later phase', (s) => { s.phases[0].variants = [{ when: { task: s.phases[1].tasks[0].id, is: 'correct' }, context: 'x' }] }, /earlier phase/],
  ['rubric points ≠ task points', (s) => { written(s).points = 99 }, /rubric/],
  ['ref to missing lesson', (s) => { s.phases[0].tasks[0].refs = [{ label: 'x', href: '/learn/op9m9' }] }, /lesson/],
  ['unknown section', (s) => { s.sectionIds = ['op9'] }, /section/],
  ['hint cost > points', (s) => { s.phases[0].tasks[0].hint = { text: 'h', cost: 999 } }, /hint/],
])('rejects %s', (_n, mutate, re) => { const s = structuredClone(fixture); mutate(s); expect(validateSupuesto(s, ctx).join('\n')).toMatch(re) });
```

Además: `minutes > 0`, 4–6 fases no se exige aquí (lo exige el test de contenido), `table` con respuesta fuera de `options`, `order`/`match` con ids que no cuadran, `multi` con respuesta vacía.

- [ ] **Step 2:** `npm test -- src/lib/supuesto.test.ts` → FAIL (módulo inexistente).
- [ ] **Step 3:** Implementar tipos, `metaOf` y `validateSupuesto` (mensajes en inglés, prefijo `<supuestoId>: `). `Block` se importa de `./types`.
- [ ] **Step 4:** El mismo comando → PASS.
- [ ] **Step 5:** Commit `feat(supuestos): tipos y validación`.

---

### Task 2: Corrección, ramas y nota

**Files:**
- Create: `src/lib/supuestoGrade.ts`
- Test: `src/lib/supuestoGrade.test.ts`

**Interfaces:**
- Consumes: tipos de Task 1.
- Produces:

```ts
export type TaskAnswer = string | string[] | number | Record<string, string> | undefined;
export interface TaskOutcome { earned: number; max: number; correct: boolean }
export function parseNumber(raw: string): number | undefined;            // '2,5' → 2.5, '' → undefined, '1.024' sin ambigüedad → 1.024
export function gradeTask(task: Task, answer: TaskAnswer, selfChecked?: string[]): TaskOutcome;
export interface SupuestoRun {
  mode: SupuestoMode; startedAt: string; finishedAt?: string;
  phaseIndex: number; submitted: string[];                   // ids de fase entregadas, en orden
  answers: Record<string, TaskAnswer>; hints: string[];      // taskIds con pista vista
  self: Record<string, string[]>;                            // taskId(written) → ids de criterios marcados
  selfDone: boolean; recorded: boolean;                      // autoevaluación cerrada / resultado enviado al store
}
export function freshRun(mode: SupuestoMode, now: Date): SupuestoRun;
export function resolvePhase(phase: Phase, s: Supuesto, run: SupuestoRun): { context: string; unlocks: string[] };
export function visibleDocs(s: Supuesto, run: SupuestoRun): DossierDoc[];
export interface Score { earned: number; max: number; autoEarned: number; autoMax: number; hintCost: number; grade: number; autoGrade: number; passed: boolean;
  byPhase: { id: string; title: string; earned: number; max: number }[]; byTopic: { topic: string; earned: number; max: number }[]; review: Ref[] }
export function scoreRun(s: Supuesto, run: SupuestoRun): Score;
```

Reglas fijadas (van como tests):
- `choice`/`numeric`: todo o nada; `numeric` acepta `|v − answer| ≤ (tolerance ?? 0)`; respuesta `string` se pasa por `parseNumber`.
- `multi`: `max(0, aciertos − marcas erróneas) / answer.length × points`.
- `table`, `order`, `match`: fracción de celdas, posiciones o parejas correctas × points.
- `cite`: points si la selección contiene entera alguna de `answerSets` y nada fuera de la unión de todas; si no, 0.
- `written`: suma de `rubric[i].points` marcados en `selfChecked`; sin autoevaluar, 0.
- Redondeo a 2 decimales en `earned`; `correct = earned === max`.
- `resolvePhase`: la primera variante cuya condición se cumple sustituye el contexto y añade sus `unlocks`; `chose` compara con la respuesta de un `choice`. `carry` de la fase anterior **no** va aquí: lo muestra la UI.
- `visibleDocs`: sin `unlockedBy`, o con `unlockedBy` en `run.submitted`, o en los `unlocks` de una fase ya mostrada (índice ≤ `phaseIndex`).
- `scoreRun`: `grade = round1(clamp(0, (earned − hintCost) / max × 10))`; `autoGrade` igual con solo tareas no `written`; `hintCost` = suma de `hint.cost` de `run.hints`; `byTopic` usa `task.topic ?? s.sectionIds[0]`; `review` = `refs` con `href` que empiece por `/learn/` de tareas no correctas, sin duplicados.

- [ ] **Step 1: Write the failing tests** — uno por regla anterior, con cifras concretas, p. ej.:

```ts
expect(gradeTask(multi4, ['a','b','x'])).toEqual({ earned: 1.25, max: 5, correct: false }); // answer [a,b,c,d], 5 pts: (2−1)/4×5
expect(gradeTask(numeric, '2,5')).toMatchObject({ correct: true });                       // answer 2.5
expect(gradeTask(numeric, undefined)).toEqual({ earned: 0, max: 2, correct: false });
expect(gradeTask(cite, ['d1','d2','d9'])).toMatchObject({ earned: 0 });                   // d9 fuera de la unión
expect(scoreRun(fixture, runWithHint).grade).toBe(6.7);
```

- [ ] **Step 2:** `npm test -- src/lib/supuestoGrade.test.ts` → FAIL.
- [ ] **Step 3:** Implementar en `src/lib/supuestoGrade.ts`.
- [ ] **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat(supuestos): corrección y nota`.

---

### Task 3: Reloj del simulacro e informe

**Files:**
- Create: `src/lib/supuestoClock.ts`, `src/lib/supuestoReport.ts`
- Test: `src/lib/supuestoClock.test.ts`, `src/lib/supuestoReport.test.ts`

**Interfaces:**
- Consumes: `SupuestoRun`, `Score`, `scoreRun` (Task 2).
- Produces:

```ts
export function remainingMs(startedAt: string, minutes: number, now: number): number; // ≥ 0
export function isExpired(run: SupuestoRun, minutes: number, now: number): boolean;   // solo modo 'exam' y sin finishedAt
export function formatClock(ms: number): string;                                      // '1:05:09', '38:12', '0:07'
export function expireRun(s: Supuesto, run: SupuestoRun, now: Date): SupuestoRun;     // marca todas las fases como entregadas, phaseIndex = última, finishedAt = startedAt + minutes
export function buildReport(s: Supuesto, run: SupuestoRun, score: Score): string;    // Markdown
export function reportFilename(s: Supuesto, run: SupuestoRun): string;               // 'supuesto-op1s1-simulacro-2026-11-26.md'
```

- [ ] **Step 1: Failing tests** — `remainingMs` a 0 al pasarse; `isExpired` falso en práctica; `expireRun` con la pestaña «cerrada» 2 h y `minutes: 60` deja `finishedAt` en `startedAt + 60 min` y conserva las respuestas; `buildReport` contiene título, modo («Simulacro»/«Práctica»), `grade` con coma decimal (`6,7 / 10`), cada `prompt`, la respuesta dada (o «sin responder»), la correcta, `model` de las `written`, y la lista de repaso.
- [ ] **Step 2:** FAIL. **Step 3:** implementar. **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat(supuestos): reloj del simulacro e informe`.

---

### Task 4: XP práctico y notas en el store (persist v4)

**Files:**
- Modify: `src/lib/types.ts` (`ProgressSnapshot`), `src/lib/store.ts` (estado inicial, `migrateProgress`, acción, `partialize`, versión), `src/lib/xp.ts`
- Test: el test de store existente (`src/lib/store.test.ts` o el que contenga los tests de `migrateProgress`; si no hay, crear `src/lib/store.test.ts`)

**Interfaces:**
- Consumes: `SupuestoMode`, `SupuestoMeta` (Task 1).
- Produces:

```ts
// types.ts
export interface SupuestoBest { grade: number; auto: number; at: string; version: number }
// ProgressSnapshot gana:
practical: Record<string, number>;                                   // '<id>:<mode>' → XP práctico concedido
supuestos: Record<string, { practice?: SupuestoBest; exam?: SupuestoBest }>;
// xp.ts
export const SUPUESTO_XP: Record<SupuestoMode, number> = { practice: 60, exam: 120 };
export function supuestoXp(meta: Pick<SupuestoMeta, 'integrator'>, mode: SupuestoMode): number; // ×2 si integrator
export function practicalTotal(p: Record<string, number> | undefined): number;
// store.ts
finishSupuesto: (meta: SupuestoMeta, mode: SupuestoMode, r: { grade: number; auto: number }) => number; // XP práctico concedido (0 si nada)
```

Comportamiento: guarda la mejor `SupuestoBest` del modo (más `grade`; empate → más `auto`); si `grade ≥ 5` y la clave `<id>:<mode>` no está en `practical`, la añade con `supuestoXp`, suma 1 a `day.labs` (cuenta para la misión diaria de labs) y lanza el toast `{ kind: 'info', icon: '🛠️', title: '+N XP práctico', sub: 'Supuesto aprobado' }`; siempre llama a `_check()`. No toca `xp` ni la racha. `resetAll` vacía los dos campos (ya lo hace `initialState`). `migrateProgress`: `if (version < 4) p = { ...p, practical: p.practical ?? {}, supuestos: p.supuestos ?? {} }`. Actualizar el comentario de migraciones.

- [ ] **Step 1: Failing tests:** migración v3 → v4 añade `{}`; `finishSupuesto` con 4,9 no da XP pero guarda la nota; con 7,2 da 120 en simulacro y devuelve 120; repetir con 9 devuelve 0 y la mejor nota pasa a 9; práctica y simulacro son claves distintas; integrador da 240; `xp` no cambia; `resetAll` deja ambos vacíos.
- [ ] **Step 2:** FAIL. **Step 3:** implementar. **Step 4:** PASS (y el resto de la suite).
- [ ] **Step 5:** Commit `feat(store): XP práctico y notas de supuestos (persist v4)`.

---

### Task 5: Sincronización de los campos nuevos

**Files:**
- Modify: `src/lib/sync.ts` (`emptySnapshot`, `mergeProgress`, `SYNC_SCHEMA`, `pull`), `src/lib/useSync.ts` (`snapshot()`)
- Test: `src/lib/sync.test.ts`

**Interfaces:**
- Consumes: campos de Task 4.
- Produces: `mergeSupuestos(a, b)` interno; `SYNC_SCHEMA = 2`.

Reglas: `practical: maxNumbers(a.practical ?? {}, b.practical ?? {})`; `supuestos`: por id y modo, gana la de más `grade`, luego más `auto`, luego `at` mayor (determinista → conmutativo). `pull` acepta `v ≤ 2` y rellena `practical`/`supuestos` con `{}` si faltan (blob v1). Con `SYNC_SCHEMA = 2`, un cliente antiguo (que acepta `v ≤ 1`) lanza «versión desconocida» y no reescribe el blob: es la protección buscada; dejarlo explicado en el comentario de `pull`.

- [ ] **Step 1: Failing tests:** conmutatividad e idempotencia de `mergeProgress` con los campos nuevos (siguiendo el estilo de los tests existentes); fusión con un snapshot sin los campos (como un blob v1) da objetos, no `undefined`, y ningún `NaN`; `pull` de `{ v: 1, data: <sin campos> }` devuelve campos vacíos; `pull` de `{ v: 3 }` lanza; `snapshot()` de `useSync` incluye los dos campos (test de `stableStringify` o de la función si es exportable; si no lo es, exportarla).
- [ ] **Step 2:** FAIL. **Step 3:** implementar. **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat(sync): sincronizar XP práctico y notas de supuestos (esquema 2)`.

---

### Task 6: Registro de supuestos, carga diferida y logro

**Files:**
- Modify: `src/data/tracks.ts` (`TrackMeta.supuestos: SupuestoMeta[]`, vacío en `gcti` y `secplus`), el tipo `TrackMeta` donde viva, `src/data/achievements.ts`, `src/data/course.ts` (helper)
- Create: `src/data/supuestos/index.ts`, `src/data/supuestos/supuestos.test.ts`, `src/data/opo/supuestos/op1s1.ts` (esqueleto válido mínimo: 4 fases de una tarea; el contenido real llega en Task 10)
- Test: `src/data/supuestos/supuestos.test.ts`, test de logros existente

**Interfaces:**
- Consumes: Task 1, Task 4.
- Produces:

```ts
// src/data/supuestos/index.ts
export function loadSupuesto(id: string): Promise<Supuesto | undefined>;      // import() por id
export const SUPUESTO_IDS: readonly string[];
// src/data/course.ts
export function supuestosOf(sectionId: string): SupuestoMeta[];                // de su pista; el integrador no aparece aquí
export function supuestoMetaById(id: string): SupuestoMeta | undefined;
```

`TRACKS.opo.supuestos = [metaOf(...)]` no puede importar los datos (rompería la carga diferida): la entrada de metadatos se escribe a mano en `src/data/opo/supuestos/meta.ts` y el test comprueba que coincide con `metaOf(await loadSupuesto(id))`.

Logro: `{ id: 'sup-first-exam', icon: '🗂️', title: 'Primer supuesto en simulacro', desc: 'Aprueba un supuesto práctico en modo simulacro', xp: 50, test: (s) => Object.values(s.supuestos ?? {}).some((b) => (b.exam?.grade ?? 0) >= 5) }`.

- [ ] **Step 1: Failing tests:** cada id de `SUPUESTO_IDS` carga y pasa `validateSupuesto` con los módulos y secciones reales; metadatos == `metaOf(datos)`; ids únicos frente a módulos, labs, preguntas y secciones; todo `TRACKS[t].supuestos` tiene datos; el logro se cumple con un `exam.grade` de 5 y no con uno de práctica.
- [ ] **Step 2:** FAIL. **Step 3:** implementar. **Step 4:** PASS (incluido el test de recuento de logros, que pasa a 29).
- [ ] **Step 5:** Commit `feat(supuestos): registro por pista, carga diferida y logro`.

---

### Task 7: Componentes de tareas y visor del expediente

**Files:**
- Create: `src/components/supuestos/TaskInput.tsx`, `src/components/supuestos/TaskFeedback.tsx`, `src/components/supuestos/Dossier.tsx`, `src/components/supuestos/NetDiagramView.tsx`
- Test: `src/components/supuestos/netDiagram.test.ts` (solo la función pura de geometría, si se extrae)

**Interfaces:**
- Consumes: tipos (Task 1), `gradeTask`/`TaskAnswer`/`parseNumber` (Task 2), `BlockRenderer`, `md`, `labInput`/`labButton`.
- Produces:

```tsx
<TaskInput task={Task} value={TaskAnswer} onChange={(v: TaskAnswer) => void} docs={DossierDoc[]} disabled={boolean} />
<TaskFeedback task={Task} answer={TaskAnswer} outcome={TaskOutcome} />          // correcto/incorrecto, respuesta correcta, explain, refs como enlaces
<Dossier docs={DossierDoc[]} newIds={string[]} />                              // lista + documento abierto; marca «nuevo»
<NetDiagramView diagram={NetDiagram} title={string} />                         // SVG role="img" + <details> con nodos y enlaces en texto
```

Decisiones fijadas: `numeric` es `<input inputMode="decimal">` que guarda el texto crudo y se corrige con `parseNumber`; `order` se reordena con botones ↑/↓ (accesible con teclado), no arrastrar; `match` y `table` con `<select>`; `cite` con casillas que muestran el título del documento; `written` es `<textarea>` con contador de palabras y el límite orientativo. Todo etiquetado (`<label>`/`aria-*`), como los labs actuales. Iconos de documento por `kind`: memo 📄, email ✉️, table 📊, diagram 🗺️, config ⚙️, log 📜, norma ⚖️, acta 🗒️.

- [ ] **Step 1:** Implementar los componentes.
- [ ] **Step 2:** `npm run build` → sin errores de tipos.
- [ ] **Step 3:** Commit `feat(supuestos): entradas de tarea, expediente y esquema de red`.

---

### Task 8: Página del supuesto (modos, fases, autoevaluación, resultado)

**Files:**
- Create: `src/pages/SupuestoPage.tsx`, `src/components/supuestos/SupuestoResult.tsx`, `src/components/supuestos/SelfAssessment.tsx`
- Modify: `src/App.tsx` (ruta `/supuesto/:id` con `React.lazy` y un límite de error como `ChallengeBoundary` de `LabPage`), `src/index.css` (reglas `@media print` para el informe)
- Test: `src/lib/supuestoFlow.test.ts` para la lógica de transición extraída a `src/lib/supuestoFlow.ts`

**Interfaces:**
- Consumes: Tasks 1–7; `LabWorkspaceProvider`, `useLabState`; `useStore().finishSupuesto`; `useSyncTrack(sectionIds[0])`.
- Produces (`src/lib/supuestoFlow.ts`, puro):

```ts
export function submitPhase(s: Supuesto, run: SupuestoRun): SupuestoRun;   // añade la fase a submitted; avanza phaseIndex o pone finishedAt al entregar la última
export function useHint(run: SupuestoRun, taskId: string): SupuestoRun;     // ignorado en modo 'exam'
export function needsSelfAssessment(s: Supuesto, run: SupuestoRun): boolean; // hay 'written' y !selfDone
export const workspaceIdentity: (s: SupuestoMeta, mode: SupuestoMode) => string; // `supuesto/${id}/${mode}/v${version}`
```

Flujo de la página:
1. Cabecera (volver a la sección, título, minutos, XP práctico posible, mejores notas guardadas), `brief`, repaso previo (`prerequisites` como enlaces).
2. Selector de modo. Empezar crea `freshRun(mode, new Date())` dentro de `LabWorkspaceProvider` con `workspaceIdentity`; un cuaderno a medias ofrece «Continuar» o «Empezar de nuevo» (este último usa `restart()` de la sesión).
3. Dos columnas en `md:` (expediente | fase); en móvil, pestañas «Expediente» y «Fase» con contador de documentos nuevos. Al empezar una fase se muestra el `carry` de la anterior en un aviso y el contexto de `resolvePhase`.
4. Práctica: «Entregar fase» bloquea las respuestas y muestra `TaskFeedback`; pistas con su coste visible. Simulacro: reloj fijo arriba (`formatClock`, se actualiza cada segundo), sin pistas ni corrección, aviso a los 10 y 1 minutos (región `aria-live`), y al montar o cada tic, si `isExpired`, aplica `expireRun`.
5. Al terminar: `SelfAssessment` (por cada `written`, la respuesta propia al lado de `model` y casillas de la rúbrica) → `selfDone`.
6. `SupuestoResult`: nota, nota automática, aprobado/suspenso, desglose por fase y por tema, repaso, «Imprimir» (`window.print`), «Descargar informe» (`downloadLabFile(reportFilename, buildReport, 'text/markdown;charset=utf-8')`), «Repetir». La primera vez que se muestra con `recorded === false` llama a `finishSupuesto(meta, mode, { grade, auto: autoGrade })` y pone `recorded = true`; si concede XP, lo dice.

- [ ] **Step 1: Failing tests** de `supuestoFlow`: entregar la última fase pone `finishedAt`; no se puede entregar dos veces la misma fase; `useHint` no cambia nada en simulacro; `needsSelfAssessment` falso sin `written`; la identidad cambia con `version`.
- [ ] **Step 2:** FAIL. **Step 3:** implementar `supuestoFlow.ts` y la página. **Step 4:** PASS y `npm run build`.
- [ ] **Step 5:** Verificar en el navegador con la entrada temporal de `launch.json` para worktrees (ver CLAUDE.md, V6): recorrer `op1s1` (esqueleto) en los dos modos, recargar a mitad de simulacro y comprobar respuestas y reloj, móvil (`resize_window` mobile), impresión (vista previa de impresión no hace falta: comprobar que `@media print` oculta la navegación con `javascript_tool`). Restaurar `launch.json`.
- [ ] **Step 6:** Commit `feat(supuestos): página con modos práctica y simulacro`.

---

### Task 9: Integración en sección, panel, perfil y página de la pista

**Files:**
- Create: `src/pages/SupuestosPage.tsx` (ruta `/supuestos`)
- Modify: `src/App.tsx`, `src/pages/SectionPage.tsx` (lista tras los labs), `src/pages/Dashboard.tsx`, `src/pages/ProfilePage.tsx`, `src/components/Layout.tsx` (enlace «Supuestos» solo si `useTrack().supuestos.length > 0`)

**Interfaces:**
- Consumes: `supuestosOf`, `TRACKS[t].supuestos`, `practicalTotal`, `s.supuestos`, `supuestoXp`.

Contenido fijado:
- Tarjeta de supuesto (componente compartido `SupuestoCard` en `src/components/supuestos/`): título, minutos, «Simulacro: 7,2 · Práctica: 8,5» (o «sin hacer»), XP práctico ganado / posible.
- `SectionPage`: bloque «🗂️ Supuestos prácticos» tras «🧪 Labs», con las tarjetas del bloque.
- `/supuestos`: los de la pista activa agrupados por sección, y el integrador al final si existe.
- Panel: junto al nivel, «🛠️ N XP práctico»; si la pista tiene supuestos, una tarjeta que enlaza a `/supuestos` con cuántos están aprobados en simulacro.
- Perfil: total de XP práctico y una tabla de supuestos (mejor nota por modo y fecha).

- [ ] **Step 1:** Implementar.
- [ ] **Step 2:** `npm test` y `npm run build` en verde.
- [ ] **Step 3:** Verificar en el navegador (misma técnica que Task 8): la tarjeta aparece en `op1`, el XP práctico sube tras aprobar el esqueleto en simulacro, no aparece en GCTI ni Security+.
- [ ] **Step 4:** Commit `feat(supuestos): integración en sección, panel, perfil y /supuestos`.

---

### Task 10: Contenido del piloto `op1s1` y revisión de exactitud

**Files:**
- Modify: `src/data/opo/supuestos/op1s1.ts`, `src/data/opo/supuestos/meta.ts`
- Modify: `src/data/opo/opo.test.ts` (requisitos de contenido de supuestos de la pista)

Contenido: **«La oficina comarcal nueva»**. El Consorcio Provincial de Arcedo abre o reforma una oficina y hay que diseñar y poner en marcha su red. Lee antes `src/data/opo/op1-m1.ts`…`op1-m5.ts` y `docs/superpowers/canon/arcedo.md` (direccionamiento 10.20.0.0/16, nombres de sedes, contradicciones abiertas: no las resuelvas, evítalas). `minutes: 60`, `version: 1`, `sectionIds: ['op1']`, `prerequisites` = las cinco lecciones.

- Expediente (6–8 documentos): memorando de la gerencia con las necesidades (puestos, VLAN de voz, invitados, impresoras, cámaras), inventario de equipos, esquema de red (`diagram`), extracto de configuración de un conmutador, salida de una tabla de rutas, un correo de la operadora con el enlace WAN; un documento aparece con `unlockedBy` en la fase 3 y otro en la 4.
- Fases (5): 1 direccionamiento VLSM desde un bloque /24 (`numeric` + `table`); 2 VLAN y troncal 802.1Q, VLAN nativa (`table`, `choice`, `cite`); 3 encaminamiento entre VLAN, puerta de enlace redundante y ruta por defecto / estática flotante (`choice`, `order`, `multi`); 4 diagnóstico de una incidencia leyendo configuración y tabla de rutas (`cite`, `multi`, `numeric`), con **una** rama por respuesta de la fase 3 que converge; 5 informe breve a la gerencia (`written`, 120–180 palabras, rúbrica de 4–5 criterios).
- 14–20 tareas, ~100 puntos en total, al menos una de cada tipo menos `match` si no encaja; cada `explain` dice por qué acierta la correcta y por qué tienta el distractor; cada tarea con `refs` a la lección (`/learn/op1mN`) o al estándar (RFC/IEEE). `carry` en las fases 1–4.

- [ ] **Step 1:** Añadir a `opo.test.ts`: cada supuesto de bloque tiene 4–6 fases, ≥ 12 tareas, ≥ 1 `written`, ≥ 1 `cite`, un documento con `unlockedBy`, y `refs` en todas las tareas. → FAIL con el esqueleto.
- [ ] **Step 2:** Escribir el contenido. → PASS; `npm run build`.
- [ ] **Step 3:** Despachar un **revisor de exactitud de solo lectura** (subagente nuevo) con `op1s1.ts`, las cinco lecciones y `arcedo.md`: cálculos de subredes, rangos, campos 802.1Q, estados y valores citados, coherencia con el escenario, que cada respuesta sea la única defendible. Aplicar sus correcciones y **revisar el diff de las correcciones** (memoria: los arreglos también introducen errores).
- [ ] **Step 4:** Recorrer el supuesto completo en el navegador en los dos modos.
- [ ] **Step 5:** Commit `feat(opo): supuesto piloto op1s1 «La oficina comarcal nueva»`.

---

### Task 11: Prueba de navegador y documentación

**Files:**
- Modify: `scripts/test-lab-browser.mjs` (recorrido de `op1s1` en práctica con respuestas correctas → nota 10; y simulacro con recarga a mitad), `CLAUDE.md` (sección de supuestos, persist v4, `SYNC_SCHEMA` 2, 29 logros, número de tests), `README.md` (función nueva), `docs/laboratories.md` (enlace)
- Create: `docs/supuestos.md` (cómo escribir un supuesto: tipos de tarea, arrastre, ramas, reglas de exactitud, checklist de revisión)

- [ ] **Step 1:** Ampliar el script; ejecutarlo contra el servidor de la worktree (`LAB_TEST_URL`). Esperado: todo en verde.
- [ ] **Step 2:** Escribir la documentación.
- [ ] **Step 3:** `npm test` y `npm run build` finales. Commit `docs(supuestos): guía de autoría y prueba de navegador`.
- [ ] **Step 4:** Revisión final de toda la rama por un revisor nuevo; aplicar lo que encuentre; push de la rama y PR (sin merge: se lo pregunto a Lidia).
