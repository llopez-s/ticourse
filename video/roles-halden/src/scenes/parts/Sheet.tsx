import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/** The passenger list in its own units: 520 wide, 420 high. */
export const SHEET = { w: 520, h: 420 } as const;
const ROWS = 6;
const ROW_Y0 = 150;
const ROW_STEP = 44;

/**
 * «lista de pasajeros del ferry»: one sheet, a header and six rows of unreadable bars (a small round avatar, a long
 * bar and a short one — no names, nothing legible). Drawn at `width` px (the text scales with it). `glow` 0–1 lights
 * the border (cyan = data); `rowsOn` 0–1 fills the rows in (a sheet that starts empty). `children` are drawn over the
 * sheet in the sheet's own units.
 */
export function ListSheet({ width = SHEET.w, glow = 0, rowsOn = 1, children }: { width?: number; glow?: number; rowsOn?: number; children?: ReactNode }) {
  const k = width / SHEET.w;
  return (
    <div style={{ position: 'relative', width, height: SHEET.h * k, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SHEET.w, height: SHEET.h, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <svg width={SHEET.w} height={SHEET.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <rect x={0} y={0} width={SHEET.w} height={SHEET.h} rx={26} fill={C.ink850} stroke={alpha(C.cyan, 0.5 + 0.4 * glow)} strokeWidth={4} style={{ filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(26 * glow)}px ${alpha(C.cyan, 0.45 * glow)})` : undefined }} />
          <path d={`M 28 118 H ${SHEET.w - 28}`} stroke={alpha(C.cyan, 0.3)} strokeWidth={3} />
          {Array.from({ length: ROWS }).map((_, i) => {
            const y = ROW_Y0 + i * ROW_STEP;
            const on = Math.max(0, Math.min(1, rowsOn * (ROWS + 1) - i));
            return (
              <g key={i} opacity={0.25 + 0.75 * on}>
                <circle cx={52} cy={y} r={13} fill={alpha(C.cyan, 0.18)} stroke={alpha(C.cyan, 0.45)} strokeWidth={2.5} />
                <rect x={86} y={y - 7} width={i % 3 === 1 ? 200 : 250} height={14} rx={7} fill={alpha(C.muted, 0.3)} />
                <rect x={SHEET.w - 150} y={y - 7} width={i % 2 === 0 ? 96 : 70} height={14} rx={7} fill={alpha(C.muted, 0.2)} />
              </g>
            );
          })}
        </svg>
        <div style={{ position: 'absolute', left: 30, top: 22, display: 'flex', alignItems: 'center', gap: 18 }}>
          <Icon name="file" size={54} color={C.cyan} strokeWidth={2} />
          <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.08, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <div>lista de pasajeros</div>
            <div style={{ color: C.cyanSoft }}>del ferry</div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** A flat strip version for the diagrams: icon, «lista de pasajeros del ferry» on one line and three bars. */
export function ListStrip({ width = 560, height = 100, glow = 0 }: { width?: number; height?: number; glow?: number }) {
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 26px',
        borderRadius: 22,
        background: C.ink850,
        border: `3px solid ${alpha(C.cyan, 0.5 + 0.4 * glow)}`,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(26 * glow)}px ${alpha(C.cyan, 0.4 * glow)}` : undefined,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="file" size={50} color={C.cyan} strokeWidth={2} />
      <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>lista de pasajeros del ferry</span>
    </div>
  );
}
