import type { ReactElement } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Tile } from './Tile';

export type ConsultaKind = 'puerta' | 'analitica' | 'consulta' | 'pulsometro';

const SKIN = '#e7c9a9';
const COAT = '#e2e8f0';
const CLOTH = '#64748b';

/** A simple standing person (head + body), feet at (x, y). */
export function Person({ x, y, h = 80, body = CLOTH, head = SKIN, opacity = 1, dashed = false }: { x: number; y: number; h?: number; body?: string; head?: string; opacity?: number; dashed?: boolean }) {
  const r = h * 0.13;
  const top = y - h;
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={top + r} r={r} fill={dashed ? 'none' : head} stroke={dashed ? alpha(C.muted, 0.7) : 'none'} strokeWidth={2} strokeDasharray={dashed ? '4 3' : undefined} />
      <path
        d={`M ${x - h * 0.2} ${y} L ${x - h * 0.2} ${top + h * 0.48} Q ${x - h * 0.2} ${top + h * 0.3} ${x} ${top + h * 0.3} Q ${x + h * 0.2} ${top + h * 0.3} ${x + h * 0.2} ${top + h * 0.48} L ${x + h * 0.2} ${y} Z`}
        fill={dashed ? 'none' : body}
        stroke={dashed ? alpha(C.muted, 0.7) : 'none'}
        strokeWidth={2}
        strokeDasharray={dashed ? '4 3' : undefined}
      />
    </g>
  );
}

/** The doctor: a person in a white coat with a stethoscope. */
function Doctor({ x, y, h = 86 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <Person x={x} y={y} h={h} body={COAT} />
      <path d={`M ${x - 8} ${y - h * 0.68} Q ${x - 10} ${y - h * 0.42} ${x} ${y - h * 0.38} Q ${x + 10} ${y - h * 0.42} ${x + 8} ${y - h * 0.68}`} fill="none" stroke="#334155" strokeWidth={3} />
      <circle cx={x} cy={y - h * 0.36} r={4} fill="#334155" />
    </g>
  );
}

function Floor() {
  return <rect x={0} y={128} width={200} height={22} fill="#0f0e15" />;
}

/**
 * La consulta (s02 minis, s08 rule 1): the image of the scanners. `puerta` — the doctor at the consulting-room door
 * looks at you and guesses (the scan without an account); `analitica` — the blood test that reads what is inside (with
 * an account); `consulta` — the consulting room only sees whoever walks in (agentless, from the centre); `pulsometro` —
 * the band you wear reports wherever you are (agent-based). Textless; the scenes label it «imagen · no es del puerto».
 */
export function ConsultaTile({ kind, width, show = 1, glow = 0, dim = 0 }: { kind: ConsultaKind; width: number; show?: number; glow?: number; dim?: number }) {
  return (
    <Tile width={width} show={show} glow={glow} dim={dim} tone={kind === 'analitica' || kind === 'pulsometro' ? C.emerald : C.amber}>
      {DRAW[kind]()}
    </Tile>
  );
}

const DRAW: Record<ConsultaKind, () => ReactElement> = {
  puerta: () => (
    <>
      <Floor />
      {/* the door frame on the left, the doctor in it */}
      <rect x={18} y={28} width={62} height={100} fill="#24222e" stroke={alpha(C.text, 0.35)} strokeWidth={3} />
      <Doctor x={50} y={128} h={84} />
      {/* the patient across, and the glance between them (a dashed line: it only looks) */}
      <Person x={150} y={128} h={78} body="#7c6f9a" />
      <path d="M 60 58 L 138 62" stroke={alpha(C.amber, 0.85)} strokeWidth={3} strokeDasharray="6 5" />
      {/* a question mark over the doctor: it guesses */}
      <text x={78} y={34} fontFamily="Inter, Arial, sans-serif" fontSize={30} fontWeight={800} fill={C.amber}>
        ?
      </text>
    </>
  ),
  analitica: () => (
    <>
      <Floor />
      {/* a rack of three tubes, one with a sample and level marks */}
      <rect x={26} y={98} width={86} height={14} rx={3} fill="#3a3746" />
      {[44, 69, 94].map((x, i) => (
        <g key={x}>
          <rect x={x - 8} y={44} width={16} height={60} rx={8} fill={alpha('#cbd5e1', 0.18)} stroke={alpha('#cbd5e1', 0.7)} strokeWidth={2} />
          {i === 1 ? <rect x={x - 6} y={68} width={12} height={34} rx={6} fill="#e11d48" opacity={0.85} /> : null}
        </g>
      ))}
      {/* the results sheet: rows of bars, all ticked */}
      <rect x={124} y={30} width={60} height={92} rx={5} fill="#e2e8f0" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={132} y={44 + i * 18} width={28} height={6} rx={3} fill="#94a3b8" />
          <path d={`M 166 ${46 + i * 18} l 4 4 l 7 -8`} fill="none" stroke="#059669" strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  consulta: () => (
    <>
      <Floor />
      {/* the room: a desk and the doctor; a patient in the doorway; two people outside who never come in */}
      <rect x={10} y={26} width={118} height={102} fill="#1f1d29" stroke={alpha(C.text, 0.3)} strokeWidth={3} />
      <rect x={20} y={92} width={46} height={8} fill="#5b5368" />
      <Doctor x={40} y={128} h={70} />
      <rect x={98} y={56} width={30} height={72} fill="#14131b" />
      <Person x={112} y={128} h={66} body="#7c6f9a" />
      <Person x={156} y={128} h={60} dashed opacity={0.8} />
      <Person x={186} y={128} h={56} dashed opacity={0.6} />
    </>
  ),
  pulsometro: () => (
    <>
      {/* a wrist with the band and its screen, and the signal it sends from wherever it is */}
      <path d="M 0 120 Q 60 104 120 108 Q 160 110 200 98 L 200 150 L 0 150 Z" fill="#c9a98a" />
      <rect x={58} y={92} width={60} height={34} rx={8} fill="#111827" stroke={alpha('#e2e8f0', 0.6)} strokeWidth={2} />
      <path d="M 64 110 L 74 110 L 79 100 L 86 118 L 92 106 L 98 110 L 112 110" fill="none" stroke={C.emerald} strokeWidth={3} strokeLinejoin="round" />
      {[16, 28, 40].map((r) => (
        <path key={r} d={`M ${88 - r * 0.7} ${80 - r * 0.7} A ${r} ${r} 0 0 1 ${88 + r * 0.7} ${80 - r * 0.7}`} fill="none" stroke={alpha(C.emerald, 0.75)} strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* far away: a little tree and a hill — it is not at the doctor's */}
      <path d="M 140 70 Q 170 40 200 62 L 200 90 L 140 90 Z" fill="#2b3a33" />
      <circle cx={162} cy={46} r={12} fill="#2f5b46" />
      <rect x={160} y={56} width={4} height={18} fill="#4b3a2a" />
    </>
  ),
};
