import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, tone as toneOf, type IconName, type Tone } from '../../../../../engine/src/ui';

/**
 * Small pieces shared by the s02/s03/s06/s07 scenes (copied from iam-halden): a lowercase rubber
 * stamp (the engine's Stamp uppercases its text, and the canon strings are
 * lowercase), the violet exam-term tag, the token chip that flies into a
 * slot, and the flight path helper. All frames are Sequence-relative.
 */

/** Rubber stamp that hits exactly at `at` (onset on the frame: an sfx fires there) and settles in 9 frames. */
export function MarkStamp({
  frame,
  at,
  children,
  tone = 'amber',
  icon,
  rotate = -6,
  size = 44,
  glowOut = 30,
  style,
}: {
  frame: number;
  at: number;
  children: ReactNode;
  tone?: Tone;
  icon?: IconName;
  rotate?: number;
  size?: number;
  /** Frames the impact glow lasts. */
  glowOut?: number;
  style?: CSSProperties;
}) {
  if (frame < at) return null;
  const p = progress(frame, at, 9, EASE.out);
  const hit = 1 - progress(frame, at + 6, glowOut, EASE.inOut);
  const t = toneOf(tone);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        padding: `${Math.round(size * 0.18)}px ${Math.round(size * 0.5)}px`,
        borderRadius: RADIUS.md,
        border: `5px solid ${t.fg}`,
        background: alpha(C.ink950, 0.82),
        color: t.soft,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 850,
        letterSpacing: 0.5,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, p * 1.6),
        transform: `rotate(${rotate}deg) scale(${1.5 - 0.5 * p})`,
        boxShadow: `0 0 ${18 + 30 * hit}px ${alpha(t.fg, 0.2 + 0.4 * hit)}`,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 0.95)} color={t.fg} strokeWidth={2.6} /> : null}
      {children}
    </div>
  );
}

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
        padding: '18px 30px 20px',
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
        // The line under the term opens its own room as it appears (the box grows), so the tag never shows an empty band.
        <div style={{ height: Math.round(subSize * 1.25 * sp), overflow: 'hidden' }}>
          <div style={{ fontSize: subSize, fontWeight: 700, lineHeight: 1.25, color: C.text, whiteSpace: 'nowrap', opacity: sp, transform: `translateY(${(1 - sp) * 6}px)` }}>{sub}</div>
        </div>
      ) : null}
    </div>
  );
}

/** A chip-like token (icon + text) that can glow in its tone. */
export function TokenChip({
  text,
  icon,
  tone = 'cyan',
  glow = 0,
  size = 30,
  mono = false,
  style,
}: {
  text: ReactNode;
  icon?: IconName;
  tone?: Tone;
  glow?: number;
  size?: number;
  mono?: boolean;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  const g = clamp01(glow);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.35),
        padding: `${Math.round(size * 0.26)}px ${Math.round(size * 0.6)}px`,
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(t.fg, 0.55 + 0.45 * g)}`,
        background: `linear-gradient(180deg, ${alpha(t.fg, 0.14 + 0.14 * g)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(26 * g)}px ${alpha(t.fg, 0.4 * g)}` : `0 10px 24px ${alpha('#000000', 0.35)}`,
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontSize: size,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={t.fg} strokeWidth={2.2} /> : null}
      {text}
    </div>
  );
}

export type Pt = { x: number; y: number };

/** Position along a quadratic arc from `from` to `to` between [start, start + dur]; `lift` raises the arc's middle. */
export function flight(frame: number, start: number, dur: number, from: Pt, to: Pt, lift = 80): Pt & { p: number } {
  const p = progress(frame, start, dur, EASE.inOut);
  const cx = (from.x + to.x) / 2;
  const cy = Math.min(from.y, to.y) - lift;
  const x = (1 - p) * (1 - p) * from.x + 2 * (1 - p) * p * cx + p * p * to.x;
  const y = (1 - p) * (1 - p) * from.y + 2 * (1 - p) * p * cy + p * p * to.y;
  return { x, y, p };
}
