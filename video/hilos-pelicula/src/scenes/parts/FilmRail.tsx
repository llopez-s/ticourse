import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE } from '../../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../../engine/src/ui';
import { FrameCard, type FrameContent, type FrameLook } from './EventCard';

// Owner: builder B1 (out/scene-brief.md «Ownership»). Read-only for everyone else (B3 imports it in s06/s07 and the
// poster, B4 in s08–s10).

/**
 * «La película» — V3's kill chain rail (`video/diamond-e7/src/scenes/S10Thread.tsx:94-180`, re-drawn, nothing
 * imported) with the event frames that hang over it and the film strip they turn into. ONE drawing for every rail
 * of V14, in every state (out/scene-brief.md «Visual metaphors», states 1–10):
 *
 *   rail only (s02 `rail`) ............ <FilmRail rail={p} />
 *   frames placed (s02 `frames`) ...... <FilmRail frames={withFrames(MERIDIAN_FRAMES, { 'm-delivery': { show } })} loose={1} />
 *   ordered (s02 `order`) ............. loose={0}
 *   joined (s02 `thread`) ............. thread={p}         (rose string over the frames + rose rail, dots lit)
 *   film strip (s02 `film`) ........... film={p}           (sprocket bands, the frames become film windows)
 *   partial film (s03 `partial`) ...... frames={ORBITAL_FRAMES} thread={1} film={1}   (AoO frame look 'empty': «?»)
 *   projected frame (s08) ............. a frame with look 'projected' in Orbital's AoO slot, or your own overlay on
 *                                       `filmRailLayout(w).frameRect('actions')`
 *   miniature (s10) ................... width={300} names={0}
 *   strip only (s06, s08) ............. rail={0} names={0} slots={0} kicker={0} stems={0} thread={1} film={1}
 *                                       (rail 0 also hides the thread's rose rail line; the string stays)
 *
 * Column scheme — FIXED, the same for every rail in this video, whatever frames you pass: Recon (narrow, empty),
 * Weaponization (narrow, dashed), Delivery, Exploitation, Installation (one frame each), C2 (TWO frame columns: col 0
 * = Meridian's first call home on 02-03 and Orbital's call home; col 1 = E7 on 05-03 — Orbital leaves it blank) and
 * Actions on Objectives (one frame). So two rails of the same width line up slot for slot: s08's overlay needs no
 * offsets, and E9's frame sits exactly over Orbital's empty AoO frame.
 *
 * Geometry — `filmRailLayout(width)` is PURE (no hooks): every number is px from the FilmRail box's top-left for a
 * box `width` px wide; `k = width / FILM_W`. Everything FilmRail draws stays inside [0, width] × [0, height]
 * (height = FILM_H × k). The victim label is NOT part of it: place a `<FilmLabel>` yourself (e.g. above the box,
 * `FILM_LABEL_H` tall, left-aligned with `layout.stripX0`).
 *
 * Look (0–1 weights; nothing reads the timeline and nothing positions itself — wrap it in an absolute div):
 * - `rail`    the rail draws left to right, then the dots and the names fade in (V3's entrance). Default 1.
 * - `names`   the phase names under the rail (V3's labels, verbatim; default = rail).
 * - `slots`   Weaponization's dashed slot (a dashed grey frame outline + a dashed dot) and Recon's empty slot (a
 *             hollow dot, nothing above): how V13 left them for this intrusion. Default = rail.
 * - `frames`  the frames (see `FilmFrame`); each has its own show/focus/dim/glow; `loose` tilts and offsets them a
 *             little (photos hung by hand), 0 = straight and aligned.
 * - `thread`  the rose thread: a string over the observed frames (with a clip on each) and the rose rail from the
 *             first observed phase to `threadTo` (default: the last observed phase), lighting the dots it reaches.
 *             Orbital's thread therefore stops at C2: an 'empty' or 'projected' frame never extends it.
 * - `film`    the strip: a dark film band from Delivery to Actions on Objectives with sprocket holes along both
 *             edges; the frames become its windows. Columns without a frame (Orbital's second C2) stay plain film.
 * - `lit`     extra rose on a phase's dot and name (e.g. s03 `partial`), on top of what the thread lights.
 * - `stems`   the thin stems from each frame down to its dot (default 1).
 * - `tone`    the victim tint on the strip's edge (cyan Meridian, cyanSoft Orbital). Default neutral.
 * - `dim`     the whole rail steps back.
 */

