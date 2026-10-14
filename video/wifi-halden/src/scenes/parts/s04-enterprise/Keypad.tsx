import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { KEYPAD_CAPTION } from '../../../data/s04-enterprise';
import { STEEL } from '../Glyphs';
import { KEYPAD } from './layout';

/**
 * «El código de la escalera»: a landing, the stairs going up, and on the wall a door-entry keypad
 * whose code the whole building knows. The keys are blank (a dot each): no code is readable, and
 * the panel has neither a slot nor a reader — it only takes a code. No door is drawn: a wifi key is
 * a code, never a door.
 *
 * Drawn in its own KEYPAD.w × KEYPAD.h box; the scene places and scales it (`at`, top-left corner).
 */
const PANEL = { x: 330, y: 56, w: 140, h: 236 } as const;
const KEY = { size: 30, gap: 10, x: 345, y: 122 } as const;
const FLOOR_Y = 384;
/** The flight of stairs, going up to the left from the landing. */
const STEPS = 'M 250 384 V 350 H 206 V 316 H 162 V 282 H 118 V 248 H 74 V 214 H 30 V 180 H 0 V 384 Z';

export function StairKeypad({
  at,
  show = 1,
  lit = 0,
  change = 0,
  caption = 1,
  dim = 0,
}: {
  at: { x: number; y: number; scale: number };
  show?: number;
  /** 0–1: everybody knows the code (the keys glow amber). */
  lit?: number;
  /** 0–1: the code has to be changed (the panel is ringed). */
  change?: number;
  /** 0–1: «el código de la escalera» under the panel. */
  caption?: number;
  dim?: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const l = clamp01(lit);
  const ch = clamp01(change);
  const cap = clamp01(caption);
  const keys = [0, 1, 2, 3].flatMap((row) => [0, 1, 2].map((col) => ({ row, col })));
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x,
        top: at.y,
        width: KEYPAD.w,
        height: KEYPAD.h,
        opacity: s * (1 - 0.55 * clamp01(dim)),
        transform: `scale(${at.scale})`,
        transformOrigin: '0 0',
      }}
    >
      <svg width={KEYPAD.w} height={KEYPAD.h} viewBox={`0 0 ${KEYPAD.w} ${KEYPAD.h}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* the landing: wall, floor, the flight of stairs and its handrail */}
        <rect x={0} y={0} width={KEYPAD.w} height={FLOOR_Y} rx={18} fill={alpha(STEEL.fill, 0.45)} stroke={alpha(STEEL.line, 0.5)} strokeWidth={3} />
        <path d={STEPS} fill={alpha(STEEL.dark, 0.9)} stroke={STEEL.line} strokeWidth={4} strokeLinejoin="round" />
        <line x1={258} y1={306} x2={22} y2={124} stroke={STEEL.light} strokeWidth={7} strokeLinecap="round" />
        {[
          [228, 350, 283],
          [140, 282, 215],
          [52, 214, 147],
        ].map(([x, y1, y2]) => (
          <line key={x} x1={x} y1={y1} x2={x} y2={y2} stroke={STEEL.line} strokeWidth={5} strokeLinecap="round" />
        ))}
        <line x1={0} y1={FLOOR_Y} x2={KEYPAD.w} y2={FLOOR_Y} stroke={STEEL.light} strokeWidth={5} strokeLinecap="round" />
        {/* the keypad on the wall */}
        {ch > 0.01 ? <rect x={PANEL.x - 12} y={PANEL.y - 12} width={PANEL.w + 24} height={PANEL.h + 24} rx={24} fill="none" stroke={alpha(C.amber, 0.85 * ch)} strokeWidth={5} strokeDasharray="14 12" /> : null}
        <rect
          x={PANEL.x}
          y={PANEL.y}
          width={PANEL.w}
          height={PANEL.h}
          rx={16}
          fill={STEEL.fill}
          stroke={l > 0.3 ? C.amber : STEEL.light}
          strokeWidth={5}
          style={l > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(8 + 16 * l)}px ${alpha(C.amber, 0.55 * l)})` } : undefined}
        />
        {[0, 1, 2].map((i) => (
          <line key={i} x1={PANEL.x + 42} y1={PANEL.y + 22 + i * 10} x2={PANEL.x + PANEL.w - 42} y2={PANEL.y + 22 + i * 10} stroke={STEEL.line} strokeWidth={4} strokeLinecap="round" />
        ))}
        <circle cx={PANEL.x + PANEL.w - 22} cy={PANEL.y + 32} r={6} fill={l > 0.3 ? C.amber : STEEL.line} />
        {keys.map(({ row, col }) => {
          const x = KEY.x + col * (KEY.size + KEY.gap);
          const y = KEY.y + row * (KEY.size + KEY.gap);
          return (
            <g key={`${row}-${col}`}>
              <rect x={x} y={y} width={KEY.size} height={KEY.size} rx={7} fill={alpha(C.amber, 0.06 + 0.2 * l)} stroke={alpha(l > 0.3 ? C.amber : STEEL.light, 0.75)} strokeWidth={3} />
              <circle cx={x + KEY.size / 2} cy={y + KEY.size / 2} r={3.5} fill={l > 0.3 ? C.amber : STEEL.light} />
            </g>
          );
        })}
      </svg>
      {cap > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 286,
            top: PANEL.y + PANEL.h + 18,
            fontFamily: FONT.sans,
            fontSize: 40,
            fontWeight: 820,
            letterSpacing: -0.3,
            lineHeight: 1.1,
            color: '#fde68a',
            whiteSpace: 'nowrap',
            opacity: cap,
            transform: `translateY(${(1 - cap) * 8}px)`,
          }}
        >
          {KEYPAD_CAPTION}
        </div>
      ) : null}
    </div>
  );
}
