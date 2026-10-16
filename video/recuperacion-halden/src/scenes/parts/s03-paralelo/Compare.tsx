import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { COMPARE } from '../../../data/s03-paralelo';

/**
 * s03 `compare`: production's output and the backup's, column by column. No figures anywhere
 * (anti-spoilers): each column is a pair of identical glyphs, one per row, and an emerald check
 * pops under it once the pair has been compared. The third row's label «igual» lands on the word.
 *   cols[i]   0–1 column i appears (both cells together)
 *   checks[i] 0–1 column i's check
 *   same      0–1 the «igual» label
 */

const GLYPHS: readonly IconName[] = ['file', 'database', 'key', 'chart'];

export const COMPARE_W = 760;
export const COMPARE_H = 214;

const LABEL_W = 236;
const CELL_W = 110;
const CELL_H = 62;
const COL_GAP = 20;
const ROW_GAP = 12;

export function Compare({ show, cols, checks, same }: { show: number; cols: readonly number[]; checks: readonly number[]; same: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const rowTone = [C.cyan, C.sky];
  const rowText = [C.cyanSoft, '#7dd3fc'];
  return (
    <div style={{ position: 'relative', width: COMPARE_W, height: COMPARE_H, fontFamily: FONT.sans, opacity: s }}>
      {/* row labels */}
      {COMPARE.rows.map((r, ri) => (
        <div
          key={r}
          style={{
            position: 'absolute',
            left: 0,
            width: LABEL_W - 20,
            top: ri * (CELL_H + ROW_GAP),
            height: CELL_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            fontSize: 36,
            fontWeight: 780,
            color: rowText[ri],
            whiteSpace: 'nowrap',
          }}
        >
          {r}
        </div>
      ))}
      {/* «igual» */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: LABEL_W - 20,
          top: 2 * (CELL_H + ROW_GAP),
          height: CELL_H - 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          fontSize: 40,
          fontWeight: 850,
          color: '#6ee7b7',
          opacity: clamp01(same),
          transform: `translateX(${(1 - clamp01(same)) * -10}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        {COMPARE.same}
      </div>

      {GLYPHS.map((g, i) => {
        const c = clamp01(cols[i] ?? 0);
        const k = clamp01(checks[i] ?? 0);
        const x = LABEL_W + i * (CELL_W + COL_GAP);
        return (
          <div key={g} style={{ position: 'absolute', left: x, top: 0, width: CELL_W, height: COMPARE_H }}>
            {/* column outline once checked */}
            <div
              style={{
                position: 'absolute',
                left: -6,
                top: -6,
                width: CELL_W + 12,
                height: 2 * CELL_H + ROW_GAP + 12,
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(C.emerald, 0.7 * k)}`,
                background: alpha(C.emerald, 0.08 * k),
              }}
            />
            {[0, 1].map((ri) => (
              <div
                key={ri}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: ri * (CELL_H + ROW_GAP),
                  width: CELL_W,
                  height: CELL_H,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.sm,
                  border: `2.5px solid ${alpha(rowTone[ri], 0.8)}`,
                  background: alpha(C.ink900, 0.95),
                  display: 'grid',
                  placeItems: 'center',
                  opacity: c,
                  transform: `translateY(${(1 - c) * (ri === 0 ? -10 : 10)}px)`,
                }}
              >
                <Icon name={g} size={36} color={rowText[ri]} strokeWidth={2.2} />
              </div>
            ))}
            <div
              style={{
                position: 'absolute',
                left: (CELL_W - 52) / 2,
                top: 2 * (CELL_H + ROW_GAP) + 3,
                width: 52,
                height: 52,
                borderRadius: 26,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.emeraldDeep, 0.9),
                border: `3px solid ${C.emerald}`,
                boxShadow: `0 0 18px ${alpha(C.emerald, 0.45)}`,
                opacity: k,
                transform: `scale(${0.6 + 0.4 * k})`,
              }}
            >
              <Icon name="check" size={34} color="#a7f3d0" strokeWidth={3.2} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
