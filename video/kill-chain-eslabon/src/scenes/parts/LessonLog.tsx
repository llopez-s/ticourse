import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/**
 * The lesson's own evidence: the reconstruction of s2m1 (`src/data/s2.ts:68-85`),
 * line by line, exactly as the lesson prints it but WITHOUT its `[fase]` tags,
 * without the `*` of the attachment line and without the `=== … ===` banners
 * (each panel has its own title instead). The tree elbow of `:78` and the arrow
 * of `:83` are DRAWN (SVG), never typed: the engine fonts are latin subsets.
 *
 * What this file gives the other scenes:
 * - Data: `MAIL_ROWS` / `EDR_ROWS` (line ids in panel order), `MAIL_TITLE`,
 *   `EDR_TITLE`, `INFERRED_NOTE`, `OBSERVED` (one time per observed phase, as in
 *   its source: «09:41 UTC» · «09:44:12» · «09:44:19» · «09:45:02»).
 * - `<LogLine id size … />`: ONE line on its own (no panel), e.g. s05's
 *   attachment line or s06's one line per observed phase. Indents and the elbow
 *   are dropped; `showTime={false}` drops the EDR time column. Size it with
 *   `logLineWidth`, find a span with `logLineSpan`.
 * - `<LogPanel rows title icon … />`: a log panel (header + rows) with «focus
 *   the line the voice explains, dim the rest», span highlights, a tag slot per
 *   row and the drawn elbow/connector. `<MailHeaders>` is the mail-gateway
 *   preset (s03); the EDR preset is `ProcessTree` (./ProcessTree.tsx).
 *   Geometry is in DESIGN units (mono 30 px, base width `LOG_BASE_W`) scaled by
 *   k = min(1, width / LOG_BASE_W); a focused row grows to `LOG_FOCUS_SCALE`
 *   (from its left edge), and `LOG_BASE_W` leaves room for the widest line to
 *   do so inside the panel. `logPanelHeight`, `logRowAnchor`, `logSpanAnchor`
 *   return px relative to the panel's top-left for any `width`.
 */

// ---------------------------------------------------------------- data

export type MailLineId = 'from' | 'returnPath' | 'received' | 'receivedBy' | 'subject' | 'attachment';
export type EdrLineId = 'explorer' | 'open' | 'powershell' | 'drop' | 'schtasks' | 'schtasksTr' | 'beacon';
export type LogLineId = MailLineId | EdrLineId;

/** Highlightable spans. The IP of the Received line has none on purpose (never highlighted). */
export type LogSpanId =
  | 'senderDomain'
  | 'returnPathDomain'
  | 'receivedDomain'
  | 'subject'
  | 'zip'
  | 'lnk'
  | 'openLnk'
  | 'powershell'
  | 'dropPath'
  | 'taskName'
  | 'beaconExe'
  | 'beaconDomain';

type PartKind = 'field' | 'time' | 'name' | 'text' | 'arg';
type TextPart = { text: string; kind?: PartKind; span?: LogSpanId };
/** A drawn arrow `connector` columns wide (the lesson's arrow on the beacon line). */
type ConnectorPart = { connector: number };
type Part = TextPart | ConnectorPart;

interface LineSpec {
  /** Columns of indent inside a panel (dropped by <LogLine>). */
  indent?: number;
  /** Draw the tree elbow from the previous row (the lesson's `└─`). */
  elbow?: boolean;
  parts: Part[];
}

const time = (t: string): Part[] => [
  { text: t, kind: 'time' },
  { text: '  ' },
];

