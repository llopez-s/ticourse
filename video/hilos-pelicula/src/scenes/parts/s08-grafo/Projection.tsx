import { useId } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/** A rectangle in the coordinates of the positioned parent (stage-local in the scenes). */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * The projector's light: a translucent rose cone from a source frame (Meridian's E9) to a target slot (Orbital's
 * empty Actions on Objectives). It is drawn as LIGHT, never as a solid object, so what lands in the slot reads as a
 * projection and not as an observed Orbital frame.
 *
 * - `reach` 0–1: how far the cone has travelled from the source to the target.
 * - `glow`  0–1: brightness (the voice is on it).
 * - `land`  0–1: how deep into the target the light pools.
 * Render it inside an absolutely positioned box that shares the rects' coordinates; it draws its own <svg>.
 */
export function ProjectionBeam({
  from,
  to,
  reach,
  glow = 1,
  color = C.rose,
  land = 0,
  width,
  height,
}: {
  from: Rect;
  to: Rect;
  reach: number;
  glow?: number;
  color?: string;
  /** 0–1: how deep into the target the light pools (0 = its near edge, 1 = its far edge). */
  land?: number;
  width: number;
  height: number;
}) {
  const id = useId().replace(/:/g, '');
  const r = clamp01(reach);
  if (r <= 0) return null;
  const g = clamp01(glow);
  // Source: a narrow lens on the source's facing edge; target: the whole facing edge of the slot.
  const down = to.y > from.y;
  const sy = down ? from.y + from.h : from.y;
  const ty = down ? to.y + to.h * clamp01(land) : to.y + to.h * (1 - clamp01(land));
  const scx = from.x + from.w / 2;
  const lens = Math.min(from.w * 0.36, 70);
  const tyNow = sy + (ty - sy) * r;
  const spread = (t: number) => lens / 2 + ((to.w / 2 - 6) - lens / 2) * t;
  const tcxNow = scx + (to.x + to.w / 2 - scx) * r;
  const half = spread(r);
  const pts = [
    [scx - lens / 2, sy],
    [scx + lens / 2, sy],
    [tcxNow + half, tyNow],
    [tcxNow - half, tyNow],
  ]
    .map((p) => p.join(','))
    .join(' ');
  return (
    <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={`beam-${id}`} x1={0} y1={sy} x2={0} y2={ty} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity={0.5 * g} />
          <stop offset="100%" stopColor={color} stopOpacity={0.14 * g} />
        </linearGradient>
      </defs>
      <polygon points={pts} fill={`url(#beam-${id})`} />
      {/* Two soft edges and a centre ray: light, not a solid. */}
      <line x1={scx - lens / 2} y1={sy} x2={tcxNow - half} y2={tyNow} stroke={alpha(color, 0.45 * g)} strokeWidth={2} strokeDasharray="6 8" />
      <line x1={scx + lens / 2} y1={sy} x2={tcxNow + half} y2={tyNow} stroke={alpha(color, 0.45 * g)} strokeWidth={2} strokeDasharray="6 8" />
      {/* The lens on the source frame. */}
      <rect x={scx - lens / 2} y={sy - 4} width={lens} height={8} rx={4} fill={alpha(color, 0.85 * g)} style={{ filter: `drop-shadow(0 0 10px ${alpha(color, 0.8 * g)})` }} />
    </svg>
  );
}

/**
 * The projected frame, drawn in the target slot as a projection: dashed rose outline, translucent fill, scan lines and
 * a «proyectado» look — never the solid card of an observed frame. Used only where the shared EventCard has no
 * projected look to offer; text is passed in (canon strings live in src/data).
 */
export function ProjectedFrameGhost({
  rect,
  show,
  glow = 0,
  lines,
  size = 26,
}: {
  rect: Rect;
  show: number;
  glow?: number;
  lines: readonly string[];
  size?: number;
}) {
  const s = clamp01(show);
  if (s <= 0) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'absolute',
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px dashed ${alpha(C.roseSoft, 0.55 + 0.4 * g)}`,
        background: `repeating-linear-gradient(180deg, ${alpha(C.rose, 0.16 + 0.1 * g)} 0px, ${alpha(C.rose, 0.16 + 0.1 * g)} 2px, ${alpha(C.rose, 0.06)} 2px, ${alpha(C.rose, 0.06)} 7px)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(C.rose, 0.5 * g)}, inset 0 0 ${Math.round(24 * g)}px ${alpha(C.rose, 0.3 * g)}` : undefined,
        opacity: s * 0.92,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        padding: '6px 10px',
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.12,
        color: alpha(C.textStrong, 0.85),
        textAlign: 'center',
      }}
    >
      {lines.map((l, k) => (
        <div key={k} style={{ whiteSpace: 'nowrap' }}>
          {l}
        </div>
      ))}
    </div>
  );
}
