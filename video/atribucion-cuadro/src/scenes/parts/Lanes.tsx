import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { CONFIDENCE_WORD, type LevelDef } from '../../data/levels';

/**
 * The three bands of the canvas, continued to the right of the painting as three lanes (s02, s03): each
 * lane is the same height as its band and carries the level's question, name and realistic confidence.
 * Nothing here is a step or a ladder: three strips of one canvas.
 *
 *   <Lane x y w h tone show lit dark>…</Lane>   a tinted strip (absolute, stage px) with hairlines that
 *                                               continue the band's edges; `lit` 0–1 brightens the tint,
 *                                               `dark` 0–1 leaves it in the dark; children are positioned
 *                                               inside it
 *   <LevelHead level tone q name sub conf … />  the level's text block: question, name, and a third line
 *                                               that is either `sub` or the confidence (they cross-fade)
 *   <Confidence level size show />              «confianza» + three pips + the word (and its caveat)
 */
export function Lane({ x, y, w, h, tone, show = 1, lit = 0, dark = 0, children, style }: { x: number; y: number; w: number; h: number; tone: string; show?: number; lit?: number; dark?: number; children?: ReactNode; style?: CSSProperties }) {
  if (show <= 0.001) return null;
  const edge = alpha('#f8fafc', 0.3 * (1 - 0.6 * dark));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderTop: `2px solid ${edge}`,
        borderBottom: `2px solid ${edge}`,
        background: `linear-gradient(90deg, ${alpha(tone, (0.07 + 0.15 * lit) * (1 - dark))} 0%, ${alpha(tone, (0.03 + 0.06 * lit) * (1 - dark))} 55%, ${alpha(tone, 0)} 100%)`,
        opacity: show,
        clipPath: `inset(0 ${Math.round((1 - show) * 100)}% 0 0)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** «confianza ●●○ moderada»; the caveat (band 3) goes on its own line, sky: sources beyond your network. */
export function Confidence({ level, size = 28, show = 1, style }: { level: LevelDef; size?: number; show?: number; style?: CSSProperties }) {
  if (show <= 0.001) return null;
  const pip = Math.round(size * 0.46);
  return (
    <div style={{ fontFamily: FONT.sans, opacity: show, whiteSpace: 'nowrap', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.4), fontSize: size, lineHeight: 1.2 }}>
        <span style={{ fontWeight: 650, color: C.muted }}>{CONFIDENCE_WORD}</span>
        <span style={{ display: 'inline-flex', gap: Math.round(pip * 0.36) }}>
          {[0, 1, 2].map((k) => (
            <span key={k} style={{ width: pip, height: pip, borderRadius: pip / 2, boxSizing: 'border-box', background: k < level.pips ? C.emerald : 'transparent', border: `2px solid ${k < level.pips ? C.emerald : C.faint}` }} />
          ))}
        </span>
        <span style={{ fontWeight: 850, color: C.textStrong }}>
          {level.confidence}
          {level.caveat ? ',' : ''}
        </span>
      </div>
      {level.caveat ? <div style={{ fontSize: Math.round(size * 0.93), fontWeight: 750, lineHeight: 1.15, color: '#7dd3fc' }}>{level.caveat.replace(/^,\s*/, '')}</div> : null}
    </div>
  );
}

export type LevelHeadProps = {
  level: LevelDef;
  tone: string;
  /** 0–1 each: the question, the name, the «what it answers» line, the confidence (replaces `sub`). */
  q?: number;
  name?: number;
  sub?: number;
  conf?: number;
  /** 0–1: the name glows (the voice is naming the level). */
  nameGlow?: number;
  /** px sizes of the question, the name and the third line. */
  sizes?: { q: number; name: number; line: number };
  /** Violet for exam terms (SPONSOR); otherwise the lane's tone. */
  exam?: boolean;
  style?: CSSProperties;
};

export function LevelHead({ level, tone, q = 1, name = 1, sub = 0, conf = 0, nameGlow = 0, sizes = { q: 36, name: 34, line: 28 }, exam = false, style }: LevelHeadProps) {
  const ink = exam ? '#c4b5fd' : tone;
  return (
    <div style={{ fontFamily: FONT.sans, whiteSpace: 'nowrap', ...style }}>
      {q > 0.001 ? <div style={{ fontSize: sizes.q, fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.4, color: C.textStrong, opacity: q, transform: `translateX(${(1 - q) * -14}px)` }}>{level.question}</div> : null}
      <div style={{ fontSize: sizes.name, fontWeight: 900, lineHeight: 1.14, letterSpacing: 0.6, color: ink, opacity: name, textShadow: nameGlow > 0.02 ? `0 0 ${Math.round(20 * nameGlow)}px ${alpha(ink, 0.7 * nameGlow)}` : undefined }}>{level.name}</div>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: sizes.line + 4, fontWeight: 700, lineHeight: 1.18, color: C.text, opacity: sub * (1 - conf) }}>{level.sub}</div>
        <Confidence level={level} size={sizes.line} show={conf} style={{ position: 'absolute', left: 0, top: 1 }} />
      </div>
    </div>
  );
}
