import { useId, type CSSProperties, type ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/**
 * Low-level drawings shared by V17's parts (EntranceGate, RoleLanes, Sites, Shipment, Customs), so the
 * same object is drawn ONE way everywhere: the accreditation card (same look as V16's s02 badge: photo
 * square + two bars, never text), the side-view truck (the gate's driver and the IPSec shipment), the
 * seal («precinto», on AH's bag and ESP's box), the load, a person's bust and the phone handset.
 *
 * Everything here draws inside the caller's <svg>, in the caller's design units; nothing reads the
 * timeline and nothing is positioned by itself.
 */

/** V17's line palette. Structure (walls, fences, ground, the street) belongs to nobody: slate. */
export const INK = {
  struct: '#64748b',
  structSoft: '#475569',
  structFaint: '#334155',
  steel: '#cbd5e1',
  fill: C.ink800,
  fillSoft: C.ink850,
  fillDeep: C.ink900,
  /** Someone not yet identified (the driver, the hotel guest): neutral, not cyan. */
  person: '#e2e8f0',
  violetSoft: '#c4b5fd',
  emeraldSoft: '#6ee7b7',
  skySoft: '#7dd3fc',
  amberSoft: '#fcd34d',
  /** Warm window light (the booth, the office). */
  lamp: '#fde68a',
  water: '#0a2236',
  waterLine: '#1e4a66',
  /** The plate's paper and ink (a plate is drawn, never written). */
  plate: '#e8edf3',
  plateInk: '#0f172a',
} as const;

/** Ids for SVG defs, unique per instance and safe inside url(#…). */
export function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export const dropGlow = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 16 * g)}px ${alpha(color, 0.6 * g)})` : '');
export const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;

/**
 * Blend two #rrggbb colours (t 0–1) into a #rrggbb colour. Use this instead of remotion's
 * interpolateColors here: that returns rgba(), which the theme's alpha() (hex only) can't tint.
 */
export function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * k).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

/** A stroke-width helper: `sw(base, minPx)` in design units, never thinner than `minPx` on screen at scale `s`. */
export function strokeAt(s: number) {
  return (base: number, minPx: number) => Math.max(base, minPx / s);
}

/**
 * Style for one element of a composite (an SVG <g> or an HTML label): `focus` glows it in `color`,
 * `dim` steps it back (opacity 0.4, half saturation), `show` fades it in.
 */
export function elementStyle({ focus = 0, dim = 0, show = 1, color = C.cyan }: { focus?: number; dim?: number; show?: number; color?: string }): CSSProperties {
  const f = clamp01(focus);
  const d = clamp01(dim) * (1 - f);
  return {
    opacity: clamp01(show) * (1 - 0.6 * d),
    filter: joinFilters(dropGlow(color, f), d > 0.01 ? `saturate(${1 - 0.5 * d})` : ''),
  };
}

/** Resolves per-element focus/dim maps with auto-dim: when one element is in focus, the others step back. */
export function resolveFocus<K extends string>(keys: readonly K[], focus: Partial<Record<K, number>>, dim: Partial<Record<K, number>>, autoDim: boolean) {
  const maxF = keys.reduce((m, k) => Math.max(m, clamp01(focus[k] ?? 0)), 0);
  const out = {} as Record<K, { focus: number; dim: number }>;
  for (const k of keys) {
    const f = clamp01(focus[k] ?? 0);
    const auto = autoDim ? Math.max(0, maxF - f) : 0;
    out[k] = { focus: f, dim: Math.max(clamp01(dim[k] ?? 0), auto) };
  }
  return out;
}

/** Point along a polyline at 0–1 of its length (+ the segment's direction). */
export function polylinePoint(pts: readonly { x: number; y: number }[], t: number): { x: number; y: number; angle: number } {
  if (pts.length === 1) return { ...pts[0], angle: 0 };
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    lens.push(l);
    total += l;
  }
  let d = clamp01(t) * total;
  for (let i = 1; i < pts.length; i++) {
    const l = lens[i - 1];
    if (d <= l || i === pts.length - 1) {
      const k = l > 0 ? Math.min(1, d / l) : 0;
      const a = pts[i - 1];
      const b = pts[i];
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, angle: Math.atan2(b.y - a.y, b.x - a.x) };
    }
    d -= l;
  }
  const last = pts[pts.length - 1];
  return { ...last, angle: 0 };
}

export function polylineLength(pts: readonly { x: number; y: number }[]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return total;
}

export function polylinePath(pts: readonly { x: number; y: number }[]): string {
  return pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
}

/** An arrowhead (filled chevron) at `tip`, pointing along `angle` (radians). */
export function ArrowHead({ x, y, angle, size = 18, color }: { x: number; y: number; angle: number; size?: number; color: string }) {
  const deg = (angle * 180) / Math.PI;
  return (
    <path
      d={`M 0 0 L ${-size} ${-size * 0.62} L ${-size * 0.72} 0 L ${-size} ${size * 0.62} Z`}
      transform={`translate(${x} ${y}) rotate(${deg})`}
      fill={color}
      stroke={color}
      strokeWidth={size * 0.12}
      strokeLinejoin="round"
    />
  );
}

/** An engine Icon placed inside an <svg> (centred at x, y). */
export function SvgIcon({ name, x, y, size, color, strokeWidth = 1.8 }: { name: IconName; x: number; y: number; size: number; color: string; strokeWidth?: number }) {
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2})`}>
      <Icon name={name} size={size} color={color} strokeWidth={strokeWidth} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// The accreditation card (V16's badge: photo square + two bars; never text, never a number)

