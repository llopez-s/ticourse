import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Flame } from './Glyphs';

/**
 * The fire triangle: a flame in the middle of three sides — calor, combustible, oxígeno. Neutral amber on purpose: the
 * lesson does not map each side to intent/capability/opportunity.
 *
 * <FireTriangle sides={[calor, combustible, oxigeno]} out flame /> — a `FIRE_W`×`FIRE_H` box. `sides` 0..1 draw each
 * side; `out` 0..1 takes the LAST side away (it goes dashed and grey, its label struck); `flame` 0..1 how alive the flame is.
 */
export const FIRE_W = 700;
export const FIRE_H = 450;
const T = { x: 350, y: 20 };
const L = { x: 190, y: 370 };
const R = { x: 510, y: 370 };

export function FireTriangle({ sides, out = 0, flame = 1 }: { sides: readonly [number, number, number]; out?: number; flame?: number }) {
  const len = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(b.x - a.x, b.y - a.y);
  const seg = (a: { x: number; y: number }, b: { x: number; y: number }, p: number, gone: number, key: string) => {
    const l = len(a, b);
    return (
      <line
        key={key}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={gone > 0.01 ? alpha(C.faint, 0.6) : C.amber}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={gone > 0.01 ? '4 22' : l}
        strokeDashoffset={gone > 0.01 ? 0 : l * (1 - p)}
        opacity={p > 0.01 ? 1 : 0}
      />
    );
  };
  const label = (text: string, p: number, style: React.CSSProperties, gone = 0) => (
    <div style={{ position: 'absolute', fontSize: 40, fontWeight: 850, letterSpacing: 1, whiteSpace: 'nowrap', color: gone > 0.01 ? C.faint : '#fcd34d', opacity: p * (1 - 0.4 * gone), textDecoration: gone > 0.5 ? 'line-through' : undefined, textDecorationColor: C.rose, textDecorationThickness: 5, ...style }}>
      {text}
    </div>
  );
  return (
    <div style={{ position: 'relative', width: FIRE_W, height: FIRE_H, fontFamily: FONT.sans }}>
      <svg width={FIRE_W} height={FIRE_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {seg(L, T, sides[0], 0, 'calor')}
        {seg(T, R, sides[1], 0, 'combustible')}
        {seg(L, R, sides[2], out, 'oxigeno')}
      </svg>
      <div style={{ position: 'absolute', left: T.x - 70, top: 160 }}>
        <Flame size={140} out={1 - flame} />
      </div>
      {label('calor', sides[0], { right: FIRE_W - 232, top: 150, textAlign: 'right' })}
      {label('combustible', sides[1], { left: 472, top: 150 })}
      {label('oxígeno', sides[2], { left: T.x - 82, top: 392 }, out)}
    </div>
  );
}
