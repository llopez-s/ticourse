import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle } from '../../../../../engine/src/ui';
import { INK, PersonBust, dropGlow, joinFilters } from '../glyphs';
import { Launch } from '../Sites';

/**
 * Small pieces of s05-sedes «Un pasillo y una lancha». The sites, the corridor and the launch are the
 * shared `Sites` / `Launch`; these are the date stamp (V16's look), the laptop with its client before it
 * becomes the launch, and the two exam names with a small copy of their image. Nothing positions itself.
 */

const Dot = () => <span style={{ fontWeight: 700, color: C.faint }}>·</span>;

/** The day, V16's stamp: clock, mono day, weekday, what you do. */
export function DateStamp({ day, weekday, what, show }: { day: string; weekday: string; what: string; show: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: 64,
        padding: '0 28px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.cyan, 0.1),
        fontFamily: FONT.sans,
        fontSize: 36,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateY(${(1 - p) * -10}px)`,
      }}
    >
      <Icon name="clock" size={36} color={C.cyan} />
      <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{day}</span>
      <Dot />
      <span style={{ fontWeight: 750, color: C.textStrong }}>{weekday}</span>
      <Dot />
      <span style={{ fontWeight: 750, color: C.textStrong }}>{what}</span>
    </div>
  );
}

/** One person with a laptop and its client program (before it becomes the launch). */
export function ClientLaptop({ show, client, glow = 0, label }: { show: number; client: number; glow?: number; label: string }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const c = clamp01(client);
  return (
    <div style={{ position: 'relative', width: 196, height: 128, opacity: p, transform: `scale(${0.9 + 0.1 * p})`, transformOrigin: '50% 100%' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 196,
          height: 128,
          boxSizing: 'border-box',
          borderRadius: 22,
          border: `3px solid ${alpha(C.cyan, 0.85)}`,
          background: C.ink900,
          boxShadow: `inset 0 0 0 999px ${alpha(C.cyan, 0.06)}`,
          filter: joinFilters(dropGlow(C.cyan, clamp01(glow))),
        }}
      >
        <svg width={196} height={128} viewBox="0 0 196 128" style={{ position: 'absolute', left: 0, top: 0 }}>
          <PersonBust x={58} y={50} scale={1.05} color={INK.person} strokeWidth={3.4} />
        </svg>
        <div style={{ position: 'absolute', left: 94, top: 24 }}>
          <Icon name="laptop" size={80} color={c > 0.5 ? C.cyanSoft : C.cyan} strokeWidth={2} />
        </div>
      </div>
      {c > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 134,
            top: -30,
            transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * c})`,
            opacity: c,
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 32,
            lineHeight: 1,
            color: C.cyanSoft,
            background: C.ink900,
            border: `3px solid ${C.cyan}`,
            borderRadius: 999,
            padding: '6px 16px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}

/** A small copy of the covered corridor: two buildings, the street, the ribbed walkway across it. */
export function MiniCorridor({ width = 96 }: { width?: number }) {
  const h = width * 0.58;
  return (
    <svg width={width} height={h} viewBox="0 0 96 56" style={{ display: 'block' }}>
      <rect x={36} y={0} width={24} height={56} fill={C.ink900} />
      <path d="M 36 0 L 36 56 M 60 0 L 60 56" stroke={INK.struct} strokeWidth={2} />
      <rect x={2} y={8} width={34} height={40} rx={5} fill={C.ink850} stroke={C.cyan} strokeWidth={2.6} />
      <rect x={60} y={8} width={34} height={40} rx={5} fill={C.ink850} stroke={C.cyan} strokeWidth={2.6} />
      <rect x={34} y={22} width={28} height={12} fill={alpha(C.cyan, 0.25)} />
      <path d="M 34 22 L 62 22 M 34 34 L 62 34" stroke={C.cyan} strokeWidth={2.6} />
      <path d="M 41 23 L 41 33 M 48 23 L 48 33 M 55 23 L 55 33" stroke={alpha(C.cyan, 0.6)} strokeWidth={1.6} />
    </svg>
  );
}

/** A small copy of the launch (no tag text). */
export function MiniLaunch({ width = 104 }: { width?: number }) {
  return <Launch width={width} tag={false} water />;
}

/** An exam name (violet, like the exam card) with a small copy of its image. */
export function TermTag({ term, art, show, glow = 0, dim = 0 }: { term: string; art?: ReactNode; show: number; glow?: number; dim?: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        height: 84,
        padding: '0 26px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2.5px solid ${alpha(C.violet, 0.65 + 0.3 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.16 + 0.08 * g)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 ${20 + 24 * g}px ${alpha(C.violet, 0.2 + 0.25 * g)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        transform: `translateY(${(1 - p) * 12}px) scale(${0.94 + 0.06 * p})`,
        ...dimStyle(dim, p),
      }}
    >
      {art}
      <Icon name="mortarboard" size={42} color={C.violet} />
      <span style={{ fontSize: 48, fontWeight: 880, letterSpacing: 0.4, color: INK.violetSoft }}>{term}</span>
    </div>
  );
}
