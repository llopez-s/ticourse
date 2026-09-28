import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { INTERCEPT_TIMING, VOICE_MARGIN_FRAMES, placeSfx, readSfxLibrary, sfxMapErrors, syncSfxFiles, voicedHoldFrames } from './sfx.mjs';
import { validateTimeline } from './validate-timeline.mjs';

const NAMES = ['glitch', 'typing', 'ding', 'whoosh', 'mail', 'check', 'error', 'block', 'alarm', 'ping2', 'lock'];
const library = { sampleRate: 44100, sounds: Object.fromEntries(NAMES.map((n) => [n, { file: `${n}.mp3`, durationMs: n === 'typing' ? 3000 : 400, volume: 0.2 }])) };
const tmp = mkdtempSync(path.join(tmpdir(), 'sfx-'));
after(() => rmSync(tmp, { recursive: true, force: true }));

const scenes = [
  { id: 's01', chapter: 1, from: 0, durationInFrames: 300 },
  { id: 's02', chapter: 1, from: 300, durationInFrames: 300 },
  { id: 's03', chapter: 2, from: 600, durationInFrames: 300 },
];
const cues = [{ scene: 's01', id: 'mail-in', frame: 50 }, { scene: 's03', id: 'alert', frame: 700 }];
const exam = [{ scene: 's02', from: 400, durationInFrames: 150 }];
const intercept = [{ scene: 's02', from: 320, durationInFrames: 200, text: 'x'.repeat(40) }];
const base = { scenes, cues, exam, intercept, library, fps: 30, transitionFrames: 15 };

test('voicedHoldFrames: the written hold unless the voice needs longer', () => {
  assert.equal(voicedHoldFrames(90, 30), 90);
  assert.equal(voicedHoldFrames(90, 150), INTERCEPT_TIMING.typeStart + 150 + VOICE_MARGIN_FRAMES);
});

test('placeSfx: automatic sounds for intercepts, exam cards and chapter changes', () => {
  const sfx = placeSfx({ ...base, map: {} });
  const at = (sound) => sfx.filter((s) => s.sound === sound).map((s) => s.from);
  assert.deepEqual(at('glitch'), [320]);
  assert.deepEqual(at('typing'), [320 + INTERCEPT_TIMING.typeStart]);
  assert.equal(sfx.find((s) => s.sound === 'typing').durationInFrames, 40 * INTERCEPT_TIMING.typeRate, 'typing lasts as long as the text types');
  assert.deepEqual(at('ding'), [400]);
  assert.deepEqual(at('whoosh'), [600 - 15], 'whoosh on the chapter wipe only, not on s02');
  assert.deepEqual(sfx.map((s) => s.from), [...sfx.map((s) => s.from)].sort((a, b) => a - b));
  assert.deepEqual(sfx[0], { from: 320, sound: 'glitch', src: 'sfx/glitch.mp3', durationInFrames: 12, volume: 0.2 });
});

test('placeSfx: a key moment plays on its cue frame', () => {
  const sfx = placeSfx({ ...base, map: { 'mail-in': 'mail', alert: 'alarm' } });
  assert.deepEqual(sfx.filter((s) => ['mail', 'alarm'].includes(s.sound)).map((s) => [s.sound, s.from]), [['mail', 50], ['alarm', 700]]);
});

test('sfxMapErrors: unknown cue ids and sound names, and a library without the automatic sounds', () => {
  assert.deepEqual(sfxMapErrors({ 'mail-in': 'mail' }, cues, library), []);
  const errs = sfxMapErrors({ 'mail-inn': 'mail', alert: 'siren' }, cues, library);
  assert.equal(errs.length, 2);
  assert.match(errs[0], /mail-inn/);
  assert.match(errs[0], /alert, mail-in/, 'lists the video\'s valid cue ids');
  assert.match(errs[1], /siren/);
  const partial = { sounds: { mail: library.sounds.mail } };
  assert.match(sfxMapErrors({}, cues, partial).join('\n'), /glitch/);
  assert.match(sfxMapErrors([], cues, library).join('\n'), /object/);
});

test('sfxMapErrors: a cue id reachable from more than one scene is an error, named with its scenes', () => {
  const dup = [...cues, { scene: 's02', id: 'mail-in', frame: 900 }];
  const errs = sfxMapErrors({ 'mail-in': 'mail' }, dup, library);
  assert.equal(errs.length, 1);
  assert.match(errs[0], /more than one scene/);
  assert.match(errs[0], /s01/);
  assert.match(errs[0], /s02/);
});

