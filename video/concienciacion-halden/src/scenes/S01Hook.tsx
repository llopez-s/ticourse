import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, STAMP, TITLE } from '../data/canon';
import { CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { SensorField } from './parts/SensorField';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';

/** One chip per promise; each lights on its word in s01-02. */
const PROMISE = [
  { text: 'por qué lo hizo', word: 'Por' },
  { text: 'qué se mide', word: 'mide' },
  { text: 'para quién y cada cuánto', word: 'quién' },
] as const;

/** The field of dots: centred before the title, scaled down on the right after it. */
const FIELD_W = 1000;
const FIELD_H = 420;
const FIELD_LEFT = (1728 - FIELD_W) / 2;
const FIELD_TOP = 150;
const GLIDE_DX = 436;
const GLIDE_SCALE = 0.85;
const TEXT_X = 0;
const TITLE_TOP = 96;
const PLAQUE_TOP = 322;
const CHIPS_TOP = 398;
const CHIP_STEP = 72;

/**
 * s01-hook «Sensores, no eslabones». The proposal stamp from the first frame and an empty dashed plane. On `dots` one
 * grey dot per person of the workforce appears (nobody counts them); on `sensors` a wave of rings sweeps the plane
 * and every dot turns cyan and joins its neighbours — the biggest warning network, not a chain of weak links.
 * Before 12 s the plane glides right and shrinks, the title «Que la gente avise» lands with «SY0-701 · 5.6», and on
 * `promise` the three questions come as chips, each lit on its word. No adversary.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const dotsAt = props.cue('dots') - 6;
  const sensorsAt = props.cue('sensors') - 4;
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = Math.max(props.cue('promise') - 4, titleAt + 24);
  const pAt = PROMISE.map((p) => Math.max(promiseAt, wordFrame(S, 's01-02', p.word) - 6));

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const glide = progress(frame, titleAt - 18, 30, EASE.inOut);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });
  const hold = PROMISE.map((_, i) => 1 - 0.5 * (i < PROMISE.length - 1 ? progress(frame, pAt[i + 1] - 2, 10) : 0));
  const on = PROMISE.map((_, i) => progress(frame, pAt[i], 10) * hold[i]);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...STAMP]} size={30} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: FIELD_LEFT,
          top: FIELD_TOP,
          width: FIELD_W,
          height: FIELD_H,
          transform: `translateX(${mix(0, GLIDE_DX, glide)}px) scale(${mix(1, GLIDE_SCALE, glide)})`,
          transformOrigin: '50% 50%',
        }}
      >
        <SensorField width={FIELD_W} height={FIELD_H} cols={17} rows={7} frame={frame} dotsAt={dotsAt} sensorsAt={sensorsAt} dot={8} />
      </div>

      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: TEXT_X,
            top: TITLE_TOP,
            fontFamily: FONT.sans,
            fontSize: 104,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.02,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
            ...titleIn,
          }}
        >
          <div>{TITLE[0]}</div>
          <div style={{ color: C.cyan }}>{TITLE[1]}</div>
        </div>
      ) : null}
      {frame >= titleAt ? (
        <div style={{ position: 'absolute', left: TEXT_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}

      {PROMISE.map((p, i) => {
        if (frame < promiseAt - 2) return null;
        return (
          <div key={p.text} style={{ position: 'absolute', left: TEXT_X, top: CHIPS_TOP + i * CHIP_STEP, ...enter(frame, promiseAt + i * 6, { distance: 16 }) }}>
            <Pill text={p.text} tone={C.cyan} on={0.12 + 0.88 * on[i]} size={40} height={58} />
          </div>
        );
      })}
    </Stage>
  );
}
