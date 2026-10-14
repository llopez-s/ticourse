import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { CANVAS, PD, type Point } from './geometry';

/**
 * The painting itself, in design units (see geometry.ts): an abstract composition of muted blocks — no
 * figure, no recognisable work or style — plus the signature and the date in its bottom-right corner, both
 * illegible on purpose (a flourish and a few dashes: never letters, never a year).
 * Everything here draws inside the caller's <svg>, already scaled to design units.
 */

/** The painting's own colours: the only decorative colour of the video (muted). */
export const PAINT = {
  ground: '#d6c59e',
  ochre: '#b8894a',
  sienna: '#8b5a3e',
  teal: '#5e7d80',
  slate: '#48607a',
  cream: '#e6dcc0',
  umber: '#3b2a1c',
  frame: '#2c2218',
  frameLine: '#7a623f',
} as const;

/** Museum furniture: easel, lamp, archive box. */
export const FURN = { steel: '#64748b', mid: '#475569', dark: '#334155', deep: '#1e293b' } as const;

/** The canvas ground and its blocks of colour. `art` 0–1 fades the blocks in over the bare ground. */
export function CanvasArt({ art = 1 }: { art?: number }) {
  return (
    <g>
      <rect x={CANVAS.x} y={CANVAS.y} width={CANVAS.w} height={CANVAS.h} fill={PAINT.ground} />
      <g opacity={art}>
        <rect x={40} y={48} width={182} height={206} rx={3} fill={PAINT.ochre} />
        <rect x={206} y={30} width={150} height={148} rx={3} fill={PAINT.slate} />
        <rect x={150} y={214} width={206} height={172} rx={3} fill={PAINT.sienna} />
        <rect x={34} y={292} width={150} height={182} rx={3} fill={PAINT.teal} />
        <rect x={250} y={196} width={74} height={54} rx={2} fill={PAINT.cream} />
        <rect x={62} y={76} width={66} height={12} rx={2} fill={alpha(PAINT.cream, 0.55)} />
        <rect x={54} y={426} width={96} height={10} rx={2} fill={alpha(PAINT.ground, 0.5)} />
        <rect x={226} y={54} width={12} height={92} rx={2} fill={alpha(PAINT.ground, 0.35)} />
        <path d="M24 270 L372 252" stroke={PAINT.umber} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      </g>
    </g>
  );
}

/** The frame's moulding, over the canvas edges. */
export function FrameBorder() {
  const t = PD.t;
  return (
    <g fill="none">
      <rect x={t / 2} y={t / 2} width={PD.w - t} height={PD.h - t} rx={3} stroke={PAINT.frame} strokeWidth={t} />
      <rect x={t - 1} y={t - 1} width={PD.w - 2 * t + 2} height={PD.h - 2 * t + 2} stroke={PAINT.frameLine} strokeWidth={2} />
      <rect x={1} y={1} width={PD.w - 2} height={PD.h - 2} rx={4} stroke={alpha('#000000', 0.6)} strokeWidth={2} />
    </g>
  );
}

// ---- The signature: a flourish, a quick underline and the date as four dashes.
const SIG: Point[] = [
  [246, 484], [254, 462], [262, 452], [267, 470], [262, 488], [275, 468], [285, 459], [289, 476],
  [299, 485], [307, 466], [317, 461], [319, 478], [331, 483], [345, 470], [362, 465], [379, 471],
].map(([x, y]) => ({ x, y }));
const UNDER: Point[] = [{ x: 244, y: 495 }, { x: 300, y: 489 }, { x: 350, y: 487 }];
const DATE: [Point, Point][] = [
  [{ x: 318, y: 501 }, { x: 327, y: 500 }],
  [{ x: 332, y: 501 }, { x: 337, y: 501 }],
  [{ x: 343, y: 500 }, { x: 353, y: 501 }],
  [{ x: 359, y: 501 }, { x: 365, y: 500 }],
];
/** Shares of the 0–1 progress: flourish, underline, date. */
const SHARE = { sig: 0.68, under: 0.84 } as const;

function smooth(pts: Point[]): string {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const m = { x: (pts[i].x + pts[i + 1].x) / 2, y: (pts[i].y + pts[i + 1].y) / 2 };
    d += ` Q ${pts[i].x} ${pts[i].y} ${m.x} ${m.y}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

function along(pts: Point[], t: number): Point {
  const k = Math.max(0, Math.min(1, t));
  const lens = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  let left = k * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (left <= lens[i] || i === lens.length - 1) {
      const f = lens[i] > 0 ? Math.min(1, left / lens[i]) : 0;
      return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f };
    }
    left -= lens[i];
  }
  return pts[pts.length - 1];
}

const part = (p: number, from: number, to: number) => Math.max(0, Math.min(1, (p - from) / (to - from)));

/** Where the brush is (design units) when the signature is `p` (0–1) painted. */
export function signaturePoint(p: number): Point {
  if (p <= SHARE.sig) return along(SIG, part(p, 0, SHARE.sig));
  if (p <= SHARE.under) return along(UNDER, part(p, SHARE.sig, SHARE.under));
  const q = part(p, SHARE.under, 1) * DATE.length;
  const i = Math.min(DATE.length - 1, Math.floor(q));
  return along(DATE[i], q - i);
}

/**
 * The signature and the date. `draw` 0–1 paints them stroke by stroke (1 = all there); `lit` 0–1 turns
 * them amber (cheap, forgeable) with a glow; `weight` scales the stroke (thumbnails want it heavier).
 */
export function Signature({ draw = 1, lit = 0, weight = 1 }: { draw?: number; lit?: number; weight?: number }) {
  if (draw <= 0.001) return null;
  const ink = lit > 0.5 ? C.amber : PAINT.umber;
  const stroke = (w: number) => ({ fill: 'none', stroke: ink, strokeWidth: w * weight, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });
  const dash = (t: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - t });
  const sig = part(draw, 0, SHARE.sig);
  const under = part(draw, SHARE.sig, SHARE.under);
  const date = part(draw, SHARE.under, 1) * DATE.length;
  return (
    <g style={lit > 0.02 ? { filter: `drop-shadow(0 0 ${4 + 8 * lit}px ${alpha(C.amber, 0.8 * lit)})` } : undefined}>
      {lit > 0.02 && lit <= 0.5 ? <path d={smooth(SIG)} {...stroke(3.4)} stroke={alpha(C.amber, lit * 2)} {...dash(sig)} /> : null}
      <path d={smooth(SIG)} {...stroke(3.4)} {...dash(sig)} />
      {under > 0 ? <path d={smooth(UNDER)} {...stroke(2.6)} {...dash(under)} /> : null}
      {DATE.map(([a, b], i) => {
        const t = Math.max(0, Math.min(1, date - i));
        return t > 0 ? <path key={i} d={`M ${a.x} ${a.y} L ${a.x + (b.x - a.x) * t} ${a.y + (b.y - a.y) * t}`} {...stroke(3)} /> : null;
      })}
    </g>
  );
}
