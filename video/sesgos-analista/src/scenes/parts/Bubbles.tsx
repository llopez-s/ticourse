import type { CSSProperties, ReactNode } from 'react';
import { ACCENT, C, FONT, alpha, type Accent } from '../../../../engine/src/theme/tokens';

/**
 * A thought bubble: a rounded box. A normal-flow box `width` px wide (its height follows the content);
 * wrap it in a positioned div and hang a `Trail` off the side that faces the thinker.
 *   tone = 'cyan'    border / glow colour (an Accent)
 *   pop = 1          0–1: the bubble swelling in (opacity and scale)
 *   glow = 0 · dim = 0 · style? extra CSS
 */
export function ThoughtBubble({
  width,
  children,
  tone = 'cyan',
  pop = 1,
  glow = 0,
  dim = 0,
  origin = '50% 100%',
  style,
}: {
  width: number;
  children: ReactNode;
  tone?: Accent;
  pop?: number;
  glow?: number;
  dim?: number;
  origin?: string;
  style?: CSSProperties;
}) {
  const a = ACCENT[tone];
  return (
    <div
      style={{
        position: 'relative',
        width,
        boxSizing: 'border-box',
        padding: '22px 32px 26px',
        borderRadius: 40,
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
        border: `3px solid ${alpha(a.fg, 0.5 + 0.4 * glow)}`,
        boxShadow: `0 18px 44px ${alpha('#000000', 0.4)}, 0 0 ${Math.round(34 * glow)}px ${alpha(a.fg, 0.3 * glow)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, pop * 1.5) * (1 - 0.55 * dim),
        transform: `scale(${0.82 + 0.18 * Math.min(1, pop)})`,
        transformOrigin: origin,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * The trail of a thought bubble: two circles, the small one nearest the thinker. Zero-size anchor: position
 * it where the trail starts and it hangs `dir` of that point ('down', 'right' or 'left').
 */
export function Trail({ dir = 'down', opacity = 1, tone = 'cyan' }: { dir?: 'down' | 'right' | 'left'; opacity?: number; tone?: Accent }) {
  const a = ACCENT[tone];
  const sign = dir === 'left' ? -1 : 1;
  const pts: [number, number, number][] = dir === 'down' ? [[30, 0, 24], [18, 12, 64]] : [[30, sign * 24, 0], [18, sign * 64, 12]];
  return (
    <div style={{ position: 'relative', width: 0, height: 0, opacity }}>
      {pts.map(([s, dx, dy]) => (
        <div
          key={s}
          style={{
            position: 'absolute',
            left: dx - s / 2,
            top: dy - s / 2,
            width: s,
            height: s,
            borderRadius: '50%',
            background: C.ink850,
            border: `3px solid ${alpha(a.fg, 0.55)}`,
          }}
        />
      ))}
    </div>
  );
}

/** A name hidden behind bars (no readable letters): striped, slightly different widths. `sweep` 0–1 wipes them on. */
export function NameBars({ widths = [150, 96], height = 30, sweep = 1, tone = C.muted }: { widths?: readonly number[]; height?: number; sweep?: number; tone?: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: 12, verticalAlign: 'middle' }}>
      {widths.map((w, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: w,
            height,
            borderRadius: height / 2,
            background: `repeating-linear-gradient(135deg, ${alpha(tone, 0.85)} 0 8px, ${alpha(tone, 0.55)} 8px 16px)`,
            border: `2px solid ${alpha(tone, 0.9)}`,
            boxSizing: 'border-box',
            clipPath: `inset(0 ${Math.round((1 - Math.max(0, Math.min(1, sweep * 1.3 - i * 0.3))) * 100)}% 0 0)`,
          }}
        />
      ))}
    </span>
  );
}
