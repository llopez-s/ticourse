import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';

/**
 * Frame shared by the question scenes this builder owns (s03, s05): a still, dim, textless background and the
 * «pregunta tipo examen · ejemplo» label the engine does not paint (registry contradiction 17). The engine's panel is
 * an overlay above every scene and covers the whole stage from the question segment to the end of the scene (its
 * bottom edge is at ≈ y 830 of the frame), so everything the scene must show during the question lives in the band
 * under the stage: the label at stage-local y 668 and one «resolution slot» just under it.
 */

export const QUESTION_TAG = 'pregunta tipo examen · ejemplo';
export const OUTSIDE_TAG = 'no es del puerto';
/** Stage-local top of the label (absolute y ≈ 858, just under the panel) and of the slot under it. */
export const QUESTION_TAG_TOP = 668;
export const SLOT_TOP = 722;

export function QuestionTag({ stageW = 1728 }: { stageW?: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: QUESTION_TAG_TOP, width: stageW, display: 'flex', justifyContent: 'center' }}>
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
        {`${QUESTION_TAG} · ${OUTSIDE_TAG}`}
      </div>
    </div>
  );
}

/** The still background (children, drawn at full stage size, dim) plus the label. Nothing here moves. */
export function QuestionFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.7, filter: 'saturate(0.75)' }}>{children}</div>
      <QuestionTag />
    </>
  );
}

/** One centred line in the resolution slot: `children` laid out in a row, faded by `opacity` (0–1). */
export function SlotLine({ children, opacity = 1, dy = 0, stageW = 1728 }: { children: ReactNode; opacity?: number; dy?: number; stageW?: number }) {
  const o = clamp01(opacity);
  if (o <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: SLOT_TOP, width: stageW, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${dy}px)` }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}
