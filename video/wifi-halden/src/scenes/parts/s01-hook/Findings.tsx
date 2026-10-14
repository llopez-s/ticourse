import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { SHARED_KEY, SIGNAL } from '../../../data/s01-hook';

/**
 * The audit's two findings (s01-01), one card each. Amber: a finding, nobody's fault («creció
 * así»), never rose. The cards carry the canon strings split into lines; nothing else is written.
 */
export const FINDING = { w: 590, h: 260 } as const;

/** Amber's soft tone for text (not LAMP: that warm white is the floodlight's light only). */
const AMBER_SOFT = '#fcd34d';

function Shell({ lit, children }: { lit: number; children: ReactNode }) {
  const l = clamp01(lit);
  return (
    <div
      style={{
        width: FINDING.w,
        height: FINDING.h,
        boxSizing: 'border-box',
        padding: '20px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 10,
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.amber, 0.5 + 0.4 * l)}`,
        background: `linear-gradient(180deg, ${alpha(C.amber, 0.07 + 0.07 * l)} 0%, ${alpha(C.ink900, 0.94)} 100%)`,
        boxShadow: l > 0.02 ? `0 0 ${Math.round(30 * l)}px ${alpha(C.amber, 0.22 * l)}` : undefined,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

/** Finding 1: the signal past the boundary (arcs that cross a dashed line) and its reading. */
export function SignalCard({ lit = 0 }: { lit?: number }) {
  return (
    <Shell lit={lit}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <svg width={168} height={96} viewBox="0 0 168 96" style={{ display: 'block', flexShrink: 0 }}>
          {/* the source, the boundary, and what crosses it */}
          <circle cx={16} cy={48} r={9} fill={C.sky} />
          {[34, 60].map((r) => (
            <path key={r} d={arc(16, 48, r)} fill="none" stroke={alpha(C.sky, 0.85)} strokeWidth={6} strokeLinecap="round" />
          ))}
          <line x1={92} y1={2} x2={92} y2={94} stroke={C.muted} strokeWidth={4} strokeLinecap="round" strokeDasharray="3 10" />
          {[102, 130].map((r) => (
            <path key={r} d={arc(16, 48, r)} fill="none" stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
          ))}
        </svg>
        <span style={{ fontFamily: FONT.mono, fontSize: 62, fontWeight: 800, letterSpacing: -1, color: C.amber }}>{SIGNAL.value}</span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 750, lineHeight: 1.2, color: C.textStrong }}>
        {SIGNAL.lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </Shell>
  );
}

/** An arc of signal to the right of (cx, cy), ±30°. */
function arc(cx: number, cy: number, r: number): string {
  const a = (30 * Math.PI) / 180;
  const dx = Math.cos(a) * r;
  const dy = Math.sin(a) * r;
  return `M ${cx + dx} ${cy - dy} A ${r} ${r} 0 0 1 ${cx + dx} ${cy + dy}`;
}

/**
 * Finding 2: the network, its protocol, who knows the key and since when.
 * `said` 0–1 per text block: [«una clave que sabe toda la terminal», «sin cambiar desde 2022»].
 */
export function KeyCard({ lit = 0, said }: { lit?: number; said: [number, number] }) {
  const who = clamp01(said[0]);
  const since = clamp01(said[1]);
  return (
    <Shell lit={lit}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, letterSpacing: 0.5, color: C.cyanSoft }}>{SHARED_KEY.network}</span>
        <span
          style={{
            padding: '2px 14px 4px',
            borderRadius: RADIUS.sm,
            border: `2px solid ${alpha(C.violet, 0.8)}`,
            background: alpha(C.violet, 0.14),
            fontFamily: FONT.mono,
            fontSize: 34,
            fontWeight: 800,
            color: '#c4b5fd',
          }}
        >
          {SHARED_KEY.proto}
        </span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 750, lineHeight: 1.2, color: alpha(C.textStrong, 0.5 + 0.5 * who) }}>
        {SHARED_KEY.lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.4 + 0.6 * since }}>
        <Icon name="clock" size={36} color={C.amber} strokeWidth={2.2} />
        <span style={{ fontSize: 38, fontWeight: 800, color: AMBER_SOFT }}>{SHARED_KEY.since}</span>
      </div>
    </Shell>
  );
}
