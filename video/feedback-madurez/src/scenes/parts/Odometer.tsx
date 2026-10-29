import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';

/**
 * Rolling digit counter whose digits are always a blur: it says «this goes up»
 * without ever showing a readable number. Digit strips scroll upward at their
 * own speed (the rightmost is the fastest); nothing flashes. Empty cells wait
 * until `startAt`, and the filled part grows leftwards over `grow` frames.
 */
export function Odometer({
  frame,
  startAt,
  digits = 6,
  size = 84,
  color = C.cyan,
  blur = 5,
  grow = 80,
  seed = 0,
}: {
  frame: number;
  startAt: number;
  digits?: number;
  size?: number;
  color?: string;
  blur?: number;
  grow?: number;
  seed?: number;
}) {
  const cellW = Math.round(size * 0.62);
  const lh = Math.round(size * 1.12);
  const filled = Math.max(0, Math.min(digits, Math.round(1 + (digits - 1) * progress(frame, startAt, grow))));
  const running = frame >= startAt;
  return (
    <div style={{ display: 'inline-flex', gap: Math.round(size * 0.08), fontFamily: FONT.mono, fontSize: size, fontWeight: 800 }}>
      {Array.from({ length: digits }, (_, k) => {
        // k = 0 is the leftmost cell; `c` counts from the right.
        const c = digits - 1 - k;
        const on = running && c < filled;
        const speed = 0.34 / (1 + 0.55 * c) + 0.02 * ((seed + c) % 3);
        const offset = ((frame - startAt) * speed + c * 3.7 + seed * 1.9) % 10;
        return (
          <div
            key={k}
            style={{
              width: cellW,
              height: lh,
              overflow: 'hidden',
              borderRadius: Math.round(size * 0.14),
              background: alpha(C.ink700, on ? 0.75 : 0.45),
              border: `2px solid ${alpha(color, on ? 0.35 : 0.12)}`,
              boxSizing: 'border-box',
              color,
              lineHeight: `${lh}px`,
              textAlign: 'center',
            }}
          >
            {on ? (
              <div style={{ transform: `translateY(${-offset * lh}px)`, filter: `blur(${blur}px)`, opacity: 0.9 }}>
                {Array.from({ length: 20 }, (_, d) => (
                  <div key={d} style={{ height: lh }}>
                    {d % 10}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
