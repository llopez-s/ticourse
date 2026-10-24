import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { QUESTION_TAG } from '../../data/canon';

/**
 * Shared by the three question scenes (s03, s05, s07). The engine's ExamQuestionLayer is an overlay above every scene:
 * it darkens the stage and centres its panel over it from the question segment to the end of the scene (its bottom edge
 * lands at ≈ y 830 of the frame). So the scene keeps a still, dim, textless background, and everything it must add
 * lives in the band under the stage: «pregunta tipo examen · ejemplo» at the bottom right (the panel only prints
 * «EXAMEN · SY0-701 · 5.6», registry contradiction 17) and one centred resolution line under it. Same pattern as
 * V30, V45, V47 and V50.
 */

/** Stage-local tops: the label just under the stage's bottom edge, the slot under the label. */
export const QUESTION_TAG_TOP = 668;
export const SLOT_TOP = 722;

/** «pregunta tipo examen · ejemplo», bottom right. Bright text on a solid pill so it reads through the dim. */
export function QuestionTag({ stageW = 1728 }: { stageW?: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: QUESTION_TAG_TOP, width: stageW, display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          height: 40,
          padding: '0 26px 0 18px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.violet, 0.9)}`,
          background: C.ink900,
          fontFamily: FONT.sans,
          fontSize: 28,
          fontWeight: 800,
          color: '#ffffff',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="mortarboard" size={28} color={C.violet} />
        {QUESTION_TAG}
      </div>
    </div>
  );
}

/** The still background (children at full stage size, dim) plus the label. `dim` 0–1 eases the background down. */
export function QuestionFrame({ children, dim = 1 }: { children: ReactNode; dim?: number }) {
  const d = clamp01(dim);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.3 * d, filter: `saturate(${1 - 0.25 * d})` }}>{children}</div>
      <QuestionTag />
    </>
  );
}

/** One centred line in the resolution slot: `children` in a row, faded by `opacity` (0–1). */
export function SlotLine({ children, opacity = 1, dy = 0, stageW = 1728, gap = 22 }: { children: ReactNode; opacity?: number; dy?: number; stageW?: number; gap?: number }) {
  const o = clamp01(opacity);
  if (o <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: SLOT_TOP, width: stageW, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${dy}px)` }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

/** The resolution text, white, with room for highlighted spans. */
export function SlotText({ children, size = 40 }: { children: ReactNode; size?: number }) {
  return <div style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>{children}</div>;
}
