/** Same test as scripts/lib/narration.mjs: voice "elevenlabs/<model>/<voice_id>". */
const ELEVEN_VOICE = /^elevenlabs\/[a-z0-9_]+\/[A-Za-z0-9]{10,40}$/;

/** True when the narration is voiced with ElevenLabs (the end card then credits it). */
export function isElevenLabsVoice(voice: string): boolean {
  return ELEVEN_VOICE.test(voice);
}
