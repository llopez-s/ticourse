import { Easing, interpolate, spring } from 'remotion';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  linear: (t: number) => t,
} as const;

/** 0→1 between frames [start, start+duration], eased and clamped. */
export function progress(frame: number, start: number, duration = 18, easing: (t: number) => number = EASE.out): number {
  if (duration <= 0) return frame >= start ? 1 : 0;
  return interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing });
}

/** Opacity for an element that appears at `start`. */
export function fadeIn(frame: number, start: number, duration = 12): number {
  return progress(frame, start, duration, EASE.out);
}

/** Opacity for an element that disappears at `start`. */
export function fadeOut(frame: number, start: number, duration = 12): number {
  return 1 - progress(frame, start, duration, EASE.inOut);
}

/** Enter transform: slides `distance` px along an axis and fades in. */
export function enter(
  frame: number,
  start: number,
  { distance = 28, duration = 18, axis = 'y' as 'x' | 'y' } = {},
): { opacity: number; transform: string } {
  const p = progress(frame, start, duration);
  const offset = (1 - p) * distance;
  return {
    opacity: p,
    transform: axis === 'y' ? `translateY(${offset}px)` : `translateX(${offset}px)`,
  };
}

/** Physical pop (0→1 with slight overshoot) starting at `start`. */
export function springIn(frame: number, fps: number, start: number, { damping = 14, mass = 0.8 } = {}): number {
  return spring({ frame: frame - start, fps, config: { damping, mass, stiffness: 140 } });
}

/** Start frame of item `index` in a staggered list. */
export function stagger(start: number, index: number, step = 5): number {
  return start + index * step;
}

/** Characters of `text` visible for a typewriter effect at `cps` characters per second. */
export function typewriter(text: string, frame: number, start: number, fps: number, cps = 38): string {
  const n = Math.max(0, Math.floor(((frame - start) / fps) * cps));
  return text.slice(0, Math.min(text.length, n));
}

/** Eased numeric count between two values. */
export function countUp(frame: number, start: number, duration: number, from: number, to: number): number {
  return from + (to - from) * progress(frame, start, duration, EASE.inOut);
}

/**
 * Gentle 0→1→0 pulse. Frequency is capped at 1 Hz (photosensitivity rule:
 * nothing on screen may flash faster).
 */
export function pulse(frame: number, fps: number, hz = 0.8): number {
  const f = Math.min(1, hz);
  return 0.5 - 0.5 * Math.cos((2 * Math.PI * f * frame) / fps);
}

/** Linear interpolation helper that is always clamped. */
export function lerp(frame: number, input: [number, number], output: [number, number]): number {
  return interpolate(frame, input, output, clamp);
}

/** Formats an integer with Spanish thousands separator: 6000 → "6.000". */
export function fmtInt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
