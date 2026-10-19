import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { LearningCard, Pill, Reveal, Tag } from './parts/bits';
import { FeedName, Panel, PanelRow, Sym } from './parts/feeds';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's09-caso';

function Option({ icon, name, cond, tone }: { icon: IconName; name: string; cond: ReactNode; tone: string }) {
  return (
    <div style={{ boxSizing: 'border-box', height: 96, display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', borderRadius: RADIUS.md, border: `2px solid ${alpha(tone, 0.7)}`, background: alpha(tone, 0.08), fontFamily: FONT.sans }}>
      <Icon name={icon} size={46} color={tone} />
      <span style={{ width: 190, fontSize: 42, fontWeight: 850, color: C.textStrong }}>{name}</span>
      <span style={{ fontSize: 31, fontWeight: 600, color: C.text }}>{cond}</span>
    </div>
  );
}

/**
 * s09-caso «La renovación cambia de base». A timeline from the pilot month to a renewal with no fixed date; the
 * base grows (another source, same rights and times) and the feed's increment shrinks to «recalcular». At `s09-b`
 * the re-comparison checklist and the three outcomes (renovar, ajustar, cancelar) as the voice names them, then
 * integration already paid as history, not an obligation. At `s09-c` the written decision with a single citation
 * chain flagged, and finally what stays «sin evaluar». Learning card at the end.
 */
export function S09Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const options = props.cue('s09-b');
  const doc = props.cue('s09-c');
  const cardAt = audioEnd(S, 's09-07') + 6;
  const phase1Out = options - 10;
  const optionsOut = doc - 10;
  const line = progress(frame, at('s09-01'), 40);
  const futureAt = w('s09-01', 'año') - 10;
  const shrink = progress(frame, w('s09-02', 'cambia') - 6, 24);
  const shrink2 = progress(frame, w('s09-03', 'cobertura') - 6, 24);
  const barW = 760;
  const rel = 1 - 0.55 * shrink - 0.25 * shrink2;

  return (
    <Stage>
      {/* phase 1: from the pilot to a renewal with no fixed date */}
      <Reveal frame={frame} at={at('s09-01') - 4} outAt={phase1Out} x={0} y={0} w={1728}>
        <div style={{ position: 'relative', width: 1728, height: 150 }}>
          <svg width={1728} height={80} style={{ position: 'absolute', left: 0, top: 0 }}>
            <line x1={230} y1={36} x2={230 + 640 * line} y2={36} stroke={C.emerald} strokeWidth={6} strokeLinecap="round" />
            <line x1={870} y1={36} x2={870 + 630 * progress(frame, futureAt, 40)} y2={36} stroke={C.muted} strokeWidth={6} strokeLinecap="round" strokeDasharray="4 16" />
            <circle cx={220} cy={36} r={20} fill={C.emerald} />
            <circle cx={1500} cy={36} r={20} fill="none" stroke={C.muted} strokeWidth={5} strokeDasharray="6 7" opacity={progress(frame, futureAt + 20, 14)} />
          </svg>
          <div style={{ position: 'absolute', left: 40, top: 74, width: 360, textAlign: 'center', fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.textStrong }}>mes del piloto</div>
          <div style={{ position: 'absolute', left: 1280, top: 74, width: 440, textAlign: 'center', opacity: progress(frame, futureAt + 20, 14), fontFamily: FONT.sans }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>renovación futura</div>
            <div style={{ marginTop: 6 }}><Tag tone="muted" size={28}>sin fecha fija</Tag></div>
          </div>
        </div>
      </Reveal>

      <Reveal frame={frame} at={at('s09-02') - 4} outAt={phase1Out} x={0} y={190} w={760}>
        <Panel icon="archive" title="Base al piloto" tone="sky" w={760}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: '8px 0 6px' }}>
            <Pill tone="sky" size={28}>registros internos</Pill>
            <Pill tone="sky" size={28}>feeds actuales</Pill>
          </div>
        </Panel>
      </Reveal>
      <Reveal frame={frame} at={w('s09-02', 'otra') - 8} outAt={phase1Out} x={820} y={190} w={100}>
        <Sym kind="arrow" size={64} color={C.muted} />
      </Reveal>
      <Reveal frame={frame} at={w('s09-02', 'otra') - 8} outAt={phase1Out} x={968} y={190} w={760}>
        <Panel icon="archive" title="Base al renovar" tone="sky" w={760}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: '8px 0 6px' }}>
            <Pill tone="sky" size={28}>registros internos</Pill>
            <Pill tone="sky" size={28}>feeds actuales</Pill>
            <Pill icon="plug" tone="emerald" size={28}>+ otra fuente, mismos derechos</Pill>
            <Reveal frame={frame} at={w('s09-03', 'cobertura') - 8} x={0} y={0} style={{ position: 'relative' }}><Pill icon="x" tone="amber" size={28}>el proveedor pierde cobertura</Pill></Reveal>
            <Reveal frame={frame} at={w('s09-03', 'ruido') - 8} x={0} y={0} style={{ position: 'relative' }}><Pill icon="alert" tone="amber" size={28}>añade ruido</Pill></Reveal>
          </div>
        </Panel>
      </Reveal>
      <Reveal frame={frame} at={w('s09-02', 'incremento') - 8} outAt={phase1Out} x={0} y={566} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Tag tone="emerald" size={32}>incremento del feed</Tag>
          <div style={{ position: 'relative', width: barW, height: 34 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 17, border: `2px dashed ${alpha(C.muted, 0.7)}` }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: barW * rel, borderRadius: 17, background: C.emerald }} />
          </div>
          <Reveal frame={frame} at={w('s09-02', 'cambia') - 4} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="search" tone="amber" size={32}>hay que recalcularlo</Pill>
          </Reveal>
        </div>
      </Reveal>

      {/* phase 2: re-compare and choose */}
      <Reveal frame={frame} at={options} outAt={optionsOut} x={0} y={0} w={640}>
        <Panel icon="search" title="Repite la comparación" tone="cyan" w={640}>
          <PanelRow frame={frame} at={w('s09-04', 'base') - 6} icon="archive" label="con la base actual" />
          <PanelRow frame={frame} at={w('s09-04', 'calidad') - 6} icon="check" label="calidad" />
          <PanelRow frame={frame} at={w('s09-04', 'tiempos') - 6} icon="clock" label="tiempos" />
          <PanelRow frame={frame} at={w('s09-04', 'trabajo') - 6} icon="user" label="trabajo del equipo" />
        </Panel>
      </Reveal>
      <div style={{ position: 'absolute', left: 700, top: 0, width: 1028, display: 'grid', gap: 14 }}>
        <Reveal frame={frame} at={w('s09-04', 'renovar', 1) - 6} outAt={optionsOut} x={0} y={0} style={{ position: 'relative' }}>
          <Option icon="check" name="Renovar" cond="el incremento sigue demostrado" tone={C.emerald} />
        </Reveal>
        <Reveal frame={frame} at={w('s09-04', 'ajustar') - 6} outAt={optionsOut} x={0} y={0} style={{ position: 'relative' }}>
          <Option icon="gear" name="Ajustar" cond="aporta menos, o solo a un requisito" tone={C.sky} />
        </Reveal>
        <Reveal frame={frame} at={w('s09-04', 'cancelar') - 6} outAt={optionsOut} x={0} y={0} style={{ position: 'relative' }}>
          <Option icon="x" name="Cancelar" cond="ya no añade nada nuevo" tone={C.amber} />
        </Reveal>
      </div>
      <Reveal frame={frame} at={at('s09-05')} outAt={optionsOut} x={0} y={390} w={1728}>
        <div style={{ boxSizing: 'border-box', height: 104, display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.muted, 0.75)}`, fontFamily: FONT.sans }}>
          <Icon name="archive" size={48} color={C.muted} />
          <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>Integración ya pagada</span>
          <Pill tone="muted" size={30}>coste histórico</Pill>
          <Reveal frame={frame} at={w('s09-05', 'obliga') - 6} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="x" tone="amber" size={30}>no obliga a seguir pagando</Pill>
          </Reveal>
        </div>
      </Reveal>

      {/* what the record says */}
      <Reveal frame={frame} at={doc} x={0} y={0} w={900}>
        <Panel icon="file" title="Decisión de renovación, por escrito" tone="emerald" w={900}>
          <PanelRow frame={frame} at={w('s09-06', 'requisito') - 6} icon="target" tone="emerald" label="el requisito" />
          <PanelRow frame={frame} at={w('s09-06', 'resultados') - 6} icon="chart" tone="emerald" label="los resultados" />
          <PanelRow frame={frame} at={w('s09-06', 'limitaciones') - 6} icon="radar" tone="emerald" label="limitaciones de colección" />
          <PanelRow frame={frame} at={w('s09-06', 'cadena') - 6} icon="link" tone="amber" label="si hay una sola cadena de citas" />
        </Panel>
      </Reveal>
      <Reveal frame={frame} at={w('s09-06', 'cadena') - 6} x={960} y={70} w={768}>
        <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <FeedName id="faro" size={30} />
            <Sym kind="arrow" size={36} color={C.muted} />
            <FeedName id="atlas" size={30} />
            <Sym kind="arrow" size={36} color={C.muted} />
            <FeedName id="eco" size={30} />
          </div>
          <Pill icon="alert" tone="amber" size={32}>una sola cadena: dilo</Pill>
        </div>
      </Reveal>

      <Reveal frame={frame} at={at('s09-07')} x={0} y={420} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Pill icon="search" tone="muted" size={34}>afirmación que no puedes evaluar</Pill>
          <Sym kind="arrow" size={44} color={C.muted} />
          <div style={{ boxSizing: 'border-box', padding: '10px 26px', borderRadius: RADIUS.pill, border: `3px dashed ${alpha(C.muted, 0.85)}`, fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.text }}>sin evaluar</div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s09-07', 'verdadera') - 6} x={0} y={510} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Pill icon="x" tone="amber" size={32} strike>marcarla como verdadera</Pill>
          <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 600, color: C.muted }}>solo para que la tabla quede más bonita</span>
        </div>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Renueva por valor actual, no por lo que ya pagaste" />
    </Stage>
  );
}
