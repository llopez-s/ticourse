import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { LearningCard, Pill, Reveal } from './parts/bits';
import { Ficha } from './parts/Ficha';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's09-caso';
const ROW = 54;
const HEAD = 64;

/** One field of the log: its name and a grey placeholder for its content (no real data on the sheet). */
function Field({ frame, at, icon, label, bar, lit = 0 }: { frame: number; at: number; icon: IconName; label: string; bar: number; lit?: number }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ boxSizing: 'border-box', height: ROW, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', borderBottom: `2px solid ${C.ink700}`, background: lit > 0 ? alpha(C.cyan, 0.1 * lit) : 'transparent', opacity: p, transform: `translateX(${(1 - p) * -16}px)`, fontFamily: FONT.sans }}>
      <Icon name={icon} size={32} color={lit > 0 ? C.cyan : C.muted} />
      <span style={{ width: 330, fontSize: 28, fontWeight: 700, color: lit > 0 ? C.textStrong : C.text, whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ height: 14, width: 400 * bar, borderRadius: 7, background: lit > 0 ? alpha(C.cyan, 0.6) : C.ink600 }} />
    </div>
  );
}

function Meter({ frame, at, label, fill, tone }: { frame: number; at: number; label: string; fill: number; tone: string }) {
  const p = progress(frame, at, 26);
  return (
    <div style={{ fontFamily: FONT.sans }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: C.text }}>{label}</div>
      <div style={{ marginTop: 8, width: 828, height: 24, borderRadius: 12, background: C.ink700 }}>
        <div style={{ width: 828 * fill * p, height: 24, borderRadius: 12, background: tone }} />
      </div>
    </div>
  );
}

/**
 * s09-caso «Que otra persona pueda seguirte». The research log fills field by field as the voice names what to
 * keep (query, filters, dates, evidence, source, judgement, alternative, next action, confidence) — grey
 * placeholders, no timestamps. Failed searches and missing functions go in too. On the right, the case's result:
 * B probable by code, C and D not incorporated (weak is not discarded for ever), E pending; what would change
 * the judgement; and a closing pair of meters.
 */
export function S09Bitacora(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const change = props.cue('s09-c');
  const sum = at('s09-06');
  const cardAt = audioEnd(S, 's09-06') + 6;
  const conf = w('s09-05', 'confianza');
  const confLit = progress(frame, conf, 12) * (1 - progress(frame, sum, 14));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 860, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.5)}`, background: C.ink900, overflow: 'hidden', opacity: progress(frame, props.cue('s09-a'), 18) }}>
        <div style={{ boxSizing: 'border-box', height: HEAD, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', background: alpha(C.cyan, 0.1), borderBottom: `2px solid ${C.ink700}`, fontFamily: FONT.sans }}>
          <Icon name="archive" size={36} color={C.cyan} />
          <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>Bitácora</span>
          <span style={{ marginLeft: 'auto', fontSize: 26, fontWeight: 600, color: C.muted }}>ejemplo ficticio</span>
        </div>
        <Field frame={frame} at={w('s09-01', 'consultaste,') - 8} icon="search" label="Consulta" bar={0.8} />
        <Field frame={frame} at={w('s09-01', 'filtros') - 8} icon="funnel" label="Filtros" bar={0.55} />
        <Field frame={frame} at={w('s09-01', 'cuándo.') - 8} icon="clock" label="Fecha de consulta" bar={0.4} />
        <Field frame={frame} at={w('s09-01', 'observación.') - 12} icon="eye" label="Fecha de observación" bar={0.4} />
        <Field frame={frame} at={w('s09-02', 'evidencia') - 8} icon="file" label="Evidencia" bar={0.7} />
        <Field frame={frame} at={w('s09-02', 'origen.') - 10} icon="globe" label="Fuente" bar={0.6} />
        <Field frame={frame} at={w('s09-03', 'conclusión') - 8} icon="flag" label="Juicio" bar={0.85} />
        <Field frame={frame} at={w('s09-05', 'cambiaría') - 8} icon="split" label="Alternativa" bar={0.65} />
        <Field frame={frame} at={w('s09-05', 'Validar') - 8} icon="arrowRight" label="Próxima acción" bar={0.5} />
        <Field frame={frame} at={conf - 8} icon="chart" label="Confianza" bar={0.45} lit={confLit} />
      </div>

      {/* failed searches and missing functions belong in the log too */}
      <Reveal frame={frame} at={w('s09-02', 'fallidas') - 10} x={900} y={0} w={828}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Pill icon="x" tone="amber" size={30}>búsquedas fallidas</Pill>
          <span style={{ opacity: progress(frame, w('s09-02', 'funciones') - 8, 14) }}>
            <Pill icon="lock" tone="muted" size={30}>funciones no disponibles</Pill>
          </span>
        </div>
      </Reveal>

      {/* the case's outcome */}
      {[
        ['B', C.emerald, 'Relacionado probable por código', w('s09-03', 'B') - 10],
        ['C', C.amber, 'No se incorpora con la evidencia actual', w('s09-03', 'C') - 8],
        ['D', C.sky, 'No se incorpora con la evidencia actual', w('s09-03', 'D') - 6],
        ['E', C.muted, 'Sigue pendiente', w('s09-03', 'E') - 8],
      ].map(([l, tone, text, f], i) => (
        <Reveal key={l as string} frame={frame} at={f as number} x={900} y={84 + i * 70} w={828}>
          <Ficha letter={l as string} tone={tone as string} title={text as string} w={828} h={62} tile={46} titleSize={30} lit={i === 0 ? progress(frame, f as number, 14) * (1 - progress(frame, at('s09-04'), 14)) : 0} />
        </Reveal>
      ))}
      <Reveal frame={frame} at={w('s09-04', 'mezcla') - 8} x={900} y={376} w={828}>
        <Pill icon="split" tone="sky" size={30}>débil no es descartado para siempre</Pill>
      </Reveal>

      <Reveal frame={frame} at={change} outAt={sum - 6} x={900} y={452} w={828}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 828, fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color: C.textStrong }}>Qué cambiaría tu juicio</span>
          <span style={{ opacity: progress(frame, w('s09-05', 'Validar') - 6, 14) }}><Pill icon="layers" tone="cyan" size={28}>validar más variantes</Pill></span>
          <span style={{ opacity: progress(frame, w('s09-05', 'contrastar') - 6, 14) }}><Pill icon="gear" tone="cyan" size={28}>contrastar configuración</Pill></span>
          <span style={{ opacity: progress(frame, w('s09-05', 'observación') - 6, 14) }}><Pill icon="eye" tone="cyan" size={28}>una observación independiente</Pill></span>
        </div>
      </Reveal>
      <Reveal frame={frame} at={sum} x={900} y={452} w={828}>
        <div style={{ display: 'grid', gap: 22 }}>
          <Meter frame={frame} at={w('s09-06', 'cuánto')} label="cuánto sostienen los datos" fill={0.62} tone={C.emerald} />
          <Meter frame={frame} at={w('s09-06', 'abiertas') - 10} label="qué tan abiertas siguen las alternativas" fill={0.45} tone={C.amber} />
        </div>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Registra consulta, evidencia, alternativas y confianza" />
    </Stage>
  );
}
