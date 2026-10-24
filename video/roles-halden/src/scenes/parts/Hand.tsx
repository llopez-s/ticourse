import { C, alpha } from '../../../../engine/src/theme/tokens';

/** The hand's own box: 100 wide, 150 high, fingers up. */
export const HAND = { w: 100, h: 150 } as const;

/** Shapes of one open hand (palm, four fingers, thumb), in the 100×150 box. */
function Shapes({ fill, stroke, sw }: { fill: string; stroke?: string; sw?: number }) {
  const common = { fill, stroke, strokeWidth: sw, strokeLinejoin: 'round' as const };
  return (
    <>
      <rect x={20} y={70} width={62} height={72} rx={22} {...common} />
      <rect x={21} y={20} width={14} height={66} rx={7} {...common} />
      <rect x={37} y={6} width={14} height={80} rx={7} {...common} />
      <rect x={53} y={12} width={14} height={74} rx={7} {...common} />
      <rect x={69} y={30} width={13} height={58} rx={6.5} {...common} />
      <rect x={4} y={78} width={14} height={52} rx={7} transform="rotate(-32 11 104)" {...common} />
    </>
  );
}

/**
 * An open hand, drawn as a union (thick outline, then the fills on top, so no line shows between the fingers).
 * `angle` 0 = fingers up, 90 = fingers to the right; `cx`, `cy` is its centre in the parent's coordinates. `size` is
 * the height in px. `glow` 0–1 lights it (the hand that decides).
 */
export function Hand({ cx, cy, angle = 0, size = 150, tone = C.sky, glow = 0, opacity = 1 }: { cx: number; cy: number; angle?: number; size?: number; tone?: string; glow?: number; opacity?: number }) {
  const k = size / HAND.h;
  return (
    <svg
      width={HAND.w * k}
      height={HAND.h * k}
      viewBox={`0 0 ${HAND.w} ${HAND.h}`}
      style={{
        position: 'absolute',
        left: cx - (HAND.w * k) / 2,
        top: cy - (HAND.h * k) / 2,
        opacity,
        transform: `rotate(${angle}deg)`,
        overflow: 'visible',
        filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(tone, 0.75 * glow)})` : undefined,
      }}
    >
      <Shapes fill="none" stroke={alpha(tone, 0.55 + 0.4 * glow)} sw={7} />
      <Shapes fill={C.ink850} />
      <Shapes fill={alpha(tone, 0.1 + 0.2 * glow)} />
    </svg>
  );
}
