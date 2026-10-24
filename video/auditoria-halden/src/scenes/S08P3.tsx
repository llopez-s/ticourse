import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { ModePill, MODES } from './parts/Modes';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { SocRoomArt } from './parts/QuestionArt';
import { Stage, wordFrame } from './kit';

const S = 's08-p3';

/**
 * s08-p3 «Un ejercicio en el banco». The engine's ExamQuestionLayer draws question 3 (with «MEJOR», already explained
 * in s06) over this scene from s08-01 to its end, so the stage is a still, dim, textless operations room with its
 * screens dark (a bank's, no name) plus «pregunta tipo examen · ejemplo». On `blue-back` the four modes of s07 come back
 * in miniature under the panel with BLUE lit — physical, red and purple step back — and the line «nadie persigue nada: se
 * mide al SOC» lands on «SOC».
 */
export function S08P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('blue-back');
  const backIn = progress(frame, backAt, 14);
  const blueOn = progress(frame, backAt + 6, 14);
  const lineIn = progress(frame, Math.max(backAt + 10, wordFrame(S, 's08-04', 'SOC') - 16), 14);

  return (
    <Stage>
      <QuestionFrame>
        <SocRoomArt />
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {MODES.map((m) => (
            <ModePill key={m.id} mode={m} on={m.id === 'blue' ? blueOn : 0} opacity={m.id === 'blue' ? 0.45 + 0.55 * blueOn : 0.5 - 0.15 * blueOn} />
          ))}
        </div>
        <SlotText size={40}>
          <span style={{ opacity: 0.3 + 0.7 * lineIn }}>
            nadie persigue nada: se mide al <span style={{ color: C.cyan }}>SOC</span>
          </span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
