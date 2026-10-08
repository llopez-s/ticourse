import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { INK } from '../glyphs';

/**
 * s02-06: today's office network («Oficinas», where the test laptop landed) and the device tiles in it.
 * Today is drawn solid on the dark stage (not on blueprint paper: the plan is the other panel).
 */

export const DEVICE_TILE = 96;

/** A device tile: an icon in a rounded square. `tone` cyan (the port's), `amber` (it came in unasked). */
export function DeviceTile({ icon = 'desktop', tone = 'muted', show = 1, glow = 0, dashed = false, size = DEVICE_TILE, style }: { icon?: 'desktop' | 'laptop'; tone?: 'muted' | 'cyan' | 'amber'; show?: number; glow?: number; dashed?: boolean; size?: number; style?: CSSProperties }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const g = clamp01(glow);
  const col = tone === 'cyan' ? C.cyan : tone === 'amber' ? C.amber : INK.steel;
  return (
    <div
      style={{
        width: size,
        height: size,
        boxSizing: 'border-box',
        borderRadius: 20,
        display: 'grid',
        placeItems: 'center',
        background: dashed ? alpha(col, 0.05) : alpha(col, tone === 'muted' ? 0.06 : 0.14),
        border: `3px ${dashed ? 'dashed' : 'solid'} ${alpha(col, tone === 'muted' ? 0.55 : 0.9)}`,
        boxShadow: g > 0.01 ? `0 0 ${Math.round(30 * g)}px ${alpha(col, 0.5 * g)}` : undefined,
        opacity: s,
        transform: `translateY(${(1 - s) * -26}px) scale(${1 + 0.06 * g})`,
        ...style,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.56)} color={tone === 'muted' ? alpha(INK.steel, 0.85) : col} strokeWidth={2} />
    </div>
  );
}

/** Today's office network: a solid panel with its name on top. Children are positioned by the caller (panel-local px). */
export function OfficeNet({ width, height, name, show = 1, children }: { width: number; height: number; name: string; show?: number; children?: ReactNode }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(INK.steel, 0.55)}`,
        background: alpha(C.ink850, 0.92),
        opacity: s,
        transform: `translateY(${(1 - s) * 12}px)`,
      }}
    >
      <div style={{ position: 'absolute', left: 30, top: 22, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <Icon name="network" size={44} color={INK.steel} />
        {name}
      </div>
      {children}
    </div>
  );
}
