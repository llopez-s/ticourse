import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/**
 * THE gantry crane of «En marcha, a tiempo y con parche»: one drawing, in profile, used by every scene that shows it
 * (same proportions, same stroke, same position of the four marked parts). The boom points right, the machinery house
 * is at the back (left). No number, quay, ropes beyond the hoist, or network; a container hangs from the spreader
 * (a drawing, no weight, no movement). Four parts, each with a fixed spot and a fixed dot:
 *   controllers   the machinery house (cab)
 *   anticollision the trolley
 *   wind          the anemometer at the boom tip
 *   wireless      the battery-powered sensor on the spreader, with its battery glyph
 * A part «switches on» (cyan glow) through `lit`; parts never move. There is no text in the drawing: labels are the
 * scene's job, placed with `craneAnchor`.
 */

export type CranePart = 'controllers' | 'anticollision' | 'wind' | 'wireless';

/** Native size of the drawing and the anchor (the dot) of each part, in the same native units. */
export const CRANE = {
  w: 620,
  h: 384,
  parts: {
    controllers: { x: 166, y: 38 },
    anticollision: { x: 460, y: 118 },
    wind: { x: 592, y: 46 },
    wireless: { x: 444, y: 228 },
  },
} as const;

/** Parts in dot order (the order the dots pop in). */
export const CRANE_PARTS: readonly CranePart[] = ['controllers', 'anticollision', 'wind', 'wireless'] as const;

/** Spanish names of the parts, for the scenes' labels. */
export const PART_LABELS: Record<CranePart, string> = {
  controllers: 'los controladores',
  anticollision: 'el anticolisión',
  wind: 'el sensor de viento',
  wireless: 'el sensor sin cables',
};

/**
 * Where the crane sits whenever it shares the stage with text (s02, s04, s06): stage-local px, boom to the right,
 * the text column to the right of `CRANE_PLACE.left + CRANE_PLACE.width`. s01 glides to this spot after the title.
 */
export const CRANE_PLACE = { left: 0, top: 150, width: 640 } as const;

/** Height in px of a crane drawn `width` px wide. */
export function craneHeight(width: number): number {
  return (width * CRANE.h) / CRANE.w;
}

/**
 * Centre of a part (its dot), in px, relative to the crane's top-left corner when drawn `width` px wide. Add the
 * crane's own left/top to place a label or a connector in stage coordinates.
 */
export function craneAnchor(part: CranePart, width: number): { x: number; y: number } {
  const k = width / CRANE.w;
  return { x: CRANE.parts[part].x * k, y: CRANE.parts[part].y * k };
}

/** The same, in stage coordinates for a crane drawn at `place` (default `CRANE_PLACE`). */
export function craneAnchorAt(part: CranePart, place: { left: number; top: number; width: number } = CRANE_PLACE): { x: number; y: number } {
  const a = craneAnchor(part, place.width);
  return { x: place.left + a.x, y: place.top + a.y };
}

export interface CraneProps {
  /** Rendered width in px (the height follows `CRANE`'s ratio). */
  width: number;
  /** 0–1 cyan glow per part. Absent = off. */
  lit?: Partial<Record<CranePart, number>>;
  /** The four marked dots: true = all, a number 0–1 = revealed one by one in `CRANE_PARTS` order. */
  dots?: boolean | number;
  /** 0–1 fade of the whole drawing (1 = fully faded away). */
  dim?: number;
  /** Optional 0–1 reveal of the structure from left to right (the line drawing coming in). */
  draw?: number;
  /** Hide the container hanging from the spreader. */
  noContainer?: boolean;
  /** Unique suffix for the SVG filter ids when two cranes share one frame. */
  idSuffix?: string;
}

const INK = alpha(C.muted, 0.78);
const INK_SOFT = alpha(C.muted, 0.42);
const FILL = alpha(C.ink800, 0.9);

/** Truss chords: the girder is 42 px tall over the legs and tapers towards the boom tip. */
const topY = (x: number) => (x <= 330 ? 118 : mix(118, 138, (x - 330) / 290));
const botY = (x: number) => (x <= 330 ? 160 : mix(160, 150, (x - 330) / 290));

/** Zigzag diagonals between the chords from `x0` to `x1`. */
function truss(x0: number, x1: number, step: number) {
  const out: [number, number, number, number][] = [];
  let flip = false;
  for (let x = x0; x + step <= x1 + 0.01; x += step) {
    const a = x;
    const b = x + step;
    out.push(flip ? [a, botY(a), b, topY(b)] : [a, topY(a), b, botY(b)]);
    flip = !flip;
  }
  return out;
}

