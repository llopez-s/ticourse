import type { CSSProperties } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The video's drawn pieces (no emoji, no glyphs outside the engine's latin fonts): the storm that
 * carries the whole video (cloud, bolt, rain), the faceless readers, and the two maths glyphs the
 * latin subset lacks («≤», an arrow).
 */

/** The cloud outline shared by both storm variants (100×100-ish viewBox 0 0 120 100). */
const CLOUD =
  'M34 68 C20 68 12 58 14 46 C16 36 26 30 36 32 C40 18 54 10 68 14 C80 17 86 26 86 34 C100 34 108 44 106 54 C104 62 98 68 88 68 Z';

/**
 * A storm cloud. `warning` = the storm warning (bolt lit, rain falling); `study` = the study of the
 * storm (calm cloud with a magnifier). `rain` animates the drops (frame-driven, 0 = still).
 */
export function StormIcon({
  size = 160,
  variant = 'warning',
  tone = C.amber,
  glow = 0,
  rain = 0,
  style,
}: {
  size?: number;
  variant?: 'warning' | 'study';
  tone?: string;
  glow?: number;
  rain?: number;
  style?: CSSProperties;
}) {
  const h = (size * 100) / 120;
  const drops = [
    [30, 76],
    [52, 80],
    [74, 80],
    [96, 76],
  ] as const;
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 120 100"
      fill="none"
      style={{ display: 'block', flexShrink: 0, overflow: 'visible', filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(tone, 0.55 * glow)})` : undefined, ...style }}
      aria-hidden
    >
      <path d={CLOUD} fill={alpha(tone, 0.1)} stroke={tone} strokeWidth={4} strokeLinejoin="round" />
      {variant === 'warning' ? (
        <>
          <polygon points="64,44 46,74 59,74 52,96 80,62 66,62 74,44" fill={tone} stroke={tone} strokeWidth={2} strokeLinejoin="round" />
          {drops.map(([x, y], i) => {
            const k = rain > 0 ? ((rain * 0.06 + i * 0.27) % 1) : 0.4;
            return (
              <path
                key={x}
                d={`M${x} ${y + k * 6} l-5 11`}
                stroke={tone}
                strokeWidth={3.6}
                strokeLinecap="round"
                opacity={rain > 0 ? 0.35 + 0.65 * (1 - k) : 0.8}
              />
            );
          })}
        </>
      ) : (
        <>
          <circle cx={80} cy={72} r={14} fill={alpha(C.ink950, 0.9)} stroke={tone} strokeWidth={4} />
          <path d="M90 83 L104 97" stroke={tone} strokeWidth={5} strokeLinecap="round" />
          <path d="M24 88 h26" stroke={alpha(tone, 0.5)} strokeWidth={3.4} strokeLinecap="round" />
          <path d="M24 78 h20" stroke={alpha(tone, 0.5)} strokeWidth={3.4} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export type SilhouetteKind = 'soc' | 'ciso' | 'board' | 'exec' | 'reader';

/** A faceless person: head and shoulders, with one accessory that says the role (no name, no face). */
export function Silhouette({
  kind = 'reader',
  size = 140,
  tone = C.cyan,
  glow = 0,
  style,
}: {
  kind?: SilhouetteKind;
  size?: number;
  tone?: string;
  glow?: number;
  style?: CSSProperties;
}) {
  const body = alpha(tone, 0.22);
  const line = tone;
  const person = (cx: number, s: number, o: number) => (
    <g opacity={o} transform={`translate(${cx} ${120 * (1 - s)}) scale(${s})`}>
      <circle cx={0} cy={34} r={19} fill={body} stroke={line} strokeWidth={4 / s} />
      <path d="M-38 118 C-38 86 -22 70 0 70 C22 70 38 86 38 118 Z" fill={body} stroke={line} strokeWidth={4 / s} strokeLinejoin="round" />
    </g>
  );
  return (
    <svg
      width={size}
      height={(size * 120) / 100}
      viewBox="0 0 100 120"
      fill="none"
      style={{ display: 'block', flexShrink: 0, overflow: 'visible', filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(16 * glow)}px ${alpha(tone, 0.5 * glow)})` : undefined, ...style }}
      aria-hidden
    >
      {kind === 'board' ? (
        <>
          <g transform="translate(0 0)">{person(20, 0.78, 0.7)}</g>
          <g>{person(80, 0.78, 0.7)}</g>
          <g transform="translate(50 0)">{person(0, 1, 1)}</g>
        </>
      ) : (
        <g transform="translate(50 0)">{person(0, 1, 1)}</g>
      )}
      {kind === 'soc' ? (
        <g stroke={line} strokeWidth={4.5} strokeLinecap="round">
          <path d="M28 34 A22 22 0 0 1 72 34" />
          <rect x={23} y={32} width={8} height={15} rx={3} fill={line} />
          <rect x={69} y={32} width={8} height={15} rx={3} fill={line} />
          <path d="M27 46 Q30 58 42 57" />
        </g>
      ) : null}
      {kind === 'ciso' ? (
        <path d="M50 84 L38 89 V99 C38 107 43 112 50 115 C57 112 62 107 62 99 V89 Z" fill={alpha(tone, 0.35)} stroke={line} strokeWidth={3.5} strokeLinejoin="round" />
      ) : null}
      {kind === 'exec' ? <path d="M50 70 L45 78 L50 112 L55 78 Z" fill={alpha(tone, 0.45)} stroke={line} strokeWidth={3} strokeLinejoin="round" /> : null}
    </svg>
  );
}

