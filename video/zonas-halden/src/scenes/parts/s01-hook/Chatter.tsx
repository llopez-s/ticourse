import { useCurrentFrame } from 'remotion';
import { alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { PEN } from '../Checkpoint';
import { napkinPoint, napkinSize, type NapkinVlan } from '../Napkin';

/**
 * s01-04 «el router central las deja hablar entre sí sin preguntar»: small ink
 * dots that travel from one VLAN up the bus, into `rt-core` and straight back
 * down to another VLAN, nobody stopping them. An overlay for the shared Napkin
 * (it does not redraw it): place it in the same wrapper, at the napkin's
 * top-left, with the same `width`. Ink pen, not the red packet of s02.
 */

type Pt = { x: number; y: number };

/** The trips (from → to), each a loop with its own phase. */
const TRIPS: readonly { from: NapkinVlan; to: NapkinVlan; phase: number }[] = [
  { from: 'oficinas', to: 'pruebas', phase: 0 },
  { from: 'produccion', to: 'administracion', phase: 0.27 },
  { from: 'pruebas', to: 'oficinas', phase: 0.52 },
  { from: 'administracion', to: 'produccion', phase: 0.78 },
];

function tripPath(from: NapkinVlan, to: NapkinVlan, width: number): Pt[] {
  const a = napkinPoint(from, 'top', width);
  const b = napkinPoint(to, 'top', width);
  const bus = napkinPoint('bus', 'center', width);
  const rt = napkinPoint('rtcore', 'bottom', width);
  return [a, { x: a.x, y: bus.y }, { x: bus.x, y: bus.y }, { x: bus.x, y: rt.y }, { x: bus.x, y: bus.y }, { x: b.x, y: bus.y }, b];
}

function along(pts: Pt[], t: number): Pt {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = lens.reduce((s, l) => s + l, 0);
  let d = clamp01(t) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const k = lens[i] ? clamp01(d / lens[i]) : 0;
      return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * k, y: pts[i].y + (pts[i + 1].y - pts[i].y) * k };
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}

export function Chatter({
  width,
  start,
  show,
  period = 72,
  frame: frameProp,
}: {
  /** The napkin's width in px (same as the Napkin's). */
  width: number;
  /** Frame the trips start moving. */
  start: number;
  /** 0–1 visibility (fade in/out from the scene). */
  show: number;
  /** Frames one trip takes. */
  period?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const vis = clamp01(show);
  if (vis <= 0.01) return null;
  const { h, scale } = napkinSize(width);
  const r = Math.max(7, 13 * scale);
  return (
    <svg width={width} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      {TRIPS.map((trip, i) => {
        const run = (frame - start) / period + trip.phase;
        if (run < 0) return null;
        const t = run - Math.floor(run);
        // Each dot fades in as it leaves its VLAN and out as it arrives (no pop at the loop's seam).
        const edge = Math.min(clamp01(t / 0.08), clamp01((1 - t) / 0.08));
        const p = along(tripPath(trip.from, trip.to, width), t);
        return (
          <g key={i} opacity={vis * edge}>
            <circle cx={p.x} cy={p.y} r={r * 1.9} fill={alpha(PEN.ink, 0.14)} />
            <circle cx={p.x} cy={p.y} r={r} fill={PEN.ink} stroke={PEN.paper} strokeWidth={Math.max(2, r * 0.3)} />
          </g>
        );
      })}
    </svg>
  );
}
