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
 * s10-cierre «Tu hipótesis, escrita». Three rule cards (scope before code / combine with reasons / measure the
 * limits) as the voice names them. At the recap the case's own condition is spelled in plain words (a marker, an
 * alternative evidence, inside a format and a size), then the single action — write MiRegla before opening the
 * solution — and the closing line. No new execution result; credits with the complementary and non-affiliation notes.
 */
export function S10Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const recap = props.cue('s10-b');
  const action = props.cue('s10-c');
  const credits = progress(frame, action + 90, 20);
  const rule2 = wordFrame(S, 's10-01', 'Justifica') - 10;

  return (
    <Stage>
      <RuleCards
        width={1728}
        height={330}
        slotAt={at('s10-01') - 20}
        dimFrom={action}
        titleSize={44}
        subSize={30}
        artHeight={0}
        rules={[
          { title: ['Alcance', 'antes del código'], sub: 'qué entra en el objetivo', icon: 'target', tone: 'cyan', at: wordFrame(S, 's10-01', 'Define') - 10 },
          { title: ['Combina', 'con razones'], sub: 'patrones y combinación justificados', icon: 'merge', tone: 'sky', at: rule2 },
          { title: ['Mide', 'los límites'], sub: 'cada restricción es cobertura', icon: 'chart', tone: 'emerald', at: at('s10-02') },
        ]}
      />

      {/* the case's condition in words */}
      <Reveal frame={frame} at={recap} outAt={action - 4} x={0} y={372}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill tone="emerald" size={32}>un marcador</Pill>
          <span style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.muted }}>+</span>
          <Pill tone="sky" size={32}>una evidencia alternativa</Pill>
          <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: C.muted }}>dentro de</span>
          <Tag tone="cyan" size={30}>formato ALRTDEMO</Tag>
          <Tag tone="sky" size={30}>&lt; 4KB</Tag>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s10-04')} outAt={action - 4} x={0} y={452}>
        <div style={{ display: 'flex', gap: 18 }}>
          <Pill icon="lock" tone="emerald" size={30}>necesarias: el marcador</Pill>
          <Pill icon="split" tone="sky" size={30}>pueden variar: ruta o bytes</Pill>
        </div>
      </Reveal>

      <Reveal frame={frame} at={action} x={0} y={366} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 176, display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.75)}`, background: alpha(C.amberDeep, 0.35), fontFamily: FONT.sans }}>
          <Icon name="flag" size={52} color={C.amber} />
          <div>
            <div style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 4, color: C.amber }}>PRÁCTICA COMPLEMENTARIA</div>
            <div style={{ marginTop: 4, fontSize: 46, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>Escribe MiRegla en el editor de la lección, antes de abrir la solución</div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s10-06')} x={0} y={566} w={1728}>
        <Pill icon="target" tone="muted" size={30}>la condición expresa una razón, no una cifra elegida por costumbre</Pill>
      </Reveal>
      {credits > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 628, width: 1728, opacity: credits, fontFamily: FONT.sans, fontSize: TYPE.micro + 2, fontWeight: 560, color: C.faint }}>
          Alertópolis · material independiente, no afiliado a SANS/GIAC · práctica complementaria · datos ficticios
        </div>
      ) : null}
    </Stage>
  );
}
