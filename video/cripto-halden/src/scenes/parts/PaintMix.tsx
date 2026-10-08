import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE } from '../../../../engine/src/theme/motion';
import { clamp01, cubicPoint, dimStyle, mix, type Point } from '../../../../engine/src/ui';
import { HouseKey, HOUSE_KEY_BASE } from './Mailbox';
import { PartyBadge } from './s02-familias/Parties';
import { Road, SHADOW_BASE, Shadow, shadowHeight } from './s02-familias/Road';

/**
 * «La mezcla de pinturas» — the Diffie-Hellman image of V11 (concept 5), built by s08 and reused
 * by s09 (and s10's icon). One drawing every time it comes back: a common colour everyone sees;
 * each side adds its own secret colour; the two MIXTURES cross the road in plain sight (the shadow
 * by the road sees them); each side pours its secret into the other's mixture and both reach the
 * SAME final colour, which becomes the house key of concept 1 (the session key, Mailbox.tsx's
 * HouseKey tinted with the final colour). The final colour never travels: it is never drawn on
 * the road (only as a struck ghost, after s08's answer, if a scene wants it).
 *
 * Colours: the port's things are outlined cyan, the shipping company's emerald, the road sky, the
 * shadow neutral grey (a generic onlooker — never NULL CIPHER, never rose). The paints themselves
 * are PAINT below; mixtures are blended from the same constants, so both sides' final colour is
 * provably identical (`PAINT.final` = blend of common + both secrets, in any order).
 *
 * Nothing is positioned and nothing reads the timeline: 0–1 weights only (plus `frame` where a
 * piece moves continuously). API (stable — add props with defaults only):
 *
 *   PAINT                 { common, port, naviera, mixPort, mixNaviera, final } — hex colours.
 *   blendPaint(...hex)    subtractive-looking blend (geometric mean per channel) → hex.
 *   lerpColor(a, b, t)    straight RGB interpolation → hex (for a pot whose colour is changing).
 *
 *   <PaintPot width color fill? tone? glow? dim? label? sub? lock? style? />
 *       A paint tin seen from the side; `color` shows on its label band, its surface and a drip.
 *       `tone` = owner outline. `lock` adds a small padlock badge (a secret colour). Label under
 *       it. Height = paintPotHeight(width) (+ label). PAINT_POT_BASE = 100×110 design units.
 *
 *   <PaintIcon size glow? style? />
 *       Compact icon for chips and rule cards (s09's X25519 chip, s10): two secret drops over a
 *       tin of the final colour.
 *
 *   <PaintKey width side? glow? dashed? />
 *       The session key: HouseKey in PAINT.final (side 'port' points right, 'naviera' left).
 *
 *   <Onlooker height glow? look? dim? eye? />
 *       The shadow by the road: s02-familias' `Shadow` (the same drawing as s02), with a halo.
 *
 *   <PaintExchange …weights />
 *       The whole s08 diagram in a 1728×660 box (the stage): two homes (port left, shipping
 *       company right, with s02's PartyBadge), s02's Road between them, s02's Shadow under it
 *       (s08: «vuelve la carretera de s02, con su sombra»), the common pot at the top
 *       centre and every pot move. Weights: scene, question, common, share, secretPort, secretNav,
 *       mixPort, mixNav, swap, peek, peekGlow, pour, same, keys, plus `frame`, `noLabels` and
 *       `labels` (overrides PAINT_LABELS). The scene draws its own statements. PAINT_LAYOUT
 *       gives the anchors (road box, onlooker, each home's slots) so a scene can place its own
 *       labels. See the prop docs for what each weight does.
 */

// ---------------------------------------------------------------------------------------------
// Colours

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex([r, g, b]: Rgb): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Paint-like blend: per-channel geometric mean (mixing darkens, like pigments do). */
export function blendPaint(...hexes: string[]): string {
  const rgbs = hexes.map(hexToRgb);
  const n = rgbs.length;
  const ch = (i: 0 | 1 | 2) => Math.exp(rgbs.reduce((s, c) => s + Math.log(Math.max(1, c[i])), 0) / n);
  return rgbToHex([ch(0), ch(1), ch(2)]);
}

