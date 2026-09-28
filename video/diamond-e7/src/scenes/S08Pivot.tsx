import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../engine/src/ui';
import { cubicLength, cubicPath, cubicPoint, type Point } from '../../../engine/src/ui/geometry';
import { Diamond, EDGES, vertexPoint, type VertexId } from './parts/Diamond';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's08-pivot';
const GEO = { cx: 600, cy: 330, hw: 360, hh: 232 };
const CARD_W = 300;

type Curve = [Point, Point, Point, Point];

// Pivot links in stage-local coordinates (the diamond sits left, the graph grows right).
const V2C: Curve = [
  { x: 446, y: 574 },
  { x: 330, y: 610 },
  { x: 236, y: 548 },
  { x: 238, y: 424 },
];
const C2I: Curve = [
  { x: 396, y: 330 },
  { x: 540, y: 330 },
  { x: 660, y: 330 },
  { x: 800, y: 330 },
];
const I2A: Curve = [
  { x: 960, y: 244 },
  { x: 950, y: 150 },
  { x: 880, y: 104 },
  { x: 762, y: 100 },
];

const SAMPLES = ['muestra B', 'muestra C', 'muestra D'];
const SAMPLE_X = 1300;
const SAMPLE_Y = [250, 340, 430];

/**
 * s08-pivot «Pivotar entre vértices»: each known vertex lights up the others.
 * A glow travels round the diamond; then the pivots fire in order —
 * Victim (your logs) to Capability (the sample), Capability to Infrastructure
 * (the C2 written into the sample), Infrastructure fanning out to other
 * samples that call the same C2, and a dashed slip towards the Adversary
 * (the registration email, still unknown). The graph visibly grows.
 */
