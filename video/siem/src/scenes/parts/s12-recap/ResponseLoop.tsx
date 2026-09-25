import { ACCENT, C, FONT, alpha, type Accent } from '../../../../../engine/src/theme/tokens';
import { EASE, lerp, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, type IconName, type Point } from '../../../../../engine/src/ui';

/* Local geometry of the loop box (its top-left is placed by the caller). */
export const LOOP_BOX = { w: 800, h: 520 };
const RING = { cx: 380, cy: 332, r: 172 };
const NODE_R = 38;
const HUB_R = 68;
const LABEL = 34;
/** Degrees trimmed off each end of an arc so it clears the node circles. */
const TRIM = ((NODE_R + 10) / RING.r) * (180 / Math.PI);

type Side = 'above' | 'right' | 'left';

const NODES: { label: string; icon: IconName; accent: Accent; angle: number; side: Side }[] = [
  { label: 'Triaje', icon: 'search', accent: 'cyan', angle: -90, side: 'above' },
  { label: 'Contención', icon: 'lock', accent: 'emerald', angle: -18, side: 'right' },
  { label: 'Corrección', icon: 'gear', accent: 'emerald', angle: 54, side: 'right' },
  { label: 'Validación', icon: 'check', accent: 'emerald', angle: 126, side: 'left' },
  { label: 'Ajuste', icon: 'funnel', accent: 'cyan', angle: 198, side: 'left' },
];

const rad = (deg: number) => (deg * Math.PI) / 180;
const onRing = (deg: number): Point => ({ x: RING.cx + RING.r * Math.cos(rad(deg)), y: RING.cy + RING.r * Math.sin(rad(deg)) });
const HUB: Point = { x: RING.cx, y: RING.cy };

interface Stroke {
  d: string;
  length: number;
  end: Point;
  /** Unit direction of travel at the end (for the arrowhead). */
  dir: Point;
  points: Point[];
}

function polyline(points: Point[], dir: Point): Stroke {
  let length = 0;
  for (let i = 1; i < points.length; i++) length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('');
  return { d, length, end: points[points.length - 1], dir, points };
}

/** Clockwise arc along the ring between two node angles, clear of both nodes. */
function arc(from: number, to: number): Stroke {
  const a = from + TRIM;
  const b = to - TRIM - 2;
  const steps = 28;
  const points = Array.from({ length: steps + 1 }, (_, i) => onRing(a + ((b - a) * i) / steps));
  return polyline(points, { x: -Math.sin(rad(b)), y: Math.cos(rad(b)) });
}

/** Straight arrow from one circle's edge to another's. */
function radial(from: Point, fromR: number, to: Point, toR: number): Stroke {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const dir = { x: (to.x - from.x) / len, y: (to.y - from.y) / len };
  const a = { x: from.x + dir.x * (fromR + 8), y: from.y + dir.y * (fromR + 8) };
  const b = { x: to.x - dir.x * (toR + 12), y: to.y - dir.y * (toR + 12) };
  return polyline([a, b], dir);
}

const NODE_POS = NODES.map((n) => onRing(n.angle));
const ARCS = NODES.slice(0, -1).map((n, i) => arc(n.angle, NODES[i + 1].angle));
/** Ajuste feeds the SIEM rules; the tuned SIEM feeds the next triage. */
const INTO_HUB = radial(NODE_POS[4], NODE_R, HUB, HUB_R);
const OUT_OF_HUB = radial(HUB, HUB_R, NODE_POS[0], NODE_R);
const CIRCUIT = [...ARCS, INTO_HUB, OUT_OF_HUB];
const CIRCUIT_LENGTH = CIRCUIT.reduce((sum, s) => sum + s.length, 0);

function pointAlong(s: number): Point {
  let rest = ((s % CIRCUIT_LENGTH) + CIRCUIT_LENGTH) % CIRCUIT_LENGTH;
  for (const stroke of CIRCUIT) {
    if (rest > stroke.length) {
      rest -= stroke.length;
      continue;
    }
    for (let i = 1; i < stroke.points.length; i++) {
      const p = stroke.points[i - 1];
      const q = stroke.points[i];
      const seg = Math.hypot(q.x - p.x, q.y - p.y);
      if (rest <= seg) return { x: p.x + ((q.x - p.x) * rest) / seg, y: p.y + ((q.y - p.y) * rest) / seg };
      rest -= seg;
    }
    return stroke.end;
  }
  return CIRCUIT[0].points[0];
}

