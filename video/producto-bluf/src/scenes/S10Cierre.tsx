import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { Chip, Icon, RuleCards, type IconName } from '../../../engine/src/ui';
import { StormIcon } from './parts/Icons';
import { Stage, wordFrame } from './kit';

const S = 's10-cierre';
const W = STAGE.width;

/**
 * s10-cierre «Tres reglas».
 *   recap / rule-1..3   three rule cards wait as numbered slots; each lights on its sentence: the
 *                       reader and the decision first (the four questions), the flash with actions
 *                       and a deadline and the report behind it (the storm warning), the conclusion
 *                       first with the band and the confidence apart (the two dials).
 *   next                the cards step back and a strip lands under them: «Laboratorio: Calibration
 *                       Range» — the lesson's lab, nothing more.
 *   endcard             the closing card: ALERTÓPOLIS, the video's storm and the disclaimer.
 */
export function S10Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const recap = props.cue('recap');
  const rule1 = props.cue('rule-1');
  const rule2 = props.cue('rule-2');
  const rule3 = props.cue('rule-3');
  const next = props.cue('next');
  const endcard = props.cue('endcard');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- The rule cards.
  const rulesOut = progress(frame, endcard - 10, 16, EASE.inOut);
  const rules = [
    {
      title: ['Primero el lector', 'y su decisión'] as const,
      sub: 'después, el texto',
      art: <FourQuestions />,
      at: rule1 - 6,
    },
    {
      title: ['Flash con acciones', 'y con plazo'] as const,
      sub: 'el informe, después',
      art: <StormIcon size={176} variant="warning" tone={C.amber} glow={0.5} rain={frame} />,
      tone: 'amber' as const,
      at: rule2 - 6,
    },
    {
      title: ['La conclusión', 'primero'] as const,
      sub: ['la probabilidad, en una banda', 'la confianza, aparte'] as const,
      art: <TwoDials />,
      at: rule3 - 6,
    },
  ];

  // ---- The lab strip.
  const labAt = Math.max(next - 4, w('s10-04', 'laboratorio') - 8);
  const lab = progress(frame, labAt, 18);

  // ---- The end card.
  const card = progress(frame, endcard - 4, 22);
  const ruleDraw = progress(frame, endcard + 20, 20, EASE.inOut);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {rulesOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - rulesOut }}>
          <RuleCards rules={rules} width={W} height={430} gap={40} slotAt={recap} dimFrom={next} titleSize={56} subSize={32} artHeight={190} style={{ position: 'absolute', left: 0, top: 84 - 66 * progress(frame, next - 8, 20, EASE.inOut) }} />
          {lab > 0 ? (
            <div style={{ position: 'absolute', left: 120, top: 470, width: W - 240, height: 150, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 36, padding: '0 54px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.85)}`, background: `linear-gradient(90deg, ${alpha(C.cyan, 0.16)} 0%, ${alpha(C.ink900, 0.97)} 70%)`, boxShadow: `0 0 46px ${alpha(C.cyan, 0.25)}, 0 26px 60px ${alpha('#000000', 0.45)}`, ...enter(frame, labAt, { distance: 36, duration: 20 }) }}>
              <div style={{ width: 92, height: 92, borderRadius: 46, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.14), border: `4px solid ${alpha(C.cyan, 0.8)}` }}>
                <Icon name={'target' as IconName} size={54} color={C.cyan} strokeWidth={2.2} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: 32, fontWeight: 850, letterSpacing: 3, color: C.cyanSoft, textTransform: 'uppercase' }}>lo siguiente</div>
                <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -1, color: C.textStrong, lineHeight: 1.05, whiteSpace: 'nowrap' }}>
                  Laboratorio: <span style={{ color: C.cyan }}>Calibration Range</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The closing card */}
      {card > 0 ? (
        <div style={{ position: 'absolute', left: (W - 1380) / 2, top: 60, width: 1380, height: 540, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 70, padding: '0 70px', borderRadius: 36, background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`, border: `2px solid ${C.ink700}`, boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`, overflow: 'hidden', opacity: Math.min(1, card * 1.4), transform: `scale(${0.94 + 0.06 * card})` }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 4, background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`, opacity: 0.8 }} />
          <div style={{ flexShrink: 0 }}>
            <StormIcon size={330} variant="warning" tone={C.amber} glow={0.6} rain={frame} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...enter(frame, endcard, { distance: 12 }) }}>
              <BrandMark size={34} />
              <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
            </div>
            <div style={{ marginTop: 18, fontSize: 64, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.06, color: C.textStrong, whiteSpace: 'nowrap', ...enter(frame, endcard + 6, { distance: 14 }) }}>
              <div>
                <span style={{ color: C.cyan }}>Escribir</span> para
              </div>
              <div>quien decide</div>
            </div>
            <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...enter(frame, endcard + 12, { distance: 14 }) }}>
              <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
              productos, BLUF y lenguaje estimativo
            </div>
            <div style={{ marginTop: 24, ...enter(frame, endcard + 16, { distance: 12 }) }}>
              <Chip accent="cyan" icon="mortarboard" size={TYPE.label}>
                GCTI · Dissemination
              </Chip>
            </div>
            <div style={{ marginTop: 26, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
            <div style={{ marginTop: 18, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, opacity: progress(frame, endcard + 30, 16) }}>
              Material independiente, no afiliado a SANS/GIAC.
            </div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** The four questions of rule 1, as four small discs in a square. */
function FourQuestions() {
  const icons: IconName[] = ['user', 'target', 'clock', 'layers'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '88px 88px', gap: 14 }}>
      {icons.map((n) => (
        <div key={n} style={{ width: 88, height: 88, borderRadius: 44, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.75)}` }}>
          <Icon name={n} size={48} color={C.cyan} strokeWidth={2} />
        </div>
      ))}
    </div>
  );
}

/** Rule 3's picture: the probability band and the confidence, apart. */
function TwoDials() {
  return (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div style={{ display: 'flex', height: 52, gap: 4 }}>
        {[4, 15, 25, 10, 25, 15, 4].map((k, i) => (
          <div key={i} style={{ flex: k, borderRadius: 6, background: i === 4 ? C.cyan : alpha(C.cyan, 0.2), border: `2px solid ${alpha(C.cyan, i === 4 ? 1 : 0.4)}` }} />
        ))}
      </div>
      <div style={{ display: 'flex', height: 52, gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, borderRadius: 8, background: i === 0 ? C.emerald : alpha(C.emerald, 0.16), border: `2px solid ${alpha(C.emerald, i === 0 ? 1 : 0.4)}` }} />
        ))}
      </div>
    </div>
  );
}