// ================================================================================================ phases

export type PhaseId = 'recon' | 'weaponization' | 'delivery' | 'exploitation' | 'installation' | 'c2' | 'actions';
/** Phases that can hold a frame. */
export type FramePhaseId = Exclude<PhaseId, 'recon' | 'weaponization'>;

export interface PhaseDef {
  id: PhaseId;
  /** V3's rail label, verbatim (`S10Thread.tsx:12`). */
  label: string;
  /** How the label splits under the rail. */
  lines: readonly string[];
  /** Design width of the slot (px at FILM_W). */
  w: number;
  /** Frame columns in the slot (0 = no frames). */
  cols: number;
}

/** Design width of the whole rail; every rail scales from it. */
export const FILM_W = 1728;
const FRAME_COL_W = (FILM_W - 132 - 196) / 6;

export const PHASES: readonly PhaseDef[] = [
  { id: 'recon', label: 'Recon', lines: ['Recon'], w: 132, cols: 0 },
  { id: 'weaponization', label: 'Weaponization', lines: ['Weaponization'], w: 196, cols: 0 },
  { id: 'delivery', label: 'Delivery', lines: ['Delivery'], w: FRAME_COL_W, cols: 1 },
  { id: 'exploitation', label: 'Exploitation', lines: ['Exploitation'], w: FRAME_COL_W, cols: 1 },
  { id: 'installation', label: 'Installation', lines: ['Installation'], w: FRAME_COL_W, cols: 1 },
  { id: 'c2', label: 'C2', lines: ['C2'], w: FRAME_COL_W * 2, cols: 2 },
  { id: 'actions', label: 'Actions on Objectives', lines: ['Actions on', 'Objectives'], w: FRAME_COL_W, cols: 1 },
];

export const PHASE_IDS: readonly PhaseId[] = PHASES.map((p) => p.id);
export const phaseIndex = (id: PhaseId) => PHASE_IDS.indexOf(id);
export const phaseLabel = (id: PhaseId) => PHASES[phaseIndex(id)].label;

// ================================================================================================ design geometry

const SPROCKET_H = 30;
const FRAME_TOP = SPROCKET_H;
const FRAME_H = 300;
const STRIP_BOTTOM = FRAME_TOP + FRAME_H + SPROCKET_H; // 360
const FRAME_INSET = 8;
const RAIL_Y = 412;
const DOT_R = 13;
const NAMES_TOP = RAIL_Y + 26;
const NAME_SIZE = 26;
/** Design height of the whole rail. */
export const FILM_H = 502;

const SLOT_X0: Record<PhaseId, number> = (() => {
  const out = {} as Record<PhaseId, number>;
  let x = 0;
  for (const p of PHASES) {
    out[p.id] = x;
    x += p.w;
  }
  return out;
})();

