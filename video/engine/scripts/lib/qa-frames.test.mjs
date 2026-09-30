import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { pickFrames, sequenceOutDir } from '../qa-frames.mjs';

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

test('sequenceOutDir: relative to the repo root, so a dotted folder (.claude/worktrees) is no «extension»', () => {
  const root = path.join('D:', 'repo', '.claude', 'worktrees', 'wt');
  assert.equal(sequenceOutDir(path.join(root, 'video', 'x', 'out', 'qa', 's01-hook'), root), 'video/x/out/qa/s01-hook');
  const outside = path.join('D:', 'elsewhere', 'qa');
  assert.equal(sequenceOutDir(outside, root), outside, 'a folder outside the repo stays absolute');
});
