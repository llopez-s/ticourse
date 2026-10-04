import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { CRANE_CARD } from '../../../data/s03-supuestos';

/**
 * PAPER CRANE (s03 first appearance, s10 end card): a folded-paper crane drawn as flat
 * facets, and its card «PAPER CRANE · célula de engaño · siembra pistas falsas» (rose:
 * the adversary). The card only repeats what the section already says
 * (src/data/course-gcti.ts:74-76): nothing about what it planted.
 */

/** An origami crane in profile (facing left), flat rose facets. 64-unit viewBox. */
export function CraneGlyph({ size = 120, color = C.rose, style }: { size?: number; color?: string; style?: CSSProperties }) {
  const light = alpha(color, 0.55);
  const mid = alpha(color, 0.32);
  const dark = alpha(color, 0.18);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ display: 'block', overflow: 'visible', ...style }} aria-hidden>
      {/* Back wing */}
      <path d="M33 33 L40 7 L44 33 Z" fill={dark} stroke={color} strokeWidth={1.6} />
      {/* Tail, up to the right */}
      <path d="M40 38 L60 17 L58 16 L36 35 Z" fill={mid} stroke={color} strokeWidth={1.6} />
      {/* Body: a flat diamond */}
      <path d="M16 38 L32 30 L50 38 L32 46 Z" fill={mid} stroke={color} strokeWidth={1.8} />
      <path d="M16 38 L50 38" stroke={alpha(color, 0.7)} strokeWidth={1.2} />
      {/* Front wing, folded up */}
      <path d="M24 35 L30 4 L40 34 Z" fill={light} stroke={color} strokeWidth={1.8} />
      {/* Neck up to the left, head bent down */}
      <path d="M24 37 L8 15 L10 14 L28 35 Z" fill={mid} stroke={color} strokeWidth={1.6} />
      <path d="M8 15 L3 21 L10 17 Z" fill={color} stroke={color} strokeWidth={1.4} />
    </svg>
  );
}

/**
 * CraneCard — props: `width` (default 1040), `highlight` (0–1: «siembra pistas falsas»
 * lights up while the voice says it), `glow` (0–1 rose halo), `style`. Height ≈ width × 0.19.
 */
export function CraneCard({ width = 1040, highlight = 0, glow = 0, style }: { width?: number; highlight?: number; glow?: number; style?: CSSProperties }) {
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
          <CraneGlyph size={118} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 56, fontWeight: 800, letterSpacing: 4, color: C.roseSoft, lineHeight: 1 }}>{CRANE_CARD.name}</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>
            {CRANE_CARD.role}
            <span style={{ color: C.faint, margin: '0 14px' }}>·</span>
            <span
              style={{
                position: 'relative',
                color: h > 0.5 ? '#ffe4e6' : C.text,
                textShadow: h > 0.01 ? `0 0 ${Math.round(20 * h)}px ${alpha(C.rose, 0.7 * h)}` : undefined,
              }}
            >
              {CRANE_CARD.does}
              <span style={{ position: 'absolute', left: 0, bottom: -8, height: 5, width: `${h * 100}%`, borderRadius: 3, background: C.rose }} />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
