import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * V11's two sides (redrawn from V11's parts/s02-familias/Parties.tsx — V12 cannot import V11's files): the
 * port and its portal (a quay crane, cyan) and the shipping company (a container ship, emerald — never
 * named). `PartyBadge` = glyph in a ring + its optional label under it; `size` is the ring's diameter.
 * Used by s03 (the road, the man in the middle, «la naviera conecta»). Nothing reads the timeline.
 */

export type Party = 'port' | 'naviera';

export const PARTY_TONE: Record<Party, string> = { port: C.cyan, naviera: C.emerald };

export function PortGlyph({ size, color = C.cyan }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <g fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
        {/* Legs and brace */}
        <path d="M 34 92 L 34 40 M 58 92 L 58 40 M 34 66 L 58 54 M 34 54 L 58 66" />
        {/* A-frame */}
        <path d="M 30 40 L 46 12 L 62 40" />
        {/* Boom */}
        <path d="M 8 40 L 94 40 M 8 34 L 94 34" />
        <path d="M 46 12 L 92 34 M 46 12 L 12 34" strokeWidth={2.5} />
        {/* Trolley, cable and the container */}
        <path d="M 80 40 L 80 58" strokeWidth={2.5} />
        <rect x={70} y={58} width={20} height={12} rx={1.5} fill={alpha(color, 0.35)} />
        {/* Quay */}
        <path d="M 4 93 L 96 93" />
      </g>
    </svg>
  );
}

export function ShipGlyph({ size, color = C.emerald }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <g stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        {/* Containers */}
        <rect x={16} y={46} width={16} height={14} rx={1.5} fill={alpha(color, 0.35)} />
        <rect x={34} y={46} width={16} height={14} rx={1.5} fill={alpha(color, 0.2)} />
        <rect x={52} y={46} width={16} height={14} rx={1.5} fill={alpha(color, 0.35)} />
        <rect x={25} y={32} width={16} height={14} rx={1.5} fill={alpha(color, 0.2)} />
        <rect x={43} y={32} width={16} height={14} rx={1.5} fill={alpha(color, 0.35)} />
        {/* Bridge */}
        <rect x={72} y={30} width={14} height={30} rx={2} fill={alpha(color, 0.15)} />
        <path d="M 75 37 L 83 37" fill="none" />
        {/* Hull */}
        <path d="M 6 61 L 94 61 L 84 80 L 16 80 Z" fill={alpha(color, 0.22)} />
        {/* Water */}
        <path d="M 4 90 Q 13 85 22 90 Q 31 95 40 90 Q 49 85 58 90 Q 67 95 76 90 Q 85 85 96 90" fill="none" strokeWidth={3} />
      </g>
    </svg>
  );
}

export function PartyBadge({
  who,
  size,
  label,
  labelSize = 34,
  show = 1,
  glow = 0,
  dim = 0,
  style,
}: {
  who: Party;
  /** Diameter of the ring, px. */
  size: number;
  label?: string;
  labelSize?: number;
  show?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const color = PARTY_TONE[who];
  const g = clamp01(glow);
  const d = clamp01(dim);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: Math.round(size * 0.08),
        opacity: sh * (1 - 0.6 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `${Math.max(2, Math.round(size * 0.03))}px solid ${alpha(color, 0.7 + 0.3 * g)}`,
          background: `radial-gradient(circle at 50% 35%, ${alpha(color, 0.18 + 0.1 * g)} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
          boxShadow: `0 0 ${Math.round(10 + 30 * g)}px ${alpha(color, 0.12 + 0.35 * g)}, 0 16px 36px ${alpha('#000000', 0.4)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {who === 'port' ? <PortGlyph size={size * 0.64} color={color} /> : <ShipGlyph size={size * 0.68} color={color} />}
      </div>
      {label ? (
        <div style={{ fontSize: labelSize, fontWeight: 800, color: who === 'port' ? C.cyanSoft : '#6ee7b7', whiteSpace: 'nowrap', lineHeight: 1.1 }}>{label}</div>
      ) : null}
    </div>
  );
}
