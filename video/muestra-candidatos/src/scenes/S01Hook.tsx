import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { InfoCard, Pill, Reveal } from './parts/bits';
import { Ficha } from './parts/Ficha';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-hook';

const FLOW: { icon: IconName; label: string }[] = [
  { icon: 'file', label: 'Muestra' },
  { icon: 'eye', label: 'Observaciones' },
  { icon: 'brain', label: 'Hipótesis' },
  { icon: 'search', label: 'Pivotes' },
  { icon: 'users', label: 'Candidatos' },
  { icon: 'shield', label: 'Corroboración' },
  { icon: 'flag', label: 'Conclusión' },
];

function FileTile({ frame, at, outAt, x, label }: { frame: number; at: number; outAt: number; x: number; label: string }) {
  return (
    <Reveal frame={frame} at={at} outAt={outAt} x={x} y={104} w={170}>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 8, fontFamily: FONT.sans }}>
        <div style={{ width: 120, height: 120, borderRadius: RADIUS.md, display: 'grid', placeItems: 'center', background: C.ink850, border: `2px solid ${alpha(C.cyan, 0.5)}` }}>
          <Icon name="file" size={68} color={C.cyan} />
        </div>
        <span style={{ fontSize: 28, fontWeight: 650, color: C.muted }}>{label}</span>
      </div>
    </Reveal>
  );
}

