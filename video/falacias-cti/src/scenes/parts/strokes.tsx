import { C, alpha } from '../../../../engine/src/theme/tokens';

export type Pt = { x: number; y: number };

/** The first `p` (0-1) of a polyline: its SVG path, the tip (where the pen is) and the heading at the tip (radians). */
export function partial(points: readonly Pt[], p: number): { d: string; tip: Pt; angle: number; done: boolean } {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const l = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    lens.push(l);
    total += l;
  }
  const want = Math.max(0, Math.min(1, p)) * total;
  const out: Pt[] = [points[0]];
  let acc = 0;
  let angle = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    angle = Math.atan2(b.y - a.y, b.x - a.x);
    if (acc + lens[i - 1] <= want) {
      out.push(b);
      acc += lens[i - 1];
    } else {
      const t = lens[i - 1] > 0 ? (want - acc) / lens[i - 1] : 0;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      break;
    }
  }
  const d = out.map((q, i) => `${i === 0 ? 'M' : 'L'} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' ');
  return { d, tip: out[out.length - 1], angle, done: p >= 1 };
}

/** A hand-drawn loop round an ellipse: a little more than one turn, with a slight wobble and a drift outwards. */
export function ellipsePoints(cx: number, cy: number, rx: number, ry: number, { start = -2.6, turns = 1.08, wobble = 0.035, n = 140 } = {}): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const t = start + u * turns * 2 * Math.PI;
    const r = 1 + wobble * Math.sin(3 * t + 1) + 0.06 * u;
    pts.push({ x: cx + rx * r * Math.cos(t), y: cy + ry * r * Math.sin(t) });
  }
  return pts;
}

/** A nearly straight stroke with a small hand wobble. */
export function linePoints(a: Pt, b: Pt, { n = 28, wobble = 3 } = {}): Pt[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const w = wobble * Math.sin(u * Math.PI * 3) * Math.sin(u * Math.PI);
    pts.push({ x: a.x + dx * u + nx * w, y: a.y + dy * u + ny * w });
  }
  return pts;
}

/** A quadratic curve from a to b bent towards `c`. */
export function curvePoints(a: Pt, c: Pt, b: Pt, n = 40): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const m = 1 - u;
    pts.push({ x: m * m * a.x + 2 * m * u * c.x + u * u * b.x, y: m * m * a.y + 2 * m * u * c.y + u * u * b.y });
  }
  return pts;
}

/** A stroke in a given colour, drawn up to `p`, as a <path>. Render inside an <svg> in the same coordinates. */
export function Stroke({ points, p, color = C.rose, width = 7, glow = 0, dashed = false }: { points: readonly Pt[]; p: number; color?: string; width?: number; glow?: number; dashed?: boolean }) {
  if (p <= 0.001) return null;
  const { d } = partial(points, p);
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? `${width * 0.2} ${width * 2.2}` : undefined}
      style={{ filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(10 * glow)}px ${alpha(color, 0.7 * glow)})` : undefined }}
    />
  );
}

/** An arrow: a stroke drawn up to `p` and, once it is nearly there, its head. */
export function Arrow({ points, p, color = C.cyan, width = 6, head = 22, dashed = false, glow = 0 }: { points: readonly Pt[]; p: number; color?: string; width?: number; head?: number; dashed?: boolean; glow?: number }) {
  if (p <= 0.001) return null;
  const { tip, angle } = partial(points, p);
  const a = (deg: number) => ({ x: tip.x + head * Math.cos(angle + (deg * Math.PI) / 180), y: tip.y + head * Math.sin(angle + (deg * Math.PI) / 180) });
  const l = a(152);
  const r = a(-152);
  const headShow = Math.max(0, Math.min(1, (p - 0.88) / 0.12));
  return (
    <g>
      <Stroke points={points} p={p} color={color} width={width} dashed={dashed} glow={glow} />
      {headShow > 0.01 ? <path d={`M ${l.x.toFixed(1)} ${l.y.toFixed(1)} L ${tip.x.toFixed(1)} ${tip.y.toFixed(1)} L ${r.x.toFixed(1)} ${r.y.toFixed(1)}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={headShow} /> : null}
    </g>
  );
}

/** A hand-drawn loop round a rounded rectangle (a little more than one turn, clockwise from the top-left corner). */
export function roundRectPoints(x: number, y: number, w: number, h: number, r: number, { turns = 1.06, wobble = 1.2, step = 8 } = {}): Pt[] {
  const side = (a: Pt, b: Pt): Pt[] => {
    const n = Math.max(2, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / step));
    return Array.from({ length: n }, (_, i) => ({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n }));
  };
  const arc = (cx: number, cy: number, a0: number): Pt[] => Array.from({ length: 8 }, (_, i) => ({ x: cx + r * Math.cos(a0 + (i / 8) * (Math.PI / 2)), y: cy + r * Math.sin(a0 + (i / 8) * (Math.PI / 2)) }));
  const loop = [
    ...side({ x: x + r, y }, { x: x + w - r, y }),
    ...arc(x + w - r, y + r, -Math.PI / 2),
    ...side({ x: x + w, y: y + r }, { x: x + w, y: y + h - r }),
    ...arc(x + w - r, y + h - r, 0),
    ...side({ x: x + w - r, y: y + h }, { x: x + r, y: y + h }),
    ...arc(x + r, y + h - r, Math.PI / 2),
    ...side({ x, y: y + h - r }, { x, y: y + r }),
    ...arc(x + r, y + r, Math.PI),
  ];
  const total = Math.round(loop.length * turns);
  return Array.from({ length: total + 1 }, (_, i) => {
    const q = loop[i % loop.length];
    const u = i / total;
    const drift = 6 * u * (i >= loop.length ? 1 : 0);
    return { x: q.x + wobble * Math.sin(i * 0.35) + drift, y: q.y + wobble * Math.cos(i * 0.3) + drift };
  });
}
