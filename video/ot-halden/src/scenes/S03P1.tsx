import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { FireTruck, ImageTag } from './parts/Firehouse';
import { Pill } from './parts/Labels';
import { QuestionFrame, SlotLine } from './parts/s03-p1/QuestionFrame';
import { TunnelArt } from './parts/s03-p1/TunnelArt';
import { Stage, wordFrame } from './kit';

const S = 's03-p1';

/**
 * s03-p1 «La ventilación de un túnel». The engine's ExamQuestionLayer draws question 1 (scenario, question with
 * «MEJOR», options, the 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its
 * end, so the stage is a still, dim, textless background (the mouth of a road tunnel) plus «pregunta tipo examen ·
 * ejemplo» under it. Everything the voice adds lives in the band under the panel: the «MEJOR» line on `best`
 * (the panel is above the scene, so «MEJOR» itself cannot be highlighted inside the question) and, on `fire-back-1`,
 * the fire-station line (a truck in its shed, no crew).
 */
export function S03P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best');
  const mejorAt = wordFrame(S, 's03-01', 'mejor', 1);
  const fbAt = props.cue('fire-back-1');
  const camionAt = wordFrame(S, 's03-04', 'camión');
  const dotacionAt = wordFrame(S, 's03-04', 'dotación');

  const bestIn = progress(frame, bestAt - 4, 14);
  const bestOut = progress(frame, fbAt - 10, 12);
  const mejor = progress(frame, mejorAt - 4, 10);
  const fbIn = progress(frame, fbAt, 14);
  const truckOn = progress(frame, camionAt - 4, 10);
  const crewOn = progress(frame, dotacionAt - 4, 10);

  return (
    <Stage>
      <QuestionFrame>
        <TunnelArt />
      </QuestionFrame>

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

      {/* fire-back-1: «un camión en la nave, sin dotación, no está de guardia» */}
      <SlotLine opacity={fbIn} dy={(1 - fbIn) * 14}>
        <FireTruck size={72} garage crew={false} tone={C.sky} glow={0.2 + 0.5 * crewOn} />
        <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
          <span style={{ opacity: 0.8 + 0.2 * truckOn }}>un camión en la nave, </span>
          <span style={{ color: alpha(C.rose, 1), opacity: 0.8 + 0.2 * crewOn }}>sin dotación</span>
          <span>, no está de guardia</span>
        </div>
        <ImageTag size={26} />
      </SlotLine>
    </Stage>
  );
}
