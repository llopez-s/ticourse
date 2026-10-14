import { alpha } from '../../../../../engine/src/theme/tokens';
import { cubicPoint, type Point } from '../../../../../engine/src/ui';
import { INK, clamp01 } from './geom';

/** A walkie on its own, centred on (x, y), `h` tall with its antenna. `ghost` 0–1: a dashed grey outline (nobody there). */
export function WalkieGlyph({ x, y, h = 70, tone = INK.amber, ghost = 0, opacity = 1 }: { x: number; y: number; h?: number; tone?: string; ghost?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const s = h / 70;
  const g = clamp01(ghost);
  const c = g > 0.5 ? INK.ghost : tone;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <line x1={8} y1={-14} x2={8} y2={-35} stroke={c} strokeWidth={4} strokeLinecap="round" strokeDasharray={g > 0.5 ? '4 5' : undefined} />
      <rect x={-14} y={-14} width={28} height={49} rx={6} fill={g > 0.5 ? 'none' : '#1c1917'} stroke={c} strokeWidth={4} strokeDasharray={g > 0.5 ? '7 6' : undefined} />
      {g > 0.5 ? null : (
        <g>
          <rect x={-8} y={-7} width={16} height={11} rx={2} fill={alpha(c, 0.85)} />
          <path d="M-7 13 H7 M-7 20 H7 M-7 27 H7" stroke={alpha(c, 0.7)} strokeWidth={2.6} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/** Headphones: «alguien escucha» (cyan, the analyst's side). Centred on (x, y). */
export function ListenerGlyph({ x, y, size = 54, opacity = 1 }: { x: number; y: number; size?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const s = size / 54;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <circle cx={0} cy={0} r={31} fill="#082f3a" stroke={alpha(INK.cyan, 0.5)} strokeWidth={2.5} />
      <path d="M-17 6 V-2 A17 17 0 0 1 17 -2 V6" fill="none" stroke={INK.cyan} strokeWidth={5} strokeLinecap="round" />
      <rect x={-22} y={3} width={11} height={17} rx={4} fill={INK.cyan} />
      <rect x={11} y={3} width={11} height={17} rx={4} fill={INK.cyan} />
    </g>
  );
}

const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

export interface ChannelState {
  /** 0–1: the line is drawn, from the suspect's end. */
  draw?: number;
  /** 0–1: somebody answers at the far end (his boss): pulses go both ways. */
  talk?: number;
  /** 0–1: nobody answers any more (DENY, the sinkhole): the far half goes dashed grey, his calls die on the way. */
  nobody?: number;
  /** 0–1: a noisy, slow channel (DEGRADE): the line turns to static. */
  noisy?: number;
  /** 0–1: somebody listens on the line (DETECT): cyan headphones tapping it. */
  listener?: number;
  /** Seconds; runs the pulses and the static. */
  phase?: number;
}

const SPLIT = 0.56;

/** The walkie's channel between `from` (the suspect's antenna) and `to` (the far end). See ChannelState. */
export function Channel({ from, to, state }: { from: Point; to: Point; state: ChannelState }) {
  const { draw = 1, talk = 1, nobody = 0, noisy = 0, listener = 0, phase = 0 } = state;
  const d = clamp01(draw);
  if (d <= 0.004) return null;
  const nb = clamp01(nobody);
  const nz = clamp01(noisy);
  const curve: [Point, Point, Point, Point] = [from, { x: from.x + 12, y: from.y - 190 }, { x: to.x - 230, y: to.y - 104 }, { x: to.x - 20, y: to.y + 4 }];
  const N = 56;
  const step = Math.floor(phase * 3);
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const p = cubicPoint(curve, t);
    const q = cubicPoint(curve, Math.min(1, t + 0.01));
    const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
    const nx = -(q.y - p.y) / len;
    const ny = (q.x - p.x) / len;
    const edge = Math.sin(Math.PI * t);
    const wave = 5 * Math.sin(t * 34 - phase * 5) * (1 - nz);
    const stat = 13 * (hash(i * 3 + step) - 0.5) * 2 * nz;
    const off = (wave + stat) * edge;
    return { x: p.x + nx * off, y: p.y + ny * off, t };
  });
  const seg = (a: number, b: number) =>
    pts
      .filter((p) => p.t >= a - 1e-6 && p.t <= Math.min(b, d) + 1e-6)
      .map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
  const near = seg(0, SPLIT);
  const far = d > SPLIT ? seg(SPLIT, 1) : '';
  const out = (phase * 0.45) % 1;
  const back = 1 - ((phase * 0.45 + 0.5) % 1);
  const dot = (t: number, a: number, key: string) => {
    if (a <= 0.02 || t > d) return null;
    const p = cubicPoint(curve, t);
    return <circle key={key} cx={p.x} cy={p.y} r={7} fill={INK.amberSoft} opacity={a} />;
  };
  // The listener taps the line over the free stretch of wall between the alarm and the camera.
  const mid = cubicPoint(curve, 0.74);
  const answered = clamp01(talk) * (1 - nb);
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={near} stroke={alpha(INK.amber, 0.9 - 0.25 * nz)} strokeWidth={4} />
      {far ? <path d={far} stroke={alpha(INK.amber, (0.9 - 0.25 * nz) * (1 - nb))} strokeWidth={4} /> : null}
      {far && nb > 0.01 ? <path d={far} stroke={alpha(INK.ghost, 0.9 * nb)} strokeWidth={3.5} strokeDasharray="3 11" /> : null}
      {dot(out, (out > SPLIT ? 1 - nb : 1) * (1 - 0.5 * nz) * Math.sin(Math.PI * out), 'out')}
      {dot(back, answered * (1 - 0.5 * nz) * Math.sin(Math.PI * back), 'back')}
      <WalkieGlyph x={to.x} y={to.y} tone={INK.amber} ghost={nb} opacity={d > 0.9 ? Math.max(clamp01(talk), nb) : 0} />
      {listener > 0.01 ? (
        <g opacity={clamp01(listener)}>
          <path d={`M${mid.x} ${mid.y} L${mid.x + 6} ${mid.y + 40}`} stroke={INK.cyan} strokeWidth={3.5} strokeDasharray="6 7" />
          <ListenerGlyph x={mid.x + 10} y={mid.y + 70} />
        </g>
      ) : null}
    </g>
  );
}
