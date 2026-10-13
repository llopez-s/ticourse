import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { PEAP, TLS } from '../../../data/s05-eap';
import { LANE } from './layout';

/** What each group carries, written in its body. Positions are lane-local; every state is 0–1. */

const AMBER_SOFT = '#fde68a';
const EMERALD_SOFT = '#6ee7b7';
const PAD = 22;

function Line({ top, show, size = 34, color = C.textStrong, weight = 760, glow, children }: { top: number; show: number; size?: number; color?: string; weight?: number; glow?: string; children: ReactNode }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: PAD, top, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: size, fontWeight: weight, letterSpacing: -0.2, lineHeight: 1.2, color, whiteSpace: 'nowrap', textShadow: glow, opacity: s, transform: `translateX(${(1 - s) * -10}px)` }}>
      {children}
    </div>
  );
}

/** «más débil que EAP-TLS»: the tag at the right of the PEAP · TTLS title bar. */
export function WeakerTag({ show }: { show: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 44,
        padding: '0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.amber, 0.85)}`,
        background: alpha(C.amber, 0.14),
        fontSize: 32,
        fontWeight: 820,
        letterSpacing: 0,
        color: AMBER_SOFT,
        opacity: s,
        transform: `translateX(${(1 - s) * 10}px)`,
      }}
    >
      {PEAP.weaker}
    </span>
  );
}

/**
 * PEAP · TTLS: «usuario y contraseña dentro de un túnel TLS», «certificado solo en el servidor» and,
 * big, the warning «el cliente tiene que validar el certificado del servidor».
 */
export function PeapText({ inside, cert, warning, warn = 0 }: { inside: number; cert: number; warning: number; warn?: number }) {
  const w = clamp01(warning);
  const g = clamp01(warn);
  return (
    <>
      <Line top={LANE.head + 10} show={inside}>
        {PEAP.inside}
      </Line>
      <Line top={LANE.head + 56} show={cert} color={C.text} weight={720}>
        {PEAP.cert}
      </Line>
      {w > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: PAD - 6,
            right: PAD - 6,
            top: LANE.head + 112,
            height: 150,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '0 22px',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.amber, 0.75 + 0.25 * g)}`,
            background: `linear-gradient(180deg, ${alpha(C.amber, 0.14 + 0.06 * g)} 0%, ${alpha(C.ink950, 0.9)} 100%)`,
            boxShadow: `0 0 ${Math.round(10 + 30 * g)}px ${alpha(C.amber, 0.12 + 0.26 * g)}`,
            fontFamily: FONT.sans,
            whiteSpace: 'nowrap',
            opacity: w,
            transform: `translateY(${(1 - w) * 12}px)`,
          }}
        >
          <Icon name="alert" size={68} color={C.amber} strokeWidth={2.2} />
          <div style={{ fontSize: 46, fontWeight: 880, letterSpacing: -0.6, lineHeight: 1.16, color: AMBER_SOFT }}>
            {PEAP.warning.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 * EAP-TLS: «certificado en la tableta y en el servidor», big «autenticación mutua» and
 * «no hay contraseña que robar».
 */
export function TlsText({ both, mutual, nothing, lit = [0, 0] }: { both: number; mutual: number; nothing: number; lit?: readonly number[] }) {
  const m = clamp01(mutual);
  const lm = clamp01(lit[0] ?? 0);
  const ln = clamp01(lit[1] ?? 0);
  return (
    <>
      <Line top={LANE.head + 10} show={both}>
        {TLS.both}
      </Line>
      {m > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: PAD - 6,
            top: LANE.head + 68,
            height: 92,
            boxSizing: 'border-box',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 18,
            padding: '0 30px 0 22px',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.emerald, 0.75 + 0.25 * lm)}`,
            background: `linear-gradient(180deg, ${alpha(C.emerald, 0.16 + 0.06 * lm)} 0%, ${alpha(C.ink950, 0.9)} 100%)`,
            boxShadow: `0 0 ${Math.round(10 + 30 * lm)}px ${alpha(C.emerald, 0.12 + 0.26 * lm)}`,
            fontFamily: FONT.sans,
            fontSize: 54,
            fontWeight: 890,
            letterSpacing: -0.6,
            color: EMERALD_SOFT,
            whiteSpace: 'nowrap',
            opacity: m,
            transform: `translateY(${(1 - m) * 12}px)`,
          }}
        >
          <Icon name="check" size={56} color={C.emerald} strokeWidth={3} />
          {TLS.mutual}
        </div>
      ) : null}
      <Line top={LANE.head + 188} show={nothing} size={44} weight={850} glow={ln > 0.01 ? `0 0 ${Math.round(22 * ln)}px ${alpha(C.emerald, 0.6 * ln)}` : undefined}>
        {TLS.nothing}
      </Line>
    </>
  );
}
