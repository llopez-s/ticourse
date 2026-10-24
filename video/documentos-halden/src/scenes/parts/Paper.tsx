import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/**
 * The video's one object: a paper sheet, face up, light on the dark stage, with a folded corner and a heading band.
 * Nothing here is ever turned over (V35's actor cards are face-down tiles that flip); a sheet is read by coming
 * closer or lifting off the table. Headings and text are dark ink on paper; everything else around it is the
 * series' dark UI.
 */
export const PAPER = {
  top: '#f1f4f9',
  bottom: '#d6deea',
  edge: '#aebbd0',
  ink: '#16213a',
  soft: '#4b5c80',
  bar: 'rgba(22, 33, 58, 0.2)',
  wrong: '#b45309',
  right: '#047857',
} as const;

/** Heading states: ink (neutral), amber (the common mistake, «política»), emerald (it really is that). */
export type HeadTone = 'plain' | 'wrong' | 'right';

const HEAD_COLOR: Record<HeadTone, string> = { plain: PAPER.ink, wrong: PAPER.wrong, right: PAPER.right };

/** Deterministic widths (as a share of the line) for unreadable body bars. */
export const BAR_SETS: readonly (readonly number[])[] = [
  [1, 0.92, 0.97, 0.7, 0.88, 0.5],
  [0.95, 1, 0.84, 0.93, 0.6, 0.78],
  [1, 0.86, 0.96, 0.9, 0.55, 0.72],
  [0.9, 1, 0.8, 0.94, 0.68, 0.46],
];

/** Body lines drawn as bars: no readable text. */
export function Bars({ set = 0, count = 5, gap = 16, height = 13, style }: { set?: number; count?: number; gap?: number; height?: number; style?: CSSProperties }) {
  const widths = BAR_SETS[set % BAR_SETS.length].slice(0, count);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>
      {widths.map((w, i) => (
        <div key={i} style={{ width: `${w * 100}%`, height, borderRadius: height / 2, background: PAPER.bar }} />
      ))}
    </div>
  );
}

/** A small chip printed on paper (who writes the sheet): icon + word, ink on pale cyan. */
export function HeadChip({ icon, text, size = 26 }: { icon: IconName; text: string; size?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: Math.round(size * 1.5),
        padding: `0 ${Math.round(size * 0.55)}px 0 ${Math.round(size * 0.4)}px`,
        boxSizing: 'border-box',
        borderRadius: 999,
        background: 'rgba(14, 116, 144, 0.14)',
        border: '2px solid rgba(14, 116, 144, 0.55)',
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: '#0e5a70',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.95)} color="#0e7490" strokeWidth={2.2} />
      {text}
    </div>
  );
}

export interface SheetProps {
  width: number;
  height: number;
  /** Heading text (e.g. «POLÍTICA»); null = no heading band. */
  heading?: string | null;
  headTone?: HeadTone;
  /** 0–1 amber stroke through the heading (it is not what it says). */
  strike?: number;
  /** 0–1 emerald check beside the heading (it is what it says). */
  check?: number;
  /** Right side of the heading band. */
  headRight?: ReactNode;
  /** 0–1 coloured ring and glow. */
  glow?: number;
  glowTone?: string;
  /** 0–1 push back: fades and desaturates. */
  dim?: number;
  /** Rotation in degrees. */
  tilt?: number;
  scale?: number;
  /** px the sheet is lifted off the table (a bigger shadow). */
  lift?: number;
  headingSize?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

/** A paper sheet. Children go in the body, under the heading band. */
export function Sheet({
  width,
  height,
  heading = null,
  headTone = 'plain',
  strike = 0,
  check = 0,
  headRight,
  glow = 0,
  glowTone = C.cyan,
  dim = 0,
  tilt = 0,
  scale = 1,
  lift = 0,
  headingSize = 30,
  style,
  children,
}: SheetProps) {
  const g = clamp01(glow);
  const d = clamp01(dim);
  const s = clamp01(strike);
  const k = clamp01(check);
  const fold = Math.round(Math.min(width, height) * 0.1);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        opacity: 1 - 0.55 * d,
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        transform: `translateY(${-lift}px) rotate(${tilt}deg) scale(${scale})`,
        transformOrigin: '50% 55%',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: 10,
          background: `linear-gradient(180deg, ${PAPER.top} 0%, ${PAPER.bottom} 100%)`,
          boxShadow:
            g > 0.02
              ? `0 0 0 ${Math.round(3 + 2 * g)}px ${alpha(glowTone, 0.95 * g)}, 0 0 ${Math.round(46 * g)}px ${alpha(glowTone, 0.5 * g)}, 0 ${16 + lift * 0.7}px 38px ${alpha('#000000', 0.5)}`
              : `0 ${14 + lift * 0.7}px ${34 + lift * 0.4}px ${alpha('#000000', 0.5)}`,
          overflow: 'hidden',
          fontFamily: FONT.sans,
          color: PAPER.ink,
        }}
      >
        {/* folded corner */}
        <svg width={fold} height={fold} style={{ position: 'absolute', right: 0, top: 0 }}>
          <polygon points={`0,0 ${fold},${fold} 0,${fold}`} fill={PAPER.edge} />
          <polygon points={`0,0 ${fold},0 ${fold},${fold}`} fill="#0c1322" opacity={0.0} />
        </svg>
        {heading !== null ? (
          <div style={{ padding: '18px 28px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, height: 44, paddingRight: fold * 0.6 }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: headingSize, fontWeight: 850, letterSpacing: 4, color: HEAD_COLOR[headTone], whiteSpace: 'nowrap' }}>{heading}</span>
                {s > 0.001 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: -6,
                      top: '54%',
                      height: 5,
                      width: `calc(${s * 100}% + ${12 * s}px)`,
                      borderRadius: 3,
                      background: '#d97706',
                      transform: 'translateY(-50%) rotate(-3deg)',
                      transformOrigin: '0 50%',
                    }}
                  />
                ) : null}
                {k > 0.001 ? (
                  <span style={{ display: 'inline-flex', opacity: k, transform: `scale(${0.6 + 0.4 * k})` }}>
                    <Icon name="check" size={headingSize} color={PAPER.right} strokeWidth={3} />
                  </span>
                ) : null}
              </div>
              {headRight ?? null}
            </div>
            <div style={{ height: 3, marginTop: 8, background: PAPER.edge, borderRadius: 2 }} />
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 28, right: 28, top: heading !== null ? 84 : 28, bottom: 20 }}>{children}</div>
      </div>
    </div>
  );
}

