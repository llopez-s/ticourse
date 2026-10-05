import type { CSSProperties, ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The spraying image of V10 (canon: out/scene-brief.md «Visual metaphors»),
 * drawn ONE way in s02 and s03:
 *   - `Door`: one door of the block, in design units (DOOR_BASE) scaled to
 *     `width`, so the small doors of the block (s02) and the big door of s03
 *     are literally the same drawing. Optional second lock (`lock2`, the MFA
 *     deadbolt, emerald), opening leaf (`open`) with light from inside.
 *   - `KeyGlyph`: the ordinary key (rose: the night's attack).
 *   - `KeyBunch`: the bunch of keys tried on ONE door (amber: the
 *     counter-example that did not happen tonight).
 *   - `Padlock`: what the door would get at the 5th failure (account lockout).
 *   - `FailCounter`: the five failure slots, «umbral: 5 fallos».
 *   - `PhoneGlyph`, `HwKeyGlyph`: «something only you have» — never a code.
 *   - `FlatsBlock`: the block of flats, floors × doors, with the single key
 *     travelling door to door (`keyPos`) and a mark on each door it tried.
 * Everything takes 0–1 weights; nothing reads the timeline. Not positioned —
 * wrap each piece in an absolutely positioned div.
 */

export const DOOR_BASE = { w: 100, h: 180 } as const;

/** Points of the door in design units. */
const POINTS = {
  lock1: { x: 80, y: 109 },
  lock2: { x: 80, y: 64 },
  knob: { x: 80, y: 92 },
  top: { x: 50, y: 0 },
} as const;

export type DoorPoint = keyof typeof POINTS;

export function doorHeight(width: number): number {
  return (DOOR_BASE.h * width) / DOOR_BASE.w;
}

/** A door point in px, relative to the door's top-left, for a door `width` px wide. */
export function doorPoint(width: number, which: DoorPoint): { x: number; y: number } {
  const s = width / DOOR_BASE.w;
  return { x: POINTS[which].x * s, y: POINTS[which].y * s };
}

export function Door({
  width,
  frameColor = alpha(C.cyan, 0.55),
  dashed = false,
  open = 0,
  inside = C.rose,
  glow = 0,
  glowColor = C.cyan,
  dim = 0,
  lock1Color = alpha(C.muted, 0.9),
  lock2 = 0,
  lock2Glow = 0,
  style,
}: {
  width: number;
  frameColor?: string;
  dashed?: boolean;
  /** 0–1: the leaf swings in on its left hinge and light comes from inside. */
  open?: number;
  /** Colour of the light inside when open (rose: the attacker is in). */
  inside?: string;
  /** 0–1 halo around the door. */
  glow?: number;
  glowColor?: string;
  /** 0–1: steps the door back (fainter, desaturated). */
  dim?: number;
  lock1Color?: string;
  /** 0–1: the second lock (MFA deadbolt) is on the door. */
  lock2?: number;
  /** 0–1: the second lock lights up. */
  lock2Glow?: number;
  style?: CSSProperties;
}) {
  const h = doorHeight(width);
  const o = clamp01(open);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const l2 = clamp01(lock2);
  const l2g = clamp01(lock2Glow);
  const leafScale = 1 - 0.72 * o;
  const id = `door-${Math.round(width)}`;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: 1 - 0.6 * d,
        filter: [d > 0.01 ? `saturate(${1 - 0.6 * d})` : '', g > 0.01 ? `drop-shadow(0 0 ${Math.round(6 + 18 * g)}px ${alpha(glowColor, 0.55 * g)})` : '']
          .filter(Boolean)
          .join(' ') || undefined,
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${DOOR_BASE.w} ${DOOR_BASE.h}`} style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#24375a" />
            <stop offset="100%" stopColor="#16233a" />
          </linearGradient>
          <radialGradient id={`${id}-in`} cx="0.35" cy="0.55" r="0.75">
            <stop offset="0%" stopColor={alpha(inside, 0.75)} />
            <stop offset="100%" stopColor={alpha(inside, 0.05)} />
          </radialGradient>
        </defs>
        {/* Frame */}
        <rect
          x={1.5}
          y={1.5}
          width={97}
          height={177}
          rx={5}
          fill={C.ink950}
          stroke={frameColor}
          strokeWidth={3}
          strokeDasharray={dashed ? '9 6' : undefined}
        />
        {/* Inside, lit when open */}
        {o > 0.001 ? <rect x={8} y={9} width={84} height={168} fill={`url(#${id}-in)`} opacity={o} /> : null}
        {/* Leaf (hinge on the left) */}
        <g transform={`translate(8 0) scale(${leafScale} 1) translate(-8 0)`}>
          <rect x={8} y={9} width={84} height={168} rx={2} fill={`url(#${id}-leaf)`} stroke={alpha(C.muted, 0.45)} strokeWidth={1.5} />
          <rect x={18} y={24} width={64} height={30} rx={3} fill="none" stroke={alpha('#ffffff', 0.09)} strokeWidth={2} />
          <rect x={18} y={122} width={64} height={44} rx={3} fill="none" stroke={alpha('#ffffff', 0.09)} strokeWidth={2} />
          {/* Name plate (blank) */}
          <rect x={38} y={13} width={24} height={6} rx={2} fill={alpha(C.muted, 0.35)} />
          {/* Knob */}
          <circle cx={POINTS.knob.x} cy={POINTS.knob.y} r={4.5} fill="#94a3b8" />
          {/* Lock 1: the keyhole */}
          <rect x={74.5} y={101} width={11} height={16} rx={3} fill={alpha(C.ink950, 0.9)} stroke={lock1Color} strokeWidth={1.5} />
          <circle cx={80} cy={107} r={2.3} fill={lock1Color} />
          <path d="M 78.7 108 L 81.3 108 L 82.1 113.6 L 77.9 113.6 Z" fill={lock1Color} />
          {/* Lock 2: the deadbolt that asks for something only you have */}
          {l2 > 0.001 ? (
            <g opacity={l2}>
              <circle cx={POINTS.lock2.x} cy={POINTS.lock2.y} r={9.5} fill={C.ink950} stroke={C.emerald} strokeWidth={2.6} />
              <rect x={75.5} y={59.5} width={9} height={9} rx={2} fill={alpha(C.emerald, 0.25 + 0.75 * l2g)} />
              {l2g > 0.01 ? <circle cx={POINTS.lock2.x} cy={POINTS.lock2.y} r={14} fill="none" stroke={alpha(C.emerald, 0.6 * l2g)} strokeWidth={2} /> : null}
            </g>
          ) : null}
        </g>
        {/* Threshold */}
        <rect x={-4} y={176} width={108} height={4} rx={2} fill={alpha(C.muted, 0.4)} />
      </svg>
    </div>
  );
}

/**
 * The ordinary key, horizontal. `width` in px (aspect 120×48). By default the
 * tip points left and the bow sticks out to the right: put the tip on a
 * keyhole (`keyTip`) and the key reads as «in the lock».
 */
export function KeyGlyph({ width, color = C.rose, glow = 0, style }: { width: number; color?: string; glow?: number; style?: CSSProperties }) {
  const h = (width * 48) / 120;
  const g = clamp01(glow);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 120 48"
      style={{ overflow: 'visible', display: 'block', filter: g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 10 * g)}px ${alpha(color, 0.7 * g)})` : undefined, ...style }}
    >
      <g transform="translate(120 0) scale(-1 1)">
        <circle cx={22} cy={24} r={15} fill={alpha(color, 0.12)} stroke={color} strokeWidth={7} />
        <rect x={36} y={20} width={80} height={8} rx={3} fill={color} />
        <rect x={90} y={26} width={8} height={13} rx={1.5} fill={color} />
        <rect x={104} y={26} width={8} height={10} rx={1.5} fill={color} />
      </g>
    </svg>
  );
}

/** Where the tip of a KeyGlyph `width` px wide sits, from its top-left. */
export function keyTip(width: number): { x: number; y: number } {
  return { x: (4 / 120) * width, y: (24 / 48) * ((width * 48) / 120) };
}

const BUNCH_ANGLES = [-46, -23, 0, 23, 46];

/**
 * A bunch of five keys hanging from a ring (the ring's centre is the anchor:
 * place it on the lock). `active` = index of the key being tried (−1 none);
 * `swing` = −1…1 sways the bunch.
 */
export function KeyBunch({
  width,
  color = C.amber,
  active = -1,
  swing = 0,
  style,
}: {
  width: number;
  color?: string;
  active?: number;
  swing?: number;
  style?: CSSProperties;
}) {
  const s = width / 160;
  return (
    <div style={{ position: 'relative', width, height: 190 * s, ...style }}>
      <svg width={width} height={190 * s} viewBox="0 0 160 190" style={{ overflow: 'visible', display: 'block' }}>
        <g transform={`rotate(${swing * 9} 80 22)`}>
          {BUNCH_ANGLES.map((a, i) => {
            const on = i === active;
            const col = on ? '#fde68a' : alpha(color, 0.82);
            return (
              <g key={a} transform={`rotate(${a} 80 22)`}>
                <circle cx={80} cy={54} r={11} fill={alpha(color, on ? 0.3 : 0.1)} stroke={col} strokeWidth={5} />
                <rect x={77} y={64} width={6} height={88} rx={2.5} fill={col} />
                <rect x={83} y={128} width={11} height={6} rx={1.5} fill={col} />
                <rect x={83} y={142} width={8} height={6} rx={1.5} fill={col} />
              </g>
            );
          })}
          <circle cx={80} cy={22} r={18} fill="none" stroke={alpha(color, 0.95)} strokeWidth={5} />
        </g>
      </svg>
    </div>
  );
}

/** Offset (px) of the bunch's ring centre from its top-left, at `width`. */
export function bunchAnchor(width: number): { x: number; y: number } {
  const s = width / 160;
  return { x: 80 * s, y: 22 * s };
}

/** The padlock a door gets at the 5th failure. `close` 0–1: it drops in and the shackle shuts. */
export function Padlock({ size, close, color = C.amber, style }: { size: number; close: number; color?: string; style?: CSSProperties }) {
  const p = clamp01(close);
  if (p <= 0.001) return null;
  const shackleUp = (1 - p) * 10;
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 60 69"
      style={{
        overflow: 'visible',
        display: 'block',
        opacity: Math.min(1, p * 1.6),
        transform: `translateY(${(1 - p) * -size * 0.5}px)`,
        filter: `drop-shadow(0 0 ${Math.round(6 + 10 * p)}px ${alpha(color, 0.55)})`,
        ...style,
      }}
    >
      <path d={`M 17 ${30 - shackleUp} L 17 ${18 - shackleUp} A 13 13 0 0 1 43 ${18 - shackleUp} L 43 ${30 - shackleUp * (1 - p)}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
      <rect x={6} y={28} width={48} height={38} rx={7} fill={color} />
      <circle cx={30} cy={44} r={5} fill={C.ink950} />
      <rect x={28} y={46} width={4} height={10} rx={1.5} fill={C.ink950} />
    </svg>
  );
}

