import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../../engine/src/ui';

/** Canon strings shown on screen (the voice never reads them). */
export const CANON = {
  c2: 'update-svc-cdn.com',
  blockIp: '185.220.x.x',
  vpsIp: '141.98.6.10',
  phish: 'meridian-sso-portal.com',
  cn: 'CN=updatesvc',
  sha1: 'SHA1 d4:7e:02…',
} as const;

/** The «llave hecha a mano» keeps one colour everywhere it appears. */
export const KEY_COLOR = C.emerald;

/**
 * Rounded pill in any colour (the engine Chip has no sky accent and pads
 * generously). `glow` (0–1) adds a halo for the pill the narration is on.
 */
export function Pill({
  children,
  color,
  icon,
  size = TYPE.label,
  solid = false,
  glow = 0,
  mono = false,
  style,
}: {
  children: ReactNode;
  color: string;
  icon?: IconName;
  size?: number;
  solid?: boolean;
  glow?: number;
  mono?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        padding: `${Math.round(size * 0.24)}px ${Math.round(size * 0.5)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(color, solid ? 0.95 : 0.55 + 0.4 * glow)}`,
        background: solid ? color : alpha(color, 0.1 + 0.08 * glow),
        boxShadow: glow > 0 ? `0 0 ${Math.round(26 * glow)}px ${alpha(color, 0.45 * glow)}` : undefined,
        color: solid ? C.ink950 : C.textStrong,
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.02)} color={solid ? C.ink950 : color} strokeWidth={2.2} /> : null}
      {children}
    </span>
  );
}

/** The self-signed key as a small tile: the same badge sits next to every server that presents it. */
export function KeyBadge({ size = 48, glow = 0, style }: { size?: number; glow?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.24),
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        background: alpha(KEY_COLOR, 0.12 + 0.12 * glow),
        border: `2px solid ${alpha(KEY_COLOR, 0.5 + 0.45 * glow)}`,
        boxShadow: glow > 0 ? `0 0 ${Math.round(28 * glow)}px ${alpha(KEY_COLOR, 0.5 * glow)}` : undefined,
        ...style,
      }}
    >
      <Icon name="key" size={Math.round(size * 0.66)} color={KEY_COLOR} strokeWidth={2.2} />
    </div>
  );
}

/** A redaction bar (drawn, not U+2588: the fonts are latin-only subsets). */
export function RedactBar({ width, height = 26, color = C.muted, glow = 0, style }: { width: number; height?: number; color?: string; glow?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width,
        height,
        borderRadius: 4,
        verticalAlign: 'middle',
        background: `repeating-linear-gradient(90deg, ${alpha(color, 0.8)} 0 ${Math.round(height * 0.9)}px, ${alpha(color, 0.62)} ${Math.round(height * 0.9)}px ${Math.round(height * 0.9) + 3}px)`,
        boxShadow: glow > 0 ? `0 0 ${Math.round(20 * glow)}px ${alpha(color, 0.5 * glow)}` : undefined,
        ...style,
      }}
    />
  );
}

/**
 * «Un bloque con 14.000 pisos» in miniature: a tall block of windows, grey
 * (routine) with a few cyan (data) and amber (warning) ones, as in s04.
 */
export function MiniBlock({ height = 40, glow = 0 }: { height?: number; glow?: number }) {
  const cols = 5;
  const rows = 8;
  const w = Math.round(height * 0.84);
  const top = 5;
  const cw = (w - 8) / cols;
  const ch = (height - top - 6) / rows;
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ display: 'block', flexShrink: 0 }}>
      <rect x={w * 0.3} y={0.5} width={w * 0.4} height={top} rx={1} fill={alpha(C.amber, 0.55 + 0.4 * glow)} />
      <rect x={1} y={top} width={w - 2} height={height - top - 1} rx={2} fill={alpha(C.ink800, 0.9)} stroke={alpha(C.amber, 0.55 + 0.4 * glow)} strokeWidth={2} />
      {Array.from({ length: cols * rows }, (_, i) => {
        const cx = i % cols;
        const cy = Math.floor(i / cols);
        const kind = (i * 7 + 3) % 11;
        const fill = kind === 0 ? C.amber : kind === 5 ? C.cyan : alpha(C.muted, 0.55);
        return <rect key={i} x={4 + cx * cw + 0.9} y={top + 3 + cy * ch + 0.9} width={cw - 1.8} height={ch - 1.8} rx={0.6} fill={fill} />;
      })}
    </svg>
  );
}

/** «Una casa donde solo vive él» in miniature: one small house with one lit window. */
export function MiniHouse({ size = 44, glow = 0 }: { size?: number; glow?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M3.5 11.5 12 4l8.5 7.5" fill="none" stroke={C.emerald} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.8 10v10h12.4V10" fill={alpha(C.emerald, 0.1 + 0.1 * glow)} stroke={C.emerald} strokeWidth={1.9} strokeLinejoin="round" />
      <rect x={10.2} y={13.2} width={3.6} height={3.6} rx={0.6} fill={C.emerald} opacity={0.6 + 0.4 * glow} />
    </svg>
  );
}

/** Small caps label used on cards («EL C2», «CERTIFICADO TLS»). */
export function Caps({ children, color = C.muted, size = TYPE.micro, style }: { children: ReactNode; color?: string; size?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: 2.2,
        textTransform: 'uppercase',
        color,
        whiteSpace: 'nowrap',
        lineHeight: 1.1,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
