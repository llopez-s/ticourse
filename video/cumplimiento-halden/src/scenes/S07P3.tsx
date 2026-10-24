import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Drawer } from './parts/Images';
import { ImageTag } from './parts/Labels';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { FoldersArt } from './parts/QuestionArt';
import { Stage, wordFrame } from './kit';

const S = 's07-p3';

/**
 * s07-p3 «Doce años de currículos». The engine's ExamQuestionLayer draws question 3 (with «MEJOR» — already explained
 * in s03, so no line under the panel and nothing for the scene to highlight —, options, the 5 s countdown, the answer on
 * `ok-3`, the trap on `trap-3`) over this scene from s07-01 to its end, so the stage is a still, dim, textless
 * background — a pile of folders that keeps growing — plus «pregunta tipo examen · ejemplo» bottom right. On
 * `drawer-back` the filing cabinet of s06 comes back for one line under the panel: «nadie te pide que tires los recibos
 * viejos, y aun así sobran», with its tag.
 */
export function S07P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('drawer-back');
  const sobranAt = Math.max(backAt + 6, wordFrame(S, 's07-04', 'sobran') - 10);
  const backIn = progress(frame, backAt, 14);
  const sobran = progress(frame, sobranAt, 12);

  return (
    <Stage>
      <QuestionFrame>
        <FoldersArt />
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <div style={{ height: 96, display: 'flex', alignItems: 'center' }}>
          <Drawer width={76} glow={0.5 * backIn} />
        </div>
        <SlotText size={40}>
          <span>nadie te pide que tires los recibos viejos, </span>
          <span style={{ color: sobran > 0.5 ? C.amber : '#ffffff' }}>y aun así sobran</span>
        </SlotText>
        <ImageTag size={24} />
      </SlotLine>
    </Stage>
  );
}