function stroke(l: number) {
  return l > 0.02 ? mix01(INK, C.cyan, l) : INK;
}

/** Colour mix between two hex strings (alpha ignored on the second). */
function mix01(a: string, b: string, t: number): string {
  const pa = parse(a);
  const pb = parse(b);
  const k = clamp01(t);
  const c = (i: number) => Math.round(pa[i] + (pb[i] - pa[i]) * k);
  const al = pa[3] + (pb[3] - pa[3]) * k;
  return `rgba(${c(0)}, ${c(1)}, ${c(2)}, ${al.toFixed(3)})`;
}

function parse(hex: string): [number, number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
}

export function Crane({ width, lit = {}, dots = false, dim = 0, draw = 1, noContainer = false, idSuffix = '' }: CraneProps) {
  const height = craneHeight(width);
  const L = {
    controllers: clamp01(lit.controllers ?? 0),
    anticollision: clamp01(lit.anticollision ?? 0),
    wind: clamp01(lit.wind ?? 0),
    wireless: clamp01(lit.wireless ?? 0),
  };
  const dotP = (i: number) => (typeof dots === 'number' ? clamp01(dots * 4 - i) : dots ? 1 : 0);
  const reveal = clamp01(draw);
  const glowId = (p: CranePart) => `crane-glow-${p}${idSuffix}`;
  const fillFor = (l: number) => (l > 0.02 ? mix01(FILL, alpha(C.cyan, 0.34), l) : FILL);
  const filterFor = (p: CranePart) => (L[p] > 0.02 ? `url(#${glowId(p)})` : undefined);

  const boomTruss = truss(330, 620, 36);
  const backTruss = truss(40, 330, 41.5);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${CRANE.w} ${CRANE.h}`}
      style={{
        display: 'block',
        overflow: 'visible',
        opacity: 1 - clamp01(dim),
        clipPath: reveal < 0.999 ? `inset(-40px ${(1 - reveal) * 100}% -40px -40px)` : undefined,
      }}
    >
      <defs>
        {CRANE_PARTS.map((p) => (
          <filter key={p} id={glowId(p)} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor={C.cyan} floodOpacity={0.15 + 0.7 * L[p]} />
          </filter>
        ))}
      </defs>

      {/* All the drawing is authored in a 640×436 frame; this shift trims the empty margins. */}
      <g transform="translate(-20 -52)" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* legs: two uprights, a sill beam and a K brace; each stands on a small bogie */}
        {[120, 330].map((x) => (
          <g key={x}>
            <line x1={x} y1={160} x2={x} y2={398} stroke={INK} strokeWidth={9} />
            <rect x={x - 22} y={400} width={44} height={11} rx={3} fill={FILL} stroke={INK} strokeWidth={4} />
            <circle cx={x - 12} cy={420} r={6.5} fill={FILL} stroke={INK} strokeWidth={4} />
            <circle cx={x + 12} cy={420} r={6.5} fill={FILL} stroke={INK} strokeWidth={4} />
          </g>
        ))}
        <rect x={120} y={380} width={210} height={14} fill={FILL} stroke={INK} strokeWidth={4} />
        <line x1={120} y1={380} x2={225} y2={268} stroke={INK_SOFT} strokeWidth={4} />
        <line x1={330} y1={380} x2={225} y2={268} stroke={INK_SOFT} strokeWidth={4} />
        <line x1={120} y1={268} x2={330} y2={268} stroke={INK_SOFT} strokeWidth={4} />

        {/* counterweight at the back of the girder */}
        <rect x={40} y={118} width={30} height={42} rx={4} fill={FILL} stroke={INK} strokeWidth={4} />

        {/* girder and boom: two chords and a zigzag lattice */}
        <path d={`M40 118 H330 L620 138`} stroke={INK} strokeWidth={6} />
        <path d={`M40 160 H330 L620 150`} stroke={INK} strokeWidth={6} />
        <line x1={620} y1={138} x2={620} y2={150} stroke={INK} strokeWidth={5} />
        {[...backTruss, ...boomTruss].map((d, i) => (
          <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} stroke={INK_SOFT} strokeWidth={3.5} />
        ))}

        {/* container and spreader (a drawing: no weight, no movement) */}
        <line x1={458} y1={184} x2={440} y2={290} stroke={INK} strokeWidth={3.5} />
        <line x1={502} y1={184} x2={520} y2={290} stroke={INK} strokeWidth={3.5} />
        <rect x={428} y={290} width={104} height={13} rx={3} fill={FILL} stroke={INK} strokeWidth={4} />
        {noContainer ? null : (
          <g>
            <rect x={432} y={306} width={96} height={66} rx={3} fill={alpha(C.sky, 0.1)} stroke={INK} strokeWidth={4} />
            {[446, 458, 470, 482, 494, 506, 518].map((x) => (
              <line key={x} x1={x} y1={314} x2={x} y2={364} stroke={alpha(C.sky, 0.32)} strokeWidth={3} />
            ))}
          </g>
        )}

        {/* controllers: the machinery house on the back of the girder */}
        <g filter={filterFor('controllers')}>
          <rect x={104} y={62} width={128} height={56} rx={6} fill={fillFor(L.controllers)} stroke={stroke(L.controllers)} strokeWidth={5} />
          <rect x={114} y={72} width={30} height={22} rx={3} fill={alpha(C.cyan, 0.1 + 0.4 * L.controllers)} stroke={stroke(L.controllers)} strokeWidth={3} />
          <line x1={196} y1={74} x2={222} y2={74} stroke={stroke(L.controllers)} strokeWidth={3.5} />
          <line x1={196} y1={84} x2={222} y2={84} stroke={stroke(L.controllers)} strokeWidth={3.5} />
          <line x1={196} y1={94} x2={222} y2={94} stroke={stroke(L.controllers)} strokeWidth={3.5} />
        </g>

        {/* anticollision: the trolley under the boom, with its two eyes */}
        <g filter={filterFor('anticollision')}>
          <rect x={448} y={154} width={64} height={30} rx={5} fill={fillFor(L.anticollision)} stroke={stroke(L.anticollision)} strokeWidth={5} />
          <circle cx={448} cy={178} r={5} fill={stroke(L.anticollision)} />
          <circle cx={512} cy={178} r={5} fill={stroke(L.anticollision)} />
          <path d="M432 168 A22 22 0 0 0 432 188" stroke={stroke(L.anticollision)} strokeWidth={3.5} />
          <path d="M528 168 A22 22 0 0 1 528 188" stroke={stroke(L.anticollision)} strokeWidth={3.5} />
        </g>

        {/* wind: the anemometer on a short mast at the boom tip */}
        <g filter={filterFor('wind')}>
          <line x1={612} y1={138} x2={612} y2={100} stroke={stroke(L.wind)} strokeWidth={5} />
          <line x1={590} y1={96} x2={634} y2={96} stroke={stroke(L.wind)} strokeWidth={4} />
          <circle cx={590} cy={96} r={7} fill={fillFor(L.wind)} stroke={stroke(L.wind)} strokeWidth={4} />
          <circle cx={634} cy={96} r={7} fill={fillFor(L.wind)} stroke={stroke(L.wind)} strokeWidth={4} />
          <path d="M612 96 L612 78 L626 84 Z" fill={fillFor(L.wind)} stroke={stroke(L.wind)} strokeWidth={3} />
        </g>

        {/* wireless: a battery-powered sensor on the spreader, with its battery glyph */}
        <g filter={filterFor('wireless')}>
          <rect x={446} y={268} width={36} height={22} rx={4} fill={fillFor(L.wireless)} stroke={stroke(L.wireless)} strokeWidth={4.5} />
          <path d="M455 262 A9 9 0 0 1 473 262" stroke={stroke(L.wireless)} strokeWidth={3.5} />
          <path d="M450 255 A16 16 0 0 1 478 255" stroke={stroke(L.wireless)} strokeWidth={3.5} />
          <rect x={490} y={274} width={26} height={14} rx={3} fill="none" stroke={stroke(L.wireless)} strokeWidth={4} />
          <rect x={516} y={278} width={4} height={6} fill={stroke(L.wireless)} stroke="none" />
          <rect x={494} y={278} width={13} height={6} rx={1} fill={alpha(C.cyan, 0.35 + 0.65 * L.wireless)} stroke="none" />
        </g>

        {/* the four marked dots (no text) */}
        {CRANE_PARTS.map((p, i) => {
          const d = dotP(i);
          if (d <= 0.001) return null;
          const a = CRANE.parts[p];
          const ax = a.x + 20;
          const ay = a.y + 52;
          return (
            <g key={p} opacity={d}>
              <circle cx={ax} cy={ay} r={13 + 10 * (1 - d)} fill={alpha(C.cyan, 0.16)} stroke={alpha(C.cyan, 0.7)} strokeWidth={3} />
              <circle cx={ax} cy={ay} r={7} fill={C.cyan} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
