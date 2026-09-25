import { ACCENT, C, FONT, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, countUp, enter, fadeIn, fmtInt, progress } from '../../../../../engine/src/theme/motion';
import { Chip, Panel } from '../../../../../engine/src/ui';
import { DAILY_ALERTS, TAIL_RULES, TAIL_SHARE_PCT, TOP_RULES, TOP_SHARE_PCT } from '../../../data/s06-fatigue';
import { steps } from './timing';

/** Body-relative geometry (the panel body is 1728 × 596). */
const BAR_X = 40;
const BAR_MAX = 1000;
const SCALE = BAR_MAX / TOP_RULES[0].perDay;
const ROW0 = 28;
const ROW_STEP = 112;
const NAME_H = 44;
const BAR_H = 46;
const TAIL_Y = 386;
const TAIL_H = 10;
const TAIL_STEP = 15;
const BRACKET_X = 1186;
const LABEL_X = 1228;
/** The long tail is annotated right next to its (short) bars. */
const TAIL_BRACKET_X = BAR_X + Math.round(TAIL_RULES[0] * SCALE) + 40;
const TAIL_LABEL_X = TAIL_BRACKET_X + 42;

const headTop = ROW0 + NAME_H + 4;
const headBottom = ROW0 + 2 * ROW_STEP + NAME_H + 4 + BAR_H;
const tailBottom = TAIL_Y + (TAIL_RULES.length - 1) * TAIL_STEP + TAIL_H;

