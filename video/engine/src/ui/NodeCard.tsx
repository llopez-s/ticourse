import type { CSSProperties } from 'react';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

/**
 * Compact card for a device, source or host: icon tile + label + optional
 * sublabel. `state` dims it (idle), highlights it (active) or marks it as a
 * problem (alert).
 */
export function NodeCard({
  icon,
  label,
  sublabel,
  accent = 'cyan',
  state = 'normal',
  width,
  style,
}: {
  icon: IconName;
  label: string;
  sublabel?: string;
  accent?: Accent;
  state?: 'idle' | 'normal' | 'active' | 'alert';
  width?: number;
  style?: CSSProperties;
}) {
  const a = ACCENT[state === 'alert' ? 'rose' : accent];
  const active = state === 'active' || state === 'alert';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        width,
        padding: '16px 22px 16px 16px',
        borderRadius: RADIUS.md,
        background: active ? alpha(a.fg, 0.1) : C.ink850,
        border: `2px solid ${active ? alpha(a.fg, 0.8) : C.ink700}`,
        boxShadow: active ? `0 0 28px ${alpha(a.fg, 0.25)}` : 'none',
        opacity: state === 'idle' ? 0.45 : 1,
        ...style,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: alpha(a.fg, 0.12),
          border: `2px solid ${alpha(a.fg, 0.35)}`,
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={34} color={a.fg} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 700,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            lineHeight: 1.15,
          }}
        >
          {label}
        </div>
        {sublabel ? (
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: TYPE.micro,
              color: C.muted,
              marginTop: 4,
              whiteSpace: 'nowrap',
            }}
          >
            {sublabel}
          </div>
        ) : null}
      </div>
    </div>
  );
}
