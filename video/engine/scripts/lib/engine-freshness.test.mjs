import assert from 'node:assert/strict';
import test from 'node:test';
import { behindWarning, engineBehind, parseCommits, warnIfEngineBehind } from './engine-freshness.mjs';

/** A fake spawnSync: `answers` maps a piece of the git command line to its stdout; null makes that command fail. */
function fakeGit(answers) {
  return (cmd, args) => {
    const line = args.join(' ');
    const key = Object.keys(answers).find((k) => line.includes(k));
    const out = key === undefined ? null : answers[key];
    return out === null ? { status: 1, stdout: '' } : { status: 0, stdout: out };
  };
}

const behind = {
  'rev-parse': 'abc\n',
  '--format=%h %s': 'c1c1a9c fix(video): keep the last take\n',
  'log --name-only': 'video/engine/scripts/lib/recording.mjs\n',
  'diff --name-only': 'video/engine/scripts/lib/recording.mjs\n',
};

test('parseCommits reads "%h %s" lines', () => {
  assert.deepEqual(parseCommits('c1c1a9c fix(video): keep the last take\n\n61cb8f8 feat(video): V25\n'), [
    { sha: 'c1c1a9c', subject: 'fix(video): keep the last take' },
    { sha: '61cb8f8', subject: 'feat(video): V25' },
  ]);
  assert.deepEqual(parseCommits(''), []);
});

test('engineBehind: commits of origin/main that touch the engine and are not here', () => {
  const info = engineBehind({ run: fakeGit(behind) });
  assert.equal(info.commits.length, 1);
  assert.deepEqual(info.files, ['video/engine/scripts/lib/recording.mjs']);
  const lines = behindWarning(info);
  assert.match(lines[0], /behind origin\/main: 1 commit not in it, 1 file differ/);
  assert.match(lines.join('\n'), /c1c1a9c fix\(video\): keep the last take/);
});

test('engineBehind: a checkout that copied the engine from main (the files are identical) is not behind', () => {
  assert.deepEqual(behindWarning(engineBehind({ run: fakeGit({ ...behind, 'diff --name-only': '' }) })), []);
});

test('engineBehind: up to date, no origin/main, or no git: nothing to say', () => {
  assert.deepEqual(behindWarning(engineBehind({ run: fakeGit({ 'rev-parse': 'abc\n', '--format=%h %s': '' }) })), []);
  assert.equal(engineBehind({ run: fakeGit({ 'rev-parse': null }) }), null);
  assert.equal(engineBehind({ run: () => ({ status: null, error: new Error('ENOENT') }) }), null);
  assert.deepEqual(behindWarning(null), []);
});

test('behindWarning shows the latest few commits and counts the rest', () => {
  const commits = Array.from({ length: 5 }, (_, k) => ({ sha: `a${k}`, subject: `fix ${k}` }));
  const lines = behindWarning({ base: 'origin/main', commits, files: ['x', 'y'] });
  assert.match(lines[0], /5 commits not in it, 2 files differ/);
  assert.ok(lines.some((l) => /and 2 more/.test(l)));
});

test('warnIfEngineBehind prints through log.warn and never throws', () => {
  const seen = [];
  warnIfEngineBehind({ warn: (m) => seen.push(m) }, { run: fakeGit(behind) });
  assert.ok(seen.length >= 2);
  assert.doesNotThrow(() => warnIfEngineBehind({ warn: () => {} }, { run: () => { throw new Error('boom'); } }));
});
