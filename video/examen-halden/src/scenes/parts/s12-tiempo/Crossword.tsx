import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/*
 * The crossword of s12 (the video's one everyday image, tagged «imagen · no es del puerto») and its small echo in s13.
 * A grid of six words: the three EASY ones are filled first, the three HARD ones are left with a pencil ring and filled
 * when the learner comes back. Letters are a deterministic jumble that never forms a word; the clue list beside it is
 * skeleton bars (no readable clue). Pencil = the light graphite stroke (never a security colour).
 */

export interface CrossWord {
  /** Clue number as shown in the list (1–6). */
  n: number;
  dir: 'a' | 'd';
  r: number;
  c: number;
  len: number;
  easy: boolean;
}

export const CROSS_WORDS: readonly CrossWord[] = [
  { n: 1, dir: 'a', r: 0, c: 0, len: 6, easy: true },
  { n: 2, dir: 'd', r: 0, c: 1, len: 5, easy: false },
  { n: 3, dir: 'd', r: 0, c: 4, len: 5, easy: true },
  { n: 4, dir: 'a', r: 2, c: 2, len: 6, easy: false },
  { n: 5, dir: 'a', r: 4, c: 0, len: 5, easy: true },
  { n: 6, dir: 'd', r: 2, c: 6, len: 4, easy: false },
];

export const GRID = { cols: 8, rows: 6 } as const;

const JUMBLE = 'ESAROTNILDCMPUBGHFVJ';

interface Cell {
  r: number;
  c: number;
  /** Easy words that cover it (a cell may belong to both kinds: it fills with the first one done). */
  easy: boolean;
  /** Order inside its filling wave, for the stagger. */
  order: number;
  letter: string;
}

function buildCells(): Cell[] {
  const map = new Map<string, Cell>();
  let nEasy = 0;
  let nHard = 0;
  for (const w of [...CROSS_WORDS].sort((a, b) => Number(b.easy) - Number(a.easy))) {
    for (let k = 0; k < w.len; k++) {
      const r = w.r + (w.dir === 'd' ? k : 0);
      const c = w.c + (w.dir === 'a' ? k : 0);
      const key = `${r}:${c}`;
      if (map.has(key)) continue;
      map.set(key, { r, c, easy: w.easy, order: w.easy ? nEasy++ : nHard++, letter: JUMBLE[(r * 7 + c * 3 + k) % JUMBLE.length] });
    }
  }
  return [...map.values()];
}

export const CELLS = buildCells();
const N_EASY = CELLS.filter((c) => c.easy).length;
const N_HARD = CELLS.length - N_EASY;

/** A wobbly hand-drawn ring around a box (pencil). `t` 0–1 draws it. */
export function PencilRing({ x, y, w, h, t, stroke = 4 }: { x: number; y: number; w: number; h: number; t: number; stroke?: number }) {
  const rx = w / 2 + 6;
  const ry = h / 2 + 6;
  const cx = x + w / 2;
  const cy = y + h / 2;
  // Slightly open, slightly lopsided ellipse
  const d = `M ${cx - rx * 0.2} ${cy - ry} C ${cx + rx * 0.8} ${cy - ry * 1.05}, ${cx + rx * 1.08} ${cy - ry * 0.3}, ${cx + rx * 1.02} ${cy + ry * 0.2} C ${cx + rx * 0.95} ${cy + ry * 0.95}, ${cx + rx * 0.1} ${cy + ry * 1.12}, ${cx - rx * 0.7} ${cy + ry * 0.92} C ${cx - rx * 1.12} ${cy + ry * 0.7}, ${cx - rx * 1.08} ${cy - ry * 0.5}, ${cx - rx * 0.5} ${cy - ry * 0.95} C ${cx - rx * 0.3} ${cy - ry * 1.05}, ${cx + rx * 0.05} ${cy - ry * 0.98}, ${cx + rx * 0.2} ${cy - ry * 0.88}`;
  const len = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.12;
  return (
    <path
      d={d}
      fill="none"
      stroke={alpha(C.textStrong, 0.88)}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - clamp01(t))}
    />
  );
}

