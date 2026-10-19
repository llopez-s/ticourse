import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { LearningCard, Pill, Reveal } from './parts/bits';
import { Board, colC, colX, type Msg } from './parts/Board';
import { Stage, audioEnd, segment } from './kit';

function Verdict({ frame, at, icon, label, text }: { frame: number; at: number; icon: IconName; label: string; text: string }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * -16}px)`, fontFamily: FONT.sans }}>
      <Icon name={icon} size={36} color={C.cyan} />
      <span style={{ width: 150, fontSize: 28, fontWeight: 800, letterSpacing: 1.5, color: C.cyanSoft, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 33, fontWeight: 650, color: C.textStrong }}>{text}</span>
    </div>
  );
}

/**
 * s09-caso «Explicarlo sin prometer de más». The whole flow again on the four columns, with the two separate
 * destinations (access → Graph, renewal → Entra ID), the web session of the application, and padlocks that
 * show closing one piece closes nothing else. A model conclusion lists the artefact, scope and what is missing.
 */
export function S09Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const conclusion = props.cue('s09-c');
  const cardAt = audioEnd('s09-caso', 's09-06') + 6;
  const shut = at('s09-04');

  const msgs: Msg[] = [
    { from: 0, to: 2, y: 150, label: 'Ana se identifica', tone: 'cyan', at: at('s09-01') + 20 },
    { from: 2, to: 1, y: 205, label: 'emite credenciales', tone: 'emerald', at: at('s09-01') + 100 },
    { from: 1, to: 3, y: 260, label: 'presenta el token de acceso', tone: '#fb923c', at: at('s09-02'), litAt: at('s09-02') + 90, litTone: 'emerald', mark: { icon: 'lock', tone: 'emerald', at: shut + 10 } },
    { from: 1, to: 2, y: 315, label: 'si hace falta, renueva', tone: 'sky', dashed: true, at: at('s09-03'), mark: { icon: 'alert', tone: 'amber', at: shut + 30 } },
  ];
  return (
    <Stage>
      <Board frame={frame} height={380} colAt={[-30, -26, -22, -18]} lit={[0, 0, 0, 0]} msgs={msgs} />
      <Reveal frame={frame} at={at('s09-03') + 60} x={colX(1) + 26} y={338} w={360}>
        <Pill icon="globe" tone="muted" size={26}>sesión web propia</Pill>
      </Reveal>
      <Reveal frame={frame} at={shut + 20} x={colC(3) - 260} y={338} w={380}>
        <Pill icon="alert" tone="amber" size={26}>otras piezas, sin comprobar</Pill>
      </Reveal>

      <Reveal frame={frame} at={conclusion} x={0} y={420} w={1000}>
        <div style={{ boxSizing: 'border-box', width: 1000, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.55)}`, background: C.ink900, overflow: 'hidden' }}>
          <div style={{ height: 54, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', background: alpha(C.cyan, 0.1), borderBottom: `2px solid ${C.ink700}`, fontFamily: FONT.sans }}>
            <Icon name="file" size={30} color={C.cyan} />
            <span style={{ fontSize: 28, fontWeight: 800, color: C.cyanSoft }}>Conclusión modelo</span>
          </div>
          <div style={{ padding: '14px 24px 18px', display: 'grid', gap: 10 }}>
            <Verdict frame={frame} at={conclusion + 14} icon="key" label="Consta" text="un access token de Graph expuesto" />
            <Verdict frame={frame} at={conclusion + 44} icon="eye" label="Alcance" text="lectura delegada, según permisos y vigencia" />
            <Verdict frame={frame} at={conclusion + 74} icon="search" label="Falta" text="evidencia de uso y de otras credenciales" />
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s09-06')} x={1040} y={420} w={688}>
        <div style={{ display: 'grid', gap: 16 }}>
          <Pill icon="split" tone="muted" size={26}>el nombre del proveedor no amplía permisos</Pill>
          <Pill icon="lock" tone="amber" size={26}>el segundo factor no cubre un robo posterior</Pill>
        </div>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="El permiso concedido no prueba qué ocurrió después" />
    </Stage>
  );
}
