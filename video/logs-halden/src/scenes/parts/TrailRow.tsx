import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse as pulseOf } from '../../../../engine/src/theme/motion';
import { enterFramesFor, sceneTiming } from '../../../../engine/src/timeline/load';
import { Icon, clamp01, dimStyle, mix, windowWeight } from '../../../../engine/src/ui';
import { TIMELINE } from '../../timeline/load';
import { TrailIcon } from './TrailIcons';

/**
 * The morning queue of V10 and its three rows — «21-10 · 08:00 · revisión de
 * la mañana» — drawn ONE way everywhere (canon: out/scene-brief.md «Canon»).
 * Stage-local coordinates (1728×660 inside <Stage>).
 *
 * Data
 *   - `TrailKind` 'key' | 'folder' | 'pipe'; `TRAIL_ORDER` is their time order.
 *   - `TRAILS[kind]` = { time, text, host? }. MARKUP: inside `text`, a span
 *     between backticks is drawn in monospace (the folder row's `../`). To
 *     print a row as a plain string use `trailPlain(kind)`, which strips the
 *     backticks («04:26 · peticiones con ../ · hpa-portal-web-01»); `host` is
 *     always monospace and has no markup.
 *   - `QUEUE` = s01's queue panel at its RESTING place (where it sits from the
 *     title to the last frame of s01): { x, y, width, height, pad,
 *     headerHeight, headerGap, rowHeight, gap, headerText }. `rowRect(kind)`
 *     = that row's stage-local box { x, y, width, height } in that layout.
 *   - `STRIP` = the title strip a row expands into: { x: 0, y: 0, width:
 *     1728, height: 90 }. Draw your scene below y ≈ 104.
 *
 * Components
 *   - `<TrailRow kind width height? lit? dim? frame? pulse? compact? style? />`
 *     one row as s01 draws it: rose severity stripe, icon tile, time, text,
 *     host pill (cyan: Halden's system). `lit` 0 = «a media luz», 1 = lit
 *     (rose border + glow). `dim` 0–1 steps it back (engine dimStyle). Text
 *     is 36 px at the default height and never shrinks below 32 px to fit a
 *     narrow width: it clips instead. Not positioned — wrap it.
 *   - `<QueuePanel … />` the queue's panel (header + three rows), not
 *     positioned (QUEUE.width × QUEUE.height). Used by s01 and ExpandingRow.
 *   - `<ExpandingRow kind frame startAt duration? context? away? dim? />`
 *     the opening of s02 (key), s04 (folder) and s05 (pipe): before
 *     `startAt` the queue sits where s01 left it with this row lit; over
 *     `duration` (default 14) frames the row moves and widens into STRIP while
 *     the rest of the queue fades, and stays there as the scene's title strip.
 *     Put it DIRECTLY inside <Stage> (it positions itself; no wrapper offset).
 *     Suggested `startAt`: `props.enterFrames` (after the cross-fade / wipe).
 *       `away`: frame windows [from, to) in which the strip folds into a
 *       small tab at the left (icon only, x 0–116), leaving the stage's
 *       top-centre free. s04 and s05 MUST pass `away={overlayWindows(<scene
 *       id>)}`: the intercepted message (s04, before s04-06) and the think
 *       prompt (s05, after s05-07) draw exactly where the strip sits.
 *       `context` (default true) draws the rest of the queue fading out.
 *   - `overlayWindows(sceneId)` the scene's intercept and think-prompt
 *     windows in LOCAL frames, read from timeline.json (so they follow the
 *     real voice), with a 14-frame lead so the fold is complete when the
 *     card starts. [] when the scene has none.
 *   - `<TrailStrip kind frame? away? dim? />` the strip alone, already
 *     expanded (e.g. s03, which follows s02 without re-expanding).
 *   - `<TrailText text size color? />` renders TRAILS text with its markup.
 */

export type TrailKind = 'key' | 'folder' | 'pipe';

export const TRAIL_ORDER: readonly TrailKind[] = ['key', 'folder', 'pipe'];

