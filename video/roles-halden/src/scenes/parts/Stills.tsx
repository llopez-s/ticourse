import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The three still, generic, textless backgrounds of the question scenes (stage size 1728×660): a clinic's front desk
 * (s03), a server room (s05) and a boardroom seen from above (s07). Nothing is named and nothing is legible; all three
 * sit low and soft so the engine's panel reads on top.
 */

const W = 1728;
const H = 660;
const line = (a = 0.5) => alpha(C.sky, a);

function Ground({ children }: { children: ReactNode }) {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <radialGradient id="still-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor={C.sky} stopOpacity={0.1} />
          <stop offset="100%" stopColor={C.sky} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
      <rect x={0} y={20} width={W} height={H - 40} rx={18} fill="url(#still-glow)" />
      {children}
    </svg>
  );
}

/** s03: a clinic's front desk, an appointment board of empty slots and a row of waiting chairs. */
export function ClinicStill() {
  return (
    <Ground>
      <path d="M60 600 H1668" stroke={line(0.4)} strokeWidth={3} strokeLinecap="round" />
      {/* appointment board: a grid with a few filled slots, no text */}
      <rect x={140} y={90} width={560} height={300} rx={14} fill={alpha(C.sky, 0.04)} stroke={line(0.5)} strokeWidth={3.5} />
      {[0, 1, 2, 3, 4].map((c) => (
        <path key={`c${c}`} d={`M${140 + (c + 1) * 93} 90 V390`} stroke={line(0.2)} strokeWidth={2.5} />
      ))}
      {[0, 1, 2, 3].map((r) => (
        <path key={`r${r}`} d={`M140 ${90 + (r + 1) * 60} H700`} stroke={line(0.2)} strokeWidth={2.5} />
      ))}
      {[
        [0, 0, 1],
        [1, 1, 2],
        [3, 0, 1],
        [2, 2, 1],
        [4, 3, 1],
        [0, 3, 2],
      ].map(([c, r, n], i) => (
        <rect key={i} x={148 + c * 93} y={98 + r * 60} width={n * 93 - 16} height={44} rx={8} fill={alpha(i % 3 === 1 ? C.amber : C.cyan, 0.18)} stroke={alpha(i % 3 === 1 ? C.amber : C.cyan, 0.5)} strokeWidth={2.5} />
      ))}
      {/* desk */}
      <path d="M120 600 V470 H720 V600" fill={alpha(C.sky, 0.05)} stroke={line(0.55)} strokeWidth={4} strokeLinejoin="round" />
      <path d="M100 470 H740" stroke={line(0.6)} strokeWidth={5} strokeLinecap="round" />
      <rect x={440} y={396} width={120} height={74} rx={8} fill={alpha(C.cyan, 0.08)} stroke={alpha(C.cyan, 0.5)} strokeWidth={3} />
      <path d="M500 470 V484" stroke={line(0.5)} strokeWidth={3} />
      {/* waiting chairs */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${940 + i * 150} 0)`}>
          <rect x={0} y={420} width={110} height={26} rx={8} fill={alpha(C.sky, 0.08)} stroke={line(0.5)} strokeWidth={3.5} />
          <rect x={6} y={350} width={98} height={68} rx={12} fill={alpha(C.sky, 0.05)} stroke={line(0.45)} strokeWidth={3.5} />
          <path d="M20 446 V600 M90 446 V600" stroke={line(0.45)} strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
      {/* a wall cross and a plant */}
      <path d="M1380 120 h50 v50 h50 v50 h-50 v50 h-50 v-50 h-50 v-50 h50 Z" fill={alpha(C.emerald, 0.08)} stroke={alpha(C.emerald, 0.45)} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M1600 600 V520 M1600 540 q-40 -30 -44 -70 q40 10 44 70 M1600 530 q40 -30 44 -70 q-40 10 -44 70" fill="none" stroke={alpha(C.emerald, 0.5)} strokeWidth={3.5} strokeLinecap="round" />
    </Ground>
  );
}

/** s05: a server room — five racks with unit lines and LEDs, a cable tray on top and floor tiles. */
export function ServerRoomStill() {
  return (
    <Ground>
      <path d="M120 150 H1608" stroke={line(0.3)} strokeWidth={5} strokeLinecap="round" strokeDasharray="30 14" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 170 + i * 300;
        return (
          <g key={i}>
            <path d={`M${x + 100} 150 V190`} stroke={line(0.3)} strokeWidth={4} />
            <rect x={x} y={190} width={200} height={400} rx={12} fill={alpha(C.sky, 0.05)} stroke={line(0.55)} strokeWidth={4} />
            {Array.from({ length: 8 }).map((_, r) => (
              <g key={r}>
                <rect x={x + 14} y={206 + r * 46} width={172} height={34} rx={5} fill="none" stroke={line(0.28)} strokeWidth={2.5} />
                <circle cx={x + 34} cy={223 + r * 46} r={5} fill={(r + i) % 5 === 2 ? C.amber : (r * 3 + i) % 4 === 0 ? C.cyan : alpha(C.muted, 0.5)} opacity={0.8} />
                <path d={`M${x + 56} ${223 + r * 46} H${x + 150}`} stroke={line(0.2)} strokeWidth={2.5} />
              </g>
            ))}
          </g>
        );
      })}
      <path d="M60 604 H1668" stroke={line(0.4)} strokeWidth={3} strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <path key={i} d={`M${120 + i * 200} 604 L${60 + i * 220} 640`} stroke={line(0.18)} strokeWidth={2.5} />
      ))}
    </Ground>
  );
}

/** s07: a boardroom from above — an oval table, twelve chairs, a blank screen on the end wall. */
export function BoardRoomStill() {
  const top = [0, 1, 2, 3, 4, 5];
  return (
    <Ground>
      <rect x={560} y={50} width={608} height={34} rx={8} fill={alpha(C.cyan, 0.07)} stroke={alpha(C.cyan, 0.45)} strokeWidth={3.5} />
      <ellipse cx={864} cy={340} rx={440} ry={136} fill={alpha(C.sky, 0.06)} stroke={line(0.6)} strokeWidth={5} />
      <ellipse cx={864} cy={340} rx={380} ry={88} fill="none" stroke={line(0.2)} strokeWidth={2.5} />
      {top.map((i) => {
        const x = 520 + i * 137;
        return (
          <g key={i}>
            <rect x={x - 38} y={168} width={76} height={50} rx={14} fill={alpha(C.sky, 0.07)} stroke={line(0.5)} strokeWidth={3.5} />
            <rect x={x - 38} y={462} width={76} height={50} rx={14} fill={alpha(C.sky, 0.07)} stroke={line(0.5)} strokeWidth={3.5} />
          </g>
        );
      })}
      <rect x={364} y={304} width={50} height={72} rx={14} fill={alpha(C.sky, 0.07)} stroke={line(0.5)} strokeWidth={3.5} />
      <rect x={1314} y={304} width={50} height={72} rx={14} fill={alpha(C.sky, 0.07)} stroke={line(0.5)} strokeWidth={3.5} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={700 + i * 120} y={318} width={80} height={46} rx={6} fill={alpha(C.amber, 0.08)} stroke={alpha(C.amber, 0.35)} strokeWidth={2.5} />
      ))}
      <path d="M60 604 H1668" stroke={line(0.4)} strokeWidth={3} strokeLinecap="round" />
    </Ground>
  );
}