const LINES: Record<LogLineId, LineSpec> = {
  // Mail headers (`src/data/s2.ts:69-74`).
  from: {
    parts: [
      { text: 'From:', kind: 'field' },
      { text: ' "Laura Iglesias - Talent" <l.iglesias@' },
      { text: 'meridian-careers.com', span: 'senderDomain' },
      { text: '>' },
    ],
  },
  returnPath: {
    parts: [
      { text: 'Return-Path:', kind: 'field' },
      { text: ' <bounce@' },
      { text: 'mx1.cdn-sync-status.example', span: 'returnPathDomain' },
      { text: '>' },
    ],
  },
  received: {
    parts: [
      { text: 'Received:', kind: 'field' },
      { text: ' from ' },
      { text: 'mx1.cdn-sync-status.example', span: 'receivedDomain' },
      { text: ' (203.0.113.27)' },
    ],
  },
  receivedBy: {
    indent: 4,
    parts: [{ text: 'by mail.meridian.example; Mon, 2 Mar 2026 09:41:07 +0000' }],
  },
  subject: {
    parts: [
      { text: 'Subject:', kind: 'field' },
      { text: ' ' },
      // «propulsion» WITHOUT accent, as in the lesson (`:73`).
      { text: 'Candidatura - Ingeniero de propulsion (CV adjunto)', span: 'subject' },
    ],
  },
  attachment: {
    parts: [
      { text: 'Attachment:', kind: 'field' },
      { text: ' ' },
      { text: 'CV_Ingeniero.zip', span: 'zip' },
      { text: ' (contiene: ' },
      { text: 'CV_Ingeniero.pdf.lnk', span: 'lnk' },
      { text: ')' },
    ],
  },
  // EDR process chain (`src/data/s2.ts:77-83`). Times have no zone (canon registry §2).
  explorer: { parts: [...time('09:44:12'), { text: 'explorer.exe', kind: 'name' }] },
  open: {
    indent: 15,
    elbow: true,
    parts: [{ text: 'abre ' }, { text: 'CV_Ingeniero.pdf.lnk', span: 'openLnk' }],
  },
  powershell: {
    parts: [
      ...time('09:44:13'),
      { text: 'powershell.exe', kind: 'name', span: 'powershell' },
      { text: ' -nop -w hidden -enc SQBFAFgAKA...', kind: 'arg' },
    ],
  },
  drop: {
    parts: [...time('09:44:19'), { text: 'escribe ' }, { text: 'C:\\ProgramData\\winhlp.exe', span: 'dropPath' }],
  },
  schtasks: {
    parts: [
      ...time('09:44:20'),
      { text: 'schtasks', kind: 'name' },
      { text: ' /create /tn ', kind: 'arg' },
      { text: 'WindowsUpdateCheck', span: 'taskName' },
    ],
  },
  schtasksTr: {
    indent: 12,
    parts: [{ text: '/tr C:\\ProgramData\\winhlp.exe /sc onlogon', kind: 'arg' }],
  },
  beacon: {
    parts: [
      ...time('09:45:02'),
      { text: 'winhlp.exe', kind: 'name', span: 'beaconExe' },
      { connector: 5 },
      { text: 'TLS ' },
      { text: 'update-svc-cdn.com', span: 'beaconDomain' },
      { text: ':443 (beacon 60s)' },
    ],
  },
};

/** Mail-gateway panel rows, in the lesson's order (no `To:` line: the lesson has none). */
export const MAIL_ROWS: readonly MailLineId[] = ['from', 'returnPath', 'received', 'receivedBy', 'subject', 'attachment'];
/** EDR panel rows, in the lesson's order. */
export const EDR_ROWS: readonly EdrLineId[] = ['explorer', 'open', 'powershell', 'drop', 'schtasks', 'schtasksTr', 'beacon'];

/** Replaces the lesson's `=== EMAIL HEADERS (mail gateway, …) ===` banner. */
export const MAIL_TITLE = 'pasarela de correo · 2026-03-02 09:41 UTC';
/** Replaces the lesson's `=== EDR PROCESS CHAIN (host ENG-WS-041, mismo dia) ===` banner. */
export const EDR_TITLE = 'host ENG-WS-041 · mismo día';
/** The lesson's note (`:85`), without its leading `* `. */
export const INFERRED_NOTE = 'inferida: el LNK dentro del ZIP se construyó en el entorno del actor';

