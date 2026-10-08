import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Chip, clamp01 } from '../../../../../engine/src/ui';
import { SENSORS } from '../../../data/s09-camara';
import { BlueprintPanel } from '../ZoneRow';
import { Envelope, SensorBox, SwitchBox, TapNode, switchMirrorPort } from './glyphs';

/**
 * s09-01: the plan adds network sensors on the traffic itself — one on a tap,
 * one on a switch's mirror port — and each receives a COPY of what passes.
 * Drawn on the plan's blueprint paper (it is part of the new plan), with no
 * zone at all: the sensors sit on the traffic, not inside any zone.
 * Panel-local px, PLAN_W × PLAN_H; the scene positions and scales it.
 */

export const PLAN_W = 1240;
export const PLAN_H = 470;

const LANE_Y = 190;
const LANE_X0 = 50;
const LANE_X1 = PLAN_W - 50;
const TAP_X = 400;
const SW_X = 840;
const SENSOR_TOP = 300;
const SPACING = 170;
const SPEED = 4.2;
const COPY_FRAMES = 22;

const MIRROR = switchMirrorPort(SW_X, LANE_Y);

/** Where packet k is on the lane at `frame` (continuous flow, wraps around). */
function packetX(frame: number, k: number) {
  const span = LANE_X1 - LANE_X0;
  return LANE_X0 + ((((frame * SPEED + k * SPACING) % span) + span) % span);
}

export function SensorPlan({
  frame,
  draw,
  sensors,
  copyCaption,
  dim = 0,
}: {
  frame: number;
  /** 0–1 the panel and the lane. */
  draw: number;
  /** 0–1 the taps, the sensors and the «más sensores» chip. */
  sensors: number;
  /** 0–1 «reciben una copia del tráfico». */
  copyCaption: number;
  dim?: number;
}) {
  const s = clamp01(sensors);
  const n = Math.ceil((LANE_X1 - LANE_X0) / SPACING);
  const packets = Array.from({ length: n }, (_, k) => packetX(frame, k));
  // A copy leaves through the tap / the mirror port right after a packet passes it (only once the sensors exist).
  const copies: { x: number; y0: number; t: number }[] = [];
  if (s > 0.5) {
    for (const x of packets) {
      for (const at of [{ x: TAP_X, y0: LANE_Y + 18 }, { x: MIRROR.x, y0: MIRROR.y + 8 }]) {
        const dt = (x - at.x) / SPEED;
        if (dt > 0 && dt < COPY_FRAMES) copies.push({ x: at.x, y0: at.y0, t: dt / COPY_FRAMES });
      }
    }
  }
  const laneOn = clamp01(draw);
  return (
    <BlueprintPanel width={PLAN_W} height={PLAN_H} draw={laneOn} dim={dim}>
      <div style={{ position: 'absolute', left: 150, top: 16, opacity: s, transform: `translateY(${(1 - s) * 10}px)` }}>
        <Chip accent="cyan" icon="radar" size={34} solid={false}>
          {SENSORS.chip}
        </Chip>
      </div>
      <div style={{ position: 'absolute', left: LANE_X0 + 6, top: LANE_Y - 66, fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: C.muted, opacity: laneOn }}>
        {SENSORS.traffic}
      </div>
      <svg width={PLAN_W} height={PLAN_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id="s09-plan-lane">
            <rect x={LANE_X0 - 20} y={0} width={LANE_X1 - LANE_X0 + 40} height={PLAN_H} />
          </clipPath>
        </defs>
        {/* the traffic */}
        <line x1={LANE_X0} y1={LANE_Y} x2={LANE_X0 + (LANE_X1 - LANE_X0) * laneOn} y2={LANE_Y} stroke={alpha(C.cyan, 0.55)} strokeWidth={6} strokeLinecap="round" />
        <path d={`M ${LANE_X1 - 22} ${LANE_Y - 14} L ${LANE_X1} ${LANE_Y} L ${LANE_X1 - 22} ${LANE_Y + 14}`} fill="none" stroke={alpha(C.cyan, 0.55)} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={laneOn} />
        {/* copy lines to the sensors */}
        <g opacity={s} stroke={alpha(C.cyanSoft, 0.8)} strokeWidth={3} strokeDasharray="8 8" fill="none">
          <line x1={TAP_X} y1={LANE_Y + 18} x2={TAP_X} y2={LANE_Y + 18 + (SENSOR_TOP - LANE_Y - 18) * s} />
          <line x1={MIRROR.x} y1={MIRROR.y + 8} x2={MIRROR.x} y2={MIRROR.y + 8 + (SENSOR_TOP - MIRROR.y - 8) * s} />
        </g>
        {/* the switch is part of the traffic from the start; the tap and the mirror port arrive with the sensors */}
        <g opacity={laneOn}>
          <SwitchBox x={SW_X} y={LANE_Y} mirror={s} />
        </g>
        <g opacity={s}>
          <TapNode x={TAP_X} y={LANE_Y} />
        </g>
        {/* packets (the live traffic), then the copies sliding down */}
        <g clipPath="url(#s09-plan-lane)" opacity={laneOn}>
          {packets.map((x, k) => {
            const insideSwitch = Math.abs(x - SW_X) < 100;
            return insideSwitch ? null : <circle key={k} cx={x} cy={LANE_Y} r={9} fill={C.cyan} />;
          })}
          {copies.map((c, k) => (
            <Envelope key={k} x={c.x} y={c.y0 + (SENSOR_TOP - 20 - c.y0) * c.t} color={C.cyan} copy scale={0.62} opacity={Math.min(1, (1 - c.t) * 4)} />
          ))}
        </g>
      </svg>
      {/* labels: «tap» above its junction, «puerto espejo» beside the mirror line */}
      <div
        style={{
          position: 'absolute',
          left: TAP_X - 100,
          width: 200,
          top: LANE_Y - 72,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 36,
          fontWeight: 850,
          color: C.cyanSoft,
          opacity: s,
        }}
      >
        {SENSORS.tap}
      </div>
      <div
        style={{
          position: 'absolute',
          left: MIRROR.x + 40,
          top: SENSOR_TOP - 74,
          fontFamily: FONT.sans,
          fontSize: 34,
          fontWeight: 800,
          color: C.cyanSoft,
          whiteSpace: 'nowrap',
          opacity: s,
        }}
      >
        {SENSORS.mirror}
      </div>
      {/* the two sensors */}
      {[TAP_X, MIRROR.x].map((x, i) => (
        <div key={i} style={{ position: 'absolute', left: x - 88, top: SENSOR_TOP, opacity: s, transform: `translateY(${(1 - s) * 14}px)` }}>
          <SensorBox />
        </div>
      ))}
      {/* the caption */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: PLAN_W,
          top: SENSOR_TOP + 102,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 40,
          fontWeight: 750,
          color: C.text,
          opacity: clamp01(copyCaption),
          transform: `translateY(${(1 - clamp01(copyCaption)) * 10}px)`,
        }}
      >
        {SENSORS.copy.split(' ').map((w, k) => (
          <span key={k} style={w === 'copia' ? { color: C.cyan, fontWeight: 850 } : undefined}>
            {k ? ' ' : ''}
            {w}
          </span>
        ))}
      </div>
    </BlueprintPanel>
  );
}
