import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';

/**
 * The lesson's EDR process tree (s2m5, `src/data/s2.ts:1153-1176`): the morning
 * of 2026-03-02 on ENG-WS-041, drawn as a clean EDR panel. Shared by every
 * scene of the video, so it looks identical wherever it appears.
 *
 * Geometry is laid out in DESIGN units (a panel BASE_W = 1240 wide, mono text
 * 30 px) and scaled by k = min(1, width / BASE_W). A panel wider than BASE_W
 * keeps k = 1: the extra width is free room on the right, where `tags` sit.
 * Everything passed in `tags` is rendered in design units too (it scales with
 * the tree). `treeNodeAnchor` / `treeSpanAnchor` / `treeRowEnd` return points
 * in px relative to the tree's top-left corner, for any `width`.
 */

export type TreeNodeId = 'explorer' | 'powershell' | 'wcssvc' | 'winhlp' | 'schtasks' | 'c2';
/** Highlightable spans inside the rows. */
export type TreeSpanId = 'hash' | 'taskName' | 'domain';

/** Design width of the panel; at this width or more the tree is drawn at 1:1. */
export const TREE_BASE_W = 1240;
const HEADER_H = 60;
const MONO = 30;
/** JetBrains Mono advance. */
const CH = MONO * 0.6;
const ROW = 62;
const PAD_X = 28;
const LEVEL_W = 34;
/** From a level's x to its node dot centre / text start. */
const DOT_OFF = 10;
const TEXT_OFF = 28;
const BODY_TOP = 20;
/** Extra gap between the process rows and the network line. */
const C2_GAP = 50;
const BOTTOM_PAD = 34;
/** Drawn connector between «winhlp.exe» and «TLS …» on the network line. */
const CONN_W = 96;
/** Gap between a row's text and its tag slot. */
const TAG_GAP = 40;

/** The header, exactly as the canon gives it (no time zone, no per-row times). */
export const TREE_HEADER = 'EDR · árbol de procesos · ENG-WS-041 · 02-03-2026 · 09:44';
/** Time shown by the `hit` flash on the schtasks row. */
export const TREE_HIT_TIME = '09:44:20';

type Part = { text: string; kind: 'name' | 'arg'; span?: TreeSpanId; gapBefore?: number };

interface RowSpec {
  id: TreeNodeId;
  level: number;
  /** Process rows: index 0–4; the network line sits under them. */
  parts: Part[];
}

const ROWS: RowSpec[] = [
  { id: 'explorer', level: 0, parts: [{ text: 'explorer.exe', kind: 'name' }] },
  {
    id: 'powershell',
    level: 1,
    parts: [
      { text: 'powershell.exe', kind: 'name' },
      { text: ' -nop -w hidden -enc SQBFAFgAKA...', kind: 'arg' },
    ],
  },
  {
    id: 'wcssvc',
    level: 2,
    parts: [
      { text: 'wcssvc.exe', kind: 'name' },
      { text: ' -decode a.txt payload.bin', kind: 'arg' },
    ],
  },
  {
    id: 'winhlp',
    level: 3,
    parts: [
      { text: 'winhlp.exe', kind: 'name' },
      { text: 'SHA-256 4c81...b3', kind: 'arg', span: 'hash', gapBefore: 2 * CH },
    ],
  },
  {
    id: 'schtasks',
    level: 4,
    parts: [
      { text: 'schtasks.exe', kind: 'name' },
      { text: ' /create /tn ', kind: 'arg' },
      { text: 'WindowsUpdateCheck', kind: 'arg', span: 'taskName' },
      { text: ' /sc onlogon', kind: 'arg' },
    ],
  },
  {
    id: 'c2',
    level: 3,
    parts: [
      { text: 'winhlp.exe', kind: 'name' },
      { text: 'TLS ', kind: 'arg', gapBefore: CONN_W },
      { text: 'update-svc-cdn.com', kind: 'arg', span: 'domain' },
      { text: ':443', kind: 'arg' },
    ],
  },
];

