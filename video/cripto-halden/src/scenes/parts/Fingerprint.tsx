import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { fmtInt } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle } from '../../../../engine/src/ui';

/**
 * «La huella» — the hash image of V11 (concept 3), shared by s04, s05, s06, s07 and s09.
 * One drawing every time it comes back: a machine takes the offer and returns a short line of
 * fixed length (`e3a1…9c07`); change one cent and the WHOLE line changes; nothing goes back.
 * For passwords, a random grain goes in first (salt) and the line goes round the machine
 * thousands of times (key stretching).
 *
 * Every piece is unpositioned (wrap it in an absolutely positioned div) and driven by 0–1
 * weights; nothing here reads the timeline. Pass `frame` only where motion is continuous
 * (the machine's rollers). Hash values shown anywhere in V11 are INVENTED and abbreviated
 * (4 + «…» + 4 characters); they must never match the campaign registry (see scene-brief «Canon»).
 *
 * API (stable — add props with defaults only):
 *
 *   <FingerprintGlyph size tone? draw? glow? strokeWidth? />
 *       The fingerprint icon (SVG whorl). `draw` 0–1 traces the ridges. Use it as THE icon of
 *       the hash wherever a chip/rule needs one (s09's SHA384 chip, s10's rule card).
 *
 *   <HashLine value size? tone? reveal? from? morph? glyph? glow? mark? markTone? dim? strike? strikeTone? style? />
 *       The line itself: glyph + monospaced value in a pill. `reveal` types it out left to right;
 *       `from` + `morph` flips every character from the old value to `value` (the «cambia entera»
 *       beat; equal characters such as «…» stay). `mark` rings it in `markTone` (twins, «encaja»);
 *       `strike` draws a line through it. `hashLineSize(value, size, glyph?)` → { w, h }.
 *
 *   <OfferSheet width? tone? title? sub? rows? change? changeRow? changeTo? attached? attachedTone?
 *               attachedFrom? attachedMorph? attachedMark? glow? dim? stamp? style? />
 *       The offer document («Oferta comercial 2027 · para una naviera», three rows; row 0 is
 *       `12,40`). `change` 0–1 turns that price into `changeTo` (default `12,41`) with an amber
 *       highlight. `attached` = the fingerprint stuck to the bottom of the sheet ({ value, p }),
 *       the «huella pegada al documento». `stamp` is a free slot drawn over the sheet's
 *       bottom-right corner (e.g. s07's seal). `offerSheetSize(width, hasAttached)` → { w, h }.
 *
 *   <SaltGrain size tone? />  ·  <RoundsGlyph size tone? />
 *       Icons for the two password tricks: the die (salt) and the loop (thousands of rounds).
 *
 *   <FingerprintMachine width? label? caption? tone? run? frame? salt? saltLabel? saltTone? rounds? count?
 *                       countLabel? roundsTone? dim? style? />
 *       The machine, inlet on the left, outlet on the right, one-way chevrons inside.
 *       `label` is the algorithm plate (s04: «SHA-256»; null = no plate, e.g. s05, whose
 *       «SHA-512 a secas» is struck later). `run` lights it and spins the rollers (needs `frame`).
 *       `salt` 0–1 shows the hopper over the inlet with a grain falling in («dato al azar»).
 *       `rounds` 0–1 draws the loop from the outlet back to the inlet, with a counter chip
 *       (`count`, formatted 10.000) under the machine — it overhangs the box by
 *       MACHINE_LOOP_OVERHANG × height. `machineAnchors(width)` → { w, h, inlet, outlet, hopper }
 *       in the machine's own box coordinates, so scenes slide the document into the inlet and
 *       the HashLine out of the outlet themselves.
 */

// ---------------------------------------------------------------------------------------------
// Glyph

/** Points of one ridge: an ellipse arc from a0 to a1 degrees (0 = right, clockwise, y down). */
function ridge(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, steps = 28): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    pts.push(`${(cx + rx * Math.cos(a)).toFixed(2)} ${(cy + ry * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${pts.join(' L ')}`;
}

