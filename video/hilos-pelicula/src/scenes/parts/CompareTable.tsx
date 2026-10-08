import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * «La tabla» — Meridian | Orbital, the two films face to face (V14 s04–s06;
 * owner: B2, see out/scene-brief.md «Ownership»). One drawing in every state:
 *
 *   s04 rows 1–3 fill ....... <CompareTable reveal={{ lure, domain, pdb }} grey={{ lure, domain }} match={m} marks={{ cheap, strong }} />
 *   s05 rows 4–5 ............ + reveal={{ https, supplier }} marks={{ https, supplier, weak }}
 *   s06 summary ............. <CompareTable summary={1} />            (every reveal / grey / mark omitted = final s05 state)
 *
 * Columns: row label | Meridian (cyan) | Orbital (cyanSoft) | mark. Rows, in order:
 *   lure     «señuelo» · «un CV» · «un pedido»                                   (grey on `cheap`)
 *   domain   «dominio al que llama» · update-svc-cdn.com · portal-auth-check.example (mono, rose → grey)
 *   pdb      «ruta de compilación (PDB)» · the PDB path on both sides (mono, two lines,
 *            lights up character by character in cyan) · winhlp.exe / msdtcs.exe under it
 *   https    «canal» · «HTTPS al 443» · «HTTPS al 443»
 *   supplier «relación» · «—» · «proveedor de Meridian»
 * Marks (mark column unless said): `cheap` one chip for rows 1–2 «barato de cambiar · si no
 * coincide, no separa» (grey); `strong` «fuerte» + «raro y caro de cambiar» (emerald); `https`
 * «muy débil: lo hace todo el mundo» (amber); `supplier` «medio: encaja con ir a por su cadena de
 * suministro» (amber-soft); `weak` «débil para agrupar» (amber pill under «canal», label cell).
 *
 * Props — all 0–1 weights; nothing reads the timeline, nothing is positioned (wrap it in an
 * absolutely positioned div). The rule for every per-row / per-mark map: a key OMITTED from a map
 * that is given → 0; a map OMITTED altogether → its final s05 state (every row in, rows 1–2 grey,
 * path matched, every mark on). So `<CompareTable />` is the whole s05 table, `<CompareTable summary={1} />` the s06 one.
 * - `width`   px (default 1728 = the stage); everything scales with it. Text sizes at scale 1:
 *             labels 32, values 34, mark keywords / glosses / pills 32, path 28 mono, domains 27 mono.
 * - `rows`    layout: which rows exist (default all five, canonical order). Height follows.
 * - `show`    the panel and its header (fade).
 * - `reveal`  per row: a number (label → Meridian → Orbital staggered inside it) or
 *             { label, meridian, orbital } to sync each cell to a word. The panel grows with the rows.
 * - `skeleton` per row: opens the row's empty slot (grid only) before its content (s04: «una tabla»).
 * - `grey`    per row: turns label and values grey (cheap, «no separa»).
 * - `match`   the two PDB paths light up character by character, evenly, in cyan (37 chars).
 * - `sweep`   0→1 a light runs once along both paths, evenly (s04-08 «letra por letra»); 0 or 1 = none.
 * - `pdbName` lifts «(PDB)» in the row label (s04-08 «la ruta del PDB»).
 * - `marks`   per mark: appearance.
 * - `focus`   per row: highlight band in `focusTone`; the other rows step back by the strongest focus.
 * - `summary` s06: the pdb and supplier marks become «fuerte: la ruta del PDB» / «medio: proveedor»;
 *             the https row and its marks turn grey with rows 1–2 («el resto sigue sin contar»).
 * - `link`    a chain-link glyph between the two headers (s04-02 «eso es un enlace»).
 * - `scale`   a balance glyph over the mark column (s04-02 «no todos pesan igual»; on from then, so
 *             omitted it follows the final-state rule: on when `reveal` is omitted, off otherwise).
 * - `dim`     0–1 the whole table steps back (another element is in focus).
 *
 * Geometry (pure): compareTableSize, compareRowBox, compareCellBox, compareHeaderBox, compareMarkBox,
 * comparePathBox, compareVisibleHeight — px from the table's top-left for a table `width` px wide.
 * TABLE_AT_REST is where s05 leaves the table (stage-local) and s06 picks it up.
 *
 * No arrow characters, no hashes, no names: only the canon strings of the brief («Canon strings», s04–s06).
 * The match highlight is the same on every character — nothing singles out a folder of the path.
 */

