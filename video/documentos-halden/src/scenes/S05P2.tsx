import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Pill } from './parts/Labels';
import { BoardMini } from './parts/Pool';
import { StepsArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { Stage, wordFrame } from './kit';

const S = 's05-p2';

/**
 * s05-p2 «Un documento firmado por todos». The engine's ExamQuestionLayer draws question 2 (with «MEJOR» in its question)
 * over this scene from s05-01 to its end, so the stage is a still, dim, textless background — a sheet of numbered steps
 * with signatures and an approval seal — plus «pregunta tipo examen · ejemplo · no es del puerto». First qualifier of the
 * video: on `best` the scene draws, under the panel, «MEJOR: la que encaja con este caso, aunque otra suene bien» (the
 * panel does not), brighter on the spoken «mejor». On `lifeguard` the lifeguard's sheet comes back in one line: it
 * obliges, and it is still the how.
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best');
  const backAt = props.cue('lifeguard');
  const mejorAt = wordFrame(S, 's05-01', 'mejor', 1);
  const bestIn = progress(frame, bestAt - 4, 14);
  const bestOut = progress(frame, backAt - 12, 12);
  const mejor = progress(frame, mejorAt - 4, 10);
  const backIn = progress(frame, backAt, 14);

  return (
    <Stage>
      <QuestionFrame>
        <StepsArt />
      </QuestionFrame>

      <SlotLine opacity={bestIn * (1 - bestOut)} dy={(1 - bestIn) * 14}>
        <Pill
          tone={C.amber}
          on={0.35 + 0.65 * mejor}
          size={40}
          height={70}
          text={
            <span>
              <span style={{ fontWeight: 900, color: C.amber, letterSpacing: 1 }}>MEJOR:</span> la que encaja con este caso, aunque otra suene bien
            </span>
          }
        />
      </SlotLine>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <BoardMini kind="lifeguard" width={118} />
        <SlotText size={40}>
          <span>la hoja del socorrista </span>
          <span style={{ color: C.emerald }}>obliga</span>
          <span>, y sigue siendo </span>
          <span style={{ color: C.cyanSoft }}>el cómo</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
