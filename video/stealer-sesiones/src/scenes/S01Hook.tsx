import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { Chip } from '../../../engine/src/ui/Chip';
import { Pill, Reveal } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-hook';

function FileRow({ frame, at, icon, label, tone }: { frame: number; at: number; icon: IconName; label: string; tone: string }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 52, opacity: p, transform: `translateX(${(1 - p) * 18}px)`, fontFamily: FONT.sans }}>
      <Icon name={icon} size={34} color={tone} />
      <span style={{ fontSize: 32, fontWeight: 700, color: C.text }}>{label}</span>
    </div>
  );
}

/**
 * s01-hook «La casilla verde». Headline at the `title` cue (before 12 s) with the promise under it. The team file
 * opens with one green box, «contraseña cambiada»; the fictional alert (an infostealer) and the Halden context
 * come with s01-b. At s01-c the file lists what it describes (Ana's computer, browser data, mail account) and
 * two open questions (what left, was it used); the last sentence separates them.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const title = props.cue('title');
  const ctx = props.cue('s01-b');
  const desc = props.cue('s01-c');
  const check = wordFrame(S, 's01-01', 'cambiada') - 10;
  const promise = wordFrame(S, 's01-01', 'comprobar') - 8;
  const unknown = wordFrame(S, 's01-04', 'sabemos') - 8;
  const sep = at('s01-05');
  const boxP = progress(frame, check + 10, 12, EASE.out);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, opacity: progress(frame, title, 18), transform: `translateY(${(1 - progress(frame, title, 18)) * 18}px)`, fontFamily: FONT.sans, fontSize: 70, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        Cambiar la contraseña <span style={{ color: C.cyan }}>no cierra todo</span>
      </div>
      <Reveal frame={frame} at={promise} x={0} y={96} w={1728}>
        <div style={{ display: 'flex', gap: 18 }}>
          <Pill icon="search" tone="cyan" size={32}>qué pudo robarse</Pill>
          <Pill icon="eye" tone="cyan" size={32}>qué se usó</Pill>
          <Pill icon="unplug" tone="emerald" size={32}>qué corta el acceso</Pill>
        </div>
      </Reveal>

      {/* the team file */}
      <Reveal frame={frame} at={check - 20} x={0} y={188} w={820}>
        <div style={{ boxSizing: 'border-box', width: 820, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.5)}`, background: C.ink900, overflow: 'hidden', fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 66, padding: '0 24px', background: alpha(C.cyan, 0.08), borderBottom: `2px solid ${C.ink700}` }}>
            <Icon name="file" size={36} color={C.cyan} />
            <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>Ficha del equipo</span>
            <span style={{ marginLeft: 'auto' }}>
              <Chip accent="amber" size={26} icon="clock">abierta</Chip>
            </span>
          </div>
          <div style={{ padding: '14px 24px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 68, opacity: progress(frame, check, 14) }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.2 * boxP), border: `3px solid ${alpha(C.emerald, 0.9)}` }}>
                <Icon name="check" size={32} color={C.emerald} strokeWidth={3.4} style={{ opacity: boxP }} />
              </div>
              <span style={{ fontSize: 40, fontWeight: 800, color: '#6ee7b7' }}>contraseña cambiada</span>
            </div>
            <FileRow frame={frame} at={desc + 4} icon="laptop" label="equipo de Ana" tone={C.cyan} />
            <FileRow frame={frame} at={wordFrame(S, 's01-04', 'navegador') - 10} icon="globe" label="datos de su navegador" tone={C.cyan} />
            <FileRow frame={frame} at={wordFrame(S, 's01-04', 'correo') - 10} icon="mail" label="cuenta de correo" tone={C.cyan} />
          </div>
        </div>
      </Reveal>

      {/* the alert and the setting */}
      <Reveal frame={frame} at={at('s01-02') + 20} x={900} y={188} w={828}>
        <div style={{ boxSizing: 'border-box', width: 828, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.amber, 0.7)}`, background: C.ink900, overflow: 'hidden', fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 66, padding: '0 24px', background: alpha(C.amber, 0.1), borderBottom: `2px solid ${C.ink700}` }}>
            <Icon name="bell" size={36} color={C.amber} />
            <span style={{ fontSize: 34, fontWeight: 800, color: '#fcd34d' }}>Alerta ficticia</span>
          </div>
          <div style={{ padding: '18px 24px 22px' }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: C.textStrong }}>infostealer</div>
            <div style={{ marginTop: 6, fontSize: 32, fontWeight: 600, lineHeight: 1.2, color: C.text }}>malware que roba información del equipo</div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={ctx} x={900} y={412} w={828}>
        <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <Pill icon="flag" tone="sky" size={30}>Halden · autoridad portuaria</Pill>
          <Pill icon="archive" tone="muted" size={30}>ejercicio de respuesta</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s01-03')} x={900} y={546} w={828}>
        <Pill icon="split" tone="muted" size={30}>capacidades distintas según familia y versión</Pill>
      </Reveal>

      {/* what is not known */}
      <Reveal frame={frame} at={unknown} x={0} y={524} w={820}>
        <div style={{ display: 'flex', gap: 18 }}>
          <Pill icon="search" tone="amber" size={34}>¿qué salió?</Pill>
          <Pill icon="eye" tone="amber" size={34}>¿alguien lo usó?</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={sep} x={0} y={604} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: FONT.sans }}>
          <Icon name="split" size={46} color={C.cyan} />
          <span style={{ fontSize: 44, fontWeight: 800, color: C.textStrong }}>Separa las preguntas para decidir <span style={{ color: C.cyan }}>cómo contener el riesgo</span></span>
        </div>
      </Reveal>
    </Stage>
  );
}
