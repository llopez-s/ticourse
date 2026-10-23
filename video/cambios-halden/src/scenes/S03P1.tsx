import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, STAGE } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Pill } from './parts/Labels';
import { CheckBox } from './parts/Marks';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { RequestSheet, SHEET } from './parts/Request';
import { Stage, wordFrame } from './kit';

const S = 's03-p1';
const BG_W = 880;

/** The request, textless, ticked and stamped: the still background of s03 and s07. */
export function RequestBackground() {
  const h = (BG_W * SHEET.h) / SHEET.w;
  return (
    <div style={{ position: 'absolute', left: (STAGE.width - BG_W) / 2, top: (STAGE.height - h) / 2 }}>
      <RequestSheet width={BG_W} mini owner={1} checks={[1, 1, 1]} stamp="cab" />
    </div>
  );
}

/**
 * s03-p1 «La cita que no se guarda». The engine's ExamQuestionLayer draws question 1 (scenario, question, options, the
 * 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the stage is a
 * still, dim, textless background — the request with its three ticks — plus «pregunta tipo examen · ejemplo». First
 * qualifier of the video: on `best` the scene draws, under the panel, «MEJOR: la que encaja con este caso, aunque otra
 * suene bien», brighter on the spoken «mejor». On `ok-1` the backout box comes back in one line.
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best');
  const okAt = props.cue('ok-1');
  const mejorAt = wordFrame(S, 's03-01', 'mejor', 1);
  const bestIn = progress(frame, bestAt - 4, 14);
  const bestOut = progress(frame, okAt - 12, 12);
  const mejor = progress(frame, mejorAt - 4, 10);
  const backIn = progress(frame, okAt + 4, 14);

  return (
    <Stage>
      <QuestionFrame>
        <RequestBackground />
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
        <CheckBox size={50} tick={progress(frame, okAt + 8, 14)} />
        <SlotText>
          <span style={{ color: '#c4b5fd' }}>BACKOUT PLAN</span>
          <span> · volver a lo que funcionaba</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
