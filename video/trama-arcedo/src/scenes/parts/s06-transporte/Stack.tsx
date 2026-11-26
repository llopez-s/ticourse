/**
 * The wrapper stack of s06, drawn in code with the video's colours (LAYER): trama (cyan, header in front + FCS tail)
 * around paquete (amber) around segmento (emerald) around datos (white). `lit` 0–1 dims every wrapper but the
 * segment and lights the segment with its name «segmento · capa 4».
 */
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { mix } from '../../../../../engine/src/ui';
import { LAYER } from '../../../data/case';
import { STACK_LABELS } from '../../../data/s06-transporte';

export const STACK_W = 900;
export const STACK_H = 540;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  head: number;
  tone: string;
}

const FRAME: Box = { x: 0, y: 0, w: STACK_W, h: STACK_H, head: 80, tone: LAYER.frame.tone };
const FCS_W = 70;
const PACKET: Box = { x: 110, y: 60, w: 690, h: 420, head: 70, tone: LAYER.packet.tone };
const SEGMENT: Box = { x: 200, y: 120, w: 580, h: 320, head: 70, tone: LAYER.segment.tone };
const DATA = { x: 290, y: 196, w: 470, h: 210 } as const;

function Wrapper({ b, opacity, glow = 0 }: { b: Box; opacity: number; glow?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `4px solid ${alpha(b.tone, 0.55 + 0.45 * glow)}`,
        background: alpha(b.tone, 0.05 + 0.08 * glow),
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(b.tone, 0.45 * glow)}` : undefined,
        opacity,
        overflow: 'hidden',
      }}
    >
      {/* the header this wrapper puts in front */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: b.head, height: '100%', background: alpha(b.tone, 0.3 + 0.2 * glow) }} />
    </div>
  );
}

function Name({ x, y, tone, size, opacity, children }: { x: number; y: number; tone: string; size: number; opacity: number; children: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: tone,
        whiteSpace: 'nowrap',
        lineHeight: 1.15,
        opacity,
      }}
    >
      {children}
    </div>
  );
}

export function Stack({ lit }: { lit: number }) {
  const other = mix(1, 0.3, lit);
  return (
    <div style={{ position: 'relative', width: STACK_W, height: STACK_H }}>
      <Wrapper b={FRAME} opacity={other} />
      {/* the frame's only tail */}
      <div
        style={{
          position: 'absolute',
          left: STACK_W - FCS_W,
          top: 0,
          width: FCS_W,
          height: STACK_H,
          boxSizing: 'border-box',
          borderRadius: `0 ${RADIUS.md}px ${RADIUS.md}px 0`,
          border: `4px solid ${alpha(FRAME.tone, 0.55)}`,
          background: alpha(FRAME.tone, 0.3),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: other,
        }}
      >
        <span style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 800, color: C.textStrong, writingMode: 'vertical-rl' }}>{STACK_LABELS.fcs}</span>
      </div>
      <Wrapper b={PACKET} opacity={other} />
      <Wrapper b={SEGMENT} opacity={1} glow={lit} />
      <div
        style={{
          position: 'absolute',
          left: DATA.x,
          top: DATA.y,
          width: DATA.w,
          height: DATA.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.sm,
          border: `3px solid ${alpha(LAYER.data.tone, 0.7)}`,
          background: alpha(LAYER.data.tone, 0.08),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: mix(1, 0.45, lit),
        }}
      >
        <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.text }}>{STACK_LABELS.data}</span>
      </div>

      <Name x={FRAME.head + 18} y={12} tone={FRAME.tone} size={28} opacity={other}>
        {STACK_LABELS.frame}
      </Name>
      <Name x={PACKET.x + PACKET.head + 18} y={PACKET.y + 12} tone={PACKET.tone} size={28} opacity={other}>
        {STACK_LABELS.packet}
      </Name>
      <Name x={SEGMENT.x + SEGMENT.head + 18} y={SEGMENT.y + 14} tone={SEGMENT.tone} size={mix(30, 38, lit)} opacity={1}>
        {STACK_LABELS.segment}
      </Name>
    </div>
  );
}

/** Where the segment's right edge sits in the stack (for a leader to the envelope art). */
export const SEGMENT_RIGHT = { x: SEGMENT.x + SEGMENT.w, y: SEGMENT.y + SEGMENT.h / 2 } as const;
