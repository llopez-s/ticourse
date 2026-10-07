import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { ADVERSARY } from '../../../data/s01-hook';

/**
 * BLIND ARCHITECT's tag (s01-05): a label, never a portrait — an eye-off
 * badge, the name with its section on one line and what it lives on below.
 * Rose (the adversary's colour), no gender mark. Width follows its content
 * (≈ 640 px at the default sizes); nothing positions itself.
 */
export function AdversaryTag({ glow = 0 }: { glow?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 14,
        padding: '24px 30px 26px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.rose, 0.14)} 0%, ${alpha(C.ink900, 0.94)} 100%)`,
        boxShadow: `0 0 ${Math.round(28 + 22 * glow)}px ${alpha(C.rose, 0.2 + 0.2 * glow)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${alpha(C.rose, 0.8)}`,
          background: alpha(C.roseDeep, 0.8),
        }}
      >
        <Icon name="eyeOff" size={42} color={C.roseSoft} strokeWidth={2.2} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, letterSpacing: 1, color: C.roseSoft }}>{ADVERSARY.name}</span>
        <span style={{ fontSize: 34, fontWeight: 700, color: C.faint }}>·</span>
        <span style={{ fontSize: 34, fontWeight: 750, color: C.text }}>{ADVERSARY.section}</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 650, color: C.text }}>{ADVERSARY.line}</div>
    </div>
  );
}
