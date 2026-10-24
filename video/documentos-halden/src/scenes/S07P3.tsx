import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { BoardMini } from './parts/Pool';
import { LawArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { Stage } from './kit';

/**
 * s07-p3 «Una ley en marzo». The engine's ExamQuestionLayer draws question 3 (with «MEJOR», only highlighted by the
 * panel's own capitals: it was explained in s05) over this scene from s07-01 to its end, so the stage is a still, dim,
 * textless background — a sheet with its yearly review and a newer one arriving with a bell — plus «pregunta tipo
 * examen · ejemplo · no es del puerto». On `sign-back` the yellowed sign of the small pool comes back in one line: it
 * is changed when the pool closes, not on the date of the review.
 */
export function S07P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const backIn = progress(frame, props.cue('sign-back'), 14);
  return (
    <Stage>
      <QuestionFrame>
        <LawArt />
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <BoardMini kind="old" width={118} />
        <SlotText size={40}>
          <span>el cartel se cambia </span>
          <span style={{ color: C.amber }}>cuando cierra la piscina</span>
          <span>, no cuando toca revisar</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