const slotOf = (id: PhaseId) => PHASES[phaseIndex(id)];
const dCx = (id: PhaseId) => SLOT_X0[id] + slotOf(id).w / 2;
const dFrameX = (id: PhaseId, col = 0) => SLOT_X0[id] + FRAME_COL_W * col + FRAME_INSET;
const D_FRAME_W = FRAME_COL_W - FRAME_INSET * 2;
const D_STRIP_X0 = SLOT_X0.delivery + 2;
const D_STRIP_X1 = SLOT_X0.actions + slotOf('actions').w - 2;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export interface FilmRailLayout {
  /** Scale from the design (FILM_W wide). */
  k: number;
  width: number;
  height: number;
  /** The film band (sprocket bands included). */
  strip: Rect;
  stripX0: number;
  stripX1: number;
  stripTop: number;
  stripBottom: number;
  /** Frame row. */
  frameTop: number;
  frameH: number;
  frameW: number;
  /** The rail line and its dots. */
  railY: number;
  dotR: number;
  /** Top of the phase names under the rail. */
  namesTop: number;
  /** A phase's slot: left/right edges and centre x. */
  slot: (id: PhaseId) => { x0: number; x1: number; cx: number };
  /** A phase's dot centre on the rail. */
  dot: (id: PhaseId) => { x: number; y: number; r: number };
  /** The rect of the frame at `col` of a phase (C2 has cols 0 and 1). Same for every rail. */
  frameRect: (id: FramePhaseId, col?: 0 | 1) => Rect;
}

/** PURE geometry of a FilmRail drawn `width` px wide (all px from its top-left). */
export function filmRailLayout(width: number = FILM_W): FilmRailLayout {
  const k = width / FILM_W;
  const rect = (x: number, y: number, w: number, h: number): Rect => ({
    x: x * k,
    y: y * k,
    w: w * k,
    h: h * k,
    cx: (x + w / 2) * k,
    cy: (y + h / 2) * k,
  });
  return {
    k,
    width,
    height: FILM_H * k,
    strip: rect(D_STRIP_X0, 0, D_STRIP_X1 - D_STRIP_X0, STRIP_BOTTOM),
    stripX0: D_STRIP_X0 * k,
    stripX1: D_STRIP_X1 * k,
    stripTop: 0,
    stripBottom: STRIP_BOTTOM * k,
    frameTop: FRAME_TOP * k,
    frameH: FRAME_H * k,
    frameW: D_FRAME_W * k,
    railY: RAIL_Y * k,
    dotR: DOT_R * k,
    namesTop: NAMES_TOP * k,
    slot: (id) => ({ x0: SLOT_X0[id] * k, x1: (SLOT_X0[id] + slotOf(id).w) * k, cx: dCx(id) * k }),
    dot: (id) => ({ x: dCx(id) * k, y: RAIL_Y * k, r: DOT_R * k }),
    frameRect: (id, col = 0) => rect(dFrameX(id, col), FRAME_TOP, D_FRAME_W, FRAME_H),
  };
}

// ================================================================================================ frames (data)

export interface FilmFrame extends Omit<FrameContent, 'phase'> {
  /** Unique key (also how `withFrames` patches it). */
  key: string;
  /** The slot it hangs over. */
  phase: FramePhaseId;
  /** Phase name printed on the frame. Default: the rail's label (none on an 'empty' frame); '' hides it. */
  phaseText?: string;
  /** Column inside the slot: only C2 has two. Default 0. */
  col?: 0 | 1;
  look?: FrameLook;
  /** 0–1: the frame drops into its place (fade + small fall). Default 1. */
  show?: number;
  /** 0–1: lifted and brighter (the voice is on it). */
  focus?: number;
  /** 0–1: steps back. */
  dim?: number;
  /** 0–1: rose glow. */
  glow?: number;
  /** 0–1: the «?» of an empty frame. Default 1. */
  q?: number;
  dateHot?: number;
  lineHot?: number;
  /** Opt-in shrink-to-fit of the line (FrameCard `fitLine`; default false). */
  fitLine?: boolean;
}

/** Victims: name and tint (cyan Meridian, cyanSoft Orbital — told apart by their labels, never by a second accent). */
export const VICTIMS = {
  meridian: { name: 'Meridian Dynamics', tone: C.cyan },
  orbital: { name: 'Orbital Components', tone: C.cyanSoft },
} as const;

/**
 * Meridian's whole film (canon, out/scene-brief.md «s02»): the four 02-03 frames carry no event number, no hour, no
 * host and no file name; E7 is only «05-03 · C2»; E9 has plan A's content without size or destination.
 */
