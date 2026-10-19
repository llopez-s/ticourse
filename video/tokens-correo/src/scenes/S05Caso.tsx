import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../engine/src/ui/tone';
import { Pill, Reveal } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-caso';
const COL_W = 540;
const GAP = 54;

interface Col {
  icon: IconName;
  title: string;
  tone: Tone;
  emits: string;
  goes: string;
  warn: string;
}

const COLS: Col[] = [
  { icon: 'lock', title: 'Contraseña', tone: 'cyan', emits: 'la comprueba el sistema que la verifica', goes: 'demostrar identidad ante ese sistema', warn: 'no es un token' },
  { icon: 'globe', title: 'Cookie de sesión', tone: 'amber', emits: 'quien mantiene la sesión web', goes: 'mantener esa sesión; también guarda preferencias', warn: 'no toda cookie autentica' },
  { icon: 'user', title: 'ID token', tone: 'emerald', emits: 'Entra ID, con OpenID Connect', goes: 'la aplicación: cuenta cómo se autenticó Ana', warn: 'no reemplaza al de acceso' },
];

/**
 * s05-caso «Tres credenciales que se parecen desde fuera». A separate table, one column per artefact, two rows
 * (who issues or checks it, who it is for) and a warning row that lights on the sentence it belongs to. No
 * token-like strings anywhere. Closing: «¿qué artefacto es y para quién?» and the two web sessions.
 */
export function S05Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const colAt = [at('s05-01') - 6, wordFrame(S, 's05-01', 'cookie') - 14, at('s05-03') - 6];
  const warnAt = [at('s05-01') + 60, at('s05-02'), at('s05-04')];
  const idKey = progress(frame, at('s05-04'), 14);
  const q = props.cue('s05-c');
  const sess = at('s05-06');

  return (
    <Stage>
      {COLS.map((col, i) => {
        const t = toneOf(col.tone);
        const p = progress(frame, colAt[i], 18);
        const warn = progress(frame, warnAt[i], 14);
        const x = i * (COL_W + GAP);
        return (
          <div key={col.title} style={{ position: 'absolute', left: x, top: 0, width: COL_W, opacity: p, transform: `translateY(${(1 - p) * 16}px)`, fontFamily: FONT.sans }}>
            <div style={{ boxSizing: 'border-box', height: 92, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', borderRadius: `${RADIUS.md}px ${RADIUS.md}px 0 0`, background: alpha(t.fg, 0.14), border: `2px solid ${alpha(t.fg, 0.7)}` }}>
              <Icon name={col.icon} size={44} color={t.fg} />
              <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong }}>{col.title}</span>
            </div>
            {[['Quién la emite o comprueba', col.emits], ['Para qué o para quién', col.goes]].map(([label, value]) => (
              <div key={label} style={{ boxSizing: 'border-box', height: 124, padding: '12px 22px', background: C.ink850, borderLeft: `2px solid ${C.ink700}`, borderRight: `2px solid ${C.ink700}`, borderBottom: `2px solid ${C.ink700}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1.5, color: C.faint, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ marginTop: 6, fontSize: 30, fontWeight: 650, lineHeight: 1.18, color: C.text }}>{value}</div>
              </div>
            ))}
            <div style={{ boxSizing: 'border-box', height: 80, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', borderRadius: `0 0 ${RADIUS.md}px ${RADIUS.md}px`, background: alpha(C.amber, 0.04 + 0.1 * warn), border: `2px solid ${alpha(C.amber, 0.25 + 0.55 * warn)}`, borderTop: 'none', opacity: 0.35 + 0.65 * warn }}>
              <Icon name="alert" size={32} color={C.amber} />
              <span style={{ fontSize: 31, fontWeight: 750, color: '#fcd34d', opacity: warn }}>{col.warn}</span>
            </div>
          </div>
        );
      })}
      {idKey > 0 ? (
        <div style={{ position: 'absolute', right: 0, top: 434, opacity: idKey }}>
          <Pill tone="sky" size={28} icon="layers">OpenID Connect: identidad sobre OAuth</Pill>
        </div>
      ) : null}

      <Reveal frame={frame} at={q} x={0} y={500} w={1728}>
        <div style={{ display: 'flex', gap: 24 }}>
          <Pill icon="search" tone="cyan" size={38}>¿Qué artefacto es?</Pill>
          <Pill icon="target" tone="cyan" size={38}>¿Para quién se emitió?</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={sess} x={0} y={580} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Pill icon="app" tone="sky" size={34}>sesión de la aplicación</Pill>
          <Icon name="split" size={46} color={C.muted} />
          <Pill icon="shield" tone="emerald" size={34}>sesión del proveedor de identidad</Pill>
        </div>
      </Reveal>
    </Stage>
  );
}
