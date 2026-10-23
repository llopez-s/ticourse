// What the importer does when Whisper garbles a recording's opening: a clip that starts late, a sentence it skipped.
import assert from 'node:assert/strict';
import test from 'node:test';
import { importReport, mergeAsrWords, midSentenceStarts, recutAdvice, retryTargets } from './recording.mjs';
import { parseSegmentText } from './text.mjs';

/** ASR words from a list of [text, startMs, endMs]. */
const W = (rows) => rows.map(([text, startMs, endMs]) => ({ text, startMs, endMs }));
const seg = (id, text) => ({ id, parsed: parseSegmentText(text, {}) });

const TEXT = 'Empezamos con un caso. El puerto necesita una regla.';

test('midSentenceStarts flags a clip that begins after the first word of the script when that word is said just before it', () => {
  // documentos s02-01: «Empezamos con un caso.» was heard as "Empezamos con el examen. Con un caso", so the clip began at «Con»
  const words = W([
    ['Empezamos', 29160, 29920], ['con', 29920, 29980], ['el', 29980, 29980], ['examen.', 29980, 29980], ['Con', 29980, 30160], ['un', 30160, 30340],
    ['caso,', 30340, 30680], ['el', 31080, 31260], ['puerto', 31260, 31540], ['necesita', 31540, 32020], ['una', 32020, 32340], ['regla.', 32340, 32720],
  ]);
  const segments = [seg('s02-01', TEXT)];
  const out = midSentenceStarts(segments, [{ id: 's02-01', found: true, first: 4, last: 11, score: 0.9 }], words);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 's02-01');
  assert.equal(out[0].word, 'Empezamos');
  assert.equal(out[0].startMs, 29160);
  assert.equal(out[0].endMs, 29980);
  // a clip that starts at its first word has nothing to say
  assert.deepEqual(midSentenceStarts(segments, [{ id: 's02-01', found: true, first: 0, last: 11, score: 1 }], words), []);
});

test('midSentenceStarts leaves a clip alone when the words before it are another clip\'s, a long pause away, or not its opener', () => {
  // the opener is the previous segment's word: used, so it is not voice left out
  const two = W([
    ['Antes', 0, 300], ['de', 300, 450], ['nada.', 450, 900], ['Empezamos', 1000, 1600], ['con', 1600, 1800], ['un', 1800, 1900], ['caso,', 1900, 2300],
    ['el', 2400, 2500], ['puerto', 2500, 2800], ['necesita', 2800, 3200], ['una', 3200, 3300], ['regla.', 3300, 3700],
  ]);
  const both = [seg('a', 'Antes de nada.'), seg('b', TEXT)];
  assert.deepEqual(midSentenceStarts(both, [{ id: 'a', found: true, first: 0, last: 3, score: 1 }, { id: 'b', found: true, first: 4, last: 11, score: 0.9 }], two), []);
  // 900 ms of pause between the opener and the clip: a false start, not a lost opening
  const gapped = W([
    ['Empezamos', 0, 600], ['con', 1500, 1700], ['un', 1700, 1800], ['caso,', 1800, 2200], ['el', 2300, 2400], ['puerto', 2400, 2700], ['necesita', 2700, 3100],
    ['una', 3100, 3200], ['regla.', 3200, 3600],
  ]);
  assert.deepEqual(midSentenceStarts([seg('b', TEXT)], [{ id: 'b', found: true, first: 1, last: 8, score: 0.9 }], gapped), []);
  // nothing before it that looks like the opener
  const other = W([
    ['Hola.', 0, 300], ['con', 400, 600], ['un', 600, 700], ['caso,', 700, 1100], ['el', 1200, 1300], ['puerto', 1300, 1600], ['necesita', 1600, 2000],
    ['una', 2000, 2100], ['regla.', 2100, 2500],
  ]);
  assert.deepEqual(midSentenceStarts([seg('b', TEXT)], [{ id: 'b', found: true, first: 1, last: 8, score: 0.9 }], other), []);
});

test('retryTargets keeps the gaps that have voice and are long enough, and caps a huge one', () => {
  const gaps = [
    { ids: ['s01-01'], startMs: 2790, endMs: 18750, heard: 'x' },
    { ids: ['s03-01'], startMs: null, endMs: null, heard: '' },
    { ids: ['s04-01'], startMs: 5000, endMs: 5400, heard: '' },
    { ids: ['s05-01', 's05-02'], startMs: 10000, endMs: 400000, heard: '' },
  ];
  assert.deepEqual(retryTargets(gaps), [
    { ids: ['s01-01'], startMs: 2790, endMs: 18750 },
    { ids: ['s05-01', 's05-02'], startMs: 10000, endMs: 130000 },
  ]);
});

test('mergeAsrWords swaps the words of a stretch for those of its second hearing and keeps the order', () => {
  const words = W([['a', 0, 300], ['En', 8040, 8800], ['el', 8800, 8920], ['examen', 8920, 9400], ['z', 20000, 20300]]);
  const patch = W([['En', 2790, 3000], ['el', 3000, 3100], ['puerto', 3100, 3500], ['En', 8040, 8800], ['el', 8800, 8920], ['examen', 8920, 9400], ['fuera', 30000, 30400]]);
  const out = mergeAsrWords(words, patch, { startMs: 2790, endMs: 18750 });
  assert.deepEqual(out.map((w) => w.text), ['a', 'En', 'el', 'puerto', 'En', 'el', 'examen', 'z']);
  assert.ok(out.every((w, k) => k === 0 || w.startMs >= out[k - 1].startMs));
});

test('importReport lists the second hearings and the clips that start mid-sentence', () => {
  const located = [{ id: 's01-01', found: true, first: 0, last: 1, score: 1 }];
  const cuts = [{ id: 's01-01', startMs: 0, endMs: 1000 }];
  const report = importReport({
    located,
    cuts,
    words: [],
    gain: 0,
    retried: [{ ids: ['s01-01'], startMs: 2790, endMs: 18750, recovered: ['s01-01'] }],
    midStarts: [{ id: 's02-01', word: 'Empezamos', missed: 'Empezamos con', startMs: 29160, endMs: 29980 }],
  });
  assert.match(report, /se buscaron otra vez/);
  assert.match(report, /recuperadas: s01-01/);
  assert.match(report, /empiezan a mitad de frase/);
  assert.match(report, /s02-01 · falta «Empezamos con»/);
  assert.doesNotMatch(importReport({ located, cuts, words: [], gain: 0 }), /mitad de frase|otra vez/);
});

test('recutAdvice takes a custom cause instead of guessing one from what Whisper heard', () => {
  const lines = recutAdvice(
    { ids: ['s02-01'], startMs: 28860, endMs: 37570, heard: '' },
    { file: 'v/x.wav', out: 'v/x r.wav', slug: 'documentos-halden', name: 'lidia', python: 'py', lufs: -20.8, cause: 'the opening is just before it' },
  );
  assert.match(lines[0], /s02-01 should be at 0:28\.9–0:37\.6: the opening is just before it\./);
});
