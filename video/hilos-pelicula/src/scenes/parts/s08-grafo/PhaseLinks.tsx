import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import type { Rect } from './Projection';

/** One pair of matching frames: Meridian's (above) and Orbital's (below). */
export interface LinkPair {
  top: Rect;
  bottom: Rect;
  /** 0–1: the link draws from top to bottom. */
  draw: number;
}

/**
 * s08 `match-phases`: «de la entrega a la llamada a casa, las fases coinciden». Each pair of frames that lines up gets
 * a short rose link, drawn from Meridian's frame down to Orbital's, with a ring at each end (the two photos are of
 * the same phase). Rose: it is the attacker's activity that repeats. Draws its own <svg> of `width` × `height`.
 */
export function PhaseLinks({ pairs, width, height, glow = 0 }: { pairs: readonly LinkPair[]; width: number; height: number; glow?: number }) {
  const g = clamp01(glow);
  if (pairs.every((p) => p.draw <= 0)) return null;
  return (
    <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      {pairs.map((p, i) => {
        const d = clamp01(p.draw);
        if (d <= 0) return null;
        const x = p.top.x + p.top.w / 2;
        const y0 = p.top.y + p.top.h - 6;
        const y1 = p.bottom.y + 6;
        const y = y0 + (y1 - y0) * d;
        return (
          <g key={i} style={{ filter: `drop-shadow(0 0 ${Math.round(6 + 8 * g)}px ${alpha(C.rose, 0.55 + 0.25 * g)})` }}>
            <line x1={x} y1={y0} x2={x} y2={y} stroke={C.rose} strokeWidth={6} strokeLinecap="round" />
            <circle cx={x} cy={y0} r={9} fill={C.ink900} stroke={C.roseSoft} strokeWidth={4} />
            {d > 0.95 ? <circle cx={x} cy={y1} r={9} fill={C.ink900} stroke={C.roseSoft} strokeWidth={4} /> : null}
          </g>
        );
      })}
    </svg>
  );
}
