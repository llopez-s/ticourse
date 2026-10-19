import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { Pill, Reveal } from './parts/bits';
import { ByteRow } from './parts/Bytes';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-caso';

const A = ['41', '4C', '52', '54', '22', '7F'];
const C_ = ['41', '4C', '52', '54', '99', '7F'];
const PATTERN = ['41', '4C', '52', '54', '??', '7F'];

/**
 * s05-caso «El byte que cambia». The bytes of A and C one under the other; only the fifth cell lights (amber)
 * when the voice says the position changes. Then the final pattern as a third row — the fifth cell is «??», the
 * rest stays fixed — with the half-byte wildcard as a side note. Three closing pills: more wildcards admit more
 * content, a real reason is needed with real data, and a too-broad pattern needs other evidence in the condition.
 */
export function S05Hex(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const changeAt = w('s05-01', 'cambia') - 10;
  const patternAt = at('s05-03');
  const wildAt = w('s05-03', 'comodín') - 6;
  const fixedAt = w('s05-03', 'permanece') - 8;
  const cell = { cellW: 110, cellH: 88, size: 48, gap: 14, labelW: 110, labelSize: 52 } as const;

  return (
    <Stage>
      <ByteRow frame={frame} at={at('s05-01') + 4} label="A" bytes={A} marks={{ 4: { tone: 'amber', at: changeAt } }} {...cell} />
      <div style={{ position: 'absolute', left: 0, top: 118 }}>
        <ByteRow frame={frame} at={at('s05-01') + 24} label="C" bytes={C_} marks={{ 4: { tone: 'amber', at: changeAt } }} {...cell} />
      </div>
      <Reveal frame={frame} at={changeAt} x={1000} y={20}>
        <Pill icon="alert" tone="amber" size={34}>cambia una sola posición</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s05-02') + 60} x={1000} y={130}>
        <Pill icon="eye" tone="sky" size={30}>variación donde la evidencia la justifica</Pill>
      </Reveal>

      <div style={{ position: 'absolute', left: 0, top: 262 }}>
        <ByteRow frame={frame} at={patternAt} label="$hex" bytes={PATTERN} marks={{ 4: { tone: 'cyan', at: wildAt } }} tone="cyan" {...cell} labelSize={34} />
      </div>
      <Reveal frame={frame} at={wildAt} x={1000} y={262}>
        <Pill tone="cyan" size={32}>?? = cualquier valor de ese byte</Pill>
      </Reveal>
      <Reveal frame={frame} at={fixedAt} x={1000} y={338}>
        <Pill icon="lock" tone="emerald" size={32}>el resto permanece fijo</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s05-03', 'medio') - 10} x={0} y={380}>
        <Pill tone="muted" size={28}>nota: A? y ?A son comodines de medio byte</Pill>
      </Reveal>

      <Reveal frame={frame} at={at('s05-04')} x={0} y={456}>
        <Pill icon="alert" tone="amber" size={30}>más comodines no es mejor: es permitir más contenido</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s05-05')} x={0} y={524}>
        <Pill icon="search" tone="muted" size={30}>con datos reales, una razón equivalente</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s05-06')} x={0} y={592}>
        <div style={{ display: 'flex', gap: 20 }}>
          <Pill icon="archive" tone="amber" size={30}>demasiado amplio: controles ajenos lo comparten</Pill>
          <Pill icon="merge" tone="sky" size={30}>la condición lo combina con otras evidencias</Pill>
        </div>
      </Reveal>
    </Stage>
  );
}
