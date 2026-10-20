import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * Concept 3's everyday image: a plane in flight. Its software is not updated in the air but in the hangar (small, at
 * the back, on the left); while it flies, its cockpit door is shut and the tower follows it by radar — arcs that
 * reach towards it and never touch it. No airline, no registration, no people.
 */
export const PLANE_W = 900;
export const PLANE_H = 210;

const HANGAR = { x: 10, y: 92, w: 190, h: 100 } as const;
const TOWER = { x: 800, y: 30 } as const;
const PLANE_X = 300;
const PLANE_Y = 38;

/** Side view of an airliner, nose to the right, in its own 330×110 units. */
function Airliner({ tone }: { tone: string }) {
  return (
    <g>
      {/* tail fin */}
      <path d="M 20 52 L 4 6 L 30 6 L 64 50 Z" fill={C.ink800} stroke={tone} strokeWidth={3.5} strokeLinejoin="round" />
      {/* fuselage */}
      <path d="M 16 50 C 30 44 240 40 290 44 C 314 46 330 56 330 64 C 330 72 312 80 286 80 L 40 80 C 24 80 14 64 16 50 Z" fill={C.ink800} stroke={tone} strokeWidth={3.5} strokeLinejoin="round" />
      {/* wing */}
      <path d="M 140 66 L 210 66 L 150 106 L 118 106 Z" fill={C.ink850} stroke={tone} strokeWidth={3.5} strokeLinejoin="round" />
      {/* cabin windows */}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={70 + i * 16} y={54} width={8} height={8} rx={2} fill={alpha(C.text, 0.5)} />
      ))}
      {/* cockpit window and its door, shut (a bar across the door) */}
      <path d="M 300 52 L 318 56 L 312 62 L 296 60 Z" fill={alpha(C.cyan, 0.45)} />
      <rect x={270} y={50} width={14} height={26} rx={2} fill={C.ink900} stroke={alpha(C.text, 0.7)} strokeWidth={2.5} />
      <line x1={267} y1={63} x2={287} y2={63} stroke={C.emerald} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

export function Plane({
  width = PLANE_W,
  planeIn = 1,
  hangarIn = 1,
  towerIn = 1,
  radar = 1,
  frame = 0,
}: {
  width?: number;
  planeIn?: number;
  hangarIn?: number;
  towerIn?: number;
  /** 0–1: radar arcs drawn. */
  radar?: number;
  /** Drives the slow radar sweep and the plane's float (deterministic). */
  frame?: number;
}) {
  const p = clamp01(planeIn);
  const r = clamp01(radar);
  const bob = Math.sin(frame / 22) * 3;
  const sweep = (frame % 60) / 60;
  return (
    <svg width={width} height={(width * PLANE_H) / PLANE_W} viewBox={`0 0 ${PLANE_W} ${PLANE_H}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* ground line */}
      <line x1={0} y1={194} x2={PLANE_W} y2={194} stroke={alpha(C.muted, 0.35)} strokeWidth={3} />

      {/* the hangar, small and dim at the back */}
      <g opacity={0.55 * clamp01(hangarIn)}>
        <path d={`M ${HANGAR.x} ${HANGAR.y + HANGAR.h} V ${HANGAR.y + 34} Q ${HANGAR.x + HANGAR.w / 2} ${HANGAR.y - 18} ${HANGAR.x + HANGAR.w} ${HANGAR.y + 34} V ${HANGAR.y + HANGAR.h} Z`} fill={C.ink850} stroke={alpha(C.text, 0.6)} strokeWidth={3} />
        <rect x={HANGAR.x + 40} y={HANGAR.y + 44} width={HANGAR.w - 80} height={HANGAR.h - 44} fill={C.ink950} stroke={alpha(C.text, 0.4)} strokeWidth={2} />
      </g>

      {/* the tower and its radar */}
      <g opacity={clamp01(towerIn)}>
        <rect x={TOWER.x + 18} y={TOWER.y + 60} width={28} height={194 - TOWER.y - 60} fill={C.ink800} stroke={alpha(C.text, 0.6)} strokeWidth={3} />
        <path d={`M ${TOWER.x} ${TOWER.y + 60} L ${TOWER.x + 8} ${TOWER.y + 30} H ${TOWER.x + 56} L ${TOWER.x + 64} ${TOWER.y + 60} Z`} fill={C.ink850} stroke={alpha(C.text, 0.7)} strokeWidth={3} />
        <rect x={TOWER.x + 14} y={TOWER.y + 36} width={36} height={14} rx={2} fill={alpha(C.cyan, 0.4)} />
        <line x1={TOWER.x + 32} y1={TOWER.y + 30} x2={TOWER.x + 32} y2={TOWER.y + 12} stroke={alpha(C.text, 0.7)} strokeWidth={3} />
        <path d={`M ${TOWER.x + 18} ${TOWER.y + 6} Q ${TOWER.x + 32} ${TOWER.y + 22} ${TOWER.x + 46} ${TOWER.y + 6}`} fill="none" stroke={C.sky} strokeWidth={4} strokeLinecap="round" />
      </g>
      {r > 0.01
        ? [0, 1, 2, 3].map((i) => {
            const rad = 56 + i * 30 + sweep * 30;
            const o = r * (1 - (i + sweep) / 4.2);
            return (
              <path
                key={i}
                d={`M ${TOWER.x + 32 - rad * 0.94} ${TOWER.y + 12 - rad * 0.34} A ${rad} ${rad} 0 0 0 ${TOWER.x + 32 - rad * 0.94} ${TOWER.y + 12 + rad * 0.34}`}
                fill="none"
                stroke={C.sky}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray="6 8"
                opacity={Math.max(0, o)}
              />
            );
          })
        : null}

      {/* the plane in flight */}
      <g opacity={p} transform={`translate(${PLANE_X + (1 - p) * -40} ${PLANE_Y + bob})`}>
        <Airliner tone={C.cyan} />
      </g>
    </svg>
  );
}
