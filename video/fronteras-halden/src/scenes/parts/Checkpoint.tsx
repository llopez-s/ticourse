// Copied unchanged from V16 (video/zonas-halden/src/scenes/parts/Checkpoint.tsx, branch video-zonas-halden) so the zone
// plan V17 opens on looks exactly like the one V16 approved. Edit it in V16 first, then copy it here again.
import { useId, type CSSProperties } from 'react';
import { interpolateColors, useCurrentFrame } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { clamp01, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * «La garita» (canon: out/scene-brief.md «Visual metaphors»): a fenced gate seen
 * from above at three-quarters — a guard hut, a barrier arm across the road and
 * two fence stubs. A zone's frontier and the control on it. Drawn ONE way in
 * s02 (port overview + the napkin's empty gate), s06–s07 (the power cut), the
 * blueprint row (s03) and s10's icons.
 *
 * States are continuous weights so they can animate; `state` only picks the
 * defaults:
 *   - `manned`  0 = EMPTY: nobody was ever posted here. No lamp fixture, no
 *               cable, faded paint, weeds and a cobweb, an empty window. NOT a
 *               failure mode. 1 = equipped and staffed: guard, lamp, cable.
 *   - `power`   1 = the lamp is lit and the window lit; 0 = power cut: lamp
 *               dark, window dark (the guard is only a shadow: nobody looks),
 *               broken cable and an amber «no power» badge.
 *   - `barrier` 0 = arm down (closed), 1 = arm raised (open).
 *
 *   state='empty'   → manned 0, power 0, barrier 1 (raised)
 *   state='powered' → manned 1, power 1, barrier 0 (down)
 *   state='cut'     → manned 1, power 0, barrier 0 (pass `barrier={1}` for
 *                     the fail-open ending, keep 0 for fail-closed)
 *
 * Looks: 'scene' (the dark-stage illustration), 'ink' (pen on the napkin:
 * structure in `ink`, guard/lamp/arm turning to `accent` as `manned` rises)
 * and 'plan' (blueprint line art in cyan). Crops: 'gate' (the hut and the
 * barrier band only) or 'road' (the road runs through, with room below the
 * barrier for a queue of trucks). Design units: 600 wide; `checkpointSize()`
 * and `checkpointPoint()` give the px box and anchors. Nothing is positioned
 * and nothing reads the timeline except the optional `at` pop-in.
 */

export type CheckpointState = 'empty' | 'powered' | 'cut';
export type CheckpointLook = 'scene' | 'ink' | 'plan';
export type CheckpointCrop = 'gate' | 'road';
export type CheckpointDetail = 'full' | 'medium' | 'icon';

export const CHECKPOINT_PRESETS: Record<CheckpointState, { manned: number; power: number; barrier: number }> = {
  empty: { manned: 0, power: 0, barrier: 1 },
  powered: { manned: 1, power: 1, barrier: 0 },
  cut: { manned: 1, power: 0, barrier: 0 },
};

/** Napkin pen colours (also used by Napkin.tsx). */
export const PEN = {
  ink: '#2c3a52',
  paper: '#f4eee2',
  blue: '#0e7490',
  red: '#d22a4c',
  green: '#047857',
} as const;

// ---------------------------------------------------------------------------
// Geometry (design units)

const FY = 240; // ground line of the fence at the gate
const ROAD = { x0: 330, x1: 450, cx: 390 } as const;
const PIVOT = { x: 313, y: 204 } as const;
const ARM = 172;
const QUEUE_NOSE = 218; // where the first waiting truck's nose stops (outside the barrier)
const TRUCK_PITCH = 168;

const P = {
  gate: { x: ROAD.cx, y: PIVOT.y },
  hut: { x: 230, y: 192 },
  window: { x: 230, y: 176 },
  lamp: { x: 284, y: 86 },
  pivot: PIVOT,
  queue: { x: ROAD.cx, y: QUEUE_NOSE },
  inside: { x: ROAD.cx, y: 110 },
  outside: { x: ROAD.cx, y: 300 },
  fenceLeft: { x: 0, y: FY - 30 },
  fenceRight: { x: 600, y: FY - 30 },
} as const;

export type CheckpointPoint = keyof typeof P;

function viewBoxOf(crop: CheckpointCrop, fence: boolean) {
  const x = fence ? 0 : 150;
  const w = fence ? 600 : 350;
  return crop === 'road' ? { x, y: 0, w, h: 600 } : { x, y: 22, w, h: 258 };
}

/** The px box of a Checkpoint `width` px wide (+ its design-unit scale). */
export function checkpointSize(width: number, { crop = 'gate', fence = true }: { crop?: CheckpointCrop; fence?: boolean } = {}) {
  const vb = viewBoxOf(crop, fence);
  const scale = width / vb.w;
  return { w: width, h: vb.h * scale, scale };
}

/**
 * An anchor in px from the Checkpoint's top-left: 'gate' (road centre on the
 * barrier line: align a path or a packet here), 'hut', 'window', 'lamp',
 * 'pivot', 'queue' (where the first waiting truck's nose stops), 'inside' /
 * 'outside' (the road beyond / before the barrier), 'fenceLeft' / 'fenceRight'
 * (the ends of the fence stubs).
 */
export function checkpointPoint(
  width: number,
  which: CheckpointPoint,
  { crop = 'gate', fence = true }: { crop?: CheckpointCrop; fence?: boolean } = {},
): { x: number; y: number } {
  const vb = viewBoxOf(crop, fence);
  const s = width / vb.w;
  return { x: (P[which].x - vb.x) * s, y: (P[which].y - vb.y) * s };
}

export function checkpointDetail(width: number, fence = true): CheckpointDetail {
  // Judge by the hut's on-screen size, not the crop's.
  const hutPx = (120 * width) / (fence ? 600 : 350);
  return hutPx >= 76 ? 'full' : hutPx >= 34 ? 'medium' : 'icon';
}

const dropGlow = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 16 * g)}px ${alpha(color, 0.6 * g)})` : '');
const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

// ---------------------------------------------------------------------------
// Truck (top view, nose up)

export const TRUCK_BASE = { w: 62, h: 150 } as const;

/** A truck seen from above, nose up, `x`/`y` = its nose centre, in the parent's units. */
export function TruckTop({
  x,
  y,
  scale = 1,
  outline = '#94a3b8',
  body = '#1e293b',
  cab = alpha(C.sky, 0.32),
  strokeWidth = 3,
  opacity = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  outline?: string;
  body?: string;
  cab?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  if (opacity <= 0.001) return null;
  return (
    <g transform={`translate(${x - 31 * scale} ${y}) scale(${scale})`} opacity={opacity}>
      {/* Mirrors */}
      <rect x={-5} y={12} width={6} height={9} rx={2} fill={outline} />
      <rect x={61} y={12} width={6} height={9} rx={2} fill={outline} />
      {/* Cab */}
      <rect x={4} y={0} width={54} height={40} rx={9} fill={cab} stroke={outline} strokeWidth={strokeWidth} />
      <rect x={11} y={7} width={40} height={10} rx={3} fill={alpha('#e2e8f0', 0.55)} />
      {/* Trailer */}
      <rect x={0} y={46} width={62} height={104} rx={4} fill={body} stroke={outline} strokeWidth={strokeWidth} />
      <path d="M 6 72 L 56 72 M 6 98 L 56 98 M 6 124 L 56 124" stroke={alpha(outline, 0.45)} strokeWidth={strokeWidth * 0.7} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Checkpoint

export function Checkpoint({
  width,
  state = 'powered',
  manned: mannedProp,
  power: powerProp,
  barrier: barrierProp,
  look = 'scene',
  crop = 'gate',
  fence = true,
  road,
  pole,
  queue = 0,
  passing = [],
  watch: watchProp,
  cutMark: cutMarkProp,
  detail: detailProp,
  tone = 'cyan',
  ink = PEN.ink,
  accent = PEN.blue,
  paper = PEN.paper,
  glow = 0,
  dim = 0,
  at,
  frame: frameProp,
  style,
}: {
  /** Width in px; the height follows the crop (see checkpointSize). */
  width: number;
  /** Preset for manned / power / barrier (each overridable). */
  state?: CheckpointState;
  /** 0 = never staffed (empty, dusty) … 1 = equipped and staffed. */
  manned?: number;
  /** 1 = lamp and window lit … 0 = power cut. */
  power?: number;
  /** 0 = arm down (closed) … 1 = arm raised (open). */
  barrier?: number;
  look?: CheckpointLook;
  crop?: CheckpointCrop;
  /** Draw the two fence stubs (false: just hut + barrier, a narrower box). */
  fence?: boolean;
  /** Draw the road surface (default: look 'scene' only). */
  road?: boolean;
  /** Power pole + cable to the hut (default: scene look, road crop, full detail). */
  pole?: boolean;
  /** Trucks waiting outside the barrier, 0–3; a fraction slides the last one in. */
  queue?: number;
  /** Trucks driving through, each 0–1 (0 = below the frame, 1 = gone beyond it). */
  passing?: number | number[];
  /** 0–1 the guard's view cone over the road (default: manned × power, scene look). */
  watch?: number;
  /** 0–1 the amber «no power» badge (default: manned × (1 − power)). */
  cutMark?: number;
  /** Stroke/detail level (default from width: full ≥ ~380 px, medium, icon ≤ ~120 px). */
  detail?: CheckpointDetail;
  /** Hut outline tone in the scene look (default cyan: the control). */
  tone?: Tone;
  /** Pen colours for look 'ink'. */
  ink?: string;
  accent?: string;
  paper?: string;
  glow?: number;
  dim?: number;
  /** Frame (Sequence-relative) the checkpoint pops in; omitted = on screen. */
  at?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('ckpt');
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const preset = CHECKPOINT_PRESETS[state];
  const manned = clamp01(mannedProp ?? preset.manned);
  const power = clamp01(powerProp ?? preset.power) * manned;
  const barrier = clamp01(barrierProp ?? preset.barrier);
  const vb = viewBoxOf(crop, fence);
  const s = width / vb.w;
  const h = vb.h * s;
  const detail = detailProp ?? checkpointDetail(width, fence);
  const full = detail === 'full';
  const icon = detail === 'icon';
  const showRoad = road ?? (look === 'scene' && !icon);
  const showPole = (pole ?? (look === 'scene' && crop === 'road' && full)) && manned > 0.01;
  const watch = clamp01(watchProp ?? (look === 'scene' && !icon ? manned * power : 0));
  const cutMark = clamp01(cutMarkProp ?? (look === 'ink' ? 0 : manned * (1 - power)));
  const t = toneOf(tone);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const pop = at === undefined ? 1 : progress(frame, at, 14, EASE.out);
  if (pop <= 0) return null;

  /** A stroke width in design units that never renders thinner than `minPx`. */
  const sw = (base: number, minPx: number) => Math.max(base, minPx / s);

  // ---- Palette per look ----------------------------------------------------
  const scene = look === 'scene';
  const inkLook = look === 'ink';
  const plan = look === 'plan';
  const line = scene
    ? interpolateColors(manned, [0, 1], ['#64748b', t.fg])
    : inkLook
      ? ink
      : alpha(C.cyan, 0.92);
  const crew = scene ? C.cyan : inkLook ? interpolateColors(manned, [0, 1], [ink, accent]) : C.cyan;
  const hutFill = scene ? C.ink800 : inkLook ? paper : alpha(C.cyan, 0.07);
  const roofFill = scene ? '#1d2d4a' : inkLook ? paper : alpha(C.cyan, 0.1);
  const roofEdge = scene ? C.ink700 : inkLook ? paper : alpha(C.cyan, 0.12);
  const fenceCol = scene ? '#64748b' : inkLook ? ink : alpha(C.cyan, 0.6);
  const armBody = scene ? interpolateColors(manned, [0, 1], ['#8b97a8', '#e2e8f0']) : inkLook ? paper : alpha(C.cyan, 0.08);
  const armStripe = scene
    ? interpolateColors(manned, [0, 1], ['#7a5a64', C.rose])
    : inkLook
      ? interpolateColors(manned, [0, 1], [ink, accent])
      : alpha(C.cyan, 0.7);
  const armEdge = scene ? alpha('#020617', 0.7) : inkLook ? interpolateColors(manned, [0, 1], [ink, accent]) : alpha(C.cyan, 0.92);
  const lampOn = C.emerald;

  const lw = sw(3.4, icon ? 1.6 : 2); // main outline
  const thin = sw(2.4, icon ? 1.2 : 1.4);
  const angle = -80 * barrier;

  // ---- Fence stubs -----------------------------------------------------------
  const posts = fence ? [6, 44, 82, 120, 158, 492, 530, 568] : [];
  const fenceEls = fence ? (
    <g stroke={fenceCol} strokeLinecap="round" fill="none">
      {/* Rails */}
      <path d={`M 0 ${FY - 58} L 168 ${FY - 58} M 0 ${FY - 14} L 168 ${FY - 14} M 466 ${FY - 58} L 600 ${FY - 58} M 466 ${FY - 14} L 600 ${FY - 14}`} strokeWidth={thin} />
      {/* Mesh (full detail only) */}
      {full && !plan ? (
        <path
          d={Array.from({ length: 12 }, (_, i) => {
            const x = i * 14;
            return `M ${x} ${FY - 58} L ${x + 30} ${FY - 14} M ${x + 30} ${FY - 58} L ${x} ${FY - 14}`;
          })
            .concat(
              Array.from({ length: 10 }, (_, i) => {
                const x = 470 + i * 14;
                return `M ${x} ${FY - 58} L ${Math.min(600, x + 30)} ${FY - 14} M ${Math.min(600, x + 30)} ${FY - 58} L ${x} ${FY - 14}`;
              }),
            )
            .join(' ')}
          strokeWidth={sw(1.2, 0.8)}
          opacity={0.32}
        />
      ) : null}
      {/* Posts */}
      {posts.map((x) => (
        <line key={x} x1={x} y1={FY} x2={x} y2={FY - 66} strokeWidth={lw} />
      ))}
    </g>
  ) : null;

  // ---- Road ------------------------------------------------------------------
  const roadEls = showRoad ? (
    <g>
      <defs>
        <linearGradient id={`${id}-road`} x1="0" y1={vb.y} x2="0" y2={vb.y + vb.h} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.ink850} stopOpacity={0} />
          <stop offset="0.18" stopColor={C.ink850} stopOpacity={1} />
          <stop offset="0.82" stopColor={C.ink850} stopOpacity={1} />
          <stop offset="1" stopColor={C.ink850} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1={vb.y} x2="0" y2={vb.y + vb.h} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#334155" stopOpacity={0} />
          <stop offset="0.18" stopColor="#334155" stopOpacity={1} />
          <stop offset="0.82" stopColor="#334155" stopOpacity={1} />
          <stop offset="1" stopColor="#334155" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={ROAD.x0} y={vb.y} width={ROAD.x1 - ROAD.x0} height={vb.h} fill={`url(#${id}-road)`} />
      <path d={`M ${ROAD.x0} ${vb.y} L ${ROAD.x0} ${vb.y + vb.h} M ${ROAD.x1} ${vb.y} L ${ROAD.x1} ${vb.y + vb.h}`} stroke={`url(#${id}-edge)`} strokeWidth={thin} />
      {full ? (
        <line x1={ROAD.cx} y1={vb.y} x2={ROAD.cx} y2={vb.y + vb.h} stroke={`url(#${id}-edge)`} strokeWidth={sw(2.5, 1.2)} strokeDasharray="22 18" />
      ) : null}
    </g>
  ) : null;

  // ---- Trucks ----------------------------------------------------------------
  const q = Math.max(0, Math.min(3, queue));
  const passList = (Array.isArray(passing) ? passing : [passing]).filter((p) => p > 0 && p < 1);
  const truckStroke = sw(3, 1.4);
  const truckEls =
    q > 0.001 || passList.length > 0 ? (
      <g clipPath={`url(#${id}-clip)`}>
        {Array.from({ length: Math.ceil(q) }, (_, i) => {
          const k = clamp01(q - i);
          return <TruckTop key={`q${i}`} x={ROAD.cx} y={QUEUE_NOSE + i * TRUCK_PITCH + (1 - k) * 90} opacity={Math.min(1, k * 1.6)} strokeWidth={truckStroke} />;
        })}
        {passList.map((p, i) => (
          <TruckTop key={`p${i}`} x={ROAD.cx} y={vb.y + vb.h + 20 - p * (vb.h + 200)} strokeWidth={truckStroke} />
        ))}
      </g>
    ) : null;

  // ---- Watch cone (someone looks at the road) --------------------------------
  const watchEls =
    watch > 0.01 ? (
      <g opacity={watch}>
        <defs>
          <linearGradient id={`${id}-cone`} x1="240" y1="0" x2="460" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.cyan} stopOpacity={0.32} />
            <stop offset="1" stopColor={C.cyan} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`M 244 176 L 462 140 L 462 262 Z`} fill={`url(#${id}-cone)`} />
      </g>
    ) : null;

  // ---- Power pole and cable --------------------------------------------------
  const poleEls = showPole ? (
    <g opacity={manned} stroke="#475569" strokeLinecap="round" fill="none">
      <line x1={70} y1={330} x2={70} y2={58} strokeWidth={sw(6, 2)} />
      <line x1={46} y1={70} x2={94} y2={70} strokeWidth={sw(5, 2)} />
      <circle cx={52} cy={64} r={3} fill="#64748b" />
      <circle cx={88} cy={64} r={3} fill="#64748b" />
      {power > 0.5 || cutMark < 0.5 ? (
        <path d="M 88 66 Q 126 104 166 98" strokeWidth={sw(2.4, 1.2)} stroke="#94a3b8" />
      ) : (
        <>
          <path d="M 88 66 Q 102 88 108 108" strokeWidth={sw(2.4, 1.2)} stroke="#94a3b8" />
          <path d="M 166 98 Q 150 106 146 124" strokeWidth={sw(2.4, 1.2)} stroke="#94a3b8" />
        </>
      )}
    </g>
  ) : null;

  // ---- Hut -------------------------------------------------------------------
  const lit = power;
  const hutEls = (
    <g strokeLinejoin="round">
      {/* Roof: top face, then the front edge */}
      <rect x={160} y={96} width={140} height={28} rx={3} fill={roofFill} stroke={line} strokeWidth={lw} />
      <rect x={155} y={122} width={150} height={12} rx={3} fill={roofEdge} stroke={line} strokeWidth={lw} />
      {/* Front face */}
      <rect x={170} y={134} width={120} height={120} rx={3} fill={hutFill} stroke={line} strokeWidth={lw} />
      {/* Window: interior, then the guard clipped to it */}
      <defs>
        <clipPath id={`${id}-win`}>
          <rect x={184} y={148} width={92} height={60} rx={4} />
        </clipPath>
      </defs>
      <rect
        x={184}
        y={148}
        width={92}
        height={60}
        rx={4}
        fill={scene ? interpolateColors(manned, [0, 1], ['#1a2234', '#050a14']) : 'none'}
      />
      {scene && lit > 0.01 ? <rect x={184} y={148} width={92} height={60} rx={4} fill={alpha('#fde68a', 0.3 * lit)} /> : null}
      {manned > 0.01 ? (
        <g clipPath={`url(#${id}-win)`} opacity={manned * (scene ? 0.22 + 0.78 * lit : 1)}>
          {/* The guard: peaked cap, head, shoulders */}
          <path d="M 205 210 Q 207 188 230 186 Q 253 188 255 210 Z" fill={alpha(crew, 0.3)} stroke={crew} strokeWidth={sw(2.6, icon ? 1.2 : 1.4)} />
          <circle cx={230} cy={172} r={12} fill={alpha(crew, 0.3)} stroke={crew} strokeWidth={sw(2.6, icon ? 1.2 : 1.4)} />
          <path d="M 218 163 Q 218 151 230 151 Q 242 151 242 163 Z" fill={crew} />
          <line x1={214} y1={163} x2={249} y2={163} stroke={crew} strokeWidth={sw(3, icon ? 1.4 : 1.6)} strokeLinecap="round" />
        </g>
      ) : null}
      <rect x={184} y={148} width={92} height={60} rx={4} fill="none" stroke={line} strokeWidth={thin} />
      {/* Empty: a cobweb in the window's corner, dust on the roof, weeds */}
      {manned < 0.99 && !icon ? (
        <g opacity={1 - manned} stroke={scene ? '#7c8799' : ink} fill="none" strokeWidth={sw(1.4, 0.9)} strokeLinecap="round">
          <path d="M 186 150 L 214 150 M 186 150 L 206 166 M 186 150 L 186 178 M 202 150 Q 197 157 186 160 M 212 150 Q 203 165 186 170" />
          {full ? <path d="M 176 104 L 178 104 M 204 110 L 206 110 M 252 102 L 254 102 M 280 112 L 282 112" strokeWidth={sw(3, 1.4)} /> : null}
        </g>
      ) : null}
      {manned < 0.99 ? (
        <g opacity={1 - manned} stroke={scene ? '#5f7f6c' : ink} fill="none" strokeWidth={sw(2.2, icon ? 1.2 : 1)} strokeLinecap="round">
          <path d="M 174 256 L 168 236 M 178 256 L 179 232 M 182 256 L 190 238" />
          <path d="M 282 256 L 276 240 M 286 256 L 288 234 M 290 256 L 298 242" />
          {!icon ? <path d="M 322 258 L 318 244 M 326 258 L 330 240" /> : null}
        </g>
      ) : null}
      {/* Lamp fixture (only where someone equipped the hut) */}
      {manned > 0.01 ? (
        <g opacity={manned}>
          {lit > 0.01 && scene ? <circle cx={284} cy={86} r={34} fill={`url(#${id}-lamp)`} opacity={lit} /> : null}
          {lit > 0.01 && inkLook ? (
            <g stroke={accent} strokeWidth={sw(2.4, 1.4)} strokeLinecap="round" opacity={lit}>
              <path d="M 284 66 L 284 58 M 268 74 L 262 68 M 300 74 L 306 68 M 264 88 L 256 88 M 304 88 L 312 88" />
            </g>
          ) : null}
          {!plan ? (
            <>
              <rect x={275} y={90} width={18} height={7} rx={2} fill={scene ? '#334155' : paper} stroke={line} strokeWidth={thin} />
              <path
                d="M 276 90 A 8 8 0 0 1 292 90 Z"
                fill={scene ? interpolateColors(lit, [0, 1], ['#334155', lampOn]) : inkLook ? (lit > 0.5 ? accent : paper) : 'none'}
                stroke={scene ? interpolateColors(lit, [0, 1], ['#64748b', '#a7f3d0']) : line}
                strokeWidth={thin}
              />
            </>
          ) : null}
        </g>
      ) : null}
    </g>
  );

  // ---- Barrier: fork rest, pedestal, arm --------------------------------------
  const armEls = (
    <g strokeLinejoin="round">
      <g stroke={line} strokeWidth={lw} strokeLinecap="round" fill="none">
        <line x1={477} y1={256} x2={477} y2={212} />
        <path d="M 468 202 L 477 212 L 486 202" />
      </g>
      <rect x={298} y={190} width={30} height={66} rx={3} fill={hutFill} stroke={line} strokeWidth={lw} />
      <g transform={`translate(${PIVOT.x} ${PIVOT.y}) rotate(${angle})`}>
        <rect x={-30} y={-8} width={30} height={16} rx={3} fill={scene ? '#334155' : hutFill} stroke={armEdge} strokeWidth={thin} />
        <rect x={0} y={-6.5} width={ARM} height={13} rx={6.5} fill={armBody} stroke={armEdge} strokeWidth={sw(1.6, icon ? 1.2 : 1)} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={18 + i * 32} y={-6.5} width={16} height={13} fill={armStripe} opacity={plan ? 0.6 : 1} />
        ))}
        <rect x={0} y={-6.5} width={ARM} height={13} rx={6.5} fill="none" stroke={armEdge} strokeWidth={sw(1.6, icon ? 1.2 : 1)} />
        <circle cx={0} cy={0} r={9} fill={scene ? C.ink800 : hutFill} stroke={line} strokeWidth={thin} />
      </g>
    </g>
  );

  // ---- «No power» badge -------------------------------------------------------
  const badgeEls =
    cutMark > 0.01 ? (
      <g opacity={cutMark} transform={`translate(${icon ? 236 : 244} ${icon ? 52 : 58}) scale(${icon ? 1.6 : 1})`}>
        <circle cx={0} cy={0} r={18} fill={C.ink900} stroke={C.amber} strokeWidth={sw(2.6, 1.4)} />
        <path d="M 3 -11 L -6 2 L 0 2 L -3 11 L 7 -3 L 1 -3 Z" fill={C.amber} />
        <line x1={-12} y1={-12} x2={12} y2={12} stroke={C.amber} strokeWidth={sw(3, 1.4)} strokeLinecap="round" />
      </g>
    ) : null;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: pop * (1 - 0.6 * d),
        transform: pop < 1 ? `translateY(${(1 - pop) * 14}px)` : undefined,
        filter: joinFilters(dropGlow(scene ? t.fg : C.cyan, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} />
          </clipPath>
          <radialGradient id={`${id}-lamp`}>
            <stop offset="0" stopColor={lampOn} stopOpacity={0.6} />
            <stop offset="1" stopColor={lampOn} stopOpacity={0} />
          </radialGradient>
        </defs>
        {roadEls}
        {fenceEls}
        {watchEls}
        {poleEls}
        {truckEls}
        {hutEls}
        {armEls}
        {badgeEls}
      </svg>
    </div>
  );
}
