import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PROMISE, TITLE } from '../data/s01-hook';
import { ControlTag } from './parts/ControlTag';
import { LOCK_RATIO, LOCK_TIE, Lock } from './parts/Lock';
import { BoxGlow, CHIP_H, CaseStamp, PlaqueChip, PromiseChip } from './parts/s01-hook/Bits';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The lock group (lock + hanging tag), in its own coordinates.
const LOCK_W = 320;
const LOCK_H = Math.round(LOCK_W * LOCK_RATIO);
const TAG_W = 420;
/** ControlTag's string ends at tag-local (0, 26·s): that point sits on the lever's tie. */
const TAG_STRING_END = 26;
const TIE = { x: LOCK_TIE.x * LOCK_W, y: LOCK_TIE.y * LOCK_H };
const TAG_X = TIE.x;
const TAG_Y = TIE.y - TAG_STRING_END;
const GROUP_W = TAG_X + TAG_W;
const GROUP_X0 = Math.round((W - GROUP_W) / 2);
const GROUP_X1 = 30;
const GROUP_Y = 126;
// ---- The stamp: centred over the stage at first, left-aligned once the group has glided.
const STAMP_W = 900; // approximate, only to centre it
const STAMP_X0 = Math.round((W - STAMP_W) / 2);
// ---- The right column (stage coordinates): plate, title and the three chips.
const COL_X = 800;
const PLAQUE_TOP = 104;
const TITLE_TOP = 172;
const TITLE_SIZE = 84;
const CHIPS_TOP = 392;
const CHIP_GAP = 14;

/**
 * s01-hook «Una cerradura, dos preguntas». From the first frame the case stamp and a door's lever lock sit centred;
 * the lock's halo lights on `lock`. On `tag` the two-box ControlTag drops onto the lever's end and swings to rest,
 * both boxes empty; on «dos maneras» the two boxes glow once. Before 12 s (`title`) the group glides left and
 * «Un control, dos etiquetas» lands on the right under the plate «SY0-701 · 1.1»; the promise follows as three
 * chips, each lit on its words (`promise`), and each chip lights the tag box it belongs to (category up, type down).
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  // The first scene has no enter overlap: stamp and lock are in from the first frames, so the stage is never empty.
  const stampAt = -6;
  const lockAt = props.cue('lock');
  const tagAt = props.cue('tag') - 4;
  const twoAt = wordFrame(S, 's01-01', 'dos') - 4;
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p, i) => {
    const at = wordFrame(S, 's01-02', p.word) - 6;
    return i === 0 ? Math.min(at, props.cue('promise') + 14) : at;
  });
  const lastWord = wordFrame(S, 's01-02', 'otro') + 6;

  // ---- Stamp + group, then the glide to the left.
  const stampIn = enter(frame, stampAt, { distance: 16, duration: 16 });
  const lockIn = enter(frame, stampAt + 4, { distance: 20, duration: 20 });
  const glow = 0.25 + 0.75 * progress(frame, lockAt - 4, 24);
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const groupX = mix(GROUP_X0, GROUP_X1, glide);
  const stampX = mix(STAMP_X0, 0, glide);

  // ---- The tag drops and swings to rest about the string's end (damped, no steady oscillation).
  const tagDrop = progress(frame, tagAt, 16);
  const t = Math.max(0, frame - tagAt);
  const swing = frame < tagAt ? 0 : 7 * Math.exp(-t / 22) * Math.sin((2 * Math.PI * 0.55 * t) / 30 + 0.6);
  // Both boxes glow on «dos maneras», then rest.
  const twoGlow = progress(frame, twoAt, 10) * (1 - progress(frame, twoAt + 40, 24, EASE.inOut));

  // ---- Chips: each lit while the voice is on it, stepping back as the next starts.
  const chipLive = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  // The tag box a chip belongs to glows only while the voice is on that chip.
  const boxGlow = (box: 'top' | 'bottom') => Math.max(twoGlow, ...PROMISE.map((p, i) => (p.box === box ? chipLive[i] : 0)));
  const topGlow = boxGlow('top');
  const bottomGlow = boxGlow('bottom');

  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });

  return (
    <Stage>
      {/* Case stamp */}
      <div style={{ position: 'absolute', left: stampX, top: 0, ...stampIn }}>
        <CaseStamp />
      </div>

      {/* Lock and its tag */}
      <div style={{ position: 'absolute', left: groupX, top: GROUP_Y, width: GROUP_W, height: LOCK_H }}>
        <div style={{ position: 'absolute', left: 0, top: 0, ...lockIn }}>
          <Lock width={LOCK_W} glow={glow} />
        </div>
        {tagDrop > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              left: TAG_X,
              top: TAG_Y,
              width: TAG_W,
              opacity: tagDrop,
              transformOrigin: `0px ${TAG_STRING_END}px`,
              transform: `translateY(${(1 - tagDrop) * -26}px) rotate(${swing}deg)`,
            }}
          >
            <ControlTag frame={frame} width={TAG_W} />
            <BoxGlow box="top" tone={C.cyan} on={topGlow} />
            <BoxGlow box="bottom" tone={C.violet} on={bottomGlow} />
          </div>
        ) : null}
      </div>

      {/* Plate, title and promise */}
      {frame >= titleAt - 6 ? (
        <div style={{ position: 'absolute', left: COL_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip />
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
                letterSpacing: -1.5,
                lineHeight: 1.06,
                color: C.textStrong,
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
            <PromiseChip icon={p.icon} text={p.text} on={chipOn[i]} tone={p.tone === 'cyan' ? C.cyan : C.violet} />
          </div>
        );
      })}
    </Stage>
  );
}
