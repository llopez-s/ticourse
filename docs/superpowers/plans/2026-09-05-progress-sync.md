# Progress Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let one learner continue studying across devices by entering a private sync code, with no accounts and no data loss.

**Architecture:** The app stays a static site. The sync code is hashed in the browser (SHA-256) and only the digest reaches a small Cloudflare Worker that stores one JSON blob per digest in KV. Conflicts are resolved client-side by a pure, field-aware merge: unions for completed work, maxima for records and counters, never a sum.

**Tech Stack:** TypeScript (strict) · React 19 · Zustand (persist) · Vite 7 · vitest · Cloudflare Workers + KV · wrangler.

**Spec:** `docs/superpowers/specs/2026-09-05-progress-sync-design.md`

## Global Constraints

- Run everything from `D:\LLM projects\TICourse`. Node comes from fnm — in Bash run `eval "$(fnm env)"` first if `npm` is not on PATH.
- **Bash gotcha in this harness:** a command containing backticks fails to parse before it runs. Write patch scripts to the scratchpad or use Write/Edit instead of inline heredocs containing backticks.
- The repo is **public**. Never commit a sync code, a Cloudflare API token, or any secret.
- `SYNC_URL` starts as the empty string. With it empty the feature is inert: no network calls, panel shows "no disponible". It is filled in at Task 8 only.
- Sync is **opt-in and off by default**. With no code set, no sync code path runs and app behaviour is byte-identical to today.
- `localStorage` remains the source of truth. A failed pull must never modify local progress.
- The sync code lives in its own persisted store (`intelforge-sync`), never inside the progress blob (`intelforge-v1`), so it is never uploaded.
- Existing tests must keep passing: `npm test` is currently **32 tests, 6 files**, all green.
- UI copy is Spanish, addressing the learner in feminine ("analista", "conectada").
- Do not touch `src/data/**` — this feature is engine-only.
- Root `tsconfig.json` and `vitest.config.ts` scope to `src`, so `worker/` is excluded from the app build and test run. Keep it that way; the Worker gets its own `package.json` and `tsconfig.json`.
- End every commit message with:
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

---

## File structure

| File | Responsibility |
|---|---|
| `src/lib/sync.ts` | Pure logic + API client: `hashCode`, `mergeProgress`, `pull`, `push`, `SYNC_URL`, `generateCode`, `isWeakCode` |
| `src/lib/sync.test.ts` | Merge property tests and field-rule tests (pure, no network) |
| `src/lib/syncStore.ts` | Zustand store for `{ code, status, lastSyncedAt, error }`, persisted under `intelforge-sync` |
| `src/lib/useSync.ts` | The one effect that wires triggers (mount, debounce, tab-hide) to `syncNow` |
| `src/components/SyncPanel.tsx` | Profile UI: code field, generate, status, manual sync, disconnect |
| `src/pages/ProfilePage.tsx` | Mounts `<SyncPanel />` |
| `src/App.tsx` | Calls `useSync()` once |
| `worker/src/index.ts` | The Worker: GET/PUT/OPTIONS on `/p/:hash` |
| `worker/wrangler.toml` | Worker name `ticourse-sync`, KV binding `PROGRESS` |
| `worker/package.json`, `worker/tsconfig.json` | Worker-local deps and types, isolated from the app |
| `worker/README.md` | Deploy steps for a fresh Cloudflare account |
| `README.md`, `CLAUDE.md` | Correct the privacy claim; document sync |

---

### Task 1: Merge core — unions, maxima and the snapshot fixture

**Files:**
- Create: `src/lib/sync.ts`
- Test: `src/lib/sync.test.ts`

**Interfaces:**
- Consumes: `ProgressSnapshot`, `CardState`, `ExamResult`, `Conf`, `TrackId` from `src/lib/types.ts`.
- Produces: `export function mergeProgress(a: ProgressSnapshot, b: ProgressSnapshot): ProgressSnapshot` and `export function emptySnapshot(): ProgressSnapshot` (test helper, exported for reuse in later tasks).

- [ ] **Step 1: Write the failing test**

Create `src/lib/sync.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { emptySnapshot, mergeProgress } from './sync';
import type { ProgressSnapshot } from './types';

const snap = (over: Partial<ProgressSnapshot> = {}): ProgressSnapshot => ({
  ...emptySnapshot(),
  ...over,
});

describe('mergeProgress — completion and records', () => {
  it('unions completed lessons and labs', () => {
    const a = snap({ lessons: { s1m1: true }, labs: { lab1a: true } });
    const b = snap({ lessons: { sp1m1: true }, labs: { spl1a: true } });
    const m = mergeProgress(a, b);
    expect(m.lessons).toEqual({ s1m1: true, sp1m1: true });
    expect(m.labs).toEqual({ lab1a: true, spl1a: true });
  });

  it('keeps the best quiz and boss scores', () => {
    const a = snap({ quizBest: { s1m1: 90, s1m2: 40 }, bosses: { s1: 100 } });
    const b = snap({ quizBest: { s1m1: 70, s1m2: 85 }, bosses: { s1: 80, s2: 90 } });
    const m = mergeProgress(a, b);
    expect(m.quizBest).toEqual({ s1m1: 90, s1m2: 85 });
    expect(m.bosses).toEqual({ s1: 100, s2: 90 });
  });

  it('takes the max xp and the max of every total', () => {
    const a = snap({ xp: 1200, totals: { ...emptySnapshot().totals, questions: 300, maxCombo: 4 } });
    const b = snap({ xp: 900, totals: { ...emptySnapshot().totals, questions: 120, maxCombo: 9 } });
    const m = mergeProgress(a, b);
    expect(m.xp).toBe(1200);
    expect(m.totals.questions).toBe(300);
    expect(m.totals.maxCombo).toBe(9);
  });

  it('maxes activity per day instead of summing it', () => {
    const a = snap({ activity: { '2026-09-01': 120, '2026-09-02': 50 } });
    const b = snap({ activity: { '2026-09-01': 80, '2026-09-03': 30 } });
    expect(mergeProgress(a, b).activity).toEqual({
      '2026-09-01': 120,
      '2026-09-02': 50,
      '2026-09-03': 30,
    });
  });

  it('keeps the earliest unlock date for an achievement', () => {
    const a = snap({ achievements: { 'first-lesson': '2026-08-01T10:00:00.000Z' } });
    const b = snap({ achievements: { 'first-lesson': '2026-09-01T10:00:00.000Z', scholar: '2026-09-02T10:00:00.000Z' } });
    const m = mergeProgress(a, b);
    expect(m.achievements['first-lesson']).toBe('2026-08-01T10:00:00.000Z');
    expect(m.achievements.scholar).toBe('2026-09-02T10:00:00.000Z');
  });

  it('keeps the local track preference (the first argument)', () => {
    expect(mergeProgress(snap({ track: 'secplus' }), snap({ track: 'gcti' })).track).toBe('secplus');
  });

  it('takes calibration from the side with more answers, never field-wise', () => {
    const a = snap({ calibration: { low: { n: 2, c: 1 }, med: { n: 50, c: 30 }, high: { n: 4, c: 4 } } });
    const b = snap({ calibration: { low: { n: 9, c: 5 }, med: { n: 10, c: 9 }, high: { n: 4, c: 2 } } });
    const m = mergeProgress(a, b);
    expect(m.calibration.low).toEqual({ n: 9, c: 5 }); // b has more answers
    expect(m.calibration.med).toEqual({ n: 50, c: 30 }); // a has more answers
    expect(m.calibration.high).toEqual({ n: 4, c: 4 }); // tie on n, higher c wins
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/sync.test.ts`
Expected: FAIL — `Failed to resolve import "./sync"`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/sync.ts`:

```ts
import type { Conf, ProgressSnapshot } from './types';

