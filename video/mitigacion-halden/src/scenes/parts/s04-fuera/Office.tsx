import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { INTERNET, OFFICE, PERIMETER } from '../../../data/s04-fuera';
import { Arrow } from '../Arrow';

/** Stage-local geometry of s04's office (shared with the scene for the laptop's path). */
export const OFF = { x: 0, y: 80, w: 500, h: 260 } as const;
export const WALL = { x: 512, y: 80, w: 46, h: 260 } as const;
export const CLOUD = { cx: 690, cy: 190 } as const;
export const DOOR = { x: 170, w: 90 } as const;

/** A desk with a monitor, inside the office (x, y of the desk top's left end). */
function Desk({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={150} height={12} rx={4} fill={C.ink700} />
      <rect x={x + 10} y={y + 12} width={10} height={50} fill={C.ink800} />
      <rect x={x + 130} y={y + 12} width={10} height={50} fill={C.ink800} />
      <rect x={x + 40} y={y - 64} width={80} height={54} rx={6} fill={C.ink900} stroke={alpha(C.cyan, 0.6)} strokeWidth={3} />
      <rect x={x + 74} y={y - 10} width={12} height={10} fill={C.ink700} />
    </g>
  );
}

/**
 * s04's office in schematic, no names: a room with two desks and a door in its bottom wall; on its right side the
 * perimeter firewall (a sky brick wall, «el cortafuegos del perímetro») between the office and «Internet» (a cloud).
 * `show` 0–1 brings the room in; `wall` 0–1 lights the firewall, its label and the filtered arrow from the cloud.
 */
export function Office({ show, wall }: { show: number; wall: number }) {
  const s = clamp01(show);
  const w = clamp01(wall);
  const bricks: [number, number][] = [];
  for (let r = 0; r < 10; r++) for (let c = 0; c < 2; c++) bricks.push([WALL.x + (r % 2 ? -12 : 0) + c * 24, WALL.y + r * 26]);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 800, height: 420 }}>
      <svg width={800} height={420} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g opacity={s}>
          {/* room: walls with a gap for the door */}
          <rect x={OFF.x} y={OFF.y} width={OFF.w} height={OFF.h} rx={16} fill={alpha(C.cyan, 0.05)} />
          <path
            d={`M ${DOOR.x} ${OFF.y + OFF.h} L ${OFF.x + 16} ${OFF.y + OFF.h} Q ${OFF.x} ${OFF.y + OFF.h} ${OFF.x} ${OFF.y + OFF.h - 16} L ${OFF.x} ${OFF.y + 16} Q ${OFF.x} ${OFF.y} ${OFF.x + 16} ${OFF.y} L ${OFF.x + OFF.w - 16} ${OFF.y} Q ${OFF.x + OFF.w} ${OFF.y} ${OFF.x + OFF.w} ${OFF.y + 16} L ${OFF.x + OFF.w} ${OFF.y + OFF.h - 16} Q ${OFF.x + OFF.w} ${OFF.y + OFF.h} ${OFF.x + OFF.w - 16} ${OFF.y + OFF.h} L ${DOOR.x + DOOR.w} ${OFF.y + OFF.h}`}
            fill="none"
            stroke={alpha(C.cyan, 0.75)}
            strokeWidth={5}
          />
          <Desk x={40} y={262} />
          <Desk x={220} y={262} />
        </g>
        <g opacity={0.25 + 0.75 * w}>
          {bricks.map(([x, y], k) => (
            <rect key={k} x={Math.max(WALL.x, x)} y={y} width={x < WALL.x ? 12 : Math.min(22, WALL.x + WALL.w - x)} height={22} rx={3} fill={alpha(C.sky, 0.35)} stroke={C.sky} strokeWidth={2} />
          ))}
          {/* the cloud */}
          <path
            d={`M ${CLOUD.cx - 70} ${CLOUD.cy + 30} h 140 a 34 34 0 0 0 0 -60 a 46 46 0 0 0 -84 -18 a 34 34 0 0 0 -56 78 Z`}
            fill={alpha(C.sky, 0.12)}
            stroke={C.sky}
            strokeWidth={4}
          />
          <Arrow points={[[CLOUD.cx - 76, CLOUD.cy], [WALL.x + WALL.w + 10, CLOUD.cy]]} draw={w} color={C.sky} width={4} />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: OFF.x + 20, top: OFF.y + 14, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.cyanSoft, opacity: s }}>{OFFICE}</div>
      <div style={{ position: 'absolute', left: CLOUD.cx - 70, top: CLOUD.cy + 40, width: 140, textAlign: 'center', fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.sky, opacity: 0.25 + 0.75 * w }}>{INTERNET}</div>
      <div style={{ position: 'absolute', left: 250, top: OFF.y + OFF.h + 14, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', opacity: w, transform: `translateY(${(1 - w) * 10}px)` }}>
        <Icon name="firewall" size={34} color={C.sky} />
        {PERIMETER}
      </div>
    </div>
  );
}
