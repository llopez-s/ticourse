import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { EscapeRoom } from './parts/Images';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { LessonGridArt } from './parts/QuestionArt';
import { Stage, wordFrame } from './kit';

const S = 's10-p4';

/**
 * s10-p4 «Una cuenta de alumno». The engine's ExamQuestionLayer draws question 4 (with «MEJOR») over this scene from
 * s10-01 to its end, so the stage is a still, dim, textless grid of lesson tiles (an online course platform, no name)
 * plus «pregunta tipo examen · ejemplo». On `escape-back` the escape room comes back in one line under the panel: the
 * three rooms in miniature with the middle one — one hint — lit and the plan struck, «una pista, no el plano».
 */
export function S10P4(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('escape-back');
  const backIn = progress(frame, backAt, 14);
  const hintOn = progress(frame, backAt + 4, 14);
  const planAt = Math.max(backAt + 22, wordFrame(S, 's10-03', 'plano') - 10);
  const planIn = progress(frame, planAt, 12);

  return (
    <Stage>
      <QuestionFrame>
        <LessonGridArt />
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ opacity: 0.35 }}>
            <EscapeRoom kind="none" width={132} lit={0} />
          </div>
          <div style={{ opacity: 0.4 + 0.6 * hintOn }}>
            <EscapeRoom kind="hint" width={132} lit={hintOn} />
          </div>
          <div style={{ position: 'relative', opacity: 0.4 }}>
            <EscapeRoom kind="plan" width={132} lit={0} />
            <div style={{ position: 'absolute', left: -6, right: -6, top: '50%', height: 5, borderRadius: 3, background: C.rose, transform: `scaleX(${planIn}) rotate(-12deg)`, transformOrigin: '0 50%' }} />
          </div>
        </div>
        <SlotText size={42}>
          <span style={{ color: C.cyanSoft }}>una pista</span>
          <span>, no el plano</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
