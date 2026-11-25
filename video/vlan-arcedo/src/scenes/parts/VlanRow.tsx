import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import type { Vlan } from '../../data/vlans';

export const VLAN_ROW_H = 52;

/**
 * One VLAN of the headquarters as a row: colour bar, number, name and — only on screen, the voice never reads it —
 * its subnet in mono: «10 Usuarios · 10.20.10.0/24». `on` 0–1 lifts it while the voice is on it.
 */
export function VlanRow({ v, width = 760, on = 0, value }: { v: Vlan; width?: number; on?: number; value?: string }) {
  const o = Math.max(0, Math.min(1, on));
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width,
        height: VLAN_ROW_H,
        boxSizing: 'border-box',
        padding: '0 20px 0 10px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(v.tone, 0.45 + 0.45 * o)}`,
        background: alpha(C.ink950, 0.85),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(20 * o)}px ${alpha(v.tone, 0.3 * o)}` : undefined,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ width: 10, height: 34, borderRadius: 5, background: v.tone }} />
      <div style={{ width: 52, fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: v.tone }}>{v.id}</div>
      <div style={{ fontSize: 34, fontWeight: 750, color: C.textStrong }}>{v.name}</div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 650, color: C.text }}>{value ?? v.subnet}</div>
    </div>
  );
}
