import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { InfoCard, Pill, Reveal, WHO } from './parts/bits';
import { Stage, segment } from './kit';

/**
 * s01-hook «La contraseña no cuenta toda la historia». Headline at the `title` cue (before 12 s). Ana changes her
 * password while Resumen del turno keeps showing mail (skeleton rows, no real data, no token strings). Halden
 * context pills, then the two separate questions: who enters / what may the application do.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const title = props.cue('title');
  const ctx = props.cue('s01-b');
  const two = props.cue('s01-c');
  const s05 = at('s01-05');

  const changed = progress(frame, at('s01-01') + 70, 14);
  const qDim = progress(frame, two - 4, 20, EASE.inOut);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, opacity: progress(frame, title, 18), transform: `translateY(${(1 - progress(frame, title, 18)) * 18}px)`, fontFamily: FONT.sans, fontSize: 66, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        La contraseña <span style={{ color: C.cyan }}>no cuenta toda la historia</span>
      </div>

      {/* Ana and the application */}
      <div style={{ position: 'absolute', left: 0, top: 130, opacity: 1 - 0.5 * qDim }}>
        <Reveal frame={frame} at={at('s01-01') + 10} x={0} y={0}>
          <InfoCard icon="user" title="Ana" sub="usuaria" tone={WHO.ana} w={420} h={120} />
        </Reveal>
        <Reveal frame={frame} at={at('s01-01') + 52} x={0} y={140}>
          <Pill icon="lock" tone="emerald" size={32}>contraseña cambiada</Pill>
        </Reveal>
        {changed > 0 ? (
          <div style={{ position: 'absolute', left: 420, top: 56, width: 170, opacity: changed }}>
            <svg width={170} height={30}>
              <line x1={10} y1={15} x2={140 * changed} y2={15} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" strokeDasharray="12 10" />
              {changed > 0.9 ? <polygon points="160,15 138,4 138,26" fill={C.cyan} /> : null}
            </svg>
          </div>
        ) : null}
        <Reveal frame={frame} at={at('s01-01') + 90} x={600} y={0}>
          <div style={{ boxSizing: 'border-box', width: 540, borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${alpha(WHO.app, 0.6)}`, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', background: alpha(C.ink800, 0.9), borderBottom: `2px solid ${C.ink700}` }}>
              <Icon name="app" size={34} color={WHO.app} />
              <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>Resumen del turno</span>
              <span style={{ marginLeft: 'auto' }}>
                <Pill tone="amber" size={26} icon="clock">sesión abierta</Pill>
              </span>
            </div>
            <div style={{ padding: '18px 22px 22px', display: 'grid', gap: 14 }}>
              {[0.92, 0.7, 0.82].map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: progress(frame, at('s01-01') + 110 + i * 6, 12) }}>
                  <Icon name="mail" size={34} color={C.muted} />
                  <div style={{ height: 16, width: `${w * 100}%`, borderRadius: 8, background: C.ink600 }} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Halden context */}
      <Reveal frame={frame} at={ctx} x={1190} y={130}>
        <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
          <Pill icon="flag" tone="sky" size={30}>Halden · autoridad portuaria</Pill>
          <Pill icon="archive" tone="muted" size={30}>ejercicio de formación</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s01-03')} x={1190} y={256}>
        <Pill icon="eyeOff" tone="emerald" size={30}>ninguna cuenta real</Pill>
      </Reveal>

      {/* the two separate questions */}
      <Reveal frame={frame} at={two} x={0} y={440} w={820}>
        <InfoCard icon="user" title="¿Quién entra?" sub="comprueba que es Ana" tone={WHO.ana} w={820} h={150} titleSize={46} subSize={32} lit={progress(frame, two, 14) * (1 - progress(frame, s05, 14))} />
      </Reveal>
      <Reveal frame={frame} at={s05} x={908} y={440} w={820}>
        <InfoCard icon="key" title="¿Qué puede hacer la aplicación?" sub="limita lo que hace en nombre de Ana" tone={WHO.app} w={820} h={150} titleSize={44} subSize={32} lit={progress(frame, s05, 14)} />
      </Reveal>
      <Reveal frame={frame} at={s05 + 24} x={0} y={604}>
        <Pill tone="muted" size={30}>dos decisiones distintas, aunque aparezcan seguidas</Pill>
      </Reveal>
    </Stage>
  );
}
