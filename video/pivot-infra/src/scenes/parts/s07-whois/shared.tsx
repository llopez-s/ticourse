import type { CSSProperties } from 'react';
import { C, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { Chip, type IconName } from '../../../../../engine/src/ui';

/**
 * Pieces shared by s07-whois, s08-lifecycle and s09-preblock so the same idea
 * looks pixel-identical wherever it comes back.
 */

/** The registration pattern (s07-05) — the same three chips become the search filters in s09. */
export const PATTERN: { text: string; icon: IconName }[] = [
  { text: 'mismo registrador', icon: 'layers' },
  { text: 'mismos nameservers', icon: 'network' },
  { text: 'mismo día', icon: 'clock' },
];

/**
 * One pattern chip. `lit` (0–1) cross-fades it from «suelto» (amber outline:
 * alone it says nothing) to «juntos» (solid emerald: together they point at the actor).
 * Both states share one grid cell, so the chip never changes size.
 */
export function PatternChip({
  text,
  icon,
  lit = 0,
  size = TYPE.label,
  style,
}: {
  text: string;
  icon: IconName;
  lit?: number;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: 'inline-grid', ...style }}>
      <div style={{ gridArea: '1 / 1', opacity: 1 - lit }}>
        <Chip accent="amber" icon={icon} size={size}>
          {text}
        </Chip>
      </div>
      <div
        style={{
          gridArea: '1 / 1',
          opacity: lit,
          borderRadius: RADIUS.pill,
          boxShadow: lit > 0.01 ? `0 0 ${Math.round(30 * lit)}px ${alpha(C.emerald, 0.45 * lit)}` : undefined,
        }}
      >
        <Chip accent="emerald" icon={icon} solid size={size}>
          {text}
        </Chip>
      </div>
    </div>
  );
}

/**
 * A fully redacted domain name: two solid bars joined by a dot, so no letter
 * (not even the TLD) is readable. Drawn with CSS, never with the U+2588 glyph
 * (the fonts are latin subsets). `tint` recolours it (e.g. rose once blocked),
 * `strike` (0–1) draws a line through it.
 */
export function RedactedName({
  width,
  height = 26,
  tld = 56,
  tint = C.muted,
  strength = 0.7,
  strike = 0,
  style,
}: {
  width: number;
  height?: number;
  tld?: number;
  tint?: string;
  strength?: number;
  strike?: number;
  style?: CSSProperties;
}) {
  const bar: CSSProperties = { height, borderRadius: 5, background: alpha(tint, strength), flexShrink: 0 };
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7, ...style }}>
      <div style={{ ...bar, width }} />
      <div style={{ width: 7, height: 7, borderRadius: 4, background: alpha(tint, strength), flexShrink: 0, alignSelf: 'flex-end', marginBottom: 2 }} />
      <div style={{ ...bar, width: tld }} />
      {strike > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: -6,
            top: '50%',
            height: 4,
            marginTop: -2,
            width: `calc(${(strike * 100).toFixed(1)}% + 12px)`,
            borderRadius: 2,
            background: C.rose,
            boxShadow: `0 0 10px ${alpha(C.rose, 0.6)}`,
          }}
        />
      ) : null}
    </div>
  );
}
