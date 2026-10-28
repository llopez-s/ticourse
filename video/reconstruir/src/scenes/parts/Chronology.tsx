import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { CHRONO, type ChronoRow } from './data';
import { SourceTag } from './Ruler';

/**
 * The chronology: five rows, three columns «UTC · hecho · fuente», one fact per row. Geometry is exported because
 * s07 draws SVG threads between the rows and s08 drops the rows into the «observado» column. Stage-local px.
 * Screen rule: each normalised hour carries its original, in grey, under it.
 */
export const CHRONO_GEO = {
  headH: 56,
  rowH: 96,
  gap: 6,
  width: 1728,
  cols: {
    utc: { x: 0, w: 350 },
    fact: { x: 362, w: 1000 },
    source: { x: 1376, w: 352 },
  },
} as const;

/** Top of row `i` (0–4) in the table's own coordinates (the table sits at the stage's x = 0). */
export function chronoRowTop(i: number): number {
  return CHRONO_GEO.headH + 10 + i * (CHRONO_GEO.rowH + CHRONO_GEO.gap);
}
export function chronoRowCenterY(i: number): number {
  return chronoRowTop(i) + CHRONO_GEO.rowH / 2;
}
export const CHRONO_BOTTOM = chronoRowTop(CHRONO.length - 1) + CHRONO_GEO.rowH;

const FACT_SIZE = 34;

/** One row. `on` 0–1 = it has arrived (slides in); `focus` / `dim` 0–1 = the voice is on it / on another. */
export function ChronoRowView({
  row,
  on = 1,
  focus = 0,
  dim = 0,
  noteOn = 1,
  width = CHRONO_GEO.width,
  style,
}: {
  row: ChronoRow;
  on?: number;
  focus?: number;
  dim?: number;
  /** 0–1: the grey remark under the fact («solo el nombre del archivo»). */
  noteOn?: number;
  width?: number;
  style?: CSSProperties;
}) {
  const f = clamp01(focus);
  const d = clamp01(dim);
  const o = clamp01(on);
  const { cols, rowH } = CHRONO_GEO;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: rowH,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.22 + 0.55 * f)}`,
        background: alpha(C.ink850, 0.96),
        boxShadow: f > 0.01 ? `0 0 ${16 + 22 * f}px ${alpha(C.cyan, 0.3 * f)}` : undefined,
        opacity: o * (1 - 0.55 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        transform: `translateX(${(1 - o) * -36}px)`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      {/* UTC (emerald: normalised) with the original in grey under it */}
      <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, width: cols.utc.w - 22, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 700, lineHeight: 1.1, color: C.emerald }}>{row.utc}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 500, lineHeight: 1.2, color: C.muted, marginTop: 2 }}>{row.original}</div>
      </div>
      {/* the fact */}
      <div style={{ position: 'absolute', left: cols.fact.x, top: 0, bottom: 0, width: cols.fact.w, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: FACT_SIZE, fontWeight: 600, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
          {row.fact.map((p, i) =>
            p.mono ? (
              <span key={i} style={{ fontFamily: FONT.mono, fontWeight: 650, fontSize: FACT_SIZE - 2, color: C.textStrong }}>
                {p.t}
              </span>
            ) : (
              <span key={i}>{p.t}</span>
            ),
          )}
        </div>
        {row.note ? (
          <div style={{ fontSize: 26, fontWeight: 500, color: C.muted, lineHeight: 1.2, marginTop: 2, opacity: clamp01(noteOn) }}>{row.note}</div>
        ) : null}
      </div>
      {/* the source */}
      <div style={{ position: 'absolute', left: cols.source.x, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
        <SourceTag id={row.source} size={30} />
      </div>
    </div>
  );
}

/** The header row: «UTC · hecho · fuente». */
export function ChronoHeader({ on = 1, style }: { on?: number; style?: CSSProperties }) {
  const { cols, headH } = CHRONO_GEO;
  const cell = (x: number, text: string): ReactNode => (
    <div style={{ position: 'absolute', left: x, top: 0, height: headH, display: 'flex', alignItems: 'center', fontSize: 32, fontWeight: 800, letterSpacing: 1, color: C.cyanSoft }}>{text}</div>
  );
  return (
    <div style={{ position: 'relative', width: CHRONO_GEO.width, height: headH, opacity: clamp01(on), fontFamily: FONT.sans, borderBottom: `2px solid ${alpha(C.cyan, 0.4)}`, ...style }}>
      {cell(22, 'UTC')}
      {cell(cols.fact.x, 'hecho')}
      {cell(cols.source.x, 'fuente')}
    </div>
  );
}

/**
 * The whole table (header + five rows, absolutely placed rows). Per-row weights are arrays of 5 numbers. A row that
 * has not arrived shows a faint dashed slot, so the table's frame is there from the start.
 */
export function ChronoTable({
  on = [1, 1, 1, 1, 1],
  focus = [0, 0, 0, 0, 0],
  dim = [0, 0, 0, 0, 0],
  headOn = 1,
  noteOn = 1,
  rows = CHRONO,
  ghosts = true,
}: {
  on?: number[];
  focus?: number[];
  dim?: number[];
  headOn?: number;
  noteOn?: number;
  rows?: ChronoRow[];
  ghosts?: boolean;
}) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: CHRONO_GEO.width, height: CHRONO_BOTTOM }}>
      <ChronoHeader on={headOn} />
      {rows.map((row, i) => (
        <div key={row.id} style={{ position: 'absolute', left: 0, top: chronoRowTop(i) }}>
          {ghosts && (on[i] ?? 0) < 0.99 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                height: CHRONO_GEO.rowH,
                borderRadius: RADIUS.md,
                border: `2px dashed ${alpha(C.ink500, 0.7)}`,
                opacity: clamp01(headOn) * (1 - clamp01(on[i] ?? 0)),
              }}
            />
          ) : null}
          <ChronoRowView row={row} on={on[i] ?? 0} focus={focus[i] ?? 0} dim={dim[i] ?? 0} noteOn={noteOn} />
        </div>
      ))}
    </div>
  );
}
