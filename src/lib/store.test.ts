import { describe, expect, it } from 'vitest';
import { migrateProgress } from './store';

describe('migrateProgress', () => {
  it('v1 → v2 adds track and stamps exams', () => {
    const v1 = {
      xp: 10,
      exams: [
        { date: '2026-01-01', pct: 80, correct: 20, total: 25, domains: {} },
      ],
    };
    const out = migrateProgress(v1, 1) as {
      track: string;
      exams: { track: string }[];
    };
    expect(out.track).toBe('gcti');
    expect(out.exams[0].track).toBe('gcti');
  });
  it('v2 passes through', () => {
    const v2 = { track: 'secplus', exams: [] };
    expect(migrateProgress(v2, 2)).toEqual(v2);
  });
});
