import { useId, type CSSProperties, type ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, mix, tone as toneOf, type Tone } from '../../../../engine/src/ui';
import { TrapBoxShape } from './TrapBox';

/**
 * «La casa y la caja trampa» — the Cyber Kill Chain as the thief's seven steps
 * (canon: out/scene-brief.md «Visual metaphors»). One house on a street (cyan:
 * Meridian) and seven vignettes, always in this order and always drawn the same:
 *
 *   reconnaissance  la acera ........ the thief on the sidewalk looking at the house
 *   weaponization   el taller ....... workbench behind a door; the device goes into a box
 *                                     that looks like something else (variant 'closed':
 *                                     only the shut door, light under it)
 *   delivery        la caja en la puerta . the closed parcel on the doormat
 *   exploitation    la caja abierta . a hand from inside opens it, the device lights up
 *                                     (variant 'dark': it rises and nothing lights)
 *   installation    la llave en la maceta . a key copy hidden under the flowerpot
 *   c2              «sigo aquí, ¿qué hago?» . the bubble from the device out to the thief
 *   actions         los planos ...... the thief walks off with rolled blueprints
 *                                     (variant 'safe': an open safe, plans still inside,
 *                                     the thief's hand on them)
 *
 * Exports
 * - `PHASES` / `PHASE_IDS` / `phaseIndex` — ids and exact names (`name`, the
 *   lesson's table), the slot split (`lines`) and the big upper-case entrance
 *   (`upper`, e.g. COMMAND & CONTROL — no «(C2)»).
 * - `Vignette` — one phase's drawing (240×200 design units, `VIGNETTE_BASE`),
 *   with a `VignetteLook` (show/act/lit/dim/grey/broken/blurred/empty/dashed/
 *   tone/wash/variant/pop). `framed={false}` drops the panel (a free illustration).
 * - `KillChain` — the slots in a row: vignettes, the chain rings between them
 *   (`links`), the names under them (`names`), numbered empty slots (`slots`).
 *   The ring right after a `broken` vignette opens by itself (emerald). Pass
 *   `ids` for a subset (e.g. the four observed phases); `links={0}` gives the
 *   compact «phase row» of the map (s06/s07/s08). `PhaseRow` = that preset.
 * - `killChainLayout(width, opts)` — PURE geometry (no hooks): slot rects, the
 *   name area, total height; use it to put alarms, markers, clocks on slots.
 * - `PhaseTitle` — the violet upper-case phase entrance + gloss line.
 * - `Lupa` — Weaponization's magnifier (engine Icon «search»), one fixed size
 *   and tone for s05, s06 and s10.
 * - `StreetHouse`, `Figure`, `PlansRoll` — the house, the faceless figure (the
 *   thief is rose; pass another `tone` for anyone else) and the blueprints,
 *   standalone.
 *
 * Colours: cyan = the house (Meridian), rose = the thief and the lit device,
 * emerald = a cut that holds (the broken link), sky = the street, grey = not
 * reached. Nothing reads the timeline (all 0–1 weights) and nothing positions
 * itself: wrap each piece in an absolutely positioned div. No V13 strings are
 * baked in except the phase names and the C2 bubble, which ARE the image.
 */

// =================================================================================================
// Phases

export type PhaseId = 'reconnaissance' | 'weaponization' | 'delivery' | 'exploitation' | 'installation' | 'c2' | 'actions';

export interface PhaseDef {
  id: PhaseId;
  /** Exact name, as in the lesson's table (`src/data/s2.ts:24-30`). */
  name: string;
  /** The name split for a slot (one or two lines). */
  lines: readonly string[];
  /** Big entrance form (upper case, no «(C2)»). */
  upper: string;
}

export const PHASES: readonly PhaseDef[] = [
  { id: 'reconnaissance', name: 'Reconnaissance', lines: ['Reconnaissance'], upper: 'RECONNAISSANCE' },
  { id: 'weaponization', name: 'Weaponization', lines: ['Weaponization'], upper: 'WEAPONIZATION' },
  { id: 'delivery', name: 'Delivery', lines: ['Delivery'], upper: 'DELIVERY' },
  { id: 'exploitation', name: 'Exploitation', lines: ['Exploitation'], upper: 'EXPLOITATION' },
  { id: 'installation', name: 'Installation', lines: ['Installation'], upper: 'INSTALLATION' },
  { id: 'c2', name: 'Command & Control (C2)', lines: ['Command &', 'Control (C2)'], upper: 'COMMAND & CONTROL' },
  { id: 'actions', name: 'Actions on Objectives', lines: ['Actions on', 'Objectives'], upper: 'ACTIONS ON OBJECTIVES' },
];

export const PHASE_IDS: readonly PhaseId[] = PHASES.map((p) => p.id);

export function phaseIndex(id: PhaseId): number {
  return PHASE_IDS.indexOf(id);
}

export function phaseDef(id: PhaseId): PhaseDef {
  return PHASES[phaseIndex(id)];
}

// =================================================================================================
// Vignette

export const VIGNETTE_BASE = { w: 240, h: 200 } as const;
/** Ground line inside a vignette (design units). */
const G = 160;

export function vignetteHeight(width: number): number {
  return (VIGNETTE_BASE.h * width) / VIGNETTE_BASE.w;
}

export interface VignetteLook {
  /** 0–1: the panel and its setting appear (fade + rise). Default 1. */
  show?: number;
  /**
   * 0–1: the phase's action plays out (default 1, finished): the thief walks up
   * and looks; the device goes into the box and it shuts; the parcel lands; the
   * door opens, a hand opens the box and the device lights; the key slides under
   * the pot; the bubble goes out; the thief walks off with the plans.
   */
  act?: number;
  /** 0–1: the frame glows in `tone` (the voice is on it). */
  lit?: number;
  /** 0–1: steps back (another slot is in focus). */
  dim?: number;
  /** 0–1: not reached — greyscale and faded (s02 `grey`, s08 `later`). */
  grey?: number;
  /** 0–1: the link cracks (emerald crack); on exploitation the box stays SHUT («nadie la abre»). */
  broken?: number;
  /** 0–1: the drawing blurs (s06 reconnaissance, «casi nunca la ves»). */
  blurred?: number;
  /** 0–1: the drawing goes, only the frame stays (s06 actions «sin pruebas», s09 gaps). */
  empty?: number;
  /** 0–1: dashed cyan frame (s06 weaponization, «inferida»). */
  dashed?: number;
  /** Frame (and name) colour: an accent, 'sky' or #hex. Default: steel. */
  tone?: Tone;
  /** 0–1 colour wash over the panel in `tone` (s07 «ya hechas», rose). */
  wash?: number;
  /** 'safe' (actions, s07) · 'dark' (exploitation: nothing lights) · 'closed' (weaponization: shut door). */
  variant?: 'safe' | 'dark' | 'closed';
  /** 0–1: the panel grows (×1.22 from its bottom centre) and comes forward — the one being drawn. */
  pop?: number;
}

const STEEL = '#94a3b8';
const SKIN = '#e3cbb4';
const SLEEVE = '#475569';

