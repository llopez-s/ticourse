import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { QUALIFIERS, type Qualifier, type QualifierId } from '../../data/qualifiers';

/**
 * A qualifier as a card: the exam's English term big, the Spanish word under it («BEST» / «MEJOR»). Used by s04's row of
 * four; reuse it anywhere the four are shown together. `on` 0–1 = how much the voice is on it (border and glow);
 * violet = exam word, rose = «LEAST» (the question goes the other way).
 */
export function QualifierChip({ q, on = 0, w = 402, h = 132, enTone }: { q: Qualifier | QualifierId; on?: number; w?: number; h?: number; enTone?: string }) {
  const qual = typeof q === 'string' ? QUALIFIERS[q] : q;
  const tone = qual.tone === 'rose' ? C.rose : C.violet;
  const o = clamp01(on);
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.45 + 0.5 * o)}`,
        background: alpha(tone, 0.1 + 0.22 * o),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(34 * o)}px ${alpha(tone, 0.4 * o)}` : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 58, fontWeight: 900, letterSpacing: -1, lineHeight: '64px', color: enTone ?? C.textStrong }}>{qual.en}</span>
      <span style={{ fontSize: 38, fontWeight: 700, lineHeight: '44px', color: qual.tone === 'rose' ? C.roseSoft : '#c4b5fd' }}>{qual.es}</span>
    </div>
  );
}
