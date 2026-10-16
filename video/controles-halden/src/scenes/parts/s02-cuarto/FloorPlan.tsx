import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { ROOMS } from '../../../data/s02-cuarto';

/** Native size of the plan (it is drawn full stage width). */
export const PLAN_W = 1728;
export const PLAN_H = 220;

/**
 * Where each of the four controls sits on the plan, x aligned with its tag's column below
 * (columns of 404 px with 37 px gaps: centres 202, 643, 1084, 1525).
 */
export const MARKS = {
  boss: { x: 202, y: 178 },
  guard: { x: 643, y: 186 },
  door: { x: 1084, y: 188 },
  racks: { x: 1547, y: 78 },
} as const;

// Door of the communications room: a gap in its bottom wall (y 150), hinged at its left jamb.
const DOOR_Y = 150;
const DOOR_X0 = 1052;
const DOOR_LEN = 64;
const OPEN_ANGLE = 80; // degrees into the corridor

const WALL = alpha(C.muted, 0.75);
const WALL_W = 5;
const INNER = alpha(C.muted, 0.5);

/**
 * Schematic floor plan of the office building, seen from above: the management office on the left, an open-plan
 * office, a corridor along the bottom and, on the right, the communications room with its racks (no equipment
 * names). `door` 0–1 swings the room's door open into the corridor (`alarm` paints it amber while it stands open).
 * `lit` lights each control's place: the management office, the duty technician in the corridor, the door's lock,
 * the racks.
 */
