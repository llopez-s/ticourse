// Guards the importer got on 2026-10-25 (V39, V43): hallucinated zero-length words, ghost words, clips cut inside the
// voice (edge energy), and the gain / voice name of a partial re-import.
import assert from 'node:assert/strict';
import test from 'node:test';
import { examFitAdvice } from '../build-timeline.mjs';
import {
  EDGE_ENERGY_LIMIT,
  EDGE_FIX_ENERGY,
  dropSilentWordRuns,
  edgeCheckLine,
  edgeEnergies,
  edgeOffenders,
  importGainRecord,
  importReport,
  inferFullImport,
  locateSegments,
  cutPoints,
  pcm16FromWav,
  planGain,
  pullStartToQuiet,
  pushEndToQuiet,
  refineCuts,
  trimGhostWords,
} from './recording.mjs';
import { LIMITS } from './verify-voice.mjs';
import { parseSegmentText } from './text.mjs';

const SR = 16000;
/** ASR words from a list of [text, startMs, endMs]. */
const W = (rows) => rows.map(([text, startMs, endMs]) => ({ text, startMs, endMs }));

/**
 * A synthetic recording: 200 Hz "voice" bursts [fromMs, toMs, amp, decayMs?], each followed by an exponential tail when
 * decayMs is given (the way a voice dies away after the last consonant), and digital silence everywhere else.
 */
function recording(totalMs, bursts) {
  const out = new Float32Array(Math.round((totalMs * SR) / 1000));
  for (const [from, to, amp, decayMs] of bursts) {
    const tailEnd = decayMs ? to + decayMs * 6 : to;
    for (let i = Math.round((from * SR) / 1000); i < Math.min(out.length, Math.round((tailEnd * SR) / 1000)); i++) {
      const ms = (i * 1000) / SR;
      const level = ms <= to ? amp : amp * Math.exp(-(ms - to) / decayMs);
      out[i] += level * Math.sin((2 * Math.PI * 200 * i) / SR);
    }
  }
  return out;
}

test('dropSilentWordRuns: 11 words stamped on one instant are dropped (V43 cumplimiento-halden, 29.98 s)', () => {
  const words = W([
    ['Antes', 28960, 29200], ['de', 29200, 29300], ['lanzar', 29300, 29640], ['el', 29640, 29760],
    ...'teléfono y su número de documento, antes de lanzar el teléfono'.split(' ').map((t) => [t, 29980, 29980]),
    ['sistema,', 30000, 30600], ['el', 30700, 30800], ['puerto', 30800, 31300],
  ]);
  const input = JSON.stringify(words);
  const out = dropSilentWordRuns(words);
  assert.equal(JSON.stringify(words), input); // not modified
  assert.equal(out.dropped.length, 1);
  assert.equal(out.dropped[0].count, 11);
  assert.equal(out.dropped[0].startMs, 29980);
  assert.match(out.dropped[0].text, /^teléfono y su número de documento, antes de lanzar el teléfono$/);
  assert.deepEqual(out.words.map((w) => w.text), ['Antes', 'de', 'lanzar', 'el', 'sistema,', 'el', 'puerto']);
});

test('dropSilentWordRuns: one or two words with no duration are normal and stay; 10 ms counts as none, 11 ms does not', () => {
  const two = W([['a', 0, 400], ['el', 400, 400], ['examen.', 400, 405], ['Con', 405, 800]]);
  assert.equal(dropSilentWordRuns(two).words.length, 4);
  assert.equal(dropSilentWordRuns(two).dropped.length, 0);
  const edge = W([['uno', 0, 10], ['dos', 10, 20], ['tres', 20, 30]]);
  assert.equal(dropSilentWordRuns(edge).dropped.length, 1);
  const slow = W([['uno', 0, 11], ['dos', 11, 22], ['tres', 22, 33]]);
  assert.equal(dropSilentWordRuns(slow).dropped.length, 0);
  // two separate short runs do not add up
  const split = W([['a', 0, 0], ['b', 0, 0], ['largo', 0, 500], ['c', 500, 500], ['d', 500, 500]]);
  assert.equal(dropSilentWordRuns(split).dropped.length, 0);
});

