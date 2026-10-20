import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { DEPOT_H, DEPOT_W, DepotEntrance } from './parts/s04-camara/Depot';
import { Stage } from './kit';

const PIC_W = 820;
const PIC_H = (PIC_W * DEPOT_H) / DEPOT_W;

/**
 * s05-p2 «Otra entrada del depósito». The engine's ExamQuestionLayer draws the question (scenario, «MEJOR»,
 * options, countdown, answer and trap) over this scene from s05-01 to its end, so the scene itself is only a still,
 * dim, textless background, present from the first frame: ANOTHER entrance of the empty-container depot (variant
 * 'b', mirrored, a three-high stack) with the camera's empty housing — the same silhouette, no lens, no light.
 */
export function S05P2(_props: SceneProps) {
  return (
    <Stage>
      <div
        style={{
          position: 'absolute',
          left: (1728 - PIC_W) / 2,
          top: (660 - PIC_H) / 2,
          width: PIC_W,
          height: PIC_H,
          borderRadius: RADIUS.lg,
          overflow: 'hidden',
          border: `2px solid ${alpha(C.text, 0.14)}`,
          opacity: 0.6,
          filter: 'saturate(0.7)',
        }}
      >
        <DepotEntrance width={PIC_W} mode="day" variant="b" cameraEmpty />
      </div>
    </Stage>
  );
}
