import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui';
import type { Piece } from '../../data/canon';

/**
 * A small threat triangle for the «one piece is missing» schemas: three corner discs, `on` ones solid rose with their
 * icon, `missing` ones dashed amber with a question mark, the rest left neutral (the card says nothing about them).
 * A `MINI_W`×`MINI_H` box.
 */
export const MINI_W = 300;
export const MINI_H = 204;
const P: Record<Piece, { x: number; y: number }> = {
  intent: { x: 150, y: 36 },
  capability: { x: 40, y: 166 },
  opportunity: { x: 260, y: 166 },
};
const ICON: Record<Piece, IconName> = { intent: 'target', capability: 'gear', opportunity: 'unlock' };
const R = 32;

export function MiniTriangle({ on, missing, show = 1 }: { on: readonly Piece[]; missing: Piece; show?: number }) {
  const state = (p: Piece) => (p === missing ? 'missing' : on.includes(p) ? 'on' : 'quiet');
  const edge = (a: Piece, b: Piece) => {
    const k = state(a) === 'on' && state(b) === 'on';
    return <line key={a + b} x1={P[a].x} y1={P[a].y} x2={P[b].x} y2={P[b].y} stroke={k ? alpha(C.rose, 0.85) : alpha(C.ink500, 0.8)} strokeWidth={k ? 5 : 3} strokeDasharray={k ? undefined : '9 9'} strokeLinecap="round" />;
  };
  return (
    <div style={{ position: 'relative', width: MINI_W, height: MINI_H, opacity: show, fontFamily: FONT.sans }}>
      <svg width={MINI_W} height={MINI_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {edge('intent', 'capability')}
        {edge('capability', 'opportunity')}
        {edge('opportunity', 'intent')}
      </svg>
      {(Object.keys(P) as Piece[]).map((p) => {
        const s = state(p);
        const col = s === 'on' ? C.rose : s === 'missing' ? C.amber : C.ink500;
        return (
          <div
            key={p}
            style={{
              position: 'absolute',
              left: P[p].x - R,
              top: P[p].y - R,
              width: 2 * R,
              height: 2 * R,
              boxSizing: 'border-box',
              borderRadius: R,
              display: 'grid',
              placeItems: 'center',
              border: `4px ${s === 'on' ? 'solid' : 'dashed'} ${s === 'quiet' ? C.ink500 : alpha(col, 0.95)}`,
              background: s === 'on' ? alpha(C.rose, 0.2) : s === 'missing' ? alpha(C.amber, 0.1) : alpha(C.ink900, 0.9),
              boxShadow: s === 'missing' ? `0 0 28px ${alpha(C.amber, 0.45)}` : s === 'on' ? `0 0 20px ${alpha(C.rose, 0.35)}` : undefined,
            }}
          >
            {s === 'missing' ? (
              <span style={{ fontSize: 40, fontWeight: 850, color: C.amber }}>?</span>
            ) : (
              <Icon name={ICON[p]} size={34} color={s === 'on' ? C.roseSoft : C.faint} strokeWidth={2.2} />
            )}
          </div>
        );
      })}
    </div>
  );
}
