import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { InfoCard, Pill, Reveal, Tag } from './parts/bits';
import { LetterTile } from './parts/Ficha';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-caso';
const TOP = 190; // the intercepted-message card owns the first 170 px until s07-01 ends
const ROW = 52;

function Row({ frame, at, label, value }: { frame: number; at: number; label: string; value: string }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ boxSizing: 'border-box', height: ROW, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', borderBottom: `2px solid ${C.ink700}`, opacity: p, transform: `translateX(${(1 - p) * -16}px)`, fontFamily: FONT.sans }}>
      <span style={{ width: 400, fontSize: 30, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{label}</span>
      <Tag tone="cyan" size={26}>{value}</Tag>
      <Icon name="check" size={38} color={C.emerald} strokeWidth={3} style={{ marginLeft: 'auto' }} />
    </div>
  );
}

function Hypothesis({ frame, at, title, sub, tone, fill }: { frame: number; at: number; title: string; sub: string; tone: string; fill: number }) {
  const p = progress(frame, at, 24);
  return (
    <div style={{ boxSizing: 'border-box', width: 768, height: 128, padding: '14px 24px', borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${alpha(tone, 0.5)}`, fontFamily: FONT.sans }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>{title}</span>
        <span style={{ fontSize: 26, fontWeight: 600, color: C.muted }}>{sub}</span>
      </div>
      <div style={{ marginTop: 16, height: 26, borderRadius: 13, background: C.ink700 }}>
        <div style={{ width: `${fill * p * 100}%`, height: 26, borderRadius: 13, background: tone }} />
      </div>
    </div>
  );
}

/**
 * s07-caso «El candidato que sí gana peso». Starts below the intercepted-message card. Left: the features B and A
 * share, one per word. Right, in turn: two reports of different origin, the two hypotheses weighed (shared code
 * leads, a public component stays open), the verdict (probable, moderate confidence) and the ladder of levels —
 * code reached, campaign and operator not demonstrated.
 */
export function S07Gana(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const hyp = at('s07-03');
  const verdict = at('s07-04');
  const ladder = at('s07-05');
  const last = at('s07-06');
  const dimTable = progress(frame, hyp - 6, 22);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: TOP, width: 900, opacity: 1 - 0.55 * dimTable }}>
        <Reveal frame={frame} at={w('s07-01', 'B') - 6} x={0} y={0} w={900}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <LetterTile letter="B" tone={C.emerald} size={64} />
            <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.textStrong }}>Candidato B, frente a la muestra A</span>
          </div>
        </Reveal>
        <div style={{ position: 'absolute', left: 0, top: 84, width: 900, borderRadius: RADIUS.md, border: `2px solid ${alpha(C.emerald, 0.45)}`, background: C.ink900, overflow: 'hidden', opacity: progress(frame, w('s07-01', 'B') + 4, 14) }}>
          <Row frame={frame} at={w('s07-01', 'B') + 14} label="Imports" value="I1" />
          <Row frame={frame} at={w('s07-01', 'cadena') - 8} label="Cadena distintiva" value="DEMO-CFG-7" />
          <Row frame={frame} at={w('s07-01', 'estructura') - 8} label="Estructura de configuración" value="misma estructura" />
          <Row frame={frame} at={w('s07-01', 'secuencia') - 8} label="Secuencia de carga" value="concordante" />
          <Row frame={frame} at={w('s07-01', 'comportamiento') - 8} label="Comportamiento" value="concordante" />
        </div>
      </div>

      {/* two reports of different origin */}
      <Reveal frame={frame} at={at('s07-02')} outAt={hyp - 4} x={960} y={TOP} w={768}>
        <InfoCard icon="archive" title="Informe de origen 1" sub="observaciones de B" tone="sky" w={768} h={104} titleSize={36} />
      </Reveal>
      <Reveal frame={frame} at={w('s07-02', 'origen') + 10} outAt={hyp - 4} x={960} y={TOP + 124} w={768}>
        <InfoCard icon="globe" title="Informe de origen 2" sub="otra fuente, otras observaciones" tone="cyan" w={768} h={104} titleSize={36} />
      </Reveal>
      <Reveal frame={frame} at={w('s07-02', 'contrastar') - 8} outAt={hyp - 4} x={960} y={TOP + 252} w={768}>
        <Pill icon="split" tone="emerald" size={30}>puedes contrastarlas entre sí</Pill>
      </Reveal>

      {/* hypotheses */}
      <Reveal frame={frame} at={hyp} outAt={verdict - 8} x={960} y={TOP} w={768}>
        <Hypothesis frame={frame} at={w('s07-03', 'hipótesis')} title="Código compartido" sub="B lo sostiene mejor" tone={C.emerald} fill={0.78} />
      </Reveal>
      <Reveal frame={frame} at={w('s07-03', 'reutilizado') - 20} outAt={verdict - 8} x={960} y={TOP + 144} w={768}>
        <Hypothesis frame={frame} at={w('s07-03', 'reutilizado') - 10} title="Componente público" sub="sigue siendo posible" tone={C.amber} fill={0.4} />
      </Reveal>
      <Reveal frame={frame} at={w('s07-03', 'independientes') - 10} outAt={verdict - 8} x={960} y={TOP + 292} w={768}>
        <Pill icon="search" tone="sky" size={30}>¿las fuentes son independientes?</Pill>
      </Reveal>

      {/* verdict */}
      <Reveal frame={frame} at={verdict} x={960} y={TOP} w={768}>
        <InfoCard icon="check" title="Relacionado probable" sub="confianza moderada, dentro de ese alcance" tone="emerald" w={768} h={116} titleSize={40} subSize={28} lit={progress(frame, verdict, 14) * (1 - progress(frame, ladder, 14))} />
      </Reveal>

      {/* the ladder of levels */}
      {[
        ['lock', 'Campaña', 'no demostrado', w('s07-05', 'campaña'), TOP + 170, C.muted],
        ['lock', 'Operador', 'no demostrado', w('s07-05', 'operador.'), TOP + 268, C.muted],
        ['file', 'Código', 'lo que B sostiene', w('s07-05', 'Código,'), TOP + 366, C.emerald],
      ].map(([icon, title, sub, f, y, tone], i) => {
        const dimmed = i < 2 ? progress(frame, last + 10, 14) * 0.5 : 0;
        return (
          <Reveal key={title as string} frame={frame} at={(f as number) - 8} x={960} y={y as number} w={768}>
            <InfoCard icon={icon as IconName} title={title as string} sub={sub as string} tone={tone as string} w={768} h={84} titleSize={32} subSize={26} dim={dimmed} lit={i === 2 ? progress(frame, last + 40, 14) : 0} />
          </Reveal>
        );
      })}
      <Reveal frame={frame} at={w('s07-05', 'niveles')} outAt={last - 4} x={0} y={TOP + 372} w={900}>
        <Pill icon="layers" tone="amber" size={30}>código, actividad y autoría: niveles distintos</Pill>
      </Reveal>
      <Reveal frame={frame} at={last} x={0} y={TOP + 372} w={900}>
        <Pill icon="flag" tone="emerald" size={30}>tu conclusión nombra el nivel que permite la evidencia</Pill>
      </Reveal>
    </Stage>
  );
}