/** The whorl, in a 100×100 box: nested ridges open at the bottom, staggered like a real print. */
const RIDGES: string[] = [
  ridge(50, 52, 5, 7, 175, 405),
  ridge(50, 53, 12, 16, 160, 392),
  ridge(50, 54, 19, 25, 170, 388),
  ridge(50, 55, 26, 34, 158, 378),
  ridge(50, 56, 33, 42, 168, 372),
  // The print's skirt: short ridges low on each side.
  ridge(50, 56, 33, 42, 40, 68, 10),
  ridge(50, 56, 33, 42, 112, 140, 10),
];

export function FingerprintGlyph({
  size,
  tone = C.cyan,
  draw = 1,
  glow = 0,
  strokeWidth = 5,
  style,
}: {
  size: number;
  tone?: string;
  /** 0–1: ridges traced from the centre out. */
  draw?: number;
  glow?: number;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  const d = clamp01(draw);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: 'block', overflow: 'visible', filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 10 * glow)}px ${alpha(tone, 0.6 * glow)})` : undefined, ...style }}
      aria-hidden
    >
      {RIDGES.map((p, i) => {
        // Inner ridges finish first.
        const local = clamp01(d * 1.6 - (i / RIDGES.length) * 0.6);
        return (
          <path
            key={i}
            d={p}
            fill="none"
            stroke={tone}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - local}
            opacity={local > 0.001 ? 1 : 0}
          />
        );
      })}
    </svg>
  );
}

/** The «dato al azar» as an icon: a die (the salt grain the machine's hopper takes). */
export function SaltGrain({ size, tone = C.emerald, style }: { size: number; tone?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block', overflow: 'visible', ...style }} aria-hidden>
      <Grain x={20} y={20} s={26} tone={tone} />
    </svg>
  );
}

/** «Miles de veces» as an icon: a loop arrow around a small fingerprint. */
export function RoundsGlyph({ size, tone = C.emerald, style }: { size: number; tone?: string; style?: CSSProperties }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: 'absolute', inset: 0, overflow: 'visible' }} aria-hidden>
        <path d="M 33 14 A 15 15 0 1 0 35 24" fill="none" stroke={tone} strokeWidth={3.4} strokeLinecap="round" />
        <polygon points="29,8 38,10 34,18" fill={tone} />
      </svg>
      <div style={{ position: 'absolute', left: size * 0.3, top: size * 0.3 }}>
        <FingerprintGlyph size={size * 0.4} tone={tone} strokeWidth={8} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// The line

/** JetBrains Mono advance width per px of font size. */
const MONO_ADV = 0.6;
const SCRAMBLE = '0123456789abcdef';

/** Characters of `to`, flipping from `from` as p goes 0→1 (staggered left to right, scrambled mid-flip). */
export function morphHash(from: string, to: string, p: number): string {
  const n = Math.max(from.length, to.length);
  const t = clamp01(p);
  let out = '';
  for (let i = 0; i < n; i++) {
    const a = from[i] ?? ' ';
    const b = to[i] ?? ' ';
    if (a === b) {
      out += b;
      continue;
    }
    const start = (i / Math.max(1, n - 1)) * 0.55;
    const local = clamp01((t - start) / 0.45);
    if (local <= 0) out += a;
    else if (local >= 1) out += b;
    else out += SCRAMBLE[(Math.floor(local * 7) * 5 + i * 3 + a.charCodeAt(0)) % SCRAMBLE.length];
  }
  return out;
}

function hashMetrics(value: string, size: number, glyph: boolean) {
  const padX = Math.round(size * 0.36);
  const padY = Math.round(size * 0.2);
  const g = glyph ? Math.round(size * 1.05) : 0;
  const gap = glyph ? Math.round(size * 0.32) : 0;
  const textW = Math.ceil(value.length * size * MONO_ADV);
  return { padX, padY, g, gap, textW, w: padX * 2 + g + gap + textW + 6, h: padY * 2 + Math.max(g, Math.round(size * 1.2)) + 6 };
}

/** Outer box of a HashLine (border included). */
export function hashLineSize(value: string, size = 48, glyph = true): { w: number; h: number } {
  const m = hashMetrics(value, size, glyph);
  return { w: m.w, h: m.h };
}

export function HashLine({
  value,
  size = 48,
  tone = C.cyan,
  reveal = 1,
  from,
  morph = 1,
  glyph = true,
  glow = 0,
  mark = 0,
  markTone = C.amber,
  dim = 0,
  strike = 0,
  strikeTone = C.rose,
  style,
}: {
  value: string;
  size?: number;
  tone?: string;
  /** 0–1: characters typed out left to right (the pill is already full size). */
  reveal?: number;
  /** Previous value: with `morph` < 1, characters are still flipping from it. */
  from?: string;
  morph?: number;
  /** Show the fingerprint glyph (a number 0–1 traces it). */
  glyph?: boolean | number;
  glow?: number;
  /** 0–1: ring in `markTone`. */
  mark?: number;
  markTone?: string;
  dim?: number;
  /** 0–1: a line struck through the value. */
  strike?: number;
  strikeTone?: string;
  style?: CSSProperties;
}) {
  const showGlyph = glyph !== false;
  const m = hashMetrics(value, size, showGlyph);
  const shown = from !== undefined && morph < 1 ? morphHash(from, value, morph) : value;
  const typed = Math.round(clamp01(reveal) * shown.length);
  const mk = clamp01(mark);
  const edge = mk > 0.01 ? markTone : tone;
  const st = clamp01(strike);
  return (
    <div
      style={{
        position: 'relative',
        width: m.w,
        height: m.h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: m.gap,
        padding: `${m.padY}px ${m.padX}px`,
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(edge, 0.55 + 0.4 * Math.max(mk, glow))}`,
        background: `linear-gradient(180deg, ${alpha(edge, 0.14 + 0.08 * mk)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 0 ${Math.round(12 + 26 * Math.max(glow, mk))}px ${alpha(edge, 0.14 + 0.3 * Math.max(glow, mk))}`,
        ...dimStyle(dim),
        ...style,
      }}
    >
      {showGlyph ? <FingerprintGlyph size={m.g} tone={edge} draw={typeof glyph === 'number' ? glyph : 1} strokeWidth={5.5} /> : null}
      <span
        style={{
          fontFamily: FONT.mono,
          fontSize: size,
          fontWeight: 760,
          lineHeight: 1,
          letterSpacing: 0,
          whiteSpace: 'pre',
          color: C.textStrong,
          width: m.textW,
        }}
      >
        {shown.slice(0, typed)}
        <span style={{ opacity: 0 }}>{shown.slice(typed)}</span>
      </span>
      {st > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: m.padX - 6,
            top: m.h / 2 - 3,
            width: (m.w - 2 * m.padX + 12) * st,
            height: 6,
            borderRadius: 3,
            background: strikeTone,
            boxShadow: `0 0 10px ${alpha(strikeTone, 0.6)}`,
          }}
        />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// The offer

