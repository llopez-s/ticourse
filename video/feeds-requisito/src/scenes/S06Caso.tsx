import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { LearningCard, Pill, Reveal, Tag, FEED_IDS, type FeedId } from './parts/bits';
import { FeedName, Sym } from './parts/feeds';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's06-caso';
const GRID_Y = 130;
const HEAD_H = 76;
const ROW_H = 100;
const NAME_W = 250;

function Val({ children, color = C.textStrong, size = 46 }: { children: ReactNode; color?: string; size?: number }) {
  return <span style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 850, color, lineHeight: 1 }}>{children}</span>;
}

/**
 * s06-caso «El precio que no sale en la licencia». The 20-square strip explains p95 (19 of 20 arrived within
 * that time); the cost table then fills one column per idea: p95 of R1 against the 24 h limit, completeness (the
 * strip turns into «a record missing its date and context»), licence, review hours (Eco's 18 lights amber) and
 * initial integration. The total-cost sum and the learning card close the scene. No p95 is shown for R2.
 */
export function S06Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const cardAt = audioEnd(S, 's06-07') + 6;
  const stripOut = at('s06-03') - 8;
  const fieldsOut = w('s06-05', 'porcentaje') - 10;

  const cols = [
    { title: 'p95 de entrega', sub: 'R1 · límite 24 h', w: 350, at: at('s06-02') - 6 },
    { title: 'Completitud', sub: 'campos completos', w: 270, at: at('s06-03') },
    { title: 'Licencia', sub: 'al mes', w: 240, at: w('s06-06', 'licencia') - 6 },
    { title: 'Triaje', sub: 'horas al mes', w: 270, at: w('s06-06', 'revisar') - 6 },
    { title: 'Integración', sub: 'inicial', w: 270, at: w('s06-07', 'integración') - 6 },
  ];
  const lefts = cols.map((_, i) => NAME_W + cols.slice(0, i).reduce((sum, c) => sum + c.w, 0));
  // value entry frames per column and feed
  const vAt: Record<FeedId, number>[] = [
    { faro: w('s06-02', 'ocho') - 4, atlas: w('s06-02', 'treinta') - 4, eco: w('s06-02', 'treinta') + 50 },
    { faro: cols[1].at + 8, atlas: cols[1].at + 26, eco: cols[1].at + 44 },
    { faro: cols[2].at + 8, atlas: cols[2].at + 26, eco: cols[2].at + 44 },
    { eco: w('s06-06', 'dieciocho') - 4, faro: w('s06-06', 'seis') - 4, atlas: w('s06-06', 'seis') + 24 },
    { faro: cols[4].at + 8, atlas: cols[4].at + 26, eco: cols[4].at + 44 },
  ];
  const cell = (c: number, id: FeedId): ReactNode => {
    const v = [
      { faro: '8 h', atlas: '36 h', eco: '12 h' },
      { faro: '95 %', atlas: '99 %', eco: '70 %' },
      { faro: '900 €', atlas: '600 €', eco: '200 €' },
      { faro: '6 h', atlas: '4 h', eco: '18 h' },
      { faro: '8 h', atlas: '4 h', eco: '2 h' },
    ][c][id];
    const warn = (c === 0 && id === 'atlas') || (c === 3 && id === 'eco');
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
        <Val color={warn ? C.amber : C.textStrong} size={warn ? 54 : 46}>{v}</Val>
        {c === 0 && id === 'atlas' ? <Tag tone="amber" size={26}>&gt; 24 h</Tag> : null}
      </span>
    );
  };

  return (
    <Stage>
      {/* p95 explained: 19 of 20 arrived within that time */}
      <Reveal frame={frame} at={at('s06-01') + 20} outAt={stripOut} x={0} y={10} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {Array.from({ length: 20 }, (_, i) => {
              const p = progress(frame, at('s06-01') + 40 + i * 6, 10);
              const last = i === 19;
              return <div key={i} style={{ width: 34, height: 52, borderRadius: 8, background: last ? 'transparent' : alpha(C.cyan, 0.85 * p + 0.1), border: `2px ${last ? 'dashed' : 'solid'} ${alpha(last ? C.muted : C.cyan, 0.7)}` }} />;
            })}
          </div>
          <Reveal frame={frame} at={w('s06-01', 'percentil') - 4} x={0} y={0} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Tag tone="cyan" size={34}>p95</Tag>
              <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>el 95 % llegó dentro de este tiempo</span>
            </div>
          </Reveal>
        </div>
      </Reveal>

      {/* what a complete record looks like */}
      <Reveal frame={frame} at={at('s06-03')} outAt={fieldsOut} x={0} y={10} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Pill icon="file" tone="cyan" size={32}>registro</Pill>
          <Reveal frame={frame} at={w('s06-04', 'dirección') - 6} x={0} y={0} style={{ position: 'relative' }}><Tag tone="cyan" size={32}>dirección</Tag></Reveal>
          <Reveal frame={frame} at={w('s06-04', 'fecha') - 6} x={0} y={0} style={{ position: 'relative' }}><Pill tone="amber" size={30} icon="x">sin fecha</Pill></Reveal>
          <Reveal frame={frame} at={w('s06-04', 'contexto') - 6} x={0} y={0} style={{ position: 'relative' }}><Pill tone="amber" size={30} icon="x">sin contexto</Pill></Reveal>
          <Reveal frame={frame} at={w('s06-04', 'trabajo') - 6} x={0} y={0} style={{ position: 'relative' }}><Pill tone="muted" size={30} icon="clock">más trabajo del que ahorra</Pill></Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={fieldsOut + 8} x={0} y={10} w={1728}>
        <Pill icon="alert" tone="amber" size={34}>% de campos completos <Sym kind="ne" size={34} /> cuánto del mundo descubrió</Pill>
      </Reveal>

      {/* the cost table */}
      <div style={{ position: 'absolute', left: 0, top: GRID_Y, width: 1728, height: HEAD_H + 3 * ROW_H }}>
        {FEED_IDS.map((id, i) => {
          const p = progress(frame, at('s06-02') - 14 + i * 8, 14);
          return (
            <div key={id} style={{ position: 'absolute', left: 0, top: HEAD_H + i * ROW_H, height: ROW_H, display: 'flex', alignItems: 'center', opacity: p }}>
              <FeedName id={id} size={36} />
            </div>
          );
        })}
        {cols.map((col, c) => {
          const p = progress(frame, col.at, 16);
          return (
            <div key={col.title} style={{ position: 'absolute', left: lefts[c], top: 0, width: col.w, opacity: p }}>
              <div style={{ height: HEAD_H, padding: '8px 22px 0', fontFamily: FONT.sans }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{col.title}</div>
                <div style={{ fontSize: 26, fontWeight: 560, color: C.faint }}>{col.sub}</div>
              </div>
            </div>
          );
        })}
        {cols.map((col, c) =>
          FEED_IDS.map((id, i) => {
            const p = progress(frame, vAt[c][id], 14);
            const warn = (c === 0 && id === 'atlas') || (c === 3 && id === 'eco');
            return (
              <div key={`${c}-${id}`} style={{ position: 'absolute', left: lefts[c] + 6, top: HEAD_H + i * ROW_H + 4, width: col.w - 12, height: ROW_H - 8, boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 22px', borderRadius: RADIUS.md, background: alpha(warn ? C.amber : C.ink600, warn ? 0.12 : 0.18), border: `2px solid ${warn ? alpha(C.amber, 0.7) : C.ink700}`, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
                {cell(c, id)}
              </div>
            );
          }),
        )}
      </div>

      {/* total cost */}
      <Reveal frame={frame} at={at('s06-07')} x={0} y={540} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Pill icon="database" tone="cyan" size={30}>licencia</Pill>
          {([['integración', 'integración'], ['mantenimiento', 'mantenimiento'], ['trabajo', 'trabajo del analista']] as const).map(([word, label]) => (
            <Reveal key={word} frame={frame} at={w('s06-07', word) - 8} x={0} y={0} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.muted }}>+</span>
                <Pill tone="cyan" size={30}>{label}</Pill>
              </div>
            </Reveal>
          ))}
          <Reveal frame={frame} at={w('s06-07', 'trabajo') + 40} x={0} y={0} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.muted }}>=</span>
              <Pill icon="chart" tone="emerald" size={30}>coste total</Pill>
            </div>
          </Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s06-07', 'barato')} x={0} y={606} w={1728}>
        <Pill icon="alert" tone="amber" size={30}>barato de licencia, caro de revisar</Pill>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Calidad, puntualidad y coste total importan" />
    </Stage>
  );
}
