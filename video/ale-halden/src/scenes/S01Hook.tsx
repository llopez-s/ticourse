import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { dimStyle, mix } from '../../../engine/src/ui';
import { PROMISE, QUESTION, TITLE } from '../data/s01-hook';
import { CHIP_H, CommitteeStamp, PromiseChip } from './parts/s01-hook/Bits';
import { HOT_CENTER, MATRIX_H, MATRIX_W, RiskMatrix } from './parts/s01-hook/Matrix';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The matrix group (stamp + matrix), in its own coordinates; it starts centred on the stage and glides left.
const GROUP_W = 960;
const GROUP_X0 = Math.round((W - GROUP_W) / 2);
const MATRIX_X = Math.round((GROUP_W - MATRIX_W) / 2);
const MATRIX_Y = 98;
// ---- The right column (stage coordinates): the question, then the title and the three chips.
const COL_X = 900;
const QUESTION_CY = MATRIX_Y + HOT_CENTER.y;
const QUESTION_SIZE = 150;
const TITLE_TOP = 232;
const TITLE_SIZE = 68;
const CHIPS_TOP = 408;
const CHIP_GAP = 12;

/**
 * s01-hook «Una casilla roja». From the first frame the committee's stamp and an empty three-by-three risk matrix
 * sit centred; the red cell lights on the voice's «casilla roja» (`heat`) with «R-014 · ALTO». On `ask` the group
 * glides left and the committee's question «¿cuánto?» fills the right, tied to the red cell by a thin line, with no
 * answer. Before 12 s (`title`) the question steps back and «El riesgo, en euros al año» lands under it; the
 * promise follows as three chips, each lit on its words (`promise`). After the last chip the red cell steps back.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const askAt = props.cue('ask');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  // The stamp is in from the first frames (the first scene has no enter overlap): the stage is never empty.
  const stampAt = -6;
  const hotAt = wordFrame(S, 's01-01', 'casilla') - 8;
  const labelAt = hotAt + 8;

  // ---- Stamp, then the group's glide to the left.
  const stampIn = enter(frame, stampAt, { distance: 16, duration: 16 });
  const glide = progress(frame, askAt - 14, 28, EASE.inOut);
  const groupX = mix(GROUP_X0, 0, glide);

  // ---- The question: lands on `ask`, steps back at the title.
  const questionIn = progress(frame, askAt + 6, 16);
  const tieIn = progress(frame, askAt + 10, 18, EASE.inOut);
  const back = progress(frame, titleAt - 8, 24, EASE.inOut);

  // ---- Title and chips.
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const chipAt = PROMISE.map((p, i) => {
    const at = wordFrame(S, 's01-02', p.word, p.nth) - 6;
    return i === 0 ? Math.min(at, props.cue('promise') + 14) : at;
  });
  const lastWord = wordFrame(S, 's01-02', 'cuenta') - 6;
  const dim = progress(frame, lastWord, 22, EASE.inOut);

  const tieX0 = MATRIX_X + HOT_CENTER.x + 108 + 8; // right edge of the red cell, group coordinates
  const tieLen = COL_X - 14 - tieX0;

  return (
    <Stage>
      {/* Stamp and matrix */}
      <div style={{ position: 'absolute', left: groupX, top: 0, width: GROUP_W, height: MATRIX_Y + MATRIX_H + 60 }}>
        {frame >= stampAt - 2 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: GROUP_W, display: 'flex', justifyContent: 'center', ...stampIn }}>
            <CommitteeStamp />
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: MATRIX_X, top: MATRIX_Y, ...dimStyle(0.5 * dim) }}>
          <RiskMatrix frame={frame} fps={fps} hotAt={hotAt} labelAt={labelAt} dim={dim} />
        </div>
        {/* The thin line from the red cell to the question */}
        {tieIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: tieX0,
              top: MATRIX_Y + HOT_CENTER.y - 1.5,
              width: tieLen * tieIn,
              height: 0,
              borderTop: `3px dashed ${alpha(C.roseSoft, 0.7)}`,
              opacity: 1 - 0.5 * back,
            }}
          />
        ) : null}
      </div>

      {/* The committee's question, with no answer */}
      {questionIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: COL_X,
            top: QUESTION_CY - QUESTION_SIZE * 0.55,
            height: QUESTION_SIZE * 1.1,
            display: 'flex',
            alignItems: 'center',
            fontFamily: FONT.sans,
            fontSize: QUESTION_SIZE,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 1,
            color: C.cyan,
            textShadow: `0 0 40px ${alpha(C.cyan, 0.35)}`,
            whiteSpace: 'nowrap',
            transformOrigin: 'left center',
            opacity: questionIn * mix(1, 0.8, back),
            transform: `translateX(${(1 - questionIn) * 40}px) scale(${mix(1, 0.5, back)})`,
          }}
        >
          {QUESTION}
        </div>
      ) : null}

      {/* Title and promise */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: TITLE_TOP, fontFamily: FONT.sans, ...titleIn }}>
          {TITLE.map((l, k) => (
            <div
              key={k}
              style={{ fontSize: TITLE_SIZE, fontWeight: 900, letterSpacing: -1.2, lineHeight: 1.06, color: C.textStrong, whiteSpace: 'nowrap', textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}` }}
            >
              {l}
            </div>
          ))}
        </div>
      ) : null}
      {PROMISE.map((p, i) => {
        if (frame < chipAt[i] - 2) return null;
        const e = enter(frame, chipAt[i], { distance: 16 });
        const on = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord + 10) - 2, 12, EASE.inOut));
        return (
          <div key={p.text} style={{ position: 'absolute', left: COL_X, top: CHIPS_TOP + i * (CHIP_H + CHIP_GAP), ...e }}>
            <PromiseChip icon={p.icon} text={p.text} on={on} />
          </div>
        );
      })}
    </Stage>
  );
}
