import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * Faceless silhouettes: the group members of s03 and the whole port of the «escritura para todos» option. No name, no
 * gender, no face. «Tú» is never a silhouette: it is the AccountCard.
 */

/** One silhouette (head + shoulders) in a 60×70 box scaled to `size` wide. */
export function Person({ size = 80, tone = C.cyan, fill = 0.22, style }: { size?: number; tone?: string; fill?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={(size * 70) / 60} viewBox="0 0 60 70" style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden>
      <circle cx={30} cy={18} r={13} fill={alpha(tone, fill)} stroke={tone} strokeWidth={3} />
      <path d="M6 68 C6 45 17 36 30 36 C43 36 54 45 54 68 Z" fill={alpha(tone, fill)} stroke={tone} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

/** A hand-drawn pencil (the icon set has none): `size` px square, 24-unit grid like Icon. */
export function Pencil({ size = 64, color = C.amber, strokeWidth = 1.8 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }} aria-hidden>
      <path d="M4 20l1.1-4.6L16.6 3.9a1.9 1.9 0 0 1 2.7 0l.8.8a1.9 1.9 0 0 1 0 2.7L8.6 18.9 4 20Z" />
      <path d="M14.6 5.9l3.5 3.5M5.1 15.4l3.5 3.5" />
    </svg>
  );
}

/**
 * The group card: «grupo Mantenimiento» with its members as silhouettes and (optionally) one empty dashed slot.
 * `slot.fill` 0–1 drops the account's tile into the slot (cyan, key); `slot.label` is the caption under it.
 * `show` 0–1 draws the members one by one.
 */
export function GroupCard({
  title,
  members = 5,
  slot,
  width = 840,
  show = 1,
  glow = 0,
}: {
  title: string;
  members?: number;
  slot?: { label: string; fill: number; labelTone?: string; show?: number };
  width?: number;
  show?: number;
  glow?: number;
}) {
  const s = clamp01(show);
  const g = clamp01(glow);
  const cols = members + (slot ? 1 : 0);
  const cell = Math.min(128, Math.floor((width - 64) / cols));
  const fill = clamp01(slot?.fill ?? 0);
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: slot ? '22px 32px 62px' : '22px 32px 22px',
        position: 'relative',
        borderRadius: RADIUS.lg,
        background: alpha(C.ink850, 0.92),
        border: `3px solid ${alpha(C.cyan, 0.35 + 0.5 * g)}`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(C.cyan, 0.3 * g)}` : undefined,
        fontFamily: FONT.sans,
        opacity: s,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 40, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <Icon name="users" size={44} color={C.cyan} />
        {title}
      </div>
      <div style={{ display: 'flex', gap: 0, marginTop: 20, alignItems: 'flex-start' }}>
        {Array.from({ length: members }, (_, i) => {
          const o = clamp01(s * members - i);
          return (
            <div key={i} style={{ width: cell, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}>
              <Person size={Math.round(cell * 0.62)} />
            </div>
          );
        })}
        {slot ? (
          <div style={{ width: cell, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: clamp01(slot.show ?? 1) }}>
            <div
              style={{
                width: Math.round(cell * 0.8),
                height: Math.round(cell * 0.8),
                borderRadius: 18,
                boxSizing: 'border-box',
                border: `3px ${fill > 0.5 ? 'solid' : 'dashed'} ${fill > 0.5 ? C.cyan : alpha(C.amber, 0.8)}`,
                background: alpha(C.cyan, 0.18 * fill),
                display: 'grid',
                placeItems: 'center',
                boxShadow: fill > 0.5 ? `0 0 26px ${alpha(C.cyan, 0.4)}` : undefined,
              }}
            >
              {fill > 0.05 ? <Icon name="key" size={Math.round(cell * 0.46)} color={C.cyan} strokeWidth={2.2} style={{ opacity: fill }} /> : null}
            </div>
          </div>
        ) : null}
      </div>
      {slot ? (
        <div
          style={{
            position: 'absolute',
            right: 32,
            bottom: 14,
            textAlign: 'right',
            opacity: clamp01(slot.show ?? 1),
            fontSize: 32,
            fontWeight: 750,
            color: slot.labelTone ?? (fill > 0.5 ? C.cyanSoft : C.amber),
            whiteSpace: 'nowrap',
          }}
        >
          {slot.label}
        </div>
      ) : null}
    </div>
  );
}

/**
 * «Todo el puerto» as a crowd of silhouettes (amber = excess). `reveal` 0–1 pops them in by index; `pencil` 0–1 lays a big
 * pencil over the crowd.
 */
export function Crowd({ cols = 9, rows = 4, size = 84, reveal = 1, pencil = 0, tone = C.amber }: { cols?: number; rows?: number; size?: number; reveal?: number; pencil?: number; tone?: string }) {
  const gap = 18;
  const w = cols * size + (cols - 1) * gap;
  const h = rows * ((size * 70) / 60) + (rows - 1) * gap;
  const total = cols * rows;
  const p = clamp01(pencil);
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap }}>
        {Array.from({ length: total }, (_, i) => {
          const o = clamp01(reveal * (total + 8) - i);
          return <Person key={i} size={size} tone={tone} fill={0.2} style={{ opacity: o, transform: `scale(${0.7 + 0.3 * o})` }} />;
        })}
      </div>
      {p > 0.01 ? (
        <div style={{ position: 'absolute', left: w / 2 - 110, top: h / 2 - 110, opacity: p, transform: `rotate(${(1 - p) * 25}deg) scale(${0.8 + 0.2 * p})` }}>
          <div style={{ width: 220, height: 220, borderRadius: 110, display: 'grid', placeItems: 'center', background: alpha(C.ink950, 0.82), border: `4px solid ${tone}`, boxShadow: `0 0 40px ${alpha(tone, 0.4)}` }}>
            <Pencil size={140} color={tone} strokeWidth={1.7} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
