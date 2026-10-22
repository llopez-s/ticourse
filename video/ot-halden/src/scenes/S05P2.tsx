import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { FireTruck, ImageTag, TenMinuteClock } from './parts/Firehouse';
import { QuestionFrame, SlotLine } from './parts/s03-p1/QuestionFrame';
import { PressArt } from './parts/s05-p2/PressArt';
import { Stage, wordFrame } from './kit';

const S = 's05-p2';

/**
 * s05-p2 «La barrera de luz». The engine's ExamQuestionLayer draws question 2 (scenario, question with «MEJOR», options,
 * the 5 s countdown, the answer on `ok-2`, the trap on `trap-2`) over this scene from s05-01 to its end, so the stage is
 * a still, dim, textless background (a press with a light curtain in front of it) plus «pregunta tipo examen · ejemplo»
 * under it. «MEJOR» gets no line here (explained in s03). On `fire-back-2` the fire-station line comes back under the
 * panel: the truck was free and the ten-minute clock still ran out.
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const fbAt = props.cue('fire-back-2');
  const libreAt = wordFrame(S, 's05-03', 'libre');
  const tardeAt = wordFrame(S, 's05-03', 'tarde');

  const fbIn = progress(frame, fbAt, 14);
  const libre = progress(frame, libreAt - 4, 10);
  const tarde = progress(frame, tardeAt - 6, 10);

  return (
    <Stage>
      <QuestionFrame>
        <PressArt />
      </QuestionFrame>

      {/* fire-back-2: «el camión estaba libre, y aun así llegó tarde» */}
      <SlotLine opacity={fbIn} dy={(1 - fbIn) * 14}>
        <FireTruck size={72} tone={C.sky} glow={0.2 + 0.5 * libre} />
        <TenMinuteClock size={72} glow={0.2 + 0.6 * tarde} />
        <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
          <span style={{ opacity: 0.8 + 0.2 * libre }}>el camión estaba libre, </span>
          <span style={{ color: C.amber, opacity: 0.8 + 0.2 * tarde }}>y aun así llegó tarde</span>
        </div>
        <ImageTag size={26} />
      </SlotLine>
    </Stage>
  );
}
