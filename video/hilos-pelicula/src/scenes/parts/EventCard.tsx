import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

// Owner: builder B1 (out/scene-brief.md «Ownership»). Read-only for everyone else (B4 imports it in s08–s10).

/**
 * «Una foto» — V14's two looks of a Diamond event, both re-drawn from V3 (`video/diamond-e7/src/scenes/S10Thread.tsx`,
 * nothing imported from another video):
 *
 * - `EventCard` — V3's E7/E9 card, field by field (`S10Thread.tsx:215-283`): id, ISO date, the time/«+2 días» on the
 *   right, the mini diamond, the capability line «GLASS VIPER» in amber, the method line and the rose phase pill.
 *   Only s01 shows it (the two loose photos). `E7_CARD` / `E9_CARD` hold V3's strings exactly.
 * - `FrameCard` — the compact frame that hangs on the film rail (`FilmRail.tsx`): date · phase · one line (+ the
 *   event id and a tiny diamond for E7/E9). Three looks:
 *     'observed'  — a photo you have: solid ink card, rose phase name.
 *     'projected' — NOT a photo of this victim: translucent rose fill, dashed rose border, text in rose tints;
 *                   `glow` lights it (s08: Meridian's E9 cast into Orbital's gap). Never drawn solid.
 *     'empty'     — no photo: grey outline only and a big «?» (`q` fades it), no date, no text unless passed.
 *
 * Neither component positions itself (wrap it in an absolute div) and nothing reads the timeline: all looks are 0–1
 * weights. Sizes are px; FrameCard scales its type with `width / FRAME_BASE_W` (so a frame drawn at the rail's
 * design width reads 28 px lines, and a standalone frame of another size keeps the same proportions).
 */

// ------------------------------------------------------------------------------------------------ the mini diamond

export type VertexId = 'adv' | 'cap' | 'infra' | 'vic';

/** V3's vertex tints (`video/diamond-e7/src/scenes/parts/Diamond.tsx:12-17`). */
export const VERTEX_TINT: Record<VertexId, string> = {
  adv: C.rose,
  cap: C.amber,
  infra: C.sky,
  vic: C.cyan,
};

/**
 * V3's mini diamond (`S10Thread.tsx:201-213`): four vertex dots in canonical positions (adversary on top, capability
 * left, infrastructure right, victim at the bottom). `hot` (0–1 per vertex) grows and haloes a dot — s01 uses it on
 * «quién · con qué · por dónde · contra quién».
 */
export function MiniDiamond({ size, hot = {} }: { size: number; hot?: Partial<Record<VertexId, number>> }) {
  const h = size / 2;
  const m = size * 0.105;
  const pts: Record<VertexId, [number, number]> = { adv: [h, m], infra: [size - m, h], vic: [h, size - m], cap: [m, h] };
  const order: VertexId[] = ['adv', 'infra', 'vic', 'cap'];
  const s = size / 76;
  return (
    <svg width={size} height={size} style={{ flex: 'none', overflow: 'visible' }}>
      <polygon
        points={order.map((v) => pts[v].join(',')).join(' ')}
        fill={alpha(C.ink700, 0.5)}
        stroke={alpha(C.muted, 0.7)}
        strokeWidth={Math.max(1, 3 * s)}
      />
      {order.map((v) => {
        const k = clamp01(hot[v] ?? 0);
        const r = (v === 'cap' ? 9 : 7) * s * (1 + 0.45 * k);
        return (
          <g key={v}>
            {k > 0.01 ? <circle cx={pts[v][0]} cy={pts[v][1]} r={r * 2.1} fill={alpha(VERTEX_TINT[v], 0.25 * k)} /> : null}
            <circle cx={pts[v][0]} cy={pts[v][1]} r={r} fill={VERTEX_TINT[v]} />
          </g>
        );
      })}
    </svg>
  );
}

// ------------------------------------------------------------------------------------------------ V3's event card

export interface EventCardData {
  id: string;
  date: string;
  time: string;
  method: string;
  phase: string;
}

/** V3's E7 card, verbatim (`S10Thread.tsx:66-75`). */
export const E7_CARD: EventCardData = {
  id: 'E7',
  date: '2026-03-05',
  time: '02:13 UTC',
  method: 'beacon HTTPS · 60 s',
  phase: 'C2',
};

