import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, tone as toneOf, type IconName, type Tone } from '../../../../engine/src/ui';

/**
 * The two ways to test a plan (concept 1) — one image each, identical wherever
 * it appears (s01 promise icons, s02 side by side, s03 the drill again, s06
 * rule-card art, the poster).
 *
 *   MesaArt  «la mesa» (tabletop exercise, tone sky): a meeting table seen
 *            slightly from above, six seated people, one of them holding up a
 *            script (a sheet with lines). Nothing technical on the table.
 *   DrillArt «el simulacro» (simulation, tone amber): a fire drill — a wall
 *            alarm bell with sound rings, a figure running out of an exit
 *            door, a stopwatch.
 *
 * Props API (stable — other scenes and the poster import it):
 *   width     px width of the art (default 400); height = width × 3/4
 *             (`twoWaysSize(width)`). Both arts share the same 400×300 box.
 *   act       0–1 animation weight. Mesa: the script is raised and two small
 *             speech bubbles show (people talk). Drill: the bell shakes and
 *             rings, the runner heads for the door, the stopwatch hand runs.
 *   glow      0–1 halo and brighter edges in the art's tone.
 *   dim       0–1 step-back (≈40 % opacity, half saturation).
 *   show      0–1 appear (opacity). Default 1.
 *   backdrop  draw the rounded tile behind the art (default true). The same
 *             tile is exported as `ArtFrame` (e.g. s01's magnifier tile).
 *   frame     Sequence-relative frame (default useCurrentFrame()).
 *   style     extra style on the wrapper (do not pass `transform` if you
 *             animate the wrapper yourself — wrap it in your own div).
 *
 * Helpers: `twoWaysSize(width)` → { width, height };
 * `twoWaysAnchors(width)` → px points from the art's top-left
 *   mesa:  { script (raised sheet centre), table (table centre) }
 *   drill: { bell, door, watch }
 * `WAY_TONE` = { mesa: 'sky', drill: 'amber' }; `WayChip` = a pill label in
 * any Tone (the engine Chip has no sky).
 */

const VB_W = 400;
const VB_H = 300;

export const WAY_TONE = { mesa: 'sky', drill: 'amber' } as const satisfies Record<string, Tone>;

export interface TwoWaysArtProps {
  width?: number;
  act?: number;
  glow?: number;
  dim?: number;
  show?: number;
  backdrop?: boolean;
  frame?: number;
  style?: CSSProperties;
}

export function twoWaysSize(width = VB_W): { width: number; height: number } {
  return { width, height: (width * VB_H) / VB_W };
}

export function twoWaysAnchors(width = VB_W) {
  const s = width / VB_W;
  const p = (x: number, y: number) => ({ x: x * s, y: y * s });
  return {
    mesa: { script: p(MESA.scriptUp.x, MESA.scriptUp.y), table: p(200, 196) },
    drill: { bell: p(DRILL.bell.x, DRILL.bell.y), door: p(308, 190), watch: p(DRILL.watch.x, DRILL.watch.y) },
  };
}

// ---------------------------------------------------------------------------
// The tile both arts sit on
// ---------------------------------------------------------------------------