test('trimGhostWords: «y» 167.70–170.08 s over a silence is cut down to its voiced stretch and flagged (V39 s05-01)', () => {
  const words = W([['entrar', 167000, 167700], ['y', 167700, 170080], ['salir', 170100, 170600]]);
  const silences = [{ startMs: 168000, endMs: 170050 }];
  const out = trimGhostWords(words, silences);
  assert.equal(out.trimmed.length, 1);
  assert.deepEqual([out.words[1].startMs, out.words[1].endMs, out.words[1].ghost], [167700, 168000, true]);
  assert.deepEqual(out.words[0], words[0]); // the others are untouched (same objects)
  assert.equal(out.words[2], words[2]);
});

test('trimGhostWords: leaves long words, figures, short words that are not long, and words with no silence inside alone', () => {
  const silences = [{ startMs: 1000, endMs: 2000 }];
  const keep = W([['importante', 500, 3000], ['50', 500, 3000], ['el', 500, 900], ['y', 3000, 4500]]);
  assert.equal(trimGhostWords(keep, silences).trimmed.length, 0); // 'y' lasts 1.5 s but there is no silence inside it
});

test('edgeEnergies: the LIMIT is the one verify-voice enforces, and a clip cut in its voice tail reads above it', () => {
  assert.equal(EDGE_ENERGY_LIMIT, LIMITS.head);
  assert.equal(EDGE_ENERGY_LIMIT, LIMITS.tail);
  assert.ok(EDGE_FIX_ENERGY < EDGE_ENERGY_LIMIT);
  const audio = recording(3000, [[200, 1000, 0.3, 40]]);
  const inTail = edgeEnergies(audio, SR, [{ startMs: 100, endMs: 1040 }]);
  assert.ok(inTail.tail > EDGE_ENERGY_LIMIT, `tail ${inTail.tail}`);
  assert.ok(inTail.head < 0.01);
  const clean = edgeEnergies(audio, SR, [{ startMs: 100, endMs: 1400 }]);
  assert.ok(clean.tail < 0.01 && clean.head < 0.01);
});

test('pushEndToQuiet: V39 s05-01 shape — the clip stops in the decaying tail of the last word; the end moves to the silence', () => {
  // voice until 1.00 s, tail dying away for ~0.25 s, digital silence after; Whisper ended the word (and the cut) at 1.00 s
  const audio = recording(3000, [[200, 1000, 0.3, 40]]);
  const r = pushEndToQuiet(audio, SR, { startMs: 100, endMs: 1000 });
  assert.ok(r.moved);
  assert.ok(r.endMs > 1050 && r.endMs <= 1500, `end ${r.endMs}`);
  assert.ok(r.before > EDGE_ENERGY_LIMIT && r.after <= 0.12, `${r.before} -> ${r.after}`);
  assert.ok(edgeEnergies(audio, SR, [{ startMs: 100, endMs: r.endMs }]).tail < 0.12);
});

test('pushEndToQuiet: stops at the valley before the next word instead of walking into it, and respects the guard', () => {
  // the next word starts abruptly at 1.07 s: the tail has not died away yet, but the valley before it is quiet enough
  const audio = recording(3000, [[200, 1000, 0.3, 40], [1070, 1600, 0.3]]);
  const r = pushEndToQuiet(audio, SR, { startMs: 100, endMs: 1000 });
  assert.ok(r.moved);
  assert.ok(r.endMs <= 1075, `end ${r.endMs}`);
  assert.ok(r.after <= EDGE_FIX_ENERGY);
  // a guard at the cut itself forbids any move
  const guarded = pushEndToQuiet(audio, SR, { startMs: 100, endMs: 1000 }, { guardMs: 1000 });
  assert.equal(guarded.moved, false);
  assert.equal(guarded.endMs, 1000);
});

test('pushEndToQuiet: leaves a clip that already ends in silence, and never goes further than 500 ms', () => {
  const quiet = recording(3000, [[200, 1000, 0.3]]);
  assert.equal(pushEndToQuiet(quiet, SR, { startMs: 100, endMs: 1100 }).moved, false);
  // voice that keeps going for 2 s: nothing quiet within 500 ms, so the cut stays
  const long = recording(4000, [[200, 3000, 0.3]]);
  const r = pushEndToQuiet(long, SR, { startMs: 100, endMs: 1000 });
  assert.equal(r.moved, false);
  assert.equal(r.endMs, 1000);
});

test('pullStartToQuiet: a clip that starts inside a word begins in the silence before it, not before the guard', () => {
  const audio = recording(3000, [[1000, 2000, 0.3]]);
  const cut = pullStartToQuiet(audio, SR, { startMs: 1010, endMs: 2100 });
  assert.ok(cut.moved);
  assert.ok(cut.startMs < 1000 && cut.startMs >= 700, `start ${cut.startMs}`);
  assert.ok(cut.after <= 0.12);
  const guarded = pullStartToQuiet(audio, SR, { startMs: 1010, endMs: 2100 }, { guardMs: 1005 });
  assert.equal(guarded.moved, false);
  assert.equal(pullStartToQuiet(audio, SR, { startMs: 900, endMs: 2100 }).moved, false); // already in silence
});

