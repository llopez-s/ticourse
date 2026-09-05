import { useEffect } from 'react';
import { useStore } from './store';
import { useSyncStore } from './syncStore';
import { hashCode, mergeProgress, pull, push, SYNC_URL } from './sync';
import type { ProgressSnapshot } from './types';

/** Strip the action functions off the store, leaving the persisted snapshot. */
function snapshot(): ProgressSnapshot {
  const s = useStore.getState();
  return {
    track: s.track,
    xp: s.xp,
    streak: s.streak,
    activity: s.activity,
    lessons: s.lessons,
    quizBest: s.quizBest,
    labs: s.labs,
    bosses: s.bosses,
    exams: s.exams,
    srs: s.srs,
    calibration: s.calibration,
    totals: s.totals,
    achievements: s.achievements,
    day: s.day,
  };
}

export const syncEnabled = () => SYNC_URL !== '';

/**
 * One full sync: pull the remote snapshot, merge it into the local one, apply
 * the result locally, then push it back. Idempotent — running it twice in a
 * row changes nothing.
 */
export async function syncNow(): Promise<void> {
  const { code, _set } = useSyncStore.getState();
  if (!code || !syncEnabled()) return;
  _set({ status: 'syncing', error: null });
  try {
    const hash = await hashCode(code);
    const remote = await pull(hash);
    const local = snapshot();
    // A missing bucket is not an error: this is the first sync for this code.
    const merged = remote ? mergeProgress(local, remote) : local;
    // Only write when the merge actually changed something. Writing
    // unconditionally would notify the store subscriber in useSync, which
    // would schedule another sync, which would write again — a permanent
    // 5-second loop for a user who is not even studying.
    if (JSON.stringify(merged) !== JSON.stringify(local)) {
      useStore.setState(merged);
    }
    await push(hash, merged);
    _set({ status: 'ok', lastSyncedAt: new Date().toISOString(), error: null });
  } catch (e) {
    _set({ status: 'error', error: e instanceof Error ? e.message : 'Error de sincronización' });
  }
}

const DEBOUNCE_MS = 5000;

/** Mount once, at the app root. Wires the sync triggers. */
export function useSync(): void {
  const code = useSyncStore((s) => s.code);

  useEffect(() => {
    if (!code || !syncEnabled()) return;

    void syncNow();

    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = useStore.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(() => void syncNow(), DEBOUNCE_MS);
    });

    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        clearTimeout(timer);
        void syncNow();
      }
    };
    document.addEventListener('visibilitychange', onHide);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [code]);
}
