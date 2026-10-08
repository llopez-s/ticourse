import assert from 'node:assert/strict';
import test from 'node:test';
import { adversaryClipId, adversaryClipIsCurrent, adversaryConfig, adversaryKey, adversaryRecord, adversaryVoiceErrors, hashKeys, sapiArgs } from './adversary.mjs';
import { analyzeNarration } from './narration.mjs';

const cfg = { voice: 'sapi/Microsoft Pablo', rate: 0, fx: 'machine' };

test('adversaryVoiceErrors: a SAPI voice, a rate from -10 to 10 and a known preset', () => {
  assert.deepEqual(adversaryVoiceErrors(cfg), []);
  assert.deepEqual(adversaryVoiceErrors({ voice: 'sapi/Microsoft Pablo' }), []);
  assert.deepEqual(adversaryVoiceErrors({ voice: 'sapi/Microsoft Laura', fx: 'telefono' }), []);
  assert.deepEqual(adversaryVoiceErrors({ voice: 'sapi/Microsoft Helena', fx: 'cifrado' }), []);
  assert.deepEqual(adversaryVoiceErrors({ voice: 'sapi/Microsoft Helena', rate: -2, fx: 'megafonia' }), []);
  assert.equal(adversaryVoiceErrors({ voice: 'Microsoft Pablo' }).length, 1);
  assert.equal(adversaryVoiceErrors({ ...cfg, rate: 11 }).length, 1);
  assert.equal(adversaryVoiceErrors({ ...cfg, rate: 1.5 }).length, 1);
  assert.equal(adversaryVoiceErrors({ ...cfg, fx: 'radio' }).length, 1);
  assert.equal(adversaryVoiceErrors('sapi/Microsoft Pablo').length, 1);
});

test('adversaryConfig fills the defaults; the key changes with voice, rate, preset and text', () => {
  assert.deepEqual(adversaryConfig({ voice: 'sapi/Microsoft Pablo' }), cfg);
  const k = adversaryKey(cfg, 'Hola.');
  assert.match(k, /^[0-9a-f]{64}$/);
  assert.equal(adversaryKey(cfg, 'Hola.'), k);
  for (const other of [adversaryKey({ ...cfg, rate: 1 }, 'Hola.'), adversaryKey(cfg, 'Hola!'), adversaryKey({ ...cfg, voice: 'sapi/Microsoft Helena' }, 'Hola.'), adversaryKey({ ...cfg, fx: 'telefono' }, 'Hola.')]) {
    assert.notEqual(other, k);
  }
  assert.equal(adversaryClipId('s03-04'), 's03-04-intercept');
});

test('sapiArgs runs the script with the voice name (without "sapi/") and the text in a file', () => {
  assert.deepEqual(sapiArgs({ script: 's.ps1', voiceName: 'Microsoft Pablo', rate: -1, textFile: 't.txt', out: 'o.wav' }), [
    '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 's.ps1', '-Voice', 'Microsoft Pablo', '-Rate', '-1', '-TextFile', 't.txt', '-Out', 'o.wav',
  ]);
});

test('adversaryRecord is keyed like the clip it describes', () => {
  const r = adversaryRecord({ config: cfg, text: 'Hola.', bytes: 1000, durationMs: 4200, gainDb: -2.5, targetLufs: -25, bitrateKbps: 96 });
  assert.deepEqual(r, {
    provider: 'sapi', key: adversaryKey(cfg, 'Hola.'), ...cfg, text: 'Hola.', bytes: 1000, bitrateKbps: 96, durationMs: 4200, gainDb: -2.5, targetLufs: -25,
  });
});

test('adversaryClipIsCurrent: key, bytes and a targetLufs within 1 dB of the narration', () => {
  const rec = { key: 'k', bytes: 100, targetLufs: -25 };
  assert.equal(adversaryClipIsCurrent(rec, { key: 'k', bytes: 100, targetLufs: -25 }), true);
  assert.equal(adversaryClipIsCurrent(rec, { key: 'k', bytes: 100, targetLufs: -26 }), true, 'exactly 1 dB off is still ok');
  assert.equal(adversaryClipIsCurrent(rec, { key: 'k', bytes: 100, targetLufs: -26.1 }), false, 'more than 1 dB off');
  assert.equal(adversaryClipIsCurrent(rec, { key: 'other', bytes: 100, targetLufs: -25 }), false, 'key mismatch');
  assert.equal(adversaryClipIsCurrent(rec, { key: 'k', bytes: 99, targetLufs: -25 }), false, 'bytes mismatch');
  assert.equal(adversaryClipIsCurrent({ key: 'k', bytes: 100 }, { key: 'k', bytes: 100, targetLufs: -25 }), false, 'missing targetLufs counts as stale');
});

test('hashKeys: every segment, then one adversary clip per intercepted message (only with a voice)', () => {
  const segments = [{ id: 'a', intercept: null }, { id: 'b', intercept: { text: 'x' } }];
  const narrationKey = (s) => `n-${s.id}`;
  const adversaryKeyOf = (s) => `v-${s.id}`;
  assert.deepEqual(hashKeys({ segments, adversaryVoice: null, narrationKey, adversaryKeyOf }), [['a', 'n-a'], ['b', 'n-b']]);
  assert.deepEqual(hashKeys({ segments, adversaryVoice: cfg, narrationKey, adversaryKeyOf }), [['a', 'n-a'], ['b', 'n-b'], ['b-intercept', 'v-b']]);
});

test('analyzeNarration validates adversaryVoice and the shape of sfx', () => {
  const storyboard = { scenes: [{ id: 's01', title: 'Uno', layout: 'map', chapter: 1 }] };
  const run = (extra) => analyzeNarration({ storyboard, narration: { voice: 'recording/lidia', segments: [{ id: 's01-01', scene: 's01', text: 'Hola.' }], ...extra }, lexicon: {} }).errors;
  const about = (errs, re) => errs.filter((e) => re.test(e));
  assert.deepEqual(about(run({ adversaryVoice: cfg, sfx: {} }), /adversaryVoice|sfx/), []);
  assert.equal(about(run({ adversaryVoice: { voice: 'Pablo' } }), /adversaryVoice/).length, 1);
  assert.equal(about(run({ sfx: ['mail'] }), /sfx/).length, 1);
});