export interface Trail {
  time: string;
  /** Description; backtick spans are monospace (see the file comment). */
  text: string;
  /** Halden's system the row is about, monospace (absent on the key row, whose target is in the text). */
  host?: string;
}

/** Canon (brief «Canon»): the three rows, in time order. */
export const TRAILS: Record<TrailKind, Trail> = {
  key: { time: '03:10', text: 'fallos de inicio de sesión · 1 origen · proveedor de identidad' },
  folder: { time: '04:26', text: 'peticiones con `../`', host: 'hpa-portal-web-01' },
  pipe: { time: '05:40', text: 'DNS entrante masivo', host: 'hpa-portal-web-01' },
};

/** The row as one plain string, markup stripped: «03:10 · fallos de inicio de sesión · …». */
export function trailPlain(kind: TrailKind): string {
  const t = TRAILS[kind];
  return [t.time, t.text.replace(/`/g, ''), t.host].filter(Boolean).join(' · ');
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** s01's queue panel at its resting place (stage-local). Rows sit inside it, under the header. */
export const QUEUE = {
  x: 24,
  y: 208,
  width: 1680,
  height: 424,
  /** Inner padding of the panel. */
  pad: 20,
  headerHeight: 56,
  /** Space between the header and the first row. */
  headerGap: 12,
  rowHeight: 96,
  /** Space between rows. */
  gap: 14,
  headerText: '21-10 · 08:00 · revisión de la mañana',
} as const;

/** The stage-local box of a row in s01's resting layout. */
export function rowRect(kind: TrailKind): Rect {
  const i = TRAIL_ORDER.indexOf(kind);
  return {
    x: QUEUE.x + QUEUE.pad,
    y: QUEUE.y + QUEUE.pad + QUEUE.headerHeight + QUEUE.headerGap + i * (QUEUE.rowHeight + QUEUE.gap),
    width: QUEUE.width - 2 * QUEUE.pad,
    height: QUEUE.rowHeight,
  };
}

/** A row's box relative to the panel's top-left corner. */
function rowLocal(kind: TrailKind): Rect {
  const r = rowRect(kind);
  return { ...r, x: r.x - QUEUE.x, y: r.y - QUEUE.y };
}

/** The title strip a row expands into. */
export const STRIP: Rect = { x: 0, y: 0, width: STAGE.width, height: 90 };

/** Width of the strip folded aside (`away`): the icon tile only (PAD_L + tile + PAD_R), clear of the s04 intercept card, whose left edge sits at stage x ≈ 200. */
const TAB_W = 116;

// ---------------------------------------------------------------------------
// Text fitting (estimates for IF Inter / IF JetBrains Mono; checked in stills).

const SANS_EM = 0.54;
const MONO_EM = 0.6;
const MONO_PAD = 10; // the small background behind a mono span
const GAP = 20;
const PAD_L = 18;
const PAD_R = 28;
const MIN_FONT = 32;

function textWidth(text: string, size: number): number {
  return text.split('`').reduce((w, part, i) => w + part.length * size * (i % 2 ? MONO_EM : SANS_EM) + (i % 2 && part ? MONO_PAD : 0), 0);
}

function hostWidth(host: string, size: number): number {
  return host.length * (size - 2) * MONO_EM + 2 * 14 + 4;
}

/** Font size of a row at `width`×`height`: 36 px at the default height, down to 32 px to fit, never below. */
function rowFont(kind: TrailKind, width: number, height: number): number {
  const t = TRAILS[kind];
  const base = Math.min(36, Math.round(height * 0.4));
  const tile = height - 20;
  const items = t.host ? 6 : 4;
  const fixed = PAD_L + PAD_R + tile + (items - 1) * GAP;
  const variable = (s: number) => t.time.length * (s + 2) * MONO_EM + 0.3 * s * (t.host ? 2 : 1) + textWidth(t.text, s) + (t.host ? hostWidth(t.host, s) : 0);
  const room = width - fixed;
  if (variable(base) <= room) return base;
  const fit = Math.floor((base * room) / variable(base));
  return Math.max(Math.min(MIN_FONT, base), fit);
}

// ---------------------------------------------------------------------------

/** TRAILS text with its markup: backtick spans in monospace (rose, the attack's own characters). */
export function TrailText({ text, size, color = C.text, style }: { text: string; size: number; color?: string; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 650, color, whiteSpace: 'nowrap', ...style }}>
      {text.split('`').map((part, i) =>
        i % 2 ? (
          <span
            key={i}
            style={{
              fontFamily: FONT.mono,
              fontWeight: 750,
              color: C.roseSoft,
              background: alpha(C.rose, 0.12),
              borderRadius: 8,
              padding: `0 ${MONO_PAD / 2}px`,
            }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

function Dot({ size }: { size: number }) {
  return <span style={{ fontSize: size, fontWeight: 700, color: C.faint }}>·</span>;
}

/** One queue row (see the file comment). Not positioned. */
export function TrailRow({
  kind,
  width,
  height = QUEUE.rowHeight,
  lit = 0,
  dim = 0,
  frame: frameProp,
  pulse = false,
  compact = 0,
  style,
}: {
  kind: TrailKind;
  width: number;
  height?: number;
  /** 0 = «a media luz», 1 = lit (rose border and glow). */
  lit?: number;
  /** 0–1: steps the row back (engine dimStyle). */
  dim?: number;
  frame?: number;
  /** Breathe the glow (0.5 Hz) while lit. */
  pulse?: boolean;
  /** 0–1: fades the time, text and host out, keeping the icon (for the narrow folded tab). */
  compact?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const t = TRAILS[kind];
  const k = clamp01(lit);
  const glow = k * (pulse ? 0.8 + 0.2 * pulseOf(frame, fps, 0.5) : 1);
  const size = rowFont(kind, width, height);
  const tile = height - 20;
  const content = 0.62 + 0.38 * k; // half-light → full
  const textOpacity = 1 - clamp01(compact);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: GAP,
        padding: `0 ${PAD_R}px 0 ${PAD_L}px`,
        borderRadius: 18,
        border: `2px solid ${alpha(C.rose, 0.26 + 0.62 * k)}`,
        background: `linear-gradient(90deg, ${alpha(C.rose, 0.06 + 0.12 * k)} 0%, ${alpha(C.ink850, 0.97)} 32%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(30 * glow)}px ${alpha(C.rose, 0.3 * glow)}` : `0 12px 30px ${alpha('#000000', 0.3)}`,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontFamily: FONT.sans,
        ...dimStyle(dim),
        ...style,
      }}
    >
      {/* Severity stripe */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 7, background: alpha(C.rose, 0.45 + 0.55 * k) }} />
      {/* Icon tile */}
      <div
        style={{
          width: tile,
          height: tile,
          flexShrink: 0,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.rose, 0.08 + 0.12 * k),
          border: `2px solid ${alpha(C.rose, 0.35 + 0.45 * k)}`,
          opacity: 0.7 + 0.3 * k,
        }}
      >
        <TrailIcon kind={kind} size={Math.round(tile * 0.7)} />
      </div>
      {/* Time */}
      <span style={{ flexShrink: 0, fontFamily: FONT.mono, fontSize: size + 2, fontWeight: 800, color: C.textStrong, opacity: content * textOpacity }}>{t.time}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: GAP, opacity: content * textOpacity }}>
        <Dot size={size} />
        <TrailText text={t.text} size={size} />
        {t.host ? (
          <>
            <Dot size={size} />
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: size - 2,
                fontWeight: 700,
                color: C.cyanSoft,
                padding: '4px 14px',
                borderRadius: RADIUS.sm,
                border: `2px solid ${alpha(C.cyan, 0.45)}`,
                background: alpha(C.cyan, 0.08),
              }}
            >
              {t.host}
            </span>
          </>
        ) : null}
      </span>
    </div>
  );
}

