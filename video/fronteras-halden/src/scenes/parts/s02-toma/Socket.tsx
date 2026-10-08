import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { INK, dropGlow, joinFilters } from '../glyphs';

/**
 * A network wall socket seen from the front (s01's first path, s02's free socket and the floor's sockets):
 * a wall plate with one RJ45 mouth. `plugged` 0–1 pushes a plug into it with its cable leaving downwards
 * (`cable` = how far the cable is drawn below the plate, in design units of the 100-unit box). `color`
 * tints the plate's outline (slate by default: the wall belongs to nobody; the scene lights it). Design
 * 100 × 100 units scaled to `size` px; the cable may hang below the box (overflow visible).
 */
export function WallSocket({
  size,
  color = INK.steel,
  plugged = 0,
  cable = 60,
  cableColor = C.cyan,
  glow = 0,
  strokeMin = 2,
}: {
  size: number;
  color?: string;
  plugged?: number;
  cable?: number;
  cableColor?: string;
  glow?: number;
  /** Thinnest stroke in screen px (icons stay legible). */
  strokeMin?: number;
}) {
  const k = size / 100;
  const sw = (base: number) => Math.max(base, strokeMin / k);
  const p = clamp01(plugged);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible', filter: joinFilters(dropGlow(color, clamp01(glow))) }}>
      {/* Plate */}
      <rect x={8} y={8} width={84} height={84} rx={14} fill={C.ink850} stroke={color} strokeWidth={sw(3.2)} />
      <circle cx={50} cy={17} r={2.6} fill={alpha(color, 0.7)} />
      <circle cx={50} cy={83} r={2.6} fill={alpha(color, 0.7)} />
      {/* RJ45 mouth with its key */}
      <path d="M 28 34 L 72 34 L 72 64 L 59 64 L 59 71 L 41 71 L 41 64 L 28 64 Z" fill={C.ink950} stroke={color} strokeWidth={sw(2.6)} strokeLinejoin="round" />
      <path d="M 35 38 L 35 46 M 41 38 L 41 46 M 47 38 L 47 46 M 53 38 L 53 46 M 59 38 L 59 46 M 65 38 L 65 46" stroke={alpha(color, 0.6)} strokeWidth={sw(1.8)} strokeLinecap="round" />
      {/* The plug and its cable */}
      {p > 0.01 ? (
        <g opacity={Math.min(1, p * 2)}>
          <line x1={50} y1={70 + 30 * (1 - p)} x2={50} y2={70 + 30 * (1 - p) + cable} stroke={cableColor} strokeWidth={sw(6)} strokeLinecap="round" />
          <rect x={33} y={36 + 30 * (1 - p)} width={34} height={36} rx={5} fill={alpha(cableColor, 0.25)} stroke={cableColor} strokeWidth={sw(3)} />
          <rect x={44} y={30 + 30 * (1 - p)} width={12} height={8} rx={2} fill={cableColor} />
        </g>
      ) : null}
    </svg>
  );
}
