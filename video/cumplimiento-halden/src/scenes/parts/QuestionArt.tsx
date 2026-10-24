import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The three still, generic, textless backgrounds of the question scenes (stage size 1728×660). Nothing is named and
 * nothing is legible: an application screen with a calendar page turning (s03), a notice board of tenders with a
 * prohibition stamp (s05) and a pile of folders that keeps growing (s07). All three sit low and soft so the engine's
 * panel reads on top.
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
      {children}
    </svg>
  );
}

/** s03: an application window with a side menu and a calendar page whose corner turns (no names, no numbers, no text). */
export function CalendarScreenArt() {
  const X = 340;
  const Y = 60;
  const GX = 760;
  const GY = 190;
  return (
    <Ground>
      <rect x={X} y={Y} width={1048} height={520} rx={26} fill={C.ink900} stroke={line(0.6)} strokeWidth={4} />
      <path d={`M${X} ${Y + 26} a26 26 0 0 1 26 -26 H${X + 1048 - 26} a26 26 0 0 1 26 26 V${Y + 70} H${X} Z`} fill={alpha(C.cyan, 0.1)} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={X + 40 + i * 28} cy={Y + 34} r={7} fill={alpha(C.cyan, 0.6 - i * 0.15)} />
      ))}
      <rect x={X + 200} y={Y + 24} width={260} height={20} rx={10} fill={alpha(C.cyan, 0.3)} />
      {/* side menu */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={X + 34} y={Y + 110 + i * 70} width={250} height={44} rx={12} fill={alpha(C.sky, i === 1 ? 0.18 : 0.07)} stroke={line(i === 1 ? 0.6 : 0.25)} strokeWidth={2.5} />
      ))}
      {/* the calendar page: a header bar and a month grid of empty cells */}
      <rect x={GX - 40} y={GY - 56} width={520} height={30} rx={8} fill={alpha(C.amber, 0.12)} stroke={alpha(C.amber, 0.4)} strokeWidth={2.5} />
      <path d={`M${GX - 40} ${GY - 10} H${GX + 480}`} stroke={line(0.3)} strokeWidth={2.5} />
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 7 }).map((__, c) => (
          <rect key={`${r}-${c}`} x={GX - 40 + c * 75} y={GY + r * 70} width={66} height={60} rx={8} fill={alpha(C.sky, 0.05)} stroke={line(0.28)} strokeWidth={2.5} />
        )),
      )}
      {/* the corner of the page turns */}
      <path d={`M${GX + 480} ${GY - 56} V${GY + 90} L${GX + 380} ${GY - 56} Z`} fill={alpha(C.amber, 0.14)} stroke={alpha(C.amber, 0.7)} strokeWidth={3.5} strokeLinejoin="round" />
      <path d={`M${GX + 380} ${GY - 56} L${GX + 480} ${GY + 90}`} stroke={alpha(C.amber, 0.85)} strokeWidth={3.5} strokeLinecap="round" />
      <path d={`M${GX + 430} ${GY + 40} q30 40 50 50`} stroke={alpha(C.amber, 0.4)} strokeWidth={3} strokeLinecap="round" fill="none" />
    </Ground>
  );
}

/** s05: a notice board of public tenders with a big prohibition stamp over it (no company, no name, no text). */
export function TenderBoardArt() {
  const sheets = [
    { x: 330, y: 120, r: -3 },
    { x: 640, y: 150, r: 2 },
    { x: 950, y: 110, r: -2 },
    { x: 1260, y: 140, r: 3 },
    { x: 480, y: 340, r: 2 },
    { x: 800, y: 360, r: -3 },
    { x: 1120, y: 340, r: 2 },
  ];
  return (
    <Ground>
      <rect x={250} y={50} width={1228} height={540} rx={20} fill={C.ink900} stroke={line(0.6)} strokeWidth={5} />
      {sheets.map((s, i) => (
        <g key={i} transform={`rotate(${s.r} ${s.x + 100} ${s.y + 100})`}>
          <rect x={s.x} y={s.y} width={200} height={220} rx={8} fill={alpha(C.sky, 0.07)} stroke={line(0.5)} strokeWidth={3} />
          <circle cx={s.x + 100} cy={s.y + 12} r={7} fill={alpha(C.amber, 0.7)} />
          {[0, 1, 2, 3, 4].map((k) => (
            <rect key={k} x={s.x + 24} y={s.y + 44 + k * 28} width={k % 2 ? 120 : 150} height={10} rx={5} fill={alpha(C.muted, 0.28)} />
          ))}
          <circle cx={s.x + 160} cy={s.y + 190} r={14} stroke={alpha(C.cyan, 0.5)} strokeWidth={3} fill="none" />
        </g>
      ))}
      {/* the prohibition stamp */}
      <g transform="rotate(-10 864 330)">
        <circle cx={864} cy={330} r={190} fill={alpha(C.rose, 0.07)} stroke={alpha(C.rose, 0.7)} strokeWidth={22} />
        <path d="M730 196 L998 464" stroke={alpha(C.rose, 0.7)} strokeWidth={22} strokeLinecap="round" />
      </g>
    </Ground>
  );
}

/** s07: a pile of folders that keeps growing — seven stacks, each one folder taller than the last. */
export function FoldersArt() {
  const base = 590;
  return (
    <Ground>
      <path d={`M120 ${base + 8} H${W - 120}`} stroke={line(0.4)} strokeWidth={4} strokeLinecap="round" />
      {Array.from({ length: 7 }).map((_, s) => {
        const x = 200 + s * 200;
        return (
          <g key={s}>
            {Array.from({ length: s + 1 }).map((__, k) => {
              const y = base - (k + 1) * 62;
              const tone = (s + k) % 3 === 1 ? C.amber : C.sky;
              return (
                <g key={k} transform={`translate(${(k % 2) * 8 - 4} 0)`}>
                  <path d={`M${x} ${y + 56} V${y + 12} a8 8 0 0 1 8 -8 H${x + 50} l12 12 H${x + 150} a8 8 0 0 1 8 8 V${y + 56} Z`} fill={alpha(tone, 0.1)} stroke={alpha(tone, 0.55)} strokeWidth={3} strokeLinejoin="round" />
                </g>
              );
            })}
          </g>
        );
      })}
    </Ground>
  );
}
