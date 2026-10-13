import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { focusWeights } from '../../../../../engine/src/ui';
import { VEST_YELLOW, VestGlyph } from '../People';
import { Order, Warehouse, orderSize } from '../Warehouse';

/**
 * The three rule cards' illustrations: the same drawings the video used, small.
 * Every frame is local to the scene's Sequence; nothing here reads the timeline.
 */

/** Height of the art slot the cards give these drawings. */
export const ART_H = 260;

// ---------------------------------------------------------------------------
// Rule 1: the vest. It says you are inside; whether you can be trusted is still open.

const VEST_H = 198;
const VEST_BOX = { w: 300, h: ART_H } as const;
/** The «not decided yet» ring around the vest. */
const RING_R = 120;

export function VestArt({ frame, at, openAt, askAt }: { frame: number; at: number; /** «no es de fiar» */ openAt: number; /** «verificar» */ askAt: number }) {
  const show = Math.min(1, 0.35 + progress(frame, at - 4, 18, EASE.inOut));
  const open = progress(frame, openAt, 14, EASE.inOut);
  const ask = progress(frame, askAt, 12);
  const cx = VEST_BOX.w / 2;
  const cy = VEST_BOX.h / 2;
  // The badge sits on the ring, upper right.
  const R = RING_R;
  const bx = cx + R * Math.cos(-Math.PI / 4);
  const by = cy + R * Math.sin(-Math.PI / 4);
  return (
    <svg width={VEST_BOX.w} height={VEST_BOX.h} viewBox={`0 0 ${VEST_BOX.w} ${VEST_BOX.h}`} style={{ display: 'block', overflow: 'visible', opacity: show }}>
      {/* a soft hi-vis halo: «dentro» */}
      <circle cx={cx} cy={cy} r={RING_R - 10} fill={alpha(VEST_YELLOW, 0.07)} />
      {/* dashed grey: not decided yet */}
      {open > 0.001 ? (
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={alpha(C.muted, 0.9)}
          strokeWidth={3.5}
          strokeDasharray="11 9"
          strokeLinecap="round"
          opacity={open}
          transform={`rotate(${-20 * (1 - open)} ${cx} ${cy})`}
        />
      ) : null}
      <VestGlyph x={cx} y={cy} h={VEST_H} />
      {/* «verificar no es negar»: it asks for proof (amber dots), it does not say no */}
      {ask > 0.001 ? (
        <g transform={`translate(${bx} ${by}) scale(${0.7 + 0.3 * ask})`} opacity={Math.min(1, ask * 1.5)}>
          <circle r={26} fill={alpha(C.amber, 0.2)} />
          <circle r={19} fill={C.ink900} stroke={C.amber} strokeWidth={3.5} />
          {[-1, 0, 1].map((k) => (
            <circle key={k} cx={k * 8} cy={0} r={2.8} fill={C.amber} />
          ))}
        </g>
      ) : null}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Rule 2: the oficina (decides), the administrativo (communicates) and the mozo (applies).

/** Narrow enough to clear the card's number badge at its top-left corner. */
const TRIO = { w: 396, h: ART_H - 6 } as const;

export function TrioArt({
  frame,
  at,
  decideAt,
  comunicaAt,
  aplicaAt,
  endAt,
}: {
  frame: number;
  at: number;
  decideAt: number;
  comunicaAt: number;
  aplicaAt: number;
  /** The three verbs have been said: everybody back in the light. */
  endAt: number;
}) {
  const show = Math.min(1, 0.35 + progress(frame, at - 4, 18, EASE.inOut));
  const turn = focusWeights(frame, [decideAt, comunicaAt, aplicaAt], { end: endAt });
  const said = (t: number, dur = 12) => progress(frame, t, dur, EASE.inOut);
  // The pedido is already on the desk; the tick is the office's, and only the office's.
  const verdict = progress(frame, decideAt + 2, 10);
  const decision = said(comunicaAt - 2, 14);
  const printed = progress(frame, comunicaAt + 8, 8);
  const travel = said(aplicaAt - 2, 18);
  const landed = progress(frame, aplicaAt + 14, 8) * (1 - progress(frame, aplicaAt + 40, 24, EASE.inOut));
  return (
    <div style={{ width: TRIO.w, height: TRIO.h, opacity: show }}>
      <Warehouse
        width={TRIO.w}
        height={TRIO.h}
        variant="icon"
        deskSlip={1}
        verdict={verdict}
        printing={printed * (1 - travel)}
        trayGlow={landed}
        flows={{
          consult: { draw: 1, lit: 0.35 + 0.65 * turn.weights[0] },
          decision: { draw: 1, lit: 0.25 + 0.75 * decision, mark: said(comunicaAt - 2, 16) },
          issue: { draw: 1, lit: 0.25 + 0.75 * travel },
        }}
        order={{ show: printed, travel }}
        focus={{ office: turn.weights[0], admin: turn.weights[1], mozo: turn.weights[2] }}
        dim={{ office: 0.7 * turn.dims[0], admin: 0.7 * turn.dims[1], mozo: 0.7 * turn.dims[2] }}
        autoDim={false}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rule 3: the order with its clock. Short (the clock), scoped (what it names), revocable (annulled).

const ORDER_W = 320;

export function OrderArt({ frame, at, shortAt, scopeAt, revokeAt }: { frame: number; at: number; shortAt: number; scopeAt: number; revokeAt: number }) {
  const show = Math.min(1, 0.35 + progress(frame, at - 4, 18, EASE.inOut));
  const clockLit = progress(frame, shortAt, 10) * (1 - progress(frame, scopeAt + 4, 16, EASE.inOut));
  const glow = 0.7 * progress(frame, scopeAt, 10) * (1 - progress(frame, revokeAt - 2, 14, EASE.inOut));
  const revoked = progress(frame, revokeAt, 20, EASE.inOut);
  const size = orderSize(ORDER_W);
  return (
    <div style={{ width: size.w, height: size.h, opacity: show }}>
      <Order width={ORDER_W} expiry="30 min" clock={0.25} clockLit={clockLit} glow={glow} revoked={revoked} />
    </div>
  );
}
