import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { TruckTop } from '../Checkpoint';

/**
 * Pieces of s07-decidir (not shared): the planned L-shaped road from a checkpoint into a zone,
 * the port's own road (a separate lane that never meets the management firewall), the pumps of
 * the lock gates (pumps and water only: no PLC, no label), the management interfaces as tiles,
 * and the numbered empty slot of the opening. Panel-local px; nothing positions itself unless it
 * says so.
 */

const PLAN_ROAD = '#0d1e38';

/**
 * A planned road on the blueprint: up from the bottom of the stage through a checkpoint at x `rc`,
 * then a rounded turn to the right along y `hy` into a zone whose left edge is at `zx`. Drawn
 * absolutely over the whole stage (W × H). `draw` 0–1 draws it from the bottom.
 */
export function PlanRoad({ rc, hw, hy, zx, bottom = 660, r = 46, draw = 1, opacity = 1 }: { rc: number; hw: number; hy: number; zx: number; bottom?: number; r?: number; draw?: number; opacity?: number }) {
  const p = clamp01(draw);
  if (p <= 0.001) return null;
  const d = `M ${rc} ${bottom} L ${rc} ${hy + r} Q ${rc} ${hy} ${rc + r} ${hy} L ${zx} ${hy}`;
  const dash = { pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - p } as const;
  return (
    <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity }}>
      <path d={d} fill="none" stroke={alpha(C.cyan, 0.6)} strokeWidth={2 * hw + 6} strokeLinejoin="round" {...dash} />
      <path d={d} fill="none" stroke={PLAN_ROAD} strokeWidth={2 * hw} strokeLinejoin="round" {...dash} />
      <path d={d} fill="none" stroke={alpha(C.cyan, 0.32)} strokeWidth={3} strokeDasharray="20 16" opacity={clamp01((p - 0.7) / 0.3)} />
    </svg>
  );
}

/**
 * The port's own traffic: a horizontal road from `x0` to `x1` (its centre at `y`), trucks driving
 * to the right without stopping. It never touches the management firewall's road.
 */
export function PortLane({ x0, x1, y, h = 64, frame, start, show }: { x0: number; x1: number; y: number; h?: number; frame: number; start: number; show: number }) {
  const v = clamp01(show);
  if (v <= 0.001) return null;
  const L = x1 - x0;
  const s = 0.36; // truck scale: 54 px long, 22 px wide
  const truckLen = 150 * s;
  const spacing = 230;
  const speed = 4.2;
  const loop = L + truckLen + 40;
  const t = Math.max(0, frame - start);
  const n = Math.ceil(loop / spacing) + 1;
  const trucks = Array.from({ length: n }, (_, k) => {
    const nx = ((t * speed + k * spacing) % loop) - 20;
    return nx;
  });
  return (
    <svg width={L} height={h} style={{ position: 'absolute', left: x0, top: y - h / 2, overflow: 'hidden', opacity: v }}>
      <defs>
        <linearGradient id="s07-lane-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.ink850} stopOpacity={0} />
          <stop offset="0.08" stopColor={C.ink850} stopOpacity={1} />
          <stop offset="0.92" stopColor={C.ink850} stopOpacity={1} />
          <stop offset="1" stopColor={C.ink850} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="s07-lane-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.emerald} stopOpacity={0} />
          <stop offset="0.08" stopColor={C.emerald} stopOpacity={0.7} />
          <stop offset="0.92" stopColor={C.emerald} stopOpacity={0.7} />
          <stop offset="1" stopColor={C.emerald} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={L} height={h} fill="url(#s07-lane-fade)" />
      <line x1={0} y1={1.5} x2={L} y2={1.5} stroke="url(#s07-lane-edge)" strokeWidth={3} />
      <line x1={0} y1={h - 1.5} x2={L} y2={h - 1.5} stroke="url(#s07-lane-edge)" strokeWidth={3} />
      <line x1={0} y1={h / 2} x2={L} y2={h / 2} stroke={alpha(C.muted, 0.35)} strokeWidth={2.5} strokeDasharray="18 16" strokeDashoffset={-t * speed} />
      {trucks.map((nx, k) => (
        <g key={k} transform={`translate(${nx} ${h / 2}) rotate(90)`}>
          <TruckTop x={0} y={0} scale={s} strokeWidth={4} opacity={Math.min(1, nx / 60, (L - nx + truckLen) / 60)} />
        </g>
      ))}
    </svg>
  );
}

