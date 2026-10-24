import { alpha } from '../../../../engine/src/theme/tokens';

/**
 * A finger seen from the side, pointing down, tip at (0, 0) of the box it is drawn in: `<Finger length />`.
 * A plain light-beige finger: anybody's. Leaning a little (`lean` degrees) so it reads as a
 * hand's, not a bar's. Use it inside an absolutely positioned div whose bottom-centre is the point it presses.
 */
export function Finger({ length = 190, width = 64, lean = -10, glow = 0 }: { length?: number; width?: number; lean?: number; glow?: number }) {
  const w = width;
  const pad = 40;
  return (
    <svg width={w + pad * 2} height={length + 20} viewBox={`${-w / 2 - pad} ${-length} ${w + pad * 2} ${length + 20}`} style={{ display: 'block', overflow: 'visible' }}>
      <g transform={`rotate(${lean})`}>
        {/* the finger: a long capsule, rounder at the tip */}
        <path
          d={`M ${-w / 2} ${-length} L ${-w / 2} ${-w * 0.45} Q ${-w / 2} 0 0 0 Q ${w / 2} 0 ${w / 2} ${-w * 0.45} L ${w / 2} ${-length} Z`}
          fill="#e6cdb8"
          stroke="#b08968"
          strokeWidth={3}
          strokeLinejoin="round"
          style={{ filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(16 * glow)}px ${alpha('#e2e8f0', 0.6 * glow)})` : undefined }}
        />
        {/* the nail, on the side facing us */}
        <rect x={-w * 0.3} y={-w * 0.95} width={w * 0.6} height={w * 0.6} rx={w * 0.22} fill="#f6e8da" opacity={0.9} />
        {/* the knuckle line */}
        <path d={`M ${-w / 2 + 6} ${-length * 0.55} H ${w / 2 - 6}`} stroke="#b08968" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      </g>
    </svg>
  );
}
