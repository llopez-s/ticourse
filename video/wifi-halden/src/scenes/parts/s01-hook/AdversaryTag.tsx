import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { ADVERSARY } from '../../../data/s01-hook';

/**
 * SILENT PAGER's tag (s01-03): a label, never a portrait, and its only drawing in the video. A
 * silenced bell (a bell crossed by a diagonal stroke) in a round badge, the name with its section
 * on one line and what it counts on below. Rose, the adversary's colour. It owns no device, no
 * antenna and no place: nothing else on screen belongs to it. Width follows its content
 * (≈ 600 px at the default sizes); nothing positions itself.
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
        <SilentMark size={48} color={C.roseSoft} />
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

/** The silenced bell: a bell, its clapper, and a diagonal stroke that runs past it at both ends. */
export function SilentMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }} aria-hidden>
      <path d="M24 8.5c-5.8 0-9.5 4.3-9.5 10.2v6.6L10.5 32h27l-4-6.7v-6.6c0-5.9-3.7-10.2-9.500-10.2Z" />
      <path d="M20 37a4 4 0 0 0 8 0" />
      <path d="M40.500 6.500 L7.500 41.500" />
    </svg>
  );
}
