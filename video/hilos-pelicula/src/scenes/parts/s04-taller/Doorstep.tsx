import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { RULE_LINES } from '../../../data/s04-taller';
import { TRAPBOX_BASE, trapBoxCallBubble, trapBoxHeight, trapBoxLabelSlot } from '../TrapBox';

/**
 * s04 / s05 shared layout (both scenes are B2's): the table at the top of the stage, and in the
 * band under it two doors, one box at each — Meridian's on the left (cyan), Orbital's on the right
 * (cyanSoft), the order of the table's columns. Between them: the caption «la etiqueta del taller»
 * with its leader lines and the two-line rule. s05 drops the doors and keeps the two boxes, smaller,
 * at the ends of a lower band. Stage-local px.
 */

export type Side = 'meridian' | 'orbital';
export const SIDES: readonly Side[] = ['meridian', 'orbital'];
export const SIDE_TONE: Record<Side, string> = { meridian: C.cyan, orbital: C.cyanSoft };

export const DOOR = { w: 240, h: 332, y: 324 } as const;
export const DOOR_X: Record<Side, number> = { meridian: 55, orbital: 1433 };
export const BOX_S04 = { w: 280 } as const;
export const BOX_S05 = { w: 200, bottom: 652 } as const;

/** Top-left of a side's box in s04: centred on its door, standing on the threshold. */
export function boxS04(side: Side): { x: number; y: number; w: number } {
  const w = BOX_S04.w;
  return { x: DOOR_X[side] + (DOOR.w - w) / 2, y: DOOR.y + DOOR.h - 8 - trapBoxHeight(w), w };
}

/** Top-left of a side's box in s05 (no doors, same centre line, lower band). */
export function boxS05(side: Side): { x: number; y: number; w: number } {
  const w = BOX_S05.w;
  const cx = DOOR_X[side] + DOOR.w / 2;
  return { x: cx - w / 2, y: BOX_S05.bottom - trapBoxHeight(w), w };
}

/** Blend of the s04 and s05 placements (t 0 → s04, 1 → s05). */
export function boxAt(side: Side, t: number): { x: number; y: number; w: number } {
  const a = boxS04(side);
  const b = boxS05(side);
  return { x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t) };
}

/** Centre (stage px) of the label panel on a box's device, for a box placed at `b` with its device up `device`. */
export function labelCentre(b: { x: number; y: number; w: number }, device = 1): { x: number; y: number; w: number } {
  const slot = trapBoxLabelSlot(b.w, device);
  return { x: b.x + slot.cx, y: b.y + slot.cy, w: slot.w };
}

/**
 * The call bubble's top-left in the box's design units, so that it sits beside the box on the
 * centre side (Meridian's to its right, Orbital's to its left), clear of the door plate.
 */
export function callBubbleAt(side: Side, b: { x: number; y: number; w: number }): { x: number; y: number } {
  const s = b.w / TRAPBOX_BASE.w;
  const bw = trapBoxCallBubble().w * s;
  const gap = 18;
  const sx = side === 'meridian' ? b.x + b.w + gap : b.x - gap - bw;
  const sy = b.y - 30;
  return { x: (sx - b.x) / s, y: (sy - b.y) / s };
}

/** Where the caption and the rule sit in s04 (centre line between the doors). */
export const CAPTION = { cx: 864, y: 468, size: 34 } as const;
export const RULE = { cx: 864, y: 548 } as const;

const PLATE = { x: 34, y: 26, h: 46 } as const;

