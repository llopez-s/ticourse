import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/**
 * The example floor plan (s01, s02, s03 dim, s06, s08 icon, end card, poster): seen from above, in outline. A street
 * with a car on the left, the pavement, the facade with ONE entrance, a corridor and a room at the back. It is not a
 * building of the port and draws no camera, fence, gate or guard box. Everything is in plan units (PLAN.w × PLAN.h)
 * and scaled to `width`; the plan carries no text (scenes label it with PlanLabel).
 */
export const PLAN = { w: 1200, h: 440 } as const;

/** Key points in plan units, for scenes that ring a stop. */
export const PLAN_STOP = {
  street: { x: 175, y: 220, r: 140 },
  door: { x: 392, y: 220, r: 92 },
  reader: { x: 318, y: 196, r: 64 },
  room: { x: 1030, y: 220, r: 150 },
} as const;

const FACADE = 340;
const INNER = 440;
const ROOM = 880;
const TOP = 20;
const BOTTOM = 420;
const COR_T = 170;
const COR_B = 270;
const DOOR_T = 190;
const DOOR_B = 250;
const POSTS = [110, 165, 220, 275, 330];
const POST_X = 282;

export interface PlanProps {
  width: number;
  /** 0 = car off the left edge, 1 = stopped facing the facade. Hidden when undefined. */
  car?: number;
  /** 0–1: the bollards rise on the pavement. */
  bollards?: number;
  /**
   * A person on foot, cyan: 0→1 crosses between two posts to the door, 1→2 steps into the vestibule, 2→3 into the
   * corridor. Hidden when undefined.
   */
  walker?: number;
  /** 0–1: the vestibule's inner wall and second door are drawn (the outer door is always there). */
  vestibule?: number;
  /** Door leaves: 0 closed, 1 open. */
  outer?: number;
  inner?: number;
  /** 0–1: the card reader on the jamb; `person` a person in front of it; `beep` its light; `log` the access log. */
  reader?: number;
  person?: number;
  beep?: number;
  log?: number;
  /** A ring around one stop (plan units), `on` 0–1. */
  ring?: { x: number; y: number; r: number; on: number } | null;
  /** 0–1: a dashed silhouette already inside the room (s06 «ya hay alguien dentro»). */
  inside?: number;
  idSuffix?: string;
}

function Door({ x, open, tone, o }: { x: number; open: number; tone: string; o: number }) {
  const a = (clamp01(open) * 80 * Math.PI) / 180;
  const len = DOOR_B - DOOR_T;
  const ex = x + len * Math.sin(a);
  const ey = DOOR_T + len * Math.cos(a);
  return (
    <g opacity={o}>
      <path d={`M ${x} ${DOOR_B} A ${len} ${len} 0 0 0 ${x + len * Math.sin((80 * Math.PI) / 180)} ${DOOR_T + len * Math.cos((80 * Math.PI) / 180)}`} fill="none" stroke={alpha(tone, 0.25)} strokeWidth={2} strokeDasharray="5 6" />
      <line x1={x} y1={DOOR_T} x2={ex} y2={ey} stroke={tone} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
}

function Person({ x, y, tone, o, s = 1 }: { x: number; y: number; tone: string; o: number; s?: number }) {
  if (o <= 0.01) return null;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={22} ry={13} fill={alpha(tone, 0.35)} stroke={tone} strokeWidth={3} />
      <circle cx={0} cy={0} r={10} fill={tone} />
    </g>
  );
}

/** Walker position along its path (see PlanProps.walker). */
function walkerAt(w: number): { x: number; y: number } {
  const pts = [
    { x: 150, y: 70 },
    { x: POST_X, y: 137 },
    { x: 308, y: 220 },
    { x: 392, y: 220 },
    { x: 560, y: 220 },
  ];
  // 0→1 covers the first three points (cross the posts, reach the door), then one point per unit.
  const seg = w <= 1 ? w * 2 : w + 1;
  const i = Math.min(pts.length - 2, Math.floor(seg));
  const t = clamp01(seg - i);
  return { x: mix(pts[i].x, pts[i + 1].x, t), y: mix(pts[i].y, pts[i + 1].y, t) };
}