/** One pump seen from the front: casing, inlet and outlet stubs, an impeller turning at `angle`. */
function Pump({ cx, cy, r, angle, color }: { cx: number; cy: number; r: number; angle: number; color: string }) {
  const blades = [0, 90, 180, 270];
  return (
    <g>
      {/* Pipes */}
      <rect x={cx - r - 26} y={cy + r * 0.25} width={28} height={r * 0.5} rx={3} fill={alpha(color, 0.18)} stroke={color} strokeWidth={2.5} />
      <rect x={cx - r * 0.25} y={cy - r - 22} width={r * 0.5} height={24} rx={3} fill={alpha(color, 0.18)} stroke={color} strokeWidth={2.5} />
      {/* Casing */}
      <circle cx={cx} cy={cy} r={r} fill={C.ink900} stroke={color} strokeWidth={3.5} />
      <circle cx={cx} cy={cy} r={r - 9} fill="none" stroke={alpha(color, 0.35)} strokeWidth={2} />
      {/* Impeller */}
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        {blades.map((b) => (
          <path
            key={b}
            transform={`rotate(${b} ${cx} ${cy})`}
            d={`M ${cx} ${cy} Q ${cx + r * 0.45} ${cy - r * 0.15} ${cx + r * 0.62} ${cy - r * 0.52}`}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
          />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.16} fill={color} />
      </g>
    </g>
  );
}

/**
 * The pumps of the lock gates and the water they move, inside a `w × h` box: three pumps turning
 * and a water band at the bottom. No PLC, no label.
 */
export function PumpsNet({ w, h, frame, color = C.roseSoft, glow = 0 }: { w: number; h: number; frame: number; color?: string; glow?: number }) {
  const r = Math.min(46, h * 0.2);
  const cy = h * 0.42;
  const xs = [0.22, 0.5, 0.78].map((k) => w * k);
  const angle = frame * 3;
  const waterY = h * 0.78;
  const phase = (frame * 2.2) % 120;
  const wave = (y: number, amp: number, shift: number) => {
    let d = `M ${-120 + shift} ${y}`;
    for (let x = -120; x < w + 120; x += 60) d += ` q 15 ${-amp} 30 0 t 30 0`;
    return d;
  };
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'hidden', filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(10 * glow)}px ${alpha(color, 0.6 * glow)})` : undefined }}>
      {/* Water */}
      <path d={`${wave(waterY, 7, phase)} L ${w + 120} ${h} L -120 ${h} Z`} fill={alpha(C.sky, 0.22)} />
      <path d={wave(waterY, 7, phase)} fill="none" stroke={alpha(C.sky, 0.8)} strokeWidth={3} />
      <path d={wave(waterY + 18, 5, -phase)} fill="none" stroke={alpha(C.sky, 0.4)} strokeWidth={2} />
      {/* A pipe bus feeding the pumps from the water */}
      <path d={`M ${xs[0] - r - 26} ${cy + r * 0.5} L ${xs[0] - r - 40} ${cy + r * 0.5} L ${xs[0] - r - 40} ${waterY + 6}`} fill="none" stroke={alpha(color, 0.6)} strokeWidth={3} />
      {xs.map((x, i) => (
        <Pump key={i} cx={x} cy={cy} r={r} angle={angle + i * 25} color={color} />
      ))}
    </svg>
  );
}

/** A management interface tile (switch or firewall) inside the management zone. */
export function MgmtTile({ icon, size = 64, glow = 0 }: { icon: IconName; size?: number; glow?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        display: 'grid',
        placeItems: 'center',
        background: alpha(C.ink900, 0.9),
        border: `2.5px solid ${alpha(C.emerald, 0.55 + 0.45 * glow)}`,
        boxShadow: glow > 0.01 ? `0 0 ${Math.round(18 * glow)}px ${alpha(C.emerald, 0.5 * glow)}` : undefined,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.62)} color={C.cyanSoft} strokeWidth={2} />
    </div>
  );
}

/** The opening's numbered empty slot (a dashed placeholder for «dos controles»). */
export function Slot({ n, w, h, show }: { n: number; w: number; h: number; show: number }) {
  const v = clamp01(show);
  if (v <= 0.001) return null;
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px dashed ${alpha(C.cyan, 0.45)}`,
        background: alpha(C.cyan, 0.04),
        display: 'grid',
        placeItems: 'center',
        fontFamily: FONT.sans,
        fontSize: 150,
        fontWeight: 850,
        color: alpha(C.cyan, 0.4),
        opacity: v,
        transform: `scale(${0.94 + 0.06 * v})`,
      }}
    >
      {n}
    </div>
  );
}
