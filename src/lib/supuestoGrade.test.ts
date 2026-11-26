import { describe, expect, it } from 'vitest';
import type { Supuesto, Task } from './supuesto';
import { freshRun, gradeTask, parseNumber, resolvePhase, scoreRun, visibleDocs, type SupuestoRun } from './supuestoGrade';

const base = { explain: 'x', refs: [] };
const opts = (...ids: string[]) => ids.map((id) => ({ id, text: id }));

const choice: Task = { ...base, id: 'c', kind: 'choice', prompt: 'p', points: 5, options: opts('a', 'b'), answer: 'a' };
const multi4: Task = { ...base, id: 'm', kind: 'multi', prompt: 'p', points: 5, options: opts('a', 'b', 'c', 'd', 'x'), answer: ['a', 'b', 'c', 'd'] };
const numeric: Task = { ...base, id: 'n', kind: 'numeric', prompt: 'p', points: 2, answer: 2.5, tolerance: 0.1 };
const table: Task = {
  ...base, id: 't', kind: 'table', prompt: 'p', points: 4,
  fields: [{ id: 'f1', label: 'F1', options: ['si', 'no'] }, { id: 'f2', label: 'F2', options: ['si', 'no'] }],
  rows: [{ id: 'r1', label: 'R1', answer: { f1: 'si', f2: 'no' } }, { id: 'r2', label: 'R2', answer: { f1: 'no', f2: 'no' } }],
};
const order: Task = { ...base, id: 'o', kind: 'order', prompt: 'p', points: 4, items: opts('1', '2', '3', '4'), answer: ['1', '2', '3', '4'] };
const match: Task = { ...base, id: 'x', kind: 'match', prompt: 'p', points: 3, left: opts('l1', 'l2', 'l3'), right: opts('r1', 'r2', 'r3'), answer: { l1: 'r1', l2: 'r2', l3: 'r3' } };
const cite: Task = { ...base, id: 'ci', kind: 'cite', prompt: 'p', points: 3, answerSets: [['d1', 'd2'], ['d1', 'd3']] };
const written: Task = {
  ...base, id: 'w', kind: 'written', prompt: 'p', points: 4, model: 'm',
  rubric: [{ id: 'k1', text: 'a', points: 1 }, { id: 'k2', text: 'b', points: 3 }],
};

describe('parseNumber', () => {
  it('accepts both decimal separators and trims', () => {
    expect(parseNumber('2,5')).toBe(2.5);
    expect(parseNumber(' 2.5 ')).toBe(2.5);
    expect(parseNumber('1.024')).toBe(1.024);
    expect(parseNumber('-3')).toBe(-3);
  });
  it('rejects empty and non-numeric text', () => {
    expect(parseNumber('')).toBeUndefined();
    expect(parseNumber('  ')).toBeUndefined();
    expect(parseNumber('abc')).toBeUndefined();
    expect(parseNumber('1.2.3')).toBeUndefined();
    expect(parseNumber('2,5 MB')).toBeUndefined();
  });
});

