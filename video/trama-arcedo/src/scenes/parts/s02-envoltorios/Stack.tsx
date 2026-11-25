/**
 * The wrapper stack of «De la trama al segmento», drawn in code (reusable by any scene of this video).
 *   WrapperStack  the full stack with its headers: datos (white) inside segmento (emerald, header with the ports)
 *                 inside paquete (amber, header with the IPs) inside trama (cyan, header with MACs + EtherType in
 *                 front, FCS tail behind). Fixed size STACK.w × STACK.h; place it with a wrapper div. Every piece has
 *                 its own 0–1 appearance; `lit`/`dim` per layer; `field` lights the destination each device reads.
 *   CompactStack  the same nesting with the four names only (no headers), COMPACT.w × COMPACT.h.
 *   WrapGlyph     a small, unnamed version (s01): three coloured wraps closing over a white block.
 * Colours always come from LAYER (case.ts).
 */
import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { LAYER } from '../../../data/case';
import { DATA_SUB, FCS, FRAME_HDR, NAMES, PKT_HDR, SEG_HDR } from '../../../data/s02-envoltorios';

export type LayerKey = 'data' | 'segment' | 'packet' | 'frame';
type Rect = { x: number; y: number; w: number; h: number };

const PAD = 18;
const BAND = 58;
const GAP = 12;
const CONTENT_H = 170;
const W_DATA = 440;
const W_SEGH = 360;
const W_PKTH = 290;
const W_FRH = 320;
const W_FCS = 100;

const segW = PAD + W_SEGH + GAP + W_DATA + PAD;
const pktW = PAD + W_PKTH + GAP + segW + PAD;
const frW = PAD + W_FRH + GAP + pktW + GAP + W_FCS + PAD;
const segH = BAND + CONTENT_H + PAD;
const pktH = BAND + segH + PAD;
const frH = BAND + pktH + PAD;

/** Geometry of the full stack, in its own coordinates (origin = the frame's top-left). */
export const STACK = (() => {
  const frame: Rect = { x: 0, y: 0, w: frW, h: frH };
  const frameHdr: Rect = { x: PAD, y: BAND, w: W_FRH, h: pktH };
  const packet: Rect = { x: PAD + W_FRH + GAP, y: BAND, w: pktW, h: pktH };
  const fcs: Rect = { x: packet.x + pktW + GAP, y: BAND, w: W_FCS, h: pktH };
  const packetHdr: Rect = { x: packet.x + PAD, y: packet.y + BAND, w: W_PKTH, h: segH };
  const segment: Rect = { x: packetHdr.x + W_PKTH + GAP, y: packet.y + BAND, w: segW, h: segH };
  const segmentHdr: Rect = { x: segment.x + PAD, y: segment.y + BAND, w: W_SEGH, h: CONTENT_H };
  const data: Rect = { x: segmentHdr.x + W_SEGH + GAP, y: segment.y + BAND, w: W_DATA, h: CONTENT_H };
  return { w: frW, h: frH, frame, frameHdr, packet, fcs, packetHdr, segment, segmentHdr, data };
})();

const TONE: Record<LayerKey, string> = {
  data: LAYER.data.tone,
  segment: LAYER.segment.tone,
  packet: LAYER.packet.tone,
  frame: LAYER.frame.tone,
};

const abs = (r: Rect): CSSProperties => ({ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, boxSizing: 'border-box' });

