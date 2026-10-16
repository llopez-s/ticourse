import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, type IconName } from '../../../../../engine/src/ui';

/**
 * Small pieces of s04-conmutar. Every animated prop is a 0–1 weight computed by the scene;
 * nothing positions itself.
 */

/**
 * A think-prompt option: fixed width and height, neutral until chosen, so both options are
 * identical boxes during the hold. `state` 0 = neutral, 1 = chosen (emerald), −1 = stepped back;
 * `glow` lights both alike during the silent hold.
 */
export function ChoiceButton({ label, show, state = 0, glow = 0, width = 330, size = 42 }: { label: string; show: number; state?: number; glow?: number; width?: number; size?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const chosen = Math.max(0, Math.min(1, state));
  const back = Math.max(0, Math.min(1, -state));
  const g = Math.max(clamp01(glow), chosen);
  const edge = chosen > 0.01 ? C.emerald : C.cyan;
  return (
    <div
      style={{
        width,
        height: Math.round(size * 1.9),
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(edge, 0.55 + 0.45 * g)}`,
        background: chosen > 0.01 ? `linear-gradient(180deg, ${alpha(C.emerald, 0.24 * chosen)} 0%, ${C.ink900} 100%)` : C.ink900,
        boxShadow: `0 0 ${Math.round(10 + 26 * g)}px ${alpha(edge, 0.12 + 0.3 * g)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 820,
        color: chosen > 0.5 ? '#a7f3d0' : C.textStrong,
        whiteSpace: 'nowrap',
        transform: `translateY(${(1 - s) * 14}px) scale(${1 + 0.06 * chosen})`,
        ...dimStyle(back, s),
      }}
    >
      {chosen > 0.01 ? (
        <span style={{ display: 'inline-flex', opacity: chosen, width: 40 * chosen, overflow: 'hidden' }}>
          <Icon name="check" size={40} color={C.emerald} strokeWidth={3.2} />
        </span>
      ) : null}
      {label}
    </div>
  );
}

/** A labelled pill: icon + text on a solid background, in a tone. */
export function Pill({
  icon,
  children,
  tone,
  p,
  glow = 0,
  size = 40,
  style,
}: {
  icon?: IconName;
  children: ReactNode;
  tone: string;
  p: number;
  glow?: number;
  size?: number;
  style?: CSSProperties;
}) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: `8px ${Math.round(size * 0.6)}px 8px ${Math.round(size * (icon ? 0.42 : 0.6))}px`,
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.18)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 0 ${Math.round(14 + 24 * g)}px ${alpha(tone, 0.18 + 0.35 * g)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.15,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: v,
        transform: `translateY(${(1 - v) * 12}px) scale(${0.92 + 0.08 * v})`,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={tone} strokeWidth={2.3} /> : null}
      {children}
    </div>
  );
}

/** Point on a quadratic Bézier. */
export function quad(t: number, a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }) {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

/**
 * The audience walking from one theatre to the other along a quadratic path. `t[i]` is walker
 * i's 0–1 progress; walkers are only drawn while under way. Same look as the Theatre's heads.
 */
export function Walkers({
  t,
  from,
  ctrl,
  to,
  r = 9,
  tone = C.cyanSoft,
}: {
  t: readonly number[];
  from: { x: number; y: number };
  ctrl: { x: number; y: number };
  to: { x: number; y: number };
  r?: number;
  tone?: string;
}) {
  return (
    <>
      {t.map((raw, i) => {
        const k = clamp01(raw);
        if (k <= 0.001 || k >= 0.999) return null;
        const e = EASE.inOut(k);
        const p = quad(e, from, ctrl, to);
        const bob = Math.abs(Math.sin(k * Math.PI * 6)) * 3;
        const op = Math.min(1, k * 8, (1 - k) * 8);
        return (
          <g key={i} opacity={op} transform={`translate(${p.x} ${p.y - bob})`}>
            <ellipse cx={0} cy={r * 1.35} rx={r * 1.1} ry={r * 0.95} fill="#04070d" stroke={alpha(tone, 0.8)} strokeWidth={2} />
            <circle cx={0} cy={0} r={r} fill="#04070d" stroke={alpha(tone, 0.9)} strokeWidth={2} />
          </g>
        );
      })}
    </>
  );
}

/** A curved arrow along a quadratic path, drawn up to `draw` (0–1), dashed or solid. */
export function CurvedArrow({
  from,
  ctrl,
  to,
  draw = 1,
  color,
  dashed = false,
  width = 4,
}: {
  from: { x: number; y: number };
  ctrl: { x: number; y: number };
  to: { x: number; y: number };
  draw?: number;
  color: string;
  dashed?: boolean;
  width?: number;
}) {
  const d = clamp01(draw);
  if (d <= 0.001) return null;
  // sample the visible part of the curve
  const n = 24;
  const pts = Array.from({ length: n + 1 }, (_, i) => quad((i / n) * d, from, ctrl, to));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const end = pts[n];
  const prev = pts[n - 1];
  const ang = Math.atan2(end.y - prev.y, end.x - prev.x);
  const hp = (dx: number, dy: number) => `${end.x + dx * Math.cos(ang) - dy * Math.sin(ang)},${end.y + dx * Math.sin(ang) + dy * Math.cos(ang)}`;
  return (
    <g>
      <path d={path} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '10 10' : undefined} />
      {d > 0.9 ? <path d={`M${hp(-16, -10)} L${end.x},${end.y} L${hp(-16, 10)}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" /> : null}
    </g>
  );
}
