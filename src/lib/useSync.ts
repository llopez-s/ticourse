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
    exempt: s.exempt,
    placement: s.placement,
    day: s.day,
  };
}

export const syncEnabled = () => SYNC_URL !== '';

/**
 * Digest of the code, cached the first time syncNow computes it. hashCode is
 * async, and the tab-hide path has no time to await it — see onHide below.
 */
let cachedHash: string | null = null;

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
    cachedHash = hash;
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
    // Skip the KV write when the bucket already holds exactly this snapshot —
    // every device polls on a timer, so an unconditional push means a write
    // per device per sync even when nothing changed anywhere. A null `remote`
    // is the bucket-creating first push and must never be skipped.
    if (!remote || JSON.stringify(merged) !== JSON.stringify(remote)) {
      await push(hash, merged);
    }
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
      if (document.visibilityState !== 'hidden') return;
      clearTimeout(timer);
      if (!cachedHash) {
        // No digest yet: the first syncNow has not resolved, so there is
        // nothing to push to. Fall back to the full path.
        void syncNow();
        return;
      }
      // Push straight from local state with no pull. syncNow() awaits a pull
      // round trip first, and on a real tab close the document is torn down
      // long before that resolves, so nothing would ever be pushed —
      // `keepalive` only protects a request that is already in flight.
      //
      // Tradeoff, stated plainly: skipping the pull means skipping the merge,
      // so remote-only changes another device made since our last pull are
      // overwritten in the bucket. This is self-healing — that device still
      // holds those changes in its own localStorage and re-pushes them on its
      // next sync, where the monotonic merge folds them back in — so the
      // window is temporary and nothing is lost permanently.
      //
      // Errors are swallowed: the tab is going away, there is no UI left to
      // show them in, and an unhandled rejection would just noise the console.
      void push(cachedHash, snapshot(), { keepalive: true }).catch(() => {});
    };
    document.addEventListener('visibilitychange', onHide);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [code]);
}
