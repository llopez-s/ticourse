import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../../engine/src/theme/motion';
import { clamp01, tone as toneOf, windowWeight, type Tone } from '../../../../engine/src/ui';
import {
  COUNTS,
  EVIDENCE,
  EV_IDS,
  HYPOTHESES,
  HYP_IDS,
  MATRIX_TEXT,
  type CellId,
  type Diag,
  type EvId,
  type HypId,
  type Mark,
} from '../../data/matrix';

/**
 * Image «la matriz ACH» (s05–s08): exactly the lesson's extract (data/matrix.ts) —
 * title «Extracto de matriz ACH · VELVET CICADA (ficticio)», columns H1–H3,
 * rows E1–E4, twelve C / I / N cells, the legend, and, from s06 on, the
 * «Diagnosticidad» column (NULA grey, ALTA amber, E4 «strong link»), the
 * count rows (s07: «cuenta de C» 4 · 1 · 1 struck out, «Inconsistencias»
 * 0 · 3 · 2), H1's emerald frame «la menos inconsistente», and the s08
 * recount without E4 (0 · 2 · 1, tag «sin E4»).
 *
 * Layout props (`title`, `legend`, `diag`, `counts`) decide what the box
 * reserves room for; reveal props are frames relative to the Sequence. The
 * rule for every reveal prop: OMITTED → already in its final state (so
 * `<Matrix diag counts="CI" />` draws the finished s07 board, handy for the
 * poster); GIVEN → hidden until that frame. Use `matrixSize` / `matrixCellBox`
 * / `matrixRowBox` / `matrixColBox` (same options + width) to place things
 * around it. Drawn in design units and scaled to `width`: 1448 wide without
 * the diag column, 1698 with it; 652 tall with title + legend band, 600 with
 * the legend inline, +74 per count row (title + inline legend + both count
 * rows = 748; no title / legend + both count rows = 690). Cell letters are
 * 54 px and row labels 32 px at scale 1, so keep the scale ≥ ~0.9 when the
 * matrix is the subject. The winner tab (66) and `right` notes overhang the
 * box (see `matrixSize(...).overhang`).
 */

// ---------------------------------------------------------------------------
// Layout (design units)

const PAD = 14;
const LABEL_W = 580;
const HYP_W = 280;
const DIAG_W = 250;
const TITLE_H = 58;
const LEGEND_H = 52;
const HEADER_H = 118;
const ROW_H: Record<EvId, number> = { E1: 90, E2: 90, E3: 90, E4: 126 };
const COUNT_H = 74;
/** The winner tab hangs this far under the box. */
const WINNER_TAB_H = 66;
/** Width reserved to the right of the box for `right` notes / a strong-link tag without diag column. */
const RIGHT_NOTE_W = 420;

const TILE_W = 84;
const TILE_H = 68;
const LETTER = 54;
const ROW_TEXT = 32;
const ROW_LINE = 37;

export type MatrixLegend = 'band' | 'inline' | 'none';
export type MatrixCounts = 'none' | 'I' | 'CI';

export interface MatrixLayoutOptions {
  /** Title band (default true). */
  title?: boolean;
  /** Legend: own band under the title (default), inline at the right of the title band (only fits with `diag`; falls back to the band when `title` is false), or none. */
  legend?: MatrixLegend;
  /** Reserve the diagnosticity column (s06 on). Default false. */
  diag?: boolean;
  /** Count rows under the grid: none (default), the «Inconsistencias» row, or the C row + the I row (s07). */
  counts?: MatrixCounts;
}

interface Layout {
  w: number;
  h: number;
  x: { label: number; hyp: Record<HypId, number>; diag: number };
  y: { title: number; legend: number; header: number; rows: Record<EvId, number>; countC: number; countI: number; gridBottom: number };
  legendInline: boolean;
}

function layout({ title = true, legend = 'band', diag = false, counts = 'none' }: MatrixLayoutOptions): Layout {
  const legendInline = legend === 'inline' && title;
  const legendBand = legend === 'band' || (legend === 'inline' && !title);
  const w = PAD * 2 + LABEL_W + HYP_W * 3 + (diag ? DIAG_W : 0);
  const xLabel = PAD;
  const hyp = { H1: xLabel + LABEL_W, H2: xLabel + LABEL_W + HYP_W, H3: xLabel + LABEL_W + 2 * HYP_W };
  let y = PAD;
  const yTitle = y;
  if (title) y += TITLE_H;
  const yLegend = y;
  if (legendBand) y += LEGEND_H;
  const yHeader = y;
  y += HEADER_H;
  const rows = {} as Record<EvId, number>;
  for (const id of EV_IDS) {
    rows[id] = y;
    y += ROW_H[id];
  }
  const gridBottom = y;
  const countC = y;
  if (counts === 'CI') y += COUNT_H;
  const countI = y;
  if (counts !== 'none') y += COUNT_H;
  return {
    w,
    h: y + PAD,
    x: { label: xLabel, hyp, diag: hyp.H3 + HYP_W },
    y: { title: yTitle, legend: yLegend, header: yHeader, rows, countC, countI, gridBottom },
    legendInline,
  };
}