/** Order the `walk` glow travels (the process chain, not the network line). */
const WALK: TreeNodeId[] = ['explorer', 'powershell', 'wcssvc', 'winhlp', 'schtasks'];
const ROW_INDEX: Record<TreeNodeId, number> = { explorer: 0, powershell: 1, wcssvc: 2, winhlp: 3, schtasks: 4, c2: 5 };

const DEFAULT_SPAN_TONE: Record<TreeSpanId, string> = { hash: C.amber, taskName: C.amber, domain: C.cyan };

// ---------------------------------------------------------------- geometry (design units)

function rowY(id: TreeNodeId): number {
  const i = ROW_INDEX[id];
  const base = HEADER_H + BODY_TOP + ROW / 2;
  return i < 5 ? base + i * ROW : base + 4 * ROW + ROW + C2_GAP;
}

function rowSpec(id: TreeNodeId): RowSpec {
  return ROWS[ROW_INDEX[id]];
}

function dotX(level: number): number {
  return PAD_X + level * LEVEL_W + DOT_OFF;
}

function textX(id: TreeNodeId): number {
  return PAD_X + rowSpec(id).level * LEVEL_W + TEXT_OFF;
}

/** Design x where each part of a row starts, plus the row's text end. */
function partXs(id: TreeNodeId): { xs: number[]; end: number } {
  let x = textX(id);
  const xs: number[] = [];
  for (const p of rowSpec(id).parts) {
    x += p.gapBefore ?? 0;
    xs.push(x);
    x += p.text.length * CH;
  }
  return { xs, end: x };
}

const DESIGN_H = rowY('c2') + ROW / 2 + BOTTOM_PAD;

/** Scale factor of the tree drawn at `width`. */
export function treeScale(width: number): number {
  return Math.min(1, width / TREE_BASE_W);
}

/** Height in px of the tree drawn at `width`. */
export function treeHeight(width: number): number {
  return DESIGN_H * treeScale(width);
}

/** Left edge of a row's text and its vertical centre, in px from the tree's top-left. */
export function treeNodeAnchor(id: TreeNodeId, width: number): { x: number; y: number } {
  const k = treeScale(width);
  return { x: textX(id) * k, y: rowY(id) * k };
}

/** Right end of a row's text (unscaled by focus), in px from the tree's top-left. */
export function treeRowEnd(id: TreeNodeId, width: number): number {
  return partXs(id).end * treeScale(width);
}

