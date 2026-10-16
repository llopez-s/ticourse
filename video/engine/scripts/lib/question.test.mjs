import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeNarration } from './narration.mjs';
import { examObjectiveError } from './profiles.mjs';

const storyboard = {
  chapters: [{ n: 1, title: 'Uno' }, { n: 2, title: 'Dos' }],
  scenes: [
    { id: 's01-a', chapter: 1, requiredCues: ['r1'] },
    { id: 's02-b', chapter: 1, requiredCues: ['reveal-1', 'trap-1'] },
    { id: 's03-c', chapter: 2, requiredCues: [] },
    { id: 's04-d', chapter: 2, requiredCues: [] },
  ],
};
const say = 'Una frase de prueba con suficientes palabras para cumplir el estilo.';
const seg = (id, scene, extra = {}) => ({ id, scene, text: say, ...extra });
const cued = (id, scene, cue) => ({ id, scene, text: `${say} {${cue}}` });
const question = {
  objective: '1.1',
  scenario: 'La grúa 4 corre un sistema que no admite parches y no se puede apagar.',
  q: '¿Qué tipo de control es el aislamiento en su VLAN?',
  options: ['Preventive', 'Compensating', 'Detective', 'Directive'],
  answer: 1,
  trap: 0,
  why: 'Sustituye al parche que no se puede aplicar',
  trapWhy: 'Impide algo, pero su papel es suplir otro control',
  countdownMs: 5000,
  revealAt: 'reveal-1',
};
// s01-a is a plain scene that only carries the cue r1; s02-b carries the question
// in its first segment and both cues in later ones.
const scene1 = () => [seg('s01-01', 's01-a'), cued('s01-02', 's01-a', 'r1')];
const scene2 = (q = question, extra = {}) => [
  seg('s02-01', 's02-b', { question: q, ...extra }),
  cued('s02-02', 's02-b', 'trap-1'),
  cued('s02-03', 's02-b', 'reveal-1'),
];
const full = (middle) => [...scene1(), ...middle, seg('s03-01', 's03-c'), seg('s04-01', 's04-d')];
const run = (segments, opts = {}) => analyzeNarration({ storyboard, narration: { voice: 'es-ES-ElviraNeural', segments }, lexicon: {} }, opts);
const has = (list, re) => assert.ok(list.some((e) => re.test(e)), `${re}\n${list.join('\n')}`);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('a valid question is parsed with trapAt defaulting to revealAt', () => {
  const { errors, segments } = run(full(scene2()));
  assert.deepEqual(errors, []);
  const q = segments.find((s) => s.id === 's02-01').question;
  assert.equal(q.trapAt, 'reveal-1');
  assert.equal(q.revealAt, 'reveal-1');
  assert.equal(q.answer, 1);
  assert.equal(q.trap, 0);
  assert.equal(q.countdownMs, 5000);
  assert.deepEqual(q.options, question.options);
  assert.equal(segments.find((s) => s.id === 's01-01').question, null);
});

test('countdownMs defaults to 5000 and trapAt is kept when given', () => {
  const { countdownMs: _drop, ...noCount } = question;
  const { errors, segments } = run(full(scene2({ ...noCount, revealAt: 'trap-1', trapAt: 'reveal-1' })));
  assert.deepEqual(errors, []);
  const q = segments.find((s) => s.id === 's02-01').question;
  assert.equal(q.countdownMs, 5000);
  assert.equal(q.revealAt, 'trap-1');
  assert.equal(q.trapAt, 'reveal-1');
});

test('options must be exactly four non-empty strings', () => {
  for (const options of [['a', 'b', 'c'], ['A', 'B', 'C', 'D', 'E'], ['A', 'B', '', 'D'], ['A', 'B', 3, 'D'], 'Preventive']) {
    const { errors } = run(full(scene2({ ...question, options })));
    has(errors, /s02-01: question\.options/);
  }
});

test('answer and trap are distinct indexes 0–3', () => {
  has(run(full(scene2({ ...question, answer: 4 }))).errors, /s02-01: question\.answer/);
  has(run(full(scene2({ ...question, trap: -1 }))).errors, /s02-01: question\.trap/);
  has(run(full(scene2({ ...question, answer: 1.5 }))).errors, /s02-01: question\.answer/);
  has(run(full(scene2({ ...question, trap: 1 }))).errors, /s02-01: question\.trap must differ from question\.answer/);
});

test('texts respect their limits and the forbidden-symbol filter', () => {
  const long = (n) => 'x'.repeat(n);
  const { errors } = run(
    full(scene2({ ...question, scenario: long(161), q: long(111), options: [long(71), 'B', 'C', 'D'], why: long(91), trapWhy: long(91), countdownMs: 3000 })),
  );
  has(errors, /question\.scenario is 161 characters \(max 160\)/);
  has(errors, /question\.q is 111 characters \(max 110\)/);
  has(errors, /question\.options\[0\] is 71 characters \(max 70\)/);
  has(errors, /question\.why is 91 characters \(max 90\)/);
  has(errors, /question\.trapWhy is 91 characters \(max 90\)/);
  has(errors, /question\.countdownMs must be between 4000 and 7000/);
  has(run(full(scene2({ ...question, q: 'Qué es 🔒 esto' }))).errors, /question\.q contains a forbidden symbol/);
  has(run(full(scene2({ ...question, why: '' }))).errors, /question\.why must be a non-empty string/);
});