const ease = (t: number) => EASE.inOut(clamp01(t));
const sub = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

// ---- Small drawings (design units) --------------------------------------------------------------

/** Faceless, genderless hooded figure, feet on `ground`; design box 40×100 scaled to `h`. */
function FigureG({
  x,
  ground,
  h = 84,
  color = C.rose,
  pose = 'stand',
  facing = 1,
  carry = 0,
}: {
  x: number;
  ground: number;
  h?: number;
  color?: string;
  pose?: 'stand' | 'walk' | 'reach';
  facing?: 1 | -1;
  carry?: number;
}) {
  const k = h / 100;
  const deep = color === C.rose ? C.roseDeep : alpha('#020617', 0.6);
  const walk = pose === 'walk';
  return (
    <g transform={`translate(${x} ${ground - h}) scale(${k * facing} ${k}) translate(${facing === -1 ? -40 : 0} 0)`}>
      {/* legs */}
      <g stroke={color} strokeWidth={7.5} strokeLinecap="round">
        <path d={walk ? 'M 15 64 L 7 97' : 'M 15 64 L 14 98'} />
        <path d={walk ? 'M 25 64 L 33 96' : 'M 25 64 L 26 98'} />
      </g>
      {/* back arm */}
      <path d={walk ? 'M 11 34 L 3 56' : 'M 10 34 L 6 60'} stroke={color} strokeWidth={6.5} strokeLinecap="round" opacity={0.85} />
      {/* torso (a long coat) */}
      <path d="M 7 31 Q 20 23 33 31 L 36 66 Q 20 70 4 66 Z" fill={color} stroke={deep} strokeWidth={1.6} />
      {/* front arm */}
      <path
        d={pose === 'reach' ? 'M 30 34 L 47 46' : walk ? 'M 30 34 L 40 54' : 'M 30 34 L 34 60'}
        stroke={color}
        strokeWidth={6.5}
        strokeLinecap="round"
      />
      {/* hood + head (no face) */}
      <circle cx={20} cy={14} r={12.5} fill={deep} />
      <circle cx={21} cy={15} r={9} fill={color} />
      {carry > 0.01 ? (
        <g opacity={clamp01(carry)} transform="rotate(-12 28 46)">
          <rect x={14} y={41} width={40} height={10} rx={5} fill={C.cyan} stroke={C.cyanDeep} strokeWidth={1.4} />
          <path d="M 20 46 L 48 46" stroke={alpha('#ffffff', 0.7)} strokeWidth={1.2} />
          <ellipse cx={54} cy={46} rx={3} ry={5} fill={C.cyanSoft} stroke={C.cyanDeep} strokeWidth={1} />
        </g>
      ) : null}
    </g>
  );
}

/** A rolled blueprint, horizontal, centred at (x, y), `w` long. */
function PlansG({ x, y, w = 40, rot = 0, glow = 0 }: { x: number; y: number; w?: number; rot?: number; glow?: number }) {
  const h = w * 0.26;
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      {glow > 0.01 ? <rect x={x - w / 2 - 6} y={y - h / 2 - 6} width={w + 12} height={h + 12} rx={h} fill={alpha(C.cyan, 0.25 * glow)} /> : null}
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={C.cyan} stroke={C.cyanDeep} strokeWidth={1.4} />
      <path d={`M ${x - w / 2 + 5} ${y - h * 0.12} L ${x + w / 2 - 6} ${y - h * 0.12}`} stroke={alpha('#ffffff', 0.75)} strokeWidth={1.2} />
      <path d={`M ${x - w / 2 + 5} ${y + h * 0.2} L ${x + w / 4} ${y + h * 0.2}`} stroke={alpha('#ffffff', 0.5)} strokeWidth={1} />
      <ellipse cx={x + w / 2} cy={y} rx={h * 0.28} ry={h / 2} fill={C.cyanSoft} stroke={C.cyanDeep} strokeWidth={1} />
    </g>
  );
}

/** The house seen from the street (cyan: Meridian). Base `x0`, ground `ground`, scale `s` (100 units wide). */
function HouseG({
  x0,
  ground,
  s = 1,
  plans = 1,
  doorOpen = 0,
  device = 0,
  glow = 0,
  color = C.cyan,
  frame = 0,
  fps = 30,
}: {
  x0: number;
  ground: number;
  s?: number;
  plans?: number;
  doorOpen?: number;
  device?: number;
  glow?: number;
  color?: string;
  frame?: number;
  fps?: number;
}) {
  const top = ground - 70 * s;
  const win = { x: x0 + 12 * s, y: ground - 58 * s, w: 34 * s, h: 26 * s };
  const door = { x: x0 + 58 * s, y: ground - 46 * s, w: 26 * s, h: 46 * s };
  const o = clamp01(doorOpen);
  const dv = clamp01(device);
  // A slow signal ring around the device in the window: one every two seconds.
  const ringPhase = ((frame / fps) * 0.5) % 1;
  return (
    <g>
      {glow > 0.01 ? <rect x={x0 - 14 * s} y={ground - 120 * s} width={128 * s} height={124 * s} rx={16 * s} fill={alpha(color, 0.12 * glow)} /> : null}
      {/* chimney */}
      <rect x={x0 + 70 * s} y={ground - 106 * s} width={12 * s} height={24 * s} fill={C.ink800} stroke={color} strokeWidth={2.2} />
      {/* body */}
      <rect x={x0} y={top} width={100 * s} height={70 * s} fill={C.ink850} stroke={color} strokeWidth={2.8} />
      {/* roof */}
      <path d={`M ${x0 - 10 * s} ${top + 1} L ${x0 + 50 * s} ${ground - 112 * s} L ${x0 + 110 * s} ${top + 1} Z`} fill={alpha(C.cyanDeep, 0.55)} stroke={color} strokeWidth={2.8} strokeLinejoin="round" />
      {/* window, with the plans inside */}
      <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={2} fill={alpha(color, 0.14)} stroke={color} strokeWidth={2} />
      {plans > 0.01 ? (
        <g opacity={clamp01(plans)}>
          <PlansG x={win.x + win.w / 2} y={win.y + win.h * 0.62} w={win.w * 0.72} rot={-8} />
        </g>
      ) : null}
      {dv > 0.01 ? (
        <g opacity={dv}>
          <circle cx={win.x + win.w * 0.5} cy={win.y + win.h * 0.5} r={(5 + 22 * ringPhase) * s} fill="none" stroke={alpha(C.rose, 0.8 * (1 - ringPhase))} strokeWidth={2} />
          <circle cx={win.x + win.w * 0.5} cy={win.y + win.h * 0.5} r={9 * s} fill={alpha(C.rose, 0.3)} />
          <rect x={win.x + win.w * 0.5 - 6 * s} y={win.y + win.h * 0.5 - 5 * s} width={12 * s} height={10 * s} rx={2} fill="#1e293b" stroke={C.rose} strokeWidth={1.6} />
          <circle cx={win.x + win.w * 0.5} cy={win.y + win.h * 0.5} r={2.4 * s} fill={C.rose} />
        </g>
      ) : null}
      <path d={`M ${win.x + win.w / 2} ${win.y} L ${win.x + win.w / 2} ${win.y + win.h} M ${win.x} ${win.y + win.h / 2} L ${win.x + win.w} ${win.y + win.h / 2}`} stroke={alpha(color, 0.55)} strokeWidth={1.2} />
      {/* door (hinge on the right; opening shows the dark inside) */}
      <rect x={door.x} y={door.y} width={door.w} height={door.h} fill="#05080f" stroke={color} strokeWidth={2} />
      <rect x={door.x + door.w * 0.75 * o} y={door.y} width={door.w * (1 - 0.75 * o)} height={door.h} fill={C.ink700} stroke={alpha(color, 0.7)} strokeWidth={1.6} />
      {o < 0.5 ? <circle cx={door.x + door.w * 0.24} cy={door.y + door.h * 0.55} r={1.8 * s + 0.6} fill={color} /> : null}
      <rect x={door.x - 4 * s} y={ground - 3} width={door.w + 8 * s} height={4} fill={alpha(color, 0.5)} />
    </g>
  );
}

