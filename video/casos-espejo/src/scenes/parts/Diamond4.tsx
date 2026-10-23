import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The Diamond Model as in V3 (Adversary on top, Capability left, Infrastructure right, Victim at the
 * bottom) with the APT1 table of the lesson filed under each vertex. Items wrap (unlike V3's), and a
 * `compact` mode keeps only the four vertex names as pills. Coordinates are stage-local.
 */
export type VertexKey = 'adv' | 'cap' | 'infra' | 'vic';

const META: Record<VertexKey, { label: string; tint: string }> = {
  adv: { label: 'Adversary', tint: C.rose },
  cap: { label: 'Capability', tint: C.amber },
  infra: { label: 'Infrastructure', tint: C.sky },
  vic: { label: 'Victim', tint: C.cyan },
};
const ORDER: VertexKey[] = ['adv', 'infra', 'vic', 'cap'];

export function vertexAt(v: VertexKey, cx: number, cy: number, hw: number, hh: number): { x: number; y: number } {
  return v === 'adv' ? { x: cx, y: cy - hh } : v === 'vic' ? { x: cx, y: cy + hh } : v === 'cap' ? { x: cx - hw, y: cy } : { x: cx + hw, y: cy };
}

export function Diamond4({
  cx,
  cy,
  hw,
  hh,
  cardW = 340,
  compact = false,
  items = {},
  show = [1, 1, 1, 1],
  itemShow = [1, 1, 1, 1],
  edges = 1,
  glow = 0,
}: {
  cx: number;
  cy: number;
  hw: number;
  hh: number;
  cardW?: number;
  compact?: boolean;
  /** Text filed under each vertex. */
  items?: Partial<Record<VertexKey, string>>;
  /** 0–1 per vertex in `adv, cap, infra, vic` order. */
  show?: readonly number[];
  itemShow?: readonly number[];
  edges?: number;
  glow?: number;
}) {
  const keys: VertexKey[] = ['adv', 'cap', 'infra', 'vic'];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, fontFamily: FONT.sans }}>
      <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {ORDER.map((a, i) => {
          const b = ORDER[(i + 1) % 4];
          const A = vertexAt(a, cx, cy, hw, hh);
          const B = vertexAt(b, cx, cy, hw, hh);
          const p = Math.max(0, Math.min(1, edges * 4 - i));
          if (p <= 0) return null;
          return <line key={a + b} x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p} stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeLinecap="round" />;
        })}
      </svg>
      {keys.map((k, i) => {
        const s = show[i] ?? 1;
        if (s <= 0) return null;
        const at = vertexAt(k, cx, cy, hw, hh);
        const m = META[k];
        const text = items[k];
        const vis = itemShow[i] ?? 1;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: at.x - cardW / 2,
              top: at.y,
              width: cardW,
              transform: `translateY(-50%) scale(${0.88 + 0.12 * s})`,
              opacity: s,
              boxSizing: 'border-box',
              padding: compact ? '8px 14px' : '12px 18px 14px',
              borderRadius: compact ? 999 : 20,
              border: `3px solid ${alpha(m.tint, 0.6 + 0.4 * glow)}`,
              background: `linear-gradient(180deg, ${alpha(m.tint, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 100%), ${C.ink900}`,
              boxShadow: glow > 0 ? `0 0 ${Math.round(34 * glow)}px ${alpha(m.tint, 0.4 * glow)}` : undefined,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: compact ? 28 : 36, fontWeight: 850, color: m.tint, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{m.label}</div>
            {!compact && text ? (
              <div style={{ marginTop: 6, fontSize: 28, fontWeight: 650, lineHeight: 1.18, color: C.textStrong, opacity: vis }}>{text}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
