#!/usr/bin/env node
// Turns a narrator's own recording of the whole script into the same per-segment clips the
// TTS providers write (tts/<id>.json + public/voice/<id>.mp3), for voice "recording/<name>":
//
//   node video/engine/scripts/import-recording.mjs --video <slug> --file <wav> --name <name>
//        [--only s02-03,s04-01] [--tts-dir <dir> --voice-dir <dir>] [--match <clip.mp3> | --lufs -18 | --gain <dB> | --reuse-gain]
//        [--noise -40dB] [--max-pause <ms>] [--tempo <x>] [--lead-ms <ms>] [--force-asr] [--no-edge-fix]
//
// Partial imports (--only): --name defaults to narration.json "voice" (recording/<name>), the voice build-timeline
// accepts. The gain of a FULL import is saved in out/recording/<name>/import-gain.json and, with --only and no
// --lufs/--match/--gain, applied as it is to the excerpt (--reuse-gain asks for it explicitly). If --file IS the full
// recording of that import (same hash), --only locates every sentence in it and rewrites just the ones named.
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
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { warnIfEngineBehind } from './lib/engine-freshness.mjs';
import { acquireHeavyLock } from './lib/heavy-lock.mjs';
import { analyzeNarration, isRecordingVoice, loadSources, reportOrThrow, spokenForVoice } from './lib/narration.mjs';
import { ENGINE_DIR, MANIFEST, PATHS, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';
import { edgeGap, fixEntry, mergeFixes } from './lib/recording-fixes.mjs';
import {
  EDGE_ENERGY_LIMIT,
  EDGE_SAMPLE_RATE,
  REVIEW_SCORE,
  asrCacheValid,
  asrClips,
  asrPrompt,
  clipArgs,
  clock,
  cutPoints,
  dropSilentWordRuns,
  edgeCheckLine,
  edgeOffenders,
  gainDb,
  importGainRecord,
  importReport,
  inferFullImport,
  joinNegativeValues,
  keepRanges,
  laterTakes,
  locateSegments,
  longClips,
  longPauses,
  mergeAsrWords,
  midSentenceStarts,
  missingGaps,
  parseDuration,
  parseLoudness,
  parseSilences,
  pcm16FromWav,
  planGain,
  recordingRecord,
  recordingSettings,
  recutAdvice,
  recutLoudnessFilter,
  refineCuts,
  repairSwallowedPauses,
  repeatedOpenings,
  restartGap,
  retryTargets,
  trailingSpeechEnd,
  selectSegments,
  stretchedWords,
  trimGhostWords,
  unheardVoice,
  withoutStretch,
} from './lib/recording.mjs';
import { ffmpegBinary, runFfmpeg, writeFileAtomic } from './lib/remotion.mjs';
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
  const asr = { sha256, ...runWhisper(file, raw, prompt, clips) };
  writeFileAtomic(cache, `${JSON.stringify(asr, null, 1)}\n`);
  return asr;
}

/** One recording_asr.py run over the `clips` of `file` (null: all of it); its JSON, also left in `raw`. */
function runWhisper(file, raw, prompt, clips) {
  if (!existsSync(VENV_PYTHON)) throw new Error(`Chatterbox venv not found at ${VENV_PYTHON} — it also runs Whisper; create it as in video/engine/README.md`);
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
  return JSON.parse(readFileSync(raw, 'utf8'));
}

/**
 * Whisper skips a sentence that repeats the start of its prompt (documentos s01-01, V10, V28: the opening of
 * the script is the prompt's first sentence), or a window that is mostly silence. For each run of segments the first
 * pass left out where there is voice, hear that stretch again alone and WITHOUT the prompt, and put the words it
 * hears in place of the ones that were there. The patched transcript is saved in the cache, so the next import
 * does not repeat it.
 * @returns {{words: object[], retried: {ids: string[], startMs: number, endMs: number}[]} | null} null: nothing to retry
 */
