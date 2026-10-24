import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { OthersChip } from './parts/Papers';
import { SummerCalendarArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { Stage, wordFrame } from './kit';

const S = 's07-p3';

/**
 * s07-p3 «Dos hospitales en verano». The engine's ExamQuestionLayer draws question 3 (with «MEJOR», only highlighted:
 * it was explained in s03) over this scene from s07-01 to its end, so the stage is a still, dim, textless background —
 * a summer calendar in outline, two blocks of dates — plus «pregunta tipo examen · ejemplo» bottom right. Resolution
 * lines under the panel: `ok-3` (concrete commitments: MOA), `trap-3` (only the intention: MOU). On `chip-back` s06's
 * chip «MOU · MOA · BPA» comes back in one line with MOA lit, brighter on the voice's «compromiso».
 */
export function S07P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const q3At = props.cue('q3');
  const okAt = props.cue('ok-3');
  const trapAt = props.cue('trap-3');
  const backAt = props.cue('chip-back');
  const compromisoAt = wordFrame(S, 's07-03', 'compromiso');

  const bgIn = progress(frame, q3At - 4, 16);
  const okIn = progress(frame, okAt, 14);
  const okOut = progress(frame, trapAt - 8, 10);
  const trapIn = progress(frame, trapAt, 14);
  const trapOut = progress(frame, backAt - 10, 12);
  const backIn = progress(frame, backAt - 6, 14);
  const moa = progress(frame, Math.max(backAt, compromisoAt - 8), 14);

  return (
    <Stage>
      <div style={{ opacity: bgIn }}>
        <QuestionFrame>
          <SummerCalendarArt />
        </QuestionFrame>
      </div>

      <SlotLine opacity={okIn * (1 - okOut)} dy={(1 - okIn) * 14}>
        <Icon name="check" size={52} color={C.emerald} strokeWidth={2.6} />
        <SlotText size={40}>
          <span>cada uno se compromete a algo concreto: </span>
          <span style={{ color: '#6ee7b7' }}>MOA</span>
        </SlotText>
      </SlotLine>

      <SlotLine opacity={trapIn * (1 - trapOut)} dy={(1 - trapIn) * 14}>
        <Icon name="alert" size={52} color={C.amber} strokeWidth={2.4} />
        <SlotText size={40}>
          <span>colaborar sin dinero tienta, </span>
          <span style={{ color: C.amber }}>pero el MOU solo dice la intención</span>
        </SlotText>
      </SlotLine>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <OthersChip focus={{ key: 'moa', amount: moa }} size={32} caption={false} />
      </SlotLine>
    </Stage>
  );
}
