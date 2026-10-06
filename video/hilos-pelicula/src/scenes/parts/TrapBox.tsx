import { useId, type CSSProperties, type ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { pulse } from '../../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../../engine/src/ui';

// COPY of V13's part (video/kill-chain-eslabon/src/scenes/parts/TrapBox.tsx at 21acb01), never imported across
// videos. In V14 it belongs to the builder named in out/scene-brief.md «Ownership»; any change (e.g. a wrapper variant
// per victim) is made here, in this copy, by that builder.

/**
 * «La caja trampa» — the artefact, ONE drawing in every state (V13 draws it;
 * V14 copies it for «dos cajas en dos puertas»). A kraft parcel with a paper
 * sticker on its front (it looks like something else), and inside, in layers:
 * a paper sheet (the disguise) and under it the device.
 *
 *   closed parcel ............ <TrapBox width={w} />
 *   opened, device lit ....... <TrapBox width={w} open={1} device={1} lit={1} />   (rose: it runs)
 *   opened, device dark ...... <TrapBox width={w} open={1} device={1} lock={1} />  (nothing lights: emerald lock)
 *   opening in layers ........ <TrapBox width={w} layers={p} />  p 0→3: flaps · sheet aside · device up
 *   inside slot .............. <TrapBox …>{<WorkshopLabel width={trapBoxLabelSlot(w).w} />}</TrapBox>
 *
 * Two forms:
 * - `TrapBox` — HTML wrapper (div + svg) with a CHILDREN SLOT on the device's
 *   front (the label panel): children are centred in `trapBoxLabelSlot(width,
 *   device)`, a box in px from the TrapBox's top-left that rises with the device.
 * - `TrapBoxShape` — the bare SVG <g> in design units (TRAPBOX_BASE, 200×170),
 *   to embed in another drawing: `<g transform="translate(x y) scale(s)">`.
 *   (No children slot there.)
 *
 * Look (all 0–1 weights, nothing reads the timeline):
 * - `open`   — the flaps swing out (left, right, back flap up).
 * - `sheet`  — the paper inside lifts out and moves aside (the disguise layer).
 *              The sheet exists only when `sheet` or `layers` is given: a plain
 *              «open + device» box (Exploitation, the s08 cut) has no paper in it.
 * - `device` — the device rises from the box (its lamp and front panel show).
 * - `lit`    — the device's lamp burns rose and pulses slowly (≤ 0.5 Hz): it runs.
 * - `lock`   — an emerald padlock on the device: it opens and nothing runs.
 * - `layers` — 0–3 shorthand: open = layers, sheet = layers − 1, device = layers − 2
 *              (each clamped). Explicit `open` / `sheet` / `device` win over it.
 * - `highlight` — { box, sheet, device }: lights one layer (e.g. ZIP · PDF · LNK).
 * - `sticker` (default true) — the paper sticker on the front (the disguise).
 * - `mini`   — thicker strokes for icon sizes (≤ ~140 px wide).
 * Wrapper only: `show` (fade + rise), `glow` + `glowTone` (halo), `dim`.
 *
 * Colours: kraft = neutral object; rose = the lit device (the thief's);
 * emerald = the lock (the defender's cut holds); amber = layer highlights.
 * No text is drawn — no V13 strings inside.
 *
 * V14 additions (all optional; omitted = V13's drawing, unchanged):
 * - `wrapper` — what the sticker is printed as, one per victim: 'cv' (white
 *   sheet, a portrait and lines: «un CV») or 'order' (pale form, a header bar
 *   and a grid: «un pedido»). The box itself never changes, only its wrapper.
 * - `call` (0–1) + `callPattern` ('a' | 'b') + `callSide` ('right' default |
 *   'left') — the number the device calls: radio arcs from the antenna (from
 *   the lid when the device is inside) and a bubble with a keypad glyph and
 *   groups of dashes, a different grouping per pattern. Shapes only, no digits.
 *   `callAt` ({ x, y } top-left, design units) moves the bubble anywhere (e.g.
 *   clear of a door plate); the dotted line still runs from the antenna to it.
 * - `highlight.sticker` — amber on the wrapper (sticker) only.
 * - `highlight.tape` — amber on the brown packing tape (tab down the front,
 *   and the lid strip while closed): «la cinta de embalar, como todas».
 * - `highlight.call` — brightens the call bubble.
 */

export const TRAPBOX_BASE = { w: 200, h: 170 } as const;

export type TrapBoxWrapper = 'cv' | 'order';
export type TrapBoxCallPattern = 'a' | 'b';

export interface TrapBoxLook {
  open?: number;
  sheet?: number;
  device?: number;
  lit?: number;
  lock?: number;
  layers?: number;
  highlight?: { box?: number; sheet?: number; device?: number; sticker?: number; tape?: number; call?: number };
  sticker?: boolean;
  mini?: boolean;
  wrapper?: TrapBoxWrapper;
  call?: number;
  callPattern?: TrapBoxCallPattern;
  callSide?: 'left' | 'right';
  callAt?: { x: number; y: number };
}

/** Design-unit box of the call bubble for a side (px = units × width / TRAPBOX_BASE.w), for placing things clear of it. */
export function trapBoxCallBubble(side: 'left' | 'right' = 'right'): { x: number; y: number; w: number; h: number } {
  return side === 'right' ? { x: 146, y: -42, w: 112, h: 40 } : { x: -58, y: -42, w: 112, h: 40 };
}

/** Height in px of a TrapBox `width` px wide. */
export function trapBoxHeight(width: number): number {
  return (TRAPBOX_BASE.h * width) / TRAPBOX_BASE.w;
}

// ---- Geometry (design units) -------------------------------------------------------------------
const FRONT = { x: 24, y: 88, w: 152, h: 72 } as const;
const RIM_BACK = 72;
const DEVICE = { x: 66, w: 68, h: 64, restTop: 82, upTop: 28 } as const;
const SLOT = { dx: 8, dy: 31, w: 52, h: 22 } as const;
const STICKER = { x: 36, y: 100, w: 46, h: 52 } as const;

const KRAFT = { hi: '#c99a62', mid: '#a47744', lo: '#6f4e2c', edge: '#d9ad74', tape: '#e4c592' } as const;
const PAPER = '#f1f5f9';

function deviceTop(device: number): number {
  return mix(DEVICE.restTop, DEVICE.upTop, clamp01(device));
}

function resolve(look: TrapBoxLook) {
  const L = look.layers ?? 0;
  return {
    open: clamp01(look.open ?? L),
    sheet: clamp01(look.sheet ?? L - 1),
    device: clamp01(look.device ?? L - 2),
  };
}

/**
 * The label panel on the device's front, in px from the TrapBox's top-left,
 * for a box `width` px wide whose device has risen `device` (0–1).
 */
export function trapBoxLabelSlot(width: number, device = 1): { x: number; y: number; w: number; h: number; cx: number; cy: number } {
  const s = width / TRAPBOX_BASE.w;
  const top = deviceTop(device);
  const x = (DEVICE.x + SLOT.dx) * s;
  const y = (top + SLOT.dy) * s;
  return { x, y, w: SLOT.w * s, h: SLOT.h * s, cx: x + (SLOT.w * s) / 2, cy: y + (SLOT.h * s) / 2 };
}

export type TrapBoxPoint = 'lamp' | 'label' | 'opening' | 'front' | 'sticker' | 'base';

/**
 * An anchor of a TrapBox `width` px wide, px from its top-left: 'lamp' (the
 * device's lamp), 'label' (centre of the label panel), 'opening' (centre of
 * the box's mouth), 'front' (centre of the front face), 'sticker', 'base'
 * (bottom centre). `device` (0–1) is how far the device has risen.
 */
export function trapBoxPoint(width: number, which: TrapBoxPoint, device = 1): { x: number; y: number } {
  const s = width / TRAPBOX_BASE.w;
  const top = deviceTop(device);
  const p: Record<TrapBoxPoint, { x: number; y: number }> = {
    lamp: { x: 100, y: top + 15 },
    label: { x: DEVICE.x + SLOT.dx + SLOT.w / 2, y: top + SLOT.dy + SLOT.h / 2 },
    opening: { x: 100, y: (RIM_BACK + FRONT.y) / 2 },
    front: { x: 100, y: FRONT.y + FRONT.h / 2 },
    sticker: { x: STICKER.x + STICKER.w / 2, y: STICKER.y + STICKER.h / 2 },
    base: { x: 100, y: FRONT.y + FRONT.h },
  };
  return { x: p[which].x * s, y: p[which].y * s };
}

const quad = (pts: readonly (readonly [number, number])[]) => `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z`;
const lerpPt = (a: readonly [number, number], b: readonly [number, number], t: number): [number, number] => [mix(a[0], b[0], t), mix(a[1], b[1], t)];

/** The bare drawing, in TRAPBOX_BASE design units. Embed inside an <svg>. */
export function TrapBoxShape(look: TrapBoxLook) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (k: string) => `tb-${uid}-${k}`;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { open, sheet, device } = resolve(look);
  const lit = clamp01(look.lit ?? 0);
  const lock = clamp01(look.lock ?? 0);
  const hl = { box: clamp01(look.highlight?.box ?? 0), sheet: clamp01(look.highlight?.sheet ?? 0), device: clamp01(look.highlight?.device ?? 0) };
  const hlSticker = clamp01(look.highlight?.sticker ?? 0);
  const hlTape = clamp01(look.highlight?.tape ?? 0);
  const hlCall = clamp01(look.highlight?.call ?? 0);
  const call = clamp01(look.call ?? 0);
  const sw = look.mini ? 1.7 : 1;
  const sticker = look.sticker ?? true;
  const beat = 0.7 + 0.3 * pulse(frame, fps, 0.5);

  // Flaps: hinge points fixed, tips swing from «lying on the lid» to «out».
  const lHingeA = [FRONT.x, FRONT.y] as const;
  const lHingeB = [38, RIM_BACK] as const;
  const rHingeA = [FRONT.x + FRONT.w, FRONT.y] as const;
  const rHingeB = [162, RIM_BACK] as const;
  const lTipA = lerpPt([100, FRONT.y], [2, 68], open);
  const lTipB = lerpPt([100, RIM_BACK], [17, 48], open);
  const rTipA = lerpPt([100, FRONT.y], [198, 68], open);
  const rTipB = lerpPt([100, RIM_BACK], [183, 48], open);
  const backH = 32 * open;

  const top = deviceTop(device);
  const devVisible = open > 0.15;
  const lampOn = lit * (1 - lock);
  const hasSheet = look.sheet !== undefined || look.layers !== undefined;
  const sheetShow = hasSheet ? clamp01((open - 0.55) / 0.25) : 0;
  // The sheet: rests standing in the box, then lifts up and to the right, tilting.
  const sx = mix(74, 136, sheet);
  const sy = mix(46, 4, sheet) - Math.sin(Math.PI * sheet) * 10;
  const srot = mix(0, 13, sheet);

  return (
    <g>
      <defs>
        <linearGradient id={id('front')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={KRAFT.hi} />
          <stop offset="100%" stopColor={KRAFT.mid} />
        </linearGradient>
        <linearGradient id={id('flap')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={KRAFT.edge} />
          <stop offset="100%" stopColor={KRAFT.hi} />
        </linearGradient>
        <linearGradient id={id('dev')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <radialGradient id={id('lamp')}>
          <stop offset="0%" stopColor={alpha(C.rose, 0.85)} />
          <stop offset="100%" stopColor={alpha(C.rose, 0)} />
        </radialGradient>
        <clipPath id={id('mouth')}>
          <rect x={-40} y={-60} width={280} height={60 + FRONT.y} />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx={100} cy={FRONT.y + FRONT.h + 3} rx={86} ry={6} fill={alpha('#000000', 0.38)} />

      {/* Back flap (stands up as it opens) */}
      {backH > 0.5 ? (
        <path
          d={quad([
            [38, RIM_BACK],
            [162, RIM_BACK],
            [156, RIM_BACK - backH],
            [44, RIM_BACK - backH],
          ])}
          fill={KRAFT.mid}
          stroke={KRAFT.edge}
          strokeWidth={2 * sw}
          strokeLinejoin="round"
        />
      ) : null}

      {/* The mouth of the box (dark inside) */}
      <path d={quad([lHingeA, rHingeA, rHingeB, lHingeB])} fill="#0b0f1a" stroke={alpha(KRAFT.lo, 0.9)} strokeWidth={1.5 * sw} />

      {/* Device (rises; the front face covers its lower part) */}
      {devVisible ? (
        <g clipPath={`url(#${id('mouth')})`}>
          {lampOn > 0.01 ? <circle cx={100} cy={top + 15} r={54} fill={`url(#${id('lamp')})`} opacity={lampOn * beat} /> : null}
          {hl.device > 0.01 ? <rect x={DEVICE.x - 6} y={top - 6} width={DEVICE.w + 12} height={DEVICE.h + 12} rx={12} fill={alpha(C.amber, 0.22 * hl.device)} /> : null}
          {/* Antenna */}
          <path d={`M 122 ${top + 2} L 128 ${top - 12}`} stroke={lampOn > 0.05 ? C.roseSoft : '#64748b'} strokeWidth={3 * sw} strokeLinecap="round" />
          <circle cx={128} cy={top - 13} r={3.4 * sw} fill={lampOn > 0.05 ? C.rose : '#64748b'} />
          {/* Body */}
          <rect
            x={DEVICE.x}
            y={top}
            width={DEVICE.w}
            height={DEVICE.h}
            rx={8}
            fill={`url(#${id('dev')})`}
            stroke={hl.device > 0.05 ? C.amber : lampOn > 0.05 ? alpha(C.rose, 0.6 + 0.4 * lampOn) : '#64748b'}
            strokeWidth={2.4 * sw}
          />
          {/* Lamp */}
          <circle cx={100} cy={top + 15} r={8.5} fill={lampOn > 0.02 ? C.rose : '#273449'} stroke={lampOn > 0.02 ? C.roseSoft : '#475569'} strokeWidth={1.8 * sw} opacity={lampOn > 0.02 ? 0.55 + 0.45 * lampOn * beat : 1} />
          {lampOn > 0.02 ? <circle cx={97.5} cy={top + 12.5} r={2.6} fill={alpha('#ffffff', 0.75 * lampOn)} /> : null}
          {/* Label panel (where a WorkshopLabel can be sewn: the children slot) */}
          <rect x={DEVICE.x + SLOT.dx} y={top + SLOT.dy} width={SLOT.w} height={SLOT.h} rx={3} fill={alpha('#000000', 0.25)} stroke={alpha('#94a3b8', 0.35)} strokeWidth={1.2} />
          {/* Lock: the defender's cut — it opens and nothing runs */}
          {lock > 0.01 ? (
            <g opacity={lock} transform={`translate(100 ${top + 15}) scale(${0.85 + 0.15 * lock}) translate(-100 ${-(top + 15)})`}>
              <circle cx={100} cy={top + 15} r={17} fill={alpha(C.emerald, 0.18)} />
              <path d={`M 93 ${top + 14} L 93 ${top + 8} A 7 7 0 0 1 107 ${top + 8} L 107 ${top + 14}`} fill="none" stroke={C.emerald} strokeWidth={3.2 * sw} strokeLinecap="round" />
              <rect x={89} y={top + 13} width={22} height={15} rx={3.5} fill={C.emeraldDeep} stroke={C.emerald} strokeWidth={2.4 * sw} />
              <circle cx={100} cy={top + 19.5} r={2.2} fill={C.emerald} />
            </g>
          ) : null}
        </g>
      ) : null}

      {/* Front face */}
      <rect
        x={FRONT.x}
        y={FRONT.y}
        width={FRONT.w}
        height={FRONT.h}
        rx={4}
        fill={`url(#${id('front')})`}
        stroke={hl.box > 0.05 ? C.amber : KRAFT.edge}
        strokeWidth={(2.4 + 1.6 * hl.box) * sw}
      />
      <rect x={FRONT.x + 3} y={FRONT.y + FRONT.h - 12} width={FRONT.w - 6} height={9} rx={2} fill={alpha(KRAFT.lo, 0.45)} />
      {/* Tape tab down the front */}
      {hlTape > 0.01 ? <rect x={86} y={FRONT.y - 4} width={28} height={32} rx={5} fill={alpha(C.amber, 0.22 * hlTape)} stroke={alpha(C.amber, 0.85 * hlTape)} strokeWidth={2.4 * sw} /> : null}
      <rect x={92} y={FRONT.y} width={16} height={22} fill={hlTape > 0.01 ? alpha('#f3d9a4', 0.85 + 0.15 * hlTape) : alpha(KRAFT.tape, 0.85)} />
      <path d={`M 92 ${FRONT.y + 22} L 96 ${FRONT.y + 19} L 100 ${FRONT.y + 22} L 104 ${FRONT.y + 19} L 108 ${FRONT.y + 22}`} fill="none" stroke={alpha(KRAFT.lo, 0.5)} strokeWidth={1.2} />
      {/* V14: the wrapper per victim (a CV, a purchase order) */}
      {sticker && look.wrapper ? <WrapperSticker kind={look.wrapper} hl={hlSticker} sw={sw} /> : null}
      {/* The sticker: a paper look on a parcel (the disguise) */}
      {sticker && !look.wrapper ? (
        <g>
          <path
            d={`M ${STICKER.x} ${STICKER.y} L ${STICKER.x + STICKER.w - 12} ${STICKER.y} L ${STICKER.x + STICKER.w} ${STICKER.y + 12} L ${STICKER.x + STICKER.w} ${STICKER.y + STICKER.h} L ${STICKER.x} ${STICKER.y + STICKER.h} Z`}
            fill={PAPER}
            stroke={hl.box > 0.05 ? C.amber : '#cbd5e1'}
            strokeWidth={1.5 * sw}
          />
          <path d={`M ${STICKER.x + STICKER.w - 12} ${STICKER.y} L ${STICKER.x + STICKER.w - 12} ${STICKER.y + 12} L ${STICKER.x + STICKER.w} ${STICKER.y + 12}`} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={1} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={STICKER.x + 6} y={STICKER.y + 18 + k * 8} width={k === 3 ? 18 : 32} height={3.4} rx={1.7} fill="#94a3b8" />
          ))}
        </g>
      ) : null}
      {hl.box > 0.01 ? <rect x={FRONT.x - 5} y={FRONT.y - 5} width={FRONT.w + 10} height={FRONT.h + 10} rx={8} fill="none" stroke={alpha(C.amber, 0.45 * hl.box)} strokeWidth={6} /> : null}

      {/* Side flaps (closed: they ARE the lid) */}
      {[
        [lHingeA, lTipA, lTipB, lHingeB],
        [rHingeA, rTipA, rTipB, rHingeB],
      ].map((pts, k) => (
        <path key={k} d={quad(pts as [number, number][])} fill={`url(#${id('flap')})`} stroke={hl.box > 0.05 ? alpha(C.amber, 0.9) : KRAFT.lo} strokeWidth={1.8 * sw} strokeLinejoin="round" />
      ))}
      {/* Tape across the closed lid */}
      {open < 0.25 && hlTape > 0.01 ? (
        <rect x={90} y={RIM_BACK - 3} width={20} height={FRONT.y - RIM_BACK + 6} rx={3} fill="none" stroke={alpha(C.amber, 0.85 * hlTape * (1 - open * 4))} strokeWidth={2.2 * sw} />
      ) : null}
      {open < 0.25 ? <rect x={94} y={RIM_BACK} width={12} height={FRONT.y - RIM_BACK} fill={alpha(KRAFT.tape, 0.85 * (1 - open * 4))} /> : null}

      {/* The sheet: the paper disguise, lifted out of the box */}
      {sheetShow > 0.01 ? (
        <g opacity={sheetShow} clipPath={sheet < 0.5 ? `url(#${id('mouth')})` : undefined} transform={`rotate(${srot} ${sx + 28} ${sy + 36})`}>
          {hl.sheet > 0.01 ? <rect x={sx - 6} y={sy - 6} width={68} height={84} rx={8} fill={alpha(C.amber, 0.25 * hl.sheet)} /> : null}
          <path d={`M ${sx} ${sy} L ${sx + 42} ${sy} L ${sx + 56} ${sy + 14} L ${sx + 56} ${sy + 72} L ${sx} ${sy + 72} Z`} fill={PAPER} stroke={hl.sheet > 0.05 ? C.amber : '#94a3b8'} strokeWidth={(1.6 + 1.4 * hl.sheet) * sw} />
          <path d={`M ${sx + 42} ${sy} L ${sx + 42} ${sy + 14} L ${sx + 56} ${sy + 14}`} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={1} />
          {[0, 1, 2, 3, 4].map((k) => (
            <rect key={k} x={sx + 7} y={sy + 22 + k * 9} width={k === 4 ? 22 : 40} height={3.6} rx={1.8} fill="#94a3b8" />
          ))}
        </g>
      ) : null}

      {/* V14: the number the device calls (shapes only) */}
      {call > 0.01 ? (
        <CallBubble
          show={call}
          hl={hlCall}
          pattern={look.callPattern ?? 'a'}
          side={look.callSide ?? 'right'}
          at={look.callAt}
          from={devVisible && device > 0.2 ? { x: 128, y: top - 13 } : { x: 112, y: RIM_BACK + 2 }}
          beat={beat}
          sw={sw}
        />
      ) : null}
    </g>
  );
}

