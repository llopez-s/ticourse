import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { LearningCard, Pill, Reveal } from './parts/bits';
import { HashBar } from './parts/HashBar';
import { ColPanel } from './parts/Panel';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's02-caso';
const PW = 560;
const GAP = 24;

const Label = ({ children }: { children: string }) => (
  <div style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{children}</div>
);

/** Three small import boxes: the same set for two different programs. */
function Imports({ frame, at }: { frame: number; at: number }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {[0, 1, 2].map((i) => {
        const p = progress(frame, at + i * 6, 12);
        return (
          <div key={i} style={{ width: 64, height: 56, borderRadius: 10, display: 'grid', placeItems: 'center', background: alpha(C.sky, 0.12), border: `2px solid ${alpha(C.sky, 0.7)}`, opacity: p }}>
            <Icon name="plug" size={32} color={C.sky} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * s02-caso «Los mismos bytes o rasgos parecidos». Three panels, one per method, each entering as the voice
 * reaches it. Exact hash: one byte changes and every cell of the fingerprint changes (no family conclusion).
 * Imphash: imports normalised, two programs can share them. Fuzzy hash: most cells stay equal, a few differ.
 * Learning card after the last paragraph.
 */
export function S02Huellas(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p2 = props.cue('s02-b');
  const p3 = props.cue('s02-c');
  const cardAt = audioEnd(S, 's02-06') + 6;
  const d1 = progress(frame, p2 - 6, 20);
  const d2 = progress(frame, p3 - 6, 20);
  const flip = w('s02-02', 'completamente') - 10;

  return (
    <Stage>
      {/* 1 · exact hash */}
      <ColPanel frame={frame} at={props.cue('s02-a')} x={0} w={PW} h={560} tone="cyan" icon="lock" title="Hash criptográfico" sub="huella exacta del contenido" dim={d1}>
        <Reveal frame={frame} at={w('s02-01', 'huella') - 10} x={24} y={22} w={512}>
          <Label>Archivo A</Label>
        </Reveal>
        <Reveal frame={frame} at={w('s02-01', 'huella')} x={24} y={62} w={512}>
          <HashBar frame={frame} at={w('s02-01', 'huella')} seed={3} tone={C.cyan} />
        </Reveal>
        <Reveal frame={frame} at={w('s02-01', 'mismos') - 12} x={24} y={132} w={512}>
          <Pill icon="check" tone="emerald" size={28}>mismos bytes, misma huella</Pill>
        </Reveal>
        <Reveal frame={frame} at={at('s02-02')} x={24} y={226} w={512}>
          <Label>A con un byte cambiado</Label>
        </Reveal>
        <Reveal frame={frame} at={at('s02-02') + 12} x={24} y={266} w={512}>
          <HashBar frame={frame} at={at('s02-02') + 12} seed={3} alt={11} altAt={flip} tone={C.cyan} />
        </Reveal>
        <Reveal frame={frame} at={flip + 40} x={24} y={338} w={512}>
          <Pill icon="alert" tone="amber" size={28}>toda la huella cambia</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s02-02', 'Otro') - 6} x={24} y={414} w={512}>
          <Pill icon="split" tone="muted" size={28}>otro hash, no otra familia</Pill>
        </Reveal>
      </ColPanel>

      {/* 2 · imphash */}
      <ColPanel frame={frame} at={p2} x={PW + GAP} w={PW} h={560} tone="sky" icon="plug" title="Imphash" sub="imports normalizados" dim={d2}>
        <Reveal frame={frame} at={w('s02-03', 'funciones')} x={24} y={22} w={512}>
          <Label>Programa 1 · usa bibliotecas</Label>
        </Reveal>
        <Reveal frame={frame} at={w('s02-03', 'funciones') + 6} x={24} y={62} w={512}>
          <Imports frame={frame} at={w('s02-03', 'funciones') + 6} />
        </Reveal>
        <Reveal frame={frame} at={w('s02-03', 'imphash') - 4} x={24} y={150} w={512}>
          <Label>Programa 2 · otro programa</Label>
        </Reveal>
        <Reveal frame={frame} at={w('s02-03', 'imphash')} x={24} y={190} w={512}>
          <Imports frame={frame} at={w('s02-03', 'imphash')} />
        </Reveal>
        <Reveal frame={frame} at={w('s02-03', 'comparten') - 20} x={24} y={278} w={512}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <HashBar frame={frame} at={w('s02-03', 'comparten') - 20} seed={7} tone={C.sky} cells={6} />
            <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: '#7dd3fc' }}>mismo imphash</span>
          </div>
        </Reveal>
        <Reveal frame={frame} at={at('s02-04')} x={24} y={366} w={512}>
          <Pill icon="x" tone="amber" size={28}>no prueba el mismo compilador</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s02-04', 'Programas')} x={24} y={436} w={512}>
          <Pill icon="users" tone="amber" size={28}>sin relación, también coinciden</Pill>
        </Reveal>
      </ColPanel>

      {/* 3 · fuzzy hash */}
      <ColPanel frame={frame} at={p3} x={2 * (PW + GAP)} w={PW - 0} h={560} tone="emerald" icon="layers" title="Hashing difuso" sub="ssdeep · busca parecidos" dim={0}>
        <Reveal frame={frame} at={w('s02-05', 'parecidos')} x={24} y={22} w={512}>
          <Label>Archivo A</Label>
        </Reveal>
        <Reveal frame={frame} at={w('s02-05', 'parecidos') + 6} x={24} y={62} w={512}>
          <HashBar frame={frame} at={w('s02-05', 'parecidos') + 6} seed={3} tone={C.emerald} />
        </Reveal>
        <Reveal frame={frame} at={w('s02-05', 'exacta')} x={24} y={132} w={512}>
          <Label>Archivo parecido</Label>
        </Reveal>
        <Reveal frame={frame} at={w('s02-05', 'exacta') + 6} x={24} y={172} w={512}>
          <HashBar frame={frame} at={w('s02-05', 'exacta') + 6} seed={3} alt={19} altAt={w('s02-05', 'difuso')} step={5} only={[2, 6, 9]} tone={C.emerald} />
        </Reveal>
        <Reveal frame={frame} at={w('s02-05', 'Ssdeep') - 6} x={24} y={246} w={512}>
          <Pill icon="search" tone="emerald" size={28}>parecido, no huella exacta</Pill>
        </Reveal>
        <Reveal frame={frame} at={at('s02-06')} x={24} y={316} w={512}>
          <Pill icon="x" tone="amber" size={28}>sin probabilidad de parentesco</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s02-06', 'biblioteca')} x={24} y={386} w={512}>
          <Pill icon="plug" tone="sky" size={28}>una biblioteca explica parte</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s02-06', 'contexto') - 6} x={24} y={456} w={512}>
          <Pill icon="eye" tone="cyan" size={28}>hace falta contexto</Pill>
        </Reveal>
      </ColPanel>
      <LearningCard frame={frame} at={cardAt} text="Hash exacto identifica bytes; similitud genera candidatos" />
    </Stage>
  );
}
