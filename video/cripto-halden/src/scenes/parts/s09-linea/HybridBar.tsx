import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, dimStyle } from '../../../../../engine/src/ui';
import { HYBRID } from '../../../data/s09-linea';
import { HOUSE_KEY_SILVER } from '../Mailbox';
import { PaintIcon, PaintKey } from '../PaintMix';
import { WaxSeal } from '../WaxSeal';

export const BAR = { height: 82, nameW: 214, gap: 16, startW: 520 } as const;

function Segment({
  x,
  width,
  show,
  color,
  icons,
  lead,
  rest,
}: {
  x: number;
  width: number;
  show: number;
  color: string;
  icons: ReactNode;
  lead: string;
  rest: string;
}) {
  const p = clamp01(show);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: width * Math.min(1, 0.2 + 0.8 * p),
        height: BAR.height,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(color, 0.8)}`,
        background: alpha(color, 0.1),
        boxShadow: `0 0 ${Math.round(26 * p)}px ${alpha(color, 0.25 * p)}`,
        opacity: Math.min(1, p * 1.5),
        fontFamily: FONT.sans,
        fontSize: 32,
        whiteSpace: 'nowrap',
      }}
    >
      {icons}
      <span>
        <span style={{ fontWeight: 850, color }}>{lead}</span>
        <span style={{ fontWeight: 700, color: C.text }}>{rest}</span>
      </span>
    </div>
  );
}

/**
 * The HYBRID beat (s09-05): the connection as a bar in time — a short
 * asymmetric start (the paint and the seal) and a long symmetric rest (the
 * key) — with the exam name in violet at its head. Not positioned;
 * `width` × BAR.height.
 */
export function HybridBar({ width, start, rest, name, dim = 0 }: { width: number; start: number; rest: number; name: number; dim?: number }) {
  const n = clamp01(name);
  const restX = BAR.nameW + BAR.gap + BAR.startW + BAR.gap;
  return (
    <div style={{ position: 'relative', width, height: BAR.height, ...dimStyle(dim) }}>
      {n > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: BAR.nameW,
            height: BAR.height,
            boxSizing: 'border-box',
            display: 'grid',
            placeItems: 'center',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.violet, 0.85)}`,
            background: alpha(C.violetDeep, 0.7),
            boxShadow: `0 0 ${Math.round(30 * n)}px ${alpha(C.violet, 0.35 * n)}`,
            fontFamily: FONT.sans,
            fontSize: 42,
            fontWeight: 850,
            letterSpacing: 3,
            color: '#c4b5fd',
            opacity: Math.min(1, n * 1.4),
            transform: `scale(${0.85 + 0.15 * Math.min(1, n)})`,
          }}
        >
          {HYBRID.name}
        </div>
      ) : null}
      <Segment
        x={BAR.nameW + BAR.gap}
        width={BAR.startW}
        show={start}
        color={C.cyan}
        icons={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <PaintIcon size={40} />
            <WaxSeal size={42} />
          </span>
        }
        lead={HYBRID.start.lead}
        rest={HYBRID.start.rest}
      />
      <Segment
        x={restX}
        width={width - restX}
        show={rest}
        color={HOUSE_KEY_SILVER}
        icons={<PaintKey width={92} side="naviera" />}
        lead={HYBRID.rest.lead}
        rest={HYBRID.rest.rest}
      />
    </div>
  );
}
