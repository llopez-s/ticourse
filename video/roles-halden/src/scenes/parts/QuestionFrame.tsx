import type { ReactNode } from 'react';
import { clamp01 } from '../../../../engine/src/ui';
import { C, FONT } from '../../../../engine/src/theme/tokens';
import { QuestionTag, SLOT_TOP } from './Tags';

/**
 * Frame shared by the three question scenes (s03, s05, s07). The engine's ExamQuestionLayer is an overlay above every
 * scene: it darkens the stage and centres its panel over it from the question segment to the end of the scene (its
 * bottom edge lands at ≈ y 830 of the frame). So the scene keeps a still, dim, textless background, and everything it
 * must add lives in the band under the stage: «pregunta tipo examen · ejemplo» at the bottom right (the panel only
 * prints «EXAMEN · SY0-701 · 5.1», registry contradiction 17) and one centred resolution line under it.
 */
export function QuestionFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.7, filter: 'saturate(0.75)' }}>{children}</div>
      <QuestionTag />
    </>
  );
}

/** One centred line in the resolution slot: `children` laid out in a row, faded by `opacity` (0–1). */
export function SlotLine({ children, opacity = 1, dy = 0, stageW = 1728, gap = 22 }: { children: ReactNode; opacity?: number; dy?: number; stageW?: number; gap?: number }) {
  const o = clamp01(opacity);
  if (o <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: SLOT_TOP, width: stageW, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${dy}px)` }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

/** The resolution text, white, with room for one highlighted span. */
export function SlotText({ children, size = 38 }: { children: ReactNode; size?: number }) {
  return <div style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>{children}</div>;
}

/** The highlighted span inside a SlotText. */
export function Hi({ children, color = C.cyanSoft }: { children: ReactNode; color?: string }) {
  return <span style={{ color }}>{children}</span>;
}
