import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The bell's own units; drawn at any `width` with this aspect ratio. */
export const BELL = { w: 540, h: 360 } as const;

/** Centres of the two lamps (bell units), for callers that label them. */
export const BELL_DOOR_LAMP = { x: 120, y: 48 } as const;
export const BELL_STATION_LAMP = { x: 420, y: 158 } as const;

/**
 * The hospital room bell («imagen · no es del puerto»): on the left a room door with the call lamp above it; on the
 * right the nurses' station, a counter under a board of room lamps. `door` (0–1) lights the lamp over the door —
 * «apuntado» (amber: it is waiting); `station` (0–1) makes the same room's lamp ring on the board — «sube» (rose, with
 * sound arcs pulsing ≤ 1 Hz), and a dashed corridor joins the two. No people, no names, no numbers.
 */
export function HospitalBell({ width, door, station, frame }: { width: number; door: number; station: number; frame: number }) {
  const d = clamp01(door);
  const s = clamp01(station);
  const wave = (frame / 30) % 1;
  return (
    <svg width={width} height={(width * BELL.h) / BELL.w} viewBox={`0 0 ${BELL.w} ${BELL.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={0} y={0} width={BELL.w} height={BELL.h} rx={18} fill={C.ink850} stroke={alpha(C.text, 0.12)} strokeWidth={2} />
      {/* floor */}
      <rect x={2} y={312} width={BELL.w - 4} height={46} fill={alpha(C.ink700, 0.6)} />
      <line x1={2} y1={312} x2={BELL.w - 2} y2={312} stroke={alpha(C.text, 0.2)} strokeWidth={2} />

      {/* the room door */}
      <rect x={60} y={84} width={120} height={228} rx={4} fill={C.ink800} stroke={alpha(C.text, 0.4)} strokeWidth={4} />
      <rect x={78} y={104} width={84} height={70} rx={3} fill={alpha(C.sky, 0.12)} stroke={alpha(C.text, 0.25)} strokeWidth={2} />
      <circle cx={162} cy={208} r={6} fill={alpha(C.text, 0.6)} />
      {/* the call lamp above the door */}
      <rect x={BELL_DOOR_LAMP.x - 30} y={BELL_DOOR_LAMP.y - 14} width={60} height={28} rx={8} fill={alpha(C.ink950, 0.9)} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
      {d > 0.01 ? (
        <>
          <ellipse cx={BELL_DOOR_LAMP.x} cy={BELL_DOOR_LAMP.y} rx={56} ry={34} fill={alpha(C.amber, 0.2 * d)} />
          <rect x={BELL_DOOR_LAMP.x - 24} y={BELL_DOOR_LAMP.y - 9} width={48} height={18} rx={6} fill={C.amber} opacity={0.3 + 0.7 * d} />
        </>
      ) : null}

      {/* the corridor from the room to the station */}
      {s > 0.01 ? (
        <path
          d={`M 186 290 C 260 290, 300 270, 330 250`}
          fill="none"
          stroke={alpha(C.rose, 0.6)}
          strokeWidth={4}
          strokeDasharray="10 10"
          strokeDashoffset={-frame * 1.2}
          opacity={s}
        />
      ) : null}

      {/* the nurses' station: the board of room lamps and the counter */}
      <rect x={322} y={72} width={196} height={120} rx={10} fill={C.ink800} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
      {Array.from({ length: 6 }, (_, k) => (
        <rect key={k} x={357 + (k % 3) * 63 - 18} y={106 + Math.floor(k / 3) * 52 - 11} width={36} height={22} rx={5} fill={alpha(C.ink950, 0.9)} stroke={alpha(C.text, 0.2)} strokeWidth={2} />
      ))}
      {s > 0.01 ? (
        <>
          <rect x={BELL_STATION_LAMP.x - 16} y={BELL_STATION_LAMP.y - 9} width={32} height={18} rx={4} fill={C.rose} opacity={0.35 + 0.65 * s} />
          {[0, 0.5].map((ph) => {
            const p = (wave + ph) % 1;
            return (
              <circle
                key={ph}
                cx={BELL_STATION_LAMP.x}
                cy={BELL_STATION_LAMP.y}
                r={22 + 40 * p}
                fill="none"
                stroke={C.rose}
                strokeWidth={3}
                opacity={s * (1 - p) * 0.8}
              />
            );
          })}
        </>
      ) : null}
      <rect x={300} y={232} width={226} height={30} rx={6} fill={C.ink700} stroke={alpha(C.text, 0.3)} strokeWidth={3} />
      <rect x={312} y={262} width={202} height={50} fill={alpha(C.ink800, 0.9)} stroke={alpha(C.text, 0.2)} strokeWidth={2} />
    </svg>
  );
}
