import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, STAGE } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { EuropeMap, MAP } from './parts/EuropeMap';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { StorageRoom } from './parts/StorageRoom';
import { Stage } from './kit';

const BG_W = 900;

/**
 * s07-p3 «La nube de una editorial». The engine's ExamQuestionLayer draws question 3 (with «MEJOR», only highlighted:
 * it was explained in s05) over this scene from s07-01 to its end, so the stage is a still, dim, textless background —
 * the dot map with three storage points, no country named, no provider — plus «pregunta tipo examen · ejemplo». On
 * `storage-back` the storage room comes back in one line: knowing which city each one is in closes none.
 */
export function S07P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const backIn = progress(frame, props.cue('storage-back'), 14);
  const h = (BG_W * MAP.h) / MAP.w;
  return (
    <Stage>
      <QuestionFrame>
        <div style={{ position: 'absolute', left: (STAGE.width - BG_W) / 2, top: (STAGE.height - h) / 2, opacity: 0.7 }}>
          <EuropeMap width={BG_W} dots={1} />
        </div>
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <StorageRoom width={120} />
        <SlotText size={40}>
          <span>saber en qué ciudad está cada trastero </span>
          <span style={{ color: C.amber }}>no cierra ninguno</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
