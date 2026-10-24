import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Pill } from './parts/Labels';
import { QuestionFrame, SlotLine } from './parts/Question';
import { MailboxArt } from './parts/QuestionArt';
import { Stage } from './kit';

/** A small numbered node of the reporting loop (steps 2–4 of s04), dim in this scene. */
function Node({ n, on }: { n: number; on: number }) {
  return (
    <div style={{ width: 58, height: 58, borderRadius: 29, boxSizing: 'border-box', border: `3px solid ${alpha(C.cyan, 0.3 + 0.2 * on)}`, background: alpha(C.cyan, 0.05), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color: alpha(C.text, 0.55) }}>{n}</div>
  );
}

function Link() {
  return <div style={{ width: 36, height: 0, borderTop: `3px dashed ${alpha(C.cyan, 0.35)}` }} />;
}

/**
 * s05-p2 «Uno de cada veinte». The engine's ExamQuestionLayer draws question 2 (scenario, question with «MEJOR» — already
 * explained in s03, so only the panel's own capitals —, options, the 5 s countdown, the answer on `ok-2`, the trap on
 * `trap-2`) over this scene from s05-01 to its end, so the stage is a still, dim, textless background (a generic mailbox
 * whose toolbar has an empty dashed slot) plus «pregunta tipo examen · ejemplo» bottom-right. On `ok-2` the slot
 * behind the panel fills with the report button, and under the panel the first step of s04's loop lights — «botón en el
 * correo» — followed by the three dim steps; on `trap-2` an amber note joins it: «ya saben reconocerlo».
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const qAt = props.cue('q2');
  const okAt = props.cue('ok-2');
  const trapAt = props.cue('trap-2');

  const dim = progress(frame, qAt, 18);
  const okIn = progress(frame, okAt - 2, 14);
  const trapIn = progress(frame, trapAt - 2, 14);

  return (
    <Stage>
      <QuestionFrame dim={dim}>
        <MailboxArt react={okIn} />
      </QuestionFrame>

      <SlotLine opacity={okIn} dy={(1 - okIn) * 14} gap={20}>
        <Pill text="botón en el correo" tone={C.cyan} icon="cursor" size={42} height={72} weight={850} on={0.4 + 0.6 * okIn} />
        <Link />
        <Node n={2} on={okIn} />
        <Link />
        <Node n={3} on={okIn} />
        <Link />
        <Node n={4} on={okIn} />
        <div style={{ width: 28 }} />
        <div style={{ opacity: trapIn, transform: `translateX(${(1 - trapIn) * 16}px)` }}>
          <Pill text="ya saben reconocerlo" tone={C.amber} icon="eye" size={38} height={64} weight={800} on={0.5} />
        </div>
      </SlotLine>
    </Stage>
  );
}
