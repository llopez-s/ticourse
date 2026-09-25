import { TIMELINE } from '../../../timeline/load';
import type { SceneProps } from '../../../../../engine/src/timeline/types';
import { EASE, progress } from '../../../../../engine/src/theme/motion';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9%]/g, '');

/**
 * Local frame at which `word` starts being spoken inside narration segment
 * `segmentId` (its `nth` occurrence). Falls back to `fallback` when the
 * narration no longer contains that word, so re-wording never breaks a render.
 */
export function wordFrame(
  segments: SceneProps['segments'],
  segmentId: string,
  word: string,
  fallback: number,
  nth = 0,
): number {
  const abs = TIMELINE.segments.find((s) => s.id === segmentId);
  const local = segments.find((s) => s.id === segmentId);
  if (!abs || !local) return fallback;
  const hit = abs.words.filter((w) => norm(w.text) === norm(word))[nth];
  return hit ? local.from + (hit.from - abs.from) : fallback;
}

/** Local start frame of a narration segment (or `fallback`). */
export function segmentFrom(segments: SceneProps['segments'], segmentId: string, fallback: number): number {
  return segments.find((s) => s.id === segmentId)?.from ?? fallback;
}

/**
 * A value that eases from one level to the next at each keyframe:
 * starts at `initial`, then moves to `to` over `duration` frames from `at`.
 * Keyframes must be in chronological order.
 */
export function steps(frame: number, initial: number, keys: { at: number; to: number }[], duration = 10): number {
  let value = initial;
  for (const key of keys) {
    value += (key.to - value) * progress(frame, key.at, duration, EASE.inOut);
  }
  return value;
}