/** V3's E9 card, verbatim (`S10Thread.tsx:76-86`). */
export const E9_CARD: EventCardData = {
  id: 'E9',
  date: '2026-03-07',
  time: '+2 días',
  method: 'misma metodología',
  phase: 'Actions on Objectives',
};

/** V3's card size. */
export const EVENT_CARD_W = 470;
export const EVENT_CARD_H = 250;

/**
 * V3's event card (`S10Thread.tsx:215-283`), the same fields and type sizes. `phaseHot` (0–1) lights the phase pill as
 * V3 did; `hot` passes through to the mini diamond. The capability line is always «GLASS VIPER» (the only place in
 * V14 where the name is drawn).
 */
export function EventCard({
  data,
  width = EVENT_CARD_W,
  height = EVENT_CARD_H,
  phaseHot = 0,
  hot,
  glow = 0,
  style,
}: {
  data: EventCardData;
  width?: number;
  height?: number;
  phaseHot?: number;
  hot?: Partial<Record<VertexId, number>>;
  /** 0–1: a soft neutral halo (the voice is on the card). */
  glow?: number;
  style?: CSSProperties;
}) {
  const cap = VERTEX_TINT.cap;
  const g = clamp01(glow);
  const p = clamp01(phaseHot);
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        padding: '18px 22px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${g > 0.01 ? alpha(C.text, 0.25 + 0.4 * g) : C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}${g > 0.01 ? `, 0 0 ${Math.round(34 * g)}px ${alpha(C.text, 0.16 * g)}` : ''}`,
        fontFamily: FONT.sans,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontSize: TYPE.h3, fontWeight: 850, color: C.textStrong, lineHeight: 1 }}>{data.id}</span>
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
          {data.date}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, fontSize: TYPE.micro, color: C.muted, whiteSpace: 'nowrap' }}>
          {data.time}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <MiniDiamond size={76} hot={hot} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 800, color: cap, whiteSpace: 'nowrap' }}>
            GLASS VIPER
          </span>
          <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>{data.method}</span>
        </div>
      </div>
      <div
        style={{
          alignSelf: 'flex-start',
          padding: '4px 14px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.rose, 0.45 + 0.55 * p)}`,
          background: alpha(C.rose, 0.08 + 0.22 * p),
          boxShadow: p > 0.05 ? `0 0 ${Math.round(22 * p)}px ${alpha(C.rose, 0.55 * p)}` : undefined,
          fontSize: TYPE.label,
          fontWeight: 750,
          color: p > 0.3 ? C.textStrong : C.roseSoft,
          whiteSpace: 'nowrap',
        }}
      >
        {data.phase}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------ the compact frame

export type FrameLook = 'observed' | 'projected' | 'empty';

/** Width (px) at which a FrameCard's type is at its base sizes (the rail's frame width at full stage width). */
export const FRAME_BASE_W = 217;

/** Base type sizes of a FrameCard at `FRAME_BASE_W`. */
export const FRAME_TYPE = { id: 30, date: 26, phase: 22, line: 28 } as const;

export interface FrameContent {
  /** Event id (only E7 / E9 have one; the 02-03 frames carry none). */
  id?: string;
  /** dd-mm, e.g. «02-03». */
  date?: string;
  /** Phase name printed on the frame (the rail's label, V3's). */
  phase?: string;
  /** The one line (wraps inside the frame). */
  line?: string;
  /** A tiny V3 mini diamond next to the id (E7 / E9). */
  diamond?: boolean;
}

