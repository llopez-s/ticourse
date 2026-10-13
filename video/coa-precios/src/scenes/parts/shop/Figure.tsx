import { alpha } from '../../../../../engine/src/theme/tokens';
import { INK } from './geom';

export type FigurePose = 'stand' | 'reach' | 'walkie' | 'escort';
export type FigureKind = 'neutral' | 'suspect' | 'guard';

const LOOK: Record<FigureKind, { body: string; head: string; line: string; legs: string }> = {
  neutral: { body: INK.body, head: INK.steel, line: '#0f172a', legs: '#334155' },
  // The suspect is amber (risk), never rose; no mask, no face.
  suspect: { body: '#b7791f', head: INK.amberSoft, line: '#451a03', legs: '#5b3a12' },
  guard: { body: '#52627a', head: INK.steel, line: '#0f172a', legs: '#2b3648' },
};

/**
 * A flat, faceless standing figure: feet on (x, y), `h` tall (≈ 0.42 × h wide). Draws inside the
 * caller's <svg>.
 * - `kind`: 'neutral' (steel), 'suspect' (amber) or 'guard' (steel with an emerald cap and armband).
 * - `pose`: 'stand' · 'reach' (the near arm stretched forward: «en plena faena») · 'walkie' (a walkie
 *   held to the head, amber) · 'escort' (the near arm forward at shoulder height, walking someone out).
 * - `facing`: side of the near arm. `opacity`, `glow` 0–1 (halo in `glowTone`).
 */
export function Figure({
  x,
  y,
  h,
  kind = 'neutral',
  pose = 'stand',
  facing = 'right',
  opacity = 1,
  glow = 0,
  glowTone = INK.amber,
  armTone,
}: {
  x: number;
  y: number;
  h: number;
  kind?: FigureKind;
  pose?: FigurePose;
  facing?: 'left' | 'right';
  opacity?: number;
  glow?: number;
  glowTone?: string;
  /** Colour of the near arm (the escort's is emerald: the DISRUPT gesture). */
  armTone?: string;
}) {
  if (opacity <= 0.001) return null;
  const s = h / 240;
  const k = LOOK[kind];
  const flip = facing === 'left' ? -1 : 1;
  const arm = { stroke: k.body, strokeWidth: 13, strokeLinecap: 'round' as const };
  const near = { ...arm, stroke: armTone ?? k.body };
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s * flip} ${s})`}
      opacity={opacity}
      style={glow > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(6 + 16 * glow)}px ${alpha(glowTone, 0.7 * glow)})` } : undefined}
    >
      {/* legs and shoes */}
      <g strokeLinecap="round">
        <line x1={-9} y1={-98} x2={-11} y2={-12} stroke={k.legs} strokeWidth={16} />
        <line x1={9} y1={-98} x2={11} y2={-12} stroke={k.legs} strokeWidth={16} />
        <ellipse cx={-14} cy={-5} rx={13} ry={6} fill={k.legs} />
        <ellipse cx={14} cy={-5} rx={13} ry={6} fill={k.legs} />
      </g>
      {/* far arm, down */}
      <line x1={-25} y1={-168} x2={-32} y2={-112} {...arm} />
      {/* torso */}
      <path d="M-28 -177 Q0 -192 28 -177 L25 -92 Q0 -85 -25 -92 Z" fill={k.body} stroke={alpha(k.line, 0.55)} strokeWidth={2} strokeLinejoin="round" />
      {kind === 'guard' ? <path d="M-27 -150 Q0 -143 27 -150" fill="none" stroke={INK.emerald} strokeWidth={7} /> : null}
      {/* near arm */}
      {pose === 'stand' ? <line x1={25} y1={-168} x2={32} y2={-112} {...near} /> : null}
      {pose === 'reach' ? <path d="M25 -168 L50 -146 L78 -150" fill="none" {...near} strokeLinejoin="round" /> : null}
      {pose === 'escort' ? <path d="M25 -168 L52 -160 L80 -166" fill="none" {...near} strokeLinejoin="round" /> : null}
      {pose === 'walkie' ? <path d="M25 -168 L46 -150 L32 -196" fill="none" {...near} strokeLinejoin="round" /> : null}
      {/* head (no face) */}
      <circle cx={0} cy={-208} r={18} fill={k.head} stroke={alpha(k.line, 0.5)} strokeWidth={2} />
      {kind === 'guard' ? (
        <g>
          <path d="M-19 -212 Q-18 -232 0 -232 Q18 -232 19 -212 Z" fill={INK.emerald} stroke={alpha('#022c22', 0.7)} strokeWidth={2} />
          <path d="M-4 -213 H30" stroke={INK.emerald} strokeWidth={6} strokeLinecap="round" />
        </g>
      ) : null}
      {/* the walkie, at the ear */}
      {pose === 'walkie' ? (
        <g>
          <rect x={22} y={-222} width={17} height={36} rx={4} fill="#1c1917" stroke={INK.amber} strokeWidth={3} />
          <line x1={34} y1={-222} x2={34} y2={-246} stroke={INK.amber} strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={30.5} cy={-210} r={2.6} fill={INK.amber} />
        </g>
      ) : null}
    </g>
  );
}

/** Where the antenna of a 'walkie' figure ends, in the caller's units. */
export function walkieTip(x: number, y: number, h: number, facing: 'left' | 'right' = 'right'): { x: number; y: number } {
  const s = h / 240;
  return { x: x + (facing === 'left' ? -1 : 1) * 34 * s, y: y - 246 * s };
}
