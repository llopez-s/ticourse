import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { S02_EMPTY, S02_LENS, S02_ODOMETER, S02_TABLE, S02_TARGET } from '../data/s02-medir';
import { Bus, Rider, StopPost } from './parts/Figures';
import { ClockStrip } from './parts/ClockStrip';
import { MetricsTable, TABLE_H } from './parts/MetricsTable';
import { Odometer } from './parts/Odometer';
import { interceptWindow } from './parts/timing';
import { Stage, segment } from './kit';

const S = 's02-medir';
const W = STAGE.width;

/** The road and the two ends of the line (stage-local px). */
const ROAD_Y = 462;
const BUS_W = 300;
const BUS_TOP = ROAD_Y - 130;
const BUS_X0 = 170;
const BUS_X1 = 1330;
const STOPS = [120, 864, 1700] as const;
/** Where the travellers stand once they have got off. */
const RIDERS_X = [1530, 1585, 1640] as const;
const RIDER_H = 86;
/** The two value cards the travellers are tied to (right edge x, middle y). */
const CARD = { x: 880, w: 820, h: 96, y: [0, 104] as const };
const TABLE_TOP_A = 236;
const STRIP_TOP = 428;

/**
 * s02-medir «Kilómetros y viajeros».
 *   route    a bus line, left to right, three stops, one bus (nothing is labelled).
 *   km       the counter «Nº de IOCs ingeridos» rises (typing sfx): kilometres, blurred.
 *   empty    the bus drives on with every seat empty: «nadie a bordo».
 *   arrive   at the last stop travellers get off and tie themselves to two value rows.
 *   reply    (after the intercepted message) the lesson's table, four rows, vanity against value.
 *   target   the vanity rows switch off one by one: «el equipo hace lo que se mide».
 *   value    the value rows 1 and 2 light up; the table rises once the message has gone.
 *   wait     row 4 lights and a clock runs from the first stop to the last, bus in the middle.
 *   lens     the three value metrics stay still under one caption.
 * The top band (y 0–230) holds the intercepted message from the end of s02-03 to the end of s02-04,
 * so everything up there fades before it and the table waits below it.
 */
