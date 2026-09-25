#!/usr/bin/env node
// ElevenLabs narration: one request per SCENE (continuous intonation and emotion;
// v3 has no request stitching), cut in the silences into per-segment clips.
// Writes the same files as tts.py, so build-timeline.mjs works unchanged:
//   public/voice/<segment>.mp3   (CBR 96 kbps mono, 24 kHz)
//   tts/<segment>.json           ({ key, voice, rate, pitch, spoken, bytes, bitrateKbps, durationMs, words, ... })
//
//   node video/siem/scripts/tts-elevenlabs.mjs [--scene s01-hook,s05-correlate] [--force]
//   node video/siem/scripts/tts-elevenlabs.mjs --audition --voices <id>,<id> [--model eleven_v3]
//
// Needs ELEVENLABS_API_KEY (repo-root .env.local is read automatically; never logged).
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { ElevenLabsError, listVoices, ttsWithTimestamps } from './lib/elevenlabs.mjs';
import { leadForSegment, pcmRange, planSceneCuts, wordsFromAlignment } from './lib/eleven-align.mjs';
import { analyzeNarration, isElevenLabsVoice, loadSources, reportOrThrow, spokenForVoice, ttsKey } from './lib/narration.mjs';
import { PATHS, isMainModule } from './lib/paths.mjs';
import { runRemotion, writeFileAtomic } from './lib/remotion.mjs';
import { parseSegmentText } from './lib/text.mjs';

const SAMPLE_RATE = 24000;
const BITRATE_KBPS = 96;
const TMP_DIR = path.join(PATHS.outDir, 'eleven-tmp');
/** Whole-scene takes, kept for listening (out/ is git-ignored). */
const TAKES_DIR = path.join(PATHS.outDir, 'eleven-takes');

/** Default voice settings; narration.json "elevenlabs" overrides any of them. */
export const DEFAULT_SETTINGS = {
  stability: 0.5, // v3: 0 = Creative, 0.5 = Natural, 1 = Robust
  similarity_boost: 0.75,
  style: 0,
  use_speaker_boost: true,
  speed: 1,
  seed: 20260925,
  language_code: undefined,
};

/** Spanish test paragraph with performance directions and the risky terms. */
export const AUDITION_TEXT =
  '<curious> Madrugada en la Autoridad Portuaria de Halden. Al SOC llegan [6.000|seis mil] alertas al día… ' +
  '<serious> y solo una importa. <tired> Es alert fatigue: el turno de noche cierra el [90 %|noventa por ciento] sin abrirlas. ' +
  '<intrigued> Pero entonces el SIEM encuentra algo: un inicio de sesión [a las 01:52|a la una y cincuenta y dos], ocho minutos antes de la salida. ' +
  '<warmly> Para el examen: NetFlow es metadato, y la fatiga se cura con alert tuning.';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

/** voice "elevenlabs/<model>/<voice_id>" -> { model, voiceId } */
export function parseVoice(voice) {
  const [, model, voiceId] = voice.split('/');
  return { model, voiceId };
}

function settingsFor(narration) {
  return { ...DEFAULT_SETTINGS, ...(narration.elevenlabs ?? {}) };
}

function voiceSettingsBody(s) {
  return {
    stability: s.stability,
    similarity_boost: s.similarity_boost,
    style: s.style,
    use_speaker_boost: s.use_speaker_boost,
    speed: s.speed,
  };
}

/** ElevenLabs call with retries on rate limits, 5xx and network errors. */
async function synthesize(args, label, log) {
  const waits = [2000, 4000, 8000, 16000];
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await ttsWithTimestamps(args);
    } catch (error) {
      const retryable = !(error instanceof ElevenLabsError) || error.status === 429 || error.status >= 500;
      if (!retryable || attempt >= waits.length) throw error;
      const wait = waits[attempt] + Math.round(Math.random() * 500);
      log.warn(`  ${label}: ${error.message} — retrying in ${(wait / 1000).toFixed(1)} s`);
      await sleep(wait);
    }
  }
}