export interface FrameCardProps extends FrameContent {
  width: number;
  height: number;
  look?: FrameLook;
  /** 0–1: brighter border and a halo (the voice is on it). Lifting/scaling is the caller's job. */
  focus?: number;
  /** 0–1: rose glow (projected: the cast lights up; observed: the thread passes through it). */
  glow?: number;
  /** 0–1: the «?» of an empty frame (default 1). */
  q?: number;
  /** 0–1: the frame turns into a film window (squarer corners, no drop shadow). FilmRail drives it with `film`. */
  film?: number;
  /** Highlight 0–1 on the date (s02 `order`: the dates are read left to right). */
  dateHot?: number;
  /** Highlight 0–1 on the line (the voice describes it). */
  lineHot?: number;
  /**
   * Opt-in shrink-to-fit of the line (default false: nothing changes). When true, the line's type steps down
   * (to at most `fitMin` × its size) until its estimated wrap fits the room left under the id row and the phase.
   * The estimate is conservative and pure (`frameLineSize`), so no DOM measuring and no frame-to-frame jitter.
   */
  fitLine?: boolean;
  /** Smallest scale `fitLine` may reach (default 0.6). */
  fitMin?: number;
  style?: CSSProperties;
}

/** Generous width (em) of `text` in the engine's Inter, semibold/bold. */
function emWidth(text: string): number {
  let em = 0;
  for (const ch of text) {
    if (ch === ' ') em += 0.27;
    else if ("ilj·.,;:'|!".includes(ch)) em += 0.3;
    else if ('ftr'.includes(ch)) em += 0.4;
    else if ('mw'.includes(ch)) em += 0.86;
    else if (ch >= 'A' && ch <= 'Z') em += 0.7;
    else em += 0.58;
  }
  return em;
}

/** Lines a greedy word wrap of `text` takes at `size` px in a column `maxW` px wide (estimate). */
function wrapLines(text: string, size: number, maxW: number): number {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  const space = 0.27 * size;
  let lines = 1;
  let x = 0;
  for (const w of words) {
    const ww = emWidth(w) * size;
    if (x === 0) x = ww;
    else if (x + space + ww <= maxW) x += space + ww;
    else {
      lines += 1;
      x = ww;
    }
  }
  return lines;
}

/**
 * PURE: the px size FrameCard's `fitLine` gives the line of a frame `width` × `height` (with or without a phase),
 * between `fitMin` × and 1 × the base line size at that width.
 */
export function frameLineSize(width: number, height: number, line: string, phase?: string, fitMin = 0.6): number {
  const s = width / FRAME_BASE_W;
  const pad = 13 * s;
  const border = Math.max(1.5, 2 * s);
  const innerW = width - pad * 2 - border * 2;
  const phaseH = phase ? wrapLines(phase, FRAME_TYPE.phase * s, innerW) * FRAME_TYPE.phase * s * 1.15 + 7 * s : 0;
  const room = height - border * 2 - (pad + 6 * s) - pad - FRAME_TYPE.id * s * 1.1 - 7 * s - phaseH - 2 * s - 10 * s - 2;
  const base = FRAME_TYPE.line * s;
  for (let f = 1; f > fitMin; f -= 0.04) {
    const size = base * f;
    if (wrapLines(line, size, innerW) * size * 1.17 <= room) return size;
  }
  return base * fitMin;
}

