import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle } from '../../../../../engine/src/ui';

/**
 * Small pieces of s05-jump «Una sola puerta». The management zone is the
 * shared ZoneBox and the counter icon the shared ServiceCounter; these are the
 * tiles, the jump server box, the two choice buttons and the term tag.
 * Nothing positions itself.
 */

/** Today's rule as a strip: a firewall icon + the rule in words. */
export function RuleStrip({ show, text }: { show: number; text: string }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: '10px 26px 10px 18px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.amber, 0.6)}`,
        background: alpha(C.ink900, 0.95),
        fontFamily: FONT.sans,
        fontSize: 38,
        fontWeight: 780,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateY(${(1 - p) * -10}px)`,
      }}
    >
      <Icon name="firewall" size={40} color={C.amber} strokeWidth={2} />
      {text}
    </div>
  );
}

/** Dashed frame of today's VLAN with its name (not a plan zone). */
export function GroupFrame({ width, height, label, show }: { width: number; height: number; label: string; show: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'relative', width, height, opacity: p }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.muted, 0.6)}`, background: alpha(C.ink850, 0.55) }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 14, textAlign: 'center', fontFamily: FONT.sans, fontSize: 36, fontWeight: 820, color: C.text, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

export const WS_TILE = { w: 88, h: 64 } as const;

/** An unnamed workstation (icon only). */
export function WorkstationTile({ show, glow = 0 }: { show: number; glow?: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        width: WS_TILE.w,
        height: WS_TILE.h,
        boxSizing: 'border-box',
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        border: `2px solid ${alpha(C.muted, 0.7)}`,
        background: alpha(C.muted, 0.12),
        boxShadow: g > 0.01 ? `0 0 ${Math.round(16 * g)}px ${alpha(C.amber, 0.45 * g)}` : undefined,
        opacity: p,
        transform: `scale(${0.85 + 0.15 * p})`,
      }}
    >
      <Icon name="desktop" size={42} color="#cbd5e1" strokeWidth={2} />
    </div>
  );
}

export const DEVICE_TILE = 100;

/** A management interface: a switch's or a firewall's controls. */
export function DeviceTile({ kind, show }: { kind: 'switch' | 'firewall'; show: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        width: DEVICE_TILE,
        height: DEVICE_TILE,
        boxSizing: 'border-box',
        borderRadius: 16,
        display: 'grid',
        placeItems: 'center',
        border: `3px solid ${alpha(C.sky, 0.75)}`,
        background: alpha(C.sky, 0.12),
        opacity: p,
        transform: `scale(${0.85 + 0.15 * p})`,
      }}
    >
      <Icon name={kind === 'switch' ? 'network' : 'firewall'} size={56} color="#7dd3fc" strokeWidth={1.9} />
    </div>
  );
}

export const JUMP_BOX = { w: 640, h: 150 } as const;

/**
 * The jump server box as the plan draws it (blueprint cyan): a server icon and
 * «endurecido · MFA · sesión grabada», each property shown by its own weight
 * (`items[i]` appears with `parts[i]`). No name on it (the term comes later).
 */
export function JumpBox({ show, items, parts, glow = 0 }: { show: number; items: readonly string[]; parts: readonly number[]; glow?: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'relative',
        width: JUMP_BOX.w,
        height: JUMP_BOX.h,
        boxSizing: 'border-box',
        borderRadius: 20,
        border: `3px solid ${C.cyan}`,
        // Opaque: the lines it will gather run behind it
        background: `linear-gradient(180deg, ${alpha(C.cyanDeep, 0.5)} 0%, ${alpha(C.ink900, 0.96)} 100%), ${C.ink900}`,
        boxShadow: `0 0 ${Math.round(14 + 26 * g)}px ${alpha(C.cyan, 0.22 + 0.4 * g)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontFamily: FONT.sans,
        opacity: p,
        transform: `scale(${0.9 + 0.1 * p})`,
      }}
    >
      <Icon name="server" size={52} color={C.cyanSoft} strokeWidth={1.9} />
      <div style={{ display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap', fontSize: 32, fontWeight: 800, color: C.textStrong }}>
        {items.map((it, i) => {
          const k = clamp01(parts[i] ?? 0);
          return (
            <span key={it} style={{ opacity: k, transform: `translateY(${(1 - k) * 6}px)`, display: 'inline-block' }}>
              {i > 0 ? <span style={{ color: C.muted, padding: '0 10px' }}>·</span> : null}
              {it}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export const CHOICE = { w: 230, h: 80 } as const;

/**
 * One option of the think prompt. Neutral until the answer: both options look
 * exactly alike (`glow` lights both the same). `chosen` 0–1 turns it emerald
 * with a check; `struck` 0–1 crosses it out in rose and steps it back.
 */
export function ChoiceButton({ label, show, chosen = 0, struck = 0, glow = 0 }: { label: string; show: number; chosen?: number; struck?: number; glow?: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const c = clamp01(chosen);
  const k = clamp01(struck);
  const g = clamp01(glow);
  const edge = c > 0.01 ? C.emerald : C.cyan;
  return (
    <div style={{ position: 'relative', width: CHOICE.w, height: CHOICE.h, transform: `translateY(${(1 - p) * 12}px) scale(${1 + 0.05 * c})`, ...dimStyle(0.8 * k, p) }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `3px solid ${alpha(edge, 0.65 + 0.35 * Math.max(c, g))}`,
          background: c > 0.01 ? `linear-gradient(180deg, ${alpha(C.emerald, 0.24 * c)} 0%, ${C.ink900} 100%)` : C.ink900,
          boxShadow: `0 0 ${Math.round(8 + 22 * Math.max(g, c))}px ${alpha(edge, 0.15 + 0.3 * Math.max(g, c))}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 850,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        {c > 0.01 ? (
          <span style={{ opacity: c, display: 'inline-flex' }}>
            <Icon name="check" size={38} color={C.emerald} strokeWidth={3} />
          </span>
        ) : null}
        {label}
      </div>
      {k > 0.01 ? (
        <svg width={CHOICE.w + 20} height={CHOICE.h} style={{ position: 'absolute', left: -10, top: 0, overflow: 'visible' }}>
          <line x1={0} y1={CHOICE.h / 2 + 6} x2={(CHOICE.w + 20) * k} y2={CHOICE.h / 2 - 6} stroke={C.rose} strokeWidth={7} strokeLinecap="round" />
        </svg>
      ) : null}
    </div>
  );
}

/** The exam term (violet, like the exam card): big term, its other names under it. */
export function TermTag({ show, term, sub, subShow = 1, dim = 0, style }: { show: number; term: ReactNode; sub?: ReactNode; subShow?: number; dim?: number; style?: CSSProperties }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const sp = clamp01(subShow);
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        padding: '14px 28px 16px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 34px ${alpha(C.violet, 0.24)}`,
        fontFamily: FONT.sans,
        transform: `translateY(${(1 - p) * 14}px) scale(${0.94 + 0.06 * p})`,
        ...dimStyle(dim, p),
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
        <Icon name="mortarboard" size={50} color={C.violet} />
        <span style={{ fontSize: 60, fontWeight: 880, letterSpacing: 0.5, color: '#c4b5fd' }}>{term}</span>
      </div>
      {sub && sp > 0.001 ? (
        <div style={{ fontSize: 38, fontWeight: 760, color: C.text, whiteSpace: 'nowrap', opacity: sp, transform: `translateY(${(1 - sp) * 6}px)` }}>{sub}</div>
      ) : null}
    </div>
  );
}