/** Design size of the matrix box (scale 1). */
export const MATRIX_BASE = {
  withDiag: layout({ diag: true }).w,
  withoutDiag: layout({}).w,
  height: layout({}).h,
} as const;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

const box = (x: number, y: number, w: number, h: number, s: number): Box => ({
  x: x * s,
  y: y * s,
  w: w * s,
  h: h * s,
  cx: (x + w / 2) * s,
  cy: (y + h / 2) * s,
});

/**
 * Size in px of a Matrix with these layout options drawn `width` px wide
 * (default: its design width). `overhang` is what draws outside the box:
 * the winner tab under it, `right` notes beside it (an estimate: a right note
 * is as wide as its text, ~420 design units for «justo lo que alguien podría plantar»).
 */
export function matrixSize(
  opts: MatrixLayoutOptions = {},
  width?: number,
): { w: number; h: number; scale: number; overhang: { bottom: number; right: number } } {
  const l = layout(opts);
  const s = (width ?? l.w) / l.w;
  return { w: l.w * s, h: l.h * s, scale: s, overhang: { bottom: WINNER_TAB_H * s, right: (RIGHT_NOTE_W + 24) * s } };
}

/** Box (px, from the matrix's top-left) of one cell. */
export function matrixCellBox(cell: CellId, opts: MatrixLayoutOptions = {}, width?: number): Box {
  const l = layout(opts);
  const s = (width ?? l.w) / l.w;
  const [ev, hyp] = cell.split('-') as [EvId, HypId];
  return box(l.x.hyp[hyp], l.y.rows[ev], HYP_W, ROW_H[ev], s);
}

/** Box of a whole row (label + cells + diag cell), or of a count row. */
export function matrixRowBox(row: EvId | 'countC' | 'countI', opts: MatrixLayoutOptions = {}, width?: number): Box {
  const l = layout(opts);
  const s = (width ?? l.w) / l.w;
  const y = row === 'countC' ? l.y.countC : row === 'countI' ? l.y.countI : l.y.rows[row];
  const h = row === 'countC' || row === 'countI' ? COUNT_H : ROW_H[row];
  return box(PAD, y, l.w - 2 * PAD, h, s);
}

/** Box of a hypothesis column, header to the last row (count rows included). */
export function matrixColBox(hyp: HypId, opts: MatrixLayoutOptions = {}, width?: number): Box {
  const l = layout(opts);
  const s = (width ?? l.w) / l.w;
  return box(l.x.hyp[hyp], l.y.header, HYP_W, l.h - PAD - l.y.header, s);
}

// ---------------------------------------------------------------------------
// Props

/** «Enlarge what the voice explains, dim the rest», for a frame window. */
export interface MatrixFocus {
  /** Cells whose letter tile zooms (and glows). */
  cells?: CellId[];
  /** Rows that get a highlight band (count rows included). */
  rows?: (EvId | 'countC' | 'countI')[];
  /** Columns that get a highlight band. */
  cols?: HypId[];
  from: number;
  /** Exclusive end; omitted: until the end of the Sequence. */
  to?: number;
  /** Tile scale at full focus (cells). Default 1.38. */
  zoom?: number;
  /** Dim everything else (default true). */
  dimRest?: boolean;
}

/** A callout anchored to a cell or a row. */
export interface MatrixNote {
  anchor: CellId | EvId;
  text: string;
  at: number;
  to?: number;
  /** Default 'amber'. Never rose for E4's «justo lo que alguien podría plantar». */
  tone?: Tone;
  /** Where it hangs: under / over the anchor (default 'below'), or right of the box at the anchor's row (overhangs). */
  side?: 'below' | 'above' | 'right';
}

type CountTiming = number | Partial<Record<HypId, number>>;

export interface MatrixProps extends MatrixLayoutOptions {
  /** Width in px (default: design width, scale 1). */
  width?: number;
  /** Frame the panel and its title appear. Omitted: on screen. */
  at?: number;
  /** Frame the hypothesis headers come in (staggered 6 frames). Omitted: shown. */
  colsAt?: number;
  /** Frame the evidence labels come in (staggered 6 frames). Omitted: shown. */
  rowsAt?: number;
  /** Frame the legend comes in. Omitted: shown. */
  legendAt?: number;
  /** Per-cell pop-in frames. Omitted: every cell shown. Given: only the listed cells appear. */
  revealAt?: Partial<Record<CellId, number>>;
  /** Per-row diagnosticity value frames (needs `diag`). Omitted: all shown. Given: only the listed rows. */
  diagAt?: Partial<Record<EvId, number>>;
  /** Frame the «strong link» tag lands on E4 (with a short glow). Omitted: shown with E4's diag value. */
  strongLinkAt?: number;
  /** Rows that go grey and fade back (E1 in s06, E4 when pulled in s08). The diag cell keeps its value legible. */
  fadeRows?: Partial<Record<EvId, number>>;
  /** Count numbers: a frame (H1, H2, H3 staggered 10 frames) or one per column. Omitted: shown. */
  countAt?: { C?: CountTiming; I?: CountTiming };
  /** Frame a line strikes the C row through (s07). */
  strikeCAt?: number;
  /** Frame H1's emerald frame + tab «la menos inconsistente» land (s07). */
  winnerAt?: number;
  /** Frame the I row recounts without E4: 0 · 3 · 2 becomes 0 · 2 · 1, tag «sin E4» (s08). */
  recountAt?: number;
  focus?: MatrixFocus[];
  notes?: MatrixNote[];
  /** 0–1 whole-piece dim. */
  dim?: number;
  /** 0–1 cyan halo on the frame. */
  glow?: number;
  frame?: number;
  style?: CSSProperties;
}

