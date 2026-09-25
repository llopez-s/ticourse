import type { CSSProperties } from 'react';
import { C, FONT, TYPE } from '../theme/tokens';
import { fmtInt } from '../theme/motion';

/**
 * Big tabular number (Spanish thousands separator) with optional unit and
 * caption. Pass an already-animated `value` (see motion.countUp).
 */
export function Counter({
  value,
  unit,
  caption,
  color = C.textStrong,
  size = TYPE.hero,
  decimals = 0,
  style,
}: {
  value: number;
  unit?: string;
  caption?: string;
  color?: string;
  size?: number;
  decimals?: number;
  style?: CSSProperties;
}) {
  const text = decimals > 0 ? value.toFixed(decimals).replace('.', ',') : fmtInt(value);
  return (
    <div style={{ fontFamily: FONT.sans, ...style }}>
      <div
        style={{
          fontSize: size,
          fontWeight: 800,
          color,
          lineHeight: 1,
          letterSpacing: -1,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
        {unit ? (
          <span style={{ fontSize: Math.round(size * 0.42), fontWeight: 650, color: C.muted, marginLeft: 12, letterSpacing: 0 }}>
            {unit}
          </span>
        ) : null}
      </div>
      {caption ? (
        <div style={{ fontSize: TYPE.small, color: C.muted, marginTop: 10, fontWeight: 550 }}>{caption}</div>
      ) : null}
    </div>
  );
}
