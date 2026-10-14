import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { BAND_H, CANVAS, bandTop, type Rect } from './geometry';
import { FURN, PAINT } from './Art';

/**
 * What each band of the canvas is made of, and the two loose props (the painter's hand, the archive box).
 * All in design units, drawn inside the caller's <svg>; every piece takes a 0–1 `show`.
 */

const SKIN = '#cbd5e1';

/**
 * A hand holding a brush, the brush's tip on (x, y). `angle` (deg) tilts it; 0 = the handle rises up and
 * to the right. `size` 1 ≈ 120 design units long.
 */
export function BrushHand({ x, y, size = 1, angle = 0, show = 1 }: { x: number; y: number; size?: number; angle?: number; show?: number }) {
  if (show <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`} opacity={show}>
      {/* the brush: bristles, ferrule, handle */}
      <path d="M0 0 L11 -5 L15 -15 L5 -11 Z" fill={PAINT.umber} />
      <path d="M10 -6 L20 -16 L24 -24 L15 -15 Z" fill="#94a3b8" stroke={FURN.dark} strokeWidth={1} />
      <path d="M19 -19 L92 -92" stroke="#a8824a" strokeWidth={7} strokeLinecap="round" />
      <path d="M19 -19 L92 -92" stroke={alpha('#000000', 0.25)} strokeWidth={2} strokeLinecap="round" transform="translate(2 2)" />
      {/* the hand that grips it, in the handle's own axes (x along the handle, y towards the forearm) */}
      <g transform="translate(54 -54) rotate(-45)">
        <rect x={-16} y={24} width={32} height={74} rx={5} fill={FURN.mid} stroke={alpha('#000000', 0.45)} strokeWidth={1.5} />
        <rect x={-19} y={22} width={38} height={13} rx={4} fill={FURN.steel} stroke={alpha('#000000', 0.45)} strokeWidth={1.5} />
        <rect x={-23} y={-12} width={46} height={40} rx={14} fill={SKIN} stroke={alpha('#0f172a', 0.6)} strokeWidth={1.8} />
        <path d="M-11 -10 V8 M0 -11 V9 M11 -10 V8" fill="none" stroke={alpha('#0f172a', 0.45)} strokeWidth={1.8} strokeLinecap="round" />
        <ellipse cx={-6} cy={15} rx={15} ry={7.5} fill={SKIN} stroke={alpha('#0f172a', 0.6)} strokeWidth={1.8} transform="rotate(-12 -6 15)" />
      </g>
    </g>
  );
}

/** Band 1: what it is made of. The weave of the canvas shows through and three heaps of pigment sit on it. */
export function Materials({ show = 1 }: { show?: number }) {
  if (show <= 0.001) return null;
  const y0 = bandTop(0);
  const lines = [];
  for (let x = CANVAS.x + 6; x < CANVAS.x + CANVAS.w; x += 9) lines.push(`M ${x} ${y0} V ${y0 + BAND_H}`);
  for (let y = y0 + 5; y < y0 + BAND_H; y += 9) lines.push(`M ${CANVAS.x} ${y} H ${CANVAS.x + CANVAS.w}`);
  const heaps: [number, string][] = [
    [70, PAINT.ochre],
    [118, PAINT.sienna],
    [166, PAINT.slate],
  ];
  return (
    <g opacity={show}>
      <path d={lines.join(' ')} stroke={alpha('#fff7e0', 0.3)} strokeWidth={1.4} fill="none" />
      {heaps.map(([cx, fill]) => (
        <g key={cx} transform={`translate(${cx} ${y0 + BAND_H - 34})`}>
          <ellipse cx={0} cy={14} rx={24} ry={6} fill={alpha('#000000', 0.35)} />
          <path d="M-22 12 Q-14 -16 0 -18 Q14 -16 22 12 Z" fill={fill} stroke={alpha('#fff7e0', 0.85)} strokeWidth={2.4} strokeLinejoin="round" />
        </g>
      ))}
    </g>
  );
}

/** Band 2: who painted it. A fingerprint left in the varnish (the slip, not the style). */
export function Fingerprint({ show = 1, lit = 0 }: { show?: number; lit?: number }) {
  if (show <= 0.001) return null;
  const cx = 286;
  const cy = bandTop(1) + BAND_H * 0.5;
  const ink = alpha('#fffbea', 0.92);
  return (
    <g opacity={show} style={lit > 0.02 ? { filter: `drop-shadow(0 0 ${6 + 10 * lit}px ${alpha('#ffffff', 0.7 * lit)})` } : undefined}>
      <ellipse cx={cx} cy={cy} rx={44} ry={54} fill={alpha('#0b1220', 0.34)} />
      <g fill="none" stroke={ink} strokeWidth={3.4} strokeLinecap="round">
        {[10, 20, 30, 40].map((r) => (
          <path key={r} d={`M ${cx - r} ${cy + r * 0.9} V ${cy - r * 0.15} A ${r} ${r * 1.05} 0 0 1 ${cx + r} ${cy - r * 0.15} V ${cy + r * 0.9}`} />
        ))}
        <path d={`M ${cx} ${cy - 2} V ${cy + 34}`} />
      </g>
    </g>
  );
}

/** Band 3: who commissioned it is NOT in the painting. A dashed, empty outline where a paper would be. */
export function Absent({ show = 1 }: { show?: number }) {
  if (show <= 0.001) return null;
  const cx = CANVAS.x + CANVAS.w / 2;
  const cy = bandTop(2) + BAND_H / 2;
  return (
    <g opacity={show} fill="none" stroke={alpha('#f8fafc', 0.9)} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="9 9">
      <path d={`M ${cx - 36} ${cy - 46} H ${cx + 18} L ${cx + 36} ${cy - 28} V ${cy + 46} H ${cx - 36} Z`} fill={alpha('#0b1220', 0.3)} />
    </g>
  );
}

/**
 * The archive box with the contract kept in it — outside the painting. `r` is its design-unit rect;
 * `contract` 0–1 slides the paper up out of the box; `lit` 0–1 tints its seal sky (a source beyond your
 * network); `dark` 0–1 leaves the whole thing in the dark.
 */
export function ArchiveBox({ r, show = 1, contract = 1, lit = 0, dark = 0 }: { r: Rect; show?: number; contract?: number; lit?: number; dark?: number }) {
  if (show <= 0.001) return null;
  const cx = r.x + r.w / 2;
  const rise = 34 * contract;
  const boxTop = r.y + r.h * 0.42;
  return (
    <g opacity={show * (1 - 0.72 * dark)}>
      {/* the contract: a paper with a seal, standing in the box */}
      <g transform={`translate(0 ${-rise})`} opacity={contract}>
        <rect x={cx - 30} y={boxTop - 6} width={60} height={74} rx={3} fill="#e8e4d8" stroke={alpha('#0f172a', 0.5)} strokeWidth={1.5} />
        <path d={`M ${cx - 20} ${boxTop + 8} H ${cx + 20} M ${cx - 20} ${boxTop + 19} H ${cx + 12} M ${cx - 20} ${boxTop + 30} H ${cx + 4}`} stroke={alpha('#0f172a', 0.5)} strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx + 15} cy={boxTop + 31} r={8} fill={lit > 0.5 ? C.sky : '#7c8aa0'} stroke={alpha('#0f172a', 0.5)} strokeWidth={1.2} />
      </g>
      {/* the box */}
      <rect x={r.x} y={boxTop} width={r.w} height={r.y + r.h - boxTop} rx={5} fill={FURN.dark} stroke={FURN.steel} strokeWidth={2.4} />
      <rect x={r.x - 4} y={boxTop - 7} width={r.w + 8} height={13} rx={4} fill={FURN.mid} stroke={FURN.steel} strokeWidth={2} />
      <rect x={cx - 24} y={boxTop + 20} width={48} height={20} rx={3} fill={alpha('#e2e8f0', 0.16)} stroke={alpha('#e2e8f0', 0.6)} strokeWidth={1.6} />
      <path d={`M ${cx - 14} ${boxTop + 30} H ${cx + 14}`} stroke={alpha('#e2e8f0', 0.6)} strokeWidth={2.4} strokeLinecap="round" />
      {lit > 0.02 ? <rect x={r.x - 4} y={boxTop - 7} width={r.w + 8} height={r.y + r.h - boxTop + 7} rx={6} fill="none" stroke={alpha(C.sky, 0.9 * lit)} strokeWidth={2.6} /> : null}
    </g>
  );
}
