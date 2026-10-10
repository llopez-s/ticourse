#!/usr/bin/env node
// Turns a narrator's own recording of the whole script into the same per-segment clips the
// TTS providers write (tts/<id>.json + public/voice/<id>.mp3), for voice "recording/<name>":
//
//   node video/engine/scripts/import-recording.mjs --video <slug> --file <wav> --name <name>
//        [--only s02-03,s04-01] [--tts-dir <dir> --voice-dir <dir>] [--match <clip.mp3> | --lufs -18] [--noise -40dB]
//        [--max-pause <ms>] [--tempo <x>] [--lead-ms <ms>] [--force-asr]
//
// 1. Transcribes the recording with word timings (recording_asr.py, faster-whisper in the
//    Chatterbox venv), cached in out/recording/<name>/asr-<file>.json by the file's hash. Long
//    silences are left out of what Whisper hears (asrClips: V10 lost its first sentence after 28.5 s of it).
// 2. Finds every segment in it, in order; a sentence read more than once keeps its last take,
//    and audio that is not in the script (exam cards, intercepts, false starts) is skipped.
// 3. Cuts each clip at the nearest silence, applies one gain to the whole recording (to --match's
//    loudness, or --lufs) and encodes it like the Chatterbox clips (24 kHz mono, 96 kbps CBR).
//    With --max-pause, every pause inside a sentence longer than that is shortened to it. With --tempo,
//    every clip is sped up by that factor (ffmpeg atempo keeps the pitch) and its word timings with it.
//    With --lead-ms, the air kept before a sentence's first word is capped at that (a breath no longer rides in).
//    Both default to narration.json "recording": { "tempo": 1.08, "maxPauseMs": 250 } when set there.
// 4. Writes out/recording/<name>/report-<file>.md: each segment's match, and what was left out.
// Set narration.json "voice" to "recording/<name>" before build-timeline. Segments it could not
// find get no clip, so build-timeline names them; the console says where each should be, what Whisper
// heard there, and the commands that cut it out and import just that. To replace some sentences, record just those
// (in script order) and import that file with --only <ids>: the other clips are left as they are.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { acquireHeavyLock } from './lib/heavy-lock.mjs';
import { analyzeNarration, isRecordingVoice, loadSources, reportOrThrow, spokenForVoice } from './lib/narration.mjs';
import { ENGINE_DIR, MANIFEST, PATHS, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';
import {
  REVIEW_SCORE,
  asrCacheValid,
  asrClips,
  asrPrompt,
  clipArgs,
  clock,
  cutPoints,
  gainDb,
  importReport,
  keepRanges,
  locateSegments,
  missingGaps,
  parseDuration,
  parseLoudness,
  parseSilences,
  recordingRecord,
  recordingSettings,
  recutAdvice,
  recutLoudnessFilter,
  repairSwallowedPauses,
  trailingSpeechEnd,
  selectSegments,
} from './lib/recording.mjs';
import { runFfmpeg, writeFileAtomic } from './lib/remotion.mjs';
import { VENV_PYTHON, scaleTimings } from './tts-chatterbox.mjs';

const ASR_MODEL = 'small';

/** Whisper transcript of the `clips` of `file` (null: all of it), reused while the file, model and clips are unchanged. */
function transcribe(file, sha256, prompt, clips, workDir, { force, log }) {
  const cache = path.join(workDir, `asr-${fileSlug(file)}.json`);
  if (!force && existsSync(cache)) {
    const cached = JSON.parse(readFileSync(cache, 'utf8'));
    if (asrCacheValid(cached, { sha256, model: ASR_MODEL, clips })) {
      const note = cached.prompt === prompt ? '' : ' — the Whisper prompt changed since (was the first sentence rewritten?); --force-asr redoes it';
      log.log(`import-recording: transcript cached (${cached.words.length} words)${note}`);
      return cached;
    }
    if (asrCacheValid(cached, { sha256, model: ASR_MODEL, clips: cached.clips ?? null })) {
      log.log('import-recording: the cached transcript heard other stretches of the recording (its long silences changed) — transcribing again');
    }
  }
  if (clips) log.log(`import-recording: long silences left out, Whisper hears ${clips.map((c) => `${clock(c.startMs)}–${clock(c.endMs)}`).join(', ')}`);
  if (!existsSync(VENV_PYTHON)) throw new Error(`Chatterbox venv not found at ${VENV_PYTHON} — it also runs Whisper; create it as in video/engine/README.md`);
  const raw = path.join(workDir, `asr-${fileSlug(file)}.raw.json`);
  // Whisper on the CPU is a heavy job: wait for any render to finish instead of slowing both (lib/heavy-lock.mjs).
  const releaseLock = acquireHeavyLock(`import-recording (Whisper) ${path.basename(file)}`);
  let res;
  try {
    res = spawnSync(
      VENV_PYTHON,
      [
        '-X', 'utf8', path.join(SCRIPTS_DIR, 'recording_asr.py'), '--audio', file, '--out', raw, '--model', ASR_MODEL, '--prompt', prompt,
        ...(clips ? ['--clips', clips.flatMap((c) => [c.startMs / 1000, c.endMs / 1000]).join(',')] : []),
      ],
      {
        cwd: REPO_ROOT,
        stdio: 'inherit',
        windowsHide: true,
        env: { ...process.env, HF_HOME: process.env.HF_HOME ?? path.join(ENGINE_DIR, '.cache', 'huggingface'), HF_HUB_DISABLE_SYMLINKS_WARNING: '1' },
      },
    );
  } finally {
    releaseLock();
  }
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

/** stderr of one ffmpeg analysis pass over `file`, or just its `range` (output discarded). */
function analyse(file, filter, range = null) {
  const span = range ? ['-ss', String(range.startMs / 1000), '-t', String((range.endMs - range.startMs) / 1000)] : [];
  const res = runFfmpeg(['-hide_banner', '-nostats', ...span, '-i', file, '-af', filter, '-f', 'null', '-']);
  if (res.status !== 0) throw new Error(`ffmpeg ${filter.split('=')[0]} failed for ${file}: ${res.stderr.trim()}`);
  return res.stderr;
}

/** `p` as the commands are typed, from the repo root with forward slashes (absolute when it is on another drive). */
function fromRoot(p) {
  const rel = path.relative(REPO_ROOT, p);
  return (path.isAbsolute(rel) ? p : rel).split(path.sep).join('/');
}

/**
 * recutAdvice's paths and loudness for one gap: the cut goes next to the recording, and the --only import gets the
 * full import's gain as --lufs (the cut's loudness, measured as recut_recording.py will write it, + that gain).
 */
function recutOptions(gap, { file, name, gain }) {
  const out = path.join(path.dirname(file), `${MANIFEST.slug} ${name} ${gap.ids.join(' ')} (recorte).wav`);
  let lufs = `<LUFS of the cut + ${gain}>`;
  if (gap.startMs !== null) {
    try {
      lufs = Math.round((parseLoudness(analyse(file, recutLoudnessFilter(), gap)).integrated + gain) * 100) / 100;
    } catch {
      // too little voice to measure: the placeholder says what to put there
    }
  }
  return { file: fromRoot(file), out: fromRoot(out), slug: MANIFEST.slug, name, python: fromRoot(VENV_PYTHON), lufs };
}

/** A clip record whose audio was sped up by `tempo`: duration and word timings shrink by the same factor. */
export function withTempo(record, tempo) {
  if (tempo === 1) return record;
  const scaled = scaleTimings(
    { durationMs: record.durationMs, words: record.words.map((w) => ({ text: w.text, startMs: w.offsetMs, endMs: w.offsetMs + w.durationMs })) },
    tempo,
  );
  return { ...record, tempo, durationMs: scaled.durationMs, words: scaled.words };
}

export function importRecording({ file, name, only = null, ttsDir = PATHS.ttsDir, voiceDir = PATHS.voiceDir, match, lufs = -18, noise = '-40dB', maxPauseMs, tempo, maxLeadMs = null, forceAsr = false, log = console }) {
  const voice = `recording/${name}`;
  if (!isRecordingVoice(voice)) throw new Error(`--name must be lowercase letters, digits, "-" or "_" (got ${JSON.stringify(name)})`);
  if (!existsSync(file)) throw new Error(`recording not found: ${file}`);

  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const analysis = analyzeNarration(sources, { ...profileFor(MANIFEST.profile), track: MANIFEST.track });
  reportOrThrow(analysis, log);
  const settings = recordingSettings(sources.narration, { tempo, maxPauseMs });
  const { rate, pitch } = analysis.voice;
  const segments = selectSegments(analysis.segments, only);

  const workDir = path.join(PATHS.outDir, 'recording', name);
  mkdirSync(workDir, { recursive: true });
  const sha256 = createHash('sha256').update(readFileSync(file)).digest('hex');
  // Silences first: Whisper is not given the long ones (asrClips). The cuts read the same pass, timed as always.
  const silenceLog = analyse(file, `silencedetect=noise=${noise}:d=0.12`);
  const fileMs = parseDuration(silenceLog);
  const clips = fileMs === null ? null : asrClips(parseSilences(silenceLog, fileMs), fileMs);
  const prompt = asrPrompt({ opening: analysis.segments[0]?.parsed.display, adversary: MANIFEST.adversary, lexicon: sources.lexicon });
  const asr = transcribe(file, sha256, prompt, clips, workDir, { force: forceAsr, log });
  const words = asr.words;

  const silences = parseSilences(silenceLog, asr.durationMs);
  const target = match ? parseLoudness(analyse(match, 'loudnorm=print_format=json')).integrated : lufs;
  const gain = gainDb(parseLoudness(analyse(file, 'loudnorm=print_format=json')), target);

  // Cuts are placed from the words' edges, so first undo the pauses Whisper stretched a word over.
  const timed = repairSwallowedPauses(words, silences);
  const located = locateSegments(segments, timed);
  const cuts = cutPoints(located, timed, silences, asr.durationMs, { maxLeadMs });
  const cutOf = new Map(cuts.map((c) => [c.id, c]));
  mkdirSync(ttsDir, { recursive: true });
  mkdirSync(voiceDir, { recursive: true });
  let pausesRemovedMs = 0;
  for (const [k, seg] of segments.entries()) {
    const cut = cutOf.get(seg.id);
    if (!cut) continue;
    // A spliced take (the last reading of each sentence) is cut part by part, then joined.
    const ranges = (cut.parts ?? [cut]).flatMap((p) => keepRanges(p, silences, settings.maxPauseMs));
    const mp3 = path.join(voiceDir, `${seg.id}.mp3`);
    const res = runFfmpeg(clipArgs({ source: file, ranges, gain, out: mp3, tempo: settings.tempo }));
    if (res.status !== 0) throw new Error(`ffmpeg failed cutting ${seg.id}: ${res.stderr.trim()}`);
    const record = withTempo(recordingRecord({
      voice,
      rate,
      pitch,
      spoken: spokenForVoice(voice, seg.parsed),
      bytes: statSync(mp3).size,
      ranges,
      located: located[k],
      words: timed,
      source: { file: path.relative(REPO_ROOT, path.resolve(file)).split(path.sep).join('/'), sha256, gainDb: gain },
      asrModel: ASR_MODEL,
    }), settings.tempo);
    // Where the voice of this clip really stops, measured on the clip itself: build-timeline plays a clip up to
    // its last word + a tail, and Whisper often ends the last word early (V4 s08-04 lost «siguiente»).
    record.speechEndMs = trailingSpeechEnd(parseSilences(analyse(mp3, `silencedetect=noise=${noise}:d=0.08`), record.durationMs), record.durationMs);
    pausesRemovedMs += record.source.pausesRemovedMs;
    writeFileAtomic(path.join(ttsDir, `${seg.id}.json`), `${JSON.stringify(record, null, 1)}\n`);
  }

  const report = importReport({ located, cuts, words, gain, pausesRemovedMs });
  const reportPath = path.join(workDir, `report-${fileSlug(file)}.md`);
  writeFileAtomic(reportPath, report);
  const missing = located.filter((f) => !f.found).map((f) => f.id);
  const weak = located.filter((f) => f.found && f.score < REVIEW_SCORE).map((f) => `${f.id} (${f.score.toFixed(2)})`);
  log.log(`import-recording: ${cuts.length}/${located.length} clips -> ${voiceDir} (gain ${gain} dB${pausesRemovedMs ? `, ${(pausesRemovedMs / 1000).toFixed(1)} s of pauses removed` : ''}${settings.tempo !== 1 ? `, tempo ${settings.tempo}` : ''})`);
  if (weak.length) log.warn(`  aviso: listen to these, they differ from the script: ${weak.join(', ')}`);
  if (missing.length) {
    log.warn(`  aviso: not found in the recording (no clip written): ${missing.join(', ')}`);
    for (const gap of missingGaps(located, cuts, timed, silences, asr.durationMs)) {
      for (const line of recutAdvice(gap, recutOptions(gap, { file, name, gain }))) log.warn(`    ${line}`);
    }
  }
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
      tempo: { type: 'string' },
      'lead-ms': { type: 'string' },
      'force-asr': { type: 'boolean', default: false },
    },
  });
  if (!values.file || !values.name) throw new Error('usage: import-recording.mjs --video <slug> --file <wav> --name <name> [--only s02-03,s04-01] [--tts-dir <dir> --voice-dir <dir>] [--match <clip> | --lufs <n>] [--noise -40dB] [--max-pause 300] [--tempo 1.08] [--force-asr]');
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
    ...(values.tempo ? { tempo: Number.parseFloat(values.tempo) } : {}),
    ...(values['lead-ms'] ? { maxLeadMs: Number.parseInt(values['lead-ms'], 10) } : {}),
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
