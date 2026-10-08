import { C, FONT } from '../../../../../engine/src/theme/tokens';
import { IpPacket, LoadFit, RouteGlyph, packetWidth, type BlockSpec } from '../s06-ah-esp/packet';

/**
 * s07's two schemes, built from s06's packet blocks so the packet looks the same in both scenes:
 *   - TransportPacket: [original header | payload]; the header is drawn (device → device, the
 *     truck's plate), the payload gets the cipher;
 *   - TunnelPacket: [new header | the whole original packet]; the new header says only
 *     «pasarela de la sede» / «pasarela de la terminal» (like the container's placard), and the
 *     cipher covers the whole original packet, its own header included.
 * Every animated prop is a 0–1 weight. Sizes in px; nothing positions itself.
 */

export const SCHEME_H = 130;

const T = { header: 300, payload: 380 } as const;
export const TRANSPORT_W = packetWidth([{ width: T.header }, { width: T.payload }]);

export function TransportPacket({
  show,
  cipher,
  headerGlow = 0,
  payloadGlow = 0,
  headerCaption,
  payloadCaption,
  captions,
}: {
  show: number;
  cipher: number;
  headerGlow?: number;
  payloadGlow?: number;
  headerCaption: string;
  payloadCaption: string;
  captions: { header: number; payload: number };
}) {
  const blocks: BlockSpec[] = [
    { width: T.header, content: (w, h) => <RouteGlyph width={w} height={h} />, fill: C.ink800, glow: headerGlow, glowTone: C.cyanSoft, caption: headerCaption, captionP: captions.header },
    { width: T.payload, content: (w, h) => <LoadFit width={w} height={h} />, cipher, glow: payloadGlow, caption: payloadCaption, captionP: captions.payload },
  ];
  return <IpPacket height={SCHEME_H} show={show} blocks={blocks} />;
}

const U = { outer: 420, inner: 360, innerHeader: 128, innerPayload: 180, innerH: 84 } as const;
export const TUNNEL_W = packetWidth([{ width: U.outer }, { width: U.inner }]);

/** The original packet, small, inside the tunnel packet's second block. */
function InnerPacket({ headerGlow }: { headerGlow: number }) {
  return (
    <IpPacket
      height={U.innerH}
      gap={6}
      blocks={[
        { width: U.innerHeader, content: (w, h) => <RouteGlyph width={w} height={h} />, fill: C.ink800, glow: headerGlow, glowTone: C.cyanSoft },
        { width: U.innerPayload, content: (w, h) => <LoadFit width={w} height={h} /> },
      ]}
    />
  );
}

export function TunnelPacket({
  inner,
  outer,
  cipher,
  innerHeaderGlow = 0,
  outerGlow = 0,
  innerCaption,
  innerCaptionP,
  outerLines,
}: {
  /** 0–1 the original packet (second block) appears. */
  inner: number;
  /** 0–1 the new header (first block) appears. */
  outer: number;
  cipher: number;
  innerHeaderGlow?: number;
  outerGlow?: number;
  innerCaption: string;
  innerCaptionP: number;
  outerLines: readonly string[];
}) {
  const blocks: BlockSpec[] = [
    {
      width: U.outer,
      show: outer,
      fill: C.ink800,
      glow: outerGlow,
      glowTone: C.cyanSoft,
      content: (
        <div style={{ textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, lineHeight: 1.18, color: C.textStrong, whiteSpace: 'nowrap' }}>
          {outerLines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      ),
    },
    {
      width: U.inner,
      show: inner,
      cipher,
      content: <InnerPacket headerGlow={innerHeaderGlow} />,
      caption: innerCaption,
      captionP: innerCaptionP,
    },
  ];
  return <IpPacket height={SCHEME_H} show={Math.max(inner, outer)} blocks={blocks} />;
}