/** Per-row state for QueuePanel. */
export interface RowState {
  lit?: number;
  dim?: number;
  pulse?: boolean;
}

/**
 * The queue's panel (QUEUE.width × QUEUE.height, not positioned): header with
 * the bell, «21-10 · 08:00 · revisión de la mañana», «cola de alertas» and
 * the count, then the three rows at their `rowRect` places.
 */
export function QueuePanel({
  rows = {},
  hide,
  headerGlow = 0,
  countIn = 1,
  chromeDim = 0,
  frame: frameProp,
  style,
}: {
  rows?: Partial<Record<TrailKind, RowState>>;
  /** A row not to draw (ExpandingRow draws it itself). */
  hide?: TrailKind;
  /** 0–1: the header's date lights. */
  headerGlow?: number;
  /** 0–1: the count badge pops in. */
  countIn?: number;
  /** 0–1: steps the header and frame back (not the rows). */
  chromeDim?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const [date, time, ...rest] = QUEUE.headerText.split(' · ');
  const g = clamp01(headerGlow);
  const badge = clamp01(countIn);
  const chrome = dimStyle(chromeDim);
  return (
    <div style={{ position: 'relative', width: QUEUE.width, height: QUEUE.height, fontFamily: FONT.sans, ...style }}>
      {/* Frame */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: RADIUS.lg,
          border: `2px solid ${C.ink700}`,
          background: `linear-gradient(180deg, ${alpha(C.ink850, 0.96)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
          boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}, inset 0 1px 0 ${alpha('#ffffff', 0.04)}`,
          ...chrome,
        }}
      />
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          left: QUEUE.pad + 8,
          right: QUEUE.pad + 8,
          top: QUEUE.pad,
          height: QUEUE.headerHeight,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          whiteSpace: 'nowrap',
          ...chrome,
        }}
      >
        <Icon name="bell" size={36} color={C.cyan} />
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 36,
            fontWeight: 800,
            color: C.cyanSoft,
            textShadow: g > 0.02 ? `0 0 ${Math.round(22 * g)}px ${alpha(C.cyan, 0.6 * g)}` : undefined,
          }}
        >
          {date} · {time}
        </span>
        <span style={{ fontSize: 36, fontWeight: 700, color: C.faint }}>·</span>
        <span style={{ fontSize: 36, fontWeight: 750, color: C.textStrong }}>{rest.join(' · ')}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 28, fontWeight: 650, color: C.muted }}>cola de alertas</span>
        <span
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            display: 'grid',
            placeItems: 'center',
            background: C.rose,
            color: C.ink950,
            fontFamily: FONT.mono,
            fontSize: 28,
            fontWeight: 850,
            opacity: Math.min(1, badge * 1.5),
            transform: `scale(${0.6 + 0.4 * badge})`,
          }}
        >
          3
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: QUEUE.pad,
          right: QUEUE.pad,
          top: QUEUE.pad + QUEUE.headerHeight + QUEUE.headerGap / 2 - 1,
          height: 2,
          background: C.ink700,
          ...chrome,
        }}
      />
      {/* Rows */}
      {TRAIL_ORDER.filter((k) => k !== hide).map((k) => {
        const r = rowLocal(k);
        const s = rows[k] ?? {};
        return (
          <div key={k} style={{ position: 'absolute', left: r.x, top: r.y }}>
            <TrailRow kind={k} width={r.width} height={r.height} lit={s.lit ?? 0} dim={s.dim ?? 0} pulse={s.pulse} frame={frame} />
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------

function lerpRect(a: Rect, b: Rect, t: number): Rect {
  return { x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), width: mix(a.width, b.width, t), height: mix(a.height, b.height, t) };
}

/**
 * The scene's intercepted-message and think-prompt windows [from, to) in local frames (timeline.json, so
 * they follow the real voice), each starting 14 frames early (the 12-frame fold is done when the card starts): pass them as ExpandingRow / TrailStrip `away`.
 */
export function overlayWindows(sceneId: string): [number, number][] {
  const origin = sceneTiming(TIMELINE, sceneId).from - enterFramesFor(TIMELINE, sceneId);
  const spans = [...(TIMELINE.intercept ?? []), ...TIMELINE.think].filter((o) => o.scene === sceneId);
  return spans.map((o) => [o.from - origin - 14, o.from - origin + o.durationInFrames] as [number, number]);
}

/** 0–1: how folded aside the strip is (the strongest of the `away` windows). */
function awayWeight(frame: number, away: readonly (readonly [number, number])[] | undefined): number {
  if (!away) return 0;
  return away.reduce((w, [from, to]) => Math.max(w, windowWeight(frame, from, to, { ramp: 12, lead: 0 })), 0);
}

/** The strip at the top, with the `away` fold and `dim`. Positions itself. */
function StripAt({ kind, box, away, dim, frame }: { kind: TrailKind; box: Rect; away: number; dim: number; frame: number }) {
  const width = mix(box.width, TAB_W, away);
  return (
    <div style={{ position: 'absolute', left: box.x, top: box.y }}>
      <TrailRow kind={kind} width={width} height={box.height} lit={1} dim={Math.max(dim, 0.25 * away)} compact={away} frame={frame} />
    </div>
  );
}

/** The strip alone, already expanded (see the file comment). Put it directly inside <Stage>. */
export function TrailStrip({
  kind,
  frame: frameProp,
  away,
  dim = 0,
}: {
  kind: TrailKind;
  frame?: number;
  away?: readonly (readonly [number, number])[];
  dim?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  return <StripAt kind={kind} box={STRIP} away={awayWeight(frame, away)} dim={dim} frame={frame} />;
}

/** «Se amplía la fila»: the row grows out of s01's queue into the title strip (see the file comment). */
export function ExpandingRow({
  kind,
  frame,
  startAt,
  duration = 14,
  context = true,
  away,
  dim = 0,
}: {
  kind: TrailKind;
  frame: number;
  startAt: number;
  duration?: number;
  /** Draw the rest of the queue fading out (default true). */
  context?: boolean;
  /** Windows [from, to) in which the strip folds into a tab at the left (intercept / think prompt). */
  away?: readonly (readonly [number, number])[];
  /** 0–1: steps the strip back. */
  dim?: number;
}) {
  const p = progress(frame, startAt, duration, EASE.inOut);
  const box = lerpRect(rowRect(kind), STRIP, p);
  const ctxOut = progress(frame, startAt - 2, Math.max(6, Math.round(duration * 0.7)), EASE.inOut);
  // A faint outline that opens from the row down over the stage and is gone before the row lands.
  const ghostT = progress(frame, startAt + 1, Math.max(6, Math.round(duration * 0.8)), EASE.out);
  const ghostOn = ghostT > 0 && ghostT < 1;
  const ghost = lerpRect(rowRect(kind), { x: 0, y: STRIP.height + 12, width: STAGE.width, height: STAGE.height - STRIP.height - 12 }, ghostT);
  const ghostA = Math.sin(Math.PI * ghostT) * 0.35;
  return (
    <>
      {context && ctxOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: QUEUE.x,
            top: QUEUE.y,
            opacity: 1 - ctxOut,
            transform: `scale(${1 - 0.03 * ctxOut})`,
            transformOrigin: '50% 50%',
          }}
        >
          <QueuePanel hide={kind} rows={{ key: { lit: 0.35, dim: 0.3 }, folder: { lit: 0.35, dim: 0.3 }, pipe: { lit: 0.35, dim: 0.3 } }} chromeDim={0.3} frame={frame} />
        </div>
      ) : null}
      {ghostOn ? (
        <div
          style={{
            position: 'absolute',
            left: ghost.x,
            top: ghost.y,
            width: ghost.width,
            height: ghost.height,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `2px solid ${alpha(C.rose, ghostA)}`,
            background: alpha(C.rose, 0.05 * ghostA),
          }}
        />
      ) : null}
      <StripAt kind={kind} box={box} away={awayWeight(frame, away)} dim={dim} frame={frame} />
    </>
  );
}
