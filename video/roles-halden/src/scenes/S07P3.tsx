import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Pill } from './parts/Labels';
import { Hi, QuestionFrame, SlotLine, SlotText } from './parts/QuestionFrame';
import { ImageTag, QUESTION_TAG_TOP } from './parts/Tags';
import { BoardRoomStill } from './parts/Stills';
import { ClubGlyph } from './parts/Vignettes';
import { Stage, wordFrame } from './kit';

const S = 's07-p3';

/**
 * s07-p3 «Dos consejeros». The engine's ExamQuestionLayer draws question 3 (with «MEJOR») over this scene from s07-01
 * to its end, so the stage is a still, dim boardroom plus «pregunta tipo examen · ejemplo». «MEJOR» is only lit, under
 * the panel, on the spoken «mejor» (it was explained in s05, no gloss). On `club-back` the neighbourhood club comes back
 * in one line, with its «imagen · no es del puerto»: the town hall may have someone on the board and is still the town
 * hall.
 */
export function S07P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('club-back');
  const mejorAt = wordFrame(S, 's07-01', 'mejor');
  const mejorIn = progress(frame, mejorAt - 4, 12) * (1 - progress(frame, backAt - 12, 12));
  const backIn = progress(frame, backAt, 14);
  return (
    <Stage>
      <QuestionFrame>
        <BoardRoomStill />
      </QuestionFrame>

      <SlotLine opacity={mejorIn} dy={(1 - mejorIn) * 14}>
        <Pill text={<span style={{ fontWeight: 900, color: C.amber, letterSpacing: 1 }}>MEJOR</span>} tone={C.amber} size={42} height={72} on={0.5 + 0.5 * mejorIn} />
      </SlotLine>

      {backIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: QUESTION_TAG_TOP, opacity: backIn }}>
          <ImageTag size={28} />
        </div>
      ) : null}
      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <ClubGlyph size={104} />
        <SlotText size={34}>
          <span>el ayuntamiento puede tener a alguien en la junta, </span>
          <Hi>y sigue siendo el ayuntamiento</Hi>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
