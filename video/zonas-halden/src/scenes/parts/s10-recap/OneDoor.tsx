import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * Rule 2's «una sola puerta» (s05's image, the network control room, drawn
 * here as an icon only): a wall with ONE door, a card-and-PIN reader beside
 * it and a camera over it. `lit` 0–1 lights the door (cyan: the control).
 * Design 160 × 150, scaled to `width`.
 */
export function OneDoor({ width = 150, lit = 0 }: { width?: number; lit?: number }) {
  const l = clamp01(lit);
  const s = width / 160;
  const h = 150 * s;
  const sw = (base: number, minPx: number) => Math.max(base, minPx / s);
  return (
    <svg width={width} height={h} viewBox="0 0 160 150" style={{ display: 'block', overflow: 'visible' }}>
      {/* the wall and its roof line */}
      <rect x={6} y={22} width={148} height={124} rx={6} fill={C.ink850} stroke="#64748b" strokeWidth={sw(3, 1.6)} />
      <path d="M 2 22 L 158 22" stroke="#64748b" strokeWidth={sw(5, 2)} strokeLinecap="round" />
      {/* brick hint */}
      <path d="M 14 50 L 46 50 M 14 80 L 40 80 M 120 64 L 146 64 M 128 128 L 146 128" stroke={alpha('#64748b', 0.45)} strokeWidth={sw(2, 1)} strokeLinecap="round" />
      {/* glow behind the one door */}
      {l > 0.01 ? <rect x={48} y={46} width={64} height={104} rx={8} fill={alpha(C.cyan, 0.22 * l)} /> : null}
      {/* the door */}
      <rect x={56} y={56} width={48} height={90} rx={4} fill={alpha(C.cyan, 0.1 + 0.2 * l)} stroke={C.cyan} strokeWidth={sw(3.4, 1.8)} />
      <circle cx={95} cy={104} r={3.6} fill={C.cyan} />
      {/* card + PIN reader */}
      <rect x={114} y={86} width={20} height={30} rx={3} fill={C.ink900} stroke={C.cyanSoft} strokeWidth={sw(2, 1.2)} />
      <circle cx={124} cy={93} r={2.6} fill={l > 0.5 ? C.emerald : alpha(C.emerald, 0.5)} />
      <path d="M 119 101 L 129 101 M 119 107 L 129 107" stroke={alpha(C.cyanSoft, 0.7)} strokeWidth={sw(1.6, 1)} />
      {/* the camera over the door: everything is recorded */}
      <g transform="translate(38 34) rotate(18)">
        <rect x={-12} y={-6} width={26} height={13} rx={3} fill={C.ink800} stroke={C.cyanSoft} strokeWidth={sw(2, 1.2)} />
        <circle cx={14} cy={0.5} r={3} fill={C.cyan} />
      </g>
      <line x1={26} y1={30} x2={26} y2={22} stroke="#64748b" strokeWidth={sw(2.4, 1.2)} />
    </svg>
  );
}
