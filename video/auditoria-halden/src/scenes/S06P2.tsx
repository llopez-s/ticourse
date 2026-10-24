import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { BridgeArt } from './parts/Images';
import { Pill } from './parts/Labels';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { TruckArt } from './parts/QuestionArt';
import { Stage, wordFrame } from './kit';

const S = 's06-p2';

/**
 * s06-p2 «El informe del pentest». The engine's ExamQuestionLayer draws question 2 (with «MEJOR» in its question) over
 * this scene from s06-01 to its end, so the stage is a still, dim, textless freight truck in profile (a logistics
 * company, no name) plus «pregunta tipo examen · ejemplo». First qualifier of the video: on `best` the scene draws,
 * under the panel, «MEJOR: la que encaja con este caso, aunque otra suene bien» (the panel does not), brighter on the
 * spoken «mejor». On `bridge-back` the new bridge comes back in one line: «la prueba de carga no dice qué acero se usó».
 */
export function S06P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best');
  const backAt = props.cue('bridge-back');
  const mejorAt = wordFrame(S, 's06-01', 'mejor', 1);
  const bestIn = progress(frame, bestAt - 4, 14);
  const bestOut = progress(frame, backAt - 12, 12);
  const mejor = progress(frame, mejorAt - 4, 10);
  const backIn = progress(frame, backAt, 14);

  return (
    <Stage>
      <QuestionFrame>
        <TruckArt />
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
        <BridgeArt width={300} load={backIn} />
        <SlotText size={40}>
          <span style={{ color: C.roseSoft }}>la prueba de carga</span>
          <span> no dice </span>
          <span style={{ color: C.cyanSoft }}>qué acero se usó</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