test('refineCuts: moves the end past a ghost word\'s start but not past a real next word; spliced takes keep their parts', () => {
  const audio = recording(5000, [[200, 1000, 0.3, 40], [3000, 3600, 0.3]]);
  // «entrar» ended at 1.00 s; the ghost «y» starts there (flagged), the real next word is at 3.00 s
  const words = [
    { text: 'Hay', startMs: 200, endMs: 500 },
    { text: 'entrar', startMs: 500, endMs: 1000 },
    { text: 'y', startMs: 1000, endMs: 1050, ghost: true },
    { text: 'salir', startMs: 3000, endMs: 3600 },
  ];
  const located = [{ id: 's05-01', found: true, first: 0, last: 1, score: 1 }, { id: 's05-02', found: true, first: 3, last: 3, score: 1 }];
  const cuts = [{ id: 's05-01', startMs: 100, endMs: 1000 }, { id: 's05-02', startMs: 2900, endMs: 3700 }];
  const out = refineCuts(audio, SR, cuts, located, words);
  assert.equal(out.fixes.length, 1);
  assert.equal(out.fixes[0].id, 's05-01');
  assert.ok(out.cuts[0].endMs > 1050 && out.cuts[0].endMs < 1500);
  assert.equal(out.cuts[0].startMs, 100);
  assert.deepEqual(out.cuts[1], cuts[1]);
  // same shape, but the word after is a real word starting at 1.02 s: the end cannot pass it
  const real = words.map((w) => (w.ghost ? { ...w, ghost: false } : w));
  const stopped = refineCuts(audio, SR, cuts, located, real);
  assert.ok(stopped.cuts[0].endMs <= 1000, `end ${stopped.cuts[0].endMs}`);
  // a spliced take: only the first start and the last end move
  const parts = [{ startMs: 100, endMs: 600 }, { startMs: 700, endMs: 1000 }];
  const spliced = refineCuts(audio, SR, [{ id: 's05-01', startMs: 100, endMs: 1000, parts }], [{ id: 's05-01', found: true, first: 0, last: 1, parts: [{ first: 0, last: 0 }, { first: 1, last: 1 }] }], words);
  assert.deepEqual(spliced.cuts[0].parts[0], parts[0]);
  assert.equal(spliced.cuts[0].parts[1].startMs, 700);
  assert.equal(spliced.cuts[0].parts[1].endMs, spliced.cuts[0].endMs);
  assert.ok(spliced.cuts[0].endMs > 1000);
});

test('edgeOffenders / edgeCheckLine: lists the clips verify-voice would call «stops inside a word»', () => {
  const audio = recording(4000, [[200, 1000, 0.3, 40], [2000, 2600, 0.3]]);
  const bad = edgeOffenders(audio, SR, [
    { id: 's05-01', ranges: [{ startMs: 100, endMs: 1000 }] },
    { id: 's05-02', ranges: [{ startMs: 1900, endMs: 2800 }] },
  ]);
  assert.deepEqual(bad.map((b) => b.id), ['s05-01']);
  assert.match(edgeCheckLine(bad), /^Comprobación de bordes: 1 clips con energía alta en el borde: s05-01 \(final \d\.\d\d\)$/);
  assert.equal(edgeCheckLine([]), 'Comprobación de bordes: 0 clips con energía alta en el borde');
});

test('importReport: lists dropped runs, ghosts, moved edges and the edge check only when there are any', () => {
  const located = [{ id: 's01-01', found: true, score: 1, first: 0, last: 0 }];
  const cuts = [{ id: 's01-01', startMs: 0, endMs: 1000 }];
  const base = { located, cuts, words: W([['hola', 0, 500]]), gain: 1 };
  const plain = importReport(base);
  assert.doesNotMatch(plain, /sin duración|fantasma|Bordes movidos|Comprobación de bordes/);
  const full = importReport({
    ...base,
    silentRuns: [{ count: 11, startMs: 29980, endMs: 29980, text: 'teléfono y su' }],
    ghosts: [{ text: 'y', startMs: 167700, endMs: 170080, toStartMs: 167700, toEndMs: 168000 }],
    edgeFixes: [{ id: 's05-01', tail: { fromMs: 167700, toMs: 168000, before: 0.72, after: 0.05 } }],
    edgeOffenders: [{ id: 's05-02', head: 0.1, tail: 0.6 }],
  });
  assert.match(full, /11 palabras sin duración descartadas: teléfono y su/);
  assert.match(full, /«y» 2:47\.7–2:50\.1 → 2:47\.7–2:48\.0/);
  assert.match(full, /s05-01 · final 2:47\.7 → 2:48\.0 \(energía 0\.72 → 0\.05\)/);
  assert.match(full, /Comprobación de bordes: 1 clips con energía alta en el borde: s05-02 \(final 0\.60\)/);
});

