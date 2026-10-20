import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** Natural size of the mould image (its own units); scale with `width`. */
export const MOULD = { w: 460, h: 220 } as const;

const NOTCH_HALF = (14 * Math.PI) / 180;

/** A fluted round outline with a V notch at the top (`depth` as a fraction of R; 0 = no notch). */
function fluted(cx: number, cy: number, R: number, depth: number): string {
  const pts: string[] = [];
  const n = 240;
  for (let i = 0; i <= n; i++) {
    const th = -Math.PI / 2 + (i / n) * Math.PI * 2;
    let r = R * (1 + 0.055 * Math.cos(12 * (th + Math.PI / 2)));
    const d = Math.abs(Math.atan2(Math.sin(th + Math.PI / 2), Math.cos(th + Math.PI / 2)));
    if (depth > 0 && d < NOTCH_HALF) r -= R * depth * (1 - d / NOTCH_HALF);
    pts.push(`${(cx + r * Math.cos(th)).toFixed(1)} ${(cy + r * Math.sin(th)).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

const CUTTER = { cx: 92, cy: 112, R: 72 } as const;
const COOKIES = [
  { cx: 238, cy: 128, R: 46 },
  { cx: 334, cy: 128, R: 46 },
  { cx: 418, cy: 128, R: 40 },
] as const;
const COOKIE = '#c98f4a';
const METAL = '#cbd5e1';

/**
 * The cookie mould with a notch (concept 1, «imagen · no es del puerto»): a round fluted metal cutter whose rim has a
 * V notch (rose), and on a tray three cookies, each with the same notch. `sand` 0–1 puts a sanding block on the first
 * cookie (lijar las galletas: it does not save the next batch); `fixed` 0–1 fills the mould's notch in emerald and
 * shows the next cookie whole. No recipe, no ingredients, no oven.
 */
export function Mould({ width = MOULD.w, sand = 0, fixed = 0, glow = 0 }: { width?: number; sand?: number; fixed?: number; glow?: number }) {
  const h = (width * MOULD.h) / MOULD.w;
  const f = clamp01(fixed);
  const s = clamp01(sand);
  const { cx, cy, R } = CUTTER;
  const notchTip = cy - R + R * 0.28;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${MOULD.w} ${MOULD.h}`} style={{ overflow: 'visible' }}>
      {/* the tray */}
      <rect x={180} y={64} width={286} height={128} rx={16} fill="#1b2433" stroke={alpha(METAL, 0.35)} strokeWidth={3} />
      {/* the cookies, each with the notch */}
      {COOKIES.map((k, i) => {
        const whole = i === 2 ? f : 0;
        return (
          <g key={i} opacity={i === 2 ? 0.35 + 0.65 * f : 1}>
            <path d={fluted(k.cx, k.cy, k.R, 0.3 * (1 - whole))} fill={COOKIE} stroke="#8a5a26" strokeWidth={3} />
            {[[-14, -6], [10, 4], [-4, 16], [14, -16]].map(([dx, dy], j) => (
              <circle key={j} cx={k.cx + dx * (k.R / 46)} cy={k.cy + dy * (k.R / 46)} r={3.2} fill="#8a5a26" />
            ))}
            {i === 2 && f > 0.02 ? <path d={fluted(k.cx, k.cy, k.R + 7, 0)} fill="none" stroke={alpha(C.emerald, 0.85 * f)} strokeWidth={4} /> : null}
          </g>
        );
      })}
      {/* the sanding block on the first cookie */}
      {s > 0.01 ? (
        <g opacity={s} transform={`rotate(-14 ${COOKIES[0].cx} ${COOKIES[0].cy - 30})`}>
          <rect x={COOKIES[0].cx - 34} y={COOKIES[0].cy - 58} width={68} height={30} rx={6} fill="#a8a29e" stroke="#57534e" strokeWidth={3} />
          <rect x={COOKIES[0].cx - 34} y={COOKIES[0].cy - 32} width={68} height={8} rx={3} fill="#d6c29a" />
        </g>
      ) : null}
      {/* the cutter: a fluted metal ring, its notch rose until fixed */}
      {glow > 0.01 ? <circle cx={cx} cy={cy} r={R + 22} fill={alpha(C.cyan, 0.1 * glow)} /> : null}
      <path d={fluted(cx, cy, R, 0.28)} fill="none" stroke={METAL} strokeWidth={9} strokeLinejoin="round" />
      <path d={fluted(cx, cy, R - 12, 0.32)} fill="none" stroke={alpha(METAL, 0.35)} strokeWidth={3} />
      <path
        d={`M ${cx - R * Math.sin(NOTCH_HALF) - 2} ${cy - R * Math.cos(NOTCH_HALF) - 4} L ${cx} ${notchTip} L ${cx + R * Math.sin(NOTCH_HALF) + 2} ${cy - R * Math.cos(NOTCH_HALF) - 4}`}
        fill="none"
        stroke={alpha(C.rose, 1 - f)}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {f > 0.01 ? (
        <path
          d={`M ${cx - R * Math.sin(NOTCH_HALF) - 2} ${cy - R * Math.cos(NOTCH_HALF) - 4} Q ${cx} ${cy - R - 8} ${cx + R * Math.sin(NOTCH_HALF) + 2} ${cy - R * Math.cos(NOTCH_HALF) - 4}`}
          fill="none"
          stroke={alpha(C.emerald, f)}
          strokeWidth={10}
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}
