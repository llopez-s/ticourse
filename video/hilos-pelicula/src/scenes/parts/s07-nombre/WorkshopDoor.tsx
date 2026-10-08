import { useId, type CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { pulse } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';

// Scene-local part of s07-nombre (builder B3). Re-drawn after V13's shut workshop door
// (video/kill-chain-eslabon/src/scenes/parts/KillChain.tsx, WeaponArt variant 'closed'); nothing is imported across
// videos, and none of V13's house, sidewalk, flowerpot, plans, safe or alarm is drawn.

/**
 * «La puerta del taller, sin placa» — the thief's workshop seen from outside: a stretch of dark (rose-tinted) wall,
 * the shut door with its two panels and knob, the warm light leaking under it (someone works in there), and on the
 * top of the door's leaf — where the victims' doors of s04 carry their name plates — the place where a plate would be
 * screwed on: four empty screw holes and NOTHING between them. No text is drawn (the caption «mismo taller · ¿de quién?» is scene text).
 *
 * Props (0–1 weights; nothing reads the timeline, nothing is positioned):
 * - `width`      — px; height follows the design aspect (WORKSHOP_DOOR_BASE).
 * - `show`       — appear (fade + small rise).
 * - `lit`        — the light under the door (default 1).
 * - `plateFocus` — the voice is on «placa»: a dashed cyan outline marks the empty spot and breathes slowly.
 * - `dim`        — step back.
 */

export const WORKSHOP_DOOR_BASE = { w: 320, h: 260 } as const;

export function workshopDoorHeight(width: number): number {
  return (WORKSHOP_DOOR_BASE.h * width) / WORKSHOP_DOOR_BASE.w;
}

// Design units.
const GROUND = 222;
const DOOR = { x: 110, y: 34, w: 100 } as const;
const LEAF = { x: DOOR.x + 6, y: DOOR.y + 6, w: DOOR.w - 12 } as const;
/** Where a name plate would be: across the top of the leaf, where the victims' doors of s04 carry theirs. */
const PLATE = { x: LEAF.x + 7, y: LEAF.y + 8, w: LEAF.w - 14, h: 24 } as const;

export type WorkshopDoorPoint = 'threshold' | 'plate' | 'doorTop' | 'leftFoot' | 'rightFoot';

/** An anchor of a WorkshopDoor `width` px wide, in px from its top-left. */
export function workshopDoorPoint(width: number, which: WorkshopDoorPoint): { x: number; y: number } {
  const s = width / WORKSHOP_DOOR_BASE.w;
  const p: Record<WorkshopDoorPoint, { x: number; y: number }> = {
    threshold: { x: DOOR.x + DOOR.w / 2, y: GROUND + 4 },
    plate: { x: PLATE.x + PLATE.w / 2, y: PLATE.y + PLATE.h / 2 },
    doorTop: { x: DOOR.x + DOOR.w / 2, y: DOOR.y },
    leftFoot: { x: DOOR.x - 4, y: GROUND + 2 },
    rightFoot: { x: DOOR.x + DOOR.w + 4, y: GROUND + 2 },
  };
  return { x: p[which].x * s, y: p[which].y * s };
}

export function WorkshopDoor({
  width,
  show = 1,
  lit = 1,
  plateFocus = 0,
  dim = 0,
  style,
}: {
  width: number;
  show?: number;
  lit?: number;
  plateFocus?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (k: string) => `wd-${uid}-${k}`;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const h = workshopDoorHeight(width);
  const light = clamp01(lit);
  const pf = clamp01(plateFocus);
  const d = clamp01(dim);
  const breathe = 0.65 + 0.35 * pulse(frame, fps, 0.5);
  const leafBottom = GROUND - 2;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: sh * (1 - 0.6 * d),
        transform: `translateY(${(1 - sh) * 14}px)`,
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${WORKSHOP_DOOR_BASE.w} ${WORKSHOP_DOOR_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {/* The wall fades out at both sides: a stretch of wall, not a box */}
          <linearGradient id={id('wall')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.roseDeep} stopOpacity={0} />
            <stop offset="18%" stopColor={C.roseDeep} stopOpacity={0.62} />
            <stop offset="82%" stopColor={C.roseDeep} stopOpacity={0.62} />
            <stop offset="100%" stopColor={C.roseDeep} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={id('floor')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity={0} />
            <stop offset="20%" stopColor="#000000" stopOpacity={0.4} />
            <stop offset="80%" stopColor="#000000" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={id('leaf')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#331a27" />
            <stop offset="100%" stopColor="#24121c" />
          </linearGradient>
          {/* …and at the top: the wall has no hard upper edge */}
          <linearGradient id={id('fadeTop')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0} />
            <stop offset="22%" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
          </linearGradient>
          <mask id={id('wallMask')} maskUnits="userSpaceOnUse" x={0} y={0} width={WORKSHOP_DOOR_BASE.w} height={GROUND}>
            <rect x={0} y={0} width={WORKSHOP_DOOR_BASE.w} height={GROUND} fill={`url(#${id('fadeTop')})`} />
          </mask>
          <radialGradient id={id('spill')}>
            <stop offset="0%" stopColor="#fcd34d" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#fcd34d" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Wall and its faint siding */}
        <g mask={`url(#${id('wallMask')})`}>
          <rect x={0} y={0} width={WORKSHOP_DOOR_BASE.w} height={GROUND} fill={`url(#${id('wall')})`} />
          {[30, 62, 94, 126, 158, 190].map((y) => (
            <line key={y} x1={40} y1={y} x2={280} y2={y} stroke={alpha(C.rose, 0.07)} strokeWidth={1.4} />
          ))}
        </g>
        {/* Floor */}
        <rect x={0} y={GROUND} width={WORKSHOP_DOOR_BASE.w} height={WORKSHOP_DOOR_BASE.h - GROUND} fill={`url(#${id('floor')})`} />
        <line x1={34} y1={GROUND} x2={286} y2={GROUND} stroke={alpha(C.rose, 0.22)} strokeWidth={1.6} />

        {/* Door frame and the shut leaf */}
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={GROUND - DOOR.y} rx={3} fill="none" stroke={alpha(C.rose, 0.6)} strokeWidth={3.4} />
        <rect x={LEAF.x} y={LEAF.y} width={LEAF.w} height={leafBottom - LEAF.y} fill={`url(#${id('leaf')})`} stroke={alpha(C.rose, 0.42)} strokeWidth={1.8} />
        {/* Upper and lower panels (under the empty plate spot) */}
        <rect x={LEAF.x + 8} y={LEAF.y + 42} width={LEAF.w - 16} height={58} rx={2} fill="none" stroke={alpha(C.rose, 0.26)} strokeWidth={1.4} />
        <rect x={LEAF.x + 8} y={LEAF.y + 110} width={LEAF.w - 16} height={leafBottom - LEAF.y - 122} rx={2} fill="none" stroke={alpha(C.rose, 0.26)} strokeWidth={1.4} />
        {/* Knob */}
        <circle cx={DOOR.x + DOOR.w - 18} cy={140} r={4.4} fill={alpha(C.rose, 0.75)} />

        {/* The empty plate spot: four screw holes, nothing between them */}
        {pf > 0.01 ? (
          <rect
            x={PLATE.x - 5}
            y={PLATE.y - 5}
            width={PLATE.w + 10}
            height={PLATE.h + 10}
            rx={4}
            fill={alpha(C.cyan, 0.06 * pf)}
            stroke={alpha(C.cyan, (0.55 + 0.45 * breathe) * pf)}
            strokeWidth={2}
            strokeDasharray="5 4"
          />
        ) : null}
        {[
          [PLATE.x + 3, PLATE.y + 3],
          [PLATE.x + PLATE.w - 3, PLATE.y + 3],
          [PLATE.x + 3, PLATE.y + PLATE.h - 3],
          [PLATE.x + PLATE.w - 3, PLATE.y + PLATE.h - 3],
        ].map(([x, y], k) => (
          <g key={k}>
            <circle cx={x} cy={y} r={3.2} fill="#07040a" stroke={alpha('#e2e8f0', 0.55 + 0.4 * pf)} strokeWidth={1.3} />
            <circle cx={x - 0.8} cy={y - 0.8} r={0.9} fill={alpha('#ffffff', 0.35)} />
          </g>
        ))}

        {/* Light under the door: someone works in there */}
        {light > 0.01 ? (
          <g opacity={light}>
            <ellipse cx={DOOR.x + DOOR.w / 2} cy={GROUND + 8} rx={78} ry={10} fill={`url(#${id('spill')})`} />
            <rect x={LEAF.x + 2} y={leafBottom - 1} width={LEAF.w - 4} height={3} fill={alpha('#fcd34d', 0.85)} />
          </g>
        ) : null}
      </svg>
    </div>
  );
}
