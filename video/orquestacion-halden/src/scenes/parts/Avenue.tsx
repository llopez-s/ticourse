import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The avenue's own units; it is drawn at any `width` with this aspect ratio. */
export const AVENUE = { w: 600, h: 380 } as const;

const ROAD_Y = 228;
const ROAD_H = 64;
const LANE_A = ROAD_Y + 12; // rightbound
const LANE_B = ROAD_Y + 38; // leftbound
const CENTRAL = { x: 236, y: 22, w: 128, h: 74 } as const;
const CAR_W = 26;
const CAR_H = 14;

function crossings(n: number): number[] {
  if (n <= 1) return [AVENUE.w / 2];
  const left = 54;
  const right = AVENUE.w - 54;
  return Array.from({ length: n }, (_, i) => left + (i * (right - left)) / (n - 1));
}

/** Where light `i` of `n` sits (avenue units), for callers that point at one. */
export function avenueLight(i: number, n: number): { x: number; y: number } {
  const xs = crossings(n);
  const step = n > 1 ? xs[1] - xs[0] : 120;
  return { x: xs[i] + Math.min(24, step * 0.36), y: ROAD_Y - 14 };
}

const wrap = (x: number, len: number) => ((x % len) + len) % len;

/** Cars fade out at the drawing's edges instead of driving past its frame. */
const edgeFade = (x: number) => clamp01(Math.min(x - 4, AVENUE.w - CAR_W - 4 - x) / 16);

/** The ambulance's left edge (avenue units) at `t` 0–1: it stays inside the drawing. */
export const ambulanceX = (t: number) => 6 + t * (AVENUE.w - 52);

/**
 * The avenue seen from above («imagen · no es del puerto»): a straight road crossed by `n` streets, a light dot at
 * every crossing, and the central — a small building with a mast — linked to every light by thin dashed lines. The
 * caller decides each light (`green(i)` 0–1, red otherwise), moves the cars (`frame`), sends an ambulance along the
 * rightbound lane (`ambulance` 0–1), bunches the cars at the reds (`jam`), switches the central off (`off`, grey,
 * links gone) or has it taken (`taken`, rose, an intruder inside). The central is never amber.
 */
