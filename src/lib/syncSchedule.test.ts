import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createSyncScheduler,
  DEBOUNCE_MS,
  MIN_SYNC_INTERVAL_MS,
  nextSyncDelay,
} from './syncSchedule';

afterEach(() => {
  vi.useRealTimers();
});

describe('nextSyncDelay', () => {
  it('waits out the rest of the interval right after a sync', () => {
    expect(nextSyncDelay(1_000, 0)).toBe(MIN_SYNC_INTERVAL_MS - 1_000);
  });

  it('still debounces when the interval has long since elapsed', () => {
    // Never zero: a sync fired the instant a question is answered would race
    // the store writes that follow it within the same interaction.
    expect(nextSyncDelay(MIN_SYNC_INTERVAL_MS * 10, 0)).toBe(DEBOUNCE_MS);
  });
});

describe('createSyncScheduler', () => {
  it('collapses a burst of changes into a single sync', () => {
    vi.useFakeTimers();
    let syncs = 0;
    const s = createSyncScheduler(() => syncs++);

    for (let i = 0; i < 50; i++) s.request();
    vi.advanceTimersByTime(MIN_SYNC_INTERVAL_MS * 2);

    expect(syncs).toBe(1);
  });

  it('does not starve under continuous activity', () => {
    vi.useFakeTimers();
    let syncs = 0;
    const s = createSyncScheduler(() => syncs++);

    // A change every second, forever — a plain debounce would never fire.
    for (let t = 0; t < MIN_SYNC_INTERVAL_MS + DEBOUNCE_MS; t += 1_000) {
      s.request();
      vi.advanceTimersByTime(1_000);
    }

    expect(syncs).toBeGreaterThanOrEqual(1);
  });

  it('keeps a four-hour study session inside the free KV write budget', () => {
    vi.useFakeTimers();
    let syncs = 0;
    const s = createSyncScheduler(() => syncs++);

    const FOUR_HOURS = 4 * 60 * 60 * 1_000;
    const PER_QUESTION_MS = 15_000;
    for (let t = 0; t < FOUR_HOURS; t += PER_QUESTION_MS) {
      s.request();
      vi.advanceTimersByTime(PER_QUESTION_MS);
    }

    // The ceiling the interval promises.
    expect(syncs).toBeLessThanOrEqual(FOUR_HOURS / MIN_SYNC_INTERVAL_MS + 1);
    // The regression this guards: the old plain 5 s debounce fired once per
    // question — 960 syncs, and so most of a 1,000-write day, in one sitting.
    const oldPolicyWrites = FOUR_HOURS / PER_QUESTION_MS;
    expect(syncs).toBeLessThan(oldPolicyWrites / 10);
  });

  it('cancel drops the pending sync and leaves the scheduler reusable', () => {
    vi.useFakeTimers();
    let syncs = 0;
    const s = createSyncScheduler(() => syncs++);

    s.request();
    expect(s.isPending()).toBe(true);
    s.cancel();
    expect(s.isPending()).toBe(false);
    vi.advanceTimersByTime(MIN_SYNC_INTERVAL_MS * 2);
    expect(syncs).toBe(0);

    // Reusable: cancel must clear the pending flag, or `request` would see a
    // stale timer and never schedule again for the life of the session.
    s.request();
    vi.advanceTimersByTime(MIN_SYNC_INTERVAL_MS * 2);
    expect(syncs).toBe(1);
  });

  it('applies the floor to a sync that ran by another path', () => {
    vi.useFakeTimers();
    let syncs = 0;
    const s = createSyncScheduler(() => syncs++);

    vi.advanceTimersByTime(MIN_SYNC_INTERVAL_MS * 2);
    s.markSynced();           // e.g. the "Sincronizar ahora" button
    s.request();
    vi.advanceTimersByTime(MIN_SYNC_INTERVAL_MS - 1_000);
    expect(syncs).toBe(0);    // still inside the floor
    vi.advanceTimersByTime(2_000);
    expect(syncs).toBe(1);
  });
});
