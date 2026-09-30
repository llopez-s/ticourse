import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { CANON, Caps, KEY_COLOR, KeyBadge, Pill, dimStyle } from './bits';

export const COL_W = 440;
export const NODE_H = 104;
export const CERT_H = 366;

/** Where the key tile sits inside the certificate card (card-local), for things that fly out of it. */
export const CERT_KEY_TILE = { x: 24, y: 22, size: 68 } as const;
/** Card-local top-left of the fingerprint value, for the copy that flies to the scan search. */
export const CERT_SHA1_POS = { x: 24, y: 290 } as const;
/** Node-local top-left of the domain line. */
export const NODE_DOMAIN_POS = { x: 22, y: 48 } as const;

/** The C2: its domain (and the shared IP it resolves to, as texture). */
export function C2Node({ glow = 0 }: { glow?: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: COL_W,
        height: NODE_H,
        boxSizing: 'border-box',
        padding: '14px 22px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.sky, 0.45 + 0.45 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(C.sky, 0.08 + 0.06 * glow)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 20px 50px ${alpha('#000000', 0.35)}${glow > 0 ? `, 0 0 ${Math.round(34 * glow)}px ${alpha(C.sky, 0.35 * glow)}` : ''}`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="server" size={28} color={C.sky} />
        <Caps color={C.sky}>el C2</Caps>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, color: C.muted, whiteSpace: 'nowrap' }}>{CANON.blockIp}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: NODE_DOMAIN_POS.x,
          top: NODE_DOMAIN_POS.y,
          fontFamily: FONT.mono,
          fontSize: TYPE.label,
          fontWeight: 700,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          lineHeight: 1.3,
        }}
      >
        {CANON.c2}
      </div>
    </div>
  );
}

/**
 * The C2's self-signed certificate — the video's «llave hecha a mano». Pills
 * pop in on their words; `huella` lights the fingerprint row when it becomes
 * the thing you search for.
 */
export function CertCard({
  glow = 0,
  keyGlow = 0,
  autoP = 1,
  noCaP = 1,
  noCaGlow = 0,
  huella = 0,
  hideKey = false,
  dim = 0,
  rowDim = 0,
}: {
  glow?: number;
  keyGlow?: number;
  /** 0–1 appearance of «autofirmado». */
  autoP?: number;
  /** 0–1 appearance of «sin CA». */
  noCaP?: number;
  noCaGlow?: number;
  /** 0–1 highlight of the fingerprint row. */
  huella?: number;
  /** The key has flown out of its tile (it is drawn elsewhere). */
  hideKey?: boolean;
  /** 0–1 focus dimming of the header, CN and pills. */
  dim?: number;
  /** 0–1 focus dimming of the fingerprint row (kept bright while it is the thing searched for). */
  rowDim?: number;
}) {
  return (
    <div style={{ position: 'relative', width: COL_W, height: CERT_H, fontFamily: FONT.sans }}>
      {/* The card itself; it only fades when both of its halves are pushed back. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.sky, 0.5 + 0.4 * glow)}`,
          background: `linear-gradient(180deg, ${alpha(C.sky, 0.1)} 0%, ${alpha(C.ink900, 0.97)} 55%)`,
          boxShadow: `0 26px 60px ${alpha('#000000', 0.4)}${glow > 0 ? `, 0 0 ${Math.round(36 * glow)}px ${alpha(C.sky, 0.3 * glow)}` : ''}`,
          ...dimStyle(Math.min(dim, rowDim)),
        }}
      />
      <div style={{ position: 'absolute', inset: 0, ...dimStyle(dim) }}>
        {/* Header: the key tile + what this card is. */}
        <div style={{ position: 'absolute', left: CERT_KEY_TILE.x, top: CERT_KEY_TILE.y, display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ opacity: hideKey ? 0.25 : 1 }}>
            <KeyBadge size={CERT_KEY_TILE.size} glow={keyGlow} />
          </div>
          <div>
            <Caps>certificado TLS</Caps>
            <div style={{ marginTop: 6, fontSize: TYPE.small, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>del C2</div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 24, top: 110, fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
          {CANON.cn}
        </div>

        <div style={{ position: 'absolute', left: 24, top: 176, display: 'flex', gap: 10 }}>
          <span style={{ opacity: autoP, transform: `scale(${0.85 + 0.15 * autoP})`, display: 'inline-block', transformOrigin: 'left center' }}>
            <Pill color={C.sky} size={TYPE.label}>
              autofirmado
            </Pill>
          </span>
          <span style={{ opacity: noCaP, transform: `scale(${0.85 + 0.15 * noCaP})`, display: 'inline-block', transformOrigin: 'left center' }}>
            <Pill color={C.roseSoft} size={TYPE.label} glow={noCaGlow}>
              sin CA
            </Pill>
          </span>
        </div>
      </div>

      {/* Fingerprint row. */}
      <div style={{ position: 'absolute', inset: 0, ...dimStyle(rowDim) }}>
        <div style={{ position: 'absolute', left: 14, right: 14, top: 246, height: 2, background: C.ink700 }} />
        <div
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            top: 256,
            height: 96,
            borderRadius: RADIUS.md,
            background: alpha(KEY_COLOR, 0.1 * huella),
            border: `2px solid ${alpha(KEY_COLOR, 0.7 * huella)}`,
            boxShadow: huella > 0 ? `0 0 ${Math.round(26 * huella)}px ${alpha(KEY_COLOR, 0.3 * huella)}` : undefined,
          }}
        />
        <Caps color={huella > 0.5 ? KEY_COLOR : C.muted} style={{ position: 'absolute', left: CERT_SHA1_POS.x, top: 262 }}>
          huella
        </Caps>
        <div
          style={{
            position: 'absolute',
            left: CERT_SHA1_POS.x,
            top: CERT_SHA1_POS.y,
            fontFamily: FONT.mono,
            fontSize: TYPE.label,
            fontWeight: 700,
            color: huella > 0.5 ? '#6ee7b7' : C.text,
            whiteSpace: 'nowrap',
            lineHeight: 1.3,
          }}
        >
          {CANON.sha1}
        </div>
      </div>
    </div>
  );
}
