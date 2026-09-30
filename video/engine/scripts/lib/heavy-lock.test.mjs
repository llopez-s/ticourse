import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { acquireHeavyLock } from './heavy-lock.mjs';

const tmp = () => path.join(mkdtempSync(path.join(os.tmpdir(), 'heavy-lock-')), 'heavy.lock');
const quiet = { log: () => {} };

test('acquireHeavyLock: takes a free lock, names its owner, and release() frees it', () => {
  const file = tmp();
  const release = acquireHeavyLock('qa-frames ir-halden', { file, pid: 101, log: quiet });
  const owner = JSON.parse(readFileSync(file, 'utf8'));
  assert.equal(owner.pid, 101);
  assert.equal(owner.what, 'qa-frames ir-halden');
  release();
  assert.equal(existsSync(file), false);
});

test('acquireHeavyLock: waits while a live process holds it, then goes', () => {
  const file = tmp();
  writeFileSync(file, JSON.stringify({ pid: 202, what: 'render siem', since: 'now' }));
  const said = [];
  let waits = 0;
  const release = acquireHeavyLock('qa-frames x', {
    file,
    pid: 303,
    alive: (pid) => pid === 202 && existsSync(file),
    sleep: () => {
      waits += 1;
      rmSync(file); // the render finishes while we wait
    },
    log: { log: (m) => said.push(m) },
  });
  assert.equal(waits, 1);
  assert.equal(said.length, 1, 'says once what it is waiting for');
  assert.match(said[0], /render siem.*202/);
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).pid, 303);
  release();
});

test('acquireHeavyLock: a lock whose owner died is taken over at once', () => {
  const file = tmp();
  writeFileSync(file, JSON.stringify({ pid: 404, what: 'render crashed', since: 'then' }));
  const release = acquireHeavyLock('verify-voice', { file, pid: 505, alive: () => false, sleep: () => assert.fail('no wait'), log: quiet });
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).pid, 505);
  release();
});

test('acquireHeavyLock: release() never removes a lock someone else took since', () => {
  const file = tmp();
  const release = acquireHeavyLock('a', { file, pid: 606, log: quiet });
  writeFileSync(file, JSON.stringify({ pid: 707, what: 'b', since: 'now' }));
  release();
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).pid, 707);
});

test('acquireHeavyLock: RENDER_LOCK=0 skips the queue', () => {
  const file = tmp();
  const release = acquireHeavyLock('x', { file, env: { RENDER_LOCK: '0' }, log: quiet });
  assert.equal(existsSync(file), false);
  release();
});
