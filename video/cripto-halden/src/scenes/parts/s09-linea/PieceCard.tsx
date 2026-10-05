import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, dimStyle, tone as toneOf, type Tone } from '../../../../../engine/src/ui';
import type { PieceCard as PieceCardData } from '../../../data/s09-linea';

export const CARD = { width: 417, height: 360, imageH: 104 } as const;

/** Words of the tag in capitals are exam terms: violet. */
function Tag({ text, glow, color }: { text: string; glow: number; color: string }) {
  const g = clamp01(glow);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 46,
        padding: '0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(g > 0.01 ? color : C.ink500, 0.6 + 0.35 * g)}`,
        background: alpha(g > 0.01 ? color : C.ink800, g > 0.01 ? 0.08 + 0.14 * g : 0.9),
        boxShadow: g > 0.02 ? `0 0 ${Math.round(24 * g)}px ${alpha(color, 0.35 * g)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 30,
        fontWeight: 750,
        color: C.text,
        whiteSpace: 'nowrap',
      }}
    >
      {/* One inline run (not flex items), so the spaces around «·» survive. */}
      <span style={{ whiteSpace: 'pre' }}>
        {text.split(' ').map((w, k) => (
          <span key={k}>
            {k ? ' ' : ''}
            <span style={/^[A-Z]{2,}$/.test(w) ? { color: '#c4b5fd', fontWeight: 850 } : undefined}>{w}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * One piece's card under the line (s09): its image, what it does (the voice's
 * words), what the shipping company gets out of it (emerald) and its family
 * tag. Not positioned; CARD.width × CARD.height.
 */
export function PieceCard({
  card,
  tone,
  image,
  show,
  hot,
  dim,
  tagGlow,
  outcome = 1,
}: {
  card: PieceCardData;
  tone: Tone;
  image: ReactNode;
  /** 0–1: the card springs in. */
  show: number;
  /** 0–1: in focus (border glow). */
  hot: number;
  /** 0–1: steps back. */
  dim: number;
  /** 0–1: the family tag glows (the HYBRID beat). */
  tagGlow: number;
  /** 0–1: the emerald outcome lines. */
  outcome?: number;
}) {
  const t = toneOf(tone);
  const p = clamp01(show);
  if (p <= 0) return null;
  const h = clamp01(hot);
  const familyColor = card.family === 'sym' ? t.fg : C.cyan;
  return (
    <div
      style={{
        position: 'relative',
        width: CARD.width,
        height: CARD.height,
        boxSizing: 'border-box',
        padding: '16px 18px 18px',
        borderRadius: RADIUS.lg,
        border: `${h > 0.3 ? 3 : 2}px solid ${alpha(t.fg, 0.32 + 0.58 * h)}`,
        background: `linear-gradient(180deg, ${alpha(t.fg, 0.05 + 0.08 * h)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
        boxShadow: h > 0.02 ? `0 0 ${Math.round(36 * h)}px ${alpha(t.fg, 0.26 * h)}` : `0 18px 44px ${alpha('#000000', 0.32)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: FONT.sans,
        ...dimStyle(dim, Math.min(1, p * 1.3)),
        transform: `translateY(${(1 - Math.min(1, p)) * 22}px) scale(${0.96 + 0.04 * Math.min(1, p)})`,
      }}
    >
      <div style={{ height: CARD.imageH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{image}</div>
      <div style={{ marginTop: 10, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
        {card.lines.map((l, i) => (
          <div key={l} style={{ fontSize: i === 0 ? 34 : 32, fontWeight: i === 0 ? 800 : 700, color: i === 0 ? C.textStrong : C.text }}>
            {l}
          </div>
        ))}
        {card.outcome
          ? card.outcome.map((l) => (
              <div key={l} style={{ fontSize: 32, fontWeight: 800, color: '#6ee7b7', opacity: clamp01(outcome) }}>
                {l}
              </div>
            ))
          : null}
      </div>
      <div style={{ flex: 1 }} />
      <Tag text={card.tag} glow={tagGlow} color={familyColor} />
    </div>
  );
}
