import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SETTINGS, edgeLexiconWarning, segmentVoiceSettings, settingsKey } from '../tts-chatterbox.mjs';
import { REGISTERS, moodFor } from './moods.mjs';

test('moodFor: the first direction decides, and within it the first known word', () => {
  assert.deepEqual(moodFor(['serious, warning', 'enthusiastic']), { register: 'sereno', ...REGISTERS.sereno, unknown: [] });
  assert.equal(moodFor(['mischievously']).register, 'vivo');
  assert.equal(moodFor(['clear, engaging']).register, 'neutro');
  assert.equal(moodFor(['tired']).register, 'sereno');
  assert.equal(moodFor(['warmly']).register, 'calido');
});

test('moodFor: no direction is neutral; an unknown one is neutral and reported', () => {
  assert.deepEqual(moodFor([]), { register: 'neutro', ...REGISTERS.neutro, unknown: [] });
  assert.deepEqual(moodFor(['whispering']), { register: 'neutro', ...REGISTERS.neutro, unknown: ['whispering'] });
});

test('the registers are the ones in the spec', () => {
  assert.deepEqual(REGISTERS, {
    sereno: { exaggeration: 0.4, cfg_weight: 0.5 },
    neutro: { exaggeration: 0.5, cfg_weight: 0.5 },
    calido: { exaggeration: 0.6, cfg_weight: 0.45 },
    vivo: { exaggeration: 0.75, cfg_weight: 0.35 },
  });
});

test('segmentVoiceSettings: moods on by default, off falls back to the video-wide settings', () => {
  assert.equal(DEFAULT_SETTINGS.moods, true);
  assert.equal(segmentVoiceSettings(DEFAULT_SETTINGS, ['urgent']).exaggeration, 0.75);
  const off = segmentVoiceSettings({ ...DEFAULT_SETTINGS, moods: false, exaggeration: 0.55, cfg_weight: 0.4 }, ['urgent']);
  assert.deepEqual(off, { register: null, exaggeration: 0.55, cfg_weight: 0.4, unknown: [] });
});

test('two registers give two cache keys', () => {
  const v = 'chatterbox/es-es/default';
  const key = (m) => settingsKey(v, { ...DEFAULT_SETTINGS, exaggeration: m.exaggeration, cfg_weight: m.cfg_weight });
  assert.notEqual(key(REGISTERS.sereno), key(REGISTERS.vivo));
});

test('edgeLexiconWarning: warns only when the narration resolved to the default edge-tts lexicon', () => {
  assert.match(edgeLexiconWarning('/v/lexicon.json', '/v/lexicon.json'), /lexicon\.chatterbox\.json/);
  assert.equal(edgeLexiconWarning('/v/lexicon.chatterbox.json', '/v/lexicon.json'), null);
});
