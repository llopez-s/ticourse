import type { ReactElement } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Tile } from './Tile';

export type TiendaKind = 'periodico' | 'avisos' | 'grupo' | 'mercadillo';

/** Tone of each source's vignette ring. */
export const TIENDA_TONE: Record<TiendaKind, string> = {
  periodico: C.amber,
  avisos: C.amber,
  grupo: C.emerald,
  mercadillo: C.rose,
};

/** A shopfront with a striped awning, a window and a door, its base at (x, y). */
function Shop({ x, y, w = 50, awning = '#b45309' }: { x: number; y: number; w?: number; awning?: string }) {
  const h = w * 1.05;
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill="#2a2735" stroke={alpha(C.text, 0.3)} strokeWidth={2} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x - 3 + (i * (w + 6)) / 4} y={y - h - 2} width={(w + 6) / 4} height={12} fill={i % 2 ? '#f1f5f9' : awning} />
      ))}
      <rect x={x + 6} y={y - h + 18} width={w * 0.45} height={h * 0.38} fill={alpha('#fde68a', 0.35)} />
      <rect x={x + w * 0.62} y={y - h * 0.55} width={w * 0.28} height={h * 0.55} fill="#14131b" />
    </g>
  );
}

/**
 * La tienda de la calle (s06, s08 rule 3): the image of the threat feeds. `periodico` — what is published, for
 * everyone, and you have to read it all (OSINT); `avisos` — a paid alert service that reads it for you (proprietary
 * feeds); `grupo` — the street's shops warning each other about the forged note they were offered, which no paper
 * prints (an ISAC); `mercadillo` — the flea market where stolen goods are sold: you go to see if yours is there (dark
 * web monitoring). Never keys. Textless; the stall's sign is written by the scene. Labelled «imagen · no es del puerto».
 */
export function TiendaTile({ kind, width, show = 1, glow = 0, dim = 0 }: { kind: TiendaKind; width: number; show?: number; glow?: number; dim?: number }) {
  return (
    <Tile width={width} show={show} glow={glow} dim={dim} tone={TIENDA_TONE[kind]}>
      {DRAW[kind]()}
    </Tile>
  );
}

const DRAW: Record<TiendaKind, () => ReactElement> = {
  periodico: () => (
    <>
      {/* a folded newspaper: masthead bar, a headline, a photo block and many columns of text */}
      <g transform="rotate(-5 100 76)">
        <rect x={28} y={18} width={144} height={116} rx={3} fill="#e5e7eb" />
        <rect x={38} y={26} width={124} height={12} rx={2} fill="#111827" />
        <rect x={38} y={44} width={90} height={8} rx={2} fill="#374151" />
        <rect x={38} y={58} width={52} height={36} fill="#9ca3af" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={`a${i}`} x={96} y={58 + i * 9} width={66} height={4} rx={2} fill="#6b7280" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`b${i}`} x={38} y={100 + i * 8} width={124} height={4} rx={2} fill="#6b7280" />
        ))}
      </g>
    </>
  ),
  avisos: () => (
    <>
      {/* an envelope that arrives with a bell, and the coin you pay for it */}
      <rect x={40} y={44} width={110} height={74} rx={6} fill="#e5e7eb" />
      <path d="M 40 48 L 95 88 L 150 48" fill="none" stroke="#6b7280" strokeWidth={4} strokeLinejoin="round" />
      <circle cx={150} cy={44} r={22} fill={C.amber} />
      <path d="M 141 50 L 141 42 Q 141 32 150 32 Q 159 32 159 42 L 159 50 L 162 54 L 138 54 Z" fill="#78350f" />
      <circle cx={150} cy={58} r={3} fill="#78350f" />
      <circle cx={52} cy={118} r={18} fill="#d97706" stroke="#fde68a" strokeWidth={3} />
      <text x={52} y={126} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize={22} fontWeight={800} fill="#fff7ed">
        €
      </text>
    </>
  ),
  grupo: () => (
    <>
      <rect x={0} y={128} width={200} height={22} fill="#0f0e15" />
      <Shop x={14} y={128} w={46} awning="#047857" />
      <Shop x={77} y={128} w={46} awning="#047857" />
      <Shop x={140} y={128} w={46} awning="#047857" />
      {/* the warning passing between them */}
      <path d="M 37 60 Q 68 30 100 60 Q 132 30 163 60" fill="none" stroke={C.emerald} strokeWidth={3} strokeDasharray="6 5" />
      {[37, 100, 163].map((x) => (
        <circle key={x} cx={x} cy={60} r={5} fill={C.emerald} />
      ))}
      {/* the forged note, crossed */}
      <rect x={78} y={12} width={44} height={24} rx={3} fill="#a7f3d0" stroke="#065f46" strokeWidth={2} />
      <circle cx={100} cy={24} r={6} fill="none" stroke="#065f46" strokeWidth={2} />
      <path d="M 74 8 L 126 40" stroke={C.rose} strokeWidth={4} strokeLinecap="round" />
    </>
  ),
  mercadillo: () => (
    <>
      <rect x={0} y={0} width={200} height={150} fill="#121019" />
      <rect x={0} y={128} width={200} height={22} fill="#0b0a10" />
      {/* a stall: poles, a striped awning, a table with boxes and bags */}
      <rect x={22} y={40} width={5} height={88} fill="#4b5563" />
      <rect x={173} y={40} width={5} height={88} fill="#4b5563" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M ${16 + i * 24} 30 L ${40 + i * 24} 30 L ${40 + i * 24} 48 Q ${28 + i * 24} 56 ${16 + i * 24} 48 Z`} fill={i % 2 ? '#e5e7eb' : '#be123c'} />
      ))}
      <rect x={18} y={98} width={164} height={10} fill="#78350f" />
      <rect x={30} y={108} width={6} height={20} fill="#57290d" />
      <rect x={164} y={108} width={6} height={20} fill="#57290d" />
      <rect x={34} y={74} width={36} height={24} fill="#57534e" />
      <rect x={76} y={80} width={28} height={18} fill="#44403c" />
      <rect x={110} y={70} width={40} height={28} fill="#57534e" />
      <path d="M 154 98 L 158 80 L 172 80 L 176 98 Z" fill="#6b7280" />
      {/* a blank sign hanging from the awning: the scene writes on it */}
      <rect x={58} y={54} width={84} height={14} rx={2} fill="#f8fafc" opacity={0.85} />
    </>
  ),
};
