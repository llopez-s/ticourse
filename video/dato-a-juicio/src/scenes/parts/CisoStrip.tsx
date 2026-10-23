import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/**
 * The CISO's strip (copied from V23's card): an avatar, «CISO · responsable de seguridad» and his question.
 * He asks; he does not decide and nobody looks bad for asking — no verdict colour, no warning mark: cyan,
 * the defender's side.
 *
 * <CisoStrip width question … /> — a normal-flow box `width` px wide (its height follows the text); wrap it
 * in a positioned div. Props (numbers 0–1 unless said otherwise):
 *   question            the question, one string per line (CISO_QUESTION is this video's)
 *   questionShow = 1    a number for all lines or one per line (each line fades and slides in)
 *   questionSize = 50   px of the question
 *   layout = 'card'     'card': avatar + who on top, the question under them (s01)
 *                       'strip': one row — avatar, who, a divider, the question on a single line (s05); the
 *                       question shrinks to fit: a full-stage strip (1728) holds this video's at ≈ 36 px,
 *                       1500 px only ≈ 27 px — prefer 'card' when it has to be narrow
 *   who = CISO_WHO      the role line («CISO · responsable de seguridad»; CISO in violet, an exam term)
 *   sub?, subShow = 1   an optional line under the question (cyan-soft)
 *   show = 1            the whole box · glow = 0 a cyan halo · dim = 0 steps it back · style? extra CSS
 */
export const CISO_WHO = { term: 'CISO', role: 'responsable de seguridad' } as const;
/** Canon (storyboard s01, exact). */
export const CISO_QUESTION = ['¿qué sabemos de esto?'] as const;

export type CisoStripProps = {
  width: number;
  question: readonly string[];
  questionShow?: number | readonly number[];
  questionSize?: number;
  layout?: 'card' | 'strip';
  who?: { term: string; role: string };
  sub?: string;
  subShow?: number;
  show?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
};

export function CisoStrip({ width, question, questionShow = 1, questionSize = 50, layout = 'card', who = CISO_WHO, sub, subShow = 1, show = 1, glow = 0, dim = 0, style }: CisoStripProps) {
  if (show <= 0.001) return null;
  const strip = layout === 'strip';
  const avatar = strip ? 68 : 88;
  const whoSize = strip ? 32 : 34;
  const lineShow = (i: number) => (typeof questionShow === 'number' ? questionShow : (questionShow[i] ?? 1));
  // On one row the question shrinks to what is left beside the role line (estimated from the text lengths).
  const room = width - 48 - (avatar + 16 + whoSize * 0.6 * (who.term.length + who.role.length + 3)) - 58;
  const qSize = strip ? Math.min(questionSize, Math.floor(room / (0.55 * question.join(' ').length))) : questionSize;
  const head = (
    <div style={{ display: 'flex', alignItems: 'center', gap: strip ? 16 : 20, flexShrink: 0 }}>
      <div style={{ width: avatar, height: avatar, borderRadius: avatar / 2, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.7)}` }}>
        <Icon name="user" size={Math.round(avatar * 0.58)} color={C.cyan} strokeWidth={2} />
      </div>
      <span style={{ fontSize: whoSize, fontWeight: 800, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
        <span style={{ color: '#c4b5fd', letterSpacing: 3 }}>{who.term}</span>
        <span style={{ color: C.faint }}> · </span>
        <span style={{ color: C.cyanSoft }}>{who.role}</span>
      </span>
    </div>
  );
  const lines = (strip ? [question.join(' ')] : [...question]).map((line, i) => {
    const p = strip ? Math.max(...question.map((_, k) => lineShow(k))) : lineShow(i);
    return (
      <div key={line} style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)`, whiteSpace: 'nowrap' }}>
        {line}
      </div>
    );
  });
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: strip ? 'row' : 'column',
        alignItems: strip ? 'center' : 'flex-start',
        gap: strip ? 26 : 22,
        padding: strip ? '14px 30px 14px 18px' : '30px 38px 34px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.5 + 0.4 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 60%), ${C.ink900}`,
        boxShadow: `0 0 ${Math.round(36 * glow)}px ${alpha(C.cyan, 0.32 * glow)}, 0 20px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        opacity: show * (1 - 0.6 * dim),
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        ...style,
      }}
    >
      {head}
      {strip ? <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: alpha(C.cyan, 0.35), flexShrink: 0 }} /> : null}
      <div style={{ fontSize: qSize, fontWeight: 850, letterSpacing: -0.6, lineHeight: 1.14, color: C.textStrong }}>
        {lines}
        {sub ? <div style={{ marginTop: 10, fontSize: Math.round(qSize * 0.66), fontWeight: 700, letterSpacing: 0, color: C.cyanSoft, opacity: subShow }}>{sub}</div> : null}
      </div>
    </div>
  );
}
