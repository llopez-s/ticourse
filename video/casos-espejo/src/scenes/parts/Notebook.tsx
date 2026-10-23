import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';

/**
 * The group's notebook (s02 and rule 1 of s11): a spiral-bound cover with its label, optional
 * bookmark tabs («campaña») sticking out of the right edge, one per campaign the group went through.
 * `tabs` is the fractional number of tabs shown so far; children print on the cover.
 */
export function Notebook({
  w,
  h,
  label = 'cuaderno del grupo',
  labelSize = 36,
  tabs = 0,
  tabLabel = 'campaña',
  tabSize = 26,
  glow = 0,
  children,
}: {
  w: number;
  h: number;
  label?: string;
  labelSize?: number;
  tabs?: number;
  tabLabel?: string;
  tabSize?: number;
  glow?: number;
  children?: ReactNode;
}) {
  const rings = Math.max(4, Math.floor(h / 56));
  const tabH = Math.min(60, Math.round(h / 5));
  return (
    <div style={{ position: 'relative', width: w, height: h, fontFamily: FONT.sans }}>
      {[0, 1, 2].map((i) => {
        const p = progress(tabs, i, 1, (t) => t);
        if (p <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: w - 8,
              top: 36 + i * (tabH + 16),
              width: 150 * p,
              height: tabH,
              boxSizing: 'border-box',
              overflow: 'hidden',
              borderRadius: '0 14px 14px 0',
              border: `3px solid ${alpha(C.amber, 0.8)}`,
              borderLeft: 'none',
              background: alpha(C.amber, 0.18),
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 24,
              fontSize: tabSize,
              fontWeight: 750,
              color: '#fde68a',
              whiteSpace: 'nowrap',
            }}
          >
            {tabLabel}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: 22,
          border: `3px solid ${alpha(C.cyan, 0.6 + 0.4 * glow)}`,
          background: `linear-gradient(180deg, ${alpha(C.cyan, 0.14)} 0%, ${C.ink900} 80%)`,
          boxShadow: glow > 0 ? `0 0 ${Math.round(38 * glow)}px ${alpha(C.cyan, 0.4 * glow)}` : `0 24px 50px ${alpha('#000000', 0.35)}`,
          padding: '26px 30px 26px 84px',
        }}
      >
        <div style={{ fontSize: labelSize, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>{label}</div>
        {children}
      </div>
      {/* the spiral */}
      <div style={{ position: 'absolute', left: 22, top: 26, bottom: 26, width: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {Array.from({ length: rings }).map((_, i) => (
          <div key={i} style={{ width: 52, height: 14, marginLeft: -6, borderRadius: 7, background: C.ink600, border: `2px solid ${C.ink500}` }} />
        ))}
      </div>
    </div>
  );
}
