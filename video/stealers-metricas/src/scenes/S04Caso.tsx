import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Choices, LearningCard, Pill, Reveal } from './parts/bits';
import { FAMILIES, fmt, leader } from './parts/data';
import { DataTable, type TCol } from './parts/Table';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's04-caso';
const TOP = 180; // the engine's pause card sits in the first 170 px of the stage
const BOTTOM = 568;

/**
 * s04-caso «Ordenar otra columna». The course's exact table. First only samples (Bruma leads), then devices:
 * both columns show their values but NO leader until the pause ends. The choice stays neutral; at the reveal
 * Cobalto lights, then records and organisations (Duna) arrive, then sector. The organisations column stays
 * in focus while the voice warns about adding it up. Learning card closes the scene.
 */
export function S04Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s04-b');
  const orgs = props.cue('s04-c');
  const cardAt = audioEnd(S, 's04-06') + 6;
  const dispAt = w('s04-01', 'dispositivos') - 6;

  const focus = windowWeight(frame, orgs, undefined, { ramp: 14, lead: 4 });
  const cols: TCol[] = [
    { label: 'Muestras', sub: 'hashes', w: 210, at: at('s04-01') - 4, ghost: true, win: leader('muestras'), winAt: w('s04-01', 'lidera'), dim: focus },
    { label: 'Episodios', sub: 'equipo y día', w: 220, at: reveal + 40, ghost: true, win: leader('episodios'), winAt: reveal + 40, dim: focus },
    { label: 'Dispositivos', sub: 'observados', w: 260, at: dispAt, ghost: true, win: leader('dispositivos'), winAt: reveal, dim: focus },
    { label: 'Registros', sub: 'únicos', w: 240, at: w('s04-03', 'registros') - 6, ghost: true, win: leader('registros'), winAt: w('s04-03', 'registros') - 6, dim: focus },
    { label: 'Organizaciones', sub: 'validadas', w: 300, at: w('s04-03', 'organizaciones') - 6, ghost: true, win: leader('organizaciones'), winAt: w('s04-03', 'organizaciones') - 6 },
    { label: 'Sector objetivo', sub: 'dispositivos', w: 288, at: at('s04-04') + 20, ghost: true, win: leader('sector'), winAt: at('s04-04') + 20, dim: focus },
  ];
  const rows = FAMILIES.map((f) => ({
    name: f.name,
    color: f.color,
    cells: [fmt(f.muestras), fmt(f.episodios), fmt(f.dispositivos), fmt(f.registros), fmt(f.organizaciones), fmt(f.sector)],
  }));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: TOP }}>
        <DataTable frame={frame} at={at('s04-01') - 20} cols={cols} rows={rows} />
      </div>

      <Reveal frame={frame} at={at('s04-02')} outAt={at('s04-04') - 6} x={0} y={BOTTOM} w={1728}>
        <Choices frame={frame} at={at('s04-02')} revealAt={reveal} labels={['Bruma', 'Cobalto']} answer={1} />
      </Reveal>
      <Reveal frame={frame} at={at('s04-04')} outAt={orgs - 10} x={0} y={BOTTOM + 6} w={1728}>
        <Pill icon="split" tone="sky" size={34}>no hay contradicción: cada columna responde otra pregunta</Pill>
      </Reveal>
      <Reveal frame={frame} at={orgs - 4} outAt={at('s04-06') - 8} x={0} y={BOTTOM + 6} w={1728}>
        <Pill icon="layers" tone="amber" size={34}>una misma organización puede estar en más de una fila</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s04-06')} x={0} y={BOTTOM + 6} w={1728}>
        <div style={{ display: 'flex', gap: 20 }}>
          <Pill icon="funnel" tone="sky" size={32}>identificar y deduplicar solapamientos</Pill>
          <Pill icon="split" tone="muted" size={32}>poblaciones no independientes</Pill>
        </div>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Muestras, dispositivos y registros cambian la clasificación" />
    </Stage>
  );
}
