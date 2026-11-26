import { describe, expect, it } from 'vitest';
import type { Supuesto } from './supuesto';
import { freshRun } from './supuestoGrade';
import { expireRun, formatClock, isExpired, remainingMs } from './supuestoClock';

const START = new Date('2026-11-26T10:00:00.000Z');
const supuesto = {
  id: 'op1s1', track: 'secplus', sectionIds: ['sp1'], version: 1, title: 'T', brief: '', minutes: 60,
  prerequisites: [], dossier: [], sources: [],
  phases: [
    { id: 'f1', title: 'F1', context: '', tasks: [] },
    { id: 'f2', title: 'F2', context: '', tasks: [] },
  ],
} as unknown as Supuesto;

describe('remainingMs', () => {
  it('counts down and clamps at 0', () => {
    expect(remainingMs(START.toISOString(), 60, START.getTime() + 59 * 60_000)).toBe(60_000);
    expect(remainingMs(START.toISOString(), 60, START.getTime() + 3 * 3600_000)).toBe(0);
  });
});

describe('isExpired', () => {
  const late = START.getTime() + 2 * 3600_000;
  it('is false in practice mode', () => expect(isExpired(freshRun('practice', START), 60, late)).toBe(false));
  it('is true for an overdue exam, false while on time or once finished', () => {
    const run = freshRun('exam', START);
    expect(isExpired(run, 60, late)).toBe(true);
    expect(isExpired(run, 60, START.getTime() + 1000)).toBe(false);
    expect(isExpired({ ...run, finishedAt: START.toISOString() }, 60, late)).toBe(false);
  });
});

describe('formatClock', () => {
  it('formats h:mm:ss, m:ss and clamps', () => {
    expect(formatClock(3_909_000)).toBe('1:05:09');
    expect(formatClock(2_292_000)).toBe('38:12');
    expect(formatClock(7_000)).toBe('0:07');
    expect(formatClock(-5)).toBe('0:00');
  });
});

describe('expireRun', () => {
  it('closes at the deadline after a closed tab and keeps answers', () => {
    const run = { ...freshRun('exam', START), answers: { t1: 'a' } };
    const out = expireRun(supuesto, run, new Date(START.getTime() + 2 * 3600_000));
    expect(out.finishedAt).toBe(new Date(START.getTime() + 60 * 60_000).toISOString());
    expect(out.submitted).toEqual(['f1', 'f2']);
    expect(out.phaseIndex).toBe(1);
    expect(out.answers).toEqual({ t1: 'a' });
    expect(run.finishedAt).toBeUndefined();
  });
  it('does not throw on an invalid startedAt: finishes at now, keeps answers', () => {
    const now = new Date('2026-11-26T12:00:00.000Z');
    const run = { ...freshRun('exam', START), startedAt: 'basura', answers: { t1: 'a' } };
    expect(isExpired(run, 60, now.getTime())).toBe(true);
    const out = expireRun(supuesto, run, now);
    expect(out.finishedAt).toBe(now.toISOString());
    expect(out.answers).toEqual({ t1: 'a' });
  });
});
