import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, Panel, Redacted, clamp01, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * Pieces shared by this video's scenes and poster: the BORROWED VOICE
 * insignia (a quoted voice, never a portrait), the generic waves logo, the
 * assistant's chat window, the third party's document with its hidden
 * (padlocked, illegible) order, a folder and an approving hand. Every text
 * the voice could «read» is a gray bar: nothing legible is injected, nothing
 * is executable. They never read the timeline: pass Sequence-relative
 * frames or 0–1 weights.
 */

// ---------------------------------------------------------------------------
// Text fitting (copied from ir-halden-pruebas' Bits — never imported across videos)
// ---------------------------------------------------------------------------

/** Approximate width of `text` in em for the sans font. */
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
// BORROWED VOICE: a voice in italics between rose guillemets
// ---------------------------------------------------------------------------

/**
 * The adversary's glyph: two rose guillemets around a slanted («italic»)
 * sound wave — someone else's voice, quoted. No face, no figure, no gender.
 */
export function QuotedVoice({ size = 64, glow = 0 }: { size?: number; glow?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      {/* « and » */}
      <path d="M11 15 L4 24 L11 33 M17 15 L10 24 L17 33" stroke={C.rose} strokeWidth={3.4} />
      <path d="M31 15 L38 24 L31 33 M37 15 L44 24 L37 33" stroke={C.rose} strokeWidth={3.4} />
      {/* the borrowed voice: a wave, slanted like italics */}
      <g transform="skewX(-14) translate(6 0)" stroke={C.roseSoft} strokeWidth={2.8} opacity={0.75 + 0.25 * clamp01(glow)}>
        <path d="M18 24 v0" />
        <path d="M21 20 v8" />
        <path d="M24 16 v16" />
        <path d="M27 20 v8" />
        <path d="M30 23 v2" />
      </g>
    </svg>
  );
}

/**
 * BORROWED VOICE's insignia: the glyph in a round badge, the name in mono and
 * one line under it. Rose, the adversary's colour. Width follows its content;
 * it never positions itself.
 */
export function VoiceTag({ name, line, glow = 0, scale = 1 }: { name: string; line: string; glow?: number; scale?: number }) {
  const s = scale;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 24 * s,
        padding: `${18 * s}px ${34 * s}px ${18 * s}px ${22 * s}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.roseDeep, 0.9)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 0 ${Math.round(26 + 22 * glow)}px ${alpha(C.rose, 0.2 + 0.2 * glow)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 96 * s,
          height: 96 * s,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${alpha(C.rose, 0.8)}`,
          background: alpha(C.roseDeep, 0.85),
        }}
      >
        <QuotedVoice size={64 * s} glow={glow} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 * s }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 42 * s, fontWeight: 800, letterSpacing: 1, color: C.roseSoft }}>{name}</span>
        <span style={{ fontSize: 36 * s, fontWeight: 650, fontStyle: 'italic', color: C.text }}>{line}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The generic waves logo (no real brand)
// ---------------------------------------------------------------------------

