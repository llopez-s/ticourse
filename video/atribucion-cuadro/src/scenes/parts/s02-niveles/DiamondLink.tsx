import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { S02_DIAMOND } from '../../../data/s02-niveles';
import { Diamond, diamondLayout } from '../Diamond';

const VIOLET_SOFT = '#c4b5fd';
export const LINK = { w: 520, h: 270, name: 26 } as const;

type P = { x: number; y: number };

/**
 * s01's small diamond beside the three lanes, and how its corners CORRESPOND to them — dotted connectors,
 * never an equals sign between a corner and a band: Capability and Infrastructure reach the machine lane;
 * the Adversary corner reaches the operator lane («operator: teclea») and the sponsor lane («customer:
 * encarga»). Nothing labels Meridian's customer. Stage coordinates: (x, y) is the diamond's top-left and
 * `ends[i]` the right end of lane i (0 = bottom), where its connector starts.
 */
export function DiamondLink({ x, y, ends, show = 1, operator = 0, customer = 0, machine = 0, chip = 0, dim = 0 }: { x: number; y: number; ends: readonly [P, P, P]; show?: number; operator?: number; customer?: number; machine?: number; chip?: number; dim?: number }) {
  if (show <= 0.001) return null;
  const L = diamondLayout(LINK.w, LINK.h, LINK.name);
  const adv = L.card.adv;
  const cap = L.card.cap;
  const infra = L.card.infra;
  const dots = { fill: 'none', strokeWidth: 4, strokeLinecap: 'round' as const, strokeDasharray: '1 11' };
  const advLeft = { x: x + adv.x - 6, y: y + adv.y + adv.h * 0.62 };
  const advTop = { x: x + adv.x + adv.w / 2, y: y + adv.y - 6 };
  const bracketY = y + cap.y + cap.h + 26;
  const capX = x + cap.x + cap.w / 2;
  const infraX = x + infra.x + infra.w / 2;
  const role = (r: { term: string; does: string }, p: number, end: P) =>
    p > 0.001 ? (
      <div style={{ position: 'absolute', right: 1728 - end.x + 14, top: end.y - 21, fontFamily: FONT.sans, fontSize: 32, lineHeight: 1.3, whiteSpace: 'nowrap', opacity: p, transform: `translateX(${(1 - p) * 12}px)` }}>
        <span style={{ fontWeight: 850, color: VIOLET_SOFT }}>{r.term}:</span>
        <span style={{ fontWeight: 750, color: C.textStrong }}> {r.does}</span>
      </div>
    ) : null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, opacity: show * (1 - 0.6 * dim), filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined }}>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
        {/* Adversary → the operator lane and the sponsor lane */}
        <path d={`M ${ends[1].x} ${ends[1].y} C ${ends[1].x + 90} ${ends[1].y} ${advLeft.x - 90} ${advLeft.y} ${advLeft.x} ${advLeft.y}`} {...dots} stroke={alpha('#e2e8f0', 0.9)} opacity={operator} />
        <path d={`M ${ends[2].x} ${ends[2].y} H ${advTop.x - 46} Q ${advTop.x} ${ends[2].y} ${advTop.x} ${advTop.y}`} {...dots} stroke={alpha('#e2e8f0', 0.9)} opacity={customer} />
        {/* Capability + Infrastructure → the machine lane */}
        <path d={`M ${ends[0].x} ${bracketY} H ${infraX} M ${capX} ${bracketY} V ${y + cap.y + cap.h + 6} M ${infraX} ${bracketY} V ${y + infra.y + infra.h + 6}`} {...dots} stroke={alpha(C.cyan, 0.95)} opacity={machine} />
      </svg>
      <div style={{ position: 'absolute', left: x, top: y }}>
        <Diamond width={LINK.w} height={LINK.h} nameSize={LINK.name} named={{ adv: 1, cap: 1, infra: 1 }} lit={{ adv: Math.max(operator, customer) * 0.9, cap: machine, infra: machine }} unknown={1} />
      </div>
      {role(S02_DIAMOND.operator, operator, ends[1])}
      {role(S02_DIAMOND.customer, customer, ends[2])}

      {/* the chip: the correspondence in words */}
      {chip > 0.001 ? (
        <div style={{ position: 'absolute', left: x - 30, width: LINK.w + 60, top: y + LINK.h + 8, display: 'flex', justifyContent: 'center', opacity: chip, transform: `translateY(${(1 - chip) * 10}px)` }}>
          <div style={{ padding: '6px 20px 8px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.violet, 0.5)}`, background: alpha('#1a1033', 0.92), fontFamily: FONT.sans, fontSize: 26, fontWeight: 800, lineHeight: 1.24, whiteSpace: 'nowrap', textAlign: 'center' }}>
            <div>
              <span style={{ color: VIOLET_SOFT }}>{S02_DIAMOND.machine.terms[0]}</span>
              <span style={{ color: C.muted }}> + </span>
              <span style={{ color: VIOLET_SOFT }}>{S02_DIAMOND.machine.terms[1]}</span>
              <span style={{ color: C.muted }}> = </span>
              <span style={{ color: C.cyanSoft }}>{S02_DIAMOND.machine.is}</span>
            </div>
            <div>
              <span style={{ color: VIOLET_SOFT }}>{S02_DIAMOND.adversary.term}</span>
              <span style={{ color: C.muted }}> = </span>
              <span style={{ color: VIOLET_SOFT }}>{S02_DIAMOND.adversary.parts[0]}</span>
              <span style={{ color: C.muted }}> + </span>
              <span style={{ color: VIOLET_SOFT }}>{S02_DIAMOND.adversary.parts[1]}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
