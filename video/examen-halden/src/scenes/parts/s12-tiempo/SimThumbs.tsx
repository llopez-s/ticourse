import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';
import { FIREWALL_ROWS, STEP_NUMBERS } from '../../../data/s12-tiempo';

/*
 * The three simulation thumbnails of s12: generic windows with invented content (no IP, no names, no CompTIA chrome).
 *   FirewallThumb  a table of rules with «permitir» / «denegar»
 *   StepsThumb     four response steps in the wrong order (number badges 3 1 4 2) and a cursor dragging one
 *   ClassifyThumb  two columns to sort controls into, one chip in flight between them
 * `t` 0–1 = how far the thumbnail's inner animation has run (rows in, the chip dragged). Violet = exam.
 */

export const THUMB = { w: 540, h: 330 } as const;
const BAR_H = 44;

function Frame({ children, show }: { children: ReactNode; show: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: THUMB.w,
        height: THUMB.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.violet, 0.7)}`,
        background: C.ink900,
        boxShadow: `0 0 36px ${alpha(C.violetStrong, 0.22)}, 0 20px 40px ${alpha('#000000', 0.4)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        opacity: show,
        transform: `translateY(${(1 - show) * 26}px) scale(${0.96 + 0.04 * show})`,
      }}
    >
      <div style={{ height: BAR_H, background: alpha(C.violetDeep, 0.8), borderBottom: `3px solid ${alpha(C.violet, 0.4)}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 13, height: 13, borderRadius: 7, background: alpha(C.violet, 0.5 + 0.12 * i) }} />
        ))}
      </div>
      {children}
    </div>
  );
}

const bar = (w: number, tone: string = C.ink500, h = 14) => <div style={{ width: w, height: h, borderRadius: h / 2, background: alpha(tone, 0.85) }} />;

export function FirewallThumb({ show, t }: { show: number; t: number }) {
  return (
    <Frame show={show}>
      <div style={{ position: 'absolute', left: 18, right: 18, top: BAR_H + 16 }}>
        {FIREWALL_ROWS.map((a, i) => {
          const rp = clamp01(t * 5 - i * 0.7);
          const allow = a === 'permitir';
          return (
            <div
              key={i}
              style={{
                height: 58,
                marginBottom: 8,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0 12px',
                borderRadius: RADIUS.sm,
                border: `2px solid ${alpha(C.ink500, 0.8)}`,
                background: alpha(C.ink800, 0.95),
                opacity: rp,
                transform: `translateX(${(1 - rp) * -24}px)`,
              }}
            >
              <Icon name="firewall" size={28} color={C.sky} strokeWidth={2} />
              {bar(70 + (i % 2) * 18)}
              {bar(54)}
              <div style={{ flex: 1 }} />
              <span
                style={{
                  padding: '0 16px',
                  height: 38,
                  lineHeight: '34px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${allow ? C.cyan : C.muted}`,
                  background: allow ? alpha(C.cyan, 0.3) : alpha(C.ink600, 0.95),
                  fontSize: 26,
                  fontWeight: 800,
                  color: C.textStrong,
                }}
              >
                {a}
              </span>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

export function StepsThumb({ show, t }: { show: number; t: number }) {
  // The cursor drags the second row a little to the right and down, as if reordering.
  const drag = clamp01((t - 0.35) / 0.4);
  return (
    <Frame show={show}>
      <div style={{ position: 'absolute', left: 18, right: 18, top: BAR_H + 16 }}>
        {STEP_NUMBERS.map((n, i) => {
          const rp = clamp01(t * 5 - i * 0.7);
          const dragged = i === 1;
          return (
            <div
              key={i}
              style={{
                height: 56,
                marginBottom: 10,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0 14px',
                borderRadius: RADIUS.sm,
                border: `2px solid ${alpha(dragged && drag > 0.05 ? C.violet : C.ink500, 0.9)}`,
                background: alpha(dragged && drag > 0.05 ? C.violet : C.ink800, dragged && drag > 0.05 ? 0.25 : 0.95),
                boxShadow: dragged && drag > 0.05 ? `0 10px 24px ${alpha('#000000', 0.5)}` : undefined,
                opacity: rp,
                transform: `translateX(${(1 - rp) * -24 + (dragged ? drag * 22 : 0)}px) translateY(${dragged ? drag * 8 : 0}px)`,
              }}
            >
              <span style={{ width: 36, height: 36, borderRadius: 18, background: alpha(C.violet, 0.3), border: `2px solid ${alpha(C.violet, 0.8)}`, display: 'grid', placeItems: 'center', fontFamily: FONT.mono, fontSize: 24, fontWeight: 800, color: C.textStrong }}>{n}</span>
              {bar(150 + ((i * 37) % 60))}
              <div style={{ flex: 1 }} />
              <Icon name="layers" size={26} color={alpha(C.muted, 0.9)} strokeWidth={2} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 300 + drag * 22, top: BAR_H + 96 + drag * 8, opacity: clamp01(t * 4) }}>
        <Icon name="cursor" size={44} color={C.textStrong} strokeWidth={2} />
      </div>
    </Frame>
  );
}

export function ClassifyThumb({ show, t }: { show: number; t: number }) {
  const fly = clamp01((t - 0.3) / 0.5);
  const col = (x: number, tone: string, items: number) => (
    <div style={{ position: 'absolute', left: x, top: BAR_H + 18, width: 226, height: THUMB.h - BAR_H - 42, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `3px solid ${alpha(tone, 0.7)}`, background: alpha(tone, 0.07), padding: 12 }}>
      <div style={{ height: 18, width: 110, borderRadius: 9, background: alpha(tone, 0.8), marginBottom: 14 }} />
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} style={{ height: 36, marginBottom: 10, borderRadius: RADIUS.sm, border: `2px solid ${alpha(C.ink500, 0.9)}`, background: alpha(C.ink800, 0.95), display: 'flex', alignItems: 'center', padding: '0 12px', opacity: clamp01(t * 5 - i * 0.7) }}>
          {bar(90 - i * 12, C.ink500, 12)}
        </div>
      ))}
    </div>
  );
  return (
    <Frame show={show}>
      {col(22, C.cyan, 3)}
      {col(THUMB.w - 22 - 226 - 6, C.sky, 2)}
      {/* the chip in flight */}
      <div
        style={{
          position: 'absolute',
          left: mix(40, 296, fly),
          top: mix(BAR_H + 170, BAR_H + 150, fly) - Math.sin(fly * Math.PI) * 26,
          width: 190,
          height: 40,
          boxSizing: 'border-box',
          borderRadius: RADIUS.sm,
          border: `2px solid ${C.violet}`,
          background: alpha(C.violet, 0.35),
          boxShadow: `0 10px 22px ${alpha('#000000', 0.5)}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          opacity: clamp01(t * 4),
        }}
      >
        {bar(100, C.textStrong, 12)}
      </div>
    </Frame>
  );
}
