import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { defaultBranch, defaultDir, dropRecordingTempo, importArgs, junctions, masteredPath, musicPaths, worktreeArgs } from './prepare-voice.mjs';

const NARRATION = `{
  "voice": "recording/lidia",
  "rate": "+0%",
  "recording": {
    "tempo": 1.08,
    "maxPauseMs": 250
  },
  "adversaryVoice": {
    "voice": "sapi/Microsoft Pablo",
    "fx": "machine", "rate": 0
  },
  "segments": []
}
`;

test('dropRecordingTempo: the tempo goes, the rest of the file keeps its layout', () => {
  const { text, changed } = dropRecordingTempo(NARRATION);
  assert.equal(changed, true);
  assert.deepEqual(JSON.parse(text).recording, { maxPauseMs: 250 });
  assert.equal(text, NARRATION.replace('\n    "tempo": 1.08,', ''));
  assert.deepEqual(dropRecordingTempo(text), { text, changed: false }); // a second run changes nothing
});

test('dropRecordingTempo: tempo last in its block, the only key of the block, a BOM, and no recording block', () => {
  const last = NARRATION.replace('"tempo": 1.08,\n    "maxPauseMs": 250', '"maxPauseMs": 250,\n    "tempo": 1.08');
  assert.deepEqual(JSON.parse(dropRecordingTempo(last).text).recording, { maxPauseMs: 250 });
  const only = NARRATION.replace('"tempo": 1.08,\n    "maxPauseMs": 250', '"tempo": 1.08');
  const gone = dropRecordingTempo(only);
  assert.equal(gone.changed, true);
  assert.equal('recording' in JSON.parse(gone.text), false);
  assert.equal(JSON.parse(gone.text).adversaryVoice.fx, 'machine');
  const bom = dropRecordingTempo(`﻿${NARRATION}`);
  assert.ok(bom.text.startsWith('﻿'));
  assert.deepEqual(JSON.parse(bom.text.slice(1)).recording, { maxPauseMs: 250 });
  const crlf = NARRATION.replace(/\n/g, '\r\n');
  assert.equal(dropRecordingTempo(crlf).text, crlf.replace('\r\n    "tempo": 1.08,', '')); // a Windows checkout keeps its CRLF
  const none = '{ "voice": "recording/lidia" }\n';
  assert.deepEqual(dropRecordingTempo(none), { text: none, changed: false });
});

test('masteredPath: «x.wav» -> «x (master).wav», and a master is left as it is', () => {
  assert.equal(masteredPath(path.join('v', 'producto-bluf lidia.wav')), path.join('v', 'producto-bluf lidia (master).wav'));
  assert.equal(masteredPath(path.join('v', 'x (master).wav')), path.join('v', 'x (master).wav'));
});

test('import, worktree, junctions and music: the commands as they were run by hand', () => {
  const args = importArgs('S', { slug: 'producto-bluf', file: 'a b.wav', name: 'lidia' });
  assert.deepEqual(args, [path.join('S', 'import-recording.mjs'), '--video', 'producto-bluf', '--file', 'a b.wav', '--name', 'lidia', '--lufs=-18']);
  assert.deepEqual(worktreeArgs({ dir: 'W', branch: 'video-x-voz', base: 'origin/main', branchExists: false }), ['worktree', 'add', '-b', 'video-x-voz', 'W', 'origin/main']);
  assert.deepEqual(worktreeArgs({ dir: 'W', branch: 'video-x-voz', base: 'origin/main', branchExists: true }), ['worktree', 'add', 'W', 'video-x-voz']);
  assert.equal(defaultBranch('producto-bluf'), 'video-producto-bluf-voz');
  assert.equal(defaultDir('x', 'T'), path.join('T', 'alertopolis-voz', 'x'));
  assert.deepEqual(junctions('M', 'W').map((j) => [j.path, j.target]), [
    [path.join('W', 'node_modules'), path.join('M', 'node_modules')],
    [path.join('W', 'video', 'engine', '.cache'), path.join('M', 'video', 'engine', '.cache')],
  ]);
  const music = musicPaths({ music: 'Go On Going - Stayloose.mp3' }, 'M', 'W');
  assert.equal(music.to, path.join('W', 'video', 'engine', 'music', 'library', 'Go On Going - Stayloose.mp3'));
  assert.equal(musicPaths({}, 'M', 'W'), null);
});
