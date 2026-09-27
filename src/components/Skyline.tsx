import { useId } from 'react';
import {
  BACK_ROW,
  BEACON,
  BEACON_TOWER,
  FRONT_ROW,
  GROUND_Y,
  STARS,
  VIEW,
  WIN,
  type Building,
  type WindowTone,
} from '../lib/skyline';

/** Same meanings as the videos: dim = routine, cyan = data, amber = warning. */
const WINDOW_FILL: Record<WindowTone, string | null> = {
  off: null,
  dim: 'fill-slate-500/35',
  data: 'fill-cyan-400/80',
  warn: 'fill-amber-400/90',
};

function BuildingShape({ b }: { b: Building }) {
  const front = b.layer === 1;
  return (
    <g>
      <rect
        x={b.x}
        y={b.top}
        width={b.width}
        height={GROUND_Y - b.top + 1}
        className={front ? 'fill-ink-900' : 'fill-ink-850'}
        opacity={front ? 1 : 0.9}
      />
      <rect x={b.x} y={b.top} width={b.width} height={1} className={front ? 'fill-ink-600' : 'fill-ink-700'} />
      {b.windows.map((w, i) => {
        const fill = WINDOW_FILL[w.tone];
        if (!fill) return null;
        return (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width={WIN.w}
            height={WIN.h}
            rx={0.8}
            className={fill}
            opacity={front ? 1 : 0.45}
          />
        );
      })}
    </g>
  );
}

/** The alert that matters: a rose beacon on the antenna of the tallest tower. */
function Beacon({ glowId }: { glowId: string }) {
  return (
    <g>
      <circle cx={BEACON.x} cy={BEACON.y} r={36} fill={`url(#${glowId})`} />
      <rect
        x={BEACON.x - 1}
        y={BEACON.y + 5}
        width={2}
        height={BEACON_TOWER.top - BEACON.y - 5}
        className="fill-ink-600"
      />
      <rect x={BEACON.x - 6} y={BEACON_TOWER.top - 4} width={12} height={4} className="fill-ink-700" />
      <circle
        cx={BEACON.x}
        cy={BEACON.y}
        r={11}
        fill="none"
        strokeWidth={1.2}
        className="beacon-ping stroke-rose-500/35"
      />
      <circle cx={BEACON.x} cy={BEACON.y} r={7.5} strokeWidth={1.2} className="fill-rose-500/10 stroke-rose-500/65" />
      <circle cx={BEACON.x} cy={BEACON.y} r={4} className="fill-rose-500" />
      <circle cx={BEACON.x - 1.3} cy={BEACON.y - 1.3} r={1.4} className="fill-rose-400" />
    </g>
  );
}

/**
 * Alertópolis at night, as on the channel banner: a city whose windows are
 * log events. Drawn with `xMaxYMax slice`, so the street and the beacon tower
 * (near the right edge) always show and narrow screens lose the left side.
 */
export function Skyline({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const glowId = `beacon-glow-${id}`;
  const streetId = `street-glow-${id}`;
  return (
    <svg
      viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
      preserveAspectRatio="xMaxYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.32} />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={streetId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.16} />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
        </linearGradient>
      </defs>
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} className="fill-slate-200" opacity={s.o} />
      ))}
      {BACK_ROW.map((b, i) => (
        <BuildingShape key={`b${i}`} b={b} />
      ))}
      {FRONT_ROW.map((b, i) => (
        <BuildingShape key={`f${i}`} b={b} />
      ))}
      <rect x={0} y={GROUND_Y} width={VIEW.width} height={VIEW.height - GROUND_Y} className="fill-ink-950" />
      <rect x={0} y={GROUND_Y + 1} width={VIEW.width} height={VIEW.height - GROUND_Y} fill={`url(#${streetId})`} />
      <rect x={0} y={GROUND_Y - 0.5} width={VIEW.width} height={1.5} className="fill-cyan-400/55" />
      <Beacon glowId={glowId} />
    </svg>
  );
}
