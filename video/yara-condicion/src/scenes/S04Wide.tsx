import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { Choices, LearningCard, Pill, Reveal } from './parts/bits';
import { ByteRow } from './parts/Bytes';
import { CodeBlock, type CodeLine } from './parts/Code';
import { progress } from '../../../engine/src/theme/motion';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's04-caso';
const TOP = 182; // the think-pause card owns the first ~170 px of the stage

// «cicada-demo-v1» as plain text (one byte per character) and «CICADA-DEMO-V1» as UTF-16LE (a 00 after each one)
const A_BYTES = ['63', '69', '63', '61', '64', '61', '2D', '64', '65', '6D', '6F', '2D', '76', '31'];
const B_BYTES = ['43', '49', '43', '41', '44', '41', '2D', '44', '45', '4D', '4F', '2D', '56', '31'].flatMap((b) => [b, '00']);

/**
 * s04-caso «El mismo texto, otros bytes». A (plain text) and B (uppercase, UTF-16LE with a 00 after each byte) as
 * rows of bytes, then the two options with no answer colour until the pause ends. At the reveal «Contemplar la
 * variación prevista» lights and the options give way to the real $family line: ascii lights A, wide lights B
 * (nulls), nocase the uppercase. Closing warnings: each widening admits more; wide is not general Unicode.
 */
export function S04Wide(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s04-b');
  const cardAt = audioEnd(S, 's04-06') + 6;
  const bAt = w('s04-01', 'B') - 8;
  const asciiAt = w('s04-03', 'ascii') - 4;
  const wideAt = w('s04-04', 'Wide') - 4;
  const nocaseAt = w('s04-05', 'Nocase') - 4;
  const warnAt = w('s04-05', 'ampliación') - 20;
  const swapAt = reveal + 100;

  const lit = (a: number, b: number) => progress(frame, a, 10) * (1 - progress(frame, b, 14));
  const line: CodeLine[] = [
    {
      text: '$family = "cicada-demo-v1" ascii wide nocase',
      at: swapAt,
      marks: { ascii: { tone: 'cyan', at: asciiAt }, wide: { tone: 'sky', at: wideAt }, nocase: { tone: 'amber', at: nocaseAt } },
    },
  ];

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: TOP }}>
        <ByteRow frame={frame} at={at('s04-01') + 6} label="A" bytes={A_BYTES} lit={lit(asciiAt, wideAt)} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: TOP + 70 }}>
        <ByteRow frame={frame} at={bAt} label="B" bytes={B_BYTES} nullTone="sky" lit={lit(wideAt, nocaseAt) + lit(nocaseAt, warnAt)} tone="sky" />
      </div>

      <Reveal frame={frame} at={at('s04-01') + 40} x={80} y={TOP + 144}>
        <Pill tone="cyan" size={28}>A · texto sencillo</Pill>
      </Reveal>
      <Reveal frame={frame} at={bAt + 20} x={440} y={TOP + 144}>
        <Pill tone="sky" size={28}>B · mayúsculas · bytes nulos intercalados</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s04-01', 'Sigue') - 6} x={1150} y={TOP + 144}>
        <Pill icon="check" tone="emerald" size={28}>dentro del objetivo</Pill>
      </Reveal>

      <Reveal frame={frame} at={at('s04-02')} outAt={swapAt - 8} x={0} y={TOP + 218} w={1728}>
        <Choices frame={frame} at={at('s04-02')} revealAt={reveal} labels={['Ignorar su representación', 'Contemplar la variación prevista']} answer={1} />
      </Reveal>

      <Reveal frame={frame} at={swapAt} x={0} y={TOP + 214} w={1100}>
        <CodeBlock frame={frame} lines={line} title="strings" width={1100} size={36} />
      </Reveal>
      <div style={{ position: 'absolute', left: 0, top: TOP + 352, display: 'flex', gap: 18 }}>
        <Reveal frame={frame} at={asciiAt + 6} x={0} y={0}>
          <Pill tone="cyan" size={28}>ascii: A</Pill>
        </Reveal>
        <Reveal frame={frame} at={wideAt + 6} x={290} y={0}>
          <Pill tone="sky" size={28}>wide: B, con su byte nulo</Pill>
        </Reveal>
        <Reveal frame={frame} at={nocaseAt + 6} x={800} y={0}>
          <Pill tone="amber" size={28}>nocase: ignora mayúsculas</Pill>
        </Reveal>
      </div>

      <Reveal frame={frame} at={warnAt} outAt={at('s04-06') - 8} x={0} y={TOP + 418}>
        <Pill icon="alert" tone="amber" size={30}>cada ampliación puede incluir más coincidencias</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s04-06')} x={0} y={TOP + 418}>
        <Pill icon="alert" tone="amber" size={30}>wide no es Unicode general: cubre una representación concreta</Pill>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="ASCII, wide y nocase amplían formas concretas" />
    </Stage>
  );
}
