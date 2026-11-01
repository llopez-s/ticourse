import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, PROMISE, SEAL, TITLE } from '../data/s01-hook';
import { ExamScreenArt } from './parts/ExamScreenArt';
import { CHIP_H, Pill, PlaqueChip, SealStamp } from './parts/Labels';
import { PORT_ART, PortArt } from './parts/PortArt';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// Left group: the night port, which melts into the blank exam screen (same box, 820×520).
const ART_TOP = 104;
const ART_X0 = Math.round((W - PORT_ART.w) / 2);
const ART_X1 = 0;
// Right column: plaque, title, promise chips.
const COL_X = 930;
const PLAQUE_TOP = 96;
const TITLE_TOP = 168;
const TITLE_SIZE = 108;
const CHIPS_TOP = 424;
const CHIP_GAP = 16;

/**
 * s01-hook «Del puerto a la pantalla». The seal «Autoridad Portuaria de Halden · del puerto al examen» sits centred from
 * the first frame (no date, no «caso de ejemplo»). On `port` the night port comes in; on `screen` it melts into a blank
 * exam screen («1 / 90», «90:00»); before 12 s (`title`) the group and the seal glide left and «Del puerto / al examen»
 * lands on the right under the plate «SY0-701»; the promise follows as three chips (`promise`), each lit on its words.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const sealAt = -6;
  const portAt = 6;
  const screenAt = props.cue('screen') - 6;
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p, i) => {
    const at = wordFrame(S, p.seg, p.word) - 8;
    return i === 0 ? Math.min(at, props.cue('promise') + 2) : at;
  });
  const lastWord = wordFrame(S, 's01-02', 'tienes') + 24;

  const sealP = progress(frame, sealAt, 16);
  const portIn = enter(frame, portAt, { distance: 20, duration: 22 });
  const melt = progress(frame, screenAt, 30, EASE.inOut);
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const artX = mix(ART_X0, ART_X1, glide);

  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));

  return (
    <Stage>
      {/* Seal: centred at first, left-aligned once the group glides */}
      <div
        style={{
          position: 'absolute',
          left: mix(W / 2, 0, glide),
          top: 0,
          opacity: sealP,
          transform: `translate(${-50 * (1 - glide)}%, ${(1 - sealP) * 16}px)`,
        }}
      >
        <SealStamp what={SEAL.what} kind={SEAL.kind} />
      </div>

      {/* The night port melting into the exam screen */}
      <div style={{ position: 'absolute', left: artX, top: ART_TOP, width: PORT_ART.w, height: PORT_ART.h, opacity: portIn.opacity }}>
        <div style={{ position: 'absolute', inset: 0, transform: portIn.transform, opacity: 1 - melt }}>
          <PortArt />
        </div>
        <div style={{ position: 'absolute', inset: 0, opacity: melt, transform: `translateY(${(1 - melt) * 10}px) scale(${0.97 + 0.03 * melt})`, transformOrigin: '50% 50%' }}>
          <ExamScreenArt glow={melt} />
        </div>
      </div>

      {/* Plate, title and promise */}
      {frame >= titleAt - 6 ? (
        <div style={{ position: 'absolute', left: COL_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: TITLE_TOP, fontFamily: FONT.sans, ...titleIn }}>
          {TITLE.map((l, k) => (
            <div
              key={k}
              style={{
                fontSize: TITLE_SIZE,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.04,
                color: k === 0 ? C.textStrong : C.cyan,
                whiteSpace: 'nowrap',
                textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      ) : null}
      {PROMISE.map((p, i) => {
        if (frame < chipAt[i] - 2) return null;
        const e = enter(frame, chipAt[i], { distance: 16 });
        return (
          <div key={p.text} style={{ position: 'absolute', left: COL_X, top: CHIPS_TOP + i * (CHIP_H + CHIP_GAP), ...e }}>
            <Pill icon={p.icon} text={p.text} on={chipOn[i]} tone={C.cyan} size={36} />
          </div>
        );
      })}
    </Stage>
  );
}
