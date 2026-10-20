import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { DrawerChest } from './Drawer';
import { Person } from './Person';

/** The rental building in section, in its own units. */
export const RB = { w: 760, h: 600 } as const;
const OUT = { l: 20, r: 740, t: 76, street: 584 } as const;
const PARTY = { x: 370, w: 20 } as const;
const FLOOR2 = { t: 86, b: 250 } as const;
const SLAB1 = { t: 250, b: 270 } as const;
const FLOOR1 = { t: 270, b: 436 } as const;
const SLAB0 = { t: 436, b: 456 } as const;
export const DOOR = { x: 344, y: 470, w: 72, h: 114 } as const;

/** Anchor points (building units) for labels and arrows drawn by the scenes. */
export const RB_ANCHORS = {
  /** The upper party wall, where the hole opens. */
  hole: [PARTY.x + PARTY.w / 2, 168] as [number, number],
  /** The lower party wall. */
  wallLower: [PARTY.x + PARTY.w / 2, 350] as [number, number],
  /** The right edge of the upper floor slab (label leader target). */
  slab: [OUT.r, (SLAB1.t + SLAB1.b) / 2] as [number, number],
  /** The drawer in the lower-right flat. */
  drawer: [600, 380] as [number, number],
  /** The lower-left flat (the tenant's). */
  tenantFlat: [195, 353] as [number, number],
  /** The street door. */
  door: [DOOR.x + DOOR.w / 2, DOOR.y + DOOR.h / 2] as [number, number],
};

/** Furniture of one flat: a window, a lamp and a table, all quiet (left edge x, floor y). */
function Flat({ x, w, top, floor, lit }: { x: number; w: number; top: number; floor: number; lit: number }) {
  const winX = x < RB.w / 2 ? x + 30 : x + w - 110;
  return (
    <g>
      <rect x={x} y={top} width={w} height={floor - top} fill={alpha(C.cyan, 0.03 + 0.1 * lit)} />
      <rect x={winX} y={top + 34} width={80} height={60} rx={4} fill={alpha('#1a3153', 0.9)} stroke={alpha(C.muted, 0.45)} strokeWidth={3} />
      <line x1={winX + 40} y1={top + 34} x2={winX + 40} y2={top + 94} stroke={alpha(C.muted, 0.45)} strokeWidth={3} />
      <line x1={x + w / 2} y1={top} x2={x + w / 2} y2={top + 26} stroke={alpha(C.muted, 0.5)} strokeWidth={2} />
      <path d={`M ${x + w / 2 - 16} ${top + 40} L ${x + w / 2 + 16} ${top + 40} L ${x + w / 2 + 8} ${top + 26} L ${x + w / 2 - 8} ${top + 26} Z`} fill={alpha(C.amber, 0.35 + 0.3 * lit)} />
    </g>
  );
}

/**
 * The rental building («imagen · no es del puerto»): two floors of two flats over a portal with the street door, in
 * section. The party walls and the slab between floors are the hypervisor: `wall` 0–1 lights them sky. `hole` 0–1
 * opens a rose hole in the upper party wall with the left tenant leaning through. `drawer` 0–1: a new tenant (cyan) in
 * the lower-right flat opens a drawer of amber papers. `landlord` 0–1 lights the structure and the installation (sky);
 * `tenant` 0–1 lights the lower-left flat (cyan). `doorOpen` 0–1 swings the street door; `night` 0–1 darkens the sky.
 */
