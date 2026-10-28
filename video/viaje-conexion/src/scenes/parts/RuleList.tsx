import { Icon } from '../../../../engine/src/ui/Icon';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { RULES } from './data';

/**
 * The firewall's outbound rule list of s10: three rows (number · who · protocol and ports · verdict), read
 * from the top. Adapted from the field-row construction of zero-trust-halden's RuleCard (a steel card of
 * fields, no rose) but with rule numbers, «permitir»/«denegar» and a grey implicit row with no number.
 * `bar` (0-2, fractional) is the reading bar's row; `barOn` its opacity; `hit` lights a row where the bar
 * stopped; `passed` greys a row the bar went over without a match («no coincide»); `implicit` shows the
 * caption «denegación implícita» under the grey row. Native width RULE_W.
 */
export const RULE_W = 1500;
export const RULE_ROW_H = 66;
const GAP = 8;
const NUM_W = 76;
const SVC_W = 330;
const ACT_W = 232;
const STEEL = '#94a3b8';
const STEEL_SOFT = '#cbd5e1';

export function ruleRowTop(i: number): number {
  return i * (RULE_ROW_H + GAP);
}
/** Height of the three rows (the implicit caption hangs below this). */
export const RULE_H = ruleRowTop(RULES.length) - GAP;
export const RULE_IMPLICIT_H = 46;

export function RuleList({
  rows = [1, 1, 1],
  bar = 0,
  barOn = 0,
  hit = [0, 0, 0],
  passed = [0, 0, 0],
  implicit = 0,
}: {
  rows?: readonly number[];
  bar?: number;
  barOn?: number;
  hit?: readonly number[];
  passed?: readonly number[];
  implicit?: number;
}) {
  return (
    <div style={{ position: 'relative', width: RULE_W, height: RULE_H + RULE_IMPLICIT_H + 10 }}>
      {RULES.map((r, i) => {
        const grey = r.n === null;
        const reveal = rows[i] ?? 0;
        const h = hit[i] ?? 0;
        const ps = passed[i] ?? 0;
        const field = (w: number | undefined, first = false) => ({
          position: 'relative' as const,
          width: w,
          flex: w === undefined ? '1 1 auto' : undefined,
          alignSelf: 'stretch' as const,
          display: 'flex',
          alignItems: 'center',
          padding: '0 22px',
          borderLeft: first ? undefined : `2px solid ${alpha(STEEL, 0.28)}`,
          whiteSpace: 'nowrap' as const,
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: ruleRowTop(i),
              width: RULE_W,
              height: RULE_ROW_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              borderRadius: RADIUS.md,
              overflow: 'hidden',
              border: `2px solid ${h > 0.02 ? alpha(grey ? STEEL_SOFT : C.cyan, 0.9) : alpha(STEEL, grey ? 0.4 : 0.6)}`,
              borderStyle: grey ? 'dashed' : 'solid',
              background: h > 0.02 ? alpha(grey ? '#ffffff' : C.cyan, 0.07 + 0.07 * h) : `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
              boxShadow: h > 0.05 ? `0 0 ${Math.round(34 * h)}px ${alpha(grey ? '#ffffff' : C.cyan, 0.28 * h)}` : undefined,
              opacity: reveal * (1 - 0.5 * ps),
              transform: `translateY(${Math.round((1 - reveal) * 16)}px)`,
              fontFamily: FONT.sans,
            }}
          >
            {/* rule number (none for the implicit rule) */}
            <div style={{ ...field(NUM_W, true), justifyContent: 'center', padding: 0 }}>
              {grey ? (
                <span style={{ width: 22, height: 4, borderRadius: 2, background: alpha(STEEL, 0.7) }} />
              ) : (
                <span style={{ width: 44, height: 44, borderRadius: 22, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.16), border: `2px solid ${alpha(C.cyan, 0.7)}`, fontSize: 28, fontWeight: 850, color: C.cyanSoft }}>{r.n}</span>
              )}
            </div>
            <div style={{ ...field(undefined), fontSize: 32, fontWeight: 800, color: grey ? STEEL_SOFT : C.textStrong }}>{r.who}</div>
            <div style={{ ...field(SVC_W), fontFamily: FONT.mono, fontSize: 31, fontWeight: 750, color: C.text }}>
              {grey ? <span style={{ width: 70, height: 0, borderTop: `3px dashed ${alpha(STEEL, 0.6)}` }} /> : `${r.proto} ${r.ports}`}
            </div>
            <div style={{ ...field(ACT_W), justifyContent: 'center', padding: '0 12px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '4px 18px 6px 14px',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(grey ? STEEL : C.emerald, 0.75)}`,
                  background: alpha(grey ? STEEL : C.emerald, 0.12),
                  fontSize: 32,
                  fontWeight: 850,
                  color: grey ? STEEL_SOFT : '#a7f3d0',
                }}
              >
                <Icon name={grey ? 'x' : 'check'} size={30} color={grey ? STEEL_SOFT : C.emerald} strokeWidth={3} />
                {r.verdict}
              </span>
            </div>
          </div>
        );
      })}
      {/* «no coincide» beside a row the bar passed */}
      {RULES.map((_, i) => (
        <div key={`ps${i}`} style={{ position: 'absolute', left: RULE_W + 18, top: ruleRowTop(i) + 18, opacity: passed[i] ?? 0, fontFamily: FONT.sans, fontSize: 26, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>
          no coincide
        </div>
      ))}
      {/* reading bar */}
      {barOn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: bar * (RULE_ROW_H + GAP) - 6,
            width: RULE_W + 20,
            height: RULE_ROW_H + 12,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md + 4,
            border: `4px solid ${alpha('#ffffff', 0.85)}`,
            background: alpha('#ffffff', 0.05),
            boxShadow: `0 0 26px ${alpha('#ffffff', 0.25)}`,
            opacity: barOn,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      {/* caption of the grey row */}
      <div style={{ position: 'absolute', left: NUM_W, top: RULE_H + 6, opacity: implicit, transform: `translateY(${Math.round((1 - implicit) * 10)}px)`, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: STEEL_SOFT, whiteSpace: 'nowrap' }}>
        <Icon name="arrowUp" size={32} color={STEEL_SOFT} strokeWidth={2.4} />
        denegación implícita
      </div>
    </div>
  );
}
