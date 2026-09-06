import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  emptySnapshot,
  generateCode,
  hashCode,
  isWeakCode,
  mergeProgress,
  pull,
  push,
  SYNC_SCHEMA,
  stableStringify,
} from './sync';
import type { CardState, ExemptEntry, PlacementResult, ProgressSnapshot } from './types';

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
    // Every field gets a distinct, non-zero value on both sides, and which
    // side "wins" alternates field to field, so a bug confined to a single
    // field (or a sum-instead-of-max bug anywhere) is visible.
    const a = snap({
      xp: 1200,
      totals: {
        questions: 300, // a wins
        correct: 50, // b wins
        cards: 80, // a wins
        maxCombo: 4, // b wins
        highConfCorrect: 60, // a wins
        perfectQuizzes: 2, // b wins
        questsDone: 12, // a wins
        checkpoints: 5, // b wins
      },
    });
    const b = snap({
      xp: 900,
      totals: {
        questions: 120,
        correct: 90,
        cards: 40,
        maxCombo: 9,
        highConfCorrect: 30,
        perfectQuizzes: 7,
        questsDone: 6,
        checkpoints: 11,
      },
    });
    const m = mergeProgress(a, b);
    expect(m.xp).toBe(1200);
    expect(m.totals).toEqual({
      questions: 300,
      correct: 90,
      cards: 80,
      maxCombo: 9,
      highConfCorrect: 60,
      perfectQuizzes: 7,
      questsDone: 12,
      checkpoints: 11,
    });
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

    // Discriminating case: in every fixture above, the side with more answers
    // (higher n) also happens to have the higher c, so a naive field-wise
    // implementation — { n: Math.max(a.n, b.n), c: Math.max(a.c, b.c) } —
    // would produce the same output and this test would never catch it. Here
    // the LOSING side (c2, fewer answers) holds the higher c: wholesale
    // selection must keep c2's own n *and* c together ({ n: 10, c: 2 }),
    // while a field-wise bug would wrongly mix in d2's higher c, yielding the
    // impossible { n: 10, c: 3 } (c > n cannot happen from real answers).
    const c2 = snap({ calibration: { low: { n: 10, c: 2 }, med: { n: 0, c: 0 }, high: { n: 0, c: 0 } } });
    const d2 = snap({ calibration: { low: { n: 3, c: 3 }, med: { n: 0, c: 0 }, high: { n: 0, c: 0 } } });
    expect(mergeProgress(c2, d2).calibration.low).toEqual({ n: 10, c: 2 });
  });
});

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

  it('carries a live streak forward when the two lastDays are contiguous', () => {
    // The regression this pins: the laptop is on a 57-day streak through
    // 2026-09-04. The phone, last synced a week ago, is opened offline on
    // 2026-09-05; addXp sees a 7-day gap and resets its own `current` to 1.
    // "Later lastDay wins wholesale" would let that 1 destroy the 57 — in
    // both merge orders, irreversibly. Contiguous days mean the user studied
    // on both, so the streak is 57 + 1 = 58.
    const laptop = snap({ streak: { current: 57, best: 57, lastDay: '2026-09-04', freezes: 1 } });
    const phone = snap({ streak: { current: 1, best: 12, lastDay: '2026-09-05', freezes: 0 } });
    for (const m of [mergeProgress(laptop, phone), mergeProgress(phone, laptop)]) {
      expect(m.streak.current).toBe(58);
      expect(m.streak.lastDay).toBe('2026-09-05'); // still the live side
      expect(m.streak.best).toBe(57);
    }
  });

  it('does not carry a streak across a genuine break', () => {
    // Four days apart: the streak really was broken, so the live side's
    // count stands on its own and nothing is invented.
    const stale = snap({ streak: { current: 57, best: 57, lastDay: '2026-09-01', freezes: 1 } });
    const live = snap({ streak: { current: 1, best: 12, lastDay: '2026-09-05', freezes: 0 } });
    for (const m of [mergeProgress(stale, live), mergeProgress(live, stale)]) {
      expect(m.streak.current).toBe(1);
      expect(m.streak.lastDay).toBe('2026-09-05');
      expect(m.streak.best).toBe(57); // best still survives
    }
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

  it('resolves an exam-key collision the same way regardless of merge order', () => {
    // Same composite key (date|track|pct|correct|total) but different
    // `domains` breakdowns — the key deliberately excludes `domains`, and
    // this is reachable in real use: two 30-question practice exams on the
    // same day both scoring 24/30 with different per-domain splits.
    const examX = {
      date: '2026-09-01',
      track: 'secplus' as const,
      pct: 80,
      correct: 24,
      total: 30,
      domains: { d1: { n: 10, c: 8 }, d2: { n: 20, c: 16 } },
    };
    const examY = {
      date: '2026-09-01',
      track: 'secplus' as const,
      pct: 80,
      correct: 24,
      total: 30,
      domains: { d1: { n: 20, c: 16 }, d2: { n: 10, c: 8 } },
    };
    const a = snap({ exams: [examX] });
    const b = snap({ exams: [examY] });
    expect(mergeProgress(a, b).exams).toEqual(mergeProgress(b, a).exams);
  });
});

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

  it('merging a snapshot with itself is stringify-identical, which the sync loop guard depends on', () => {
    // useSync's infinite-loop guard compares JSON.stringify(merged) !== JSON.stringify(local).
    // This guard is correct only if field order is preserved across snapshot(), mergeProgress's
    // return object, and store.ts' partialize. This test pins that invariant at the string level:
    // stringify is key-order sensitive, so if someone reorders fields in mergeProgress's return
    // object or elsewhere, the two strings will differ despite deep equality, and the loop
    // guard will fail silently. This test will catch that regression.
    const fixture = rich();
    const merged = mergeProgress(fixture, fixture);
    expect(JSON.stringify(merged)).toBe(JSON.stringify(fixture));
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
    // rich() ends 2026-09-04 on 6 and other() ends 2026-09-05 on 2 — contiguous
    // days, so the streak must carry forward rather than collapse to the live
    // side's 2. Outside the contiguous case `current` legitimately drops (the
    // streak was genuinely broken), which is why this bound is asserted here,
    // on a fixture pair that is contiguous by construction.
    expect(m.streak.current).toBeGreaterThanOrEqual(Math.max(a.streak.current, b.streak.current));
    expect(m.streak.current).toBe(7);
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

describe('pull — remote blob validation', () => {
  const HASH = 'a'.repeat(64);

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** Minimal stand-in for the fields of Response that pull() actually touches. */
  const respond = (body: unknown, status = 200) => {
    const fetchMock = vi.fn(async () => ({
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    }));
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  };

  const good = () => ({ v: SYNC_SCHEMA, data: emptySnapshot() });

  it('returns the snapshot for a well-formed blob', async () => {
    respond(good());
    expect(await pull(HASH)).toEqual(emptySnapshot());
  });

  it('returns null for a bucket that does not exist yet', async () => {
    respond({ error: 'not found' }, 404);
    expect(await pull(HASH)).toBeNull();
  });

  it('rejects a blob missing a top-level key instead of writing NaN into local state', async () => {
    // mergeProgress does Math.max(local.totals.questions, remote.totals.questions).
    // With `totals` absent that is Math.max(n, undefined) === NaN, which used to
    // be applied to the store and persisted — the user's XP reads NaN forever.
    // Throwing here means syncNow's catch runs: local state is untouched and
    // the bad blob is never pushed back.
    const { totals: _dropped, ...withoutTotals } = emptySnapshot();
    respond({ v: SYNC_SCHEMA, data: withoutTotals });
    await expect(pull(HASH)).rejects.toThrow('Datos de sincronización incompletos');

    respond({ v: SYNC_SCHEMA, data: { ...emptySnapshot(), xp: 'mucho' } });
    await expect(pull(HASH)).rejects.toThrow('Datos de sincronización incompletos');

    respond({ v: SYNC_SCHEMA, data: { ...emptySnapshot(), exams: null } });
    await expect(pull(HASH)).rejects.toThrow('Datos de sincronización incompletos');
  });

  it('accepts an OLDER schema version so a bump can migrate existing buckets', async () => {
    respond({ ...good(), v: SYNC_SCHEMA - 1 });
    expect(await pull(HASH)).toEqual(emptySnapshot());
  });

  it('rejects a NEWER schema version it cannot understand', async () => {
    respond({ ...good(), v: SYNC_SCHEMA + 1 });
    await expect(pull(HASH)).rejects.toThrow('versión desconocida');

    respond({ data: emptySnapshot() }); // no `v` at all
    await expect(pull(HASH)).rejects.toThrow('versión desconocida');
  });
});

describe('push — keepalive', () => {
  const HASH = 'b'.repeat(64);

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const stubOk = () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => ({
      ok: true,
      status: 200,
    }));
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  };

  it('does not set keepalive by default', async () => {
    // Per the Fetch standard a keepalive request with a body over 64 KiB fails
    // with a TypeError before it is sent. Snapshots pass 64 KiB as `activity`
    // grows, and the Worker accepts 512 KB, so the normal path must not opt in.
    const fetchMock = stubOk();
    await push(HASH, emptySnapshot());
    expect(fetchMock.mock.calls[0]?.[1]?.keepalive).toBe(false);
  });

  it('sets keepalive only when the caller asks for it', async () => {
    const fetchMock = stubOk();
    await push(HASH, emptySnapshot(), { keepalive: true });
    expect(fetchMock.mock.calls[0]?.[1]?.keepalive).toBe(true);
  });
});

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

  it('on an identical timestamp and status, higher score wins in both directions', () => {
    const a = snap({ exempt: { sp1m1: entry({ score: 85 }) } });
    const b = snap({ exempt: { sp1m1: entry({ score: 92 }) } });
    expect(mergeProgress(a, b).exempt.sp1m1.score).toBe(92);
    expect(mergeProgress(b, a).exempt.sp1m1.score).toBe(92);
  });

  it('on an identical timestamp, status and score, lexicographically smaller via wins in both directions', () => {
    const a = snap({ exempt: { sp1m1: entry({ via: 'pl-sp1' }) } });
    const b = snap({ exempt: { sp1m1: entry({ via: 'pl-sp2' }) } });
    expect(mergeProgress(a, b).exempt.sp1m1.via).toBe('pl-sp1');
    expect(mergeProgress(b, a).exempt.sp1m1.via).toBe('pl-sp1');
  });
});

