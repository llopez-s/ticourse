import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { TIMING, TRANSCRIPT_NOTICE, buildTimeline, captionsPathFor, formatJson } from '../build-timeline.mjs';
import { analyzeNarration, sourceHash, ttsKey } from './narration.mjs';
import { validateTimeline } from './validate-timeline.mjs';

const FIX = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const read = (f) => JSON.parse(readFileSync(path.join(FIX, f), 'utf8'));
const quiet = { warn: () => {}, log: () => {} };
const tmp = mkdtempSync(path.join(tmpdir(), 'siem-timeline-'));
after(() => rmSync(tmp, { recursive: true, force: true }));

/** Writes a narration variant and builds it in estimate mode without touching real outputs. */
async function buildVariant(mutate, name) {
  const narration = read('narration.mini.json');
  mutate(narration);
  const file = path.join(tmp, `${name}.json`);
  writeFileSync(file, JSON.stringify(narration));
  return buildTimeline({
    estimate: true,
    storyboard: path.join(FIX, 'storyboard.mini.json'),
    narration: file,
    lexicon: path.join(FIX, 'lexicon.mini.json'),
    write: false,
    log: quiet,
  });
}

test('estimate mode: the timeline satisfies the types.ts contract and the timing recipe', async () => {
  const { timeline, transcript } = await buildVariant(() => {}, 'ok');
  assert.deepEqual(validateTimeline(timeline), []);
  assert.equal(timeline.mode, 'estimate');
  assert.equal(timeline.voice, 'none');
  assert.ok(timeline.segments.every((s) => s.audio === null));

  const [s1, s2, s3] = timeline.scenes;
  assert.equal(s1.from, 0);
  const segs = timeline.segments;
  assert.equal(segs[0].from, TIMING.firstLead);
  assert.equal(segs[0].audioFrames, Math.ceil((segs[0].words.length / 2.5) * 30));
  assert.equal(segs[0].durationInFrames, segs[0].audioFrames + Math.round((600 * 30) / 1000));
  assert.equal(segs[1].from, segs[0].from + segs[0].durationInFrames);
  assert.equal(segs[1].durationInFrames, segs[1].audioFrames + Math.round((330 * 30) / 1000));
  assert.equal(s2.from, segs[1].from + segs[1].durationInFrames + TIMING.sceneTail);
  assert.equal(segs[2].from, s2.from + TIMING.lead);
  assert.equal(s3.from + s3.durationInFrames, timeline.durationInFrames, 'last scene runs to the end');
  const lastSeg = segs.at(-1);
  assert.equal(timeline.durationInFrames, lastSeg.from + lastSeg.durationInFrames + TIMING.sceneTail + TIMING.endHold);

  // Cues: on their word's first frame, or at the audio end for a trailing cue.
  const cue = (id) => timeline.cues.find((c) => c.id === id).frame;
  assert.equal(cue('flood'), segs[0].words[0].from);
  const needleWord = segs[0].words.find((w) => w.text === 'uno');
  assert.equal(cue('needle'), needleWord.from);
  assert.equal(cue('end'), lastSeg.from + lastSeg.audioFrames);

  // Exam card at its cue; think prompt after the audio.
  assert.deepEqual(timeline.exam, [
    { scene: 's01-hook', from: cue('needle'), durationInFrames: 150, objective: '4.4', text: 'Un SIEM agrega, normaliza, correlaciona y alerta' },
  ]);
  const thinkSeg = segs.find((s) => s.id === 's02-02');
  assert.deepEqual(timeline.think, [
    { scene: 's02-collect', from: thinkSeg.from + thinkSeg.audioFrames + 4, durationInFrames: Math.round(2.2 * 30) - 4, q: 'Con NetFlow, ¿sabes qué datos salieron?' },
  ]);
  assert.equal(thinkSeg.durationInFrames, thinkSeg.audioFrames + Math.round(0.5 * 30) + Math.round(2.2 * 30));

  // Every display token is timed, words spell the text, captions carry every word once.
  for (const s of segs) {
    assert.equal(s.words.map((w) => w.text).join(' '), s.text);
    for (const w of s.words) assert.ok(w.to >= w.from + 2);
  }
  const captionWords = timeline.captions.flatMap((p) => p.lines.flat().map((w) => w.text));
  assert.deepEqual(captionWords, segs.flatMap((s) => s.words.map((w) => w.text)));

  // Transcript format.
  const lines = transcript.split('\n');
  assert.equal(lines[0], 'SIEM en acción: del ruido a la evidencia', 'storyboard.title');
  assert.equal(lines[1], TRANSCRIPT_NOTICE);
  assert.equal(lines[2], '');
  assert.equal(lines[3], '[00:00] I · Qué es — Seis mil avisos, uno importa');
  assert.ok(lines[4].startsWith('Cada día llegan 6.000 avisos al SOC'));
  const paragraphs = lines.slice(3).filter((l) => l && !/^\[\d\d:\d\d\] /.test(l));
  assert.equal(paragraphs.length, 3);
  assert.ok(paragraphs.every((l) => !/[{}[\]|]/.test(l)), 'no markup in the transcript');
  assert.match(transcript, /\n\n\[00:\d\d\] II · Cómo funciona — Recoger\n/);
});

