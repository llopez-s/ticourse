import type { CSSProperties, ReactNode } from 'react';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

/**
 * The basic "console window" surface: dark ink card with an optional header
 * bar (icon + title + right-side slot). `accent` tints the border and header
 * icon; `glow` (0–1) adds an accent halo for the element the narration is on.
 */
export function Panel({
  title,
  icon,
  accent = 'cyan',
  right,
  glow = 0,
  children,
  style,
  bodyStyle,
}: {
  title?: string;
  icon?: IconName;
  accent?: Accent;
  right?: ReactNode;
  glow?: number;
  children?: ReactNode;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}) {
  const a = ACCENT[accent];
  return (
    <div
      style={{
        position: 'relative',
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${glow > 0 ? alpha(a.fg, 0.35 + glow * 0.5) : C.ink700}`,
        borderRadius: RADIUS.lg,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}${
          glow > 0 ? `, 0 0 ${24 + glow * 36}px ${alpha(a.fg, glow * 0.35)}` : ''
        }`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {title ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            height: 64,
            padding: '0 26px',
            borderBottom: `2px solid ${C.ink700}`,
            background: alpha(C.ink800, 0.9),
            flexShrink: 0,
          }}
        >
          {icon ? <Icon name={icon} size={30} color={a.fg} /> : null}
          <div
            style={{
              fontFamily: FONT.sans,
              fontSize: TYPE.small,
              fontWeight: 650,
              color: C.text,
              letterSpacing: 0.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
            }}
          >
            {title}
          </div>
          {right}
        </div>
      ) : null}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, ...bodyStyle }}>{children}</div>
    </div>
  );
}
