import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { CAMPAIGN_STAMP } from '../data/canon';
import { COUNTER_W, CounterCard, LURE_H, LoopStep, LureCard, STEP_W } from './parts/CampaignParts';
import { CaseStamp, Pill, StrikeLine } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's04-avisar';
const W = 1728;
const AUTH_TOP = 76;
const LURE_TOP = 146;
const CRUEL_TOP = LURE_TOP + LURE_H + 14;
const COUNTERS_X = [840, 840 + COUNTER_W + 30];
const COUNTERS_TOP = 76;
const NAMES_TOP = 428;
const LOOP_TOP = 502;
const LOOP_GAP = (W - 4 * STEP_W) / 3;

const STEPS = [
  { icon: 'cursor', text: 'botón en el correo' },
  { icon: 'search', text: 'triaje' },
  { icon: 'unplug', text: 'si es real, quitarlo de los demás buzones' },
  { icon: 'bell', text: 'contestar a quien avisó, aunque fuera un falso positivo' },
] as const;

/**
 * s04-avisar «Avisar, no pillar». The campaign stamp from the first frame. On `campaign` «autorizada por escrito»,
 * on `lure` the mail with no sender («la nueva aplicación del comedor: entra con tu usuario»), on `no-cruel` the rule
 * «sin señuelos crueles…». On `counters` the two counter cards arrive empty; the dots of «pican: 2 de cada 10» (click
 * rate) fill on the voice's «pica», and on `report-rate` the dots of «avisan: 1 de cada 10, y el primero a los 4
 * minutos» (report rate) fill and the card rises; on «subir» a green arrow joins it. `no-names`: «publicar nombres»
 * struck; `coaching`: «a quien pica, dos minutos de explicación en el momento». On `loop` everything above steps back and
 * the four steps of the reporting loop light one after another on the voice's «botón», «revisa» and «contesta».
 */
export function S04Avisar(props: SceneProps) {
  const frame = useCurrentFrame();
  const campaignAt = props.cue('campaign');
  const lureAt = props.cue('lure');
  const cruelAt = props.cue('no-cruel');
  const countersAt = props.cue('counters');
  const reportAt = props.cue('report-rate');
  const namesAt = props.cue('no-names');
  const coachingAt = props.cue('coaching');
  const loopAt = props.cue('loop');
  const permisoAt = Math.max(campaignAt + 4, wordFrame(S, 's04-01', 'permiso') - 8);
  const picaAt = Math.max(countersAt + 6, wordFrame(S, 's04-02', 'pica') - 6);
  const subirAt = wordFrame(S, 's04-03', 'subir') - 4;
  const revisaAt = Math.max(loopAt + 20, wordFrame(S, 's04-04', 'revisa') - 6);
  const contestaAt = Math.max(revisaAt + 24, wordFrame(S, 's04-04', 'contesta') - 6);
  const quitaAt = Math.round((revisaAt + contestaAt) / 2);
  const stepAt = [loopAt - 2, revisaAt, quitaAt, contestaAt];

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const authIn = progress(frame, permisoAt, 14);
  const lureIn = progress(frame, lureAt - 2, 16);
  const cruelIn = progress(frame, cruelAt - 2, 14);
  const c1In = progress(frame, countersAt, 16);
  const c2In = progress(frame, countersAt + 6, 16);
  const lit1 = 2 * progress(frame, picaAt, 22, EASE.inOut);
  const lit2 = 1 * progress(frame, reportAt + 4, 22, EASE.inOut);
  const hl = progress(frame, reportAt, 16);
  const c1Dim = hl;
  const upIn = progress(frame, subirAt, 12);
  const namesIn = progress(frame, namesAt - 2, 14);
  const strike = progress(frame, namesAt + 8, 18);
  const coachIn = progress(frame, coachingAt - 2, 14);
  const loopDim = progress(frame, loopAt - 6, 16);
  const loopShow = progress(frame, loopAt - 10, 12);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...CAMPAIGN_STAMP]} size={28} />
      </div>

      {/* Everything above the loop steps back once the loop starts */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.42 * loopDim, filter: loopDim > 0.01 ? `saturate(${1 - 0.4 * loopDim})` : undefined }}>
        <div style={{ position: 'absolute', left: 0, top: AUTH_TOP, opacity: authIn, transform: `translateY(${(1 - authIn) * 12}px)` }}>
          <Pill text="autorizada por escrito" tone={C.emerald} icon="file" size={40} height={60} weight={850} on={0.5 + 0.5 * authIn} />
        </div>

        <div style={{ position: 'absolute', left: 0, top: LURE_TOP, opacity: lureIn, transform: `translateY(${(1 - lureIn) * 18}px)` }}>
          <LureCard on={lureIn} />
        </div>

        <div style={{ position: 'absolute', left: 0, top: CRUEL_TOP, opacity: cruelIn, transform: `translateY(${(1 - cruelIn) * 12}px)` }}>
          <Pill text="sin señuelos crueles: ni despidos, ni nóminas, ni resultados médicos" tone={C.amber} icon="shield" size={30} height={54} weight={750} on={0.6} />
        </div>

        <div style={{ position: 'absolute', left: COUNTERS_X[0], top: COUNTERS_TOP }}>
          <CounterCard kind="click" lit={lit1} show={c1In} dimmed={c1Dim} />
        </div>
        <div style={{ position: 'absolute', left: COUNTERS_X[1], top: COUNTERS_TOP }}>
          <CounterCard kind="report" lit={lit2} show={c2In} hl={hl} up={upIn} />
        </div>

        <div style={{ position: 'absolute', left: 0, top: NAMES_TOP, display: 'flex', alignItems: 'center', gap: 28, fontFamily: FONT.sans }}>
          <div style={{ position: 'relative', opacity: namesIn, transform: `translateY(${(1 - namesIn) * 12}px)` }}>
            <Pill text="publicar nombres" tone={C.rose} icon="x" size={36} height={60} weight={800} on={0.3} color={C.muted} />
            <StrikeLine strike={strike} />
          </div>
          <div style={{ opacity: coachIn, transform: `translateY(${(1 - coachIn) * 12}px)` }}>
            <Pill text="a quien pica, dos minutos de explicación en el momento" tone={C.emerald} icon="check" size={36} height={60} weight={800} on={0.6 + 0.4 * coachIn} />
          </div>
        </div>
      </div>

      {STEPS.map((s, i) => (
        <div key={s.text} style={{ position: 'absolute', left: i * (STEP_W + LOOP_GAP), top: LOOP_TOP, opacity: loopShow }}>
          <LoopStep n={i + 1} icon={s.icon} text={s.text} on={progress(frame, stepAt[i], 14)} />
        </div>
      ))}
      {STEPS.slice(0, 3).map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: (i + 1) * STEP_W + i * LOOP_GAP + 4, top: LOOP_TOP + 62, width: LOOP_GAP - 8, display: 'flex', justifyContent: 'center', opacity: progress(frame, stepAt[i + 1], 10) }}>
          <svg width={LOOP_GAP - 8} height={30} viewBox={`0 0 ${LOOP_GAP - 8} 30`}>
            <path d={`M4 15 H${LOOP_GAP - 20} M${LOOP_GAP - 30} 5 L${LOOP_GAP - 16} 15 L${LOOP_GAP - 30} 25`} fill="none" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
    </Stage>
  );
}
