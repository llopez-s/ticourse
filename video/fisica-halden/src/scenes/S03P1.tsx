import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, STAGE } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { FloorPlan, PLAN } from './parts/FloorPlan';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { Stage, wordFrame } from './kit';

const S = 's03-p1';
const BG_W = 1500;

/** The example plan with its three controls, as the still background of s03 and s05. */
export function PlanBackground({ idSuffix }: { idSuffix: string }) {
  const h = (BG_W * PLAN.h) / PLAN.w;
  return (
    <div style={{ position: 'absolute', left: (STAGE.width - BG_W) / 2, top: (STAGE.height - h) / 2 }}>
      <FloorPlan width={BG_W} car={1} bollards={1} vestibule={1} reader={1} log={1} idSuffix={idSuffix} />
    </div>
  );
}

/**
 * s03-p1 «Un centro de distribución». The engine's ExamQuestionLayer draws question 1 (scenario, question, options,
 * the 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the stage is
 * a still, dim, textless background — the example plan with its three controls — plus «pregunta tipo examen · ejemplo»
 * at the bottom right. No qualifier, on purpose. On `plan-back` the plan comes back in one line under the panel: the
 * reader with its log, «el badge decide y apunta; la cámara solo graba».
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('plan-back');
  const camaraAt = wordFrame(S, 's03-03', 'cámara') - 4;
  const backIn = progress(frame, backAt, 14);
  const cam = progress(frame, camaraAt, 10);
  return (
    <Stage>
      <QuestionFrame>
        <PlanBackground idSuffix="-s3" />
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <FloorPlan width={150} car={1} bollards={1} vestibule={1} reader={1} person={1} beep={1} log={1} idSuffix="-s3-back" />
        <SlotText>
          <span style={{ color: C.emerald }}>el badge decide y apunta</span>
          <span>; </span>
          <span style={{ color: C.amber, opacity: 0.35 + 0.65 * cam }}>la cámara solo graba</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
