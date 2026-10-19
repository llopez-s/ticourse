import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { tone as toneOf, type Tone } from '../../../../engine/src/ui/tone';

/** Square badge with the ficha's letter (A–E). */
export function LetterTile({ letter, tone, size = 68 }: { letter: string; tone: Tone; size?: number }) {
  const t = toneOf(tone);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.24),
        display: 'grid',
        placeItems: 'center',
        background: alpha(t.fg, 0.16),
        border: `2px solid ${alpha(t.fg, 0.85)}`,
        fontFamily: FONT.mono,
        fontSize: Math.round(size * 0.58),
        fontWeight: 800,
        color: t.soft,
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

/** A candidate ficha: letter tile + title + optional sub line. `lit` (0–1) glows it, `dim` steps it back. */
export function Ficha({
  letter,
  tone,
  title,
  sub,
  w,
  h,
  lit = 0,
  dim = 0,
  titleSize = 36,
  subSize = 28,
  tile = 68,
  style,
}: {
  letter: string;
  tone: Tone;
  title: string;
  sub?: string;
  w?: number;
  h?: number;
  lit?: number;
  dim?: number;
  titleSize?: number;
  subSize?: number;
  tile?: number;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: w,
        height: h,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '12px 22px 12px 16px',
        borderRadius: RADIUS.md,
        background: lit > 0 ? alpha(t.fg, 0.1) : C.ink850,
        border: `2px solid ${alpha(t.fg, 0.4 + 0.5 * lit)}`,
        boxShadow: lit > 0 ? `0 0 ${18 + lit * 28}px ${alpha(t.fg, 0.28 * lit)}` : 'none',
        opacity: 1 - 0.55 * dim,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <LetterTile letter={letter} tone={tone} size={tile} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: titleSize, fontWeight: 800, color: C.textStrong, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{title}</div>
        {sub ? <div style={{ marginTop: 3, fontSize: subSize, fontWeight: 560, color: t.soft, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{sub}</div> : null}
      </div>
    </div>
  );
}
