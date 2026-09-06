/**
 * When a sync is allowed to run, and how often.
 *
 * Deliberately free of store, DOM and network imports: this is the policy that
 * decides how much of Cloudflare's free tier the app spends, and it should be
 * testable on its own.
 */

/** Quiet period after the last change before a sync is worth doing. */
export const DEBOUNCE_MS = 5_000;

/**
 * Floor on the gap between two syncs.
 *
 * The progress store changes on every answered question and every graded card,
 * and a sync that finds local work to upload spends one Cloudflare KV write.
 * The free tier allows 1,000 writes per day against 100,000 reads, so writes
 * are the binding constraint by two orders of magnitude.
 *
 * The original policy was a plain 5 s debounce, which in practice fires once
 * per question — a learner pauses longer than 5 s to read the next one, so the
 * debounce elapses between every pair of answers. That spends roughly one
 * write per question and exhausts the day's budget in a few hours of study,
 * which is what triggered the Cloudflare quota alert on 2026-09-06.
 *
 * Three minutes turns a four-hour session into ~80 writes. The cost is that
 * progress can take that long to reach another device, which is the right
 * trade for a single-learner study app: the tab-hide push already covers the
 * "closed the laptop, picked up the phone" handover, and the merge is
 * monotonic, so a late arrival never loses work.
 */
export const MIN_SYNC_INTERVAL_MS = 3 * 60 * 1_000;

/** Delay before the next sync, given the clock and when the last one ran. */
export function nextSyncDelay(now: number, lastSyncAt: number): number {
  return Math.max(DEBOUNCE_MS, MIN_SYNC_INTERVAL_MS - (now - lastSyncAt));
}

export interface SyncScheduler {
  /** Note that the store changed. Schedules a sync unless one is already due. */
  request: () => void;
  /** Record that a sync just ran by some other path, so the floor applies to it too. */
  markSynced: () => void;
  /** Drop any pending sync. */
  cancel: () => void;
  /** True while a sync is scheduled. */
  isPending: () => boolean;
}

/**
 * `run` fires at most once per MIN_SYNC_INTERVAL_MS, however often `request`
 * is called. `now` is injectable so the policy can be driven by fake timers.
 */
export function createSyncScheduler(
  run: () => void,
  now: () => number = Date.now,
): SyncScheduler {
  let timer: ReturnType<typeof setTimeout> | undefined;
  // The caller syncs on mount, so the floor starts running from construction.
  let lastSyncAt = now();

  const markSynced = () => {
    lastSyncAt = now();
  };

  return {
    request() {
      // One pending sync is enough. Re-arming the timer on every change — what
      // a plain debounce does — would let a steady stream of answers push the
      // sync out indefinitely, starving it for the whole session. That is the
      // opposite failure from spending too many writes, and just as bad.
      if (timer !== undefined) return;
      timer = setTimeout(() => {
        timer = undefined;
        // Stamp before running, not after: `run` is async and a slow round
        // trip must not earn a second sync the moment it finishes.
        markSynced();
        run();
      }, nextSyncDelay(now(), lastSyncAt));
    },
    markSynced,
    cancel() {
      clearTimeout(timer);
      timer = undefined;
    },
    isPending: () => timer !== undefined,
  };
}
