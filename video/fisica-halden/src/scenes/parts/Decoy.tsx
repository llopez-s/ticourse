import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import type { DecoyKind } from '../../data/canon';

/**
 * The four decoys (s06, s07 dim, s08 icon), each a different shape and all with the same marks: a **dashed** cyan
 * outline (it is fake) and, with `alarm`, an amber bell (any touch warns). Nothing is ever touched or caught here.
 * - honeypot: one server on its own, with no one connected.
 * - honeynet: three servers that talk to each other.
 * - honeyfile: a document with a tempting sparkle and no readable name.
 * - honeytoken: a record card (account, key, row) that does not exist.
 */
export const DECOY = { w: 200, h: 160 } as const;

function Server({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-34} y={-40} width={68} height={80} rx={8} fill={C.ink800} stroke={C.cyan} strokeWidth={3} />
      {[-22, 0, 22].map((dy) => (
        <g key={dy}>
          <line x1={-22} y1={dy} x2={10} y2={dy} stroke={alpha(C.cyan, 0.6)} strokeWidth={4} strokeLinecap="round" />
          <circle cx={21} cy={dy} r={3.5} fill={C.cyan} />
        </g>
      ))}
    </g>
  );
}

function Bell({ x, y, a }: { x: number; y: number; a: number }) {
  if (a <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * a})`} opacity={a}>
      <circle r={20} fill={alpha(C.amber, 0.2)} stroke={C.amber} strokeWidth={3} />
      <path d="M -9 6 L -9 -2 Q -9 -11 0 -11 Q 9 -11 9 -2 L 9 6 L 12 9 L -12 9 Z" fill={C.amber} />
      <circle cx={0} cy={12} r={3} fill={C.amber} />
    </g>
  );
}

export function Decoy({ kind, width, on = 1, alarm = 0 }: { kind: DecoyKind; width: number; on?: number; alarm?: number }) {
  const o = clamp01(on);
  const height = (width * DECOY.h) / DECOY.w;
  let art: ReactNode;
  if (kind === 'honeypot') {
    art = (
      <>
        <circle cx={100} cy={82} r={62} fill="none" stroke={alpha(C.cyan, 0.35)} strokeWidth={3} strokeDasharray="7 7" />
        <Server x={100} y={82} />
      </>
    );
  } else if (kind === 'honeynet') {
    art = (
      <>
        <g stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeDasharray="7 5">
          <line x1={52} y1={104} x2={148} y2={104} />
          <line x1={52} y1={104} x2={100} y2={46} />
          <line x1={148} y1={104} x2={100} y2={46} />
        </g>
        <Server x={100} y={46} s={0.55} />
        <Server x={52} y={110} s={0.55} />
        <Server x={148} y={110} s={0.55} />
      </>
    );
  } else if (kind === 'honeyfile') {
    art = (
      <>
        <path d="M 66 22 L 122 22 L 144 44 L 144 140 L 66 140 Z" fill={C.ink800} stroke={C.cyan} strokeWidth={3} />
        <path d="M 122 22 L 122 44 L 144 44" fill="none" stroke={C.cyan} strokeWidth={3} />
        {[66, 84, 102, 120].map((y, k) => (
          <line key={y} x1={78} y1={y} x2={k % 2 ? 118 : 132} y2={y} stroke={alpha(C.text, 0.4)} strokeWidth={5} strokeLinecap="round" />
        ))}
        {/* the tempting sparkle */}
        <path d="M 158 30 l 5 13 l 13 5 l -13 5 l -5 13 l -5 -13 l -13 -5 l 13 -5 Z" fill={C.cyanSoft} />
      </>
    );
  } else {
    art = (
      <>
        <rect x={34} y={36} width={132} height={92} rx={12} fill={C.ink800} stroke={C.cyan} strokeWidth={3} />
        {/* a key glyph */}
        <circle cx={62} cy={66} r={12} fill="none" stroke={C.cyan} strokeWidth={4} />
        <path d="M 74 66 L 96 66 M 88 66 L 88 76 M 96 66 L 96 74" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
        <line x1={50} y1={100} x2={150} y2={100} stroke={alpha(C.text, 0.4)} strokeWidth={5} strokeLinecap="round" />
        <line x1={110} y1={66} x2={150} y2={66} stroke={alpha(C.text, 0.4)} strokeWidth={5} strokeLinecap="round" />
        <line x1={50} y1={116} x2={120} y2={116} stroke={alpha(C.text, 0.25)} strokeWidth={5} strokeLinecap="round" />
      </>
    );
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${DECOY.w} ${DECOY.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* the shared mark: fake = dashed frame */}
      <rect x={4} y={4} width={DECOY.w - 8} height={DECOY.h - 8} rx={18} fill={alpha(C.cyan, 0.04 * o)} stroke={alpha(C.cyan, 0.5)} strokeWidth={3} strokeDasharray="10 8" />
      <g opacity={0.4 + 0.6 * o}>{art}</g>
      <Bell x={DECOY.w - 22} y={DECOY.h - 22} a={clamp01(alarm)} />
    </svg>
  );
}
