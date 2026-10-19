import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { Pill, Reveal } from './parts/bits';
import { Panel, PanelRow, Sym } from './parts/feeds';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-caso';
const A_Y = 200; // phase A sits below the intercepted-message card (it owns the first ~170 px until ~frame 306)

/**
 * s07-caso «Antes de llamar éxito al piloto». While the adversary's card is up (below it): the order that
 * matters — criteria, then measuring — against the wrong order that lets anyone win. From `s07-02` the R1
 * criteria are written into a locked card with their symbols (read aloud in words, shown as signs); at `s07-b` the
 * quality controls (what «useful» means, a comparable sample, the feed is not its own truth); at `s07-c` viability
 * (errors, outages, quotas, usage rights), price and contract as a separate condition, and the closing warning.
 */
export function S07Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const via = props.cue('s07-c');
  const aOut = at('s07-02') - 12;
  const qcOut = via - 14;
  const late = progress(frame, w('s07-01', 'Acuérdalos') - 8, 14);

  return (
    <Stage>
      {/* phase A: order of things */}
      <Reveal frame={frame} at={at('s07-01') + 10} outAt={aOut} x={0} y={A_Y} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: 1 - 0.5 * late }}>
          <Pill icon="search" tone="muted" size={34}>medir en el piloto</Pill>
          <Sym kind="arrow" size={44} color={C.muted} />
          <Pill icon="x" tone="amber" size={34}>criterios después</Pill>
          <Sym kind="arrow" size={44} color={C.muted} />
          <Pill icon="flag" tone="amber" size={34}>gana quien prefieras</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s07-01', 'Acuérdalos') - 8} outAt={aOut} x={0} y={A_Y + 100} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="lock" tone="emerald" size={34}>acordar criterios</Pill>
          <Sym kind="arrow" size={44} color={C.emerald} />
          <Pill icon="search" tone="emerald" size={34}>medir</Pill>
          <Sym kind="arrow" size={44} color={C.emerald} />
          <Pill icon="check" tone="emerald" size={34}>elegir</Pill>
        </div>
      </Reveal>

      {/* phase B: R1 criteria, written before the results */}
      <Reveal frame={frame} at={at('s07-02') + 10} x={0} y={0} w={840}>
        <Panel icon="lock" title="Criterios R1 · fijados antes de medir" tone="emerald" w={840}>
          <PanelRow frame={frame} at={w('s07-02', 'veinte') - 6} icon="target" tone="emerald" label={<><Sym kind="ge" size={34} /> 20 útiles incrementales</>} />
          <PanelRow frame={frame} at={w('s07-02', 'puntualidad') - 6} icon="clock" tone="emerald" label={<>p95 <Sym kind="lt" size={34} /> 24 h</>} />
          <PanelRow frame={frame} at={w('s07-02', 'campos') - 6} icon="file" tone="emerald" label={<>campos completos <Sym kind="ge" size={34} /> 90 %</>} />
          <PanelRow frame={frame} at={w('s07-02', 'esfuerzo') - 6} icon="user" tone="emerald" label={<>triaje <Sym kind="le" size={34} /> 8 h/mes</>} />
        </Panel>
      </Reveal>

      <Reveal frame={frame} at={via + 70} x={0} y={390} w={840}>
        <div style={{ boxSizing: 'border-box', height: 108, display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.muted, 0.7)}`, fontFamily: FONT.sans }}>
          <Icon name="file" size={44} color={C.muted} />
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>Aparte · precio y contrato</div>
            <div style={{ fontSize: 28, fontWeight: 560, color: C.muted }}>una condición separada</div>
          </div>
        </div>
      </Reveal>

      {/* quality controls, then viability */}
      <Reveal frame={frame} at={at('s07-03')} outAt={qcOut} x={888} y={0} w={840}>
        <Panel icon="search" title="Controles de calidad" tone="cyan" w={840}>
          <PanelRow frame={frame} at={w('s07-03', 'útil') - 6} icon="target" label="qué significa «útil»" />
          <PanelRow frame={frame} at={w('s07-03', 'dudosos') - 6} icon="split" label="casos dudosos: se adjudican" />
          <PanelRow frame={frame} at={w('s07-03', 'muestra') - 6} icon="layers" label="muestra comparable" />
          <PanelRow frame={frame} at={w('s07-03', 'discrepancias') - 6} icon="archive" label="discrepancias y desconocidos" />
        </Panel>
      </Reveal>
      <Reveal frame={frame} at={at('s07-04')} outAt={qcOut} x={888} y={376} w={840}>
        <Pill icon="x" tone="amber" size={30}>el feed no es su propia vara de medir</Pill>
      </Reveal>

      <Reveal frame={frame} at={via} x={888} y={0} w={840}>
        <Panel icon="plug" title="Viabilidad del piloto" tone="sky" w={840}>
          <PanelRow frame={frame} at={w('s07-05', 'errores') - 6} icon="alert" tone="sky" label="errores de integración" />
          <PanelRow frame={frame} at={w('s07-05', 'indisponibilidad') - 6} icon="power" tone="sky" label="indisponibilidad" />
          <PanelRow frame={frame} at={w('s07-05', 'cuotas') - 6} icon="chart" tone="sky" label="cuotas" />
          <PanelRow frame={frame} at={w('s07-05', 'derechos') - 6} icon="key" tone="sky" label="derechos de uso y retención" />
        </Panel>
      </Reveal>
      <Reveal frame={frame} at={w('s07-05', 'calidad')} x={888} y={376} w={840}>
        <Pill icon="check" tone="emerald" size={32}>calidad y viabilidad</Pill>
      </Reveal>

      <Reveal frame={frame} at={at('s07-06')} x={0} y={560} w={1728}>
        <Pill icon="alert" tone="amber" size={34}>un buen dato sin el uso necesario puede no resolver tu requisito</Pill>
      </Reveal>
    </Stage>
  );
}
