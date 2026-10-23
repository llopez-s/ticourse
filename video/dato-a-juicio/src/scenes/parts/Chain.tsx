import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/**
 * The attacker's chain from the lesson (src/data/s1.ts, «La ventaja del defensor»): delivery · ejecución · persistencia · C2 ·
 * movimiento lateral. Five nodes joined by links; `broken` (0..1) breaks the link after node `BREAK_AFTER` and the chain parts;
 * `eyes` (0..1 each) puts an eye of «rastro» under a node. Nodes are absolutely placed in a `CHAIN_W`-wide box.
 */
export const CHAIN_W = 1660;
export const NODE_H = 96;
export const NODES = [
  { t: 'delivery', w: 236 },
  { t: 'ejecución', w: 258 },
  { t: 'persistencia', w: 310 },
  { t: 'C2', w: 132 },
  { t: 'movimiento lateral', w: 420 },
] as const;
const GAP = 76;
export const BREAK_AFTER = 2;

export function nodeX(i: number): number {
  let x = 0;
  for (let k = 0; k < i; k++) x += NODES[k].w + GAP;
  return x;
}
export function nodeCenter(i: number): number {
  return nodeX(i) + NODES[i].w / 2;
}

export function Chain({
  show,
  eyes,
  broken = 0,
  tone = C.sky,
  nodeSize = 40,
  style,
}: {
  /** 0..1 per node: how far it has entered. */
  show: readonly number[];
  /** 0..1 per node: the eye of «rastro» under it. */
  eyes?: readonly number[];
  broken?: number;
  tone?: string;
  nodeSize?: number;
  style?: CSSProperties;
}) {
  const shiftRight = (i: number) => (i > BREAK_AFTER ? { x: 34 * broken, y: 30 * broken, rot: 3.5 * broken } : { x: -10 * broken, y: 0, rot: -1.5 * broken });
  return (
    <div style={{ position: 'relative', width: CHAIN_W, height: NODE_H + 110, fontFamily: FONT.sans, ...style }}>
      {/* links between nodes */}
      {NODES.slice(0, -1).map((n, i) => {
        const cx = nodeX(i) + n.w + GAP / 2;
        const p = Math.min(show[i] ?? 0, show[i + 1] ?? 0);
        const isBreak = i === BREAK_AFTER;
        const a = shiftRight(i);
        const b = shiftRight(i + 1);
        return (
          <div key={`l${i}`} style={{ position: 'absolute', left: cx - 44, top: NODE_H / 2 - 22, width: 88, height: 44, opacity: p }}>
            {isBreak && broken > 0.02 ? (
              <>
                <div style={{ position: 'absolute', left: -(a.x === 0 ? 0 : 0) + a.x * 0.6, top: 0, width: 40, height: 44, boxSizing: 'border-box', border: `5px solid ${alpha(C.rose, 0.9)}`, borderRight: 'none', borderRadius: '22px 0 0 22px', transform: `rotate(${a.rot * 3}deg)` }} />
                <div style={{ position: 'absolute', left: 48 + b.x * 0.6, top: b.y * 0.5, width: 40, height: 44, boxSizing: 'border-box', border: `5px solid ${alpha(C.rose, 0.9)}`, borderLeft: 'none', borderRadius: '0 22px 22px 0', transform: `rotate(${b.rot * 3}deg)` }} />
                <svg width={88} height={44} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: broken }}>
                  <path d="M40 -6L46 14L36 24L48 50" fill="none" stroke={C.amber} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            ) : (
              <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', border: `5px solid ${alpha(tone, 0.75)}`, borderRadius: 22 }} />
            )}
          </div>
        );
      })}
      {NODES.map((n, i) => {
        const p = show[i] ?? 0;
        const sh = shiftRight(i);
        const eye = eyes?.[i] ?? 0;
        return (
          <div key={n.t} style={{ position: 'absolute', left: nodeX(i), top: 0, width: n.w, opacity: p, transform: `translate(${sh.x}px, ${sh.y + (1 - p) * 18}px) rotate(${sh.rot}deg)` }}>
            <div
              style={{
                height: NODE_H,
                boxSizing: 'border-box',
                display: 'grid',
                placeItems: 'center',
                borderRadius: RADIUS.lg,
                border: `3px solid ${alpha(tone, 0.8)}`,
                background: `linear-gradient(180deg, ${alpha(tone, 0.14)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
                fontSize: nodeSize,
                fontWeight: 800,
                color: C.textStrong,
                whiteSpace: 'nowrap',
              }}
            >
              {n.t}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14, opacity: eye, transform: `scale(${0.7 + 0.3 * eye})` }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(C.cyan, 0.85)}`, background: alpha(C.cyan, 0.14) }}>
                <Icon name="eye" size={40} color={C.cyan} strokeWidth={2.2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
