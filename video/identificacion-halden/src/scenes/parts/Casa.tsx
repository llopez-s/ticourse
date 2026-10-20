import type { ReactElement } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Tile } from './Tile';

export type CasaKind = 'planos' | 'grifo' | 'lista';

/**
 * La casa (s04 minis, s08 rule 2): the image of the application tools. `planos` — the blueprint you check before
 * building (SAST: you need the plans and it comes early); `grifo` — the finished house with the tap running and the
 * light on (DAST: no plans needed, it sees what only happens when it works); `lista` — the materials list, one batch
 * withdrawn and found at a glance (package monitoring with an SBOM). Textless; labelled «imagen · no es del puerto»
 * by the scenes. Not the engine's `House` (V4's tenant image).
 */
export function CasaTile({ kind, width, show = 1, glow = 0, dim = 0, tone }: { kind: CasaKind; width: number; show?: number; glow?: number; dim?: number; tone?: string }) {
  return (
    <Tile width={width} show={show} glow={glow} dim={dim} tone={tone ?? C.amber}>
      {DRAW[kind]()}
    </Tile>
  );
}

const DRAW: Record<CasaKind, () => ReactElement> = {
  planos: () => (
    <>
      {/* a blueprint sheet, a little rotated, with a grid and the house drawn in white lines */}
      <g transform="rotate(-4 100 75)">
        <rect x={22} y={18} width={156} height={114} rx={4} fill="#1e3a8a" stroke="#93c5fd" strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`v${i}`} x1={22 + i * 22} y1={18} x2={22 + i * 22} y2={132} stroke={alpha('#93c5fd', 0.25)} strokeWidth={1} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1={22} y1={18 + i * 24} x2={178} y2={18 + i * 24} stroke={alpha('#93c5fd', 0.25)} strokeWidth={1} />
        ))}
        <path d="M 60 112 L 60 72 L 100 44 L 140 72 L 140 112 Z" fill="none" stroke="#e0f2fe" strokeWidth={3} strokeLinejoin="round" />
        <rect x={90} y={86} width={20} height={26} fill="none" stroke="#e0f2fe" strokeWidth={2.5} />
        <rect x={68} y={80} width={14} height={14} fill="none" stroke="#e0f2fe" strokeWidth={2} />
        <rect x={118} y={80} width={14} height={14} fill="none" stroke="#e0f2fe" strokeWidth={2} />
        <path d="M 60 122 L 140 122" stroke="#e0f2fe" strokeWidth={1.5} strokeDasharray="4 3" />
      </g>
    </>
  ),
  grifo: () => (
    <>
      {/* a tiled wall, a light bulb on, and a tap running into a basin */}
      <rect x={0} y={0} width={200} height={150} fill="#1f1d29" />
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => <rect key={`${r}-${c}`} x={c * 36 - (r % 2) * 18} y={r * 26} width={34} height={24} fill="#262433" />),
      )}
      <circle cx={160} cy={32} r={24} fill={alpha('#fde68a', 0.22)} />
      <circle cx={160} cy={32} r={12} fill="#fde68a" />
      <rect x={155} y={0} width={10} height={20} fill="#4b5563" />
      <path d="M 40 50 L 96 50 Q 106 50 106 60 L 106 70" fill="none" stroke="#cbd5e1" strokeWidth={10} strokeLinecap="round" />
      <rect x={60} y={38} width={16} height={12} rx={3} fill="#cbd5e1" />
      <rect x={52} y={32} width={32} height={8} rx={4} fill="#94a3b8" />
      <path d="M 106 76 Q 104 96 106 112" stroke="#38bdf8" strokeWidth={6} strokeLinecap="round" fill="none" />
      <path d="M 60 112 L 152 112 Q 148 140 106 140 Q 64 140 60 112 Z" fill="#e2e8f0" />
    </>
  ),
  lista: () => (
    <>
      {/* a clipboard with the materials list: rows ticked, one row (a withdrawn batch) marked */}
      <rect x={46} y={14} width={108} height={128} rx={8} fill="#7c5a3a" />
      <rect x={56} y={26} width={88} height={110} rx={3} fill="#f1f5f9" />
      <rect x={82} y={8} width={36} height={16} rx={4} fill="#94a3b8" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 40 + i * 19;
        const marked = i === 2;
        return (
          <g key={i}>
            {marked ? <rect x={58} y={y - 6} width={84} height={16} rx={3} fill={alpha(C.rose, 0.3)} /> : null}
            <rect x={64} y={y} width={46} height={5} rx={2.5} fill="#64748b" />
            {marked ? (
              <path d={`M 120 ${y - 3} l 10 10 M 130 ${y - 3} l -10 10`} stroke={C.rose} strokeWidth={3} strokeLinecap="round" />
            ) : (
              <path d={`M 120 ${y + 2} l 4 4 l 7 -8`} fill="none" stroke="#059669" strokeWidth={3} strokeLinecap="round" />
            )}
          </g>
        );
      })}
    </>
  ),
};
