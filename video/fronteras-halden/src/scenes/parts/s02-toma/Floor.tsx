import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { INK, dropGlow, joinFilters } from '../glyphs';

/**
 * The office floor from above (s02-04 «Date una vuelta por esta planta»): a corridor with the entrance on the
 * right, rooms on both sides — the training room (your laptop at its desk, plugged into its socket), meeting
 * rooms with their tables, open-plan desks — visitors walking the corridor and sitting in a meeting room, and
 * free wall sockets everywhere. Walls slate (they belong to nobody), your laptop cyan, people neutral white,
 * the free sockets amber when lit (a warning, nothing more: nothing here says what the sockets do).
 *
 * Design 1500 × 360 units scaled to `width`. Weights: `draw` (walls in), `rooms` (the meeting rooms light),
 * `visitors` (people show / glow), `sockets` (0–1 sweeps the free sockets on, one by one), `ours` (your laptop).
 * Visitors move with `frame` (deterministic ping-pong along the corridor).
 */
export const FLOOR_BASE = { w: 1500, h: 360 } as const;

const COR = { y0: 150, y1: 210 } as const;
const TOP_SPLITS = [0, 340, 700, 1060, 1500] as const;
const BOTTOM_SPLITS = [0, 380, 760, 1120, 1500] as const;
const DOOR = { off: 34, w: 64 } as const;

type Kind = 'training' | 'meeting' | 'desks';
const TOP_KINDS: Kind[] = ['training', 'meeting', 'meeting', 'desks'];
const BOTTOM_KINDS: Kind[] = ['meeting', 'desks', 'meeting', 'meeting'];

/** Free sockets (wall-mounted, design units: centre). */
const SOCKETS: readonly { x: number; y: number }[] = [
  { x: 360, y: 16 },
  { x: 684, y: 118 },
  { x: 1044, y: 16 },
  { x: 16, y: 344 },
  { x: 1180, y: 16 },
  { x: 720, y: 134 },
  { x: 396, y: 344 },
  { x: 1484, y: 60 },
  { x: 744, y: 226 },
  { x: 1104, y: 344 },
  { x: 1136, y: 226 },
  { x: 1484, y: 300 },
  { x: 16, y: 120 },
];
/** The training room's socket your laptop is plugged into. */
const OUR_SOCKET = { x: 312, y: 16 } as const;
const OUR_LAPTOP = { x: 254, y: 70 } as const;

