import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { CLOCKS, SOURCES, UTC_ORDER, type ClockId, type SourceId } from './data';

/**
 * The time ruler of s04 and s05 (and the continuity for s06+). It is an ORDINAL axis: the chips sit in slots, evenly
 * spaced, because on a true linear axis the two EDR times are 17 s apart and the proxy 61 s before them (they would
 * overlap), and the point of s04 is the ORDER the text gives. The naive ruler orders by the text of the hour (zone
 * ignored); the UTC ruler orders by the moment. A break mark in the naive ruler stands for the near-hour between
 * 09:02:58Z and 09:58:12.
 *
 * Coordinates are stage-local (1728×660). Chips are centred on the slot's x.
 */
export const RULER = {
  /** Slot centres of the naive ruler, in CLOCKS order: proxy, edr1, edr2, login, fw. */
  naiveX: [130, 400, 670, 1090, 1500] as const,
  /** Slot centres of the UTC ruler, in UTC_ORDER: login, proxy, edr1, edr2, fw. */
  utcX: [150, 450, 750, 1050, 1350] as const,
  /** Where the naive ruler breaks (between edr2 and login). */
  breakX: 880,
  /** Chip text size (mono). */
  size: 38,
  /** Height of a chip with one line and with the grey original under it. */
  h1: 74,
  h2: 116,
  /** Chip widths. The firewall chip is the wide one while it still carries `+01:00`. */
  w: 252,
  wFw: 355,
} as const;

export function naiveSlot(id: ClockId): number {
  return RULER.naiveX[CLOCKS.findIndex((c) => c.id === id)];
}
export function utcSlot(id: ClockId): number {
  return RULER.utcX[UTC_ORDER.indexOf(id)];
}

export type ChipTone = 'plain' | 'norm' | 'amber';

const TONE: Record<ChipTone, string> = { plain: C.cyan, norm: C.emerald, amber: C.amber };

/**
 * One hour on the ruler. `time` + `zone` is the text as it comes; `alt` (with `swap` 0 → 1) cross-fades to another
 * text (the normalised hour). `original` is the grey line under it — the screen rule of s05, s06 and s07: every
 * normalised hour carries its original in grey. Fixed `width`; the text is centred.
 */
export function ClockChip({
  time,
  zone = '',
  zoneGlow = 0,
  alt,
  swap = 0,
  original,
  originalOn = 1,
  tone = 'plain',
  width = RULER.w,
  glow = 0,
  dim = 0,
  style,
}: {
  time: string;
  zone?: string;
  /** 0–1: the end of the hour is lit (Z emerald, +01:00 sky, nothing = an amber gap). */
  zoneGlow?: number;
  alt?: { time: string; zone?: string };
  swap?: number;
  original?: string;
  originalOn?: number;
  tone?: ChipTone;
  width?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const g = clamp01(glow);
  const color = TONE[tone];
  const withOriginal = original !== undefined;
  const h = withOriginal ? RULER.h2 : RULER.h1;
  const s = clamp01(swap);
  // With the grey original still hidden the hour sits in the middle of the chip; the original pushes it up.
  const textTop = withOriginal ? 8 + 27 * (1 - clamp01(originalOn)) : 12;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(color, 0.45 + 0.45 * g)}`,
        background: alpha(C.ink850, 0.96),
        boxShadow: g > 0.01 ? `0 0 ${14 + g * 26}px ${alpha(color, 0.32 * g)}` : undefined,
        opacity: 1 - 0.55 * clamp01(dim),
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * clamp01(dim)})` : undefined,
        fontFamily: FONT.mono,
        ...style,
      }}
    >
      <TimeText time={time} zone={zone} zoneGlow={zoneGlow} opacity={1 - s} top={textTop} color={C.textStrong} />
      {alt ? <TimeText time={alt.time} zone={alt.zone ?? ''} zoneGlow={0} opacity={s} top={textTop} color={C.emerald} /> : null}
      {withOriginal ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 9,
            textAlign: 'center',
            fontSize: 26,
            fontWeight: 500,
            color: C.muted,
            opacity: clamp01(originalOn),
            whiteSpace: 'nowrap',
          }}
        >
          {original}
        </div>
      ) : null}
    </div>
  );
}

