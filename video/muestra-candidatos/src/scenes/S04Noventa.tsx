import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Choices, InfoCard, LearningCard, Pill, Reveal, Tag } from './parts/bits';
import { Ficha } from './parts/Ficha';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's04-caso';
const ROW = 252; // centre line of the A — C row

/** A link between A and C with its label sitting on the line. */
function Link({ frame, at, x, label, tone }: { frame: number; at: number; x: number; label: string; tone: string }) {
  const p = progress(frame, at, 16);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: ROW, transform: 'translate(-50%, -50%)', opacity: p }}>
      <div style={{ padding: '6px 18px', borderRadius: RADIUS.pill, background: C.ink950, border: `2px solid ${alpha(tone, 0.8)}` }}>
        <Tag tone={tone} size={30}>{label}</Tag>
      </div>
    </div>
  );
}

/**
 * s04-caso «Qué significa ese noventa y cuatro». A and C joined by two links (imphash I1, ssdeep 94) that both
 * come from one shared library. The two options wait neutral until the pause ends; at the reveal the
 * discriminating evidence (the differing configuration) appears. Then the 94 is not a probability, two
 * dependent signals are not two corroborations, and C stays weak — neither confirmed nor benign.
 */
export function S04Noventa(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s04-b');
  const lib = w('s04-01', 'biblioteca') - 6;
  const verdict = props.cue('s04-c');
  const alt = at('s04-06');
  const cardAt = audioEnd(S, 's04-06') + 6;
  const l1 = w('s04-01', 'comparte');
  const l2 = w('s04-01', 'puntuación');
  const linesP = progress(frame, lib, 22);
  const cLit = progress(frame, verdict, 14) * (1 - progress(frame, alt, 14));

  return (
    <Stage>
      <Reveal frame={frame} at={at('s04-01')} x={0} y={196}>
        <Ficha letter="A" tone={C.cyan} title="Muestra A" sub="referencia" w={380} h={112} />
      </Reveal>
      <Reveal frame={frame} at={w('s04-01', 'C')} x={1348} y={196}>
        <Ficha letter="C" tone={C.amber} title="Candidato C" sub={frame >= verdict ? 'coincidencia débil' : 'un parecido'} w={380} h={112} lit={cLit} />
      </Reveal>

      <svg width={1728} height={300} style={{ position: 'absolute', left: 0, top: 190 }}>
        <line x1={392} y1={ROW - 190} x2={392 + 944 * progress(frame, l1 - 6, 30)} y2={ROW - 190} stroke={alpha(C.muted, 0.6)} strokeWidth={4} strokeLinecap="round" />
        {/* both links come from the same library */}
        <line x1={864} y1={150} x2={864 - 224 * linesP} y2={150 - 88 * linesP} stroke={alpha(C.sky, 0.8)} strokeWidth={4} strokeDasharray="10 8" strokeLinecap="round" />
        <line x1={864} y1={150} x2={864 + 224 * linesP} y2={150 - 88 * linesP} stroke={alpha(C.sky, 0.8)} strokeWidth={4} strokeDasharray="10 8" strokeLinecap="round" />
      </svg>
      <Link frame={frame} at={l1 + 10} x={640} label="imphash · I1" tone={C.cyan} />
      <Link frame={frame} at={l2 + 6} x={1088} label="ssdeep · 94" tone={C.cyan} />

      <Reveal frame={frame} at={lib} x={654} y={340} w={420}>
        <InfoCard icon="layers" title="Biblioteca común" sub="origen de ambos rasgos" tone="sky" w={420} h={84} titleSize={34} subSize={26} lit={progress(frame, at('s04-04'), 14) * (1 - progress(frame, verdict, 14))} />
      </Reveal>
      <Reveal frame={frame} at={w('s04-03', 'noventa') - 10} outAt={verdict} x={564} y={436} w={600}>
        <div style={{ textAlign: 'center' }}>
          <Pill icon="x" tone="amber" size={28} strike>94 % de probabilidad de familia</Pill>
        </div>
      </Reveal>

      {/* what tells the explanations apart */}
      <Reveal frame={frame} at={reveal + 8} x={0} y={346}>
        <div style={{ display: 'grid', gap: 8 }}>
          <Tag tone="cyan" size={28}>DEMO-CFG-7</Tag>
          <span style={{ fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, color: C.muted }}>su configuración</span>
        </div>
      </Reveal>
      <Reveal frame={frame} at={reveal + 20} x={1228} y={346} w={500}>
        <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
          <Tag tone="amber" size={28}>configuración distinta</Tag>
          <span style={{ fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, color: C.muted }}>la de C</span>
        </div>
      </Reveal>
      <Reveal frame={frame} at={reveal + 34} outAt={at('s04-04')} x={0} y={494} w={1728}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pill icon="search" tone="emerald" size={30}>buscar lo que distingue las explicaciones</Pill>
        </div>
      </Reveal>

      {/* bottom row: options, then what the figure means */}
      <Reveal frame={frame} at={at('s04-02')} outAt={at('s04-04') - 10} x={0} y={572} w={1728}>
        <Choices frame={frame} at={at('s04-02')} revealAt={reveal} labels={['Confirmar misma familia', 'Buscar evidencia que discrimine']} answer={1} />
      </Reveal>
      <Reveal frame={frame} at={w('s04-04', 'dos')} outAt={verdict - 6} x={0} y={584} w={1728}>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          <Pill icon="merge" tone="sky" size={32}>dos señales, un mismo componente</Pill>
          <span style={{ opacity: progress(frame, w('s04-04', 'corroboraciones') - 10, 14) }}>
            <Pill icon="x" tone="amber" size={32}>no son dos corroboraciones</Pill>
          </span>
        </div>
      </Reveal>
      <Reveal frame={frame} at={verdict} outAt={alt - 6} x={0} y={584} w={1728}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Pill icon="alert" tone="amber" size={32}>coincidencia débil</Pill>
          <span style={{ opacity: progress(frame, w('s04-05', 'incorporas') - 8, 14) }}>
            <Pill icon="pause" tone="muted" size={32}>fuera del conjunto, por ahora</Pill>
          </span>
          <span style={{ opacity: progress(frame, w('s04-05', 'Tampoco') - 6, 14) }}>
            <Pill icon="x" tone="muted" size={32}>no es benigno</Pill>
          </span>
        </div>
      </Reveal>
      <Reveal frame={frame} at={alt} x={0} y={584} w={1728}>
        <Pill icon="split" tone="amber" size={32}>explicación alternativa todavía sin descartar</Pill>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Dos señales dependientes no son dos corroboraciones" />
    </Stage>
  );
}
