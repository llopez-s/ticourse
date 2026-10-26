import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { CRANE_CARD } from '../../data/shared';

/** An origami crane in profile (facing left), flat rose facets. 64-unit viewBox (V9's glyph). */
export function CraneGlyph({ size = 64, color = C.rose }: { size?: number; color?: string }) {
  const light = alpha(color, 0.55);
  const mid = alpha(color, 0.32);
  const dark = alpha(color, 0.18);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      <path d="M33 33 L40 7 L44 33 Z" fill={dark} stroke={color} strokeWidth={1.6} />
      <path d="M40 38 L60 17 L58 16 L36 35 Z" fill={mid} stroke={color} strokeWidth={1.6} />
      <path d="M16 38 L32 30 L50 38 L32 46 Z" fill={mid} stroke={color} strokeWidth={1.8} />
      <path d="M16 38 L50 38" stroke={alpha(color, 0.7)} strokeWidth={1.2} />
      <path d="M24 35 L30 4 L40 34 Z" fill={light} stroke={color} strokeWidth={1.8} />
      <path d="M24 37 L8 15 L10 14 L28 35 Z" fill={mid} stroke={color} strokeWidth={1.6} />
      <path d="M8 15 L3 21 L10 17 Z" fill={color} stroke={color} strokeWidth={1.4} />
    </svg>
  );
}

/**
 * PAPER CRANE's card, the compact one of V23: «PAPER CRANE · célula de engaño · siembra pistas falsas». Rose: the
 * adversary. It repeats what the section says (src/data/course-gcti.ts:74-76) and nothing about what it planted.
 * A normal-flow box `width` wide, 150 px tall; put it at the top right (x >= 1326), outside the engine's message.
 */
export function CraneCard({ width = 390, show = 1 }: { width?: number; show?: number }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px 16px 16px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(C.rose, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 70%), ${C.ink900}`,
        boxShadow: `0 0 30px ${alpha(C.rose, 0.2)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateX(${(1 - show) * 22}px)`,
      }}
    >
      <CraneGlyph size={72} />
      <div>
        <div style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, letterSpacing: 1, color: C.roseSoft }}>{CRANE_CARD.name}</div>
        <div style={{ marginTop: 4, fontSize: 30, fontWeight: 750, lineHeight: 1.2, color: C.text }}>{CRANE_CARD.role}</div>
        <div style={{ fontSize: 30, fontWeight: 850, lineHeight: 1.2, color: C.textStrong }}>{CRANE_CARD.does}</div>
      </div>
    </div>
  );
}
