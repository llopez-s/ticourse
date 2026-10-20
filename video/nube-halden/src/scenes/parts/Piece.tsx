import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

export const PIECE = { w: 420, h: 200 } as const;

/**
 * One piece of the application (a microservice): a rounded rectangle in a row — never a stacked circle (V31's
 * traffic lights). `label` names what it does (or bars when there is none: the s07 still); `tone` is its state
 * (cyan normal, amber hit, emerald still standing); `foot` holds a badge under the label («despliegue propio»).
 */
export function Piece({
  width = PIECE.w,
  height = PIECE.h,
  label,
  tone = C.cyan,
  glow = 0,
  foot,
  dim = 0,
  labelSize = 36,
}: {
  width?: number;
  height?: number;
  label?: string;
  tone?: string;
  glow?: number;
  foot?: ReactNode;
  dim?: number;
  labelSize?: number;
}) {
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `4px solid ${alpha(tone, 0.6 + 0.35 * g)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.1 + 0.1 * g)} 0%, ${C.ink850} 75%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(tone, 0.32 * g)}` : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: '0 14px',
        fontFamily: FONT.sans,
        opacity: 1 - 0.6 * clamp01(dim),
      }}
    >
      {label ? (
        <div style={{ fontSize: labelSize, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', textAlign: 'center' }}>{label}</div>
      ) : (
        [0, 1, 2].map((k) => <div key={k} style={{ width: [210, 150, 180][k], height: 14, borderRadius: 7, background: alpha(C.muted, 0.25) }} />)
      )}
      {foot}
    </div>
  );
}
