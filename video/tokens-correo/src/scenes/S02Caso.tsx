import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { InfoCard, LearningCard, Pill, Reveal, WHO } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's02-caso';

/** A room of the mailbox: open (pass fits) or closed (padlock). */
function Door({ frame, at, openAt, label, sub, shut }: { frame: number; at: number; openAt?: number; label: string; sub: string; shut: boolean }) {
  const o = openAt === undefined ? 0 : progress(frame, openAt, 16);
  const col = shut ? C.faint : C.emerald;
  const c = shut ? C.rose : C.emerald;
  return (
    <Reveal frame={frame} at={at} x={0} y={0} w={728}>
      <div style={{ boxSizing: 'border-box', width: 728, height: 100, display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', borderRadius: RADIUS.md, border: `2px solid ${alpha(shut ? C.ink600 : c, shut ? 1 : 0.5 + 0.4 * o)}`, background: shut ? C.ink850 : alpha(C.emerald, 0.06 + 0.1 * o), boxShadow: !shut && o > 0 ? `0 0 ${20 + 24 * o}px ${alpha(C.emerald, 0.3 * o)}` : 'none', fontFamily: FONT.sans }}>
        <Icon name={shut ? 'lock' : 'unlock'} size={46} color={shut ? C.roseSoft : C.emerald} />
        <div>
          <div style={{ fontSize: 38, fontWeight: 800, color: shut ? C.muted : C.textStrong }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 560, color: col }}>{sub}</div>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * s02-caso «Entrar y tener permiso». Two definitions in order (authenticate, authorise), Ana proving who she is
 * to the identity service, and three rooms of the mailbox: only the one the read pass fits opens. The pass
 * analogy ends where the service applies technical controls. OAuth closes the scene; then the learning card.
 */
export function S02Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const authn = wordFrame(S, 's02-01', 'autenticando') - 18;
  const authz = wordFrame(S, 's02-01', 'autorizando') - 18;
  const identified = progress(frame, at('s02-02') + 20, 14);
  const pass = props.cue('s02-b');
  const oauth = props.cue('s02-c');
  const limits = at('s02-06');
  const cardAt = audioEnd(S, 's02-06') + 6;

  return (
    <Stage>
      <Reveal frame={frame} at={authn} x={0} y={0}>
        <InfoCard icon="user" title="AUTENTICAR" sub="comprueba quién eres" tone={WHO.ana} w={840} h={120} titleSize={44} lit={progress(frame, authn, 12) * (1 - progress(frame, authz, 14))} />
      </Reveal>
      <Reveal frame={frame} at={authz} x={888} y={0}>
        <InfoCard icon="key" title="AUTORIZAR" sub="decide qué puedes hacer" tone={WHO.idp} w={840} h={120} titleSize={44} lit={progress(frame, authz, 12)} />
      </Reveal>

      {/* Ana → identity service */}
      <Reveal frame={frame} at={at('s02-02') - 20} x={0} y={250}>
        <InfoCard icon="user" title="Ana" sub="usuaria" tone={WHO.ana} w={280} h={110} />
      </Reveal>
      <Reveal frame={frame} at={at('s02-02')} x={380} y={236}>
        <InfoCard icon="shield" title="Servicio de identidad" sub="aplica controles técnicos" tone={WHO.idp} w={580} h={138} titleSize={36} lit={identified} />
      </Reveal>
      {frame >= at('s02-02') ? (
        <svg width={100} height={40} style={{ position: 'absolute', left: 280, top: 285, opacity: progress(frame, at('s02-02'), 12) }}>
          <line x1={8} y1={20} x2={80 * progress(frame, at('s02-02'), 16)} y2={20} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
          <polygon points="94,20 74,9 74,31" fill={C.cyan} opacity={progress(frame, at('s02-02') + 10, 8)} />
        </svg>
      ) : null}
      <Reveal frame={frame} at={at('s02-02') + 24} x={380} y={392}>
        <Pill icon="check" tone="emerald" size={32}>identidad comprobada</Pill>
      </Reveal>

      {/* three rooms */}
      <div style={{ position: 'absolute', left: 1000, top: 160, display: 'grid', gap: 22 }}>
        <div style={{ position: 'relative', height: 100 }}><Door frame={frame} at={pass - 10} openAt={pass + 8} label="Leer correo" sub="el pase de lectura encaja" shut={false} /></div>
        <div style={{ position: 'relative', height: 100 }}><Door frame={frame} at={at('s02-02') + 30} label="Administrar el correo del puerto" sub="sin autorización" shut /></div>
        <div style={{ position: 'relative', height: 100 }}><Door frame={frame} at={at('s02-04') + 6} label="Enviar mensajes" sub="leer no implica enviar" shut /></div>
      </div>
      <Reveal frame={frame} at={pass} x={520} y={150}>
        <Pill icon="key" tone="sky" size={30}>pase de una sola sala</Pill>
      </Reveal>

      {/* OAuth */}
      <Reveal frame={frame} at={oauth} x={0} y={500} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: FONT.sans }}>
          <span style={{ padding: '8px 26px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.sky, 0.8)}`, background: alpha(C.sky, 0.12), fontSize: 44, fontWeight: 850, color: '#7dd3fc' }}>OAuth</span>
          <span style={{ fontSize: 40, fontWeight: 700, color: C.text }}>acceso limitado para la aplicación, sin darle la contraseña de Ana</span>
        </div>
      </Reveal>
      <Reveal frame={frame} at={oauth + 70} x={0} y={576}>
        <Pill icon="split" tone="muted" size={32}>la aplicación no es Ana</Pill>
      </Reveal>
      <Reveal frame={frame} at={limits} x={540} y={576}>
        <Pill icon="shield" tone="emerald" size={32}>actúa dentro de una concesión que el sistema limita</Pill>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Autenticar identifica; autorizar limita acciones" />
    </Stage>
  );
}
