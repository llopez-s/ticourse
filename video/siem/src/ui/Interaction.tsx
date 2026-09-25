import type { CSSProperties, ReactNode } from 'react';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../theme/tokens';
import { EASE, lerp, progress } from '../theme/motion';
import { Icon } from './Icon';
import type { Point } from './geometry';

/**
 * Mouse pointer that glides between waypoints and shows a click ripple.
 * Each waypoint is reached at its `at` frame; `click: true` ripples there.
 * Coordinates are relative to the positioned parent.
 */
export function Cursor({
  frame,
  path,
  appearAt,
}: {
  frame: number;
  path: (Point & { at: number; click?: boolean })[];
  appearAt?: number;
}) {
  if (path.length === 0) return null;
  const start = appearAt ?? path[0].at - 10;
  if (frame < start) return null;
  let pos: Point = path[0];
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const next = path[i];
    if (frame >= next.at) {
      pos = next;
      continue;
    }
    if (frame > prev.at) {
      const moveStart = Math.max(prev.at, next.at - 24);
      const t = progress(frame, moveStart, next.at - moveStart, EASE.inOut);
      pos = { x: prev.x + (next.x - prev.x) * t, y: prev.y + (next.y - prev.y) * t };
    }
    break;
  }
  const lastClick = [...path].reverse().find((p) => p.click && frame >= p.at);
  const ripple = lastClick ? progress(frame, lastClick.at, 14) : 1;
  return (
    <div style={{ position: 'absolute', left: pos.x, top: pos.y, pointerEvents: 'none', opacity: lerp(frame, [start, start + 8], [0, 1]) }}>
      {lastClick && ripple < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: -30 * ripple - 6,
            top: -30 * ripple - 6,
            width: 12 + 60 * ripple,
            height: 12 + 60 * ripple,
            borderRadius: '50%',
            border: `3px solid ${alpha(C.cyanSoft, 1 - ripple)}`,
          }}
        />
      ) : null}
      <Icon name="cursor" size={44} color={C.textStrong} strokeWidth={1.2} style={{ filter: `drop-shadow(0 4px 8px ${alpha('#000000', 0.6)})` }} />
    </div>
  );
}

/**
 * Rubber-stamp label that lands with a quick scale-down. `at` is the landing frame.
 */
export function Stamp({
  frame,
  at,
  children,
  accent = 'amber',
  rotate = -6,
  size = TYPE.h3,
  style,
}: {
  frame: number;
  at: number;
  children: ReactNode;
  accent?: Accent;
  rotate?: number;
  size?: number;
  style?: CSSProperties;
}) {
  if (frame < at) return null;
  const p = progress(frame, at, 10, EASE.out);
  const a = ACCENT[accent];
  return (
    <div
      style={{
        display: 'inline-block',
        transform: `rotate(${rotate}deg) scale(${1.6 - 0.6 * p})`,
        opacity: p,
        border: `5px solid ${a.fg}`,
        color: a.fg,
        borderRadius: RADIUS.md,
        padding: '10px 26px',
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 850,
        letterSpacing: 2,
        textTransform: 'uppercase',
        background: alpha(C.ink950, 0.75),
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** On/off switch with a label. `on` may be fractional (0–1) to animate the knob. */
export function Toggle({ on, label, accent = 'emerald', style }: { on: number; label?: string; accent?: Accent; style?: CSSProperties }) {
  const a = ACCENT[accent];
  const knob = Math.max(0, Math.min(1, on));
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, ...style }}>
      <div
        style={{
          position: 'relative',
          width: 84,
          height: 46,
          borderRadius: RADIUS.pill,
          background: knob > 0.5 ? alpha(a.fg, 0.85) : C.ink700,
          border: `2px solid ${knob > 0.5 ? a.fg : C.ink600}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4 + knob * 38,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: C.textStrong,
          }}
        />
      </div>
      {label ? (
        <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color: C.text }}>{label}</span>
      ) : null}
    </div>
  );
}

/**
 * Vertical checklist; item i is ticked from `items[i].at` on. Unticked items
 * show an empty box, ticked ones a filled accent box with an SVG check.
 */
export function Checklist({
  frame,
  items,
  accent = 'emerald',
  size = TYPE.label,
  style,
}: {
  frame: number;
  items: { label: string; at: number }[];
  accent?: Accent;
  size?: number;
  style?: CSSProperties;
}) {
  const a = ACCENT[accent];
  return (
    <div style={{ display: 'grid', gap: Math.round(size * 0.55), ...style }}>
      {items.map((item) => {
        const p = progress(frame, item.at, 10);
        return (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: size * 1.15,
                height: size * 1.15,
                borderRadius: 10,
                display: 'grid',
                placeItems: 'center',
                border: `3px solid ${p > 0 ? a.fg : C.ink600}`,
                background: alpha(a.fg, 0.9 * p),
                flexShrink: 0,
              }}
            >
              {p > 0 ? <Icon name="check" size={size * 0.9} color={C.ink950} strokeWidth={3} style={{ opacity: p }} /> : null}
            </div>
            <span
              style={{
                fontFamily: FONT.sans,
                fontSize: size,
                fontWeight: 600,
                color: p > 0 ? C.textStrong : C.muted,
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
