import { useEffect } from 'react';
import { useStore } from './store';
import { useSyncStore } from './syncStore';
import { hashCode, mergeProgress, pull, push, stableStringify, SYNC_URL } from './sync';
import { createSyncScheduler, type SyncScheduler } from './syncSchedule';
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
 * `stableStringify` of the snapshot the bucket is believed to hold, or null
 * when that is unknown. The tab-hide path uses it to skip a KV write when
 * nothing has changed since the last one.
 */
let lastPushed: string | null = null;

/** The scheduler owned by the mounted hook, so syncNow can stamp its floor. */
let scheduler: SyncScheduler | null = null;

/**
 * One full sync: pull the remote snapshot, merge it into the local one, apply
 * the result locally, then push it back. Idempotent — running it twice in a
 * row changes nothing.
 */
export async function syncNow(): Promise<void> {
  const { code, _set } = useSyncStore.getState();
  if (!code || !syncEnabled()) return;
  // Every sync counts against the interval floor, including the one the
  // "Sincronizar ahora" button fires, or the scheduler would queue another
  // immediately behind a manual one.
  scheduler?.markSynced();
  _set({ status: 'syncing', error: null });
  try {
    const hash = await hashCode(code);
    cachedHash = hash;
    const remote = await pull(hash);
    const local = snapshot();
    // A missing bucket is not an error: this is the first sync for this code.
    const merged = remote ? mergeProgress(local, remote) : local;
    // Comparisons go through stableStringify, never JSON.stringify: two
    // devices build the same maps in different key orders, so raw stringify
    // reports a difference on every sync and defeats both guards below.
    const mergedText = stableStringify(merged);
    // Only write when the merge actually changed something. Writing
    // unconditionally would notify the store subscriber in useSync, which
    // would schedule another sync, which would write again.
    if (mergedText !== stableStringify(local)) {
      useStore.setState(merged);
    }
    // Skip the KV write when the bucket already holds exactly this snapshot.
    // Cloudflare's free tier allows 1,000 KV writes a day against 100,000
    // reads, so a needless write costs a hundred times what a needless read
    // does. A null `remote` is the bucket-creating first push and must never
    // be skipped.
    if (!remote || mergedText !== stableStringify(remote)) {
      await push(hash, merged);
    }
    lastPushed = mergedText;
    _set({ status: 'ok', lastSyncedAt: new Date().toISOString(), error: null });
  } catch (e) {
    // The bucket's contents are now unknown — the pull may have failed, or the
    // push may have half-happened. Forget the cache so the tab-hide path does
    // not skip a write it actually owes.
    lastPushed = null;
    _set({ status: 'error', error: e instanceof Error ? e.message : 'Error de sincronización' });
  }
}

/** Mount once, at the app root. Wires the sync triggers. */
export function useSync(): void {
  const code = useSyncStore((s) => s.code);

  useEffect(() => {
    // A new code is a different bucket, so everything cached about the last
    // one is wrong. Pushing to a stale hash would write this device's progress
    // into the bucket the learner just disconnected from.
    cachedHash = null;
    lastPushed = null;
    if (!code || !syncEnabled()) return;

    const own = createSyncScheduler(() => void syncNow());
    scheduler = own;

    void syncNow();

    const unsubscribe = useStore.subscribe(() => own.request());

    const onHide = () => {
      if (document.visibilityState !== 'hidden') return;
      own.cancel();
      if (!cachedHash) {
        // No digest yet: the first syncNow has not resolved, so there is
        // nothing to push to. Fall back to the full path.
        void syncNow();
        return;
      }
      const current = snapshot();
      const currentText = stableStringify(current);
      // The bucket already holds exactly this. visibilitychange fires on every
      // tab switch, window blur and screen lock — dozens of times an hour on a
      // phone — and the unconditional push this replaces spent a KV write on
      // each one, whether or not the learner had done anything.
      if (currentText === lastPushed) return;
      lastPushed = currentText;
      own.markSynced();
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
      void push(cachedHash, current, { keepalive: true }).catch(() => {
        // The tab is going away and there is no UI left to show an error in.
        // Forget what the bucket was believed to hold so the next sync retries.
        lastPushed = null;
      });
    };
    document.addEventListener('visibilitychange', onHide);

    return () => {
      own.cancel();
      if (scheduler === own) scheduler = null;
      unsubscribe();
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [code]);
}
