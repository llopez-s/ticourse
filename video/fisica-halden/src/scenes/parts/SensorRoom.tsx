import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import type { SensorKind } from '../../data/canon';

/**
 * One of the four small rooms of s04 (also s05's back line, s08's icon), drawn in the floor plan's style: walls in sky,
 * the sensor as a small cyan box, what it detects in cyan and **its weak point in amber, always visible**:
 * - infrared: a person with a heat halo; sun through a window and a radiator (amber).
 * - pressure: a mat with a footprint; steps beside the mat, outside it (amber).
 * - microwave: radio rings that cross a thin partition into the next room, where someone moves (amber).
 * - ultrasonic: sound rings that bounce inside a closed room; an air vent blowing (amber).
 * «Sensor» here is always motion, heat or weight — never a network sensor. `t` drives the rings (a frame count).
 */
export const ROOM = { w: 400, h: 280 } as const;

const WALL = alpha(C.sky, 0.85);

function Figure({ x, y, tone, s = 1 }: { x: number; y: number; tone: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse rx={20} ry={12} fill={alpha(tone, 0.3)} stroke={tone} strokeWidth={3} />
      <circle r={9} fill={tone} />
    </g>
  );
}

function SensorBox({ x, y, on }: { x: number; y: number; on: number }) {
  return (
    <g>
      <rect x={x - 13} y={y - 13} width={26} height={26} rx={6} fill={C.ink800} stroke={C.cyan} strokeWidth={3} />
      <circle cx={x} cy={y} r={5} fill={C.cyan} opacity={0.4 + 0.6 * on} />
    </g>
  );
}

/** Rings from (cx, cy), expanding and looping with t; clipped by the caller. */
function Rings({ cx, cy, t, tone, max, n = 3, speed = 1.4, width = 3 }: { cx: number; cy: number; t: number; tone: string; max: number; n?: number; speed?: number; width?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const r = ((t * speed + (i * max) / n) % max) + 10;
        const o = 1 - r / (max + 10);
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={alpha(tone, 0.8 * o)} strokeWidth={width} />;
      })}
    </>
  );
}

