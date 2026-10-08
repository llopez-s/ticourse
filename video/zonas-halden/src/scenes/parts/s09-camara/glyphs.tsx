import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { SENSORS } from '../../../data/s09-camara';

/**
 * Small pieces s09 draws on its traffic lanes (blueprint and conceptual):
 * the bad packet (an envelope), the tap junction, the switch with its mirror
 * port, the sensor and the inline device. SVG pieces take the centre point in
 * the parent <svg>'s units; HTML pieces are positioned by the caller.
 */

/** A packet drawn as a small envelope centred on (x, y). `copy` = a hollow dashed twin (what a tap receives). */
export function Envelope({ x, y, color = C.rose, copy = false, scale = 1, opacity = 1 }: { x: number; y: number; color?: string; copy?: boolean; scale?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const w = 38 * scale;
  const h = 26 * scale;
  return (
    <g opacity={opacity} transform={`translate(${x - w / 2} ${y - h / 2})`}>
      {!copy ? <rect x={-6} y={-6} width={w + 12} height={h + 12} rx={9} fill={alpha(color, 0.18)} /> : null}
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={4 * scale}
        fill={copy ? alpha(color, 0.12) : color}
        stroke={copy ? color : alpha('#ffffff', 0.5)}
        strokeWidth={copy ? 2.5 : 1.5}
        strokeDasharray={copy ? '5 4' : undefined}
      />
      <path d={`M 2 2 L ${w / 2} ${h * 0.58} L ${w - 2} 2`} fill="none" stroke={copy ? color : alpha(C.ink950, 0.75)} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
}

/** The tap: a junction box on the lane with a branch going down (a copy leaves through it). */
export function TapNode({ x, y, lit = 1, color = C.cyan }: { x: number; y: number; lit?: number; color?: string }) {
  const l = clamp01(lit);
  return (
    <g opacity={0.35 + 0.65 * l}>
      <rect x={x - 24} y={y - 18} width={48} height={36} rx={7} fill={C.ink900} stroke={color} strokeWidth={3} />
      <path d={`M ${x - 14} ${y} L ${x + 14} ${y} M ${x} ${y} L ${x} ${y + 12}`} stroke={color} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

/** A switch (sky = infrastructure) on the lane; port `mirrorPort` (0–5 along the bottom) copies to a sensor. */
export function SwitchBox({ x, y, mirror = 0, width = 210 }: { x: number; y: number; mirror?: number; width?: number }) {
  const h = 74;
  const m = clamp01(mirror);
  const ports = [0, 1, 2, 3, 4, 5];
  const px = (i: number) => x - width / 2 + 24 + i * ((width - 48) / 5);
  return (
    <g>
      <rect x={x - width / 2} y={y - h / 2} width={width} height={h} rx={10} fill={C.ink800} stroke={C.sky} strokeWidth={3} />
      {ports.map((i) => (
        <rect
          key={i}
          x={px(i) - 9}
          y={y + h / 2 - 26}
          width={18}
          height={14}
          rx={2}
          fill={i === 5 ? (m > 0.01 ? alpha(C.cyan, 0.25 + 0.6 * m) : C.ink700) : C.ink700}
          stroke={i === 5 ? (m > 0.01 ? C.cyanSoft : alpha(C.sky, 0.6)) : alpha(C.sky, 0.6)}
          strokeWidth={2}
        />
      ))}
      {/* status LEDs */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x - width / 2 + 22 + i * 16} cy={y - h / 2 + 16} r={3.5} fill={alpha(C.emerald, 0.8)} />
      ))}
    </g>
  );
}

/** Where SwitchBox's mirror port is (the dashed copy line starts there). */
export function switchMirrorPort(x: number, y: number, width = 210) {
  return { x: x - width / 2 + 24 + 5 * ((width - 48) / 5), y: y + 74 / 2 - 12 };
}

/** The network sensor: a box with an eye and «sensor». `power` 0 = switched off (a blind spot). */
export function SensorBox({ power = 1, alert = 0, glow = 0, width = 176 }: { power?: number; alert?: number; glow?: number; width?: number }) {
  const on = clamp01(power);
  const al = clamp01(alert) * on;
  const g = clamp01(glow) * on;
  const border = al > 0.5 ? C.amber : on > 0.5 ? C.cyan : '#475569';
  return (
    <div
      style={{
        width,
        height: 72,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderRadius: 14,
        border: `3px solid ${alpha(border, 0.55 + 0.45 * Math.max(on, 0.4))}`,
        background: on > 0.5 ? `linear-gradient(180deg, ${alpha(C.cyan, 0.1 + 0.08 * g)} 0%, ${C.ink900} 100%)` : '#0a0f1a',
        boxShadow: al > 0.01 ? `0 0 ${Math.round(30 * al)}px ${alpha(C.amber, 0.45 * al)}` : g > 0.01 ? `0 0 ${Math.round(26 * g)}px ${alpha(C.cyan, 0.35 * g)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 750,
        color: on > 0.5 ? C.cyanSoft : '#64748b',
      }}
    >
      <Icon name="eye" size={36} color={on > 0.5 ? (al > 0.5 ? C.amber : C.cyan) : '#475569'} strokeWidth={2.2} />
      {SENSORS.sensor}
    </div>
  );
}

/** The inline device: the traffic crosses it; it can drop a packet. */
export function InlineDevice({ glow = 0, dim = 0, width = 150, height = 100 }: { glow?: number; dim?: number; width?: number; height?: number }) {
  const g = clamp01(glow);
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        display: 'grid',
        placeItems: 'center',
        borderRadius: 16,
        border: `3px solid ${alpha(C.cyan, 0.7 + 0.3 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12 + 0.1 * g)} 0%, ${C.ink900} 100%)`,
        boxShadow: g > 0.01 ? `0 0 ${Math.round(34 * g)}px ${alpha(C.cyan, 0.4 * g)}` : undefined,
        opacity: 1 - 0.55 * clamp01(dim),
      }}
    >
      <Icon name="shield" size={Math.round(height * 0.56)} color={C.cyan} strokeWidth={2.2} />
    </div>
  );
}
