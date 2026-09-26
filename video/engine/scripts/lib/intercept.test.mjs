import assert from 'node:assert/strict';
import test from 'node:test';
import { INTERCEPT_TEXT_MAX, analyzeNarration } from './narration.mjs';
import { checkManifest } from './paths.mjs';

const storyboard = {
  chapters: [{ n: 1, title: 'Uno' }, { n: 2, title: 'Dos' }],
  scenes: [
    { id: 's01-a', chapter: 1, requiredCues: [] },
    { id: 's02-b', chapter: 1, requiredCues: [] },
    { id: 's03-c', chapter: 2, requiredCues: [] },
  ],
};
const say = 'Una frase de prueba con suficientes palabras para cumplir el estilo.';
const seg = (id, scene, extra = {}) => ({ id, scene, text: say, ...extra });
const msg = { text: 'Borro el log del servidor y aquí no ha pasado nada.', holdMs: 3000 };
const run = (segments, opts = {}) => analyzeNarration({ storyboard, narration: { voice: 'es-ES-ElviraNeural', segments }, lexicon: {} }, opts);

test('a valid intercepted message is parsed onto its segment', () => {
  const { errors, segments } = run([seg('s01-01', 's01-a', { intercept: msg }), seg('s02-01', 's02-b'), seg('s03-01', 's03-c')]);
  assert.deepEqual(errors, []);
  assert.deepEqual(segments[0].intercept, msg);
  assert.equal(segments[1].intercept, null);
});

test('intercept limits: text, hold, one per chapter, not in the closing scene, not with a think prompt', () => {
  const long = 'x'.repeat(INTERCEPT_TEXT_MAX + 1);
  const { errors } = run([
    seg('s01-01', 's01-a', { intercept: { text: long, holdMs: 2000 } }),
    seg('s02-01', 's02-b', { intercept: msg, think: { q: '¿Y ahora qué?', holdMs: 2000 } }),
    seg('s03-01', 's03-c', { intercept: msg }),
  ]);
  const has = (re) => assert.ok(errors.some((e) => re.test(e)), `${re}\n${errors.join('\n')}`);
  has(/s01-01: intercept\.text is 71 characters \(max 70\)/);
  has(/s01-01: intercept\.holdMs must be between 2500 and 4500/);
  has(/s02-01: a segment cannot carry both a think prompt and an intercepted message/);
  has(/chapter 1: 2 intercepted messages \(max 1 per chapter\)/);
  has(/s03-01: the closing scene must not carry an intercepted message/);
});

test('intercept count is checked against the profile window', () => {
  const { warnings } = run([seg('s01-01', 's01-a', { intercept: msg }), seg('s02-01', 's02-b'), seg('s03-01', 's03-c')], { intercepts: [2, 4] });
  assert.ok(warnings.some((w) => /1 intercepted messages \(style guide: 2–4\)/.test(w)), warnings.join('\n'));
});

test('checkManifest: adversary is optional but must look like a campaign name', () => {
  const base = { slug: 'x', output: 'x', composition: 'X', poster: 'XPoster', profile: 'principal-yt', track: 'secplus' };
  assert.doesNotThrow(() => checkManifest(base, 'video.json', 'x'));
  assert.doesNotThrow(() => checkManifest({ ...base, adversary: 'SILENT PAGER' }, 'video.json', 'x'));
  assert.throws(() => checkManifest({ ...base, adversary: 'silent pager' }, 'video.json', 'x'), /"adversary"/);
  assert.throws(() => checkManifest({ ...base, output: '' }, 'video.json', 'x'), /"output"/);
  assert.throws(() => checkManifest(base, 'video.json', 'y'), /does not match its folder/);
});
