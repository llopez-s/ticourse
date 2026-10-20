import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';

export const ADVERSARY = { name: 'RED MARROW', section: 'sección 2', line: 'vive de engañar' } as const;

/** A fishing hook (the lure): RED MARROW lives off deceiving. */
export function Hook({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }} aria-hidden>
      <circle cx={30} cy={7} r={3.5} />
      <path d="M30 10.5 V30 Q30 40 21 40 Q12 40 12 31 V27" />
      <path d="M12 27 L7 32 M12 27 L17 32" />
    </svg>
  );
}

/**
 * RED MARROW's tag (s01-03, first appearance in course order): a label, never a portrait. A fishing hook in a round
 * rose badge, «RED MARROW · sección 2» on one line and «vive de engañar» below. No gender mark. `glow` 0–1 brightens
 * it when the voice says «engañar».
 */
export function AdversaryTag({ glow = 0 }: { glow?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 26,
        padding: '20px 36px 20px 24px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.roseDeep, 0.9)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 0 ${Math.round(28 + 22 * glow)}px ${alpha(C.rose, 0.2 + 0.2 * glow)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 96,
          height: 96,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${alpha(C.rose, 0.8)}`,
          background: alpha(C.roseDeep, 0.85),
        }}
      >
        <Hook size={60} color={C.roseSoft} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, letterSpacing: 1, color: C.roseSoft }}>{ADVERSARY.name}</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: C.faint }}>·</span>
          <span style={{ fontSize: 34, fontWeight: 750, color: C.text }}>{ADVERSARY.section}</span>
        </div>
        <div style={{ fontSize: 36, fontWeight: 650, color: C.text }}>{ADVERSARY.line}</div>
      </div>
    </div>
  );
}
