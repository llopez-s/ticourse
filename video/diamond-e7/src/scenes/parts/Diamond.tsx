import type { CSSProperties } from 'react';
import { C, FONT, TYPE, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The Diamond Model drawn the canonical way: Adversary on top, Capability on the
 * left, Infrastructure on the right, Victim at the bottom. Every scene that
 * shows the diamond uses this component so it looks the same across the video.
 * Coordinates are stage-local (the stage is 1728×660).
 */
export type VertexId = 'adv' | 'cap' | 'infra' | 'vic';

export const VERTEX: Record<VertexId, { label: string; question: string; tint: string }> = {
  adv: { label: 'Adversary', question: 'quién', tint: C.rose },
  cap: { label: 'Capability', question: 'con qué', tint: C.amber },
  infra: { label: 'Infrastructure', question: 'a través de qué', tint: C.sky },
  vic: { label: 'Victim', question: 'contra quién', tint: C.cyan },
};

/** Outer edges in drawing order (clockwise from the top). */
export const EDGES: [VertexId, VertexId][] = [
  ['adv', 'infra'],
  ['infra', 'vic'],
  ['vic', 'cap'],
  ['cap', 'adv'],
];

export type VertexState = {
  /** 0–1: appear (fade + scale). Default 1. */
  show?: number;
  /** Values filed under the vertex (≤ 2 short lines read best). */
  items?: string[];
  /** 0–1: how many of `items` are visible (reveals them in order). Default 1. */
  itemsShow?: number;
  /** Draw the value slot as UNKNOWN (dashed, muted). */
  unknown?: boolean;
  /** 0–1: pulse/glow emphasis. */
  glow?: number;
  /** 0–1: dim the vertex (e.g. while another is discussed). */
  dim?: number;
  /** Show the Spanish question under the label. Default true. */
  question?: boolean;
};

export type DiamondProps = {
  /** Centre and half-extents of the rhombus. */
  cx?: number;
  cy?: number;
  hw?: number;
  hh?: number;
  vertices?: Partial<Record<VertexId, VertexState>>;
  /** 0–1 draw progress of each outer edge, in EDGES order, or one number for all. */
  edges?: number | number[];
  /** 0–1: the socio-political (Adversary–Victim) and technology (Capability–Infrastructure) axes. */
  axes?: { sp?: number; tech?: number };
  /** Card width of every vertex. */
  cardW?: number;
  style?: CSSProperties;
};

export function vertexPoint(v: VertexId, { cx = 864, cy = 330, hw = 430, hh = 240 } = {}): { x: number; y: number } {
  switch (v) {
    case 'adv':
      return { x: cx, y: cy - hh };
    case 'vic':
      return { x: cx, y: cy + hh };
    case 'cap':
      return { x: cx - hw, y: cy };
    case 'infra':
      return { x: cx + hw, y: cy };
  }
}

export function Diamond({ cx = 864, cy = 330, hw = 430, hh = 240, vertices = {}, edges = 1, axes = {}, cardW = 330, style }: DiamondProps) {
  const geo = { cx, cy, hw, hh };
  const P = (v: VertexId) => vertexPoint(v, geo);
  const edgeP = (i: number) => (typeof edges === 'number' ? edges : (edges[i] ?? 0));
  return (
    <div style={{ position: 'absolute', inset: 0, ...style }}>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {EDGES.map(([a, b], i) => {
          const p = Math.max(0, Math.min(1, edgeP(i)));
          if (p <= 0) return null;
          const A = P(a);
          const B = P(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={A.x}
              y1={A.y}
              x2={A.x + (B.x - A.x) * p}
              y2={A.y + (B.y - A.y) * p}
              stroke={alpha(C.muted, 0.7)}
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
        <Axis from={P('adv')} to={P('vic')} p={axes.sp ?? 0} color={C.roseSoft} />
        <Axis from={P('cap')} to={P('infra')} p={axes.tech ?? 0} color={C.cyanSoft} />
      </svg>
      {(Object.keys(VERTEX) as VertexId[]).map((v) => (
        <VertexCard key={v} id={v} at={P(v)} state={vertices[v] ?? {}} width={cardW} />
      ))}
    </div>
  );
}

function Axis({ from, to, p, color }: { from: { x: number; y: number }; to: { x: number; y: number }; p: number; color: string }) {
  if (p <= 0) return null;
  const k = Math.min(1, p);
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={from.x + (to.x - from.x) * k}
      y2={from.y + (to.y - from.y) * k}
      stroke={color}
      strokeWidth={6}
      strokeDasharray="18 14"
      strokeLinecap="round"
      opacity={0.9}
    />
  );
}

function VertexCard({ id, at, state, width }: { id: VertexId; at: { x: number; y: number }; state: VertexState; width: number }) {
  const meta = VERTEX[id];
  const show = state.show ?? 1;
  if (show <= 0) return null;
  const items = state.items ?? [];
  const visible = Math.round(items.length * (state.itemsShow ?? 1));
  const glow = state.glow ?? 0;
  const dim = state.dim ?? 0;
  const tint = meta.tint;
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x - width / 2,
        top: at.y,
        width,
        transform: `translateY(-50%) scale(${0.85 + 0.15 * show})`,
        opacity: show * (1 - 0.6 * dim),
        boxSizing: 'border-box',
        padding: '14px 20px',
        borderRadius: 20,
        border: `3px solid ${alpha(tint, 0.55 + 0.45 * glow)}`,
        // Opaque base so the edges drawn underneath never show through the card.
        background: `linear-gradient(180deg, ${alpha(tint, 0.14 + 0.12 * glow)} 0%, ${alpha(C.ink900, 0.94)} 100%), ${C.ink900}`,
        boxShadow: glow > 0 ? `0 0 ${Math.round(40 * glow)}px ${alpha(tint, 0.5 * glow)}` : undefined,
        fontFamily: FONT.sans,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: TYPE.label + 4, fontWeight: 850, color: tint, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{meta.label}</div>
      {state.question !== false && <div style={{ fontSize: TYPE.small, fontWeight: 600, color: C.muted, marginTop: 2 }}>{meta.question}</div>}
      {state.unknown && (
        <div
          style={{
            marginTop: 10,
            padding: '6px 0',
            borderRadius: 12,
            border: `2px dashed ${alpha(C.muted, 0.7)}`,
            fontFamily: FONT.mono,
            fontSize: TYPE.label,
            fontWeight: 700,
            color: C.text,
            letterSpacing: 2,
          }}
        >
          UNKNOWN
        </div>
      )}
      {items.slice(0, visible).map((item) => (
        <div
          key={item}
          style={{
            marginTop: 8,
            fontFamily: FONT.mono,
            fontSize: TYPE.small,
            fontWeight: 600,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
