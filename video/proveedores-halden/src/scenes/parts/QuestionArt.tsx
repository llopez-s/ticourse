import type { ReactNode } from 'react';
import { C, STAGE, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The still, textless backgrounds of the question scenes (the engine's panel covers them, dimmed). Each fills the stage
 * centred. No text, brand or name: bars and shapes only.
 */

const W = 760;
const H = 520;

function Frame({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: (STAGE.width - W) / 2, top: (STAGE.height - H) / 2 }}>
      <svg width={W} height={H} viewBox="0 0 380 260" style={{ overflow: 'visible' }}>
        {children}
      </svg>
    </div>
  );
}

/** s03: a pile of bound reports, spines to the left, rings in the binding, bars on the covers. */
export function ReportStackArt() {
  const report = (y: number, dx: number, rot: number, tone: string, bars: number) => (
    <g transform={`translate(${dx} ${y}) rotate(${rot} 150 30)`}>
      <rect x={40} y={0} width={230} height={56} rx={5} fill={C.ink850} stroke={tone} strokeWidth={4} />
      <rect x={40} y={0} width={22} height={56} rx={5} fill={alpha(tone, 0.22)} stroke={tone} strokeWidth={4} />
      {[10, 28, 46].map((cy) => (
        <circle key={cy} cx={51} cy={cy} r={4} fill={C.ink950} stroke={alpha(tone, 0.9)} strokeWidth={2} />
      ))}
      {Array.from({ length: bars }, (_, i) => (
        <rect key={i} x={84} y={14 + i * 14} width={150 - i * 26} height={6} rx={3} fill={alpha(C.text, 0.4)} />
      ))}
      <rect x={236} y={12} width={22} height={22} rx={11} fill="none" stroke={alpha(tone, 0.8)} strokeWidth={3} />
    </g>
  );
  return (
    <Frame>
      {report(168, 6, -2, C.ink500, 3)}
      {report(118, -4, 1.5, C.sky, 3)}
      {report(68, 10, -1, C.ink500, 2)}
      {report(18, 0, 2, C.cyan, 3)}
    </Frame>
  );
}

/** s05: a pile of contracts held by a binder clip. */
export function ContractPileArt() {
  const sheet = (dx: number, dy: number, rot: number) => (
    <g transform={`translate(${dx} ${dy}) rotate(${rot} 190 130)`}>
      <rect x={110} y={20} width={160} height={210} rx={5} fill={C.ink850} stroke={C.ink500} strokeWidth={4} />
      {[46, 64, 82, 100, 118].map((y, i) => (
        <rect key={y} x={128} y={y} width={124 - (i % 3) * 18} height={6} rx={3} fill={alpha(C.text, 0.3)} />
      ))}
      <path d="M 128 186 q 14 -22 22 -2 t 24 -4 t 28 2" fill="none" stroke={alpha(C.cyan, 0.5)} strokeWidth={3} strokeLinecap="round" />
      <line x1={128} y1={196} x2={252} y2={196} stroke={alpha(C.muted, 0.6)} strokeWidth={3} />
    </g>
  );
  return (
    <Frame>
      {sheet(-12, 10, -5)}
      {sheet(8, 4, 3)}
      {sheet(-2, 0, -1)}
      {/* binder clip */}
      <path d="M 150 22 H 230 V 56 H 150 Z" fill={C.ink700} stroke={C.ink500} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 160 22 V 6 Q 160 -4 170 -4 H 210 Q 220 -4 220 6 V 22" fill="none" stroke={C.muted} strokeWidth={5} strokeLinecap="round" />
      <path d="M 165 56 H 215" stroke={alpha(C.muted, 0.6)} strokeWidth={3} />
    </Frame>
  );
}

/** s07: a summer calendar in outline: a sun, a grid of days and two blocks of dates, one per hospital. */
export function SummerCalendarArt() {
  const cell = 40;
  const x0 = 60;
  const y0 = 62;
  const marks: Record<string, string> = {
    '0,1': C.cyan, '1,1': C.cyan, '2,1': C.cyan, '3,1': C.cyan,
    '4,2': C.sky, '5,2': C.sky, '6,2': C.sky,
    '1,3': C.sky, '2,3': C.sky, '3,3': C.sky,
    '4,4': C.cyan, '5,4': C.cyan,
  };
  return (
    <Frame>
      <rect x={x0 - 10} y={20} width={cell * 7 + 20} height={cell * 5 + 62} rx={12} fill={C.ink850} stroke={C.ink500} strokeWidth={4} />
      <rect x={x0 - 10} y={20} width={cell * 7 + 20} height={34} rx={12} fill={alpha(C.amber, 0.14)} stroke={C.ink500} strokeWidth={4} />
      <circle cx={x0 + 12} cy={37} r={9} fill={alpha(C.amber, 0.9)} />
      <path d="M 90 28 V 20 M 90 54 V 46" stroke={C.ink500} strokeWidth={5} strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 7 }, (_, c) => {
          const m = marks[`${c},${r}`];
          return <rect key={`${c}-${r}`} x={x0 + c * cell + 3} y={y0 + r * cell + 3} width={cell - 6} height={cell - 6} rx={6} fill={m ? alpha(m, 0.35) : 'none'} stroke={m ? alpha(m, 0.9) : alpha(C.ink500, 0.8)} strokeWidth={m ? 3 : 2} />;
        }),
      )}
    </Frame>
  );
}