export const CARD_BASE = { w: 84, h: 58 } as const;

/** The accreditation card, centred at (x, y), 84 × 58 units × `scale`. */
export function CardGlyph({
  x,
  y,
  scale = 1,
  color = C.cyan,
  show = 1,
  rotate = 0,
  strokeWidth = 3.4,
  halo = true,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  show?: number;
  rotate?: number;
  strokeWidth?: number;
  halo?: boolean;
}) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  const { w, h } = CARD_BASE;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={Math.min(1, s * 1.3)}>
      {halo ? <rect x={-w / 2 - 10} y={-h / 2 - 10} width={w + 20} height={h + 20} rx={16} fill={alpha(color, 0.14)} /> : null}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={9} fill={C.ink800} stroke={color} strokeWidth={strokeWidth} />
      <rect x={-w / 2 + 10} y={-h / 2 + 12} width={22} height={28} rx={3} fill={alpha(color, 0.38)} />
      <line x1={-w / 2 + 40} y1={-6} x2={w / 2 - 10} y2={-6} stroke={color} strokeWidth={4.2} strokeLinecap="round" />
      <line x1={-w / 2 + 40} y1={8} x2={w / 2 - 22} y2={8} stroke={alpha(color, 0.6)} strokeWidth={4.2} strokeLinecap="round" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Person (bust) and phone handset

/** A bust: head centred at (x, y), radius 14 × scale; shoulders below down to y + 44 × scale. */
export function PersonBust({ x, y, scale = 1, color = INK.person, strokeWidth = 3, fill = 0.22 }: { x: number; y: number; scale?: number; color?: string; strokeWidth?: number; fill?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinejoin="round">
      <path d="M -26 46 Q -25 20 0 18 Q 25 20 26 46 Z" fill={alpha(color, fill)} stroke={color} strokeWidth={strokeWidth / scale} />
      <circle cx={0} cy={0} r={14} fill={alpha(color, fill)} stroke={color} strokeWidth={strokeWidth / scale} />
    </g>
  );
}

