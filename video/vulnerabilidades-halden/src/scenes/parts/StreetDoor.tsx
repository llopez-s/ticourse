import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The street door close-up, in its own units. */
export const SD = { w: 520, h: 560 } as const;
const FRAME = { x: 130, y: 120, w: 260, h: 380 } as const;
const GROUND = 520;

/**
 * The rental building's street door, close up («imagen · no es del puerto»): a plain wooden door in its portal with a
 * bar handle — no keyhole, keypad, intercom, code or card reader. `open` 0–1 swings it inwards (the leaf narrows) and
 * the hall light spills amber onto the pavement; `night` 0–1 darkens the façade and lights the wall lamp; `jolt` 0–1
 * gives the leaf one knock and an amber flash (the «error» on `open-door`).
 */
export function StreetDoor({ width = SD.w, open = 0, night = 0, jolt = 0 }: { width?: number; open?: number; night?: number; jolt?: number }) {
  const h = (width * SD.h) / SD.w;
  const o = clamp01(open);
  const n = clamp01(night);
  const j = clamp01(jolt);
  const knock = j > 0 && j < 1 ? Math.sin(j * Math.PI * 2) * 0.06 * (1 - j) : 0;
  const leaf = Math.max(0.12, 1 - 0.78 * o + knock);
  const flash = j > 0 && j < 1 ? (1 - j) * 0.5 : 0;
  const lx = FRAME.x + FRAME.w * leaf;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${SD.w} ${SD.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* façade */}
      <rect x={0} y={0} width={SD.w} height={GROUND} rx={18} fill={C.ink800} stroke={alpha(C.muted, 0.3)} strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <line key={k} x1={0} y1={40 + k * 70} x2={SD.w} y2={40 + k * 70} stroke={alpha(C.muted, 0.1)} strokeWidth={2} />
      ))}
      {/* night: the façade darkens, a moon */}
      {n > 0.02 ? (
        <g opacity={n}>
          <rect x={0} y={0} width={SD.w} height={GROUND} rx={18} fill={alpha('#020617', 0.35)} />
          <circle cx={70} cy={60} r={22} fill={alpha('#e2e8f0', 0.85)} />
          <circle cx={80} cy={54} r={20} fill={C.ink800} />
        </g>
      ) : null}
      {/* the hall behind the door */}
      <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} fill={alpha(C.amber, 0.08 + 0.3 * o * (0.5 + 0.5 * n) + 0.6 * flash)} />
      {o > 0.02 ? (
        <path d={`M ${FRAME.x + 20} ${FRAME.y + FRAME.h} L ${FRAME.x + FRAME.w - 10} ${FRAME.y + FRAME.h} L ${FRAME.x + FRAME.w + 90} ${SD.h - 4} L ${FRAME.x - 70} ${SD.h - 4} Z`} fill={alpha(C.amber, 0.28 * o * (0.4 + 0.6 * n))} />
      ) : null}
      {/* frame */}
      <rect x={FRAME.x - 18} y={FRAME.y - 18} width={FRAME.w + 36} height={FRAME.h + 18} rx={8} fill="none" stroke="#6b5040" strokeWidth={14} />
      {/* the leaf */}
      <path d={`M ${FRAME.x} ${FRAME.y} L ${lx} ${FRAME.y + 20 * (1 - leaf)} L ${lx} ${FRAME.y + FRAME.h - 20 * (1 - leaf)} L ${FRAME.x} ${FRAME.y + FRAME.h} Z`} fill="#4a3424" stroke={alpha(j > 0 && j < 1 ? C.amber : '#8a6440', 1)} strokeWidth={4} strokeLinejoin="round" />
      {[0, 1].map((k) => (
        <rect key={k} x={FRAME.x + 24 * leaf} y={FRAME.y + 34 + k * 170} width={(FRAME.w - 48) * leaf} height={140} rx={6} fill="none" stroke={alpha('#8a6440', 0.8)} strokeWidth={3} />
      ))}
      <rect x={FRAME.x + FRAME.w * leaf - 30 * leaf} y={FRAME.y + 176} width={Math.max(6, 12 * leaf)} height={56} rx={5} fill="#d6a35c" />
      {/* wall lamp */}
      <rect x={FRAME.x + FRAME.w + 50} y={FRAME.y + 10} width={34} height={48} rx={8} fill={alpha(C.amber, 0.25 + 0.6 * n)} stroke={alpha(C.amber, 0.7)} strokeWidth={3} />
      {n > 0.02 ? <circle cx={FRAME.x + FRAME.w + 67} cy={FRAME.y + 34} r={60} fill={alpha(C.amber, 0.12 * n)} /> : null}
      {/* step and pavement */}
      <rect x={FRAME.x - 40} y={GROUND - 20} width={FRAME.w + 80} height={20} fill={C.ink700} />
      <rect x={0} y={GROUND} width={SD.w} height={SD.h - GROUND} rx={8} fill={alpha(C.muted, 0.2)} />
    </svg>
  );
}
