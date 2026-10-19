import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { Chip } from '../../../engine/src/ui/Chip';
import { Choices, LearningCard, Pill, Reveal, Tag, WHO } from './parts/bits';
import { Stage, audioEnd, segment } from './kit';

const TOP = 190; // the engine's pause card sits in the first 170 px of the stage

function Row({ frame, at, icon, label, state, text }: { frame: number; at: number; icon: IconName; label: string; state: 'ok' | 'ask' | 'none'; text: string }) {
  const p = progress(frame, at, 16);
  const col = state === 'ok' ? C.emerald : state === 'ask' ? C.amber : C.faint;
  return (
    <div style={{ boxSizing: 'border-box', height: 88, display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', borderRadius: RADIUS.md, border: `2px ${state === 'ok' ? 'solid' : 'dashed'} ${alpha(col, 0.8)}`, background: alpha(col, state === 'ok' ? 0.12 : 0.05), opacity: p, transform: `translateX(${(1 - p) * 20}px)`, fontFamily: FONT.sans }}>
      <Icon name={icon} size={40} color={col} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: state === 'none' ? C.muted : C.textStrong }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 600, color: col }}>{text}</div>
      </div>
      {state === 'ask' ? <span style={{ marginLeft: 'auto', fontSize: 54, fontWeight: 850, color: C.amber }}>?</span> : state === 'ok' ? <Icon name="check" size={44} color={C.emerald} strokeWidth={3} style={{ marginLeft: 'auto' }} /> : null}
    </div>
  );
}

/**
 * s08-caso «¿Qué demuestra la alerta?». A synthetic alert on the left. The decision (access to everything /
 * scope still to check) shows no answer colour until the pause ends. At the reveal only the reading zone opens
 * on the right; use, other credentials and renewal stay as questions. The closing warning never reuses the
 * credential on a real account. Then the learning card.
 */
export function S08Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const reveal = props.cue('s08-b');
  const cardAt = audioEnd('s08-caso', 's08-06') + 6;
  const optOut = at('s08-04') + 20;

  return (
    <Stage>
      <Reveal frame={frame} at={at('s08-01') - 6} x={0} y={TOP} w={840}>
        <div style={{ boxSizing: 'border-box', width: 840, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.amber, 0.7)}`, background: C.ink900, overflow: 'hidden', fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 64, padding: '0 24px', background: alpha(C.amber, 0.1), borderBottom: `2px solid ${C.ink700}` }}>
            <Icon name="bell" size={34} color={C.amber} />
            <span style={{ fontSize: 30, fontWeight: 800, color: '#fcd34d' }}>Alerta sintética</span>
            <span style={{ marginLeft: 'auto' }}><Chip accent="amber" size={24}>MEDIA</Chip></span>
          </div>
          <div style={{ padding: '22px 26px 26px', display: 'grid', gap: 16 }}>
            <div style={{ fontSize: 38, fontWeight: 750, lineHeight: 1.2, color: C.textStrong }}>posible exposición de un access token de Graph con lectura delegada</div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Tag tone={WHO.graph} size={28}>Graph</Tag>
              <Tag tone="sky" size={28}>lectura delegada</Tag>
              <Pill tone="muted" size={26} dim={0.1}>sin token de renovación</Pill>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal frame={frame} at={at('s08-02') - 4} outAt={optOut} x={0} y={TOP + 300} w={1728}>
        <Choices frame={frame} at={at('s08-02') - 4} revealAt={reveal} labels={['Acceso a todo', 'Alcance por comprobar']} answer={1} />
      </Reveal>

      {/* the scope that opens after the pause */}
      <div style={{ position: 'absolute', left: 900, top: TOP - 20, width: 828, display: 'grid', gap: 14 }}>
        <Row frame={frame} at={reveal + 6} icon="eye" label="Lectura delegada" state="ok" text="dentro de permisos y vigencia" />
        <Row frame={frame} at={reveal + 30} icon="search" label="¿Lo aceptó el recurso?" state="ask" text="falta investigar" />
        <Row frame={frame} at={at('s08-04')} icon="key" label="¿Otras credenciales?" state="ask" text="la ficha no lo dice" />
        <Row frame={frame} at={props.cue('s08-c')} icon="plug" label="¿Token de renovación?" state="ask" text="si apareciera, otra pregunta" />
      </div>

      <Reveal frame={frame} at={props.cue('s08-c') + 36} x={0} y={TOP + 290} w={840}>
        <Pill icon="split" tone="muted" size={30}>no asumirías acceso infinito</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s08-06')} x={0} y={TOP + 400} w={1728}>
        <Pill icon="x" tone="rose" size={32}>no reutilices la credencial robada en una cuenta real</Pill>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Exposición no demuestra uso ni acceso permanente" />
    </Stage>
  );
}
