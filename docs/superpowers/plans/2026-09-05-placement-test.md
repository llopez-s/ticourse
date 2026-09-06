# Placement Test with Section Exemption — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a learner prove what they already know with a per-domain placement test and exempt («convalidar») that section's theory, so they only study what they actually need.

**Architecture:** A new dedicated question bank (`PlacementBlock`, one per content section) lives in the track registry. A new `exempt` map in the persisted store marks modules as convalidated without touching `lessons`, so "studied" and "convalidated" stay distinguishable and exemption stays revocable. All progress reads go through a single `isDone` helper. The sync merge gains a last-write-wins rule for `exempt` — the one field that is deliberately no longer monotonic.

**Tech Stack:** Vite 7 · React 19 · TypeScript strict · Tailwind 4 · Zustand (`persist`) · react-router-dom 7 (HashRouter) · vitest (node environment)

**Spec:** `docs/superpowers/specs/2026-09-05-placement-test-design.md` — read it before Task 1. Every design decision below is argued there.

## Scope

This plan covers **Phase 1 of the spec: the engine plus the five Security+ placement blocks.** At the end of it the feature works end to end on the `secplus` track. Phase 2 (the five GCTI blocks, 60 more questions) is pure content with zero engine changes and gets its own plan — a track whose `placement` array is empty degrades cleanly by design.

## Global Constraints

- **Node comes from fnm.** In Bash, run `eval "$(fnm env)"` before any `npm` command, or npm will not be on PATH.
- **Harness gotcha:** Bash commands containing backticks fail to parse *before* running. Write files with the Write/Edit tools, never with an inline heredoc containing backticks.
- **TypeScript is strict** and `npm run build` runs `tsc --noEmit` first. A task is not done if the build does not type-check.
- **Ids must stay globally unique** across both tracks. The placement family uses the new prefix `pl-`: blocks `pl-sp1`…`pl-sp5`, questions `pl-sp1q1`…`pl-sp1q12`.
- **Language split:** questions, choices and explanations are **English** (like every existing `Question`); every piece of UI copy is **Spanish**.
- **Pass threshold is 80%** (`PLACEMENT_PASS_PCT`), the same bar as a passed quiz and a defeated boss. Blocks are 12 questions, so 10/12.
- **Exempting grants no lesson XP.** Only `XP.placement` (50, once per track) and the two `pl-*` achievements.
- **Tests run with `npm test`** (`vitest run`, environment `node`, include `src/**/*.test.ts`). `.tsx` files are **not** in the test include glob, so React components are verified by `tsc` plus the Browser pane, not by unit tests.
- **Never sample placement questions from the lesson bank.** The two sets must stay disjoint.

---

### Task 1: Types and the pure placement rules module

**Files:**
- Modify: `src/lib/types.ts` (append new types; extend `ProgressSnapshot`)
- Create: `src/lib/placement.ts`
- Create: `src/lib/placement.test.ts`
- Modify: `src/lib/store.ts:82-112` (`initialState`)
- Modify: `src/lib/sync.ts:5-45` (`emptySnapshot`)

**Interfaces:**
- Consumes: nothing — this is the base task.
- Produces: `PlacementBlock`, `ExemptStatus`, `ExemptEntry`, `PlacementResult`; `ProgressSnapshot.exempt: Record<string, ExemptEntry>` and `ProgressSnapshot.placement: PlacementResult[]`; and from `lib/placement.ts`: `PLACEMENT_PASS_PCT = 80`, `PLACEMENT_BLOCK_N = 12`, `exemptActive(s, moduleId): boolean`, `exemptScore(s, moduleId): number | null`, `isDone(s, moduleId): boolean`, `sectionExempt(s, moduleIds): boolean`, `sectionExemptScore(s, moduleIds): number | null`, `gradePlacement(...): PlacementResult`, `exemptionsFor(...): Record<string, ExemptEntry>`, `revocationsFor(...): Record<string, ExemptEntry>`.

`initialState` and `emptySnapshot` are updated here rather than in a later task because adding required fields to `ProgressSnapshot` breaks their type-check immediately — the build must stay green at the end of every task.

- [ ] **Step 1: Write the failing test**

Create `src/lib/placement.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  PLACEMENT_PASS_PCT,
  exemptActive,
  exemptScore,
  exemptionsFor,
  gradePlacement,
  isDone,
  revocationsFor,
  sectionExempt,
  sectionExemptScore,
} from './placement';
import type { ExemptEntry } from './types';

const ex = (over: Partial<ExemptEntry> = {}): ExemptEntry => ({
  status: 'exempt',
  at: '2026-09-05T10:00:00.000Z',
  via: 'pl-sp1',
  score: 92,
  ...over,
});

describe('exempt entry reads', () => {
  it('an active entry is exempt, a revoked one reads like no entry', () => {
    const s = { exempt: { sp1m1: ex(), sp1m2: ex({ status: 'revoked' }) } };
    expect(exemptActive(s, 'sp1m1')).toBe(true);
    expect(exemptActive(s, 'sp1m2')).toBe(false);
    expect(exemptActive(s, 'sp1m3')).toBe(false);
  });

  it('exposes the score of an active entry only', () => {
    const s = { exempt: { sp1m1: ex(), sp1m2: ex({ status: 'revoked' }) } };
    expect(exemptScore(s, 'sp1m1')).toBe(92);
    expect(exemptScore(s, 'sp1m2')).toBeNull();
    expect(exemptScore(s, 'sp1m3')).toBeNull();
  });

  it('isDone is true for studied and for exempt, false for revoked', () => {
    const s = {
      lessons: { sp1m3: true },
      exempt: { sp1m1: ex(), sp1m2: ex({ status: 'revoked' }) },
    };
    expect(isDone(s, 'sp1m1')).toBe(true);
    expect(isDone(s, 'sp1m3')).toBe(true);
    expect(isDone(s, 'sp1m2')).toBe(false);
    expect(isDone(s, 'sp1m4')).toBe(false);
  });
});

describe('section-level reads', () => {
  const ids = ['sp1m1', 'sp1m2', 'sp1m3'];

  it('a section is exempt when any module is actively exempt', () => {
    expect(sectionExempt({ exempt: { sp1m2: ex() } }, ids)).toBe(true);
    expect(sectionExempt({ exempt: {} }, ids)).toBe(false);
    expect(
      sectionExempt({ exempt: { sp1m2: ex({ status: 'revoked' }) } }, ids),
    ).toBe(false);
  });

  it('reports the score of the latest active entry', () => {
    const s = {
      exempt: {
        sp1m1: ex({ at: '2026-09-01T10:00:00.000Z', score: 83 }),
        sp1m2: ex({ at: '2026-09-04T10:00:00.000Z', score: 92 }),
      },
    };
    expect(sectionExemptScore(s, ids)).toBe(92);
    expect(sectionExemptScore({ exempt: {} }, ids)).toBeNull();
  });

  it('returns null when every entry in the section is revoked', () => {
    const s = {
      exempt: {
        sp1m1: ex({ status: 'revoked' }),
        sp1m2: ex({ status: 'revoked', at: '2026-09-06T10:00:00.000Z' }),
      },
    };
    expect(sectionExemptScore(s, ids)).toBeNull();
  });
});

describe('gradePlacement', () => {
  it('passes at the threshold and fails below it', () => {
    const at = '2026-09-05T10:00:00.000Z';
    const pass = gradePlacement('pl-sp1', 'sp1', 'secplus', 10, 12, at);
    expect(pass.pct).toBe(83);
    expect(pass.passed).toBe(true);
    expect(pass.date).toBe(at);

    const fail = gradePlacement('pl-sp1', 'sp1', 'secplus', 9, 12, at);
    expect(fail.pct).toBe(75);
    expect(fail.passed).toBe(false);
  });

  it('treats exactly PLACEMENT_PASS_PCT as a pass', () => {
    const r = gradePlacement('pl-sp2', 'sp2', 'secplus', 8, 10, '2026-09-05T10:00:00.000Z');
    expect(r.pct).toBe(PLACEMENT_PASS_PCT);
    expect(r.passed).toBe(true);
  });
});

describe('exemptionsFor', () => {
  const at = '2026-09-05T10:00:00.000Z';

  it('exempts only the modules that were not studied', () => {
    const out = exemptionsFor(['sp1m1', 'sp1m2'], { sp1m2: true }, 'pl-sp1', 92, at);
    expect(Object.keys(out)).toEqual(['sp1m1']);
    expect(out.sp1m1).toEqual({ status: 'exempt', at, via: 'pl-sp1', score: 92 });
  });

  it('returns nothing when every module is already studied', () => {
    const out = exemptionsFor(['sp1m1'], { sp1m1: true }, 'pl-sp1', 92, at);
    expect(out).toEqual({});
  });

  it('re-grants over a revoked module', () => {
    const out = exemptionsFor(['sp1m1'], {}, 'pl-sp1', 88, at);
    expect(out.sp1m1.status).toBe('exempt');
    expect(out.sp1m1.score).toBe(88);
  });
});

describe('revocationsFor', () => {
  it('tombstones active entries and leaves the rest alone', () => {
    const at = '2026-09-06T10:00:00.000Z';
    const exempt = { sp1m1: ex(), sp1m2: ex({ status: 'revoked' }) };
    const out = revocationsFor(exempt, ['sp1m1', 'sp1m2', 'sp1m3'], at);
    expect(Object.keys(out)).toEqual(['sp1m1']);
    expect(out.sp1m1).toEqual({ status: 'revoked', at, via: 'pl-sp1', score: 92 });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
eval "$(fnm env)" && npm test -- src/lib/placement.test.ts
```

Expected: FAIL — `Failed to resolve import "./placement"`.

- [ ] **Step 3: Add the types**

Append to `src/lib/types.ts`, after the `Question` interface:

```ts
/** One placement-test block: a whole exam domain, worth one section. */
export interface PlacementBlock {
  id: string; // "pl-sp1"
  sectionId: string; // "sp1"
  domain: Domain;
  title: string; // Spanish, shown on the block card
  blurb: string; // Spanish, one line describing what it covers
  questions: Question[]; // exactly PLACEMENT_BLOCK_N
}

export type ExemptStatus = 'exempt' | 'revoked';

/**
 * One module exempted (or un-exempted) by a placement block. Revocation writes
 * a tombstone rather than deleting, so it can win a sync merge.
 */
export interface ExemptEntry {
  status: ExemptStatus;
  at: string; // ISO timestamp — drives the merge
  via: string; // placement block id that granted it
  score: number; // block percentage at grant time, 0-100
}

export interface PlacementResult {
  date: string; // ISO timestamp
  track: TrackId;
  blockId: string;
  sectionId: string;
  correct: number;
  total: number;
  pct: number;
  passed: boolean;
}
```

