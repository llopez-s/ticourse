import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { Pill, Reveal, Tag } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-hook';

function Status({ frame, at, icon, tone, label, state }: { frame: number; at: number; icon: IconName; tone: string; label: string; state: string }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 64, padding: '0 22px', borderRadius: RADIUS.md, border: `2px solid ${alpha(tone, 0.7)}`, background: alpha(tone, 0.1), opacity: p, transform: `translateX(${(1 - p) * -16}px)` }}>
      <Icon name={icon} size={38} color={tone} strokeWidth={2.6} />
      <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: 30, fontWeight: 700, color: tone }}>{state}</span>
    </div>
  );
}

function Group({ frame, at, label, tone, tags }: { frame: number; at: number; label: string; tone: string; tags: string[] }) {
  return (
    <Reveal frame={frame} at={at} x={0} y={0}>
      <div style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
        <Pill tone={tone} size={28}>{label}</Pill>
        <div style={{ display: 'flex', gap: 12 }}>
          {tags.map((t, i) => (
            <span key={t} style={{ opacity: progress(frame, at + 8 + i * 5, 10) }}>
              <Tag tone={tone} size={28}>{t}</Tag>
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/**
 * s01-hook «La sintaxis está bien». Title at the `title` cue; the three promises (qué detecta / qué se le escapa /
 * qué entregar) as the voice names them. The rule file card shows «sintaxis aceptada» and «resultados pendientes»;
 * Meridian context pills on the right at s01-b. At s01-c the package: three variants, similar controls, cases that
 * reveal limits. Closing: no real malware, no paid account — compare expected with observed.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const title = props.cue('title');
  const ctx = props.cue('s01-b');
  const pack = props.cue('s01-c');
  const s05 = at('s01-05');
  const tp = progress(frame, title, 18);
  const ctxOut = progress(frame, s05 - 6, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, opacity: tp, transform: `translateY(${(1 - tp) * 18}px)`, fontFamily: FONT.sans, fontSize: 64, fontWeight: 850, letterSpacing: -1.4, color: C.textStrong, whiteSpace: 'nowrap' }}>
        Tu YARA compila: <span style={{ color: C.cyan }}>ahora demuestra qué detecta</span>
      </div>

      <Reveal frame={frame} at={w('s01-01', 'detecta') - 14} x={0} y={100}>
        <div style={{ display: 'flex', gap: 22 }}>
          <Pill icon="search" tone="cyan" size={32}>qué detecta</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s01-01', 'escapa') - 14} x={330} y={100}>
        <Pill icon="eyeOff" tone="rose" size={32}>qué se le escapa</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s01-01', 'entregar') - 14} x={730} y={100}>
        <Pill icon="archive" tone="emerald" size={32}>qué debes entregar</Pill>
      </Reveal>

      {/* the student's rule file */}
      <Reveal frame={frame} at={w('s01-01', 'regla') - 10} x={0} y={176} w={800}>
        <div style={{ boxSizing: 'border-box', width: 800, borderRadius: RADIUS.lg, border: `2px solid ${C.ink700}`, background: C.ink900, fontFamily: FONT.sans, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 64, padding: '0 24px', background: alpha(C.ink800, 0.9), borderBottom: `2px solid ${C.ink700}` }}>
            <Icon name="file" size={32} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: C.textStrong }}>mi-regla.yar</span>
          </div>
          <div style={{ padding: '18px 24px 24px', display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gap: 10, paddingBottom: 6 }}>
              {[0.62, 0.84, 0.5].map((x, i) => (
                <div key={i} style={{ height: 14, width: `${x * 100}%`, borderRadius: 7, background: C.ink600, opacity: progress(frame, w('s01-01', 'regla') + i * 6, 12) }} />
              ))}
            </div>
            <Status frame={frame} at={w('s01-01', 'compila') - 4} icon="check" tone={C.emerald} label="Sintaxis" state="aceptada" />
            <Status frame={frame} at={w('s01-01', 'comprobar') - 4} icon="clock" tone={C.amber} label="Resultados" state="pendientes" />
          </div>
        </div>
      </Reveal>
      {/* context, then the closing promise */}
      <div style={{ position: 'absolute', left: 880, top: 176, opacity: 1 - ctxOut }}>
        <Reveal frame={frame} at={ctx} x={0} y={0}>
          <Pill icon="flag" tone="sky" size={32}>Meridian · laboratorio didáctico</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s01-02', 'inertes') - 10} x={0} y={78}>
          <Pill icon="lock" tone="emerald" size={32}>ALRTDEMO · archivos inertes</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s01-02', 'patrones') - 10} x={0} y={156}>
          <Pill icon="gear" tone="muted" size={32}>regla YARA = patrones + condiciones</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s01-03', 'cumpla') - 6} x={0} y={234}>
          <Pill icon="split" tone="amber" size={32}>sintaxis aceptada no es objetivo cumplido</Pill>
        </Reveal>
      </div>
      <Reveal frame={frame} at={s05 + 4} x={880} y={176}>
        <div style={{ display: 'grid', gap: 18, justifyItems: 'start' }}>
          <Pill icon="x" tone="rose" size={32} strike>malware real</Pill>
          <Pill icon="x" tone="rose" size={32} strike>cuenta de pago</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s01-05', 'comparar') - 8} x={880} y={330}>
        <Pill icon="split" tone="emerald" size={34}>comparar lo esperado con lo observado</Pill>
      </Reveal>

      {/* the practice package */}
      <div style={{ position: 'absolute', left: 0, top: 540, display: 'flex', gap: 56, alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', width: 480, height: 80 }}>
          <Group frame={frame} at={pack} label="3 variantes en el alcance" tone={C.cyan} tags={['A', 'B', 'C']} />
        </div>
        <div style={{ position: 'relative', width: 520, height: 80 }}>
          <Group frame={frame} at={w('s01-04', 'controles') - 8} label="controles parecidos" tone={C.amber} tags={['ruta', 'marcador', 'bytes']} />
        </div>
        <div style={{ position: 'relative', width: 560, height: 80 }}>
          <Group frame={frame} at={w('s01-04', 'límites') - 8} label="casos que revelan límites" tone={C.rose} tags={['tamaño', 'v2']} />
        </div>
      </div>
    </Stage>
  );
}