export function Floor({
  width,
  draw = 1,
  rooms = 0,
  visitors = 0,
  sockets = 0,
  ours = 1,
  frame,
}: {
  width: number;
  draw?: number;
  rooms?: number;
  visitors?: number;
  sockets?: number;
  ours?: number;
  frame: number;
}) {
  const s = width / FLOOR_BASE.w;
  const h = FLOOR_BASE.h * s;
  const d = clamp01(draw);
  const r = clamp01(rooms);
  const v = clamp01(visitors);
  const o = clamp01(ours);
  const wall = INK.steel;
  const sw = Math.max(4, 2.4 / s);

  // Corridor walls with a door gap into each room.
  const wallWithDoors = (y: number, splits: readonly number[]) => {
    const segs: string[] = [];
    let x = 0;
    for (let i = 0; i < splits.length - 1; i++) {
      const d0 = splits[i] + DOOR.off;
      segs.push(`M ${x} ${y} L ${d0} ${y}`);
      x = d0 + DOOR.w;
    }
    segs.push(`M ${x} ${y} L ${FLOOR_BASE.w} ${y}`);
    return segs.join(' ');
  };

  const roomBox = (x0: number, x1: number, y0: number, y1: number) => ({ x0, x1, y0, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 });
  const top = TOP_KINDS.map((k, i) => ({ kind: k, ...roomBox(TOP_SPLITS[i], TOP_SPLITS[i + 1], 0, COR.y0) }));
  const bottom = BOTTOM_KINDS.map((k, i) => ({ kind: k, ...roomBox(BOTTOM_SPLITS[i], BOTTOM_SPLITS[i + 1], COR.y1, FLOOR_BASE.h) }));
  const all = [...top, ...bottom];

  const table = (cx: number, cy: number, key: string) => (
    <g key={key} opacity={0.55 + 0.45 * r}>
      <rect x={cx - 64} y={cy - 24} width={128} height={48} rx={16} fill={alpha(INK.skySoft, 0.08 + 0.14 * r)} stroke={mixed(r)} strokeWidth={3} />
      {[-40, 0, 40].map((dx) => (
        <g key={dx}>
          <circle cx={cx + dx} cy={cy - 38} r={9} fill="none" stroke={mixed(r)} strokeWidth={2.6} />
          <circle cx={cx + dx} cy={cy + 38} r={9} fill="none" stroke={mixed(r)} strokeWidth={2.6} />
        </g>
      ))}
    </g>
  );
  const desks = (x0: number, x1: number, y0: number, key: string) => {
    const out = [];
    const cols = Math.floor((x1 - x0 - 40) / 90);
    for (let c = 0; c < cols; c++) {
      for (let row = 0; row < 2; row++) {
        out.push(<rect key={`${c}-${row}`} x={x0 + 34 + c * 90} y={y0 + 34 + row * 52} width={66} height={24} rx={4} fill="none" stroke={alpha(wall, 0.45)} strokeWidth={2.4} />);
      }
    }
    return <g key={key}>{out}</g>;
  };

  // Visitors: ping-pong along the corridor (x in [120, 1560]: past 1500 they are outside the entrance).
  const walkers = [
    { y: 172, period: 300, phase: 0.1 },
    { y: 190, period: 360, phase: 0.62 },
    { y: 178, period: 420, phase: 0.35 },
  ];
  const walkerX = (period: number, phase: number) => 120 + 1440 * (0.5 - 0.5 * Math.cos(2 * Math.PI * (frame / period + phase)));
  const sitting = [
    { x: 520 - 40, y: 75 - 38 },
    { x: 520 + 40, y: 75 + 38 },
    { x: 940, y: 285 - 38 },
  ];
  const person = (x: number, y: number, key: string, alphaV = 1) => (
    <g key={key} opacity={v * alphaV}>
      <ellipse cx={x} cy={y + 4} rx={17} ry={11} fill={alpha(INK.person, 0.22)} stroke={INK.person} strokeWidth={2.6} />
      <circle cx={x} cy={y} r={9} fill={C.ink900} stroke={INK.person} strokeWidth={2.6} />
    </g>
  );

  const sw01 = clamp01(sockets);
  const n = SOCKETS.length;

  return (
    <svg width={width} height={h} viewBox={`0 0 ${FLOOR_BASE.w} ${FLOOR_BASE.h}`} style={{ display: 'block', overflow: 'visible', opacity: d }}>
      {/* Floor and corridor */}
      <rect x={0} y={0} width={FLOOR_BASE.w} height={FLOOR_BASE.h} rx={8} fill={alpha(C.ink850, 0.85)} />
      <rect x={0} y={COR.y0} width={FLOOR_BASE.w + 70} height={COR.y1 - COR.y0} fill={alpha(INK.struct, 0.14)} />
      {/* Meeting rooms tint */}
      {all
        .filter((b) => b.kind === 'meeting')
        .map((b, i) => (
          <rect key={i} x={b.x0 + 4} y={b.y0 + 4} width={b.x1 - b.x0 - 8} height={b.y1 - b.y0 - 8} rx={6} fill={alpha(INK.skySoft, 0.08 * r)} />
        ))}
      {/* Furniture */}
      {all.map((b, i) => (b.kind === 'meeting' ? table(b.cx, b.cy, `t${i}`) : b.kind === 'desks' ? desks(b.x0, b.x1, b.y0, `d${i}`) : null))}
      {/* The training room: rows of desks */}
      <g>
        {[0, 1, 2].map((c) => (
          <rect key={c} x={36 + c * 92} y={94} width={68} height={22} rx={4} fill="none" stroke={alpha(wall, 0.4)} strokeWidth={2.4} />
        ))}
      </g>
      {/* Walls */}
      <g stroke={wall} strokeWidth={sw} strokeLinecap="round" fill="none">
        <path d={`M ${FLOOR_BASE.w} ${COR.y0} L ${FLOOR_BASE.w} 0 L 0 0 L 0 ${FLOOR_BASE.h} L ${FLOOR_BASE.w} ${FLOOR_BASE.h} L ${FLOOR_BASE.w} ${COR.y1}`} />
        <path d={wallWithDoors(COR.y0, TOP_SPLITS)} />
        <path d={wallWithDoors(COR.y1, BOTTOM_SPLITS)} />
        {TOP_SPLITS.slice(1, -1).map((x) => (
          <line key={`tv${x}`} x1={x} y1={0} x2={x} y2={COR.y0} />
        ))}
        {BOTTOM_SPLITS.slice(1, -1).map((x) => (
          <line key={`bv${x}`} x1={x} y1={COR.y1} x2={x} y2={FLOOR_BASE.h} />
        ))}
      </g>
      {/* Entrance mark */}
      <path d={`M ${FLOOR_BASE.w + 14} ${COR.y0 + 6} L ${FLOOR_BASE.w + 14} ${COR.y1 - 6}`} stroke={alpha(wall, 0.5)} strokeWidth={3} strokeDasharray="6 8" />
      {/* Free sockets */}
      {SOCKETS.map((p, i) => {
        const k = clamp01(sw01 * (n + 3) - i * 1);
        const col = k > 0.01 ? C.amber : alpha(wall, 0.7);
        return (
          <g key={i} style={{ filter: joinFilters(dropGlow(C.amber, 0.8 * k)) }}>
            <rect x={p.x - 11} y={p.y - 11} width={22} height={22} rx={4} fill={k > 0.01 ? alpha(C.amber, 0.25 * k) : C.ink900} stroke={col} strokeWidth={3} />
            <rect x={p.x - 5} y={p.y - 4} width={10} height={8} rx={1} fill={col} />
          </g>
        );
      })}
      {/* Your laptop in the training room, plugged into its socket */}
      <g opacity={o} style={{ filter: joinFilters(dropGlow(C.cyan, 0.6 * o)) }}>
        <path d={`M ${OUR_SOCKET.x} ${OUR_SOCKET.y + 10} L ${OUR_SOCKET.x} ${OUR_LAPTOP.y - 22} L ${OUR_LAPTOP.x + 26} ${OUR_LAPTOP.y - 22}`} fill="none" stroke={C.cyan} strokeWidth={3.4} strokeLinejoin="round" />
        <rect x={OUR_SOCKET.x - 11} y={OUR_SOCKET.y - 11} width={22} height={22} rx={4} fill={alpha(C.cyan, 0.3)} stroke={C.cyan} strokeWidth={3} />
        <rect x={OUR_LAPTOP.x - 30} y={OUR_LAPTOP.y - 22} width={60} height={36} rx={4} fill={C.ink900} stroke={C.cyan} strokeWidth={3.6} />
        <rect x={OUR_LAPTOP.x - 22} y={OUR_LAPTOP.y - 15} width={44} height={22} rx={2} fill={alpha(C.cyan, 0.35)} />
        <path d={`M ${OUR_LAPTOP.x - 40} ${OUR_LAPTOP.y + 18} L ${OUR_LAPTOP.x + 40} ${OUR_LAPTOP.y + 18} L ${OUR_LAPTOP.x + 34} ${OUR_LAPTOP.y + 25} L ${OUR_LAPTOP.x - 34} ${OUR_LAPTOP.y + 25} Z`} fill={C.ink800} stroke={C.cyan} strokeWidth={3} />
      </g>
      {/* Visitors */}
      {v > 0.001 ? (
        <g style={{ filter: joinFilters(dropGlow(INK.person, 0.5 * v)) }}>
          {walkers.map((w, i) => person(walkerX(w.period, w.phase), w.y, `w${i}`))}
          {sitting.map((p, i) => person(p.x, p.y, `s${i}`, 0.9))}
        </g>
      ) : null}
      {/* The training room's name (texture: the date strip already said it) */}
      <text x={24} y={36} fontFamily={FONT.sans} fontSize={24} fontWeight={700} fill={alpha(C.cyanSoft, 0.85)}>
        sala de formación
      </text>
    </svg>
  );
}

function mixed(r: number) {
  return r > 0.5 ? INK.skySoft : alpha(INK.steel, 0.55 + 0.4 * r);
}
