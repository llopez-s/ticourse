import { C, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';

const LEVELS = [0.16, 0.34, 0.54, 0.76, 1];
const level = (seed: number, i: number) => LEVELS[Math.floor((Math.abs(Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453) % 1) * LEVELS.length)];

/**
 * A conceptual fingerprint: a row of cells whose brightness stands for the content, never a real hash. From
 * `altAt` the cells switch (one every `step` frames) to the `alt` pattern: all of them, or only `only`, which
 * are then outlined in amber (the fuzzy-hash case: most cells stay equal).
 */
export function HashBar({
  frame,
  at,
  seed,
  tone = C.cyan,
  cells = 12,
  cell = 38,
  gap = 4,
  h = 44,
  alt,
  altAt = 0,
  step = 3,
  only,
}: {
  frame: number;
  at: number;
  seed: number;
  tone?: string;
  cells?: number;
  cell?: number;
  gap?: number;
  h?: number;
  alt?: number;
  altAt?: number;
  step?: number;
  only?: number[];
}) {
  return (
    <div style={{ display: 'flex', gap }}>
      {Array.from({ length: cells }, (_, i) => {
        const inAlt = alt !== undefined && (!only || only.includes(i));
        const switched = inAlt && frame >= altAt + i * step;
        const flash = inAlt ? 1 - progress(frame, altAt + i * step, 10) : 0;
        const lv = level(switched ? alt! : seed, i);
        const marked = !!only && switched;
        const p = progress(frame, at + i * 2, 8);
        return (
          <div
            key={i}
            style={{
              boxSizing: 'border-box',
              width: cell,
              height: h,
              borderRadius: 6,
              opacity: p,
              background: alpha(marked ? C.amber : tone, lv * (marked ? 0.85 : 0.9)),
              border: `2px solid ${marked ? C.amber : alpha(tone, 0.45)}`,
              boxShadow: flash > 0 ? `0 0 ${14 * flash}px ${alpha(C.amber, 0.7 * flash)}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
