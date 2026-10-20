import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/** The post-it's own units. */
export const POSTIT = { w: 220, h: 220 } as const;

const PAPER = '#fde68a';
const PAPER_EDGE = '#f59e0b';
const INK = '#1e293b';

/**
 * Concept 1's image: the post-it with the office alarm's code («clave de la alarma» and scribble bars for the code,
 * never digits). Amber-yellow paper, a curled corner, slightly tilted. `text` false draws only the scribbles (small
 * icons). Drawn in its own 220×220 units, scaled to `size`.
 */
export function Postit({ size = POSTIT.w, text = true, tilt = -4, glow = 0 }: { size?: number; text?: boolean; tilt?: number; glow?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${POSTIT.w} ${POSTIT.h}`}
      style={{ display: 'block', overflow: 'visible', transform: `rotate(${tilt}deg)`, filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(20 * glow)}px ${alpha(C.amber, 0.55)})` : undefined }}
    >
      <path d="M 6 6 L 214 6 L 214 176 L 170 214 L 6 214 Z" fill={PAPER} stroke={PAPER_EDGE} strokeWidth={3} />
      <path d="M 214 176 L 176 180 L 170 214 Z" fill="#fbbf24" opacity={0.85} />
      <rect x={6} y={6} width={208} height={26} fill={alpha(PAPER_EDGE, 0.18)} />
      {text ? (
        <text x={22} y={78} fontFamily={FONT.sans} fontSize={34} fontWeight={800} fill={INK}>
          <tspan x={22}>clave de</tspan>
          <tspan x={22} dy={40}>la alarma</tspan>
        </text>
      ) : null}
      {/* The code itself, as scribble bars (never digits). */}
      {[0, 1, 2, 3].map((k) => (
        <path
          key={k}
          d={`M ${24 + k * 44} ${text ? 170 : 110} q 9 -16 18 0 t 18 0`}
          fill="none"
          stroke={INK}
          strokeWidth={text ? 6 : 9}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
      {!text ? <path d="M 24 64 L 180 64" stroke={INK} strokeWidth={9} strokeLinecap="round" opacity={0.5} /> : null}
    </svg>
  );
}
