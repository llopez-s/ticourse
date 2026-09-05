import type { CardState, Grade } from './types';
import { addDays } from './util';

/**
 * Simplified SM-2 spaced repetition.
 * Grades: 0 = Again, 3 = Hard, 4 = Good, 5 = Easy.
 */
export function review(
  cs: CardState | undefined,
  grade: Grade,
  today: string,
): CardState {
  const c: CardState = cs
    ? { ...cs }
    : { ease: 2.5, interval: 0, due: today, reps: 0, lapses: 0 };

  if (grade === 0) {
    if (c.reps > 0) c.lapses += 1;
    c.reps = 0;
    c.interval = 0;
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.due = today; // stays in today's queue
    return c;
  }

  if (c.reps === 0) {
    c.interval = grade === 5 ? 3 : 1;
  } else {
    const mult = grade === 3 ? 1.2 : grade === 4 ? c.ease : c.ease * 1.3;
    c.interval = Math.max(c.interval + 1, Math.round(c.interval * mult));
  }
  if (grade === 3) c.ease = Math.max(1.3, c.ease - 0.15);
  if (grade === 5) c.ease = Math.min(3.0, c.ease + 0.1);
  c.reps += 1;
  c.due = addDays(today, c.interval);
  return c;
}

/** New cards introduced per day, Anki-style */
export const NEW_PER_DAY = 10;

/** A card is "mature" once its interval reaches 21 days (Anki convention). */
export const isMature = (cs: CardState | undefined) =>
  !!cs && cs.interval >= 21;

export interface Queue {
  due: string[]; // learned cards whose due date has arrived
  fresh: string[]; // never-seen cards (limited per day)
}

export function buildQueue(
  srs: Record<string, CardState>,
  allIds: string[],
  today: string,
  newRemaining: number,
): Queue {
  const due = allIds
    .filter((id) => srs[id] && srs[id].due <= today)
    .sort((a, b) => (srs[a].due < srs[b].due ? -1 : 1));
  const fresh = allIds
    .filter((id) => !srs[id])
    .slice(0, Math.max(0, newRemaining));
  return { due, fresh };
}