// ---------------------------------------------------------------------------
// Canon strings

/** The path both programs carry (one backslash each on screen). */
export const PDB_PATH = 'D:\\proj\\cicada\\loader\\Release\\ldr.pdb';
/** Characters on the first line of a path cell (the path wraps after «loader\»). */
const PDB_BREAK = 22;

export type CompareRowId = 'lure' | 'domain' | 'pdb' | 'https' | 'supplier';
export const COMPARE_ROWS: readonly CompareRowId[] = ['lure', 'domain', 'pdb', 'https', 'supplier'];
export type CompareCol = 'label' | 'meridian' | 'orbital' | 'mark';
export type CompareSide = 'meridian' | 'orbital';
export type CompareMarkId = 'cheap' | 'strong' | 'https' | 'supplier' | 'weak';
export const COMPARE_MARKS: readonly CompareMarkId[] = ['cheap', 'strong', 'https', 'supplier', 'weak'];

export const COMPARE_TEXT = {
  header: { meridian: 'Meridian', orbital: 'Orbital' },
  rows: {
    lure: { label: ['señuelo'], meridian: 'un CV', orbital: 'un pedido' },
    domain: { label: ['dominio al', 'que llama'], meridian: 'update-svc-cdn.com', orbital: 'portal-auth-check.example' },
    pdb: { label: ['ruta de compilación', '(PDB)'], meridian: PDB_PATH, orbital: PDB_PATH },
    https: { label: ['canal'], meridian: 'HTTPS al 443', orbital: 'HTTPS al 443' },
    supplier: { label: ['relación'], meridian: '—', orbital: 'proveedor de Meridian' },
  },
  /** Under each path: the program that carries it (no folder). */
  programs: { meridian: 'winhlp.exe', orbital: 'msdtcs.exe' },
  marks: {
    cheap: ['barato de cambiar ·', 'si no coincide, no separa'],
    strong: { key: 'fuerte', gloss: 'raro y caro de cambiar' },
    /** Key, then the gloss in display lines (`inline`: the first gloss line shares the key's line). */
    https: { key: 'muy débil:', gloss: ['lo hace todo el mundo'], inline: false },
    supplier: { key: 'medio:', gloss: ['encaja con ir a por', 'su cadena de suministro'], inline: true },
    weak: 'débil para agrupar',
  },
  summary: { pdb: 'fuerte: la ruta del PDB', supplier: 'medio: proveedor' },
} as const;

// ---------------------------------------------------------------------------
// Layout (design units = px at width 1728)

export const COMPARE_BASE = { w: 1728 } as const;

const COL_W: Record<CompareCol, number> = { label: 350, meridian: 445, orbital: 445, mark: 488 };
const COL_X: Record<CompareCol, number> = {
  label: 0,
  meridian: COL_W.label,
  orbital: COL_W.label + COL_W.meridian,
  mark: COL_W.label + COL_W.meridian + COL_W.orbital,
};
const HEADER_H = 52;
const ROW_H: Record<CompareRowId, number> = { lure: 60, domain: 80, pdb: 112, https: 84, supplier: 78 };

const TXT = { label: 32, value: 34, domain: 27, path: 28, program: 26, key: 32, gloss: 32, header: 36, pill: 32 } as const;
const PATH_CHAR = TXT.path * 0.6;
const PATH_LINE = 33;

const AMBER_SOFT = '#fcd34d';
const EMERALD_SOFT = '#6ee7b7';
const GREY_TEXT = C.faint;

export interface CompareLayoutOptions {
  /** Rows the table lays out (default all five, canonical order). */
  rows?: readonly CompareRowId[];
}

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

function rowsOf(opts: CompareLayoutOptions): CompareRowId[] {
  const want = opts.rows ?? COMPARE_ROWS;
  return COMPARE_ROWS.filter((r) => want.includes(r));
}

function rowYs(opts: CompareLayoutOptions): { rows: CompareRowId[]; y: Partial<Record<CompareRowId, number>>; h: number } {
  const rows = rowsOf(opts);
  const y: Partial<Record<CompareRowId, number>> = {};
  let acc = HEADER_H;
  for (const r of rows) {
    y[r] = acc;
    acc += ROW_H[r];
  }
  return { rows, y, h: acc };
}