/** A wrapper's outline: it «closes» over its content (shrinks from a little larger as it fades in). */
function Wrap({ r, tone, on, lit, dim, radius = RADIUS.lg }: { r: Rect; tone: string; on: number; lit: number; dim: number; radius?: number }) {
  const o = clamp01(on);
  if (o < 0.005) return null;
  return (
    <div
      style={{
        ...abs(r),
        borderRadius: radius,
        border: `3px solid ${alpha(tone, 0.55 + 0.45 * lit)}`,
        background: alpha(tone, 0.05 + 0.05 * lit),
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(34 * lit)}px ${alpha(tone, 0.4 * lit)}` : undefined,
        opacity: o * (1 - 0.6 * dim),
        transform: `scale(${1 + 0.1 * (1 - o)})`,
      }}
    />
  );
}

function NameTag({ r, tone, text, on, lit, dim, size = 32 }: { r: Rect; tone: string; text: string; on: number; lit: number; dim: number; size?: number }) {
  const o = clamp01(on);
  if (o < 0.005) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: r.x + 20,
        top: r.y + Math.round((BAND - size * 1.2) / 2) + 1,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.2,
        color: tone,
        whiteSpace: 'nowrap',
        opacity: o * (1 - 0.6 * dim),
        transform: `translateY(${(1 - o) * 10}px)`,
        textShadow: lit > 0.02 ? `0 0 ${Math.round(18 * lit)}px ${alpha(tone, 0.7 * lit)}` : undefined,
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 7, background: tone, boxShadow: `0 0 ${Math.round(6 + 10 * lit)}px ${alpha(tone, 0.8)}` }} />
      {text}
    </div>
  );
}

function Cell({ r, tone, on, dim, hi = 0, children }: { r: Rect; tone: string; on: number; dim: number; hi?: number; children: ReactNode }) {
  const o = clamp01(on);
  if (o < 0.005) return null;
  return (
    <div
      style={{
        ...abs(r),
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(tone, 0.45 + 0.5 * hi)}`,
        background: alpha(tone, 0.12 + 0.3 * hi),
        boxShadow: hi > 0.02 ? `0 0 ${Math.round(26 * hi)}px ${alpha(tone, 0.45 * hi)}` : undefined,
        opacity: o * (1 - 0.6 * dim),
        transform: `translateX(${-(1 - o) * 26}px)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: FONT.sans,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

/** Key over value rows; row `hiRow` gets a lit band (`hi` 0–1). */
function Rows({ rows, tone, hi, hiRow }: { rows: readonly { k: string; v: string }[]; tone: string; hi: number; hiRow: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 10px' }}>
      {rows.map((row, i) => {
        const h = i === hiRow ? clamp01(hi) : 0;
        return (
          <div
            key={row.k}
            style={{
              padding: '3px 10px',
              borderRadius: 10,
              border: `2px solid ${alpha(tone, 0.9 * h)}`,
              background: alpha(tone, 0.22 * h),
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 650, lineHeight: 1.12, color: h > 0.5 ? C.textStrong : C.muted, whiteSpace: 'nowrap' }}>{row.k}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, lineHeight: 1.12, color: C.textStrong, whiteSpace: 'nowrap' }}>{row.v}</div>
          </div>
        );
      })}
    </div>
  );
}

export interface WrapperStackProps {
  data?: number;
  seg?: number;
  segHdr?: number;
  segName?: number;
  pkt?: number;
  pktHdr?: number;
  pktName?: number;
  frame?: number;
  frameHdr?: number;
  frameName?: number;
  fcs?: number;
  lit?: Partial<Record<LayerKey, number>>;
  dim?: Partial<Record<LayerKey, number>>;
  /** Lights the destination field each device reads. */
  field?: { mac?: number; ip?: number; port?: number };
}

/** The full stack, STACK.w × STACK.h. Every prop defaults to 1 (shown) except lit/dim/field. */
export function WrapperStack(p: WrapperStackProps) {
  const lit = (k: LayerKey) => clamp01(p.lit?.[k] ?? 0);
  const dim = (k: LayerKey) => clamp01(p.dim?.[k] ?? 0);
  const v = (x: number | undefined) => (x === undefined ? 1 : x);
  const S = STACK;
  const fhCellH = (S.frameHdr.h - 2 * 10) / 3;
  return (
    <div style={{ position: 'relative', width: S.w, height: S.h }}>
      {/* outermost first: each wrapper sits under what it wraps */}
      <Wrap r={S.frame} tone={TONE.frame} on={v(p.frame)} lit={lit('frame')} dim={dim('frame')} radius={28} />
      <NameTag r={S.frame} tone={TONE.frame} text={NAMES.frame} on={v(p.frameName)} lit={lit('frame')} dim={dim('frame')} />
      {FRAME_HDR.map((t, i) => (
        <Cell
          key={t}
          r={{ x: S.frameHdr.x, y: S.frameHdr.y + i * (fhCellH + 10), w: S.frameHdr.w, h: fhCellH }}
          tone={TONE.frame}
          on={clamp01(v(p.frameHdr) * 3 - i)}
          dim={dim('frame')}
          hi={i === 0 ? p.field?.mac ?? 0 : 0}
        >
          <div style={{ textAlign: 'center', fontSize: 32, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{t}</div>
        </Cell>
      ))}
      <Cell r={S.fcs} tone={TONE.frame} on={v(p.fcs)} dim={dim('frame')}>
        <div style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, color: C.textStrong }}>{FCS}</div>
      </Cell>

      <Wrap r={S.packet} tone={TONE.packet} on={v(p.pkt)} lit={lit('packet')} dim={dim('packet')} />
      <NameTag r={S.packet} tone={TONE.packet} text={NAMES.packet} on={v(p.pktName)} lit={lit('packet')} dim={dim('packet')} />
      <Cell r={S.packetHdr} tone={TONE.packet} on={v(p.pktHdr)} dim={dim('packet')}>
        <Rows rows={PKT_HDR} tone={TONE.packet} hi={p.field?.ip ?? 0} hiRow={1} />
      </Cell>

      <Wrap r={S.segment} tone={TONE.segment} on={v(p.seg)} lit={lit('segment')} dim={dim('segment')} />
      <NameTag r={S.segment} tone={TONE.segment} text={NAMES.segment} on={v(p.segName)} lit={lit('segment')} dim={dim('segment')} />
      <Cell r={S.segmentHdr} tone={TONE.segment} on={v(p.segHdr)} dim={dim('segment')}>
        <Rows rows={SEG_HDR} tone={TONE.segment} hi={p.field?.port ?? 0} hiRow={1} />
      </Cell>

      {/* the data */}
      {v(p.data) > 0.005 ? (
        <div
          style={{
            ...abs(S.data),
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(TONE.data, 0.6 + 0.4 * lit('data'))}`,
            background: alpha(TONE.data, 0.08 + 0.06 * lit('data')),
            boxShadow: lit('data') > 0.02 ? `0 0 ${Math.round(30 * lit('data'))}px ${alpha(TONE.data, 0.35 * lit('data'))}` : undefined,
            opacity: clamp01(v(p.data)) * (1 - 0.6 * dim('data')),
            transform: `scale(${0.92 + 0.08 * clamp01(v(p.data))})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            fontFamily: FONT.sans,
          }}
        >
          <div style={{ fontSize: 46, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>{NAMES.data}</div>
          <div style={{ fontSize: 30, fontWeight: 650, color: C.text, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{DATA_SUB}</div>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------- compact (names only)

const CB = 66; // name band
const CI = 34; // side inset
export const COMPACT = { w: 600, h: 3 * CB + 150 + 3 * 22 } as const;

/** The four names nested in their colours, no headers. `lit` per layer (0–1). */
export function CompactStack({ lit = {}, on = 1 }: { lit?: Partial<Record<LayerKey, number>>; on?: number }) {
  const order: LayerKey[] = ['frame', 'packet', 'segment'];
  const boxes = order.map((k, i) => ({
    k,
    r: { x: i * CI, y: i * CB, w: COMPACT.w - 2 * i * CI, h: COMPACT.h - i * (CB + 22) } as Rect,
  }));
  const dataR: Rect = { x: 3 * CI, y: 3 * CB, w: COMPACT.w - 6 * CI, h: COMPACT.h - 3 * (CB + 22) };
  const l = (k: LayerKey) => clamp01(lit[k] ?? 0);
  return (
    <div style={{ position: 'relative', width: COMPACT.w, height: COMPACT.h, opacity: clamp01(on) }}>
      {boxes.map(({ k, r }) => (
        <div key={k}>
          <Wrap r={r} tone={TONE[k]} on={1} lit={l(k)} dim={0} />
          <div
            style={{
              position: 'absolute',
              left: r.x + 24,
              top: r.y + 12,
              fontFamily: FONT.sans,
              fontSize: 36,
              fontWeight: 850,
              lineHeight: 1.15,
              color: TONE[k],
              textShadow: l(k) > 0.02 ? `0 0 ${Math.round(18 * l(k))}px ${alpha(TONE[k], 0.8 * l(k))}` : undefined,
            }}
          >
            {LAYER[k].name}
          </div>
        </div>
      ))}
      <div
        style={{
          ...abs(dataR),
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(TONE.data, 0.6 + 0.4 * l('data'))}`,
          background: alpha(TONE.data, 0.08 + 0.08 * l('data')),
          boxShadow: l('data') > 0.02 ? `0 0 ${Math.round(28 * l('data'))}px ${alpha(TONE.data, 0.35 * l('data'))}` : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT.sans,
          fontSize: 40,
          fontWeight: 850,
          color: C.textStrong,
        }}
      >
        {LAYER.data.name}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- mini glyph (s01)

const G = { dw: 96, dh: 50, pad: 12, hdr: 30, tail: 18, gap: 6 } as const;
const gSeg = { w: G.pad + G.hdr + G.gap + G.dw + G.pad, h: G.pad * 2 + G.dh };
const gPkt = { w: G.pad + G.hdr + G.gap + gSeg.w + G.pad, h: G.pad * 2 + gSeg.h };
const gFr = { w: G.pad + G.hdr + G.gap + gPkt.w + G.gap + G.tail + G.pad, h: G.pad * 2 + gPkt.h };
export const GLYPH = { w: gFr.w, h: gFr.h } as const;

/**
 * Three unnamed wraps around a white block, GLYPH.w × GLYPH.h. Each 0–1 closes its wrap (header block in front;
 * the outer one also has its tail). `glow` lifts the whole thing.
 */
export function WrapGlyph({ data = 1, seg = 1, pkt = 1, frame = 1, glow = 0 }: { data?: number; seg?: number; pkt?: number; frame?: number; glow?: number }) {
  const frR: Rect = { x: 0, y: 0, w: gFr.w, h: gFr.h };
  const pkR: Rect = { x: G.pad + G.hdr + G.gap, y: G.pad, w: gPkt.w, h: gPkt.h };
  const sgR: Rect = { x: pkR.x + G.pad + G.hdr + G.gap, y: pkR.y + G.pad, w: gSeg.w, h: gSeg.h };
  const dR: Rect = { x: sgR.x + G.pad + G.hdr + G.gap, y: sgR.y + G.pad, w: G.dw, h: G.dh };
  const block = (r: Rect, tone: string, on: number, key: string, fill = 0.55) =>
    on > 0.005 ? <div key={key} style={{ ...abs(r), borderRadius: 6, background: alpha(tone, fill), opacity: clamp01(on) }} /> : null;
  const hdrOf = (outer: Rect): Rect => ({ x: outer.x + G.pad, y: outer.y + G.pad, w: G.hdr, h: outer.h - 2 * G.pad });
  const layers: { r: Rect; tone: string; on: number; k: string; tail?: boolean }[] = [
    { r: frR, tone: TONE.frame, on: frame, k: 'frame', tail: true },
    { r: pkR, tone: TONE.packet, on: pkt, k: 'packet' },
    { r: sgR, tone: TONE.segment, on: seg, k: 'segment' },
  ];
  return (
    <div style={{ position: 'relative', width: GLYPH.w, height: GLYPH.h }}>
      {layers.map(({ r, tone, on, k, tail }) => {
        const o = clamp01(on);
        if (o < 0.005) return null;
        return (
          <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: GLYPH.w, height: GLYPH.h, opacity: o }}>
            <div
              style={{
                ...abs(r),
                borderRadius: 14,
                border: `3px solid ${tone}`,
                background: alpha(tone, 0.08),
                boxShadow: `0 0 ${Math.round(10 + 20 * glow)}px ${alpha(tone, 0.35 + 0.25 * glow)}`,
                transform: `scale(${1 + 0.35 * (1 - o)})`,
              }}
            />
            {block(hdrOf(r), tone, o, `${k}-h`)}
            {tail ? block({ x: r.x + r.w - G.pad - G.tail, y: r.y + G.pad, w: G.tail, h: r.h - 2 * G.pad }, tone, o, `${k}-t`) : null}
          </div>
        );
      })}
      {block(dR, TONE.data, data, 'data', 0.92)}
    </div>
  );
}
