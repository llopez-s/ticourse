import { describe, expect, it } from 'vitest';
import { migrateProgress, useStore } from './store';

const reset = () => useStore.getState().resetAll();

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
  it('v2 gets v3 fields added', () => {
    const v2 = { track: 'secplus', exams: [] };
    const out = migrateProgress(v2, 2) as {
      track: string;
      exams: unknown[];
      exempt: Record<string, unknown>;
      placement: unknown[];
    };
    expect(out.track).toBe('secplus');
    expect(out.exams).toEqual([]);
    expect(out.exempt).toEqual({});
    expect(out.placement).toEqual([]);
  });
});

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
