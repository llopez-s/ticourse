import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { LearningCard, Pill, Reveal, Tag } from './parts/bits';
import { Sym } from './parts/feeds';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's02-caso';
const COLS = { id: 100, fuente: 380, dato: 420, cob: 780 };

function Cell({ w, h, children, dashed = false, tone = C.ink700 }: { w: number; h: number; children?: ReactNode; dashed?: boolean; tone?: string }) {
  return (
    <div style={{ boxSizing: 'border-box', width: w, height: h, display: 'flex', alignItems: 'center', padding: '0 20px', border: `2px ${dashed ? 'dashed' : 'solid'} ${tone}`, borderRadius: RADIUS.sm, background: C.ink850, fontFamily: FONT.sans }}>{children}</div>
  );
}

/**
 * s02-caso «Primero la pregunta». R1 and R2 come in as the voice says «primera» and «segunda» (R2 reads the 90-day
 * history); years of history are drawn as late for R1. At `s02-b` the source/data/coverage matrix opens with the
 * four coverage chips said in order, at `s02-c` the existing baseline, then the closing pills and the learning card.
 */
export function S02Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const matrix = props.cue('s02-b');
  const base = props.cue('s02-c');
  const cardAt = audioEnd(S, 's02-06') + 6;
  const hist = at('s02-02');
  const head = progress(frame, matrix, 16);

  return (
    <Stage>
      <Reveal frame={frame} at={w('s02-01', 'primera') - 8} x={0} y={0} w={840}>
        <div style={{ boxSizing: 'border-box', height: 150, display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyan, 0.07), fontFamily: FONT.sans }}>
          <span style={{ fontSize: 60, fontWeight: 850, color: C.cyan }}>R1</span>
          <div>
            <div style={{ fontSize: 34, fontWeight: 750, lineHeight: 1.15, color: C.textStrong }}>Indicios sectoriales de cuentas expuestas</div>
            <div style={{ marginTop: 8 }}><Tag tone="cyan" size={28}>en menos de 24 h</Tag></div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s02-01', 'segunda') - 8} x={888} y={0} w={840}>
        <div style={{ boxSizing: 'border-box', height: 150, display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.sky, 0.7)}`, background: alpha(C.sky, 0.07), fontFamily: FONT.sans }}>
          <span style={{ fontSize: 60, fontWeight: 850, color: C.sky }}>R2</span>
          <div>
            <div style={{ fontSize: 34, fontWeight: 750, lineHeight: 1.15, color: C.textStrong }}>Infraestructura, mirando atrás</div>
            <div style={{ marginTop: 8 }}><Tag tone="sky" size={28}>retrospectivo · 90 días</Tag></div>
          </div>
        </div>
      </Reveal>

      <Reveal frame={frame} at={hist} outAt={matrix - 8} x={0} y={200} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Pill icon="archive" tone="sky" size={34}>años de historial</Pill>
          <Reveal frame={frame} at={w('s02-02', 'tarde')} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="clock" tone="amber" size={34}>llega tarde para una decisión urgente</Pill>
          </Reveal>
        </div>
      </Reveal>

      {head > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 190, opacity: head }}>
          <div style={{ display: 'flex', gap: 10, fontFamily: FONT.sans, fontSize: 26, fontWeight: 700, letterSpacing: 1.5, color: C.faint, textTransform: 'uppercase', marginBottom: 8 }}>
            <span style={{ width: COLS.id }}>Req.</span>
            <span style={{ width: COLS.fuente }}>Fuente</span>
            <span style={{ width: COLS.dato }}>Dato</span>
            <span style={{ width: COLS.cob }}>Cobertura</span>
          </div>
        </div>
      ) : null}
      {[{ id: 'R1', tone: C.cyan, dato: 'cuentas expuestas', y: 232 }, { id: 'R2', tone: C.sky, dato: 'infraestructura', y: 322 }].map((row, i) => (
        <Reveal key={row.id} frame={frame} at={matrix + 10 + i * 12} x={0} y={row.y}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Cell w={COLS.id} h={80} tone={alpha(row.tone, 0.7)}><span style={{ fontSize: 36, fontWeight: 850, color: row.tone }}>{row.id}</span></Cell>
            <Cell w={COLS.fuente} h={80} dashed><span style={{ fontSize: 30, fontWeight: 650, color: C.muted }}>¿Faro, Atlas o Eco?</span></Cell>
            <Cell w={COLS.dato} h={80}><span style={{ fontSize: 32, fontWeight: 700, color: C.text }}>{row.dato}</span></Cell>
            <div style={{ width: COLS.cob }} />
          </div>
        </Reveal>
      ))}
      <Reveal frame={frame} at={matrix + 10} x={COLS.id + COLS.fuente + COLS.dato + 30} y={232} w={COLS.cob}>
        <div style={{ boxSizing: 'border-box', height: 170, padding: '14px 20px', borderRadius: RADIUS.sm, border: `2px solid ${C.ink700}`, background: C.ink850, display: 'flex', flexWrap: 'wrap', gap: 12, alignContent: 'flex-start' }}>
          {(['sector', 'regiones', 'plataformas', 'tipos'] as const).map((word) => (
            <Reveal key={word} frame={frame} at={w('s02-03', word) - 4} x={0} y={0} style={{ position: 'relative' }}>
              <Pill tone="cyan" size={30} icon="radar">{word === 'tipos' ? 'tipos de dato' : word}</Pill>
            </Reveal>
          ))}
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s02-04', 'catálogo')} x={0} y={424} w={1728}>
        <Pill icon="x" tone="amber" size={32}>un catálogo grande no responde a la pregunta</Pill>
      </Reveal>

      <Reveal frame={frame} at={base} x={0} y={492} w={1728}>
        <div style={{ boxSizing: 'border-box', height: 92, display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.sky, 0.6)}`, background: alpha(C.sky, 0.06), fontFamily: FONT.sans }}>
          <Icon name="archive" size={44} color={C.sky} />
          <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>Línea base</span>
          <Reveal frame={frame} at={w('s02-05', 'registros') - 4} x={0} y={0} style={{ position: 'relative' }}><Pill tone="sky" size={28}>registros internos</Pill></Reveal>
          <Reveal frame={frame} at={w('s02-05', 'intercambio') - 4} x={0} y={0} style={{ position: 'relative' }}><Pill tone="sky" size={28}>intercambio sectorial</Pill></Reveal>
          <Reveal frame={frame} at={w('s02-05', 'feeds') - 4} x={0} y={0} style={{ position: 'relative' }}><Pill tone="sky" size={28}>feeds actuales</Pill></Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s02-06')} x={0} y={600} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Pill icon="search" tone="cyan" size={30}>¿qué añade respecto a la base?</Pill>
          <Reveal frame={frame} at={w('s02-06', 'documentos') - 4} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="file" tone="muted" size={30}>más documentos <Sym kind="ne" size={32} /> más respuestas</Pill>
          </Reveal>
        </div>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Evalúa cada fuente contra un requisito concreto" />
    </Stage>
  );
}
