import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Pill } from './parts/Labels';
import { NotaryArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine } from './parts/QuestionFrame';
import { Stage, wordFrame } from './kit';

const S = 's05-p2';

/**
 * s05-p2 «Quién abre una escritura». The engine's ExamQuestionLayer draws question 2 (scenario, question with «MEJOR»,
 * options, the 5 s countdown, the answer on `ok-2`, the trap on `trap-2`) over this scene from s05-01 to its end, so
 * the stage is a still, dim, textless background (a notary's bookcase and desk) plus «pregunta tipo examen · ejemplo»
 * bottom-right. The video's first qualifier: on `best` the scene draws V28's line under the panel (the panel cannot
 * highlight «MEJOR» itself), «MEJOR» lit on the voice's own «mejor»; it steps back once the answer is out.
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best');
  const mejorAt = wordFrame(S, 's05-01', 'mejor', 1);
  const okAt = props.cue('ok-2');

  const bestIn = progress(frame, bestAt - 4, 14);
  const mejor = progress(frame, mejorAt - 4, 10);
  const after = progress(frame, okAt, 14);

  return (
    <Stage>
      <QuestionFrame>
        <NotaryArt />
      </QuestionFrame>

      {/* «MEJOR: la que encaja con este caso, aunque otra suene bien» (the voice says the idea in its own words) */}
      <SlotLine opacity={bestIn * (1 - 0.45 * after)} dy={(1 - bestIn) * 14}>
        <Pill
          tone={C.amber}
          on={(0.35 + 0.65 * mejor) * (1 - 0.6 * after)}
          size={40}
          height={70}
          text={
            <span>
              <span style={{ fontWeight: 900, color: C.amber, letterSpacing: 1 }}>MEJOR:</span> la que encaja con este caso, aunque otra suene bien
            </span>
          }
        />
      </SlotLine>
    </Stage>
  );
}
