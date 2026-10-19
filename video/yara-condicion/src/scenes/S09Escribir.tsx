import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { Icon } from '../../../engine/src/ui/Icon';
import { InfoCard, LearningCard, Pill, Reveal } from './parts/bits';
import { CodeBlock, type CodeLine } from './parts/Code';
import { FileTile } from './parts/Files';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's09-caso';

/**
 * s09-caso «Escribir no es ejecutar». The course editor with a three-line placeholder rule (not the solution) and
 * the notice that the browser neither compiles nor runs it; the downloaded text file. Forge as a simulation by
 * labels and the inert ZIP with a real verifier. Then three stages: write (done), compile, run — the last two
 * drawn as pending, no result of any kind. Two ways a compiling rule can still fail; then what validation needs.
 */
export function S09Escribir(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const cardAt = audioEnd(S, 's09-06') + 6;
  const editorAt = w('s09-01', 'escribir') - 14;
  const downloadAt = w('s09-01', 'descargar') - 8;
  const noAt = w('s09-01', 'compila') - 8;
  const compileAt = w('s09-04', 'Compilar') - 8;
  const runAt = w('s09-04', 'Ejecutar') - 8;

  const code: CodeLine[] = ['rule MiRegla {', '  // tu hipótesis', '}'].map((text, i) => ({ text, at: editorAt + 10 + i * 8 }));
  const arrow = (x: number, at: number) => (
    <Reveal frame={frame} at={at} x={x} y={430}>
      <Icon name="arrowRight" size={40} color={C.muted} />
    </Reveal>
  );

  return (
    <Stage>
      <Reveal frame={frame} at={editorAt} x={0} y={0} w={820}>
        <CodeBlock frame={frame} lines={code} title="Editor de la lección" width={820} size={30} />
      </Reveal>
      <Reveal frame={frame} at={noAt} x={0} y={216}>
        <Pill icon="x" tone="amber" size={28}>no compila ni ejecuta</Pill>
      </Reveal>
      <Reveal frame={frame} at={downloadAt} x={0} y={282}>
        <FileTile frame={frame} at={downloadAt} name="MiRegla.yar" sub="texto descargado" tone="sky" w={430} h={84} mono />
      </Reveal>

      <Reveal frame={frame} at={at('s09-02')} x={870} y={0}>
        <InfoCard icon="gear" title="YARA Forge" sub="simulación por etiquetas" tone="amber" w={858} h={112} />
      </Reveal>
      <Reveal frame={frame} at={at('s09-03')} x={870} y={130}>
        <InfoCard icon="archive" title="Paquete de la práctica" sub="datos inertes · instrucciones · verificador" tone="emerald" w={858} h={112} />
      </Reveal>
      <Reveal frame={frame} at={w('s09-03', 'motor') - 8} x={870} y={256}>
        <Pill icon="terminal" tone="sky" size={28}>un motor real comprueba sintaxis y coincidencias</Pill>
      </Reveal>

      {/* three stages */}
      <Reveal frame={frame} at={at('s09-04') - 40} x={0} y={390}>
        <InfoCard icon="file" title="1 · Escribir" sub="editor de la lección" tone="cyan" w={540} h={112} />
      </Reveal>
      {arrow(547, compileAt)}
      <Reveal frame={frame} at={compileAt} x={594} y={390}>
        <InfoCard icon="check" title="2 · Compilar" sub="comprueba la sintaxis" tone="sky" w={540} h={112} />
      </Reveal>
      {arrow(1141, runAt)}
      <Reveal frame={frame} at={runAt} x={1188} y={390}>
        <InfoCard icon="play" title="3 · Ejecutar" sub="aplica la regla a los archivos" tone="muted" w={540} h={112} style={{ borderStyle: 'dashed' }} />
      </Reveal>
      <Reveal frame={frame} at={runAt + 30} x={1188} y={512}>
        <Pill icon="clock" tone="muted" size={26}>aún por hacer</Pill>
      </Reveal>

      <Reveal frame={frame} at={at('s09-05')} x={0} y={512}>
        <div style={{ display: 'flex', gap: 20 }}>
          <Pill icon="alert" tone="amber" size={28}>aunque compile, puede coincidir con controles</Pill>
          <Pill icon="alert" tone="amber" size={28}>o perder variantes</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s09-06')} x={0} y={590}>
        <Pill icon="search" tone="cyan" size={30}>validar = resultados por archivo + explicación de los errores</Pill>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Escribir, compilar y ejecutar son comprobaciones distintas" />
    </Stage>
  );
}
