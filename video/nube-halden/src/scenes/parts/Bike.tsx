import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The bike drawing's own units. */
export const BIKE = { w: 320, h: 210 } as const;

/** A city bike seen from the side (cyan frame, front basket), drawn inside an <svg> at (x, y) with scale `k`. */
export function BikeShape({ x = 0, y = 0, k = 1, tone = C.cyan }: { x?: number; y?: number; k?: number; tone?: string }) {
  const s = { fill: 'none', stroke: tone, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle cx={70} cy={146} r={58} {...s} stroke={alpha(tone, 0.85)} />
      <circle cx={252} cy={146} r={58} {...s} stroke={alpha(tone, 0.85)} />
      <circle cx={70} cy={146} r={8} fill={tone} />
      <circle cx={252} cy={146} r={8} fill={tone} />
      {/* Step-through frame */}
      <path d="M 70 146 L 132 146 L 214 70 M 132 146 Q 150 96 120 66 M 214 70 L 252 146" {...s} />
      {/* Seat and handlebar */}
      <path d="M 100 60 L 140 60" {...s} strokeWidth={9} />
      <path d="M 214 70 L 206 36 L 236 30" {...s} />
      {/* Front basket */}
      <rect x={232} y={44} width={66} height={42} rx={6} fill={alpha(tone, 0.12)} stroke={tone} strokeWidth={5} />
      <path d="M 250 46 L 250 84 M 268 46 L 268 84 M 286 46 L 286 84" stroke={alpha(tone, 0.5)} strokeWidth={3} />
    </g>
  );
}

/** The bike alone (s08's rule icon, the end card). */
export function BikeIcon({ width = 200 }: { width?: number }) {
  const h = (width * BIKE.h) / BIKE.w;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${BIKE.w} ${BIKE.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <BikeShape />
    </svg>
  );
}

/** The dock scene's own units: the service's totem with its screen, the anchor and the docked bike. */
export const DOCK = { w: 720, h: 420 } as const;
/** The totem's screen (dock units), where the service shows the route. */
export const SCREEN = { x: 52, y: 58, w: 196, h: 150 } as const;

/**
 * Concept 2's image: the public bike in its dock. The service's own totem stands beside it; its screen draws the
 * route (`route` 0–1, a dotted line between two dots: the service's app gives you the trip, not your own tracker).
 * The bike is locked to the anchor. No phone, no taxi, no car.
 */
export function Dock({ width = DOCK.w, route = 0, glow = 0 }: { width?: number; route?: number; glow?: number }) {
  const h = (width * DOCK.h) / DOCK.w;
  const r = clamp01(route);
  const g = clamp01(glow);
  const pathLen = 400;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${DOCK.w} ${DOCK.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* Street */}
      <line x1={0} y1={404} x2={DOCK.w} y2={404} stroke={alpha(C.muted, 0.35)} strokeWidth={4} />
      {/* The service's totem */}
      <rect x={30} y={30} width={240} height={374} rx={18} fill={C.ink850} stroke={alpha(C.sky, 0.7)} strokeWidth={4} />
      <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} rx={10} fill={C.ink950} stroke={alpha(C.sky, 0.5 + 0.4 * r)} strokeWidth={3} />
      {/* Street grid on the screen */}
      {[0, 1, 2].map((k) => (
        <line key={`h${k}`} x1={SCREEN.x + 8} y1={SCREEN.y + 34 + k * 40} x2={SCREEN.x + SCREEN.w - 8} y2={SCREEN.y + 34 + k * 40} stroke={alpha(C.muted, 0.18)} strokeWidth={3} />
      ))}
      {[0, 1, 2].map((k) => (
        <line key={`v${k}`} x1={SCREEN.x + 40 + k * 58} y1={SCREEN.y + 8} x2={SCREEN.x + 40 + k * 58} y2={SCREEN.y + SCREEN.h - 8} stroke={alpha(C.muted, 0.18)} strokeWidth={3} />
      ))}
      <path
        d={`M ${SCREEN.x + 28} ${SCREEN.y + 120} L ${SCREEN.x + 98} ${SCREEN.y + 114} L ${SCREEN.x + 98} ${SCREEN.y + 74} L ${SCREEN.x + 156} ${SCREEN.y + 74} L ${SCREEN.x + 166} ${SCREEN.y + 32}`}
        fill="none"
        stroke={C.sky}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${pathLen}`}
        strokeDashoffset={pathLen * (1 - r)}
      />
      <circle cx={SCREEN.x + 28} cy={SCREEN.y + 120} r={9} fill={C.sky} opacity={0.3 + 0.7 * r} />
      <circle cx={SCREEN.x + 166} cy={SCREEN.y + 32} r={10} fill={C.emerald} opacity={r > 0.95 ? 1 : 0.25} />
      {/* Totem details: a card slot and the anchor rail */}
      <rect x={110} y={250} width={80} height={12} rx={6} fill={alpha(C.muted, 0.4)} />
      <rect x={270} y={330} width={70} height={18} rx={6} fill={alpha(C.muted, 0.55)} />
      <rect x={326} y={290} width={22} height={114} rx={8} fill={C.ink800} stroke={alpha(C.muted, 0.6)} strokeWidth={3} />
      {/* The docked bike */}
      <g style={{ filter: g > 0.02 ? `drop-shadow(0 0 ${Math.round(16 * g)}px ${alpha(C.cyan, 0.5)})` : undefined }}>
        <BikeShape x={350} y={196} k={1} />
      </g>
    </svg>
  );
}

/** The tracker puck «tu localizador»: a small round device (never a phone), drawn at its own 90×90 size. */
export function Tracker({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ display: 'block', overflow: 'visible' }}>
      <circle cx={45} cy={45} r={38} fill={C.ink850} stroke={C.muted} strokeWidth={5} />
      <circle cx={45} cy={45} r={10} fill={C.muted} />
      <path d="M 26 26 A 27 27 0 0 1 64 26" fill="none" stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeLinecap="round" />
      <path d="M 18 16 A 38 38 0 0 1 72 16" fill="none" stroke={alpha(C.muted, 0.45)} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

/** The pass, seen from the front (no magnetic strip: that is V34's card back): «abono» over a small city. */
export function Pass({ width = 300, glow = 0 }: { width?: number; glow?: number }) {
  const h = (width * 190) / 300;
  const g = clamp01(glow);
  return (
    <svg width={width} height={h} viewBox="0 0 300 190" style={{ display: 'block', overflow: 'visible', filter: g > 0.02 ? `drop-shadow(0 0 ${Math.round(16 * g)}px ${alpha(C.sky, 0.5)})` : undefined }}>
      <rect x={3} y={3} width={294} height={184} rx={18} fill={C.ink850} stroke={C.sky} strokeWidth={5} />
      <rect x={3} y={3} width={294} height={52} rx={18} fill={alpha(C.sky, 0.22)} />
      <text x={24} y={42} fontFamily={FONT.sans} fontSize={34} fontWeight={850} fill={C.textStrong}>
        abono
      </text>
      {/* A small city skyline: the one city where it works */}
      <path d="M 24 160 L 24 118 L 52 118 L 52 96 L 80 96 L 80 130 L 104 130 L 104 104 L 128 104 L 128 140 L 150 140 L 150 160 Z" fill={alpha(C.sky, 0.35)} stroke={C.sky} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={246} cy={126} r={26} fill="none" stroke={alpha(C.sky, 0.6)} strokeWidth={4} />
      <path d="M 234 126 L 244 136 L 260 116" fill="none" stroke={C.sky} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