export function S08Pivot(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const loop = props.cue('loop');
  const v2c = props.cue('v2c');
  const c2i = props.cue('c2i');
  const i2c = props.cue('i2c');
  const i2a = props.cue('i2a');
  const grow = segment(props, 's08-04').from;
  const labAt = wordFrame(SCENE, 's08-04', 'Lab');

  // Travelling glow round the rim (clockwise from the top), from {loop} until the first pivot.
  const STEP = 16; // frames per vertex: one lap = 64 frames, each vertex < 1 Hz
  const loopEnv = progress(frame, loop, 12) * (1 - progress(frame, v2c - 12, 16, EASE.inOut));
  const phase = Math.max(0, (frame - loop) / STEP);
  const ringOrder: VertexId[] = EDGES.map(([a]) => a);
  const ringGlow = (v: VertexId) => {
    const i = ringOrder.indexOf(v);
    const d = (((phase - i) % 4) + 4) % 4;
    const dist = Math.min(d, 4 - d);
    const g = Math.max(0, 1 - dist / 1.1);
    return loopEnv * EASE.inOut(g);
  };
  const edgeIdx = Math.floor(phase) % 4;
  const [ea, eb] = EDGES[edgeIdx];
  const A = vertexPoint(ea, GEO);
  const B = vertexPoint(eb, GEO);
  const t = EASE.inOut(phase - Math.floor(phase));
  const runner = { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t };

  // A short spotlight on the vertex each pivot lands on.
  const spot = (at: number) => progress(frame, at + 8, 12) * (1 - progress(frame, at + 70, 30));
  const glow = {
    adv: Math.max(ringGlow('adv'), spot(i2a)),
    cap: Math.max(ringGlow('cap'), spot(v2c)),
    infra: Math.max(ringGlow('infra'), spot(c2i)),
    vic: Math.max(ringGlow('vic'), spot(v2c - 8)),
  };

  const dV2C = progress(frame, v2c + 4, 24, EASE.inOut);
  const dC2I = progress(frame, c2i + 4, 24, EASE.inOut);
  const dI2A = progress(frame, i2a + 4, 28, EASE.inOut);

  // Once the loop has turned, a flow runs along every link: the graph is alive.
  const flow = frame >= grow ? (frame - grow) / fps : undefined;

  const infra = vertexPoint('infra', GEO);
  const fanFrom: Point = { x: infra.x + CARD_W / 2 + 4, y: infra.y };

  return (
    <Stage>
      {/* The travelling glow rides the rim underneath the vertex cards. */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {loopEnv > 0 ? (
          <g opacity={loopEnv}>
            <circle cx={runner.x} cy={runner.y} r={22} fill={alpha(C.cyanSoft, 0.2)} />
            <circle cx={runner.x} cy={runner.y} r={10} fill={C.cyanSoft} />
          </g>
        ) : null}
      </svg>
      <Diamond
        {...GEO}
        cardW={CARD_W}
        vertices={{
          adv: { unknown: true, glow: glow.adv },
          vic: { items: frame >= v2c ? ['tus logs'] : [], glow: glow.vic },
          cap: { items: frame >= v2c + 22 ? ['la muestra'] : [], glow: glow.cap },
          infra: { items: frame >= c2i + 22 ? ['el C2'] : [], glow: glow.infra },
        }}
      />

      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Arrow id="v2c" curve={V2C} draw={dV2C} color={C.amber} flow={flow} />
        <Arrow id="c2i" curve={C2I} draw={dC2I} color={C.sky} flow={flow} />
        {SAMPLES.map((_, i) => (
          <Arrow
            key={i}
            id={`i2c-${i}`}
            curve={fanCurve(fanFrom, { x: SAMPLE_X - 6, y: SAMPLE_Y[i] })}
            draw={progress(frame, i2c + 6 + i * 10, 22, EASE.inOut)}
            color={C.amber}
            flow={flow}
            width={4}
          />
        ))}
        <Arrow id="i2a" curve={I2A} draw={dI2A} color={C.rose} dashed flow={flow} />
      </svg>

      {/* c2i label under the tech line. */}
      <div
        style={{
          position: 'absolute',
          left: GEO.cx,
          top: GEO.cy + 22,
          transform: 'translateX(-50%)',
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: TYPE.label,
          fontWeight: 700,
          color: C.sky,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          opacity: fadeIn(frame, c2i + 18, 14),
        }}
      >
        C2 escrito
        <br />
        en la muestra
      </div>

      {/* i2c: new sample nodes = more Capability. */}
      <div
        style={{
          position: 'absolute',
          left: SAMPLE_X - 40,
          top: 118,
          width: 440,
          fontFamily: FONT.sans,
          fontSize: TYPE.label,
          fontWeight: 650,
          color: C.text,
          lineHeight: 1.2,
          ...enter(frame, i2c, { distance: 16 }),
        }}
      >
        otras muestras que llaman
        <br />
        al <span style={{ color: C.sky, fontWeight: 800 }}>mismo C2</span>
      </div>
      {SAMPLES.map((s, i) => {
        const p = progress(frame, i2c + 20 + i * 10, 16);
        if (p <= 0) return null;
        return (
          <div
            key={s}
            style={{
              position: 'absolute',
              left: SAMPLE_X,
              top: SAMPLE_Y[i],
              transform: `translateY(-50%) scale(${0.85 + 0.15 * p})`,
              transformOrigin: 'left center',
              opacity: p,
            }}
          >
            <Chip accent="amber" icon="file" size={TYPE.label}>
              {s}
            </Chip>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: SAMPLE_X, top: 486, opacity: fadeIn(frame, i2c + 56, 14) }}>
        <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 800, color: C.amber, whiteSpace: 'nowrap' }}>= más Capability</div>
      </div>

      {/* i2a: the adversary's slip — the registration email, not yet known. */}
      <div
        style={{
          position: 'absolute',
          left: 800,
          top: 0,
          width: 440,
          fontFamily: FONT.sans,
          fontSize: TYPE.label,
          lineHeight: 1.2,
          ...enter(frame, i2a + 10, { distance: 14 }),
        }}
      >
        <div style={{ fontWeight: 800, color: C.roseSoft }}>descuido del adversario:</div>
        <div style={{ fontWeight: 650, color: C.text }}>email de registro</div>
      </div>
      <div style={{ position: 'absolute', left: 996, top: 164, ...enter(frame, i2a + 26, { distance: 12 }) }}>
        <Chip accent="rose" icon="mail" size={TYPE.label}>
          email: ???
        </Chip>
      </div>

      {/* s08-04: the mechanic of Lab 3A. */}
      <div style={{ position: 'absolute', left: SAMPLE_X - 40, top: 572, ...enter(frame, labAt, { distance: 18 }) }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 22px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.cyan, 0.7)}`,
            background: alpha(C.cyan, 0.12),
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 750,
            color: C.textStrong,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="flag" size={34} color={C.cyan} />
          Lab 3A · Pivot Hunt
        </div>
      </div>
    </Stage>
  );
}

function fanCurve(a: Point, b: Point): Curve {
  const dx = (b.x - a.x) * 0.5;
  return [a, { x: a.x + dx, y: a.y }, { x: b.x - dx, y: b.y }, b];
}

/** Link that draws itself from its start and ends in an arrowhead; optional travelling flow. */
function Arrow({
  id,
  curve,
  draw,
  color,
  dashed = false,
  flow,
  width = 6,
}: {
  id: string;
  curve: Curve;
  draw: number;
  color: string;
  dashed?: boolean;
  flow?: number;
  width?: number;
}) {
  if (draw <= 0) return null;
  const d = cubicPath(curve);
  const len = cubicLength(curve);
  const end = cubicPoint(curve, Math.min(1, draw));
  const back = cubicPoint(curve, Math.max(0, Math.min(1, draw) - 0.04));
  const ang = Math.atan2(end.y - back.y, end.x - back.x);
  const hl = 18;
  const hw = 11;
  const head = [
    `${end.x},${end.y}`,
    `${end.x - hl * Math.cos(ang) + hw * Math.sin(ang)},${end.y - hl * Math.sin(ang) - hw * Math.cos(ang)}`,
    `${end.x - hl * Math.cos(ang) - hw * Math.sin(ang)},${end.y - hl * Math.sin(ang) + hw * Math.cos(ang)}`,
  ].join(' ');
  const maskId = `pivot-mask-${id}`;
  return (
    <g>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={-200} y={-200} width={2200} height={1100}>
          <path d={d} fill="none" stroke="#ffffff" strokeWidth={width + 8} strokeLinecap="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - draw)} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path d={d} fill="none" stroke={alpha(color, 0.25)} strokeWidth={width + 10} strokeLinecap="round" />
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '16 12' : undefined} />
        {flow !== undefined ? (
          <path d={d} fill="none" stroke={C.textStrong} strokeWidth={width - 2} strokeLinecap="round" strokeDasharray="10 60" strokeDashoffset={-flow * 70} opacity={0.7} />
        ) : null}
      </g>
      <polygon points={head} fill={color} />
    </g>
  );
}