const scaleOf = (width?: number) => (width ?? COMPARE_BASE.w) / COMPARE_BASE.w;

/** Size in px of the whole table (header + every laid-out row) drawn `width` px wide. */
export function compareTableSize(opts: CompareLayoutOptions = {}, width?: number): { w: number; h: number; scale: number } {
  const s = scaleOf(width);
  return { w: COMPARE_BASE.w * s, h: rowYs(opts).h * s, scale: s };
}

/** Box (px, from the table's top-left) of a whole row. Throws when the row is not laid out. */
export function compareRowBox(row: CompareRowId, opts: CompareLayoutOptions = {}, width?: number): Box {
  const { y } = rowYs(opts);
  const top = y[row];
  if (top === undefined) throw new Error(`CompareTable: row ${row} is not laid out`);
  return box(0, top, COMPARE_BASE.w, ROW_H[row], scaleOf(width));
}

/** Box of one cell. */
export function compareCellBox(row: CompareRowId, col: CompareCol, opts: CompareLayoutOptions = {}, width?: number): Box {
  const r = compareRowBox(row, opts);
  return box(COL_X[col], r.y, COL_W[col], r.h, scaleOf(width));
}

/** Box of a header cell (the header row is HEADER_H tall at the top). */
export function compareHeaderBox(col: CompareCol, width?: number): Box {
  return box(COL_X[col], 0, COL_W[col], HEADER_H, scaleOf(width));
}

/** Box a mark occupies: `cheap` spans the lure + domain mark cells, `weak` is the pill under «canal». */
export function compareMarkBox(mark: CompareMarkId, opts: CompareLayoutOptions = {}, width?: number): Box {
  const s = scaleOf(width);
  if (mark === 'cheap') {
    const a = compareCellBox('lure', 'mark', opts);
    const b = compareCellBox('domain', 'mark', opts);
    return box(a.x, a.y, a.w, b.y + b.h - a.y, s);
  }
  if (mark === 'weak') {
    const c = compareCellBox('https', 'label', opts);
    return box(c.x + 22, c.y + 40, 320, 40, s);
  }
  const row: CompareRowId = mark === 'strong' ? 'pdb' : mark;
  const c = compareCellBox(row, 'mark', opts);
  return box(c.x, c.y, c.w, c.h, s);
}

/** Box of the path text (both lines) in one side's PDB cell. */
export function comparePathBox(side: CompareSide, opts: CompareLayoutOptions = {}, width?: number): Box {
  const c = compareCellBox('pdb', side, opts);
  return box(c.x + 20, c.y + 8, PDB_BREAK * PATH_CHAR, 2 * PATH_LINE, scaleOf(width));
}

/** Where s05 leaves the table and s06 picks it up: stage-local position + width (clear of the think card). */
export const TABLE_AT_REST = { x: 0, y: 184, width: 1728 } as const;

// ---------------------------------------------------------------------------
// Props

type CellReveal = number | { label?: number; meridian?: number; orbital?: number };
type RowMap<T> = Partial<Record<CompareRowId, T>>;
type MarkMap = Partial<Record<CompareMarkId, number>>;

export interface CompareTableProps extends CompareLayoutOptions {
  width?: number;
  show?: number;
  reveal?: RowMap<CellReveal>;
  skeleton?: RowMap<number>;
  grey?: RowMap<number>;
  match?: number;
  sweep?: number;
  pdbName?: number;
  marks?: MarkMap;
  focus?: RowMap<number>;
  focusTone?: string;
  summary?: number;
  link?: number;
  scale?: number;
  dim?: number;
  style?: CSSProperties;
}

const FINAL_REVEAL: RowMap<CellReveal> = { lure: 1, domain: 1, pdb: 1, https: 1, supplier: 1 };
const FINAL_GREY: RowMap<number> = { lure: 1, domain: 1 };
const FINAL_MARKS: MarkMap = { cheap: 1, strong: 1, https: 1, supplier: 1, weak: 1 };

