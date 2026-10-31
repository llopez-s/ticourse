import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { MEASURE_VERSION, VERIFY_MODEL, cacheLine, clipKey, isCached, mergeMeasures, parseProgress, staleJobs } from './verify-voice.mjs';

const clip = (id, bytes, playMs = 4000) => ({ id, playMs, key: clipKey(Buffer.from(bytes), playMs) });
const entry = (job, extra = {}) => ({ id: job.id, key: job.key, v: MEASURE_VERSION, heard: 'x', ...extra });

test('clipKey: the bytes and the played length, with the formula the caches written before it used', () => {
  const bytes = Buffer.from('mp3 bytes');
  const old = createHash('sha256').update(bytes).update(':4120').digest('hex');
  assert.equal(clipKey(bytes, 4120), old);
  assert.notEqual(clipKey(bytes, 4160), old); // build-timeline gave the clip more frames: heard again
  assert.notEqual(clipKey(Buffer.from('mp3 byteZ'), 4120), old);
});

test('isCached: an entry from before the model was recorded counts as the default model; another model or measure version does not', () => {
  const job = clip('s01-01', 'a');
  assert.equal(isCached(entry(job), job.key), true);
  assert.equal(isCached(entry(job, { model: VERIFY_MODEL }), job.key), true);
  assert.equal(isCached(entry(job, { model: 'medium' }), job.key), false);
  assert.equal(isCached(entry(job, { v: 1 }), job.key), false);
  assert.equal(isCached(entry(job), clip('s01-01', 'b').key), false);
  assert.equal(isCached(undefined, job.key), false);
});

test('staleJobs: after import-recording --only s06-03,s09-07 only those two clips go back to Whisper; --all hears every one', () => {
  const before = ['s01-01', 's03-06', 's06-03', 's09-07'].map((id) => clip(id, `take 1 ${id}`));
  const cache = Object.fromEntries(before.map((j) => [j.id, entry(j)]));
  const after = before.map((j) => (j.id === 's06-03' || j.id === 's09-07' ? clip(j.id, `take 2 ${j.id}`) : j));
  assert.deepEqual(staleJobs(after, cache).map((j) => j.id), ['s06-03', 's09-07']);
  assert.deepEqual(staleJobs(before, cache), []);
  assert.equal(staleJobs(before, cache, { all: true }).length, 4);
  // a clip new to the script (no entry yet) is heard
  assert.deepEqual(staleJobs([...before, clip('s10-01', 'new')], cache).map((j) => j.id), ['s10-01']);
});

test('parseProgress and mergeMeasures: a run stopped halfway keeps the clips it finished', () => {
  const a = clip('s01-01', 'a');
  const b = clip('s01-02', 'b');
  const text = `${JSON.stringify(entry(a))}\n${JSON.stringify(entry(b))}\r\n{"id":"s01-03","key":"ab`; // the last line was being written
  const rows = parseProgress(text);
  assert.deepEqual(rows.map((r) => r.id), ['s01-01', 's01-02']);
  assert.deepEqual(parseProgress('not json\n{"id":1}\n\n'), []);

  const old = { 's01-01': { ...entry(clip('s01-01', 'old')), heard: 'old' }, 's09-09': entry(clip('s09-09', 'z')) };
  const cache = mergeMeasures(old, rows);
  assert.equal(cache['s01-01'].key, a.key);
  assert.equal(cache['s01-01'].model, VERIFY_MODEL);
  assert.ok(cache['s09-09']); // the others stay
  assert.ok(!old['s01-01'].model); // not modified in place
  assert.deepEqual(staleJobs([a, b, clip('s01-03', 'c')], cache).map((j) => j.id), ['s01-03']);
});

test('cacheLine says which clips are heard and how many come from the cache', () => {
  const jobs = Array.from({ length: 63 }, (_, k) => clip(`s${String(k).padStart(2, '0')}-01`, String(k)));
  assert.equal(cacheLine([], 63), 'verify-voice: all 63 clips cached');
  assert.equal(cacheLine([jobs[3], jobs[9]], 63), 'verify-voice: transcribing 2/63 clips (s03-01, s09-01; the other 61 are cached)');
  assert.match(cacheLine(jobs, 63, { all: true }), /^verify-voice: transcribing 63\/63 clips \(s00-01, .*…; --all\)$/);
  assert.match(cacheLine(jobs.slice(0, 2), 2), /none cached/);
});