/** The four observed phases, in chain order. Phase ids match `PHASES` in ./KillChain. */
export type ObservedPhaseId = 'delivery' | 'exploitation' | 'installation' | 'c2';

/**
 * One time per observed phase — the first line of each phase, each «as in its
 * source»: «UTC» only on the mail one, none on the EDR ones; never subtract
 * them or draw timed arrows between them. `line` is the log line it comes from.
 */
export const OBSERVED: readonly { phase: ObservedPhaseId; time: string; line: LogLineId }[] = [
  { phase: 'delivery', time: '09:41 UTC', line: 'from' },
  { phase: 'exploitation', time: '09:44:12', line: 'explorer' },
  { phase: 'installation', time: '09:44:19', line: 'drop' },
  { phase: 'c2', time: '09:45:02', line: 'beacon' },
];
/** Same, keyed by phase. */
export const OBSERVED_TIMES: Record<ObservedPhaseId, string> = {
  delivery: '09:41 UTC',
  exploitation: '09:44:12',
  installation: '09:44:19',
  c2: '09:45:02',
};

// ---------------------------------------------------------------- column layout

/** JetBrains Mono advance, in em. */
export const MONO_ADVANCE = 0.6;

const isConnector = (p: Part): p is ConnectorPart => 'connector' in p;
const partCols = (p: Part) => (isConnector(p) ? p.connector : p.text.length);

/** Parts actually drawn for a line (standalone lines may drop the time column). */
function partsOf(id: LogLineId, showTime: boolean): Part[] {
  const parts = LINES[id].parts;
  if (showTime || !parts.length || isConnector(parts[0]) || parts[0].kind !== 'time') return parts;
  return parts.slice(2); // the time and its two spaces
}

/** Column where each part starts, and the line's end column. */
function columns(id: LogLineId, { panel, showTime }: { panel: boolean; showTime: boolean }) {
  let col = panel ? LINES[id].indent ?? 0 : 0;
  const parts = partsOf(id, showTime);
  const starts: number[] = [];
  for (const p of parts) {
    starts.push(col);
    col += partCols(p);
  }
  return { parts, starts, end: col };
}

/** Width in px of a standalone <LogLine> at `size` px. */
export function logLineWidth(id: LogLineId, size: number, { showTime = true } = {}): number {
  return columns(id, { panel: false, showTime }).end * size * MONO_ADVANCE;
}

/** Left/right edges (px) of a span inside a standalone <LogLine> at `size` px. */
export function logLineSpan(id: LogLineId, span: LogSpanId, size: number, { showTime = true } = {}): { x0: number; x1: number } {
  const { parts, starts } = columns(id, { panel: false, showTime });
  const i = parts.findIndex((p) => !isConnector(p) && p.span === span);
  if (i < 0) throw new Error(`span ${span} is not on line ${id}`);
  const ch = size * MONO_ADVANCE;
  return { x0: starts[i] * ch, x1: (starts[i] + partCols(parts[i])) * ch };
}

// ---------------------------------------------------------------- colours

const KIND_COLOR: Record<PartKind, string> = {
  field: C.sky,
  time: C.muted,
  name: C.textStrong,
  text: C.text,
  arg: C.muted,
};

/** Default highlight tones (the video's colour meanings). Scenes may override any. */
export const LOG_SPAN_TONE: Record<LogSpanId, string> = {
  senderDomain: C.amber, // the disguise: «parece de casa»
  returnPathDomain: C.rose, // the real sender
  receivedDomain: C.rose,
  subject: C.cyan,
  zip: C.amber,
  lnk: C.amber,
  openLnk: C.amber,
  powershell: C.cyan,
  dropPath: C.cyan,
  taskName: C.amber,
  beaconExe: C.cyan,
  beaconDomain: C.rose, // the attacker's domain
};

// ---------------------------------------------------------------- line renderer

