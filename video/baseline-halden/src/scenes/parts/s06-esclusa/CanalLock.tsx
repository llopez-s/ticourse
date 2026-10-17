import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * The system that moves the port's locks, drawn as what it moves: a canal lock in side view — the upper reach on the
 * left, the lower on the right, two mitre gates and the chamber between them with a ship inside, half-way. No
 * equipment, no hostname and NO network line of any kind (contradicción 13). `ship` 0–1 floats the ship in; `still`
 * 0–1 dims the water's shimmer (the lock frozen: nothing restarts it now).
 */
export const LOCK_W = 780;
export const LOCK_H = 300;

const GROUND = 250;
const CHAMBER = { x: 230, w: 330 } as const;
const UPPER = 120;
const LOWER = 190;
const INSIDE = 150;

export function CanalLock({ width = LOCK_W, ship = 1, frame = 0, still = 0 }: { width?: number; ship?: number; frame?: number; still?: number }) {
  const s = clamp01(ship);
  const shimmer = (1 - clamp01(still)) * Math.sin(frame / 14);
  const bob = (1 - clamp01(still)) * Math.sin(frame / 20) * 2;
  const shipX = CHAMBER.x + 50 + (1 - s) * -60;
  return (
    <svg width={width} height={(width * LOCK_H) / LOCK_W} viewBox={`0 0 ${LOCK_W} ${LOCK_H}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="lock-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f5f8f" />
          <stop offset="100%" stopColor="#0f2f50" />
        </linearGradient>
      </defs>
      {/* ground and channel bed */}
      <rect x={0} y={GROUND} width={LOCK_W} height={LOCK_H - GROUND} fill={C.ink800} />
      {/* water: upper reach, chamber, lower reach */}
      <rect x={0} y={UPPER} width={CHAMBER.x - 14} height={GROUND - UPPER} fill="url(#lock-water)" />
      <rect x={CHAMBER.x} y={INSIDE} width={CHAMBER.w} height={GROUND - INSIDE} fill="url(#lock-water)" />
      <rect x={CHAMBER.x + CHAMBER.w + 14} y={LOWER} width={LOCK_W - CHAMBER.x - CHAMBER.w - 14} height={GROUND - LOWER} fill="url(#lock-water)" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${20 + i * 64} ${UPPER + 18 + i * 6} q 14 ${-4 + shimmer * 2} 28 0`}
          fill="none"
          stroke={alpha(C.sky, 0.45)}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${CHAMBER.x + CHAMBER.w + 40 + i * 60} ${LOWER + 16 + i * 5} q 14 ${-4 + shimmer * 2} 28 0`} fill="none" stroke={alpha(C.sky, 0.45)} strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* the chamber walls (concrete) */}
      <rect x={CHAMBER.x - 14} y={70} width={14} height={GROUND - 70} fill={C.ink700} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
      <rect x={CHAMBER.x + CHAMBER.w} y={70} width={14} height={GROUND - 70} fill={C.ink700} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
      {/* the quays either side */}
      <rect x={0} y={70} width={CHAMBER.x - 14} height={14} fill={C.ink700} />
      <rect x={CHAMBER.x + CHAMBER.w + 14} y={70} width={LOCK_W - CHAMBER.x - CHAMBER.w - 14} height={14} fill={C.ink700} />
      {/* the two gates: timber leaves with a walkway rail and a balance beam */}
      {[CHAMBER.x - 14, CHAMBER.x + CHAMBER.w].map((gx, i) => (
        <g key={i}>
          <rect x={gx - 6} y={64} width={26} height={GROUND - 64} rx={3} fill={C.ink850} stroke={C.cyan} strokeWidth={3.5} />
          {[0, 1, 2, 3].map((k) => (
            <line key={k} x1={gx - 6} y1={100 + k * 36} x2={gx + 20} y2={100 + k * 36} stroke={alpha(C.cyan, 0.45)} strokeWidth={2} />
          ))}
          <line x1={i === 0 ? gx - 70 : gx + 20} y1={58} x2={i === 0 ? gx + 20 : gx + 90} y2={58} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
        </g>
      ))}
      {/* the ship in the chamber */}
      <g opacity={s} transform={`translate(${shipX} ${INSIDE - 46 + bob})`}>
        <path d="M 0 40 L 230 40 L 206 76 L 22 76 Z" fill={C.ink800} stroke={C.cyan} strokeWidth={3.5} strokeLinejoin="round" />
        <rect x={130} y={8} width={64} height={32} rx={3} fill={C.ink850} stroke={C.cyan} strokeWidth={3} />
        {[0, 1, 2].map((k) => (
          <rect key={k} x={138 + k * 18} y={16} width={10} height={9} rx={2} fill={alpha(C.cyan, 0.45)} />
        ))}
        <rect x={150} y={-12} width={10} height={20} fill={alpha(C.text, 0.55)} />
        <rect x={30} y={18} width={84} height={22} rx={3} fill={alpha(C.amber, 0.25)} stroke={alpha(C.amber, 0.6)} strokeWidth={2.5} />
      </g>
    </svg>
  );
}
