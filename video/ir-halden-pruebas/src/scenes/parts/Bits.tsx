import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Chip, Icon, clamp01, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * Small pieces shared by agent A's scenes (s01, s02, s03, s06): the
 * improvement row (same look as V5's list: emerald tick, owner chip, date),
 * a speech bubble, the on-call phone, a paper sheet and a bell with a slash.
 * They never read the timeline: pass Sequence-relative frames / 0–1 weights.
 */

/** Approximate width of `text` in em for the sans font (copied from V5's Board). */
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

/** Largest size ≤ `size` at which `text` fits `width` px on one line. */
export function fitSize(text: string, size: number, width: number): number {
  return Math.min(size, Math.floor(width / (emWidth(text) * 1.02)));
}

// ---------------------------------------------------------------------------
// Improvement row: text · owner · date
// ---------------------------------------------------------------------------

export interface ImprovementDef {
  text: string;
  owner: string;
  date: string;
}

/**
 * One improvement with owner and date. Geometry is row-local: `textX`,
 * `ownerX`, `dateX` are px from the row's left edge. `lit` (0–1) makes it the
 * row in focus (emerald edge and halo); `ownerIn` / `dateIn` (0–1) bring the
 * owner chip and the date in.
 */
export function ImprovementRow({
  imp,
  width,
  height = 52,
  textSize = 32,
  textX = 60,
  ownerX,
  dateX,
  lit = 0,
  ownerIn = 1,
  dateIn = 1,
  textColor = C.textStrong,
  style,
}: {
  imp: ImprovementDef;
  width: number;
  height?: number;
  textSize?: number;
  textX?: number;
  ownerX: number;
  dateX: number;
  lit?: number;
  ownerIn?: number;
  dateIn?: number;
  textColor?: string;
  style?: CSSProperties;
}) {
  const l = clamp01(lit);
  const size = fitSize(imp.text, textSize, ownerX - textX - 30);
  const chipSize = Math.round(Math.min(30, textSize * 0.85));
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.sm,
        background: l > 0.01 ? `linear-gradient(90deg, ${alpha(C.emerald, 0.1 * l)} 0%, ${alpha(C.ink850, 0.94)} 60%)` : alpha(C.ink850, 0.92),
        border: `${l > 0.4 ? 3 : 2}px solid ${alpha(l > 0.01 ? C.emerald : C.cyan, 0.18 + 0.62 * l)}`,
        boxShadow: l > 0.01 ? `0 0 ${Math.round(30 * l)}px ${alpha(C.emerald, 0.35 * l)}` : undefined,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: Math.round(textX / 2 - textSize * 0.45), top: 0, height: '100%', display: 'flex', alignItems: 'center' }}>
        <Icon name="check" size={Math.round(textSize * 0.9)} color={C.emerald} strokeWidth={2.6} />
      </div>
      <div style={{ position: 'absolute', left: textX, top: 0, height: '100%', display: 'flex', alignItems: 'center', fontSize: size, fontWeight: 700, color: textColor, whiteSpace: 'nowrap' }}>
        {imp.text}
      </div>
      <div
        style={{
          position: 'absolute',
          left: ownerX,
          top: 0,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          opacity: clamp01(ownerIn * 1.3),
          transform: `scale(${0.85 + 0.15 * clamp01(ownerIn)})`,
          transformOrigin: 'left center',
        }}
      >
        <Chip accent="cyan" icon="user" size={chipSize}>
          {imp.owner}
        </Chip>
      </div>
      <div
        style={{
          position: 'absolute',
          left: dateX,
          top: 0,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          fontFamily: FONT.mono,
          fontSize: Math.round(Math.max(28, textSize)),
          fontWeight: 800,
          color: l > 0.3 ? '#6ee7b7' : C.text,
          opacity: clamp01(dateIn * 1.3),
          transform: `translateX(${(1 - clamp01(dateIn)) * 10}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        {imp.date}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Speech bubble
// ---------------------------------------------------------------------------

/**
 * A speech bubble with a tail. `tail` says which edge the tail leaves from
 * ('bottom-left', 'bottom-right', 'left', 'right'); `tailAt` is its offset
 * along that edge in px (default 60).
 */
export function SpeechBubble({
  children,
  tone = 'sky',
  size = 48,
  tail = 'bottom-left',
  tailAt = 60,
  glow = 0,
  style,
}: {
  children: ReactNode;
  tone?: Tone;
  size?: number;
  tail?: 'bottom-left' | 'bottom-right' | 'left' | 'right';
  tailAt?: number;
  glow?: number;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  const border = alpha(t.fg, 0.85);
  const bg = C.ink850;
  const B = 3;
  const TW = 40;
  const TH = 30;
  const vertical = tail === 'bottom-left' || tail === 'bottom-right';
  // The tail overlaps the bubble's border by B px, so its fill hides that stretch of border.
  const box: CSSProperties = vertical
    ? { top: `calc(100% - ${B}px)`, [tail === 'bottom-left' ? 'left' : 'right']: tailAt, width: TW, height: TH + B }
    : { top: tailAt, [tail === 'left' ? 'right' : 'left']: `calc(100% - ${B}px)`, width: TH + B, height: TW };
  const d =
    tail === 'bottom-left'
      ? `M 0 0 L 4 ${TH + B} L ${TW} 0`
      : tail === 'bottom-right'
        ? `M 0 0 L ${TW - 4} ${TH + B} L ${TW} 0`
        : tail === 'left'
          ? `M ${TH + B} 0 L 0 6 L ${TH + B} ${TW}`
          : `M 0 0 L ${TH + B} 6 L 0 ${TW}`;
  const vb = vertical ? `0 0 ${TW} ${TH + B}` : `0 0 ${TH + B} ${TW}`;
  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <div
        style={{
          padding: `${Math.round(size * 0.36)}px ${Math.round(size * 0.62)}px`,
          borderRadius: RADIUS.lg,
          border: `${B}px solid ${border}`,
          background: bg,
          boxShadow: glow > 0.01 ? `0 0 ${Math.round(36 * glow)}px ${alpha(t.fg, 0.35 * glow)}` : `0 20px 40px ${alpha('#000000', 0.35)}`,
          fontFamily: FONT.sans,
          fontSize: size,
          fontWeight: 800,
          letterSpacing: -0.5,
          lineHeight: 1.1,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </div>
      <svg viewBox={vb} style={{ position: 'absolute', ...box, overflow: 'visible' }}>
        <path d={d} fill={bg} stroke={border} strokeWidth={B} strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The on-call phone and the paper copy of the list
// ---------------------------------------------------------------------------

/**
 * The on-call phone («móvil de guardia»): a handset whose screen shows the
 * contact list (`list` 0–1) and rings (`ring` 0–1: waves on both sides).
 * 120×200 design units scaled to `width`.
 */
export function Phone({ width = 120, list = 1, ring = 0, tone = 'emerald', frame: frameProp }: { width?: number; list?: number; ring?: number; tone?: Tone; frame?: number }) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const t = toneOf(tone);
  const s = width / 120;
  const sec = frame / fps;
  const waves = [0, 0.5].map((k) => ((sec * 0.9 + k) % 1 + 1) % 1);
  return (
    <svg width={width} height={200 * s} viewBox="0 0 120 200" style={{ display: 'block', overflow: 'visible' }}>
      {ring > 0.01
        ? waves.map((ph, i) => {
            const o = (1 - ph) * clamp01(ring);
            const r = 70 + 26 * ph;
            const arc = (a0: number, a1: number) => {
              const rad = (d: number) => (d * Math.PI) / 180;
              return `M ${60 + r * Math.cos(rad(a0))} ${100 + r * Math.sin(rad(a0))} A ${r} ${r} 0 0 1 ${60 + r * Math.cos(rad(a1))} ${100 + r * Math.sin(rad(a1))}`;
            };
            return (
              <g key={i} opacity={o} stroke={t.fg} strokeWidth={5} strokeLinecap="round" fill="none">
                <path d={arc(-30, 30)} />
                <path d={arc(150, 210)} />
              </g>
            );
          })
        : null}
      <rect x={10} y={4} width={100} height={192} rx={18} fill={C.ink800} stroke={alpha(t.fg, 0.85)} strokeWidth={5} />
      <rect x={20} y={24} width={80} height={144} rx={6} fill={C.ink950} />
      <rect x={48} y={12} width={24} height={5} rx={2.5} fill={C.ink600} />
      <circle cx={60} cy={182} r={6} fill={C.ink600} />
      <g opacity={clamp01(list)}>
        <rect x={28} y={34} width={64} height={10} rx={3} fill={alpha(t.fg, 0.8)} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <circle cx={34} cy={62 + i * 18} r={4.5} fill={alpha(t.fg, 0.6)} />
            <line x1={44} x2={i % 2 ? 78 : 88} y1={62 + i * 18} y2={62 + i * 18} stroke={alpha(C.text, 0.75)} strokeWidth={4} strokeLinecap="round" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** A paper sheet with the list (title bar + lines), 150×190 design units scaled to `width`. */
export function PaperList({ width = 150, tone = 'emerald', dark = 0 }: { width?: number; tone?: Tone; dark?: number }) {
  const t = toneOf(tone);
  const s = width / 150;
  const d = clamp01(dark);
  return (
    <svg width={width} height={190 * s} viewBox="0 0 150 190" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M 8 6 L 116 6 L 142 32 L 142 184 L 8 184 Z" fill={d > 0.5 ? C.ink700 : '#eef6f1'} stroke={alpha(t.fg, 0.9 - 0.5 * d)} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 116 6 L 116 32 L 142 32" fill="none" stroke={alpha(t.fg, 0.9 - 0.5 * d)} strokeWidth={4} strokeLinejoin="round" />
      <rect x={22} y={22} width={78} height={12} rx={3} fill={alpha(t.deep, 0.85 - 0.4 * d)} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle cx={28} cy={58 + i * 21} r={5} fill={alpha(t.deep, 0.7 - 0.35 * d)} />
          <line x1={40} x2={i % 2 ? 108 : 124} y1={58 + i * 21} y2={58 + i * 21} stroke={alpha(C.ink700, 0.8 - 0.4 * d)} strokeWidth={5} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Bell with a slash: «no ha saltado ninguna alarma»
// ---------------------------------------------------------------------------

export function BellOff({ size = 80, color = C.amber, slash = 1 }: { size?: number; color?: string; slash?: number }) {
  const k = clamp01(slash);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <Icon name="bell" size={size} color={color} strokeWidth={2} />
      {k > 0 ? (
        <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d="M 3.5 3.5 L 20.5 20.5" stroke={C.ink950} strokeWidth={4.6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
          <path d="M 3.5 3.5 L 20.5 20.5" stroke={C.textStrong} strokeWidth={2.2} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
        </svg>
      ) : null}
    </div>
  );
}
