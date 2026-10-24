import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { SENSORS } from '../data/canon';
import { Pill } from './parts/Labels';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { SensorRoom } from './parts/SensorRoom';
import { PlanBackground } from './S03P1';
import { Stage, wordFrame } from './kit';

const S = 's05-p2';

/**
 * s05-p2 «Un despacho con ventana». The engine's ExamQuestionLayer draws question 2 (with «MEJOR» in its question) over
 * this scene from s05-01 to its end, so the stage is the still, dim example plan plus «pregunta tipo examen · ejemplo».
 * First qualifier of the video: on `best` the scene draws, under the panel, «MEJOR: la que encaja con este caso, aunque
 * otra suene bien» (the panel does not), brighter on the spoken «mejor». On `rooms-back` the four rooms come back in one
 * line — ultrasonic lit — with «no valía el que más cubre, sino el que no fallaba en ese despacho».
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best');
  const backAt = props.cue('rooms-back');
  const mejorAt = wordFrame(S, 's05-01', 'mejor', 1);
  const bestIn = progress(frame, bestAt - 4, 14);
  const bestOut = progress(frame, backAt - 12, 12);
  const mejor = progress(frame, mejorAt - 4, 10);
  const backIn = progress(frame, backAt, 14);

  return (
    <Stage>
      <QuestionFrame>
        <PlanBackground idSuffix="-s5" />
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
        <div style={{ display: 'flex', gap: 8 }}>
          {SENSORS.map((s) => (
            <div key={s.kind} style={{ opacity: s.kind === 'ultrasonic' ? 1 : 0.4 }}>
              <SensorRoom kind={s.kind} width={84} on={s.kind === 'ultrasonic' ? 1 : 0.3} weak={0.6} t={frame} idSuffix="-s5" />
            </div>
          ))}
        </div>
        <SlotText size={36}>
          <span style={{ color: C.muted }}>no valía el que más cubre, </span>
          <span>sino el que no fallaba en ese despacho</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