export function RentalBuilding({
  width = RB.w,
  wall = 0,
  hole = 0,
  drawer = 0,
  landlord = 0,
  tenant = 0,
  doorOpen = 0,
  night = 0,
}: {
  width?: number;
  wall?: number;
  hole?: number;
  drawer?: number;
  landlord?: number;
  tenant?: number;
  doorOpen?: number;
  night?: number;
}) {
  const h = (width * RB.h) / RB.w;
  const wl = clamp01(wall);
  const ho = clamp01(hole);
  const dr = clamp01(drawer);
  const ll = clamp01(landlord);
  const tn = clamp01(tenant);
  const dop = clamp01(doorOpen);
  const structTone = alpha(C.sky, 0.35 + 0.55 * Math.max(ll, 0));
  const partyFill = alpha(C.sky, 0.18 + 0.5 * Math.max(wl, ll));
  const partyStroke = alpha(C.sky, 0.5 + 0.5 * Math.max(wl, ll));
  return (
    <svg width={width} height={h} viewBox={`0 0 ${RB.w} ${RB.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* roof */}
      <path d={`M ${OUT.l - 14} ${OUT.t} L ${RB.w / 2} 14 L ${OUT.r + 14} ${OUT.t} Z`} fill={C.ink800} stroke={structTone} strokeWidth={4} strokeLinejoin="round" />
      {/* the flats */}
      <Flat x={OUT.l + 20} w={PARTY.x - OUT.l - 20} top={FLOOR2.t} floor={FLOOR2.b} lit={0} />
      <Flat x={PARTY.x + PARTY.w} w={OUT.r - 20 - PARTY.x - PARTY.w} top={FLOOR2.t} floor={FLOOR2.b} lit={0} />
      <Flat x={OUT.l + 20} w={PARTY.x - OUT.l - 20} top={FLOOR1.t} floor={FLOOR1.b} lit={tn} />
      <Flat x={PARTY.x + PARTY.w} w={OUT.r - 20 - PARTY.x - PARTY.w} top={FLOOR1.t} floor={FLOOR1.b} lit={0.3 * dr} />
      {/* outer walls, the structure */}
      <rect x={OUT.l} y={OUT.t} width={20} height={OUT.street - OUT.t} fill={C.ink700} stroke={structTone} strokeWidth={3} />
      <rect x={OUT.r - 20} y={OUT.t} width={20} height={OUT.street - OUT.t} fill={C.ink700} stroke={structTone} strokeWidth={3} />
      <rect x={OUT.l} y={OUT.t} width={OUT.r - OUT.l} height={10} fill={C.ink700} stroke={structTone} strokeWidth={3} />
      {/* the installation: a riser pipe and a cable, dashed (the landlord's) */}
      {ll > 0.01 ? (
        <g opacity={ll}>
          <path d={`M ${OUT.r - 34} ${OUT.street - 10} L ${OUT.r - 34} ${OUT.t + 24}`} stroke={C.sky} strokeWidth={5} strokeDasharray="12 8" />
          <path d={`M ${OUT.l + 34} ${OUT.street - 10} L ${OUT.l + 34} ${OUT.t + 24}`} stroke={C.sky} strokeWidth={4} strokeDasharray="4 8" strokeLinecap="round" />
        </g>
      ) : null}
      {/* slabs and party walls: the hypervisor */}
      {[SLAB1, SLAB0].map((s, k) => (
        <rect key={k} x={OUT.l + 20} y={s.t} width={OUT.r - OUT.l - 40} height={s.b - s.t} fill={k === 0 ? partyFill : C.ink700} stroke={k === 0 ? partyStroke : structTone} strokeWidth={3} />
      ))}
      {[FLOOR2, FLOOR1].map((f, k) => (
        <rect key={k} x={PARTY.x} y={f.t} width={PARTY.w} height={f.b - f.t} fill={partyFill} stroke={partyStroke} strokeWidth={3} />
      ))}
      {wl > 0.02 ? <rect x={PARTY.x - 10} y={FLOOR2.t} width={PARTY.w + 20} height={FLOOR1.b - FLOOR2.t} rx={8} fill={alpha(C.sky, 0.12 * wl)} /> : null}
      {/* the hole in the upper party wall, and the tenant who goes through it */}
      {ho > 0.01 ? (
        <g>
          <path
            d={`M ${PARTY.x - 4} ${168 - 46 * ho} L ${PARTY.x + 12} ${168 - 30 * ho} L ${PARTY.x + PARTY.w + 4} ${168 - 40 * ho} L ${PARTY.x + PARTY.w - 2} ${168 + 6 * ho} L ${PARTY.x + PARTY.w + 4} ${168 + 44 * ho} L ${PARTY.x + 6} ${168 + 36 * ho} L ${PARTY.x - 4} ${168 + 42 * ho} Z`}
            fill={C.ink950}
            stroke={C.rose}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <Person x={PARTY.x - 50 + 22 * ho} y={FLOOR2.b} h={110} tone={C.rose} lean={18 * ho} />
        </g>
      ) : (
        <Person x={PARTY.x - 70} y={FLOOR2.b} h={110} tone={alpha(C.cyan, 0.6)} fill={0.12} />
      )}
      {/* the lower-right flat: a new tenant, a moving box and the drawer of the previous one */}
      <g opacity={0.35 + 0.65 * dr}>
        <DrawerChest x={560} y={FLOOR1.b} open={dr} />
        <Person x={470} y={FLOOR1.b} h={110} tone={C.cyan} lean={8 * dr} />
        <rect x={650} y={FLOOR1.b - 46} width={60} height={46} rx={4} fill={alpha('#a16207', 0.35)} stroke={alpha('#d6a35c', 0.7)} strokeWidth={3} />
        <line x1={650} y1={FLOOR1.b - 32} x2={710} y2={FLOOR1.b - 32} stroke={alpha('#d6a35c', 0.6)} strokeWidth={3} />
      </g>
      {/* the lower-left flat's tenant (s04) */}
      {tn > 0.01 ? <Person x={150} y={FLOOR1.b} h={110} tone={C.cyan} opacity={tn} /> : null}
      {/* the portal and the street door */}
      <rect x={OUT.l + 20} y={SLAB0.b} width={OUT.r - OUT.l - 40} height={OUT.street - SLAB0.b} fill={alpha(C.ink850, 0.9)} />
      <rect x={DOOR.x - 10} y={DOOR.y - 10} width={DOOR.w + 20} height={DOOR.h + 10} rx={6} fill={C.ink700} stroke={structTone} strokeWidth={3} />
      <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill={alpha(C.amber, 0.08 + 0.5 * dop * clamp01(night + 0.3))} />
      <path
        d={`M ${DOOR.x} ${DOOR.y} L ${DOOR.x + DOOR.w * (1 - 0.7 * dop)} ${DOOR.y + 8 * dop} L ${DOOR.x + DOOR.w * (1 - 0.7 * dop)} ${DOOR.y + DOOR.h - 8 * dop} L ${DOOR.x} ${DOOR.y + DOOR.h} Z`}
        fill="#4a3424"
        stroke="#7a5638"
        strokeWidth={3}
      />
      <circle cx={DOOR.x + DOOR.w * (1 - 0.7 * dop) - 12} cy={DOOR.y + DOOR.h / 2 + 6} r={4} fill="#d6a35c" />
      {[90, 610].map((x) => (
        <rect key={x} x={x} y={480} width={70} height={56} rx={4} fill={alpha('#1a3153', 0.9)} stroke={alpha(C.muted, 0.4)} strokeWidth={3} />
      ))}
      {/* street */}
      <rect x={0} y={OUT.street} width={RB.w} height={10} rx={3} fill={alpha(C.muted, 0.35)} />
      {night > 0.01 ? <rect x={-20} y={0} width={RB.w + 40} height={OUT.street} fill={alpha('#020617', 0.35 * clamp01(night))} /> : null}
    </svg>
  );
}
