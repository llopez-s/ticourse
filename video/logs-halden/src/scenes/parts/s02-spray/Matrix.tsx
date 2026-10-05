import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { KeyGlyph } from '../FlatsBlock';
import { MATRIX } from '../../../data/s02-spray';

/**
 * Accounts × passwords (s02): rows are accounts (user icon), columns are
 * passwords (a key, as in the block of flats). Brute force fills ONE ROW
 * (amber: the counter-example), spraying fills ONE COLUMN (rose: tonight).
 * Axis titles only — no password and no account name is readable.
 */

export const MATRIX_GRID = {
  rows: 5,
  cols: 6,
  cell: 46,
  gap: 6,
  /** Left band: the vertical «cuentas» + the row icons. */
  left: 96,
  /** Top band: «contraseñas» + the column keys. */
  top: 96,
  bruteRow: 1,
  sprayCol: 5,
} as const;

const PITCH = MATRIX_GRID.cell + MATRIX_GRID.gap;

export function matrixSize(): { width: number; height: number } {
  return {
    width: MATRIX_GRID.left + MATRIX_GRID.cols * PITCH - MATRIX_GRID.gap,
    height: MATRIX_GRID.top + MATRIX_GRID.rows * PITCH - MATRIX_GRID.gap,
  };
}

/** Cell box (px, relative to the matrix's top-left). */
export function matrixCell(r: number, c: number): { x: number; y: number; size: number } {
  return { x: MATRIX_GRID.left + c * PITCH, y: MATRIX_GRID.top + r * PITCH, size: MATRIX_GRID.cell };
}

export function Matrix({
  show = 1,
  bruteFill = 0,
  sprayFill = 0,
  bruteDim = 0,
  bruteGlow = 0,
  sprayGlow = 0,
}: {
  show?: number;
  /** Cells of the brute-force row filled so far (0…cols, fractional = fading in). */
  bruteFill?: number;
  /** Cells of the spraying column filled so far (0…rows). */
  sprayFill?: number;
  /** 0–1: the brute-force row steps back. */
  bruteDim?: number;
  /** 0–1: the brute-force row is outlined. */
  bruteGlow?: number;
  /** 0–1: the spraying column glows. */
  sprayGlow?: number;
}) {
  const { width, height } = matrixSize();
  const s = clamp01(show);
  const bd = clamp01(bruteDim);
  const bg = clamp01(bruteGlow);
  const sg = clamp01(sprayGlow);
  const gridLeft = MATRIX_GRID.left;
  const gridW = MATRIX_GRID.cols * PITCH - MATRIX_GRID.gap;
  const gridH = MATRIX_GRID.rows * PITCH - MATRIX_GRID.gap;
  return (
    <div style={{ position: 'relative', width, height, opacity: s, fontFamily: FONT.sans }}>
      {/* «contraseñas» over the columns */}
      <div style={{ position: 'absolute', left: gridLeft, top: 0, width: gridW, textAlign: 'center', fontSize: 32, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>
        {MATRIX.cols}
      </div>
      {/* Column keys */}
      {Array.from({ length: MATRIX_GRID.cols }, (_, c) => {
        const cell = matrixCell(0, c);
        const on = c === MATRIX_GRID.sprayCol ? clamp01(sprayFill) : 0;
        return (
          <div key={c} style={{ position: 'absolute', left: cell.x + 3, top: 56 }}>
            <KeyGlyph width={40} color={on > 0.3 ? C.rose : alpha(C.muted, 0.75)} glow={on * 0.6} />
          </div>
        );
      })}
      {/* «cuentas», vertical, left of the row icons */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: MATRIX_GRID.top + gridH / 2,
          width: 0,
          height: 0,
        }}
      >
        <div style={{ position: 'absolute', left: 16, top: 0, transform: 'translate(-50%, -50%) rotate(-90deg)', fontSize: 32, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>
          {MATRIX.rows}
        </div>
      </div>
      {/* Row icons */}
      {Array.from({ length: MATRIX_GRID.rows }, (_, r) => {
        const cell = matrixCell(r, 0);
        const on = r === MATRIX_GRID.bruteRow ? clamp01(bruteFill) * (1 - 0.6 * bd) : 0;
        return (
          <div key={r} style={{ position: 'absolute', left: 44, top: cell.y + (MATRIX_GRID.cell - 36) / 2 }}>
            <Icon name="user" size={36} color={on > 0.3 ? C.amber : alpha(C.cyan, 0.75)} />
          </div>
        );
      })}
      {/* Cells */}
      {Array.from({ length: MATRIX_GRID.rows }, (_, r) =>
        Array.from({ length: MATRIX_GRID.cols }, (_, c) => {
          const cell = matrixCell(r, c);
          const b = r === MATRIX_GRID.bruteRow ? clamp01(bruteFill - c) * (1 - 0.55 * bd) : 0;
          const sp = c === MATRIX_GRID.sprayCol ? clamp01(sprayFill - r) : 0;
          const fill = sp > 0.001 ? alpha(C.rose, 0.25 + 0.6 * sp) : b > 0.001 ? alpha(C.amber, 0.2 + 0.55 * b) : alpha(C.ink900, 0.9);
          const border = sp > 0.001 ? alpha(C.rose, 0.5 + 0.5 * sp) : b > 0.001 ? alpha(C.amber, 0.45 + 0.5 * b) : C.ink600;
          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: 'absolute',
                left: cell.x,
                top: cell.y,
                width: cell.size,
                height: cell.size,
                boxSizing: 'border-box',
                borderRadius: RADIUS.sm,
                border: `2px solid ${border}`,
                background: fill,
                transform: `scale(${1 + 0.12 * Math.max(sp, b) * (1 - Math.max(sp, b))})`,
              }}
            />
          );
        }),
      )}
      {/* The brute-force row's outline (from its account icon to the last cell) */}
      {bg > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: matrixCell(MATRIX_GRID.bruteRow, 0).y - 7,
            width: gridLeft - 40 + gridW + 7,
            height: MATRIX_GRID.cell + 14,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.amber, 0.9 * bg)}`,
            boxShadow: `0 0 ${Math.round(26 * bg)}px ${alpha(C.amber, 0.4 * bg)}`,
          }}
        />
      ) : null}
      {/* The spraying column's outline */}
      {sg > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: matrixCell(0, MATRIX_GRID.sprayCol).x - 7,
            top: MATRIX_GRID.top - 7,
            width: MATRIX_GRID.cell + 14,
            height: gridH + 14,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.rose, 0.9 * sg)}`,
            boxShadow: `0 0 ${Math.round(30 * sg)}px ${alpha(C.rose, 0.45 * sg)}`,
          }}
        />
      ) : null}
    </div>
  );
}
