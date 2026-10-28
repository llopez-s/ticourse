import type { CSSProperties } from 'react';
import { Icon } from '../../../../engine/src/ui/Icon';
import { ACCENT, C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { STOPWATCH } from './data';

/**
 * The response stopwatch of s01 (and s11): counts up to «0,4 s» and stops. `p` 0-1 is the count (1 = stopped
 * on the canon value), `armed` shows it waiting on «0,0 s», `done` turns it emerald.
 */
export function Cronometro({
  p,
  armed = true,
  size = 64,
  label = 'tiempo de respuesta',
  style,
}: {
  p: number;
  armed?: boolean;
  size?: number;
  label?: string;
  style?: CSSProperties;
}) {
  const done = p >= 1;
  const value = done ? STOPWATCH : `${(Math.max(0, p) * 0.4).toFixed(1).replace('.', ',')} s`;
  const a = done ? ACCENT.emerald : ACCENT.cyan;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 18,
        padding: '12px 26px 12px 18px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(a.fg, armed ? 0.8 : 0.3)}`,
        background: alpha(a.fg, 0.1),
        boxShadow: done ? `0 0 34px ${alpha(a.fg, 0.35)}` : undefined,
        opacity: armed ? 1 : 0.4,
        ...style,
      }}
    >
      <Icon name="clock" size={Math.round(size * 0.9)} color={a.fg} />
      <div>
        <div style={{ fontFamily: FONT.mono, fontSize: size, fontWeight: 800, color: C.textStrong, lineHeight: 1 }}>{value}</div>
        <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>{label}</div>
      </div>
    </div>
  );
}
