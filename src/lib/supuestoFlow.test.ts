import { describe, expect, it } from 'vitest';
import { metaOf, type Supuesto } from './supuesto';
import { freshRun } from './supuestoGrade';
import { applyHint, needsSelfAssessment, newDocIds, submitPhase, workspaceIdentity } from './supuestoFlow';

// Local fixture: four phases, a document gated by f2 and one written task.
const task = (id: string) => ({
  id, kind: 'choice' as const, prompt: '?', points: 1, explain: '', refs: [],
  options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], answer: 'a',
});
const s: Supuesto = {
  id: 'fx1', track: 'opo', sectionIds: ['op1'], version: 1, title: 'Fixture', brief: '', minutes: 60,
  prerequisites: [], sources: [],
  dossier: [
    { id: 'd-start', title: 'Inicio', kind: 'memo' },
    { id: 'd-acta', title: 'Acta', kind: 'acta', unlockedBy: 'f2' },
  ],
  phases: [
    { id: 'f1', title: 'Uno', context: '', tasks: [task('f1t1')] },
    { id: 'f2', title: 'Dos', context: '', tasks: [task('f2t1')] },
    { id: 'f3', title: 'Tres', context: '', tasks: [task('f3t1')] },
    { id: 'f4', title: 'Cuatro', context: '', tasks: [{
      id: 'f4t1', kind: 'written', prompt: '?', points: 2, explain: '', refs: [], model: 'M',
      rubric: [{ id: 'r1', text: 'R', points: 2 }],
    }] },
  ],
};
const t0 = new Date('2026-11-26T10:00:00Z');

describe('submitPhase', () => {
  it('advances to the next phase and records the submitted one', () => {
    const run = submitPhase(s, freshRun('practice', t0));
    expect(run.submitted).toEqual(['f1']);
    expect(run.phaseIndex).toBe(1);
    expect(run.finishedAt).toBeUndefined();
  });

  it('sets finishedAt when the last phase is submitted, keeping the last index', () => {
    let run = freshRun('exam', t0);
    for (let i = 0; i < s.phases.length; i++) run = submitPhase(s, run, new Date('2026-11-26T10:30:00Z'));
    expect(run.submitted).toEqual(['f1', 'f2', 'f3', 'f4']);
    expect(run.phaseIndex).toBe(s.phases.length - 1);
    expect(run.finishedAt).toBe('2026-11-26T10:30:00.000Z');
  });

  it('cannot submit the same phase twice', () => {
    const once = submitPhase(s, freshRun('practice', t0));
    const stale = { ...once, phaseIndex: 0 };
    expect(submitPhase(s, stale)).toBe(stale);
  });

  it('does nothing once the run is finished', () => {
    let run = freshRun('practice', t0);
    for (let i = 0; i < s.phases.length; i++) run = submitPhase(s, run);
    expect(submitPhase(s, run)).toBe(run);
  });
});

describe('applyHint', () => {
  it('records a hint once in practice mode', () => {
    const run = applyHint(applyHint(freshRun('practice', t0), 'f1t1'), 'f1t1');
    expect(run.hints).toEqual(['f1t1']);
  });

  it('changes nothing in exam mode', () => {
    const run = freshRun('exam', t0);
    expect(applyHint(run, 'f1t1')).toBe(run);
  });
});

describe('needsSelfAssessment', () => {
  it('is true while a written task waits for self-assessment', () => {
    expect(needsSelfAssessment(s, freshRun('practice', t0))).toBe(true);
    expect(needsSelfAssessment(s, { ...freshRun('practice', t0), selfDone: true })).toBe(false);
  });

  it('is false when the supuesto has no written task', () => {
    const noWritten: Supuesto = { ...s, phases: s.phases.map((p) => ({ ...p, tasks: p.tasks.filter((t) => t.kind !== 'written') })) };
    expect(needsSelfAssessment(noWritten, freshRun('practice', t0))).toBe(false);
  });
});

describe('workspaceIdentity', () => {
  it('names the supuesto, mode and version', () => {
    expect(workspaceIdentity(metaOf(s), 'exam')).toBe('supuesto/fx1/exam/v1');
  });

  it('changes with the version', () => {
    expect(workspaceIdentity({ ...metaOf(s), version: 2 }, 'practice')).not.toBe(workspaceIdentity(metaOf(s), 'practice'));
  });
});

describe('newDocIds', () => {
  it('is empty in the first phase', () => {
    expect(newDocIds(s, freshRun('practice', t0))).toEqual([]);
  });

  it('lists the documents the previous phase just unlocked', () => {
    let run = submitPhase(s, freshRun('practice', t0));
    expect(newDocIds(s, run)).toEqual([]);
    run = submitPhase(s, run);
    expect(newDocIds(s, run)).toEqual(['d-acta']);
  });
});
