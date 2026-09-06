# Placement test with section exemption — design

Date: 2026-09-05 · Status: approved in chat by Lidia · Path: architectural

## Goal

Let a learner who already knows part of the material prove it and skip it. A **placement test**
(«prueba de nivel») is split into one **block per exam domain**. Passing a block lets the learner
**exempt** («convalidar») that section's theory — its lessons and their quizzes count as done for
progress and mastery, without having been studied.

The feature is built at engine level, so both tracks (`gcti`, `secplus`) get it from the same code.

## Decisions taken in brainstorming

1. **Exemption, not advice.** Passing marks content as convalidated — it counts towards progress,
   stays accessible for review, and can be revoked.
2. **Granularity: one block per domain.** Five blocks per track, taken back to back or one at a
   time. Passing a block exempts that whole section.
3. **Dedicated question bank.** Placement questions are new content, never sampled from the lesson
   quizzes, so lesson quizzes / bosses / the mock exam keep measuring cleanly.
4. **Scope of exemption: theory only.** Lessons and their quizzes are exempted. **Labs and the boss
   are not** — the learner still plays the campaign and unlocks its dossier fragments.

## Non-goals

- No per-lesson granularity. The unit of exemption is the section.
- No adaptive or item-response scoring. A block is a fixed set of 12 questions, scored flat.
- No hiding or collapsing of exempted content. It stays visible and reviewable, just marked.
- Labs, bosses and the campaign are never auto-completed.
- No time limit on placement blocks. This measures knowledge, not speed; the timed formats are the
  boss and the mock exam.
- No new nav entry in `Layout`. Entry points are the Dashboard and Profile.

## Content

### Shape

`TrackMeta` gains `placement: PlacementBlock[]` — exactly one block per content section, in section
order. Both tracks have five such sections today (`sp1`–`sp5` and `s1`–`s5`); the sixth section of
each (`sp6`, `s6`) is exam prep, carries no boss and no domain, and gets no block.

Each block holds **12 questions**, scenario-based and at synthesis level: harder than the lesson
quizzes, because exempting a whole section should cost something. Questions and explanations are in
**English**, like every other `Question` in the repo; block titles and all UI chrome are Spanish.

Per track: 5 blocks × 12 = **60 questions**. Both tracks: **120 new questions**.

### Ids

New global prefix `pl-`, which cannot collide with the existing `s*` / `sp*` / `fc*` / `lab*` /
`spl*` families:

- Block: `pl-sp1` … `pl-sp5` (Security+), `pl-s1` … `pl-s5` (GCTI).
- Question: `pl-sp1q1` … `pl-sp1q12`.

Blocks map to the sections that carry a domain and a boss — `contentSections(track)`.

### Files

- `src/data/secplus/placement-sp1.ts` … `placement-sp5.ts`, each exporting one `PlacementBlock`.
- `src/data/secplus/placement.ts` — aggregator, `SP_PLACEMENT: PlacementBlock[]`.
- `src/data/placement-gcti-s1.ts` … `placement-gcti-s5.ts`, each exporting one `PlacementBlock`,
  and `src/data/placement-gcti.ts` — aggregator, `GCTI_PLACEMENT: PlacementBlock[]`. (Shipped as
  six files rather than the single one planned here, mirroring the Security+ layout so each block
  could be authored independently.)
- Both wired into `TRACKS` in `src/data/tracks.ts`.

### Disjointness rule

No placement question may reuse a lesson question. Enforced by a test comparing normalized prompts
(lowercased, whitespace-collapsed) across `ALL_QUESTIONS` and every placement block — the
intersection must be empty.

## Types (`src/lib/types.ts`)

```ts
export interface PlacementBlock {
  id: string;            // "pl-sp1"
  sectionId: string;     // "sp1"
  domain: Domain;
  title: string;         // Spanish, shown on the block card
  blurb: string;         // Spanish, one line describing what it covers
  questions: Question[]; // exactly 12
}

export type ExemptStatus = 'exempt' | 'revoked';

/** One module exempted (or un-exempted) by a placement block. */
export interface ExemptEntry {
  status: ExemptStatus;
  at: string;    // ISO timestamp — drives merge, see sync
  via: string;   // placement block id that granted it
  score: number; // block percentage at grant time, 0-100
}

export interface PlacementResult {
  date: string;  // ISO timestamp
  track: TrackId;
  blockId: string;
  sectionId: string;
  correct: number;
  total: number;
  pct: number;
  passed: boolean;
}
```

