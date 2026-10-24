import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { ImageTag, Pill } from './parts/Labels';
import { NurseryHouse, SelfReport } from './parts/Nursery';
import { ReportStackArt } from './parts/QuestionArt';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { Stage, wordFrame } from './kit';

const S = 's03-p1';

/**
 * s03-p1 «Un informe muy serio». The engine's ExamQuestionLayer draws question 1 (scenario, question, options, the 5 s
 * countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the stage is a
 * still, dim, textless background — a pile of bound reports — plus «pregunta tipo examen · ejemplo» bottom right. First
 * qualifier of the video: on `best` the scene draws, under the panel, «MEJOR: la que encaja con este caso, aunque otra
 * suene bien» (the panel does not), brighter on the spoken «mejor». Then one short line per resolution cue: `ok-1`
 * (the self-made report), `trap-1` (looks independent, was written by the audited). On `nursery-back` the nursery
 * comes back in one line: its report about itself can be very serious, and it is still its own.
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const q1At = props.cue('q1');
  const bestAt = props.cue('best');
  const okAt = props.cue('ok-1');
  const trapAt = props.cue('trap-1');
  const backAt = props.cue('nursery-back');
  const mejorAt = wordFrame(S, 's03-01', 'mejor', 1);

  const bgIn = progress(frame, q1At - 4, 16);
  const bestIn = progress(frame, bestAt - 4, 14);
  const bestOut = progress(frame, okAt - 10, 12);
  const mejor = progress(frame, mejorAt - 4, 10);
  const okIn = progress(frame, okAt, 14);
  const okOut = progress(frame, trapAt - 8, 10);
  const trapIn = progress(frame, trapAt, 14);
  const trapOut = progress(frame, backAt - 10, 12);
  const backIn = progress(frame, backAt, 14);
  const suyoAt = wordFrame(S, 's03-03', 'suyo') - 6;
  const suyo = progress(frame, suyoAt, 10);

  return (
    <Stage>
      <div style={{ opacity: bgIn }}>
        <QuestionFrame>
          <ReportStackArt />
        </QuestionFrame>
      </div>

      {/* «MEJOR: la que encaja con este caso, aunque otra suene bien» (the voice says the idea in its own words) */}
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

      {/* ok-1 */}
      <SlotLine opacity={okIn * (1 - okOut)} dy={(1 - okIn) * 14}>
        <Icon name="check" size={52} color={C.emerald} strokeWidth={2.6} />
        <SlotText size={40}>
          <span>un informe del propio proveedor: </span>
          <span style={{ color: '#6ee7b7' }}>evidence of internal audits</span>
        </SlotText>
      </SlotLine>

      {/* trap-1 */}
      <SlotLine opacity={trapIn * (1 - trapOut)} dy={(1 - trapIn) * 14}>
        <Icon name="alert" size={52} color={C.amber} strokeWidth={2.4} />
        <SlotText size={40}>
          <span>parece serio, </span>
          <span style={{ color: C.amber }}>pero lo hizo el auditado</span>
        </SlotText>
      </SlotLine>

      {/* nursery-back: two lines, the house on the left */}
      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <NurseryHouse width={104} />
            <SelfReport width={64} />
          </div>
          <ImageTag size={26} />
        </div>
        <SlotText size={40}>
          <div>el informe que se hace la guardería a sí misma</div>
          <div>
            <span>puede ser muy serio, y </span>
            <span style={{ color: C.amber, opacity: 0.7 + 0.3 * suyo }}>sigue siendo suyo</span>
          </div>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
