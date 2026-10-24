import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeNarration } from './narration.mjs';
import { EXAM_BADGE, GCTI_DOMAINS, examObjectiveError } from './profiles.mjs';
import { youtubeTags } from '../youtube-meta.mjs';

const storyboard = {
  chapters: [{ n: 1, title: 'Uno' }],
  scenes: [
    { id: 's01-a', chapter: 1, requiredCues: [] },
    { id: 's02-b', chapter: 1, requiredCues: [] },
  ],
};
const say = 'Una frase de prueba con suficientes palabras para cumplir el estilo.';
const card = (objective) => ({ objective, text: 'Vértices del diamante', holdSec: 5 });
const run = (objective, opts = {}) =>
  analyzeNarration(
    { storyboard, narration: { voice: 'es-ES-ElviraNeural', segments: [{ id: 's01-01', scene: 's01-a', text: say, exam: card(objective) }, { id: 's02-01', scene: 's02-b', text: say }] }, lexicon: {} },
    opts,
  );

test('Security+ stays the default: numbered SY0-701 objectives only', () => {
  assert.deepEqual(run('4.5').errors, []);
  assert.ok(run('Intrusion Analysis').errors.some((e) => /SY0-701 objective like "4\.4"/.test(e)));
});

test('GCTI exam cards name one of the five GCTI domains', () => {
  assert.deepEqual(run('Intrusion Analysis', { track: 'gcti' }).errors, []);
  const errors = run('4.5', { track: 'gcti' }).errors;
  assert.ok(errors.some((e) => /exam\.objective must be a GCTI domain/.test(e)), errors.join('\n'));
  assert.equal(GCTI_DOMAINS.length, 5);
  assert.equal(examObjectiveError('gcti', 'Collection'), null);
  assert.throws(() => examObjectiveError('ccna', '1.1'), /unknown track/);
});

test('the card badge names the exam of the track', () => {
  assert.equal(EXAM_BADGE.secplus, 'SY0-701');
  assert.equal(EXAM_BADGE.gcti, 'GCTI');
});

test('YouTube tags: Security+ keeps "objetivo N.N", GCTI uses the domain as is', () => {
  const tags = (track, objective) => youtubeTags({ exam: [{ objective }] }, track);
  assert.ok(tags('secplus', '4.5').includes('objetivo 4.5'));
  const gcti = tags('gcti', 'Intrusion Analysis');
  assert.ok(gcti.includes('Intrusion Analysis'));
  assert.ok(!gcti.some((t) => t.startsWith('objetivo ')));
});

test('a timeline exam cue may carry a badge, and it must be a non-empty string', async () => {
  const { validateTimeline } = await import('./validate-timeline.mjs');
  const base = { mode: 'estimate', sourceHash: 'x', fps: 30, width: 1920, height: 1080, durationInFrames: 300, voice: 'v', segments: [], captions: [], cues: [], think: [] };
  const scenes = [{ id: 's01-a', chapter: 1, chapterTitle: 'Uno', title: 'A', from: 0, durationInFrames: 300 }];
  const cue = (extra) => ({ scene: 's01-a', from: 0, durationInFrames: 150, objective: 'Intrusion Analysis', text: 'Vértices', ...extra });
  const errs = (exam) => validateTimeline({ ...base, scenes, exam }).filter((e) => e.startsWith('exam'));
  assert.deepEqual(errs([cue({ badge: 'GCTI' })]), []);
  assert.deepEqual(errs([cue({})]), []);
  assert.ok(errs([cue({ badge: '' })]).length > 0);
});

test('a video may name its own exam on the card badge (SY0-801 draft); Security+ stays implicit', async () => {
  const { examBadgeFor, interceptsFor, PROFILES } = await import('./profiles.mjs');
  assert.equal(examBadgeFor('secplus'), null);
  assert.equal(examBadgeFor('gcti'), 'GCTI');
  assert.equal(examBadgeFor('secplus', 'SY0-801 · borrador'), 'SY0-801 · borrador');
  assert.throws(() => examBadgeFor('secplus', ''), /examBadge/);
  assert.throws(() => examBadgeFor('secplus', 'x'.repeat(31)), /examBadge/);
  assert.throws(() => examBadgeFor('ccna'), /unknown track/);
  assert.deepEqual(interceptsFor(PROFILES['capsula-yt'], true), [1, 2]);
  assert.deepEqual(interceptsFor(PROFILES['capsula-yt'], false), [0, 2]);
});
