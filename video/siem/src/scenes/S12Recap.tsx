import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { STAGE } from '../../../engine/src/theme/tokens';
import { EASE, lerp, progress } from '../../../engine/src/theme/motion';
import { EndCard } from './parts/s12-recap/EndCard';
import { ExamReflexes } from './parts/s12-recap/ExamReflexes';
import { RecapSpine } from './parts/s12-recap/RecapSpine';
import { LOOP_BOX, ResponseLoop } from './parts/s12-recap/ResponseLoop';
import { wordFrame } from './parts/s12-recap/words';

/** Stage-local top of the loop box while it is the focus (clear of the spine parked above it). */
const LOOP_TOP = 124;
/** Once it steps aside it is scaled down and centred on the exam card's height. */
const LOOP_TOP_AFTER = 150;
const LOOP_SCALE_AFTER = 0.8;
/** Stage-local left of the loop box once it has stepped aside (its labels start ~34 px in). */
const LOOP_LEFT_AFTER = -24;
const EXAM = { left: 664, top: 96 };

/**
 * S12 "Para el examen" - the closing recap.
 *   recap-pipe  all five SIEM stages, each unveiled on its word (Enriquecer last)
 *   recap-loop  spine moves up; the Blue Team response ring builds node by node,
 *               Ajuste feeding the SIEM rules at the hub
 *   recap-exam  ring steps aside; violet card with the three exam reflexes
 *   endcard     everything clears; IntelForge end card holds to the last frame
 */
export function S12Recap({ cue }: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pipe = cue('recap-pipe');
  const loop = cue('recap-loop');
  const exam = cue('recap-exam');
  const endcard = cue('endcard');
  const word = (text: string, fallback: number) => wordFrame('s12-recap', text, fallback);

  // Everything clears before the end card arrives, so the card never lands on a ghosted frame.
  const clear = 1 - progress(frame, endcard - 18, 12, EASE.inOut);

  // The ring owns the stage centre during its beat, then steps aside for the exam card.
  const aside = progress(frame, exam - 6, 22, EASE.inOut);
  const loopLeft = lerp(aside, [0, 1], [(STAGE.width - LOOP_BOX.w) / 2 + 20, LOOP_LEFT_AFTER]);
  const loopTop = lerp(aside, [0, 1], [LOOP_TOP, LOOP_TOP_AFTER]);
  const loopScale = lerp(aside, [0, 1], [1, LOOP_SCALE_AFTER]);
  const loopOpacity = lerp(aside, [0, 1], [1, 0.5]) * clear;

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        <RecapSpine
          frame={frame}
          t={{
            lit: [
              word('agregar', pipe),
              word('normalizar', pipe + 16),
              word('enriqueciendo', pipe + 79),
              word('correlacionar', pipe + 38),
              word('alertar', pipe + 61),
            ],
            loop,
            exam,
            endcard,
          }}
        />

        {frame >= loop - 4 && loopOpacity > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              left: loopLeft,
              top: loopTop,
              opacity: loopOpacity,
              transform: `scale(${loopScale})`,
              transformOrigin: '0 0',
            }}
          >
            <ResponseLoop
              frame={frame}
              fps={fps}
              t={{
                loop,
                nodes: [
                  word('triaje', loop + 36),
                  word('contención', loop + 50),
                  word('corrección', loop + 71),
                  word('validación', loop + 93),
                  word('ajuste', loop + 116),
                ],
              }}
            />
          </div>
        ) : null}

        {frame >= exam - 4 && clear > 0.001 ? (
          <div style={{ position: 'absolute', left: EXAM.left, top: EXAM.top, opacity: clear }}>
            <ExamReflexes
              frame={frame}
              width={STAGE.width - EXAM.left}
              height={STAGE.height - EXAM.top - 14}
              t={{
                exam,
                items: [word('NetFlow', exam + 27), word('alert', exam + 71), word('archiving', exam + 143)],
              }}
            />
          </div>
        ) : null}

        <EndCard frame={frame} fps={fps} at={endcard} />
      </div>
    </AbsoluteFill>
  );
}
