import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { progress, springIn } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, tone as toneOf, type IconName, type Tone } from '../../../../../engine/src/ui';

/**
 * Small pieces of chapter II (s04 and s05): the violet exam term (redrawn from V11's
 * `parts/s02-familias/Marks.tsx`), a centred caption, a fact chip, and the shipping company's
 * badge (redrawn from V11's `Parties.tsx`: V12 cannot import V11's files). Frames are
 * Sequence-relative; nothing reads the timeline.
 */

/** The violet exam term: mortarboard + big term, optional line under it. Springs in at `at`. */
export function TermTag({
  frame,
  fps,
  at,
  term,
  sub,
  subAt,
  size = 58,
  subSize = 34,
  align = 'center',
  style,
}: {
  frame: number;
  fps: number;
  at: number;
  term: ReactNode;
  sub?: ReactNode;
  subAt?: number;
  size?: number;
  subSize?: number;
  align?: 'left' | 'center';
  style?: CSSProperties;
}) {
  if (frame < at - 2) return null;
  const p = springIn(frame, fps, at, { damping: 16 });
  const sp = subAt === undefined ? 1 : progress(frame, subAt, 14);
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: 8,
        padding: '16px 30px 18px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 36px ${alpha(C.violet, 0.25)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - Math.min(1, p)) * 16}px) scale(${0.94 + 0.06 * Math.min(1, p)})`,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
        <Icon name="mortarboard" size={Math.round(size * 0.85)} color={C.violet} />
        <span style={{ fontSize: size, fontWeight: 850, letterSpacing: 0.5, color: '#c4b5fd' }}>{term}</span>
      </div>
      {sub && sp > 0 ? (
        <div style={{ height: Math.round(subSize * 1.25 * sp), overflow: 'hidden' }}>
          <div style={{ fontSize: subSize, fontWeight: 700, lineHeight: 1.25, color: C.text, whiteSpace: 'nowrap', opacity: sp, transform: `translateY(${(1 - sp) * 6}px)` }}>{sub}</div>
        </div>
      ) : null}
    </div>
  );
}

/** A caption centred on `x` (or left-aligned from it), sliding up as `show` goes 0→1. */
export function Caption({
  x,
  y,
  show,
  size = 40,
  color = C.textStrong,
  weight = 800,
  align = 'center',
  children,
  style,
}: {
  x: number;
  y: number;
  show: number;
  size?: number;
  color?: string;
  weight?: number;
  align?: 'center' | 'left' | 'right';
  children: ReactNode;
  style?: CSSProperties;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateX(${tx}) translateY(${(1 - s) * 10}px)`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.18,
        color,
        whiteSpace: 'nowrap',
        textAlign: align,
        opacity: s,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A chip with an icon in its tone (a fact, a cost, a reason). */
export function FactChip({
  children,
  icon,
  tone = 'amber',
  size = 36,
  glow = 0,
  dashed = false,
  style,
}: {
  children: ReactNode;
  icon?: IconName;
  tone?: Tone;
  size?: number;
  glow?: number;
  dashed?: boolean;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  const g = clamp01(glow);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.32),
        padding: `${Math.round(size * 0.24)}px ${Math.round(size * 0.6)}px ${Math.round(size * 0.24)}px ${Math.round(size * (icon ? 0.42 : 0.6))}px`,
        borderRadius: RADIUS.pill,
        border: `${dashed ? 3 : 2}px ${dashed ? 'dashed' : 'solid'} ${alpha(t.fg, 0.6 + 0.4 * g)}`,
        background: `linear-gradient(180deg, ${alpha(t.fg, 0.12 + 0.1 * g)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(26 * g)}px ${alpha(t.fg, 0.3 * g)}` : `0 10px 24px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 780,
        lineHeight: 1.15,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={t.fg} strokeWidth={2.3} /> : null}
      {children}
    </span>
  );
}

/** The shipping company's container ship (never named), V11's glyph. */
export function ShipGlyph({ size, color = C.emerald }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <g stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <rect x={16} y={46} width={16} height={14} rx={1.5} fill={alpha(color, 0.35)} />
        <rect x={34} y={46} width={16} height={14} rx={1.5} fill={alpha(color, 0.2)} />
        <rect x={52} y={46} width={16} height={14} rx={1.5} fill={alpha(color, 0.35)} />
        <rect x={25} y={32} width={16} height={14} rx={1.5} fill={alpha(color, 0.2)} />
        <rect x={43} y={32} width={16} height={14} rx={1.5} fill={alpha(color, 0.35)} />
        <rect x={72} y={30} width={14} height={30} rx={2} fill={alpha(color, 0.15)} />
        <path d="M 75 37 L 83 37" fill="none" />
        <path d="M 6 61 L 94 61 L 84 80 L 16 80 Z" fill={alpha(color, 0.22)} />
        <path d="M 4 90 Q 13 85 22 90 Q 31 95 40 90 Q 49 85 58 90 Q 67 95 76 90 Q 85 85 96 90" fill="none" strokeWidth={3} />
      </g>
    </svg>
  );
}

/** V11's round badge for the shipping company: the ship in a glowing ring, its label under it. */
export function ShipBadge({ size, label, labelSize = 32, glow = 0 }: { size: number; label?: string; labelSize?: number; glow?: number }) {
  const g = clamp01(glow);
  const color = C.emerald;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(size * 0.08), fontFamily: FONT.sans }}>
      <div
        style={{
          width: size,
          height: size,
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `${Math.max(2, Math.round(size * 0.03))}px solid ${alpha(color, 0.7 + 0.3 * g)}`,
          background: `radial-gradient(circle at 50% 35%, ${alpha(color, 0.18 + 0.1 * g)} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
          boxShadow: `0 0 ${Math.round(10 + 30 * g)}px ${alpha(color, 0.12 + 0.35 * g)}, 0 16px 36px ${alpha('#000000', 0.4)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ShipGlyph size={size * 0.68} color={color} />
      </div>
      {label ? <div style={{ fontSize: labelSize, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap', lineHeight: 1.1 }}>{label}</div> : null}
    </div>
  );
}
