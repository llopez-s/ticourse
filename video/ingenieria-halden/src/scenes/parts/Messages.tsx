import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';
import { DigitBlocks } from './Labels';

/*
 * The messages of the video: the lure of s01/s02 (one text, three channels), the BEC mail of s03/s05, and the chat
 * windows of s10 (the family group, the port team's group). No addresses, links, numbers or names anywhere.
 */

export const LURE = ['Cobra la nueva ayuda de transporte:', 'confirma tus datos', 'antes del viernes'] as const;

/**
 * The lure: «Cobra la nueva ayuda de transporte: confirma tus datos antes del viernes». Rose rim (it is the deceiver's
 * text), the deadline in amber (the hurry). `size` is the body's font size; `compact` puts it in two lines for columns.
 */
export function LureCard({ size = 54, icon = 'bell', width, style }: { size?: number; icon?: IconName; width?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: Math.round(size * 0.5),
        width,
        padding: `${Math.round(size * 0.5)}px ${Math.round(size * 0.8)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.rose, 0.7)}`,
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 0 40px ${alpha(C.rose, 0.16)}, 0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div style={{ flexShrink: 0, width: size * 1.5, height: size * 1.5, borderRadius: 999, display: 'grid', placeItems: 'center', background: alpha(C.rose, 0.14), border: `2px solid ${alpha(C.rose, 0.6)}`, marginTop: 4 }}>
        <Icon name={icon} size={Math.round(size * 0.85)} color={C.roseSoft} />
      </div>
      <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.18, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>{LURE[0]}</div>
        <div>
          {LURE[1]} <span style={{ color: C.amber }}>{LURE[2]}</span>
        </div>
      </div>
    </div>
  );
}

/** A row of the mail header: «De:» / «Para:» and its value. */
function HeadRow({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 52 }}>
      <span style={{ width: 92, fontSize: 32, fontWeight: 700, color: C.muted }}>{k}</span>
      {children}
    </div>
  );
}

export const BEC = {
  from: 'el buzón de un directivo',
  real: 'el de verdad',
  to: 'Finanzas',
  inside: 'alguien se ha colado',
  ask: 'Pago urgente a una cuenta nueva',
  excuse: ['estoy en una reunión y no puedo hablar', 'que no se entere nadie hasta el cierre'],
  sign: '¿dudas? a mi móvil nuevo · número en la firma',
} as const;

export const BEC_W = 900;

/**
 * The BEC mail (a «supuesto»): from a director's real mailbox (cyan, «el de verdad») to Finanzas; `inside` 0–1 shows
 * the rose intruder inside that mailbox; `ask`, `excuse`, `sign` 0–1 write the request, the excuse (amber) and the
 * signature (number as digit blocks). `excuseGlow` 0–1 rings the excuse (PRETEXTING lands on it). `dim` 0–1 fades it.
 */
export function BecMail({
  inside = 1,
  ask = 1,
  excuse = 1,
  sign = 1,
  excuseGlow = 0,
  numberRing = 0,
  width = BEC_W,
  style,
}: {
  inside?: number;
  ask?: number;
  excuse?: number;
  sign?: number;
  excuseGlow?: number;
  /** 0–1 rings the signature's number in rose (the phone the writer put there). */
  numberRing?: number;
  width?: number;
  style?: CSSProperties;
}) {
  const g = clamp01(excuseGlow);
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.55)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 58, padding: '0 24px', background: C.ink800, borderBottom: `2px solid ${C.ink700}` }}>
        <Icon name="mail" size={34} color={C.cyan} />
        <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong }}>Correo</span>
      </div>
      <div style={{ padding: '12px 28px 20px' }}>
        <HeadRow k="De:">
          <span style={{ fontSize: 34, fontWeight: 800, color: C.cyanSoft }}>{BEC.from}</span>
          <span style={{ fontSize: 28, fontWeight: 750, color: C.cyan, padding: '2px 14px', borderRadius: 999, border: `2px solid ${alpha(C.cyan, 0.6)}` }}>{BEC.real}</span>
        </HeadRow>
        {inside > 0.01 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 108, marginTop: -2, height: 44, opacity: clamp01(inside) }}>
            <Icon name="user" size={30} color={C.rose} />
            <span style={{ fontSize: 30, fontWeight: 750, color: C.roseSoft }}>{BEC.inside}</span>
          </div>
        ) : null}
        <HeadRow k="Para:">
          <span style={{ fontSize: 34, fontWeight: 800, color: C.text }}>{BEC.to}</span>
        </HeadRow>
        <div style={{ height: 2, background: C.ink700, margin: '10px 0 16px' }} />
        <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, opacity: clamp01(ask), transform: `translateY(${(1 - clamp01(ask)) * 10}px)` }}>{BEC.ask}</div>
        <div
          style={{
            marginTop: 14,
            marginLeft: -12,
            padding: '6px 12px',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.amber, 0.9 * g)}`,
            background: alpha(C.amber, 0.1 * g),
            boxShadow: g > 0.02 ? `0 0 26px ${alpha(C.amber, 0.25 * g)}` : undefined,
            opacity: clamp01(excuse),
            display: 'inline-block',
          }}
        >
          {BEC.excuse.map((l) => (
            <div key={l} style={{ fontSize: 34, fontWeight: 750, lineHeight: 1.3, color: C.amber }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16, opacity: clamp01(sign) }}>
          <span style={{ fontSize: 30, fontWeight: 650, color: C.muted }}>{BEC.sign}</span>
          <span
            style={{
              display: 'inline-flex',
              padding: '6px 10px',
              borderRadius: 10,
              border: `3px solid ${alpha(C.rose, 0.9 * clamp01(numberRing))}`,
              boxShadow: numberRing > 0.02 ? `0 0 22px ${alpha(C.rose, 0.35 * clamp01(numberRing))}` : undefined,
            }}
          >
            <DigitBlocks n={9} tone={numberRing > 0.5 ? C.roseSoft : C.muted} w={10} h={18} gap={4} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** A chat window: header with the group's icon and name, then its bubbles. */
export function ChatWindow({ title, width, tone = C.cyan, children, style }: { title: string; width: number; tone?: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.55)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 62, padding: '0 24px', background: C.ink800, borderBottom: `2px solid ${C.ink700}`, whiteSpace: 'nowrap' }}>
        <Icon name="users" size={36} color={tone} />
        <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>{title}</span>
      </div>
      <div style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  );
}

/** A chat bubble; `forwarded` adds the «Reenviado» line with a drawn arrow. Bars stand in for unreadable text. */
export function Bubble({ children, tone = C.cyan, forwarded, bars, opacity = 1, style }: { children?: ReactNode; tone?: string; forwarded?: boolean; bars?: number[]; opacity?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: '12px 22px 14px',
        borderRadius: '6px 22px 22px 22px',
        background: alpha(tone, 0.13),
        border: `2px solid ${alpha(tone, 0.55)}`,
        opacity,
        ...style,
      }}
    >
      {forwarded ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 26, fontWeight: 700, fontStyle: 'italic', color: C.muted, whiteSpace: 'nowrap' }}>
          <svg width={30} height={20} viewBox="0 0 30 20">
            <path d="M2 16 Q4 6 18 6 H24 M18 1 L25 6 L18 11" stroke={C.muted} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Reenviado
        </div>
      ) : null}
      {bars ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: forwarded ? 8 : 4 }}>
          {bars.map((w, i) => (
            <div key={i} style={{ width: w, height: 12, borderRadius: 6, background: alpha(C.text, 0.5) }} />
          ))}
        </div>
      ) : null}
      {children}
    </div>
  );
}
