import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Choices, InfoCard, LearningCard, Pill, Reveal } from './parts/bits';
import { COBALTO, FAMILIES, fmt, leader } from './parts/data';
import { DataTable, type TCol } from './parts/Table';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's08-caso';
const LOW = 180; // the engine's pause card owns the first 170 px of the stage
const NOW = 400;

function Confidence({ frame, at }: { frame: number; at: number }) {
  const p = progress(frame, at, 16);
  return (
    <div style={{ boxSizing: 'border-box', width: 840, height: 118, display: 'flex', alignItems: 'center', gap: 28, padding: '0 28px', borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${alpha(C.amber, 0.5)}`, fontFamily: FONT.sans }}>
      <div>
        <div style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>Confianza moderada</div>
        <div style={{ marginTop: 2, fontSize: 27, fontWeight: 560, color: C.muted }}>límites de fuente y método</div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ width: 62, height: 26, borderRadius: 13, background: n <= 2 ? alpha(C.amber, 0.9 * p) : C.ink600, opacity: n <= 2 ? 1 : 0.8 }} />
        ))}
      </div>
    </div>
  );
}

/**
 * s08-caso «Qué investigar primero». The three signals stay on screen (samples, sector, last week, capability)
 * with the decision below them and NO answer colour until the pause ends. At the reveal the block slides up,
 * the Cobalto row lights and the others step back; then priority with moderate confidence, what the priority
 * does not authorise, three things that would change it, and the «not a permanent label» line.
 */
export function S08Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s08-b');
  const changes = props.cue('s08-c');
  const cardAt = audioEnd(S, 's08-06') + 6;
  const lift = progress(frame, reveal + 20, 28, EASE.inOut);
  const hot = windowWeight(frame, reveal, undefined, { ramp: 14, lead: 0 });

  const t0 = at('s08-01') - 6;
  const cols: TCol[] = [
    { label: 'Muestras', sub: 'hashes', w: 190, at: t0, win: leader('muestras'), winAt: w('s08-01', 'lidera') },
    { label: 'Del sector', sub: 'dispositivos', w: 260, at: t0, win: 1, winAt: reveal },
    { label: 'Última semana', sub: 'dispositivos', w: 280, at: t0, win: 1, winAt: reveal },
    { label: 'Capacidad descrita', w: 798, at: t0, text: true, win: 1, winAt: reveal },
  ];
  const rows = FAMILIES.map((f, i) => ({
    name: f.name,
    color: f.color,
    cells: [fmt(f.muestras), fmt(f.sector), fmt(f.reciente), f.capacidad],
    lit: i === 1 ? hot : 0,
    dim: i === 1 ? 0 : 0.8 * hot,
  }));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: LOW * (1 - lift), width: 1728 }}>
        <Reveal frame={frame} at={t0 - 6} x={0} y={0} w={1728}>
          <Pill icon="target" tone="sky" size={32}>requisito de Meridian: investigar exposición de sesión en su sector</Pill>
        </Reveal>
        <div style={{ position: 'absolute', left: 0, top: 68 }}>
          <DataTable frame={frame} at={t0} cols={cols} rows={rows} headH={68} rowH={64} nameW={200} />
        </div>
      </div>

      <Reveal frame={frame} at={at('s08-02') - 4} outAt={at('s08-04') - 6} x={0} y={556} w={1728}>
        <Choices frame={frame} at={at('s08-02') - 4} revealAt={reveal} labels={['Bruma', 'Cobalto']} answer={1} />
      </Reveal>

      <Reveal frame={frame} at={at('s08-03') + 20} outAt={changes - 8} x={0} y={NOW} w={840}>
        <InfoCard icon="target" title={`Primera revisión: ${COBALTO.name}`} sub="para el requisito de Meridian" tone="cyan" w={840} h={118} titleSize={40} />
      </Reveal>
      <Reveal frame={frame} at={w('s08-03', 'confianza') - 8} outAt={changes - 8} x={888} y={NOW} w={840}>
        <Confidence frame={frame} at={w('s08-03', 'confianza') - 8} />
      </Reveal>
      <Reveal frame={frame} at={w('s08-04', 'infección') - 10} outAt={changes - 8} x={0} y={540} w={840}>
        <Pill icon="x" tone="amber" size={32}>no declara una infección propia</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s08-04', 'medidas') - 10} outAt={changes - 8} x={888} y={540} w={840}>
        <Pill icon="x" tone="amber" size={32}>no autoriza medidas automáticas</Pill>
      </Reveal>

      {/* what would change it */}
      <Reveal frame={frame} at={changes - 4} x={0} y={NOW + 6} w={1728}>
        <Pill icon="search" tone="sky" size={34}>lo que cambiaría la prioridad</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s08-05', 'independiente') - 14} x={0} y={NOW + 82} w={544}>
        <InfoCard icon="globe" title="Fuente independiente" tone="sky" w={544} h={104} titleSize={34} />
      </Reveal>
      <Reveal frame={frame} at={w('s08-05', 'evidencia') - 14} x={592} y={NOW + 82} w={544}>
        <InfoCard icon="search" title="Evidencia interna nueva" tone="sky" w={544} h={104} titleSize={32} />
      </Reveal>
      <Reveal frame={frame} at={w('s08-05', 'corrección') - 14} x={1184} y={NOW + 82} w={544}>
        <InfoCard icon="merge" title="Corrección de duplicados" tone="sky" w={544} h={104} titleSize={32} />
      </Reveal>

      <Reveal frame={frame} at={at('s08-06')} x={0} y={596} w={1728}>
        <Pill icon="flag" tone="cyan" size={34}>un juicio que se revisa, no una etiqueta pegada a la familia</Pill>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="La relevancia combina capacidad, recencia y exposición" />
    </Stage>
  );
}
