import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { RuleCards } from '../../../engine/src/ui/RuleCards';
import { Icon } from '../../../engine/src/ui/Icon';
import { Pill, Reveal, WHO } from './parts/bits';
import { Stage, segment } from './kit';

/**
 * s10-cierre «Tres comprobaciones y una decisión». Three rule cards (identify the artefact / bound the
 * permission / look for evidence of use), then the single action — the lesson's complementary checkpoint — and
 * the four columns as a closing strip. Credits and the CompTIA disclaimer; no exam badges.
 */
export function S10Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const action = props.cue('s10-c');
  const strip = at('s10-06');
  const credits = progress(frame, action + 90, 20);

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
          { title: ['Identifica', 'la credencial'], sub: 'contraseña, cookie o token', icon: 'search', tone: 'cyan', at: at('s10-01') },
          { title: ['Acota', 'el permiso'], sub: 'para quién y qué permite', icon: 'key', tone: 'sky', at: at('s10-02') },
          { title: ['Busca', 'evidencia de uso'], sub: 'posible no es probado', icon: 'eye', tone: 'emerald', at: props.cue('s10-b') },
        ]}
      />
      <Reveal frame={frame} at={action} x={0} y={366} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 176, display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.75)}`, background: alpha(C.amberDeep, 0.35), fontFamily: FONT.sans }}>
          <Icon name="flag" size={52} color={C.amber} />
          <div>
            <div style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 4, color: C.amber }}>PRÁCTICA COMPLEMENTARIA</div>
            <div style={{ marginTop: 4, fontSize: 46, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>Identidad en la lección · ¿qué puedes afirmar sobre el acceso al correo de Ana?</div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={strip} x={0} y={566} w={1728}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[
            ['user', 'Ana', WHO.ana],
            ['app', 'Resumen del turno', WHO.app],
            ['shield', 'Entra ID', WHO.idp],
            ['mail', 'Graph', WHO.graph],
          ].map(([icon, label, color]) => (
            <Pill key={label} icon={icon as 'user'} tone={color as string} size={32}>{label}</Pill>
          ))}
        </div>
      </Reveal>
      {credits > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 628, width: 1728, opacity: credits, fontFamily: FONT.sans, fontSize: TYPE.micro + 2, fontWeight: 560, color: C.faint }}>
          Alertópolis · material independiente, no afiliado a CompTIA · datos y participantes ficticios
        </div>
      ) : null}
    </Stage>
  );
}
