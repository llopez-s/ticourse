import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { RuleCards } from '../../../engine/src/ui/RuleCards';
import { Icon } from '../../../engine/src/ui/Icon';
import { Pill, Reveal } from './parts/bits';
import { LetterTile } from './parts/Ficha';
import { Stage, segment, wordFrame } from './kit';

const S = 's10-cierre';

/**
 * s10-cierre «La investigación que puedes explicar». Three rule cards (a candidate is not attribution /
 * corroborate against alternatives / document the limits), what a score, a path or a shared address must not
 * become, the goal, then the single action — resolve B, C, D and E in the lesson — with the four fichas as a
 * closing strip and the independence notice. No exam badges, no lab answers.
 */
export function S10Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const action = props.cue('s10-c');
  const strip = at('s10-06');
  const credits = progress(frame, action + 90, 20);
  const out = action - 6;

  return (
    <Stage>
      <RuleCards
        width={1728}
        height={330}
        slotAt={at('s10-01') - 20}
        dimFrom={action}
        titleSize={44}
        subSize={30}
        artHeight={0}
        rules={[
          { title: ['Un candidato', 'no es atribución'], sub: 'el hash exacto identifica bytes', icon: 'search', tone: 'cyan', at: at('s10-01') },
          { title: ['Corrobora', 'con alternativas'], sub: 'contexto e independencia', icon: 'split', tone: 'sky', at: w('s10-01', 'Las') - 6 },
          { title: ['Documenta', 'los límites'], sub: 'conserva las dudas abiertas', icon: 'flag', tone: 'emerald', at: at('s10-02') },
        ]}
      />
      <Reveal frame={frame} at={w('s10-03', 'conviertes') - 10} outAt={w('s10-04', 'objetivo') - 6} x={0} y={372} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[
            ['una puntuación', w('s10-03', 'puntuación,')],
            ['una ruta', w('s10-03', 'ruta')],
            ['una dirección compartida', w('s10-03', 'dirección')],
          ].map(([t, f]) => (
            <span key={t as string} style={{ opacity: progress(frame, (f as number) - 6, 14) }}>
              <Pill tone="amber" size={32}>{t}</Pill>
            </span>
          ))}
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s10-03', 'familia') - 8} outAt={w('s10-04', 'objetivo') - 6} x={0} y={448} w={1728}>
        <Pill icon="x" tone="amber" size={34}>no es una familia confirmada</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s10-04', 'objetivo')} outAt={out} x={0} y={372} w={1728}>
        <Pill icon="x" tone="muted" size={34}>el objetivo no es llenar el grafo</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s10-04', 'sostener') - 8} outAt={out} x={0} y={448} w={1728}>
        <Pill icon="check" tone="emerald" size={34}>sostener una relación que resista las alternativas</Pill>
      </Reveal>

      <Reveal frame={frame} at={action} x={0} y={366} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 176, display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.75)}`, background: alpha(C.amberDeep, 0.35), fontFamily: FONT.sans }}>
          <Icon name="flag" size={52} color={C.amber} />
          <div>
            <div style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 4, color: C.amber }}>PRÁCTICA COMPLEMENTARIA</div>
            <div style={{ marginTop: 4, fontSize: 44, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>Resuelve B, C, D y E en la lección s3m2 · decide qué harías con cada ficha y escribe el motivo</div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={strip} x={0} y={566} w={1728}>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          {(['B', 'C', 'D', 'E'] as const).map((l, i) => (
            <span key={l} style={{ opacity: progress(frame, strip + i * 8, 12) }}>
              <LetterTile letter={l} tone={[C.emerald, C.amber, C.sky, C.muted][i]} size={60} />
            </span>
          ))}
          <span style={{ opacity: progress(frame, w('s10-06', 'línea') - 6, 14) }}>
            <Pill icon="link" tone="muted" size={32}>una línea en el grafo no lo decide por ti</Pill>
          </span>
        </div>
      </Reveal>
      {credits > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 636, width: 1728, opacity: credits, fontFamily: FONT.sans, fontSize: TYPE.micro + 2, fontWeight: 560, color: C.faint, whiteSpace: 'nowrap' }}>
          Alertópolis · material independiente, no afiliado a SANS/GIAC · fichas y datos ficticios
        </div>
      ) : null}
    </Stage>
  );
}