// ---------------------------------------------------------------------------
// Look

const SLATE = '#94a3b8';

export const MARK_LOOK: Record<Mark, { fg: string; text: string; fill: number; border: number }> = {
  C: { fg: C.cyan, text: C.cyanSoft, fill: 0.16, border: 0.75 },
  I: { fg: C.rose, text: C.roseSoft, fill: 0.2, border: 0.85 },
  N: { fg: SLATE, text: '#cbd5e1', fill: 0.1, border: 0.45 },
};

/** A C / I / N letter tile (the matrix cell, also used by the legend). */
export function MarkTile({ mark, w = TILE_W, h = TILE_H, size = LETTER, glow = 0, style }: { mark: Mark; w?: number; h?: number; size?: number; glow?: number; style?: CSSProperties }) {
  const m = MARK_LOOK[mark];
  const g = clamp01(glow);
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: Math.round(h * 0.2),
        border: `${g > 0.2 ? 4 : 3}px solid ${alpha(m.fg, m.border + (1 - m.border) * g)}`,
        background: alpha(m.fg, m.fill + 0.12 * g),
        display: 'grid',
        placeItems: 'center',
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 850,
        lineHeight: 1,
        color: m.text,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(30 * g)}px ${alpha(m.fg, 0.5 * g)}` : undefined,
        ...style,
      }}
    >
      {mark}
    </div>
  );
}

const DIAG_LOOK: Record<Diag, { fg: string; text: string }> = {
  NULA: { fg: SLATE, text: '#cbd5e1' },
  ALTA: { fg: C.amber, text: '#fcd34d' },
};

// ---------------------------------------------------------------------------

/**
 * Matrix — the ACH extract. Layout: `title` (true), `legend` ('band' | 'inline' | 'none'), `diag` (false),
 * `counts` ('none' | 'I' | 'CI'). Reveal frames (omitted = shown): `at`, `colsAt`, `rowsAt`, `legendAt`,
 * `revealAt` {cellId: frame}, `diagAt` {E1..E4: frame}, `strongLinkAt`, `countAt` {C?, I?}. States from a
 * frame on: `fadeRows` {E1..E4: frame}, `strikeCAt`, `winnerAt`, `recountAt`. Windows: `focus`
 * (cells zoom, rows / cols / count rows get a band, the rest dims), `notes` (callouts). Plus `width`, `dim`,
 * `glow`, `frame`, `style`. See MatrixProps for each one.
 */
export function Matrix({
  title = true,
  legend = 'band',
  diag = false,
  counts = 'none',
  width,
  at,
  colsAt,
  rowsAt,
  legendAt,
  revealAt,
  diagAt,
  strongLinkAt,
  fadeRows = {},
  countAt = {},
  strikeCAt,
  winnerAt,
  recountAt,
  focus = [],
  notes = [],
  dim = 0,
  glow = 0,
  frame: frameProp,
  style,
}: MatrixProps) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const l = layout({ title, legend, diag, counts });
  const s = (width ?? l.w) / l.w;

  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;

  // Remotion's interpolate throws on a non-finite range: an item with no frame (Infinity) simply stays hidden.
  const appear = (f: number | undefined, d = 12) => (f === undefined ? 1 : Number.isFinite(f) ? progress(frame, f, d) : 0);
  const pop = (f: number | undefined) => (f === undefined ? 1 : frame < f ? 0 : springIn(frame, fps, f, { damping: 13, mass: 0.7 }));

  // Focus weights.
  const fw = focus.map((f) => windowWeight(frame, f.from, f.to ?? Number.POSITIVE_INFINITY, { ramp: 10, lead: 4 }));
  const dimmers = focus.map((f, i) => (f.dimRest === false ? 0 : fw[i]));
  const touches = (pred: (f: MatrixFocus) => boolean) => Math.max(0, ...focus.map((f, i) => (pred(f) ? fw[i] : 0)));
  const dimFor = (pred: (f: MatrixFocus) => boolean) => {
    const own = touches(pred);
    const other = Math.max(0, ...focus.map((f, i) => (pred(f) ? 0 : dimmers[i])));
    return other * (1 - own);
  };
  const cellInFocus = (cell: CellId) => (f: MatrixFocus) => {
    const [ev, hyp] = cell.split('-') as [EvId, HypId];
    return !!(f.cells?.includes(cell) || f.rows?.includes(ev) || f.cols?.includes(hyp));
  };
  const rowTouched = (ev: EvId) => (f: MatrixFocus) => !!(f.rows?.includes(ev) || f.cells?.some((c) => c.startsWith(`${ev}-`)));
  const colTouched = (hyp: HypId) => (f: MatrixFocus) => !!(f.cols?.includes(hyp) || f.cells?.some((c) => c.endsWith(`-${hyp}`)));
  const countInFocus = (row: 'countC' | 'countI', hyp: HypId) => (f: MatrixFocus) => !!(f.rows?.includes(row) || f.cols?.includes(hyp));

  const fadeOf = (ev: EvId) => (fadeRows[ev] === undefined ? 0 : progress(frame, fadeRows[ev]!, 22, EASE.inOut));
  const dimCss = (d: number, base = 1, grey = 0): CSSProperties => {
    const k = clamp01(d);
    const op = base * (1 - 0.6 * k);
    const sat = 1 - 0.5 * k - 0.5 * grey;
    return { opacity: op, filter: sat < 0.999 ? `saturate(${Math.max(0, sat)})` : undefined };
  };

  const countTime = (which: 'C' | 'I', hyp: HypId): number | undefined => {
    const t = countAt[which];
    if (t === undefined) return undefined;
    if (typeof t === 'number') return t + HYP_IDS.indexOf(hyp) * 10;
    return t[hyp] ?? Number.POSITIVE_INFINITY;
  };

  const d = clamp01(dim);
  const g = clamp01(glow);
  const recount = recountAt === undefined ? 0 : progress(frame, recountAt, 16, EASE.inOut);
  const strike = strikeCAt === undefined ? 0 : progress(frame, strikeCAt, 18, EASE.inOut);
  const win = winnerAt === undefined ? 0 : progress(frame, winnerAt, 16);
  const winPulse = winnerAt === undefined ? 0 : 0.75 + 0.25 * pulse(frame, fps, 0.5);

  const titleIn = show;
  const legendIn = appear(legendAt, 14);
  const headerY = l.y.header;

  // ---- pieces

  const titleBand = title ? (
    <div
      style={{
        position: 'absolute',
        left: PAD + 6,
        top: l.y.title,
        height: TITLE_H,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: titleIn,
        whiteSpace: 'nowrap',
      }}
    >
      <GridGlyph size={34} color={C.cyan} />
      <span style={{ fontSize: 30, fontWeight: 750, color: C.textStrong, letterSpacing: -0.2 }}>{MATRIX_TEXT.title}</span>
    </div>
  ) : null;

  const legendNode = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', fontSize: 32, fontWeight: 650, color: C.text }}>
      {MATRIX_TEXT.legendParts.map((p, i) => (
        <span key={p.mark} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          {i > 0 ? <span style={{ color: C.faint, margin: '0 6px 0 2px' }}>·</span> : null}
          <MarkTile mark={p.mark} w={46} h={40} size={28} />
          <span>
            = <span style={{ color: MARK_LOOK[p.mark].text, fontWeight: 750 }}>{p.text}</span>
          </span>
        </span>
      ))}
    </div>
  );

  const legendBand =
    legend === 'none' ? null : l.legendInline ? (
      <div style={{ position: 'absolute', right: PAD + 10, top: l.y.title, height: TITLE_H, display: 'flex', alignItems: 'center', opacity: legendIn }}>{legendNode}</div>
    ) : (
      <div
        style={{
          position: 'absolute',
          left: PAD + 6,
          top: l.y.legend,
          height: LEGEND_H,
          display: 'flex',
          alignItems: 'center',
          opacity: legendIn,
          transform: `translateY(${(1 - legendIn) * 8}px)`,
        }}
      >
        {legendNode}
      </div>
    );

  const gridTop = headerY;
  const gridBottom = l.y.gridBottom;
  const countsBottom = l.h - PAD;

  // Row backgrounds + separators.
  const rowBands = EV_IDS.map((ev, i) => {
    const y = l.y.rows[ev];
    const band = Math.max(0, ...focus.map((f, k) => (f.rows?.includes(ev) ? fw[k] : 0)));
    const lin = appear(rowsAt === undefined ? undefined : rowsAt + i * 6);
    return (
      <div key={ev}>
        <div
          style={{
            position: 'absolute',
            left: PAD,
            top: y,
            width: l.w - 2 * PAD,
            height: ROW_H[ev],
            background: i % 2 === 0 ? alpha(C.ink800, 0.55) : 'transparent',
            opacity: lin,
          }}
        />
        {band > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: PAD - 4,
              top: y - 3,
              width: l.w - 2 * PAD + 8,
              height: ROW_H[ev] + 6,
              boxSizing: 'border-box',
              borderRadius: 12,
              border: `3px solid ${alpha(C.cyan, 0.85 * band)}`,
              background: alpha(C.cyan, 0.08 * band),
              boxShadow: `0 0 ${Math.round(26 * band)}px ${alpha(C.cyan, 0.3 * band)}`,
              zIndex: 1,
            }}
          />
        ) : null}
      </div>
    );
  });

  const colBands = HYP_IDS.map((hyp) => {
    const band = Math.max(0, ...focus.map((f, k) => (f.cols?.includes(hyp) ? fw[k] : 0)));
    if (band <= 0.01) return null;
    return (
      <div
        key={hyp}
        style={{
          position: 'absolute',
          left: l.x.hyp[hyp] + 4,
          top: gridTop + 2,
          width: HYP_W - 8,
          height: countsBottom - gridTop - 4,
          boxSizing: 'border-box',
          borderRadius: 14,
          border: `3px solid ${alpha(C.cyan, 0.8 * band)}`,
          background: alpha(C.cyan, 0.07 * band),
          zIndex: 1,
        }}
      />
    );
  });

  const lines: ReactNode[] = [];
  // Horizontal separators: under the header, between rows, above the counts.
  const hy = [gridTop + HEADER_H, ...EV_IDS.slice(1).map((ev) => l.y.rows[ev])];
  hy.forEach((y, i) =>
    lines.push(<div key={`h${i}`} style={{ position: 'absolute', left: PAD, top: y - 1, width: l.w - 2 * PAD, height: 2, background: i === 0 ? alpha(C.cyan, 0.35) : C.ink700 }} />),
  );
  if (counts !== 'none') {
    lines.push(<div key="hc" style={{ position: 'absolute', left: PAD, top: gridBottom - 1, width: l.w - 2 * PAD, height: 3, background: alpha(C.text, 0.4) }} />);
  }
  // Vertical separators.
  const vx = [l.x.hyp.H1, l.x.hyp.H2, l.x.hyp.H3, ...(diag ? [l.x.diag] : [])];
  vx.forEach((x, i) =>
    lines.push(
      <div
        key={`v${i}`}
        style={{ position: 'absolute', left: x - 1, top: gridTop, width: 2, height: countsBottom - gridTop, background: i === 0 || (diag && i === 3) ? alpha(C.cyan, 0.3) : C.ink700 }}
      />,
    ),
  );

  // Column headers.
  const headers = HYPOTHESES.map((h, i) => {
    const inP = appear(colsAt === undefined ? undefined : colsAt + i * 6, 14);
    const dd = dimFor(colTouched(h.id)) * 0.7;
    const winning = h.id === 'H1' ? win : 0;
    return (
      <div
        key={h.id}
        style={{
          position: 'absolute',
          left: l.x.hyp[h.id],
          top: gridTop,
          width: HYP_W,
          height: HEADER_H,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          zIndex: 2,
          transform: `translateY(${(1 - inP) * -10}px)`,
          ...dimCss(dd, inP),
        }}
      >
        <span style={{ fontSize: 42, fontWeight: 850, lineHeight: 1, color: winning > 0.5 ? '#6ee7b7' : C.textStrong, letterSpacing: -0.5 }}>{h.id}</span>
        <span style={{ fontSize: 27, fontWeight: 650, lineHeight: 1.12, color: C.text, textAlign: 'center', whiteSpace: 'nowrap' }}>
          {h.lines.map((ln) => (
            <div key={ln}>{ln}</div>
          ))}
        </span>
      </div>
    );
  });

  const diagHeaderIn = diag ? (diagAt === undefined ? 1 : appear(Math.min(...Object.values(diagAt).map((v) => v ?? Number.POSITIVE_INFINITY)), 14)) : 0;
  const diagHeader = diag ? (
    <div
      style={{
        position: 'absolute',
        left: l.x.diag,
        top: gridTop,
        width: DIAG_W,
        height: HEADER_H,
        display: 'grid',
        placeItems: 'center',
        zIndex: 2,
        opacity: diagHeaderIn,
      }}
    >
      <span style={{ fontSize: 28, fontWeight: 750, color: '#fcd34d', whiteSpace: 'nowrap' }}>{MATRIX_TEXT.diagHeader}</span>
    </div>
  ) : null;

  // Row labels.
  const rowLabels = EVIDENCE.map((e, i) => {
    const inP = appear(rowsAt === undefined ? undefined : rowsAt + i * 6, 14);
    const fade = fadeOf(e.id);
    const dd = dimFor(rowTouched(e.id));
    const base = inP * (1 - 0.72 * fade);
    return (
      <div
        key={e.id}
        style={{
          position: 'absolute',
          left: l.x.label,
          top: l.y.rows[e.id],
          width: LABEL_W,
          height: ROW_H[e.id],
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 16px',
          boxSizing: 'border-box',
          zIndex: 2,
          transform: `translateX(${(1 - inP) * -14}px)`,
          ...dimCss(dd, base, fade),
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 64,
            height: 48,
            borderRadius: 10,
            display: 'grid',
            placeItems: 'center',
            background: C.ink700,
            border: `2px solid ${alpha(C.cyan, 0.4)}`,
            fontSize: 30,
            fontWeight: 850,
            color: C.textStrong,
          }}
        >
          {e.id}
        </div>
        <div style={{ fontSize: ROW_TEXT, lineHeight: `${ROW_LINE}px`, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>
          {e.lines.map((ln) => (
            <div key={ln}>{ln}</div>
          ))}
        </div>
      </div>
    );
  });

  // Cells.
  const cells = EVIDENCE.flatMap((e) =>
    HYP_IDS.map((hyp, i) => {
      const id = `${e.id}-${hyp}` as CellId;
      const mark = e.marks[i];
      const t = revealAt === undefined ? undefined : revealAt[id] ?? Number.POSITIVE_INFINITY;
      const p = pop(t);
      if (p <= 0.001) return null;
      const fade = fadeOf(e.id);
      const own = touches(cellInFocus(id));
      const zoomW = Math.max(0, ...focus.map((f, k) => (f.cells?.includes(id) ? fw[k] : 0)));
      const zoom = Math.max(1, ...focus.map((f) => (f.cells?.includes(id) ? f.zoom ?? 1.38 : 1)));
      const dd = dimFor(cellInFocus(id));
      const k = (0.55 + 0.45 * p) * (1 + (zoom - 1) * zoomW);
      return (
        <div
          key={id}
          style={{
            position: 'absolute',
            left: l.x.hyp[hyp],
            top: l.y.rows[e.id],
            width: HYP_W,
            height: ROW_H[e.id],
            display: 'grid',
            placeItems: 'center',
            zIndex: zoomW > 0.01 ? 4 : 2,
            ...dimCss(dd, Math.min(1, p * 1.4) * (1 - 0.75 * fade), fade),
          }}
        >
          <MarkTile mark={mark} glow={Math.max(zoomW, own * 0.35)} style={{ transform: `scale(${k})` }} />
        </div>
      );
    }),
  );

  // Diagnosticity cells.
  const diagCells = diag
    ? EVIDENCE.map((e) => {
        const t = diagAt === undefined ? undefined : diagAt[e.id] ?? Number.POSITIVE_INFINITY;
        const p = pop(t);
        if (p <= 0.001) return null;
        const look = DIAG_LOOK[e.diag];
        const fade = fadeOf(e.id);
        const dd = dimFor(rowTouched(e.id));
        const isE4 = e.id === 'E4';
        const slT = strongLinkAt ?? t;
        const sl = isE4 ? (slT === undefined ? 1 : frame < slT ? 0 : springIn(frame, fps, slT, { damping: 13 })) : 0;
        const slGlow = isE4 && strongLinkAt !== undefined ? 1 - progress(frame, strongLinkAt + 20, 50, EASE.inOut) : 0;
        return (
          <div
            key={e.id}
            style={{
              position: 'absolute',
              left: l.x.diag,
              top: l.y.rows[e.id],
              width: DIAG_W,
              height: ROW_H[e.id],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              zIndex: 2,
              ...dimCss(dd, Math.min(1, p * 1.4) * (1 - 0.3 * fade)),
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '5px 18px',
                borderRadius: RADIUS.pill,
                border: `3px solid ${alpha(look.fg, e.diag === 'ALTA' ? 0.85 : 0.55)}`,
                background: alpha(look.fg, e.diag === 'ALTA' ? 0.16 : 0.1),
                color: look.text,
                fontSize: 32,
                fontWeight: 850,
                letterSpacing: 1,
                lineHeight: 1.1,
                transform: `scale(${0.6 + 0.4 * p})`,
              }}
            >
              {e.diag}
            </span>
            {isE4 && sl > 0.001 ? <StrongLinkTag p={sl} glow={slGlow} /> : null}
          </div>
        );
      })
    : null;

  // Strong-link tag without the diag column: hangs right of E4's row.
  const strongLinkLoose =
    !diag && strongLinkAt !== undefined && frame >= strongLinkAt ? (
      <div style={{ position: 'absolute', left: l.w + 24, top: l.y.rows.E4 + ROW_H.E4 / 2 - 24, zIndex: 3 }}>
        <StrongLinkTag p={springIn(frame, fps, strongLinkAt, { damping: 13 })} glow={1 - progress(frame, strongLinkAt + 20, 50, EASE.inOut)} />
      </div>
    ) : null;

  // Count rows.
  const countRow = (which: 'C' | 'I') => {
    const y = which === 'C' ? l.y.countC : l.y.countI;
    const rowKey = which === 'C' ? 'countC' : 'countI';
    const firstT = Math.min(...HYP_IDS.map((h) => countTime(which, h) ?? -Infinity));
    const labelIn = firstT === Number.NEGATIVE_INFINITY ? 1 : appear(firstT - 6, 12);
    const labelDim = dimFor((f) => !!f.rows?.includes(rowKey));
    const struck = which === 'C' ? strike : 0;
    const values = which === 'C' ? COUNTS.C : COUNTS.I;
    const band = Math.max(0, ...focus.map((f, k) => (f.rows?.includes(rowKey) ? fw[k] : 0)));
    return (
      <div key={which}>
        {band > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: PAD - 4,
              top: y - 3,
              width: l.w - 2 * PAD + 8,
              height: COUNT_H + 6,
              boxSizing: 'border-box',
              borderRadius: 12,
              border: `3px solid ${alpha(which === 'I' ? C.rose : C.cyan, 0.85 * band)}`,
              background: alpha(which === 'I' ? C.rose : C.cyan, 0.08 * band),
              zIndex: 1,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: l.x.label,
            top: y,
            width: LABEL_W,
            height: COUNT_H,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 16px',
            boxSizing: 'border-box',
            zIndex: 2,
            ...dimCss(labelDim, labelIn * (1 - 0.45 * struck)),
          }}
        >
          <MarkTile mark={which} w={56} h={46} size={32} />
          <span style={{ fontSize: 34, fontWeight: 800, color: which === 'I' ? C.roseSoft : C.cyanSoft, whiteSpace: 'nowrap' }}>
            {which === 'C' ? MATRIX_TEXT.countC : MATRIX_TEXT.countI}
          </span>
          {which === 'I' && recountAt !== undefined && recount > 0 ? (
            <span
              style={{
                marginLeft: 6,
                padding: '3px 14px',
                borderRadius: RADIUS.pill,
                border: `3px solid ${alpha(C.amber, 0.85)}`,
                background: alpha(C.amber, 0.14),
                color: '#fcd34d',
                fontSize: 28,
                fontWeight: 850,
                whiteSpace: 'nowrap',
                opacity: recount,
                transform: `scale(${0.7 + 0.3 * recount})`,
              }}
            >
              {MATRIX_TEXT.withoutE4}
            </span>
          ) : null}
        </div>
        {HYP_IDS.map((hyp) => {
          const t = countTime(which, hyp);
          const p = pop(t);
          if (p <= 0.001) return null;
          const dd = dimFor(countInFocus(rowKey, hyp));
          const v = values[hyp];
          const after = which === 'I' ? COUNTS.IWithoutE4[hyp] : v;
          const changes = recountAt !== undefined && which === 'I' && after !== v;
          const color = which === 'C' ? C.cyanSoft : v === 0 ? '#6ee7b7' : C.roseSoft;
          return (
            <div
              key={hyp}
              style={{
                position: 'absolute',
                left: l.x.hyp[hyp],
                top: y,
                width: HYP_W,
                height: COUNT_H,
                overflow: 'hidden',
                zIndex: 3,
                ...dimCss(dd, Math.min(1, p * 1.4) * (1 - 0.5 * struck)),
              }}
            >
              <CountNumber value={v} color={color} y={changes ? -recount * COUNT_H : 0} opacity={changes ? 1 - recount : 1} scale={0.6 + 0.4 * p} />
              {changes ? <CountNumber value={after} color={after === 0 ? '#6ee7b7' : C.roseSoft} y={(1 - recount) * COUNT_H} opacity={recount} scale={1} /> : null}
            </div>
          );
        })}
        {which === 'C' && struck > 0 ? (
          <svg
            width={l.w}
            height={COUNT_H}
            style={{ position: 'absolute', left: 0, top: y, overflow: 'visible', zIndex: 5, ...dimCss(labelDim) }}
          >
            {/* A slightly slanted marker stroke through the row (hand-drawn: two passes). */}
            <path
              d={`M ${l.x.label + 10} ${COUNT_H / 2 + 6} L ${l.x.hyp.H3 + HYP_W - 20} ${COUNT_H / 2 - 4}`}
              stroke={alpha(C.rose, 0.9)}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - struck}
            />
            <path
              d={`M ${l.x.label + 24} ${COUNT_H / 2 + 12} L ${l.x.hyp.H3 + HYP_W - 30} ${COUNT_H / 2 + 2}`}
              stroke={alpha(C.rose, 0.55)}
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - clamp01(struck * 1.15 - 0.15)}
            />
          </svg>
        ) : null}
      </div>
    );
  };

  // Winner frame on H1's column + its tab.
  const winner =
    win > 0.001 ? (
      <div style={{ position: 'absolute', left: l.x.hyp.H1 + 6, top: gridTop + 4, width: HYP_W - 12, height: countsBottom - gridTop - 4, zIndex: 6, ...dimCss(dimFor(colTouched('H1'))) }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxSizing: 'border-box',
            borderRadius: 16,
            border: `5px solid ${alpha(C.emerald, 0.95 * win)}`,
            boxShadow: `0 0 ${Math.round(34 * winPulse * win)}px ${alpha(C.emerald, 0.45 * win)}, inset 0 0 ${Math.round(22 * win)}px ${alpha(C.emerald, 0.18 * win)}`,
            transform: `scale(${1.06 - 0.06 * win})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: countsBottom - gridTop - 4 + PAD + 8,
            transform: `translate(-50%, ${(1 - win) * -12}px)`,
            opacity: win,
            padding: '8px 22px',
            borderRadius: RADIUS.md,
            background: C.emerald,
            color: C.ink950,
            fontSize: 34,
            fontWeight: 850,
            whiteSpace: 'nowrap',
            boxShadow: `0 10px 26px ${alpha('#000000', 0.45)}`,
          }}
        >
          {MATRIX_TEXT.winner}
        </div>
      </div>
    ) : null;

  // Notes.
  const noteNodes = notes.map((n, i) => {
    const w = windowWeight(frame, n.at, n.to ?? Number.POSITIVE_INFINITY, { ramp: 12, lead: 0 });
    if (w <= 0.001) return null;
    const t = toneOf(n.tone ?? 'amber');
    const isCell = n.anchor.includes('-');
    const ev = (isCell ? n.anchor.split('-')[0] : n.anchor) as EvId;
    // A cell note centres on its cell; a row note on the row's label column (it is about that evidence).
    // Either way the bubble is kept inside the box (its width estimated from the text).
    const estW = n.text.length * 0.56 * 34 + 52;
    const ax0 = isCell ? l.x.hyp[n.anchor.split('-')[1] as HypId] + HYP_W / 2 : l.x.label + LABEL_W / 2;
    const ax = Math.max(PAD + estW / 2, Math.min(l.w - PAD - estW / 2, ax0));
    const ay = l.y.rows[ev];
    const side = n.side ?? 'below';
    const bubble = (
      <div
        style={{
          padding: '10px 22px',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(t.fg, 0.9)}`,
          background: alpha(C.ink950, 0.94),
          color: t.soft,
          fontSize: 34,
          fontWeight: 800,
          whiteSpace: 'nowrap',
          boxShadow: `0 14px 30px ${alpha('#000000', 0.5)}, 0 0 22px ${alpha(t.fg, 0.25)}`,
        }}
      >
        {n.text}
      </div>
    );
    if (side === 'right') {
      return (
        <div key={i} style={{ position: 'absolute', left: l.w - PAD, top: ay + ROW_H[ev] / 2, zIndex: 7, opacity: w, display: 'flex', alignItems: 'center', transform: `translate(${(1 - w) * 16}px, -50%)` }}>
          <div style={{ width: 34, height: 4, background: alpha(t.fg, 0.9), borderRadius: 2 }} />
          {bubble}
        </div>
      );
    }
    const below = side === 'below';
    const top = below ? ay + ROW_H[ev] - 4 : ay + 4;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: ax,
          top,
          zIndex: 7,
          opacity: w,
          display: 'flex',
          flexDirection: below ? 'column' : 'column-reverse',
          alignItems: 'center',
          transform: `translate(-50%, ${below ? (1 - w) * -10 : `calc(-100% + ${(1 - w) * 10}px)`})`,
        }}
      >
        <div style={{ width: 4, height: 22, background: alpha(t.fg, 0.9), borderRadius: 2 }} />
        {bubble}
      </div>
    );
  });

  return (
    <div
      style={{
        position: 'relative',
        width: l.w * s,
        height: l.h * s,
        opacity: show * (1 - 0.6 * d),
        filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: l.w,
          height: l.h,
          transform: `scale(${s * (0.97 + 0.03 * show)})`,
          transformOrigin: '0 0',
          fontFamily: FONT.sans,
        }}
      >
        {/* Panel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: RADIUS.lg,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            border: `2px solid ${alpha(C.cyan, 0.35 + 0.45 * g)}`,
            boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}${g > 0 ? `, 0 0 ${Math.round(24 + 30 * g)}px ${alpha(C.cyan, 0.3 * g)}` : ''}`,
          }}
        />
        {/* Header band background */}
        <div style={{ position: 'absolute', left: PAD, top: gridTop, width: l.w - 2 * PAD, height: HEADER_H, background: alpha(C.ink700, 0.45), borderRadius: '10px 10px 0 0' }} />
        {counts !== 'none' ? (
          <div style={{ position: 'absolute', left: PAD, top: gridBottom, width: l.w - 2 * PAD, height: countsBottom - gridBottom, background: alpha(C.ink950, 0.5), borderRadius: '0 0 10px 10px' }} />
        ) : null}
        {rowBands}
        {colBands}
        {lines}
        {titleBand}
        {legendBand}
        {headers}
        {diagHeader}
        {rowLabels}
        {cells}
        {diagCells}
        {counts === 'CI' ? countRow('C') : null}
        {counts !== 'none' ? countRow('I') : null}
        {winner}
        {strongLinkLoose}
        {noteNodes}
      </div>
    </div>
  );
}

function CountNumber({ value, color, y, opacity, scale }: { value: number; color: string; y: number; opacity: number; scale: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        fontSize: 54,
        fontWeight: 850,
        lineHeight: 1,
        color,
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
      }}
    >
      {value}
    </div>
  );
}

function StrongLinkTag({ p, glow }: { p: number; glow: number }) {
  const g = clamp01(glow);
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 14px',
        borderRadius: RADIUS.sm,
        border: `2px solid ${alpha(C.amber, 0.7 + 0.3 * g)}`,
        background: alpha(C.amber, 0.12 + 0.18 * g),
        color: '#fde68a',
        fontSize: 28,
        fontWeight: 800,
        whiteSpace: 'nowrap',
        lineHeight: 1.15,
        opacity: Math.min(1, p * 1.4),
        transform: `scale(${0.6 + 0.4 * p})`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(26 * g)}px ${alpha(C.amber, 0.55 * g)}` : undefined,
      }}
    >
      {MATRIX_TEXT.strongLink}
    </span>
  );
}

/** Small 3×3 grid glyph for the title band. */
function GridGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}
