import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { EnglishMini } from './parts/EnglishArt';
import { ImageTag, Pill } from './parts/Labels';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { DeskArt } from './parts/QuestionArt';
import { Stage } from './kit';

/**
 * s07-p3 «Las facturas de Finanzas». The engine's ExamQuestionLayer draws question 3 (scenario, question with «MEJOR» —
 * already explained in s03 —, options, the 5 s countdown, the answer on `ok-3`, the trap on `trap-3`) over this scene
 * from s07-01 to its end, so the stage is a still, dim, textless background (a desk with three generic invoices) plus
 * «pregunta tipo examen · ejemplo» bottom-right. Under the panel: on `ok-3` the audience of Finanzas from s06 lights;
 * on `trap-3` an amber note «el mismo curso para todos»; on `english-back` the note leaves and the school English
 * returns in one line, tagged «imagen · no es del puerto»: «repetir el inglés del instituto no te enseña a negociar un
 * contrato». No exam card of the scene's own (the engine draws the card after it).
 */
export function S07P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const qAt = props.cue('q3');
  const okAt = props.cue('ok-3');
  const trapAt = props.cue('trap-3');
  const backAt = props.cue('english-back');

  const dim = progress(frame, qAt, 18);
  const okIn = progress(frame, okAt - 2, 14);
  const trapIn = progress(frame, trapAt - 2, 14) * (1 - progress(frame, backAt - 6, 12));
  const backIn = progress(frame, backAt - 4, 14);

  return (
    <Stage>
      <QuestionFrame dim={dim}>
        <DeskArt react={okIn} />
      </QuestionFrame>

      <SlotLine opacity={okIn} dy={(1 - okIn) * 14} gap={30}>
        <Pill text="Finanzas" tone={C.cyan} icon="file" size={44} height={72} weight={850} on={0.5 + 0.5 * okIn} />
        {trapIn > 0.01 ? (
          <div style={{ opacity: trapIn, transform: `translateX(${(1 - trapIn) * 16}px)` }}>
            <Pill text="el mismo curso para todos" tone={C.amber} icon="layers" size={38} height={64} weight={800} on={0.5} />
          </div>
        ) : null}
        {backIn > 0.01 ? (
          <div style={{ opacity: backIn, transform: `translateX(${(1 - backIn) * 16}px)`, display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <EnglishMini width={104} />
              <ImageTag size={22} />
            </div>
            <SlotText size={36}>
              <span>repetir el inglés del instituto no te enseña a </span>
              <span style={{ color: C.cyanSoft }}>negociar un contrato</span>
            </SlotText>
          </div>
        ) : null}
      </SlotLine>
    </Stage>
  );
}
