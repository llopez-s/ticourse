import type { CSSProperties, ReactNode } from 'react';
import { interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../engine/src/theme/motion';
import { clamp01, dimStyle, focusWeight, mix, tone as toneOf, type FocusInput, type Tone } from '../../../../engine/src/ui';

/**
 * The case whiteboard of IR-2026-0147 — the spine of the video. Seven columns
 * in exam order, each with its Spanish name (large), the English exam name
 * (small, violet = exam), a «¿terminada?» checkbox and its exit condition.
 * Every scene that shows the board uses this component, so the text and the
 * look stay identical across the video.
 *
 * Everything is driven by props and Sequence-relative frames (`at` of box
 * steps, focus windows); nothing here reads the timeline. Coordinates are
 * board-local: the caller positions the board (full size = the whole stage,
 * 1728×660; compact = a 150 px strip).
 */

export type ColumnId = 'prep' | 'detect' | 'analysis' | 'contain' | 'eradicate' | 'recover' | 'lessons';

export interface ColumnDef {
  id: ColumnId;
  /** 1-based position in the exam order. */
  n: number;
  /** Spanish name as drawn, one entry per line. */
  es: readonly string[];
  /** English exam name (the only English on the board). */
  en: string;
  /** Exit condition of the «¿terminada?» box. */
  condition: string;
}

/** The seven columns, in exam order, with their exact on-screen text. */
export const COLUMNS: readonly ColumnDef[] = [
  { id: 'prep', n: 1, es: ['Preparación'], en: 'Preparation', condition: 'plan, roles y suplentes' },
  { id: 'detect', n: 2, es: ['Detección'], en: 'Detection', condition: 'caso declarado: número, hora y gravedad' },
  { id: 'analysis', n: 3, es: ['Análisis'], en: 'Analysis', condition: 'alcance conocido' },
  { id: 'contain', n: 4, es: ['Contención'], en: 'Containment', condition: 'la atacante ya no puede hacer más daño' },
  { id: 'eradicate', n: 5, es: ['Erradicación'], en: 'Eradication', condition: 'sin persistencia ni agujero, en todos los equipos' },
  { id: 'recover', n: 6, es: ['Recuperación'], en: 'Recovery', condition: 'copia limpia, comprobada y vigilada' },
  { id: 'lessons', n: 7, es: ['Lecciones', 'aprendidas'], en: 'Lessons learned', condition: 'causas con responsable y fecha' },
];

export const COLUMN_IDS: readonly ColumnId[] = COLUMNS.map((c) => c.id);

/** Definition of one column. */
export function columnDef(id: ColumnId): ColumnDef {
  const def = COLUMNS.find((c) => c.id === id);
  if (!def) throw new Error(`unknown board column ${id}`);
  return def;
}

/** Spanish name on one line (e.g. «Lecciones aprendidas»). */
export function columnName(id: ColumnId): string {
  return columnDef(id).es.join(' ');
}

export const BOARD_TITLE = { caseId: 'CASO IR-2026-0147', org: 'Autoridad Portuaria de Halden' } as const;
export const BOX_LABEL = '¿terminada?';
/** Canon times written next to a ticked box (declared 2026-09-03 16:09 CEST; first containment 16:15; closed 10:30 on 4-9). */
export const CASE_TIMES = { declared: '16:09', firstContainment: '16:15', containment: '10:30' } as const;

export const BOARD_W = 1728;
export const BOARD_H = 660;
export const BOARD_COMPACT_H = 150;
/** Room the `loop` needs under the board (leave it free when you use the loop). */
export const BOARD_LOOP_SPACE = 64;

// ---------------------------------------------------------------------------
// Checkbox states
// ---------------------------------------------------------------------------

/**
 * `empty` · `checked` (emerald tick drawn + time label) · `wrong` (a ticked
 * box turns amber, is struck out in rose and empties again: checked too
 * early) · `pulse` (keeps whatever mark it had and breathes while the viewer
 * thinks).
 */
export type BoxState = 'empty' | 'checked' | 'wrong' | 'pulse';

/** One timed change of a box. `time` is the label written next to a tick (e.g. «18:10»). */
export interface BoxStep {
  at: number;
  state: BoxState;
  time?: string;
}

/** Frames of each box animation. A `wrong` step lasts WRONG_FRAMES in total (then the box is empty). */
export const BOX_TIMING = { tick: 12, untick: 10, amber: 10, strike: 12, hold: 18, clear: 14 } as const;
export const WRONG_FRAMES = BOX_TIMING.amber + BOX_TIMING.strike + BOX_TIMING.hold + BOX_TIMING.clear;

/** What a column is doing. Every field is optional; `defaults` on the board apply to all columns. */
export interface ColumnState {
  /** A static state (already there at frame 0) or timed steps; before the first step the box is empty. */
  box?: BoxState | readonly BoxStep[];
  /** Time label for a static `checked` box (steps carry their own `time`). */
  time?: string;
  /** Widens and brightens the column (0–1, boolean or a [from, to) window); the others dim unless `autoDim` is false. */
  focus?: FocusInput;
  /** How much wider the column gets at full focus (default: the board's `focusGrow`). */
  grow?: number;
  /** Extra step-back (0–1, boolean or window), on top of the automatic dim. */
  dim?: FocusInput;
  /** Colour of the focus highlight (default cyan). */
  tone?: Tone;
  /** 0–1 highlight that does not resize the column (e.g. Preparación lighting up at the end). */
  glow?: number;
  /** Colour of `glow` (default emerald). */
  glowTone?: Tone;
  /** 0–1 emphasis of the checkbox and its «¿terminada?» label. */
  boxGlow?: number;
  /** 0–1 emphasis of the condition line. */
  condition?: number;
  /** Colour of `condition` emphasis (default cyan). */
  conditionTone?: Tone;
  /** 0 = silhouette (grey bars instead of text), 1 = written. Default 1. */
  reveal?: number;
  /** 0–1: the column appears (fade + small rise). Default 1. */
  show?: number;
  /** Content of the column body (between the English name and «¿terminada?»; full layout only, clipped). */
  body?: ReactNode | ((geo: ColumnGeo) => ReactNode);
}

export interface BoardProps {
  columns?: Partial<Record<ColumnId, ColumnState>>;
  /** Merged under every column's own state (e.g. `{ reveal: 0 }` for the silhouette, `{ boxGlow: 1 }`). */
  defaults?: ColumnState;
  /** 0 = full layout, 1 = compact strip; fractional values morph between them. */
  compact?: number;
  width?: number;
  /** Height of the full layout (default 660). */
  height?: number;
  /** Height of the compact strip (default 150). */
  compactHeight?: number;
  /** Width multiplier of a focused column: its share grows by (1 + focusGrow). Default 2.4 (compact: 1). */
  focusGrow?: number;
  /** Dim the other columns while one is focused. Default true. */
  autoDim?: boolean;
  /** Frames the focus takes to open / close. Default 16. */
  ramp?: number;
  /** Title row: false hides it, a number fades it. Default shown. */
  title?: boolean | number;
  /** 0–1: draws the return path from the last column back to the first, under the board (s09). */
  loop?: number;
  loopTone?: Tone;
  /** 0–1: the whole board appears. Default 1. */
  show?: number;
  frame?: number;
  style?: CSSProperties;
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

export interface ColumnGeo {
  id: ColumnId;
  def: ColumnDef;
  /** Board-local column band. */
  x: number;
  w: number;
  /** Text area inside the band. */
  innerX: number;
  innerW: number;
  focus: number;
  dim: number;
  reveal: number;
  show: number;
  nameSize: number;
  nameTop: number;
  nameSlotH: number;
  enSize: number;
  enTop: number;
  labelTop: number;
  /** Size of «¿terminada?» (0 = too narrow to show it: only the box). */
  labelSize: number;
  condSize: number;
  condTop: number;
  timeSize: number;
  /** The checkbox square (board-local) and its centre. */
  box: { x: number; y: number; size: number; cx: number; cy: number };
  /** Body slot (full layout; its height goes to 0 in compact). */
  body: { x: number; y: number; w: number; h: number };
}

export interface BoardGeometry {
  width: number;
  height: number;
  compact: number;
  titleH: number;
  list: ColumnGeo[];
  columns: Record<ColumnId, ColumnGeo>;
}

const PAD = 14;
const NAME = { full: 40, focus: 56, compact: 30, compactFocus: 34 } as const;
const TITLE_H = { full: 62, compact: 34 } as const;
const NAME_SLOT = { full: 88, compact: 60 } as const;
const FOOTER_H = 202;

/**
 * Rough advance width of `text` in em for bold Inter (the engine's sans).
 * Used only to shrink a label that would not fit; checked on the QA stills.
 */
export function emWidth(text: string): number {
  let w = 0;
  for (const ch of text) {
    if (ch === ' ') w += 0.26;
    else if ('iíìïjl.,:;|!\''.includes(ch)) w += 0.29;
    else if ('ftrI()'.includes(ch)) w += 0.39;
    else if ('mwMW'.includes(ch)) w += 0.88;
    else if (ch === '¿' || ch === '?') w += 0.5;
    else if (ch >= '0' && ch <= '9') w += 0.62;
    else if (ch !== ch.toLowerCase()) w += 0.7;
    else w += 0.59;
  }
  return w;
}

/** Largest size ≤ `size` at which `text` wraps into at most `lines` lines of `width` px. */
function fitLines(text: string, size: number, width: number, lines: number): number {
  const need = emWidth(text) * 1.14; // word-wrap slack
  if (need * size <= width * lines) return size;
  return Math.max(16, Math.floor((width * lines) / need));
}

function mergedState(p: BoardProps, id: ColumnId): ColumnState {
  return { ...(p.defaults ?? {}), ...(p.columns?.[id] ?? {}) };
}

/**
 * Where everything is on the board at `frame`, for the same props the Board
 * gets. Use it to anchor your own overlays (a chip next to a box, an item
 * flying into a column): the result is board-local, add the board's left/top.
 */
export function boardGeometry(p: BoardProps, frame: number): BoardGeometry {
  const W = p.width ?? BOARD_W;
  const Hf = p.height ?? BOARD_H;
  const Hc = p.compactHeight ?? BOARD_COMPACT_H;
  const k = clamp01(p.compact ?? 0);
  const H = mix(Hf, Hc, k);
  const T = mix(TITLE_H.full, TITLE_H.compact, k);
  const ramp = p.ramp ?? 16;
  const states = COLUMNS.map((c) => mergedState(p, c.id));
  const f = states.map((s) => focusWeight(s.focus, frame, { ramp }));
  const extraDim = states.map((s) => focusWeight(s.dim, frame, { ramp }));
  const autoDim = p.autoDim !== false;
  const dims = f.map((fi, i) => {
    const others = autoDim ? f.reduce((m, fj, j) => (j === i ? m : Math.max(m, fj)), 0) : 0;
    return clamp01(Math.max(extraDim[i], others)) * (1 - fi);
  });

  // Base widths follow the names (a board ruled by hand): the long names get the room they need at 40 px.
  const base = COLUMNS.map((c) => Math.max(150, Math.max(...c.es.map(emWidth)) * NAME.full) + 2 * PAD);
  const weights = base.map((b, i) => {
    const g = mix(states[i].grow ?? p.focusGrow ?? 2.4, 1, k);
    return b * (1 + g * f[i]);
  });
  const scale = W / weights.reduce((a, b) => a + b, 0);

  let x = 0;
  const list = COLUMNS.map((def, i): ColumnGeo => {
    const st = states[i];
    const fi = f[i];
    const w = weights[i] * scale;
    const innerX = x + PAD;
    const innerW = w - 2 * PAD;
    const lines = def.es.length;
    const slotH = mix(NAME_SLOT.full, NAME_SLOT.compact, k);
    const nameTarget = mix(mix(NAME.full, NAME.focus, fi), mix(NAME.compact, NAME.compactFocus, fi), k);
    const nameSize = Math.min(nameTarget, innerW / Math.max(...def.es.map(emWidth)), slotH / (lines * 1.06));
    const enSize = Math.min(mix(26, 32, fi), innerW / (emWidth(def.en) * 0.95));
    const condSize = fitLines(def.condition, mix(26, 32, fi), innerW, 3);
    const boxSize = Math.min(mix(mix(50, 58, fi), mix(32, 36, fi), k), innerW * 0.42);
    const timeSize = mix(mix(30, 34, fi), 22, k);
    // «¿terminada?» shrinks to its column; below 15 px only the box is drawn, so neighbours never touch.
    const labelFit = Math.min(22, (innerW - 4) / (emWidth(BOX_LABEL) * 1.1));
    const labelSize = labelFit < 15 ? 0 : labelFit;

    // Full layout: header at the top, footer (label, box, condition) at the bottom, body between.
    // A focused column's footer shrinks to its own condition (fewer, bigger lines), which gives its body room.
    const condLines = Math.max(1, Math.min(3, Math.ceil((emWidth(def.condition) * 1.14 * condSize) / innerW)));
    const ownFooter = 30 + boxSize + 12 + condLines * condSize * 1.22 + 14;
    const fNameTop = TITLE_H.full + 34;
    const fEnTop = fNameTop + NAME_SLOT.full + 6;
    const fBodyTop = fEnTop + 44;
    const fLabelTop = Hf - mix(FOOTER_H, Math.min(FOOTER_H, ownFooter), fi);
    const fBoxTop = fLabelTop + 30;
    // Compact: the name and, under it, the box row.
    const cNameTop = TITLE_H.compact + 6;
    const cBoxTop = TITLE_H.compact + 6 + NAME_SLOT.compact + 8;

    const nameTop = mix(fNameTop, cNameTop, k);
    const boxTop = mix(fBoxTop, cBoxTop, k);
    const bodyTop = fBodyTop;
    const bodyH = Math.max(0, (fLabelTop - 10 - fBodyTop) * (1 - k));
    const geo: ColumnGeo = {
      id: def.id,
      def,
      x,
      w,
      innerX,
      innerW,
      focus: fi,
      dim: dims[i],
      reveal: clamp01(st.reveal ?? 1),
      show: clamp01(st.show ?? 1),
      nameSize,
      nameTop,
      nameSlotH: slotH,
      enSize,
      enTop: mix(fEnTop, cNameTop + NAME_SLOT.compact, k),
      labelTop: mix(fLabelTop, cBoxTop - 26, k),
      labelSize,
      condSize,
      condTop: mix(fBoxTop + boxSize + 12, cBoxTop + boxSize + 8, k),
      timeSize,
      box: { x: innerX, y: boxTop, size: boxSize, cx: innerX + boxSize / 2, cy: boxTop + boxSize / 2 },
      body: { x: innerX, y: bodyTop, w: innerW, h: bodyH },
    };
    x += w;
    return geo;
  });

  const columns = Object.fromEntries(list.map((g) => [g.id, g])) as Record<ColumnId, ColumnGeo>;
  return { width: W, height: H, compact: k, titleH: T, list, columns };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Board(props: BoardProps) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = props.frame ?? current;
  const geo = boardGeometry(props, frame);
  const { width: W, height: H, compact: k, titleH: T } = geo;
  const show = clamp01(props.show ?? 1);
  const titleOpacity = props.title === false ? 0 : typeof props.title === 'number' ? clamp01(props.title) : 1;
  const fullOnly = clamp01(1 - 2 * k);

  return (
    <div
      style={{
        position: 'relative',
        width: W,
        height: H,
        opacity: show,
        transform: show < 1 ? `translateY(${(1 - show) * 24}px)` : undefined,
        fontFamily: FONT.sans,
        ...props.style,
      }}
    >
      {/* The board surface */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: mix(RADIUS.lg, RADIUS.md, k),
          border: `2px solid ${C.ink600}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `inset 0 1px 0 ${alpha(C.textStrong, 0.05)}, 0 18px 40px ${alpha('#000000', 0.35)}`,
        }}
      />

      {/* Title row */}
      <div
        style={{
          position: 'absolute',
          left: mix(24, 16, k),
          top: 0,
          height: T,
          display: 'flex',
          alignItems: 'center',
          gap: mix(16, 10, k),
          whiteSpace: 'nowrap',
          opacity: titleOpacity,
        }}
      >
        <span style={{ fontFamily: FONT.mono, fontSize: mix(30, 20, k), fontWeight: 800, color: C.textStrong, letterSpacing: 0.5 }}>{BOARD_TITLE.caseId}</span>
        <span style={{ fontSize: mix(28, 20, k), color: C.faint, fontWeight: 700 }}>·</span>
        <span style={{ fontSize: mix(28, 20, k), color: C.muted, fontWeight: 650 }}>{BOARD_TITLE.org}</span>
      </div>
      <div style={{ position: 'absolute', left: 12, right: 12, top: T - 1, height: 2, background: alpha(C.ink600, 0.8), opacity: titleOpacity }} />

      {/* Column highlights (under the text) */}
      {geo.list.map((g) => {
        const st = mergedState(props, g.id);
        const focusTone = toneOf(st.tone ?? 'cyan');
        const glowTone = toneOf(st.glowTone ?? 'emerald');
        const glow = clamp01(st.glow ?? 0);
        const rect: CSSProperties = {
          position: 'absolute',
          left: g.x + 5,
          top: T + 6,
          width: g.w - 10,
          height: H - T - 12,
          borderRadius: mix(RADIUS.md, RADIUS.sm, k),
          boxSizing: 'border-box',
        };
        return (
          <div key={`hl-${g.id}`} style={{ opacity: g.show }}>
            {g.focus > 0.001 ? (
              <div
                style={{
                  ...rect,
                  opacity: g.focus,
                  border: `2px solid ${alpha(focusTone.fg, 0.7)}`,
                  background: `linear-gradient(180deg, ${alpha(focusTone.fg, 0.12)} 0%, ${alpha(focusTone.fg, 0.04)} 100%)`,
                  boxShadow: `0 0 34px ${alpha(focusTone.fg, 0.22)}`,
                }}
              />
            ) : null}
            {glow > 0.001 ? (
              <div
                style={{
                  ...rect,
                  opacity: glow,
                  border: `3px solid ${alpha(glowTone.fg, 0.85)}`,
                  background: alpha(glowTone.fg, 0.08),
                  boxShadow: `0 0 40px ${alpha(glowTone.fg, 0.35)}`,
                }}
              />
            ) : null}
          </div>
        );
      })}

      {/* Rules between the columns */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        {geo.list.slice(1).map((g) => (
          <line key={`rule-${g.id}`} x1={g.x} y1={T + 14} x2={g.x} y2={H - 14} stroke={C.ink700} strokeWidth={2} strokeLinecap="round" />
        ))}
      </svg>

      {geo.list.map((g) => (
        <Column key={g.id} g={g} st={mergedState(props, g.id)} frame={frame} fps={fps} k={k} fullOnly={fullOnly} />
      ))}

      {props.loop !== undefined && props.loop > 0 ? <Loop geo={geo} p={clamp01(props.loop)} tone={props.loopTone ?? 'emerald'} /> : null}
    </div>
  );
}

function Column({ g, st, frame, fps, k, fullOnly }: { g: ColumnGeo; st: ColumnState; frame: number; fps: number; k: number; fullOnly: number }) {
  const { def } = g;
  const wipe = g.reveal;
  const bars = 1 - g.reveal;
  const boxGlow = clamp01(st.boxGlow ?? 0);
  const condE = clamp01(st.condition ?? 0);
  const condTone = toneOf(st.conditionTone ?? 'cyan');
  const writeIn: CSSProperties = wipe < 1 ? { clipPath: `inset(-20% ${(1 - wipe) * 100}% -20% 0)` } : {};
  const body = typeof st.body === 'function' ? st.body(g) : st.body;
  const rise = (1 - g.show) * 14;

  return (
    <div style={{ position: 'absolute', inset: 0, ...dimStyle(g.dim, g.show), transform: rise > 0.01 ? `translateY(${rise}px)` : undefined }}>
      {/* Number in the exam order */}
      <div
        style={{
          position: 'absolute',
          left: g.innerX,
          top: TITLE_H.full + 8,
          fontSize: 22,
          fontWeight: 800,
          color: g.focus > 0.5 ? C.cyanSoft : C.faint,
          letterSpacing: 1,
          opacity: fullOnly * wipe,
        }}
      >
        {def.n}
      </div>

      {/* Spanish name: bottom-aligned in its slot so the English names line up */}
      <div
        style={{
          position: 'absolute',
          left: g.innerX,
          top: g.nameTop,
          width: g.innerW + PAD,
          height: g.nameSlotH,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {bars > 0.01
          ? def.es.map((line) => (
              <div key={`bar-${line}`} style={{ height: g.nameSize * 1.06, display: 'flex', alignItems: 'center', opacity: bars }}>
                <div style={{ width: Math.min(g.innerW * 0.86, emWidth(line) * g.nameSize * 0.85), height: g.nameSize * 0.46, borderRadius: 8, background: C.ink700 }} />
              </div>
            ))
          : null}
        <div style={{ position: bars > 0.01 ? 'absolute' : 'relative', left: 0, bottom: 0, ...writeIn }}>
          {def.es.map((line) => (
            <div
              key={line}
              style={{ fontSize: g.nameSize, lineHeight: 1.06, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.3 }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* English exam name */}
      <div style={{ position: 'absolute', left: g.innerX, top: g.enTop, opacity: fullOnly }}>
        {bars > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              top: g.enSize * 0.35,
              width: Math.min(g.innerW * 0.7, emWidth(def.en) * g.enSize * 0.85),
              height: g.enSize * 0.42,
              borderRadius: 6,
              background: alpha(C.ink700, 0.8),
              opacity: bars,
            }}
          />
        ) : null}
        <div style={{ fontSize: g.enSize, lineHeight: 1.2, fontWeight: 650, color: '#c4b5fd', whiteSpace: 'nowrap', ...writeIn }}>{def.en}</div>
      </div>

      {/* Body slot */}
      {body && g.body.h > 1 ? (
        <div style={{ position: 'absolute', left: g.body.x, top: g.body.y, width: g.body.w, height: g.body.h, overflow: 'hidden', opacity: fullOnly * wipe }}>{body}</div>
      ) : null}

      {/* «¿terminada?» */}
      {g.labelSize > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: g.innerX,
            top: g.labelTop + (22 - g.labelSize) * 0.6,
            fontSize: g.labelSize,
            fontWeight: 750,
            letterSpacing: g.labelSize < 20 ? 0 : 0.5,
            whiteSpace: 'nowrap',
            color: interpolateColors(boxGlow, [0, 1], [C.faint, C.cyanSoft]),
            opacity: fullOnly * wipe,
          }}
        >
          {BOX_LABEL}
        </div>
      ) : null}

      <CheckBox g={g} st={st} frame={frame} fps={fps} emphasis={boxGlow} k={k} />

      {/* Exit condition */}
      <div style={{ position: 'absolute', left: g.innerX, top: g.condTop, width: g.innerW, opacity: fullOnly }}>
        {bars > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: bars }}>
            {[0.92, 0.6].map((f, i) => (
              <div key={i} style={{ marginTop: i ? g.condSize * 0.5 : g.condSize * 0.3, width: g.innerW * f, height: g.condSize * 0.42, borderRadius: 6, background: alpha(C.ink700, 0.7) }} />
            ))}
          </div>
        ) : null}
        <div
          style={{
            fontSize: g.condSize,
            lineHeight: 1.22,
            fontWeight: condE > 0.5 ? 700 : 600,
            color: interpolateColors(condE, [0, 1], [C.muted, condTone.soft]),
            textShadow: condE > 0.05 ? `0 0 18px ${alpha(condTone.fg, 0.45 * condE)}` : undefined,
            ...writeIn,
          }}
        >
          {def.condition}
        </div>
      </div>
    </div>
  );
}

type Mark = 'empty' | 'checked';

function stepsOf(box: ColumnState['box'], time: string | undefined): BoxStep[] {
  if (box === undefined) return [];
  if (typeof box === 'string') return [{ at: -1e6, state: box, time }];
  return [...box].sort((a, b) => a.at - b.at);
}

/** How the box looks at `frame`: tick draw, colours, strike, time label, breathing. */
function boxLook(st: ColumnState, frame: number, fps: number) {
  const steps = stepsOf(st.box, st.time);
  let idx = -1;
  steps.forEach((s, i) => {
    if (s.at <= frame) idx = i;
  });
  let mark: Mark = 'empty';
  let time: string | undefined = st.time;
  for (let i = 0; i < idx; i++) {
    const s = steps[i];
    if (s.state === 'checked') {
      mark = 'checked';
      time = s.time ?? time;
    } else if (s.state === 'empty' || s.state === 'wrong') mark = 'empty';
  }
  const look = {
    tick: 0,
    tickColor: C.emerald as string,
    tickAlpha: 1,
    strike: 0,
    time: undefined as string | undefined,
    timeAlpha: 0,
    timeColor: C.emerald as string,
    timeStrike: 0,
    breathe: 0,
  };
  if (idx < 0) return look;
  const s = steps[idx];
  const T = BOX_TIMING;
  switch (s.state) {
    case 'checked': {
      look.tick = mark === 'checked' ? 1 : progress(frame, s.at, T.tick, EASE.inOut);
      look.time = s.time ?? time;
      look.timeAlpha = mark === 'checked' ? 1 : progress(frame, s.at + 6, 12);
      break;
    }
    case 'empty': {
      if (mark === 'checked') {
        const out = 1 - progress(frame, s.at, T.untick);
        look.tick = 1;
        look.tickAlpha = out;
        look.time = time;
        look.timeAlpha = out;
      }
      break;
    }
    case 'wrong': {
      const amber = progress(frame, s.at, T.amber);
      const clear = progress(frame, s.at + T.amber + T.strike + T.hold, T.clear, EASE.inOut);
      look.tick = 1;
      look.tickColor = interpolateColors(amber, [0, 1], [C.emerald, C.amber]);
      look.tickAlpha = 1 - clear;
      look.strike = progress(frame, s.at + T.amber, T.strike, EASE.inOut);
      look.time = s.time ?? time;
      look.timeAlpha = look.time ? 1 - clear : 0;
      look.timeColor = look.tickColor;
      look.timeStrike = look.strike;
      break;
    }
    case 'pulse': {
      look.tick = mark === 'checked' ? 1 : 0;
      look.time = mark === 'checked' ? time : undefined;
      look.timeAlpha = look.time ? 1 : 0;
      look.breathe = progress(frame, s.at, 10) * pulse(Math.max(0, frame - s.at), fps, 0.6);
      break;
    }
  }
  return look;
}

function CheckBox({ g, st, frame, fps, emphasis, k }: { g: ColumnGeo; st: ColumnState; frame: number; fps: number; emphasis: number; k: number }) {
  const look = boxLook(st, frame, fps);
  const S = g.box.size;
  const ticked = look.tick * look.tickAlpha;
  const baseBorder = interpolateColors(emphasis, [0, 1], [alpha(C.muted, 0.7), C.cyanSoft]);
  const border = ticked > 0.02 ? interpolateColors(Math.min(1, ticked * 1.5), [0, 1], [baseBorder, look.tickColor]) : baseBorder;
  const ringColor = ticked > 0.5 ? look.tickColor : C.cyan;
  const ring = Math.max(emphasis * 0.8, look.breathe);
  const scale = 1 + 0.08 * look.breathe;
  const sw = Math.max(3, S * 0.07);
  const timeGap = S * 0.28;
  const timeFit = look.time ? Math.min(g.timeSize, Math.max(14, (g.innerW - S - timeGap) / (0.62 * look.time.length))) : g.timeSize;
  return (
    <div style={{ position: 'absolute', left: g.box.x, top: g.box.y, height: S, display: 'flex', alignItems: 'center', gap: timeGap }}>
      <div
        style={{
          width: S,
          height: S,
          flexShrink: 0,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          borderRadius: S * 0.2,
          boxShadow: ring > 0.02 ? `0 0 ${Math.round(10 + 26 * ring)}px ${alpha(ringColor, 0.55 * ring)}` : undefined,
        }}
      >
        <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ overflow: 'visible', display: 'block' }}>
          <rect
            x={sw / 2}
            y={sw / 2}
            width={S - sw}
            height={S - sw}
            rx={S * 0.18}
            fill={ticked > 0.02 ? alpha(C.emerald, 0.12 * ticked) : alpha(C.ink950, 0.6)}
            stroke={border}
            strokeWidth={sw}
          />
          {look.tick > 0.001 ? (
            <path
              d={`M ${S * 0.22} ${S * 0.53} L ${S * 0.43} ${S * 0.73} L ${S * 0.8} ${S * 0.3}`}
              fill="none"
              stroke={look.tickColor}
              strokeWidth={S * 0.13}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - look.tick}
              opacity={look.tickAlpha}
            />
          ) : null}
          {look.strike > 0.001 ? (
            <line
              x1={-S * 0.14}
              y1={S * 0.86}
              x2={-S * 0.14 + S * 1.28 * look.strike}
              y2={S * 0.86 - S * 0.72 * look.strike}
              stroke={C.rose}
              strokeWidth={S * 0.1}
              strokeLinecap="round"
              opacity={look.tickAlpha}
            />
          ) : null}
        </svg>
      </div>
      {look.time && look.timeAlpha > 0.01 ? (
        <div style={{ position: 'relative', opacity: look.timeAlpha }}>
          <span style={{ fontFamily: FONT.mono, fontSize: timeFit, fontWeight: 800, color: look.timeColor, whiteSpace: 'nowrap', letterSpacing: mix(0.5, 0, k) }}>{look.time}</span>
          {look.timeStrike > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: -4,
                top: '52%',
                height: Math.max(3, timeFit * 0.1),
                width: `calc(${look.timeStrike * 100}% + 8px)`,
                borderRadius: 3,
                background: C.rose,
              }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** The return path of s09: out of the last column, under the board, back up into the first. */
function Loop({ geo, p, tone }: { geo: BoardGeometry; p: number; tone: Tone }) {
  const first = geo.columns.prep;
  const last = geo.columns.lessons;
  const x1 = last.x + last.w / 2;
  const x0 = first.x + first.w / 2;
  const top = geo.height - 2;
  const bottom = geo.height + BOARD_LOOP_SPACE - 18;
  const r = 20;
  const d = [
    `M ${x1} ${top}`,
    `L ${x1} ${bottom - r}`,
    `Q ${x1} ${bottom} ${x1 - r} ${bottom}`,
    `L ${x0 + r} ${bottom}`,
    `Q ${x0} ${bottom} ${x0} ${bottom - r}`,
    `L ${x0} ${top + 6}`,
  ].join(' ');
  const t = toneOf(tone);
  const head = progress(p, 0.9, 0.1, EASE.out);
  return (
    <svg width={geo.width} height={geo.height + BOARD_LOOP_SPACE} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={d} fill="none" stroke={alpha(t.fg, 0.25)} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      <path d={d} fill="none" stroke={t.fg} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      {head > 0 ? (
        <path
          d={`M ${x0 - 16} ${top + 26} L ${x0} ${top + 8} L ${x0 + 16} ${top + 26}`}
          fill="none"
          stroke={t.fg}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={head}
        />
      ) : null}
    </svg>
  );
}