function retryMissing({ file, workDir, asr, cachePath, gaps, log }) {
  const tried = new Set((asr.patches ?? []).map((q) => q.startMs));
  const targets = retryTargets(gaps).filter((q) => !tried.has(q.startMs));
  if (!targets.length) return null;
  let words = asr.words;
  const done = [];
  for (const t of targets) {
    log.log(`import-recording: ${t.ids.join(', ')} not found; hearing ${clock(t.startMs)}–${clock(t.endMs)} again without Whisper's prompt`);
    const raw = path.join(workDir, `asr-${fileSlug(file)}.retry-${t.startMs}.json`);
    const again = runWhisper(file, raw, '', [{ startMs: t.startMs, endMs: t.endMs }]);
    words = mergeAsrWords(words, again.words, t);
    done.push(t);
  }
  const patches = [...(asr.patches ?? []), ...done.map((t) => ({ startMs: t.startMs, endMs: t.endMs, ids: t.ids }))];
  writeFileAtomic(cachePath, `${JSON.stringify({ ...asr, words, patches }, null, 1)}\n`);
  return { words, retried: done };
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

/** "recording/lidia" -> "lidia" (null when the voice is not a recording voice). */
function recordingName(voice) {
  return isRecordingVoice(voice) ? voice.slice('recording/'.length) : null;
}

/**
 * Mono 16 kHz float samples of the whole recording (what verify_voice.py measures its edge energy on), read through
 * ffmpeg (Remotion's build only muxes `wav`, so it goes through a pipe as 16-bit PCM). A 10-minute recording is ~19 MB.
 */
function loadSamples(file) {
  const res = spawnSync(ffmpegBinary(), ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(EDGE_SAMPLE_RATE), '-c:a', 'pcm_s16le', '-f', 'wav', '-'], {
    cwd: REPO_ROOT,
    encoding: 'buffer',
    maxBuffer: 1024 * 1024 * 1024,
    windowsHide: true,
  });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`ffmpeg could not decode ${file}: ${String(res.stderr).trim()}`);
  return pcm16FromWav(res.stdout);
}

/**
 * The full import this one follows: out/recording/<name>/import-gain.json of any of `names` (a full import writes it),
 * else the recording and gain most of the voice's clips in `ttsDir` were cut with (imports made before the file existed).
 */
function loadSavedImport({ names, ttsDir }) {
  for (const n of names) {
    const p = path.join(PATHS.outDir, 'recording', n, 'import-gain.json');
    if (!existsSync(p)) continue;
    try {
      const saved = JSON.parse(readFileSync(p, 'utf8'));
      if (typeof saved.sha256 === 'string' && Number.isFinite(saved.gainDb)) return saved;
    } catch {
      // unreadable: fall through to the clips
    }
  }
  if (!existsSync(ttsDir)) return null;
  const records = [];
  for (const f of readdirSync(ttsDir)) {
    if (!f.endsWith('.json')) continue;
    try {
      records.push(JSON.parse(readFileSync(path.join(ttsDir, f), 'utf8')));
    } catch {
      // not a clip record
    }
  }
  for (const n of names) {
    const inferred = inferFullImport(records, `recording/${n}`);
    if (inferred) return inferred;
  }
  return null;
}

