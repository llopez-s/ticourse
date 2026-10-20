import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { STORE } from '../../../data/s06-bolsillo';

export const STORE_W = 330;
export const STORE_H = 170;

/**
 * The official store as a badge (never a shopfront): a rounded tile with a shopping-bag glyph, «tienda oficial» and
 * an emerald «revisión» check — the review every app passes on the official way in. `dim` 0–1 greys it.
 */
export function StoreBadge({ dim = 0 }: { dim?: number }) {
  return (
    <div
      style={{
        width: STORE_W,
        height: STORE_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.65)}`,
        background: alpha(C.cyan, 0.07),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        fontFamily: FONT.sans,
        opacity: 1 - 0.5 * dim,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
          <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
        </svg>
        <span style={{ fontSize: 36, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{STORE.name}</span>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 16px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.emerald, 0.7)}`, background: alpha(C.emerald, 0.1) }}>
        <Icon name="check" size={28} color={C.emerald} />
        <span style={{ fontSize: 30, fontWeight: 800, color: '#6ee7b7' }}>{STORE.review}</span>
      </div>
    </div>
  );
}
