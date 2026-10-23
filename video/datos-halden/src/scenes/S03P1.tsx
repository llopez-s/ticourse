import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Piggy } from './parts/PiggyBank';
import { BagArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { Stage } from './kit';

/**
 * s03-p1 «Del despacho al juzgado». The engine's ExamQuestionLayer draws question 1 (scenario, question, options, the
 * 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the stage is a
 * still, dim, textless background — an external drive inside a handbag — plus «pregunta tipo examen · ejemplo» at the
 * bottom right. No qualifier, on purpose. On `piggybank-back` the piggy bank comes back in one line under the panel:
 * the one you carry in your bag is still a closed piggy bank.
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const backIn = progress(frame, props.cue('piggybank-back'), 14);
  return (
    <Stage>
      <QuestionFrame>
        <BagArt />
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <Piggy width={92} />
        <SlotText size={36}>
          <span>la hucha que llevas en el bolso a otra casa </span>
          <span style={{ color: C.cyanSoft }}>sigue siendo una hucha cerrada</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