/** V14: the sticker printed as the victim's lure — a CV (portrait + lines) or a purchase order (header + grid). */
function WrapperSticker({ kind, hl, sw }: { kind: TrapBoxWrapper; hl: number; sw: number }) {
  const { x, y, w, h } = STICKER;
  const paper = kind === 'cv' ? PAPER : '#fdf2c4';
  const ink = kind === 'cv' ? '#94a3b8' : '#a8946a';
  const edge = hl > 0.05 ? C.amber : kind === 'cv' ? '#cbd5e1' : '#d9c58f';
  return (
    <g>
      {hl > 0.01 ? <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={6} fill={alpha(C.amber, 0.2 * hl)} stroke={alpha(C.amber, 0.7 * hl)} strokeWidth={3 * sw} /> : null}
      <path d={`M ${x} ${y} L ${x + w - 12} ${y} L ${x + w} ${y + 12} L ${x + w} ${y + h} L ${x} ${y + h} Z`} fill={paper} stroke={edge} strokeWidth={(1.5 + 1.2 * hl) * sw} />
      <path d={`M ${x + w - 12} ${y} L ${x + w - 12} ${y + 12} L ${x + w} ${y + 12}`} fill={kind === 'cv' ? '#cbd5e1' : '#e6d49c'} stroke={ink} strokeWidth={1} />
      {kind === 'cv' ? (
        <g>
          {/* Portrait */}
          <rect x={x + 5} y={y + 6} width={13} height={15} rx={2} fill="#e2e8f0" stroke={ink} strokeWidth={1} />
          <circle cx={x + 11.5} cy={y + 11.5} r={3.2} fill={ink} />
          <path d={`M ${x + 6.5} ${y + 20.5} Q ${x + 11.5} ${y + 13.5} ${x + 16.5} ${y + 20.5} Z`} fill={ink} />
          {/* Name + lines */}
          <rect x={x + 21} y={y + 8} width={13} height={3.4} rx={1.7} fill="#64748b" />
          <rect x={x + 21} y={y + 15} width={10} height={2.6} rx={1.3} fill={ink} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={x + 5} y={y + 27 + k * 6.5} width={k === 3 ? 20 : 35} height={2.8} rx={1.4} fill={ink} />
          ))}
        </g>
      ) : (
        <g>
          {/* Header bar + a small grid with a total line */}
          <rect x={x + 5} y={y + 6} width={24} height={5} rx={1.5} fill="#8a7454" />
          <rect x={x + 5} y={y + 16} width={36} height={24} rx={1.5} fill="none" stroke={ink} strokeWidth={1.2} />
          {[0, 1].map((k) => (
            <path key={k} d={`M ${x + 5} ${y + 24 + k * 8} L ${x + 41} ${y + 24 + k * 8}`} stroke={ink} strokeWidth={1} />
          ))}
          <path d={`M ${x + 27} ${y + 16} L ${x + 27} ${y + 40}`} stroke={ink} strokeWidth={1} />
          <rect x={x + 27} y={y + 44} width={14} height={3.4} rx={1.7} fill="#8a7454" />
        </g>
      )}
    </g>
  );
}

