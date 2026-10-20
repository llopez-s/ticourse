import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { TOOLS } from '../../../data/s04-intrusos';

export const VIGNETTE = { w: 840, h: 270, toolsH: 50 } as const;

/** The vignette's panel: a quiet frame with its place label top-left («una oficina», «la red del puerto»). */
export function VignetteFrame({ label, children, tone = C.cyan }: { label: string; children: ReactNode; tone?: string }) {
  return (
    <div
      style={{
        position: 'relative',
        width: VIGNETTE.w,
        height: VIGNETTE.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.35)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ position: 'absolute', left: 20, top: 12, fontSize: 28, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{label}</div>
      {children}
    </div>
  );
}

/** The toolkit strip at the bottom: «fallos que nadie conocía · zero-day», lands with `show` 0–1. */
export function ToolsStrip({ show }: { show: number }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: VIGNETTE.toolsH,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 20px',
        boxSizing: 'border-box',
        background: alpha(C.violetDeep, 0.55),
        borderTop: `2px solid ${alpha(C.violet, 0.6)}`,
        opacity: s,
        transform: `translateY(${(1 - s) * 20}px)`,
        fontSize: 30,
        fontWeight: 800,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="gear" size={28} color={C.violet} />
      {TOOLS}
    </div>
  );
}
