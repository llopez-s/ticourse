import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { TONE } from './matrix/Cell';
import { GridCells, LiftedCells } from './matrix/Cells';
import { Foot, Head, Rows } from './matrix/Frame';
import { MATRIX_W, designCell, designLayout, designLift, type Box } from './matrix/layout';
import type { MatrixLabel, MatrixProps } from './matrix/types';

const c01 = (v: number | undefined) => Math.max(0, Math.min(1, v ?? 0));

/**
 * The lesson's Courses of Action matrix (data/matrix.ts: literal cell text, the three `[!]` marks, the
 * title «Matriz Courses of Action · extracto de trabajo (ficticia)», the two strips). The analyst's
 * working menu: five phases × Detect / Deny / Disrupt / Degrade / Deceive. Pure and prop-driven: every
 * state is a 0–1 weight, nothing reads the timeline; wrap it in an absolutely positioned div.
 *
 * SIZE: laid out in 1000 design units and scaled to `width`; height = matrixSize(opts, width).h
 * (662 at 1000 with title and foot; 624 without the title). At rest the cells' text is texture
 * (16 units); whatever the voice points at must be LIFTED or its row ENLARGED: both draw ≥ 32 px on
 * screen (lifted cards at any width; an enlarged row from width ≈ 930 up: narrower than that its text
 * shrinks to fit its card instead of clipping).
 *
 * PROPS (0–1 unless said; types in matrix/types.ts)
 *   width = 1000, show = 1 (whole piece in), dim = 0, style
 *   title = true, foot = true          layout: title band / bottom band
 *   enlarge { phase: n }               ONE row grows to cards (s05: { c2: 1 }); the others shrink to bars
 *   cols { action: n }                 column header lit (violet) when its verb is named
 *   rows { phase: { dim, lit (cyan band), warn (amber dashed: unprotected), alert (rose dashed + siren:
 *          s05's hypothetical alarm), count } }
 *   counts = 0                         «N celdas» on every row at once (3 · 2 · 2 · 3 · 3)
 *   cells { 'phase-action': { show = 1 (0 = gone: s04's Delivery with only its Deny), dim, lit, tone
 *          ('cyan' | 'emerald' | 'amber' | 'violet'), lift (readable card in front), shift {x, y} px,
 *          mark (glow on its [!]) } }   — 'delivery-deceive' (the decoy mailbox) is always dashed and dim
 *   strips = 1                         «casi nunca a tu alcance» + «Discover y Destroy no ocupan celda…»
 *   legend = 0                         «[!] = acción visible para el actor» takes the strips' place
 *   markFlash = 0                      flash on the three [!] marks
 *   labels [{ cell, text, sub, lines[], tone, side ('right' | 'left' | 'above' | 'below'), show, size, dx, dy }]
 *                                      a tag beside a cell (its lifted card when lifted): DENY / DISRUPT / gloss
 *
 * HELPERS (same layout options + width → px from the matrix's top-left): matrixSize, matrixRowBox,
 * matrixColBox, matrixCellBox (grid slot, or its card in an enlarged row), matrixLiftBox (lifted card).
 * ALSO: <MatrixCell cell fontSize form header /> = one cell as a card on its own (s02's example, s06);
 * <MatrixThumb width /> = the grid without text for thumbnails; MarkChip = the [!] chip.
 */
