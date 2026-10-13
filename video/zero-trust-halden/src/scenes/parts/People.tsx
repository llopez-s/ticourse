import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * V20's people, drawn ONE way in every scene: a flat standing figure that may wear the port's
 * hi-vis vest («el chaleco»: it only says you are inside), plus the vest and a laptop on their own.
 *
 * Everything here draws inside the caller's <svg>, in the caller's units; nothing reads the timeline
 * and nothing positions itself. A figure is anchored at its FEET: `<Person x y h />` stands on (x, y)
 * and is `h` tall (its box is PERSON_ASPECT × h wide, centred on x).
 */

/** The vest's yellow: the only hi-vis yellow in the video (amber stays for warnings). */
export const VEST_YELLOW = '#fde047';
const VEST_SHADE = '#ca8a04';
const VEST_BAND = '#e5e7eb';

/** Neutral body ink (nobody's colour): skin/head, clothes, shoes. */
export const BODY = { skin: '#cbd5e1', clothes: '#475569', dark: '#1e293b', line: '#64748b' } as const;

/** Width of a figure's box as a fraction of its height (arms down). */
export const PERSON_ASPECT = 0.42;

const U = 240; // design height

export type PersonCarry = 'none' | 'slip' | 'box' | 'laptop';

/**
 * A standing figure, feet on (x, y), `h` tall.
 * - `vest` 0–1: how much of the hi-vis vest shows (false/0 = plain clothes).
 * - `tone`: tints the clothes (a role colour); default neutral slate.
 * - `carry`: what the raised hand (the one on the `facing` side) holds: a paper slip (a pedido),
 *   a box (mercancía) or a laptop. `carryTone` colours it; `carryMark` draws a small warning dot on it.
 * - `facing`: which side the raised hand is on.
 * - `opacity`, `glow` (0–1, a soft halo in `glowTone`).
 */
