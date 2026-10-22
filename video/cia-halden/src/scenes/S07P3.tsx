import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { KitBox } from './parts/Kit';
import { ImageTag } from './parts/Labels';
import { ResidenceArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine } from './parts/QuestionFrame';
import { Stage, wordFrame } from './kit';

const S = 's07-p3';

/**
 * s07-p3 «Antes de certificarse». The engine's ExamQuestionLayer draws question 3 (scenario, question with «MEJOR» —
 * already explained in s05, so only the panel's own capitals —, options, the 5 s countdown, the answer on `ok-3`, the
 * trap on `trap-3`) over this scene from s07-01 to its end, so the stage is a still, dim, textless background (a
 * residence's front) plus «pregunta tipo examen · ejemplo» bottom-right. In the resolution the first-aid kit comes back
 * for one line under the panel, with no cue of its own, on the voice's «lista»: «se mira contra una lista, no contra lo
 * que da miedo», tagged «imagen · no es del puerto». No exam card.
 */
export function S07P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const trapAt = props.cue('trap-3');
  const listaAt = Math.max(trapAt + 6, wordFrame(S, 's07-03', 'lista') - 6);
  const lineIn = progress(frame, listaAt, 14);

  return (
    <Stage>
      <QuestionFrame>
        <ResidenceArt />
      </QuestionFrame>

      <SlotLine opacity={lineIn} dy={(1 - lineIn) * 14}>
        <KitBox width={86} glow={0.5 * lineIn} marks={[1, 1, 1]} idSuffix="-s7" />
        <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>se mira contra una lista, no contra lo que da miedo</div>
        <ImageTag size={26} />
      </SlotLine>
    </Stage>
  );
}
