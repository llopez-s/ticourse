import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { S04_HEADERS, S04_ROWS, type Piece } from '../../../data/s04-binario';

const VIOLET_SOFT = '#c4b5fd';
const SOFT = { amber: '#fcd34d', emerald: '#6ee7b7' } as const;

/** Column widths, header height, row heights (one / two lines) and the gap between rows, px. */
export const TABLE = { cols: [650, 310, 310], head: 34, one: 44, two: 78, gap: 2, size: 32 } as const;
export const TABLE_W = TABLE.cols[0] + TABLE.cols[1] + TABLE.cols[2];

const tall = (i: number) => S04_ROWS[i].evidence.length > 1 || S04_ROWS[i].forgeable.length > 1 || !!S04_ROWS[i].note;
const rowH = (i: number) => (tall(i) ? TABLE.two : TABLE.one);
/** Top of row `i` (px from the table's top) — rowTop(S04_ROWS.length) is the table's height. */
export function rowTop(i: number): number {
  let y = TABLE.head;
  for (let k = 0; k < i; k++) y += rowH(k) + TABLE.gap;
  return y;
}
export const TABLE_H = rowTop(S04_ROWS.length) - TABLE.gap;

function pieces(line: readonly Piece[]) {
  return line.map((p) => (
    <span key={p.t} style={p.term ? { color: VIOLET_SOFT } : undefined}>
      {p.t}
    </span>
  ));
}

/**
 * The lesson's table (evidencia · falsificable · peso para atribuir), filled row by row.
 *   head       0–1 the header line
 *   rows[i]    0–1 row i slides in
 *   forge[i]   0–1 glow on its «falsificable» cell · weigh[i] 0–1 glow on its weight cell
 *   dim[i]     0–1 the row steps back
 *   ghost      0–1 the empty outline of the rows still to be written (the table's skeleton)
 * Cheap rows are amber, costly rows emerald; exam terms inside a cell are violet.
 */
export function EvidenceTable({ head = 1, rows, forge = [], weigh = [], dim = [], ghost = 0 }: { head?: number; ghost?: number; rows: readonly number[]; forge?: readonly number[]; weigh?: readonly number[]; dim?: readonly number[] }) {
  const cell = { boxSizing: 'border-box' as const, display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', height: '100%', whiteSpace: 'nowrap' as const };
  return (
    <div style={{ position: 'relative', width: TABLE_W, height: TABLE_H, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 0, height: TABLE.head - 6, width: TABLE_W, display: 'flex', alignItems: 'center', borderBottom: `2px solid ${alpha(C.faint, 0.6)}`, fontSize: 25, fontWeight: 750, letterSpacing: 0.6, color: C.muted, opacity: head }}>
        {S04_HEADERS.map((h, k) => (
          <div key={h} style={{ width: TABLE.cols[k], boxSizing: 'border-box', paddingLeft: k === 0 ? 24 : 16, whiteSpace: 'nowrap' }}>
            {h}
          </div>
        ))}
      </div>
      {S04_ROWS.map((r, i) => {
        const show = rows[i] ?? 0;
        if (show <= 0.001) return ghost > 0.001 ? <div key={i} style={{ position: 'absolute', left: 0, top: rowTop(i), width: TABLE_W, height: rowH(i), boxSizing: 'border-box', borderRadius: 8, border: `2px dashed ${alpha(C.faint, 0.55)}`, opacity: ghost }} /> : null;
        const tone = r.costly ? C.emerald : C.amber;
        const soft = r.costly ? SOFT.emerald : SOFT.amber;
        const f = forge[i] ?? 0;
        const w = weigh[i] ?? 0;
        const d = dim[i] ?? 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: rowTop(i),
              width: TABLE_W,
              height: rowH(i),
              boxSizing: 'border-box',
              display: 'flex',
              borderLeft: `6px solid ${alpha(tone, 0.9)}`,
              borderRadius: 8,
              background: `linear-gradient(90deg, ${alpha(tone, 0.14)} 0%, ${alpha(tone, 0.06)} 100%), ${C.ink900}`,
              fontSize: TABLE.size,
              lineHeight: 1.12,
              opacity: show * (1 - 0.5 * d),
              transform: `translateX(${(1 - show) * -18}px)`,
            }}
          >
            <div style={{ ...cell, width: TABLE.cols[0] - 6, paddingLeft: 18, fontWeight: 750, letterSpacing: -0.3, color: C.textStrong }}>
              {r.evidence.map((line, k) => (
                <div key={k}>{pieces(line)}</div>
              ))}
            </div>
            <div style={{ ...cell, width: TABLE.cols[1], paddingLeft: 16, fontWeight: 750, color: soft, textShadow: f > 0.02 ? `0 0 ${Math.round(18 * f)}px ${alpha(tone, 0.8 * f)}` : undefined }}>
              {r.forgeable.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
            <div style={{ ...cell, width: TABLE.cols[2], paddingLeft: 16, fontWeight: 900, color: soft, textShadow: w > 0.02 ? `0 0 ${Math.round(18 * w)}px ${alpha(tone, 0.8 * w)}` : undefined }}>
              <div>{r.weight}</div>
              {r.note ? <div style={{ marginTop: 1, fontSize: 26, fontWeight: 700, letterSpacing: -0.3, color: C.text }}>{pieces(r.note)}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