/**
 * s01-hook «El parecido no termina el caso». Headline at the `title` cue. Two files that look alike, then the
 * exercise pills (invented fichas, Meridian, nothing downloaded or run), sample A and its observations, the pivot
 * to candidates B–E, and finally the seven-step flow that closes the promise: explain the relation, the
 * confidence and what is still unchecked.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const title = props.cue('title');
  const flowAt = at('s01-05');
  const pivot = w('s01-04', 'pivotar');
  const cands = w('s01-04', 'candidatos');
  const obs = w('s01-03', 'observaciones') - 10;
  const lineP = progress(frame, pivot, 24);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, opacity: progress(frame, title, 18), transform: `translateY(${(1 - progress(frame, title, 18)) * 18}px)`, fontFamily: FONT.sans, fontSize: 66, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        El parecido <span style={{ color: C.cyan }}>no termina el caso</span>
      </div>

      {/* two files that look alike */}
      <FileTile frame={frame} at={w('s01-01', 'archivos') - 8} outAt={at('s01-02') - 8} x={0} label="archivo 1" />
      <FileTile frame={frame} at={w('s01-01', 'archivos') + 10} outAt={at('s01-02') - 8} x={380} label="archivo 2" />
      <Reveal frame={frame} at={w('s01-01', 'parecen')} outAt={at('s01-02') - 8} x={178} y={140}>
        <Pill tone="amber" size={30}>se parecen</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s01-01', 'familia')} outAt={at('s01-02') - 8} x={650} y={118}>
        <div style={{ fontFamily: FONT.sans, fontSize: 60, fontWeight: 800, color: C.cyan }}>¿misma familia?</div>
      </Reveal>

      {/* the exercise */}
      <Reveal frame={frame} at={w('s01-02', 'inventadas') - 14} outAt={flowAt - 6} x={0} y={96}>
        <Pill icon="archive" tone="muted" size={30}>fichas inventadas</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s01-02', 'Meridian,') - 8} outAt={flowAt - 6} x={370} y={96}>
        <Pill icon="flag" tone="sky" size={30}>Meridian · empresa aeroespacial</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s01-02', 'descargar') - 12} outAt={flowAt - 6} x={1010} y={96}>
        <Pill icon="eyeOff" tone="emerald" size={30}>sin descargar ni ejecutar malware</Pill>
      </Reveal>

      {/* sample A and what we have of it */}
      <Reveal frame={frame} at={w('s01-02', 'muestra') - 6} outAt={flowAt} x={0} y={210}>
        <Ficha letter="A" tone={C.cyan} title="Muestra A" sub="muestra inicial" w={400} h={116} lit={progress(frame, w('s01-02', 'muestra'), 14) * (1 - progress(frame, obs, 14))} />
      </Reveal>
      <svg width={1728} height={340} style={{ position: 'absolute', left: 0, top: 200, opacity: 1 - progress(frame, flowAt, 12) }}>
        <line x1={408} y1={68} x2={408 + 34 * progress(frame, obs, 14)} y2={68} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
        <line x1={1274} y1={110} x2={1274 + 150 * lineP} y2={110} stroke={C.sky} strokeWidth={5} strokeLinecap="round" />
        {lineP > 0.92 ? <polygon points="1432,110 1410,99 1410,121" fill={C.sky} /> : null}
      </svg>
      {[
        { icon: 'plug', title: 'Imports', sub: 'I1' },
        { icon: 'search', title: 'Cadena', sub: 'DEMO-CFG-7' },
        { icon: 'file', title: 'Ruta PDB', sub: 'proyecto demo' },
        { icon: 'bolt', title: 'Conducta', sub: 'envío a laboratorio' },
      ].map((o, i) => (
        <Reveal key={o.title} frame={frame} at={obs + 12 + i * 12} outAt={flowAt} x={450 + (i % 2) * 412} y={210 + Math.floor(i / 2) * 116} w={400}>
          <InfoCard icon={o.icon as IconName} title={o.title} sub={o.sub} tone="cyan" w={400} h={100} titleSize={32} subSize={26} />
        </Reveal>
      ))}
      <Reveal frame={frame} at={pivot} outAt={flowAt} x={1274} y={150} w={150}>
        <span style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color: '#7dd3fc' }}>pivotar</span>
      </Reveal>
      {(['B', 'C', 'D', 'E'] as const).map((l, i) => (
        <Reveal key={l} frame={frame} at={cands + i * 10} outAt={flowAt} x={1440} y={210 + i * 84} w={288}>
          <Ficha letter={l} tone={C.muted} title="candidato" sub="sin contrastar" w={288} h={72} tile={52} titleSize={30} subSize={24} />
        </Reveal>
      ))}
      <Reveal frame={frame} at={w('s01-04', 'contrastarlos') - 20} outAt={flowAt} x={900} y={566} w={828}>
        <div style={{ textAlign: 'right' }}>
          <Pill icon="shield" tone="emerald" size={30}>después, contrastarlos</Pill>
        </div>
      </Reveal>

      {/* the whole path */}
      <svg width={1728} height={20} style={{ position: 'absolute', left: 0, top: 283 }}>
        <line x1={110} y1={10} x2={110 + 1508 * progress(frame, flowAt + 8, 150)} y2={10} stroke={alpha(C.cyan, 0.5)} strokeWidth={4} strokeLinecap="round" />
      </svg>
      {FLOW.map((n, i) => {
        const on = flowAt + 10 + i * 24;
        const p = progress(frame, on, 14);
        const last = i === FLOW.length - 1;
        const col = last ? C.emerald : C.cyan;
        return (
          <Reveal key={n.label} frame={frame} at={on} x={i * 247} y={218} w={225}>
            <div style={{ display: 'grid', justifyItems: 'center', gap: 12, fontFamily: FONT.sans }}>
              <div style={{ width: 150, height: 150, borderRadius: 75, display: 'grid', placeItems: 'center', background: alpha(col, 0.12), border: `3px solid ${alpha(col, 0.5 + 0.4 * p)}`, boxShadow: `0 0 ${24 * p}px ${alpha(col, 0.3)}` }}>
                <Icon name={n.icon} size={76} color={col} />
              </div>
              <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{n.label}</span>
            </div>
          </Reveal>
        );
      })}
      <Reveal frame={frame} at={w('s01-05', 'buscador')} outAt={w('s01-05', 'Termina') - 6} x={0} y={430} w={1728}>
        <div style={{ textAlign: 'center' }}>
          <Pill icon="x" tone="amber" size={32}>una lista de resultados no es el final</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s01-05', 'relación') - 6} x={0} y={446}>
        <Pill icon="link" tone="emerald" size={32}>qué relación sostienes</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s01-05', 'confianza') - 6} x={500} y={446}>
        <Pill icon="chart" tone="cyan" size={32}>con qué confianza</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s01-05', 'falta') - 6} x={960} y={446}>
        <Pill icon="search" tone="amber" size={32}>qué falta por comprobar</Pill>
      </Reveal>
    </Stage>
  );
}