interface LineTextProps {
  id: LogLineId;
  /** Mono font size in px (of the coordinate system it is drawn in). */
  size: number;
  /** Row height (the text is vertically centred in it). */
  height: number;
  panel: boolean;
  showTime: boolean;
  /** Text is brighter when the line is in focus. */
  bright: number;
  highlight: Partial<Record<LogSpanId, number>>;
  highlightTone: Partial<Record<LogSpanId, string>>;
  connector: number;
  beat?: number;
}

/** One line's text, each part absolutely placed on its column (anchors always match the drawing). */
function LineText({ id, size, height, panel, showTime, bright, highlight, highlightTone, connector, beat }: LineTextProps) {
  const ch = size * MONO_ADVANCE;
  const { parts, starts } = columns(id, { panel, showTime });
  return (
    <>
      {parts.map((p, i) => {
        const left = starts[i] * ch;
        if (isConnector(p)) {
          const w = p.connector * ch;
          const pr = clamp01(connector);
          const y = height / 2;
          const x0 = ch * 0.7;
          const x1 = w - ch * 0.7;
          const xEnd = x0 + (x1 - x0) * pr;
          const head = size * 0.3;
          const b = beat === undefined ? -1 : clamp01(beat);
          return (
            <svg key={i} width={w} height={height} style={{ position: 'absolute', left, top: 0, overflow: 'visible' }}>
              {pr > 0 ? (
                <>
                  <line x1={x0} y1={y} x2={Math.max(x0, xEnd - head * 0.6)} y2={y} stroke={C.sky} strokeWidth={size * 0.1} strokeLinecap="round" />
                  <polygon
                    points={`${xEnd - head * 1.1},${y - head * 0.62} ${xEnd},${y} ${xEnd - head * 1.1},${y + head * 0.62}`}
                    fill={C.sky}
                    opacity={pr}
                  />
                </>
              ) : null}
              {b >= 0 && b < 1 && pr >= 1 ? (
                <circle cx={x0 + (x1 - x0) * b} cy={y} r={size * 0.17} fill={C.roseSoft} opacity={Math.sin(Math.PI * b)} />
              ) : null}
            </svg>
          );
        }
        const kind = p.kind ?? 'text';
        let color = KIND_COLOR[kind];
        if (bright > 0.5 && kind === 'arg') color = C.text;
        if (bright > 0.5 && kind === 'text') color = C.textStrong;
        const h = p.span ? clamp01(highlight[p.span] ?? 0) : 0;
        const tone = p.span ? highlightTone[p.span] ?? LOG_SPAN_TONE[p.span] : color;
        const lh = size * 1.3;
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              left,
              top: (height - lh) / 2,
              height: lh,
              lineHeight: `${lh}px`,
              fontFamily: FONT.mono,
              fontSize: size,
              whiteSpace: 'pre',
              color: h > 0.05 ? tone : color,
              fontWeight: kind === 'name' || kind === 'field' || h > 0.05 ? 700 : 450,
              background: h > 0 ? alpha(tone, 0.18 * h) : undefined,
              boxShadow: h > 0 ? `0 0 0 ${Math.max(2, size * 0.1)}px ${alpha(tone, 0.85 * h)}, 0 0 ${Math.round(size * 0.75 * h)}px ${alpha(tone, 0.45 * h)}` : undefined,
              borderRadius: size * 0.2,
            }}
          >
            {p.text}
          </span>
        );
      })}
    </>
  );
}

export interface LogLineProps {
  id: LogLineId;
  /** Mono font size in px. Default 30. */
  size?: number;
  /** EDR lines: keep the time column. Default true. */
  showTime?: boolean;
  /** 0–1 per span. */
  highlight?: Partial<Record<LogSpanId, number>>;
  highlightTone?: Partial<Record<LogSpanId, string>>;
  /** 0–1: brighter text (as a focused panel row). Default 1. */
  bright?: number;
  /** 0–1 draw of the beacon line's drawn arrow. Default 1. */
  connector?: number;
  /** 0–1 position of a pulse travelling the beacon arrow (omit for none). */
  beat?: number;
  style?: CSSProperties;
}

