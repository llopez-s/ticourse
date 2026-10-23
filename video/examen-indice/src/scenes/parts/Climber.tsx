import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/** Drawing space of the climber, in px (1:1 with the stage when not scaled). */
export const CLIMBER = { w: 860, h: 560 } as const;

/** How far the climber rises over a full climb (0 → 1), in px. */
export const CLIMB_PX = 70;

/** Where the rope leaves the backpack at a given climb. */
export function ropeStart(climb: number) {
  return { x: 486, y: 322 - CLIMB_PX * climb };
}

const ANCHOR = { x: 112, y: 524 } as const;

/** Point on the rope (quadratic curve, t from backpack 0 to anchor 1) and its tangent angle in degrees. */
export function ropePoint(t: number, climb: number) {
  const p0 = ropeStart(climb);
  const p1 = { x: 330, y: 470 };
  const p2 = ANCHOR;
  const u = 1 - t;
  const x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
  const y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
  const dx = 2 * u * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * u * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/**
 * The climber image of the video (s02 `rope`, s10 `rope-2`): a stick-figure climber on a rock
 * wall with a backpack marked «ÍNDICE» and a climbing rope tied to it, running slack down to an
 * anchor on the ledge. The rope is for the slips; the climber still climbs. `climb` (0–1) lifts
 * the climber (and the rope's top end); `rope` (0–1) draws the rope; `glow` lights the rope.
 * `children` are placed in the same 860×560 space (tags, a falling card, a thought bubble).
 */
export function Climber({
  climb = 0,
  rope = 1,
  glow = 0,
  children,
  style,
}: {
  climb?: number;
  rope?: number;
  glow?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const up = -CLIMB_PX * climb;
  const s = ropeStart(climb);
  const ropeD = `M${s.x} ${s.y} Q330 470 ${ANCHOR.x} ${ANCHOR.y}`;
  const holds: [number, number][] = [
    [640, 96],
    [690, 220],
    [610, 300],
    [740, 360],
    [650, 470],
    [560, 520],
    [770, 150],
  ];
  return (
    <div style={{ position: 'relative', width: CLIMBER.w, height: CLIMBER.h, fontFamily: FONT.sans, ...style }}>
      <svg width={CLIMBER.w} height={CLIMBER.h} viewBox={`0 0 ${CLIMBER.w} ${CLIMBER.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        <defs>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.ink700} />
            <stop offset="1" stopColor={C.ink850} />
          </linearGradient>
        </defs>
        {/* the wall and the ledge */}
        <path d="M456 0 L860 0 L860 560 L380 560 L430 430 L408 300 L452 170 Z" fill="url(#wallGrad)" stroke={C.ink600} strokeWidth={3} strokeLinejoin="round" />
        <path d="M520 40 L560 120 M700 60 L690 140 M740 260 L690 300 M520 380 L560 440" stroke={alpha(C.ink500, 0.5)} strokeWidth={3} strokeLinecap="round" />
        <rect x={0} y={526} width={400} height={34} rx={8} fill={C.ink800} stroke={C.ink600} strokeWidth={3} />
        {holds.map(([x, y]) => (
          <ellipse key={`${x}${y}`} cx={x} cy={y} rx={18} ry={11} fill={alpha(C.amber, 0.55)} stroke={alpha(C.amber, 0.9)} strokeWidth={2} />
        ))}

        {/* the rope: a core and a twisted overlay, drawn on */}
        {rope > 0.01 ? (
          <g style={{ filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(14 * glow)}px ${alpha(C.emerald, 0.8)})` : undefined }}>
            <path d={ropeD} stroke={glow > 0.4 ? C.emerald : C.cyanSoft} strokeWidth={11} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, rope)} />
            <path d={ropeD} stroke={C.ink900} strokeWidth={11} fill="none" strokeLinecap="butt" strokeDasharray="3 15" opacity={0.55 * Math.min(1, rope)} />
            <circle cx={ANCHOR.x} cy={ANCHOR.y} r={15} fill={C.ink900} stroke={glow > 0.4 ? C.emerald : C.cyanSoft} strokeWidth={6} opacity={Math.min(1, rope * 2)} />
          </g>
        ) : null}

        {/* the climber */}
        <g transform={`translate(0 ${up})`}>
          <rect x={462} y={196} width={112} height={150} rx={22} fill={C.cyanDeep} stroke={C.cyan} strokeWidth={4} />
          <rect x={474} y={300} width={88} height={34} rx={10} fill={alpha(C.ink950, 0.45)} />
          <g stroke={C.text} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M592 216 L572 334" />
            <path d="M594 224 L636 176 L666 112" />
            <path d="M590 226 L566 168 L600 98" />
            <path d="M572 334 L616 398 L596 462" />
            <path d="M572 334 L534 396 L566 448" />
          </g>
          <circle cx={604} cy={176} r={27} fill={C.text} />
          <path d="M582 166 A26 26 0 0 1 628 164 Z" fill={C.cyan} />
        </g>
      </svg>
      {/* the backpack label stays upright, riding with the climber */}
      <div style={{ position: 'absolute', left: 462, top: 232 + up, width: 112, textAlign: 'center', fontSize: 26, fontWeight: 850, letterSpacing: 0.5, color: C.textStrong }}>ÍNDICE</div>
      {children}
    </div>
  );
}
