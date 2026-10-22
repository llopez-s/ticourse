import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { SENSORS } from '../data/canon';
import { Pill, TermPill } from './parts/Labels';
import { ROOM, SensorRoom } from './parts/SensorRoom';
import { Stage, wordFrame } from './kit';

const S = 's04-sensor';
/** The word (segment, word) where each sensor's weak point starts being said. */
const FAILS_WORD = [
  ['s04-02', 'pero'],
  ['s04-03', 'pero'],
  ['s04-04', 'atraviesa'],
  ['s04-05', 'corrientes'],
] as const;

const W = STAGE.width;
const GAP = 32;
const COL_W = (W - 3 * GAP) / 4;
const ROOM_H = (COL_W * ROOM.h) / ROOM.w;
const TERM_TOP = ROOM_H + 14;
const TAG_TOP = TERM_TOP + 66;
const BAND_TOP = TAG_TOP + 98;
const RULE = 'elige el que no falla en tu cuarto';

/**
 * s04-sensor «Cada sensor falla distinto». Four small rooms in the plan's style, one per sensor, each with its weak
 * point drawn in amber (sun and radiator · steps beside the mat · rings through a thin partition · a draught in a
 * closed room). Faint from the first frame; on `rooms` they light; on each sensor's cue its room comes into focus, its
 * term and its two-line amber weak point appear under it, and the band below says what it measures (white) and where
 * it fails (amber), with a notch pointing at the room. On `rule` the band gives way to «elige el que no falla en tu
 * cuarto» and all four rooms stay lit. «Sensor» is motion, heat or weight — never a network sensor.
 */
export function S04Sensor(props: SceneProps) {
  const frame = useCurrentFrame();
  const roomsAt = props.cue('rooms');
  const at = SENSORS.map((s) => props.cue(s.kind));
  const ruleAt = props.cue('rule');
  const failsAt = FAILS_WORD.map(([seg, w]) => wordFrame(S, seg, w) - 6);

  const lit = progress(frame, roomsAt, 18);
  const focusI = at.reduce((acc, a, i) => (frame >= a - 6 ? i : acc), -1);
  const ruleIn = progress(frame, ruleAt - 2, 16, EASE.inOut);
  const bandOut = progress(frame, ruleAt - 10, 10);

  return (
    <Stage>
      {SENSORS.map((s, i) => {
        const x = i * (COL_W + GAP);
        const shown = progress(frame, at[i] - 6, 14);
        const inFocus = i === focusI && frame < ruleAt - 6;
        // Before its cue: half lit (after `rooms`); in focus: full; after: back to a steady 0.7; on `rule`: all full.
        const on = Math.max(0.25 + 0.3 * lit, shown * (inFocus ? 1 : 0.7), ruleIn);
        const weak = inFocus ? 1 : Math.max(0.35, ruleIn);
        return (
          <div key={s.kind}>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: 0,
                borderRadius: 14,
                boxShadow: inFocus ? `0 0 0 3px ${alpha(C.cyan, 0.7 * shown)}, 0 0 34px ${alpha(C.cyan, 0.25 * shown)}` : undefined,
                opacity: 0.55 + 0.45 * on,
              }}
            >
              <SensorRoom kind={s.kind} width={COL_W} on={on} weak={weak} t={frame} idSuffix="-s4" />
            </div>
            {frame >= at[i] - 8 ? (
              <>
                <div style={{ position: 'absolute', left: x, top: TERM_TOP, width: COL_W, display: 'flex', justifyContent: 'center', ...enter(frame, at[i] - 4, { distance: 12 }) }}>
                  <TermPill text={s.term} size={34} on={inFocus || ruleIn > 0.5 ? 1 : 0.4} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    top: TAG_TOP,
                    width: COL_W,
                    textAlign: 'center',
                    fontFamily: FONT.sans,
                    fontSize: 32,
                    fontWeight: 750,
                    lineHeight: 1.15,
                    color: C.amber,
                    opacity: (0.55 + 0.45 * Math.max(inFocus ? 1 : 0, ruleIn)) * progress(frame, failsAt[i], 14),
                  }}
                >
                  <div>{s.tag[0]}</div>
                  <div>{s.tag[1]}</div>
                </div>
              </>
            ) : null}
          </div>
        );
      })}

      {/* The band: what the focused sensor measures and where it fails */}
      {SENSORS.map((s, i) => {
        const vis = progress(frame, at[i] - 2, 12) * (1 - (i < SENSORS.length - 1 ? progress(frame, at[i + 1] - 8, 8) : bandOut));
        if (vis <= 0.01) return null;
        const notchX = i * (COL_W + GAP) + COL_W / 2;
        return (
          <div key={s.kind} style={{ position: 'absolute', left: 0, top: BAND_TOP, width: W, opacity: vis }}>
            <div style={{ position: 'absolute', left: notchX - 16, top: -14, width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: `14px solid ${alpha(C.cyan, 0.6)}` }} />
            <div
              style={{
                boxSizing: 'border-box',
                width: W,
                padding: '14px 32px',
                borderRadius: RADIUS.lg,
                border: `2px solid ${alpha(C.cyan, 0.6)}`,
                background: alpha(C.ink850, 0.9),
                fontFamily: FONT.sans,
                fontSize: 38,
                fontWeight: 750,
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              <div style={{ color: C.textStrong }}>{s.does}</div>
              <div style={{ color: C.amber, opacity: 0.2 + 0.8 * progress(frame, failsAt[i], 12) }}>{s.fails}</div>
            </div>
          </div>
        );
      })}

      {/* The rule, at the foot */}
      {ruleIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: BAND_TOP + 22, width: W, display: 'flex', justifyContent: 'center', opacity: ruleIn, transform: `translateY(${(1 - ruleIn) * 14}px)` }}>
          <Pill text={RULE} tone={C.cyan} size={48} height={80} />
        </div>
      ) : null}
    </Stage>
  );
}