/** «umbral: 5 fallos»: `count` (may be fractional, the last slot fades in) failure marks out of `total`. */
export function FailCounter({
  count,
  total = 5,
  size = 50,
  color = C.amber,
  style,
}: {
  count: number;
  total?: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', gap: Math.round(size * 0.24), ...style }}>
      {Array.from({ length: total }, (_, i) => {
        const p = clamp01(count - i);
        const last = i === total - 1;
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              boxSizing: 'border-box',
              borderRadius: 10,
              border: `3px solid ${alpha(color, 0.35 + 0.55 * p)}`,
              background: alpha(color, 0.05 + (last ? 0.25 : 0.12) * p),
              display: 'grid',
              placeItems: 'center',
              boxShadow: last && p > 0.02 ? `0 0 ${Math.round(18 * p)}px ${alpha(color, 0.5 * p)}` : undefined,
            }}
          >
            {p > 0.001 ? (
              <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 20 20" style={{ opacity: p, transform: `scale(${1.4 - 0.4 * p})` }}>
                <path d="M 4 4 L 16 16 M 16 4 L 4 16" stroke={last ? '#fde68a' : color} strokeWidth={3.4} strokeLinecap="round" />
              </svg>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** A phone asking for approval (no text on it: never «código»). Aspect 60×100. */
export function PhoneGlyph({ height, color = C.emerald, lit = 1, style }: { height: number; color?: string; lit?: number; style?: CSSProperties }) {
  const l = clamp01(lit);
  return (
    <svg width={(height * 60) / 100} height={height} viewBox="0 0 60 100" style={{ overflow: 'visible', display: 'block', ...style }}>
      <rect x={4} y={2} width={52} height={96} rx={10} fill={C.ink900} stroke={color} strokeWidth={4} />
      <rect x={11} y={14} width={38} height={66} rx={4} fill={alpha(color, 0.08 + 0.14 * l)} />
      {/* A round «approve» button with a check on the screen */}
      <circle cx={30} cy={47} r={13} fill={alpha(color, 0.18 + 0.5 * l)} stroke={color} strokeWidth={2.5} />
      <path d="M 23.5 47.5 L 28.5 52.5 L 37 42" fill="none" stroke={C.ink950} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.4 + 0.6 * l} />
      <rect x={24} y={87} width={12} height={4} rx={2} fill={alpha(color, 0.8)} />
    </svg>
  );
}

/** A hardware security key (USB, with a touch pad). Aspect 120×50. */
export function HwKeyGlyph({ width, color = C.emerald, lit = 1, style }: { width: number; color?: string; lit?: number; style?: CSSProperties }) {
  const l = clamp01(lit);
  return (
    <svg width={width} height={(width * 50) / 120} viewBox="0 0 120 50" style={{ overflow: 'visible', display: 'block', ...style }}>
      <rect x={86} y={14} width={30} height={22} rx={3} fill={alpha(C.muted, 0.85)} />
      <rect x={95} y={20} width={5} height={5} fill={C.ink900} />
      <rect x={105} y={20} width={5} height={5} fill={C.ink900} />
      <rect x={2} y={5} width={86} height={40} rx={13} fill={C.ink900} stroke={color} strokeWidth={4} />
      <circle cx={18} cy={25} r={5} fill="none" stroke={alpha(color, 0.7)} strokeWidth={2.5} />
      <circle cx={54} cy={25} r={11} fill={alpha(color, 0.2 + 0.55 * l)} stroke={color} strokeWidth={2.5} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// The block of flats

export interface FlatsGeometry {
  roofH: number;
  floorH: number;
  doorW: number;
  doorH: number;
  /** Door i (reading order: top floor first, left to right). */
  door: (i: number) => { x: number; y: number; w: number; h: number };
  /** The keyhole of door i, in px from the block's top-left. */
  lock: (i: number) => { x: number; y: number };
  count: number;
}

export function flatsGeometry(width: number, height: number, floors: number, cols: number): FlatsGeometry {
  const roofH = Math.round(height * 0.08);
  const baseH = Math.round(height * 0.05);
  const margin = Math.round(width * 0.035);
  const floorH = (height - roofH - baseH) / floors;
  const doorH = floorH * 0.74;
  const doorW = (doorH * DOOR_BASE.w) / DOOR_BASE.h;
  const slotW = (width - 2 * margin) / cols;
  const door = (i: number) => {
    const f = Math.floor(i / cols);
    const c = i % cols;
    const x = margin + c * slotW + slotW * 0.18;
    const y = roofH + (f + 1) * floorH - doorH - floorH * 0.07;
    return { x, y, w: doorW, h: doorH };
  };
  const lock = (i: number) => {
    const d = door(i);
    const p = doorPoint(d.w, 'lock1');
    return { x: d.x + p.x, y: d.y + p.y };
  };
  return { roofH, floorH, doorW, doorH, door, lock, count: floors * cols };
}

/** Deterministic «lit window» pattern (no randomness between renders). */
function windowLit(i: number): number {
  return [0, 1, 0, 0, 2, 0, 1, 0, 0, 0, 2, 1, 0, 0, 1, 0, 0, 2][i % 18];
}

export function FlatsBlock({
  width,
  height,
  floors = 3,
  cols = 6,
  tried = 0,
  skipMark = [],
  doorDim = {},
  keyPos = null,
  keyShow = 0,
  keyWidth,
  dim = 0,
  children,
  style,
}: {
  width: number;
  height: number;
  floors?: number;
  cols?: number;
  /** Doors tried so far (0…count, fractional = the mark fading in). */
  tried?: number;
  /** Doors that get no «tried» mark (the one that opened: dimmed here, told in s03). */
  skipMark?: readonly number[];
  /** Per-door dim (0–1). */
  doorDim?: Readonly<Record<number, number>>;
  /** Position of the single key along the doors (0 = door 0 … count−1); null = no key. */
  keyPos?: number | null;
  keyShow?: number;
  keyWidth?: number;
  /** 0–1: steps the whole block back. */
  dim?: number;
  /** Drawn on top, in the block's coordinates. */
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const geo = flatsGeometry(width, height, floors, cols);
  const d = clamp01(dim);
  const kw = keyWidth ?? geo.doorW * 1.15;
  const winW = geo.doorW * 0.62;
  const key = (() => {
    if (keyPos === null || keyShow <= 0.001) return null;
    const p = Math.max(0, Math.min(geo.count - 1, keyPos));
    const a = Math.floor(p);
    const b = Math.min(geo.count - 1, a + 1);
    const t = p - a;
    const la = geo.lock(a);
    const lb = geo.lock(b);
    // Ease each hop so the key pauses at each lock.
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const tip = keyTip(kw);
    const sameFloor = Math.floor(a / cols) === Math.floor(b / cols);
    const lift = sameFloor ? Math.sin(Math.PI * e) * geo.doorH * 0.12 : 0;
    return { x: la.x + (lb.x - la.x) * e - tip.x, y: la.y + (lb.y - la.y) * e - tip.y - lift };
  })();
  return (
    <div style={{ position: 'relative', width, height, opacity: 1 - 0.55 * d, filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      {/* Body */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: geo.roofH * 0.6,
          width,
          height: height - geo.roofH * 0.6,
          boxSizing: 'border-box',
          borderRadius: 10,
          border: `3px solid ${C.ink600}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 28px 60px ${alpha('#000000', 0.4)}`,
        }}
      />
      {/* Roof cornice */}
      <div
        style={{
          position: 'absolute',
          left: -14,
          top: 0,
          width: width + 28,
          height: geo.roofH,
          boxSizing: 'border-box',
          borderRadius: 8,
          border: `3px solid ${C.ink600}`,
          background: `linear-gradient(180deg, ${C.ink700} 0%, ${C.ink800} 100%)`,
        }}
      />
      {/* Floor slabs and gallery railings */}
      {Array.from({ length: floors }, (_, f) => {
        const y = geo.roofH + (f + 1) * geo.floorH;
        return (
          <div key={f}>
            <div style={{ position: 'absolute', left: 3, width: width - 6, top: y - geo.floorH * 0.07, height: 5, background: C.ink700 }} />
            <div style={{ position: 'absolute', left: 3, width: width - 6, top: y - geo.floorH * 0.07 + 5, height: 2, background: alpha(C.muted, 0.18) }} />
          </div>
        );
      })}
      {/* Windows next to each door */}
      {Array.from({ length: geo.count }, (_, i) => {
        const r = geo.door(i);
        const lit = windowLit(i);
        return (
          <div
            key={`w${i}`}
            style={{
              position: 'absolute',
              left: r.x + r.w + geo.doorW * 0.42,
              top: r.y + r.h * 0.12,
              width: winW,
              height: winW * 0.95,
              boxSizing: 'border-box',
              borderRadius: 4,
              border: `2px solid ${C.ink600}`,
              background: lit === 1 ? alpha(C.cyan, 0.16) : lit === 2 ? alpha(C.amber, 0.12) : alpha(C.ink950, 0.7),
            }}
          />
        );
      })}
      {/* Doors */}
      {Array.from({ length: geo.count }, (_, i) => {
        const r = geo.door(i);
        return (
          <div key={`d${i}`} style={{ position: 'absolute', left: r.x, top: r.y }}>
            <Door width={r.w} dim={doorDim[i] ?? 0} />
          </div>
        );
      })}
      {/* «Tried once» marks */}
      {Array.from({ length: geo.count }, (_, i) => {
        if (skipMark.includes(i)) return null;
        const p = clamp01(tried - i);
        if (p <= 0.001) return null;
        const r = geo.door(i);
        const s = Math.max(22, geo.doorW * 0.42);
        return (
          <div
            key={`m${i}`}
            style={{
              position: 'absolute',
              left: r.x + r.w - s * 0.55,
              top: r.y - s * 0.45,
              width: s,
              height: s,
              borderRadius: s / 2,
              display: 'grid',
              placeItems: 'center',
              background: alpha(C.roseDeep, 0.95),
              border: `2px solid ${C.rose}`,
              opacity: p,
              transform: `scale(${1.3 - 0.3 * p})`,
            }}
          >
            <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 20 20">
              <path d="M 5 5 L 15 15 M 15 5 L 5 15" stroke={C.roseSoft} strokeWidth={3.4} strokeLinecap="round" />
            </svg>
          </div>
        );
      })}
      {/* The single key */}
      {key ? (
        <div style={{ position: 'absolute', left: key.x, top: key.y, opacity: clamp01(keyShow) }}>
          <KeyGlyph width={kw} glow={0.8} />
        </div>
      ) : null}
      {children}
    </div>
  );
}
