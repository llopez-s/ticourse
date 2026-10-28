import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { INGREDIENT, type Ingredient, type Piece, type RawLine } from './data';

/** Average advance of the monospace font as a fraction of its size (JetBrains Mono). */
export const MONO_EM = 0.6;

/** Characters that fit on a line of `width` px at `size` px. */
export function charsPerLine(width: number, size: number): number {
  return Math.floor(width / (size * MONO_EM));
}

/** Lines a raw line needs at that width (it wraps by character, text unchanged). */
export function wrappedRows(line: RawLine, width: number, size: number): number {
  const n = line.reduce((s, p) => s + p.t.length, 0);
  // Lines break at spaces and after commas, so leave some slack over the exact character count.
  return Math.max(1, Math.ceil((n * 1.1) / charsPerLine(width, size)));
}

/** A highlight on a field (a later scene points at `action`, `bytes_out`, `src`…). `w` is 0–1. */
export interface FieldMark {
  w: number;
  tone: string;
}

interface Look {
  /** Box colour and weight, or null when the piece is not boxed. */
  box: { color: string; w: number } | null;
  /** Key under which neighbouring pieces merge into one box. */
  groupKey: string | null;
}

function lookOf(piece: Piece, ings: Partial<Record<Ingredient, number>>, marks: Record<string, FieldMark>): Look {
  if (piece.ing && (ings[piece.ing] ?? 0) > 0.001) {
    return { box: { color: INGREDIENT[piece.ing].color, w: clamp01(ings[piece.ing] ?? 0) }, groupKey: `i:${piece.ing}:${piece.field ?? ''}` };
  }
  if (piece.field && marks[piece.field] && marks[piece.field].w > 0.001) {
    return { box: { color: marks[piece.field].tone, w: clamp01(marks[piece.field].w) }, groupKey: `f:${piece.field}` };
  }
  return { box: null, groupKey: null };
}

/**
 * The text of one raw log line, character for character, wrapped by the box it sits in (no horizontal scroll, no
 * ellipsis). Layers, each driven by a 0–1 weight:
 *  - `syntax` colours the structure: JSON keys and CSV commas stand out (s02 `json` / `csv`);
 *  - `ings` boxes the pieces that are one of the five ingredients (s03);
 *  - `marks` boxes any field by name (s09 `action`, `bytes_out`; s07 `src`/`dst`).
 * The line is a block of inline spans so a box can wrap onto the next row with the text.
 */
export function RawText({
  line,
  size = 24,
  syntax = 0,
  ings = {},
  marks = {},
  color = C.text,
  style,
}: {
  line: RawLine;
  size?: number;
  syntax?: number;
  ings?: Partial<Record<Ingredient, number>>;
  marks?: Record<string, FieldMark>;
  color?: string;
  style?: CSSProperties;
}) {
  const s = clamp01(syntax);
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < line.length) {
    const look = lookOf(line[i], ings, marks);
    if (look.groupKey === null) {
      nodes.push(<Span key={i} piece={line[i]} s={s} base={color} />);
      i += 1;
      continue;
    }
    let j = i;
    while (j < line.length && lookOf(line[j], ings, marks).groupKey === look.groupKey) j += 1;
    const box = look.box!;
    nodes.push(
      <span
        key={i}
        style={{
          background: alpha(box.color, 0.26 * box.w),
          boxShadow: `0 0 0 ${2 * box.w}px ${alpha(box.color, 0.9 * box.w)}`,
          borderRadius: 6,
          padding: '2px 0',
          color: C.textStrong,
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
        }}
      >
        {line.slice(i, j).map((p, k) => (
          <Span key={k} piece={p} s={s * 0.6} base={C.textStrong} />
        ))}
      </span>,
    );
    i = j;
  }
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontSize: size,
        lineHeight: 1.5,
        color,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        ...style,
      }}
    >
      {nodes}
    </div>
  );
}

function Span({ piece, s, base }: { piece: Piece; s: number; base: string }) {
  let color = base;
  let weight = 450;
  if (s > 0.001 && piece.syn) {
    if (piece.syn === 'key') {
      color = mixColor(base, C.cyanSoft, s);
      weight = 650;
    } else if (piece.syn === 'sep') {
      color = mixColor(base, C.amber, s);
    }
  }
  return (
    <>
      <span style={{ color, fontWeight: weight, position: piece.tag ? 'relative' : undefined }}>
        {piece.t}
        {piece.tag ? (
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '100%',
              transform: 'translateX(-50%)',
              marginTop: -4,
              fontFamily: FONT.sans,
              fontSize: 19,
              fontWeight: 650,
              lineHeight: 1,
              color: C.muted,
              whiteSpace: 'nowrap',
            }}
          >
            {piece.tag}
          </span>
        ) : null}
      </span>
      {piece.t === ',' ? <wbr /> : null}
    </>
  );
}

/** Blend two #rrggbb colours (t = 0 → a, 1 → b). */
export function mixColor(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = parseInt(a.slice(1, 7), 16);
  const pb = parseInt(b.slice(1, 7), 16);
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) * (1 - k) + ((pb >> shift) & 255) * k);
  return `#${[16, 8, 0].map((sh) => ch(sh).toString(16).padStart(2, '0')).join('')}`;
}
