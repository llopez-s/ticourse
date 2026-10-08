import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle } from '../../../../../engine/src/ui';
import { INK, dropGlow, joinFilters } from '../glyphs';

/**
 * Small pieces of s04-eap «Sí, no o cuarentena». The roles, the port and the gate are the shared
 * parts (RoleLanes / SwitchPort / EntranceGate); these are the scene's own labels and tiles.
 * Nothing positions itself.
 */

const Dot = () => <span style={{ color: C.faint, fontWeight: 700 }}> · </span>;

/** The label fixed for the whole scene: «con 802.1X · así será desde el 1-12» (a plan, not today). */
export function RuleLabel({ lead, rest, show = 1 }: { lead: string; rest: string; show?: number }) {
  const p = clamp01(show);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 54,
        padding: '0 22px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2.5px dashed ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.ink900, 0.92),
        fontFamily: FONT.sans,
        fontSize: 32,
        whiteSpace: 'nowrap',
        opacity: p,
      }}
    >
      <Icon name="clock" size={32} color={C.cyan} />
      <span style={{ fontWeight: 820, color: C.cyanSoft }}>{lead}</span>
      <Dot />
      <span style={{ fontWeight: 720, color: C.text }}>{rest}</span>
    </div>
  );
}

/** EAP as a big violet frame (an exam term) with «el marco, no el método» under it. */
export function EapTitle({ term, sub, show, subShow = 1, glow = 0, dim = 0 }: { term: string; sub: string; show: number; subShow?: number; glow?: number; dim?: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const g = clamp01(glow);
  const sp = clamp01(subShow);
  return (
    <div style={{ fontFamily: FONT.sans, transform: `translateY(${(1 - p) * 12}px)`, ...dimStyle(dim, p) }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
          padding: '6px 30px 10px 22px',
          borderRadius: RADIUS.lg,
          border: `4px solid ${C.violet}`,
          background: `linear-gradient(180deg, ${alpha(C.violet, 0.2)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
          boxShadow: `0 0 ${18 + 26 * g}px ${alpha(C.violet, 0.25 + 0.3 * g)}`,
        }}
      >
        <Icon name="mortarboard" size={50} color={C.violet} />
        <span style={{ fontFamily: FONT.mono, fontSize: 80, fontWeight: 850, lineHeight: 1.05, color: INK.violetSoft, letterSpacing: 1 }}>{term}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 40, fontWeight: 780, color: C.textStrong, whiteSpace: 'nowrap', opacity: sp, transform: `translateY(${(1 - sp) * 8}px)` }}>{sub}</div>
    </div>
  );
}

/** One EAP method card: violet term, what it carries, an optional emerald badge («el más fuerte»). */
export function MethodCard({
  term,
  what,
  badge,
  width,
  show,
  badgeShow = 1,
  glow = 0,
  dim = 0,
  style,
}: {
  term: string;
  what: string;
  badge?: string;
  width: number;
  show: number;
  badgeShow?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const g = clamp01(glow);
  const b = clamp01(badgeShow);
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '16px 24px 20px',
        borderRadius: RADIUS.lg,
        border: `2.5px solid ${alpha(C.violet, 0.55 + 0.4 * g)}`,
        background: alpha(C.ink850, 0.96),
        boxShadow: `0 0 ${10 + 30 * g}px ${alpha(C.violet, 0.12 + 0.3 * g)}`,
        fontFamily: FONT.sans,
        transform: `translateX(${(1 - p) * 26}px)`,
        ...dimStyle(dim, p),
        ...style,
      }}
    >
      <div style={{ fontSize: 46, fontWeight: 860, lineHeight: 1.1, color: INK.violetSoft, whiteSpace: 'nowrap', letterSpacing: -0.3 }}>{term}</div>
      <div style={{ marginTop: 8, fontSize: 32, fontWeight: 720, lineHeight: 1.2, color: C.text }}>{what}</div>
      {badge && b > 0.001 ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 14,
            padding: '4px 18px 6px 12px',
            borderRadius: RADIUS.pill,
            border: `2.5px solid ${alpha(C.emerald, 0.8)}`,
            background: alpha(C.emerald, 0.14),
            fontSize: 32,
            fontWeight: 820,
            color: INK.emeraldSoft,
            whiteSpace: 'nowrap',
            opacity: b,
            transform: `scale(${0.85 + 0.15 * b})`,
            transformOrigin: '0 50%',
          }}
        >
          <Icon name="shield" size={30} color={C.emerald} strokeWidth={2.2} />
          {badge}
        </div>
      ) : null}
    </div>
  );
}

/** RADIUS as a tile (server icon) with its name; `tone` turns it emerald (yes) or rose (no). */
export function RadiusTile({ name, size = 96, tone = C.cyan, glow = 0, show = 1 }: { name: string; size?: number; tone?: string; glow?: number; show?: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: p, fontFamily: FONT.sans }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 20,
          display: 'grid',
          placeItems: 'center',
          background: alpha(tone, 0.12 + 0.1 * g),
          border: `3px solid ${alpha(tone, 0.8)}`,
          filter: joinFilters(dropGlow(tone, g)),
        }}
      >
        <Icon name="server" size={Math.round(size * 0.56)} color={tone} strokeWidth={2} />
      </div>
      <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.3 }}>{name}</div>
    </div>
  );
}

/** A laptop tile: cyan for the port's own (registered) device, neutral for one nobody registered. */
export function LaptopTile({ width = 124, tone = C.cyan, glow = 0, show = 1, children }: { width?: number; tone?: string; glow?: number; show?: number; children?: ReactNode }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const h = Math.round(width * 0.8);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        borderRadius: 18,
        display: 'grid',
        placeItems: 'center',
        background: C.ink900,
        border: `3px solid ${alpha(tone, 0.85)}`,
        boxShadow: `inset 0 0 0 999px ${alpha(tone, 0.08)}`,
        opacity: p,
        filter: joinFilters(dropGlow(tone, clamp01(glow))),
      }}
    >
      <Icon name="laptop" size={Math.round(width * 0.56)} color={tone} strokeWidth={2} />
      {children}
    </div>
  );
}

/**
 * The ending of a RADIUS answer, staged with the voice: the exam term (Access-Accept emerald /
 * Access-Reject rose) and the canon caption in two halves (`head` · `rest`).
 */
export function VerdictText({
  kind,
  title,
  head,
  rest,
  titleShow,
  headShow,
  restShow,
  width,
}: {
  kind: 'accept' | 'reject';
  title: string;
  head: string;
  rest: string;
  titleShow: number;
  headShow: number;
  restShow: number;
  width: number;
}) {
  const t = clamp01(titleShow);
  if (t <= 0.001) return null;
  const soft = kind === 'accept' ? INK.emeraldSoft : C.roseSoft;
  const h = clamp01(headShow);
  const r = clamp01(restShow);
  return (
    <div style={{ width, fontFamily: FONT.sans }}>
      <div style={{ fontSize: 54, fontWeight: 870, lineHeight: 1.06, color: soft, letterSpacing: -0.6, whiteSpace: 'nowrap', opacity: t, transform: `translateY(${(1 - t) * 10}px)` }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 36, fontWeight: 760, lineHeight: 1.2, color: C.text }}>
        <span style={{ opacity: h, color: C.textStrong }}>{head}</span>
        <span style={{ opacity: r }}>
          <Dot />
          {rest}
        </span>
      </div>
    </div>
  );
}

/** A wrench (24-unit grid, engine-icon stroke style): «solo para que lo arreglen». */
export function WrenchGlyph({ size = 48, color = C.amber, strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/** The quarantine VLAN: a dashed amber box (not a zone of V16's plan) with its name and a wrench. */
export function QuarantineBox({ label, width, height, show, glow = 0, children }: { label: string; width: number; height: number; show: number; glow?: number; children?: ReactNode }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3.5px dashed ${alpha(C.amber, 0.85)}`,
        background: `linear-gradient(180deg, ${alpha(C.amber, 0.12 + 0.08 * g)} 0%, ${alpha(C.ink900, 0.9)} 100%)`,
        boxShadow: `0 0 ${8 + 26 * g}px ${alpha(C.amber, 0.12 + 0.25 * g)}`,
        fontFamily: FONT.sans,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      <div style={{ position: 'absolute', left: 22, top: 16, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
        <WrenchGlyph size={40} color={C.amber} strokeWidth={2.2} />
        <span style={{ fontSize: 40, fontWeight: 850, color: INK.amberSoft, letterSpacing: -0.4 }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

/**
 * s04-06 — the proposal: «802.1X en los switches de acceso de la planta de oficinas · Infraestructura ·
 * desde el 1-12». Too long for one line at ≥ 32 px, so it breaks at the first « · » (the line break
 * replaces that separator, the parts' convention); the owner and the date stay on the second line.
 */
export function DecisionCard({ what, owner, when, show, dim = 0 }: { what: string; owner: string; when: string; show: number; dim?: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 22,
        padding: '14px 34px 16px 24px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.emerald, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.emerald, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 30px ${alpha(C.emerald, 0.2)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        transform: `translateY(${(1 - p) * 14}px) scale(${0.96 + 0.04 * p})`,
        ...dimStyle(dim, p),
      }}
    >
      <div style={{ width: 64, height: 64, borderRadius: 16, display: 'grid', placeItems: 'center', border: `2.5px solid ${alpha(C.emerald, 0.8)}`, background: alpha(C.emerald, 0.12) }}>
        <Icon name="flag" size={38} color={C.emerald} strokeWidth={2.2} />
      </div>
      <div>
        <div style={{ fontSize: 40, fontWeight: 840, lineHeight: 1.18, color: C.textStrong, letterSpacing: -0.4 }}>{what}</div>
        <div style={{ marginTop: 4, fontSize: 36, fontWeight: 780, lineHeight: 1.18 }}>
          <span style={{ color: INK.emeraldSoft }}>{owner}</span>
          <Dot />
          <span style={{ color: C.cyanSoft }}>{when}</span>
        </div>
      </div>
    </div>
  );
}