Then add two fields to `ProgressSnapshot`, after `achievements`:

```ts
  exempt: Record<string, ExemptEntry>; // moduleId -> entry
  placement: PlacementResult[]; // full attempt history
```

- [ ] **Step 4: Write `src/lib/placement.ts`**

```ts
import type { ExemptEntry, PlacementResult, ProgressSnapshot, TrackId } from './types';
import { pct } from './util';

/** A block is passed at 80% — the same bar as a passed quiz and a downed boss. */
export const PLACEMENT_PASS_PCT = 80;
/** Questions per block. */
export const PLACEMENT_BLOCK_N = 12;

type WithExempt = Pick<ProgressSnapshot, 'exempt'>;
type WithProgress = Pick<ProgressSnapshot, 'lessons' | 'exempt'>;

/** A revoked entry reads exactly like no entry at all. */
export function exemptActive(s: WithExempt, moduleId: string): boolean {
  return s.exempt[moduleId]?.status === 'exempt';
}

export function exemptScore(s: WithExempt, moduleId: string): number | null {
  const e = s.exempt[moduleId];
  return e && e.status === 'exempt' ? e.score : null;
}

/** Studied or convalidated — the single question every progress read asks. */
export function isDone(s: WithProgress, moduleId: string): boolean {
  return !!s.lessons[moduleId] || exemptActive(s, moduleId);
}

export function sectionExempt(s: WithExempt, moduleIds: string[]): boolean {
  return moduleIds.some((id) => exemptActive(s, id));
}

/** Score shown on the "Sección convalidada" band: the latest active grant. */
export function sectionExemptScore(s: WithExempt, moduleIds: string[]): number | null {
  let best: ExemptEntry | null = null;
  for (const id of moduleIds) {
    const e = s.exempt[id];
    if (e?.status !== 'exempt') continue;
    if (!best || e.at > best.at) best = e;
  }
  return best ? best.score : null;
}

export function gradePlacement(
  blockId: string,
  sectionId: string,
  track: TrackId,
  correct: number,
  total: number,
  at: string,
): PlacementResult {
  const p = pct(correct, total);
  return {
    date: at,
    track,
    blockId,
    sectionId,
    correct,
    total,
    pct: p,
    passed: p >= PLACEMENT_PASS_PCT,
  };
}

/**
 * Entries to write when cashing in a passed block. Modules already studied are
 * skipped: a lesson genuinely read is never relabelled as convalidated.
 */
export function exemptionsFor(
  moduleIds: string[],
  lessons: Record<string, boolean>,
  blockId: string,
  score: number,
  at: string,
): Record<string, ExemptEntry> {
  const out: Record<string, ExemptEntry> = {};
  for (const id of moduleIds) {
    if (lessons[id]) continue;
    out[id] = { status: 'exempt', at, via: blockId, score };
  }
  return out;
}

/** Tombstones for every actively exempt module of a section. */
export function revocationsFor(
  exempt: Record<string, ExemptEntry>,
  moduleIds: string[],
  at: string,
): Record<string, ExemptEntry> {
  const out: Record<string, ExemptEntry> = {};
  for (const id of moduleIds) {
    const e = exempt[id];
    if (e?.status !== 'exempt') continue;
    out[id] = { ...e, status: 'revoked', at };
  }
  return out;
}
```

- [ ] **Step 5: Keep the two snapshot factories type-checking**

In `src/lib/store.ts`, inside `initialState()`, add after `achievements: {},`:

```ts
    exempt: {},
    placement: [],
```

In `src/lib/sync.ts`, inside `emptySnapshot()`, add after `achievements: {},`:

```ts
    exempt: {},
    placement: [],
```

- [ ] **Step 6: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: all tests PASS (the existing 32 plus the new ones) and the build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/lib/types.ts src/lib/placement.ts src/lib/placement.test.ts src/lib/store.ts src/lib/sync.ts
git commit -m "feat: placement types and pure exemption rules"
```

---

### Task 2: Store migration v2 to v3, and unscored answers

**Files:**
- Modify: `src/lib/store.ts:139-156` (`migrateProgress`), `:216-255` (`recordAnswer`), `:429-449` (persist options)
- Modify: `src/lib/store.test.ts`

**Interfaces:**
- Consumes: `ProgressSnapshot.exempt` / `.placement` from Task 1.
- Produces: persist `version: 3`; `recordAnswer(correct, conf, opts)` where `opts` gains `calibrated?: boolean` (default `true`) and `xp?: boolean` (default `true`).

`calibrated: false` skips the calibration counters — with no confidence bet there is nothing to calibrate. `xp: false` forces the XP delta to 0 while still calling `addXp(0, null)`, which is what keeps the daily streak alive without paying for the answer.

- [ ] **Step 1: Write the failing tests**

Add to `src/lib/store.test.ts`. Note the new import of `useStore` alongside `migrateProgress`:

```ts
import { describe, expect, it } from 'vitest';
import { migrateProgress, useStore } from './store';

const reset = () => useStore.getState().resetAll();

describe('migrateProgress to v3', () => {
  it('v1 blob passes through both steps', () => {
    const v1 = { xp: 10, exams: [{ date: '2026-01-01', pct: 80, correct: 20, total: 25, domains: {} }] };
    const out = migrateProgress(v1, 1) as {
      track: string;
      exams: { track: string }[];
      exempt: Record<string, unknown>;
      placement: unknown[];
    };
    expect(out.track).toBe('gcti');
    expect(out.exams[0].track).toBe('gcti');
    expect(out.exempt).toEqual({});
    expect(out.placement).toEqual([]);
  });

  it('v2 blob gains the two new fields', () => {
    const out = migrateProgress({ track: 'secplus', exams: [] }, 2) as {
      exempt: Record<string, unknown>;
      placement: unknown[];
    };
    expect(out.exempt).toEqual({});
    expect(out.placement).toEqual([]);
  });

  it('v3 blob is untouched', () => {
    const v3 = { track: 'secplus', exams: [], exempt: { sp1m1: { status: 'exempt', at: 'x', via: 'pl-sp1', score: 90 } }, placement: [] };
    expect(migrateProgress(v3, 3)).toEqual(v3);
  });
});

