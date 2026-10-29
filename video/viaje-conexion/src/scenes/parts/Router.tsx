import type { CSSProperties } from 'react';
import { Icon } from '../../../../engine/src/ui/Icon';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The office router with the firewall inside (one box, two icons). `glow` 0-1 lights it; `name` draws the
 * caption under it. Used by Plano and by s04. s08/s10 draw their own NAT / cortafuegos boxes on top of it.
 */
export function RouterBox({
  width = 210,
  height = 200,
  glow = 0,
  iconSize = 78,
  name = 'router · cortafuegos',
  nameSize = 30,
  style,
}: {
  width?: number;
  height?: number;
  glow?: number;
  iconSize?: number;
  name?: string | null;
  nameSize?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ width, ...style }}>
      <div
        style={{
          height,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.cyan, 0.4 + 0.55 * glow)}`,
          background: alpha(C.cyan, 0.07 + 0.12 * glow),
          boxShadow: glow > 0.01 ? `0 0 ${Math.round(44 * glow)}px ${alpha(C.cyan, 0.4 * glow)}` : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
        }}
      >
        <Icon name="router" size={iconSize} color={C.cyan} />
        <div style={{ width: 2, height: iconSize * 1.15, background: alpha(C.cyan, 0.35) }} />
        <Icon name="firewall" size={iconSize} color={C.cyanSoft} />
      </div>
      {name ? (
        <div style={{ marginTop: 10, textAlign: 'center', fontFamily: FONT.sans, fontSize: nameSize, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>{name}</div>
      ) : null}
    </div>
  );
}
