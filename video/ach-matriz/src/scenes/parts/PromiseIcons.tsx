import type { CSSProperties, ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The three promise / rule icons (s01 promise, s10 rules, poster): the same
 * drawings wherever they appear.
 *   - `ListQuestionIcon`: a written list with a question mark — what you take
 *     for granted (rule 1, the Key Assumptions Check sheet).
 *   - `GridIcon`: a 3×3 grid with one C-cyan and one I-rose cell — the matrix
 *     (rule 2).
 *   - `TableIcon`: a table seen in profile on three legs, the centre one pulled
 *     down and dashed — pull the strongest proof, see if it holds (rule 3).
 *
 * Common props: `size` (px, square, default 120), `color` (main stroke,
 * default cyan), `accent` (the detail colour: the «?», the pulled leg; default
 * amber), `strokeWidth` (in the 64-unit viewBox, default 3.6), `draw` (0–1
 * progressive stroke reveal, default 1 = drawn), `style`. They are pure SVG:
 * drop them in RuleCards' `art`, a disc, or a chip. `PromiseIcon kind=…`
 * picks one by name.
 */

export interface PromiseIconProps {
  size?: number;
  color?: string;
  accent?: string;
  strokeWidth?: number;
  /** 0–1: strokes draw on (each path along its length). */
  draw?: number;
  style?: CSSProperties;
}

function Svg({ size, children, style }: { size: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, overflow: 'visible', ...style }} aria-hidden>
      {children}
    </svg>
  );
}

/** Stroke props that reveal a path along its length as `draw` goes 0→1. */
const reveal = (draw: number, delay = 0) => {
  const p = clamp01((draw - delay) / (1 - delay || 1));
  return p >= 1 ? {} : { pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - p };
};

/** A list with a question mark: what you take for granted. */
export function ListQuestionIcon({ size = 120, color = C.cyan, accent = C.amber, strokeWidth = 3.6, draw = 1, style }: PromiseIconProps) {
  const d = clamp01(draw);
  return (
    <Svg size={size} style={style}>
      {/* The sheet */}
      <path d="M12 6h26l8 8v40a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z" stroke={color} strokeWidth={strokeWidth} {...reveal(d)} />
      <path d="M38 6v8h8" stroke={color} strokeWidth={strokeWidth * 0.8} {...reveal(d, 0.2)} />
      {/* Three written lines with bullets */}
      {[22, 32, 42].map((y, i) => (
        <g key={y} opacity={d >= 0.3 + i * 0.1 ? 1 : 0}>
          <circle cx={15} cy={y} r={2.2} fill={color} stroke="none" />
          <path d={`M21 ${y}h${i === 2 ? 10 : 17}`} stroke={alpha(color, 0.85)} strokeWidth={strokeWidth * 0.85} {...reveal(d, 0.3 + i * 0.1)} />
        </g>
      ))}
      {/* The question mark, in a badge over the corner */}
      <circle cx={47} cy={46} r={13} fill={C.ink900} stroke={accent} strokeWidth={strokeWidth} {...reveal(d, 0.55)} />
      <path d="M42.6 42.3a4.6 4.6 0 1 1 6.6 4.1c-1.4.7-2.2 1.6-2.2 3.1v.6" stroke={accent} strokeWidth={strokeWidth} {...reveal(d, 0.65)} />
      <circle cx={47} cy={54.4} r={2} fill={accent} stroke="none" opacity={d >= 0.9 ? 1 : 0} />
    </Svg>
  );
}

/** A 3×3 grid with a C-cyan and an I-rose cell: the matrix. */
export function GridIcon({ size = 120, color = C.cyan, strokeWidth = 3.6, draw = 1, style }: PromiseIconProps) {
  const d = clamp01(draw);
  const cell = 16;
  const x0 = 8;
  const y0 = 8;
  return (
    <Svg size={size} style={style}>
      {/* Filled cells first (under the grid lines) */}
      <rect x={x0 + cell + 2} y={y0 + 2} width={cell - 4} height={cell - 4} rx={2.5} fill={alpha(C.cyan, 0.85)} opacity={d >= 0.6 ? 1 : 0} />
      <rect x={x0 + 2 * cell + 2} y={y0 + cell + 2} width={cell - 4} height={cell - 4} rx={2.5} fill={alpha(C.rose, 0.9)} opacity={d >= 0.7 ? 1 : 0} />
      <rect x={x0 + cell + 2} y={y0 + 2 * cell + 2} width={cell - 4} height={cell - 4} rx={2.5} fill={alpha(C.cyan, 0.85)} opacity={d >= 0.8 ? 1 : 0} />
      <rect x={x0 + 2} y={y0 + 2 * cell + 2} width={cell - 4} height={cell - 4} rx={2.5} fill={alpha('#94a3b8', 0.55)} opacity={d >= 0.85 ? 1 : 0} />
      <rect x={x0} y={y0} width={cell * 3} height={cell * 3} rx={4} stroke={color} strokeWidth={strokeWidth} {...reveal(d)} />
      <path d={`M${x0} ${y0 + cell}h${cell * 3}M${x0} ${y0 + 2 * cell}h${cell * 3}`} stroke={color} strokeWidth={strokeWidth * 0.75} {...reveal(d, 0.25)} />
      <path d={`M${x0 + cell} ${y0}v${cell * 3}M${x0 + 2 * cell} ${y0}v${cell * 3}`} stroke={color} strokeWidth={strokeWidth * 0.75} {...reveal(d, 0.35)} />
    </Svg>
  );
}

/** A table in profile on three legs, the centre leg pulled down (dashed): does it hold? */
export function TableIcon({ size = 120, color = C.cyan, accent = C.amber, strokeWidth = 3.6, draw = 1, style }: PromiseIconProps) {
  const d = clamp01(draw);
  return (
    <Svg size={size} style={style}>
      {/* Tabletop */}
      <rect x={5} y={16} width={54} height={8} rx={2} fill={alpha(color, 0.18)} stroke={color} strokeWidth={strokeWidth} {...reveal(d)} />
      {/* End legs */}
      <path d="M11 24v28M53 24v28" stroke={color} strokeWidth={strokeWidth * 1.15} {...reveal(d, 0.3)} />
      {/* The pulled centre leg: lower, dashed, in the accent */}
      <path d="M32 31v26" stroke={accent} strokeWidth={strokeWidth * 1.15} strokeDasharray="4 4" opacity={d >= 0.6 ? 1 : 0} />
      {/* Pull arrow */}
      <path d="M40 40v12M36.5 48.5 40 52l3.5-3.5" stroke={accent} strokeWidth={strokeWidth * 0.75} opacity={d >= 0.75 ? 1 : 0} />
      {/* Floor */}
      <path d="M4 58h56" stroke={alpha(color, 0.45)} strokeWidth={strokeWidth * 0.7} {...reveal(d, 0.5)} />
    </Svg>
  );
}

export type PromiseKind = 'list' | 'grid' | 'table';

/** Promise / rule icon by name (s01 order: list, grid, table). */
export function PromiseIcon({ kind, ...rest }: PromiseIconProps & { kind: PromiseKind }) {
  if (kind === 'list') return <ListQuestionIcon {...rest} />;
  if (kind === 'grid') return <GridIcon {...rest} />;
  return <TableIcon {...rest} />;
}

export const PROMISE_KINDS: readonly PromiseKind[] = ['list', 'grid', 'table'];
