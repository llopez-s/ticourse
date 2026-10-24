import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Pill } from './parts/Labels';
import { QuestionFrame, SlotLine } from './parts/QuestionFrame';
import { ServerRoomStill } from './parts/Stills';
import { Stage, wordFrame } from './kit';

const S = 's05-p2';

/**
 * s05-p2 «La base de afiliados». The engine's ExamQuestionLayer draws question 2 (with «MEJOR» in its question) over
 * this scene from s05-01 to its end, so the stage is a still, dim server room plus «pregunta tipo examen · ejemplo».
 * First qualifier of the video: on `best` the scene draws, under the panel, «MEJOR: la que encaja con este caso, aunque
 * otra suene bien» (the panel does not), brighter on the spoken «mejor». On `planes` the two planes of s02 and s04 come
 * back in one line: the administrator lands in «dentro de la casa · custodian» and not in «con la ley · processor».
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best');
  const planesAt = props.cue('planes');
  const mejorAt = wordFrame(S, 's05-01', 'mejor', 1);
  const bestIn = progress(frame, bestAt - 4, 14);
  const bestOut = progress(frame, planesAt - 12, 12);
  const mejor = progress(frame, mejorAt - 4, 10);
  const planesIn = progress(frame, planesAt, 14);
  const landed = progress(frame, planesAt + 14, 14);

  return (
    <Stage>
      <QuestionFrame>
        <ServerRoomStill />
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

      <SlotLine opacity={planesIn} dy={(1 - planesIn) * 14} gap={26}>
        <Icon name="user" size={54} color={C.cyan} strokeWidth={2.2} />
        <Pill text="dentro de la casa · custodian" tone={C.emerald} icon="check" size={38} height={70} on={0.35 + 0.65 * landed} />
        <Pill text="con la ley · processor" tone={C.muted} size={38} height={70} on={0} style={{ opacity: 0.55 }} />
      </SlotLine>
    </Stage>
  );
}
