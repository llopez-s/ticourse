import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { EASE, progress } from '../theme/motion';

/**
 * Legibility defaults from the 2026-09-29 video review (§2): whatever the
 * voice is explaining reads at 48–60 px at 1080p (checked at 480 px wide);
 * `min` is the floor for a key label, `sub` for its supporting line. Every
 * scene-kit component defaults its focused text to these.
 */
export const FOCUS_TEXT = { min: 44, key: 48, big: 56, sub: 32 } as const;

/** How far an element steps back at full dim (it matches V4's dimStyle). */
export const DIM = { opacity: 0.4, saturate: 0.5, scale: 0.96 } as const;

/** A focus input: a 0–1 weight, a boolean, or a frame window [from, to). */
export type FocusInput = number | boolean | readonly [number, number];

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Linear blend with a clamped weight (for positions and scales driven by focus weights). */
export function mix(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

/**
 * Style that pushes back an element the narration is not on: at `d` = 1 it
 * sits at 40 % opacity and half saturation. `base` is the element's own
 * opacity (appear / fade), multiplied in.
 */
export function dimStyle(d: number, base = 1): CSSProperties {
  const k = clamp01(d);
  return {
    opacity: base * (1 - (1 - DIM.opacity) * k),
    filter: k > 0.001 ? `saturate(${1 - (1 - DIM.saturate) * k})` : undefined,
  };
}

/**
 * 0–1 weight of a frame window [from, to): eases in over `ramp` frames and
 * out again at `to`. `lead` starts both ramps a little early so the visual
 * lands as the word is said. `to` may be Infinity (never leaves).
 */
export function windowWeight(frame: number, from: number, to = Number.POSITIVE_INFINITY, { ramp = 10, lead = 4 } = {}): number {
  const inP = progress(frame, from - lead, ramp, EASE.inOut);
  const outP = Number.isFinite(to) ? progress(frame, to - lead, ramp, EASE.inOut) : 0;
  return inP * (1 - outP);
}

/** Resolves a FocusInput to a 0–1 weight at `frame`. */
export function focusWeight(input: FocusInput | undefined, frame: number, opts?: { ramp?: number; lead?: number }): number {
  if (input === undefined || input === false) return 0;
  if (input === true) return 1;
  if (typeof input === 'number') return clamp01(input);
  return windowWeight(frame, input[0], input[1], opts);
}

/**
 * Which of N items is in focus at `frame`: the last one whose start frame has
 * been reached (−1 before the first, and from `end` on). `starts` are frames
 * relative to the Sequence, in any order of appearance but one per item.
 */
export function focusIndex(frame: number, starts: readonly number[], end = Number.POSITIVE_INFINITY): number {
  if (frame >= end) return -1;
  let best = -1;
  let bestAt = Number.NEGATIVE_INFINITY;
  starts.forEach((at, i) => {
    if (frame >= at && at >= bestAt) {
      best = i;
      bestAt = at;
    }
  });
  return best;
}

/**
 * Smooth version of focusIndex: one 0–1 weight per item. Item i is in focus
 * from starts[i] until the next start (or `end`), with eased cross-fades.
 * `dims[i]` is how strongly SOME OTHER item is in focus — feed it to
 * dimStyle / <Focus dim>. When nothing is in focus nothing is dimmed.
 */
export function focusWeights(
  frame: number,
  starts: readonly number[],
  { ramp = 10, lead = 4, end = Number.POSITIVE_INFINITY }: { ramp?: number; lead?: number; end?: number } = {},
): { weights: number[]; dims: number[] } {
  const sorted = [...starts].sort((a, b) => a - b);
  const weights = starts.map((at) => {
    const next = sorted.find((s) => s > at) ?? end;
    return windowWeight(frame, at, Math.min(next, end), { ramp, lead });
  });
  const dims = weights.map((_, i) => weights.reduce((m, w, j) => (j === i ? m : Math.max(m, w)), 0));
  return { weights, dims };
}

/** Hook form of focusIndex + focusWeights at the current (Sequence-relative) frame. */
export function useFocus(starts: readonly number[], opts?: { ramp?: number; lead?: number; end?: number }) {
  const frame = useCurrentFrame();
  const { weights, dims } = focusWeights(frame, starts, opts);
  return { frame, index: focusIndex(frame + (opts?.lead ?? 4), starts, opts?.end), weights, dims };
}

/**
 * Focus / dim wrapper — «enlarge what the voice explains and dim the rest».
 * `focus` scales the children up (to `scale`) at full strength; `dim` (another
 * element is in focus) steps them back: ~40 % opacity, half saturation and a
 * slight scale-down. Focus wins over dim. Children may be a function that
 * receives both weights (e.g. to drive a glow).
 */
export function Focus({
  focus,
  dim,
  scale = 1.12,
  dimScale = DIM.scale,
  origin = 'center',
  ramp,
  lead,
  frame: frameProp,
  children,
  style,
}: {
  focus?: FocusInput;
  dim?: FocusInput;
  /** Scale at full focus. */
  scale?: number;
  /** Scale at full dim. */
  dimScale?: number;
  /** CSS transform-origin (e.g. 'left center' for a row that grows rightwards). */
  origin?: string;
  ramp?: number;
  lead?: number;
  frame?: number;
  children: ReactNode | ((w: { focus: number; dim: number }) => ReactNode);
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const f = focusWeight(focus, frame, { ramp, lead });
  const d = focusWeight(dim, frame, { ramp, lead }) * (1 - f);
  const k = 1 + (scale - 1) * f + (dimScale - 1) * d;
  const dimmed = dimStyle(d);
  return (
    <div
      style={{
        transform: Math.abs(k - 1) > 0.0005 ? `scale(${k})` : undefined,
        transformOrigin: origin,
        ...style,
        opacity: (style?.opacity === undefined ? 1 : Number(style.opacity)) * (dimmed.opacity as number),
        filter: [style?.filter, dimmed.filter].filter(Boolean).join(' ') || undefined,
      }}
    >
      {typeof children === 'function' ? children({ focus: f, dim: d }) : children}
    </div>
  );
}
