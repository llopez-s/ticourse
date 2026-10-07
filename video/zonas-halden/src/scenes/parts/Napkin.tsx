import { useId, type CSSProperties, type ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../engine/src/ui';
import { Checkpoint, PEN, checkpointPoint, checkpointSize } from './Checkpoint';

/**
 * «La servilleta» = today's network (canon: out/scene-brief.md «Visual
 * metaphors»), drawn by hand on a paper napkin: `Internet` → `fw-perimetro-01`
 * → `rt-core`; hanging from `rt-core` the four VLAN Oficinas, Administración,
 * Producción and Pruebas; apart, Operaciones behind a «cortafuegos interno»;
 * the note «entre estas VLAN: el router no filtra»; the portal (a small server
 * inside Oficinas, dimmed by default) next to two unnamed workstations (the
 * «puestos de Importación»). No OT, no PLC, no Contratistas, no quarantine VLAN.
 *
 * Everything is ink on paper; accents only where the voice points: the red pen
 * (`PEN.red`) for the packet and the reach lines, the blue pen (`PEN.blue`) for
 * the control that appears on the frontier, the green pen for the internal
 * firewall that holds. A highlighter wash (`highlight`) points at nodes.
 *
 * Drawn in design units (NAPKIN_BASE 1280 × 760) scaled to `width`. Only the
 * paper is tilted; the drawing itself is straight, so `napkinPoint()` /
 * `napkinBox()` anchors are exact. Text the voice points at that would shrink
 * with the drawing (portal callout, «puestos de Importación», the halt note,
 * the firewall slot) is drawn UNSCALED in px over it. Frames are
 * Sequence-relative; `frame` defaults to useCurrentFrame().
 */

export const NAPKIN_BASE = { w: 1280, h: 760 } as const;

export const NAPKIN_TEXT = {
  internet: 'Internet',
  fw: 'fw-perimetro-01',
  rtcore: 'rt-core',
  fwint: 'cortafuegos interno',
  operaciones: 'Operaciones',
  oficinas: 'Oficinas',
  administracion: 'Administración',
  produccion: 'Producción',
  pruebas: 'Pruebas',
  portal: 'portal',
  note: ['entre estas VLAN:', 'el router no filtra'],
  portalHost: 'hpa-portal-web-01',
  portalWhat: 'portal público de reservas de atraque',
  importStations: ['puestos de', 'Importación'],
  halt: 'solo si una regla lo deja',
} as const;

export type NapkinVlan = 'oficinas' | 'administracion' | 'produccion' | 'pruebas';
export type NapkinNode = 'internet' | 'fw' | 'rtcore' | 'fwint' | 'operaciones' | NapkinVlan | 'portal' | 'note';
export type NapkinAnchor = NapkinNode | 'workstations' | 'laptop' | 'gate' | 'bus';
export type NapkinReachTarget = 'administracion' | 'produccion' | 'pruebas' | 'portal';

type Rect = { x: number; y: number; w: number; h: number };

const BOX: Record<NapkinNode | 'workstations' | 'laptop', Rect> = {
  internet: { x: 47, y: 62, w: 210, h: 108 },
  fw: { x: 300, y: 82, w: 110, h: 68 },
  rtcore: { x: 590, y: 66, w: 100, h: 100 },
  fwint: { x: 790, y: 90, w: 90, h: 52 },
  operaciones: { x: 950, y: 40, w: 290, h: 110 },
  oficinas: { x: 40, y: 452, w: 330, h: 270 },
  administracion: { x: 390, y: 452, w: 320, h: 270 },
  produccion: { x: 730, y: 452, w: 260, h: 270 },
  pruebas: { x: 1010, y: 452, w: 230, h: 270 },
  portal: { x: 64, y: 530, w: 74, h: 112 },
  note: { x: 252, y: 198, w: 366, h: 90 },
  workstations: { x: 158, y: 528, w: 146, h: 66 },
  laptop: { x: 272, y: 612, w: 92, h: 56 },
};

const VLANS: readonly NapkinVlan[] = ['oficinas', 'administracion', 'produccion', 'pruebas'];
const BUS_Y = 300;
const RT = { x: 640, y: 116, r: 50 } as const;
const GATE = { x: 860, ground: 438 } as const;
const GATE_W = 220; // design width of the napkin's checkpoint (no fence stubs)
const GATE_S = GATE_W / 350; // its scale (the checkpoint's design units are 350 wide without fence)
const cx = (b: Rect) => b.x + b.w / 2;

/** Where the packet halts when the control is on (just above the lowered barrier). */
const HALT_Y = GATE.ground - (240 - 204) * GATE_S - 26;
const PACKET_PATH: readonly Pt[] = [
  { x: cx(BOX.oficinas), y: BOX.oficinas.y },
  { x: cx(BOX.oficinas), y: BUS_Y },
  { x: RT.x, y: BUS_Y },
  { x: RT.x, y: RT.y + RT.r },
  { x: RT.x, y: BUS_Y },
  { x: GATE.x, y: BUS_Y },
  { x: GATE.x, y: BOX.produccion.y },
];

const LAPTOP_TOP = { x: 318, y: 606 } as const;
const reachPath = (target: NapkinReachTarget): Pt[] => {
  if (target === 'portal') return [{ x: 272, y: 634 }, { x: 214, y: 640 }, { x: 146, y: 604 }];
  const b = BOX[target];
  return [LAPTOP_TOP, { x: LAPTOP_TOP.x, y: BUS_Y }, { x: cx(b), y: BUS_Y }, { x: cx(b), y: b.y + 26 }];
};
const BLOCKED_PATH: readonly Pt[] = [LAPTOP_TOP, { x: LAPTOP_TOP.x, y: BUS_Y }, { x: RT.x, y: BUS_Y }, { x: RT.x, y: RT.y }, { x: 780, y: RT.y }];
/** s04: from Internet along the network to the portal (the inbound rule lets it in)… */
const BREACH_OFF = 16; // runs alongside the ink lines, not on them
const BREACH_IN: readonly Pt[] = [
  { x: 252, y: RT.y + BREACH_OFF },
  { x: RT.x + BREACH_OFF, y: RT.y + BREACH_OFF },
  { x: RT.x + BREACH_OFF, y: BUS_Y + BREACH_OFF },
  // past the bus's end and down the left of Oficinas (clear of its name) onto the portal
  { x: BOX.portal.x + 20, y: BUS_Y + BREACH_OFF },
  { x: BOX.portal.x + 20, y: BOX.portal.y - 12 },
];
/** …and from the portal to the workstations next to it. */
const BREACH_OUT = 'M 142 612 Q 214 642 272 606';

type Pt = { x: number; y: number };

// ---------------------------------------------------------------------------
// Layout helpers

/** px box of the napkin at `width`. */
export function napkinSize(width: number = NAPKIN_BASE.w): { w: number; h: number; scale: number } {
  const s = width / NAPKIN_BASE.w;
  return { w: width, h: NAPKIN_BASE.h * s, scale: s };
}

/** A node's box in px from the napkin's top-left (the drawing is never rotated). */
export function napkinBox(id: NapkinNode | 'workstations' | 'laptop', width: number = NAPKIN_BASE.w): Rect {
  const s = width / NAPKIN_BASE.w;
  const b = BOX[id];
  return { x: b.x * s, y: b.y * s, w: b.w * s, h: b.h * s };
}

/**
 * An anchor in px from the napkin's top-left: any node, 'workstations',
 * 'laptop', 'gate' (the barrier on Producción's link) or 'bus' (where the
 * router's drop meets the VLAN bus), at its 'center' or an edge midpoint.
 */
export function napkinPoint(
  id: NapkinAnchor,
  which: 'center' | 'top' | 'bottom' | 'left' | 'right' = 'center',
  width: number = NAPKIN_BASE.w,
): Pt {
  const s = width / NAPKIN_BASE.w;
  if (id === 'gate') return { x: GATE.x * s, y: (GATE.ground - 14) * s };
  if (id === 'bus') return { x: RT.x * s, y: BUS_Y * s };
  const b = BOX[id];
  const p =
    which === 'top'
      ? { x: cx(b), y: b.y }
      : which === 'bottom'
        ? { x: cx(b), y: b.y + b.h }
        : which === 'left'
          ? { x: b.x, y: b.y + b.h / 2 }
          : which === 'right'
            ? { x: b.x + b.w, y: b.y + b.h / 2 }
            : { x: cx(b), y: b.y + b.h / 2 };
  return { x: p.x * s, y: p.y * s };
}

// ---------------------------------------------------------------------------
// Hand-drawn strokes (seeded, deterministic)

function hash01(n: number): number {
  let h = Math.imul(n + 0x9e37, 2654435761);
  h = Math.imul(h ^ (h >>> 15), 2246822519);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}
const jit = (seed: number, k: number, amp: number) => (hash01(seed * 131 + k) - 0.5) * 2 * amp;
const r1 = (v: number) => Math.round(v * 10) / 10;

/** A slightly bowed pen line with a small overshoot at its end. */
export function roughLine(x1: number, y1: number, x2: number, y2: number, seed: number, amp = 2.2, over = 3): string {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const ax = x1 + jit(seed, 1, 1.2) - ux * over * 0.4;
  const ay = y1 + jit(seed, 2, 1.2) - uy * over * 0.4;
  const bx = x2 + jit(seed, 3, 1.2) + ux * over;
  const by = y2 + jit(seed, 4, 1.2) + uy * over;
  const bow = jit(seed, 5, amp) + Math.sign(jit(seed, 6, 1)) * Math.min(amp, len / 80);
  const mx = (ax + bx) / 2 - uy * bow;
  const my = (ay + by) / 2 + ux * bow;
  return `M ${r1(ax)} ${r1(ay)} Q ${r1(mx)} ${r1(my)} ${r1(bx)} ${r1(by)}`;
}

/** A sketchy rectangle: four pen strokes that overshoot their corners. */
export function roughRect(x: number, y: number, w: number, h: number, seed: number, amp = 3.2): string {
  return [
    roughLine(x, y, x + w, y, seed + 1, amp),
    roughLine(x + w, y, x + w, y + h, seed + 2, amp),
    roughLine(x + w, y + h, x, y + h, seed + 3, amp),
    roughLine(x, y + h, x, y, seed + 4, amp),
  ].join(' ');
}

/** A hand-drawn circle (or ellipse with `ry`): a little more than one turn, radius wobbling. */
export function roughCircle(x: number, y: number, r: number, seed: number, ry = r): string {
  const steps = 40;
  const start = hash01(seed) * Math.PI * 2;
  const pts: string[] = [];
  for (let k = 0; k <= steps; k++) {
    const a = start + (k / steps) * Math.PI * 2 * 1.08;
    const w = 1 + 0.035 * Math.sin(a * 2 + seed) + 0.015 * Math.sin(a * 5 + seed * 3);
    pts.push(`${k ? 'L' : 'M'} ${r1(x + r * w * Math.cos(a))} ${r1(y + ry * w * Math.sin(a))}`);
  }
  return pts.join(' ');
}

/** A pen polyline through `pts` (each leg slightly bowed). */
function roughPoly(pts: readonly Pt[], seed: number, amp = 1.6): string {
  return pts
    .slice(1)
    .map((p, i) => roughLine(pts[i].x, pts[i].y, p.x, p.y, seed + i * 7, amp, 0).replace(/^M [^Q]+/, i ? '' : `M ${pts[0].x} ${pts[0].y} `))
    .join(' ');
}

function polyLength(pts: readonly Pt[]): number[] {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return acc;
}

/** Point at fraction t (0–1) of a polyline's length, plus the leg's direction. */
function polyPoint(pts: readonly Pt[], t: number): Pt & { dx: number; dy: number } {
  const acc = polyLength(pts);
  const target = clamp01(t) * acc[acc.length - 1];
  for (let i = 1; i < pts.length; i++) {
    if (target <= acc[i] || i === pts.length - 1) {
      const seg = acc[i] - acc[i - 1] || 1;
      const k = clamp01((target - acc[i - 1]) / seg);
      const dx = (pts[i].x - pts[i - 1].x) / seg;
      const dy = (pts[i].y - pts[i - 1].y) / seg;
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k, dx, dy };
    }
  }
  return { ...pts[0], dx: 1, dy: 0 };
}

