import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { CERT } from '../../../data/s04-revocar';

/**
 * s05's «el portal hace lo mismo»: the portal's certificate as a compact cyan card (the DNI's
 * counterpart), which the scene pairs with the CA's sealed response (Hotel's `Justificante`, retitled)
 * and a drawn staple. Not positioned; nothing reads the timeline.
 */

export const PORTAL_CARD = { w: 680, h: 150 } as const;

export function PortalCard({ glow = 0, style }: { glow?: number; style?: CSSProperties }) {
  const g = clamp01(glow);
  return (
    <div
      style={{
        width: PORTAL_CARD.w,
        height: PORTAL_CARD.h,
        boxSizing: 'border-box',
        padding: '20px 28px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.6 + 0.4 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.1 + 0.06 * g)} 0%, ${alpha(C.ink900, 0.97)} 60%)`,
        boxShadow: `0 0 ${Math.round(12 + 30 * g)}px ${alpha(C.cyan, 0.12 + 0.3 * g)}, 0 22px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={34} color={C.cyan} strokeWidth={2.2} />
        <span style={{ fontSize: 32, fontWeight: 800, color: C.cyanSoft }}>{CERT.title}</span>
      </div>
      <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: 32, fontWeight: 650, color: C.textStrong, whiteSpace: 'pre' }}>{CERT.subject}</div>
    </div>
  );
}
