import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, tone, type IconName, type Tone } from '../../../../engine/src/ui';

/**
 * Three-lane sequence diagram shared by s04 (SAML) and s05 (OAuth): one
 * column per party with a header card (icon, title, sub) and a dashed
 * lifeline down to the bottom. Children are drawn in the same coordinate
 * space (lane-local px, origin at the diagram's top-left) — place steps with
 * `laneX()` and the helpers below:
 * - `LaneArrow`: a horizontal arrow between two x's at height y, drawn
 *   progressively, with an optional label above it.
 * - `LaneBox`: a box centred on a lane (bubbles, forms, notes).
 * - `stepWeights()`: focus/dim weights for steps that light one after the
 *   other («cada paso se ilumina y los anteriores se atenúan»).
 * Nothing here reads the timeline: pass Sequence-relative frames.
 */

export interface LaneDef {
  title: string;
  sub?: string;
  tone: Tone;
  icon?: IconName;
}

export const LANE_HEAD_H = 118;

/** Centre x of lane `i` of `n` across `width`. */
export function laneX(i: number, width: number, n = 3): number {
  return (width / n) * (i + 0.5);
}

/** Width of one lane. */
export function laneW(width: number, n = 3): number {
  return width / n;
}

export function Lanes({
  lanes,
  width,
  height,
  at,
  glow,
  dim,
  headOpacity = 1,
  frame: frameProp,
  children,
  style,
}: {
  lanes: LaneDef[];
  width: number;
  height: number;
  /** Frame the headers appear (staggered). Undefined: already on screen. */
  at?: number;
  /** Per-lane 0–1 halo on the header. */
  glow?: readonly number[];
  /** Per-lane 0–1 dim of the header and lifeline. */
  dim?: readonly number[];
  /** 0–1 opacity of the headers and lifelines (children unaffected). */
  headOpacity?: number;
  frame?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const n = lanes.length;
  const lw = laneW(width, n);
  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans, ...style }}>
      {lanes.map((lane, i) => {
        const p = at === undefined ? 1 : progress(frame, at + i * 6, 16);
        if (p <= 0) return null;
        const t = tone(lane.tone);
        const g = clamp01(glow?.[i] ?? 0);
        const d = clamp01(dim?.[i] ?? 0);
        const cx = laneX(i, width, n);
        const headW = lw - 36;
        const line = progress(frame, (at ?? -100) + 10 + i * 6, 24, EASE.inOut);
        return (
          <div key={lane.title} style={{ position: 'absolute', inset: 0, ...dimStyle(d, p * headOpacity) }}>
            {/* Column band */}
            <div
              style={{
                position: 'absolute',
                left: cx - lw / 2 + 10,
                top: 0,
                width: lw - 20,
                height,
                borderRadius: RADIUS.lg,
                background: `linear-gradient(180deg, ${alpha(t.fg, 0.07)} 0%, ${alpha(t.fg, 0.015)} 100%)`,
              }}
            />
            {/* Lifeline */}
            <svg width={4} height={height} style={{ position: 'absolute', left: cx - 2, top: 0, overflow: 'visible' }}>
              <line
                x1={2}
                y1={LANE_HEAD_H}
                x2={2}
                y2={LANE_HEAD_H + (height - LANE_HEAD_H - 6) * line}
                stroke={alpha(t.fg, 0.4)}
                strokeWidth={3}
                strokeDasharray="10 12"
              />
            </svg>
            {/* Header card */}
            <div
              style={{
                position: 'absolute',
                left: cx - headW / 2,
                top: 0,
                width: headW,
                height: LANE_HEAD_H - 14,
                boxSizing: 'border-box',
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(t.fg, 0.45 + 0.45 * g)}`,
                background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
                boxShadow: g > 0 ? `0 0 ${Math.round(26 * g)}px ${alpha(t.fg, 0.35 * g)}` : `0 14px 30px ${alpha('#000000', 0.3)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '0 18px',
                transform: `translateY(${(1 - p) * -12}px)`,
              }}
            >
              {lane.icon ? <Icon name={lane.icon} size={46} color={t.fg} /> : null}
              <div style={{ minWidth: 0, whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: Math.min(38, Math.floor((headW - 40 - (lane.icon ? 62 : 0)) / (lane.title.length * 0.56))), fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>{lane.title}</div>
                {lane.sub ? <div style={{ fontSize: 28, fontWeight: 650, color: t.soft, lineHeight: 1.2 }}>{lane.sub}</div> : null}
              </div>
            </div>
          </div>
        );
      })}
      {children}
    </div>
  );
}

