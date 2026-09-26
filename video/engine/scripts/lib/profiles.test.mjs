import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { mp4PathFor } from './paths.mjs';
import { APP_NAME, LEGACY_APP_NAME, profileFor, trackNotice } from './profiles.mjs';

test('the legacy profiles keep their numbers, stay in the repo and use no chispa checks', () => {
  const p = profileFor('principal');
  assert.deepEqual([p.minTotalSec, p.maxTotalSec, p.crf, p.host, p.chispa], [280, 340, 23, 'repo', false]);
  assert.deepEqual(p.intercepts, [0, 0]);
  const c = profileFor('capsula');
  assert.deepEqual([c.minTotalSec, c.maxTotalSec, c.crf, c.host], [140, 200, 27, 'repo']);
});

test('the -yt profiles: longer windows, crf 18, YouTube, chispa checks, intercepted messages', () => {
  const p = profileFor('principal-yt');
  assert.deepEqual([p.minTotalSec, p.maxTotalSec, p.maxChapters, p.crf, p.host, p.chispa, p.size], [380, 500, 5, 18, 'youtube', true, null]);
  assert.deepEqual([p.examCards, p.thinkPrompts, p.intercepts], [[8, 11], 2, [2, 4]]);
  const c = profileFor('capsula-yt');
  assert.deepEqual([c.minTotalSec, c.maxTotalSec, c.maxChapters, c.crf, c.host, c.chispa, c.size], [190, 260, 3, 18, 'youtube', true, null]);
  assert.deepEqual([c.examCards, c.thinkPrompts, c.intercepts], [[4, 6], 1, [1, 2]]);
});

test('trackNotice: the old name for repo videos, Alertópolis for YouTube ones', () => {
  assert.equal(
    trackNotice('secplus'),
    `Simulación educativa con datos ficticios · ${LEGACY_APP_NAME} — material independiente, no afiliado a CompTIA`,
  );
  assert.equal(trackNotice('secplus', 'capsula'), trackNotice('secplus'));
  assert.equal(
    trackNotice('gcti', 'principal-yt'),
    `Simulación educativa con datos ficticios · ${APP_NAME} — material independiente, no afiliado a SANS/GIAC`,
  );
  assert.throws(() => trackNotice('ccna'), /unknown track/);
});

test('mp4PathFor: repo profiles render into public/videos, YouTube ones into the video out/ folder', () => {
  const dir = path.join('video', 'edr-v2');
  const pub = path.join('public', 'videos');
  assert.equal(mp4PathFor({ profile: 'principal', output: 'x' }, dir, pub), path.join(pub, 'x.mp4'));
  assert.equal(mp4PathFor({ profile: 'principal-yt', output: 'x' }, dir, pub), path.join(dir, 'out', 'x.mp4'));
});
