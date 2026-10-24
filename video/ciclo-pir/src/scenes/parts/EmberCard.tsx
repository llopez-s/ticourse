import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { EMBER } from '../../data/canon';
import { FoxGlyph } from './Glyphs';

/**
 * EMBER FOX's card, «EMBER FOX · célula de acceso inicial · spearphishing» (course-gcti.ts:17-19) — the section's
 * adversary, rose. It only repeats what the section already says: no templates, no dossier. `highlight` lights
 * «spearphishing» while the voice names it; `glow` is a rose halo. Height ≈ width × 0.19.
 */
export function EmberCard({ width = 1040, highlight = 0, glow = 0, style }: { width?: number; highlight?: number; glow?: number; style?: CSSProperties }) {
  const s = width / 1040;
  const h = clamp01(highlight);
  const g = clamp01(glow);
  return (
    <div style={{ position: 'relative', width, height: 196 * s, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1040,
          height: 196,
          transform: `scale(${s})`,
          transformOrigin: '0 0',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          padding: '0 40px 0 30px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.rose, 0.75 + 0.25 * g)}`,
          background: `linear-gradient(100deg, ${alpha(C.roseDeep, 0.95)} 0%, ${alpha(C.ink900, 0.96)} 62%)`,
          boxShadow: `0 24px 56px ${alpha('#000000', 0.45)}${g > 0.01 ? `, 0 0 ${Math.round(46 * g)}px ${alpha(C.rose, 0.35 * g)}` : ''}`,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ flexShrink: 0, width: 150, height: 150, borderRadius: 75, display: 'grid', placeItems: 'center', background: alpha(C.rose, 0.1), border: `2px solid ${alpha(C.rose, 0.5)}` }}>
          <FoxGlyph size={112} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 56, fontWeight: 800, letterSpacing: 4, color: C.roseSoft, lineHeight: 1 }}>{EMBER.name}</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>
            {EMBER.role}
            <span style={{ color: C.faint, margin: '0 14px' }}>·</span>
            <span style={{ position: 'relative', color: h > 0.5 ? '#ffe4e6' : C.text, textShadow: h > 0.01 ? `0 0 ${Math.round(20 * h)}px ${alpha(C.rose, 0.7 * h)}` : undefined }}>
              {EMBER.does}
              <span style={{ position: 'absolute', left: 0, bottom: -8, height: 5, width: `${h * 100}%`, borderRadius: 3, background: C.rose }} />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