export const MERIDIAN_FRAMES: readonly FilmFrame[] = [
  { key: 'm-delivery', phase: 'delivery', date: '02-03', line: 'correo con un CV' },
  { key: 'm-exploitation', phase: 'exploitation', date: '02-03', line: 'se abre el adjunto' },
  { key: 'm-installation', phase: 'installation', date: '02-03', line: 'loader y tarea programada' },
  { key: 'm-c2', phase: 'c2', col: 0, date: '02-03', line: 'primera llamada a casa' },
  { key: 'm-e7', phase: 'c2', col: 1, id: 'E7', date: '05-03', diamond: true },
  { key: 'm-e9', phase: 'actions', id: 'E9', date: '07-03', diamond: true, line: 'compresión en una carpeta temporal · salida grande' },
];

/** Orbital's partial film (canon, «s03»): Delivery to C2 observed, Actions on Objectives empty («?», no photo). */
export const ORBITAL_FRAMES: readonly FilmFrame[] = [
  { key: 'o-delivery', phase: 'delivery', date: '09-03', line: 'un pedido falso' },
  { key: 'o-exploitation', phase: 'exploitation', date: '09-03', line: 'se ejecuta el adjunto' },
  { key: 'o-installation', phase: 'installation', date: '09-03', line: 'deja un programa' },
  { key: 'o-c2', phase: 'c2', col: 0, date: '09-03', line: 'llama a casa' },
  { key: 'o-actions', phase: 'actions', look: 'empty' },
];

/** A copy of `base` with per-key patches (show, focus, look…). Keys not in `base` are ignored. */
export function withFrames(base: readonly FilmFrame[], patch: Record<string, Partial<FilmFrame>> = {}): FilmFrame[] {
  return base.map((f) => (patch[f.key] ? { ...f, ...patch[f.key] } : f));
}

/** Same patch for every frame of `base` (e.g. `{ show: p }`), then optional per-key patches. */
export function framesAll(base: readonly FilmFrame[], all: Partial<FilmFrame>, patch: Record<string, Partial<FilmFrame>> = {}): FilmFrame[] {
  return base.map((f) => ({ ...f, ...all, ...(patch[f.key] ?? {}) }));
}

// ================================================================================================ drawing

export interface FilmRailProps {
  /** Box width in px (default FILM_W). Height is FILM_H × width / FILM_W. */
  width?: number;
  frames?: readonly FilmFrame[];
  rail?: number;
  names?: number;
  slots?: number;
  lit?: Partial<Record<PhaseId, number>>;
  thread?: number;
  /** Where the rose rail of the thread ends (default: the last observed frame's phase). */
  threadTo?: PhaseId;
  film?: number;
  loose?: number;
  stems?: number;
  /** Victim tint on the strip's edge. */
  tone?: string;
  /** The «KILL CHAIN» micro label over the empty slots (default = rail; 0 hides it, e.g. miniatures). */
  kicker?: number;
  dim?: number;
  style?: CSSProperties;
}