/** Fraction of a polyline's length at which it first reaches point `p` (on one of its legs). */
function polyFraction(pts: readonly Pt[], p: Pt): number {
  const acc = polyLength(pts);
  for (let i = acc.length - 1; i >= 1; i--) {
    const a = pts[i - 1];
    const b = pts[i];
    const onX = Math.abs(a.x - b.x) < 0.5 && Math.abs(p.x - a.x) < 0.5 && p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y);
    const onY = Math.abs(a.y - b.y) < 0.5 && Math.abs(p.y - a.y) < 0.5 && p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x);
    if (onX || onY) return (acc[i - 1] + Math.hypot(p.x - a.x, p.y - a.y)) / acc[acc.length - 1];
  }
  return 1;
}

/** Fraction of the packet's path where it stops when the control is on. */
export const NAPKIN_HALT_AT = polyFraction(PACKET_PATH, { x: GATE.x, y: HALT_Y });

const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Reveals its child left to right like a pen writing it (p 0–1). */
function Written({ p, children }: { p: number; children: ReactNode }) {
  const k = clamp01(p);
  if (k <= 0) return null;
  return <div style={{ clipPath: k < 1 ? `inset(-30px ${(1 - k) * 100}% -30px -30px)` : undefined }}>{children}</div>;
}

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