function cellWeights(v: CellReveal | undefined): { label: number; meridian: number; orbital: number; open: number } {
  if (v === undefined) return { label: 0, meridian: 0, orbital: 0, open: 0 };
  if (typeof v === 'number') {
    const r = clamp01(v);
    return {
      label: clamp01(r / 0.4),
      meridian: clamp01((r - 0.3) / 0.35),
      orbital: clamp01((r - 0.6) / 0.35),
      open: clamp01(r / 0.3),
    };
  }
  const label = clamp01(v.label ?? 0);
  const meridian = clamp01(v.meridian ?? 0);
  const orbital = clamp01(v.orbital ?? 0);
  return { label, meridian, orbital, open: clamp01(Math.max(label, meridian, orbital) / 0.75) };
}

/** The panel's visible height in px right now (it grows as rows open), for placing things under it. */
export function compareVisibleHeight(reveal: RowMap<CellReveal> | undefined, opts: CompareLayoutOptions = {}, width?: number, skeleton?: RowMap<number>): number {
  const s = scaleOf(width);
  const rv = reveal ?? FINAL_REVEAL;
  const { rows } = rowYs(opts);
  let h = HEADER_H;
  for (const r of rows) h += ROW_H[r] * easeOpen(Math.max(cellWeights(rv[r]).open, clamp01(skeleton?.[r] ?? 0)));
  return h * s;
}

const easeOpen = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

// ---------------------------------------------------------------------------
// Pieces

/** Two interlocking links (drawn), centred on (cx, cy). */
function LinkGlyph({ cx, cy, s, p }: { cx: number; cy: number; s: number; p: number }) {
  const w = 46 * s;
  const h = 24 * s;
  const sw = 5 * s;
  const len = 2 * (w + h);
  return (
    <svg
      width={80 * s}
      height={40 * s}
      viewBox={`${-40 * s} ${-20 * s} ${80 * s} ${40 * s}`}
      style={{ position: 'absolute', left: cx - 40 * s, top: cy - 20 * s, overflow: 'visible', opacity: Math.min(1, p * 2) }}
    >
      <rect x={-w + 8 * s} y={-h / 2} width={w} height={h} rx={h / 2} fill={C.ink800} stroke={C.cyan} strokeWidth={sw} strokeDasharray={`${len * p} ${len}`} />
      <rect x={-8 * s} y={-h / 2} width={w} height={h} rx={h / 2} fill="none" stroke={C.cyanSoft} strokeWidth={sw} strokeDasharray={`${len * p} ${len}`} />
    </svg>
  );
}

/** A small balance: «no todos pesan igual». */
function ScaleGlyph({ cx, cy, s, p }: { cx: number; cy: number; s: number; p: number }) {
  const tilt = 9 * p;
  const rad = (tilt * Math.PI) / 180;
  const arm = 30;
  const lx = -arm * Math.cos(rad);
  const ly = arm * Math.sin(rad);
  const rx = arm * Math.cos(rad);
  const ry = -arm * Math.sin(rad);
  const pan = (x: number, y: number) => `M ${x - 11} ${y + 12} Q ${x} ${y + 21} ${x + 11} ${y + 12} Z`;
  return (
    <svg
      width={90 * s}
      height={50 * s}
      viewBox="-45 -22 90 50"
      style={{ position: 'absolute', left: cx - 45 * s, top: cy - 22 * s, overflow: 'visible', opacity: p }}
    >
      <g stroke={C.muted} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 0 -14 L 0 22 M -10 22 L 10 22" />
        <path d={`M ${lx} ${ly - 10} L ${rx} ${ry - 10}`} />
        <path d={`M ${lx} ${ly - 10} L ${lx - 9} ${ly + 12} M ${lx} ${ly - 10} L ${lx + 9} ${ly + 12}`} />
        <path d={`M ${rx} ${ry - 10} L ${rx - 9} ${ry + 12} M ${rx} ${ry - 10} L ${rx + 9} ${ry + 12}`} />
      </g>
      <path d={pan(lx, ly - 10)} fill={alpha(C.muted, 0.35)} stroke={C.muted} strokeWidth={2} />
      <path d={pan(rx, ry - 10)} fill={alpha(C.muted, 0.35)} stroke={C.muted} strokeWidth={2} />
      <circle cx={0} cy={-15} r={3} fill={C.muted} />
    </svg>
  );
}