export function WaveLogo({ size = 40, color = C.cyan }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" style={{ display: 'block' }} aria-hidden>
      <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" opacity={0.75} />
      <path d="M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0" opacity={0.5} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Gray text: lines of bars, never letters
// ---------------------------------------------------------------------------

export function GrayLines({ widths, height = 18, gap = 14, tone = 'muted', strength = 0.55, sweep = 1 }: { widths: readonly number[]; height?: number; gap?: number; tone?: Tone; strength?: number; sweep?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {widths.map((w, i) => (
        <Redacted key={i} width={w} height={height} tone={tone} strength={strength} sweep={clamp01(sweep * widths.length - i)} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The assistant's chat window: header with the waves logo, two bubbles of bars
// ---------------------------------------------------------------------------

export function ChatWindow({
  width,
  height,
  title,
  ask = 1,
  answer = 1,
  glow = 0,
}: {
  width: number;
  height: number;
  title: string;
  /** 0–1: the person's bubble (right). */
  ask?: number;
  /** 0–1: the assistant's bubble (left). */
  answer?: number;
  glow?: number;
}) {
  const bubble = (p: number, side: 'left' | 'right', widths: number[], toneName: Tone): ReactNode => {
    if (p <= 0.001) return null;
    const t = toneOf(toneName);
    return (
      <div style={{ display: 'flex', justifyContent: side === 'right' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 14, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - clamp01(p)) * 14}px)` }}>
        {side === 'left' ? (
          <div style={{ width: 54, height: 54, borderRadius: 27, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.14), border: `2px solid ${alpha(C.cyan, 0.6)}` }}>
            <WaveLogo size={32} />
          </div>
        ) : null}
        <div
          style={{
            padding: '18px 22px',
            borderRadius: RADIUS.md,
            borderTopLeftRadius: side === 'left' ? 4 : RADIUS.md,
            borderTopRightRadius: side === 'right' ? 4 : RADIUS.md,
            background: alpha(t.fg, 0.1),
            border: `2px solid ${alpha(t.fg, 0.45)}`,
          }}
        >
          <GrayLines widths={widths} height={16} gap={12} sweep={p} />
        </div>
      </div>
    );
  };
  return (
    <Panel title={title} icon="app" accent="cyan" glow={glow} right={<WaveLogo size={34} />} style={{ width, height }}>
      <div style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {bubble(ask, 'right', [Math.round(width * 0.38), Math.round(width * 0.26)], 'sky')}
        {bubble(answer, 'left', [Math.round(width * 0.5), Math.round(width * 0.44), Math.round(width * 0.3)], 'cyan')}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// The third party's document, with the hidden order as a padlocked gray bar
// ---------------------------------------------------------------------------

/**
 * A paper sheet: title strip (a label, not content), gray lines, and — at
 * `hidden` (0–1) — the hidden paragraph: a tiny striped bar under a padlock,
 * illegible on purpose. `alarm` (0–1) tints it rose; `out` lifts it toward
 * the model (stream effect handled by the caller).
 */
export function DocSheet({ width, title, hidden = 0, alarm = 0, label, style }: { width: number; title: string; hidden?: number; alarm?: number; label?: string; style?: CSSProperties }) {
  const h = Math.round(width * 1.18);
  const lines = [0.78, 0.84, 0.7, 0.8, 0.62];
  const lines2 = [0.82, 0.74];
  const inner = width - 64;
  const a = clamp01(alarm);
  const hp = clamp01(hidden);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
        border: `2px solid ${a > 0.01 ? alpha(C.rose, 0.3 + 0.5 * a) : C.ink600}`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}${a > 0.01 ? `, 0 0 ${Math.round(40 * a)}px ${alpha(C.rose, 0.3 * a)}` : ''}`,
        padding: '26px 32px',
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      {/* folded corner */}
      <div style={{ position: 'absolute', right: -2, top: -2, width: 44, height: 44, background: `linear-gradient(225deg, ${C.ink950} 50%, ${C.ink600} 50%)`, borderTopRightRadius: RADIUS.md }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={36} color={C.amber} />
        <span style={{ fontSize: fitSize(title, 34, inner - 50), fontWeight: 800, color: C.textStrong }}>{title}</span>
      </div>
      <div style={{ marginTop: 26 }}>
        <GrayLines widths={lines.map((k) => Math.round(inner * k))} height={18} gap={16} />
      </div>
      {/* the hidden paragraph: tiny, padlocked, illegible */}
      <div style={{ position: 'relative', marginTop: 26, height: 64, opacity: hp, transform: `scale(${0.9 + 0.1 * hp})`, transformOrigin: 'left center' }}>
        <div style={{ position: 'absolute', left: 0, top: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Redacted width={Math.round(inner * 0.86)} height={8} tone={a > 0.3 ? 'rose' : 'muted'} strength={0.5 + 0.3 * a} glow={a} />
          <Redacted width={Math.round(inner * 0.6)} height={8} tone={a > 0.3 ? 'rose' : 'muted'} strength={0.5 + 0.3 * a} glow={a} />
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 64,
            height: 64,
            borderRadius: 32,
            display: 'grid',
            placeItems: 'center',
            background: a > 0.3 ? C.rose : C.ink700,
            border: `3px solid ${alpha(a > 0.3 ? C.roseSoft : C.muted, 0.8)}`,
            boxShadow: a > 0.01 ? `0 0 ${Math.round(26 * a)}px ${alpha(C.rose, 0.5 * a)}` : undefined,
          }}
        >
          <Icon name="lock" size={36} color={a > 0.3 ? C.ink950 : C.text} strokeWidth={2.4} />
        </div>
        {label ? (
          <div style={{ position: 'absolute', left: 0, top: -14, fontSize: 24, fontWeight: 750, letterSpacing: 1, color: a > 0.3 ? C.roseSoft : C.muted, whiteSpace: 'nowrap' }}>{label}</div>
        ) : null}
      </div>
      <div style={{ marginTop: 24 }}>
        <GrayLines widths={lines2.map((k) => Math.round(inner * k))} height={18} gap={16} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Folder and approving hand (not in the engine's icon set)
// ---------------------------------------------------------------------------

export function Folder({ size = 160, color = C.cyan, glow = 0 }: { size?: number; color?: string; glow?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 60 48" fill="none" strokeLinejoin="round" style={{ display: 'block', overflow: 'visible', filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(16 * glow)}px ${alpha(color, 0.6 * glow)})` : undefined }} aria-hidden>
      <path d="M4 10 a3 3 0 0 1 3-3 h14 l5 5 h27 a3 3 0 0 1 3 3 v26 a3 3 0 0 1-3 3 H7 a3 3 0 0 1-3-3 Z" fill={alpha(color, 0.14)} stroke={color} strokeWidth={2.4} />
      <path d="M4 18 h52" stroke={color} strokeWidth={2} opacity={0.6} />
      {[24, 30, 36].map((y, i) => (
        <line key={y} x1={12} x2={i === 1 ? 38 : 46} y1={y} y2={y} stroke={alpha(C.text, 0.45)} strokeWidth={2.6} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** A thumbs-up hand: «una persona aprueba». */
export function ApproveHand({ size = 80, color = C.emerald }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }} aria-hidden>
      <path d="M7 11v9H4v-9h3Z" />
      <path d="M7 11l3.6-6.6c1.5 0 2.6 1.1 2.3 2.7L12.4 10H18a2 2 0 0 1 2 2.3l-1.1 5.9a2.2 2.2 0 0 1-2.2 1.8H7" />
    </svg>
  );
}
