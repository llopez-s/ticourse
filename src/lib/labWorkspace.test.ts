import { describe, expect, it } from 'vitest';
import { createLabSession, decodeWorkspace, encodeWorkspace, LAB_STORAGE_PREFIX } from './labWorkspace';
import type { ResultInput, StorageLike } from './labWorkspace';
import { emptySnapshot, mergeProgress } from './sync';
import { useStore } from './store';

function memoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } };
}
const result = (passed: boolean, step = 'classify'): ResultInput => ({
  step, title: 'Clasificar', correct: passed ? 12 : 4, total: 12, passed, mistakes: passed ? [] : ['Revisar evidencia'],
});

describe('local lab workbooks', () => {
  it('reloads drafts including Sets, booleans and partially completed steps', () => {
    const storage = memoryStorage();
    const session = createLabSession('lab3b/guided/v1', storage);
    session.setDraft('selected', new Set(['s2', 's3']));
    session.setDraft('cond', 'two');
    session.setDraft('tested', true);
    const restored = createLabSession('lab3b/guided/v1', storage).getSnapshot();
    expect(restored.current.draft.selected).toEqual(new Set(['s2', 's3']));
    expect(restored.current.draft).toMatchObject({ cond: 'two', tested: true });
  });
  it('isolates lab, mode and case identities', () => {
    const storage = memoryStorage();
    createLabSession('lab3a/challenge/pivot-a/v1', storage).setDraft('text', 'Only A');
    for (const key of ['lab3a/challenge/pivot-b/v1', 'lab3a/guided/v1', 'spl4a/guided/v1']) {
      expect(createLabSession(key, storage).getSnapshot().current.draft).toEqual({});
    }
  });
  it('keeps the first result when a revealed answer is corrected and survives reload', () => {
    const storage = memoryStorage();
    const session = createLabSession('lab2a/guided/v1', storage);
    session.record(result(false));
    session.record(result(true));
    const entry = createLabSession('lab2a/guided/v1', storage).getSnapshot().current.results.classify;
    expect(entry.first).toMatchObject({ correct: 4, passed: false, assisted: false });
    expect(entry.latest).toMatchObject({ correct: 12, passed: true, assisted: true });
    expect(entry.submissions).toBe(2);
  });
  it('does not count feedback on an unrelated report step as assistance on the next step', () => {
    const session = createLabSession('report', memoryStorage());
    session.record(result(true, 'bluf'));
    session.record(result(true, 'tlp'));
    expect(session.getSnapshot().current.results.tlp.first.assisted).toBe(false);
  });
  it('records consulted hints as help even on a first submission', () => {
    const session = createLabSession('challenge', memoryStorage());
    session.revealHelp();
    session.record(result(true));
    expect(session.getSnapshot().current.results.classify.first.assisted).toBe(true);
  });
  it('archives the full run on restart and bounds history to ten runs', () => {
    const session = createLabSession('report', memoryStorage());
    for (let i = 0; i < 12; i++) { session.setDraft('bluf', `Draft ${i}`); session.record(result(true)); session.restart(); }
    const snapshot = session.getSnapshot();
    expect(snapshot.history).toHaveLength(10);
    expect(snapshot.history[0].draft.bluf).toBe('Draft 2');
    expect(snapshot.history[9].draft.bluf).toBe('Draft 11');
    expect(snapshot.current).toMatchObject({ draft: {}, results: {}, revealed: [], helpSeen: false });
    session.restart();
    expect(session.getSnapshot().history).toHaveLength(10);
  });
  it('survives unavailable storage and write quota failures without losing in-memory work', () => {
    const storage: StorageLike = { getItem: () => null, setItem: () => { throw new Error('quota'); } };
    for (const unavailable of [null, storage]) {
      const session = createLabSession('report', unavailable);
      session.setDraft('bluf', 'Keep for export');
      expect(session.getSnapshot().saveFailed).toBe(true);
      expect(session.getSnapshot().current.draft.bluf).toBe('Keep for export');
    }
  });
  it('rejects corrupt, mismatched and unknown-version workbooks', () => {
    const good = createLabSession('correct', memoryStorage()).getSnapshot();
    expect(decodeWorkspace('{broken', 'correct')).toBeNull();
    expect(decodeWorkspace(encodeWorkspace(good), 'wrong')).toBeNull();
    expect(decodeWorkspace(encodeWorkspace({ ...good, version: 2 }), 'correct')).toBeNull();
    expect(decodeWorkspace(encodeWorkspace({ ...good, current: { ...good.current, results: { broken: {} } } }), 'correct')).toBeNull();
  });
  it('notifies subscribers only until unsubscribe', () => {
    const session = createLabSession('test', memoryStorage());
    let count = 0;
    const unsubscribe = session.subscribe(() => count++);
    session.setDraft('x', 1); unsubscribe(); session.setDraft('x', 2);
    expect(count).toBe(1);
  });
  it('never touches the certification profile, XP or sync payload', () => {
    useStore.getState().resetAll();
    const before = useStore.getState().xp;
    const storage = memoryStorage();
    const session = createLabSession('lab3a/challenge/pivot-a/v1', storage);
    session.record(result(true));
    session.setDraft('confidential-draft', 'only-local');
    expect(useStore.getState().xp).toBe(before);
    expect(useStore.getState().labs.lab3a).toBeUndefined();
    expect(JSON.stringify(mergeProgress(emptySnapshot(), emptySnapshot()))).not.toContain('only-local');
    expect(storage.getItem(LAB_STORAGE_PREFIX + 'lab3a/challenge/pivot-a/v1')).toContain('only-local');
  });
  it('keeps the existing completion reward idempotent across retries', () => {
    useStore.getState().resetAll();
    useStore.getState().completeLab('lab1a', 75);
    const xp = useStore.getState().xp;
    useStore.getState().completeLab('lab1a', 75);
    expect(useStore.getState().xp).toBe(xp);
    expect(useStore.getState().labs.lab1a).toBe(true);
  });
});
