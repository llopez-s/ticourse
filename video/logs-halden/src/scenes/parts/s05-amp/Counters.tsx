import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { fmtInt } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { COUNTERS } from '../../../data/s05-amp';

export const COUNTERS_W = 790;

function Card({ show, glow, tone, icon, children }: { show: number; glow: number; tone: string; icon: IconName; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        width: COUNTERS_W,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '20px 28px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.3 + 0.55 * glow)}`,
        background: `linear-gradient(90deg, ${alpha(tone, 0.06 + 0.1 * glow)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
        boxShadow: `0 20px 44px ${alpha('#000000', 0.35)}${glow > 0 ? `, 0 0 ${28 * glow}px ${alpha(tone, 0.22 * glow)}` : ''}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateX(${(1 - show) * 24}px)`,
      }}
    >
      <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 16, display: 'grid', placeItems: 'center', background: alpha(tone, 0.12), border: `2px solid ${alpha(tone, 0.5)}` }}>
        <Icon name={icon} size={38} color={tone} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>{children}</div>
    </div>
  );
}

/**
 * The three readings of s05: «orígenes distintos: 340» (counts up), the link meter
 * «enlace de 1 Gb/s · 100 %» (fills, rose when full) and «consultas DNS del portal a esos
 * servidores: 0». Each input is 0–1; `count` drives the number, `fill` the meter.
 */
export function Counters({
  sources,
  count,
  link,
  fill,
  asked,
}: {
  sources: number;
  count: number;
  link: number;
  fill: number;
  asked: number;
}) {
  const full = clamp01((fill - 0.97) / 0.03);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {sources > 0 ? (
        <Card show={sources} glow={sources} tone={C.rose} icon="users">
          <span style={{ fontSize: 36, fontWeight: 700, color: C.text }}>{COUNTERS.sources.lead} </span>
          <span style={{ fontSize: 72, fontWeight: 850, color: '#fecdd3', fontVariantNumeric: 'tabular-nums', letterSpacing: -1, verticalAlign: '-6px' }}>
            {fmtInt(COUNTERS.sources.value * count)}
          </span>
        </Card>
      ) : null}
      {link > 0 ? (
        <Card show={link} glow={full} tone={C.rose} icon="network">
          <div style={{ fontSize: 36, fontWeight: 700, color: C.text }}>
            {COUNTERS.link.lead}
            <span style={{ color: C.faint }}>{COUNTERS.link.sep}</span>
            <span style={{ fontWeight: 850, color: full > 0.5 ? '#fecdd3' : C.muted, opacity: 0.35 + 0.65 * full }}>{COUNTERS.link.value}</span>
          </div>
          <div style={{ marginTop: 12, height: 30, borderRadius: 15, background: C.ink800, border: `2px solid ${C.ink700}`, overflow: 'hidden' }}>
            <div
              style={{
                width: `${100 * clamp01(fill)}%`,
                height: '100%',
                borderRadius: 15,
                background: `linear-gradient(90deg, ${alpha(C.amber, 0.85)} 0%, ${C.rose} 70%)`,
                boxShadow: full > 0 ? `0 0 18px ${alpha(C.rose, 0.6 * full)}` : undefined,
              }}
            />
          </div>
        </Card>
      ) : null}
      {asked > 0 ? (
        <Card show={asked} glow={asked} tone={C.cyan} icon="search">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ fontSize: 34, fontWeight: 700, color: C.text, lineHeight: 1.2, whiteSpace: 'normal', width: 460 }}>{COUNTERS.asked.lead}</span>
            <span style={{ fontSize: 80, fontWeight: 850, color: C.cyanSoft, lineHeight: 1 }}>{COUNTERS.asked.value}</span>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
