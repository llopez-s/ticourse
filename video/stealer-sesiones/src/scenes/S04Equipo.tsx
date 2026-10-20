import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { Choices, InfoCard, LearningCard, Note, Pill, Reveal } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's04-caso';
const TOP = 180; // the engine's pause card sits in the first 170 px of the stage
const FRONT_Y = 352;
const MID_Y = 456;

function Front({ frame, at, y, n, icon, title, tone, children }: { frame: number; at: number; y: number; n: number; icon: IconName; title: string; tone: string; children: ReactNode }) {
  return (
    <Reveal frame={frame} at={at} x={n === 1 ? 0 : 908} y={y} w={820}>
      <div style={{ boxSizing: 'border-box', width: 820, height: 188, padding: '16px 24px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(tone, 0.75)}`, background: alpha(tone, 0.07), fontFamily: FONT.sans }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name={icon} size={46} color={tone} />
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3, color: tone }}>FRENTE {n}</span>
        </div>
        <div style={{ marginTop: 4, fontSize: 44, fontWeight: 850, color: C.textStrong }}>{title}</div>
        <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>{children}</div>
      </div>
    </Reveal>
  );
}

/**
 * s04-caso «El equipo continúa comprometido». Below the engine's pause band: the affected computer and the
 * trusted device, apart. The two options show without answer colour until s04-b; at the reveal the trusted
 * environment lights and the affected one is marked as able to capture the new secrets. Coordination,
 * authorised isolation and evidence preservation come in as the voice says them. s04-c: two fronts (device /
 * identities), with the exposed session living outside the computer. Learning card.
 */
export function S04Equipo(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const reveal = props.cue('s04-b');
  const harm = wordFrame(S, 's04-04', 'preservar') - 8;
  const fronts = at('s04-05') - 8;
  const cardAt = audioEnd(S, 's04-06') + 6;
  const lit = progress(frame, reveal, 16);
  const frontsP = progress(frame, fronts, 16);

  return (
    <Stage>
      <div style={{ opacity: 1 - 0.5 * frontsP }}>
        <Reveal frame={frame} at={at('s04-01') + 6} x={0} y={TOP} w={820}>
          <InfoCard icon="laptop" title="Equipo afectado" sub="el programa puede seguir activo" tone="rose" w={820} h={136} titleSize={42} subSize={30} />
        </Reveal>
        <Reveal frame={frame} at={wordFrame(S, 's04-01', 'confiable') - 18} x={908} y={TOP} w={820}>
          <InfoCard icon="desktop" title="Dispositivo confiable" sub="entorno preparado aparte" tone="emerald" w={820} h={136} titleSize={42} subSize={30} lit={lit} />
        </Reveal>
        <Reveal frame={frame} at={at('s04-01') + 6} x={820} y={TOP + 44} w={88}>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <Icon name="split" size={52} color={C.faint} />
          </div>
        </Reveal>
        <Reveal frame={frame} at={reveal + 20} outAt={fronts - 6} x={0} y={TOP + 152} w={820}>
          <Note icon="alert" tone="amber" size={28} w={820}>si sigue comprometido, podría capturar los secretos nuevos</Note>
        </Reveal>
        <Reveal frame={frame} at={reveal + 6} outAt={fronts - 6} x={908} y={TOP + 152} w={820}>
          <Pill icon="key" tone="emerald" size={30}>aquí se cambian los secretos</Pill>
        </Reveal>
      </div>

      <Reveal frame={frame} at={wordFrame(S, 's04-01', 'harías') - 20} outAt={at('s04-04') - 8} x={0} y={MID_Y} w={1728}>
        <Choices frame={frame} at={wordFrame(S, 's04-01', 'harías') - 20} revealAt={reveal} labels={['Sí, es más rápido', 'No, usar un entorno confiable']} answer={1} />
      </Reveal>

      {/* what contention is made of */}
      <Reveal frame={frame} at={wordFrame(S, 's04-03', 'coordinas') - 10} outAt={fronts} x={0} y={MID_Y + 116} w={1728}>
        <div style={{ display: 'flex', gap: 18 }}>
          <Pill icon="users" tone="sky" size={32}>coordinación</Pill>
          <Pill icon="power" tone="rose" size={32} style={{ opacity: progress(frame, harm + 30, 12) }}>aislamiento autorizado</Pill>
          <Pill icon="archive" tone="cyan" size={32} style={{ opacity: progress(frame, harm, 12) }}>preservar evidencias</Pill>
        </div>
      </Reveal>

      {/* two fronts */}
      <Front frame={frame} at={fronts} y={FRONT_Y} n={1} icon="laptop" title="El dispositivo" tone={C.rose}>
        <Pill icon="power" tone="rose" size={28}>aislar</Pill>
        <Pill icon="archive" tone="cyan" size={28}>preservar</Pill>
      </Front>
      <Front frame={frame} at={wordFrame(S, 's04-05', 'identidades') - 16} y={FRONT_Y} n={2} icon="users" title="Las identidades" tone={C.emerald}>
        <Pill icon="user" tone="emerald" size={28} style={{ opacity: progress(frame, wordFrame(S, 's04-06', 'cuentas') - 8, 12) }}>cuentas</Pill>
        <Pill icon="app" tone="sky" size={28} style={{ opacity: progress(frame, wordFrame(S, 's04-06', 'aplicaciones') - 8, 12) }}>aplicaciones</Pill>
        <Pill icon="mail" tone="amber" size={28} style={{ opacity: progress(frame, wordFrame(S, 's04-06', 'recursos') - 8, 12) }}>recursos</Pill>
      </Front>
      <Reveal frame={frame} at={wordFrame(S, 's04-05', 'fuera') - 10} x={0} y={566} w={1728}>
        <Note icon="unplug" tone="amber" size={32} w={1728}>una sesión ya expuesta puede existir fuera del equipo</Note>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Contener el equipo y proteger la identidad son dos tareas" />
    </Stage>
  );
}