const CALL_GROUPS: Record<TrapBoxCallPattern, number[]> = { a: [3, 2, 4], b: [2, 4, 3] };

/** V14: radio arcs from the antenna (or the lid) and a bubble with a keypad and a grouping of dashes. */
function CallBubble({
  show,
  hl,
  pattern,
  side,
  at,
  from,
  beat,
  sw,
}: {
  show: number;
  hl: number;
  pattern: TrapBoxCallPattern;
  side: 'left' | 'right';
  at?: { x: number; y: number };
  from: { x: number; y: number };
  beat: number;
  sw: number;
}) {
  const b0 = trapBoxCallBubble(side);
  const b = at ? { ...b0, x: at.x, y: at.y } : b0;
  const dir = side === 'right' ? 1 : -1;
  const stroke = hl > 0.05 ? C.roseSoft : alpha(C.roseSoft, 0.85);
  // Dotted link from the source to the bubble's near bottom corner.
  const near = {
    x: b.x > from.x ? b.x : b.x + b.w < from.x ? b.x + b.w : b.x + b.w / 2,
    y: b.y > from.y ? b.y : b.y + b.h < from.y ? b.y + b.h : b.y + b.h / 2,
  };
  const groups = CALL_GROUPS[pattern];
  const dashW = 4.5;
  const gap = 2;
  const groupGap = 6;
  const total = groups.reduce((a, n) => a + n * dashW + (n - 1) * gap, 0) + (groups.length - 1) * groupGap;
  const kx = b.x + 9;
  let gx = b.x + b.w - 8 - total;
  return (
    <g opacity={show} transform={`translate(0 ${(1 - show) * 6})`}>
      {/* Radio arcs */}
      {[8, 14].map((r, k) => (
        <path
          key={r}
          d={`M ${from.x + dir * r * 0.5} ${from.y - r * 0.87} A ${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${from.x + dir * r} ${from.y}`}
          fill="none"
          stroke={C.roseSoft}
          strokeWidth={2.2 * sw}
          strokeLinecap="round"
          opacity={(0.45 + 0.55 * beat) * (k === 0 ? 1 : 0.7)}
        />
      ))}
      <path d={`M ${from.x + dir * 12} ${from.y - 8} L ${near.x} ${near.y}`} stroke={alpha(C.roseSoft, 0.6)} strokeWidth={1.8 * sw} strokeDasharray="2 4" strokeLinecap="round" />
      {/* Bubble */}
      {hl > 0.01 ? <rect x={b.x - 5} y={b.y - 5} width={b.w + 10} height={b.h + 10} rx={14} fill={alpha(C.rose, 0.18 * hl)} /> : null}
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={10} fill="#140b16" stroke={stroke} strokeWidth={(2 + 1.2 * hl) * sw} />
      {/* Keypad */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => <circle key={`${r}-${c}`} cx={kx + 4 + c * 7} cy={b.y + 10 + r * 9} r={2.3} fill={C.roseSoft} />),
      )}
      {/* The number: groups of dashes, a different grouping per victim */}
      {groups.map((n, gi) => {
        const start = gx;
        gx += n * dashW + (n - 1) * gap + groupGap;
        return Array.from({ length: n }, (_, k) => (
          <rect key={`${gi}-${k}`} x={start + k * (dashW + gap)} y={b.y + b.h / 2 - 2} width={dashW} height={4} rx={1.6} fill={C.text} opacity={0.9} />
        ));
      })}
    </g>
  );
}

