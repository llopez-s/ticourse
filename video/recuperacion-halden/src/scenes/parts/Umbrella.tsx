import { useId, type CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE } from '../../../../engine/src/theme/motion';
import { clamp01, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * «El paraguas plegado» (canon: out/scene-brief.md «Shared parts»): a folded
 * umbrella standing tip-down in a stand at an entrance (a door frame and a mat),
 * strap closed, with a flag sticker «revisado» that nobody has checked by
 * opening it. `open` 0→1 lifts it out of the stand, turns it upright and opens
 * the canopy above the entrance (the sticker travels with the fabric).
 *
 *   open 0      folded in the stand, strap closed (s05 `umbrella`)
 *   open ~0.5   lifted and turning, canopy still closed (mid-motion)
 *   open 1      upright and fully open over the entrance (s05 `check`)
 *
 * Props (all optional):
 *   - `width`       px (default 360); height = `umbrellaSize(width).h` (≈ 1.04 × width).
 *                   ≥ 240 px = full detail: door frame, mat and the sticker's
 *                   text (legible from ~340 px); < 240 px = icon detail: no
 *                   door, no rain, the sticker is a blank tag (s06's ~180 px icon).
 *   - `open`        0–1 (see above). Animate with an eased 0→1 over ~30 frames.
 *   - `sticker`     show the sticker (default true); `stickerText` (default «revisado»).
 *   - `tone`        canopy accent (default 'cyan' = the plan; pass 'emerald'
 *                   once the restore is proven).
 *   - `rain`        0–1 falling rain (s05's «en pleno chaparrón»); drops under
 *                   an open canopy are kept dry.
 *   - `glow`        0–1 halo around the umbrella in `tone`.
 *   - `entrance`    draw the door frame and the mat (default true).
 *   - `frame`       optional; defaults to useCurrentFrame() (rain only).
 *   - `style`       extra style on the root div.
 * Nothing is positioned and nothing reads the timeline.
 *
 * Used in: s05 (folded, never opened; opens on `check`), s06 (rule-card icon).
 */

export interface UmbrellaProps {
  width?: number;
  open?: number;
  sticker?: boolean;
  stickerText?: string;
  tone?: Tone;
  rain?: number;
  glow?: number;
  entrance?: boolean;
  frame?: number;
  style?: CSSProperties;
}

const VB = { w: 480, h: 500 } as const;
const GROUND = 488;
const CX = 200;
const STAND = { x0: 162, x1: 238, top: 374 } as const;
const SHAFT = 300;
const CANOPY = 210; // folded length of the canopy along the shaft
const R_OPEN = 214;
const H_OPEN = 96;
const PIVOT = 150; // local y of the rotation centre (mid shaft)
const POSE = {
  folded: { cx: CX, cy: 458 - PIVOT, angle: 180 },
  open: { cx: CX, cy: 58 + PIVOT, angle: 0 },
} as const;
const RIBS = 7;
const PAPER = '#f4eee2';
const INK = '#2c3a52';

export function umbrellaSize(width: number): { w: number; h: number; scale: number } {
  const scale = width / VB.w;
  return { w: width, h: VB.h * scale, scale };
}

function svgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function hash(n: number): number {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Folded canopy half-width at fraction u (0 = tip/apex, 1 = collar). */
const foldedX = (u: number) => 4 + 21 * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u))), 0.75);
/** Open dome profile: half-width R·u, depth h·(1 − √(1 − u²)). */
const domeY = (u: number) => H_OPEN * (1 - Math.sqrt(Math.max(0, 1 - u * u)));

type Pt = { x: number; y: number };

/** The canopy silhouette at opening `t` (local units: apex at 0,0; +y toward the handle). */
function canopyPoints(t: number): Pt[] {
  const N = 22;
  const right: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const f = { x: foldedX(u), y: CANOPY * u };
    const o = { x: R_OPEN * u, y: domeY(u) };
    right.push({ x: lerp(f.x, o.x, t), y: lerp(f.y, o.y, t) });
  }
  // bottom edge through the rib tips (side view: tip x = R cos ψ), scalloped between them
  const bottom: Pt[] = [];
  const tipsO = Array.from({ length: RIBS }, (_, k) => R_OPEN * Math.cos((k * Math.PI) / (RIBS - 1)));
  const tipsF = Array.from({ length: RIBS }, (_, k) => foldedX(1) * Math.cos((k * Math.PI) / (RIBS - 1)));
  for (let k = 0; k < RIBS - 1; k++) {
    const S = 6;
    for (let j = 1; j <= S; j++) {
      const p = j / S;
      const xo = lerp(tipsO[k], tipsO[k + 1], p);
      const yo = H_OPEN - 17 * Math.sin(Math.PI * p) * Math.min(1, Math.abs(tipsO[k] - tipsO[k + 1]) / 60);
      const xf = lerp(tipsF[k], tipsF[k + 1], p);
      bottom.push({ x: lerp(xf, xo, t), y: lerp(CANOPY, yo, t) });
    }
  }
  const left = right.map((p) => ({ x: -p.x, y: p.y })).reverse();
  return [...left, ...right.slice(1), ...bottom.slice(0, -1)];
}

