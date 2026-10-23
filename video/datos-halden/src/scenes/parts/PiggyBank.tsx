import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/**
 * The piggy-bank image of concept 1 (always labelled «imagen · no es del puerto» where it is the main image). Three
 * drawings in the same 160×120 box: the closed piggy bank (at rest), a coin travelling along a dashed arc (a transfer,
 * in transit) and coins in an open hand (in use, when you pay). No till, shop or banknote.
 */
export const PIG = { w: 160, h: 120 } as const;

const GOLD = C.amber;

function Coin({ x, y, r = 11, o = 1 }: { x: number; y: number; r?: number; o?: number }) {
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill={alpha(GOLD, 0.9)} stroke={'#b45309'} strokeWidth={2.5} />
      <circle cx={x} cy={y} r={r * 0.55} fill="none" stroke={'#b45309'} strokeWidth={1.8} opacity={0.7} />
    </g>
  );
}

/** The closed piggy bank. `tone` colours its outline; `coin` 0–1 drops a coin into the slot. */
export function Piggy({ width = PIG.w, tone = C.cyan, coin = 1 }: { width?: number; tone?: string; coin?: number }) {
  const k = clamp01(coin);
  return (
    <svg width={width} height={(width * PIG.h) / PIG.w} viewBox={`0 0 ${PIG.w} ${PIG.h}`} style={{ overflow: 'visible' }}>
      {k < 0.99 ? <Coin x={80} y={mix(-6, 24, k)} o={1 - k} /> : null}
      {/* legs */}
      {[46, 64, 98, 114].map((x) => (
        <rect key={x} x={x - 6} y={88} width={13} height={20} rx={4} fill={C.ink800} stroke={tone} strokeWidth={3} />
      ))}
      {/* body */}
      <ellipse cx={80} cy={68} rx={58} ry={34} fill={alpha(tone, 0.14)} stroke={tone} strokeWidth={4} />
      {/* ear */}
      <path d="M 104 40 L 116 22 L 120 46 Z" fill={alpha(tone, 0.3)} stroke={tone} strokeWidth={3} strokeLinejoin="round" />
      {/* snout */}
      <rect x={132} y={56} width={18} height={24} rx={8} fill={alpha(tone, 0.25)} stroke={tone} strokeWidth={3} />
      <circle cx={113} cy={58} r={4} fill={tone} />
      {/* tail */}
      <path d="M 22 62 q -12 -4 -8 -14 q 4 -6 8 2" fill="none" stroke={tone} strokeWidth={3} strokeLinecap="round" />
      {/* coin slot */}
      <rect x={66} y={34} width={30} height={7} rx={3.5} fill={C.ink950} stroke={tone} strokeWidth={2} />
    </svg>
  );
}

/** A transfer: a coin travelling along a dashed arc, `t` 0–1 its position (loops when driven by time). */
export function Transfer({ width = PIG.w, tone = C.sky, t = 0.5 }: { width?: number; tone?: string; t?: number }) {
  const p = clamp01(t);
  // Quadratic arc from (18, 96) through (80, 10) to (142, 96).
  const x = (1 - p) * (1 - p) * 18 + 2 * (1 - p) * p * 80 + p * p * 142;
  const y = (1 - p) * (1 - p) * 96 + 2 * (1 - p) * p * 10 + p * p * 96;
  return (
    <svg width={width} height={(width * PIG.h) / PIG.w} viewBox={`0 0 ${PIG.w} ${PIG.h}`} style={{ overflow: 'visible' }}>
      <path d="M 18 96 Q 80 10 142 96" fill="none" stroke={tone} strokeWidth={4} strokeDasharray="10 9" strokeLinecap="round" />
      <path d="M 130 84 L 143 98 L 146 79" fill="none" stroke={tone} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={18} cy={96} r={8} fill={C.ink850} stroke={tone} strokeWidth={3} />
      <Coin x={x} y={y} r={13} />
    </svg>
  );
}

/** Coins in an open hand: the money out of the piggy bank, while you pay. */
export function Hand({ width = PIG.w, tone = C.amber }: { width?: number; tone?: string }) {
  return (
    <svg width={width} height={(width * PIG.h) / PIG.w} viewBox={`0 0 ${PIG.w} ${PIG.h}`} style={{ overflow: 'visible' }}>
      {/* coins on the palm */}
      <Coin x={64} y={52} r={13} />
      <Coin x={90} y={48} r={13} />
      <Coin x={77} y={34} r={13} />
      {/* open palm, seen from the side: fingers to the right, thumb up */}
      <path
        d="M 18 74 L 46 70 Q 60 66 80 68 L 136 66 Q 148 67 146 76 Q 144 82 132 82 L 118 82 Q 128 86 124 92 Q 120 97 108 96 L 60 98 Q 40 100 30 96 L 18 96 Z"
        fill={alpha(tone, 0.16)}
        stroke={tone}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M 46 70 Q 42 54 50 50 Q 58 48 60 66" fill={alpha(tone, 0.16)} stroke={tone} strokeWidth={4} strokeLinejoin="round" />
      {/* sleeve */}
      <rect x={2} y={68} width={18} height={34} rx={5} fill={C.ink800} stroke={alpha(tone, 0.7)} strokeWidth={3} />
    </svg>
  );
}
