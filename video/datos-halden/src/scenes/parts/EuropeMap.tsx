import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * An abstract dot-matrix map of Europe (no country names, no borders, no provider). Each `x` is a dot of land. Used lit
 * in s06 and dim, as the still background, in s07.
 */
const LAND = [
  '..................xx.x..........',
  '.................xxxxxx.........',
  '................xxxxxxx...xxx...',
  '...............xxx.xxxx.xxxxxx..',
  '..............xxx..xxx.xxxxxxxx.',
  '......xx......xx...xx..xxxxxxxxx',
  '.....xxx.............xxxxxxxxxxx',
  '.....xxxx......xxxxxxxxxxxxxxxxx',
  '......xxx...xxxxxxxxxxxxxxxxxxxx',
  '.....xxx...xxxxxxxxxxxxxxxxxxxxx',
  '...........xxxxxxxxxxxxxxxxxxxxx',
  '..........xxxxxxxxxxxxxxxxxxxxxx',
  '..........xxxxxxxxxxxxxxxxxxxxxx',
  '.........xxxxxxxxxxxxxxxxxxxxxx.',
  '...xxxxxxxxxxxxxx.xxxxxxxxxxx...',
  '..xxxxxxxx...xxxx..xxxxxxx.xxx..',
  '..xxxxxxx.....xxx...xxxxx..xx...',
  '..xxxxxxx......xxx..xxxx........',
  '...xxxxx........xx...xx.........',
  '....xx...........x..............',
];
const CELL = 20;
export const MAP = { w: LAND[0].length * CELL, h: LAND.length * CELL } as const;

/** The three storage points (A west, B centre, C north-east), in map units. B is the one inside the EU region. */
export const MAP_POINTS = [
  { x: 170, y: 330 },
  { x: 350, y: 210 },
  { x: 550, y: 110 },
] as const;
/** The «región UE» the restriction ties the data to (around B). */
export const MAP_REGION = { x: 196, y: 128, w: 300, h: 196 } as const;

const B = MAP_POINTS[1];
const IN_FROM = { x: 236, y: 300 };
const OUT_FROM = { x: 720, y: 60 };

function Storage({ x, y, tone, o, glow }: { x: number; y: number; tone: string; o: number; glow: number }) {
  return (
    <g opacity={o}>
      {glow > 0.01 ? <circle cx={x} cy={y} r={30 + 8 * glow} fill={alpha(tone, 0.18 * glow)} /> : null}
      <ellipse cx={x} cy={y - 12} rx={16} ry={6} fill={C.ink850} stroke={tone} strokeWidth={3} />
      <path d={`M ${x - 16} ${y - 12} L ${x - 16} ${y + 12} A 16 6 0 0 0 ${x + 16} ${y + 12} L ${x + 16} ${y - 12}`} fill={C.ink850} stroke={tone} strokeWidth={3} />
      <path d={`M ${x - 16} ${y} A 16 6 0 0 0 ${x + 16} ${y}`} fill="none" stroke={tone} strokeWidth={2} opacity={0.7} />
    </g>
  );
}

/**
 * `dots` 0–1 brings the three storage points; `look` 0–1 draws the two logins (from inside and from outside) — what
 * geolocation sees; `law` 0–1 rings point B (the law of where it lives); `tie` 0–1 draws the emerald «región UE»,
 * keeps B, dims A and C, and blocks the outside login with a rose cross. `t` (a frame) drives the soft pulses.
 */
export function EuropeMap({
  width = MAP.w,
  dots = 1,
  look = 0,
  law = 0,
  tie = 0,
  t = 0,
  landTone = C.ink500,
}: {
  width?: number;
  dots?: number;
  look?: number;
  law?: number;
  tie?: number;
  t?: number;
  landTone?: string;
}) {
  const d = clamp01(dots);
  const lk = clamp01(look);
  const lw = clamp01(law);
  const ti = clamp01(tie);
  const pulse = 0.5 + 0.5 * Math.sin(t / 9);
  const lineLen = (a: { x: number; y: number }) => Math.hypot(B.x - a.x, B.y - a.y);
  const draw = (a: { x: number; y: number }) => {
    const L = lineLen(a);
    return { strokeDasharray: `${L * lk} ${L}` };
  };
  const outTone = ti > 0.5 ? C.rose : C.sky;
  const mid = { x: (OUT_FROM.x + B.x) / 2 + 30, y: (OUT_FROM.y + B.y) / 2 - 6 };
  return (
    <svg width={width} height={(width * MAP.h) / MAP.w} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ overflow: 'visible' }}>
      {LAND.map((row, r) =>
        [...row].map((ch, c) =>
          ch === 'x' ? <circle key={`${r}-${c}`} cx={c * CELL + CELL / 2} cy={r * CELL + CELL / 2} r={4.2} fill={landTone} /> : null,
        ),
      )}
      {/* the EU region of the restriction */}
      {ti > 0.01 ? (
        <rect
          x={MAP_REGION.x}
          y={MAP_REGION.y}
          width={MAP_REGION.w}
          height={MAP_REGION.h}
          rx={40}
          fill={alpha(C.emerald, 0.08 * ti)}
          stroke={C.emerald}
          strokeWidth={4}
          strokeDasharray="14 10"
          opacity={ti}
        />
      ) : null}
      {/* logins: one from inside, one from outside the map */}
      {lk > 0.01 ? (
        <g>
          <line x1={IN_FROM.x} y1={IN_FROM.y} x2={B.x} y2={B.y} stroke={ti > 0.5 ? C.emerald : C.sky} strokeWidth={4} strokeLinecap="round" style={draw(IN_FROM)} />
          <circle cx={IN_FROM.x} cy={IN_FROM.y} r={7} fill={ti > 0.5 ? C.emerald : C.sky} opacity={lk} />
          <line x1={OUT_FROM.x} y1={OUT_FROM.y} x2={B.x} y2={B.y} stroke={outTone} strokeWidth={4} strokeLinecap="round" strokeDasharray="10 8" opacity={lk * (1 - 0.4 * ti)} />
          <circle cx={OUT_FROM.x} cy={OUT_FROM.y} r={7} fill={outTone} opacity={lk} />
        </g>
      ) : null}
      {ti > 0.01 ? (
        <g opacity={ti} stroke={C.rose} strokeWidth={6} strokeLinecap="round">
          <line x1={mid.x - 16} y1={mid.y - 16} x2={mid.x + 16} y2={mid.y + 16} />
          <line x1={mid.x + 16} y1={mid.y - 16} x2={mid.x - 16} y2={mid.y + 16} />
        </g>
      ) : null}
      {/* the law of where it lives: rings around B */}
      {lw > 0.01 ? (
        <g opacity={lw * (1 - 0.6 * ti)}>
          <circle cx={B.x} cy={B.y} r={40 + 6 * pulse} fill="none" stroke={C.violet} strokeWidth={3} />
          <circle cx={B.x} cy={B.y} r={62 + 6 * pulse} fill="none" stroke={alpha(C.violet, 0.5)} strokeWidth={2} />
        </g>
      ) : null}
      {MAP_POINTS.map((p, i) => {
        const isB = i === 1;
        const o = d * (isB ? 1 : 1 - 0.7 * ti);
        const tone = isB && ti > 0.5 ? C.emerald : C.cyan;
        return <Storage key={i} x={p.x} y={p.y} tone={tone} o={o} glow={lk > 0.01 ? 0.4 + 0.6 * pulse * (1 - ti) + (isB ? ti : 0) : 0} />;
      })}
    </svg>
  );
}
