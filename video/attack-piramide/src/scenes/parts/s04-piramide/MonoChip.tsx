import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';

/** Height of a MonoChip at `size` (for stacking chips on one rung). */
export function monoChipHeight(size: number): number {
  return Math.round(size * 1.15) + 2 * Math.round(size * 0.28) + 4;
}

/** Approximate width of a MonoChip holding `text` at `size` (mono ≈ 0.6 em per character). */
export function monoChipWidth(text: string, size: number): number {
  return Math.round(text.length * size * 0.6) + 2 * Math.round(size * 0.5) + 4;
}

/**
 * An indicator pill in mono type (a hash, a domain, a path, a technique id),
 * tinted with the colour of its rung. `glow` (0–1) adds a halo.
 */
export function MonoChip({
  children,
  color,
  size = 32,
  glow = 0,
  style,
}: {
  children: ReactNode;
  color: string;
  size?: number;
  glow?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${Math.round(size * 0.28)}px ${Math.round(size * 0.5)}px`,
        borderRadius: RADIUS.sm,
        border: `2px solid ${alpha(color, 0.55 + 0.4 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(color, 0.16 + 0.14 * glow)} 0%, ${alpha(C.ink900, 0.94)} 100%)`,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(30 * glow)}px ${alpha(color, 0.45 * glow)}` : `0 10px 26px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.15,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