/** Text on paper that types itself in between two frames (the hidden rest keeps the layout still). */
export function Typed({
  text,
  frame,
  start,
  end,
  size = 30,
  weight = 650,
  color = PAPER.ink,
  lineHeight = 1.28,
}: {
  text: string;
  frame: number;
  start: number;
  end: number;
  size?: number;
  weight?: number;
  color?: string;
  lineHeight?: number;
}) {
  const p = progress(frame, start, Math.max(1, end - start), EASE.linear);
  const n = Math.floor(text.length * p);
  return (
    <span style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: weight, color, lineHeight }}>
      <span>{text.slice(0, n)}</span>
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </span>
  );
}

/** A hand-drawn signature that draws itself (0–1) with its small caption. */
export function Signature({ draw, label, width = 190 }: { draw: number; label: string; width?: number }) {
  const d = clamp01(draw);
  const h = width * 0.3;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, opacity: d > 0 ? 1 : 0 }}>
      <svg width={width} height={h} viewBox="0 0 190 57" style={{ overflow: 'visible' }}>
        <path
          d="M 6 42 C 18 6, 30 8, 28 30 C 27 44, 40 12, 50 26 C 58 38, 62 36, 70 22 C 76 12, 84 40, 98 28 C 108 20, 112 14, 120 30 C 126 42, 140 20, 150 30 C 158 38, 168 34, 184 18"
          fill="none"
          stroke={PAPER.ink}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeDasharray={420}
          strokeDashoffset={420 * (1 - d)}
        />
        <path d="M 4 50 L 186 50" stroke={PAPER.edge} strokeWidth={3} strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: FONT.sans, fontSize: 26, fontWeight: 750, color: PAPER.soft, opacity: d, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

/** A tiny sheet as a pictogram (diagrams, the case, the poster): a heading bar and body bars. No text. */
export function SheetGlyph({ width = 56, tone = PAPER.ink, style }: { width?: number; tone?: string; style?: CSSProperties }) {
  const h = width * 1.28;
  return (
    <svg width={width} height={h} viewBox="0 0 50 64" style={{ overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id="sheetglyph" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PAPER.top} />
          <stop offset="1" stopColor={PAPER.bottom} />
        </linearGradient>
      </defs>
      <path d="M 3 3 L 36 3 L 47 14 L 47 61 L 3 61 Z" fill="url(#sheetglyph)" stroke={PAPER.edge} strokeWidth={2} strokeLinejoin="round" />
      <path d="M 36 3 L 36 14 L 47 14 Z" fill={PAPER.edge} />
      <rect x={9} y={12} width={20} height={5} rx={2.5} fill={tone} opacity={0.75} />
      {[24, 32, 40, 48].map((y, i) => (
        <rect key={y} x={9} y={y} width={i === 3 ? 20 : 32} height={4} rx={2} fill={PAPER.bar} />
      ))}
    </svg>
  );
}
