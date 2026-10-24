import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Cat } from './parts/Images';
import { ImageTag, Pill } from './parts/Labels';
import { CalendarScreenArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { Stage, wordFrame } from './kit';

const S = 's03-p1';

/**
 * s03-p1 «Tres años después». The engine's ExamQuestionLayer draws question 1 (scenario, question with «MEJOR», options,
 * the 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the stage is
 * a still, dim, textless background — an application screen with a calendar page that turns, no name, no figures — plus
 * «pregunta tipo examen · ejemplo» bottom right. The video's first qualifier: on `best` the scene draws, under the
 * panel (the panel does not), «MEJOR: la que encaja con este caso, aunque otra suene bien», lit on the voice's own
 * «mejor». On `cat-back` the line gives way to the cat of s02 with its bowl still empty: «te informaste de maravilla, y
 * el gato sigue sin comer».
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best');
  const backAt = props.cue('cat-back');
  const mejorAt = wordFrame(S, 's03-01', 'mejor', 1);
  const bestIn = progress(frame, bestAt - 4, 14);
  const bestOut = progress(frame, backAt - 12, 12);
  const mejor = progress(frame, mejorAt - 4, 10);
  const backIn = progress(frame, backAt, 14);

  return (
    <Stage>
      <QuestionFrame>
        <CalendarScreenArt />
      </QuestionFrame>

      {/* «MEJOR: la que encaja con este caso, aunque otra suene bien» */}
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

      {/* The cat comes back: informed, and still unfed */}
      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <Cat width={112} alert={backIn} />
        <SlotText size={40}>
          <span>te informaste de maravilla, </span>
          <span style={{ color: C.amber }}>y el gato sigue sin comer</span>
        </SlotText>
        <ImageTag size={24} />
      </SlotLine>
    </Stage>
  );
}
