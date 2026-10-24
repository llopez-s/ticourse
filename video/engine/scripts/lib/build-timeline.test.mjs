import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { adversaryClipId, adversaryKey } from './adversary.mjs';
import { TIMING, TRANSCRIPT_NOTICE, buildTimeline, buildTranscript, buildVtt, captionsPathFor, formatJson, loadAdversary, playbackMs } from '../build-timeline.mjs';
import { analyzeNarration, loadSources, sourceHash, ttsKey } from './narration.mjs';
import { SFX_DIR } from './paths.mjs';
import { INTERCEPT_TIMING, voicedHoldFrames } from './sfx.mjs';
import { validateTimeline } from './validate-timeline.mjs';

const FIX = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const read = (f) => JSON.parse(readFileSync(path.join(FIX, f), 'utf8'));
const quiet = { warn: () => {}, log: () => {} };
const tmp = mkdtempSync(path.join(tmpdir(), 'siem-timeline-'));
after(() => rmSync(tmp, { recursive: true, force: true }));

/** Writes a narration variant and builds it in estimate mode without touching real outputs. */
async function buildVariant(mutate, name, extra = {}) {
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
    ...extra,
  });
}

test('estimate mode: the timeline satisfies the types.ts contract and the timing recipe', async () => {
  const { timeline, transcript } = await buildVariant(() => {}, 'ok');
  assert.deepEqual(validateTimeline(timeline), []);
  assert.equal('intercept' in timeline, false, 'no intercept key without intercepted messages');
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

test('sourceHash: the sound library only counts when narration.json has "sfx", and only through loadSources', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'sfxlib-hash-'));
  writeFileSync(path.join(dir, 'sfx.json'), JSON.stringify({ sampleRate: 44100, sounds: {} }));
  const base = { storyboard: path.join(FIX, 'storyboard.mini.json'), narration: path.join(FIX, 'narration.mini.json'), lexicon: path.join(FIX, 'lexicon.mini.json') };

  const without = loadSources(base);
  assert.equal(without.sfxText, null, 'no "sfx" key: the library never enters the hash');

  const withSfxNarration = read('narration.mini.json');
  withSfxNarration.sfx = {};
  const narrationFile = path.join(tmp, 'sfx-hash.json');
  writeFileSync(narrationFile, JSON.stringify(withSfxNarration));
  const withSfx = loadSources({ ...base, narration: narrationFile, sfxDir: dir });
  assert.equal(withSfx.sfxText, readFileSync(path.join(dir, 'sfx.json'), 'utf8'));
  assert.notEqual(sourceHash(withSfx), sourceHash(without), 'the same narration/storyboard/lexicon, but "sfx" pulls in the library');

  writeFileSync(path.join(dir, 'sfx.json'), JSON.stringify({ sampleRate: 44100, sounds: { x: 1 } }));
  const regenerated = loadSources({ ...base, narration: narrationFile, sfxDir: dir });
  assert.notEqual(sourceHash(regenerated), sourceHash(withSfx), 'a regenerated library (new bytes) changes the hash');

  const missingLib = loadSources({ ...base, narration: narrationFile, sfxDir: path.join(dir, 'nope') });
  assert.equal(missingLib.sfxText, '', 'the key is set but the library file is missing: sfxText is empty, not null');
  assert.notEqual(sourceHash(missingLib), sourceHash(without));

  rmSync(dir, { recursive: true, force: true });
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

test('examTiming "sentence-end": the card waits for the end of the sentence that holds its cue', async () => {
  const base = await buildVariant(() => {}, 'exam-cue');
  const late = await buildVariant((n) => (n.examTiming = 'sentence-end'), 'exam-sentence');
  const cueFrame = base.timeline.cues.find((c) => c.id === 'needle').frame;
  const verdad = late.timeline.segments[0].words.find((w) => w.text === 'verdad.');
  assert.equal(base.timeline.exam[0].from, cueFrame);
  assert.equal(late.timeline.exam[0].from, verdad.to); // «Solo uno importa de verdad.» is heard first
});

test('examTiming "sentence-end": a card that would leave its scene is pulled back, never before its cue', async () => {
  const { timeline } = await buildVariant((n) => {
    n.examTiming = 'sentence-end';
    delete n.segments[0].exam;
    n.segments[1].text = '{title}Veamos cómo convierte el ruido en evidencia. Lo hace en pasos.';
    n.segments[1].exam = { objective: '4.4', text: 'Un SIEM convierte el ruido en evidencia', at: 'title', holdSec: 4 };
  }, 'exam-pullback');
  const [card] = timeline.exam;
  const scene = timeline.scenes.find((s) => s.id === card.scene);
  const cue = timeline.cues.find((c) => c.id === 'title').frame;
  const evidencia = timeline.segments[1].words.find((w) => w.text === 'evidencia.');
  assert.equal(card.from + card.durationInFrames, scene.from + scene.durationInFrames - 1, JSON.stringify(card)); // pulled back to fit
  assert.ok(card.from > cue && card.from < evidencia.to, JSON.stringify({ card, cue, sentenceEnd: evidencia.to }));
});

test('examTiming: an unknown value stops the build', async () => {
  await assert.rejects(buildVariant((n) => (n.examTiming = 'later'), 'exam-bad'), /examTiming/);
});

test('a -yt video warns when its title cue comes after the first 12 seconds', async () => {
  const warned = [];
  const log = { warn: (m) => warned.push(m), log: () => {} };
  const pad = 'Hoy empezamos con calma, porque antes de nada conviene contar de dónde viene todo esto y por qué importa tanto en el trabajo diario de un equipo azul como el nuestro.';
  await buildVariant((n) => (n.segments[1].text = `${pad} {title}Veamos cómo convierte el ruido en evidencia.`), 'late-title', { profile: 'principal-yt', log });
  assert.ok(warned.some((w) => /title cue at .* after the first 12 s/.test(w)), warned.join('\n'));
  const early = [];
  await buildVariant((n) => (n.segments[0].text = '{flood}Seis mil avisos al día. Solo {needle}uno importa.'), 'early-title', {
    profile: 'principal-yt',
    log: { warn: (m) => early.push(m), log: () => {} },
  });
  assert.ok(!early.some((w) => /title cue/.test(w)), early.join('\n'));
});

test('captionsOnScreen: written (false) only for the YouTube profiles; the rest keep their timelines as they were', async () => {
  const quietYt = { profile: 'principal-yt', log: { warn: () => {}, log: () => {} } };
  const yt = await buildVariant(() => {}, 'yt-captions', quietYt);
  assert.equal(yt.timeline.captionsOnScreen, false);
  assert.ok(yt.timeline.captions.length > 0, 'the pages are still built: they become the VTT');
  const repo = await buildVariant(() => {}, 'repo-captions');
  assert.equal('captionsOnScreen' in repo.timeline, false);
  assert.deepEqual(validateTimeline({ ...repo.timeline, captionsOnScreen: true }, { sceneIds: repo.timeline.scenes.map((s) => s.id) }).filter((e) => /captionsOnScreen/.test(e)), ['timeline.captionsOnScreen: when present, false']);
});

test('simulationLabel: a video of real cases carries its own corner tag and notice; the rest are untouched', async () => {
  const label = 'Casos reales · análisis educativo';
  const plain = await buildVariant(() => {}, 'sim-plain');
  assert.equal('simulationLabel' in plain.timeline, false, 'no label, no key: other timelines stay byte-identical');
  assert.match(plain.transcript.split('\n')[1], /^Simulación educativa con datos ficticios · /);
  const real = await buildVariant(() => {}, 'sim-real', { simulationLabel: label });
  assert.equal(real.timeline.simulationLabel, label);
  assert.deepEqual(validateTimeline(real.timeline, { sceneIds: real.timeline.scenes.map((s) => s.id) }), []);
  const notice = real.transcript.split('\n')[1];
  assert.ok(notice.startsWith(`${label} · `), notice);
  assert.doesNotMatch(notice, /ficticios/);
  assert.deepEqual({ ...real.timeline, simulationLabel: undefined }, { ...plain.timeline, simulationLabel: undefined });
  assert.ok(validateTimeline({ ...real.timeline, simulationLabel: '' }, { sceneIds: real.timeline.scenes.map((s) => s.id) }).some((e) => /simulationLabel/.test(e)));
});

test('playbackMs: a recording plays until its voice really stops (+ tail), even when the ASR ends the last word early', () => {
  assert.equal(playbackMs({ probeMs: 5000, lastEnd: 4000, speechEndMs: 4600, tailMs: 250 }), 4850); // V4 s08-04 lost «siguiente»
  assert.equal(playbackMs({ probeMs: 5000, lastEnd: 4000, tailMs: 250 }), 4250); // TTS clips: as before
  assert.equal(playbackMs({ probeMs: 4700, lastEnd: 4000, speechEndMs: 4600, tailMs: 250 }), 4700); // never past the clip
  assert.equal(playbackMs({ probeMs: 5000, lastEnd: 4000, speechEndMs: 4600, tailMs: 250, fullAudio: true }), 5000);
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

const MSG = 'Borro el log del servidor y aquí no ha pasado nada.';

test('intercepted message: silent lead, card until the answer ends, transcript line', async () => {
  const { timeline, transcript } = await buildVariant(
    (n) => {
      n.segments[2].intercept = { text: MSG, holdMs: 3000 };
    },
    'intercept',
    { adversary: 'SILENT PAGER' },
  );
  assert.deepEqual(validateTimeline(timeline), []);
  const seg = timeline.segments.find((s) => s.id === 's02-01');
  const scene = timeline.scenes.find((s) => s.id === 's02-collect');
  assert.deepEqual(timeline.intercept, [
    { scene: 's02-collect', from: scene.from + TIMING.lead, durationInFrames: 90 + seg.durationInFrames, adversary: 'SILENT PAGER', text: MSG },
  ]);
  assert.equal(seg.from, scene.from + TIMING.lead + 90, 'the answer starts after 3000 ms of silence');
  assert.ok(transcript.includes(`[Mensaje interceptado · SILENT PAGER] «${MSG}» ${seg.text}`), transcript);
});

const ADV_CFG = { voice: 'sapi/Microsoft Pablo', rate: 0, fx: 'machine' };

/** A temp {ttsDir, voiceDir} pair with one adversary record + MP3 for segId, or none of the files given null. */
function adversaryFixture(segId, record) {
  const dir = mkdtempSync(path.join(tmpdir(), 'adversary-load-'));
  const ttsDir = path.join(dir, 'tts');
  const voiceDir = path.join(dir, 'voice');
  mkdirSync(ttsDir, { recursive: true });
  mkdirSync(voiceDir, { recursive: true });
  if (record) {
    const id = adversaryClipId(segId);
    writeFileSync(path.join(voiceDir, `${id}.mp3`), record.content ?? 'x'.repeat(record.bytes));
    writeFileSync(path.join(ttsDir, `${id}.json`), JSON.stringify({ key: record.key, bytes: record.bytes, durationMs: record.durationMs }));
  }
  return { dir, ttsDir, voiceDir };
}

test('loadAdversary: missing record, stale key, a byte mismatch and a good clip', () => {
  const seg = { id: 's03-04', intercept: { text: 'Hola.', holdMs: 3000 } };
  const id = adversaryClipId(seg.id);
  const key = adversaryKey(ADV_CFG, seg.intercept.text);

  {
    const { dir, ttsDir, voiceDir } = adversaryFixture(seg.id, null);
    const errors = [];
    const clips = loadAdversary([seg], ADV_CFG, { ttsDir, voiceDir }, errors);
    assert.equal(clips.size, 0);
    assert.match(errors[0], new RegExp(`no adversary voice \\(${id}\\)`));
    assert.match(errors[0], /tts-adversary\.mjs/);
    rmSync(dir, { recursive: true, force: true });
  }
  {
    const { dir, ttsDir, voiceDir } = adversaryFixture(seg.id, { key: 'stale-key', bytes: 3, durationMs: 4000 });
    const errors = [];
    loadAdversary([seg], ADV_CFG, { ttsDir, voiceDir }, errors);
    assert.match(errors[0], /stale/);
    rmSync(dir, { recursive: true, force: true });
  }
  {
    // record.bytes says 999, but the file adversaryFixture writes is only 3 bytes long: a real mismatch.
    const { dir, ttsDir, voiceDir } = adversaryFixture(seg.id, { key, bytes: 999, content: 'abc', durationMs: 4000 });
    const errors = [];
    loadAdversary([seg], ADV_CFG, { ttsDir, voiceDir }, errors);
    assert.match(errors[0], /does not match its record/);
    assert.match(errors[0], /--force/);
    rmSync(dir, { recursive: true, force: true });
  }
  {
    const { dir, ttsDir, voiceDir } = adversaryFixture(seg.id, { key, bytes: 3, durationMs: 4200 });
    const errors = [];
    const clips = loadAdversary([seg], ADV_CFG, { ttsDir, voiceDir }, errors);
    assert.deepEqual(errors, []);
    assert.deepEqual(clips.get(seg.id), { audio: `voice/${id}.mp3`, durationMs: 4200 });
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a voiced intercept grows the lead with voicedHoldFrames, beyond the written holdMs', async () => {
  const seg = { id: 's02-01' };
  const durationMs = 6000; // long enough that the voice, not the 3000 ms holdMs, sets the lead
  // opts.adversaryClips stands in for loadAdversary here (see build-timeline.mjs), so no tts/voice fixture is needed.
  const adversaryClips = new Map([[seg.id, { audio: `voice/${adversaryClipId(seg.id)}.mp3`, durationMs }]]);
  const { timeline } = await buildVariant(
    (n) => { n.segments[2].intercept = { text: 'Borro el log del servidor y aquí no ha pasado nada.', holdMs: 3000 }; },
    'intercept-voiced',
    { adversary: 'SILENT PAGER', adversaryClips },
  );

  const fps = timeline.fps;
  const voiceFrames = Math.ceil((durationMs * fps) / 1000);
  const writtenHold = Math.round((3000 * fps) / 1000);
  const expectedLead = voicedHoldFrames(writtenHold, voiceFrames);
  assert.ok(expectedLead > writtenHold, 'a 6 s clip needs more than the written 3000 ms hold');

  const answer = timeline.segments.find((s) => s.id === seg.id);
  const scene = timeline.scenes.find((s) => s.id === 's02-collect');
  const leadFrom = scene.from + TIMING.lead;
  assert.equal(answer.from, leadFrom + expectedLead, 'the answer waits for the voice-driven hold, not the written one');
  assert.deepEqual(timeline.intercept[0], {
    scene: 's02-collect',
    from: leadFrom,
    // The intercept spans the silent lead plus the answer's own duration (audio + pause; no think here).
    durationInFrames: expectedLead + answer.durationInFrames,
    adversary: 'SILENT PAGER',
    text: 'Borro el log del servidor y aquí no ha pasado nada.',
    audio: `voice/${adversaryClipId(seg.id)}.mp3`,
    audioFrom: leadFrom + INTERCEPT_TIMING.typeStart,
    audioFrames: voiceFrames,
  });
  assert.deepEqual(validateTimeline(timeline), []);
});

test('intercepted messages need an adversary in video.json', async () => {
  await assert.rejects(
    buildVariant((n) => {
      n.segments[2].intercept = { text: MSG, holdMs: 3000 };
    }, 'no-adversary', { adversary: null }),
    /no "adversary"/,
  );
});

test('sfx: without the key the timeline has none; with it, automatic sounds and key moments are placed', async () => {
  const plain = await buildVariant(() => {}, 'no-sfx');
  assert.equal('sfx' in plain.timeline, false);

  const { timeline } = await buildVariant((n) => { n.sfx = { flood: 'mail' }; }, 'sfx', { sfxDir: SFX_DIR });
  const cue = (id) => timeline.cues.find((c) => c.id === id).frame;
  const of = (sound) => timeline.sfx.filter((s) => s.sound === sound).map((s) => s.from);
  assert.deepEqual(of('mail'), [cue('flood')]);
  assert.deepEqual(of('ding'), timeline.exam.map((e) => e.from));
  const wipes = timeline.scenes.filter((s, k) => k > 0 && s.chapter !== timeline.scenes[k - 1].chapter).map((s) => s.from - TIMING.transitionFrames);
  assert.deepEqual(of('whoosh'), wipes);
  assert.deepEqual(validateTimeline(timeline), []);
});

test('sfx: an unknown cue or sound stops the build', async () => {
  await assert.rejects(buildVariant((n) => { n.sfx = { flod: 'mail' }; }, 'sfx-bad-cue', { sfxDir: SFX_DIR }), /flod/);
  await assert.rejects(buildVariant((n) => { n.sfx = { flood: 'siren' }; }, 'sfx-bad-sound', { sfxDir: SFX_DIR }), /siren/);
});

// --- exam questions (caso profiles) ---------------------------------------------------------------

const QUESTION = {
  objective: '4.4',
  scenario: 'Un SOC recibe seis mil avisos al día.',
  q: '¿Qué hace el SIEM con ellos?',
  options: ['Los borra', 'Los correlaciona', 'Los cifra', 'Los ignora'],
  answer: 1,
  trap: 2,
  why: 'Correlaciona eventos de varias fuentes',
  trapWhy: 'Cifrar no es analizar',
  revealAt: 'reveal',
  trapAt: 'title',
};

/** buildVariant on a storyboard whose first scene also requires the {reveal} cue. */
function buildQuestion(mutate, name, extra = {}) {
  const sb = read("storyboard.mini.json");
  sb.scenes[0].requiredCues.push("reveal");
  const file = path.join(tmp, name + "-storyboard.json");
  writeFileSync(file, JSON.stringify(sb));
  return buildVariant(mutate, name, { storyboard: file, ...extra });
}

/** Question on s01-01 (its exam card removed); the answer and the trap are cues of s01-02. */
function withQuestion(n, extra = {}) {
  delete n.segments[0].exam;
  n.segments[0].question = { ...QUESTION, ...extra };
  n.segments[1].text = '{reveal}Para encontrarlo, el equipo azul usa un SIEM. {title}Veamos cómo convierte el ruido en evidencia.';
}

const NO_QUESTIONS_VTT =
  'WEBVTT\n\n1\n00:00:01.400 --> 00:00:06.600\nCada día llegan 6.000 avisos al SOC\nde la Autoridad Portuaria de Halden.\n\n2\n00:00:06.600 --> 00:00:09.200\nSolo uno importa de verdad.\n\n3\n00:00:09.200 --> 00:00:12.200\nPara encontrarlo,\nel equipo azul usa un SIEM.\n\n4\n00:00:12.200 --> 00:00:16.100\nVeamos cómo convierte\nel ruido en evidencia.\n\n5\n00:00:16.600 --> 00:00:20.200\nPrimero recogemos registros de servidores,\nestaciones y cortafuegos,\n\n6\n00:00:20.200 --> 00:00:23.333\ntambién por «NetFlow»,\nlos metadatos de cada conexión.\n\n7\n00:00:23.333 --> 00:00:26.133\nTodo con la hora sincronizada por NTP,\n\n8\n00:00:26.133 --> 00:00:31.033\nporque sin un reloj común\nno hay línea temporal fiable.\n\n9\n00:00:33.900 --> 00:00:36.533\nCada fuente escribe a su manera:\n\n10\n00:00:36.533 --> 00:00:41.433\nuna línea en bruto no se parece\na otra de otro fabricante.\n\n11\n00:00:41.433 --> 00:00:49.133\nEl SIEM extrae los campos y guarda la hora\nen UTC, igual para todos, a las 01:52.\n';

const NO_QUESTIONS_TRANSCRIPT =
  'SIEM en acción: del ruido a la evidencia\nSimulación educativa con datos ficticios · IntelForge Academy — material independiente, no afiliado a CompTIA\n\n[00:00] I · Qué es — Seis mil avisos, uno importa\nCada día llegan 6.000 avisos al SOC de la Autoridad Portuaria de Halden. Solo uno importa de verdad. Para encontrarlo, el equipo azul usa un SIEM. Veamos cómo convierte el ruido en evidencia.\n\n[00:16] II · Cómo funciona — Recoger\nPrimero recogemos registros de servidores, estaciones y cortafuegos, también por «NetFlow», los metadatos de cada conexión. Todo con la hora sincronizada por NTP, porque sin un reloj común no hay línea temporal fiable.\n\n[00:33] II · Cómo funciona — Normalizar\nCada fuente escribe a su manera: una línea en bruto no se parece a otra de otro fabricante. El SIEM extrae los campos y guarda la hora en UTC, igual para todos, a las 01:52.\n';

test('questions: the segment holds a silent countdown after its audio', async () => {
  const { timeline } = await buildQuestion((n) => withQuestion(n), 'q-countdown');
  assert.deepEqual(validateTimeline(timeline), []);
  const seg = timeline.segments.find((s) => s.id === 's01-01');
  const [q] = timeline.questions;
  assert.equal(timeline.questions.length, 1);
  assert.equal(q.segment, 's01-01');
  assert.equal(q.scene, 's01-hook');
  assert.equal(q.from, seg.from);
  assert.equal(q.countdownFrom, seg.from + seg.audioFrames);
  assert.equal(q.countdownFrames, Math.round((5000 * 30) / 1000), 'countdownMs defaults to 5000');
  assert.equal(seg.durationInFrames, seg.audioFrames + Math.round((600 * 30) / 1000) + q.countdownFrames, 'the hold is part of the segment');
  assert.deepEqual(
    { objective: q.objective, options: q.options, answer: q.answer, trap: q.trap, why: q.why, trapWhy: q.trapWhy, q: q.q, scenario: q.scenario },
    { objective: '4.4', options: QUESTION.options, answer: 1, trap: 2, why: QUESTION.why, trapWhy: QUESTION.trapWhy, q: QUESTION.q, scenario: QUESTION.scenario },
  );
  for (const s of timeline.segments) assert.equal('question' in s, false, 'segments never carry the question');
  const custom = await buildQuestion((n) => withQuestion(n, { countdownMs: 6000 }), 'q-countdown-6');
  assert.equal(custom.timeline.questions[0].countdownFrames, 180);
});

test('questions: the card lasts until its scene ends and reveals on its cue', async () => {
  const { timeline } = await buildQuestion((n) => withQuestion(n), 'q-reveal');
  const [q] = timeline.questions;
  const scene = timeline.scenes.find((s) => s.id === q.scene);
  const cue = (id) => timeline.cues.find((c) => c.id === id).frame;
  assert.equal(q.from + q.durationInFrames, scene.from + scene.durationInFrames);
  assert.equal(q.revealFrame, cue('reveal'));
  assert.equal(q.trapFrame, cue('title'));
  assert.ok(q.trapFrame >= q.revealFrame);
  assert.ok(q.revealFrame >= q.countdownFrom + q.countdownFrames);
  const same = await buildQuestion((n) => withQuestion(n, { trapAt: undefined }), 'q-trap-default');
  assert.equal(same.timeline.questions[0].trapFrame, same.timeline.questions[0].revealFrame, 'trapAt defaults to revealAt');
});

test('questions: the badge follows the track like the exam cards', async () => {
  const gcti = await buildQuestion((n) => withQuestion(n, { objective: 'Intrusion Analysis' }), 'q-gcti', { track: 'gcti' });
  assert.equal(gcti.timeline.questions[0].badge, 'GCTI');
  const sp = await buildQuestion((n) => withQuestion(n), 'q-secplus', { track: 'secplus' });
  assert.equal('badge' in sp.timeline.questions[0], false, 'Security+ keeps the implicit SY0-701 badge');
});

test('questions: a reveal cue inside the countdown fails the build', async () => {
  // The builder places the countdown inside the question segment, so no narration can put a later cue
  // before it; the check is the validator's net for a timeline edited or built by hand.
  const { timeline } = await buildQuestion((n) => withQuestion(n), 'q-early');
  const early = structuredClone(timeline);
  early.questions[0].revealFrame = early.questions[0].countdownFrom + early.questions[0].countdownFrames - 1;
  early.questions[0].trapFrame = early.questions[0].revealFrame;
  assert.ok(validateTimeline(early).some((e) => /questions\[0\].*reveals before its countdown ends/.test(e)));
});

test('questions: an exam card in a question scene enters only after the trap is marked', async () => {
  const card = (at) => (n) => {
    withQuestion(n);
    n.segments[1].text += ' Paso a paso, con un ejemplo real de una noche cualquiera en el puerto de la ciudad.';
    n.segments[1].exam = { objective: '4.4', text: 'Un SIEM correlaciona eventos', at, holdSec: 4 };
  };
  await assert.rejects(buildQuestion(card('reveal'), 'q-exam-early'), /exam card in s01-hook enters before its question's trap is marked/);
  const { timeline } = await buildQuestion(card('title'), 'q-exam-late');
  assert.equal(timeline.exam.length, 1);
  assert.ok(timeline.exam[0].from >= timeline.questions[0].trapFrame);
});

test('questions: the VTT carries the four options while the countdown runs', async () => {
  const { timeline, vtt } = await buildQuestion((n) => withQuestion(n), 'q-vtt');
  const [q] = timeline.questions;
  const sec = (f) => (f / timeline.fps).toFixed(3).padStart(6, '0');
  const timing = `00:00:${sec(q.countdownFrom)} --> 00:00:${sec(q.countdownFrom + q.countdownFrames)}`;
  const blocks = vtt.trim().split(/\n\n/).slice(1);
  const block = blocks.find((b) => b.includes('A) '));
  assert.ok(block, vtt);
  const [id, when, ...text] = block.split('\n');
  assert.equal(when, timing);
  assert.deepEqual(text, ['A) Los borra', 'B) Los correlaciona', 'C) Los cifra', 'D) Los ignora']);
  assert.equal(blocks.length, timeline.captions.length + 1);
  assert.deepEqual(blocks.map((b) => b.split('\n')[0]), blocks.map((_, k) => String(k + 1)), 'cue numbers run 1..n');
  const starts = blocks.map((b) => b.split('\n')[1].split(' --> ')[0]);
  assert.deepEqual(starts, [...starts].sort(), 'cues stay in start order');
  assert.equal(id, String(blocks.indexOf(block) + 1));
});

test('questions: the transcript prints the question after its segment and the answer after the reveal segment', async () => {
  const { timeline, transcript } = await buildQuestion((n) => withQuestion(n), 'q-transcript');
  const [s1, s2] = timeline.segments;
  const asked = '[Pregunta de examen · SY0-701 4.4] Un SOC recibe seis mil avisos al día. ¿Qué hace el SIEM con ellos? A) Los borra B) Los correlaciona C) Los cifra D) Los ignora';
  const answered = 'Correcta: B — Correlaciona eventos de varias fuentes. Trampa: C — Cifrar no es analizar.';
  assert.ok(transcript.includes(`${s1.text} ${asked} ${s2.text} ${answered}`), transcript);
  const gcti = await buildQuestion((n) => withQuestion(n, { objective: 'Intrusion Analysis' }), 'q-transcript-gcti', { track: 'gcti' });
  assert.ok(gcti.transcript.includes('[Pregunta de examen · GCTI Intrusion Analysis] '), gcti.transcript);
});

test('questions: a timeline without questions has no "questions" key and the same VTT as before', async () => {
  const { timeline, vtt } = await buildVariant(() => {}, 'q-none');
  assert.equal('questions' in timeline, false);
  assert.equal(vtt, NO_QUESTIONS_VTT);
  assert.equal(buildVtt(timeline), NO_QUESTIONS_VTT);
});

test('questions: a transcript without questions is unchanged', async () => {
  const { timeline, transcript } = await buildVariant(() => {}, 'q-none-transcript');
  assert.equal(transcript, NO_QUESTIONS_TRANSCRIPT);
  assert.equal(buildTranscript(timeline, { title: 'SIEM en acción: del ruido a la evidencia', notice: TRANSCRIPT_NOTICE }), NO_QUESTIONS_TRANSCRIPT);
});

test('validateTimeline: a malformed question names questions[k]', async () => {
  const { timeline } = await buildQuestion((n) => withQuestion(n), 'q-shape');
  const mutate = (fn) => {
    const t = structuredClone(timeline);
    fn(t.questions[0]);
    return validateTimeline(t);
  };
  assert.deepEqual(mutate(() => {}), []);
  assert.ok(mutate((q) => (q.options = q.options.slice(0, 3))).some((e) => /questions\[0\]/.test(e)));
  assert.ok(mutate((q) => (q.revealFrame = timeline.durationInFrames + 5)).some((e) => /questions\[0\]/.test(e)));
  assert.ok(mutate((q) => (q.trapFrame = q.revealFrame - 1)).some((e) => /questions\[0\]/.test(e)));
  assert.ok(mutate((q) => (q.answer = 4)).some((e) => /questions\[0\]/.test(e)));
  assert.ok(mutate((q) => (q.trap = q.answer)).some((e) => /questions\[0\]/.test(e)));
  assert.ok(mutate((q) => (q.scene = 'nope')).some((e) => /questions\[0\]/.test(e)));
  assert.ok(mutate((q) => (q.extra = 1)).some((e) => /questions\[0\].*unexpected extra/.test(e)));
  const empty = structuredClone(timeline);
  empty.questions = [];
  assert.ok(validateTimeline(empty).some((e) => /timeline\.questions/.test(e)));
});

test('questions: warns when the explanations get less than 3 s on screen after the trap is marked', async () => {
  const run = async (name, extra, tail = false) => {
    const warned = [];
    const { timeline } = await buildQuestion((n) => {
      withQuestion(n, extra);
      if (tail) n.segments[1].text = '{reveal}Para encontrarlo, el equipo azul usa un SIEM. Veamos cómo convierte el ruido en evidencia. {title}';
    }, name, { log: { warn: (m) => warned.push(m), log: () => {} } });
    const [q] = timeline.questions;
    const left = (q.from + q.durationInFrames - q.trapFrame) / timeline.fps;
    return { left, warned: warned.filter((w) => /explanations stay on screen/.test(w)) };
  };
  // trap marked on the last cue of the scene: little time left
  const late = await run('q-explain-late', {}, true);
  assert.ok(late.left < 3, `fixture margin ${late.left}`);
  assert.deepEqual(late.warned.map((w) => w.trim().replace(/^aviso: /, '')), [`s01-hook: the question's explanations stay on screen only ${late.left.toFixed(1)} s after the trap is marked (aim for 3 s)`]);
  // trap marked together with the reveal, on the first cue of the segment: more time
  const early = await run('q-explain-early', { trapAt: undefined });
  assert.ok(early.left >= 3, `fixture margin ${early.left}`);
  assert.deepEqual(early.warned, []);
});
