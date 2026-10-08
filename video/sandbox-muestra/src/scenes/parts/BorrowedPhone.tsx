import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { mixHex } from './Garment';

/**
 * «El teléfono prestado» — the sandbox writes down everything: the guest's
 * calls and the phone's own (s04 `phone`, s06 rule 2). A phone whose screen is
 * a call log of five entries: TWO «de quien lo usa» (a person glyph, rose: the
 * sample's own calls) and THREE «del propio teléfono» (grey, each with its icon:
 * a clock = poner la hora, a shield = certificados de confianza, signal bars =
 * ¿hay internet?). No entry carries a readable number: an abstract bar stands
 * for it, and a drawn handset marks the call.
 *
 * - `show`   0–1 appearance;
 * - `log`    0–1 the five entries fill in, top to bottom;
 * - `guest`  0–1 the two guest entries take their colour (+ their caption);
 * - `own`    0–1 the three own entries take their icons and grey (+ their caption);
 * - `pulse`  optional per-group emphasis (0–1) when the host list points back at them;
 * - `captions` the two bracket captions at the phone's right (off in `mini`).
 *
 * `mini` is the static rule-2 miniature (everything shown, no captions, heavier
 * strokes); size it with `height` (default 150). Nothing reads the timeline.
 */

export const PHONE_BASE = { w: 230, h: 440 } as const;
export const PHONE_CAPTIONS = { guest: 'de quien lo usa', own: 'del propio teléfono' } as const;

/** Px width of the phone body for a given height. */
export function phoneWidth(height: number): number {
  return (PHONE_BASE.w * height) / PHONE_BASE.h;
}

/** Design-unit centre y of entry i (0–4). */
const ROW_Y = [118, 178, 262, 322, 382] as const;
const ROW_H = 46;
const GREY = '#94a3b8';

export type PhoneOwnIcon = 'clock' | 'shield' | 'signal';
const OWN_ICONS: readonly PhoneOwnIcon[] = ['clock', 'shield', 'signal'];

/** Px vertical span (top, bottom) of a group of entries, for brackets drawn outside. */
export function phoneGroupSpan(height: number, group: 'guest' | 'own'): { top: number; bottom: number } {
  const s = height / PHONE_BASE.h;
  const rows = group === 'guest' ? [0, 1] : [2, 3, 4];
  return { top: (ROW_Y[rows[0]] - ROW_H / 2) * s, bottom: (ROW_Y[rows[rows.length - 1]] + ROW_H / 2) * s };
}

/** One of the phone's own icons, drawn in a 24-unit box (same strokes as the engine icons). */
export function OwnGlyph({ name, x, y, size, color, sw = 2 }: { name: PhoneOwnIcon; x: number; y: number; size: number; color: string; sw?: number }) {
  const s = size / 24;
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`} fill="none" stroke={color} strokeWidth={sw / s} strokeLinecap="round" strokeLinejoin="round">
      {name === 'clock' ? (
        <>
          <circle cx={12} cy={12} r={8.5} />
          <path d="M12 7.5V12l3 2" />
        </>
      ) : name === 'shield' ? (
        <>
          <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5V6L12 3Z" />
          <path d="M12 7.5v9" opacity={0.6} />
        </>
      ) : (
        <>
          <path d="M5 19v-2.5M9.5 19v-5.5M14 19v-9M18.5 19V5" strokeWidth={(sw * 1.25) / s} />
        </>
      )}
    </g>
  );
}

/** A person glyph (the guest) in a 24-unit box. */
function GuestGlyph({ x, y, size, color, sw = 2 }: { x: number; y: number; size: number; color: string; sw?: number }) {
  const s = size / 24;
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`} fill="none" stroke={color} strokeWidth={sw / s} strokeLinecap="round">
      <circle cx={12} cy={8} r={4} />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </g>
  );
}

