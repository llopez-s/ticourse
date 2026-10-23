import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, Icon } from '../../../../engine/src/ui';
import { FOX_CARD, HYPOTHETICAL } from '../../data/niveles';

/**
 * EMBER FOX (G01–G03): a fox head in flat rose facets and its card «EMBER FOX · célula de acceso
 * inicial · spearphishing». The card only repeats the section's own words; it says nothing about
 * what the cell did (no templates, no target list, no «VC»).
 */
export function FoxGlyph({ size = 120, color = C.rose, style }: { size?: number; color?: string; style?: CSSProperties }) {
  const light = alpha(color, 0.55);
  const mid = alpha(color, 0.32);
  const dark = alpha(color, 0.18);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ display: 'block', overflow: 'visible', ...style }} aria-hidden>
      {/* ears */}
      <path d="M8 5 L27 22 L9 33 Z" fill={light} stroke={color} strokeWidth={1.8} />
      <path d="M56 5 L37 22 L55 33 Z" fill={light} stroke={color} strokeWidth={1.8} />
      {/* head */}
      <path d="M27 22 H37 L55 33 L32 58 L9 33 Z" fill={mid} stroke={color} strokeWidth={1.8} />
      {/* cheeks */}
      <path d="M9 33 L32 58 L22 40 Z" fill={dark} stroke={color} strokeWidth={1.4} />
      <path d="M55 33 L32 58 L42 40 Z" fill={dark} stroke={color} strokeWidth={1.4} />
      {/* eyes and nose */}
      <path d="M21 33 L28 36" stroke={C.textStrong} strokeWidth={2.4} />
      <path d="M43 33 L36 36" stroke={C.textStrong} strokeWidth={2.4} />
      <path d="M28 50 H36 L32 57 Z" fill={color} stroke={color} strokeWidth={1.2} />
    </svg>
  );
}

/** The card. Natural size 940×170; `width` scales it. */
export function FoxCard({ width = 940, glow = 0, style }: { width?: number; glow?: number; style?: CSSProperties }) {
  const s = width / 940;
  const g = clamp01(glow);
  return (
    <div style={{ position: 'relative', width, height: 170 * s, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 940,
          height: 170,
          transform: `scale(${s})`,
          transformOrigin: '0 0',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          padding: '0 34px 0 24px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.rose, 0.75 + 0.25 * g)}`,
          background: `linear-gradient(100deg, ${alpha(C.roseDeep, 0.95)} 0%, ${alpha(C.ink900, 0.96)} 62%)`,
          boxShadow: `0 24px 56px ${alpha('#000000', 0.45)}${g > 0.01 ? `, 0 0 ${Math.round(46 * g)}px ${alpha(C.rose, 0.35 * g)}` : ''}`,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ flexShrink: 0, width: 126, height: 126, borderRadius: 63, display: 'grid', placeItems: 'center', background: alpha(C.rose, 0.1), border: `2px solid ${alpha(C.rose, 0.5)}` }}>
          <FoxGlyph size={96} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 52, fontWeight: 800, letterSpacing: 4, color: C.roseSoft, lineHeight: 1 }}>{FOX_CARD.name}</span>
          <span style={{ fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>
            {FOX_CARD.role}
            <span style={{ color: C.faint, margin: '0 12px' }}>·</span>
            {FOX_CARD.does}
          </span>
        </div>
      </div>
    </div>
  );
}

/** «Ejemplo hipotético · no ha pasado en Meridian»: on screen for the whole scene. */
export function HypotheticalTag({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        height: 52,
        padding: '0 30px 0 20px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(C.amber, 0.9)}`,
        background: `linear-gradient(180deg, ${alpha(C.amber, 0.2)}, ${alpha(C.ink950, 0.92)})`,
        boxShadow: `0 0 28px ${alpha(C.amber, 0.22)}`,
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 800,
        color: '#fde68a',
        whiteSpace: 'nowrap',
        opacity,
      }}
    >
      <Icon name="alert" size={34} color={C.amber} strokeWidth={2.2} />
      {HYPOTHETICAL}
    </div>
  );
}
