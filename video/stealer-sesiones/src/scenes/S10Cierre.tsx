import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { RuleCards } from '../../../engine/src/ui/RuleCards';
import { Icon } from '../../../engine/src/ui/Icon';
import { Note, Pill, Reveal } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's10-cierre';

/**
 * s10-cierre «Cerrar los dos frentes». Three rule cards as the voice gives them (distinguish the evidence /
 * contain device and identities / verify the effects), then the single action — the complementary checkpoint
 * of sp4m10 — a closing reminder for the case of Ana, and the credits: sources by name (no URLs) and the
 * independence disclaimer. No exam badges.
 */
export function S10Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const action = props.cue('s10-c');
  const reminder = at('s10-06');
  const credits = progress(frame, action + 100, 20);

  return (
    <Stage>
      <RuleCards
        width={1728}
        height={250}
        slotAt={at('s10-01') - 20}
        dimFrom={action}
        titleSize={46}
        subSize={30}
        artHeight={0}
        rules={[
          { title: ['Distingue', 'la evidencia'], sub: 'capacidad, exposición y uso', icon: 'search', tone: 'cyan', at: at('s10-01') },
          { title: ['Contén', 'dispositivo e identidad'], sub: 'dos frentes, no uno', icon: 'split', tone: 'sky', at: wordFrame(S, 's10-01', 'Aislar') - 14 },
          { title: ['Verifica', 'los efectos'], sub: 'la acción no es el resultado', icon: 'check', tone: 'emerald', at: at('s10-02') },
        ]}
      />
      <Reveal frame={frame} at={wordFrame(S, 's10-03', 'Primero') - 10} outAt={action - 6} x={0} y={300} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Pill icon="search" tone="cyan" size={36}>acotas el caso</Pill>
          <Icon name="arrowRight" size={40} color={C.muted} style={{ opacity: progress(frame, wordFrame(S, 's10-03', 'Después') - 14, 12) }} />
          <Pill icon="split" tone="sky" size={36} style={{ opacity: progress(frame, wordFrame(S, 's10-03', 'Después') - 14, 12) }}>eliges las acciones</Pill>
          <Icon name="arrowRight" size={40} color={C.muted} style={{ opacity: progress(frame, at('s10-04'), 12) }} />
          <Pill icon="check" tone="emerald" size={36} style={{ opacity: progress(frame, at('s10-04'), 12) }}>compruebas los efectos</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={action} x={0} y={290} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 168, display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.75)}`, background: alpha(C.amberDeep, 0.35), fontFamily: FONT.sans }}>
          <Icon name="flag" size={52} color={C.amber} />
          <div>
            <div style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 4, color: C.amber }}>PRÁCTICA COMPLEMENTARIA</div>
            <div style={{ marginTop: 4, fontSize: 44, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>Respuesta a incidentes · ¿qué evidencias necesitarías para cerrar el caso de Ana?</div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={reminder} x={0} y={480} w={1728}>
        <Note icon="alert" tone="amber" size={32} w={1728}>si solo dice «contraseña cambiada», vuelve a mirar las sesiones y el equipo</Note>
      </Reveal>
      {credits > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 580, width: 1728, opacity: credits, fontFamily: FONT.sans, fontSize: 26, fontWeight: 560, lineHeight: 1.3, color: C.muted }}>
          <div>Fuentes: Microsoft · refresh tokens · revocar acceso de emergencia · Graph, revokeSignInSessions · evaluación continua del acceso</div>
          <div style={{ color: C.faint }}>Alertópolis · material independiente, no afiliado a CompTIA · datos y participantes ficticios</div>
        </div>
      ) : null}
    </Stage>
  );
}
