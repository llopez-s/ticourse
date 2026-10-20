import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/** The maker's building, own units. */
export const FACTORY = { w: 300, h: 200 } as const;
/** Its door (own units): where an update leaves from. */
export const FACTORY_DOOR = { x: 70, y: 168 } as const;

/**
 * The visitors' program's maker, as a nameless building with a sawtooth roof (s06). `lit` 0–1 brightens it; `ghost`
 * 0–1 brings in the rose silhouette of someone slipping in through the back — drawn dashed, because it is only «si
 * pasara · no ha pasado».
 */
export function Factory({ width, lit = 0, ghost = 0 }: { width: number; lit?: number; ghost?: number }) {
  const h = (width * FACTORY.h) / FACTORY.w;
  const l = clamp01(lit);
  const g = clamp01(ghost);
  const stroke = alpha(C.sky, 0.45 + 0.5 * l);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${FACTORY.w} ${FACTORY.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {l > 0.02 ? <ellipse cx={150} cy={120} rx={170} ry={110} fill={alpha(C.sky, 0.08 * l)} /> : null}
      <path d="M 20 196 L 20 80 L 80 40 L 80 80 L 140 40 L 140 80 L 200 40 L 200 80 L 260 40 L 260 196 Z" fill={C.ink850} stroke={stroke} strokeWidth={4} strokeLinejoin="round" />
      <rect x={226} y={6} width={22} height={60} fill={C.ink850} stroke={stroke} strokeWidth={3} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={110 + k * 46} y={110} width={30} height={26} fill={alpha(C.sky, 0.2 + 0.3 * l)} />
      ))}
      <rect x={50} y={140} width={40} height={56} fill={C.ink950} stroke={stroke} strokeWidth={3} />
      {g > 0.01 ? (
        <g opacity={g} transform={`translate(${290 - 40 * g} 0)`}>
          <circle cx={0} cy={118} r={14} fill="none" stroke={C.rose} strokeWidth={3} strokeDasharray="6 5" />
          <path d="M -20 196 Q -20 140 0 140 Q 20 140 20 196" fill="none" stroke={C.rose} strokeWidth={3} strokeDasharray="6 5" />
        </g>
      ) : null}
    </svg>
  );
}

/** An update as a small package; `signed` 0–1 adds its green seal. Dashed when it is only a «what if». */
export function UpdatePackage({ size, signed = 0, dashed = true }: { size: number; signed?: number; dashed?: boolean }) {
  const s = clamp01(signed);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <rect x={8} y={22} width={84} height={70} rx={8} fill={C.ink800} stroke={C.amber} strokeWidth={4} strokeDasharray={dashed ? '9 6' : undefined} />
      <path d="M 8 40 L 92 40" stroke={alpha(C.amber, 0.7)} strokeWidth={3} />
      <rect x={42} y={22} width={16} height={18} fill={alpha(C.amber, 0.5)} />
      {s > 0.01 ? (
        <g opacity={s} transform={`translate(78 78) scale(${0.7 + 0.3 * s})`}>
          <circle cx={0} cy={0} r={22} fill={C.emeraldDeep} stroke={C.emerald} strokeWidth={4} />
          <path d="M -10 0 L -3 8 L 11 -8" fill="none" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </svg>
  );
}
