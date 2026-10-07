import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { PEN } from '../Checkpoint';

/**
 * Small pieces of s04-dmz «La ventanilla». The napkin, the checkpoints, the
 * zones and the counter come from the shared parts; these are only the labels
 * and marks the scene lays around them. Nothing positions itself.
 */

/** Paper-and-ink style of the notes stuck on (or next to) the napkin. */
const PAPER = '#fbf8f1';

/**
 * The portal's callout, drawn outside the napkin (the shared one only fits over
 * the drawing): host in mono 42 px + what it is (32 px, two lines). Anchored by
 * the caller (e.g. `transform: translate(-100%, -50%)` for its right-middle).
 */
export function PortalCallout({ show, host, lines, style }: { show: number; host: string; lines: readonly string[]; style?: CSSProperties }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        padding: '14px 24px 16px',
        borderRadius: 8,
        background: PAPER,
        border: `2px solid ${alpha(PEN.ink, 0.5)}`,
        boxShadow: `0 12px 28px ${alpha('#000000', 0.4)}`,
        opacity: p,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <div style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: PEN.ink, lineHeight: 1.1 }}>{host}</div>
      <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, lineHeight: 1.15, color: alpha(PEN.ink, 0.85) }}>
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
}

/**
 * Header of the inbound rule: which device carries it. The host sits on the
 * same highlighter yellow that marks `fw-perimetro-01` on the napkin.
 */
export function RuleHeader({ show, host, what }: { show: number; host: string; what: string }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateY(${(1 - p) * 8}px)`, whiteSpace: 'nowrap' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '6px 18px 6px 12px',
          borderRadius: RADIUS.sm,
          background: alpha('#facc15', 0.2),
          border: `2px solid ${alpha('#facc15', 0.75)}`,
        }}
      >
        <Icon name="firewall" size={36} color="#fde68a" strokeWidth={2} />
        <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: '#fef3c7' }}>{host}</span>
      </div>
      <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: C.text }}>{what}</span>
    </div>
  );
}

/** A note in red pen on a paper tag (the napkin's red pen: the breach). */
export function PenNote({ show, text, size = 42, color = PEN.red, style }: { show: number; text: string; size?: number; color?: string; style?: CSSProperties }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '8px 20px 10px',
        borderRadius: RADIUS.sm,
        background: PAPER,
        border: `3px solid ${alpha(color, 0.8)}`,
        boxShadow: `0 10px 22px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateX(${(1 - p) * -12}px) rotate(-1deg)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
}

/** A tray seen from the front (the counter's «solo una bandeja»). */
function TrayGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M 6 24 L 12 34 L 36 34 L 42 24" />
      <path d="M 4 24 L 44 24" />
      <path d="M 16 24 L 18 14 L 32 14 L 30 24" opacity={0.75} />
    </svg>
  );
}

/** A door, crossed out (the counter's «sin puerta a las oficinas»). */
function NoDoorGlyph({ size, color, cross }: { size: number; color: string; cross: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <rect x={13} y={6} width={22} height={36} rx={2} stroke={color} strokeWidth={3} strokeDasharray="5 4" />
      <circle cx={30} cy={25} r={1.8} fill={color} />
      <path d="M 7 8 L 41 42 M 41 8 L 7 42" stroke={cross} strokeWidth={4} />
    </svg>
  );
}

export type TraitKind = 'noDoor' | 'tray' | 'eye';

/** One property of the counter: icon in a ring + 44 px text. */
export function TraitRow({ show, kind, text, tone }: { show: number; kind: TraitKind; text: string; tone: string }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const glyph: ReactNode =
    kind === 'noDoor' ? <NoDoorGlyph size={46} color={C.text} cross={C.rose} /> : kind === 'tray' ? <TrayGlyph size={46} color={tone} /> : <Icon name="eye" size={42} color={tone} strokeWidth={2.2} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: p, transform: `translateX(${(1 - p) * 16}px)`, whiteSpace: 'nowrap' }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${alpha(tone, 0.8)}`,
          background: alpha(tone, 0.12),
          flexShrink: 0,
        }}
      >
        {glyph}
      </div>
      <span style={{ fontFamily: FONT.sans, fontSize: 44, fontWeight: 800, color: C.textStrong }}>{text}</span>
    </div>
  );
}

export const PLAN_PORTAL_TILE = 76;

/**
 * The portal as the plan draws it (clean blueprint, not ink): a cyan server
 * tile with its host under it. `label` 0–1 shows the host, `ring` 0–1 rings
 * the tile in rose (someone broke it, s04-08). Centred on its tile: the caller
 * places the tile's centre with `translate(-50%, -38px)`-style offsets, or uses
 * PLAN_PORTAL_TILE.
 */
export function PlanPortal({ host, label = 1, ring = 0, glow = 0 }: { host: string; label?: number; ring?: number; glow?: number }) {
  const T = PLAN_PORTAL_TILE;
  const l = clamp01(label);
  const r = clamp01(ring);
  const g = clamp01(glow);
  return (
    <div style={{ position: 'relative', width: T, height: T }}>
      <div
        style={{
          width: T,
          height: T,
          boxSizing: 'border-box',
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${C.cyan}`,
          background: alpha(C.cyanDeep, 0.45),
          boxShadow: `0 0 ${Math.round(8 + 22 * g)}px ${alpha(C.cyan, 0.25 + 0.4 * g)}`,
        }}
      >
        <Icon name="server" size={46} color={C.cyanSoft} strokeWidth={2} />
      </div>
      {r > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: -12,
            top: -12,
            width: T + 24,
            height: T + 24,
            boxSizing: 'border-box',
            borderRadius: 22,
            border: `4px solid ${C.rose}`,
            boxShadow: `0 0 22px ${alpha(C.rose, 0.55)}`,
            opacity: r,
            transform: `scale(${1.2 - 0.2 * r})`,
          }}
        />
      ) : null}
      {l > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: T / 2,
            top: T + 8,
            transform: 'translateX(-50%)',
            fontFamily: FONT.mono,
            fontSize: 32,
            fontWeight: 750,
            color: C.cyanSoft,
            whiteSpace: 'nowrap',
            opacity: l,
          }}
        >
          {host}
        </div>
      ) : null}
    </div>
  );
}

/**
 * One rule of the DMZ under the plan: a small «from → to» glyph in the two
 * zones' colours, the lead (who to whom) and the rest (what passes).
 */
export function RuleRow({ show, lead, rest, from, to, size = 38 }: { show: number; lead: string; rest: string; from: string; to: string; size?: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateY(${(1 - p) * 10}px)`, whiteSpace: 'nowrap', fontFamily: FONT.sans }}>
      <svg width={78} height={30} viewBox="0 0 78 30" style={{ display: 'block', flexShrink: 0 }}>
        <circle cx={12} cy={15} r={9} fill={alpha(from, 0.3)} stroke={from} strokeWidth={3} />
        <path d="M 24 15 L 54 15" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
        <path d="M 46 8 L 55 15 L 46 22" fill="none" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={66} cy={15} r={9} fill={alpha(to, 0.3)} stroke={to} strokeWidth={3} />
      </svg>
      <span style={{ fontSize: size - 2, fontWeight: 700, color: C.muted }}>{lead}</span>
      <span style={{ fontSize: size, fontWeight: 850, color: C.textStrong }}>{rest}</span>
    </div>
  );
}
