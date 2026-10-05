import { C, alpha } from '../../../../../engine/src/theme/tokens';

/**
 * Two small drawings for s09's `complements` cards, drawn here (no part is ever imported from another video):
 * - `MatrixGlyph`: ATT&CK as a matrix — columns of cells, a few lit (technique by technique). No tactic or technique
 *   names: it is a shape, not data.
 * - `DiamondGlyph`: the Diamond Model as a four-corner diamond with EMPTY vertices (Lab 2B is not touched).
 * `draw` (0–1) builds each one in.
 */
export function MatrixGlyph({ width = 200, height = 150, draw = 1, color = C.sky }: { width?: number; height?: number; draw?: number; color?: string }) {
  const cols = 6;
  const rows = 5;
  const gap = 6;
  const cw = (width - gap * (cols - 1)) / cols;
  const ch = (height - gap * (rows - 1)) / rows;
  // Deterministic lit cells (a path through the matrix, one per column).
  const lit = [1, 0, 2, 1, 3, 2];
  // Column heights vary like a real matrix.
  const depth = [5, 3, 4, 5, 2, 4];
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {Array.from({ length: cols }).map((_, c) =>
        Array.from({ length: depth[c] }).map((__, r) => {
          const k = c * rows + r;
          const show = Math.max(0, Math.min(1, draw * (cols * rows) * 1.1 - k * 0.9));
          const on = lit[c] === r;
          return (
            <rect
              key={`${c}-${r}`}
              x={c * (cw + gap)}
              y={r * (ch + gap)}
              width={cw}
              height={ch}
              rx={4}
              fill={on ? alpha(color, 0.55) : alpha(C.ink600, 0.55)}
              stroke={on ? color : alpha(C.ink500, 0.8)}
              strokeWidth={on ? 2.5 : 1.5}
              opacity={show}
            />
          );
        }),
      )}
    </svg>
  );
}

export function DiamondGlyph({ size = 160, draw = 1, color = C.violet }: { size?: number; draw?: number; color?: string }) {
  const h = size;
  const w = size * 1.2;
  const cx = w / 2;
  const cy = h / 2;
  const pts = [
    { x: cx, y: 10 },
    { x: w - 12, y: cy },
    { x: cx, y: h - 10 },
    { x: 12, y: cy },
  ];
  const perim = pts.reduce((acc, p, i) => {
    const q = pts[(i + 1) % 4];
    return acc + Math.hypot(q.x - p.x, q.y - p.y);
  }, 0);
  const d = `M ${pts.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <line x1={pts[0].x} y1={pts[0].y} x2={pts[2].x} y2={pts[2].y} stroke={alpha(color, 0.3)} strokeWidth={2} strokeDasharray="6 6" opacity={draw} />
      <line x1={pts[1].x} y1={pts[1].y} x2={pts[3].x} y2={pts[3].y} stroke={alpha(color, 0.3)} strokeWidth={2} strokeDasharray="6 6" opacity={draw} />
      <path d={d} fill={alpha(color, 0.06)} stroke={color} strokeWidth={4} strokeLinejoin="round" strokeDasharray={perim} strokeDashoffset={perim * (1 - draw)} />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={13}
          fill={C.ink900}
          stroke={color}
          strokeWidth={3.5}
          opacity={Math.max(0, Math.min(1, draw * 4 - i * 0.7))}
        />
      ))}
    </svg>
  );
}