/** A small handset, outgoing call (drawn, never a glyph from the font). */
function Handset({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const s = size / 24;
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`} fill={color}>
      <path d="M6.6 3.5 9 3l1.6 4.2-1.9 1.3a10.5 10.5 0 0 0 5.4 5.4l1.3-1.9L19.6 14l-.5 2.4a2.5 2.5 0 0 1-2.6 2C10 18 6 14 5.6 6.1a2.5 2.5 0 0 1 1-2.6Z" />
    </g>
  );
}

export function BorrowedPhone({
  height = 150,
  show = 1,
  log = 1,
  guest = 1,
  own = 1,
  pulse,
  captions = true,
  captionSize = 38,
  mini = false,
  style,
}: {
  /** Px height of the phone body. */
  height?: number;
  show?: number;
  log?: number;
  guest?: number;
  own?: number;
  pulse?: { guest?: number; own?: number };
  captions?: boolean;
  captionSize?: number;
  mini?: boolean;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0.001) return null;
  const width = phoneWidth(height);
  const k = mini ? 2 : 1;
  const L = mini ? 1 : clamp01(log);
  const g = mini ? 1 : clamp01(guest);
  const o = mini ? 1 : clamp01(own);
  const pg = clamp01(pulse?.guest ?? 0);
  const po = clamp01(pulse?.own ?? 0);
  const withCaptions = captions && !mini;
  const rowIn = (i: number) => clamp01(L * 5 - i);
  const capGap = 26;
  const capW = withCaptions ? 420 : 0;

  return (
    <div style={{ position: 'relative', width: width + (withCaptions ? capGap + capW : 0), height, opacity: sh, ...style }}>
      <svg width={width} height={height} viewBox={`0 0 ${PHONE_BASE.w} ${PHONE_BASE.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* Body, screen, speaker and the bar at the bottom */}
        <rect x={4} y={4} width={222} height={432} rx={34} fill="#111a2c" stroke="#5b6b85" strokeWidth={4 * k} />
        <rect x={16} y={40} width={198} height={370} rx={14} fill="#0a1120" stroke={alpha('#5b6b85', 0.5)} strokeWidth={1.5 * k} />
        <rect x={92} y={18} width={46} height={7} rx={3.5} fill="#2b3a55" />
        <rect x={86} y={420} width={58} height={6} rx={3} fill="#2b3a55" />
        {/* Screen header: the call-log glyph */}
        <Handset x={38} y={70} size={22} color={alpha('#cbd5e1', 0.9)} />
        <rect x={56} y={64} width={64} height={12} rx={6} fill={alpha('#cbd5e1', 0.35)} />
        <path d="M 28 92 L 202 92" stroke={alpha('#5b6b85', 0.6)} strokeWidth={1.5 * k} />
        {/* Group divider between the guest's entries and the phone's own */}
        <path d="M 28 220 L 202 220" stroke={alpha('#5b6b85', 0.45 * Math.max(g, o))} strokeWidth={1.5 * k} strokeDasharray="5 5" />

        {ROW_Y.map((y, i) => {
          const r = rowIn(i);
          if (r <= 0.001) return null;
          const isGuest = i < 2;
          const t = isGuest ? g : o;
          const p = isGuest ? pg : po;
          const target = isGuest ? C.rose : GREY;
          const col = mixHex('#7c8ba3', target, t);
          return (
            <g key={i} opacity={r} transform={`translate(${(1 - r) * 10} 0)`}>
              <rect
                x={26}
                y={y - ROW_H / 2}
                width={178}
                height={ROW_H}
                rx={10}
                fill={alpha(isGuest ? C.rose : GREY, 0.06 + 0.08 * t + 0.14 * p)}
                stroke={alpha(col, 0.25 + 0.35 * t + 0.4 * p)}
                strokeWidth={1.6 * k}
              />
              <circle cx={50} cy={y} r={15} fill={alpha(col, 0.16 + 0.1 * t)} stroke={alpha(col, 0.7)} strokeWidth={1.4 * k} />
              {isGuest ? (
                <GuestGlyph x={50} y={y} size={20} color={col} sw={2 * k} />
              ) : t > 0.02 ? (
                <g opacity={t}>
                  <OwnGlyph name={OWN_ICONS[i - 2]} x={50} y={y} size={21} color={col} sw={2 * k} />
                </g>
              ) : null}
              {/* The entry: an abstract bar, never a readable number */}
              <rect x={74} y={y - 9} width={isGuest ? 86 : 72 + (i % 2) * 14} height={8} rx={4} fill={alpha(col, 0.75)} />
              <rect x={74} y={y + 4} width={52} height={6} rx={3} fill={alpha(col, 0.35)} />
              <Handset x={186} y={y} size={18} color={alpha(col, 0.85)} />
            </g>
          );
        })}
      </svg>

      {withCaptions ? (
        <>
          <Bracket
            x={width + 6}
            span={phoneGroupSpan(height, 'guest')}
            tone={C.rose}
            text={PHONE_CAPTIONS.guest}
            size={captionSize}
            p={g * rowIn(1)}
            emph={pg}
            gap={capGap}
          />
          <Bracket
            x={width + 6}
            span={phoneGroupSpan(height, 'own')}
            tone={GREY}
            text={PHONE_CAPTIONS.own}
            size={captionSize}
            p={o * rowIn(4)}
            emph={po}
            gap={capGap}
          />
        </>
      ) : null}
    </div>
  );
}

/** A thin bracket along a group of entries with its caption to the right. */
function Bracket({
  x,
  span,
  tone,
  text,
  size,
  p,
  emph,
  gap,
}: {
  x: number;
  span: { top: number; bottom: number };
  tone: string;
  text: string;
  size: number;
  p: number;
  emph: number;
  gap: number;
}) {
  const k = clamp01(p);
  if (k <= 0.001) return null;
  const h = span.bottom - span.top;
  return (
    <div style={{ position: 'absolute', left: x, top: span.top, height: h, display: 'flex', alignItems: 'center', opacity: k, transform: `translateX(${(1 - k) * 12}px)` }}>
      <div
        style={{
          width: 12,
          height: h,
          borderTop: `4px solid ${tone}`,
          borderBottom: `4px solid ${tone}`,
          borderRight: `4px solid ${tone}`,
          borderRadius: '0 8px 8px 0',
          boxSizing: 'border-box',
          boxShadow: emph > 0.02 ? `0 0 ${Math.round(16 * emph)}px ${alpha(tone, 0.6 * emph)}` : undefined,
        }}
      />
      <div
        style={{
          marginLeft: gap - 8,
          fontFamily: FONT.sans,
          fontSize: size,
          fontWeight: 750,
          lineHeight: 1.1,
          color: tone === C.rose ? C.roseSoft : C.text,
          whiteSpace: 'nowrap',
          textShadow: emph > 0.02 ? `0 0 ${Math.round(14 * emph)}px ${alpha(tone, 0.6 * emph)}` : undefined,
        }}
      >
        {text}
      </div>
    </div>
  );
}
