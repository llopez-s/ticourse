import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { Choices, InfoCard, LearningCard, Pill, Reveal, Tag } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's08-caso';
const TOP = 180; // the engine's pause card owns the first 170 px of the stage

function Side({ title, lines, tone }: { title: string; lines: string[]; tone: string }) {
  return (
    <div style={{ boxSizing: 'border-box', width: 800, height: 150, padding: '16px 28px', borderRadius: RADIUS.md, background: alpha(tone, 0.07), border: `2px solid ${alpha(tone, 0.7)}`, fontFamily: FONT.sans }}>
      <div style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>{title}</div>
      <div style={{ marginTop: 8, display: 'grid', gap: 4 }}>
        {lines.map((l) => (
          <div key={l} style={{ fontSize: 30, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

/**
 * s08-caso «El receptor quiere bloquear». A fictitious SOC proposal (block the whole fleet because 12/12) at the
 * top. The two options enter with the question and stay neutral through the pause; at the reveal «falta validar
 * ese uso real» lights and the comparison opens: what the exercise tested (prepared synthetic files) vs what is
 * proposed (production files and action). Requirements and the cost of a wrong match follow, then what the rule
 * still is (practice or starting point) and what it is not (proof of effectiveness). Learning card at the end.
 */
export function S08Bloquear(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s08-b');
  const resolve = props.cue('s08-c');
  const cardAt = audioEnd(S, 's08-06') + 6;
  const tAsk = w('s08-02', 'paquete') - 8;
  const reqOut = resolve - 8;

  return (
    <Stage>
      <Reveal frame={frame} at={at('s08-01') - 2} x={0} y={TOP} w={1100}>
        <InfoCard icon="alert" title="Propuesta del SOC (ficticia)" sub="bloquear en toda la flota" tone="amber" w={1100} h={110} />
      </Reveal>
      <Reveal frame={frame} at={w('s08-01', 'doce') - 6} x={1140} y={TOP + 18}>
        <Tag tone={C.emerald} size={44} solid>12/12</Tag>
      </Reveal>

      <Reveal frame={frame} at={tAsk} outAt={reveal + 30} x={0} y={TOP + 146} w={1728}>
        <Choices frame={frame} at={tAsk} revealAt={reveal} labels={['Sí, pasó todo el paquete', 'No, falta validar ese uso real']} answer={1} />
      </Reveal>

      {/* laboratory vs production */}
      <Reveal frame={frame} at={Math.max(reveal + 36, w('s08-03', 'validar') - 4)} x={928} y={TOP + 146}>
        <Side title="Lo que propones" tone={C.amber} lines={['archivos y acción de producción', 'bloquear en toda la flota']} />
      </Reveal>
      <Reveal frame={frame} at={w('s08-03', 'ejercicio') - 6} x={0} y={TOP + 146}>
        <Side title="Lo que probaste" tone={C.cyan} lines={['12 archivos sintéticos preparados', 'la mecánica y sus resultados']} />
      </Reveal>
      <Reveal frame={frame} at={w('s08-03', 'ejercicio') + 4} x={808} y={TOP + 190} distance={0}>
        <svg width={112} height={70} viewBox="0 0 112 70">
          <g stroke={C.amber} strokeWidth={7} strokeLinecap="round">
            <line x1={34} y1={26} x2={78} y2={26} />
            <line x1={34} y1={46} x2={78} y2={46} />
            <line x1={46} y1={60} x2={66} y2={12} />
          </g>
        </svg>
      </Reveal>

      {/* what a real action needs */}
      <Reveal frame={frame} at={w('s08-04', 'controles') - 8} outAt={reqOut} x={0} y={TOP + 330}>
        <Pill icon="target" tone="cyan" size={30}>controles representativos</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s08-04', 'cobertura') - 8} outAt={reqOut} x={520} y={TOP + 330}>
        <Pill icon="chart" tone="cyan" size={30}>cobertura adecuada</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s08-04', 'autorizada') - 8} outAt={reqOut} x={950} y={TOP + 330}>
        <Pill icon="shield" tone="emerald" size={30}>respuesta autorizada</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s08-04', 'coste') - 8} outAt={reqOut} x={0} y={TOP + 400}>
        <div style={{ display: 'flex', gap: 20 }}>
          <Pill icon="search" tone="sky" size={30}>investigar un candidato: coste bajo</Pill>
          <Pill icon="x" tone="rose" size={30}>bloquear la flota: coste alto</Pill>
        </div>
      </Reveal>

      {/* what the rule still is */}
      <Reveal frame={frame} at={w('s08-05', 'rechazando') - 8} x={0} y={TOP + 330}>
        <Pill icon="x" tone="muted" size={30} strike>rechazar la regla</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s08-05', 'delimitando') - 8} x={400} y={TOP + 330}>
        <Pill icon="search" tone="sky" size={30}>delimitar la evidencia</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s08-05', 'entregarla') - 8} x={820} y={TOP + 330}>
        <Pill icon="check" tone="emerald" size={30}>práctica o punto de partida</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s08-06')} x={0} y={TOP + 400}>
        <Pill icon="x" tone="rose" size={30}>no es prueba suficiente de eficacia en toda la organización</Pill>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="La validación tiene que corresponder al uso previsto" />
    </Stage>
  );
}
