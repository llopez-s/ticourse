import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { STEEL } from '../Glyphs';
import { ANTENNAS, BUILDING, CRANES, INNER, PARK, PLOT, ROAD, WALK, WATER, YARD, walkPoint } from './geometry';

/**
 * The plan's structure, drawn inside the scene's <svg> in stage units: the terminal's plot (yard
 * stacks, an office block, two quay cranes over the water), the street and the visitors' car
 * park. Neutral steel throughout. The terminal's limit is a line painted on a plan; `spill` 0–1
 * turns amber the stretch of it that the signal crosses. The car park is empty bays: no cars, no
 * people. Access points are small sky dots (`aps` 0–1 shows them).
 */
export function PlanStructure({ spill = 0, aps = 1 }: { spill?: number; aps?: number }) {
  const sp = clamp01(spill);
  const bays = 6;
  const bayW = (PARK.x1 - PARK.x0 - 36) / bays;
  return (
    <g>
      {/* water under the quay, with a moored hull */}
      <rect x={PLOT.x0} y={WATER.y0} width={PLOT.x1 - PLOT.x0} height={WATER.y1 - WATER.y0} fill={alpha('#0b3558', 0.5)} />
      {[618, 638].map((y, k) => (
        <line key={y} x1={PLOT.x0 + 20 + k * 30} y1={y} x2={PLOT.x1 - 30 - k * 24} y2={y} stroke={alpha(C.sky, 0.22)} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="26 22" />
      ))}
      <path d={`M 218 612 H 560 L 596 634 L 560 656 H 218 Z`} fill={STEEL.fill} stroke={STEEL.line} strokeWidth={2.5} strokeLinejoin="round" />

      {/* the street and the car park across it */}
      <rect x={ROAD.x0} y={PLOT.y0 - 20} width={ROAD.x1 - ROAD.x0} height={WATER.y1 - PLOT.y0 + 20} fill={alpha(C.ink850, 0.9)} />
      <line x1={(ROAD.x0 + ROAD.x1) / 2} y1={PLOT.y0 - 10} x2={(ROAD.x0 + ROAD.x1) / 2} y2={WATER.y1} stroke={alpha(STEEL.line, 0.7)} strokeWidth={3} strokeDasharray="22 20" />
      <rect x={PARK.x0} y={PARK.y0} width={PARK.x1 - PARK.x0} height={PARK.y1 - PARK.y0} rx={12} fill={alpha(C.ink800, 0.85)} stroke={STEEL.line} strokeWidth={3} />
      {[PARK.y0, PARK.y1].map((edge, row) =>
        Array.from({ length: bays + 1 }, (_, i) => {
          const x = PARK.x0 + 18 + i * bayW;
          const y0 = row === 0 ? edge + 14 : edge - 14;
          const y1 = row === 0 ? edge + 86 : edge - 86;
          return <line key={`${row}-${i}`} x1={x} y1={y0} x2={x} y2={y1} stroke={alpha(STEEL.light, 0.5)} strokeWidth={3} strokeLinecap="round" />;
        }),
      )}

      {/* the terminal's plot */}
      <rect x={PLOT.x0} y={PLOT.y0} width={PLOT.x1 - PLOT.x0} height={PLOT.y1 - PLOT.y0} fill={alpha(STEEL.fill, 0.5)} />
      <path d={`M ${PLOT.x0} ${PLOT.y1} V ${PLOT.y0} H ${PLOT.x1}`} fill="none" stroke={STEEL.line} strokeWidth={3} strokeLinejoin="round" />
      <line x1={PLOT.x0} y1={PLOT.y1} x2={PLOT.x1} y2={PLOT.y1} stroke={STEEL.light} strokeWidth={5} />
      {YARD.map(([x, y, w, h]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={w} height={h} rx={5} fill={alpha(C.ink800, 0.9)} stroke={alpha(STEEL.line, 0.9)} strokeWidth={2.5} />
          {[1, 2, 3, 4].map((k) => (
            <line key={k} x1={x + (w * k) / 5} y1={y + 6} x2={x + (w * k) / 5} y2={y + h - 6} stroke={alpha(STEEL.line, 0.5)} strokeWidth={2} />
          ))}
          <line x1={x + 6} y1={y + h / 2} x2={x + w - 6} y2={y + h / 2} stroke={alpha(STEEL.line, 0.5)} strokeWidth={2} />
        </g>
      ))}
      <rect x={BUILDING.x} y={BUILDING.y} width={BUILDING.w} height={BUILDING.h} rx={6} fill={alpha(C.ink800, 0.9)} stroke={alpha(STEEL.line, 0.9)} strokeWidth={2.5} />
      <line x1={BUILDING.x + 10} y1={BUILDING.y + BUILDING.h / 2} x2={BUILDING.x + BUILDING.w - 10} y2={BUILDING.y + BUILDING.h / 2} stroke={alpha(STEEL.line, 0.5)} strokeWidth={2} />
      {CRANES.map((x) => (
        <g key={x} stroke={STEEL.light} strokeWidth={4} strokeLinecap="round" fill="none">
          <rect x={x - 24} y={PLOT.y1 - 34} width={48} height={24} rx={4} fill={STEEL.fill} />
          <line x1={x - 12} y1={PLOT.y1 - 10} x2={x - 12} y2={WATER.y0 + 44} />
          <line x1={x + 12} y1={PLOT.y1 - 10} x2={x + 12} y2={WATER.y0 + 44} />
        </g>
      ))}

      {/* the limit the signal crosses: the plot's street side */}
      <line x1={PLOT.x1} y1={PLOT.y0} x2={PLOT.x1} y2={PLOT.y1} stroke={STEEL.light} strokeWidth={6} strokeLinecap="round" />
      {sp > 0.01 ? (
        <line x1={PLOT.x1} y1={398} x2={PLOT.x1} y2={PLOT.y1 - 6} stroke={C.amber} strokeWidth={8} strokeLinecap="round" opacity={sp} style={{ filter: `drop-shadow(0 0 10px ${alpha(C.amber, 0.7)})` }} />
      ) : null}

      {/* access points: where the signal comes from */}
      {aps > 0.01
        ? [...INNER, ...ANTENNAS].map((ap) => (
            <g key={`${ap.x}-${ap.y}`} opacity={aps}>
              <circle cx={ap.x} cy={ap.y} r={13} fill={C.ink950} stroke={C.sky} strokeWidth={4} />
              <circle cx={ap.x} cy={ap.y} r={4.5} fill={C.sky} />
            </g>
          ))
        : null}
    </g>
  );
}

/**
 * The survey walk: a dotted trail drawn up to fraction `t`, with «tú» as a cyan marker at its
 * head (`marker` 0–1). No face, no name: a dot with a ring.
 */
export function SurveyWalk({ t, marker = 1, trail = 1 }: { t: number; marker?: number; trail?: number }) {
  const p = clamp01(t);
  if (p <= 0.001) return null;
  const head = walkPoint(p);
  const steps = Math.floor(p * 46);
  const dots = Array.from({ length: steps }, (_, i) => walkPoint(i / 46));
  return (
    <g>
      <g opacity={trail}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={4} fill={alpha(C.cyanSoft, 0.95)} stroke={alpha(C.ink950, 0.7)} strokeWidth={1.5} />
        ))}
      </g>
      {marker > 0.01 ? (
        <g opacity={marker} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.8)})` }}>
          <circle cx={head.x} cy={head.y} r={17} fill={alpha(C.cyan, 0.2)} stroke={C.cyan} strokeWidth={3} />
          <circle cx={head.x} cy={head.y} r={7} fill={C.cyanSoft} />
        </g>
      ) : null}
    </g>
  );
}

export const WALK_START = WALK[0];
