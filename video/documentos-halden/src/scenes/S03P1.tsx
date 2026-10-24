import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { SunBottle } from './parts/Pool';
import { DevArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { Stage } from './kit';

/**
 * s03-p1 «Un documento de desarrollo». The engine's ExamQuestionLayer draws question 1 (scenario, question, options, the
 * 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the stage is a
 * still, dim, textless background — two generic sheets, one with a lock and a terminal pictogram — plus «pregunta tipo
 * examen · ejemplo · no es del puerto» at the bottom right. No qualifier, on purpose: the definition decides. On
 * `sunscreen` the sunscreen bottle comes back in one line under the panel: it also has a number, and nobody throws you
 * out for not wearing it.
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const backIn = progress(frame, props.cue('sunscreen'), 14);
  return (
    <Stage>
      <QuestionFrame>
        <DevArt />
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <SunBottle size={86} />
        <SlotText size={40}>
          <span>la crema de factor 50 tiene número, </span>
          <span style={{ color: C.cyanSoft }}>y nadie te echa por no ponértela</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
