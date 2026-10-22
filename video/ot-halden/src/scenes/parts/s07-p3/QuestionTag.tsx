import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';

/** Drawn by the scene: the engine's panel only prints «EXAMEN · SY0-701 · 3.1». */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo · no es del puerto';

const TAG_H = 40;
/**
 * Stage-local top of the label: just under the stage's bottom edge (absolute y ≈ 858–898). The engine's question panel
 * covers the whole stage (y 190–850), so the label sits in the free band under it.
 */
const TAG_TOP = 668;

/** «pregunta tipo examen · ejemplo», centred under the stage. Bright text on a solid pill, so it reads through the dim. */
export function QuestionTag({ stageW = 1728 }: { stageW?: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: TAG_TOP, width: stageW, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          height: TAG_H,
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