/** «≤» drawn (the latin subset has no U+2264). Sized to sit on the text baseline like a glyph. */
export function LessEq({ size = 34, color = 'currentColor', style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size * 0.62} height={size * 0.78} viewBox="0 0 16 20" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: '-0.1em', ...style }} aria-hidden>
      <path d="M13 3 L3 9 L13 15" />
      <path d="M3 19 H13" />
    </svg>
  );
}

/** A right arrow that sits inline with text (no arrow glyph in the latin subset). */
export function ArrowInline({ size = 34, color = 'currentColor', style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size * 0.9} height={size * 0.7} viewBox="0 0 20 16" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: '-0.06em', ...style }} aria-hidden>
      <path d="M2 8 H17 M11 2 L17 8 L11 14" />
    </svg>
  );
}

/** A sheet of paper with grey text bars; `badge` is the colour of its first (headline) bar. */
export function PageIcon({
  w = 120,
  lines = 6,
  tone = C.cyan,
  stack = 0,
  stampTone,
  style,
}: {
  w?: number;
  lines?: number;
  tone?: string;
  /** Extra sheets peeking out behind (a pile). */
  stack?: number;
  stampTone?: string;
  style?: CSSProperties;
}) {
  const h = Math.round(w * 1.3);
  const bars = Array.from({ length: lines }, (_, i) => i);
  return (
    <div style={{ position: 'relative', width: w, height: h, ...style }}>
      {Array.from({ length: stack }, (_, k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: (k + 1) * 6,
            top: -(k + 1) * 6,
            width: w,
            height: h,
            borderRadius: 8,
            background: C.ink800,
            border: `2px solid ${C.ink600}`,
            opacity: 1 - k * 0.1,
          }}
        />
      ))}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`, border: `2px solid ${alpha(stampTone ?? tone, 0.55)}`, boxShadow: `0 10px 26px ${alpha('#000000', 0.4)}` }}>
        <div style={{ position: 'absolute', left: w * 0.12, right: w * 0.12, top: h * 0.1, bottom: h * 0.08, display: 'flex', flexDirection: 'column', gap: Math.max(4, Math.round(h * 0.045)) }}>
          {bars.map((i) => (
            <div
              key={i}
              style={{
                height: Math.max(4, Math.round(h * 0.04)),
                width: i === 0 ? '62%' : i === bars.length - 1 ? '45%' : '100%',
                borderRadius: 3,
                background: i === 0 ? tone : alpha(C.muted, 0.35),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Deterministic 0–1 pseudo-random from an integer seed (stable across frames and renders). */
export function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** A satellite (solar panels, body, dish): the confident forecaster's source. */
export function SatelliteIcon({ size = 100, tone = C.emerald, style }: { size?: number; tone?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={tone} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden>
      <rect x={38} y={36} width={24} height={30} rx={5} fill={alpha(tone, 0.2)} />
      <rect x={4} y={42} width={28} height={20} rx={2} fill={alpha(tone, 0.12)} />
      <rect x={68} y={42} width={28} height={20} rx={2} fill={alpha(tone, 0.12)} />
      <path d="M18 42 V62 M4 52 H32 M82 42 V62 M68 52 H96" strokeWidth={2.6} />
      <path d="M32 52 H38 M62 52 H68" />
      <path d="M50 36 V24 M38 20 Q50 8 62 20" />
      <circle cx={50} cy={22} r={3} fill={tone} stroke="none" />
      <path d="M44 66 V80 M56 66 V80 M40 80 H60" strokeWidth={3} />
    </svg>
  );
}

/** Someone looking out of a window (seen from behind): the thin source. */
export function WindowWatcherIcon({ size = 100, tone = C.amber, style }: { size?: number; tone?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={tone} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden>
      <rect x={14} y={8} width={72} height={84} rx={4} fill={alpha(tone, 0.08)} />
      <path d="M50 8 V92 M14 44 H86" strokeWidth={3} />
      <path d="M62 22 a8 8 0 0 1 14 -3 a6 6 0 0 1 2 11 H60 a6 6 0 0 1 2 -8Z" strokeWidth={2.6} />
      <circle cx={34} cy={62} r={8} fill={alpha(tone, 0.3)} />
      <path d="M20 92 C20 76 26 70 34 70 C42 70 48 76 48 92" fill={alpha(tone, 0.3)} />
    </svg>
  );
}

/** A padlock that ties two things together (closed). */
export function LockIcon({ size = 80, tone = C.amber, style }: { size?: number; tone?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tone} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden>
      <rect x={5} y={10.5} width={14} height={10} rx={2} fill={alpha(tone, 0.18)} />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <path d="M12 14.5v2.5" />
    </svg>
  );
}
