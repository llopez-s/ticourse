import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { Stage } from './kit';

// Stage-local geometry of the still background.
const FLOOR_Y = 616;
const DOOR = { x: 150, y: 70, w: 330, h: FLOOR_Y - 70 };
const READER = { x: 520, y: 300, w: 74, h: 116 };
const WALL_X = 700;
const CABINETS = [790, 1080, 1370] as const;
const CAB_W = 262;
const CAB_TOP = 318;
const DRAWERS = 5;

/**
 * s07-p3 «El archivo de planos». The engine's exam question panel covers the stage from s07-01 to the end of the
 * scene (question, options, countdown, answer and trap are all the engine's), so this scene is ONLY a still,
 * dim, textless background, complete from the first frame and never moving: on the left, the plans archive's door
 * with its card reader (a contactless pad with a green LED — never a keypad); past the wall, inside the room, three
 * plan chests with a keyhole on every drawer and a key in one of them. The recipe line of `recipe-back` is said by
 * the voice only (the panel still covers the stage then).
 */
export function S07P3(_props: SceneProps) {
  const line = alpha(C.text, 0.4);
  return (
    <Stage>
      <svg width={1728} height={660} viewBox="0 0 1728 660" style={{ position: 'absolute', left: 0, top: 0 }}>
        {/* the corridor wall and the room behind it */}
        <rect x={0} y={20} width={WALL_X} height={FLOOR_Y - 20} rx={18} fill={C.ink850} />
        <rect x={WALL_X} y={20} width={1728 - WALL_X} height={FLOOR_Y - 20} rx={18} fill={C.ink900} />
        <line x1={WALL_X} y1={20} x2={WALL_X} y2={FLOOR_Y} stroke={alpha(C.text, 0.18)} strokeWidth={6} />
        {/* floor */}
        <line x1={0} y1={FLOOR_Y} x2={1728} y2={FLOOR_Y} stroke={alpha(C.text, 0.3)} strokeWidth={4} />
        <rect x={0} y={FLOOR_Y} width={1728} height={660 - FLOOR_Y} fill={alpha(C.ink700, 0.35)} />

        {/* the door: frame, leaf, a plain pull handle, a narrow vision panel */}
        <rect x={DOOR.x - 16} y={DOOR.y - 16} width={DOOR.w + 32} height={DOOR.h + 16} rx={10} fill={C.ink800} stroke={line} strokeWidth={4} />
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx={6} fill={C.ink700} stroke={alpha(C.text, 0.32)} strokeWidth={3} />
        <rect x={DOOR.x + 40} y={DOOR.y + 50} width={64} height={190} rx={8} fill={alpha(C.cyanDeep, 0.25)} stroke={alpha(C.cyan, 0.3)} strokeWidth={3} />
        <rect x={DOOR.x + DOOR.w - 46} y={DOOR.y + DOOR.h * 0.44} width={14} height={110} rx={7} fill={alpha(C.text, 0.45)} />

        {/* the card reader beside the door: a contactless pad and a green LED (it works) */}
        <rect x={READER.x} y={READER.y} width={READER.w} height={READER.h} rx={14} fill={C.ink900} stroke={alpha(C.text, 0.5)} strokeWidth={4} />
        <g fill="none" stroke={alpha(C.cyan, 0.55)} strokeWidth={4} strokeLinecap="round">
          {[14, 24, 34].map((r) => (
            <path key={r} d={`M ${READER.x + READER.w / 2 - r * 0.7} ${READER.y + 64 - r * 0.7} A ${r} ${r} 0 0 1 ${READER.x + READER.w / 2 + r * 0.7} ${READER.y + 64 - r * 0.7}`} />
          ))}
        </g>
        <circle cx={READER.x + READER.w / 2} cy={READER.y + 92} r={7} fill={C.emerald} />
        <circle cx={READER.x + READER.w / 2} cy={READER.y + 92} r={14} fill={alpha(C.emerald, 0.18)} />

        {/* inside: three plan chests, wide shallow drawers, a keyhole on each, rolled plans on top */}
        {CABINETS.map((x, ci) => {
          const h = FLOOR_Y - CAB_TOP;
          const dh = (h - 40) / DRAWERS;
          return (
            <g key={x}>
              {/* rolled plans lying on top */}
              {[0, 1].map((r) => (
                <g key={r}>
                  <rect x={x + 28 + r * 22} y={CAB_TOP - 26 - r * 22} width={CAB_W - 70 - r * 40} height={22} rx={11} fill={alpha('#cbd5e1', 0.22 - r * 0.05)} stroke={alpha(C.text, 0.25)} strokeWidth={2} />
                  <circle cx={x + 28 + r * 22 + 11} cy={CAB_TOP - 15 - r * 22} r={7} fill="none" stroke={alpha(C.text, 0.3)} strokeWidth={2} />
                </g>
              ))}
              <rect x={x} y={CAB_TOP} width={CAB_W} height={h} rx={10} fill={C.ink800} stroke={line} strokeWidth={4} />
              {Array.from({ length: DRAWERS }, (_, d) => {
                const y = CAB_TOP + 16 + d * dh;
                const kx = x + CAB_W / 2;
                const ky = y + dh / 2 - 2;
                return (
                  <g key={d}>
                    <rect x={x + 14} y={y} width={CAB_W - 28} height={dh - 8} rx={5} fill={C.ink700} stroke={alpha(C.text, 0.22)} strokeWidth={2} />
                    {/* keyhole */}
                    <circle cx={kx} cy={ky - 2} r={5} fill={C.ink950} stroke={alpha(C.text, 0.35)} strokeWidth={1.5} />
                    <rect x={kx - 2.5} y={ky} width={5} height={9} fill={C.ink950} />
                    {/* a key left in the middle chest's top drawer */}
                    {ci === 1 && d === 0 ? (
                      <g>
                        {/* shank out of the keyhole, then the key's bow with its hole and a small ring */}
                        <rect x={kx - 4} y={ky - 4} width={8} height={14} rx={2} fill={alpha('#cbd5e1', 0.9)} />
                        <rect x={kx - 13} y={ky + 8} width={26} height={22} rx={9} fill={alpha('#cbd5e1', 0.9)} />
                        <circle cx={kx} cy={ky + 19} r={4.5} fill={C.ink800} />
                      </g>
                    ) : null}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </Stage>
  );
}