test('sourceHash covers the three sources and, in audio mode, the TTS keys', async () => {
  const { timeline } = await buildVariant(() => {}, 'hash');
  const narrationText = readFileSync(path.join(tmp, 'hash.json'), 'utf8');
  const sources = {
    storyboardText: readFileSync(path.join(FIX, 'storyboard.mini.json'), 'utf8'),
    narrationText,
    lexiconText: readFileSync(path.join(FIX, 'lexicon.mini.json'), 'utf8'),
  };
  assert.equal(timeline.sourceHash, sourceHash(sources));
  assert.notEqual(sourceHash(sources), sourceHash({ ...sources, lexiconText: `${sources.lexiconText} ` }));
  assert.notEqual(sourceHash(sources), sourceHash(sources, [['s01-01', ttsKey('v', '+0%', '+0Hz', 'hola')]]));
});

test('validation: missing, duplicate and unknown cues fail loudly', async () => {
  await assert.rejects(
    buildVariant((n) => {
      n.segments[0].text = n.segments[0].text.replace('{needle}', '');
      n.segments[1].text = n.segments[1].text.replace('{title}', '{title}{flood}{bogus}');
    }, 'cues'),
    (err) => /missing cue \{needle\}/.test(err.message) && /cue \{flood\} appears 2 times/.test(err.message) && /unknown cue \{bogus\}/.test(err.message),
  );
});

test('validation: unknown scene, out-of-order scenes and empty scenes fail', async () => {
  await assert.rejects(buildVariant((n) => (n.segments[0].scene = 's99-nope'), 'unknown'), /unknown scene/);
  await assert.rejects(
    buildVariant((n) => {
      const [a, b] = n.segments.splice(2, 2);
      n.segments.push(a, b);
    }, 'order'),
    /out of storyboard order/,
  );
  await assert.rejects(buildVariant((n) => (n.segments = n.segments.filter((s) => s.scene !== 's03-normalize')), 'empty'), /scene s03-normalize has no segments/);
});

test('validation: markup and exam/think format errors are reported with the segment id', async () => {
  await assert.rejects(buildVariant((n) => (n.segments[2].text += ' [roto'), 'markup'), /s02-01: Unbalanced markup/);
  await assert.rejects(buildVariant((n) => (n.segments[0].exam.text = 'x'.repeat(59)), 'examlen'), /exam\.text is 59 characters/);
  await assert.rejects(buildVariant((n) => (n.segments[0].exam.text = 'SIEM → alerta'), 'arrow'), /forbidden symbol/);
  await assert.rejects(buildVariant((n) => (n.segments[0].exam.at = 'title'), 'examat'), (err) => /leaves its scene/.test(err.message) || /not a cue/.test(err.message));
  await assert.rejects(buildVariant((n) => (n.segments[5].exam = { objective: '4.4', text: 'Resumen' }), 'examlast'), /closing scene/);
  await assert.rejects(buildVariant((n) => (n.segments[3].think.holdMs = 900), 'think'), /think\.holdMs/);
});

