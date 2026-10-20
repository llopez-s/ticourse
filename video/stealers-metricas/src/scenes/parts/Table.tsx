import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';

export interface TCol {
  label: string;
  sub?: string;
  w: number;
  /** Frame at which the column's values (and its header, unless `ghost`) come in. */
  at: number;
  /** The header is visible (dimmed) before `at`. */
  ghost?: boolean;
  /** Left-aligned running text instead of a centred figure. */
  text?: boolean;
  /** Row index drawn as the column's leader, and the frame it lights. */
  win?: number;
  winAt?: number;
  /** 0–1: steps the whole column back. */
  dim?: number;
}

export interface TRow {
  name: string;
  color: string;
  cells: ReactNode[];
  /** 0–1 glow of the whole row. */
  lit?: number;
  /** 0–1: steps the row back. */
  dim?: number;
}

/**
 * A small hand-drawn table: one row per family, the family name as first column and a header row above.
 * Everything is absolutely positioned so columns can arrive one by one without reflowing.
 */
export function DataTable({
  frame,
  cols,
  rows,
  nameW = 210,
  headH = 84,
  rowH = 84,
  gap = 10,
  valueSize = 46,
  textSize = 30,
  at = 0,
}: {
  frame: number;
  cols: TCol[];
  rows: TRow[];
  nameW?: number;
  headH?: number;
  rowH?: number;
  gap?: number;
  valueSize?: number;
  textSize?: number;
  at?: number;
}) {
  const width = nameW + cols.reduce((s, c) => s + c.w, 0);
  const height = headH + gap + rows.length * (rowH + gap) - gap;
  const colX = (i: number) => nameW + cols.slice(0, i).reduce((s, c) => s + c.w, 0);
  const tp = progress(frame, at, 16);
  return (
    <div style={{ position: 'relative', width, height, opacity: tp, fontFamily: FONT.sans }}>
      {cols.map((c, i) => {
        const p = progress(frame, c.at, 14);
        const op = (c.ghost ? 0.3 + 0.7 * p : p) * (1 - 0.65 * (c.dim ?? 0));
        return (
          <div key={c.label} style={{ position: 'absolute', left: colX(i), top: 0, width: c.w, height: headH, boxSizing: 'border-box', padding: '0 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: c.text ? 'flex-start' : 'center', textAlign: c.text ? 'left' : 'center', opacity: op }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: C.textStrong, lineHeight: 1.12 }}>{c.label}</div>
            {c.sub ? <div style={{ marginTop: 2, fontSize: 26, fontWeight: 560, color: C.muted, lineHeight: 1.1 }}>{c.sub}</div> : null}
          </div>
        );
      })}
      {rows.map((r, ri) => {
        const y = headH + gap + ri * (rowH + gap);
        const lit = r.lit ?? 0;
        return (
          <div key={r.name} style={{ position: 'absolute', left: 0, top: y, width, height: rowH, opacity: 1 - 0.6 * (r.dim ?? 0) }}>
            <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: RADIUS.md, background: lit > 0 ? alpha(r.color, 0.1) : C.ink850, border: `2px solid ${alpha(r.color, 0.3 + 0.55 * lit)}`, boxShadow: lit > 0 ? `0 0 ${18 + 24 * lit}px ${alpha(r.color, 0.3 * lit)}` : 'none' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, width: nameW, height: rowH, display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 24 }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: r.color, flexShrink: 0 }} />
              <span style={{ fontSize: 40, fontWeight: 800, color: C.textStrong }}>{r.name}</span>
            </div>
            {cols.map((c, ci) => {
              const p = progress(frame, c.at + 4, 14);
              const w = c.win === ri && c.winAt !== undefined ? progress(frame, c.winAt, 14) : 0;
              const colDim = 1 - 0.65 * (c.dim ?? 0);
              return (
                <div key={c.label} style={{ position: 'absolute', left: colX(ci) + 6, top: 6, width: c.w - 12, height: rowH - 12, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: c.text ? 'flex-start' : 'center', padding: c.text ? '0 14px' : 0, borderRadius: RADIUS.sm, opacity: p * colDim, background: w > 0 ? alpha(C.cyan, 0.16 * w) : 'transparent', border: `2px solid ${w > 0 ? alpha(C.cyan, 0.9 * w) : 'transparent'}`, boxShadow: w > 0 ? `0 0 ${14 * w}px ${alpha(C.cyan, 0.3 * w)}` : 'none', fontSize: c.text ? textSize : valueSize, fontWeight: c.text ? 600 : 800, lineHeight: 1.15, color: w > 0 ? C.textStrong : c.text ? C.text : '#cbd5e1', letterSpacing: c.text ? 0 : -0.5 }}>
                  {r.cells[ci]}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export const tableWidth = (cols: TCol[], nameW = 210) => nameW + cols.reduce((s, c) => s + c.w, 0);
