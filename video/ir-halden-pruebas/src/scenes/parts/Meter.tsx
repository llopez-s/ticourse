import { useId, type CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { clamp01, dimStyle } from '../../../../engine/src/ui';

/**
 * The water meter (concept 2, threat hunting): a house in cross-section with
 * a clean ceiling, three taps and the pipe from the street running through a
 * round water meter whose dial keeps turning with every tap closed — «algo
 * gotea». Variant `bypass`: pipes that branch off BEFORE the meter and feed
 * two low taps of their own, dashed amber — «grifos que no pasan por el
 * contador» (servers that send no logs). They are unknown, not a leak and not
 * an intruder: nothing here is ever rose.
 *
 * Props (all optional; `<Meter />` alone = taps closed, clean ceiling, dial
 * turning, no bypass):
 *   width       px, default 520; height = width × 470/640 (see meterSize).
 *   spin        dial speed, a CONSTANT rate: 0/false stopped, 1/true normal
 *               (one turn every 2 s), 2 twice as fast. Default 1. Do not animate
 *               it: the dial angle is (frame − spinFrom) × rate, recomputed per
 *               frame (Remotion renders frames out of order).
 *   spinFrom    frame at which the dial angle is 0 (default 0).
 *   closed      0–1 weight, taps: 0 open (water runs into the basins), 1 closed
 *               (default 1). Animate it to close the taps (handles turn, the
 *               streams stop from the top).
 *   stain       0–1 weight: the «not yet» ghost of a stain on the ceiling (a
 *               dashed outline at low opacity). Default 0 = clean ceiling.
 *   bypass      0–1 weight: the bypass pipes draw in, pipe 1 over 0–0.5 and
 *               pipe 2 over 0.5–1 (with `bypassCount` 1, over 0–1). Default 0.
 *   bypassCount 1 | 2 (default 2).
 *   bypassGlow  0–1 amber halo on the bypass pipes and taps.
 *   glow        0–1 emerald halo on the meter (the element the voice is on).
 *   dim         0–1 step-back (dimStyle); show 0–1 appear (default 1).
 *   frame       Sequence-relative frame (default useCurrentFrame()).
 *
 * Helpers: meterSize(width) → { width, height }; meterAnchors(width) → px
 * points from the art's top-left (dial centre + radius, taps, basins, stain,
 * bypass taps and a mid point on each bypass pipe, street inlet) to hang your
 * own labels («algo gotea», «todavía sin mancha», server names).
 * MeterDial is the same dial alone, for icons and small cards.
 */

const VB_W = 640;
const VB_H = 470;
const FLOOR = 380;
const DIAL = { x: 100, y: 322, r: 44 };
const MAIN_Y = 424;
const DIST_Y = 204;
const RISER_X = 214;
const TAPS_X = [300, 424, 548];
const TAP_Y = 226;
/** Taps are drawn in a small design and scaled up around their top. */
const TAP_S = 1.35;
/** Tip of a tap's spout relative to its drop (after scaling): the basin sits under it. */
const SPOUT = { dx: -35, dy: 30 };
const BASIN_Y = 300;
const BYPASS = [
  { x: 330, branchX: 16, y: 446 },
  { x: 454, branchX: 6, y: 460 },
] as const;
const BYPASS_TAP_Y = 326;
const STAIN = { x: 470, y: 176 };
/** Degrees per frame at spin 1: one turn every 60 frames (2 s at 30 fps). */
const DEG_PER_FRAME = 6;

export interface MeterProps {
  width?: number;
  spin?: number | boolean;
  spinFrom?: number;
  closed?: number;
  stain?: number;
  bypass?: number;
  bypassCount?: 1 | 2;
  bypassGlow?: number;
  glow?: number;
  dim?: number;
  show?: number;
  frame?: number;
  style?: CSSProperties;
}

export function meterSize(width = 520) {
  return { width, height: (VB_H * width) / VB_W };
}

/** Points of a meter drawn at `width`, in px from its top-left. */
export function meterAnchors(width = 520) {
  const s = width / VB_W;
  const p = (x: number, y: number) => ({ x: x * s, y: y * s });
  return {
    dial: { ...p(DIAL.x, DIAL.y), r: DIAL.r * s },
    taps: TAPS_X.map((x) => p(x, TAP_Y + 12)),
    basins: TAPS_X.map((x) => p(x + SPOUT.dx, BASIN_Y + 10)),
    stain: p(STAIN.x, STAIN.y),
    ceiling: p(405, 157),
    roof: p(405, 52),
    bypassTaps: BYPASS.map((b) => p(b.x, BYPASS_TAP_Y + 12)),
    bypassPipes: BYPASS.map((b) => p((b.branchX + b.x) / 2, b.y)),
    street: p(0, MAIN_Y),
    height: VB_H * s,
  };
}

function rateOf(spin: MeterProps['spin']): number {
  if (spin === undefined || spin === true) return 1;
  if (spin === false) return 0;
  return Math.max(0, spin);
}

export function Meter(props: MeterProps) {
  const current = useCurrentFrame();
  const frame = props.frame ?? current;
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const width = props.width ?? 520;
  const { height } = meterSize(width);
  const rate = rateOf(props.spin);
  const t = frame - (props.spinFrom ?? 0);
  const closed = clamp01(props.closed ?? 1);
  const stain = clamp01(props.stain ?? 0);
  const count = props.bypassCount ?? 2;
  const bypass = clamp01(props.bypass ?? 0);
  const bypassGlow = clamp01(props.bypassGlow ?? 0);
  const glow = clamp01(props.glow ?? 0);
  // Water in the metered pipes creeps along even with every tap closed: the leak.
  const flowOffset = -t * 1.6 * rate;

  const mainPath = `M 0 ${MAIN_Y} L 36 ${MAIN_Y} L 36 ${DIAL.y} L ${DIAL.x - DIAL.r} ${DIAL.y}`;
  const housePath = `M ${DIAL.x + DIAL.r} ${DIAL.y} L ${RISER_X} ${DIAL.y} L ${RISER_X} ${DIST_Y} L ${TAPS_X[2]} ${DIST_Y}`;

  return (
    <div style={{ position: 'relative', width, height, ...dimStyle(props.dim ?? 0, clamp01(props.show ?? 1)), ...props.style }}>
      <svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Ground and soil */}
        <rect x={-10} y={FLOOR} width={VB_W + 20} height={VB_H - FLOOR} fill={alpha(C.ink900, 0.75)} />
        <line x1={-10} y1={FLOOR} x2={VB_W + 10} y2={FLOOR} stroke={C.ink600} strokeWidth={4} strokeLinecap="round" />

        {/* House: back wall, walls, ceiling (clean), roof */}
        <rect x={190} y={150} width={430} height={FLOOR - 150} fill={alpha(C.ink800, 0.75)} />
        <line x1={190} y1={150} x2={190} y2={FLOOR} stroke={C.ink600} strokeWidth={6} />
        <line x1={620} y1={150} x2={620} y2={FLOOR} stroke={C.ink600} strokeWidth={6} />
        <rect x={190} y={150} width={430} height={12} fill={C.ink700} />
        <path d="M 170 156 L 405 50 L 640 156 L 626 162 L 405 64 L 184 162 Z" fill={C.ink700} stroke={C.ink500} strokeWidth={3} strokeLinejoin="round" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={250 + i * 62} y1={128 - Math.abs(i - 2.5) * 20} x2={250 + i * 62} y2={156} stroke={alpha(C.ink500, 0.45)} strokeWidth={2} />
        ))}

        {/* «Not yet»: the ghost of the stain that has not appeared */}
        {stain > 0.001 ? (
          <path
            d={`M ${STAIN.x - 44} ${STAIN.y - 6} C ${STAIN.x - 40} ${STAIN.y + 16} ${STAIN.x - 12} ${STAIN.y + 26} ${STAIN.x + 8} ${STAIN.y + 18} C ${STAIN.x + 30} ${STAIN.y + 28} ${STAIN.x + 50} ${STAIN.y + 10} ${STAIN.x + 42} ${STAIN.y - 6} Z`}
            fill={alpha(C.muted, 0.08 * stain)}
            stroke={alpha(C.muted, 0.6 * stain)}
            strokeWidth={2.5}
            strokeDasharray="7 7"
          />
        ) : null}

        {/* Metered pipes: street, meter, riser, distribution */}
        <Pipe d={mainPath} flowOffset={flowOffset} rate={rate} />
        <Pipe d={housePath} flowOffset={flowOffset} rate={rate} />
        {TAPS_X.map((x) => (
          <Pipe key={x} d={`M ${x} ${DIST_Y} L ${x} ${TAP_Y}`} flowOffset={flowOffset} rate={rate} />
        ))}
        {/* Street inlet cap */}
        <rect x={-8} y={MAIN_Y - 12} width={10} height={24} rx={3} fill={C.ink500} />

        {/* Basins and taps */}
        {TAPS_X.map((x) => (
          <Basin key={`b${x}`} cx={x + SPOUT.dx} />
        ))}
        {TAPS_X.map((x) => (
          <Tap key={`t${x}`} x={x} y={TAP_Y} closed={closed} frame={frame} bottom={BASIN_Y + 6} />
        ))}

        {/* Bypass: pipes from the street BEFORE the meter, to low taps of their own */}
        {BYPASS.slice(0, count).map((b, i) => {
          const span = 1 / count;
          const p = progress(bypass, i * span, span, EASE.inOut);
          if (p <= 0.001) return null;
          return <BypassPipe key={b.x} uid={`${uid}b${i}`} b={b} p={p} glow={bypassGlow} />;
        })}

        {/* The meter */}
        <Dial cx={DIAL.x} cy={DIAL.y} r={DIAL.r} angle={t * DEG_PER_FRAME * rate} glow={glow} />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Pipe({ d, flowOffset, rate }: { d: string; flowOffset: number; rate: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={C.ink500} strokeWidth={13} />
      <path d={d} stroke={alpha(C.ink950, 0.8)} strokeWidth={7} />
      {rate > 0 ? <path d={d} stroke={alpha(C.sky, 0.7)} strokeWidth={4} strokeDasharray="8 14" strokeDashoffset={flowOffset} /> : null}
    </g>
  );
}

