import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { ADVERSARY } from '../../data/shared';

/** A sheet with a dashed gap in the middle of its text: the hole the adversary lives in. */
export function PaperGap({ size, color, glow = 0 }: { size: number; color: string; glow?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }} aria-hidden>
      <path d="M11 5 H30 L38 13 V43 H11 Z" />
      <path d="M30 5 V13 H38" />
      <path d="M17 19 H31" opacity={0.7} />
      <path d="M17 36 H31" opacity={0.7} />
      <rect x={16} y={24} width={16} height={8} rx={2} strokeDasharray="3 4" stroke={C.rose} strokeWidth={3} opacity={0.6 + 0.4 * glow} />
    </svg>
  );
}

/**
 * PAPER GOVERNOR's tag (s05-02, «Y vuelve…»): a label, never a portrait, in the form of V25/V26 — a sheet with a gap
 * torn in it in a round badge, the name with its section on one line and «vive en los huecos de tu gobernanza» below.
 * Rose, the adversary's colour. Width follows its content (≈ 860 px). `glow` 0–1 brightens it on the voice's «huecos».
 */
export function AdversaryTag({ glow = 0 }: { glow?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 26,
        padding: '22px 36px 22px 26px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.roseDeep, 0.9)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 0 ${Math.round(28 + 22 * glow)}px ${alpha(C.rose, 0.2 + 0.2 * glow)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ flexShrink: 0, width: 100, height: 100, borderRadius: 999, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(C.rose, 0.8)}`, background: alpha(C.roseDeep, 0.85) }}>
        <PaperGap size={62} color={C.roseSoft} glow={glow} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
