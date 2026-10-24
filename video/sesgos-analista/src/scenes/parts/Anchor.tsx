import { alpha } from '../../../../engine/src/theme/tokens';

/**
 * An anchor, drawn with strokes on a 100×120 grid (stroke only: it reads at any size). `color` is its line
 * colour (amber in this video: it is the failure's name); `glow` 0–1 adds a halo.
 */
export function Anchor({ size = 100, color = '#fcd34d', glow = 0 }: { size?: number; color?: string; glow?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      style={{ display: 'block', overflow: 'visible', filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(color, 0.6 * glow)})` : undefined }}
    >
      <g fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={50} cy={14} r={9} />
        <path d="M 50 23 V 104" />
        <path d="M 30 42 H 70" />
        <path d="M 12 80 C 16 108, 38 114, 50 104 C 62 114, 84 108, 88 80" />
        <path d="M 12 80 L 6 64 M 12 80 L 26 72" />
        <path d="M 88 80 L 94 64 M 88 80 L 74 72" />
      </g>
    </svg>
  );
}
