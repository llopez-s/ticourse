import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Icon } from '../../../engine/src/ui/Icon';
import { FamTag, InfoCard, Pill, Reveal } from './parts/bits';
import { BRUMA, fmt } from './parts/data';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-caso';
const TILE_Y = 190; // the intercepted-message card owns the first 170 px of the stage while it lasts
const TILE_W = 268;

function Tile({ frame, at, slot, label, value, sub, lit = 0 }: { frame: number; at: number; slot: number; label: string; value: number; sub: string; lit?: number }) {
  return (
    <Reveal frame={frame} at={at} x={slot * (TILE_W + 24)} y={TILE_Y} w={TILE_W}>
      <div style={{ boxSizing: 'border-box', width: TILE_W, height: 210, padding: '18px 16px', borderRadius: RADIUS.md, background: lit > 0.01 ? alpha(BRUMA.color, 0.09) : C.ink850, border: `2px solid ${alpha(BRUMA.color, 0.35 + 0.55 * lit)}`, boxShadow: `0 0 ${12 + 28 * lit}px ${alpha(BRUMA.color, 0.3 * lit)}`, fontFamily: FONT.sans }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{label}</div>
        <div style={{ marginTop: 6, fontSize: 68, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.05, color: BRUMA.color }}>{fmt(value)}</div>
        <div style={{ marginTop: 6, fontSize: 26, fontWeight: 560, lineHeight: 1.15, color: C.muted }}>{sub}</div>
      </div>
    </Reveal>
  );
}

/** One laptop and many files: the same device, a pile of samples. */
function Repack({ frame, at }: { frame: number; at: number }) {
  return (
    <div style={{ position: 'relative', width: 820, height: 200, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 10, width: 190, textAlign: 'center' }}>
        <div style={{ margin: '0 auto', width: 112, height: 112, borderRadius: 24, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.8)}` }}>
          <Icon name="laptop" size={68} color={C.cyan} />
        </div>
        <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: C.textStrong }}>1 equipo</div>
      </div>
      <svg width={120} height={40} style={{ position: 'absolute', left: 200, top: 46 }}>
        <line x1={6} y1={20} x2={88} y2={20} stroke={C.muted} strokeWidth={4} strokeLinecap="round" />
        <polygon points="110,20 88,9 88,31" fill={C.muted} />
      </svg>
      <div style={{ position: 'absolute', left: 340, top: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 70px)', gap: 12 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ width: 70, height: 70, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(BRUMA.color, 0.1), border: `2px solid ${alpha(BRUMA.color, 0.55)}`, opacity: progress(frame, at + 8 + i * 3, 10) }}>
            <Icon name="file" size={40} color={BRUMA.color} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 340, top: 176, fontSize: 28, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', opacity: progress(frame, at + 40, 14) }}>
        muchos archivos, un solo equipo
      </div>
    </div>
  );
}

/**
 * s03-caso «Miles de registros no son miles de equipos». The Bruma record as six tiles below the intercept card:
 * records and devices first (the 80-per-device quotient is the dataset's ratio, not each device), then samples
 * and episodes, a repackaged pile of files from one laptop, the victim definition, and the closing warning.
 */
export function S03Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const regs = w('s03-01', 'ocho') - 8;
  const devs = w('s03-01', 'cien') - 8;
  const many = w('s03-01', 'muchas') - 8;
  const pack = w('s03-04', 'empaquetado') - 30;
  const victim = props.cue('s03-c');
  const closing = at('s03-06');

  return (
    <Stage>
      <Reveal frame={frame} at={at('s03-02') + 14} x={0} y={96}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <FamTag f={BRUMA} size={44} />
          <span style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 600, color: C.muted }}>septiembre de 2026 · Demo-P · datos ficticios</span>
        </div>
      </Reveal>

      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: i * (TILE_W + 24), top: TILE_Y, width: TILE_W, height: 210, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.ink500, 0.7)}`, opacity: progress(frame, 12 + i * 4, 14) }} />
      ))}
      <Tile frame={frame} at={w('s03-03', 'muestra') - 8} slot={0} label="Muestras" value={BRUMA.muestras} sub="archivos únicos" />
      <Tile frame={frame} at={w('s03-03', 'episodio') - 8} slot={1} label="Episodios" value={BRUMA.episodios} sub="eventos de infección" />
      <Tile frame={frame} at={devs} slot={2} label="Dispositivos" value={BRUMA.dispositivos} sub="equipos observados" lit={windowWeight(frame, devs, many + 20, { ramp: 12, lead: 0 })} />
      <Tile frame={frame} at={regs} slot={3} label="Registros" value={BRUMA.registros} sub="entradas robadas únicas" lit={windowWeight(frame, regs, devs + 30, { ramp: 12, lead: 0 })} />
      <Tile frame={frame} at={w('s03-05', 'organización') - 8} slot={4} label="Organizaciones" value={BRUMA.organizaciones} sub="identidad validada" />
      <Tile frame={frame} at={w('s03-05', 'empresa') - 8} slot={5} label="Sector" value={BRUMA.sector} sub="dispositivos del sector" />

      {/* the ratio of the dataset */}
      <Reveal frame={frame} at={many} x={0} y={446} w={860}>
        <InfoCard icon="chart" title={`${fmt(BRUMA.registros)} ÷ ${fmt(BRUMA.dispositivos)} = 80`} sub="registros por dispositivo · cociente de la tabla" tone="cyan" w={860} h={130} titleSize={46} />
      </Reveal>
      <Reveal frame={frame} at={many + 40} x={0} y={596} w={860}>
        <Pill icon="x" tone="amber" size={34}>no son 8.000 equipos infectados</Pill>
      </Reveal>

      {/* right-hand notes, one at a time */}
      <Reveal frame={frame} at={at('s03-02')} outAt={pack - 6} x={908} y={446} w={820}>
        <InfoCard icon="key" title="Un registro no es una credencial válida" sub="un paquete de datos robados puede no servir" tone="amber" w={820} h={130} titleSize={36} />
      </Reveal>
      <Reveal frame={frame} at={pack} outAt={victim - 6} x={908} y={440} w={820}>
        <Repack frame={frame} at={pack} />
      </Reveal>
      <Reveal frame={frame} at={victim} outAt={closing - 6} x={908} y={440} w={820}>
        <div style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
          <Pill icon="users" tone="sky" size={34}>¿víctima: persona u organización?</Pill>
          <Pill icon="laptop" tone="muted" size={32}>una empresa tiene muchos dispositivos</Pill>
          <Pill icon="user" tone="muted" size={32}>varias cuentas, una misma persona</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={closing} x={908} y={446} w={820}>
        <InfoCard icon="alert" title="¿Qué cuenta una fila?" sub="si no lo dices, el titular compara unidades incompatibles" tone="amber" w={820} h={150} titleSize={42} />
      </Reveal>
    </Stage>
  );
}