export function SensorRoom({
  kind,
  width,
  on = 1,
  weak = 1,
  t = 0,
  idSuffix = '',
}: {
  kind: SensorKind;
  width: number;
  on?: number;
  weak?: number;
  t?: number;
  idSuffix?: string;
}) {
  const o = clamp01(on);
  const w = clamp01(weak);
  const id = `room-${kind}${idSuffix}`;
  const height = (width * ROOM.h) / ROOM.w;
  let body: ReactNode = null;

  if (kind === 'infrared') {
    body = (
      <>
        {/* sun through the window (top wall) */}
        <polygon points="250,10 330,10 250,200 140,200" fill={alpha(C.amber, 0.22 * w)} />
        <line x1={250} y1={10} x2={330} y2={10} stroke={C.amber} strokeWidth={8} opacity={0.5 + 0.5 * w} />
        {/* radiator on the left wall */}
        <g opacity={0.4 + 0.6 * w}>
          <rect x={16} y={170} width={22} height={86} rx={4} fill={alpha(C.amber, 0.15)} stroke={C.amber} strokeWidth={3} />
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M ${50 + k * 12} 240 q 6 -10 0 -20 q -6 -10 0 -20`} fill="none" stroke={alpha(C.amber, 0.8)} strokeWidth={2.5} />
          ))}
        </g>
        {/* the person and the heat it gives off */}
        <circle cx={150} cy={130} r={46 + 4 * Math.sin(t / 8)} fill={`url(#${id}-heat)`} />
        <Figure x={150} y={130} tone={C.cyan} />
        {/* the sensor's view cone */}
        <path d="M 30 30 L 200 70 M 30 30 L 120 200" stroke={alpha(C.cyan, 0.45 * o)} strokeWidth={2.5} strokeDasharray="8 7" />
        <SensorBox x={30} y={30} on={o} />
      </>
    );
  } else if (kind === 'pressure') {
    body = (
      <>
        <rect x={130} y={80} width={150} height={120} rx={10} fill={alpha(C.cyan, 0.12 + 0.1 * o)} stroke={C.cyan} strokeWidth={3} />
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={130 + 30 * (k + 1)} y1={84} x2={130 + 30 * (k + 1)} y2={196} stroke={alpha(C.cyan, 0.25)} strokeWidth={2} />
        ))}
        {/* weight on the mat */}
        <g opacity={o}>
          <ellipse cx={190} cy={132} rx={11} ry={20} fill={alpha(C.cyan, 0.8)} />
          <ellipse cx={220} cy={150} rx={11} ry={20} fill={alpha(C.cyan, 0.8)} />
          <circle cx={205} cy={141} r={44} fill="none" stroke={alpha(C.cyan, 0.5)} strokeWidth={3} strokeDasharray="6 6" />
        </g>
        {/* steps beside the mat: not covered */}
        <g opacity={0.35 + 0.65 * w}>
          {[0, 1, 2].map((k) => (
            <ellipse key={k} cx={60 + k * 26} cy={230 - k * 4 - (k % 2) * 16} rx={9} ry={16} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="5 4" />
          ))}
        </g>
        <SensorBox x={205} y={240} on={o} />
        <line x1={205} y1={227} x2={205} y2={200} stroke={alpha(C.cyan, 0.6)} strokeWidth={3} />
      </>
    );
  } else if (kind === 'microwave') {
    body = (
      <>
        {/* the next room behind a thin partition, someone moving there */}
        <rect x={262} y={10} width={128} height={260} fill={alpha(C.amber, 0.05 * w)} />
        <g clipPath={`url(#${id}-in)`}>
          <Rings cx={22} cy={140} t={t} tone={C.cyan} max={340} n={4} speed={2.2} />
        </g>
        <g clipPath={`url(#${id}-out)`} opacity={0.3 + 0.7 * w}>
          <Rings cx={22} cy={140} t={t} tone={C.amber} max={340} n={4} speed={2.2} />
        </g>
        <line x1={262} y1={10} x2={262} y2={270} stroke={WALL} strokeWidth={3} strokeDasharray="10 6" />
        <Figure x={326} y={120 + 40 * Math.sin(t / 14)} tone={C.amber} s={0.9} />
        <SensorBox x={22} y={140} on={o} />
      </>
    );
  } else {
    body = (
      <>
        <g clipPath={`url(#${id}-in)`}>
          <Rings cx={200} cy={24} t={t} tone={C.cyan} max={300} n={4} speed={1.8} />
          <Rings cx={200} cy={520} t={t + 40} tone={C.cyan} max={300} n={2} speed={1.8} width={2} />
        </g>
        {/* air vent and its draught */}
        <g opacity={0.35 + 0.65 * w}>
          <rect x={360} y={150} width={26} height={70} rx={4} fill={alpha(C.amber, 0.15)} stroke={C.amber} strokeWidth={3} />
          {[0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M ${350 - ((t * 1.5 + k * 20) % 60)} ${165 + k * 20} q -18 -10 -36 0 q -18 10 -36 0`}
              fill="none"
              stroke={alpha(C.amber, 0.85)}
              strokeWidth={3}
              strokeLinecap="round"
            />
          ))}
        </g>
        <SensorBox x={200} y={24} on={o} />
      </>
    );
  }

  const closed = kind === 'ultrasonic';
  return (
    <svg width={width} height={height} viewBox={`0 0 ${ROOM.w} ${ROOM.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={`${id}-heat`}>
          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.45 * o} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
        </radialGradient>
        <clipPath id={`${id}-in`}>
          <rect x={10} y={10} width={kind === 'microwave' ? 252 : 380} height={260} />
        </clipPath>
        <clipPath id={`${id}-out`}>
          <rect x={262} y={10} width={128} height={260} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={ROOM.w} height={ROOM.h} rx={14} fill={C.ink900} />
      <g opacity={0.45 + 0.55 * o}>{body}</g>
      {/* walls: a closed room is drawn thicker; the others have a door gap at the bottom */}
      <g stroke={WALL} strokeWidth={closed ? 9 : 6} fill="none" strokeLinecap="round">
        {closed ? (
          <rect x={6} y={6} width={ROOM.w - 12} height={ROOM.h - 12} rx={10} />
        ) : (
          <polyline points={`120,${ROOM.h - 6} 6,${ROOM.h - 6} 6,6 ${ROOM.w - 6},6 ${ROOM.w - 6},${ROOM.h - 6} 180,${ROOM.h - 6}`} />
        )}
      </g>
    </svg>
  );
}
