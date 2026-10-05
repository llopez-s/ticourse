import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, type IconName } from '../../../../../engine/src/ui';

/**
 * Small labels shared by s02 and s03: the violet exam term (English, as the
 * exam names it), a «where to look» callout chip and a lowercase rubber stamp
 * (the engine's Stamp uppercases, and canon strings are lowercase).
 * Frames are Sequence-relative. Not positioned.
 */

/** The violet exam term: mortarboard + term, optional line under it. Springs in at `at`. */
export function TermTag({
  frame,
  fps,
  at,
  term,
  sub,
  subAt,
  size = 48,
  subSize = 32,
  dim = 0,
  align = 'left',
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
  dim?: number;
  align?: 'left' | 'center' | 'right';
  style?: CSSProperties;
}) {
  if (frame < at - 2) return null;
  const p = Math.min(1, springIn(frame, fps, at, { damping: 16 }));
  const sp = subAt === undefined ? 1 : progress(frame, subAt, 14);
  const items = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: items,
        gap: 6,
        padding: '14px 26px 16px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 34px ${alpha(C.violet, 0.24)}`,
        fontFamily: FONT.sans,
        transform: `translateY(${(1 - p) * 14}px) scale(${0.94 + 0.06 * p})`,
        ...dimStyle(dim, Math.min(1, p * 1.3)),
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
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

/** A «where to look» chip in a tone: 32 px text, optional icon. `p` 0–1 appears, `dim` steps it back. */
export function LookTag({
  text,
  tone,
  p,
  dim = 0,
  icon,
  size = 32,
  style,
}: {
  text: ReactNode;
  tone: string;
  p: number;
  dim?: number;
  icon?: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: `8px ${Math.round(size * 0.66)}px`,
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.18)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 22px ${alpha(tone, 0.22)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 780,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        transform: `translateY(${(1 - v) * 10}px)`,
        ...dimStyle(dim, v),
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={tone} strokeWidth={2.4} /> : null}
      {text}
    </div>
  );
}

/** Rubber stamp that hits at `at` and settles in 9 frames (lowercase text). */
export function MarkStamp({
  frame,
  at,
  children,
  tone = C.emerald,
  soft = '#6ee7b7',
  icon,
  rotate = -7,
  size = 44,
  style,
}: {
  frame: number;
  at: number;
  children: ReactNode;
  tone?: string;
  soft?: string;
  icon?: IconName;
  rotate?: number;
  size?: number;
  style?: CSSProperties;
}) {
  if (frame < at) return null;
  const p = progress(frame, at, 9, EASE.out);
  const hit = 1 - progress(frame, at + 6, 30, EASE.inOut);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        padding: `${Math.round(size * 0.16)}px ${Math.round(size * 0.48)}px`,
        borderRadius: RADIUS.md,
        border: `5px solid ${tone}`,
        background: alpha(C.ink950, 0.85),
        color: soft,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 850,
        letterSpacing: 0.5,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, p * 1.6),
        transform: `rotate(${rotate}deg) scale(${1.5 - 0.5 * p})`,
        boxShadow: `0 0 ${18 + 30 * hit}px ${alpha(tone, 0.2 + 0.4 * hit)}`,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 0.95)} color={tone} strokeWidth={2.6} /> : null}
      {children}
    </div>
  );
}
