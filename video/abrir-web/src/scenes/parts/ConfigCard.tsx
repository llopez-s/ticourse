import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { NET } from './data';

/**
 * The laptop's network configuration = the DHCP lease card of s02: four rows that start BLANK (grey bars) and fill
 * one by one at the voice's cues — dirección · máscara (with «/24» beside it) · puerta de enlace · resolutor DNS.
 * The addresses are on screen only; the voice never reads them.
 *
 *   - `fill`   per row 0–1 (typewriter: characters visible = fill × length); the «/24» chip appears when the mask is full.
 *   - `stale`  0–1 the amber banner «concesión del viernes · caducada» (visible while the rows are blank).
 *   - `fresh`  0–1 the emerald banner «concesión nueva» that replaces it once the card starts to fill.
 *   - `glow`   per row 0–1 highlight (the row the voice is on).
 *   - `done`   0–1 emerald halo once the card is full.
 *
 * `CONFIG_CARD_H` is its height; width defaults to 600. Not positioned.
 */

export const CONFIG_ROWS = [
  { label: 'dirección', value: NET.laptop },
  { label: 'máscara', value: NET.mask },
  { label: 'puerta de enlace', value: NET.gateway },
  { label: 'resolutor DNS', value: NET.resolver },
] as const;

const HEAD_H = 70;
const BANNER_H = 62;
const ROW_H = 86;
export const CONFIG_CARD_H = HEAD_H + BANNER_H + ROW_H * 4 + 14;

export function ConfigCard({
  fill = [0, 0, 0, 0],
  stale = 1,
  fresh = 0,
  glow = [0, 0, 0, 0],
  done = 0,
  width = 600,
  style,
}: {
  fill?: readonly number[];
  stale?: number;
  fresh?: number;
  glow?: readonly number[];
  done?: number;
  width?: number;
  style?: CSSProperties;
}) {
  const d = clamp01(done);
  const st = clamp01(stale);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: CONFIG_CARD_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(d > 0.01 ? C.emerald : C.cyan, 0.5 + 0.3 * d)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}${d > 0 ? `, 0 0 ${Math.round(34 * d)}px ${alpha(C.emerald, 0.3 * d)}` : ''}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ height: HEAD_H, display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px', background: alpha(C.ink800, 0.95), borderBottom: `2px solid ${C.ink700}` }}>
        <Icon name="laptop" size={42} color={C.cyan} />
        <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>Red del portátil</span>
      </div>
      <div style={{ height: BANNER_H, display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px', opacity: st, background: alpha(C.amber, 0.08) }}>
        <Icon name="clock" size={34} color={C.amber} />
        <span style={{ fontSize: 31, fontWeight: 750, color: '#fcd34d', whiteSpace: 'nowrap' }}>concesión del viernes · caducada</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: HEAD_H, height: BANNER_H, display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px', opacity: clamp01(fresh), background: alpha(C.emerald, 0.08) }}>
        <Icon name="check" size={34} color={C.emerald} strokeWidth={3} />
        <span style={{ fontSize: 31, fontWeight: 750, color: '#6ee7b7', whiteSpace: 'nowrap' }}>concesión nueva</span>
      </div>
      {CONFIG_ROWS.map((row, i) => {
        const f = clamp01(fill[i] ?? 0);
        const g = clamp01(glow[i] ?? 0);
        const n = Math.ceil(row.value.length * f);
        return (
          <div
            key={row.label}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: HEAD_H + BANNER_H + i * ROW_H + 8,
              height: ROW_H,
              padding: '8px 26px 0',
              boxSizing: 'border-box',
              background: g > 0.01 ? alpha(C.cyan, 0.09 * g) : undefined,
              borderTop: i === 0 ? undefined : `1px solid ${C.ink700}`,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 650, color: C.muted }}>{row.label}</div>
            <div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 16 }}>
              {n > 0 ? (
                <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 600, color: C.textStrong, whiteSpace: 'nowrap' }}>{row.value.slice(0, n)}</span>
              ) : (
                <span style={{ width: 300, height: 16, borderRadius: 8, background: alpha(C.muted, 0.25) }} />
              )}
              {i === 1 && f >= 1 ? (
                <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 700, color: C.cyanSoft, padding: '0 14px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.6)}`, background: alpha(C.cyan, 0.1) }}>
                  {NET.prefix}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
