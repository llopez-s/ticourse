#!/usr/bin/env node
// Which voice a new video should use (spec 2026-09-26 §5.1): ElevenLabs (Sarah, the SIEM voice)
// when this month's quota covers the script plus 15 % for retakes, otherwise Chatterbox. It only
// prints the decision; set narration.json "voice" by hand.
//
//   node video/engine/scripts/voice-plan.mjs --video <slug>
import { parseArgs } from 'node:util';
import { getSubscription } from './lib/elevenlabs.mjs';
import { analyzeNarration, loadSources, reportOrThrow } from './lib/narration.mjs';
import { MANIFEST, PATHS, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';

export const SARAH_VOICE = 'elevenlabs/eleven_v3/EXAVITQu4vr4xnSDxMaL';
export const CHATTERBOX_DEFAULT_VOICE = 'chatterbox/es-es/default';
export const RETAKE_MARGIN = 1.15;

/** Characters ElevenLabs bills for the script: one request per scene, its directed segments joined by "\n". */
export function elevenLabsChars(scenes) {
  return scenes.reduce((sum, { segments }) => sum + segments.map((s) => s.parsed.directedSpoken).join('\n').length, 0);
}

/** @returns {{ voice: string, reason: string }} */
export function chooseVoice(chars, subscription) {
  if (!subscription) return { voice: CHATTERBOX_DEFAULT_VOICE, reason: 'no ElevenLabs subscription data (no key, or a key without user_read)' };
  const left = subscription.character_limit - subscription.character_count;
  const needed = Math.ceil(chars * RETAKE_MARGIN);
  const resets = subscription.next_character_count_reset_unix
    ? new Date(subscription.next_character_count_reset_unix * 1000).toISOString().slice(0, 10)
    : 'an unknown date';
  return left >= needed
    ? { voice: SARAH_VOICE, reason: `${left} characters left, the script needs ${needed} (with retakes)` }
    : { voice: CHATTERBOX_DEFAULT_VOICE, reason: `${left} characters left, the script needs ${needed}; the quota resets on ${resets}` };
}

async function main() {
  parseArgs({ options: { video: { type: 'string' } } });
  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const analysis = analyzeNarration(sources, profileFor(MANIFEST.profile));
  reportOrThrow(analysis);
  const chars = elevenLabsChars(analysis.scenes);
  let subscription = null;
  try {
    subscription = await getSubscription();
  } catch (error) {
    console.warn(`  aviso: cannot read the ElevenLabs quota: ${error.message}`);
  }
  const { voice, reason } = chooseVoice(chars, subscription);
  console.log(`${MANIFEST.slug}: ${chars} characters for ElevenLabs\n  "voice": "${voice}"\n  ${reason}`);
}

if (isMainModule(import.meta.url)) {
  main().catch((err) => {
    console.error(`voice-plan: ${err.message}`);
    process.exit(1);
  });
}
