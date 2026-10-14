import { alpha } from '../../../../../engine/src/theme/tokens';
import { INK, clamp01, lerp } from './geom';

/**
 * The safe («la caja fuerte»): top-left at (x, y), `w` wide (1.39 × w tall).
 * - `open` 0 = closed, 1 = its door swung open and its shelves half empty;
 * - `lit` 0–1: emerald, closed and safe («lo importante está a salvo»);
 * - `warn` 0–1: amber, it is being emptied (only ever a hypothesis).
 */
export function SafeGlyph({ x, y, w, open = 0, lit = 0, warn = 0, opacity = 1 }: { x: number; y: number; w: number; open?: number; lit?: number; warn?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const s = w / 88;
  const o = clamp01(open);
  const l = clamp01(lit) * (1 - o);
  const wn = clamp01(warn);
  const edge = wn > 0.5 ? INK.amber : l > 0.5 ? INK.emerald : INK.line;
  const leafW = lerp(72, 16, o);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      {l > 0.01 || wn > 0.01 ? <rect x={-10} y={-10} width={108} height={142} rx={16} fill={alpha(wn > 0.01 ? INK.amber : INK.emerald, 0.12 * Math.max(l, wn))} /> : null}
      {/* body */}
      <rect x={0} y={0} width={88} height={116} rx={8} fill="#1a2740" stroke={edge} strokeWidth={4.5} />
      <rect x={6} y={116} width={14} height={6} fill={INK.line} />
      <rect x={68} y={116} width={14} height={6} fill={INK.line} />
      {/* inside: two shelves, emptier as it opens */}
      <rect x={8} y={8} width={72} height={100} rx={4} fill="#060b15" />
      <path d="M8 58 H80" stroke={alpha(INK.line, 0.7)} strokeWidth={2.5} />
      <rect x={16} y={38} width={24} height={18} rx={2} fill={alpha(INK.steel, 0.8 * (1 - 0.8 * o))} />
      <rect x={46} y={30} width={26} height={26} rx={2} fill={alpha(INK.steel, 0.6 * (1 - o))} />
      <rect x={18} y={84} width={50} height={22} rx={2} fill={alpha(INK.steel, 0.7 * (1 - 0.6 * o))} />
      {/* door leaf, hinged on the left */}
      <rect x={8} y={8} width={leafW} height={100} rx={4} fill="#22324e" stroke={edge} strokeWidth={3.5} />
      {o < 0.6 ? (
        <g opacity={1 - o / 0.6}>
          <circle cx={8 + leafW * 0.5} cy={52} r={15} fill="none" stroke={edge} strokeWidth={4} />
          <circle cx={8 + leafW * 0.5} cy={52} r={4} fill={edge} />
          <path d={`M${8 + leafW * 0.5} 37 v8 M${8 + leafW * 0.5 - 15} 52 h8 M${8 + leafW * 0.5 + 7} 52 h8`} stroke={edge} strokeWidth={3.5} strokeLinecap="round" />
          <rect x={8 + leafW * 0.5 - 12} y={78} width={24} height={8} rx={4} fill={edge} />
        </g>
      ) : null}
    </g>
  );
}
