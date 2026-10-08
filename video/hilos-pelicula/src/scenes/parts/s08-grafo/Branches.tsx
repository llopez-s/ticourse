import { useId } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, cubicPath, cubicPoint, type Point } from '../../../../../engine/src/ui';

type Curve = [Point, Point, Point, Point];

/** One possible path out of the gap. */
export interface Branch {
  /** Where the dashed path ends (the label's anchor). */
  to: Point;
  label: string;
  /** 0–1: how much of the path is drawn. */
  draw: number;
  /** 0–1: the label (default: it follows the tip, from 80 % of the path). */
  labelShow?: number;
  /** Which side of `to` the label sits on. */
  side?: 'right' | 'left' | 'below';
}

function curveOf(from: Point, to: Point): Curve {
  // Leave the gap sideways (along x), then bend toward the end point.
  const dx = (to.x - from.x) * 0.55;
  return [from, { x: from.x + dx, y: from.y }, { x: to.x - dx * 0.6, y: to.y }, to];
}

/**
 * «Desde ese hueco salen otros caminos posibles»: dashed rose paths that grow out of one origin (the gap), each with
 * an open end ring and its label. Dashed = possible, never observed (the observed thread is solid). Coordinates are
 * those of the positioned parent; it draws its own <svg> of `width` × `height`.
 */
export function Branches({
  from,
  branches,
  width,
  height,
  size = 34,
  glow = 0,
}: {
  from: Point;
  branches: readonly Branch[];
  width: number;
  height: number;
  size?: number;
  glow?: number;
}) {
  const id = useId().replace(/:/g, '');
  const g = clamp01(glow);
  if (branches.every((b) => b.draw <= 0)) return null;
  return (
    <>
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <defs>
          {branches.map((b, i) => (
            <mask key={i} id={`br-${id}-${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
              <path d={cubicPath(curveOf(from, b.to))} fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${clamp01(b.draw)} 1`} />
            </mask>
          ))}
        </defs>
        {branches.map((b, i) => {
          const d = clamp01(b.draw);
          if (d <= 0) return null;
          const c = curveOf(from, b.to);
          const tip = cubicPoint(c, d);
          return (
            <g key={i}>
              <path
                d={cubicPath(c)}
                fill="none"
                stroke={alpha(C.rose, 0.85)}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray="12 12"
                mask={`url(#br-${id}-${i})`}
                style={g > 0.02 ? { filter: `drop-shadow(0 0 ${Math.round(8 * g)}px ${alpha(C.rose, 0.6 * g)})` } : undefined}
              />
              {/* An open ring at the tip: where it could go, not where it went. */}
              <circle cx={tip.x} cy={tip.y} r={10} fill={C.ink900} stroke={alpha(C.roseSoft, 0.9)} strokeWidth={3} strokeDasharray="5 4" opacity={d > 0.85 ? (d - 0.85) / 0.15 : 0} />
            </g>
          );
        })}
      </svg>
      {branches.map((b, i) => {
        const d = clamp01(b.draw);
        const o = Math.min(d > 0.8 ? (d - 0.8) / 0.2 : 0, b.labelShow === undefined ? 1 : clamp01(b.labelShow));
        if (o <= 0) return null;
        const side = b.side ?? 'right';
        const pos =
          side === 'right'
            ? { left: b.to.x + 22, top: b.to.y, transform: 'translateY(-50%)' }
            : side === 'left'
              ? { left: b.to.x - 22, top: b.to.y, transform: 'translate(-100%, -50%)' }
              : { left: b.to.x, top: b.to.y + 20, transform: 'translateX(-50%)' };
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              padding: '6px 18px',
              borderRadius: RADIUS.pill,
              border: `2px dashed ${alpha(C.roseSoft, 0.7)}`,
              background: alpha(C.ink900, 0.9),
              fontFamily: FONT.sans,
              fontSize: size,
              fontWeight: 750,
              color: C.roseSoft,
              whiteSpace: 'nowrap',
              opacity: o,
            }}
          >
            {b.label}
          </div>
        );
      })}
    </>
  );
}
