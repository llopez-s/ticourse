import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

export const GYM = { w: 300, h: 190 } as const;
const BOXES = 6;

/** A dumbbell, drawn in the card's units around (cx, cy). */
function Dumbbell({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g transform={`translate(${cx} ${cy})`} fill={color}>
      <rect x={-34} y={-3} width={68} height={6} rx={3} />
      <rect x={-34} y={-16} width={10} height={32} rx={3} />
      <rect x={-46} y={-11} width={10} height={22} rx={3} />
      <rect x={24} y={-16} width={10} height={32} rx={3} />
      <rect x={36} y={-11} width={10} height={22} rx={3} />
    </g>
  );
}

/**
 * The gym fee (concept 3, «imagen · no es del puerto»): a membership card with a dumbbell, «cuota del gimnasio» and a
 * row of six monthly boxes. `paid` 0–1 ticks them in amber one after another (paying again and again for a gym you do
 * not go to); `label` false leaves the card wordless (small icons).
 */
export function GymCard({ width = GYM.w, paid = 1, label = true }: { width?: number; paid?: number; label?: boolean }) {
  const s = width / GYM.w;
  const p = clamp01(paid);
  return (
    <svg width={GYM.w * s} height={GYM.h * s} viewBox={`0 0 ${GYM.w} ${GYM.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={4} y={4} width={GYM.w - 8} height={GYM.h - 8} rx={18} fill="#1f2a44" stroke={alpha(C.amber, 0.75)} strokeWidth={4} />
      <rect x={4} y={34} width={GYM.w - 8} height={16} fill={alpha(C.amber, 0.25)} />
      <Dumbbell cx={64} cy={92} color={C.amber} />
      {label ? (
        <text x={122} y={100} fontFamily={FONT.sans} fontSize={30} fontWeight={800} fill={C.textStrong}>
          cuota
        </text>
      ) : (
        <rect x={124} y={80} width={130} height={20} rx={8} fill={alpha('#e2e8f0', 0.5)} />
      )}
      {Array.from({ length: BOXES }, (_, k) => {
        const on = clamp01(p * BOXES - k);
        const x = 30 + k * 42;
        return (
          <g key={k}>
            <rect x={x} y={128} width={32} height={32} rx={7} fill={alpha(C.amber, 0.12 + 0.2 * on)} stroke={alpha(C.amber, 0.5 + 0.5 * on)} strokeWidth={3} />
            {on > 0.05 ? <path d={`M ${x + 7} ${145} l 6 6 l 12 -13`} fill="none" stroke={C.amber} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={on} /> : null}
          </g>
        );
      })}
    </svg>
  );
}
