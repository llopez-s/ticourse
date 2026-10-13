import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { MODELS, NAME } from '../../../data/s02-dentro';
import { Person } from '../People';

/**
 * s02-04: the lesson's row, drawn as two panels. Left, the perimeter: ONE decision, at the line
 * painted across the entrance, and after it three requests that nobody looks at. Right, Zero
 * Trust: no line, and a decision on each of the three requests. A ring with a lens = somebody
 * decides here (neutral steel at the perimeter's line, which is today's firewall rule; cyan in
 * Zero Trust, where the control plane decides), dashed grey = nobody does, emerald = it goes
 * through. Everything draws once and stays still.
 */
export const MODEL_PANEL = { w: 836, h: 392 } as const;

const STEEL = '#94a3b8';
const STEEL_SOFT = '#cbd5e1';
const PAPER = '#e2e8f0';
const ROW_Y = [208, 264, 320] as const;
const X = { fig: 94, gate: 236, slip: 338, node: 566, end: 786 } as const;
/** The strip of floor the figure stands on, and the painted line of the perimeter. */
const FLOOR = { top: 346, feet: 368 } as const;
const FEET_Y = FLOOR.feet;

export function ModelPanel({
  kind,
  decided,
  flow,
}: {
  kind: 'perimeter' | 'zeroTrust';
  /** 0–1 per decision point: the perimeter has one (the entrance), Zero Trust one per request. */
  decided: number[];
  /** 0–1 per request: how far it has gone through. */
  flow: number[];
}) {
  const zt = kind === 'zeroTrust';
  const m = zt ? MODELS.zeroTrust : MODELS.perimeter;
  const tone = zt ? C.cyan : STEEL;
  return (
    <div
      style={{
        position: 'relative',
        width: MODEL_PANEL.w,
        height: MODEL_PANEL.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, zt ? 0.65 : 0.5)}`,
        background: `linear-gradient(180deg, ${alpha(tone, zt ? 0.1 : 0.07)} 0%, ${alpha(C.ink900, 0.92)} 46%)`,
        boxShadow: `0 22px 50px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 34, top: 18, fontSize: 48, fontWeight: 850, letterSpacing: -0.4, lineHeight: 1.1, color: zt ? C.cyan : STEEL_SOFT, whiteSpace: 'nowrap' }}>{m.head}</div>
      <div style={{ position: 'absolute', left: 34, top: 82, fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {m.lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>

      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={MODEL_PANEL.w} height={MODEL_PANEL.h} viewBox={`0 0 ${MODEL_PANEL.w} ${MODEL_PANEL.h}`}>
        {/* The floor */}
        <rect x={0} y={FLOOR.top} width={MODEL_PANEL.w} height={MODEL_PANEL.h - FLOOR.top} fill={alpha(C.ink700, 0.45)} />
        <line x1={0} y1={FLOOR.top} x2={MODEL_PANEL.w} y2={FLOOR.top} stroke={alpha(C.ink500, 0.8)} strokeWidth={2.5} />

        {/* The perimeter's one decision: the line painted across the entrance, as on the quay */}
        {!zt ? (
          <>
            <path d={`M ${X.gate - 1} ${FLOOR.top} L ${X.gate + 17} ${FLOOR.top} L ${X.gate + 3} ${MODEL_PANEL.h} L ${X.gate - 19} ${MODEL_PANEL.h} Z`} fill={alpha(PAPER, 0.9)} />
            <line x1={X.gate + 8} y1={ROW_Y[1] + 30} x2={X.gate + 8} y2={FLOOR.top} stroke={alpha(PAPER, 0.55)} strokeWidth={3} strokeLinecap="round" strokeDasharray="2 10" />
            <Decision x={X.gate + 8} y={ROW_Y[1]} lit={decided[0] ?? 0} tone={STEEL_SOFT} />
          </>
        ) : null}

        {ROW_Y.map((y, i) => {
          const f = clamp01(flow[i] ?? 0);
          const from = zt ? X.node + 26 : X.slip + 24;
          const to = from + (X.end - from) * f;
          return (
            <g key={y}>
              {/* The request's way: dotted while nothing has gone through */}
              <line x1={X.slip + 24} y1={y} x2={X.end} y2={y} stroke={alpha(C.ink500, 0.95)} strokeWidth={3} strokeLinecap="round" strokeDasharray="2 10" />
              {f > 0.01 ? (
                <>
                  <line x1={from} y1={y} x2={to} y2={y} stroke={C.emerald} strokeWidth={4.5} strokeLinecap="round" />
                  <path d={`M ${to - 11} ${y - 10} L ${to + 2} ${y} L ${to - 11} ${y + 10}`} fill="none" stroke={C.emerald} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" opacity={clamp01(f * 3)} />
                </>
              ) : null}
              {/* The request: a slip of paper */}
              <g transform={`translate(${X.slip} ${y})`}>
                <rect x={-15} y={-20} width={30} height={40} rx={4} fill={PAPER} stroke={alpha('#0f172a', 0.5)} strokeWidth={1.4} />
                <path d="M-8 -9 H8 M-8 0 H8 M-8 9 H2" stroke={alpha('#0f172a', 0.55)} strokeWidth={2.6} strokeLinecap="round" />
              </g>
              {/* Who decides on it */}
              {zt ? (
                <Decision x={X.node} y={y} lit={decided[i] ?? 0} />
              ) : (
                <circle cx={X.node} cy={y} r={21} fill={C.ink900} stroke={alpha(C.faint, 0.95)} strokeWidth={3} strokeDasharray="6 7" />
              )}
            </g>
          );
        })}

        <Person x={X.fig} y={FEET_Y} h={150} vest />
      </svg>
    </div>
  );
}

/** A decision point: a ring with a lens in it, in `tone`. Dim until `lit`. */
function Decision({ x, y, lit, tone = C.cyan }: { x: number; y: number; lit: number; tone?: string }) {
  const l = clamp01(lit);
  const stroke = alpha(tone, 0.35 + 0.65 * l);
  return (
    <g transform={`translate(${x} ${y})`} style={l > 0.01 ? { filter: `drop-shadow(0 0 ${Math.round(12 * l)}px ${alpha(tone, 0.7 * l)})` } : undefined}>
      <circle r={23} fill={C.ink900} stroke={stroke} strokeWidth={3.5} />
      <circle r={23} fill={alpha(tone, 0.16 * l)} />
      <circle cx={-2.5} cy={-2.5} r={8} fill="none" stroke={stroke} strokeWidth={3.2} />
      <line x1={3.6} y1={3.6} x2={10.5} y2={10.5} stroke={stroke} strokeWidth={3.6} strokeLinecap="round" />
    </g>
  );
}

/**
 * The name and its motto (violet: exam terms). `show` is the plate's 0–1 pop;
 * `said` brightens each half of the motto as the voice says it.
 */
export function NamePlate({ show, said }: { show: number; said: number[] }) {
  const p = Math.min(1, show);
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '20px 46px 24px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.18)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 44px ${alpha(C.violet, 0.28)}, 0 22px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, show * 1.3),
        transform: `translateY(${(1 - p) * 18}px) scale(${0.94 + 0.06 * p})`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Icon name="mortarboard" size={70} color={C.violet} />
        <span style={{ fontSize: 86, fontWeight: 900, letterSpacing: 3, lineHeight: 1.05, color: '#c4b5fd' }}>{NAME.term}</span>
      </div>
      <div style={{ fontSize: 48, fontWeight: 750, lineHeight: 1.2, whiteSpace: 'pre' }}>
        {NAME.motto.map((part, k) => (
          <span key={part.text} style={{ color: alpha(C.textStrong, 0.35 + 0.65 * clamp01(said[k] ?? 0)) }}>
            {k ? ` ${part.text}` : part.text}
          </span>
        ))}
      </div>
    </div>
  );
}