export function FloorPlan({
  door,
  alarm,
  lit,
  room = 1,
}: {
  door: number;
  alarm: number;
  lit: { boss: number; guard: number; door: number; racks: number };
  /** 0–1: highlight of the communications room. */
  room?: number;
}) {
  const a = (OPEN_ANGLE * clamp01(door) * Math.PI) / 180;
  const leafEnd = { x: DOOR_X0 + DOOR_LEN * Math.cos(a), y: DOOR_Y + DOOR_LEN * Math.sin(a) };
  const leafColor = alarm > 0.01 ? mixHex(C.cyan, C.amber, alarm) : C.cyan;
  return (
    <svg width={PLAN_W} height={PLAN_H} viewBox={`0 0 ${PLAN_W} ${PLAN_H}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="s02-door-glow">
          <stop offset="0%" stopColor={C.amber} stopOpacity={0.4} />
          <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* floor */}
      <rect x={2} y={2} width={PLAN_W - 4} height={PLAN_H - 4} rx={8} fill={alpha(C.ink850, 0.85)} />
      {/* the communications room, tinted (the port's thing) */}
      <rect x={952} y={4} width={772} height={146} fill={alpha(C.cyan, 0.05 + 0.06 * room)} />
      {/* corridor floor */}
      <rect x={382} y={152} width={1342} height={64} fill={alpha(C.ink800, 0.7)} />

      {/* --- management office (left) --- */}
      <rect x={110} y={84} width={184} height={50} rx={6} fill="none" stroke={INNER} strokeWidth={3} />
      <text x={30} y={56} fontFamily={FONT.sans} fontSize={32} fontWeight={700} fill={C.muted}>
        {ROOMS.boss}
      </text>

      {/* --- open-plan office (middle): six desks, no labels --- */}
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <rect key={`${c}-${r}`} x={420 + c * 176} y={26 + r * 62} width={140} height={40} rx={5} fill="none" stroke={INNER} strokeWidth={3} />
        )),
      )}

      {/* --- communications room: four racks --- */}
      {[0, 1, 2, 3].map((i) => {
        const x = 1420 + i * 68;
        return (
          <g key={i}>
            <rect
              x={x}
              y={30}
              width={50}
              height={96}
              rx={4}
              fill={alpha(C.cyan, 0.06 + 0.22 * lit.racks)}
              stroke={alpha(C.cyan, 0.45 + 0.5 * lit.racks)}
              strokeWidth={3}
            />
            {[0, 1, 2, 3].map((k) => (
              <line key={k} x1={x + 10} x2={x + 40} y1={48 + k * 20} y2={48 + k * 20} stroke={alpha(C.cyan, 0.4 + 0.4 * lit.racks)} strokeWidth={3} strokeLinecap="round" />
            ))}
          </g>
        );
      })}
      {lit.racks > 0.01 ? (
        <rect x={1406} y={18} width={282} height={120} rx={12} fill="none" stroke={alpha(C.cyan, 0.8 * lit.racks)} strokeWidth={3} style={{ filter: `drop-shadow(0 0 10px ${alpha(C.cyan, 0.6 * lit.racks)})` }} />
      ) : null}
      <text x={978} y={60} fontFamily={FONT.sans} fontSize={32} fontWeight={750} fill={C.cyanSoft}>
        {ROOMS.comms}
      </text>

      {/* --- walls --- */}
      <rect x={2} y={2} width={PLAN_W - 4} height={PLAN_H - 4} rx={8} fill="none" stroke={WALL} strokeWidth={WALL_W} />
      {/* management office right wall, with its door gap into the corridor */}
      <path d={`M 382 2 L 382 160 M 382 210 L 382 218`} stroke={WALL} strokeWidth={WALL_W} />
      {/* open office bottom wall, open to the corridor in the middle */}
      <path d={`M 382 150 L 600 150 M 690 150 L 952 150`} stroke={WALL} strokeWidth={WALL_W} />
      {/* communications room: left wall and bottom wall with the door gap */}
      <path d={`M 952 2 L 952 150 M 952 150 L ${DOOR_X0} 150 M ${DOOR_X0 + DOOR_LEN} 150 L 1726 150`} stroke={WALL} strokeWidth={WALL_W} />

      {/* the door: swing arc and leaf */}
      {alarm > 0.01 ? <circle cx={DOOR_X0 + 30} cy={DOOR_Y + 30} r={90} fill="url(#s02-door-glow)" opacity={alarm} /> : null}
      {door > 0.02 ? (
        <path
          d={`M ${DOOR_X0 + DOOR_LEN} ${DOOR_Y} A ${DOOR_LEN} ${DOOR_LEN} 0 0 1 ${leafEnd.x} ${leafEnd.y}`}
          fill="none"
          stroke={alpha(leafColor, 0.6)}
          strokeWidth={2.5}
          strokeDasharray="6 6"
        />
      ) : null}
      <line x1={DOOR_X0} y1={DOOR_Y} x2={leafEnd.x} y2={leafEnd.y} stroke={leafColor} strokeWidth={9} strokeLinecap="round" />
      <circle cx={DOOR_X0} cy={DOOR_Y} r={5} fill={leafColor} />

      {/* --- the four places --- */}
      <Mark x={MARKS.boss.x} y={MARKS.boss.y} on={lit.boss}>
        {/* a sheet: the decision */}
        <rect x={-10} y={-13} width={20} height={26} rx={3} fill="none" stroke={C.cyan} strokeWidth={3} />
        <path d="M -5 -4 H 5 M -5 3 H 5" stroke={C.cyan} strokeWidth={2.5} strokeLinecap="round" />
      </Mark>
      <Mark x={MARKS.guard.x} y={MARKS.guard.y} on={lit.guard}>
        {/* a person: the duty technician */}
        <circle cx={0} cy={-7} r={6} fill="none" stroke={C.cyan} strokeWidth={3} />
        <path d="M -11 13 C -10 2, 10 2, 11 13" fill="none" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" />
      </Mark>
      <Mark x={MARKS.door.x} y={MARKS.door.y} on={lit.door}>
        {/* a keyhole: the door's lock */}
        <circle cx={0} cy={-4} r={6} fill={C.cyan} />
        <path d="M -3 0 L -6 12 L 6 12 L 3 0 Z" fill={C.cyan} />
      </Mark>
    </svg>
  );
}

/** A lit ring around a small glyph, for one control's place. */
function Mark({ x, y, on, children }: { x: number; y: number; on: number; children: ReactNode }) {
  const o = clamp01(on);
  if (o < 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * o})`} opacity={o}>
      <circle r={25} fill={alpha(C.ink950, 0.9)} stroke={C.cyan} strokeWidth={3} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.6)})` }} />
      {children}
    </g>
  );
}

/** Mix two #rrggbb colours. */
function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(mix(v, pb[i], t)).toString(16).padStart(2, '0')).join('')}`;
}
