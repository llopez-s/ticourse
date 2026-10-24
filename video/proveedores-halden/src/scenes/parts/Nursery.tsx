import type { CSSProperties } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The video's everyday image: a nursery, drawn as a small house with a sun and a fence. No classroom or class (that is
 * another video's image), no name, no address, no person. The leaflet it gives out, the report it writes about itself,
 * the visit before signing up and the look of every day are variants of the same house. Always tagged by the caller
 * with «imagen · no es del puerto».
 */

/** The house itself. `door` 0–1 opens the door (the visit); `eye` draws an eye above it (the look of every day). */
export function NurseryHouse({ width = 150, door = 0, eye = 0, tone = C.sky, style }: { width?: number; door?: number; eye?: number; tone?: string; style?: CSSProperties }) {
  return (
    <svg width={width} height={(width * 120) / 150} viewBox="0 0 150 120" style={{ overflow: 'visible', ...style }}>
      <circle cx={126} cy={24} r={13} fill={alpha(C.amber, 0.9)} />
      <path d="M 126 2 V 6 M 126 42 V 46 M 104 24 H 108 M 144 24 H 148 M 110 8 l 3 3 M 142 40 l -3 -3 M 142 8 l -3 3 M 110 40 l 3 -3" stroke={alpha(C.amber, 0.9)} strokeWidth={3} strokeLinecap="round" />
      <rect x={20} y={52} width={84} height={58} rx={4} fill={C.ink850} stroke={tone} strokeWidth={4} />
      <path d="M 12 54 L 62 14 L 112 54 Z" fill={alpha(tone, 0.18)} stroke={tone} strokeWidth={4} strokeLinejoin="round" />
      <rect x={30} y={68} width={20} height={20} rx={3} fill={alpha(tone, 0.25)} stroke={alpha(tone, 0.8)} strokeWidth={2.5} />
      <rect x={66} y={72} width={26} height={38} rx={4} fill={C.ink950} stroke={tone} strokeWidth={3} />
      <path d={`M 66 72 L ${66 + 26 * (1 - 0.45 * door)} ${72 + 2 * door} V ${110 - 2 * door} L 66 110 Z`} fill={alpha(tone, 0.35 + 0.3 * door)} stroke={tone} strokeWidth={2} opacity={door > 0.02 ? 1 : 0} />
      <path d="M 4 110 H 146" stroke={alpha(C.muted, 0.7)} strokeWidth={3} strokeLinecap="round" />
      <path d="M 116 110 V 92 M 128 110 V 92 M 140 110 V 92 M 112 98 H 144" stroke={alpha(C.muted, 0.7)} strokeWidth={3} strokeLinecap="round" />
      {eye > 0.02 ? (
        <g opacity={eye}>
          <path d="M 38 14 Q 62 -8 86 14 Q 62 36 38 14 Z" fill={C.ink900} stroke={C.emerald} strokeWidth={3.5} strokeLinejoin="round" transform="translate(0 -12) scale(1)" />
          <circle cx={62} cy={2} r={7} fill={C.emerald} />
        </g>
      ) : null}
    </svg>
  );
}

/** The nursery's leaflet: a tri-fold with a little house on the cover and bars (never letters) inside. */
export function Leaflet({ width = 120, style }: { width?: number; style?: CSSProperties }) {
  return (
    <svg width={width} height={(width * 90) / 120} viewBox="0 0 120 90" style={{ overflow: 'visible', ...style }}>
      <path d="M 4 10 L 42 4 V 84 L 4 80 Z" fill={C.ink800} stroke={C.ink500} strokeWidth={3} strokeLinejoin="round" />
      <path d="M 42 4 H 80 V 84 H 42 Z" fill={C.ink700} stroke={C.ink500} strokeWidth={3} strokeLinejoin="round" />
      <path d="M 80 4 L 116 10 V 80 L 80 84 Z" fill={C.ink800} stroke={C.ink500} strokeWidth={3} strokeLinejoin="round" />
      <path d="M 50 34 L 61 22 L 72 34 V 52 H 50 Z" fill={alpha(C.sky, 0.25)} stroke={C.sky} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={68} cy={14} r={4.5} fill={alpha(C.amber, 0.9)} />
      <path d="M 50 62 H 72 M 50 70 H 66" stroke={alpha(C.text, 0.4)} strokeWidth={3} strokeLinecap="round" />
      <path d="M 12 22 H 34 M 12 32 H 34 M 12 42 H 28 M 12 56 H 34 M 12 66 H 30" stroke={alpha(C.text, 0.32)} strokeWidth={3} strokeLinecap="round" />
      <path d="M 90 22 H 108 M 90 32 H 108 M 90 42 H 102 M 90 56 H 108 M 90 66 H 100" stroke={alpha(C.text, 0.32)} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

/** The report the nursery writes about itself: a page with a small house and check lines, dotted back to its author. */
export function SelfReport({ width = 100, style }: { width?: number; style?: CSSProperties }) {
  return (
    <svg width={width} height={(width * 124) / 100} viewBox="0 0 100 124" style={{ overflow: 'visible', ...style }}>
      <path d="M 4 3 H 70 L 96 29 V 120 H 4 Z" fill={C.ink800} stroke={C.ink500} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M 70 3 V 29 H 96" fill="none" stroke={C.ink500} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M 16 50 L 28 38 L 40 50 V 68 H 16 Z" fill={alpha(C.sky, 0.25)} stroke={C.sky} strokeWidth={3} strokeLinejoin="round" />
      <path d="M 52 44 H 84 M 52 54 H 78 M 52 64 H 82" stroke={alpha(C.text, 0.4)} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M 16 86 H 84 M 16 98 H 70 M 16 110 H 78" stroke={alpha(C.text, 0.32)} strokeWidth={3.5} strokeLinecap="round" />
    </svg>
  );
}