`ProgressSnapshot` gains two fields:

```ts
exempt: Record<string, ExemptEntry>; // moduleId -> entry
placement: PlacementResult[];        // full attempt history
```

`TrackMeta` (`src/data/tracks.ts`) gains `placement: PlacementBlock[]`.

## Rules (`src/lib/placement.ts`, new)

A small pure module, no React and no store imports, so it is trivially testable:

```ts
export const PLACEMENT_PASS_PCT = 80;  // 10 of 12, same bar as quiz pass and boss
export const PLACEMENT_BLOCK_N = 12;

export function exemptActive(s: Pick<ProgressSnapshot, 'exempt'>, moduleId: string): boolean;
export function exemptScore(s: Pick<ProgressSnapshot, 'exempt'>, moduleId: string): number | null;
export function isDone(s: Pick<ProgressSnapshot, 'lessons' | 'exempt'>, moduleId: string): boolean;
```

`exemptActive` is `entry !== undefined && entry.status === 'exempt'`. A `revoked` entry reads
exactly like no entry at all; it exists only so revocation can win a merge.

**Studied beats convalidated.** A module can hold both `lessons[id] === true` and an active
exemption — the learner exempted the section and later read the lesson anyway. Wherever the two
meet, "studied" wins: the UI shows the emerald ✓, not the convalidated chip. `exemptScore` still
feeds `quizPct` (it is a `Math.max`, so it can only help), and nothing is rewritten on the way in.

Section-level helpers take the module list as an argument, keeping this file free of content
imports:

```ts
export function sectionExempt(s, moduleIds: string[]): boolean;          // any actively exempt
export function sectionExemptScore(s, moduleIds: string[]): number | null; // most recent entry's score
```

`sectionExemptScore` reads the `score` of the active entry with the latest `at`, which is what the
«Sección convalidada · 92%» band displays.

Lookups that need the content registry live in `src/data/course.ts` instead, next to the other
track-scoped helpers:

```ts
export const placementBlocks = (track: TrackId) => TRACKS[track].placement;
export const placementBlockById = (id: string) => …;  // across both tracks
```

## Store (`src/lib/store.ts`)

### Actions

**`finishPlacement(blockId, correct, total)`** — records the attempt. Computes
`pct = Math.round((correct / total) * 100)` and `passed = pct >= PLACEMENT_PASS_PCT`, appends a
`PlacementResult`, and — if this is the first result for that track — awards `XP.placement` (50)
once. **It does not grant any exemption.** Taking the test and cashing it in are separate steps.

**`grantExemption(blockId)`** — called from the result screen's confirm button. Guard: the most
recent `PlacementResult` for `blockId` must exist and be `passed`; otherwise it is a no-op. Writes
an `ExemptEntry` (`status: 'exempt'`, `at: now`, `via: blockId`, `score: that pct`) for every module
of the block's section **that is not already in `lessons`** — a lesson genuinely studied is never
relabelled as convalidated. Awards no XP.

Because of that filter, a section whose lessons are *all* already studied has nothing to exempt. The
UI must not offer a button that would silently do nothing: the result screen shows «Ya has estudiado
esta sección entera» in place of the confirm button, and the block list shows it as passed rather
than as exemptable.

**`revokeExemption(sectionId)`** — for every module of that section holding an active entry, writes
`status: 'revoked'` with `at: now`, keeping `via` and `score`. The entry is a tombstone, never
deleted, so revocation survives a sync round trip.

### XP and achievements

Exempting grants **no lesson XP**. Skipping the course must not become the fast way to level up.
What it does grant:

- `XP.placement = 50`, once per track, for completing a first placement block.
- Two achievements (ids in a new `pl-*` family, added to `src/data/achievements.ts`):
  - `pl-tested` 🎯 «Autoevaluado» — complete any placement block. +25 XP.
  - `pl-shortcut` ⏩ «Atajo ganado» — hold active exemptions in 3 different sections. +100 XP.