test('revealAt and trapAt must be cues of a later segment of the same scene', () => {
  // the question's own segment carries the cue
  const own = [{ ...cued('s02-01', 's02-b', 'reveal-1'), question }, cued('s02-02', 's02-b', 'trap-1')];
  has(run(full(own)).errors, /s02-01: question\.revealAt "reveal-1" must be a cue of a later segment of s02-b/);
  // an unknown cue, or one that belongs to another scene
  has(run(full(scene2({ ...question, revealAt: 'nope' }))).errors, /s02-01: question\.revealAt "nope" must be a cue of a later segment of s02-b/);
  has(run(full(scene2({ ...question, revealAt: 'r1' }))).errors, /s02-01: question\.revealAt "r1" must be a cue of a later segment of s02-b/);
  has(run(full(scene2({ ...question, trapAt: 'nope' }))).errors, /s02-01: question\.trapAt "nope" must be a cue of a later segment of s02-b/);
  // missing revealAt
  const { revealAt: _r, ...noReveal } = question;
  has(run(full(scene2(noReveal))).errors, /s02-01: question\.revealAt must be a cue id/);
  // the answer is revealed first: trapAt may not fire before revealAt (same cue or later is fine)
  has(run(full(scene2({ ...question, revealAt: 'reveal-1', trapAt: 'trap-1' }))).errors, /s02-01: question\.trapAt "trap-1" must not fire before question\.revealAt "reveal-1"/);
  assert.deepEqual(run(full(scene2({ ...question, revealAt: 'trap-1', trapAt: 'reveal-1' }))).errors, []);
  assert.deepEqual(run(full(scene2({ ...question, revealAt: 'reveal-1', trapAt: 'reveal-1' }))).errors, []);
});

test('one question per scene, none in the closing scene, never with think or intercept in the same scene', () => {
  const two = scene2();
  two[1] = { ...two[1], question: { ...question, revealAt: 'reveal-1' } };
  has(run(full(two)).errors, /scene s02-b: 2 exam questions \(max 1 per scene\)/);

  const closing = run([...scene1(), ...scene2(), seg('s03-01', 's03-c'), seg('s04-01', 's04-d', { question })]);
  has(closing.errors, /s04-01: the closing scene must not carry an exam question/);

  const withThink = scene2();
  withThink[1] = { ...withThink[1], think: { q: '¿Y ahora qué?', holdMs: 2000 } };
  has(run(full(withThink)).errors, /scene s02-b: an exam question cannot share the scene with a think prompt/);

  const withIntercept = scene2();
  withIntercept[1] = { ...withIntercept[1], intercept: { text: 'Borro el log del servidor.', holdMs: 3000 } };
  has(run(full(withIntercept)).errors, /scene s02-b: an exam question cannot share the scene with an intercepted message/);
});

test('an exam card may share the scene (task 3 checks the order against frames)', () => {
  const mid = scene2();
  mid[1] = { ...mid[1], exam: { objective: '1.1', text: 'Control compensatorio', holdSec: 5 } };
  assert.deepEqual(run(full(mid)).errors, []);
});

test("the objective is checked like an exam card's", () => {
  const { errors } = run(full(scene2({ ...question, objective: '9.9' })));
  has(errors, new RegExp(`s02-01: ${escapeRe(examObjectiveError('secplus', '9.9'))}`));
  const gcti = analyzeNarration({ storyboard, narration: { voice: 'es-ES-ElviraNeural', segments: full(scene2({ ...question, objective: '1.1' })) }, lexicon: {} }, { track: 'gcti' });
  has(gcti.errors, new RegExp(escapeRe(examObjectiveError('gcti', '1.1'))));
});

test('the voice should not read the options', () => {
  const read = scene2();
  read[2] = { ...read[2], text: 'Entonces la respuesta es Compensating control, no otra cosa. {reveal-1}' };
  has(run(full(read)).warnings, /s02-03: the voice reads the option "Compensating" of the question/);

  const accents = scene2({ ...question, options: ['Control preventivo', 'Control compensatorio', 'Detective', 'Directive'] });
  accents[1] = { ...accents[1], text: `${say} CONTROL COMPENSATORIO {trap-1}` };
  has(run(full(accents)).warnings, /s02-02: the voice reads the option "Control compensatorio"/);

  // a short one-word option said in passing does not trigger it
  const passing = scene2();
  passing[1] = { ...passing[1], text: 'Esto es muy preventive en realidad, o eso parece. {trap-1}' };
  assert.ok(!run(full(passing)).warnings.some((w) => /reads the option/.test(w)));
});

test('question count outside the profile range warns', () => {
  const two = [
    seg('s01-01', 's01-a', { question: { ...question, revealAt: 'r1' } }),
    cued('s01-02', 's01-a', 'r1'),
    ...scene2(),
    seg('s03-01', 's03-c'),
    seg('s04-01', 's04-d'),
  ];
  const { warnings, errors } = run(two, { examQuestions: [3, 3] });
  assert.deepEqual(errors, []);
  has(warnings, /2 exam questions \(style guide: 3–3\)/);
  // a profile that expects questions warns when the video has none
  has(run(full([seg('s02-01', 's02-b'), cued('s02-02', 's02-b', 'trap-1'), cued('s02-03', 's02-b', 'reveal-1')]), { examQuestions: [3, 3] }).warnings, /0 exam questions \(style guide: 3–3\)/);
  // old profiles ([0, 0]): a question warns, no question stays silent
  has(run(full(scene2())).warnings, /1 exam questions \(style guide: 0–0\)/);
  assert.ok(!run(full([seg('s02-01', 's02-b'), cued('s02-02', 's02-b', 'trap-1'), cued('s02-03', 's02-b', 'reveal-1')])).warnings.some((w) => /exam questions/.test(w)));
});
