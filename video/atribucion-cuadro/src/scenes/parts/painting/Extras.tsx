import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { CanvasArt, FURN, PAINT, Signature, signaturePoint } from './Art';
import { BrushHand } from './Details';
import { CANVAS, PD } from './geometry';

/** Standalone pieces of the painting's world: the zoomed corner, the provenance row and the museum label. */

/** The zoomed corner looks at this window of the painting (design units): signature, date and the frame's corner. */
const ZOOM = { x: 222, y: 428, w: 178, h: 92 } as const;

/** Height of a SignatureCorner `width` px wide. */
export function signatureCornerHeight(width: number): number {
  return (width * ZOOM.h) / ZOOM.w;
}

/**
 * The painting's bottom-right corner, enlarged: the same canvas, the same signature and date.
 * `paint` 0–1 writes them stroke by stroke; `hand` 0–1 shows the hand that paints them (it follows the
 * stroke and sticks out above the box); `lit` 0–1 turns signature, date and border amber (cheap to forge).
 */
export function SignatureCorner({ width, paint = 1, hand = 0, lit = 0, style }: { width: number; paint?: number; hand?: number; lit?: number; style?: CSSProperties }) {
  const height = signatureCornerHeight(width);
  const tip = signaturePoint(paint);
  const border = lit > 0.5 ? C.amber : FURN.steel;
  return (
    <svg width={width} height={height} viewBox={`${ZOOM.x} ${ZOOM.y} ${ZOOM.w} ${ZOOM.h}`} style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <clipPath id="sigcorner-clip">
          <rect x={ZOOM.x} y={ZOOM.y} width={ZOOM.w} height={ZOOM.h} rx={7} />
        </clipPath>
      </defs>
      <g clipPath="url(#sigcorner-clip)">
        <CanvasArt />
        <rect x={ZOOM.x} y={ZOOM.y} width={ZOOM.w} height={ZOOM.h} fill={alpha(PAINT.ground, 0.25)} />
        <Signature draw={paint} lit={lit} weight={0.8} />
        {/* the frame's corner */}
        <path d={`M ${CANVAS.x + CANVAS.w + PD.t / 2} ${ZOOM.y} V ${PD.h - PD.t / 2} H ${ZOOM.x}`} fill="none" stroke={PAINT.frame} strokeWidth={PD.t} />
        <path d={`M ${CANVAS.x + CANVAS.w} ${ZOOM.y} V ${CANVAS.y + CANVAS.h} H ${ZOOM.x}`} fill="none" stroke={PAINT.frameLine} strokeWidth={1.6} />
      </g>
      <rect x={ZOOM.x} y={ZOOM.y} width={ZOOM.w} height={ZOOM.h} rx={7} fill="none" stroke={border} strokeWidth={2.2} />
      {lit > 0.02 ? <rect x={ZOOM.x} y={ZOOM.y} width={ZOOM.w} height={ZOOM.h} rx={7} fill="none" stroke={alpha(C.amber, lit)} strokeWidth={2.2} /> : null}
      <BrushHand x={tip.x} y={tip.y} size={0.5} angle={-8} show={hand} />
    </svg>
  );
}

/** Height of a Provenance row `width` px wide with `count` cards. */
export function provenanceHeight(width: number, count = 5): number {
  return cardWidth(width, count) * 0.82 + 30;
}
const cardWidth = (width: number, count: number) => (width - (count - 1) * width * 0.03) / count;

/**
 * The painting's documented history («procedencia»): a row of archive cards on a rail, year after year —
 * each with a stamp and a few lines, none with a readable year (dashes only). `show` 0–1 files the cards
 * one by one, left to right; `lit` 0–1 turns stamps and rail emerald (costly, sustained evidence).
 */