describe('mergeProgress — placement history', () => {
  it('dedupes identical attempts and is order-independent', () => {
    const a = snap({ placement: [attempt()] });
    const b = snap({ placement: [attempt(), attempt({ blockId: 'pl-sp2', sectionId: 'sp2' })] });
    expect(mergeProgress(a, b).placement).toHaveLength(2);
    expect(mergeProgress(a, b).placement).toEqual(mergeProgress(b, a).placement);
  });

  it('is idempotent', () => {
    const a = snap({ placement: [attempt()] });
    const b = snap({ placement: [attempt(), attempt({ blockId: 'pl-sp2', sectionId: 'sp2' })] });
    const once = mergeProgress(a, b);
    expect(mergeProgress(once, once).placement).toEqual(once.placement);
    expect(mergeProgress(once, b).placement).toEqual(once.placement);
  });
});

describe('stableStringify — the guard the KV write budget rests on', () => {
  /** Same data, built in the order device A happened to complete things. */
  const deviceA = () =>
    snap({
      lessons: { s1m1: true, sp2m3: true },
      activity: { '2026-09-04': 90, '2026-09-05': 140 },
    });

  /** The same data, built in the order device B happened to complete it. */
  const deviceB = () => {
    const s = snap();
    s.lessons = {};
    s.lessons.sp2m3 = true;
    s.lessons.s1m1 = true;
    s.activity = {};
    s.activity['2026-09-05'] = 140;
    s.activity['2026-09-04'] = 90;
    return s;
  };

  it('is blind to key order, where JSON.stringify is not', () => {
    expect(JSON.stringify(deviceA())).not.toBe(JSON.stringify(deviceB()));
    expect(stableStringify(deviceA())).toBe(stableStringify(deviceB()));
  });

  it('does not write when the bucket already holds this snapshot', () => {
    // syncNow decides whether to spend a KV write with exactly this
    // expression. Before stableStringify it compared raw JSON, so two devices
    // whose maps were built in different orders each wrote on every single
    // sync while pushing byte-identical data — which is what exhausted the
    // 1,000-write daily free tier.
    const local = deviceA();
    const remote = deviceB();
    const merged = mergeProgress(local, remote);
    expect(merged).toEqual(remote);
    expect(stableStringify(merged) !== stableStringify(remote)).toBe(false);
  });

  it('still distinguishes snapshots that genuinely differ', () => {
    const before = deviceA();
    const after = snap({ ...before, xp: before.xp + 10 });
    expect(stableStringify(before)).not.toBe(stableStringify(after));
  });

  it('keeps array order, which the merges make meaningful', () => {
    expect(stableStringify([3, 1, 2])).toBe('[3,1,2]');
    expect(stableStringify([{ b: 1, a: 2 }])).toBe('[{"a":2,"b":1}]');
  });

  it('handles nesting, primitives and null the way JSON.stringify does', () => {
    expect(stableStringify({ b: { d: 1, c: 2 }, a: null })).toBe(
      '{"a":null,"b":{"c":2,"d":1}}',
    );
    expect(stableStringify('x')).toBe('"x"');
    expect(stableStringify(7)).toBe('7');
    expect(stableStringify(null)).toBe('null');
  });

  it('drops undefined-valued keys, as JSON.stringify does', () => {
    // The two must agree on what a snapshot contains, or a blob that survives
    // a JSON round trip would compare unequal to the object it came from.
    const value = { a: 1, b: undefined };
    expect(stableStringify(value)).toBe('{"a":1}');
    expect(stableStringify(JSON.parse(JSON.stringify(value)))).toBe(
      stableStringify(value),
    );
  });

  it('survives a JSON round trip, which is what pull returns', () => {
    const local = deviceA();
    const overTheWire = JSON.parse(JSON.stringify(local)) as ProgressSnapshot;
    expect(stableStringify(overTheWire)).toBe(stableStringify(local));
  });
});
