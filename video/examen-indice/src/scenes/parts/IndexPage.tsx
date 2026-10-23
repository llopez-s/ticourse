import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';
import { PAPER, Paper } from './paper';

/** The lesson's example index page (s6m2, «Página de índice — sección Analysis»), entry by entry. */
export const PAGE_ROWS = [
  { term: 'ACH', note: 'winner = LEAST inconsistent', where: 'S4M3 / B4*' },
  { term: 'ACH: diagnosticity', note: 'separates hypotheses', where: 'S4M3' },
  { term: 'Anchoring bias', note: '1st number sticks', where: 'S4M1' },
  { term: 'attributed-to (STIX)', note: 'campaign>intrusion-set', where: 'S4M5' },
  { term: 'Attribution levels', note: 'machine/operator/sponsor', where: 'S4M5' },
  { term: 'Mirror imaging', note: 'they think like you?', where: 'S4M1' },
] as const;

export const PAGE_W = 1380;
const PAD = 36;
const COLS = [0.34, 0.42, 0.24] as const;
export const PAGE_HEAD_H = 76;
export const PAGE_COLHEAD_H = 54;
export const PAGE_ROW_H = 60;
export const PAGE_H = PAGE_HEAD_H + PAGE_COLHEAD_H + PAGE_ROW_H * PAGE_ROWS.length + 30;

/**
 * An index page as the lesson prints it: «INDEX — page 7 of 12» with the yellow ANALYSIS tab,
 * columns TERM · NOTE · WHERE, six entries in strict alphabetical order. `rowsAt` is the frame
 * the first row lands (one every 7 frames); `where` (0–1) lights the WHERE column.
 */
export function IndexPage({ frame, at, where = 0, style }: { frame: number; at: number; where?: number; style?: CSSProperties }) {
  const inner = PAGE_W - 2 * PAD;
  const colW = COLS.map((c) => c * inner);
  const mono = { fontFamily: FONT.mono, fontSize: 30, fontWeight: 600 } as const;
  return (
    <Paper w={PAGE_W} h={PAGE_H} style={{ position: 'relative', padding: `0 ${PAD}px`, overflow: 'hidden', ...style }}>
      {/* title row */}
      <div style={{ height: PAGE_HEAD_H, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ ...mono, fontSize: 34, fontWeight: 800, color: PAPER.ink }}>INDEX — page 7 of 12</span>
        <span style={{ ...mono, fontSize: 26, fontWeight: 800, color: '#422006', background: '#fde047', padding: '6px 18px', borderRadius: 6, boxShadow: '0 3px 0 #ca8a04' }}>TAB: ANALYSIS = yellow</span>
      </div>
      {/* column heads */}
      <div style={{ height: PAGE_COLHEAD_H, display: 'flex', borderTop: `3px solid ${PAPER.ink}`, borderBottom: `3px solid ${PAPER.ink}` }}>
        {['TERM', 'NOTE', 'WHERE'].map((h, i) => (
          <div key={h} style={{ width: colW[i], display: 'flex', alignItems: 'center', gap: 10, ...mono, fontSize: 28, fontWeight: 800, letterSpacing: 2, color: i === 2 && where > 0.4 ? PAPER.cyan : PAPER.soft }}>
            {h}
            {i === 1 ? <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: 0, opacity: 0.8 }}>(answers w/o opening)</span> : null}
          </div>
        ))}
      </div>
      {PAGE_ROWS.map((r, i) => {
        const e = enter(frame, at + i * 7, { distance: 10 });
        return (
          <div key={r.term} style={{ height: PAGE_ROW_H, display: 'flex', alignItems: 'center', borderBottom: i < PAGE_ROWS.length - 1 ? `2px solid ${alpha(PAPER.line, 0.7)}` : undefined, ...e }}>
            <div style={{ width: colW[0], ...mono, fontWeight: 800, color: PAPER.ink }}>{r.term}</div>
            <div style={{ width: colW[1], ...mono, color: PAPER.green, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              {r.note.includes('>') ? (
                <>
                  campaign <Icon name="arrowRight" size={26} color={PAPER.green} strokeWidth={2.6} /> intrusion-set
                </>
              ) : (
                r.note
              )}
            </div>
            <div style={{ width: colW[2], ...mono, fontWeight: 800, color: PAPER.soft }}>{r.where}</div>
          </div>
        );
      })}
      {/* WHERE column highlight */}
      {where > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            left: PAD + colW[0] + colW[1] - 14,
            top: PAGE_HEAD_H,
            width: colW[2] + 14,
            height: PAGE_COLHEAD_H + PAGE_ROW_H * PAGE_ROWS.length,
            background: alpha(C.cyan, 0.2 * where),
            borderLeft: `4px solid ${alpha('#0891b2', where)}`,
            borderRight: `4px solid ${alpha('#0891b2', where)}`,
            boxShadow: `0 0 ${Math.round(30 * where)}px ${alpha(C.cyan, 0.55 * where)}`,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </Paper>
  );
}

/** Convenience for the progress of one row (used by scenes that mark single entries). */
export const rowIn = (frame: number, at: number, i: number) => progress(frame, at + i * 7, 10);
