import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The image's own units: three stations of 500 each, side by side. */
export const KITCHEN = { w: 1500, h: 300 } as const;
/** One colour per cook: the ham (on purpose), the fridge (by mistake), the home fryer (his own thing). */
export const COOK_TONES = [C.rose, C.amber, C.sky] as const;

/** A cook with a chef's hat and apron, feet at (x, y); `facing` 1 = right, -1 = left. */
function Cook({ x, y, tone, facing = 1 }: { x: number; y: number; tone: string; facing?: 1 | -1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${facing} 1)`}>
      <path d="M -14 0 L -10 -60 M 14 0 L 10 -60" stroke={C.ink600} strokeWidth={16} strokeLinecap="round" />
      <rect x={-30} y={-150} width={60} height={96} rx={20} fill="#e2e8f0" />
      <rect x={-22} y={-110} width={44} height={58} rx={6} fill={tone} opacity={0.85} />
      <circle cx={0} cy={-172} r={24} fill="#e7c9a9" />
      <circle cx={10} cy={-176} r={3.5} fill={C.ink950} />
      <rect x={-22} y={-206} width={44} height={16} fill="#f8fafc" />
      <circle cx={-14} cy={-212} r={14} fill="#f8fafc" />
      <circle cx={2} cy={-218} r={16} fill="#f8fafc" />
      <circle cx={16} cy={-210} r={12} fill="#f8fafc" />
    </g>
  );
}

/**
 * Concept 3 · the kitchen (always with «imagen · no es del puerto», which the scene draws): one tiled kitchen, three
 * cooks who already work inside — nobody had to sneak in. Left, one slips off with a ham leg (rose); middle, the fridge
 * left open, cold mist drifting out (amber); right, a home fryer plugged in that nobody checked (sky). No till, clock,
 * notebook or technician (V26's cafeteria). `lit` 0–1 per station brings each one up; the others stay at half light.
 */
export function Kitchen({ width, lit = [1, 1, 1] }: { width: number; lit?: readonly number[] }) {
  const h = (width * KITCHEN.h) / KITCHEN.w;
  const op = (i: number) => 0.4 + 0.6 * clamp01(lit[i] ?? 0);
  const glow = (i: number, tone: string) => `drop-shadow(0 0 ${Math.round(16 * clamp01(lit[i] ?? 0))}px ${alpha(tone, 0.5)})`;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${KITCHEN.w} ${KITCHEN.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <pattern id="kt-tiles" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="#16223a" />
          <path d="M 0 0 H 50 M 0 0 V 50" stroke="#22314f" strokeWidth="3" />
        </pattern>
      </defs>
      <rect x={0} y={0} width={KITCHEN.w} height={KITCHEN.h} rx={18} fill="url(#kt-tiles)" />
      <rect x={0} y={272} width={KITCHEN.w} height={28} fill="#0f172a" />
      {/* the long counter */}
      <rect x={20} y={176} width={KITCHEN.w - 40} height={18} rx={4} fill="#475569" />

      {/* 1 · the ham, carried off on purpose: a cured ham leg hugged to the chest, walking off to the right */}
      <g opacity={op(0)} style={{ filter: glow(0, C.rose) }}>
        <path d="M 120 214 h 54 M 100 236 h 60 M 126 256 h 44" stroke={alpha(C.roseSoft, 0.6)} strokeWidth={5} strokeLinecap="round" strokeDasharray="12 10" />
        <Cook x={250} y={272} tone={COOK_TONES[0]} facing={1} />
        <g transform="translate(236 132) rotate(-32)">
          <path d="M 0 22 C 0 -6 40 -26 84 -20 C 128 -14 150 14 140 40 C 130 66 92 70 60 60 C 38 54 22 46 8 40 Z" fill="#9f4a3c" stroke="#e8b4a0" strokeWidth={4} />
          <path d="M 70 -10 C 104 -8 126 12 124 34" fill="none" stroke="#f1e3c8" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
          <rect x={-46} y={18} width={52} height={14} rx={7} fill="#5b3a2a" />
          <circle cx={-48} cy={25} r={10} fill="#f1e3c8" />
        </g>
      </g>

      {/* 2 · the fridge, left open */}
      <g opacity={op(1)} style={{ filter: glow(1, C.amber) }}>
        <rect x={580} y={52} width={130} height={220} rx={10} fill="#64748b" stroke="#94a3b8" strokeWidth={4} />
        <rect x={592} y={64} width={106} height={196} rx={6} fill="#1e3a5f" />
        <rect x={600} y={116} width={90} height={7} fill="#94a3b8" />
        <rect x={600} y={180} width={90} height={7} fill="#94a3b8" />
        <rect x={608} y={92} width={26} height={24} rx={4} fill={alpha('#fde68a', 0.6)} />
        <rect x={648} y={154} width={30} height={26} rx={4} fill={alpha('#fca5a5', 0.6)} />
        <path d="M 710 52 L 780 76 L 780 252 L 710 272 Z" fill="#475569" stroke="#94a3b8" strokeWidth={4} />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${720 + k * 10} ${110 + k * 50} q 40 -14 80 0 q 40 14 80 0`} fill="none" stroke={alpha(C.amber, 0.7)} strokeWidth={5} strokeLinecap="round" />
        ))}
        <Cook x={900} y={272} tone={COOK_TONES[1]} facing={1} />
      </g>

      {/* 3 · the fryer from home, plugged in, unchecked */}
      <g opacity={op(2)} style={{ filter: glow(2, C.sky) }}>
        <Cook x={1110} y={272} tone={COOK_TONES[2]} facing={1} />
        <rect x={1220} y={104} width={130} height={72} rx={14} fill="#334155" stroke={C.sky} strokeWidth={4} />
        <rect x={1236} y={92} width={98} height={16} rx={6} fill="#475569" />
        <rect x={1350} y={124} width={50} height={10} rx={5} fill="#64748b" />
        <path d="M 1290 176 C 1300 230 1380 240 1420 200" fill="none" stroke={C.sky} strokeWidth={5} />
        <rect x={1410} y={176} width={40} height={50} rx={6} fill="#cbd5e1" />
        <circle cx={1424} cy={200} r={4} fill={C.ink900} />
        <circle cx={1436} cy={200} r={4} fill={C.ink900} />
      </g>
    </svg>
  );
}
