import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { Pill, Reveal, Tag } from './parts/bits';
import { Panel, PanelRow, Sym } from './parts/feeds';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-caso';
const TOP = 190; // the engine's intercepted-message card owns the first ~170 px of the stage until ~frame 414

/**
 * s03-caso «Conocido no significa confirmado». Below the adversary's card: the source sheet (historial, acceso,
 * método) as the voice names them, then the claim sheet (evidencia, coherencia, corroboración). Two judgements
 * pairing a good source with a weak clue and a new source with verifiable evidence; the report checklist at `s03-c`;
 * and, last, the provider's percentage drawn inside the small part of the world its sensors see.
 */
export function S03Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const report = props.cue('s03-c');
  const world = at('s03-06');
  const dim = progress(frame, report - 6, 18);
  const lowerOut = report - 10;
  const reportOut = world - 8;
  const sensors = progress(frame, w('s03-06', 'sensores') - 24, 20);

  return (
    <Stage>
      <div style={{ opacity: 1 - 0.6 * dim }}>
        <Reveal frame={frame} at={at('s03-01') - 4} x={0} y={TOP} w={840}>
          <Panel icon="server" title="Ficha de la fuente · fiabilidad" tone="sky" w={840}>
            <PanelRow frame={frame} at={w('s03-01', 'historial') - 6} icon="archive" label="historial" tone="sky" />
            <PanelRow frame={frame} at={w('s03-01', 'acceso') - 6} icon="key" label="acceso" tone="sky" />
            <PanelRow frame={frame} at={w('s03-01', 'método') - 6} icon="gear" label="método" tone="sky" />
          </Panel>
        </Reveal>
        <Reveal frame={frame} at={at('s03-02') - 4} x={888} y={TOP} w={840}>
          <Panel icon="file" title="Ficha de la afirmación · credibilidad" tone="cyan" w={840}>
            <PanelRow frame={frame} at={w('s03-02', 'evidencia') - 6} icon="search" label="evidencia" />
            <PanelRow frame={frame} at={w('s03-02', 'evidencia') + 40} icon="link" label="coherencia" />
            <PanelRow frame={frame} at={w('s03-02', 'evidencia') + 80} litAt={w('s03-04', 'corroboración')} icon="check" label="corroboración" />
          </Panel>
        </Reveal>
      </div>

      <Reveal frame={frame} at={w('s03-03', 'buen') - 6} outAt={lowerOut} x={0} y={500} w={860}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="archive" tone="sky" size={30}>fuente con buen historial</Pill>
          <Reveal frame={frame} at={w('s03-03', 'débil') - 10} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="alert" tone="amber" size={30}>pista débil</Pill>
          </Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s03-03', 'nueva') - 6} outAt={lowerOut} x={0} y={572} w={860}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="server" tone="muted" size={30}>fuente nueva</Pill>
          <Reveal frame={frame} at={w('s03-03', 'verificable') - 10} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="check" tone="emerald" size={30}>evidencia verificable</Pill>
          </Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s03-03', 'juicios') - 6} outAt={lowerOut} x={940} y={500} w={788}>
        <Pill icon="split" tone="cyan" size={34}>dos juicios, por separado</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s03-04', 'reputación') - 6} outAt={lowerOut} x={940} y={572} w={788}>
        <Pill icon="x" tone="amber" size={30}>reputación <Sym kind="ne" size={30} /> corroboración</Pill>
      </Reveal>

      <Reveal frame={frame} at={report} outAt={reportOut} x={0} y={500} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Pill icon="file" tone="cyan" size={32}>en el informe</Pill>
          {(['periodo', 'población', 'método', 'referencias'] as const).map((word) => (
            <Reveal key={word} frame={frame} at={w('s03-05', word) - 6} x={0} y={0} style={{ position: 'relative' }}>
              <Tag tone="cyan" size={30}>{word === 'periodo' ? 'periodo observado' : word}</Tag>
            </Reveal>
          ))}
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s03-05', 'Distingue') - 4} outAt={reportOut} x={0} y={572} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Pill icon="eye" tone="emerald" size={30}>observación propia</Pill>
          <Pill icon="brain" tone="cyan" size={30}>interpretación</Pill>
          <Pill icon="link" tone="sky" size={30}>cita</Pill>
        </div>
      </Reveal>

      <Reveal frame={frame} at={world} x={0} y={490} w={800}>
        <div style={{ position: 'relative', width: 780, height: 156, borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.muted, 0.7)}`, fontFamily: FONT.sans }}>
          <span style={{ position: 'absolute', left: 20, top: 12, fontSize: 30, fontWeight: 700, color: C.muted }}>mundo entero</span>
          <div style={{ position: 'absolute', left: 24, top: 66, width: 130 + 360 * sensors, height: 70, borderRadius: RADIUS.sm, background: alpha(C.cyan, 0.16), border: `2px solid ${alpha(C.cyan, 0.85)}`, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', whiteSpace: 'nowrap' }}>
            <Icon name="radar" size={36} color={C.cyan} />
            <span style={{ fontSize: 30, fontWeight: 700, color: C.cyanSoft, opacity: sensors }}>lo que ven sus sensores</span>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s03-06', 'porcentaje') - 4} x={860} y={540} w={868}>
        <Pill icon="x" tone="amber" size={32}>su % no mide el mundo entero</Pill>
      </Reveal>
    </Stage>
  );
}