function ptsPath(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
}

export function Umbrella({
  width = 360,
  open = 0,
  sticker = true,
  stickerText = 'revisado',
  tone = 'cyan',
  rain = 0,
  glow = 0,
  entrance = true,
  frame,
  style,
}: UmbrellaProps) {
  const current = useCurrentFrame();
  const f = frame ?? current;
  const t = toneOf(tone);
  const icon = width < 240;
  const { h, scale } = umbrellaSize(width);
  const k = Math.max(1, 260 / width); // keep strokes visible when small
  const O = clamp01(open);
  const lift = EASE.inOut(clamp01(O / 0.55));
  const spread = EASE.out(clamp01((O - 0.4) / 0.6));
  const G = clamp01(glow);
  const RAIN = icon ? 0 : clamp01(rain);

  const idCanopy = svgId('um-canopy');
  const idDoor = svgId('um-door');
  const idGlow = svgId('um-glow');

  const pose = {
    cx: lerp(POSE.folded.cx, POSE.open.cx, lift),
    cy: lerp(POSE.folded.cy, POSE.open.cy, lift),
    angle: lerp(POSE.folded.angle, POSE.open.angle, lift),
  };
  const toScreen = (p: Pt): Pt => {
    const a = (pose.angle * Math.PI) / 180;
    const x = p.x;
    const y = p.y - PIVOT;
    return { x: pose.cx + x * Math.cos(a) - y * Math.sin(a), y: pose.cy + x * Math.sin(a) + y * Math.cos(a) };
  };
  const transform = `translate(${pose.cx} ${pose.cy}) rotate(${pose.angle}) translate(0 ${-PIVOT})`;

  const canopy = canopyPoints(spread);
  const tips = Array.from({ length: RIBS }, (_, i) => {
    const c = Math.cos((i * Math.PI) / (RIBS - 1));
    return { x: lerp(foldedX(1) * c, R_OPEN * c, spread), y: lerp(CANOPY, H_OPEN, spread) };
  });

  // sticker anchor: on the folded canopy's screen-right side (local −x while upside down),
  // on the open dome's right side once upright
  const uF = 0.45;
  const uO = 0.62;
  const anchorLocal = {
    x: lerp(-foldedX(uF) + 2, R_OPEN * uO, spread),
    y: lerp(CANOPY * uF, domeY(uO) + 4, spread),
  };
  const anchor = toScreen(anchorLocal);
  const sFont = Math.max(30, Math.min(46, 28 / scale));
  const sPad = sFont * 0.42;
  const sW = icon ? 70 : stickerText.length * sFont * 0.56 + sFont * 1.15 + sPad * 2;
  const sH = icon ? 50 : sFont * 1.55;
  // keep the sticker inside the art box: past the right edge it slides back onto the fabric
  const sX = Math.min(anchor.x + 16, VB.w - 6 - sW);
  const sY = anchor.y - sH / 2;

  // rain drops
  const drops = RAIN > 0.001
    ? Array.from({ length: 30 }, (_, i) => {
        const x = 20 + hash(i) * (VB.w - 40);
        const speed = 16 + hash(i + 50) * 8;
        const y = ((hash(i + 100) * (VB.h + 80) + f * speed) % (VB.h + 80)) - 60;
        return { x, y };
      }).filter((d) => {
        if (spread < 0.3) return true;
        const half = R_OPEN * spread * 0.95;
        const under = Math.abs(d.x - CX) < half && d.y + 24 > POSE.open.cy - PIVOT + H_OPEN * 0.6;
        return !under;
      })
    : [];

  return (
    <div style={{ position: 'relative', width, height: h, ...style }}>
      <svg width={width} height={h} viewBox={`0 0 ${VB.w} ${VB.h}`} style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={idCanopy} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.fg} stopOpacity={0.95} />
            <stop offset="100%" stopColor={t.deep} stopOpacity={1} />
          </linearGradient>
          <linearGradient id={idDoor} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.ink900} />
            <stop offset="100%" stopColor={C.ink850} />
          </linearGradient>
          <filter id={idGlow} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation={4 + 14 * G} floodColor={t.fg} floodOpacity={0.6 * G} />
          </filter>
        </defs>

        {/* entrance: door frame + mat */}
        {entrance && !icon && (
          <g>
            <rect x={96} y={26} width={290} height={GROUND - 26} rx={6} fill={`url(#${idDoor})`} stroke={C.ink600} strokeWidth={8} />
            <line x1={241} y1={40} x2={241} y2={GROUND} stroke={alpha(C.ink600, 0.7)} strokeWidth={3} />
            <circle cx={226} cy={300} r={5} fill={C.ink500} />
            <circle cx={256} cy={300} r={5} fill={C.ink500} />
            <rect x={150} y={GROUND - 8} width={190} height={14} rx={4} fill={C.ink700} />
          </g>
        )}
        <line x1={icon ? 120 : 40} y1={GROUND} x2={icon ? 280 : 440} y2={GROUND} stroke={C.ink500} strokeWidth={3 * k} strokeLinecap="round" />

        {/* rain */}
        {drops.map((d, i) => (
          <line key={i} x1={d.x} y1={d.y} x2={d.x - 6} y2={d.y + 22} stroke={alpha('#7dd3fc', 0.6 * RAIN)} strokeWidth={2.5} strokeLinecap="round" />
        ))}

        {/* stand: back rim */}
        <ellipse cx={CX} cy={STAND.top} rx={(STAND.x1 - STAND.x0) / 2} ry={9} fill={C.ink950} stroke={C.ink500} strokeWidth={2.5 * k} />

        {/* the umbrella */}
        <g transform={transform} filter={G > 0.01 ? `url(#${idGlow})` : undefined}>
          {/* shaft + ferrule */}
          <line x1={0} y1={-24} x2={0} y2={SHAFT} stroke={C.muted} strokeWidth={5 * k} strokeLinecap="round" />
          <circle cx={0} cy={-26} r={4 * k} fill={C.muted} />
          {/* crook handle */}
          <path d={`M0,${SHAFT - 14} L0,${SHAFT + 8} A21,21 0 0 1 -42,${SHAFT + 8} L-42,${SHAFT - 2}`} fill="none" stroke="#8a6a43" strokeWidth={11 * k} strokeLinecap="round" />
          {/* canopy */}
          <path d={ptsPath(canopy)} fill={`url(#${idCanopy})`} stroke={alpha(t.soft, 0.85)} strokeWidth={2.5 * k} strokeLinejoin="round" />
          {/* ribs / folds */}
          {tips.slice(1, -1).map((tp, i) => {
            const cx = lerp(tp.x * 0.5, tp.x * 0.86, spread);
            const cy = lerp(CANOPY * 0.5, H_OPEN * 0.04, spread);
            return <path key={i} d={`M0,0 Q${cx.toFixed(1)},${cy.toFixed(1)} ${tp.x.toFixed(1)},${tp.y.toFixed(1)}`} fill="none" stroke={alpha(t.deep, 0.9)} strokeWidth={2 * k} />;
          })}
          {/* strap with its snap (folded only) */}
          {spread < 0.25 && (
            <g opacity={1 - spread * 4}>
              <rect x={-foldedX(0.6) - 4} y={CANOPY * 0.6 - 8} width={2 * foldedX(0.6) + 8} height={16} rx={5} fill={t.deep} stroke={alpha(t.soft, 0.8)} strokeWidth={2 * k} />
              <circle cx={0} cy={CANOPY * 0.6} r={4.5} fill={t.soft} />
            </g>
          )}
        </g>

        {/* stand: front body (hides the tip while folded) */}
        <path
          d={`M${STAND.x0},${STAND.top} L${STAND.x0 + 6},${GROUND} H${STAND.x1 - 6} L${STAND.x1},${STAND.top} A${(STAND.x1 - STAND.x0) / 2},9 0 0 1 ${STAND.x0},${STAND.top} Z`}
          fill={C.ink700}
          stroke={C.ink500}
          strokeWidth={2.5 * k}
          strokeLinejoin="round"
        />
        <line x1={STAND.x0 + 3} y1={STAND.top + 40} x2={STAND.x1 - 3} y2={STAND.top + 40} stroke={C.ink600} strokeWidth={3 * k} />

        {/* sticker «revisado»: a flag label stuck on the fabric */}
        {sticker && (
          <g>
            <line x1={anchor.x} y1={anchor.y} x2={sX + 4} y2={anchor.y} stroke={PAPER} strokeWidth={6 * k} strokeLinecap="round" />
            <g transform={`rotate(-5 ${sX} ${anchor.y})`}>
              <rect x={sX} y={sY} width={sW} height={sH} rx={8} fill={PAPER} stroke={INK} strokeWidth={2.5 * k} />
              {!icon ? (
                <>
                  <path
                    d={`M${sX + sPad} ${anchor.y} l${sFont * 0.28} ${sFont * 0.28} l${sFont * 0.5} ${-sFont * 0.56}`}
                    fill="none"
                    stroke={INK}
                    strokeWidth={sFont * 0.13}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text x={sX + sPad + sFont * 1.15} y={anchor.y + sFont * 0.36} fontFamily={FONT.sans} fontWeight={800} fontSize={sFont} fill={INK}>
                    {stickerText}
                  </text>
                </>
              ) : (
                <path d={`M${sX + 18} ${anchor.y} l10 10 l18 -20`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              )}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