/** A zero-valued snapshot. Mirrors initialState() in store.ts. */
export function emptySnapshot(): ProgressSnapshot {
  return {
    track: 'gcti',
    xp: 0,
    streak: { current: 0, best: 0, lastDay: null, freezes: 1 },
    activity: {},
    lessons: {},
    quizBest: {},
    labs: {},
    bosses: {},
    exams: [],
    srs: {},
    calibration: {
      low: { n: 0, c: 0 },
      med: { n: 0, c: 0 },
      high: { n: 0, c: 0 },
    },
    totals: {
      questions: 0,
      correct: 0,
      cards: 0,
      maxCombo: 0,
      highConfCorrect: 0,
      perfectQuizzes: 0,
      questsDone: 0,
      checkpoints: 0,
    },
    achievements: {},
    day: {
      date: '1970-01-01',
      lessons: 0,
      questions: 0,
      correct: 0,
      cards: 0,
      labs: 0,
      highConfCorrect: 0,
      xpEarned: 0,
      newCards: 0,
      questsAwarded: [],
    },
  };
}

const keysOf = <T>(a: Record<string, T>, b: Record<string, T>) =>
  Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));

/** Union of two boolean maps: present-and-true on either side wins. */
function unionFlags(
  a: Record<string, boolean>,
  b: Record<string, boolean>,
): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const k of keysOf(a, b)) if (a[k] || b[k]) out[k] = true;
  return out;
}

/** Union of two numeric maps, keeping the larger value per key. */
function maxNumbers(
  a: Record<string, number>,
  b: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const k of keysOf(a, b)) out[k] = Math.max(a[k] ?? 0, b[k] ?? 0);
  return out;
}

/**
 * Merge two progress snapshots. Commutative, idempotent and monotonic: no
 * counter decreases and no completed work is lost, so merge order never
 * matters and repeating a sync changes nothing.
 *
 * `a` is treated as the local snapshot: its `track` (a UI preference, not
 * progress) is preserved.
 */