/** Ground: the street (sky) under a street-view vignette. */
function StreetG() {
  return (
    <g>
      <rect x={-10} y={G} width={260} height={50} fill={alpha(C.sky, 0.07)} />
      <line x1={-10} y1={G} x2={250} y2={G} stroke={alpha(C.sky, 0.55)} strokeWidth={2.4} />
      <path d={`M 4 ${G + 18} L 30 ${G + 18} M 64 ${G + 18} L 96 ${G + 18} M 130 ${G + 18} L 162 ${G + 18} M 196 ${G + 18} L 228 ${G + 18}`} stroke={alpha(C.sky, 0.3)} strokeWidth={2} />
    </g>
  );
}

/** Close-up of the front door (cyan) with the doormat; `ajar` 0–1 opens it (hinge right). */
function DoorstepG({ ajar = 0 }: { ajar?: number }) {
  const a = clamp01(ajar);
  const leaf = { x: 108, y: 30, w: 64, h: G - 30 };
  const gapW = leaf.w * 0.5 * a;
  return (
    <g>
      {/* wall siding */}
      <rect x={-10} y={-10} width={260} height={G + 10} fill={alpha(C.cyan, 0.035)} />
      {[22, 44, 66, 88, 110, 132].map((y) => (
        <line key={y} x1={-10} y1={y} x2={250} y2={y} stroke={alpha(C.cyan, 0.08)} strokeWidth={1.4} />
      ))}
      {/* floor */}
      <rect x={-10} y={G} width={260} height={50} fill={alpha(C.ink700, 0.75)} />
      <line x1={-10} y1={G} x2={250} y2={G} stroke={alpha(C.cyan, 0.35)} strokeWidth={2} />
      {/* frame + inside + leaf */}
      <rect x={leaf.x - 7} y={leaf.y - 7} width={leaf.w + 14} height={leaf.h + 7} rx={3} fill="none" stroke={C.cyan} strokeWidth={3.4} />
      <rect x={leaf.x} y={leaf.y} width={leaf.w} height={leaf.h} fill="#04070d" />
      {a > 0.01 ? <rect x={leaf.x} y={leaf.y} width={gapW} height={leaf.h} fill={alpha('#fde68a', 0.08 * a)} /> : null}
      <g>
        <rect x={leaf.x + gapW} y={leaf.y} width={leaf.w - gapW} height={leaf.h} fill={C.ink700} stroke={alpha(C.cyan, 0.65)} strokeWidth={2} />
        <rect x={leaf.x + gapW + 8 * (1 - a * 0.5)} y={leaf.y + 10} width={Math.max(4, leaf.w - gapW - 16 * (1 - a * 0.5))} height={44} rx={2} fill="none" stroke={alpha(C.cyan, 0.3)} strokeWidth={1.4} />
        <rect x={leaf.x + gapW + 8 * (1 - a * 0.5)} y={leaf.y + 64} width={Math.max(4, leaf.w - gapW - 16 * (1 - a * 0.5))} height={52} rx={2} fill="none" stroke={alpha(C.cyan, 0.3)} strokeWidth={1.4} />
        {a < 0.3 ? <circle cx={leaf.x + 10} cy={leaf.y + 70} r={3.6} fill={C.cyan} /> : null}
      </g>
      {/* doormat */}
      <rect x={70} y={G - 1} width={126} height={9} rx={3} fill="#3f4a5c" stroke="#5b6b82" strokeWidth={1.4} />
    </g>
  );
}

/** A hand with its sleeve reaching to the right; (x, y) = fingertips; `color` skin. */
function HandG({ x, y, s = 1, rot = 0, color = SKIN, sleeve = SLEEVE }: { x: number; y: number; s?: number; rot?: number; color?: string; sleeve?: string }) {
  const edge = alpha('#020617', 0.45);
  const fingers: [number, number, number][] = [
    [-7.2, 9, -6],
    [-2.4, 11.5, -1],
    [2.4, 11, 3],
    [7, 9, 8],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* sleeve and cuff */}
      <path d="M -54 -10 L -28 -9 L -28 9 L -54 10 Z" fill={sleeve} stroke={edge} strokeWidth={1.2} strokeLinejoin="round" />
      <rect x={-30} y={-9.5} width={5} height={19} rx={2} fill={alpha('#ffffff', 0.18)} />
      {/* palm */}
      <path d="M -26 -8.5 Q -16 -11.5 -9 -8.5 L -8 8.5 Q -16 11.5 -26 8.5 Z" fill={color} stroke={edge} strokeWidth={1} />
      {/* four fingers, slightly spread, and the thumb */}
      {fingers.map(([dy, len, r], i) => (
        <rect key={i} x={-10} y={dy - 2.1} width={len} height={4.2} rx={2.1} fill={color} stroke={edge} strokeWidth={0.8} transform={`rotate(${r} -10 ${dy})`} />
      ))}
      <path d="M -21 -8 Q -17 -16 -10 -16" fill="none" stroke={color} strokeWidth={4.6} strokeLinecap="round" />
    </g>
  );
}

