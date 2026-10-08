import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, Redacted, clamp01 } from '../../../../../engine/src/ui';
import { CERT, QUESTION } from '../../../data/s04-revocar';
import { ShipBadge } from './Marks';

/**
 * s04's certificate cards and the shipping company's question. `CertCard` is the portal's real
 * certificate (cyan) with s02's `NotAfter` readable; `GhostCert` is the dashed, dimmed copy of it whose
 * lines are bars (no readable CN, no dates) — the only thing the REVOKE stamp may land on. Both share one
 * size so they sit side by side. Not positioned; nothing reads the timeline.
 */

export const CERT_CARD = { w: 760, h: 214 } as const;
const MONO = 34;

export function CertCard({
  glow = 0,
  notAfterLit = 0,
  dim = 0,
  style,
}: {
  glow?: number;
  /** 0–1: the `NotAfter` row lights (amber: the date the voice weighs). */
  notAfterLit?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const g = clamp01(glow);
  const n = clamp01(notAfterLit);
  const d = clamp01(dim);
  return (
    <div
      style={{
        width: CERT_CARD.w,
        height: CERT_CARD.h,
        boxSizing: 'border-box',
        padding: '20px 30px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.6 + 0.4 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.1 + 0.06 * g)} 0%, ${alpha(C.ink900, 0.97)} 60%)`,
        boxShadow: `0 0 ${Math.round(12 + 30 * g)}px ${alpha(C.cyan, 0.12 + 0.3 * g)}, 0 22px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        opacity: 1 - 0.6 * d,
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={36} color={C.cyan} strokeWidth={2.2} />
        <span style={{ fontSize: 34, fontWeight: 800, color: C.cyanSoft }}>{CERT.title}</span>
      </div>
      <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: MONO, fontWeight: 650, color: C.textStrong, whiteSpace: 'pre', lineHeight: 1.3 }}>
        {CERT.subject}
      </div>
      <div
        style={{
          marginTop: 8,
          marginLeft: -10,
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: RADIUS.sm,
          background: alpha(C.amber, 0.16 * n),
          boxShadow: n > 0.02 ? `0 0 0 2px ${alpha(C.amber, 0.7 * n)}` : undefined,
          fontFamily: FONT.mono,
          fontSize: MONO,
          fontWeight: 650,
          color: n > 0.5 ? '#fde68a' : C.text,
          whiteSpace: 'pre',
          lineHeight: 1.3,
        }}
      >
        {CERT.notAfter}
      </div>
    </div>
  );
}

/** The ghost: the same card dashed and dimmed, its lines as bars. */
export function GhostCert({ show = 1, style }: { show?: number; style?: CSSProperties }) {
  const s = clamp01(show);
  return (
    <div
      style={{
        width: CERT_CARD.w,
        height: CERT_CARD.h,
        boxSizing: 'border-box',
        padding: '20px 30px',
        borderRadius: RADIUS.lg,
        border: `3px dashed ${alpha(C.muted, 0.7)}`,
        background: alpha(C.ink900, 0.7),
        opacity: 0.62 * s,
        filter: 'saturate(0.4)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="file" size={36} color={C.muted} strokeWidth={2.2} />
        <Redacted width={360} height={26} tone="muted" strength={0.5} />
      </div>
      <div style={{ marginTop: 26 }}>
        <Redacted width={560} height={30} tone="muted" strength={0.45} />
      </div>
      <div style={{ marginTop: 18 }}>
        <Redacted width={600} height={30} tone="muted" strength={0.45} />
      </div>
    </div>
  );
}

/** The shipping company's second question: ship badge + card (day stamp, the sentence). */
export const QUESTION_CARD = { badge: 132, gap: 30, width: 1180 } as const;

export function QuestionCard({ glow = 0 }: { glow?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: QUESTION_CARD.gap, fontFamily: FONT.sans }}>
      <ShipBadge size={QUESTION_CARD.badge} label={QUESTION.who} labelSize={32} glow={glow} />
      <div
        style={{
          width: QUESTION_CARD.width,
          boxSizing: 'border-box',
          padding: '22px 36px 26px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.emerald, 0.6)}`,
          background: `linear-gradient(180deg, ${alpha(C.emerald, 0.09)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
          boxShadow: `0 0 30px ${alpha(C.emerald, 0.14)}, 0 26px 60px ${alpha('#000000', 0.45)}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
          <Icon name="mail" size={34} color={C.emerald} />
          <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 750, color: '#6ee7b7' }}>{QUESTION.day}</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 42, fontWeight: 750, lineHeight: 1.22, color: C.textStrong }}>{QUESTION.text}</div>
      </div>
    </div>
  );
}
