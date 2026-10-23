import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/**
 * «Ficha de lectura»: the book card of s02. A normal-flow box `width` px wide.
 *   one = 0   0–1: «saberlo no basta» (what the voice says)
 *   two = 0   0–1: «actúan antes de que te des cuenta» (the lesson's own line, on screen only)
 */
export function ReadingCard({ width, one = 0, two = 0, glow = 0 }: { width: number; one?: number; two?: number; glow?: number }) {
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '28px 40px 34px',
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${alpha(C.cyan, 0.4 + 0.4 * glow)}`,
        boxShadow: `0 22px 56px ${alpha('#000000', 0.45)}, 0 0 ${Math.round(30 * glow)}px ${alpha(C.cyan, 0.25 * glow)}`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="file" size={36} color={C.cyan} strokeWidth={2} />
        <span style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.cyanSoft }}>FICHA DE LECTURA</span>
      </div>
      <div style={{ marginTop: 18, fontSize: 64, fontWeight: 850, letterSpacing: -1.4, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap' }}>Richards Heuer</div>
      <div style={{ marginTop: 8, fontSize: 40, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.15, color: C.text, whiteSpace: 'nowrap' }}>Psychology of Intelligence Analysis</div>
      <div style={{ marginTop: 22, height: 2, background: C.ink700 }} />
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            fontSize: 56,
            fontWeight: 850,
            letterSpacing: -1,
            color: '#fcd34d',
            whiteSpace: 'nowrap',
            opacity: one,
            transform: `translateY(${(1 - one) * 12}px)`,
          }}
        >
          saberlo no basta
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: two,
            transform: `translateY(${(1 - two) * 12}px)`,
          }}
        >
          actúan antes de que te des cuenta
        </div>
      </div>
    </div>
  );
}
