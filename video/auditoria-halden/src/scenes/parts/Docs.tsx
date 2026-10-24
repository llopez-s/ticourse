import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/** Three hand-signature squiggles (viewBox 0 0 100 40), so a pile of signatures is not one stamp repeated. */
export const SIGN_PATHS = [
  'M4 28 C 10 4, 18 4, 20 22 S 30 38, 36 16 S 48 6, 54 24 S 68 34, 74 14 S 88 10, 96 26',
  'M4 20 C 14 36, 22 34, 24 12 C 24 4, 32 4, 34 14 S 42 36, 56 20 S 70 4, 80 22 L 96 12',
  'M6 30 L 18 8 L 26 30 L 38 8 C 46 20, 52 30, 62 18 S 80 8, 94 28',
] as const;

/**
 * A handwritten signature drawn left to right: `p` 0–1 is how much of the stroke is on the page (a dashed empty
 * gap when `p` is 0 and `gap` is set).
 */
export function Signature({ p, variant = 0, width = 160, color = C.cyanSoft, strokeWidth = 3.4 }: { p: number; variant?: number; width?: number; color?: string; strokeWidth?: number }) {
  const h = Math.round(width * 0.4);
  return (
    <svg width={width} height={h} viewBox="0 0 100 40" fill="none" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      <path
        d={SIGN_PATHS[variant % SIGN_PATHS.length]}
        pathLength={1}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, p))}
        vectorEffect="non-scaling-stroke"
        style={{ filter: p > 0.02 ? `drop-shadow(0 0 4px ${alpha(color, 0.5)})` : undefined }}
      />
    </svg>
  );
}

/** A dashed empty slot where a signature goes (nothing is signed yet). */
export function SignatureGap({ width = 200, height = 54, color = C.muted, pulse = 0 }: { width?: number; height?: number; color?: string; pulse?: number }) {
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: 12,
        border: `3px dashed ${alpha(color, 0.55 + 0.4 * pulse)}`,
        background: alpha(color, 0.05 + 0.06 * pulse),
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 14px 8px',
      }}
    >
      <div style={{ width: '100%', height: 3, background: alpha(color, 0.5), borderRadius: 2 }} />
    </div>
  );
}

/** Grey text bars: the lines of a sheet whose words do not matter. */
export function Bars({ widths, gap = 14, h = 9, color = C.text, o = 0.28, style }: { widths: readonly number[]; gap?: number; h?: number; color?: string; o?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>
      {widths.map((w, i) => (
        <div key={i} style={{ width: `${w}%`, height: h, borderRadius: h / 2, background: alpha(color, o) }} />
      ))}
    </div>
  );
}

/** A paper sheet: a dark card with a light border, a faint top edge. */
export function Sheet({
  width,
  height,
  tone = C.cyan,
  glow = 0,
  rotate = 0,
  children,
  style,
}: {
  width: number;
  height: number;
  tone?: string;
  glow?: number;
  rotate?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: 14,
        border: `3px solid ${alpha(tone, 0.45 + 0.45 * glow)}`,
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
        boxShadow: `0 10px 26px ${alpha('#000000', 0.4)}, 0 0 ${Math.round(26 * glow)}px ${alpha(tone, 0.35 * glow)}`,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A small person glyph (head and shoulders), for the "one per person" sheets. */
export function PersonGlyph({ size = 26, color = C.sky }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" aria-hidden style={{ display: 'block' }}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}
