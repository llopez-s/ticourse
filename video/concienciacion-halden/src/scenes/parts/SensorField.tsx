import { C, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Pt {
  x: number;
  y: number;
  /** Frames after `dotsAt` at which the dot appears (0–48). */
  delay: number;
  /** Frames after `sensorsAt` at which the sensor wave reaches it (0–80, left to right). */
  wave: number;
  /** Offset of its idle pulse, in frames. */
  phase: number;
}

/** A deterministic scatter on a jittered grid: one dot per person, no two alike, nothing that counts them. */
export function sensorPoints(w: number, h: number, cols: number, rows: number, seed = 7): Pt[] {
  const r = rng(seed);
  const cw = w / cols;
  const ch = h / rows;
  const out: Pt[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = (i + 0.5) * cw + (r() - 0.5) * cw * 0.5;
      const y = (j + 0.5) * ch + (r() - 0.5) * ch * 0.5;
      out.push({ x, y, delay: Math.floor(r() * 48), wave: (x / w) * 74 + r() * 8, phase: Math.floor(r() * 150) });
    }
  }
  return out;
}

/**
 * The plane of dots of s01 («Sensores, no eslabones»): one dot per person of the workforce, in a dashed panel. From
 * `dotsAt` the dots appear grey and unconnected; from `sensorsAt` a wave of rings sweeps left to right and every dot
 * turns cyan, joined to its neighbours by thin lines — the biggest warning network, not a chain of weak links. With
 * `live` each dot keeps breathing a quiet ring. `hero` (index into the dots, or true for the one nearest the
 * centre-right) makes one dot the amber sender of a warning: a bell, rings and a bright line to its neighbours.
 * Pass `dotsAt` and `sensorsAt` far in the past for a finished, static picture (end card, poster).
 */
export function SensorField({
  width,
  height,
  cols,
  rows,
  seed = 7,
  frame,
  dotsAt,
  sensorsAt,
  live = true,
  hero = false,
  heroAt = -1000,
  dot = 8,
  panel = true,
}: {
  width: number;
  height: number;
  cols: number;
  rows: number;
  seed?: number;
  frame: number;
  dotsAt: number;
  sensorsAt: number;
  live?: boolean;
  hero?: boolean;
  heroAt?: number;
  dot?: number;
  panel?: boolean;
}) {
  const pts = sensorPoints(width, height, cols, rows, seed);
  const heroIndex = hero
    ? pts.reduce((best, p, i) => (Math.hypot(p.x - width * 0.6, p.y - height * 0.46) < Math.hypot(pts[best].x - width * 0.6, pts[best].y - height * 0.46) ? i : best), 0)
    : -1;
  const appear = pts.map((p) => progress(frame, dotsAt + p.delay, 12, EASE.out));
  const lit = pts.map((p) => progress(frame, sensorsAt + p.wave, 10, EASE.out));
  const idx = (r: number, c: number) => r * cols + c;
  const links: { a: number; b: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) links.push({ a: idx(r, c), b: idx(r, c + 1) });
      if (r + 1 < rows) links.push({ a: idx(r, c), b: idx(r + 1, c) });
      if (r + 1 < rows && c + 1 < cols && (r + c) % 2 === 0) links.push({ a: idx(r, c), b: idx(r + 1, c + 1) });
    }
  }
  const pad = 14;
  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {panel ? <rect x={-pad} y={-pad} width={width + 2 * pad} height={height + 2 * pad} rx={26} fill={alpha(C.ink900, 0.7)} stroke={alpha(C.ink500, 0.6)} strokeWidth={2} strokeDasharray="12 10" /> : null}
        {links.map(({ a, b }, k) => {
          const o = Math.min(lit[a], lit[b], appear[a], appear[b]);
          if (o <= 0.01) return null;
          const hot = a === heroIndex || b === heroIndex;
          const hp = hot ? progress(frame, heroAt, 16) : 0;
          return <line key={k} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} stroke={hot && hp > 0.01 ? C.amber : C.cyan} strokeOpacity={hot && hp > 0.01 ? 0.3 + 0.6 * hp : 0.28 * o} strokeWidth={hot && hp > 0.01 ? 3 : 2} />;
        })}
        {pts.map((p, i) => {
          const ap = appear[i];
          if (ap <= 0.01) return null;
          const l = lit[i];
          const isHero = i === heroIndex;
          const hp = isHero ? progress(frame, heroAt, 14) : 0;
          const since = frame - (sensorsAt + p.wave);
          const ring = since >= 0 && since < 30 ? since / 30 : -1;
          const idle = live && since > 40 ? ((frame + p.phase) % 150) / 150 : -1;
          const ringP = ring >= 0 ? ring : idle >= 0 && idle < 0.22 ? idle / 0.22 : -1;
          const r0 = dot * (isHero ? 1 + 0.9 * hp : 1);
          const fill = isHero && hp > 0.02 ? C.amber : l > 0.02 ? C.cyan : C.ink600;
          const stroke = isHero && hp > 0.02 ? '#fcd34d' : l > 0.02 ? C.cyanSoft : C.ink500;
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) scale(${0.4 + 0.6 * ap})`} opacity={ap}>
              {l > 0.02 ? <circle r={r0 * 2.1} fill={alpha(isHero && hp > 0.02 ? C.amber : C.cyan, 0.12 * Math.max(l, hp))} /> : null}
              {ringP >= 0 ? <circle r={r0 + ringP * dot * 3.2} fill="none" stroke={isHero && hp > 0.02 ? C.amber : C.sky} strokeOpacity={(1 - ringP) * 0.8} strokeWidth={3 * (1 - ringP) + 1} /> : null}
              <circle r={r0} fill={fill} stroke={stroke} strokeWidth={2} />
            </g>
          );
        })}
      </svg>
      {hero && heroIndex >= 0 ? (
        <div style={{ position: 'absolute', left: pts[heroIndex].x - 22, top: pts[heroIndex].y - 66, opacity: progress(frame, heroAt + 6, 12), transform: `translateY(${(1 - progress(frame, heroAt + 6, 12)) * 10}px)` }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: C.ink900, border: `3px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 22px ${alpha(C.amber, 0.5)}` }}>
            <Icon name="bell" size={26} color={C.amber} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
