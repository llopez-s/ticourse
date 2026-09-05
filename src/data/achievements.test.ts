import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS } from './achievements';
import { modulesOfTrack } from './course';
import type { ProgressSnapshot } from '../lib/types';

const base = (): ProgressSnapshot => ({
  track: 'gcti',
  xp: 0,
  streak: { current: 0, best: 0, lastDay: null, freezes: 0 },
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
  exempt: {},
  placement: [],
  day: {
    date: '2026-01-01',
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
});
const find = (id: string) => ACHIEVEMENTS.find((a) => a.id === id)!;

describe('achievements', () => {
  it('have unique ids', () => {
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(
      ACHIEVEMENTS.length,
    );
  });
  it('bookworm counts only GCTI lessons', () => {
    const s = base();
    for (const m of modulesOfTrack('gcti')) s.lessons[m.id] = true;
    expect(find('bookworm').test(s)).toBe(true);
    const sp = base();
    for (const m of modulesOfTrack('secplus')) sp.lessons[m.id] = true;
    expect(find('bookworm').test(sp)).toBe(false);
  });
  it('sp-first-lesson needs a secplus lesson', () => {
    const s = base();
    s.lessons['s1m1'] = true;
    expect(find('sp-first-lesson').test(s)).toBe(false);
    s.lessons['sp6m1'] = true;
    expect(find('sp-first-lesson').test(s)).toBe(true);
  });
  it('campaign-hero ignores secplus bosses', () => {
    const s = base();
    for (const id of ['sp1', 'sp2', 'sp3', 'sp4', 'sp5']) s.bosses[id] = 90;
    expect(find('campaign-hero').test(s)).toBe(false);
    expect(find('sp-campaign').test(s)).toBe(true);
  });
  it('sp-exam-ready needs ≥83% on a secplus exam', () => {
    const s = base();
    s.exams.push({ date: 'd', track: 'gcti', pct: 90, correct: 9, total: 10, domains: {} });
    expect(find('sp-exam-ready').test(s)).toBe(false);
    s.exams.push({ date: 'd', track: 'secplus', pct: 83, correct: 9, total: 10, domains: {} });
    expect(find('sp-exam-ready').test(s)).toBe(true);
  });
});
