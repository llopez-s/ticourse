import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The sheet's three readable lines (s01's goal), the same wherever the sheet appears. */
export const SHEET_LINES = ['solo los servicios necesarios', 'contraseñas', 'qué se registra'] as const;

/** Geometry at the base width; everything scales with `width`. */
const BASE_W = 520;
const PAD_X = 30;
const HEADER_H = 76;
const LINE_H = 54;
const BAR_H = 54;
const PAD_BOTTOM = 26;

export function sheetHeight(width: number, bars = 0): number {
  const s = width / BASE_W;
  return Math.round((HEADER_H + 14 + SHEET_LINES.length * LINE_H + bars * BAR_H + PAD_BOTTOM) * s);
}

/** Top (in sheet pixels) of grey bar `i`, to hang a note or a strike beside it. */
export function sheetBarY(width: number, i: number): number {
  const s = width / BASE_W;
  return Math.round((HEADER_H + 14 + SHEET_LINES.length * LINE_H + i * BAR_H + BAR_H / 2) * s);
}

/**
 * The secure baseline as a sheet of paper: a pale page with the header «baseline» and its three readable lines, each
 * with a cyan tick. Optional `bars` are grey, unreadable settings lines (the guide's, in s02) that can be struck
 * (`struck[i]` 0–1 draws the strike left to right). `lineIn` fades the lines in one by one; `glow` 0–1 haloes the page.
 */
export function BaselineSheet({
  width,
  lineIn = [1, 1, 1],
  bars = 0,
  barIn = 1,
  struck = [],
  glow = 0,
  title = 'baseline',
}: {
  width: number;
  lineIn?: readonly number[];
  bars?: number;
  barIn?: number;
  struck?: readonly number[];
  glow?: number;
  title?: string;
}) {
  const s = width / BASE_W;
  const h = sheetHeight(width, bars);
  const g = clamp01(glow);
  const ink = '#1e293b';
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 14 * s,
        background: 'linear-gradient(180deg, #e8eef6 0%, #d5deea 100%)',
        border: `${Math.max(2, 3 * s)}px solid ${alpha(C.cyan, 0.35 + 0.55 * g)}`,
        boxShadow: `0 ${18 * s}px ${44 * s}px ${alpha('#000000', 0.45)}${g > 0.02 ? `, 0 0 ${Math.round(40 * g)}px ${alpha(C.cyan, 0.35 * g)}` : ''}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
      }}
    >
      {/* folded corner */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 46 * s,
          height: 46 * s,
          background: 'linear-gradient(225deg, #0c1322 0%, #0c1322 50%, #b6c3d6 50%, #c9d4e3 100%)',
        }}
      />
      {/* header */}
      <div
        style={{
          position: 'absolute',
          left: PAD_X * s,
          top: 18 * s,
          height: HEADER_H * s - 18 * s,
          display: 'flex',
          alignItems: 'center',
          gap: 14 * s,
          fontSize: 40 * s,
          fontWeight: 850,
          letterSpacing: -0.5,
          color: C.cyanDeep,
        }}
      >
        <div style={{ width: 12 * s, height: 40 * s, borderRadius: 4 * s, background: C.cyanDeep }} />
        {title}
      </div>
      <div style={{ position: 'absolute', left: PAD_X * s, right: PAD_X * s, top: HEADER_H * s, height: 3 * s, background: alpha(ink, 0.25) }} />

      {/* readable lines */}
      {SHEET_LINES.map((text, i) => {
        const o = clamp01(lineIn[i] ?? 1);
        return (
          <div
            key={text}
            style={{
              position: 'absolute',
              left: PAD_X * s,
              top: (HEADER_H + 14 + i * LINE_H) * s,
              height: LINE_H * s,
              display: 'flex',
              alignItems: 'center',
              gap: 14 * s,
              fontSize: 29 * s,
              fontWeight: 700,
              color: ink,
              whiteSpace: 'nowrap',
              opacity: o,
              transform: `translateX(${(1 - o) * 12 * s}px)`,
            }}
          >
            <svg width={26 * s} height={26 * s} viewBox="0 0 26 26">
              <circle cx={13} cy={13} r={12} fill={alpha(C.cyanDeep, 0.18)} stroke={C.cyanDeep} strokeWidth={2.5} />
              <path d="M 7 13.5 L 11.5 18 L 19 9" fill="none" stroke={C.cyanDeep} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {text}
          </div>
        );
      })}

      {/* grey, unreadable settings lines (the guide's), optionally struck */}
      {Array.from({ length: bars }, (_, i) => {
        const y = (HEADER_H + 14 + SHEET_LINES.length * LINE_H + i * BAR_H) * s;
        const st = clamp01(struck[i] ?? 0);
        const barW = (BASE_W - 2 * PAD_X - 40 - (i % 2) * 70) * s;
        return (
          <div key={i} style={{ position: 'absolute', left: PAD_X * s, top: y, height: BAR_H * s, width: (BASE_W - 2 * PAD_X) * s, opacity: clamp01(barIn) }}>
            <div style={{ position: 'absolute', left: 0, top: (BAR_H / 2 - 13) * s, width: 26 * s, height: 26 * s, borderRadius: 13 * s, border: `${2.5 * s}px solid ${alpha(ink, 0.35)}` }} />
            <div style={{ position: 'absolute', left: 40 * s, top: (BAR_H / 2 - 8) * s, width: barW, height: 16 * s, borderRadius: 8 * s, background: alpha(ink, 0.28 - 0.12 * st) }} />
            {st > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: -6 * s,
                  top: (BAR_H / 2 - 3) * s,
                  width: (barW + 54 * s) * st,
                  height: 6 * s,
                  borderRadius: 3 * s,
                  background: '#d97706',
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
