import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

export const ONCALL = { w: 320, h: 300 } as const;

/**
 * The SOC's on-call person seen from behind at the desk: a plain silhouette (no face, no name, no gender), the desk
 * edge, a keyboard, and a stopwatch dial on the desk whose hand turns (`spin`, turns) — elapsed time, never a clock
 * time, so the dial has no digits.
 */
export function OnCall({ width, spin, glow = 0 }: { width: number; spin: number; glow?: number }) {
  const g = clamp01(glow);
  const a = 2 * Math.PI * spin;
  return (
    <svg width={width} height={(width * ONCALL.h) / ONCALL.w} viewBox={`0 0 ${ONCALL.w} ${ONCALL.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* a soft screen-glow on the silhouette */}
      <ellipse cx={150} cy={120} rx={150} ry={110} fill={alpha(C.cyan, 0.08 + 0.1 * g)} />
      {/* the person */}
      <circle cx={150} cy={92} r={40} fill={C.ink600} stroke={alpha(C.cyan, 0.35)} strokeWidth={3} />
      <path d="M 66 236 Q 66 146 150 140 Q 234 146 234 236 Z" fill={C.ink600} stroke={alpha(C.cyan, 0.35)} strokeWidth={3} />
      {/* the desk */}
      <rect x={0} y={222} width={ONCALL.w} height={22} rx={6} fill={C.ink700} stroke={alpha(C.text, 0.3)} strokeWidth={2} />
      <rect x={18} y={244} width={16} height={56} fill={C.ink800} />
      <rect x={ONCALL.w - 34} y={244} width={16} height={56} fill={C.ink800} />
      <rect x={96} y={210} width={108} height={14} rx={4} fill={alpha(C.text, 0.25)} />
      {/* the stopwatch */}
      <g transform="translate(270 196)">
        <rect x={-6} y={-36} width={12} height={8} rx={2} fill={alpha(C.text, 0.6)} />
        <circle cx={0} cy={0} r={28} fill={C.ink900} stroke={C.amber} strokeWidth={4} />
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={0} y1={-22} x2={0} y2={-17} stroke={alpha(C.text, 0.5)} strokeWidth={3} transform={`rotate(${k * 90})`} />
        ))}
        <line x1={0} y1={0} x2={18 * Math.sin(a)} y2={-18 * Math.cos(a)} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
        <circle cx={0} cy={0} r={4} fill={C.amber} />
      </g>
    </svg>
  );
}
