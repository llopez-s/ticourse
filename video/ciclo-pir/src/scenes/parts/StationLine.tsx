import type { CSSProperties, ReactNode } from 'react';
import { ACCENT, C, FONT, RADIUS, alpha, type Accent } from '../../../../engine/src/theme/tokens';
import { StationGlyph, STATION_KINDS } from './Glyphs';

/**
 * The line of six stations of the restaurant — the intelligence cycle, drawn once and reused all video.
 * Official names under the tiles (kept in English, as the exam asks), icons generic: comanda, market, chopping
 * board, stove, tray, guest book. Every state is a 0–1 number the scene drives from its cues.
 */
export const STATION_NAMES: readonly (readonly string[])[] = [
  ['Planning &', 'Direction'],
  ['Collection'],
  ['Processing &', 'Exploitation'],
  ['Analysis &', 'Production'],
  ['Dissemination'],
  ['Feedback'],
];

export const STATION_TITLES = ['Planning & Direction', 'Collection', 'Processing & Exploitation', 'Analysis & Production', 'Dissemination', 'Feedback'] as const;

export type StationState = {
  /** The tile (glyph) appears. Default 1. */
  show?: number;
  /** The official name under it appears. Default 0. */
  name?: number;
  /** Lit: border, glow and glyph take the tone. Default 0. */
  lit?: number;
  /** Accent when lit. Default cyan. */
  tone?: Accent;
  /** Switched off: dark, dashed. Default 0. */
  off?: number;
  /** Grows around the tile's centre. Default 1. */
  scale?: number;
  /** Stepped back (another station is the topic): 0–1. Default 0. */
  dim?: number;
};

export type LineGeometry = { width: number; tile: number; labelSize: number };

export const lineHeight = ({ tile, labelSize }: Pick<LineGeometry, 'tile' | 'labelSize'>, lines = 2) => tile + 14 + Math.round(labelSize * 1.15 * lines);

/** x of the centre of station `i` inside a line of `width` px. */
export function stationX(width: number, i: number): number {
  return (width / 6) * (i + 0.5);
}

export function StationLine({
  width,
  tile = 124,
  labelSize = 30,
  states,
  link = 1,
  names = true,
  style,
}: {
  width: number;
  tile?: number;
  labelSize?: number;
  states: readonly StationState[];
  /** The arrows between tiles (0–1). */
  link?: number;
  /** false: the name block is not drawn at all (compact strip). */
  names?: boolean;
  style?: CSSProperties;
}) {
  const pitch = width / 6;
  const st = (i: number): Required<StationState> => ({ show: 1, name: 0, lit: 0, tone: 'cyan', off: 0, scale: 1, dim: 0, ...states[i] });
  const midY = tile / 2;
  return (
    <div style={{ position: 'relative', width, height: lineHeight({ tile, labelSize }), fontFamily: FONT.sans, ...style }}>
      {/* The arrows between the tiles */}
      <svg width={width} height={tile} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        {STATION_KINDS.slice(0, 5).map((_, i) => {
          const a = st(i);
          const b = st(i + 1);
          const x0 = stationX(width, i) + (tile / 2) * a.scale + 10;
          const x1 = stationX(width, i + 1) - (tile / 2) * b.scale - 10;
          if (x1 - x0 < 14) return null;
          const bothLit = Math.min(a.lit, b.lit);
          const col = bothLit > 0.5 ? ACCENT[b.tone].fg : C.ink500;
          const o = Math.min(a.show, b.show) * link * (1 - 0.6 * Math.max(a.dim, b.dim)) * (1 - 0.7 * Math.max(a.off, b.off));
          return (
            <g key={i} opacity={o}>
              <path d={`M ${x0} ${midY} H ${x1 - 2}`} stroke={col} strokeWidth={3} strokeLinecap="round" strokeDasharray={bothLit > 0.5 ? undefined : '3 9'} />
              <path d={`M ${x1 - 12} ${midY - 9} L ${x1} ${midY} L ${x1 - 12} ${midY + 9}`} stroke={col} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          );
        })}
      </svg>

      {STATION_KINDS.map((kind, i) => {
        const s = st(i);
        const a = ACCENT[s.tone];
        const lit = s.lit * (1 - s.off);
        const border = s.off > 0.5 ? C.ink600 : lit > 0.02 ? alpha(a.fg, 0.35 + 0.6 * lit) : C.ink600;
        const glyph = s.off > 0.5 ? C.ink500 : lit > 0.02 ? a.fg : C.muted;
        const k = s.dim;
        return (
          <div
            key={kind}
            style={{
              position: 'absolute',
              left: i * pitch,
              top: 0,
              width: pitch,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: s.show * (1 - 0.55 * k) * (1 - 0.35 * s.off),
              filter: k > 0.01 ? `saturate(${1 - 0.5 * k})` : undefined,
              transform: `translateY(${(1 - s.show) * 14}px) scale(${s.scale * (1 - 0.05 * k)})`,
              transformOrigin: `50% ${midY}px`,
            }}
          >
            <div
              style={{
                width: tile,
                height: tile,
                boxSizing: 'border-box',
                display: 'grid',
                placeItems: 'center',
                borderRadius: Math.round(tile * 0.24),
                border: `${lit > 0.3 ? 3 : 2}px ${s.off > 0.5 ? 'dashed' : 'solid'} ${border}`,
                background: s.off > 0.5 ? alpha(C.ink950, 0.85) : `linear-gradient(180deg, ${alpha(a.fg, 0.04 + 0.12 * lit)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
                boxShadow: lit > 0.05 ? `0 0 ${Math.round(34 * lit)}px ${alpha(a.fg, 0.3 * lit)}` : undefined,
              }}
            >
              <StationGlyph kind={kind} size={Math.round(tile * 0.62)} color={glyph} />
            </div>
            {names ? (
              <div
                style={{
                  marginTop: 14,
                  fontSize: labelSize,
                  fontWeight: 750,
                  lineHeight: 1.15,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  color: s.off > 0.5 ? C.faint : lit > 0.3 ? a.soft : C.text,
                  opacity: s.name,
                  transform: `translateY(${(1 - s.name) * 8}px)`,
                }}
              >
                {STATION_NAMES[i].map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** A small rounded tag under or over a station: «las que más se olvidan», «sobra»… */
export function Tag({
  children,
  tone = 'amber',
  size = 30,
  show = 1,
  style,
}: {
  children: ReactNode;
  tone?: Accent;
  size?: number;
  show?: number;
  style?: CSSProperties;
}) {
  const a = ACCENT[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: `${Math.round(size * 0.22)}px ${Math.round(size * 0.55)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(a.fg, 0.7)}`,
        background: alpha(a.deep, 0.65),
        color: a.soft,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 10}px)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