The very first block of the first track therefore pays 75 XP (50 + the `pl-tested` unlock); that
stacking is intended. The ceiling for exempting everything is 50 + 50 + 125 = 275 XP across both
tracks, against roughly 68 lessons' worth of XP for studying them — skipping stays far slower than
working, which is the property that matters.

Placement answers count in `totals.questions` / `totals.correct` (they are real retrieval practice)
but **not** in `calibration`: with no confidence betting there is nothing to calibrate. This needs a
dedicated code path rather than `recordAnswer`, which always touches calibration.

### Persistence

`persist` version **2 → 3**. `migrateProgress` becomes cumulative rather than early-returning, so a
v1 blob passes through both steps:

```ts
let out = { ...p };
if (version < 2) out = { ...out, track: 'gcti', exams: … };
if (version < 3) out = { ...out, exempt: out.exempt ?? {}, placement: out.placement ?? [] };
return out;
```

`partialize` gains `exempt` and `placement`.

## Reading progress (`src/data/course.ts`)

`sectionMastery` keeps its 40/30/15/15 weighting; only what counts as "done" changes:

- **lessonPct** counts modules where `isDone(s, m.id)` — studied or actively exempt.
- **quizPct** uses `Math.max(s.quizBest[m.id] ?? 0, exemptScore(s, m.id) ?? 0)`. An exempted quiz is
  credited with **the real percentage scored on the placement block**, not 100. Honest, and it keeps
  a section that was exempted at 83% visibly short of full mastery.
- **labPct** and **bossPct** are untouched. Exempting theory leaves the labs and the boss pending,
  which is the point.

`nextModule` skips exempted modules, so the Dashboard's "continue" call to action lands on the first
thing the learner actually needs. `examReadiness` needs no change — it is a mean of section
masteries and inherits the new behaviour.

The `Prog` type alias in `course.ts` widens to include `exempt`; `nextModule`'s parameter widens from
`Pick<ProgressSnapshot, 'lessons'>` to also include `exempt`. Every caller passes the whole store, so
only the existing unit tests that build partial fixtures need updating.

## Sync (`src/lib/sync.ts`)

### The property change

`mergeProgress` is documented today as commutative, idempotent **and monotonic** — "no counter
decreases and no completed work is lost". A revocable exemption is not monotonic: revoking on the
laptop must not be resurrected by the phone.

The new contract, to be written into that doc comment: **commutative and idempotent, and monotonic
for every field except `exempt`, where the most recent decision wins.** Order of sync still never
matters, and re-syncing still changes nothing.

### `mergeExempt(a, b)`

Per key present in either side; when both sides have an entry, a total, content-decided order picks
the winner:

1. Later `at` wins.
2. Same `at` → `revoked` wins over `exempt` (safe direction: a stale device cannot re-grant).
3. Same `at` and status → higher `score` wins.
4. Still tied → lexicographically smaller `via` wins.

Total and content-only, which is what keeps the merge commutative.

### `mergePlacement(a, b)`

Same shape as the existing `mergeExams`: dedupe by
`${date}|${blockId}|${pct}|${correct}|${total}`, tie-break on a stable JSON comparison, sort by date
then key.

Both new fields are added to the object returned by `mergeProgress`.

## UI

All new copy is Spanish, matching the rest of the app.

### Routes (`src/App.tsx`)

- `/placement` — block list for the active track.
- `/placement/:blockId` — one block: the test, then its result screen.

### `src/pages/PlacementPage.tsx`

Explains what the test does («no se puntúa como examen; si superas un bloque puedes convalidar la
teoría de esa sección») and lists the five blocks with per-block state, derived entirely from
`placement` and `exempt`:

| State | Shown |
| --- | --- |
| Never attempted | «Sin hacer» + «Empezar» |
| Attempted, failed | «No superado · 58%» + «Reintentar» |
| Passed, not cashed in | «Superado · 92%» + «Convalidar sección» |
| Exempted | «Convalidada · 92%» + «Anular» |

Plus a «Hacer los 5 seguidos» action that chains the blocks, navigating to the next one from each
result screen.

### `src/components/QuizEngine.tsx`

