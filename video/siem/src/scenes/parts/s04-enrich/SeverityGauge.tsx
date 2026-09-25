import type { CSSProperties } from 'react';
import { C, FONT, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { SeverityBadge, type Severity } from '../../../../../engine/src/ui';
import { SeverityDial } from './SeverityDial';

/** Shared geometry so the main event and its "mismo aviso" copy read as the same instrument. */
export const GAUGE = { radius: 56, stroke: 16, badge: TYPE.label } as const;

/**
 * "GRAVEDAD" label, semicircular dial and the level badge, stacked. Both cards
 * in S04 use this at the same offset under their header, so the two dials and
 * the two badges line up horizontally for the BAJA-vs-ALTA comparison.
 */
export function SeverityGauge({
  level,
  label,
  badgeGlow = 0,
  glowColor = C.emerald,
  style,
}: {
  /** Continuous 0 (BAJA) … 2 (ALTA), drives the needle. */
  level: number;
  /** Discrete level shown on the badge. */
  label: Severity;
  badgeGlow?: number;
  glowColor?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...style }}>
      <div
        style={{
          fontFamily: FONT.sans,
          fontSize: TYPE.small,
          fontWeight: 750,
          letterSpacing: 2,
          color: C.muted,
          lineHeight: 1,
        }}
      >
        GRAVEDAD
      </div>
      <div style={{ marginTop: 4 }}>
        <SeverityDial level={level} radius={GAUGE.radius} stroke={GAUGE.stroke} />
      </div>
      <SeverityBadge
        level={label}
        size={GAUGE.badge}
        style={{
          marginTop: 6,
          boxShadow: badgeGlow > 0 ? `0 0 ${22 * badgeGlow}px ${alpha(glowColor, 0.4 * badgeGlow)}` : undefined,
        }}
      />
    </div>
  );
}
