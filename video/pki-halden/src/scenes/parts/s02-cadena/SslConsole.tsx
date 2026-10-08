import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';
import type { ConsoleRowDef, RowTone } from '../../../data/s02-cadena';

/**
 * The OpenSSL console of s02 and s03 (V11's CurlConsole idiom, not the engine Terminal: the rows sit at fixed
 * offsets so nothing reflows when a line is pointed at). A title bar with the day/time stamp, the command typed
 * after a bare `$ `, and the output rows at texture size (22 px). What the voice points at is lifted by a
 * «lens»: an enlarged copy of the row (≥ 32 px) in its colour, over the row, with an optional tag. `fold`
 * collapses every row not in `keep` (and grows the kept ones), so the console can shrink to its evidence.
 * Not positioned; nothing reads the timeline.
 */

export const SSL = {
  headerH: 58,
  padX: 26,
  padTop: 12,
  padBottom: 14,
  cmdSize: 25,
  cmdH: 42,
  outSize: 22,
  rowH: 27,
  gapH: 12,
} as const;

/** JetBrains Mono's advance is 0.6 em. */
export const monoWidth = (text: string, size: number) => text.length * size * 0.6;

export interface SslRow extends ConsoleRowDef {
  /** Frame the row prints. */
  at: number;
}

export interface Lens {
  /** The row it lifts (its tag sits on this row's lens line). */
  row: string;
  /** More rows lifted together, stacked under `row` (e.g. the three `depth=` lines). */
  rows?: string[];
  /** Which way the enlarged box grows from the row: down (default: the row above stays readable), up, centre. */
  grow?: 'down' | 'up' | 'centre';
  /** 0–1: the lens opens. */
  p: number;
  tone: string;
  /** Font scale at full lens (22 px × scale). */
  scale?: number;
  tag?: { text: string; tone: string; p: number; place?: 'end' | 'below' };
}

export interface RowBox {
  from: string;
  to: string;
  p: number;
  tone: string;
  dashed?: boolean;
  /** Box width in px (default: the console's text width). */
  width?: number;
}

export interface RowTag {
  row: string;
  text: string;
  tone: string;
  p: number;
  /** Left edge in px from the console's left (default: after the row's text). */
  x?: number;
}

const TONE: Record<RowTone, string> = {
  texture: C.faint,
  plain: C.muted,
  warn: alpha(C.amber, 0.82),
  portal: C.muted,
  ca: C.muted,
  ok: alpha(C.emerald, 0.85),
  dim: alpha(C.faint, 0.75),
};

/** The bright colour a row takes when it is lit (`lit` 1). */
export const LIT: Record<RowTone, string> = {
  texture: C.text,
  plain: C.textStrong,
  warn: '#fde68a',
  portal: C.cyanSoft,
  ca: '#7dd3fc',
  ok: '#6ee7b7',
  dim: C.text,
};

function rowHeight(r: ConsoleRowDef, fold: number, keep: readonly string[], keepScale: number, rowH: number): number {
  if (keep.includes(r.id)) return rowH * mix(1, keepScale, fold);
  return (r.gap ? SSL.gapH : rowH) * (1 - fold);
}

/** Row tops (px from the console's top) and the console's height. */
export function sslLayout(rows: readonly ConsoleRowDef[], fold = 0, keep: readonly string[] = [], keepScale = 1, rowH: number = SSL.rowH) {
  const f = clamp01(fold);
  const top: Record<string, number> = {};
  const height: Record<string, number> = {};
  let y = SSL.headerH + SSL.padTop + SSL.cmdH;
  for (const r of rows) {
    const h = rowHeight(r, f, keep, keepScale, rowH);
    top[r.id] = y;
    height[r.id] = h;
    y += h;
  }
  return { top, height, total: y + SSL.padBottom };
}