/** The flowerpot by the door with the key under it (V7's KeyPot geometry, no tag, no window). */
function PotKeyG({ keyIn = 1, glint = 0 }: { keyIn?: number; glint?: number }) {
  const cx = 52;
  const base = G + 6;
  const top = 126;
  const k = clamp01(keyIn);
  const kx = mix(150, 36, ease(k));
  return (
    <g>
      {/* Key (drawn before the pot, which covers its bit); bow peeks out towards the door */}
      <g opacity={Math.min(1, k * 3)}>
        {glint > 0.01 ? <ellipse cx={kx + 54} cy={G + 4} rx={26} ry={12} fill={alpha(C.rose, 0.35 * glint)} /> : null}
        <rect x={kx} y={G + 2} width={44} height={4.6} rx={2} fill="#cbd5e1" />
        <path d={`M ${kx + 3} ${G + 2.5} l 0 -5 l 5 0 l 0 2.5 l 4 0 l 0 -2.5 l 4 0 l 0 5 Z`} fill="#cbd5e1" />
        <circle cx={kx + 52} cy={G + 4.3} r={7} fill="none" stroke={glint > 0.3 ? '#fde68a' : '#cbd5e1'} strokeWidth={4} />
      </g>
      {/* plant */}
      {[
        `M ${cx} ${top} C ${cx - 26} ${top - 10}, ${cx - 30} ${top - 30}, ${cx - 22} ${top - 42} C ${cx - 15} ${top - 26}, ${cx - 8} ${top - 14}, ${cx} ${top}`,
        `M ${cx} ${top} C ${cx + 26} ${top - 10}, ${cx + 31} ${top - 32}, ${cx + 23} ${top - 44} C ${cx + 15} ${top - 28}, ${cx + 7} ${top - 14}, ${cx} ${top}`,
        `M ${cx} ${top} C ${cx - 8} ${top - 22}, ${cx - 4} ${top - 44}, ${cx + 2} ${top - 56} C ${cx + 8} ${top - 40}, ${cx + 7} ${top - 22}, ${cx} ${top}`,
      ].map((d, i) => (
        <path key={i} d={d} fill={i === 2 ? '#3f6b5c' : '#4d7f6d'} stroke="#2c4d42" strokeWidth={1.4} />
      ))}
      {/* pot */}
      <path d={`M ${cx - 23} ${top + 7} L ${cx + 23} ${top + 7} L ${cx + 17} ${base} L ${cx - 17} ${base} Z`} fill="#7c4a32" stroke="#a8673f" strokeWidth={2} />
      <rect x={cx - 27} y={top} width={54} height={10} rx={3} fill="#94593b" stroke="#b9774a" strokeWidth={2} />
    </g>
  );
}

/** The C2 bubble «sigo aquí, ¿qué hago?» (rose), tail towards (tx, ty). */
function BubbleG({ x, y, w, h, tx, ty, p, beat }: { x: number; y: number; w: number; h: number; tx: number; ty: number; p: number; beat: number }) {
  const k = clamp01(p);
  if (k <= 0.01) return null;
  const sc = 0.3 + 0.7 * EASE.out(k);
  const bx = x + w * 0.18;
  return (
    <g opacity={Math.min(1, k * 2)} transform={`translate(${tx} ${ty}) scale(${sc}) translate(${-tx} ${-ty})`}>
      <path
        d={`M ${x + 14} ${y} L ${x + w - 14} ${y} Q ${x + w} ${y} ${x + w} ${y + 14} L ${x + w} ${y + h - 14} Q ${x + w} ${y + h} ${x + w - 14} ${y + h} L ${bx + 22} ${y + h} L ${tx} ${ty} L ${bx} ${y + h} L ${x + 14} ${y + h} Q ${x} ${y + h} ${x} ${y + h - 14} L ${x} ${y + 14} Q ${x} ${y} ${x + 14} ${y} Z`}
        fill={alpha(C.roseDeep, 0.94)}
        stroke={C.rose}
        strokeWidth={2.4 + 1.2 * beat}
        strokeLinejoin="round"
      />
      <text x={x + w / 2} y={y + h * 0.44} textAnchor="middle" fontFamily={FONT.sans} fontSize={34} fontWeight={800} fill="#ffe4e6" letterSpacing={-0.7}>
        sigo aquí,
      </text>
      <text x={x + w / 2} y={y + h * 0.86} textAnchor="middle" fontFamily={FONT.sans} fontSize={34} fontWeight={800} fill="#ffe4e6" letterSpacing={-0.7}>
        ¿qué hago?
      </text>
    </g>
  );
}