test('validation: an exam card must stay inside its scene', async () => {
  await assert.rejects(
    buildVariant((n) => {
      n.segments[0].exam.at = 'needle';
      n.segments[0].exam.holdSec = 6;
      n.segments[1].text = 'Por eso {title}existe el SIEM.';
    }, 'examout'),
    /leaves its scene/,
  );
});

test('analyzeNarration: style warnings do not block the build', () => {
  const storyboard = read('storyboard.mini.json');
  const narration = read('narration.mini.json');
  const res = analyzeNarration({ storyboard, narration, lexicon: read('lexicon.mini.json') });
  assert.deepEqual(res.errors, []);
  assert.ok(res.warnings.some((w) => /think prompts/.test(w)));
});

test('formatJson keeps flat objects on one line and round-trips', () => {
  const value = { a: [{ text: 'x', from: 1, to: 3 }], b: { c: [1, 2] }, d: null, e: [] };
  const text = formatJson(value);
  assert.deepEqual(JSON.parse(text), value);
  assert.match(text, /\{"text":"x","from":1,"to":3\}/);
});

const TTS2 = path.resolve(FIX, '..', '..', '..', 'out', 'test', 'tts2');
test('audio mode on the recorded 2-segment fixture (needs a prior tts.py run)', { skip: !existsSync(path.join(TTS2, 'voice', 's09-02.mp3')) && 'run tts.py on fixtures/tts2 first (see README)' }, async () => {
  const { timeline } = await buildTimeline({
    storyboard: path.join(FIX, 'tts2', 'storyboard.json'),
    narration: path.join(FIX, 'tts2', 'narration.json'),
    lexicon: path.join(FIX, 'tts2', 'lexicon.json'),
    ttsDir: path.join(TTS2, 'tts'),
    voiceDir: path.join(TTS2, 'voice'),
    write: false,
    log: quiet,
  });
  assert.deepEqual(validateTimeline(timeline), []);
  assert.equal(timeline.mode, 'audio');
  assert.deepEqual(timeline.segments.map((s) => s.audio), ['voice/s09-01.mp3', 'voice/s09-02.mp3']);
  for (const s of timeline.segments) {
    const tts = JSON.parse(readFileSync(path.join(TTS2, 'tts', `${s.id}.json`), 'utf8'));
    const lastEnd = Math.max(...tts.words.map((w) => w.offsetMs + w.durationMs));
    assert.equal(s.audioFrames, Math.ceil(((lastEnd + TIMING.speechTailMs) * 30) / 1000), 'trimmed to the last word + tail');
    assert.ok(s.words.at(-1).to <= s.from + s.audioFrames + 2);
  }
});

test('WebVTT: one cue per caption page, sitting next to the transcript', async () => {
  const { timeline, vtt } = await buildVariant(() => {}, 'vtt');
  const blocks = vtt.trim().split(/\n\n/);
  assert.equal(blocks[0], 'WEBVTT');
  assert.equal(blocks.length - 1, timeline.captions.length);
  const [id, timing, ...text] = blocks[1].split('\n');
  const page = timeline.captions[0];
  assert.equal(id, '1');
  const sec = (f) => (f / timeline.fps).toFixed(3).padStart(6, '0');
  assert.equal(timing, `00:00:${sec(page.from)} --> 00:00:${sec(page.to)}`);
  assert.deepEqual(text, page.lines.map((line) => line.map((w) => w.text).join(' ')));
  assert.equal(captionsPathFor('/x/videos/siem-blue-team-transcript.txt'), '/x/videos/siem-blue-team-captions.vtt');
  assert.equal(captionsPathFor('/tmp/other.txt'), '/tmp/other.txt.vtt');
});
