import type { SceneProps } from '../../../engine/src/timeline/types';
import { NewSite } from './parts/s03-p1/NewSite';
import { QuestionTag } from './parts/Tags';
import { Stage } from './kit';

/**
 * s03-p1 «Una web antes de abrirla». Exam question 1 is drawn by the ENGINE (ExamQuestionLayer) over this scene from
 * s03-01 to the end — scenario, question with «MEJOR», options, countdown, answer (`ok-1`) and trap (`trap-1`) — and
 * the exam card after the trap (`passerby`). The scene itself is a still, textless background, present from the first
 * frame and never moving: a new website half open, its shutter half raised. The only text is the label «pregunta tipo
 * examen · ejemplo» at the bottom of the stage (the engine's panel prints only «EXAMEN · SY0-701 · 4.3»). The
 * `passerby` line (la consulta) is voice only: the panel still covers the stage then.
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.75 }}>
        <NewSite />
      </div>
      <QuestionTag />
    </Stage>
  );
}
