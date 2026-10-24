import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { SocLog } from './parts/Log';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { MagnifierArt } from './parts/QuestionArt';
import { Stage, wordFrame } from './kit';

const S = 's12-p5';

/**
 * s12-p5 «Un buscador». The engine's ExamQuestionLayer draws question 5 (no qualifier, on purpose) over this scene from
 * s12-01 to its end, so the stage is a still, dim, textless magnifier over a field of dots (a search engine for exposed
 * devices, no name) plus «pregunta tipo examen · ejemplo». On `log-back` the empty SOC log of s11 comes back in one
 * line under the panel: «el registro no miente: el equipo no ha llamado a la puerta», the second half on «llamado».
 */
export function S12P5(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('log-back');
  const backIn = progress(frame, backAt, 14);
  const knockIn = progress(frame, Math.max(backAt + 14, wordFrame(S, 's12-03', 'llamado') - 12), 12);

  return (
    <Stage>
      <QuestionFrame>
        <MagnifierArt />
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <SocLog width={250} height={112} rows={3} title="registro" titleSize={26} />
        <SlotText size={40}>
          <span>el registro no miente: </span>
          <span style={{ opacity: 0.3 + 0.7 * knockIn, color: C.emerald }}>el equipo no ha llamado a la puerta</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
