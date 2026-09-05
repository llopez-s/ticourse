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
