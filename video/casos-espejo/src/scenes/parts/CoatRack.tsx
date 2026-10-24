import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * Two different coats on the same rack (s07 and rule 3 of s11): same victim, two owners. Each coat takes
 * the colour of its intrusion set («conjunto 1» rose, «conjunto 2» amber). `show` is [coat 1, coat 2], 0–1.
 * Drawn in a 560×440 box; `scale` resizes it.
 */
export const COAT_COLORS = [C.rose, C.amber] as const;

function Coat({ x, color, show, lapel }: { x: number; color: string; show: number; lapel: 'v' | 'round' }) {
  const drop = (1 - show) * -40;
  return (
    <g transform={`translate(${x} ${drop})`} opacity={show}>
      {/* hanger */}
      <path d="M100 30 v-14 a10 10 0 1 1 10 10" fill="none" stroke={C.muted} strokeWidth={5} strokeLinecap="round" />
      <path d="M100 30 L28 74 M100 30 L172 74" fill="none" stroke={C.muted} strokeWidth={5} strokeLinecap="round" />
      {/* coat */}
      <path d="M34 76 Q100 46 166 76 L194 130 L184 300 Q184 312 172 312 L28 312 Q16 312 16 300 L6 130 Z" fill={alpha(color, 0.28)} stroke={color} strokeWidth={5} strokeLinejoin="round" />
      <path d="M34 76 L6 130 L10 262 L38 266 L48 140 Z" fill={alpha(color, 0.18)} stroke={color} strokeWidth={4} strokeLinejoin="round" />
      <path d="M166 76 L194 130 L190 262 L162 266 L152 140 Z" fill={alpha(color, 0.18)} stroke={color} strokeWidth={4} strokeLinejoin="round" />
      {lapel === 'v' ? <path d="M72 62 L100 128 L128 62" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" /> : <path d="M70 64 Q100 112 130 64" fill="none" stroke={color} strokeWidth={5} />}
      <path d="M100 128 V312" stroke={alpha(color, 0.7)} strokeWidth={4} />
      {[170, 218, 266].map((y) => (
        <circle key={y} cx={lapel === 'v' ? 88 : 112} cy={y} r={6} fill={color} />
      ))}
    </g>
  );
}

export function CoatRack({ show = [1, 1], scale = 1, glow = 0 }: { show?: readonly [number, number]; scale?: number; glow?: number }) {
  return (
    <svg width={560 * scale} height={440 * scale} viewBox="0 0 560 440" style={{ display: 'block', overflow: 'visible' }}>
      {/* the rack: a rail on two posts, with a foot */}
      <path d="M20 22 H540" stroke={C.muted} strokeWidth={10} strokeLinecap="round" />
      <path d="M30 22 V430 M530 22 V430" stroke={alpha(C.muted, 0.5)} strokeWidth={8} strokeLinecap="round" />
      <path d="M0 432 H120 M440 432 H560" stroke={alpha(C.muted, 0.5)} strokeWidth={8} strokeLinecap="round" />
      <g transform="translate(80 24)" style={{ filter: glow > 0 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(COAT_COLORS[0], 0.5 * glow)})` : undefined }}>
        <Coat x={0} color={COAT_COLORS[0]} show={show[0]} lapel="v" />
      </g>
      <g transform="translate(290 24)" style={{ filter: glow > 0 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(COAT_COLORS[1], 0.5 * glow)})` : undefined }}>
        <Coat x={0} color={COAT_COLORS[1]} show={show[1]} lapel="round" />
      </g>
    </svg>
  );
}