export function Avenue({
  width,
  n = 5,
  green,
  frame,
  ambulance,
  jam = 0,
  off = 0,
  taken = 0,
  links = 1,
  cars = true,
}: {
  width: number;
  n?: number;
  green: (i: number) => number;
  frame: number;
  ambulance?: number | null;
  jam?: number;
  off?: number;
  taken?: number;
  links?: number;
  cars?: boolean;
}) {
  const xs = crossings(n);
  const step = n > 1 ? xs[1] - xs[0] : 120;
  const streetW = Math.min(34, step * 0.42);
  const dotR = Math.min(11, step * 0.3);
  const o = clamp01(off);
  const t = clamp01(taken);
  const normal = (1 - o) * (1 - t);
  const linkOn = clamp01(links) * (1 - o);
  const centralX = CENTRAL.x + CENTRAL.w / 2;
  const centralY = CENTRAL.y + CENTRAL.h;
  const jamK = clamp01(jam);

  // Cars: moving positions, and where each one stops when the avenue jams (behind a crossing).
  const laneA = [0, 150, 300, 470].map((o0, k) => {
    const moving = wrap(o0 + frame * 2.2, AVENUE.w + 60) - 30;
    const stop = xs[Math.min(1, n - 1)] - streetW / 2 - 8 - CAR_W - k * (CAR_W + 6);
    return moving + (stop - moving) * jamK;
  });
  const laneB = [60, 260, 420].map((o0, k) => {
    const moving = AVENUE.w + 30 - wrap(o0 + frame * 1.8, AVENUE.w + 60);
    const stop = xs[Math.max(0, n - 2)] + streetW / 2 + 8 + k * (CAR_W + 6);
    return moving + (stop - moving) * jamK;
  });

  return (
    <svg width={width} height={(width * AVENUE.h) / AVENUE.w} viewBox={`0 0 ${AVENUE.w} ${AVENUE.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={0} y={0} width={AVENUE.w} height={AVENUE.h} rx={18} fill={C.ink850} stroke={alpha(C.text, 0.12)} strokeWidth={2} />
      {/* blocks between the streets */}
      {xs.slice(0, -1).map((x, i) => {
        const bx = x + streetW / 2 + 6;
        const bw = xs[i + 1] - x - streetW - 12;
        if (bw < 6) return null;
        return (
          <g key={i}>
            <rect x={bx} y={ROAD_Y - 96} width={bw} height={70} rx={4} fill={alpha(C.ink700, 0.55)} />
            <rect x={bx} y={ROAD_Y + ROAD_H + 18} width={bw} height={56} rx={4} fill={alpha(C.ink700, 0.55)} />
          </g>
        );
      })}
      {/* cross streets */}
      {xs.map((x, i) => (
        <rect key={i} x={x - streetW / 2} y={ROAD_Y - 110} width={streetW} height={AVENUE.h - (ROAD_Y - 110) - 6} fill={C.ink700} />
      ))}
      {/* the avenue */}
      <rect x={0} y={ROAD_Y} width={AVENUE.w} height={ROAD_H} fill={C.ink700} />
      <line x1={8} y1={ROAD_Y + ROAD_H / 2} x2={AVENUE.w - 8} y2={ROAD_Y + ROAD_H / 2} stroke={alpha(C.text, 0.3)} strokeWidth={2} strokeDasharray="14 12" />

      {/* links central -> lights */}
      {linkOn > 0.01
        ? xs.map((_, i) => {
            const p = avenueLight(i, n);
            const d = `M ${centralX} ${centralY} C ${centralX} ${centralY + 50}, ${p.x} ${p.y - 70}, ${p.x} ${p.y - dotR - 2}`;
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={t > 0.5 ? C.rose : C.cyan}
                strokeOpacity={(n > 12 ? 0.32 : 0.5) * linkOn}
                strokeWidth={n > 12 ? 1.5 : 2.5}
                strokeDasharray="6 7"
                strokeDashoffset={-frame * 0.8}
              />
            );
          })
        : null}

      {/* cars */}
      {cars
        ? [
            ...laneA.map((x, k) => <rect key={`a${k}`} x={x} y={LANE_A - CAR_H / 2} width={CAR_W} height={CAR_H} rx={4} fill={alpha(C.text, 0.55)} opacity={edgeFade(x)} />),
            ...laneB.map((x, k) => <rect key={`b${k}`} x={x} y={LANE_B - CAR_H / 2} width={CAR_W} height={CAR_H} rx={4} fill={alpha(C.text, 0.4)} opacity={edgeFade(x)} />),
          ]
        : null}

      {/* the ambulance */}
      {ambulance !== undefined && ambulance !== null && ambulance >= 0 && ambulance <= 1 ? (
        <g transform={`translate(${ambulanceX(ambulance)} ${LANE_A - 10})`}>
          <rect x={0} y={0} width={40} height={20} rx={4} fill="#f8fafc" />
          <rect x={30} y={2} width={8} height={16} rx={2} fill={alpha(C.sky, 0.6)} />
          <rect x={10} y={8} width={14} height={4} fill={C.rose} />
          <rect x={15} y={3} width={4} height={14} fill={C.rose} />
          <circle cx={20} cy={-4} r={4} fill={C.sky} opacity={0.5 + 0.5 * Math.abs(Math.sin((frame / 30) * Math.PI))} />
        </g>
      ) : null}

      {/* the lights */}
      {xs.map((_, i) => {
        const p = avenueLight(i, n);
        const g = clamp01(green(i));
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={dotR + 3} fill={alpha(C.ink950, 0.9)} />
            <circle cx={p.x} cy={p.y} r={dotR} fill={C.rose} opacity={1 - g} />
            <circle cx={p.x} cy={p.y} r={dotR} fill={C.emerald} opacity={g} />
            {n <= 12 ? <circle cx={p.x} cy={p.y} r={dotR + 8} fill={g > 0.5 ? C.emerald : C.rose} opacity={0.18} /> : null}
          </g>
        );
      })}

      {/* the central */}
      <g>
        <line x1={CENTRAL.x + CENTRAL.w - 22} y1={CENTRAL.y} x2={CENTRAL.x + CENTRAL.w - 22} y2={CENTRAL.y - 18} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
        <circle cx={CENTRAL.x + CENTRAL.w - 22} cy={CENTRAL.y - 20} r={5} fill={o > 0.5 ? C.ink600 : t > 0.5 ? C.rose : C.cyan} />
        <rect x={CENTRAL.x} y={CENTRAL.y} width={CENTRAL.w} height={CENTRAL.h} rx={10} fill={C.ink800} stroke={alpha(C.cyan, 0.85)} strokeOpacity={normal} strokeWidth={3} />
        <rect x={CENTRAL.x} y={CENTRAL.y} width={CENTRAL.w} height={CENTRAL.h} rx={10} fill={alpha(C.ink950, 0.6)} stroke={C.ink600} strokeWidth={3} opacity={o} />
        <rect x={CENTRAL.x} y={CENTRAL.y} width={CENTRAL.w} height={CENTRAL.h} rx={10} fill={alpha(C.rose, 0.12)} stroke={C.rose} strokeWidth={3} opacity={t} />
        {/* windows: cyan when it works, dark when off, hidden behind the intruder when taken */}
        {Array.from({ length: 6 }, (_, k) => (
          <rect
            key={k}
            x={CENTRAL.x + 14 + (k % 3) * 36}
            y={CENTRAL.y + 14 + Math.floor(k / 3) * 26}
            width={26}
            height={16}
            rx={3}
            fill={C.cyan}
            opacity={0.15 + 0.55 * normal}
          />
        ))}
        {t > 0.01 ? (
          <g opacity={t} transform={`translate(${centralX} ${CENTRAL.y + 40})`}>
            <rect x={-30} y={-26} width={60} height={56} rx={8} fill={C.ink800} />
            <circle cx={0} cy={-8} r={10} fill={C.rose} />
            <path d="M -20 24 Q -20 4 0 4 Q 20 4 20 24 Z" fill={C.rose} />
          </g>
        ) : null}
      </g>
    </svg>
  );
}
