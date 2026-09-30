#!/usr/bin/env node
// Voices the section adversary's intercepted messages (narration.json "adversaryVoice"):
//
//   node video/engine/scripts/tts-adversary.mjs --video <slug> [--force]
//
// For every segment with "intercept": Windows SAPI (sapi_tts.ps1) speaks intercept.text into a WAV,
// adversary_fx.py applies the preset, and ffmpeg brings it to the narration's loudness and encodes it like the
// narration clips -> public/voice/<segment>-intercept.mp3 + tts/<segment>-intercept.json. A clip is cached
// when its record's key, byte size and loudness target (within 1 dB of the narration's current loudness)
// still match (--force redoes it regardless, and a record with no target always counts as stale). The
// narration's loudness is measured at most once per run, lazily, the first time some clip's cache needs the
// check — every run that has at least one intercept measures it once, even when every clip ends up cached.
// The pwsh probe and SAPI itself are skipped entirely on a fully cached run, so that run works on any OS;
// synthesising a clip needs Windows.
//
// SAPI runs through PowerShell 7 (pwsh) when it is available: Windows PowerShell 5.1's
// System.Speech.Synthesis only enumerates the classic (non-OneCore) voices, so a modern voice
// installed only as a OneCore voice pack (e.g. "Microsoft Pablo") is invisible to it, even though
// it is installed. pwsh's System.Speech sees the OneCore voices too. Falls back to powershell.exe
// only when pwsh itself cannot be launched (not installed / not on PATH).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { adversaryClipId, adversaryClipIsCurrent, adversaryConfig, adversaryKey, adversaryRecord, sapiArgs } from './lib/adversary.mjs';
import { analyzeNarration, loadSources, reportOrThrow } from './lib/narration.mjs';
import { ENGINE_DIR, MANIFEST, PATHS, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';
import { CLIP_BITRATE_KBPS, CLIP_SAMPLE_RATE, gainDb, parseLoudness } from './lib/recording.mjs';
import { runFfmpeg, writeFileAtomic } from './lib/remotion.mjs';
import { VENV_PYTHON } from './tts-chatterbox.mjs';

const NARRATION_LUFS_FALLBACK = -18;

/** stderr of one ffmpeg loudnorm analysis pass over `file`, checked for failure (mirrors analyse() in
 * import-recording.mjs), parsed into {integrated, truePeak}. */
function measureLoudness(file) {
  const res = runFfmpeg(['-hide_banner', '-nostats', '-i', file, '-af', 'loudnorm=print_format=json', '-f', 'null', '-']);
  if (res.status !== 0) throw new Error(`ffmpeg loudnorm failed for ${file}: ${res.stderr.trim()}`);
  return parseLoudness(res.stderr);
}

/** Mean integrated loudness of up to 5 narration clips in voiceDir (not adversary clips). */
function narrationLoudness(voiceDir) {
  const clips = existsSync(voiceDir) ? readdirSync(voiceDir).filter((f) => f.endsWith('.mp3') && !f.endsWith('-intercept.mp3')).sort().slice(0, 5) : [];
  if (!clips.length) return NARRATION_LUFS_FALLBACK;
  const values = clips.map((f) => measureLoudness(path.join(voiceDir, f)).integrated);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** "pwsh" (sees OneCore voices), unless it can't be launched — then "powershell.exe". Picked once per run. */
function powershellExe() {
  const probe = spawnSync('pwsh', ['-NoProfile', '-Command', 'exit'], { windowsHide: true });
  return probe.error?.code === 'ENOENT' ? 'powershell.exe' : 'pwsh';
}

function durationMs(file) {
  const res = runFfmpeg(['-hide_banner', '-i', file, '-f', 'null', '-']);
  const m = /time=(\d+):(\d+):([\d.]+)/g;
  let last = null;
  for (const x of res.stderr.matchAll(m)) last = x;
  if (!last) throw new Error(`cannot read the duration of ${file}`);
  return Math.round((Number(last[1]) * 3600 + Number(last[2]) * 60 + Number(last[3])) * 1000);
}

export function voiceAdversary({ force = false, log = console } = {}) {
  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const analysis = analyzeNarration(sources, { ...profileFor(MANIFEST.profile), track: MANIFEST.track });
  reportOrThrow(analysis, log);
  if (!sources.narration.adversaryVoice) {
    log.log('tts-adversary: narration.json has no "adversaryVoice" — nothing to do');
    return;
  }
  const config = adversaryConfig(sources.narration.adversaryVoice);
  const todo = analysis.segments.filter((s) => s.intercept);
  if (!todo.length) log.warn('  aviso: adversaryVoice is set but no segment has an intercept');

  // target() is memoized (at most one narrationLoudness() call per run): the cache check below needs it for
  // every candidate clip, cached or not, to compare against the record's targetLufs. pwsh() is only reached
  // (and only probed once) when a clip actually needs synthesising, so a fully cached run never touches
  // pwsh or SAPI and works on any OS.
  let targetCache = null;
  const target = () => (targetCache ??= narrationLoudness(PATHS.voiceDir));
  let pwshCache = null;
  const pwsh = () => (pwshCache ??= powershellExe());

  // A video can voice its adversary before its narration exists (e.g. before the narrator records), so the
  // clip folders may not be there yet.
  if (todo.length) {
    mkdirSync(PATHS.voiceDir, { recursive: true });
    mkdirSync(PATHS.ttsDir, { recursive: true });
  }
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'adversary-'));
  try {
    for (const seg of todo) {
      const id = adversaryClipId(seg.id);
      const mp3 = path.join(PATHS.voiceDir, `${id}.mp3`);
      const json = path.join(PATHS.ttsDir, `${id}.json`);
      const key = adversaryKey(config, seg.intercept.text);
      if (!force && existsSync(json) && existsSync(mp3)) {
        const rec = JSON.parse(readFileSync(json, 'utf8'));
        const bytes = statSync(mp3).size;
        if (adversaryClipIsCurrent(rec, { key, bytes, targetLufs: target() })) {
          log.log(`  ${id}: cached`);
          continue;
        }
      }
      if (process.platform !== 'win32') throw new Error('SAPI voices need Windows');
      const textFile = path.join(tmp, `${id}.txt`);
      writeFileSync(textFile, seg.intercept.text, 'utf8');
      const raw = path.join(tmp, `${id}.raw.wav`);
      const sapi = spawnSync(pwsh(), sapiArgs({ script: path.join(SCRIPTS_DIR, 'sapi_tts.ps1'), voiceName: config.voice.slice('sapi/'.length), rate: config.rate, textFile, out: raw }), { encoding: 'utf8', windowsHide: true });
      if (sapi.error) throw new Error(`cannot run ${pwsh()} for ${id}: ${sapi.error.message}`);
      if (sapi.status !== 0) throw new Error(`SAPI failed for ${id}: ${(sapi.stderr || sapi.stdout || '').trim()}`);
      const fx = path.join(tmp, `${id}.fx.wav`);
      const py = spawnSync(VENV_PYTHON, ['-X', 'utf8', path.join(SCRIPTS_DIR, 'adversary_fx.py'), '--in', raw, '--out', fx, '--preset', config.fx], { cwd: REPO_ROOT, encoding: 'utf8', windowsHide: true, env: { ...process.env, HF_HOME: process.env.HF_HOME ?? path.join(ENGINE_DIR, '.cache', 'huggingface') } });
      if (py.error) throw new Error(`cannot run adversary_fx.py for ${id}: ${py.error.message}`);
      if (py.status !== 0) throw new Error(`adversary_fx.py failed for ${id}: ${(py.stderr || '').trim()}`);
      const targetLufs = target();
      const gain = gainDb(measureLoudness(fx), targetLufs);
      const enc = runFfmpeg(['-v', 'error', '-y', '-i', fx, '-af', `volume=${gain}dB`, '-ac', '1', '-ar', String(CLIP_SAMPLE_RATE), '-c:a', 'libmp3lame', '-b:a', `${CLIP_BITRATE_KBPS}k`, '-write_xing', '0', '-id3v2_version', '0', mp3]);
      if (enc.status !== 0) throw new Error(`ffmpeg failed for ${id}: ${enc.stderr.trim()}`);
      const record = adversaryRecord({ config, text: seg.intercept.text, bytes: statSync(mp3).size, durationMs: durationMs(mp3), gainDb: gain, targetLufs, bitrateKbps: CLIP_BITRATE_KBPS });
      writeFileAtomic(json, `${JSON.stringify(record, null, 1)}\n`);
      log.log(`  ${id}: ${(record.durationMs / 1000).toFixed(1)} s (gain ${gain} dB, target ${targetLufs.toFixed(1)} LUFS)`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (isMainModule(import.meta.url)) {
  try {
    const { values } = parseArgs({ options: { video: { type: 'string' }, force: { type: 'boolean', default: false } } });
    voiceAdversary({ force: values.force });
  } catch (error) {
    console.error(`tts-adversary: ${error.message}`);
    process.exit(1);
  }
}
