import type { SceneProps } from '../../../engine/src/timeline/types';
import { STAGE } from '../../../engine/src/theme/tokens';
import { ART_FLOOR } from '../data/s02-difusion';
import { ART_ASPECT, Illustration } from './parts/Illustration';
import { QuestionTagFallback } from './parts/Tags';
import { Stage } from './kit';

const PLATE_H = STAGE.height;
const PLATE_W = Math.round(PLATE_H * ART_ASPECT);

/**
 * s03-p1 «Sesenta equipos». Question 1 is drawn by the ENGINE (ExamQuestionLayer) over this scene from s03-01 to its
 * end — scenario, question, options, countdown, answer (`ok-1`) and trap (`trap-1`) — and so is the card with the rule
 * on `rule-a`. The scene is only a still, textless background, present from the first frame and never moving: the
 * open-plan floor of s02 WITHOUT partitions, dimmed and desaturated (no ImageTag: nothing is said about it here). Its
 * only text is «pregunta tipo test · ejemplo» under the stage, which the engine draws from the question's `tag` (the
 * fallback here draws it only while the timeline lacks that field).
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <div style={{ position: 'absolute', left: Math.round((STAGE.width - PLATE_W) / 2), top: 0 }}>
        <Illustration src={ART_FLOOR} width={PLATE_W} height={PLATE_H} dim={0.55} saturate={0.6} />
      </div>
      <QuestionTagFallback scene="s03-p1" />
    </Stage>
  );
}
