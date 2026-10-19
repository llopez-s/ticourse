import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../engine/src/ui/tone';
import { Note, Pill, Reveal, Tag } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-caso';
const TOP = 180; // the engine's intercepted-message card owns the first 170 px of the stage

/** A line of the conceptual panel: what should happen, and whether it has been verified. */
function Effect({ frame, at, icon, label, state, tone }: { frame: number; at: number; icon: IconName; label: string; state: string; tone: Tone }) {
  const t = toneOf(tone);
  const p = progress(frame, at, 16);
  return (
    <div style={{ boxSizing: 'border-box', height: 72, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${alpha(t.fg, 0.5)}`, opacity: p, transform: `translateX(${(1 - p) * 18}px)`, fontFamily: FONT.sans }}>
      <Icon name={icon} size={38} color={t.fg} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 31, fontWeight: 700, lineHeight: 1.12, color: C.text }}>{label}</span>
      <span style={{ marginLeft: 'auto', flexShrink: 0, padding: '4px 14px', borderRadius: RADIUS.pill, border: `2px dashed ${alpha(t.fg, 0.8)}`, fontSize: 26, fontWeight: 700, color: t.soft }}>{state}</span>
    </div>
  );
}

/**
 * s07-caso «El botón no es el resultado». Below the intercepted-message band: a conceptual Microsoft panel
 * (no real interface, nothing clickable) with the API name on screen only and one status, «revocación
 * solicitada»; under it each expected effect waits as «por verificar», and the application's own sessions are
 * flagged. On the right CAE appears with its qualifier «recursos, clientes y eventos compatibles», what it does
 * not mean, and the password-change variables. The close replaces any fixed wait with «registra y comprueba».
 */
export function S07Boton(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const panel = at('s07-01') - 6;
  const cae = props.cue('s07-b');
  const pw = props.cue('s07-c');
  const close = wordFrame(S, 's07-06', 'sustituyas') - 12;

  return (
    <Stage>
      {/* conceptual panel */}
      <Reveal frame={frame} at={panel} x={0} y={TOP} w={860}>
        <div style={{ boxSizing: 'border-box', width: 860, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.sky, 0.6)}`, background: C.ink900, overflow: 'hidden', fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 56, padding: '0 22px', background: alpha(C.sky, 0.1), borderBottom: `2px solid ${C.ink700}` }}>
            <Icon name="shield" size={36} color={C.sky} />
            <span style={{ fontSize: 30, fontWeight: 800, color: C.textStrong }}>Microsoft Entra ID · concepto</span>
          </div>
          <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <Tag tone="sky" size={28}>revokeSignInSessions</Tag>
            <Pill icon="check" tone="sky" size={28}>revocación solicitada</Pill>
          </div>
        </div>
      </Reveal>
      <div style={{ position: 'absolute', left: 0, top: TOP + 142, width: 860, display: 'grid', gap: 8 }}>
        <Effect frame={frame} at={wordFrame(S, 's07-01', 'renovación') - 14} icon="plug" label="Tokens de renovación" state="por verificar" tone="cyan" />
        <Effect frame={frame} at={wordFrame(S, 's07-01', 'cookies') - 14} icon="globe" label="Cookies gestionadas por el servicio" state="por verificar" tone="cyan" />
        <Effect frame={frame} at={wordFrame(S, 's07-02', 'sesiones') - 14} icon="app" label="Sesiones propias de la aplicación" state="atención específica" tone="amber" />
      </div>
      <Reveal frame={frame} at={wordFrame(S, 's07-02', 'retraso') - 10} outAt={cae - 12} x={920} y={TOP + 10} w={808}>
        <Pill icon="clock" tone="amber" size={30}>puede haber un retraso</Pill>
      </Reveal>

      {/* CAE */}
      <Reveal frame={frame} at={cae - 8} x={920} y={TOP} w={808}>
        <div style={{ boxSizing: 'border-box', width: 808, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.6)}`, background: C.ink900, padding: '16px 24px 20px', fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="radar" size={42} color={C.cyan} />
            <span style={{ fontSize: 38, fontWeight: 850, color: C.textStrong }}>Evaluación continua del acceso</span>
            <Tag tone="cyan" size={28}>CAE</Tag>
          </div>
          <div style={{ marginTop: 12, fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: C.cyanSoft }}>recursos, clientes y eventos compatibles</div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s07-04')} x={920} y={TOP + 136} w={808}>
        <div style={{ display: 'grid', gap: 10 }}>
          <Note icon="x" tone="amber" size={29} w={808}>no toda aplicación reacciona a cualquier evento</Note>
          <Note icon="x" tone="amber" size={29} w={808}>no todo el acceso se corta al instante</Note>
        </div>
      </Reveal>
      <Reveal frame={frame} at={pw} x={920} y={TOP + 272} w={808}>
        <div style={{ boxSizing: 'border-box', width: 808, borderRadius: RADIUS.md, border: `2px solid ${alpha(C.faint, 0.6)}`, background: C.ink850, padding: '12px 22px 16px', fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 31, fontWeight: 800, color: C.textStrong }}>
            <Icon name="lock" size={32} color={C.muted} />
            Cambiar la contraseña: el efecto varía según
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 12 }}>
            <Tag tone="muted" size={27}>tipo de credencial</Tag>
            <Tag tone="muted" size={27}>cómo se hizo el cambio</Tag>
          </div>
        </div>
      </Reveal>

      {/* what to do instead of waiting */}
      <Reveal frame={frame} at={close} x={0} y={594} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="clock" tone="rose" size={30} strike>espera fija</Pill>
          <Icon name="arrowRight" size={40} color={C.muted} />
          <Pill icon="record" tone="cyan" size={30}>registra la acción</Pill>
          <Pill icon="check" tone="emerald" size={30} style={{ opacity: progress(frame, wordFrame(S, 's07-06', 'comprueba') - 8, 12) }}>comprueba los efectos de este escenario</Pill>
        </div>
      </Reveal>
    </Stage>
  );
}
