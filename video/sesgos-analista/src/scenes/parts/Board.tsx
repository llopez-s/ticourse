import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * A chessboard seen from above, 8×8, drawn in SVG, with plain pawn-like pieces (a disc on a base: no chess
 * glyphs, the fonts do not carry them). Squares are `tile` px; pieces sit at (col, row), 0–7.
 *
 * <Board tile mine others? ghosts? flagged? ghostAmount? realAmount? />
 *   mine           the player's pieces (cyan), on the left
 *   ghosts         the opponent's pieces as the player imagines them (dashed rose rings): in s04 the mirror
 *                  of `mine` — same rows, columns reflected
 *   others         the opponent's real pieces (solid rose), somewhere else
 *   flagged        index into `others` of the piece that is on a wrong square (amber ring)
 *   ghostAmount    0–1 opacity of the ghosts · realAmount 0–1 the real pieces coming in (they slide in from
 *                  the right edge)
 */
export type Cell = readonly [col: number, row: number];

function Piece({ cx, cy, r, color, solid = true }: { cx: number; cy: number; r: number; color: string; solid?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + r * 0.95} rx={r * 0.95} ry={r * 0.32} fill={solid ? alpha(color, 0.75) : 'none'} stroke={color} strokeWidth={solid ? 0 : 2.5} strokeDasharray={solid ? undefined : '5 4'} />
      <path
        d={`M ${cx - r * 0.55} ${cy + r * 0.9} L ${cx - r * 0.25} ${cy - r * 0.1} L ${cx + r * 0.25} ${cy - r * 0.1} L ${cx + r * 0.55} ${cy + r * 0.9} Z`}
        fill={solid ? alpha(color, 0.9) : 'none'}
        stroke={color}
        strokeWidth={solid ? 0 : 2.5}
        strokeDasharray={solid ? undefined : '5 4'}
        strokeLinejoin="round"
      />
      <circle cx={cx} cy={cy - r * 0.45} r={r * 0.42} fill={solid ? color : 'none'} stroke={color} strokeWidth={solid ? 0 : 2.5} strokeDasharray={solid ? undefined : '5 4'} />
    </g>
  );
}

export function Board({
  tile,
  mine,
  others = [],
  ghosts = [],
  flagged,
  ghostAmount = 1,
  realAmount = 0,
}: {
  tile: number;
  mine: readonly Cell[];
  others?: readonly Cell[];
  ghosts?: readonly Cell[];
  flagged?: number;
  ghostAmount?: number;
  realAmount?: number;
}) {
  const N = 8;
  const size = tile * N;
  const at = (c: Cell) => ({ x: c[0] * tile + tile / 2, y: c[1] * tile + tile / 2 });
  const r = tile * 0.34;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={-6} y={-6} width={size + 12} height={size + 12} rx={10} fill={C.ink900} stroke={alpha(C.cyan, 0.35)} strokeWidth={3} />
      {Array.from({ length: N * N }, (_, i) => {
        const c = i % N;
        const rw = Math.floor(i / N);
        return <rect key={i} x={c * tile} y={rw * tile} width={tile} height={tile} fill={(c + rw) % 2 === 0 ? C.ink700 : C.ink850} />;
      })}
      {mine.map((c, i) => (
        <Piece key={`m${i}`} cx={at(c).x} cy={at(c).y} r={r} color={C.cyan} />
      ))}
      <g opacity={ghostAmount}>
        {ghosts.map((c, i) => (
          <Piece key={`g${i}`} cx={at(c).x} cy={at(c).y} r={r} color={C.roseSoft} solid={false} />
        ))}
      </g>
      <g opacity={realAmount}>
        {others.map((c, i) => (
          <g key={`o${i}`} transform={`translate(${(1 - realAmount) * tile * 2} 0)`}>
            <Piece cx={at(c).x} cy={at(c).y} r={r} color={C.rose} />
            {flagged === i ? <circle cx={at(c).x} cy={at(c).y} r={tile * 0.62} fill="none" stroke="#fcd34d" strokeWidth={5} /> : null}
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Where the board's cells are inside its box (for placing labels next to a piece). */
export function cellCentre(tile: number, c: Cell) {
  return { x: c[0] * tile + tile / 2, y: c[1] * tile + tile / 2 };
}