export function Matrix({ width = MATRIX_W, show = 1, dim = 0, title = true, foot = true, enlarge, cols, rows, cells, counts = 0, strips = 1, legend = 0, markFlash = 0, labels = [], style }: MatrixProps) {
  const sh = c01(show);
  if (sh <= 0.001) return null;
  const l = designLayout({ title, foot, enlarge });
  const s = width / MATRIX_W;
  const d = c01(dim);
  return (
    <div style={{ position: 'relative', width, height: l.h * s, opacity: sh * (1 - 0.6 * d), filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: MATRIX_W, height: l.h, transform: `scale(${s * (0.97 + 0.03 * sh)})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        <Head l={l} title={title} cols={cols} />
        <Rows l={l} rows={rows} counts={counts} s={s} />
        <GridCells l={l} s={s} cells={cells} rows={rows} markFlash={markFlash} />
        {foot ? <Foot l={l} strips={strips} legend={legend} s={s} /> : null}
        <LiftedCells l={l} s={s} cells={cells} markFlash={markFlash} />
        {labels.map((lb, i) => (
          <Label key={i} lb={lb} l={l} s={s} lift={c01(cells?.[lb.cell]?.lift)} shift={cells?.[lb.cell]?.shift} />
        ))}
      </div>
    </div>
  );
}

function Label({ lb, l, s, lift, shift }: { lb: MatrixLabel; l: ReturnType<typeof designLayout>; s: number; lift: number; shift?: { x?: number; y?: number } }) {
  const w = c01(lb.show ?? 1);
  if (w <= 0.004) return null;
  const c = designCell(lb.cell, l);
  const e = l.big.id === c.phase ? l.big.e : 0;
  const box: Box = lift > 0.5 ? designLift(lb.cell, l, s, { x: (shift?.x ?? 0) / s, y: (shift?.y ?? 0) / s }) : e > 0.5 ? c.big : c.grid;
  // Beside an enlarged row, 'above' / 'below' clear the whole row (its phase name sits over the cards).
  const rowTop = e > 0.5 && lift <= 0.5 ? l.rowY[c.phase] : box.y;
  const rowBottom = e > 0.5 && lift <= 0.5 ? l.rowY[c.phase] + l.rowH[c.phase] : box.y + box.h;
  const t = TONE[lb.tone ?? 'emerald'];
  const f = (lb.size ?? 32) / s;
  const side = lb.side ?? 'right';
  const gap = 12;
  const dx = (lb.dx ?? 0) / s;
  const dy = (lb.dy ?? 0) / s;
  const pos =
    side === 'right'
      ? { left: box.x + box.w + gap + dx, top: box.cy + dy, transform: `translate(${(1 - w) * -10}px, -50%)` }
      : side === 'left'
        ? { left: box.x - gap + dx, top: box.cy + dy, transform: `translate(calc(-100% + ${(1 - w) * 10}px), -50%)` }
        : side === 'above'
          ? { left: box.cx + dx, top: rowTop - gap + dy, transform: `translate(-50%, calc(-100% + ${(1 - w) * 8}px))` }
          : { left: box.cx + dx, top: rowBottom + gap + dy, transform: `translate(-50%, ${(1 - w) * -8}px)` };
  return (
    <div style={{ position: 'absolute', zIndex: 6, opacity: w, padding: `${0.16 * f}px ${0.5 * f}px ${0.2 * f}px`, borderRadius: 0.4 * f, border: `3px solid ${alpha(t.fg, 0.9)}`, background: alpha(C.ink950, 0.95), boxShadow: `0 12px 28px ${alpha('#000000', 0.5)}, 0 0 20px ${alpha(t.fg, 0.25)}`, whiteSpace: 'nowrap', ...pos }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 0.36 * f }}>
        {lb.text ? <span style={{ fontSize: 1.15 * f, fontWeight: 900, letterSpacing: 0.8, color: t.fg }}>{lb.text}</span> : null}
        {lb.sub ? <span style={{ fontSize: f, fontWeight: 750, color: C.textStrong }}>{lb.sub}</span> : null}
      </div>
      {(lb.lines ?? []).map((ln) => (
        <div key={ln} style={{ fontSize: f, lineHeight: 1.2, fontWeight: 750, color: C.textStrong }}>
          {ln}
        </div>
      ))}
    </div>
  );
}

export { MatrixThumb } from './matrix/Thumb';
export { MarkChip, MatrixCell, type CellTone } from './matrix/Cell';
export { MATRIX_W, matrixCellBox, matrixColBox, matrixLiftBox, matrixRowBox, matrixSize, type Box, type MatrixLayoutOptions } from './matrix/layout';
export type { MatrixCellState, MatrixLabel, MatrixProps, MatrixRowState } from './matrix/types';
