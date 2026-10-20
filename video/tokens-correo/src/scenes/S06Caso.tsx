import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../engine/src/ui/tone';
import { LearningCard, Pill, Reveal, Tag, WHO } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's06-caso';

function Field({ frame, at, icon, label, tone, children }: { frame: number; at: number; icon: IconName; label: string; tone: Tone; children: React.ReactNode }) {
  const p = progress(frame, at, 16);
  const t = toneOf(tone);
  return (
    <div style={{ boxSizing: 'border-box', height: 92, display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px', borderBottom: `2px solid ${C.ink700}`, opacity: p, transform: `translateX(${(1 - p) * -18}px)`, fontFamily: FONT.sans }}>
      <Icon name={icon} size={40} color={t.fg} />
      <span style={{ width: 300, fontSize: 26, fontWeight: 700, letterSpacing: 1, color: C.faint, textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 42, fontWeight: 800, color: C.textStrong }}>{children}</span>
    </div>
  );
}

function Action({ frame, at, label, icon, enabled, noteAt }: { frame: number; at: number; label: string; icon: IconName; enabled: boolean; noteAt?: number }) {
  const p = progress(frame, at, 14);
  const n = noteAt === undefined ? 0 : progress(frame, noteAt, 12);
  const col = enabled ? C.emerald : C.faint;
  return (
    <div style={{ boxSizing: 'border-box', height: 96, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px', borderRadius: RADIUS.md, border: `2px solid ${alpha(col, enabled ? 0.9 : 0.6)}`, background: enabled ? alpha(C.emerald, 0.14) : alpha(C.ink700, 0.5), opacity: p, fontFamily: FONT.sans }}>
      <Icon name={icon} size={42} color={enabled ? C.emerald : C.faint} />
      <span style={{ fontSize: 36, fontWeight: 800, color: enabled ? '#a7f3d0' : C.faint, whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: 28, fontWeight: 700, color: enabled ? C.emerald : C.muted, opacity: enabled ? 1 : 0.5 + 0.5 * n }}>{enabled ? 'permitido' : 'bloqueado'}</span>
    </div>
  );
}

/**
 * s06-caso «Un permiso con bordes». A conceptual card — issuer, recipient, delegated permission, validity —
 * with no token data. Beside it the actions that permission allows: read is enabled, send and administer stay
 * disabled. The clock stands for expiry without fixing an hour. Then the learning card.
 */
export function S06Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const fAt = [w('s06-01', 'emite') - 12, w('s06-01', 'recurso') - 12, w('s06-01', 'permite') - 12, w('s06-01', 'válido') - 12];
  const vig = props.cue('s06-c');
  const tick = pulse(frame, 30, 0.5);
  const cardAt = audioEnd(S, 's06-06') + 6;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 900, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.sky, 0.55)}`, background: C.ink900, overflow: 'hidden' }}>
        <div style={{ boxSizing: 'border-box', height: 70, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', background: alpha(C.sky, 0.1), borderBottom: `2px solid ${C.ink700}`, fontFamily: FONT.sans }}>
          <Icon name="key" size={36} color={C.sky} />
          <span style={{ fontSize: 34, fontWeight: 800, color: '#7dd3fc' }}>Ficha del pase (conceptual)</span>
        </div>
        <Field frame={frame} at={fAt[0]} icon="shield" label="Emisor" tone={WHO.idp}>Entra ID</Field>
        <Field frame={frame} at={fAt[1]} icon="mail" label="Destinatario" tone={WHO.graph}>Microsoft Graph</Field>
        <Field frame={frame} at={fAt[2]} icon="eye" label="Permiso delegado" tone="sky"><Tag tone="sky" size={38}>Mail.Read</Tag></Field>
        <div style={{ position: 'relative' }}>
          <Field frame={frame} at={fAt[3]} icon="clock" label="Vigencia" tone="amber">
            <span style={{ fontSize: 34, fontWeight: 750, color: '#fcd34d' }}>según emisión y política</span>
          </Field>
        </div>
      </div>

      {/* the clock: expiry without a universal hour */}
      <Reveal frame={frame} at={vig} x={930} y={0} w={150}>
        <svg width={150} height={150} viewBox="0 0 150 150">
          <circle cx={75} cy={75} r={62} fill={alpha(C.amber, 0.08)} stroke={alpha(C.amber, 0.8)} strokeWidth={6} strokeDasharray="10 12" />
          <line x1={75} y1={75} x2={75} y2={34} stroke="#fcd34d" strokeWidth={6} strokeLinecap="round" />
          <line x1={75} y1={75} x2={75 + 28 * Math.sin(frame / 40)} y2={75 - 28 * Math.cos(frame / 40)} stroke="#fcd34d" strokeWidth={6} strokeLinecap="round" opacity={0.6 + 0.4 * tick} />
          <circle cx={75} cy={75} r={7} fill="#fcd34d" />
        </svg>
      </Reveal>

      {/* what that permission allows */}
      <div style={{ position: 'absolute', left: 1110, top: 0, width: 618, display: 'grid', gap: 18 }}>
        <Action frame={frame} at={at('s06-03')} icon="eye" label="Leer correo" enabled />
        <Action frame={frame} at={at('s06-03') + 60} icon="mail" label="Enviar mensajes" enabled={false} noteAt={at('s06-03') + 70} />
        <Action frame={frame} at={at('s06-03') + 100} icon="gear" label="Administrar" enabled={false} noteAt={at('s06-03') + 110} />
      </div>

      <Reveal frame={frame} at={at('s06-02')} x={0} y={456} w={900}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Pill icon="mail" tone={WHO.graph} size={30}>Graph</Pill>
          <Pill icon="x" tone="muted" size={30} dim={0.2}>otra interfaz</Pill>
          <Pill icon="x" tone="muted" size={30} dim={0.2}>otra interfaz</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s06-04')} x={1110} y={340} w={618}>
        <Pill icon="shield" tone={WHO.graph} size={28}>el recurso decide cada petición</Pill>
      </Reveal>

      <Reveal frame={frame} at={vig + 30} x={0} y={540} w={1728}>
        <Pill icon="clock" tone="amber" size={34}>caduca → la aplicación necesita otro token</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s06-06')} x={0} y={602} w={1728}>
        <div style={{ display: 'flex', gap: 22 }}>
          <Pill icon="play" tone="emerald" size={30}>sin interacción</Pill>
          <Pill icon="user" tone="cyan" size={30}>o Ana vuelve a identificarse</Pill>
        </div>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Destinatario, permisos y vigencia acotan el acceso" />
    </Stage>
  );
}