function PathText({ side, lit, sweep, grey, s, x, y }: { side: CompareSide; lit: number; sweep: number; grey: number; s: number; x: number; y: number }) {
  const path = COMPARE_TEXT.rows.pdb[side];
  const lines = [path.slice(0, PDB_BREAK), path.slice(PDB_BREAK)];
  const nLit = lit * path.length;
  const sweepAt = sweep > 0 && sweep < 1 ? sweep * (path.length + 2) - 1 : -10;
  const base = mix01Color(C.muted, GREY_TEXT, grey);
  const on = mix01Color(C.cyanSoft, C.muted, grey);
  let idx = 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: FONT.mono, fontSize: TXT.path * s, fontWeight: 600, lineHeight: `${PATH_LINE * s}px`, whiteSpace: 'pre' }}>
      {lines.map((line, li) => (
        <div key={li} style={{ height: PATH_LINE * s }}>
          {[...line].map((ch) => {
            const i = idx++;
            const l = clamp01(nLit - i);
            const sw = clamp01(1 - Math.abs(i - sweepAt) / 1.6);
            return (
              <span
                key={i}
                style={{
                  color: l > 0.5 ? on : base,
                  background: alpha(C.cyan, 0.16 * l + 0.34 * sw),
                  borderRadius: 2 * s,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Blend two #rrggbb colours (t 0 → a, 1 → b). */
function mix01Color(a: string, b: string, t: number): string {
  const k = clamp01(t);
  if (k <= 0) return a;
  if (k >= 1) return b;
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

function MarkText({ keyText, gloss, inline, keyColor, textColor = C.text, s }: { keyText: string; gloss: readonly string[]; inline: boolean; keyColor: string; textColor?: string; s: number }) {
  const glossStyle: CSSProperties = { fontSize: TXT.gloss * s, fontWeight: 600 };
  const rest = inline ? gloss.slice(1) : gloss;
  return (
    <div style={{ fontFamily: FONT.sans, lineHeight: 1.16, color: textColor, whiteSpace: 'nowrap' }}>
      <div>
        <span style={{ fontSize: TXT.key * s, fontWeight: 800, color: keyColor }}>{keyText}</span>
        {inline && gloss[0] ? <span style={glossStyle}>{` ${gloss[0]}`}</span> : null}
      </div>
      {rest.map((line) => (
        <div key={line} style={glossStyle}>
          {line}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The table

export function CompareTable({
  width = COMPARE_BASE.w,
  rows: rowsOpt,
  show = 1,
  reveal,
  skeleton,
  grey,
  match,
  sweep = 0,
  pdbName = 0,
  marks,
  focus,
  focusTone = C.cyan,
  summary = 0,
  link = 0,
  scale,
  dim = 0,
  style,
}: CompareTableProps) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const opts = { rows: rowsOpt };
  const s = scaleOf(width);
  const u = (n: number) => n * s;
  const { rows, y: ys, h: fullH } = rowYs(opts);
  const rv = reveal ?? FINAL_REVEAL;
  const gr = grey ?? FINAL_GREY;
  const mk = marks ?? FINAL_MARKS;
  const m = clamp01(match ?? (reveal === undefined ? 1 : 0));
  const sum = clamp01(summary);
  const visH = compareVisibleHeight(rv, opts, width, skeleton);
  const focusMax = Math.max(0, ...rows.map((r) => clamp01(focus?.[r] ?? 0)));
  const d = clamp01(dim);
  const scaleW = clamp01(scale ?? (reveal === undefined ? 1 : 0));

  const markW = (id: CompareMarkId) => clamp01(mk[id] ?? 0);
  const greyOf = (r: CompareRowId) => clamp01(Math.max(gr[r] ?? 0, r === 'https' ? sum : 0));

  const vline = (x: number, strong = false) => (
    <div key={`v${x}`} style={{ position: 'absolute', left: u(x) - 1, top: 0, width: strong ? 3 : 2, height: '100%', background: strong ? alpha(C.cyan, 0.35) : alpha(C.ink600, 0.7) }} />
  );

  return (
    <div
      style={{
        position: 'relative',
        width: u(COMPARE_BASE.w),
        height: u(fullH),
        opacity: sh * (1 - 0.55 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        ...style,
      }}
    >
      {/* Panel (grows with the rows) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: u(COMPARE_BASE.w),
          height: visH,
          borderRadius: u(16),
          background: alpha(C.ink900, 0.92),
          border: `${Math.max(1, u(2))}px solid ${C.ink700}`,
          boxShadow: `0 ${u(18)}px ${u(44)}px ${alpha('#000000', 0.45)}`,
          overflow: 'hidden',
        }}
      >
        {/* Header band */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: u(HEADER_H), background: alpha(C.ink800, 0.95), borderBottom: `${Math.max(1, u(2))}px solid ${C.ink600}` }} />
        {vline(COL_X.meridian)}
        {vline(COL_X.orbital, true)}
        {vline(COL_X.mark)}
        {(['meridian', 'orbital'] as const).map((side) => {
          const color = side === 'meridian' ? C.cyan : C.cyanSoft;
          const b = compareHeaderBox(side, width);
          return (
            <div
              key={side}
              style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontFamily: FONT.sans, fontSize: u(TXT.header), fontWeight: 800, color, letterSpacing: u(0.3) }}>{COMPARE_TEXT.header[side]}</span>
            </div>
          );
        })}

        {/* Rows */}
        {rows.map((r) => {
          const top = ys[r] ?? 0;
          const h = ROW_H[r];
          const cw = cellWeights(rv[r]);
          const rowOpen = Math.max(cw.open, clamp01(skeleton?.[r] ?? 0));
          if (rowOpen <= 0.001) return null;
          const g = greyOf(r);
          const f = clamp01(focus?.[r] ?? 0);
          const back = clamp01(focusMax - f) * 0.45;
          const textCol = mix01Color(C.text, GREY_TEXT, g);
          const labelCol = mix01Color(C.textStrong, GREY_TEXT, g);
          const cellStyle = (col: CompareCol, w: number): CSSProperties => ({
            position: 'absolute',
            left: u(COL_X[col]),
            top: 0,
            width: u(COL_W[col]),
            height: u(h),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            opacity: w,
            transform: `translateY(${(1 - w) * u(10)}px)`,
          });
          const value = (side: CompareSide) => {
            const w = side === 'meridian' ? cw.meridian : cw.orbital;
            if (r === 'pdb') {
              return (
                <div key={side} style={{ ...cellStyle(side, w), justifyContent: 'flex-start' }}>
                  <PathText side={side} lit={m} sweep={sweep} grey={g} s={s} x={u(20)} y={u(8)} />
                  <div style={{ position: 'absolute', left: u(20), top: u(8 + 2 * PATH_LINE + 4), fontFamily: FONT.mono, fontSize: u(TXT.program), fontWeight: 500, color: mix01Color(C.muted, GREY_TEXT, g), whiteSpace: 'nowrap' }}>
                    {COMPARE_TEXT.programs[side]}
                  </div>
                </div>
              );
            }
            const text = COMPARE_TEXT.rows[r][side];
            const isDomain = r === 'domain';
            return (
              <div key={side} style={{ ...cellStyle(side, w), paddingLeft: u(20), boxSizing: 'border-box' }}>
                <span
                  style={{
                    fontFamily: isDomain ? FONT.mono : FONT.sans,
                    fontSize: u(isDomain ? TXT.domain : TXT.value),
                    fontWeight: isDomain ? 600 : 650,
                    color: isDomain ? mix01Color(C.roseSoft, GREY_TEXT, g) : r === 'supplier' && side === 'meridian' ? mix01Color(C.muted, GREY_TEXT, g) : textCol,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {text}
                </span>
              </div>
            );
          };
          const label = COMPARE_TEXT.rows[r].label;
          const pn = r === 'pdb' ? clamp01(pdbName) : 0;
          return (
            <div
              key={r}
              style={{
                position: 'absolute',
                left: 0,
                top: u(top),
                width: '100%',
                height: u(h),
                opacity: 1 - back,
                filter: back > 0.01 ? `saturate(${1 - 0.6 * back})` : undefined,
              }}
            >
              {/* Separator + grey wash + focus band */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: Math.max(1, u(2)), background: alpha(C.ink700, 0.9), opacity: easeOpen(rowOpen) }} />
              {g > 0.01 ? <div style={{ position: 'absolute', inset: 0, background: alpha(C.ink950, 0.35 * g) }} /> : null}
              {f > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: u(4),
                    top: u(3),
                    right: u(4),
                    bottom: u(3),
                    borderRadius: u(10),
                    background: alpha(focusTone, 0.09 * f),
                    border: `${Math.max(1, u(2.5))}px solid ${alpha(focusTone, 0.75 * f)}`,
                  }}
                />
              ) : null}
              {/* Label (+ the «débil para agrupar» pill under «canal») */}
              <div style={{ ...cellStyle('label', cw.label), paddingLeft: u(22), boxSizing: 'border-box' }}>
                {label.map((line, i) => {
                  const isPdbName = r === 'pdb' && i === 1;
                  return (
                    <div
                      key={line}
                      style={{
                        fontFamily: FONT.sans,
                        fontSize: u(TXT.label),
                        fontWeight: 720,
                        lineHeight: 1.12,
                        color: isPdbName && pn > 0.01 ? mix01Color(labelCol, C.cyanSoft, pn) : labelCol,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
                {r === 'https' && markW('weak') > 0.01 ? (
                  <div style={{ marginTop: u(3), opacity: markW('weak'), transform: `translateX(${(1 - markW('weak')) * u(-10)}px)` }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: `${u(1)}px ${u(14)}px ${u(3)}px`,
                        lineHeight: 1.1,
                        borderRadius: u(999),
                        border: `${Math.max(1, u(2))}px solid ${alpha(mix01Color(C.amber, C.muted, sum), 0.8)}`,
                        background: alpha(mix01Color(C.amber, C.muted, sum), 0.14),
                        fontFamily: FONT.sans,
                        fontSize: u(TXT.pill),
                        fontWeight: 750,
                        color: mix01Color(AMBER_SOFT, C.muted, sum),
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {COMPARE_TEXT.marks.weak}
                    </span>
                  </div>
                ) : null}
              </div>
              {value('meridian')}
              {value('orbital')}
              {/* Mark cell (row-own marks) */}
              <RowMark row={r} s={s} h={h} mk={markW} sum={sum} />
            </div>
          );
        })}

        {/* The rows 1–2 chip (spans both mark cells) */}
        {markW('cheap') > 0.01 && ys.lure !== undefined && ys.domain !== undefined ? (
          <CheapChip top={ys.lure} h={ROW_H.lure + ROW_H.domain} s={s} p={markW('cheap')} back={clamp01(focusMax - Math.max(focus?.lure ?? 0, focus?.domain ?? 0)) * 0.45} sum={sum} />
        ) : null}
      </div>

      {/* Header glyphs: the link between the two films, the balance over the marks */}
      {link > 0.01 ? <LinkGlyph cx={u(COL_X.orbital)} cy={u(HEADER_H / 2)} s={s} p={clamp01(link)} /> : null}
      {scaleW > 0.01 ? <ScaleGlyph cx={u(COL_X.mark + COL_W.mark / 2)} cy={u(HEADER_H / 2 - 2)} s={s} p={scaleW} /> : null}
    </div>
  );
}

function RowMark({ row, s, h, mk, sum }: { row: CompareRowId; s: number; h: number; mk: (id: CompareMarkId) => number; sum: number }) {
  const u = (n: number) => n * s;
  const cell: CSSProperties = {
    position: 'absolute',
    left: u(COL_X.mark),
    top: 0,
    width: u(COL_W.mark),
    height: u(h),
    boxSizing: 'border-box',
    padding: `0 ${u(18)}px 0 ${u(34)}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };
  const bar = (color: string, p: number) => (
    <div style={{ position: 'absolute', left: u(14), top: u(12), width: u(6), height: u(h - 24), borderRadius: u(3), background: color, opacity: p }} />
  );
  const enterStyle = (p: number): CSSProperties => ({ opacity: p, transform: `translateX(${(1 - p) * u(14)}px)` });

  if (row === 'pdb') {
    const p = mk('strong');
    if (p <= 0.01) return null;
    return (
      <div style={cell}>
        {bar(C.emerald, p)}
        <div style={{ position: 'relative', ...enterStyle(p) }}>
          <div style={{ opacity: 1 - sum }}>
            <span
              style={{
                display: 'inline-block',
                padding: `${u(1)}px ${u(16)}px ${u(3)}px`,
                borderRadius: u(999),
                background: alpha(C.emerald, 0.18),
                border: `${Math.max(1, u(2.5))}px solid ${C.emerald}`,
                fontFamily: FONT.sans,
                fontSize: u(TXT.key),
                fontWeight: 850,
                color: EMERALD_SOFT,
                lineHeight: 1.15,
              }}
            >
              {COMPARE_TEXT.marks.strong.key}
            </span>
            <div style={{ marginTop: u(4), fontFamily: FONT.sans, fontSize: u(TXT.gloss), fontWeight: 600, lineHeight: 1.15, color: C.text, whiteSpace: 'nowrap' }}>{COMPARE_TEXT.marks.strong.gloss}</div>
          </div>
          {sum > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', opacity: sum, whiteSpace: 'nowrap' }}>
              <SummaryMark text={COMPARE_TEXT.summary.pdb} color={EMERALD_SOFT} s={s} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  if (row === 'https') {
    const p = mk('https');
    if (p <= 0.01) return null;
    const key = mix01Color(C.amber, C.muted, sum);
    return (
      <div style={cell}>
        {bar(mix01Color(C.amber, C.ink600, sum), p)}
        <div style={enterStyle(p)}>
          <MarkText keyText={COMPARE_TEXT.marks.https.key} gloss={COMPARE_TEXT.marks.https.gloss} inline={COMPARE_TEXT.marks.https.inline} keyColor={key} textColor={mix01Color(C.text, GREY_TEXT, sum)} s={s} />
        </div>
      </div>
    );
  }
  if (row === 'supplier') {
    const p = mk('supplier');
    if (p <= 0.01) return null;
    return (
      <div style={cell}>
        {bar(AMBER_SOFT, p)}
        <div style={{ position: 'relative', ...enterStyle(p) }}>
          <div style={{ opacity: 1 - sum }}>
            <MarkText keyText={COMPARE_TEXT.marks.supplier.key} gloss={COMPARE_TEXT.marks.supplier.gloss} inline={COMPARE_TEXT.marks.supplier.inline} keyColor={AMBER_SOFT} s={s} />
          </div>
          {sum > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', opacity: sum, whiteSpace: 'nowrap' }}>
              <SummaryMark text={COMPARE_TEXT.summary.supplier} color={AMBER_SOFT} s={s} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  return null;
}

function SummaryMark({ text, color, s }: { text: string; color: string; s: number }) {
  const i = text.indexOf(':');
  return (
    <span style={{ fontFamily: FONT.sans, fontSize: TXT.key * s, lineHeight: 1.15, color: C.textStrong }}>
      <span style={{ fontWeight: 850, color }}>{text.slice(0, i + 1)}</span>
      <span style={{ fontWeight: 700 }}>{text.slice(i + 1)}</span>
    </span>
  );
}

function CheapChip({ top, h, s, p, back, sum }: { top: number; h: number; s: number; p: number; back: number; sum: number }) {
  const u = (n: number) => n * s;
  const x = COL_X.mark;
  const lines = COMPARE_TEXT.marks.cheap;
  return (
    <div style={{ position: 'absolute', left: u(x), top: u(top), width: u(COL_W.mark), height: u(h), opacity: p * (1 - back) * (1 - 0.25 * sum) }}>
      {/* Bracket over both rows */}
      <svg width={u(30)} height={u(h)} viewBox={`0 0 30 ${h}`} style={{ position: 'absolute', left: u(8), top: 0, overflow: 'visible' }}>
        <path d={`M 22 12 Q 10 12 10 26 L 10 ${h / 2 - 10} Q 10 ${h / 2} 2 ${h / 2} Q 10 ${h / 2} 10 ${h / 2 + 10} L 10 ${h - 26} Q 10 ${h - 12} 22 ${h - 12}`} fill="none" stroke={C.muted} strokeWidth={3} strokeLinecap="round" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: u(40),
          top: '50%',
          transform: `translate(${(1 - p) * u(14)}px, -50%)`,
          padding: `${u(8)}px ${u(18)}px`,
          borderRadius: u(14),
          border: `${Math.max(1, u(2))}px solid ${alpha(C.muted, 0.7)}`,
          background: alpha(C.ink700, 0.75),
          fontFamily: FONT.sans,
          fontSize: u(TXT.gloss),
          fontWeight: 650,
          lineHeight: 1.22,
          color: '#cbd5e1',
          whiteSpace: 'nowrap',
        }}
      >
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
}