export function Provenance({ width, count = 5, show = 1, lit = 0, style }: { width: number; count?: number; show?: number; lit?: number; style?: CSSProperties }) {
  const cw = cardWidth(width, count);
  const ch = cw * 0.82;
  const gap = width * 0.03;
  const height = ch + 30;
  const u = cw / 100;
  const tone = lit > 0.5 ? C.emerald : FURN.steel;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible', ...style }}>
      {/* the rail: one tick per card */}
      <path d={`M ${cw / 2} ${height - 8} H ${cw / 2 + (width - cw) * Math.max(0, Math.min(1, show * 1.05))}`} stroke={tone} strokeWidth={3} strokeLinecap="round" />
      {Array.from({ length: count }, (_, i) => {
        const p = Math.max(0, Math.min(1, show * count - i));
        if (p <= 0.001) return null;
        const x = i * (cw + gap);
        return (
          <g key={i} transform={`translate(${x} ${(1 - p) * 12})`} opacity={p}>
            <path d={`M ${cw / 2} ${ch} V ${height - 8}`} stroke={tone} strokeWidth={3} />
            <circle cx={cw / 2} cy={height - 8} r={5} fill={tone} />
            <rect x={0} y={0} width={cw} height={ch} rx={5 * u + 2} fill="#dcd6c6" stroke={alpha('#0f172a', 0.55)} strokeWidth={1.5} />
            <rect x={0} y={0} width={cw} height={17 * u} rx={5 * u + 2} fill="#bdb6a2" />
            {/* where a year would be: dashes, never digits */}
            <path d={`M ${10 * u} ${9 * u} h ${9 * u} m ${5 * u} 0 h ${6 * u} m ${5 * u} 0 h ${10 * u}`} stroke={alpha('#0f172a', 0.6)} strokeWidth={3 * u + 0.6} strokeLinecap="round" />
            <path d={`M ${10 * u} ${32 * u} H ${62 * u} M ${10 * u} ${46 * u} H ${50 * u} M ${10 * u} ${60 * u} H ${42 * u}`} stroke={alpha('#0f172a', 0.38)} strokeWidth={4 * u + 0.6} strokeLinecap="round" />
            <circle cx={76 * u} cy={56 * u} r={13 * u} fill="none" stroke={lit > 0.5 ? '#059669' : '#64748b'} strokeWidth={3.4 * u + 0.6} />
            <circle cx={76 * u} cy={56 * u} r={6 * u} fill={lit > 0.5 ? '#059669' : '#64748b'} />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * The museum label beside the painting («la cartela»): a judgment with its confidence, never a fact.
 * `text` is the line it carries (e.g. «atribuido a…»); `sub` an optional second line; `lit` 0–1 gives it
 * an emerald edge (well-founded); `textSize` px of the main line (default: the largest that fits the width —
 * e.g. 27 px for «atribuido a…» on a 220 px card; give it ≥ 280 px where the voice points at it).
 */
export function MuseumLabel({ width, text, sub, textSize, show = 1, lit = 0, style }: { width: number; text: string; sub?: string; textSize?: number; show?: number; lit?: number; style?: CSSProperties }) {
  if (show <= 0.001) return null;
  // The main line always fits the card: its size follows the width and the text's length.
  const size = textSize ?? Math.max(10, Math.min(Math.round(width / 6), Math.floor((width - 16) / (0.62 * text.length + 1))));
  const pad = Math.round(size * 0.5);
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: `${pad}px ${pad + 2}px ${pad + 2}px`,
        borderRadius: Math.max(3, size * 0.16),
        background: '#e9e3d2',
        border: `${Math.max(2, size * 0.07)}px solid ${lit > 0.5 ? C.emerald : '#8d8672'}`,
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(26 * lit)}px ${alpha(C.emerald, 0.45 * lit)}` : `0 6px 16px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        opacity: show,
        ...style,
      }}
    >
      <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.1, color: '#1f2937', whiteSpace: 'nowrap' }}>{text}</div>
      {sub ? <div style={{ marginTop: size * 0.2, fontSize: size * 0.72, fontWeight: 700, lineHeight: 1.15, color: '#374151' }}>{sub}</div> : null}
      <div style={{ marginTop: size * 0.36, height: Math.max(3, size * 0.14), width: '82%', borderRadius: 4, background: alpha('#1f2937', 0.32) }} />
      <div style={{ marginTop: size * 0.22, height: Math.max(3, size * 0.14), width: '56%', borderRadius: 4, background: alpha('#1f2937', 0.32) }} />
    </div>
  );
}
