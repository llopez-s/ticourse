import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Icon } from '../../../engine/src/ui/Icon';
import { Pill, Reveal, Tag, FEED_IDS, type FeedId } from './parts/bits';
import { FeedName, Meter } from './parts/feeds';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-caso';
const NAME_W = 280;
const ROW_H = 104;
const HEAD_H = 56;
const TABLE_Y = 92;

/** Figures of the fictitious 30-day pilot, as in the collection lesson (src/data/practical/collection.ts). */
const R1: Record<FeedId, { useful: number; inc: number; unk: number }> = {
  faro: { useful: 60, inc: 40, unk: 10 },
  atlas: { useful: 90, inc: 3, unk: 0 },
  eco: { useful: 80, inc: 1, unk: 5 },
};
const R2: Record<FeedId, { useful: number; inc: number }> = {
  faro: { useful: 10, inc: 2 },
  atlas: { useful: 70, inc: 45 },
  eco: { useful: 50, inc: 1 },
};

interface ColDef {
  title: string;
  w: number;
  at: number;
  dim: number;
}

function Num({ n, of, color, size = 56 }: { n: number; of?: number; color: string; size?: number }) {
  return (
    <span style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 850, color, lineHeight: 1 }}>
      {n}
      {of ? <span style={{ fontSize: 30, fontWeight: 650, color: C.faint }}> /{of}</span> : null}
    </span>
  );
}

/**
 * One results table (a requirement is always in the header — never a ranking without it). A column enters at a
 * time; `dims` steps whole columns back, `rowLit` glows a row's cell in the column named by `litCol`.
 */
