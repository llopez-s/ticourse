#!/usr/bin/env node
// Builds src/timeline.json (the only input the Remotion composition reads) and
// the plain-text transcript, from storyboard.json + narration.json + lexicon.json
// and — in audio mode — the synthesised voice (tts/<id>.json + public/voice/<id>.mp3).
//
//   node video/siem/scripts/build-timeline.mjs            # audio mode (needs audio.mjs first)
//   node video/siem/scripts/build-timeline.mjs --estimate # no audio: 2.5 words/s estimate
//
// Test overrides: --storyboard --narration --lexicon --tts-dir --voice-dir --out --transcript
// Voice overrides (must match what tts.py used): --voice --rate --pitch
// Audio trimming: each clip ends at its last word + --tail-ms (default 250); --full-audio keeps
// the ~1 s of silence edge-tts appends to every file.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { alignSpokenTokens, displayTimes, normalizeToken } from './lib/align.mjs';
import { paginate } from './lib/captions.mjs';
import { analyzeNarration, isElevenLabsVoice, loadSources, parseJsonText, reportOrThrow, sourceHash, spokenForVoice, ttsKey } from './lib/narration.mjs';
import { PATHS, isMainModule } from './lib/paths.mjs';
import { probeDurationsMs, writeFileAtomic } from './lib/remotion.mjs';
import { SCENE_IDS, validateTimeline } from './lib/validate-timeline.mjs';

export const TIMING = Object.freeze({
  firstLead: 45, // frames before the first scene's first segment
  lead: 12, // frames before every other scene's first segment
  sceneTail: 20, // frames after a scene's last segment (must stay >= TRANSITION_FRAMES)
  endHold: 75, // frames after the last scene (end card)
  transitionFrames: 15, // TRANSITION_FRAMES in src/timeline/load.ts
  thinkOffset: 4,
  estimateWordsPerSec: 2.5,
  speechTailMs: 250,
  probeToleranceMs: 150,
  examGap: 30,
  minWordFrames: 2,
  cueSpacing: 30,
  minTotalSec: 280,
  maxTotalSec: 340,
});

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
export const TRANSCRIPT_TITLE = 'SIEM en acción: del ruido a la evidencia';
export const TRANSCRIPT_NOTICE =
  'Simulación educativa con datos ficticios · IntelForge Academy — material independiente, no afiliado a CompTIA';
/** Credit line added to the transcript when the narration is voiced by ElevenLabs. */
export const ELEVENLABS_CREDIT = 'Voz: ElevenLabs (elevenlabs.io)';