function Basin({ cx }: { cx: number }) {
  return (
    <g>
      <path
        d={`M ${cx - 34} ${BASIN_Y} L ${cx + 34} ${BASIN_Y} C ${cx + 32} ${BASIN_Y + 22} ${cx + 18} ${BASIN_Y + 26} ${cx} ${BASIN_Y + 26} C ${cx - 18} ${BASIN_Y + 26} ${cx - 32} ${BASIN_Y + 22} ${cx - 34} ${BASIN_Y} Z`}
        fill={alpha(C.ink700, 0.9)}
        stroke={C.ink500}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <rect x={cx - 7} y={BASIN_Y + 26} width={14} height={FLOOR - BASIN_Y - 26} fill={alpha(C.ink700, 0.8)} stroke={alpha(C.ink500, 0.8)} strokeWidth={2} />
    </g>
  );
}

/**
 * A tap at the end of a drop at (x, y): body, handle (turns a quarter when it
 * closes) and spout, drawn small and scaled by TAP_S around (x, y). The stream
 * runs from the spout tip down to `bottom`, and stops from the top as it closes.
 */
function Tap({ x, y, closed, frame, bottom, tone = C.muted, water = true }: { x: number; y: number; closed: number; frame: number; bottom?: number; tone?: string; water?: boolean }) {
  const handleAngle = (1 - closed) * 90;
  const tipX = x + SPOUT.dx;
  const tipY = y + SPOUT.dy;
  const end = bottom ?? tipY + 40;
  const top = tipY + (end - tipY) * closed;
  return (
    <g>
      {water && closed < 0.999 ? (
        <g>
          <rect x={tipX - 5} y={top} width={10} height={Math.max(0, end - top)} rx={5} fill={alpha(C.sky, 0.6)} />
          <line x1={tipX} y1={top} x2={tipX} y2={end} stroke={alpha('#e0f2fe', 0.85)} strokeWidth={3} strokeDasharray="7 10" strokeDashoffset={-frame * 3} />
        </g>
      ) : null}
      <g transform={`translate(${x} ${y}) scale(${TAP_S}) translate(${-x} ${-y})`}>
        {/* spout */}
        <path d={`M ${x - 4} ${y + 10} L ${x - 20} ${y + 10} Q ${x - 26} ${y + 10} ${x - 26} ${y + 20}`} fill="none" stroke={tone} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        {/* body */}
        <rect x={x - 11} y={y - 2} width={22} height={18} rx={5} fill={C.ink600} stroke={tone} strokeWidth={3} />
        {/* handle: stem + bar */}
        <line x1={x + 4} y1={y - 2} x2={x + 4} y2={y - 10} stroke={tone} strokeWidth={4} strokeLinecap="round" />
        <g transform={`rotate(${handleAngle} ${x + 4} ${y - 12})`}>
          <line x1={x - 10} y1={y - 12} x2={x + 18} y2={y - 12} stroke={tone} strokeWidth={6} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

function BypassPipe({ uid, b, p, glow }: { uid: string; b: (typeof BYPASS)[number]; p: number; glow: number }) {
  const d = `M ${b.branchX} ${MAIN_Y} L ${b.branchX} ${b.y} L ${b.x} ${b.y} L ${b.x} ${BYPASS_TAP_Y}`;
  const tap = progress(p, 0.8, 0.2);
  return (
    <g style={{ filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(10 * glow)}px ${alpha(C.amber, 0.8 * glow)})` : undefined }}>
      <defs>
        <mask id={`m${uid}`} maskUnits="userSpaceOnUse" x={-20} y={0} width={VB_W + 40} height={VB_H + 20}>
          <path d={d} fill="none" stroke="#ffffff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
        </mask>
      </defs>
      <g mask={`url(#m${uid})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} stroke={alpha(C.amber, 0.18)} strokeWidth={11} />
        <path d={d} stroke={C.amber} strokeWidth={5} strokeDasharray="12 10" />
      </g>
      {/* its tap: amber outline, no water shown (nobody measures it) */}
      {tap > 0.001 ? (
        <g opacity={tap}>
          <rect x={b.x + SPOUT.dx - 22} y={FLOOR - 16} width={44} height={16} rx={3} fill="none" stroke={alpha(C.amber, 0.7)} strokeWidth={2.5} strokeDasharray="5 4" />
          <Tap x={b.x} y={BYPASS_TAP_Y} closed={1} frame={0} tone={C.amber} water={false} />
        </g>
      ) : null}
    </g>
  );
}

/** The meter face: emerald bezel, ticks, a turning needle and the small leak-indicator star. */
function Dial({ cx, cy, r, angle, glow }: { cx: number; cy: number; r: number; angle: number; glow: number }) {
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
  const starR = r * 0.22;
  const starCy = cy + r * 0.46;
  return (
    <g style={{ filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(C.emerald, 0.85 * glow)})` : undefined }}>
      {glow > 0.01 ? <circle cx={cx} cy={cy} r={r + 12} fill="none" stroke={alpha(C.emerald, 0.45 * glow)} strokeWidth={4} /> : null}
      <circle cx={cx} cy={cy} r={r + 5} fill={C.ink700} stroke={C.emerald} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={r - 3} fill={C.ink950} />
      {ticks.map((a) => {
        const rad = (a * Math.PI) / 180;
        const r1 = r - 8;
        const r2 = a % 90 === 0 ? r - 17 : r - 13;
        return (
          <line
            key={a}
            x1={cx + r1 * Math.sin(rad)}
            y1={cy - r1 * Math.cos(rad)}
            x2={cx + r2 * Math.sin(rad)}
            y2={cy - r2 * Math.cos(rad)}
            stroke={alpha(C.emerald, 0.7)}
            strokeWidth={a % 90 === 0 ? 3 : 2}
            strokeLinecap="round"
          />
        );
      })}
      {/* leak-indicator star, turning twice as fast */}
      <g transform={`rotate(${angle * 2} ${cx} ${starCy})`}>
        {[0, 60, 120].map((a) => (
          <line
            key={a}
            x1={cx - starR * Math.cos((a * Math.PI) / 180)}
            y1={starCy - starR * Math.sin((a * Math.PI) / 180)}
            x2={cx + starR * Math.cos((a * Math.PI) / 180)}
            y2={starCy + starR * Math.sin((a * Math.PI) / 180)}
            stroke={alpha('#6ee7b7', 0.85)}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ))}
      </g>
      {/* needle */}
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        <path d={`M ${cx - 4} ${cy + 8} L ${cx} ${cy - r + 12} L ${cx + 4} ${cy + 8} Z`} fill="#6ee7b7" />
      </g>
      <circle cx={cx} cy={cy} r={5} fill={C.emerald} />
    </g>
  );
}

/**
 * The same dial on its own (the concept's icon): `size` is the outer diameter
 * in px. Same `spin` / `spinFrom` / `glow` semantics as Meter.
 */
export function MeterDial({ size = 120, spin, spinFrom = 0, glow = 0, frame: frameProp, style }: { size?: number; spin?: number | boolean; spinFrom?: number; glow?: number; frame?: number; style?: CSSProperties }) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const r = 44;
  const box = 2 * (r + 18);
  return (
    <svg width={size} height={size} viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} style={{ display: 'block', overflow: 'visible', ...style }}>
      <Dial cx={0} cy={0} r={r} angle={(frame - spinFrom) * DEG_PER_FRAME * rateOf(spin)} glow={clamp01(glow)} />
    </svg>
  );
}
