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
