import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { LiftCabin } from './parts/Images';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { PylonArt } from './parts/QuestionArt';
import { Stage, wordFrame } from './kit';

const S = 's04-p1';

/**
 * s04-p1 «La visita». Exam question 1 is the ENGINE's (ExamQuestionLayer, from s04-01 to the end: scenario, question
 * with no qualifier, options, the 5 s countdown, the answer on `ok-1`, the trap on `trap-1`). The scene is only a still,
 * dim, textless background — a power-line pylon, an electricity company without a name — plus the label «pregunta tipo
 * examen · ejemplo» (QuestionFrame). On `lift-back` the community's lift comes back in one line under the panel: «es
 * Industria abriendo un expediente, no el organismo que contrata la comunidad», the second half lighting on «organismo».
 */
export function S04P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('lift-back');
  const backIn = progress(frame, backAt, 14);
  const orgIn = progress(frame, Math.max(backAt + 12, wordFrame(S, 's04-03', 'organismo') - 10), 12);

  return (
    <Stage>
      <QuestionFrame>
        <PylonArt />
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <LiftCabin width={62} tone={C.sky} open={backIn} glow={0.6} />
        <SlotText size={38}>
          <div>
            es <span style={{ color: C.amber }}>Industria</span> abriendo un expediente,
          </div>
          <div style={{ opacity: 0.35 + 0.65 * orgIn }}>
            no el <span style={{ color: C.emerald }}>organismo</span> que contrata la comunidad
          </div>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
