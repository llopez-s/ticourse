import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** Both images share one square box, in their own units. */
export const FIGURE = { w: 300, h: 300 } as const;

/**
 * Concept 2a · the thief (organized crime): a whole masked figure striding off to the right with a sack over the
 * shoulder — takes what sells and goes. Never a hand in a pocket (V36's pickpocket). `walk` 0–1 slides him out a little.
 */
export function Thief({ size, walk = 0, glow = 1 }: { size: number; walk?: number; glow?: number }) {
  const g = clamp01(glow);
  const dx = 30 * clamp01(walk);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${FIGURE.w} ${FIGURE.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <ellipse cx={150 + dx} cy={284} rx={90} ry={10} fill={alpha('#000000', 0.35)} />
      <g transform={`translate(${dx} 0)`} style={{ filter: `drop-shadow(0 0 ${Math.round(16 * g)}px ${alpha(C.rose, 0.45)})` }}>
        {/* sack over the shoulder */}
        <path d="M 96 92 C 40 80 30 150 70 168 C 110 182 140 150 128 112 Z" fill="#7c2d3a" stroke={C.roseSoft} strokeWidth={4} />
        <path d="M 112 100 L 132 86" stroke={C.roseSoft} strokeWidth={5} strokeLinecap="round" />
        {/* legs mid-stride */}
        <path d="M 150 196 L 118 278" stroke={C.ink600} strokeWidth={22} strokeLinecap="round" />
        <path d="M 158 196 L 200 274" stroke={C.ink600} strokeWidth={22} strokeLinecap="round" />
        {/* body and arm */}
        <rect x={124} y={104} width={60} height={104} rx={24} fill={C.rose} />
        <path d="M 176 124 L 214 168" stroke={C.rose} strokeWidth={18} strokeLinecap="round" />
        <path d="M 134 118 L 122 100" stroke={C.rose} strokeWidth={18} strokeLinecap="round" />
        {/* head with the mask band and a beanie */}
        <circle cx={160} cy={72} r={30} fill="#e7c9a9" />
        <path d="M 128 64 Q 160 50 192 64 L 192 54 Q 160 18 128 54 Z" fill={C.ink700} />
        <rect x={130} y={64} width={60} height={16} rx={8} fill={C.ink950} />
        <circle cx={150} cy={72} r={4} fill="#e7c9a9" />
        <circle cx={172} cy={72} r={4} fill="#e7c9a9" />
      </g>
    </svg>
  );
}

/**
 * Concept 2b · the hidden microphone (nation-state): a small table lamp on a side table and, tucked under the
 * shade, a tiny microphone listening (quiet arcs that `listen` 0–1 brings out). It takes nothing; it stays.
 */
export function HiddenMic({ size, listen = 1, glow = 1 }: { size: number; listen?: number; glow?: number }) {
  const l = clamp01(listen);
  const g = clamp01(glow);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${FIGURE.w} ${FIGURE.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* side table */}
      <rect x={60} y={214} width={180} height={16} rx={6} fill="#5b4632" />
      <rect x={78} y={230} width={14} height={56} fill="#4a3828" />
      <rect x={208} y={230} width={14} height={56} fill="#4a3828" />
      {/* lamp */}
      <rect x={142} y={110} width={12} height={100} fill="#94a3b8" />
      <ellipse cx={148} cy={212} rx={40} ry={8} fill="#64748b" />
      <path d="M 92 112 L 118 40 L 178 40 L 204 112 Z" fill="#e2c88f" stroke="#b89a5c" strokeWidth={4} />
      <ellipse cx={148} cy={112} rx={56} ry={8} fill={alpha('#fde68a', 0.35)} />
      {/* the microphone, tucked under the shade */}
      <g transform="translate(176 140)" style={{ filter: `drop-shadow(0 0 ${Math.round(14 * g)}px ${alpha(C.rose, 0.6)})` }}>
        <rect x={-10} y={-18} width={20} height={30} rx={10} fill={C.rose} />
        <path d="M -15 2 Q 0 22 15 2" fill="none" stroke={C.roseSoft} strokeWidth={4} />
        <rect x={-2} y={16} width={4} height={12} fill={C.roseSoft} />
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M ${26 + k * 16} ${-22 - k * 6} Q ${36 + k * 20} -2 ${26 + k * 16} ${18 + k * 6}`}
            fill="none"
            stroke={C.roseSoft}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={l * (0.85 - k * 0.22)}
          />
        ))}
      </g>
    </svg>
  );
}
