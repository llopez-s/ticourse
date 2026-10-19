import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { progress } from '../../../engine/src/theme/motion';
import { InfoCard, LearningCard, PART, Pill, Reveal } from './parts/bits';
import { CodeBlock, type CodeLine } from './parts/Code';
import { Stage, audioEnd, segment } from './kit';

const S = 's02-caso';

// Lines of the real reference rule (public/labs/yara-practice/reference.yar). The condition body is NOT shown:
// it is the guided lab's solution and the video builds it step by step in s06.
const RULE = [
  'rule Alertopolis_Demo_Family {',
  '  meta:',
  '    author = "Alertopolis"',
  '    version = "1.0"',
  '    date = "2026-10-19"',
  '    scope = "synthetic ALRTDEMO fixtures, not real malware"',
  '  strings:',
  '    $header = "ALRTDEMO" ascii',
  '    $family = "cicada-demo-v1" ascii wide nocase',
  '    $route = "route=/collect-demo" ascii wide',
  '    $hex = { 41 4C 52 54 ?? 7F }',
  '  condition:',
  '    // la combinación se decide aquí',
  '}',
];
const SECTION = ['', 'meta', 'meta', 'meta', 'meta', 'meta', 'strings', 'strings', 'strings', 'strings', 'strings', 'condition', 'condition', ''];

/**
 * s02-caso «Tres partes con trabajos distintos». The reference rule of the lab, line by line, with the part the
 * voice is on lit (meta → sky, strings → cyan, condition → orange) and the others stepped back. A role card per
 * part enters at its cue, with the warning that a family name in meta detects nothing. Learning card at the end.
 */
export function S02Partes(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const a = props.cue('s02-a');
  const b = props.cue('s02-b');
  const c = props.cue('s02-c');
  const cardAt = audioEnd(S, 's02-06') + 6;

  const on = (sec: string) => {
    const [from, to] = sec === 'meta' ? [a, b] : sec === 'strings' ? [b, c] : [c, 1e9];
    return progress(frame, from - 4, 12) * (1 - progress(frame, to - 4, 12));
  };
  const lines: CodeLine[] = RULE.map((text, i) => {
    const sec = SECTION[i];
    const lit = sec ? on(sec) : 0;
    const dim = sec ? Math.min(1, progress(frame, a, 20) * (1 - lit)) * 0.85 : 0;
    const tone = sec === 'meta' ? PART.meta : sec === 'strings' ? PART.strings : PART.condition;
    return { text, at: 10 + i * 5, lit, dim, tone };
  });

  return (
    <Stage>
      <Reveal frame={frame} at={6} x={0} y={0} w={1040}>
        <CodeBlock frame={frame} lines={lines} title="reference.yar" width={1040} size={28} />
      </Reveal>

      <Reveal frame={frame} at={a} x={1080} y={0}>
        <InfoCard icon="file" title="meta" sub="documenta: autoría, versión, alcance" tone={PART.meta} w={648} h={120} lit={on('meta')} />
      </Reveal>
      <Reveal frame={frame} at={at('s02-02')} x={1080} y={130}>
        <Pill icon="x" tone="amber" size={28}>el nombre de familia en meta no es una detección</Pill>
      </Reveal>

      <Reveal frame={frame} at={b} x={1080} y={200}>
        <InfoCard icon="search" title="strings" sub="define: patrones con identificador" tone={PART.strings} w={648} h={120} lit={on('strings')} />
      </Reveal>
      <Reveal frame={frame} at={at('s02-04')} x={1080} y={330}>
        <Pill icon="eye" tone="sky" size={28}>elegirlos exige evidencia</Pill>
      </Reveal>

      <Reveal frame={frame} at={c} x={1080} y={400}>
        <InfoCard icon="split" title="condition" sub="decide: combina patrones y límites" tone={PART.condition} w={648} h={120} lit={on('condition')} />
      </Reveal>
      <Reveal frame={frame} at={c + 70} x={1080} y={530}>
        <Pill icon="flag" tone={PART.condition} size={28}>la combinación es la promesa</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s02-06')} x={1080} y={592}>
        <Pill icon="check" tone="muted" size={28}>si prometes variantes, compruébalas</Pill>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Meta documenta; strings define; condition decide" />
    </Stage>
  );
}
