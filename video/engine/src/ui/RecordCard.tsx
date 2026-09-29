import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, TYPE, alpha, type Accent } from '../theme/tokens';
import { EASE, fadeIn, progress, typewriter } from '../theme/motion';
import { FOCUS_TEXT, dimStyle, focusWeight, mix, type FocusInput } from './Focus';
import { Icon, type IconName } from './Icon';
import { Redacted } from './Redacted';
import { tone as toneOf, type Tone } from './tone';

/** One field of a record. Frames are relative to the Sequence. */
export interface RecordRow {
  label: string;
  /** A string renders mono; anything else as given. */
  value?: ReactNode;
  /** Frame the value appears (before it: an empty dashed field). */
  at?: number;
  /** Types a string value from `at` instead of fading it in. */
  typed?: boolean;
  /** The value is hidden: a redaction block (the value is not drawn). */
  redacted?: boolean;
  /** Frame the redaction marker sweeps on (default: already there). */
  redactAt?: number;
  /** Wording printed on the marker (e.g. «REDACTED FOR PRIVACY»); omitted, a plain bar. */
  redactedLabel?: string;
  /** Colour of a string value. */
  color?: string;
  /** Highlights the row (tinted band + left bar) and enlarges its value; the other rows dim. */
  focus?: FocusInput;
  /** Colour of the highlight (default cyan). */
  tone?: Tone;
  /** Right-aligned chip or node (e.g. «la tienda»). */
  tag?: ReactNode;
}

/** The older version of the record, drawn behind the current one. */
export interface OlderRecord {
  title: string;
  icon?: IconName;
  rows: RecordRow[];
  footer?: ReactNode;
  /** Frame the older card starts to peek out from behind. */
  at: number;
  /** 0–1: slides it out from behind to the right of the current card. */
  slide?: number;
  /** Gap between the cards once slid out. */
  gap?: number;
  /** 0–1 step-back of the older card (e.g. while the current one talks). */
  dim?: number;
}

const HEADER_H = 60;
const FOOT_H = 64;
const PEEK = { x: 18, y: 12 } as const;
/** Room kept free on the right of a row that carries a tag. */
const TAG_RESERVE = 230;

/**
 * A field/value card (V4 S07Whois' registration card): header (icon, title,
 * optional right slot), label / value rows, a dashed footer. Rows can be
 * redacted with a marker sweep, typed, highlighted (value enlarged from its
 * left edge inside its fixed-height row) and tagged. With `older`, an earlier
 * version of the record peeks out from behind and can slide free to the right
 * (the caller leaves room: width + gap + width).
 */