// ---------------------------------------------------------------------------
// Doodles (design units)

function cloudPath(c: Pt, rx: number, ry: number): string {
  const n = 8;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + 0.2;
    const k = 1 + 0.06 * Math.sin(i * 2.7);
    return { x: c.x + rx * k * Math.cos(a), y: c.y + ry * k * Math.sin(a) * (Math.sin(a) > 0 ? 0.82 : 1) };
  });
  let d = `M ${r1(pts[0].x)} ${r1(pts[0].y)}`;
  for (let i = 1; i <= n; i++) {
    const a = pts[i - 1];
    const b = pts[i % n];
    const chord = Math.hypot(b.x - a.x, b.y - a.y);
    d += ` A ${r1(chord * 0.6)} ${r1(chord * 0.6)} 0 0 1 ${r1(b.x)} ${r1(b.y)}`;
  }
  return d;
}

function brickPath(b: Rect, seed: number): string {
  const rows = 3;
  const rh = b.h / rows;
  const parts = [roughRect(b.x, b.y, b.w, b.h, seed)];
  for (let r = 1; r < rows; r++) parts.push(roughLine(b.x, b.y + r * rh, b.x + b.w, b.y + r * rh, seed + 10 + r, 1, 0));
  for (let r = 0; r < rows; r++) {
    const off = r % 2 ? b.w / 4 : b.w / 2;
    for (let x = b.x + off; x < b.x + b.w - 4; x += b.w / 2) parts.push(roughLine(x, b.y + r * rh, x, b.y + (r + 1) * rh, seed + 20 + r * 3 + x, 0.6, 0));
  }
  return parts.join(' ');
}

function monitorPath(x: number, y: number, w: number, seed: number): string {
  const h = w * 0.72;
  return [roughRect(x, y, w, h, seed, 1.4), roughLine(x + w / 2, y + h, x + w / 2, y + h + 12, seed + 5, 0.6, 0), roughLine(x + w * 0.25, y + h + 13, x + w * 0.75, y + h + 13, seed + 6, 0.8, 0)].join(' ');
}

function serverPath(b: Rect, seed: number): string {
  const parts = [roughRect(b.x, b.y, b.w, b.h, seed, 1.6)];
  for (let i = 1; i <= 3; i++) parts.push(roughLine(b.x + 10, b.y + (b.h * i) / 4.4, b.x + b.w - 22, b.y + (b.h * i) / 4.4, seed + i * 3, 0.6, 0));
  return parts.join(' ');
}

function laptopPath(b: Rect, seed: number): string {
  const sh = b.h * 0.66;
  return [
    roughRect(b.x + 10, b.y, b.w - 20, sh, seed, 1.2),
    roughLine(b.x, b.y + b.h, b.x + b.w, b.y + b.h, seed + 4, 0.8, 0),
    roughLine(b.x + 10, b.y + sh, b.x, b.y + b.h, seed + 5, 0.6, 0),
    roughLine(b.x + b.w - 10, b.y + sh, b.x + b.w, b.y + b.h, seed + 6, 0.6, 0),
  ].join(' ');
}

function arrowHead(tip: Pt & { dx: number; dy: number }, size = 16): string {
  const bx = tip.x - tip.dx * size;
  const by = tip.y - tip.dy * size;
  const nx = -tip.dy * size * 0.55;
  const ny = tip.dx * size * 0.55;
  return `M ${r1(bx + nx)} ${r1(by + ny)} L ${r1(tip.x)} ${r1(tip.y)} L ${r1(bx - nx)} ${r1(by - ny)}`;
}

// ---------------------------------------------------------------------------
// The perimeter rule (s04): a printed label stuck on the napkin

export const PERIMETER_RULE = [
  { head: 'origen', value: 'Internet' },
  { head: 'destino', value: 'hpa-portal-web-01' },
  { head: '', value: 'tcp/443' },
  { head: '', value: 'permitir' },
] as const;

/**
 * s04's rule on `fw-perimetro-01`, in columns: «origen: Internet · destino:
 * hpa-portal-web-01 · tcp/443 · permitir» — a printed label taped to the
 * napkin. `show` 0–1 reveals the columns left to right; `focus` lights one
 * column (0–3). About 900 px wide at the default size. Pass it as the
 * Napkin's `fwSlot`, or place it yourself.
 */
