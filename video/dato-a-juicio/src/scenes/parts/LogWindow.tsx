import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Panel } from '../../../../engine/src/ui';

/**
 * A terminal window with ONE log line: «registro del proxy» and nothing but the IP (no time, host, user or domain).
 * `hot` 0..1 picks the IP out with a cyan frame; `glow` lights the whole window.
 * A normal-flow box `width` px wide; wrap it in a positioned div.
 */
export function LogWindow({ width, ip, hot = 0, glow = 0, size = 56, style }: { width: number; ip: string; hot?: number; glow?: number; size?: number; style?: CSSProperties }) {
  return (
    <Panel title="registro del proxy" icon="terminal" accent="cyan" glow={glow} style={{ width, ...style }} bodyStyle={{ padding: '26px 30px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: FONT.mono }}>
        <span style={{ fontSize: 30, color: C.faint, width: 30, textAlign: 'right' }}>1</span>
        <span
          style={{
            fontSize: size,
            fontWeight: 700,
            letterSpacing: 1,
            color: hot > 0.05 ? C.cyanSoft : C.text,
            padding: '2px 16px',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.cyan, 0.9 * hot)}`,
            background: alpha(C.cyan, 0.14 * hot),
            boxShadow: hot > 0.05 ? `0 0 ${Math.round(34 * hot)}px ${alpha(C.cyan, 0.45 * hot)}` : undefined,
            whiteSpace: 'nowrap',
          }}
        >
          {ip}
        </span>
      </div>
    </Panel>
  );
}