export function Person({
  x,
  y,
  h,
  vest = 1,
  tone = BODY.clothes,
  carry = 'none',
  carryTone = '#e2e8f0',
  carryMark,
  facing = 'right',
  opacity = 1,
  glow = 0,
  glowTone = C.cyan,
  children,
}: {
  x: number;
  y: number;
  h: number;
  vest?: boolean | number;
  tone?: string;
  carry?: PersonCarry;
  carryTone?: string;
  carryMark?: string;
  facing?: 'left' | 'right';
  opacity?: number;
  glow?: number;
  glowTone?: string;
  /** Extra marks in the figure's own 100×240 design space (origin: feet centre, y up is negative). */
  children?: ReactNode;
}) {
  const s = h / U;
  const v = typeof vest === 'number' ? Math.max(0, Math.min(1, vest)) : vest ? 1 : 0;
  const flip = facing === 'left' ? -1 : 1;
  const raised = carry !== 'none';
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      opacity={opacity}
      style={glow > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(6 + 18 * glow)}px ${alpha(glowTone, 0.7 * glow)})` } : undefined}
    >
      <g transform={`scale(${flip} 1)`}>
        {/* legs and shoes */}
        <g strokeLinecap="round">
          <line x1={-9} y1={-96} x2={-11} y2={-12} stroke={BODY.dark} strokeWidth={15} />
          <line x1={9} y1={-96} x2={11} y2={-12} stroke={BODY.dark} strokeWidth={15} />
          <line x1={-9} y1={-96} x2={-11} y2={-12} stroke={BODY.line} strokeWidth={15} opacity={0.35} />
          <line x1={9} y1={-96} x2={11} y2={-12} stroke={BODY.line} strokeWidth={15} opacity={0.35} />
          <ellipse cx={-14} cy={-5} rx={12} ry={5.5} fill={BODY.dark} stroke={BODY.line} strokeWidth={1.5} />
          <ellipse cx={14} cy={-5} rx={12} ry={5.5} fill={BODY.dark} stroke={BODY.line} strokeWidth={1.5} />
        </g>

        {/* far arm (down) */}
        <line x1={-24} y1={-168} x2={-31} y2={-112} stroke={tone} strokeWidth={12} strokeLinecap="round" />
        <circle cx={-31} cy={-106} r={6} fill={BODY.skin} />

        {/* torso */}
        <path d="M-27 -176 Q0 -190 27 -176 L24 -92 Q0 -86 -24 -92 Z" fill={tone} stroke={alpha('#000000', 0.35)} strokeWidth={1.5} strokeLinejoin="round" />

        {/* the vest: V neck, open front, two reflective bands */}
        {v > 0.01 ? (
          <g opacity={v}>
            <path
              d="M-27 -176 Q-14 -183 -9 -182 L0 -150 L9 -182 Q14 -183 27 -176 L24.5 -104 Q0 -98 -24.5 -104 Z"
              fill={VEST_YELLOW}
              stroke={VEST_SHADE}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
            <line x1={0} y1={-150} x2={0} y2={-100} stroke={VEST_SHADE} strokeWidth={1.6} />
            <path d="M-26 -146 Q0 -140 26 -146" fill="none" stroke={VEST_BAND} strokeWidth={6} />
            <path d="M-25 -122 Q0 -116 25 -122" fill="none" stroke={VEST_BAND} strokeWidth={6} />
          </g>
        ) : null}

        {/* near arm: down, or raised forward holding something */}
        {raised ? (
          <>
            <line x1={24} y1={-168} x2={44} y2={-136} stroke={tone} strokeWidth={12} strokeLinecap="round" />
            <circle cx={47} cy={-132} r={6} fill={BODY.skin} />
          </>
        ) : (
          <>
            <line x1={24} y1={-168} x2={31} y2={-112} stroke={tone} strokeWidth={12} strokeLinecap="round" />
            <circle cx={31} cy={-106} r={6} fill={BODY.skin} />
          </>
        )}

        {/* head */}
        <circle cx={0} cy={-207} r={17} fill={BODY.skin} />
        <path d="M-17 -210 Q-14 -228 2 -226 Q17 -224 17 -208 Q8 -218 -6 -214 Z" fill="#334155" />

        {/* what the raised hand holds */}
        {carry === 'slip' ? (
          <g transform="translate(52 -150)">
            <rect x={-4} y={-22} width={30} height={38} rx={3} fill={carryTone} stroke={alpha('#0f172a', 0.5)} strokeWidth={1.2} />
            <path d="M2 -12 H20 M2 -3 H20 M2 6 H13" stroke={alpha('#0f172a', 0.55)} strokeWidth={2.4} strokeLinecap="round" />
          </g>
        ) : null}
        {carry === 'box' ? (
          <g transform="translate(60 -138)">
            <rect x={-18} y={-24} width={40} height={34} rx={3} fill={alpha(carryTone, 0.9)} stroke={alpha('#0f172a', 0.5)} strokeWidth={1.4} />
            <path d="M-18 -13 H22 M2 -24 V-13" stroke={alpha('#0f172a', 0.45)} strokeWidth={2} />
          </g>
        ) : null}
        {carry === 'laptop' ? (
          <g transform="translate(58 -140)">
            <rect x={-18} y={-26} width={40} height={27} rx={3} fill={C.ink850} stroke={carryTone} strokeWidth={2.4} />
            <path d="M-23 4 H27" stroke={carryTone} strokeWidth={3.2} strokeLinecap="round" />
            {carryMark ? <circle cx={2} cy={-12.5} r={5.5} fill={carryMark} /> : null}
          </g>
        ) : null}
      </g>
      {children}
    </g>
  );
}

/**
 * The vest alone (s02's header, a rule icon, the poster): centred on (x, y), `h` tall,
 * ≈ 0.78 × h wide. `empty` 0–1 fades the yellow to an outline («no abre nada»).
 */
export function VestGlyph({ x, y, h, opacity = 1, empty = 0 }: { x: number; y: number; h: number; opacity?: number; empty?: number }) {
  const s = h / 100;
  const e = Math.max(0, Math.min(1, empty));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <path
        d="M-39 -44 Q-22 -52 -13 -50 L0 -14 L13 -50 Q22 -52 39 -44 L35 44 Q0 52 -35 44 Z"
        fill={alpha(VEST_YELLOW, 1 - 0.85 * e)}
        stroke={e > 0.5 ? VEST_YELLOW : VEST_SHADE}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <line x1={0} y1={-14} x2={0} y2={48} stroke={e > 0.5 ? alpha(VEST_YELLOW, 0.7) : VEST_SHADE} strokeWidth={2.2} />
      <path d="M-37 -6 Q0 2 37 -6" fill="none" stroke={alpha(VEST_BAND, 1 - 0.6 * e)} strokeWidth={8} />
      <path d="M-36 22 Q0 30 36 22" fill="none" stroke={alpha(VEST_BAND, 1 - 0.6 * e)} strokeWidth={8} />
    </g>
  );
}

/** A laptop seen from the front, centred on (x, y), `w` wide (≈ 0.66 × w tall). `mark` draws a warning dot on the screen. */
export function LaptopGlyph({ x, y, w, color = '#e2e8f0', mark, opacity = 1 }: { x: number; y: number; w: number; color?: string; mark?: string; opacity?: number }) {
  const s = w / 100;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <rect x={-38} y={-33} width={76} height={50} rx={5} fill={C.ink850} stroke={color} strokeWidth={4} />
      <path d="M-50 27 H50" stroke={color} strokeWidth={6} strokeLinecap="round" />
      {mark ? <circle cx={0} cy={-8} r={9} fill={mark} /> : null}
    </g>
  );
}
