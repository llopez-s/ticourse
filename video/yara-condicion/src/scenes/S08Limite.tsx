import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Choices, InfoCard, LearningCard, Pill, Reveal, Tag } from './parts/bits';
import { FileTile } from './parts/Files';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's08-caso';
const LIMIT = 860; // x of the 4096-byte line
const BAR_Y = 302;

/**
 * s08-caso «Lo que dejas fuera también es una decisión». Nothing above y 190 (the think card). A size axis with
 * the limit `filesize < 4KB`: A well inside, boundary-4096 sitting exactly on the line. The two options stay
 * neutral until the pause ends; at the reveal the boundary file steps into the «fuera» side. Then three cards —
 * declared limit, false negative if the target grows, and the v2 file the rule does not cover — and the pills
 * about re-checking the promise. Learning card at the end.
 */
export function S08Limite(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s08-b');
  const cardAt = audioEnd(S, 's08-07') + 6;
  const barAt = at('s08-01');
  const boundaryAt = w('s08-01', 'siguiente') - 6;
  const menorAt = w('s08-02', 'menor') - 6;
  const swing = progress(frame, reveal, 22);
  const largeAt = w('s08-04', 'más') - 4;
  const cardsAt = at('s08-04');
  const bp = progress(frame, barAt, 18);

  return (
    <Stage>
      <Reveal frame={frame} at={barAt} x={0} y={196}>
        <Tag tone="sky" size={34}>filesize &lt; 4KB</Tag>
      </Reveal>

      {/* axis */}
      <div style={{ position: 'absolute', left: 0, top: BAR_Y, width: 1728, height: 56, opacity: bp, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: LIMIT, height: 56, borderRadius: '10px 0 0 10px', background: alpha(C.emerald, 0.14), border: `2px solid ${alpha(C.emerald, 0.5)}`, display: 'flex', alignItems: 'center', paddingLeft: 20, color: '#6ee7b7' }}>
          dentro del límite · menor que 4KB
        </div>
        <div style={{ position: 'absolute', left: LIMIT, top: 0, width: 1728 - LIMIT, height: 56, borderRadius: '0 10px 10px 0', background: alpha(C.faint, 0.18), border: `2px solid ${alpha(C.faint, 0.6)}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 20, color: C.muted }}>
          fuera del límite
        </div>
        <div style={{ position: 'absolute', left: LIMIT - 3, top: -34, width: 6, height: 96, borderRadius: 3, background: C.cyan }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: BAR_Y + 66, opacity: bp, fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.muted }}>0</div>
      <div style={{ position: 'absolute', left: LIMIT - 120, top: BAR_Y + 66, width: 240, textAlign: 'center', opacity: bp, fontFamily: FONT.mono, fontSize: 28, fontWeight: 800, color: C.cyanSoft }}>4096 bytes</div>

      {/* files on the axis */}
      <div style={{ position: 'absolute', left: 350, top: 196 }}>
        <FileTile frame={frame} at={barAt + 14} name="Archivo A" sub="pequeño" letter="A" tone="cyan" w={290} h={78} nameSize={30} />
      </div>
      <div style={{ position: 'absolute', left: 350 + 145 - 2, top: 274, width: 4, height: 28, background: alpha(C.cyan, 0.6), opacity: progress(frame, barAt + 14, 12) }} />

      <div style={{ position: 'absolute', left: LIMIT - 200 + 190 * swing, top: 196 }}>
        <FileTile frame={frame} at={boundaryAt} name="boundary-4096" sub="4096 bytes exactos" tone={swing > 0.5 ? 'amber' : 'sky'} w={400} h={78} lit={swing} mono />
      </div>
      <div style={{ position: 'absolute', left: LIMIT + 190 * swing - 2, top: 274, width: 4, height: 28, background: alpha(swing > 0.5 ? C.amber : C.sky, 0.7), opacity: progress(frame, boundaryAt, 12) }} />

      <div style={{ position: 'absolute', left: 1392, top: 196 }}>
        <FileTile frame={frame} at={largeAt} name="large" sub="mayor que 4096" tone="muted" w={336} h={78} mono />
      </div>
      <div style={{ position: 'absolute', left: 1392 + 168 - 2, top: 274, width: 4, height: 28, background: alpha(C.muted, 0.6), opacity: progress(frame, largeAt, 12) }} />

      <Reveal frame={frame} at={menorAt} x={0} y={412}>
        <Pill icon="alert" tone="sky" size={28}>«menor» es estricto: forma parte de la regla</Pill>
      </Reveal>
      <Reveal frame={frame} at={reveal + 14} x={1010} y={412}>
        <Pill icon="check" tone="emerald" size={28}>esperado por el alcance declarado</Pill>
      </Reveal>

      {/* the decision */}
      <Reveal frame={frame} at={at('s08-02')} outAt={cardsAt - 8} x={0} y={482} w={1728}>
        <Choices frame={frame} at={at('s08-02')} revealAt={reveal} labels={['Cumple el límite estricto', 'Queda fuera del límite']} answer={1} />
      </Reveal>

      {/* declared limit vs false negative vs v2 */}
      <Reveal frame={frame} at={cardsAt} x={0} y={482}>
        <InfoCard icon="flag" title="Límite declarado" sub="esperado en este corpus" tone="sky" w={560} h={104} titleSize={34} subSize={26} />
      </Reveal>
      <Reveal frame={frame} at={cardsAt + 60} x={584} y={482}>
        <InfoCard icon="alert" title="Falso negativo" sub="si el objetivo se amplía" tone="amber" w={560} h={104} titleSize={34} subSize={26} />
      </Reveal>
      <Reveal frame={frame} at={w('s08-06', 'marcador') - 6} x={1168} y={482}>
        <InfoCard icon="search" title="future-uncovered" sub="marcador v2: sin cobertura" tone="amber" w={560} h={104} titleSize={32} subSize={26} />
      </Reveal>

      <Reveal frame={frame} at={at('s08-05')} outAt={at('s08-07') - 6} x={0} y={606}>
        <Pill icon="clock" tone="muted" size={28}>otra promesa, otra comprobación</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s08-06') + 90} x={780} y={606}>
        <Pill icon="eye" tone="muted" size={28}>la regla solo evalúa lo escrito</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s08-07')} x={0} y={606}>
        <Pill icon="check" tone="cyan" size={28}>antes de ampliar: evidencia, objetivo y pruebas</Pill>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Un límite también puede excluir variantes deseadas" />
    </Stage>
  );
}
