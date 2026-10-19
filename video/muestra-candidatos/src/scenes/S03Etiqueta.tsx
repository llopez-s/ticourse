import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { Pill, Reveal } from './parts/bits';
import { ColPanel } from './parts/Panel';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-caso';
const TOP = 180; // the engine's intercepted-message card owns the first 170 px until s03-01 ends
const PH = 410;

/** A horizontal "how much does this tell the explanations apart" bar. */
function Value({ frame, at, label, fill, tone }: { frame: number; at: number; label: string; fill: number; tone: string }) {
  const p = progress(frame, at, 20);
  return (
    <div style={{ fontFamily: FONT.sans }}>
      <div style={{ fontSize: 28, fontWeight: 650, color: C.text }}>{label}</div>
      <div style={{ marginTop: 8, width: 512, height: 22, borderRadius: 11, background: C.ink700 }}>
        <div style={{ width: 512 * fill * p, height: 22, borderRadius: 11, background: tone }} />
      </div>
    </div>
  );
}

/**
 * s03-caso «La etiqueta y la firma». Starts below the intercepted-message card. Panel 1: the PDB path (a symbols
 * file, a clue that can be copied). Panel 2: distinctive strings and configuration, and the question of what
 * really tells explanations apart. Panel 3: code signing checks, separate from TLS. Closing banner: sharing a
 * feature does not turn a candidate into a family.
 */
export function S03Etiqueta(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const b = props.cue('s03-b');
  const c = props.cue('s03-c');
  const d1 = progress(frame, b - 6, 20);
  const d2 = progress(frame, c - 6, 20);
  const copy = w('s03-02', 'copiarse') - 8;
  const cmp = w('s03-03', 'estructura') - 10;
  const reuse = at('s03-04');

  return (
    <Stage>
      {/* 1 · PDB */}
      <ColPanel frame={frame} at={props.cue('s03-a')} x={0} y={TOP} w={500} h={PH} tone="cyan" icon="file" title="Ruta PDB" sub="Program Database" dim={d1}>
        <Reveal frame={frame} at={at('s03-01') + 6} x={24} y={14} w={452}>
          <Pill icon="x" tone="amber" size={28}>no dice quién lo escribió</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s03-01', 'ruta') - 6} x={24} y={76} w={452}>
          <div style={{ boxSizing: 'border-box', width: 452, padding: '12px 16px', borderRadius: RADIUS.sm, background: C.ink950, border: `2px solid ${alpha(C.cyan, 0.5)}`, fontFamily: FONT.mono, fontSize: 28, fontWeight: 600, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
            ...\proyecto-demo\ldr.pdb
          </div>
        </Reveal>
        <Reveal frame={frame} at={w('s03-01', 'PDB') - 6} x={24} y={150} w={452}>
          <Pill icon="archive" tone="cyan" size={28}>Program Database</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s03-01', 'símbolos') - 6} x={24} y={210} w={452}>
          <Pill icon="gear" tone="cyan" size={28}>símbolos de depuración</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s03-02', 'pistas') - 6} outAt={copy} x={24} y={272} w={452}>
          <Pill icon="search" tone="sky" size={28}>pista sobre el proyecto</Pill>
        </Reveal>
        <Reveal frame={frame} at={copy} x={24} y={272} w={452}>
          <Pill icon="alert" tone="amber" size={28}>puede copiarse o falsearse</Pill>
        </Reveal>
      </ColPanel>

      {/* 2 · strings and configuration */}
      <ColPanel frame={frame} at={b} x={516} y={TOP} w={560} h={PH} tone="sky" icon="search" title="Cadenas y configuración" sub="rasgos poco comunes" dim={d2} titleSize={34}>
        <Reveal frame={frame} at={w('s03-03', 'cadenas') - 6} x={24} y={14} w={512}>
          <Pill icon="search" tone="sky" size={28}>cadenas distintivas</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s03-03', 'configuración') - 6} x={24} y={74} w={512}>
          <Pill icon="gear" tone="sky" size={28}>estructura de configuración</Pill>
        </Reveal>
        <Reveal frame={frame} at={cmp} outAt={reuse - 6} x={24} y={148} w={512}>
          <Value frame={frame} at={cmp} label="palabra genérica" fill={0.22} tone={C.faint} />
        </Reveal>
        <Reveal frame={frame} at={cmp + 30} outAt={reuse - 6} x={24} y={222} w={512}>
          <Value frame={frame} at={cmp + 30} label="estructura poco común" fill={0.9} tone={C.sky} />
        </Reveal>
        <Reveal frame={frame} at={w('s03-04', 'reutilizado') - 8} x={24} y={150} w={512}>
          <Pill icon="layers" tone="amber" size={28}>código reutilizado</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s03-04', 'señuelos.') - 8} x={24} y={208} w={512}>
          <Pill icon="target" tone="amber" size={28}>señuelos</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s03-04', 'Pregunta')} x={24} y={266} w={512}>
          <Pill icon="split" tone="cyan" size={28}>¿distingue las explicaciones?</Pill>
        </Reveal>
      </ColPanel>

      {/* 3 · code signing */}
      <ColPanel frame={frame} at={c} x={1092} y={TOP} w={636} h={PH} tone="emerald" icon="shield" title="Firma de código" sub="certificado y validez" dim={0}>
        <div style={{ position: 'absolute', left: 24, top: 14, display: 'flex', gap: 10 }}>
          {[
            ['huella', w('s03-05', 'certificado')],
            ['validez', w('s03-05', 'validez')],
            ['contexto', w('s03-05', 'material')],
          ].map(([t, f]) => {
            const p = progress(frame, f as number, 14);
            return (
              <span key={t} style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
                <Pill icon="check" tone="emerald" size={26}>{t}</Pill>
              </span>
            );
          })}
        </div>
        <Reveal frame={frame} at={w('s03-05', 'robado') - 8} x={24} y={86} w={592}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Pill icon="unplug" tone="amber" size={28}>robado</Pill>
            <span style={{ opacity: progress(frame, w('s03-05', 'compartido') - 8, 14) }}>
              <Pill icon="layers" tone="amber" size={28}>compartido</Pill>
            </span>
          </div>
        </Reveal>
        <Reveal frame={frame} at={w('s03-05', 'firma') + 4} x={24} y={160} w={592}>
          <Pill icon="split" tone="muted" size={26}>no es el certificado TLS del servidor</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s03-06', 'benignidad.') - 14} x={24} y={226} w={592}>
          <Pill icon="x" tone="amber" size={28}>una firma no prueba benignidad</Pill>
        </Reveal>
      </ColPanel>

      {/* a shared feature does not promote a candidate */}
      <Reveal frame={frame} at={w('s03-06', 'tampoco') - 6} x={0} y={TOP + PH + 16} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
          <Pill icon="users" tone="cyan" size={30}>candidato</Pill>
          <Icon name="arrowRight" size={46} color={C.faint} />
          <Icon name="x" size={44} color={C.amber} strokeWidth={3} />
          <Pill icon="layers" tone="muted" size={30}>familia, campaña o actor</Pill>
          <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: '#fcd34d' }}>no es automático</span>
        </div>
      </Reveal>
    </Stage>
  );
}
