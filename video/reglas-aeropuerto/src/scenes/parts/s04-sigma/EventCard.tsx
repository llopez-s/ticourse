import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle } from '../../../../../engine/src/ui';
import { S04_TEXT, type SampleEvent } from '../../../data/s04-sigma';
import { BoardingCard, CARD_ASPECT, PASSPORT_ASPECT, Passport } from '../Airport';

/**
 * A sample process-creation event as a three-field card («evento de ejemplo», no host, no time):
 * `Image` with the boarding-card icon (file name on disk), `OriginalFileName` with the passport icon
 * (name inside the program), `CommandLine` as texture. A verdict pill (+ a short note) sits in the header.
 * Pure: every animation is a 0–1 prop. Geometry in `EVENT_CARD` / `eventCardGeometry()` so the scene can
 * draw connectors to a row.
 */

export const EVENT_CARD = {
  width: 820,
  border: 2,
  pad: 18,
  headerH: 46,
  headerGap: 10,
  rowGap: 8,
  iconW: 78,
  labelSize: 24,
  valueSize: 34,
  cmdSize: 27,
} as const;

type RowKey = 'image' | 'ofn' | 'cmd';

/** Height of the card and the y centre of each row's value line (card coordinates). */
export function eventCardGeometry() {
  const E = EVENT_CARD;
  const labelH = Math.round(E.labelSize * 1.2);
  const valueH = Math.round(E.valueSize * 1.2);
  const cmdH = Math.round(E.cmdSize * 1.2);
  const rowH = { image: labelH + 2 + valueH, ofn: labelH + 2 + valueH, cmd: labelH + 2 + cmdH };
  const top0 = E.border + E.pad + E.headerH + E.headerGap;
  const tops = { image: top0, ofn: top0 + rowH.image + E.rowGap, cmd: top0 + rowH.image + rowH.ofn + 2 * E.rowGap };
  const valueY = (k: RowKey) => tops[k] + labelH + 2 + (k === 'cmd' ? cmdH : valueH) / 2;
  const height = tops.cmd + rowH.cmd + E.pad + E.border;
  return { labelH, valueH, cmdH, rowH, tops, valueY, height };
}

export type RowMark = { tone: string; a: number };

