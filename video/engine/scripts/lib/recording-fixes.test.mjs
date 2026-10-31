// The automatic fix-up of a recording import: which suggestions are applied, and the cut that moves an edge into a pause.
import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { stretchedWords } from './recording.mjs';
import { SAFE_KINDS, edgeGap, fixEntry, mergeFixes, planFixes, recutArgs, recutPath, reimportArgs } from './recording-fixes.mjs';

test('fixEntry keeps the ranges of a gap, rounded, and drops one with no voice to cut', () => {
  assert.deepEqual(fixEntry('later', { ids: ['s12-05'], startMs: 689999.6, endMs: 697800 }), { kind: 'later', ids: ['s12-05'], parts: [{ startMs: 690000, endMs: 697800 }] });
  const spliced = fixEntry('restart', { ids: ['s03-06'], startMs: 1, endMs: 9, parts: [{ startMs: 1, endMs: 3 }, { startMs: 7, endMs: 9 }] });
  assert.equal(spliced.parts.length, 2);
  assert.equal(fixEntry('missing', { ids: ['s01-01'], startMs: null, endMs: null }), null);
});

test('edgeGap: abrir-web s07-05 — «mayo» ends at 406.72 and the next «Y» is stretched over the pause: cut inside the pause', () => {
  // silencedetect: 406.75–407.45 is quiet; the clip ended at 406.60, inside the last word
  const silences = [{ startMs: 401500, endMs: 402300 }, { startMs: 406750, endMs: 407450 }];
  const gap = edgeGap({ id: 's07-05', head: 0.1, tail: 0.56 }, { id: 's07-05', startMs: 402400, endMs: 406600 }, silences, { limit: 0.35 });
  assert.equal(gap.ids[0], 's07-05');
  assert.equal(gap.startMs, 402400);
  assert.equal(gap.endMs, 406900); // 150 ms into the pause
  assert.equal(gap.parts, undefined);
});

test('edgeGap: a short pause is cut in its middle; the head moves back into the pause before the clip', () => {
  const silences = [{ startMs: 1000, endMs: 1200 }, { startMs: 5000, endMs: 5100 }];
  const tail = edgeGap({ id: 'a', head: 0, tail: 0.9 }, { id: 'a', startMs: 1250, endMs: 4990 }, silences, { limit: 0.35 });
  assert.equal(tail.endMs, 5050);
  const head = edgeGap({ id: 'a', head: 0.9, tail: 0 }, { id: 'a', startMs: 1250, endMs: 4990 }, silences, { limit: 0.35 });
  assert.equal(head.startMs, 1100);
  assert.equal(head.endMs, 4990);
});

test('edgeGap changes only the side that is bad, the last part of a spliced clip, and gives up without a close pause', () => {
  const silences = [{ startMs: 500, endMs: 700 }, { startMs: 9000, endMs: 9400 }];
  const cut = { id: 'a', startMs: 800, endMs: 8900, parts: [{ startMs: 800, endMs: 3000 }, { startMs: 6000, endMs: 8900 }] };
  const gap = edgeGap({ id: 'a', head: 0, tail: 0.8 }, cut, silences, { limit: 0.35 });
  assert.deepEqual(gap.parts, [{ startMs: 800, endMs: 3000 }, { startMs: 6000, endMs: 9150 }]);
  assert.equal(gap.endMs, 9150);
  assert.equal(edgeGap({ id: 'a', head: 0, tail: 0.8 }, { id: 'a', startMs: 800, endMs: 4000 }, silences, { limit: 0.35 }), null); // 5 s to the next pause
  assert.equal(edgeGap({ id: 'a', head: 0, tail: 0.1 }, cut, silences, { limit: 0.35 }), null); // nothing wrong
});

test('planFixes applies the safe kinds, one per clip (the first kind wins), and leaves the others for her', () => {
  const fixes = [
    { kind: 'edge', ids: ['s07-05'], parts: [{ startMs: 1, endMs: 2 }] },
    { kind: 'unheard', ids: ['s08-06'], parts: [{ startMs: 3, endMs: 4 }] },
    { kind: 'later', ids: ['s12-05'], parts: [{ startMs: 5, endMs: 6 }] },
    { kind: 'edge', ids: ['s12-05'], parts: [{ startMs: 7, endMs: 8 }] },
    { kind: 'stretched', ids: ['s09-01'], parts: [{ startMs: 9, endMs: 10 }] },
  ];
  const plan = planFixes(fixes);
  assert.deepEqual(plan.apply.map((f) => [f.ids[0], f.kind]), [['s07-05', 'edge'], ['s09-01', 'stretched'], ['s12-05', 'later']]);
  assert.deepEqual(plan.apply[2].parts, [{ startMs: 5, endMs: 6 }]);
  assert.deepEqual(plan.manual, [{ id: 's08-06', kind: 'unheard' }]);
  // all kinds on: the unheard one is applied too
  assert.deepEqual(planFixes(fixes, { kinds: [...SAFE_KINDS, 'unheard'] }).apply.map((f) => f.ids[0]), ['s07-05', 's08-06', 's09-01', 's12-05']);
});

