import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { FamTag, InfoCard, Pill, Reveal } from './parts/bits';
import { BRUMA, COBALTO, DUNA, fmt, type Family } from './parts/data';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-hook';

function Winner({ frame, at, until, x, icon, unit, sub, f, value }: { frame: number; at: number; until: number; x: number; icon: IconName; unit: string; sub: string; f: Family; value: string }) {
  const lit = windowWeight(frame, at, until, { ramp: 12, lead: 0 });
  return (
    <Reveal frame={frame} at={at} x={x} y={120} w={540}>
      <div style={{ boxSizing: 'border-box', width: 540, height: 330, padding: '26px 30px', borderRadius: RADIUS.lg, background: lit > 0.01 ? alpha(f.color, 0.07) : C.ink850, border: `2px solid ${alpha(f.color, 0.4 + 0.5 * lit)}`, boxShadow: `0 0 ${14 + 30 * lit}px ${alpha(f.color, 0.28 * lit)}`, fontFamily: FONT.sans }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name={icon} size={44} color={C.cyan} />
          <span style={{ fontSize: 38, fontWeight: 800, color: C.cyanSoft }}>{unit}</span>
        </div>
        <div style={{ marginTop: 4, fontSize: 28, fontWeight: 560, color: C.muted }}>{sub}</div>
        <div style={{ marginTop: 22, fontSize: 82, fontWeight: 850, letterSpacing: -2, lineHeight: 1, color: f.color }}>{f.name}</div>
        <div style={{ marginTop: 14, fontSize: 52, fontWeight: 800, color: C.textStrong }}>{value}</div>
      </div>
    </Reveal>
  );
}

/**
 * s01-hook «Tres ganadores en una tabla». Headline at the `title` cue. Dataset and provider facts, then the
 * infostealer / Meridian context, then the fictitious families (not a ranking). At s01-04 the context steps
 * aside and three cards arrive as the voice names them: files, devices, records — each with a different winner.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const title = props.cue('title');
  const cards = at('s01-04');
  const arch = w('s01-04', 'archivos');
  const disp = w('s01-04', 'dispositivos');
  const regs = w('s01-04', 'registros');
  const counting = w('s01-04', 'contando');
  const out = cards - 8;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, opacity: progress(frame, title, 18), transform: `translateY(${(1 - progress(frame, title, 18)) * 18}px)`, fontFamily: FONT.sans, fontSize: 66, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        Una tabla, <span style={{ color: C.cyan }}>tres ganadores distintos</span>
      </div>

      {/* dataset and provider */}
      <Reveal frame={frame} at={w('s01-01', 'Vas') - 6} outAt={out} x={0} y={130} w={840}>
        <InfoCard icon="database" title="Dataset ficticio" sub="septiembre de 2026 · UTC" tone="cyan" w={840} h={116} />
      </Reveal>
      <Reveal frame={frame} at={w('s01-01', 'organización') - 40} outAt={out} x={888} y={130} w={840}>
        <InfoCard icon="globe" title="Proveedor Demo-P" sub="dos regiones · sin cobertura global" tone="sky" w={840} h={116} />
      </Reveal>

      {/* infostealer and Meridian */}
      <Reveal frame={frame} at={w('s01-02', 'infostealer') - 10} outAt={out} x={0} y={270} w={840}>
        <InfoCard icon="laptop" title="Infostealer" sub="malware que roba información del dispositivo" tone="rose" w={840} h={116} />
      </Reveal>
      <Reveal frame={frame} at={w('s01-02', 'Meridian') - 10} outAt={out} x={888} y={270} w={840}>
        <InfoCard icon="flag" title="Meridian" sub="empresa aeroespacial · ejercicio" tone="sky" w={840} h={116} />
      </Reveal>

      {/* invented families */}
      <Reveal frame={frame} at={w('s01-03', 'Bruma') - 14} outAt={out} x={0} y={448} w={340}>
        <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>Familias inventadas</span>
      </Reveal>
      <Reveal frame={frame} at={w('s01-03', 'Bruma') - 6} outAt={out} x={360} y={436}>
        <FamTag f={BRUMA} size={40} />
      </Reveal>
      <Reveal frame={frame} at={w('s01-03', 'Cobalto') - 6} outAt={out} x={590} y={436}>
        <FamTag f={COBALTO} size={40} />
      </Reveal>
      <Reveal frame={frame} at={w('s01-03', 'Duna') - 6} outAt={out} x={880} y={436}>
        <FamTag f={DUNA} size={40} />
      </Reveal>
      <Reveal frame={frame} at={w('s01-03', 'ranking') - 14} outAt={out} x={0} y={530} w={1200}>
        <Pill icon="eyeOff" tone="amber" size={36}>sus datos de septiembre no son un ranking real</Pill>
      </Reveal>

      {/* three winners */}
      <Winner frame={frame} at={arch - 10} until={disp - 10} x={0} icon="file" unit="Por muestras" sub="archivos únicos" f={BRUMA} value={`${fmt(BRUMA.muestras)} archivos`} />
      <Winner frame={frame} at={disp - 10} until={regs - 10} x={594} icon="laptop" unit="Por dispositivos" sub="equipos observados" f={COBALTO} value={`${fmt(COBALTO.dispositivos)} equipos`} />
      <Winner frame={frame} at={regs - 10} until={counting - 10} x={1188} icon="database" unit="Por registros" sub="datos robados únicos" f={DUNA} value={`${fmt(DUNA.registros)} registros`} />
      <Reveal frame={frame} at={counting - 6} x={0} y={466} w={1728}>
        <div style={{ textAlign: 'center' }}>
          <Pill icon="search" tone="cyan" size={52}>¿qué estás contando?</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s01-05') + 8} x={0} y={548} w={1728}>
        <div style={{ textAlign: 'center' }}>
          <Pill icon="split" tone="muted" size={34}>columnas distintas, decisiones distintas</Pill>
        </div>
      </Reveal>

      {/* what the table is, kept in view */}
      <Reveal frame={frame} at={cards + 12} x={0} y={628} w={1728}>
        <div style={{ fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>
          Demo-P · dos regiones · septiembre de 2026 · UTC · datos ficticios
        </div>
      </Reveal>
    </Stage>
  );
}
