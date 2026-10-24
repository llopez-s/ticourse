import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui';

/**
 * The three things the head does, drawn INSIDE the skull (children of `<Head>`, grid coordinates):
 * percibe (eye), recuerda (archive) and conecta (link), joined by three arrows that go round in a circle.
 *   lit = [0,0,0]   0–1 per node: the node has been said
 *   flow = 0        0–1: how much of the arrows is drawn (the three of them, one after the other)
 *   bent = 0        0–1: the arrows go crooked and turn amber — «en el análisis se tuercen»
 */
export const STEP_NODES: readonly { icon: IconName; x: number; y: number }[] = [
  { icon: 'eye', x: 112, y: 100 },
  { icon: 'archive', x: 214, y: 100 },
  { icon: 'link', x: 163, y: 190 },
];
const R = 27;

function arrowPath(a: { x: number; y: number }, b: { x: number; y: number }, bow: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = a.x + ux * (R + 6);
  const sy = a.y + uy * (R + 6);
  const ex = b.x - ux * (R + 12);
  const ey = b.y - uy * (R + 12);
  // The control point bows outwards (away from the triangle's centre, ~ (163, 130)).
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const nx = -uy;
  const ny = ux;
  const out = (mx - 163) * nx + (my - 130) * ny >= 0 ? 1 : -1;
  const cx = mx + nx * bow * out;
  const cy = my + ny * bow * out;
  // Arrowhead along the last bit of the curve.
  const hx = ex - cx;
  const hy = ey - cy;
  const hl = Math.hypot(hx, hy);
  const hux = hx / hl;
  const huy = hy / hl;
  const head = [
    [ex, ey],
    [ex - hux * 14 - huy * 8, ey - huy * 14 + hux * 8],
    [ex - hux * 14 + huy * 8, ey - huy * 14 - hux * 8],
  ]
    .map((p) => p.join(','))
    .join(' ');
  return { d: `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`, head };
}

export function HeadSteps({ lit = [0, 0, 0], flow = 0, bent = 0 }: { lit?: readonly [number, number, number]; flow?: number; bent?: number }) {
  const col = bent > 0.02 ? `rgb(${Math.round(103 + (252 - 103) * bent)}, ${Math.round(232 + (211 - 232) * bent)}, ${Math.round(249 + (77 - 249) * bent)})` : C.cyanSoft;
  const arrows = [
    arrowPath(STEP_NODES[0], STEP_NODES[1], 16 + 26 * bent),
    arrowPath(STEP_NODES[1], STEP_NODES[2], 16 - 22 * bent),
    arrowPath(STEP_NODES[2], STEP_NODES[0], 16 + 30 * bent),
  ];
  return (
    <g>
      {arrows.map((a, i) => {
        // Each arrow takes a third of `flow`.
        const p = Math.max(0, Math.min(1, flow * 3 - i));
        return (
          <g key={i} opacity={p}>
            <path d={a.d} fill="none" stroke={col} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 0" />
            <polygon points={a.head} fill={col} />
          </g>
        );
      })}
      {STEP_NODES.map((n, i) => (
        <g key={n.icon} transform={`translate(${n.x} ${n.y})`}>
          <circle r={R} fill={alpha(C.ink950, 0.85)} stroke={alpha(C.cyan, 0.35 + 0.6 * lit[i])} strokeWidth={3.5} />
          <circle r={R} fill={alpha(C.cyan, 0.22 * lit[i])} />
          <g transform={`translate(${-17} ${-17})`}>
            <Icon name={n.icon} size={34} color={lit[i] > 0.3 ? C.cyanSoft : C.muted} strokeWidth={2} />
          </g>
        </g>
      ))}
    </g>
  );
}