test('planGain: --only with a cut reuses the full import\'s gain by itself; explicit flags win; the rest is measured', () => {
  const saved = { gainDb: 1.8, sha256: 'full', file: 'video/engine/voices/lidia.wav' };
  const cut = planGain({ only: ['s06-03'], sha256: 'cut', saved });
  assert.equal(cut.mode, 'reuse');
  assert.equal(cut.gainDb, 1.8);
  assert.equal(cut.fullFile, false);
  assert.match(cut.message, /se reutiliza la ganancia de la importación completa: \+1\.8 dB \(video\/engine\/voices\/lidia\.wav\)/);
  assert.equal(planGain({ only: ['s06-03'], sha256: 'full', saved }).fullFile, true);
  assert.equal(planGain({ sha256: 'full', saved }).mode, 'measure'); // a full import is measured as always
  assert.equal(planGain({ only: ['s06-03'], sha256: 'cut', saved: null }).mode, 'measure');
  assert.equal(planGain({ only: ['s06-03'], sha256: 'cut', saved, lufs: -18.2 }).mode, 'measure');
  assert.equal(planGain({ only: ['s06-03'], sha256: 'cut', saved, match: 'x.mp3' }).mode, 'measure');
  const explicit = planGain({ only: ['s06-03'], sha256: 'cut', saved, gain: -0.5 });
  assert.deepEqual([explicit.mode, explicit.gainDb], ['explicit', -0.5]);
  assert.match(planGain({ sha256: 'full', saved: null, gain: 0 }).message, /ganancia fija \+0 dB/);
  assert.equal(planGain({ sha256: 'cut', saved, reuseGain: true }).mode, 'reuse'); // --reuse-gain without --only too
});

test('planGain: --gain and --reuse-gain exclude each other and --lufs / --match; --reuse-gain needs a full import', () => {
  const saved = { gainDb: 1.8, sha256: 'full' };
  assert.throws(() => planGain({ only: ['a'], sha256: 'x', saved, gain: 1, lufs: -18 }), /no se pueden combinar/);
  assert.throws(() => planGain({ only: ['a'], sha256: 'x', saved, gain: 1, match: 'a.mp3' }), /no se pueden combinar/);
  assert.throws(() => planGain({ only: ['a'], sha256: 'x', saved, reuseGain: true, lufs: -18 }), /no se pueden combinar/);
  assert.throws(() => planGain({ only: ['a'], sha256: 'x', saved, reuseGain: true, gain: 1 }), /no se pueden combinar/);
  assert.throws(() => planGain({ only: ['a'], sha256: 'x', saved, gain: Number.NaN }), /número de dB/);
  assert.throws(() => planGain({ only: ['a'], sha256: 'x', saved: null, reuseGain: true }), /--reuse-gain: no hay una importación completa/);
  // --lufs with --match is the old pair (match wins) and stays legal
  assert.equal(planGain({ only: ['a'], sha256: 'x', saved, lufs: -18, match: 'a.mp3' }).mode, 'measure');
});

test('inferFullImport: imports made before import-gain.json — the recording most clips came from, with its gain', () => {
  const rec = (id, sha256, gainDb, voice = 'recording/lidia') => ({ provider: 'recording', voice, source: { file: `voices/${sha256}.wav`, sha256, gainDb }, id });
  const records = [rec('a', 'full', 1.8), rec('b', 'full', 1.8), rec('c', 'full', 1.8), rec('d', 'cut', -0.2), rec('e', 'other', 3, 'recording/otra'), { provider: 'elevenlabs', voice: 'x' }];
  assert.deepEqual(inferFullImport(records, 'recording/lidia'), { sha256: 'full', gainDb: 1.8, file: 'voices/full.wav', inferred: true });
  assert.equal(inferFullImport(records, 'recording/ninguna'), null);
  assert.equal(inferFullImport([], 'recording/lidia'), null);
  // and the planned message says where the gain came from
  const plan = planGain({ only: ['a'], sha256: 'cut', saved: inferFullImport(records, 'recording/lidia') });
  assert.match(plan.message, /leída de los clips ya importados/);
});

