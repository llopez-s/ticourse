import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The grey hand of s07 («si alguien maneja el programa»): an abstract open hand, no skin, no face, no gender. Grey (muted)
 * because it is whoever ends up driving the process; `tone` lets a scene tint it amber once it reaches too far.
 * The icon set has no hand, so it is drawn here (palm, four fingers and a thumb in a 120×140 box scaled to `size` wide).
 */
export function GreyHand({ size = 150, tone = C.muted, tilt = 0 }: { size?: number; tone?: string; tilt?: number }) {
  const fill = alpha(tone, 0.28);
  return (
    <svg width={size} height={(size * 140) / 120} viewBox="0 0 120 140" style={{ display: 'block', flexShrink: 0, overflow: 'visible', transform: `rotate(${tilt}deg)` }} aria-hidden>
      <g fill={fill} stroke={tone} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
        <rect x={26} y={20} width={15} height={62} rx={7.5} />
        <rect x={44} y={8} width={15} height={74} rx={7.5} />
        <rect x={62} y={14} width={15} height={68} rx={7.5} />
        <rect x={80} y={28} width={15} height={56} rx={7.5} />
        <rect x={22} y={62} width={76} height={66} rx={26} />
        <rect x={4} y={70} width={15} height={46} rx={7.5} transform="rotate(-32 11 93)" />
      </g>
    </svg>
  );
}