export interface OfferRow {
  label: string;
  value: string;
}

/** The offer's rows (fictional figures; row 0 is the price that changes by one cent in s04). */
export const OFFER_ROWS: readonly OfferRow[] = [
  { label: 'atraque, por metro', value: '12,40' },
  { label: 'practicaje', value: '8,75' },
  { label: 'bonificación', value: '6 %' },
];

export const OFFER_TITLE = 'Oferta comercial 2027';
export const OFFER_SUB = 'para una naviera';

function offerMetrics(width: number) {
  const k = width / 360;
  const pad = Math.round(20 * k);
  const head = Math.round(78 * k);
  const rowH = Math.round(44 * k);
  const attachH = Math.round(84 * k);
  return { k, pad, head, rowH, attachH };
}

/** Outer box of an OfferSheet (border included). */
export function offerSheetSize(width = 360, hasAttached = false, rows = OFFER_ROWS.length): { w: number; h: number } {
  const m = offerMetrics(width);
  return { w: width, h: m.pad * 2 + m.head + rows * m.rowH + (hasAttached ? m.attachH : 0) + 6 };
}

export function OfferSheet({
  width = 360,
  tone = C.cyan,
  title = OFFER_TITLE,
  sub = OFFER_SUB,
  rows = OFFER_ROWS,
  change = 0,
  changeRow = 0,
  changeTo = '12,41',
  attached,
  attachedTone,
  attachedFrom,
  attachedMorph = 1,
  attachedMark = 0,
  glow = 0,
  dim = 0,
  stamp,
  style,
}: {
  width?: number;
  /** Edge colour: cyan = the port's offer; rose for a forged one. */
  tone?: string;
  title?: string;
  sub?: string;
  rows?: readonly OfferRow[];
  /** 0–1: row `changeRow`'s value becomes `changeTo` (amber highlight). */
  change?: number;
  changeRow?: number;
  changeTo?: string;
  /** The fingerprint stuck to the bottom of the sheet: value + 0–1 appearance. */
  attached?: { value: string; p: number };
  attachedTone?: string;
  attachedFrom?: string;
  attachedMorph?: number;
  attachedMark?: number;
  glow?: number;
  dim?: number;
  /** Free slot over the sheet's bottom-right corner (e.g. a seal). */
  stamp?: ReactNode;
  style?: CSSProperties;
}) {
  const m = offerMetrics(width);
  const size = offerSheetSize(width, attached !== undefined, rows.length);
  const ch = clamp01(change);
  const ap = attached ? clamp01(attached.p) : 0;
  const hashSize = Math.round(30 * m.k);
  return (
    <div
      style={{
        position: 'relative',
        width: size.w,
        height: size.h,
        boxSizing: 'border-box',
        padding: m.pad,
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.7)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink800, 0.98)} 0%, ${alpha(C.ink900, 0.98)} 100%)`,
        boxShadow: `0 0 ${Math.round(16 + 24 * glow)}px ${alpha(tone, 0.14 + 0.3 * glow)}, 0 18px 40px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        ...dimStyle(dim),
        ...style,
      }}
    >
      {/* Header: file icon, title, «para una naviera» */}
      <div style={{ height: m.head, display: 'flex', alignItems: 'flex-start', gap: Math.round(12 * m.k) }}>
        <Icon name="file" size={Math.round(36 * m.k)} color={tone} strokeWidth={2.2} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: Math.round(27 * m.k), fontWeight: 820, lineHeight: 1.1, color: C.textStrong, whiteSpace: 'nowrap' }}>{title}</div>
          <div style={{ marginTop: Math.round(6 * m.k), fontSize: Math.round(22 * m.k), fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{sub}</div>
        </div>
      </div>
      {/* Rows */}
      {rows.map((r, i) => {
        const changing = i === changeRow && ch > 0.001;
        const value = changing && ch > 0.5 ? changeTo : r.value;
        return (
          <div
            key={r.label}
            style={{
              height: m.rowH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `2px solid ${alpha(C.ink600, 0.6)}`,
            }}
          >
            <span style={{ fontSize: Math.round(23 * m.k), fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>{r.label}</span>
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: Math.round(29 * m.k),
                fontWeight: 760,
                color: changing ? '#fde68a' : C.textStrong,
                whiteSpace: 'nowrap',
                padding: `${Math.round(2 * m.k)}px ${Math.round(8 * m.k)}px`,
                marginRight: -Math.round(8 * m.k),
                borderRadius: RADIUS.sm,
                background: changing ? alpha(C.amber, 0.22 * ch) : 'transparent',
                boxShadow: changing ? `0 0 0 ${Math.round(3 * m.k)}px ${alpha(C.amber, 0.75 * ch)}` : undefined,
                transform: changing ? `scale(${1 + 0.12 * Math.sin(Math.PI * ch)})` : undefined,
              }}
            >
              {value}
            </span>
          </div>
        );
      })}
      {/* The fingerprint, stuck to the bottom of the sheet */}
      {attached ? (
        <div
          style={{
            height: m.attachH,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            borderTop: `2px dashed ${alpha(C.ink500, 0.7)}`,
            opacity: ap,
            transform: `translateY(${(1 - ap) * -14}px) scale(${1.06 - 0.06 * ap})`,
          }}
        >
          <HashLine
            value={attached.value}
            size={hashSize}
            tone={attachedTone ?? tone}
            from={attachedFrom}
            morph={attachedMorph}
            mark={attachedMark}
            markTone={attachedTone ?? C.amber}
          />
        </div>
      ) : null}
      {stamp ? <div style={{ position: 'absolute', right: -Math.round(24 * m.k), bottom: -Math.round(24 * m.k) }}>{stamp}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// The machine

const MACHINE_RATIO = 0.56;
/** The rounds loop and its counter hang below the box by this fraction of the machine's height. */
export const MACHINE_LOOP_OVERHANG = 0.42;

/** Box size and anchor points (in the machine's own coordinates) for a machine of `width`. */
export function machineAnchors(width = 460) {
  const w = width;
  const h = Math.round(width * MACHINE_RATIO);
  return {
    w,
    h,
    /** Where the document goes in (middle of the left slot). */
    inlet: { x: Math.round(w * 0.06), y: Math.round(h * 0.56) },
    /** Where the line comes out (middle of the right slot). */
    outlet: { x: Math.round(w * 0.94), y: Math.round(h * 0.56) },
    /** Mouth of the salt hopper, over the inlet. */
    hopper: { x: Math.round(w * 0.2), y: Math.round(h * 0.12) },
  };
}

/** A small die: the «dato al azar». */
function Grain({ x, y, s, tone }: { x: number; y: number; s: number; tone: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(18)`}>
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={s * 0.22} fill={alpha(tone, 0.25)} stroke={tone} strokeWidth={3} />
      {[
        [-0.22, -0.22],
        [0.22, 0.22],
        [0, 0],
        [0.22, -0.22],
        [-0.22, 0.22],
      ].map(([dx, dy], i) => (
        <circle key={i} cx={dx * s} cy={dy * s} r={s * 0.075} fill={tone} />
      ))}
    </g>
  );
}

export function FingerprintMachine({
  width = 460,
  label = 'SHA-256',
  caption,
  tone = C.cyan,
  run = 0,
  frame = 0,
  salt = 0,
  saltLabel,
  saltTone = C.emerald,
  rounds = 0,
  count = 10000,
  countLabel = 'vueltas',
  roundsTone = C.emerald,
  dim = 0,
  style,
}: {
  width?: number;
  /** Algorithm plate; null = no plate. */
  label?: string | null;
  /** Small line under the plate (e.g. «máquina de huellas»). */
  caption?: string;
  tone?: string;
  /** 0–1: lit and working (rollers spin with `frame`). */
  run?: number;
  frame?: number;
  /** 0–1: hopper over the inlet; a grain falls into it (full at ~0.8). */
  salt?: number;
  saltLabel?: string;
  saltTone?: string;
  /** 0–1: the loop from the outlet back to the inlet, then its counter. */
  rounds?: number;
  /** Counter value at rounds = 1 (counts up with `rounds`). */
  count?: number;
  countLabel?: string;
  roundsTone?: string;
  dim?: number;
  style?: CSSProperties;
}) {
  const a = machineAnchors(width);
  const { w, h } = a;
  const r = clamp01(run);
  const s = clamp01(salt);
  const rd = clamp01(rounds);
  const spin = frame * 7 * r;
  const rollerR = w * 0.085;
  const rollers = [
    { x: w * 0.38, y: h * 0.64 },
    { x: w * 0.62, y: h * 0.64 },
  ];
  const body = { x: w * 0.06, y: h * 0.14, w: w * 0.88, h: h * 0.8 };
  const plateW = w * 0.5;
  const plateH = h * 0.24;
  const loopDraw = clamp01(rd / 0.6);
  const counterIn = clamp01((rd - 0.45) / 0.3);
  const counted = Math.round(count * clamp01((rd - 0.5) / 0.5));
  const loopY = h * (1 + MACHINE_LOOP_OVERHANG * 0.62);
  const grainY = (1 - clamp01(s / 0.8)) * -h * 0.55 + h * 0.02;
  return (
    <div style={{ position: 'relative', width: w, height: h, fontFamily: FONT.sans, ...dimStyle(dim), ...style }}>
      <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        <defs>
          <linearGradient id="fp-machine-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.ink700} />
            <stop offset="100%" stopColor={C.ink850} />
          </linearGradient>
        </defs>
        {/* Rounds loop (behind the body) */}
        {rd > 0.001 ? (
          <g opacity={Math.min(1, rd * 3)}>
            <path
              d={`M ${a.outlet.x} ${a.outlet.y} C ${w * 1.1} ${a.outlet.y}, ${w * 1.08} ${loopY}, ${w * 0.5} ${loopY} C ${w * -0.08} ${loopY}, ${w * -0.1} ${a.inlet.y}, ${a.inlet.x - 4} ${a.inlet.y}`}
              fill="none"
              stroke={roundsTone}
              strokeWidth={6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - loopDraw}
            />
            {loopDraw > 0.97 ? (
              <polygon
                points={`${a.inlet.x + 6},${a.inlet.y} ${a.inlet.x - 16},${a.inlet.y - 12} ${a.inlet.x - 16},${a.inlet.y + 12}`}
                fill={roundsTone}
              />
            ) : null}
          </g>
        ) : null}
        {/* Hopper (salt) */}
        {s > 0.001 ? (
          <g opacity={Math.min(1, s * 3)}>
            <path
              d={`M ${w * 0.1} ${-h * 0.14} L ${w * 0.3} ${-h * 0.14} L ${w * 0.235} ${h * 0.14} L ${w * 0.165} ${h * 0.14} Z`}
              fill={alpha(saltTone, 0.12)}
              stroke={alpha(saltTone, 0.85)}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <Grain x={w * 0.2} y={grainY} s={w * 0.07} tone={saltTone} />
          </g>
        ) : null}
        {/* Body */}
        <rect
          x={body.x}
          y={body.y}
          width={body.w}
          height={body.h}
          rx={22}
          fill="url(#fp-machine-body)"
          stroke={alpha(tone, 0.45 + 0.45 * r)}
          strokeWidth={4}
        />
        {r > 0.01 ? <rect x={body.x - 6} y={body.y - 6} width={body.w + 12} height={body.h + 12} rx={28} fill="none" stroke={alpha(tone, 0.22 * r)} strokeWidth={8} /> : null}
        {/* Inlet (tall: takes a whole document) and outlet (short: a short line) */}
        <rect x={body.x - 8} y={h * 0.32} width={16} height={h * 0.48} rx={6} fill={C.ink950} stroke={alpha(tone, 0.7)} strokeWidth={3} />
        <rect x={body.x + body.w - 8} y={h * 0.47} width={16} height={h * 0.18} rx={6} fill={C.ink950} stroke={alpha(tone, 0.7)} strokeWidth={3} />
        {/* One-way chevrons along the bottom */}
        {[0, 1, 2, 3].map((k) => {
          const cx = w * (0.22 + k * 0.19);
          const cy = h * 0.86;
          const lit = r > 0.01 ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((frame * 0.25 * r) - k * 0.9)) : 0.35;
          return (
            <path
              key={k}
              d={`M ${cx - 9} ${cy - 10} L ${cx + 3} ${cy} L ${cx - 9} ${cy + 10}`}
              fill="none"
              stroke={alpha(tone, 0.3 + 0.6 * lit * Math.max(0.4, r))}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
        {/* Rollers */}
        <line x1={rollers[0].x} y1={rollers[0].y - rollerR} x2={rollers[1].x} y2={rollers[1].y - rollerR} stroke={alpha(tone, 0.5)} strokeWidth={3} />
        <line x1={rollers[0].x} y1={rollers[0].y + rollerR} x2={rollers[1].x} y2={rollers[1].y + rollerR} stroke={alpha(tone, 0.5)} strokeWidth={3} />
        {rollers.map((p, k) => (
          <g key={k} transform={`translate(${p.x} ${p.y}) rotate(${spin + k * 30})`}>
            <circle r={rollerR} fill={C.ink900} stroke={alpha(tone, 0.55 + 0.4 * r)} strokeWidth={4} />
            {[0, 60, 120].map((deg) => (
              <line
                key={deg}
                x1={rollerR * 0.8 * Math.cos((deg * Math.PI) / 180)}
                y1={rollerR * 0.8 * Math.sin((deg * Math.PI) / 180)}
                x2={-rollerR * 0.8 * Math.cos((deg * Math.PI) / 180)}
                y2={-rollerR * 0.8 * Math.sin((deg * Math.PI) / 180)}
                stroke={alpha(tone, 0.5 + 0.4 * r)}
                strokeWidth={3}
                strokeLinecap="round"
              />
            ))}
            <circle r={rollerR * 0.22} fill={alpha(tone, 0.4 + 0.5 * r)} />
          </g>
        ))}
        {/* Lights */}
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={body.x + body.w - 30 - k * 24} cy={body.y + 24} r={7} fill={r > 0.01 ? alpha(k === 0 ? C.emerald : tone, 0.4 + 0.6 * r) : C.ink600} />
        ))}
      </svg>
      {/* Plate */}
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: (w - plateW) / 2,
            top: body.y + h * 0.08,
            width: plateW,
            height: plateH,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: RADIUS.sm,
            border: `2px solid ${alpha(tone, 0.6 + 0.3 * r)}`,
            background: alpha(C.ink950, 0.85),
            fontFamily: FONT.mono,
            fontSize: Math.round(w * 0.078),
            fontWeight: 800,
            color: r > 0.3 ? C.cyanSoft : C.text,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      ) : null}
      {caption ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: w,
            top: label ? body.y + h * 0.08 + plateH + 6 : body.y + h * 0.12,
            textAlign: 'center',
            fontSize: Math.round(w * 0.055),
            fontWeight: 700,
            color: C.muted,
            whiteSpace: 'nowrap',
          }}
        >
          {caption}
        </div>
      ) : null}
      {/* Salt label, over the hopper */}
      {saltLabel && s > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: w * 0.2 - 200,
            width: 400,
            top: -h * 0.14 - 50,
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 780,
            color: '#6ee7b7',
            whiteSpace: 'nowrap',
            opacity: Math.min(1, s * 2),
          }}
        >
          {saltLabel}
        </div>
      ) : null}
      {/* Rounds counter, under the machine */}
      {counterIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: w * 0.5 - 170,
            width: 340,
            top: loopY - 30,
            display: 'flex',
            justifyContent: 'center',
            opacity: counterIn,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 10,
              padding: '6px 18px',
              borderRadius: RADIUS.pill,
              background: C.ink900,
              border: `3px solid ${alpha(roundsTone, 0.85)}`,
              boxShadow: `0 0 18px ${alpha(roundsTone, 0.3)}`,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: '#6ee7b7', fontVariantNumeric: 'tabular-nums' }}>{fmtInt(counted)}</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{countLabel}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
