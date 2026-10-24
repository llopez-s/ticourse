import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, dimStyle, tone as toneOf, type IconName, type Tone } from '../../../../engine/src/ui';

/** Absolute box that enters at `at` (fade + slide), optionally dimmed or faded out; every piece in this video uses it. */
export function Pop({
  at,
  frame,
  x,
  y,
  w,
  h,
  distance = 20,
  axis = 'y',
  duration = 16,
  dim = 0,
  out = 0,
  children,
  style,
}: {
  at: number;
  frame: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  distance?: number;
  axis?: 'x' | 'y';
  duration?: number;
  dim?: number;
  /** 0–1: fades the box out. */
  out?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const p = progress(frame, at, duration);
  if (p <= 0 || out >= 1) return null;
  const off = (1 - p) * distance;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: axis === 'y' ? `translateY(${off}px)` : `translateX(${off}px)`,
        ...dimStyle(dim, p * (1 - out)),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Dark card with a tinted border; `glow` (0–1) is the narration being on it, `dashed` an empty slot. */
export function Card({
  tone = 'cyan',
  glow = 0,
  dashed = false,
  pad = 22,
  radius = RADIUS.lg,
  children,
  style,
}: {
  tone?: Tone;
  glow?: number;
  dashed?: boolean;
  pad?: number;
  radius?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: pad,
        borderRadius: radius,
        border: `${dashed ? 3 : 2}px ${dashed ? 'dashed' : 'solid'} ${alpha(t.fg, dashed ? 0.45 : 0.5 + 0.4 * glow)}`,
        background: dashed ? alpha(t.fg, 0.03) : `linear-gradient(180deg, ${alpha(t.fg, 0.1 + 0.08 * glow)} 0%, ${C.ink900} 100%), ${C.ink900}`,
        boxShadow: glow > 0 ? `0 0 ${Math.round(34 * glow)}px ${alpha(t.fg, 0.4 * glow)}` : `0 18px 40px ${alpha('#000000', 0.3)}`,
        fontFamily: FONT.sans,
        color: C.text,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Round icon badge (the card's picture). */
export function Disc({ icon, size = 72, tone = 'cyan', glow = 0 }: { icon: IconName; size?: number; tone?: Tone; glow?: number }) {
  const t = toneOf(tone);
  return (
    <div
      style={{
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        display: 'grid',
        placeItems: 'center',
        background: alpha(t.fg, 0.1 + 0.1 * glow),
        border: `3px solid ${alpha(t.fg, 0.55 + 0.4 * glow)}`,
        boxShadow: glow > 0 ? `0 0 ${Math.round(26 * glow)}px ${alpha(t.fg, 0.4 * glow)}` : undefined,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.56)} color={t.fg} strokeWidth={2} />
    </div>
  );
}

/** The adversary's mark, the same wherever VELVET CICADA appears. */
export function VcStamp({ size = 30, style }: { size?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.35),
        padding: `${Math.round(size * 0.22)}px ${Math.round(size * 0.55)}px`,
        borderRadius: RADIUS.md,
        border: `4px solid ${C.rose}`,
        background: alpha(C.roseDeep, 0.7),
        color: '#fecdd3',
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 850,
        letterSpacing: size * 0.12,
        whiteSpace: 'nowrap',
        lineHeight: 1.1,
        ...style,
      }}
    >
      <Icon name="radar" size={Math.round(size * 1.05)} color={C.rose} strokeWidth={2} />
      VELVET CICADA
    </span>
  );
}

/** Straight arrow (SVG) from (x1,y1) to (x2,y2), drawn to progress `p`; positions are in the parent's coordinates. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  p = 1,
  color = C.muted,
  width = 5,
  dashed = false,
  head = true,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  head?: boolean;
}) {
  const k = Math.max(0, Math.min(1, p));
  if (k <= 0) return null;
  const ex = x1 + (x2 - x1) * k;
  const ey = y1 + (y2 - y1) * k;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hl = 20;
  const a1 = ang + Math.PI * 0.84;
  const a2 = ang - Math.PI * 0.84;
  return (
    <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '4 14' : undefined} />
      {head && k >= 0.98 ? (
        <path d={`M${ex + Math.cos(a1) * hl} ${ey + Math.sin(a1) * hl} L${ex} ${ey} L${ex + Math.cos(a2) * hl} ${ey + Math.sin(a2) * hl}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
    </svg>
  );
}

/** A check mark in a coloured disc (the chosen / validated option). */
export function Tick({ size = 44, tone = 'emerald', p = 1 }: { size?: number; tone?: Tone; p?: number }) {
  const t = toneOf(tone);
  return (
    <span style={{ display: 'inline-grid', placeItems: 'center', width: size, height: size, borderRadius: size / 2, background: t.fg, transform: `scale(${0.6 + 0.4 * p})`, opacity: p }}>
      <Icon name="check" size={Math.round(size * 0.66)} color={C.ink950} strokeWidth={3.2} />
    </span>
  );
}

/** Two choice boxes (the think-prompt options): unmarked until `markAt`, then the chosen one lights and the other steps back. */
export function Choices({
  frame,
  at,
  markAt,
  options,
  chosen,
  width,
  height = 110,
  gap = 28,
}: {
  frame: number;
  at: number;
  markAt: number;
  options: readonly [string, string];
  chosen: 0 | 1;
  width: number;
  height?: number;
  gap?: number;
}) {
  const w = (width - gap) / 2;
  const m = progress(frame, markAt, 14, EASE.inOut);
  return (
    <>
      {options.map((label, i) => {
        const e = progress(frame, at + i * 5, 14);
        const win = i === chosen;
        const fg = win ? C.emerald : C.cyan;
        const k = win ? m : 0;
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: i * (w + gap),
              top: 0,
              width: w,
              height,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(k > 0 ? C.emerald : C.cyan, 0.45 + 0.5 * k)}`,
              background: alpha(k > 0 ? C.emerald : C.cyan, 0.07 + 0.13 * k),
              boxShadow: k > 0.05 ? `0 0 ${Math.round(30 * k)}px ${alpha(C.emerald, 0.4 * k)}` : undefined,
              fontFamily: FONT.sans,
              fontSize: 54,
              fontWeight: 850,
              color: C.textStrong,
              opacity: e * (win ? 1 : 1 - 0.6 * m),
              transform: `translateY(${(1 - e) * 16}px)`,
              textDecoration: 'none',
            }}
          >
            {k > 0.1 ? <Tick size={52} p={k} /> : null}
            <span style={{ color: win && k > 0.5 ? fg : C.textStrong }}>{label}</span>
          </div>
        );
      })}
    </>
  );
}
