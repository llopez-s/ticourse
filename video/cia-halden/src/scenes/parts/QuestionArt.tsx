import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The three still, generic, textless backgrounds of the question scenes (stage size 1728×660). Nothing is named and
 * nothing is legible: a farm cooperative's silos and sacks (s03), a notary's desk with stacked deeds (s05) and a
 * residence's front with its garden (s07). All three sit low and soft so the engine's panel reads on top.
 */

const W = 1728;
const H = 660;
const line = (a = 0.5) => alpha(C.sky, a);

function Ground({ children }: { children: ReactNode }) {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <radialGradient id="qa-glow" cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor={C.sky} stopOpacity={0.1} />
          <stop offset="100%" stopColor={C.sky} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#qa-glow)" />
      <path d={`M60 600 H${W - 60}`} stroke={line(0.4)} strokeWidth={3} strokeLinecap="round" />
      {children}
    </svg>
  );
}

/** s03: a cooperative — three silos, a shed and a row of sacks on a platform scale. */
export function CooperativeArt() {
  return (
    <Ground>
      {[0, 1, 2].map((i) => {
        const x = 280 + i * 170;
        return (
          <g key={i}>
            <path d={`M${x} 600 V300 Q${x + 65} 230 ${x + 130} 300 V600`} fill={alpha(C.sky, 0.06)} stroke={line(0.55)} strokeWidth={3.5} />
            {[360, 440, 520].map((y) => (
              <path key={y} d={`M${x} ${y} H${x + 130}`} stroke={line(0.25)} strokeWidth={2.5} />
            ))}
          </g>
        );
      })}
      <path d="M820 600 V400 L960 330 L1100 400 V600" fill={alpha(C.sky, 0.05)} stroke={line(0.5)} strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={910} y={480} width={100} height={120} rx={6} fill="none" stroke={line(0.4)} strokeWidth={3} />
      {/* platform scale with sacks */}
      <rect x={1180} y={560} width={360} height={26} rx={6} fill={alpha(C.sky, 0.08)} stroke={line(0.5)} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${1200 + i * 82} 560 q-6 -70 34 -80 q40 10 34 80 Z`} fill={alpha(C.amber, 0.08)} stroke={alpha(C.amber, 0.45)} strokeWidth={3} />
      ))}
      <rect x={1560} y={470} width={70} height={90} rx={10} fill={alpha(C.sky, 0.06)} stroke={line(0.5)} strokeWidth={3} />
      <rect x={1574} y={486} width={42} height={24} rx={4} fill={alpha(C.cyan, 0.3)} />
    </Ground>
  );
}

/** s05: a notary's office — a bookcase of deed folders and a desk with one closed folder on it. */
export function NotaryArt() {
  return (
    <Ground>
      {/* bookcase */}
      <rect x={240} y={220} width={560} height={380} rx={10} fill={alpha(C.sky, 0.04)} stroke={line(0.5)} strokeWidth={3.5} />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <path d={`M240 ${340 + r * 120} H800`} stroke={line(0.4)} strokeWidth={3} />
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={262 + i * 58} y={250 + r * 120} width={42} height={86} rx={4} fill={alpha(i % 3 === 1 ? C.amber : C.sky, 0.1)} stroke={alpha(i % 3 === 1 ? C.amber : C.sky, 0.4)} strokeWidth={2.5} />
          ))}
        </g>
      ))}
      {/* desk */}
      <path d="M960 470 H1520 M1000 470 V600 M1480 470 V600" stroke={line(0.55)} strokeWidth={4} strokeLinecap="round" />
      <rect x={1100} y={420} width={220} height={46} rx={6} fill={alpha(C.amber, 0.1)} stroke={alpha(C.amber, 0.5)} strokeWidth={3} />
      <path d="M1128 444 H1290" stroke={alpha(C.amber, 0.35)} strokeWidth={3} />
      <path d="M1390 470 V380 M1360 380 H1420" stroke={line(0.45)} strokeWidth={3.5} strokeLinecap="round" />
    </Ground>
  );
}

/** s07: a residence — a low building with rows of windows, a porch and two trees. */
export function ResidenceArt() {
  return (
    <Ground>
      <rect x={420} y={300} width={880} height={300} rx={8} fill={alpha(C.sky, 0.05)} stroke={line(0.55)} strokeWidth={3.5} />
      <path d="M400 300 L860 210 L1320 300" fill="none" stroke={line(0.5)} strokeWidth={3.5} strokeLinejoin="round" />
      {[0, 1].map((r) =>
        Array.from({ length: 8 }).map((_, i) =>
          i === 3 || i === 4 ? null : (
            <rect key={`${r}-${i}`} x={470 + i * 102} y={340 + r * 110} width={56} height={64} rx={6} fill={alpha(r + i === 3 ? C.amber : C.sky, 0.12)} stroke={line(0.4)} strokeWidth={2.5} />
          ),
        ),
      )}
      <path d="M800 600 V470 H920 V600" fill={alpha(C.sky, 0.06)} stroke={line(0.5)} strokeWidth={3} />
      <path d="M770 470 L860 430 L950 470" fill="none" stroke={line(0.5)} strokeWidth={3} strokeLinejoin="round" />
      {[230, 1500].map((x) => (
        <g key={x}>
          <path d={`M${x} 600 V500`} stroke={alpha(C.emerald, 0.5)} strokeWidth={5} strokeLinecap="round" />
          <circle cx={x} cy={450} r={70} fill={alpha(C.emerald, 0.08)} stroke={alpha(C.emerald, 0.45)} strokeWidth={3} />
        </g>
      ))}
    </Ground>
  );
}
