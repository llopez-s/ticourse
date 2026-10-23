import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Pill, StrikeLine } from './parts/Labels';
import { EnvelopeArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { ExportSheet } from './parts/s04-metodos/Bits';
import { Stage, wordFrame } from './kit';

const S = 's05-p2';

/**
 * s05-p2 «La lista para la gestoría». The engine's ExamQuestionLayer draws question 2 (with «MEJOR» in its question)
 * over this scene from s05-01 to its end, so the stage is a still, dim envelope with a sheet of unreadable squiggles
 * plus «pregunta tipo examen · ejemplo». First qualifier of the video: on `best` the scene draws, under the panel,
 * «MEJOR: la que encaja con este caso, aunque otra suene bien» (the panel does not), brighter on the spoken «mejor». On
 * `export-back` s04's struck export comes back in one line: «como la exportación: que no se lea no la protege».
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best');
  const backAt = props.cue('export-back');
  const mejorAt = wordFrame(S, 's05-01', 'mejor', 1);
  const bestIn = progress(frame, bestAt - 4, 14);
  const bestOut = progress(frame, backAt - 12, 12);
  const mejor = progress(frame, mejorAt - 4, 10);
  const backIn = progress(frame, backAt, 14);

  return (
    <Stage>
      <QuestionFrame>
        <EnvelopeArt />
      </QuestionFrame>

      <SlotLine opacity={bestIn * (1 - bestOut)} dy={(1 - bestIn) * 14}>
        <Pill
          tone={C.amber}
          on={0.35 + 0.65 * mejor}
          size={40}
          height={70}
          text={
            <span>
              <span style={{ fontWeight: 900, color: C.amber, letterSpacing: 1 }}>MEJOR:</span> la que encaja con este caso, aunque otra suene bien
            </span>
          }
        />
      </SlotLine>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <div style={{ position: 'relative', width: 230, height: 64 }}>
          <div style={{ transform: 'scale(0.46)', transformOrigin: '0 0' }}>
            <ExportSheet shuffle={1} width={500} />
          </div>
          <StrikeLine strike={1} />
        </div>
        <SlotText size={40}>
          <span style={{ color: C.muted }}>como la exportación: </span>
          <span>que no se lea </span>
          <span style={{ color: C.roseSoft }}>no la protege</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