/** The rounded tile of the two arts, in a Tone; children are centred on it. */
export function ArtFrame({
  width = VB_W,
  height,
  tone = 'sky',
  glow = 0,
  dim = 0,
  show = 1,
  backdrop = true,
  children,
  style,
}: {
  width?: number;
  /** Defaults to the arts' 3/4 ratio. */
  height?: number;
  tone?: Tone;
  glow?: number;
  dim?: number;
  show?: number;
  backdrop?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  const s = width / VB_W;
  const h = height ?? twoWaysSize(width).height;
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: Math.max(10, 28 * s),
        border: backdrop ? `${Math.max(2, Math.round(3 * s))}px solid ${alpha(t.fg, 0.3 + 0.55 * g)}` : undefined,
        background: backdrop ? `linear-gradient(180deg, ${alpha(t.fg, 0.07 + 0.08 * g)} 0%, ${alpha(C.ink900, 0.94)} 72%)` : undefined,
        boxShadow: backdrop && g > 0.01 ? `0 0 ${Math.round(60 * g * Math.max(0.5, s))}px ${alpha(t.fg, 0.32 * g)}` : undefined,
        overflow: 'hidden',
        ...dimStyle(dim, clamp01(show)),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MesaArt — the tabletop exercise
// ---------------------------------------------------------------------------

const MESA = {
  table: { cx: 200, cy: 196, rx: 156, ry: 50 },
  back: [128, 200, 272],
  headY: 94,
  scriptRest: { x: 244, y: 138 },
  scriptUp: { x: 244, y: 56 },
} as const;

const BODY = C.ink600;
const HEAD = C.ink500;
const PAPER = '#eaf6fd';

/** A seated person seen from the front (or the back): head + rounded shoulders. */
function Person({ x, headY, r = 17, shoulders = 30, depth = 80 }: { x: number; headY: number; r?: number; shoulders?: number; depth?: number }) {
  const top = headY + r + 3;
  return (
    <g>
      <path d={`M ${x - shoulders} ${top + depth} L ${x - shoulders} ${top + 18} Q ${x - shoulders} ${top} ${x} ${top} Q ${x + shoulders} ${top} ${x + shoulders} ${top + 18} L ${x + shoulders} ${top + depth} Z`} fill={BODY} />
      <circle cx={x} cy={headY} r={r} fill={HEAD} />
    </g>
  );
}

/** A small sheet with lines (the script), centred on (0, 0). */
function Sheet({ w = 46, h = 58, lines = 4, stroke }: { w?: number; h?: number; lines?: number; stroke: string }) {
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={4} fill={PAPER} stroke={stroke} strokeWidth={2.5} />
      {Array.from({ length: lines }, (_, i) => (
        <line key={i} x1={-w / 2 + 8} x2={w / 2 - (i === lines - 1 ? 18 : 8)} y1={-h / 2 + 13 + i * ((h - 22) / (lines - 1))} y2={-h / 2 + 13 + i * ((h - 22) / (lines - 1))} stroke={stroke} strokeWidth={3} strokeLinecap="round" />
      ))}
    </g>
  );
}

function Bubble({ x, y, flip = false, stroke, o }: { x: number; y: number; flip?: boolean; stroke: string; o: number }) {
  if (o <= 0.001) return null;
  const w = 58;
  const h = 34;
  const tail = flip ? `M ${w - 16} ${h} L ${w - 8} ${h + 12} L ${w - 26} ${h}` : `M 16 ${h} L 8 ${h + 12} L 26 ${h}`;
  return (
    <g transform={`translate(${x} ${y + (1 - o) * 6})`} opacity={o}>
      <rect x={0} y={0} width={w} height={h} rx={12} fill={alpha(C.ink950, 0.9)} stroke={stroke} strokeWidth={2.5} />
      <path d={tail} fill={alpha(C.ink950, 0.9)} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
      <line x1={12} x2={w - 12} y1={13} y2={13} stroke={stroke} strokeWidth={3} strokeLinecap="round" />
      <line x1={12} x2={w - 24} y1={23} y2={23} stroke={stroke} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

export function MesaArt(props: TwoWaysArtProps) {
  const width = props.width ?? VB_W;
  const { height } = twoWaysSize(width);
  const t = toneOf(WAY_TONE.mesa);
  const act = clamp01(props.act ?? 0);
  const glow = clamp01(props.glow ?? 0);
  const { table } = MESA;
  const edge = alpha(t.fg, 0.55 + 0.4 * glow);
  const sx = MESA.scriptRest.x + (MESA.scriptUp.x - MESA.scriptRest.x) * act;
  const sy = MESA.scriptRest.y + (MESA.scriptUp.y - MESA.scriptRest.y) * act;
  const shoulder = { x: MESA.back[1] + 18, y: MESA.headY + 30 };
  return (
    <ArtFrame width={width} tone={t.fg} glow={glow} dim={props.dim} show={props.show} backdrop={props.backdrop ?? true} style={props.style}>
      <svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}>
        {/* Back row and the two ends: bodies disappear behind the table */}
        {MESA.back.map((x) => (
          <Person key={x} x={x} headY={MESA.headY} />
        ))}
        <Person x={36} headY={150} r={16} shoulders={26} />
        <Person x={364} headY={150} r={16} shoulders={26} />

        {/* The table: floor shadow, edge, top */}
        <ellipse cx={table.cx} cy={table.cy + 42} rx={table.rx + 6} ry={table.ry * 0.55} fill={alpha(C.ink950, 0.55)} />
        <ellipse cx={table.cx} cy={table.cy + 14} rx={table.rx} ry={table.ry} fill={C.ink800} stroke={alpha(t.fg, 0.3)} strokeWidth={2} />
        <ellipse cx={table.cx} cy={table.cy} rx={table.rx} ry={table.ry} fill={C.ink700} />
        <ellipse cx={table.cx} cy={table.cy} rx={table.rx} ry={table.ry} fill={alpha(t.fg, 0.1 + 0.08 * glow)} stroke={edge} strokeWidth={3.5} />

        {/* Paper on the table (no laptops, no screens: it touches no system) */}
        {[
          { x: 138, y: 196, r: -14 },
          { x: 214, y: 214, r: 8 },
          { x: 286, y: 192, r: 16 },
        ].map((p) => (
          <g key={p.x} transform={`translate(${p.x} ${p.y}) rotate(${p.r}) scale(1 0.5)`}>
            <Sheet w={40} h={50} lines={3} stroke={alpha(t.fg, 0.6)} />
          </g>
        ))}

        {/* The one holding the script: arm, then the sheet */}
        <line x1={shoulder.x} y1={shoulder.y} x2={sx - 14} y2={sy + 24} stroke={HEAD} strokeWidth={13} strokeLinecap="round" />
        <circle cx={sx - 14} cy={sy + 24} r={8} fill={HEAD} />
        <g transform={`translate(${sx} ${sy}) rotate(${-8 * act}) scale(${1 + 0.14 * act})`} style={{ filter: act > 0.05 ? `drop-shadow(0 0 ${6 + 8 * glow}px ${alpha(t.fg, 0.5 * act)})` : undefined }}>
          <Sheet stroke={t.fg} />
        </g>

        {/* Front: one person seen from the back */}
        <Person x={96} headY={262} r={18} shoulders={34} depth={60} />

        {/* People talk: the only thing that happens at this table */}
        <Bubble x={40} y={58} stroke={alpha(t.fg, 0.85)} o={progress(act, 0.35, 0.4, EASE.out)} />
        <Bubble x={296} y={46} flip stroke={alpha(t.fg, 0.85)} o={progress(act, 0.55, 0.4, EASE.out)} />
      </svg>
    </ArtFrame>
  );
}

// ---------------------------------------------------------------------------
// DrillArt — the fire drill
// ---------------------------------------------------------------------------

const DRILL = {
  bell: { x: 92, y: 84 },
  watch: { x: 98, y: 214 },
  floor: 266,
} as const;

export function DrillArt(props: TwoWaysArtProps) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = props.frame ?? current;
  const width = props.width ?? VB_W;
  const { height } = twoWaysSize(width);
  const t = toneOf(WAY_TONE.drill);
  const act = clamp01(props.act ?? 0);
  const glow = clamp01(props.glow ?? 0);
  const sec = frame / fps;

  // Bell: a gentle shake (≤ 1.3 Hz, small angle) and rings that travel out.
  const shake = Math.sin(2 * Math.PI * 1.3 * sec) * 5 * act;
  const rings = [0, 0.5].map((k) => ((sec * 0.8 + k) % 1 + 1) % 1);

  // Runner: heads for the door as `act` grows; legs swing while running.
  const runX = 196 + 40 * act;
  const swing = Math.sin(2 * Math.PI * 1.2 * sec) * act;

  // Stopwatch hand: a steady sweep while the drill runs.
  const hand = act * (40 + 90 * sec);

  const { bell, watch, floor } = DRILL;
  const edge = alpha(t.fg, 0.55 + 0.4 * glow);
  return (
    <ArtFrame width={width} tone={t.fg} glow={glow} dim={props.dim} show={props.show} backdrop={props.backdrop ?? true} style={props.style}>
      <svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}>
        {/* Floor */}
        <line x1={18} y1={floor} x2={382} y2={floor} stroke={C.ink600} strokeWidth={4} strokeLinecap="round" />

        {/* Exit door, open: dark opening, the leaf swung out */}
        <rect x={268} y={112} width={80} height={floor - 112} fill={C.ink950} stroke={C.ink500} strokeWidth={4} />
        <path d={`M 348 112 L 378 124 L 378 ${floor - 6} L 348 ${floor}`} fill={C.ink700} stroke={C.ink500} strokeWidth={3} strokeLinejoin="round" />
        <rect x={276} y={86} width={64} height={18} rx={4} fill={alpha(t.fg, 0.2 + 0.2 * glow)} stroke={edge} strokeWidth={2.5} />
        <path d="M 300 95 L 316 95 M 310 90 L 316 95 L 310 100" fill="none" stroke={t.soft} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {/* Someone already going through */}
        <g opacity={0.9}>
          <circle cx={300} cy={160} r={11} fill={alpha(t.fg, 0.55)} />
          <path d={`M 300 172 L 296 210 M 296 210 L 286 ${floor - 4} M 296 210 L 306 ${floor - 4}`} stroke={alpha(t.fg, 0.55)} strokeWidth={9} strokeLinecap="round" fill="none" />
        </g>

        {/* The runner (exit-sign pictogram) */}
        <g transform={`translate(${runX} 0)`}>
          <circle cx={0} cy={150} r={15} fill={t.soft} />
          <path
            d={`M -4 168 L -12 214 M -8 186 L ${16 + 6 * swing} ${176 - 4 * swing} M -8 186 L ${-30 - 4 * swing} ${196 + 6 * swing} M -12 214 L ${10 + 10 * swing} ${238} L ${14 + 12 * swing} ${floor - 2} M -12 214 L ${-28 - 10 * swing} ${240} L ${-44 - 8 * swing} ${floor - 10}`}
            stroke={t.soft}
            strokeWidth={11}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Alarm bell on the wall */}
        {rings.map((ph, i) => {
          const o = (1 - ph) * act;
          if (o <= 0.01) return null;
          const r = 54 + 34 * ph;
          const arc = (a0: number, a1: number) => {
            const rad = (d: number) => (d * Math.PI) / 180;
            return `M ${bell.x + r * Math.cos(rad(a0))} ${bell.y + r * Math.sin(rad(a0))} A ${r} ${r} 0 0 1 ${bell.x + r * Math.cos(rad(a1))} ${bell.y + r * Math.sin(rad(a1))}`;
          };
          return (
            <g key={i} opacity={o} stroke={t.fg} strokeWidth={5} strokeLinecap="round" fill="none">
              <path d={arc(-38, 38)} />
              <path d={arc(142, 218)} />
            </g>
          );
        })}
        <rect x={bell.x - 8} y={bell.y - 58} width={16} height={18} rx={3} fill={C.ink600} />
        <g transform={`rotate(${shake} ${bell.x} ${bell.y - 40})`}>
          <circle cx={bell.x} cy={bell.y} r={42} fill={t.fg} stroke={alpha(t.deep, 0.9)} strokeWidth={3} />
          <circle cx={bell.x} cy={bell.y} r={30} fill="none" stroke={alpha(t.deep, 0.55)} strokeWidth={4} />
          <circle cx={bell.x} cy={bell.y} r={9} fill={t.deep} />
          <line x1={bell.x} y1={bell.y + 42} x2={bell.x} y2={bell.y + 54} stroke={C.ink500} strokeWidth={5} strokeLinecap="round" />
        </g>

        {/* Stopwatch */}
        <g>
          <rect x={watch.x - 9} y={watch.y - 52} width={18} height={12} rx={3} fill={C.ink500} />
          <line x1={watch.x + 30} y1={watch.y - 30} x2={watch.x + 38} y2={watch.y - 38} stroke={C.ink500} strokeWidth={7} strokeLinecap="round" />
          <circle cx={watch.x} cy={watch.y} r={40} fill={C.ink800} stroke={edge} strokeWidth={5} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r0 = i % 3 === 0 ? 26 : 30;
            return <line key={i} x1={watch.x + Math.sin(a) * r0} y1={watch.y - Math.cos(a) * r0} x2={watch.x + Math.sin(a) * 34} y2={watch.y - Math.cos(a) * 34} stroke={i % 3 === 0 ? C.text : C.muted} strokeWidth={i % 3 === 0 ? 3.5 : 2} strokeLinecap="round" />;
          })}
          <line
            x1={watch.x}
            y1={watch.y}
            x2={watch.x + Math.sin((hand * Math.PI) / 180) * 28}
            y2={watch.y - Math.cos((hand * Math.PI) / 180) * 28}
            stroke={t.fg}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <circle cx={watch.x} cy={watch.y} r={5} fill={t.fg} />
        </g>
      </svg>
    </ArtFrame>
  );
}

// ---------------------------------------------------------------------------
// A pill label in any Tone (the engine Chip only takes theme accents)
// ---------------------------------------------------------------------------

export function WayChip({
  children,
  tone = 'sky',
  icon,
  size = 34,
  solid = false,
  style,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: IconName;
  size?: number;
  solid?: boolean;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.35),
        padding: `${Math.round(size * 0.32)}px ${Math.round(size * 0.62)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(t.fg, solid ? 0.9 : 0.6)}`,
        background: solid ? t.fg : alpha(t.fg, 0.12),
        color: solid ? C.ink950 : t.soft,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={solid ? C.ink950 : t.fg} /> : null}
      {children}
    </span>
  );
}
