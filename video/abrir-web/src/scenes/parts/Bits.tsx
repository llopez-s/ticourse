import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/** A rounded label used across half B (same look as s06's pills). `show` fades and lifts it in. */
export function Pill({
  children,
  tone = C.text,
  border = C.ink600,
  icon,
  show = 1,
  size = 32,
  mono = false,
  style,
}: {
  children: ReactNode;
  tone?: string;
  border?: string;
  icon?: IconName;
  show?: number;
  size?: number;
  mono?: boolean;
  style?: CSSProperties;
}) {
  const s = clamp01(show);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        height: Math.round(size * 1.38),
        padding: `0 ${Math.round(size * 0.62)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${border}`,
        background: alpha(C.ink950, 0.94),
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontSize: size,
        fontWeight: mono ? 600 : 750,
        color: tone,
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * 10}px)`,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 0.94)} color={tone} /> : null}
      {children}
    </span>
  );
}

/**
 * A verification mark DRAWN as a stroke (not a text glyph): draw 0-1 traces it. With ring it sits in a circle
 * that fills as it lands.
 */
export function DrawnTick({
  size = 48,
  draw = 1,
  color = C.emerald,
  ring = true,
  style,
}: {
  size?: number;
  draw?: number;
  color?: string;
  ring?: boolean;
  style?: CSSProperties;
}) {
  const d = clamp01(draw);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0, overflow: 'visible', ...style }} aria-hidden>
      {ring ? <circle cx={24} cy={24} r={21} fill={alpha(color, 0.14 * d)} stroke={alpha(color, 0.25 + 0.65 * d)} strokeWidth={3} /> : null}
      <path
        d="M 12 25 L 21 34 L 37 15"
        fill="none"
        stroke={color}
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - d}
        opacity={d > 0.001 ? 1 : 0}
      />
    </svg>
  );
}

/** The three-dots «y otras» mark, drawn as circles (no glyph). */
export function Dots({ color = C.muted, size = 9, show = 1 }: { color?: string; size?: number; show?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: size, alignItems: 'center', opacity: clamp01(show) }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: size, height: size, borderRadius: '50%', background: color }} />
      ))}
    </span>
  );
}
