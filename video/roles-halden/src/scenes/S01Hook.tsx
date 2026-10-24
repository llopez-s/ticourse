import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, PROMISE, STAMP, TITLE } from '../data/s01-hook';
import { Arrow } from './parts/Arrow';
import { Hand } from './parts/Hand';
import { CENTER, HANDS, HAND_SIZE, SHEET_H, SHEET_W, THE_ONE } from './parts/ListHands';
import { CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { ListSheet } from './parts/Sheet';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
const H = STAGE.height;
/** After the title the whole group steps left and shrinks under it. */
const SMALL = { scale: 0.72, x: 390, y: 440 } as const;
const CHIP_X = [800, 960, 1120];
const CHIP_Y = [520, 400, 280];
const TITLE_TOP = 74;
const TITLE_SIZE = 100;

/**
 * s01-hook «Una lista, muchas manos». The proposal stamp from the first frame and the passenger list, faint, in the
 * middle of the stage; on `list` it lights, on `hands` five hands reach for it one after another (the sheet and the
 * hands are one group), and on «decide» four of them step back and one glows. Before 12 s the group glides left and
 * shrinks, «Quién decide» lands on top with «SY0-701 · 5.1», and the promise comes as three chips climbing a height
 * line, each lit on its word (dentro de la casa · con la ley · arriba).
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const listAt = props.cue('list');
  const handsAt = props.cue('hands');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const decideAt = wordFrame(S, 's01-01', 'decide') - 4;
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const scale = mix(1, SMALL.scale, glide);
  const dx = mix(0, SMALL.x - CENTER.x, glide);
  const dy = mix(0, SMALL.y - CENTER.y, glide);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 4, { distance: 14, duration: 16 });
  const sheetIn = enter(frame, listAt - 6, { distance: 24, duration: 18 });
  const decided = progress(frame, decideAt, 14);
  const settle = progress(frame, titleAt, 20);
  const last = PROMISE.length - 1;
  const lit = chipAt.map((at, i) => progress(frame, at, 10) * (1 - (i < last ? 0.6 * progress(frame, chipAt[i + 1] - 2, 10) : 0)));
  const axis = progress(frame, props.cue('promise') - 6, 40, EASE.inOut);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>
      {frame >= titleAt ? (
        <div style={{ position: 'absolute', right: 0, top: 5, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}

      {/* The sheet and the five hands: one group */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: `${CENTER.x}px ${CENTER.y}px`, transform: `translate(${dx}px, ${dy}px) scale(${scale})` }}>
        <div style={{ position: 'absolute', left: CENTER.x - SHEET_W / 2, top: CENTER.y - SHEET_H / 2, opacity: 0.3 + 0.7 * sheetIn.opacity, transform: sheetIn.transform }}>
          <ListSheet width={SHEET_W} glow={0.5 * progress(frame, listAt, 14)} rowsOn={progress(frame, listAt, 30)} />
        </div>
        {HANDS.map((h, i) => {
          const p = progress(frame, handsAt + i * 9 - 4, 22);
          if (p <= 0.01) return null;
          const rad = (h.angle * Math.PI) / 180;
          const away = (1 - p) * 170;
          const one = i === THE_ONE;
          const dimmed = (one ? 1 : 1 - 0.65 * decided) * (1 - 0.35 * settle);
          return <Hand key={i} cx={h.cx - Math.sin(rad) * away} cy={h.cy + Math.cos(rad) * away} angle={h.angle} size={HAND_SIZE} tone={one && decided > 0.02 ? C.cyan : C.sky} glow={one ? decided : 0} opacity={p * dimmed} />;
        })}
      </div>

      {/* The promise: a height line and three chips, one higher than the last */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Arrow
          points={[
            [740, 600],
            [740, 250],
          ]}
          draw={axis}
          color={alpha(C.cyan, 0.5)}
          width={4}
          dashed
        />
      </svg>
      {PROMISE.map((p, i) => {
        if (frame < chipAt[i] - 2) return null;
        return (
          <div key={p.text} style={{ position: 'absolute', left: CHIP_X[i], top: CHIP_Y[i], ...enter(frame, chipAt[i], { distance: 16 }) }}>
            <Pill text={p.text} tone={C.cyan} icon={p.icon} on={0.3 + 0.7 * lit[i]} size={42} height={74} />
          </div>
        );
      })}

      {/* The title */}
      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: TITLE_TOP,
            width: W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: TITLE_SIZE,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.04,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            textShadow: `0 0 30px ${alpha(C.sky, 0.2)}`,
            ...titleIn,
          }}
        >
          {TITLE[0]}
          <span style={{ color: C.sky }}>{TITLE[1]}</span>
        </div>
      ) : null}
    </Stage>
  );
}
