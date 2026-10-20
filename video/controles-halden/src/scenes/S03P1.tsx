import type { SceneProps } from '../../../engine/src/timeline/types';
import { NightOffice } from './parts/s03-p1/NightOffice';
import { Stage } from './kit';

/**
 * s03-p1 «Al cerrar la oficina». Exam question 1 is drawn by the ENGINE (ExamQuestionLayer) over this scene from
 * s03-01 to the end — question, options, countdown, reveal (`ok-1`), trap (`trap-1`) and the exam card (`norm`).
 * The scene itself is only a still, half-lit, textless background (the office at night, papers left out on the
 * desks), present from the first frame and never moving, so nothing competes with the card.
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <NightOffice />
    </Stage>
  );
}