/** Straight RGB interpolation, clamped. */
export function lerpColor(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex([x[0] + (y[0] - x[0]) * k, x[1] + (y[1] - x[1]) * k, x[2] + (y[2] - x[2]) * k]);
}

const COMMON = '#f1e4c3';
const PORT_SECRET = '#2b6fe0';
const NAV_SECRET = '#17a86c';

export const PAINT = {
  /** The common colour everyone sees. */
  common: COMMON,
  /** The port's secret colour (never leaves the port). */
  port: PORT_SECRET,
  /** The shipping company's secret colour (never leaves it). */
  naviera: NAV_SECRET,
  /** What travels: common + the port's secret. */
  mixPort: blendPaint(COMMON, PORT_SECRET),
  /** What travels: common + the shipping company's secret. */
  mixNaviera: blendPaint(COMMON, NAV_SECRET),
  /** What each side computes and nobody sends: common + both secrets. */
  final: blendPaint(COMMON, PORT_SECRET, NAV_SECRET),
} as const;

// ---------------------------------------------------------------------------------------------
// Pot

export const PAINT_POT_BASE = { w: 100, h: 110 } as const;

export function paintPotHeight(width: number): number {
  return (width * PAINT_POT_BASE.h) / PAINT_POT_BASE.w;
}

/** The tin in design units (100×110, rim at y 30). Draw inside an SVG <g transform>. */
function PotShape({ color, fill = 1, tone, glow = 0, lock = false, ghost = false }: { color: string; fill?: number; tone: string; glow?: number; lock?: boolean; ghost?: boolean }) {
  const f = clamp01(fill);
  const paint = f > 0.001 ? color : C.ink950;
  const band = f > 0.001 ? alpha(color, 0.25 + 0.75 * f) : alpha(C.ink700, 0.8);
  const sw = ghost ? 3 : 4;
  const dash = ghost ? '6 5' : undefined;
  return (
    <g opacity={ghost ? 0.85 : 1}>
      {glow > 0.01 ? <ellipse cx={50} cy={70} rx={62} ry={58} fill={alpha(color, 0.22 * glow)} /> : null}
      {/* Handle */}
      <path d="M 15 34 Q 50 -10 85 34" fill="none" stroke={alpha(C.muted, 0.85)} strokeWidth={3.5} strokeLinecap="round" strokeDasharray={dash} />
      {/* Body */}
      <path d="M 10 30 L 10 98 Q 10 108 21 108 L 79 108 Q 90 108 90 98 L 90 30 Z" fill={C.ink800} stroke={tone} strokeWidth={sw} strokeDasharray={dash} />
      {/* Label band: the colour, as you see it from the side */}
      <rect x={12} y={52} width={76} height={38} fill={band} />
      <line x1={12} y1={52} x2={88} y2={52} stroke={alpha(tone, 0.6)} strokeWidth={2} />
      <line x1={12} y1={90} x2={88} y2={90} stroke={alpha(tone, 0.6)} strokeWidth={2} />
      {/* Surface */}
      <ellipse cx={50} cy={30} rx={40} ry={9} fill={paint} stroke={tone} strokeWidth={sw} strokeDasharray={dash} />
      {/* A drip over the rim */}
      {f > 0.001 && !ghost ? <path d="M 26 32 Q 26 44 30 46 Q 34 44 34 34 Z" fill={color} opacity={f} /> : null}
      {lock ? (
        <g transform="translate(66 60)">
          <rect x={0} y={8} width={20} height={16} rx={3} fill={C.ink950} stroke={C.textStrong} strokeWidth={2.2} />
          <path d="M 4 9 L 4 4 A 6 6 0 0 1 16 4 L 16 9" fill="none" stroke={C.textStrong} strokeWidth={2.2} />
        </g>
      ) : null}
    </g>
  );
}

