import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { FAKE, SERVER } from '../../../data/s05-eap';
import { AccessPointGlyph, STEEL, TabletGlyph } from '../Glyphs';
import { CertSeal, Creds, Magnifier, ServerGlyph } from './Server';
import { ART_H, PEAP_ART as A } from './layout';

/**
 * The PEAP · TTLS picture, over its group. Inside the terminal (steel edge, «terminal»): a tablet,
 * the network's access point (sky, «HALDEN-OPS») and the server; the tablet's user and password go
 * to the server inside a tunnel, and only the server has a certificate.
 * OUTSIDE the terminal, a hypothesis: a fake access point (rose) with the same network name. If the
 * tablet does not check the server's certificate, its credentials go there instead.
 *
 *   show      0–1 the terminal, the tablet, the access point and the server
 *   tunnel    0–1 the tunnel is drawn; `creds` 0–1 user + password travel into it
 *   cert      0–1 the server's certificate; `check` 0–1 the tablet has to look at it (amber)
 *   fake      0–1 the fake access point and «hipótesis»; `name` 0–1 its «HALDEN-OPS»
 *   steal     0–1 the credentials go out to it; `word` 0–1 «credenciales»
 */
export function PeapArt({
  show,
  tunnel,
  creds,
  cert,
  check,
  fake,
  name,
  steal,
  word,
}: {
  show: number;
  tunnel: number;
  creds: number;
  cert: number;
  check: number;
  fake: number;
  name: number;
  steal: number;
  word: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const tn = clamp01(tunnel);
  const cr = clamp01(creds);
  const ck = clamp01(check);
  const fk = clamp01(fake);
  const st = clamp01(steal);
  const T = A.tunnel;
  const tabletLeft = A.tablet.x - 56;
  const fakeRight = A.fake.x + 58;
  const label = { position: 'absolute', fontFamily: FONT.mono, fontWeight: 800, whiteSpace: 'nowrap', lineHeight: 1 } as const;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: A.right, height: ART_H, opacity: s }}>
      <svg width={A.right} height={ART_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* the terminal: everything to the right of its edge is inside */}
        <rect x={A.edge} y={2} width={A.right - A.edge} height={ART_H - 8} rx={16} fill={alpha(STEEL.fill, 0.34)} stroke={alpha(STEEL.line, 0.55)} strokeWidth={3} />
        <line x1={A.edge} y1={6} x2={A.edge} y2={ART_H - 10} stroke={STEEL.light} strokeWidth={7} strokeLinecap="round" />
        {/* the tunnel to the server, under the network's own access point */}
        {tn > 0.001 ? (
          <g opacity={tn}>
            <line x1={A.ap.x} y1={A.ap.y + 16} x2={A.ap.x} y2={T.y - T.r - 3} stroke={alpha(C.sky, 0.6)} strokeWidth={3} strokeLinecap="round" strokeDasharray="3 8" />
            <rect x={T.x1} y={T.y - T.r} width={mix(0, T.x2 - T.x1, tn)} height={2 * T.r} rx={T.r} fill={alpha(C.sky, 0.12)} stroke={C.sky} strokeWidth={4} />
          </g>
        ) : null}
        <AccessPointGlyph x={A.ap.x} y={A.ap.y} h={A.ap.h} waves={0.8} />
        <ServerGlyph x={A.server.x} y={A.server.y} w={A.server.w} h={A.server.h} label={SERVER} />
        <TabletGlyph x={A.tablet.x} y={A.tablet.y} h={A.tablet.h} screen={0.5} />
        <Creds x={mix(A.tablet.x, (T.x1 + T.x2) / 2 + 4, cr)} y={mix(A.tablet.y, T.y, cr)} opacity={Math.min(1, cr * 4) * (1 - 0.6 * st)} scale={0.92} />
        <CertSeal x={A.server.x + A.server.w / 2 - 24} y={A.server.y - A.server.h / 2 - 6} r={19} tone={ck > 0.5 ? C.amber : C.sky} show={cert} ring={ck} glow={0.7 * ck} />
        <Magnifier x={A.tablet.x + 40} y={A.tablet.y - A.tablet.h / 2 + 2} show={ck} />
        {/* the hypothesis: a fake access point outside, and what it takes */}
        {fk > 0.001 ? (
          <g opacity={fk}>
            <rect x={4} y={2} width={A.edge - 26} height={ART_H - 8} rx={16} fill={alpha(C.rose, 0.05)} stroke={alpha(C.muted, 0.7)} strokeWidth={3} strokeDasharray="12 10" />
            <AccessPointGlyph x={A.fake.x} y={A.fake.y} h={A.fake.h} tone={C.rose} led={C.rose} waves={fk} />
          </g>
        ) : null}
        {st > 0.001 ? (
          <g>
            <line x1={tabletLeft} y1={A.tablet.y} x2={mix(tabletLeft, fakeRight, st)} y2={mix(A.tablet.y, A.fake.y - 8, st)} stroke={alpha(C.rose, 0.9)} strokeWidth={4} strokeLinecap="round" strokeDasharray="6 9" />
            <Creds x={mix(tabletLeft - 34, fakeRight + 50, st)} y={mix(A.tablet.y, A.fake.y - 8, st)} tone={C.rose} opacity={Math.min(1, st * 4)} scale={0.92} />
          </g>
        ) : null}
      </svg>
      {/* words */}
      <div style={{ ...label, left: A.edge + 16, top: 12, fontFamily: FONT.sans, fontSize: 28, fontWeight: 760, color: STEEL.light }}>{FAKE.place}</div>
      <div style={{ ...label, left: A.ap.x + 44, top: A.ap.y - 16, fontSize: 28, color: C.cyanSoft }}>{FAKE.network}</div>
      {fk > 0.001 ? (
        <>
          <span
            style={{
              ...label,
              right: A.right - (A.edge - 34),
              top: 12,
              display: 'inline-flex',
              alignItems: 'center',
              height: 40,
              padding: '0 14px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.sm,
              border: `2px dashed ${alpha(C.amber, 0.95)}`,
              background: alpha(C.amber, 0.14),
              fontFamily: FONT.sans,
              fontSize: 30,
              color: '#fde68a',
              opacity: fk,
            }}
          >
            {FAKE.tag}
          </span>
          <div style={{ ...label, left: 16, top: A.fake.y + 34, fontSize: 28, color: C.cyanSoft, opacity: clamp01(name) }}>{FAKE.network}</div>
          <div style={{ ...label, left: 16, top: A.fake.y + 72, fontFamily: FONT.sans, fontSize: 34, fontWeight: 860, color: C.roseSoft, opacity: clamp01(word), transform: `translateY(${(1 - clamp01(word)) * 8}px)` }}>{FAKE.takes}</div>
        </>
      ) : null}
    </div>
  );
}