function Arrow({ stroke, draw, color }: { stroke: Stroke; draw: number; color: string }) {
  if (draw <= 0) return null;
  const { end, dir } = stroke;
  const px = -dir.y;
  const py = dir.x;
  const tip = { x: end.x + dir.x * 7, y: end.y + dir.y * 7 };
  const back = { x: end.x - dir.x * 9, y: end.y - dir.y * 9 };
  const head = `${tip.x},${tip.y} ${back.x + px * 9},${back.y + py * 9} ${back.x - px * 9},${back.y - py * 9}`;
  return (
    <g>
      <path
        d={stroke.d}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${stroke.length} ${stroke.length}`}
        strokeDashoffset={stroke.length * (1 - draw)}
      />
      <polygon points={head} fill={color} opacity={progress(draw, 0.8, 0.2, EASE.linear)} />
    </g>
  );
}

export interface LoopTimes {
  loop: number;
  /** Word frames of triaje, contención, corrección, validación, ajuste. */
  nodes: number[];
}

/**
 * The Blue Team response cycle: Triaje, Contención, Corrección, Validación
 * and Ajuste around a ring, each lit on its word; Ajuste feeds the SIEM rules
 * at the hub, which feed the next triage. Rendered in a LOOP_BOX-sized box.
 */
export function ResponseLoop({ frame, fps, t }: { frame: number; fps: number; t: LoopTimes }) {
  const intro = progress(frame, t.loop - 2, 16);
  const hubIn = springIn(frame, fps, t.loop + 4, { damping: 16 });
  const last = t.nodes[t.nodes.length - 1];
  const intoHub = progress(frame, last + 10, 12, EASE.inOut);
  const outOfHub = progress(frame, last + 22, 12, EASE.inOut);
  const hubPing = progress(frame, last + 20, 6) * (1 - progress(frame, last + 30, 26));
  const circulate = progress(frame, last + 36, 16);
  const packet = pointAlong(Math.max(0, frame - (last + 36)) * (CIRCUIT_LENGTH / 150));

  return (
    <div style={{ position: 'relative', width: LOOP_BOX.w, height: LOOP_BOX.h, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: RING.cx * 2, display: 'flex', justifyContent: 'center', opacity: intro }}>
        <Chip accent="cyan" icon="shield" size={28}>
          Respuesta del Blue Team
        </Chip>
      </div>

      <svg width={LOOP_BOX.w} height={LOOP_BOX.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }} aria-hidden>
        <circle
          cx={RING.cx}
          cy={RING.cy}
          r={RING.r}
          fill="none"
          stroke={alpha(C.ink600, 0.7)}
          strokeWidth={2}
          strokeDasharray="4 10"
          opacity={intro}
        />
        {ARCS.map((stroke, i) => (
          <Arrow
            key={i}
            stroke={stroke}
            draw={progress(frame, t.nodes[i] + 6, Math.max(8, t.nodes[i + 1] - t.nodes[i] - 4), EASE.inOut)}
            color={alpha(C.cyanSoft, 0.75)}
          />
        ))}
        <Arrow stroke={INTO_HUB} draw={intoHub} color={alpha(C.cyanSoft, 0.9)} />
        <Arrow stroke={OUT_OF_HUB} draw={outOfHub} color={alpha(C.cyanSoft, 0.9)} />

        {circulate > 0 ? (
          <g opacity={circulate}>
            <circle cx={packet.x} cy={packet.y} r={15} fill={alpha(C.cyan, 0.2)} />
            <circle cx={packet.x} cy={packet.y} r={7} fill={C.cyan} />
          </g>
        ) : null}
      </svg>

      {/* Hub: the SIEM and its rules. */}
      <div
        style={{
          position: 'absolute',
          left: HUB.x - HUB_R,
          top: HUB.y - HUB_R,
          width: HUB_R * 2,
          height: HUB_R * 2,
          borderRadius: HUB_R,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle at 50% 35%, ${alpha(C.cyanDeep, 0.5)} 0%, ${C.ink900} 75%)`,
          border: `3px solid ${alpha(C.cyan, 0.6 + 0.4 * hubPing)}`,
          boxShadow: `0 0 ${24 + 30 * hubPing}px ${alpha(C.cyan, 0.18 + 0.3 * hubPing)}`,
          opacity: Math.min(1, hubIn * 1.3),
          transform: `scale(${0.8 + 0.2 * hubIn})`,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 850, letterSpacing: 2, color: C.cyan, lineHeight: 1 }}>SIEM</div>
        <div style={{ marginTop: 6, fontSize: 28, fontWeight: 600, color: C.muted, lineHeight: 1 }}>reglas</div>
      </div>

      {NODES.map((node, i) => {
        const p = NODE_POS[i];
        const at = t.nodes[i];
        const pop = springIn(frame, fps, at - 3, { damping: 15 });
        const glow = progress(frame, at, 6) * (1 - progress(frame, at + 14, 30));
        const a = ACCENT[node.accent];
        const opacity = Math.min(1, pop * 1.4);
        const labelStyle = {
          position: 'absolute' as const,
          fontSize: LABEL,
          fontWeight: 700,
          color: C.textStrong,
          whiteSpace: 'nowrap' as const,
          lineHeight: 1,
          opacity: lerp(frame, [at - 2, at + 8], [0, 1]),
        };
        const gap = NODE_R + 14;
        return (
          <div key={node.label}>
            <div
              style={{
                position: 'absolute',
                left: p.x - NODE_R,
                top: p.y - NODE_R,
                width: NODE_R * 2,
                height: NODE_R * 2,
                borderRadius: NODE_R,
                display: 'grid',
                placeItems: 'center',
                background: `linear-gradient(180deg, ${alpha(a.fg, 0.2)} 0%, ${C.ink900} 100%)`,
                border: `3px solid ${alpha(a.fg, 0.7 + 0.3 * glow)}`,
                boxShadow: `0 0 ${18 + 30 * glow}px ${alpha(a.fg, 0.15 + 0.35 * glow)}`,
                opacity,
                transform: `scale(${0.6 + 0.4 * pop})`,
              }}
            >
              <Icon name={node.icon} size={38} color={a.fg} strokeWidth={2} />
            </div>
            {node.side === 'above' ? (
              <div style={{ ...labelStyle, left: p.x - 150, width: 300, textAlign: 'center', top: p.y - gap - LABEL }}>{node.label}</div>
            ) : node.side === 'right' ? (
              <div style={{ ...labelStyle, left: p.x + gap, top: p.y - LABEL / 2 }}>{node.label}</div>
            ) : (
              <div style={{ ...labelStyle, right: LOOP_BOX.w - (p.x - gap), top: p.y - LABEL / 2 }}>{node.label}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
