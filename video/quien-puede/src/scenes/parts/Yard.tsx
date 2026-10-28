import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The crane yard in silhouette (s01 `yard`): two quay cranes over stacks of containers, flat ink-blue shapes, no
 * colour of its own and no text on the drawing itself (the caption «taller de grúas» is a separate label). It sits at the
 * bottom of the stage, under the folder; a scene fades it back with `dim`.
 */
export const YARD = { w: 1728, h: 300 } as const;

function Crane({ x, scale = 1 }: { x: number; scale?: number }) {
  const s = scale;
  const stroke = alpha(C.ink500, 0.95);
  const fill = alpha(C.ink700, 0.75);
  const px = (v: number) => x + v * s;
  const py = (v: number) => 270 - v * s;
  return (
    <g>
      {/* legs, cross beam and the portal */}
      <path d={`M${px(-70)} 270 L${px(-46)} ${py(200)} M${px(70)} 270 L${px(46)} ${py(200)}`} stroke={stroke} strokeWidth={9 * s} strokeLinecap="round" />
      <path d={`M${px(-62)} ${py(110)} H${px(62)} M${px(-54)} ${py(160)} H${px(54)}`} stroke={stroke} strokeWidth={6 * s} strokeLinecap="round" />
      <rect x={px(-60)} y={py(214)} width={120 * s} height={28 * s} rx={6 * s} fill={fill} stroke={stroke} strokeWidth={5 * s} />
      {/* boom out to the water, and the back reach */}
      <path d={`M${px(-190)} ${py(204)} L${px(330)} ${py(212)}`} stroke={stroke} strokeWidth={12 * s} strokeLinecap="round" />
      {/* mast and stays */}
      <path d={`M${px(-30)} ${py(214)} L${px(0)} ${py(268)} L${px(30)} ${py(214)}`} fill="none" stroke={stroke} strokeWidth={7 * s} strokeLinejoin="round" />
      <path d={`M${px(0)} ${py(268)} L${px(-190)} ${py(204)} M${px(0)} ${py(268)} L${px(330)} ${py(212)}`} stroke={stroke} strokeWidth={5 * s} />
      {/* trolley, rope and a hanging container */}
      <rect x={px(232)} y={py(222)} width={34 * s} height={16 * s} rx={4 * s} fill={stroke} />
      <path d={`M${px(249)} ${py(206)} V${py(120)}`} stroke={alpha(C.ink500, 0.8)} strokeWidth={4 * s} />
      <rect x={px(222)} y={py(120)} width={54 * s} height={26 * s} rx={3 * s} fill={alpha(C.cyanDeep, 0.8)} stroke={stroke} strokeWidth={4 * s} />
    </g>
  );
}

function Stack({ x, w, rows, cols = 2 }: { x: number; w: number; rows: number; cols?: number }) {
  const cw = w / cols;
  const ch = 26;
  return (
    <g>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const tones = [C.ink600, C.ink700, C.cyanDeep, C.ink500];
        return <rect key={i} x={x + c * cw + 2} y={268 - (r + 1) * ch} width={cw - 4} height={ch - 3} rx={3} fill={alpha(tones[(r * 3 + c * 2) % tones.length], 0.7)} stroke={alpha(C.ink500, 0.5)} strokeWidth={2} />;
      })}
    </g>
  );
}

export function Yard({ width = YARD.w, rise = 1, dim = 0, label, labelAt = 0 }: { width?: number; rise?: number; dim?: number; label?: string; labelAt?: number }) {
  const r = clamp01(rise);
  const d = clamp01(dim);
  return (
    <div style={{ position: 'relative', width, height: (width * YARD.h) / YARD.w, opacity: r * (1 - 0.6 * d), transform: `translateY(${(1 - r) * 50}px)` }}>
      <svg width={width} height={(width * YARD.h) / YARD.w} viewBox={`0 0 ${YARD.w} ${YARD.h}`} style={{ display: 'block', overflow: 'visible' }} aria-hidden>
        <path d={`M0 270 H${YARD.w}`} stroke={alpha(C.ink500, 0.9)} strokeWidth={4} />
        <Stack x={20} w={150} rows={3} />
        <Stack x={170} w={110} rows={2} />
        <Crane x={470} scale={1} />
        <Stack x={820} w={160} rows={4} />
        <Stack x={990} w={110} rows={2} />
        <Crane x={1270} scale={0.92} />
        <Stack x={1560} w={150} rows={3} />
      </svg>
      {label ? (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -4, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.muted, opacity: clamp01(labelAt) }}>{label}</div>
      ) : null}
    </div>
  );
}
