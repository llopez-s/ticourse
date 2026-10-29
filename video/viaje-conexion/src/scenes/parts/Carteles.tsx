import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The signs of a crossroads (routing metaphor, s04 and s05): a pole with arrow plates, one arrow each.
 * Only the plate of the current crossing lights up (`lit` 0-1), never the whole route. Pictured, not literal:
 * the scene adds the «imagen · no es del puerto» tag.
 */
export interface Plate {
  /** 1 = arrow points right, -1 = points left. */
  dir: 1 | -1;
  /** 0-1: how lit this plate is. */
  lit: number;
  /** Tilt in degrees (a little life; +/- 8). */
  tilt?: number;
}

const PLATE_W = 110;
const PLATE_H = 42;

function PlateShape({ y, plate }: { y: number; plate: Plate }) {
  const cx = 80;
  const x0 = plate.dir === 1 ? cx - 24 : cx + 24 - PLATE_W;
  const tip = plate.dir === 1 ? x0 + PLATE_W + 14 : x0 - 14;
  const near = plate.dir === 1 ? x0 + PLATE_W : x0;
  const far = plate.dir === 1 ? x0 : x0 + PLATE_W;
  const pts = `${far},${y} ${near},${y} ${tip},${y + PLATE_H / 2} ${near},${y + PLATE_H} ${far},${y + PLATE_H}`;
  const lit = plate.lit;
  const stroke = lit > 0.02 ? C.cyan : C.muted;
  const fill = lit > 0.02 ? alpha(C.cyan, 0.16 + 0.2 * lit) : alpha(C.ink500, 0.9);
  const ax1 = plate.dir === 1 ? far + 16 : far - 16;
  const ax2 = plate.dir === 1 ? near + 2 : near - 2;
  return (
    <g transform={`rotate(${plate.tilt ?? 0} ${cx} ${y + PLATE_H / 2})`} style={{ filter: lit > 0.05 ? `drop-shadow(0 0 ${Math.round(12 * lit)}px ${alpha(C.cyan, 0.7 * lit)})` : undefined }}>
      <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${ax1},${y + PLATE_H / 2} H${ax2}`} stroke={lit > 0.02 ? C.cyanSoft : C.text} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

/** A pole with `plates` stacked from the top. Native size 160 x (36 + 56 per plate). */
export function SignPost({ plates, scale = 1, opacity = 1 }: { plates: readonly Plate[]; scale?: number; opacity?: number }) {
  const h = 30 + plates.length * 56 + 24;
  return (
    <svg width={160 * scale} height={h * scale} viewBox={`0 0 160 ${h}`} style={{ display: 'block', overflow: 'visible', opacity }} aria-hidden>
      <rect x="76" y="14" width="8" height={h - 14} rx="3" fill={C.ink600} />
      <circle cx="80" cy="12" r="9" fill={C.ink500} />
      {plates.map((p, i) => (
        <PlateShape key={i} y={26 + i * 56} plate={p} />
      ))}
      <rect x="62" y={h - 8} width="36" height="8" rx="3" fill={C.ink600} />
    </svg>
  );
}
