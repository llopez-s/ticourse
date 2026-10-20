import { useCurrentFrame } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

export const HEATER = { w: 160, h: 130 } as const;
export const COAT = { w: 130, h: 170 } as const;

/**
 * The office heater (concept 2, «imagen · no es del puerto»): a radiator with six fins; `warm` 0–1 lights its heat
 * waves. It stays in the office.
 */
export function Heater({ width = HEATER.w, warm = 1, frame: frameProp }: { width?: number; warm?: number; frame?: number }) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const s = width / HEATER.w;
  const w = clamp01(warm);
  return (
    <svg width={HEATER.w * s} height={HEATER.h * s} viewBox={`0 0 ${HEATER.w} ${HEATER.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {[0, 1, 2].map((k) => {
        const off = ((frame / 3 + k * 6) % 18) - 9;
        return (
          <path
            key={k}
            d={`M ${48 + k * 32} 34 q -8 -8 0 -16 q 8 -8 0 -16`}
            transform={`translate(0 ${off * 0.4})`}
            fill="none"
            stroke={alpha(C.amber, 0.75 * w)}
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}
      <rect x={14} y={44} width={132} height={74} rx={10} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={k} x={24 + k * 20} y={50} width={12} height={62} rx={6} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={2} />
      ))}
      <rect x={24} y={118} width={10} height={10} fill="#94a3b8" />
      <rect x={126} y={118} width={10} height={10} fill="#94a3b8" />
    </svg>
  );
}

/**
 * The coat on its hanger (concept 2): what you wear goes with you. `glow` 0–1 adds a warm cyan halo (it is what
 * protects you outside).
 */
export function Coat({ width = COAT.w, glow = 0 }: { width?: number; glow?: number }) {
  const s = width / COAT.w;
  const g = clamp01(glow);
  return (
    <svg width={COAT.w * s} height={COAT.h * s} viewBox={`0 0 ${COAT.w} ${COAT.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {g > 0.01 ? <ellipse cx={65} cy={98} rx={70} ry={76} fill={alpha(C.cyan, 0.16 * g)} /> : null}
      {/* hanger */}
      <path d="M 65 22 q 0 -12 10 -12 q 10 0 10 9" fill="none" stroke="#cbd5e1" strokeWidth={4} strokeLinecap="round" />
      <path d="M 65 22 L 22 42 L 108 42 Z" fill="none" stroke="#cbd5e1" strokeWidth={4} strokeLinejoin="round" />
      {/* coat body and sleeves */}
      <path d="M 40 40 L 90 40 L 116 62 L 120 130 L 104 132 L 100 80 L 100 160 L 30 160 L 30 80 L 26 132 L 10 130 L 14 62 Z" fill="#0e7490" stroke={C.cyanSoft} strokeWidth={3} strokeLinejoin="round" />
      {/* collar and opening */}
      <path d="M 50 40 L 65 66 L 80 40" fill="#155e75" stroke={C.cyanSoft} strokeWidth={3} strokeLinejoin="round" />
      <line x1={65} y1={66} x2={65} y2={160} stroke={C.cyanSoft} strokeWidth={2.5} />
      {[86, 108, 130].map((y) => (
        <circle key={y} cx={72} cy={y} r={3.5} fill={C.cyanSoft} />
      ))}
      <rect x={38} y={112} width={20} height={4} rx={2} fill={C.cyanSoft} />
    </svg>
  );
}
