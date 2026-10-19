import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { InfoCard, LearningCard, Pill, Reveal, Tag, FamTag } from './parts/bits';
import { BRUMA, COBALTO, DUNA, type Family } from './parts/data';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's06-caso';

// Fixed scatter of points, so the picture never changes between renders.
const DOTS = Array.from({ length: 46 }, (_, i) => ({ x: 20 + ((i * 97) % 580), y: 110 + ((i * 53 + (i % 3) * 31) % 175) }));
const inRegion = (x: number, y: number) => (x > 60 && x < 260 && y > 118 && y < 248) || (x > 300 && x < 480 && y > 140 && y < 270);

function Coverage({ frame, at }: { frame: number; at: number }) {
  const p = progress(frame, at, 20);
  return (
    <svg width={620} height={300} style={{ opacity: p, fontFamily: FONT.sans }}>
      <rect x={2} y={2} width={616} height={296} rx={24} fill="none" stroke={alpha(C.muted, 0.6)} strokeWidth={3} strokeDasharray="10 10" />
      <text x={28} y={44} fontSize={28} fontWeight={700} fill={C.muted}>el mundo</text>
      <rect x={60} y={118} width={200} height={130} rx={20} fill={alpha(C.cyan, 0.14)} stroke={C.cyan} strokeWidth={3} />
      <rect x={300} y={140} width={180} height={130} rx={20} fill={alpha(C.cyan, 0.14)} stroke={C.cyan} strokeWidth={3} />
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={6} fill={inRegion(d.x, d.y) ? C.cyan : alpha(C.muted, 0.45)} />
      ))}
      <text x={60} y={98} fontSize={28} fontWeight={800} fill={C.cyanSoft}>lo que ve Demo-P</text>
    </svg>
  );
}

function Bias({ frame, at, f, text, sub, y }: { frame: number; at: number; f: Family; text: string; sub?: string; y: number }) {
  return (
    <Reveal frame={frame} at={at} x={680} y={y} w={1048}>
      <div style={{ boxSizing: 'border-box', width: 1048, height: 96, display: 'flex', alignItems: 'center', gap: 24, padding: '0 26px', borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${alpha(f.color, 0.45)}`, fontFamily: FONT.sans }}>
        <div style={{ width: 200, flexShrink: 0 }}>
          <FamTag f={f} size={34} />
        </div>
        <div>
          <div style={{ fontSize: 33, fontWeight: 750, color: C.textStrong, lineHeight: 1.12 }}>{text}</div>
          {sub ? <div style={{ marginTop: 2, fontSize: 27, fontWeight: 560, color: C.amber }}>{sub}</div> : null}
        </div>
      </div>
    </Reveal>
  );
}

function Months({ frame, at, strikeAt, askAt }: { frame: number; at: number; strikeAt: number; askAt: number }) {
  const p = progress(frame, at, 16);
  const grow = progress(frame, at + 10, 30);
  const strike = progress(frame, strikeAt, 14);
  const ask = progress(frame, askAt, 14);
  return (
    <div style={{ boxSizing: 'border-box', position: 'relative', width: 820, height: 256, borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${C.ink700}`, opacity: p, fontFamily: FONT.sans }}>
      <svg width={420} height={250} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={30} y1={190} x2={390} y2={190} stroke={C.ink600} strokeWidth={3} />
        <rect x={60} y={190 - 70 * grow} width={120} height={70 * grow} fill={alpha(C.cyan, 0.75)} />
        <rect x={240} y={190 - 70 * grow} width={120} height={70 * grow} fill={alpha(C.cyan, 0.75)} />
        <rect x={240} y={190 - 70 * grow - 80 * grow * strike} width={120} height={80 * grow * strike} fill={alpha(C.amber, 0.8)} stroke={C.amber} strokeWidth={2} strokeDasharray="8 6" />
        <text x={120} y={226} fontSize={28} fontWeight={700} fill={C.text} textAnchor="middle">mes 1</text>
        <text x={300} y={226} fontSize={28} fontWeight={700} fill={C.text} textAnchor="middle">mes 2</text>
      </svg>
      <div style={{ position: 'absolute', left: 440, top: 24, display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Pill icon="x" tone="muted" size={28} strike={strike > 0.5}>comparar mes con mes</Pill>
        <div style={{ display: 'flex', gap: 12, opacity: strike }}>
          <Tag tone="amber" size={28}>+ sensores</Tag>
          <Tag tone="amber" size={28}>+ etiquetas</Tag>
        </div>
        <div style={{ position: 'relative', width: 350, height: 76 }}>
          <div style={{ position: 'absolute', opacity: strike * (1 - ask), fontSize: 29, fontWeight: 650, color: '#fcd34d', lineHeight: 1.2 }}>la cifra sube sin que crezca la amenaza</div>
          <div style={{ position: 'absolute', opacity: ask }}>
            <Pill icon="search" tone="sky" size={28}>¿mismo método y población?</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * s06-caso «Lo que ve el proveedor». A coverage picture (Demo-P sees part of the world), three biases as rows
 * (Cobalto: sector clients; Bruma: repackaged files; Duna: resold ads that must not add unique records), months
 * that look different because the method changed, then the definition of observed prevalence with the two
 * things it is not, and the missing link to Meridian. Learning card closes the scene.
 */
export function S06Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const cardAt = audioEnd(S, 's06-06') + 6;

  return (
    <Stage>
      <Reveal frame={frame} at={at('s06-01') - 8} x={0} y={0}>
        <Coverage frame={frame} at={at('s06-01') - 8} />
      </Reveal>
      <Bias frame={frame} at={w('s06-01', 'Cobalto') - 10} f={COBALTO} text="más clientes del sector donde aparece" y={0} />
      <Bias frame={frame} at={w('s06-01', 'Bruma') - 10} f={BRUMA} text="circulan muchos archivos reempaquetados" y={112} />
      <Bias frame={frame} at={w('s06-02', 'Duna') - 10} f={DUNA} text="anuncios repetidos por reventas" sub="no deben aumentar los registros únicos" y={224} />

      <Reveal frame={frame} at={props.cue('s06-b') - 6} x={0} y={340}>
        <Months frame={frame} at={props.cue('s06-b') - 6} strikeAt={w('s06-03', 'sensores') - 6} askAt={at('s06-04') + 40} />
      </Reveal>

      <Reveal frame={frame} at={w('s06-05', 'prevalencia') - 8} x={870} y={340} w={858}>
        <InfoCard icon="eye" title="Prevalencia observada" sub="frecuencia dentro de esa visibilidad y esa definición" tone="cyan" w={858} h={130} />
      </Reveal>
      <Reveal frame={frame} at={w('s06-05', 'cuota') - 8} x={870} y={484} w={858}>
        <Pill icon="x" tone="amber" size={32}>no es automáticamente una cuota global</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s06-05', 'Tampoco') - 6} x={870} y={546} w={858}>
        <Pill icon="x" tone="amber" size={32}>tampoco es la prioridad de Meridian</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s06-06')} x={0} y={606} w={1728}>
        <Pill icon="link" tone="sky" size={32}>falta conectar los datos con la exposición y las necesidades de la empresa</Pill>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="La prevalencia observada depende de cobertura y sesgo" />
    </Stage>
  );
}
