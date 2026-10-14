import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EXAM_TEXT } from '../../../data/s03-apreton';

/** Absolutely placed text. `anchor` says which point of the box (x, y) is: its left edge, centre or right edge (always its top). */
export function Txt({
  x,
  y,
  size,
  children,
  anchor = 'left',
  color = C.text,
  weight = 700,
  mono = false,
  opacity = 1,
  style,
}: {
  x: number;
  y: number;
  size: number;
  children: ReactNode;
  anchor?: 'left' | 'center' | 'right';
  color?: string;
  weight?: number;
  mono?: boolean;
  opacity?: number;
  style?: CSSProperties;
}) {
  if (opacity <= 0.001) return null;
  const shift = anchor === 'center' ? '-50%' : anchor === 'right' ? '-100%' : '0';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateX(${shift})`,
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.15,
        letterSpacing: mono ? 0 : -0.2,
        color,
        whiteSpace: 'nowrap',
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** An exam name: violet capitals in a violet-edged pill. Inline, so it can sit inside a line of text. */
export function ExamTag({ children, size = 28, lit = 1, style }: { children: ReactNode; size?: number; lit?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${Math.round(size * 0.14)}px ${Math.round(size * 0.5)}px ${Math.round(size * 0.18)}px`,
        borderRadius: Math.round(size * 0.45),
        border: `2px solid ${alpha(C.violet, 0.35 + 0.35 * lit)}`,
        background: alpha('#1a1033', 0.9),
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.violet, 0.3 * lit)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 850,
        letterSpacing: 1.2,
        lineHeight: 1.1,
        color: EXAM_TEXT,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** A full-stage SVG layer in stage-local units. */
export function Layer({ children, opacity = 1 }: { children: ReactNode; opacity?: number }) {
  return (
    <svg width={1728} height={660} viewBox="0 0 1728 660" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity }}>
      {children}
    </svg>
  );
}