export function RecordCard({
  title,
  icon = 'file',
  accent = 'cyan',
  right,
  rows,
  footer,
  older,
  width = 820,
  labelWidth = 230,
  rowHeight = 64,
  labelSize = TYPE.label,
  valueSize = 36,
  focusScale = FOCUS_TEXT.key / 36,
  dim = 0,
  at,
  frame: frameProp,
  fps: fpsProp,
  style,
}: {
  title: string;
  icon?: IconName;
  accent?: Accent;
  right?: ReactNode;
  rows: RecordRow[];
  footer?: ReactNode;
  older?: OlderRecord;
  width?: number;
  labelWidth?: number;
  rowHeight?: number;
  labelSize?: number;
  valueSize?: number;
  /** Scale of a focused value (default: 36 → 48 px). */
  focusScale?: number;
  /** 0–1 step-back of the current card. */
  dim?: number;
  /** Frame the card rises in (omitted: always visible). */
  at?: number;
  frame?: number;
  fps?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps: configFps } = useVideoConfig();
  const frame = frameProp ?? current;
  const fps = fpsProp ?? configFps;
  const height = HEADER_H + 12 + rows.length * rowHeight + (footer ? FOOT_H + 6 : 12);
  const inP = at === undefined ? 1 : progress(frame, at, 16);
  if (at !== undefined && frame < at - 1) return null;

  const common = { width, labelWidth, rowHeight, labelSize, valueSize, focusScale, frame, fps };
  let olderNode: ReactNode = null;
  if (older && frame >= older.at) {
    const slide = Math.max(0, Math.min(1, older.slide ?? 0));
    const peek = progress(frame, older.at, 14);
    const olderH = HEADER_H + 12 + older.rows.length * rowHeight + (older.footer ? FOOT_H + 6 : 12);
    olderNode = (
      <div
        style={{
          position: 'absolute',
          left: mix(PEEK.x, width + (older.gap ?? 40), slide),
          top: mix(PEEK.y, 0, slide),
          ...dimStyle(older.dim ?? 0, peek * (0.55 + 0.45 * slide)),
        }}
      >
        <Card {...common} title={older.title} icon={older.icon ?? 'archive'} accent="cyan" rows={older.rows} footer={older.footer} height={olderH} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      {olderNode}
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: inP, transform: `translateY(${(1 - inP) * 20}px)` }}>
        <Card {...common} title={title} icon={icon} accent={accent} right={right} rows={rows} footer={footer} height={height} dim={dim} />
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  accent,
  right,
  rows,
  footer,
  width,
  height,
  labelWidth,
  rowHeight,
  labelSize,
  valueSize,
  focusScale,
  dim = 0,
  frame,
  fps,
}: {
  title: string;
  icon: IconName;
  accent: Accent;
  right?: ReactNode;
  rows: RecordRow[];
  footer?: ReactNode;
  width: number;
  height: number;
  labelWidth: number;
  rowHeight: number;
  labelSize: number;
  valueSize: number;
  focusScale: number;
  dim?: number;
  frame: number;
  fps: number;
}) {
  const a = toneOf(accent);
  const weights = rows.map((r) => focusWeight(r.focus, frame));
  // String values shrink to fit the value column at their largest (focused) scale;
  // a row with a tag keeps TAG_RESERVE px free on the right. Mono advance = 0.6 em.
  const column = width - 2 * 14 - 2 * 14 - 4 - labelWidth;
  const fitSize = (r: RecordRow) => {
    if (typeof r.value !== 'string' || r.redacted) return valueSize;
    const avail = column - (r.tag ? TAG_RESERVE : 0) - 6;
    const maxScale = r.focus !== undefined ? focusScale : 1;
    return Math.min(valueSize, Math.floor(avail / (0.6 * r.value.length * maxScale)));
  };
  const dimOf = (i: number) => weights.reduce((m, w, j) => (j === i ? m : Math.max(m, w)), 0) * (1 - weights[i]);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 28px 64px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        ...dimStyle(dim),
      }}
    >
      <div
        style={{
          height: HEADER_H,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 22px',
          borderBottom: `2px solid ${C.ink700}`,
          background: alpha(C.ink800, 0.9),
        }}
      >
        <Icon name={icon} size={32} color={a.fg} />
        <span style={{ flex: 1, fontSize: 30, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden' }}>{title}</span>
        {right}
      </div>
      <div style={{ padding: '6px 14px 0' }}>
        {rows.map((r, i) => {
          const g = weights[i];
          const col = toneOf(r.tone ?? 'cyan').fg;
          const k = 1 + (focusScale - 1) * g;
          return (
            <div
              key={r.label}
              style={{
                height: rowHeight,
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                borderRadius: 12,
                background: g > 0.001 ? alpha(col, 0.13 * g) : undefined,
                boxShadow: g > 0.001 ? `inset 5px 0 0 ${alpha(col, 0.9 * g)}` : undefined,
                ...dimStyle(0.7 * dimOf(i)),
              }}
            >
              <div style={{ width: labelWidth, flexShrink: 0, fontSize: labelSize, fontWeight: 600, color: g > 0.5 ? C.textStrong : C.muted, whiteSpace: 'nowrap' }}>
                {r.label}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ transform: k !== 1 ? `scale(${k})` : undefined, transformOrigin: 'left center', display: 'flex', alignItems: 'center' }}>
                  <Value row={r} size={fitSize(r)} frame={frame} fps={fps} />
                </div>
                {r.tag ? <div style={{ marginLeft: 'auto' }}>{r.tag}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
      {footer ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: FOOT_H,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 28px',
            borderTop: `2px dashed ${C.ink700}`,
            fontSize: TYPE.label,
            fontWeight: 650,
            color: C.muted,
            whiteSpace: 'nowrap',
          }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function Value({ row, size, frame, fps }: { row: RecordRow; size: number; frame: number; fps: number }) {
  if (row.redacted) {
    const sweep = row.redactAt === undefined ? 1 : progress(frame, row.redactAt, 12, EASE.inOut);
    if (row.redactAt !== undefined && frame < row.redactAt) return <Blank />;
    return row.redactedLabel ? (
      <Redacted label={row.redactedLabel} labelSize={Math.round(size * 0.9)} sweep={sweep} />
    ) : (
      <Redacted width={260} height={Math.round(size * 0.8)} sweep={sweep} />
    );
  }
  if (row.value === undefined) return <Blank />;
  if (row.at !== undefined && frame < row.at) return <Blank />;
  if (typeof row.value === 'string') {
    const text = row.typed && row.at !== undefined ? typewriter(row.value, frame, row.at, fps, 42) : row.value;
    const opacity = row.typed || row.at === undefined ? 1 : fadeIn(frame, row.at, 12);
    return (
      <span style={{ fontFamily: FONT.mono, fontSize: size, fontWeight: 650, color: row.color ?? C.text, whiteSpace: 'nowrap', opacity }}>{text}</span>
    );
  }
  return <span style={{ opacity: row.at === undefined ? 1 : fadeIn(frame, row.at, 12) }}>{row.value}</span>;
}

/** An empty field: a short dashed rule. */
function Blank() {
  return <div style={{ width: 180, height: 0, borderBottom: `3px dashed ${C.ink600}` }} />;
}
