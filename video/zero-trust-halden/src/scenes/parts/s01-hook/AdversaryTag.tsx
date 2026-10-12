import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { ADVERSARY } from '../../../data/s01-hook';

/**
 * NULL CIPHER's tag (s01-03): a label, never a portrait. A «null» mark (a circle crossed by a
 * diagonal stroke that runs past it, like the empty-set sign) in a round badge, the name with
 * its section on one line and what it is below. Rose, the adversary's colour; no gender mark,
 * and never a door, a key, a badge or a certificate. Width follows its content (≈ 570 px at
 * the default sizes); nothing positions itself.
 */
export function AdversaryTag({ glow = 0 }: { glow?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 14,
        padding: '22px 30px 24px',
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
        <NullMark size={46} color={C.roseSoft} />
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

/** The «null» mark: a ring and a diagonal stroke through it that sticks out at both ends. */
export function NullMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" style={{ display: 'block' }} aria-hidden>
      <circle cx={24} cy={24} r={13} />
      <path d="M38.5 5.5 L9.5 42.5" />
    </svg>
  );
}
