import { useId, type CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * «El teatro de reserva» (canon: out/scene-brief.md «Shared parts»). A small
 * toy-theatre front — marquee, a facade with an arched stage opening, curtains,
 * a stage floor and, for hot/warm, a side dressing room (camerino) on the right.
 * What a service WOULD need, never a site the port has.
 *
 *   kind='hot'  → the set is built on stage (a little house + a tree, lit) and
 *                 the marquee reads «en cartel» with its bulbs on.
 *   kind='warm' → empty stage, lights ready (a light cone), marquee dark; the set
 *                 is packed in crates in the open dressing room, tag «sin montar».
 *   kind='cold' → an empty hall: no marquee, no curtains, no dressing room, one
 *                 bulb hanging on a cord and a wall socket. Nothing else.
 *
 * Props (all optional except `kind`):
 *   - `kind`      'hot' | 'warm' | 'cold'
 *   - `width`     px (default 500). Height: `theatreSize(width, texts)`.
 *                 ≥ 300 px = full detail (marquee text and «sin montar» legible
 *                 from ~480 px); < 300 px = icon detail (no text inside the art,
 *                 thicker strokes) — e.g. s06's ~180 px rule-card icon.
 *   - `audience`  'full' | 'empty' | 'none' (default 'none'): two rows of heads
 *                 seen from behind (full), empty seat backs (empty), or nothing.
 *   - `seated`    0–1, optional: overrides how many seats are occupied (seats
 *                 fill in a fixed scattered order). Animate it for s04's `swap`:
 *                 theatre A `seated` 1→0 while theatre B goes 0→1 (both with
 *                 `audience` 'full' or 'empty' so the seat row is drawn).
 *   - `flood`     0–1: rose water rising over the whole art (s02 `dispersion`).
 *   - `glow`      0–1: halo in `tone` around the art.
 *   - `lit`       0–1 (default 1): interior light (stage cone, set windows,
 *                 marquee bulbs, the cold bulb). 0 = the hall is dark.
 *   - `tone`      accent of the light and curtains (default 'sky' = sites).
 *   - `label`     line 1 under the art, exam term in violet («HOT SITE»).
 *   - `sub`       line 2, Spanish note, up to two lines («todo encendido · datos al día»).
 *   - `meta`      line 3, bold («minutos»). `metaTone` colours it (default text).
 *   - `labelTone` overrides the label colour (default violet).
 *   - `frame`     optional; defaults to useCurrentFrame() (marquee bulb chase,
 *                 bulb sway and the flood's waves; all ≤ 1 Hz).
 *   - `style`     extra style on the root div (do not pass `transform` if you
 *                 also wrap it in the engine's Focus).
 * The text band is LEFT-aligned with the facade (the dressing room makes the
 * art asymmetric). Nothing is positioned and nothing reads the timeline.
 *
 * Used in: s02 (three in a row ~520 px wide; then two side by side, flooded),
 * s03 (two theatres giving the same show, one `audience='full'`, one 'empty'),
 * s04 (the audience walks into the other theatre on `swap`, via `seated`),
 * s06 (rule-card icon, ~180 px, no texts) and the poster.
 */

export type TheatreKind = 'hot' | 'warm' | 'cold';
export type TheatreAudience = 'full' | 'empty' | 'none';

export interface TheatreProps {
  kind: TheatreKind;
  width?: number;
  audience?: TheatreAudience;
  seated?: number;
  flood?: number;
  glow?: number;
  lit?: number;
  tone?: Tone;
  label?: string;
  sub?: string;
  meta?: string;
  labelTone?: Tone;
  metaTone?: Tone;
  frame?: number;
  style?: CSSProperties;
}

// ---------------------------------------------------------------------------
// Geometry (design units)

/** Art box in design units: hall 0–380, dressing room 380–500. */
const VB = { w: 500, h: 336 } as const;
const HALL = { x0: 8, x1: 372, cx: 190, top: 52, bottom: 336 } as const;
const OPEN = { x0: 40, x1: 340, top: 84, spring: 146, bottom: 300 } as const;
const FLOOR_BACK = 248;
const ANNEX = { x0: 368, x1: 494, top: 150 } as const;
const DOOR = { x0: 392, x1: 474, top: 222 } as const;

/** Band under the art. */
const BAND = { gap: 14, labelLH: 1.12, subSize: 32, subLH: 1.2, metaSize: 34, metaLH: 1.2 } as const;

function labelSizeFor(width: number): number {
  return Math.round(Math.max(32, Math.min(56, width * 0.088)));
}

/**
 * px box of a Theatre `width` px wide. Pass which text lines you will give it
 * so the band is counted: `sub` always reserves two lines.
 */
export function theatreSize(
  width: number,
  texts: { label?: boolean; sub?: boolean; meta?: boolean } = {},
): { w: number; h: number; artH: number; scale: number; hallLeft: number; hallWidth: number; hallCenterX: number } {
  const scale = width / VB.w;
  const artH = VB.h * scale;
  let band = 0;
  if (texts.label) band += labelSizeFor(width) * BAND.labelLH;
  if (texts.sub) band += BAND.subSize * BAND.subLH * 2 + 4;
  if (texts.meta) band += BAND.metaSize * BAND.metaLH + 4;
  return {
    w: width,
    h: artH + (band > 0 ? BAND.gap + band : 0),
    artH,
    scale,
    hallLeft: HALL.x0 * scale,
    hallWidth: (HALL.x1 - HALL.x0) * scale,
    hallCenterX: HALL.cx * scale,
  };
}

/** Anchor (px from the Theatre's top-left) of a point of the art. */
export function theatrePoint(width: number, which: 'stage' | 'door' | 'marquee' | 'seats' | 'roof'): { x: number; y: number } {
  const s = width / VB.w;
  const P = {
    stage: { x: HALL.cx, y: 230 },
    door: { x: (DOOR.x0 + DOOR.x1) / 2, y: 280 },
    marquee: { x: HALL.cx, y: 26 },
    seats: { x: HALL.cx, y: 310 },
    roof: { x: HALL.cx, y: 0 },
  } as const;
  return { x: P[which].x * s, y: P[which].y * s };
}

function svgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

/** Deterministic 0–1 hash. */
function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const ARCH_PATH = `M${OPEN.x0},${OPEN.bottom} V${OPEN.spring} A${(OPEN.x1 - OPEN.x0) / 2},${OPEN.spring - OPEN.top} 0 0 1 ${OPEN.x1},${OPEN.spring} V${OPEN.bottom} Z`;

/** Seats: back row 9, front row 8 (icon: 6 + 5). */
function seatLayout(icon: boolean) {
  const rows = icon
    ? [
        { y: 300, n: 6, x0: 62, x1: 318, r: 17 },
        { y: 328, n: 5, x0: 84, x1: 296, r: 19 },
      ]
    : [
        { y: 298, n: 8, x0: 62, x1: 318, r: 11.5 },
        { y: 324, n: 7, x0: 80, x1: 300, r: 13 },
      ];
  const seats: { x: number; y: number; r: number; order: number }[] = [];
  let k = 0;
  for (const row of rows) {
    for (let i = 0; i < row.n; i++) {
      const x = row.x0 + ((row.x1 - row.x0) * i) / (row.n - 1);
      seats.push({ x, y: row.y, r: row.r, order: hash(k + 3) });
      k++;
    }
  }
  // fill order: scattered but fixed
  const ranked = [...seats].sort((a, b) => a.order - b.order);
  return seats.map((s) => ({ ...s, rank: ranked.indexOf(s) / Math.max(1, seats.length - 1) }));
}

const BULB = '#fef3c7';

export function Theatre({
  kind,
  width = 500,
  audience = 'none',
  seated,
  flood = 0,
  glow = 0,
  lit = 1,
  tone = 'sky',
  label,
  sub,
  meta,
  labelTone = 'violet',
  metaTone,
  frame,
  style,
}: TheatreProps) {
  const current = useCurrentFrame();
  const f = frame ?? current;
  const t = toneOf(tone);
  const icon = width < 300;
  /** stroke widths stay visible when the art is small */
  const k = Math.max(1, 300 / width);
  const L = clamp01(lit);
  const G = clamp01(glow);
  const W = clamp01(flood);

  const idBack = svgId('th-back');
  const idCone = svgId('th-cone');
  const idClip = svgId('th-clip');
  const idWater = svgId('th-water');
  const idBulb = svgId('th-bulb');
  const idCurtain = svgId('th-curtain');
  const idFloodClip = svgId('th-floodclip');

  const hasMarquee = kind !== 'cold';
  const hasCurtains = kind !== 'cold';
  const hasAnnex = kind !== 'cold';
  const curtain = t.deep;
  const curtainHi = t.fg;

  // marquee bulbs: a slow chase (one step per ~1.2 s)
  const marqueeBulbs: { x: number; y: number }[] = [];
  const MQ = { x0: 56, x1: 324, y0: 6, y1: 50 };
  const stepX = icon ? 38 : 22;
  for (let x = MQ.x0 + 10; x <= MQ.x1 - 10; x += stepX) {
    marqueeBulbs.push({ x, y: MQ.y0 + 1 });
    marqueeBulbs.push({ x, y: MQ.y1 - 1 });
  }
  const chase = Math.floor(f / 36) % 3;
  const marqueeOn = kind === 'hot' ? L : 0;

  // the cold bulb sways gently (0.25 Hz)
  const sway = Math.sin((2 * Math.PI * 0.25 * f) / 30) * 2.2;

  // flood waves
  const waterTop = VB.h - W * VB.h * 0.94;
  const wavePath = (() => {
    if (W <= 0.001) return '';
    const amp = 6;
    const len = 90;
    const phase = ((f / 30) * 0.5 * len) % len; // 0.5 Hz drift
    let d = `M${-len},${VB.h} L${-len},${waterTop}`;
    for (let x = -len; x <= VB.w + len; x += len / 2) {
      const up = Math.round((x + len) / (len / 2)) % 2 === 0;
      d += ` Q${x + len / 4 + phase},${waterTop + (up ? -amp : amp)} ${x + len / 2 + phase},${waterTop}`;
    }
    d += ` L${VB.w + len * 2},${VB.h} Z`;
    return d;
  })();

  const seats = audience === 'none' ? [] : seatLayout(icon);
  const fill = seated !== undefined ? clamp01(seated) : audience === 'full' ? 1 : 0;

  const label1 = labelSizeFor(width);
  const lt = toneOf(labelTone);
  const mt = metaTone ? toneOf(metaTone).soft : C.textStrong;
  const size = theatreSize(width, { label: !!label, sub: !!sub, meta: !!meta });

  const filter = G > 0.01 ? `drop-shadow(0 0 ${Math.round(6 + 22 * G)}px ${alpha(t.fg, 0.55 * G)})` : undefined;

  return (
    <div style={{ position: 'relative', width, height: size.h, ...style }}>
      <svg
        width={width}
        height={size.artH}
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible', filter }}
      >
        <defs>
          <linearGradient id={idBack} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.ink950} />
            <stop offset="100%" stopColor={C.ink850} />
          </linearGradient>
          <linearGradient id={idCone} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={kind === 'cold' ? BULB : t.soft} stopOpacity={0.34 * L} />
            <stop offset="100%" stopColor={kind === 'cold' ? BULB : t.soft} stopOpacity={0.02 * L} />
          </linearGradient>
          <radialGradient id={idBulb}>
            <stop offset="0%" stopColor={BULB} stopOpacity={0.55 * L} />
            <stop offset="100%" stopColor={BULB} stopOpacity={0} />
          </radialGradient>
          <linearGradient id={idCurtain} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={curtain} />
            <stop offset="50%" stopColor={alpha(curtainHi, 0.55)} />
            <stop offset="100%" stopColor={curtain} />
          </linearGradient>
          <linearGradient id={idWater} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.rose} stopOpacity={0.5} />
            <stop offset="100%" stopColor={C.roseDeep} stopOpacity={0.92} />
          </linearGradient>
          <clipPath id={idFloodClip}>
            <rect x={0} y={-20} width={VB.w} height={VB.h + 20} />
          </clipPath>
          <clipPath id={idClip}>
            <path d={ARCH_PATH} />
          </clipPath>
        </defs>

        {/* ---- dressing room (behind the hall) ---- */}
        {hasAnnex && (
          <g>
            <path
              d={`M${ANNEX.x0},${VB.h} V${ANNEX.top + 18} L${ANNEX.x0 + 24},${ANNEX.top} H${ANNEX.x1} V${VB.h} Z`}
              fill={C.ink850}
              stroke={C.ink600}
              strokeWidth={3 * k}
              strokeLinejoin="round"
            />
            {/* door opening */}
            <rect x={DOOR.x0} y={DOOR.top} width={DOOR.x1 - DOOR.x0} height={VB.h - DOOR.top} rx={4} fill={kind === 'warm' ? C.ink900 : C.ink700} stroke={C.ink500} strokeWidth={2.5 * k} />
            {kind === 'hot' && (
              // closed door, nothing stored: the set is on stage
              <>
                <line x1={DOOR.x0 + 10} y1={DOOR.top + 14} x2={DOOR.x1 - 10} y2={DOOR.top + 14} stroke={C.ink500} strokeWidth={2 * k} />
                <circle cx={DOOR.x1 - 14} cy={286} r={4.5} fill={C.muted} />
              </>
            )}
            {kind === 'warm' && (
              <g>
                {/* dim light inside */}
                <rect x={DOOR.x0 + 3} y={DOOR.top + 3} width={DOOR.x1 - DOOR.x0 - 6} height={VB.h - DOOR.top - 3} fill={alpha(t.soft, 0.1 * L)} />
                {/* three crates */}
                {[
                  { x: DOOR.x0 + 6, y: 290, w: 40, h: 44 },
                  { x: DOOR.x0 + 44, y: 296, w: 34, h: 38 },
                  { x: DOOR.x0 + 14, y: 250, w: 36, h: 40 },
                ].map((c, i) => (
                  <g key={i}>
                    <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={2} fill="#8a6a43" stroke="#5b4428" strokeWidth={2 * k} />
                    <line x1={c.x} y1={c.y} x2={c.x + c.w} y2={c.y + c.h} stroke="#5b4428" strokeWidth={2 * k} />
                    <line x1={c.x + c.w} y1={c.y} x2={c.x} y2={c.y + c.h} stroke="#5b4428" strokeWidth={2 * k} />
                    {/* stencil label plate */}
                    <rect x={c.x + c.w * 0.22} y={c.y + c.h * 0.36} width={c.w * 0.56} height={c.h * 0.28} fill="#e9dcc3" />
                  </g>
                ))}
                {/* hanging tag «sin montar» (full detail only) */}
                {!icon && (
                  <g transform={`rotate(-4 ${(ANNEX.x0 + ANNEX.x1) / 2 + 6} ${ANNEX.top + 30})`}>
                    <line x1={(ANNEX.x0 + ANNEX.x1) / 2 + 6} y1={ANNEX.top + 6} x2={(ANNEX.x0 + ANNEX.x1) / 2 + 6} y2={ANNEX.top + 16} stroke={C.muted} strokeWidth={2} />
                    <rect x={ANNEX.x0 + 8} y={ANNEX.top + 14} width={ANNEX.x1 - ANNEX.x0 - 4} height={58} rx={6} fill="#f4eee2" stroke="#2c3a52" strokeWidth={2} />
                    <text x={(ANNEX.x0 + ANNEX.x1) / 2 + 6} y={ANNEX.top + 39} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={24} fill="#2c3a52">
                      sin
                    </text>
                    <text x={(ANNEX.x0 + ANNEX.x1) / 2 + 6} y={ANNEX.top + 64} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={24} fill="#2c3a52">
                      montar
                    </text>
                  </g>
                )}
              </g>
            )}
          </g>
        )}

        {/* ---- hall facade ---- */}
        <rect
          x={HALL.x0}
          y={HALL.top}
          width={HALL.x1 - HALL.x0}
          height={HALL.bottom - HALL.top}
          rx={10}
          fill={C.ink800}
          stroke={kind === 'cold' ? C.ink600 : alpha(t.fg, 0.55)}
          strokeWidth={3.5 * k}
        />
        {/* cornice */}
        <rect x={HALL.x0 - 6} y={HALL.top - 2} width={HALL.x1 - HALL.x0 + 12} height={12} rx={4} fill={C.ink700} stroke={C.ink600} strokeWidth={2 * k} />

        {/* ---- inside the arch ---- */}
        <path d={ARCH_PATH} fill={`url(#${idBack})`} />
        <g clipPath={`url(#${idClip})`}>
          {/* stage floor */}
          <path
            d={`M${OPEN.x0},${OPEN.bottom} L${OPEN.x1},${OPEN.bottom} L${OPEN.x1 - 30},${FLOOR_BACK} L${OPEN.x0 + 30},${FLOOR_BACK} Z`}
            fill={kind === 'cold' ? C.ink850 : C.ink700}
          />
          {!icon &&
            [0.33, 0.66].map((p) => (
              <line
                key={p}
                x1={OPEN.x0 + 30 - 30 * p}
                y1={FLOOR_BACK + (OPEN.bottom - FLOOR_BACK) * p}
                x2={OPEN.x1 - 30 + 30 * p}
                y2={FLOOR_BACK + (OPEN.bottom - FLOOR_BACK) * p}
                stroke={alpha(C.ink500, 0.6)}
                strokeWidth={1.5 * k}
              />
            ))}

          {/* light: a cone on hot/warm, the bulb's halo on cold */}
          {kind !== 'cold' && L > 0.01 && (
            <path d={`M${HALL.cx - 26},${OPEN.top} L${HALL.cx + 26},${OPEN.top} L${HALL.cx + 120},${OPEN.bottom} L${HALL.cx - 120},${OPEN.bottom} Z`} fill={`url(#${idCone})`} />
          )}
          {kind !== 'cold' && L > 0.01 && <ellipse cx={HALL.cx} cy={276} rx={112} ry={16} fill={alpha(t.soft, 0.16 * L)} />}

          {kind === 'cold' && (
            <g>
              <circle cx={HALL.cx + sway} cy={158} r={110} fill={`url(#${idBulb})`} />
              {/* wall socket: power and network, nothing else */}
              {!icon && (
                <g>
                  <rect x={292} y={214} width={30} height={22} rx={4} fill={C.ink700} stroke={C.ink500} strokeWidth={2} />
                  <circle cx={302} cy={225} r={2.6} fill={C.ink950} />
                  <circle cx={312} cy={225} r={2.6} fill={C.ink950} />
                </g>
              )}
            </g>
          )}

          {/* the set (hot): a little house and a tree, lit */}
          {kind === 'hot' && (
            <g>
              <rect x={128} y={176} width={88} height={74} fill={alpha(t.deep, 0.95)} stroke={t.fg} strokeWidth={2.5 * k} />
              <path d={`M120,178 L172,138 L224,178 Z`} fill={alpha(t.deep, 0.95)} stroke={t.fg} strokeWidth={2.5 * k} strokeLinejoin="round" />
              <rect x={144} y={194} width={22} height={20} fill={alpha(BULB, 0.25 + 0.65 * L)} />
              <rect x={180} y={194} width={22} height={20} fill={alpha(BULB, 0.25 + 0.65 * L)} />
              <rect x={162} y={222} width={20} height={28} fill={C.ink900} />
              <rect x={252} y={206} width={9} height={44} fill="#5b4428" />
              <circle cx={256} cy={192} r={26} fill={alpha(C.emeraldDeep, 0.95)} stroke={alpha(C.emerald, 0.8)} strokeWidth={2.5 * k} />
              <circle cx={98} cy={128} r={13} fill={alpha(BULB, 0.3 + 0.5 * L)} />
            </g>
          )}

          {/* curtains + valance */}
          {hasCurtains && (
            <g>
              <path d={`M${OPEN.x0 - 2},${OPEN.top} L${OPEN.x0 + 52},${OPEN.top} Q${OPEN.x0 + 40},200 ${OPEN.x0 + 24},${OPEN.bottom} L${OPEN.x0 - 2},${OPEN.bottom} Z`} fill={`url(#${idCurtain})`} />
              <path d={`M${OPEN.x1 + 2},${OPEN.top} L${OPEN.x1 - 52},${OPEN.top} Q${OPEN.x1 - 40},200 ${OPEN.x1 - 24},${OPEN.bottom} L${OPEN.x1 + 2},${OPEN.bottom} Z`} fill={`url(#${idCurtain})`} />
              {!icon &&
                [14, 30].map((dx) => (
                  <g key={dx}>
                    <path d={`M${OPEN.x0 + dx},${OPEN.top + 10} Q${OPEN.x0 + dx - 4},200 ${OPEN.x0 + dx * 0.5},${OPEN.bottom}`} stroke={alpha(C.ink950, 0.45)} strokeWidth={2} fill="none" />
                    <path d={`M${OPEN.x1 - dx},${OPEN.top + 10} Q${OPEN.x1 - dx + 4},200 ${OPEN.x1 - dx * 0.5},${OPEN.bottom}`} stroke={alpha(C.ink950, 0.45)} strokeWidth={2} fill="none" />
                  </g>
                ))}
              {/* valance: scallops under the arch */}
              <path
                d={(() => {
                  const n = 7;
                  const x0 = OPEN.x0;
                  const x1 = OPEN.x1;
                  const y = 112;
                  let d = `M${x0},${OPEN.top - 10} L${x0},${y}`;
                  const w = (x1 - x0) / n;
                  for (let i = 0; i < n; i++) d += ` Q${x0 + w * (i + 0.5)},${y + 22} ${x0 + w * (i + 1)},${y}`;
                  d += ` L${x1},${OPEN.top - 10} Z`;
                  return d;
                })()}
                fill={curtain}
                stroke={alpha(curtainHi, 0.5)}
                strokeWidth={2 * k}
              />
            </g>
          )}

          {/* the cold bulb on its cord (drawn over the halo) */}
          {kind === 'cold' && (
            <g transform={`rotate(${sway} ${HALL.cx} ${OPEN.top})`}>
              <line x1={HALL.cx} y1={OPEN.top - 4} x2={HALL.cx} y2={146} stroke={C.muted} strokeWidth={2.5 * k} />
              <rect x={HALL.cx - 6} y={140} width={12} height={9} fill={C.muted} />
              <circle cx={HALL.cx} cy={158} r={11} fill={alpha(BULB, 0.25 + 0.75 * L)} stroke={alpha(BULB, 0.9)} strokeWidth={1.5 * k} />
            </g>
          )}

          {/* lights off: dark wash */}
          {L < 0.999 && <path d={ARCH_PATH} fill={alpha(C.ink950, 0.62 * (1 - L))} />}
        </g>
        {/* apron edge */}
        <rect x={OPEN.x0 - 10} y={OPEN.bottom} width={OPEN.x1 - OPEN.x0 + 20} height={10} rx={3} fill={C.ink600} />
        {/* arch outline */}
        <path d={ARCH_PATH} fill="none" stroke={kind === 'cold' ? C.ink500 : alpha(t.soft, 0.7)} strokeWidth={3 * k} />

        {/* ---- marquee ---- */}
        {hasMarquee && (
          <g>
            <rect x={MQ.x0} y={MQ.y0} width={MQ.x1 - MQ.x0} height={MQ.y1 - MQ.y0} rx={10} fill={C.ink900} stroke={kind === 'hot' ? alpha(BULB, 0.4 + 0.5 * marqueeOn) : C.ink600} strokeWidth={3 * k} />
            {marqueeBulbs.map((b, i) => {
              const on = marqueeOn * ((i >> 1) % 3 === chase ? 1 : 0.55);
              return <circle key={i} cx={b.x} cy={b.y} r={icon ? 6 : 4} fill={on > 0.01 ? alpha(BULB, 0.25 + 0.75 * on) : C.ink600} />;
            })}
            {kind === 'hot' && !icon && (
              <text x={HALL.cx} y={(MQ.y0 + MQ.y1) / 2 + 10} textAnchor="middle" fontFamily={FONT.sans} fontWeight={850} fontSize={29} letterSpacing={1} fill={alpha(BULB, 0.55 + 0.45 * marqueeOn)}>
                en cartel
              </text>
            )}
            {kind === 'hot' && icon && <rect x={HALL.cx - 70} y={22} width={140} height={10} rx={5} fill={alpha(BULB, 0.4 + 0.5 * marqueeOn)} />}
            {/* posts */}
            <rect x={MQ.x0 + 30} y={MQ.y1} width={6} height={HALL.top - MQ.y1} fill={C.ink600} />
            <rect x={MQ.x1 - 36} y={MQ.y1} width={6} height={HALL.top - MQ.y1} fill={C.ink600} />
          </g>
        )}

        {/* ---- audience ---- */}
        {seats.map((st, i) => {
          const pop = fill >= 0.9999 || st.rank < fill ? 1 : 0;
          return (
            <g key={i}>
              {/* seat back */}
              <rect x={st.x - st.r * 1.25} y={st.y + st.r * 0.15} width={st.r * 2.5} height={st.r * 1.6} rx={st.r * 0.6} fill={C.ink600} stroke={C.ink500} strokeWidth={1.5 * k} />
              {pop > 0 && (
                <g>
                  <ellipse cx={st.x} cy={st.y + st.r * 1.25} rx={st.r * 1.15} ry={st.r * 0.8} fill="#04070d" stroke={alpha(t.soft, 0.55)} strokeWidth={1.6 * k} />
                  <circle cx={st.x} cy={st.y - st.r * 0.05} r={st.r} fill="#04070d" stroke={alpha(t.soft, 0.65)} strokeWidth={1.6 * k} />
                </g>
              )}
            </g>
          );
        })}

        {/* ---- flood ---- */}
        {W > 0.001 && (
          <g clipPath={`url(#${idFloodClip})`}>
            <path d={wavePath} fill={`url(#${idWater})`} />
            <path d={wavePath} fill="none" stroke={alpha(C.roseSoft, 0.85)} strokeWidth={3 * k} />
          </g>
        )}
      </svg>

      {/* ---- text band (left-aligned with the facade) ---- */}
      {(label || sub || meta) && (
        <div
          style={{
            position: 'absolute',
            left: size.hallLeft,
            top: size.artH + BAND.gap,
            width: width - size.hallLeft,
            fontFamily: FONT.sans,
          }}
        >
          {label && (
            <div style={{ fontSize: label1, lineHeight: BAND.labelLH, fontWeight: 850, letterSpacing: 1.5, color: lt.soft, whiteSpace: 'nowrap' }}>{label}</div>
          )}
          {sub && (
            <div
              style={{
                marginTop: 4,
                height: BAND.subSize * BAND.subLH * 2,
                fontSize: BAND.subSize,
                lineHeight: BAND.subLH,
                fontWeight: 600,
                color: C.text,
                textWrap: 'balance',
                overflow: 'hidden',
              }}
            >
              {sub}
            </div>
          )}
          {meta && (
            <div style={{ marginTop: 4, fontSize: BAND.metaSize, lineHeight: BAND.metaLH, fontWeight: 800, color: mt, whiteSpace: 'nowrap' }}>{meta}</div>
          )}
        </div>
      )}
    </div>
  );
}
