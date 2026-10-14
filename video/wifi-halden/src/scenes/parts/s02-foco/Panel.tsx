import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { MEASURES, SCAN } from '../../../data/s02-foco';

/**
 * The right column's box (s02): first the test laptop's list of networks, ONE row and nothing
 * else; later, in the same place, the two measurements of the car park. Cyan frame: the port's
 * own test. No other network, no MAC, no channel, no address.
 */
export const PANEL = { w: 608, h: 142, bar: 42 } as const;
/** Height of the box once it holds the two measurements. */
export const MEASURES_H = 172;

/** Amber's soft tone for text (not LAMP: that warm white is the floodlight's light only). */
const AMBER_SOFT = '#fcd34d';
const EMERALD_SOFT = '#6ee7b7';

function Box({ title, h = PANEL.h, children }: { title: string; h?: number; children: ReactNode }) {
  return (
    <div
      style={{
        width: PANEL.w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.6)}`,
        background: alpha(C.ink900, 0.95),
        boxShadow: `0 18px 40px ${alpha('#000000', 0.4)}`,
        overflow: 'hidden',
        fontFamily: FONT.mono,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ height: PANEL.bar, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', background: alpha(C.cyan, 0.1), borderBottom: `2px solid ${alpha(C.cyan, 0.3)}` }}>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: alpha(C.cyan, 0.8) }} />
        <span style={{ fontSize: 24, fontWeight: 700, color: C.muted }}>{title}</span>
      </div>
      <div style={{ position: 'relative', height: h - PANEL.bar - 4 }}>{children}</div>
    </div>
  );
}

/** Signal strength as four bars, `lit` of them on. */
export function Bars({ lit, tone, size = 40 }: { lit: number; tone: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block', flexShrink: 0 }}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={2 + i * 10} y={30 - i * 8} width={7} height={8 + i * 8} rx={2} fill={i < lit ? tone : alpha(C.faint, 0.55)} />
      ))}
    </svg>
  );
}

/**
 * The list of networks the laptop hears. `row` 0–1 shows its only row; `value` 0–1 lights the
 * reading; `hidden` 0–1 replaces the name by an empty dashed slot (a hidden SSID: still heard,
 * just unnamed); `seen` 0–1 flashes the name when it comes back.
 */
export function ScanWindow({ row, value, hidden = 0, seen = 0 }: { row: number; value: number; hidden?: number; seen?: number }) {
  const r = clamp01(row);
  const v = clamp01(value);
  const h = clamp01(hidden);
  const s = clamp01(seen);
  return (
    <Box title={SCAN.host}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', opacity: r, transform: `translateY(${(1 - r) * 8}px)` }}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{ fontSize: 34, fontWeight: 800, color: s > 0.02 ? AMBER_SOFT : C.cyanSoft, opacity: 1 - h, textShadow: s > 0.02 ? `0 0 ${Math.round(18 * s)}px ${alpha(C.amber, 0.7 * s)}` : undefined }}>
            {SCAN.network}
          </span>
          <span style={{ position: 'absolute', inset: '2px -6px', borderRadius: 8, border: `2.5px dashed ${alpha(C.muted, 0.9)}`, opacity: h }} />
        </span>
        <span style={{ padding: '1px 12px 3px', borderRadius: RADIUS.sm, border: `2px solid ${alpha(C.violet, 0.8)}`, background: alpha(C.violet, 0.14), fontSize: 32, fontWeight: 800, color: '#c4b5fd' }}>
          {SCAN.proto}
        </span>
        <span style={{ flex: 1 }} />
        <Bars lit={3} tone={v > 0.5 ? C.amber : alpha(C.amber, 0.6)} size={38} />
        <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: -0.5, color: alpha(AMBER_SOFT, 0.6 + 0.4 * v), textShadow: v > 0.02 ? `0 0 ${Math.round(16 * v)}px ${alpha(C.amber, 0.45 * v)}` : undefined }}>
          {SCAN.value}
        </span>
      </div>
    </Box>
  );
}

/**
 * The two measurements of the car park, one row each: «14-12 · −55 dBm» (amber, the finding)
 * and «16-12 · −78 dBm» (emerald, after the adjustment). `second` 0–1 shows the second row's
 * date, `value` 0–1 its reading (a dashed empty slot until then), `glow` 0–1 a halo on it.
 */
export function Measures({ second, value, glow = 0 }: { second: number; value: number; glow?: number }) {
  const sec = clamp01(second);
  const val = clamp01(value);
  const g = clamp01(glow);
  const rowH = (MEASURES_H - PANEL.bar - 4) / 2;
  const row = (day: string, reading: string, bars: number, tone: string, soft: string, top: number, show: number, shown: number, halo: number) => (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height: rowH, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', opacity: 0.25 + 0.75 * show }}>
      <span style={{ fontSize: 34, fontWeight: 800, color: C.text }}>{day}</span>
      <span style={{ fontSize: 32, fontWeight: 700, color: C.faint }}>·</span>
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, opacity: shown }}>
          <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: -0.5, color: soft, textShadow: halo > 0.02 ? `0 0 ${Math.round(20 * halo)}px ${alpha(tone, 0.7 * halo)}` : undefined }}>{reading}</span>
          <Bars lit={bars} tone={tone} size={34} />
        </span>
        <span style={{ position: 'absolute', inset: '4px -6px', borderRadius: 8, border: `2.5px dashed ${alpha(C.faint, 0.9)}`, opacity: 1 - shown }} />
      </span>
    </div>
  );
  return (
    <Box title={SCAN.host} h={MEASURES_H}>
      {row(MEASURES.first.day, MEASURES.first.value, MEASURES.first.bars, C.amber, AMBER_SOFT, 0, 1, 1, 0)}
      {row(MEASURES.second.day, MEASURES.second.value, MEASURES.second.bars, C.emerald, EMERALD_SOFT, rowH, sec, val, g)}
    </Box>
  );
}