describe('gradeTask', () => {
  it('choice is all or nothing', () => {
    expect(gradeTask(choice, 'a')).toEqual({ earned: 5, max: 5, correct: true });
    expect(gradeTask(choice, 'b')).toEqual({ earned: 0, max: 5, correct: false });
    expect(gradeTask(choice, undefined)).toEqual({ earned: 0, max: 5, correct: false });
  });

  it('numeric accepts tolerance and text with comma or dot', () => {
    expect(gradeTask(numeric, '2,5')).toMatchObject({ correct: true });
    expect(gradeTask(numeric, 2.6)).toMatchObject({ correct: true });
    expect(gradeTask(numeric, '2.7')).toMatchObject({ correct: false, earned: 0 });
    expect(gradeTask(numeric, 'abc')).toMatchObject({ earned: 0 });
    expect(gradeTask(numeric, undefined)).toEqual({ earned: 0, max: 2, correct: false });
    expect(gradeTask({ ...numeric, tolerance: undefined } as Task, 2.51)).toMatchObject({ correct: false });
  });

  it('multi subtracts wrong marks and never goes below zero', () => {
    expect(gradeTask(multi4, ['a', 'b', 'x'])).toEqual({ earned: 1.25, max: 5, correct: false });
    expect(gradeTask(multi4, ['a', 'b', 'c', 'd'])).toEqual({ earned: 5, max: 5, correct: true });
    expect(gradeTask(multi4, ['x'])).toEqual({ earned: 0, max: 5, correct: false });
    expect(gradeTask(multi4, undefined)).toMatchObject({ earned: 0 });
  });

  it('table scores the fraction of correct cells', () => {
    expect(gradeTask(table, { 'r1.f1': 'si', 'r1.f2': 'no', 'r2.f1': 'no', 'r2.f2': 'no' })).toMatchObject({ earned: 4, correct: true });
    expect(gradeTask(table, { 'r1.f1': 'si', 'r1.f2': 'no', 'r2.f1': 'si' })).toMatchObject({ earned: 2, correct: false });
    expect(gradeTask(table, undefined)).toMatchObject({ earned: 0 });
  });

  it('order scores correct positions', () => {
    expect(gradeTask(order, ['1', '2', '3', '4'])).toMatchObject({ earned: 4, correct: true });
    expect(gradeTask(order, ['2', '1', '3', '4'])).toMatchObject({ earned: 2, correct: false });
    expect(gradeTask(order, ['1'])).toMatchObject({ earned: 1 });
  });

  it('match scores correct pairs and rounds to 2 decimals', () => {
    expect(gradeTask(match, { l1: 'r1', l2: 'r2', l3: 'r3' })).toMatchObject({ earned: 3, correct: true });
    expect(gradeTask(match, { l1: 'r1', l2: 'r3', l3: 'r2' })).toEqual({ earned: 1, max: 3, correct: false });
    expect(gradeTask({ ...match, points: 5 } as Task, { l1: 'r1' })).toMatchObject({ earned: 1.67 });
  });

  it('cite needs a whole answer set and nothing outside the union', () => {
    expect(gradeTask(cite, ['d1', 'd2'])).toMatchObject({ earned: 3, correct: true });
    expect(gradeTask(cite, ['d3', 'd1'])).toMatchObject({ earned: 3 });
    expect(gradeTask(cite, ['d1', 'd2', 'd3'])).toMatchObject({ earned: 3 });
    expect(gradeTask(cite, ['d1', 'd2', 'd9'])).toMatchObject({ earned: 0 }); // d9 outside the union
    expect(gradeTask(cite, ['d1'])).toMatchObject({ earned: 0 });
    expect(gradeTask(cite, [])).toMatchObject({ earned: 0 });
  });

  it('written sums ticked rubric points; unchecked is 0', () => {
    expect(gradeTask(written, undefined)).toEqual({ earned: 0, max: 4, correct: false });
    expect(gradeTask(written, undefined, ['k2'])).toEqual({ earned: 3, max: 4, correct: false });
    expect(gradeTask(written, undefined, ['k1', 'k2', 'zz'])).toEqual({ earned: 4, max: 4, correct: true });
  });
});

const fixture: Supuesto = {
  id: 'fx', track: 'secplus', sectionIds: ['sp1', 'sp2'], version: 1, title: 't', brief: 'b', minutes: 10,
  prerequisites: [], sources: [],
  dossier: [
    { id: 'd-open', title: 'open', kind: 'memo' },
    { id: 'd-gate', title: 'gated by phase', kind: 'memo', unlockedBy: 'p1' },
    { id: 'd-var', title: 'unlocked by variant', kind: 'memo', unlockedBy: 'p2' },
  ],
  phases: [
    {
      id: 'p1', title: 'Fase 1', context: 'ctx1',
      tasks: [
        { ...choice, id: 'a', hint: { text: 'h', cost: 0.8 }, refs: [{ label: 'L', href: '/learn/sp1m1' }, { label: 'ext', href: 'https://x.test' }] },
        { ...multi4, id: 'b', points: 5, topic: 'sp2', refs: [{ label: 'L2', href: '/learn/sp2m1' }] },
      ],
    },
    {
      id: 'p2', title: 'Fase 2', context: 'ctx2',
      variants: [
        { when: { task: 'a', is: 'wrong' }, context: 'ctx2-wrong', unlocks: ['d-var'] },
        { when: { task: 'a', chose: 'a' }, context: 'ctx2-chose-a' },
      ],
      carry: 'carry',
      tasks: [{ ...written, id: 'w2', points: 4, refs: [{ label: 'L', href: '/learn/sp1m1' }] }],
    },
  ],
};

const run = (patch: Partial<SupuestoRun> = {}): SupuestoRun => ({ ...freshRun('practice', new Date('2026-11-26T10:00:00Z')), ...patch });

