import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * The shipping company (never named), redrawn from V11's
 * `parts/s02-familias/Parties.tsx` (V12 cannot import V11's files): the
 * container ship glyph, emerald, in V11's round badge. Nothing reads the
 * timeline.
 */

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

/** V11's PartyBadge for the shipping company: the ship in a glowing ring, its label under it. */
export function ShipBadge({ size, label, labelSize = 32, glow = 0 }: { size: number; label?: string; labelSize?: number; glow?: number }) {
  const g = clamp01(glow);
  const color = C.emerald;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(size * 0.08), fontFamily: FONT.sans }}>
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
        <ShipGlyph size={size * 0.68} color={color} />
      </div>
      {label ? <div style={{ fontSize: labelSize, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap', lineHeight: 1.1 }}>{label}</div> : null}
    </div>
  );
}