/** Gets 16-bit mono PCM at SAMPLE_RATE for `text`, falling back to MP3 + decode if PCM is not allowed. */
async function synthesizePcm(args, label, log) {
  try {
    const r = await synthesize({ ...args, outputFormat: `pcm_${SAMPLE_RATE}` }, label, log);
    return { ...r, pcm: r.audio };
  } catch (error) {
    if (!(error instanceof ElevenLabsError) || ![400, 403, 422].includes(error.status) || !/format|pcm|tier|subscription/i.test(error.message)) throw error;
    log.warn(`  ${label}: PCM output not available on this plan — falling back to MP3 and decoding`);
    const r = await synthesize({ ...args, outputFormat: 'mp3_44100_128' }, label, log);
    mkdirSync(TMP_DIR, { recursive: true });
    const mp3 = path.join(TMP_DIR, `${label}.mp3`);
    const raw = path.join(TMP_DIR, `${label}.pcm`);
    writeFileSync(mp3, r.audio);
    const res = runRemotion(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', String(SAMPLE_RATE), raw], { capture: true });
    if (res.status !== 0) throw new Error(`ffmpeg could not decode the MP3 take: ${res.stderr}`);
    return { ...r, pcm: readFileSync(raw) };
  }
}

/** Encodes a PCM slice to a CBR MP3 clip. Returns its size in bytes. */
function encodeClip(pcmSlice, outFile, id) {
  mkdirSync(TMP_DIR, { recursive: true });
  const raw = path.join(TMP_DIR, `${id}.pcm`);
  writeFileSync(raw, pcmSlice);
  const tmpOut = `${outFile}.tmp.mp3`;
  const res = runRemotion(
    ['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', raw,
      '-c:a', 'libmp3lame', '-b:a', `${BITRATE_KBPS}k`, '-write_xing', '0', '-id3v2_version', '0', tmpOut],
    { capture: true },
  );
  if (res.status !== 0) throw new Error(`ffmpeg failed for ${id}: ${res.stderr}`);
  rmSync(outFile, { force: true });
  writeFileSync(outFile, readFileSync(tmpOut));
  rmSync(tmpOut, { force: true });
  return statSync(outFile).size;
}

export async function synthesizeNarration({ scenes: onlyScenes = null, force = false, log = console } = {}) {
  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const analysis = analyzeNarration(sources);
  reportOrThrow(analysis, log);
  const { voice, rate, pitch } = analysis.voice;
  if (!isElevenLabsVoice(voice)) throw new Error(`narration.voice is "${voice}", not an ElevenLabs voice (elevenlabs/<model>/<voice_id>)`);
  const { model, voiceId } = parseVoice(voice);
  const settings = settingsFor(sources.narration);
  mkdirSync(PATHS.voiceDir, { recursive: true });
  mkdirSync(PATHS.ttsDir, { recursive: true });

  const failed = [];
  let chars = 0;
  for (const { scene, segments } of analysis.scenes) {
    if (onlyScenes && !onlyScenes.includes(scene.id)) continue;
    const sceneText = segments.map((seg) => spokenForVoice(voice, seg.parsed)).join('\n');
    const sceneKey = sha(`${voice}\n${JSON.stringify(settings)}\n${sceneText}`);
    const cached = segments.every((seg) => {
      const jsonPath = path.join(PATHS.ttsDir, `${seg.id}.json`);
      if (!existsSync(jsonPath) || !existsSync(path.join(PATHS.voiceDir, `${seg.id}.mp3`))) return false;
      try {
        return JSON.parse(readFileSync(jsonPath, 'utf8')).sceneKey === sceneKey;
      } catch {
        return false;
      }
    });
    if (cached && !force) {
      log.log(`  ${scene.id}: cached (${segments.length} clips)`);
      continue;
    }
    try {
      const take = await synthesizePcm(
        {
          voiceId,
          modelId: model,
          text: sceneText,
          voiceSettings: voiceSettingsBody(settings),
          seed: settings.seed,
          languageCode: settings.language_code,
        },
        scene.id,
        log,
      );
      chars += sceneText.length;
      const totalMs = (take.pcm.length / 2 / SAMPLE_RATE) * 1000;
      const words = wordsFromAlignment(take.alignment);
      const plan = planSceneCuts({
        segments: segments.map((seg) => ({ id: seg.id, tokens: seg.parsed.spokenTokens, leadMs: leadForSegment(spokenForVoice(voice, seg.parsed)) })),
        words,
        totalMs,
      });
      mkdirSync(TAKES_DIR, { recursive: true });
      encodeClip(take.pcm, path.join(TAKES_DIR, `${scene.id}.mp3`), `${scene.id}-take`);
      if (plan.mismatches.length) log.warn(`  ${scene.id}: ${plan.mismatches.length} word(s) differ from the script: ${plan.mismatches.slice(0, 4).join('; ')}`);
      for (const clip of plan.segments) {
        const seg = segments.find((s) => s.id === clip.id);
        const [a, b] = pcmRange(clip.clipStartMs, clip.clipEndMs, SAMPLE_RATE);
        const mp3Path = path.join(PATHS.voiceDir, `${seg.id}.mp3`);
        const bytes = encodeClip(take.pcm.subarray(a, b), mp3Path, seg.id);
        const spoken = spokenForVoice(voice, seg.parsed);
        const record = {
          provider: 'elevenlabs',
          key: ttsKey(voice, rate, pitch, spoken),
          sceneKey,
          voice,
          rate,
          pitch,
          model,
          settings,
          spoken,
          bytes,
          bitrateKbps: BITRATE_KBPS,
          durationMs: Math.round(((b - a) / 2 / SAMPLE_RATE) * 1000),
          clipInSceneMs: [Math.round(clip.clipStartMs), Math.round(clip.clipEndMs)],
          requestId: take.requestId,
          words: clip.words.map((w) => ({ text: w.text, offsetMs: Math.round(w.offsetMs), durationMs: Math.round(w.durationMs) })),
        };
        writeFileAtomic(path.join(PATHS.ttsDir, `${seg.id}.json`), `${JSON.stringify(record, null, 1)}\n`);
      }
      log.log(`  ${scene.id}: ${(totalMs / 1000).toFixed(1)} s take, ${sceneText.length} chars -> ${plan.segments.length} clips`);
    } catch (error) {
      failed.push(scene.id);
      log.error(`  ${scene.id}: FAILED — ${error.message}`);
    }
  }
  rmSync(TMP_DIR, { recursive: true, force: true });
  log.log(`tts-elevenlabs: ${chars} characters synthesised this run`);
  if (failed.length) throw new Error(`scenes failed: ${failed.join(', ')}`);
}

export async function audition({ voices, model = 'eleven_v3', log = console }) {
  const lexiconPath = path.join(path.dirname(PATHS.narration), 'lexicon.elevenlabs.json');
  const lexicon = existsSync(lexiconPath) ? JSON.parse(readFileSync(lexiconPath, 'utf8')) : {};
  const parsed = parseSegmentText(AUDITION_TEXT, lexicon);
  const names = new Map((await listVoices()).map((v) => [v.voice_id, v.name]));
  mkdirSync(PATHS.auditionDir, { recursive: true });
  writeFileSync(path.join(PATHS.auditionDir, 'eleven-audition.txt'), `${parsed.display}\n\n${parsed.directedSpoken}\n`, 'utf8');
  for (const voiceId of voices) {
    const name = (names.get(voiceId) ?? voiceId).replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
    const r = await synthesize(
      { voiceId, modelId: model, text: parsed.directedSpoken, voiceSettings: voiceSettingsBody(DEFAULT_SETTINGS), seed: DEFAULT_SETTINGS.seed, outputFormat: 'mp3_44100_128' },
      name,
      log,
    );
    const file = path.join(PATHS.auditionDir, `eleven-${name}.mp3`);
    writeFileSync(file, r.audio);
    log.log(`  ${names.get(voiceId) ?? voiceId}: ${file} (${parsed.directedSpoken.length} chars)`);
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      scene: { type: 'string' },
      force: { type: 'boolean', default: false },
      audition: { type: 'boolean', default: false },
      voices: { type: 'string' },
      model: { type: 'string', default: 'eleven_v3' },
    },
  });
  if (values.audition) {
    if (!values.voices) throw new Error('--audition needs --voices <voice_id>,<voice_id>');
    await audition({ voices: values.voices.split(',').map((s) => s.trim()).filter(Boolean), model: values.model });
    return;
  }
  await synthesizeNarration({ scenes: values.scene ? values.scene.split(',').map((s) => s.trim()) : null, force: values.force });
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(`tts-elevenlabs: ${error.message}`);
    process.exit(1);
  });
}
