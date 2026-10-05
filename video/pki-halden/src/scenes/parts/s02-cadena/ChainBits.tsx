import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';
import { mixColour } from './SslConsole';

/**
 * Small pieces around the anchor chain, shared by s02 and s03: the violet exam term, the tag beside a link
 * (exam term above, the owner's line on the link's height, a line under it), the leader from a link to its tag,
 * and the two option cards of s02 that become the think prompt's buttons. Not positioned; 0–1 states.
 */

/** The violet exam name: mortarboard + term. */
export function TermLabel({ term, size = 36, show = 1, style }: { term: string; size?: number; show?: number; style?: CSSProperties }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 850,
        letterSpacing: 0.5,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * 8}px)`,
        textShadow: `0 0 18px ${alpha(C.violet, 0.45 * s)}`,
        ...style,
      }}
    >
      <Icon name="mortarboard" size={Math.round(size * 0.95)} color={C.violet} />
      {term}
    </span>
  );
}

/**
 * A link's tag, laid out around a fixed line: `main` sits centred on the link's height (`y` of the wrapper is
 * that line's centre), `term` above it and `sub` below. Each part fades in on its own 0–1.
 */
export function ChainTag({
  main,
  mainShow = 1,
  term,
  termShow = 0,
  sub,
  subShow = 0,
  mainSize = 38,
  subSize = 32,
  glow = 0,
  glowTone = C.amber,
}: {
  main?: ReactNode;
  mainShow?: number;
  term?: string;
  termShow?: number;
  sub?: ReactNode;
  subShow?: number;
  mainSize?: number;
  subSize?: number;
  glow?: number;
  glowTone?: string;
}) {
  const ms = clamp01(mainShow);
  const ts = clamp01(termShow);
  const ss = clamp01(subShow);
  const g = clamp01(glow);
  return (
    <div style={{ position: 'relative', fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      {term && ts > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, bottom: mainSize * 0.62 + 6 }}>
          <TermLabel term={term} size={34} show={ts} />
        </div>
      ) : null}
      {main && ms > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -mainSize * 0.62,
            height: mainSize * 1.24,
            display: 'flex',
            alignItems: 'center',
            fontSize: mainSize,
            fontWeight: 800,
            opacity: ms,
            transform: `translateX(${(1 - ms) * 14}px)`,
            textShadow: g > 0.01 ? `0 0 ${Math.round(20 * g)}px ${alpha(glowTone, 0.8 * g)}` : undefined,
          }}
        >
          {main}
        </div>
      ) : null}
      {sub && ss > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: mainSize * 0.62 + 4,
            fontSize: subSize,
            fontWeight: 700,
            color: C.text,
            opacity: ss,
            transform: `translateY(${(1 - ss) * -6}px)`,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}

/** A leader line from a link's edge to its tag (stage coordinates; draw inside a full-stage SVG). */
export function Leader({ x1, x2, y, tone, p, dashed = false }: { x1: number; x2: number; y: number; tone: string; p: number; dashed?: boolean }) {
  const k = clamp01(p);
  if (k <= 0.001) return null;
  return (
    <g opacity={k}>
      <line x1={x1} y1={y} x2={mix(x1, x2, k)} y2={y} stroke={alpha(tone, 0.85)} strokeWidth={3} strokeDasharray={dashed ? '8 7' : undefined} strokeLinecap="round" />
      <circle cx={x1} cy={y} r={5} fill={tone} />
    </g>
  );
}

/**
 * One of s02's two options: first a plain card («ficha sin dibujo») with the word, then (`button` 1) the think
 * prompt's pill button. `glow` = both glow alike while the question is open; `chosen` 1 = the answer (emerald),
 * −1 = the other one steps back.
 */
export function OptionCard({ label, show, button = 0, glow = 0, chosen = 0, size = 44 }: { label: string; show: number; button?: number; glow?: number; chosen?: number; size?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const b = clamp01(button);
  const yes = clamp01(chosen);
  const no = clamp01(-chosen);
  const g = clamp01(glow) * (1 - yes) * (1 - no);
  const edge = yes > 0.01 ? mixColour('#94a3b8', C.emerald, yes) : '#94a3b8';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: Math.round(size * 1.75),
        padding: `0 ${Math.round(mix(size * 0.75, size * 0.9, b))}px`,
        boxSizing: 'border-box',
        borderRadius: mix(14, size, b),
        border: `3px solid ${alpha(edge, 0.55 + 0.4 * Math.max(g, yes))}`,
        background: yes > 0.01 ? `linear-gradient(180deg, ${alpha(C.emerald, 0.22 * yes)} 0%, ${C.ink900} 100%)` : `linear-gradient(180deg, ${alpha(C.ink700, 0.9)} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 0 ${Math.round(8 + 26 * Math.max(g, yes))}px ${alpha(yes > 0.01 ? C.emerald : '#e2e8f0', 0.08 + 0.3 * Math.max(g, yes))}, 0 14px 30px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: yes > 0.5 ? '#d1fae5' : C.textStrong,
        whiteSpace: 'nowrap',
        opacity: s * (1 - 0.6 * no),
        filter: no > 0.01 ? `saturate(${1 - 0.5 * no})` : undefined,
        transform: `translateY(${(1 - s) * 14}px) scale(${1 + 0.06 * yes - 0.04 * no})`,
      }}
    >
      {label}
    </div>
  );
}


