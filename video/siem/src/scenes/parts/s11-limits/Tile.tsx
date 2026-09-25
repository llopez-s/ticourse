import type { ReactNode } from 'react';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../../../theme/tokens';
import { Icon, type IconName } from '../../../ui';

/**
 * One blind-spot tile. Before its cue it is only a dashed placeholder (so the
 * chapter wipe reveals the whole grid); `reveal` (0–1) cross-fades it into a
 * solid console card, `focus` (0–1) lights it up while the voice is on it and
 * dims it otherwise.
 */
export function Tile({
  x,
  y,
  w,
  h,
  accent,
  tint,
  icon,
  reveal,
  focus,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent: Accent;
  /** Optional #rrggbb that overrides the accent colour (for a tile whose meaning turns mid-cue). */
  tint?: string;
  icon: IconName;
  reveal: number;
  focus: number;
  children?: ReactNode;
}) {
  const a = { fg: tint ?? ACCENT[accent].fg };
  const dim = 0.42 + 0.58 * focus;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, fontFamily: FONT.sans }}>
      {reveal < 1 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: RADIUS.lg,
            border: `2px dashed ${C.ink600}`,
            background: alpha(C.ink850, 0.35),
            display: 'grid',
            placeItems: 'center',
            opacity: 1 - reveal,
          }}
        >
          <Icon name={icon} size={44} color={C.ink500} />
        </div>
      ) : null}
      {reveal > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: RADIUS.lg,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            border: `2px solid ${focus > 0.01 ? alpha(a.fg, 0.25 + 0.6 * focus) : C.ink700}`,
            boxShadow: `0 24px 60px ${alpha('#000000', 0.3)}${focus > 0.01 ? `, 0 0 ${18 + 30 * focus}px ${alpha(a.fg, 0.28 * focus)}` : ''}`,
            opacity: reveal * dim,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Blends two #rrggbb colours (t = 0 gives `from`, 1 gives `to`) into #rrggbb. */
export function mixHex(from: string, to: string, t: number): string {
  const k = Math.max(0, Math.min(1, t));
  const channel = (hex: string, i: number) => parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16);
  let out = '#';
  for (let i = 0; i < 3; i++) {
    const v = Math.round(channel(from, i) + (channel(to, i) - channel(from, i)) * k);
    out += v.toString(16).padStart(2, '0');
  }
  return out;
}

/** Small caps line at the top of a tile. */
export function Kicker({ children, color, icon }: { children: ReactNode; color: string; icon?: IconName }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: TYPE.small,
        fontWeight: 800,
        letterSpacing: 2.2,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {icon ? <Icon name={icon} size={28} color={color} strokeWidth={2.2} /> : null}
      {children}
    </div>
  );
}
