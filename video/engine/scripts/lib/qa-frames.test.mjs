import assert from 'node:assert/strict';
import test from 'node:test';
import { pickFrames } from '../qa-frames.mjs';

test('pickFrames: an intercepted message gets a typing still and a finished one', () => {
  const timeline = {
    durationInFrames: 600,
    scenes: [{ id: 's01-a', from: 0, durationInFrames: 600 }],
    cues: [],
    exam: [],
    think: [],
    intercept: [{ scene: 's01-a', from: 100, durationInFrames: 200, adversary: 'SILENT PAGER', text: 'x' }],
  };
  const labels = pickFrames(timeline).flatMap((p) => p.labels);
  assert.ok(labels.includes('s01-a/intercept-typing'));
  assert.ok(labels.includes('s01-a/intercept'));
  assert.deepEqual(pickFrames({ ...timeline, intercept: undefined }).flatMap((p) => p.labels).filter((l) => l.includes('intercept')), []);
});
