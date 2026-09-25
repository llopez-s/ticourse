import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clipOnset, parseSilenceEnds, syncReport } from '../render.mjs';

const FPS = 30;
/** Three segments starting at 2 s, 8 s and 14 s; first word 3 frames in. */
const timeline = {
  fps: FPS,
  segments: [60, 240, 420].map((from, k) => ({ id: `s01-0${k + 1}`, from, words: [{ text: 'x', from: from + 3, to: from + 10 }] })),
};
/** Each clip becomes audible 180 ms in. */
const onsets = new Map(timeline.segments.map((s) => [s.id, 0.18]));
const expected = timeline.segments.map((s) => s.from / FPS + 0.18);

test('parseSilenceEnds and clipOnset read ffmpeg silencedetect output', () => {
  const stderr = [
    '[silencedetect @ 0000020] silence_start: 0',
    '[silencedetect @ 0000020] silence_end: 0.188667 | silence_duration: 0.188667',
    '[silencedetect @ 0000020] silence_start: 4.577333',
    '[silencedetect @ 0000020] silence_end: 4.961333 | silence_duration: 0.384',
  ].join('\n');
  assert.deepEqual(parseSilenceEnds(stderr), [0.188667, 4.961333]);
  assert.equal(clipOnset(stderr), 0.188667);
  assert.equal(clipOnset('[silencedetect] silence_start: 3.2\n[silencedetect] silence_end: 3.6'), 0, 'no leading silence');
  assert.equal(clipOnset(''), 0);
});

test('in sync: no failure, no mismatches', () => {
  const rep = syncReport(timeline, [0.5, ...expected.map((t) => t + 0.01), 30], onsets);
  assert.equal(rep.conclusive, true);
  assert.equal(rep.fail, false);
  assert.equal(rep.mismatches.length, 0);
  assert.ok(Math.abs(rep.median) < 1);
});

test('a systematic offset of 3 frames fails', () => {
  const rep = syncReport(timeline, expected.map((t) => t + 3 / FPS), onsets);
  assert.equal(rep.fail, true);
  assert.ok(Math.abs(rep.median - 3) < 0.01);
});

test('one stray mismatch only warns', () => {
  const rep = syncReport(timeline, [expected[0], expected[1] + 5 / FPS, expected[2]], onsets);
  assert.equal(rep.fail, false);
  assert.deepEqual(rep.mismatches.map((r) => r.id), ['s01-02']);
});

test('too few silence ends near the onsets is inconclusive, never a failure', () => {
  const rep = syncReport(timeline, [expected[0] + 4 / FPS, 100], onsets);
  assert.equal(rep.conclusive, false);
  assert.equal(rep.fail, false);
});

test('without measured clip onsets the first word frame is the reference', () => {
  const rep = syncReport(timeline, timeline.segments.map((s) => s.words[0].from / FPS));
  assert.equal(rep.fail, false);
  assert.equal(rep.mismatches.length, 0);
});
