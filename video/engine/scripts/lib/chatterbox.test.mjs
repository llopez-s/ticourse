import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { DEFAULT_SETTINGS, VOICES_DIR, finishedJobs, parseVoice, segmentSeed, settingsFor, settingsKey } from '../tts-chatterbox.mjs';
import { analyzeNarration, isChatterboxVoice, isElevenLabsVoice, spokenForVoice } from './narration.mjs';
import { parseSegmentText } from './text.mjs';

test('chatterbox voices: pack es-es|mtl, built-in or reference voice', () => {
  for (const ok of ['chatterbox/es-es/default', 'chatterbox/mtl/default', 'chatterbox/es-es/lidia_ref']) assert.ok(isChatterboxVoice(ok), ok);
  for (const bad of ['chatterbox/es/default', 'chatterbox/es-es/', 'chatterbox/es-es/Mayus', 'es-ES-ElviraNeural', 'elevenlabs/eleven_v3/EXAVITQu4vr4xnSDxMaL']) {
    assert.equal(isChatterboxVoice(bad), false, bad);
  }
  assert.equal(isElevenLabsVoice('chatterbox/es-es/default'), false);
});

test('parseVoice: "default" is the built-in voice, anything else a clip in engine/voices', () => {
  assert.deepEqual(parseVoice('chatterbox/es-es/default'), { pack: 'es-es', voiceName: 'default', voiceRef: null });
  assert.equal(parseVoice('chatterbox/mtl/narradora').voiceRef, path.join(VOICES_DIR, 'narradora.wav'));
});

test('Chatterbox is keyed on the plain spoken text (voice directions are dropped)', () => {
  const parsed = parseSegmentText('<serious> Halden, [04:12|las cuatro y doce] de la madrugada.', {});
  assert.equal(spokenForVoice('chatterbox/es-es/default', parsed), parsed.spoken);
  assert.ok(!/serious/.test(spokenForVoice('chatterbox/es-es/default', parsed)));
});

test('narration validation accepts a Chatterbox voice and a "chatterbox" settings object', () => {
  const storyboard = { chapters: [{ n: 1, title: 'Uno' }], scenes: [{ id: 's01-a', chapter: 1, requiredCues: [] }] };
  const segments = [{ id: 's01-01', scene: 's01-a', text: 'Una frase de prueba con suficientes palabras para el estilo.' }];
  const ok = analyzeNarration({ storyboard, narration: { voice: 'chatterbox/es-es/default', chatterbox: { exaggeration: 0.6 }, segments }, lexicon: {} });
  assert.deepEqual(ok.errors, []);
  const bad = analyzeNarration({ storyboard, narration: { voice: 'chatterbox/es-es/default', chatterbox: 3, segments }, lexicon: {} });
  assert.ok(bad.errors.some((e) => /narration\.chatterbox/.test(e)));
});

test('settingsKey changes with the audio settings and the reference clip, not with the ASR settings', () => {
  const v = 'chatterbox/es-es/default';
  const base = settingsKey(v, DEFAULT_SETTINGS);
  assert.equal(settingsKey(v, { ...DEFAULT_SETTINGS, asr_model: 'medium', min_score: 0.5, attempts: 1 }), base);
  assert.notEqual(settingsKey(v, { ...DEFAULT_SETTINGS, exaggeration: 0.7 }), base);
  assert.notEqual(settingsKey(v, { ...DEFAULT_SETTINGS, seed: 1 }), base);
  assert.notEqual(settingsKey('chatterbox/mtl/default', DEFAULT_SETTINGS), base);
  assert.notEqual(settingsKey(v, DEFAULT_SETTINGS, Buffer.from('a clip')), base);
  assert.deepEqual(settingsFor({ chatterbox: { exaggeration: 0.7 } }), { ...DEFAULT_SETTINGS, exaggeration: 0.7 });
});

test('segmentSeed is stable per segment and differs between segments', () => {
  assert.equal(segmentSeed(20260925, 's01-01'), segmentSeed(20260925, 's01-01'));
  assert.notEqual(segmentSeed(20260925, 's01-01'), segmentSeed(20260925, 's01-02'));
  assert.ok(Number.isInteger(segmentSeed(20260925, 's09-04')) && segmentSeed(20260925, 's09-04') < 2 ** 31);
});

test('finishedJobs: an id is done only when both its .json and .wav exist in workDir', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'chatterbox-finished-'));
  try {
    writeFileSync(path.join(dir, 's01-01.json'), '{}');
    writeFileSync(path.join(dir, 's01-01.wav'), '');
    writeFileSync(path.join(dir, 's01-02.json'), '{}'); // no .wav alongside it: not done
    writeFileSync(path.join(dir, 's01-03.wav'), ''); // no .json alongside it: not done
    const { done, missing } = finishedJobs(['s01-01', 's01-02', 's01-03', 's01-04'], dir);
    assert.deepEqual(done, ['s01-01']);
    assert.deepEqual(missing, ['s01-02', 's01-03', 's01-04']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