/** Deterministic 0–1 from a string (per-frame tilt when `loose`). */
function hash01(s: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const isObserved = (f: FilmFrame) => (f.look ?? 'observed') === 'observed';
const frameOrder = (f: FilmFrame) => SLOT_X0[f.phase] + (f.col ?? 0);

export function FilmRail({
  width = FILM_W,
  frames = [],
  rail = 1,
  names,
  slots,
  lit = {},
  thread = 0,
  threadTo,
  film = 0,
  loose = 0,
  stems = 1,
  tone,
  kicker,
  dim = 0,
  style,
}: FilmRailProps) {
  const k = width / FILM_W;
  const r = clamp01(rail);
  const railDraw = EASE.out(clamp01(r / 0.6));
  const dotsIn = clamp01((r - 0.35) / 0.65);
  const namesIn = clamp01(names ?? dotsIn);
  const slotsIn = clamp01(slots ?? dotsIn);
  const kick = clamp01(kicker ?? dotsIn);
  const th = clamp01(thread);
  const fl = clamp01(film);
  const ls = clamp01(loose);

  const observed = frames.filter(isObserved).sort((a, b) => frameOrder(a) - frameOrder(b));
  const firstPhase: PhaseId | undefined = observed[0]?.phase;
  const lastPhase: PhaseId | undefined = threadTo ?? observed[observed.length - 1]?.phase;

  // Rose rail of the thread: from the first observed phase's dot to `threadTo`.
  const tx0 = firstPhase ? dCx(firstPhase) : 0;
  const tx1 = lastPhase ? dCx(lastPhase) : 0;
  const txEnd = tx0 + (tx1 - tx0) * EASE.inOut(th);
  const threadLit = (id: PhaseId) => {
    if (!firstPhase || th <= 0) return 0;
    const x = dCx(id);
    if (x < tx0 - 1 || x > tx1 + 1) return 0;
    return clamp01((txEnd - x) / 40 + 1);
  };
  const litOf = (id: PhaseId) => Math.max(clamp01(lit[id] ?? 0), threadLit(id));

  // The string over the frames: from the first to the last observed frame.
  const sx0 = observed.length ? dFrameX(observed[0].phase, observed[0].col ?? 0) + 10 : 0;
  const last = observed[observed.length - 1];
  const sx1 = last ? dFrameX(last.phase, last.col ?? 0) + D_FRAME_W - 10 : 0;
  const sEnd = sx0 + (sx1 - sx0) * EASE.inOut(th);
  const stringY = FRAME_TOP + 9;

  return (
    <div style={{ position: 'relative', width, height: FILM_H * k, opacity: 1 - 0.6 * clamp01(dim), ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: FILM_W,
          height: FILM_H,
          transform: `scale(${k})`,
          transformOrigin: '0 0',
          fontFamily: FONT.sans,
        }}
      >
        {/* ---- the rail, its dots, the stems (under everything else) */}
        <svg width={FILM_W} height={FILM_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line
            x1={12}
            y1={RAIL_Y}
            x2={12 + (FILM_W - 24) * railDraw}
            y2={RAIL_Y}
            stroke={C.ink600}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={r > 0 ? 1 : 0}
          />
          {th > 0 && firstPhase && railDraw > 0 ? (
            <line
              x1={tx0}
              y1={RAIL_Y}
              x2={Math.max(tx0 + 0.1, txEnd)}
              y2={RAIL_Y}
              stroke={C.rose}
              strokeWidth={11}
              strokeLinecap="round"
              opacity={railDraw}
              style={{ filter: `drop-shadow(0 0 10px ${alpha(C.rose, 0.65)})` }}
            />
          ) : null}
          {/* stems: frame bottom to its dot */}
          {frames.map((f) => {
            const s = clamp01(f.show ?? 1) * clamp01(stems);
            if (s <= 0.01) return null;
            const fx = dFrameX(f.phase, f.col ?? 0) + D_FRAME_W / 2;
            const dx = dCx(f.phase);
            const y1 = FRAME_TOP + FRAME_H;
            const y2 = RAIL_Y - DOT_R - 3;
            const hot = litOf(f.phase);
            const d = `M ${fx} ${y1} C ${fx} ${y1 + 44}, ${dx} ${y2 - 34}, ${dx} ${y2}`;
            return (
              <path
                key={`stem-${f.key}`}
                d={d}
                fill="none"
                stroke={hot > 0.3 && isObserved(f) ? alpha(C.roseSoft, 0.85) : alpha(C.muted, 0.55)}
                strokeWidth={3}
                strokeDasharray={isObserved(f) ? undefined : '6 7'}
                strokeLinecap="round"
                opacity={s * (isObserved(f) ? 1 : 0.8)}
              />
            );
          })}
          {PHASES.map((p) => {
            const cx = dCx(p.id);
            const o = dotsIn;
            if (o <= 0) return null;
            if (p.id === 'recon') {
              // Empty slot: a hollow, faint dot.
              return <circle key={p.id} cx={cx} cy={RAIL_Y} r={DOT_R - 2} fill={C.ink900} stroke={alpha(C.faint, 0.7)} strokeWidth={3} opacity={o * mix(1, 0.75, 1 - slotsIn)} />;
            }
            if (p.id === 'weaponization') {
              // Dashed slot: a dashed grey ring.
              return (
                <circle key={p.id} cx={cx} cy={RAIL_Y} r={DOT_R} fill={C.ink900} stroke={alpha(C.muted, 0.75)} strokeWidth={3} strokeDasharray="5 5" opacity={o} />
              );
            }
            const h = litOf(p.id);
            const color = h > 0.05 ? C.rose : C.ink500;
            return (
              <circle
                key={p.id}
                cx={cx}
                cy={RAIL_Y}
                r={DOT_R + 5 * h}
                fill={h > 0.05 ? color : C.ink800}
                stroke={color}
                strokeWidth={4}
                opacity={o}
                style={h > 0.05 ? { filter: `drop-shadow(0 0 ${Math.round(14 * h)}px ${alpha(C.rose, 0.75)})` } : undefined}
              />
            );
          })}
        </svg>

        {/* ---- «KILL CHAIN» micro label (V3), over the two narrow slots */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: RAIL_Y - 46,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3,
            color: C.faint,
            opacity: kick,
            whiteSpace: 'nowrap',
          }}
        >
          KILL CHAIN
        </div>

        {/* ---- phase names (V3's labels, verbatim) */}
        {PHASES.map((p) => {
          const h = litOf(p.id);
          const grey = p.id === 'recon' || p.id === 'weaponization';
          return (
            <div
              key={`name-${p.id}`}
              style={{
                position: 'absolute',
                left: SLOT_X0[p.id],
                top: NAMES_TOP,
                width: p.w,
                textAlign: 'center',
                fontSize: NAME_SIZE,
                fontWeight: 700,
                lineHeight: 1.15,
                color: h > 0.3 ? C.roseSoft : grey ? C.faint : C.muted,
                opacity: namesIn,
                whiteSpace: 'nowrap',
              }}
            >
              {p.lines.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          );
        })}

        {/* ---- the film band (behind the frames) */}
        {fl > 0 ? <FilmBand film={fl} tone={tone} /> : null}

        {/* ---- Weaponization's dashed slot */}
        {slotsIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: SLOT_X0.weaponization + 14,
              top: FRAME_TOP + 8,
              width: slotOf('weaponization').w - 28,
              height: FRAME_H - 16,
              boxSizing: 'border-box',
              borderRadius: 14,
              border: `2.5px dashed ${alpha(C.muted, 0.5)}`,
              opacity: slotsIn,
            }}
          />
        ) : null}

        {/* ---- the frames */}
        {[...frames]
          .sort((a, b) => (a.focus ?? 0) - (b.focus ?? 0))
          .map((f) => {
            const s = clamp01(f.show ?? 1);
            if (s <= 0.001) return null;
            const fo = clamp01(f.focus ?? 0);
            const tilt = (hash01(f.key, 1) - 0.5) * 6 * ls;
            const dy = (hash01(f.key, 2) - 0.5) * 26 * ls - 10 * fo - (1 - EASE.out(s)) * 34;
            const scale = (1 + 0.1 * fo) * (0.94 + 0.06 * EASE.out(s));
            const d = clamp01(f.dim ?? 0);
            return (
              <div
                key={f.key}
                style={{
                  position: 'absolute',
                  left: dFrameX(f.phase, f.col ?? 0),
                  top: FRAME_TOP,
                  width: D_FRAME_W,
                  height: FRAME_H,
                  opacity: Math.min(1, s * 1.4) * (1 - 0.55 * d),
                  filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
                  transform: `translateY(${dy}px) rotate(${tilt}deg) scale(${scale})`,
                  transformOrigin: '50% 0%',
                }}
              >
                <FrameCard
                  width={D_FRAME_W}
                  height={FRAME_H}
                  look={f.look}
                  id={f.id}
                  date={f.date}
                  phase={f.phaseText ?? (f.look === 'empty' ? undefined : phaseLabel(f.phase)) ?? undefined}
                  line={f.line}
                  diamond={f.diamond}
                  focus={fo}
                  glow={Math.max(clamp01(f.glow ?? 0), isObserved(f) ? 0.35 * threadLit(f.phase) * (1 - fl) : 0)}
                  q={f.q}
                  film={fl}
                  dateHot={f.dateHot}
                  lineHot={f.lineHot}
                  fitLine={f.fitLine}
                />
              </div>
            );
          })}

        {/* ---- the thread: a rose string over the observed frames, a clip on each */}
        {th > 0 && observed.length ? (
          <svg width={FILM_W} height={FILM_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line
              x1={sx0}
              y1={stringY}
              x2={Math.max(sx0 + 0.1, sEnd)}
              y2={stringY}
              stroke={C.rose}
              strokeWidth={5}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${alpha(C.rose, 0.7)})` }}
            />
            {observed.map((f) => {
              const cx = dFrameX(f.phase, f.col ?? 0) + D_FRAME_W / 2;
              const on = clamp01((sEnd - cx) / 30 + 0.5) * clamp01(f.show ?? 1);
              if (on <= 0) return null;
              return <rect key={`clip-${f.key}`} x={cx - 6} y={stringY - 11} width={12} height={22} rx={4} fill={C.roseSoft} opacity={on} />;
            })}
          </svg>
        ) : null}
      </div>
    </div>
  );
}

/** The film band with its sprocket holes (design units). */
function FilmBand({ film, tone }: { film: number; tone?: string }) {
  const w = D_STRIP_X1 - D_STRIP_X0;
  const holeW = 16;
  const holeH = 11;
  const pitch = 29;
  const n = Math.floor((w - 20) / pitch);
  const off = (w - (n - 1) * pitch) / 2;
  const holes: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = clamp01(film * 1.6 - (i / n) * 0.6);
    if (a <= 0) continue;
    const x = off + i * pitch - holeW / 2;
    holes.push(<rect key={`t${i}`} x={x} y={(SPROCKET_H - holeH) / 2} width={holeW} height={holeH} rx={3} fill={C.ink950} opacity={a} />);
    holes.push(<rect key={`b${i}`} x={x} y={STRIP_BOTTOM - SPROCKET_H + (SPROCKET_H - holeH) / 2} width={holeW} height={holeH} rx={3} fill={C.ink950} opacity={a} />);
  }
  const edge = tone ? alpha(tone, 0.55) : alpha(C.muted, 0.35);
  return (
    <div
      style={{
        position: 'absolute',
        left: D_STRIP_X0,
        top: 0,
        width: w,
        height: STRIP_BOTTOM,
        opacity: EASE.out(clamp01(film * 1.4)),
        transform: `scaleY(${0.92 + 0.08 * EASE.out(film)})`,
        transformOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          background: `linear-gradient(180deg, #1a1f2b 0%, #12161f 50%, #1a1f2b 100%)`,
          border: `2px solid ${edge}`,
          boxShadow: `0 18px 44px ${alpha('#000000', 0.45)}`,
        }}
      />
      <svg width={w} height={STRIP_BOTTOM} style={{ position: 'absolute', left: 0, top: 0 }}>
        {holes}
      </svg>
    </div>
  );
}