export function importRecording({ file, name, only = null, ttsDir = PATHS.ttsDir, voiceDir = PATHS.voiceDir, match, lufs, gain: gainFlag, reuseGain = false, noise = '-40dB', maxPauseMs, tempo, maxLeadMs = null, forceAsr = false, retry = true, edgeFix = true, log = console }) {
  warnIfEngineBehind(log, { cwd: REPO_ROOT });
  if (!existsSync(file)) throw new Error(`recording not found: ${file}`);

  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  // The voice build-timeline accepts is narration.json's: a partial import takes its name from there unless told otherwise.
  const narrationName = recordingName(sources.narration.voice);
  const voiceName = name ?? (only ? narrationName : null);
  if (!voiceName) throw new Error('--name is required (only with --only does it default to the "recording/<name>" voice of narration.json)');
  name = voiceName;
  const voice = `recording/${name}`;
  if (!isRecordingVoice(voice)) throw new Error(`--name must be lowercase letters, digits, "-" or "_" (got ${JSON.stringify(name)})`);
  const analysis = analyzeNarration(sources, { ...profileFor(MANIFEST.profile), track: MANIFEST.track });
  reportOrThrow(analysis, log);
  const settings = recordingSettings(sources.narration, { tempo, maxPauseMs });
  const { rate, pitch } = analysis.voice;
  const segments = selectSegments(analysis.segments, only);
  const writeIds = new Set(segments.map((s) => s.id));

  const workDir = path.join(PATHS.outDir, 'recording', name);
  mkdirSync(workDir, { recursive: true });
  const sha256 = createHash('sha256').update(readFileSync(file)).digest('hex');
  // How the gain is fixed, and whether --file is the full recording of an earlier import: both before the slow work.
  const saved = loadSavedImport({ names: [...new Set([name, narrationName].filter(Boolean))], ttsDir });
  const plan = planGain({ only, sha256, saved, match, lufs, gain: gainFlag, reuseGain });
  // --only with the whole recording: every sentence is located (the excerpt-only search starts at 0:00 and looks a few
  // hundred words ahead, so a sentence further on is "not found"), and just the ones named are written.
  const fullFileOnly = Boolean(only) && plan.fullFile;
  if (fullFileOnly) log.log(`import-recording: --file es la grabación completa de la importación anterior: se localiza todo el guion y se reescriben solo ${[...writeIds].join(', ')}`);
  else if (only && !saved && plan.mode === 'measure') log.warn(`  aviso: --only espera un recorte de la grabación (recut_recording.py) o la grabación completa ya importada; no hay una importación completa de «${voice}» de la que tomar la ganancia: se mide el recorte (--lufs ${lufs ?? -18})`);
  const locSegments = fullFileOnly ? analysis.segments : segments;
  // Silences first: Whisper is not given the long ones (asrClips). The cuts read the same pass, timed as always.
  const silenceLog = analyse(file, `silencedetect=noise=${noise}:d=0.12`);
  const fileMs = parseDuration(silenceLog);
  const clips = fileMs === null ? null : asrClips(parseSilences(silenceLog, fileMs), fileMs);
  const prompt = asrPrompt({ opening: analysis.segments[0]?.parsed.display, adversary: MANIFEST.adversary, lexicon: sources.lexicon });
  const asr = transcribe(file, sha256, prompt, clips, workDir, { force: forceAsr, log });
  // `rawWords` is what is cached on disk (never modified here); `words` is what the cuts are placed from.
  let rawWords = asr.words;

  const silences = parseSilences(silenceLog, asr.durationMs);
  let gain;
  if (plan.mode === 'measure') {
    const target = match ? parseLoudness(analyse(match, 'loudnorm=print_format=json')).integrated : (lufs ?? -18);
    gain = gainDb(parseLoudness(analyse(file, 'loudnorm=print_format=json')), target);
  } else {
    gain = plan.gainDb;
    log.log(`import-recording: ${plan.message}`);
    // A re-recorded sentence can peak higher than the recording the gain was worked out on.
    if (!plan.fullFile) {
      try {
        const peak = parseLoudness(analyse(file, 'loudnorm=print_format=json')).truePeak;
        if (peak + gain > -1) log.warn(`  aviso: con ${gain >= 0 ? '+' : ''}${gain} dB el pico del recorte llega a ${(peak + gain).toFixed(1)} dBTP (por encima de -1): puede saturar`);
      } catch {
        // too little signal to measure: nothing to warn about
      }
    }
  }

  // Words Whisper invented without a duration are left out, and a short word stretched over a pause is cut down to its
  // voice; then the pauses Whisper stretched a word over are undone, since cuts are placed from the words' edges.
  const prepare = (raw) => {
    const noSilent = dropSilentWordRuns(raw);
    const ghost = trimGhostWords(noSilent.words, silences);
    return { words: ghost.words, silentRuns: noSilent.dropped, ghosts: ghost.trimmed, timed: repairSwallowedPauses(ghost.words, silences) };
  };
  let { words, silentRuns, ghosts, timed } = prepare(rawWords);
  let located = locateSegments(locSegments, timed);
  let cuts = cutPoints(located, timed, silences, asr.durationMs, { maxLeadMs });
  // A sentence Whisper skipped is heard again alone, without its prompt; if that finds it, everything is placed again.
  let retried = [];
  if (retry && located.some((f) => !f.found)) {
    const again = retryMissing({ file, workDir, asr, cachePath: path.join(workDir, `asr-${fileSlug(file)}.json`), gaps: missingGaps(located, cuts, timed, silences, asr.durationMs), log });
    if (again) {
      rawWords = again.words;
      ({ words, silentRuns, ghosts, timed } = prepare(rawWords));
      located = locateSegments(locSegments, timed);
      cuts = cutPoints(located, timed, silences, asr.durationMs, { maxLeadMs });
      retried = again.retried.map((r) => ({ ...r, recovered: r.ids.filter((id) => located.find((f) => f.id === id)?.found) }));
      for (const r of retried) log.log(`import-recording: second hearing of ${clock(r.startMs)}–${clock(r.endMs)}: ${r.recovered.length ? `found ${r.recovered.join(', ')}` : 'still not found'}`);
    }
  }
  for (const r of silentRuns) log.warn(`import-recording: ${r.count} palabras sin duración descartadas en ${(r.startMs / 1000).toFixed(2)} s: ${r.text.length > 90 ? `${r.text.slice(0, 90)}…` : r.text}`);
  for (const g of ghosts) log.warn(`import-recording: palabra «${g.text}» de ${((g.endMs - g.startMs) / 1000).toFixed(1)} s (${clock(g.startMs)}–${clock(g.endMs)}) recortada a su voz (${clock(g.toStartMs)}–${clock(g.toEndMs)})`);

  // Clip edges that fall inside the voice (Whisper ends a word early, the voice decays after it) are moved to the
  // nearest silence now: verify-voice would only flag them after the render's setup, 15 minutes later.
  let samples = null;
  let edgeFixes = [];
  if (edgeFix) {
    try {
      samples = loadSamples(file);
    } catch (error) {
      log.warn(`  aviso: no se pudo leer el audio para comprobar los bordes de los clips: ${error.message}`);
    }
  }
  if (samples) {
    ({ cuts, fixes: edgeFixes } = refineCuts(samples, EDGE_SAMPLE_RATE, cuts, located, timed));
    edgeFixes = edgeFixes.filter((f) => writeIds.has(f.id));
    for (const f of edgeFixes) {
      if (f.head) log.log(`import-recording: ${f.id}: inicio movido de ${clock(f.head.fromMs)} a ${clock(f.head.toMs)} (energía del borde ${f.head.before.toFixed(2)} -> ${f.head.after.toFixed(2)})`);
      if (f.tail) log.log(`import-recording: ${f.id}: final movido de ${clock(f.tail.fromMs)} a ${clock(f.tail.toMs)} (energía del borde ${f.tail.before.toFixed(2)} -> ${f.tail.after.toFixed(2)})`);
    }
  }
  const cutOf = new Map(cuts.map((c) => [c.id, c]));
  mkdirSync(ttsDir, { recursive: true });
  mkdirSync(voiceDir, { recursive: true });
  let pausesRemovedMs = 0;
  const written = [];
  for (const [k, seg] of locSegments.entries()) {
    if (!writeIds.has(seg.id)) continue;
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
    written.push({ id: seg.id, ranges, durationMs: record.durationMs, spoken: record.spoken, text: seg.parsed.display });
  }
  // A full import leaves its gain for the partial imports that follow it (--only with a cut of this recording).
  if (!only) {
    const target = plan.mode === 'explicit' ? { gain } : match ? { match: path.relative(REPO_ROOT, match).split(path.sep).join('/') } : { lufs: lufs ?? -18 };
    const record = importGainRecord({
      gainDb: gain,
      sha256,
      file: path.relative(REPO_ROOT, path.resolve(file)).split(path.sep).join('/'),
      voice,
      target,
      durationMs: asr.durationMs,
      at: new Date().toISOString(),
    });
    writeFileAtomic(path.join(workDir, 'import-gain.json'), `${JSON.stringify(record, null, 1)}\n`);
  }
  // The same signal verify-voice will measure on these clips (RMS of their first / last 30 ms against their whole RMS).
  const edgeBad = samples ? edgeOffenders(samples, EDGE_SAMPLE_RATE, written) : null;

  // With the whole recording and --only, `located` holds every segment; only the ones that were written are reported on.
  const mine = (id) => writeIds.has(id);
  const later = laterTakes(locSegments, located, timed).filter((l) => mine(l.id));
  const midStarts = midSentenceStarts(locSegments, located, timed).filter((m) => mine(m.id));
  const report = importReport({ located, cuts, words, gain, pausesRemovedMs, later, midStarts, retried, silentRuns, ghosts, edgeFixes, edgeOffenders: edgeBad });
  const reportPath = path.join(workDir, `report-${fileSlug(file)}.md`);
  writeFileAtomic(reportPath, report);
  const missing = located.filter((f) => !f.found && mine(f.id)).map((f) => f.id);
  const weak = located.filter((f) => f.found && mine(f.id) && f.score < REVIEW_SCORE).map((f) => `${f.id} (${f.score.toFixed(2)})`);
  log.log(`import-recording: ${written.length}/${segments.length} clips -> ${voiceDir} (gain ${gain} dB${pausesRemovedMs ? `, ${(pausesRemovedMs / 1000).toFixed(1)} s of pauses removed` : ''}${settings.tempo !== 1 ? `, tempo ${settings.tempo}` : ''})`);
  if (edgeBad) (edgeBad.length ? log.warn : log.log).call(log, `import-recording: ${edgeCheckLine(edgeBad)}`);
  if (weak.length) log.warn(`  aviso: listen to these, they differ from the script: ${weak.join(', ')}`);
  // Every suggestion below is also saved as data (fixes-<file>.json) for fix-recording.mjs, which applies the safe ones.
  const fixes = [];
  const advise = (kind, gap, extra = {}) => {
    const entry = fixEntry(kind, gap);
    if (entry) fixes.push(entry);
    for (const line of recutAdvice(gap, { ...recutOptions(gap, { file, name, gain }), ...extra })) log.warn(`    ${line}`);
  };
  // An edge still inside a word after the cut was moved: the cut that puts it in the middle of the next pause.
  for (const o of edgeBad ?? []) {
    const gap = edgeGap(o, cutOf.get(o.id), silences, { limit: EDGE_ENERGY_LIMIT });
    const entry = gap && fixEntry('edge', gap);
    if (entry) fixes.push(entry);
  }
  // The narrator's last take is the good one: a reading of a segment AFTER the one used is a clip to rebuild.
  for (const lt of later) {
    log.warn(`  aviso: ${lt.id}: hay una toma POSTERIOR a la usada (${clock(lt.startMs)}–${clock(lt.endMs)}, ${lt.sentence ? 'una frase' : 'entera'}, coincide ${lt.score.toFixed(2)}): la última es la buena`);
    advise('later', { ids: [lt.id], startMs: Math.max(0, lt.startMs - 300), endMs: lt.endMs + 300 });
  }
  // A half-said sentence glued to its retake shows as one word stretched over the dropped words.
  for (const sw of stretchedWords(located, timed, silences).filter((x) => mine(x.id))) {
    const cut = cutOf.get(sw.id);
    // The clean take starts where the voice resumes after the silence inside the word, or at the word itself when
    // the repair already moved its start past that silence.
    const retake = sw.retakeMs ?? sw.startMs;
    const gap = { ids: [sw.id], startMs: Math.max(0, retake - 500), endMs: cut.endMs + 300 };
    log.warn(
      `  aviso: ${sw.id}: «${sw.text}» lasts ${((sw.endMs - sw.startMs) / 1000).toFixed(1)} s (${clock(sw.startMs)}–${clock(sw.endMs)}): ` +
        'Whisper stretched it over voice it did not transcribe, probably a half-said sentence and its retake in the same clip.',
    );
    advise('stretched', gap);
  }
  // A clip that begins after the script's first word, with that word said just before it: the opening was lost.
  for (const ms of midStarts) {
    const cut = cutOf.get(ms.id);
    const gap = { ids: [ms.id], startMs: Math.max(0, ms.startMs - 300), endMs: cut.endMs + 300 };
    log.warn(`  aviso: ${ms.id}: the clip starts mid-sentence: «${ms.word}» is said right before it (${clock(ms.startMs)}–${clock(ms.endMs)}, heard as «${ms.missed}») and is left out.`);
    advise('midstart', gap, { cause: 'the clip should include the opening that is just before it' });
  }
  // Quick checks on the clips as written (no Whisper pass): a sentence whose opening is read again after a pause,
  // voice inside a clip that no word covers, and a clip much longer than its text read once — all a take the cut
  // kept whole (producto-bluf s06-03 and s09-07 were only caught by verify-voice, 43 minutes later).
  const restarts = repeatedOpenings(written, cuts, timed, silences);
  for (const r of restarts) {
    const gap = restartGap(r, cutOf.get(r.id));
    log.warn(`  aviso: ${r.id}: «${r.opening}…» se lee dos veces en el clip (${clock(r.firstMs)} y, tras ${(r.pauseMs / 1000).toFixed(1)} s de pausa, ${clock(r.againMs)}): queda una toma anterior dentro; la última es la buena.`);
    advise('restart', gap, { cause: r.sentence === 0 ? 'keep only the reading that starts after the pause' : 'keep what comes before the first reading and the reading after the pause' });
  }
  const restarted = new Set(restarts.map((r) => r.id));
  const unheard = unheardVoice(written.filter((w) => !restarted.has(w.id)).map((w) => cutOf.get(w.id)), timed, silences);
  for (const u of unheard) {
    const gap = withoutStretch(u, cutOf.get(u.id));
    log.warn(`  aviso: ${u.id}: ${(u.voicedMs / 1000).toFixed(1)} s de voz que Whisper no transcribió (${clock(u.startMs)}–${clock(u.endMs)}): probablemente una toma a medias dentro del clip; escúchala.`);
    advise('unheard', gap, { cause: 'if that stretch is a leftover take, keep the clip without it' });
  }
  for (const u of unheard) restarted.add(u.id);
  const long = longClips(written.map((w) => ({ id: w.id, text: w.spoken, durationMs: w.durationMs })));
  for (const lc of long) {
    const cut = cutOf.get(lc.id);
    const pauses = longPauses(cut, silences);
    log.warn(
      `  aviso: ${lc.id}: el clip dura ${(lc.durationMs / 1000).toFixed(1)} s y su texto leído una vez ~${(lc.expectedMs / 1000).toFixed(1)} s (${lc.ratio}×): ` +
        `${restarted.has(lc.id) ? 'es la toma de más de arriba' : 'escúchalo, probablemente guarda una toma anterior'}` +
        `${pauses.length ? ` (pausas de más de 1 s en ${pauses.map((s) => clock(s.startMs)).join(', ')})` : ''}.`,
    );
    if (restarted.has(lc.id) || !pauses.length) continue;
    const parts = cut.parts ?? [cut];
    const last = pauses[pauses.length - 1];
    const gap = { ids: [lc.id], startMs: Math.max(parts[0].startMs, last.endMs - 300), endMs: parts[parts.length - 1].endMs + 300 };
    advise('long', gap, { cause: 'if the last reading after that pause is the whole segment, keep only it' });
  }
  if (missing.length) {
    log.warn(`  aviso: not found in the recording (no clip written): ${missing.join(', ')}`);
    for (const gap of missingGaps(located, cuts, timed, silences, asr.durationMs).filter((g) => g.ids.some(mine))) advise('missing', gap);
    if (only && !plan.fullFile) log.warn('  aviso: --only espera un recorte de la grabación (recut_recording.py) o la grabación completa de la importación anterior; si --file es la grabación completa pero no se reconoce, importa sin --only');
  }
  if (narrationName && narrationName !== name) {
    log.warn(`  aviso: el clip llevará otra voz («${voice}») que narration.json («${sources.narration.voice}»); usa --name ${narrationName} para que build-timeline lo acepte`);
  } else if (!narrationName) {
    log.warn(`  aviso: narration.json "voice" is "${sources.narration.voice}" — set it to "${voice}" before build-timeline`);
  }
  // What fix-recording.mjs reads. A partial import of the full recording only replaces the clips it rewrote; an excerpt
  // (a recut) has its own file, whose times are the excerpt's and are not meant to be applied to the recording.
  const fixesPath = path.join(workDir, `fixes-${fileSlug(file)}.json`);
  let previous = null;
  try {
    previous = JSON.parse(readFileSync(fixesPath, 'utf8')).fixes;
  } catch {
    // first import of this file
  }
  const full = !only || plan.fullFile;
  writeFileAtomic(fixesPath, `${JSON.stringify({ version: 1, slug: MANIFEST.slug, name, file: path.resolve(file), full, sha256, gainDb: gain, fixes: only ? mergeFixes(previous, fixes, writeIds) : fixes }, null, 1)}\n`);
  log.log(`report -> ${reportPath}`);
  return { located, cuts, gain, missing, weak, midStarts, retried, edgeFixes, edgeOffenders: edgeBad, silentRuns, ghosts, restarts, unheard, long };
}

