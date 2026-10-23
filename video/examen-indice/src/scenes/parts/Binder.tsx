import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/** Section-tab colours along the edge of the printed index (decoration only, not a code). */
export const TAB_COLORS = ['#fde047', C.cyanSoft, C.emerald, C.roseSoft, C.sky] as const;

/**
 * The printed, bound index seen from above: dark cover «ÍNDICE · GCTI», page-stack edges
 * for thickness, three binder rings on the spine and coloured section tabs sticking out of
 * the right edge. `w` is the cover width; the height follows (portrait). `glow` (0–1) lights
 * the cover edge; `tabs` (0–1) slides the tabs out one by one.
 */
export function Binder({
  w = 330,
  glow = 0,
  tabs = 1,
  rotate = 0,
  style,
}: {
  w?: number;
  glow?: number;
  tabs?: number;
  rotate?: number;
  style?: CSSProperties;
}) {
  const h = Math.round(w * 1.32);
  const spine = Math.round(w * 0.13);
  const tabW = Math.round(w * 0.11);
  const tabH = Math.round(h * 0.1);
  return (
    <div style={{ position: 'relative', width: w, height: h, transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}>
      {/* page stack: two offset sheets behind the cover */}
      {[10, 5].map((o) => (
        <div
          key={o}
          style={{
            position: 'absolute',
            left: o,
            top: o,
            width: w,
            height: h,
            borderRadius: 10,
            background: '#e9e2cd',
            border: `2px solid #cfc5aa`,
          }}
        />
      ))}
      {/* tabs */}
      {TAB_COLORS.map((c, i) => {
        const p = Math.max(0, Math.min(1, tabs * (TAB_COLORS.length + 1) - i));
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: w + 8 - tabW * (1 - p) - 4,
              top: Math.round(h * 0.1) + i * (tabH + 12),
              width: tabW + 10,
              height: tabH,
              borderRadius: '0 10px 10px 0',
              background: c,
              boxShadow: `0 6px 12px ${alpha('#000000', 0.4)}`,
              opacity: p,
            }}
          />
        );
      })}
      {/* cover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          background: `linear-gradient(160deg, ${C.ink700} 0%, ${C.ink850} 100%)`,
          border: `3px solid ${alpha(C.cyan, 0.35 + 0.55 * glow)}`,
          boxShadow: `0 22px 44px ${alpha('#000000', 0.55)}${glow > 0.02 ? `, 0 0 ${Math.round(30 + 50 * glow)}px ${alpha(C.cyan, 0.4 * glow)}` : ''}`,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: spine, height: '100%', background: alpha('#000000', 0.28), borderRight: `2px solid ${alpha('#000000', 0.4)}` }} />
        {[0.2, 0.5, 0.8].map((t) => (
          <div
            key={t}
            style={{
              position: 'absolute',
              left: spine / 2 - 13,
              top: h * t - 13,
              width: 26,
              height: 26,
              borderRadius: 13,
              background: 'radial-gradient(circle at 35% 30%, #f1f5f9 0%, #94a3b8 70%)',
              boxShadow: `0 3px 6px ${alpha('#000000', 0.5)}`,
            }}
          />
        ))}
        <div style={{ position: 'absolute', left: spine, right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.sans }}>
          <div style={{ width: w * 0.5, height: 3, background: alpha(C.cyan, 0.7), borderRadius: 2, marginBottom: Math.round(w * 0.07) }} />
          <div style={{ fontSize: Math.round(w * 0.2), fontWeight: 850, letterSpacing: -1, color: C.textStrong, lineHeight: 1 }}>ÍNDICE</div>
          <div style={{ marginTop: Math.round(w * 0.05), fontSize: Math.round(w * 0.12), fontWeight: 700, letterSpacing: 6, color: C.cyanSoft, fontFamily: FONT.mono }}>GCTI</div>
          <div style={{ width: w * 0.5, height: 3, background: alpha(C.cyan, 0.7), borderRadius: 2, marginTop: Math.round(w * 0.07) }} />
        </div>
      </div>
    </div>
  );
}
