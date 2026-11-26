import type { SceneProps } from '../../../engine/src/timeline/types';
import { STAGE } from '../../../engine/src/theme/tokens';
import { WrapperStack } from './parts/s04-arp/bits';
import { QuestionTagFallback } from './parts/Tags';
import { Stage } from './kit';

const W = 1240;
const H = 470;

/**
 * s03-p1 «El conmutador de la planta». Question 1 is drawn by the ENGINE (ExamQuestionLayer) over this scene from
 * s03-01 to its end — scenario, question, options, countdown, answer (`ok-1`), trap (`trap-1`) — and so is the card
 * with the rule on `rule-a`, and the «pregunta tipo test · ejemplo» label (the question's `tag`). The scene is only
 * a still, textless background, present from the first frame and never moving: the wrapper stack at half light.
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <div style={{ position: 'absolute', left: Math.round((STAGE.width - W) / 2), top: Math.round((STAGE.height - H) / 2), opacity: 0.5, filter: 'saturate(0.7)' }}>
        <WrapperStack width={W} height={H} />
      </div>
      <QuestionTagFallback scene="s03-p1" />
    </Stage>
  );
}