function main() {
  const { values } = parseArgs({
    // «--lufs -18» works as well as «--lufs=-18» (parseArgs alone takes -18 for two short options).
    args: joinNegativeValues(process.argv.slice(2)),
    options: {
      video: { type: 'string' },
      file: { type: 'string' },
      name: { type: 'string' },
      only: { type: 'string' },
      'tts-dir': { type: 'string' },
      'voice-dir': { type: 'string' },
      match: { type: 'string' },
      lufs: { type: 'string' },
      gain: { type: 'string' },
      'reuse-gain': { type: 'boolean', default: false },
      noise: { type: 'string' },
      'max-pause': { type: 'string' },
      tempo: { type: 'string' },
      'lead-ms': { type: 'string' },
      'force-asr': { type: 'boolean', default: false },
      'no-retry': { type: 'boolean', default: false },
      'no-edge-fix': { type: 'boolean', default: false },
    },
  });
  if (!values.file || (!values.name && !values.only)) throw new Error('usage: import-recording.mjs --video <slug> --file <wav> --name <name> [--only s02-03,s04-01] [--tts-dir <dir> --voice-dir <dir>] [--match <clip> | --lufs <n> | --gain <dB> | --reuse-gain] [--noise -40dB] [--max-pause 300] [--tempo 1.08] [--force-asr] [--no-retry] [--no-edge-fix] (--name is optional with --only: it defaults to narration.json "voice")');
  const abs = (p) => (p ? path.resolve(p) : undefined);
  importRecording({
    file: path.resolve(values.file),
    ...(values.name ? { name: values.name } : {}),
    only: values.only ? values.only.split(',').map((x) => x.trim()).filter(Boolean) : null,
    ...(values['tts-dir'] ? { ttsDir: abs(values['tts-dir']) } : {}),
    ...(values['voice-dir'] ? { voiceDir: abs(values['voice-dir']) } : {}),
    ...(values.match ? { match: abs(values.match) } : {}),
    ...(values.lufs !== undefined ? { lufs: Number.parseFloat(values.lufs) } : {}),
    ...(values.gain !== undefined ? { gain: Number.parseFloat(values.gain) } : {}),
    reuseGain: values['reuse-gain'],
    ...(values.noise ? { noise: values.noise } : {}),
    ...(values['max-pause'] ? { maxPauseMs: Number.parseInt(values['max-pause'], 10) } : {}),
    ...(values.tempo ? { tempo: Number.parseFloat(values.tempo) } : {}),
    ...(values['lead-ms'] ? { maxLeadMs: Number.parseInt(values['lead-ms'], 10) } : {}),
    forceAsr: values['force-asr'],
    retry: !values['no-retry'],
    edgeFix: !values['no-edge-fix'],
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
