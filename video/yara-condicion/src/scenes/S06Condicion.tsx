import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../engine/src/ui/tone';
import { InfoCard, LearningCard, Pill, Reveal } from './parts/bits';
import { CodeBlock, type CodeLine } from './parts/Code';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's06-caso';
const COLS = ['$family', '$route', '$hex'] as const;
const COL_X = [190, 370, 550];
const ICON_X = [237, 407, 568]; // icon centred under each header
const ROW_H = 66;

type Cell = 'yes' | 'no' | 'diff';
const ROWS: { name: string; cells: [Cell, Cell, Cell]; control?: boolean }[] = [
  { name: 'A', cells: ['yes', 'yes', 'yes'] },
  { name: 'B', cells: ['yes', 'yes', 'no'] },
  { name: 'C', cells: ['yes', 'diff', 'yes'] },
  { name: 'benign-hex', cells: ['no', 'no', 'yes'], control: true },
];
const SHOWN: Record<Cell, { icon: IconName; tone: Tone }> = {
  yes: { icon: 'check', tone: 'emerald' },
  no: { icon: 'x', tone: 'muted' },
  diff: { icon: 'alert', tone: 'amber' },
};

function Row({ frame, at, row, y, lit }: { frame: number; at: number; row: (typeof ROWS)[number]; y: number; lit?: Tone }) {
  const p = progress(frame, at, 14);
  if (p <= 0.001) return null;
  const lt = lit ? toneOf(lit) : null;
  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: 760, height: ROW_H, opacity: p, boxSizing: 'border-box', display: 'flex', alignItems: 'center', borderRadius: RADIUS.sm, background: lt ? alpha(lt.fg, 0.14) : C.ink850, border: `2px solid ${lt ? alpha(lt.fg, 0.8) : C.ink700}`, fontFamily: FONT.sans }}>
      <span style={{ position: 'absolute', left: 16, fontSize: row.control ? 28 : 36, fontWeight: 850, fontFamily: row.control ? FONT.mono : FONT.sans, color: row.control ? C.muted : C.textStrong }}>{row.name}</span>
      {row.cells.map((c, i) => (
        <span key={i} style={{ position: 'absolute', left: ICON_X[i], top: 12 }}>
          <Icon name={SHOWN[c].icon} size={40} color={toneOf(SHOWN[c].tone).fg} strokeWidth={3} />
        </span>
      ))}
    </div>
  );
}

/**
 * s06-caso «La ruta cambia, el marcador permanece». A table of what each file contains (A, B, C and later the
 * control benign-hex) against $family / $route / $hex. On the right the condition is built token by token —
 * the necessary marker, then the two alternatives inside parentheses — with the wrong groupings that follow:
 * ($family and $route) or $hex lets the control in; asking for all of them loses C. Hypothesis card, learning card.
 */
export function S06Condicion(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const hypo = props.cue('s06-c');
  const cardAt = audioEnd(S, 's06-07') + 6;
  const ctrlAt = w('s06-05', 'control') - 6;
  const wrongAt = w('s06-05', 'bastaran') - 20;
  const markerAt = w('s06-04', 'marcador') - 6;
  const parenAt = w('s06-04', 'paréntesis') - 6;
  const needAt = at('s06-03') + 20;

  const hdr = progress(frame, at('s06-01'), 14);
  // the condition grows with the voice: marker, «and», the alternatives, the closing parenthesis
  const steps: [number, string][] = [
    [w('s06-04', 'además'), ' and'],
    [w('s06-04', 'ruta') - 4, ' ($route'],
    [w('s06-04', 'o') - 4, ' or'],
    [w('s06-04', 'bytes') - 4, ' $hex)'],
  ];
  const text = '$family' + steps.filter(([f]) => frame >= f).map(([, t]) => t).join('');
  const good: CodeLine[] = [{ text, at: markerAt }];

  return (
    <Stage>
      {/* table */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 760, height: 60, opacity: hdr, fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, color: C.cyanSoft }}>
        {COLS.map((c, i) => (
          <span key={c} style={{ position: 'absolute', left: COL_X[i], top: 14 }}>{c}</span>
        ))}
      </div>
      <Row frame={frame} at={at('s06-01') + 6} row={ROWS[0]} y={64} />
      <Row frame={frame} at={at('s06-01') + 22} row={ROWS[1]} y={64 + ROW_H + 10} />
      <Row frame={frame} at={at('s06-02')} row={ROWS[2]} y={64 + 2 * (ROW_H + 10)} />
      <Row frame={frame} at={ctrlAt} row={ROWS[3]} y={64 + 3 * (ROW_H + 10)} lit={wrongAt <= frame ? 'amber' : undefined} />
      <Reveal frame={frame} at={at('s06-01') + 40} x={0} y={372} w={760}>
        <Pill tone="cyan" size={28}>marcador en las tres · misma ruta en A y B</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s06-02') + 40} x={0} y={434} w={760}>
        <Pill icon="alert" tone="amber" size={28}>C cambia la ruta pero conserva los bytes</Pill>
      </Reveal>

      {/* condition, built */}
      <Reveal frame={frame} at={needAt} x={820} y={0} w={908}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Pill tone="emerald" size={28}>una parte necesaria</Pill>
          <Pill tone="sky" size={28}>dos alternativas</Pill>
        </div>
      </Reveal>
      <div style={{ position: 'absolute', left: 820, top: 70, opacity: progress(frame, markerAt, 12), width: 908 }}>
        <CodeBlock frame={frame} lines={good} title="condition" width={908} size={38} tone="emerald" lit={progress(frame, hypo, 14)} />
      </div>
      <Reveal frame={frame} at={parenAt} x={820} y={226} w={908}>
        <Pill icon="split" tone="muted" size={28}>los paréntesis agrupan las alternativas</Pill>
      </Reveal>

      <Reveal frame={frame} at={wrongAt} x={820} y={296} w={908}>
        <CodeBlock
          frame={frame}
          lines={[{ text: '($family and $route) or $hex', at: wrongAt, lit: 1, tone: 'amber' }]}
          title="otra agrupación"
          width={908}
          size={34}
          tone="amber"
          chip={<Pill icon="alert" tone="amber" size={26}>los bytes solos bastan</Pill>}
        />
      </Reveal>
      <Reveal frame={frame} at={wrongAt + 30} x={820} y={444} w={908}>
        <Pill icon="archive" tone="amber" size={28}>benign-hex coincidiría: un control aceptado</Pill>
      </Reveal>

      {/* hypothesis */}
      <Reveal frame={frame} at={hypo} x={0} y={510} w={1728}>
        <InfoCard icon="target" title="Un marcador junto a una evidencia alternativa" sub="la hipótesis, dicha antes del código" tone="emerald" w={1100} h={120} titleSize={40} />
      </Reveal>
      <Reveal frame={frame} at={hypo + 60} x={1140} y={510} w={588}>
        <div style={{ display: 'grid', gap: 12 }}>
          <Pill icon="x" tone="amber" size={26}>todas a la vez: pierdes C</Pill>
          <Pill icon="x" tone="amber" size={26}>cualquiera de ellas: aceptas controles</Pill>
        </div>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Exige el marcador y una alternativa justificada" />
    </Stage>
  );
}
