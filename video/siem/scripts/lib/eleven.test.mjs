import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseEnv } from './env.mjs';
import { leadForSegment, pcmRange, planSceneCuts, wordsFromAlignment } from './eleven-align.mjs';
import { isElevenLabsVoice, spokenForVoice } from './narration.mjs';
import { MarkupError, parseSegmentText } from './text.mjs';

/** Builds an ElevenLabs-style alignment for `text`, one character every `step` s. */
function fakeAlignment(text, step = 0.05, gaps = {}) {
  const characters = [...text];
  const starts = [];
  const ends = [];
  let t = 0;
  characters.forEach((ch, i) => {
    t += gaps[i] ?? 0;
    starts.push(t);
    t += ch === ' ' ? step / 2 : step;
    ends.push(t);
  });
  return { characters, character_start_times_seconds: starts, character_end_times_seconds: ends };
}

test('<direction> markup: voice-only, never shown, never timed', () => {
  const p = parseSegmentText('<curious>Madrugada en {flood}Halden: <sighs> [6.000|seis mil] alertas.', { Halden: 'jálden' });
  assert.equal(p.display, 'Madrugada en Halden: 6.000 alertas.');
  assert.equal(p.spoken, 'Madrugada en jálden: seis mil alertas.');
  assert.equal(p.directedSpoken, '[curious] Madrugada en jálden: [sighs] seis mil alertas.');
  assert.deepEqual(p.directions, ['curious', 'sighs']);
  assert.deepEqual(p.spokenTokens, ['Madrugada', 'en', 'jálden:', 'seis', 'mil', 'alertas.']);
  assert.deepEqual(p.cues, [{ id: 'flood', displayIndex: 2 }]);
  // A trailing direction still reaches the voice.
  assert.equal(parseSegmentText('Fin. <warmly>').directedSpoken, 'Fin. [warmly]');
  // Without directions both spoken forms are identical (edge-tts path unchanged).
  const plain = parseSegmentText('Sin etiquetas.');
  assert.equal(plain.directedSpoken, plain.spoken);
});

test('<direction> markup errors', () => {
  assert.throws(() => parseSegmentText('Hola <curious'), MarkupError);
  assert.throws(() => parseSegmentText('Hola curious>'), MarkupError);
  assert.throws(() => parseSegmentText('Hola <12>'), MarkupError);
});

test('provider helpers', () => {
  assert.equal(isElevenLabsVoice('elevenlabs/eleven_v3/jipeLrCHZ6ByxrU2JP9i'), true);
  assert.equal(isElevenLabsVoice('es-ES-ElviraNeural'), false);
  const parsed = parseSegmentText('<serious>Hola.');
  assert.equal(spokenForVoice('elevenlabs/eleven_v3/jipeLrCHZ6ByxrU2JP9i', parsed), '[serious] Hola.');
  assert.equal(spokenForVoice('es-ES-ElviraNeural', parsed), 'Hola.');
});

test('wordsFromAlignment drops audio tags and splits on whitespace', () => {
  const words = wordsFromAlignment(fakeAlignment('[curious] ¿Y si [speaking softly] fuera legítima?'));
  assert.deepEqual(words.map((w) => w.text), ['¿Y', 'si', 'fuera', 'legítima?']);
  assert.ok(words.every((w) => w.endMs > w.startMs));
  assert.ok(words[1].startMs > words[0].endMs);
});

test('planSceneCuts: word-count split, clips cut in the silence between segments', () => {
  const text = '[serious] Uno dos tres. Cuatro cinco.';
  // 600 ms of silence before "Cuatro" (index of "C").
  const align = fakeAlignment(text, 0.05, { [text.indexOf('Cuatro')]: 0.6 });
  const words = wordsFromAlignment(align);
  const totalMs = align.character_end_times_seconds.at(-1) * 1000 + 800;
  const { segments, mismatches } = planSceneCuts({
    segments: [
      { id: 's01-01', tokens: ['Uno', 'dos', 'tres.'] },
      { id: 's01-02', tokens: ['Cuatro', 'cinco.'] },
    ],
    words,
    totalMs,
  });
  assert.deepEqual(mismatches, []);
  const [a, b] = segments;
  assert.equal(a.words.length, 3);
  assert.equal(b.words.length, 2);
  // Clip A ends half-way into the 600 ms gap (capped at 300 ms); B starts there or 60 ms before its word.
  const aLastEnd = a.clipStartMs + a.words.at(-1).offsetMs + a.words.at(-1).durationMs;
  assert.ok(a.clipEndMs - aLastEnd <= 300 + 1e-6);
  assert.ok(b.clipStartMs >= a.clipEndMs);
  assert.ok(Math.abs(b.words[0].offsetMs - 60) < 1e-6);
  // Last clip keeps at most 300 ms of trailing silence.
  const bLastEnd = b.clipStartMs + b.words.at(-1).offsetMs + b.words.at(-1).durationMs;
  assert.ok(b.clipEndMs - bLastEnd <= 300 + 1e-6);
});

test('planSceneCuts reports text drift and refuses a word-count mismatch', () => {
  const words = wordsFromAlignment(fakeAlignment('Uno dos tres.'));
  const { mismatches } = planSceneCuts({ segments: [{ id: 's01-01', tokens: ['Uno', 'dos', 'cuatro.'] }], words, totalMs: 2000 });
  assert.equal(mismatches.length, 1);
  assert.throws(() => planSceneCuts({ segments: [{ id: 's01-01', tokens: ['Uno'] }], words, totalMs: 2000 }), /3 words/);
});

test('pcmRange returns even byte offsets for 16-bit mono PCM', () => {
  assert.deepEqual(pcmRange(0, 1000, 24000), [0, 48000]);
  assert.deepEqual(pcmRange(500, 250, 24000), [24000, 24000]);
});

test('parseEnv reads KEY=value lines, quotes and export prefixes', () => {
  const env = parseEnv('# comment\nA=1\r\nexport B = "dos"\nC=\'tres\'\nnot a line\n');
  assert.deepEqual(env, { A: '1', B: 'dos', C: 'tres' });
});

test('an audible opening tag (sighs) takes the silence before its segment', () => {
  assert.equal(leadForSegment('[sighs] Es alert fatigue.'), 900);
  assert.equal(leadForSegment('[tired] En Halden.'), 60);
  const text = 'Uno dos. [sighs] Tres cuatro.';
  const align = fakeAlignment(text, 0.05, { [text.indexOf('Tres')]: 1.2 });
  const words = wordsFromAlignment(align);
  const totalMs = align.character_end_times_seconds.at(-1) * 1000 + 500;
  const { segments } = planSceneCuts({
    segments: [
      { id: 's06-01', tokens: ['Uno', 'dos.'] },
      { id: 's06-02', tokens: ['Tres', 'cuatro.'], leadMs: 900 },
    ],
    words,
    totalMs,
  });
  const [a, b] = segments;
  const aLastEnd = a.clipStartMs + a.words.at(-1).offsetMs + a.words.at(-1).durationMs;
  // The previous clip stops early, and the sigh segment keeps ~900 ms before its first word.
  assert.ok(a.clipEndMs - aLastEnd <= 300 + 1e-6);
  assert.ok(Math.abs(b.words[0].offsetMs - 900) < 1e-6, `lead ${b.words[0].offsetMs}`);
  assert.ok(b.clipStartMs >= a.clipEndMs);
});
