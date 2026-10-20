import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { Choices, LearningCard, Pill, Reveal } from './parts/bits';
import { Ficha } from './parts/Ficha';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's08-caso';
const TOP = 196; // the think-pause card owns the first 170 px of the stage
const SLOT_Y = 238;

function Field({ frame, at, icon, label, value, ok }: { frame: number; at: number; icon: IconName; label: string; value: string; ok: boolean }) {
  const p = progress(frame, at, 14);
  const col = ok ? C.cyan : C.faint;
  return (
    <div style={{ boxSizing: 'border-box', width: 620, height: 54, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', borderBottom: `2px solid ${C.ink700}`, opacity: p, transform: `translateX(${(1 - p) * -14}px)`, fontFamily: FONT.sans }}>
      <Icon name={icon} size={32} color={col} />
      <span style={{ width: 200, fontSize: 28, fontWeight: 700, color: C.text }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 700, color: ok ? '#67e8f9' : C.faint, fontStyle: ok ? 'normal' : 'italic' }}>{value}</span>
    </div>
  );
}

/** The two readings of an empty relations field. `lit` (0–1) is the answer glow; `dim` steps it back. */
function Slot({ frame, at, x, title, kind, lit, dim }: { frame: number; at: number; x: number; title: string; kind: 'empty' | 'hidden'; lit: number; dim: number }) {
  const p = progress(frame, at, 16);
  if (p <= 0.001) return null;
  const col = lit > 0 ? C.emerald : C.muted;
  return (
    <div style={{ position: 'absolute', left: x, top: SLOT_Y, width: 500, height: 186, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(col, 0.5 + 0.45 * lit)}`, background: alpha(col, 0.06 + 0.06 * lit), boxShadow: lit > 0 ? `0 0 ${20 + 24 * lit}px ${alpha(C.emerald, 0.28 * lit)}` : 'none', opacity: p * (1 - 0.55 * dim), transform: `translateY(${(1 - p) * 14}px)`, fontFamily: FONT.sans, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px 0', fontSize: 38, fontWeight: 800, color: C.textStrong }}>{title}</div>
      {kind === 'empty' ? (
        <div style={{ margin: '18px 24px 0', display: 'grid', gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 22, borderRadius: 11, border: `2px dashed ${alpha(C.faint, 0.7)}` }} />
          ))}
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 70, bottom: 0, background: `repeating-linear-gradient(135deg, ${alpha(C.faint, 0.25)} 0 12px, transparent 12px 28px)`, display: 'grid', placeItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', borderRadius: RADIUS.pill, background: C.ink950, border: `2px solid ${alpha(col, 0.8)}` }}>
            <Icon name="lock" size={36} color={col} />
            <span style={{ fontSize: 32, fontWeight: 800, color: lit > 0 ? '#6ee7b7' : C.text }}>sin acceso al dato</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * s08-caso «La casilla vacía». Everything starts below the think-pause card. E has a PDB mention and nothing else;
 * the «relaciones» field can read as «sin relaciones» (empty list) or «no disponible» (hidden by access), both
 * neutral until the reveal, when the second one lights and the first steps back. Then what that does not prove,
 * E kept as a pending lead with low confidence, an empty search deserving the same care, and the learning card.
 */
export function S08Casilla(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s08-b');
  const keep = at('s08-04');
  const empty = props.cue('s08-c');
  const fill = at('s08-06');
  const cardAt = audioEnd(S, 's08-06') + 6;
  const r = progress(frame, reveal, 16);
  const pending = progress(frame, keep, 14);

  return (
    <Stage>
      {/* E and what it lacks */}
      <Reveal frame={frame} at={at('s08-01')} x={0} y={TOP}>
        <Ficha letter="E" tone={C.muted} title="Candidato E" sub={pending > 0.5 ? 'pista pendiente · confianza baja' : 'solo una mención de PDB'} w={620} h={112} lit={pending} />
      </Reveal>
      <div style={{ position: 'absolute', left: 0, top: TOP + 124, width: 620, borderRadius: RADIUS.md, border: `2px solid ${C.ink700}`, background: C.ink900, overflow: 'hidden' }}>
        <Field frame={frame} at={w('s08-01', 'ruta')} icon="file" label="Ruta PDB" value="mencionada" ok />
        <Field frame={frame} at={w('s08-01', 'bytes')} icon="database" label="Bytes" value="sin dato" ok={false} />
        <Field frame={frame} at={w('s08-01', 'procedencia')} icon="archive" label="Procedencia" value="sin dato" ok={false} />
      </div>

      {/* the field and its two readings */}
      <Reveal frame={frame} at={w('s08-01', 'acceso') - 4} outAt={reveal} x={700} y={430} w={1028}>
        <Pill icon="lock" tone="amber" size={30}>sin informe accesible que permita contrastarlo</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s08-02')} x={700} y={TOP} w={1028} distance={8}>
        <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, letterSpacing: 1, color: C.faint }}>CAMPO «RELACIONES» DE E</span>
      </Reveal>
      <Slot frame={frame} at={at('s08-02') + 4} x={700} title="Sin relaciones" kind="empty" lit={0} dim={r} />
      <Slot frame={frame} at={at('s08-02') + 16} x={1228} title="No disponible" kind="hidden" lit={r} dim={0} />
      <Reveal frame={frame} at={w('s08-03', 'limitación') - 8} x={700} y={430} w={1028}>
        <Pill icon="gear" tone="sky" size={30}>describe tu limitación de colección</Pill>
      </Reveal>

      {/* what it does not prove */}
      <Reveal frame={frame} at={w('s08-03', 'ausencia') - 14} outAt={empty - 8} x={0} y={504} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color: C.textStrong }}>No demuestra</span>
          <Pill icon="x" tone="amber" size={30}>ausencia de relaciones</Pill>
          <span style={{ opacity: progress(frame, w('s08-03', 'benignidad') - 10, 14) }}>
            <Pill icon="x" tone="amber" size={30}>benignidad</Pill>
          </span>
          <span style={{ opacity: progress(frame, w('s08-03', 'pertenencia') - 10, 14) }}>
            <Pill icon="x" tone="amber" size={30}>pertenencia al conjunto</Pill>
          </span>
        </div>
      </Reveal>

      <Reveal frame={frame} at={at('s08-02')} outAt={keep - 10} x={0} y={572} w={1728}>
        <Choices frame={frame} at={at('s08-02')} revealAt={reveal} labels={['No tiene relaciones', 'No hay dato accesible']} answer={1} />
      </Reveal>
      <Reveal frame={frame} at={keep} outAt={fill - 6} x={0} y={584} w={1728}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Pill icon="pause" tone="amber" size={32}>pista pendiente</Pill>
          <span style={{ opacity: progress(frame, w('s08-04', 'confianza') - 8, 14) }}>
            <Pill icon="chart" tone="amber" size={32}>confianza baja</Pill>
          </span>
          <span style={{ opacity: progress(frame, w('s08-04', 'pides') - 8, 14) }}>
            <Pill icon="search" tone="sky" size={32}>pedir la evidencia que falta</Pill>
          </span>
        </div>
      </Reveal>

      <Reveal frame={frame} at={empty} outAt={fill - 6} x={0} y={504} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Pill icon="search" tone="muted" size={30}>una búsqueda sin resultados puede deberse a</Pill>
          {[
            ['cobertura', w('s08-05', 'cobertura,')],
            ['filtros', w('s08-05', 'filtros')],
            ['falta de datos', w('s08-05', 'falta')],
          ].map(([t, f]) => (
            <span key={t as string} style={{ opacity: progress(frame, (f as number) - 8, 14) }}>
              <Pill tone="amber" size={30}>{t}</Pill>
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal frame={frame} at={fill} x={0} y={504} w={1728}>
        <Pill icon="x" tone="amber" size={32}>no rellenes un hueco inventando un resultado</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s08-06', 'Registrar') - 6} x={0} y={572} w={1728}>
        <Pill icon="check" tone="emerald" size={32}>registrar la limitación también es avanzar</Pill>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="No disponible no equivale a inexistente" />
    </Stage>
  );
}