export function gridSize(cell: number) {
  return { w: GRID.cols * cell, h: GRID.rows * cell };
}

/**
 * The grid. `easy` / `hard` 0–1 = how much of each wave is filled (staggered per cell); `ring` 0–1 draws the pencil ring
 * on the first cell of each hard word; `show` fades the empty grid in. Cell size drives everything (22 for s13's icon).
 */
export function CrosswordGrid({ cell, show = 1, easy, hard, ring = 0, letters = true }: { cell: number; show?: number; easy: number; hard: number; ring?: number; letters?: boolean }) {
  const { w, h } = gridSize(cell);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible', opacity: show }}>
      {CELLS.map((cl) => {
        const wave = cl.easy ? easy : hard;
        const n = cl.easy ? N_EASY : N_HARD;
        const f = clamp01(wave * (n + 5) / 5 - cl.order / 5);
        const x = cl.c * cell;
        const y = cl.r * cell;
        return (
          <g key={`${cl.r}:${cl.c}`}>
            <rect x={x + 1.5} y={y + 1.5} width={cell - 3} height={cell - 3} rx={Math.max(3, cell * 0.1)} fill={f > 0.01 ? alpha(C.cyan, 0.08 + 0.26 * f) : alpha(C.ink800, 0.95)} stroke={f > 0.01 ? alpha(C.cyan, 0.45 + 0.4 * f) : alpha(C.ink500, 0.9)} strokeWidth={Math.max(2, cell * 0.05)} />
            {letters && f > 0.3 ? (
              <text x={x + cell / 2} y={y + cell / 2 + cell * 0.17} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={cell * 0.5} fill={C.textStrong} opacity={clamp01((f - 0.3) / 0.5)}>
                {cl.letter}
              </text>
            ) : null}
          </g>
        );
      })}
      {ring > 0
        ? CROSS_WORDS.filter((cw) => !cw.easy).map((cw) => (
            <PencilRing key={cw.n} x={cw.c * cell} y={cw.r * cell} w={cell} h={cell} t={ring} stroke={Math.max(3, cell * 0.075)} />
          ))
        : null}
    </svg>
  );
}

/** One row of the clue list: its number, a skeleton bar and (once done) a check. */
export function ClueList({ rowH = 52, width = 430, show, easy, hard, ring, pulse = 0 }: { rowH?: number; width?: number; show: number; easy: number; hard: number; ring: number; pulse?: number }) {
  const bars = [0.78, 0.9, 0.66, 0.84, 0.72, 0.6];
  return (
    <svg width={width} height={rowH * CROSS_WORDS.length} viewBox={`0 0 ${width} ${rowH * CROSS_WORDS.length}`} style={{ display: 'block', overflow: 'visible', opacity: show }}>
      {CROSS_WORDS.map((cw, i) => {
        const done = cw.easy ? easy : hard;
        const y = i * rowH;
        const cy = y + rowH / 2;
        const barW = (width - 96) * bars[i];
        const hardHint = !cw.easy && done < 0.5 ? pulse : 0;
        return (
          <g key={cw.n}>
            <circle cx={24} cy={cy} r={20} fill={alpha(C.ink800, 0.95)} stroke={alpha(done > 0.5 ? C.cyan : C.ink500, 0.9)} strokeWidth={3} />
            <text x={24} y={cy + 9} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={26} fill={C.textStrong}>
              {cw.n}
            </text>
            <rect x={64} y={cy - 9} width={barW} height={18} rx={9} fill={alpha(done > 0.5 ? C.cyan : C.ink500, done > 0.5 ? 0.55 : 0.55)} stroke={hardHint > 0.01 ? alpha(C.textStrong, 0.7 * hardHint) : 'none'} strokeWidth={3} strokeDasharray="8 7" />
            {done > 0.5 ? <path d={`M ${width - 34} ${cy} l 8 9 l 18 -19`} fill="none" stroke={C.cyanSoft} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
            {!cw.easy && ring > 0 ? <PencilRing x={4} y={cy - 20} w={40} h={40} t={ring} stroke={4} /> : null}
          </g>
        );
      })}
    </svg>
  );
}
