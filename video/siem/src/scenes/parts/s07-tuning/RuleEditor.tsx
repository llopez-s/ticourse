import type { CSSProperties } from 'react';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha } from '../../../theme/tokens';
import { EASE, enter, fadeIn, lerp, progress, pulse, typewriter } from '../../../theme/motion';
import { Chip, Icon, MonoLine, Panel, Toggle, type IconName } from '../../../ui';
import { BROAD_EXCLUSION, GOOD_EXCLUSION, RULE } from '../../../data/s07-tuning';
import { mixColor, steps } from './timing';

export interface EditorTimes {
  afinar: number;
  exclude: number;
  ruleOn: number;
  documented: number;
  countPhase: number;
  overtunePhase: number;
  overtune: number;
  alarm: number;
  falseNeg: number;
}

const PAD = 28;
const ROW_H = 96;

function SectionLabel({ top, children }: { top: number; children: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD,
        top,
        fontFamily: FONT.sans,
        fontSize: TYPE.small,
        fontWeight: 750,
        color: C.muted,
        letterSpacing: 1.5,
      }}
    >
      {children}
    </div>
  );
}

/** One exclusion line in the rule: icon tile, typed title, detail, optional status chip. */
function ExclusionRow({
  top,
  width,
  color,
  icon,
  title,
  detail,
  detailIn,
  chip,
  style,
}: {
  top: number;
  width: number;
  color: string;
  icon: IconName;
  title: string;
  detail: string;
  detailIn: number;
  chip?: { label: string; accent: 'emerald' | 'rose'; icon: IconName; at: number; frame: number };
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD,
        top,
        width,
        height: ROW_H,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 20px',
        borderRadius: RADIUS.md,
        background: alpha(color, 0.09),
        border: `2px solid ${alpha(color, 0.7)}`,
        ...style,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: alpha(color, 0.14),
          border: `2px solid ${alpha(color, 0.45)}`,
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={32} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: TYPE.label,
            fontWeight: 700,
            color: C.textStrong,
            whiteSpace: 'pre',
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4, height: 44 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: C.muted, whiteSpace: 'nowrap', opacity: detailIn }}>
            {detail}
          </span>
          {chip && chip.frame >= chip.at ? (
            <span style={{ display: 'inline-flex', ...enter(chip.frame, chip.at, { distance: 12, duration: 12, axis: 'x' }) }}>
              {/* Narrated word ("documenta", "demasiado amplia"): label size, slim padding to fit the row. */}
              <Chip accent={chip.accent} icon={chip.icon} size={TYPE.label} style={{ padding: '3px 16px', gap: 8 }}>
                {chip.label}
              </Chip>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * The SIEM rule editor for R-112. The rule stays ACTIVE throughout: the
 * benign backup pattern is excluded (then documented), "Desactivar regla" is
 * struck out, and at the end an over-broad exclusion turns the row rose.
 */
export function RuleEditor({
  frame,
  fps,
  t,
  width,
  height,
}: {
  frame: number;
  fps: number;
  t: EditorTimes;
  width: number;
  height: number;
}) {
  const inner = width - PAD * 2;
  const opacity = steps(frame, 0.55, [
    { at: t.afinar, to: 1 },
    { at: t.documented, to: 0.72 },
    { at: t.countPhase, to: 0.42 },
    { at: t.overtunePhase, to: 1 },
    { at: t.falseNeg + 6, to: 0.8 },
  ], 14);
  const alarmOn = frame >= t.alarm;
  const glow = alarmOn
    ? 0.7 * progress(frame, t.alarm, 12) * (1 - progress(frame, t.falseNeg + 10, 20))
    : 0.6 * progress(frame, t.afinar, 14) * (1 - progress(frame, t.documented - 8, 14));

  // Rule stays on: emerald halo around the toggle, the disable button gets struck out.
  const keepOn = progress(frame, t.ruleOn - 2, 10);
  const halo = keepOn * (0.55 + 0.45 * pulse(frame - t.ruleOn, fps, 0.8)) * (1 - 0.6 * progress(frame, t.ruleOn + 90, 20));
  const strike = progress(frame, t.ruleOn + 2, 10, EASE.inOut);
  const spotlight = keepOn * (1 - 0.7 * progress(frame, t.documented - 6, 14));

  // Good exclusion: typed at `exclude`, cyan while new, emerald once documented.
  const goodTitle = typewriter(GOOD_EXCLUSION.title, frame, t.exclude + 2, fps, 40);
  const goodIn = frame >= t.exclude ? 1 : 0;
  const goodColor = mixColor(C.cyan, C.emerald, progress(frame, t.documented, 12));
  const placeholder = 1 - progress(frame, t.exclude - 4, 6);

  // Over-broad exclusion: typed at `overtune`, turns rose at `alarm`.
  const broadTitle = typewriter(BROAD_EXCLUSION.title, frame, t.overtune + 2, fps, 44);
  const broadColor = mixColor(C.cyan, C.rose, progress(frame, t.alarm, 10));

  return (
    <Panel
      title={`Editor de reglas · ${RULE.id} ${RULE.name}`}
      icon="gear"
      accent={alarmOn ? 'rose' : 'cyan'}
      glow={glow}
      style={{ position: 'absolute', left: 0, top: 0, width, height, opacity }}
    >
      {/* State row: toggle ON + the tempting shortcut, struck out. */}
      <div style={{ position: 'absolute', left: PAD - 10, top: 22, width: inner + 10, height: 64, display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* "la regla sigue activa": the toggle + label get an emerald frame while the voice says it. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            height: 64,
            padding: '0 22px 0 8px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.emerald, 0.75 * spotlight)}`,
            background: alpha(C.emerald, 0.1 * spotlight),
          }}
        >
          <div style={{ borderRadius: RADIUS.pill, boxShadow: `0 0 0 ${6 * halo}px ${alpha(C.emerald, 0.28 * halo)}, 0 0 ${28 * halo}px ${alpha(C.emerald, 0.5 * halo)}` }}>
            <Toggle on={1} accent="emerald" />
          </div>
          <span
            style={{
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontWeight: 750,
              color: mixColor(C.text, ACCENT.emerald.soft, keepOn),
              whiteSpace: 'nowrap',
            }}
          >
            Regla ACTIVA
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 60,
            padding: '0 22px',
            borderRadius: 12,
            border: `2px dashed ${mixColor(C.ink500, C.rose, strike)}`,
            color: mixColor(C.muted, C.roseSoft, strike),
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 650,
            whiteSpace: 'nowrap',
            opacity: 1 - 0.2 * strike,
          }}
        >
          <Icon name="power" size={30} color={mixColor(C.muted, C.roseSoft, strike)} />
          Desactivar regla
          <div
            style={{
              position: 'absolute',
              left: 12,
              top: 27,
              height: 4,
              width: `calc(${strike * 100}% - ${24 * strike}px)`,
              borderRadius: 2,
              background: C.rose,
            }}
          />
          {strike > 0 ? (
            <div
              style={{
                position: 'absolute',
                right: -14,
                top: -14,
                width: 32,
                height: 32,
                borderRadius: 16,
                display: 'grid',
                placeItems: 'center',
                background: C.rose,
                transform: `scale(${lerp(frame, [t.ruleOn + 8, t.ruleOn + 14], [0, 1])})`,
              }}
            >
              <Icon name="x" size={22} color={C.ink950} strokeWidth={3} />
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ position: 'absolute', left: PAD, right: PAD, top: 104, height: 2, background: C.ink700 }} />

      <SectionLabel top={122}>CONDICIÓN</SectionLabel>
      <div
        style={{
          position: 'absolute',
          left: PAD,
          top: 162,
          width: inner,
          padding: '16px 22px',
          borderRadius: 14,
          background: alpha(C.ink950, 0.55),
          border: `2px solid ${C.ink700}`,
        }}
      >
        {RULE.condition.map((line, i) => (
          <MonoLine
            key={i}
            size={TYPE.small}
            tokens={line.map((token) => ({ t: token.t, c: token.kw ? C.cyanSoft : C.text, bold: token.kw }))}
          />
        ))}
      </div>

      <SectionLabel top={340}>EXCLUSIONES</SectionLabel>

      {placeholder > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: PAD,
            top: 380,
            width: inner,
            height: ROW_H,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 24px',
            borderRadius: RADIUS.md,
            border: `2px dashed ${C.ink600}`,
            fontFamily: FONT.sans,
            fontSize: TYPE.small,
            color: C.faint,
            opacity: placeholder,
          }}
        >
          <Icon name="funnel" size={28} color={C.faint} />
          añadir exclusión
        </div>
      ) : null}

      {goodIn > 0 ? (
        <ExclusionRow
          top={380}
          width={inner}
          color={goodColor}
          icon="funnel"
          title={goodTitle}
          detail={GOOD_EXCLUSION.detail}
          detailIn={fadeIn(frame, t.exclude + 14, 10)}
          chip={{ label: 'documentada', accent: 'emerald', icon: 'check', at: t.documented + 4, frame }}
          style={enter(frame, t.exclude - 2, { distance: 14, duration: 10 })}
        />
      ) : null}

      {frame >= t.overtune ? (
        <ExclusionRow
          top={488}
          width={inner}
          color={broadColor}
          icon={alarmOn ? 'alert' : 'funnel'}
          title={broadTitle}
          detail={BROAD_EXCLUSION.detail}
          detailIn={fadeIn(frame, t.overtune + 16, 10)}
          chip={{ label: 'demasiado amplia', accent: 'rose', icon: 'alert', at: t.alarm + 4, frame }}
          style={{
            ...enter(frame, t.overtune - 2, { distance: 14, duration: 10 }),
            boxShadow: alarmOn ? `0 0 ${30 * progress(frame, t.alarm, 12)}px ${alpha(C.rose, 0.35)}` : 'none',
          }}
        />
      ) : null}
    </Panel>
  );
}