test('importGainRecord keeps what a partial import needs', () => {
  const rec = importGainRecord({ gainDb: 1.9, sha256: 'abc', file: 'v.wav', voice: 'recording/lidia', target: { lufs: -18 }, durationMs: 1000, at: '2026-10-25T00:00:00.000Z' });
  assert.deepEqual(Object.keys(rec), ['gainDb', 'sha256', 'file', 'voice', 'target', 'durationMs', 'at']);
  assert.equal(rec.gainDb, 1.9);
});

test('examFitAdvice: says how long an exam card that leaves its scene can be (V43 s12-p5: 14491–14641 in 13498–14634 at 30 fps)', () => {
  const advice = examFitAdvice({ from: 14491, durationInFrames: 150 }, { from: 13498, durationInFrames: 1136 }, 30);
  assert.match(advice, /lengthen the last segment's pauseAfterMs/);
  assert.match(advice, /earlier "at" cue, or set a shorter holdSec/);
  assert.match(advice, /fits up to 4\.7 s/);
  assert.match(advice, /-yt profiles warn below 4 s/);
  // too little room for any legal hold: only the cue can change
  const tight = examFitAdvice({ from: 14600, durationInFrames: 150 }, { from: 13498, durationInFrames: 1136 }, 30);
  assert.match(tight, /only 1\.1 s are left/);
  assert.doesNotMatch(tight, /shorter holdSec/);
  assert.match(examFitAdvice({ from: 100, durationInFrames: 150 }, { from: 200, durationInFrames: 1000 }, 30), /starts before its scene/);
});

test('V43 cumplimiento-halden: with the zero-length run dropped, «Antes de lanzar el sistema…» starts where the voice does', () => {
  const text = 'Antes de lanzar el sistema, el puerto necesita una regla clara.';
  const words = W([
    ['teléfono', 28000, 28400], ['Antes', 28960, 29200], ['de', 29200, 29300], ['lanzar', 29300, 29640], ['el', 29640, 29760],
    ...'teléfono y su número de documento, antes de lanzar el teléfono'.split(' ').map((t) => [t, 29980, 29980]),
    ['sistema,', 30000, 30500], ['el', 30600, 30700], ['puerto', 30700, 31100], ['necesita', 31100, 31600], ['una', 31600, 31800], ['regla', 31800, 32200], ['clara.', 32200, 32700],
  ]);
  const silences = [{ startMs: 28400, endMs: 28900 }, { startMs: 32760, endMs: 33500 }];
  const segments = [{ id: 's09-02', parsed: parseSegmentText(text, {}) }];
  const start = (ws) => {
    const located = locateSegments(segments, ws);
    return cutPoints(located, ws, silences, 34000)[0].startMs;
  };
  assert.ok(start(words) > 29000, 'without the fix the clip starts late (the bug)');
  const clean = dropSilentWordRuns(words).words;
  assert.ok(start(clean) < 29000, `starts at ${start(clean)}`); // «Antes de lanzar el» is inside the clip
});

test('pcm16FromWav reads ffmpeg\'s piped WAV (unknown RIFF size, a LIST chunk before the data)', () => {
  const pcm = Buffer.alloc(8);
  [0, 16384, -16384, -32768].forEach((v, k) => pcm.writeInt16LE(v, k * 2));
  const list = Buffer.concat([Buffer.from('LIST'), Buffer.from([5, 0, 0, 0]), Buffer.from('abcde'), Buffer.from([0])]); // odd size: padded
  const data = Buffer.concat([Buffer.from('data'), Buffer.from([0xff, 0xff, 0xff, 0xff]), pcm]); // streaming: size unknown
  const fmt = Buffer.concat([Buffer.from('fmt '), Buffer.from([16, 0, 0, 0]), Buffer.alloc(16)]);
  const wav = Buffer.concat([Buffer.from('RIFF'), Buffer.from([0xff, 0xff, 0xff, 0xff]), Buffer.from('WAVE'), fmt, list, data]);
  assert.deepEqual([...pcm16FromWav(wav)], [0, 0.5, -0.5, -1]);
  assert.throws(() => pcm16FromWav(Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WAVE')])), /no data chunk/);
});