export function TrapBox({
  width,
  show = 1,
  glow = 0,
  glowTone = C.rose,
  dim = 0,
  children,
  style,
  ...look
}: TrapBoxLook & {
  width: number;
  /** 0–1 appearance (fade + a small rise). */
  show?: number;
  /** 0–1 halo around the whole box. */
  glow?: number;
  glowTone?: string;
  /** 0–1 step back (another element is in focus). */
  dim?: number;
  /** Sewn on the device's front panel (e.g. a WorkshopLabel `trapBoxLabelSlot(width).w` wide). */
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const s = width / TRAPBOX_BASE.w;
  const h = trapBoxHeight(width);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const { device } = resolve(look);
  const slot = trapBoxLabelSlot(width, device);
  const filters = [g > 0.01 ? `drop-shadow(0 0 ${Math.round(6 + 18 * g)}px ${alpha(glowTone, 0.6 * g)})` : '', d > 0.01 ? `saturate(${1 - 0.5 * d})` : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: sh * (1 - 0.6 * d),
        transform: `translateY(${(1 - sh) * 14}px)`,
        filter: filters || undefined,
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${TRAPBOX_BASE.w} ${TRAPBOX_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <TrapBoxShape {...look} />
      </svg>
      {children && device > 0.3 && resolve(look).open > 0.15 ? (
        <div
          style={{
            position: 'absolute',
            left: slot.x,
            top: slot.y,
            width: slot.w,
            height: slot.h,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Clip at the box's front edge like the device itself.
            clipPath: `inset(0 -40% ${Math.max(0, slot.y + slot.h - 88 * s)}px -40%)`,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
