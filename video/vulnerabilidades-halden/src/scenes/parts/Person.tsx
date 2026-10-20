import { alpha } from '../../../../engine/src/theme/tokens';

/**
 * A plain standing figure (head + rounded body), feet at (x, y), `h` units tall, for SVG scenes. No clothing details:
 * no vest, no helmet, no badge. `lean` tilts it (degrees) around the feet.
 */
export function Person({ x, y, h = 90, tone, opacity = 1, lean = 0, fill = 0.25 }: { x: number; y: number; h?: number; tone: string; opacity?: number; lean?: number; fill?: number }) {
  const r = h * 0.14;
  const bw = h * 0.42;
  const bh = h * 0.6;
  return (
    <g opacity={opacity} transform={`rotate(${lean} ${x} ${y})`}>
      <circle cx={x} cy={y - bh - r - h * 0.05} r={r} fill={alpha(tone, fill + 0.15)} stroke={tone} strokeWidth={Math.max(2, h * 0.035)} />
      <path
        d={`M ${x - bw / 2} ${y} L ${x - bw / 2} ${y - bh + bw / 2} A ${bw / 2} ${bw / 2} 0 0 1 ${x + bw / 2} ${y - bh + bw / 2} L ${x + bw / 2} ${y} Z`}
        fill={alpha(tone, fill)}
        stroke={tone}
        strokeWidth={Math.max(2, h * 0.035)}
        strokeLinejoin="round"
      />
    </g>
  );
}

/** A guard seen from above (concert): a filled emerald dot with a ring. */
export function GuardDot({ x, y, r = 13, tone, opacity = 1 }: { x: number; y: number; r?: number; tone: string; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={r + 7} fill={alpha(tone, 0.18)} />
      <circle cx={x} cy={y} r={r} fill={alpha(tone, 0.85)} stroke={tone} strokeWidth={2} />
    </g>
  );
}
