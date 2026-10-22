import type { SceneProps } from '../../../engine/src/timeline/types';
import { Stage } from './kit';
import { Furnace } from './parts/s07-p3/Furnace';
import { QuestionTag } from './parts/s07-p3/QuestionTag';

/**
 * s07-p3 «Una fábrica de vidrio». The engine's ExamQuestionLayer draws question 3 (scenario, question, options, the 5 s
 * countdown, the answer on `ok-3`, the trap on `trap-3`) over this scene from s07-01 to its end, so the scene is only a
 * still, dim, textless background — the silhouette of a lit glass furnace, complete from the first frame — plus
 * «pregunta tipo examen · ejemplo» under the stage. There is no qualifier here on purpose (the definition decides), and
 * the fire-station line of `fire-back-3` is voice-only: the panel covers the stage.
 */
export function S07P3(_props: SceneProps) {
  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.9, filter: 'saturate(0.85)' }}>
        <Furnace />
      </div>
      <QuestionTag />
    </Stage>
  );
}
