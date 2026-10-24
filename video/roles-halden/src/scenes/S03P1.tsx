import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { progress } from '../../../engine/src/theme/motion';
import { AlbumGlyph } from './parts/Vignettes';
import { Hi, QuestionFrame, SlotLine, SlotText } from './parts/QuestionFrame';
import { ImageTag, QUESTION_TAG_TOP } from './parts/Tags';
import { ClinicStill } from './parts/Stills';
import { Stage } from './kit';

/**
 * s03-p1 «Qué nivel de clasificación». The engine's ExamQuestionLayer draws question 1 (scenario, question, options,
 * the 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the stage is
 * a still, dim, textless background — a clinic's front desk — plus «pregunta tipo examen · ejemplo» at the bottom right.
 * No qualifier, on purpose. On `album-back` the grandmother's album comes back in one line under the panel, with its
 * «imagen · no es del puerto»: the aunt knows who is in every photo, and the grandmother still decides.
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const backIn = progress(frame, props.cue('album-back'), 14);
  return (
    <Stage>
      <QuestionFrame>
        <ClinicStill />
      </QuestionFrame>

      {backIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: QUESTION_TAG_TOP, opacity: backIn }}>
          <ImageTag size={28} />
        </div>
      ) : null}
      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <AlbumGlyph size={104} />
        <SlotText size={38}>
          <span>la tía sabe quién aparece en cada foto, </span>
          <Hi>y aun así decide la abuela</Hi>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
