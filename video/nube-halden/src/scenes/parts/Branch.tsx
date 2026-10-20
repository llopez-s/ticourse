import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** One branch's own units. */
export const BRANCH = { w: 200, h: 200 } as const;

/**
 * A bank branch (concept 3's image): a pediment over four columns and a roll-down shutter between the middle ones —
 * never a shopfront window. `forced` 0–1 bends the shutter open (rose) and `beacon` 0–1 lights the alarm beacon on
 * the roof (rose); `safe` 0–1 adds an emerald tick (intact). Drawn inside an <svg> at (x, y) with scale `k`.
 */
export function BranchShape({ x = 0, y = 0, k = 1, forced = 0, beacon = 0, safe = 0 }: { x?: number; y?: number; k?: number; forced?: number; beacon?: number; safe?: number }) {
  const f = clamp01(forced);
  const b = clamp01(beacon);
  const s = clamp01(safe);
  const tone = f > 0.02 ? C.rose : C.cyan;
  const line = alpha(C.muted, 0.75);
  // The shutter: slats from the top; when forced, the lower slats bend out and a dark gap opens.
  const slats = 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {/* Beacon */}
      <rect x={88} y={4} width={24} height={16} rx={4} fill={b > 0.02 ? alpha(C.rose, 0.35 + 0.65 * b) : C.ink700} stroke={b > 0.02 ? C.rose : line} strokeWidth={3} />
      {b > 0.02 ? <circle cx={100} cy={12} r={30 + 16 * b} fill={alpha(C.rose, 0.22 * b)} /> : null}
      {/* Pediment */}
      <path d="M 14 62 L 100 22 L 186 62 Z" fill={C.ink850} stroke={line} strokeWidth={4} strokeLinejoin="round" />
      <rect x={14} y={62} width={172} height={12} fill={C.ink800} stroke={line} strokeWidth={3} />
      {/* Columns */}
      {[24, 54, 132, 162].map((cx) => (
        <rect key={cx} x={cx} y={76} width={14} height={98} fill={C.ink800} stroke={line} strokeWidth={3} />
      ))}
      {/* Shutter between the middle columns */}
      <rect x={72} y={76} width={56} height={98} fill={f > 0.02 ? C.ink950 : C.ink800} stroke={alpha(tone, 0.7)} strokeWidth={3} />
      {Array.from({ length: slats }, (_, i) => {
        const yy = 84 + i * 15;
        const bend = i >= 3 ? f * (i - 2) * 9 : 0;
        return <path key={i} d={`M 74 ${yy} Q 100 ${yy + bend} 126 ${yy}`} fill="none" stroke={alpha(tone, 0.75)} strokeWidth={4} opacity={i >= 4 ? 1 - 0.7 * f : 1} />;
      })}
      {/* Steps */}
      <rect x={6} y={174} width={188} height={10} fill={C.ink800} stroke={line} strokeWidth={3} />
      <rect x={0} y={184} width={200} height={10} fill={C.ink800} stroke={line} strokeWidth={3} />
      {s > 0.02 ? (
        <g opacity={s}>
          <circle cx={176} cy={42} r={22} fill={C.ink900} stroke={C.emerald} strokeWidth={4} />
          <path d="M 165 42 L 173 50 L 187 34" fill="none" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </g>
  );
}

/** The branch alone (s08's rule icon): the forced one, shutter bent, beacon on. */
export function BranchIcon({ width = 160, forced = 1, beacon = 0.6 }: { width?: number; forced?: number; beacon?: number }) {
  return (
    <svg width={width} height={(width * (BRANCH.h + 20)) / BRANCH.w} viewBox={`0 -20 ${BRANCH.w} ${BRANCH.h + 20}`} style={{ display: 'block', overflow: 'visible' }}>
      <BranchShape forced={forced} beacon={beacon} />
    </svg>
  );
}

/** The street map's own units and where its four branches stand (the first is the one that gets robbed). */
export const MAP = { w: 820, h: 520 } as const;
export const BRANCH_AT: [number, number][] = [
  [70, 40],
  [530, 30],
  [90, 300],
  [560, 290],
];

/**
 * A plain street map: blocks in grey, two streets crossing, four bank branches on the corners. No customers, cards,
 * phones or lines between the branches. `forced`/`beacon` for the first; `safe` ticks the other three.
 */
export function BankMap({ width = MAP.w, forced = 0, beacon = 0, safe = 0, show = [1, 1, 1, 1] }: { width?: number; forced?: number; beacon?: number; safe?: number; show?: readonly number[] }) {
  const h = (width * MAP.h) / MAP.w;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={0} y={0} width={MAP.w} height={MAP.h} rx={24} fill={C.ink900} stroke={alpha(C.muted, 0.25)} strokeWidth={3} />
      {/* Streets */}
      <rect x={0} y={250} width={MAP.w} height={44} fill={alpha(C.muted, 0.1)} />
      <rect x={380} y={0} width={44} height={MAP.h} fill={alpha(C.muted, 0.1)} />
      <line x1={0} y1={272} x2={MAP.w} y2={272} stroke={alpha(C.muted, 0.3)} strokeWidth={3} strokeDasharray="18 14" />
      <line x1={402} y1={0} x2={402} y2={MAP.h} stroke={alpha(C.muted, 0.3)} strokeWidth={3} strokeDasharray="18 14" />
      {BRANCH_AT.map(([x, y], i) => (
        <g key={i} opacity={clamp01(show[i] ?? 1)}>
          <BranchShape x={x} y={y + 20} k={1} forced={i === 0 ? forced : 0} beacon={i === 0 ? beacon : 0} safe={i === 0 ? 0 : safe} />
        </g>
      ))}
    </svg>
  );
}
