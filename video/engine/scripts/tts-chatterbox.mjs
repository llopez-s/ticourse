#!/usr/bin/env node
// Chatterbox narration: a local, open-source (MIT) voice model that runs on
// this machine, so it costs nothing and has no quota. One clip per segment.
// Chatterbox gives no word timings, so the worker transcribes every clip with
// faster-whisper: the transcript supplies the word boundaries build-timeline
// needs and is also checked against the script (a clip that skips or repeats
// words is synthesised again with another seed).
//
// Writes the same files as tts.py and tts-elevenlabs.mjs:
//   public/voice/<segment>.mp3   (CBR 96 kbps mono, 24 kHz)
//   tts/<segment>.json           ({ key, voice, rate, pitch, spoken, bytes, bitrateKbps, durationMs, words, asr, ... })
//
//   node video/engine/scripts/tts-chatterbox.mjs --video <slug> [--only s01-01,s02-03] [--force]
//   node video/engine/scripts/tts-chatterbox.mjs --video <slug> --audition [--voices es-es/default,mtl/default] [--respelled]
//   node video/engine/scripts/tts-chatterbox.mjs --video <slug> --audition --moods [--voices es-es/default]
//
// Voice: narration.json "voice": "chatterbox/<pack>/<voice>". pack = es-es (the Spain-Spanish
// language pack) or mtl (the multilingual model); voice = default (the model's built-in voice)
// or the name of a reference clip video/engine/voices/<voice>.wav (voice cloning: only with the
// speaker's consent). Settings: narration.json "chatterbox" (see DEFAULT_SETTINGS).
// Needs the Python venv described in the engine README (video/engine/.venv-chatterbox).
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { REGISTERS, moodFor } from './lib/moods.mjs';
import { analyzeNarration, isChatterboxVoice, loadSources, reportOrThrow, spokenForVoice, ttsKey } from './lib/narration.mjs';
import { ENGINE_DIR, MANIFEST, PATHS, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';
import { runRemotion, writeFileAtomic } from './lib/remotion.mjs';
import { parseSegmentText } from './lib/text.mjs';

const SAMPLE_RATE = 24000;
const BITRATE_KBPS = 96;
const WORK_DIR = path.join(PATHS.outDir, 'chatterbox');
export const VOICES_DIR = path.join(ENGINE_DIR, 'voices');
export const VENV_PYTHON = path.join(ENGINE_DIR, '.venv-chatterbox', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const WORKER = path.join(SCRIPTS_DIR, 'chatterbox_worker.py');

/** Default synthesis settings; narration.json "chatterbox" overrides any of them. */
export const DEFAULT_SETTINGS = {
  language: 'es',
  exaggeration: 0.5, // emotion intensity; 0.5 is neutral, higher is more dramatic
  cfg_weight: 0.5, // adherence to the reference voice; lower = slower, more deliberate delivery
  temperature: 0.8,
  seed: 20260925,
  asr_model: 'small', // faster-whisper model used for word timings and the script check
  min_score: 0.85, // similarity (0–1) between the transcript and the script below which a clip is redone
  attempts: 3, // takes per segment at most; the best-scoring one is kept
  moods: true, // per-segment register from the <direction> (lib/moods.mjs); false = one exaggeration/cfg_weight for the whole video
};

/** The part of the settings that changes the audio (a change re-synthesises every clip). */
const AUDIO_SETTINGS = ['language', 'exaggeration', 'cfg_weight', 'temperature', 'seed'];

export const AUDITION_TEXT =
  'Madrugada en la Autoridad Portuaria de Halden. Al SOC llegan [6.000|seis mil] alertas al día, y solo una importa. ' +
  'La analista aísla el portátil sin apagarlo: la memoria es evidencia. ' +
  'Para el examen: legal hold cuando el litigio es previsible, y hash antes y después de copiar.';

const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

/** voice "chatterbox/<pack>/<voice>" -> { pack, voiceName, voiceRef } (voiceRef null for "default"). */
export function parseVoice(voice) {
  const [, pack, voiceName] = voice.split('/');
  const voiceRef = voiceName === 'default' ? null : path.join(VOICES_DIR, `${voiceName}.wav`);
  return { pack, voiceName, voiceRef };
}

export function settingsFor(narration) {
  return { ...DEFAULT_SETTINGS, ...(narration.chatterbox ?? {}) };
}

/** Hash of everything besides the text that shapes a take: voice, reference clip and audio settings. */
export function settingsKey(voice, settings, voiceRefBytes = null) {
  const audio = Object.fromEntries(AUDIO_SETTINGS.map((k) => [k, settings[k]]));
  const ref = voiceRefBytes ? createHash('sha256').update(voiceRefBytes).digest('hex') : 'builtin';
  return sha(`${voice}\n${ref}\n${JSON.stringify(audio)}`);
}

/** exaggeration + cfg_weight of one segment: its mood register, or the video-wide settings when moods are off. */
export function segmentVoiceSettings(settings, directions) {
  if (settings.moods === false) return { register: null, exaggeration: settings.exaggeration, cfg_weight: settings.cfg_weight, unknown: [] };
  return moodFor(directions);
}

/** Per-segment seed: stable across runs and independent of which segments are redone. */
export function segmentSeed(base, segmentId) {
  return (base + Number.parseInt(sha(segmentId).slice(0, 6), 16)) % 2 ** 31;
}

function checkSetup() {
  if (!existsSync(VENV_PYTHON)) {
    throw new Error(`Chatterbox venv not found at ${VENV_PYTHON} — create it as described in video/engine/README.md («Voz: Chatterbox»)`);
  }
}

/** Runs the Python worker on a job file; the worker writes <id>.wav + <id>.json into outDir. */
function runWorker(jobFile, log) {
  const res = spawnSync(VENV_PYTHON, ['-X', 'utf8', WORKER, '--jobs', jobFile], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    windowsHide: true,
    env: {
      ...process.env,
      HF_HOME: process.env.HF_HOME ?? path.join(ENGINE_DIR, '.cache', 'huggingface'),
      HF_HUB_DISABLE_SYMLINKS_WARNING: '1', // exFAT (D:) has no symlinks; the hub copies instead
    },
  });
  if (res.error) throw new Error(`cannot run the Chatterbox worker: ${res.error.message}`);
  if (res.status !== 0) throw new Error(`the Chatterbox worker failed (exit ${res.status})`);
  log.log('');
}

/** Encodes a worker WAV to a CBR MP3 clip. Returns its size in bytes. */
function encodeClip(wav, outFile) {
  const tmpOut = `${outFile}.tmp.mp3`;
  const res = runRemotion(
    ['ffmpeg', '-v', 'error', '-y', '-i', wav, '-ac', '1', '-ar', String(SAMPLE_RATE),
      '-c:a', 'libmp3lame', '-b:a', `${BITRATE_KBPS}k`, '-write_xing', '0', '-id3v2_version', '0', tmpOut],
    { capture: true },
  );
  if (res.status !== 0) throw new Error(`ffmpeg failed for ${wav}: ${res.stderr}`);
  rmSync(outFile, { force: true });
  writeFileSync(outFile, readFileSync(tmpOut));
  rmSync(tmpOut, { force: true });
  return statSync(outFile).size;
}

function jobFileFor(name, { pack, voiceRef, settings, jobs, outDir }) {
  mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${name}.jobs.json`);
  writeFileSync(
    file,
    `${JSON.stringify(
      {
        pack,
        voiceRef,
        language: settings.language,
        exaggeration: settings.exaggeration,
        cfgWeight: settings.cfg_weight,
        temperature: settings.temperature,
        asrModel: settings.asr_model,
        minScore: settings.min_score,
        attempts: settings.attempts,
        outDir,
        jobs,
      },
      null,
      1,
    )}\n`,
  );
  return file;
}

/** Warning text when a Chatterbox narration resolves to the edge-tts lexicon (its respellings read worse), else null. */
export function edgeLexiconWarning(lexiconPath, defaultLexiconPath = PATHS.lexicon) {
  return lexiconPath === defaultLexiconPath
    ? 'this Chatterbox narration uses lexicon.json, the edge-tts respellings («jash», «jóuld») that Chatterbox reads worse — add "lexicon": "lexicon.chatterbox.json" (acronyms only) to narration.json'
    : null;
}

export function synthesizeNarration({ only = null, force = false, log = console } = {}) {
  checkSetup();
  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const lexWarn = edgeLexiconWarning(sources.paths.lexicon);
  if (lexWarn) log.warn(`  aviso: ${lexWarn}`);
  const analysis = analyzeNarration(sources, profileFor(MANIFEST.profile));
  reportOrThrow(analysis, log);
  const { voice, rate, pitch } = analysis.voice;
  if (!isChatterboxVoice(voice)) throw new Error(`narration.voice is "${voice}", not a Chatterbox voice (chatterbox/<es-es|mtl>/<voice>)`);
  const { pack, voiceRef } = parseVoice(voice);
  if (voiceRef && !existsSync(voiceRef)) throw new Error(`reference clip not found: ${voiceRef}`);
  const settings = settingsFor(sources.narration);
  const refBytes = voiceRef ? readFileSync(voiceRef) : null;
  const moodOf = new Map(analysis.segments.map((seg) => [seg.id, segmentVoiceSettings(settings, seg.parsed.directions)]));
  const segKey = (seg) => {
    const m = moodOf.get(seg.id);
    return settingsKey(voice, { ...settings, exaggeration: m.exaggeration, cfg_weight: m.cfg_weight }, refBytes);
  };
  const unknown = analysis.segments.flatMap((seg) => moodOf.get(seg.id).unknown.map((w) => `${w} (${seg.id})`));
  if (unknown.length) log.warn(`  aviso: directions with no Chatterbox register, read as neutral: ${unknown.join(', ')}`);

  const segments = analysis.segments.filter((seg) => !only || only.includes(seg.id));
  if (only) {
    const unknown = only.filter((id) => !analysis.segments.some((seg) => seg.id === id));
    if (unknown.length) throw new Error(`--only names unknown segments: ${unknown.join(', ')}`);
  }
  const todo = segments.filter((seg) => {
    if (force) return true;
    const jsonPath = path.join(PATHS.ttsDir, `${seg.id}.json`);
    const mp3Path = path.join(PATHS.voiceDir, `${seg.id}.mp3`);
    if (!existsSync(jsonPath) || !existsSync(mp3Path)) return true;
    try {
      const rec = JSON.parse(readFileSync(jsonPath, 'utf8'));
      const spoken = spokenForVoice(voice, seg.parsed);
      return !(rec.key === ttsKey(voice, rate, pitch, spoken) && rec.settingsKey === segKey(seg) && rec.bytes === statSync(mp3Path).size);
    } catch {
      return true;
    }
  });
  log.log(`tts-chatterbox: ${segments.length} segments — ${segments.length - todo.length} cached, ${todo.length} to synthesise (${pack}, ${voiceRef ? path.basename(voiceRef) : 'built-in voice'})`);
  if (!todo.length) return;

  rmSync(WORK_DIR, { recursive: true, force: true });
  const jobs = todo.map((seg) => {
    const m = moodOf.get(seg.id);
    return { id: seg.id, text: spokenForVoice(voice, seg.parsed), seed: segmentSeed(settings.seed, seg.id), exaggeration: m.exaggeration, cfgWeight: m.cfg_weight };
  });
  runWorker(jobFileFor('narration', { pack, voiceRef, settings, jobs, outDir: WORK_DIR }), log);

  mkdirSync(PATHS.voiceDir, { recursive: true });
  mkdirSync(PATHS.ttsDir, { recursive: true });
  const weak = [];
  for (const seg of todo) {
    const result = JSON.parse(readFileSync(path.join(WORK_DIR, `${seg.id}.json`), 'utf8'));
    const mp3Path = path.join(PATHS.voiceDir, `${seg.id}.mp3`);
    const bytes = encodeClip(path.join(WORK_DIR, `${seg.id}.wav`), mp3Path);
    const spoken = spokenForVoice(voice, seg.parsed);
    const record = {
      provider: 'chatterbox',
      key: ttsKey(voice, rate, pitch, spoken),
      settingsKey: segKey(seg),
      voice,
      rate,
      pitch,
      settings: { ...settings, exaggeration: moodOf.get(seg.id).exaggeration, cfg_weight: moodOf.get(seg.id).cfg_weight },
      register: moodOf.get(seg.id).register,
      spoken,
      bytes,
      bitrateKbps: BITRATE_KBPS,
      durationMs: Math.round(result.durationMs),
      seed: result.seed,
      takes: result.takes,
      asr: { model: settings.asr_model, text: result.asrText, score: result.score },
      words: result.words.map((w) => ({ text: w.text, offsetMs: Math.round(w.startMs), durationMs: Math.max(1, Math.round(w.endMs - w.startMs)) })),
    };
    writeFileAtomic(path.join(PATHS.ttsDir, `${seg.id}.json`), `${JSON.stringify(record, null, 1)}\n`);
    if (result.score < settings.min_score) weak.push(`${seg.id} (${result.score.toFixed(2)})`);
  }
  if (weak.length) {
    log.warn(`  aviso: best take still differs from the script (score < ${settings.min_score}): ${weak.join(', ')} — listen to them, or rerun with --only <id> --force`);
  }
}

/**
 * Lexicon for neural voices: acronyms only. The edge-tts lexicon respells English terms
 * ("jash", "jóuld"), which a model trained on real text reads worse, not better.
 */
export function neuralLexicon() {
  for (const name of ['lexicon.chatterbox.json', 'lexicon.elevenlabs.json']) {
    const file = path.join(path.dirname(PATHS.narration), name);
    if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  }
  return {};
}

/**
 * One take per voice with the neural (acronyms-only) lexicon and, when --respelled is
 * given, a second take of the same text with the video's lexicon.json respellings
 * («jash», «jóuld»), so both can be compared by ear. The model loads once per voice.
 */
export function audition({ voices = ['mtl/default', 'es-es/default'], respelled = false, log = console } = {}) {
  checkSetup();
  const variants = [{ suffix: '', text: parseSegmentText(AUDITION_TEXT, neuralLexicon()).spoken }];
  if (respelled && existsSync(PATHS.lexicon)) {
    const text = parseSegmentText(AUDITION_TEXT, JSON.parse(readFileSync(PATHS.lexicon, 'utf8'))).spoken;
    if (text !== variants[0].text) variants.push({ suffix: '-lexico', text });
  }
  const dir = path.join(PATHS.auditionDir, 'chatterbox');
  mkdirSync(PATHS.auditionDir, { recursive: true });
  writeFileSync(path.join(PATHS.auditionDir, 'chatterbox-audition.txt'), `${variants.map((v) => `${v.suffix || '(sin léxico)'}: ${v.text}`).join('\n')}\n`, 'utf8');
  for (const v of voices) {
    const { pack, voiceName, voiceRef } = parseVoice(`chatterbox/${v}`);
    const name = `${pack}-${voiceName}`;
    const jobs = variants.map((x) => ({ id: `${name}${x.suffix}`, text: x.text, seed: DEFAULT_SETTINGS.seed }));
    runWorker(jobFileFor(name, { pack, voiceRef, settings: DEFAULT_SETTINGS, jobs, outDir: dir }), log);
    for (const job of jobs) {
      const out = path.join(PATHS.auditionDir, `chatterbox-${job.id}.mp3`);
      encodeClip(path.join(dir, `${job.id}.wav`), out);
      const r = JSON.parse(readFileSync(path.join(dir, `${job.id}.json`), 'utf8'));
      log.log(`  ${job.id}: ${out} (${(r.durationMs / 1000).toFixed(1)} s, script match ${r.score.toFixed(2)})`);
    }
  }
}

/** The §2.2 sample paragraph of the spec: the same text in every register, to judge them by ear. */
export const MOOD_AUDITION_TEXT =
  '¿Cómo llegan los logs al SIEM? Depende de quién hable. Servidores y estaciones llevan un agente: un pequeño programa que lo reenvía todo. ' +
  'Firewalls y switches no suelen admitir agentes, así que hablan syslog. La nube contesta por API. ' +
  '¿Y los routers? Esos no te cuentan qué se dijo, solo quién habló con quién y cuánto: NetFlow.';

/** One take of MOOD_AUDITION_TEXT per register -> .audition/chatterbox-mood-<register>.mp3. */
export function moodAudition({ voice = 'es-es/default', log = console } = {}) {
  checkSetup();
  const { pack, voiceName, voiceRef } = parseVoice(`chatterbox/${voice}`);
  const text = parseSegmentText(MOOD_AUDITION_TEXT, neuralLexicon()).spoken;
  const dir = path.join(PATHS.auditionDir, 'chatterbox');
  mkdirSync(PATHS.auditionDir, { recursive: true });
  const jobs = Object.entries(REGISTERS).map(([register, r]) => ({
    id: `mood-${register}`,
    text,
    seed: DEFAULT_SETTINGS.seed,
    exaggeration: r.exaggeration,
    cfgWeight: r.cfg_weight,
  }));
  runWorker(jobFileFor(`moods-${pack}-${voiceName}`, { pack, voiceRef, settings: DEFAULT_SETTINGS, jobs, outDir: dir }), log);
  for (const job of jobs) {
    const out = path.join(PATHS.auditionDir, `chatterbox-${job.id}.mp3`);
    encodeClip(path.join(dir, `${job.id}.wav`), out);
    const r = JSON.parse(readFileSync(path.join(dir, `${job.id}.json`), 'utf8'));
    log.log(`  ${job.id}: ${out} (${(r.durationMs / 1000).toFixed(1)} s, script match ${r.score.toFixed(2)})`);
  }
}

function main() {
  const { values } = parseArgs({
    options: {
      video: { type: 'string' },
      only: { type: 'string' },
      force: { type: 'boolean', default: false },
      audition: { type: 'boolean', default: false },
      voices: { type: 'string' },
      respelled: { type: 'boolean', default: false },
      moods: { type: 'boolean', default: false },
    },
  });
  const list = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);
  if (values.moods) {
    moodAudition(values.voices ? { voice: list(values.voices)[0] } : {});
    return;
  }
  if (values.audition) {
    audition({ ...(values.voices ? { voices: list(values.voices) } : {}), respelled: values.respelled });
    return;
  }
  synthesizeNarration({ only: values.only ? list(values.only) : null, force: values.force });
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`tts-chatterbox: ${error.message}`);
    process.exit(1);
  }
}