describe('freshRun', () => {
  it('starts empty at phase 0', () => {
    expect(freshRun('exam', new Date('2026-11-26T10:00:00Z'))).toEqual({
      mode: 'exam', startedAt: '2026-11-26T10:00:00.000Z', phaseIndex: 0, submitted: [], answers: {}, hints: [], self: {}, selfDone: false, recorded: false,
    });
  });
});

describe('resolvePhase', () => {
  const p2 = fixture.phases[1];
  it('keeps the base context when no variant matches', () => {
    expect(resolvePhase(fixture.phases[0], fixture, run())).toEqual({ context: 'ctx1', unlocks: [] });
  });
  it('first matching variant replaces the context and adds unlocks (is: wrong)', () => {
    expect(resolvePhase(p2, fixture, run({ answers: { a: 'b' } }))).toEqual({ context: 'ctx2-wrong', unlocks: ['d-var'] });
  });
  it('chose compares with the answer of the earlier choice', () => {
    expect(resolvePhase(p2, fixture, run({ answers: { a: 'a' } }))).toEqual({ context: 'ctx2-chose-a', unlocks: [] });
  });
  it('an unanswered task counts as wrong', () => {
    expect(resolvePhase(p2, fixture, run()).context).toBe('ctx2-wrong');
  });
});

describe('visibleDocs', () => {
  const ids = (r: SupuestoRun) => visibleDocs(fixture, r).map((d) => d.id);
  it('shows ungated docs from the start', () => {
    expect(ids(run())).toEqual(['d-open']);
  });
  it('shows a gated doc once its phase is submitted', () => {
    expect(ids(run({ submitted: ['p1'] }))).toEqual(['d-open', 'd-gate']);
  });
  it('shows variant unlocks only for phases already shown', () => {
    expect(ids(run({ phaseIndex: 0, answers: { a: 'b' } }))).toEqual(['d-open']);
    expect(ids(run({ phaseIndex: 1, answers: { a: 'b' } }))).toEqual(['d-open', 'd-var']);
  });
});

describe('scoreRun', () => {
  // a: 5/5 correct; b: 2 right, 0 wrong -> 2.5/5; w2 unchecked -> 0/4. max 14.
  it('computes grade 6.7 from earned minus hint cost', () => {
    // fixture with only a + b: max 10, earned 7.5, hint 0.8 -> (6.7)/10*10
    const small: Supuesto = { ...fixture, phases: [fixture.phases[0]] };
    const sc = scoreRun(small, run({ answers: { a: 'a', b: ['a', 'b'] }, hints: ['a'] }));
    expect(sc).toMatchObject({ earned: 7.5, max: 10, hintCost: 0.8, grade: 6.7, autoGrade: 6.7, passed: true });
  });

  it('autoGrade ignores written tasks; grade includes the self-assessment', () => {
    const sc = scoreRun(fixture, run({ answers: { a: 'a', b: ['a', 'b', 'c', 'd'] }, self: { w2: ['k2'] } }));
    expect(sc).toMatchObject({ earned: 13, max: 14, autoEarned: 10, autoMax: 10, autoGrade: 10, grade: 9.3 });
  });

  it('clamps at 0 and reports not passed', () => {
    const sc = scoreRun(fixture, run({ hints: ['a'] }));
    expect(sc).toMatchObject({ earned: 0, grade: 0, autoGrade: 0, passed: false });
  });

  it('groups by phase and by topic (default: first section)', () => {
    const sc = scoreRun(fixture, run({ answers: { a: 'a', b: ['a', 'b'] }, self: { w2: ['k1'] } }));
    expect(sc.byPhase).toEqual([
      { id: 'p1', title: 'Fase 1', earned: 7.5, max: 10 },
      { id: 'p2', title: 'Fase 2', earned: 1, max: 4 },
    ]);
    expect(sc.byTopic).toEqual([
      { topic: 'sp1', earned: 6, max: 9 },
      { topic: 'sp2', earned: 2.5, max: 5 },
    ]);
  });

  it('review lists internal lesson refs of incorrect tasks without duplicates', () => {
    const sc = scoreRun(fixture, run({ answers: { a: 'b', b: ['a', 'b', 'c', 'd'] } }));
    // a wrong (/learn/sp1m1 + external ignored), b correct, w2 wrong (/learn/sp1m1 again)
    expect(sc.review).toEqual([{ label: 'L', href: '/learn/sp1m1' }]);
    const all = scoreRun(fixture, run());
    expect(all.review.map((r) => r.href)).toEqual(['/learn/sp1m1', '/learn/sp2m1']);
  });
});
