import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Icon } from '../../../engine/src/ui/Icon';
import { LearningCard, Pill, Reveal } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's09-caso';
const ROW_H = 52;
const HEAD_H = 56;

interface Field {
  label: string;
  value: string;
  at: number;
  lit: number;
  bar?: boolean;
}

function Row({ frame, f }: { frame: number; f: Field }) {
  const p = progress(frame, f.at, 12);
  return (
    <div style={{ boxSizing: 'border-box', height: ROW_H, display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', borderBottom: `2px solid ${C.ink700}`, background: alpha(C.cyan, 0.12 * f.lit), opacity: p, transform: `translateX(${(1 - p) * 14}px)` }}>
      <span style={{ width: 220, fontSize: 26, fontWeight: 700, letterSpacing: 0.4, color: f.lit > 0.3 ? C.cyanSoft : C.faint, textTransform: 'uppercase', flexShrink: 0 }}>{f.label}</span>
      <span style={{ fontSize: 30, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{f.value}</span>
      {f.bar ? <div style={{ width: 150, height: 18, borderRadius: 9, background: `repeating-linear-gradient(90deg, ${C.ink600} 0 12px, ${C.ink700} 12px 20px)` }} /> : null}
    </div>
  );
}

/**
 * s09-caso «Una entrega que puede mantenerse». The delivery sheet on the left (rule, version 1.0 with the editorial
 * date, scope ALRTDEMO v1, engine, corpus + hash bar, result, limits, intended action) fills in quickly, then the
 * two rows the voice adds: responsible owner (didactic) and review trigger. On the right the risks of an
 * unmaintained rule, how to report errors and when to review, and the re-run loop after a change (pattern or
 * corpus). The hash row lights with «ayudan / no prueban»; the closing pills say evaluate, repeat, maintain.
 * Learning card at the end. No deployment date is shown.
 */
export function S09Ficha(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const cardAt = audioEnd(S, 's09-06') + 6;
  const t0 = at('s09-01') + 4;
  const tOwner = w('s09-01', 'responsable') - 6;
  const tReview = w('s09-01', 'revisión') - 6;

  const fields: Field[] = [
    { label: 'Regla', value: 'Alertopolis_Demo_Family', at: t0 + 12, lit: 0 },
    { label: 'Versión', value: '1.0 · fecha editorial 2026-10-19', at: t0 + 18, lit: 0 },
    { label: 'Alcance', value: 'ALRTDEMO v1 · datos sintéticos', at: t0 + 24, lit: 0 },
    { label: 'Motor', value: 'YARA 4.5.4', at: t0 + 30, lit: 0 },
    { label: 'Corpus', value: '12 casos · hash', at: t0 + 36, lit: windowWeight(frame, w('s09-04', 'hashes') - 4, at('s09-05')), bar: true },
    { label: 'Resultado', value: '12/12 conformes al alcance', at: t0 + 42, lit: 0 },
    { label: 'Límites', value: 'variante v2 sin cobertura · tope 4096 bytes', at: t0 + 48, lit: 0 },
    { label: 'Acción', value: 'práctica o punto de partida', at: t0 + 54, lit: 0 },
    { label: 'Responsable', value: 'dueño didáctico del ejercicio', at: tOwner, lit: windowWeight(frame, tOwner, tReview) },
    { label: 'Revisión', value: 'ante nuevos fixtures o errores', at: tReview, lit: windowWeight(frame, tReview, w('s09-01', 'cubrir')) },
  ];

  const closeOut = at('s09-06') - 4;
  return (
    <Stage>
      <Reveal frame={frame} at={t0} x={0} y={0} w={1000} distance={8}>
        <div style={{ boxSizing: 'border-box', width: 1000, height: HEAD_H, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`, background: alpha(C.ink800, 0.95), border: `2px solid ${C.ink700}`, fontFamily: FONT.sans }}>
          <Icon name="archive" size={32} color={C.cyan} />
          <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong }}>Ficha de entrega</span>
        </div>
      </Reveal>
      <div style={{ position: 'absolute', left: 0, top: HEAD_H, width: 1000, borderLeft: `2px solid ${C.ink700}`, borderRight: `2px solid ${C.ink700}`, background: C.ink900, fontFamily: FONT.sans, minHeight: fields.length * ROW_H }}>
        {fields.map((f) => (
          <Row key={f.label} frame={frame} f={f} />
        ))}
      </div>

      {/* risks of an unmaintained rule, then how to report and when to review */}
      <Reveal frame={frame} at={w('s09-01', 'cubrir') - 12} x={1060} y={0}>
        <Pill icon="eyeOff" tone="rose" size={30}>puede dejar de cubrir lo que interesa</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s09-01', 'legítimo') - 12} x={1060} y={66}>
        <Pill icon="alert" tone="amber" size={30}>coincidir con contenido legítimo</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s09-02', 'comunicar') - 8} x={1060} y={150}>
        <Pill icon="bell" tone="sky" size={30}>cómo comunicar errores</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s09-02', 'revisarla') - 8} x={1060} y={216}>
        <Pill icon="clock" tone="sky" size={30}>cuándo revisarla</Pill>
      </Reveal>

      {/* re-run after a change */}
      <Reveal frame={frame} at={w('s09-03', 'cambias', 0) - 6} x={1060} y={310}>
        <Pill icon="gear" tone="amber" size={30}>cambias un patrón</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s09-03', 'conserva') - 6} x={1060} y={376}>
        <Pill icon="archive" tone="cyan" size={30}>conservas la versión anterior</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s09-03', 'repite') - 6} x={1060} y={442}>
        <Pill icon="play" tone="emerald" size={30}>repites las pruebas</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s09-03', 'registra') - 8} x={1060} y={508}>
        <Pill icon="record" tone="sky" size={28}>cambias el corpus: registra qué y por qué</Pill>
      </Reveal>

      {/* hash, then the promise of the delivery */}
      <Reveal frame={frame} at={w('s09-04', 'hashes') - 6} outAt={at('s09-05') - 6} x={0} y={600}>
        <Pill icon="check" tone="emerald" size={30}>el hash identifica los archivos exactos</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s09-04', 'prueban') - 6} outAt={at('s09-05') - 6} x={700} y={600}>
        <Pill icon="x" tone="amber" size={30}>no prueba que sean representativos</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s09-05', 'evaluar') - 6} outAt={closeOut} x={0} y={600}>
        <div style={{ display: 'flex', gap: 18 }}>
          <Pill icon="search" tone="cyan" size={30}>evaluar</Pill>
          <Pill icon="play" tone="cyan" size={30}>repetir</Pill>
          <Pill icon="gear" tone="cyan" size={30}>mantener</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s09-06')} x={0} y={600}>
        <Pill icon="file" tone="muted" size={30}>la ficha basta: sin tu conversación</Pill>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Versión, resultados, acción y responsable viajan juntos" />
    </Stage>
  );
}
