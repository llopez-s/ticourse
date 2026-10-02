import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { MATRIX_COLUMNS } from '../../../data/s01-hook';

const ROWS = 3;

/**
 * An empty ATT&CK matrix sketch (grey): one column per tactic with its header
 * written bottom-up, and a few blank technique cells. The video's four
 * tactics are a lighter grey than the three generic columns. `glow` (0–1)
 * brightens the frame when the voice is on it.
 */
export function MatrixSketch({ width, height, show, glow = 0 }: { width: number; height: number; show: number; glow?: number }) {
  const n = MATRIX_COLUMNS.length;
  const gap = 7;
  const colW = (width - (n - 1) * gap) / n;
  const cellsH = ROWS * 26 + (ROWS - 1) * 6;
  const headH = height - cellsH - 12;
  return (
    <div style={{ position: 'relative', width, height }}>
      {MATRIX_COLUMNS.map((c, i) => {
        const p = Math.max(0, Math.min(1, show * (n + 2) / 3 - i * 0.3));
        if (p <= 0) return null;
        const x = i * (colW + gap);
        const tone = c.ours ? C.muted : C.faint;
        return (
          <div key={c.name} style={{ position: 'absolute', left: x, top: 0, width: colW, height, opacity: p * (c.ours ? 1 : 0.55) }}>
            {/* Header (reads bottom-up) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: colW,
                height: headH,
                boxSizing: 'border-box',
                borderRadius: 8,
                border: `2px solid ${alpha(tone, 0.45 + 0.3 * glow)}`,
                background: alpha(C.ink800, 0.9),
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 10,
              }}
            >
              <span
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontFamily: FONT.sans,
                  fontSize: 20,
                  fontWeight: 700,
                  color: tone,
                  whiteSpace: 'nowrap',
                  letterSpacing: 0.3,
                }}
              >
                {c.name}
              </span>
            </div>
            {/* Blank technique cells */}
            {Array.from({ length: ROWS }, (_, r) => (
              <div
                key={r}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: headH + 12 + r * 32,
                  width: colW,
                  height: 26,
                  borderRadius: 5,
                  border: `2px dashed ${alpha(tone, 0.35)}`,
                  opacity: Math.max(0, Math.min(1, (p - 0.3) * 2 - r * 0.15)),
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
