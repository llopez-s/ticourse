import type { ReactNode } from 'react';
import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/** The old computer's own units. */
export const OLD_PC = { w: 560, h: 440 } as const;
/** Its screen and its front USB port (own units). */
export const OLD_PC_SCREEN = { x: 40, y: 30, w: 380, h: 260 } as const;
export const OLD_PC_PORT = { x: 515, y: 330 } as const;

/**
 * Systems' old computer with no network (s04): a boxy monitor whose screen shows `children` (HTML, laid out at the
 * screen's own size), a keyboard, and the tower with its front USB port, which glows cyan with `port` 0–1 (the
 * path). No name, no cable to anything.
 */
export function OldPc({ width, port = 0, screen = 0.2, children }: { width: number; port?: number; screen?: number; children?: ReactNode }) {
  const k = width / OLD_PC.w;
  const p = clamp01(port);
  return (
    <div style={{ position: 'relative', width, height: OLD_PC.h * k }}>
      <svg width={width} height={OLD_PC.h * k} viewBox={`0 0 ${OLD_PC.w} ${OLD_PC.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* monitor */}
        <rect x={10} y={0} width={440} height={330} rx={18} fill="#2b3446" stroke={alpha(C.text, 0.3)} strokeWidth={4} />
        <rect x={OLD_PC_SCREEN.x} y={OLD_PC_SCREEN.y} width={OLD_PC_SCREEN.w} height={OLD_PC_SCREEN.h} rx={8} fill={C.ink950} />
        <rect x={OLD_PC_SCREEN.x} y={OLD_PC_SCREEN.y} width={OLD_PC_SCREEN.w} height={OLD_PC_SCREEN.h} rx={8} fill={alpha(C.sky, 0.05 + 0.1 * clamp01(screen))} />
        <circle cx={400} cy={312} r={5} fill={alpha(C.emerald, 0.8)} />
        <rect x={190} y={330} width={80} height={26} fill="#232b3a" />
        <rect x={140} y={354} width={180} height={12} rx={4} fill="#232b3a" />
        {/* keyboard */}
        <rect x={40} y={384} width={380} height={46} rx={8} fill="#2b3446" stroke={alpha(C.text, 0.25)} strokeWidth={3} />
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={54 + (i % 12) * 30} y={392 + Math.floor(i / 12) * 18} width={22} height={12} rx={2} fill={alpha(C.text, 0.18)} />
        ))}
        {/* tower */}
        <rect x={470} y={40} width={88} height={392} rx={8} fill="#2b3446" stroke={alpha(C.text, 0.3)} strokeWidth={4} />
        <rect x={484} y={70} width={60} height={12} rx={3} fill={C.ink950} />
        <rect x={484} y={96} width={60} height={12} rx={3} fill={C.ink950} />
        <circle cx={514} cy={400} r={9} fill="none" stroke={alpha(C.text, 0.5)} strokeWidth={3} />
        {p > 0.02 ? <circle cx={OLD_PC_PORT.x} cy={OLD_PC_PORT.y} r={34} fill={alpha(C.cyan, 0.22 * p)} /> : null}
        <rect x={OLD_PC_PORT.x - 18} y={OLD_PC_PORT.y - 8} width={36} height={16} rx={3} fill={C.ink950} stroke={p > 0.02 ? C.cyan : alpha(C.text, 0.5)} strokeWidth={3} />
      </svg>
      <div style={{ position: 'absolute', left: OLD_PC_SCREEN.x * k, top: OLD_PC_SCREEN.y * k, width: OLD_PC_SCREEN.w * k, height: OLD_PC_SCREEN.h * k, overflow: 'hidden', borderRadius: 8 * k }}>
        {children}
      </div>
    </div>
  );
}