/** One line of the lesson's reconstruction on its own (no panel, no indent, no elbow). */
export function LogLine({ id, size = 30, showTime = true, highlight = {}, highlightTone = {}, bright = 1, connector = 1, beat, style }: LogLineProps) {
  const height = Math.round(size * 1.5);
  return (
    <div style={{ position: 'relative', width: logLineWidth(id, size, { showTime }), height, ...style }}>
      <LineText
        id={id}
        size={size}
        height={height}
        panel={false}
        showTime={showTime}
        bright={bright}
        highlight={highlight}
        highlightTone={highlightTone}
        connector={connector}
        beat={beat}
      />
    </div>
  );
}

// ---------------------------------------------------------------- panel geometry (design units)

const MONO = 30;
const CH = MONO * MONO_ADVANCE;
const ROW = 54;
const PAD_X = 28;
const HEADER_H = 58;
const BODY_TOP = 14;
const BOTTOM_PAD = 20;
const TAG_GAP = 36;
const MAX_COLS = Math.max(...(Object.keys(LINES) as LogLineId[]).map((id) => columns(id, { panel: true, showTime: true }).end));

/** Scale of a focused row (from its left edge). */
export const LOG_FOCUS_SCALE = 1.1;
/** Design width of a panel: the widest line fits at full focus. At this width or more, k = 1. */
export const LOG_BASE_W = Math.ceil(PAD_X * 2 + MAX_COLS * CH * LOG_FOCUS_SCALE);

/** Scale factor of a panel drawn at `width`. Focused text is 30 × 1.1 × k px. */
export function logScale(width: number): number {
  return Math.min(1, width / LOG_BASE_W);
}

const rowCenter = (i: number) => HEADER_H + BODY_TOP + i * ROW + ROW / 2;
const designHeight = (n: number) => HEADER_H + BODY_TOP + n * ROW + BOTTOM_PAD;

/** Height in px of a panel of `rows` drawn at `width`. */
export function logPanelHeight(rows: readonly LogLineId[], width: number): number {
  return designHeight(rows.length) * logScale(width);
}

/**
 * A row's anchors in px from the panel's top-left: `x` = where its text starts,
 * `y` = its vertical centre, `end` = right end of its text at focus `focus` (0–1).
 */
export function logRowAnchor(rows: readonly LogLineId[], id: LogLineId, width: number, focus = 0): { x: number; y: number; end: number } {
  const i = rows.indexOf(id);
  if (i < 0) throw new Error(`row ${id} is not in this panel`);
  const k = logScale(width);
  const s = 1 + (LOG_FOCUS_SCALE - 1) * clamp01(focus);
  const { end } = columns(id, { panel: true, showTime: true });
  return { x: PAD_X * k, y: rowCenter(i) * k, end: (PAD_X + end * CH * s) * k };
}

/** A span's edges and centre in px from the panel's top-left, at focus `focus` (0–1) of its row. */
export function logSpanAnchor(rows: readonly LogLineId[], span: LogSpanId, width: number, focus = 0): { x0: number; x1: number; x: number; y: number } {
  const k = logScale(width);
  const s = 1 + (LOG_FOCUS_SCALE - 1) * clamp01(focus);
  for (let r = 0; r < rows.length; r++) {
    const { parts, starts } = columns(rows[r], { panel: true, showTime: true });
    const i = parts.findIndex((p) => !isConnector(p) && p.span === span);
    if (i < 0) continue;
    const x0 = (PAD_X + starts[i] * CH * s) * k;
    const x1 = (PAD_X + (starts[i] + partCols(parts[i])) * CH * s) * k;
    return { x0, x1, x: (x0 + x1) / 2, y: rowCenter(r) * k };
  }
  throw new Error(`span ${span} is not in this panel`);
}

// ---------------------------------------------------------------- panel