test('stretchedWords: abrir-web s08-06 — the pause after the trimmed word is where the clean take starts', () => {
  // «Quien mire la» (477.4–479.3), 1.8 s of silence, the retake from 481.15 whose first words Whisper dropped
  const words = [
    { text: 'Quien', startMs: 477080, endMs: 477620 }, { text: 'mire', startMs: 477620, endMs: 477940 }, { text: 'la', startMs: 477940, endMs: 479300 },
    { text: 'red', startMs: 481820, endMs: 482080 }, { text: 've', startMs: 482080, endMs: 482440 },
  ];
  const silences = [{ startMs: 479300, endMs: 481150 }];
  const out = stretchedWords([{ id: 's08-06', found: true, first: 0, last: 4 }], words, silences);
  assert.equal(out.length, 1);
  assert.equal(out[0].text, 'la');
  assert.equal(out[0].retakeMs, 481150);
  // a word cut down inside the pause (silence inside it) still reports the end of that silence
  const inside = stretchedWords([{ id: 'a', found: true, first: 0, last: 1 }], [{ text: 'disco', startMs: 0, endMs: 5000 }, { text: 'duro', startMs: 5000, endMs: 5300 }], [{ startMs: 1000, endMs: 3800 }]);
  assert.equal(inside[0].retakeMs, 3800);
  // no pause anywhere near: nothing to say about where the retake is
  assert.equal(stretchedWords([{ id: 'a', found: true, first: 0, last: 1 }], [{ text: 'disco', startMs: 0, endMs: 2000 }, { text: 'duro', startMs: 2000, endMs: 2300 }], [])[0].retakeMs, null);
});

test('planFixes does not try a clip twice: the same cut would give the same clip', () => {
  const plan = planFixes([{ kind: 'later', ids: ['a'], parts: [{ startMs: 1, endMs: 2 }] }], { done: ['a'] });
  assert.deepEqual(plan.apply, []);
  assert.deepEqual(plan.repeated, ['a']);
});

test('a fix naming two clips is cut once, with its clips in script order', () => {
  const plan = planFixes([{ kind: 'later', ids: ['s02-02', 's02-01'], parts: [{ startMs: 1, endMs: 9 }] }]);
  assert.equal(plan.apply.length, 1);
  assert.deepEqual(plan.apply[0].ids, ['s02-01', 's02-02']);
});

test('mergeFixes: a partial import replaces the clips it rewrote and keeps the others', () => {
  const before = [{ kind: 'later', ids: ['a'], parts: [] }, { kind: 'edge', ids: ['b'], parts: [] }];
  const now = [{ kind: 'edge', ids: ['b'], parts: [{ startMs: 1, endMs: 2 }] }];
  const merged = mergeFixes(before, now, ['b']);
  assert.deepEqual(merged.map((f) => f.ids[0]), ['a', 'b']);
  assert.deepEqual(merged[1].parts, [{ startMs: 1, endMs: 2 }]);
  assert.deepEqual(mergeFixes(null, now, ['b']), now);
  assert.deepEqual(mergeFixes(before, [], ['b']).map((f) => f.ids[0]), ['a']); // b rewritten with nothing left to fix
});

test('recutPath numbers a second round; recutArgs and reimportArgs build the commands', () => {
  const master = path.join('v', 'abrir-web lidia (master).wav');
  const taken = new Set([path.join('v', 'abrir-web lidia arreglos (recorte).wav')]);
  assert.equal(recutPath(master, (p) => taken.has(p)), path.join('v', 'abrir-web lidia arreglos 2 (recorte).wav'));
  assert.equal(recutPath(master, () => false), path.join('v', 'abrir-web lidia arreglos (recorte).wav'));
  const args = recutArgs('scripts', { out: 'o.wav', file: 'm.wav', apply: [{ parts: [{ startMs: 402300, endMs: 406850 }] }, { parts: [{ startMs: 1000, endMs: 2000 }, { startMs: 5000, endMs: 6000 }] }] });
  assert.deepEqual(args.filter((a) => a.startsWith('m.wav@')), ['m.wav@402.30-406.85', 'm.wav@1.00-2.00', 'm.wav@5.00-6.00']);
  assert.equal(args[args.indexOf('--out') + 1], 'o.wav');
  const re = reimportArgs('scripts', { slug: 'abrir-web', file: 'o.wav', name: 'lidia', ids: ['s07-05', 's12-05'] });
  assert.deepEqual(re.slice(1), ['--video', 'abrir-web', '--file', 'o.wav', '--name', 'lidia', '--only', 's07-05,s12-05', '--reuse-gain']);
});
