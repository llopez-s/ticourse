import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** Height / width of the traffic light (housing + pole). */
export const LIGHT_RATIO = 3;

/**
 * One traffic light, front view: dark housing, three lamps and a short pole. Only the red (rose) and the green
 * (emerald) lamps ever light — the amber one stays dark in this video. `red` and `green` are 0–1 brightness.
 */
export function TrafficLight({
  width,
  red = 0,
  green = 0,
  housing = C.ink800,
  stroke = alpha(C.text, 0.4),
  pole = true,
}: {
  width: number;
  red?: number;
  green?: number;
  housing?: string;
  stroke?: string;
  pole?: boolean;
}) {
  const h = width * LIGHT_RATIO;
  const r = clamp01(red);
  const g = clamp01(green);
  const lamp = (cy: number, color: string, on: number) => (
    <g>
      <circle cx={50} cy={cy} r={24} fill={alpha(C.ink950, 0.9)} stroke={alpha(C.text, 0.18)} strokeWidth={3} />
      {on > 0.01 ? (
        <>
          <circle cx={50} cy={cy} r={34} fill={alpha(color, 0.22 * on)} />
          <circle cx={50} cy={cy} r={22} fill={alpha(color, 0.25 + 0.75 * on)} />
          <circle cx={44} cy={cy - 7} r={6} fill={alpha('#ffffff', 0.35 * on)} />
        </>
      ) : null}
    </g>
  );
  return (
    <svg width={width} height={h} viewBox="0 0 100 300" style={{ display: 'block', overflow: 'visible' }}>
      {pole ? <rect x={43} y={200} width={14} height={100} rx={4} fill={C.ink700} stroke={alpha(C.text, 0.2)} strokeWidth={2} /> : null}
      <rect x={14} y={4} width={72} height={204} rx={20} fill={housing} stroke={stroke} strokeWidth={4} />
      {/* visors */}
      {[40, 106, 172].map((cy) => (
        <path key={cy} d={`M 22 ${cy - 30} Q 50 ${cy - 44} 78 ${cy - 30}`} fill="none" stroke={alpha(C.text, 0.22)} strokeWidth={4} strokeLinecap="round" />
      ))}
      {lamp(40, C.rose, r)}
      {lamp(106, C.amber, 0)}
      {lamp(172, C.emerald, g)}
    </svg>
  );
}

/**
 * The timer next to the light: a ring that empties as the light's phase runs out (`remaining` 1→0). No digits —
 * it is a countdown, never a clock.
 */
export function TimerRing({ size, remaining, tone = C.emerald }: { size: number; remaining: number; tone?: string }) {
  const r = 40;
  const len = 2 * Math.PI * r;
  const rem = clamp01(remaining);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <circle cx={50} cy={50} r={r} fill={alpha(C.ink900, 0.9)} stroke={alpha(C.text, 0.15)} strokeWidth={10} />
      <circle
        cx={50}
        cy={50}
        r={r}
        fill="none"
        stroke={tone}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={`${len * rem} ${len}`}
        transform="rotate(-90 50 50)"
      />
      <circle cx={50} cy={50} r={6} fill={alpha(tone, 0.8)} />
      <line x1={50} y1={50} x2={50 + 22 * Math.sin(2 * Math.PI * (1 - rem))} y2={50 - 22 * Math.cos(2 * Math.PI * (1 - rem))} stroke={tone} strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
}
