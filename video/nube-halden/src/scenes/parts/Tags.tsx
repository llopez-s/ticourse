import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/** «imagen · no es del puerto»: labels every everyday image (the post-it, the bike, the bank branches). */
export const IMAGE_TAG = 'imagen · no es del puerto';
/** Drawn by each question scene's background: the engine's panel only prints «EXAMEN · SY0-701 · 3.1». */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo';
/** Added to the question label: none of the three examples is the port's (s03, s05, s07). */
export const OUTSIDE_TAG = 'no es del puerto';
/** The port's beats are proposals (s02, s04, s06). */
export const CASE_TAG = 'propuesta · sin fecha';

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

/** Height of the question label pill. */
export const QUESTION_TAG_H = 40;
/**
 * Stage-local top of the label: just under the stage's bottom edge (absolute y ≈ 858–898). The engine's question
 * panel, laid out at its fully revealed height, covers the whole stage (y 190–850), so the label sits in the free band
 * under it (the -yt videos burn no captions there) instead of being hidden behind the panel.
 */
const QUESTION_TAG_TOP = 668;

/**
 * «pregunta tipo examen · ejemplo», centred under the stage, below the engine's question panel. Bright text on a solid
 * pill, so it still reads through the engine's dim.
 */
export function QuestionTag({ stageW = 1728, outside = false }: { stageW?: number; /** Adds «· no es del puerto» (s03, s05, s07). */ outside?: boolean }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: QUESTION_TAG_TOP, width: stageW, display: 'flex', justifyContent: 'center' }}>
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
        {outside ? `${QUESTION_TAG} · ${OUTSIDE_TAG}` : QUESTION_TAG}
      </div>
    </div>
  );
}
