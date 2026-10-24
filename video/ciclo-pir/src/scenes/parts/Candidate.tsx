import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';

/**
 * A candidate PIR: a card with its letter. Neutral (no colour of answer) until `lit` rises: then the well-formed one
 * glows emerald; `dim` steps the other one back. `children` is the sentence.
 */
export function Candidate({ width, height, letter, lit = 0, dim = 0, show = 1, children, style }: { width: number; height: number; letter: string; lit?: number; dim?: number; show?: number; children: ReactNode; style?: CSSProperties }) {
  const edge = lit > 0.02 ? alpha(C.emerald, 0.4 + 0.55 * lit) : alpha(C.cyan, 0.45);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 32px 0 24px',
        borderRadius: RADIUS.lg,
        border: `${lit > 0.5 ? 4 : 3}px solid ${edge}`,
        background: `linear-gradient(180deg, ${alpha(lit > 0.02 ? C.emerald : C.cyan, 0.06 + 0.1 * lit)} 0%, ${alpha(C.ink900, 0.97)} 70%)`,
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(44 * lit)}px ${alpha(C.emerald, 0.35 * lit)}` : `0 20px 50px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        opacity: show * (1 - 0.65 * dim),
        filter: dim > 0.01 ? `saturate(${1 - 0.7 * dim})` : undefined,
        transform: `translateY(${(1 - show) * 18}px)`,
        ...style,
      }}
    >
      <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 36, display: 'grid', placeItems: 'center', background: lit > 0.5 ? C.emerald : alpha(C.cyan, 0.14), border: `3px solid ${lit > 0.02 ? C.emerald : alpha(C.cyan, 0.7)}`, fontSize: 44, fontWeight: 900, color: lit > 0.5 ? C.ink950 : C.cyanSoft }}>{letter}</div>
      <div style={{ fontSize: 40, fontWeight: 750, lineHeight: 1.2, color: C.textStrong, letterSpacing: -0.3 }}>{children}</div>
    </div>
  );
}