function Bracket({ x, top, bottom, color, draw }: { x: number; top: number; bottom: number; color: string; draw: number }) {
  const mid = (top + bottom) / 2;
  // The spine is drawn as one stroke; the pointer tick appears once the spine is complete
  // (a separate sub-path would restart the dash pattern and show up early).
  const d = `M${x - 16},${top} H${x} V${bottom} H${x - 16}`;
  const length = 32 + (bottom - top);
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${length} ${length}`}
        strokeDashoffset={length * (1 - draw)}
      />
      <path
        d={`M${x},${mid} H${x + 16}`}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={Math.max(0, Math.min(1, (draw - 0.8) * 5))}
      />
    </g>
  );
}

/**
 * Pareto of the daily alert volume by rule: three amber bars carry 78 % of it
 * (and zero real incidents), a grey long tail carries the rest. The three
 * rules get their names one by one as the narration names them.
 */
export function ParetoChart({
  frame,
  pareto,
  names,
  noIncidentAt,
}: {
  frame: number;
  pareto: number;
  names: readonly [number, number, number];
  noIncidentAt: number;
}) {
  const panelIn = enter(frame, pareto - 4, { distance: 30, duration: 16 });
  const bracketDraw = progress(frame, pareto + 22, 12, EASE.inOut);
  const share = countUp(frame, pareto + 28, 14, 0, TOP_SHARE_PCT);
  const namingEnd = names[2] + 40;

  return (
    <Panel
      title="Volumen de alertas por regla · media diaria"
      icon="chart"
      accent="amber"
      right={
        <Chip accent="muted" size={TYPE.small}>
          {`${fmtInt(DAILY_ALERTS)} / día`}
        </Chip>
      }
      style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, ...panelIn }}
    >
      {/* axis */}
      <div style={{ position: 'absolute', left: BAR_X - 2, top: 14, width: 2, height: tailBottom + 8 - 14, background: C.ink600 }} />

      {TOP_RULES.map((rule, i) => {
        const nameTop = ROW0 + i * ROW_STEP;
        const barTop = nameTop + NAME_H + 4;
        const grow = progress(frame, pareto + 2 + i * 4, 20, EASE.out);
        const named = progress(frame, names[i] - 2, 12);
        const next = i < 2 ? names[i + 1] : namingEnd;
        const glow = named * (1 - progress(frame, next - 2, 12));
        const lit = steps(frame, 1, [
          { at: names[0] - 2, to: i === 0 ? 1 : 0.42 },
          { at: names[1] - 2, to: i === 1 ? 1 : i === 0 ? 0.72 : 0.42 },
          { at: names[2] - 2, to: i === 2 ? 1 : 0.72 },
          { at: namingEnd, to: 1 },
        ]);
        const placeholder = fadeIn(frame, pareto + 24, 12) * (1 - named);
        return (
          <div key={rule.id} style={{ opacity: lit }}>
            <div
              style={{
                position: 'absolute',
                left: BAR_X + 4,
                top: nameTop,
                height: NAME_H,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                whiteSpace: 'nowrap',
                opacity: grow,
              }}
            >
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 650, color: C.muted }}>{rule.id}</span>
              <span style={{ position: 'relative', display: 'inline-block', height: NAME_H }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 6,
                    fontFamily: FONT.sans,
                    fontSize: TYPE.small,
                    fontStyle: 'italic',
                    color: C.faint,
                    opacity: placeholder,
                  }}
                >
                  ¿quién la dispara?
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: FONT.sans,
                    fontSize: TYPE.label,
                    fontWeight: 750,
                    color: C.textStrong,
                    lineHeight: `${NAME_H}px`,
                    opacity: named,
                    transform: `translateX(${(1 - named) * 18}px)`,
                  }}
                >
                  {rule.name}
                </span>
              </span>
            </div>
            <div
              style={{
                position: 'absolute',
                left: BAR_X,
                top: barTop,
                width: rule.perDay * SCALE * grow,
                height: BAR_H,
                borderRadius: '0 10px 10px 0',
                background: `linear-gradient(90deg, ${alpha(C.amber, 0.55)} 0%, ${C.amber} 100%)`,
                boxShadow: glow > 0 ? `0 0 ${30 * glow}px ${alpha(C.amber, 0.5 * glow)}` : 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: BAR_X + rule.perDay * SCALE * grow + 16,
                top: barTop,
                height: BAR_H,
                display: 'flex',
                alignItems: 'center',
                fontFamily: FONT.mono,
                fontSize: TYPE.small,
                fontWeight: 650,
                color: ACCENT.amber.soft,
                opacity: progress(frame, pareto + 16 + i * 4, 10),
                whiteSpace: 'nowrap',
              }}
            >
              {`${rule.pct} %`}
            </div>
          </div>
        );
      })}

      {TAIL_RULES.map((value, j) => {
        const grow = progress(frame, pareto + 14 + j * 2, 14, EASE.out);
        return (
          <div
            key={j}
            style={{
              position: 'absolute',
              left: BAR_X,
              top: TAIL_Y + j * TAIL_STEP,
              width: Math.max(6, value * SCALE) * grow,
              height: TAIL_H,
              borderRadius: '0 5px 5px 0',
              background: C.ink500,
            }}
          />
        );
      })}

      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1728} height={596}>
        <Bracket x={BRACKET_X} top={headTop} bottom={headBottom} color={C.amber} draw={bracketDraw} />
        <Bracket x={TAIL_BRACKET_X} top={TAIL_Y} bottom={tailBottom} color={C.ink500} draw={progress(frame, pareto + 34, 12, EASE.inOut)} />
      </svg>

      {/* 78 % of the volume, no real incident */}
      <div
        style={{
          position: 'absolute',
          left: LABEL_X,
          top: (headTop + headBottom) / 2,
          transform: 'translateY(-50%)',
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            fontSize: TYPE.hero,
            fontWeight: 800,
            color: C.amber,
            lineHeight: 1,
            letterSpacing: -1,
            fontVariantNumeric: 'tabular-nums',
            opacity: fadeIn(frame, pareto + 26, 8),
          }}
        >
          {`${Math.round(share)} %`}
        </div>
        <div style={{ fontSize: TYPE.body, fontWeight: 650, color: C.text, marginTop: 8, opacity: fadeIn(frame, pareto + 30, 10) }}>
          del volumen
        </div>
        <div style={{ marginTop: 20, ...enter(frame, noIncidentAt, { distance: 16, duration: 14 }) }}>
          <Chip accent="amber" icon="x" size={TYPE.label}>
            0 incidentes reales
          </Chip>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: TAIL_LABEL_X,
          top: (TAIL_Y + tailBottom) / 2,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 18,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
          opacity: fadeIn(frame, pareto + 40, 12),
        }}
      >
        <div style={{ fontSize: TYPE.h3, fontWeight: 750, color: C.muted, lineHeight: 1 }}>{`${TAIL_SHARE_PCT} %`}</div>
        <div style={{ fontSize: TYPE.small, fontWeight: 600, color: C.faint }}>resto de reglas</div>
      </div>
    </Panel>
  );
}
