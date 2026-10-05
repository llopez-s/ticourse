import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, dimStyle, mix } from '../../../../../engine/src/ui';
import { LINE_1, LINE_2, S04_LOG, SERVED, type LogTokenId } from '../../../data/s04-traversal';

export const LOG_W = 1728;
const HEAD_H = 66;
const PAD_X = 28;
const PAD_Y = 14;
const ROW_H = 56;
export const LOG_H = HEAD_H + 2 * PAD_Y + 2 * ROW_H + 4;
/** Monospace size of both lines (the voice points at them: ≥ 32 px). */
export const LOG_SIZE = 32;
/** JetBrains Mono advance: 0.6 em. */
const CHAR = 0.6 * LOG_SIZE;

/** Top of row `i` (0 or 1) inside the panel. */
export function logRowTop(i: 0 | 1): number {
  return HEAD_H + 2 + PAD_Y + i * ROW_H;
}

/** Left edge (panel-local) of token `id` in its line, before any token grows. */
export function logTokenX(id: LogTokenId): number {
  for (const line of [LINE_1, LINE_2]) {
    let n = 0;
    for (const tok of line) {
      if (tok.id === id) return PAD_X + n * CHAR;
      n += tok.t.length;
    }
  }
  throw new Error(`no token ${id}`);
}

/** Width of token `id` at the base size. */
export function logTokenW(id: LogTokenId): number {
  const tok = [...LINE_1, ...LINE_2].find((t) => t.id === id);
  if (!tok) throw new Error(`no token ${id}`);
  return tok.t.length * CHAR;
}

/** How a token is lit: weight 0–1 and the colour it takes. */
export type TokenLight = { w: number; tone: string };

const BASE: Partial<Record<LogTokenId, string>> = {
  t1: C.muted,
  t2: C.muted,
  m1: C.faint,
  m2: C.faint,
  p1: C.text,
  p2: C.text,
};

/**
 * The access log of `hpa-portal-web-01`: title bar (host, «portal público de reservas de atraque»,
 * the source chip) and the lesson's two lines at 32 px. Every token can be lit (`lit`), the status and
 * bytes of line 1 can grow (`grow1`), and «se lo llevó» appears beside them (`served`). Pure view.
 */
export function AccessLog({
  open,
  lit,
  grow1 = 0,
  served = 0,
  dim1 = 0,
  dim2 = 0,
  hostLit = 0,
  glow = 0,
  style,
}: {
  open: number;
  lit: Partial<Record<LogTokenId, TokenLight>>;
  grow1?: number;
  served?: number;
  dim1?: number;
  dim2?: number;
  hostLit?: number;
  glow?: number;
  style?: CSSProperties;
}) {
  const row = (line: typeof LINE_1, i: 0 | 1, d: number) => (
    <div
      style={{
        position: 'absolute',
        left: PAD_X,
        top: logRowTop(i),
        height: ROW_H,
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'pre',
        fontFamily: FONT.mono,
        fontSize: LOG_SIZE,
        fontWeight: 500,
        ...dimStyle(d),
      }}
    >
      {line.map((tok, k) => {
        const l = lit[tok.id];
        const w = l ? l.w : 0;
        const growing = i === 0 && (tok.id === 's1' || tok.id === 'b1');
        const size = growing ? mix(LOG_SIZE, 42, grow1) : LOG_SIZE;
        const base = BASE[tok.id] ?? C.text;
        return (
          <span
            key={k}
            style={{
              fontSize: size,
              color: w > 0.5 && l ? l.tone : base,
              fontWeight: w > 0.5 || (growing && grow1 > 0.5) ? 800 : 500,
              borderRadius: 6,
              background: l && w > 0 ? alpha(l.tone, 0.16 * w) : undefined,
              boxShadow: l && w > 0 ? `0 0 0 2px ${alpha(l.tone, 0.85 * w)}` : undefined,
            }}
          >
            {tok.t}
          </span>
        );
      })}
      {i === 0 && served > 0 ? (
        <span
          style={{
            marginLeft: 26,
            padding: '6px 18px',
            borderRadius: RADIUS.pill,
            background: alpha(C.rose, 0.2),
            border: `2px solid ${alpha(C.rose, 0.85)}`,
            fontFamily: FONT.sans,
            fontSize: 36,
            fontWeight: 800,
            color: '#fecdd3',
            opacity: served,
            transform: `translateX(${(1 - served) * 14}px)`,
          }}
        >
          {SERVED}
        </span>
      ) : null}
    </div>
  );

  return (
    <div
      style={{
        position: 'relative',
        width: LOG_W,
        height: LOG_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.3 + 0.4 * glow)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 26px 60px ${alpha('#000000', 0.4)}${glow > 0 ? `, 0 0 ${30 * glow}px ${alpha(C.cyan, 0.25 * glow)}` : ''}`,
        overflow: 'hidden',
        opacity: open,
        transform: `translateY(${(1 - open) * 18}px)`,
        ...style,
      }}
    >
      {/* Title bar: what this log is, whose portal, and where the requests come from */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          height: HEAD_H,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: `0 ${PAD_X}px`,
          background: alpha(C.ink800, 0.95),
          borderBottom: `2px solid ${C.ink700}`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="server" size={36} color={C.cyan} />
        <span style={{ fontSize: 28, fontWeight: 650, color: C.muted }}>{S04_LOG.title}</span>
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 32,
            fontWeight: 800,
            color: C.cyanSoft,
            padding: '0 8px',
            borderRadius: 8,
            background: alpha(C.cyan, 0.16 * hostLit),
            boxShadow: hostLit > 0 ? `0 0 0 2px ${alpha(C.cyan, 0.8 * hostLit)}` : undefined,
          }}
        >
          {S04_LOG.host}
        </span>
        <span style={{ fontSize: 28, fontWeight: 600, color: C.muted }}>{`· ${S04_LOG.hostSub}`}</span>
        <span style={{ flex: 1 }} />
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '6px 18px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.rose, 0.6)}`,
            background: alpha(C.rose, 0.1),
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 650, color: C.muted }}>{S04_LOG.srcLead}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 750, color: C.roseSoft }}>{S04_LOG.src}</span>
        </span>
      </div>

      {row(LINE_1, 0, dim1)}
      {row(LINE_2, 1, dim2)}
    </div>
  );
}