export function PerimeterRule({ show = 1, focus, size = 34, style }: { show?: number; focus?: number; size?: number; style?: CSSProperties }) {
  const p = clamp01(show);
  if (p <= 0) return null;
  const head = Math.round(size * 0.68);
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'stretch',
        padding: `${Math.round(size * 0.42)}px ${Math.round(size * 0.55)}px`,
        borderRadius: 6,
        background: '#fbf8f1',
        border: `2px solid ${alpha(PEN.ink, 0.45)}`,
        boxShadow: `0 10px 24px ${alpha('#000000', 0.35)}`,
        transform: 'rotate(-0.8deg)',
        fontFamily: FONT.mono,
        color: PEN.ink,
        opacity: Math.min(1, p * 3),
        ...style,
      }}
    >
      {/* Tape */}
      <div style={{ position: 'absolute', left: '50%', top: -14, width: 110, height: 26, transform: 'translateX(-50%) rotate(2deg)', background: alpha('#e7dcc0', 0.85), border: `1px solid ${alpha('#b8a77a', 0.5)}` }} />
      {PERIMETER_RULE.map((c, i) => {
        const k = seg(p, 0.1 + i * 0.2, 0.3 + i * 0.2);
        const f = focus === i ? 1 : 0;
        const last = i === PERIMETER_RULE.length - 1;
        return (
          <div
            key={c.value}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: `0 ${Math.round(size * 0.5)}px`,
              borderLeft: i ? `2px dashed ${alpha(PEN.ink, 0.35)}` : undefined,
              opacity: k,
              background: f ? alpha('#facc15', 0.38) : undefined,
              borderRadius: 4,
            }}
          >
            <div style={{ fontFamily: FONT.sans, fontSize: head, fontWeight: 700, color: alpha(PEN.ink, 0.7), lineHeight: 1.1, minHeight: head * 1.1 }}>{c.head}</div>
            <div style={{ fontSize: size, fontWeight: 750, lineHeight: 1.2, whiteSpace: 'nowrap', color: last ? PEN.green : PEN.ink }}>{c.value}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Napkin

type PortalState = 'hidden' | 'dim' | 'normal' | number;
const portalLevel = (v: PortalState): number => (typeof v === 'number' ? clamp01(v) : v === 'hidden' ? 0 : v === 'dim' ? 0.38 : 1);

export function Napkin({
  width = NAPKIN_BASE.w,
  at,
  drawDur = 75,
  draw: drawProp,
  tilt = -1.2,
  highlight = {},
  dim = {},
  highlightColor = '#facc15',
  portal = 'dim',
  portalZoom = 0,
  portalCallout = true,
  portalCalloutAt,
  importTag = 0,
  importTagAt,
  packet,
  packetColor = PEN.red,
  gate = 0,
  gateControl = 0,
  haltNote = 0,
  laptop = 0,
  reach = {},
  reachBlocked = 0,
  breach = 0,
  breachColor = PEN.red,
  fwSlot,
  fwSlotPlacement = 'above',
  glow = 0,
  dimAll = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  /** Frame the napkin starts drawing itself; omitted (and no `draw`): already drawn. */
  at?: number;
  /** Frames the draw-in lasts. */
  drawDur?: number;
  /** Or drive the draw-in yourself, 0–1. */
  draw?: number;
  /** Paper rotation in degrees (the drawing stays straight). */
  tilt?: number;
  /** 0–1 highlighter wash per node. */
  highlight?: Partial<Record<NapkinNode, number>>;
  /** 0–1 fade per node (the rest of the drawing stays). */
  dim?: Partial<Record<NapkinNode, number>>;
  highlightColor?: string;
  /** The portal inside Oficinas: 'hidden', 'dim' (default, s01–s03), 'normal', or 0–1. */
  portal?: PortalState;
  /** 0–1: the portal grows and its callout (host + «portal público de reservas de atraque») pops out. */
  portalZoom?: number;
  /** Draw the callout with the zoom (false: draw your own from napkinPoint('portal')). */
  portalCallout?: boolean;
  /** Callout's bottom-left in px from the napkin's top-left (default: just above the bus, over Oficinas). */
  portalCalloutAt?: Pt;
  /** 0–1: the tag «puestos de Importación» (unscaled), hung under Oficinas with a leader to the workstations. */
  importTag?: number;
  /** The tag's top-centre in px from the napkin's top-left (default: just below Oficinas; no leader when set). */
  importTagAt?: Pt;
  /** 0–1 along Oficinas → rt-core → Producción; undefined/≤0/≥1 = not drawn. Clamped at the gate once the control is on. */
  packet?: number;
  packetColor?: string;
  /** 0–1: Producción's fence and the EMPTY checkpoint on its link (raised barrier, nobody inside). */
  gate?: number;
  /** 0–1: the control appears on that frontier (guard in, lamp on, barrier down — blue pen). */
  gateControl?: number;
  /** 0–1: «solo si una regla lo deja» next to the halted packet (unscaled). */
  haltNote?: number;
  /** 0–1: s03's laptop in Oficinas (red pen). */
  laptop?: number;
  /** 0–1 per target: red reach line from the laptop, then the target's wash. */
  reach?: Partial<Record<NapkinReachTarget, number>>;
  /** 0–1: the attempt towards Operaciones, stopped at its internal firewall (which holds, green). */
  reachBlocked?: number;
  /** s04, 0–1: a dotted pen line from Internet along the network to the portal (first 65 %), then on to the workstations beside it. */
  breach?: number;
  breachColor?: string;
  /** Anything to pin on `fw-perimetro-01` (e.g. <PerimeterRule />), drawn unscaled. */
  fwSlot?: ReactNode;
  /** 'above': entirely above the napkin's top edge, pinned to the firewall by a line (leave ~110 px free above); 'below': under the firewall box, over the drawing. */
  fwSlotPlacement?: 'above' | 'below';
  glow?: number;
  /** 0–1 dims the whole napkin (another element is in focus). */
  dimAll?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('napkin');
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const W = NAPKIN_BASE.w;
  const H = NAPKIN_BASE.h;
  const s = width / W;
  const dp = drawProp !== undefined ? clamp01(drawProp) : at === undefined ? 1 : progress(frame, at, drawDur, EASE.linear);
  if (dp <= 0) return null;

  const ink = PEN.ink;
  const inkW = 4.2;
  const hl = (n: NapkinNode) => clamp01(highlight[n] ?? 0);
  const dimOf = (n: NapkinNode) => 1 - 0.68 * clamp01(dim[n] ?? 0);

  // Draw-in windows (fractions of dp)
  const W_ = {
    paper: seg(dp, 0, 0.1),
    internet: seg(dp, 0.06, 0.2),
    l1: seg(dp, 0.18, 0.24),
    fw: seg(dp, 0.22, 0.34),
    l2: seg(dp, 0.32, 0.4),
    rtcore: seg(dp, 0.38, 0.5),
    bus: seg(dp, 0.48, 0.58),
    vlan: VLANS.map((_, i) => seg(dp, 0.56 + i * 0.05, 0.7 + i * 0.05)),
    l3: seg(dp, 0.72, 0.78),
    fwint: seg(dp, 0.76, 0.84),
    operaciones: seg(dp, 0.82, 0.93),
    note: seg(dp, 0.88, 1),
  };
  const lbl = (p: number) => seg(p, 0.45, 1);

  const portalVis = portalLevel(portal);
  const z = clamp01(portalZoom);
  const gp = clamp01(gate);
  const gc = clamp01(gateControl);
  const lp = clamp01(laptop);
  const blocked = clamp01(reachBlocked);
  const br = clamp01(breach);
  const brIn = seg(br, 0, 0.65);
  const brOut = seg(br, 0.72, 1);
  const breachInD = BREACH_IN.map((pt, i) => `${i ? 'L' : 'M'} ${pt.x} ${pt.y}`).join(' ');

  // Packet (halted at the gate once the control is on)
  const packetT = packet === undefined ? -1 : gc >= 0.5 ? Math.min(packet, NAPKIN_HALT_AT) : packet;
  const packetOn = packetT > 0 && (packetT < 1 || (gc >= 0.5 && packetT >= NAPKIN_HALT_AT));
  const pkt = packetOn ? polyPoint(PACKET_PATH, packetT) : null;

  const dash = (p: number) => ({ pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - clamp01(p) });

  // Text style: hand-lettered (Inter, slanted, each label a touch askew)
  const hand = (size: number, seedN: number, weight = 700): CSSProperties => ({
    fontFamily: FONT.sans,
    fontSize: size,
    fontWeight: weight,
    lineHeight: 1.12,
    color: ink,
    whiteSpace: 'nowrap',
    letterSpacing: 0.4,
    transform: `rotate(${r1(jit(seedN, 9, 1.6))}deg) skewX(-7deg)`,
  });
  const label = ({ x, y, size, seedN, p, children, weight, color, center = true }: { x: number; y: number; size: number; seedN: number; p: number; children: ReactNode; weight?: number; color?: string; center?: boolean }) => (
    <div style={{ position: 'absolute', left: x, top: y, transform: center ? 'translateX(-50%)' : undefined }}>
      <Written p={p}>
        <div style={{ ...hand(size, seedN, weight), color: color ?? ink }}>{children}</div>
      </Written>
    </div>
  );

  // Gate (checkpoint) geometry, in design units
  const ckSize = checkpointSize(GATE_W, { fence: false });
  const ckGate = checkpointPoint(GATE_W, 'gate', { fence: false });
  const ckGround = ((240 - 22) / 258) * ckSize.h;
  const ckLeft = GATE.x - ckGate.x;
  const ckTop = GATE.ground - ckGround;
  // Producción's fence: right of the barrier's fork rest to the box's right edge (the hut covers the left part).
  const fenceR0 = GATE.x + (477 - 390) * GATE_S + 8;
  const fenceR1 = BOX.produccion.x + BOX.produccion.w - 4;

  // Highlighter washes (behind the ink)
  const washRect = (n: NapkinNode): Rect => {
    const b = BOX[n];
    if (n === 'fw') return { x: b.x - 64, y: b.y - 54, w: b.w + 140, h: b.h + 64 };
    if (n === 'fwint') return { x: b.x - 92, y: b.y - 14, w: b.w + 184, h: b.h + 70 };
    if (n === 'rtcore') return { x: b.x - 16, y: b.y - 50, w: b.w + 32, h: b.h + 64 };
    return { x: b.x - 10, y: b.y - 8, w: b.w + 20, h: b.h + 16 };
  };
  const washNodes: NapkinNode[] = ['internet', 'fw', 'rtcore', 'fwint', 'operaciones', 'oficinas', 'administracion', 'produccion', 'pruebas', 'portal', 'note'];

  const reachW = (t: NapkinReachTarget) => clamp01(reach[t] ?? 0);

  const drawing = (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0' }}>
      {/* Paper */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `rotate(${tilt}deg) scale(${0.97 + 0.03 * W_.paper})`, opacity: W_.paper }}>
        <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f7f2e7" />
              <stop offset="0.55" stopColor={PEN.paper} />
              <stop offset="1" stopColor="#e9e0cd" />
            </linearGradient>
            <linearGradient id={`${id}-foldV`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#000000" stopOpacity={0} />
              <stop offset="0.48" stopColor="#000000" stopOpacity={0.07} />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity={0.5} />
              <stop offset="0.53" stopColor="#000000" stopOpacity={0.04} />
              <stop offset="1" stopColor="#000000" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`${id}-foldH`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#000000" stopOpacity={0} />
              <stop offset="0.47" stopColor="#000000" stopOpacity={0.06} />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity={0.45} />
              <stop offset="0.54" stopColor="#000000" stopOpacity={0.035} />
              <stop offset="1" stopColor="#000000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={8} y={8} width={W - 16} height={H - 16} rx={10} fill={`url(#${id}-paper)`} style={{ filter: `drop-shadow(0 16px 30px ${alpha('#000000', 0.5)})` }} />
          {/* Fold creases (quartered napkin) */}
          <rect x={W / 2 - 40} y={8} width={80} height={H - 16} fill={`url(#${id}-foldV)`} />
          <rect x={8} y={H / 2 - 36} width={W - 16} height={72} fill={`url(#${id}-foldH)`} />
          {/* Embossed border */}
          <rect x={26} y={26} width={W - 52} height={H - 52} rx={8} fill="none" stroke={alpha('#b6a582', 0.45)} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
        </svg>
      </div>

      {/* Highlighter washes */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', mixBlendMode: 'multiply' }}>
        {washNodes.map((n) => {
          const w = hl(n);
          if (w <= 0.01) return null;
          const r = washRect(n);
          return <rect key={n} x={r.x} y={r.y} width={r.w * clamp01(w * 1.4)} height={r.h} rx={10} fill={alpha(highlightColor, 0.5)} opacity={Math.min(1, w * 1.5)} transform={`rotate(${r1(jit(r.x, 3, 0.8))} ${r.x} ${r.y})`} />;
        })}
        {/* Reach washes on the reached VLANs (red) */}
        {(['administracion', 'produccion', 'pruebas'] as const).map((t) => {
          const w = seg(reachW(t), 0.7, 1);
          if (w <= 0.01) return null;
          const b = BOX[t];
          return <rect key={t} x={b.x + 4} y={b.y + 4} width={b.w - 8} height={b.h - 8} rx={8} fill={alpha(PEN.red, 0.16)} opacity={w} />;
        })}
        {seg(reachW('portal'), 0.7, 1) > 0.01 ? (
          <rect x={BOX.portal.x - 8} y={BOX.portal.y - 8} width={BOX.portal.w + 16} height={BOX.portal.h + 16} rx={8} fill={alpha(PEN.red, 0.2)} opacity={seg(reachW('portal'), 0.7, 1)} />
        ) : null}
      </svg>

      {/* Ink */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g fill="none" stroke={ink} strokeWidth={inkW} strokeLinecap="round" strokeLinejoin="round">
          {/* Internet */}
          <path d={cloudPath({ x: cx(BOX.internet), y: BOX.internet.y + BOX.internet.h / 2 }, 100, 50)} {...dash(W_.internet)} opacity={dimOf('internet')} />
          <path d={roughLine(257, RT.y, 300, RT.y, 11)} {...dash(W_.l1)} />
          {/* fw-perimetro-01 */}
          <path d={brickPath(BOX.fw, 21)} {...dash(W_.fw)} opacity={dimOf('fw')} strokeWidth={3.6} />
          <path d={roughLine(410, RT.y, RT.x - RT.r, RT.y, 31)} {...dash(W_.l2)} />
          {/* rt-core */}
          <g opacity={dimOf('rtcore')}>
            <path d={roughCircle(RT.x, RT.y, RT.r, 41)} {...dash(W_.rtcore)} />
            <g opacity={seg(W_.rtcore, 0.5, 1)} strokeWidth={3.4}>
              <path d={`${roughLine(RT.x - 26, RT.y - 26, RT.x + 26, RT.y + 26, 42, 1, 0)} ${roughLine(RT.x + 26, RT.y - 26, RT.x - 26, RT.y + 26, 43, 1, 0)}`} />
              <path d={`${arrowHead({ x: RT.x + 28, y: RT.y + 28, dx: 0.707, dy: 0.707 }, 12)} ${arrowHead({ x: RT.x - 28, y: RT.y - 28, dx: -0.707, dy: -0.707 }, 12)}`} />
              <path d={`${arrowHead({ x: RT.x + 28, y: RT.y - 28, dx: 0.707, dy: -0.707 }, 12)} ${arrowHead({ x: RT.x - 28, y: RT.y + 28, dx: -0.707, dy: 0.707 }, 12)}`} />
            </g>
          </g>
          {/* rt-core's drop and the VLAN bus */}
          <path d={`${roughLine(RT.x, RT.y + RT.r, RT.x, BUS_Y, 51, 1.2, 0)} ${roughLine(cx(BOX.oficinas), BUS_Y, cx(BOX.pruebas), BUS_Y, 52, 2.6, 0)}`} {...dash(W_.bus)} />
          {/* The four VLAN */}
          {VLANS.map((v, i) => {
            const b = BOX[v];
            const p = W_.vlan[i];
            return (
              <g key={v} opacity={dimOf(v)}>
                <path d={roughLine(cx(b), BUS_Y, cx(b), b.y, 60 + i, 1, 0)} {...dash(seg(p, 0, 0.3))} />
                <path d={roughRect(b.x, b.y, b.w, b.h, 70 + i * 5)} {...dash(seg(p, 0.15, 0.85))} />
                <path d={roughRect(b.x + 2, b.y - 1, b.w - 3, b.h + 2, 300 + i * 5, 4)} {...dash(seg(p, 0.5, 1))} strokeWidth={2.2} opacity={0.35} />
              </g>
            );
          })}
          {/* Doodles inside the VLAN (unnamed devices) */}
          <g opacity={0.58} strokeWidth={3}>
            <g opacity={seg(W_.vlan[0], 0.6, 1) * dimOf('oficinas')}>
              <path d={monitorPath(158, 528, 64, 81)} />
              <path d={monitorPath(240, 528, 64, 82)} />
            </g>
            <g opacity={seg(W_.vlan[1], 0.6, 1) * dimOf('administracion')}>
              <path d={monitorPath(420, 560, 70, 83)} />
              <path d={monitorPath(515, 560, 70, 84)} />
              <path d={monitorPath(610, 560, 70, 85)} />
            </g>
            <g opacity={seg(W_.vlan[2], 0.6, 1) * dimOf('produccion')}>
              <path d={serverPath({ x: 780, y: 540, w: 64, h: 110 }, 86)} />
              <path d={serverPath({ x: 876, y: 540, w: 64, h: 110 }, 87)} />
            </g>
            <g opacity={seg(W_.vlan[3], 0.6, 1) * dimOf('pruebas')}>
              <path d={monitorPath(1036, 566, 70, 88)} />
              <path d={serverPath({ x: 1140, y: 548, w: 60, h: 104 }, 89)} />
            </g>
          </g>
          {/* The portal (small server in Oficinas) */}
          {portalVis > 0.01 ? (
            <g
              opacity={portalVis * seg(W_.vlan[0], 0.6, 1) * dimOf('portal')}
              transform={z > 0 ? `translate(${cx(BOX.portal)} ${BOX.portal.y + BOX.portal.h / 2}) scale(${1 + 0.3 * z}) translate(${-cx(BOX.portal)} ${-(BOX.portal.y + BOX.portal.h / 2)})` : undefined}
            >
              <path d={serverPath(BOX.portal, 91)} strokeWidth={3.6} />
              <path d={roughLine(BOX.portal.x + 14, BOX.portal.y + BOX.portal.h - 18, BOX.portal.x + 40, BOX.portal.y + BOX.portal.h - 18, 92, 0.4, 0)} strokeWidth={6} />
            </g>
          ) : null}
          {/* Operaciones, behind the internal firewall */}
          <path d={roughLine(RT.x + RT.r, RT.y, BOX.fwint.x, RT.y, 101)} {...dash(W_.l3)} />
          <path d={brickPath(BOX.fwint, 103)} {...dash(W_.fwint)} opacity={dimOf('fwint')} strokeWidth={3.4} />
          <path d={roughLine(BOX.fwint.x + BOX.fwint.w, RT.y, BOX.operaciones.x, RT.y, 105)} {...dash(seg(W_.operaciones, 0, 0.25))} />
          <g opacity={dimOf('operaciones')}>
            <path d={roughRect(BOX.operaciones.x, BOX.operaciones.y, BOX.operaciones.w, BOX.operaciones.h, 111)} {...dash(seg(W_.operaciones, 0.15, 0.8))} />
            <path d={roughRect(BOX.operaciones.x + 2, BOX.operaciones.y - 1, BOX.operaciones.w - 3, BOX.operaciones.h + 2, 311, 4)} {...dash(seg(W_.operaciones, 0.5, 1))} strokeWidth={2.2} opacity={0.35} />
          </g>
          {/* The note's pointer to the bus */}
          <path d="M 604 262 Q 624 270 628 288" {...dash(seg(W_.note, 0.6, 1))} strokeWidth={3} opacity={dimOf('note')} />
          <path d={arrowHead({ x: 629, y: 293, dx: 0.24, dy: 0.97 }, 12)} strokeWidth={3} opacity={seg(W_.note, 0.9, 1) * dimOf('note')} />
          {/* Producción's fence (with the gate) */}
          {gp > 0.01 ? (
            <g opacity={gp} strokeWidth={3}>
              <path
                d={[
                  roughLine(fenceR0, GATE.ground - 6, fenceR1, GATE.ground - 6, 122, 1, 0),
                  roughLine(fenceR0, GATE.ground - 22, fenceR1, GATE.ground - 22, 123, 1, 0),
                  roughLine(fenceR0, GATE.ground - 38, fenceR1, GATE.ground - 38, 124, 1, 0),
                  ...Array.from({ length: 6 }, (_, k) => fenceR0 + 4 + (k * (fenceR1 - fenceR0 - 8)) / 5).map((x, k) => roughLine(x, GATE.ground + 4, x, GATE.ground - 46, 130 + k, 0.5, 0)),
                ].join(' ')}
                {...dash(seg(gp, 0, 0.8))}
              />
            </g>
          ) : null}
        </g>

        {/* ---- Red pen: the laptop's reach ---- */}
        <g fill="none" stroke={PEN.red} strokeLinecap="round" strokeLinejoin="round">
          {(['portal', 'administracion', 'produccion', 'pruebas'] as const).map((t) => {
            const w = reachW(t);
            if (w <= 0.01) return null;
            const pts = reachPath(t);
            const pathP = seg(w, 0, 0.75);
            const tip = polyPoint(pts, 1);
            return (
              <g key={t}>
                <path d={roughPoly(pts, 140 + t.length)} strokeWidth={6.5} opacity={0.88} {...dash(pathP)} />
                {pathP >= 1 ? <path d={arrowHead(tip, 20)} strokeWidth={6.5} /> : null}
              </g>
            );
          })}
          {blocked > 0.01 ? (
            <g>
              <path d={roughPoly(BLOCKED_PATH, 160)} strokeWidth={5.5} strokeDasharray="14 12" opacity={0.85} style={{ clipPath: `inset(0 ${(1 - seg(blocked, 0, 0.7)) * 100}% 0 0)` }} />
              <path d={roughLine(783, RT.y - 26, 783, RT.y + 26, 161, 0.4, 0)} strokeWidth={9} opacity={seg(blocked, 0.7, 0.85)} />
            </g>
          ) : null}
        </g>
        {/* ---- s04: the dotted breach line (revealed through a mask so the dots keep their spacing) ---- */}
        {br > 0.01 ? (
          <g fill="none" stroke={breachColor} strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <mask id={`${id}-brin`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
                <path d={breachInD} stroke="#ffffff" strokeWidth={40} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - brIn} />
              </mask>
              <mask id={`${id}-brout`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
                <path d={BREACH_OUT} stroke="#ffffff" strokeWidth={40} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - brOut} />
              </mask>
            </defs>
            <path d={breachInD} strokeWidth={10} strokeDasharray="1 17" mask={`url(#${id}-brin)`} />
            {brIn >= 1 ? <path d={arrowHead(polyPoint(BREACH_IN, 1), 18)} strokeWidth={5} /> : null}
            {brOut > 0.01 ? <path d={BREACH_OUT} strokeWidth={10} strokeDasharray="1 17" mask={`url(#${id}-brout)`} /> : null}
            {brOut >= 1 ? <path d={arrowHead({ x: 272, y: 606, dx: 0.85, dy: -0.52 }, 18)} strokeWidth={5} /> : null}
          </g>
        ) : null}
        {/* ---- Green pen: the internal firewall holds ---- */}
        {blocked > 0.01 ? (
          <path
            d={roughCircle(cx(BOX.fwint), RT.y, 72, 171, 42)}
            fill="none"
            stroke={PEN.green}
            strokeWidth={5}
            strokeLinecap="round"
            {...dash(seg(blocked, 0.8, 1))}
          />
        ) : null}
        {/* ---- The laptop (s03) ---- */}
        {lp > 0.01 ? (
          <g opacity={lp}>
            <path d={roughCircle(cx(BOX.laptop), BOX.laptop.y + BOX.laptop.h / 2, 62, 181)} fill="none" stroke={PEN.red} strokeWidth={4} strokeLinecap="round" {...dash(lp)} />
            <path d={laptopPath(BOX.laptop, 182)} fill="none" stroke={PEN.red} strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </svg>

      {/* Hand-lettered labels */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }}>
        <div style={{ opacity: dimOf('internet') }}>
          {label({ x: cx(BOX.internet), y: BOX.internet.y + 28, size: 40, seedN: 1, p: lbl(W_.internet), children: NAPKIN_TEXT.internet })}
        </div>
        <div style={{ opacity: dimOf('fw') }}>
          {label({ x: cx(BOX.fw) + 12, y: BOX.fw.y - 50, size: 36, seedN: 2, p: lbl(W_.fw), children: NAPKIN_TEXT.fw })}
        </div>
        <div style={{ opacity: dimOf('rtcore') }}>
          {label({ x: RT.x, y: RT.y - RT.r - 50, size: 38, seedN: 3, p: lbl(W_.rtcore), children: NAPKIN_TEXT.rtcore })}
        </div>
        <div style={{ opacity: dimOf('fwint') }}>
          {label({ x: cx(BOX.fwint), y: BOX.fwint.y + BOX.fwint.h + 14, size: 30, seedN: 4, p: lbl(W_.fwint), children: NAPKIN_TEXT.fwint })}
        </div>
        <div style={{ opacity: dimOf('operaciones') }}>
          {label({ x: cx(BOX.operaciones), y: BOX.operaciones.y + 30, size: 40, seedN: 5, p: lbl(W_.operaciones), children: NAPKIN_TEXT.operaciones })}
        </div>
        {VLANS.map((v, i) => (
          <div key={v} style={{ opacity: dimOf(v) }}>
            {label({ x: cx(BOX[v]), y: BOX[v].y + 16, size: 40, seedN: 6 + i, p: lbl(W_.vlan[i]), children: NAPKIN_TEXT[v] })}
          </div>
        ))}
        {portalVis > 0.01 ? (
          <div style={{ opacity: portalVis * dimOf('portal') }}>
            {label({ x: cx(BOX.portal), y: BOX.portal.y + BOX.portal.h + 4 + 16 * z, size: 32, seedN: 10, p: lbl(W_.vlan[0]), children: NAPKIN_TEXT.portal })}
          </div>
        ) : null}
        <div style={{ opacity: dimOf('note') }}>
          {label({ x: cx(BOX.note), y: BOX.note.y, size: 38, seedN: 11, p: seg(W_.note, 0, 0.6), weight: 650, children: NAPKIN_TEXT.note[0] })}
          {label({ x: cx(BOX.note), y: BOX.note.y + 44, size: 38, seedN: 12, p: seg(W_.note, 0.3, 0.9), weight: 650, children: NAPKIN_TEXT.note[1] })}
        </div>
      </div>

      {/* The gate on Producción's link: empty, then controlled */}
      {gp > 0.01 ? (
        <div style={{ position: 'absolute', left: ckLeft, top: ckTop, opacity: seg(gp, 0.2, 1) }}>
          <Checkpoint
            width={GATE_W}
            look="ink"
            fence={false}
            manned={gc}
            power={gc}
            barrier={1 - gc}
            detail="full"
            ink={ink}
            accent={PEN.blue}
            paper={PEN.paper}
          />
        </div>
      ) : null}

      {/* The packet */}
      {pkt ? (
        <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <circle cx={pkt.x} cy={pkt.y} r={22} fill={alpha(packetColor, 0.18)} />
          <rect x={pkt.x - 15} y={pkt.y - 11} width={30} height={22} rx={3} fill={packetColor} />
          <path d={`M ${pkt.x - 13} ${pkt.y - 9} L ${pkt.x} ${pkt.y + 1} L ${pkt.x + 13} ${pkt.y - 9}`} fill="none" stroke={PEN.paper} strokeWidth={2.4} strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  );

  // ---- Unscaled overlays (px) ----------------------------------------------
  const overlayFont = (size: number): CSSProperties => ({ fontFamily: FONT.sans, fontSize: size, fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.15 });
  const portalTop = napkinPoint('portal', 'top', width);
  const calloutAt = portalCalloutAt ?? { x: Math.max(0, (BOX.portal.x - 10) * s), y: (BUS_Y - 16) * s };
  const calloutP = seg(z, 0.25, 1);
  const ws = napkinPoint('workstations', 'bottom', width);
  const tagAt = importTagAt ?? { x: ws.x, y: (BOX.oficinas.y + BOX.oficinas.h + 16) * s };
  const tagP = clamp01(importTag);
  const haltP = clamp01(haltNote);
  const haltAt = { x: (GATE.x + 40) * s, y: (GATE.ground - 52) * s };
  const fwTop = napkinPoint('fw', 'top', width);
  const fwBelow = { x: fwTop.x, y: (BOX.fw.y + BOX.fw.h + 12) * s };
  const slotGap = 18;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: H * s,
        opacity: 1 - 0.6 * clamp01(dimAll),
        filter: clamp01(glow) > 0.01 ? `drop-shadow(0 0 ${Math.round(10 + 24 * glow)}px ${alpha('#fde68a', 0.4 * glow)})` : undefined,
        ...style,
      }}
    >
      {drawing}
      {/* Portal callout: host + what it is */}
      {portalCallout && calloutP > 0.01 ? (
        <>
          <svg width={width} height={H * s} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: calloutP }}>
            <path
              d={`M ${calloutAt.x + 60} ${calloutAt.y} L ${portalTop.x} ${portalTop.y - 8}`}
              stroke={PEN.ink}
              strokeWidth={3.5}
              strokeLinecap="round"
              fill="none"
            />
            <circle cx={portalTop.x} cy={portalTop.y - 8} r={6} fill={PEN.ink} />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: calloutAt.x,
              top: calloutAt.y,
              transform: `translateY(-100%) translateY(${(1 - calloutP) * 12}px) rotate(-0.6deg)`,
              opacity: calloutP,
              padding: '14px 22px 16px',
              borderRadius: 8,
              background: '#fbf8f1',
              border: `2px solid ${alpha(PEN.ink, 0.5)}`,
              boxShadow: `0 12px 28px ${alpha('#000000', 0.4)}`,
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: PEN.ink, whiteSpace: 'nowrap', lineHeight: 1.1 }}>{NAPKIN_TEXT.portalHost}</div>
            <div style={{ ...overlayFont(32), color: alpha(PEN.ink, 0.85), marginTop: 6 }}>{NAPKIN_TEXT.portalWhat}</div>
          </div>
        </>
      ) : null}
      {/* «puestos de Importación» */}
      {tagP > 0.01 && !importTagAt ? (
        <svg width={width} height={H * s} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: tagP }}>
          <path d={`M ${ws.x} ${tagAt.y} L ${ws.x} ${ws.y + 6 * s}`} stroke={PEN.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" />
          <circle cx={ws.x} cy={ws.y + 6 * s} r={6} fill={PEN.ink} />
        </svg>
      ) : null}
      {tagP > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: tagAt.x,
            top: tagAt.y,
            transform: `translateX(-50%) translateY(${(1 - tagP) * 8}px)`,
            opacity: tagP,
            padding: '6px 14px',
            borderRadius: RADIUS.sm,
            background: '#fbf8f1',
            border: `2px solid ${alpha(PEN.ink, 0.5)}`,
            boxShadow: `0 8px 18px ${alpha('#000000', 0.3)}`,
            textAlign: 'center',
            ...overlayFont(32),
            color: PEN.ink,
          }}
        >
          {NAPKIN_TEXT.importStations.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      ) : null}
      {/* Halt note next to the stopped packet */}
      {haltP > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: haltAt.x,
            top: haltAt.y,
            transform: `translateY(-100%) translateX(${(1 - haltP) * -10}px) rotate(-1deg)`,
            opacity: haltP,
            padding: '6px 14px',
            borderRadius: RADIUS.sm,
            background: '#fbf8f1',
            border: `2px solid ${alpha(PEN.blue, 0.7)}`,
            boxShadow: `0 8px 18px ${alpha('#000000', 0.3)}`,
            ...overlayFont(32),
            color: PEN.blue,
          }}
        >
          {NAPKIN_TEXT.halt}
        </div>
      ) : null}
      {/* Slot pinned on fw-perimetro-01 */}
      {fwSlot && fwSlotPlacement === 'above' ? (
        <svg width={width} height={H * s} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d={`M ${fwTop.x} ${-slotGap} L ${fwTop.x} ${(BOX.fw.y - 54) * s}`} stroke={PEN.ink} strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={fwTop.x} cy={(BOX.fw.y - 54) * s} r={6} fill={PEN.ink} />
        </svg>
      ) : null}
      {fwSlot ? (
        <div
          style={{
            position: 'absolute',
            left: fwSlotPlacement === 'above' ? fwTop.x : fwBelow.x,
            top: fwSlotPlacement === 'above' ? -slotGap : fwBelow.y,
            transform: fwSlotPlacement === 'above' ? 'translate(-30%, -100%)' : 'translateX(-30%)',
          }}
        >
          {fwSlot}
        </div>
      ) : null}
    </div>
  );
}