function TimeText({ time, zone, zoneGlow, opacity, top, color }: { time: string; zone: string; zoneGlow: number; opacity: number; top: number; color: string }) {
  if (opacity <= 0.002) return null;
  const zg = clamp01(zoneGlow);
  const zoneColor = zone === 'Z' ? C.emerald : C.sky;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        textAlign: 'center',
        fontSize: RULER.size,
        fontWeight: 700,
        lineHeight: 1.2,
        color,
        opacity,
        whiteSpace: 'nowrap',
      }}
    >
      {time}
      {zone ? (
        <span
          style={{
            color: zg > 0.01 ? zoneColor : color,
            borderBottom: `4px solid ${alpha(zoneColor, zg)}`,
            paddingBottom: 1,
          }}
        >
          {zone}
        </span>
      ) : zg > 0.01 ? (
        <span
          style={{
            display: 'inline-block',
            width: '0.9em',
            height: '0.95em',
            marginLeft: 6,
            verticalAlign: 'text-bottom',
            border: `3px dashed ${alpha(C.amber, zg)}`,
            borderRadius: 6,
            boxSizing: 'border-box',
          }}
        />
      ) : null}
    </div>
  );
}

/** The ruler's line: `draw` 0–1 grows it from the left; `slots` get a tick; `breakAt` draws the near-hour break. */
export function RulerLine({
  y,
  slots,
  breakAt,
  draw = 1,
  width = 1728,
  color = C.ink500,
  tickColor = C.cyan,
  tickOn = 1,
}: {
  y: number;
  slots: readonly number[];
  breakAt?: number;
  draw?: number;
  width?: number;
  color?: string;
  tickColor?: string;
  tickOn?: number;
}) {
  const d = clamp01(draw);
  const w = width * d;
  return (
    <svg width={width} height={40} viewBox={`0 0 ${width} 40`} style={{ position: 'absolute', left: 0, top: y - 20, overflow: 'visible' }} aria-hidden>
      {breakAt === undefined ? (
        <path d={`M 0 20 H ${w}`} stroke={color} strokeWidth={6} strokeLinecap="round" />
      ) : (
        <>
          <path d={`M 0 20 H ${Math.min(w, breakAt - 22)}`} stroke={color} strokeWidth={6} strokeLinecap="round" />
          {w > breakAt + 22 ? <path d={`M ${breakAt + 22} 20 H ${w}`} stroke={color} strokeWidth={6} strokeLinecap="round" /> : null}
          {w > breakAt - 22 ? (
            <g stroke={C.muted} strokeWidth={5} strokeLinecap="round">
              <path d={`M ${breakAt - 14} 34 L ${breakAt - 2} 6`} />
              <path d={`M ${breakAt + 2} 34 L ${breakAt + 14} 6`} />
            </g>
          ) : null}
        </>
      )}
      {slots.map((x) => (x <= w ? <circle key={x} cx={x} cy={20} r={9} fill={alpha(tickColor, 0.9 * tickOn)} stroke={C.ink950} strokeWidth={3} /> : null))}
    </svg>
  );
}

/** The source of an hour, as a small cyan chip with its icon (the table's four sources keep their icon). */
export function SourceTag({ id, size = 28, style }: { id: SourceId; size?: number; style?: CSSProperties }) {
  const src = SOURCES[id];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: `${Math.round(size * 0.18)}px ${Math.round(size * 0.5)}px ${Math.round(size * 0.18)}px ${Math.round(size * 0.34)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.cyan, 0.5)}`,
        background: alpha(C.cyan, 0.08),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        color: C.cyanSoft,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <Icon name={src.icon} size={Math.round(size * 1.1)} color={C.cyan} />
      {src.short}
    </div>
  );
}
