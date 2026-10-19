import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { RuleCards } from '../../../engine/src/ui/RuleCards';
import { Icon } from '../../../engine/src/ui/Icon';
import { Pill, Reveal, Tag } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's10-cierre';

/**
 * s10-cierre «De la regla al producto». Three rule cards (compile is not validate / measure positives and
 * negatives / deliver scope and reproduction), then the useful result as a checkable claim that states where it
 * fails, then the single action — run the verifier on MiRegla and fill in a delivery sheet — with the command
 * under it. The lesson that holds the model, the sources and the independence notice close the scene. No exam
 * badges.
 */
export function S10Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const action = props.cue('s10-c');
  const credits = progress(frame, w('s10-06', 'trabajo'), 20);

  return (
    <Stage>
      <RuleCards
        width={1728}
        height={310}
        slotAt={at('s10-01') - 20}
        dimFrom={action}
        titleSize={44}
        subSize={30}
        artHeight={0}
        rules={[
          { title: ['Compilar', 'no es validar'], sub: 'sintaxis, no eficacia', icon: 'gear', tone: 'cyan', at: at('s10-01') },
          { title: ['Mide positivos', 'y negativos'], sub: 'sin esconder errores', icon: 'search', tone: 'sky', at: w('s10-01', 'Revisar') - 8 },
          { title: ['Entrega alcance', 'y reproducción'], sub: 'motor, corpus y acción', icon: 'archive', tone: 'emerald', at: at('s10-02') },
        ]}
      />

      <Reveal frame={frame} at={props.cue('s10-b')} outAt={action - 8} x={0} y={332}>
        <Pill icon="check" tone="emerald" size={32}>no una cifra grande: una afirmación que otra persona puede comprobar</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s10-03', 'falla') - 14} outAt={action - 8} x={0} y={404}>
        <Pill icon="alert" tone="amber" size={32}>si sabes dónde falla, dilo</Pill>
      </Reveal>

      <Reveal frame={frame} at={action} x={0} y={348} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 176, display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.75)}`, background: alpha(C.amberDeep, 0.35), fontFamily: FONT.sans }}>
          <Icon name="flag" size={52} color={C.amber} />
          <div>
            <div style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 4, color: C.amber }}>PRÁCTICA COMPLEMENTARIA</div>
            <div style={{ marginTop: 4, fontSize: 46, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>Ejecuta el verificador sobre MiRegla y completa una ficha de entrega</div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s10-05', 'verificador')} x={0} y={540}>
        <Tag tone={C.emerald} size={28}>python verify.py --rule mi-regla.yar --name MiRegla</Tag>
      </Reveal>
      <Reveal frame={frame} at={w('s10-06', 'lección') - 6} x={1010} y={540}>
        <Pill icon="mortarboard" tone="sky" size={30}>el modelo: lección de diseminación</Pill>
      </Reveal>

      {credits > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 598, width: 1728, opacity: credits, fontFamily: FONT.sans, fontSize: 26, fontWeight: 560, lineHeight: 1.15, color: C.faint }}>
          <div>Fuentes: YARA (motor Python) · curso: verify.py, fixtures.py y reference.yar · lección s5m3</div>
          <div style={{ marginTop: 4 }}>Alertópolis · material independiente, no afiliado a SANS/GIAC · práctica complementaria con datos ficticios</div>
        </div>
      ) : null}
    </Stage>
  );
}
