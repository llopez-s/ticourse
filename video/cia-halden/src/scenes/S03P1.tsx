import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { CooperativeArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine } from './parts/QuestionFrame';
import { Sheet } from './parts/Sheet';
import { Stage, wordFrame } from './kit';

const S = 's03-p1';

/**
 * s03-p1 «Los kilos de la cosecha». The engine's ExamQuestionLayer draws question 1 (scenario, question, options, the
 * 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the stage is a
 * still, dim, textless background (a cooperative's silos and sacks) plus «pregunta tipo examen · ejemplo» bottom-right.
 * No qualifier, on purpose. In the resolution the port's sheet comes back for one line in the band under the panel,
 * with no cue of its own: on «kilos» of the answer sentence, «1.000 kg que pasan a 100: integrity, aunque nadie los
 * toque».
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const okAt = props.cue('ok-1');
  const kilosAt = Math.max(okAt + 6, wordFrame(S, 's03-02', 'kilos') - 6);
  const lineIn = progress(frame, kilosAt, 14);

  return (
    <Stage>
      <QuestionFrame>
        <CooperativeArt />
      </QuestionFrame>

      <SlotLine opacity={lineIn} dy={(1 - lineIn) * 14}>
        <Sheet width={60} mini glow={0.5 * lineIn} />
        <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
          <span style={{ fontFamily: FONT.mono, color: C.textStrong }}>1.000 kg</span>
          <span> que pasan a </span>
          <span style={{ fontFamily: FONT.mono, color: C.roseSoft }}>100</span>
          <span>: </span>
          <span style={{ color: '#c4b5fd' }}>integrity</span>
          <span>, aunque nadie los toque</span>
        </div>
      </SlotLine>
    </Stage>
  );
}
