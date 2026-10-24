import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/** «imagen · no es del puerto»: labels every everyday image (the photo album, the removal van, the neighbourhood club). */
export const IMAGE_TAG = 'imagen · no es del puerto';
/**
 * Drawn by each question scene's background: the engine's panel only prints «EXAMEN · SY0-701 · 5.1». This
 * storyboard asks for the label alone, without «· no es del puerto» (the three examples never name the port).
 */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo';

/** The small dashed pill that marks an everyday image as an image, not a fact of the port. */
export function ImageTag({ size = 26, style }: { size?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: `${Math.round(size * 0.22)}px ${Math.round(size * 0.6)}px`,
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(C.muted, 0.6)}`,
        background: alpha(C.ink950, 0.6),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        color: C.muted,
        whiteSpace: 'nowrap',
        lineHeight: 1.1,
        ...style,
      }}
    >
      <Icon name="eye" size={Math.round(size * 0.95)} color={C.faint} />
      {IMAGE_TAG}
    </div>
  );
}

/** Stage-local top of the question label (just under the stage's bottom edge) and of the one-line slot under it. */
export const QUESTION_TAG_TOP = 668;
export const SLOT_TOP = 722;
export const QUESTION_TAG_H = 40;

/** «pregunta tipo examen · ejemplo», bottom right, bright text on a solid pill so it reads through the dim. */
export function QuestionTag({ stageW = 1728 }: { stageW?: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: QUESTION_TAG_TOP, width: stageW, display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          height: QUESTION_TAG_H,
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