export function S02Medir(props: SceneProps) {
  const frame = useCurrentFrame();
  const routeAt = props.cue('route');
  const kmAt = props.cue('km');
  const emptyAt = props.cue('empty');
  const arriveAt = props.cue('arrive');
  const replyAt = props.cue('reply');
  const targetAt = props.cue('target');
  const valueAt = props.cue('value');
  const waitAt = props.cue('wait');
  const lensAt = props.cue('lens');
  const icpt = interceptWindow(S);
  if (!icpt) throw new Error('s02-medir expects an intercepted message');
  const s6 = segment(props, 's02-06');

  // ---- Phase 1: the line.
  const routeLit = progress(frame, routeAt - 4, 22);
  const topFade = 1 - progress(frame, icpt.from - 8, 16);
  const lowFade = 1 - progress(frame, replyAt - 6, 16);
  const drive = progress(frame, kmAt + 4, Math.max(60, arriveAt - 6 - (kmAt + 4)), EASE.inOut);
  const busX = mix(BUS_X0, BUS_X1, drive);
  const emptyP = progress(frame, emptyAt, 12) * (1 - progress(frame, arriveAt - 6, 10));
  const fill = progress(frame, arriveAt, 10);
  const leaveAll = progress(frame, arriveAt + 14, 44);
  const seats = [fill * (1 - leaveAll), 0, fill * (1 - leaveAll), fill * (1 - leaveAll), 0] as const;
  const exit = RIDERS_X.map((_, k) => progress(frame, arriveAt + 14 + k * 10, 18));
  const kmIn = enter(frame, kmAt - 8, { distance: -22, duration: 16 });
  const cards = [enter(frame, arriveAt - 4, { distance: -30, duration: 16 }), enter(frame, arriveAt + 4, { distance: -30, duration: 16 })];
  const thread = RIDERS_X.map((_, k) => progress(frame, arriveAt + 40 + k * 8, 26));

  // ---- Phase 2: the table.
  const liftAt = Math.max(icpt.to + 2, valueAt - 8);
  const lift = progress(frame, liftAt, 30, EASE.inOut);
  const tableTop = mix(TABLE_TOP_A, 4, lift);
  const head = progress(frame, replyAt - 4, 14);
  const show = [0, 1, 2, 3].map((i) => progress(frame, replyAt + i * 7, 16));
  const off = [0, 1, 2, 3].map((i) => progress(frame, targetAt + 8 + i * 18, 14));
  const valueLit = [progress(frame, valueAt, 14), progress(frame, valueAt + 14, 14), 0, progress(frame, waitAt, 14)];
  const dim = [0, 0, progress(frame, valueAt, 20), 0];
  const captionP = progress(frame, targetAt, 14) * (1 - progress(frame, liftAt, 14));

  // ---- The clock run.
  const stripAt = Math.max(waitAt - 4, liftAt + 20);
  const runFrom = stripAt + 16;
  const runTo = Math.max(runFrom + 120, s6.to - 24);
  const runU = progress(frame, runFrom, runTo - runFrom, EASE.linear);
  const stripOpacity = progress(frame, stripAt, 16) * (1 - progress(frame, lensAt - 6, 14));
  const lensIn = enter(frame, lensAt, { distance: 22, duration: 16 });

  return (
    <Stage>
      {/* Road, stops, bus and travellers (phase 1) */}
      {lowFade > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: lowFade * progress(frame, 0, 14) }}>
          <svg width={W} height={STAGE.height} viewBox={`0 0 ${W} ${STAGE.height}`} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
            <line x1={40} y1={ROAD_Y} x2={W - 40} y2={ROAD_Y} stroke={C.ink600} strokeWidth={14} strokeLinecap="round" opacity={0.45 + 0.55 * routeLit} />
            <line x1={40} y1={ROAD_Y} x2={W - 40} y2={ROAD_Y} stroke={C.ink500} strokeWidth={3} strokeDasharray="16 22" opacity={0.3 + 0.7 * routeLit} />
            {STOPS.map((x) => (
              <circle key={x} cx={x} cy={ROAD_Y} r={15} fill={C.ink950} stroke={alpha(C.cyan, 0.3 + 0.7 * routeLit)} strokeWidth={5} />
            ))}
            {/* threads from the travellers to the value cards */}
            {RIDERS_X.map((x, k) => {
              const yt = k === 0 ? CARD.y[0] + CARD.h / 2 : CARD.y[1] + CARD.h / 2;
              const y0 = ROAD_Y + 6 - RIDER_H - 6;
              const d = `M ${x} ${y0} C ${x} ${y0 - 150}, ${CARD.x + CARD.w + 30} ${yt + 130}, ${CARD.x + CARD.w} ${yt}`;
              return (
                <path
                  key={k}
                  d={d}
                  fill="none"
                  stroke={C.emerald}
                  strokeWidth={5}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - thread[k]}
                  opacity={topFade}
                />
              );
            })}
          </svg>
          {/* stop posts */}
          {STOPS.map((x, i) => (
            <div key={x} style={{ position: 'absolute', left: x - 34, top: ROAD_Y - 118, opacity: 0.35 + 0.65 * routeLit, transform: `scale(${i === 2 ? 1.1 : 1})`, transformOrigin: '50% 100%' }}>
              <StopPost size={110} color={i === 2 ? C.emerald : C.cyan} lit={i === 2 ? fill : 0} />
            </div>
          ))}
          {/* the bus */}
          <div style={{ position: 'absolute', left: busX - BUS_W / 2, top: BUS_TOP }}>
            <Bus width={BUS_W} riders={seats} />
          </div>
          {/* «nadie a bordo» */}
          {emptyP > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: busX - 150,
                top: BUS_TOP - 66,
                width: 300,
                display: 'flex',
                justifyContent: 'center',
                opacity: emptyP,
                transform: `translateY(${(1 - emptyP) * 12}px)`,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 54,
                  padding: '0 24px 0 16px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.amber, 0.8)}`,
                  background: alpha(C.ink900, 0.95),
                  fontFamily: FONT.sans,
                  fontSize: 34,
                  fontWeight: 800,
                  color: '#fcd34d',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name="eyeOff" size={34} color={C.amber} />
                {S02_EMPTY}
              </span>
            </div>
          ) : null}
          {/* travellers getting off */}
          {RIDERS_X.map((x, k) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: mix(BUS_X1 + 135, x, exit[k]) - (RIDER_H * 40) / 70 / 2,
                top: ROAD_Y + 6 - RIDER_H,
                opacity: Math.min(1, exit[k] * 3),
              }}
            >
              <Rider size={RIDER_H} />
            </div>
          ))}
        </div>
      ) : null}

      {/* Top band, phase 1: the counter and the two value rows it never reaches */}
      {topFade > 0.001 ? (
        <>
          {frame >= kmAt - 8 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 800,
                height: 196,
                boxSizing: 'border-box',
                padding: '24px 30px',
                borderRadius: 24,
                border: `2px solid ${alpha(C.rose, 0.45)}`,
                background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
                fontFamily: FONT.sans,
                ...kmIn,
                opacity: topFade * kmIn.opacity,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <Icon name="x" size={34} color={C.rose} strokeWidth={2.4} />
                {S02_ODOMETER.label}
              </div>
              <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 20 }}>
                <Odometer frame={frame} startAt={kmAt} digits={7} size={88} color={C.cyan} grow={120} seed={3} />
                <span style={{ fontSize: 52, fontWeight: 800, color: C.muted }}>{S02_ODOMETER.unit}</span>
              </div>
            </div>
          ) : null}
          {frame >= arriveAt - 8
            ? [0, 1].map((k) => (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    left: CARD.x,
                    top: CARD.y[k],
                    width: CARD.w,
                    height: CARD.h,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '0 24px',
                    borderRadius: 18,
                    border: `3px solid ${alpha(C.emerald, 0.75)}`,
                    background: `linear-gradient(90deg, ${alpha(C.emerald, 0.14)} 0%, ${alpha(C.ink900, 0.97)} 70%)`,
                    fontFamily: FONT.sans,
                    opacity: topFade * cards[k].opacity,
                    transform: cards[k].transform,
                  }}
                >
                  <Icon name="check" size={34} color={C.emerald} strokeWidth={2.4} />
                  <span style={{ fontSize: 32, fontWeight: 750, lineHeight: 1.16, color: C.textStrong }}>{S02_TABLE.value[k]}</span>
                </div>
              ))
            : null}
        </>
      ) : null}

      {/* Phase 2: the lesson's table, below the message and then up */}
      {frame >= replyAt - 8 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: tableTop, width: W, height: TABLE_H }}>
            <MetricsTable show={show} off={off} lit={valueLit} dim={dim} head={head} />
          </div>
          {captionP > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 96,
                width: 380,
                boxSizing: 'border-box',
                padding: '14px 22px',
                borderRadius: 18,
                border: `2px solid ${alpha(C.rose, 0.7)}`,
                background: alpha(C.roseDeep, 0.55),
                fontFamily: FONT.sans,
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.18,
                color: '#fecdd3',
                whiteSpace: 'nowrap',
                opacity: captionP,
                transform: `translateY(${(1 - captionP) * 14}px)`,
              }}
            >
              {S02_TARGET.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          ) : null}
        </>
      ) : null}

      {/* The traveller's whole trip */}
      {stripOpacity > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: STRIP_TOP }}>
          <ClockStrip u={runU} opacity={stripOpacity} />
        </div>
      ) : null}

      {/* The lens */}
      {frame >= lensAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 486, width: W, display: 'flex', justifyContent: 'center', opacity: lensIn.opacity, transform: lensIn.transform }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 20,
              height: 96,
              padding: '0 44px 0 30px',
              boxSizing: 'border-box',
              borderRadius: 30,
              border: `3px solid ${alpha(C.emerald, 0.8)}`,
              background: alpha(C.emeraldDeep, 0.5),
              boxShadow: `0 0 36px ${alpha(C.emerald, 0.22)}`,
              fontFamily: FONT.sans,
              fontSize: 46,
              fontWeight: 850,
              color: C.textStrong,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="target" size={50} color={C.emerald} />
            {S02_LENS}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