/** A small device in flight (the thing that goes into the box). */
function GadgetG({ x, y, s = 1, lit = 0 }: { x: number; y: number; s?: number; lit?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {lit > 0.01 ? <circle cx={0} cy={0} r={16} fill={alpha(C.rose, 0.3 * lit)} /> : null}
      <rect x={-12} y={-10} width={24} height={20} rx={4} fill="#1e293b" stroke={C.rose} strokeWidth={2} />
      <circle cx={0} cy={-2} r={3.6} fill={lit > 0.05 ? C.rose : '#475569'} />
      <path d="M 7 -10 L 10 -16" stroke={C.roseSoft} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

// ---- The seven drawings --------------------------------------------------------------------------

type ArtProps = { look: Required<Pick<VignetteLook, 'act' | 'broken'>> & VignetteLook; frame: number; fps: number };

function ReconArt({ look, frame, fps }: ArtProps) {
  const a = look.act;
  const walk = ease(sub(a, 0, 0.7));
  const sight = sub(a, 0.62, 1);
  const fx = mix(-34, 40, walk);
  const head = { x: fx + 22, y: G - 72 };
  const win = { x: 118 + 29, y: G - 45 };
  return (
    <g>
      <StreetG />
      <HouseG x0={118} ground={G} s={1} plans={1} frame={frame} fps={fps} />
      {sight > 0.01 ? (
        <path
          d={`M ${head.x + 10} ${head.y} L ${win.x} ${win.y}`}
          stroke={alpha(C.roseSoft, 0.85)}
          strokeWidth={2.4}
          strokeDasharray="5 6"
          opacity={sight}
        />
      ) : null}
      <FigureG x={fx} ground={G + 2} h={86} pose={walk < 1 ? 'walk' : 'stand'} />
    </g>
  );
}

function WeaponArt({ look }: ArtProps) {
  if (look.variant === 'closed') {
    return (
      <g>
        <rect x={-10} y={-10} width={260} height={G + 10} fill={alpha(C.roseDeep, 0.6)} />
        {[30, 60, 90, 120].map((y) => (
          <line key={y} x1={-10} y1={y} x2={250} y2={y} stroke={alpha(C.rose, 0.07)} strokeWidth={1.4} />
        ))}
        <rect x={-10} y={G} width={260} height={50} fill={alpha('#000000', 0.35)} />
        {/* the shut door, light leaking under it */}
        <rect x={60} y={14} width={120} height={G - 14} rx={3} fill="none" stroke={alpha(C.rose, 0.55)} strokeWidth={3.4} />
        <rect x={66} y={20} width={108} height={G - 20} fill="#2a1520" stroke={alpha(C.rose, 0.4)} strokeWidth={1.8} />
        <rect x={76} y={32} width={88} height={46} rx={2} fill="none" stroke={alpha(C.rose, 0.25)} strokeWidth={1.4} />
        <rect x={76} y={88} width={88} height={60} rx={2} fill="none" stroke={alpha(C.rose, 0.25)} strokeWidth={1.4} />
        <circle cx={162} cy={96} r={4} fill={alpha(C.rose, 0.7)} />
        <rect x={60} y={G - 4} width={120} height={6} fill={alpha('#fde68a', 0.15)} />
        <rect x={68} y={G - 2} width={104} height={3} fill={alpha('#fcd34d', 0.85)} />
        <ellipse cx={120} cy={G + 6} rx={70} ry={8} fill={alpha('#fcd34d', 0.16)} />
      </g>
    );
  }
  const a = look.act;
  const fly = ease(sub(a, 0.1, 0.72));
  const shut = ease(sub(a, 0.72, 1));
  const bs = 0.46;
  const bx = 150 - 100 * bs;
  const by = 118 - 160 * bs;
  const from = { x: 86, y: 106 };
  const to = { x: 150, y: by + 76 * bs };
  const gx = mix(from.x, to.x, fly);
  const gy = mix(from.y, to.y, fly) - Math.sin(Math.PI * fly) * 26;
  return (
    <g>
      {/* the workshop: dark wall, a lamp, a pegboard */}
      <rect x={-10} y={-10} width={260} height={G + 10} fill={alpha(C.roseDeep, 0.55)} />
      <rect x={-10} y={G} width={260} height={50} fill={alpha('#000000', 0.35)} />
      <rect x={158} y={8} width={70} height={44} rx={3} fill={alpha(C.rose, 0.06)} stroke={alpha(C.rose, 0.3)} strokeWidth={1.4} />
      <g stroke={alpha('#cbd5e1', 0.55)} strokeWidth={2.4} strokeLinecap="round" fill="none">
        <path d="M 170 18 L 170 44 M 166 18 A 4 4 0 0 0 174 18" />
        <path d="M 186 16 L 186 46" />
        <path d="M 202 18 L 214 18 M 208 18 L 208 46" />
      </g>
      <path d="M 82 -10 L 82 18" stroke={alpha('#94a3b8', 0.6)} strokeWidth={1.6} />
      <path d="M 70 18 L 94 18 L 100 30 L 64 30 Z" fill={C.amberDeep} stroke={C.amber} strokeWidth={1.6} />
      <path d="M 64 30 L 100 30 L 150 116 L 14 116 Z" fill={alpha(C.amber, 0.09)} />
      {/* the open door at the left edge (a workshop behind a door) */}
      <path d={`M 2 8 L 24 18 L 24 ${G - 4} L 2 ${G}`} fill="#2a1520" stroke={alpha(C.rose, 0.45)} strokeWidth={1.6} />
      {/* the thief behind the bench */}
      <FigureG x={38} ground={G + 4} h={96} pose={fly < 1 ? 'reach' : 'stand'} />
      {/* the box on the bench */}
      <g transform={`translate(${bx} ${by}) scale(${bs})`}>
        <TrapBoxShape open={1 - shut} device={0} />
      </g>
      {/* bench */}
      <rect x={10} y={116} width={220} height={10} rx={2} fill="#5b4636" stroke="#8a6a4f" strokeWidth={1.6} />
      <rect x={18} y={126} width={8} height={G - 126} fill="#4a3a2d" />
      <rect x={214} y={126} width={8} height={G - 126} fill="#4a3a2d" />
      <rect x={26} y={126} width={188} height={6} fill={alpha('#000000', 0.25)} />
      {/* the device on its way into the box */}
      {fly < 0.98 ? <GadgetG x={gx} y={gy} s={0.95} lit={0.7} /> : null}
    </g>
  );
}

const BOX_AT_DOOR = { s: 0.42, x: 54, bottom: G + 6 } as const;

function DeliveryArt({ look }: ArtProps) {
  const a = look.act;
  const land = ease(sub(a, 0, 0.8));
  const bounce = Math.sin(Math.PI * sub(a, 0.8, 1)) * 3;
  const { s, x, bottom } = BOX_AT_DOOR;
  const y = bottom - 160 * s - (1 - land) * 70 - bounce;
  return (
    <g>
      <DoorstepG />
      <g opacity={Math.min(1, a * 4)} transform={`translate(${x} ${y}) scale(${s})`}>
        <TrapBoxShape />
      </g>
    </g>
  );
}

function ExploitArt({ look }: ArtProps) {
  const go = 1 - clamp01(look.broken * 1.5);
  const a = look.act * go;
  const ajar = ease(sub(a, 0, 0.3));
  const reach = ease(sub(a, 0.15, 0.4)) * (1 - ease(sub(a, 0.7, 0.95)) * 0.6);
  const open = ease(sub(a, 0.3, 0.55));
  const rise = ease(sub(a, 0.5, 0.8));
  const dark = look.variant === 'dark';
  const lit = dark ? 0 : ease(sub(a, 0.72, 1));
  const { s, x, bottom } = BOX_AT_DOOR;
  const y = bottom - 160 * s;
  return (
    <g>
      <DoorstepG ajar={ajar} />
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <TrapBoxShape open={open} device={rise} lit={lit} />
      </g>
      {reach > 0.01 ? (
        <g opacity={Math.min(1, reach * 3)}>
          <HandG x={mix(116, 104, reach)} y={mix(96, 116, reach)} rot={150} s={1.05} />
        </g>
      ) : null}
    </g>
  );
}

function InstallArt({ look }: ArtProps) {
  const a = look.act;
  const k = ease(sub(a, 0, 0.75));
  const glint = Math.sin(Math.PI * sub(a, 0.7, 1));
  return (
    <g>
      <DoorstepG />
      <PotKeyG keyIn={k} glint={a >= 1 ? 0.6 : glint} />
    </g>
  );
}

function C2Art({ look, frame: liveFrame, fps }: ArtProps) {
  const a = look.act;
  const dev = ease(sub(a, 0, 0.3));
  const out = sub(a, 0.2, 0.75);
  // A greyed or stepped-back slot holds still (no ring, no pulse).
  const still = (look.grey ?? 0) > 0.3 || (look.dim ?? 0) > 0.5 || (look.empty ?? 0) > 0.5;
  const frame = still ? 0 : liveFrame;
  const beat = still ? 0 : 0.5 - 0.5 * Math.cos(((2 * Math.PI * 0.5) * frame) / fps);
  const hs = 0.62;
  const x0 = 10;
  const win = { x: x0 + 29 * hs, y: G - 45 * hs };
  return (
    <g>
      <StreetG />
      <HouseG x0={x0} ground={G} s={hs} plans={0} device={dev} frame={frame} fps={fps} />
      <FigureG x={194} ground={G + 2} h={66} facing={-1} />
      <BubbleG x={28} y={4} w={208} h={84} tx={win.x + 4} ty={win.y - 2} p={out} beat={beat * dev} />
    </g>
  );
}

function ActionsArt({ look }: ArtProps) {
  const a = look.act;
  if (look.variant === 'safe') {
    const hand = ease(sub(a, 0.25, 0.85));
    return (
      <g>
        <rect x={-10} y={-10} width={260} height={G + 10} fill={alpha(C.cyan, 0.03)} />
        <rect x={-10} y={G} width={260} height={50} fill={alpha(C.ink700, 0.75)} />
        <line x1={-10} y1={G} x2={250} y2={G} stroke={alpha(C.cyan, 0.35)} strokeWidth={2} />
        {/* the safe, door swung open */}
        <rect x={64} y={40} width={124} height={G - 40} rx={6} fill="#1f2937" stroke={STEEL} strokeWidth={3} />
        <rect x={74} y={50} width={104} height={G - 60} rx={3} fill="#0b1120" stroke={alpha(STEEL, 0.5)} strokeWidth={1.4} />
        <line x1={74} y1={104} x2={178} y2={104} stroke={alpha(STEEL, 0.6)} strokeWidth={2.4} />
        <path d={`M 64 40 L 26 28 L 26 ${G + 6} L 64 ${G}`} fill="#273244" stroke={STEEL} strokeWidth={2.4} strokeLinejoin="round" />
        <circle cx={44} cy={92} r={9} fill="none" stroke={STEEL} strokeWidth={2.4} />
        <path d="M 44 85 L 44 92 L 49 95" stroke={STEEL} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        {/* the plans, still inside */}
        <PlansG x={124} y={92} w={62} rot={-4} />
        <PlansG x={118} y={136} w={56} rot={3} />
        {/* the thief's hand on them */}
        {hand > 0.01 ? (
          <g opacity={Math.min(1, hand * 3)}>
            <HandG x={mix(250, 150, hand)} y={mix(70, 88, hand)} rot={-170} s={1.2} color={C.roseSoft} sleeve={C.rose} />
          </g>
        ) : null}
      </g>
    );
  }
  const walk = ease(sub(a, 0.1, 1));
  const fx = mix(66, 168, walk);
  return (
    <g>
      <StreetG />
      <HouseG x0={8} ground={G} s={0.66} plans={0} doorOpen={1} />
      {walk > 0.05 ? (
        <g opacity={0.7 * Math.min(1, walk * 3)} stroke={alpha(C.roseSoft, 0.6)} strokeWidth={2} strokeLinecap="round">
          <path d={`M ${fx - 22} ${G - 56} L ${fx - 8} ${G - 56}`} />
          <path d={`M ${fx - 28} ${G - 42} L ${fx - 10} ${G - 42}`} />
          <path d={`M ${fx - 20} ${G - 28} L ${fx - 6} ${G - 28}`} />
        </g>
      ) : null}
      <FigureG x={fx} ground={G + 2} h={82} pose="walk" carry={Math.min(1, 0.4 + walk)} />
    </g>
  );
}

const ART: Record<PhaseId, (p: ArtProps) => ReactNode> = {
  reconnaissance: ReconArt,
  weaponization: WeaponArt,
  delivery: DeliveryArt,
  exploitation: ExploitArt,
  installation: InstallArt,
  c2: C2Art,
  actions: ActionsArt,
};

const CRACK = 'M 130 0 L 118 38 L 136 72 L 112 110 L 132 148 L 116 200';

/** One phase's drawing in its panel. `width` px; height = vignetteHeight(width). */
export function Vignette({
  phase,
  width,
  look = {},
  framed = true,
  frame: frameProp,
  style,
}: {
  phase: PhaseId;
  width: number;
  look?: VignetteLook;
  /** false: no panel, no clip — a free illustration (e.g. a big opening image). */
  framed?: boolean;
  frame?: number;
  style?: CSSProperties;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { fps } = useVideoConfig();
  const show = clamp01(look.show ?? 1);
  if (show <= 0) return null;
  const s = width / VIGNETTE_BASE.w;
  const h = vignetteHeight(width);
  const lit = clamp01(look.lit ?? 0);
  const dim = clamp01(look.dim ?? 0);
  const grey = clamp01(look.grey ?? 0);
  const broken = clamp01(look.broken ?? 0);
  const blurred = clamp01(look.blurred ?? 0);
  const empty = clamp01(look.empty ?? 0);
  const dashed = clamp01(look.dashed ?? 0);
  const wash = clamp01(look.wash ?? 0);
  const pop = clamp01(look.pop ?? 0);
  const t = toneOf(look.tone ?? '#e2e8f0');
  const frameColor = grey > 0.5 ? '#475569' : dashed > 0.5 ? C.cyan : look.tone || lit > 0.05 ? t.fg : alpha(STEEL, 0.75);
  const Art = ART[phase];
  const artFilter = [
    grey > 0.01 ? `grayscale(${grey}) brightness(${1 - 0.35 * grey})` : '',
    blurred > 0.01 ? `blur(${(blurred * 7 * s).toFixed(2)}px)` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const clip = `vg-${uid}`;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: show * (1 - 0.6 * dim),
        transform: `translateY(${(1 - show) * 12}px)${pop > 0.001 ? ` scale(${1 + 0.22 * EASE.inOut(pop)})` : ''}`,
        transformOrigin: 'center bottom',
        filter:
          [dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : '', pop > 0.01 ? `drop-shadow(0 ${Math.round(14 * pop)}px ${Math.round(24 * pop)}px ${alpha('#000000', 0.55 * pop)})` : '']
            .filter(Boolean)
            .join(' ') || undefined,
        ...style,
      }}
    >
      {framed ? (
        <svg width={width} height={h} viewBox="0 0 240 200" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {lit > 0.01 ? <rect x={-4} y={-4} width={248} height={208} rx={26} fill={alpha(t.fg, 0.16 * lit)} /> : null}
          <rect x={3} y={3} width={234} height={194} rx={20} fill={C.ink900} />
        </svg>
      ) : null}
      <div style={{ position: 'absolute', inset: 0, opacity: (1 - empty) * (1 - 0.5 * grey), filter: artFilter || undefined }}>
        <svg width={width} height={h} viewBox="0 0 240 200" style={{ display: 'block', overflow: framed ? 'hidden' : 'visible' }}>
          {framed ? (
            <defs>
              <clipPath id={clip}>
                <rect x={4.5} y={4.5} width={231} height={191} rx={18.5} />
              </clipPath>
            </defs>
          ) : null}
          <g clipPath={framed ? `url(#${clip})` : undefined}>
            <Art look={{ ...look, act: clamp01(look.act ?? 1), broken }} frame={frame} fps={fps} />
            {wash > 0.01 ? <rect x={0} y={0} width={240} height={200} fill={alpha(t.fg, 0.22 * wash)} /> : null}
          </g>
        </svg>
      </div>
      {framed ? (
        <svg width={width} height={h} viewBox="0 0 240 200" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <rect
            x={3}
            y={3}
            width={234}
            height={194}
            rx={20}
            fill="none"
            stroke={frameColor}
            strokeWidth={(lit > 0.05 ? 3.4 + 1.6 * lit : 3) / Math.max(0.6, Math.min(1.4, s))}
            strokeDasharray={dashed > 0.05 ? '12 9' : undefined}
            opacity={dashed > 0.05 ? 0.5 + 0.5 * dashed : 1}
          />
          {broken > 0.01 ? (
            <g>
              <path d={CRACK} fill="none" stroke={C.ink950} strokeWidth={9} strokeLinejoin="round" strokeDasharray="420" strokeDashoffset={420 * (1 - broken)} />
              <path d={CRACK} fill="none" stroke={C.emerald} strokeWidth={3.6} strokeLinejoin="round" strokeDasharray="420" strokeDashoffset={420 * (1 - broken)} />
            </g>
          ) : null}
        </svg>
      ) : null}
    </div>
  );
}

// =================================================================================================
// The row

export interface KillChainLayoutOptions {
  /** Which phases, in order (default all seven). */
  ids?: readonly PhaseId[];
  /** Gap between slots in px (default ~1.2 % of the width, ≥ 12). */
  gap?: number;
  /** Name font size in px (default 32; shrunk to fit a narrow slot). */
  nameSize?: number;
  /** Reserve room for the names under the slots (default true). */
  names?: boolean;
}

export interface KillChainSlot {
  id: PhaseId;
  /** Index in `ids`. */
  i: number;
  /** Panel rect, px from the row's top-left. */
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  /** Top of the name block. */
  nameTop: number;
}

export interface KillChainLayout {
  slots: KillChainSlot[];
  slotW: number;
  slotH: number;
  gap: number;
  nameSize: number;
  /** Height of the name block (2 lines). */
  nameH: number;
  /** Total height (panels + names when reserved). */
  height: number;
  /** Slot of a phase, or undefined when it is not in `ids`. */
  slot: (id: PhaseId) => KillChainSlot | undefined;
}

/** Rough Inter ExtraBold advance, in em, for fitting names. */
const NAME_ADVANCE = 0.54;

/** PURE geometry of a KillChain row `width` px wide (no hooks: call it anywhere). */
export function killChainLayout(width: number, opts: KillChainLayoutOptions = {}): KillChainLayout {
  const ids = opts.ids ?? PHASE_IDS;
  const n = ids.length;
  const gap = opts.gap ?? Math.max(12, Math.round(width * 0.0116));
  const slotW = (width - gap * (n - 1)) / n;
  const slotH = vignetteHeight(slotW);
  const longest = Math.max(...ids.flatMap((id) => phaseDef(id).lines.map((l) => l.length)));
  const fit = Math.floor((slotW + gap - 6) / (longest * NAME_ADVANCE));
  const nameSize = Math.min(opts.nameSize ?? 32, Math.max(14, fit));
  const nameH = Math.round(nameSize * 1.08 * 2);
  const nameTop = slotH + Math.round(nameSize * 0.38);
  const slots = ids.map((id, i) => {
    const x = i * (slotW + gap);
    return { id, i, x, y: 0, w: slotW, h: slotH, cx: x + slotW / 2, cy: slotH / 2, nameTop };
  });
  return {
    slots,
    slotW,
    slotH,
    gap,
    nameSize,
    nameH,
    height: opts.names === false ? slotH : nameTop + nameH,
    slot: (id) => slots.find((s) => s.id === id),
  };
}

type PerPhase<T> = Partial<Record<PhaseId, T>>;

const perPhase = (v: number | PerPhase<number> | undefined, id: PhaseId, i: number, arr?: readonly number[]) =>
  clamp01(arr ? arr[i] ?? 0 : typeof v === 'number' ? v : v?.[id] ?? 0);

/**
 * The seven steps in a row (or the `ids` subset), each a Vignette with its
 * own `looks[id]`; chain rings between consecutive slots (`links`, 0–1 or one
 * per ring); names under the slots (`names`, 0–1 or per phase); numbered empty
 * slots behind (`slots`, 0–1 or per phase). The ring after a vignette with `broken` > 0
 * opens and turns emerald by itself. Children of `overlay` are drawn on top in
 * the row's own px space (use `killChainLayout` for coordinates).
 */
export function KillChain({
  width,
  ids = PHASE_IDS,
  looks = {},
  names = 0,
  nameSize,
  nameTone,
  links = 0,
  slots = 0,
  gap,
  frame: frameProp,
  overlay,
  style,
}: {
  width: number;
  ids?: readonly PhaseId[];
  looks?: PerPhase<VignetteLook>;
  names?: number | PerPhase<number>;
  nameSize?: number;
  /** Name colour per phase (default: the look's tone, else light text; grey when greyed). */
  nameTone?: PerPhase<string>;
  links?: number | readonly number[];
  /** 0–1 numbered empty slots behind the vignettes (one number, or per phase). */
  slots?: number | PerPhase<number>;
  gap?: number;
  frame?: number;
  overlay?: ReactNode;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const L = killChainLayout(width, { ids, gap, nameSize });
  const linkArr = Array.isArray(links) ? (links as readonly number[]) : undefined;
  const ringR = { rx: L.gap / 2 + L.slotW * 0.075, ry: L.slotW * 0.05 };
  const ringW = Math.max(3, L.slotW * 0.02);

  return (
    <div style={{ position: 'relative', width, height: L.height, ...style }}>
      {/* numbered empty slots */}
      {L.slots.map((s) => {
          const slotP = perPhase(slots, s.id, s.i);
          if (slotP <= 0.01) return null;
          return (
            <div
              key={`slot-${s.id}`}
              style={{
                position: 'absolute',
                left: s.x,
                top: s.y,
                width: s.w,
                height: s.h,
                boxSizing: 'border-box',
                borderRadius: (20 * s.w) / VIGNETTE_BASE.w,
                border: `${Math.max(2, s.w * 0.012)}px dashed ${alpha(STEEL, 0.55)}`,
                background: alpha(C.ink900, 0.6),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.sans,
                fontSize: Math.round(s.w * 0.3),
                fontWeight: 800,
                color: alpha(STEEL, 0.55),
                opacity: slotP,
                transform: `scale(${0.92 + 0.08 * slotP})`,
              }}
            >
              {s.i + 1}
            </div>
          );
        })}

      {/* vignettes */}
      {L.slots.map((s) => (
        <div key={s.id} style={{ position: 'absolute', left: s.x, top: s.y, zIndex: (looks[s.id]?.pop ?? 0) > 0.01 ? 2 : undefined }}>
          <Vignette
            phase={s.id}
            width={s.w}
            look={looks[s.id]}
            frame={frame}
            style={{ transformOrigin: s.i === 0 ? 'left bottom' : s.i === L.slots.length - 1 ? 'right bottom' : 'center bottom' }}
          />
        </div>
      ))}

      {/* chain rings between consecutive slots */}
      <svg width={width} height={L.slotH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {L.slots.slice(0, -1).map((s, k) => {
          const p = linkArr ? clamp01(linkArr[k] ?? 0) : clamp01(links as number);
          if (p <= 0.01) return null;
          const next = L.slots[k + 1];
          const cx = s.x + s.w + L.gap / 2;
          const cy = L.slotH / 2;
          const lb = clamp01(looks[s.id]?.broken ?? 0);
          const greyed = Math.max(clamp01(looks[next.id]?.grey ?? 0), clamp01(looks[s.id]?.grey ?? 0));
          const color = lb > 0.05 ? C.emerald : greyed > 0.5 ? '#475569' : STEEL;
          const show = Math.min(1, clamp01((looks[s.id]?.show ?? 1) * 2) * clamp01((looks[next.id]?.show ?? 1) * 2));
          const len = Math.PI * (ringR.rx + ringR.ry) * 1.05;
          if (lb > 0.01) {
            // Snapped: two hooks pulled apart.
            const d = L.gap * 0.45 * lb;
            const hook = (side: -1 | 1) =>
              `M ${cx + side * (ringR.rx * 0.15) + side * d} ${cy - ringR.ry} A ${ringR.rx} ${ringR.ry} 0 0 ${side === -1 ? 0 : 1} ${cx + side * (ringR.rx * 0.15) + side * d} ${cy + ringR.ry}`;
            return (
              <g key={k} opacity={p * show}>
                <path d={hook(-1)} fill="none" stroke={C.ink950} strokeWidth={ringW + 4} strokeLinecap="round" />
                <path d={hook(1)} fill="none" stroke={C.ink950} strokeWidth={ringW + 4} strokeLinecap="round" />
                <path d={hook(-1)} fill="none" stroke={color} strokeWidth={ringW} strokeLinecap="round" />
                <path d={hook(1)} fill="none" stroke={color} strokeWidth={ringW} strokeLinecap="round" />
              </g>
            );
          }
          return (
            <g key={k} opacity={show}>
              <ellipse cx={cx} cy={cy} rx={ringR.rx} ry={ringR.ry} fill="none" stroke={C.ink950} strokeWidth={ringW + 4} strokeDasharray={`${len * p} ${len}`} />
              <ellipse cx={cx} cy={cy} rx={ringR.rx} ry={ringR.ry} fill="none" stroke={color} strokeWidth={ringW} strokeDasharray={`${len * p} ${len}`} />
              {p > 0.6 ? <ellipse cx={cx} cy={cy - ringR.ry * 0.25} rx={ringR.rx * 0.7} ry={ringR.ry * 0.35} fill="none" stroke={alpha('#ffffff', 0.25 * (p - 0.6) * 2.5)} strokeWidth={1.2} /> : null}
            </g>
          );
        })}
      </svg>

      {/* names under the slots */}
      {L.slots.map((s) => {
        const p = perPhase(names, s.id, s.i);
        if (p <= 0.01) return null;
        const look = looks[s.id] ?? {};
        const g = clamp01(look.grey ?? 0);
        const color =
          nameTone?.[s.id] ?? (g > 0.5 ? C.faint : look.tone ? toneOf(look.tone).soft : look.dashed && look.dashed > 0.5 ? C.cyanSoft : C.text);
        return (
          <div
            key={`name-${s.id}`}
            style={{
              position: 'absolute',
              left: s.x - L.gap / 2,
              top: s.nameTop,
              width: s.w + L.gap,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: L.nameSize,
              fontWeight: 720,
              lineHeight: 1.08,
              letterSpacing: -0.9,
              color,
              whiteSpace: 'nowrap',
              opacity: p * (1 - 0.6 * clamp01(look.dim ?? 0)),
              transform: `translateY(${(1 - p) * 8}px)`,
            }}
          >
            {phaseDef(s.id).lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        );
      })}

      {overlay}
    </div>
  );
}

/** The compact «phase row» of the map: same slots and names, no chain rings. */
export function PhaseRow(props: Omit<Parameters<typeof KillChain>[0], 'links'>) {
  return <KillChain {...props} names={props.names ?? 1} links={0} />;
}

// =================================================================================================
// Phase title, magnifier, standalone house / figure / plans

/**
 * The violet upper-case phase entrance (DELIVERY, EXPLOITATION, …) with its
 * gloss line under it. `show` 0–1 (fade + slide). `icon` (e.g. a <Lupa />)
 * sits before the name.
 */
export function PhaseTitle({
  phase,
  sub: subText,
  show = 1,
  size = 58,
  subSize = 36,
  align = 'left',
  icon,
  style,
}: {
  phase: PhaseId;
  sub?: ReactNode;
  show?: number;
  size?: number;
  subSize?: number;
  align?: 'left' | 'center' | 'right';
  icon?: ReactNode;
  style?: CSSProperties;
}) {
  const p = clamp01(show);
  if (p <= 0.01) return null;
  const justify = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: justify, fontFamily: FONT.sans, opacity: p, transform: `translateY(${(1 - p) * 14}px)`, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.3) }}>
        {icon}
        <span
          style={{
            fontSize: size,
            fontWeight: 900,
            letterSpacing: Math.round(size * 0.05),
            color: '#c4b5fd',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            textShadow: `0 0 ${Math.round(size * 0.4)}px ${alpha(C.violet, 0.45)}`,
          }}
        >
          {phaseDef(phase).upper}
        </span>
      </div>
      <div style={{ height: 4, width: Math.round(size * 2.2 * EASE.out(sub(p, 0.3, 1))), background: C.violet, borderRadius: 2, marginTop: Math.round(size * 0.18) }} />
      {subText ? (
        <div style={{ marginTop: Math.round(subSize * 0.4), fontSize: subSize, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{subText}</div>
      ) : null}
    </div>
  );
}

/** Size of Weaponization's magnifier — the same in s05, s06 and s10. */
export const LUPA_SIZE = 64;

/** Weaponization's magnifier: «no se observa, se deduce». Fixed size and tone (cyan). */
export function Lupa({ glow = 0, opacity = 1, style }: { glow?: number; opacity?: number; style?: CSSProperties }) {
  const g = clamp01(glow);
  return (
    <Icon
      name="search"
      size={LUPA_SIZE}
      color={C.cyan}
      strokeWidth={2.4}
      style={{ opacity, filter: g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 12 * g)}px ${alpha(C.cyan, 0.7 * g)})` : undefined, ...style }}
    />
  );
}

/** The house on its street (cyan), standalone. Aspect 140×132; `plans` in the window, `doorOpen`. */
export function StreetHouse({
  width,
  plans = 1,
  doorOpen = 0,
  glow = 0,
  show = 1,
  street = true,
  style,
}: {
  width: number;
  plans?: number;
  doorOpen?: number;
  glow?: number;
  show?: number;
  street?: boolean;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const h = (width * 132) / 140;
  return (
    <svg width={width} height={h} viewBox="0 0 140 132" style={{ display: 'block', overflow: 'visible', opacity: sh, ...style }}>
      {street ? <line x1={0} y1={126} x2={140} y2={126} stroke={alpha(C.sky, 0.55)} strokeWidth={2} /> : null}
      <HouseG x0={20} ground={126} s={1} plans={plans} doorOpen={doorOpen} glow={glow} />
    </svg>
  );
}

/** The faceless, genderless figure (rose = the thief). Aspect 60×104, feet at the bottom. */
export function Figure({
  width,
  tone = C.rose,
  pose = 'stand',
  facing = 1,
  carry = 0,
  show = 1,
  style,
}: {
  width: number;
  tone?: string;
  pose?: 'stand' | 'walk' | 'reach';
  facing?: 1 | -1;
  /** 0–1: rolled plans under the arm. */
  carry?: number;
  show?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const h = (width * 104) / 60;
  return (
    <svg width={width} height={h} viewBox="0 0 60 104" style={{ display: 'block', overflow: 'visible', opacity: sh, ...style }}>
      <FigureG x={10} ground={102} h={100} color={tone} pose={pose} facing={facing} carry={carry} />
    </svg>
  );
}

/** A rolled blueprint (cyan: Meridian's plans). Aspect 100×34. */
export function PlansRoll({ width, glow = 0, style }: { width: number; glow?: number; style?: CSSProperties }) {
  const h = (width * 34) / 100;
  return (
    <svg width={width} height={h} viewBox="0 0 100 34" style={{ display: 'block', overflow: 'visible', ...style }}>
      <PlansG x={48} y={17} w={84} glow={glow} />
    </svg>
  );
}
