import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Chip, Icon, clamp01 } from '../../../../../engine/src/ui';
import { ADVERSARY, EQUATION, RISK_LINES, RISK_MODE, SLE_CAPTION, type EqKind } from '../../../data/s02-evento';

export const STRIP_W = 860;
export const STRIP_H = 174;

/**
 * R-014's risk line: the premise of the whole scene. Two text lines at 32 px and, under them, the chip
 * «análisis · sin efectos» (it is an analysis: nothing happens to the port). `show` 0–1.
 */
export function RiskStrip({ show = 1 }: { show?: number }) {
  return (
    <div
      style={{
        width: STRIP_W,
        height: STRIP_H,
        boxSizing: 'border-box',
        padding: '14px 24px 14px 26px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink700}`,
        borderLeft: `6px solid ${C.cyan}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        fontFamily: FONT.sans,
        opacity: show,
        transform: `translateY(${(1 - show) * 14}px)`,
      }}
    >
      {RISK_LINES.map((l, k) => (
        <div key={k} style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.28, color: C.text, whiteSpace: 'nowrap' }}>
          {k === 0 ? (
            <>
              <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>R-014</span>
              <span>{l.slice('R-014'.length)}</span>
            </>
          ) : (
            l
          )}
        </div>
      ))}
      <div style={{ marginTop: 10 }}>
        <Chip accent="muted" icon="eye" size={30}>
          {RISK_MODE}
        </Chip>
      </div>
    </div>
  );
}

/**
 * PAPER GOVERNOR's tag: a label, never a portrait. A paper badge in a round rose seal, the name with its section
 * and what it lives on. Rose, the adversary's colour. ~800 px wide.
 */
export function AdversaryTag({ glow = 0 }: { glow?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 22,
        padding: '16px 30px 16px 20px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.rose, 0.14)} 0%, ${alpha(C.ink900, 0.94)} 100%)`,
        boxShadow: `0 0 ${Math.round(26 + 20 * glow)}px ${alpha(C.rose, 0.2 + 0.2 * glow)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          width: 78,
          height: 78,
          flexShrink: 0,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${alpha(C.rose, 0.8)}`,
          background: alpha(C.roseDeep, 0.8),
        }}
      >
        <Icon name="file" size={44} color={C.roseSoft} strokeWidth={2.2} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, letterSpacing: 1, color: C.roseSoft }}>{ADVERSARY.name}</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: C.faint }}>·</span>
          <span style={{ fontSize: 34, fontWeight: 750, color: C.text }}>{ADVERSARY.section}</span>
        </div>
        <div style={{ marginTop: 4, fontSize: 32, fontWeight: 650, color: C.text }}>{ADVERSARY.line}</div>
      </div>
    </div>
  );
}

const KIND_STYLE: Record<EqKind, { color: string; weight: number; mono?: boolean }> = {
  term: { color: '#c4b5fd', weight: 850 },
  op: { color: C.muted, weight: 700 },
  num: { color: C.textStrong, weight: 800 },
  result: { color: C.roseSoft, weight: 900 },
};

/**
 * «SLE = AV × EF = 400.000 × 0,25 = 100.000 €» and its caption «lo que cuesta UN evento». The three groups light
 * in turn (`groups` 0–1 each), the caption on `caption`. Everything is laid out from the start so nothing shifts.
 */
export function Equation({ groups, caption }: { groups: readonly [number, number, number]; caption: number }) {
  return (
    <div style={{ fontFamily: FONT.sans, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 20, fontSize: 58, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
        {EQUATION.map((group, gi) => (
          <span
            key={gi}
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 20,
              opacity: clamp01(groups[gi]),
              transform: `translateY(${(1 - clamp01(groups[gi])) * 12}px)`,
            }}
          >
            {group.map((p, k) => {
              const st = KIND_STYLE[p.kind];
              return (
                <span key={k} style={{ color: st.color, fontWeight: st.weight }}>
                  {p.text}
                </span>
              );
            })}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 6, fontSize: 38, fontWeight: 750, color: C.text, opacity: clamp01(caption), transform: `translateY(${(1 - clamp01(caption)) * 8}px)` }}>
        {SLE_CAPTION[0]} <span style={{ color: C.cyan, fontWeight: 900 }}>{SLE_CAPTION[1]}</span> {SLE_CAPTION[2]}
      </div>
    </div>
  );
}
