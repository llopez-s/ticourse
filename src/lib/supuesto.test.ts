import { describe, expect, it } from 'vitest';
import { metaOf, validateSupuesto, type Supuesto, type ValidationContext } from './supuesto';

const ctx: ValidationContext = {
  moduleIds: new Set(['op1m1', 'op1m2']),
  sectionIds: new Set(['op1', 'op2']),
};

const fixture: Supuesto = {
  id: 'sup-test',
  track: 'opo',
  sectionIds: ['op1'],
  version: 1,
  title: 'Supuesto de prueba',
  brief: 'Un caso mínimo.',
  minutes: 30,
  prerequisites: ['op1m1'],
  sources: [{ label: 'Norma', href: 'https://example.org/norma' }],
  dossier: [
    { id: 'd1', title: 'Memo', kind: 'memo', body: [] },
    { id: 'd2', title: 'Acta', kind: 'acta', unlockedBy: 'p1' },
  ],
  phases: [
    {
      id: 'p1',
      title: 'Fase 1',
      context: 'Contexto 1',
      tasks: [
        {
          id: 't1', kind: 'choice', prompt: 'Elige', points: 2, explain: 'e', refs: [{ label: 'L', href: '/learn/op1m2' }],
          options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], answer: 'a',
        },
        {
          id: 't2', kind: 'multi', prompt: 'Elige varias', points: 2, explain: 'e', refs: [],
          options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }, { id: 'c', text: 'C' }], answer: ['a', 'c'],
        },
        { id: 't3', kind: 'numeric', prompt: 'Cuánto', points: 1, explain: 'e', refs: [], answer: 254, tolerance: 0, unit: 'hosts' },
      ],
    },
    {
      id: 'p2',
      title: 'Fase 2',
      context: 'Contexto 2',
      variants: [{ when: { task: 't1', is: 'wrong' }, context: 'Variante', unlocks: ['d2'] }],
      tasks: [
        {
          id: 't4', kind: 'table', prompt: 'Tabla', points: 2, explain: 'e', refs: [],
          fields: [{ id: 'f1', label: 'Tipo', options: ['x', 'y'] }],
          rows: [{ id: 'r1', label: 'Fila', answer: { f1: 'x' } }],
        },
        { id: 't5', kind: 'order', prompt: 'Ordena', points: 2, explain: 'e', refs: [], items: [{ id: 'i1', text: '1' }, { id: 'i2', text: '2' }], answer: ['i2', 'i1'] },
        {
          id: 't6', kind: 'match', prompt: 'Une', points: 2, explain: 'e', refs: [],
          left: [{ id: 'l1', text: 'L1' }, { id: 'l2', text: 'L2' }], right: [{ id: 'r1', text: 'R1' }, { id: 'r2', text: 'R2' }],
          answer: { l1: 'r2', l2: 'r1' },
        },
        { id: 't7', kind: 'cite', prompt: 'Cita', points: 1, explain: 'e', refs: [], answerSets: [['d1'], ['d2']] },
        {
          id: 't8', kind: 'written', prompt: 'Redacta', points: 4, explain: 'e', refs: [], words: 100, model: 'Modelo',
          rubric: [{ id: 'k1', text: 'Uno', points: 3 }, { id: 'k2', text: 'Dos', points: 1 }],
        },
      ],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const task = (s: Supuesto, id: string): any => s.phases.flatMap((p) => p.tasks).find((t) => t.id === id);
const choice = (s: Supuesto) => task(s, 't1');
const cite = (s: Supuesto) => task(s, 't7');
const written = (s: Supuesto) => task(s, 't8');

describe('validateSupuesto', () => {
  it('accepts a valid supuesto', () => expect(validateSupuesto(fixture, ctx)).toEqual([]));

  it.each<[string, (s: Supuesto) => void, RegExp]>([
    ['duplicate task id', (s) => { s.phases[1].tasks[0].id = s.phases[0].tasks[0].id; }, /duplicate id/],
    ['choice answer not an option', (s) => { choice(s).answer = 'zz'; }, /answer/],
    ['cite to unknown doc', (s) => { cite(s).answerSets = [['nope']]; }, /unknown doc/],
    ['unlockedBy unknown phase', (s) => { s.dossier[1].unlockedBy = 'p9'; }, /unknown phase/],
    ['variant looks at a later phase', (s) => { s.phases[0].variants = [{ when: { task: s.phases[1].tasks[0].id, is: 'correct' }, context: 'x' }]; }, /earlier phase/],
    ['rubric points ≠ task points', (s) => { written(s).points = 99; }, /rubric/],
    ['ref to missing lesson', (s) => { s.phases[0].tasks[0].refs = [{ label: 'x', href: '/learn/op9m9' }]; }, /lesson/],
    ['unknown section', (s) => { s.sectionIds = ['op9']; }, /section/],
    ['hint cost > points', (s) => { s.phases[0].tasks[0].hint = { text: 'h', cost: 999 }; }, /hint/],
    ['minutes not positive', (s) => { s.minutes = 0; }, /minutes/],
    ['table answer outside options', (s) => { task(s, 't4').rows[0].answer.f1 = 'zzz'; }, /table/],
    ['order ids that do not match', (s) => { task(s, 't5').answer = ['i1', 'i9']; }, /order/],
    ['match ids that do not match', (s) => { task(s, 't6').answer = { l1: 'r9', l2: 'r1' }; }, /match/],
    ['multi with empty answer', (s) => { task(s, 't2').answer = []; }, /multi/],
    ['variant unlocks unknown doc', (s) => { s.phases[1].variants![0].unlocks = ['d9']; }, /unknown doc/],
    ['variant chose invalid option', (s) => { s.phases[1].variants![0].when = { task: 't1', chose: 'zz' }; }, /option/],
  ])('rejects %s', (_n, mutate, re) => {
    const s = structuredClone(fixture);
    mutate(s);
    expect(validateSupuesto(s, ctx).join('\n')).toMatch(re);
  });

  it('prefixes every message with the supuesto id', () => {
    const s = structuredClone(fixture);
    s.minutes = 0;
    expect(validateSupuesto(s, ctx).every((m) => m.startsWith('sup-test: '))).toBe(true);
  });

  it('does not enforce the number of phases', () => {
    const s = structuredClone(fixture);
    s.phases = [s.phases[0]];
    s.dossier[1].unlockedBy = 'p1';
    expect(validateSupuesto(s, ctx)).toEqual([]);
  });
});

describe('metaOf', () => {
  it('keeps only the catalogue fields', () => {
    const m = metaOf({ ...fixture, integrator: true });
    expect(m).toEqual({
      id: 'sup-test', track: 'opo', sectionIds: ['op1'], version: 1,
      title: 'Supuesto de prueba', brief: 'Un caso mínimo.', minutes: 30, integrator: true,
    });
    expect('phases' in m).toBe(false);
  });
});
