import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/** The list's columns (s02 and s04 name them; nothing in the rows is legible). */
export const INVENTORY_COLUMNS = 'dueño · ubicación · clasificación · estado';

export const ROW_H = 50;
const TITLE_H = 66;
const HEAD_H = 46;

/** Height of a list with `rows` rows. */
export function inventoryHeight(rows: number): number {
  return TITLE_H + HEAD_H + rows * ROW_H + 18;
}

/** Stage-local y (relative to the list's top) of row `i`'s centre. */
export function inventoryRowY(i: number): number {
  return TITLE_H + HEAD_H + i * ROW_H + ROW_H / 2;
}

const GLYPHS: IconName[] = ['desktop', 'laptop', 'server', 'desktop', 'laptop', 'desktop', 'server', 'laptop'];
/** Deterministic bar widths (fractions of each column) so no two rows look alike. */
const BARS = [
  [0.8, 0.55, 0.7],
  [0.6, 0.75, 0.5],
  [0.7, 0.45, 0.8],
  [0.5, 0.65, 0.6],
  [0.75, 0.6, 0.45],
  [0.65, 0.5, 0.75],
  [0.55, 0.7, 0.65],
  [0.7, 0.6, 0.55],
];

/**
 * Sistemas' list (the inventory): a card with its title, the column line «dueño · ubicación · clasificación · estado»
 * and rows of grey bars, each with a device glyph and an emerald status dot. `shown` (0..rows, fractional) reveals the
 * rows one by one; `scan` (row index, fractional, or null) slides a cyan highlight down the rows, as if someone looked
 * for something in it. Nothing in a row is legible: the list is the image, not data.
 */
export function InventoryList({
  width,
  rows,
  title,
  shown = rows,
  scan = null,
  dim = 0,
  tone = C.cyan,
  columns = true,
  style,
}: {
  width: number;
  rows: number;
  title: string;
  shown?: number;
  scan?: number | null;
  dim?: number;
  tone?: string;
  /** Show the column line (off for small copies, where it would not fit). */
  columns?: boolean;
  style?: CSSProperties;
}) {
  const head = columns ? HEAD_H : 0;
  const h = inventoryHeight(rows) - HEAD_H + head;
  const colX = [64, 64 + (width - 120) * 0.34, 64 + (width - 120) * 0.66];
  const colW = (width - 120) * 0.28;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.6)}`,
        background: C.ink850,
        boxShadow: `0 18px 40px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        opacity: 1 - 0.6 * clamp01(dim),
        ...style,
      }}
    >
      <div
        style={{
          height: TITLE_H,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 22px',
          background: alpha(tone, 0.12),
          fontSize: 34,
          fontWeight: 800,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="file" size={34} color={tone} />
        {title}
      </div>
      {columns ? (
      <div style={{ height: HEAD_H, display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: 26, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', borderBottom: `2px solid ${C.ink700}` }}>
        {INVENTORY_COLUMNS}
      </div>
      ) : null}
      {scan !== null && scan >= 0 && scan <= rows ? (
        <div
          style={{
            position: 'absolute',
            left: 8,
            right: 8,
            top: TITLE_H + head + Math.min(rows - 1, scan) * ROW_H + 4,
            height: ROW_H - 8,
            borderRadius: 10,
            background: alpha(C.cyan, 0.16),
            border: `2px solid ${alpha(C.cyan, 0.6)}`,
          }}
        />
      ) : null}
      <svg width={width} height={rows * ROW_H} style={{ position: 'absolute', left: 0, top: TITLE_H + head }}>
        {Array.from({ length: rows }, (_, i) => {
          const o = clamp01(shown - i);
          if (o <= 0) return null;
          const y = i * ROW_H;
          const b = BARS[i % BARS.length];
          return (
            <g key={i} opacity={o} transform={`translate(${(1 - o) * -16} 0)`}>
              {i > 0 ? <line x1={18} y1={y} x2={width - 18} y2={y} stroke={alpha(C.ink700, 0.8)} strokeWidth={2} /> : null}
              {colX.map((x, k) => (
                <rect key={k} x={x} y={y + ROW_H / 2 - 7} width={colW * b[k]} height={14} rx={7} fill={alpha(C.text, 0.24)} />
              ))}
              <circle cx={width - 36} cy={y + ROW_H / 2} r={9} fill={alpha(C.emerald, 0.75)} />
            </g>
          );
        })}
      </svg>
      {Array.from({ length: rows }, (_, i) => {
        const o = clamp01(shown - i);
        if (o <= 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: 20, top: TITLE_H + head + i * ROW_H + (ROW_H - 30) / 2, opacity: o * 0.8 }}>
            <Icon name={GLYPHS[i % GLYPHS.length]} size={30} color={alpha(C.sky, 0.8)} />
          </div>
        );
      })}
    </div>
  );
}
