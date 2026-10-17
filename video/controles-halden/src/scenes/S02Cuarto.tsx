import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { CONTROLS, DOOR_OPEN, NOTHING_MISSING, WHEN } from '../data/s02-cuarto';
import { ControlTag } from './parts/ControlTag';
import { FloorPlan, MARKS, PLAN_H } from './parts/s02-cuarto/FloorPlan';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-cuarto';
const W = STAGE.width;

// ---- Layout (stage coordinates).
const PLAN_Y_A = 232; // the morning: plan in the middle, chips above, door label under it
const PLAN_Y_B = 0; // the four controls: plan up top, statement line, tags row
const CHIPS_Y = 140;
const STATEMENT_Y = 238;
const CARET_Y = 304;
const TAG_W = 404;
const TAG_GAP = 37;
const ROW_Y_B = 322;
const ROW_Y_FOUR = 236; // on `four`: the row rises so the top of the stage is free under the exam card
const GLOSS_GAP = 24;
const colX = (i: number) => i * (TAG_W + TAG_GAP);
const colC = (i: number) => colX(i) + TAG_W / 2;

/**
 * s02-cuarto «La puerta del cuarto de comunicaciones». A schematic floor plan of the office building (management
 * office, open-plan office, corridor, the communications room with its racks) under «Una mañana · sin fecha». On
 * `open` the room's door swings open into the corridor (amber, «puerta abierta»); «no falta nada» on the voice's
 * words — nobody is drawn. With «Hay cuatro controles» the plan moves up and four empty two-box tags line up under
 * it, each column under its place on the plan. One per cue, the statement (goal wording) lands on a line above the
 * row, its place on the plan lights and the tag's top box fills with the category as the voice says the term
 * (Managerial, Operational, Physical, Technical; the bottom box stays empty). On `touch` the door swings shut by
 * itself. On `four` the plan and the statement leave, the row rises and each tag gets its rule in plain words under
 * it: decidir · hacer · algo que se toca · un sistema solo.
 */
