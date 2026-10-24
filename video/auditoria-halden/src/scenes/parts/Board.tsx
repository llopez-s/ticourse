import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/** Native size of the board table, seen from above. */
export const BOARD = { w: 880, h: 520 } as const;

/**
 * The board's table seen from above: a rounded table, five chairs a side and one at each end. No faces and no names:
 * the board is furniture. `children` are laid over the table's centre in the SVG's own units (880 × 520).
 */
export function BoardTable({ scale = 1, glow = 0, children }: { scale?: number; glow?: number; children?: ReactNode }) {
  return (
    <div style={{ position: 'relative', width: BOARD.w * scale, height: BOARD.h * scale }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: BOARD.w, height: BOARD.h, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        <svg width={BOARD.w} height={BOARD.h} viewBox={`0 0 ${BOARD.w} ${BOARD.h}`} fill="none" aria-hidden style={{ position: 'absolute', left: 0, top: 0 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={150 + i * 135} y={70} width={100} height={44} rx={16} fill={C.ink800} stroke={alpha(C.text, 0.22)} strokeWidth={3} />
              <rect x={150 + i * 135} y={406} width={100} height={44} rx={16} fill={C.ink800} stroke={alpha(C.text, 0.22)} strokeWidth={3} />
            </g>
          ))}
          <rect x={36} y={208} width={46} height={104} rx={16} fill={C.ink800} stroke={alpha(C.text, 0.22)} strokeWidth={3} />
          <rect x={798} y={208} width={46} height={104} rx={16} fill={C.ink800} stroke={alpha(C.text, 0.22)} strokeWidth={3} />
          <rect x={100} y={130} width={680} height={260} rx={80} fill={C.ink850} stroke={alpha(C.cyan, 0.35 + 0.3 * glow)} strokeWidth={4} />
          <rect x={120} y={150} width={640} height={220} rx={64} fill="none" stroke={alpha(C.text, 0.08)} strokeWidth={3} />
        </svg>
        {children}
      </div>
    </div>
  );
}
