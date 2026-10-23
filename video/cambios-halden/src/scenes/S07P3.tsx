import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, STAGE } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { DOC, DOCS_W, DocBoxes } from './parts/DocBoxes';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { RequestSheet } from './parts/Request';
import { Stage, wordFrame } from './kit';

const S = 's07-p3';

/**
 * s07-p3 «Los encargos urgentes». The engine's ExamQuestionLayer draws question 3 (no qualifier, on purpose) over this
 * scene from s07-01 to its end, so the stage is a still, dim, textless background — s06's three documents without
 * their words — plus «pregunta tipo examen · ejemplo». No florist or program is drawn. On `request-back` the request
 * comes back in one line under the panel: «cambió el cómo, y el paso a paso no», the second half on «nadie».
 */
export function S07P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('request-back');
  const nadieAt = wordFrame(S, 's07-02', 'nadie') - 6;
  const backIn = progress(frame, backAt, 14);
  const second = progress(frame, nadieAt, 12);
  return (
    <Stage>
      <QuestionFrame>
        <div style={{ position: 'absolute', left: (STAGE.width - DOCS_W) / 2, top: (STAGE.height - DOC.h) / 2, opacity: 0.75 }}>
          <DocBoxes bare on={[0.6, 0.6, 0.6]} />
        </div>
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <RequestSheet width={120} mini owner={1} checks={[1, 1, 1]} stamp="closed" />
        <SlotText>
          <span style={{ color: C.cyanSoft }}>cambió el cómo</span>
          <span style={{ opacity: 0.3 + 0.7 * second }}>
            , y <span style={{ color: C.amber }}>el paso a paso no</span>
          </span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
