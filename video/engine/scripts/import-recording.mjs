#!/usr/bin/env node
// Turns a narrator's own recording of the whole script into the same per-segment clips the
// TTS providers write (tts/<id>.json + public/voice/<id>.mp3), for voice "recording/<name>":
//
//   node video/engine/scripts/import-recording.mjs --video <slug> --file <wav> --name <name>
//        [--only s02-03,s04-01] [--tts-dir <dir> --voice-dir <dir>] [--match <clip.mp3> | --lufs -18] [--noise -40dB]
//        [--max-pause <ms>] [--force-asr]
//
// 1. Transcribes the recording with word timings (recording_asr.py, faster-whisper in the
//    Chatterbox venv), cached in out/recording/<name>/asr-<file>.json by the file's hash.
// 2. Finds every segment in it, in order; a sentence read more than once keeps its last take,
//    and audio that is not in the script (exam cards, intercepts, false starts) is skipped.
// 3. Cuts each clip at the nearest silence, applies one gain to the whole recording (to --match's
//    loudness, or --lufs) and encodes it like the Chatterbox clips (24 kHz mono, 96 kbps CBR).
//    With --max-pause, every pause inside a sentence longer than that is shortened to it.
// 4. Writes out/recording/<name>/report-<file>.md: each segment's match, and what was left out.
// Set narration.json "voice" to "recording/<name>" before build-timeline. Segments it could not
// find get no clip, so build-timeline names them. To replace some sentences, record just those
// (in script order) and import that file with --only <ids>: the other clips are left as they are.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { analyzeNarration, isRecordingVoice, loadSources, reportOrThrow, spokenForVoice } from './lib/narration.mjs';
import { ENGINE_DIR, MANIFEST, PATHS, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';
import {
  REVIEW_SCORE,
  asrPrompt,
  clipArgs,
  cutPoints,
  gainDb,
  importReport,
  keepRanges,
  locateSegments,
  parseLoudness,
  parseSilences,
  recordingRecord,
  selectSegments,
} from './lib/recording.mjs';
import { runFfmpeg, writeFileAtomic } from './lib/remotion.mjs';
import { VENV_PYTHON } from './tts-chatterbox.mjs';

const ASR_MODEL = 'small';

/** Whisper transcript of `file`, reused while the file, model and prompt are unchanged. */
function transcribe(file, sha256, prompt, workDir, { force, log }) {
  const cache = path.join(workDir, `asr-${fileSlug(file)}.json`);
  if (!force && existsSync(cache)) {
    const cached = JSON.parse(readFileSync(cache, 'utf8'));
    if (cached.sha256 === sha256 && cached.model === ASR_MODEL && cached.prompt === prompt) {
      log.log(`import-recording: transcript cached (${cached.words.length} words)`);
      return cached;
    }
  }
  if (!existsSync(VENV_PYTHON)) throw new Error(`Chatterbox venv not found at ${VENV_PYTHON} — it also runs Whisper; create it as in video/engine/README.md`);
  const raw = path.join(workDir, `asr-${fileSlug(file)}.raw.json`);
  const res = spawnSync(
    VENV_PYTHON,
    ['-X', 'utf8', path.join(SCRIPTS_DIR, 'recording_asr.py'), '--audio', file, '--out', raw, '--model', ASR_MODEL, '--prompt', prompt],
    {
      cwd: REPO_ROOT,
      stdio: 'inherit',
      windowsHide: true,
      env: { ...process.env, HF_HOME: process.env.HF_HOME ?? path.join(ENGINE_DIR, '.cache', 'huggingface'), HF_HUB_DISABLE_SYMLINKS_WARNING: '1' },
    },
  );
  if (res.error) throw new Error(`cannot run recording_asr.py: ${res.error.message}`);
  if (res.status !== 0) throw new Error(`recording_asr.py failed (exit ${res.status})`);
  const asr = { sha256, ...JSON.parse(readFileSync(raw, 'utf8')) };
  writeFileAtomic(cache, `${JSON.stringify(asr, null, 1)}\n`);
  return asr;
}

/** "Narración entera lidia.wav" -> "narracion-entera-lidia": names this recording's cache and report. */
function fileSlug(file) {
  return path.basename(file, path.extname(file)).normalize('NFD').replace(/\p{M}+/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** stderr of one ffmpeg analysis pass over `file` (output discarded). */
function analyse(file, filter) {
  const res = runFfmpeg(['-hide_banner', '-nostats', '-i', file, '-af', filter, '-f', 'null', '-']);
  if (res.status !== 0) throw new Error(`ffmpeg ${filter.split('=')[0]} failed for ${file}: ${res.stderr.trim()}`);
  return res.stderr;
}

export function importRecording({ file, name, only = null, ttsDir = PATHS.ttsDir, voiceDir = PATHS.voiceDir, match, lufs = -18, noise = '-40dB', maxPauseMs = null, forceAsr = false, log = console }) {
  const voice = `recording/${name}`;
  if (!isRecordingVoice(voice)) throw new Error(`--name must be lowercase letters, digits, "-" or "_" (got ${JSON.stringify(name)})`);
  if (!existsSync(file)) throw new Error(`recording not found: ${file}`);

  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const analysis = analyzeNarration(sources, profileFor(MANIFEST.profile));
  reportOrThrow(analysis, log);
  const { rate, pitch } = analysis.voice;
  const segments = selectSegments(analysis.segments, only);

  const workDir = path.join(PATHS.outDir, 'recording', name);
  mkdirSync(workDir, { recursive: true });
  const sha256 = createHash('sha256').update(readFileSync(file)).digest('hex');
  const asr = transcribe(file, sha256, asrPrompt({ opening: analysis.segments[0]?.parsed.display, adversary: MANIFEST.adversary, lexicon: sources.lexicon }), workDir, { force: forceAsr, log });
  const words = asr.words;

  const silences = parseSilences(analyse(file, `silencedetect=noise=${noise}:d=0.12`), asr.durationMs);
  const target = match ? parseLoudness(analyse(match, 'loudnorm=print_format=json')).integrated : lufs;
  const gain = gainDb(parseLoudness(analyse(file, 'loudnorm=print_format=json')), target);

  const located = locateSegments(segments, words);
  const cuts = cutPoints(located, words, silences, asr.durationMs);
  const cutOf = new Map(cuts.map((c) => [c.id, c]));
  mkdirSync(ttsDir, { recursive: true });
  mkdirSync(voiceDir, { recursive: true });
  let pausesRemovedMs = 0;
  for (const [k, seg] of segments.entries()) {
    const cut = cutOf.get(seg.id);
    if (!cut) continue;
    const ranges = keepRanges(cut, silences, maxPauseMs);
    const mp3 = path.join(voiceDir, `${seg.id}.mp3`);
    const res = runFfmpeg(clipArgs({ source: file, ranges, gain, out: mp3 }));
    if (res.status !== 0) throw new Error(`ffmpeg failed cutting ${seg.id}: ${res.stderr.trim()}`);
    const record = recordingRecord({
      voice,
      rate,
      pitch,
      spoken: spokenForVoice(voice, seg.parsed),
      bytes: statSync(mp3).size,
      ranges,
      located: located[k],
      words,
      source: { file: path.relative(REPO_ROOT, path.resolve(file)).split(path.sep).join('/'), sha256, gainDb: gain },
      asrModel: ASR_MODEL,
    });
    pausesRemovedMs += record.source.pausesRemovedMs;
    writeFileAtomic(path.join(ttsDir, `${seg.id}.json`), `${JSON.stringify(record, null, 1)}\n`);
  }

  const report = importReport({ located, cuts, words, gain, pausesRemovedMs });
  const reportPath = path.join(workDir, `report-${fileSlug(file)}.md`);
  writeFileAtomic(reportPath, report);
  const missing = located.filter((f) => !f.found).map((f) => f.id);
  const weak = located.filter((f) => f.found && f.score < REVIEW_SCORE).map((f) => `${f.id} (${f.score.toFixed(2)})`);
  log.log(`import-recording: ${cuts.length}/${located.length} clips -> ${voiceDir} (gain ${gain} dB${pausesRemovedMs ? `, ${(pausesRemovedMs / 1000).toFixed(1)} s of pauses removed` : ''})`);
  if (weak.length) log.warn(`  aviso: listen to these, they differ from the script: ${weak.join(', ')}`);
  if (missing.length) log.warn(`  aviso: not found in the recording (no clip written): ${missing.join(', ')}`);
  if (sources.narration.voice !== voice) log.warn(`  aviso: narration.json "voice" is "${sources.narration.voice}" — set it to "${voice}" before build-timeline`);
  log.log(`report -> ${reportPath}`);
  return { located, cuts, gain, missing, weak };
}

function main() {
  const { values } = parseArgs({
    options: {
      video: { type: 'string' },
      file: { type: 'string' },
      name: { type: 'string' },
      only: { type: 'string' },
      'tts-dir': { type: 'string' },
      'voice-dir': { type: 'string' },
      match: { type: 'string' },
      lufs: { type: 'string' },
      noise: { type: 'string' },
      'max-pause': { type: 'string' },
      'force-asr': { type: 'boolean', default: false },
    },
  });
  if (!values.file || !values.name) throw new Error('usage: import-recording.mjs --video <slug> --file <wav> --name <name> [--only s02-03,s04-01] [--tts-dir <dir> --voice-dir <dir>] [--match <clip> | --lufs <n>] [--noise -40dB] [--max-pause 300] [--force-asr]');
  const abs = (p) => (p ? path.resolve(p) : undefined);
  importRecording({
    file: path.resolve(values.file),
    name: values.name,
    only: values.only ? values.only.split(',').map((x) => x.trim()).filter(Boolean) : null,
    ...(values['tts-dir'] ? { ttsDir: abs(values['tts-dir']) } : {}),
    ...(values['voice-dir'] ? { voiceDir: abs(values['voice-dir']) } : {}),
    ...(values.match ? { match: abs(values.match) } : {}),
    ...(values.lufs !== undefined ? { lufs: Number.parseFloat(values.lufs) } : {}),
    ...(values.noise ? { noise: values.noise } : {}),
    ...(values['max-pause'] ? { maxPauseMs: Number.parseInt(values['max-pause'], 10) } : {}),
    forceAsr: values['force-asr'],
  });
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`import-recording: ${error.message}`);
    process.exit(1);
  }
}
