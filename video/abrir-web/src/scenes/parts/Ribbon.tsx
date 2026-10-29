import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../engine/src/ui';
import { PIECES, type Piece } from './data';

/**
 * The five-piece ribbon (the video's thread): a strip of five boxes «DHCP · DNS · TCP · TLS · HTTP» at the top of
 * the stage. OFF = dashed grey; LIT = cyan, and it stays lit. Every scene from s02 on draws it (stage-local
 * y 0–RIBBON_H), with the pieces lit by the earlier scenes already at 1.
 *
 * Props
 *   - `lit`     per piece, 0–1 (build it with `ribbonLit()`): how lit the piece is.
 *   - `point`   per piece, 0–1: a bright ring on a piece that is still off (s01 «las cinco casillas se señalan»).
 *   - `show`    0–1 opacity of the whole strip.
 *   - `width`   default the stage width (1728).
 *
 * `ribbonLayout(width)` gives each box's rect (stage-local, strip origin = 0,0), so s09 can morph the strip into
 * its three-column table (keep the same box order and size).
 */

export const RIBBON_H = 72;
export const RIBBON_BOX_W = 280;

export type RibbonLit = Partial<Record<Piece, number>>;

export function ribbonLayout(width = 1728): Record<Piece, { x: number; y: number; w: number; h: number }> {
  const gap = (width - PIECES.length * RIBBON_BOX_W) / (PIECES.length - 1);
  const out = {} as Record<Piece, { x: number; y: number; w: number; h: number }>;
  PIECES.forEach((p, i) => {
    out[p] = { x: i * (RIBBON_BOX_W + gap), y: 0, w: RIBBON_BOX_W, h: RIBBON_H };
  });
  return out;
}

/**
 * Lit values from the frames at which each piece lights. Pieces in `already` come from earlier scenes (1).
 * Example: ribbonLit(frame, { DNS: cue('wrap') }, ['DHCP']).
 */
export function ribbonLit(frame: number, at: Partial<Record<Piece, number>>, already: readonly Piece[] = [], duration = 16): RibbonLit {
  const out: RibbonLit = {};
  for (const p of PIECES) {
    if (already.includes(p)) out[p] = 1;
    else out[p] = at[p] === undefined ? 0 : progress(frame, at[p] as number, duration);
  }
  return out;
}

export function Ribbon({
  lit = {},
  point = {},
  show = 1,
  width = 1728,
  frame: frameProp,
  style,
}: {
  lit?: RibbonLit;
  point?: RibbonLit;
  show?: number;
  width?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  void frame;
  const L = ribbonLayout(width);
  const s = clamp01(show);
  if (s <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width, height: RIBBON_H, opacity: s, fontFamily: FONT.sans, ...style }}>
      {/* the thread between boxes */}
      <svg width={width} height={RIBBON_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {PIECES.slice(0, -1).map((p, i) => {
          const a = L[p];
          const b = L[PIECES[i + 1]];
          const on = Math.min(clamp01(lit[p] ?? 0), clamp01(lit[PIECES[i + 1]] ?? 0));
          return (
            <line
              key={p}
              x1={a.x + a.w}
              x2={b.x}
              y1={RIBBON_H / 2}
              y2={RIBBON_H / 2}
              stroke={on > 0.5 ? alpha(C.cyan, 0.8) : C.ink600}
              strokeWidth={on > 0.5 ? 4 : 3}
              strokeDasharray={on > 0.5 ? undefined : '8 8'}
            />
          );
        })}
      </svg>
      {PIECES.map((p, i) => {
        const r = L[p];
        const l = clamp01(lit[p] ?? 0);
        const pt = clamp01(point[p] ?? 0);
        const border = l > 0.02 ? alpha(C.cyan, 0.35 + 0.55 * l) : pt > 0.02 ? alpha(C.textStrong, 0.35 + 0.5 * pt) : C.ink600;
        return (
          <div
            key={p}
            style={{
              position: 'absolute',
              left: r.x,
              top: 0,
              width: r.w,
              height: r.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `3px ${l > 0.5 || pt > 0.5 ? 'solid' : 'dashed'} ${border}`,
              background: l > 0.02 ? alpha(C.cyan, 0.05 + 0.14 * l) : alpha(C.ink850, 0.7),
              boxShadow:
                l > 0.02
                  ? `0 0 ${Math.round(26 * l)}px ${alpha(C.cyan, 0.4 * l)}`
                  : pt > 0.02
                    ? `0 0 ${Math.round(22 * pt)}px ${alpha(C.textStrong, 0.25 * pt)}`
                    : undefined,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              transform: `scale(${1 + 0.05 * pt * (1 - l)})`,
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 800, color: l > 0.5 ? C.cyanSoft : C.faint, opacity: 0.9 }}>{i + 1}</span>
            <span
              style={{
                fontSize: 40,
                fontWeight: 850,
                letterSpacing: 3,
                color: l > 0.02 ? (l > 0.5 ? C.textStrong : C.text) : pt > 0.02 ? C.text : C.faint,
              }}
            >
              {p}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * One box of the ribbon, drawn at any rect (stage-local). s09 draws the five boxes itself at ribbonLayout() rects
 * and mixes them to the table's row heads, so the strip really BECOMES the table (do not draw Ribbon too).
 * Same look as the ribbon's boxes; lit is 0-1.
 */
export function RibbonBox({
  piece,
  rect,
  lit = 1,
  fontSize = 40,
  showNumber = true,
}: {
  piece: Piece;
  rect: { x: number; y: number; w: number; h: number };
  lit?: number;
  fontSize?: number;
  showNumber?: boolean;
}) {
  const l = clamp01(lit);
  const idx = PIECES.indexOf(piece);
  return (
    <div
      style={{
        position: 'absolute',
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px ${l > 0.5 ? 'solid' : 'dashed'} ${l > 0.02 ? alpha(C.cyan, 0.35 + 0.55 * l) : C.ink600}`,
        background: l > 0.02 ? alpha(C.cyan, 0.05 + 0.14 * l) : alpha(C.ink850, 0.7),
        boxShadow: l > 0.02 ? `0 0 ${Math.round(26 * l)}px ${alpha(C.cyan, 0.4 * l)}` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        fontFamily: FONT.sans,
      }}
    >
      {showNumber ? <span style={{ fontSize: 24, fontWeight: 800, color: l > 0.5 ? C.cyanSoft : C.faint, opacity: 0.9 }}>{idx + 1}</span> : null}
      <span style={{ fontSize, fontWeight: 850, letterSpacing: 3, color: l > 0.5 ? C.textStrong : C.faint }}>{piece}</span>
    </div>
  );
}