export function mergeProgress(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot {
  const achievements: Record<string, string> = {};
  for (const k of keysOf(a.achievements, b.achievements)) {
    const x = a.achievements[k];
    const y = b.achievements[k];
    // earliest unlock wins — an achievement cannot be un-earned
    achievements[k] = x && y ? (x < y ? x : y) : (x ?? y);
  }

  const calibration = {} as ProgressSnapshot['calibration'];
  for (const level of ['low', 'med', 'high'] as Conf[]) {
    const x = a.calibration[level];
    const y = b.calibration[level];
    // take one side wholesale: field-wise maxima could yield c > n
    calibration[level] =
      y.n > x.n || (y.n === x.n && y.c > x.c) ? { ...y } : { ...x };
  }

  return {
    track: a.track,
    xp: Math.max(a.xp, b.xp),
    streak: mergeStreak(a, b),
    activity: maxNumbers(a.activity, b.activity),
    lessons: unionFlags(a.lessons, b.lessons),
    quizBest: maxNumbers(a.quizBest, b.quizBest),
    labs: unionFlags(a.labs, b.labs),
    bosses: maxNumbers(a.bosses, b.bosses),
    exams: mergeExams(a, b),
    srs: mergeSrs(a, b),
    calibration,
    totals: {
      questions: Math.max(a.totals.questions, b.totals.questions),
      correct: Math.max(a.totals.correct, b.totals.correct),
      cards: Math.max(a.totals.cards, b.totals.cards),
      maxCombo: Math.max(a.totals.maxCombo, b.totals.maxCombo),
      highConfCorrect: Math.max(a.totals.highConfCorrect, b.totals.highConfCorrect),
      perfectQuizzes: Math.max(a.totals.perfectQuizzes, b.totals.perfectQuizzes),
      questsDone: Math.max(a.totals.questsDone, b.totals.questsDone),
      checkpoints: Math.max(a.totals.checkpoints, b.totals.checkpoints),
    },
    achievements,
    day: mergeDay(a, b),
  };
}
```

Add these three helpers **above** `mergeProgress` (they are filled in by Tasks 2 and 3; for now they must compile and satisfy this task's tests):

```ts
function mergeStreak(a: ProgressSnapshot, b: ProgressSnapshot) {
  return { ...a.streak, best: Math.max(a.streak.best, b.streak.best) };
}

function mergeExams(a: ProgressSnapshot, b: ProgressSnapshot) {
  return [...a.exams, ...b.exams];
}

function mergeSrs(a: ProgressSnapshot, b: ProgressSnapshot) {
  return { ...b.srs, ...a.srs };
}

function mergeDay(a: ProgressSnapshot, b: ProgressSnapshot) {
  return a.day.date >= b.day.date ? a.day : b.day;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/sync.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Typecheck and commit**

Run: `npx tsc --noEmit` → clean.

```bash
git add src/lib/sync.ts src/lib/sync.test.ts
git commit -m "feat(sync): merge core for unions, maxima and achievements

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Streak, day and exam merging

**Files:**
- Modify: `src/lib/sync.ts` (replace the `mergeStreak`, `mergeExams` and `mergeDay` stubs)
- Test: `src/lib/sync.test.ts` (append a new `describe`)

**Interfaces:**
- Consumes: `mergeProgress`, `emptySnapshot` from Task 1.
- Produces: no new exports; `mergeProgress` gains correct streak/day/exam behaviour.

- [ ] **Step 1: Write the failing test**

Append to `src/lib/sync.test.ts`:

```ts
describe('mergeProgress — streak, day and exams', () => {
  it('takes the live streak from the side with the later lastDay', () => {
    const a = snap({ streak: { current: 3, best: 9, lastDay: '2026-09-01', freezes: 1 } });
    const b = snap({ streak: { current: 7, best: 4, lastDay: '2026-09-04', freezes: 2 } });
    const m = mergeProgress(a, b);
    expect(m.streak.current).toBe(7);
    expect(m.streak.lastDay).toBe('2026-09-04');
    expect(m.streak.freezes).toBe(2);
    expect(m.streak.best).toBe(9); // best is always the max
  });

  it('treats a null lastDay as older than any date', () => {
    const a = snap({ streak: { current: 0, best: 0, lastDay: null, freezes: 1 } });
    const b = snap({ streak: { current: 5, best: 5, lastDay: '2026-09-02', freezes: 0 } });
    expect(mergeProgress(a, b).streak.lastDay).toBe('2026-09-02');
  });

  it('takes the later day wholesale', () => {
    const a = snap({ day: { ...emptySnapshot().day, date: '2026-09-04', questions: 12 } });
    const b = snap({ day: { ...emptySnapshot().day, date: '2026-09-05', questions: 3 } });
    expect(mergeProgress(a, b).day.date).toBe('2026-09-05');
    expect(mergeProgress(a, b).day.questions).toBe(3);
  });

  it('maxes counters and unions quests when the day is the same', () => {
    const a = snap({ day: { ...emptySnapshot().day, date: '2026-09-05', questions: 12, cards: 2, questsAwarded: ['q-lesson'] } });
    const b = snap({ day: { ...emptySnapshot().day, date: '2026-09-05', questions: 4, cards: 20, questsAwarded: ['q-cards'] } });
    const m = mergeProgress(a, b);
    expect(m.day.questions).toBe(12);
    expect(m.day.cards).toBe(20);
    expect(m.day.questsAwarded.sort()).toEqual(['q-cards', 'q-lesson']);
  });

  it('concatenates exams, de-duplicates identical ones and sorts by date', () => {
    const e1 = { date: '2026-09-01', track: 'secplus' as const, pct: 80, correct: 24, total: 30, domains: {} };
    const e2 = { date: '2026-09-03', track: 'secplus' as const, pct: 90, correct: 27, total: 30, domains: {} };
    const m = mergeProgress(snap({ exams: [e2, e1] }), snap({ exams: [e1] }));
    expect(m.exams).toHaveLength(2);
    expect(m.exams.map((e) => e.date)).toEqual(['2026-09-01', '2026-09-03']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/sync.test.ts`
Expected: FAIL — the streak test reports `current` 3 instead of 7, and the exam test reports 3 exams instead of 2.

- [ ] **Step 3: Write the implementation**

In `src/lib/sync.ts`, replace the three stubs with:

```ts
/** '' sorts before any 'YYYY-MM-DD', so a null lastDay is treated as oldest. */
const dayKey = (d: string | null) => d ?? '';

function mergeStreak(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot['streak'] {
  const best = Math.max(a.streak.best, b.streak.best);
  const ka = dayKey(a.streak.lastDay);
  const kb = dayKey(b.streak.lastDay);
  if (ka === kb) {
    // same day on both sides: keep the strongest state
    return {
      current: Math.max(a.streak.current, b.streak.current),
      best,
      lastDay: a.streak.lastDay,
      freezes: Math.max(a.streak.freezes, b.streak.freezes),
    };
  }
  const live = ka > kb ? a.streak : b.streak;
  return { ...live, best };
}

/** Identity of a stored exam attempt; ExamResult has no id field. */
const examKey = (e: ProgressSnapshot['exams'][number]) =>
  `${e.date}|${e.track}|${e.pct}|${e.correct}|${e.total}`;

function mergeExams(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot['exams'] {
  const byKey = new Map<string, ProgressSnapshot['exams'][number]>();
  for (const e of [...a.exams, ...b.exams]) {
    if (!byKey.has(examKey(e))) byKey.set(examKey(e), e);
  }
  return Array.from(byKey.values()).sort((x, y) =>
    x.date === y.date ? examKey(x).localeCompare(examKey(y)) : x.date < y.date ? -1 : 1,
  );
}

function mergeDay(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot['day'] {
  if (a.day.date !== b.day.date) return a.day.date > b.day.date ? a.day : b.day;
  return {
    date: a.day.date,
    lessons: Math.max(a.day.lessons, b.day.lessons),
    questions: Math.max(a.day.questions, b.day.questions),
    correct: Math.max(a.day.correct, b.day.correct),
    cards: Math.max(a.day.cards, b.day.cards),
    labs: Math.max(a.day.labs, b.day.labs),
    highConfCorrect: Math.max(a.day.highConfCorrect, b.day.highConfCorrect),
    xpEarned: Math.max(a.day.xpEarned, b.day.xpEarned),
    newCards: Math.max(a.day.newCards, b.day.newCards),
    questsAwarded: Array.from(
      new Set([...a.day.questsAwarded, ...b.day.questsAwarded]),
    ).sort(),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/sync.test.ts`
Expected: PASS, 12 tests.

- [ ] **Step 5: Typecheck and commit**

Run: `npx tsc --noEmit` → clean.

```bash
git add src/lib/sync.ts src/lib/sync.test.ts
git commit -m "feat(sync): merge streak, daily counters and exam history

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Flashcard schedule merging and the algebraic properties

**Files:**
- Modify: `src/lib/sync.ts` (replace the `mergeSrs` stub)
- Test: `src/lib/sync.test.ts` (append a new `describe`)

**Interfaces:**
- Consumes: `mergeProgress`, `emptySnapshot` from Task 1.
- Produces: no new exports; `mergeProgress` becomes provably idempotent, commutative and monotonic.

- [ ] **Step 1: Write the failing test**

First extend the existing type import at the top of `src/lib/sync.test.ts`:

```ts
import type { CardState, ProgressSnapshot } from './types';
```

Then append:

```ts
const card = (over: Partial<CardState> = {}): CardState => ({
  ease: 2.5,
  interval: 1,
  due: '2026-09-05',
  reps: 1,
  lapses: 0,
  ...over,
});

describe('mergeProgress — flashcard schedules', () => {
  it('keeps the more-reviewed card', () => {
    const a = snap({ srs: { fcp101: card({ reps: 5, interval: 21 }) } });
    const b = snap({ srs: { fcp101: card({ reps: 2, interval: 3 }) } });
    expect(mergeProgress(a, b).srs.fcp101.reps).toBe(5);
    expect(mergeProgress(a, b).srs.fcp101.interval).toBe(21);
  });

  it('breaks a reps tie on the longer interval, then the later due date', () => {
    const a = snap({ srs: { x: card({ reps: 3, interval: 10, due: '2026-09-10' }) } });
    const b = snap({ srs: { x: card({ reps: 3, interval: 30, due: '2026-09-30' }) } });
    expect(mergeProgress(a, b).srs.x.interval).toBe(30);
  });

  it('keeps cards that exist on only one side', () => {
    const a = snap({ srs: { one: card() } });
    const b = snap({ srs: { two: card() } });
    expect(Object.keys(mergeProgress(a, b).srs).sort()).toEqual(['one', 'two']);
  });
});

describe('mergeProgress — algebraic properties', () => {
  const rich = (): ProgressSnapshot =>
    snap({
      xp: 4200,
      streak: { current: 6, best: 11, lastDay: '2026-09-04', freezes: 2 },
      activity: { '2026-09-03': 90, '2026-09-04': 140 },
      lessons: { s1m1: true, sp2m3: true },
      quizBest: { s1m1: 88, sp2m3: 100 },
      labs: { spl1a: true },
      bosses: { sp1: 92 },
      exams: [{ date: '2026-09-04', track: 'secplus', pct: 84, correct: 76, total: 90, domains: {} }],
      srs: { fcp101: card({ reps: 4, interval: 25 }) },
      calibration: { low: { n: 10, c: 8 }, med: { n: 40, c: 31 }, high: { n: 20, c: 18 } },
      totals: { questions: 410, correct: 330, cards: 220, maxCombo: 12, highConfCorrect: 60, perfectQuizzes: 5, questsDone: 14, checkpoints: 40 },
      achievements: { 'first-lesson': '2026-08-20T09:00:00.000Z' },
      day: { ...emptySnapshot().day, date: '2026-09-04', questions: 30 },
    });

  const other = (): ProgressSnapshot =>
    snap({
      track: 'gcti',
      xp: 3100,
      streak: { current: 2, best: 14, lastDay: '2026-09-05', freezes: 0 },
      activity: { '2026-09-04': 60, '2026-09-05': 200 },
      lessons: { sp3m1: true },
      quizBest: { s1m1: 95 },
      labs: { spl2a: true },
      bosses: { sp1: 80, sp2: 88 },
      exams: [{ date: '2026-09-05', track: 'secplus', pct: 88, correct: 79, total: 90, domains: {} }],
      srs: { fcp101: card({ reps: 9, interval: 60 }), fcp202: card() },
      calibration: { low: { n: 4, c: 4 }, med: { n: 55, c: 40 }, high: { n: 12, c: 12 } },
      totals: { questions: 500, correct: 300, cards: 180, maxCombo: 8, highConfCorrect: 44, perfectQuizzes: 9, questsDone: 10, checkpoints: 61 },
      achievements: { 'first-lesson': '2026-09-01T09:00:00.000Z', scholar: '2026-09-02T09:00:00.000Z' },
      day: { ...emptySnapshot().day, date: '2026-09-05', questions: 8 },
    });

  it('is idempotent', () => {
    expect(mergeProgress(rich(), rich())).toEqual(rich());
  });

  it('is commutative apart from the local track preference', () => {
    const ab = mergeProgress(rich(), other());
    const ba = mergeProgress(other(), rich());
    expect({ ...ab, track: 'x' }).toEqual({ ...ba, track: 'x' });
  });

  it('never loses completed work', () => {
    const m = mergeProgress(rich(), other());
    expect(Object.keys(m.lessons).sort()).toEqual(['s1m1', 'sp2m3', 'sp3m1']);
    expect(Object.keys(m.labs).sort()).toEqual(['spl1a', 'spl2a']);
    expect(Object.keys(m.achievements).sort()).toEqual(['first-lesson', 'scholar']);
  });

  it('never lets a counter go backwards', () => {
    const [a, b] = [rich(), other()];
    const m = mergeProgress(a, b);
    expect(m.xp).toBeGreaterThanOrEqual(Math.max(a.xp, b.xp));
    expect(m.streak.best).toBeGreaterThanOrEqual(Math.max(a.streak.best, b.streak.best));
    for (const k of Object.keys(m.totals) as (keyof typeof m.totals)[]) {
      expect(m.totals[k], k).toBeGreaterThanOrEqual(Math.max(a.totals[k], b.totals[k]));
    }
  });

  it('never produces more correct answers than answers in calibration', () => {
    const m = mergeProgress(rich(), other());
    for (const level of ['low', 'med', 'high'] as const) {
      expect(m.calibration[level].c).toBeLessThanOrEqual(m.calibration[level].n);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/sync.test.ts`
Expected: FAIL — the "more-reviewed card" test gets `reps` 5 only by luck of spread order, and the commutativity test fails because `mergeSrs` prefers `a` regardless of content.

- [ ] **Step 3: Write the implementation**

In `src/lib/sync.ts`, replace the `mergeSrs` stub with:

```ts
/**
 * Pick the better-established of two schedules for the same card. The
 * comparison is total and decided purely by content, which is what keeps
 * mergeProgress commutative.
 */
function betterCard(x: CardState, y: CardState): CardState {
  if (x.reps !== y.reps) return x.reps > y.reps ? x : y;
  if (x.interval !== y.interval) return x.interval > y.interval ? x : y;
  if (x.due !== y.due) return x.due > y.due ? x : y;
  if (x.lapses !== y.lapses) return x.lapses < y.lapses ? x : y;
  return x.ease >= y.ease ? x : y;
}

function mergeSrs(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot['srs'] {
  const out: ProgressSnapshot['srs'] = {};
  for (const k of keysOf(a.srs, b.srs)) {
    const x = a.srs[k];
    const y = b.srs[k];
    out[k] = x && y ? { ...betterCard(x, y) } : { ...(x ?? y) };
  }
  return out;
}
```

Add `CardState` to the type import at the top of the file:

```ts
import type { CardState, Conf, ProgressSnapshot } from './types';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/sync.test.ts`
Expected: PASS, 20 tests.

- [ ] **Step 5: Run the whole suite, typecheck and commit**

Run: `npm test` → 6 files, 52 tests, all green (32 existing + 20 new).
Run: `npx tsc --noEmit` → clean.

```bash
git add src/lib/sync.ts src/lib/sync.test.ts
git commit -m "feat(sync): merge flashcard schedules; prove merge properties

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Code hashing, code generation and the API client

**Files:**
- Modify: `src/lib/sync.ts`
- Test: `src/lib/sync.test.ts` (append a new `describe`)

**Interfaces:**
- Consumes: `mergeProgress` from Tasks 1–3.
- Produces:
  - `export const SYNC_URL: string` (empty until Task 8)
  - `export async function hashCode(code: string): Promise<string>` — 64 lowercase hex chars
  - `export function generateCode(): string`
  - `export function isWeakCode(code: string): boolean`
  - `export async function pull(hash: string): Promise<ProgressSnapshot | null>` — `null` means "no remote blob yet"
  - `export async function push(hash: string, data: ProgressSnapshot): Promise<void>`
  - `export const SYNC_SCHEMA = 1`

- [ ] **Step 1: Write the failing test**

Append to `src/lib/sync.test.ts`:

```ts
import { generateCode, hashCode, isWeakCode } from './sync';

describe('sync codes', () => {
  it('hashes to 64 lowercase hex characters', async () => {
    expect(await hashCode('lidia-lopez-alumna')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is stable for the same code', async () => {
    expect(await hashCode('mi-codigo')).toBe(await hashCode('mi-codigo'));
  });

  it('normalizes case and surrounding whitespace so one code is one bucket', async () => {
    const base = await hashCode('mi-codigo');
    expect(await hashCode('  MI-Codigo  ')).toBe(base);
  });

  it('gives different codes different buckets', async () => {
    expect(await hashCode('codigo-a')).not.toBe(await hashCode('codigo-b'));
  });

  it('generates codes that are long and not flagged as weak', () => {
    const c = generateCode();
    expect(c.length).toBeGreaterThanOrEqual(20);
    expect(isWeakCode(c)).toBe(false);
    expect(generateCode()).not.toBe(c);
  });

  it('flags short codes as weak', () => {
    expect(isWeakCode('lidia')).toBe(true);
    expect(isWeakCode('lidia-lopez-alumna-7k2m9x')).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/sync.test.ts`
Expected: FAIL — `hashCode is not a function`.

- [ ] **Step 3: Write the implementation**

Append to `src/lib/sync.ts`:

```ts
/**
 * Base URL of the sync Worker. Public, not a secret. Empty disables the whole
 * feature: no network call is ever attempted and the UI says so.
 */
export const SYNC_URL = '';

/** Stored blob schema version. Bump when the snapshot shape changes. */
export const SYNC_SCHEMA = 1;

/** Codes shorter than this are guessable enough to warn about. */
const MIN_CODE_LENGTH = 16;

export const normalizeCode = (code: string) => code.trim().toLowerCase();

/**
 * SHA-256 of the normalized code, hex encoded. Runs in the browser, so the
 * code itself never reaches the network — the server only ever sees a digest.
 */
export async function hashCode(code: string): Promise<string> {
  const bytes = new TextEncoder().encode(normalizeCode(code));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const isWeakCode = (code: string) =>
  normalizeCode(code).length < MIN_CODE_LENGTH;

const WORDS = [
  'ancla', 'faro', 'muelle', 'grua', 'marea', 'proa', 'brisa', 'dique',
  'norte', 'calma', 'niebla', 'rumbo', 'quilla', 'popa', 'costa', 'vela',
];

/** A memorable, high-entropy code: three words plus six random base-36 chars. */
export function generateCode(): string {
  const rnd = new Uint32Array(4);
  crypto.getRandomValues(rnd);
  const words = Array.from(rnd.slice(0, 3), (n) => WORDS[n % WORDS.length]);
  const tail = rnd[3].toString(36).padStart(6, '0').slice(-6);
  return [...words, tail].join('-');
}

const endpoint = (hash: string) => `${SYNC_URL}/p/${hash}`;

/** Fetch the remote snapshot. Returns null when the bucket does not exist yet. */
export async function pull(hash: string): Promise<ProgressSnapshot | null> {
  const res = await fetch(endpoint(hash), { headers: { accept: 'application/json' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Sync pull failed (${res.status})`);
  const body = (await res.json()) as { v?: number; data?: ProgressSnapshot };
  if (body.v !== SYNC_SCHEMA || !body.data) {
    throw new Error('Datos de sincronización de una versión desconocida');
  }
  return body.data;
}

export async function push(hash: string, data: ProgressSnapshot): Promise<void> {
  const res = await fetch(endpoint(hash), {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ v: SYNC_SCHEMA, data }),
    keepalive: true,
  });
  if (!res.ok) throw new Error(`Sync push failed (${res.status})`);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/sync.test.ts`
Expected: PASS, 26 tests.

Note: `crypto.subtle` and `crypto.getRandomValues` exist in vitest's default `node` environment on Node 20+, so no jsdom is needed.

- [ ] **Step 5: Typecheck and commit**

Run: `npx tsc --noEmit` → clean.

```bash
git add src/lib/sync.ts src/lib/sync.test.ts
git commit -m "feat(sync): hash codes in the browser, generate codes, add API client

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Sync state store and the orchestrator

**Files:**
- Create: `src/lib/syncStore.ts`
- Create: `src/lib/useSync.ts`
- Modify: `src/App.tsx:25-48` (call `useSync()` inside `App`)

**Interfaces:**
- Consumes: `pull`, `push`, `hashCode`, `mergeProgress`, `SYNC_URL` from Task 4; `useStore` from `src/lib/store.ts`.
- Produces:
  - `useSyncStore` with state `{ code: string; status: 'off' | 'syncing' | 'ok' | 'error'; lastSyncedAt: string | null; error: string | null }` and actions `setCode(code: string): void`, `disconnect(): void`
  - `export async function syncNow(): Promise<void>` — pull, merge, apply locally, push
  - `export function useSync(): void` — mounts the triggers

- [ ] **Step 1: Create the sync state store**

Create `src/lib/syncStore.ts`:

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SyncStatus = 'off' | 'syncing' | 'ok' | 'error';

interface SyncState {
  /** The sync code in plain text. Stored here, never inside the progress blob. */
  code: string;
  status: SyncStatus;
  lastSyncedAt: string | null;
  error: string | null;
  setCode: (code: string) => void;
  disconnect: () => void;
  _set: (p: Partial<SyncState>) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      code: '',
      status: 'off',
      lastSyncedAt: null,
      error: null,
      setCode: (code) => set({ code: code.trim(), status: 'off', error: null }),
      disconnect: () =>
        set({ code: '', status: 'off', lastSyncedAt: null, error: null }),
      _set: (p) => set(p),
    }),
    {
      name: 'intelforge-sync',
      // status/error are runtime-only; only the code and the timestamp persist
      partialize: (s) => ({ code: s.code, lastSyncedAt: s.lastSyncedAt }),
    },
  ),
);
```

- [ ] **Step 2: Create the orchestrator**

Create `src/lib/useSync.ts`:

```ts
import { useEffect } from 'react';
import { useStore } from './store';
import { useSyncStore } from './syncStore';
import { hashCode, mergeProgress, pull, push, SYNC_URL } from './sync';
import type { ProgressSnapshot } from './types';

/** Strip the action functions off the store, leaving the persisted snapshot. */
function snapshot(): ProgressSnapshot {
  const s = useStore.getState();
  return {
    track: s.track,
    xp: s.xp,
    streak: s.streak,
    activity: s.activity,
    lessons: s.lessons,
    quizBest: s.quizBest,
    labs: s.labs,
    bosses: s.bosses,
    exams: s.exams,
    srs: s.srs,
    calibration: s.calibration,
    totals: s.totals,
    achievements: s.achievements,
    day: s.day,
  };
}

export const syncEnabled = () => SYNC_URL !== '';

/**
 * One full sync: pull the remote snapshot, merge it into the local one, apply
 * the result locally, then push it back. Idempotent — running it twice in a
 * row changes nothing.
 */
export async function syncNow(): Promise<void> {
  const { code, _set } = useSyncStore.getState();
  if (!code || !syncEnabled()) return;
  _set({ status: 'syncing', error: null });
  try {
    const hash = await hashCode(code);
    const remote = await pull(hash);
    const local = snapshot();
    // A missing bucket is not an error: this is the first sync for this code.
    const merged = remote ? mergeProgress(local, remote) : local;
    // Only write when the merge actually changed something. Writing
    // unconditionally would notify the store subscriber in useSync, which
    // would schedule another sync, which would write again — a permanent
    // 5-second loop for a user who is not even studying.
    if (JSON.stringify(merged) !== JSON.stringify(local)) {
      useStore.setState(merged);
    }
    await push(hash, merged);
    _set({ status: 'ok', lastSyncedAt: new Date().toISOString(), error: null });
  } catch (e) {
    _set({ status: 'error', error: e instanceof Error ? e.message : 'Error de sincronización' });
  }
}

const DEBOUNCE_MS = 5000;

/** Mount once, at the app root. Wires the sync triggers. */
export function useSync(): void {
  const code = useSyncStore((s) => s.code);

  useEffect(() => {
    if (!code || !syncEnabled()) return;

    void syncNow();

    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = useStore.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(() => void syncNow(), DEBOUNCE_MS);
    });

    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        clearTimeout(timer);
        void syncNow();
      }
    };
    document.addEventListener('visibilitychange', onHide);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [code]);
}
```

- [ ] **Step 3: Mount it in the app root**

In `src/App.tsx`, add the import and call it as the first line of `App`:

```tsx
import { useSync } from './lib/useSync';

export default function App() {
  useSync();
  return (
    <HashRouter>
```

- [ ] **Step 4: Verify nothing changed for a user without a code**

Run: `npm test` → still 58 tests green.
Run: `npx tsc --noEmit` → clean.
Start the dev server (`.claude/launch.json` → `intelforge-dev`), open the app, confirm the Dashboard still renders and the browser console has no errors. With `SYNC_URL` empty and no code set, `useSync` returns immediately.

- [ ] **Step 5: Commit**

```bash
git add src/lib/syncStore.ts src/lib/useSync.ts src/App.tsx
git commit -m "feat(sync): sync state store and pull-merge-push orchestrator

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: The Profile panel

**Files:**
- Create: `src/components/SyncPanel.tsx`
- Modify: `src/pages/ProfilePage.tsx` (render `<SyncPanel />` above the danger zone)

**Interfaces:**
- Consumes: `useSyncStore`, `syncNow`, `syncEnabled`, `generateCode`, `isWeakCode`.
- Produces: `export default function SyncPanel()`.

- [ ] **Step 1: Create the panel**

Create `src/components/SyncPanel.tsx`:

```tsx
import { useState } from 'react';
import { useSyncStore } from '../lib/syncStore';
import { syncEnabled, syncNow } from '../lib/useSync';
import { generateCode, isWeakCode } from '../lib/sync';
import { Panel } from './Bits';

const STATUS: Record<string, { dot: string; label: string }> = {
  off: { dot: 'bg-slate-500', label: 'Sin sincronizar' },
  syncing: { dot: 'bg-cyan-400 animate-pulse', label: 'Sincronizando…' },
  ok: { dot: 'bg-emerald-400', label: 'Sincronizado' },
  error: { dot: 'bg-rose-400', label: 'Error de sincronización' },
};

export default function SyncPanel() {
  const { code, status, lastSyncedAt, error, setCode, disconnect } = useSyncStore();
  const [draft, setDraft] = useState('');
  const [confirming, setConfirming] = useState(false);

  if (!syncEnabled()) {
    return (
      <Panel className="mb-5">
        <h2 className="mb-2 font-bold text-slate-100">🔄 Sincronización</h2>
        <p className="text-xs text-slate-400">
          No disponible en esta versión. Tu progreso se guarda solo en este
          navegador.
        </p>
      </Panel>
    );
  }

  const s = STATUS[status] ?? STATUS.off;

  return (
    <Panel className="mb-5">
      <h2 className="mb-2 font-bold text-slate-100">🔄 Sincronización</h2>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        Escribe el mismo código en cada dispositivo y tu progreso se combinará
        entre ellos. El código se cifra en tu navegador antes de enviarse: el
        servidor nunca lo ve, solo guarda tu progreso de estudio. Quien conozca
        el código puede leer y modificar ese progreso, así que trátalo como una
        contraseña.
      </p>

      {code ? (
        <>
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            <span className="font-semibold text-slate-200">{s.label}</span>
            {lastSyncedAt && (
              <span className="font-mono text-[11px] text-slate-500">
                {new Date(lastSyncedAt).toLocaleString()}
              </span>
            )}
          </div>
          {error && <p className="mb-3 text-xs text-rose-300">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => void syncNow()}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400"
            >
              Sincronizar ahora
            </button>
            <button
              onClick={disconnect}
              className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-ink-800"
            >
              Desconectar
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-500">
            Desconectar borra el código de este navegador; tu progreso local se
            queda intacto.
          </p>
        </>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="tu-código-de-sincronización"
              className="min-w-56 flex-1 rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 font-mono text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => setDraft(generateCode())}
              className="rounded-lg border border-ink-600 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-ink-800"
            >
              Generar
            </button>
          </div>
          {draft.trim() !== '' && isWeakCode(draft) && (
            <p className="mb-2 text-xs text-amber-300">
              ⚠️ Código corto: quien lo adivine puede leer y sobrescribir tu
              progreso. Usa 16 caracteres o más, o pulsa «Generar».
            </p>
          )}
          {!confirming ? (
            <button
              disabled={draft.trim() === ''}
              onClick={() => setConfirming(true)}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
            >
              Conectar
            </button>
          ) : (
            <div className="rounded-lg border border-ink-600 bg-ink-850 p-3">
              <p className="mb-2 text-xs leading-relaxed text-slate-300">
                Se combinará el progreso de este navegador con el guardado en ese
                código. Si el código es nuevo, se creará con tu progreso actual.
                Guárdalo: sin él no podrás recuperar la sincronización.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCode(draft);
                    setConfirming(false);
                    setDraft('');
                    void syncNow();
                  }}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-emerald-400"
                >
                  Conectar y sincronizar
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-ink-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}
```

- [ ] **Step 2: Mount it on the Profile page**

In `src/pages/ProfilePage.tsx`, add the import next to the other component imports:

```tsx
import SyncPanel from '../components/SyncPanel';
```

and render it immediately **before** the danger-zone `<Panel className="border-rose-900/50">`:

```tsx
      <SyncPanel />

      <Panel className="border-rose-900/50">
```

- [ ] **Step 3: Verify in the browser**

Run: `npx tsc --noEmit` → clean. Run: `npm test` → 58 green.
Start the dev server and open `#/profile`. With `SYNC_URL` empty the panel must show "No disponible en esta versión" and no input. Confirm no console errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/SyncPanel.tsx src/pages/ProfilePage.tsx
git commit -m "feat(sync): sync panel on the profile page

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: The Cloudflare Worker

**Files:**
- Create: `worker/src/index.ts`, `worker/wrangler.toml`, `worker/package.json`, `worker/tsconfig.json`, `worker/README.md`
- Modify: `.gitignore` (ignore `worker/node_modules` and `worker/.wrangler`)

**Interfaces:**
- Consumes: nothing from the app — the Worker is standalone.
- Produces: `GET|PUT|OPTIONS /p/:hash` matching the contract in the spec.

- [ ] **Step 1: Write the Worker**

Create `worker/src/index.ts`:

```ts
/**
 * ticourse-sync — a dumb key-value box for IntelForge Academy progress.
 *
 * It stores one JSON blob per SHA-256 digest of a user's sync code. It never
 * sees the code itself, has no accounts, and offers no way to list keys.
 */

export interface Env {
  PROGRESS: KVNamespace;
}

const ALLOWED_ORIGINS = [
  'https://llopez-s.github.io',
  'http://localhost:5173',
];

const MAX_BODY_BYTES = 512 * 1024;
const HASH_RE = /^[0-9a-f]{64}$/;

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET,PUT,OPTIONS',
    'access-control-allow-headers': 'content-type,accept',
    'access-control-max-age': '86400',
    vary: 'origin',
  };
}

const json = (body: unknown, status: number, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...cors },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request.headers.get('origin'));

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const { pathname } = new URL(request.url);
    const match = pathname.match(/^\/p\/([^/]+)$/);
    if (!match) return json({ error: 'not found' }, 404, cors);

    const hash = match[1];
    if (!HASH_RE.test(hash)) {
      return json({ error: 'bad key' }, 400, cors);
    }

    if (request.method === 'GET') {
      const stored = await env.PROGRESS.get(hash, 'text');
      if (stored === null) return json({ error: 'not found' }, 404, cors);
      return new Response(stored, {
        status: 200,
        headers: { 'content-type': 'application/json', ...cors },
      });
    }

    if (request.method === 'PUT') {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return json({ error: 'too large' }, 413, cors);
      }
      let parsed: { v?: number; data?: unknown };
      try {
        parsed = JSON.parse(raw) as { v?: number; data?: unknown };
      } catch {
        return json({ error: 'invalid json' }, 400, cors);
      }
      if (typeof parsed.v !== 'number' || typeof parsed.data !== 'object' || parsed.data === null) {
        return json({ error: 'invalid body' }, 400, cors);
      }
      const updatedAt = new Date().toISOString();
      await env.PROGRESS.put(
        hash,
        JSON.stringify({ v: parsed.v, updatedAt, data: parsed.data }),
      );
      return json({ ok: true, updatedAt }, 200, cors);
    }

    return json({ error: 'method not allowed' }, 405, cors);
  },
};
```

- [ ] **Step 2: Add the Worker's own config**

Create `worker/wrangler.toml`:

```toml
name = "ticourse-sync"
main = "src/index.ts"
compatibility_date = "2026-01-01"

# Create with:  npx wrangler kv namespace create PROGRESS
# then paste the printed id below.
[[kv_namespaces]]
binding = "PROGRESS"
id = "REPLACE_WITH_KV_NAMESPACE_ID"
```

Create `worker/package.json`:

```json
{
  "name": "ticourse-sync",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250109.0",
    "typescript": "~5.8.3",
    "wrangler": "^3.99.0"
  }
}
```

Create `worker/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Keep Worker build artefacts out of git**

Append to `.gitignore`:

```
worker/node_modules
worker/.wrangler
```

- [ ] **Step 4: Write the deploy instructions**

Create `worker/README.md`:

```markdown
# ticourse-sync

Cloudflare Worker that stores one progress blob per sync-code digest for
[IntelForge Academy](https://llopez-s.github.io/ticourse/).

It never receives the sync code — the browser sends only a SHA-256 digest. The
stored blob contains study progress only: no name, no email, no free text.

## Deploy (once)

```bash
cd worker
npm install
npx wrangler login                       # opens a browser, needs a free Cloudflare account
npx wrangler kv namespace create PROGRESS
# paste the printed id into wrangler.toml, replacing REPLACE_WITH_KV_NAMESPACE_ID
npx wrangler deploy
```

`deploy` prints the public URL, e.g. `https://ticourse-sync.<subdomain>.workers.dev`.
Put that value in `SYNC_URL` in `src/lib/sync.ts` and push, so the app starts using it.

## API

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/p/:hash` | — | `{"v":1,"updatedAt":"<ISO>","data":{…}}` or `404` |
| `PUT` | `/p/:hash` | `{"v":1,"data":{…}}` | `{"ok":true,"updatedAt":"<ISO>"}` |

`:hash` is 64 lowercase hex characters. Bodies over 512 KB are rejected with
`413`. CORS is limited to the Pages origin and `localhost:5173`.

## Cost

Well inside Cloudflare's free tier: a few dozen requests per day against limits
of 100k Worker requests and 1k KV writes per day.
```

- [ ] **Step 5: Typecheck the Worker**

```bash
cd worker && npm install && npm run typecheck
```
Expected: clean. Then `cd ..`.

Confirm the app is unaffected: `npx tsc --noEmit` and `npm test` from the repo root are still clean and 58 tests green (the root tsconfig and vitest both scope to `src`, so `worker/` is invisible to them).

- [ ] **Step 6: Commit**

```bash
git add worker .gitignore
git commit -m "feat(sync): cloudflare worker storing one progress blob per code digest

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Go live — deploy the Worker, wire the URL, update the docs

**Files:**
- Modify: `src/lib/sync.ts` (set `SYNC_URL`)
- Modify: `README.md`, `CLAUDE.md`

**Interfaces:**
- Consumes: everything above.
- Produces: a working end-to-end sync on the live site.

- [ ] **Step 1: Deploy the Worker (Lidia runs this)**

Follow `worker/README.md`. This needs a free Cloudflare account and a browser login, so it is a human step. It produces the Worker URL.

- [ ] **Step 2: Wire the URL**

In `src/lib/sync.ts`, set the constant to the deployed URL with **no trailing slash**:

```ts
export const SYNC_URL = 'https://ticourse-sync.<subdomain>.workers.dev';
```

- [ ] **Step 3: Correct the privacy claim in the README**

Replace this line in `README.md`:

```
Tu progreso se guarda **en el navegador** (`localStorage`): sin cuentas, sin
servidor, 100% privado. Puedes resetearlo desde *Perfil → Zona de peligro*.
```

with:

```
Tu progreso se guarda **en el navegador** (`localStorage`): sin cuentas y sin
registro. Puedes resetearlo desde *Perfil → Zona de peligro*.

**Sincronización entre dispositivos (opcional, desactivada por defecto).** En
*Perfil → Sincronización* puedes escribir un código privado; con el mismo código
en otro dispositivo, ambos combinan su progreso. El código se convierte en un
hash SHA-256 **en tu navegador**, así que el servidor nunca lo ve: solo guarda tu
progreso de estudio (lecciones, puntuaciones, XP, racha, flashcards), sin nombre
ni correo. Quien conozca el código puede leer y sobrescribir ese progreso, así
que trátalo como una contraseña. Sin código, no sale nada de tu navegador.
```

- [ ] **Step 4: Document it in CLAUDE.md**

In the "State & gotchas" section of `CLAUDE.md`, add:

```markdown
- **Progress sync (opt-in).** `src/lib/sync.ts` (pure merge + API client),
  `syncStore.ts` (code + status, persisted under `intelforge-sync`, never uploaded),
  `useSync.ts` (mount/debounce/tab-hide triggers), `components/SyncPanel.tsx` (Profile UI).
  The code is SHA-256'd in the browser; only the digest reaches the Worker in `worker/`
  (Cloudflare + KV, deployed manually with `wrangler deploy`, **not** in CI). Conflicts are
  resolved by `mergeProgress`, which is commutative, idempotent and monotonic — see
  `docs/superpowers/specs/2026-09-05-progress-sync-design.md`. Setting `SYNC_URL` to `''`
  disables the whole feature.
```

- [ ] **Step 5: Full verification**

```bash
npm test          # 58 green
npm run build     # succeeds
```

Then push and, once the Pages deployment finishes, verify on the live site:

1. Open `https://llopez-s.github.io/ticourse/#/profile` → the Sincronización panel offers a code field.
2. Complete one lesson so there is progress to move.
3. Connect with a generated code; status goes to "Sincronizado".
4. Open the site in a different browser (or a private window), connect with the same code, and confirm the completed lesson appears there.
5. Complete a different lesson in the second browser, sync, then sync the first browser again — **both** lessons must be present in both. This is the merge doing its job.
6. Enter a wrong code in a throwaway browser profile: it must create an empty bucket and upload, not error or wipe anything.
7. Disconnect: the code clears and local progress stays.

- [ ] **Step 6: Commit**

```bash
git add src/lib/sync.ts README.md CLAUDE.md
git commit -m "feat(sync): enable cross-device sync and document the privacy model

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push origin main
```