export interface LogPanelProps {
  rows: readonly LogLineId[];
  title: string;
  icon: IconName;
  /** Icon colour (default cyan: your own logs). */
  iconTone?: string;
  /** Panel width in px (k = min(1, width / LOG_BASE_W)). */
  width: number;
  /** 0–1: rows appear top-down. Default 1. */
  draw?: number;
  /** 0–1 extra visibility per row (multiplies `draw`), e.g. to hold a row back. */
  show?: Partial<Record<LogLineId, number>>;
  /** 0–1 focus per row: brighter, scaled to LOG_FOCUS_SCALE, with a band. */
  focus?: Partial<Record<LogLineId, number>>;
  /** 0–1: how far every row NOT in focus steps back. */
  dim?: number;
  /** 0–1 constant extra dim per row (e.g. a line kept aside for a later scene). */
  rowDim?: Partial<Record<LogLineId, number>>;
  /** 0–1 per span. */
  highlight?: Partial<Record<LogSpanId, number>>;
  highlightTone?: Partial<Record<LogSpanId, string>>;
  /** Colour of the focus band (default cyan). */
  focusTone?: string;
  /** Slot on the right of a row, in DESIGN units, vertically centred on it; follows its focus scale. */
  tags?: Partial<Record<LogLineId, ReactNode>>;
  /** 0–1 draw of the beacon line's drawn arrow. Default 1. */
  connector?: number;
  /** 0–1 position of a pulse travelling the beacon arrow (omit for none). */
  beat?: number;
  /** 0–1 extra dim of the whole header (title bar). */
  headerDim?: number;
  /** 0–1 glow of the title bar in the icon's tone (e.g. when the voice names the source). */
  headerGlow?: number;
  style?: CSSProperties;
}