test('sfxMapErrors: a sound in use with no MP3 on disk fails, before anything is written', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'sfx-lib-'));
  for (const n of NAMES) if (n !== 'mail') writeFileSync(path.join(dir, `${n}.mp3`), n); // "mail" is missing
  const withoutDir = sfxMapErrors({ 'mail-in': 'mail' }, cues, library);
  assert.deepEqual(withoutDir, [], 'no dir given: the file check is skipped');
  const errs = sfxMapErrors({ 'mail-in': 'mail' }, cues, library, dir);
  assert.equal(errs.length, 1);
  assert.match(errs[0], /"mail"/);
  assert.match(errs[0], /sfx_generate\.py/);
  // an automatic sound missing from disk is caught the same way, even with no map entry naming it
  const dir2 = mkdtempSync(path.join(tmpdir(), 'sfx-lib-'));
  for (const n of NAMES) if (n !== 'ding') writeFileSync(path.join(dir2, `${n}.mp3`), n); // "ding" is missing
  const autoErrs = sfxMapErrors({}, cues, library, dir2);
  assert.equal(autoErrs.length, 1);
  assert.match(autoErrs[0], /"ding"/);
  rmSync(dir, { recursive: true, force: true });
  rmSync(dir2, { recursive: true, force: true });
});

test('readSfxLibrary reads sfx.json and says how to create it when missing', () => {
  writeFileSync(path.join(tmp, 'sfx.json'), JSON.stringify(library));
  assert.deepEqual(readSfxLibrary(tmp), library);
  assert.throws(() => readSfxLibrary(path.join(tmp, 'nope')), /sfx_generate\.py/);
});

test('syncSfxFiles copies the sounds in use and removes the ones no longer used', () => {
  const from = path.join(tmp, 'lib');
  const to = path.join(tmp, 'public-sfx');
  mkdirSync(from, { recursive: true });
  mkdirSync(to, { recursive: true });
  for (const n of NAMES) writeFileSync(path.join(from, `${n}.mp3`), n);
  writeFileSync(path.join(to, 'old.mp3'), 'old');
  syncSfxFiles(placeSfx({ ...base, map: {} }), library, from, to);
  assert.deepEqual(readdirSync(to).sort(), ['ding.mp3', 'glitch.mp3', 'typing.mp3', 'whoosh.mp3']);
  assert.equal(existsSync(path.join(to, 'old.mp3')), false);
});

test('validateTimeline accepts sfx and a voiced intercept, and rejects malformed ones', () => {
  const minimal = () => ({
    mode: 'audio', sourceHash: 'h', fps: 30, width: 1920, height: 1080, durationInFrames: 900, voice: 'recording/lidia',
    scenes: [{ id: 's01', chapter: 1, chapterTitle: 'Uno', title: 'Uno', from: 0, durationInFrames: 900 }],
    segments: [], captions: [], cues: [], exam: [], think: [],
  });

  const t = minimal();
  t.sfx = [{ from: 10, sound: 'ding', src: 'sfx/ding.mp3', durationInFrames: 24, volume: 0.15 }];
  t.intercept = [{ scene: 's01', from: 100, durationInFrames: 200, adversary: 'SILENT PAGER', text: 'Hola.', audio: 'voice/s01-01-intercept.mp3', audioFrom: 104, audioFrames: 150 }];
  assert.deepEqual(validateTimeline(t), []);

  const bad = minimal();
  bad.sfx = [{ from: 10, sound: 'ding', src: 'ding.mp3', durationInFrames: 0, volume: 2 }];
  bad.intercept = [{ scene: 's01', from: 100, durationInFrames: 200, adversary: 'SILENT PAGER', text: 'Hola.', audio: 'voice/x.mp3' }];
  const errs = validateTimeline(bad).join('\n');
  assert.match(errs, /sfx\[0\]\.src/);
  assert.match(errs, /sfx\[0\]\.durationInFrames/);
  assert.match(errs, /sfx\[0\]\.volume/);
  assert.match(errs, /intercept\[0\].*audio/);

  const empty = minimal();
  empty.sfx = [];
  assert.match(validateTimeline(empty).join('\n'), /timeline\.sfx/);
});
