import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { dimStyle } from '../../../../engine/src/ui';
import { TABLE, TABLE_HEAD } from '../../data/niveles';

/**
 * The lesson's table (Nivel · Audiencia · Pregunta típica · Productos · Horizonte), filled row by row.
 * Stage-local geometry, shared with the threads that join each row to its vignette.
 */
export const TBL = { x: 56, w: 1672, headerY: 250, headerH: 38, rowY0: 294, rowH: 92, rowGap: 6 } as const;
export const COLS = [236, 292, 420, 462, 262] as const;

export function rowCenterY(i: number): number {
  return TBL.rowY0 + i * (TBL.rowH + TBL.rowGap) + TBL.rowH / 2;
}

export function colX(i: number): number {
  return COLS.slice(0, i).reduce((a, b) => a + b, 0);
}

const CELL = ['level', 'audience', 'question', 'products', 'horizon'] as const;

export function LevelTable({
  frame,
  slotAt,
  cellAt,
  glow,
  dim,
  colLit,
}: {
  frame: number;
  /** Frame each row's frame lights (the empty row, still without text). */
  slotAt: readonly number[];
  /** Per row, the frame each of its five cells appears. */
  cellAt: readonly (readonly number[])[];
  /** Per row, 0–1 glow of the row the voice is on. */
  glow: readonly number[];
  /** Per row, 0–1 step-back. */
  dim: readonly number[];
  /** Per column, 0–1 highlight (the lens). */
  colLit: readonly number[];
}) {
  const tableBottom = TBL.rowY0 + 3 * TBL.rowH + 2 * TBL.rowGap;
  return (
    <div style={{ position: 'absolute', left: TBL.x, top: 0, width: TBL.w, height: tableBottom, fontFamily: FONT.sans }}>
      {/* Header */}
      <div style={{ position: 'absolute', left: 0, top: TBL.headerY, width: TBL.w, height: TBL.headerH, display: 'grid', gridTemplateColumns: COLS.map((c) => `${c}px`).join(' ') }}>
        {TABLE_HEAD.map((h, i) => (
          <div
            key={h}
            style={{
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: colLit[i] > 0.4 ? C.textStrong : C.faint,
              whiteSpace: 'nowrap',
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      {TABLE.map((row, r) => {
        const top = TBL.rowY0 + r * (TBL.rowH + TBL.rowGap);
        const lit = progress(frame, slotAt[r], 12);
        const g = glow[r];
        const values = [row.level, row.audience, row.question, row.products, row.horizon] as const;
        return (
          <div key={row.level} style={{ position: 'absolute', left: 0, top, width: TBL.w, height: TBL.rowH }}>
            {lit < 1 ? <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: `2px dashed ${C.ink600}`, opacity: 1 - lit }} /> : null}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                boxSizing: 'border-box',
                borderRadius: 20,
                border: `${g > 0.3 ? 3 : 2}px solid ${alpha(row.tone, 0.18 + 0.7 * g)}`,
                background: `linear-gradient(90deg, ${alpha(row.tone, 0.06 + 0.1 * g)} 0%, ${alpha(C.ink900, 0.94)} 40%)`,
                boxShadow: g > 0.02 ? `0 0 ${Math.round(30 * g)}px ${alpha(row.tone, 0.24 * g)}` : undefined,
                display: 'grid',
                gridTemplateColumns: COLS.map((c) => `${c}px`).join(' '),
                alignItems: 'center',
                ...dimStyle(dim[r], lit),
              }}
            >
              {CELL.map((k, c) => {
                const p = progress(frame, cellAt[r][c], 12);
                return (
                  <div
                    key={k}
                    style={{
                      padding: '0 16px',
                      opacity: p,
                      transform: `translateX(${(1 - p) * 14}px)`,
                      fontSize: c === 0 ? 36 : 26,
                      fontWeight: c === 0 ? 850 : 620,
                      lineHeight: 1.2,
                      letterSpacing: c === 0 ? -0.5 : 0,
                      color: c === 0 ? row.tone : C.text,
                    }}
                  >
                    {values[c]}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Column highlights (the lens) */}
      {colLit.map((v, c) =>
        v > 0.01 ? (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: colX(c) + 4,
              top: TBL.headerY - 2,
              width: COLS[c] - 8,
              height: tableBottom - TBL.headerY + 4,
              boxSizing: 'border-box',
              borderRadius: 16,
              border: `3px solid ${alpha(C.textStrong, 0.55 * v)}`,
              background: alpha(C.textStrong, 0.07 * v),
              boxShadow: `0 0 ${Math.round(26 * v)}px ${alpha(C.textStrong, 0.18 * v)}`,
              pointerEvents: 'none',
            }}
          />
        ) : null,
      )}
    </div>
  );
}
