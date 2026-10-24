import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { ContractPileArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { MiniTimeline } from './parts/Timeline';
import { Stage, wordFrame } from './kit';

const S = 's05-p2';

/**
 * s05-p2 «A mitad de contrato». The engine's ExamQuestionLayer draws question 2 (no qualifier, on purpose) over this
 * scene from s05-01 to its end, so the stage is a still, dim, textless background — a pile of contracts held by a binder
 * clip — plus «pregunta tipo examen · ejemplo» bottom right. Resolution lines under the panel: `ok-2` (the contract
 * already runs: vendor monitoring), `trap-2` (due diligence is before signing). On `timeline-back` s04's timeline comes
 * back in one line, due diligence on the left of the signed contract and vendor monitoring on the right, with the mark
 * «aquí» after the signature, brighter on the voice's «Aquí».
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const q2At = props.cue('q2');
  const okAt = props.cue('ok-2');
  const trapAt = props.cue('trap-2');
  const backAt = props.cue('timeline-back');
  const aquiAt = wordFrame(S, 's05-03', 'aquí');

  const bgIn = progress(frame, q2At - 4, 16);
  const okIn = progress(frame, okAt, 14);
  const okOut = progress(frame, trapAt - 8, 10);
  const trapIn = progress(frame, trapAt, 14);
  const trapOut = progress(frame, backAt - 10, 12);
  const backIn = progress(frame, backAt - 6, 14);
  const here = progress(frame, aquiAt - 4, 12);

  return (
    <Stage>
      <div style={{ opacity: bgIn }}>
        <QuestionFrame>
          <ContractPileArt />
        </QuestionFrame>
      </div>

      <SlotLine opacity={okIn * (1 - okOut)} dy={(1 - okIn) * 14}>
        <Icon name="check" size={52} color={C.emerald} strokeWidth={2.6} />
        <SlotText size={40}>
          <span>el contrato ya corre: </span>
          <span style={{ color: '#6ee7b7' }}>vendor monitoring</span>
        </SlotText>
      </SlotLine>

      <SlotLine opacity={trapIn * (1 - trapOut)} dy={(1 - trapIn) * 14}>
        <Icon name="alert" size={52} color={C.amber} strokeWidth={2.4} />
        <SlotText size={40}>
          <span>suena a investigar, </span>
          <span style={{ color: C.amber }}>pero la due diligence es antes de firmar</span>
        </SlotText>
      </SlotLine>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <MiniTimeline width={1140} here={here} glow={0.4 + 0.6 * here} />
      </SlotLine>
    </Stage>
  );
}
