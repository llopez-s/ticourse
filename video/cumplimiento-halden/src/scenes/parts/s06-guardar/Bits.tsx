import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';

/** A small phone handset-less icon: a handset body with a speaker dot (the claimant's telephone). */
export function PhoneIcon({ size = 34, color = C.cyan }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ display: 'block', flexShrink: 0 }}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.6" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

const DATA_ICON: Record<string, ReactNode> = {
  nombre: <Icon name="user" size={34} color={C.cyan} />,
  teléfono: <PhoneIcon />,
  documento: <Icon name="file" size={34} color={C.cyan} />,
};

/** The claimant's data: name, telephone and document, three rows that light on the voice's words. */
export function DataCard({ rows, on, glow }: { rows: readonly { text: string; on: number }[]; on: number; glow: number }) {
  return (
    <div
      style={{
        width: 400,
        boxSizing: 'border-box',
        padding: '14px 20px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.4 + 0.5 * glow)}`,
        background: alpha(C.cyan, 0.05 + 0.07 * glow),
        boxShadow: glow > 0.05 ? `0 0 ${Math.round(26 * glow)}px ${alpha(C.cyan, 0.24 * glow)}` : undefined,
        fontFamily: FONT.sans,
        opacity: on,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {rows.map((r) => (
        <div key={r.text} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 750, color: r.on > 0.4 ? C.textStrong : C.text, opacity: 0.35 + 0.65 * r.on }}>
          {DATA_ICON[r.text]}
          {r.text}
        </div>
      ))}
    </div>
  );
}

/** The person the data belongs to: a plain silhouette (no face, no name). */
export function Person({ width = 110, glow = 0 }: { width?: number; glow?: number }) {
  const h = (width * 118) / 120;
  return (
    <svg width={width} height={h} viewBox="0 0 120 118" fill="none" style={{ display: 'block', overflow: 'visible', filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(16 * glow)}px ${alpha(C.sky, 0.45 * glow)})` : undefined }}>
      <circle cx={60} cy={34} r={26} fill={alpha(C.sky, 0.12)} stroke={alpha(C.sky, 0.9)} strokeWidth={4.5} />
      <path d="M12 114 C12 76 36 64 60 64 C84 64 108 76 108 114 Z" fill={alpha(C.sky, 0.1)} stroke={alpha(C.sky, 0.9)} strokeWidth={4.5} strokeLinejoin="round" />
    </svg>
  );
}

export const PLACE_W = 620;
export const PLACE_H = 138;

/** One of the three places where the claimant's data lives. `on` lights it; `erase` shows the «se borra» badge; `ring` marks the copy. */
export function PlaceCard({ icon, title, sub, on, erase, ring }: { icon: IconName; title: string; sub?: string; on: number; erase: number; ring: number }) {
  const o = clamp01(on);
  const e = clamp01(erase);
  const r = clamp01(ring);
  return (
    <div
      style={{
        position: 'relative',
        width: PLACE_W,
        height: PLACE_H,
        boxSizing: 'border-box',
        padding: '0 26px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(e > 0.5 ? C.emerald : C.cyan, 0.35 + 0.55 * Math.max(o, r))}`,
        background: alpha(e > 0.5 ? C.emerald : C.cyan, 0.05 + 0.07 * Math.max(o, r)),
        boxShadow: Math.max(o, r) > 0.05 ? `0 0 ${Math.round(28 * Math.max(o, r))}px ${alpha(e > 0.5 ? C.emerald : C.cyan, 0.26 * Math.max(o, r))}` : undefined,
        fontFamily: FONT.sans,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          background: alpha(C.cyan, 0.1 + 0.1 * o),
          border: `3px solid ${alpha(C.cyan, 0.5 + 0.4 * o)}`,
        }}
      >
        <Icon name={icon} size={40} color={C.cyan} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.1 }}>{title}</div>
        {sub ? <div style={{ marginTop: 6, fontSize: 28, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>{sub}</div> : null}
      </div>
      {e > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            right: 22,
            top: -20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            height: 42,
            padding: '0 16px 0 12px',
            boxSizing: 'border-box',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.emerald, 0.9)}`,
            background: C.ink900,
            fontSize: 28,
            fontWeight: 800,
            color: '#6ee7b7',
            whiteSpace: 'nowrap',
            opacity: e,
            transform: `scale(${0.8 + 0.2 * e})`,
          }}
        >
          <Icon name="check" size={26} color={C.emerald} strokeWidth={2.6} />
          se borra
        </div>
      ) : null}
      {r > 0.02 ? (
        <div style={{ position: 'absolute', inset: -9, borderRadius: RADIUS.lg + 8, border: `3px solid ${alpha(C.emerald, 0.8 * r)}`, boxShadow: `0 0 ${Math.round(24 * r)}px ${alpha(C.emerald, 0.4 * r)}` }} />
      ) : null}
    </div>
  );
}

/** A block of the right-hand stack: a violet exam term, and its detail that opens and closes with `open` (0–1). */
export function StackBlock({ term, open, show, detailH, children }: { term: string; open: number; show: number; detailH: number; children: ReactNode }) {
  const s = clamp01(show);
  const o = clamp01(open);
  if (s <= 0.01) return null;
  return (
    <div style={{ opacity: s * (0.55 + 0.45 * o), transform: `translateY(${(1 - s) * 12}px)`, fontFamily: FONT.sans }}>
      <HeaderSlot term={term} lit={o} />
      <div style={{ height: o * (14 + detailH), overflow: 'hidden' }}>
        <div style={{ paddingTop: 14, height: detailH + 14, opacity: o }}>{children}</div>
      </div>
    </div>
  );
}

function HeaderSlot({ term, lit }: { term: string; lit: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: 58,
        padding: '0 28px 0 20px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.violet, 0.4 + 0.5 * lit)}`,
        background: alpha(C.violet, 0.06 + 0.12 * lit),
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.violet, 0.3 * lit)}` : undefined,
        fontSize: 36,
        fontWeight: 850,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="mortarboard" size={34} color={C.violet} />
      {term}
    </div>
  );
}