/** A plain door with a name plate (the victim's), no house around it. */
export function Door({ side, name, show = 1, glow = 0, style }: { side: Side; name: string; show?: number; glow?: number; style?: CSSProperties }) {
  const sh = clamp01(show);
  if (sh <= 0.001) return null;
  const tone = SIDE_TONE[side];
  const g = clamp01(glow);
  const { w, h } = DOOR;
  return (
    <div style={{ position: 'relative', width: w, height: h, opacity: sh, transform: `translateY(${(1 - sh) * 12}px)`, ...style }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`door-${side}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.ink700} />
            <stop offset="100%" stopColor={C.ink800} />
          </linearGradient>
        </defs>
        {/* Frame */}
        <rect x={6} y={4} width={w - 12} height={h - 16} rx={8} fill={C.ink900} stroke={alpha(tone, 0.45 + 0.4 * g)} strokeWidth={4} />
        {/* Leaf */}
        <rect x={22} y={18} width={w - 44} height={h - 36} rx={4} fill={`url(#door-${side})`} stroke={C.ink600} strokeWidth={2} />
        {/* Panels */}
        <rect x={40} y={84} width={w - 80} height={92} rx={4} fill="none" stroke={alpha(C.ink500, 0.8)} strokeWidth={2} />
        <rect x={40} y={192} width={w - 80} height={110} rx={4} fill="none" stroke={alpha(C.ink500, 0.8)} strokeWidth={2} />
        {/* Knob */}
        <circle cx={w - 44} cy={184} r={7} fill={alpha(tone, 0.8)} />
        {/* Name plate */}
        <rect x={PLATE.x} y={PLATE.y} width={w - 2 * PLATE.x} height={PLATE.h} rx={6} fill={C.ink950} stroke={alpha(tone, 0.7)} strokeWidth={2} />
        {/* Threshold */}
        <rect x={0} y={h - 14} width={w} height={12} rx={4} fill={C.ink700} stroke={C.ink600} strokeWidth={2} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: PLATE.x,
          top: PLATE.y,
          width: w - 2 * PLATE.x,
          height: PLATE.h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 800,
          color: tone,
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>
    </div>
  );
}

/** «la etiqueta del taller», centred on (cx, y). */
export function LabelCaption({ text, show, glow = 0, cx, y, size = CAPTION.size }: { text: string; show: number; glow?: number; cx: number; y: number; size?: number }) {
  const sh = clamp01(show);
  if (sh <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: y,
        transform: `translate(-50%, ${(1 - sh) * 10}px)`,
        opacity: sh,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 720,
        fontStyle: 'italic',
        color: '#fde68a',
        whiteSpace: 'nowrap',
        textShadow: glow > 0.01 ? `0 0 ${Math.round(8 + 10 * glow)}px ${alpha('#fcd34d', 0.55 * glow)}` : undefined,
      }}
    >
      {text}
    </div>
  );
}

/** Two thin warm lines from the caption's ends to each box's label. */
export function LeaderLines({
  from,
  to,
  p,
  glow = 0,
}: {
  from: { left: { x: number; y: number }; right: { x: number; y: number } };
  to: Record<Side, { x: number; y: number; w: number }>;
  p: number;
  glow?: number;
}) {
  const k = clamp01(p);
  if (k <= 0.001) return null;
  const paths: [Side, string][] = SIDES.map((side) => {
    const a = side === 'meridian' ? from.left : from.right;
    const t = to[side];
    const end = { x: side === 'meridian' ? t.x + t.w * 0.62 + 6 : t.x - t.w * 0.62 - 6, y: t.y };
    const dx = end.x - a.x;
    return [side, `M ${a.x} ${a.y} C ${a.x + dx * 0.45} ${a.y}, ${end.x - dx * 0.35} ${end.y}, ${end.x} ${end.y}`];
  });
  return (
    <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {paths.map(([side, d]) => (
        <g key={side}>
          <path d={d} fill="none" stroke="#fcd34d" strokeWidth={3 + 1.5 * glow} strokeLinecap="round" pathLength={1000} strokeDasharray={`${1000 * k} 1000`} opacity={0.75 + 0.25 * glow} />
        </g>
      ))}
    </svg>
  );
}

/** The rule, two lines (the same in V14 and V15), centred on (cx, y). `line2` lets the second line land with its words. */
export function RuleLabel({ show, line2 = show, glow = 0, cx, y }: { show: number; line2?: number; glow?: number; cx: number; y: number }) {
  const sh = clamp01(show);
  if (sh <= 0.001) return null;
  const l2 = clamp01(line2);
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: y,
        transform: `translate(-50%, ${(1 - sh) * 12}px)`,
        opacity: sh,
        padding: '12px 30px 14px',
        borderRadius: 18,
        background: alpha(C.ink900, 0.94),
        border: `2px solid ${alpha(C.emerald, 0.35 + 0.45 * l2)}`,
        boxShadow: glow > 0.01 ? `0 0 ${Math.round(14 + 16 * glow)}px ${alpha(C.emerald, 0.3 * glow)}` : `0 14px 34px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 650, color: C.text, lineHeight: 1.2 }}>{RULE_LINES[0]}</div>
      <div style={{ fontSize: 36, fontWeight: 820, color: '#6ee7b7', lineHeight: 1.25, opacity: l2, transform: `translateY(${(1 - l2) * 8}px)` }}>{RULE_LINES[1]}</div>
    </div>
  );
}
