import type { CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from '../../../../engine/src/ui/Icon';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../../../../engine/src/theme/tokens';

/** Device kinds the video draws: the engine icons plus our own printer. */
export type DeviceKind = IconName | 'printer';

/** Stroke printer (24x24 grid like the engine icons). */
function Printer({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }} aria-hidden>
      <path d="M7 8V3.5h10V8" />
      <rect x="3" y="8" width="18" height="8.5" rx="1.8" />
      <path d="M7 13.5h10v7H7z" />
      <path d="M17.5 11h.01" />
    </svg>
  );
}

export function DeviceIcon({ kind, size, color }: { kind: DeviceKind; size: number; color: string }) {
  return kind === 'printer' ? <Printer size={size} color={color} /> : <Icon name={kind} size={size} color={color} />;
}

/**
 * A device tile: rounded square with its icon, a name under it and an optional mono line (address).
 * `glow` 0-1 lights it (the voice is on it), `dim` 0-1 pushes it back.
 */
export function DeviceTile({
  kind,
  tile = 96,
  name,
  sub,
  tone = 'cyan',
  glow = 0,
  dim = 0,
  nameSize = 30,
  subSize = 26,
  style,
  children,
}: {
  kind: DeviceKind;
  tile?: number;
  name?: string;
  sub?: string;
  tone?: Accent;
  glow?: number;
  dim?: number;
  nameSize?: number;
  subSize?: number;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const a = ACCENT[tone];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 1 - 0.6 * dim, filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined, ...style }}>
      <div
        style={{
          position: 'relative',
          width: tile,
          height: tile,
          borderRadius: Math.round(tile * 0.22),
          display: 'grid',
          placeItems: 'center',
          background: alpha(a.fg, 0.1 + 0.1 * glow),
          border: `2px solid ${alpha(a.fg, 0.4 + 0.5 * glow)}`,
          boxShadow: glow > 0.01 ? `0 0 ${Math.round(36 * glow)}px ${alpha(a.fg, 0.4 * glow)}` : undefined,
        }}
      >
        <DeviceIcon kind={kind} size={Math.round(tile * 0.58)} color={a.fg} />
        {children}
      </div>
      {name ? <div style={{ fontFamily: FONT.sans, fontSize: nameSize, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.1 }}>{name}</div> : null}
      {sub ? <div style={{ fontFamily: FONT.mono, fontSize: subSize, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap', lineHeight: 1.1 }}>{sub}</div> : null}
    </div>
  );
}

/**
 * A packet: a small parcel (taped box). Strokes keep their width at any size, so the same drawing
 * serves as a 60 px dot on a route and as the 800 px body behind the label in s06.
 * `mark` draws a centred glyph (the «?» of «¿qué lleva?»).
 */
export function Parcel({
  width = 96,
  height: heightProp,
  tone = 'cyan',
  glow = 0,
  opacity = 1,
  mark,
  markSize,
  style,
}: {
  width?: number;
  /** Default 0.76 x width; pass it for a wide, flat body (s06). */
  height?: number;
  tone?: Accent;
  glow?: number;
  opacity?: number;
  mark?: string;
  markSize?: number;
  style?: CSSProperties;
}) {
  const a = ACCENT[tone];
  const height = heightProp ?? Math.round(width * 0.76);
  return (
    <div style={{ position: 'relative', width, height, opacity, ...style }}>
      <svg width={width} height={height} viewBox="0 0 120 91" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible', filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(14 * glow)}px ${alpha(a.fg, 0.7 * glow)})` : undefined }}>
        <rect x="2" y="2" width="116" height="87" rx={Math.min(14, width * 0.075) * 120 / width} ry={Math.min(14, width * 0.075) * 91 / height} fill={alpha(a.fg, 0.1)} stroke={a.fg} strokeWidth={3} vectorEffect="non-scaling-stroke" />
        <path d="M2 28h116" stroke={alpha(a.fg, 0.55)} strokeWidth={2} fill="none" vectorEffect="non-scaling-stroke" />
        <rect x="50" y="2" width="20" height="26" fill={alpha(a.fg, 0.35)} stroke="none" />
      </svg>
      {mark ? (
        <div style={{ position: 'absolute', left: 0, top: height * 0.3, width, height: height * 0.7, display: 'grid', placeItems: 'center', fontFamily: FONT.sans, fontSize: markSize ?? TYPE.h1, fontWeight: 850, color: a.soft }}>
          {mark}
        </div>
      ) : null}
    </div>
  );
}

/** Rounded chip with a caption used under pictures and next to values (color never travels alone). */
export function Caption({ children, tone = 'muted', size = TYPE.small, style }: { children: ReactNode; tone?: Accent; size?: number; style?: CSSProperties }) {
  const a = ACCENT[tone];
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        lineHeight: 1.15,
        color: tone === 'muted' ? C.muted : a.soft,
        whiteSpace: 'nowrap',
        borderRadius: RADIUS.sm,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
