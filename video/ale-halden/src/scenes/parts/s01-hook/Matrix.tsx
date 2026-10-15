import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { progress, pulse } from '../../../../../engine/src/theme/motion';
import { AXES, CELL_LABEL } from '../../../data/s01-hook';

export const CELL = { w: 216, h: 140, gap: 12 } as const;
export const MATRIX_W = 3 * CELL.w + 2 * CELL.gap;
export const MATRIX_H = 3 * CELL.h + 2 * CELL.gap;
/** The lit cell: top row, right column (high impact, high probability). */
export const HOT = { row: 0, col: 2 } as const;
/** Centre of the lit cell inside the matrix box. */
export const HOT_CENTER = { x: HOT.col * (CELL.w + CELL.gap) + CELL.w / 2, y: HOT.row * (CELL.h + CELL.gap) + CELL.h / 2 } as const;

/**
 * The risk matrix: three by three, neutral cells, ONE red cell. It is a matrix, not a heat map: nothing else is
 * coloured. Frames are local to the scene's Sequence.
 *   hotAt    the red cell lights (the voice says «casilla roja»)
 *   labelAt  its label «R-014 · ALTO» comes in
 *   dim      0–1: the cell steps back (the promise has taken over)
 */
export function RiskMatrix({ frame, fps, hotAt, labelAt, dim = 0 }: { frame: number; fps: number; hotAt: number; labelAt: number; dim?: number }) {
  const hot = progress(frame, hotAt, 14);
  const label = progress(frame, labelAt, 12);
  const glow = hot * (1 - 0.7 * dim) * (0.7 + 0.3 * pulse(frame, fps, 0.6));
  return (
    <div style={{ position: 'relative', width: MATRIX_W, height: MATRIX_H, fontFamily: FONT.sans }}>
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const isHot = row === HOT.row && col === HOT.col;
        const appear = progress(frame, -22 + (row + col) * 4, 14);
        const x = col * (CELL.w + CELL.gap);
        const y = row * (CELL.h + CELL.gap);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: CELL.w,
              height: CELL.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              display: 'grid',
              placeItems: 'center',
              opacity: appear * (isHot ? 1 : 1 - 0.25 * dim),
              transform: `scale(${0.94 + 0.06 * appear})`,
              border: isHot ? `3px solid ${alpha(C.rose, 0.35 + 0.65 * hot)}` : `2px solid ${C.ink700}`,
              background: isHot ? `linear-gradient(180deg, ${alpha(C.rose, 0.1 + 0.22 * hot)} 0%, ${alpha(C.roseDeep, 0.35 + 0.5 * hot)} 100%)` : alpha(C.ink800, 0.9),
              boxShadow: isHot && glow > 0.02 ? `0 0 ${Math.round(46 * glow)}px ${alpha(C.rose, 0.4 * glow)}` : undefined,
            }}
          >
            {isHot ? (
              <span style={{ opacity: label, fontSize: 32, fontWeight: 850, letterSpacing: -0.3, color: '#ffe4e6', whiteSpace: 'nowrap', transform: `translateY(${(1 - label) * 8}px)` }}>{CELL_LABEL}</span>
            ) : null}
          </div>
        );
      })}
      {/* Axis names: texture only */}
      <div
        style={{
          position: 'absolute',
          left: -44,
          top: MATRIX_H / 2,
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          fontSize: 28,
          fontWeight: 650,
          letterSpacing: 2,
          color: C.faint,
          whiteSpace: 'nowrap',
          opacity: progress(frame, -4, 14),
        }}
      >
        {AXES.y}
      </div>
      <div style={{ position: 'absolute', left: 0, top: MATRIX_H + 14, width: MATRIX_W, textAlign: 'center', fontSize: 28, fontWeight: 650, letterSpacing: 2, color: C.faint, opacity: progress(frame, -4, 14) }}>
        {AXES.x}
      </div>
    </div>
  );
}
