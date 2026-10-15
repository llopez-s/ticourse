import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Panel } from '../../../../../engine/src/ui';
import { CONSOLE_TITLE, SEAL } from '../../../data/s04-medida';

/**
 * The fault-log console shared by s04 and s05: one Panel with the log's title bar, plus the proposal seal at the
 * bottom of its body. The engine draws the «datos ficticios» simulation tag by itself; this seal is the canon
 * string of the video (it is part of the console, like a rubber stamp).
 */
export const PANEL_BAR = 64;
export const SEAL_H = 36;

export function Seal({ opacity = 1, style }: { opacity?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: SEAL_H - 6,
        padding: '0 18px',
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(C.muted, 0.7)}`,
        fontFamily: FONT.mono,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: 0.4,
        color: C.muted,
        whiteSpace: 'nowrap',
        opacity,
        ...style,
      }}
    >
      {SEAL}
    </div>
  );
}

/** The console surface. `children` are positioned absolutely in body coordinates (the panel's body starts under the bar). */
export function LogConsole({ width, height, glow = 0, children }: { width: number; height: number; glow?: number; children: ReactNode }) {
  return (
    <Panel title={CONSOLE_TITLE} icon="terminal" accent="cyan" glow={glow} style={{ width, height, boxSizing: 'border-box' }} bodyStyle={{ position: 'relative', overflow: 'hidden' }}>
      {children}
    </Panel>
  );
}
