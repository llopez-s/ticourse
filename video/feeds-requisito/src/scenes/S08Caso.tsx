import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Choices, InfoCard, LearningCard, Pill, Reveal, Tag } from './parts/bits';
import { FeedName, Sym } from './parts/feeds';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's08-caso';
const TOP = 190; // the engine's pause card sits in the first ~165 px of the stage
const BOTTOM = 414;

/**
 * s08-caso «Una decisión para cada requisito». R1 lights up before the question and stays fixed; the two options
 * show no answer colour through the pause. At `s08-b` Faro lights, its four thresholds are ticked as the voice
 * says them and «presupuesto y contrato» is added as a condition. Then R2 with Atlas («puede aportar más»), and Eco
 * rejected for three concrete failures (cheapness is not one of them). The closing line compares evidence with a need.
 */
export function S08Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s08-b');
  const eco = props.cue('s08-c');
  const cardAt = audioEnd(S, 's08-06') + 6;
  const lit = progress(frame, at('s08-01') - 4, 20);
  const closing = at('s08-06');

  return (
    <Stage>
      <Reveal frame={frame} at={at('s08-01') - 6} x={0} y={TOP} w={1728}>
        <InfoCard icon="target" title="R1 · indicios nuevos antes de 24 h" sub="cuentas expuestas del sector aeroespacial" tone="cyan" lit={lit} w={1728} h={104} titleSize={40} subSize={28} />
      </Reveal>
      <Reveal frame={frame} at={w('s08-02', 'requisito') - 6} x={1360} y={TOP + 30} w={340}>
        <Tag tone="cyan" size={28}>requisito fijo</Tag>
      </Reveal>

      <Reveal frame={frame} at={at('s08-02') - 4} x={0} y={TOP + 124} w={1728}>
        <Choices frame={frame} at={at('s08-02') - 4} revealAt={reveal} labels={['Faro', 'Atlas']} answer={0} />
      </Reveal>

      <Reveal frame={frame} at={at('s08-01') + 40} outAt={reveal - 10} x={0} y={BOTTOM + 20} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <FeedName id="atlas" size={32} />
          <Pill icon="archive" tone="sky" size={32}>ya recibes casi todo de Atlas</Pill>
        </div>
      </Reveal>

      {/* Faro: thresholds met, hiring still conditional */}
      <Reveal frame={frame} at={reveal + 8} outAt={at('s08-04') - 10} x={0} y={BOTTOM} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <FeedName id="faro" size={32} />
          {(['incremento', 'rapidez', 'completitud', 'esfuerzo'] as const).map((word) => (
            <Reveal key={word} frame={frame} at={w('s08-03', word) - 6} x={0} y={0} style={{ position: 'relative' }}>
              <Pill icon="check" tone="emerald" size={30}>{word}</Pill>
            </Reveal>
          ))}
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s08-03', 'presupuesto') - 8} outAt={at('s08-04') - 10} x={0} y={BOTTOM + 84} w={1728}>
        <Pill icon="file" tone="amber" size={34}>sujeto a presupuesto y contrato</Pill>
      </Reveal>

      {/* Atlas for R2 */}
      <Reveal frame={frame} at={at('s08-04')} outAt={closing - 8} x={0} y={BOTTOM} w={840}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Tag tone="sky" size={34}>R2</Tag>
          <FeedName id="atlas" size={32} />
          <Pill icon="archive" tone="emerald" size={30}>puede aportar más</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s08-04', 'cancela') - 6} outAt={closing - 8} x={0} y={BOTTOM + 84} w={840}>
        <Pill icon="split" tone="muted" size={30}>no se cancela: responde a otra pregunta</Pill>
      </Reveal>

      {/* Eco: concrete failures, not cheapness */}
      <Reveal frame={frame} at={eco} outAt={closing - 8} x={888} y={BOTTOM} w={840}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <FeedName id="eco" size={32} />
          <Pill icon="database" tone="muted" size={30}>licencia barata</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s08-05', 'poco') - 8} outAt={closing - 8} x={888} y={BOTTOM + 84} w={840}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Pill icon="x" tone="amber" size={30}>añade muy poco</Pill>
          <Reveal frame={frame} at={w('s08-05', 'incompletos') - 8} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="x" tone="amber" size={30}>campos incompletos</Pill>
          </Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s08-05', 'revisión') - 8} outAt={closing - 8} x={888} y={BOTTOM + 154} w={840}>
        <Pill icon="x" tone="amber" size={30}>consume más revisión</Pill>
      </Reveal>

      {/* closing */}
      <Reveal frame={frame} at={closing} x={0} y={BOTTOM + 50} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="search" tone="cyan" size={34}>evidencias</Pill>
          <Sym kind="arrow" size={44} color={C.muted} />
          <Pill icon="target" tone="sky" size={34}>necesidad concreta</Pill>
          <Reveal frame={frame} at={w('s08-06', 'medallas') - 6} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="flag" tone="muted" size={30} strike dim={0.2}>medallas abstractas</Pill>
          </Reveal>
        </div>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="La elección depende del incremento útil y del plazo" />
    </Stage>
  );
}
