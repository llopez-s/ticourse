/**
 * Drawing bits of s04-arp (and the still background of s03-p1). Everything here is drawn in code.
 *   WrapperStack  the four wrappers nested, without text: trama (cyan, header in front + FCS tail) › paquete (amber)
 *                 › segmento (emerald) › datos (white). s03 shows it dimmed and still.
 *   FrameCard     the half-written frame of s04: «MAC de destino» (empty slot, later filled) · «MAC de origen» ·
 *                 the amber packet with «IP de destino».
 *   Lines         a head line and a few body lines on a dark plate, for labels the voice reads in one go.
 *   WrappedPacket the hop: an amber packet with its two IPs, optionally inside a cyan frame.
 */
import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { LAYER } from '../../../data/case';

const plate = (tone: string, on: number): CSSProperties => ({
  boxSizing: 'border-box',
  borderRadius: RADIUS.md,
  border: `3px solid ${alpha(tone, 0.55 + 0.45 * on)}`,
  background: alpha(C.ink950, 0.9),
  boxShadow: on > 0.02 ? `0 0 ${Math.round(30 * on)}px ${alpha(tone, 0.4 * on)}` : undefined,
});

/** One wrapper: a header block in front and the content; `tail` adds the FCS block behind (the frame only). */
function Wrap({ tone, head, tail = 0, children, pad = 16 }: { tone: string; head: number; tail?: number; children?: ReactNode; pad?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: pad,
        padding: pad,
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        borderRadius: RADIUS.md,
        border: `4px solid ${alpha(tone, 0.85)}`,
        background: alpha(tone, 0.06),
      }}
    >
      <div style={{ width: head, flexShrink: 0, borderRadius: RADIUS.sm, background: alpha(tone, 0.55) }} />
      <div style={{ flex: 1, position: 'relative' }}>{children}</div>
      {tail > 0 ? <div style={{ width: tail, flexShrink: 0, borderRadius: RADIUS.sm, background: alpha(tone, 0.35) }} /> : null}
    </div>
  );
}

/** The wrapper stack, no text. Size it with `width` × `height`. */
export function WrapperStack({ width, height }: { width: number; height: number }) {
  return (
    <div style={{ width, height }}>
      <Wrap tone={LAYER.frame.tone} head={Math.round(width * 0.12)} tail={Math.round(width * 0.05)} pad={22}>
        <Wrap tone={LAYER.packet.tone} head={Math.round(width * 0.1)} pad={20}>
          <Wrap tone={LAYER.segment.tone} head={Math.round(width * 0.08)} pad={18}>
            <div style={{ width: '100%', height: '100%', borderRadius: RADIUS.sm, border: `4px solid ${alpha(LAYER.data.tone, 0.8)}`, background: alpha(LAYER.data.tone, 0.12), boxSizing: 'border-box' }} />
          </Wrap>
        </Wrap>
      </Wrap>
    </div>
  );
}

const LABEL = 32;
const VALUE = 34;

function Cell({ label, children, sub, subOn = 0, tone, on = 0, width }: { label: string; children: ReactNode; sub?: string; subOn?: number; tone: string; on?: number; width: number }) {
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: FONT.sans }}>
      <div style={{ fontSize: LABEL, fontWeight: 700, lineHeight: 1.15, color: on > 0.5 ? C.textStrong : C.text, whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ height: 44, display: 'flex', alignItems: 'center' }}>{children}</div>
      <div style={{ height: 38, fontSize: LABEL, fontWeight: 750, lineHeight: 1.15, color: tone, opacity: subOn, whiteSpace: 'nowrap' }}>{sub}</div>
    </div>
  );
}

const mono = (color: string): CSSProperties => ({ fontFamily: FONT.mono, fontSize: VALUE, fontWeight: 700, color, whiteSpace: 'nowrap', lineHeight: 1.2 });

export const CARD_W = 1560;
export const CARD_H = 186;

/**
 * The frame being written. `slot` 0–1 pulses the empty destination; `fill` 0–1 types the gateway's MAC into it;
 * `two` 0–1 lights both destinations and shows who each one is.
 */
