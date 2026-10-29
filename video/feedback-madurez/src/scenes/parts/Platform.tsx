import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';
import { S05_FLEET, S05_TIP } from '../../data/s05-plataforma';
import { Bus } from './Figures';
import { Neighbourhoods } from './Neighbourhoods';
import { hash01 } from './timing';

export const FLEET_W = 840;
export const FLEET_H = 400;

/**
 * A fleet parked in the depot: a dozen buses, the district map behind it with
 * not a single line drawn on it. «flota sin líneas».
 */
export function Fleet({ frame, at }: { frame: number; at: number }) {
  const cols = 4;
  const rows = 3;
  const bw = 170;
  return (
    <div style={{ position: 'relative', width: FLEET_W, height: FLEET_H, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 28, border: `2px dashed ${C.ink500}`, background: alpha(C.ink900, 0.7), opacity: progress(frame, at - 6, 16) }} />
      <div style={{ position: 'absolute', left: 24, top: 24, opacity: 0.5 * progress(frame, at - 6, 16) }}>
        <Neighbourhoods width={FLEET_W - 48} height={FLEET_H - 48} cols={4} rows={2} gutter={20} seed={7} />
      </div>
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const p = progress(frame, at + 4 + (i % cols) * 3 + r * 7, 14);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 58 + c * (bw + 14),
              top: 104 + r * 88 + hash01(i + 40) * 5,
              opacity: p,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            <Bus width={bw} tone={C.cyan} />
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, top: 26, width: FLEET_W, display: 'flex', justifyContent: 'center', ...enter(frame, at + 6, { distance: 12, duration: 14 }) }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            height: 62,
            padding: '0 28px 0 20px',
            boxSizing: 'border-box',
            borderRadius: RADIUS.pill,
            border: `3px solid ${alpha(C.amber, 0.85)}`,
            background: alpha(C.ink950, 0.92),
            fontSize: 40,
            fontWeight: 850,
            color: '#fde68a',
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="alert" size={38} color={C.amber} />
          {S05_FLEET}
        </span>
      </div>
    </div>
  );
}

export const TIP_W = 840;
export const TIP_H = 400;

/**
 * The platform: a big box full of indicator tiles with no value on them and
 * not one arrow leaving it for a consumer. «amplifica lo que hay · no crea el proceso».
 */
export function TipBox({ frame, at }: { frame: number; at: number }) {
  const cols = 5;
  const rows = 3;
  const open = progress(frame, at - 6, 18);
  return (
    <div
      style={{
        position: 'relative',
        width: TIP_W,
        height: TIP_H,
        boxSizing: 'border-box',
        borderRadius: 28,
        border: `3px solid ${alpha(C.violet, 0.75)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 26px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        opacity: open,
        transform: `translateY(${(1 - open) * 24}px)`,
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', background: alpha(C.violet, 0.16), borderBottom: `2px solid ${alpha(C.violet, 0.4)}`, fontSize: 32, fontWeight: 800, color: '#ddd6fe', whiteSpace: 'nowrap', letterSpacing: -0.3 }}>
        <Icon name="database" size={34} color={C.violet} />
        {S05_TIP.title}
      </div>
      <div style={{ position: 'absolute', left: 28, top: 80, display: 'grid', gridTemplateColumns: `repeat(${cols}, 140px)`, gap: 12 }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const p = progress(frame, at + 6 + i * 2, 12);
          return (
            <div
              key={i}
              style={{
                height: 52,
                boxSizing: 'border-box',
                borderRadius: 12,
                border: `2px solid ${C.ink600}`,
                background: alpha(C.ink800, 0.95),
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 10px',
                opacity: p,
                transform: `scale(${0.85 + 0.15 * p})`,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 7, background: alpha(C.violet, 0.6) }} />
              <div style={{ width: 54 + hash01(i + 3) * 36, height: 12, borderRadius: 6, background: alpha(C.muted, 0.28) }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, borderTop: `2px solid ${alpha(C.violet, 0.3)}`, background: alpha(C.ink950, 0.6), fontSize: 36, fontWeight: 800, color: C.textStrong, opacity: progress(frame, at + 40, 16), whiteSpace: 'nowrap' }}>
        {S05_TIP.note}
      </div>
    </div>
  );
}
