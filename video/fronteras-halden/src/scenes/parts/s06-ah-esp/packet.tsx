import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle, type IconName } from '../../../../../engine/src/ui';
import { ArrowHead, LoadGlyph, SvgIcon } from '../glyphs';
import { RoundBadge } from './marks';

/**
 * An IP packet drawn as two blocks, header | payload (s06's AH/ESP packets, s07's transport and
 * tunnel schemes). The header is DRAWN, never written: a device → device route (the same idea as
 * the truck's plate in Shipment), so no address is ever readable. The payload carries the shared
 * load (`LoadGlyph`, the same load as the bag and the box) or anything you pass. Each block can be
 * ciphered (hatched, a lock: «nadie ve qué lleva»), glow, and get an emerald tick. Captions sit
 * above the blocks. Sizes in px; nothing positions itself.
 */

/** Drawn route «this device → that device» (an engine icon, a line with a drawn arrowhead, an icon). */
export function RouteGlyph({ width, height, left = 'laptop', right = 'server', color = C.cyanSoft }: { width: number; height: number; left?: IconName; right?: IconName; color?: string }) {
  const ic = Math.min(height * 0.5, width * 0.26);
  const pad = ic * 0.7;
  const x0 = pad + ic / 2 + ic * 0.08;
  const x1 = width - pad - ic / 2 - ic * 0.08;
  const y = height / 2;
  const lw = Math.max(3, ic * 0.08);
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <SvgIcon name={left} x={pad} y={y} size={ic} color={color} strokeWidth={2.1} />
      <line x1={x0} y1={y} x2={x1 - ic * 0.3} y2={y} stroke={color} strokeWidth={lw} strokeLinecap="round" />
      <ArrowHead x={x1} y={y} angle={0} size={ic * 0.36} color={color} />
      <SvgIcon name={right} x={width - pad} y={y} size={ic} color={color} strokeWidth={2.1} />
    </svg>
  );
}

/** The shared load (two cartons and a written sheet), fitted into a box. */
export function LoadFit({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} viewBox="-86 -118 172 126" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <LoadGlyph x={0} y={0} scale={1} strokeWidth={3.4} />
    </svg>
  );
}

/** The cipher: hatching over the block, wiped in left → right, and a lock. */
export function CipherCover({ p, height, tone = C.cyan, radius = 12 }: { p: number; height: number; tone?: string; radius?: number }) {
  const k = clamp01(p);
  if (k <= 0.001) return null;
  const lock = Math.min(56, Math.max(30, height * 0.42));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        clipPath: `inset(0 ${((1 - k) * 100).toFixed(2)}% 0 0)`,
        background: `repeating-linear-gradient(135deg, ${alpha(tone, 0.26)} 0px, ${alpha(tone, 0.26)} 5px, transparent 5px, transparent 15px), ${C.ink900}`,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          width: lock * 1.5,
          height: lock * 1.5,
          borderRadius: lock,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.ink950, 0.9),
          border: `3px solid ${alpha(tone, 0.85)}`,
          opacity: clamp01((k - 0.4) / 0.6),
        }}
      >
        <Icon name="lock" size={lock} color={tone} strokeWidth={2.4} />
      </div>
    </div>
  );
}

export interface BlockSpec {
  width: number;
  /** Content drawn inside (px box = block minus padding). */
  content?: ReactNode | ((w: number, h: number) => ReactNode);
  cipher?: number;
  glow?: number;
  /** Glow colour (default the tone). */
  glowTone?: string;
  check?: number;
  caption?: ReactNode;
  captionP?: number;
  captionColor?: string;
  dim?: number;
  /** Fill of the block (default ink850). */
  fill?: string;
  /** Border colour (default the tone). */
  edge?: string;
  /** 0–1 fades this block in. Default 1. */
  show?: number;
}

const PAD = 10;

/** One block of a packet (a header or a payload). */
export function PacketBlock({ spec, height, tone = C.cyan, captionSize = 32, radius = 14 }: { spec: BlockSpec; height: number; tone?: string; captionSize?: number; radius?: number }) {
  const g = clamp01(spec.glow ?? 0);
  const gt = spec.glowTone ?? tone;
  const cw = spec.width - 2 * PAD;
  const ch = height - 2 * PAD;
  const content = typeof spec.content === 'function' ? spec.content(cw, ch) : spec.content;
  const cp = clamp01(spec.captionP ?? 1);
  return (
    <div style={{ position: 'relative', width: spec.width, height, flexShrink: 0, ...dimStyle(spec.dim ?? 0, clamp01(spec.show ?? 1)) }}>
      {spec.caption && cp > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: spec.width,
            bottom: height + 8,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: captionSize,
            fontWeight: 780,
            color: spec.captionColor ?? C.text,
            whiteSpace: 'nowrap',
            opacity: cp,
            transform: `translateY(${(1 - cp) * 6}px)`,
          }}
        >
          {spec.caption}
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: radius,
          background: spec.fill ?? C.ink850,
          border: `3px solid ${alpha(spec.edge ?? tone, 0.55 + 0.45 * g)}`,
          boxShadow: g > 0.01 ? `0 0 ${Math.round(14 + 26 * g)}px ${alpha(gt, 0.25 + 0.4 * g)}` : undefined,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: PAD - 3, top: PAD - 3, width: cw, height: ch, display: 'grid', placeItems: 'center' }}>{content}</div>
        <CipherCover p={spec.cipher ?? 0} height={height} tone={tone} radius={radius - 3} />
      </div>
      <RoundBadge icon="check" tone={C.emerald} p={spec.check ?? 0} size={Math.round(Math.min(58, Math.max(44, height * 0.42)))} style={{ position: 'absolute', right: -18, top: -20 }} />
    </div>
  );
}

/**
 * A packet: blocks side by side with a small gap, all the same height (header first). Use
 * `header` + `payload` for the usual pair; `blocks` for anything else.
 */
export function IpPacket({
  blocks,
  height = 120,
  gap = 8,
  tone = C.cyan,
  show = 1,
  glow = 0,
  frame,
  captionSize,
  style,
}: {
  blocks: BlockSpec[];
  height?: number;
  gap?: number;
  tone?: string;
  show?: number;
  /** Outline around the whole packet. */
  glow?: number;
  frame?: number;
  captionSize?: number;
  style?: CSSProperties;
}) {
  void frame;
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        gap,
        opacity: s,
        transform: `translateY(${(1 - s) * 12}px)`,
        borderRadius: RADIUS.md + 4,
        outline: g > 0.01 ? `3px solid ${alpha(tone, 0.6 * g)}` : undefined,
        outlineOffset: 8,
        boxShadow: g > 0.01 ? `0 0 ${Math.round(30 * g)}px ${alpha(tone, 0.3 * g)}` : undefined,
        ...style,
      }}
    >
      {blocks.map((b, i) => (
        <PacketBlock key={i} spec={b} height={height} tone={tone} captionSize={captionSize} />
      ))}
    </div>
  );
}

/** Total width of a packet's blocks. */
export function packetWidth(blocks: { width: number }[], gap = 8) {
  return blocks.reduce((s, b) => s + b.width, 0) + gap * Math.max(0, blocks.length - 1);
}