/** The phone handset (V12's handset path, 24×24), centred at (x, y), `size` units. */
export function HandsetGlyph({ x, y, size = 30, color, rotate = 0, strokeWidth = 1.8 }: { x: number; y: number; size?: number; color: string; rotate?: number; strokeWidth?: number }) {
  const k = size / 24;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${k}) translate(-12 -12)`}>
      <path
        d="M 5 3.5 L 8.5 3.5 L 10.2 8 L 8 9.6 C 9 11.8 11.2 14 13.4 15 L 15 12.8 L 19.5 14.5 L 19.5 18 C 19.5 19.2 18.6 20.2 17.4 20 C 10.4 19.2 4.8 13.6 4 6.6 C 3.8 5.4 4 3.5 5 3.5 Z"
        fill={alpha(color, 0.45)}
        stroke={color}
        strokeWidth={strokeWidth / Math.max(0.6, k * 0.6)}
        strokeLinejoin="round"
      />
    </g>
  );
}

/** A verdict badge: an emerald tick or a rose cross in a ring, centred at (x, y), radius `r`. */
export function VerdictMark({ x, y, r = 26, kind, show = 1, strokeWidth }: { x: number; y: number; r?: number; kind: 'yes' | 'no'; show?: number; strokeWidth?: number }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  const col = kind === 'yes' ? C.emerald : C.rose;
  const k = r / 30;
  const w = strokeWidth ?? 5.5 * k;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * s})`} opacity={Math.min(1, s * 1.4)}>
      <circle r={r + 10 * k} fill={alpha(col, 0.18)} />
      <circle r={r} fill={C.ink900} stroke={col} strokeWidth={w * 0.75} />
      {kind === 'yes' ? (
        <path d={`M ${-13 * k} ${1 * k} L ${-4 * k} ${11 * k} L ${14 * k} ${-10 * k}`} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M ${-11 * k} ${-11 * k} L ${11 * k} ${11 * k} M ${11 * k} ${-11 * k} L ${-11 * k} ${11 * k}`} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" />
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// The load (what the shipment carries) and the seal

export const LOAD_BASE = { w: 150, h: 110 } as const;

/**
 * The load: two cartons and a written sheet in front, so «you can see what it carries» when it is
 * visible. Bottom-centre at (x, y), 150 × 110 units × `scale`.
 */
export function LoadGlyph({ x, y, scale = 1, strokeWidth = 3, opacity = 1 }: { x: number; y: number; scale?: number; strokeWidth?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const sw = strokeWidth / scale;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity} strokeLinejoin="round">
      {/* Back carton */}
      <rect x={-70} y={-104} width={86} height={66} rx={4} fill="#2a3a52" stroke={INK.steel} strokeWidth={sw} />
      <line x1={-27} y1={-104} x2={-27} y2={-38} stroke={alpha(INK.skySoft, 0.8)} strokeWidth={sw * 1.6} />
      {/* Front carton */}
      <rect x={-6} y={-70} width={76} height={70} rx={4} fill="#26364d" stroke={INK.steel} strokeWidth={sw} />
      <line x1={32} y1={-70} x2={32} y2={0} stroke={alpha(INK.skySoft, 0.8)} strokeWidth={sw * 1.6} />
      {/* The written sheet: lines anyone can read */}
      <rect x={-64} y={-56} width={64} height={56} rx={3} fill="#dbe4ee" stroke={INK.steel} strokeWidth={sw * 0.8} />
      <path d="M -56 -44 L -10 -44 M -56 -33 L -14 -33 M -56 -22 L -18 -22 M -56 -11 L -26 -11" stroke="#334155" strokeWidth={sw * 1.1} strokeLinecap="round" />
    </g>
  );
}

/**
 * The seal («precinto»): a pull-tight security seal, cyan (the port's mark) — a BAND (`band`: 'ring'
 * = around a bag's neck, `ringW` wide; 'strap' = a short strap over a box's seam), a small locking head
 * on its right and a flag tag hanging from it. Never a padlock: it shows tampering, it doesn't lock.
 * Centred on (x, y) = the band's centre. `seal` 0–1 pulls it shut (the band appears, the tag swings in);
 * `broken` 0–1 snaps the band (a gap opens, everything turns rose, the tag drops).
 */
export function SealTag({
  x,
  y,
  scale = 1,
  seal = 1,
  broken = 0,
  color = C.cyan,
  strokeWidth = 3.4,
  band = 'ring',
  ringW = 44,
}: {
  x: number;
  y: number;
  scale?: number;
  seal?: number;
  broken?: number;
  color?: string;
  strokeWidth?: number;
  band?: 'ring' | 'strap';
  ringW?: number;
}) {
  const s = clamp01(seal);
  const b = clamp01(broken);
  if (s <= 0.01) return null;
  const col = b > 0.5 ? C.rose : color;
  const sw = strokeWidth / scale;
  const rx = ringW / 2;
  const head = band === 'ring' ? { x: rx - 2, y: 2 } : { x: 0, y: 24 };
  const swing = (1 - s) * -40 + b * 38;
  const gap = b * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={Math.min(1, s * 1.5)} strokeLinecap="round" strokeLinejoin="round">
      {/* The band */}
      {band === 'ring' ? (
        b < 0.05 ? (
          <ellipse cx={0} cy={0} rx={rx} ry={7} fill="none" stroke={col} strokeWidth={sw * 1.5} />
        ) : (
          // Snapped: the band opens at the front-left
          <path d={`M ${-rx + gap} ${-4} A ${rx} 7 0 1 1 ${-rx + 2} ${4 + gap * 0.4}`} fill="none" stroke={col} strokeWidth={sw * 1.5} />
        )
      ) : (
        <>
          <rect x={-7} y={-26 - (b > 0.05 ? gap : 0)} width={14} height={26} rx={3} fill={alpha(col, 0.35)} stroke={col} strokeWidth={sw} />
          <rect x={-7} y={2} width={14} height={18} rx={3} fill={alpha(col, 0.35)} stroke={col} strokeWidth={sw} />
        </>
      )}
      {/* Locking head */}
      <rect x={head.x - 9} y={head.y - 8} width={18} height={16} rx={4} fill={C.ink900} stroke={col} strokeWidth={sw} />
      {/* Flag tag on a short tether */}
      <g transform={`rotate(${swing + 18} ${head.x} ${head.y + 6})`}>
        <line x1={head.x} y1={head.y + 8} x2={head.x} y2={head.y + 18} stroke={col} strokeWidth={sw} />
        <path
          d={`M ${head.x - 15} ${head.y + 18} L ${head.x + 15} ${head.y + 18} L ${head.x + 15} ${head.y + 54} Q ${head.x + 15} ${head.y + 60} ${head.x + 9} ${head.y + 60} L ${head.x - 9} ${head.y + 60} Q ${head.x - 15} ${head.y + 60} ${head.x - 15} ${head.y + 54} Z`}
          fill={alpha(col, 0.25)}
          stroke={col}
          strokeWidth={sw}
        />
        <circle cx={head.x} cy={head.y + 26} r={3.2} fill={C.ink900} stroke={col} strokeWidth={sw * 0.7} />
        <path d={`M ${head.x - 8} ${head.y + 38} L ${head.x + 8} ${head.y + 38} M ${head.x - 8} ${head.y + 47} L ${head.x + 4} ${head.y + 47}`} stroke={col} strokeWidth={sw * 0.8} opacity={0.85} />
      </g>
      {b > 0.5 ? <path d={`M ${-rx - 6} ${-18} L ${-rx + 6} ${-6} M ${-rx + 6} ${-18} L ${-rx - 6} ${-6}`} stroke={C.rose} strokeWidth={sw * 1.2} opacity={(b - 0.5) * 2} /> : null}
    </g>
  );
}

// ---------------------------------------------------------------------------
// The plate (a drawn header: from one device to another — never letters or numbers)

/** The plate: device glyph, a drawn arrow, device glyph. Top-left at (x, y), `w` × `w·0.38` units. */
export function PlateGlyph({ x, y, w = 96, glow = 0, left = 'laptop', right = 'server' }: { x: number; y: number; w?: number; glow?: number; left?: IconName; right?: IconName }) {
  const h = w * 0.38;
  const k = w / 96;
  const ic = 26 * k;
  return (
    <g transform={`translate(${x} ${y})`}>
      {glow > 0.01 ? <rect x={-10 * k} y={-10 * k} width={w + 20 * k} height={h + 20 * k} rx={10 * k} fill={alpha(INK.lamp, 0.28 * glow)} /> : null}
      <rect x={0} y={0} width={w} height={h} rx={5 * k} fill={INK.plate} stroke={INK.plateInk} strokeWidth={2.6 * k} />
      <rect x={3.5 * k} y={3.5 * k} width={w - 7 * k} height={h - 7 * k} rx={3 * k} fill="none" stroke={alpha(INK.plateInk, 0.35)} strokeWidth={1.2 * k} />
      <SvgIcon name={left} x={20 * k} y={h / 2} size={ic} color={INK.plateInk} strokeWidth={2.4} />
      <line x1={36 * k} y1={h / 2} x2={56 * k} y2={h / 2} stroke={INK.plateInk} strokeWidth={2.6 * k} strokeLinecap="round" />
      <ArrowHead x={62 * k} y={h / 2} angle={0} size={9 * k} color={INK.plateInk} />
      <SvgIcon name={right} x={78 * k} y={h / 2} size={ic} color={INK.plateInk} strokeWidth={2.4} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// The side-view truck (nose right)

/** Local box of the truck: 440 × 200 units, ground at y = 200; the rear plate pokes out to x = −26. */
export const TRUCK_SIDE = { w: 440, h: 200, plateX: -26, plateY: 134, plateW: 92 } as const;

/**
 * The truck, side view, nose to the right. Origin at its rear-bottom corner (ground line), so place it
 * with `x` = rear end and `y` = ground. `cargo`: 'none' (tractor only: the gate's driver), 'load' (a
 * flat bed with the load; `cover` 0–1 pulls the tarp over it from the cab backwards: transport mode).
 * `plate`: the rear plate (true = the drawn device→device plate; a ReactNode replaces its content,
 * drawn at TRUCK_SIDE.plateX/Y in local units; false = none). `driver` shows a bust in the window.
 */
export function TruckSide({
  x,
  y,
  scale = 1,
  cargo = 'load',
  cover = 1,
  plate = true,
  plateGlow = 0,
  driver = false,
  driverColor = INK.person,
  outline = INK.steel,
  body = '#1e293b',
  tarp = '#0f3b4a',
  tarpLine = C.cyan,
  strokeWidth = 3.2,
  clipId,
}: {
  x: number;
  y: number;
  scale?: number;
  cargo?: 'none' | 'load';
  cover?: number;
  plate?: boolean | ReactNode;
  plateGlow?: number;
  driver?: boolean;
  driverColor?: string;
  outline?: string;
  body?: string;
  tarp?: string;
  tarpLine?: string;
  strokeWidth?: number;
  /** Unique prefix for this truck's clip paths (pass useSvgId's result). */
  clipId: string;
}) {
  const sw = strokeWidth / scale;
  const cv = clamp01(cover);
  const hasBed = cargo === 'load';
  const tarpX = 300 - 292 * cv; // the tarp's rear edge as it is pulled back over the load
  return (
    <g transform={`translate(${x} ${y - TRUCK_SIDE.h * scale}) scale(${scale})`} strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <clipPath id={`${clipId}-tarp`}>
          <rect x={tarpX} y={0} width={300 - tarpX + 2} height={170} />
        </clipPath>
        <clipPath id={`${clipId}-win`}>
          <path d="M 322 64 L 366 64 Q 376 64 380 74 L 396 110 L 322 110 Z" />
        </clipPath>
      </defs>
      {/* Chassis */}
      <rect x={hasBed ? 0 : 236} y={158} width={hasBed ? 432 : 196} height={14} rx={3} fill={C.ink900} stroke={outline} strokeWidth={sw} />
      {hasBed ? (
        <>
          {/* Flat bed */}
          <rect x={6} y={146} width={294} height={14} rx={2} fill={body} stroke={outline} strokeWidth={sw} />
          {/* The load on the bed (hidden as the tarp comes over it) */}
          {cv < 0.999 ? (
            <g>
              <LoadGlyph x={92} y={146} scale={0.86} strokeWidth={strokeWidth * 0.9} />
              <LoadGlyph x={218} y={146} scale={0.86} strokeWidth={strokeWidth * 0.9} />
            </g>
          ) : null}
          {/* Tarp */}
          {cv > 0.001 ? (
            <g clipPath={`url(#${clipId}-tarp)`}>
              <path d="M 8 148 L 8 70 Q 10 48 38 46 L 270 46 Q 298 48 300 70 L 300 148 Z" fill={tarp} stroke={tarpLine} strokeWidth={sw} />
              <path d="M 60 52 L 60 144 M 112 50 L 112 144 M 164 50 L 164 144 M 216 50 L 216 144 M 268 52 L 268 144" stroke={alpha(tarpLine, 0.45)} strokeWidth={sw * 0.8} />
              <path d="M 12 96 L 296 96" stroke={alpha(tarpLine, 0.3)} strokeWidth={sw * 0.7} strokeDasharray="10 10" />
            </g>
          ) : null}
        </>
      ) : null}
      {/* Cab */}
      <path d="M 304 170 L 304 62 Q 304 48 318 48 L 372 48 Q 388 48 394 62 L 422 112 Q 432 124 432 140 L 432 170 Z" fill={body} stroke={outline} strokeWidth={sw} />
      <path d="M 322 64 L 366 64 Q 376 64 380 74 L 396 110 L 322 110 Z" fill={C.ink900} stroke={outline} strokeWidth={sw * 0.8} />
      {driver ? (
        <g clipPath={`url(#${clipId}-win)`}>
          <PersonBust x={350} y={88} scale={1} color={driverColor} strokeWidth={strokeWidth * 0.9} />
        </g>
      ) : (
        <path d="M 330 72 L 352 72" stroke={alpha(INK.steel, 0.35)} strokeWidth={sw * 1.2} />
      )}
      <path d="M 316 120 L 316 162 M 330 128 L 346 128" stroke={alpha(outline, 0.6)} strokeWidth={sw * 0.8} />
      <rect x={424} y={150} width={16} height={16} rx={3} fill={C.ink900} stroke={outline} strokeWidth={sw * 0.8} />
      <rect x={424} y={126} width={8} height={12} rx={2} fill={INK.lamp} opacity={0.85} />
      {/* Wheels */}
      {(hasBed ? [100, 156, 372] : [262, 372]).map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={176} r={24} fill={C.ink950} stroke={outline} strokeWidth={sw} />
          <circle cx={cx} cy={176} r={9} fill={INK.structSoft} stroke={outline} strokeWidth={sw * 0.6} />
        </g>
      ))}
      {/* Rear plate */}
      {plate !== false && hasBed ? (
        <g>
          <line x1={2} y1={160} x2={2} y2={TRUCK_SIDE.plateY + 4} stroke={outline} strokeWidth={sw} />
          {plate === true ? <PlateGlyph x={TRUCK_SIDE.plateX} y={TRUCK_SIDE.plateY} w={TRUCK_SIDE.plateW} glow={plateGlow} /> : plate}
        </g>
      ) : null}
    </g>
  );
}