describe('recordAnswer scoring flags', () => {
  it('records calibration and XP by default', () => {
    reset();
    const delta = useStore.getState().recordAnswer(true, 'high');
    expect(delta).toBe(20);
    expect(useStore.getState().calibration.high).toEqual({ n: 1, c: 1 });
    expect(useStore.getState().xp).toBe(20);
  });

  it('skips calibration and XP when asked, but still counts the answer', () => {
    reset();
    const delta = useStore
      .getState()
      .recordAnswer(true, 'med', { stakes: false, calibrated: false, xp: false });
    expect(delta).toBe(0);
    expect(useStore.getState().calibration.med).toEqual({ n: 0, c: 0 });
    expect(useStore.getState().xp).toBe(0);
    expect(useStore.getState().totals.questions).toBe(1);
    expect(useStore.getState().totals.correct).toBe(1);
    expect(useStore.getState().streak.current).toBe(1);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
eval "$(fnm env)" && npm test -- src/lib/store.test.ts
```

Expected: FAIL — `expected undefined to deeply equal {}` on the migration tests, and the flags test failing because `calibration.med` is `{ n: 1, c: 1 }`.

- [ ] **Step 3: Make `migrateProgress` cumulative**

Replace the body of `migrateProgress` in `src/lib/store.ts`. The old version early-returned on `version < 2`, which would skip the v3 step for a v1 blob:

```ts
/**
 * Persist migrations, applied cumulatively so an old blob passes through every
 * step. v1 (single GCTI track) → v2: add the active `track` and stamp every
 * stored exam. v2 → v3: add the placement test's `exempt` and `placement`.
 */
export function migrateProgress(
  persisted: unknown,
  version: number,
): Partial<ProgressSnapshot> {
  let p = (persisted ?? {}) as Partial<ProgressSnapshot> & {
    exams?: Partial<ExamResult>[];
  };
  if (version < 2) {
    p = {
      ...p,
      track: 'gcti',
      exams: (p.exams ?? []).map((e) => ({ ...e, track: 'gcti' }) as ExamResult),
    };
  }
  if (version < 3) {
    p = { ...p, exempt: p.exempt ?? {}, placement: p.placement ?? [] };
  }
  return p;
}
```

- [ ] **Step 4: Add the scoring flags to `recordAnswer`**

In `src/lib/store.ts`, change the signature in the `Store` interface:

```ts
  recordAnswer: (
    correct: boolean,
    conf: Conf,
    opts?: {
      combo?: number;
      stakes?: boolean;
      /** false = do not touch calibration (no confidence bet was placed) */
      calibrated?: boolean;
      /** false = the answer pays no XP (placement test) */
      xp?: boolean;
    },
  ) => number;
```

In the implementation, change the destructuring and the two affected blocks:

```ts
      recordAnswer: (correct, conf, opts = {}) => {
        const { combo = 0, stakes = true, calibrated = true, xp = true } = opts;
```

Make the calibration update conditional — replace the unconditional `const calibration = {...}` and its use in `set` with:

```ts
        const calibration = calibrated
          ? {
              ...s.calibration,
              [conf]: {
                n: s.calibration[conf].n + 1,
                c: s.calibration[conf].c + (correct ? 1 : 0),
              },
            }
          : s.calibration;
```

And gate the delta:

```ts
        let delta: number;
        if (!xp) {
          delta = 0; // placement: measured, not paid
        } else if (stakes) {
          delta = correct ? STAKES[conf].win : -STAKES[conf].lose;
          if (correct && combo >= 5) delta += 10;
          else if (correct && combo >= 3) delta += 5;
        } else {
          delta = correct ? 5 : 0; // exam mode: flat, no losses
        }
        get().addXp(delta, null); // addXp(0) still keeps the streak alive
        return delta;
```

- [ ] **Step 5: Bump the persist version and widen `partialize`**

In the `persist` options at the bottom of `src/lib/store.ts`:

```ts
      name: 'intelforge-v1',
      version: 3,
```

and add to `partialize`, after `achievements: s.achievements,`:

```ts
        exempt: s.exempt,
        placement: s.placement,
```

- [ ] **Step 6: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/store.ts src/lib/store.test.ts
git commit -m "feat: migrate progress to v3 and allow unscored answers"
```

---

### Task 3: Store actions — take a block, cash it in, revoke it

**Files:**
- Modify: `src/lib/xp.ts:3-12` (`XP`)
- Modify: `src/data/achievements.ts` (append two definitions)
- Modify: `src/lib/store.ts` (`Store` interface and implementation)
- Modify: `src/lib/store.test.ts`

**Interfaces:**
- Consumes: `gradePlacement`, `exemptionsFor`, `revocationsFor` (Task 1); `recordAnswer` flags (Task 2).
- Produces: `finishPlacement(blockId, correct, total): PlacementResult`, `grantExemption(blockId): void`, `revokeExemption(sectionId): void`; `XP.placement = 50`; achievements `pl-tested` and `pl-shortcut`.

Taking a block and cashing it in are **separate actions on purpose**: nothing is ever convalidated without the learner pressing the confirm button.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/store.test.ts`:

```ts
import { modulesOf } from '../data/course';

describe('placement actions', () => {
  it('records a passed attempt but grants no exemption on its own', () => {
    reset();
    const r = useStore.getState().finishPlacement('pl-sp1', 10, 12);
    expect(r.passed).toBe(true);
    expect(useStore.getState().placement).toHaveLength(1);
    expect(useStore.getState().exempt).toEqual({});
  });

  it('pays for the first block of a track and nothing for the second', () => {
    reset();
    useStore.getState().finishPlacement('pl-sp1', 10, 12);
    // 50 for the block + 25 for the pl-tested achievement it unlocks
    const afterFirst = useStore.getState().xp;
    expect(afterFirst).toBe(75);
    useStore.getState().finishPlacement('pl-sp2', 10, 12);
    expect(useStore.getState().xp).toBe(afterFirst);
  });

  it('grantExemption convalidates the unstudied modules of the section', () => {
    reset();
    const ids = modulesOf('sp1').map((m) => m.id);
    useStore.setState({ lessons: { [ids[0]]: true } });
    useStore.getState().finishPlacement('pl-sp1', 11, 12);
    useStore.getState().grantExemption('pl-sp1');
    const { exempt } = useStore.getState();
    expect(exempt[ids[0]]).toBeUndefined(); // already studied
    expect(exempt[ids[1]].status).toBe('exempt');
    expect(exempt[ids[1]].score).toBe(92);
    expect(exempt[ids[1]].via).toBe('pl-sp1');
  });

  it('grantExemption is a no-op after a failed attempt', () => {
    reset();
    useStore.getState().finishPlacement('pl-sp1', 9, 12);
    useStore.getState().grantExemption('pl-sp1');
    expect(useStore.getState().exempt).toEqual({});
  });

  it('grantExemption pays no lesson XP', () => {
    reset();
    useStore.getState().finishPlacement('pl-sp1', 12, 12);
    const before = useStore.getState().xp;
    useStore.getState().grantExemption('pl-sp1');
    expect(useStore.getState().xp).toBe(before);
  });

  it('revokeExemption leaves tombstones, not deletions', () => {
    reset();
    const ids = modulesOf('sp1').map((m) => m.id);
    useStore.getState().finishPlacement('pl-sp1', 12, 12);
    useStore.getState().grantExemption('pl-sp1');
    useStore.getState().revokeExemption('sp1');
    const { exempt } = useStore.getState();
    expect(exempt[ids[0]].status).toBe('revoked');
    expect(Object.keys(exempt).length).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
eval "$(fnm env)" && npm test -- src/lib/store.test.ts
```

Expected: FAIL — `useStore.getState().finishPlacement is not a function`.

- [ ] **Step 3: Add the XP reward**

In `src/lib/xp.ts`, add to the `XP` object:

```ts
  placement: 50,
```

- [ ] **Step 4: Add the two achievements**

Append to the `ACHIEVEMENTS` array in `src/data/achievements.ts`:

```ts
  {
    id: 'pl-tested',
    icon: '🎯',
    title: 'Autoevaluado',
    desc: 'Completa un bloque de la prueba de nivel',
    xp: 25,
    test: (s) => s.placement.length > 0,
  },
  {
    id: 'pl-shortcut',
    icon: '⏩',
    title: 'Atajo ganado',
    desc: 'Ten convalidaciones activas en 3 secciones',
    xp: 100,
    test: (s) =>
      new Set(
        Object.entries(s.exempt)
          .filter(([, e]) => e.status === 'exempt')
          .map(([id]) => moduleById(id)?.sectionId)
          .filter(Boolean),
      ).size >= 3,
  },
```

Add `moduleById` to the existing import from `./course` at the top of the file.

- [ ] **Step 5: Add the three store actions**

Add to the `Store` interface in `src/lib/store.ts`, after `recordExam`:

```ts
  /** Record a placement attempt. Grants nothing — cashing in is a separate step. */
  finishPlacement: (blockId: string, correct: number, total: number) => PlacementResult;
  /** Cash in a passed block: convalidate the section's unstudied theory. */
  grantExemption: (blockId: string) => void;
  /** Undo a section's convalidation, leaving tombstones so sync respects it. */
  revokeExemption: (sectionId: string) => void;
```

And the implementations, after `recordExam`:

```ts
      finishPlacement: (blockId, correct, total) => {
        const s = get();
        const block = placementBlockById(blockId);
        if (!block) {
          throw new Error(`unknown placement block: ${blockId}`);
        }
        const track = trackOf(block.sectionId);
        const r = gradePlacement(
          blockId,
          block.sectionId,
          track,
          correct,
          total,
          new Date().toISOString(),
        );
        const first = !s.placement.some((p) => p.track === track);
        set({ placement: [...s.placement, r] });
        if (first) get().addXp(XP.placement, 'Prueba de nivel');
        else get()._check();
        return r;
      },

      grantExemption: (blockId) => {
        const s = get();
        const block = placementBlockById(blockId);
        if (!block) return;
        const last = [...s.placement]
          .reverse()
          .find((p) => p.blockId === blockId);
        if (!last?.passed) return;
        const ids = modulesOf(block.sectionId).map((m) => m.id);
        const added = exemptionsFor(
          ids,
          s.lessons,
          blockId,
          last.pct,
          new Date().toISOString(),
        );
        if (Object.keys(added).length === 0) return;
        set({ exempt: { ...s.exempt, ...added } });
        toast({
          kind: 'info',
          icon: '⏩',
          title: 'Sección convalidada',
          sub: `${Object.keys(added).length} lecciones dadas por vistas`,
        });
        get()._check();
      },

      revokeExemption: (sectionId) => {
        const s = get();
        const ids = modulesOf(sectionId).map((m) => m.id);
        const undone = revocationsFor(s.exempt, ids, new Date().toISOString());
        if (Object.keys(undone).length === 0) return;
        set({ exempt: { ...s.exempt, ...undone } });
      },
```

Add the imports at the top of `src/lib/store.ts`:

```ts
import { modulesOf, placementBlockById } from '../data/course';
import { trackOf } from '../data/course';
import { exemptionsFor, gradePlacement, revocationsFor } from './placement';
import type { PlacementResult } from './types';
```

Merge the two `../data/course` imports into one.

`placementBlockById` is defined in Task 4. If you are executing out of order and it does not exist yet, add it to `src/data/course.ts` now (Task 4 will then find it already there):

```ts
export const ALL_PLACEMENT: PlacementBlock[] = TRACK_IDS.flatMap(
  (t) => TRACKS[t].placement,
);
export const placementBlocks = (track: TrackId) => TRACKS[track].placement;
export const placementBlockById = (id: string) =>
  ALL_PLACEMENT.find((b) => b.id === id);
```

which additionally needs `placement: PlacementBlock[]` on `TrackMeta` and `placement: []` on both track literals in `src/data/tracks.ts`.

- [ ] **Step 6: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: PASS. If `pl-shortcut` fires unexpectedly in an unrelated achievement test, check that `achievements.test.ts` builds its fixture snapshots through `emptySnapshot()`, which now carries `exempt: {}`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/xp.ts src/lib/store.ts src/lib/store.test.ts src/data/achievements.ts
git commit -m "feat: placement attempts, exemption grant and revoke"
```

---

### Task 4: Content registry lookups and exemption-aware progress reads

**Files:**
- Modify: `src/data/tracks.ts:38-60` (`TrackMeta`), and both track literals
- Modify: `src/data/course.ts` (lookups, `sectionMastery`, `nextModule`)
- Modify: `src/data/course.test.ts`

**Interfaces:**
- Consumes: `PlacementBlock` (Task 1), `isDone` / `exemptScore` (Task 1).
- Produces: `TrackMeta.placement: PlacementBlock[]`; `placementBlocks(track): PlacementBlock[]`, `placementBlockById(id): PlacementBlock | undefined`, `ALL_PLACEMENT: PlacementBlock[]`. `sectionMastery` and `nextModule` now take `exempt` as part of their progress argument.

Both tracks get `placement: []` here. The arrays stop being empty in Tasks 9-13; everything downstream must already handle the empty case.

- [ ] **Step 1: Write the failing tests**

Append to `src/data/course.test.ts`:

```ts
import { placementBlockById, placementBlocks, sectionMastery } from './course';

const emptyProg = {
  lessons: {} as Record<string, boolean>,
  quizBest: {} as Record<string, number>,
  labs: {} as Record<string, boolean>,
  bosses: {} as Record<string, number>,
  exempt: {} as Record<string, import('../lib/types').ExemptEntry>,
};

describe('placement lookups', () => {
  it('every placement block points at a real section of its own track', () => {
    for (const t of TRACK_IDS) {
      for (const b of placementBlocks(t)) {
        expect(trackOf(b.sectionId), b.id).toBe(t);
        expect(placementBlockById(b.id), b.id).toBe(b);
      }
    }
  });

  it('returns undefined for an unknown block', () => {
    expect(placementBlockById('pl-nope')).toBeUndefined();
  });
});

describe('mastery with exemptions', () => {
  const ids = modulesOfTrack('secplus')
    .filter((m) => m.sectionId === 'sp1')
    .map((m) => m.id);

  const exemptAll = (score: number) => {
    const exempt: Record<string, import('../lib/types').ExemptEntry> = {};
    for (const id of ids) {
      exempt[id] = { status: 'exempt', at: '2026-09-05T10:00:00.000Z', via: 'pl-sp1', score };
    }
    return { ...emptyProg, exempt };
  };

  it('a fully exempted section scores above nothing and below full mastery', () => {
    const before = sectionMastery('sp1', emptyProg);
    const after = sectionMastery('sp1', exemptAll(83));
    expect(before).toBe(0);
    expect(after).toBeGreaterThan(before);
    expect(after).toBeLessThan(100);
  });

  it('credits the quiz with the block score, not with 100', () => {
    expect(sectionMastery('sp1', exemptAll(100))).toBeGreaterThan(
      sectionMastery('sp1', exemptAll(83)),
    );
  });

  it('a revoked exemption counts for nothing', () => {
    const revoked = exemptAll(83);
    for (const id of ids) revoked.exempt[id].status = 'revoked';
    expect(sectionMastery('sp1', revoked)).toBe(0);
  });
});

describe('nextModule skips convalidated theory', () => {
  it('lands on the first module that is neither studied nor exempt', () => {
    const ids = modulesOfTrack('secplus').map((m) => m.id);
    const s = {
      lessons: { [ids[0]]: true },
      exempt: {
        [ids[1]]: {
          status: 'exempt' as const,
          at: '2026-09-05T10:00:00.000Z',
          via: 'pl-sp1',
          score: 90,
        },
      },
    };
    expect(nextModule('secplus', s)?.id).toBe(ids[2]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
eval "$(fnm env)" && npm test -- src/data/course.test.ts
```

Expected: FAIL — `placementBlocks is not exported`.

- [ ] **Step 3: Add `placement` to the track registry**

In `src/data/tracks.ts`, add to the `TrackMeta` interface after `labs: LabMeta[];`:

```ts
  /** Placement blocks, one per content section. Empty = no placement test yet. */
  placement: PlacementBlock[];
```

Add `PlacementBlock` to the type import from `../lib/types`, then add `placement: [],` to **both** the `gcti` and `secplus` literals, next to their `labs` entry.

- [ ] **Step 4: Add the lookups to `course.ts`**

In `src/data/course.ts`, after the `questionsOfTrack` helper:

```ts
export const ALL_PLACEMENT: PlacementBlock[] = TRACK_IDS.flatMap(
  (t) => TRACKS[t].placement,
);
export const placementBlocks = (track: TrackId) => TRACKS[track].placement;
export const placementBlockById = (id: string) =>
  ALL_PLACEMENT.find((b) => b.id === id);
```

Add `PlacementBlock` to the type import at the top.

- [ ] **Step 5: Teach the progress reads about exemptions**

In `src/data/course.ts`, widen the `Prog` alias and `nextModule`, and import the helpers:

```ts
import { exemptScore, isDone } from '../lib/placement';

type Prog = Pick<
  ProgressSnapshot,
  'lessons' | 'quizBest' | 'labs' | 'bosses' | 'exempt'
>;

export const nextModule = (
  track: TrackId,
  s: Pick<ProgressSnapshot, 'lessons' | 'exempt'>,
) => TRACKS[track].modules.find((m) => !isDone(s, m.id));
```

Inside `sectionMastery`, replace the lesson and quiz calculations:

```ts
  const lessonPct = pct(mods.filter((m) => isDone(s, m.id)).length, mods.length);
  const quizMods = mods.filter((m) => m.quiz.length > 0);
  const quizPct =
    quizMods.length === 0
      ? null
      : Math.round(
          quizMods.reduce(
            (acc, m) =>
              acc + Math.max(s.quizBest[m.id] ?? 0, exemptScore(s, m.id) ?? 0),
            0,
          ) / quizMods.length,
        );
```

Labs and boss are untouched — exempting theory leaves the practical work pending, which is the point.

- [ ] **Step 6: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: PASS. Any existing test that builds a partial progress fixture now needs an `exempt: {}` field; add it where `tsc` points.

- [ ] **Step 7: Commit**

```bash
git add src/data/tracks.ts src/data/course.ts src/data/course.test.ts
git commit -m "feat: exemption-aware mastery and placement lookups"
```

---

### Task 5: Sync merge for exemptions and attempts

**Files:**
- Modify: `src/lib/sync.ts` (new merge helpers, `mergeProgress` return, doc comment)
- Modify: `src/lib/sync.test.ts`

**Interfaces:**
- Consumes: `ExemptEntry`, `PlacementResult` (Task 1).
- Produces: `mergeProgress` handling `exempt` and `placement`.

**This is the task that changes a documented property of the codebase.** `mergeProgress` is currently commutative, idempotent *and monotonic*. After this task it stays commutative and idempotent, but `exempt` is last-write-wins, so a revocation on one device is not undone by an older grant on another. Update the doc comment; do not quietly leave it saying "monotonic".

A snapshot pulled from a device running the old build has **no** `exempt` or `placement` field, so every read must default (`a.exempt ?? {}`). Missing that is the one way this task can crash in production.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/sync.test.ts`:

```ts
import type { ExemptEntry, PlacementResult } from './types';

const entry = (over: Partial<ExemptEntry> = {}): ExemptEntry => ({
  status: 'exempt',
  at: '2026-09-05T10:00:00.000Z',
  via: 'pl-sp1',
  score: 92,
  ...over,
});

const attempt = (over: Partial<PlacementResult> = {}): PlacementResult => ({
  date: '2026-09-05T10:00:00.000Z',
  track: 'secplus',
  blockId: 'pl-sp1',
  sectionId: 'sp1',
  correct: 10,
  total: 12,
  pct: 83,
  passed: true,
  ...over,
});

describe('mergeProgress — exemptions', () => {
  it('unions entries that only one side has', () => {
    const a = snap({ exempt: { sp1m1: entry() } });
    const b = snap({ exempt: { sp2m1: entry({ via: 'pl-sp2' }) } });
    expect(Object.keys(mergeProgress(a, b).exempt).sort()).toEqual(['sp1m1', 'sp2m1']);
  });

  it('a newer revocation beats an older grant, in both directions', () => {
    const a = snap({ exempt: { sp1m1: entry({ at: '2026-09-05T10:00:00.000Z' }) } });
    const b = snap({
      exempt: { sp1m1: entry({ status: 'revoked', at: '2026-09-06T10:00:00.000Z' }) },
    });
    expect(mergeProgress(a, b).exempt.sp1m1.status).toBe('revoked');
    expect(mergeProgress(b, a).exempt.sp1m1.status).toBe('revoked');
  });

  it('a newer grant beats an older revocation — re-taking the test works', () => {
    const a = snap({
      exempt: { sp1m1: entry({ status: 'revoked', at: '2026-09-05T10:00:00.000Z' }) },
    });
    const b = snap({ exempt: { sp1m1: entry({ at: '2026-09-07T10:00:00.000Z' }) } });
    expect(mergeProgress(a, b).exempt.sp1m1.status).toBe('exempt');
    expect(mergeProgress(b, a).exempt.sp1m1.status).toBe('exempt');
  });

  it('on an identical timestamp, revoked wins in both directions', () => {
    const a = snap({ exempt: { sp1m1: entry() } });
    const b = snap({ exempt: { sp1m1: entry({ status: 'revoked' }) } });
    expect(mergeProgress(a, b).exempt.sp1m1.status).toBe('revoked');
    expect(mergeProgress(b, a).exempt.sp1m1.status).toBe('revoked');
  });

  it('is idempotent', () => {
    const a = snap({ exempt: { sp1m1: entry() } });
    const b = snap({ exempt: { sp1m1: entry({ status: 'revoked', at: '2026-09-06T10:00:00.000Z' }) } });
    const once = mergeProgress(a, b);
    expect(mergeProgress(once, once)).toEqual(once);
    expect(mergeProgress(once, b)).toEqual(once);
  });

  it('survives a snapshot from an older build with no exempt field', () => {
    const old = { ...emptySnapshot() } as ProgressSnapshot;
    delete (old as Partial<ProgressSnapshot>).exempt;
    delete (old as Partial<ProgressSnapshot>).placement;
    const b = snap({ exempt: { sp1m1: entry() }, placement: [attempt()] });
    expect(() => mergeProgress(old, b)).not.toThrow();
    expect(mergeProgress(old, b).exempt.sp1m1.status).toBe('exempt');
    expect(mergeProgress(old, b).placement).toHaveLength(1);
  });
});

describe('mergeProgress — placement history', () => {
  it('dedupes identical attempts and is order-independent', () => {
    const a = snap({ placement: [attempt()] });
    const b = snap({ placement: [attempt(), attempt({ blockId: 'pl-sp2', sectionId: 'sp2' })] });
    expect(mergeProgress(a, b).placement).toHaveLength(2);
    expect(mergeProgress(a, b).placement).toEqual(mergeProgress(b, a).placement);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
eval "$(fnm env)" && npm test -- src/lib/sync.test.ts
```

Expected: FAIL — `Cannot read properties of undefined` / `expected undefined to have length 2`.

- [ ] **Step 3: Write the two merge helpers**

Add to `src/lib/sync.ts`, next to `mergeExams`:

```ts
/**
 * Pick the surviving exemption entry. The order is total and decided purely by
 * content, which is what keeps mergeProgress commutative: later `at` wins;
 * on a tie `revoked` wins (a stale device must never re-grant); then the higher
 * score; then the lexicographically smaller `via`.
 */
function laterEntry(x: ExemptEntry, y: ExemptEntry): ExemptEntry {
  if (x.at !== y.at) return x.at > y.at ? x : y;
  if (x.status !== y.status) return x.status === 'revoked' ? x : y;
  if (x.score !== y.score) return x.score > y.score ? x : y;
  return x.via <= y.via ? x : y;
}

function mergeExempt(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot['exempt'] {
  const ae = a.exempt ?? {};
  const be = b.exempt ?? {};
  const out: ProgressSnapshot['exempt'] = {};
  for (const k of keysOf(ae, be)) {
    const x = ae[k];
    const y = be[k];
    out[k] = x && y ? { ...laterEntry(x, y) } : { ...(x ?? y) };
  }
  return out;
}

const placementKey = (p: PlacementResult) =>
  `${p.date}|${p.blockId}|${p.pct}|${p.correct}|${p.total}`;

function mergePlacement(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): PlacementResult[] {
  const byKey = new Map<string, PlacementResult>();
  for (const p of [...(a.placement ?? []), ...(b.placement ?? [])]) {
    byKey.set(placementKey(p), p);
  }
  return Array.from(byKey.values()).sort((x, y) =>
    x.date === y.date
      ? placementKey(x).localeCompare(placementKey(y))
      : x.date < y.date
        ? -1
        : 1,
  );
}
```

Add `ExemptEntry` and `PlacementResult` to the type import at the top of the file.

- [ ] **Step 4: Wire them in and correct the doc comment**

Add to the object returned by `mergeProgress`, after `achievements,`:

```ts
    exempt: mergeExempt(a, b),
    placement: mergePlacement(a, b),
```

Replace the `mergeProgress` doc comment:

```ts
/**
 * Merge two progress snapshots. Commutative and idempotent: merge order never
 * matters and repeating a sync changes nothing.
 *
 * Monotonic for every field but one — no counter decreases and no completed
 * work is lost. The exception is `exempt`, where the most recent decision wins,
 * because a placement exemption can be revoked and that revocation must not be
 * undone by an older grant arriving from another device.
 *
 * `a` is treated as the local snapshot: its `track` (a UI preference, not
 * progress) is preserved.
 */
```

- [ ] **Step 5: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: PASS, including the 28 pre-existing sync tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/sync.ts src/lib/sync.test.ts
git commit -m "feat: merge exemptions last-write-wins across devices"
```

---

### Task 6: Placement mode in the quiz engine

**Files:**
- Modify: `src/components/QuizEngine.tsx:19-26` (Props), `:211` (`stakes`), `:213-235` (`submit`), `:334-336` (confidence block gate)

**Interfaces:**
- Consumes: `recordAnswer` flags (Task 2).
- Produces: `QuizEngine` accepting `mode: 'quiz' | 'boss' | 'exam' | 'placement'`. `QuizResult` is unchanged, and `resultExtra` is the hook Task 7 uses to render the exemption buttons on the result screen.

Placement behaves like `exam` — no per-question reveal — and additionally hides the confidence selector entirely and pays nothing.

Components are not unit-testable here: `vitest.config.ts` includes only `src/**/*.test.ts`, and no React testing library is installed. Verification is `tsc` plus the Browser pane in Task 7, once there is a page to run it in.

- [ ] **Step 1: Widen the mode union**

In the `Props` interface:

```ts
  mode: 'quiz' | 'boss' | 'exam' | 'placement';
```

- [ ] **Step 2: Make placement unscored**

Replace the `stakes` line:

```ts
  const placement = mode === 'placement';
  const stakes = mode !== 'exam' && !placement;
```

In `submit`, replace the `recordAnswer` call and widen the no-reveal branch:

```ts
    const delta = recordAnswer(ok, conf, {
      combo: newCombo,
      stakes,
      calibrated: !placement,
      xp: !placement,
    });
    setLastDelta(delta);
    const rev = [...review, { q, chosen, ok }];
    setReview(rev);
    if (mode === 'exam' || placement) {
      // no per-question reveal: the whole review comes at the end
      if (idx + 1 >= total) finish(rev);
      else {
        setIdx(idx + 1);
        setChosen(null);
        setConf('med');
      }
    } else {
      setSubmitted(true);
    }
```

- [ ] **Step 3: Hide the confidence selector in placement**

Change the gate on the confidence-bet block:

```tsx
        {!submitted && !placement && (
```

And the submit button label, so the last question does not say "Responder":

```tsx
              {(mode === 'exam' || placement) && idx + 1 >= total
                ? 'Terminar'
                : 'Responder'}
```

- [ ] **Step 4: Type-check**

```bash
eval "$(fnm env)" && npm run build
```

Expected: build succeeds. No behaviour change for the three existing modes — `placement` is `false` for all of them, so `stakes` and the reveal branch evaluate exactly as before.

- [ ] **Step 5: Commit**

```bash
git add src/components/QuizEngine.tsx
git commit -m "feat: unscored placement mode in the quiz engine"
```

---

### Task 7: The placement page and its routes

**Files:**
- Create: `src/pages/PlacementPage.tsx`
- Modify: `src/App.tsx:1-50` (imports and routes)

**Interfaces:**
- Consumes: `placementBlocks`, `placementBlockById` (Task 4); `finishPlacement`, `grantExemption` (Task 3); `QuizEngine` placement mode and its `resultExtra` hook (Task 6); `sectionExempt`, `sectionExemptScore`, `PLACEMENT_PASS_PCT` (Task 1); `Panel`, `PageTitle`, `Chip` from `components/Bits`; `useTrack` from `components/Layout`.
- Produces: routes `/placement` and `/placement/:blockId`.

The result screen is **not** a new component: `QuizEngine` already renders score, pass/fail and the full per-question review, and takes a `resultExtra` render prop. The confirm buttons go there.

- [ ] **Step 1: Write the page**

Create `src/pages/PlacementPage.tsx`:

```tsx
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import QuizEngine from '../components/QuizEngine';
import { PageTitle, Panel } from '../components/Bits';
import { useTrack } from '../components/Layout';
import { modulesOf, placementBlockById, placementBlocks, sectionById } from '../data/course';
import { useStore } from '../lib/store';
import { PLACEMENT_PASS_PCT, sectionExempt, sectionExemptScore } from '../lib/placement';
import type { PlacementBlock } from '../lib/types';

/** Latest attempt at a block, or null. */
function useLastAttempt(blockId: string) {
  return useStore((s) => {
    const hits = s.placement.filter((p) => p.blockId === blockId);
    return hits.length ? hits[hits.length - 1] : null;
  });
}

function BlockCard({ block }: { block: PlacementBlock }) {
  const last = useLastAttempt(block.id);
  const exempt = useStore((s) => sectionExempt(s, modulesOf(block.sectionId).map((m) => m.id)));
  const score = useStore((s) => sectionExemptScore(s, modulesOf(block.sectionId).map((m) => m.id)));

  const state = exempt
    ? { label: `Convalidada · ${score}%`, tone: 'text-cyan-300', cta: 'Ver detalle' }
    : last?.passed
      ? { label: `Superado · ${last.pct}%`, tone: 'text-emerald-300', cta: 'Convalidar sección' }
      : last
        ? { label: `No superado · ${last.pct}%`, tone: 'text-amber-300', cta: 'Reintentar' }
        : { label: 'Sin hacer', tone: 'text-slate-500', cta: 'Empezar' };

  return (
    <Link
      to={`/placement/${block.id}`}
      className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 transition-colors hover:border-ink-500 hover:bg-ink-850"
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-100">{block.title}</div>
        <div className="text-xs text-slate-500">{block.blurb}</div>
      </div>
      <span className={`text-xs font-bold ${state.tone}`}>{state.label}</span>
      <span className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-semibold text-slate-300">
        {state.cta}
      </span>
    </Link>
  );
}

function BlockList() {
  const track = useTrack();
  const blocks = placementBlocks(track.id);

  return (
    <div>
      <PageTitle
        kicker="Prueba de nivel"
        title="🎯 ¿Qué te puedes saltar?"
        sub="Un bloque por dominio. Supéralo y convalidas la teoría de esa sección."
      />
      <Panel className="mb-5 text-sm leading-relaxed text-slate-300">
        Cada bloque son 12 preguntas sin apuesta de confianza y sin XP por acierto: esto
        mide, no puntúa. A partir del {PLACEMENT_PASS_PCT}% puedes convalidar las lecciones
        de esa sección — los labs y el boss siguen esperándote.
      </Panel>
      {blocks.length === 0 ? (
        <Panel>
          <div className="text-sm font-bold text-slate-100">🚧 Todavía no hay prueba de nivel para este track</div>
          <p className="mt-1 text-xs text-slate-400">
            Cambia de track o sigue con el temario; llegará en una próxima actualización.
          </p>
        </Panel>
      ) : (
        <div className="space-y-2">
          {blocks.map((b) => (
            <BlockCard key={b.id} block={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function BlockRun({ block }: { block: PlacementBlock }) {
  const navigate = useNavigate();
  const finishPlacement = useStore((s) => s.finishPlacement);
  const grantExemption = useStore((s) => s.grantExemption);
  const lessons = useStore((s) => s.lessons);
  const [attempt, setAttempt] = useState(0);
  const [granted, setGranted] = useState(false);

  const section = sectionById(block.sectionId);
  const ids = modulesOf(block.sectionId).map((m) => m.id);
  const nothingToExempt = ids.every((id) => lessons[id]);

  return (
    <div>
      <PageTitle
        kicker="Prueba de nivel"
        title={block.title}
        sub={`${block.questions.length} preguntas · sin tiempo límite · ≥${PLACEMENT_PASS_PCT}% para convalidar`}
      />
      <QuizEngine
        key={attempt}
        questions={block.questions}
        mode="placement"
        onFinish={(r) => finishPlacement(block.id, r.correct, r.total)}
        onRetry={() => setAttempt((n) => n + 1)}
        resultExtra={(r) => {
          if (!r.pct || r.pct < PLACEMENT_PASS_PCT) {
            return (
              <Panel className="mb-4 text-sm text-slate-300">
                Por debajo del {PLACEMENT_PASS_PCT}%. Estudia la sección con calma: la
                revisión de abajo te dice exactamente dónde están los huecos.
              </Panel>
            );
          }
          if (granted) {
            return (
              <Panel className="mb-4 text-sm text-cyan-200">
                ✅ {section?.title} convalidada. Puedes anularlo cuando quieras desde la
                sección o desde tu perfil.
              </Panel>
            );
          }
          if (nothingToExempt) {
            return (
              <Panel className="mb-4 text-sm text-slate-300">
                Ya has estudiado esta sección entera, así que no hay nada que convalidar.
                Buen resultado igualmente.
              </Panel>
            );
          }
          return (
            <Panel className="mb-4">
              <div className="text-sm text-slate-200">
                Puedes dar por vista la teoría de {section?.title}. Los labs y el boss no se
                tocan.
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    grantExemption(block.id);
                    setGranted(true);
                  }}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400"
                >
                  ⏩ Convalidar {section?.short ?? 'la sección'}
                </button>
                <button
                  onClick={() => navigate('/placement')}
                  className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-ink-800"
                >
                  Prefiero estudiarla igualmente
                </button>
              </div>
            </Panel>
          );
        }}
      />
    </div>
  );
}

export default function PlacementPage() {
  const { blockId } = useParams();
  const block = blockId ? placementBlockById(blockId) : undefined;
  if (blockId && !block) {
    return <p className="text-slate-400">Bloque de nivel no encontrado.</p>;
  }
  return block ? <BlockRun block={block} /> : <BlockList />;
}
```

- [ ] **Step 2: Register the routes**

In `src/App.tsx`, add the import next to the other pages:

```tsx
import PlacementPage from './pages/PlacementPage';
```

and the two routes, after the `/exam` route:

```tsx
          <Route path="/placement" element={<PlacementPage />} />
          <Route path="/placement/:blockId" element={<PlacementPage />} />
```

- [ ] **Step 3: Type-check**

```bash
eval "$(fnm env)" && npm run build
```

Expected: build succeeds. With both tracks still at `placement: []`, `/placement` renders the "todavía no hay prueba de nivel" panel — that is the correct state until Task 9.

- [ ] **Step 4: Verify in the Browser pane**

Start the dev server with the `intelforge-dev` launch config (port 5173) and open `http://localhost:5173/#/placement`. Confirm the empty-state panel renders and the page does not throw. Check the console for errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/PlacementPage.tsx src/App.tsx
git commit -m "feat: placement page and routes"
```

---

### Task 8: Surfacing exemptions across the app

**Files:**
- Modify: `src/pages/SectionPage.tsx:20-24` (derived state), `:56-110` (module rows), and the panel under the mastery ring
- Modify: `src/pages/ModulePage.tsx` (banner on an exempted module)
- Modify: `src/pages/Dashboard.tsx:146-160` (banner above the top row)
- Modify: `src/pages/ProfilePage.tsx:172` (new panel before `<SyncPanel />`)

**Interfaces:**
- Consumes: `exemptActive`, `sectionExempt`, `sectionExemptScore` (Task 1); `revokeExemption` (Task 3); `Chip` from `components/Bits`.
- Produces: no new exports.

**Studied beats convalidated everywhere.** A module can hold both marks — the learner convalidated the section and later read the lesson anyway. Where they meet, show the emerald ✓, never the convalidated chip.

- [ ] **Step 1: Add the exemption band and chips to `SectionPage`**

Add the imports and derived state after `const mastery = ...`:

```tsx
import { exemptActive, sectionExempt, sectionExemptScore } from '../lib/placement';

  const moduleIds = mods.map((m) => m.id);
  const exempt = sectionExempt(s, moduleIds);
  const exemptPct = sectionExemptScore(s, moduleIds);
  const revokeExemption = useStore((st) => st.revokeExemption);
```

Add this directly after the mastery `<Panel>`:

```tsx
      {exempt && (
        <Panel className="mb-5 border-cyan-500/40 bg-cyan-950/20">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 text-sm text-cyan-100">
              ⏩ Sección convalidada por tu prueba de nivel · {exemptPct}%
              <div className="mt-1 text-xs text-cyan-200/70">
                La teoría cuenta como vista. Los labs y el boss siguen pendientes.
              </div>
            </div>
            <button
              onClick={() => revokeExemption(section.id)}
              className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-950/50"
            >
              Anular convalidación
            </button>
          </div>
        </Panel>
      )}
```

In the module row, replace `const done = !!s.lessons[m.id];` with:

```tsx
          const done = !!s.lessons[m.id];
          const conv = !done && exemptActive(s, m.id);
```

Change the numbered badge so a convalidated module is visibly different from a studied one:

```tsx
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                  done
                    ? 'bg-emerald-500 text-ink-950'
                    : conv
                      ? 'bg-cyan-600 text-ink-950'
                      : 'bg-ink-700 text-slate-400'
                }`}
              >
                {done ? '✓' : conv ? '⏩' : i + 1}
```

And add the chip next to the minutes line:

```tsx
                <span className="text-xs text-slate-500">
                  {m.minutes} min
                  {conv && <span className="ml-2 text-cyan-300">⏩ convalidada</span>}
                </span>
```

Finally, make the study button read «Repasar» when convalidated: change `{done ? 'Repasar' : 'Estudiar'}` to `{done || conv ? 'Repasar' : 'Estudiar'}`.

- [ ] **Step 2: Add the banner to `ModulePage`**

`LessonView` selects narrow slices of the store (`const lessons = useStore((s) => s.lessons);`) rather than the whole snapshot, so add a matching slice and build the argument by hand. Add the import and the selector inside `LessonView`, next to the existing `lessons` selector:

```tsx
import { exemptActive } from '../lib/placement';

  const exempt = useStore((s) => s.exempt);
```

Then add the derived flag next to `const completed = !!lessons[mod.id];`:

```tsx
  const convalidated = !completed && exemptActive({ exempt }, mod.id);
```

And render the banner directly after the «🎯 Objetivos» `<Panel>`:

```tsx
      {convalidated && (
        <Panel className="mb-6 border-cyan-500/40 bg-cyan-950/20 text-sm text-cyan-100">
          ⏩ Convalidada por tu prueba de nivel. Puedes leerla igualmente — al terminarla
          contará como estudiada.
        </Panel>
      )}
```

- [ ] **Step 3: Add the Dashboard entry point**

In `src/pages/Dashboard.tsx`, import `placementBlocks` from `../data/course`, then insert directly above the `{/* top row: continue + readiness */}` block:

```tsx
      {placementBlocks(track.id).length > 0 &&
        (s.placement.some((p) => p.track === track.id) ? (
          <Link
            to="/placement"
            className="mb-5 block text-xs font-semibold text-cyan-300 hover:text-cyan-200"
          >
            🎯 Prueba de nivel · revisa qué puedes convalidar →
          </Link>
        ) : (
          <Link
            to="/placement"
            className="mb-5 block rounded-xl border border-cyan-500/40 bg-cyan-950/20 p-4 transition-colors hover:border-cyan-400"
          >
            <div className="text-sm font-bold text-cyan-100">
              🎯 ¿Ya sabes algo de esto?
            </div>
            <div className="mt-1 text-xs text-cyan-200/80">
              Haz la prueba de nivel y sáltate lo que ya dominas.
            </div>
          </Link>
        ))}
```

Once any attempt exists it collapses to the one-line link, so it never nags.

- [ ] **Step 4: Add the Profile panel**

In `src/pages/ProfilePage.tsx`, insert before `<SyncPanel />`:

```tsx
      <Panel className="mb-5">
        <h2 className="mb-3 font-bold text-slate-100">🎯 Prueba de nivel</h2>
        {placement.length === 0 ? (
          <p className="text-xs text-slate-400">
            Todavía no has hecho ningún bloque.{' '}
            <Link to="/placement" className="text-cyan-300 hover:text-cyan-200">
              Hacerla ahora →
            </Link>
          </p>
        ) : (
          <div className="space-y-2">
            {placement.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="font-mono text-slate-500">{p.date.slice(0, 10)}</span>
                <span className="flex-1 text-slate-300">
                  {sectionById(p.sectionId)?.title ?? p.sectionId}
                </span>
                <span className={p.passed ? 'text-emerald-300' : 'text-amber-300'}>
                  {p.pct}%
                </span>
              </div>
            ))}
          </div>
        )}
        {exemptSections.length > 0 && (
          <div className="mt-4 border-t border-ink-700 pt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Convalidaciones activas
            </div>
            {exemptSections.map((sec) => (
              <div key={sec.id} className="flex items-center gap-3 py-1 text-xs">
                <span className="flex-1 text-cyan-200">⏩ {sec.title}</span>
                <button
                  onClick={() => revokeExemption(sec.id)}
                  className="rounded border border-ink-600 px-2 py-1 font-semibold text-slate-300 hover:bg-ink-800"
                >
                  Anular
                </button>
              </div>
            ))}
          </div>
        )}
      </Panel>
```

with this derived state inside `ProfilePage`:

```tsx
  const placement = useStore((st) => st.placement);
  const revokeExemption = useStore((st) => st.revokeExemption);
  const exempt = useStore((st) => st.exempt);
  // Derived OUTSIDE the selector on purpose: a selector that builds a new array
  // on every call returns a fresh reference each time, which makes zustand v5's
  // useSyncExternalStore treat the snapshot as perpetually changed.
  const exemptSections = SECTIONS.filter((sec) =>
    sectionExempt({ exempt }, modulesOf(sec.id).map((m) => m.id)),
  );
```

Add the imports: `Link` from `react-router-dom`, and `SECTIONS`, `modulesOf`, `sectionById` from `../data/course`, `sectionExempt` from `../lib/placement`.

- [ ] **Step 5: Type-check**

```bash
eval "$(fnm env)" && npm run build && npm test
```

Expected: build succeeds, all tests still pass.

- [ ] **Step 6: Verify in the Browser pane**

With the dev server running, open the app and confirm: the Dashboard shows the placement banner, `/#/section/sp1` renders normally with no exemption band (nothing is exempt yet), and Profile shows the empty placement panel. No console errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/SectionPage.tsx src/pages/ModulePage.tsx src/pages/Dashboard.tsx src/pages/ProfilePage.tsx
git commit -m "feat: show convalidated theory across section, module, dashboard and profile"
```

---

## Content authoring rules — read before Tasks 9 to 13

All five content tasks write to the same shape and the same bar. These rules are part of every one of them.

- **English** prompt, four English choices, English `explain`. Longer than 20 characters, 2-3 sentences.
- **Scenario-based, not definitional.** Give a situation and ask for the BEST or MOST likely choice, the way the real exam does. A question answerable by recognizing a keyword does not belong in a placement block — this bank decides whether someone skips a whole section.
- The three wrong choices must each be plausible to someone with partial knowledge. No filler options.
- The explanation says why the right answer wins **and** why the most tempting wrong one loses.
- Never reuse a prompt from the corresponding lesson files (`src/data/secplus/spN-part*.ts`). The disjointness test in Task 9 compares normalized prompts and will catch it.
- **Nor reuse a lesson's worked example.** The test only compares prompts, so it cannot see a stem rebuilt from a scenario the lesson body already walks through. Read the lesson's tables and callouts, not just its questions, and pick a different situation.
- **Summary tables are the worst offender.** Domain 2's draft took five of its twelve stems from `sp2-part*.ts` symptom→mitigation rows — one item was a row's symptom, its answer was the row's second cell, and its explanation translated the row's third. A learner who read that table answers by recall, not by reasoning. Before writing a stem, search the lesson files for the concept and check you are not dramatizing a row someone has already memorized.
- **Do not reference the SDD workspace from source files.** `.superpowers/` is git-ignored scratch that gets deleted when the plan finishes; a header comment pointing into it is a dead link the day it is written. Cite `docs/superpowers/plans/` or `docs/superpowers/specs/` instead.
- Every question carries its block's `domain`, and ids run `pl-spNq1` … `pl-spNq12` with no gaps.

**Do not leak the answer through the shape of the options.** Learned from the Domain 1 block, whose first draft keyed index 1 seven times out of twelve and index 3 never, with the correct option also being the longest in seven items. At a 10/12 pass bar that hands a test-wise candidate with partial knowledge a free lift — and a pass here skips a whole section. So:

- Spread the keyed index roughly evenly across 0-3 over the twelve questions. Never leave an index unused.
- Keep the four options about the same length. If the right answer needs a "because…" clause, either give the distractors one too or move the reasoning into `explain`, where it belongs.
- Every distractor must be a real candidate. Options nobody would pick turn a four-way item into a two-way one; the Domain 1 draft did this with Steganography and Key escrow in a de-identification question.
- **Concretely: keep all four options in the same category and medium as the key.** Domain 2's draft offered RFID cloning and Evil twin against a stem that says "Bluetooth-enabled", and watering hole and typosquatting against a face-to-face scenario — eliminable without knowing anything about the topic. If the key is a Bluetooth attack, all four should be proximity attacks. Check each item by asking: could someone who knows nothing about this domain still delete two options? If yes, rewrite them.
- **The stem must not contain its own answer.** Domain 2's draft asked what would have prevented a breach after a stem that said a vendor fix existed and had not been applied — answerable from English alone. If a careful reader with zero domain knowledge can pick the key, the item measures nothing.
- **The single test that matters: the stem must supply triggering facts for more than one option.** Domain 3's draft failed this in ten of twelve items and had to be rebuilt. The failing shape is always the same — the stem narrates the key's mechanism in plain language, and each distractor names a concept whose triggering facts the stem never mentions, so the reader picks the only option the stem describes. "The laptop never had disk encryption enabled" → key *Enabling full-disk encryption* is the extreme case, but "a third-party vendor" → *Third-party vendor risk* fails it too. Write the situation so that two or three options each have something in the stem pointing at them, and the candidate must decide which applies MOST directly. That decision is the thing you are measuring; without it there is nothing to measure.
- **Nor may it eliminate the distractors by naming them.** The natural fix for the rule above is to say what was already in place — and Domain 2's rewrite then glossed each option in the stem ("configurations still matched the approved baseline" for *Configuration enforcement*, "sat in its properly assigned network zone" for *Segmentation*). A reader who knows none of the four still solves it by matching English. State the controls already in place **operationally**: "a quarterly review had found no unauthorised services enabled", not "configuration enforcement was in place".
- Do not let the stem echo the key's wording. A stem saying "logical volumes" whose answer is "volume-level encryption" tests reading, not knowledge.

**Explanations must be mechanically true, not just directionally right.** A study product teaches by its explanations. The Domain 1 draft described a SHA-1 collision as letting an attacker match the hash of an existing legitimate file — that is a second preimage, which is still infeasible; a collision means the attacker crafts *both* files. An explanation that lands on the correct answer through a mechanism that does not exist is a defect, even when the key is right.

Worked example of the required shape and difficulty:

```ts
    {
      id: 'pl-sp1q4',
      domain: 'General Security Concepts',
      prompt:
        'A hospital issues a certificate to an internal application server from its own CA. Six weeks later, staff browsers begin rejecting the site even though the certificate has not expired. The CA is reachable and its own certificate is valid. Which check is MOST likely failing?',
      choices: [
        'The certificate revocation status returned by OCSP',
        'The subject alternative name against the hostname',
        'The key usage extension for digital signature',
        'The certificate chain depth allowed by the browser',
      ],
      answer: 0,
      explain:
        'A certificate that is unexpired and correctly chained but suddenly rejected fleet-wide points at revocation: the CA published it to its CRL or OCSP responder and clients now honour that. A SAN mismatch is the other common cause of sudden rejection, but it would have failed from the first day rather than six weeks in.',
    },
```

---

### Task 9: Content integrity tests and the Domain 1 block

**Files:**
- Create: `src/data/secplus/placement-sp1.ts`
- Create: `src/data/secplus/placement.ts`
- Modify: `src/data/tracks.ts` (`secplus.placement`)
- Modify: `src/data/content.test.ts`

**Interfaces:**
- Consumes: `PlacementBlock` (Task 1), `ALL_PLACEMENT` (Task 4).
- Produces: `SP1_PLACEMENT: PlacementBlock` and `SP_PLACEMENT: PlacementBlock[]`.

The integrity tests iterate over whatever blocks exist, so they pass meaningfully from this task on. The "one block per content section" completeness test lands in Task 14, when all five exist.

- [ ] **Step 1: Write the failing tests**

Append to `src/data/content.test.ts`:

```ts
import { ALL_PLACEMENT } from './course';
import { PLACEMENT_BLOCK_N } from '../lib/placement';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

describe('placement blocks', () => {
  it('hold exactly 12 well-formed questions in their own domain', () => {
    for (const b of ALL_PLACEMENT) {
      expect(b.questions, b.id).toHaveLength(PLACEMENT_BLOCK_N);
      for (const q of b.questions) {
        expect(q.choices, q.id).toHaveLength(4);
        expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
        expect(q.answer, q.id).toBeLessThan(4);
        expect(q.explain.length, q.id).toBeGreaterThan(20);
        expect(q.domain, q.id).toBe(b.domain);
      }
    }
  });

  it('use the pl- id family and are globally unique', () => {
    const ids = ALL_PLACEMENT.flatMap((b) => [b.id, ...b.questions.map((q) => q.id)]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith('pl-'), id).toBe(true);
    const lesson = new Set([
      ...ALL_QUESTIONS.map((q) => q.id),
      ...ALL_MODULES.map((m) => m.id),
    ]);
    for (const id of ids) expect(lesson.has(id), id).toBe(false);
  });

  it('never reuse a lesson question', () => {
    const lesson = new Set(ALL_QUESTIONS.map((q) => norm(q.prompt)));
    for (const b of ALL_PLACEMENT) {
      for (const q of b.questions) {
        expect(lesson.has(norm(q.prompt)), q.id).toBe(false);
      }
    }
  });

  it('point at a section that exists', () => {
    for (const b of ALL_PLACEMENT) {
      expect(sectionById(b.sectionId), b.id).toBeDefined();
    }
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
eval "$(fnm env)" && npm test -- src/data/content.test.ts
```

Expected: FAIL — `ALL_PLACEMENT is not exported` if Task 4 has not landed; otherwise the suite passes vacuously over an empty array. If it passes vacuously, that is expected: the tests start biting in Step 4.

- [ ] **Step 3: Create the aggregator**

Create `src/data/secplus/placement.ts`:

```ts
import type { PlacementBlock } from '../../lib/types';
import { SP1_PLACEMENT } from './placement-sp1';

/** Security+ placement blocks, one per content section (sp1-sp5). */
export const SP_PLACEMENT: PlacementBlock[] = [SP1_PLACEMENT];
```

Then in `src/data/tracks.ts`, import `SP_PLACEMENT` and set `placement: SP_PLACEMENT` on the `secplus` literal (replacing `placement: []`).

- [ ] **Step 4: Write the Domain 1 block**

Create `src/data/secplus/placement-sp1.ts` exporting `SP1_PLACEMENT: PlacementBlock` with:

- `id: 'pl-sp1'`, `sectionId: 'sp1'`, `domain: 'General Security Concepts'`
- `title: 'Dominio 1 · Conceptos generales de seguridad'`
- `blurb: 'Tipos de control, CIA, AAA, zero trust, criptografía y PKI, gestión del cambio.'`
- `questions`: exactly 12, ids `pl-sp1q1` … `pl-sp1q12`, every one `domain: 'General Security Concepts'`.

Coverage — at least one question per SY0-701 objective in the domain, weighted toward what actually separates someone who knows the material from someone who has only read it:

| Objective | Questions |
| --- | --- |
| 1.1 Security controls (categories and types) | 2 |
| 1.2 Fundamental concepts (CIA, AAA, zero trust, deception) | 3 |
| 1.3 Change management and its security impact | 2 |
| 1.4 Cryptographic solutions (PKI, encryption levels, certificates, hashing, obfuscation) | 5 |

Follow the **Content authoring rules** section above, and do not reuse any prompt from `src/data/secplus/sp1-part*.ts`.

- [ ] **Step 5: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: PASS, with the placement suite now checking 12 real questions.

- [ ] **Step 6: Verify in the Browser pane**

Open `http://localhost:5173/#/placement` on the Security+ track. Confirm the Domain 1 card renders as «Sin hacer», run the block end to end, and check that: no confidence buttons appear, no XP toast fires per answer, the result screen shows the review, and the «Convalidar» button appears only at ≥80%. Then check `/#/section/sp1` shows the exemption band, and press «Anular convalidación» to confirm it disappears.

- [ ] **Step 7: Commit**

```bash
git add src/data/secplus/placement-sp1.ts src/data/secplus/placement.ts src/data/tracks.ts src/data/content.test.ts
git commit -m "feat: placement block for Security+ domain 1"
```

---

### Task 10: Domain 2 block

**Files:**
- Create: `src/data/secplus/placement-sp2.ts`
- Modify: `src/data/secplus/placement.ts`

**Interfaces:**
- Consumes: `PlacementBlock` (Task 1).
- Produces: `SP2_PLACEMENT: PlacementBlock`.

- [ ] **Step 1: Write the block**

Create `src/data/secplus/placement-sp2.ts` exporting `SP2_PLACEMENT` with `id: 'pl-sp2'`, `sectionId: 'sp2'`, `domain: 'Threats, Vulnerabilities & Mitigations'`, `title: 'Dominio 2 · Amenazas, vulnerabilidades y mitigaciones'`, `blurb: 'Actores de amenaza, vectores, ingeniería social, vulnerabilidades, indicadores y mitigación.'`, and 12 questions with ids `pl-sp2q1` … `pl-sp2q12`.

Coverage:

| Objective | Questions |
| --- | --- |
| 2.1 Threat actors and motivations | 2 |
| 2.2 Threat vectors and attack surfaces | 2 |
| 2.3 Vulnerability types | 2 |
| 2.4 Indicators of malicious activity | 3 |
| 2.5 Mitigation techniques | 3 |

Follow the **Content authoring rules** section above, and do not reuse any prompt from `src/data/secplus/sp2-part*.ts`.

- [ ] **Step 2: Register it**

In `src/data/secplus/placement.ts`, import `SP2_PLACEMENT` and add it to the array after `SP1_PLACEMENT`.

- [ ] **Step 3: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/secplus/placement-sp2.ts src/data/secplus/placement.ts
git commit -m "feat: placement block for Security+ domain 2"
```

---

### Task 11: Domain 3 block

**Files:**
- Create: `src/data/secplus/placement-sp3.ts`
- Modify: `src/data/secplus/placement.ts`

**Interfaces:**
- Consumes: `PlacementBlock` (Task 1).
- Produces: `SP3_PLACEMENT: PlacementBlock`.

- [ ] **Step 1: Write the block**

Create `src/data/secplus/placement-sp3.ts` exporting `SP3_PLACEMENT` with `id: 'pl-sp3'`, `sectionId: 'sp3'`, `domain: 'Security Architecture'`, `title: 'Dominio 3 · Arquitectura de seguridad'`, `blurb: 'Modelos de arquitectura, principios de diseño seguro, protección de datos y resiliencia.'`, and 12 questions with ids `pl-sp3q1` … `pl-sp3q12`.

Coverage:

| Objective | Questions |
| --- | --- |
| 3.1 Architecture models (cloud, IaC, serverless, microservices, network infrastructure) | 4 |
| 3.2 Secure design principles for enterprise infrastructure | 3 |
| 3.3 Protecting data (classification, states, methods) | 3 |
| 3.4 Resilience and recovery | 2 |

Follow the **Content authoring rules** section above, and do not reuse any prompt from `src/data/secplus/sp3-part*.ts`.

- [ ] **Step 2: Register it**

In `src/data/secplus/placement.ts`, import `SP3_PLACEMENT` and add it to the array after `SP2_PLACEMENT`.

- [ ] **Step 3: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/secplus/placement-sp3.ts src/data/secplus/placement.ts
git commit -m "feat: placement block for Security+ domain 3"
```

---

### Task 12: Domain 4 block

**Files:**
- Create: `src/data/secplus/placement-sp4.ts`
- Modify: `src/data/secplus/placement.ts`

**Interfaces:**
- Consumes: `PlacementBlock` (Task 1).
- Produces: `SP4_PLACEMENT: PlacementBlock`.

Domain 4 is the largest on the real exam (28%) and the largest here — 11 lessons across `sp4-part1..6.ts`. It still gets 12 questions like every other block, so the selection has to be ruthless about what actually separates competence from familiarity.

- [ ] **Step 1: Write the block**

Create `src/data/secplus/placement-sp4.ts` exporting `SP4_PLACEMENT` with `id: 'pl-sp4'`, `sectionId: 'sp4'`, `domain: 'Security Operations'`, `title: 'Dominio 4 · Operaciones de seguridad'`, `blurb: 'Hardening, gestión de vulnerabilidades, monitorización, IAM, automatización y respuesta a incidentes.'`, and 12 questions with ids `pl-sp4q1` … `pl-sp4q12`.

Coverage:

| Objective | Questions |
| --- | --- |
| 4.1-4.2 Secure baselines and hardening across device classes | 2 |
| 4.3-4.4 Vulnerability management and alerting/monitoring | 3 |
| 4.5-4.6 Enterprise security capabilities and IAM | 3 |
| 4.7 Automation and orchestration | 1 |
| 4.8 Incident response | 2 |
| 4.9 Data sources for investigation | 1 |

Follow the **Content authoring rules** section above, and do not reuse any prompt from `src/data/secplus/sp4-part*.ts`.

- [ ] **Step 2: Register it**

In `src/data/secplus/placement.ts`, import `SP4_PLACEMENT` and add it to the array after `SP3_PLACEMENT`.

- [ ] **Step 3: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/secplus/placement-sp4.ts src/data/secplus/placement.ts
git commit -m "feat: placement block for Security+ domain 4"
```

---

### Task 13: Domain 5 block

**Files:**
- Create: `src/data/secplus/placement-sp5.ts`
- Modify: `src/data/secplus/placement.ts`

**Interfaces:**
- Consumes: `PlacementBlock` (Task 1).
- Produces: `SP5_PLACEMENT: PlacementBlock`.

- [ ] **Step 1: Write the block**

Create `src/data/secplus/placement-sp5.ts` exporting `SP5_PLACEMENT` with `id: 'pl-sp5'`, `sectionId: 'sp5'`, `domain: 'Security Program Management & Oversight'`, `title: 'Dominio 5 · Gestión y supervisión del programa'`, `blurb: 'Gobernanza, gestión de riesgos, terceros, cumplimiento, auditoría y concienciación.'`, and 12 questions with ids `pl-sp5q1` … `pl-sp5q12`.

Coverage:

| Objective | Questions |
| --- | --- |
| 5.1 Security governance (policies, standards, roles) | 2 |
| 5.2 Risk management process | 3 |
| 5.3 Third-party risk | 2 |
| 5.4 Compliance | 2 |
| 5.5-5.6 Audits, assessments and penetration testing | 2 |
| 5.7 Security awareness practices | 1 |

Follow the **Content authoring rules** section above, and do not reuse any prompt from `src/data/secplus/sp5-part*.ts`.

- [ ] **Step 2: Register it**

In `src/data/secplus/placement.ts`, import `SP5_PLACEMENT` and add it to the array after `SP4_PLACEMENT`.

- [ ] **Step 3: Run the tests and the type-check**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/secplus/placement-sp5.ts src/data/secplus/placement.ts
git commit -m "feat: placement block for Security+ domain 5"
```

---

### Task 14: Completeness test, docs, and end-to-end verification

**Files:**
- Modify: `src/data/content.test.ts`
- Modify: `CLAUDE.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: everything above.
- Produces: no new exports.

- [ ] **Step 1: Write the failing completeness test**

Append to the `placement blocks` describe in `src/data/content.test.ts`:

```ts
  it('secplus has exactly one block per content section, in order', () => {
    const secs = contentSections('secplus').map((s) => s.id);
    expect(TRACKS.secplus.placement.map((b) => b.sectionId)).toEqual(secs);
  });

  it('a track with no placement test is allowed', () => {
    for (const t of Object.values(TRACKS)) {
      const ids = t.placement.map((b) => b.sectionId);
      expect(ids.length === 0 || ids.length === contentSections(t.id).length).toBe(true);
    }
  });
```

Add `contentSections` to the import from `./course`.

- [ ] **Step 2: Run it**

```bash
eval "$(fnm env)" && npm test -- src/data/content.test.ts
```

Expected: PASS if Tasks 9-13 all landed. If it fails with a length mismatch, a block is missing or out of order in `src/data/secplus/placement.ts`.

- [ ] **Step 3: Full end-to-end verification in the Browser pane**

With the dev server running, on the Security+ track:

1. Dashboard shows the placement banner. Follow it to `/placement`; all five domain cards render as «Sin hacer».
2. Run Domain 1 deliberately badly (under 80%). Confirm the result says «Por debajo del 80%», the review renders, and no «Convalidar» button appears.
3. Retry it and pass. Convalidate. Confirm the toast fires and the card now reads «Convalidada · N%».
4. Open `/#/section/sp1`: the exemption band is there, the module rows show the ⏩ chip, the mastery ring moved up but is **below 100**, and the labs and boss are untouched.
5. Open one exempted lesson: the banner appears, and finishing it flips that row to the emerald ✓.
6. Dashboard: «Continuar estudio» now points outside Domain 1, and the banner has collapsed to the one-line link.
7. Profile: the placement history lists both attempts and the active exemption, and «Anular» removes it. Return to `/#/section/sp1` and confirm the band is gone and the mastery ring dropped back.
8. Check the browser console for errors throughout.

- [ ] **Step 4: Update the docs**

In `CLAUDE.md`, under **Architecture notes**, add a bullet after the Gamification engine one:

```markdown
- **Placement test.** `TRACKS[t].placement` holds one `PlacementBlock` (12 dedicated questions,
  never reused from the lesson bank) per content section. Passing at ≥80% lets the learner
  *convalidate* that section's theory: `store.exempt` maps moduleId → `ExemptEntry`, read
  everywhere through `isDone`/`exemptScore` in `lib/placement.ts`. Labs and bosses are never
  exempted. Exemption is revocable, which is why `mergeProgress` is **no longer monotonic for
  `exempt`** — that field is last-write-wins by `at`. Persist version **3**. GCTI's `placement`
  is still `[]` and the UI degrades cleanly.
```

Also update the persist-version sentence near the top of the file (it currently says version 2) and the test count in **State & gotchas**.

In `README.md`, add the placement test to the Spanish feature list, in the same voice as the surrounding entries: what it is, that it is optional, and that convalidating never touches labs or bosses.

- [ ] **Step 5: Run the full suite and build**

```bash
eval "$(fnm env)" && npm test && npm run build
```

Expected: all tests PASS and the build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/data/content.test.ts CLAUDE.md README.md
git commit -m "test: placement completeness, and document the feature"
```

---

## After the plan

The branch `placement-test` is then ready for `superpowers:requesting-code-review` and, once reviewed, `superpowers:finishing-a-development-branch`. Note that merging to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci`, `npm test` and `npm run build` before publishing to GitHub Pages — a red test blocks the deploy, which is the intended safety net.

Phase 2 (the five GCTI blocks) gets its own plan and needs no engine work: create `src/data/placement-gcti.ts` following Tasks 9-13, set `gcti.placement`, and the completeness test in Task 14 Step 1 starts covering it automatically.

## Follow-ups left open when this plan closed

All 14 tasks shipped and the final whole-branch review returned **no Critical findings** and a merge-ready verdict. These were consciously deferred rather than forgotten.

**One regression introduced by the final fix wave.** The «Convalidar sección» card is now a button rather than a link into the runner — which is the point, it used to start a fresh test — but that state's card no longer offers any way back into the block. A learner who passed at 83%, declined to convalidate, and later wants a better score before cashing in has no in-app route to retake it. Every other state still links to the runner. Fix: add a secondary «Repetir bloque» link beside the button.

**Two content items whose keys are not sourced from the material they gate.** `pl-sp3q7` turns on DHCP-reservation semantics, MAC filtering and port-inactivity shutdown, none of which Domain 3 teaches. `pl-sp5q12` was the awareness block's weakest gate before its rewrite and still carries three separate review notes. Both should be revisited alongside the Phase 2 content work, when a content author is loaded on this material anyway.

**A pre-existing UI hazard worth confirming.** `components/Toasts.tsx` renders each toast card with `pointer-events-auto` inside a `fixed bottom-4 right-4 z-50` stack for 3.8 s. On a short viewport a toast can sit over a control and swallow one click. This is the best mechanical explanation for a "first click did not register" anomaly seen twice during this plan's browser verification, and it is unrelated to the placement feature — it would affect any button in that corner.

**Smaller, all optional.** No test covers `mergePlacement`'s collision tie-break. An exemption's score cannot be improved by a later better retake, because the runner's result screen shows the already-convalidated message with no re-grant button. `sectionExempt` is a `.some()`, so a partially exempt section — reachable only through a divergent sync merge — displays as fully convalidated. Placement answers advance the daily question quests, which the spec's XP ceiling arithmetic does not account for. The bundle is a single 1.79 MB chunk; placement adds about 6% to a file that was already oversized, so code-splitting `src/data` is worth its own task.
