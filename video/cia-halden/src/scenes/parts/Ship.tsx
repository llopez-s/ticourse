import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/** Native viewBox of the harbour scene; it scales with `width`. */
export const HARBOUR = { w: 900, h: 500 } as const;
export const harbourHeight = (width: number) => (width * HARBOUR.h) / HARBOUR.w;

/** A cargo ship seen side-on, bow to the right: hull, a few containers and the bridge. No name, flag or number. */
function ShipShape({ glow }: { glow: number }) {
  const hull = C.sky;
  return (
    <g>
      {/* containers */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`c${i}`} x={40 + i * 46} y={-62} width={40} height={30} rx={3} fill={alpha(C.sky, 0.12)} stroke={alpha(C.sky, 0.6)} strokeWidth={2.2} />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={`d${i}`} x={63 + i * 46} y={-92} width={40} height={30} rx={3} fill={alpha(C.sky, 0.12)} stroke={alpha(C.sky, 0.5)} strokeWidth={2.2} />
      ))}
      {/* one amber container: the dangerous goods */}
      <rect x={224} y={-62} width={40} height={30} rx={3} fill={alpha(C.amber, 0.18 + 0.2 * glow)} stroke={C.amber} strokeWidth={2.4} />
      {/* bridge */}
      <path d="M-4 -32 V-104 H34 V-32" fill={alpha(C.sky, 0.1)} stroke={hull} strokeWidth={2.6} strokeLinejoin="round" />
      <rect x={2} y={-96} width={26} height={10} rx={2} fill={alpha(C.cyanSoft, 0.5)} />
      <path d="M14 -104 V-124" stroke={hull} strokeWidth={2.6} strokeLinecap="round" />
      {/* hull */}
      <path d="M-30 -32 H300 L272 18 H-12 Z" fill={alpha(C.sky, 0.16)} stroke={hull} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-18 -6 H286" stroke={alpha(C.sky, 0.45)} strokeWidth={2} />
    </g>
  );
}

/**
 * The harbour mouth at dusk: the sea line, two breakwater arms with their lights, and the ship coming in from the left
 * (`approach` 0 = far and small, 1 = at the mouth). Nothing is named.
 */
export function Harbour({ width, approach, glow = 0, dim = 0 }: { width: number; approach: number; glow?: number; dim?: number }) {
  const a = clamp01(approach);
  const sx = mix(90, 330, a);
  const sy = 360;
  const s = mix(0.55, 0.95, a);
  return (
    <svg width={width} height={harbourHeight(width)} viewBox={`0 0 ${HARBOUR.w} ${HARBOUR.h}`} style={{ display: 'block', overflow: 'visible', opacity: 1 - clamp01(dim) }}>
      <defs>
        <linearGradient id="harbour-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.sky} stopOpacity={0.12} />
          <stop offset="100%" stopColor={C.sky} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* sea */}
      <rect x={0} y={380} width={HARBOUR.w} height={120} fill="url(#harbour-sea)" />
      <path d={`M0 380 H${HARBOUR.w}`} stroke={alpha(C.sky, 0.5)} strokeWidth={2.5} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${40 + i * 210} ${414 + (i % 2) * 22} h70`} stroke={alpha(C.sky, 0.25)} strokeWidth={2.5} strokeLinecap="round" />
      ))}
      {/* breakwater arms (the mouth) */}
      <path d="M640 380 L700 300 H900" fill="none" stroke={alpha(C.sky, 0.7)} strokeWidth={4} strokeLinejoin="round" />
      <path d="M760 380 L800 340 H900" fill="none" stroke={alpha(C.sky, 0.45)} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={700} cy={290} r={9} fill={C.emerald} opacity={0.9} />
      <circle cx={700} cy={290} r={20} fill={C.emerald} opacity={0.18} />
      <circle cx={800} cy={330} r={8} fill={C.rose} opacity={0.8} />
      {/* the ship */}
      <g transform={`translate(${sx} ${sy}) scale(${s})`}>
        <ShipShape glow={clamp01(glow)} />
      </g>
      {/* wake */}
      <path d={`M${sx - 60 * s} ${sy + 22} h${-120 * a + -40}`} stroke={alpha(C.cyanSoft, 0.35)} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}
