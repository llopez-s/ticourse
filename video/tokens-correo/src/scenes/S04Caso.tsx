import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { Choices, LearningCard, Pill, Reveal } from './parts/bits';
import { Board, colC, type Msg } from './parts/Board';
import { Stage, audioEnd, segment } from './kit';

const TOP = 180;

/**
 * s04-caso «¿Qué presentarías al correo?». The four columns stay. Both tokens are drawn neutral (no answer
 * colour) until the pause ends; at the reveal the application → Graph arrow lights for the access token and
 * application → Entra ID for the refresh token. Pass analogy for the pair, then the learning card.
 */
export function S04Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const reveal = props.cue('s04-b');
  const refreshAt = at('s04-04');
  const cardAt = audioEnd('s04-caso', 's04-06') + 6;

  const msgs: Msg[] = [
    { from: 1, to: 3, y: 160, label: 'token de acceso · se presenta al recurso', tone: C.muted, at: at('s04-01') + 40, litAt: reveal, litTone: 'emerald', mark: { icon: 'check', tone: 'emerald', at: reveal + 10 } },
    { from: 1, to: 2, y: 262, label: 'token de renovación', tone: C.muted, at: at('s04-02') - 10, litAt: refreshAt, litTone: 'sky', dashed: true },
  ];
  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: TOP }}>
        <Board frame={frame} height={350} colAt={[-30, -26, -22, -18]} lit={[0, 0, 0, 0]} msgs={msgs} />
      </div>
      <Reveal frame={frame} at={refreshAt + 6} outAt={at('s04-05') - 6} x={colC(1) + 20} y={TOP + 290} w={760}>
        <Pill icon="clock" tone="sky" size={30}>pide tokens nuevos a quien los emite</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s04-05')} x={colC(3) - 340} y={TOP + 196}>
        <Pill icon="key" tone="emerald" size={30}>pase limitado</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s04-05') + 56} x={colC(1) + 20} y={TOP + 290} w={900}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Pill icon="plug" tone="sky" size={28}>pedir un pase nuevo</Pill>
          <Pill icon="x" tone="amber" size={28}>puede rechazarse</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s04-06')} x={0} y={TOP + 372} w={1728}>
        <Pill icon="split" tone="muted" size={32}>no son llaves intercambiables, ni la segunda abre cualquier puerta</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s04-02')} outAt={at('s04-05') - 10} x={0} y={TOP + 372} w={1728}>
        <Choices frame={frame} at={at('s04-02')} revealAt={reveal} labels={['Token de acceso', 'Token de renovación']} answer={0} />
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Acceso a la API; renovación ante el emisor" />
    </Stage>
  );
}