export function EventCard({
  event,
  appear = 1,
  changed = 0,
  dim = 0,
  marks = {},
  verdict,
  note,
}: {
  event: SampleEvent;
  appear?: number;
  /** 0–1: the boarding card (Image) was renamed: card and value turn rose. */
  changed?: number;
  dim?: number;
  /** Highlight box behind a row's value. */
  marks?: Partial<Record<RowKey, RowMark>>;
  /** Verdict pill in the header. */
  verdict?: { text: string; tone: string; p: number };
  /** A short note left of the verdict. */
  note?: { text: string; tone: string; p: number };
}) {
  const E = EVENT_CARD;
  const g = eventCardGeometry();
  const ch = clamp01(changed);
  const imageColor = ch > 0.5 ? C.roseSoft : C.textStrong;
  const cardW = 62;
  const passW = 34;

  const row = (k: RowKey, label: string, value: string, icon: ReactNode, size: number, color: string) => {
    const m = marks[k];
    const a = clamp01(m?.a ?? 0);
    const valueW = value.length * size * 0.6;
    return (
      <div key={k} style={{ position: 'absolute', left: E.border + E.pad, top: g.tops[k], right: E.border + E.pad, height: g.rowH[k] }}>
        <div style={{ position: 'absolute', left: 0, top: g.labelH + 2, width: E.iconW, height: g.rowH[k] - g.labelH - 2, display: 'flex', alignItems: 'center' }}>
          {icon}
        </div>
        <div style={{ position: 'absolute', left: E.iconW, top: 0, height: g.labelH, display: 'flex', alignItems: 'center', fontFamily: FONT.mono, fontSize: E.labelSize, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>
          {label}
        </div>
        {a > 0.001 && m ? (
          <div
            style={{
              position: 'absolute',
              left: E.iconW - 8,
              top: g.labelH + 2,
              width: (valueW + 16) * (0.4 + 0.6 * a),
              height: g.rowH[k] - g.labelH - 2,
              borderRadius: 8,
              background: alpha(m.tone, 0.2 * a),
              border: `2px solid ${alpha(m.tone, 0.85 * a)}`,
              boxShadow: `0 0 ${Math.round(18 * a)}px ${alpha(m.tone, 0.35 * a)}`,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: E.iconW,
            top: g.labelH + 2,
            height: g.rowH[k] - g.labelH - 2,
            display: 'flex',
            alignItems: 'center',
            fontFamily: FONT.mono,
            fontSize: size,
            fontWeight: k === 'cmd' ? 500 : 700,
            color,
            whiteSpace: 'pre',
          }}
        >
          {value}
        </div>
      </div>
    );
  };

  const vp = clamp01(verdict?.p ?? 0);
  const np = clamp01(note?.p ?? 0);
  const p = clamp01(appear);

  return (
    <div
      style={{
        position: 'relative',
        width: E.width,
        height: g.height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `${E.border}px solid ${alpha(ch > 0.5 ? C.rose : C.sky, 0.45 + 0.2 * ch)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink850, 0.97)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 16px 44px ${alpha('#000000', 0.42)}`,
        transform: `translateY(${(1 - p) * 22}px)`,
        ...dimStyle(dim, p),
      }}
    >
      {/* header: label, then note + verdict on the right */}
      <div
        style={{
          position: 'absolute',
          left: E.border + E.pad,
          right: E.border + E.pad,
          top: E.border + E.pad,
          height: E.headerH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          whiteSpace: 'nowrap',
          fontFamily: FONT.sans,
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 650, fontStyle: 'italic', color: C.muted }}>{S04_TEXT.eventHeader}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {note && np > 0.001 ? (
            <span style={{ fontSize: 32, fontWeight: 700, color: note.tone, opacity: np, transform: `translateX(${(1 - np) * 12}px)` }}>{note.text}</span>
          ) : null}
          {verdict && vp > 0.001 ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 18px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(verdict.tone, 0.85)}`,
                background: `linear-gradient(${alpha(verdict.tone, 0.18)}, ${alpha(verdict.tone, 0.18)}), ${C.ink900}`,
                color: verdict.tone,
                fontSize: 32,
                fontWeight: 800,
                lineHeight: 1.15,
                opacity: vp,
                transform: `scale(${1.15 - 0.15 * vp})`,
                boxShadow: `0 0 18px ${alpha(verdict.tone, 0.25)}`,
              }}
            >
              {verdict.text}
            </span>
          ) : null}
        </div>
      </div>
      <div style={{ position: 'absolute', left: E.border + E.pad, right: E.border + E.pad, top: E.border + E.pad + E.headerH + E.headerGap / 2 - 1, height: 1.5, background: alpha(C.sky, 0.22) }} />

      {row(
        'image',
        S04_TEXT.fields.image,
        event.image,
        <BoardingCard width={cardW} changed={ch} style={{ height: cardW * CARD_ASPECT }} />,
        E.valueSize,
        imageColor,
      )}
      {row('ofn', S04_TEXT.fields.ofn, event.ofn, <Passport width={passW} style={{ height: passW * PASSPORT_ASPECT, marginLeft: (cardW - passW) / 2 }} />, E.valueSize, C.textStrong)}
      {row('cmd', S04_TEXT.fields.cmd, event.cmd, <Icon name="terminal" size={34} color={C.muted} style={{ marginLeft: (cardW - 34) / 2 }} />, E.cmdSize, C.text)}
    </div>
  );
}

/** A dashed callout pinned to a rule line: leader from the line's end, then an optional icon and the text. */
export function Callout({
  x,
  y,
  lineX,
  a,
  tone,
  icon,
  text,
  sub,
  size = 36,
}: {
  x: number;
  y: number;
  lineX: number;
  a: number;
  tone: string;
  icon?: ReactNode;
  text: string;
  sub?: string;
  size?: number;
}) {
  if (a <= 0.001) return null;
  return (
    <>
      <svg style={{ position: 'absolute', left: lineX, top: y - 6, overflow: 'visible', opacity: a }} width={Math.max(1, x - lineX)} height={12}>
        <line x1={6} y1={6} x2={Math.max(6, (x - lineX - 10) * a)} y2={6} stroke={alpha(tone, 0.75)} strokeWidth={2.5} strokeDasharray="6 6" />
        <circle cx={6} cy={6} r={5} fill={tone} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translateY(-50%) translateX(${(1 - a) * 16}px)`,
          opacity: a,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: sub ? '10px 24px 12px 18px' : '8px 24px 8px 18px',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(tone, 0.8)}`,
          background: `linear-gradient(${alpha(tone, 0.14)}, ${alpha(tone, 0.14)}), ${C.ink900}`,
          boxShadow: `0 0 22px ${alpha(tone, 0.22)}, 0 12px 30px ${alpha('#000000', 0.4)}`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: size, fontWeight: 800, color: tone, lineHeight: 1.15 }}>{text}</span>
          {sub ? <span style={{ fontSize: 30, fontWeight: 650, color: C.text, lineHeight: 1.2 }}>{sub}</span> : null}
        </div>
      </div>
    </>
  );
}

/** A connector across the gap between a rule panel and an event row, with a mark (check or x) at its middle. */
export function MatchLink({
  x0,
  y0,
  x1,
  y1,
  p,
  tone,
  mark,
  dashed = false,
}: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  p: number;
  tone: string;
  mark: 'check' | 'x';
  dashed?: boolean;
}) {
  if (p <= 0.001) return null;
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const d = `M ${x0} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  const r = 24;
  return (
    <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: p }}>
      <path d={d} fill="none" stroke={tone} strokeWidth={4} strokeLinecap="round" strokeDasharray={dashed ? '4 10' : undefined} />
      <circle cx={x0} cy={y0} r={6} fill={tone} />
      <circle cx={x1} cy={y1} r={6} fill={tone} />
      <circle cx={mx} cy={my} r={r} fill={C.ink900} stroke={tone} strokeWidth={3} />
      <g transform={`translate(${mx - 15} ${my - 15}) scale(1.25)`}>
        {mark === 'check' ? (
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={tone} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M7 7l10 10M17 7L7 17" fill="none" stroke={tone} strokeWidth={3} strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}
