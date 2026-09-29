import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { FONT, RADIUS, alpha } from '../theme/tokens';
import { EASE, progress } from '../theme/motion';
import { FOCUS_TEXT } from './Focus';
import { Icon } from './Icon';
import { tone as toneOf, type Tone } from './tone';

/**
 * The «hand-made key» (a self-signed certificate, anything that is only the
 * actor's): a key icon in a glowing circle — or a rounded tile, for the small
 * badge that sits next to every server presenting it — plus an optional big
 * label and a mono sub-pill (e.g. a CN). From V4 s05-cert/bits KeyBadge,
 * S06Ct's «autofirmado» pill and s11-recap's HandKey. Emerald by default
 * (validated / dedicated); keep one colour wherever the same key reappears.
 * With `at`, the badge pops in and the key turns a little into place.
 */
export function KeyBadge({
  size = 120,
  shape = 'circle',
  tone = 'emerald',
  glow = 0,
  label,
  sub,
  labelSize = FOCUS_TEXT.key,
  subSize = 30,
  direction = 'row',
  at,
  frame: frameProp,
  style,
}: {
  /** Diameter of the circle / side of the tile. */
  size?: number;
  shape?: 'circle' | 'tile';
  tone?: Tone;
  /** 0–1 halo (e.g. while the voice is on it). */
  glow?: number;
  label?: ReactNode;
  /** Mono pill under / next to the label (e.g. «CN=…»). */
  sub?: string;
  labelSize?: number;
  subSize?: number;
  direction?: 'row' | 'column';
  /** Frame the badge pops in (omitted: static). */
  at?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const t = toneOf(tone);
  const p = at === undefined ? 1 : progress(frame, at, 14, EASE.out);
  const turn = at === undefined ? 1 : progress(frame, at + 2, 20, EASE.out);
  const subP = at === undefined ? 1 : progress(frame, at + 8, 12);
  if (p <= 0) return null;
  const tile = shape === 'tile';
  const g = Math.max(0, Math.min(1, glow));
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: direction,
        alignItems: 'center',
        gap: Math.round(size * (direction === 'row' ? 0.2 : 0.14)),
        fontFamily: FONT.sans,
        opacity: p,
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          boxSizing: 'border-box',
          borderRadius: tile ? Math.round(size * 0.24) : size / 2,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          background: alpha(t.fg, 0.12 + 0.12 * g),
          border: `${size >= 80 ? 3 : 2}px solid ${alpha(t.fg, 0.55 + 0.4 * g)}`,
          boxShadow: g > 0 ? `0 0 ${Math.round(12 + 30 * g)}px ${alpha(t.fg, 0.5 * g)}` : undefined,
          transform: `scale(${0.8 + 0.2 * p})`,
        }}
      >
        <div style={{ transform: tile ? undefined : `rotate(${-40 + 20 * turn}deg)` }}>
          <Icon name="key" size={Math.round(size * (tile ? 0.66 : 0.62))} color={t.fg} strokeWidth={2.2} />
        </div>
      </div>
      {label || sub ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: direction === 'row' ? 'flex-start' : 'center', gap: 10 }}>
          {label ? (
            <div style={{ fontSize: labelSize, fontWeight: 850, lineHeight: 1.1, letterSpacing: -0.5, color: t.soft, whiteSpace: 'nowrap' }}>{label}</div>
          ) : null}
          {sub ? (
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: subSize,
                fontWeight: 750,
                color: t.fg,
                padding: `${Math.round(subSize * 0.26)}px ${Math.round(subSize * 0.55)}px`,
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(t.fg, 0.55)}`,
                background: alpha(t.fg, 0.1),
                whiteSpace: 'nowrap',
                opacity: subP,
              }}
            >
              {sub}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
