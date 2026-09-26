import assert from 'node:assert/strict';
import test from 'node:test';
import { CHATTERBOX_DEFAULT_VOICE, SARAH_VOICE, chooseVoice, elevenLabsChars } from '../voice-plan.mjs';

const sub = (count, limit = 10000) => ({ character_count: count, character_limit: limit, next_character_count_reset_unix: 1792886400 });

test('ElevenLabs when the quota covers the script plus 15 % for retakes', () => {
  assert.equal(chooseVoice(6500, sub(2000)).voice, SARAH_VOICE); // 8000 left >= 7475
  assert.equal(chooseVoice(6500, sub(3000)).voice, CHATTERBOX_DEFAULT_VOICE); // 7000 left < 7475
  assert.match(chooseVoice(6500, sub(3000)).reason, /7000 characters left, the script needs 7475; the quota resets on 2026-10-25/);
});

test('Chatterbox when there is no subscription data', () => {
  assert.equal(chooseVoice(100, null).voice, CHATTERBOX_DEFAULT_VOICE);
});

test('elevenLabsChars: one request per scene, segments joined by a newline', () => {
  const scene = (...texts) => ({ segments: texts.map((t) => ({ parsed: { directedSpoken: t } })) });
  assert.equal(elevenLabsChars([scene('abc', 'de'), scene('fgh')]), 'abc\nde'.length + 'fgh'.length);
});
