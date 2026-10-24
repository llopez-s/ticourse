import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { checkManifest, mp4PathFor } from './paths.mjs';
import { APP_NAME, LEGACY_APP_NAME, YOUTUBE_PROFILES, profileFor, trackNotice } from './profiles.mjs';

test('the legacy profiles keep their numbers, stay in the repo and use no chispa checks', () => {
  const p = profileFor('principal');
  assert.deepEqual([p.minTotalSec, p.maxTotalSec, p.crf, p.host, p.chispa], [280, 340, 23, 'repo', false]);
  assert.deepEqual(p.intercepts, [0, 0]);
  const c = profileFor('capsula');
  assert.deepEqual([c.minTotalSec, c.maxTotalSec, c.crf, c.host], [140, 200, 27, 'repo']);
});

test('the -yt profiles: longer windows, crf 18, YouTube, chispa checks, intercepted messages', () => {
  const p = profileFor('principal-yt');
  assert.deepEqual([p.minTotalSec, p.maxTotalSec, p.maxChapters, p.crf, p.host, p.chispa, p.size], [380, 600, 5, 18, 'youtube', true, null]);
  assert.deepEqual([p.examCards, p.thinkPrompts, p.intercepts], [[5, 8], 2, [2, 4]]);
  const c = profileFor('capsula-yt');
  assert.deepEqual([c.minTotalSec, c.maxTotalSec, c.maxChapters, c.crf, c.host, c.chispa, c.size], [190, 260, 3, 18, 'youtube', true, null]);
  assert.deepEqual([c.examCards, c.thinkPrompts, c.intercepts], [[3, 5], 1, [1, 2]]);
});

test('burned-in captions: kept in the app\'s MP4s, off on YouTube (which shows the VTT)', () => {
  assert.deepEqual(['principal', 'capsula', 'principal-yt', 'capsula-yt'].map((name) => profileFor(name).captionsOnScreen), [true, true, false, false]);
});

test('x264 preset: slow for the videos kept in the repo, medium for YouTube (it re-encodes the upload)', () => {
  assert.deepEqual(['principal', 'capsula', 'principal-yt', 'capsula-yt'].map((name) => profileFor(name).x264Preset), ['slow', 'slow', 'medium', 'medium']);
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

test('trackNotice: a video of real cases swaps the «datos ficticios» lead (video.json simulationLabel) and keeps the disclaimer', () => {
  assert.equal(trackNotice('gcti', 'principal-yt', null), trackNotice('gcti', 'principal-yt'));
  assert.equal(
    trackNotice('gcti', 'principal-yt', 'Casos reales · análisis educativo'),
    `Casos reales · análisis educativo · ${APP_NAME} — material independiente, no afiliado a SANS/GIAC`,
  );
});

test('checkManifest: simulationLabel is optional, one line, at most 40 characters', () => {
  const base = { slug: 'x', output: 'x', composition: 'X', poster: 'XPoster', profile: 'principal-yt', track: 'gcti' };
  assert.doesNotThrow(() => checkManifest(base, 'video.json', 'x'));
  assert.doesNotThrow(() => checkManifest({ ...base, simulationLabel: 'Casos reales · análisis educativo' }, 'video.json', 'x'));
  assert.throws(() => checkManifest({ ...base, simulationLabel: '' }, 'video.json', 'x'), /"simulationLabel"/);
  assert.throws(() => checkManifest({ ...base, simulationLabel: 'x'.repeat(41) }, 'video.json', 'x'), /"simulationLabel"/);
  assert.throws(() => checkManifest({ ...base, simulationLabel: 'a\nb' }, 'video.json', 'x'), /"simulationLabel"/);
});

test('mp4PathFor: repo profiles render into public/videos, YouTube ones into the video out/ folder', () => {
  const dir = path.join('video', 'edr-v2');
  const pub = path.join('public', 'videos');
  assert.equal(mp4PathFor({ profile: 'principal', output: 'x' }, dir, pub), path.join(pub, 'x.mp4'));
  assert.equal(mp4PathFor({ profile: 'principal-yt', output: 'x' }, dir, pub), path.join(dir, 'out', 'x.mp4'));
});

test('caso-yt and caso-principal-yt: the case-and-exam windows', () => {
  const c = profileFor('caso-yt');
  assert.deepEqual([c.minTotalSec, c.maxTotalSec, c.maxChapters], [240, 330, 3]);
  assert.deepEqual([c.examCards, c.thinkPrompts, c.intercepts, c.examQuestions], [[3, 5], 0, [0, 1], [3, 3]]);
  const p = profileFor('caso-principal-yt');
  assert.deepEqual([p.minTotalSec, p.maxTotalSec, p.maxChapters], [420, 600, 5]);
  assert.deepEqual([p.examCards, p.thinkPrompts, p.intercepts, p.examQuestions], [[5, 8], 0, [0, 2], [4, 5]]);
  for (const x of [c, p]) assert.deepEqual([x.chispa, x.host, x.captionsOnScreen, x.size], [true, 'youtube', false, null]);
});

test('the older profiles expect no exam questions', () => {
  for (const name of ['principal', 'capsula', 'principal-yt', 'capsula-yt']) assert.deepEqual(profileFor(name).examQuestions, [0, 0]);
});

test('the YouTube profiles are derived from the host, and youtube-meta names them all', () => {
  assert.deepEqual([...YOUTUBE_PROFILES].sort(), ['capsula-yt', 'caso-principal-yt', 'caso-yt', 'principal-yt'].sort());
  const source = readFileSync(new URL('../youtube-meta.mjs', import.meta.url), 'utf8');
  assert.ok(source.includes("YOUTUBE_PROFILES.join(' / ')"), 'the error text lists every YouTube profile');
  assert.ok(!source.includes('principal-yt / capsula-yt'), 'no hard-coded pair');
});