/** Where a highlightable span sits: its left/right edges, centre and row centre, in px. */
export function treeSpanAnchor(span: TreeSpanId, width: number): { x: number; y: number; x0: number; x1: number } {
  const k = treeScale(width);
  for (const r of ROWS) {
    const idx = r.parts.findIndex((p) => p.span === span);
    if (idx < 0) continue;
    const { xs } = partXs(r.id);
    const x0 = xs[idx];
    const x1 = x0 + r.parts[idx].text.length * CH;
    return { x: ((x0 + x1) / 2) * k, y: rowY(r.id) * k, x0: x0 * k, x1: x1 * k };
  }
  throw new Error(`unknown span ${span}`);
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------- component

export interface ProcessTreeProps {
  /** Panel width in px. The tree scales down below TREE_BASE_W; above it, the extra room is for tags. */
  width: number;
  frame?: number;
  /** 0–1: rows appear top-down (the network line last). Default 1. */
  draw?: number;
  /** 0–1 focus weight per row: brighter, slightly larger, with a highlight band. */
  focus?: Partial<Record<TreeNodeId, number>>;
  /** 0–1: how much everything NOT in focus steps back. */
  dim?: number;
  /** Slot on the right of a row (design units, vertically centred on the row; it follows the row's focus scale). */
  tags?: Partial<Record<TreeNodeId, ReactNode>>;
  /** 0–1 span highlights. */
  highlight?: { hash?: number; taskName?: number; domain?: number };
  /** Override the highlight colours (defaults: hash amber, taskName amber, domain cyan). */
  highlightTone?: Partial<Record<TreeSpanId, string>>;
  /** 0–1 visibility of the hash span (default 1). */
  showHash?: number;
  /** Colour of the focus band (default cyan). */
  focusTone?: string;
  /** 0–1: an emerald glow travelling explorer, powershell, wcssvc, winhlp, schtasks. */
  walk?: number;
  /**
   * 0–1 flash on the schtasks row with the time «09:44:20». Drive it with
   * progress(frame, at, ~30): it flashes once and settles lit; the time chip stays.
   */
  hit?: number;
  style?: CSSProperties;
}

export function ProcessTree({
  width,
  frame: frameProp,
  draw = 1,
  focus = {},
  dim = 0,
  tags = {},
  highlight = {},
  highlightTone = {},
  showHash = 1,
  focusTone = C.cyan,
  walk = 0,
  hit = 0,
  style,
}: ProcessTreeProps) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { fps } = useVideoConfig();
  const k = treeScale(width);
  const designW = width / k;

  // Row reveal (6 rows, top-down).
  const reveal = (id: TreeNodeId) => {
    const i = ROW_INDEX[id];
    return EASE.out(clamp01(draw * 6 - i));
  };

  // Walk: position along the 5-row chain.
  const w = clamp01(walk);
  const pos = w * (WALK.length - 1);
  const walkLit = (id: TreeNodeId) => {
    const i = WALK.indexOf(id);
    if (i < 0 || w <= 0) return 0;
    return clamp01((pos - (i - 0.3)) / 0.3);
  };

  const h = clamp01(hit);
  const hitFlash = Math.sin(Math.PI * Math.min(1, h)) + 0.35 * h;

  // SVG connectors: parent dot → child dot (vertical, then horizontal).
  const links: { from: TreeNodeId; to: TreeNodeId; dashed?: boolean }[] = [
    { from: 'explorer', to: 'powershell' },
    { from: 'powershell', to: 'wcssvc' },
    { from: 'wcssvc', to: 'winhlp' },
    { from: 'winhlp', to: 'schtasks' },
    { from: 'winhlp', to: 'c2', dashed: true },
  ];

  const rowDim = (id: TreeNodeId) => clamp01(dim) * (1 - clamp01(focus[id] ?? 0));
  const dimOpacity = (d: number) => 1 - 0.6 * d;

  return (
    <div style={{ position: 'relative', width, height: DESIGN_H * k, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: designW,
          height: DESIGN_H,
          transform: k !== 1 ? `scale(${k})` : undefined,
          transformOrigin: '0 0',
        }}
      >
        {/* Panel */}
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
              opacity: dimOpacity(clamp01(dim) * 0.6),
            }}
          >
            <Icon name="terminal" size={30} color={C.cyan} />
            <span style={{ fontFamily: FONT.sans, fontSize: 26, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>{TREE_HEADER}</span>
          </div>
        </div>

        {/* Connectors */}
        <svg width={designW} height={DESIGN_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {/* Separator above the network line. */}
          <line
            x1={PAD_X + 140}
            x2={designW - PAD_X}
            y1={rowY('schtasks') + ROW / 2 + C2_GAP / 2}
            y2={rowY('schtasks') + ROW / 2 + C2_GAP / 2}
            stroke={alpha(C.ink600, 0.7)}
            strokeWidth={2}
            strokeDasharray="4 10"
            opacity={reveal('c2') * dimOpacity(rowDim('c2'))}
          />
          {links.map((l) => {
            const p = reveal(l.to);
            if (p <= 0) return null;
            const px = dotX(rowSpec(l.from).level);
            const py = rowY(l.from) + 10;
            const cx = l.to === 'c2' ? px : dotX(rowSpec(l.to).level) - 9;
            const cy = rowY(l.to);
            const d = l.to === 'c2' ? `M${px} ${py} L${px} ${cy - 13}` : `M${px} ${py} L${px} ${cy} L${cx} ${cy}`;
            const len = l.to === 'c2' ? cy - 13 - py : cy - py + (cx - px);
            // Walk: the link lights while the glow travels it.
            const wi = WALK.indexOf(l.from);
            const lit = !l.dashed && wi >= 0 ? clamp01(pos - wi) * (w > 0 ? 1 : 0) : 0;
            const d0 = Math.max(rowDim(l.from), rowDim(l.to));
            const base = l.dashed ? alpha(C.sky, 0.6) : C.ink500;
            return (
              <g key={`${l.from}-${l.to}`} opacity={dimOpacity(l.dashed ? rowDim('c2') : d0)}>
                <path
                  d={d}
                  fill="none"
                  stroke={base}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={l.dashed ? '6 9' : `${len} ${len}`}
                  strokeDashoffset={l.dashed ? 0 : len * (1 - p)}
                  opacity={l.dashed ? p : 1}
                />
                {lit > 0 ? (
                  <path
                    d={d}
                    fill="none"
                    stroke={C.emerald}
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={`${len} ${len}`}
                    strokeDashoffset={len * (1 - lit)}
                  />
                ) : null}
              </g>
            );
          })}
          {/* Node dots. */}
          {ROWS.map((r) => {
            const p = reveal(r.id);
            if (p <= 0) return null;
            const f = clamp01(focus[r.id] ?? 0);
            const lit = walkLit(r.id);
            const x = r.id === 'c2' ? dotX(r.level) : dotX(r.level);
            const col = lit > 0 ? C.emerald : f > 0 ? focusTone : r.id === 'c2' ? C.sky : C.ink500;
            return (
              <g key={r.id} opacity={p * dimOpacity(rowDim(r.id))}>
                {r.id === 'c2' ? (
                  <circle cx={x} cy={rowY(r.id)} r={9} fill={C.ink900} stroke={col} strokeWidth={3} />
                ) : (
                  <rect x={x - 7} y={rowY(r.id) - 7} width={14} height={14} rx={3} fill={col} />
                )}
              </g>
            );
          })}
          {/* The walking glow. */}
          {w > 0 && w < 1 ? <WalkDot pos={pos} frame={frame} fps={fps} /> : null}
        </svg>

        {/* Rows */}
        {ROWS.map((r) => {
          const p = reveal(r.id);
          if (p <= 0) return null;
          const f = clamp01(focus[r.id] ?? 0);
          const d = rowDim(r.id);
          const lit = walkLit(r.id);
          const { xs, end } = partXs(r.id);
          const x0 = textX(r.id);
          const y = rowY(r.id);
          const scale = 1 + 0.06 * f;
          const flash = r.id === 'schtasks' ? hitFlash : 0;
          const band = Math.max(f, flash);
          const bandTone = flash > f ? C.emerald : focusTone;
          return (
            <div key={r.id} style={{ position: 'absolute', left: 0, top: 0, opacity: p * dimOpacity(d), filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined }}>
              {/* Focus / hit band */}
              {band > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: x0 - 14,
                    top: y - ROW / 2 + 5,
                    width: (end - x0) * scale + 28,
                    height: ROW - 10,
                    borderRadius: 10,
                    background: alpha(bandTone, 0.1 * band + 0.12 * flash),
                    border: `2px solid ${alpha(bandTone, 0.6 * band)}`,
                    boxShadow: `0 0 ${Math.round(26 * band)}px ${alpha(bandTone, 0.3 * band)}`,
                  }}
                />
              ) : null}
              {/* Text */}
              <div
                style={{
                  position: 'absolute',
                  left: x0,
                  top: y - ROW / 2,
                  height: ROW,
                  width: (end - x0) + 4,
                  transform: `translateX(${(1 - p) * -14}px)${scale !== 1 ? ` scale(${scale})` : ''}`,
                  transformOrigin: '0 50%',
                  fontFamily: FONT.mono,
                  fontSize: MONO,
                  lineHeight: `${ROW}px`,
                  whiteSpace: 'pre',
                }}
              >
                {r.parts.map((part, i) => {
                  const left = xs[i] - x0;
                  const isName = part.kind === 'name';
                  let color: string = isName ? (f > 0.5 ? C.textStrong : C.text) : f > 0.5 ? C.text : C.muted;
                  if (isName && lit > 0) color = C.emerald;
                  const spanH = part.span ? clamp01(highlight[part.span] ?? 0) : 0;
                  const spanTone = part.span ? highlightTone[part.span] ?? DEFAULT_SPAN_TONE[part.span] : C.text;
                  const op = part.span === 'hash' ? clamp01(showHash) : 1;
                  return (
                    <span
                      key={i}
                      style={{
                        position: 'absolute',
                        left,
                        top: 0,
                        color: spanH > 0.05 ? spanTone : color,
                        fontWeight: isName ? 700 : spanH > 0.05 ? 700 : 450,
                        opacity: op,
                        background: spanH > 0 ? alpha(spanTone, 0.18 * spanH) : undefined,
                        boxShadow: spanH > 0 ? `0 0 0 3px ${alpha(spanTone, 0.85 * spanH)}, 0 0 ${Math.round(22 * spanH)}px ${alpha(spanTone, 0.45 * spanH)}` : undefined,
                        borderRadius: 6,
                        lineHeight: `${MONO * 1.3}px`,
                        marginTop: (ROW - MONO * 1.3) / 2,
                      }}
                    >
                      {part.text}
                    </span>
                  );
                })}
                {/* The drawn connector of the network line. */}
                {r.id === 'c2' ? (
                  <svg
                    width={CONN_W}
                    height={ROW}
                    style={{ position: 'absolute', left: xs[1] - CONN_W - x0, top: 0, overflow: 'visible' }}
                  >
                    <line x1={14} y1={ROW / 2} x2={CONN_W - 26} y2={ROW / 2} stroke={C.sky} strokeWidth={3} strokeLinecap="round" />
                    <polygon points={`${CONN_W - 28},${ROW / 2 - 9} ${CONN_W - 12},${ROW / 2} ${CONN_W - 28},${ROW / 2 + 9}`} fill={C.sky} />
                  </svg>
                ) : null}
              </div>
              {/* Tag slot */}
              {tags[r.id] ? (
                <div style={{ position: 'absolute', left: x0 + (end - x0) * scale + TAG_GAP, top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}>{tags[r.id]}</div>
              ) : null}
            </div>
          );
        })}

        {/* Hit: the time the behaviour rule fires, under the schtasks row on the right. */}
        {h > 0 ? (
          <div
            style={{
              position: 'absolute',
              right: PAD_X,
              top: rowY('schtasks') + ROW / 2 + C2_GAP / 2,
              transform: `translateY(-50%) scale(${0.9 + 0.1 * clamp01(h * 3)})`,
              transformOrigin: 'right center',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '4px 16px',
              borderRadius: 999,
              border: `2px solid ${alpha(C.emerald, 0.85)}`,
              background: C.ink900,
              boxShadow: `0 0 ${Math.round(10 + 24 * hitFlash)}px ${alpha(C.emerald, 0.25 + 0.3 * Math.min(1, hitFlash))}`,
              opacity: clamp01(h * 3),
              fontFamily: FONT.mono,
              fontSize: MONO,
              fontWeight: 700,
              color: C.emerald,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="clock" size={28} color={C.emerald} />
            {TREE_HIT_TIME}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** The emerald glow travelling the chain (design units, inside the tree's SVG). */
function WalkDot({ pos, frame, fps }: { pos: number; frame: number; fps: number }) {
  const i = Math.min(WALK.length - 2, Math.floor(pos));
  const t = pos - i;
  const a = WALK[i];
  const b = WALK[i + 1];
  const ax = dotX(rowSpec(a).level);
  const ay = rowY(a);
  const bx = dotX(rowSpec(b).level);
  const by = rowY(b);
  // 70 % of the hop goes down, 30 % across.
  let x: number;
  let y: number;
  if (t < 0.7) {
    x = ax;
    y = ay + (by - ay) * (t / 0.7);
  } else {
    x = ax + (bx - ax) * ((t - 0.7) / 0.3);
    y = by;
  }
  const r = 9 + 2 * pulse(frame, fps, 0.8);
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.4} fill={alpha(C.emerald, 0.2)} />
      <circle cx={x} cy={y} r={r} fill={C.emerald} />
    </g>
  );
}

/** The canonical walk order, exported for scenes that sync beats to each hop. */
export const TREE_WALK = WALK;
/** The standard `hit` drive: progress(frame, at, 30) — flashes once, then settles lit with the time chip. */
export const treeHitProgress = (frame: number, at: number) => progress(frame, at, 30, EASE.out);