export function FloorPlan({
  width,
  car,
  bollards = 0,
  walker,
  vestibule = 0,
  outer = 0,
  inner = 0,
  reader = 0,
  person = 0,
  beep = 0,
  log = 0,
  ring,
  inside = 0,
  idSuffix = '',
}: PlanProps) {
  const height = (width * PLAN.h) / PLAN.w;
  const wall = alpha(C.sky, 0.85);
  const ctl = C.cyan;
  const clip = `plan-clip${idSuffix}`;
  const carX = car === undefined ? null : mix(-180, 92, clamp01(car));
  const wk = walker === undefined ? null : walkerAt(walker);
  const v = clamp01(vestibule);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${PLAN.w} ${PLAN.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={0} width={PLAN.w} height={PLAN.h} rx={18} />
        </clipPath>
        <pattern id={`plan-grid${idSuffix}`} width={40} height={40} patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={alpha(C.sky, 0.06)} strokeWidth={1.5} />
        </pattern>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {/* paper */}
        <rect x={0} y={0} width={PLAN.w} height={PLAN.h} fill={C.ink900} />
        <rect x={0} y={0} width={PLAN.w} height={PLAN.h} fill={`url(#plan-grid${idSuffix})`} />
        {/* street and pavement */}
        <rect x={0} y={0} width={220} height={PLAN.h} fill={C.ink850} />
        <line x1={110} y1={0} x2={110} y2={PLAN.h} stroke={C.ink600} strokeWidth={4} strokeDasharray="26 22" />
        <rect x={220} y={0} width={FACADE - 220} height={PLAN.h} fill={alpha(C.sky, 0.04)} />
        <line x1={220} y1={0} x2={220} y2={PLAN.h} stroke={C.ink500} strokeWidth={4} />

        {/* the car, nose to the facade */}
        {carX !== null ? (
          <g transform={`translate(${carX} 180)`} opacity={clamp01((car ?? 0) * 4)}>
            <rect x={0} y={0} width={152} height={80} rx={20} fill={C.ink700} stroke={C.muted} strokeWidth={3} />
            <rect x={92} y={10} width={30} height={60} rx={8} fill={alpha(C.sky, 0.22)} stroke={alpha(C.muted, 0.7)} strokeWidth={2} />
            <rect x={22} y={12} width={24} height={56} rx={7} fill={alpha(C.sky, 0.12)} stroke={alpha(C.muted, 0.5)} strokeWidth={2} />
            <circle cx={148} cy={14} r={5} fill={alpha(C.text, 0.8)} />
            <circle cx={148} cy={66} r={5} fill={alpha(C.text, 0.8)} />
          </g>
        ) : null}

        {/* bollards: fixed posts on the pavement */}
        {POSTS.map((y, i) => {
          const b = clamp01(bollards * 1.6 - i * 0.15);
          if (b <= 0.01) return null;
          return (
            <g key={y} opacity={b}>
              <circle cx={POST_X} cy={y} r={14 * (0.6 + 0.4 * b)} fill={alpha(ctl, 0.25)} stroke={ctl} strokeWidth={4} />
              <circle cx={POST_X} cy={y} r={4} fill={ctl} />
            </g>
          );
        })}

        {/* building outline: facade with one entrance, corridor, room */}
        <rect x={FACADE} y={TOP} width={PLAN.w - 20 - FACADE} height={BOTTOM - TOP} fill={alpha(C.ink850, 0.6)} />
        <g stroke={wall} strokeWidth={6} strokeLinecap="round" fill="none">
          <polyline points={`${FACADE},${DOOR_T} ${FACADE},${TOP} ${PLAN.w - 20},${TOP} ${PLAN.w - 20},${BOTTOM} ${FACADE},${BOTTOM} ${FACADE},${DOOR_B}`} />
          <line x1={FACADE} y1={COR_T} x2={ROOM} y2={COR_T} />
          <line x1={FACADE} y1={COR_B} x2={ROOM} y2={COR_B} />
          <line x1={ROOM} y1={TOP} x2={ROOM} y2={DOOR_T} />
          <line x1={ROOM} y1={DOOR_B} x2={ROOM} y2={BOTTOM} />
        </g>
        {/* the room's own door, ajar */}
        <Door x={ROOM} open={0.5} tone={alpha(C.sky, 0.7)} o={1} />
        {/* the entrance door */}
        <Door x={FACADE} open={outer} tone={v > 0.01 ? ctl : alpha(C.sky, 0.9)} o={1} />

        {/* vestibule: the inner wall and a second door, one open at a time */}
        {v > 0.01 ? (
          <g opacity={v}>
            <rect x={FACADE + 4} y={COR_T + 4} width={INNER - FACADE - 8} height={COR_B - COR_T - 8} fill={alpha(ctl, 0.07 * v)} />
            <g stroke={ctl} strokeWidth={6} strokeLinecap="round">
              <line x1={INNER} y1={COR_T} x2={INNER} y2={DOOR_T} />
              <line x1={INNER} y1={DOOR_B} x2={INNER} y2={COR_B} />
            </g>
            <Door x={INNER} open={inner} tone={ctl} o={1} />
          </g>
        ) : null}

        {/* card reader on the jamb */}
        {reader > 0.01 ? (
          <g opacity={reader}>
            <rect x={318} y={150} width={18} height={32} rx={4} fill={C.ink800} stroke={ctl} strokeWidth={3} />
            <circle cx={327} cy={160} r={5} fill={beep > 0.01 ? C.emerald : alpha(ctl, 0.6)} opacity={0.4 + 0.6 * clamp01(beep)} />
            {beep > 0.01 ? <circle cx={327} cy={160} r={10 + 10 * beep} fill="none" stroke={alpha(C.emerald, 0.6 * (1 - beep * 0.5))} strokeWidth={3} /> : null}
          </g>
        ) : null}
        {/* the access log: each access noted (emerald) */}
        {log > 0.01 ? (
          <g opacity={log} transform={`translate(372 44)`}>
            <rect x={0} y={0} width={96} height={104} rx={10} fill={C.ink800} stroke={C.emerald} strokeWidth={3} />
            {[0, 1, 2].map((k) => {
              const on = clamp01(log * 3 - k);
              return (
                <g key={k} opacity={on}>
                  <path d={`M 14 ${26 + k * 28} l 7 7 l 12 -14`} fill="none" stroke={C.emerald} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                  <line x1={42} y1={26 + k * 28} x2={82} y2={26 + k * 28} stroke={alpha(C.text, 0.55)} strokeWidth={5} strokeLinecap="round" />
                </g>
              );
            })}
          </g>
        ) : null}

        {/* people */}
        {wk ? <Person x={wk.x} y={wk.y} tone={ctl} o={1} /> : null}
        <Person x={306} y={222} tone={C.cyanSoft} o={clamp01(person)} />

        {/* someone already inside (s06): dashed, no face, no name */}
        {inside > 0.01 ? (
          <g opacity={inside} transform="translate(1030 300)">
            <circle r={58} fill="none" stroke={alpha(C.amber, 0.5)} strokeWidth={3} strokeDasharray="8 8" />
            <ellipse cx={0} cy={0} rx={24} ry={14} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="6 5" />
            <circle cx={0} cy={0} r={10} fill="none" stroke={C.amber} strokeWidth={3} />
          </g>
        ) : null}

        {/* focus ring on the stop the voice is at */}
        {ring && ring.on > 0.01 ? (
          <circle cx={ring.x} cy={ring.y} r={ring.r} fill={alpha(C.cyan, 0.05 * ring.on)} stroke={alpha(C.cyan, 0.75 * ring.on)} strokeWidth={4} strokeDasharray="14 10" />
        ) : null}
      </g>
      <rect x={1.5} y={1.5} width={PLAN.w - 3} height={PLAN.h - 3} rx={18} fill="none" stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
    </svg>
  );
}
