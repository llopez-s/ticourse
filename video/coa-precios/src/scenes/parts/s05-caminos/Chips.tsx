import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { CHIPS, S05 } from '../../../data/s05-caminos';
import { GEOM } from './geom';

const VIOLET_SOFT = '#c4b5fd';
const EMERALD_SOFT = '#6ee7b7';
const GHOST = '#64748b';

/**
 * The two suppositions of the question, stacked under the shop: «Supón que todavía no han sacado nada»
 * and «Supón que lo importante está a salvo» (dashed: they are hypotheses). `show[i]` 0–1 each.
 */
export function SupposeChips({ show, out = 0 }: { show: [number, number]; out?: number }) {
  if (out >= 0.996) return null;
  return (
    <div style={{ position: 'absolute', left: CHIPS.x, top: CHIPS.y, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: CHIPS.gap, opacity: 1 - out }}>
      {S05.chips.map((chip, i) => (
        <div
          key={chip.rest}
          style={{
            height: 49,
            boxSizing: 'border-box',
            padding: '0 22px',
            borderRadius: 14,
            border: `3px dashed ${alpha(GHOST, 0.95)}`,
            background: alpha(C.ink900, 0.94),
            fontFamily: FONT.sans,
            fontSize: 33,
            lineHeight: '41px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            opacity: show[i],
            transform: `translateX(${(1 - show[i]) * -14}px)`,
          }}
        >
          <span style={{ color: C.muted, fontWeight: 700 }}>{chip.lead} </span>
          <span style={{ color: i === 1 ? EMERALD_SOFT : C.textStrong }}>{chip.rest}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * The name of the row under the hypothetical alarm, big enough to read (the matrix's own label is
 * texture). It sits on the row's left end, over its name and its first cell: no cell of the case is
 * shown as an alert. Rose dashed, like the alarm's band.
 */
export function AooTag({ show }: { show: number }) {
  if (show <= 0.004) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: GEOM.aoo.x - 2,
        top: GEOM.aoo.cy - 22,
        height: 44,
        boxSizing: 'border-box',
        padding: '0 16px',
        borderRadius: 10,
        border: `3px dashed ${alpha(C.rose, 0.9)}`,
        background: alpha(C.ink950, 0.97),
        fontFamily: FONT.sans,
        fontSize: 26,
        lineHeight: '37px',
        fontWeight: 850,
        letterSpacing: 0.6,
        color: VIOLET_SOFT,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateX(${(1 - show) * -10}px)`,
      }}
    >
      {S05.aoo}
    </div>
  );
}

/** A price tag (no figure on it), centred on (x, y): amber = what an action costs. `glow` 0–1. */
export function PriceTag({ x, y, size = 44, show, glow = 0 }: { x: number; y: number; size?: number; show: number; glow?: number }) {
  if (show <= 0.004) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="-20 -20 40 40"
      style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, overflow: 'visible', opacity: show, transform: `scale(${0.6 + 0.4 * show + 0.12 * glow}) rotate(${-14 + (1 - show) * -30}deg)`, filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(4 + 10 * glow)}px ${alpha(C.amber, 0.8 * glow)})` : undefined }}
    >
      <path d="M-17 -3 L-6 -15 H13 Q17 -15 17 -11 V11 Q17 15 13 15 H-6 L-17 3 Z" fill={glow > 0.5 ? C.amber : '#3a2606'} stroke={C.amber} strokeWidth={3.2} strokeLinejoin="round" />
      <circle cx={-7} cy={0} r={3.6} fill={C.ink950} stroke={glow > 0.5 ? C.ink950 : C.amber} strokeWidth={2} />
      <path d="M1 -5 H11 M1 2 H11" stroke={glow > 0.5 ? C.ink950 : alpha(C.amber, 0.8)} strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  );
}
