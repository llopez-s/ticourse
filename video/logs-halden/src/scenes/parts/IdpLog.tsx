import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { IDP, type IdpLine } from '../../data/s02-spray';

/**
 * The IdP's sign-in log («IdP de Halden», never a hostname) as a column
 * table, so each column the voice points at (time, user, src) can be boxed.
 * Monospace; the columns sit on a character grid (JetBrains Mono advance =
 * 0.6 em). Not positioned. All states are 0–1 weights.
 */

export type IdpColumn = 'date' | 'time' | 'result' | 'user' | 'src' | 'reason';

const MONO_EM = 0.6;
/** Column start (in characters) and width (in characters). */
const COLS: Record<IdpColumn, { at: number; chars: number }> = {
  date: { at: 0, chars: 10 },
  time: { at: 11, chars: 8 },
  result: { at: 21, chars: 10 },
  user: { at: 33, chars: 14 },
  src: { at: 49, chars: 15 },
  reason: { at: 66, chars: 19 },
};
const LINE_CHARS = 85;

export const IDP_LOG = {
  titleH: 64,
  padX: 30,
  padTop: 16,
  padBottom: 18,
} as const;

/** Panel width that fits a full line at `size` px. */
export function idpLogWidth(size: number): number {
  return Math.ceil(2 * IDP_LOG.padX + LINE_CHARS * size * MONO_EM);
}

export function idpLogHeight(rows: number, pitch: number): number {
  return IDP_LOG.titleH + IDP_LOG.padTop + rows * pitch + IDP_LOG.padBottom;
}

/** A column's box in px, relative to the panel's top-left (x, width), for text at `size` px. */
export function idpColumn(col: IdpColumn, size: number): { x: number; width: number; centre: number } {
  const cw = size * MONO_EM;
  const c = COLS[col];
  const x = IDP_LOG.padX + c.at * cw;
  return { x, width: c.chars * cw, centre: x + (c.chars * cw) / 2 };
}

/** Top of row i, relative to the panel's top-left. */
export function idpRowTop(i: number, pitch: number): number {
  return IDP_LOG.titleH + IDP_LOG.padTop + i * pitch;
}

export interface ColumnMark {
  col: IdpColumn;
  /** 0–1: the box around the column. */
  on: number;
  tone: string;
}

export interface RowLook {
  /** 0–1: the row has appeared (fade + slide). */
  show?: number;
  /** 0–1: the row steps back. */
  dim?: number;
  /** 0–1: a box around the whole row. */
  mark?: number;
  markTone?: string;
}

export function IdpLog({
  lines,
  size = 32,
  pitch = 50,
  width,
  open = 1,
  rows = [],
  marks = [],
  chromeDim = 0,
  style,
}: {
  lines: readonly IdpLine[];
  size?: number;
  pitch?: number;
  width?: number;
  /** 0–1: the panel unfolds from its title bar. */
  open?: number;
  rows?: readonly RowLook[];
  marks?: readonly ColumnMark[];
  /** 0–1: steps the frame and title back (not the rows). */
  chromeDim?: number;
  style?: CSSProperties;
}) {
  const w = width ?? idpLogWidth(size);
  const h = idpLogHeight(lines.length, pitch);
  const op = clamp01(open);
  const cd = clamp01(chromeDim);
  const rowsTop = idpRowTop(0, pitch);
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        fontFamily: FONT.sans,
        clipPath: `inset(0 0 ${(1 - op) * (h - IDP_LOG.titleH) * (100 / h)}% 0 round ${RADIUS.lg}px)`,
        ...style,
      }}
    >
      {/* Frame */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.cyan, 0.4 - 0.2 * cd)}`,
          background: `linear-gradient(180deg, ${alpha(C.ink850, 0.97)} 0%, ${alpha(C.ink950, 0.97)} 100%)`,
          boxShadow: `0 30px 70px ${alpha('#000000', 0.42)}`,
        }}
      />
      {/* Title bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: IDP_LOG.titleH,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: `0 ${IDP_LOG.padX}px`,
          borderBottom: `2px solid ${C.ink700}`,
          background: alpha(C.ink800, 0.9),
          borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`,
          whiteSpace: 'nowrap',
          opacity: 1 - 0.5 * cd,
        }}
      >
        <Icon name="shield" size={36} color={C.cyan} />
        <span style={{ fontSize: 34, fontWeight: 850, color: C.textStrong }}>{IDP.title}</span>
        <span style={{ fontSize: 30, fontWeight: 700, color: C.faint }}>·</span>
        <span style={{ fontSize: 30, fontWeight: 650, color: C.muted }}>{IDP.sub}</span>
      </div>
      {/* Column boxes (behind the text) */}
      {marks.map((m) => {
        const on = clamp01(m.on);
        if (on <= 0.001) return null;
        const c = idpColumn(m.col, size);
        return (
          <div
            key={m.col}
            style={{
              position: 'absolute',
              left: c.x - 10,
              top: rowsTop - 6,
              width: c.width + 20,
              height: lines.length * pitch + 4,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `3px solid ${alpha(m.tone, 0.25 + 0.65 * on)}`,
              background: alpha(m.tone, 0.1 * on),
              boxShadow: on > 0.3 ? `0 0 ${Math.round(24 * on)}px ${alpha(m.tone, 0.3 * on)}` : undefined,
            }}
          />
        );
      })}
      {/* Rows */}
      {lines.map((line, i) => {
        const look = rows[i] ?? {};
        const show = clamp01(look.show ?? 1);
        if (show <= 0.001) return null;
        const dim = clamp01(look.dim ?? 0);
        const mark = clamp01(look.mark ?? 0);
        const top = idpRowTop(i, pitch);
        const markOn = (col: IdpColumn) => clamp01(marks.find((m) => m.col === col)?.on ?? 0);
        const cell = (col: IdpColumn, text: string, color: string, weight = 600) => {
          if (!text) return null;
          const c = idpColumn(col, size);
          const lit = markOn(col);
          return (
            <span
              key={col}
              style={{
                position: 'absolute',
                left: c.x,
                top: 0,
                lineHeight: `${pitch}px`,
                fontFamily: FONT.mono,
                fontSize: size,
                fontWeight: lit > 0.5 ? 800 : weight,
                color,
                whiteSpace: 'pre',
              }}
            >
              {text}
            </span>
          );
        };
        const isOk = line.result.includes('OK');
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top,
              width: w,
              height: pitch,
              opacity: show * (1 - 0.68 * dim),
              transform: `translateY(${(1 - show) * 10}px)`,
            }}
          >
            {mark > 0.001 ? (
              <div
                style={{
                  position: 'absolute',
                  left: IDP_LOG.padX - 14,
                  top: 2,
                  width: w - 2 * IDP_LOG.padX + 28,
                  height: pitch - 4,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.sm,
                  border: `3px solid ${alpha(look.markTone ?? C.rose, 0.85 * mark)}`,
                  background: alpha(look.markTone ?? C.rose, 0.1 * mark),
                }}
              />
            ) : null}
            {cell('date', line.date, C.faint, 500)}
            {cell('time', line.time, markOn('time') > 0.5 ? C.cyanSoft : C.text)}
            {cell('result', line.result, isOk ? '#fda4af' : C.roseSoft, 750)}
            {cell('user', line.user, markOn('user') > 0.5 ? '#a5f3fc' : C.cyanSoft)}
            {cell('src', line.src, markOn('src') > 0.5 ? '#fecdd3' : C.roseSoft)}
            {cell('reason', line.reason, C.faint, 500)}
          </div>
        );
      })}
    </div>
  );
}