/** A log panel of the lesson's lines. See the file comment for the geometry helpers. */
export function LogPanel({
  rows,
  title,
  icon,
  iconTone = C.cyan,
  width,
  draw = 1,
  show = {},
  focus = {},
  dim = 0,
  rowDim = {},
  highlight = {},
  highlightTone = {},
  focusTone = C.cyan,
  tags = {},
  connector = 1,
  beat,
  headerDim = 0,
  headerGlow = 0,
  style,
}: LogPanelProps) {
  const k = logScale(width);
  const designW = width / k;
  const H = designHeight(rows.length);
  const n = rows.length;

  const reveal = (i: number) => EASE.out(clamp01(draw * n - i)) * clamp01(show[rows[i]] ?? 1);
  const dimOf = (id: LogLineId) => Math.max(clamp01(dim) * (1 - clamp01(focus[id] ?? 0)), clamp01(rowDim[id] ?? 0));
  const opacityOf = (d: number) => 1 - 0.6 * d;

  return (
    <div style={{ position: 'relative', width, height: H * k, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: designW,
          height: H,
          transform: k !== 1 ? `scale(${k})` : undefined,
          transformOrigin: '0 0',
        }}
      >
        {/* Panel and title bar */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 24,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            border: `2px solid ${C.ink700}`,
            boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: HEADER_H,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 26px',
              borderBottom: `2px solid ${C.ink700}`,
              background: alpha(C.ink800, 0.9),
              opacity: opacityOf(Math.max(clamp01(dim) * 0.6, clamp01(headerDim))),
            }}
          >
            <Icon name={icon} size={30} color={iconTone} />
            <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 650, color: headerGlow > 0.5 ? C.textStrong : C.text, whiteSpace: 'nowrap' }}>{title}</span>
          </div>
        </div>
        {headerGlow > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: designW,
              height: HEADER_H,
              borderRadius: '24px 24px 0 0',
              border: `3px solid ${alpha(iconTone, 0.85 * clamp01(headerGlow))}`,
              boxShadow: `0 0 ${Math.round(30 * clamp01(headerGlow))}px ${alpha(iconTone, 0.4 * clamp01(headerGlow))}, inset 0 0 ${Math.round(24 * clamp01(headerGlow))}px ${alpha(iconTone, 0.18 * clamp01(headerGlow))}`,
            }}
          />
        ) : null}

        {/* Drawn tree elbows (the lesson's `└─`) */}
        <svg width={designW} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {rows.map((id, i) => {
            if (!LINES[id].elbow || i === 0) return null;
            const p = reveal(i);
            if (p <= 0) return null;
            const indent = LINES[id].indent ?? 0;
            const x = PAD_X + (indent - 2.5) * CH;
            const y0 = rowCenter(i - 1) + MONO * 0.5;
            const y1 = rowCenter(i);
            const x1 = PAD_X + (indent - 0.45) * CH;
            const len = y1 - y0 + (x1 - x);
            const f = clamp01(focus[id] ?? 0);
            const d = Math.max(dimOf(id), dimOf(rows[i - 1]) * (1 - f));
            return (
              <path
                key={id}
                d={`M${x} ${y0} L${x} ${y1} L${x1} ${y1}`}
                fill="none"
                stroke={f > 0.3 ? focusTone : C.ink500}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${len} ${len}`}
                strokeDashoffset={len * (1 - p)}
                opacity={opacityOf(d)}
              />
            );
          })}
        </svg>

        {/* Rows */}
        {rows.map((id, i) => {
          const p = reveal(i);
          if (p <= 0) return null;
          const f = clamp01(focus[id] ?? 0);
          const d = dimOf(id);
          const s = 1 + (LOG_FOCUS_SCALE - 1) * f;
          const { end } = columns(id, { panel: true, showTime: true });
          const indent = LINES[id].indent ?? 0;
          const y = rowCenter(i);
          const textW = end * CH;
          return (
            <div key={id} style={{ position: 'absolute', left: 0, top: 0, opacity: p * opacityOf(d), filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined }}>
              {f > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: PAD_X + indent * CH * s - 12,
                    top: y - ROW / 2 + 4,
                    width: (end - indent) * CH * s + 24,
                    height: ROW - 8,
                    borderRadius: 10,
                    background: alpha(focusTone, 0.1 * f),
                    border: `2px solid ${alpha(focusTone, 0.55 * f)}`,
                    boxShadow: `0 0 ${Math.round(24 * f)}px ${alpha(focusTone, 0.25 * f)}`,
                  }}
                />
              ) : null}
              <div
                style={{
                  position: 'absolute',
                  left: PAD_X,
                  top: y - ROW / 2,
                  width: textW + 4,
                  height: ROW,
                  transform: `translateX(${(1 - p) * -14}px)${s !== 1 ? ` scale(${s})` : ''}`,
                  transformOrigin: '0 50%',
                }}
              >
                <LineText
                  id={id}
                  size={MONO}
                  height={ROW}
                  panel
                  showTime
                  bright={f}
                  highlight={highlight}
                  highlightTone={highlightTone}
                  connector={connector}
                  beat={beat}
                />
              </div>
              {tags[id] ? (
                <div style={{ position: 'absolute', left: PAD_X + textW * s + TAG_GAP, top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}>{tags[id]}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- mail-gateway preset

export type MailHeadersProps = Omit<LogPanelProps, 'rows' | 'title' | 'icon' | 'iconTone'>;

/**
 * The spearphish headers as the mail gateway kept them (s03; s05 reuses the
 * attachment line through <LogLine>). Title «pasarela de correo · 2026-03-02
 * 09:41 UTC», sky mail icon (the gateway is the network). Anchors:
 * `mailRowAnchor`, `mailSpanAnchor`, `mailHeight`.
 */
export function MailHeaders(props: MailHeadersProps) {
  return <LogPanel rows={MAIL_ROWS} title={MAIL_TITLE} icon="mail" iconTone={C.sky} {...props} />;
}

export const mailHeight = (width: number) => logPanelHeight(MAIL_ROWS, width);
export const mailRowAnchor = (id: MailLineId, width: number, focus = 0) => logRowAnchor(MAIL_ROWS, id, width, focus);
export const mailSpanAnchor = (span: LogSpanId, width: number, focus = 0) => logSpanAnchor(MAIL_ROWS, span, width, focus);
