import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { CELLS, cellId } from '../../../data/matrix';
import { AMBER_SOFT, Lines, MarkChip, MatrixCell, VIOLET_SOFT, actionName, cellSkin } from './Cell';
import { M, designCell, designLift, lineEms, pointSize, type designLayout } from './layout';
import type { MatrixProps } from './types';

type L = ReturnType<typeof designLayout>;
const c01 = (v: number | undefined) => Math.max(0, Math.min(1, v ?? 0));
const mixv = (a: number, b: number, t: number) => a + (b - a) * t;
/** Side padding of a card in an enlarged row (design units). */
const BIG_PAD = 9;

/** The populated cells: in their grid slots, as bars in a squeezed row, or as cards in an enlarged row. */
export function GridCells({ l, s, cells = {}, rows = {}, markFlash = 0 }: { l: L; s: number; cells?: MatrixProps['cells']; rows?: MatrixProps['rows']; markFlash?: number }) {
  const big = pointSize(s);
  return (
    <>
      {CELLS.map((def) => {
        const id = cellId(def.phase, def.action);
        const st = cells[id] ?? {};
        const show = st.show === undefined ? 1 : c01(st.show);
        if (show <= 0.004) return null;
        const g = designCell(id, l);
        const isBig = l.big.id === def.phase;
        const e = isBig ? l.big.e : 0;
        const squeeze = isBig ? 0 : l.big.e;
        // Rest text leaves in the first half of the change, the big text comes in the second.
        const restT = c01(1 - 2 * e);
        const bigT = c01(2 * e - 1);
        const x = mixv(g.grid.x + 3, g.big.x, e);
        const y = mixv(g.grid.y + 3, g.big.y, e);
        const w = mixv(g.grid.w - 6, g.big.w, e);
        const h = mixv(g.grid.h - 6, g.big.h, e);
        const lit = c01(st.lit);
        const rowDim = c01(rows[def.phase]?.dim);
        const dim = Math.max(c01(st.dim), def.alwaysDim ? 0.75 : 0, rowDim);
        const skin = cellSkin(def.action, { lit, tone: st.tone, ghost: def.alwaysDim });
        const mark = Math.max(c01(markFlash), c01(st.mark));
        const lifted = c01(st.lift);
        // Enlarged text: ≥ 32 px on screen while the card is wide enough, never clipped (it shrinks to fit).
        const ems = Math.max(6, ...def.lines.map((ln) => lineEms(ln, 0.82)), ...(def.markNote ?? []).map((t) => t.length * 0.55 * 0.9));
        const bigF = Math.min(big, (g.big.w - 2 * BIG_PAD) / ems);
        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              boxSizing: 'border-box',
              borderRadius: 8 + 4 * e,
              overflow: 'hidden',
              ...skin,
              opacity: show * (1 - 0.62 * dim) * (1 - 0.5 * lifted),
              filter: dim > 0.001 ? `saturate(${1 - 0.6 * dim})` : undefined,
              transform: show < 0.999 ? `scale(${0.9 + 0.1 * show})` : undefined,
            }}
          >
            {/* rest: the lesson's text, small (texture) */}
            {restT > 0.01 ? (
              <div style={{ position: 'absolute', left: 6, top: 5, opacity: restT * (1 - squeeze) }}>
                <Lines lines={def.lines} size={M.text} mono={M.mono} color={def.alwaysDim ? C.muted : C.text} />
                {def.markNote ? (
                  <div style={{ marginTop: 2, fontSize: 13.5, lineHeight: 1.16, fontWeight: 750, color: AMBER_SOFT, whiteSpace: 'nowrap' }}>
                    {def.markNote.map((ln) => (
                      <div key={ln}>{ln}</div>
                    ))}
                  </div>
                ) : null}
                {def.note ? (
                  <div style={{ marginTop: 1, fontSize: 11.5, lineHeight: 1.16, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>
                    {def.note.map((ln) => (
                      <div key={ln}>{ln}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            {/* a squeezed row keeps its cells as bars */}
            {squeeze > 0.01 ? (
              <div style={{ position: 'absolute', left: 8, right: def.mark ? 44 : 8, top: '50%', transform: 'translateY(-50%)', opacity: squeeze }}>
                <div style={{ height: 6, borderRadius: 3, background: alpha(C.text, 0.4) }} />
                <div style={{ height: 6, borderRadius: 3, marginTop: 7, width: '68%', background: alpha(C.text, 0.26) }} />
              </div>
            ) : null}
            {def.mark && restT > 0.01 ? <MarkChip size={15} glow={mark} style={{ position: 'absolute', right: 5, top: mixv(5, 9, squeeze), opacity: restT }} /> : null}
            {/* enlarged: the same text, big */}
            {bigT > 0.01 ? (
              <div style={{ position: 'absolute', left: BIG_PAD, right: BIG_PAD, top: 8, opacity: bigT }}>
                <div style={{ display: 'flex', alignItems: 'center', height: 0.94 * bigF, whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 0.72 * bigF, fontWeight: 850, letterSpacing: 0.6, color: VIOLET_SOFT }}>{actionName(def.action)}</span>
                  {def.mark ? <MarkChip size={0.72 * bigF} glow={mark} style={{ marginLeft: 'auto' }} /> : null}
                </div>
                <Lines lines={def.lines} size={bigF} mono={0.82 * bigF} color={C.textStrong} weight={650} />
                {def.markNote ? (
                  <div style={{ marginTop: 2, fontSize: 0.9 * bigF, lineHeight: 1.14, fontWeight: 750, color: AMBER_SOFT, whiteSpace: 'nowrap' }}>
                    {def.markNote.map((ln) => (
                      <div key={ln}>{ln}</div>
                    ))}
                  </div>
                ) : null}
                {def.note ? <div style={{ fontSize: 0.62 * bigF, lineHeight: 1.2, color: C.muted, whiteSpace: 'nowrap' }}>{def.note.map((ln) => <div key={ln}>{ln}</div>)}</div> : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

/** Cells lifted in front of the grid as readable cards (`cells[id].lift`). */
export function LiftedCells({ l, s, cells = {}, markFlash = 0 }: { l: L; s: number; cells?: MatrixProps['cells']; markFlash?: number }) {
  return (
    <>
      {CELLS.map((def) => {
        const id = cellId(def.phase, def.action);
        const st = cells[id];
        const lift = c01(st?.lift);
        if (!st || lift <= 0.004) return null;
        const g = designCell(id, l).grid;
        const b = designLift(id, l, s, { x: (st.shift?.x ?? 0) / s, y: (st.shift?.y ?? 0) / s });
        const k = 0.5 + 0.5 * lift;
        return (
          <div key={id} style={{ position: 'absolute', left: mixv(g.cx, b.cx, lift) - b.w / 2, top: mixv(g.cy, b.cy, lift) - b.h / 2, width: b.w, height: b.h, opacity: Math.min(1, lift * 1.5), transform: `scale(${k})`, zIndex: 5 }}>
            <MatrixCell cell={id} fontSize={b.font} width={b.w} height={b.h} lit={Math.max(0.55, c01(st.lit))} tone={st.tone ?? 'cyan'} markGlow={Math.max(c01(markFlash), c01(st.mark))} ghost={false} style={{ boxShadow: `0 18px 40px ${alpha('#000000', 0.6)}` }} />
          </div>
        );
      })}
    </>
  );
}
