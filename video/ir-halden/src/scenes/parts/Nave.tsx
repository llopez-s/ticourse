import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { pulse } from '../../../../engine/src/theme/motion';
import { clamp01, dimStyle, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * A port warehouse («nave») in flat vector style: gabled shed, a bi-parting
 * sliding door, a small gable window, a number plate over the door and
 * optional contents (seen only through the open door). Used for the three
 * hosts of s04, the search of s06 and the backup «photo» of s07.
 *
 * All states are 0–1 weights (drive them with progress() in the scene), so a
 * scene can play any transition forwards or backwards:
 *   door locked  = `lock: 1` (door closed, cyan padlock on the seam)
 *   door open    = `open: 1` (leaves slid aside, dark interior)
 *   window bricked = `bricked: 1` (emerald bricks fill it, bottom row first)
 * The art is drawn in a 400×330 design space scaled to `width`; the label and
 * sub sit under it at fixed, readable sizes.
 */

const VB_W = 400;
const VB_H = 330;

export type NaveContents = 'keys' | 'crates' | 'none';

export interface NaveProps {
  /** Width of the art in px (default 320); height = width × 330/400, plus the labels. */
  width?: number;
  /** 0 closed … 1 door slid fully open (interior visible). */
  open?: number;
  /** 0–1: padlock drops onto the closed door (cyan = contained). */
  lock?: number;
  /** 0 open window … 1 bricked up (emerald). */
  bricked?: number;
  /** What is inside (visible through the open door). Default 'none'. */
  contents?: NaveContents;
  /** 0–1: the master key (the brighter one) leaves the rack. Fly your own copy with NaveKey + naveAnchors().key. */
  keyTaken?: number;
  /** 0–1: the intruder (rose silhouette) is inside. */
  intruder?: number;
  /** 0–1: the intruder slips behind the front crate (only the top of the head peeks). Needs contents 'crates'. */
  intruderHidden?: number;
  /** Text on the number plate over the door (short, e.g. «3»). Omitted: a blank plate. */
  plate?: string;
  /** Host name under the art (mono). */
  label?: string;
  /** Role under the host name (sans). */
  sub?: string;
  /** Colour of the label (default text). */
  labelTone?: Tone;
  /** 0–1 outline glow around the shed. */
  glow?: number;
  glowTone?: Tone;
  /** 0–1 step-back (40 % opacity, half saturation). */
  dim?: number;
  /** 0–1: the nave appears (fade + rise). Default 1. */
  show?: number;
  frame?: number;
  style?: CSSProperties;
}

/** Size of a nave drawn at `width` (the art; the labels add ~80 px below). */
export function naveSize(width = 320): { width: number; height: number; labelTop: number } {
  const s = width / VB_W;
  return { width, height: VB_H * s, labelTop: VB_H * s + 12 };
}

/**
 * Points of a nave drawn at `width`, in px from its top-left corner: the
 * master key on the rack, the door centre, the padlock, the window, the plate
 * and the middle of the ground line. Add the nave's own left/top.
 */
export function naveAnchors(width = 320) {
  const s = width / VB_W;
  const P = (x: number, y: number) => ({ x: x * s, y: y * s });
  return {
    key: P(KEY_X[MASTER], RACK.y + 30),
    door: P(200, 250),
    lock: P(200, 252),
    window: P(WIN.x + WIN.w / 2, WIN.y + WIN.h / 2),
    plate: P(200, PLATE.y + PLATE.h / 2),
    ground: P(200, GROUND),
  };
}

// Design-space geometry.
const GROUND = 320;
const BODY = { x: 26, y: 140, w: 348, h: GROUND - 140 };
const DOOR = { x: 120, y: 182, w: 160, h: GROUND - 182 };
const WIN = { x: 170, y: 88, w: 60, h: 40 };
const PLATE = { x: 168, y: 148, w: 64, h: 26 };
const RACK = { x: 144, y: 198, w: 112, h: 20 };
const KEY_X = [158, 179, 200, 221, 242];
const MASTER = 2;

/** The amber master key, hanging ring-up (the same glyph as on the rack). `size` is its height in px. */
export function NaveKey({ size = 60, color = C.amber, glow = 0, style }: { size?: number; color?: string; glow?: number; style?: CSSProperties }) {
  return (
    <svg
      width={size * (16 / 38)}
      height={size}
      viewBox="-8 -8 16 38"
      style={{ overflow: 'visible', filter: glow > 0.02 ? `drop-shadow(0 0 ${6 + 10 * glow}px ${alpha(color, 0.8 * glow)})` : undefined, ...style }}
    >
      <KeyShape color={color} />
    </svg>
  );
}

/** Key in its own units: ring centred on (0, 0), shaft down to y 28, teeth on the right. */
function KeyShape({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <circle cx={0} cy={0} r={5.5} fill="none" stroke={color} strokeWidth={3} />
      <line x1={0} y1={5.5} x2={0} y2={28} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <path d="M 0 20 L 5 20 M 0 25.5 L 4 25.5" stroke={color} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

export function Nave({
  width = 320,
  open = 0,
  lock = 0,
  bricked = 0,
  contents = 'none',
  keyTaken = 0,
  intruder = 0,
  intruderHidden = 0,
  plate,
  label,
  sub,
  labelTone,
  glow = 0,
  glowTone = 'cyan',
  dim = 0,
  show = 1,
  frame: frameProp,
  style,
}: NaveProps) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const s = width / VB_W;
  const o = clamp01(open);
  const lk = clamp01(lock);
  const br = clamp01(bricked);
  const g = clamp01(glow);
  const gt = toneOf(glowTone);
  const sh = clamp01(show);
  const leaf = DOOR.w / 2;
  const slide = leaf * o;
  const clipId = `nave-door-${Math.round(width)}-${label ?? 'x'}`.replace(/[^\w-]/g, '');

  return (
    <div style={{ position: 'relative', width, ...dimStyle(dim, sh), transform: sh < 1 ? `translateY(${(1 - sh) * 20}px)` : undefined, ...style }}>
      <svg width={width} height={VB_H * s} viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={clipId}>
            <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} />
          </clipPath>
        </defs>
        {/* Ground shadow */}
        <ellipse cx={200} cy={GROUND + 3} rx={196} ry={7} fill={alpha('#000000', 0.35)} />

        {/* Glow outline */}
        {g > 0.01 ? (
          <path
            d={`M ${BODY.x} ${GROUND} L ${BODY.x} ${BODY.y} L 14 ${BODY.y} L 200 52 L 386 ${BODY.y} L ${BODY.x + BODY.w} ${BODY.y} L ${BODY.x + BODY.w} ${GROUND} Z`}
            fill="none"
            stroke={gt.fg}
            strokeWidth={5}
            strokeLinejoin="round"
            opacity={g}
            style={{ filter: `drop-shadow(0 0 10px ${alpha(gt.fg, 0.8)})` }}
          />
        ) : null}

        {/* Walls with cladding */}
        <rect x={BODY.x} y={BODY.y} width={BODY.w} height={BODY.h} fill={C.ink800} stroke={C.ink500} strokeWidth={3} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={BODY.x + 2} x2={BODY.x + BODY.w - 2} y1={BODY.y + 20 + i * 24} y2={BODY.y + 20 + i * 24} stroke={C.ink700} strokeWidth={2} />
        ))}

        {/* Roof */}
        <path d={`M 14 ${BODY.y} L 200 52 L 386 ${BODY.y} Z`} fill={C.ink700} stroke={C.ink500} strokeWidth={3} strokeLinejoin="round" />
        {[-2, -1, 0, 1, 2].map((i) => (
          <line key={i} x1={200 + i * 44} y1={BODY.y - 4} x2={200 + i * 16} y2={70} stroke={alpha(C.ink500, 0.45)} strokeWidth={2} />
        ))}

        {/* Gable window: dark glass, or bricked up row by row */}
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={3} fill={C.ink950} stroke={C.ink500} strokeWidth={3} />
        <line x1={WIN.x + 10} y1={WIN.y + WIN.h - 8} x2={WIN.x + 26} y2={WIN.y + 8} stroke={alpha(C.cyanSoft, 0.35 * (1 - br))} strokeWidth={3} strokeLinecap="round" />
        {[0, 1, 2].map((row) => {
          const p = clamp01(br * 3 - row);
          if (p <= 0) return null;
          const h = (WIN.h - 6) / 3;
          const y = WIN.y + WIN.h - 3 - (row + 1) * h;
          const bricks = row % 2 ? [WIN.x + 3, WIN.x + 3 + 10, WIN.x + 3 + 30] : [WIN.x + 3, WIN.x + 23, WIN.x + 43];
          const widths = row % 2 ? [8, 18, 24] : [18, 18, 14];
          return (
            <g key={row} opacity={p} transform={`translate(0 ${(1 - p) * -6})`}>
              {bricks.map((bx, i) => (
                <rect key={i} x={bx} y={y + 1} width={widths[i]} height={h - 2} rx={1.5} fill={alpha(C.emerald, 0.45)} stroke={C.emerald} strokeWidth={1.5} />
              ))}
            </g>
          );
        })}

        {/* Number plate */}
        <rect x={PLATE.x} y={PLATE.y} width={PLATE.w} height={PLATE.h} rx={5} fill={C.ink900} stroke={alpha(C.muted, 0.7)} strokeWidth={2} />
        {plate ? (
          <text x={200} y={PLATE.y + PLATE.h / 2 + 7} textAnchor="middle" fontFamily={FONT.mono} fontSize={20} fontWeight={800} fill={C.text}>
            {plate}
          </text>
        ) : (
          <rect x={184} y={PLATE.y + 10} width={32} height={6} rx={3} fill={alpha(C.muted, 0.4)} />
        )}

        {/* Interior (only what the open door uncovers) */}
        <g clipPath={`url(#${clipId})`}>
          <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill={C.ink950} />
          <rect x={DOOR.x} y={GROUND - 10} width={DOOR.w} height={10} fill={alpha(C.ink700, 0.6)} />
          {contents === 'keys' ? <KeyRack taken={clamp01(keyTaken)} frame={frame} fps={fps} /> : null}
          {contents === 'crates' ? <BackCrates /> : null}
          {intruder > 0 ? <Intruder show={clamp01(intruder)} hidden={contents === 'crates' ? clamp01(intruderHidden) : 0} frame={frame} fps={fps} /> : null}
          {contents === 'crates' ? <Crate x={192} y={272} w={76} h={48} /> : null}
        </g>

        {/* Door rail and the two leaves */}
        <line x1={BODY.x + 8} y1={DOOR.y - 5} x2={BODY.x + BODY.w - 8} y2={DOOR.y - 5} stroke={C.ink500} strokeWidth={4} strokeLinecap="round" />
        <DoorLeaf x={DOOR.x - slide} side="left" />
        <DoorLeaf x={DOOR.x + leaf + slide} side="right" />

        {/* Padlock on the seam (only on a closed door) */}
        {lk > 0.01 ? <Padlock p={lk} fade={1 - o} /> : null}
      </svg>

      {label || sub ? (
        <div style={{ position: 'absolute', left: '50%', top: VB_H * s + 12, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
          {label ? (
            <div style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, color: labelTone ? toneOf(labelTone).soft : C.textStrong, lineHeight: 1.2 }}>{label}</div>
          ) : null}
          {sub ? <div style={{ fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, color: C.muted, lineHeight: 1.25, marginTop: 2 }}>{sub}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

function DoorLeaf({ x, side }: { x: number; side: 'left' | 'right' }) {
  const w = DOOR.w / 2;
  const handleX = side === 'left' ? x + w - 12 : x + 12;
  return (
    <g>
      <rect x={x} y={DOOR.y} width={w} height={DOOR.h} fill={C.ink600} stroke={C.ink500} strokeWidth={3} />
      {[1, 2, 3, 4].map((i) => (
        <line key={i} x1={x + (w / 5) * i} y1={DOOR.y + 6} x2={x + (w / 5) * i} y2={GROUND - 6} stroke={alpha(C.ink800, 0.9)} strokeWidth={2} />
      ))}
      <line x1={x + 4} y1={DOOR.y + DOOR.h * 0.42} x2={x + w - 4} y2={DOOR.y + DOOR.h * 0.42} stroke={alpha(C.ink800, 0.9)} strokeWidth={3} />
      <rect x={handleX - 3} y={DOOR.y + 58} width={6} height={26} rx={3} fill={C.ink500} />
      <circle cx={x + w / 2} cy={DOOR.y - 5} r={4} fill={C.ink500} />
    </g>
  );
}

function Padlock({ p, fade }: { p: number; fade: number }) {
  const drop = (1 - p) * -26;
  const cx = 200;
  const cy = 252 + drop;
  return (
    <g opacity={Math.min(1, p * 1.6) * clamp01(fade)} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.7)})` }}>
      {/* hasp plates on both leaves */}
      <rect x={cx - 22} y={238} width={16} height={10} rx={2} fill={C.cyanDeep} />
      <rect x={cx + 6} y={238} width={16} height={10} rx={2} fill={C.cyanDeep} />
      <path d={`M ${cx - 10} ${cy - 4} L ${cx - 10} ${cy - 14} A 10 10 0 0 1 ${cx + 10} ${cy - 14} L ${cx + 10} ${cy - 4}`} fill="none" stroke={C.cyanSoft} strokeWidth={5} strokeLinecap="round" />
      <rect x={cx - 17} y={cy - 5} width={34} height={28} rx={5} fill={C.cyan} />
      <circle cx={cx} cy={cy + 6} r={3.5} fill={C.ink950} />
      <rect x={cx - 1.5} y={cy + 7} width={3} height={8} rx={1.5} fill={C.ink950} />
    </g>
  );
}

function KeyRack({ taken, frame, fps }: { taken: number; frame: number; fps: number }) {
  const shimmer = 0.75 + 0.25 * pulse(frame, fps, 0.5);
  return (
    <g>
      <rect x={RACK.x} y={RACK.y} width={RACK.w} height={RACK.h} rx={3} fill={C.ink700} stroke={C.ink600} strokeWidth={2} />
      {KEY_X.map((kx, i) => {
        const master = i === MASTER;
        const hookY = RACK.y + RACK.h - 2;
        const lift = master ? taken * -30 : 0;
        const alphaKey = master ? 1 - taken : 1;
        return (
          <g key={i}>
            <line x1={kx} y1={RACK.y + 8} x2={kx} y2={hookY + 3} stroke={C.muted} strokeWidth={2.5} strokeLinecap="round" />
            {alphaKey > 0.01 ? (
              <g
                transform={`translate(${kx} ${hookY + 9 + lift})`}
                style={master ? { filter: `drop-shadow(0 0 6px ${alpha(C.amber, 0.9 * shimmer)})` } : undefined}
              >
                <KeyShape color={master ? C.amber : alpha(C.amber, 0.55)} opacity={alphaKey} />
              </g>
            ) : null}
          </g>
        );
      })}
      {/* A bench under the rack, so the room reads as a room */}
      <rect x={DOOR.x + 14} y={GROUND - 34} width={DOOR.w - 28} height={8} rx={2} fill={C.ink700} />
      <rect x={DOOR.x + 22} y={GROUND - 26} width={6} height={16} fill={C.ink700} />
      <rect x={DOOR.x + DOOR.w - 28} y={GROUND - 26} width={6} height={16} fill={C.ink700} />
    </g>
  );
}

function Crate({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill="#3a3f52" stroke={C.ink500} strokeWidth={2.5} />
      <line x1={x + 3} y1={y + 3} x2={x + w - 3} y2={y + h - 3} stroke={alpha(C.muted, 0.35)} strokeWidth={2.5} />
      <line x1={x + w - 3} y1={y + 3} x2={x + 3} y2={y + h - 3} stroke={alpha(C.muted, 0.35)} strokeWidth={2.5} />
      <rect x={x} y={y} width={w} height={7} fill={alpha(C.muted, 0.2)} />
    </g>
  );
}

function BackCrates() {
  return (
    <g>
      <Crate x={128} y={262} w={62} h={58} />
      <Crate x={134} y={224} w={50} h={38} />
      <Crate x={236} y={236} w={40} h={36} />
    </g>
  );
}

function Intruder({ show, hidden, frame, fps }: { show: number; hidden: number; frame: number; fps: number }) {
  // Visible: standing on the right of the room. Hidden: crouched behind the front crate, head top peeking.
  const x = 246 + (228 - 246) * hidden;
  const sink = 8 * hidden;
  const bob = 1.5 * pulse(frame, fps, 0.4);
  const feet = GROUND - 2 + sink;
  return (
    <g opacity={show} transform={`translate(${x} ${feet - bob})`} style={{ filter: `drop-shadow(0 0 6px ${alpha(C.rose, 0.7)})` }}>
      <path d="M -17 0 L -15 -30 Q -14 -40 0 -41 Q 14 -40 15 -30 L 17 0 Z" fill={C.rose} />
      <circle cx={0} cy={-52} r={11} fill={C.rose} />
      <rect x={-7} y={-55} width={14} height={4} rx={2} fill={C.roseDeep} />
    </g>
  );
}
