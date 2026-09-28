import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { RedactBar } from '../s05-cert/bits';

export const NOTICE_W = 262;
export const NOTICE_H = 150;

/** A pin head at the top of a notice. */
function Pin({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: -size / 2,
        width: size,
        height: size,
        marginLeft: -size / 2,
        borderRadius: size,
        background: `radial-gradient(circle at 35% 35%, ${alpha('#ffffff', 0.7)} 0%, ${color} 45%, ${alpha(color, 0.7)} 100%)`,
        boxShadow: `0 3px 6px ${alpha('#000000', 0.5)}`,
      }}
    />
  );
}

/**
 * One certificate notice pinned to the CT board: the domain it was issued
 * for, who issued it and its fingerprint. `domain: null` draws the name fully
 * redacted.
 */
export function NoticeCard({
  domain,
  issuer = 'CA pública',
  fingerprint,
  accent = C.cyan,
  extra,
  issuerGrey = 0,
  redactW = 210,
  style,
}: {
  domain: string | null;
  /** Width of the redaction bar when `domain` is null. */
  redactW?: number;
  issuer?: string;
  fingerprint: string;
  accent?: string;
  extra?: ReactNode;
  issuerGrey?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: NOTICE_W,
        height: NOTICE_H,
        boxSizing: 'border-box',
        padding: '22px 16px 12px',
        borderRadius: RADIUS.sm,
        background: `linear-gradient(180deg, ${C.ink700} 0%, ${C.ink800} 100%)`,
        border: `2px solid ${alpha(accent, 0.45)}`,
        boxShadow: `0 12px 26px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <Pin color={accent} />
      {domain ? (
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.3 }}>{domain}</div>
      ) : (
        <div style={{ height: 34, display: 'flex', alignItems: 'center' }}>
          <RedactBar width={redactW} height={28} color={C.roseSoft} />
        </div>
      )}
      <div style={{ marginTop: 6, fontSize: TYPE.micro, fontWeight: 650, color: issuerGrey > 0.5 ? C.faint : C.muted, whiteSpace: 'nowrap' }}>
        emisor: <span style={{ textDecoration: issuerGrey > 0.5 ? 'line-through' : undefined }}>{issuer}</span>
      </div>
      <div style={{ marginTop: 4, fontFamily: FONT.mono, fontSize: 20, color: C.faint, whiteSpace: 'nowrap' }}>SHA1 {fingerprint}</div>
      {extra}
    </div>
  );
}

export const MINI_W = 150;
export const MINI_H = 112;

/** A free-CA notice in the flood: all identical but for the fingerprint. */
export function MiniNotice({ fingerprint, grey, hl = 0 }: { fingerprint: string; grey: number; hl?: number }) {
  const issuerColor = grey > 0 ? C.faint : C.amber;
  return (
    <div
      style={{
        position: 'relative',
        width: MINI_W,
        height: MINI_H,
        boxSizing: 'border-box',
        padding: '18px 12px 10px',
        borderRadius: 8,
        background: `linear-gradient(180deg, ${C.ink700} 0%, ${C.ink800} 100%)`,
        border: `2px solid ${hl > 0 ? alpha(C.emerald, 0.4 + 0.5 * hl) : alpha(C.amber, 0.35 * (1 - grey) + 0.12)}`,
        boxShadow: `0 8px 18px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
      }}
    >
      <Pin color={grey > 0.5 ? C.ink500 : C.amber} size={14} />
      <div style={{ fontSize: TYPE.micro, fontWeight: 750, color: issuerColor, whiteSpace: 'nowrap', textDecoration: grey > 0.5 ? 'line-through' : undefined }}>CA gratuita</div>
      <div style={{ marginTop: 10, height: 12, width: 96, borderRadius: 3, background: alpha(C.muted, 0.3) }} />
      <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: 18, color: hl > 0 ? '#6ee7b7' : C.faint, whiteSpace: 'nowrap' }}>{fingerprint}</div>
    </div>
  );
}
