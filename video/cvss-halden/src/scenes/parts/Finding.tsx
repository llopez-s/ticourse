import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle, mix } from '../../../../engine/src/ui';
import type { Sev } from '../../data/findings';

/**
 * The scan's findings as the SOC queue draws them. Red family: a CRITICAL (9.8) is rose; a HIGH (8.1) is the same rose,
 * a notch softer — "tres filas rojas" in s01, but the 8.1 never wears the word CRITICAL.
 */

export const SEV_TONE: Record<Sev, { fg: string; soft: string; deep: string }> = {
  CRITICAL: { fg: C.rose, soft: '#fecdd3', deep: C.roseDeep },
  HIGH: { fg: '#fb7185', soft: '#ffe4e6', deep: '#5b0f24' },
};

/** «9.8» big, its severity word under it. */
export function ScoreBadge({
  score,
  sev,
  size = 56,
  withSev = true,
  lit = 1,
  style,
}: {
  score: string;
  sev: Sev;
  size?: number;
  withSev?: boolean;
  lit?: number;
  style?: CSSProperties;
}) {
  const t = SEV_TONE[sev];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.28),
        padding: `${Math.round(size * 0.1)}px ${Math.round(size * 0.3)}px`,
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(t.fg, 0.5 + 0.5 * clamp01(lit))}`,
        background: alpha(t.deep, 0.8),
        boxShadow: lit > 0.4 ? `0 0 ${Math.round(20 * lit)}px ${alpha(t.fg, 0.3 * lit)}` : undefined,
        fontFamily: FONT.mono,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ fontSize: size, fontWeight: 850, lineHeight: 1.1, color: t.soft }}>{score}</span>
      {withSev ? (
        <span style={{ fontFamily: FONT.sans, fontSize: Math.max(26, Math.round(size * 0.46)), fontWeight: 800, letterSpacing: 1.5, color: t.fg }}>{sev}</span>
      ) : null}
    </div>
  );
}

/** «datos ficticios»: a dashed rubber-stamp pill for the invented CVE numbers. */
export function DataSeal({ size = 28, show = 1, style }: { size?: number; show?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        padding: `${Math.round(size * 0.14)}px ${Math.round(size * 0.55)}px`,
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(C.muted, 0.8)}`,
        background: alpha(C.ink850, 0.9),
        color: C.muted,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        letterSpacing: 0.5,
        whiteSpace: 'nowrap',
        opacity: show,
        ...style,
      }}
    >
      <Icon name="flag" size={Math.round(size * 1.05)} color={C.muted} />
      datos ficticios
    </span>
  );
}

/**
 * A queue row: the severity bar, the host and its score. `lit` 0–1 is how bright the row is ("a media luz" at 0.55);
 * `children` ride between the host and the score (a description, a method, a chip).
 */
export function QueueRow({
  width,
  height = 92,
  host,
  score,
  sev,
  lit = 1,
  dim = 0,
  show = 1,
  hostSize = 44,
  children,
  right,
  style,
}: {
  width: number;
  height?: number;
  host: string;
  score?: string;
  sev: Sev;
  lit?: number;
  dim?: number;
  show?: number;
  hostSize?: number;
  children?: ReactNode;
  right?: ReactNode;
  style?: CSSProperties;
}) {
  const t = SEV_TONE[sev];
  const l = clamp01(lit);
  return (
    <div
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '0 22px 0 30px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(t.fg, mix(0.28, 0.9, l))}`,
        background: `linear-gradient(90deg, ${alpha(t.deep, mix(0.35, 0.8, l))} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
        boxShadow: l > 0.6 ? `0 0 ${Math.round(30 * l)}px ${alpha(t.fg, 0.22 * l)}` : undefined,
        fontFamily: FONT.sans,
        opacity: show,
        ...dimStyle(dim, show),
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 8, borderRadius: 4, background: alpha(t.fg, mix(0.4, 1, l)) }} />
      <span style={{ fontFamily: FONT.mono, fontSize: hostSize, fontWeight: 800, color: alpha(C.textStrong, mix(0.72, 1, l)), whiteSpace: 'nowrap' }}>{host}</span>
      {children}
      <div style={{ flex: 1 }} />
      {right}
      {score ? <ScoreBadge score={score} sev={sev} lit={l} /> : null}
    </div>
  );
}
