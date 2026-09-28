// The section adversary's voice (narration.json "adversaryVoice"): a Windows SAPI voice treated with an
// effect preset, one clip per intercepted message (tts-adversary.mjs writes them). Pure helpers.
import { createHash } from 'node:crypto';

export const ADVERSARY_FX = Object.freeze(['machine']);
export const SAPI_VOICE = /^sapi\/[A-Za-z][A-Za-z0-9 ]*$/;
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function adversaryVoiceErrors(cfg) {
  if (!isObj(cfg)) return ['narration.adversaryVoice must be an object like {"voice": "sapi/Microsoft Pablo", "fx": "machine"}'];
  const errors = [];
  if (typeof cfg.voice !== 'string' || !SAPI_VOICE.test(cfg.voice)) errors.push(`narration.adversaryVoice.voice ${JSON.stringify(cfg.voice)} must be "sapi/<Windows voice name>"`);
  if (cfg.rate !== undefined && !(Number.isInteger(cfg.rate) && cfg.rate >= -10 && cfg.rate <= 10)) errors.push('narration.adversaryVoice.rate must be an integer from -10 to 10');
  if (cfg.fx !== undefined && !ADVERSARY_FX.includes(cfg.fx)) errors.push(`narration.adversaryVoice.fx must be one of: ${ADVERSARY_FX.join(', ')}`);
  return errors;
}

export function adversaryConfig(cfg) {
  return { voice: cfg.voice, rate: cfg.rate ?? 0, fx: cfg.fx ?? 'machine' };
}

export function adversaryKey(config, text) {
  return createHash('sha256').update(`${config.voice}\n${config.rate}\n${config.fx}\n${text}`, 'utf8').digest('hex');
}

export const adversaryClipId = (segId) => `${segId}-intercept`;

/** PowerShell (pwsh or powershell.exe) arguments for scripts/sapi_tts.ps1. */
export function sapiArgs({ script, voiceName, rate, textFile, out }) {
  return ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script, '-Voice', voiceName, '-Rate', String(rate), '-TextFile', textFile, '-Out', out];
}

/** tts/<segment>-intercept.json. `targetLufs` is the narration loudness the clip was levelled to
 * (adversaryClipIsCurrent uses it to spot a narration voice change). `bitrateKbps` is the clip's
 * encoded bitrate (recording.mjs CLIP_BITRATE_KBPS): passed in rather than imported, so this pure-helpers
 * module does not depend on recording.mjs. */
export function adversaryRecord({ config, text, bytes, durationMs, gainDb, targetLufs, bitrateKbps }) {
  return { provider: 'sapi', key: adversaryKey(config, text), ...config, text, bytes, bitrateKbps, durationMs, gainDb, targetLufs };
}

/**
 * Whether a cached adversary clip (its tts/<segment>-intercept.json record) is still good: its key and byte
 * size match what would be generated now, and it carries a targetLufs within 1 dB of the narration's current
 * loudness. A record with no targetLufs (written before this check existed) always counts as stale, so an
 * older clip is re-levelled the first time it is touched after an upgrade.
 */
export function adversaryClipIsCurrent(rec, { key, bytes, targetLufs }) {
  return rec.key === key && rec.bytes === bytes && typeof rec.targetLufs === 'number' && Math.abs(targetLufs - rec.targetLufs) <= 1;
}

/**
 * The [id, key] pairs timeline.sourceHash covers, in one fixed order for build-timeline (which computes the
 * keys) and freshness.mjs (which reads them from the records): every segment, then each adversary clip.
 */
export function hashKeys({ segments, adversaryVoice, narrationKey, adversaryKeyOf }) {
  const keys = segments.map((seg) => [seg.id, narrationKey(seg)]);
  if (adversaryVoice) for (const seg of segments.filter((s) => s.intercept)) keys.push([adversaryClipId(seg.id), adversaryKeyOf(seg)]);
  return keys;
}
