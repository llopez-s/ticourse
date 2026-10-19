import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { RuleCards } from '../../../engine/src/ui/RuleCards';
import { Icon } from '../../../engine/src/ui/Icon';
import { FamTag, Pill, Reveal } from './parts/bits';
import { BRUMA, COBALTO } from './parts/data';
import { Stage, segment, wordFrame } from './kit';

const S = 's10-cierre';
const Y = 290;

/**
 * s10-cierre «Un titular con sus bordes». Three rule cards (unit and window / method and coverage / requirement
 * and limits), then the model conclusion bounded to Demo-P, September 2026 (no current ranking), then the
 * single action — order the s4m4 dataset by two metrics and justify the priority — with the two things to add,
 * and the closing line. Credits and the independence disclaimer; no exam badges.
 */
export function S10Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const model = props.cue('s10-b');
  const action = props.cue('s10-c');
  const credits = progress(frame, action + 90, 20);

  return (
    <Stage>
      <RuleCards
        width={1728}
        height={270}
        slotAt={at('s10-01') - 20}
        dimFrom={model}
        titleSize={44}
        subSize={30}
        artHeight={0}
        rules={[
          { title: ['Unidad', 'y ventana'], sub: 'qué cuentas y en qué periodo', icon: 'clock', tone: 'cyan', at: at('s10-01') },
          { title: ['Método', 'y cobertura'], sub: 'cómo deduplicas y qué observas', icon: 'globe', tone: 'sky', at: at('s10-02') },
          { title: ['Requisito', 'y límites'], sub: 'para qué decisión sirve', icon: 'target', tone: 'emerald', at: w('s10-02', 'Después') - 6 },
        ]}
      />

      {/* the bounded model conclusion */}
      <Reveal frame={frame} at={model} outAt={action - 8} x={0} y={Y} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 192, padding: '16px 34px', borderRadius: RADIUS.lg, background: C.ink850, border: `2px solid ${alpha(C.cyan, 0.5)}`, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Icon name="flag" size={30} color={C.cyan} />
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1, color: C.cyanSoft }}>CONCLUSIÓN MODELO · Demo-P, septiembre de 2026</span>
            <span style={{ marginLeft: 'auto' }}><Pill tone="amber" size={26}>sin ranking actual</Pill></span>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 700, color: C.textStrong, opacity: progress(frame, w('s10-03', 'Bruma') - 6, 14), whiteSpace: 'nowrap' }}>
            <FamTag f={BRUMA} size={34} /> lidera por muestras ·
            <FamTag f={COBALTO} size={34} /> por dispositivos
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 700, color: C.textStrong, opacity: progress(frame, w('s10-03', 'También') - 6, 14), whiteSpace: 'nowrap' }}>
            Para esta necesidad de Meridian, investigarías antes <FamTag f={COBALTO} size={34} />
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s10-04') + 10} outAt={action - 8} x={0} y={Y + 212} w={1728}>
        <Pill icon="check" tone="emerald" size={34}>afirmaciones compatibles: unidad y propósito claros</Pill>
      </Reveal>

      {/* the single action */}
      <Reveal frame={frame} at={action} x={0} y={Y} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 170, display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.75)}`, background: alpha(C.amberDeep, 0.35), fontFamily: FONT.sans }}>
          <Icon name="flag" size={52} color={C.amber} />
          <div>
            <div style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 4, color: C.amber }}>PRÁCTICA COMPLEMENTARIA</div>
            <div style={{ marginTop: 4, fontSize: 44, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>Ordena el dataset de la lección s4m4 con dos métricas y justifica tu primera prioridad</div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s10-06', 'limitación') - 10} x={0} y={Y + 190} w={860}>
        <Pill icon="globe" tone="sky" size={32}>una limitación de cobertura</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s10-06', 'evidencia') - 10} x={888} y={Y + 190} w={840}>
        <Pill icon="search" tone="sky" size={32}>una evidencia que te haría cambiar</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s10-06', 'apellidos') - 36} x={0} y={Y + 256} w={1728}>
        <div style={{ fontFamily: FONT.sans, fontSize: 52, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap' }}>
          El número uno <span style={{ color: C.cyan }}>necesita apellidos</span>
        </div>
      </Reveal>
      {credits > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 628, width: 1728, opacity: credits, fontFamily: FONT.sans, fontSize: 24, fontWeight: 560, color: C.faint, whiteSpace: 'nowrap' }}>
          Alertópolis · material independiente, no afiliado a SANS/GIAC · datos y familias ficticios
        </div>
      ) : null}
    </Stage>
  );
}