export function S02Cuarto(props: SceneProps) {
  const frame = useCurrentFrame();
  const openAt = props.cue('open');
  const missingAt = wordFrame(S, 's02-01', 'falta') - 4;
  const shiftAt = segment(props, 's02-02').from - 6; // «Hay cuatro controles en esa puerta»
  const cueAt = CONTROLS.map((c) => props.cue(c.cue));
  const valueAt = CONTROLS.map((c) => wordFrame(S, c.seg, c.word) - 6);
  const fourAt = props.cue('four') - 6;
  const closeAt = wordFrame(S, 's02-04', 'sola') - 10;

  // ---- The morning.
  const morningOut = progress(frame, shiftAt, 18, EASE.inOut);
  const whenIn = enter(frame, -4, { distance: 14, duration: 16 });
  const missingIn = progress(frame, missingAt, 14);
  const doorOpen = progress(frame, openAt + 4, 26, EASE.inOut) * (1 - progress(frame, closeAt, 26, EASE.inOut));
  const alarm = progress(frame, openAt + 4, 26) * (1 - progress(frame, closeAt, 20, EASE.inOut));
  const doorLabelIn = progress(frame, openAt + 18, 14) * (1 - morningOut);

  // ---- The plan: middle, then up top, then gone on `four`.
  const up = progress(frame, shiftAt, 30, EASE.inOut);
  const planY = mix(PLAN_Y_A, PLAN_Y_B, up);
  const planIn = progress(frame, -6, 14);
  const four = progress(frame, fourAt, 26, EASE.inOut);
  const planOpacity = planIn * (1 - four);

  // ---- Which control the voice is on (−1 = none yet).
  let current = -1;
  cueAt.forEach((at, i) => {
    if (frame >= at - 4) current = i;
  });
  const litOf = (i: number) => {
    const on = progress(frame, cueAt[i] - 4, 14);
    const next = cueAt[i + 1];
    const past = next !== undefined ? progress(frame, next - 4, 14, EASE.inOut) : 0;
    return on * (1 - 0.45 * past);
  };
  // The lock's mark waits until the door has swung shut, on «cerradura», so the leaf never sweeps through it.
  const lockAt = Math.max(closeAt + 22, wordFrame(S, 's02-04', 'cerradura') - 4);
  const doorLit = progress(frame, lockAt, 14) * (1 - 0.45 * progress(frame, cueAt[3] - 4, 14, EASE.inOut));
  const lit = { boss: litOf(0), guard: litOf(1), door: doorLit, racks: litOf(3) };

  // ---- The row of tags.
  const rowY = mix(ROW_Y_B, ROW_Y_FOUR, four);

  return (
    <Stage>
      {/* The morning: when, and nothing missing */}
      {morningOut < 0.999 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: CHIPS_Y,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            gap: 22,
            opacity: whenIn.opacity * (1 - morningOut),
            transform: whenIn.transform,
          }}
        >
          <Pill text={WHEN} color={C.cyan} icon="clock" />
          {missingIn > 0.01 ? (
            <div style={{ opacity: missingIn, transform: `translateX(${(1 - missingIn) * 16}px)` }}>
              <Pill text={NOTHING_MISSING} color={C.emerald} icon="check" />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The floor plan */}
      {planOpacity > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: planY, opacity: planOpacity }}>
          <FloorPlan door={doorOpen} alarm={alarm} lit={lit} room={0.6 + 0.4 * (1 - up)} />
        </div>
      ) : null}
      {doorLabelIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: MARKS.door.x - 200,
            width: 400,
            top: planY + PLAN_H + 18,
            display: 'flex',
            justifyContent: 'center',
            opacity: doorLabelIn,
          }}
        >
          <Pill text={DOOR_OPEN} color={C.amber} icon="alert" />
        </div>
      ) : null}

      {/* The statement the voice is on, one wide line above the row */}
      {CONTROLS.map((c, i) => {
        const inAt = cueAt[i] - 4;
        const outAt = i < CONTROLS.length - 1 ? cueAt[i + 1] - 6 : fourAt;
        if (frame < inAt - 1 || frame > outAt + 14) return null;
        const o = progress(frame, inAt, 14) * (1 - progress(frame, outAt, 12, EASE.inOut));
        return (
          <div
            key={c.cue}
            style={{
              position: 'absolute',
              left: 0,
              top: STATEMENT_Y,
              width: W,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 700,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              opacity: o,
              transform: `translateY(${(1 - progress(frame, inAt, 14)) * 12}px)`,
            }}
          >
            {c.statement}
          </div>
        );
      })}
      {/* A small caret from the statement down to its tag */}
      {current >= 0 ? (
        <svg
          width={36}
          height={20}
          style={{
            position: 'absolute',
            left: mix(colC(Math.max(0, current - 1)), colC(current), progress(frame, cueAt[current] - 4, 16, EASE.inOut)) - 18,
            top: CARET_Y,
            opacity: progress(frame, cueAt[0] - 4, 12) * (1 - four),
          }}
        >
          <path d="M 2 2 L 34 2 L 18 18 Z" fill={C.cyan} />
        </svg>
      ) : null}

      {/* The four tags: empty slots first, then each top box fills on its term */}
      {CONTROLS.map((c, i) => {
        const at = shiftAt + 12 + i * 5;
        if (frame < at - 1) return null;
        const e = enter(frame, at, { distance: 18, duration: 16 });
        const waiting = 1 - progress(frame, cueAt[i] - 4, 12);
        const isPast = i < current;
        const base = isPast ? 0.45 : i === current ? 0 : 0.75 * waiting;
        const dimNow = base * (1 - four);
        return (
          <div key={c.cue} style={{ position: 'absolute', left: colX(i), top: rowY, width: TAG_W, ...e }}>
            <ControlTag frame={frame} width={TAG_W} hole={false} top={c.category} topAt={valueAt[i]} dim={dimNow} />
            {/* The rule in plain words, on `four` */}
            {frame >= fourAt + 8 + i * 6 ? (
              <div
                style={{
                  marginTop: GLOSS_GAP,
                  textAlign: 'center',
                  fontFamily: FONT.sans,
                  fontSize: 44,
                  fontWeight: 800,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                  ...enter(frame, fourAt + 10 + i * 6, { distance: 12, duration: 16 }),
                }}
              >
                {c.gloss}
              </div>
            ) : null}
          </div>
        );
      })}
    </Stage>
  );
}

/** A rounded label with an icon. */
function Pill({ text, color, icon }: { text: string; color: string; icon: 'clock' | 'check' | 'alert' }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 58,
        padding: '0 26px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(color, 0.75)}`,
        background: alpha(color, 0.12),
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={32} color={color} />
      <span>{text}</span>
    </div>
  );
}