const mmss = (frames, fps) => {
  const s = Math.floor(frames / fps);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/** Pretty JSON with flat objects (words, cues…) kept on one line. */
export function formatJson(value, indent = '') {
  const flat = (v) => v === null || typeof v !== 'object';
  if (flat(value)) return JSON.stringify(value);
  const items = Array.isArray(value) ? value : Object.values(value);
  if (items.every(flat)) return JSON.stringify(value);
  const inner = `${indent}  `;
  if (Array.isArray(value)) return `[\n${value.map((v) => inner + formatJson(v, inner)).join(',\n')}\n${indent}]`;
  return `{\n${Object.entries(value)
    .map(([k, v]) => `${inner}${JSON.stringify(k)}: ${formatJson(v, inner)}`)
    .join(',\n')}\n${indent}}`;
}

/** Reads and checks tts/<id>.json + voice/<id>.mp3 for every segment (audio mode). */
async function loadAudio(segments, voice, opts, errors, warnings) {
  const entries = [];
  for (const seg of segments) {
    const jsonPath = path.join(opts.ttsDir, `${seg.id}.json`);
    const mp3Path = path.join(opts.voiceDir, `${seg.id}.mp3`);
    if (!existsSync(jsonPath)) {
      errors.push(`${seg.id}: no TTS data at ${jsonPath} — run: node video/siem/scripts/audio.mjs`);
      continue;
    }
    const tts = parseJsonText(readFileSync(jsonPath, 'utf8'), jsonPath);
    const spoken = spokenForVoice(voice.voice, seg.parsed);
    const want = ttsKey(voice.voice, voice.rate, voice.pitch, spoken);
    if (tts.key !== want) {
      const why = [];
      if (tts.voice !== voice.voice) why.push(`voice ${tts.voice} vs ${voice.voice}`);
      if (tts.rate !== voice.rate) why.push(`rate ${tts.rate} vs ${voice.rate}`);
      if (tts.pitch !== voice.pitch) why.push(`pitch ${tts.pitch} vs ${voice.pitch}`);
      if (tts.spoken !== spoken) why.push('spoken text changed');
      errors.push(`${seg.id}: TTS is stale (${why.join('; ') || 'key mismatch'}) — run: node video/siem/scripts/audio.mjs`);
      continue;
    }
    if (!existsSync(mp3Path)) {
      errors.push(`${seg.id}: missing ${mp3Path}`);
      continue;
    }
    const bytes = statSync(mp3Path).size;
    if (bytes !== tts.bytes) {
      errors.push(`${seg.id}: ${mp3Path} has ${bytes} bytes, tts json says ${tts.bytes} — re-run audio.mjs with --force --only ${seg.id}`);
      continue;
    }
    if (!Array.isArray(tts.words) || !tts.words.length) {
      errors.push(`${seg.id}: tts json has no word boundaries`);
      continue;
    }
    entries.push({ seg, tts, mp3Path, bytes });
  }
  if (errors.length) return null;

  const probed = await probeDurationsMs(
    entries.map((e) => e.mp3Path),
    { cachePath: path.join(PATHS.outDir, '.ffprobe-cache.json') },
  );
  const audio = new Map();
  const trailing = [];
  for (const { seg, tts, mp3Path, bytes } of entries) {
    const probeMs = probed.get(mp3Path);
    // CBR MP3: edge-tts writes 48 kbps (6000 bytes/s); other providers record their bitrate.
    const cbrMs = (bytes * 8) / (tts.bitrateKbps ?? 48);
    const lastEnd = Math.max(...tts.words.map((w) => w.offsetMs + w.durationMs));
    if (Math.abs(probeMs - cbrMs) > TIMING.probeToleranceMs) {
      errors.push(`${seg.id}: ffprobe says ${probeMs.toFixed(0)} ms, the file size says ${cbrMs.toFixed(0)} ms`);
      continue;
    }
    if (lastEnd > probeMs + TIMING.probeToleranceMs) {
      errors.push(`${seg.id}: last word ends at ${lastEnd.toFixed(0)} ms, after the audio (${probeMs.toFixed(0)} ms)`);
      continue;
    }
    trailing.push(probeMs - lastEnd);
    const durationMs = opts.fullAudio ? probeMs : Math.min(probeMs, lastEnd + opts.tailMs);
    const spokenTimes = alignSpokenTokens(seg.parsed.spokenTokens, tts.words, { totalMs: lastEnd });
    const content = seg.parsed.spokenTokens.filter((t) => normalizeToken(t)).length;
    const unmatched = spokenTimes.filter((t, k) => !t.matched && normalizeToken(seg.parsed.spokenTokens[k])).length;
    if (content && unmatched / content > 0.15) {
      warnings.push(`${seg.id}: ${unmatched}/${content} spoken words had no matching boundary (times interpolated)`);
    }
    audio.set(seg.id, { durationMs, words: displayTimes(seg.parsed.displayTokens, spokenTimes), probeMs });
  }
  if (trailing.length) {
    const avg = trailing.reduce((a, b) => a + b, 0) / trailing.length;
    audio.trailingNote = `${isElevenLabsVoice(voice.voice) ? 'elevenlabs' : 'edge-tts'} trailing silence: avg ${avg.toFixed(0)} ms per clip — ${opts.fullAudio ? 'kept (--full-audio)' : `trimmed to last word + ${opts.tailMs} ms`}`;
  }
  return audio;
}

/** Estimate mode: 2.5 display words per second, words spread by character share. */
function estimateAudio(segments) {
  const audio = new Map();
  for (const seg of segments) {
    const tokens = seg.parsed.displayTokens;
    const durationMs = (tokens.length / TIMING.estimateWordsPerSec) * 1000;
    const weights = tokens.map((t) => Math.max(1, t.text.length));
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    const words = weights.map((w) => {
      const startMs = (durationMs * acc) / total;
      acc += w;
      return { startMs, endMs: (durationMs * acc) / total };
    });
    audio.set(seg.id, { durationMs, words });
  }
  return audio;
}

export async function buildTimeline(options = {}) {
  const opts = {
    estimate: false,
    storyboard: PATHS.storyboard,
    narration: PATHS.narration,
    lexicon: PATHS.lexicon,
    ttsDir: PATHS.ttsDir,
    voiceDir: PATHS.voiceDir,
    out: PATHS.timeline,
    transcript: PATHS.transcript,
    fullAudio: false,
    tailMs: TIMING.speechTailMs,
    write: true,
    log: console,
    ...options,
  };
  const log = opts.log;
  if (TIMING.sceneTail < TIMING.transitionFrames) throw new Error('sceneTail must be >= TRANSITION_FRAMES');

  const sources = loadSources(opts);
  const analysis = analyzeNarration(sources);
  if (sources.lexiconMissing) analysis.warnings.push(`no lexicon at ${opts.lexicon} — acronyms will be read as written`);
  reportOrThrow(analysis, log);
  const { storyboard } = sources;
  const voice = {
    voice: opts.voice ?? analysis.voice.voice,
    rate: opts.rate ?? analysis.voice.rate,
    pitch: opts.pitch ?? analysis.voice.pitch,
  };
  const fps = storyboard.fps ?? 30;
  const toFrames = (ms) => Math.round((ms * fps) / 1000);

  const errors = [];
  const warnings = [];
  const mode = opts.estimate ? 'estimate' : 'audio';
  const audio = opts.estimate ? estimateAudio(analysis.segments) : await loadAudio(analysis.segments, voice, opts, errors, warnings);
  if (errors.length) reportOrThrow({ errors, warnings }, log);

  // Timing
  const chapters = new Map((storyboard.chapters ?? []).map((c) => [c.n, c.title]));
  const scenes = [];
  const segments = [];
  const cues = [];
  const exam = [];
  const think = [];
  const segmentStarts = [];
  const allWords = [];
  const examSources = [];
  let t = 0;
  analysis.scenes.forEach(({ scene, segments: segs }, sceneIdx) => {
    const sceneFrom = t;
    t += sceneIdx === 0 ? TIMING.firstLead : TIMING.lead;
    const sceneCues = new Map();
    for (const seg of segs) {
      const a = audio.get(seg.id);
      const from = t;
      const audioFrames = Math.max(1, Math.ceil((a.durationMs * fps) / 1000));
      const pause = toFrames(seg.pauseMs);
      const thinkFrames = seg.think ? toFrames(seg.think.holdMs) : 0;
      if (seg.think && thinkFrames <= TIMING.thinkOffset) errors.push(`${seg.id}: think.holdMs too short`);
      const words = seg.parsed.displayTokens.map((tok, k) => {
        const wFrom = from + toFrames(a.words[k].startMs);
        const wTo = Math.max(from + toFrames(a.words[k].endMs), wFrom + TIMING.minWordFrames);
        if (!Number.isFinite(wFrom) || !Number.isFinite(wTo)) errors.push(`${seg.id}: word ${k} ("${tok.text}") is not timed`);
        return { text: tok.text, from: wFrom, to: wTo };
      });
      segmentStarts.push(allWords.length);
      allWords.push(...words);
      for (const cue of seg.parsed.cues) {
        const frame = cue.displayIndex < words.length ? words[cue.displayIndex].from : from + audioFrames;
        sceneCues.set(cue.id, frame);
        cues.push({ scene: scene.id, id: cue.id, frame });
      }
      const durationInFrames = audioFrames + pause + thinkFrames;
      segments.push({
        id: seg.id,
        scene: scene.id,
        text: seg.parsed.display,
        from,
        audioFrames,
        durationInFrames,
        audio: mode === 'audio' ? `voice/${seg.id}.mp3` : null,
        words,
      });
      if (seg.exam) examSources.push({ seg, from });
      if (seg.think) {
        think.push({
          scene: scene.id,
          from: from + audioFrames + TIMING.thinkOffset,
          durationInFrames: thinkFrames - TIMING.thinkOffset,
          q: seg.think.q,
        });
      }
      t += durationInFrames;
    }
    for (const { seg, from } of examSources.filter((e) => e.seg.scene === scene.id)) {
      exam.push({
        scene: scene.id,
        from: seg.exam.at ? sceneCues.get(seg.exam.at) : from,
        durationInFrames: Math.round(seg.exam.holdSec * fps),
        objective: seg.exam.objective,
        text: seg.exam.text,
      });
    }
    t += TIMING.sceneTail;
    scenes.push({
      id: scene.id,
      chapter: scene.chapter,
      chapterTitle: chapters.get(scene.chapter),
      title: scene.title,
      from: sceneFrom,
      durationInFrames: t - sceneFrom,
    });
  });
  // The end hold belongs to the last scene, so its Sequence (and end card) stays mounted to the end.
  t += TIMING.endHold;
  scenes[scenes.length - 1].durationInFrames = t - scenes[scenes.length - 1].from;
  const durationInFrames = t;

  // Timing validations
  const sceneOf = new Map(scenes.map((s) => [s.id, s]));
  exam.sort((x, y) => x.from - y.from);
  exam.forEach((e, k) => {
    const s = sceneOf.get(e.scene);
    if (e.from < s.from || e.from + e.durationInFrames > s.from + s.durationInFrames) {
      errors.push(
        `exam card in ${e.scene} (${e.from}–${e.from + e.durationInFrames}) leaves its scene (${s.from}–${s.from + s.durationInFrames}): use an earlier "at" cue or a shorter holdSec`,
      );
    }
    const prev = exam[k - 1];
    if (prev && e.from - (prev.from + prev.durationInFrames) < TIMING.examGap) {
      errors.push(`exam cards in ${prev.scene} and ${e.scene} are less than ${TIMING.examGap} frames apart`);
    }
  });
  for (const s of scenes) {
    const sc = cues.filter((c) => c.scene === s.id).sort((x, y) => x.frame - y.frame);
    for (let k = 1; k < sc.length; k += 1) {
      if (sc[k].frame - sc[k - 1].frame < TIMING.cueSpacing) {
        warnings.push(`${s.id}: cues {${sc[k - 1].id}} and {${sc[k].id}} are only ${sc[k].frame - sc[k - 1].frame} frames apart (aim for >= ${TIMING.cueSpacing})`);
      }
    }
  }
  const totalSec = durationInFrames / fps;
  if (totalSec < TIMING.minTotalSec || totalSec > TIMING.maxTotalSec) {
    warnings.push(`total length ${mmss(durationInFrames, fps)} (${totalSec.toFixed(1)} s) is outside 4:40–5:40`);
  }

  const captions = paginate(allWords, segmentStarts);

  let hash;
  if (mode === 'audio') {
    const keys = analysis.segments.map((seg) => [seg.id, ttsKey(voice.voice, voice.rate, voice.pitch, spokenForVoice(voice.voice, seg.parsed))]);
    hash = sourceHash(sources, keys);
  } else {
    hash = sourceHash(sources);
  }

  const timeline = {
    mode,
    sourceHash: hash,
    fps,
    width: storyboard.width ?? 1920,
    height: storyboard.height ?? 1080,
    durationInFrames,
    voice: mode === 'audio' ? voice.voice : 'none',
    scenes,
    segments,
    captions,
    cues,
    exam,
    think,
  };
  errors.push(...validateTimeline(timeline, { sceneIds: opts.sceneIds ?? SCENE_IDS }));
  reportOrThrow({ errors, warnings }, log);

  const transcript = buildTranscript(timeline, analysis);
  const vtt = buildVtt(timeline);
  if (opts.write) {
    writeFileAtomic(opts.out, `${formatJson(timeline)}\n`);
    writeFileAtomic(opts.transcript, transcript);
    writeFileAtomic(captionsPathFor(opts.transcript), vtt);
  }
  return { timeline, transcript, vtt, analysis, trailingNote: audio.trailingNote ?? null };
}

/** The WebVTT file lives next to the transcript (so test overrides redirect both). */
export function captionsPathFor(transcriptPath) {
  return /-transcript\.txt$/.test(transcriptPath)
    ? transcriptPath.replace(/-transcript\.txt$/, '-captions.vtt')
    : `${transcriptPath}.vtt`;
}

function vttTimestamp(frame, fps) {
  const ms = Math.round((frame * 1000) / fps);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms % 1000, 3)}`;
}

/**
 * WebVTT captions for the lesson player (<track> + the caption strip under the
 * video), one cue per burned-in caption page so both always show the same text.
 */
export function buildVtt(timeline) {
  const cues = timeline.captions.map((page, k) => {
    const text = page.lines.map((line) => line.map((w) => w.text).join(' ')).join('\n');
    return `${k + 1}\n${vttTimestamp(page.from, timeline.fps)} --> ${vttTimestamp(page.to, timeline.fps)}\n${text}`;
  });
  return `WEBVTT\n\n${cues.join('\n\n')}\n`;
}

export function buildTranscript(timeline, analysis) {
  const lines = [TRANSCRIPT_TITLE, TRANSCRIPT_NOTICE, ...(isElevenLabsVoice(timeline.voice) ? [ELEVENLABS_CREDIT] : []), ''];
  timeline.scenes.forEach((s, k) => {
    const text = timeline.segments
      .filter((seg) => seg.scene === s.id)
      .map((seg) => seg.text)
      .join(' ');
    lines.push(`[${mmss(s.from, timeline.fps)}] ${ROMAN[s.chapter]} · ${s.chapterTitle} — ${s.title}`);
    lines.push(text);
    if (k < timeline.scenes.length - 1) lines.push('');
  });
  return `${lines.join('\n')}\n`;
}

export function sceneTable(timeline, analysis) {
  const fps = timeline.fps;
  const rows = [['escena', 'inicio', 'dur s', 'obj s', 'Δ s', 'palabras', 'segs']];
  let words = 0;
  let budget = 0;
  for (const s of timeline.scenes) {
    const sb = analysis.scenes.find((x) => x.scene.id === s.id);
    const w = timeline.segments.filter((seg) => seg.scene === s.id).reduce((a, seg) => a + seg.words.length, 0);
    words += w;
    budget += sb.scene.wordBudget ?? 0;
    const dur = s.durationInFrames / fps;
    const target = sb.scene.targetSec ?? 0;
    rows.push([
      s.id,
      mmss(s.from, fps),
      dur.toFixed(1),
      String(target),
      `${dur - target >= 0 ? '+' : ''}${(dur - target).toFixed(1)}`,
      `${w}/${sb.scene.wordBudget ?? '?'}`,
      String(sb.segments.length),
    ]);
  }
  const total = timeline.durationInFrames / fps;
  rows.push(['TOTAL', mmss(timeline.durationInFrames, fps), total.toFixed(1), '', '', `${words}/${budget}`, String(timeline.segments.length)]);
  const widths = rows[0].map((_, c) => Math.max(...rows.map((r) => r[c].length)));
  return rows.map((r) => r.map((cell, c) => (c === 0 ? cell.padEnd(widths[c]) : cell.padStart(widths[c]))).join('  ')).join('\n');
}

async function main() {
  const { values } = parseArgs({
    options: {
      estimate: { type: 'boolean', default: false },
      storyboard: { type: 'string' },
      narration: { type: 'string' },
      lexicon: { type: 'string' },
      'tts-dir': { type: 'string' },
      'voice-dir': { type: 'string' },
      out: { type: 'string' },
      transcript: { type: 'string' },
      voice: { type: 'string' },
      rate: { type: 'string' },
      pitch: { type: 'string' },
      'full-audio': { type: 'boolean', default: false },
      'tail-ms': { type: 'string' },
      check: { type: 'boolean', default: false },
    },
    allowPositionals: false,
  });
  const abs = (p) => (p ? path.resolve(p) : undefined);
  const opts = Object.fromEntries(
    Object.entries({
      estimate: values.estimate,
      storyboard: abs(values.storyboard),
      narration: abs(values.narration),
      lexicon: abs(values.lexicon),
      ttsDir: abs(values['tts-dir']),
      voiceDir: abs(values['voice-dir']),
      out: abs(values.out),
      transcript: abs(values.transcript),
      voice: values.voice,
      rate: values.rate,
      pitch: values.pitch,
      fullAudio: values['full-audio'],
      tailMs: values['tail-ms'] !== undefined ? Number(values['tail-ms']) : undefined,
      write: !values.check,
    }).filter(([, v]) => v !== undefined),
  );
  const { timeline, analysis, trailingNote } = await buildTimeline(opts);
  console.log(sceneTable(timeline, analysis));
  if (trailingNote) console.log(trailingNote);
  console.log(
    `${timeline.mode} · ${timeline.segments.length} segmentos · ${timeline.captions.length} páginas de subtítulos · ${timeline.cues.length} cues · ${timeline.exam.length} tarjetas de examen · ${timeline.think.length} pausas para pensar`,
  );
  if (opts.write !== false) {
    console.log(`timeline   -> ${opts.out ?? PATHS.timeline}`);
    console.log(`transcript -> ${opts.transcript ?? PATHS.transcript}`);
    console.log(`captions   -> ${captionsPathFor(opts.transcript ?? PATHS.transcript)}`);
  } else {
    console.log('--check: nothing written');
  }
  const stale = existsSync(opts.ttsDir ?? PATHS.ttsDir)
    ? readdirSync(opts.ttsDir ?? PATHS.ttsDir).filter((f) => f.endsWith('.json') && !timeline.segments.some((s) => `${s.id}.json` === f))
    : [];
  if (!opts.estimate && stale.length) console.warn(`  aviso: TTS files for segments no longer in narration.json: ${stale.join(', ')}`);
}

if (isMainModule(import.meta.url)) {
  main().catch((err) => {
    console.error(`build-timeline: ${err.validation ? '' : 'error: '}${err.message}`);
    if (!err.validation && process.env.DEBUG) console.error(err.stack);
    process.exit(1);
  });
}
