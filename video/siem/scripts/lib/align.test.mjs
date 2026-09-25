import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { alignSpokenTokens, displayTimes, normalizeToken } from './align.mjs';
import { parseSegmentText } from './text.mjs';

/** Boundaries at 100 ms steps: each word lasts 80 ms. */
const bounds = (...texts) => texts.map((text, k) => ({ text, offsetMs: 100 + k * 100, durationMs: 80 }));

const assertMonotonic = (times) => {
  let prev = -Infinity;
  for (const t of times) {
    assert.ok(t.startMs >= prev - 1e-9, `start ${t.startMs} >= previous end ${prev}`);
    assert.ok(t.endMs >= t.startMs, 'end >= start');
    prev = t.endMs;
  }
};

test('normalizeToken strips accents, case and punctuation', () => {
  assert.equal(normalizeToken('«Síem»,'), 'siem');
  assert.equal(normalizeToken('Aíslalo!'), 'aislalo');
  assert.equal(normalizeToken('srv-tc-app03'), 'srvtcapp03');
  assert.equal(normalizeToken('—'), '');
});

test('one boundary per token: exact times', () => {
  const t = alignSpokenTokens(['Seis', 'mil', 'avisos.'], bounds('Seis', 'mil', 'avisos'));
  assert.deepEqual(t.map((x) => [x.startMs, x.endMs]), [[100, 180], [200, 280], [300, 380]]);
  assert.ok(t.every((x) => x.matched));
});

test('several boundaries cover one token (identifier split by the voice)', () => {
  const t = alignSpokenTokens(['en', 'srv-tc-app03', 'hoy'], bounds('en', 'srv', 'tc', 'app03', 'hoy'));
  assert.deepEqual(t.map((x) => [x.startMs, x.endMs]), [[100, 180], [200, 480], [500, 580]]);
});

test('one boundary covers several tokens', () => {
  const t = alignSpokenTokens(['net', 'flou', 'ya'], bounds('netflou', 'ya'));
  assert.equal(t[0].startMs, 100);
  assert.equal(t[1].endMs, 180);
  assert.ok(t[0].endMs > t[0].startMs && t[0].endMs <= t[1].startMs);
  assert.deepEqual([t[2].startMs, t[2].endMs], [200, 280]);
});

test('a missing boundary is interpolated between its neighbours', () => {
  const t = alignSpokenTokens(['uno', 'dos', 'tres', 'cuatro'], [
    { text: 'uno', offsetMs: 100, durationMs: 80 },
    { text: 'tres', offsetMs: 400, durationMs: 80 },
    { text: 'cuatro', offsetMs: 500, durationMs: 80 },
  ]);
  assert.deepEqual([t[0].startMs, t[0].endMs], [100, 180]);
  assert.deepEqual([t[1].startMs, t[1].endMs], [180, 400]);
  assert.equal(t[1].matched, false);
  assert.deepEqual([t[2].startMs, t[3].startMs], [400, 500]);
});

test('an extra boundary is skipped', () => {
  const t = alignSpokenTokens(['la', 'alerta', 'salta'], bounds('la', 'eh', 'alerta', 'salta'));
  assert.deepEqual(t.map((x) => x.startMs), [100, 300, 400]);
});

test('a respelled word is paired with its boundary and the rest stays in sync', () => {
  const t = alignSpokenTokens(['el', 'síem', 'agrega', 'eventos'], bounds('el', 'siém', 'agrega', 'eventos'));
  assert.deepEqual(t.map((x) => x.startMs), [100, 200, 300, 400]);
  const u = alignSpokenTokens(['el', 'sóar', 'actúa', 'rápido'], bounds('el', 'soar', 'actua', 'rapido'));
  assert.deepEqual(u.map((x) => x.startMs), [100, 200, 300, 400]);
  const v = alignSpokenTokens(['el', 'sistema', 'actúa', 'rápido'], bounds('el', 'sistemas', 'actúa', 'rápido'));
  assert.deepEqual(v.map((x) => x.startMs), [100, 200, 300, 400]);
});

