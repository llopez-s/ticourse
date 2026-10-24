import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/**
 * Paper pieces shared by the scenes: the printed index is warm paper with dark ink,
 * so it reads as a physical object against the video's dark panels.
 *   - PAPER:       the paper palette (paper, edge, ink, and ink-on-paper accents).
 *   - Paper:       a sheet with a soft shadow, optional tilt.
 *   - Bars:        grey placeholder bars (the skeleton question, generic options).
 *   - IndexLine:   one index entry, TERM | NOTE | WHERE, in three states
 *                  (plain, good = answers on its own, pointer = only says where to look).
 *   - PostIt:      a sticky note.
 *   - MiniNote:    a loose micro-note with scribble bars (no readable text).
 */

export const PAPER = {
  bg: '#efe8d6',
  bgDeep: '#e4dcc4',
  edge: '#cfc5aa',
  line: '#b9ae93',
  ink: '#1e2635',
  soft: '#5b6577',
  green: '#047857',
  rose: '#be123c',
  amber: '#b45309',
  cyan: '#0e7490',
  sticky: '#fde68a',
  stickyEdge: '#e9c75a',
} as const;

/** A sheet of paper with a soft shadow. Position it with an outer absolutely placed div. */
export function Paper({
  w,
  h,
  rotate = 0,
  children,
  style,
  glow,
  glowColor = C.cyan,
}: {
  w: number | string;
  h?: number | string;
  rotate?: number;
  children?: ReactNode;
  style?: CSSProperties;
  glow?: number;
  glowColor?: string;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        background: `linear-gradient(170deg, ${PAPER.bg} 0%, ${PAPER.bgDeep} 100%)`,
        borderRadius: 8,
        border: `2px solid ${PAPER.edge}`,
        boxShadow: `0 14px 30px ${alpha('#000000', 0.45)}, 0 2px 0 ${alpha('#ffffff', 0.25)} inset${
          glow && glow > 0.02 ? `, 0 0 ${Math.round(18 + 40 * glow)}px ${alpha(glowColor, 0.55 * glow)}` : ''
        }`,
        color: PAPER.ink,
        fontFamily: FONT.sans,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A grey placeholder bar on a dark card. `tone` colours it when the narration lights it. */
export function Bar({
  w,
  h = 22,
  color = C.ink600,
  glow = 0,
  style,
}: {
  w: number | string;
  h?: number;
  color?: string;
  glow?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: h / 2,
        background: color,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(20 * glow)}px ${alpha(color, 0.6 * glow)}` : undefined,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export type IndexLineState = 'plain' | 'good' | 'pointer';

/**
 * One index entry as a paper strip: TERM | NOTE | WHERE. With `empty` the cells are
 * placeholders carrying only their caption («término», «nota», «dónde»).
 */
export function IndexLine({
  term,
  note,
  where,
  width = 1500,
  size = 40,
  state = 'plain',
  empty,
  fill = 1,
  rotate = 0,
  cols = [0.27, 0.52, 0.21],
  style,
}: {
  term?: string;
  note?: string;
  where?: string;
  width?: number;
  size?: number;
  state?: IndexLineState;
  /** Captions for the three slots; when set, the line is drawn as an empty template. */
  empty?: readonly [string, string, string];
  /** 0–1: how much of an empty template is filled in (slots light one by one). */
  fill?: number;
  rotate?: number;
  /** Column widths as fractions of the line (term, note, where). */
  cols?: readonly [number, number, number];
  style?: CSSProperties;
}) {
  const cells = empty ? empty : [term ?? '', note ?? '', where ?? ''];
  const tone = state === 'good' ? PAPER.green : state === 'pointer' ? PAPER.amber : PAPER.cyan;
  return (
    <Paper w={width} rotate={rotate} style={{ padding: `${Math.round(size * 0.42)}px ${Math.round(size * 0.6)}px`, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {cells.map((c, i) => {
          const lit = empty ? Math.max(0, Math.min(1, fill * 3 - i)) : 1;
          return (
            <div
              key={i}
              style={{
                width: `${cols[i] * 100}%`,
                boxSizing: 'border-box',
                padding: i === 0 ? '0 18px 0 0' : '0 18px',
                borderLeft: i === 0 ? undefined : `2px dashed ${PAPER.line}`,
                fontSize: size,
                lineHeight: 1.12,
                fontWeight: i === 0 ? 800 : 600,
                fontFamily: i === 2 ? FONT.mono : FONT.sans,
                color: empty ? alpha(PAPER.soft, 0.35 + 0.65 * lit) : i === 0 ? PAPER.ink : i === 1 ? tone : PAPER.soft,
                whiteSpace: 'nowrap',
              }}
            >
              {empty ? (
                <span style={{ display: 'block', fontWeight: 750, letterSpacing: 0.5, fontSize: Math.round(size * 0.9) }}>{c}</span>
              ) : (
                c
              )}
            </div>
          );
        })}
      </div>
    </Paper>
  );
}

/** A sticky note; the content is centred. */
export function PostIt({
  w = 380,
  h = 250,
  rotate = -3,
  children,
  style,
  dim = 0,
}: {
  w?: number;
  h?: number;
  rotate?: number;
  children: ReactNode;
  style?: CSSProperties;
  dim?: number;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        padding: '26px 28px',
        background: `linear-gradient(165deg, #fef3c7 0%, ${PAPER.sticky} 100%)`,
        borderBottom: `6px solid ${PAPER.stickyEdge}`,
        borderRadius: 4,
        boxShadow: `0 16px 28px ${alpha('#000000', 0.45)}`,
        transform: `rotate(${rotate}deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: PAPER.ink,
        fontFamily: FONT.sans,
        opacity: 1 - 0.5 * dim,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A loose micro-note: paper scrap, a colour stripe and scribble bars (no readable text). */
export function MiniNote({
  w = 170,
  h = 112,
  rotate = 0,
  stripe = C.cyan,
  lines = 3,
  style,
}: {
  w?: number;
  h?: number;
  rotate?: number;
  stripe?: string;
  lines?: number;
  style?: CSSProperties;
}) {
  const widths = [0.86, 0.62, 0.74, 0.5];
  return (
    <Paper w={w} h={h} rotate={rotate} style={{ padding: '16px 14px 10px', overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 9, background: stripe }} />
      <div style={{ display: 'grid', gap: 11, marginTop: 6 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={{ height: 7, width: `${widths[i % 4] * 100}%`, borderRadius: 4, background: alpha(PAPER.soft, 0.55) }} />
        ))}
      </div>
    </Paper>
  );
}

/** A round verdict badge (check / cross) sized for text beside it. */
export function Verdict({ ok, size = 56, style }: { ok: boolean; size?: number; style?: CSSProperties }) {
  const color = ok ? C.emerald : C.rose;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: 'grid',
        placeItems: 'center',
        background: color,
        boxShadow: `0 0 ${Math.round(size * 0.5)}px ${alpha(color, 0.45)}`,
        flexShrink: 0,
        ...style,
      }}
    >
      <Icon name={ok ? 'check' : 'x'} size={Math.round(size * 0.62)} color={C.ink950} strokeWidth={3.2} />
    </div>
  );
}

/** A coloured pill label (solid or soft) used as a callout tag. */
export function Tag({
  children,
  color,
  size = 32,
  solid = false,
  icon,
  style,
}: {
  children: ReactNode;
  color: string;
  size?: number;
  solid?: boolean;
  icon?: Parameters<typeof Icon>[0]['name'];
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        padding: `${Math.round(size * 0.22)}px ${Math.round(size * 0.55)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(color, solid ? 0.95 : 0.6)}`,
        background: solid ? color : alpha(color, 0.12),
        color: solid ? C.ink950 : color,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={solid ? C.ink950 : color} strokeWidth={2.2} /> : null}
      {children}
    </span>
  );
}

/** Multiplies the opacity of an `enter(...)` result by `k` (so a second opacity does not overwrite the first). */
export function withOpacity(e: { opacity: number; transform: string }, k: number): { opacity: number; transform: string } {
  return { ...e, opacity: e.opacity * k };
}
