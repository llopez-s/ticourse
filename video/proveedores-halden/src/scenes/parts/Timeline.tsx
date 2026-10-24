import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { ContractPage } from './Art';

/**
 * The timeline of the video in small: a rail with the signed contract in the middle, «due diligence» before it and
 * «vendor monitoring» after it. s05 brings it back in one line with the mark «aquí» after the signature; s08's second
 * rule uses it without labels as its icon.
 */
export const MINI_H = 134;

export function MiniTimeline({ width = 1100, labels = true, here = 0, glow = 0 }: { width?: number; labels?: boolean; /** 0–1: the mark «aquí» after the signature. */ here?: number; /** 0–1: brightens the right half (vendor monitoring). */ glow?: number }) {
  const h = clamp01(here);
  const g = clamp01(glow);
  const cx = width / 2;
  const railY = 80;
  const markX = cx + Math.min(250, width * 0.24);
  return (
    <div style={{ position: 'relative', width, height: MINI_H, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: railY - 3, width: cx - 50, height: 6, borderRadius: 3, background: alpha(C.cyan, 0.55) }} />
      <div style={{ position: 'absolute', left: cx + 50, top: railY - 3, width: width - cx - 62, height: 6, borderRadius: 3, background: alpha(C.emerald, 0.55 + 0.4 * g), boxShadow: g > 0.05 ? `0 0 ${Math.round(14 * g)}px ${alpha(C.emerald, 0.5 * g)}` : undefined }} />
      <svg width={26} height={26} viewBox="0 0 26 26" style={{ position: 'absolute', left: width - 26, top: railY - 13 }}>
        <path d="M 4 3 L 22 13 L 4 23 Z" fill={alpha(C.emerald, 0.55 + 0.4 * g)} />
      </svg>
      <div style={{ position: 'absolute', left: cx - 39, top: 28, opacity: 1 }}>
        <ContractPage width={78} rows={3} sign={1} pen={false} />
      </div>
      {labels ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: railY + 14, width: cx - 60, textAlign: 'right', fontSize: 36, fontWeight: 800, color: C.muted, whiteSpace: 'nowrap' }}>due diligence</div>
          <div style={{ position: 'absolute', left: cx + 60, top: railY + 14, fontSize: 36, fontWeight: 800, color: C.emerald, whiteSpace: 'nowrap' }}>vendor monitoring</div>
        </>
      ) : null}
      {h > 0.02 ? (
        <div style={{ position: 'absolute', left: markX - 70, top: 0, width: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: h, transform: `translateY(${(1 - h) * -14}px)` }}>
          <div
            style={{
              height: 48,
              padding: '0 24px',
              borderRadius: RADIUS.pill,
              border: `3px solid ${C.amber}`,
              background: alpha(C.amber, 0.16),
              boxShadow: `0 0 18px ${alpha(C.amber, 0.35)}`,
              display: 'flex',
              alignItems: 'center',
              fontSize: 36,
              fontWeight: 900,
              color: C.amber,
              whiteSpace: 'nowrap',
            }}
          >
            aquí
          </div>
          <svg width={24} height={20} viewBox="0 0 24 20">
            <path d="M 2 2 L 12 18 L 22 2 Z" fill={C.amber} />
          </svg>
        </div>
      ) : null}
    </div>
  );
}
