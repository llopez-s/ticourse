import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Mark, Pill, Reveal, Tag } from './parts/bits';
import { CASES, type RuleKey } from './parts/data';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-caso';
const CELL_W = 160;
const GRID_X = 420;
const ROW_H = 116;
const ROW_Y = (i: number) => 112 + i * (ROW_H + 10);
const NOTE_X = GRID_X + 6 * CELL_W + 24;

/** The six files the scene reads, in column order (A, B, C, then the three single-feature controls). */
const COLS = [CASES[0], CASES[1], CASES[2], CASES[3], CASES[4], CASES[5]];
const COL_TAG = ['A', 'B', 'C', 'ruta', 'marcador', 'hex'];

const RULES: { key: RuleKey; goal: string }[] = [
  { key: 'Sample', goal: 'objetivo: A' },
  { key: 'Family', goal: 'objetivo: A, B y C' },
  { key: 'Hunt', goal: 'objetivo: candidatos' },
];

/**
 * s05-caso «Tres reglas, tres trabajos». Grid of rule × file: columns carry the evaluation labels (variants A, B, C
 * and three single-feature controls), each rule row carries its own objective. Rows enter as the voice names them;
 * results fill row by row from the real reference run (Sample → A; Family → A, B, C; Hunt → those plus the three
 * controls, amber = needs review). Then the criteria (objective, requirements, results) replace the rule names as
 * the deciding factor, and the intended action splits investigate / block. Footer: corpus size and hash bar.
 */
export function S05Reglas(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const rowAt = [w('s05-01', 'muestra') - 10, w('s05-01', 'variantes') - 10, w('s05-01', 'candidatos') - 10];
  const fillAt = [w('s05-02', 'archivo'), w('s05-03', 'cubre'), w('s05-04', 'controles') - 40];
  const noteAt = [w('s05-02', 'pierde'), w('s05-03', 'dentro'), w('s05-04', 'necesitan')];
  const lit = [windowWeight(frame, at('s05-02'), at('s05-03')), windowWeight(frame, at('s05-03'), at('s05-04')), windowWeight(frame, at('s05-04'), at('s05-05'))];
  const nameFade = progress(frame, w('s05-05', 'nombre') - 4, 16);
  const crit = w('s05-05', 'objetivo');
  const act = w('s05-06', 'amplia');
  const notes = ['útil para A; pierde B y C', 'dentro del contrato sintético; no es una familia real', 'controles que necesitan revisión'];

  return (
    <Stage>
      {/* column heads */}
      <Reveal frame={frame} at={w('s05-01', 'regla') - 8} x={GRID_X} y={0} w={6 * CELL_W} distance={8}>
        <div style={{ display: 'flex', fontFamily: FONT.sans }}>
          {COL_TAG.map((t, i) => (
            <div key={t} style={{ width: CELL_W, display: 'flex', justifyContent: 'center' }}>
              <Tag tone={i < 3 ? C.cyan : C.amber} size={i < 3 ? 34 : 26} solid={i < 3}>{t}</Tag>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', marginTop: 10, fontFamily: FONT.sans, fontSize: 26, fontWeight: 700, color: C.muted }}>
          <div style={{ width: 3 * CELL_W, textAlign: 'center' }}>variantes del ejercicio</div>
          <div style={{ width: 3 * CELL_W, textAlign: 'center' }}>controles</div>
        </div>
      </Reveal>

      {RULES.map((r, i) => (
        <div key={r.key}>
          <Reveal frame={frame} at={rowAt[i]} x={0} y={ROW_Y(i)} w={1728} h={ROW_H}>
            <div style={{ position: 'relative', width: 1728, height: ROW_H, boxSizing: 'border-box', borderRadius: RADIUS.md, background: alpha(C.cyan, 0.08 * lit[i]), border: `2px solid ${alpha(C.cyan, 0.15 + 0.6 * lit[i])}`, fontFamily: FONT.sans }}>
              <div style={{ position: 'absolute', left: 22, top: 0, height: ROW_H, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, width: 380 }}>
                <div style={{ opacity: 1 - 0.55 * nameFade }}>
                  <Tag tone={C.cyan} size={34}>{r.key}</Tag>
                </div>
                <div style={{ fontSize: 28, fontWeight: 650, color: C.text }}>{r.goal}</div>
              </div>
              {COLS.map((c, k) => {
                const hit = c.hits.includes(r.key);
                const control = k >= 3;
                const cellAt = fillAt[i] + (hit ? k * 5 : 0);
                const p = progress(frame, cellAt, 12);
                return (
                  <div key={c.file} style={{ position: 'absolute', left: GRID_X + k * CELL_W - 0, top: 0, width: CELL_W, height: ROW_H, display: 'grid', placeItems: 'center' }}>
                    <div style={{ opacity: 0.35 + 0.65 * p }}>
                      <Mark kind={hit && p > 0.2 ? 'yes' : 'none'} size={60} color={hit ? (control ? C.amber : C.emerald) : undefined} />
                    </div>
                  </div>
                );
              })}
              <div style={{ position: 'absolute', left: NOTE_X - 0, top: 0, width: 1728 - NOTE_X - 16, height: ROW_H, display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 700, lineHeight: 1.18, color: i === 1 ? '#6ee7b7' : '#fcd34d', opacity: progress(frame, noteAt[i], 14) }}>
                {notes[i]}
              </div>
            </div>
          </Reveal>
        </div>
      ))}

      {/* what decides the job, then the action */}
      <Reveal frame={frame} at={crit - 6} outAt={act - 8} x={0} y={ROW_Y(2) + ROW_H + 26}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Pill icon="x" tone="muted" size={30} strike>un nombre bonito</Pill>
          <Pill icon="target" tone="cyan" size={30}>objetivo</Pill>
          <Pill icon="check" tone="sky" size={30}>requisitos</Pill>
          <Pill icon="chart" tone="emerald" size={30}>resultados</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={act} x={0} y={ROW_Y(2) + ROW_H + 26}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Pill icon="search" tone="sky" size={30}>investigar candidatos</Pill>
          <Pill icon="x" tone="rose" size={30}>bloquear automáticamente</Pill>
          <Pill icon="flag" tone="muted" size={30} style={{ opacity: progress(frame, w('s05-06', 'acción'), 12) }}>la acción prevista va en la entrega</Pill>
        </div>
      </Reveal>

      {/* footer: cases and corpus hash (conceptual bar, no value) */}
      <Reveal frame={frame} at={at('s05-01') + 150} x={0} y={600}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: FONT.sans, fontSize: 28, fontWeight: 650, color: C.muted }}>
          <Tag tone={C.sky} size={26}>corpus</Tag>
          <span>12 casos</span>
          <span style={{ color: C.faint }}>·</span>
          <span>hash del corpus</span>
          <div style={{ width: 240, height: 22, borderRadius: 11, background: `repeating-linear-gradient(90deg, ${C.ink600} 0 14px, ${C.ink700} 14px 24px)` }} />
          <span style={{ color: C.faint }}>·</span>
          <span>alcance ALRTDEMO v1</span>
        </div>
      </Reveal>
    </Stage>
  );
}