`mode` widens to `'quiz' | 'boss' | 'exam' | 'placement'`. Placement behaves like `exam`: no
confidence betting (`stakes` becomes `mode !== 'exam' && mode !== 'placement'`), no per-question
reveal, no XP per answer. It is untimed, so no timer chrome.

### Result screen (inside `PlacementPage`)

Score, pass/fail against the 80% bar, and a full per-question review with explanations — a failed
block should still teach something. Then an **explicit choice**, never automatic:

- «Convalidar sección N» → `grantExemption(blockId)`
- «Prefiero estudiarla igualmente» → back to the block list, nothing written

### `src/pages/SectionPage.tsx`

When the section is exempt, a band under the mastery ring: «Sección convalidada por prueba de nivel ·
92%» with an «Anular convalidación» button. Each exempted module row shows a `⇥ convalidada` chip in
its own colour (slate/blue), deliberately different from the emerald ✓ of a studied lesson, and its
button reads «Repasar».

### `src/pages/ModulePage.tsx`

A one-line banner on exempted modules: «Convalidada por tu prueba de nivel. Puedes leerla igualmente.»
Reading it normally still calls `completeLesson`, which upgrades it from convalidated to studied.

### `src/pages/Dashboard.tsx`

A banner above the section grid while the active track has no `PlacementResult`: «¿Ya sabes algo de
esto? Haz la prueba de nivel y sáltate lo que ya dominas.» Once any result exists it collapses to a
one-line link, so it never nags. No dismissal flag is stored.

### `src/pages/ProfilePage.tsx`

A permanent panel: placement history per track (date, block, score, pass) and the list of active
exemptions with a revoke button each.

`resetAll` already rebuilds from `initialState()`, so it clears both new fields for free.

## Testing (`npm test`, vitest)

Content (`src/data/content.test.ts`):

- Every track has exactly one placement block per content section, in section order.
- Every block has 12 questions, 4 choices each, `answer` in range, non-empty `explain`.
- Every question's `domain` equals its block's domain.
- All placement ids unique, `pl-` prefixed, and disjoint from all existing ids.
- Normalized prompts disjoint from `ALL_QUESTIONS`.

New `src/lib/placement.test.ts`:

- `exemptActive` is false for a missing entry and for a `revoked` one.
- `isDone` true for studied, true for exempt, false for revoked.
- `sectionExemptScore` returns the score of the latest active entry, and `null` when every entry in
  the section is revoked.

Store (`src/lib/store.test.ts`):

- `migrateProgress` v1 → v3 and v2 → v3 both yield `exempt: {}` and `placement: []`; a v3 blob is
  untouched.
- `finishPlacement` at 10/12 records `passed: true` and grants nothing until `grantExemption`.
- `finishPlacement` at 9/12 records `passed: false`; `grantExemption` after it is a no-op.
- `grantExemption` skips modules already in `lessons`.
- `revokeExemption` leaves tombstones, not deletions.
- First block of a track awards 50 XP; the second does not.

Sync (`src/lib/sync.test.ts`), extending the existing 28:

- `mergeExempt` is commutative and idempotent on every ordering of a fixture pair.
- A revocation newer than a grant wins in both merge directions.
- A grant newer than a revocation re-grants (re-taking the test after revoking works).
- `mergePlacement` dedupes identical attempts and is order-independent.

Course helpers (`src/data/course.test.ts`):

- `sectionMastery` with a fully exempted section at 83% lands below 100 and above the un-exempted
  value.
- `nextModule` skips exempted modules.

## Rollout

**Phase 1 — engine + Security+ content.** Types, `lib/placement.ts`, store actions and migration,
sync merge, `course.ts` reads, all UI, all tests, plus the five Security+ blocks (60 questions).
Usable end to end on the track currently being studied.

**Phase 2 — GCTI content.** The five GCTI blocks (60 questions). No engine changes; the track's
`placement` array simply stops being empty.

Any track whose `placement` is `[]` degrades cleanly: the Dashboard banner and the `/placement` page
report that this track has no placement test yet, and nothing else in the app changes.

For the question writing, both phases follow the recipe already established in `CLAUDE.md` for
Security+ domains: parallel content subagents, one per file, plus one read-only technical accuracy
reviewer.
