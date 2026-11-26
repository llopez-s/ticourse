import { describe, expect, it } from 'vitest';
import { migrateProgress, useStore } from './store';
import { modulesOf } from '../data/course';

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

  it('a v3 blob keeps every field and only gains the v4 ones', () => {
    const v3 = { track: 'secplus', exams: [], exempt: { sp1m1: { status: 'exempt', at: 'x', via: 'pl-sp1', score: 90 } }, placement: [] };
    expect(migrateProgress(v3, 3)).toEqual({ ...v3, practical: {}, supuestos: {} });
    expect(migrateProgress({ ...v3, practical: { 'a:exam': 120 }, supuestos: {} }, 3)).toMatchObject({ practical: { 'a:exam': 120 } });
    // already-v4 data is untouched
    const v4 = { ...v3, practical: { 'a:exam': 120 }, supuestos: {} };
    expect(migrateProgress(v4, 4)).toEqual(v4);
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

  it('grantExemption still honours an earlier pass after a failed retake', () => {
    reset();
    const ids = modulesOf('sp1').map((m) => m.id);
    useStore.getState().finishPlacement('pl-sp1', 11, 12); // 92% — passed
    useStore.getState().finishPlacement('pl-sp1', 9, 12); // 75% — failed
    useStore.getState().grantExemption('pl-sp1');
    // The pass is spendable, and at the best passing score — a worse retake
    // must not cost the learner the exemption they already earned.
    expect(useStore.getState().exempt[ids[0]].status).toBe('exempt');
    expect(useStore.getState().exempt[ids[0]].score).toBe(92);
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

describe('supuestos y XP práctico (persist v4)', () => {
  const meta = (id: string, integrator?: boolean) => ({
    id, track: 'gcti' as const, sectionIds: ['s1'], version: 1,
    title: 't', brief: 'b', minutes: 10, integrator,
  });
  it('migra v3 → v4 añadiendo campos vacíos sin perder nada', () => {
    const out = migrateProgress({ xp: 5, exempt: {}, placement: [] }, 3) as Record<string, unknown>;
    expect(out.practical).toEqual({});
    expect(out.supuestos).toEqual({});
    expect(out.xp).toBe(5);
  });
  it('un 4,9 guarda la nota pero no da XP', () => {
    reset();
    expect(useStore.getState().finishSupuesto(meta('a'), 'exam', { grade: 4.9, auto: 3 })).toBe(0);
    expect(useStore.getState().supuestos.a.exam?.grade).toBe(4.9);
    expect(useStore.getState().practical).toEqual({});
  });
  it('un 7,2 da 120 en simulacro; repetir con 9 da 0 y sube la mejor nota', () => {
    reset();
    expect(useStore.getState().finishSupuesto(meta('z'), 'exam', { grade: 3, auto: 1 })).toBe(0);
    const xp0 = useStore.getState().xp;
    expect(xp0).toBe(0);
    expect(useStore.getState().finishSupuesto(meta('a'), 'exam', { grade: 7.2, auto: 5 })).toBe(120);
    expect(useStore.getState().finishSupuesto(meta('a'), 'exam', { grade: 9, auto: 6 })).toBe(0);
    expect(useStore.getState().supuestos.a.exam?.grade).toBe(9);
    expect(useStore.getState().practical['a:exam']).toBe(120);
    // practical XP never lands in xp (quests/achievements may still add their own)
    expect(useStore.getState().xp - xp0).not.toBe(120);
  });
  it('una nota peor no pisa la mejor', () => {
    reset();
    useStore.getState().finishSupuesto(meta('a'), 'practice', { grade: 8, auto: 5 });
    useStore.getState().finishSupuesto(meta('a'), 'practice', { grade: 6, auto: 9 });
    expect(useStore.getState().supuestos.a.practice?.grade).toBe(8);
  });
  it('práctica y simulacro son claves distintas; integrador da 240', () => {
    reset();
    expect(useStore.getState().finishSupuesto(meta('a'), 'practice', { grade: 6, auto: 4 })).toBe(60);
    expect(useStore.getState().finishSupuesto(meta('a'), 'exam', { grade: 6, auto: 4 })).toBe(120);
    expect(useStore.getState().finishSupuesto(meta('i', true), 'exam', { grade: 6, auto: 4 })).toBe(240);
  });
  it('suma 1 a day.labs al aprobar por primera vez y resetAll vacía todo', () => {
    reset();
    const l0 = useStore.getState().day.labs;
    useStore.getState().finishSupuesto(meta('a'), 'exam', { grade: 6, auto: 4 });
    expect(useStore.getState().day.labs).toBe(l0 + 1);
    reset();
    expect(useStore.getState().practical).toEqual({});
    expect(useStore.getState().supuestos).toEqual({});
  });
});