function ResultTable({ frame, cols, cell, rowAt, rowLit, litCol, outAt }: { frame: number; cols: ColDef[]; cell: (id: FeedId, col: number, lit: number) => ReactNode; rowAt: number; rowLit: number[]; litCol: number; outAt?: number }) {
  const out = outAt === undefined ? 0 : progress(frame, outAt, 12);
  let x = NAME_W;
  return (
    <div style={{ position: 'absolute', left: 0, top: TABLE_Y, opacity: 1 - out }}>
      {FEED_IDS.map((id, i) => {
        const p = progress(frame, rowAt + i * 10, 16);
        return (
          <div key={id} style={{ position: 'absolute', left: 0, top: HEAD_H + i * ROW_H, height: ROW_H, display: 'flex', alignItems: 'center', opacity: p }}>
            <FeedName id={id} size={36} />
          </div>
        );
      })}
      {cols.map((col, c) => {
        const left = x;
        x += col.w;
        const p = progress(frame, col.at, 16);
        return (
          <div key={col.title} style={{ position: 'absolute', left, top: 0, width: col.w, opacity: p * (1 - 0.62 * col.dim), transform: `translateY(${(1 - p) * 12}px)` }}>
            <div style={{ height: HEAD_H, display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: FONT.sans, fontSize: 28, fontWeight: 750, letterSpacing: 1.5, color: C.muted, textTransform: 'uppercase' }}>{col.title}</div>
            {FEED_IDS.map((id, i) => {
              const lit = c === litCol ? rowLit[i] : 0;
              return (
                <div key={id} style={{ boxSizing: 'border-box', height: ROW_H - 8, margin: '4px 6px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 20, borderRadius: RADIUS.md, background: alpha(C.emerald, 0.04 + 0.14 * lit), border: `2px solid ${lit > 0 ? alpha(C.emerald, 0.35 + 0.55 * lit) : C.ink700}` }}>
                  {cell(id, c, lit)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * s05-caso «Abrimos los resultados». The R1 table opens one column at a time as the voice names them (útiles,
 * incremental, desconocidos); at `s05-b` the incremental column takes over and the rows light as Faro, Atlas and
 * Eco are read, then Atlas's useful-but-already-known 90. At `s05-c` the table is replaced by R2 and Atlas lights;
 * the closing pill says no provider wins both requirements.
 */
export function S05Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const r2At = props.cue('s05-c');
  const incAt = w('s05-02', 'incremental');
  const focusFrom = props.cue('s05-b');

  const lit3 = [
    windowWeight(frame, w('s05-03', 'Faro'), w('s05-03', 'Atlas')),
    windowWeight(frame, w('s05-03', 'Atlas'), w('s05-03', 'Eco')),
    windowWeight(frame, w('s05-03', 'Eco'), at('s05-04')),
  ];
  const unkDim = progress(frame, focusFrom - 4, 16);
  const usefulDim = progress(frame, focusFrom - 4, 16) * (1 - progress(frame, at('s05-04') - 4, 16));
  const atlasUseful = windowWeight(frame, at('s05-04'), r2At - 12);
  const r2Lit = windowWeight(frame, w('s05-05', 'Atlas'), at('s05-06'));

  const cols1: ColDef[] = [
    { title: 'Útiles', w: 500, at: w('s05-02', 'útiles') - 6, dim: usefulDim },
    { title: 'Incrementales', w: 600, at: incAt - 6, dim: 0 },
    { title: 'Desconocidos', w: 340, at: w('s05-02', 'desconocidos') - 6, dim: unkDim },
  ];
  const cols2: ColDef[] = [
    { title: 'Útiles', w: 560, at: r2At + 20, dim: 0.0 },
    { title: 'Incrementales', w: 680, at: r2At + 40, dim: 0 },
  ];

  const cell1 = (id: FeedId, c: number, lit: number) => {
    const d = R1[id];
    if (c === 0) return (<><Num n={d.useful} of={100} color={C.text} /><Meter value={d.useful} max={100} w={200} tone="sky" /></>);
    if (c === 1) return (<><Num n={d.inc} color={d.inc >= 20 ? C.emerald : lit > 0 ? C.textStrong : C.muted} size={56 + 8 * lit} /><Meter value={d.inc} max={100} w={260} tone="emerald" ghost={d.useful} /></>);
    return d.unk > 0 ? (<><Num n={d.unk} color={C.amber} /><Icon name="search" size={36} color={C.amber} /></>) : (<Num n={0} color={C.faint} />);
  };
  const cell2 = (id: FeedId, c: number) => {
    const d = R2[id];
    const f = id === 'atlas' ? 1 : 1 - 0.45 * r2Lit;
    return c === 0 ? (<div style={{ opacity: f, display: 'flex', alignItems: 'center', gap: 20 }}><Num n={d.useful} of={100} color={C.text} /><Meter value={d.useful} max={100} w={230} tone="sky" /></div>)
      : (<div style={{ opacity: f, display: 'flex', alignItems: 'center', gap: 20 }}><Num n={d.inc} color={id === 'atlas' ? C.emerald : C.muted} size={id === 'atlas' ? 56 + 8 * r2Lit : 56} /><Meter value={d.inc} max={100} w={280} tone="emerald" ghost={d.useful} /></div>);
  };

  return (
    <Stage>
      <Reveal frame={frame} at={at('s05-01') - 4} outAt={r2At - 10} x={0} y={0} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Tag tone="cyan" size={34}>R1 · cuentas expuestas</Tag>
          <Reveal frame={frame} at={w('s05-01', 'mismo') - 4} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="clock" tone="muted" size={30}>piloto ficticio · 30 días</Pill>
          </Reveal>
          <Reveal frame={frame} at={w('s05-01', 'cien') - 4} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="search" tone="muted" size={30}>100 revisados por feed</Pill>
          </Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={r2At} x={0} y={0} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Tag tone="sky" size={34}>R2 · infraestructura histórica</Tag>
          <Pill icon="clock" tone="muted" size={30}>mismo piloto · 100 revisados por feed</Pill>
        </div>
      </Reveal>

      <ResultTable frame={frame} cols={cols1} cell={cell1} rowAt={at('s05-01') + 30} rowLit={lit3} litCol={1} outAt={r2At - 14} />
      <ResultTable frame={frame} cols={cols2} cell={cell2} rowAt={r2At + 8} rowLit={[0, 0, 0]} litCol={-1} />

      <Reveal frame={frame} at={at('s05-04')} outAt={r2At - 14} x={0} y={480} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: 0.4 + 0.6 * atlasUseful }}>
          <FeedName id="atlas" size={30} />
          <Pill icon="alert" tone="amber" size={32}>muchos útiles, casi todos ya estaban disponibles</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s05-06')} x={0} y={480} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="split" tone="cyan" size={34}>ningún ganador para todo</Pill>
          <Pill icon="target" tone="muted" size={32}>aportaciones distintas, requisitos distintos</Pill>
        </div>
      </Reveal>
    </Stage>
  );
}