export function SslConsole({
  width,
  stamp,
  cmd,
  typeAt,
  typeFrames,
  rows,
  frame,
  fold = 0,
  keep = [],
  keepScale = 1,
  lit = {},
  dimRest = 0,
  lenses = [],
  boxes = [],
  tags = [],
  glow = 0,
  glowTone = C.cyan,
  stampTone = C.cyan,
  cmdScale = 1,
  rowH = SSL.rowH,
  outSize = SSL.outSize,
  right,
}: {
  width: number;
  stamp: string;
  cmd: string;
  typeAt: number;
  typeFrames: number;
  rows: SslRow[];
  frame: number;
  fold?: number;
  keep?: readonly string[];
  keepScale?: number;
  /** Per row 0–1: the row takes its bright colour. */
  lit?: Record<string, number>;
  /** 0–1: rows that are neither lit nor lensed step back. */
  dimRest?: number;
  lenses?: Lens[];
  boxes?: RowBox[];
  tags?: RowTag[];
  glow?: number;
  glowTone?: string;
  stampTone?: string;
  /** Font scale of the command (it shrinks when the console folds). */
  cmdScale?: number;
  /** Output row height and font size (defaults 27 / 22). */
  rowH?: number;
  outSize?: number;
  right?: ReactNode;
}) {
  const f = clamp01(fold);
  const L = sslLayout(rows, f, keep, keepScale, rowH);
  const typed = Math.max(0, Math.min(cmd.length, Math.floor(((frame - typeAt) / Math.max(1, typeFrames)) * cmd.length)));
  const firstOut = rows.length ? Math.min(...rows.map((r) => r.at)) : Number.POSITIVE_INFINITY;
  const caret = frame < firstOut && (typed < cmd.length || Math.floor(frame / 15) % 2 === 0);
  const g = clamp01(glow);
  const textW = width - 2 * SSL.padX;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: L.total,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${g > 0.01 ? alpha(glowTone, 0.4 + 0.5 * g) : C.ink700}`,
        background: `linear-gradient(180deg, ${alpha(C.ink850, 0.98)} 0%, ${alpha(C.ink900, 0.98)} 100%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.42)}${g > 0.01 ? `, 0 0 ${Math.round(40 * g)}px ${alpha(glowTone, 0.3 * g)}` : ''}`,
        overflow: 'hidden',
        fontFamily: FONT.mono,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: SSL.headerH,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: `0 ${SSL.padX - 6}px`,
          background: C.ink800,
          borderBottom: `2px solid ${C.ink700}`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="terminal" size={32} color={C.muted} />
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 40,
            padding: '0 16px',
            borderRadius: RADIUS.md,
            border: `2px solid ${alpha(stampTone, 0.6)}`,
            background: alpha(stampTone, 0.1),
            fontFamily: FONT.mono,
            fontSize: 30,
            fontWeight: 800,
            color: stampTone === C.cyan ? C.cyanSoft : C.textStrong,
          }}
        >
          {stamp}
        </span>
        <span style={{ flex: 1 }} />
        {right}
      </div>

      {/* The command */}
      <div
        style={{
          position: 'absolute',
          left: SSL.padX,
          top: SSL.headerH + SSL.padTop,
          height: SSL.cmdH,
          display: 'flex',
          alignItems: 'center',
          fontSize: SSL.cmdSize * cmdScale,
          fontWeight: 700,
          whiteSpace: 'pre',
          opacity: 1 - 0.35 * clamp01(dimRest),
        }}
      >
        <span style={{ color: C.emerald }}>$ </span>
        <span style={{ color: C.textStrong }}>{cmd.slice(0, typed)}</span>
        {caret ? <span style={{ display: 'inline-block', width: 14 * cmdScale, height: 28 * cmdScale, marginLeft: 2, background: alpha(C.textStrong, 0.85) }} /> : null}
      </div>

      {/* Output rows */}
      {rows.map((r) => {
        const p = progress(frame, r.at, 4, EASE.out);
        const h = L.height[r.id];
        if (p <= 0 || h < 0.5 || r.gap) return null;
        const kept = keep.includes(r.id);
        const size = outSize * (kept ? mix(1, keepScale, f) : 1);
        const l = clamp01(lit[r.id] ?? 0);
        const lensed = lenses.some((ln) => (ln.row === r.id || ln.rows?.includes(r.id)) && ln.p > 0.5);
        const focus = Math.max(l, lensed ? 1 : 0);
        const fade = kept ? 1 : clamp01(1 - 1.6 * f);
        const op = p * fade * (1 - 0.62 * clamp01(dimRest) * (1 - focus));
        return (
          <div
            key={r.id}
            style={{
              position: 'absolute',
              left: SSL.padX,
              top: L.top[r.id],
              height: h,
              display: 'flex',
              alignItems: 'center',
              fontSize: size,
              fontWeight: l > 0.5 ? 700 : 500,
              color: l > 0.01 ? mixColour(TONE[r.tone], LIT[r.tone], l) : TONE[r.tone],
              whiteSpace: 'pre',
              opacity: op,
              transform: `translateY(${(1 - p) * 6}px)`,
            }}
          >
            {r.text}
          </div>
        );
      })}

      {/* Boxes around groups of rows */}
      {boxes.map((b) => {
        const bp = clamp01(b.p);
        if (bp <= 0.001 || L.top[b.from] === undefined || L.top[b.to] === undefined) return null;
        const top = L.top[b.from] - 4;
        const bottom = L.top[b.to] + L.height[b.to] + 4;
        return (
          <div
            key={`${b.from}-${b.to}`}
            style={{
              position: 'absolute',
              left: SSL.padX - 12,
              top,
              width: (b.width ?? textW + 24) * mix(0.96, 1, bp),
              height: bottom - top,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `3px ${b.dashed ? 'dashed' : 'solid'} ${alpha(b.tone, 0.85)}`,
              background: alpha(b.tone, 0.06),
              boxShadow: `0 0 ${Math.round(24 * bp)}px ${alpha(b.tone, 0.25 * bp)}`,
              opacity: bp,
            }}
          />
        );
      })}

      {/* Tags beside rows */}
      {tags.map((t) => {
        const tp = clamp01(t.p);
        if (tp <= 0.001 || L.top[t.row] === undefined) return null;
        const r = rows.find((x) => x.id === t.row);
        const kept = keep.includes(t.row);
        const size = outSize * (kept ? mix(1, keepScale, f) : 1);
        const x = t.x ?? SSL.padX + monoWidth(r?.text ?? '', size) + 22;
        return (
          <div key={`${t.row}-${t.text}`} style={{ position: 'absolute', left: x, top: L.top[t.row] + L.height[t.row] / 2, transform: `translate(${(1 - tp) * 12}px, -50%)`, opacity: tp }}>
            <TagPill text={t.text} tone={t.tone} size={32} />
          </div>
        );
      })}

      {/* Lenses: the row(s) the voice points at, enlarged */}
      {lenses.map((ln) => {
        const lp = clamp01(ln.p);
        if (lp <= 0.001 || L.top[ln.row] === undefined) return null;
        const ids = [ln.row, ...(ln.rows ?? [])];
        const lifted = ids.map((id) => rows.find((x) => x.id === id)).filter((x): x is SslRow => !!x);
        if (!lifted.length) return null;
        const size = outSize * mix(1, ln.scale ?? 1.5, lp);
        const lineH = size * 1.42;
        const boxH = lineH * lifted.length + 12;
        const textWidth = Math.max(...lifted.map((r) => monoWidth(r.text, size)));
        const rowTop = L.top[ln.row];
        const rowH = L.height[ln.row];
        const grow = ln.grow ?? 'down';
        const top = grow === 'down' ? rowTop - 6 : grow === 'up' ? rowTop + rowH + 6 - boxH : rowTop + rowH / 2 - boxH / 2;
        const tag = ln.tag;
        const tagP = tag ? clamp01(tag.p) : 0;
        const below = tag?.place === 'below';
        return (
          <div key={`lens-${ln.row}`} style={{ position: 'absolute', left: SSL.padX - 14, top, opacity: Math.min(1, lp * 1.6) }}>
            <div
              style={{
                height: boxH,
                width: textWidth + 30,
                boxSizing: 'border-box',
                padding: '6px 12px',
                borderRadius: RADIUS.md,
                border: `3px solid ${alpha(ln.tone, 0.9)}`,
                background: mixColour(C.ink900, ln.tone, 0.1),
                boxShadow: `0 0 ${Math.round(30 * lp)}px ${alpha(ln.tone, 0.35 * lp)}, 0 14px 30px ${alpha('#000000', 0.5)}`,
                fontSize: size,
                fontWeight: 750,
                whiteSpace: 'pre',
              }}
            >
              {lifted.map((r) => (
                <div key={r.id} style={{ height: lineH - 2, display: 'flex', alignItems: 'center', color: LIT[r.tone] }}>
                  {r.text}
                </div>
              ))}
            </div>
            {tag && tagP > 0.001 ? (
              <div
                style={{
                  position: 'absolute',
                  left: below ? 18 : textWidth + 30 + 18,
                  top: below ? boxH + 10 : boxH / 2,
                  transform: below ? `translateY(${(1 - tagP) * -8}px)` : `translate(${(1 - tagP) * 12}px, -50%)`,
                  opacity: tagP,
                }}
              >
                <TagPill text={tag.text} tone={tag.tone} size={34} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** A sans tag pill in a tone (≥ 30 px: the voice points at it). */
export function TagPill({ text, tone, size = 34 }: { text: string; tone: string; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${Math.round(size * 0.22)}px ${Math.round(size * 0.55)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(tone, 0.8)}`,
        background: mixColour(C.ink950, tone, 0.18),
        boxShadow: `0 8px 20px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: lighten(tone),
        whiteSpace: 'nowrap',
        lineHeight: 1.15,
      }}
    >
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').slice(0, 6);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Mixes two #rrggbb colours (alpha suffixes are ignored). */
export function mixColour(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const k = clamp01(t);
  const c = (x: number, y: number) => Math.round(x + (y - x) * k).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

const LIGHT: Record<string, string> = {
  [C.cyan]: C.cyanSoft,
  [C.sky]: '#7dd3fc',
  [C.amber]: '#fde68a',
  [C.emerald]: '#6ee7b7',
  [C.violet]: '#c4b5fd',
  [C.rose]: C.roseSoft,
};

/** The light text colour of a tone (falls back to a mix with white). */
export function lighten(tone: string): string {
  return LIGHT[tone] ?? mixColour(tone, '#ffffff', 0.45);
}