export function PaintPot({
  width,
  color,
  fill = 1,
  tone = C.muted,
  glow = 0,
  dim = 0,
  label,
  sub,
  labelColor,
  lock = false,
  ghost = false,
  style,
}: {
  width: number;
  color: string;
  /** 0–1: how much paint shows (0 = empty tin). */
  fill?: number;
  /** Outline: cyan = the port's, emerald = the shipping company's, muted = everyone's. */
  tone?: string;
  glow?: number;
  dim?: number;
  label?: ReactNode;
  sub?: ReactNode;
  labelColor?: string;
  /** A small padlock: a secret colour. */
  lock?: boolean;
  /** Dashed outline (a copy someone only saw). */
  ghost?: boolean;
  style?: CSSProperties;
}) {
  const h = paintPotHeight(width);
  return (
    <div style={{ position: 'relative', width, ...dimStyle(dim), ...style }}>
      <svg width={width} height={h} viewBox="0 0 100 110" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
        <PotShape color={color} fill={fill} tone={tone} glow={glow} lock={lock} ghost={ghost} />
      </svg>
      {label ? <PotLabel width={width} label={label} sub={sub} color={labelColor ?? C.textStrong} /> : null}
    </div>
  );
}

function PotLabel({ width, label, sub, color, size = 32 }: { width: number; label: ReactNode; sub?: ReactNode; color: string; size?: number }) {
  return (
    <div style={{ position: 'absolute', left: width / 2 - 220, width: 440, top: '100%', marginTop: 8, textAlign: 'center', fontFamily: FONT.sans }}>
      <div style={{ fontSize: size, fontWeight: 800, color, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{label}</div>
      {sub ? <div style={{ fontSize: Math.round(size * 0.82), fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', marginTop: 2 }}>{sub}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Icon and key

/** Compact paint icon: two secret drops (port blue, shipping-company green) over a tin of the final colour. */
export function PaintIcon({ size, glow = 0, style }: { size: number; glow?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible', ...style }} aria-hidden>
      {glow > 0.01 ? <circle cx={50} cy={55} r={50} fill={alpha(PAINT.final, 0.25 * glow)} /> : null}
      {/* Drops */}
      <path d="M 28 4 C 20 16 16 22 16 28 A 12 12 0 0 0 40 28 C 40 22 36 16 28 4 Z" fill={PAINT.port} stroke={C.cyan} strokeWidth={3} />
      <path d="M 72 4 C 64 16 60 22 60 28 A 12 12 0 0 0 84 28 C 84 22 80 16 72 4 Z" fill={PAINT.naviera} stroke={C.emerald} strokeWidth={3} />
      {/* Tin */}
      <g transform="translate(14 36) scale(0.72)">
        <path d="M 10 30 L 10 98 Q 10 108 21 108 L 79 108 Q 90 108 90 98 L 90 30 Z" fill={C.ink800} stroke={C.textStrong} strokeWidth={5} />
        <rect x={12} y={50} width={76} height={42} fill={PAINT.final} />
        <ellipse cx={50} cy={30} rx={40} ry={10} fill={PAINT.final} stroke={C.textStrong} strokeWidth={5} />
      </g>
    </svg>
  );
}

/** The session key: Mailbox.tsx's HouseKey in the final colour. `side` points its tip toward the other side. */
export function PaintKey({ width, side = 'port', glow = 0, dashed = false, style }: { width: number; side?: 'port' | 'naviera'; glow?: number; dashed?: boolean; style?: CSSProperties }) {
  return <HouseKey width={width} color={PAINT.final} glow={glow} glowColor={PAINT.final} dashed={dashed} flip={side === 'port'} style={style} />;
}

// ---------------------------------------------------------------------------------------------
// The onlooker (s02's shadow)

/** Width / height of the onlooker (s02's Shadow, 100×130 design units). */
export const ONLOOKER_RATIO = SHADOW_BASE.w / SHADOW_BASE.h;

/**
 * The shadow by the road — s02-familias' `Shadow`, the same drawing (dark ink, one eye). `look`
 * is kept for API stability (s02's eye does not turn); `glow` haloes it.
 */
export function Onlooker({ height, glow = 0, look = 0, dim = 0, eye = 1, style }: { height: number; glow?: number; look?: number; dim?: number; eye?: number; style?: CSSProperties }) {
  const w = height * ONLOOKER_RATIO;
  void look;
  return (
    <div style={{ position: 'relative', width: w, height, filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(6 + 16 * glow)}px ${alpha(C.muted, 0.55 * glow)})` : undefined, ...style }}>
      <Shadow width={w} eye={eye} dim={dim} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// The whole exchange

const BOX = { w: 1728, h: 660 } as const;
const POT_W = 148;
const SECRET_W = 112;
const POT_H = paintPotHeight(POT_W);
const FLOOR = 404;
const SHADOW_W = 84;
const BADGE = 104;

/** Anchors of PaintExchange (its own 1728×660 box = stage-local coordinates). */
export const PAINT_LAYOUT = {
  box: BOX,
  homePort: { x: 0, y: 36, w: 300, h: 560 },
  homeNav: { x: 1428, y: 36, w: 300, h: 560 },
  /** s02's road, same drawing (Road from s02-familias). */
  road: { x: 300, y: 328, w: 1128, h: 80 },
  /** Centre-top of each side's badge (PartyBadge, ring BADGE px). */
  badgePort: { x: 74, y: 52 },
  badgeNav: { x: 1654, y: 52 },
  badgeSize: BADGE,
  /** Bottom-centre of each side's mixing pot (where the mixture, then the final colour, sits). */
  mixPort: { x: 214, y: FLOOR },
  mixNav: { x: 1514, y: FLOOR },
  /** Bottom-centre of each secret pot. */
  secretPort: { x: 72, y: FLOOR },
  secretNav: { x: 1656, y: FLOOR },
  /** Bottom-centre of the common pot. */
  common: { x: 864, y: 230 },
  /** Top-centre of the onlooker (s02's Shadow), and its height. */
  onlooker: { x: 864, y: 424, h: Math.round(shadowHeight(SHADOW_W)) },
  /** Bottom-centre of the onlooker's two copies (port's mixture left, shipping company's right). */
  peekPort: { x: 718, y: 534 },
  peekNav: { x: 1010, y: 534 },
  /** Free band under the onlooker for one line of text (top y, centre x). */
  underOnlooker: { x: 864, y: 560 },
  potW: POT_W,
  secretW: SECRET_W,
} as const;

type PotState = { x: number; y: number; w: number; color: string; fill?: number; tone: string; rot?: number; glow?: number; opacity?: number; lock?: boolean; ghost?: boolean };

/** A pot in the shared SVG, placed by its bottom-centre; `rot` tilts it about the rim's far edge. */
function SvgPot({ p }: { p: PotState }) {
  const s = p.w / PAINT_POT_BASE.w;
  const h = PAINT_POT_BASE.h * s;
  const pivotX = p.rot && p.rot < 0 ? 10 : 90;
  return (
    <g transform={`translate(${p.x - p.w / 2} ${p.y - h}) scale(${s}) rotate(${p.rot ?? 0} ${pivotX} 30)`} opacity={p.opacity ?? 1}>
      <PotShape color={p.color} fill={p.fill} tone={p.tone} glow={p.glow} lock={p.lock} ghost={p.ghost} />
    </g>
  );
}

/** The pivot (the lip that pours) of a tilted pot, in box coordinates. */
function lipOf(p: { x: number; y: number; w: number; rot?: number }): Point {
  const s = p.w / PAINT_POT_BASE.w;
  const h = PAINT_POT_BASE.h * s;
  return { x: p.x - p.w / 2 + (p.rot && p.rot < 0 ? 10 : 90) * s, y: p.y - h + 30 * s };
}

/** Point along an arc from a to b with a vertical hump (negative = up). */
function arc(a: Point, b: Point, t: number, hump: number): Point {
  return cubicPoint([a, { x: mix(a.x, b.x, 0.25), y: a.y + hump }, { x: mix(a.x, b.x, 0.75), y: b.y + hump }, b], EASE.inOut(clamp01(t)));
}

/** A secret poured into a pot: it rises over it, tilts and streams, then goes home (phase t 0–1). */
function pourMotion(home: Point, over: Point, t: number, towardRight: boolean) {
  const k = clamp01(t);
  const up = clamp01(k / 0.3);
  const back = clamp01((k - 0.75) / 0.25);
  const tilt = clamp01((k - 0.25) / 0.15) * (1 - clamp01((k - 0.7) / 0.1));
  const posT = up * (1 - back);
  const x = mix(home.x, over.x, EASE.inOut(posT));
  const y = mix(home.y, over.y, EASE.inOut(posT));
  const rot = (towardRight ? 1 : -1) * 78 * EASE.inOut(tilt);
  return { x, y, rot, streaming: tilt > 0.6, flow: clamp01((tilt - 0.6) / 0.4) };
}

export function PaintExchange({
  frame = 0,
  scene = 1,
  question = 0,
  common = 0,
  share = 0,
  secretPort = 0,
  secretNav = 0,
  mixPort = 0,
  mixNav = 0,
  swap = 0,
  peek = 0,
  pour = 0,
  same = 0,
  keys = 0,
  peekGlow = 0,
  noLabels = false,
  labels = {},
  style,
}: {
  frame?: number;
  /** 0–1: badges, homes, road and onlooker. */
  scene?: number;
  /** 0–1: s02's question on the road — the house key's copy, dashed, watched by the onlooker. */
  question?: number;
  /** 0–1: the common pot appears at the top centre. */
  common?: number;
  /** 0–1: a copy of the common colour goes into each side's mixing pot; the centre pot fades. */
  share?: number;
  /** 0–1: each side's secret pot appears in its home. */
  secretPort?: number;
  secretNav?: number;
  /** 0–1: each secret is poured into that side's common copy (colour becomes the mixture). */
  mixPort?: number;
  mixNav?: number;
  /** 0–1: the two mixtures cross the road (port's over the top, the shipping company's under). */
  swap?: number;
  /** 0–1: the onlooker's copies of both mixtures appear by it (it saw them pass). */
  peek?: number;
  /** 0–1: each side pours its secret into the mixture it received: both turn PAINT.final. */
  pour?: number;
  /** 0–1: both final pots glow (the same colour). */
  same?: number;
  /** 0–1: the final pots become the session key, one per side. */
  keys?: number;
  /** 0–1: highlight the onlooker and its copies («una mezcla no se separa»). */
  peekGlow?: number;
  noLabels?: boolean;
  /** Override pot/home captions. */
  labels?: Partial<typeof PAINT_LABELS>;
  style?: CSSProperties;
}) {
  const L = PAINT_LAYOUT;
  const T = { ...PAINT_LABELS, ...labels };
  const sc = clamp01(scene);

  // ---- common pot and its copies
  const cm = clamp01(common);
  const sh = clamp01(share);
  const commonOpacity = cm * (1 - clamp01((sh - 0.7) / 0.3));
  const commonPot: PotState = { x: L.common.x, y: L.common.y, w: POT_W + 20, color: PAINT.common, tone: C.muted, opacity: commonOpacity };
  const copyPort = arc({ x: L.common.x, y: L.common.y }, L.mixPort, sh, -60);
  const copyNav = arc({ x: L.common.x, y: L.common.y }, L.mixNav, sh, -60);

  // ---- mixing: colour of each side's own pot before the swap
  const mp = clamp01(mixPort);
  const mn = clamp01(mixNav);
  const mixPortColor = lerpColor(PAINT.common, PAINT.mixPort, clamp01((mp - 0.45) / 0.35));
  const mixNavColor = lerpColor(PAINT.common, PAINT.mixNaviera, clamp01((mn - 0.45) / 0.35));

  // ---- swap: the port's mixture travels right over a hump; the shipping company's left, lower.
  const sw = clamp01(swap);
  const bob = Math.sin(frame * 0.45) * 3 * Math.sin(Math.PI * sw);
  const portTravel0 = arc(L.mixPort, L.mixNav, sw, -84);
  const navTravel0 = arc(L.mixNav, L.mixPort, sw, 14);
  const portTravel = { x: portTravel0.x, y: portTravel0.y + bob };
  const navTravel = { x: navTravel0.x, y: navTravel0.y - bob };

  // ---- second pour: each side's secret into the mixture it received
  const pr = clamp01(pour);
  const portFinal = lerpColor(PAINT.mixNaviera, PAINT.final, clamp01((pr - 0.45) / 0.35));
  const navFinal = lerpColor(PAINT.mixPort, PAINT.final, clamp01((pr - 0.45) / 0.35));
  const kk = clamp01(keys);
  const sm = clamp01(same);

  // Secret pots: their first pour (mixing) and their second (into the received mixture).
  // Pour from just above and inside of the mixing pot, clear of the badges.
  const overPort = { x: L.mixPort.x - 8, y: L.mixPort.y - POT_H + 4 };
  const overNav = { x: L.mixNav.x + 8, y: L.mixNav.y - POT_H + 4 };
  const portMotion = pr > 0 ? pourMotion(L.secretPort, overPort, pr, true) : pourMotion(L.secretPort, overPort, mp, true);
  const navMotion = pr > 0 ? pourMotion(L.secretNav, overNav, pr, false) : pourMotion(L.secretNav, overNav, mn, false);
  const secretOut = 1 - clamp01((kk - 0.1) / 0.4);
  const secretPortPot: PotState = { x: portMotion.x, y: portMotion.y, rot: portMotion.rot, w: SECRET_W, color: PAINT.port, tone: C.cyan, lock: true, opacity: clamp01(secretPort) * secretOut };
  const secretNavPot: PotState = { x: navMotion.x, y: navMotion.y, rot: navMotion.rot, w: SECRET_W, color: PAINT.naviera, tone: C.emerald, lock: true, opacity: clamp01(secretNav) * secretOut };

  // Mixing pots: before the swap each holds its own mixture; during it they travel; after it, the other's.
  const showCopies = sh > 0.001;
  const travelling = sw > 0.001 && sw < 0.999;
  const swapped = sw >= 0.999;
  const portOwn: PotState = swapped
    ? { x: L.mixPort.x, y: L.mixPort.y, w: POT_W, color: portFinal, tone: C.cyan, glow: 0.9 * sm }
    : { x: travelling ? portTravel.x : copyPort.x, y: travelling ? portTravel.y : copyPort.y, w: POT_W, color: mixPortColor, tone: travelling ? C.sky : C.cyan };
  const navOwn: PotState = swapped
    ? { x: L.mixNav.x, y: L.mixNav.y, w: POT_W, color: navFinal, tone: C.emerald, glow: 0.9 * sm }
    : { x: travelling ? navTravel.x : copyNav.x, y: travelling ? navTravel.y : copyNav.y, w: POT_W, color: mixNavColor, tone: travelling ? C.sky : C.emerald };
  const potsOpacity = (showCopies ? 1 : 0) * (1 - clamp01((kk - 0.2) / 0.4));

  const pk = clamp01(peek);
  const og = clamp01(peekGlow);

  // Streams
  const streams: { from: Point; to: Point; color: string; flow: number }[] = [];
  const addStream = (m: ReturnType<typeof pourMotion>, color: string, target: Point) => {
    if (!m.streaming) return;
    streams.push({ from: lipOf({ x: m.x, y: m.y, w: SECRET_W, rot: m.rot }), to: target, color, flow: m.flow });
  };
  addStream(portMotion, PAINT.port, { x: L.mixPort.x, y: L.mixPort.y - POT_H + 14 });
  addStream(navMotion, PAINT.naviera, { x: L.mixNav.x, y: L.mixNav.y - POT_H + 14 });

  // Keys: inside each home, never on the road (the copy nobody had to carry)
  const keyW = 190;
  const keyH = (keyW * HOUSE_KEY_BASE.h) / HOUSE_KEY_BASE.w;
  const keyIn = clamp01((kk - 0.3) / 0.5);
  const keyTop = L.road.y - keyH - 30;

  // The onlooker's eye lines to whatever is on the road.
  const q = clamp01(question);
  const eyeAt = { x: L.onlooker.x, y: L.onlooker.y + L.onlooker.h * 0.28 };
  const ghostKey = { x: L.road.x + L.road.w * 0.36, y: L.road.y + L.road.h / 2 };
  const watching: Point[] = [];
  if (q > 0.05) watching.push(ghostKey);
  if (travelling) watching.push({ x: portTravel.x, y: portTravel.y - POT_H / 2 }, { x: navTravel.x, y: navTravel.y - POT_H / 2 });

  return (
    <div style={{ position: 'relative', width: BOX.w, height: BOX.h, fontFamily: FONT.sans, opacity: sc, ...style }}>
      <svg width={BOX.w} height={BOX.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        {/* Homes: faint panels (what is inside never goes on the road) */}
        {[L.homePort, L.homeNav].map((h, i) => (
          <rect
            key={i}
            x={h.x + 6}
            y={h.y}
            width={h.w - 12}
            height={h.h}
            rx={28}
            fill={alpha(i === 0 ? C.cyan : C.emerald, 0.04)}
            stroke={alpha(i === 0 ? C.cyan : C.emerald, 0.3)}
            strokeWidth={2.5}
          />
        ))}
      </svg>

      {/* s02's road */}
      <div style={{ position: 'absolute', left: L.road.x, top: L.road.y }}>
        <Road width={L.road.w} height={L.road.h} glow={0.4 * Math.sin(Math.PI * sw)} />
      </div>

      {/* Badges */}
      {!noLabels ? (
        <>
          <div style={{ position: 'absolute', left: L.badgePort.x, top: L.badgePort.y, transform: 'translateX(-50%)' }}>
            <PartyBadge who="port" size={BADGE} label={T.port} labelSize={34} />
          </div>
          <div style={{ position: 'absolute', left: L.badgeNav.x, top: L.badgeNav.y, transform: 'translateX(-50%)' }}>
            <PartyBadge who="naviera" size={BADGE} label={T.naviera} labelSize={34} />
          </div>
        </>
      ) : null}

      {/* The onlooker under the road (s02's shadow) */}
      <div style={{ position: 'absolute', left: L.onlooker.x - SHADOW_W / 2, top: L.onlooker.y }}>
        <Onlooker height={L.onlooker.h} glow={og} />
      </div>

      <svg width={BOX.w} height={BOX.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        {/* What the onlooker watches */}
        {watching.map((p, i) => (
          <line key={i} x1={eyeAt.x} y1={eyeAt.y} x2={p.x} y2={p.y} stroke={alpha('#e2e8f0', 0.32)} strokeWidth={2.5} strokeDasharray="6 8" />
        ))}

        {/* Onlooker's copies of the two mixtures */}
        {pk > 0.001 ? (
          <>
            <SvgPot p={{ x: L.peekPort.x, y: L.peekPort.y, w: 84, color: PAINT.mixPort, tone: C.muted, ghost: true, opacity: pk, glow: 0.6 * og }} />
            <SvgPot p={{ x: L.peekNav.x, y: L.peekNav.y, w: 84, color: PAINT.mixNaviera, tone: C.muted, ghost: true, opacity: pk, glow: 0.6 * og }} />
          </>
        ) : null}

        {/* The common pot */}
        {cm > 0.001 ? <SvgPot p={commonPot} /> : null}

        {/* Mixing pots (their own mixtures, travelling, then the final colour) */}
        {potsOpacity > 0.001 ? (
          <>
            <SvgPot p={{ ...portOwn, opacity: potsOpacity }} />
            <SvgPot p={{ ...navOwn, opacity: potsOpacity }} />
          </>
        ) : null}

        {/* Streams */}
        {streams.map((s, i) => (
          <path
            key={i}
            d={`M ${s.from.x} ${s.from.y} Q ${s.from.x} ${(s.from.y + s.to.y) / 2} ${s.to.x} ${s.to.y}`}
            fill="none"
            stroke={s.color}
            strokeWidth={9}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - s.flow}
          />
        ))}

        {/* Secret pots */}
        {clamp01(secretPort) > 0.001 && secretOut > 0.001 ? <SvgPot p={secretPortPot} /> : null}
        {clamp01(secretNav) > 0.001 && secretOut > 0.001 ? <SvgPot p={secretNavPot} /> : null}
      </svg>

      {/* s02's question: the dashed copy of the house key on the road */}
      {q > 0.001 ? (
        <div style={{ position: 'absolute', left: ghostKey.x - 62, top: ghostKey.y - 25, opacity: q }}>
          <HouseKey width={124} dashed color="#f1f5f9" glow={0.5} glowColor="#e2e8f0" />
        </div>
      ) : null}

      {/* Keys: the final colour becomes the house key, one per side */}
      {keyIn > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: L.homePort.x + (L.homePort.w - keyW) / 2, top: keyTop, opacity: keyIn, transform: `scale(${0.7 + 0.3 * keyIn})` }}>
            <PaintKey width={keyW} side="port" glow={0.8} />
          </div>
          <div style={{ position: 'absolute', left: L.homeNav.x + (L.homeNav.w - keyW) / 2, top: keyTop, opacity: keyIn, transform: `scale(${0.7 + 0.3 * keyIn})` }}>
            <PaintKey width={keyW} side="naviera" glow={0.8} />
          </div>
        </>
      ) : null}

      {/* Pot captions */}
      {!noLabels ? (
        <>
          {cm > 0.001 ? <Caption x={L.common.x} y={L.common.y + 6} text={T.common} sub={T.commonSub} opacity={commonOpacity} /> : null}
          <Caption x={L.secretPort.x} y={L.secretPort.y + 8} text={T.secret} color={C.cyanSoft} opacity={clamp01(secretPort) * (1 - clamp01(mp * 4)) * secretOut} />
          <Caption x={L.secretNav.x} y={L.secretNav.y + 8} text={T.secret} color={'#6ee7b7'} opacity={clamp01(secretNav) * (1 - clamp01(mn * 4)) * secretOut} />
          <Caption x={L.mixPort.x - 30} y={L.mixPort.y + 8} text={swapped ? T.final : T.mix} color={swapped ? C.textStrong : C.text} opacity={(swapped ? clamp01((pr - 0.8) / 0.2) : clamp01((mp - 0.8) / 0.2) * (1 - clamp01(sw * 8))) * (1 - kk)} />
          <Caption x={L.mixNav.x + 30} y={L.mixNav.y + 8} text={swapped ? T.final : T.mix} color={swapped ? C.textStrong : C.text} opacity={(swapped ? clamp01((pr - 0.8) / 0.2) : clamp01((mn - 0.8) / 0.2) * (1 - clamp01(sw * 8))) * (1 - kk)} />
        </>
      ) : null}
    </div>
  );
}

/** Default captions of PaintExchange (Spanish, on screen). */
export const PAINT_LABELS = {
  port: 'puerto',
  naviera: 'naviera',
  common: 'color común',
  commonSub: 'lo ve todo el mundo',
  secret: 'secreto',
  mix: 'mezcla',
  final: 'color final',
};

function Caption({ x, y, text, sub, color = C.textStrong, opacity, size = 32 }: { x: number; y: number; text: string; sub?: string; color?: string; opacity: number; size?: number }) {
  if (opacity <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x - 220, width: 440, top: y, textAlign: 'center', opacity, fontFamily: FONT.sans }}>
      <div style={{ fontSize: size, fontWeight: 800, color, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{text}</div>
      {sub ? <div style={{ fontSize: Math.round(size * 0.86), fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{sub}</div> : null}
    </div>
  );
}
