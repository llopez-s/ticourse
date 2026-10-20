import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { progress, EASE } from '../../../engine/src/theme/motion';
import { InfoCard, Pill, Reveal } from './parts/bits';
import { DUNA, FAMILIES, fmt } from './parts/data';
import { DataTable, type TCol } from './parts/Table';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-caso';
const LOW = 190; // while the intercepted-message card lasts, the content starts below its 170 px

/**
 * s07-caso «La pregunta de Meridian». The requirement and the three signals (sector devices, last-week
 * devices, described capability) enter below the intercept card with NO leader marked. Once the intercept
 * ends the block slides up to make room for the caveats: what a described capability does not prove, the
 * sources to contrast, two cases that would change the priority, and the closing line.
 */
export function S07Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const lift = progress(frame, at('s07-03') - 12, 28, EASE.inOut);
  const cases = props.cue('s07-c');
  const closing = at('s07-06');

  const cols: TCol[] = [
    { label: 'Del sector', sub: 'dispositivos', w: 300, at: w('s07-01', 'dispositivos') - 8 },
    { label: 'Última semana', sub: 'subconjunto del mes', w: 300, at: w('s07-01', 'reciente') - 8 },
    { label: 'Capacidad descrita', w: 918, at: w('s07-01', 'capacidades') - 8, text: true },
  ];
  const rows = FAMILIES.map((f) => ({ name: f.name, color: f.color, cells: [fmt(f.sector), fmt(f.reciente), f.capacidad] }));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: LOW * (1 - lift), width: 1728 }}>
        <Reveal frame={frame} at={w('s07-01', 'Meridian') - 8} x={0} y={0} w={1728}>
          <InfoCard icon="target" title="Requisito de Meridian" sub="investigar exposición de sesión en su sector" tone="sky" w={1728} h={108} />
        </Reveal>
        <div style={{ position: 'absolute', left: 0, top: 128 }}>
          <DataTable frame={frame} at={w('s07-01', 'Mira') - 4} cols={cols} rows={rows} headH={72} rowH={72} nameW={210} />
        </div>
      </div>

      <Reveal frame={frame} at={at('s07-03')} outAt={cases - 8} x={0} y={458} w={800}>
        <Pill icon="x" tone="amber" size={32}>no prueba que Meridian esté comprometida</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s07-03', 'Tampoco') - 8} outAt={cases - 8} x={860} y={458} w={868}>
        <Pill icon="x" tone="amber" size={32}>capacidad descrita no es material robado</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s07-04', 'fichas') - 8} outAt={cases - 8} x={0} y={528} w={760}>
        <Pill icon="file" tone="sky" size={32}>la ficha describe lo observado y sus límites</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s07-04', 'contrastarlo') - 8} outAt={cases - 8} x={780} y={528} w={948}>
        <Pill icon="search" tone="sky" size={32}>contrastar con exposición interna y otras fuentes</Pill>
      </Reveal>

      <Reveal frame={frame} at={cases} x={0} y={458} w={840}>
        <InfoCard icon="archive" title="Requisito: recuperar archivos filtrados" sub={`${DUNA.name} podría merecer otra prioridad`} tone={DUNA.color} w={840} h={118} titleSize={32} />
      </Reveal>
      <Reveal frame={frame} at={w('s07-05', 'aplicaciones') - 20} x={888} y={458} w={840}>
        <InfoCard icon="app" title="Cambian las aplicaciones de Meridian" sub="cambia la relevancia" tone="sky" w={840} h={118} titleSize={32} />
      </Reveal>
      <Reveal frame={frame} at={closing} x={0} y={592} w={1728}>
        <Pill icon="flag" tone="cyan" size={34}>la primera posición no sustituye una decisión sobre la organización concreta</Pill>
      </Reveal>
    </Stage>
  );
}
