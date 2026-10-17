import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { ToolGlyph, type ToolIcon } from './Tools';

/**
 * A step of the SOC's flow: a rounded box with the tool's icon, the step in plain words (≥ 32 px) and an optional
 * sub line (the tool it asks). `on` 0–1 lights it; `grey` 0–1 turns it to the «stopped» grey of s06.
 */
export function FlowNode({
  w,
  h,
  title,
  sub,
  icon,
  tone = C.cyan,
  on = 1,
  grey = 0,
  size = 32,
  children,
}: {
  w: number;
  h: number;
  title: ReactNode;
  sub?: ReactNode;
  icon?: ToolIcon;
  tone?: string;
  on?: number;
  grey?: number;
  size?: number;
  children?: ReactNode;
}) {
  const o = clamp01(on) * (1 - clamp01(grey));
  const g = clamp01(grey);
  const ink = g > 0.5 ? C.faint : tone;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 18px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(ink, 0.35 + 0.55 * o)}`,
        background: g > 0.01 ? alpha(C.ink800, 0.9) : alpha(tone, 0.05 + 0.08 * o),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(26 * o)}px ${alpha(tone, 0.22 * o)}` : undefined,
        fontFamily: FONT.sans,
      }}
    >
      {icon ? <ToolGlyph icon={icon} size={Math.round(size * 1.3)} color={ink} /> : null}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: size, fontWeight: 780, lineHeight: 1.12, color: g > 0.5 ? C.muted : C.textStrong }}>{title}</div>
        {sub ? <div style={{ marginTop: 4, fontSize: size, fontWeight: 650, lineHeight: 1.1, color: g > 0.5 ? C.faint : alpha(C.sky, 0.95) }}>{sub}</div> : null}
      </div>
      {children}
    </div>
  );
}

/** The flow's condition: a diamond with its question inside («¿riesgo alto?»). */
export function Diamond({ w, h, text, on = 1, tone = C.cyan, size = 32 }: { w: number; h: number; text: string; on?: number; tone?: string; size?: number }) {
  const o = clamp01(on);
  return (
    <div style={{ position: 'relative', width: w, height: h, fontFamily: FONT.sans }}>
      <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <polygon
          points={`${w / 2},2 ${w - 2},${h / 2} ${w / 2},${h - 2} 2,${h / 2}`}
          fill={alpha(tone, 0.05 + 0.1 * o)}
          stroke={alpha(tone, 0.35 + 0.6 * o)}
          strokeWidth={3}
          strokeLinejoin="round"
          style={{ filter: o > 0.02 ? `drop-shadow(0 0 ${Math.round(14 * o)}px ${alpha(tone, 0.35 * o)})` : undefined }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {text}
      </div>
    </div>
  );
}

/**
 * An arrow of the diagram (draw it inside an <svg> in the same coordinates): a polyline through `points`, revealed
 * by `draw` 0–1, with a head at the end once it is fully drawn. Never a text arrow.
 */
export function Arrow({
  points,
  draw = 1,
  color = C.cyan,
  width = 4,
  dashed = false,
  opacity = 1,
}: {
  points: [number, number][];
  draw?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}) {
  const p = clamp01(draw);
  if (p <= 0.001 || points.length < 2) return null;
  const segs = points.slice(1).map((pt, i) => Math.hypot(pt[0] - points[i][0], pt[1] - points[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const d = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ');
  const [x2, y2] = points[points.length - 1];
  const [x1, y1] = points[points.length - 2];
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const head = 9 + width * 2;
  const hx = (a: number) => x2 - head * Math.cos(ang + a);
  const hy = (a: number) => y2 - head * Math.sin(ang + a);
  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '10 10' : `${total} ${total}`}
        strokeDashoffset={dashed ? 0 : total * (1 - p)}
        opacity={dashed ? p : 1}
      />
      {p > 0.97 ? <polygon points={`${x2},${y2} ${hx(0.45)},${hy(0.45)} ${hx(-0.45)},${hy(-0.45)}`} fill={color} /> : null}
    </g>
  );
}
