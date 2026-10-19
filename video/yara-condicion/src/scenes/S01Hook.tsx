import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { KIND, Pill, Reveal } from './parts/bits';
import { CodeBlock, type CodeLine } from './parts/Code';
import { FileTile } from './parts/Files';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-hook';

/**
 * s01-hook «Una regla con una promesa concreta». Headline at the `title` cue (before 12 s). The Meridian desk: the
 * student's empty rule in an editor (left) and the ALRTDEMO corpus (right) with its «inerte · no es malware» seal.
 * The three target variants A/B/C appear as the voice counts them, then the look-alike controls; the closing
 * note says the letters are names of the explanation, not part of the condition.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const title = props.cue('title');
  const ctx = props.cue('s01-b');
  const s03 = at('s01-03');
  const s05 = at('s01-05');
  const editorAt = w('s01-01', 'regla') - 12;
  const sealAt = w('s01-01', 'inertes') - 14;
  const corpusAt = props.cue('s01-c');
  const targetsAt = w('s01-04', 'tres') - 8;
  const controlsAt = w('s01-04', 'rechazar') - 8;

  const code: CodeLine[] = [
    'rule MiRegla {',
    '  meta:',
    '    // contexto',
    '  strings:',
    '    // patrones',
    '  condition:',
    '    // hipótesis',
    '}',
  ].map((text, i) => ({ text, at: editorAt + 10 + i * 7 }));

  const tp = progress(frame, title, 18);
  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, opacity: tp, transform: `translateY(${(1 - tp) * 18}px)`, fontFamily: FONT.sans, fontSize: 54, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap' }}>
        Escribir YARA: <span style={{ color: C.cyan }}>qué debe coincidir y qué puede cambiar</span>
      </div>

      <Reveal frame={frame} at={ctx} x={0} y={96}>
        <Pill icon="flag" tone="sky" size={30}>Meridian · empresa aeroespacial</Pill>
      </Reveal>

      <Reveal frame={frame} at={editorAt} x={0} y={170} w={800}>
        <CodeBlock frame={frame} lines={code} title="Editor YARA · MiRegla" width={800} size={28} />
      </Reveal>

      {/* corpus */}
      <Reveal frame={frame} at={sealAt} x={868} y={96}>
        <Pill icon="shield" tone="emerald" size={28}>Corpus sintético e inerte · no es malware</Pill>
      </Reveal>
      <Reveal frame={frame} at={corpusAt} x={868} y={166} w={860}>
        <div style={{ boxSizing: 'border-box', width: 860, height: 362, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.sky, 0.45)}`, background: C.ink900 }} />
      </Reveal>
      <Reveal frame={frame} at={corpusAt + 6} x={888} y={178}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans }}>
          <Icon name="archive" size={36} color={C.sky} />
          <span style={{ fontSize: 38, fontWeight: 850, color: C.textStrong }}>Corpus ALRTDEMO</span>
        </div>
      </Reveal>
      <div style={{ position: 'absolute', left: 888, top: 236, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted, opacity: progress(frame, targetsAt, 14) }}>
        Lo que queremos reconocer
      </div>
      <div style={{ position: 'absolute', left: 888, top: 276, display: 'flex', gap: 17 }}>
        {['A', 'B', 'C'].map((l, i) => (
          <FileTile key={l} frame={frame} at={targetsAt + i * 16} name={`Archivo ${l}`} sub="variante" letter={l} tone={KIND.target} w={262} h={86} nameSize={30} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 888, top: 376, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted, opacity: progress(frame, controlsAt, 14) }}>
        Lo que debe quedar fuera
      </div>
      <div style={{ position: 'absolute', left: 888, top: 416, display: 'flex', gap: 17 }}>
        {['benign-common', 'benign-hex', 'benign-manual'].map((n, i) => (
          <FileTile key={n} frame={frame} at={controlsAt + i * 14} name={n} tone={KIND.control} w={262} h={72} mono nameSize={26} noIcon />
        ))}
      </div>

      {/* what a rule is */}
      <Reveal frame={frame} at={at('s01-02') + 90} outAt={s03} x={0} y={584}>
        <Pill icon="target" tone="cyan" size={30}>una regla = una hipótesis sobre el contenido</Pill>
      </Reveal>
      <Reveal frame={frame} at={s03} outAt={s05} x={0} y={584}>
        <div style={{ display: 'flex', gap: 20 }}>
          <Pill icon="alert" tone="amber" size={30}>no decide si algo es malicioso</Pill>
          <Pill icon="check" tone="emerald" size={30}>detecta lo que tú definas</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={s05} x={0} y={584}>
        <Pill icon="eyeOff" tone="muted" size={30}>A, B y C son nombres de la explicación, no de la condición</Pill>
      </Reveal>
    </Stage>
  );
}
