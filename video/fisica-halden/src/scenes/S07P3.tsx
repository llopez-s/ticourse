import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, STAGE } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { DECOYS } from '../data/canon';
import { Decoy, DECOY } from './parts/Decoy';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { Stage } from './kit';

const BG_W = 380;
const BG_GAP = 36;

/**
 * s07-p3 «Un estudio de arquitectura». The engine's ExamQuestionLayer draws question 3 (with «MEJOR», only highlighted:
 * it was explained in s05) over this scene from s07-01 to its end, so the stage is a still, dim, textless background —
 * the four decoys of s06 in a row — plus «pregunta tipo examen · ejemplo». On `four-back` the four decoys come back in
 * one line under the panel, the honeyfile lit: «el fichero va por donde pasa el ransomware».
 */
export function S07P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('four-back');
  const backIn = progress(frame, backAt, 14);
  const rowW = DECOYS.length * BG_W + (DECOYS.length - 1) * BG_GAP;
  const h = (BG_W * DECOY.h) / DECOY.w;
  return (
    <Stage>
      <QuestionFrame>
        <div style={{ position: 'absolute', left: (STAGE.width - rowW) / 2, top: (STAGE.height - h) / 2, display: 'flex', gap: BG_GAP, opacity: 0.6 }}>
          {DECOYS.map((d) => (
            <Decoy key={d.kind} kind={d.kind} width={BG_W} on={0.5} />
          ))}
        </div>
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <div style={{ display: 'flex', gap: 10 }}>
          {DECOYS.map((d) => (
            <div key={d.kind} style={{ opacity: d.kind === 'honeyfile' ? 1 : 0.4 }}>
              <Decoy kind={d.kind} width={88} on={d.kind === 'honeyfile' ? 1 : 0.3} alarm={d.kind === 'honeyfile' ? 1 : 0} />
            </div>
          ))}
        </div>
        <SlotText>
          <span style={{ color: C.cyanSoft }}>el fichero</span>
          <span> va por donde pasa el ransomware</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