// ================================================================================================ victim label

/** Height (px) of a FilmLabel at `size`. */
export const filmLabelHeight = (size = 32) => Math.round(size * 1.35);
/** Height of a FilmLabel at its default size. */
export const FILM_LABEL_H = filmLabelHeight(32);

/**
 * The victim's label for a film: a short bar in the victim tint and the name, optionally followed by a tag (e.g.
 * «hilo parcial»). Not scaled with the rail: keep it ≥ 32 px wherever it is read. Place it yourself.
 */
export function FilmLabel({
  name,
  tone,
  size = 32,
  show = 1,
  tag,
  tagTone = C.muted,
  tagShow = 1,
  style,
}: {
  name: string;
  tone: string;
  size?: number;
  show?: number;
  tag?: string;
  tagTone?: string;
  tagShow?: number;
  style?: CSSProperties;
}) {
  const s = clamp01(show);
  const t = clamp01(tagShow);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.4),
        height: filmLabelHeight(size),
        fontFamily: FONT.sans,
        opacity: s,
        transform: `translateY(${(1 - EASE.out(s)) * 10}px)`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ width: Math.round(size * 0.22), height: Math.round(size * 0.95), borderRadius: 4, background: tone, flex: 'none' }} />
      <span style={{ fontSize: size, fontWeight: 800, color: tone, letterSpacing: -0.2 }}>{name}</span>
      {tag ? (
        <span
          style={{
            fontSize: Math.round(size * 0.85),
            fontWeight: 650,
            color: tagTone,
            padding: `${Math.round(size * 0.12)}px ${Math.round(size * 0.45)}px`,
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(tagTone, 0.55)}`,
            background: alpha(tagTone, 0.1),
            opacity: t,
            transform: `translateX(${(1 - EASE.out(t)) * -10}px)`,
          }}
        >
          {tag}
        </span>
      ) : null}
    </div>
  );
}

// ================================================================================================ miniature icon

/**
 * A small film-strip icon (s10 rule 1 and anywhere a strip is a symbol): `n` frames in a band with sprocket holes;
 * `emptyLast` draws the last window as an empty outline with «?» (a partial film). Pure SVG, `width` × `width·0.42`.
 */
export function FilmStripIcon({ width, n = 4, emptyLast = false, tone = C.rose }: { width: number; n?: number; emptyLast?: boolean; tone?: string }) {
  const h = width * 0.42;
  const band = h * 0.16;
  const gap = width * 0.03;
  const fw = (width - gap * (n + 1)) / n;
  const holes = Math.max(4, Math.round(width / (h * 0.22)));
  const pitch = width / holes;
  return (
    <svg width={width} height={h} style={{ overflow: 'visible' }}>
      <rect x={0} y={0} width={width} height={h} rx={h * 0.06} fill="#151a24" stroke={alpha(C.muted, 0.45)} strokeWidth={Math.max(1, width * 0.006)} />
      {Array.from({ length: holes }, (_, i) => (
        <g key={i}>
          <rect x={pitch * (i + 0.5) - pitch * 0.22} y={band * 0.28} width={pitch * 0.44} height={band * 0.44} rx={band * 0.12} fill={C.ink950} />
          <rect x={pitch * (i + 0.5) - pitch * 0.22} y={h - band * 0.72} width={pitch * 0.44} height={band * 0.44} rx={band * 0.12} fill={C.ink950} />
        </g>
      ))}
      {Array.from({ length: n }, (_, i) => {
        const x = gap + i * (fw + gap);
        const empty = emptyLast && i === n - 1;
        return (
          <g key={`f${i}`}>
            <rect
              x={x}
              y={band}
              width={fw}
              height={h - band * 2}
              rx={h * 0.04}
              fill={empty ? alpha(C.ink900, 0.6) : C.ink800}
              stroke={empty ? alpha(C.faint, 0.9) : alpha(tone, 0.7)}
              strokeWidth={Math.max(1, width * 0.008)}
            />
            {empty ? (
              <text x={x + fw / 2} y={h / 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={800} fontSize={(h - band * 2) * 0.62} fill={C.muted}>
                ?
              </text>
            ) : (
              <circle cx={x + fw / 2} cy={h / 2} r={(h - band * 2) * 0.13} fill={alpha(tone, 0.85)} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
