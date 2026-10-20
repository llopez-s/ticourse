import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { Choices, LearningCard, Note, Pill, Reveal } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's08-caso';
const TOP = 180; // the engine's pause card sits in the first 170 px of the stage
const CHOICE_Y = 392;

function Block({ frame, at, x, icon, title, sub, tone }: { frame: number; at: number; x: number; icon: IconName; title: string; sub: string; tone: string }) {
  return (
    <Reveal frame={frame} at={at} x={x} y={CHOICE_Y} w={544}>
      <div style={{ boxSizing: 'border-box', width: 544, height: 150, padding: '16px 22px', borderRadius: RADIUS.md, border: `2px solid ${alpha(tone, 0.75)}`, background: alpha(tone, 0.08), fontFamily: FONT.sans }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name={icon} size={40} color={tone} />
          <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong }}>{title}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 29, fontWeight: 600, lineHeight: 1.18, color: C.text }}>{sub}</div>
      </div>
    </Reveal>
  );
}

/**
 * s08-caso «¿Qué te permite avanzar?». Below the engine's pause band: the two pieces of evidence side by side
 * (the confirmation email; the set of controls, later activity and device recovery), with the same two options
 * under them and no answer colour until s08-b. At the reveal the set lights and the email steps back with its
 * limit written («no acredita el cierre de todas las sesiones»). Then three blocks — evidence, limits,
 * monitoring — and the line that this is not an absolute guarantee. Learning card.
 */
export function S08Evidencia(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const reveal = props.cue('s08-b');
  const blocks = at('s08-04') + 12;
  const cardAt = audioEnd(S, 's08-06') + 6;
  const r = progress(frame, reveal, 16);
  const lim = progress(frame, wordFrame(S, 's08-03', 'acredita') - 10, 12);

  return (
    <Stage>
      <Reveal frame={frame} at={wordFrame(S, 's08-01', 'correo') - 16} x={0} y={TOP} w={560}>
        <div style={{ boxSizing: 'border-box', width: 560, height: 176, padding: '16px 22px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.sky, 0.4 + 0.2 * (1 - r))}`, background: C.ink850, opacity: 1 - 0.45 * r, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="mail" size={44} color={C.sky} />
            <span style={{ fontSize: 34, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>Correo de confirmación</span>
          </div>
          <div style={{ position: 'relative', marginTop: 10, fontSize: 29, fontWeight: 600, lineHeight: 1.18 }}>
            <div style={{ color: '#7dd3fc', opacity: 1 - lim }}>avisa del cambio de contraseña</div>
            <div style={{ position: 'absolute', left: 0, top: 0, color: '#fcd34d', fontWeight: 650, opacity: lim }}>confirma una acción concreta, no el cierre de todas las sesiones</div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={wordFrame(S, 's08-01', 'controles') - 18} x={608} y={TOP} w={1120}>
        <div style={{ boxSizing: 'border-box', width: 1120, height: 176, padding: '16px 24px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.emerald, 0.35 + 0.55 * r)}`, background: r > 0 ? alpha(C.emerald, 0.08 * r + 0.0) : C.ink850, boxShadow: r > 0 ? `0 0 ${24 * r}px ${alpha(C.emerald, 0.25 * r)}` : 'none', fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="layers" size={44} color={r > 0 ? C.emerald : C.cyan} />
            <span style={{ fontSize: 38, fontWeight: 850, color: C.textStrong }}>Conjunto de comprobaciones</span>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 14 }}>
            <span style={{ opacity: progress(frame, wordFrame(S, 's08-01', 'controles') - 6, 12) }}><Pill tone="cyan" size={28}>controles aplicados</Pill></span>
            <span style={{ opacity: progress(frame, wordFrame(S, 's08-01', 'actividad') - 6, 12) }}><Pill tone="cyan" size={28}>actividad posterior</Pill></span>
            <span style={{ opacity: progress(frame, wordFrame(S, 's08-01', 'recuperación') - 6, 12) }}><Pill tone="cyan" size={28}>recuperación del equipo</Pill></span>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s08-02') - 4} outAt={blocks - 6} x={0} y={CHOICE_Y} w={1728}>
        <Choices frame={frame} at={at('s08-02') - 4} revealAt={reveal} labels={['Correo de confirmación', 'Controles y actividad revisados']} answer={1} />
      </Reveal>

      <Block frame={frame} at={blocks} x={0} icon="check" title="Evidencia" sub="qué verificaste y si las medidas fueron eficaces" tone={C.emerald} />
      <Block frame={frame} at={wordFrame(S, 's08-04', 'dudas') - 14} x={592} icon="alert" title="Límites" sub="qué acceso pudo persistir y qué dudas siguen abiertas" tone={C.amber} />
      <Block frame={frame} at={at('s08-06')} x={1184} icon="eye" title="Vigilancia" sub="criterios de reapertura tras el cierre" tone={C.sky} />
      <Reveal frame={frame} at={at('s08-05') + 20} x={0} y={CHOICE_Y + 180} w={1728}>
        <Note icon="split" tone="muted" size={32} w={1728}>no es una garantía absoluta de ausencia: es lo que verificaste y por qué puedes avanzar</Note>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Verifica los efectos; documenta los límites" />
    </Stage>
  );
}
