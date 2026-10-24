import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { BEHAVIOUR_TONE } from '../data/canon';
import { Face } from './parts/Face';
import { Pill } from './parts/Labels';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { BrowserArt } from './parts/QuestionArt';
import { Stage, wordFrame } from './kit';

const S = 's03-p1';
const TONE = BEHAVIOUR_TONE.risky;

/** A face with a small badge on its shoulder: the picture of one side of the comparison. */
function BadgedFace({ icon, glow }: { icon: 'split' | 'mail'; glow: number }) {
  return (
    <div style={{ position: 'relative', width: 92, height: 92 }}>
      <Face size={92} tone={TONE} mood="knowing" glow={glow} idSuffix={`-${icon}`} />
      <div style={{ position: 'absolute', right: -14, bottom: -4, width: 40, height: 40, borderRadius: 12, background: C.ink900, border: `3px solid ${TONE}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={24} color={TONE} />
      </div>
    </div>
  );
}

/**
 * s03-p1 «Una extensión». The engine's ExamQuestionLayer draws question 1 (scenario, question with «MEJOR», options, the
 * 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its end, so the stage is a
 * still, dim, textless background — a generic browser window with an extension in its toolbar and a warning dialog —
 * plus «pregunta tipo examen · ejemplo» bottom-right. On `best` the line of V28, «MEJOR: la que encaja con este caso,
 * aunque otra suene bien», comes under the panel (lit on the voice's «mejor», it steps back on `ok-1` and leaves before
 * the trap's cue); behind the panel the extension glows on `ok-1` and a sheet leaves the window on `trap-1`. On
 * `face-back` the resolution: the employee's face next to the first face of s02 — «igual que quien reenvía documentos a
 * su correo personal», the sentence the voice says.
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const qAt = props.cue('q1');
  const bestAt = props.cue('best');
  const okAt = props.cue('ok-1');
  const trapAt = props.cue('trap-1');
  const backAt = props.cue('face-back');
  const mejorAt = wordFrame(S, 's03-01', 'mejor', 1);

  const dim = progress(frame, qAt, 18);
  const bestIn = progress(frame, bestAt - 4, 14);
  const mejor = progress(frame, mejorAt - 4, 10);
  const afterOk = progress(frame, okAt, 14);
  const bestOut = progress(frame, trapAt - 8, 12);
  const backIn = progress(frame, backAt - 4, 14);

  return (
    <Stage>
      <QuestionFrame dim={dim}>
        <BrowserArt react={afterOk} up={progress(frame, trapAt, 20)} />
      </QuestionFrame>

      {/* «MEJOR: la que encaja con este caso, aunque otra suene bien» (the voice says the idea in its own words) */}
      <SlotLine opacity={bestIn * (1 - 0.45 * afterOk) * (1 - bestOut)} dy={(1 - bestIn) * 14}>
        <Pill
          tone={C.amber}
          on={(0.35 + 0.65 * mejor) * (1 - 0.6 * afterOk)}
          size={40}
          height={70}
          text={
            <span>
              <span style={{ fontWeight: 900, color: C.amber, letterSpacing: 1 }}>MEJOR:</span> la que encaja con este caso, aunque otra suene bien
            </span>
          }
        />
      </SlotLine>

      {/* resolution: the same behaviour as the first face of s02 */}
      <SlotLine opacity={backIn} dy={(1 - backIn) * 14} gap={26}>
        <BadgedFace icon="split" glow={0.6 * backIn} />
        <svg width={56} height={40} viewBox="0 0 56 40">
          <rect x={6} y={8} width={44} height={7} rx={3.5} fill={alpha(C.text, 0.9)} />
          <rect x={6} y={25} width={44} height={7} rx={3.5} fill={alpha(C.text, 0.9)} />
        </svg>
        <BadgedFace icon="mail" glow={0.6 * backIn} />
        <SlotText size={40}>
          <span>igual que quien reenvía documentos a </span>
          <span style={{ color: C.amber }}>su correo personal</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