export function FrameCard({
  t,
  slot = 0,
  fill = 0,
  two = 0,
}: {
  t: { frame: readonly string[]; dst: string; src: string; srcValue: string; dstValue: string; dstWho: string; ipDst: string; ipValue: string; ipWho: string };
  slot?: number;
  fill?: number;
  two?: number;
}) {
  const cyan = LAYER.frame.tone;
  const amber = LAYER.packet.tone;
  const n = Math.round(clamp01(fill) * t.dstValue.length);
  const others = 1 - 0.5 * clamp01(two);
  return (
    <div style={{ ...plate(cyan, 0.35 + 0.5 * two), width: CARD_W, height: CARD_H, display: 'flex', alignItems: 'center', gap: 26, padding: '0 26px' }}>
      <div style={{ width: 196, fontFamily: FONT.sans, color: cyan, lineHeight: 1.15, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 38, fontWeight: 800 }}>{t.frame[0]}</div>
        <div style={{ fontSize: LABEL, fontWeight: 700, color: C.cyanSoft }}>{t.frame[1]}</div>
      </div>
      <Cell label={t.dst} tone={cyan} width={400} sub={t.dstWho} subOn={two} on={two}>
        <div
          style={{
            width: 380,
            height: 44,
            boxSizing: 'border-box',
            borderRadius: RADIUS.sm,
            border: `3px ${n > 0 ? 'solid' : 'dashed'} ${alpha(cyan, 0.5 + 0.5 * Math.max(slot, two))}`,
            background: alpha(cyan, 0.06 + 0.18 * Math.max(slot * (n > 0 ? 0 : 1), two)),
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 12,
          }}
        >
          <span style={mono(C.textStrong)}>{t.dstValue.slice(0, n)}</span>
        </div>
      </Cell>
      <div style={{ opacity: others }}>
        <Cell label={t.src} tone={cyan} width={380}>
          <span style={mono(C.cyanSoft)}>{t.srcValue}</span>
        </Cell>
      </div>
      <div style={{ ...plate(amber, 0.3 + 0.7 * two), height: CARD_H - 24, padding: '4px 22px', display: 'flex', alignItems: 'center' }}>
        <Cell label={t.ipDst} tone={amber} width={330} sub={t.ipWho} subOn={two} on={two}>
          <span style={mono('#fcd34d')}>{t.ipValue}</span>
        </Cell>
      </div>
    </div>
  );
}

/** Head + body lines on a dark plate. `on` lifts the border. */
export function Lines({ head, lines, tone, on = 0, size = 32, headSize = 36, mono: isMono = false, style }: { head?: string; lines: readonly ReactNode[]; tone: string; on?: number; size?: number; headSize?: number; mono?: boolean; style?: CSSProperties }) {
  return (
    <div style={{ ...plate(tone, clamp01(on)), display: 'inline-flex', flexDirection: 'column', gap: 6, padding: '12px 22px', fontFamily: FONT.sans, whiteSpace: 'nowrap', ...style }}>
      {head ? <div style={{ fontSize: headSize, fontWeight: 800, color: tone, lineHeight: 1.15 }}>{head}</div> : null}
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: size, fontWeight: 700, lineHeight: 1.18, color: C.textStrong, fontFamily: isMono ? FONT.mono : FONT.sans }}>
          {l}
        </div>
      ))}
    </div>
  );
}

export const PKT = { w: 500, h: 176 } as const;
export const FRM = { head: 64, tail: 40, pad: 16 } as const;
/** Outer size of a FrameShell: packet + header + tail + 2 gaps + 2 paddings + the 3 px border on each side. */
export const FRM_W = PKT.w + FRM.head + FRM.tail + 4 * FRM.pad + 6;
export const FRM_H = PKT.h + 2 * FRM.pad + 6;

/** The amber packet with its two addresses; `same` 0–1 lights the addresses («las mismas IP»). */
export function Packet({ t, same = 0, ttl, ttlOn = 0 }: { t: { packet: string; ipSrc: string; ipDst: string }; same?: number; ttl?: string; ttlOn?: number }) {
  const amber = LAYER.packet.tone;
  return (
    <div style={{ ...plate(amber, 0.4 + 0.6 * same), width: PKT.w, height: PKT.h, position: 'relative', padding: '14px 22px', fontFamily: FONT.sans }}>
      <div style={{ fontSize: LABEL, fontWeight: 800, color: amber, lineHeight: 1.15 }}>{t.packet}</div>
      <div style={{ height: 10 }} />
      {[t.ipSrc, t.ipDst].map((l) => (
        <div key={l} style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3, color: same > 0.5 ? '#fde68a' : C.textStrong, whiteSpace: 'nowrap' }}>
          {l}
        </div>
      ))}
      {ttl && ttlOn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: 16,
            top: 12,
            opacity: ttlOn,
            transform: `scale(${0.8 + 0.2 * ttlOn})`,
            padding: '2px 14px',
            borderRadius: RADIUS.pill,
            background: alpha(amber, 0.22),
            border: `2px solid ${amber}`,
            fontFamily: FONT.mono,
            fontSize: 32,
            fontWeight: 800,
            color: '#fde68a',
            whiteSpace: 'nowrap',
          }}
        >
          {ttl}
        </div>
      ) : null}
    </div>
  );
}

/** A cyan frame shell (header in front, FCS behind) sized to wrap a Packet; `children` go in the packet's slot. */
export function FrameShell({ on = 0, children }: { on?: number; children?: ReactNode }) {
  const cyan = LAYER.frame.tone;
  return (
    <div style={{ ...plate(cyan, on), width: FRM_W, height: FRM_H, display: 'flex', gap: FRM.pad, padding: FRM.pad }}>
      <div style={{ width: FRM.head, borderRadius: RADIUS.sm, background: alpha(cyan, 0.55) }} />
      <div style={{ width: PKT.w, height: PKT.h }}>{children}</div>
      <div style={{ width: FRM.tail, borderRadius: RADIUS.sm, background: alpha(cyan, 0.35) }} />
    </div>
  );
}