/** The compact frame of the film rail. See the header comment for the three looks. */
export function FrameCard({
  width,
  height,
  look = 'observed',
  id,
  date,
  phase,
  line,
  diamond = false,
  focus = 0,
  glow = 0,
  q = 1,
  film = 0,
  dateHot = 0,
  lineHot = 0,
  fitLine = false,
  fitMin = 0.6,
  style,
}: FrameCardProps) {
  const s = width / FRAME_BASE_W;
  const f = clamp01(focus);
  const g = clamp01(glow);
  const fl = clamp01(film);
  const radius = mix(14, 6, fl) * s;
  const pad = 13 * s;

  if (look === 'empty') {
    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
          boxSizing: 'border-box',
          borderRadius: radius,
          border: `${Math.max(1.5, 2.5 * s)}px solid ${alpha(C.faint, 0.75 + 0.25 * f)}`,
          background: alpha(C.ink900, 0.55),
          boxShadow: f > 0.01 ? `0 0 ${Math.round(26 * f * s)}px ${alpha(C.muted, 0.28 * f)}` : undefined,
          fontFamily: FONT.sans,
          ...style,
        }}
      >
        {phase ? (
          <div style={{ position: 'absolute', left: pad, right: pad, top: pad, fontSize: FRAME_TYPE.phase * s, fontWeight: 700, lineHeight: 1.15, color: C.faint }}>
            {phase}
          </div>
        ) : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 112 * s,
            fontWeight: 800,
            color: alpha(C.muted, 0.85),
            opacity: clamp01(q),
            transform: `scale(${0.7 + 0.3 * clamp01(q)})`,
          }}
        >
          ?
        </div>
      </div>
    );
  }

  const projected = look === 'projected';
  const border = projected
    ? alpha(C.roseSoft, 0.55 + 0.45 * Math.max(g, f))
    : f > 0.01
      ? alpha(C.textStrong, 0.3 + 0.45 * f)
      : g > 0.01
        ? alpha(C.rose, 0.35 + 0.4 * g)
        : C.ink500;
  const bg = projected
    ? `linear-gradient(180deg, ${alpha(C.rose, 0.1 + 0.1 * g)} 0%, ${alpha(C.roseDeep, 0.22 + 0.18 * g)} 100%)`
    : `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`;
  const halo: string[] = [];
  if (!projected && fl < 0.99) halo.push(`0 ${Math.round(12 * s)}px ${Math.round(28 * s)}px ${alpha('#000000', 0.4 * (1 - fl))}`);
  if (f > 0.01) halo.push(`0 0 ${Math.round(30 * f * s)}px ${alpha(C.textStrong, 0.18 * f)}`);
  if (g > 0.01) halo.push(`0 0 ${Math.round(34 * g * s)}px ${alpha(C.rose, (projected ? 0.55 : 0.3) * g)}`);

  const textColor = projected ? alpha(C.roseSoft, 0.95) : C.textStrong;
  const lineColor = projected ? alpha('#fecdd3', 0.92) : lineHot > 0.3 ? C.textStrong : C.text;
  const lh = clamp01(lineHot);
  const dh = clamp01(dateHot);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        padding: `${pad + 6 * s}px ${pad}px ${pad}px`,
        borderRadius: radius,
        border: `${Math.max(1.5, 2 * s)}px ${projected ? 'dashed' : 'solid'} ${border}`,
        background: bg,
        boxShadow: halo.length ? halo.join(', ') : undefined,
        fontFamily: FONT.sans,
        display: 'flex',
        flexDirection: 'column',
        gap: 7 * s,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 * s, minHeight: FRAME_TYPE.id * s * 1.1 }}>
        {id ? (
          <span style={{ fontSize: FRAME_TYPE.id * s, fontWeight: 850, color: textColor, lineHeight: 1, letterSpacing: -0.3 * s }}>{id}</span>
        ) : null}
        {diamond ? <MiniDiamond size={28 * s} /> : null}
        {date ? (
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: FRAME_TYPE.date * s,
              fontWeight: 700,
              color: dh > 0.3 ? C.textStrong : projected ? alpha(C.roseSoft, 0.9) : C.text,
              whiteSpace: 'nowrap',
              lineHeight: 1,
              padding: `${2 * s}px ${5 * s}px`,
              marginLeft: id || diamond ? 0 : -5 * s,
              borderRadius: 6 * s,
              background: dh > 0.01 ? alpha(C.text, 0.14 * dh) : undefined,
              boxShadow: dh > 0.01 ? `0 0 0 ${Math.max(1, 2 * s)}px ${alpha(C.text, 0.5 * dh)}` : undefined,
            }}
          >
            {date}
          </span>
        ) : null}
      </div>
      {phase ? (
        <div style={{ fontSize: FRAME_TYPE.phase * s, fontWeight: 750, lineHeight: 1.15, color: projected ? C.roseSoft : C.roseSoft, letterSpacing: 0.2 * s }}>
          {phase}
        </div>
      ) : null}
      {line ? (
        <div
          style={{
            fontSize: fitLine ? frameLineSize(width, height, line, phase, fitMin) : FRAME_TYPE.line * s,
            fontWeight: 620,
            lineHeight: 1.17,
            color: lineColor,
            marginTop: 2 * s,
            borderRadius: 6 * s,
            textShadow: lh > 0.01 ? `0 0 ${Math.round(14 * lh * s)}px ${alpha(C.textStrong, 0.35 * lh)}` : undefined,
          }}
        >
          {line}
        </div>
      ) : null}
    </div>
  );
}
