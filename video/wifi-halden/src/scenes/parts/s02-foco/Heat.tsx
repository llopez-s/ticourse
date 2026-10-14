import { C, STAGE, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { ANTENNAS, INNER, PLOT, coneHalfWidth } from './geometry';

/**
 * The heat map (stage units, inside the scene's <svg>): strong red and orange next to each access
 * point, then yellow, green and weak blue. The ONLY place in the video where red is not an
 * attacker. Drawn level by level over every source at once, so that overlapping coverage reads as
 * one field. The round coverage is clipped to the terminal's plot; only the two boundary
 * antennas' lobes can leave it. Ids are prefixed `wh-s02-`.
 */
const RAMP = [
  { color: '#3b82f6', a: 0.5, circle: 1, lobe: 1 },
  { color: '#22c55e', a: 0.55, circle: 0.8, lobe: 0.74 },
  { color: '#facc15', a: 0.62, circle: 0.6, lobe: 0.48 },
  { color: '#fb923c', a: 0.78, circle: 0.42, lobe: 0.25 },
  { color: '#ef4444', a: 0.86, circle: 0.24, lobe: 0.1 },
] as const;

/** One antenna's lobe at this instant. */
export type LobeState = { x: number; y: number; angle: number; reach: number; spread: number };

/** The lobe's outline up to fraction `f` of its reach: the floodlight's cone, from the pivot. */
function lobePoints(reach: number, spread: number, f: number): string {
  const d = Math.max(1, reach * f);
  const near = coneHalfWidth(0, spread);
  const far = coneHalfWidth(d, spread);
  return `0,${-near} ${d},${-far} ${d},${far} 0,${near}`;
}

export function HeatDefs() {
  return (
    <defs>
      <filter id="wh-s02-soft" filterUnits="userSpaceOnUse" x={-200} y={-200} width={STAGE.width + 400} height={STAGE.height + 400}>
        <feGaussianBlur stdDeviation={13} />
      </filter>
      <clipPath id="wh-s02-plot">
        <rect x={PLOT.x0} y={PLOT.y0} width={PLOT.x1 - PLOT.x0} height={PLOT.y1 - PLOT.y0} />
      </clipPath>
      <clipPath id="wh-s02-outside">
        <rect x={PLOT.x1} y={-400} width={2400} height={1600} />
      </clipPath>
    </defs>
  );
}

/**
 * `inner` 0–1 per inner access point and `edge` 0–1 per boundary antenna: how much of its round
 * coverage has been measured. `lobes`: the two boundary lobes (reach 0 hides one).
 */
export function HeatMap({ inner, edge, lobes, opacity = 1 }: { inner: number[]; edge: number[]; lobes: LobeState[]; opacity?: number }) {
  if (opacity <= 0.001) return null;
  return (
    <g opacity={opacity}>
      {RAMP.map((level) => (
        <g key={level.color} filter="url(#wh-s02-soft)" opacity={level.a}>
          <g clipPath="url(#wh-s02-plot)">
            {INNER.map((ap, i) => (
              <circle key={`i${i}`} cx={ap.x} cy={ap.y} r={ap.r * level.circle * clamp01(inner[i] ?? 0)} fill={level.color} />
            ))}
            {ANTENNAS.map((ap, i) => (
              <circle key={`e${i}`} cx={ap.x} cy={ap.y} r={ap.r * level.circle * clamp01(edge[i] ?? 0)} fill={level.color} />
            ))}
          </g>
          {lobes.map((l, i) =>
            l.reach > 2 ? (
              <polygon key={`l${i}`} transform={`translate(${l.x} ${l.y}) rotate(${l.angle})`} points={lobePoints(l.reach, l.spread, level.lobe)} fill={level.color} />
            ) : null,
          )}
        </g>
      ))}
    </g>
  );
}

/**
 * The finding: the part of each lobe that lies past the terminal's limit, outlined in dashed
 * amber. It is the same cone the floodlight draws.
 */
export function SpillOutline({ lobes, show }: { lobes: LobeState[]; show: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <g clipPath="url(#wh-s02-outside)" opacity={s}>
      {lobes.map((l, i) =>
        l.reach > 2 ? (
          <polygon
            key={i}
            transform={`translate(${l.x} ${l.y}) rotate(${l.angle})`}
            points={lobePoints(l.reach, l.spread, 1)}
            fill={alpha(C.amber, 0.08)}
            stroke={C.amber}
            strokeWidth={3.5}
            strokeLinejoin="round"
            strokeDasharray="12 9"
          />
        ) : null,
      )}
    </g>
  );
}

/** What still reaches the car park once the antennas are turned: a weak blue haze («se oye menos, pero se oye»). */
export function Residual({ show, x, y }: { show: number; x: number; y: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <g filter="url(#wh-s02-soft)" opacity={0.42 * s}>
      <ellipse cx={(PLOT.x1 + x) / 2 + 20} cy={y + 8} rx={(x - PLOT.x1) / 2 + 70} ry={104} fill="#3b82f6" />
    </g>
  );
}