test('short function words do not cause a false re-sync', () => {
  // "de" appears later; the aligner must not jump to it.
  const t = alignSpokenTokens(['cuenta', 'svc_tosreport', 'de', 'servicio'], bounds('cuenta', 'svc', 'tos', 'report', 'de', 'servicio'));
  assert.deepEqual(t.map((x) => x.startMs), [100, 200, 500, 600]);
  assert.equal(t[1].endMs, 480);
});

test('punctuation-only tokens get zero length at the previous end', () => {
  const t = alignSpokenTokens(['—', 'Sí', '—', 'dijo.'], bounds('Sí', 'dijo'));
  assert.deepEqual(t.map((x) => [x.startMs, x.endMs]), [[100, 100], [100, 180], [180, 180], [200, 280]]);
});

test('no boundaries at all: everything interpolated and monotonic', () => {
  const t = alignSpokenTokens(['uno', 'dos', 'tres'], [], { totalMs: 900 });
  assertMonotonic(t);
  assert.ok(t[2].endMs <= 900);
  assert.ok(t.every((x) => !x.matched));
});

test('trailing tokens without boundaries are bounded by totalMs', () => {
  const t = alignSpokenTokens(['uno', 'dos', 'tres'], bounds('uno'), { totalMs: 400 });
  assertMonotonic(t);
  assert.ok(t[2].endMs <= 400 + 1e-9);
  assert.ok(t[1].startMs >= 180);
});

test('displayTimes: groups span their spoken range, shared ranges split, empty ranges are zero-length', () => {
  const p = parseSegmentText('Hubo {x}[38 GB|treinta y ocho gigabytes] y [A B C|uno].', {});
  const spokenTimes = alignSpokenTokens(p.spokenTokens, bounds('Hubo', 'treinta', 'y', 'ocho', 'gigabytes', 'y', 'uno'));
  const d = displayTimes(p.displayTokens, spokenTimes);
  assert.equal(d.length, 7);
  assert.deepEqual([d[1].startMs, d[1].endMs], [200, 380]); // 38 -> treinta y
  assert.deepEqual([d[2].startMs, d[2].endMs], [400, 580]); // GB -> ocho gigabytes
  assert.deepEqual([d[3].startMs, d[3].endMs], [600, 680]);
  // A, B, C. share "uno." (700-780) and split it.
  assert.equal(d[4].startMs, 700);
  assert.ok(d[5].startMs > d[4].startMs && d[6].startMs > d[5].startMs);
  assert.equal(d[6].endMs, 780);
  assertMonotonic(d);

  const empty = displayTimes(
    [
      { text: 'a', spokenStart: 0, spokenEnd: 1 },
      { text: 'b', spokenStart: 1, spokenEnd: 1 },
      { text: 'c', spokenStart: 1, spokenEnd: 2 },
    ],
    [
      { startMs: 0, endMs: 100 },
      { startMs: 150, endMs: 250 },
    ],
  );
  assert.deepEqual(empty, [
    { startMs: 0, endMs: 100 },
    { startMs: 100, endMs: 100 },
    { startMs: 150, endMs: 250 },
  ]);
});

test('real edge-tts boundaries (recorded fixture) align completely', () => {
  const fx = JSON.parse(readFileSync(new URL('./fixtures/edge-boundaries.json', import.meta.url), 'utf8'));
  for (const seg of fx.segments) {
    const p = parseSegmentText(seg.text, fx.lexicon);
    assert.equal(p.spoken, seg.spoken, `${seg.id}: fixture spoken text is current`);
    const times = alignSpokenTokens(p.spokenTokens, seg.words, { totalMs: seg.durationMs });
    assertMonotonic(times);
    const unmatched = times.filter((x, k) => !x.matched && normalizeToken(p.spokenTokens[k])).length;
    assert.equal(unmatched, 0, `${seg.id}: every spoken word matched a boundary`);
    const d = displayTimes(p.displayTokens, times);
    assertMonotonic(d);
    assert.ok(d.at(-1).endMs <= seg.durationMs, `${seg.id}: last word ends inside the audio`);
  }
});