/**
 * Horizontal arrow from x1 to x2 at height y (lane-local px), drawn from x1.
 * `label` sits centred above the line. `dashed` for redirects; `blocked`
 * (0–1) stops the arrow short with a rose bar (an attempt that fails).
 */
export function LaneArrow({
  x1,
  x2,
  y,
  draw,
  color = C.cyan,
  label,
  labelSize = 30,
  labelColor,
  dashed = false,
  width = 4,
  opacity = 1,
  dim = 0,
  blocked = 0,
}: {
  x1: number;
  x2: number;
  y: number;
  /** 0–1 reveal. */
  draw: number;
  color?: string;
  label?: ReactNode;
  labelSize?: number;
  labelColor?: string;
  dashed?: boolean;
  width?: number;
  opacity?: number;
  dim?: number;
  blocked?: number;
}) {
  const d = clamp01(draw);
  if (d <= 0) return null;
  const dir = x2 >= x1 ? 1 : -1;
  const pad = 16;
  const x0 = Math.min(x1, x2) - pad;
  const len = Math.abs(x2 - x1);
  const head = 18;
  const tipX = x1 + dir * len * d;
  const shaftEnd = tipX - dir * head * 0.9;
  const showHead = d > 0.12;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity, ...dimStyle(dim) }}>
      <svg width={len + 2 * pad} height={40} style={{ position: 'absolute', left: x0, top: y - 20, overflow: 'visible' }}>
        <line
          x1={x1 - x0}
          y1={20}
          x2={shaftEnd - x0}
          y2={20}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={dashed ? '12 10' : undefined}
        />
        {showHead ? (
          <polygon
            points={`${tipX - x0},20 ${tipX - x0 - dir * head},${20 - head * 0.62} ${tipX - x0 - dir * head},${20 + head * 0.62}`}
            fill={color}
          />
        ) : null}
        {blocked > 0 ? (
          <g opacity={clamp01(blocked)}>
            <line x1={tipX - x0 + dir * 10} y1={2} x2={tipX - x0 + dir * 10} y2={38} stroke={C.rose} strokeWidth={6} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: Math.min(x1, x2),
            top: y - labelSize * 1.25 - 16,
            width: len,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: labelSize,
            fontWeight: 700,
            color: labelColor ?? C.text,
            whiteSpace: 'nowrap',
            opacity: clamp01(d * 1.6 - 0.4),
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}

/** A box centred on x (lane-local), top at y. */
export function LaneBox({
  x,
  y,
  width,
  show = 1,
  dim = 0,
  color = C.cyan,
  glow = 0,
  children,
  style,
}: {
  x: number;
  y: number;
  width: number;
  show?: number;
  dim?: number;
  color?: string;
  glow?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const s = clamp01(show);
  if (s <= 0) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y,
        width,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(color, 0.5 + 0.4 * g)}`,
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 16px 36px ${alpha('#000000', 0.38)}${g > 0 ? `, 0 0 ${Math.round(28 * g)}px ${alpha(color, 0.35 * g)}` : ''}`,
        padding: '14px 20px',
        fontFamily: FONT.sans,
        transform: `translateY(${(1 - s) * 12}px) scale(${0.96 + 0.04 * s})`,
        ...style,
        ...dimStyle(dim, s),
      }}
    >
      {children}
    </div>
  );
}

/**
 * Focus weights for steps that light in turn: step i is «on» from starts[i]
 * until `end`; once a later step starts, earlier ones dim. Returns per step
 * `show` (0–1 appear) and `dim` (0–1, how far a later step has taken over).
 */
export function stepWeights(frame: number, starts: readonly number[], { end = Number.POSITIVE_INFINITY, ramp = 12 } = {}) {
  return starts.map((at, i) => {
    const next = starts.slice(i + 1).find((s) => s > at);
    const show = progress(frame, at, ramp);
    const later = next === undefined ? 0 : progress(frame, next, ramp, EASE.inOut);
    const ended = Number.isFinite(end) ? progress(frame, end, ramp, EASE.inOut) : 0;
    return { show, dim: Math.max(later, ended) };
  });
}
