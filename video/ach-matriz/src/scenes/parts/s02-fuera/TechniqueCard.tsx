import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { TECHNIQUES, type TechniqueId } from '../../../data/s02-fuera';
import { GridIcon, ListQuestionIcon } from '../PromiseIcons';

/**
 * One structured-analytic-technique card («ficha»), the same drawing in s02 (five on the
 * STRUCTURED ANALYTIC TECHNIQUES sheet) and s04 (the three this video uses, numbered).
 * An index card: off-white paper, navy ink, an icon, the technique's name, an optional
 * number badge. Key Assumptions Check reuses the promise's list-with-question icon and
 * ACH the grid, so the images agree with s01 and s10.
 *
 * Props: `id`, `width` (px), `height` (default 84), `fontSize` (default 40), `number?`
 * (badge 1–3), `lit` (0–1 cyan glow + cyan accent bar), `style`. Dim it from outside
 * (dimStyle) — it has no dim of its own.
 */

const CARD = '#fffaf0';
const EDGE = '#d9c9a3';
const INK = '#1e293b';
const NAVY = '#1e3a8a';
const ASK = '#b45309';

export function TechniqueGlyph({ id, size, color = NAVY }: { id: TechniqueId; size: number; color?: string }) {
  if (id === 'kac') return <ListQuestionIcon size={size} color={color} accent={ASK} strokeWidth={4} />;
  if (id === 'ach') return <GridIcon size={size} color={color} strokeWidth={4} />;
  return <Icon name={id === 'devil' ? 'users' : id === 'whatif' ? 'split' : 'brain'} size={size} color={color} strokeWidth={2.2} />;
}

export function techniqueName(id: TechniqueId): string {
  return TECHNIQUES.find((t) => t.id === id)!.name;
}

export function TechniqueCard({
  id,
  width,
  height = 84,
  fontSize = 40,
  number,
  lit = 0,
  style,
}: {
  id: TechniqueId;
  width: number;
  height?: number;
  fontSize?: number;
  number?: number;
  lit?: number;
  style?: CSSProperties;
}) {
  const g = clamp01(lit);
  const glyph = Math.round(height * 0.62);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: Math.round(height * 0.22),
        padding: `0 ${Math.round(height * 0.32)}px 0 ${Math.round(height * 0.3)}px`,
        borderRadius: 12,
        background: CARD,
        border: `2px solid ${g > 0.05 ? alpha(C.cyanDeep, 0.5 + 0.5 * g) : EDGE}`,
        boxShadow: `0 10px 22px ${alpha('#000000', 0.28)}${g > 0.01 ? `, 0 0 ${Math.round(34 * g)}px ${alpha(C.cyan, 0.55 * g)}` : ''}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Accent bar on the left edge: navy, cyan when lit */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: g > 0.05 ? C.cyanDeep : alpha(NAVY, 0.55) }} />
      {number !== undefined ? (
        <div
          style={{
            flexShrink: 0,
            width: Math.round(height * 0.56),
            height: Math.round(height * 0.56),
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: g > 0.05 ? C.cyanDeep : NAVY,
            color: '#ffffff',
            fontSize: Math.round(height * 0.34),
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {number}
        </div>
      ) : null}
      <div style={{ flexShrink: 0, width: glyph, height: glyph, display: 'grid', placeItems: 'center' }}>
        <TechniqueGlyph id={id} size={glyph} color={g > 0.05 ? C.cyanDeep : NAVY} />
      </div>
      <span style={{ fontSize, fontWeight: 800, color: INK, whiteSpace: 'nowrap', letterSpacing: -0.3, lineHeight: 1 }}>{techniqueName(id)}</span>
    </div>
  );
}
