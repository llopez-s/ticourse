import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { EAP } from '../../../data/s05-eap';
import { STEEL } from '../Glyphs';
import { LANE, W } from './layout';

/** The two groups of s05, the name between them and the think prompt's two buttons. */

const VIOLET_SOFT = '#c4b5fd';

/**
 * One group: a title bar (the exam name, violet) over a body. Neutral steel until `tone` says what
 * the group is worth (`edge`: amber = weaker, emerald = the strong one).
 */
export function Lane({
  x,
  show = 1,
  title,
  tag,
  edge = C.emerald,
  tone = 0,
  glow = 0,
  children,
}: {
  x: number;
  show?: number;
  title: ReactNode;
  /** At the right of the title bar. */
  tag?: ReactNode;
  edge?: string;
  /** 0–1: the frame takes the group's colour. */
  tone?: number;
  glow?: number;
  children?: ReactNode;
}) {
  const s = clamp01(show);
  const t = clamp01(tone);
  const g = clamp01(glow);
  return (
    <div style={{ position: 'absolute', left: x, top: LANE.y, width: LANE.w, height: LANE.h, fontFamily: FONT.sans, opacity: s }}>
      <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `2px solid ${alpha(STEEL.line, 0.7)}`, background: alpha(C.ink900, 0.82), boxShadow: `0 14px 30px ${alpha('#000000', 0.35)}` }} />
      {t > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `3px solid ${alpha(edge, 0.75)}`, boxShadow: `0 0 ${Math.round(10 + 30 * g)}px ${alpha(edge, 0.12 + 0.25 * g)}`, opacity: t }} />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 2,
          top: 2,
          right: 2,
          height: LANE.head - 2,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 14px 0 20px',
          borderRadius: `${RADIUS.md - 2}px ${RADIUS.md - 2}px 0 0`,
          borderBottom: `2px solid ${alpha(STEEL.line, 0.5)}`,
          background: alpha(C.violet, 0.1),
          fontSize: 42,
          fontWeight: 880,
          letterSpacing: 0.6,
          color: VIOLET_SOFT,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
        <span style={{ flex: 1 }} />
        {tag}
      </div>
      {children}
    </div>
  );
}

/** «EAP», between the two title bars: it is what sets the way in, and both groups hang from it. */
export function EapSpine({ show }: { show: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const gap = W - 2 * LANE.w;
  return (
    <div
      style={{
        position: 'absolute',
        left: LANE.w + 8,
        top: LANE.y,
        width: gap - 16,
        height: LANE.head,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.sm,
        border: `3px solid ${alpha(C.violet, 0.9)}`,
        background: alpha(C.violet, 0.2),
        boxShadow: `0 0 22px ${alpha(C.violet, 0.3)}`,
        fontFamily: FONT.sans,
        fontSize: 46,
        fontWeight: 900,
        letterSpacing: 1,
        color: '#ede9fe',
        opacity: s,
        transform: `scale(${0.85 + 0.15 * s})`,
      }}
    >
      {EAP}
    </div>
  );
}

/**
 * One of the think prompt's two buttons, centred in its group's body. While the question is open
 * both look alike; `chosen` 1 = the answer (emerald), −1 = the other one steps back.
 */
export function OptionButton({ label, show, chosen = 0, size = 46 }: { label: string; show: number; chosen?: number; size?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const yes = clamp01(chosen);
  const no = clamp01(-chosen);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: LANE.head, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: s * (1 - 0.62 * no) }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: Math.round(size * 1.8),
          padding: `0 ${Math.round(size * 1.1)}px`,
          boxSizing: 'border-box',
          borderRadius: size,
          border: `3px solid ${yes > 0.01 ? alpha(C.emerald, 0.6 + 0.4 * yes) : alpha(STEEL.light, 0.85)}`,
          background: yes > 0.01 ? `linear-gradient(180deg, ${alpha(C.emerald, 0.26 * yes)} 0%, ${C.ink900} 100%)` : `linear-gradient(180deg, ${alpha(C.ink700, 0.9)} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 0 ${Math.round(12 + 30 * yes)}px ${alpha(yes > 0.01 ? C.emerald : '#e2e8f0', 0.14 + 0.3 * yes)}, 0 12px 26px ${alpha('#000000', 0.45)}`,
          fontSize: size,
          fontWeight: 850,
          letterSpacing: 0.4,
          color: yes > 0.5 ? '#d1fae5' : C.textStrong,
          whiteSpace: 'nowrap',
          filter: no > 0.01 ? `saturate(${1 - 0.6 * no})` : undefined,
          transform: `translateY(${(1 - s) * 12}px) scale(${1 + 0.05 * yes - 0.05 * no})`,
        }}
      >
        {label}
      </div>
    </div>
  );
}
