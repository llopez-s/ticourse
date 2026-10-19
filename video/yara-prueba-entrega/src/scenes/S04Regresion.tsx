import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Choices, LearningCard, Mark, Pill, Reveal, Tag } from './parts/bits';
import { Stage, audioEnd, wordFrame } from './kit';

const S = 's04-caso';
const TOP = 180; // the engine's pause card owns the first 170 px of the stage

function RuleCard({ frame, verdictAt, title, formula, good, verdict }: { frame: number; verdictAt: number; title: string; formula: string; good: boolean; verdict: string }) {
  const tone = good ? C.emerald : C.rose;
  const v = progress(frame, verdictAt, 14);
  return (
    <div style={{ boxSizing: 'border-box', width: 840, height: 140, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${alpha(tone, 0.25 + 0.6 * v)}`, boxShadow: v > 0 ? `0 0 ${16 + 20 * v}px ${alpha(tone, 0.25 * v)}` : 'none', fontFamily: FONT.sans }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, lineHeight: 1.12 }}>{title}</div>
        <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{formula}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: v, transform: `scale(${0.9 + 0.1 * v})`, transformOrigin: 'right center' }}>
        <Mark kind={good ? 'yes' : 'no'} size={52} color={tone} />
        <span style={{ fontSize: 32, fontWeight: 800, color: good ? '#6ee7b7' : '#fda4af', whiteSpace: 'nowrap' }}>{verdict}</span>
      </div>
    </div>
  );
}

function Cells({ frame, at, n, tone }: { frame: number; at: number; n: number; tone: string }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ width: 40, height: 44, borderRadius: 8, background: alpha(tone, 0.22), border: `2px solid ${alpha(tone, 0.8)}`, opacity: progress(frame, at + i * 3, 10) }} />
      ))}
    </div>
  );
}

/**
 * s04-caso «Volver al ejemplo conocido». File C (the route changes, marker and hex stay) at the top. The two
 * options enter with the question and keep no answer colour through the pause; at the reveal «puede perder una
 * variante» lights, and two rule cards take over: «exigir todo» fails C, the reference (marker and route-or-hex)
 * covers it. Then regression vs. new variants, overfitting vs. generalisation, and the 6 / 5 / 1 partition of the
 * public package with its caveat. Learning card at the end.
 */
export function S04Regresion(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s04-b');
  const cardAt = audioEnd(S, 's04-06') + 6;
  const tPart = w('s04-06', 'públicos') - 8;
  const tAsk = w('s04-02', 'exiges') - 8;
  const slotY = TOP + 242;

  return (
    <Stage>
      {/* the known example */}
      <Reveal frame={frame} at={w('s04-01', 'C') - 6} x={0} y={TOP}>
        <Tag tone={C.cyan} size={44} solid>C</Tag>
      </Reveal>
      <Reveal frame={frame} at={w('s04-01', 'ruta') - 8} x={90} y={TOP}>
        <Pill icon="split" tone="amber" size={30}>ruta: cambia</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s04-01', 'conserva') - 8} x={380} y={TOP}>
        <Pill icon="check" tone="emerald" size={30}>marcador: igual</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s04-01', 'conserva') + 14} x={730} y={TOP}>
        <Pill icon="check" tone="emerald" size={30}>hex: igual</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s04-01', 'usamos') - 6} x={1010} y={TOP}>
        <Pill icon="clock" tone="sky" size={30}>ya lo usamos al diseñar</Pill>
      </Reveal>

      {/* decision: no answer colour until the pause ends */}
      <Reveal frame={frame} at={tAsk} outAt={reveal + 30} x={0} y={TOP + 82} w={1728}>
        <Choices frame={frame} at={tAsk} revealAt={reveal} labels={['Sí, más condiciones siempre ayuda', 'No, puede perder una variante']} answer={1} />
      </Reveal>

      {/* what the solution looks like on C */}
      <Reveal frame={frame} at={reveal + 40} x={0} y={TOP + 82}>
        <RuleCard frame={frame} verdictAt={w('s04-03', 'perderla') + 36} title="Exigir todo" formula="marcador and ruta" good={false} verdict="C no coincide" />
      </Reveal>
      <Reveal frame={frame} at={w('s04-03', 'Volver') - 6} x={888} y={TOP + 82}>
        <RuleCard frame={frame} verdictAt={w('s04-03', 'conocido') - 4} title="Referencia" formula="marcador and (ruta or hex)" good verdict="C coincide" />
      </Reveal>

      {/* regression, then what it does not show */}
      <Reveal frame={frame} at={w('s04-03', 'regresión') - 8} outAt={tPart - 6} x={0} y={slotY}>
        <Pill icon="clock" tone="sky" size={30}>prueba de regresión · ejemplo conocido</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s04-04', 'demuestra') - 8} outAt={tPart - 6} x={690} y={slotY}>
        <Pill icon="x" tone="amber" size={30}>no demuestra variantes nuevas</Pill>
      </Reveal>
      <Reveal frame={frame} at={tPart} x={0} y={slotY}>
        <Pill icon="archive" tone="muted" size={30}>públicos y sintéticos: enseñan el método</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s04-06', 'demostrar') - 8} x={760} y={slotY}>
        <Pill icon="x" tone="rose" size={30}>no prueban cobertura de malware real</Pill>
      </Reveal>

      <Reveal frame={frame} at={w('s04-05', 'sobreajuste') - 14} x={0} y={slotY + 72}>
        <Pill icon="alert" tone="amber" size={30}>sobreajuste: memorizar ejemplos</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s04-05', 'generalización') - 8} x={620} y={slotY + 72}>
        <Pill icon="target" tone="emerald" size={30}>generalización: casos nuevos</Pill>
      </Reveal>

      {/* the package partition */}
      <Reveal frame={frame} at={tPart + 20} x={0} y={slotY + 152} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tag tone={C.cyan} size={26}>training · 6</Tag>
            <Cells frame={frame} at={tPart + 24} n={6} tone={C.cyan} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tag tone={C.sky} size={26}>held-out · 5</Tag>
            <Cells frame={frame} at={tPart + 44} n={5} tone={C.sky} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tag tone={C.rose} size={26}>challenge · 1</Tag>
            <Cells frame={frame} at={tPart + 60} n={1} tone={C.rose} />
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={tPart + 20} x={1130} y={slotY + 72} w={598}>
        <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>los nombres no garantizan independencia</span>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Una regla más restrictiva puede perder variantes" />
    </Stage>
  );
}