// ---------------------------------------------------------------------------
// HTML label helper (text over an SVG, in px)

/** A positioned HTML text block (px). `anchor` picks which point of the box sits at (x, y). */
export function Label({
  x,
  y,
  anchor = 'left-top',
  children,
  size = 32,
  weight = 750,
  color = C.text,
  maxWidth,
  mono = false,
  align,
  style,
}: {
  x: number;
  y: number;
  anchor?: 'left-top' | 'center-top' | 'right-top' | 'left-center' | 'center' | 'right-center' | 'left-bottom' | 'center-bottom' | 'right-bottom';
  children: ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  maxWidth?: number;
  mono?: boolean;
  align?: 'left' | 'center' | 'right';
  style?: CSSProperties;
}) {
  const [h, v] = anchor === 'center' ? ['center', 'center'] : anchor.split('-');
  const tx = h === 'left' ? '0' : h === 'center' ? '-50%' : '-100%';
  const ty = v === 'top' ? '0' : v === 'center' ? '-50%' : '-100%';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${tx}, ${ty})`,
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.15,
        color,
        maxWidth,
        width: maxWidth ? 'max-content' : undefined,
        whiteSpace: maxWidth ? 'normal' : 'nowrap',
        textAlign: align ?? (h === 'center' ? 'center' : h === 'right' ? 'right' : 'left'),
        letterSpacing: -0.2,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
